// Karaoke captions: ONE word at a time, bottom-centre, word-synced to the
// narration. Large bold white Fredoka with a thick black outline.
// Max ONE text element on screen at a time — no phrase chunks, no top pill.
import React from "react";
import { useCurrentFrame } from "remotion";
import { wordAt, pop, FPS } from "./story";
import { FONT_FAMILY } from "./fonts";

export const CaptionOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const word = wordAt(t);
  if (!word) return null;
  const since = frame - word.s * FPS;
  const scale = pop(since / 4);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 340,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 96,
          lineHeight: 1.05,
          letterSpacing: 1,
          color: "#ffffff",
          textAlign: "center",
          maxWidth: 1000,
          transform: `scale(${scale})`,
          WebkitTextStroke: "10px #20242b",
          paintOrder: "stroke fill",
          textShadow: "0 6px 0 rgba(0,0,0,0.35)",
        }}
      >
        {word.w}
      </span>
    </div>
  );
};
