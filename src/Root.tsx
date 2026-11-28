import React from "react";
import { Composition } from "remotion";
import { DrakeShort } from "./videos/fruitflies/Drake";
import { TOTAL } from "./videos/fruitflies/story";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="DrakeShort"
    component={DrakeShort}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
