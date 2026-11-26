// Timeline for "Moon Trees — NASA Flew 500 Seeds Around the Moon" — Gullak Tales style.
// 7 setups, hard cuts, timed to the voiceover word timings.
import words from "./words.json";
import mouthCues from "./mouthCues.json";

export const FPS = 30;
export const TOTAL = 1800; // 60.000s @ 30fps (voiceover ends 59.4s + tail)

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

// ---------------- scenes (v4 — new script, slower VO 59.668s) ----------------
// Boundaries sit on exact word anchors (30 fps):
//   Apollo 7.08s = 212f | But 14.96s = 449f | But(planted) 29.28s = 878f
//   For 36.26s = 1088f | Then(forgotten) 43.56s = 1307f | In(2022) 52.00s = 1560f
export type SceneId =
  | "hook" | "apollo14" | "orbits" | "sprout" | "states" | "hunt" | "artemis";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hook", a: 0, b: 212 },       // seed canister ECU + Moon + "500 SEEDS"
  { id: "apollo14", a: 212, b: 449 }, // launch, moonwalk → Roosa alone + canister
  { id: "orbits", a: 449, b: 878 },   // never touched Moon, 34 orbits, splashdown burst, spilled salt
  { id: "sprout", a: 878, b: 1088 },  // planted anyway, 420 seedlings, stubborn as weeds
  { id: "states", a: 1088, b: 1307 }, // 50 states, Philadelphia, White House pine
  { id: "hunt", a: 1307, b: 1560 },   // forgotten, teacher asks, clippings, 110 found
  { id: "artemis", a: 1560, b: TOTAL }, // Artemis I, 1,000 seeds, final big pine
];

export const sceneAt = (f: number): SceneDef =>
  SCENES.find((s) => f >= s.a && f < s.b) ?? SCENES[SCENES.length - 1];

// ---------------- beats (v4 — re-cut to the new slower script) ----------------
// 22 beats, each ≤ 105f (3.5s) — except S2 (110f), which carries a mid-beat
// visual flip at f1030 ("stubborn") so no single composition holds >3.5s.
// Boundaries sit on word starts / natural pauses; every beat gets its OWN
// composition (beat camera reframe + content variant in MoonTrees.tsx), so the
// picture visibly changes at least every ~3s. STANDING RULE going forward:
// scene every 3 seconds in Why Clips Shorts (supersedes the old ~4s rule).
export type BeatId =
  | "H1" | "H2" | "H3"
  | "A1" | "A2" | "A3"
  | "O1" | "O2" | "O3" | "O4" | "O5"
  | "S1" | "S2"
  | "T1" | "T2" | "T3"
  | "U1" | "U2" | "U3"
  | "R1" | "R2" | "R3";

export type Cam = { s: number; x: number; y: number; o: string };
const C0: Cam = { s: 1.0, x: 0, y: 0, o: "50% 55%" };
const C1: Cam = { s: 1.1, x: -35, y: -25, o: "40% 50%" };
const C2: Cam = { s: 1.08, x: 35, y: 20, o: "60% 55%" };
const C3: Cam = { s: 1.14, x: 0, y: -40, o: "50% 40%" };

export type BeatDef = { id: BeatId; scene: SceneId; a: number; b: number; label: string; cam: Cam };
export const BEATS: BeatDef[] = [
  { id: "H1", scene: "hook", a: 0, b: 69, label: "canister ECU, 500 seeds", cam: C0 },
  { id: "H2", scene: "hook", a: 69, b: 138, label: "tight push-in, NASA thought them dead", cam: C1 },
  { id: "H3", scene: "hook", a: 138, b: 212, label: "sprout out of canister + White House mini", cam: C2 },
  { id: "A1", scene: "apollo14", a: 212, b: 297, label: "Apollo 14 launch", cam: C0 },
  { id: "A2", scene: "apollo14", a: 297, b: 363, label: "moonwalk close-up → Roosa in orbit", cam: C3 },
  { id: "A3", scene: "apollo14", a: 363, b: 449, label: "Roosa thinking + firefighter badge + canister", cam: C1 },
  { id: "O1", scene: "orbits", a: 449, b: 538, label: "never touched the Moon → 34 orbits", cam: C0 },
  { id: "O2", scene: "orbits", a: 538, b: 635, label: "glory + splashdown", cam: C1 },
  { id: "O3", scene: "orbits", a: 635, b: 720, label: "BURST!", cam: C3 },
  { id: "O4", scene: "orbits", a: 720, b: 795, label: "mixed like salt, ruined", cam: C0 },
  { id: "O5", scene: "orbits", a: 795, b: 878, label: "written off as dead", cam: C2 },
  { id: "S1", scene: "sprout", a: 878, b: 978, label: "planted anyway, Mississippi + California", cam: C0 },
  { id: "S2", scene: "sprout", a: 978, b: 1088, label: "420 seedlings, dense trays + wildfire flip f1030", cam: C2 },
  { id: "T1", scene: "states", a: 1088, b: 1161, label: "50 states, five pines", cam: C0 },
  { id: "T2", scene: "states", a: 1161, b: 1242, label: "Philadelphia planting", cam: C1 },
  { id: "T3", scene: "states", a: 1242, b: 1307, label: "White House pine + waving crew", cam: C3 },
  { id: "U1", scene: "hunt", a: 1307, b: 1408, label: "FORGOTTEN… faded pine", cam: C0 },
  { id: "U2", scene: "hunt", a: 1408, b: 1470, label: "schoolteacher asks NASA", cam: C2 },
  { id: "U3", scene: "hunt", a: 1470, b: 1560, label: "hunted clippings, 110 FOUND reveal", cam: C1 },
  { id: "R1", scene: "artemis", a: 1560, b: 1633, label: "Artemis I rocket rises", cam: C0 },
  { id: "R2", scene: "artemis", a: 1633, b: 1716, label: "1,000 new seeds, big canister", cam: C1 },
  { id: "R3", scene: "artemis", a: 1716, b: TOTAL, label: "grandchildren growing, big pine park", cam: C2 },
];

export const beatAt = (f: number): BeatDef =>
  BEATS.find((b) => f >= b.a && f < b.b) ?? BEATS[BEATS.length - 1];

// Sanity: no beat longer than 3.5s (105f) except S2 (110f), which carries a
// mid-beat visual flip at f1030 so no composition holds longer than 3.5s.
// Verified by `node -e` at build time and by the v4 verifier from the final
// MP4's cut list.

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
