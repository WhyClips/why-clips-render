// "The Man Who Sued Himself — Robert Lee Brock, 1995" — Gullak Tales style Short.
// v1: 196-word script, Casper VO speed 92 stretched to 59.385s (200.0 WPM),
// 21 beats re-timed to the Whisper token times, Subs and number-pill anchors
// re-aligned to the new token starts.
// Hard cuts, chibi SVG cut-out cast, flat plates, infographic number pills,
// bottom-centre karaoke captions, Rhubarb lip-sync.
// Point-to-point: every beat shows exactly what the words say at that moment.
// No title card, no end card, frame 1 mid-action, no intro/like/subscribe
// ask, no summary/moral ending, no watermark.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FPS, TOTAL, SceneId, BeatDef, beatAt, mouthAt, sceneAt, smooth, pop } from "./story";
import { FONT_CSS, FONT_FAMILY } from "./fonts";
import {
  Chibi, CastProps, Agent, OUTLINE,
} from "./characters";
import {
  ChalkPlate, InteriorPlate,
} from "./plates";
import {
  PrisonPlate, CourtPlate, PrisonBars, HandwrittenLetter, LetterStack,
  MirrorFrame, Gavel, MoneyBag, Statehouse, Bottle, CalendarCard, Handcuffs,
} from "./props-sued";
import { Abs, ChalkText, Badge, RedX } from "./cards";
import { CaptionOverlay } from "./captions";

/** Brock — the prisoner: orange jumpsuit, dark hair, chibi cut-out. */
const Brock: React.FC<CastProps> = (p) => (
  <Chibi
    hat="none"
    hairStyle="side"
    hair="#3a3a3a"
    skin="#f0c08c"
    jacket="#e8634a"
    jacketDark="#c0392b"
    trousers="#c0392b"
    {...p}
  />
);

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
 *  on light plates too. */
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

const Scene: React.FC<{ id: SceneId; beat: BeatDef; lf: number; dur: number; t: number }> = ({ id, beat, lf, dur, t }) => {
  const frame = useCurrentFrame();
  const mouth = mouthAt(t);
  const blf = frame - beat.a; // beat-local frame: 0 at every beat cut
  switch (id) {
    case "hook": {
      // H1: prison cell ECU, Brock behind bars | H2: mirror gag, Brock vs his
      // own reflection | H3: mirror + $5 MILLION count-up (pops on "five" f182).
      // Frame 1 mid-action: Brock behind bars, big, centre.
      if (beat.id === "H3") {
        return (
          <>
            <PushIn dur={dur} to={1.1}><ChalkPlate /></PushIn>
            <Abs left={90} top={900} width={300} height={450}>
              <Brock expression="worried" mouth={mouth} arm="point" seed={1} />
            </Abs>
            <Abs left={620} top={700} width={340} height={595}>
              <MirrorFrame />
            </Abs>
            <Abs left={645} top={760} width={290} height={435}>
              <Brock expression="worried" mouth={mouth} arm="point" seed={2} flip />
            </Abs>
            <NumberPill
              text="$5 MILLION"
              steps={["$1 MILLION", "$2 MILLION", "$3 MILLION", "$4 MILLION", "$5 MILLION"]}
              lf={lf} delay={182} size={96} top={1240}
            />
            <Sub top={1440}>he demanded five million dollars</Sub>
          </>
        );
      }
      if (beat.id === "H2") {
        return (
          <>
            <ChalkPlate />
            <Abs left={90} top={900} width={300} height={450}>
              <Brock expression="worried" mouth={mouth} arm="point" seed={1} />
            </Abs>
            <Abs left={620} top={700} width={340} height={595}>
              <MirrorFrame />
            </Abs>
            <Abs left={645} top={760} width={290} height={435}>
              <Brock expression="worried" mouth={mouth} arm="point" seed={2} flip />
            </Abs>
            <Sub top={1440}>sued the one man who ruined his life</Sub>
          </>
        );
      }
      return (
        <>
          <PushIn dur={dur}><PrisonPlate /></PushIn>
          <Abs left={390} top={900} width={300} height={450}>
            <Brock expression="worried" mouth={mouth} arm="down" seed={1} />
          </Abs>
          <Abs left={0} top={0} width={1080} height={1920}>
            <PrisonBars />
          </Abs>
          {lf > 10 && (
            <Abs left={64} top={170}><Badge>1995 • VIRGINIA</Badge></Abs>
          )}
          <Sub top={1440}>In 1995, a prisoner in Virginia</Sub>
        </>
      );
    }
    case "prison": {
      // P1 23 YEARS (pill pops on "23" f266) | P2 thinking + gavel |
      // P3 Brock vs Brock in court | P4 NO LAWYER / NO HELP chalk |
      // P5 pen + 7 PAGES (pill pops on "seven" f604).
      if (beat.id === "P5") {
        return (
          <>
            <InteriorPlate />
            <Abs left={290} top={640} width={500} height={300}>
              <LetterStack />
            </Abs>
            <Abs left={150} top={1150} width={260} height={390}>
              <Brock expression="think" mouth={mouth} arm="point" seed={2} />
            </Abs>
            <NumberPill text="7 PAGES" lf={lf} delay={368} size={88} top={1000} />
            <Sub top={1480}>just a pen, seven pages</Sub>
          </>
        );
      }
      if (beat.id === "P4") {
        return (
          <>
            <ChalkPlate />
            <Abs left={0} top={380} width={1080}>
              <ChalkText size={110} delay={521}>NO LAWYER</ChalkText>
            </Abs>
            <Abs left={0} top={540} width={1080}>
              <ChalkText size={110} color="#ffd93b" delay={550}>NO HELP</ChalkText>
            </Abs>
            <Abs left={390} top={1050} width={300} height={450}>
              <Brock expression="worried" mouth={mouth} arm="bothUp" seed={1} />
            </Abs>
          </>
        );
      }
      if (beat.id === "P3") {
        return (
          <>
            <CourtPlate />
            <Abs left={140} top={950} width={260} height={390}>
              <Brock expression="worried" mouth={mouth} arm="point" seed={1} />
            </Abs>
            <Abs left={680} top={950} width={260} height={390}>
              <Brock expression="worried" mouth={mouth} arm="point" seed={2} flip />
            </Abs>
            <Sub top={1480}>the only man he could blame</Sub>
          </>
        );
      }
      if (beat.id === "P2") {
        return (
          <>
            <InteriorPlate />
            <Abs left={650} top={950} width={300} height={450}>
              <Brock expression="think" mouth={mouth} arm="chin" seed={1} />
            </Abs>
            <Abs left={150} top={1150} width={220} height={147} style={{ transform: `scale(${pop(blf / 8)})` }}>
              <Gavel />
            </Abs>
            <Sub top={1480}>someone had to pay</Sub>
          </>
        );
      }
      // P1
      return (
        <>
          <PushIn dur={dur}><PrisonPlate /></PushIn>
          <Abs left={390} top={950} width={300} height={450}>
            <Brock expression="worried" mouth={mouth} arm="down" seed={1} />
          </Abs>
          <Abs left={0} top={0} width={1080} height={1920}>
            <PrisonBars />
          </Abs>
          <NumberPill text="23 YEARS" lf={lf} delay={30} size={104} top={620} />
          <Sub top={1480}>serving 23 years</Sub>
        </>
      );
    }
    case "letter": {
      // L1 big handwritten letter | L2 calendar 1 JULY 1993 + bottle |
      // L3 cracked mirror, broke his own beliefs | L4 arrest, handcuffs pop
      // at f998 ("arrest"), cell bars.
      if (beat.id === "L4") {
        return (
          <>
            <PrisonPlate />
            <Abs left={390} top={950} width={300} height={450}>
              <Brock expression="scared" mouth={mouth} arm="bothUp" seed={1} />
            </Abs>
            <Abs left={0} top={0} width={1080} height={1920}>
              <PrisonBars />
            </Abs>
            {lf > 331 && (
              <Abs left={340} top={1150} width={400} height={200} style={{ transform: `scale(${pop((lf - 331) / 8)})` }}>
                <Handcuffs />
              </Abs>
            )}
            <Sub top={1480}>led straight to his prison cell</Sub>
          </>
        );
      }
      if (beat.id === "L3") {
        return (
          <>
            <ChalkPlate />
            <Abs left={180} top={500} width={340} height={595}>
              <MirrorFrame />
            </Abs>
            <Abs left={205} top={560} width={290} height={435}>
              <Brock expression="scared" mouth={mouth} arm="down" seed={2} flip />
            </Abs>
            <Abs left={300} top={700} width={200} height={200}>
              <RedX size={200} delay={857} />
            </Abs>
            <Abs left={700} top={1000} width={260} height={390}>
              <Brock expression="worried" mouth={mouth} arm="chin" seed={1} />
            </Abs>
            <Sub top={1480}>he broke his own beliefs</Sub>
          </>
        );
      }
      if (beat.id === "L2") {
        return (
          <>
            <ChalkPlate />
            <Abs left={290} top={480} width={500} height={420}>
              <CalendarCard />
            </Abs>
            <Abs left={60} top={980} width={180} height={378}>
              <Bottle />
            </Abs>
            <Abs left={820} top={960} width={260} height={390}>
              <Brock expression="worried" mouth={mouth} arm="down" seed={1} />
            </Abs>
            <NumberPill text="1 JULY 1993" lf={lf} delay={97} size={76} top={1300} />
            <Sub top={1560}>on the 1st of July, 1993</Sub>
          </>
        );
      }
      // L1
      return (
        <>
          <InteriorPlate />
          <Abs left={340} top={420} width={400} height={512}>
            <HandwrittenLetter />
          </Abs>
          <Abs left={720} top={1000} width={260} height={390}>
            <Brock expression="think" mouth={mouth} arm="point" seed={1} />
          </Abs>
          <Sub top={1480}>a seven-page handwritten letter</Sub>
        </>
      );
    }
    case "demand": {
      // D1 (single beat, 103f): giant $5,000,000 card pops on "five" f1065,
      // Brock pointing at himself + his mirror self.
      return (
        <>
          <ChalkPlate />
          <NumberPill text="$5,000,000" lf={lf} delay={14} size={96} top={700} />
          <Abs left={140} top={1000} width={280} height={420}>
            <Brock expression="happy" mouth={mouth} arm="point" seed={1} />
          </Abs>
          <Abs left={660} top={1000} width={280} height={420}>
            <Brock expression="happy" mouth={mouth} arm="point" seed={2} flip />
          </Abs>
          <Sub top={1480}>five million — from himself</Sub>
        </>
      );
    }
    case "state": {
      // S1 You see, one problem | S2 no job, no income ($0) |
      // S3 statehouse pays the $5M | S4 promised to pay it back.
      if (beat.id === "S4") {
        return (
          <>
            <InteriorPlate />
            {lf > 10 && (
              <Abs left={64} top={250}><Badge color="#2f9e44">AFTER RELEASE</Badge></Abs>
            )}
            <Abs left={650} top={950} width={300} height={450}>
              <Brock expression="happy" mouth={mouth} arm="point" seed={1} />
            </Abs>
            <Sub top={1480}>I'll pay it back after release</Sub>
          </>
        );
      }
      if (beat.id === "S3") {
        return (
          <>
            <ChalkPlate />
            <Abs left={190} top={480} width={700} height={420}>
              <Statehouse />
            </Abs>
            <Abs left={700} top={1000} width={300} height={315}>
              <MoneyBag />
            </Abs>
            <Abs left={140} top={1000} width={260} height={390}>
              <Brock expression="happy" mouth={mouth} arm="oneUp" seed={1} />
            </Abs>
            <Sub top={1480}>Virginia — you pay the five million</Sub>
          </>
        );
      }
      if (beat.id === "S2") {
        return (
          <>
            <InteriorPlate />
            <Abs left={0} top={420} width={1080}>
              <ChalkText size={150} color="#ffd93b" delay={1248}>$0</ChalkText>
            </Abs>
            <Abs left={650} top={950} width={300} height={450}>
              <Brock expression="worried" mouth={mouth} arm="bothUp" seed={1} />
            </Abs>
            <Sub top={1480}>no job, no income</Sub>
          </>
        );
      }
      // S1
      return (
        <>
          <InteriorPlate />
          <Abs left={650} top={950} width={300} height={450}>
            <Brock expression="worried" mouth={mouth} arm="bothUp" seed={1} />
          </Abs>
          <Sub top={1480}>You see — one problem</Sub>
        </>
      );
    }
    case "judge": {
      // J1 judge reads the case | J2 TOTALLY LUDICROUS + gavel slam |
      // J3 praise — INNOVATIVE APPROACH (no Sub, karaoke only) |
      // J4 final hold on the praise.
      if (beat.id === "J4" || beat.id === "J3") {
        return (
          <>
            <CourtPlate />
            <Abs left={0} top={380} width={1080}>
              <ChalkText size={100} color="#ffd93b" delay={1715}>INNOVATIVE</ChalkText>
            </Abs>
            <Abs left={0} top={500} width={1080}>
              <ChalkText size={100} color="#ffd93b" delay={1715}>APPROACH</ChalkText>
            </Abs>
            <Abs left={390} top={700} width={300} height={450}>
              <Agent expression="happy" mouth={mouth} arm="bothUp" />
            </Abs>
            <Abs left={120} top={1100} width={260} height={390}>
              <Brock expression="happy" mouth={mouth} arm="oneUp" seed={1} />
            </Abs>
          </>
        );
      }
      if (beat.id === "J2") {
        return (
          <>
            <CourtPlate />
            <Abs left={0} top={380} width={1080}>
              <ChalkText size={110} delay={1625}>TOTALLY</ChalkText>
            </Abs>
            <Abs left={0} top={520} width={1080}>
              <ChalkText size={110} color="#ffd93b" delay={1625}>LUDICROUS</ChalkText>
            </Abs>
            <Abs left={390} top={700} width={300} height={450}>
              <Agent expression="neutral" mouth={mouth} arm="bothUp" />
            </Abs>
            <Abs left={640} top={900} width={300} height={200}>
              <Gavel />
            </Abs>
            <Sub top={1480}>calling it totally ludicrous</Sub>
          </>
        );
      }
      // J1
      return (
        <>
          <CourtPlate />
          {lf > 10 && (
            <Abs left={320} top={170}><Badge>JUDGE REBECCA BEACH SMITH</Badge></Abs>
          )}
          <Abs left={390} top={600} width={300} height={450}>
            <Agent expression="think" mouth={mouth} arm="chin" />
          </Abs>
          <Abs left={760} top={1000} width={260} height={390}>
            <Brock expression="worried" mouth={mouth} arm="down" seed={1} />
          </Abs>
          <Sub top={1480}>the judge read it all</Sub>
        </>
      );
    }
    default:
      return null;
  }
};

export const SuedHimselfShort: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const scene = sceneAt(frame);
  const beat = beatAt(frame);
  const lf = frame - scene.a;
  const dur = scene.b - scene.a;
  // Beat camera: a hard reframe at every ~3s beat cut (v3 pattern). The
  // transform jumps at the beat boundary (that IS the cut) and holds steady
  // inside the beat. Captions stay OUTSIDE this wrapper so the karaoke pill
  // never jumps. Scale ≥1.08 whenever we translate, so no background shows
  // at the edges (1080×1.08 gives ±43px margin; |tx| ≤ 35, |ty| ≤ 40).
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
