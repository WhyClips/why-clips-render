# BUILD NOTES — Why Clips: The Man Who Owned Segway Died Riding One (Jimi Heselden, 2010)

60.000 s, 1080×1920, 30 fps, 1800 frames. Built 27–28 Nov 2026.
Pipeline: Fruit Flies / Moon Trees Gullak (chibi 2D, pure SVG/DOM Remotion) —
base copy of moon-trees-gullak-project (the proven v4 tree, itself a copy of
fruit-flies-project), NOT mayday-project, NEVER the therealwhy Three.js template.

## Topic (from video-employee 2026-11-27-topics.md Slot 2, no re-research)
Jimi Heselden, Leeds coal miner's son, made ~£166m from Hesco blast walls
(Camp Bastion named after his firm). Bought the Segway company Christmas Day
2009 (Dean Kamen invented it, 2001 — Heselden did NOT invent it). Owned it
just nine months. 26 Sep 2010, riding an off-road Segway X2 on the Jackdaw
Crag footpath above the River Wharfe, walking his dog; reversed to let dog
walker Sean Christie pass; fell 42 ft (coroner's inquest figure) into the
river. Cause: multiple blunt force injuries to chest and spine. Verdict:
accidental death. Segway examined — NO fault found. Coroner: "act of courtesy".
Sources: Wikipedia "Jimi Heselden"; Capital FM inquest report; AP via
Manufacturing.net; BBC News 27 Sep 2010.
Freshness: re-checked by the coordinator ~23:00 Fri 27 Nov with two
site:youtube.com/shorts queries — FRESH (only a non-English Indonesian Short).

## Script + VO + audio
- Script: `script-segway.txt`, 193 words (202 wc tokens incl. 9 em-dash
  separators). Hook is the exact locked line: "In 2010, the owner of the
  Segway company died riding a Segway. Off a cliff. Into a river. And the
  worst part — he was only reversing to be polite." Twist as the LAST line
  (coroner's "act of courtesy"). No intro, no like/subscribe ask, no moral.
- VO: `audio/voiceover.mp3`, Casper (avocado_v2:casper_1_5x). Speed 100 gave
  55.75 s / 207.7 WPM (too fast for the 190–200 WPM target); speed 85 gave
  69.46 s (too slow); speed 94 re-rendered at 59.328 s, **195.2 WPM**, last
  word ends 58.82 s. TTS speed scaling is non-linear and varies run to run —
  the first speed-94 render was 56.33 s, the second 59.33 s; always measure
  the actual file. Used the raw speed-94 render directly (no atempo).
  DEVIATION NOTE: speed is 94, not 100 — 100 misses the WPM target.
- Pauses: 28 natural sentence pauses >0.4 s (max 0.90 s after "over.") —
  KEPT, same as Moon Trees v4. Stripping them at ~195 WPM would sound
  rushed; the task's own escape clause allows noting this instead.
- Word timings: `audio/words-raw.json` (200 Whisper small.en tokens) →
  `src/videos/fruitflies/words.json` (199 tokens). Fixes: "Jimmy"→"Jimi" ×2,
  "Hesselton"→"Heselden", "Wharf,"→"Wharfe,", "Company"→"company" ×2,
  "26,"→"26th,", merged "off"+"-road"→"off-road", gave real spans to the
  zero-duration tokens "42" (39.58–39.74), "shield" (13.90–14.14),
  "he" (28.86–28.98), "said" (44.38–44.54).
- MOUTH CUES: Rhubarb 1.13.0 → 377 cues, 0.00–59.32 s, v2 mapping
  (A/X→closed, B/C/D/E→open, F/G/H→grin); raw at `audio/rhubarb-segway.json`.
- NEW MUSIC BED (`audio/music_synth.wav`, generator `make_bed_segway.py`):
  D major pentatonic, 104 BPM, sine-bell keys + detuned-sine pad (D–G–A–Bm)
  + gentle sine bass, seed 97. Deliberately different from BOTH banned beds
  (C major pluck 112 BPM seed 43; A minor triangle keys 96 BPM seed 71).
  Hook light (first 6 s at 0.55x), twist loud (last 8 s to 1.35x), continuous
  D2/D3 drone floor. 62.000 s, mean −24.0 dB, max −8.2 dB.
- LIGHT BED RULE (Azhar 27 Nov 14:15): bed attenuated to volume 0.5 (~−6 dB)
  in the SFX mix so it sits ~18–20 dB below the VO.
- SFX MIX (`audio/music_sfx.wav`, mixer `mix_sfx_segway.py`): 12 placements,
  NONE from Moon Trees v1/v2/v4 sets (asserted in the script; Fruit Flies
  used synthesized SFX, not library files):
  whoosh-arrow-01 (0.34), whoosh-tunnel-reverb-01 (5.22),
  pop-select-click-01 (8.00), drone-thunder-rain-01 (14.14),
  extra-typewriter-01 (16.40), pop-long-01 (21.68),
  whoosh-stutter-01 (25.70), pop-hard-click-01 (31.54),
  whoosh-swipe-zoom-01 (35.72), whoosh-vacuum-01 (36.98),
  whoosh-fast-transitions-01 (39.58), whoosh-mysterious-01 (58.56).
  62.000 s, mean −25.9 dB, max −3.4 dB, 0 silence windows below −40 dB.

## Code
- Project: `~/workspace/ricks-clone/segway-gullak-project/`.
- `src/videos/fruitflies/Segway.tsx` (new, exports `SegwayShort`),
  `story.ts` (rewritten, TOTAL 1800), `props-segway.tsx` (new SVG props:
  SegwayX2, Dog, HescoWall, ShopFront, InquestPaper, CliffPlate),
  `Root.tsx` (Composition `SegwayShort`), `package.json`
  (segway-gullak-short). Reused plates/characters/props/cards/fonts/captions
  unchanged. Deleted `MoonTrees.tsx`, `props-moon.tsx`, Moon Trees audio
  scripts. `tsc --noEmit` PASSES.
- Scenes (word anchors): hook 0–268 / setup 268–601 / buy 601–796 /
  ride 796–1047 / fall 1047–1311 / inquest 1311–1574 / payoff 1574–1800.
- 22 beats (see story.ts BEATS). Longest beat B2 (106 f = 3.53 s) carries a
  MID-BEAT VISUAL POP ("9 MONTHS" pill at f771) so no composition holds
  longer than 3.5 s. Longest other beat 101 f = 3.37 s (F3).
- CAPTIONS: bottom-centre, 1–2 words, bold, **48 px**, black pill
  rgba(10,10,14,0.62), active word gold #ffd94d + pop. Chunks derive from
  `words.json` automatically.
- NUMBERS (pop-in + count-up, gold pill, fully in frame): "£166 MILLION"
  setup (count-up 50→100→166, complete ~f490), "9 MONTHS" buy (pill pops
  f771), "42 FEET" fall (pops f1188), "AGED 62" fall (pops f1273).
- Point-to-point: Jimi rides the Segway on the clifftop path; the dog walks
  beside him; Christie approaches on the same path; Jimi reverses (arrow +
  backward slide); the Segway wobbles and tips at the edge; it sinks in the
  river; the inquest paper carries the ACCIDENTAL DEATH stamp and the
  NO FAULT FOUND tick; the final frame is the gold "AN ACT OF COURTESY"
  chalk with NO Sub (Moon Trees v2 fix — only the karaoke caption speaks
  the last words).

## GitHub / Actions
- Repo: `WhyClips/why-clips-render`. Branch `segway-gullak` (code+audio).
  Workflow `.github/workflows/render-segway-gullak.yml` on `main`.
- Dispatch on ref `main` (the workflow file must be dispatched from the
  branch that holds it); the workflow itself checks out `segway-gullak`.
- Render run: TBD. Artifact `segway-gullak-full-quality`.

## Verification results (final file — full MP4)
- ffprobe: TBD
- Audio: TBD LUFS, true peak TBD; silencedetect: TBD.
- Frames checked: TBD.
- Deliverable: `~/workspace/your_files/why-clips-segway-v1.mp4`.
  Thumbnail: `thumbnail-segway-v1.png` (hook f15). Upload pack: `upload-pack.md`.
- Upload: 21:00 Sat 28 Nov slot — the parent sets the cron. This builder did
  NOT upload anything and did NOT set any cron.

## Remaining minors (honest, none blocking)
- TBD after final verification.
