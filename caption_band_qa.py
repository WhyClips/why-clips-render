#!/usr/bin/env python3
"""Caption-band QA for the TherealWhy template stills.

Checks the bottom 12% band of each still (the caption zone) for dark ink pixels
OUTSIDE the caption text itself and outside the corner zones (x<12% / x>88%).
A character/prop intruding into the band shows up as a cluster of dark pixels
(plum #241726-ish stickman ink, or dark prop edges) where the floor should be.

Usage: python3 caption_band_qa.py [still ...]
Exit 0 = all pass, 1 = one or more frames fail.
"""
import sys
import numpy as np
from PIL import Image

BAND_FRAC = 0.12      # bottom 12% of the frame
CORNER_FRAC = 0.12    # ignore x < 12% / x > 88% (foreground props may sit there)
# dark ink: low luminance AND not a bright floor texture pixel (stickman ink is
# near-black plum, luma ~25-30; red rugs / dark wood floors are luma 50-90 and are NOT ink)
LUMA_MAX = 45
# a pixel counts as "caption text" if it is near-white with a dark outline nearby;
# simpler: caption text is the brightest white cluster in the band — mask any pixel
# whose 5x5 neighbourhood contains a near-white pixel (the caption + its outline halo)
WHITE_MIN = 225
FAIL_PIXELS = 120     # > this many stray dark pixels in the band = fail (kept as info only)
FAIL_CLUSTER = 5000   # a prop/character mass this big in the band = fail
# A narrow TALL intrusion (a leg, body edge or post rising through the band) = fail:
# the caption is a DOM overlay with a thick black outline, so a broad soft floor
# shadow under the text stays readable — what breaks readability is a hard
# character/prop edge crossing the text, i.e. a tall narrow dark shape.
FAIL_TALL_FRAC = 0.05   # cluster height > 5% of frame height
FAIL_NARROW_FRAC = 0.25  # ...and width < 25% of frame width


def dark_ink_mask(arr: np.ndarray) -> np.ndarray:
    luma = 0.2126 * arr[..., 0] + 0.7152 * arr[..., 1] + 0.0722 * arr[..., 2]
    return luma < LUMA_MAX


def caption_mask(arr: np.ndarray) -> np.ndarray:
    white = (arr[..., 0] > WHITE_MIN) & (arr[..., 1] > WHITE_MIN) & (arr[..., 2] > WHITE_MIN)
    # dilate the white mask by ~6 px to cover the black outline halo around the text
    from scipy.ndimage import binary_dilation
    return binary_dilation(white, iterations=6)


def largest_cluster(mask: np.ndarray) -> tuple[int, float, float]:
    """(pixels, height_frac, width_frac) of the largest 8-connected dark cluster."""
    from scipy.ndimage import label
    lab, n = label(mask)
    if n == 0:
        return 0, 0.0, 0.0
    counts = np.bincount(lab.ravel())
    counts[0] = 0
    big = int(counts.argmax())
    ys, xs = np.where(lab == big)
    h, w = mask.shape
    return int(counts[big]), (ys.max() - ys.min() + 1) / h, (xs.max() - xs.min() + 1) / w


def check(path: str) -> tuple[bool, int, int, float, float]:
    im = Image.open(path).convert("RGB")
    arr = np.asarray(im).astype(np.float32)
    h, w = arr.shape[:2]
    y0 = int(h * (1 - BAND_FRAC))
    band = arr[y0:, :, :]
    dark = dark_ink_mask(band)
    cap = caption_mask(band)
    stray = dark & ~cap
    # blank the corner zones
    cx = int(w * CORNER_FRAC)
    stray[:, :cx] = False
    stray[:, w - cx:] = False
    n = int(stray.sum())
    big, bh, bw = largest_cluster(stray)
    ok = not (big >= FAIL_CLUSTER or (bh >= FAIL_TALL_FRAC and bw <= FAIL_NARROW_FRAC))
    return ok, n, big, bh, bw


def main() -> int:
    paths = sys.argv[1:] or []
    if not paths:
        print("usage: caption_band_qa.py <still.png> ...")
        return 2
    bad = 0
    for p in paths:
        ok, n, big, bh, bw = check(p)
        print(f"{'PASS' if ok else 'FAIL'}  {p}: stray_dark={n} largest_cluster={big} ({bh*100:.1f}% tall x {bw*100:.1f}% wide)")
        bad += 0 if ok else 1
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
