# Handoff: Render `Aseva Lobby Loop.html` to MP4

## Also: push this project to GitHub

If the user asks to push this project to GitHub:

1. Create `.gitignore` at the project root:
   ```
   node_modules/
   render-video/frames/
   *.mp4
   ```
2. `git init`, commit everything, create a private repo (suggested name: `aseva-lobby-loop`) with `gh repo create aseva-lobby-loop --private --source=. --push` (or ask the user for their preferred name/visibility first).
3. Done — no build step needed; the HTML files run as-is.

---

Hi Claude Code — this project contains an animated HTML lobby-display loop and a ready-to-run tool to render it to an MP4. Your job:

1. **Download this project** to the user's local machine (they'll hand you the export).
2. **Get the render tool running** and produce `aseva-lobby-loop.mp4` at the project root.

Everything you need is already here. Do not rebuild anything from scratch.

---

## What to do (summary)

```bash
# from the project root:
cd render-video
npm install
cd ..
node render-video/render.js
```

One command produces `aseva-lobby-loop.mp4` at the project root. It will take ~10–15 minutes for a 172-second 60fps render.

The full spec, options, and troubleshooting are in `render-video/README.md`. **Read that file before running anything** — it's the source of truth.

---

## What the tool does

- Spins up headless Chromium at 1920×1080
- Loads `Aseva Lobby Loop.html` via a local static server
- Calls `window.__renderBridge.seek(t)` to deterministically advance the animation one frame at a time
- Screenshots each frame as PNG (`render-video/frames/f_000000.png`, etc.)
- Stitches frames with ffmpeg → `aseva-lobby-loop.mp4`
- Cleans up the frames folder

The render bridge is hooked into the `<Stage>` component in `animations.jsx` (the effect block that sets `window.__renderBridge`). Don't remove it.

---

## Prerequisites the user needs

Check for these before running. If missing, tell the user to install them:

- **Node.js 18+** → `node --version`
- **ffmpeg** on `$PATH` → `ffmpeg -version`
  - macOS: `brew install ffmpeg`
  - Windows: `winget install ffmpeg`
  - Linux: `sudo apt install ffmpeg`

---

## Expected output

```
render-video/
  node_modules/          (created by npm install)
  render.js
  package.json
  README.md
  .gitignore

aseva-lobby-loop.mp4     ← the deliverable (project root)
```

File size will be ~200–400 MB at default settings (60fps, CRF 16). If the user wants something smaller for email/upload, re-run with `--fps 30 --crf 20`, which gets it under 100 MB with no meaningful quality loss for a lobby display.

---

## Common things the user may ask for

| Ask | Command |
|---|---|
| "Smaller file" | `node render-video/render.js --fps 30 --crf 23` |
| "Just a 30-second preview" | `node render-video/render.js --start 0 --end 30` |
| "Half resolution (quick test)" | `node render-video/render.js --scale 0.5` |
| "Render a different scene only" | Look up the scene's start/end in `Aseva Lobby Loop.html` under the `SCHEDULE` array, then use `--start` / `--end`. |

---

## If something breaks

**Bridge never appears (`window.__renderBridge never appeared`):**
Open `Aseva Lobby Loop.html` in a normal browser. If it works there, something in Puppeteer's environment is off — usually a missing font CDN. Check page console logs in `render.js` output. If fonts fail to load, run the user online or vendor Google Fonts locally.

**Frames look blank or stuck on first frame:**
The 2-rAF wait after `seek()` isn't enough on slow machines. In `render.js`, change the frame-settle block from 2 rAFs to 3 or add a `await page.evaluate(() => new Promise(r => setTimeout(r, 16)))`.

**ffmpeg errors on missing frames:**
A screenshot failed silently mid-render. Check the `frames/` folder — if frame counts don't match, re-run with `--keep-frames` and inspect what's there.

---

## What NOT to do

- ❌ Don't modify `Aseva Lobby Loop.html`, `animations.jsx`, or anything in `scenes/` — they're the finished product.
- ❌ Don't try to record the screen instead — this tool produces much higher quality output.
- ❌ Don't swap Puppeteer for Playwright "because it's nicer" — Puppeteer's bundled Chromium is the tested config.
- ❌ Don't add a Docker wrapper or CI config unless the user asks. Keep it one command.

---

When `aseva-lobby-loop.mp4` exists at the project root and plays cleanly in QuickTime/VLC, you're done.
