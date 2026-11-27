import React from "react";
import { Composition } from "remotion";
import { SegwayShort } from "./videos/fruitflies/Segway";
import { TOTAL } from "./videos/fruitflies/story";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="SegwayShort"
    component={SegwayShort}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
