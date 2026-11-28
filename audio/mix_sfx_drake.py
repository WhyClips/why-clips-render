#!/usr/bin/env python3
"""Drake–Cimarrones Gullak v1 — mix the NEW bed (E minor, 108 BPM, seed 97)
with 12 mapped SFX (FRESH ROTATED set).
NONE of the files used in Moon Trees v1 (BANNED_V1), v2 (BANNED_V2) or v4
(BANNED_V4) are reused here, and none of Fruit Flies' 3 (all inside
BANNED_V2) either. Anchors are Whisper word times from the Drake words.json
(196-word script, speed-94 VO, 194 tokens).
Each SFX is trimmed to max 3s (several library drones are 12-19s long) so
the mix stays ~62s; final output trimmed to exactly 62s.
Writes music_sfx.wav. Run from drake-cimarrones-gullak-project/audio.
Verifies level + silence scan at the end."""
import json, subprocess, sys

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

BANNED_V2 = {
    "whoosh-air-zoom-01", "drone-deep-space-01", "boom-trailer-whoosh-01",
    "blip-scifi-bleep-01", "thud-suspense-hit-01", "blip-tech-alert-01",
    "boom-explosion-afar-01", "shimmer-magic-sweep-01", "thud-soft-punch-01",
    "drone-breeze-trees-01", "riser-big-impact-01", "whoosh-powerful-air-01",
    "shimmer-fairy-sparkle-01", "whoosh-cinematic-fast-01", "blip-interface-beep-01",
    "drone-cinematic-wind-01", "riser-horn-01", "glitch-virtual-quick-01",
    "boom-blockbuster-01", "extra-heartbeat-trailer-01", "boom-bass-hit-01",
}

BANNED_V4 = {
    "whoosh-air-hit-01", "drone-space-01", "boom-whoosh-01",
    "blip-scifi-confirm-01", "thud-metal-hit-01", "blip-robot-click-01",
    "whoosh-fast-01", "boom-explosion-battle-01", "shimmer-sparkle-01",
    "drone-thunder-rumble-01", "whoosh-wind-01", "boom-horn-trailer-01",
    "whoosh-flying-01", "pop-bubble-01", "whoosh-sweep-small-01",
    "drone-ancient-drums-01", "glitch-rewind-01", "boom-glass-suspense-01",
    "bed-intense-epical-drums-03", "drone-high-tech-01", "thud-whip-echo-01",
}

# (anchor word, sfx file, offset seconds from the anchor, volume)
# Order MUST follow word order in words.json (sequential forward search).
MAP = [
    ("oceans", "whoosh-mysterious-01.wav", 0.0, 0.7),        # hook: two oceans reveal
    ("mule", "whoosh-swipe-zoom-01.wav", 0.0, 0.7),          # mule train enters
    ("jungle,", "drone-rain-loop-01.wav", 0.0, 0.6),         # jungle ambience
    ("cimarrones,", "pop-hard-click-01.wav", 0.0, 0.6),      # CIMARRONES badge pop
    ("melted", "whoosh-vacuum-01.wav", 0.0, 0.7),            # vanish into the trees
    ("raiding", "whoosh-arrow-01.wav", 0.0, 0.7),            # raiding the treasure road
    ("jungle", "drone-thunder-rain-01.wav", 0.0, 0.6),       # "The jungle knew him"
    ("Mandinga", "pop-select-click-01.wav", 0.0, 0.6),       # Pedro badge pop
    ("deal.", "blip-interface-click-01.wav", 0.0, 0.6),      # deal struck
    ("ambushed", "whoosh-fast-transitions-01.wav", 0.0, 0.7),# ambush whoosh
    ("riverbed.", "whoosh-tunnel-reverb-01.wav", 0.0, 0.6),  # treasure hidden
    ("Pacific", "whoosh-stutter-01.wav", 0.0, 0.7),          # the big reveal
]

for _a, f, _o, _v in MAP:
    stem = f.rsplit(".", 1)[0]
    assert stem not in BANNED_V1, f"BANNED v1 file reused: {f}"
    assert stem not in BANNED_V2, f"BANNED v2 file reused: {f}"
    assert stem not in BANNED_V4, f"BANNED v4 file reused: {f}"
assert len({f for _a, f, _o, _v in MAP}) == len(MAP), "duplicate SFX file"
print(f"rotation check OK: {len(MAP)} SFX, none from v1/v2/v4 sets")

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
