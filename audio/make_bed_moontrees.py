#!/usr/bin/env python3
"""Moon Trees Gullak — NEW music bed (NOT the old recipe).
Deliberately different from the banned old bed (C major pentatonic pluck,
112 BPM, bass-forward, seed 43):
  - Key: A minor pentatonic (A C D E G) — darker, moonlit feel
  - Tempo: 96 BPM (slower, dreamier than 112)
  - Instruments: soft triangle-wave keys (marimba-like, NOT pluck) +
    warm detuned-sine pad (Am-F-C-G, one chord per bar) + gentle sine bass
  - Dynamics: hook light (first ~6s at 0.55x, ramps in), twist loud
    (last ~8s ramped to 1.35x)
  - Never silent: continuous A1/A2 drone floor so no 0.5s window drops
    below ~-30 dB.
Duration 62s, normalized to RMS ~-24 dBFS, peak under -1 dB.
Royalty-free by construction — all synthesized here.
Writes music_synth.wav in this directory. Run from moon-trees-gullak-project/audio.
"""
import numpy as np
from scipy.io import wavfile

SR = 44100
DUR = 62.0  # voiceover 59.535s + ~2.5s tail
SEED = 71
rng = np.random.default_rng(SEED)

t = np.arange(int(SR * DUR)) / SR
mix = np.zeros_like(t)


def tri_key(freq, start, dur=0.5, amp=0.16):
    """Soft triangle-wave key: fundamental + 1/9 3rd harmonic + 1/25 5th,
    gentle decay. Marimba-like warmth, no pluck snap."""
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
    """Gentle low sine + soft 2nd harmonic."""
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
    """Warm pad: detuned sine pairs per chord tone, slow attack/release."""
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


# ---- music bed: A minor pentatonic, 96 BPM, 8th notes ----
PENTA = [440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1318.51]
BEAT = 60 / 96
EIGHTH = BEAT / 2
BAR = BEAT * 4  # 2.5s
BASSLINE = [55.00, 43.65, 65.41, 49.00]          # A1 F1 C2 G1
CHORDS = [  # Am, F, C, G — one chord per bar
    [110.00, 261.63, 329.63],
    [87.31, 220.00, 261.63],
    [130.81, 164.81, 196.00],
    [98.00, 246.94, 293.66],
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

# ---- continuous low drone floor (A1 + A2): never drops below ~-30 dB ----
mix += 0.05 * np.sin(2 * np.pi * 55.0 * t) + 0.02 * np.sin(2 * np.pi * 110.0 * t)

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
