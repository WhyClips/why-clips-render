#!/usr/bin/env python3
"""Vai script Gullak — NEW music bed (never reused).
Deliberately different from ALL banned beds:
  - BANNED 1: C major pentatonic pluck, 112 BPM, seed 43 (Fruit Flies)
  - BANNED 2: A minor pentatonic triangle keys, 96 BPM, seed 71 (Moon Trees)
  - BANNED 3: D major pentatonic sine-bell, 104 BPM, seed 97 (Segway)
This bed:
  - Key: F major pentatonic (F G A C D) — warm, West-African feel, hopeful
  - Tempo: 92 BPM
  - Instruments: soft sine-bell keys + warm detuned-sine pad
    (F–Bb–C–Dm, one chord per bar) + gentle sine bass
  - Dynamics: hook light (first ~6s at 0.55x, ramps in by 8s), twist loud
    (last ~8s ramped to 1.35x)
  - Never silent: continuous F2/F3 drone floor so no 0.5s window drops
    below ~-30 dB.
Duration 62s, normalized to RMS ~-24 dBFS, peak under -1 dB.
Royalty-free by construction — all synthesized here.
Writes music_synth.wav in this directory. Run from vai-script-gullak-project/audio.
"""
import numpy as np
from scipy.io import wavfile

SR = 44100
DUR = 62.0
SEED = 131
rng = np.random.default_rng(SEED)

t = np.arange(int(SR * DUR)) / SR
mix = np.zeros_like(t)


def bell_key(freq, start, dur=0.5, amp=0.15):
    """Soft sine-bell key: fundamental + 1/4 2nd harmonic, gentle decay."""
    i0 = int(start * SR)
    n = int(dur * SR)
    if i0 + n > len(mix):
        n = len(mix) - i0
    if n <= 0:
        return
    tt = np.arange(n) / SR
    env = np.exp(-tt * 6.0)
    sig = (np.sin(2 * np.pi * freq * tt)
           + 0.25 * np.sin(2 * np.pi * freq * 2 * tt)) * env
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


def pad_chord(freqs, start, dur, amp=0.04):
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


# ---- music bed: F major pentatonic, 92 BPM, 8th notes ----
PENTA = [349.23, 392.00, 440.00, 523.25, 587.33, 698.46, 783.99, 880.00]
BEAT = 60 / 92
EIGHTH = BEAT / 2
BAR = BEAT * 4
BASSLINE = [87.31, 116.54, 130.81, 146.83]          # F2 Bb2 C3 D3
CHORDS = [  # F, Bb, C, Dm — one chord per bar
    [174.61, 261.63, 349.23],
    [233.08, 293.66, 349.23],
    [261.63, 329.63, 392.00],
    [293.66, 349.23, 440.00],
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
        bell_key(PENTA[idx], s, dur=0.55, amp=0.14)
    elif rng.random() < 0.28:
        idx = int(np.clip(round(3 + rng.normal(0, 1.6)), 0, len(PENTA) - 1))
        bell_key(PENTA[idx], s, dur=0.55, amp=0.10)
    step += 1

# ---- dynamics: hook light (first ~6s at 0.55x, ramps in by 8s), twist loud ----
gain = np.ones_like(t)
hook = t < 8.0
gain[hook] = np.where(t[hook] < 6.0, 0.55, 0.55 + 0.45 * ((t[hook] - 6.0) / 2.0))
twist = t >= 54.0
gain[twist] = 1.0 + 0.35 * ((t[twist] - 54.0) / 8.0)
mix *= gain

# ---- continuous low drone floor (F2 + F3): never drops below ~-30 dB ----
mix += 0.05 * np.sin(2 * np.pi * 87.31 * t) + 0.02 * np.sin(2 * np.pi * 174.61 * t)

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
