// Matisse Short — "This Painting Hung Upside Down for 47 Days".
// 2D stick figures over a Blender museum plate; karaoke captions one word
// at a time; no title card, no end card. 60.0s @ 30fps (1800 frames).
// 15 scenes + tail hold, ~4s each, every scene has a camera move AND an
// animated element (no static hold >4s). Point-to-point: each frame shows
// exactly what the words say at that second.
//
// PLATE LAYOUT (museum-hall.png, read 25 Nov 19:36): the far wall runs
// y≈700-1070; a framed painting already sits at x≈210-390 and a doorway at
// x≈650-760, so the clear strip is x≈400-640. The hero painting therefore
// sits ON the far wall at left 360, top 720, width 290 (PW) in WIDE/MEDIUM
// scenes — honest museum perspective, visitors bigger in the foreground.
// ECU scenes (introBoat / youseeFlip / reflection) use the BIG painting
// (PB: left 230, top 330, width 620) as a close-up cut-in. The plate's own
// rope barrier + benches stay; no extra SVG rope (it would double).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS, clamp01, mouthAt, sceneAt, smooth } from "./story";
import { CaptionOverlay } from "./captions";
import {
  CalendarPages, CloudFrame, Catalogue, Ladder, Magnifier, MuseumDoors,
  Painting, Phone, StickCritic, StickCurator, StickGuard,
  StickPerson, StickStaff, StickVisitor,
} from "./matisse-figures";

// Painting on the far wall (WIDE/MEDIUM scenes) and as ECU close-up.
const PW = { left: 360, top: 720, width: 290 };
const PB = { left: 230, top: 330, width: 620 };

/** full-frame Blender plate */
const Plate: React.FC<{ src: string }> = ({ src }) => (
  <Img src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
);

/** slow push-in over the scene (camera: locked-off + push) */
const PushIn: React.FC<{ u: number; from?: number; to?: number; origin?: string; children: React.ReactNode }> =
  ({ u, from = 1.02, to = 1.08, origin = "50% 42%", children }) => (
    <div style={{
      position: "absolute", inset: 0,
      transform: `scale(${interpolate(u, [0, 1], [from, to])})`,
      transformOrigin: origin,
    }}>
      {children}
    </div>
  );

function Scene({ frame }: { frame: number }) {
  const t = frame / FPS;
  const s = sceneAt(frame);
  const lf = frame - s.a;
  const len = s.b - s.a;
  const u = clamp01(lf / Math.max(1, len));
  const mouth = mouthAt(t);
  const plate = "plates/museum-hall.png";

  switch (s.id) {
    // S1 (0-137): WIDE — museum hall, the painting hangs UPSIDE DOWN on the
    // far wall, visitors walk past it. Hook: mid-action, no title card.
    // Zoomed in on the far wall so the painting reads at frame 0.
    case "hookMuseum": {
      const walkX = interpolate(lf, [0, len], [-320, 1250]);
      return (
        <PushIn u={smooth(u)} from={1.18} to={1.3} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PW.left} top={PW.top} width={PW.width} />
          <div style={{ position: "absolute", left: walkX, top: 1180, pointerEvents: "none" }}>
            <StickVisitor width={300} expr="neutral" mouth={mouth} bounce bounceAmount={7} />
          </div>
          <div style={{ position: "absolute", left: walkX - 420, top: 1240, pointerEvents: "none" }}>
            <StickPerson width={260} expr="happy" mouth={mouth} shirt="#7a4a21" bounce bounceAmount={6} />
          </div>
          <StickPerson left={120} top={1120} width={280} expr="shocked" mouth={mouth} shirt="#2f6db3" arm="point" bounce />
        </PushIn>
      );
    }
    // S2 (137-224): MEDIUM — curator, critic and the artist's son stare at
    // the upside-down painting and miss it.
    case "hookExperts":
      return (
        <PushIn u={smooth(u)} from={1.15} to={1.24} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PW.left} top={PW.top} width={PW.width} />
          <StickCurator left={120} top={1080} width={300} expr="thinking" mouth={mouth} arm="oneUp" bounce />
          <StickCritic left={430} top={1120} width={290} expr="neutral" mouth={mouth} arm="down" bounce />
          <StickPerson left={740} top={1100} width={290} expr="shocked" mouth={mouth} shirt="#8a5a2b" costume="suit" arm="down" bounce />
        </PushIn>
      );
    // S3 (224-372): MEDIUM — visitors admire the painting; calendar pages
    // keep flipping on the wall (days passing). 4.93s — pages flip continuously.
    case "hookCrowd": {
      const walkX = interpolate(lf, [0, len], [-300, 1150]);
      const flipU = (lf % 30) / 30;
      return (
        <PushIn u={smooth(u)} from={1.08} to={1.16} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PW.left} top={PW.top} width={PW.width} />
          <CalendarPages left={700} top={760} width={160} flipU={flipU} />
          <div style={{ position: "absolute", left: walkX, top: 1180, pointerEvents: "none" }}>
            <StickPerson width={280} expr="happy" mouth={mouth} shirt="#5b3a6e" bounce bounceAmount={7} />
          </div>
          <div style={{ position: "absolute", left: walkX - 400, top: 1240, pointerEvents: "none" }}>
            <StickVisitor width={270} expr="happy" mouth={mouth} bounce bounceAmount={6} />
          </div>
          <StickCurator left={140} top={1100} width={290} expr="thinking" mouth={mouth} arm="oneUp" bounce />
        </PushIn>
      );
    }
    // S4+S5 (372-522): ECU — the painting itself, upside down, fills the
    // frame. 5.0s — slow push-in + a light glint sweeping across mid-scene.
    case "introBoat": {
      const glintX = interpolate(lf, [40, 110], [-300, 1100]);
      return (
        <PushIn u={smooth(u)} from={1.14} to={1.3} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PB.left} top={PB.top} width={PB.width} />
          <div style={{
            position: "absolute", left: glintX, top: 300, width: 120, height: 1100,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
            transform: "rotate(12deg)", pointerEvents: "none",
          }} />
        </PushIn>
      );
    }
    // S6 (522-682): MEDIUM — two staff on ladders hang the painting upside
    // down, Oct 1961. 5.33s — staff hammer (arm animates) + ladder shift.
    case "hang1961": {
      const hammer = Math.sin((lf * Math.PI * 2) / 14) > 0 ? "up" : "down";
      const shift = lf > len / 2 ? 14 : 0;
      return (
        <PushIn u={smooth(u)} from={1.1} to={1.18} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PW.left} top={PW.top} width={PW.width} />
          <Ladder left={300} top={820} width={130} height={380} />
          <Ladder left={640} top={820} width={130} height={380} />
          <div style={{ transform: `translateX(${shift}px)`, position: "absolute", left: 0, top: 0 }}>
            <StickStaff left={250} top={640} width={240} expr="neutral" mouth={mouth} arm={hammer} bounce />
          </div>
          <StickStaff left={590} top={640} width={240} expr="neutral" mouth={mouth} arm="up" bounce flip />
        </PushIn>
      );
    }
    // S7 (682-760): WIDE — the museum doors (over the plate's own doorway)
    // swing open, the crowd streams in.
    case "hangDoors": {
      const openU = smooth(lf / 34);
      const walkX = interpolate(lf, [20, len], [-350, 1150]);
      return (
        <PushIn u={smooth(u)} from={1.05} to={1.12} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PW.left} top={PW.top} width={PW.width} />
          <MuseumDoors left={620} top={790} width={200} height={280} openU={openU} />
          <div style={{ position: "absolute", left: walkX, top: 1200, pointerEvents: "none" }}>
            <StickPerson width={280} expr="happy" mouth={mouth} shirt="#2e8b6e" bounce bounceAmount={7} />
          </div>
          <div style={{ position: "absolute", left: walkX - 380, top: 1260, pointerEvents: "none" }}>
            <StickVisitor width={260} expr="happy" mouth={mouth} bounce bounceAmount={6} />
          </div>
        </PushIn>
      );
    }
    // S8 (760-866): MEDIUM — experts study the painting with magnifiers,
    // like a puzzle.
    case "expertsPuzzle": {
      const magX = 470 + Math.sin((lf * Math.PI * 2) / 40) * 60;
      const magY = 840 + Math.cos((lf * Math.PI * 2) / 40) * 50;
      return (
        <PushIn u={smooth(u)} from={1.12} to={1.2} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PW.left} top={PW.top} width={PW.width} />
          <Magnifier left={magX} top={magY} width={130} rotate={-25} />
          <StickCurator left={130} top={1080} width={300} expr="thinking" mouth={mouth} arm="oneUp" bounce />
          <StickCritic left={700} top={1120} width={290} expr="thinking" mouth={mouth} arm="oneUp" bounce flip />
        </PushIn>
      );
    }
    // S9 (866-997): ECU — the painting ROTATES 180° and back: flipped over
    // it still looks like art.
    case "youseeFlip": {
      const rot = interpolate(lf, [0, 60, len - 10, len], [0, 180, 180, 0]);
      return (
        <PushIn u={smooth(u)} from={1.12} to={1.26} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PB.left} top={PB.top} width={PB.width} rotate={rot} />
        </PushIn>
      );
    }
    // S10 (997-1073): MEDIUM — a cloud picture flips upside down too.
    case "youseeCloud": {
      const rot = interpolate(lf, [10, 50], [0, 180]);
      return (
        <PushIn u={smooth(u)} from={1.06} to={1.14} origin="50% 42%">
          <Plate src={plate} />
          <CloudFrame flipped={rot > 90} left={240} top={480} width={600} />
          <StickPerson left={140} top={1120} width={280} expr="thinking" mouth={mouth} shirt="#2f6db3" arm="oneUp" bounce />
          <StickPerson left={720} top={1140} width={270} expr="shocked" mouth={mouth} shirt="#7a4a21" arm="up" bounce flip />
        </PushIn>
      );
    }
    // S11 (1073-1188): MEDIUM — Genevieve Habert visits three times: three
    // quick cuts, her in a different spot each time, more puzzled each time.
    case "habert123": {
      const visit = lf < 38 ? 0 : lf < 76 ? 1 : 2;
      const exprs: ("neutral" | "thinking" | "worried")[] = ["neutral", "thinking", "worried"];
      const lefts = [150, 420, 700];
      return (
        <PushIn u={smooth(u)} from={1.1} to={1.17} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PW.left} top={PW.top} width={PW.width} />
          <StickVisitor left={lefts[visit]} top={1080} width={300} expr={exprs[visit]} mouth={mouth} arm="oneUp" bounce />
          <Magnifier left={lefts[visit] + 190} top={1180} width={130} rotate={20} />
        </PushIn>
      );
    }
    // S12 (1188-1327): ECU — the reflection is more complicated than the
    // boat: magnifier sweeps the busy reflection, then the simple boat.
    case "reflection": {
      const magY = interpolate(lf, [0, 60, len], [900, 620, 900]);
      const magX = 480 + Math.sin((lf * Math.PI * 2) / 46) * 120;
      return (
        <PushIn u={smooth(u)} from={1.14} to={1.28} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PB.left} top={PB.top} width={PB.width} />
          <Magnifier left={magX} top={magY} width={170} rotate={-20} />
        </PushIn>
      );
    }
    // S13a (1327-1419): MEDIUM — Habert checks the exhibition catalogue,
    // compares it with the wall.
    case "catalogue": {
      const look = lf > 45 ? "up" : "down";
      return (
        <PushIn u={smooth(u)} from={1.1} to={1.17} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PW.left} top={PW.top} width={PW.width} />
          <StickVisitor left={180} top={1080} width={310} expr="worried" mouth={mouth} arm="down" bounce />
          <Catalogue left={150} top={1420} width={380} rotate={look === "up" ? -8 : 4} />
        </PushIn>
      );
    }
    // S13b (1419-1457): MEDIUM — Habert tells the guard; the guard shrugs.
    // 1.27s — one beat, no camera frills.
    case "guard":
      return (
        <PushIn u={smooth(u)} from={1.1} to={1.15} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PW.left} top={PW.top} width={PW.width} />
          <StickVisitor left={150} top={1080} width={300} expr="worried" mouth={mouth} arm="point" bounce />
          <StickGuard left={680} top={1060} width={310} expr="neutral" mouth={mouth} arm="shrug" bounce />
        </PushIn>
      );
    // S14 (1457-1590): MEDIUM — she calls the New York Times (phone), the
    // museum panics and quietly flips the painting right-side up.
    case "phoneFlip": {
      const flipU = smooth((lf - 60) / 45);
      const rot = interpolate(flipU, [0, 1], [0, 180]);
      const phoneOn = lf < 60;
      return (
        <PushIn u={smooth(u)} from={1.1} to={1.17} origin="50% 45%">
          <Plate src={plate} />
          <Painting flipped left={PW.left} top={PW.top} width={PW.width} rotate={rot} />
          {phoneOn && <Phone left={330} top={1250} width={380} />}
          {phoneOn && <StickVisitor left={150} top={1080} width={300} expr="worried" mouth={mouth} arm="oneUp" bounce />}
          {!phoneOn && <StickStaff left={180} top={1080} width={280} expr="shocked" mouth={mouth} arm="up" bounce />}
          {!phoneOn && <StickCurator left={660} top={1080} width={290} expr="shocked" mouth={mouth} arm="bothUp" bounce />}
        </PushIn>
      );
    }
    // S15 (1590-1723): WIDE — the twist: the show had already closed. Empty
    // hall, lights dimmed (plate's own rope barrier now reads as "closed"),
    // the painting right-side up.
    case "twistClosed":
      return (
        <PushIn u={smooth(u)} from={1.05} to={1.1} origin="50% 45%">
          <Plate src={plate} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,20,0.28)", pointerEvents: "none" }} />
          <Painting flipped={false} left={PW.left} top={PW.top} width={PW.width} />
        </PushIn>
      );
    // tailHold (1723-1800): hold the closed-hall frame, bed only.
    case "tailHold":
      return (
        <PushIn u={1} from={1.1} to={1.1}>
          <Plate src={plate} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,20,0.28)", pointerEvents: "none" }} />
          <Painting flipped={false} left={PW.left} top={PW.top} width={PW.width} />
        </PushIn>
      );
    default:
      return null;
  }
}

export function MatisseShort() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ width: 1080, height: 1920, background: "#101018", overflow: "hidden" }}>
      <Scene frame={frame} />
      <CaptionOverlay />
    </AbsoluteFill>
  );
}
