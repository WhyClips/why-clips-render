# BUILD NOTES — Why Clips: The Moon Trees (Gullak rebuild) — "NASA Flew 500 Seeds Around the Moon — The Trees Are Still Standing"

60.000 s, 1080×1920, 30 fps, 1800 frames. Built 26 Nov 2026.
Pipeline: Fruit Flies (Gullak Tales chibi 2D, pure SVG/DOM Remotion) — NOT the
Three.js / therealwhy-template style of Moon Trees v1.

## Why this rebuild (Azhar, 26 Nov 2026)
- Moon Trees v1 (Three.js template) REJECTED 10:27: "Nhi asaa style nhi chaiya muja".
- Azhar 10:27, replying to Fruit Flies v2: "Esi pipline sa continued kr" — continue
  with THIS pipeline. Fruit Flies is now the going-forward Shorts pipeline.
- Fixes carried from v1 feedback: captions slightly smaller; no mid-video glitches;
  fresh background music (Azhar 10:09: "background music acha nhi haa har video
  same rakhta ba" — same bed in every video).

## Topic (reused from v1, no re-research)
Apollo 14, Jan 1971. Stuart Roosa orbited alone with ~500 seeds of five species in
a tiny canister. Seeds ORBITED the Moon 34 times — NEVER landed. Splashdown:
canisters burst, seeds spilled, presumed dead. ~420–450 germinated (Mississippi +
California). For America's 200th birthday seedlings went to all 50 states; first
official planting 6 May 1975, Washington Square Park, Philadelphia; a loblolly pine
at the White House; others to Brazil, Switzerland, Emperor Hirohito of Japan.
Forgotten until a schoolteacher asked NASA (1996); scientist David Williams hunted
clippings, found ~110; ~30 had died. Artemis I (2022) carried 1,000 new seeds.
Sources: NASA "Celebrating Moon Trees on Arbor Day", Wikipedia "Moon tree",
Britannica "Moon tree", NASA NSSDC "The Moon Trees".
Freshness (from v1, 26 Nov 2026): one English Short found
(youtube.com/shorts/BAqcj5sG-Yc) — a personal anniversary-gift/cyanotype-art video,
NOT a dedicated telling. Judged NOT a dedicated Moon Trees Short; build proceeded.
Flagged to Azhar at v1 delivery; no overrule received.

## Script + VO + audio (reused VO, new bed/SFX)
- Script: `script-moon-trees.txt`, 236 words (same as v1). VO:
  `audio/voiceover.mp3`, 59.535 s, 229.3 WPM, last word ends 59.4 s.
  Word timings: `src/videos/fruitflies/words.json` (225 tokens).
- NEW MUSIC BED (`audio/music_synth.wav`, generator `make_bed_moontrees.py`):
  A minor pentatonic, 96 BPM, triangle-wave keys + warm detuned-sine pad +
  gentle sine bass, seed 71. Deliberately different from the banned old bed
  (C major pentatonic pluck, 112 BPM, seed 43). Hook light (first 6 s at 0.55x),
  twist loud (last 8 s to 1.35x), continuous A1+A2 drone floor. 62.000 s,
  mean −24.0 dB, max −9.1 dB, 0 silence windows.
- SFX MIX (`audio/music_sfx.wav`, mixer `mix_sfx_moontrees.py`): 21 placements at
  word anchors, ZERO reuse of the 21 v1 files (asserted in the script):
  whoosh-air-zoom-01 (0.00), drone-deep-space-01 (1.14), boom-trailer-whoosh-01
  (6.90), blip-scifi-bleep-01 (11.16), thud-suspense-hit-01 (17.66),
  blip-tech-alert-01 (19.70), boom-explosion-afar-01 (23.18),
  shimmer-magic-sweep-01 (23.94), thud-soft-punch-01 (26.58),
  drone-breeze-trees-01 (27.56), riser-big-impact-01 (31.08),
  whoosh-powerful-air-01 (33.04), shimmer-fairy-sparkle-01 (34.92),
  whoosh-cinematic-fast-01 (37.24), blip-interface-beep-01 (39.48),
  drone-cinematic-wind-01 (42.44), riser-horn-01 (47.26),
  glitch-virtual-quick-01 (48.52), boom-blockbuster-01 (52.64),
  extra-heartbeat-trailer-01 (55.64), boom-bass-hit-01 (59.20).
  62.000 s, mean −18.8 dB, max −3.0 dB, 0 silence windows below −40 dB.
- MOUTH CUES: Rhubarb 1.13.0 on `voiceover-16k.wav` → 373 cues, 0.00–59.53 s
  (closed 59 / open 249 / grin 65), `src/videos/fruitflies/mouthCues.json`
  (+ backup `audio/mouthCues.json`).

## Code
- Project: `~/workspace/ricks-clone/moon-trees-gullak-project/` (copy of
  `fruit-flies-project/`, `fruit-flies-project/` untouched).
- `src/videos/fruitflies/MoonTrees.tsx` (new, exports `MoonTreesShort`),
  `story.ts` (rewritten, TOTAL 1800), `captions.tsx` (rewritten),
  `props-moon.tsx` (new SVG props: SeedCanister, SeedPile, SeedlingTray,
  PineTree, WhiteHouse, OrbitDiagram, NewspaperClippings, ArtemisRocket),
  `Root.tsx` (Composition `MoonTreesShort`), `package.json`
  (moon-trees-gullak-short). Reused plates/characters/props/cards/fonts
  unchanged except one fix: QuarantinePlate sign now reads QUARANTINE.
  Orphaned `FruitFlies.tsx` deleted; `package-lock.json` name fixed
  (was stale `apollo-short`); `stills.mjs` retargeted to MoonTreesShort.
- Scenes (hard cuts, word anchors): hook 0–207 / apollo14 207–530 /
  orbits 530–820 / sprout 820–1023 / states 1023–1252 / hunt 1252–1572 /
  artemis 1572–1800. Sub-phase cuts inside scenes also word-aligned.
- CAPTIONS: bottom-centre, 1–2 words, bold, **48 px** (v1 was ~58 px — the
  "thordha gaints" fix), black pill rgba(10,10,14,0.62), active word gold
  #ffd94d + pop. 120 chunks; gaps only at natural sentence pauses
  (25 gaps >0.25 s, max 0.68 s — the 5 segment-break silences). No top captions.
- NUMBERS (pop-in + count-up, gold pill, fully in frame): "500 SEEDS" hook
  (count-up 100→500), "34 ORBITS" orbits, "420 SEEDLINGS" sprout,
  "50 STATES" states, "110 FOUND" hunt, "1,000 SEEDS" artemis
  (count-up 250→1,000, complete by f1670).

## GitHub / Actions
- Repo: `WhyClips/why-clips-render`. Branch `moon-trees-gullak` (code+audio,
  commit 49ed0d375981a4b9905e95a928be93f11bf6a13c — branch created first via
  `create-branch` from main, then push). Workflow
  `.github/workflows/render-moontrees-gullak.yml` on `main` (commit f1462424).
- Workflow `Render Moon Trees Gullak`: 4 chunks c1–c4 × 450 f, concurrency 2,
  scale 1; assemble concats chunks + mixes `audio/voiceover.mp3` +
  `audio/music_sfx.wav` (amix + limiter 0.95, `-shortest`).
- Dispatch note: dispatch on ref `main` (the workflow file must be dispatched
  from the branch that holds it in `.github/workflows/`); the workflow itself
  checks out ref `moon-trees-gullak`. Dispatching on the code branch fails 422.
- Render run: **45777807519, SUCCESS** (dispatched 26 Nov ~10:46 Riyadh,
  completed in ~3 min — SVG/DOM renders far faster than the 3D composer).
  Artifact `moon-trees-gullak-full-quality` (8,108,910 bytes).

## Verification results (final file — full MP4, checked by coordinator)
- ffprobe: h264, 1080×1920, 30 fps, aac, duration **60.000000 s**,
  8,199,486 bytes. No watermark, no title card, no end card.
- Audio: loudnorm input **−14.42 LUFS**, true peak **+0.49 dB**
  (slightly hotter than v1's +0.18 — sample peak limited at 0.95);
  silencedetect: **ZERO silences < −40 dB**.
- Frames checked in the FINAL MP4 (11 key + 5 cut boundaries + 3 mid-sweep):
  hook f15 ✓ (canister "SEEDS" + Earth + Moon + "1971 • NASA", caption
  "In 1971," gold); "500 SEEDS" f120 ✓; astronauts f300 ✓;
  "34 ORBITS" f640 ✓ (orbit diagram + capsule dot); spill f760 ✓
  ("MIXED LIKE SPILLED SALT" + seed pile + shocked scientist);
  "420 SEEDLINGS" f970 ✓; "50 STATES" f1080 ✓; teacher f1300 ✓
  ("Where are the Moon Trees?"); "110 FOUND" f1460 ✓ (clippings
  "MOON TREES FOUND!"); "1,000 SEEDS" f1670 ✓ (Artemis rocket + canister);
  final f1790 ✓ (big pine + park road + Roosa, "growing right now — near you").
- Cut boundaries f207/f530/f820/f1023/f1252: all CLEAN hard cuts — no ghosting,
  no double-exposure, no glitch frames (the v1 xfade defect is gone by
  construction; Gullak scenes are hard cuts).
- Middle 12–45 s: 30 frames extracted at 1 fps + the 5 cut frames read —
  no glitches. Two frames with no caption (19.0 s, 26.0 s) verified as
  natural sentence pauses (0.32 s / 0.52 s gaps), not a bug.
- Point-to-point: every checked frame shows exactly what the words say.
- Captions: 48 px, bottom-centre, gold active word + pop on every checked
  frame; never overlapping a character or prop.
- Deliverable: `~/workspace/your_files/why-clips-moon-trees-v2.mp4`
  (8,199,486 bytes). Thumbnail: `thumbnail-moon-trees.png` (hook f15).
  Upload pack: `upload-pack.md`.
- Upload cron: `why-clips-moon-trees-upload-26nov` is DISABLED — stays disabled
  until Azhar approves v2. Do NOT re-enable without approval. Do NOT touch
  the Fruit Flies 16:00 cron.

## Remaining minors (honest, none blocking)
1. True peak +0.49 dB (v1 +0.18 dB).
2. f640: two-line subtitle pill overlaps itself slightly ("glory" line over
   the first pill's bottom edge) — readable.
3. f760 / f1252: large empty navy areas mid-frame (sparse staging).
4. InteriorPlate bench floats mid-air (f820/f1300); seedling tray overlaps
   the blue door (f820/f970).
5. Pines carry small brown dots (read as seeds/cones); the White House-scene
   pine sits on the road centre line (40 s frame).
6. "110 FOUND" pill partly covers the Moon poster (f1460).
7. No caption in the final 0.6 s (last word ends 59.4 s) — same as v1.
8. Subtitle pill crosses the rocket body in the launch frame (f207).

---

# v3 — 3-SECOND SCENES (Azhar, 26 Nov 2026 12:33: "Scene har 3 sec baad use kr")
Built 26 Nov 2026 ~13:00–13:15 Riyadh. Uploads TONIGHT 26 Nov 21:00 (Azhar
12:37: "3 sec scene wali krna 9 bja") — v2 will NOT upload; the 21:00 cron is
being switched to v3 by the parent. v3 builder did NOT touch any cron.

## What changed vs v2
- v2's 7 scenes (6.9–10.7 s each) re-cut into **22 beats of ~3 s** — same
  Gullak pipeline, same script/VO/music/SFX/captions/numbers/title/description.
- Beat camera: each beat wraps `<Scene/>` in a div with a jump-cut transform
  (4 presets C0–C3, scale 1.00–1.14, translate ±35/±40, origin 50% 55% /
  40% 50% / 60% 55% / 50% 40%). Transform jumps at beat boundaries (that IS
  the cut), holds steady inside the beat. `CaptionOverlay` stays OUTSIDE the
  camera wrapper so the karaoke pill never jumps.
- Beat variants (each beat gets its own distinct visual, point-to-point):
  H1 canister ECU / H2 tight push-in + bigger canister + drifting seeds /
  H3 sprout pops from canister + mini White House + "ONE AT THE WHITE HOUSE"
  badge / A1 launch / A2 moonwalk close-up → Roosa pointing / A3 Roosa
  THINKING (chin, canister mirrored LEFT) / A4 Roosa CHEERING (bothUp,
  happy, big canister, "EX-FOREST FIREFIGHTER" badge) / O1 "NEVER TOUCHED
  THE MOON" + red X / O2 big orbit diagram + "34 ORBITS" / O3 "BURST!" +
  bigger seed pile + scared Agent / S1 planted, Mississippi + California /
  S2 denser seedling trays (8+9 sprouts) / T1 five pines + "50 STATES" /
  T2 Philly planting, bigger pine, planter bothUp / T3 White House + pine +
  second waving crewman / U1 "FORGOTTEN…" faded pine / U2 teacher bothUp +
  "Where are the Moon Trees?" bubble / U3 "110 FOUND" reveal (pill top) /
  U4 "110 FOUND" rearranged — pill bottom, souvenir pine, crewman right /
  R1 Artemis I rises / R2 "1,000 SEEDS" + big canister / R3 final big pine
  park, Roosa.
- Beat boundaries aligned to sub-phase flips wherever a flip fell inside a
  beat (T1/T2 1101, T2/T3 1170, R2/R3 1710; sprout flip moved lf 110→102 so
  S2 opens on dense trays at f922). No beat starts with a sliver of the
  previous sub-phase.
- v2 minors FIXED: (1) f640 "glory" overlap — orbits Sub shortened to one
  line "looped around it — 34 times", only ONE caption pill visible at a
  time, no overlap anywhere; (2) final frame double pill — R3 Sub line
  "growing right now — near you" REMOVED, only the karaoke caption speaks
  the last words.

## Beat / shot list (22 beats, total 1800 f = 60.000 s)
| Beat | Frames | Time | Dur | Visual |
|---|---|---|---|---|
| H1 | 0–69 | 0.00–2.30 | 2.30 s | Canister ECU, "SEEDS", Earth + Moon |
| H2 | 69–138 | 2.30–4.60 | 2.30 s | Tight push-in, bigger canister, "500 SEEDS" count-up |
| H3 | 138–207 | 4.60–6.90 | 2.30 s | Sprout from canister, mini White House, green badge |
| A1 | 207–297 | 6.90–9.90 | 3.00 s | Apollo 14 launch, rocket rises |
| A2 | 297–387 | 9.90–12.90 | 3.00 s | Moonwalk close-up → Roosa pointing, orbit diagram |
| A3 | 387–458 | 12.90–15.27 | 2.37 s | Roosa thinking (chin), canister mirrored left |
| A4 | 458–530 | 15.27–17.67 | 2.40 s | Roosa cheering, big canister, firefighter badge |
| O1 | 530–627 | 17.67–20.90 | 3.23 s | "NEVER TOUCHED THE MOON" + red X |
| O2 | 627–724 | 20.90–24.13 | 3.23 s | Big orbit diagram, "34 ORBITS", splashdown |
| O3 | 724–820 | 24.13–27.33 | 3.20 s | "BURST!", seed pile, "MIXED LIKE SPILLED SALT" |
| S1 | 820–922 | 27.33–30.73 | 3.40 s | Planted anyway, Mississippi + California |
| S2 | 922–1023 | 30.73–34.10 | 3.37 s | Dense seedling trays, "420 SEEDLINGS" |
| T1 | 1023–1101 | 34.10–36.70 | 2.60 s | Five pines, "50 STATES" |
| T2 | 1101–1170 | 36.70–39.00 | 2.30 s | Philadelphia planting, May 1975 |
| T3 | 1170–1252 | 39.00–41.73 | 2.73 s | White House pine + waving crew |
| U1 | 1252–1332 | 41.73–44.40 | 2.67 s | "FORGOTTEN…", faded pine |
| U2 | 1332–1412 | 44.40–47.07 | 2.67 s | Schoolteacher asks NASA, speech bubble |
| U3 | 1412–1492 | 47.07–49.73 | 2.67 s | "110 FOUND" reveal, pill top, clippings |
| U4 | 1492–1572 | 49.73–52.40 | 2.67 s | "110 FOUND" rearranged + souvenir pine |
| R1 | 1572–1648 | 52.40–54.93 | 2.53 s | Artemis I rocket rises |
| R2 | 1648–1710 | 54.93–57.00 | 2.07 s | "1,000 SEEDS", big canister |
| R3 | 1710–1800 | 57.00–60.00 | 3.00 s | Final big pine park, Roosa |

Longest beat 102 f = 3.40 s (S1); shortest 62 f = 2.07 s (R2). Max gap
between ANY visual change (beat cuts + sub-phase flips + prop/badge pops,
41 points) is also 102 f = 3.40 s — **no shot holds longer than 3.5 s**.

## GitHub / Actions (v3)
- Branch `moon-trees-gullak`: commit 037284bd (first v3 push) then
  c6c975b93db53e57f38061d7ccc5a64a72edf02f (beat-boundary alignment fix).
  Workflow unchanged on `main`.
- Render run 1: **45795817254, SUCCESS** (~3 min) — rejected after review:
  R2→R3 cut at f1724 was camera-only (final pine starts f1710, inside R2)
  and T1/T2/T3 + S1/S2 boundaries had 2–8 f slivers. Fixed by moving
  boundaries (see above) and re-rendered.
- Render run 2 (FINAL): **45798069158, SUCCESS** (~3 min). Artifact
  `moon-trees-gullak-full-quality` (9,205,496 bytes).

## Verification results (final file — full MP4, checked by coordinator)
- ffprobe: h264, 1080×1920, 30 fps, aac, duration **60.000000 s**,
  9,277,748 bytes. No watermark, no title card, no end card. Frame 1:
  mid-action hook (canister ECU, "1971 • NASA", caption "In 1971,").
- Audio: loudnorm input **−14.42 LUFS**, true peak **+0.49 dB** (same mix
  as v2 — audio unchanged); silencedetect: **ZERO silences < −40 dB**.
- Whole-video watch: 60 frames at 1 fps read (6 contact sheets) + 21 cut
  boundaries checked before/after (42 frames) — all CLEAN hard cuts, no
  ghosting, no double-exposure, no frozen frames; motion continues
  throughout (rocket rises, capsule orbits the diagram, seeds drift,
  mouths move, count-ups run).
- Numbers at exact windows: "500 SEEDS" f120 ✓ / "34 ORBITS" f640 ✓
  (one-line Sub, NO overlap) / "420 SEEDLINGS" f970 ✓ / "50 STATES"
  f1080 ✓ / "110 FOUND" f1460 ✓ (U3 reveal) + U4 rearranged f1530 ✓ /
  "1,000 SEEDS" f1670 ✓. Hook f15 ✓. Final f1790 ✓ (big pine + Roosa,
  single caption only — double-pill fix confirmed).
- Middle 12–45 s sweep: all clean; caption gaps only at natural sentence
  pauses (e.g. ~48.5 s, 0.5 s gap before "You see,").
- Point-to-point: every checked frame shows exactly what the words say.
- Deliverable: `~/workspace/your_files/why-clips-moon-trees-v3.mp4`
  (9,277,748 bytes). Thumbnail: `thumbnail-moon-trees-v3.png` (hook f15).
  Upload pack: `upload-pack.md` (updated to v3).
- Upload: 21:00 cron is being switched to v3 by the parent. v3 builder did
  NOT touch any cron and did NOT upload anything.

## Remaining minors (honest, none blocking — mostly carried from v2)
1. True peak +0.49 dB (same as v2).
2. Large empty navy areas mid-frame at f760 / f1252 (sparse staging).
3. InteriorPlate bench floats mid-air; seedling tray overlaps the blue door.
4. Pines carry small brown dots; White House-scene pine sits on the road
   centre line; final pine also on the road centre line.
5. "110 FOUND" pill (U3) partly covers the Moon poster; U3 pill also
   crosses the window/rocket picture on the QuarantinePlate.
6. No caption in the final 0.6 s (last word ends 59.4 s) — same as v2.
7. Launch rocket briefly passes in front of the "APOLLO 14 • JAN 1971"
   badge as it rises (~9.5 s, covers "971" for ~1 s) — pre-existing v2
   geometry, unchanged.
8. Two beats are camera-reframe-only at their boundary (O2→O3 at f724:
   burst shot continues, reframe + salt branch at f739; A2→A3 is pose +
   reframe, verified distinct). Longest single composition anywhere is
   3.40 s, so the 3-second rule still holds.
9. Within-beat frames can look near-identical 1 s apart (e.g. O3 salt
   shot f750 vs f780) — expected: the beat changes every ~3 s, not
   every second; internal motion (seed sway, mouth, capsule dot) is
   subtle in the static beats.

---

# v4 — NEW SCRIPT + SLOWER VO (Azhar, 26 Nov 2026 ~14:00: v3's script is boring, voice way too fast, hook must be shocking)
Built 26 Nov 2026 ~14:00–14:40 Riyadh. Uploads TONIGHT 26 Nov 21:00 ONLY if
Azhar approves v4 — the 21:00 cron currently points to v3; the parent switches
it to v4 after approval. v4 builder did NOT touch any cron.

## What changed vs v3
- NEW SCRIPT (196 words, `script-moon-trees.txt` + `script-moon-trees-v4.txt`) —
  why it is less boring: the hook is now a shock + reversal in the first two
  lines ("Five hundred seeds flew around the Moon in 1971 — NASA came home
  believing they were all dead. Today, one stands at the White House.") instead
  of v3's flat "In 1971, NASA flew 500 seeds…"; every paragraph now ends on a
  twist or a stake ("ruined, impossible to sort", "stubborn as weeds after a
  wildfire", "one scientist hunted them from newspaper clippings"); the
  "forgotten → hunted → found" arc is a proper mystery (schoolteacher asks,
  scientist hunts clippings, 110 found); Artemis is framed as "NASA did it
  again" with the grandchildren payoff ("maybe in a park near you").
- NEW VO (`audio/voiceover.mp3`, 59.668 s, same voice avocado_v2:casper_1_5x,
  speed 100 — was 120): **197.1 WPM** (was 229.3). Last word ends 59.58 s.
  Pause profile (DELIBERATE — overrides the old fast-VO "max ONE pause
  >0.4 s" rule; do not "fix" it): 6 segment-break silences 0.5 s + natural
  sentence pauses 0.4–0.82 s throughout (26 pauses >0.4 s, max 0.82 s after
  "NASA," → "where"). This is the slower feel Azhar asked for.
- TOKEN FIXES (`src/videos/fruitflies/words.json`, 187 Whisper tokens,
  small.en; raw at `audio/words-raw-v4.json`): idx 33 "Stewart"→"Stuart",
  34 "Russo"→"Roosa", "moon"→"Moon" everywhere, idx 167 "1"→"One" (Artemis
  One), idx 127 "Philadelphia," given 40.12–40.72 (Whisper gave it zero
  duration). "school teacher" is TWO tokens (idx 142–143). Numbers are digit
  tokens: "500", "34", "420", "50", "110", "2022", "1971", "1975", "200th".
- MOUTH CUES: Rhubarb 1.13.0 → 392 cues, 0.00–59.66 s, v2 mapping
  (A/X→closed, B/C/D/E→open, F/G/H→grin); raw at
  `audio/rhubarb-moontrees-v4.json`.
- SFX SET #3 (`audio/music_sfx.wav`, REBUILT for v4, mixer
  `mix_sfx_moontrees.py` — do not remix): 21 FRESH placements, none from the
  v1 or v2 sets, anchored to the new word times. 62.000 s, mean −21.4 dB,
  max −3.0 dB, 0 silences below −40 dB. Bed `audio/music_synth.wav`
  UNCHANGED (A minor, 96 BPM, seed 71).
- CAPTIONS: `captions.tsx` unchanged — chunks derive from `words.json`
  automatically (1–2 words, 48 px, gold active word + pop). Verified working
  with the new tokens, including the digit tokens and the two-token
  "school teacher".

## Code re-cut (`story.ts`, `MoonTrees.tsx`; tsc --noEmit PASSES)
- Scenes (word anchors): hook 0–212 / apollo14 212–449 / orbits 449–878 /
  sprout 878–1088 / states 1088–1307 / hunt 1307–1560 / artemis 1560–1800.
- 22 beats (A4 and U4 removed; O4/O5 added):
| Beat | Frames | Time | Dur | Visual |
|---|---|---|---|---|
| H1 | 0–69 | 0.00–2.30 | 2.30 s | Canister ECU, "500 SEEDS" count-up |
| H2 | 69–138 | 2.30–4.60 | 2.30 s | Tight push-in, "NASA thought they were all dead" |
| H3 | 138–212 | 4.60–7.07 | 2.47 s | Sprout from canister, mini White House |
| A1 | 212–297 | 7.07–9.90 | 2.83 s | Apollo 14 launch, rocket rises |
| A2 | 297–363 | 9.90–12.10 | 2.20 s | Moonwalk close-up → Roosa pointing (flip f313) |
| A3 | 363–449 | 12.10–14.97 | 2.87 s | Roosa thinking, firefighter badge, canister (pops f392) |
| O1 | 449–538 | 14.97–17.93 | 2.97 s | "NEVER TOUCHED THE MOON" → 34 orbits (flip f494) |
| O2 | 538–635 | 17.93–21.17 | 3.23 s | Big orbit diagram, "34 ORBITS", capsule falls (f598) |
| O3 | 635–720 | 21.17–24.00 | 2.83 s | Capsule falls → "BURST!" (f657) |
| O4 | 720–795 | 24.00–26.50 | 2.50 s | "MIXED LIKE SALT", scared agent |
| O5 | 795–878 | 26.50–29.27 | 2.77 s | Faded pile + red X, "written off as dead" |
| S1 | 878–978 | 29.27–32.60 | 3.33 s | Planted anyway, Mississippi + California |
| S2 | 978–1088 | 32.60–36.27 | 3.67 s | Dense trays, "420 SEEDLINGS" + wildfire flip f1030 |
| T1 | 1088–1161 | 36.27–38.70 | 2.43 s | Five pines, "50 STATES" |
| T2 | 1161–1242 | 38.70–41.40 | 2.70 s | Philadelphia planting, May 1975 |
| T3 | 1242–1307 | 41.40–43.57 | 2.17 s | White House pine + waving crew |
| U1 | 1307–1408 | 43.57–46.93 | 3.37 s | "FORGOTTEN…", faded pine |
| U2 | 1408–1470 | 46.93–49.00 | 2.07 s | Schoolteacher asks NASA, speech bubble |
| U3 | 1470–1560 | 49.00–52.00 | 3.00 s | Clippings, "110 FOUND" reveal (pill pops f1519) |
| R1 | 1560–1633 | 52.00–54.43 | 2.43 s | Artemis I rocket rises |
| R2 | 1633–1716 | 54.43–57.20 | 2.77 s | "1,000 SEEDS", big canister |
| R3 | 1716–1800 | 57.20–60.00 | 2.80 s | Final big pine park, Roosa, NO Sub (v2 fix kept) |
- Longest beat S2 (110 f = 3.67 s) carries a MID-BEAT VISUAL FLIP at f1030
  ("stubborn"): badge swaps green→orange "AFTER A WILDFIRE", trays reframe
  bigger, Sub "stubborn as weeds" appears — so no composition holds longer
  than 3.5 s (S2 halves: 52 f + 58 f). Longest other beat 101 f = 3.37 s (U1).
  Max gap between ANY visual change (beat cuts + sub-phase flips + prop/badge
  pops) is 101 f = 3.37 s.
- Sub lines re-written to the new script (see MoonTrees.tsx); number-pill
  anchors re-aligned to the new token starts: "500 SEEDS" f0 (count-up
  complete ~f60) / "34 ORBITS" f514 / "420 SEEDLINGS" f966 (pill pops at the
  S2 cut f978, the exact frame "420" ends — same ~12 f pattern v3 used, and
  it avoids the pill crossing the S1 crewman) / "50 STATES" f1147 /
  "110 FOUND" f1519 / "1,000 SEEDS" f1661 (count-up complete ~f1675). Only
  ONE number pill visible at a time.
- Sub-phase flips inside beats (all word-aligned): A2 moonwalk→Roosa f313
  ("circled"), O1 chalk→orbits f494 ("They looped"), O2 diagram→capsule f598
  ("Then splashdown"), O3 capsule→BURST f657 ("burst"), U3 clippings→pill
  f1519 ("110"). A3's canister pops f392 ("carrying"); R2's canister pops
  f1656 ("a" before "thousand").

## GitHub / Actions (v4)
- Branch `moon-trees-gullak`: commit **a7411395bce331c318ad24073c89c8127f475bfa**
  ("Moon Trees v4: re-cut beats + Subs to new script timings", 42 files).
  Workflow unchanged on `main`.
- Render run: **45808574680, SUCCESS** (dispatched 26 Nov ~14:13 Riyadh,
  completed ~14:20 — ~7 min; the assemble job spent ~6 min on
  `apt-get install ffmpeg`). All 5 jobs success (c1–c4 + assemble).
  Artifact `moon-trees-gullak-full-quality` (9,297,626 bytes).

## Verification results (final file — full MP4, checked by coordinator)
- ffprobe: h264, 1080×1920, 30 fps, aac, duration **60.000000 s**,
  9,403,364 bytes. No watermark, no title card, no end card.
- Audio: loudnorm (re-encoded to −14 LUFS like v3): measured **−14.66 LUFS**,
  true peak **−1.34 dB** (better than v3's +0.49); silencedetect:
  **ZERO silences < −40 dB**.
- Whole-video watch: 60 frames at 1 fps read (6 contact sheets) + 21 beat
  cuts + 6 sub-phase flips checked before/after (54 frames, 3 contact
  sheets) + 10 full-res spot frames — all CLEAN hard cuts, no ghosting, no
  double-exposure, no frozen frames; motion continues throughout (rockets
  rise, capsule orbits the diagram, seeds drift, mouths move, count-ups run).
- Hook f15 ✓ (canister ECU, Earth + Moon, "1971 • NASA", Sub "500 seeds flew
  around the Moon", caption "500 seeds" gold — shocking line starts in frame 1).
- Numbers at exact windows: "500 SEEDS" f60 ✓ (count-up complete) /
  "34 ORBITS" f525 ✓ / "420 SEEDLINGS" f990 ✓ / "50 STATES" f1155 ✓ /
  "110 FOUND" f1529 ✓ / "1,000 SEEDS" f1713 ✓ (count-up complete).
- Wildfire flip f1030 ✓ (badge orange, trays reframe, "stubborn as weeds"
  Sub appears); BURST f657 ✓; 110 pill pop f1519 ✓ (clippings, then pill).
- Middle 12–45 s sweep: all clean; caption gaps only at natural sentence
  pauses (e.g. f446, f1085, f1713 — the deliberate slower-VO pauses).
- Point-to-point: every checked frame shows exactly what the words say,
  except minor #5 below.
- Captions: 48 px, bottom-centre, gold active word + pop on every checked
  frame; never overlapping a character or prop; only one pill at a time.
- Deliverable: `~/workspace/your_files/why-clips-moon-trees-v4.mp4`
  (9,403,364 bytes). Thumbnail: `thumbnail-moon-trees-v4.png` (hook f15).
  Upload pack: `upload-pack.md` (updated to v4; title/description/hashtags
  UNCHANGED from v3).
- Upload: 21:00 cron still points to v3 — the parent switches it to v4 only
  after Azhar approves v4. v4 builder did NOT touch any cron and did NOT
  upload anything.

## Remaining minors (honest, none blocking)
1. "EX-FOREST FIREFIGHTER" badge pill's left rounded corner touches the frame
   edge (beat camera C1 zoom) — text fully readable.
2. R2's first ~1 s (f1633–1660) is a bare rocket on empty navy until the
   canister (f1656) and "1,000 SEEDS" pill (f1661) pop in.
3. O5's faded seed pile behind the red X is barely visible.
4. Wildfire flip (f1030): the top tray's rightmost sprout + the blue door are
   cropped at the right frame edge by the C2 camera zoom (same family as v3's
   tray/door overlap).
5. "schoolteacher asked NASA" (f1342–1383) plays over the FORGOTTEN visual;
   the teacher visual arrives at f1408 on "where are they?" — matches the
   speech bubble, but the word "schoolteacher" itself has no teacher on screen.
6. Within-beat frames can look near-identical 1 s apart (BURST f690 vs f705,
   O5 red-X frames) — expected: beats change every ~3 s, not every second.
7. No caption in the final 0.42 s (last word ends 59.58 s) — same as v2/v3.
8. Launch rocket's nose briefly crosses the right end of the "APOLLO 14 •
   JAN 1971" badge in A1's last ~0.3 s (f287–297) — pre-existing v2 geometry,
   unchanged.

