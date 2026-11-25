import React from "react";
import { Composition } from "remotion";
import { SuedGodShort } from "./videos/suedgod/SuedGod";
import { TOTAL } from "./videos/suedgod/story";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="SuedGodShort"
    component={SuedGodShort}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
