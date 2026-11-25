// In-scene numbers: the 1-2 biggest figures per video appear as giant 3D text floating
// INSIDE the scene (TheRealWhy signature move — Coin's gold "$1,000", Speed Camera's
// "112 MPH" signs). NOT captions: this is a world-space card, unlit so it stays readable
// in any light (the skill's sign lesson: a sign lit by a side sun goes grey-blue).
// Billboarded toward the camera every frame; on the NOINK layer (no world ink on it).
import * as THREE from "three";
import { ctex } from "./bridge/paint";
import { NOINK } from "./bridge/ink";

export type NumberStyle = "gold" | "white" | "green";

/** a world-space number card; place it, then billboard it in World.update() */
export const numberCard = (text: string, sub: string | null, style: NumberStyle = "gold", scale = 1): THREE.Mesh => {
  const key = `bignum|${style}|${text}|${sub ?? ""}`;
  const tex = ctex(key, 1024, sub ? 512 : 384, (g) => {
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
    // shadow pass: same text, offset down, dark
    g.font = `900 200px Arial, Helvetica, sans-serif`;
    g.lineWidth = 18; g.lineJoin = "round"; g.strokeStyle = "rgba(0,0,0,0.55)";
    g.strokeText(text, 512, cy + 14);
    face(512, cy, 200, grad);
    if (sub) {
      g.font = `800 64px Arial, Helvetica, sans-serif`;
      // dark pill behind the sub-text: white text crosses the sky gap between the
      // houses in the street wide and is invisible on pale sky without it.
      // Alpha 0.88 (not 0.6): a semi-transparent pill over bright sky washes out
      // to mid-grey and the white letters on it go unreadable.
      // Width is computed from the sub LENGTH, not measureText: the canvas
      // measureText under-reports the rendered width by ~40% in this headless
      // Chrome (the "INS" of COINS stuck out past the measured pill), so the
      // pill is sized generously: 56 px per character + 72 px padding.
      const pw = sub.length * 56 + 72;
      const px = 512 - pw / 2, py = 400 - 44, ph = 88, r = 24;
      g.fillStyle = "rgba(20,12,8,0.88)";
      g.beginPath();
      g.moveTo(px + r, py); g.lineTo(px + pw - r, py); g.arcTo(px + pw, py, px + pw, py + r, r);
      g.lineTo(px + pw, py + ph - r); g.arcTo(px + pw, py + ph, px + pw - r, py + ph, r);
      g.lineTo(px + r, py + ph); g.arcTo(px, py + ph, px, py + ph - r, r);
      g.lineTo(px, py + r); g.arcTo(px, py, px + r, py, r); g.closePath(); g.fill();
      g.lineWidth = 14; g.lineJoin = "round"; g.strokeStyle = "rgba(20,12,8,0.92)";
      g.strokeText(sub, 512, 400); g.fillStyle = "#ffffff"; g.fillText(sub, 512, 400);
    }
  });
  const h = (sub ? 512 : 384) / 1024; // texture aspect
  const geo = new THREE.PlaneGeometry(2.6 * scale, 2.6 * h * scale);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.layers.set(NOINK);
  mesh.renderOrder = 2;
  return mesh;
};
