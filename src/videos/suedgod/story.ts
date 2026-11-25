// Timeline for "The Senator Who Sued God" — Gullak Tales style.
// 14 setups, hard cuts every ~3-7s, timed to the voiceover word timings.
import words from "./words.json";
import mouthCues from "./mouthCues.json";

export const FPS = 30;
export const TOTAL = 2168; // 72.27s @ 30fps (voiceover ends 71.06s + tail)

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 4;
/** pop-in scale: overshoots slightly, settles at 1 (Gullak card pops) */
export const pop = (u: number) => {
  const x = clamp01(u);
  if (x >= 1) return 1;
  return 1 + Math.sin(x * Math.PI) * 0.18 * (1 - x);
};

export type Word = { w: string; s: number; e: number };
export const WORDS: Word[] = words as Word[];

export type MouthShape = "closed" | "open" | "grin";
type MouthCue = { s: number; e: number; m: MouthShape };
const MOUTH: MouthCue[] = mouthCues as MouthCue[];
/** Rhubarb Lip Sync mouth shape at time t (seconds) */
export const mouthAt = (t: number): MouthShape => {
  for (const c of MOUTH) if (t >= c.s && t < c.e) return c.m;
  return "closed";
};

// ---------------- scenes ----------------
export type SceneId =
  | "hook" | "setup" | "filedSuit" | "charges1" | "charges2" | "threats"
  | "point" | "hearing" | "reserved" | "dismissed" | "noAddress"
  | "argued" | "payoff" | "lastline";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hook", a: 0, b: 96 },           // A senator sued God — court took it seriously
  { id: "setup", a: 96, b: 265 },        // Ernie Chambers, Nebraska, Sept 2007
  { id: "filedSuit", a: 265, b: 354 },   // filed a real lawsuit — against God
  { id: "charges1", a: 354, b: 543 },    // floods, earthquakes, hurricanes, tornadoes
  { id: "charges2", a: 543, b: 713 },    // plagues, famines, droughts, wars, birth defects
  { id: "threats", a: 713, b: 884 },     // terroristic threats — order God to stop, forever
  { id: "point", a: 884, b: 1113 },      // not a joke — everyone deserves access to the courts
  { id: "hearing", a: 1113, b: 1268 },   // the court held a hearing
  { id: "reserved", a: 1268, b: 1399 },  // empty table reserved for God + God's lawyer
  { id: "dismissed", a: 1399, b: 1555 }, // Judge Polk threw the case out — not because it was silly
  { id: "noAddress", a: 1555, b: 1710 }, // God has no home address — can never be served
  { id: "argued", a: 1710, b: 1896 },    // God knows everything — the judge didn't budge
  { id: "payoff", a: 1896, b: 2045 },    // the case died on one tiny detail
  { id: "lastline", a: 2045, b: TOTAL }, // found impossible to serve
];

export const sceneAt = (f: number): SceneDef =>
  SCENES.find((s) => f >= s.a && f < s.b) ?? SCENES[SCENES.length - 1];

// ---------------- captions ----------------
export type Chunk = { text: string; s: number; e: number };
const clean = (w: string) => w.replace(/[""]/g, "");
/** phrase chunks of up to 4 words, split at sentence ends (Gullak top-pill) */
export const CHUNKS: Chunk[] = (() => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    chunks.push({
      text: cur.map((w) => clean(w.w)).join(" "),
      s: cur[0].s,
      e: cur[cur.length - 1].e,
    });
    cur = [];
  };
  for (const w of WORDS) {
    cur.push(w);
    // sentence end = . ! ? optionally followed by a closing quote
    const endsSentence = /[.!?]["”]?$/.test(w.w);
    if (endsSentence || cur.length >= 4) flush();
  }
  flush();
  return chunks;
})();

export const chunkAt = (t: number): Chunk | null => {
  for (const c of CHUNKS) if (t >= c.s && t < c.e + 0.08) return c;
  return null;
};
