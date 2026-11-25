// Timeline for "Fruit Flies — First Animals in Space" — Gullak Tales style.
// 15 setups, hard cuts, timed to the voiceover word timings.
import words from "./words.json";
import mouthCues from "./mouthCues.json";

export const FPS = 30;
export const TOTAL = 2117; // 70.57s @ 30fps (voiceover ends 69.54s + tail)

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
  | "hook" | "feb1947" | "scientists" | "question" | "perfectTest"
  | "genes75" | "launch" | "parachute" | "earlier1946" | "firstAlive"
  | "youSee" | "withoutThem" | "laika" | "lastline";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hook", a: 0, b: 239 },          // first animals in space = FRUIT FLIES
  { id: "feb1947", a: 239, b: 312 },     // FEB 1947 badge, White Sands desert
  { id: "scientists", a: 312, b: 529 },  // scientists pack capsule of flies
  { id: "question", a: 529, b: 661 },    // radiation question — RADIATION? card
  { id: "perfectTest", a: 661, b: 723 }, // flies = perfect test subjects
  { id: "genes75", a: 723, b: 872 },     // 75% genes card, "if space broke them"
  { id: "launch", a: 872, b: 1107 },     // V-2 roars up, altitude meter to 109 KM
  { id: "parachute", a: 1107, b: 1333 }, // 190 SECONDS + capsule + parachute + ALIVE
  { id: "earlier1946", a: 1333, b: 1470 }, // 1946 flight — nobody brought them home
  { id: "firstAlive", a: 1470, b: 1611 }, // FIRST TIME EVER — space AND back alive
  { id: "youSee", a: 1611, b: 1719 },    // tiny flies proved survival
  { id: "withoutThem", a: 1719, b: 1869 }, // no dog, no monkey, no human
  { id: "laika", a: 1869, b: 1967 },     // LAIKA 1957 card + dog
  { id: "lastline", a: 1967, b: TOTAL }, // SMALLER THAN YOUR FINGERNAIL + came home
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
