// Timeline for "The Glassmaker" — stick-figure style.
// Setups, hard cuts, timed to the voiceover word timings.
import words from "./words.json";
import mouthCues from "./mouthCues.json";

export const FPS = 30;
export const TOTAL = 1944; // 64.8s @ 30fps (voiceover ends 62.6s + 2.2s tail)

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
// 12 scenes, boundaries set from Whisper word timings (words.json, 260 words,
// 249 WPM, exactly one pause >0.4s: 0.92s at 46.02s before "That night").
export type SceneId =
  | "hookDrop" | "hookBet" | "hammer" | "gaspsKing" | "boltUnbreakable"
  | "youseeFreeze" | "youseeSpring" | "nightSnip" | "dustDawn"
  | "vaultEmpty" | "outro" | "tailHold";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hookDrop", a: 0, b: 240 },        // ECU: glass drop into bucket, teardrop fished out
  { id: "hookBet", a: 240, b: 450 },       // court: teardrop handed to king, the bet, laughs
  { id: "hammer", a: 450, b: 612 },        // blacksmith raises, swings, CLANG, dent in steel
  { id: "gaspsKing", a: 612, b: 816 },     // wide court: gasps, king orders the GIANT bolt
  { id: "boltUnbreakable", a: 816, b: 906 }, // saws can't cut it, chisels bounce off
  { id: "youseeFreeze", a: 906, b: 1059 }, // ECU drop: outside freezes like a fist
  { id: "youseeSpring", a: 1059, b: 1380 }, // stretched spring inside, weak spot = thin tail
  { id: "nightSnip", a: 1380, b: 1590 },   // night vault: pliers snip, tension explodes
  { id: "dustDawn", a: 1590, b: 1725 },    // bolt shatters to dust, every coin gone
  { id: "vaultEmpty", a: 1725, b: 1812 },  // guards open the vault — no gold
  { id: "outro", a: 1812, b: 1884 },       // that's the glassmaker — king never saw it coming
  { id: "tailHold", a: 1884, b: TOTAL },   // final frame hold, bed only, 2s
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
