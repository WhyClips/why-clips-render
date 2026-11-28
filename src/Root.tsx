import React from "react";
import { Composition } from "remotion";
import { VaiShort } from "./videos/fruitflies/Vai";
import { TOTAL } from "./videos/fruitflies/story";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="VaiShort"
    component={VaiShort}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
