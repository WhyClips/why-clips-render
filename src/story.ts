// Grigware Short — shot plan (14 shots, 1800 f @ 30 fps = 60.000 s).
// Boundaries are Whisper word anchors from words.json (VO 59.39 s, last word ends 59.06 s).
// 6 locations: workshop (prison carving) / train yard (robbery + getaway) / prison exterior
// (building + escape + recapture) / street (Spirit River: question, candy store, handshakes,
// bail crowd) / room (mayor's office + final gun) / office (fingerprint + match).
// Camera grammar follows the skill (story.ts): smootherstep glides 18-40 f, every hold
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

// ---------------- sets ----------------
// World-space origins: sets are 14 m wide and do not overlap.
export const SET_AT: Record<number, V3> = {
  1: [0, 0, 0],      // street — Spirit River, Canada (day)
  2: [40, 0, 0],     // interior room — mayor's office (day/golden)
  3: [-40, 0, 0],    // office — police station / fingerprinting (day)
  4: [0, 0, 70],     // prison exterior — Leavenworth gates + tracks + loco (day)
  5: [0, 0, -70],    // workshop — prison workshop, carving the wooden gun (golden)
  6: [0, 0, 140],    // train yard — 1909 mail-train robbery (day)
};
export const SET_NAME: Record<number, string> = { 1: "street", 2: "room", 3: "office", 4: "prison", 5: "workshop", 6: "trainyard" };

export type Light = "day" | "golden";
export type ShotDef = { id: number; a: number; b: number; light: Light; set: number };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 154, light: "day", set: 5 },    // HOOK: ECU wooden gun on the bench
  { id: 2, a: 154, b: 360, light: "day", set: 6 },     // robbery: ballplayers + mail sacks + $700
  { id: 3, a: 360, b: 488, light: "day", set: 4 },     // prisoners building their own prison
  { id: 4, a: 488, b: 659, light: "day", set: 4 },     // ESCAPE: loco drives through the gates
  { id: 5, a: 659, b: 697, light: "day", set: 4 },     // five recaptured
  { id: 6, a: 697, b: 736, light: "day", set: 6 },     // Frank alone walks away along the tracks
  { id: 7, a: 736, b: 828, light: "day", set: 1 },     // mid-story question: Frank on the street
  { id: 8, a: 828, b: 946, light: "day", set: 1 },     // candy store
  { id: 9, a: 946, b: 1057, light: "day", set: 2 },    // mayor's office, MAYOR 1916
  { id: 10, a: 1057, b: 1214, light: "day", set: 1 },  // handshakes at church
  { id: 11, a: 1214, b: 1433, light: "day", set: 3 },  // fingerprinting + 24 YEARS
  { id: 12, a: 1433, b: 1495, light: "day", set: 3 },  // the match: card + wanted poster
  { id: 13, a: 1495, b: 1689, light: "day", set: 1 },  // bail crowd + $10,000
  { id: 14, a: 1689, b: TOTAL, light: "day", set: 2 }, // FINAL: object-only, wooden gun on the desk
];
/** crossfades at shot changes; a white 4-frame flash after the hook (shot 1) */
export const XFADE: Record<number, number> = { 2: 8, 3: 8, 4: 8, 5: 8, 6: 8, 7: 8, 8: 8, 9: 8, 10: 8, 11: 8, 12: 8, 13: 8, 14: 8 };
export const FLASH_AT = 154;

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

// ---- shot 1 — workshop (day): ECU wooden gun on the bench, then medium on the prisoner ----
// Gun on the bench at (-0.1, 0.68, -67.95); prisoner behind the bench at (0, 0, -66.8).
// S1a looks DOWN at the bench top from above-front so the gun is the subject and the
// prisoner stays out of frame (was a giant face + hammer, gun invisible against his torso).
// Light is "day", not "golden": the golden preset leaves this windowless interior in
// hemisphere-only light and everything reads purple (walls, floor, bench).
const S1a = (f: number) => dolly([1.4, 2.1, -69.8], [-0.05, 0.6, -67.95], pushK(f, 0, 0.0028), { fov: 30 });
const S1b = (f: number) => dolly([3.4, 1.9, -72.8], [0, 1.4, -67.5], pushK(f, 80, 0.0022), { fov: 38, roll: -0.03 });
// ---- shot 2 — train yard (day): wide robbery, medium on Frank + sacks, ECU sacks + $700 ----
// Boxcar at (0, 0, 143); mail sacks at (2.0, 0, 140.5); ballplayers around (-2.4..3.2, 0, 139-140).
const S2a = (f: number) => dolly([7.5, 2.8, 130.5], [0, 1.6, 141], pushK(f, 154, 0.0022), { fov: 44 });
const S2b = (f: number) => dolly([4.0, 1.9, 136.2], [0.2, 1.4, 139.8], pushK(f, 230, 0.0022), { fov: 36, roll: 0.03 });
// S2c is a MEDIUM on the sacks + $700, not a tight ECU: at 3 m the 2.6 m number card
// filled the whole frame and was cut off on both sides. Pulled back so the card fits.
const S2c = (f: number) => dolly([4.5, 2.2, 135.5], [1.7, 1.0, 140.7], pushK(f, 310, 0.0025), { fov: 36 });
// ---- shot 3 — prison (day): wide of the half-built wall, medium on the builders ----
// Half-built wall at x -6..-2, z 72; facade at z 76; prisoners IN FRONT of the wall at z 70.2-70.8.
// S3a pulled back + wider so the full LEAVENWORTH sign (was cut off) and the builders fit.
const S3a = (f: number) => dolly([11.0, 3.4, 55.5], [-2.0, 2.4, 74], pushK(f, 360, 0.002), { fov: 46 });
const S3b = (f: number) => dolly([0.5, 2.2, 63.0], [-4.5, 1.3, 70.6], pushK(f, 420, 0.0025), { fov: 38, roll: -0.03 });
// ---- shot 4 — prison (day): ESCAPE, loco drives through the gates ----
// Loco starts z 71.5 (inside), ends z 79.5 (through the gate at z 76); gates at x +/-1.5, z 76.
const S4a = (f: number) => dolly([8.5, 3.0, 58.5], [0, 2.0, 74], pushK(f, 488, 0.0018), { fov: 44 });
const S4b = (f: number) => dolly([5.5, 2.2, 66.0], [0, 1.8, 74.5], pushK(f, 580, 0.0022), { fov: 38, roll: 0.03 });
// ---- shot 5 — prison (day): guards march five prisoners away ----
// Guards + prisoners at (-1, 0, 72.5).
const S5a = (f: number) => dolly([4.5, 1.9, 67.5], [-1, 1.4, 72.5], pushK(f, 659, 0.0025), { fov: 36 });
// ---- shot 6 — train yard (day): Frank alone walks away along the tracks (wide) ----
// Frank walks from (0.5, 0, 138) toward (0.5, 0, 134); camera wide down the tracks.
const S6a = (f: number) => dolly([5.0, 2.4, 130.0], [0.5, 1.4, 137], pushK(f, 697, 0.0022), { fov: 42 });
// ---- shot 7 — street (day): mid-story question, medium on Frank ----
// Frank at (0.5, 0, 1.5).
const S7a = (f: number) => dolly([2.8, 1.9, -4.5], [0.5, 1.5, 1.5], pushK(f, 736, 0.0022), { fov: 38 });
const S7b = (f: number) => dolly([1.9, 1.7, -2.4], [0.5, 1.5, 1.5], pushK(f, 790, 0.0025), { fov: 34, roll: -0.03 });
// ---- shot 8 — street (day): candy store, wide then medium on Frank behind the stall ----
// Stall at (-4, 0, 2.5); Frank behind it at (-4, 0, 3.4); customers at (-1.6, 0, 1.0) and (0.4, 0, 0.6).
// S8a re-aimed onto the stall + Frank — it framed only the customers before, no store in shot.
const S8a = (f: number) => dolly([2.0, 2.4, -6.0], [-3.0, 1.5, 2.8], pushK(f, 828, 0.002), { fov: 42 });
const S8b = (f: number) => dolly([0.2, 1.8, -3.2], [-3.2, 1.4, 2.8], pushK(f, 890, 0.0025), { fov: 36, roll: 0.03 });
// ---- shot 9 — room (day): mayor's office, medium then closer + MAYOR card ----
// Frank at (40.5, 0, 1.0); MAYOR card on the back wall at (40.5, 2.6, 5.0).
const S9a = (f: number) => dolly([44.5, 2.0, -4.5], [40.3, 1.5, 1.5], pushK(f, 946, 0.0022), { fov: 40 });
const S9b = (f: number) => dolly([42.8, 1.8, -2.5], [40.5, 1.5, 1.2], pushK(f, 1000, 0.0025), { fov: 34, roll: -0.03 });
// ---- shot 10 — street (day): handshakes, wide then medium ----
// Frank at (0.5, 0, 1.5); townsfolk at (-1.2, 0, 2.2) and (2.0, 0, 2.6).
const S10a = (f: number) => dolly([6.0, 2.4, -7.5], [0, 1.6, 2.0], pushK(f, 1057, 0.002), { fov: 44 });
const S10b = (f: number) => dolly([3.0, 1.8, -3.0], [0.5, 1.4, 1.8], pushK(f, 1140, 0.0025), { fov: 36, roll: 0.03 });
// ---- shot 11 — office (day): fingerprinting, wide -> medium -> ECU card ----
// Officer at (-40, 0, 3.2); Frank at desk (-40, 0, 2.4); card on desk at (-39.05, 0.85, 1.9).
// S11c looks DOWN at the card from the front — the men's faces were filling the ECU before.
const S11a = (f: number) => dolly([-35.0, 2.1, -5.0], [-40, 1.4, 2.2], pushK(f, 1214, 0.002), { fov: 42 });
const S11b = (f: number) => dolly([-37.5, 1.8, -1.5], [-40, 1.4, 2.8], pushK(f, 1300, 0.0022), { fov: 36, roll: -0.03 });
const S11c = (f: number) => dolly([-38.2, 1.4, 0.2], [-39.05, 0.85, 1.95], pushK(f, 1380, 0.0028), { fov: 30 });
// ---- shot 12 — office (day): the match, over-the-shoulder at the wanted poster ----
// Poster on the back wall at (-38.25, 2.1, 5.46); officer at (-39.6, 0, 3.4) seen from behind.
// S12a moved close to the poster and aimed straight at it — it framed a window before,
// poster cut off at the edge, officer invisible. Frank at (-37.4, 0, 4.4), left of the poster.
const S12a = (f: number) => dolly([-38.6, 2.0, 2.6], [-38.25, 2.05, 5.46], pushK(f, 1433, 0.0022), { fov: 34 });
const S12b = (f: number) => dolly([-37.8, 1.8, -1.0], [-39.6, 1.5, 3.4], pushK(f, 1465, 0.0025), { fov: 36, roll: -0.03 });
// ---- shot 13 — street (day): bail crowd, wide then closer + $10,000 card ----
// Crowd at (-1.5..3.3, 0, 1.2-2.2); $10,000 card above at (0.5, 2.8, 3.0).
const S13a = (f: number) => dolly([6.5, 2.6, -8.5], [0.5, 1.6, 1.5], pushK(f, 1495, 0.002), { fov: 44 });
const S13b = (f: number) => dolly([3.5, 2.0, -4.0], [0.8, 1.7, 1.2], pushK(f, 1600, 0.0022), { fov: 36, roll: 0.03 });
// ---- shot 14 — room (day): FINAL, object-only ECU, wooden gun on the desk ----
// Gun on the table at (39.55, 0.85, 2.75); no characters.
// Shot from above-front so the frame is the sunlit desk top (the old angle showed the
// shadowed desk faces, purple from the hemisphere ground bounce, and no gun at all).
// Light is "day", not "golden": golden leaves this interior purple (same as the workshop).
const S14a = (f: number) => dolly([40.3, 2.6, 1.2], [39.55, 0.85, 2.75], pushK(f, 1689, 0.0022), { fov: 28 });
const S14b = (f: number) => dolly([40.1, 2.3, 1.8], [39.55, 0.85, 2.75], pushK(f, 1750, 0.0025), { fov: 28 });

const CAMS: Record<number, Key[]> = {
  1: [{ f: 0, s: S1a }, { f: 80, dur: 30, s: S1b }],
  2: [{ f: 154, s: S2a }, { f: 230, dur: 30, s: S2b }, { f: 310, dur: 26, s: S2c }],
  3: [{ f: 360, s: S3a }, { f: 420, dur: 28, s: S3b }],
  4: [{ f: 488, s: S4a }, { f: 580, dur: 30, s: S4b }],
  5: [{ f: 659, s: S5a }],
  6: [{ f: 697, s: S6a }],
  7: [{ f: 736, s: S7a }, { f: 790, dur: 26, s: S7b }],
  8: [{ f: 828, s: S8a }, { f: 890, dur: 28, s: S8b }],
  9: [{ f: 946, s: S9a }, { f: 1000, dur: 26, s: S9b }],
  10: [{ f: 1057, s: S10a }, { f: 1140, dur: 28, s: S10b }],
  11: [{ f: 1214, s: S11a }, { f: 1300, dur: 28, s: S11b }, { f: 1380, dur: 26, s: S11c }],
  12: [{ f: 1433, s: S12a }, { f: 1465, dur: 20, s: S12b }],
  13: [{ f: 1495, s: S13a }, { f: 1600, dur: 28, s: S13b }],
  14: [{ f: 1689, s: S14a }, { f: 1750, dur: 24, s: S14b }],
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
  { f: 0, cInf: 14, focus: () => [-0.1, 0.68, -67.95] },   // S1 ECU: gun sharp, prisoner soft
  { f: 80, dur: 30, cInf: 12, focus: () => [0, 1.5, -66.8] }, // S1 medium: prisoner sharp
  { f: 154, cInf: 0 },                                  // S2 wide: establishing, all sharp
  { f: 230, dur: 30, cInf: 10, focus: () => [0.8, 1.4, 140.2] }, // S2 medium: Frank sharp
  { f: 310, dur: 26, cInf: 14, focus: () => [2.0, 1.0, 140.7] }, // S2 ECU: mail sacks sharp
  { f: 360, cInf: 0 },                                  // S3 wide
  { f: 420, dur: 28, cInf: 10, focus: () => [-4.5, 1.3, 70.6] }, // S3 medium: builders sharp
  { f: 488, cInf: 0 },                                  // S4 wide: gates + loco sharp
  { f: 580, dur: 30, cInf: 8, focus: () => [0, 1.8, 74.5] }, // S4 tracking: loco sharp
  { f: 659, cInf: 10, focus: () => [-1, 1.4, 72.5] },   // S5: prisoners sharp
  { f: 697, cInf: 6, focus: () => [0.5, 1.4, 137] },    // S6: Frank small, slight soft bg
  { f: 736, cInf: 12, focus: () => [0.5, 1.5, 1.5] },   // S7: Frank sharp
  { f: 790, dur: 26, cInf: 14, focus: () => [0.5, 1.5, 1.5] }, // S7 closer
  { f: 828, cInf: 0 },                                  // S8 wide: candy store
  { f: 890, dur: 28, cInf: 12, focus: () => [-3.2, 1.4, 2.8] }, // S8 medium: Frank at stall
  { f: 946, cInf: 12, focus: () => [40.5, 1.5, 1.0] },  // S9: mayor sharp
  { f: 1000, dur: 26, cInf: 14, focus: () => [40.5, 1.5, 1.2] }, // S9 closer
  { f: 1057, cInf: 0 },                                 // S10 wide
  { f: 1140, dur: 28, cInf: 12, focus: () => [0.5, 1.4, 1.8] }, // S10 medium
  { f: 1214, cInf: 0 },                                 // S11 wide office
  { f: 1300, dur: 28, cInf: 12, focus: () => [-40, 1.4, 2.8] }, // S11 medium
  { f: 1380, dur: 26, cInf: 14, focus: () => [-39.05, 0.85, 1.95] }, // S11 ECU: fingerprint card
  { f: 1433, cInf: 10, focus: () => [-38.25, 2.05, 5.46] }, // S12 OTS: poster sharp
  { f: 1465, dur: 20, cInf: 12, focus: () => [-39.6, 1.5, 3.4] }, // S12 medium: officer shock
  { f: 1495, cInf: 0 },                                 // S13 wide crowd
  { f: 1600, dur: 28, cInf: 10, focus: () => [0.8, 1.7, 1.2] }, // S13 closer
  { f: 1689, cInf: 14, focus: () => [39.55, 0.85, 2.75] }, // S14 ECU: gun sharp
  { f: 1750, dur: 24, cInf: 14, focus: () => [39.55, 0.85, 2.75] }, // S14 tighter
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
  { a: 154, b: 230, kit: "plant_bush", pos: [5.6, 0, 132.5], s: 1.1, yaw: 0.4 }, // S2 wide: bush, bottom-right
  { a: 828, b: 890, kit: "plant_bush", pos: [5.2, 0, -6.8], s: 1.1, yaw: 0.4 }, // S8 wide: bush, bottom-right
  { a: 1057, b: 1140, kit: "lantern", pos: [4.6, 0, -5.2], s: 1.0, yaw: 0 },     // S10 wide: lantern, bottom-right
  { a: 1495, b: 1600, kit: "plant_bush", pos: [5.2, 0, -6.8], s: 1.1, yaw: 0.4 }, // S13 wide: bush, bottom-right
  { a: 488, b: 580, kit: "cart", pos: [6.8, 0, 63.5], s: 0.9, yaw: -0.5 },       // S4 wide: cart, bottom-left
];
