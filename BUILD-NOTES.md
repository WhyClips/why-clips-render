# Drake–Cimarrones Gullak — BUILD NOTES (v1, Sat 28 Nov 2026)

## Topic
Drake and the Cimarrones, Panama 1573 — "The Slaves Who Showed Drake the Pacific".
Working title, hook, 6-beat outline, twist, sources: `~/workspace/ricks-clone/video-employee/2026-11-28-nonwestern-candidates.md` (LatAm candidate 1).
Freshness: verified FRESH on the live YouTube Shorts filter 28 Nov 08:04 (browser check) + web-search sanity check passed before building (only long-form Drake docs; no dedicated English Short on the Drake–Cimarrón alliance).
Slot: Sat 28 Nov 9 PM Riyadh, Why Clips.

## Script (script-drake.txt — LOCKED)
- 196 spoken words, 7 paragraphs, hook first, "You see" pivot, twist last line.
- "cimarrones" (not "Cimarones"), "thirty" (not "30"), "HIM" caps for emphasis.

## Voiceover (audio/voiceover.mp3)
- TTS `avocado_v2:casper_1_5x`. Speed 100 gave 210.6 WPM (too fast — TTS pace
  drifts faster per render: 61.5s → 55.8s across v1–v4 at speed 100).
  **Speed 94 LOCKED: 59.352s, 198.1 WPM** (in the 190–200 target).
  Precedent: the dead Segway/Sued builds also used speed 94/92, not 100.
- Word timings: faster-whisper small.en DIRECT call on the 16k WAV (the
  transcribe_chunks.py script does NOT preserve per-word timings — its chunk
  files merge words into segment text; only pending_words keep word times).
  Direct call: `WhisperModel(...).transcribe(np_audio, word_timestamps=True)`.
  Note: direct call on an MP3 path fails (PyAV `metadata_errors` kwarg) —
  decode to 16k WAV first, pass numpy audio.
- Token fixes applied to words.json: "Cimarones"→"cimarrones", "30"→"thirty",
  "him."→"HIM.", "Treasure Road."→"treasure road.", "Isthmus."→"isthmus.".
  194 tokens, last word "world." ends 58.86s.
- Mouth cues: Rhubarb 1.13.0 on voiceover-16k.wav → audio/rhubarb-drake.json
  → audio/mouthCues.json (A/X→closed, B/C/D/E→open, F/G/H→grin), 356 cues.

## Music + SFX (audio/)
- Bed: NEW — E minor pentatonic, 108 BPM, seed 97, triangle keys + Em-C-G-D
  pad + sine bass, hook light (first 6s 0.55x), twist loud (last 10s to 1.35x).
  BANNED: C-major pluck 112 BPM seed 43; A-minor pentatonic 96 BPM seed 71.
  LIGHT BED (Azhar 27 Nov FINAL): melodic bed RMS −36 dBFS, VO mean −16.9 dB
  → bed ~19 dB below VO. Post-normalization drone floor (E1+E2, RMS ~−36)
  keeps every 0.5s window above −40 dB. `make_bed_drake.py`.
- SFX: 12, all from the free pool (none in Moon Trees v1/v2/v4 or Fruit Flies):
  whoosh-mysterious-01 (oceans 3.66s), whoosh-swipe-zoom-01 (mule 8.52s),
  drone-rain-loop-01 (jungle, 13.74s), pop-hard-click-01 (cimarrones, 16.26s),
  whoosh-vacuum-01 (melted 21.56s), whoosh-arrow-01 (raiding 23.08s),
  drone-thunder-rain-01 (jungle 29.76s), pop-select-click-01 (Mandinga 33.54s),
  blip-interface-click-01 (deal. 34.38s), whoosh-fast-transitions-01
  (ambushed 41.94s), whoosh-tunnel-reverb-01 (riverbed. 44.54s),
  whoosh-stutter-01 (Pacific 53.82s). `mix_sfx_drake.py` (rotation check OK).
  music_sfx.wav: 62.000s, mean −26.7 dB, max −3.3 dB, 0 silence windows <−40 dB.

## Visuals (src/videos/fruitflies/)
- Base: moon-trees-gullak-project (Gullak pipeline), NOT fruit-flies-project
  directly — same code, latest proven structure.
- NEW files: `Drake.tsx` (main component), `plates-drake.tsx` (JunglePlate,
  TrailPlate, VillagePlate, HilltopPlate, RiverPlate), `props-drake.tsx`
  (Mule, MuleTrain, SilverPile, PirateShip, JungleTree, TreasureChest,
  Globe, Compass). `story.ts` rewritten (7 scenes, 21 beats).
- Cast (Chibi presets in Drake.tsx): Drake (beret + moustache + red jacket),
  Pedro (green, dark skin, tufts), Cimarron1/2/3 (yellow/blue/red),
  Soldier (bowler + grey), Boss (Spanish officer).
- Pills: "1573" (H1, delay 8f), "30 CIMARRONES" (A2, delay 56f),
  "TWO OCEANS" (F2, delay 100f). No Sub on the final beat (caption only).
- Stills QA (local, 12 frames): fixed before render — H2/S4 badges clipped
  by the C1 camera (moved top 170→260); H2/F2/F3 figures standing on water
  (HilltopPlate hill widened + figures repositioned onto it); third mule cut
  off (MuleTrain rebuilt with explicit nested SVG viewports — percentage
  widths inside <g> transforms are ambiguous); ship enlarged (600→700px).

## Render
- GitHub repo WhyClips/why-clips-render, branch `drake-cimarrones`
  (commit 224a7ef6), workflow `.github/workflows/render-drake-gullak.yml`
  on main (commit cee81154), dispatched on ref main.
- 4 chunks c1–c4 × 450 frames, concurrency 2, scale 1; assemble concats +
  mixes voiceover.mp3 + music_sfx.wav (amix normalize=0, alimiter 0.95).
- Run: <run id + link — fill after render>
- Artifact: drake-cimarrones-full-quality.

## QA (final MP4 — fill after download)
- ffprobe: 60.000s / 1080x1920 / h264+aac.
- Loudness after loudnorm to −14 LUFS: <value>.
- Every shot's key frame checked: hook, final, all 3 number pills at exact
  windows, every point-to-point match, middle-section glitch sweep, whole
  video watched at normal speed.
- Silence scan: no 0.5s window below −40 dB.
- Minors: <list>.

## Delivery
- `~/workspace/your_files/why-clips-drake-cimarrones-v1.mp4` (NEW file, never
  overwrite). Upload pack: `upload-pack.md` in this project. Thumbnail:
  hook frame (~1–2s, Drake on the hill + 1573 pill).
- NO upload cron set by the build agent (Azhar checks first).

## Slot note (for the coordinator)
- MEMORY.md (28 Nov) says the 9 PM slot build is Lesjaskogsvatnet (round 6,
  started 08:25) and the 4 PM slot is Wikipedia — the Vai build was replaced.
  This Drake build was spawned 08:05 for the 9 PM slot BEFORE the round-6
  decision. Coordinator to decide: Drake vs Lesjaskogsvatnet for 9 PM.
