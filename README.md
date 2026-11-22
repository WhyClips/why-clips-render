# why-clips-render

Render pipeline for **Why Clips** YouTube Shorts: animated true stories with a
twist, made with Remotion 4 and rendered on GitHub Actions.

## This repo

- `src/` — the Remotion project. Composition `IslandShort` (73 s, 2190 frames
  at 30 fps): "The Island That Disappeared From Maps" (Sandy Island), in the
  channel's Gullak-style chibi 2D cut-out look (pure SVG/DOM, no WebGL).
- `audio/` — narration (`voiceover.mp3`) and music/SFX bed (`music_sfx.wav`).
- `.github/workflows/render.yml` — renders the video in 4 parallel chunks on
  Actions runners at full 1080x1920, then concats and mixes the audio.
  Trigger it from the Actions tab ("Render Island Short" > Run workflow).
  The final MP4 is the `island-full-quality-github` artifact.

The earlier Henry "Box" Brown project lives in git history (commit e3db335);
its render workflow was replaced by the Island one.

## Local render

```text
npm ci
npx remotion browser ensure
npx remotion render src/index.ts IslandShort out/video.mp4 --codec h264 --crf 16 --scale 1
```

All scripts, narration and visuals in this repo are original. The animation
engine is Remotion (MIT licensed).
