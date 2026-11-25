#!/usr/bin/env bash
# assemble.sh — join rendered PNG frames + voiceover + music bed into the final MP4.
#
# Danish pipeline steps 5-8: the music bed is SYNTHESIZED (royalty-free, code-made)
# and mixed ~-6 dB under the voiceover; the final loudness is ~-14 LUFS.
# Captions are already burned into the frames (the Remotion composition draws the
# word-timed caption overlay), so assembly is video + audio only. NO watermark.
#
#   ./scripts/assemble.sh --frames out/frames --manifest out/frames/manifest.json \
#     --vo audio/vo.mp3 --music audio/bed.mp3 --out out/final.mp4 [--fps 30] [--crf 18]
# --vo / --music are optional: omit both for a silent video (smoke test), omit
# --music for VO-only. The mix is loudnormed to -14 LUFS (single-pass; for a
# measured two-pass normalization on final delivery, run the same filter with
# loudnorm's measured_* values from a first analysis pass — see TEMPLATE-NOTES.md).
set -euo pipefail
FRAMES=""; MANIFEST=""; VO=""; MUSIC=""; OUT=""; FPS=30; CRF=18
while [ $# -gt 0 ]; do
  case "$1" in
    --frames) FRAMES="$2"; shift 2;;
    --manifest) MANIFEST="$2"; shift 2;;
    --vo) VO="$2"; shift 2;;
    --music) MUSIC="$2"; shift 2;;
    --out) OUT="$2"; shift 2;;
    --fps) FPS="$2"; shift 2;;
    --crf) CRF="$2"; shift 2;;
    *) echo "unknown arg: $1" >&2; exit 2;;
  esac
done
[ -n "$FRAMES" ] && [ -n "$OUT" ] || { echo "usage: assemble.sh --frames DIR --out FILE.mp4 [--vo VO.mp3] [--music BED.mp3]" >&2; exit 2; }
[ -n "$MANIFEST" ] && node scripts/verify-manifest.mjs --manifest "$MANIFEST" --out "$FRAMES"

# music bed -6 dB under the VO (volume 0.5 = -6.02 dB), then the whole mix to -14 LUFS
if [ -n "$VO" ] && [ -n "$MUSIC" ]; then
  FILTER="[2:a]volume=0.5[bed];[1:a][bed]amix=inputs=2:duration=first:dropout_transition=0[mix];[mix]loudnorm=I=-14:TP=-1.5:LRA=11[aout]"
  INPUTS=(-i "$VO" -i "$MUSIC")
elif [ -n "$VO" ]; then
  FILTER="[1:a]loudnorm=I=-14:TP=-1.5:LRA=11[aout]"
  INPUTS=(-i "$VO")
elif [ -n "$MUSIC" ]; then
  FILTER="[1:a]volume=0.5,loudnorm=I=-14:TP=-1.5:LRA=11[aout]"
  INPUTS=(-i "$MUSIC")
else
  FILTER=""
  INPUTS=()
fi

if [ -n "$FILTER" ]; then
  ffmpeg -y -framerate "$FPS" -i "$FRAMES/frame-%d.png" "${INPUTS[@]}" \
    -filter_complex "$FILTER" -map 0:v -map "[aout]" \
    -c:v libx264 -pix_fmt yuv420p -crf "$CRF" -preset medium -r "$FPS" \
    -c:a aac -b:a 192k -movflags +faststart -shortest "$OUT"
else
  ffmpeg -y -framerate "$FPS" -i "$FRAMES/frame-%d.png" \
    -c:v libx264 -pix_fmt yuv420p -crf "$CRF" -preset medium -r "$FPS" \
    -movflags +faststart "$OUT"
fi
ffprobe -v error -show_entries format=duration,size -show_entries stream=width,height,codec_name,r_frame_rate "$OUT"
echo "assembled $OUT"
