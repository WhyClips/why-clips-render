// Timeline for "Matisse — Le Bateau Upside Down" — stick-figure style.
// 15 scenes + tail hold, ~4s each (Azhar 25 Nov 18:59: visual change every 4s).
// Boundaries set from Whisper word timings (words.json, 241 script words,
// 249.7 WPM, exactly one pause >0.4s: 0.66s at 52.34s before "But here's the twist").
import words from "./words.json";
import mouthCues from "./mouthCues.json";

export const FPS = 30;
export const TOTAL = 1800; // 60.0s @ 30fps (voiceover ends 57.42s + 2.58s tail)

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
/** Lip-sync mouth shape at time t (seconds) — word-timing fallback cues */
export const mouthAt = (t: number): MouthShape => {
  for (const c of MOUTH) if (t >= c.s && t < c.e) return c.m;
  return "closed";
};

// ---------------- scenes ----------------
// 15 scenes + tailHold. Every scene has a PushIn camera move AND at least one
// animated element (walking crowd, flipping day-pages, rotating painting,
// moving magnifier, phone → flip) so no 4s window is ever static.
// Longest scenes: S6 5.33s (staff hammering + ladder shift mid-scene),
// S3 4.93s (day-pages flipping continuously), S1 4.57s (crowd walking).
export type SceneId =
  | "hookMuseum" | "hookExperts" | "hookCrowd" | "introBoat" | "hang1961"
  | "hangDoors" | "expertsPuzzle" | "youseeFlip" | "youseeCloud" | "habert123"
  | "reflection" | "catalogue" | "guard" | "phoneFlip" | "twistClosed"
  | "tailHold";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hookMuseum", a: 0, b: 137 },       // WIDE: hall, painting UPSIDE DOWN, crowds walk past
  { id: "hookExperts", a: 137, b: 224 },    // MEDIUM: curator + critic + Pierre stare, miss it
  { id: "hookCrowd", a: 224, b: 372 },      // MEDIUM: visitors admire it; day-pages flip 1→47
  { id: "introBoat", a: 372, b: 522 },      // ECU: the painting upside down — boat inverted (S4+S5)
  { id: "hang1961", a: 522, b: 682 },       // MEDIUM: staff hang it upside down, Oct 1961
  { id: "hangDoors", a: 682, b: 760 },      // WIDE: doors swing open, crowd streams in
  { id: "expertsPuzzle", a: 760, b: 866 },  // MEDIUM: experts with magnifiers, like a puzzle
  { id: "youseeFlip", a: 866, b: 997 },     // ECU: painting ROTATES 180° and back — reads both ways
  { id: "youseeCloud", a: 997, b: 1073 },   // MEDIUM: cloud photo flips upside down
  { id: "habert123", a: 1073, b: 1188 },    // MEDIUM: Genevieve visits 3 times, puzzled
  { id: "reflection", a: 1188, b: 1327 },   // ECU: complex reflection vs simple boat, magnifier
  { id: "catalogue", a: 1327, b: 1419 },    // MEDIUM: Habert checks catalogue, compares to wall
  { id: "guard", a: 1419, b: 1457 },        // MEDIUM: Habert tells the guard; guard shrugs
  { id: "phoneFlip", a: 1457, b: 1590 },    // MEDIUM: phone call → staff flip painting right-side up
  { id: "twistClosed", a: 1590, b: 1723 },  // WIDE: empty hall, rope barrier, painting right-side up
  { id: "tailHold", a: 1723, b: TOTAL },    // final frame hold, bed only, 2.58s
];

export const sceneAt = (f: number): SceneDef =>
  SCENES.find((s) => f >= s.a && f < s.b) ?? SCENES[SCENES.length - 1];

// ---------------- captions ----------------
/** The single word spoken at time t (seconds), with a small grace so a
 * word holds briefly past its end time instead of flickering out.
 * Karaoke captions show exactly this one word at a time. */
export const wordAt = (t: number): Word | null => {
  for (const w of WORDS) if (t >= w.s && t < w.e + 0.08) return w;
  return null;
};
