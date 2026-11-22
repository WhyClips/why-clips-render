import React from "react";
import { Composition } from "remotion";
import { IslandShort } from "./videos/island/Island";
import { TOTAL } from "./videos/island/story";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="IslandShort"
    component={IslandShort}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
