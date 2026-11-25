import React from "react";
import { Composition } from "remotion";
import { TemplateShort } from "./Template";
import { DebugComposer, DebugPlain, DebugRaw } from "./DebugComposer";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="TemplateShort"
      component={TemplateShort}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition id="DebugComposer" component={DebugComposer} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="DebugPlain" component={DebugPlain} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="DebugRaw" component={DebugRaw} durationInFrames={1} fps={30} width={1080} height={1920} />
  </>
);
