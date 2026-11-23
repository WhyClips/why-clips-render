// Gullak-style top captions: white bold text on a black translucent pill,
// updating in short phrase chunks timed to the voiceover words.
import React from "react";
import { useCurrentFrame } from "remotion";
import { chunkAt, pop, FPS } from "./story";
import { FONT_FAMILY } from "./fonts";

export const CaptionOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const chunk = chunkAt(t);
  if (!chunk) return null;
  const since = frame - chunk.s * FPS;
  const scale = pop(since / 5);
  return (
    <div
      style={{
        position: "absolute",
        top: 96,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(10,10,14,0.62)",
          borderRadius: 999,
          padding: "18px 44px",
          transform: `scale(${scale})`,
          maxWidth: 940,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 600,
            fontSize: 52,
            lineHeight: 1.15,
            color: "#ffffff",
            letterSpacing: 0.5,
          }}
        >
          {chunk.text}
        </span>
      </div>
    </div>
  );
};
