import React from "react";
import { Composition } from "remotion";
import { GlassmakerShort } from "./videos/glassmaker/Glassmaker";
import { TOTAL } from "./videos/glassmaker/story";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="GlassmakerShort"
    component={GlassmakerShort}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
