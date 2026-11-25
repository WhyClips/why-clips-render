# BUILD NOTES — Why Clips: Frank Grigware — "He Escaped Prison With a Wooden Gun — Then Became Mayor"

60.000 s, 1080×1920, 30 fps, 1800 frames. Built 25 Nov 2026.
Template: `../therealwhy-project` (5 reusable 3D sets, ink → lens blur → bloom → grade, MSAA 4).

## Topic (source of truth: `../fresh-topics-research.md` §7)

Frank Grigware, 23, ex-Spokane minor-league baseball player, robbed a Union Pacific mail
train near Omaha in 1909 with four fellow ballplayers — seven sacks of registered mail,
only ~$700. All five got LIFE at Leavenworth, 18 Nov 1909. Prison still being built;
prisoners built it themselves. 21 Apr 1910: six prisoners carved wood into a revolver,
fooled guards, hijacked a supply locomotive and drove it through the prison gates. Five
recaptured within days; Grigware alone escaped. Fled to Canada, became "James Lawrence
Fahey", ran a candy store, built houses, married, raised a family — elected MAYOR of
Spirit River, Alberta in 1916. Double-twist: (1) 24 years later, 1934, police fingerprinted
him for trapping marten foxes out of season — prints matched the FBI wanted poster.
(2) Neighbours raised $10,000 bail, flooded Ottawa and Washington in protest, and with
doubts about his original conviction the U.S. dropped extradition. Never pardoned, never
spent another day in an American prison. Died in Alberta in 1977, aged 91. Other numbers:
reward $50 → $30,000; FBI case closed 1965.
Cautions: mayor 1916 (Clio says 1915 — wrong); 1934 fingerprint match (Wikipedia says
caught 1933 — script says "24 years later" + 1934); haul ~$700 (not $500); spelling
Grigware; town is Spirit River (FBI 2004 says "Peace River" — that's the region).
Sources: FBI "The Five-Decade Fugitive Chase" (2014) + FBI "Catching Crooks in the '30s"
(2004), Clio entry 159546, Wikipedia Leavenworth, Spokesman-Review 12 Jan 2014,
Joe Jackson *Leavenworth Train* (2002).
Freshness re-check 25 Nov 2026: Q1 `site:youtube.com/shorts Frank Grigware wooden gun
escaped prison mayor` — no dedicated Short. Q2 `site:youtube.com/shorts escaped prisoner
wooden gun mayor Canada fingerprint poaching 1934` — no Grigware result. FRESH.

## Script + VO + audio

- Script v2: `script-grigware.txt`, 218 words. Beats: hook sentence 1 "One morning in
  1910, six prisoners broke out of Leavenworth prison — with a gun made of wood." →
  setting (Frank, $700 robbery, life) → escalation (prisoners building their own prison
  "like ants building their own anthill", supply train, drove it through the gates, five
  caught) → mid-story question "So how do you hide for twenty-four years?" → "You see"
  pivot (became someone else, Canada, candy store, mayor 1916) → twist 1 (24 years hiding
  in plain sight, fingerprint for foxes out of season, prints matched a 24-year-old FBI
  file) → double-twist payoff, last line = twist ("He never spent another day in prison
  — and died free at ninety-one."). ≥2 visceral metaphors. No intro, no like/subscribe
  ask, no summary/moral, no end card, no title card, frame 1 mid-action.
- VO: Muse TTS `avocado_v2:casper_1_5x`, speed 85. Six segments, pause-stripped,
  concatenated with 0.5 s silences at 5 segment breaks, atempo 0.9693.
  Final `audio/voiceover.mp3`: **59.386 s**. Faster-whisper small.en: 220 words recognised,
  first word "One" at 0.0 s, last word "ninety-one." ends 59.06 s, speech span 59.06 s,
  **WPM 223.5**. `silencedetect`: exactly 5 silences, 0.55–0.57 s each, at the 5 segment
  breaks (4.56–5.12, 24.59–25.14, 27.02–27.58, 35.28–35.84, 47.83–48.40 s).
  **Pauses: 5, on beats — PASS.**
- `words.json`: 8 token fixes (220 → 218 tokens): "23," → "twenty-three,", "ant"+"hill."
  → "anthill.", "24" → "twenty-four" (×2 + "24-year-old" → "twenty-four-year-old"),
  "prince" → **"prints"** (critical), "$10"+",000" → "$10,000", "91." → "ninety-one.".
- ElevenLabs VO test: OPTIONAL, non-blocking — skipped for time.
- Audio bed + SFX (`../grigware-staging/audio/`): `make_bed.py` (pentatonic pluck 112 BPM,
  bass-forward, seed 41, DUR 62 s) plus a continuous low drone floor (55 Hz amp 0.05 +
  82.5 Hz amp 0.02) — the first bed had two 0.57 s dips below −40 dB. `mix_sfx.py`:
  **17 SFX placements, ROTATED set, none from the Matisse set** (Matisse used:
  whoosh-sweep-small-01, blip-interface-beep-01, shimmer-sparkle-01, whoosh-air-zoom-01,
  whoosh-mysterious-01, whoosh-wind-01, pop-select-click-01, blip-scifi-bleep-01,
  pop-long-01, blip-interface-click-01, riser-big-impact-01, boom-trailer-whoosh-01).
  Grigware set: boom-whoosh-01 (0.00), whoosh-fast-01 (5.28), pop-hard-click-01 (9.32),
  whoosh-cinematic-fast-01 (12.06), whoosh-powerful-air-01 (16.48), boom-blockbuster-01
  (21.72), thud-metal-hit-01 (22.18), blip-tech-alert-01 (25.20), shimmer-magic-sweep-01
  (27.50), whoosh-flying-01 (29.98), riser-horn-01 (34.96), pop-bubble-01 (40.22),
  blip-scifi-confirm-01 (42.62), thud-suspense-hit-01 (45.34), boom-bass-hit-01 (48.50),
  shimmer-fairy-sparkle-01 (51.58), boom-horn-trailer-01 (58.74).
- `music_sfx.wav`: mean −20.9 dB, max −3.0 dB. Silence scan: **zero windows below −40 dB
  in 0–60 s**. Per-0.5 s RMS scan over 0–60 s: **worst window −32.0 dB** (min ≥ −35 dB —
  PASS with 3 dB margin). All 5 VO-pause windows: −26.8, −30.2, −28.6, −16.5, −12.3 dB.

## Code

- `src/story.ts` — TOTAL 1800 frames, 14 shots, FLASH_AT 154, XFADE 8 at every shot
  change. 6 sets. Shot boundaries (frames): S1 hook gun ECU 0–153 (workshop), S2 robbery
  154–359 (train), S3 building prison 360–487 (prison), S4 escape loco 488–658 (prison),
  S5 five recaptured 659–696 (prison), S6 Frank walks away 697–735 (train), S7 question
  736–827 (street), S8 candy store 828–945 (street), S9 mayor 946–1056 (room), S10
  handshakes 1057–1213 (street), S11 fingerprint 1214–1432 (office), S12 the match
  1433–1494 (office), S13 bail crowd 1495–1688 (street), S14 final gun object-only
  1689–1799 (room). Cameras: 2–3 keys per shot, push-in every hold, rolls ≤0.03.
  DOF: cInf 14 on ECUs, 0 on wides. FOREGROUND props in 5 shots.
- `src/stage.ts` — per-shot staging. Outfits: FRANK brown jacket `#6e4b33` + cap (identity,
  all eras), MAYOR dark suit + tophat, BALL white shirts + caps, PRISONER grey + caps,
  GUARD navy + caps. Expressions change per beat, blinks via `lidAt`, contact blobs.
  S14 has no characters (object-only). S12 officer staged with back to camera (OTS).
- `src/worlds.ts` — `buildPrison` (stone facade + LEAVENWORTH sign, gate pillars +
  swung-open iron leaves, tracks z 60–82, half-built wall + scaffolding + stone pile,
  guard tower, side brick walls); `buildTrainYard` (tracks, wooden boxcar, 5 mail sacks,
  signal post, crates/barrel, trees); `woodenGun()` 3D mesh (barrel + cylinder + grip);
  `locomotive()` 3D mesh, animated in `World.update()` during shot 4: z 71.5 → 79.5
  (through the gate), stays at 79.5 after; fingerprint card (3 ink whorls,
  "FINGERPRINT RECORD", "F.B.I. — FILE 1910") on office desk; wanted poster ("WANTED",
  bean-head face, "FRANK GRIGWARE", "$30,000 REWARD", "ESCAPED LEAVENWORTH") on office
  back wall. In-scene numbers (frame-ranged, billboarded): "$700" gold set 6 frames
  300–359; "MAYOR" white sub "1916" set 2 frames 1000–1056; "24 YEARS" gold set 3 frames
  1380–1432; "$10,000" gold sub "BAIL" set 1 frames 1515–1599.
- `src/Root.tsx`: `durationInFrames` 1800. `src/captions.tsx`: words import `words.json`
  (1–2 word chunks, 3% height, bottom-centre, white bold + black outline).

## Composer — BLOOM is the desaturator; INK is safe

- Local composer renders blank (all local stills pale-blue blank); `test-nocomposer.png`
  proves world/characters/numbers/captions work WITHOUT the composer.
- Smoke run 1 (45670685166, 30 frames, full composer): world renders on Actions but
  almost entirely GREY/desaturated (grey sky/house/cobble, black-and-white character,
  white "1,000", gold gone). Ink outlines present, DOF works, contact shadow works.
- Bisection round 1 (45672034063): V1 ink OFF (lens+bloom+tone+grade) STILL GREY
  (188 s for 30 f = 6.3 s/frame) — ink is NOT the desaturator. V2 tone-only FULL COLOUR
  (45 s, 1.5 s/frame). V3 composer OFF FULL COLOUR (29 s, ~1.0 s/frame).
- Bisection round 2 (45673501730): V4 lens OFF (bloom+grade+tone, ink off) GREY
  (84 s, 2.8 s/frame). V5 lens-only (lens+tone) FULL COLOUR (163 s, 5.4 s/frame).
  V6 grade-only (grade+tone) FULL COLOUR (61 s, 2.0 s/frame). **Conclusion: BLOOM is
  the desaturator.** (Pixel samples: V4 sky (79,78,83) R≈G≈B grey; V5 sky (83,46,102),
  V6 sky (83,38,113) saturated.)
- Ink verification smoke (45676801379, `smoke-grigware.yml`, 2×30 frames 190–219):
  V-ink (ink ON, bloom OFF) and V-noink (ink OFF, bloom OFF) are both FULL COLOUR and
  nearly identical (sky (95,166,231) both). Frame read by eye: blue sky gradient,
  golden-brown boxcar with visible ink outlines, green tree/grass, grinning ballplayers
  with ink outlines, Frank brown, mail sacks, tracks, caption "a baseball" bottom-centre.
  **INK IS SAFE.**
- **FINAL composer config: ink ON, lens ON, bloom OFF, grade ON, tone NEUTRAL.**
  Render props: `--props '{"post":{"bloom":false}}'` (in `render-grigware.yml`).
- Measured per-frame costs on Actions (30-frame steps incl. startup): full composer
  ~6.3 s/f; lens-only ~5.4 s/f; bloom+grade (no lens) ~2.8 s/f; tone-only ~1.5 s/f.
  Full video at ~6.5 s/f: 1800 frames ≈ 3.25 h single machine; 12 chunks × 150 f in
  parallel ≈ 16 min wall-clock + ~3 min setup.
- Danish's pipeline said ~16 s/frame with the full post composer; measured on Actions
  we are 2–5× faster. Resume is at **chunk granularity (150 frames)**: re-running a
  failed Actions job only re-runs failed matrix legs; the assemble job concats the 12
  chunk artifacts. To re-render a single chunk, re-dispatch the workflow (all chunks
  re-render) or add a chunk input — the workflow as written has no single-chunk input.

## Stills check — defects found and fixed (rounds 1–2c + 3)

Local stills: `npx remotion still ... --props '{"post":{"composer":false}}' --gl angle
--chromium-flags='{"enable-unsafe-swiftshader":true}'`, scale 0.5, TEMP/TMPDIR
`~/workspace/ricks-clone/remotion-tmp/`. Caption gaps are NOT bugs: f40 blank at 1.33 s
is a 0.28 s word gap ("1910," ends 1.32 → "six" starts 1.6); f400 blank at 13.33 s is a
0.12 s gap ("yet." ends 13.30 → "The" starts 13.42). All gaps >0.35 s in the VO:
0.82 s (wood.→Frank @4.5), 0.7 s (away.→So @24.5), 0.68 s (years?→You @26.8),
0.36 s (1916,→the @33.8), 0.7 s (mayor.→For @35.2), 0.52 s (years,→America's @36.7),
0.58 s (file.→The @47.7) — the 5 segment-break silences plus phrase pauses.

1. **S1 gun ECU:** gun invisible — Frank's giant face + hammer filled the frame, gun
   hidden against his torso, bench tools floated 0.5 m above the bench. Root causes:
   stall-bench fallback scaled by prop `h`/bbox-height; with the iron/gold boxes on it,
   bench top was ~0.64 m, not 0.95 m; template tools at y 0.95 floated. Fixes: removed
   iron box + gold tool from the stall-bench fallback (clean empty bench); prop h
   0.95 → 0.65 (bench top now ~0.65 m); gun to (-0.1, 0.68, -67.95); hammer head
   (0.35,0.65,-67.9)-(0.75,0.72,-67.7), handle (0.5,0.65,-68.15)-(0.6,1.0,-68.05),
   saw (-0.7,0.65,-67.85)-(-0.1,0.69,-67.75), lantern (0.65,0.65,-68.1). **S1 and S14
   light "golden" → "day"** — the golden preset leaves windowless interiors in
   hemisphere-only light and everything reads purple (walls, floor, bench; hemi ground
   colour #6c5c8c). S1b framing of Frank himself was GOOD (stern, hammer, sunset sky).
2. **S1a camera saga (3 rounds):** v1 top-down at 2.48 m — gun a small plank. v2 low 3/4
   at 1.8 m — grip foreshortened to a block, barrel read as a plank. v3 steep ~58° at
   1.44 m with the gun scaled 1.3× and a DARK grip — gun TOO BIG, barrel cut off both
   edges (frame width at 1.44 m is only 0.43 m; the 0.44 m barrel spans 102%).
   **v4: same steep angle pulled back to ~2.27 m (pos (0.5,2.4,-69.3)) — barrel spans
   ~65% of the frame.** Gun changes in `woodenGun()`: barrel 0.05 → 0.07 thick,
   cylinder 0.045 → 0.05 radius, grip 0.06×0.16 → 0.07×0.18 and wood → **woodDark
   #6e4b33** (the L reads only if the grip contrasts with the barrel); both guns
   scaled 1.3×, rotation.y -0.7.
3. **S2a wide (f200):** only 3 of 5 ballplayers visible (2 behind/inside the boxcar).
   Fixed: spots → [[0.2,139.6,1 Frank],[1.0,139.2,3],[-1.2,139.8,4],[2.9,139.2,5],
   [-2.4,139.4,6]] (all in front of boxcar face z 140.5, clear of sack pile x 1.5–2.5,
   z 139.6–141.2).
4. **S2c sacks ECU (f340):** player blocked the frame; "$700" number (2.6 m wide card
   at ~3 m) filled the whole frame and was cut off both sides. Fixed: reframed as a
   MEDIUM — camera (4.5,2.2,135.5), look (1.7,1.0,140.7), fov 36; number scale 1 → 0.7
   at (2.0,1.7,140.8); DOF focus → (2.0,1.0,140.7). S2b look also changed to
   (0.2,1.4,139.8). **PASS** (r3-f340: $700 gold fully visible, ballplayer + sacks +
   boxcar all read).
5. **S3a prison building:** prisoners embedded INSIDE the half-built wall (z 71.5+ vs
   wall front face z 71.2) so the wall hid them; LEAVENWORTH sign cut off ("TH" only).
   Fixed: prisoners moved in front of the wall (z 70.2–70.8). **S3a camera saga:** v1
   (7.0,2.6,60.5) sign cut; v2 pulled back to (11.0,3.4,55.5) — camera went OUTSIDE the
   set (right side wall x 8.8–9.2) and the frame was 100% pink brick wall; **v3
   (8.0,3.2,57.0), look (-1.0,2.4,74), fov 46 — inside the set (x<8.5), sign + builders
   + loco all in frame.** **PASS** (r5-f400: full LEAVENWORTH sign, gate, loco, 1
   prisoner at the wall; the loco reads dark navy/black in shadow — the sun is behind
   the facade from this angle).
6. **S3b builders medium (f450):** only 1 builder visible (others 1.3 m off-axis).
   Fixed: S3b pulled back — pos (0.5,2.2,63.0), fov 38 → **42** (leftmost builder was
   still half cut at the left edge at fov 38). **PASS** (r4-f450: 3 prisoners at the
   wall, scaffolding, stone block, facade; leftmost half-cut at fov 38, fixed by 42).
7. **S4 escape (f550): PASS.** Sign, gate, loco, 5 figures, caption "six men". Two
   prisoners shifted slightly ((−0.4,73.0)→(−1.0,73.4), (0.8,72.6)→(1.6,72.8)) so the
   loco occludes fewer.
8. **S5 recaptured (f680): PASS with a note.** 4 prisoners visible (dazed, marching),
   5th partially hidden; guards out of frame (6.2 m span cannot fit a 9:16 frame at
   this distance). Left as is.
9. **S6 Frank walks away (f715): PASS.** **S9 mayor (f990): PASS** (mayor slightly
   large, desk partly occluded — minor).
10. **S7 question (f780/f800):** EMPTY SKY — ~55% bare blue sky, Frank small on bare
    cobble (camera looked down the gap between the two houses at z 6.5, x ±4.5). Fixed:
    S7a pos (5.5,1.7,-3.5), look (0.5,1.35,1.5); S7b pos (4.2,1.55,-1.0), look
    (0.5,1.35,1.5) — the left house now sits behind Frank; lower eyeline (look y 1.35)
    shrinks the sky. **PASS** (r4-f780/f800: Frank prominent, brick wall + hedge/tree
    behind, lantern foreground bottom-left, sky ~35–40%).
11. **S8 candy store — THE STALL BUG (root cause found):** no stall visible in any
    round. Round 2b moved Frank IN FRONT of the stall at (-4,1.6) — still missing.
    Round 2c re-aimed the S8a/S8b looks at Frank — still missing. **Root cause
    (found 25 Nov ~22:30):** `prop()` culls a Kenney/fallback prop when a CORE sight
    ray (camera → look point, `core: sx === 0 && sy === 0` in `worlds.ts:151`) passes
    through its culling box. The stall-red fallback's box is x ±r, y 0..h, z ±r with
    r ≈ 1.06 (its 2.2 m awning) — so the box spans z 1.44..3.56. Frank at z 1.6 and
    the S8a/S8b look points (z 1.6–1.7) were INSIDE that box, so both centre rays
    ended inside it and the stall was culled for the whole set. **Fix: Frank to
    (-4, 1.2), S8a look (-3.9,1.4,1.2), S8b look (-3.8,1.4,1.2), DOF f890 focus
    (-4,1.4,1.2) — both centre rays now end in front of the box's front face
    (z 1.44).** **PASS** (r6-f870/f920: red awning + counter + crates + Frank grinning
    in front — the candy store reads).
12. **S10 handshakes (f1120):** EMPTY SKY + tophat man cut off at the left edge; no
    visible handshake pose. Fixed: group tightened — townsfolk (-1.2,2.2)→(-0.5,2.0),
    (2.0,2.6)→(1.4,2.3); S10a pos (6.5,2.0,-6.0), look (0.3,1.35,2.0); S10b pos
    (4.0,1.7,-3.5), look (0.5,1.35,1.9); DOF f1140 focus (0.5,1.35,1.9).
    **PASS** (r4-f1120: tophat man + Frank + woman all happy and fully in frame,
    lantern foreground, sky ~45%).
13. **S11 office (f1260/f1350): PASS after the card move.** Card was half-under the
    laptop base (laptop spans x -40.5..-39.5, z 1.9..2.3; card was at (-39.6,2.1)).
    Card moved to (-39.05,0.86,1.9) — fully visible on the desk.
14. **S11c fingerprint ECU (f1410):** card visible but text UPSIDE-DOWN (oriented for
    the officer behind the desk, not the lens); officer's chin/mouth at the top edge.
    Fixed: `fp.rotation.z = Math.PI + 0.15` (180° flip); S11c camera y 1.4 → 1.25,
    look y 0.85 → 0.8. **PASS** (r4-f1410: "FINGERPRINT RECORD" + "F.B.I. — FILE 1910"
    right-way-up, 3 whorls; a sliver of the officer's chin remains at the top edge —
    minor).
15. **S12 OTS poster (f1460):** poster centred and fully legible, BUT the office
    window's horizontal winBar (y 1.85–1.95, z 5.45–5.55, in front of the poster at
    z 5.46) striped horizontally across the poster at the "FRANK GRIGWARE" line.
    Fixed: poster y 2.1 → 2.5 (spans 2.06–2.94; the bar now passes below it); S12a
    look y 2.05 → 2.45; DOF f1433 focus y 2.05 → 2.45. **PASS** (r4-f1460: WANTED /
    FRANK GRIGWARE / $30,000 REWARD / ESCAPED LEAVENWORTH, no stripe). Accepted: S12a
    is a poster-only reveal (the officer is too close to the camera for a true OTS at
    this distance — his shoulder would need to be ~0.22 m off the camera–poster axis;
    S12b covers the officer's shock). Frank is out of frame in S12a — acceptable.
    **S12b (f1480): PASS** — officer shocked (wide eye, open mouth), card right-way-up
    on the desk, window behind.
16. **S13 bail crowd (f1550/f1640): PASS.** "$10,000" gold + "BAIL" sub; crowd shifted
    +0.5 in x so the leftmost figure is no longer cut off (still slightly at the edge
    in f1550 — minor). S13b: Frank + woman laughing, caption "protests,".
17. **S14 final gun:** same ECU problem as S1 (top-down = plank, low 3/4 = foreshortened
    grip). Fixed with the same recipe: gun scaled 1.3×, dark grip, steep ~45° cameras
    pulled back to ~2.15 m — S14a (40.2,2.3,1.3), S14b (38.7,2.3,1.3), look
    (39.55,0.86,2.75). **Re-verification pending (r8-f1720/f1770).**

## GitHub / Actions infrastructure

- Repo: `WhyClips/why-clips-render`. Helper:
  `~/workspace/custom-connectors/custom.github/bin/github.py` (credential stays in
  vault). Added `create-branch` and `cancel` subcommands; `jobs` prints `started_at` /
  `completed_at` and per-step timings.
- Branch `grigware` (code), branch `main` (workflows — a workflow file must exist on
  `main` to be dispatchable; dispatching a branch-only workflow 404s). Push uses
  base_tree so old files persist — include all files every push. Manifest via
  `grigware-project/make_manifest.py`; main workflows via `manifest-main.json`.
- Commits: grigware `c7023a26` (template), `dbf60f78` (bisection v2), `98c563ee`
  (bisection v3), `48e90988` (stills fixes + ink smoke + 12-chunk render), `4590af95`
  (round-2b fixes), `869f302a` (round-2c camera fixes), `e97f7a7b` (S1a low 3/4 ECU —
  superseded). Main: `ffec8648`, `ebcb12de`, `e04916f0`, `c1d4d4b2` (ink smoke +
  12-chunk render workflow).
- Workflows in `grigware-project/.github/workflows/`: `render-smoke.yml` (bisection v3),
  `smoke-grigware.yml` (ink check, 2×30 f, frames 190–219), `render-grigware.yml` v2
  (**12 chunks c01–c12, 150 frames each: 0-149, 150-299, 300-449, 450-599, 600-749,
  750-899, 900-1049, 1050-1199, 1200-1349, 1350-1499, 1500-1649, 1650-1799;
  `--gl angle --chromium-flags='{"enable-unsafe-swiftshader":true}'`,
  `--props '{"post":{"bloom":false}}'`, concurrency 1, scale 1, per-chunk timeout
  60 min; assemble job concats 12 chunks, mixes `audio/voiceover.mp3` +
  `audio/music_sfx.wav` with amix + limiter 0.95, `-shortest`, measures loudness with
  loudnorm (Danish target ~−14 LUFS), writes `chunks-manifest.json`, artifact
  `grigware-full-quality`**).
- **Render history:** run 45678073353 dispatched ~21:43, **cancelled** (round-2c camera
  fixes were not in it). Run 45679489830 dispatched 21:52, **cancelled** (S1a gun ECU
  fix was not in it). **Re-dispatch pending** after the r8 gun stills pass — with the
  FINAL code (S3a v3, S3b fov 42, S8 stall fix, S1a/S14a/S14b v4 cameras, gun 1.3× +
  dark grip).

## Verification checklist (must all pass, checked on the final file)

All 10 Matisse checks PLUS: ≥4 locations; no setup held >5 s; caption height ~3% +
zero collisions; ≥1 in-scene number; ≥1 ECU + ≥1 OTS/object shot; SFX ≥15; pauses
4–5 on beats; mix min ≥−35 dB; duration exactly 60.000 s; 1080×1920 h264+aac.
Already established pre-render: VO 59.39 s / WPM 223.5 / 5 pauses ✓; bed/SFX mix min
−32.0 dB in 0–60 s, zero silence <−40 dB ✓; SFX 17 ✓; tsc clean ✓; freshness ✓;
script facts ✓; composer config verified (ink safe, bloom off) ✓.
Still to do on the final file: ffprobe (1080×1920, 60.000 s, h264+aac), audio mean/min/
silence scan + LUFS measurement, ≥6 frames point-to-point vs script/words, caption
height/collisions, locations count, setup durations, in-scene numbers, ECU/OTS
presence, SFX audibility, pauses, no-watermark check.

## Deliverable / upload (DO NOT DO until all checks pass)

- File: `~/workspace/your_files/why-clips-grigware-v1.mp4` (NEW filename; never
  overwrite a delivered file in place).
- Upload pack in the project folder (title "He Escaped Prison With a Wooden Gun —
  Then Became Mayor"; description: hook + teaser WITHOUT spoiling the twist + 👇
  engagement question + sources line + "Follow Why Clips for a true story that sounds
  made up — every day." + 10–12 hashtags incl. #history #facts #truestory #didyouknow
  #whyclips; thumbnail frame).
- Only then: runonce upload cron for **Wed 26 Nov 2026 21:00 Asia/Riyadh**, delivery
  **SHORTS chat only — `ceb4f4c1-d312-410e-a8e3-189a1db4e692`**, via YouTube Studio on
  `azark4748@gmail.com`, Public, "No, it's not made for kids", English. Verify via
  `cron.view`. Do NOT touch the 16:00 slot (Fruit Flies v2), Sodder files, the Fruit
  Flies cron, or the disabled Matisse cron. Do NOT upload anything myself.
