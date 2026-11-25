// Per-set character staging for the template demo (1-2 characters per set).
// Uses the skill's cast.ts: person() (2D toon card, 3.5 head-heights, plum ink, 14-expression
// library, blinks), blob() (tight contact shadow + sun-direction tail), lidAt() (blinks).
// Per-video code replaces the cast list; the API (stageSet) stays.
import * as THREE from "three";
import { CamInfo, Stage, Who, person, blob, lidAt, viewOf } from "./bridge/cast";
import { townsfolk, soldier, KID, Expr, fxStars, fxBurst } from "./bridge/toon";
import { FPS, SHOTS } from "./story";

const who = (i: number, o: Who["o"]): Who => ({ i, o, okey: `${o.jacket}|${o.pants}|${o.hat ?? ""}|${o.build ?? "adult"}` });

/** front view toward the camera: walk/facing direction = character -> camera */
const faceCam = (cam: CamInfo, x: number, z: number) => {
  const dx = cam.pos.x - x, dz = cam.pos.z - z, l = Math.hypot(dx, dz) || 1;
  return viewOf(cam, x, z, dx / l, dz / l);
};

export const stageSet = (setId: number, t: number, cam: CamInfo): Stage => {
  const out: Stage = { places: [], fx: [] };
  const lt = t - SHOTS[setId - 1].a / FPS; // seconds inside this shot
  const blink = (i: number) => lidAt(t, i);

  if (setId === 1) {
    // street: a walker strolling down the street (side view) + a kid laughing at the stall
    const wx = -1.2 + lt * 0.35;
    const w = who(1, townsfolk(1));
    const v = viewOf(cam, wx, 1.5, 1, 0.15);
    out.places.push(person(cam, w, wx, 0, 1.5, v,
      { mode: "stroll", phase: lt * 0.9, expr: "grin", blink: blink(1) },
      { mode: "march", phase: lt * 0.9, expr: "grin", blink: blink(1), stride: 0.45 }));
    blob(out, wx, 0, 1.5, 1);
    const k = who(2, KID);
    out.places.push(person(cam, k, -2.6, 0, 3.2, faceCam(cam, -2.6, 3.2),
      { mode: "stand", expr: "laugh", blink: blink(2) },
      { mode: "stand", expr: "laugh", blink: blink(2) }));
    blob(out, -2.6, 0, 3.2, 0.72);
  } else if (setId === 2) {
    // room: one character, shocked at the painting on the wall
    const w = who(3, townsfolk(3));
    out.places.push(person(cam, w, 40.5, 0, 1.0, faceCam(cam, 40.5, 1.0),
      { mode: "stand", expr: "shock", blink: blink(3), look: -1 },
      { mode: "stand", expr: "shock", blink: blink(3) }));
    blob(out, 40.5, 0, 1.0, 1);
  } else if (setId === 3) {
    // office: worker behind the desk — stern while working, grins at the laptop at 3 s in
    const expr: Expr = lt < 3 ? "stern" : "grin";
    const w = who(4, townsfolk(0));
    out.places.push(person(cam, w, -40, 0, 3.2, faceCam(cam, -40, 3.2),
      { mode: "stand", expr, blink: blink(4), look: 1 },
      { mode: "stand", expr, blink: blink(4) }));
    blob(out, -40, 0, 3.2, 1);
  } else if (setId === 4) {
    // exterior: tourist on the steps, laughing; a sparkle pop above his head at 2 s in
    const w = who(5, townsfolk(4));
    out.places.push(person(cam, w, 0.8, 0.75, 73.5, faceCam(cam, 0.8, 73.5),
      { mode: "stand", expr: "laugh", blink: blink(5) },
      { mode: "stand", expr: "laugh", blink: blink(5) }));
    blob(out, 0.8, 0.75, 73.5, 1);
    if (lt > 2 && lt < 2.6) {
      const ph = Math.min(1, (lt - 2) / 0.6);
      out.fx.push({ key: `stars|${Math.round(ph * 10)}`, cw: 256, ch: 256, draw: (p) => fxStars(p, ph), x: 0.8, y: 3.1, z: 73.5, w: 0.9, h: 0.9 });
    }
  } else {
    // workshop: craftsman at the bench, hammer in hand, stern; impact burst every 2 s
    const w = who(6, soldier(2, { jacket: "#6e4b33", pants: "#3b3f52", hat: null, rifle: false }));
    out.places.push(person(cam, w, 0, 0, -66.8, faceCam(cam, 0, -66.8),
      { mode: "stand", expr: "stern", blink: blink(6), prop: ["hammer", 0.6] },
      { mode: "stand", expr: "stern", blink: blink(6) }));
    blob(out, 0, 0, -66.8, 1);
    const cyc = lt % 2;
    if (cyc < 0.5) {
      const ph = cyc / 0.5;
      out.fx.push({ key: `burst|${Math.round(ph * 10)}`, cw: 256, ch: 256, draw: (p) => fxBurst(p, ph), x: 0.45, y: 1.35, z: -67.6, w: 0.8, h: 0.8 });
    }
  }
  return out;
};
