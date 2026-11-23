// Timeline for "The First Spam Email Made $13 Million" — Gullak Tales style.
// 16 setups, hard cuts every ~2-5s, timed to the voiceover word timings.
import words from "./words.json";
import mouthCues from "./mouthCues.json";

export const FPS = 30;
export const TOTAL = 1751; // 58.4s @ 30fps (voiceover ends 56.86s + tail)

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
  | "hook" | "nameCard" | "computerRoom" | "sendMoment" | "arpanet"
  | "angry" | "complaints" | "boss" | "demos" | "sales"
  | "moneyCard" | "youSee" | "guinness" | "inbox" | "recap" | "lastline";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hook", a: 0, b: 143 },          // ONE EMAIL / 400 PEOPLE / $13M pops
  { id: "nameCard", a: 143, b: 270 },    // GARY THUERK chalk card + inset
  { id: "computerRoom", a: 270, b: 393 },// 1978, giant humming computers
  { id: "sendMoment", a: 393, b: 501 },  // 3 MAY 1978, Gary hits SEND
  { id: "arpanet", a: 501, b: 645 },     // network map, 400 inboxes
  { id: "angry", a: 645, b: 750 },       // furious users, NOT FOR SALESMEN
  { id: "complaints", a: 750, b: 810 },  // complaint letters rain in
  { id: "boss", a: 810, b: 899 },        // boss: NEVER AGAIN!
  { id: "demos", a: 899, b: 1049 },      // 40 people at the demos
  { id: "sales", a: 1049, b: 1133 },     // demos turned into sales
  { id: "moneyCard", a: 1133, b: 1219 }, // $13 MILLION (thumbnail frame)
  { id: "youSee", a: 1219, b: 1361 },    // Gary: invented email marketing
  { id: "guinness", a: 1361, b: 1439 },  // Guinness: OLDEST SPAM ON EARTH
  { id: "inbox", a: 1439, b: 1528 },     // modern inbox fills with junk
  { id: "recap", a: 1528, b: 1594 },     // ONE EMAIL. 400 PEOPLE. $13M.
  { id: "lastline", a: 1594, b: TOTAL }, // Gary wink, MOST SUCCESSFUL EMAIL
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
    // (e.g. 'help!"' ends the sentence — without this, chunks split mid-line)
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
