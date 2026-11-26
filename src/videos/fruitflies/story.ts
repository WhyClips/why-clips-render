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

// ---------------- scenes ----------------
// Boundaries sit on exact word anchors (30 fps):
//   Apollo 6.90s = 207f | But 17.66s = 530f | They(planted) 27.34s = 820f
//   For 34.10s = 1023f | Then(forgotten) 41.72s = 1252f | And(2022) 52.40s = 1572f
export type SceneId =
  | "hook" | "apollo14" | "orbits" | "sprout" | "states" | "hunt" | "artemis";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hook", a: 0, b: 207 },       // seed canister ECU + Moon + "500 SEEDS"
  { id: "apollo14", a: 207, b: 530 }, // launch, two astronauts on Moon, Roosa alone + canister
  { id: "orbits", a: 530, b: 820 },   // never touched Moon, 34 orbits, splashdown burst, spilled salt
  { id: "sprout", a: 820, b: 1023 },  // planted anyway, 420 seedlings
  { id: "states", a: 1023, b: 1252 }, // 50 states, Philadelphia, White House pine
  { id: "hunt", a: 1252, b: 1572 },   // forgotten, teacher asks, clippings, 110 found
  { id: "artemis", a: 1572, b: TOTAL }, // Artemis I, 1,000 seeds, final big pine
];

export const sceneAt = (f: number): SceneDef =>
  SCENES.find((s) => f >= s.a && f < s.b) ?? SCENES[SCENES.length - 1];

// ---------------- beats (v3 — Azhar 26 Nov 12:33: "Scene har 3 sec baad use kr") ----------------
// 22 beats, each ≤ 105f (3.5s) — the old 7 scenes ran 6–11s each, too long.
// Boundaries sit on word starts / natural pauses; every beat gets its OWN
// composition (beat camera reframe + content variant in MoonTrees.tsx), so the
// picture visibly changes at least every ~3s. STANDING RULE going forward:
// scene every 3 seconds in Why Clips Shorts (supersedes the old ~4s rule).
export type BeatId =
  | "H1" | "H2" | "H3"
  | "A1" | "A2" | "A3" | "A4"
  | "O1" | "O2" | "O3"
  | "S1" | "S2"
  | "T1" | "T2" | "T3"
  | "U1" | "U2" | "U3" | "U4"
  | "R1" | "R2" | "R3";

export type Cam = { s: number; x: number; y: number; o: string };
const C0: Cam = { s: 1.0, x: 0, y: 0, o: "50% 55%" };
const C1: Cam = { s: 1.1, x: -35, y: -25, o: "40% 50%" };
const C2: Cam = { s: 1.08, x: 35, y: 20, o: "60% 55%" };
const C3: Cam = { s: 1.14, x: 0, y: -40, o: "50% 40%" };

export type BeatDef = { id: BeatId; scene: SceneId; a: number; b: number; label: string; cam: Cam };
export const BEATS: BeatDef[] = [
  { id: "H1", scene: "hook", a: 0, b: 69, label: "canister ECU, 500 seeds", cam: C0 },
  { id: "H2", scene: "hook", a: 69, b: 138, label: "tight push-in, seeds drift", cam: C1 },
  { id: "H3", scene: "hook", a: 138, b: 207, label: "sprout out of canister + White House mini", cam: C2 },
  { id: "A1", scene: "apollo14", a: 207, b: 297, label: "Apollo 14 launch", cam: C0 },
  { id: "A2", scene: "apollo14", a: 297, b: 387, label: "moonwalk close-up → Roosa in orbit", cam: C3 },
  { id: "A3", scene: "apollo14", a: 387, b: 458, label: "Roosa + orbit diagram, firefighter badge", cam: C1 },
  { id: "A4", scene: "apollo14", a: 458, b: 530, label: "Roosa close-up, big canister", cam: C2 },
  { id: "O1", scene: "orbits", a: 530, b: 627, label: "never touched the Moon → 34 orbits", cam: C0 },
  { id: "O2", scene: "orbits", a: 627, b: 724, label: "orbit diagram big → splashdown fall", cam: C1 },
  { id: "O3", scene: "orbits", a: 724, b: 820, label: "BURST! → spilled like salt", cam: C3 },
  { id: "S1", scene: "sprout", a: 820, b: 922, label: "planted anyway, Mississippi + California", cam: C0 },
  { id: "S2", scene: "sprout", a: 922, b: 1023, label: "420 seedlings, dense trays", cam: C2 },
  { id: "T1", scene: "states", a: 1023, b: 1099, label: "50 states, five pines", cam: C0 },
  { id: "T2", scene: "states", a: 1099, b: 1175, label: "Philadelphia planting", cam: C1 },
  { id: "T3", scene: "states", a: 1175, b: 1252, label: "White House pine + waving crew", cam: C3 },
  { id: "U1", scene: "hunt", a: 1252, b: 1332, label: "FORGOTTEN… faded pine", cam: C0 },
  { id: "U2", scene: "hunt", a: 1332, b: 1412, label: "schoolteacher asks NASA", cam: C2 },
  { id: "U3", scene: "hunt", a: 1412, b: 1492, label: "newspaper clippings hunt, zoomed", cam: C1 },
  { id: "U4", scene: "hunt", a: 1492, b: 1572, label: "110 FOUND, celebrating crew", cam: C3 },
  { id: "R1", scene: "artemis", a: 1572, b: 1648, label: "Artemis I rocket rises", cam: C0 },
  { id: "R2", scene: "artemis", a: 1648, b: 1724, label: "1,000 new seeds, big canister", cam: C1 },
  { id: "R3", scene: "artemis", a: 1724, b: TOTAL, label: "grandchildren growing, big pine park", cam: C2 },
];

export const beatAt = (f: number): BeatDef =>
  BEATS.find((b) => f >= b.a && f < b.b) ?? BEATS[BEATS.length - 1];

// Sanity: no beat longer than 3.5s (105f). Verified by `node -e` at build time
// and by the v3 verifier from the final MP4's cut list.

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
