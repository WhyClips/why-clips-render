// Grigware Short — per-SHOT character staging (14 shots, 6 sets).
// Uses the skill's cast.ts: person() (2D toon card, 3.5 head-heights, plum ink, expression
// library, blinks), blob() (tight contact shadow + sun-direction tail), lidAt() (blinks).
// World.update() calls stageSet(setId, t, cam) per frame; the shot is derived from t,
// so the same set stages different characters per shot (e.g. office = fingerprinting in
// S11, the match in S12). Characters change expression 0-3 frames BEFORE their word
// (LEAD), never mid-word. Frank is one consistent outfit (brown jacket + cap) in every
// era except the mayor shot (dark suit + tophat) — costume = identity.
import * as THREE from "three";
import { CamInfo, Stage, Who, person, blob, lidAt, viewOf } from "./bridge/cast";
import { townsfolk, Expr, fxStars, fxBurst } from "./bridge/toon";
import { FPS, shotAt } from "./story";

const who = (i: number, o: Who["o"]): Who => ({ i, o, okey: `${o.jacket}|${o.pants}|${o.hat ?? ""}|${o.build ?? "adult"}` });

/** front view toward the camera: walk/facing direction = character -> camera */
const faceCam = (cam: CamInfo, x: number, z: number) => {
  const dx = cam.pos.x - x, dz = cam.pos.z - z, l = Math.hypot(dx, dz) || 1;
  return viewOf(cam, x, z, dx / l, dz / l);
};

// ---- the cast ----
// Frank Grigware — brown jacket, dark pants, flat cap. Same outfit 1909-1934 (identity).
const FRANK: Who["o"] = { jacket: "#6e4b33", pants: "#3b3f52", boots: "#4a3426", hat: "cap", cap: "#3b3f52" };
// Frank as mayor — dark suit + tophat.
const MAYOR: Who["o"] = { jacket: "#2e2a33", pants: "#2e2a33", boots: "#1f1b24", hat: "tophat" };
// Ballplayers — white shirts, caps.
const BALL: Who["o"] = { jacket: "#efe9dc", pants: "#3b3f52", boots: "#4a3426", hat: "cap", cap: "#efe9dc" };
// Prisoners — grey work clothes, caps.
const PRISONER: Who["o"] = { jacket: "#8a8d94", pants: "#6e6a72", boots: "#4a3426", hat: "cap", cap: "#6e6a72" };
// Guards / police — navy, caps.
const GUARD: Who["o"] = { jacket: "#2f3a5c", pants: "#2f3a5c", boots: "#1f1b24", hat: "cap", cap: "#2f3a5c" };

export const stageSet = (setId: number, t: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [] };
  const f = Math.round(t * FPS);
  const shot = shotAt(f);
  const lt = t - shot.a / FPS; // seconds inside this shot
  const blink = (i: number) => lidAt(t, i);
  const id = shot.id;

  if (id === 1) {
    // S1 workshop: Frank carving at the bench, stern; a guard watches, nervous.
    // (The wooden gun itself is a 3D mesh on the bench — see worlds.ts.)
    const w = who(1, FRANK);
    out.places.push(person(cam, w, 0, 0, -66.8, faceCam(cam, 0, -66.8),
      { mode: "stand", expr: "stern", blink: blink(1), prop: ["hammer", 0.6] },
      { mode: "stand", expr: "stern", blink: blink(1) }));
    blob(out, 0, 0, -66.8, 1);
    const g = who(2, GUARD);
    out.places.push(person(cam, g, 2.6, 0, -66.2, faceCam(cam, 2.6, -66.2),
      { mode: "stand", expr: "nervous", blink: blink(2), look: -1 },
      { mode: "stand", expr: "nervous", blink: blink(2) }));
    blob(out, 2.6, 0, -66.2, 1);
    // hammer strike burst on the bench every 2 s
    const cyc = lt % 2;
    if (cyc < 0.5) {
      const ph = cyc / 0.5;
      out.fx.push({ key: `burst|${Math.round(ph * 10)}`, cw: 256, ch: 256, draw: (p) => fxBurst(p, ph), x: 0.45, y: 1.35, z: -67.6, w: 0.8, h: 0.8 });
    }
  } else if (id === 2) {
    // S2 train yard: Frank + four ballplayers with the mail sacks, grinning, mid-robbery.
    // All five in FRONT of the boxcar (z <= 139.8) and clear of the sack pile
    // (x 1.5..2.5, z 139.6..141.2) — two were hidden behind/inside the boxcar before.
    const spots: [number, number, number][] = [[0.2, 139.6, 1], [1.0, 139.2, 3], [-1.2, 139.8, 4], [3.2, 139.0, 5], [-2.4, 139.4, 6]];
    for (const [x, z, i] of spots) {
      const w = who(i, i === 1 ? FRANK : BALL);
      const v = faceCam(cam, x, z);
      out.places.push(person(cam, w, x, 0, z, v,
        { mode: "stand", expr: "grin", blink: blink(i), look: i % 2 ? 1 : -1 },
        { mode: "stand", expr: "grin", blink: blink(i) }));
      blob(out, x, 0, z, 1);
    }
  } else if (id === 3) {
    // S3 prison: three prisoners building the half-built wall, one hammering, one carrying stone.
    // IN FRONT of the wall (front face z 71.2) — they were embedded inside it before (z 71.5+).
    const spots: [number, number, number, Expr][] = [[-4.5, 70.4, 7, "stern"], [-3.2, 70.8, 8, "stern"], [-5.8, 70.2, 9, "dazed"]];
    for (const [x, z, i, e] of spots) {
      const w = who(i, PRISONER);
      const v = viewOf(cam, x, z, 1, 0.2);
      out.places.push(person(cam, w, x, 0, z, v,
        { mode: i === 7 ? "stand" : "stroll", phase: lt * 0.9, expr: e, blink: blink(i), prop: i === 7 ? ["hammer", 0.5] : undefined },
        { mode: i === 7 ? "stand" : "march", phase: lt * 0.9, expr: e, blink: blink(i), stride: 0.4 }));
      blob(out, x, 0, z, 1);
    }
  } else if (id === 4) {
    // S4 prison: the escape — Frank + five prisoners rush the loco, guards shocked.
    // The loco itself animates through the gates in World.update().
    const spots: [number, number, number][] = [[-1.6, 72.2, 10], [-1.0, 73.4, 11], [1.6, 72.8, 12], [-2.6, 73.2, 13], [1.8, 73.4, 14]];
    for (const [x, z, i] of spots) {
      const w = who(i, i === 10 ? FRANK : PRISONER);
      const v = viewOf(cam, x, z, 0.3, 1);
      out.places.push(person(cam, w, x, 0, z, v,
        { mode: "stroll", phase: lt * 2.2, expr: "grin", blink: blink(i) },
        { mode: "march", phase: lt * 2.2, expr: "grin", blink: blink(i), stride: 0.55 }));
      blob(out, x, 0, z, 1);
    }
    // two guards, shocked, hands up
    for (const [x, z, i] of [[3.4, 71.0, 15], [-3.6, 70.6, 16]] as [number, number, number][]) {
      const w = who(i, GUARD);
      out.places.push(person(cam, w, x, 0, z, faceCam(cam, x, z),
        { mode: "stand", expr: "shock", blink: blink(i) },
        { mode: "stand", expr: "shock", blink: blink(i) }));
      blob(out, x, 0, z, 1);
    }
    if (lt > 1 && lt < 1.6) {
      const ph = Math.min(1, (lt - 1) / 0.6);
      out.fx.push({ key: `stars|${Math.round(ph * 10)}`, cw: 256, ch: 256, draw: (p) => fxStars(p, ph), x: 3.4, y: 3.0, z: 71.0, w: 0.9, h: 0.9 });
    }
  } else if (id === 5) {
    // S5 prison: guards march five prisoners away (heads down), Frank already gone.
    for (let k = 0; k < 5; k++) {
      const x = -2.4 + k * 0.9, z = 72.5 - (k % 2) * 0.5, i = 20 + k;
      const w = who(i, PRISONER);
      const v = viewOf(cam, x, z, -1, 0.1);
      out.places.push(person(cam, w, x, 0, z, v,
        { mode: "stroll", phase: lt * 0.9 + k * 0.4, expr: "dazed", blink: blink(i) },
        { mode: "march", phase: lt * 0.9 + k * 0.4, expr: "dazed", blink: blink(i), stride: 0.4 }));
      blob(out, x, 0, z, 1);
    }
    for (const [x, z, i] of [[-3.6, 72.0, 25], [2.6, 72.2, 26]] as [number, number, number][]) {
      const w = who(i, GUARD);
      out.places.push(person(cam, w, x, 0, z, faceCam(cam, x, z),
        { mode: "stand", expr: "stern", blink: blink(i) },
        { mode: "stand", expr: "stern", blink: blink(i) }));
      blob(out, x, 0, z, 1);
    }
  } else if (id === 6) {
    // S6 train yard: Frank ALONE walks away along the tracks, back to camera.
    const wx = 0.5, wz = 138 - lt * 0.8;
    const w = who(30, FRANK);
    const v = viewOf(cam, wx, wz, 0, -1);
    out.places.push(person(cam, w, wx, 0, wz, v,
      { mode: "stroll", phase: lt * 0.9, expr: "neutral", blink: blink(30) },
      { mode: "march", phase: lt * 0.9, expr: "neutral", blink: blink(30), stride: 0.45 }));
    blob(out, wx, 0, wz, 1);
  } else if (id === 7) {
    // S7 street: Frank, mid-story question — puzzled shrug at the camera.
    const w = who(31, FRANK);
    out.places.push(person(cam, w, 0.5, 0, 1.5, faceCam(cam, 0.5, 1.5),
      { mode: "stand", expr: "nervous", blink: blink(31), look: 1 },
      { mode: "stand", expr: "nervous", blink: blink(31) }));
    blob(out, 0.5, 0, 1.5, 1);
  } else if (id === 8) {
    // S8 street: Frank behind the candy stall, grinning; two customers at the stall.
    const w = who(32, FRANK);
    out.places.push(person(cam, w, -4, 0, 3.4, faceCam(cam, -4, 3.4),
      { mode: "stand", expr: "grin", blink: blink(32) },
      { mode: "stand", expr: "grin", blink: blink(32) }));
    blob(out, -4, 0, 3.4, 1);
    for (const [x, z, i] of [[-1.6, 1.0, 33], [0.4, 0.6, 34]] as [number, number, number][]) {
      const t = who(i, townsfolk(i));
      out.places.push(person(cam, t, x, 0, z, faceCam(cam, x, z),
        { mode: "stand", expr: "laugh", blink: blink(i) },
        { mode: "stand", expr: "laugh", blink: blink(i) }));
      blob(out, x, 0, z, 1);
    }
  } else if (id === 9) {
    // S9 room: Mayor Frank at his desk, proud grin.
    const w = who(35, MAYOR);
    out.places.push(person(cam, w, 40.5, 0, 1.0, faceCam(cam, 40.5, 1.0),
      { mode: "stand", expr: "grin", blink: blink(35) },
      { mode: "stand", expr: "grin", blink: blink(35) }));
    blob(out, 40.5, 0, 1.0, 1);
  } else if (id === 10) {
    // S10 street: Frank shaking hands with two townsfolk, laughing.
    const w = who(36, FRANK);
    out.places.push(person(cam, w, 0.5, 0, 1.5, faceCam(cam, 0.5, 1.5),
      { mode: "stand", expr: "laugh", blink: blink(36) },
      { mode: "stand", expr: "laugh", blink: blink(36) }));
    blob(out, 0.5, 0, 1.5, 1);
    for (const [x, z, i] of [[-1.2, 2.2, 37], [2.0, 2.6, 38]] as [number, number, number][]) {
      const t = who(i, townsfolk(i));
      out.places.push(person(cam, t, x, 0, z, faceCam(cam, x, z),
        { mode: "stand", expr: "laugh", blink: blink(i) },
        { mode: "stand", expr: "laugh", blink: blink(i) }));
      blob(out, x, 0, z, 1);
    }
  } else if (id === 11) {
    // S11 office: officer fingerprints Frank at the desk; Frank nervous.
    const o = who(40, GUARD);
    out.places.push(person(cam, o, -40, 0, 3.2, faceCam(cam, -40, 3.2),
      { mode: "stand", expr: "stern", blink: blink(40), look: -1 },
      { mode: "stand", expr: "stern", blink: blink(40) }));
    blob(out, -40, 0, 3.2, 1);
    const w = who(41, FRANK);
    out.places.push(person(cam, w, -40, 0, 2.4, faceCam(cam, -40, 2.4),
      { mode: "stand", expr: "nervous", blink: blink(41), look: 1 },
      { mode: "stand", expr: "nervous", blink: blink(41) }));
    blob(out, -40, 0, 2.4, 1);
  } else if (id === 12) {
    // S12 office: the match — officer shocked at the wanted poster, Frank dazed.
    // (Camera is over-the-officer's-shoulder: officer at (-39.6, 0, 3.4) with back to
    // camera, right foreground; Frank at (-37.4, 0, 4.4), left of the poster, not on it.)
    const o = who(42, GUARD);
    const v = viewOf(cam, -39.6, 3.4, 0, 1);
    out.places.push(person(cam, o, -39.6, 0, 3.4, v,
      { mode: "stand", expr: "shock", blink: blink(42) },
      { mode: "stand", expr: "shock", blink: blink(42) }));
    blob(out, -39.6, 0, 3.4, 1);
    const w = who(43, FRANK);
    out.places.push(person(cam, w, -37.4, 0, 4.4, faceCam(cam, -37.4, 4.4),
      { mode: "stand", expr: "dazed", blink: blink(43) },
      { mode: "stand", expr: "dazed", blink: blink(43) }));
    blob(out, -37.4, 0, 4.4, 1);
  } else if (id === 13) {
    // S13 street: the bail crowd — five townsfolk cheering, Frank among them, relieved.
    // Shifted +0.5 in x — the leftmost figure was cut off at the frame edge before.
    const spots: [number, number, number, Expr][] = [
      [-1.5, 1.2, 44, "laugh"], [-0.3, 2.0, 45, "laugh"], [1.0, 1.5, 46, "relief"], [2.3, 2.2, 47, "laugh"], [3.3, 1.2, 48, "grin"],
    ];
    for (const [x, z, i, e] of spots) {
      const w = who(i, i === 46 ? FRANK : townsfolk(i));
      out.places.push(person(cam, w, x, 0, z, faceCam(cam, x, z),
        { mode: "stand", expr: e, blink: blink(i) },
        { mode: "stand", expr: e, blink: blink(i) }));
      blob(out, x, 0, z, 1);
    }
  }
  // id === 14: object-only final shot — no characters, just the wooden gun on the desk.
  return out;
};
