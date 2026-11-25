# TherealWhy Template

Reusable Remotion + three.js template for Why Clips Shorts, built to match
@TheRealWhy-1's look: flat 2D bean-head characters in a painted 3D world,
word-timed karaoke captions, in-scene numbers, 4+ locations per video.

## What is in here

- `src/story.ts` — 5 demo shots x 180 frames (30 s @ 30 fps) across 5 sets.
- `src/worlds.ts` — the 5 reusable sets: street, interior room, office,
  exterior building, workshop. Painted Canvas2D textures, directional sun,
  contact shadows, fog at the horizon. Kenney CC0 props in
  `public/bridge/kenney/` (15 of the 26 skill names exist there; the other 11
  are code-built fallbacks in `worlds.ts`).
- `src/stage.ts` — characters per set (person/blob/lidAt from the skill's cast).
- `src/numbers.tsx` — in-scene floating numbers (gold/white, billboarded,
  dark pill behind the sub-label so white text stays readable on sky).
- `src/captions.tsx` — 1-2 words per caption, ~3% of frame height,
  bottom-centre, white bold + black outline; the bottom 12% band is kept
  clear of characters/props by construction (cameras frame feet above 80%).
- `src/Template.tsx` — post chain ink -> lens blur -> bloom -> NEUTRAL tone
  map -> grade, MSAA 4. Driven MANUALLY with the raw postprocessing API:
  the @react-three/postprocessing React wrapper renders blank/black under
  headless SwiftShader; the raw library works. Bloom uses
  `BlendFunction.SCREEN` (the literal 3 is COLOR in postprocessing v6 and
  desaturates the whole image to grey).
- `src/bridge/` — the cartoon-3d-short skill's bridge files, adapted
  (build.ts: town dropped, setSight() added; cast.ts: cut at "// crowd by shot").

## Render (resumable, chunked)

Danish pipeline fact: the full composer costs ~16 s/frame, so a 60 s video
(~2,000 frames) is 5-6 h on one machine. Never re-render a finished frame:

```bash
# one chunk of four (each chunk resumes from its manifest)
node scripts/render-chunk.mjs --comp TemplateShort --frames 0-1799 --chunk 0/4 --out out/frames
node scripts/verify-manifest.mjs --manifest out/frames/manifest.json --frames 0-1799
./scripts/assemble.sh --frames out/frames --manifest out/frames/manifest.json \
  --vo audio/vo.mp3 --music audio/bed.mp3 --out out/final.mp4
```

- `scripts/render-chunk.mjs` — renders a chunk as PNG frames, records every
  finished frame (sha1) in `out/frames/manifest.json`; re-running skips done
  frames. Proven invocation: concurrency 1, `--gl angle` with
  `--chromium-flags '{"enable-unsafe-swiftshader":true}'`, 180 s timeout.
- `scripts/assemble.sh` — ffmpeg: frames + VO + music bed at -6 dB
  (volume=0.5) mixed, loudnorm to -14 LUFS, libx264 crf 18, 1080x1920 30 fps.
  Captions are burned into the frames by the composition. NO watermark.

## GitHub Actions

- `.github/workflows/render-template-smoke.yml` — 30-frame smoke test, measures
  the composer's per-frame cost on the runner.
- `.github/workflows/render-chunks.yml` — 4 parallel chunk jobs + a merge and
  assemble job (dispatch with `comp`, `frames`, optional `vo_path`/`music_path`).

## Notes

- Full write-up: `TEMPLATE-NOTES.md` (in the local project, not pushed yet).
- Stills QA: all 5 sets + a prop-heavy caption-collision frame pass the
  caption-band check (`caption_band_qa.py`); side-by-side sheet vs TheRealWhy
  reference frames in `out/sbs-sheet.jpg`.
- Disk rule: TEMP/TMPDIR point at `../remotion-tmp`; clean
  `remotion-webpack-bundle-*` after each render.
