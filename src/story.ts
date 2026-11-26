// Moon Trees Short — shot plan (10 shots, 1800 f @ 30 fps = 60.000 s).
// Boundaries are Whisper word anchors from words.json (VO 59.54 s, last word ends 59.4 s).
// 5 locations: workshop (NASA lab: canister + seeds spill) / office (Mission Control +
// the forgotten-trees hunt) / nursery (germination, 420 seedlings) / street (Philadelphia
// planting + final Moon Tree at dusk) / park (White House lawn).
// Camera grammar follows the template (story.ts): smootherstep glides 18-40 f, every hold
// pushes in 0.15-0.35 %/f (no static hold >= 4 f), cuts on big reframes, rolls <= 0.07 rad.
// CAPTION RULE (by construction): every camera frames its subject so the subject's feet
// land above 80% of frame height — the bottom 12% band is floor only, so a centred
// 1-2 word caption can never overlap a character or a prop.
export const FPS = 30;
export const TOTAL = 1800;
export const D0 = 0; // ground height (m) — the template world sits on y = 0
export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 4;
export const glide = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };
// overshoot ease for number pop-ins (line animation, 26 Nov): scale 0.5 -> ~1.08 -> 1.0
export const easeOutBack = (u: number) => { const x = clamp01(u), c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

// ---------------- sets ----------------
// World-space origins: sets are 14 m wide and do not overlap.
export const SET_AT: Record<number, V3> = {
  1: [0, 0, 0],      // street — Philadelphia planting + final Moon Tree (day / golden)
  2: [40, 0, 0],     // interior room — unused in this video (kept for the set switch)
  3: [-40, 0, 0],    // office — Mission Control + the newspaper hunt (day)
  4: [0, 0, 70],     // park — White House lawn + the big Moon Tree pine (day)
  5: [0, 0, -70],    // workshop — NASA lab bench: the seed canister (day)
  6: [0, 0, 140],    // nursery — greenhouse + seedling trays (day)
};
export const SET_NAME: Record<number, string> = { 1: "street", 2: "room", 3: "office", 4: "park", 5: "workshop", 6: "nursery" };

export type Light = "day" | "golden";
export type ShotDef = { id: number; a: number; b: number; light: Light; set: number };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 207, light: "day", set: 5 },    // HOOK: ECU seed canister on the bench
  { id: 2, a: 207, b: 400, light: "day", set: 3 },  // Mission Control: Apollo 14, Roosa orbits
  { id: 3, a: 400, b: 520, light: "day", set: 5 },  // Roosa + canister: the firefighter backstory
  { id: 4, a: 520, b: 700, light: "day", set: 3 },  // 34 ORBITS: tracking the capsule (Moon poster)
  { id: 5, a: 700, b: 830, light: "day", set: 5 },  // splashdown: the canister bursts, seeds spill
  { id: 6, a: 830, b: 1010, light: "day", set: 6 }, // germination: 420 SEEDLINGS
  { id: 7, a: 1010, b: 1240, light: "day", set: 1 },// Philadelphia planting: 50 STATES
  { id: 8, a: 1240, b: 1420, light: "day", set: 4 },// White House lawn: the big pine
  { id: 9, a: 1420, b: 1560, light: "day", set: 3 },// the hunt: clippings + 110 FOUND
  { id: 10, a: 1560, b: TOTAL, light: "day", set: 1 }, // FINAL: Moon Tree at dusk + 1,000 SEEDS (day, not golden: golden turns this street purple)
];
/** crossfades at shot changes; a white 4-frame flash after the hook (shot 1) */
export const XFADE: Record<number, number> = { 2: 8, 3: 8, 4: 8, 5: 8, 6: 8, 7: 8, 8: 8, 9: 8, 10: 8 };
export const FLASH_AT = 207;

export const shotAt = (f: number) => SHOTS.find((s) => f >= s.a && f < s.b) ?? SHOTS[SHOTS.length - 1];
export const layersAt = (f: number): { id: number; alpha: number }[] => {
  for (const s of SHOTS) {
    const x = XFADE[s.id];
    if (x && f >= s.a - x / 2 && f < s.a + x / 2) return [{ id: s.id - 1, alpha: 1 }, { id: s.id, alpha: (f - (s.a - x / 2) + 1) / (x + 1) }];
  }
  return [{ id: shotAt(f).id, alpha: 1 }];
};

// ---------------- camera ----------------
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
type Shot = Partial<Cam> & { pos: V3; look: V3 };
type Key = { f: number; dur?: number; cut?: boolean; s: (f: number) => Shot };
const mix = (a: Cam, b: Cam, k: number): Cam => ({
  pos: a.pos.map((v, i) => v + (b.pos[i] - v) * k) as V3, look: a.look.map((v, i) => v + (b.look[i] - v) * k) as V3,
  fov: a.fov + (b.fov - a.fov) * k, roll: a.roll + (b.roll - a.roll) * k,
});
const full = (c: Shot): Cam => ({ fov: 40, roll: 0, ...c });
const run = (keys: Key[], f: number) => {
  let cur = full(keys[0].s(f));
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.f) break;
    cur = k.cut ? full(k.s(f)) : mix(cur, full(k.s(f)), glide((f - k.f) / (k.dur ?? 24)));
  }
  return cur;
};
/** push-in factor since f0: the subject grows ~rate per frame */
const pushK = (f: number, f0: number, rate: number, punch = 0, n = 35) => {
  const x = Math.max(0, f - f0);
  let s = rate * x;
  if (punch > rate) for (let i = 0; i < Math.min(x, n); i++) s += (punch - rate) * Math.max(0, Math.min(1, (i + 0.5) / 8, (n - i - 0.5) / 8));
  return Math.exp(-s);
};
/** dolly push: camera slides toward the look point by factor k */
const dolly = (pos: V3, look: V3, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos: [look[0] + (pos[0] - look[0]) * k, look[1] + (pos[1] - look[1]) * k, look[2] + (pos[2] - look[2]) * k], look, ...rest });

// ---- shot 1 — workshop (day): ECU seed canister on the bench, then medium on Roosa ----
// Canister lies on the bench at (-0.1, 0.68, -67.95), scaled 1.6x so the 6-inch can reads.
// S1a looks DOWN at it at ~55 deg from ~1.25 m: at that distance the 0.24 m canister
// spans ~65% of the frame width. Light is "day": golden leaves this windowless interior purple.
const S1a = (f: number) => dolly([0.4, 1.6, -69.3], [-0.1, 0.78, -67.95], pushK(f, 0, 0.0028), { fov: 30 });
const S1b = (f: number) => dolly([0.4, 2.0, -71.5], [0, 1.4, -66.5], pushK(f, 80, 0.0022), { fov: 40, roll: 0.02 });
// ---- shot 2 — office (day): Mission Control, wide then medium on Roosa at the console ----
// Roosa at the desk (-40, 0, 2.4); flight controller at (-40, 0, 3.2); Moon poster on the back wall.
const S2a = (f: number) => dolly([-35.0, 2.1, -5.0], [-40, 1.4, 2.2], pushK(f, 207, 0.002), { fov: 42 });
const S2b = (f: number) => dolly([-37.5, 1.8, -1.5], [-40, 1.4, 2.8], pushK(f, 300, 0.0022), { fov: 36, roll: -0.03 });
// ---- shot 3 — workshop (day): Roosa holds the canister, firefighter backstory ----
// Roosa behind the bench at (0, 0, -66.8), canister in hand.
const S3a = (f: number) => dolly([3.4, 1.9, -72.8], [0, 1.4, -67.5], pushK(f, 400, 0.0022), { fov: 38 });
// ---- shot 4 — office (day): orbit tracking, wide on the Moon poster + 34 ORBITS ----
// Number "34 ORBITS" at (-41.0, 2.7, 4.6), left of the poster; camera wide so the card fits.
const S4a = (f: number) => dolly([-34.5, 2.2, -5.5], [-39.3, 1.9, 3.8], pushK(f, 520, 0.002), { fov: 44 });
const S4b = (f: number) => dolly([-38.6, 1.8, -1.8], [-39.8, 1.5, 3.0], pushK(f, 620, 0.0025), { fov: 38, roll: -0.03 });
// ---- shot 5 — workshop (day): splashdown, the canister bursts — seeds spill on the bench ----
// Canister tipped on its side at (-0.1, 0.68, -67.95); seed pile spreads on the bench.
const S5a = (f: number) => dolly([3.2, 2.0, -72.0], [0.3, 1.1, -67.5], pushK(f, 700, 0.0025), { fov: 38 });
// ---- shot 6 — nursery (day): germination, wide on the greenhouse + seedling trays ----
// Greenhouse at (0, 0, 143); trays at z 139-141; scientist watering at (0.5, 0, 139.5).
const S6a = (f: number) => dolly([7.5, 2.8, 130.5], [0, 1.6, 141], pushK(f, 830, 0.0022), { fov: 48 });
const S6b = (f: number) => dolly([5.5, 2.4, 133.5], [0, 1.5, 140], pushK(f, 940, 0.0022), { fov: 40, roll: 0.03 });
// ---- shot 7 — street (day): Philadelphia planting ceremony, wide then medium ----
// Sapling at (0.5, 0, 1.5); Roosa + two townsfolk planting; "50 STATES" card above at (0.5, 2.8, 3.0).
const S7a = (f: number) => dolly([6.5, 2.6, -8.5], [0.5, 1.6, 1.5], pushK(f, 1010, 0.002), { fov: 44 });
const S7b = (f: number) => dolly([3.5, 2.0, -4.0], [0.8, 1.7, 1.2], pushK(f, 1130, 0.0022), { fov: 36, roll: 0.03 });
// ---- shot 8 — park (day): White House lawn, wide on the facade + the big pine ----
// Facade at z 76; the Moon Tree pine at (2, 0, 73); Roosa at (0.5, 0, 71.5).
const S8a = (f: number) => dolly([8.0, 3.2, 57.0], [-1.0, 2.4, 74], pushK(f, 1240, 0.002), { fov: 46 });
const S8b = (f: number) => dolly([9.5, 2.6, 58.0], [0.5, 2.0, 72.0], pushK(f, 1330, 0.0022), { fov: 42, roll: 0.03 });
// ---- shot 9 — office (day): the hunt, wide then ECU on the newspaper clippings ----
// Scientist at the desk (-40, 0, 2.4); clippings card on the desk at (-39.05, 0.86, 1.9).
const S9a = (f: number) => dolly([-35.0, 2.1, -5.0], [-40, 1.4, 2.2], pushK(f, 1420, 0.002), { fov: 42 });
const S9b = (f: number) => dolly([-38.0, 1.5, -0.8], [-39.05, 0.8, 1.95], pushK(f, 1490, 0.0028), { fov: 32 });
// ---- shot 10 — street (golden): FINAL, the Moon Tree at dusk + 1,000 SEEDS count-up ----
// Big oak at (6.4, 0, 3.0) behind; Roosa + seedling in the foreground at (0.5, 0, 1.5).
// Golden light: sunset behind the houses, warm sky.
const S10a = (f: number) => dolly([6.5, 2.0, -6.0], [0.3, 1.35, 2.0], pushK(f, 1560, 0.002), { fov: 44 });
const S10b = (f: number) => dolly([4.0, 1.7, -3.5], [0.5, 1.35, 1.9], pushK(f, 1700, 0.0025), { fov: 36, roll: 0.03 });

const CAMS: Record<number, Key[]> = {
  1: [{ f: 0, s: S1a }, { f: 80, dur: 30, s: S1b }],
  2: [{ f: 207, s: S2a }, { f: 300, dur: 30, s: S2b }],
  3: [{ f: 400, s: S3a }],
  4: [{ f: 520, s: S4a }, { f: 620, dur: 30, s: S4b }],
  5: [{ f: 700, s: S5a }],
  6: [{ f: 830, s: S6a }, { f: 940, dur: 28, s: S6b }],
  7: [{ f: 1010, s: S7a }, { f: 1130, dur: 28, s: S7b }],
  8: [{ f: 1240, s: S8a }, { f: 1330, dur: 28, s: S8b }],
  9: [{ f: 1420, s: S9a }, { f: 1490, dur: 26, s: S9b }],
  10: [{ f: 1560, s: S10a }, { f: 1700, dur: 24, s: S10b }],
};
export const camAt = (id: number, f: number): Cam => run(CAMS[id], f);
export const keyEnd = (id: number, f: number) => {
  let e = 0;
  for (const k of CAMS[id]) if (f >= k.f) e = k.f + (k.cut ? 0 : k.dur ?? 24);
  return Math.max(f, e);
};

// ---------------- lens: depth of field ----------------
// cInf = blur-disc radius in px at 1080x1920 for things at infinity; 0 = all sharp.
// DOF on close-ups/mediums (focus = the character or the hero object), wides stay sharp.
export type Dof = { f: number; dur?: number; cInf: number; focus?: (f: number) => V3 };
export const DOF: Dof[] = [
  { f: 0, cInf: 14, focus: () => [-0.1, 0.78, -67.95] },   // S1 ECU: canister sharp
  { f: 80, dur: 30, cInf: 12, focus: () => [0, 1.5, -66.8] }, // S1 medium: Roosa sharp
  { f: 207, cInf: 0 },                                  // S2 wide: Mission Control, all sharp
  { f: 300, dur: 30, cInf: 10, focus: () => [-40, 1.4, 2.8] }, // S2 medium: Roosa sharp
  { f: 400, cInf: 12, focus: () => [0, 1.5, -66.8] },   // S3: Roosa + canister sharp
  { f: 520, cInf: 0 },                                  // S4 wide: poster + number sharp
  { f: 620, dur: 30, cInf: 12, focus: () => [-39.6, 1.5, 3.4] }, // S4 medium: controller shock
  { f: 700, cInf: 14, focus: () => [-0.1, 0.8, -67.9] }, // S5: spilled seeds sharp
  { f: 830, cInf: 0 },                                  // S6 wide: greenhouse sharp
  { f: 940, dur: 28, cInf: 12, focus: () => [0.5, 1.4, 139.5] }, // S6 medium: scientist sharp
  { f: 1010, cInf: 0 },                                 // S7 wide: planting ceremony
  { f: 1130, dur: 28, cInf: 12, focus: () => [0.8, 1.7, 1.2] }, // S7 medium: planters sharp
  { f: 1240, cInf: 0 },                                 // S8 wide: White House lawn
  { f: 1330, dur: 28, cInf: 12, focus: () => [2, 1.8, 73] }, // S8 medium: the pine sharp
  { f: 1420, cInf: 0 },                                 // S9 wide: the hunt
  { f: 1490, dur: 26, cInf: 14, focus: () => [-39.05, 0.85, 1.95] }, // S9 ECU: clippings card
  { f: 1560, cInf: 0 },                                 // S10 wide: Moon Tree at dusk
  { f: 1700, dur: 24, cInf: 12, focus: () => [0.5, 1.35, 1.9] }, // S10 medium: Roosa + seedling
];
export const dofAt = (f: number) => {
  let i = 0; while (i + 1 < DOF.length && f >= DOF[i + 1].f) i++;
  const d = DOF[i], p = DOF[Math.max(0, i - 1)];
  const k = d.dur ? Math.min(1, (f - d.f) / d.dur) : 1;
  return { cInf: p.cInf + (d.cInf - p.cInf) * k, focus: d.focus };
};
export const focusAt = (id: number, f: number): V3 => {
  const d = dofAt(f);
  return d.focus ? d.focus(f) : camAt(id, f).look;
};

// ---------------- foreground framing props ----------------
// Near the lens, at a frame corner, never in the caption band's centre. kit = a GLB name
// accepted by build.ts prop()/kitClone() (or a code-built fallback in worlds.ts).
// pos = base point, s = height in metres, yaw in radians. Ranges stay inside one shot.
export type Fg = { a: number; b: number; kit: string; pos: V3; s?: number; yaw?: number };
export const FOREGROUND: Fg[] = [
  { a: 830, b: 940, kit: "plant_bush", pos: [5.6, 0, 132.5], s: 1.1, yaw: 0.4 }, // S6 wide: bush, bottom-right
  { a: 1010, b: 1130, kit: "plant_bush", pos: [5.2, 0, -6.8], s: 1.1, yaw: 0.4 }, // S7 wide: bush, bottom-right
  { a: 1560, b: 1700, kit: "lantern", pos: [4.6, 0, -5.2], s: 1.0, yaw: 0 },     // S10 wide: lantern, bottom-right
  { a: 1240, b: 1330, kit: "plant_bush", pos: [5.2, 0, 66.8], s: 1.1, yaw: 0.4 }, // S8 wide: bush, bottom-right
];
