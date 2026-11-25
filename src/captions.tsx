// Karaoke captions — TheRealWhy spec (formula §b):
// 1-2 words at a time, bottom-centre, white bold + thick black outline, height ~3% of
// frame height (58 px at 1920), NEVER overlapping a character or a prop.
// The no-collision rule is by construction: story.ts cameras keep every subject above 80%
// of frame height, so the bottom 12% band is floor only; the caption sits in that band.
// Chunking: pair two words only when the pair spans <= 0.55 s and the first word does not
// end a sentence — phrase chunks ("paid the", "So why") read more naturally at speed.
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import wordsJson from "./words.json";

export type Word = { w: string; s: number; e: number };
type Chunk = { text: string; s: number; e: number };

const SENT_END = /[.!?…]["')]?$/;

export const chunkWords = (words: Word[]): Chunk[] => {
  const out: Chunk[] = [];
  for (let i = 0; i < words.length; i++) {
    const a = words[i], b = words[i + 1];
    if (b && b.e - a.s <= 0.55 && !SENT_END.test(a.w)) {
      out.push({ text: `${a.w} ${b.w}`, s: a.s, e: b.e });
      i++;
    } else out.push({ text: a.w, s: a.s, e: a.e });
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
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", pointerEvents: "none" }}>
      <div style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: size, fontWeight: 800, lineHeight: 1.1, letterSpacing: 0.5,
        color: "#ffffff", textAlign: "center",
        marginBottom: Math.round(height * 0.045),
        padding: "0 40px",
        textShadow: [
          `-${o}px 0 0 #000`, `${o}px 0 0 #000`, `0 -${o}px 0 #000`, `0 ${o}px 0 #000`,
          `-${o}px -${o}px 0 #000`, `${o}px -${o}px 0 #000`, `-${o}px ${o}px 0 #000`, `${o}px ${o}px 0 #000`,
          `0 0 ${o * 2}px rgba(0,0,0,0.9)`,
        ].join(", "),
      }}>{cur.text}</div>
    </AbsoluteFill>
  );
};
