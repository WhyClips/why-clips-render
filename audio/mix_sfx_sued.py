#!/usr/bin/env python3
"""Sued Himself — mix the NEW bed (D minor, 108 BPM, seed 17) with 12 mapped
SFX (FRESH ROTATED set #4).
NONE of the files used in Moon Trees v1 (BANNED_V1), v2 (BANNED_V2) or v4
(BANNED_V4) are reused here — asserted in the script. Fruit Flies used
synthesized in-code SFX, not library files, so no conflict there.
Anchors are Whisper word times from words.json (196-word script, Casper
speed-92 VO stretched to 59.385s, 190 tokens).
DUCKING (Azhar 27 Nov 14:15: bed ~18-20 dB below VO, strong ducking): the
bed is ducked by a gain envelope derived from the VO's own RMS — full level
(1.0) in pauses, 0.30 (~-10.5 dB) under speech, smoothed over ~250 ms.
SFX ride on top UNDUCKED so every action punch lands at full level.
Each SFX is trimmed to max 3s (several library drones are 12-19s long) so
the mix stays ~62s; final output trimmed to exactly 62s.
Writes music_sfx.wav. Run from sued-himself-gullak-project/audio.
Verifies level + silence scan at the end."""
import json, subprocess, sys
import numpy as np
from scipy.io import wavfile

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
# NOTE: "himself." is the SECOND occurrence (37.24s, "From himself.") — the
# sequential search skips the hook's "Himself." (4.5s) because "cell." comes
# first in the map.
MAP = [
    ("1995,", "whoosh-swipe-zoom-01.wav", 0.0, 0.7),     # hook: prison reveal
    ("Himself.", "pop-hard-click-01.wav", 0.0, 0.7),     # mirror self-point
    ("larceny.", "drone-thunder-rain-01.wav", 0.0, 0.6), # 23-year sentence
    ("court.", "whoosh-arrow-01.wav", 0.0, 0.7),         # gavel swing to court
    ("pen,", "extra-typewriter-01.wav", 0.0, 0.7),       # writing the letter
    ("alcohol,", "whoosh-mysterious-01.wav", 0.0, 0.6),  # the fateful drink
    ("cell.", "whoosh-tunnel-reverb-01.wav", 0.0, 0.7),  # cell door slam
    ("himself.", "pop-long-01.wav", 0.0, 0.7),           # $5M demand pop
    ("You", "whoosh-stutter-01.wav", 0.0, 0.7),          # "You see" pivot turn
    ("release.", "whoosh-fast-transitions-01.wav", 0.0, 0.7),  # state pays
    ("ludicrous.", "blip-interface-click-01.wav", 0.0, 0.7),   # dismissal stamp
    ("litigation.", "whoosh-vacuum-01.wav", 0.0, 0.8),   # final twist hit
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

# ---- duck the BED by the VO's RMS envelope (SFX stay unducked) ----
SR = 44100
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", "voiceover.mp3",
                "-ar", str(SR), "-ac", "1", "vo-44k.wav"], check=True)
sr, vo = wavfile.read("vo-44k.wav")
assert sr == SR
vo = vo.astype(np.float64) / 32768.0
sr_b, bed = wavfile.read("music_synth.wav")
assert sr_b == SR
bed = bed.astype(np.float64) / 32768.0
n = min(len(vo), len(bed))
# pad VO to bed length (tail after VO ends = quiet -> full bed level)
vo_p = np.zeros(len(bed)); vo_p[:n] = vo[:n]
WIN = int(SR * 0.05)  # 50 ms windows
nw = int(np.ceil(len(bed) / WIN))
rms = np.sqrt(np.mean(vo_p[:nw * WIN].reshape(nw, WIN) ** 2, axis=1) + 1e-12)
db = 20 * np.log10(rms + 1e-12)
# gain: 1.0 below -42 dB, 0.30 above -28 dB, linear between
gain_w = np.clip((db + 28) / (-42 + 28), 0, 1) * 0.70 + 0.30
# smooth over ~250 ms (5 windows) to avoid pumping
k = np.ones(5) / 5
gain_w = np.convolve(np.pad(gain_w, (2, 2), mode="edge"), k, mode="valid")
gain = np.interp(np.arange(len(bed)), np.arange(nw) * WIN + WIN / 2, gain_w)
ducked = bed * gain
wavfile.write("bed-ducked.wav", SR, (np.clip(ducked, -1, 1) * 32767).astype(np.int16))
print(f"ducking: bed gain under speech {gain_w.min():.2f}, in pauses {gain_w.max():.2f}")

inputs = ["-i", "bed-ducked.wav"]
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
