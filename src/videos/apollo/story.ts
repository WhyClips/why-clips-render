// Timeline for "The Apollo 11 Crew's Life Insurance Was Their Own Autographs" — Gullak Tales style.
// 16 setups, hard cuts every ~2-7s, timed to the voiceover word timings.
import words from "./words.json";
import mouthCues from "./mouthCues.json";

export const FPS = 30;
export const TOTAL = 2010; // 67.0s @ 30fps (voiceover ends 65.66s + tail)

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
  | "hook" | "crew1969" | "danger" | "insurersNo" | "noSafetyNet" | "plan"
  | "signing" | "friend" | "postmark" | "families" | "deal" | "youSee"
  | "homeSafe" | "neverNeeded" | "auction" | "lastline";

export type SceneDef = { id: SceneId; a: number; b: number };
export const SCENES: SceneDef[] = [
  { id: "hook", a: 0, b: 149 },          // rocket to Moon, NO LIFE INSURANCE
  { id: "crew1969", a: 149, b: 327 },    // 1969, three astronauts + names
  { id: "danger", a: 327, b: 383 },      // MOST DANGEROUS TRIP card
  { id: "insurersNo", a: 383, b: 574 },  // agent says NO / TOO RISKY / NO POLICY
  { id: "noSafetyNet", a: 574, b: 761 }, // worried crew, $0 payout
  { id: "plan", a: 761, b: 821 },        // lightbulb: THEIR OWN INSURANCE
  { id: "signing", a: 821, b: 1025 },    // quarantine room, signing envelopes
  { id: "friend", a: 1025, b: 1123 },    // friend + mailbag of envelopes
  { id: "postmark", a: 1123, b: 1244 },  // 16 JULY / 20 JULY 1969 stamps
  { id: "families", a: 1244, b: 1304 },  // envelopes handed to families
  { id: "deal", a: 1304, b: 1516 },      // THE DEAL: bills + college
  { id: "youSee", a: 1516, b: 1739 },    // envelope + PRICELESS card
  { id: "homeSafe", a: 1739, b: 1816 },  // capsule splashdown, THEY CAME HOME
  { id: "neverNeeded", a: 1816, b: 1860 }, // NEVER NEEDED badge
  { id: "auction", a: 1860, b: 1937 },   // auction gavel, envelope on stand
  { id: "lastline", a: 1937, b: TOTAL }, // $30,000 card + astronaut wink
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
