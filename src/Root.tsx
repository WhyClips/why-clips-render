import React from "react";
import { Composition } from "remotion";
import { FruitFliesShort } from "./videos/fruitflies/FruitFlies";
import { TOTAL } from "./videos/fruitflies/story";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="FruitFliesShort"
    component={FruitFliesShort}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
