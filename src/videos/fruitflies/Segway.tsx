// "The Man Who Owned Segway Died Riding One" (Jimi Heselden, 2010) —
// Gullak Tales style Short. 193 words, Casper speed 94, 59.328 s, 195.2 WPM,
// last word ends 58.82 s. 7 scenes, 22 beats, hard cuts, word-anchored.
// NOTE: the VO keeps its natural sentence pauses (28 pauses >0.4 s, max
// 0.90 s) — the slower feel, same as Moon Trees v4. Stripping them at
// ~195 WPM would sound rushed, so they stay (see BUILD-NOTES.md).
// Point-to-point: every beat shows exactly what the words say at that moment.
// No title card, no end card, frame 1 mid-action, no intro/like/subscribe
// ask, no summary/moral ending, no watermark.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FPS, TOTAL, SceneId, BeatDef, beatAt, mouthAt, sceneAt, smooth, pop } from "./story";
import { FONT_CSS, FONT_FAMILY } from "./fonts";
import {
  Crewman, Agent, OUTLINE,
} from "./characters";
import {
  AirfieldPlate, ChalkPlate, InteriorPlate, SeaPlate,
} from "./plates";
import {
  SegwayX2, Dog, HescoWall, ShopFront, InquestPaper, CliffPlate,
} from "./props-segway";
import { Abs, ChalkText, Badge, RedX } from "./cards";
import { CaptionOverlay } from "./captions";

/** slow push-in on a plate over the scene (Gullak camera: locked-off + push) */
const PushIn: React.FC<{ dur: number; to?: number; children: React.ReactNode }> = ({ dur, to = 1.06, children }) => {
  const frame = useCurrentFrame();
  const s = 1 + (to - 1) * smooth(frame / dur);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: "50% 55%" }}>
      {children}
    </div>
  );
};

/** Big gold in-scene number on a dark pill. Count-up steps swap over the
 *  first ~18 frames after `delay` (one step every ~3.6 frames). */
const NumberPill: React.FC<{
  text: string;
  steps?: string[];
  lf: number;
  delay?: number;
  size?: number;
  top?: number;
}> = ({ text, steps, lf, delay = 0, size = 100, top = 1200 }) => {
  if (lf < delay) return null;
  const idx = steps ? Math.min(Math.floor((lf - delay) / 3.6), steps.length - 1) : 0;
  const shown = steps ? steps[idx] : text;
  return (
    <Abs left={0} top={top} width={1080}>
      <div style={{ textAlign: "center", transform: `scale(${pop((lf - delay) / 8)})` }}>
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: size,
            color: "#ffd93b",
            backgroundColor: "rgba(10,10,14,0.78)",
            border: `6px solid ${OUTLINE}`,
            borderRadius: 999,
            padding: "20px 48px",
            textShadow: "0 6px 0 rgba(0,0,0,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          {shown}
        </span>
      </div>
    </Abs>
  );
};

/** In-scene subtitle line: cream text on a dark pill so it stays readable
 *  on light plates too (day sky, river, tan floor). */
const Sub: React.FC<{ children: React.ReactNode; top: number; size?: number; strong?: boolean }> = ({ children, top, size = 48, strong = false }) => (
  <Abs left={0} top={top} width={1080}>
    <div style={{ textAlign: "center" }}>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: strong ? 700 : 600,
          fontSize: size,
          lineHeight: 1.35,
          color: "#fdf3d8",
          backgroundColor: "rgba(10,10,14,0.55)",
          borderRadius: 999,
          padding: "12px 36px",
        }}
      >
        {children}
      </span>
    </div>
  </Abs>
);

/** Jimi riding his Segway — chibi rider standing on the platform. */
const Rider: React.FC<{
  left: number; top: number; segW?: number; expression?: "calm" | "happy" | "worried" | "scared" | "think";
  mouth?: "closed" | "open" | "grin"; arm?: "down" | "oneUp" | "bothUp" | "point" | "chin";
  tilt?: number; shiftX?: number;
}> = ({ left, top, segW = 400, expression = "calm", mouth = "closed", arm = "down", tilt = 0, shiftX = 0 }) => {
  const segH = (segW * 460) / 400;
  const riderW = segW * 0.75;
  const riderH = riderW * 1.5;
  // platform top edge sits at 300/460 of the Segway height
  const platY = top + (segH * 300) / 460;
  return (
    <div style={{ position: "absolute", left: left + shiftX, top, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: segW, height: segH }}>
        <SegwayX2 />
      </div>
      <div style={{ position: "absolute", left: (segW - riderW) / 2, top: platY - riderH + 14 - top, width: riderW, height: riderH }}>
        <Crewman shirt="#8a6a3b" skin="#f0c08c" hair="#c8c8c8" expression={expression} mouth={mouth} arm={arm} seed={1} />
      </div>
    </div>
  );
};

/** Gold curved reverse arrow (points left). */
const ReverseArrow: React.FC<{ top: number; left: number }> = ({ top, left }) => (
  <Abs left={left} top={top} width={360} height={140}>
    <svg viewBox="0 0 360 140" width="100%" height="100%" style={{ overflow: "visible" }}>
      <path d="M330,110 Q300,20 150,30 Q60,36 40,80" stroke="#ffd93b" strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d="M78,48 L28,82 L84,104 Z" fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    </svg>
  </Abs>
);

const Scene: React.FC<{ id: SceneId; beat: BeatDef; lf: number; dur: number; t: number }> = ({ id, beat, lf, dur, t }) => {
  const frame = useCurrentFrame();
  const mouth = mouthAt(t);
  const blf = frame - beat.a; // beat-local frame: 0 at every beat cut
  switch (id) {
    case "hook": {
      // H1 rider ECU on the clifftop path | H2 tipping at the edge |
      // H3 Segway in the river | H4 Jimi waving, reversing to be polite.
      // Frame 1 mid-action: Jimi ON the Segway, big, centre.
      const bob = Math.sin(frame * 0.12) * 6;
      if (beat.id === "H4") {
        return (
          <>
            <PushIn dur={dur} to={1.1}><CliffPlate /></PushIn>
            <Abs left={64} top={170}><Badge color="#2f9e44">JUST REVERSING</Badge></Abs>
            <ReverseArrow top={420} left={360} />
            <Abs left={390} top={560 + bob} width={300} height={450}>
              <Crewman shirt="#8a6a3b" skin="#f0c08c" hair="#c8c8c8" expression="happy" mouth={mouth} arm="oneUp" seed={1} />
            </Abs>
            <Abs left={700} top={900} width={320} height={220}>
              <Dog />
            </Abs>
            <Sub top={1440}>only reversing to be polite</Sub>
          </>
        );
      }
      if (beat.id === "H3") {
        // Segway sinking into the river (SeaPlate), splash rings expanding.
        const sinkY = interpolate(blf, [0, 69], [520, 1080]);
        const ring = 40 + blf * 3.2;
        return (
          <>
            <PushIn dur={dur} to={1.08}><SeaPlate /></PushIn>
            <Abs left={340} top={sinkY} width={400} height={460} style={{ opacity: interpolate(blf, [50, 69], [1, 0.4]), transform: `rotate(${interpolate(blf, [0, 69], [-8, -28])}deg)` }}>
              <SegwayX2 />
            </Abs>
            <Abs left={0} top={0} width={1080} height={1920}>
              <svg viewBox="0 0 1080 1920" width="100%" height="100%">
                <ellipse cx={540} cy={1300} rx={ring} ry={ring * 0.32} fill="none" stroke="#bfe6fb" strokeWidth={10} opacity={interpolate(blf, [0, 69], [0.9, 0.2])} />
                <ellipse cx={540} cy={1300} rx={ring * 0.6} ry={ring * 0.2} fill="none" stroke="#ffffff" strokeWidth={8} opacity={interpolate(blf, [0, 69], [0.9, 0.2])} />
              </svg>
            </Abs>
            <Sub top={1440}>into a river.</Sub>
          </>
        );
      }
      if (beat.id === "H2") {
        // Tipping at the cliff edge — rider leans, Segway tilts toward the drop.
        const tilt = interpolate(blf, [0, 69], [-4, -20]);
        return (
          <>
            <PushIn dur={dur} to={1.12}><CliffPlate /></PushIn>
            <Abs left={64} top={170}><Badge color="#e8634a">OFF A CLIFF</Badge></Abs>
            <Rider left={420} top={700 + bob} expression="worried" mouth={mouth} tilt={tilt} />
            <Sub top={1440}>off a cliff…</Sub>
          </>
        );
      }
      return (
        <>
          <PushIn dur={dur}><CliffPlate /></PushIn>
          {lf > 10 && (
            <Abs left={64} top={170}><Badge>2010 • SEGWAY</Badge></Abs>
          )}
          <Rider left={340} top={700 + bob} expression="calm" mouth={mouth} />
          <Sub top={1440}>the owner of the Segway company</Sub>
        </>
      );
    }
    case "setup": {
      // S1 Jimi + Hesco wall | S2 wall big, soldiers | S3 £166 MILLION |
      // S4 Camp Bastion badge.
      if (beat.id === "S4") {
        return (
          <>
            <PushIn dur={dur} to={1.08}><AirfieldPlate /></PushIn>
            <Abs left={64} top={250}><Badge color="#e8634a">CAMP BASTION</Badge></Abs>
            <Abs left={140} top={800} width={800} height={480}>
              <HescoWall />
            </Abs>
            <Abs left={150} top={1250} width={240} height={360}>
              <Crewman shirt="#8a6a3b" skin="#f0c08c" hair="#c8c8c8" expression="happy" mouth={mouth} arm="point" seed={1} />
            </Abs>
            <Sub top={1560}>named after his firm</Sub>
          </>
        );
      }
      if (beat.id === "S3") {
        return (
          <>
            <ChalkPlate />
            <Abs left={64} top={250}><Badge color="#2f9e44">SELF-MADE MILLIONAIRE</Badge></Abs>
            <NumberPill
              text="£166 MILLION"
              steps={["£50 MILLION", "£100 MILLION", "£166 MILLION"]}
              lf={lf} delay={15} size={96} top={620}
            />
            <Abs left={390} top={1050} width={300} height={450}>
              <Crewman shirt="#8a6a3b" skin="#f0c08c" hair="#c8c8c8" expression="happy" mouth={mouth} arm="bothUp" seed={1} />
            </Abs>
          </>
        );
      }
      if (beat.id === "S2") {
        return (
          <>
            <PushIn dur={dur} to={1.1}><AirfieldPlate /></PushIn>
            <Abs left={64} top={250}><Badge>SHIELDS SOLDIERS</Badge></Abs>
            <Abs left={90} top={700} width={900} height={540}>
              <HescoWall />
            </Abs>
            <Sub top={1400}>steel cages filled with sand</Sub>
          </>
        );
      }
      // S1: Jimi intro — coal miner's son + Hesco wall appears.
      return (
        <>
          <AirfieldPlate />
          <Abs left={64} top={250}><Badge color="#2f9e44">JIMI HESELDEN</Badge></Abs>
          <Abs left={150} top={1180} width={240} height={360}>
            <Crewman shirt="#8a6a3b" skin="#f0c08c" hair="#c8c8c8" expression="think" mouth={mouth} arm="point" seed={1} />
          </Abs>
          <Abs left={430} top={950} width={600} height={360} style={{ transform: `scale(${pop(blf / 10)})` }}>
            <HescoWall />
          </Abs>
          <Sub top={1560}>a coal miner's son</Sub>
        </>
      );
    }
    case "buy": {
      // B1 Christmas shopfront | B2 bigger than the internet + 9 MONTHS.
      if (beat.id === "B2") {
        return (
          <>
            <ChalkPlate />
            <Abs left={0} top={380} width={1080}>
              <ChalkText size={84}>BIGGER THAN</ChalkText>
            </Abs>
            <Abs left={0} top={500} width={1080}>
              <ChalkText size={84} color="#ffd93b" delay={4}>THE INTERNET</ChalkText>
            </Abs>
            <Abs left={340} top={700} width={400} height={460}>
              <SegwayX2 />
            </Abs>
            <NumberPill text="9 MONTHS" lf={lf} delay={81} size={100} top={1240} />
          </>
        );
      }
      return (
        <>
          <PushIn dur={dur}><AirfieldPlate /></PushIn>
          <Abs left={64} top={250}><Badge color="#e8634a">CHRISTMAS DAY 2009</Badge></Abs>
          <Abs left={190} top={750} width={700} height={500}>
            <ShopFront />
          </Abs>
          <Abs left={120} top={1250} width={240} height={360}>
            <Crewman shirt="#8a6a3b" skin="#f0c08c" hair="#c8c8c8" expression="happy" mouth={mouth} arm="oneUp" seed={1} />
          </Abs>
          <Sub top={1560}>he bought the Segway company</Sub>
        </>
      );
    }
    case "ride": {
      // R1 riding the off-road Segway | R2 + dog above the Wharfe |
      // R3 the other dog walker approaches.
      const bob = Math.sin(frame * 0.12) * 6;
      if (beat.id === "R3") {
        return (
          <>
            <CliffPlate />
            <Rider left={140} top={700 + bob} expression="calm" mouth={mouth} />
            <Abs left={700} top={950} width={280} height={420}>
              <Agent expression="calm" mouth={mouth} arm="oneUp" />
            </Abs>
            <Abs left={640} top={1180} width={200} height={138}>
              <Dog />
            </Abs>
            <Sub top={1440}>another dog walker came down the path</Sub>
          </>
        );
      }
      if (beat.id === "R2") {
        return (
          <>
            <CliffPlate />
            <Rider left={180} top={700 + bob} expression="calm" mouth={mouth} />
            <Abs left={700} top={900} width={320} height={220}>
              <Dog />
            </Abs>
            <Sub top={1440}>above the River Wharfe, walking his dog</Sub>
          </>
        );
      }
      return (
        <>
          <PushIn dur={dur}><CliffPlate /></PushIn>
          <Abs left={64} top={170}><Badge>26 SEP 2010</Badge></Abs>
          <Rider left={340} top={700 + bob} expression="calm" mouth={mouth} />
          <Sub top={1440}>he rode his off-road Segway</Sub>
        </>
      );
    }
    case "fall": {
      // F1 reversing to let Christie pass | F2 wobble + 42 FEET |
      // F3 down into the river, aged 62.
      if (beat.id === "F3") {
        const sinkY = interpolate(blf, [0, 101], [680, 1240]);
        return (
          <>
            <SeaPlate />
            <Abs left={340} top={sinkY} width={400} height={460} style={{ opacity: interpolate(blf, [70, 101], [1, 0.3]), transform: "rotate(-24deg)" }}>
              <SegwayX2 />
            </Abs>
            <NumberPill text="AGED 62" lf={lf} delay={63} size={100} top={620} />
            <Sub top={1480}>dead at the scene</Sub>
          </>
        );
      }
      if (beat.id === "F2") {
        const tilt = interpolate(blf, [0, 80], [-18, -38]);
        return (
          <>
            <CliffPlate />
            <Rider left={460} top={700} expression="scared" mouth={mouth} tilt={tilt} />
            <NumberPill text="42 FEET" lf={lf} delay={58} size={110} top={1240} />
          </>
        );
      }
      // F1: reversing — rider slides back toward the edge, Christie waves.
      const back = interpolate(blf, [0, 83], [0, -150]);
      return (
        <>
          <CliffPlate />
          <ReverseArrow top={420} left={300} />
          <Rider left={480} top={700} expression="worried" mouth={mouth} shiftX={back} />
          <Abs left={760} top={980} width={260} height={390}>
            <Agent expression="happy" mouth={mouth} arm="oneUp" />
          </Abs>
          <Sub top={1440}>Jimi reversed to let him pass</Sub>
        </>
      );
    }
    case "inquest": {
      // I1 inquest paper + stamp | I2 no fault found | I3 machine killed owner.
      if (beat.id === "I3") {
        return (
          <>
            <ChalkPlate />
            <Abs left={0} top={380} width={1080}>
              <ChalkText size={84}>THE MACHINE KILLED</ChalkText>
            </Abs>
            <Abs left={0} top={500} width={1080}>
              <ChalkText size={84} color="#ffd93b" delay={4}>ITS OWNER</ChalkText>
            </Abs>
            <Abs left={240} top={760} width={300} height={345}>
              <SegwayX2 />
            </Abs>
            <Abs left={640} top={900} width={260} height={390}>
              <Crewman shirt="#8a6a3b" skin="#f0c08c" hair="#c8c8c8" expression="calm" mouth={mouth} arm="chin" seed={1} />
            </Abs>
            <Sub top={1480}>it wasn't even its fault</Sub>
          </>
        );
      }
      if (beat.id === "I2") {
        return (
          <>
            <ChalkPlate />
            <Abs left={0} top={380} width={1080}>
              <ChalkText size={110} color="#ffd93b">NO FAULT</ChalkText>
            </Abs>
            <Abs left={0} top={520} width={1080}>
              <ChalkText size={110} color="#ffd93b" delay={4}>FOUND</ChalkText>
            </Abs>
            <Abs left={340} top={820} width={400} height={460}>
              <SegwayX2 />
            </Abs>
            <Sub top={1440}>the Segway was examined</Sub>
          </>
        );
      }
      return (
        <>
          <InteriorPlate />
          <Abs left={64} top={250}><Badge>THE INQUEST</Badge></Abs>
          <Abs left={190} top={440} width={700} height={490}>
            <InquestPaper />
          </Abs>
          <Abs left={140} top={1150} width={260} height={390}>
            <Agent expression="think" mouth={mouth} arm="chin" />
          </Abs>
          <Sub top={1560}>accidental death</Sub>
        </>
      );
    }
    case "payoff": {
      // P1 bought the company | P2 nine months later, off a cliff |
      // P3 coroner: act of courtesy (final — NO Sub, only the karaoke
      // caption speaks the last words, the Moon Trees v2 fix).
      if (beat.id === "P3") {
        return (
          <>
            <ChalkPlate />
            <Abs left={0} top={420} width={1080}>
              <ChalkText size={100} color="#ffd93b">AN ACT OF</ChalkText>
            </Abs>
            <Abs left={0} top={560} width={1080}>
              <ChalkText size={120} color="#ffd93b" delay={4}>COURTESY</ChalkText>
            </Abs>
            <Abs left={140} top={1150} width={260} height={390}>
              <Crewman shirt="#8a6a3b" skin="#f0c08c" hair="#c8c8c8" expression="happy" mouth={mouth} arm="oneUp" seed={1} />
            </Abs>
            <Abs left={700} top={1250} width={320} height={220}>
              <Dog />
            </Abs>
          </>
        );
      }
      if (beat.id === "P2") {
        return (
          <>
            <CliffPlate />
            <Abs left={64} top={170}><Badge color="#e8634a">9 MONTHS LATER</Badge></Abs>
            <Rider left={480} top={720} segW={320} expression="scared" mouth={mouth} tilt={-25} />
            <Sub top={1440}>it moved him off a cliff</Sub>
          </>
        );
      }
      return (
        <>
          <PushIn dur={dur}><AirfieldPlate /></PushIn>
          <Abs left={64} top={250}><Badge>CHANGE HOW WE MOVE</Badge></Abs>
          <Rider left={340} top={700} expression="happy" mouth={mouth} />
          <Sub top={1480}>he bought the company</Sub>
        </>
      );
    }
    default:
      return null;
  }
};

export const SegwayShort: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const scene = sceneAt(frame);
  const beat = beatAt(frame);
  const lf = frame - scene.a;
  const dur = scene.b - scene.a;
  // Beat camera: a hard reframe at every ~3s beat cut. The transform
  // jumps at the beat boundary (that IS the cut) and holds steady inside
  // the beat. Captions stay OUTSIDE this wrapper so the karaoke pill never
  // jumps. Scale ≥1.08 whenever we translate, so no background shows at
  // the edges (1080×1.08 gives ±43px margin; |tx| ≤ 35, |ty| ≤ 40).
  const cam = beat.cam;
  return (
    <AbsoluteFill style={{ backgroundColor: "#1d2b4a", overflow: "hidden" }}>
      <style>{FONT_CSS}</style>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`,
          transformOrigin: cam.o,
        }}
      >
        <Scene id={scene.id} beat={beat} lf={lf} dur={dur} t={t} />
      </div>
      <CaptionOverlay />
    </AbsoluteFill>
  );
};

export { TOTAL };
