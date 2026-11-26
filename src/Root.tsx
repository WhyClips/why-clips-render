import React from "react";
import { Composition } from "remotion";
import { MoonTreesShort } from "./videos/fruitflies/MoonTrees";
import { TOTAL } from "./videos/fruitflies/story";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MoonTreesShort"
    component={MoonTreesShort}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
