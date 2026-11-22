// Minimal ThreeCanvas test: a red cube on a blue background. If this renders, the canvas
// setup is fine and the problem is in the Henry scene code.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";

const Cube: React.FC = () => (
  <>
    <ambientLight intensity={1} />
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshBasicMaterial color="#ff0000" />
    </mesh>
  </>
);

export const TestCube: React.FC = () => (
  <AbsoluteFill style={{ background: "#0000ff" }}>
    <ThreeCanvas width={1080} height={1920} camera={{ fov: 40, near: 0.2, far: 1500, position: [0, 0, 5] }}>
      <Cube />
    </ThreeCanvas>
  </AbsoluteFill>
);
