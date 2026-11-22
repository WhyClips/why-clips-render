import React from "react";
import { Composition } from "remotion";
import { HenryShort } from "./videos/henry/Henry";
import { TestCube } from "./videos/henry/TestCube";
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="HenryShort" component={HenryShort} durationInFrames={1992} fps={30} width={1080} height={1920} />
    <Composition id="TestCube" component={TestCube} durationInFrames={1} fps={30} width={1080} height={1920} />
  </>
);
