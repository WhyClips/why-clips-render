// Timeline for "The Island That Disappeared From Maps" — Gullak Tales style.
// 16 setups, hard cuts every ~3-7s, timed to the voiceover word timings.
import words from "./words.json";
import mouthCues from "./mouthCues.json";

export const FPS = 30;
export const TOTAL = 2190; // 73.0s @ 30fps (voiceover ends 71.64s + tail)

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
  | "hook" | "nameCard" | "coralSea" | "googleMaps" | "sizeCard" | "copyCopy"
  | "mocker" | "voyage" | "coordinates" | "nothing" | "depthCard" | "french1974"
  | "pumice" | "erase" | "deleted" | "lastline";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hook", a: 0, b: 162 },         // map, island fades out, IT VANISHED
  { id: "nameCard", a: 162, b: 264 },   // SANDY ISLAND chalk card
  { id: "coralSea", a: 264, b: 402 },   // map: Australia / island / New Caledonia
  { id: "googleMaps", a: 402, b: 480 }, // phone card, Google Maps pin
  { id: "sizeCard", a: 480, b: 558 },   // 25 km x 5 km infographic
  { id: "copyCopy", a: 558, b: 648 },   // stack of maps, copied for 136 years
  { id: "mocker", a: 648, b: 792 },     // cartographer laughs, IT'S ON THE MAP!
  { id: "voyage", a: 792, b: 936 },     // research ship sails, 2012
  { id: "coordinates", a: 936, b: 1038 }, // 19°15'S 159°55'E + sonar
  { id: "nothing", a: 1038, b: 1200 },  // empty ocean, scientist, NOTHING.
  { id: "depthCard", a: 1200, b: 1290 },// 1,400 m DEEP gauge
  { id: "french1974", a: 1290, b: 1512 }, // 1974, FRANCE REMOVED IT
  { id: "pumice", a: 1512, b: 1710 },   // pumice raft, 1876 whaling ship
  { id: "erase", a: 1710, b: 1860 },    // map, island erased with red X
  { id: "deleted", a: 1860, b: 1992 },  // DELETED + globe
  { id: "lastline", a: 1992, b: TOTAL },// scientist wink, NEVER ON EARTH
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
