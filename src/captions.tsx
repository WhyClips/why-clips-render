// Karaoke captions — TheRealWhy spec (formula §b), PLUS the 26 Nov caption animation:
// 1-2 words at a time, bottom-centre, white bold + thick black outline, height ~3% of
// frame height (58 px at 1920), NEVER overlapping a character or a prop.
// ANIMATION (Azhar, 26 Nov 07:25 — "caption aur line animation karni hai, bas"):
// the ACTIVE word (the one being spoken right now) pops — scale 1.28 -> 1.0 with a fast
// exponential settle — and turns GOLD (#ffd94d); the other word in the chunk stays white.
// The whole chunk also rises in 0.12 s on entry. Nothing else about the caption changes.
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import wordsJson from "./words.json";

export type Word = { w: string; s: number; e: number };
type Chunk = { words: Word[]; s: number; e: number };

const SENT_END = /[.!?…]["')]?$/;

export const chunkWords = (words: Word[]): Chunk[] => {
  const out: Chunk[] = [];
  for (let i = 0; i < words.length; i++) {
    const a = words[i], b = words[i + 1];
    if (b && b.e - a.s <= 0.55 && !SENT_END.test(a.w)) {
      out.push({ words: [a, b], s: a.s, e: b.e });
      i++;
    } else out.push({ words: [a], s: a.s, e: a.e });
  }
  return out;
};

/** caption height as a fraction of frame height — 3.0% (TheRealWhy measured 3.1%) */
export const CAPTION_H_FRAC = 0.03;
/** bottom band reserved for captions: the bottom 12% of the frame is floor only */
export const CAPTION_BAND_FRAC = 0.12;

export const CaptionOverlay: React.FC<{ words?: Word[] }> = ({ words = wordsJson as Word[] }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const t = frame / fps;
  const chunks = useMemo(() => chunkWords(words), [words]);
  const cur = chunks.find((c) => t >= c.s && t < c.e);
  if (!cur) return null;
  const size = Math.round(height * CAPTION_H_FRAC);
  const outline = Math.max(2, Math.round(size * 0.07));
  const o = outline;
  // chunk entrance: rise 8 px -> 0 over the first 0.12 s, fade in over 0.08 s
  const age = t - cur.s;
  const rise = Math.max(0, 8 * (1 - Math.min(1, age / 0.12)));
  const op = Math.min(1, 0.4 + age / 0.08);
  const shadow = [
    `-${o}px 0 0 #000`, `${o}px 0 0 #000`, `0 -${o}px 0 #000`, `0 ${o}px 0 #000`,
    `-${o}px -${o}px 0 #000`, `${o}px -${o}px 0 #000`, `-${o}px ${o}px 0 #000`, `${o}px ${o}px 0 #000`,
    `0 0 ${o * 2}px rgba(0,0,0,0.9)`,
  ].join(", ");
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", pointerEvents: "none" }}>
      <div style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: size, fontWeight: 800, lineHeight: 1.1, letterSpacing: 0.5,
        textAlign: "center",
        marginBottom: Math.round(height * 0.045),
        padding: "0 40px",
        opacity: op,
        transform: `translateY(${rise.toFixed(1)}px)`,
      }}>
        {cur.words.map((wd, i) => {
          const active = t >= wd.s && t < wd.e;
          // active word: pop 1.28 -> 1.0 (fast exponential settle) + gold; lifts 3 px
          const wAge = Math.max(0, t - wd.s);
          const pop = active ? 1 + 0.28 * Math.exp(-wAge / 0.07) : 1;
          const lift = active ? 3 * Math.exp(-wAge / 0.07) : 0;
          return (
            <span key={i} style={{
              display: "inline-block",
              color: active ? "#ffd94d" : "#ffffff",
              textShadow: shadow,
              transform: `scale(${pop.toFixed(3)}) translateY(${(-lift).toFixed(1)}px)`,
              margin: "0 7px",
            }}>{wd.w}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
