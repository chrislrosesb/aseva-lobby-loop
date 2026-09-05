#!/usr/bin/env node
/**
 * Aseva Lobby Loop → MP4 renderer.
 *
 * Drives the Stage component in `animations.jsx` frame-by-frame via the
 * `window.__renderBridge` hook, screenshots each frame, then stitches
 * with ffmpeg. See README.md for usage.
 */

import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import puppeteer from 'puppeteer';
import sirv from 'sirv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ── Arg parsing ─────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = argv[i + 1];
  if (v === undefined || v.startsWith('--')) return true; // boolean flag
  return v;
};

const HTML_FILE   = getArg('html', 'Aseva Lobby Loop.html');
const FPS         = Number(getArg('fps', 60));
const OUT_NAME    = getArg('out', 'aseva-lobby-loop.mp4');
const START_T     = Number(getArg('start', 0));
const END_T_RAW   = getArg('end', null);
const SCALE       = Number(getArg('scale', 1));
const CRF         = Number(getArg('crf', 16));
const KEEP_FRAMES = getArg('keep-frames', false) === true;

const BASE_W = 1920;
const BASE_H = 1080;
const VIEW_W = Math.round(BASE_W * SCALE);
const VIEW_H = Math.round(BASE_H * SCALE);

const FRAMES_DIR = path.join(__dirname, 'frames');
const OUT_PATH   = path.join(PROJECT_ROOT, OUT_NAME);
const BRIDGE_TIMEOUT_MS = 30_000;

// ── Static server ───────────────────────────────────────────────────────────

function startServer(root) {
  return new Promise((resolve) => {
    const handler = sirv(root, { dev: true, etag: false });
    const server = createServer((req, res) => handler(req, res));
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, url: `http://127.0.0.1:${port}` });
    });
  });
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const pad = (n, w) => String(n).padStart(w, '0');

function fmtSecs(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}m ${pad(r, 2)}s`;
}

async function ensureFfmpeg() {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', ['-version']);
    p.on('error', () => reject(new Error(
      'ffmpeg not found on PATH. Install it first:\n' +
      '  macOS:  brew install ffmpeg\n' +
      '  Ubuntu: sudo apt install ffmpeg\n' +
      '  Windows: winget install ffmpeg'
    )));
    p.on('exit', (code) => code === 0 ? resolve() : reject(new Error('ffmpeg broken')));
  });
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const p = spawn('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
    p.on('error', reject);
    p.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)));
  });
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // Sanity checks
  if (!existsSync(path.join(PROJECT_ROOT, HTML_FILE))) {
    throw new Error(`HTML file not found: ${path.join(PROJECT_ROOT, HTML_FILE)}
Run this from the project root, or pass --html "path/to/file.html".`);
  }
  await ensureFfmpeg();

  // Fresh frames dir
  await rm(FRAMES_DIR, { recursive: true, force: true });
  await mkdir(FRAMES_DIR, { recursive: true });

  // Static server so relative imports (scenes/, animations.jsx, assets/) resolve
  const { server, url: baseUrl } = await startServer(PROJECT_ROOT);
  console.log(`[render] serving project at ${baseUrl}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none',
      '--disable-web-security',
      `--window-size=${VIEW_W},${VIEW_H}`,
    ],
    defaultViewport: { width: VIEW_W, height: VIEW_H, deviceScaleFactor: 1 },
  });

  try {
    const page = await browser.newPage();

    // Forward browser console to our stdout for debugging
    page.on('pageerror', (err) => console.error('[page error]', err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`[page ${msg.type()}]`, msg.text());
      }
    });

    // Clear any stored playhead so we start at exactly --start
    await page.evaluateOnNewDocument(() => {
      try { localStorage.clear(); } catch {}
    });

    const pageUrl = `${baseUrl}/${encodeURIComponent(HTML_FILE)}`;
    await page.goto(pageUrl, { waitUntil: 'networkidle0', timeout: 60_000 });

    // Wait for Stage to mount and expose the render bridge
    await page.waitForFunction(
      () => window.__renderBridge && typeof window.__renderBridge.seek === 'function',
      { timeout: BRIDGE_TIMEOUT_MS }
    );

    const { duration: stageDur, size } = await page.evaluate(() => ({
      duration: window.__renderBridge.getDuration(),
      size: window.__renderBridge.getSize(),
    }));

    const END_T = END_T_RAW != null ? Number(END_T_RAW) : stageDur;
    const totalSecs = Math.max(0, END_T - START_T);
    const totalFrames = Math.round(totalSecs * FPS);

    console.log(
      `[render] browser ready — stage=${size.width}×${size.height}, ` +
      `viewport=${VIEW_W}×${VIEW_H}, duration=${stageDur}s, ` +
      `window=${START_T}→${END_T}s, fps=${FPS}, total frames=${totalFrames}`
    );

    // Pause before we start — then step deterministically
    await page.evaluate(() => window.__renderBridge.pause());

    const t0 = Date.now();
    for (let i = 0; i < totalFrames; i++) {
      const t = START_T + (i / FPS);

      await page.evaluate((tt) => window.__renderBridge.seek(tt), t);

      // Let React commit + browser paint (2 rAFs). This is the magic that
      // prevents seeing the previous frame's pixels.
      await page.evaluate(() => new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }));

      const framePath = path.join(FRAMES_DIR, `f_${pad(i, 6)}.png`);
      await page.screenshot({ path: framePath, type: 'png', omitBackground: false });

      // Progress: every 30 frames (or final frame)
      if (i % 30 === 0 || i === totalFrames - 1) {
        const pct = ((i + 1) / totalFrames * 100).toFixed(1);
        const elapsed = (Date.now() - t0) / 1000;
        const eta = elapsed * (totalFrames - i - 1) / Math.max(1, i + 1);
        process.stdout.write(
          `\r[render] frame ${i + 1}/${totalFrames}  ` +
          `(${pct}%, elapsed ${fmtSecs(elapsed)}, eta ${fmtSecs(eta)})   `
        );
      }
    }
    process.stdout.write('\n');

    const elapsed = (Date.now() - t0) / 1000;
    console.log(`[render] all frames captured in ${fmtSecs(elapsed)}`);
  } finally {
    await browser.close();
    server.close();
  }

  // Encode with ffmpeg
  console.log(`[ffmpeg] encoding ${OUT_NAME} ...`);
  await runFfmpeg([
    '-y',
    '-framerate', String(FPS),
    '-i', path.join(FRAMES_DIR, 'f_%06d.png'),
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', String(CRF),
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    OUT_PATH,
  ]);

  const { size: outBytes } = await stat(OUT_PATH);
  const mb = (outBytes / 1024 / 1024).toFixed(1);
  console.log(`[ffmpeg] done. ${mb} MB`);

  if (!KEEP_FRAMES) {
    await rm(FRAMES_DIR, { recursive: true, force: true });
  }

  console.log(`[render] ✓ complete → ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('\n[render] FAILED:', err.message);
  process.exit(1);
});
