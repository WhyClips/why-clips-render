// "Henry Box Brown: The Prisoner Who Mailed Himself to Freedom" — our original 66 s demo short
// in the flat-characters-in-a-3D-toon-world style. One three.js world (world.ts) posed per frame from
// the story timeline (story.ts). Post chain (same as the bridge template):
//   InkPass (world ink lines, own pass) -> lens blur pre + main (thin-lens DOF per shot from dofAt) ->
//   [bloom (emissive only) + NEUTRAL tone mapping + colour grade] (one merged EffectPass), MSAA 4.
// Place changes crossfade by stacking a second canvas for the fade frames; the hook ends on a 4-frame
// white flash. Captions (1-2 words at a time, bold white + dark outline, word-timed) are a DOM overlay.
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { AbsoluteFill, getInputProps, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame, useThree } from "@react-three/fiber";
import { BlendFunction, BloomEffect, Effect, EffectComposer, EffectPass, RenderPass, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { World } from "./world";
import { InkPass, noInkFallback } from "./ink";
import { LensBlur, GrainEffect } from "./lensblur";
import { GradeEffect, GRADES, GRADE_STRENGTH, gradeFor } from "./grade";
import { TOTAL, FLASH_AT, SHOTS, layersAt, dofAt, FPS } from "./story";
import wordsJson from "./words.json";

export const HENRY_FRAMES = TOTAL;

/** A/B switches for test stills only (Remotion inputProps `{ post: { ink: false, ... } }`); everything is on by default. */
type PostToggles = { ink: boolean; lens: boolean; pre: boolean; bloom: boolean; grade: boolean; grain: boolean; composer: boolean; tone: boolean; msaa: number };
const toggles = (): PostToggles => ({ ink: true, lens: true, pre: true, bloom: true, grade: true, grain: false, composer: true, tone: true, msaa: 4, ...((getInputProps() as { post?: Partial<PostToggles> }).post ?? {}) });

/** Bloom for emissive sources only (depth.md 6.4). Its MIP chain always starts at 540x960 (half of 1080x1920),
 *  whatever the output size, so the glow keeps the same size relative to the frame (e-fold ~30 px at 1080p,
 *  ~1.5 % of the frame height) at 540, 1080 and 1440 widths. ADD blend: HDR-safe (SCREEN darkens values > 1). */
const makeBloom = () => {
  const b = new BloomEffect({ blendFunction: BlendFunction.ADD, intensity: 0.5, luminanceThreshold: 1.0, luminanceSmoothing: 0.2, mipmapBlur: true, levels: 6, radius: 0.6 });
  const mip = b.mipmapBlurPass;
  const setSize = mip.setSize.bind(mip);
  mip.setSize = (w: number, h: number) => setSize(Math.round((1920 * w) / Math.max(h, 1)), 1920);
  return b;
};

const fwd = new THREE.Vector3(), fpt = new THREE.Vector3();

const Inner: React.FC<{ id: number }> = ({ id }) => {
  const f = useCurrentFrame();
  const { camera, scene, gl } = useThree();
  const world = useMemo(() => new World(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const on = useMemo(toggles, []);
  // NOTE: the postprocessing EffectComposer is built synchronously here (useMemo), NOT via
  // @react-three/postprocessing's <EffectComposer>: that component creates its composer in a useEffect
  // and only renders it from a useFrame, but Remotion drives the canvas with frameloop="never" + a
  // single advance() per frame, so its composer never gets a frame and the output is blank. Building
  // the composer during render + driving it from our own render-priority useFrame renders on the
  // very first advance.
  const fx = useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const ink = new InkPass(scene, cam);
    const lens = new LensBlur({ maxCoC: 24, nearScale: 1.2 });
    const bloom = makeBloom();
    const tone = new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL });
    const grade = new GradeEffect(GRADES.day, GRADE_STRENGTH.day);
    const grain = new GrainEffect({ amount: 0.025, cellPx: 1.5 }); // film grain, OFF by default: the reference measures no grain and it quadruples the file size
    const composer = new EffectComposer(gl, { multisampling: on.msaa, frameBufferType: THREE.HalfFloatType });
    composer.addPass(new RenderPass(scene, cam));
    if (on.ink) composer.addPass(ink);
    if (on.lens && on.pre) composer.addPass(new EffectPass(cam, lens.pre));
    if (on.lens) composer.addPass(new EffectPass(cam, lens.main));
    if (on.bloom) composer.addPass(new EffectPass(cam, bloom));
    const tail: Effect[] = [];
    if (on.tone) tail.push(tone);
    if (on.grade) tail.push(grade);
    if (on.grain) tail.push(grain);
    if (tail.length) composer.addPass(new EffectPass(cam, ...tail));
    return { ink, lens, bloom, tone, grade, grain, composer };
  }, [camera, scene, gl, on]);
  useEffect(() => () => { fx.ink.dispose(); fx.composer.dispose(); }, [fx]);
  const sizeRef = useRef({ w: -1, h: -1, pr: -1 });
  const glSize = useMemo(() => new THREE.Vector2(), []);
  useFrame((_, delta) => {
    if (!on.composer) return;
    gl.getSize(glSize);
    const pr = gl.getPixelRatio();
    const s = sizeRef.current;
    if (glSize.width !== s.w || glSize.height !== s.h || pr !== s.pr) {
      fx.composer.setSize(glSize.width, glSize.height);
      sizeRef.current = { w: glSize.width, h: glSize.height, pr };
    }
    fx.composer.render(delta);
  }, on.composer ? 1 : 0);
  const cam = camera as THREE.PerspectiveCamera;
  target.set(...world.update(id, f, cam, scene));
  noInkFallback(world.root);
  // thin-lens focus: distance along the view axis to the shot's focus point (default: the camera's look target)
  const d = dofAt(f);
  cam.getWorldDirection(fwd);
  if (d.focus) fpt.set(...d.focus(f)); else fpt.copy(target);
  fx.lens.focus = Math.max(0.3, fpt.sub(cam.position).dot(fwd));
  fx.lens.cInf = d.cInf;
  gradeFor(fx.grade, SHOTS[id - 1].light);
  fx.grain.seed = f; // deterministic per frame
  return <primitive object={world.root} dispose={null} />;
};

/** test stills only: inputProps `{ post: { dpr: 0.5 } }` forces the WebGL buffer size (R3F clamps dpr to >= 1 by default) */
const dprOverride = () => (getInputProps() as { post?: { dpr?: number } }).post?.dpr;
const ShotView: React.FC<{ id: number; alpha: number }> = ({ id, alpha }) => (
  <AbsoluteFill style={{ opacity: alpha }}>
    <ThreeCanvas width={1080} height={1920} {...(dprOverride() ? { dpr: dprOverride() } : {})} shadows gl={{ antialias: false, stencil: false, powerPreference: "high-performance", toneMappingExposure: 1.0 }}
      camera={{ fov: 40, near: 0.2, far: 1500 }}>
      <Inner id={id} />
    </ThreeCanvas>
  </AbsoluteFill>
);

// ---------------- captions (1-2 words at a time, word-timed) ----------------
type Word = { w: string; s: number; e: number };
const WORDS = wordsJson as Word[];
type Chunk = { text: string; s: number; e: number };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  let i = 0;
  while (i < WORDS.length) {
    const a = WORDS[i];
    // pair with the next word when the gap is small (< 0.35 s) and the pair stays short
    const b = WORDS[i + 1];
    if (b && b.s - a.e < 0.35 && (a.w + b.w).length <= 14) {
      out.push({ text: `${a.w} ${b.w}`.toUpperCase(), s: a.s, e: b.e });
      i += 2;
    } else {
      out.push({ text: a.w.toUpperCase(), s: a.s, e: a.e });
      i += 1;
    }
  }
  return out;
})();
const chunkAt = (t: number) => CHUNKS.find((c) => t >= c.s && t < c.e + 0.06);

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const c = chunkAt(f / FPS);
  if (!c) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 300 }}>
      <div style={{
        fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 800, fontSize: 56, lineHeight: 1.15,
        color: "#ffffff", textAlign: "center", maxWidth: 900, padding: "0 40px",
        textShadow: "0 3px 0 #000, 3px 0 0 #000, -3px 0 0 #000, 0 -3px 0 #000, 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 6px 12px rgba(0,0,0,0.6)",
      }}>
        {c.text}
      </div>
    </AbsoluteFill>
  );
};

export const HenryShort: React.FC = () => {
  const f = useCurrentFrame();
  const flash = f >= FLASH_AT && f < FLASH_AT + 4 ? [1, 0.75, 0.45, 0.2][f - FLASH_AT] : 0;
  return (
    <AbsoluteFill style={{ background: "#cfe3f2" }}>
      {layersAt(f).map((l, i) => <ShotView key={i ? "over" : "base"} id={l.id} alpha={l.alpha} />)}
      {flash > 0 && <AbsoluteFill style={{ background: "#ffffff", opacity: flash }} />}
      <Captions />
    </AbsoluteFill>
  );
};
