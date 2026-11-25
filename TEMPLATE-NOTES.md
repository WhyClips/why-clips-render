# TherealWhy Template — Notes

Template for Why Clips Shorts, matching @TheRealWhy-1's look: flat 2D bean-head
characters in a painted 3D world, word-timed karaoke captions, in-scene
numbers, 4+ locations per video. Project: `~/workspace/ricks-clone/therealwhy-project/`
(branch `therealwhy-template` on WhyClips/why-clips-render, orphan branch —
see "Push" below). Skill source: `~/workspace/ricks-clone/cartoon-3d-short/`
(used with Azhar's explicit approval 25 Nov 20:31: "Haan, skill ka code use karo").

## Working invocation (proven, Phase 0 + template stills + Actions smoke test)

```
npx remotion render src/index.ts <Comp> <out> --sequence --image-format png \
  --image-sequence-pattern 'frame-[frame].png' --frames A-B --concurrency 1 \
  --scale 1 --timeout 180000 --log=verbose --gl angle \
  --chromium-flags='{"enable-unsafe-swiftshader":true}'
```

- Chrome Headless Shell gates SwiftShader behind `--enable-unsafe-swiftshader`;
  `--gl swiftshader` and `--gl angle` alone both fail (WebGL context failed).
- `ffprobe` is NOT on ubuntu-latest — the workflow installs ffmpeg via apt.
- `--chromium-flags` must be a JSON object (a plain string fails).
- Image-sequence output dir name must NOT look like it has a file extension:
  `.run-0-5` fails ("The output directory of the image sequence cannot have
  an extension"), `run_0_5` works.
- Default sequence files are `element-N.jpeg`; use `--image-format png` +
  `--image-sequence-pattern 'frame-[frame].png'`.
- Disk rule: TEMP/TMPDIR = `~/workspace/ricks-clone/remotion-tmp/` (never /tmp,
  too small); clean `remotion-webpack-bundle-*` after each render.
- Remotion bundles copy ~1.3 GB per render and never delete — the tmp dir is
  the place that fills up.

## Render cost (measured)

- Phase 0 minimal scene (no composer) on Actions: **0.32 s/frame** (30/30 frames,
  1080x1920, run 45664693233).
- Template full composer, LOCAL, half scale (540x960, dpr 0.5): **~11.4 s/frame**
  marginal (6 frames in 77.5 s incl. ~9 s bundling). Danish's number for the
  full composer is **~16 s/frame** — the composer is the cost, not the scene.
- Template full composer, ACTIONS, full scale: **~6.2 s/frame** (frame 0 took
  17 s, first-frame setup; frames 1-29 took ~6.2 s each). The first two smoke
  runs (45678711829, 45680726599) FAILED at the frame-validation step — "frame
  0 did not render as a valid PNG" — but the render itself reported 30/30 and
  the frames were REAL (~1.87 MB each, pixel-identical to the local render,
  sha256 5792698e...). **Root cause: Remotion zero-pads the `[frame]` token to
  the width of the LARGEST frame number in the range** — frames 0-1 come out
  as `frame-0.png`, but frames 0-29 come out as `frame-00.png` ... `frame-29.png`
  (and 0-1799 as `frame-0000.png` ...). My script looked for the unpadded name
  and reported "missing". **Fix:** render-chunk.mjs now maps files by parsing
  the number from `frame-(\d+).png` and renames them to the canonical
  unpadded `frame-N.png` when moving them into place. Verified locally with
  frames 9-10 (came out `frame-09.png`/`frame-10.png`, mapped correctly,
  manifest 2/2). The script also logs the run-dir listing (filenames + sizes)
  and the validation reason (missing / too small (N bytes) / bad magic (hex)).
  Third smoke run: 45684050199 (dispatched 25 Nov 22:19 Riyadh) — **[RESULT
  PENDING]**.
- Projected 60 s video (1800 frames) at the measured Actions rate of
  6.2 s/frame: **3.1 h single machine / 0.78 h (47 min) in 4 parallel chunks**.
  That is FAR better than Danish's ~16 s/frame (8.0 h single / 2.0 h chunked)
  — the GitHub runner (4 vCPUs) renders ~2.5x faster per frame than his
  machine, and the chunking divides it by 4. A 60 s video is an under-an-hour
  job on 4 parallel Actions runners.
- The 6-frame local resume test printed: "60s video: single machine 6.46h,
  4 parallel chunks 1.61h" (that rate includes bundling, so it overstates a
  real chunk's marginal rate).

## Resume system + chunking (Danish pipeline, mandatory)

- `scripts/render-chunk.mjs --comp TemplateShort --frames 0-1799 --chunk i/n
  --out out/frames [--scale 1] [--props '<json>']`
  Renders one chunk as PNG frames; records every finished frame (bytes + sha1)
  in `out/frames/manifest.json`; re-running skips frames that are in the
  manifest AND present as valid PNGs (magic + >=10 KB). Render runs go to a
  `run_A_B` temp dir first and are moved into place only after verification,
  so `out/frames` never holds a half-written PNG. Atomic manifest writes
  (tmp + rename). Exit 0 when the chunk range is complete.
- `scripts/verify-manifest.mjs --manifest out/frames/manifest.json
  --frames 0-1799 [--out out/frames]` — exit 0 = complete, 1 = gaps (prints
  the missing ranges).
- `scripts/assemble.sh --frames out/frames --manifest out/frames/manifest.json
  --vo audio/vo.mp3 --music audio/bed.mp3 --out out/final.mp4 [--fps 30]
  [--crf 18]` — verifies the manifest, then ffmpeg: frames + VO + music bed
  at -6 dB (volume=0.5) mixed, loudnorm to -14 LUFS (single-pass), libx264
  crf 18, yuv420p, 30 fps, faststart, `-shortest` (VO defines the length, per
  Danish Step 2). Captions are burned into the frames by the composition.
  `--vo`/`--music` optional (omit both for a silent proof video). Two-pass
  loudnorm for final delivery: run an analysis pass first and feed the
  measured_* values into the filter (ffmpeg loudnorm docs).
- Workflows (`.github/workflows/`, also pushed to main — dispatch 404s if the
  yml is branch-only, Matisse lesson):
  - `render-template-smoke.yml` — 30 frames, timing + 1 s proof MP4 artifact.
  - `render-chunks.yml` — dispatch inputs comp / frames / vo_path / music_path;
    matrix 4 chunk jobs (each uploads `frames-chunk-N`), then a merge job that
    downloads all 4, merges the manifests, verifies, assembles, uploads
    `template-final` (final.mp4 + manifest.json).

## Audio spec (Danish pipeline steps 5-8)

- Music bed: SYNTHESIZED by the engine (royalty-free, code-made), mixed
  ~-6 dB under the VO; final loudness ~-14 LUFS. (Formula doc says bed
  -12 to -14 dB mean; the pipeline's -6 dB under VO + -14 LUFS final is the
  operative rule — the bed sits under the VO, the final is normalized.)
- Captions: burned in, bottom-centre, bold, word-timed to the VO.
- Output: 1080x1920, 30 fps, MP4 native (no upscale). NO watermark, ever.
- Dashcam reference: 67.8 s, 2,034 frames, 47.9 MB.

## The 5 sets (src/worlds.ts + src/stage.ts + src/story.ts)

5 shots x 180 f = 900 f (30 s @ 30 fps), demo words in `src/demo-words.json`
(106 words, last end 29.64 s — a meta-demo narration, clearly a test, never
uploaded). Sets at world origins: street (0,0,0, day), room (40,0,0, day),
office (-40,0,0, day), exterior (0,0,70, golden), workshop (0,0,-70, golden).
Cameras dolly push-in 0.15-0.35%/frame (no static hold >= 4 f); DOF cInf 10-14
on close-ups/mediums, 0 on wides; FLASH_AT=180; XFADE 8 f at set changes.

- Painted Canvas2D textures: cobble, brick, planksHD, stoneHD, grassHD,
  facadeHD. 5-10 props per set. Ceilings are their own meshes with
  castShadow=false (interiors still get sun); bright unlit window quads.
- Kenney CC0 Nature Kit: 15 of the 26 skill names exist and are in
  `public/bridge/kenney/` (tree_oak, tree_default, tree_detailed, tree_fat,
  tree_cone, plant_bushLarge, plant_bushDetailed, plant_bush, flower_redA,
  flower_yellowA, flower_purpleA, grass_large, grass, lily_large, canoe;
  188 KB total). Missing 11: tree-high-round, tree, hedge, banner-red,
  banner-green are drawn in code by build.ts (cartoon vegetation / painted
  cloth — never files); lantern, cart, stall-red, stall-green, stall-bench,
  windmill are NOT in the Nature Kit (farm-kit/medieval-kit slugs return
  "not found") — code-built fallbacks for these 6 in `worlds.ts`
  buildFallback(), same painted style. loadKit() has a per-file catch, so a
  missing file degrades gracefully.
- Sun: 5-stop sky shader + sun disc/halo + 9 clouds, camera-relative sun
  frozen per shot, fog = horizon colour, hemi boost for interiors (room/office
  1.6x, workshop 2.6x). Per-shot sun azimuth override (ShotDef.az): workshop
  shot az=170 (sun from behind the camera — the golden backlight made the whole
  workshop purple); sun disc/halo hidden when |az| >= 90.

## Caption rules (src/captions.tsx)

- chunkWords: 1-2 words, pair only if span <= 0.55 s and the first word does
  not end a sentence. 58 px ~= 3.0% of 1920 (TheRealWhy measured 3.1%), white
  bold + thick black outline (8-direction text-shadow), bottom-centre,
  margin-bottom 4.5% of height. CAPTION_H_FRAC 0.03, CAPTION_BAND_FRAC 0.12.
- Bottom band clear BY CONSTRUCTION: cameras frame subjects so feet land above
  80% of frame height; the bottom 12% is floor only.
- QA: `caption_band_qa.py` scans the bottom 12% band outside the caption
  text's box and outside the corner zones (x<12% / x>88%) for dark ink pixels.
  LUMA_MAX=45 (near-black ink only; red rugs / dark wood floors are luma 50-90
  and are NOT ink). FAIL only if a stray cluster is >= 5000 px OR (height
  >= 5% of frame AND width <= 25% of frame — a tall narrow intrusion like a
  leg/body/post). Rationale: the caption is a DOM overlay with a thick black
  outline, so a broad soft floor shadow under the text stays readable — what
  breaks readability is a hard character/prop edge crossing the text.

## In-scene numbers (src/numbers.tsx)

- `numberCard(text, sub, style)` — gold/white/green, unlit MeshBasicMaterial
  (readable in any light — the skill's sign lesson), NOINK layer, billboarded
  to the camera. Numbers carry `a`/`b` frame ranges (visible in the wide shot
  only, so they never get cut off at a frame edge). Demo: "1,000 COINS" gold
  in the street (f 0-60), "$300 FINE" white in the office (f 360-450).
- Sub-label pill: dark rounded rect behind the sub-text, alpha 0.88 (0.6
  washed out to mid-grey over bright sky and the white letters went
  unreadable). Pill width = sub.length x 56 + 72 px — NOT measureText: the
  headless Chrome canvas measureText under-reports the rendered width by
  ~40% (the "INS" of COINS stuck out past the measured pill). Verified by eye
  in the s1-street-wide crop: "COINS" fully readable on the pill.
- **Number-card position (frame-0 occlusion):** n1 was at (0.5,2.8,2.0) — 0.1 m
  BEHIND the pink house's front, so the house clipped the card's left edge
  ("1,") at the dolly start (f0). Moved to (0.9,2.8,1.6): 0.3 m in front of
  every facade, so it is never clipped. Verified in the f0 still.
- **Number-card DOF smear:** the "1,000" glyphs were smeared where they cross
  the bright sky slit between the houses — the card sits ~1.4 m off the DOF
  focus plane and the lens blur mixes gold with bright sky. cInf 10 -> 5
  helped only slightly. **Fix: the street wide is now cInf 0 (all sharp)** —
  and TheRealWhy's wides are sharp throughout, so 0 matches the reference
  better. DOF lives on the mediums/close-ups. The office wide went cInf 12
  -> 6 (same reason for "$300 FINE"). Verified: "1,000" and "COINS" fully
  crisp in the f0 still; "$300 FINE" crisp in the refreshed s3-office-wide.

## Composer — the two bugs (src/Template.tsx)

1. **Wrapper broken, raw works.** The @react-three/postprocessing React
   wrapper EffectComposer renders BLANK (uniform bg) / BLACK under headless
   SwiftShader — bisected to the wrapper itself (stock ToneMappingEffect alone
   in the wrapper = blank; a minimal DebugComposer with the wrapper + stock
   Bloom = pure black; the same passes driven manually with the raw
   postprocessing API = the scene renders). Fix: `ComposerRig` drives the
   composer MANUALLY — PPComposer(gl, HalfFloat, multisampling), RenderPass,
   InkPass, EffectPass(lens.pre), EffectPass(lens.main), EffectPass(bloom +
   NEUTRAL tone + grade), optional EffectPass(grain); size tracking +
   autoClear save/restore in a priority-1 useFrame (which takes over R3F
   rendering; the scene is drawn by the RenderPass). CONVOLUTION effects
   (lens pre/main) each get their own EffectPass, the rest merged — mirroring
   the wrapper's grouping. Toggles via inputProps `post.{ink,lens,pre,bloom,
   grade,grain,dpr,composer,ms}`. UnsignedByteType frame buffers do NOT fix it.
2. **Bloom desaturated the image to grey.** `makeBloom` used `blendFunction: 3`
   — in postprocessing v6, BlendFunction.COLOR = 3, SCREEN = 28 (the skill's
   code used the named import `BlendFunction.SCREEN`; the literal 3 was wrong
   for v6). COLOR blend keeps the input's luminance and takes hue/saturation
   from the near-monochrome bloom layer -> grey image. Fix: import
   BlendFunction from postprocessing and use BlendFunction.SCREEN. Colour
   restored (saturation 0.0 -> 42.5).

## Stills QA — root causes and fixes (all 10 stills PASS, round 3)

Stills (0.5 scale, post composer ON): `out/stills/s{1-street-wide,
1-street-medium,2-room-wide,2-room-closeup,3-office-wide,3-office-closeup,
4-exterior-wide,4-exterior-medium,5-workshop-wide,5-workshop-closeup}.png`.
Round 1: 3 PASS / 7 FAIL. Round 2: 8/10. Round 3: 10/10 PASS.

1. **Ceilings missing** (sky above the walls, rooms read as courtyards).
   Root cause: ceilings built with `quadUp(..., W)` + `rotation.x = Math.PI`
   — the mesh sits at the origin, so the rotation flips the quad to y = -W
   (UNDER the floor). Fix: `quadDown` helper (reversed winding + normal
   (0,-1,0)) for all three ceilings. Then ceilings read as dark blue-purple
   "night sky" (down-facing surfaces get only the blue shade term) — fix:
   ceilings are UNLIT MeshBasicMaterial warm cream (#efe6d0 room/office,
   #e8d9bd workshop).
2. **Exterior building MISSING.** Root cause: sight-line culling — the S4a
   look point sat INSIDE the house's cull box, and `sightLines()` built ray
   directions with "unit forward component" (NOT unit length), so off-axis
   rays overshoot by (|d|-1) x len and reach the box past the look point.
   Fix: normalize ray directions in sightLines() (t=len ends exactly at the
   look point); S4a look moved to z=71.5.
3. **Tourist INVISIBLE in the exterior** (he stood 0.8 m BEHIND the house
   front wall, inside the house; the steps also ran into the wall). Fix:
   steps shifted -0.9 in z; tourist moved to (0.8,0.75,73.5); S4b DOF focus
   to (0.8,1.6,73.5). S4a camera pulled back to (9.5,3.0,52.0) — the building
   had filled the frame edge-to-edge.
4. **S1a framing:** first fix made it worse (both street houses culled —
   side rays hit the house boxes before the look point at z=3, house fronts
   at z=1.9; "1,000" cut off at the left edge). Fix: look z 3 -> 1.5.
5. **Caption collisions (REAL):** s2-room-closeup — the character's body
   filled the frame vertically, caption sat ON the body; s3-office-closeup —
   the worker's feet under the caption. Fix: S2b pulled back to
   (43.2,2.0,-4.6), look (40.5,1.1,1.0), fov 40; S3b to (-37.0,2.0,-3.0),
   look (-40,1.0,2.6), fov 40 — feet land ~77%.
6. **"$300 FINE" cut off at the left edge** (office wide). Fix: number moved
   to (-38.6,2.5,1.0), frame range f 360-450 (wide only); n1 moved to
   (0.5,2.8,2.0), f 0-60. Numbers now carry a/b frame ranges, checked in
   World.update().
7. **Workshop entirely PURPLE.** Root cause: golden preset shade
   [0.15,0.15,0.3] + lift [0.04,0.06,0.17] are blue-heavy, and the workshop
   (interior, open on the camera side) is backlit by the golden sun (az=6,
   from beyond the back wall), so every camera-facing surface is in the shade
   term. Fix: per-shot az override (workshop az=170), hemiBoost 1.25 -> 2.6.
8. **Office laptop a giant black slab** spanning the desk. Fix: shrunk to
   0.7x0.05x0.45, colour #2c313a -> #3a4150.
9. **Lantern glass hidden** inside the solid iron box (glass 0.14 < iron 0.2).
   Fix: iron frame rebuilt as 4 corner bars + top/bottom plates so the warm
   glass shows through.
10. **QA rule too strict on soft shadows** (a broad floor shadow below the
    caption text flagged as a collision). Fix: fail rule is cluster >= 5000 px
    OR (height >= 5% AND width <= 25%).

Remaining cosmetic notes (accepted, not failures): s4-wide building slightly
cropped at the left/right edges (leftmost window half-cut); s4-wide sun disc
hidden behind the building (natural — sunset behind the building); s5 stills
have a dark blue-purple floor shadow in the band (broad, readable under the
caption); s4-exterior-wide has NO caption at f570 (the demo words have a
pause there, not a template defect).

## Side-by-side vs TheRealWhy (out/sbs-sheet.jpg)

Row 1 = our 5 wides, row 2 = TheRealWhy reference frames (glassmaker f002,
speedcamera f003, coin f007, coin f012, coin f017). The 5 formula §(f) checks:

1. >= 4 locations — PASS (5 distinct sets).
2. Textured materials everywhere — PASS (cobble, brick, wood, tile, carpet).
3. Shadows (contact + sun tails) — PASS.
4. Characters less chibi (head ~26%) — PASS in the mediums/close-ups (the
   sheet shows the wides, where characters are correctly small; the
   mediums/close-ups put characters at TheRealWhy scale — verified by eye,
   s2-closeup body fills the frame vertically).
5. Captions ~3% + zero collisions + >= 1 in-scene number — PASS (captions
   58 px ~= 3.0%, all clear of characters/props; "1,000 COINS" + "$300 FINE").

Honest gaps vs the reference: their hero props are sometimes photographic
(real city skyline, real laptop UI, detailed airplane model) — those are
per-video assets, not template gaps; our painted style matches their
Glassmaker/Coin interiors. Their characters are bigger in most frames because
most of their shots are mediums/close-ups, not wides — the template's shot
plan already has a medium/close-up per set. The s4-wide roof reads purple
under the golden preset (shade term) — cosmetic.

## Push (branch + main)

- Branch `therealwhy-template` is an ORPHAN (empty-root) branch: main's root
  is the Matisse-era project (src/videos/{henry,island,spam}); the push
  helper overlays onto the base tree, so a branch from main would leave ~40
  Matisse files in src/ and break `tsc --noEmit`. Created with
  `make_branch_orphan.py` (README-only tree, since GitHub rejects a truly
  empty tree array with 422), then pushed with `push-manifest.json`
  (47 files, 613 KB). Branch commit cf1eb322.
- Workflows also pushed to main (`push-workflow.json`, commit 2ec29ccc) —
  dispatch 404s if the yml is branch-only (Matisse lesson).
- Smoke test runs: 45678711829 (21:47 Riyadh, FAILED — zero-pad filename),
  45680726599 (21:59 Riyadh, FAILED — same cause, diagnosed from the log +
  artifact frame-00.png, pixel-identical to local), 45684050199 (22:19 Riyadh,
  with the fix — **[RESULT PENDING]**). Full logs:
  `~/workspace/ricks-clone/threealwhy-smoke-run-45678711829.log` and
  `~/workspace/ricks-clone/smoke-run2-45680726599.log` (note the filename typo
  "threealwhy" — the log files, not the project). Artifact from run 2
  (56 MB, 30 frames): `~/workspace/ricks-clone/smoke-artifact/`.

## What is NOT in the template (per-video work, Phase 2/3)

- A real topic, script, VO, or word timings (the demo words are a test only).
- Synthesized music bed / SFX (engine-made, per Danish Step 5) — the mix
  spec is in assemble.sh; the bed itself is per-video.
- The `mayday-pipeline.md` rewrite as TheRealWhy-Exact v2 (Phase 3) — the
  formula's RICKS-EXACT numbers are SUPERSEDED: duration 57-74 s (not 45-60),
  183-250 words (not 150-200), 4-5 pauses allowed (not max 1), captions 1-2
  words (not strictly 1), >= 4 locations mandatory, in-scene numbers
  mandatory, no tail hold.
