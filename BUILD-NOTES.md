# BUILD NOTES — Why Clips: "The Man Who Dreamed an Alphabet" (Vai script, Liberia 1833)
# Slot: Sat 28 Nov 2026, 4 PM Riyadh. Channel: @WhyClipsShorts.
# Project: ~/workspace/ricks-clone/vai-script-gullak-project/ (Gullak route, moon-trees tree as base)

## Topic + freshness
- Vai script, Liberia. Momolu Duwalu Bukele, illiterate, dreams a stranger teaches him
  signs; with his family he invents ~200 symbols in a day and a night; within a
  generation Vai people write letters/diaries with berry ink and their own schools;
  inspires 27+ other West African scripts; survives colonial rule + two rival scripts;
  taught at the University of Liberia, in Unicode today.
- FRESH on the live YouTube Shorts filter 28 Nov 08:04 (coordinator). Web-search sanity
  check 28 Nov ~08:10 PASSED: only the compilation Short "The Writing Systems Africa
  Had Before Colonizers Arrived" (Vai one item in a list) and Bamum-script Shorts
  (King Njoya, Cameroon 1896 — DIFFERENT story/person/country). No dedicated English
  Short on the Vai story. Script names Liberia + Vai + 1833 + Bukele prominently.
- Accuracy: dream presented as Vai tradition, documented by missionaries from 1834
  (Bukele told it to Sigismund Koelle, 1849). Cherokee-link caveat in the script:
  "Some say he may have glimpsed another alphabet first — but nobody disputes he
  built this one himself." (Tuchscherer & Hair, 2002.)

## Script (194 words)
See script-vai-script.txt. Hook: "A man who couldn't read or write dreamed a whole
alphabet — and by morning, his language could be written." "You see" pivot:
"writing wasn't handed to Africa. It was dreamed there." Final twist: "And the man
who started it all never learned to read a word anyone else had written."

## Voiceover
- TTS: avocado_v2:casper_1_5x. Speed is NON-LINEAR and varies run to run:
  speed 94 -> 67.992s (171.2 WPM, too slow); speed 108 -> 57.672s (201.8 WPM);
  speed 106 -> 54.984s (211.7 WPM — faster than 108!). Used the speed-108 render
  + ffmpeg atempo=0.9742 -> 59.195s, 196.6 WPM, last word ends 58.76s.
  (voiceover-raw108.mp3 kept as the atempo source; voiceover.mp3 is the stretched VO.)
- Word timings: faster-whisper small.en (word_timestamps=True, ffmpeg-PCM decode —
  the fw venv's PyAV av.open is broken; see audio/word_timings.py). 194 tokens,
  1:1 with the script. Fixes: "Duolu"->"Duwalu", "vi"->"Vai" (x2). audio/words.json +
  src/videos/fruitflies/words.json.
- Mouth cues: Rhubarb 1.13.0 -> 349 cues, 0.00-59.19s, v2 mapping
  (A/X->closed, B/C/D/E->open, F/G/H->grin). audio/rhubarb-vai.json +
  src/videos/fruitflies/mouthCues.json.

## Music bed (NEW, never reused)
- F major pentatonic (F G A C D), 92 BPM, seed 131, sine-bell keys + warm
  detuned-sine pad (F–Bb–C–Dm) + gentle sine bass, F2/F3 drone floor.
  Hook light (first 6s 0.55x, ramps in by 8s), twist loud (last 8s to 1.35x).
  RMS ~-24 dBFS. audio/make_bed_vai.py -> audio/music_synth.wav.
- BANNED beds (never reuse): C-major pluck 112 BPM seed 43 (Fruit Flies);
  A-minor triangle 96 BPM seed 71 (Moon Trees); D-major sine-bell 104 BPM seed 97 (Segway).

## SFX (12, light bed rule: bed volume 0.5 in the mix, ~18-20 dB below VO)
- ROTATION NOTE (exhausted pool): the 78-sound library has only 2 files never used
  across Moon Trees v1/v2/v4 + Segway + Sued Himself (drone-rain-loop-01,
  glitch-static-01). Strict non-reuse is impossible. This set reuses 11 files from
  the OLDEST set (Moon Trees v1, 26 Nov) + the 1 free file (drone-rain-loop-01),
  and asserts NONE from Moon Trees v2, Moon Trees v4, Segway or Sued Himself.
- MAP (anchor -> file @ time): alphabet->shimmer-fairy-message-01 @2.28s;
  dream->shimmer-sparkle-touch-01 @10.86s; 200->blip-scifi-click-01 @19.92s;
  dream.->boom-reverse-impact-01 @27.22s; himself.->thud-metallic-01 @31.56s;
  letters,->pop-click-check-01 @34.02s; fire->whoosh-fire-01 @40.44s;
  scripts.->whoosh-sweeping-fast-01 @42.90s; there.->riser-orchestra-01 @46.44s;
  survives->drone-rain-loop-01 @47.36s; phones.->shimmer-energy-flow-01 @54.86s;
  written.->boom-trailer-epic-01 @58.60s.
- audio/music_sfx.wav: mean -24.5 dB, max -3.0 dB, 0 silence windows below -40 dB.

## Visuals
- 7 scenes, 25 beats (each <=100f / 3.33s), hard cuts, beat camera reframes.
  Mid-beat flips: P1 gold "IT WAS DREAMED THERE" pops at f1376; L3 schoolhouse ->
  flame at f1195; P3 "200 YEARS" pill at f1495.
- Number pills: 1833 (S1), 200 SYMBOLS (I2), 27 SCRIPTS (L4), 200 YEARS (P3).
- Custom plates: NightPlate (dream), VillagePlate (Liberia village) — AirfieldPlate
  REJECTED (runway + hangar wrong for 1833 Liberia); ParisPlate (Eiffel Tower) also
  wrong. Reused: ChalkPlate (infographics/pivot/final), InteriorPlate (letters),
  StormPlate (colonial rule).
- Custom props (props-vai.tsx): abstract Vai-like glyph marks (NOT real Vai Unicode),
  GlyphTile/Grid, DreamCloud, BerryInk, Schoolhouse, MapLiberia (gold Liberia + star),
  PhoneUnicode, Flame, University, Diary, UnreadLetter. Bukele = raw Chibi (no tie).
- Stills QA (25 frames, out/stills/): all 25 beats checked. ONE fix: O3's "↔" text
  arrow was tiny — replaced with a drawn gold SVG double-arrow, re-rendered f870, verified.

## Render
- (to fill: GitHub run id, dispatch time, artifact, ffprobe, loudnorm, QA result)

## Minors (honest)
- (to fill after final-MP4 QA)
