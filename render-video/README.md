# Aseva Lobby Loop — Video Export

One command. An MP4 pops out. That's the deal.

This tool renders `Aseva Lobby Loop.html` to a pristine 1920×1080 MP4 by driving a headless Chromium frame-by-frame and stitching the PNGs with `ffmpeg`. No screen recording, no framerate jitter, no compressed fonts.

---

## What you're getting

- **Resolution:** 1920×1080
- **Framerate:** 60 fps (configurable)
- **Duration:** 172 seconds (one full loop — matches the `TOTAL` constant in the HTML)
- **Codec:** H.264, yuv420p, CRF 16 (near-lossless, plays on anything)
- **Output file:** `aseva-lobby-loop.mp4` (~200–400 MB depending on fps)

Render time on a modern laptop: ~8–15 minutes for a 172-second loop at 60 fps. Longer than real-time because every frame is a full DOM screenshot, but the quality is the payoff.

---

## Prerequisites

1. **Node.js 18+** — `node --version`
2. **ffmpeg** — `ffmpeg -version`
   - macOS: `brew install ffmpeg`
   - Ubuntu/Debian: `sudo apt install ffmpeg`
   - Windows: `winget install ffmpeg` or download from ffmpeg.org

That's it. No Docker, no Python, no venvs.

---

## Install

From inside the `render-video/` folder:

```bash
npm install
```

This pulls down Puppeteer (which bundles its own Chromium). First install is ~200 MB; after that it's cached.

---

## Run

From the **project root** (the folder that contains `Aseva Lobby Loop.html`):

```bash
node render-video/render.js
```

That's the whole command. It will:

1. Spin up a headless Chromium at exactly 1920×1080
2. Load `Aseva Lobby Loop.html` via a local static server
3. Wait for the React app to mount and expose `window.__renderBridge`
4. Step through `0 → 172` seconds at 1/60 increments, screenshotting each frame into `render-video/frames/`
5. Invoke ffmpeg to stitch `frames/*.png` into `aseva-lobby-loop.mp4`
6. Delete the frames folder
7. Exit

You'll see progress like:

```
[render] serving project at http://127.0.0.1:5173
[render] browser ready — duration=172s, fps=60, total frames=10320
[render] frame 1/10320  (0.02s)
[render] frame 2/10320  (0.03s)
...
[render] all frames captured in 11m 42s
[ffmpeg] encoding aseva-lobby-loop.mp4 ...
[ffmpeg] done. 287 MB
[render] ✓ complete → aseva-lobby-loop.mp4
```

---

## Options

All optional. Pass as CLI flags:

```bash
node render-video/render.js --fps 30 --out lobby-30fps.mp4
node render-video/render.js --start 60 --end 90           # render a 30s excerpt
node render-video/render.js --scale 0.5                   # half-res preview (960×540)
node render-video/render.js --html "Aseva Lobby Loop.html"
```

| Flag      | Default                    | What it does |
|-----------|----------------------------|--------------|
| `--fps`   | 60                         | Output framerate. 30 halves the render time. |
| `--out`   | `aseva-lobby-loop.mp4`     | Output filename (written to project root). |
| `--start` | 0                          | Start time in seconds. |
| `--end`   | (reads from Stage)         | End time in seconds. Defaults to the full loop length. |
| `--scale` | 1                          | Viewport scale. 0.5 = 960×540, faster + smaller file. |
| `--html`  | `Aseva Lobby Loop.html`    | Which HTML file to render. |
| `--crf`   | 16                         | ffmpeg quality (lower = better, 0–51). 16 is near-lossless. 23 is "good enough." |
| `--keep-frames` | (off)                | Don't delete PNG frames after encoding. Useful for debugging. |

---

## Troubleshooting

**"window.__renderBridge never appeared"**
The HTML didn't finish booting. Usually means React/Babel failed to load. Open the HTML in a normal browser and check the console. The render script waits up to 30s for the bridge; if your machine is slow, increase `BRIDGE_TIMEOUT_MS` in `render.js`.

**"ffmpeg: command not found"**
Install ffmpeg (see Prerequisites). The script shells out to the system `ffmpeg`; it does not bundle its own.

**Output file is huge (>1 GB)**
You're probably at CRF 0 or similar. Bump `--crf 20` and it'll shrink 3–4× with no visible quality loss.

**Colors look slightly off vs. the browser**
That's yuv420p chroma subsampling — standard for MP4. If you need full color fidelity, change `-pix_fmt yuv420p` to `-pix_fmt yuv444p` in `render.js` (not all players support it).

**Fonts look wrong**
The HTML uses Google Fonts loaded over the network. If you run this offline, fonts fall back. Run it online the first time, or vendor the fonts locally.

**Want to render a different HTML file**
Pass `--html "path/to/your.html"`. The tool assumes that file uses the same `<Stage>` component from `animations.jsx` and therefore exposes `window.__renderBridge`. Any other animation system won't work without adapting the bridge protocol.

---

## How it works (if you care)

The core trick: `<Stage>` in `animations.jsx` exposes a render bridge on `window`:

```js
window.__renderBridge = {
  seek: (t) => /* sets time, pauses playback */,
  pause: () => /* pauses */,
  getDuration: () => /* returns total seconds */,
  getSize: () => /* returns {width, height} */,
};
```

Puppeteer calls `seek(0)`, screenshots. Calls `seek(1/60)`, screenshots. Repeat 10,320 times. Because we're not relying on real-time playback, there's zero framerate drift — every frame is exactly where it should be.

The only non-obvious bit is **frame settle time**: after seeking, we wait ~2 requestAnimationFrames so React can commit and the browser can paint. Without that wait, you get the previous frame's pixels. The script handles this for you.

---

## One more thing

If all you need is a file to play on a lobby TV and the TV can run a browser, **you don't need this at all.** Point the TV's browser at `Aseva Lobby Loop.html` in fullscreen/kiosk mode — it'll play forever at native quality with no recompression. Use the MP4 path when you need a file for upload, email, or a display that only takes video input.
