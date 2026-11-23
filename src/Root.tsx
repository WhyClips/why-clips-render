import React from "react";
import { Composition } from "remotion";
import { SpamShort } from "./videos/spam/Spam";
import { TOTAL } from "./videos/spam/story";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="SpamShort"
    component={SpamShort}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
