// Timeline for "The Man Who Sued Himself — Robert Lee Brock, 1995" — Gullak Tales style.
// 6 scenes, hard cuts, timed to the voiceover word timings.
// VO: Casper speed 92 stretched to 59.385s (200.0 WPM), last word ends 58.8s.
// 190 Whisper tokens (small.en). Pauses are Casper's natural sentence pauses
// (26 > 0.4s, max 0.92s) — the slower feel, same as Moon Trees v4.
import words from "./words.json";
import mouthCues from "./mouthCues.json";

export const FPS = 30;
export const TOTAL = 1800; // 60.000s @ 30fps (voiceover ends 58.8s + tail)

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
//   Robert 7.86s = 236f | In(letter) 22.22s = 667f | So(demand) 35.02s = 1051f
//   You 38.48s = 1154f | The(judge) 50.08s = 1502f
export type SceneId =
  | "hook" | "prison" | "letter" | "demand" | "state" | "judge";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hook", a: 0, b: 236 },       // prison cell ECU + mirror gag + "$5 MILLION"
  { id: "prison", a: 236, b: 667 },   // 23 years, court, no lawyer, pen + 7 pages
  { id: "letter", a: 667, b: 1051 },  // 7-page letter, 1 July 1993, beliefs, cell
  { id: "demand", a: 1051, b: 1154 }, // "$5,000,000 — from himself"
  { id: "state", a: 1154, b: 1502 },  // You see: no money, state pays, pay back
  { id: "judge", a: 1502, b: TOTAL }, // judge reads, "totally ludicrous", praise
];

export const sceneAt = (f: number): SceneDef =>
  SCENES.find((s) => f >= s.a && f < s.b) ?? SCENES[SCENES.length - 1];

// ---------------- beats ----------------
// 21 beats, each ≤ 104f (3.47s) — no beat holds longer than 3.5s.
// Boundaries sit on word starts / natural pauses; every beat gets its OWN
// composition (beat camera reframe + content variant in SuedHimself.tsx), so
// the picture visibly changes at least every ~3s. STANDING RULE: scene every
// 3 seconds in Why Clips Shorts.
export type BeatId =
  | "H1" | "H2" | "H3"
  | "P1" | "P2" | "P3" | "P4" | "P5"
  | "L1" | "L2" | "L3" | "L4"
  | "D1"
  | "S1" | "S2" | "S3" | "S4"
  | "J1" | "J2" | "J3" | "J4";

export type Cam = { s: number; x: number; y: number; o: string };
const C0: Cam = { s: 1.0, x: 0, y: 0, o: "50% 55%" };
const C1: Cam = { s: 1.1, x: -35, y: -25, o: "40% 50%" };
const C2: Cam = { s: 1.08, x: 35, y: 20, o: "60% 55%" };
const C3: Cam = { s: 1.14, x: 0, y: -40, o: "50% 40%" };

export type BeatDef = { id: BeatId; scene: SceneId; a: number; b: number; label: string; cam: Cam };
export const BEATS: BeatDef[] = [
  { id: "H1", scene: "hook", a: 0, b: 68, label: "prison cell ECU, 1995 Virginia", cam: C0 },
  { id: "H2", scene: "hook", a: 68, b: 135, label: "mirror gag: Brock vs Brock", cam: C1 },
  { id: "H3", scene: "hook", a: 135, b: 236, label: "Himself + $5 MILLION count-up", cam: C2 },
  { id: "P1", scene: "prison", a: 236, b: 338, label: "23 YEARS in cell", cam: C0 },
  { id: "P2", scene: "prison", a: 338, b: 428, label: "someone had to pay, thinking + gavel", cam: C3 },
  { id: "P3", scene: "prison", a: 428, b: 513, label: "Brock vs Brock in court", cam: C1 },
  { id: "P4", scene: "prison", a: 513, b: 604, label: "no lawyer, no help", cam: C2 },
  { id: "P5", scene: "prison", a: 604, b: 667, label: "pen + 7 PAGES", cam: C0 },
  { id: "L1", scene: "letter", a: 667, b: 756, label: "seven-page handwritten letter", cam: C0 },
  { id: "L2", scene: "letter", a: 756, b: 857, label: "1 JULY 1993 + bottle", cam: C1 },
  { id: "L3", scene: "letter", a: 857, b: 947, label: "broke his own beliefs, cracked mirror", cam: C3 },
  { id: "L4", scene: "letter", a: 947, b: 1051, label: "arrest, handcuffs, cell", cam: C2 },
  { id: "D1", scene: "demand", a: 1051, b: 1154, label: "$5,000,000 — from himself", cam: C0 },
  { id: "S1", scene: "state", a: 1154, b: 1248, label: "You see — one problem, $0", cam: C0 },
  { id: "S2", scene: "state", a: 1248, b: 1330, label: "no job, no income", cam: C2 },
  { id: "S3", scene: "state", a: 1330, b: 1412, label: "statehouse pays the $5M", cam: C1 },
  { id: "S4", scene: "state", a: 1412, b: 1502, label: "promised to pay it back", cam: C0 },
  { id: "J1", scene: "judge", a: 1502, b: 1586, label: "judge reads the case", cam: C0 },
  { id: "J2", scene: "judge", a: 1586, b: 1670, label: "TOTALLY LUDICROUS + gavel", cam: C1 },
  { id: "J3", scene: "judge", a: 1670, b: 1764, label: "praise — INNOVATIVE APPROACH", cam: C2 },
  { id: "J4", scene: "judge", a: 1764, b: TOTAL, label: "final hold on the praise", cam: C3 },
];

export const beatAt = (f: number): BeatDef =>
  BEATS.find((b) => f >= b.a && f < b.b) ?? BEATS[BEATS.length - 1];

// Sanity: no beat longer than 3.5s (105f). Longest is L4 (104f) — it carries
// a mid-beat prop pop (handcuffs at f998, "arrest") so the composition still
// changes inside the beat. D1 (103f) carries the $5,000,000 pop at f1065.

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
