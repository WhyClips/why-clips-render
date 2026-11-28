#!/usr/bin/env python3
"""Vai script Gullak — mix the NEW bed (F major, 92 BPM, seed 131) with 12
mapped SFX.
LIGHT BED RULE (Azhar 27 Nov 14:15): the bed is attenuated to volume 0.5
(~-6 dB) in this mix so it sits ~18-20 dB below the VO — continuous and
never silent, never loud. SFX stay moderate (0.5-0.8).
Anchors are Whisper word times from audio/words.json (194-word script,
Casper speed 108 atempo-stretched to 59.19s, 194 tokens). Each SFX is
trimmed to max 3s; final output trimmed to exactly 62s.
Writes music_sfx.wav. Run from vai-script-gullak-project/audio.
Verifies level + silence scan at the end.

SFX ROTATION NOTE (exhausted pool): the 78-sound library has only 2 files
never used across Moon Trees v1/v2/v4 + Segway + Sued Himself
(drone-rain-loop-01, glitch-static-01). Strict non-reuse is impossible.
This set reuses 11 files from the OLDEST set (Moon Trees v1, 26 Nov) + the
1 free file (drone-rain-loop-01) — and asserts NONE from Moon Trees v2,
Moon Trees v4, Segway or Sued Himself. The parallel Drake–Cimarrones build
faces the same pool; small overlap with it is acceptable, near-identical
sets are not.
"""
import json, subprocess, sys

SFX = "/home/hatch/workspace/goals/youtube-channel-seekhna/hidden_files/sfx-library"

# Moon Trees v2 set — NEVER reuse in Vai.
BANNED_V2 = {
    "whoosh-air-zoom-01", "drone-deep-space-01", "boom-trailer-whoosh-01",
    "blip-scifi-bleep-01", "thud-suspense-hit-01", "blip-tech-alert-01",
    "boom-explosion-afar-01", "shimmer-magic-sweep-01", "thud-soft-punch-01",
    "drone-breeze-trees-01", "riser-big-impact-01", "whoosh-powerful-air-01",
    "shimmer-fairy-sparkle-01", "whoosh-cinematic-fast-01", "blip-interface-beep-01",
    "drone-cinematic-wind-01", "riser-horn-01", "glitch-virtual-quick-01",
    "boom-blockbuster-01", "extra-heartbeat-trailer-01", "boom-bass-hit-01",
}

# Moon Trees v4 set — NEVER reuse in Vai.
BANNED_V4 = {
    "whoosh-air-hit-01", "drone-space-01", "boom-whoosh-01",
    "blip-scifi-confirm-01", "thud-metal-hit-01", "blip-robot-click-01",
    "whoosh-fast-01", "boom-explosion-battle-01", "shimmer-sparkle-01",
    "drone-thunder-rumble-01", "whoosh-wind-01", "boom-horn-trailer-01",
    "whoosh-flying-01", "pop-bubble-01", "whoosh-sweep-small-01",
    "drone-ancient-drums-01", "glitch-rewind-01", "boom-glass-suspense-01",
    "bed-intense-epical-drums-03", "drone-high-tech-01", "thud-whip-echo-01",
}

# Segway set — NEVER reuse in Vai.
BANNED_SEGWAY = {
    "whoosh-arrow-01", "whoosh-tunnel-reverb-01", "pop-select-click-01",
    "drone-thunder-rain-01", "extra-typewriter-01", "pop-long-01",
    "whoosh-stutter-01", "pop-hard-click-01", "whoosh-swipe-zoom-01",
    "whoosh-vacuum-01", "whoosh-fast-transitions-01", "whoosh-mysterious-01",
}

# Sued Himself set — NEVER reuse in Vai.
BANNED_SUED = {
    "whoosh-swipe-zoom-01", "pop-hard-click-01", "drone-thunder-rain-01",
    "whoosh-arrow-01", "extra-typewriter-01", "whoosh-mysterious-01",
    "whoosh-tunnel-reverb-01", "pop-long-01", "whoosh-stutter-01",
    "whoosh-fast-transitions-01", "blip-interface-click-01", "whoosh-vacuum-01",
}

# (anchor word, sfx file, offset seconds from the anchor, volume)
# Order MUST follow word order in words.json (sequential forward search).
# 11 from Moon Trees v1 (oldest set) + 1 never-used file (drone-rain-loop-01).
MAP = [
    ("alphabet", "shimmer-fairy-message-01.wav", 0.0, 0.6),   # hook: alphabet dreamed
    ("dream", "shimmer-sparkle-touch-01.wav", 0.0, 0.6),      # stranger in a dream
    ("200", "blip-scifi-click-01.wav", 0.0, 0.6),             # 200 symbols count
    ("dream.", "boom-reverse-impact-01.wav", 0.0, 0.7),       # not from a dream
    ("himself.", "thud-metallic-01.wav", 0.0, 0.6),           # built this one himself
    ("letters,", "pop-click-check-01.wav", 0.0, 0.7),         # letters, diaries
    ("fire", "whoosh-fire-01.wav", 0.0, 0.7),                 # idea catches fire
    ("scripts.", "whoosh-sweeping-fast-01.wav", 0.0, 0.7),    # 27 other scripts
    ("there.", "riser-orchestra-01.wav", 0.0, 0.7),           # dreamed there (pivot)
    ("survives", "drone-rain-loop-01.wav", 0.0, 0.5),         # survives 200 years (free file)
    ("phones.", "shimmer-energy-flow-01.wav", 0.0, 0.6),      # text on phones
    ("written.", "boom-trailer-epic-01.wav", 0.0, 0.8),       # final twist hit
]

for _a, f, _o, _v in MAP:
    stem = f.rsplit(".", 1)[0]
    assert stem not in BANNED_V2, f"BANNED v2 file reused: {f}"
    assert stem not in BANNED_V4, f"BANNED v4 file reused: {f}"
    assert stem not in BANNED_SEGWAY, f"BANNED segway file reused: {f}"
    assert stem not in BANNED_SUED, f"BANNED sued file reused: {f}"
assert len({f for _a, f, _o, _v in MAP}) == len(MAP), "duplicate SFX file"
print(f"rotation check OK: {len(MAP)} SFX, none from Moon Trees v2/v4, Segway or Sued Himself "
      f"(11 from Moon Trees v1 oldest set + 1 never-used, pool exhausted)")

w = json.load(open("words.json"))
idx = 0
times = []
for anchor, f, off, vol in MAP:
    for j in range(idx, len(w)):
        if w[j]["w"] == anchor:
            times.append((anchor, f, w[j]["s"] + off, vol))
            idx = j + 1
            break
    else:
        print(f"ANCHOR NOT FOUND: {anchor}", file=sys.stderr); sys.exit(1)

for a, f, t, v in times:
    print(f"  {t:6.2f}s  {f}  (anchor '{a}')")

# LIGHT BED: bed input attenuated to 0.5 (~-6 dB) so it sits ~18-20 dB
# below the VO in the final mix (Azhar 27 Nov 14:15 rule).
inputs = ["-i", "music_synth.wav"]
filters = ["[0:a]volume=0.5[bed]"]
for i, (a, f, t, v) in enumerate(times):
    inputs += ["-i", f"{SFX}/{f}"]
    ms = int(round(t * 1000))
    filters.append(f"[{i+1}:a]atrim=0:3,adelay={ms}|{ms},volume={v}[s{i}]")
stages = []
cur = "[bed]"
for i in range(len(times)):
    stages.append(f"{cur}[s{i}]amix=inputs=2:duration=longest:normalize=0[m{i}]")
    cur = f"[m{i}]"
stages.append(f"{cur}alimiter=limit=0.95,atrim=0:62[aout]")
fc = ";".join(filters) + ";" + ";".join(stages)
cmd = ["ffmpeg", "-y", "-v", "error"] + inputs + [
    "-filter_complex", fc, "-map", "[aout]", "-ar", "44100", "-ac", "2",
    "music_sfx.wav"]
r = subprocess.run(cmd)
if r.returncode != 0:
    sys.exit(r.returncode)
print("wrote music_sfx.wav")
# verify levels + silence scan
subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                "-of", "csv=p=0", "music_sfx.wav"])
r = subprocess.run(["ffmpeg", "-v", "info", "-i", "music_sfx.wav", "-af",
                    "volumedetect", "-vn", "-sn", "-dn", "-f", "null", "-"],
                   capture_output=True, text=True)
for line in r.stderr.splitlines():
    if "mean_volume" in line or "max_volume" in line:
        print(line.strip())
r = subprocess.run(["ffmpeg", "-v", "info", "-i", "music_sfx.wav", "-af",
                    "silencedetect=noise=-40dB:d=0.5", "-vn", "-sn", "-dn", "-f", "null", "-"],
                   capture_output=True, text=True)
sil = [l for l in r.stderr.splitlines() if "silence_" in l]
print("silence windows below -40dB (>=0.5s):", len(sil))
