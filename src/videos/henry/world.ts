// Henry Box Brown world: six small sets (workshop, wagon road, boxcar, steamboat deck, crate
// interior, parcel inserts, Philadelphia room) as one three.js scene, posed per frame from the
// story timeline (story.ts). Same look system as the bridge template: two-tone lam() materials,
// painted canvas textures, camera-relative sun frozen per shot, sky shader + fog = horizon colour,
// ink outlines + DOF + grade in the composer (Henry.tsx). Only the current shot's set is visible.
import * as THREE from "three";
import { boxGeo, V, lam, quad } from "./build";
import { ctex, planksHD, beamHD, stoneHD, cobbleHD, grassHD, cloudHD } from "./paint";
import { LIGHTS, LOOK, LightPreset } from "./lights";
import { TONE, CHAR, twoTone, untone } from "./shade";
import { NOINK } from "./ink";
import { Pool, Actor, Fx, stage } from "./cast";
import {
  FPS, SHOTS, camAt, focusAt, V3, smooth, clamp01, wagonX, boxBounce, boxRattle, lidLift, lidTremble, insertsCrateX,
  CRATE, WORKSHOP, TRAIN, BOAT, BOXIN, INSERTS, PHILLY, SetName,
} from "./story";

// ---------------- materials ----------------
type Mats = Record<string, THREE.Material>;
const M: Mats = {};
const mats = () => {
  if (M.floor) return M;
  M.floor = lam("floorPlank", () => ({ map: planksHD() }));
  M.wall = lam("wallPlaster", () => ({ map: stoneHD("wallPlaster", ["#d8cbb2", "#cfc2a8", "#e0d4bc", "#c6b89e"], "#a89a80") }));
  M.wallWarm = lam("wallWarm", () => ({ map: stoneHD("wallWarm", ["#e6d3ae", "#ddc69e", "#ecdab8", "#d3bd93"], "#b3a37f") }));
  M.wood = lam("woodBeam", () => ({ map: beamHD() }));
  M.woodDark = lam("woodDark", () => ({ map: planksHD() }));
  M.stone = lam("stone", () => ({ map: stoneHD() }));
  M.cobble = lam("cobble", () => ({ map: cobbleHD() }));
  M.grass = lam("grass", () => ({ map: grassHD() }));
  M.dirt = lam("dirt", () => ({ color: "#b99a6a" }));
  M.iron = twoTone(new THREE.MeshPhongMaterial({ color: "#3d414c", specular: "#8a8a8a", shininess: 60 }), 0.15);
  M.rug = lam("rug", () => ({ color: "#8c3b4a" }));
  M.hull = lam("hull", () => ({ color: "#2e2a33" }));
  return M;
};
const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, cast = true, recv = true) => {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = recv;
  return m;
};
const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, mat: THREE.Material, tile = 2) =>
  mesh(boxGeo(V(x0, y0, z0), V(x1, y1, z1), tile), mat);

// ---------------- the hero prop: the crate ----------------
const stencilTex = () => ctex("stencil", 512, 256, (g) => {
  g.clearRect(0, 0, 512, 256);
  g.fillStyle = "#2a2018"; g.strokeStyle = "#2a2018";
  g.font = "bold 62px sans-serif"; g.textAlign = "center";
  g.fillText("THIS SIDE UP", 256, 108);
  g.lineWidth = 10; g.lineCap = "round";
  g.beginPath(); g.moveTo(256, 210); g.lineTo(256, 140); g.stroke();
  g.beginPath(); g.moveTo(226, 168); g.lineTo(256, 136); g.lineTo(286, 168); g.stroke();
});
export type Crate = { group: THREE.Group; lid: THREE.Group };
export const makeCrate = (): Crate => {
  const mats2 = mats();
  const g = new THREE.Group();
  const { w, h, d } = CRATE, t = 0.05, hw = w / 2, hh = h / 2, hd = d / 2;
  // open-top box: bottom + 4 walls (origin at the crate centre)
  g.add(box(-hw, -hh, -hd, hw, -hh + 0.06, hd, mats2.floor));
  g.add(box(-hw, -hh, hd - t, hw, hh, hd, mats2.floor)); // front (+z)
  g.add(box(-hw, -hh, -hd, hw, hh, -hd + t, mats2.floor)); // back
  g.add(box(-hw, -hh, -hd, -hw + t, hh, hd, mats2.floor)); // left
  g.add(box(hw - t, -hh, -hd, hw, hh, hd, mats2.floor)); // right
  // stencil on the front face (unlit painted face: stays readable in any light)
  const st = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.31),
    new THREE.MeshBasicMaterial({ map: stencilTex(), transparent: true, color: 0xffffff }));
  st.position.set(0, 0.02, hd + 0.004);
  g.add(st);
  // lid: top board + 2 battens, separate group so it can lean / lift / tremble
  const lid = new THREE.Group();
  lid.add(box(-w / 2 - 0.02, -0.03, -d / 2 - 0.02, w / 2 + 0.02, 0.03, d / 2 + 0.02, mats2.wood));
  lid.add(box(-0.3, 0.03, -d / 2 - 0.02, -0.22, 0.07, d / 2 + 0.02, mats2.woodDark));
  lid.add(box(0.22, 0.03, -d / 2 - 0.02, 0.3, 0.07, d / 2 + 0.02, mats2.woodDark));
  return { group: g, lid };
};

// ---------------- room builder (dollhouse: floor + 3 walls, open front toward the camera) ----------------
const makeRoom = (o: { w: number; d: number; h: number; wall: THREE.Material; winX?: number; winY?: number; glow?: number }): THREE.Group => {
  const g = new THREE.Group();
  const m = mats(), hw = o.w / 2, hd = o.d / 2;
  g.add(box(-hw, -0.1, -hd, hw, 0, hd, m.floor));
  g.add(box(-hw, 0, -hd - 0.15, hw, o.h, -hd, o.wall));
  g.add(box(-hw - 0.15, 0, -hd, -hw, o.h, hd, o.wall));
  g.add(box(hw, 0, -hd, hw + 0.15, o.h, hd, o.wall));
  if (o.winX !== undefined) {
    // glowing window on the back wall + a warm light pool on the floor
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.6),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(2.5, 2.2, 1.7) }));
    glow.position.set(o.winX, o.winY ?? 2.3, -hd + 0.01);
    g.add(glow);
    const bar = new THREE.MeshBasicMaterial({ color: "#3a3230" });
    const b1 = mesh(new THREE.BoxGeometry(1.3, 0.06, 0.03), bar, o.winX, o.winY ?? 2.3, -hd + 0.02, false, false);
    const b2 = mesh(new THREE.BoxGeometry(0.06, 1.6, 0.03), bar, o.winX, o.winY ?? 2.3, -hd + 0.02, false, false);
    g.add(b1, b2);
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 3.2),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(1.4, 1.15, 0.7), transparent: true, opacity: 0.28, depthWrite: false }));
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(o.winX + 0.6, 0.012, -hd + 1.9);
    g.add(pool);
  }
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

export class World {
  root = new THREE.Group();
  private pool = new Pool();
  private actors: Actor[] = [];
  private fxs: Fx[] = [];
  private hemi: THREE.HemisphereLight; private sun: THREE.DirectionalLight; private fill: THREE.DirectionalLight;
  private sky: THREE.Mesh; private skyMat: THREE.ShaderMaterial;
  private fog = new THREE.Fog("#bccbec", 25, 420);
  private sunDisc: THREE.Sprite; private sunHalo: THREE.Sprite;
  private sunCache = new Map<number, THREE.Vector3>();
  private cloudMaps: Record<"day" | "golden" | "night", THREE.Texture[]>;
  private clouds: THREE.Mesh[] = [];
  private sets: Record<SetName, THREE.Group>;
  private workshopCrate: Crate; private wagonCrate: Crate; private trainCrate: Crate; private boatCrate: Crate;
  private insertsCrate: Crate; private phillyCrate: Crate;
  private wagon: THREE.Group; private wheels: THREE.Mesh[] = [];
  private frustum = new THREE.Frustum();
  private m4 = new THREE.Matrix4(); private v = new THREE.Vector3(); private sph = new THREE.Sphere();

  constructor() {
    const R = this.root, M = mats();
    // ---- sky + light ----
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: { c0: { value: new THREE.Color() }, c1: { value: new THREE.Color() }, c2: { value: new THREE.Color() },
        c3: { value: new THREE.Color() }, c4: { value: new THREE.Color() }, e: { value: new THREE.Vector4() } },
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `uniform vec3 c0, c1, c2, c3, c4; uniform vec4 e; varying vec3 vP;
        void main(){ float el = asin(clamp(normalize(vP).y, -1.0, 1.0)) * 57.29578;
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
    this.sun.castShadow = true; // 270p chunked render: shadows ON (measured ~free at 270p: 5.0 vs 4.9 s/f with shadows off)
    this.sun.shadow.mapSize.set(2048, 2048);
    this.fill = new THREE.DirectionalLight("#9fb8ff", 0.35);
    R.add(this.hemi, this.sun, this.sun.target, this.fill, this.fill.target);
    this.cloudMaps = {
      day: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.day.cloud)),
      golden: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.golden.cloud)),
      night: [0, 1, 2, 3].map((k) => cloudHD(k, LOOK.night.cloud)),
    };
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.3, d = 620 + (i % 3) * 60;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.cloudMaps.day[i % 4], color: new THREE.Color(1.1, 1.1, 1.1), transparent: true, depthWrite: false, fog: false }));
      const w = 130 + (i % 4) * 30;
      m.position.set(Math.cos(a) * d, 120 + (i % 4) * 38, Math.sin(a) * d); m.scale.set(w, w / 2, 1);
      m.layers.set(NOINK);
      this.clouds.push(m); R.add(m);
    }

    // ---- sets ----
    this.sets = {
      workshop: this.buildWorkshop(),
      wagon: this.buildWagonSet(),
      train: this.buildTrainSet(),
      boat: this.buildBoatSet(),
      boxin: this.buildBoxinSet(),
      inserts: this.buildInsertsSet(),
      philly: this.buildPhillySet(),
    };
    for (const g of Object.values(this.sets)) { g.visible = false; R.add(g); }
    // keep references to the crates + wagon for per-frame posing
    this.workshopCrate = (this.sets.workshop.userData.crate as Crate);
    this.wagonCrate = (this.sets.wagon.userData.crate as Crate);
    this.trainCrate = (this.sets.train.userData.crate as Crate);
    this.boatCrate = (this.sets.boat.userData.crate as Crate);
    this.insertsCrate = (this.sets.inserts.userData.crate as Crate);
    this.phillyCrate = (this.sets.philly.userData.crate as Crate);
    this.wagon = this.sets.wagon.userData.wagon as THREE.Group;
    this.wheels = this.sets.wagon.userData.wheels as THREE.Mesh[];
  }

  // ---------------- set builders ----------------
  private buildWorkshop(): THREE.Group {
    const g = makeRoom({ w: 10, d: 8, h: 5.5, wall: mats().wall, winX: -2.2, winY: 2.3 });
    const M = mats();
    // workbench along the back wall + a second bench on the right (factory workers, shot 2)
    const bench = (x: number, z: number, w: number) => {
      const b = new THREE.Group();
      b.add(box(-w / 2, 0.86, -0.4, w / 2, 0.98, 0.4, M.wood));
      for (const [lx, lz] of [[-w / 2 + 0.08, -0.32], [w / 2 - 0.08, -0.32], [-w / 2 + 0.08, 0.32], [w / 2 - 0.08, 0.32]] as const)
        b.add(box(lx - 0.05, 0, lz - 0.05, lx + 0.05, 0.86, lz + 0.05, M.woodDark));
      b.position.set(x, 0, z);
      return b;
    };
    g.add(bench(-1.5, -3.2, 2.4));
    g.add(bench(3.2, -2.6, 2.2));
    // tobacco bundles + small boxes on the benches
    for (const [x, y, z, s] of [[-2.2, 1.0, -3.2, 0.28], [-1.2, 1.0, -3.3, 0.24], [2.8, 1.0, -2.6, 0.3], [3.6, 1.0, -2.5, 0.22]] as const)
      g.add(box(x - s / 2, y, z - s / 2, x + s / 2, y + s * 0.7, z + s / 2, M.woodDark));
    // hammer + nails on the bench (foreground prop, shot 1)
    const ham = new THREE.Group();
    ham.add(box(-0.16, 0, -0.02, 0.16, 0.03, 0.02, M.woodDark));
    ham.add(box(0.1, 0, -0.05, 0.18, 0.07, 0.05, M.iron));
    ham.position.set(-1.0, 1.0, -3.05); ham.rotation.y = 0.5;
    g.add(ham);
    // barrel + stool + shelves
    const barrel = mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.9, 12), M.wood, 3.9, 0.45, -2.9);
    g.add(barrel);
    const stool = mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.5, 10), M.woodDark, -0.6, 0.25, -2.3);
    g.add(stool);
    g.add(box(-3.4, 2.2, -3.9, -0.6, 2.28, -3.6, M.wood));
    g.add(box(-3.2, 2.28, -3.85, -2.8, 2.6, -3.65, M.woodDark));
    g.add(box(-1.6, 2.28, -3.85, -1.2, 2.55, -3.65, M.woodDark));
    // the crate (posed per shot in update); default: open, lid leaning against its right side
    const crate = makeCrate();
    crate.group.position.set(0, CRATE.h / 2, -0.8);
    crate.lid.position.set(0.75, 0.45, -0.8);
    crate.lid.rotation.z = -1.1;
    g.add(crate.group, crate.lid);
    g.userData.crate = crate;
    return g;
  }

  private buildWagonSet(): THREE.Group {
    const g = new THREE.Group();
    const M = mats();
    // ground + dirt road along x
    const ground = mesh(new THREE.PlaneGeometry(90, 50), M.grass, 70, -0.02, 0, false, true);
    ground.rotation.x = -Math.PI / 2;
    g.add(ground);
    const road = mesh(new THREE.PlaneGeometry(90, 4.2), M.dirt, 70, 0.0, 0, false, true);
    road.rotation.x = -Math.PI / 2;
    g.add(road);
    // a few simple trees for depth
    for (const [x, z, s] of [[58, -9, 1.2], [80, -7, 1.5], [64, 9, 1.0], [84, 8, 1.3]] as const) {
      const trunk = mesh(new THREE.CylinderGeometry(0.18 * s, 0.24 * s, 1.6 * s, 8), M.woodDark, x, 0.8 * s, z);
      const top = mesh(new THREE.ConeGeometry(1.3 * s, 3.2 * s, 8), M.grass, x, (1.6 + 1.6) * s, z);
      g.add(trunk, top);
    }
    // the wagon (moves along +x; the horse stays out of frame ahead)
    const wagon = new THREE.Group();
    wagon.add(box(-1.4, 0.8, -0.75, 1.4, 0.95, 0.75, M.wood)); // bed floor
    wagon.add(box(-1.4, 0.95, -0.75, 1.4, 1.35, -0.65, M.wood)); // side rails
    wagon.add(box(-1.4, 0.95, 0.65, 1.4, 1.35, 0.75, M.wood));
    wagon.add(box(-1.4, 0.95, -0.75, -1.3, 1.35, 0.75, M.wood)); // tail
    wagon.add(box(1.15, 0.95, -0.75, 1.4, 1.5, 0.75, M.wood)); // front board
    wagon.add(box(-1.5, 1.15, -0.6, -1.1, 1.3, 0.6, M.woodDark)); // driver bench
    const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.09, 14);
    wheelGeo.rotateX(Math.PI / 2); // axle along z; spin = rotation.z
    const wheels: THREE.Mesh[] = [];
    for (const [x, z] of [[-0.85, -0.82], [-0.85, 0.82], [0.85, -0.82], [0.85, 0.82]] as const) {
      const w = mesh(wheelGeo, M.woodDark, x, 0.48, z);
      wheels.push(w); wagon.add(w);
    }
    g.add(wagon);
    g.userData.wagon = wagon;
    g.userData.wheels = wheels;
    // the crate rides in the bed
    const crate = makeCrate();
    crate.group.position.set(0.2, 0.95 + CRATE.h / 2, 0);
    crate.lid.position.set(0.2, 0.95 + CRATE.h + 0.03, 0);
    wagon.add(crate.group, crate.lid);
    g.userData.crate = crate;
    return g;
  }

  private buildTrainSet(): THREE.Group {
    const g = new THREE.Group();
    const M = mats();
    const cx = TRAIN[0];
    // boxcar interior: floor, far wall, end walls, roof; near side open toward the camera
    g.add(box(cx - 4, -0.1, -1.6, cx + 4, 0, 1.6, M.woodDark));
    g.add(box(cx - 4, 0, -1.75, cx + 4, 2.8, -1.6, M.woodDark));
    g.add(box(cx - 4.15, 0, -1.6, cx - 4, 2.8, 1.6, M.woodDark));
    g.add(box(cx + 4, 0, -1.6, cx + 4.15, 2.8, 1.6, M.woodDark));
    g.add(box(cx - 4.15, 2.8, -1.75, cx + 4.15, 2.95, 1.6, M.woodDark));
    // slit window on the far wall (dim daylight)
    const slit = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.28),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(1.8, 1.7, 1.4) }));
    slit.position.set(cx - 1.5, 2.1, -1.58);
    g.add(slit);
    // background crates + barrel
    g.add(box(cx - 3.2, 0, -1.2, cx - 2.5, 0.7, -0.5, M.wood));
    g.add(box(cx + 2.6, 0, -1.3, cx + 3.3, 0.55, -0.6, M.wood));
    g.add(mesh(new THREE.CylinderGeometry(0.3, 0.26, 0.8, 10), M.woodDark, cx + 3.0, 0.4, 0.9));
    // the crate (rattles in update)
    const crate = makeCrate();
    crate.group.position.set(cx, CRATE.h / 2, 0);
    crate.lid.position.set(cx, CRATE.h + 0.03, 0);
    g.add(crate.group, crate.lid);
    g.userData.crate = crate;
    return g;
  }

  private buildBoatSet(): THREE.Group {
    const g = new THREE.Group();
    const M = mats();
    // deck + hull + water
    g.add(box(-6, -0.12, 67, 6, 0, 73, M.floor));
    g.add(box(-6, -1.6, 67, 6, -0.12, 73, M.hull));
    const water = mesh(new THREE.PlaneGeometry(300, 300),
      new THREE.MeshPhongMaterial({ color: "#0d2242", specular: "#8fb0e8", shininess: 80 }), 0, -1.4, 70, false, true);
    water.rotation.x = -Math.PI / 2;
    g.add(water);
    // railing along the far edge + smokestack + rope coil
    for (let x = -5.5; x <= 5.5; x += 1.1) g.add(box(x - 0.04, 0, 67.1, x + 0.04, 1.0, 67.2, M.woodDark));
    g.add(box(-6, 1.0, 67.05, 6, 1.12, 67.25, M.wood));
    g.add(mesh(new THREE.CylinderGeometry(0.5, 0.55, 4.2, 12), M.iron, -3.5, 2.1, 68.6));
    const coil = mesh(new THREE.TorusGeometry(0.35, 0.09, 8, 20), M.woodDark, 3.5, 0.09, 71.5);
    coil.rotation.x = Math.PI / 2;
    g.add(coil);
    // the crate, upside down (posed in update; stencil reads upside down = the joke)
    const crate = makeCrate();
    crate.group.position.set(0, CRATE.h / 2, 70);
    crate.lid.position.set(0, 0.03, 70); // lid ends up underneath when flipped
    g.add(crate.group, crate.lid);
    g.userData.crate = crate;
    return g;
  }

  private buildBoxinSet(): THREE.Group {
    // inside the crate: a tiny dark room (stylised cutaway), open front toward the camera
    const g = new THREE.Group();
    const M = mats(), cx = BOXIN[0], cz = BOXIN[2];
    g.add(box(cx - 1.3, -0.1, cz - 1.3, cx + 1.3, 0, cz + 1.3, M.woodDark));
    g.add(box(cx - 1.3, 0, cz - 1.45, cx + 1.3, 2.5, cz - 1.3, M.woodDark));
    g.add(box(cx - 1.45, 0, cz - 1.3, cx - 1.3, 2.5, cz + 1.3, M.woodDark));
    g.add(box(cx + 1.3, 0, cz - 1.3, cx + 1.45, 2.5, cz + 1.3, M.woodDark));
    g.add(box(cx - 1.45, 2.5, cz - 1.45, cx + 1.45, 2.6, cz + 1.3, M.woodDark));
    // a crack of warm light through the planks
    const crack = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 1.4),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 1.6, 0.9) }));
    crack.position.set(cx - 1.28, 1.4, cz - 0.4);
    crack.rotation.y = Math.PI / 2;
    g.add(crack);
    return g;
  }

  private buildInsertsSet(): THREE.Group {
    const g = new THREE.Group();
    const M = mats();
    // warm floor + backdrop wall
    g.add(box(-6, -0.1, -73, 6, 0, -66, M.floor));
    g.add(box(-6, 0, -73.15, 6, 4.5, -73, M.wallWarm));
    // parcel table
    g.add(box(-0.9, 0.86, -70.45, 0.9, 0.96, -69.55, M.wood));
    for (const [lx, lz] of [[-0.8, -70.35], [0.8, -70.35], [-0.8, -69.65], [0.8, -69.65]] as const)
      g.add(box(lx - 0.05, 0, lz - 0.05, lx + 0.05, 0.86, lz + 0.05, M.woodDark));
    // the crate on the table (carried along in update)
    const crate = makeCrate();
    crate.group.position.set(0, 0.96 + CRATE.h / 2, -70);
    crate.lid.position.set(0, 0.96 + CRATE.h + 0.03, -70);
    g.add(crate.group, crate.lid);
    g.userData.crate = crate;
    return g;
  }

  private buildPhillySet(): THREE.Group {
    const g = makeRoom({ w: 9, d: 7, h: 5.5, wall: mats().wallWarm, winX: -1.5, winY: 2.2 });
    const M = mats();
    g.position.set(PHILLY[0], 0, PHILLY[2]);
    // rug, chair, lamp, picture frame (positions are LOCAL to the room group)
    g.add(box(-1.5, 0.005, 0.2, 1.5, 0.03, 2.2, M.rug));
    const chair = new THREE.Group();
    chair.add(box(-0.25, 0.45, -0.25, 0.25, 0.52, 0.25, M.wood));
    chair.add(box(-0.25, 0.52, -0.25, 0.25, 1.15, -0.18, M.wood));
    for (const [lx, lz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]] as const)
      chair.add(box(lx - 0.03, 0, lz - 0.03, lx + 0.03, 0.45, lz + 0.03, M.woodDark));
    chair.position.set(-1.6, 0, -1.2); chair.rotation.y = 0.4;
    g.add(chair);
    const lamp = new THREE.Group();
    lamp.add(mesh(new THREE.CylinderGeometry(0.03, 0.05, 1.5, 8), M.iron, 0, 0.75, 0));
    const shade = mesh(new THREE.ConeGeometry(0.32, 0.4, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 1.8, 1.0), side: THREE.DoubleSide }), 0, 1.65, 0, false, false);
    lamp.add(shade);
    lamp.position.set(1.6, 0, -1.4);
    g.add(lamp);
    g.add(box(-2.6, 1.9, -3.48, -1.4, 2.9, -3.42, M.woodDark));
    g.add(mesh(new THREE.PlaneGeometry(1.0, 0.8), new THREE.MeshBasicMaterial({ color: "#7a9cc2" }), -2.0, 2.4, -3.4, false, false));
    // the crate (lid lifts in update)
    const crate = makeCrate();
    crate.group.position.set(0, CRATE.h / 2, 0);
    crate.lid.position.set(0, CRATE.h + 0.03, 0);
    g.add(crate.group, crate.lid);
    g.userData.crate = crate;
    return g;
  }

  // ---------------- per-frame posing ----------------
  private poseSets(id: number, f: number, t: number) {
    const wc = this.workshopCrate;
    // the crate is not in the factory (shot 2) — Henry has not built the box yet
    wc.group.visible = wc.lid.visible = id !== 2;
    if (id === 1 || id === 3) {
      wc.lid.position.set(0.75, 0.45, -0.8);
      wc.lid.rotation.set(0, 0, -1.1);
      wc.group.rotation.set(0, 0, 0);
    } else if (id === 4) {
      // the lid swings onto the box (f518-546), then the hammer strikes jolt it
      const k = smooth((f - 518) / 28);
      let jolt = 0;
      for (const th of [546, 560, 575]) { const n = f - th; if (n >= 0 && n < 3) jolt = 0.012; }
      wc.lid.position.set(0.75 * (1 - k), 0.45 + (CRATE.h + 0.03 - 0.45) * k + jolt + Math.sin(k * Math.PI) * 0.25, -0.8);
      wc.lid.rotation.set(0, 0, -1.1 * (1 - k));
    }
    if (id === 5) {
      const x = wagonX(f);
      this.wagon.position.set(x, 0, 0);
      const w = 0.074 / 0.48; // rad per frame (wagon speed / wheel radius)
      for (const wh of this.wheels) wh.rotation.z = -(f - 742) * w;
      const b = boxBounce(f);
      this.wagonCrate.group.position.set(0.2, 0.95 + CRATE.h / 2 + b.y, 0);
      this.wagonCrate.group.rotation.set(0, 0, b.rz);
      this.wagonCrate.lid.position.set(0.2, 0.95 + CRATE.h + 0.03 + b.y, 0);
      this.wagonCrate.lid.rotation.set(0, 0, b.rz);
    }
    if (id === 6) {
      const r = boxRattle(f);
      this.trainCrate.group.position.set(TRAIN[0] + r.x, CRATE.h / 2 + r.y, 0);
      this.trainCrate.group.rotation.set(0, 0, r.rz);
      this.trainCrate.lid.position.set(TRAIN[0] + r.x, CRATE.h + 0.03 + r.y, 0);
      this.trainCrate.lid.rotation.set(0, 0, r.rz);
    }
    if (id === 7 || id === 9) {
      // upside down around Z so the stencil still faces the camera — reading upside down (the joke)
      this.boatCrate.group.rotation.set(0, 0, Math.PI);
      this.boatCrate.group.position.set(0, CRATE.h / 2, 70);
    }
    if (id === 10) {
      const cx = insertsCrateX(f);
      this.insertsCrate.group.position.set(cx, 0.96 + CRATE.h / 2, -70);
      this.insertsCrate.lid.position.set(cx, 0.96 + CRATE.h + 0.03, -70);
    }
    if (id === 11 || id === 12) {
      // the lid arcs up off the box and settles leaning against its right side (not hovering over Henry)
      const lift = lidLift(f), tr = lidTremble(f);
      const arc = Math.sin(lift * Math.PI) * 0.6;
      this.phillyCrate.lid.position.set(1.15 * lift, CRATE.h + 0.03 + tr + (0.45 - CRATE.h - 0.03) * lift + arc, 0.1 * lift);
      this.phillyCrate.lid.rotation.set(0, 0, -1.1 * lift);
    }
  }

  /** pose everything for shot `id` at frame f; returns the lens focus point (for DOF) */
  update(id: number, f: number, cam: THREE.PerspectiveCamera, scene: THREE.Scene): V3 {
    const t = f / FPS;
    const s = SHOTS[id - 1];
    const c = camAt(id, f), P = LIGHTS[s.light], L = LOOK[s.light];
    const focus = focusAt(id, f);
    // ---- camera ----
    cam.position.set(c.pos[0], c.pos[1], c.pos[2]);
    cam.up.set(0, 1, 0);
    cam.lookAt(c.look[0], c.look[1], c.look[2]);
    cam.rotateZ(c.roll);
    cam.fov = c.fov;
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld(true);
    // ---- fog + sky ----
    scene.fog = this.fog;
    this.fog.color.copy(untone(P.fog));
    this.fog.near = P.fogNear; this.fog.far = P.fogFar;
    const u = this.skyMat.uniforms;
    L.sky.c.forEach((cc, i) => u[`c${i}`].value.copy(untone(cc)));
    u.e.value.set(L.sky.e[1], L.sky.e[2], L.sky.e[3], L.sky.e[4]);
    this.sky.position.set(c.pos[0], 0, c.pos[2]);
    // ---- sun: camera-relative, frozen per shot ----
    let dir = this.sunCache.get(id);
    if (!dir) {
      const az = (P.az * Math.PI) / 180, el = (P.el * Math.PI) / 180;
      const first = camAt(id, s.a);
      const fwd = new THREE.Vector3(first.look[0] - first.pos[0], 0, first.look[2] - first.pos[2]).normalize();
      const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
      dir = new THREE.Vector3()
        .addScaledVector(fwd, Math.sin(az) * Math.cos(el))
        .addScaledVector(right, Math.cos(az) * Math.cos(el));
      dir.y = Math.sin(el);
      dir.normalize();
      this.sunCache.set(id, dir);
    }
    this.sun.position.copy(dir).multiplyScalar(160).add(this.v.set(c.look[0], 0, c.look[2]));
    this.sun.target.position.set(c.look[0], 0, c.look[2]);
    this.sun.color.set(P.sunCol); this.sun.intensity = P.sunI;
    this.sun.shadow.bias = P.bias; this.sun.shadow.normalBias = P.normalBias;
    const sc = this.sun.shadow.camera as THREE.OrthographicCamera;
    sc.left = -14; sc.right = 14; sc.top = 14; sc.bottom = -14; sc.near = 1; sc.far = 400;
    sc.updateProjectionMatrix();
    this.hemi.color.set(P.sky); this.hemi.groundColor.set(P.ground); this.hemi.intensity = P.hemiI;
    this.fill.position.copy(dir).multiplyScalar(-100).add(this.v.set(c.look[0], 2, c.look[2]));
    this.fill.target.position.set(c.look[0], 0, c.look[2]);
    // ---- two-tone uniforms ----
    TONE.uLitCol.value.set(P.lit[0], P.lit[1], P.lit[2]);
    TONE.uShadeCol.value.set(P.shade[0], P.shade[1], P.shade[2]);
    TONE.uShadeLift.value.set(P.lift[0], P.lift[1], P.lift[2]);
    TONE.uLambert.value = P.lambert; TONE.uSideK.value = P.sideK; TONE.uTerm.value = P.term;
    TONE.uBounce.value.set(L.bounce[0], L.bounce[1], L.bounce[2]);
    TONE.uSat.value = L.sat;
    CHAR.uCharTint.value.set(P.charTint[0], P.charTint[1], P.charTint[2]);
    CHAR.uCharShade.value = P.charShade; CHAR.uGrad.value = P.charGrad;
    CHAR.uBodyGrad.value = P.bodyGrad;
    CHAR.uSideTint.value.set(P.sideTint[0], P.sideTint[1], P.sideTint[2]);
    // ---- sun disc / halo (golden sunset, night moon) ----
    const showSun = s.light === "golden" || s.light === "night";
    this.sunDisc.visible = this.sunHalo.visible = showSun;
    if (showSun) {
      const p = this.v.copy(dir).multiplyScalar(900).add(cam.position);
      this.sunDisc.position.copy(p);
      this.sunHalo.position.copy(p);
      if (s.light === "night") {
        (this.sunDisc.material as THREE.SpriteMaterial).color.setRGB(2.4, 2.7, 4.0);
        this.sunDisc.scale.set(45, 45, 1);
        (this.sunHalo.material as THREE.SpriteMaterial).color.setRGB(0.25, 0.3, 0.5);
        this.sunHalo.scale.set(160, 160, 1);
      } else {
        (this.sunDisc.material as THREE.SpriteMaterial).color.setRGB(6.0, 4.4, 2.4);
        this.sunDisc.scale.set(70, 70, 1);
        (this.sunHalo.material as THREE.SpriteMaterial).color.setRGB(1.4, 1.1, 0.9);
        this.sunHalo.scale.set(320, 320, 1);
      }
    }
    // ---- clouds face the camera, tinted by the light ----
    for (let i = 0; i < this.clouds.length; i++) {
      const m = this.clouds[i];
      (m.material as THREE.MeshBasicMaterial).map = this.cloudMaps[s.light][i % 4];
      m.lookAt(cam.position);
    }
    // ---- sets + props ----
    for (const [name, g] of Object.entries(this.sets)) g.visible = name === s.set;
    this.poseSets(id, f, t);
    // ---- cast ----
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion);
    const st = stage(id, f, { pos: cam.position, right, sun: dir });
    while (this.actors.length < st.places.length) this.actors.push(new Actor(this.root));
    st.places.forEach((p, i) => {
      const a = this.actors[i];
      const [w, h, k] = p.size ?? [1080, 1800, 1.8];
      a.r = this.pool.req(p.key, w, h, k, p.draw);
      a.mesh.visible = true;
      a.mesh.position.set(p.x, p.y, p.z);
      a.mesh.rotation.set(0, Math.atan2(cam.position.x - p.x, cam.position.z - p.z), p.roll ?? 0);
      a.mesh.scale.set((p.mirror ? -1 : 1) * (p.scale ?? 1), p.scale ?? 1, 1);
      a.mesh.castShadow = P.actorShadow;
    });
    for (let i = st.places.length; i < this.actors.length; i++) this.actors[i].mesh.visible = false;
    while (this.fxs.length < st.fx.length) this.fxs.push(new Fx(this.root));
    st.fx.forEach((p, i) => {
      const fx = this.fxs[i];
      fx.r = this.pool.req(p.key, p.cw, p.ch, 1, p.draw);
      fx.use(!!p.soft);
      fx.mesh.visible = true;
      fx.mesh.position.set(p.x, p.y, p.z);
      if (p.flat) fx.mesh.rotation.set(-Math.PI / 2, 0, p.rot ?? 0);
      else fx.mesh.rotation.set(0, Math.atan2(cam.position.x - p.x, cam.position.z - p.z), p.rot ?? 0);
      fx.mesh.scale.set(p.w, p.h, 1);
    });
    for (let i = st.fx.length; i < this.fxs.length; i++) this.fxs[i].mesh.visible = false;
    this.pool.flush();
    for (const a of this.actors) if (a.mesh.visible) a.bind();
    for (const fx of this.fxs) if (fx.mesh.visible) fx.bind();
    return focus;
  }
}
