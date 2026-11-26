// Moon Trees Short — per-SHOT character staging (10 shots, 5 sets).
// Uses the skill's cast.ts: person() (2D toon card, 3.5 head-heights, plum ink, expression
// library, blinks), blob() (tight contact shadow + sun-direction tail), lidAt() (blinks).
// World.update() calls stageSet(setId, t, cam) per frame; the shot is derived from t,
// so the same set stages different characters per shot (office = Mission Control in S2/S4,
// the newspaper hunt in S9). Characters change expression 0-3 frames BEFORE their word
// (LEAD), never mid-word. Roosa is one consistent outfit (white jacket + white cap) in
// every era — costume = identity.
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
// Stuart Roosa — white jacket, dark pants, white cap. Same outfit in every era (identity).
const ROOSA: Who["o"] = { jacket: "#e8e6df", pants: "#3b3f52", boots: "#4a3426", hat: "cap", cap: "#e8e6df" };
// Mission Control flight controller — navy, cap.
const CONTROLLER: Who["o"] = { jacket: "#2f3a5c", pants: "#2f3a5c", boots: "#1f1b24", hat: "cap", cap: "#2f3a5c" };
// Forest Service scientist — green jacket, cap.
const SCIENTIST: Who["o"] = { jacket: "#4f6b4a", pants: "#3b3f52", boots: "#4a3426", hat: "cap", cap: "#4f6b4a" };

export const stageSet = (setId: number, t: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [] };
  const f = Math.round(t * FPS);
  const shot = shotAt(f);
  const lt = t - shot.a / FPS; // seconds inside this shot
  const blink = (i: number) => lidAt(t, i);
  const id = shot.id;

  if (id === 1) {
    // S1 workshop: Roosa behind the bench, stern, looking down at the canister;
    // a scientist watches, nervous. (The canister itself is a 3D mesh on the bench.)
    const w = who(1, ROOSA);
    out.places.push(person(cam, w, 0, 0, -66.8, faceCam(cam, 0, -66.8),
      { mode: "stand", expr: "stern", blink: blink(1), prop: ["hammer", 0.6] },
      { mode: "stand", expr: "stern", blink: blink(1) }));
    blob(out, 0, 0, -66.8, 1);
    const g = who(2, SCIENTIST);
    out.places.push(person(cam, g, -0.53, 0, -66.2, faceCam(cam, -0.53, -66.2),
      { mode: "stand", expr: "nervous", blink: blink(2), look: -1 },
      { mode: "stand", expr: "nervous", blink: blink(2) }));
    blob(out, -0.53, 0, -66.2, 1);
  } else if (id === 2) {
    // S2 office: Roosa at the console, nervous grin; controller stern beside him.
    const w = who(3, ROOSA);
    out.places.push(person(cam, w, -40, 0, 2.4, faceCam(cam, -40, 2.4),
      { mode: "stand", expr: "grin", blink: blink(3), look: 1 },
      { mode: "stand", expr: "grin", blink: blink(3) }));
    blob(out, -40, 0, 2.4, 1);
    const c = who(4, CONTROLLER);
    out.places.push(person(cam, c, -40, 0, 3.2, faceCam(cam, -40, 3.2),
      { mode: "stand", expr: "stern", blink: blink(4), look: -1 },
      { mode: "stand", expr: "stern", blink: blink(4) }));
    blob(out, -40, 0, 3.2, 1);
  } else if (id === 3) {
    // S3 workshop: Roosa holds the canister up, grinning — the firefighter's souvenir.
    const w = who(5, ROOSA);
    out.places.push(person(cam, w, 0, 0, -66.8, faceCam(cam, 0, -66.8),
      { mode: "stand", expr: "grin", blink: blink(5) },
      { mode: "stand", expr: "grin", blink: blink(5) }));
    blob(out, 0, 0, -66.8, 1);
    const g = who(6, SCIENTIST);
    out.places.push(person(cam, g, 2.6, 0, -66.2, faceCam(cam, 2.6, -66.2),
      { mode: "stand", expr: "neutral", blink: blink(6), look: -1 },
      { mode: "stand", expr: "neutral", blink: blink(6) }));
    blob(out, 2.6, 0, -66.2, 1);
  } else if (id === 4) {
    // S4 office: the controller, shocked, points at the Moon poster; Roosa grins.
    const c = who(7, CONTROLLER);
    out.places.push(person(cam, c, -39.6, 0, 3.4, viewOf(cam, -39.6, 3.4, 0, 1),
      { mode: "stand", expr: "shock", blink: blink(7) },
      { mode: "stand", expr: "shock", blink: blink(7) }));
    blob(out, -39.6, 0, 3.4, 1);
    const w = who(8, ROOSA);
    out.places.push(person(cam, w, -40, 0, 2.4, faceCam(cam, -40, 2.4),
      { mode: "stand", expr: "grin", blink: blink(8), look: 1 },
      { mode: "stand", expr: "grin", blink: blink(8) }));
    blob(out, -40, 0, 2.4, 1);
    if (lt > 1 && lt < 1.6) {
      // V2 fix: the shock-stars were at y 3.0 — ~1.5 m ABOVE the controller's head,
      // floating at the top of the wall, detached — they read as a glitch/artifact.
      // Now they circle just above his head (head top ~1.7 m), smaller, so the
      // cartoon "shocked" effect reads as attached to the character.
      const ph = Math.min(1, (lt - 1) / 0.6);
      out.fx.push({ key: `stars|${Math.round(ph * 10)}`, cw: 256, ch: 256, draw: (p) => fxStars(p, ph), x: -39.6, y: 1.95, z: 3.4, w: 0.65, h: 0.65 });
    }
  } else if (id === 5) {
    // S5 workshop: splashdown — Roosa and the scientist, dazed, lean over the spilled seeds.
    const w = who(9, ROOSA);
    out.places.push(person(cam, w, 0, 0, -66.8, faceCam(cam, 0, -66.8),
      { mode: "stand", expr: "dazed", blink: blink(9) },
      { mode: "stand", expr: "dazed", blink: blink(9) }));
    blob(out, 0, 0, -66.8, 1);
    const g = who(10, SCIENTIST);
    out.places.push(person(cam, g, 0.38, 0, -66.5, faceCam(cam, 0.38, -66.5),
      { mode: "stand", expr: "shock", blink: blink(10), look: -1 },
      { mode: "stand", expr: "shock", blink: blink(10) }));
    blob(out, 0.38, 0, -66.5, 1);
    // seed-spill burst over the bench — ONCE, at the splashdown moment (lt < 0.5 s)
    if (lt < 0.5) {
      const ph = lt / 0.5;
      out.fx.push({ key: `burst|${Math.round(ph * 10)}`, cw: 256, ch: 256, draw: (p) => fxBurst(p, ph), x: -0.1, y: 1.1, z: -67.9, w: 0.8, h: 0.8 });
    }
  } else if (id === 6) {
    // S6 nursery: the scientist walks the seedling rows watering them; Roosa grins by the trays.
    const g = who(11, SCIENTIST);
    const wx = 0.5, wz = 139.5 - lt * 0.35;
    out.places.push(person(cam, g, wx, 0, wz, viewOf(cam, wx, wz, 0, -1),
      { mode: "stroll", phase: lt * 0.9, expr: "grin", blink: blink(11) },
      { mode: "march", phase: lt * 0.9, expr: "grin", blink: blink(11), stride: 0.4 }));
    blob(out, wx, 0, wz, 1);
    const w = who(12, ROOSA);
    out.places.push(person(cam, w, 1.6, 0, 140.2, faceCam(cam, 1.6, 140.2),
      { mode: "stand", expr: "grin", blink: blink(12), look: -1 },
      { mode: "stand", expr: "grin", blink: blink(12) }));
    blob(out, 1.6, 0, 140.2, 1);
  } else if (id === 7) {
    // S7 street: the planting ceremony — Roosa + two townsfolk around the sapling, grinning.
    const w = who(13, ROOSA);
    out.places.push(person(cam, w, 0.5, 0, 1.5, faceCam(cam, 0.5, 1.5),
      { mode: "stand", expr: "grin", blink: blink(13) },
      { mode: "stand", expr: "grin", blink: blink(13) }));
    blob(out, 0.5, 0, 1.5, 1);
    for (const [x, z, i] of [[-0.7, 2.2, 14], [1.8, 2.3, 15]] as [number, number, number][]) {
      const t2 = who(i, townsfolk(i));
      out.places.push(person(cam, t2, x, 0, z, faceCam(cam, x, z),
        { mode: "stand", expr: "laugh", blink: blink(i) },
        { mode: "stand", expr: "laugh", blink: blink(i) }));
      blob(out, x, 0, z, 1);
    }
  } else if (id === 8) {
    // S8 park: Roosa + two visitors under the big pine, looking up, relieved smiles.
    const w = who(16, ROOSA);
    out.places.push(person(cam, w, 0.5, 0, 71.5, faceCam(cam, 0.5, 71.5),
      { mode: "stand", expr: "relief", blink: blink(16) },
      { mode: "stand", expr: "relief", blink: blink(16) }));
    blob(out, 0.5, 0, 71.5, 1);
    for (const [x, z, i] of [[-1.2, 72.4, 17], [2.4, 72.2, 18]] as [number, number, number][]) {
      const t2 = who(i, townsfolk(i));
      out.places.push(person(cam, t2, x, 0, z, faceCam(cam, x, z),
        { mode: "stand", expr: "grin", blink: blink(i) },
        { mode: "stand", expr: "grin", blink: blink(i) }));
      blob(out, x, 0, z, 1);
    }
  } else if (id === 9) {
    // S9 office: the hunt — the scientist at the desk, stern, reading the clippings;
    // the schoolteacher beside him, nervous.
    const g = who(19, SCIENTIST);
    out.places.push(person(cam, g, -40, 0, 2.4, faceCam(cam, -40, 2.4),
      { mode: "stand", expr: "stern", blink: blink(19), look: 1 },
      { mode: "stand", expr: "stern", blink: blink(19) }));
    blob(out, -40, 0, 2.4, 1);
    const t2 = who(20, townsfolk(3));
    out.places.push(person(cam, t2, -40, 0, 3.2, faceCam(cam, -40, 3.2),
      { mode: "stand", expr: "nervous", blink: blink(20), look: -1 },
      { mode: "stand", expr: "nervous", blink: blink(20) }));
    blob(out, -40, 0, 3.2, 1);
  } else if (id === 10) {
    // S10 street (golden): Roosa by the seedling, grinning at the camera; a kid laughs beside him.
    const w = who(21, ROOSA);
    out.places.push(person(cam, w, 0.5, 0, 1.5, faceCam(cam, 0.5, 1.5),
      { mode: "stand", expr: "grin", blink: blink(21) },
      { mode: "stand", expr: "grin", blink: blink(21) }));
    blob(out, 0.5, 0, 1.5, 1);
    const t2 = who(22, townsfolk(5));
    out.places.push(person(cam, t2, 1.9, 0, 2.2, faceCam(cam, 1.9, 2.2),
      { mode: "stand", expr: "laugh", blink: blink(22) },
      { mode: "stand", expr: "laugh", blink: blink(22) }));
    blob(out, 1.9, 0, 2.2, 1);
  }
  return out;
};
