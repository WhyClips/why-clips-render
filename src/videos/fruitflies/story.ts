// Timeline for "Drake and the Cimarrones — The Slaves Who Showed Drake the
// Pacific" — Gullak Tales style. 7 setups, hard cuts, timed to the
// voiceover word timings (speed-94 VO, 59.352s, 194 tokens).
import words from "./words.json";
import mouthCues from "./mouthCues.json";

export const FPS = 30;
export const TOTAL = 1800; // 60.000s @ 30fps (voiceover ends 58.86s + tail)

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
//   Spain's 7.24s = 217f | Spain(sent) 18.76s = 563f | In(1572) 24.60s = 738f
//   In(February) 37.42s = 1123f | You(see) 45.52s = 1366f | On(the way) 50.20s = 1506f
export type SceneId =
  | "hook" | "silver" | "spain" | "drake" | "ambush" | "pivot" | "payoff";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hook", a: 0, b: 217 },       // Drake on the hill, 1573, two oceans
  { id: "silver", a: 217, b: 563 },   // mule train, running men, free village
  { id: "spain", a: 563, b: 738 },    // Spanish armies, melted into trees, raid
  { id: "drake", a: 738, b: 1123 },   // 1572 ship, lost jungle, Pedro, the deal
  { id: "ambush", a: 1123, b: 1366 }, // February 1573, 30 cimarrones, riverbed
  { id: "pivot", a: 1366, b: 1506 },  // "You see" — they knew it better
  { id: "payoff", a: 1506, b: TOTAL },// the hill, TWO OCEANS, gave him the world
];

export const sceneAt = (f: number): SceneDef =>
  SCENES.find((s) => f >= s.a && f < s.b) ?? SCENES[SCENES.length - 1];

// ---------------- beats ----------------
// 21 beats, each ≤ 130f — beats over 105f carry a mid-beat visual flip so
// no single composition holds longer than ~3.5s. Boundaries sit on word
// starts / natural pauses; every beat gets its OWN composition (beat camera
// reframe + content variant in Drake.tsx), so the picture visibly changes
// at least every ~3s.
export type BeatId =
  | "H1" | "H2"
  | "S1" | "S2" | "S3" | "S4"
  | "M1" | "M2"
  | "D1" | "D2" | "D3" | "D4" | "D5"
  | "A1" | "A2" | "A3"
  | "P1" | "P2"
  | "F1" | "F2" | "F3";

export type Cam = { s: number; x: number; y: number; o: string };
const C0: Cam = { s: 1.0, x: 0, y: 0, o: "50% 55%" };
const C1: Cam = { s: 1.1, x: -35, y: -25, o: "40% 50%" };
const C2: Cam = { s: 1.08, x: 35, y: 20, o: "60% 55%" };
const C3: Cam = { s: 1.14, x: 0, y: -40, o: "50% 40%" };

export type BeatDef = { id: BeatId; scene: SceneId; a: number; b: number; label: string; cam: Cam };
export const BEATS: BeatDef[] = [
  { id: "H1", scene: "hook", a: 0, b: 99, label: "Drake on the hill, 1573 pill", cam: C0 },
  { id: "H2", scene: "hook", a: 99, b: 217, label: "two oceans, cimarrones join at 139f", cam: C1 },
  { id: "S1", scene: "silver", a: 217, b: 308, label: "mule train + silver, tons of it", cam: C0 },
  { id: "S2", scene: "silver", a: 308, b: 417, label: "men running away, flip to jungle at 365f", cam: C2 },
  { id: "S3", scene: "silver", a: 417, b: 468, label: "free village, huts + fire", cam: C0 },
  { id: "S4", scene: "silver", a: 468, b: 563, label: "cimarrones group + CIMARRONES badge", cam: C1 },
  { id: "M1", scene: "spain", a: 563, b: 630, label: "Spanish armies march", cam: C0 },
  { id: "M2", scene: "spain", a: 630, b: 738, label: "melted into trees, flip to raid at 687f", cam: C2 },
  { id: "D1", scene: "drake", a: 738, b: 840, label: "1572 ship arrives", cam: C0 },
  { id: "D2", scene: "drake", a: 840, b: 934, label: "Drake lost in jungle, flip at 899f", cam: C3 },
  { id: "D3", scene: "drake", a: 934, b: 984, label: "cimarrones found HIM", cam: C1 },
  { id: "D4", scene: "drake", a: 984, b: 1057, label: "Pedro Mandinga close-up + badge", cam: C2 },
  { id: "D5", scene: "drake", a: 1057, b: 1123, label: "the deal — speech bubble", cam: C0 },
  { id: "A1", scene: "ambush", a: 1123, b: 1179, label: "February 1573 march", cam: C0 },
  { id: "A2", scene: "ambush", a: 1179, b: 1253, label: "30 CIMARRONES pill + march", cam: C1 },
  { id: "A3", scene: "ambush", a: 1253, b: 1366, label: "ambush, flip to riverbed at 1336f", cam: C3 },
  { id: "P1", scene: "pivot", a: 1366, b: 1428, label: "YOU SEE chalk", cam: C0 },
  { id: "P2", scene: "pivot", a: 1428, b: 1506, label: "they knew it better — route chalk", cam: C2 },
  { id: "F1", scene: "payoff", a: 1506, b: 1606, label: "climbing the hill", cam: C0 },
  { id: "F2", scene: "payoff", a: 1606, b: 1702, label: "TWO OCEANS pill + split seas", cam: C1 },
  { id: "F3", scene: "payoff", a: 1702, b: TOTAL, label: "gave a pirate the world + globe", cam: C2 },
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
    const endsSentence = /[.!?]["”]?$/.test(w.w);
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
