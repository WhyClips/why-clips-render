// Template timeline: 5 reusable 3D sets, 6 s each, 30 s total (900 f @ 30 fps).
// Per-video code replaces the demo words/shots; the SETS, cameras and rules stay.
// Camera grammar follows the skill (story.ts): smootherstep glides 18-40 f, every hold
// pushes in 0.15-0.35 %/f (no static hold >= 4 f), cuts on big reframes, rolls <= 0.07 rad.
// CAPTION RULE (by construction): every camera frames its subject so the subject's feet
// land above 80% of frame height — the bottom 12% band is floor only, so a centred
// 1-2 word caption can never overlap a character or a prop.
export const FPS = 30;
export const TOTAL = 900;
export const D0 = 0; // ground height (m) — the template world sits on y = 0
export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 4;
export const glide = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };

// ---------------- sets ----------------
// World-space origins: sets are 14 m wide and do not overlap.
export const SET_AT: Record<number, V3> = {
  1: [0, 0, 0],      // street (day)
  2: [40, 0, 0],     // interior room (day)
  3: [-40, 0, 0],    // office (day)
  4: [0, 0, 70],     // exterior building (golden)
  5: [0, 0, -70],    // workshop (golden)
};
export const SET_NAME: Record<number, string> = { 1: "street", 2: "room", 3: "office", 4: "exterior", 5: "workshop" };

export type Light = "day" | "golden";
export type ShotDef = { id: number; a: number; b: number; light: Light; set: number; az?: number };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 180, light: "day", set: 1 },
  { id: 2, a: 180, b: 360, light: "day", set: 2 },
  { id: 3, a: 360, b: 540, light: "day", set: 3 },
  { id: 4, a: 540, b: 720, light: "golden", set: 4 },
  // workshop is an interior open on the camera side: sun from BEHIND the camera
  // (az 170) so the back wall + bench are lit warm; the golden default (az 6,
  // backlight) leaves every camera-facing surface in the blue shade term = purple.
  { id: 5, a: 720, b: TOTAL, light: "golden", set: 5, az: 170 },
];
/** crossfades at set changes; a white 4-frame flash after the hook (shot 1) */
export const XFADE: Record<number, number> = { 2: 8, 3: 8, 4: 8, 5: 8 };
export const FLASH_AT = 180;

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

// ---- shot 1 — street (day): wide down the street, then a medium on the walker ----
// Walker stands at (0.5, 0, 1.5); houses line the back (z = +6), stalls at the sides.
const S1a = (f: number) => dolly([2.5, 2.8, -10.5], [0, 1.6, 1.5], pushK(f, 0, 0.0025), { fov: 46 }); // look z 1.5: sight rays end BEFORE the house fronts (z 1.9) so house() keeps both houses
const S1b = (f: number) => dolly([2.6, 1.9, -4.2], [0.5, 1.35, 1.5], pushK(f, 60, 0.002), { fov: 38, roll: -0.03 }); // look y 1.35: walker sits ~2% higher, feet clear of the caption band
// ---- shot 2 — room (day): character by the table, painting on the back wall ----
// Character at (40.5, 0, 1.0); table at (39, 0, 2.5); window on the left wall.
const S2a = (f: number) => dolly([45.5, 2.1, -6.0], [40.2, 1.5, 1.5], pushK(f, 180, 0.0022), { fov: 42 });
const S2b = (f: number) => dolly([43.2, 2.0, -4.6], [40.5, 1.1, 1.0], pushK(f, 260, 0.0025), { fov: 40, roll: 0.03 }); // pulled back + lower look: feet land ~77%, clear of the caption band
// ---- shot 3 — office (day): worker at the desk, laptop glowing ----
// Desk at (-40, 0, 2.0); worker behind it at (-40, 0, 3.2); columns at the sides.
const S3a = (f: number) => dolly([-35.2, 2.0, -5.0], [-40, 1.35, 2.2], pushK(f, 360, 0.0022), { fov: 40 });
const S3b = (f: number) => dolly([-37.0, 2.0, -3.0], [-40, 1.0, 2.6], pushK(f, 450, 0.0025), { fov: 40, roll: -0.03 }); // pulled back + lower look: feet clear of the caption band
// ---- shot 4 — exterior (golden): wide of the building + steps, then closer on the tourist ----
// Building front at z = 74; steps from z = 71.6 to 74.0; tourist on the top step at (0.8, 0.75, 73.5).
const S4a = (f: number) => dolly([9.5, 3.0, 52.0], [0, 2.8, 71.5], pushK(f, 540, 0.0018), { fov: 44 }); // pulled back: whole 12 m building + sky + lawn in frame; look z 71.5 keeps the house (cull box z 73.4)
const S4b = (f: number) => dolly([4.0, 2.4, 65.0], [0.8, 1.8, 72.5], pushK(f, 630, 0.0022), { fov: 38, roll: 0.03 }); // higher + look in front of the house (z 72.5): house kept, steps' near edge lifts to ~82%
// ---- shot 5 — workshop (golden): craftsman at the bench, hammer raised ----
// Bench at (0, 0, -68); craftsman behind it at (0, 0, -66.8); shelves on the back wall (z = -63.5).
const S5a = (f: number) => dolly([4.6, 1.9, -75.5], [0, 1.35, -67.8], pushK(f, 720, 0.0022), { fov: 40 });
const S5b = (f: number) => dolly([2.2, 1.7, -71.6], [0, 1.5, -67.6], pushK(f, 800, 0.0028), { fov: 35, roll: -0.03 });

const CAMS: Record<number, Key[]> = {
  1: [{ f: 0, s: S1a }, { f: 60, dur: 30, s: S1b }],
  2: [{ f: 180, s: S2a }, { f: 260, dur: 28, s: S2b }],
  3: [{ f: 360, s: S3a }, { f: 450, dur: 28, s: S3b }],
  4: [{ f: 540, s: S4a }, { f: 630, dur: 28, s: S4b }],
  5: [{ f: 720, s: S5a }, { f: 800, dur: 26, s: S5b }],
};
export const camAt = (id: number, f: number): Cam => run(CAMS[id], f);
export const keyEnd = (id: number, f: number) => {
  let e = 0;
  for (const k of CAMS[id]) if (f >= k.f) e = k.f + (k.cut ? 0 : k.dur ?? 24);
  return Math.max(f, e);
};

// ---------------- lens: depth of field ----------------
// cInf = blur-disc radius in px at 1080x1920 for things at infinity; 0 = all sharp.
// DOF on close-ups/mediums (focus = the character), wides stay sharp.
export type Dof = { f: number; dur?: number; cInf: number; focus?: (f: number) => V3 };
export const DOF: Dof[] = [
  { f: 0, cInf: 10, focus: () => [0.5, 1.5, 1.5] },    // street wide: walker sharp, houses soft
  { f: 60, dur: 30, cInf: 12, focus: () => [0.5, 1.5, 1.5] }, // walker medium
  { f: 180, cInf: 12, focus: () => [40.5, 1.45, 1.0] }, // room: character sharp, back wall soft
  { f: 260, dur: 28, cInf: 14, focus: () => [40.5, 1.45, 1.0] }, // room close-up
  { f: 360, cInf: 12, focus: () => [-40, 1.4, 2.6] },  // office: worker sharp
  { f: 450, dur: 28, cInf: 14, focus: () => [-40, 1.4, 2.6] }, // office close-up
  { f: 540, cInf: 0 },                                // exterior wide: establishing, all sharp
  { f: 630, dur: 28, cInf: 10, focus: () => [0.8, 1.6, 73.5] }, // tourist medium
  { f: 720, cInf: 12, focus: () => [0, 1.5, -67.6] },  // workshop: craftsman sharp
  { f: 800, dur: 26, cInf: 14, focus: () => [0, 1.5, -67.6] }, // workshop close-up
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
  { a: 0, b: 60, kit: "plant_bush", pos: [5.2, 0, -6.8], s: 1.1, yaw: 0.4 },   // street wide: bush, bottom-right corner
  { a: 720, b: 800, kit: "cart", pos: [3.6, 0, -73.6], s: 0.9, yaw: -0.5 },     // workshop wide: cart, bottom-left corner
];
