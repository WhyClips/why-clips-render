// Gullak-style BOTTOM-CENTRE karaoke captions: white bold text on a black
// translucent pill, 1–2 words per chunk. The ACTIVE word pops + turns gold
// (#ffd94d); the other word stays white. Font 48px — slightly smaller than
// the Moon Trees v1 (~58px). Pill sits in the bottom band (top ~1700) so it
// never overlaps a character or prop (scenes frame subjects above y≈1650).
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
  // active word = the word whose [s,e] contains t (else the last one started)
  let active = 0;
  chunk.words.forEach((w, i) => {
    if (t >= w.s && t < w.e) active = i;
    else if (t >= w.e && i === chunk.words.length - 1) active = i;
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 1700,
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
          padding: "14px 36px",
          transform: `scale(${scale})`,
          maxWidth: 980,
          textAlign: "center",
        }}
      >
        {chunk.words.map((w, i) => {
          const isActive = i === active;
          const wSince = frame - w.s * FPS;
          const wPop = isActive ? pop(wSince / 4) : 1;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: FONT_FAMILY,
                fontWeight: 700,
                fontSize: 48,
                lineHeight: 1.15,
                color: isActive ? "#ffd94d" : "#ffffff",
                letterSpacing: 0.5,
                transform: `scale(${wPop})`,
                marginRight: i < chunk.words.length - 1 ? 14 : 0,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
