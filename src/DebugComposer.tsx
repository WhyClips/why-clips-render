import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { EffectComposer as PPComposer, RenderPass, BloomEffect, EffectPass } from "postprocessing";

const Box: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.01; });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#c25a3a" />
    </mesh>
  );
};

export const DebugComposer: React.FC = () => (
  <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: false }} camera={{ fov: 40, near: 0.2, far: 100, position: [0, 1, 7] }}>
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 8, 5]} intensity={1.5} />
    <Box />
    <EffectComposer multisampling={0} frameBufferType={THREE.UnsignedByteType}>
      <Bloom intensity={0.5} luminanceThreshold={1.0} mipmapBlur />
    </EffectComposer>
  </ThreeCanvas>
);

export const DebugPlain: React.FC = () => (
  <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: false }} camera={{ fov: 40, near: 0.2, far: 100, position: [0, 1, 7] }}>
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 8, 5]} intensity={1.5} />
    <Box />
  </ThreeCanvas>
);

/** raw postprocessing EffectComposer, driven manually (no React wrapper) */
const RawComposerInner: React.FC = () => {
  const { gl, scene, camera } = useThree();
  const composer = useMemo(() => {
    const c = new PPComposer(gl, { frameBufferType: THREE.HalfFloatType, multisampling: 0 });
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new EffectPass(camera, new BloomEffect({ intensity: 0.5, luminanceThreshold: 1.0, mipmapBlur: true })));
    return c;
  }, [gl, scene, camera]);
  useFrame((_, delta) => { composer.render(delta); }, 1);
  return null;
};

export const DebugRaw: React.FC = () => (
  <ThreeCanvas width={1080} height={1920} shadows gl={{ antialias: false }} camera={{ fov: 40, near: 0.2, far: 100, position: [0, 1, 7] }}>
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 8, 5]} intensity={1.5} />
    <Box />
    <RawComposerInner />
  </ThreeCanvas>
);
