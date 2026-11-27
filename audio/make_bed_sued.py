#!/usr/bin/env python3
"""Sued Himself — NEW music bed (never used before).
Deliberately different from BOTH banned beds:
  - banned #1: C major pentatonic pluck, 112 BPM, seed 43
  - banned #2 (Moon Trees): A minor pentatonic, 96 BPM, seed 71
This one:
  - Key: D minor pentatonic (D F G A C) — courtroom-drama feel, darker
  - Tempo: 108 BPM (brisker than 96, slower than 112)
  - Instruments: soft triangle-wave keys (marimba-like) + warm detuned-sine
    pad (Dm-Bb-F-C, one chord per bar) + gentle sine bass
  - Dynamics: hook light (first ~6s at 0.55x, ramps in), twist loud
    (last ~8s ramped to 1.35x)
  - Never silent: continuous D2/D3 drone floor so no 0.5s window drops
    below ~-30 dB.
Duration 62s, normalized to RMS ~-24 dBFS, peak under -1 dB.
Royalty-free by construction — all synthesized here.
Writes music_synth.wav in this directory. Run from sued-himself-gullak-project/audio.
"""
import numpy as np
from scipy.io import wavfile

SR = 44100
DUR = 62.0  # voiceover 59.385s + ~2.6s tail
SEED = 17
rng = np.random.default_rng(SEED)

t = np.arange(int(SR * DUR)) / SR
mix = np.zeros_like(t)


def tri_key(freq, start, dur=0.5, amp=0.16):
    i0 = int(start * SR)
    n = int(dur * SR)
    if i0 + n > len(mix):
        n = len(mix) - i0
    if n <= 0:
        return
    tt = np.arange(n) / SR
    env = np.exp(-tt * 7.0)
    sig = (np.sin(2 * np.pi * freq * tt)
           + (1 / 9) * np.sin(2 * np.pi * freq * 3 * tt)
           + (1 / 25) * np.sin(2 * np.pi * freq * 5 * tt)) * env
    mix[i0:i0 + n] += amp * sig


def bass_note(freq, start, dur=1.4, amp=0.16):
    i0 = int(start * SR)
    n = int(dur * SR)
    if i0 + n > len(mix):
        n = len(mix) - i0
    if n <= 0:
        return
    tt = np.arange(n) / SR
    env = np.exp(-tt * 2.2)
    sig = (np.sin(2 * np.pi * freq * tt)
           + 0.2 * np.sin(2 * np.pi * freq * 2 * tt)) * env
    mix[i0:i0 + n] += amp * sig


def pad_chord(freqs, start, dur, amp=0.045):
    i0 = int(start * SR)
    n = int(dur * SR)
    if i0 + n > len(mix):
        n = len(mix) - i0
    if n <= 0:
        return
    tt = np.arange(n) / SR
    attack = np.minimum(tt / 0.4, 1.0)
    release = np.minimum((dur - tt) / 0.5, 1.0)
    env = np.clip(attack * release, 0, 1)
    for f in freqs:
        for det in (0.997, 1.003):
            mix[i0:i0 + n] += amp * np.sin(2 * np.pi * f * det * tt) * env


# ---- music bed: D minor pentatonic, 108 BPM, 8th notes ----
PENTA = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 880.00]
BEAT = 60 / 108
EIGHTH = BEAT / 2
BAR = BEAT * 4  # 2.222s
BASSLINE = [73.42, 58.27, 87.31, 65.41]          # D2 Bb1 F2 C2
CHORDS = [  # Dm, Bb, F, C — one chord per bar
    [146.83, 293.66, 349.23],
    [116.54, 233.08, 293.66],
    [174.61, 349.23, 440.00],
    [130.81, 261.63, 329.63],
]
n_bars = int(DUR // BAR) + 1
for bar in range(n_bars):
    s = bar * BAR
    if s >= DUR:
        break
    bass_note(BASSLINE[bar % 4], s, dur=1.6, amp=0.17)
    pad_chord(CHORDS[bar % 4], s, dur=min(BAR + 0.4, DUR - s), amp=0.04)

step = 0
while step * EIGHTH < DUR - 0.5:
    s = step * EIGHTH
    if step % 2 == 0 and rng.random() < 0.8:
        idx = int(np.clip(round(3 + rng.normal(0, 1.6)), 0, len(PENTA) - 1))
        tri_key(PENTA[idx], s, dur=0.55, amp=0.15)
    elif rng.random() < 0.28:
        idx = int(np.clip(round(3 + rng.normal(0, 1.6)), 0, len(PENTA) - 1))
        tri_key(PENTA[idx], s, dur=0.55, amp=0.11)
    step += 1

# ---- dynamics: hook light, twist loud ----
gain = np.ones_like(t)
hook = t < 8.0
gain[hook] = 0.55 + 0.45 * (t[hook] / 8.0)
twist = t >= 54.0
gain[twist] = 1.0 + 0.35 * ((t[twist] - 54.0) / 8.0)
mix *= gain

# ---- continuous low drone floor (D2 + D3): never drops below ~-30 dB ----
mix += 0.05 * np.sin(2 * np.pi * 73.42 * t) + 0.02 * np.sin(2 * np.pi * 146.83 * t)

# ---- normalize to target RMS ~-24 dBFS (0.063) ----
rms = float(np.sqrt(np.mean(mix ** 2)))
target = 10 ** (-24 / 20)
mix = mix * (target / rms)
peak = float(np.max(np.abs(mix)))
print(f"bed RMS before norm: {20*np.log10(rms):.1f} dB, peak after norm: {20*np.log10(peak):.1f} dB")
if peak > 0.89:
    mix = mix * (0.89 / peak)
    print("peak-limited to -1 dB")
wavfile.write("music_synth.wav", SR, (mix * 32767).astype(np.int16))
print("wrote music_synth.wav")
