import React from "react";
import { Composition } from "remotion";
import { ApolloShort } from "./videos/apollo/Apollo";
import { TOTAL } from "./videos/apollo/story";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ApolloShort"
    component={ApolloShort}
    durationInFrames={TOTAL}
    fps={30}
    width={1080}
    height={1920}
  />
);
