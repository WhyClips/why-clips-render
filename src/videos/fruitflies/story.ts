// Timeline for "The Man Who Dreamed an Alphabet" (Vai script, Liberia 1833) —
// Gullak Tales style. 7 scenes, 25 beats, hard cuts, timed to the voiceover
// word timings (Casper speed 108, atempo-stretched to 59.195 s, 196.6 WPM,
// last word ends 58.76 s).
import words from "./words.json";
import mouthCues from "./mouthCues.json";

export const FPS = 30;
export const TOTAL = 1800; // 60.000s @ 30fps (voiceover ends 58.76s + tail)

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
//   1833, 5.66s = 170f | One(night) 9.92s = 298f | So(he gathers) 16.92s = 508f
//   Outsiders 23.06s = 692f | Within 32.64s = 979f | You(see) 43.82s = 1315f
export type SceneId =
  | "hook" | "setup" | "dream" | "invent" | "doubt" | "spread" | "payoff";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hook", a: 0, b: 170 },       // dreamed a whole alphabet, by morning written
  { id: "setup", a: 170, b: 298 },    // 1833 Liberia, Bukele can't read a word
  { id: "dream", a: 298, b: 508 },    // stranger teaches signs; wakes, signs gone; idea stays
  { id: "invent", a: 508, b: 692 },   // gathers family, invents 200 symbols
  { id: "doubt", a: 692, b: 979 },    // outsiders laugh; glimpsed another alphabet; built himself
  { id: "spread", a: 979, b: 1315 },  // letters, berries, schools, 27 scripts
  { id: "payoff", a: 1315, b: TOTAL }, // You see pivot; survives; university/phones; final twist
];

export const sceneAt = (f: number): SceneDef =>
  SCENES.find((s) => f >= s.a && f < s.b) ?? SCENES[SCENES.length - 1];

// ---------------- beats ----------------
// 25 beats, each ≤ 100f (3.33s). P1 (100f) carries a mid-beat visual flip
// (gold "IT WAS DREAMED THERE" pops at f1376) so no single composition
// holds longer than ~3.5s; L3 flips schoolhouse -> flame at f1195;
// P3 pops the "200 YEARS" pill at f1495. Boundaries sit on word starts;
// every beat gets its OWN composition (beat camera reframe + content
// variant in Vai.tsx), so the picture visibly changes at least every ~3s.
export type BeatId =
  | "H1" | "H2"
  | "S1" | "S2"
  | "D1" | "D2" | "D3"
  | "I1" | "I2" | "I3"
  | "O1" | "O2" | "O3" | "O4"
  | "L1" | "L2" | "L3" | "L4"
  | "P1" | "P2" | "P3" | "P4" | "P5" | "P6" | "P7";

export type Cam = { s: number; x: number; y: number; o: string };
const C0: Cam = { s: 1.0, x: 0, y: 0, o: "50% 55%" };
const C1: Cam = { s: 1.1, x: -35, y: -25, o: "40% 50%" };
const C2: Cam = { s: 1.08, x: 35, y: 20, o: "60% 55%" };
const C3: Cam = { s: 1.14, x: 0, y: -40, o: "50% 40%" };

export type BeatDef = { id: BeatId; scene: SceneId; a: number; b: number; label: string; cam: Cam };
export const BEATS: BeatDef[] = [
  { id: "H1", scene: "hook", a: 0, b: 93, label: "dreaming, alphabet glyphs swirl", cam: C0 },
  { id: "H2", scene: "hook", a: 93, b: 170, label: "by morning, his language can be written", cam: C1 },
  { id: "S1", scene: "setup", a: 170, b: 248, label: "1833, Liberia map, Momolu Duwalu Bukele", cam: C0 },
  { id: "S2", scene: "setup", a: 248, b: 298, label: "can't read a single word, unread letter", cam: C2 },
  { id: "D1", scene: "dream", a: 298, b: 387, label: "stranger teaches him signs in the dream", cam: C0 },
  { id: "D2", scene: "dream", a: 387, b: 467, label: "he wakes, the signs are gone", cam: C1 },
  { id: "D3", scene: "dream", a: 467, b: 508, label: "but the idea stays, lightbulb", cam: C3 },
  { id: "I1", scene: "invent", a: 508, b: 582, label: "gathers his family, day and night", cam: C0 },
  { id: "I2", scene: "invent", a: 582, b: 636, label: "invent about 200 symbols", cam: C1 },
  { id: "I3", scene: "invent", a: 636, b: 692, label: "one for every syllable of Vai", cam: C2 },
  { id: "O1", scene: "doubt", a: 692, b: 765, label: "outsiders laugh, empires", cam: C0 },
  { id: "O2", scene: "doubt", a: 765, b: 841, label: "schools, centuries — not from a dream", cam: C2 },
  { id: "O3", scene: "doubt", a: 841, b: 895, label: "may have glimpsed another alphabet first", cam: C1 },
  { id: "O4", scene: "doubt", a: 895, b: 979, label: "nobody disputes he built this one himself", cam: C3 },
  { id: "L1", scene: "spread", a: 979, b: 1058, label: "letters, diaries within a generation", cam: C0 },
  { id: "L2", scene: "spread", a: 1058, b: 1151, label: "crush berries for ink", cam: C1 },
  { id: "L3", scene: "spread", a: 1151, b: 1235, label: "build their own schools, idea catches fire", cam: C2 },
  { id: "L4", scene: "spread", a: 1235, b: 1315, label: "inspiring 27 other West African scripts", cam: C0 },
  { id: "P1", scene: "payoff", a: 1315, b: 1415, label: "You see: writing wasn't handed, it was dreamed", cam: C0 },
  { id: "P2", scene: "payoff", a: 1415, b: 1462, label: "survives colonial rule, storm", cam: C1 },
  { id: "P3", scene: "payoff", a: 1462, b: 1531, label: "two rival scripts, 200 years", cam: C2 },
  { id: "P4", scene: "payoff", a: 1531, b: 1615, label: "taught at the University of Liberia, Unicode", cam: C0 },
  { id: "P5", scene: "payoff", a: 1615, b: 1669, label: "people text in it on their phones", cam: C1 },
  { id: "P6", scene: "payoff", a: 1669, b: 1715, label: "the man who started it all", cam: C2 },
  { id: "P7", scene: "payoff", a: 1715, b: TOTAL, label: "never learned to read a word (final)", cam: C1 },
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
