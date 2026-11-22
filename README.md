# why-clips-render

Render pipeline for **Why Clips** YouTube Shorts: animated true stories with a
twist, made with Remotion 4 + three.js and rendered on GitHub Actions.

## This repo

- `src/` — the Remotion project. Composition `HenryShort` (66 s, 1992 frames
  at 30 fps): the Henry "Box" Brown story, the channel's first demo Short.
- `audio/` — narration (`voiceover.mp3`) and music/SFX bed (`music_sfx.wav`).
- `.github/workflows/render.yml` — renders the video in 4 parallel chunks on
  Actions runners (CPU-only, SwiftShader), then concats, upscales to
  1080x1920 and mixes the audio. Trigger it from the Actions tab
  ("Render Henry Short" > Run workflow). The final MP4 is the
  `henry-box-brown-full-quality` artifact.

## Local render

```text
npm ci
npx remotion browser ensure
npx remotion render src/index.ts HenryShort out/video.mp4 --codec h264 --crf 16 --scale 0.25 --props '{"post":{"dpr":1,"msaa":0,"lens":false,"bloom":false}}'
```

All scripts, narration and visuals in this repo are original. The animation
engine is Remotion + three.js (MIT licensed).
