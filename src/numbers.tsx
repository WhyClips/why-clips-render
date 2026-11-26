// In-scene numbers: the 1-2 biggest figures per video appear as giant 3D text floating
// INSIDE the scene (TheRealWhy signature move — Coin's gold "$1,000", Speed Camera's
// "112 MPH" signs). NOT captions: this is a world-space card, unlit so it stays readable
// in any light (the skill's sign lesson: a sign lit by a side sun goes grey-blue).
// Billboarded toward the camera every frame; on the NOINK layer (no world ink on it).
// LINE ANIMATION (Azhar, 26 Nov 07:25): numbers pop in with an overshoot scale over
// their first ~14 frames (driven in World.update), and count-up numbers swap through
// step textures (numberTexture() exported so worlds.ts can pre-build the steps).
import * as THREE from "three";
import { ctex } from "./bridge/paint";
import { NOINK } from "./bridge/ink";

export type NumberStyle = "gold" | "white" | "green";

/** draw one number card texture (cached by key — step textures use distinct keys) */
export const numberTexture = (text: string, sub: string | null, style: NumberStyle = "gold"): THREE.Texture => {
  const key = `bignum|${style}|${text}|${sub ?? ""}`;
  return ctex(key, 1024, sub ? 512 : 384, (g) => {
    g.clearRect(0, 0, 1024, sub ? 512 : 384);
    g.textAlign = "center"; g.textBaseline = "middle";
    // soft drop shadow first (depth), then the face
    const face = (x: number, y: number, size: number, grad: CanvasGradient | string) => {
      g.font = `900 ${size}px Arial, Helvetica, sans-serif`;
      g.lineWidth = size * 0.09; g.lineJoin = "round"; g.strokeStyle = "rgba(20,12,8,0.92)";
      g.strokeText(text, x, y); g.fillStyle = grad; g.fillText(text, x, y);
    };
    const gold = g.createLinearGradient(0, 60, 0, 300);
    gold.addColorStop(0, "#ffe9a8"); gold.addColorStop(0.45, "#f5c542"); gold.addColorStop(1, "#c8861a");
    const white = g.createLinearGradient(0, 60, 0, 300);
    white.addColorStop(0, "#ffffff"); white.addColorStop(1, "#dfe6ee");
    const green = g.createLinearGradient(0, 60, 0, 300);
    green.addColorStop(0, "#c8f7c5"); green.addColorStop(0.5, "#4caf50"); green.addColorStop(1, "#1e7d32");
    const grad = style === "gold" ? gold : style === "green" ? green : white;
    const cy = sub ? 170 : 192;
    // shrink-to-fit: fixed 200px clips long strings ("420 SEEDLINGS" is ~1600px wide
    // in a 1024px texture). Measure first, then draw shadow + face at the fitted size.
    let size = 200;
    g.font = `900 ${size}px Arial, Helvetica, sans-serif`;
    const tw = g.measureText(text).width;
    if (tw > 940) size = Math.max(60, Math.floor((200 * 940) / tw));
    // shadow pass: same text, offset down, dark
    g.font = `900 ${size}px Arial, Helvetica, sans-serif`;
    g.lineWidth = Math.max(8, size * 0.09); g.lineJoin = "round"; g.strokeStyle = "rgba(0,0,0,0.55)";
    g.strokeText(text, 512, cy + 14);
    face(512, cy, size, grad);
    if (sub) {
      g.font = `800 64px Arial, Helvetica, sans-serif`;
      g.lineWidth = 10; g.lineJoin = "round"; g.strokeStyle = "rgba(20,12,8,0.92)";
      g.strokeText(sub, 512, 400); g.fillStyle = "#ffffff"; g.fillText(sub, 512, 400);
    }
  });
};

/** a world-space number card; place it, then billboard it in World.update() */
export const numberCard = (text: string, sub: string | null, style: NumberStyle = "gold", scale = 1): THREE.Mesh => {
  const tex = numberTexture(text, sub, style);
  const h = (sub ? 512 : 384) / 1024; // texture aspect
  const geo = new THREE.PlaneGeometry(2.6 * scale, 2.6 * h * scale);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.layers.set(NOINK);
  mesh.renderOrder = 2;
  return mesh;
};
