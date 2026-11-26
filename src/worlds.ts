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
import { FPS, SHOTS, SET_NAME, camAt, FOREGROUND, ShotDef, clamp01, easeOutBack } from "./story";
import { stageSet } from "./stage";
import { numberCard, numberTexture } from "./numbers";

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
    add(new THREE.BoxGeometry(0.2, 0.24, 0.2), iron, 0, 0.62, 0);
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.16, 0.14),
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
      // clean empty workbench — tools are placed on it by the scene builder
      // (the old iron/gold boxes cluttered the top and hid the hero gun).
      add(new THREE.BoxGeometry(1.7, 0.1, 0.5), wood, 0, 0.45, 0);
      for (const s of [-1, 1]) add(new THREE.BoxGeometry(0.1, 0.45, 0.45), woodDark, s * 0.7, 0.22, 0);
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
 *  houses/props that block any camera ray are culled by prop()/house() via setSight) */
const sightLines = (): Ray[] => {
  const out: Ray[] = [];
  for (const s of SHOTS) for (let f = s.a - 8; f < s.b + 8; f += 2) {
    const c = camAt(s.id, Math.max(0, f)), o = V(...c.pos), look = V(...c.look);
    const fw = look.clone().sub(o), len = fw.length();
    fw.normalize();
    const rt = fw.clone().cross(V(0, 1, 0)).normalize(), up = rt.clone().cross(fw);
    const ty = Math.tan((c.fov * Math.PI) / 360), tx = ty * (9 / 16);
    for (const [sx, sy] of [[0, 0], [-0.6, 0], [0.6, 0], [0, 0.6], [0, -0.4]])
      out.push({ o, d: fw.clone().addScaledVector(rt, sx * tx).addScaledVector(up, sy * ty), len, core: sx === 0 && sy === 0 });
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
  // the Philadelphia sapling (S7 planting ceremony) — CODE-BUILT, ~0.9 m, beside Roosa.
  const sapTrunk = lam("streetSapTrunk", () => ({ color: "#6e4b33" }));
  b.add(new THREE.CylinderGeometry(0.05, 0.07, 0.4, 8).translate(0, 0.2, 0), sapTrunk,
    new THREE.Matrix4().makeTranslation(1.3, 0, 1.0));
  const sapGreen = lam("streetSap", () => ({ color: "#5d7a3a" }));
  b.add(new THREE.ConeGeometry(0.38, 0.55, 10).translate(0, 0.62, 0), sapGreen,
    new THREE.Matrix4().makeTranslation(1.3, 0, 1.0));
  b.add(new THREE.ConeGeometry(0.26, 0.45, 10).translate(0, 0.95, 0), sapGreen,
    new THREE.Matrix4().makeTranslation(1.3, 0, 1.0));
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
const buildRoom = (b: Batch, kit: Kit, root: THREE.Group, grp: THREE.Group) => {
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
  // ceiling (own mesh: castShadow false so the sun still lights the room through it)
  const ceil = new THREE.Mesh(quadUp(34, 46, -6, 6, 1, 1, W),
    lam("roomCeil", () => ({ color: "#efe6d0" })));
  ceil.rotation.x = Math.PI; ceil.castShadow = false; ceil.receiveShadow = true; root.add(ceil);
  prop(b, kit, "lantern", 38.45, 0.8, 2.8, 0.42, 0.5);
  prop(b, kit, "plant_bush", 45.0, 0, -5.0, 0.9, 0.3);
  // a potted seedling on the desk (front-right corner, clear of the books and lantern).
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.14, 10), lam("roomPot", () => ({ color: "#b5653f" })));
  pot.position.set(39.55, 0.93, 2.75); pot.castShadow = true; grp.add(pot);
  const sprout = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 8), lam("roomSprout", () => ({ color: "#5d7a3a" })));
  sprout.position.set(39.55, 1.14, 2.75); sprout.castShadow = true; grp.add(sprout);
};

/** 3 — office (day): marble floor, desk + glowing laptop, columns, window wall, clock */
const buildOffice = (b: Batch, kit: Kit, root: THREE.Group, grp: THREE.Group) => {
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
  b.add(boxGeo(V(-40.5, 0.82, 1.9), V(-39.5, 0.9, 2.3), 0), lam("officeLap", () => ({ color: "#2c313a" })));
  // laptop screen, tilted back like a real open laptop and LOW: the old upright screen
  // (centre y 1.18, top edge y 1.43) put its ink outline straight across the characters'
  // faces in S2/S4b/S9a, and its pale blue (#bfe3ff) vanished against the window behind it.
  // Now: top edge y ~1.19 (below every chin), deeper blue so it reads as a screen.
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.5), new THREE.MeshBasicMaterial({ color: "#8fc3ee" }));
  screen.position.set(-40, 1.02, 2.3); screen.rotation.x = -0.85; root.add(screen);
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
  const ceil = new THREE.Mesh(quadUp(-46, -34, -6, 6, 1, 1, W), lam("officeCeil", () => ({ color: "#efe6d0" })));
  ceil.rotation.x = Math.PI; ceil.castShadow = false; ceil.receiveShadow = true; root.add(ceil);
  prop(b, kit, "plant_bush", -44.6, 0, 4.4, 1.0, 0.6);
  prop(b, kit, "flower_purpleA", -35.2, 0, 4.6, 0.45, 0);
  // Moon Tree hunt card on the desk (S9 ECU): the scientist's file of clippings.
  const fpCard = ctex("huntCard", 512, 384, (g) => {
    g.fillStyle = "#f7f5ee"; g.fillRect(0, 0, 512, 384);
    g.strokeStyle = "#2c2f38"; g.lineWidth = 6; g.strokeRect(10, 10, 492, 364);
    g.fillStyle = "#2c2f38"; g.font = "900 34px Arial, Helvetica, sans-serif";
    g.textAlign = "center"; g.fillText("MOON TREE HUNT", 256, 52);
    g.fillStyle = "#5a5348"; g.font = "700 26px Arial, Helvetica, sans-serif";
    g.textAlign = "left";
    g.fillText("PHILADELPHIA — 1975", 40, 120);
    g.fillText("WHITE HOUSE PINE", 40, 170);
    g.fillText("BRAZIL • SWITZERLAND", 40, 220);
    g.fillText("EMPEROR OF JAPAN", 40, 270);
    g.fillStyle = "#8c2f2a"; g.font = "900 30px Arial, Helvetica, sans-serif";
    g.textAlign = "center"; g.fillText("NASA  —  1996", 256, 340);
  });
  const fp = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.41),
    new THREE.MeshLambertMaterial({ map: fpCard }));
  // front-right corner of the desk — clear of the laptop base (x -40.5..-39.5, z 1.9..2.3)
  // and the paper (x -38.9..-38.6, z 2.2..2.45).
  // Card reads from the CAMERA's side: rotation.z = PI + 0.15 (text was upside-down before).
  fp.rotation.x = -Math.PI / 2; fp.rotation.z = Math.PI + 0.15; fp.position.set(-39.05, 0.86, 1.9); grp.add(fp);
  // the little Apollo command module on the desk (left end, clear of the laptop)
  const cap = capsule(); cap.position.set(-40.9, 0.82, 1.65); cap.scale.setScalar(0.8); grp.add(cap);
  // Apollo 14 Moon poster on the back wall (S2/S4): the Moon + KITTY HAWK.
  const poster = ctex("moonPoster", 512, 720, (g) => {
    g.fillStyle = "#1d2440"; g.fillRect(0, 0, 512, 720);
    g.strokeStyle = "#c9a24e"; g.lineWidth = 10; g.strokeRect(12, 12, 488, 696);
    // the Moon: pale disc + craters
    g.fillStyle = "#e8e4d8"; g.beginPath(); g.arc(256, 280, 150, 0, 7); g.fill();
    g.fillStyle = "#c9c4b2";
    for (const [x, y, r] of [[200, 230, 26], [300, 300, 34], [240, 350, 20], [320, 220, 16], [270, 270, 12]] as const) {
      g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
    // stars
    g.fillStyle = "#ffffff";
    for (const [x, y] of [[60, 80], [440, 110], [90, 480], [430, 500], [150, 640], [370, 620]] as const) {
      g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill();
    }
    g.fillStyle = "#efe9dc"; g.font = "900 64px Arial, Helvetica, sans-serif";
    g.textAlign = "center"; g.fillText("APOLLO 14", 256, 520);
    g.fillStyle = "#c9a24e"; g.font = "800 34px Arial, Helvetica, sans-serif";
    g.fillText("KITTY HAWK", 256, 580);
    g.fillStyle = "#efe9dc"; g.font = "700 30px Arial, Helvetica, sans-serif";
    g.fillText("34 ORBITS  •  1971", 256, 640);
  });
  const posterM = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.87), new THREE.MeshLambertMaterial({ map: poster }));
  // y 2.5: the window's horizontal bar (y 1.85..1.95) passes below the poster.
  posterM.position.set(-38.25, 2.5, 5.46); posterM.rotation.y = Math.PI; grp.add(posterM);
};

/** 4 — park exterior (day): White House lawn (replaces the prison set).
 *  The canister (this.canisterRef) rolls slightly and the seed pile (this.seedPileRef)
 *  spreads during shot 5 in World.update(). */
let canisterRef: THREE.Group | null = null;
let seedPileRef: THREE.Group | null = null;

/** the hero seed canister: a tiny 6-inch silver cylinder, lying on its side on the bench
 *  (a standing cylinder reads as a circle from the steep ECU angle — lying down it reads
 *  as a canister). Scaled 1.6x so it fills the hook ECU like the gun did in Grigware. */
const seedCanister = (): THREE.Group => {
  const g = new THREE.Group();
  const silver = lam("canSilver", () => ({ color: "#b8bcc4" }));
  const silverDark = lam("canSilverDark", () => ({ color: "#7d818a" }));
  const brass = lam("canBrass", () => ({ color: "#c9a24e" }));
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, rx = 0, rz = 0) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.x = rx; m.rotation.z = rz;
    m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
  };
  const body = add(new THREE.CylinderGeometry(0.075, 0.075, 0.16, 16), silver, 0, 0, 0, 0, Math.PI / 2); // lying: axis along x
  void body;
  add(new THREE.CylinderGeometry(0.078, 0.078, 0.02, 16), silverDark, -0.085, 0, 0, 0, Math.PI / 2); // lid
  add(new THREE.CylinderGeometry(0.078, 0.078, 0.015, 16), brass, 0.085, 0, 0, 0, Math.PI / 2);       // base ring
  add(new THREE.TorusGeometry(0.076, 0.008, 8, 20), silverDark, 0.055, 0, 0, 0, 0).rotation.y = Math.PI / 2; // band near the base end (kept off the SEEDS label plate at x=0)
  // "SEEDS" label: a flat plate on TOP of the canister (faces the steep ECU camera).
  // A wrap-around cylinder label hid half the word around the back of the can.
  const label = ctex("canLabel", 256, 64, (gg) => {
    gg.fillStyle = "#efe9dc"; gg.fillRect(0, 0, 256, 64);
    gg.fillStyle = "#1f222c"; gg.font = "900 34px Arial, Helvetica, sans-serif";
    gg.textAlign = "center"; gg.textBaseline = "middle";
    // 180°: the plate lies flat (rotation.x=-PI/2) and the ECU camera looks from -z,
    // so un-rotated text reads upside-down from that side.
    gg.save(); gg.translate(128, 34); gg.rotate(Math.PI); gg.fillText("SEEDS", 0, 0); gg.restore();
  });
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.032),
    new THREE.MeshLambertMaterial({ map: label }));
  lab.position.set(0, 0.077, 0); lab.rotation.x = -Math.PI / 2; g.add(lab);
  return g;
};

/** a pile of spilled seeds: small brown spheres clustered on the bench */
const seedPile = (): THREE.Group => {
  const g = new THREE.Group();
  // flat dark spill patch under the pellets — the spill must read at a glance
  const spill = new THREE.Mesh(new THREE.CircleGeometry(0.18, 20),
    new THREE.MeshLambertMaterial({ color: "#7a5230" }));
  spill.rotation.x = -Math.PI / 2; spill.position.set(0, -0.01, 0); spill.scale.set(1.2, 1, 1); // local y -0.01: sits above the bench top (0.65), below the pellets — no z-fight
  spill.receiveShadow = true; g.add(spill);
  const seedMat = lam("seedMat", () => ({ color: "#7a5230" }));
  const seedMat2 = lam("seedMat2", () => ({ color: "#5a3d28" }));
  let i = 0;
  for (const [x, z] of [[0, 0], [0.05, 0.02], [-0.04, 0.03], [0.02, -0.04], [-0.03, -0.02], [0.07, -0.01], [-0.06, 0.0], [0.01, 0.05], [0.09, 0.04], [-0.08, -0.04], [0.04, 0.06], [-0.02, -0.06], [0.12, 0.0], [-0.1, 0.03]] as const) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), i % 2 ? seedMat : seedMat2);
    s.scale.set(1, 0.55, 1); s.position.set(x, 0.013, z); s.castShadow = true; g.add(s); i++;
  }
  // a few strays scattered wider
  for (const [x, z] of [[0.2, 0.08], [-0.16, -0.1], [0.15, -0.12], [-0.2, 0.06]] as const) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), seedMat);
    s.scale.set(1, 0.55, 1); s.position.set(x, 0.013, z); s.castShadow = true; g.add(s);
  }
  return g;
};

/** a little Apollo command module (cone + cylinder, silver) for the Mission Control desk */
const capsule = (): THREE.Group => {
  const g = new THREE.Group();
  const silver = lam("capSilver", () => ({ color: "#c8ccd4" }));
  const dark = lam("capDark", () => ({ color: "#3d414c" }));
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
    m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
  };
  add(new THREE.CylinderGeometry(0.09, 0.13, 0.14, 14), silver, 0, 0.07, 0);
  add(new THREE.ConeGeometry(0.09, 0.12, 14), dark, 0, 0.2, 0);
  add(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 8), dark, 0, 0.29, 0);
  const win = new THREE.Mesh(new THREE.CircleGeometry(0.025, 10), new THREE.MeshBasicMaterial({ color: "#bfe3ff" }));
  win.position.set(0, 0.12, 0.115); g.add(win);
  return g;
};

/** 4 — park (day): White House lawn — white columned facade, lawn, path, the big pine.
 *  The Moon Tree pine (tree_oak) stands at (2, 0, 73); Roosa + visitors at z ~71.5-72.4. */
const buildPark = (b: Batch, kit: Kit, root: THREE.Group, grp: THREE.Group) => {
  // lawn ground
  b.add(quadUp(-9, 9, 56, 84, 9, 14), lam("parkLawn", () => ({ map: grassHD() })));
  // gravel path from the camera to the facade
  b.add(quadUp(-1.2, 1.2, 58, 76, 1.2, 9), lam("parkPath", () => ({ map: stoneHD("parkPath", ["#c9bda2", "#bfb296", "#d2c6ac", "#b5a888"], "#8a7f68") })));
  // White House facade: white wall + columns + pediment + windows
  const white = lam("parkWhite", () => ({ map: stoneHD("parkWhite", ["#f2efe8", "#e9e5db", "#f6f3ec", "#e2ddd2"], "#c9c2b2") }));
  const W = 5;
  b.add(boxGeo(V(-7, 0, 76), V(7, W, 76.6), 2), white);
  // pediment (triangular top via a rotated box)
  const ped = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.5, 0.7), lam("parkPed", () => ({ color: "#efe9dc" })));
  ped.position.set(0, 5.3, 76.3); ped.rotation.z = 0; grp.add(ped);
  const pedTop = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 3.8, 1.2, 4), lam("parkPed2", () => ({ color: "#efe9dc" })));
  pedTop.position.set(0, 5.9, 76.3); pedTop.rotation.y = Math.PI / 4; pedTop.scale.set(1, 1, 0.18); grp.add(pedTop);
  // columns (4, fluted look via texture)
  const col = lam("parkCol", () => ({ map: stoneHD("parkCol", ["#f6f3ec", "#efe9dc", "#faf7f0", "#e6e1d4"], "#c9c2b2") }));
  for (const x of [-4.5, -1.5, 1.5, 4.5]) b.add(new THREE.CylinderGeometry(0.32, 0.36, 4.6, 12).translate(0, 2.3, 0), col,
    new THREE.Matrix4().makeTranslation(x, 0, 75.2));
  // portico roof slab over the columns
  b.add(boxGeo(V(-5.6, 4.6, 74.8), V(5.6, 4.85, 76.6), 1), white);
  // dark windows on the facade
  for (const x of [-6, -3, 0, 3, 6]) {
    b.add(boxGeo(V(x - 0.55, 2.2, 75.95), V(x + 0.55, 3.4, 76.05), 0), lam("parkWin", () => ({ color: "#2c3a4a" })));
    b.add(boxGeo(V(x - 0.55, 0.4, 75.95), V(x + 0.55, 1.6, 76.05), 0), lam("parkWin", () => ({ color: "#2c3a4a" })));
  }
  // the front door
  b.add(boxGeo(V(-0.7, 0, 75.95), V(0.7, 2.6, 76.05), 0), lam("parkDoor", () => ({ color: "#3b3f52" })));
  // the Moon Tree pine — CODE-BUILT (Batch geometry is never sight-culled;
  // the Kenney tree_oak prop was culled: S8b's centre ray ends inside its box).
  // Trunk + 3 stacked cones, ~4.5 m tall, at (2, 0, 73).
  const pineTrunk = lam("parkPineTrunk", () => ({ color: "#6e4b33" }));
  b.add(new THREE.CylinderGeometry(0.22, 0.3, 1.4, 10).translate(0, 0.7, 0), pineTrunk,
    new THREE.Matrix4().makeTranslation(2.0, 0, 73.0));
  const pineGreen = lam("parkPine", () => ({ color: "#4f7a3a" }));
  const pineGreen2 = lam("parkPine2", () => ({ color: "#5d7a3a" }));
  for (const [y, r, h, m] of [[1.6, 1.7, 1.8, pineGreen], [2.8, 1.25, 1.6, pineGreen2], [3.9, 0.8, 1.4, pineGreen]] as const) {
    b.add(new THREE.ConeGeometry(r, h, 12).translate(0, y, 0), m,
      new THREE.Matrix4().makeTranslation(2.0, 0, 73.0));
  }
  prop(b, kit, "tree_default", -5.5, 0, 72.0, 4.0, 2.0);
  prop(b, kit, "tree_cone", 6.2, 0, 70.5, 3.4, 0.8);
  prop(b, kit, "tree_fat", -6.8, 0, 66.5, 3.6, 1.2);
  prop(b, kit, "plant_bush", -3.2, 0, 74.6, 1.0, 0.3);
  prop(b, kit, "plant_bush", 4.6, 0, 74.6, 1.0, 0.9);
  prop(b, kit, "flower_redA", -2.2, 0, 70.5, 0.45, 0);
  prop(b, kit, "flower_yellowA", 3.4, 0, 70.8, 0.45, 0);
  prop(b, kit, "flower_purpleA", -4.4, 0, 68.5, 0.45, 0);
  prop(b, kit, "lantern", -2.4, 0, 68.2, 0.9, 0);
  prop(b, kit, "lantern", 2.6, 0, 68.2, 0.9, 0);
  // low iron fence along the front
  const iron = lam("parkIron", () => ({ color: "#2c2f38" }));
  for (let x = -8; x <= 8; x += 0.5) b.add(boxGeo(V(x - 0.03, 0, 58.2), V(x + 0.03, 0.9, 58.3), 0), iron);
  b.add(boxGeo(V(-8, 0.85, 58.2), V(8, 0.95, 58.3), 0), iron);
};

/** 6 — nursery (day): greenhouse + seedling trays + trees (replaces the train yard).
 *  Greenhouse at (0, 0, 143); seedling trays in rows at z 139-141; the scientist
 *  walks the rows watering (stage.ts S6). */
const buildNursery = (b: Batch, kit: Kit, grp: THREE.Group) => {
  b.add(quadUp(-9, 9, 130, 150, 9, 10), lam("nurGround", () => ({ map: grassHD() })));
  b.add(quadUp(-4, 4, 136, 146, 4, 5), lam("nurDirt", () => ({ map: stoneHD("nurDirt", ["#b59a72", "#ab8f66", "#c0a67e", "#a3865e"], "#8a7452") })));
  // greenhouse: timber frame + glass panels (transparent, added as meshes, not Batch)
  const frame = lam("nurFrame", () => ({ color: "#efe9dc" }));
  const glassMat = new THREE.MeshBasicMaterial({ color: "#bfe3ff", transparent: true, opacity: 0.28, side: THREE.DoubleSide });
  const gh = new THREE.Group();
  const post = (x: number, z: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 0.12), frame);
    m.position.set(x, 1.3, z); m.castShadow = true; gh.add(m);
  };
  for (const [x, z] of [[-2.5, 141.5], [2.5, 141.5], [-2.5, 145.5], [2.5, 145.5], [0, 141.5], [0, 145.5]] as const) post(x, z);
  for (const z of [141.5, 145.5]) {
    const beamM = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.12, 0.12), frame);
    beamM.position.set(0, 2.6, z); gh.add(beamM);
  }
  for (const x of [-2.5, 2.5]) {
    const beamM = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 4.2), frame);
    beamM.position.set(x, 2.6, 143.5); gh.add(beamM);
  }
  // glass walls + roof (two sloped panels)
  const wallN = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 2.6), glassMat);
  wallN.position.set(0, 1.3, 141.5); gh.add(wallN);
  const wallS = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 2.6), glassMat);
  wallS.position.set(0, 1.3, 145.5); wallS.rotation.y = Math.PI; gh.add(wallS);
  for (const s of [-1, 1]) {
    const roof = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 2.4), glassMat);
    roof.position.set(0, 3.1, 143.5 + s * 1.05); roof.rotation.x = s * 0.5; gh.add(roof);
  }
  grp.add(gh);
  // seedling trays: wooden boxes + rows of little green seedlings (plant_bush, small)
  const trayWood = lam("nurTray", () => ({ color: "#8a6a4a" }));
  const soil = lam("nurSoil", () => ({ color: "#4a3426" }));
  for (const z of [139.2, 140.2, 141.2]) {
    b.add(boxGeo(V(-1.8, 0.1, z - 0.3), V(1.8, 0.3, z + 0.3), 1), trayWood);
    b.add(boxGeo(V(-1.7, 0.3, z - 0.2), V(1.7, 0.36, z + 0.2), 0), soil);
    for (let x = -1.5; x <= 1.5; x += 0.5) prop(b, kit, "plant_bush", x, 0.36, z, 0.3, 0);
  }
  // "NURSERY" sign on two posts
  const sign = ctex("nurSign", 512, 128, (g) => {
    g.fillStyle = "#6e4b33"; g.fillRect(0, 0, 512, 128);
    g.strokeStyle = "#efe9dc"; g.lineWidth = 6; g.strokeRect(8, 8, 496, 112);
    g.fillStyle = "#efe9dc"; g.font = "900 56px Arial, Helvetica, sans-serif";
    g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("NURSERY", 256, 66);
  });
  const signM = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.35), new THREE.MeshLambertMaterial({ map: sign }));
  signM.position.set(3.8, 1.5, 138.0); signM.rotation.y = 0.3; grp.add(signM);
  for (const x of [3.2, 4.4]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.4, 0.08), frame);
    p.position.set(x, 0.7, 138.0); p.castShadow = true; grp.add(p);
  }
  // crates + barrel + trees around the nursery
  b.add(boxGeo(V(4.2, 0, 143.5), V(5.0, 0.6, 144.3), 1), lam("nurCrate", () => ({ color: "#b5653f" })));
  b.add(boxGeo(V(4.3, 0.6, 143.6), V(4.9, 1.1, 144.2), 1), lam("nurCrate2", () => ({ color: "#8a6a4a" })));
  b.add(new THREE.CylinderGeometry(0.35, 0.35, 0.9, 12).translate(0, 0.45, 0), lam("nurBarrel", () => ({ color: "#6e4b33" })),
    new THREE.Matrix4().makeTranslation(5.6, 0, 142.2));
  prop(b, kit, "tree_oak", -6.8, 0, 146.5, 4.2, 0.6);
  prop(b, kit, "tree_default", 7.2, 0, 134.0, 3.6, 2.0);
  prop(b, kit, "plant_bush", 5.6, 0, 132.5, 1.0, 0.8);
  prop(b, kit, "grass_large", -7.5, 0, 133.0, 0.6, 0);
};

/** 5 — workshop (golden): wood floor, brick walls, bench + tools, shelves, cart, crates */
const buildWorkshop = (b: Batch, kit: Kit, root: THREE.Group, grp: THREE.Group) => {
  b.add(quadUp(-7, 7, -77, -63, 7, 7), lam("shopFloor", () => ({ map: planksHD() })));
  const bw = lam("shopBrick", () => ({ map: brick() }));
  const W = 3.4;
  b.add(boxGeo(V(-7, 0, -63.9), V(7, W, -63.5), 2), bw);
  b.add(boxGeo(V(-7.4, 0, -77), V(-7, W, -63), 2), bw);
  b.add(boxGeo(V(7, 0, -77), V(7.4, W, -63), 2), bw);
  // workbench (stall-bench fallback) + tools on top: hammer + saw.
  // Bench top is at y ~0.65: the fallback is scaled by prop h / bbox height
  // (h 0.65 / 0.505 = 1.29, top 0.5 * 1.29). All tools sit ON it, not floating.
  prop(b, kit, "stall-bench", 0, 0, -68, 0.65, 0);
  b.add(boxGeo(V(0.35, 0.65, -67.9), V(0.75, 0.72, -67.7), 0), lam("shopHammerHead", () => ({ color: "#3d414c" })));
  b.add(boxGeo(V(0.5, 0.65, -68.15), V(0.6, 1.0, -68.05), 0), lam("shopHammerHandle", () => ({ color: "#8a5a3c" })));
  b.add(boxGeo(V(-0.7, 0.65, -67.85), V(-0.1, 0.69, -67.75), 0), lam("shopSaw", () => ({ color: "#b8bcc4" })));
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
  prop(b, kit, "lantern", 0.65, 0.65, -68.1, 0.42, 0);
  // the seed canister on the bench (S1 hook ECU) — the whole story in one object.
  // Lying on its side ON the bench top, centre patch, clear of hammer/saw/lantern.
  // Group y = bench top (0.68) + canister radius (0.075 x 1.6 = 0.12) = 0.80.
  const can = seedCanister();
  const canH = new THREE.Group(); canH.add(can);
  canH.position.set(-0.1, 0.80, -67.95); canH.rotation.y = -0.7; canH.scale.setScalar(1.6); grp.add(canH); canisterRef = canH;
  // the spilled seeds (S5): hidden until the burst — World.update grows the pile.
  const pile = seedPile();
  // group raised: bench top is 0.65, disc at ~0.70, pellets at ~0.75 — nothing coplanar, nothing buried
  pile.position.set(-0.2, 0.72, -67.62);
  pile.scale.setScalar(0.01);
  grp.add(pile);
  seedPileRef = pile;
  prop(b, kit, "windmill", 5.6, 0, -64.8, 2.6, 0.4); // small decorative mill on a crate by the wall
  b.add(boxGeo(V(4.2, 0, -65.5), V(5.0, 0.55, -64.7), 1), lam("shopCrate", () => ({ color: "#b5653f" })));
  b.add(boxGeo(V(4.3, 0.55, -65.4), V(4.9, 0.95, -64.8), 1), lam("shopCrate2", () => ({ color: "#8a6a4a" })));
  const ceil = new THREE.Mesh(quadUp(-7, 7, -77, -63, 1, 1, W), lam("shopCeil", () => ({ color: "#e8d9bd" })));
  ceil.rotation.x = Math.PI; ceil.castShadow = false; ceil.receiveShadow = true; root.add(ceil);
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
  private numbers: { mesh: THREE.Mesh; set: number; pos: [number, number, number]; a: number; b: number; steps?: THREE.Texture[] }[] = [];
  private fgs: { o: THREE.Object3D; a: number; b: number }[] = [];
  private frustum = new THREE.Frustum();
  private m4 = new THREE.Matrix4(); private v = new THREE.Vector3(); private sph = new THREE.Sphere();
  /** hemi boost per set (interiors read dark under a roof — lift the ambient, keep the sun) */
  private hemiBoost: Record<number, number> = { 1: 1, 2: 1.6, 3: 1.6, 4: 1, 5: 1.25, 6: 1 };

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
    const builders = [buildStreet, (b: Batch, k: Kit, g: THREE.Group) => buildRoom(b, k, R, g), (b: Batch, k: Kit, g: THREE.Group) => buildOffice(b, k, R, g), (b: Batch, k: Kit, g: THREE.Group) => buildPark(b, k, R, g), (b: Batch, k: Kit, g: THREE.Group) => buildWorkshop(b, k, R, g), (b: Batch, k: Kit, g: THREE.Group) => buildNursery(b, k, g)];
    for (let i = 0; i < 6; i++) {
      const grp = new THREE.Group();
      const b = new Batch();
      builders[i](b, kit, grp);
      b.build(grp);
      grp.visible = i === 0;
      this.sets.push(grp); R.add(grp);
    }
    // ---- in-scene numbers (Moon Trees: the biggest figures as 3D text in the scene) ----
    // LINE ANIMATION: every number pops in (overshoot scale, first ~14 f); the two count-up
    // numbers swap step textures over their first ~18 f (steps pre-built here).
    const mk = (text: string, sub: string | null, style: "gold" | "white" | "green", scale: number,
      set: number, pos: [number, number, number], a: number, b: number, steps?: string[]) => {
      const mesh = numberCard(text, sub, style, scale);
      mesh.position.set(...pos);
      const stepTex = steps?.map((s) => numberTexture(s, sub, style));
      this.numbers.push({ mesh, set, pos, a, b, steps: stepTex });
      R.add(mesh);
    };
    mk("500 SEEDS", null, "gold", 0.7, 5, [0, 2.3, -65.2], 75, 190, ["100 SEEDS", "200 SEEDS", "300 SEEDS", "400 SEEDS", "500 SEEDS"]);
    mk("34 ORBITS", null, "gold", 0.7, 3, [-40.2, 2.7, 4.6], 585, 660);
    mk("420 SEEDLINGS", null, "gold", 0.8, 6, [-0.3, 1.9, 140.8], 930, 1010);
    mk("50 STATES", "1975", "gold", 0.9, 1, [0.5, 2.8, 3.0], 1060, 1140);
    mk("110 FOUND", null, "gold", 0.9, 3, [-40.5, 2.6, 3.6], 1455, 1490);
    mk("1,000 SEEDS", null, "gold", 0.8, 1, [0.8, 2.8, 1.0], 1640, 1700, ["250 SEEDS", "500 SEEDS", "750 SEEDS", "1,000 SEEDS"]); // moved forward (z 1.0) + smaller: at scale 1.0 the S10a dolly push made the "1" clip the left edge by f1670
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
    const K = LOOK[s.light], sunDir = this.shotSun(id, s, L);
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
    const showSun = s.light === "golden";
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
      if (n.mesh.visible) {
        n.mesh.quaternion.copy(cam.quaternion);
        // pop-in: overshoot scale over the first 14 frames of the window
        n.mesh.scale.setScalar(0.5 + 0.5 * easeOutBack((f - n.a) / 14));
        // count-up: swap step textures over the first 18 frames
        if (n.steps) {
          const idx = Math.min(n.steps.length - 1, Math.floor(((f - n.a) / 18) * n.steps.length));
          const mat = n.mesh.material as THREE.MeshBasicMaterial;
          if (mat.map !== n.steps[idx]) { mat.map = n.steps[idx]; mat.needsUpdate = true; }
        }
      }
    }
    // splashdown (shot 5, frames 700-830): the canister rolls and the seed pile spreads
    if (canisterRef || seedPileRef) {
      const s5 = SHOTS[4];
      const k = id === 5 ? clamp01((f - s5.a) / 30) : id > 5 ? 1 : 0;
      if (canisterRef) canisterRef.position.x = -0.1 + k * 0.35;
      if (seedPileRef) seedPileRef.scale.setScalar(0.01 + k * 1.99);
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
