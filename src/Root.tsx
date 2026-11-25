import React from "react";
import { Composition } from "remotion";
import { ThreeTest } from "./ThreeTest";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ThreeTest"
    component={ThreeTest}
    durationInFrames={30}
    fps={30}
    width={1080}
    height={1920}
  />
);
