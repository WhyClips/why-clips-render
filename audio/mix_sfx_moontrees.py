#!/usr/bin/env python3
"""Moon Trees Gullak — mix the NEW bed with 21 mapped SFX (ROTATED set).
NONE of the 21 files used in Moon Trees v1 are reused here (banned list in
BANNED_V1 below). Anchors are Whisper word times from words.json
(copied from moon-trees-project/src/words.json — identical to the Gullak copy).
Each SFX is trimmed to max 3s (several library drones are 12-19s long) so
the mix stays ~62s; final output trimmed to exactly 62s.
Writes music_sfx.wav. Run from moon-trees-gullak-project/audio.
Verifies level + silence scan at the end."""
import json, subprocess, sys, shutil

SFX = "/home/hatch/workspace/goals/youtube-channel-seekhna/hidden_files/sfx-library"

BANNED_V1 = {
    "whoosh-air-sweep-01", "riser-space-intro-01", "whoosh-air-01",
    "pop-click-check-01", "thud-deep-impact-01", "shimmer-energy-flow-01",
    "thud-factory-metal-01", "shimmer-whip-accent-01", "thud-metallic-01",
    "shimmer-sparkle-touch-01", "riser-orchestra-01", "whoosh-fire-01",
    "shimmer-fairy-message-01", "whoosh-sweeping-fast-01", "blip-scifi-click-01",
    "whoosh-wind-cinematic-01", "riser-bass-swell-01", "riser-trailer-01",
    "boom-reverse-impact-01", "riser-bass-pulse-01", "boom-trailer-epic-01",
}

# (anchor word, sfx file, offset seconds from the anchor, volume)
MAP = [
    ("In", "whoosh-air-zoom-01.wav", 0.0, 0.7),          # S1 hook: seed reveal
    ("NASA", "drone-deep-space-01.wav", 0.0, 0.6),       # S1 NASA flew seeds
    ("Apollo", "boom-trailer-whoosh-01.wav", 0.0, 0.7),   # S2 launch
    ("Roosa", "blip-scifi-bleep-01.wav", 0.0, 0.6),       # S2 Roosa intro
    ("But", "thud-suspense-hit-01.wav", 0.0, 0.8),        # S3 mocker turn
    ("34", "blip-tech-alert-01.wav", 0.0, 0.6),           # S4 34 orbits
    ("burst,", "boom-explosion-afar-01.wav", 0.0, 0.7),   # S5 canister burst
    ("spilled", "shimmer-magic-sweep-01.wav", 0.0, 0.6),  # S5 seeds spill
    ("over.", "thud-soft-punch-01.wav", 0.0, 0.6),        # S5 "thought it was over"
    ("planted", "drone-breeze-trees-01.wav", 0.0, 0.6),   # S6 planting / trees
    ("420", "riser-big-impact-01.mp3", 0.0, 0.7),         # S6 420 seedlings reveal
    ("wildfire.", "whoosh-powerful-air-01.wav", 0.0, 0.7),# S6 wildfire metaphor
    ("birthday,", "shimmer-fairy-sparkle-01.wav", 0.0, 0.6), # S7 200th birthday
    ("Philadelphia,", "whoosh-cinematic-fast-01.wav", 0.0, 0.7), # S7 first planting
    ("White", "blip-interface-beep-01.wav", 0.0, 0.6),    # S7/S8 White House pine
    ("forgotten,", "drone-cinematic-wind-01.wav", 0.0, 0.6), # S9 trees forgotten
    ("110", "riser-horn-01.wav", 0.0, 0.7),               # S9 110 found
    ("You", "glitch-virtual-quick-01.wav", 0.0, 0.7),     # S9 "You see" pivot
    ("2022,", "boom-blockbuster-01.wav", 0.0, 0.8),       # S10 Artemis 2022
    ("thousand", "extra-heartbeat-trailer-01.wav", 0.0, 0.7), # S10 1,000 seeds
    ("you.", "boom-bass-hit-01.wav", 0.0, 0.8),           # S10 final twist hit
]

for _a, f, _o, _v in MAP:
    stem = f.rsplit(".", 1)[0]
    assert stem not in BANNED_V1, f"BANNED v1 file reused: {f}"
assert len({f for _a, f, _o, _v in MAP}) == len(MAP), "duplicate SFX file"
print(f"rotation check OK: {len(MAP)} SFX, none from the v1 banned list")

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

inputs = ["-i", "music_synth.wav"]
filters = []
for i, (a, f, t, v) in enumerate(times):
    inputs += ["-i", f"{SFX}/{f}"]
    ms = int(round(t * 1000))
    filters.append(f"[{i+1}:a]atrim=0:3,adelay={ms}|{ms},volume={v}[s{i}]")
stages = []
cur = "[0:a]"
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
