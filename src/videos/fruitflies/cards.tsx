// Infographic cards, speech bubbles, badges and the inset-clip device
// (Gullak Tales style).
import React from "react";
import { useCurrentFrame } from "remotion";
import { pop, smooth, FPS } from "./story";
import { FONT_FAMILY } from "./fonts";
import { OUTLINE } from "./characters";

export const Abs: React.FC<{
  left?: number;
  top?: number;
  bottom?: number;
  right?: number;
  width?: number;
  height?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ left, top, bottom, right, width, height, children, style }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      bottom,
      right,
      width,
      height,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Big cream text on the dark chalkboard (infographic card headline). */
export const ChalkText: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number; // frames before popping in
  align?: "center" | "left";
}> = ({ children, size = 150, color = "#fdf3d8", delay = 0, align = "center" }) => {
  const frame = useCurrentFrame();
  const u = (frame - delay) / 10;
  const s = pop(u);
  const o = smooth(u * 1.5);
  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.02,
        color,
        textAlign: align,
        transform: `scale(${s})`,
        opacity: o,
        textShadow: "0 6px 0 rgba(0,0,0,0.25)",
      }}
    >
      {children}
    </div>
  );
};

/** Small navy pill label (e.g. "1923", "PROBLEM 1"). */
export const Badge: React.FC<{ children: React.ReactNode; color?: string; delay?: number }> = ({
  children,
  color = "#1d2b4a",
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const u = (frame - delay) / 8;
  return (
    <div
      style={{
        display: "inline-block",
        backgroundColor: color,
        border: `5px solid ${OUTLINE}`,
        borderRadius: 999,
        padding: "12px 34px",
        transform: `scale(${pop(u)})`,
        opacity: smooth(u * 1.5),
      }}
    >
      <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 44, color: "#fff", letterSpacing: 2 }}>
        {children}
      </span>
    </div>
  );
};

/** White speech bubble with a tail. */
export const SpeechBubble: React.FC<{
  children: React.ReactNode;
  tail?: "left" | "right" | "bottom";
  delay?: number;
  size?: number;
}> = ({ children, tail = "bottom", delay = 0, size = 56 }) => {
  const frame = useCurrentFrame();
  const u = (frame - delay) / 8;
  return (
    <div style={{ position: "relative", transform: `scale(${pop(u)})`, opacity: smooth(u * 1.5) }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          border: `6px solid ${OUTLINE}`,
          borderRadius: 36,
          padding: "24px 36px",
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.1,
          color: "#20242b",
          textAlign: "center",
        }}
      >
        {children}
      </div>
      {tail === "bottom" && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -26,
            marginLeft: -20,
            width: 40,
            height: 40,
            backgroundColor: "#fff",
            borderRight: `6px solid ${OUTLINE}`,
            borderBottom: `6px solid ${OUTLINE}`,
            transform: "rotate(45deg)",
          }}
        />
      )}
      {tail === "left" && (
        <div
          style={{
            position: "absolute",
            left: -24,
            top: "50%",
            marginTop: -20,
            width: 40,
            height: 40,
            backgroundColor: "#fff",
            borderLeft: `6px solid ${OUTLINE}`,
            borderBottom: `6px solid ${OUTLINE}`,
            transform: "rotate(45deg)",
          }}
        />
      )}
    </div>
  );
};

/** The inset-clip device: a small vertical rounded clip of a character,
// pinned over cards/backgrounds (Gullak's signature cheap trick). */
export const InsetClip: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number;
  delay?: number;
}> = ({ children, width = 300, height = 420, delay = 0 }) => {
  const frame = useCurrentFrame();
  const u = (frame - delay) / 8;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 28,
        border: `6px solid ${OUTLINE}`,
        overflow: "hidden",
        background: "linear-gradient(180deg, #7ec8f0 0%, #bfe6fb 60%, #8fce6e 100%)",
        boxShadow: "0 10px 0 rgba(0,0,0,0.25)",
        transform: `scale(${pop(u)})`,
        opacity: smooth(u * 1.5),
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div style={{ width: width * 0.92, height: height * 0.94 }}>{children}</div>
    </div>
  );
};

/** Big red X (for the rejected HELP). */
export const RedX: React.FC<{ size?: number; delay?: number }> = ({ size = 420, delay = 0 }) => {
  const frame = useCurrentFrame();
  const u = (frame - delay) / 7;
  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${pop(u)}) rotate(-10deg)`,
        opacity: smooth(u * 1.5),
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <path d="M18,18 L82,82 M82,18 L18,82" stroke={OUTLINE} strokeWidth={24} strokeLinecap="round" />
        <path d="M18,18 L82,82 M82,18 L18,82" stroke="#e63b2e" strokeWidth={16} strokeLinecap="round" />
      </svg>
    </div>
  );
};

export { FPS };
