import React from "react";
import { Composition } from "remotion";
import { MatisseShort } from "./videos/matisse/Matisse";
import { TOTAL } from "./videos/matisse/story";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MatisseShort"
    component={MatisseShort}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
