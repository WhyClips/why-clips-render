// Timeline for "The Man Who Owned Segway Died Riding One" (Jimi Heselden) —
// Gullak Tales style. 7 scenes, 22 beats, hard cuts, timed to the voiceover
// word timings (Casper speed 94, 59.328 s, 195.2 WPM, last word ends 58.82 s).
import words from "./words.json";
import mouthCues from "./mouthCues.json";

export const FPS = 30;
export const TOTAL = 1800; // 60.000s @ 30fps (voiceover ends 58.82s + tail)

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
// Boundaries sit on exact word anchors (30 fps):
//   Jimi 8.94s = 268f | On(Christmas) 20.04s = 601f | On(September) 26.52s = 796f
//   Jimi(reversed) 34.90s = 1047f | Accidental 43.70s = 1311f
//   He(bought) 52.48s = 1574f
export type SceneId =
  | "hook" | "setup" | "buy" | "ride" | "fall" | "inquest" | "payoff";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hook", a: 0, b: 268 },       // owner died riding a Segway, off a cliff
  { id: "setup", a: 268, b: 601 },    // coal miner's son, Hesco walls, £166m
  { id: "buy", a: 601, b: 796 },      // Christmas Day 2009, bought Segway, 9 months
  { id: "ride", a: 796, b: 1047 },    // 26 Sep 2010, off-road Segway, dog, walker
  { id: "fall", a: 1047, b: 1311 },   // reversed, wobbled, 42 feet, dead aged 62
  { id: "inquest", a: 1311, b: 1574 }, // accidental death, no fault, You see
  { id: "payoff", a: 1574, b: TOTAL }, // bought the company… act of courtesy
];

export const sceneAt = (f: number): SceneDef =>
  SCENES.find((s) => f >= s.a && f < s.b) ?? SCENES[SCENES.length - 1];

// ---------------- beats ----------------
// 22 beats, each ≤ 106f (3.53s). B2 (106f) carries a mid-beat visual pop
// ("9 MONTHS" pill at f771) so no single composition holds longer than 3.5s.
// Boundaries sit on word starts; every beat gets its OWN composition
// (beat camera reframe + content variant in Segway.tsx), so the picture
// visibly changes at least every ~3s.
export type BeatId =
  | "H1" | "H2" | "H3" | "H4"
  | "S1" | "S2" | "S3" | "S4"
  | "B1" | "B2"
  | "R1" | "R2" | "R3"
  | "F1" | "F2" | "F3"
  | "I1" | "I2" | "I3"
  | "P1" | "P2" | "P3";

export type Cam = { s: number; x: number; y: number; o: string };
const C0: Cam = { s: 1.0, x: 0, y: 0, o: "50% 55%" };
const C1: Cam = { s: 1.1, x: -35, y: -25, o: "40% 50%" };
const C2: Cam = { s: 1.08, x: 35, y: 20, o: "60% 55%" };
const C3: Cam = { s: 1.14, x: 0, y: -40, o: "50% 40%" };

export type BeatDef = { id: BeatId; scene: SceneId; a: number; b: number; label: string; cam: Cam };
export const BEATS: BeatDef[] = [
  { id: "H1", scene: "hook", a: 0, b: 69, label: "Segway ECU at cliff edge, 2010", cam: C0 },
  { id: "H2", scene: "hook", a: 69, b: 138, label: "tipping at the edge, river below", cam: C1 },
  { id: "H3", scene: "hook", a: 138, b: 207, label: "into a river, worst part?", cam: C2 },
  { id: "H4", scene: "hook", a: 207, b: 268, label: "reversing to be polite, Jimi waves", cam: C3 },
  { id: "S1", scene: "setup", a: 268, b: 364, label: "Jimi, coal miner's son, Hesco wall", cam: C0 },
  { id: "S2", scene: "setup", a: 364, b: 458, label: "steel cages, soldiers at war", cam: C1 },
  { id: "S3", scene: "setup", a: 458, b: 522, label: "£166 MILLION count-up", cam: C2 },
  { id: "S4", scene: "setup", a: 522, b: 601, label: "Camp Bastion named after his firm", cam: C3 },
  { id: "B1", scene: "buy", a: 601, b: 690, label: "Christmas Day 2009 shopfront", cam: C0 },
  { id: "B2", scene: "buy", a: 690, b: 796, label: "bigger than the internet, 9 MONTHS", cam: C1 },
  { id: "R1", scene: "ride", a: 796, b: 890, label: "26 Sep 2010, riding the off-road Segway", cam: C0 },
  { id: "R2", scene: "ride", a: 890, b: 975, label: "above the River Wharfe, walking his dog", cam: C2 },
  { id: "R3", scene: "ride", a: 975, b: 1047, label: "another dog walker comes down the path", cam: C3 },
  { id: "F1", scene: "fall", a: 1047, b: 1130, label: "Jimi reverses to let him pass", cam: C0 },
  { id: "F2", scene: "fall", a: 1130, b: 1210, label: "wobbles at the edge, 42 FEET", cam: C1 },
  { id: "F3", scene: "fall", a: 1210, b: 1311, label: "down into the river, dead aged 62", cam: C2 },
  { id: "I1", scene: "inquest", a: 1311, b: 1400, label: "inquest paper, ACCIDENTAL DEATH stamp", cam: C0 },
  { id: "I2", scene: "inquest", a: 1400, b: 1502, label: "no fault found, You see", cam: C1 },
  { id: "I3", scene: "inquest", a: 1502, b: 1574, label: "machine killed its owner", cam: C3 },
  { id: "P1", scene: "payoff", a: 1574, b: 1644, label: "bought the company, change how we move", cam: C0 },
  { id: "P2", scene: "payoff", a: 1644, b: 1720, label: "nine months later, moved him off a cliff", cam: C2 },
  { id: "P3", scene: "payoff", a: 1720, b: TOTAL, label: "coroner: act of courtesy (final)", cam: C1 },
];

export const beatAt = (f: number): BeatDef =>
  BEATS.find((b) => f >= b.a && f < b.b) ?? BEATS[BEATS.length - 1];

// ---------------- captions ----------------
export type ChunkWord = { text: string; s: number; e: number };
export type Chunk = { words: ChunkWord[]; text: string; s: number; e: number };
const clean = (w: string) => w.replace(/[""]/g, "");
/** karaoke chunks of 1–2 words, split at sentence ends (bottom-centre pill) */
export const CHUNKS: Chunk[] = (() => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    chunks.push({
      words: cur.map((w) => ({ text: clean(w.w), s: w.s, e: w.e })),
      text: cur.map((w) => clean(w.w)).join(" "),
      s: cur[0].s,
      e: cur[cur.length - 1].e,
    });
    cur = [];
  };
  for (const w of WORDS) {
    cur.push(w);
    // sentence end = . ! ? optionally followed by a closing quote
    const endsSentence = /[.!?][""]?$/.test(w.w);
    if (endsSentence || cur.length >= 2) flush();
  }
  flush();
  return chunks;
})();

export const chunkAt = (t: number): Chunk | null => {
  // last matching chunk wins: the +0.08s grace must not let a finished chunk
  // linger into the next one when chunks are contiguous
  let found: Chunk | null = null;
  for (const c of CHUNKS) if (t >= c.s && t < c.e + 0.08) found = c;
  return found;
};
