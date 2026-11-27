import React from "react";
import { Composition } from "remotion";
import { SuedHimselfShort } from "./videos/fruitflies/SuedHimself";
import { TOTAL } from "./videos/fruitflies/story";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="SuedHimselfShort"
    component={SuedHimselfShort}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
