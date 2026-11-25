/**
 * Minimal three.js render test (own code, written from scratch for this test).
 * A small painted 3D street: sky + fog, ground with a painted canvas texture,
 * three gabled houses with painted brick/plaster textures, a tree, a 2D
 * stickman card (Canvas2D drawing) that bobs, a spinning sign box, directional
 * sun + shadows, and a camera that dollies in over the 30 frames.
 * Proves: three.js/WebGL renders in headless Chrome (SwiftShader) via Remotion.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame, type RootState } from "@react-three/fiber";
import * as THREE from "three";

// Mutable scene handles, filled once in onCreated, animated per frame.
const R: {
  box?: THREE.Mesh;
  card?: THREE.Mesh;
} = {};

/** Seeded pseudo-random so textures are stable across renders. */
const rng = (seed: number) => {
  let s = seed || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const canvasTex = (
  key: string,
  w: number,
  h: number,
  draw: (g: CanvasRenderingContext2D, r: () => number) => void
): THREE.CanvasTexture => {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  draw(cv.getContext("2d")!, rng(key.length * 131 + key.charCodeAt(0)));
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};

/** Painted brick wall: warm bricks with jitter + dark mortar seams. */
const brickTexture = (base: string, mortar: string) =>
  canvasTex(`brick${base}`, 256, 256, (g, r) => {
    g.fillStyle = mortar;
    g.fillRect(0, 0, 256, 256);
    const shades = ["#c96f4a", "#b85a38", "#d08055", "#a84e30"];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 4; x++) {
        const off = y % 2 ? 32 : 0;
        g.fillStyle = shades[Math.floor(r() * shades.length)];
        g.fillRect(x * 64 + off - 32 + 2, y * 32 + 2, 60, 28);
      }
    }
    void base;
  });

/** Painted grass: green base + blade strokes + a few flowers. */
const grassTexture = () =>
  canvasTex("grass", 256, 256, (g, r) => {
    g.fillStyle = "#79b950";
    g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) {
      g.strokeStyle = ["#5f9c3d", "#8fcc5f", "#6aa844"][Math.floor(r() * 3)];
      g.lineWidth = 2;
      const x = r() * 256;
      const y = r() * 256;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + (r() - 0.5) * 4, y - 6 - r() * 6);
      g.stroke();
    }
    for (let i = 0; i < 14; i++) {
      g.fillStyle = ["#fff7d0", "#ffe066", "#ffb3c8"][Math.floor(r() * 3)];
      g.beginPath();
      g.arc(r() * 256, r() * 256, 3, 0, 7);
      g.fill();
    }
  });

/** A simple 2D stickman (own drawing): round head, dot eyes, smile,
 *  stick limbs, flat blue shirt. Drawn on a transparent canvas. */
const stickmanTexture = () =>
  canvasTex("stickman", 300, 500, (g) => {
    g.clearRect(0, 0, 300, 500);
    g.lineCap = "round";
    g.lineJoin = "round";
    // head
    g.fillStyle = "#ffe2c2";
    g.strokeStyle = "#241726";
    g.lineWidth = 10;
    g.beginPath();
    g.arc(150, 110, 78, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    // eyes + smile
    g.fillStyle = "#241726";
    g.beginPath();
    g.arc(122, 100, 9, 0, Math.PI * 2);
    g.arc(178, 100, 9, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#241726";
    g.lineWidth = 8;
    g.beginPath();
    g.arc(150, 128, 34, Math.PI * 0.15, Math.PI * 0.85);
    g.stroke();
    // torso (flat blue shirt)
    g.fillStyle = "#3f6fb5";
    g.strokeStyle = "#241726";
    g.lineWidth = 10;
    g.beginPath();
    g.roundRect(105, 195, 90, 130, 18);
    g.fill();
    g.stroke();
    // arms + legs (single-stroke limbs, ink-dot hands)
    g.strokeStyle = "#241726";
    g.lineWidth = 14;
    g.beginPath();
    g.moveTo(105, 220);
    g.lineTo(55, 300);
    g.moveTo(195, 220);
    g.lineTo(245, 300);
    g.moveTo(130, 325);
    g.lineTo(110, 450);
    g.moveTo(170, 325);
    g.lineTo(190, 450);
    g.stroke();
    g.fillStyle = "#241726";
    g.beginPath();
    g.arc(55, 300, 10, 0, Math.PI * 2);
    g.arc(245, 300, 10, 0, Math.PI * 2);
    g.fill();
  });

const buildScene = ({ gl, scene, camera }: RootState) => {
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;
  scene.background = new THREE.Color("#7ec8f7");
  scene.fog = new THREE.Fog(new THREE.Color("#b8d0ec"), 30, 110);

  // Lights: warm sun + soft sky fill.
  const sun = new THREE.DirectionalLight("#fff3e0", 2.6);
  sun.position.set(12, 18, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 16;
  sun.shadow.camera.bottom = -16;
  sun.shadow.camera.far = 60;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight("#dcecff", "#b49a78", 0.7));

  // Ground: painted grass plane.
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.MeshLambertMaterial({ map: grassTexture() })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Cobble street strip down the middle.
  const street = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 120),
    new THREE.MeshLambertMaterial({ color: "#b49f79" })
  );
  street.rotation.x = -Math.PI / 2;
  street.position.y = 0.02;
  street.receiveShadow = true;
  scene.add(street);

  // Three gabled houses (box + 4-sided cone roof) with painted textures.
  const house = (
    x: number,
    z: number,
    w: number,
    h: number,
    d: number,
    wall: string,
    roof: string
  ) => {
    const grp = new THREE.Group();
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshLambertMaterial({ map: brickTexture(wall, "#8a6a4a") })
    );
    walls.position.y = h / 2;
    walls.castShadow = true;
    walls.receiveShadow = true;
    grp.add(walls);
    const roofMesh = new THREE.Mesh(
      new THREE.ConeGeometry(Math.max(w, d) * 0.78, h * 0.55, 4),
      new THREE.MeshLambertMaterial({ color: roof })
    );
    roofMesh.position.y = h + h * 0.27;
    roofMesh.rotation.y = Math.PI / 4;
    roofMesh.castShadow = true;
    grp.add(roofMesh);
    // Door + window (dark planes on the front face).
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(w * 0.22, h * 0.45),
      new THREE.MeshLambertMaterial({ color: "#4a3020" })
    );
    door.position.set(0, h * 0.22, d / 2 + 0.02);
    grp.add(door);
    const win = new THREE.Mesh(
      new THREE.PlaneGeometry(w * 0.2, h * 0.2),
      new THREE.MeshLambertMaterial({ color: "#bfe3ff" })
    );
    win.position.set(w * 0.22, h * 0.68, d / 2 + 0.02);
    grp.add(win);
    grp.position.set(x, 0, z);
    scene.add(grp);
    return grp;
  };
  house(-7, -4, 5, 4, 5, "#c96f4a", "#8c3b2e");
  house(7, -8, 6, 5, 5, "#e8dcc0", "#5a6e8c");
  house(-8, -12, 5, 3.4, 4.5, "#d8b25a", "#6a4a2e");

  // Tree: trunk cylinder + two foliage spheres.
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.5, 3, 8),
    new THREE.MeshLambertMaterial({ color: "#8a5a3c" })
  );
  trunk.position.set(6, 1.5, -2);
  trunk.castShadow = true;
  scene.add(trunk);
  for (const [x, y, z, r] of [
    [6, 3.8, -2, 1.9],
    [5, 3.1, -1.4, 1.2],
  ] as const) {
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(r, 12, 10),
      new THREE.MeshLambertMaterial({ color: "#4a9142" })
    );
    leaf.position.set(x, y, z);
    leaf.castShadow = true;
    scene.add(leaf);
  }

  // Spinning sign box on a post (the animated prop).
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.2, 1.2),
    new THREE.MeshLambertMaterial({ color: "#e2453c" })
  );
  box.position.set(0, 2.6, 2);
  box.castShadow = true;
  scene.add(box);
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 2, 8),
    new THREE.MeshLambertMaterial({ color: "#3d4440" })
  );
  post.position.set(0, 1, 2);
  post.castShadow = true;
  scene.add(post);
  R.box = box;

  // Stickman card: a plane with the Canvas2D drawing, facing the camera.
  const card = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 4),
    new THREE.MeshBasicMaterial({
      map: stickmanTexture(),
      transparent: true,
      side: THREE.DoubleSide,
    })
  );
  card.position.set(-2.5, 2.4, 1);
  scene.add(card);
  R.card = card;

  camera.lookAt(0, 2.2, -4);
};

/** Per-frame animation (react-three-fiber render loop): spin the sign,
 *  bob the card, dolly the camera in and keep it aimed at the street. */
const Animator: React.FC = () => {
  const frame = useCurrentFrame();
  useFrame(({ camera }) => {
    const camZ = 15 - (frame / 29) * 3.5;
    camera.position.set(0, 5, camZ);
    camera.lookAt(0, 2.2, -4);
    if (R.box) {
      R.box.rotation.y = frame * 0.06;
    }
    if (R.card) {
      R.card.position.y = 2.4 + Math.sin(frame * 0.18) * 0.12;
    }
  });
  return null;
};

export const ThreeTest: React.FC = () => {
  const frame = useCurrentFrame();
  // Slow dolly-in: camera z 15 -> 11.5 across the 30 frames.
  const camZ = 15 - (frame / 29) * 3.5;
  return (
    <AbsoluteFill style={{ backgroundColor: "#7ec8f7" }}>
      <ThreeCanvas
        linear
        width={1080}
        height={1920}
        camera={{ fov: 42, near: 0.1, far: 300, position: [0, 5, camZ] }}
        onCreated={buildScene}
      >
        <Animator />
      </ThreeCanvas>
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 58,
            fontWeight: 900,
            fontFamily: "sans-serif",
            textShadow: "0 4px 0 #000",
            marginBottom: 110,
          }}
        >
          THREE.JS TEST · f={frame}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
