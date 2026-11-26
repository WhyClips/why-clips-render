# BUILD NOTES — Why Clips: The Moon Trees — "NASA Flew 500 Seeds Around the Moon — The Trees Are Still Standing"

60.000 s, 1080×1920, 30 fps, 1800 frames. Built 26 Nov 2026.
Template: `../therealwhy-project` (5 reusable 3D sets, ink → lens blur → bloom OFF → grade, MSAA 4).
DIRECTION (Azhar, 26 Nov 07:25 — supersedes the Grigware fix list): SAME style exactly as the
current videos (Fruit Flies v2 / therealwhy template as-is). ONLY TWO changes: (1) caption
animation — active word pops + turns gold; (2) line animation — in-scene numbers pop in with
an overshoot scale + count up through step textures. Nothing else redesigned.

## Topic (source of truth: parent brief, 26 Nov 2026)

Apollo 14, Jan 1971 (31 Jan–9 Feb). While Alan Shepard and Edgar Mitchell walked on the Moon,
Stuart Roosa orbited alone in command module Kitty Hawk with a tiny 6-inch canister holding
about 500 seeds of five species (loblolly pine, sycamore, sweetgum, redwood, Douglas fir).
Roosa was a former Forest Service smoke jumper; the Forest Service chief asked him to take
the seeds. The seeds ORBITED the Moon 34 times — NEVER landed on the surface. On splashdown
the canisters burst open during decontamination; seeds spilled, mixed, presumed dead. The
Forest Service tried anyway — Gulfport, Mississippi + Placerville, California — ~420–450
germinated. For America's 200th birthday (1976) seedlings went to all 50 states; first
official planting 6 May 1975, Washington Square Park, Philadelphia (sycamore); a loblolly
pine at the White House; others to Brazil, Switzerland, one to Emperor Hirohito of Japan.
Nobody kept a list; trees forgotten. In 1996 a third-grade teacher asked NASA where they
were; NASA scientist David Williams hunted them down from old newspaper clippings and found
~110; ~30 had already died. Artemis I (2022) carried 1,000 new seeds around the Moon.
Roosa died Dec 1994.
Sources: NASA "Celebrating Moon Trees on Arbor Day", Wikipedia "Moon tree", Britannica
"Moon tree", NASA NSSDC "The Moon Trees".
Freshness 26 Nov 2026: the morning's two Video Employee queries found no Short. A second
build-time query ("Moon Tree seeds Apollo 14 Stuart Roosa planted") surfaced ONE English
Short: https://www.youtube.com/shorts/BAqcj5sG-Yc — a PERSONAL anniversary-gift / cyanotype-art
video (a wife's gift; Moon Trees as one element of a family-synchronicity story), NOT a
dedicated telling of the Moon Trees narrative (no canister burst, no 50-state planting, no
forgotten-trees hunt, no Artemis I). Under the Fruit Flies standard (a mention/component does
not count), this is NOT a dedicated Moon Trees story Short — build PROCEEDED. Flagged for
the parent to overrule if they disagree.

## Script + VO + audio

- Script v3: `script-moon-trees.txt`, 236 words. Beats: hook "In 1971, NASA flew five hundred
  tree seeds around the Moon…" → setup (Apollo 14, Roosa alone, tiny canister, ex-forest
  firefighter) → mocker (never touched the Moon, 34 loops, splashdown burst, seeds spilled
  "mixed like spilled salt", everyone thought it was over) → escalation 1 (planted anyway,
  Mississippi + California, 420 seedlings "stubborn as weeds after a wildfire") → escalation 2
  (200th birthday, every state, first planting Philadelphia May 1975, White House pine, Brazil
  + Japan's Emperor) → escalation 3 + "You see" pivot (forgotten, schoolteacher, scientist
  hunted clippings, 110 found, longest-living souvenirs) → payoff, LAST line = Artemis I
  reveal ("…their grandchildren growing right now, maybe in a park near you."). 2 visceral
  metaphors ("mixed like spilled salt", "stubborn as weeds after a wildfire"). No intro, no
  like/subscribe ask, no summary/moral, no end card, no title card, frame 1 mid-action.
- VO: Muse TTS `avocado_v2:casper_1_5x`, speed 120. Six segments, pause-stripped, concatenated
  with 0.5 s silences at 5 segment breaks, NO atempo (raw fit: stripped 57.03 s + 2.5 s breaks).
  Final `audio/voiceover.mp3`: **59.535 s**. Faster-whisper small.en: 225 tokens recognised,
  first word "In" at 0.0 s, last word "you." ends 59.4 s, speech span 59.4 s, **WPM 229.3**
  (script 236 words; Whisper merges a few). 5 segment-break silences (0.56–0.76 s, all on
  beats: House.→Apollo, things.→But, over.→They, wildfire.→For, emperor.→Then) + natural
  phrase pauses 0.4–0.6 s at sentence ends.
- `words.json`: 8 token fixes (225 tokens): "It"+"was" → "While" (Whisper mis-heard "While two
  astronauts walked"), "walk" → "walked", "Russo" → **"Roosa"**, "splashed"+"down." →
  "splashdown.", "everyone" (sprouted) → "every one", "longest"+"living" → "longest-living",
  "moon" → "Moon" everywhere, "living" re-inserted before "things.".
- Audio bed + SFX (`staging/audio/`): `make_bed.py` (pentatonic pluck 112 BPM, bass-forward,
  seed 43, DUR 62 s) plus `mix_sfx.py`: **21 SFX placements, ROTATED set, none from the Matisse
  set and none from the Grigware set**. Moon Trees set: whoosh-air-sweep-01 (0.00), riser-
  space-intro-01 (1.14), whoosh-air-01 (6.90), pop-click-check-01 (11.16), thud-deep-impact-01
  (17.66), shimmer-energy-flow-01 (19.70), thud-factory-metal-01 (23.18), shimmer-whip-accent-01
  (23.94), thud-metallic-01 (26.58), shimmer-sparkle-touch-01 (27.56), riser-orchestra-01
  (31.08), whoosh-fire-01 (33.04), shimmer-fairy-message-01 (34.92), whoosh-sweeping-fast-01
  (37.24), blip-scifi-click-01 (39.48), whoosh-wind-cinematic-01 (42.44), riser-bass-swell-01
  (47.26), riser-trailer-01 (48.52), boom-reverse-impact-01 (52.64), riser-bass-pulse-01
  (55.64), boom-trailer-epic-01 (59.20).
- `music_sfx.wav`: mean −20.0 dB, max −3.0 dB. Silence scan: **zero windows below −40 dB**.

## Code — the two Azhar changes only (+ story props)

- `src/captions.tsx` — CAPTION ANIMATION: chunk = 1–2 words as before; each word is now its
  own span. The ACTIVE word (t inside its [s,e]) pops scale 1.28 → 1.0 (exp settle, τ 0.07 s),
  lifts 3 px, and turns GOLD (#ffd94d); the other word stays white. The chunk rises 8 px → 0
  over its first 0.12 s and fades in over 0.08 s. Size/position/outline unchanged.
- `src/numbers.tsx` + `src/worlds.ts` — LINE ANIMATION: `numberTexture()` exported; every
  number pops in with an overshoot scale (0.5 → ~1.04 → 1.0 over its first 14 frames,
  `easeOutBack` in story.ts, driven in World.update). Count-up numbers swap pre-built step
  textures over their first 18 frames: "500 SEEDS" 100→200→300→400→500; "1,000 SEEDS"
  250→500→750→1,000.
- `src/story.ts` — 10 shots, 1800 f. S1 hook canister ECU 0–207 (workshop) / S2 Mission Control
  207–400 (office) / S3 Roosa + canister 400–520 (workshop) / S4 34 ORBITS 520–700 (office) /
  S5 splashdown burst 700–830 (workshop) / S6 germination 830–1010 (nursery) / S7 Philadelphia
  planting 1010–1240 (street) / S8 White House lawn 1240–1420 (park) / S9 the hunt 1420–1560
  (office) / S10 FINAL Moon Tree 1560–1800 (street, day). FLASH_AT 207, XFADE 8.
- `src/stage.ts` — ROOSA (white jacket + white cap, identity in every era), CONTROLLER (navy),
  SCIENTIST (green), townsfolk. Walk-bob via stroll/march modes in S6; blinks via lidAt.
- `src/worlds.ts` — new code-built hero props: `seedCanister()` (silver 6-inch can, "SEEDS"
  flat label plate on top, scaled 1.6x), `seedPile()` (spilled seeds, grows in S5), `capsule()`
  (Apollo command module on the Mission Control desk). New sets: `buildPark` (White House lawn:
  white columned facade + pediment + path + code-built pine — the Kenney tree_oak prop was
  sight-line culled, S8b's centre ray ends inside its box, so the pine is Batch geometry),
  `buildNursery` (greenhouse + 3 seedling-tray rows + NURSERY sign). Office: Moon poster
  "APOLLO 14 / KITTY HAWK / 34 ORBITS • 1971" (replaces the wanted poster) + "MOON TREE HUNT"
  clippings card on the desk (replaces the fingerprint card). Workshop: canister on the bench
  (replaces the wooden gun). Street: code-built sapling beside Roosa (S7 ceremony + S10 final).
  Room: potted seedling on the desk (replaces the desk gun). In-scene numbers (frame-ranged,
  billboarded): "500 SEEDS" gold set 5 f75–190 (count-up); "34 ORBITS" gold set 3 f585–660;
  "420 SEEDLINGS" gold set 6 f930–1010; "50 STATES" gold sub "1975" set 1 f1060–1140;
  "110 FOUND" gold set 3 f1455–1490; "1,000 SEEDS" gold set 1 f1640–1700 (count-up).

## Stills check — defects found and fixed (local, composer OFF, 0.5 scale)

1. **S1a hook ECU:** canister filled the whole frame, cropped at the edges; wrap-around label
   showed only "SEED". Fixed: camera pulled back to ~1.66 m (pos (0.4,1.6,-69.3)); label is
   now a flat plate on TOP of the canister ("SEEDS" fully readable); torus band re-oriented
   (rotation.y = PI/2, it encircles the body). Re-rendered r10/r5.
2. **"500 SEEDS" cut off at the left edge** (f120: only "EDS"). Fixed: moved to (-0.6,2.3,-65.2),
   scale 0.7. Same geometry pass moved "34 ORBITS" to (-40.2,2.7,4.6) scale 0.7 and
   "420 SEEDLINGS" to (-0.3,1.9,140.8); "110 FOUND" to (-40.5,2.6,3.6) with window cut to
   f1455–1490 (S9a only); "1,000 SEEDS" window cut to f1640–1700 (S10a only).
3. **Moon poster half-cut at the left edge + Roosa half-cut at the right** (f560, S4a). Fixed:
   S4a pulled back to (-34.5,2.2,-5.5), look (-39.3,1.9,3.8), fov 44 — poster + Roosa both fit.
4. **S5: Roosa half-cut at the left edge; seed pile invisible** (f760, 1.2 cm seeds). Fixed:
   S5a pulled back to (3.2,2.0,-72.0), look (0.3,1.1,-67.5), fov 38; seeds enlarged to r 0.02
   and pile grows to 1.5x in World.update.
5. **"420 SEEDLINGS" cut off BOTH sides** (f970: S6b frame narrower than the 2.08 m card).
   Fixed: S6b pulled back to (5.5,2.4,133.5), look (0,1.5,140), fov 40; Roosa moved to
   (1.6,0,140.2) so he stays in frame.
6. **S7 planting had no sapling visible** (f1080: three people standing, no planting). Fixed:
   code-built sapling at (1.3,0,1.0) beside Roosa (Batch geometry — a prop risked the same
   sight-line culling as the pine).
7. **The big pine was INVISIBLE** (f1280: White House lawn with no tree — the Kenney tree_oak
   was sight-line culled: S8b's centre ray ends inside its culling box). Fixed: pine rebuilt
   as Batch geometry (trunk + 3 cones, ~4.5 m) — culling-proof; S8b look restored to (2,1.8,73).
8. **S9b ECU: the teacher's body filled the frame** (f1520: chin cut at the top edge). Fixed:
   S9b pulled back to (-38.0,1.5,-0.8), fov 32.
9. **S10 golden turned the whole street purple** (f1600/f1700: lavender wash, known golden
   shade-term issue — same reason Grigware's S1/S14 went day). Fixed: S10 light "day".
10. **S2a Moon poster "missing"** (f250): NOT a bug — the poster sits off-frame left in that
    wide (it is the S4a shot's subject, visible in f560/f640).
11. **"SEEDS" label read upside-down in the hook ECU** (r5/r10: "SDƎƎS"). The flat plate
    (rotation.x=-PI/2) puts the texture top toward -z, i.e. toward the ECU camera. Fixed:
    the canvas text is now drawn rotated 180° (translate + rotate(PI) in the ctex callback).
12. **"500 SEEDS" still cut at the left edge after the first move** (r120: "00 SEEDS"). The
    S1b 3/4 camera (3.4,1.9,-72.8) projects anything behind the look point far left — no
    world-x position fixes it. Fixed: S1b is now HEAD-ON (0.4,2.0,-71.5), look (0,1.4,-66.5),
    fov 40; number moved to (0,2.3,-65.2). Right-vector math: centre -0.10, half-width 1.29 m
    vs card half 0.91 m — fits.
13. **"420 SEEDLINGS" clipped by the TEXTURE, not the camera** (r970: "0 SEEDLING").
    `numberTexture` drew at a FIXED 200 px font in a 1024 px canvas; "420 SEEDLINGS" is
    ~1600 px wide, so the canvas cut off "4" and "S". (Same overflow hit "500 SEEDS" /
    "1,000 SEEDS" mildly.) Fixed: shrink-to-fit in `numbers.tsx` — measureText first, scale
    the font down so the text fits in 940 px (min 60 px); shadow pass uses the fitted size.
14. **S4b: Roosa's face half-cut at the right edge** (r640). Fixed: S4b pulled left/back to
    (-38.6,1.8,-1.8), look (-39.8,1.5,3.0), fov 38 — controller centre-left, Roosa fully in.
15. **Seed pile still invisible at S5** (r760): 2 cm spheres at 1.5x are sub-pixel at 0.5 scale.
    Fixed: spheres r 0.032, pile grows to 2.5x (0.01 + k*2.49) — a visible brown speckle patch.
16. **S9b ECU: teacher's face still large at the top-right** (r1520, after the pull-back the
    card IS fully readable). Accepted: the ECU's subject is the card; a face looming over the
    desk is the template's own ECU look (same as Grigware's S11c).
17. **"420 SEEDLINGS" clipped by the TEXTURE — see item 13. Re-verified fixed** (s970:
    "420 SEEDLINGS" fully readable, gold, centred). Roosa is half-cut at the left edge of
    S6b (screen -1.35, frame ±1.66) — accepted: S6b is the number + scientist shot, Roosa is
    fully framed in S6a.
18. **Seed pile: first too small (invisible), then too big (tennis balls)** (r760 → s760).
    Fixed: spheres r 0.022 flattened (scale y 0.55, pellet-like), darker browns (#7a5230 /
    #5a3d28), pile grows to 2.0x.
19. **Two S5 staging bugs** (found via s760): the seed-spill burst repeated every 2 s
    (`lt % 2`) — now fires ONCE at the splashdown (lt < 0.5 s); the scientist stood at
    (2.6,-66.2), off-frame left in S5a — moved to (0.9,-66.9), in frame beside Roosa.
20. **"SEEDS" label vs torus band**: the band crossed the middle of the label plate
    ("SE…DS"). Fixed: band moved to x=+0.055 (near the base ring), label plate clear.
    Re-verified (t10): "SEEDS" fully readable.
21. **Seed pile hidden by the hammer head** (t760/t800): the pile at (0.25,-67.8) sat under the
    dark hammer-head box (x 0.35–0.75, z −67.9…−67.7, y 0.65–0.72). Fixed: pile moved to
    (0.15, 0.69, −67.62) — clear of the hammer, spilling in front of the canister.
22. **Scientist invisible in S5** (t760/t800): at (2.6,−66.2) he stood behind the bench (far
    side) and never rendered in S5a. Fixed: moved to the NEAR side of the bench,
    (1.4, 0, −68.8), facing Roosa across the bench — the "leaning over the seeds" staging.
    (Also fixed in the same pass: burst now fires once, see item 19.)
    CAUTION — the first edit used a bare `str.replace(...,1)` and hit the WRONG occurrence
    (S1's scientist, line 47, not S5's): S5's scientist stayed at (2.6,−66.2) while S1's
    moved. Fixed by anchoring the edit on `who(10, SCIENTIST)`. LESSON: always anchor
    character edits on the `who(N, …)` line — several shots reuse the same coordinates.
23. **S1's scientist was also off-frame** (same latent bug: (2.6,−66.2) is outside S1b's
    narrow head-on frame). Moved to (−0.53, 0, −66.2), behind the bench's right end, blob
    moved with him — the "nervous scientist watches" staging the comment describes.
24. **Seed pile: the `//` comment bug** (the big one). My pile-position edit put a `//`
    comment in the MIDDLE of a multi-statement line:
    `pile.position.set(...); // comment pile.scale.setScalar(0.01); grp.add(pile); seedPileRef = pile;`
    — the comment swallowed `grp.add(pile)` AND `seedPileRef = pile`, so the pile was never
    added to the scene and never scaled. Three renders (x760/y760/z760) came back
    byte-identical to w760, which looked like a stale bundler — the red-canister test proved
    the bundler was fine (red760.png differs), and the grep then found the commented-out
    line. Fixed: statements on separate lines. LESSON: NEVER put a `//` comment mid-line
    before other statements; always check with grep that `grp.add` / ref assignments survived
    an edit. (Also fixed in the same pass: canister reverted from the red test colour to silver.)
25. **Spill disc too big** (z2760): the first disc (r 0.3, x-scale 1.4, group scale 2.0 =
    1.68 m wide) read as a giant brown puddle covering the bench. Fixed: r 0.18, x-scale
    1.2, colour #7a5230 — a ~0.43 × 0.36 m patch with pellets on it, left of the canister.
26. **S8b medium: the pine filled the whole frame** (z1360: three giant cones, tophat man
    hidden behind it). The S8b camera was 7 m from a 4.5 m tree. Fixed: pulled back to
    (9.5,2.6,58), look (0.5,2.0,72), fov 42 — pine now a proper medium, Roosa + woman
    clear, White House behind (z21360). The tophat man still stands half-hidden behind the
    pine's left edge (same as S8a) — accepted, two of three characters read clearly.

## GitHub / Actions infrastructure

- Repo: `WhyClips/why-clips-render`. Branch `moon-trees` (code), branch `main` (workflow —
  a workflow file must exist on `main` to be dispatchable). Push via
  `~/workspace/custom-connectors/custom.github/bin/github.py` + `make_manifest.py`
  (skips node_modules symlink, out/, staging/).
- Workflow `.github/workflows/render-moon-trees.yml`: 12 chunks c01–c12, 150 frames each,
  `--gl angle --chromium-flags='{"enable-unsafe-swiftshader":true}'`,
  `--props '{"post":{"bloom":false}}'`, concurrency 1, scale 1, per-chunk timeout 60 min;
  assemble job concats the 12 chunks, mixes `audio/voiceover.mp3` + `audio/music_sfx.wav`
  with amix + limiter 0.95, `-shortest`, measures loudness (target ~−14 LUFS), artifact
  `moon-trees-full-quality`.
- Render run: (to be filled)
- Smoke test (ink verification): run 45762569376, success, ~4 min. V-ink (ink ON, bloom OFF)
  frames 1060–1089: FULL COLOUR, ink outlines crisp (S7a: "50 STATES" gold, sapling, cream
  houses, blue shutters) — the intended config is verified; full render dispatched with
  `--props '{"post":{"bloom":false}}'`.
- Full render: run 45763082156, dispatched 26 Nov 2026 ~08:40 Riyadh (05:40 UTC),
  12 chunks c01–c12 × 150 f. (timing to be filled)
- Composer config (bisection-verified, Grigware): ink ON, lens ON, bloom OFF, grade ON,
  tone NEUTRAL. Render props: `--props '{"post":{"bloom":false}}'`.

## Verification results (final file — V1 render, SUPERSEDED — see V2 below)

- ffprobe (V1): h264, 1080×1920, 30 fps, aac, duration 60.000000 s (audio 59.989 s).
- Audio (V1): loudness −14.62 LUFS, true peak +0.18 dB; silencedetect: ZERO silences < −40 dB.
- Frames point-to-point (V1 final MP4): hook f10 ✓ (SEEDS label, "1971," gold); 500 SEEDS f120 ✓;
  34 ORBITS f640 ✓; spill f760 ✓; 420 SEEDLINGS f970 ✓; 50 STATES f1080 ✓; 110 FOUND f1460 ✓;
  1,000 SEEDS f1670 ✗ (see V2 fix 2); final f1790 ✓ (Roosa + sapling, "near you.").
- TWO defects found in the V1 final MP4 (both invisible in composer-OFF stills — they are
  INK artifacts, only visible in the composited render):
  1. **Laptop screen outline crosses faces** (f250 S2a, f640 S4b, f1460 S9a, f1520 S9b): the
     upright glowing screen (centre y 1.18, top edge y 1.43, pale #bfe3ff ≈ window colour)
     put its ink outline straight across the characters' eyes/mouths, the screen itself
     invisible against the window. Fix: screen lowered + tilted back like a real open laptop
     (centre (−40, 1.02, 2.3), rotation.x −0.85, top edge y ~1.19 — below every chin),
     colour deepened to #8fc3ee so it reads as a screen. Verified with a local composer-ON
     render of f630–650 (out/comp-f640.png): the screen now leans on the desk in front of
     Roosa's chest, faces clean.
  2. **"1,000 SEEDS" clipped at the left edge** (f1670: the "1" half-cut): at scale 1.0 the
     S10a dolly push (0.0022/frame) grows the card through its window until it exceeds the
     frame. Fix: scale 0.8, position moved forward to (0.8, 2.8, 1.0). Verified in still
     v2f1670: "1,000 SEEDS" fully readable, "1" complete.
- V1 deliverable was NEVER delivered to the user, so the V2 render keeps the same
  deliverable filename (why-clips-moon-trees-v1.mp4).

## V2 render (re-render after the two fixes above)

- Full render: run 45763082156 (V1) / **45766328045 (V2)**, dispatched 26 Nov 2026 ~09:10 Riyadh
  (06:10 UTC), 12 chunks c01–c12 × 150 f, all success + assemble success (~21 min).
  Branch commit be418c1c6f7cbaa79bebfd06f0d3d4dc0a6e5298.
- Verification (V2 final MP4, out/final-v2/moon-trees-full-quality.mp4):
  - ffprobe: h264, 1080×1920, 30 fps, aac, duration **60.000000 s**.
  - Audio: loudness **−14.62 LUFS**, true peak **+0.18 dB**; silencedetect: **ZERO silences < −40 dB**.
  - Fix 1 re-verified: f250/f640/f1460/f1520 — faces clean, tilted screen sits on the desk
    below the chins, reads as a laptop.
  - Fix 2 re-verified: f1670 — "1,000 SEEDS" fully readable, "1" complete, inside the frame.
  - Numbers at exact windows (V2): 500 SEEDS f120 ✓, 34 ORBITS f640 ✓, 420 SEEDLINGS f970 ✓
    (V1, unchanged), 50 STATES f1080 ✓ (V1, unchanged), 110 FOUND f1460 ✓, 1,000 SEEDS f1670 ✓.
  - Captions: 1–2 words, ~3% height, bottom-centre, active word gold + pop — verified on
    every checked frame (f10 "1971,", f120 "still", f640, f760 "salt.", f970 "stubborn",
    f1080 "every", f1460 "see,", f1670 "thousand", f1790 tail). No watermark.
  - Locations: workshop, office, nursery, street, park = 5 (≥4). SFX: 21 mapped.
- Deliverable: `~/workspace/your_files/why-clips-moon-trees-v1.mp4` (56,519,842 bytes, V2 render;
  the V1 render was never delivered, so this keeps the v1 filename).
  Thumbnail: `thumbnail-moon-trees.png` (1080×1920, hook ECU f40 — canister + "SEEDS" label).
  Upload pack: `upload-pack.md`.
- Upload cron: runonce Thu 26 Nov 2026 21:00 Asia/Riyadh, id `why-clips-moon-trees-upload-26nov`,
  owner goal:youtube-channel-seekhna, delivery SHORTS chat only
  (`ceb4f4c1-d312-410e-a8e3-189a1db4e692`), via YouTube Studio on `azark4748@gmail.com`,
  Public, "No, it's not made for kids", English. Do NOT touch the Fruit Flies 16:00 cron.
