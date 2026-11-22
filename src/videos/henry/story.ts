// Timeline of the Henry Box Brown demo short: 10 beats / 12 shots timed to the v1 voiceover
// word timings (words.json). Camera grammar measured from the reference study: continuous slow
// push-ins; symmetric ease-in-out moves ~23 f; big reframes are cuts; impacts are 7-frame kicks
// that flip sign every frame; no hand-held float. Ground level D0 = 0 (unlike the bridge short).
export const FPS = 30;
export const TOTAL = 1992;
export const D0 = 0;
export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 4;
const lin = (pts: [number, number][], x: number) => {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return pts[pts.length - 1][1];
};

// ---------------- set positions (world layout) ----------------
export const WORKSHOP: V3 = [0, 0, 0];       // room centre (shots 1-4)
export const WAGON0: V3 = [70, 0, 0];        // wagon road (shot 5)
export const TRAIN: V3 = [-70, 0, 0];        // boxcar interior (shot 6)
export const BOAT: V3 = [0, 0, 70];          // steamboat deck (shots 7, 9)
export const BOXIN: V3 = [12, 0, 70];        // inside the crate, night (shot 8)
export const INSERTS: V3 = [0, 0, -70];      // parcel table + carriers (shot 10)
export const PHILLY: V3 = [-70, 0, 70];      // warm Philadelphia room (shots 11-12)
export const CRATE = { w: 0.95, h: 0.75, d: 0.65 }; // the hero prop: ~3 ft long

// ---------------- story physics ----------------
/** wagon x during shot 5 (camera tracks it); parked elsewhere */
export const wagonX = (f: number) => 66 + Math.max(0, Math.min(1, (f - 742) / 94)) * 7;
/** crate bounce on the wagon (shot 5): vertical hop + roll wobble, biggest bump at f~800 */
export const boxBounce = (f: number): { y: number; rz: number } => {
  if (f < 742 || f >= 837) return { y: 0, rz: 0 };
  const t = (f - 742) / 30;
  const bump = Math.exp(-(((f - 800) / 14) ** 2));
  return { y: 0.03 * Math.abs(Math.sin(t * 9)) + 0.22 * bump * Math.abs(Math.sin((f - 794) * 0.5)), rz: 0.05 * Math.sin(t * 7) + 0.3 * bump * Math.sin((f - 794) * 0.45) };
};
/** crate rattle in the boxcar (shot 6): fast small shakes, then stillness on "worst part" */
export const boxRattle = (f: number): { x: number; y: number; rz: number } => {
  if (f < 837 || f >= 961) return { x: 0, y: 0, rz: 0 };
  const still = smooth((f - 934) / 12); // "and then the worst part" @934: rattle dies out
  const k = 1 - still;
  return { x: 0.02 * k * Math.sin(f * 1.9) + 0.012 * k * Math.sin(f * 3.7), y: 0.012 * k * Math.abs(Math.sin(f * 2.3)), rz: 0.03 * k * Math.sin(f * 1.3) };
};
/** payoff lid: 0 = shut, 1 = fully off (lifts + tilts away, f1756-1810) */
export const lidLift = (f: number) => smooth((f - 1756) / 54);
/** Henry rising out of the crate (f1770-1840): 0 = hidden in the box, 1 = standing tall */
export const henryRise = (f: number) => smooth((f - 1770) / 70);
/** inserts crate carried along in 3 steps (shot 10, f1360-1440) */
export const insertsCrateX = (f: number) =>
  0.8 * smooth((f - 1360) / 20) + 0.8 * smooth((f - 1390) / 20) + 0.8 * smooth((f - 1420) / 20);
/** Henry lowering himself into the crate (shot 1, f45-85): 0 = standing, 1 = tucked in */
export const henryLower = (f: number) => smooth((f - 45) / 40);
/** Henry walking into the workshop (shot 1, f0-45): x from -2.8 to -0.2, then stops */
export const henryWalkX = (f: number) => -2.8 + 2.6 * smooth(f / 45);
/** lid tremble before it comes off (f1680-1756): the knock answers from inside */
export const lidTremble = (f: number) => (f >= 1680 && f < 1756 ? 0.006 * Math.sin(f * 1.1) * smooth((f - 1680) / 30) : 0);

// ---------------- shots ----------------
export type Light = "day" | "golden" | "night";
export type SetName = "workshop" | "wagon" | "train" | "boat" | "boxin" | "inserts" | "philly";
export type ShotDef = { id: number; a: number; b: number; light: Light; set: SetName; tau: (t: number) => number };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 90, light: "day", set: "workshop", tau: (t) => t },       // HOOK: climbs into the box
  { id: 2, a: 90, b: 240, light: "day", set: "workshop", tau: (t) => t },     // SETUP: tobacco factory
  { id: 3, a: 240, b: 518, light: "day", set: "workshop", tau: (t) => t },    // SETUP: family, 3 ft, 27 hours
  { id: 4, a: 518, b: 742, light: "day", set: "workshop", tau: (t) => t },    // MOCKER: nailed + laughed
  { id: 5, a: 742, b: 837, light: "day", set: "wagon", tau: (t) => t },       // ESC 1: wagon throws him
  { id: 6, a: 837, b: 961, light: "day", set: "train", tau: (t) => t },       // ESC 2: train shakes him
  { id: 7, a: 961, b: 1043, light: "night", set: "boat", tau: (t) => t },     // ESC 3a: box upside down
  { id: 8, a: 1043, b: 1136, light: "night", set: "boxin", tau: (t) => t },   // ESC 3b: inside the box
  { id: 9, a: 1136, b: 1199, light: "night", set: "boat", tau: (t) => t },    // ESC 3c: men laugh louder
  { id: 10, a: 1199, b: 1453, light: "golden", set: "inserts", tau: (t) => t },// YOU SEE: tape, address, carriers
  { id: 11, a: 1453, b: 1746, light: "golden", set: "philly", tau: (t) => t }, // PAYOFF 1: knock, "All right?"
  { id: 12, a: 1746, b: TOTAL, light: "golden", set: "philly", tau: (t) => t },// PAYOFF 2: lid off, sings
];
/** crossfades (frames) at place changes; a white 4-frame flash after the hook */
export const XFADE: Record<number, number> = { 5: 8, 6: 8, 7: 8, 10: 8, 11: 8 };
export const FLASH_AT = 90;

export const shotAt = (f: number) => SHOTS.find((s) => f >= s.a && f < s.b) ?? SHOTS[SHOTS.length - 1];
/** layers to draw at frame f: base shot, plus the next shot fading in during a crossfade */
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
/** reference camera ease: symmetric smootherstep (attack = release, ~10 f each on a 23 f move) */
export const glide = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };
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
const T = (f: number) => f / FPS;
/** push-in factor since f0: the subject grows ~rate per frame; `punch` raises it (with 8 f soft edges) for the first n frames */
const pushK = (f: number, f0: number, rate: number, punch = 0, n = 35) => {
  const x = Math.max(0, f - f0);
  let s = rate * x;
  if (punch > rate) for (let i = 0; i < Math.min(x, n); i++) s += (punch - rate) * Math.max(0, Math.min(1, (i + 0.5) / 8, (n - i - 0.5) / 8));
  return Math.exp(-s);
};
/** dolly push: camera slides toward the look point by factor k */
const dolly = (pos: V3, look: V3, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos: [look[0] + (pos[0] - look[0]) * k, look[1] + (pos[1] - look[1]) * k, look[2] + (pos[2] - look[2]) * k], look, ...rest });
/** zoom push (camera stays put, for lenses next to walls): tan(fov/2) shrinks by k */
const zoom = (pos: V3, look: V3, fov: number, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos, look, fov: (360 / Math.PI) * Math.atan(Math.tan((fov * Math.PI) / 360) * k), ...rest });
/** a roll-only move on top of an existing framing */
const rolled = (s: (f: number) => Shot, roll: number) => (f: number): Shot => ({ ...s(f), roll });

// ---- framings (f -> camera); each pushes in from the frame its key starts ----
// shot 1 (hook): MS on Henry walking to the crate, then closer as he lowers himself in
// (framing fix: the first framing was too tight — Henry walked in off-screen left)
const S1a = (f: number) => dolly([3.4, 1.9, 5.4], [-0.7, 1.0, -0.8], pushK(f, 0, 0.0025), { fov: 44 });
const S1b = (f: number) => dolly([1.8, 1.4, 2.8], [0, 0.9, -0.8], pushK(f, 45, 0.003), { fov: 40 });
// shot 2 (factory): glide across the room following Henry at the bench
const S2a = (f: number) => dolly([-3.2, 1.7, 3.4], [0.5, 1.2, -1.5], pushK(f, 90, 0.002), { fov: 42 });
const S2b = (f: number) => dolly([-0.5, 1.6, 3.2], [1.5, 1.2, -1.2], pushK(f, 160, 0.002), { fov: 40 });
// shot 3: MS Henry by the crate -> CU tape measure on "three feet" -> MS water/biscuits + tally
// (stills QA round 1: every 9:16 framing was too tight — subjects walked out of frame; all pulled back)
const S3a = (f: number) => dolly([0.8, 1.6, 4.2], [-0.4, 1.1, -0.7], pushK(f, 240, 0.002), { fov: 42 });
const S3b = (f: number) => dolly([1.2, 0.9, 1.6], [0, 0.5, -0.8], pushK(f, 350, 0.003), { fov: 36 });
const S3c = (f: number) => dolly([0.2, 1.5, 4.0], [-0.4, 1.1, -0.7], pushK(f, 400, 0.0025), { fov: 42 });
// shot 4 (mocker): two-shot -> closer on the laughing handler -> the silent closed box
const S4a = (f: number) => dolly([1.0, 1.8, 5.8], [0, 1.2, -0.5], pushK(f, 518, 0.002), { fov: 44 });
const S4b = (f: number) => dolly([1.4, 1.6, 2.3], [0.95, 1.5, -0.1], pushK(f, 600, 0.0025), { fov: 36 });
const S4c = (f: number) => dolly([0.8, 1.4, 2.6], [0, 0.9, -0.8], pushK(f, 660, 0.002), { fov: 38 });
// shot 5 (wagon): tracking WS alongside the moving wagon, dutch tilt on the biggest bump
const S5a = (f: number) => { const x = wagonX(f); return dolly([x - 3.2, 2.0, 6.5], [x - 0.5, 1.0, 0], pushK(f, 742, 0.0015), { fov: 44 }); };
// shot 6 (train): boxcar interior, push-in on the rattling box, stillness on "worst part"
const S6a = (f: number) => dolly([-69.3, 1.5, 4.2], [-70, 0.8, 0], pushK(f, 837, 0.002), { fov: 42 });
const S6b = (f: number) => dolly([-69.6, 1.1, 2.6], [-70, 0.6, 0], pushK(f, 920, 0.004), { fov: 38 });
// shot 7 (boat night): WS deck, upside-down box
const S7a = (f: number) => dolly([1.8, 2.0, 76.5], [0, 1.0, 70], pushK(f, 961, 0.002), { fov: 46 });
// shot 8 (inside the box): CU Henry upside down, calm
const S8a = (f: number) => dolly([12, 1.2, 73.2], [12, 0.9, 70], pushK(f, 1043, 0.002), { fov: 40 });
// shot 9 (boat night): CU laughing faces above
const S9a = (f: number) => dolly([0.3, 1.7, 74.8], [0.3, 1.5, 71.2], pushK(f, 1136, 0.003), { fov: 42 });
// shot 10 (you see): tape CU -> address CU -> carriers chain wide
const S10a = (f: number) => dolly([0.7, 1.7, -67.6], [0, 1.35, -70], pushK(f, 1199, 0.0025), { fov: 36 });
const S10b = (f: number) => dolly([-0.6, 1.4, -67.0], [0, 1.25, -70], pushK(f, 1305, 0.0025), { fov: 38 });
// carriers wide tracks the crate as it is walked right (straight-on: an angled camera hid carriers behind the crate)
const S10c = (f: number) => { const cx = insertsCrateX(f); return dolly([cx, 1.9, -65], [cx, 1.2, -70], pushK(f, 1340, 0.002), { fov: 44 }); };
// shot 11 (payoff 1): box on the floor -> man kneels and knocks -> shock reaction
const S11a = (f: number) => dolly([-68.2, 1.6, 74.2], [-69.8, 0.9, 70], pushK(f, 1453, 0.002), { fov: 42 });
const S11b = (f: number) => dolly([-68.6, 1.5, 73.6], [-69.6, 0.9, 70], pushK(f, 1570, 0.0025), { fov: 40 });
const S11c = (f: number) => dolly([-68.8, 1.5, 73.2], [-69.4, 1.1, 70.3], pushK(f, 1700, 0.003), { fov: 38 });
// shot 12 (payoff 2): lid lifts -> Henry stands and sings -> crane pull-back wide
const S12a = (f: number) => dolly([-68.8, 1.5, 73.0], [-70, 1.0, 70], pushK(f, 1746, 0.003), { fov: 40 });
const S12b = (f: number) => dolly([-69.2, 1.5, 72.6], [-70, 1.4, 70], pushK(f, 1828, 0.002), { fov: 38 });
const S12c = (f: number) => dolly([-67.5, 2.2, 75.5], [-70, 1.2, 70], pushK(f, 1900, 0.001), { fov: 44 });

const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: S1a },
    { f: 45, dur: 24, s: S1b }, // closer as he lowers himself into the crate
  ],
  2: [
    { f: 90, s: S2a },
    { f: 160, dur: 30, s: S2b }, // glide across the room
  ],
  3: [
    { f: 240, s: S3a },
    { f: 350, dur: 24, s: S3b }, // CU tape measure on "three feet" @367
    { f: 400, dur: 24, s: S3c }, // MS water/biscuits, "27 hours" @410
  ],
  4: [
    { f: 518, s: S4a },
    { f: 600, dur: 20, s: S4b }, // closer on "Enjoy the ride" @587
    { f: 660, dur: 20, s: S4c }, // back to calm Henry, "said nothing" @644
  ],
  5: [
    { f: 742, s: S5a },
    { f: 792, dur: 16, s: rolled(S5a, 0.07) }, // dutch tilt 4 deg on the biggest bump ~f800
    { f: 812, dur: 16, s: rolled(S5a, 0) },
  ],
  6: [
    { f: 837, s: S6a },
    { f: 920, dur: 18, s: S6b }, // push-in on the box, "worst part" @946
  ],
  7: [{ f: 961, s: S7a }],
  8: [{ f: 1043, s: S8a }],
  9: [{ f: 1136, s: S9a }],
  10: [
    { f: 1199, s: S10a }, // tape CU
    { f: 1305, dur: 20, s: S10b }, // address CU, "write an address" @1305
    { f: 1340, dur: 24, s: S10c }, // carriers chain wide
  ],
  11: [
    { f: 1453, s: S11a },
    { f: 1570, dur: 20, s: S11b }, // kneel + knock, "knocked" @1576
    { f: 1700, dur: 20, s: S11c }, // shock reaction, "All right, sir" @1724
  ],
  12: [
    { f: 1746, s: S12a }, // lid lifts
    { f: 1828, dur: 24, s: S12b }, // stands and sings @1828
    { f: 1900, dur: 30, s: S12c }, // crane pull-back on the last line
  ],
};

// impact kicks (reference): image offset flips sign every frame, decays to 0 in 7 f.
// Timed to the reused v1 SFX: hammer thuds @f71/f83, knocks @f1576/f1587.
const KICKS: [number, number][] = [
  [71 / FPS, 0.5], [83 / FPS, 0.4],                 // hook: "nail it shut" thuds
  [546 / FPS, 0.6], [560 / FPS, 0.5], [575 / FPS, 0.5], // mocker hammer strikes on "nailed"
  [800 / FPS, 0.8],                                  // wagon's biggest bump
  [1576 / FPS, 0.5], [1587 / FPS, 0.4],             // Philadelphia knocks
  [1761 / FPS, 0.5],                                 // lid comes off
];
export const kickAt = (t: number) => {
  let a = 0;
  for (const [t0, g] of KICKS) {
    const n = Math.floor((t - t0) * FPS + 1e-6);
    if (n >= 0 && n < 7) a += g * (n % 2 ? -1 : 1) * (1 - n / 7) ** 1.5;
  }
  return a;
};
export const camAt = (id: number, f: number): Cam => {
  const c = run(CAMS[id], f), a = kickAt(T(f));
  if (!a) return c;
  const d: V3 = [c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]];
  const L = Math.hypot(...d), h = Math.hypot(d[0], d[2]) || 1;
  const m = (3 / 640) * Math.tan((c.fov * Math.PI) / 360) * L * a; // metres at the look distance for 3 px x a
  return { ...c, look: [c.look[0] - (d[2] / h) * m, c.look[1] + 0.6 * m, c.look[2] + (d[0] / h) * m], roll: c.roll + a * 0.004 };
};
/** frame at which the current key's move has finished (for picking billboard views per key, not per frame) */
export const keyEnd = (id: number, f: number) => {
  let e = 0;
  for (const k of CAMS[id]) if (f >= k.f) e = k.f + (k.cut ? 0 : k.dur ?? 24);
  return Math.max(f, e);
};

// ---------------- lens: depth of field ----------------
/** Lens blur per shot (thin lens). cInf = blur-disc radius in px at 1080x1920 for things at infinity; 0 = all sharp.
 *  Entries switch on cuts (no dur) or ramp with the camera glide they share f/dur with. focus = world point (else the
 *  camera look point). */
export type Dof = { f: number; dur?: number; cInf: number; focus?: (f: number) => V3 };
const crateFace = (c: V3, y = 0.6): V3 => [c[0], y, c[2]];
export const DOF: Dof[] = [
  { f: 0, cInf: 12, focus: () => [0, 1.5, -0.8] },        // hook MS: Henry's eyes sharp
  { f: 90, cInf: 0 },                                     // factory glide (wide)
  { f: 240, cInf: 10, focus: () => [0, 1.3, -0.8] },      // MS Henry by the crate
  { f: 350, dur: 24, cInf: 14, focus: () => crateFace([0, 0, -0.8], 0.45) }, // tape CU
  { f: 400, dur: 24, cInf: 10, focus: () => [0, 1.3, -0.8] },
  { f: 518, cInf: 12, focus: () => [0, 1.4, -0.8] },      // mocker two-shot
  { f: 742, cInf: 0 },                                    // wagon tracking wide
  { f: 837, cInf: 10, focus: () => crateFace(TRAIN) },    // train box
  { f: 920, dur: 18, cInf: 12, focus: () => crateFace(TRAIN) },
  { f: 961, cInf: 8, focus: () => crateFace(BOAT) },      // boat deck MS
  { f: 1043, cInf: 12, focus: () => [12, 1.0, 70] },      // inside the box CU
  { f: 1136, cInf: 14, focus: () => [0.3, 1.5, 70] },     // laughing faces CU
  { f: 1199, cInf: 14, focus: () => [0, 1.4, -70] },      // tape/address inserts
  { f: 1340, dur: 24, cInf: 0 },                          // carriers wide
  { f: 1453, cInf: 10, focus: () => crateFace(PHILLY) },  // box on the floor
  { f: 1570, dur: 20, cInf: 12, focus: () => [-69.7, 1.2, 70] }, // knock CU
  { f: 1746, cInf: 10, focus: () => [-70, 1.2, 70] },     // lid + Henry
  { f: 1900, dur: 30, cInf: 0 },                          // crane wide
];
export const dofAt = (f: number) => {
  let i = 0; while (i + 1 < DOF.length && f >= DOF[i + 1].f) i++;
  const d = DOF[i], p = DOF[Math.max(0, i - 1)];
  const k = d.dur ? Math.min(1, (f - d.f) / d.dur) : 1;
  return { cInf: p.cInf + (d.cInf - p.cInf) * k, focus: d.focus };
};
/** what the lens focuses on (DOF): the DOF table's focus point, else the camera look point */
export const focusAt = (id: number, f: number): V3 => {
  const d = dofAt(f);
  return d.focus ? d.focus(f) : camAt(id, f).look;
};

// ---------------- hammer timing (mocker, shot 4) ----------------
/** hammer strikes on "nailed" (f546) + two follow-ups; 0 = raised, 1 = struck */
export const HITS = [546 / FPS, 560 / FPS, 575 / FPS];
export const hammerK = (t: number) => {
  let k = 1;
  for (const th of HITS) {
    const n = (t - th) * FPS; // frames to contact
    if (n >= -11 && n < -7) k = Math.min(k, 1 - smooth((n + 11) / 4));
    else if (n >= -7 && n < 0) k = 0;
  }
  return k;
};
