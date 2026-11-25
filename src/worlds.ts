// The template world: 5 reusable 3D mini-sets in code (street / room / office / exterior /
// workshop), built from the skill's infrastructure — painted Canvas2D textures (paint.ts),
// two-tone sun (shade.ts), light presets (lights.ts), Batch merging + Kenney props (build.ts),
// toon character cards (cast.ts/stage.ts). A new video reuses 4-5 of these with different
// props/lighting — never one set for a whole video.
//
// REALISM RULES (from the formula §f): texture on every surface (brick/cobble/wood/marble),
// directional light + shadows, contact shadows under characters/props, foreground/midground/
// background depth, 5-10 props per scene. No flat single-colour wall, no black void.
// CAPTION RULE: cameras (story.ts) frame subjects above 80% of frame height; the bottom
// 12% band is floor only.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { staticFile } from "remotion";
import { Batch, Strand, boxGeo, V, lam, prop, kitClone, house, setSight, Ray, Kit } from "./bridge/build";
import { beam, ctex, planksHD, beamHD, stoneHD, cobbleHD, grassHD, cloudHD, brick } from "./bridge/paint";
import { LIGHTS, LOOK, LightPreset } from "./bridge/lights";
import { TONE, CHAR, twoTone, untone } from "./bridge/shade";
import { NOINK } from "./bridge/ink";
import { Pool, Actor, Fx, setCastLight } from "./bridge/cast";
import { FPS, SHOTS, SET_NAME, camAt, FOREGROUND, ShotDef } from "./story";
import { stageSet } from "./stage";
import { numberCard } from "./numbers";

// ---------------- Kenney props ----------------
// The 26 names loadKit() looks for under public/bridge/kenney/<name>.glb.
// 15 come from the Kenney Nature Kit (CC0, downloaded 25 Nov 2026):
//   tree_oak, tree_default, tree_detailed, tree_fat, tree_cone, plant_bushLarge,
//   plant_bushDetailed, plant_bush, flower_redA, flower_yellowA, flower_purpleA,
//   grass_large, grass, lily_large, canoe.
// 5 are drawn in code by build.ts itself (never files): tree-high-round, tree, hedge,
//   banner-red, banner-green (cartoon vegetation / painted cloth).
// 6 are NOT in the Nature Kit (they live in other Kenney packs) — code-built fallbacks
//   below, in the same painted style: lantern, cart, stall-red, stall-green, stall-bench,
//   windmill. loadKit() never fails on a missing file (per-file catch, like the skill).
const KENNEY = ["tree_oak", "tree_default", "tree_detailed", "tree_fat", "tree_cone", "tree-high-round", "tree", "plant_bushLarge", "plant_bushDetailed",
  "plant_bush", "hedge", "flower_redA", "flower_yellowA", "flower_purpleA", "grass_large", "grass", "lily_large", "lantern", "cart", "stall-red",
  "stall-green", "stall-bench", "banner-red", "banner-green", "windmill", "canoe"];
const FALLBACKS = ["lantern", "cart", "stall-red", "stall-green", "stall-bench", "windmill"];

/** code-built stand-ins for the 6 Kenney props that are not in the Nature Kit pack */
const buildFallback = (name: string): THREE.Object3D => {
  const g = new THREE.Group();
  const wood = lam("fbWood", () => ({ map: beam() }));
  const woodDark = lam("fbWoodDark", () => ({ color: "#6e4b33" }));
  const iron = lam("fbIron", () => ({ color: "#3d414c" }));
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, ry = 0) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.y = ry;
    m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
  };
  if (name === "lantern") {
    add(new THREE.BoxGeometry(0.07, 0.5, 0.07), woodDark, 0, 0.25, 0);
    // iron frame as 4 corner bars + top/bottom plates so the warm glass shows through
    for (const [sx, sz] of [[-0.085, -0.085], [0.085, -0.085], [-0.085, 0.085], [0.085, 0.085]] as const)
      add(new THREE.BoxGeometry(0.03, 0.24, 0.03), iron, sx, 0.62, sz);
    add(new THREE.BoxGeometry(0.2, 0.03, 0.2), iron, 0, 0.75, 0);
    add(new THREE.BoxGeometry(0.2, 0.03, 0.2), iron, 0, 0.49, 0);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.18, 0.15),
      new THREE.MeshBasicMaterial({ color: "#ffd27a" }));
    glass.position.set(0, 0.62, 0); g.add(glass);
    add(new THREE.ConeGeometry(0.16, 0.12, 4), iron, 0, 0.8, 0, Math.PI / 4);
  } else if (name === "cart") {
    add(new THREE.BoxGeometry(1.7, 0.12, 0.95), wood, 0, 0.62, 0);
    add(new THREE.BoxGeometry(1.7, 0.28, 0.06), wood, 0, 0.8, 0.45);
    add(new THREE.BoxGeometry(1.7, 0.28, 0.06), wood, 0, 0.8, -0.45);
    for (const s of [-1, 1]) {
      const w = add(new THREE.CylinderGeometry(0.36, 0.36, 0.08, 14), woodDark, 0, 0.36, s * 0.5);
      w.rotation.x = Math.PI / 2;
      add(new THREE.BoxGeometry(0.06, 0.06, 0.7), woodDark, s * 0.95, 0.75, 0);
    }
    add(new THREE.BoxGeometry(0.5, 0.4, 0.6), lam("fbCrate", () => ({ color: "#b5653f" })), -0.4, 0.88, 0);
  } else if (name.startsWith("stall")) {
    const isBench = name === "stall-bench";
    const awnCol = name === "stall-red" ? "#b8553a" : name === "stall-green" ? "#4f8a5a" : "#8a6a4a";
    if (!isBench) {
      add(new THREE.BoxGeometry(1.9, 0.12, 0.8), wood, 0, 0.85, 0);
      for (const [sx, sz] of [[-0.85, -0.32], [0.85, -0.32], [-0.85, 0.32], [0.85, 0.32]] as const)
        add(new THREE.BoxGeometry(0.09, 0.85, 0.09), woodDark, sx, 0.42, sz);
      for (const s of [-1, 1]) add(new THREE.CylinderGeometry(0.04, 0.04, 2.3, 8), woodDark, s * 0.95, 1.15, -0.35);
      const awn = add(new THREE.BoxGeometry(2.2, 0.05, 1.3), lam("fbAwn" + awnCol, () => ({ color: awnCol })), 0, 2.25, 0.1);
      awn.rotation.x = -0.18;
      add(new THREE.BoxGeometry(0.45, 0.35, 0.45), lam("fbCrate2", () => ({ color: "#c9a24e" })), -0.5, 1.08, 0);
      add(new THREE.BoxGeometry(0.4, 0.3, 0.4), lam("fbCrate3", () => ({ color: "#7a9a4a" })), 0.4, 1.06, 0.1);
    } else {
      add(new THREE.BoxGeometry(1.7, 0.1, 0.5), wood, 0, 0.45, 0);
      for (const s of [-1, 1]) add(new THREE.BoxGeometry(0.1, 0.45, 0.45), woodDark, s * 0.7, 0.22, 0);
      add(new THREE.BoxGeometry(0.4, 0.25, 0.3), iron, -0.5, 0.62, 0);
      add(new THREE.BoxGeometry(0.3, 0.2, 0.25), lam("fbTool", () => ({ color: "#c9a24e" })), 0.45, 0.6, 0);
    }
  } else if (name === "windmill") {
    const tower = add(new THREE.CylinderGeometry(0.85, 1.25, 4.6, 10), lam("fbMill", () => ({ map: stoneHD("fbMill", ["#d8cbb2", "#cdbfa6", "#e0d4c0", "#c4b49a"], "#a08b74") })), 0, 2.3, 0);
    void tower;
    add(new THREE.ConeGeometry(1.05, 1.2, 10), lam("fbMillRoof", () => ({ color: "#b8644f" })), 0, 5.2, 0);
    const hub = new THREE.Group(); hub.position.set(0, 4.6, 1.15); g.add(hub);
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.4, 0.05), lam("fbBlade", () => ({ color: "#efe3c8" })));
      blade.position.y = 1.35; blade.castShadow = true;
      const arm = new THREE.Group(); arm.rotation.z = (i * Math.PI) / 2; arm.add(blade); hub.add(arm);
    }
    add(new THREE.SphereGeometry(0.16, 10, 8), iron, 0, 4.6, 1.15);
  }
  return g;
};

let kitP: Promise<Kit> | null = null;
export const loadKit = () => {
  if (!kitP) {
    const loader = new GLTFLoader();
    kitP = Promise.all(KENNEY.map((n) => loader.loadAsync(staticFile(`bridge/kenney/${n}.glb`)).then((g) => [n, g.scene] as const).catch(() => [n, null] as const)))
      .then((list) => {
        const kit = Object.fromEntries(list.filter((e) => e[1]).map(([n, s]) => [n, s!])) as Kit;
        for (const n of FALLBACKS) if (!kit[n]) kit[n] = buildFallback(n);
        return kit;
      });
  }
  return kitP;
};

// ---------------- small helpers ----------------
/** horizontal quad facing up at height dy covering x0..x1, z0..z1 */
const quadUp = (x0: number, x1: number, z0: number, z1: number, u: number, v: number, dy = 0) => {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute([x0, dy, z1, x1, dy, z1, x1, dy, z0, x0, dy, z1, x1, dy, z0, x0, dy, z0], 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, u, 0, u, v, 0, 0, u, v, 0, v], 2));
  return g;
};
const V3 = (x: number, y: number, z: number): [number, number, number] => [x, y, z];
/** horizontal quad facing DOWN at height dy covering x0..x1, z0..z1 (a ceiling).
 *  NOTE: do NOT build a ceiling with quadUp + rotation.x = PI — the mesh sits at the
 *  origin, so the rotation flips the quad to y = -dy (under the floor) and the room
 *  renders open-topped with sky above the walls. */
const quadDown = (x0: number, x1: number, z0: number, z1: number, u: number, v: number, dy = 0) => {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute([x0, dy, z1, x1, dy, z0, x1, dy, z1, x0, dy, z1, x0, dy, z0, x1, dy, z0], 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute([0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0], 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, u, 0, u, v, 0, 0, u, v, 0, v], 2));
  return g;
};

const discTex = () => ctex("sunDisc", 128, 128, (g) => {
  const gr = g.createRadialGradient(64, 64, 58, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
});
const haloTex = () => ctex("sunHalo", 256, 256, (g) => {
  const im = g.createImageData(256, 256);
  for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
    const u = Math.hypot(x - 127.5, y - 127.5) / 128;
    const a = (0.55 * Math.exp(-((u / 0.25) ** 2)) + 0.35 * Math.exp(-((u / 0.6) ** 2))) * (1 - Math.min(1, Math.max(0, (u - 0.8) / 0.2)));
    const i = (y * 256 + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = 255; im.data[i + 3] = Math.round(255 * Math.min(1, a));
  }
  g.putImageData(im, 0, 0);
});

/** every lens position of the template looking at its subject (skill's sight-line discipline:
 *  houses/props that block any camera ray are culled by prop()/house() via setSight).
 *  NOTE: ray directions are NORMALISED (unit length), so t = len ends exactly at the look
 *  point. The skill's original "unit forward component" d overshoots by (|d|-1)*len
 *  (~1% for the +-0.6 edge rays) and culls houses whose cull box starts just past the
 *  look point — that is what deleted the exterior building (its box starts 0.9 m past
 *  the S4a look point). */
const sightLines = (): Ray[] => {
  const out: Ray[] = [];
  for (const s of SHOTS) for (let f = s.a - 8; f < s.b + 8; f += 2) {
    const c = camAt(s.id, Math.max(0, f)), o = V(...c.pos), look = V(...c.look);
    const fw = look.clone().sub(o), len = fw.length();
    fw.normalize();
    const rt = fw.clone().cross(V(0, 1, 0)).normalize(), up = rt.clone().cross(fw);
    const ty = Math.tan((c.fov * Math.PI) / 360), tx = ty * (9 / 16);
    for (const [sx, sy] of [[0, 0], [-0.6, 0], [0.6, 0], [0, 0.6], [0, -0.4]])
      out.push({ o, d: fw.clone().addScaledVector(rt, sx * tx).addScaledVector(up, sy * ty).normalize(), len, core: sx === 0 && sy === 0 });
  }
  return out;
};

// ---------------- the 5 sets ----------------
// Each builder fills one Batch (one merged mesh per material) + a few standalone meshes
// (ceilings, windows, number cards). Ground y = 0 everywhere; sets are offset in world
// space by their origin (see story.ts SET_AT) — builders work in world coords directly.

const wallMat = (key: string, cols: string[], mortar: string) => lam(key, () => ({ map: stoneHD(key, cols, mortar) }));

/** 1 — street (day): cobble street, two gabled houses, stall, cart, lantern, trees */
const buildStreet = (b: Batch, kit: Kit) => {
  b.add(quadUp(-8, 8, -10, 8, 8, 9), lam("streetCobble", () => ({ map: cobbleHD() })));
  house(b, -4.5, 6.5, Math.PI, 7, 8, 7, 0);
  house(b, 4.5, 6.5, Math.PI, 8, 8, 8.4, 2);
  // side walls close the set (brick, not flat colour)
  const bw = lam("streetBrick", () => ({ map: brick() }));
  b.add(boxGeo(V(-8.2, 0, -10), V(-7.8, 4.2, 8), 2), bw);
  b.add(boxGeo(V(7.8, 0, -10), V(8.2, 4.2, 8), 2), bw);
  prop(b, kit, "tree_oak", -6.2, 0, 4.2, 4.5, 0.4);
  prop(b, kit, "tree_default", 6.4, 0, 3.0, 3.6, 2.1);
  prop(b, kit, "stall-red", -4.0, 0, 2.5, 2.2, 0.3);
  prop(b, kit, "cart", -5.6, 0, -3.2, 1.1, -0.6);
  prop(b, kit, "lantern", 3.4, 0, -1.0, 0.9, 0);
  prop(b, kit, "plant_bush", 6.8, 0, -5.5, 1.0, 0.8);
  prop(b, kit, "hedge", -7.0, 0, 6.0, 1.1, 0);
  for (const [x, z] of [[-2.8, 5.6], [2.2, 5.8], [5.9, 5.2]] as const) prop(b, kit, "flower_redA", x, 0, z, 0.45, 0);
  prop(b, kit, "flower_yellowA", 1.2, 0, 5.7, 0.45, 0);
  prop(b, kit, "grass", -6.8, 0, -6.5, 0.5, 0);
  prop(b, kit, "grass_large", 6.9, 0, -7.5, 0.6, 0);
};

/** 2 — interior room (day): wood floor, rug, table + lantern, sofa, bookshelf, painting, window */
const buildRoom = (b: Batch, kit: Kit, root: THREE.Group) => {
  b.add(quadUp(34, 46, -6, 6, 6, 6), lam("roomFloor", () => ({ map: planksHD() })));
  const wall = wallMat("roomWall", ["#e6d3ae", "#dfcda8", "#ead9b8", "#d8c49c"], "#b39a78");
  const W = 3.4; // wall height
  b.add(boxGeo(V(34, 0, 5.5), V(46, W, 5.9), 2), wall);                    // back wall
  b.add(boxGeo(V(34, 0, -6), V(34.4, W, 6), 2), wall);                     // left wall (window wall)
  b.add(boxGeo(V(45.6, 0, -6), V(46, W, 6), 2), wall);                     // right wall
  // rug (painted border + diamonds)
  const rug = ctex("rug", 512, 384, (g) => {
    g.fillStyle = "#8c3b4a"; g.fillRect(0, 0, 512, 384);
    g.strokeStyle = "#d1aa5c"; g.lineWidth = 14; g.strokeRect(18, 18, 476, 348);
    g.strokeStyle = "rgba(209,170,92,0.7)"; g.lineWidth = 4; g.strokeRect(44, 44, 424, 296);
    g.fillStyle = "#d1aa5c";
    for (const [x, y] of [[256, 110], [256, 274], [140, 192], [372, 192]] as const) {
      g.beginPath(); g.moveTo(x, y - 26); g.lineTo(x + 20, y); g.lineTo(x, y + 26); g.lineTo(x - 20, y); g.closePath(); g.fill();
    }
  });
  b.add(quadUp(38.2, 43.2, -1.2, 2.8, 1, 1, 0.012), lam("rug", () => ({ map: rug })));
  // table + books + lantern
  const wood = lam("roomWood", () => ({ map: beamHD() }));
  b.add(boxGeo(V(38.2, 0.72, 2.1), V(39.8, 0.8, 2.9), 1), wood);
  for (const [x, z] of [[38.35, 2.25], [39.65, 2.25], [38.35, 2.75], [39.65, 2.75]] as const)
    b.add(boxGeo(V(x, 0, z), V(x + 0.09, 0.72, z + 0.09), 0), wood);
  b.add(boxGeo(V(38.5, 0.8, 2.3), V(39.1, 0.9, 2.6), 0), lam("roomBook1", () => ({ color: "#3f6fb5" })));
  b.add(boxGeo(V(38.5, 0.9, 2.3), V(39.0, 0.98, 2.55), 0), lam("roomBook2", () => ({ color: "#c25a3a" })));
  // sofa (muted blue) against the back wall
  const sofa = lam("roomSofa", () => ({ color: "#4a6a8a" }));
  b.add(boxGeo(V(43.2, 0.25, 4.4), V(45.2, 0.65, 5.3), 1), sofa);
  b.add(boxGeo(V(43.2, 0.65, 5.0), V(45.2, 1.25, 5.3), 1), sofa);
  b.add(boxGeo(V(43.2, 0.65, 4.4), V(43.5, 1.0, 5.0), 1), sofa);
  b.add(boxGeo(V(44.9, 0.65, 4.4), V(45.2, 1.0, 5.0), 1), sofa);
  // bookshelf on the right wall: frame + shelves + coloured spines
  const shelf = lam("roomShelf", () => ({ color: "#6e4b33" }));
  b.add(boxGeo(V(45.1, 0, 0.2), V(45.5, 2.6, 2.2), 1), shelf);
  const spineCols = ["#c25a3a", "#3f6fb5", "#5d7a3a", "#b5653f", "#8c3b4a", "#d1aa5c"];
  for (let s = 0; s < 3; s++) for (let i = 0; i < 6; i++)
    b.add(boxGeo(V(45.15, 0.5 + s * 0.7, 0.35 + i * 0.28), V(45.45, 1.05 + s * 0.7, 0.55 + i * 0.28), 0),
      lam(`spine${s}${i}`, () => ({ color: spineCols[(s * 6 + i) % 6] })));
  // painting on the back wall: original abstract (dark boat + purple bars + orange circles)
  const painting = ctex("demoPainting", 512, 640, (g) => {
    g.fillStyle = "#efe6d0"; g.fillRect(0, 0, 512, 640);
    g.fillStyle = "#2e3a5c"; g.beginPath(); g.moveTo(90, 420); g.lineTo(422, 420); g.lineTo(380, 300); g.lineTo(150, 300); g.closePath(); g.fill();
    g.fillStyle = "#7b5ac9"; for (const x of [70, 150, 230, 310, 390]) g.fillRect(x, 90, 46, 150);
    g.fillStyle = "#e07b39"; g.beginPath(); g.arc(150, 500, 52, 0, 7); g.fill(); g.beginPath(); g.arc(360, 510, 40, 0, 7); g.fill();
    g.fillStyle = "#3f8a5a"; g.beginPath(); g.moveTo(256, 470); g.lineTo(310, 560); g.lineTo(202, 560); g.closePath(); g.fill();
  });
  const frame = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.9),
    new THREE.MeshLambertMaterial({ map: painting }));
  frame.position.set(38.6, 1.9, 5.48); frame.rotation.y = Math.PI; root.add(frame);
  const frameEdge = new THREE.Mesh(new THREE.BoxGeometry(1.62, 2.02, 0.06), lam("roomFrame", () => ({ color: "#4a3426" })));
  frameEdge.position.set(38.6, 1.9, 5.52); root.add(frameEdge);
  // window on the left wall: bright sky quad + cross bars (unlit = reads as daylight)
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.9), new THREE.MeshBasicMaterial({ color: "#cfe4ff" }));
  win.position.set(34.42, 1.9, -2.0); win.rotation.y = Math.PI / 2; root.add(win);
  const bar = lam("roomWinBar", () => ({ color: "#efe3c8" }));
  b.add(boxGeo(V(34.35, 0.95, -2.85), V(34.5, 2.85, -2.75), 0), bar);
  b.add(boxGeo(V(34.35, 1.88, -2.05), V(34.5, 2.02, -1.15), 0), bar);
  b.add(boxGeo(V(34.35, 1.88, -2.85), V(34.5, 2.02, -1.95), 0), bar);
  // ceiling: UNLIT warm cream (MeshBasicMaterial). A lit ceiling faces down, away from
  // the low sun, so the two-tone shade term turns it dark blue-purple (it read as a
  // night sky). Unlit it stays a ceiling in any light (the skill's sign lesson).
  const ceil = new THREE.Mesh(quadDown(34, 46, -6, 6, 1, 1, W),
    new THREE.MeshBasicMaterial({ color: "#efe6d0" }));
  ceil.castShadow = false; ceil.receiveShadow = true; root.add(ceil);
  prop(b, kit, "lantern", 39.0, 0.8, 2.5, 0.42, 0.5);
  prop(b, kit, "plant_bush", 45.0, 0, -5.0, 0.9, 0.3);
};

/** 3 — office (day): marble floor, desk + glowing laptop, columns, window wall, clock */
const buildOffice = (b: Batch, kit: Kit, root: THREE.Group) => {
  b.add(quadUp(-46, -34, -6, 6, 6, 6), lam("officeFloor", () => ({ map: stoneHD("officeFloor", ["#e8e2d5", "#ddd6c6", "#efe9db", "#d5cdbb"], "#b5ab96") })));
  const wall = wallMat("officeWall", ["#dfe3e8", "#d5d9de", "#e8ebee", "#cfd4d9"], "#a8adb4");
  const W = 3.4;
  b.add(boxGeo(V(-46, 0, 5.5), V(-34, W, 5.9), 2), wall);
  b.add(boxGeo(V(-46, 0, -6), V(-45.6, W, 6), 2), wall);
  b.add(boxGeo(V(-34.4, 0, -6), V(-34, W, 6), 2), wall);
  // desk + laptop (glowing screen) + papers + mug
  const desk = lam("officeDesk", () => ({ map: beamHD() }));
  b.add(boxGeo(V(-41.1, 0.74, 1.5), V(-38.9, 0.82, 2.5), 1), desk);
  for (const [x, z] of [[-41.0, 1.6], [-39.0, 1.6], [-41.0, 2.4], [-39.0, 2.4]] as const)
    b.add(boxGeo(V(x, 0, z), V(x + 0.09, 0.74, z + 0.09), 0), desk);
  b.add(boxGeo(V(-40.35, 0.82, 1.95), V(-39.65, 0.88, 2.25), 0), lam("officeLap", () => ({ color: "#3a4150" })));
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.5), new THREE.MeshBasicMaterial({ color: "#bfe3ff" }));
  screen.position.set(-40, 1.18, 2.28); screen.rotation.x = -0.25; root.add(screen);
  b.add(boxGeo(V(-38.9, 0.82, 2.2), V(-38.6, 0.85, 2.45), 0), lam("officePaper", () => ({ color: "#f7f5ee" })));
  b.add(new THREE.CylinderGeometry(0.05, 0.045, 0.12, 10).translate(0, 0.06, 0), lam("officeMug", () => ({ color: "#c25a3a" })),
    new THREE.Matrix4().makeTranslation(-41.0, 0.82, 2.35));
  // chair behind the desk
  b.add(boxGeo(V(-40.4, 0.45, 3.3), V(-39.6, 0.52, 3.9), 1), lam("officeChair", () => ({ color: "#3b3f52" })));
  b.add(boxGeo(V(-40.4, 0.52, 3.85), V(-39.6, 1.15, 3.95), 1), lam("officeChair", () => ({ color: "#3b3f52" })));
  // columns (stone, fluted look via texture)
  const col = lam("officeCol", () => ({ map: stoneHD("officeCol", ["#e6e0d2", "#ddd5c4", "#efe8da", "#d2c9b6"], "#b0a58e") }));
  for (const x of [-45, -35]) b.add(new THREE.CylinderGeometry(0.35, 0.4, 3.4, 14).translate(0, 1.7, 0), col,
    new THREE.Matrix4().makeTranslation(x, 0, -2));
  // window wall (back): three bright window quads with frames
  for (const x of [-43.5, -40, -36.5]) {
    const wq = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), new THREE.MeshBasicMaterial({ color: "#d6e9ff" }));
    wq.position.set(x, 1.9, 5.48); wq.rotation.y = Math.PI; root.add(wq);
  }
  const winBar = lam("officeWinBar", () => ({ color: "#efe3c8" }));
  for (const x of [-44.65, -42.35, -41.15, -38.85, -37.65, -35.35])
    b.add(boxGeo(V(x, 0.8, 5.45), V(x + 0.1, 3.0, 5.55), 0), winBar);
  b.add(boxGeo(V(-44.7, 1.85, 5.45), V(-35.3, 1.95, 5.55), 0), winBar);
  // wall clock
  const clock = ctex("clockFace", 256, 256, (g) => {
    g.fillStyle = "#f7f1e1"; g.strokeStyle = "#221f2e"; g.lineWidth = 12;
    g.beginPath(); g.arc(128, 128, 112, 0, 7); g.fill(); g.stroke(); g.lineCap = "round";
    for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; g.lineWidth = 8; g.beginPath(); g.moveTo(128 + 80 * Math.cos(a), 128 + 80 * Math.sin(a)); g.lineTo(128 + 96 * Math.cos(a), 128 + 96 * Math.sin(a)); g.stroke(); }
    g.lineWidth = 12; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 62); g.stroke();
    g.lineWidth = 9; g.beginPath(); g.moveTo(128, 128); g.lineTo(178, 150); g.stroke();
  });
  const clockM = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), new THREE.MeshLambertMaterial({ map: clock }));
  clockM.position.set(-36.2, 2.6, 5.48); clockM.rotation.y = Math.PI; root.add(clockM);
  const ceil = new THREE.Mesh(quadDown(-46, -34, -6, 6, 1, 1, W), new THREE.MeshBasicMaterial({ color: "#efe6d0" }));
  ceil.castShadow = false; ceil.receiveShadow = true; root.add(ceil);
  prop(b, kit, "plant_bush", -44.6, 0, 4.4, 1.0, 0.6);
  prop(b, kit, "flower_purpleA", -35.2, 0, 4.6, 0.45, 0);
};

/** 4 — exterior building (golden): lawn, big facade, steps, path, trees, hedges */
const buildExterior = (b: Batch, kit: Kit) => {
  b.add(quadUp(-12, 12, 56, 84, 12, 14), lam("extGrass", () => ({ map: grassHD() })));
  b.add(quadUp(-2, 2, 60, 72.5, 2, 6), lam("extPath", () => ({ map: cobbleHD() })));
  house(b, 0, 78, Math.PI, 12, 8, 7, 1);
  // steps: three stone treads down from the door to the path. They end at z = 74.0,
  // just IN FRONT of the house front wall (z = 74) — the tourist stands on the top
  // tread at z 73.5. (An earlier build ran the treads to z 74.9, inside the wall, so
  // the wall occluded the tourist entirely.)
  const step = lam("extStep", () => ({ map: stoneHD("extStep", ["#d8d0bf", "#cfc5b2", "#e2dacb", "#c4b9a5"], "#a89c85") }));
  b.add(boxGeo(V(-3, 0.5, 73.0), V(3, 0.75, 74.0), 1), step);
  b.add(boxGeo(V(-3, 0.25, 72.3), V(3, 0.5, 74.0), 1), step);
  b.add(boxGeo(V(-3, 0, 71.6), V(3, 0.25, 74.0), 1), step);
  prop(b, kit, "tree_oak", -7.5, 0, 73, 5.0, 0.7);
  prop(b, kit, "tree_fat", 7.5, 0, 74, 4.2, 2.4);
  prop(b, kit, "hedge", -5.5, 0, 71, 1.0, 0);
  prop(b, kit, "hedge", 5.5, 0, 71, 1.0, 0);
  prop(b, kit, "flower_redA", -3.6, 0, 72.8, 0.45, 0);
  prop(b, kit, "flower_yellowA", 3.6, 0, 72.8, 0.45, 0);
  prop(b, kit, "grass_large", -9, 0, 66, 0.6, 0);
  prop(b, kit, "grass", 9, 0, 65, 0.5, 0);
};

/** 5 — workshop (golden): wood floor, brick walls, bench + tools, shelves, cart, crates */
const buildWorkshop = (b: Batch, kit: Kit, root: THREE.Group) => {
  b.add(quadUp(-7, 7, -77, -63, 7, 7), lam("shopFloor", () => ({ map: planksHD() })));
  const bw = lam("shopBrick", () => ({ map: brick() }));
  const W = 3.4;
  b.add(boxGeo(V(-7, 0, -63.9), V(7, W, -63.5), 2), bw);
  b.add(boxGeo(V(-7.4, 0, -77), V(-7, W, -63), 2), bw);
  b.add(boxGeo(V(7, 0, -77), V(7.4, W, -63), 2), bw);
  // workbench (stall-bench fallback) + tools on top: hammer + saw
  prop(b, kit, "stall-bench", 0, 0, -68, 0.95, 0);
  b.add(boxGeo(V(0.35, 0.95, -67.9), V(0.75, 1.02, -67.7), 0), lam("shopHammerHead", () => ({ color: "#3d414c" })));
  b.add(boxGeo(V(0.5, 0.95, -68.15), V(0.6, 1.3, -68.05), 0), lam("shopHammerHandle", () => ({ color: "#8a5a3c" })));
  b.add(boxGeo(V(-0.7, 0.95, -67.85), V(-0.1, 0.99, -67.75), 0), lam("shopSaw", () => ({ color: "#b8bcc4" })));
  // shelves on the back wall with jars + boxes
  const shelf = lam("shopShelf", () => ({ color: "#6e4b33" }));
  for (const y of [1.8, 2.4]) b.add(boxGeo(V(-5.5, y, -63.6), V(-1.5, y + 0.08, -63.3), 1), shelf);
  const jarCols = ["#7a9a4a", "#c9a24e", "#3f6fb5", "#c25a3a"];
  for (let i = 0; i < 4; i++) {
    b.add(new THREE.CylinderGeometry(0.14, 0.14, 0.3, 10).translate(0, 0.15, 0), lam(`shopJar${i}`, () => ({ color: jarCols[i] })),
      new THREE.Matrix4().makeTranslation(-5 + i * 1.1, 1.88, -63.45));
    b.add(boxGeo(V(-4.9 + i * 1.1, 2.48, -63.55), V(-4.5 + i * 1.1, 2.78, -63.35), 0), lam(`shopBox${i}`, () => ({ color: jarCols[(i + 2) % 4] })));
  }
  // hanging tools on the side wall (small dark shapes with warm handles)
  for (let i = 0; i < 3; i++)
    b.add(boxGeo(V(7.05, 1.6 + i * 0.45, -70 + i * 0.8), V(7.2, 2.0 + i * 0.45, -69.7 + i * 0.8), 0),
      lam(`shopHang${i}`, () => ({ color: i % 2 ? "#8a5a3c" : "#3d414c" })));
  prop(b, kit, "cart", -4.6, 0, -66, 1.1, 0.5);
  prop(b, kit, "lantern", 0.8, 0.95, -68, 0.42, 0);
  prop(b, kit, "windmill", 5.6, 0, -64.8, 2.6, 0.4); // small decorative mill on a crate by the wall
  b.add(boxGeo(V(4.2, 0, -65.5), V(5.0, 0.55, -64.7), 1), lam("shopCrate", () => ({ color: "#b5653f" })));
  b.add(boxGeo(V(4.3, 0.55, -65.4), V(4.9, 0.95, -64.8), 1), lam("shopCrate2", () => ({ color: "#8a6a4a" })));
  const ceil = new THREE.Mesh(quadDown(-7, 7, -77, -63, 1, 1, W), new THREE.MeshBasicMaterial({ color: "#e8d9bd" }));
  ceil.castShadow = false; ceil.receiveShadow = true; root.add(ceil);
};

// ---------------- the World ----------------
export class World {
  root = new THREE.Group();
  private pool = new Pool();
  private actors: Actor[] = [];
  private fxs: Fx[] = [];
  private hemi: THREE.HemisphereLight; private sun: THREE.DirectionalLight;
  private sky: THREE.Mesh; private skyMat: THREE.ShaderMaterial;
  private fog = new THREE.Fog("#bccbec", 25, 420);
  private sunDisc: THREE.Sprite; private sunHalo: THREE.Sprite;
  private sunCache = new Map<number, THREE.Vector3>();
  private cloudMaps: Record<"day" | "golden", THREE.Texture[]>;
  private clouds: THREE.Mesh[] = [];
  private sets: THREE.Group[] = [];
  private numbers: { mesh: THREE.Mesh; set: number; pos: [number, number, number]; a: number; b: number }[] = [];
  private fgs: { o: THREE.Object3D; a: number; b: number }[] = [];
  private frustum = new THREE.Frustum();
  private m4 = new THREE.Matrix4(); private v = new THREE.Vector3(); private sph = new THREE.Sphere();
  /** hemi boost per set (interiors read dark under a roof — lift the ambient, keep the sun).
   *  Workshop is 2.2: the golden shade term is blue-heavy, and a backlit interior goes
   *  purple without a strong warm ambient lift. */
  private hemiBoost: Record<number, number> = { 1: 1, 2: 1.6, 3: 1.6, 4: 1, 5: 2.6 };

  constructor(kit: Kit) {
    const R = this.root;
    setSight(sightLines());
    // ---- sky + light ----
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: { c0: { value: new THREE.Color() }, c1: { value: new THREE.Color() }, c2: { value: new THREE.Color() },
        c3: { value: new THREE.Color() }, c4: { value: new THREE.Color() }, e: { value: new THREE.Vector4() } },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 c0, c1, c2, c3, c4; uniform vec4 e; varying vec3 vP;
        void main(){ float el = asin(clamp(normalize(vP).y, -1.0, 1.0));
          vec3 c = mix(c0, c1, smoothstep(0.0, e.x, el));
          c = mix(c, c2, smoothstep(e.x, e.y, el));
          c = mix(c, c3, smoothstep(e.y, e.z, el));
          c = mix(c, c4, smoothstep(e.z, e.w, el));
          gl_FragColor = vec4(c, 1.0); }`,
      side: THREE.BackSide, depthWrite: false, fog: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(1100, 48, 24), this.skyMat);
    this.sky.renderOrder = -1; this.sky.frustumCulled = false; this.sky.layers.set(NOINK);
    R.add(this.sky);
    this.sunDisc = new THREE.Sprite(new THREE.SpriteMaterial({ map: discTex(), color: new THREE.Color(6.0, 4.4, 2.4), fog: false, depthWrite: false }));
    this.sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex(), color: new THREE.Color(1, 1, 1), fog: false, depthWrite: false, depthTest: true,
      transparent: true, blending: THREE.AdditiveBlending }));
    this.sunDisc.renderOrder = -0.5; this.sunHalo.renderOrder = 5;
    for (const m of [this.sunDisc, this.sunHalo]) { m.frustumCulled = false; m.layers.set(NOINK); R.add(m); }
    this.hemi = new THREE.HemisphereLight("#cfe6ff", "#6c5c8c", 1.1);
    this.sun = new THREE.DirectionalLight("#fff0d6", 2.6);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(4096, 4096);
    R.add(this.hemi, this.sun, this.sun.target);
    this.cloudMaps = { day: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.day.cloud)), golden: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.golden.cloud)) };
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.3, d = 620 + (i % 3) * 60;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.cloudMaps.day[i % 4], color: new THREE.Color(1.1, 1.1, 1.1), transparent: true, depthWrite: false, fog: false }));
      const w = 130 + (i % 4) * 30;
      m.position.set(Math.cos(a) * d, 120 + (i % 4) * 38, Math.sin(a) * d); m.scale.set(w, w / 2, 1);
      m.layers.set(NOINK);
      this.clouds.push(m); R.add(m);
    }
    // ---- the 5 sets ----
    const builders = [buildStreet, (b: Batch, k: Kit) => buildRoom(b, k, R), (b: Batch, k: Kit) => buildOffice(b, k, R), buildExterior, (b: Batch, k: Kit) => buildWorkshop(b, k, R)];
    for (let i = 0; i < 5; i++) {
      const grp = new THREE.Group();
      const b = new Batch();
      builders[i](b, kit);
      b.build(grp);
      grp.visible = i === 0;
      this.sets.push(grp); R.add(grp);
    }
    // ---- in-scene numbers (demo values — per-video code replaces text + set) ----
    // Placed where the WIDE camera sees them centred (frame range = the wide only:
    // a giant number over the medium/close-up collides with the character).
    // S1a looks down +z (screen-right = -x), so the street number sits near x = 0.5.
    // n1 floats IN FRONT of the house fronts (z=1.9): at z=2.0 the pink house
    // occluded the card's left edge ("1,") at the dolly start (f0). z=1.6 puts
    // it 0.3 m in front of every facade, so it is never clipped.
    const n1 = numberCard("1,000", "COINS", "gold", 1);
    n1.position.set(0.9, 2.8, 1.6); this.numbers.push({ mesh: n1, set: 1, pos: [0.9, 2.8, 1.6], a: 0, b: 60 }); R.add(n1);
    const n3 = numberCard("$300", "FINE", "white", 0.9);
    n3.position.set(-38.6, 2.5, 1.0); this.numbers.push({ mesh: n3, set: 3, pos: [-38.6, 2.5, 1.0], a: 360, b: 450 }); R.add(n3);
    for (const n of this.numbers) n.mesh.visible = false;
    // ---- foreground framing objects (kit clones, toggled per frame like the skill) ----
    for (const fg of FOREGROUND) {
      const o = kitClone(kit, fg.kit, fg.s ?? 1);
      if (!o) continue;
      o.position.set(...fg.pos); o.rotation.y = fg.yaw ?? 0; o.visible = false;
      this.fgs.push({ o, a: fg.a, b: fg.b }); R.add(o);
    }
  }

  /** camera-relative sun, frozen per shot (skill's shotSun) */
  private shotSun(id: number, s: ShotDef, L: LightPreset) {
    let v = this.sunCache.get(id);
    if (v) return v;
    let fx = 0, fz = 0;
    for (let f = s.a; f < s.b; f += 3) {
      const c = camAt(id, f), x = c.look[0] - c.pos[0], z = c.look[2] - c.pos[2], n = Math.hypot(x, z) || 1;
      fx += x / n; fz += z / n;
    }
    const n = Math.hypot(fx, fz) || 1; fx /= n; fz /= n;
    const az = THREE.MathUtils.degToRad(L.az), el = THREE.MathUtils.degToRad(L.el);
    const hx = fx * Math.cos(az) - fz * Math.sin(az), hz = fz * Math.cos(az) + fx * Math.sin(az);
    v = new THREE.Vector3(hx * Math.cos(el), Math.sin(el), hz * Math.cos(el)).normalize();
    this.sunCache.set(id, v);
    return v;
  }

  private actor(i: number) { while (this.actors.length <= i) this.actors.push(new Actor(this.root)); return this.actors[i]; }
  private fx(i: number) { while (this.fxs.length <= i) this.fxs.push(new Fx(this.root)); return this.fxs[i]; }

  update(id: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene) {
    const t = f / FPS, s = SHOTS[id - 1], L = LIGHTS[s.light];
    setCastLight(s.light);
    const c = camAt(id, f);
    cam.position.set(...c.pos); cam.up.set(0, 1, 0); cam.lookAt(...c.look); cam.rotateZ(c.roll);
    cam.fov = c.fov; cam.near = 0.2; cam.far = 1500; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    const focus = V(...c.look), dist = cam.position.distanceTo(focus);
    cam.layers.enable(NOINK);
    // ---- light rig: camera-relative sun frozen per shot, two-tone uniforms, shadow fit ----
    const K = LOOK[s.light], sunDir = this.shotSun(id, s, s.az !== undefined ? { ...L, az: s.az } : L);
    this.hemi.color.set(L.sky); this.hemi.groundColor.set(L.ground);
    this.hemi.intensity = L.hemiI * (this.hemiBoost[s.set] ?? 1);
    this.sun.color.set(L.sunCol); this.sun.intensity = L.sunI;
    let Rr = THREE.MathUtils.clamp(dist * 1.15 + 7, 12, 95);
    if (s.light === "golden") Rr = Math.max(Rr, 30);
    this.sun.position.copy(focus).addScaledVector(sunDir, 220); this.sun.target.position.copy(focus);
    const sc = this.sun.shadow.camera;
    sc.left = -Rr; sc.right = Rr; sc.top = Rr; sc.bottom = -Rr; sc.near = 20; sc.far = 480; sc.updateProjectionMatrix();
    this.sun.shadow.bias = L.bias; this.sun.shadow.normalBias = L.normalBias * (Rr / 12);
    TONE.uLitCol.value.set(...L.lit); TONE.uShadeCol.value.set(...L.shade); TONE.uShadeLift.value.set(...L.lift);
    TONE.uLambert.value = L.lambert; TONE.uSideK.value = L.sideK; TONE.uTerm.value = L.term; TONE.uBounce.value.set(...LOOK[s.light].bounce); TONE.uSat.value = LOOK[s.light].sat;
    CHAR.uCharTint.value.set(...L.charTint); CHAR.uCharShade.value = L.charShade; CHAR.uGrad.value = L.charGrad;
    CHAR.uBodyGrad.value = L.bodyGrad; CHAR.uSideTint.value.set(...L.sideTint);
    // ---- sky, fog, sun disc + halo, clouds ----
    const su = this.skyMat.uniforms;
    K.sky.c.forEach((h, i) => untone(h, su["c" + i].value));
    const e = K.sky.e.map((deg) => THREE.MathUtils.degToRad(deg));
    su.e.value.set(e[1], e[2], e[3], e[4]);
    this.sky.position.copy(cam.position);
    untone(L.fog, this.fog.color); this.fog.near = L.fogNear; this.fog.far = L.fogFar;
    scene.fog = this.fog; scene.background = null;
    // sun disc + halo only when the sun is in front of the camera (az < 90): with a
    // per-shot az override the disc would otherwise sit behind the lens
    const showSun = s.light === "golden" && Math.abs(s.az ?? L.az) < 90;
    this.sunDisc.visible = this.sunHalo.visible = showSun;
    if (showSun) {
      this.sunDisc.position.copy(cam.position).addScaledVector(sunDir, 900);
      this.sunDisc.scale.setScalar(2 * 900 * Math.tan(THREE.MathUtils.degToRad(1.7)));
      this.sunHalo.position.copy(this.sunDisc.position); this.sunHalo.scale.setScalar(2 * 900 * Math.tan(THREE.MathUtils.degToRad(24)));
      (this.sunHalo.material as THREE.SpriteMaterial).color.set(L.sunDisc).multiplyScalar(1.3);
    }
    for (let i = 0; i < this.clouds.length; i++) {
      const m = this.clouds[i], mat = m.material as THREE.MeshBasicMaterial;
      m.lookAt(cam.position.x, m.position.y, cam.position.z);
      mat.map = this.cloudMaps[s.light][i % 4];
    }
    // ---- sets, numbers, foreground ----
    this.sets.forEach((g, i) => { g.visible = i === s.set - 1; });
    for (const n of this.numbers) {
      n.mesh.visible = n.set === s.set && f >= n.a && f < n.b;
      if (n.mesh.visible) n.mesh.quaternion.copy(cam.quaternion);
    }
    for (const g of this.fgs) g.o.visible = f >= g.a && f < g.b && g.a < s.b && g.b > s.a;
    // ---- cast + effects ----
    const right = V(0, 0, 0).setFromMatrixColumn(cam.matrixWorld, 0);
    const st = stageSet(s.set, t, { pos: cam.position, right });
    this.frustum.setFromProjectionMatrix(this.m4.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
    const tint = s.light === "golden" ? "#ffcf9e" : "#ffffff";
    let ai = 0;
    const used: Actor[] = [];
    for (const p of st.places) {
      const sc2 = p.scale ?? 1;
      if (p.geo !== "swing" && !this.frustum.intersectsSphere(this.sph.set(this.v.set(p.x, p.y + 1.1 * sc2, p.z), 3.5))) continue;
      const a = this.actor(ai++);
      const [w, h, k] = p.size ?? [300, 500, 0.5];
      a.r = this.pool.req(p.key, w, h, k, p.draw);
      a.mesh.visible = true;
      a.mesh.position.set(p.x, p.y, p.z);
      a.mesh.rotation.set(0, p.yaw ?? Math.atan2(cam.position.x - p.x, cam.position.z - p.z), p.roll ?? 0);
      a.mesh.scale.set(p.mirror ? -sc2 : sc2, sc2, sc2);
      if (a.mat.emissiveMap) a.mat.emissive.set(tint);
      a.mesh.castShadow = L.actorShadow;
      used.push(a);
    }
    for (let i = ai; i < this.actors.length; i++) this.actors[i].mesh.visible = false;
    let fi = 0;
    const fused: Fx[] = [];
    for (const p of st.fx) {
      if (!this.frustum.intersectsSphere(this.sph.set(this.v.set(p.x, p.y, p.z), Math.max(p.w, p.h)))) continue;
      const e = this.fx(fi++);
      e.r = this.pool.req(p.key, p.cw, p.ch, 1, p.draw);
      e.use(!!p.soft);
      e.mesh.visible = true;
      e.mesh.position.set(p.x, p.y, p.z);
      if (p.flat) e.mesh.rotation.set(-Math.PI / 2, 0, p.rot ?? 0);
      else { e.mesh.quaternion.copy(cam.quaternion); e.mesh.rotateZ(p.rot ?? 0); }
      e.mesh.scale.set(p.w, p.h, 1);
      fused.push(e);
    }
    for (let i = fi; i < this.fxs.length; i++) this.fxs[i].mesh.visible = false;
    this.pool.flush();
    for (const a of used) a.bind();
    for (const e of fused) e.bind();
    return focus;
  }
}
