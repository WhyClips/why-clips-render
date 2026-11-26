// Template composition: three.js worlds (worlds.ts) + the skill's post chain
// (ink -> lens blur pre + main -> bloom -> NEUTRAL tone map -> grade, MSAA 4)
// + the caption overlay. Place changes crossfade; the hook ends on a 4-frame flash.
//
// NOTE (25 Nov 2026): @react-three/postprocessing's <EffectComposer> renders BLACK in
// this environment (verified: stock Bloom on a red box = black, while the same scene
// through a raw postprocessing EffectComposer renders fine). So the composer is driven
// MANUALLY below with the raw postprocessing API — same pass order the skill specifies,
// CONVOLUTION effects (lens pre/main) each in their own EffectPass, the rest merged.
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { AbsoluteFill, continueRender, delayRender, getInputProps, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer as PPComposer, RenderPass, EffectPass, BloomEffect, ToneMappingEffect, ToneMappingMode } from "postprocessing";
import { World, loadKit } from "./worlds";
import { InkPass, noInkFallback } from "./bridge/ink";
import { LensBlur, GrainEffect } from "./bridge/lensblur";
import { GradeEffect, GRADES, GRADE_STRENGTH, gradeFor } from "./bridge/grade";
import { Kit } from "./bridge/build";
import { TOTAL, FLASH_AT, SHOTS, layersAt, dofAt } from "./story";
import { CaptionOverlay } from "./captions";

export const TEMPLATE_FRAMES = TOTAL;

type PostToggles = { ink: boolean; lens: boolean; pre: boolean; bloom: boolean; grade: boolean; grain: boolean; composer: boolean; ms: number };
const toggles = (): PostToggles => ({ ink: true, lens: true, pre: true, bloom: true, grade: true, grain: false, composer: true, ms: 4, ...((getInputProps() as { post?: Partial<PostToggles> }).post ?? {}) });

const makeBloom = () => {
  const b = new BloomEffect({ blendFunction: 3, intensity: 0.5, luminanceThreshold: 1.0, luminanceSmoothing: 0.2, mipmapBlur: true, levels: 6, radius: 0.6 });
  const mip = (b as unknown as { mipmapBlurPass: { setSize: (w: number, h: number) => void } }).mipmapBlurPass;
  const setSize = mip.setSize.bind(mip);
  mip.setSize = (w: number, h: number) => setSize(Math.round((1920 * w) / Math.max(h, 1)), 1920);
  return b;
};

const fwd = new THREE.Vector3(), fpt = new THREE.Vector3();

const useKit = () => {
  const [kit, setKit] = useState<Kit | null>(null);
  const [handle] = useState(() => delayRender("template kit"));
  useEffect(() => { loadKit().then((k) => { setKit(k); continueRender(handle); }); }, [handle]);
  return kit;
};

type Fx = {
  ink: InkPass;
  lens: LensBlur;
  bloom: BloomEffect;
  tone: ToneMappingEffect;
  grade: GradeEffect;
  grain: GrainEffect;
};

/** raw postprocessing composer (see NOTE above): RenderPass -> InkPass -> lens pre ->
 *  lens main -> [bloom + NEUTRAL tone + grade] -> [grain]. Driven in a priority-1
 *  useFrame, which takes over R3F's rendering (the scene is drawn by the RenderPass). */
const ComposerRig: React.FC<{ fx: Fx; on: PostToggles }> = ({ fx, on }) => {
  const { gl, scene, camera } = useThree();
  const composer = useMemo(() => {
    const c = new PPComposer(gl, { frameBufferType: THREE.HalfFloatType, multisampling: on.ms });
    c.addPass(new RenderPass(scene, camera));
    if (on.ink) c.addPass(fx.ink);
    if (on.lens && on.pre) c.addPass(new EffectPass(camera, fx.lens.pre));
    if (on.lens) c.addPass(new EffectPass(camera, fx.lens.main));
    const tail: (BloomEffect | ToneMappingEffect | GradeEffect)[] = [];
    if (on.bloom) tail.push(fx.bloom);
    tail.push(fx.tone);
    if (on.grade) tail.push(fx.grade);
    c.addPass(new EffectPass(camera, ...tail));
    if (on.grain) c.addPass(new EffectPass(camera, fx.grain));
    return c;
  }, [gl, scene, camera, fx, on]);
  useEffect(() => () => composer.dispose(), [composer]);
  const sizeRef = useMemo(() => ({ w: -1, h: -1, pr: -1 }), []);
  useFrame((_, delta) => {
    const size = new THREE.Vector2();
    gl.getSize(size);
    const pr = gl.getPixelRatio();
    if (size.width !== sizeRef.w || size.height !== sizeRef.h || pr !== sizeRef.pr) {
      composer.setSize(size.width, size.height);
      sizeRef.w = size.width; sizeRef.h = size.height; sizeRef.pr = pr;
    }
    const ac = gl.autoClear;
    gl.autoClear = true;
    composer.render(delta);
    gl.autoClear = ac;
  }, 1);
  return null;
};

const Inner: React.FC<{ id: number; kit: Kit }> = ({ id, kit }) => {
  const f = useCurrentFrame();
  const { camera, scene } = useThree();
  const world = useMemo(() => new World(kit), [kit]);
  const target = useMemo(() => new THREE.Vector3(), []);
  const on = useMemo(toggles, []);
  const fx = useMemo((): Fx => ({
    ink: new InkPass(scene, camera as THREE.PerspectiveCamera),
    lens: new LensBlur({ maxCoC: 24, nearScale: 1.2 }),
    bloom: makeBloom(),
    tone: new ToneMappingEffect({ mode: ToneMappingMode.NEUTRAL }),
    grade: new GradeEffect(GRADES.day, GRADE_STRENGTH.day),
    grain: new GrainEffect({ amount: 0.025, cellPx: 1.5 }),
  }), [camera, scene]);
  useEffect(() => () => fx.ink.dispose(), [fx]);
  const cam = camera as THREE.PerspectiveCamera;
  target.copy(world.update(id, f, cam, scene));
  noInkFallback(world.root);
  const d = dofAt(f);
  cam.getWorldDirection(fwd);
  if (d.focus) fpt.set(...d.focus(f)); else fpt.copy(target);
  fx.lens.focus = Math.max(0.3, fpt.sub(cam.position).dot(fwd));
  fx.lens.cInf = d.cInf;
  gradeFor(fx.grade, SHOTS[id - 1].light);
  fx.grain.seed = f;
  return (
    <>
      <primitive object={world.root} dispose={null} />
      {on.composer ? <ComposerRig fx={fx} on={on} /> : null}
    </>
  );
};

const dprOverride = () => (getInputProps() as { post?: { dpr?: number } }).post?.dpr;
const ShotView: React.FC<{ id: number; kit: Kit; alpha: number }> = ({ id, kit, alpha }) => (
  <AbsoluteFill style={{ opacity: alpha }}>
    <ThreeCanvas width={1080} height={1920} {...(dprOverride() ? { dpr: dprOverride() } : {})} shadows gl={{ antialias: false, stencil: false, powerPreference: "high-performance", toneMappingExposure: 1.0 }}
      camera={{ fov: 40, near: 0.2, far: 1500 }}>
      <Inner id={id} kit={kit} />
    </ThreeCanvas>
  </AbsoluteFill>
);

export const TemplateShort: React.FC = () => {
  const f = useCurrentFrame();
  const kit = useKit();
  if (!kit) return null;
  const flash = f >= FLASH_AT && f < FLASH_AT + 4 ? [1, 0.75, 0.45, 0.2][f - FLASH_AT] : 0;
  return (
    <AbsoluteFill style={{ background: "#cfe3f2" }}>
      {layersAt(f).map((l, i) => <ShotView key={i ? "over" : "base"} id={l.id} kit={kit} alpha={l.alpha} />)}
      {flash > 0 && <AbsoluteFill style={{ background: "#ffffff", opacity: flash }} />}
      <CaptionOverlay />
    </AbsoluteFill>
  );
};
