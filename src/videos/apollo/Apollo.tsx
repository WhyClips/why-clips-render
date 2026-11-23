// "The Apollo 11 Crew's Life Insurance Was Their Own Autographs" — Gullak Tales style Short.
// 16 setups, hard cuts, chibi SVG cut-out cast, low-poly plates,
// infographic cards, top captions, inset-clip device, Rhubarb lip-sync.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FPS, TOTAL, SceneId, mouthAt, sceneAt, smooth, pop } from "./story";
import { FONT_CSS, FONT_FAMILY } from "./fonts";
import {
  Armstrong, Aldrin, Collins, ArmstrongShirt, AldrinShirt, CollinsShirt,
  Agent, Friend, OUTLINE,
} from "./characters";
import {
  SpacePlate, LaunchPadPlate, QuarantinePlate, MoonPlate, SeaPlate,
  InteriorPlate, ChalkPlate,
} from "./plates";
import {
  SaturnRocket, Envelope, EnvelopeStack, PostmarkStamp, Capsule, Gavel, Lightbulb,
} from "./props";
import { Abs, ChalkText, Badge, SpeechBubble, InsetClip, RedX } from "./cards";
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

/** simple background crowd figure (flat, no detail) */
const CrowdFigure: React.FC<{ color: string; shirt: string }> = ({ color, shirt }) => (
  <svg viewBox="0 0 120 220" width="100%" height="100%">
    <ellipse cx={60} cy={208} rx={44} ry={8} fill="#000" opacity={0.12} />
    <path d="M30,210 L36,130 Q60,118 84,130 L90,210 Z" fill={shirt} stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={60} cy={88} r={42} fill={color} stroke={OUTLINE} strokeWidth={6} />
    <circle cx={46} cy={84} r={4} fill={OUTLINE} />
    <circle cx={74} cy={84} r={4} fill={OUTLINE} />
    <path d="M50,102 Q60,108 70,102" fill="none" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/** name label pill under an astronaut */
const NameTag: React.FC<{ name: string; color: string }> = ({ name, color }) => (
  <div
    style={{
      backgroundColor: color,
      border: `4px solid ${OUTLINE}`,
      borderRadius: 999,
      padding: "10px 22px",
      textAlign: "center",
    }}
  >
    <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 34, color: "#fff", letterSpacing: 1 }}>
      {name}
    </span>
  </div>
);

/** mailbag prop */
const Mailbag: React.FC = () => (
  <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: "visible" }}>
    <path d="M60,90 Q60,40 150,40 Q240,40 240,90 L260,250 Q260,280 230,280 L70,280 Q40,280 40,250 Z" fill="#8a6a3b" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    <path d="M60,110 L240,110" stroke={OUTLINE} strokeWidth={5} />
    <path d="M100,40 Q100,10 150,10 Q200,10 200,40" fill="none" stroke={OUTLINE} strokeWidth={7} strokeLinecap="round" />
    <rect x={110} y={150} width={80} height={60} rx={10} fill="#f5f5f0" stroke={OUTLINE} strokeWidth={5} />
    <path d="M150,158 L130,178 L150,198 L170,178 Z" fill="#e63b2e" stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
    <circle cx={150} cy={130} r={10} fill="#ffd93b" stroke={OUTLINE} strokeWidth={4} />
  </svg>
);

/** graduation cap prop (college) */
const GradCap: React.FC = () => (
  <svg viewBox="0 0 300 200" width="100%" height="100%" style={{ overflow: "visible" }}>
    <path d="M150,20 L280,80 L150,140 L20,80 Z" fill="#1d2b4a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    <path d="M70,110 L70,160 Q150,200 230,160 L230,110 L150,140 Z" fill="#2b3a5a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    <path d="M280,80 L280,140" stroke="#ffd93b" strokeWidth={6} strokeLinecap="round" />
    <circle cx={280} cy={152} r={12} fill="#ffd93b" stroke={OUTLINE} strokeWidth={4} />
  </svg>
);

/** bill / invoice prop */
const Bill: React.FC = () => (
  <svg viewBox="0 0 200 260" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={10} y={10} width={180} height={240} rx={12} fill="#fff" stroke={OUTLINE} strokeWidth={6} />
    <rect x={30} y={30} width={90} height={20} rx={10} fill="#e8634a" />
    <rect x={30} y={70} width={140} height={12} rx={6} fill="#c9c9c9" />
    <rect x={30} y={96} width={140} height={12} rx={6} fill="#c9c9c9" />
    <rect x={30} y={122} width={100} height={12} rx={6} fill="#c9c9c9" />
    <text x={100} y={210} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={64} fill="#e63b2e">$</text>
  </svg>
);

const Scene: React.FC<{ id: SceneId; lf: number; dur: number; t: number }> = ({ id, lf, dur, t }) => {
  const frame = useCurrentFrame();
  const mouth = mouthAt(t);
  switch (id) {
    case "hook": {
      // rocket flies across the TOP of the frame toward the Moon; the big
      // text sits below its path so they never overlap
      const rocketX = interpolate(lf, [0, dur], [-140, 700]);
      const rocketY = interpolate(lf, [0, dur], [1150, 250]);
      return (
        <>
          <SpacePlate />
          <Abs left={rocketX} top={rocketY} width={170} height={352} style={{ transform: "rotate(24deg)" }}>
            <SaturnRocket />
          </Abs>
          {lf > 55 && (
            <Abs left={0} top={1050} width={1080}>
              <ChalkText size={128} color="#ff7b54" delay={55}>NO LIFE INSURANCE</ChalkText>
            </Abs>
          )}
          {lf > 90 && (
            <Abs left={0} top={1350} width={1080}>
              <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 48, color: "#fff", textAlign: "center", opacity: 0.9 }}>
                three men flew to the Moon…
              </div>
            </Abs>
          )}
        </>
      );
    }
    case "crew1969":
      return (
        <>
          <PushIn dur={dur}><LaunchPadPlate /></PushIn>
          <Abs left={64} top={250}><Badge>1969</Badge></Abs>
          {/* three astronauts in a row */}
          <Abs left={70} top={1150} width={280} height={420}>
            <Armstrong expression="happy" mouth={mouth} arm="oneUp" seed={1} />
          </Abs>
          <Abs left={400} top={1150} width={280} height={420}>
            <Aldrin expression="calm" mouth="closed" seed={2} />
          </Abs>
          <Abs left={730} top={1150} width={280} height={420}>
            <Collins expression="happy" mouth="closed" arm="oneUp" seed={3} />
          </Abs>
          <Abs left={60} top={1590} width={300}><NameTag name="ARMSTRONG" color="#e8634a" /></Abs>
          <Abs left={390} top={1590} width={300}><NameTag name="ALDRIN" color="#4a6fa5" /></Abs>
          <Abs left={720} top={1590} width={300}><NameTag name="COLLINS" color="#2f9e44" /></Abs>
        </>
      );
    case "danger":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={380} width={1080}>
            <ChalkText size={170}>MOST</ChalkText>
          </Abs>
          <Abs left={0} top={580} width={1080}>
            <ChalkText size={150} delay={4}>DANGEROUS</ChalkText>
          </Abs>
          <Abs left={0} top={820} width={1080}>
            <ChalkText size={100} color="#ffd93b" delay={8}>TRIP IN HISTORY</ChalkText>
          </Abs>
          <Abs left={440} top={1120} width={200} height={414} style={{ transform: `rotate(${Math.sin(frame * 0.4) * 4}deg)` }}>
            <SaturnRocket />
          </Abs>
        </>
      );
    case "insurersNo": {
      const no1 = lf > 8;
      const no2 = lf > 70;
      const no3 = lf > 130;
      return (
        <>
          <InteriorPlate />
          <Abs left={64} top={250}><Badge color="#e8634a">THE INSURERS</Badge></Abs>
          <Abs left={330} top={880} width={420} height={630} style={{ transform: `rotate(${Math.sin(frame * 0.35) * 3}deg)` }}>
            <Agent expression="neutral" mouth={mouth} arm="down" />
          </Abs>
          {no1 && (
            <Abs left={240} top={430} width={600}>
              <SpeechBubble size={88} delay={8}>NO!</SpeechBubble>
            </Abs>
          )}
          {no2 && (
            <Abs left={0} top={1560} width={1080}>
              <div style={{ textAlign: "center", transform: `scale(${pop((lf - 70) / 8)})` }}>
                <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 76, color: "#e63b2e" }}>
                  TOO RISKY
                </span>
              </div>
            </Abs>
          )}
          {no3 && (
            <Abs left={0} top={1700} width={1080}>
              <div style={{ textAlign: "center", transform: `scale(${pop((lf - 130) / 8)})` }}>
                <span
                  style={{
                    fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 56, color: "#fff",
                    backgroundColor: "#1d2b4a", border: `5px solid ${OUTLINE}`,
                    borderRadius: 999, padding: "16px 44px",
                  }}
                >
                  NO POLICY, AT ANY PRICE
                </span>
              </div>
            </Abs>
          )}
        </>
      );
    }
    case "noSafetyNet":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={380} width={1080}>
            <ChalkText size={280} color="#ff7b54">$0</ChalkText>
          </Abs>
          <Abs left={0} top={720} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#fff", textAlign: "center" }}>
              NO PAYOUT WAITING
            </div>
          </Abs>
          <Abs left={90} top={1150} width={260} height={390}>
            <Armstrong expression="worried" mouth={mouth} seed={1} />
          </Abs>
          <Abs left={410} top={1150} width={260} height={390}>
            <Aldrin expression="worried" mouth="closed" seed={2} />
          </Abs>
          <Abs left={730} top={1150} width={260} height={390}>
            <Collins expression="worried" mouth="closed" seed={3} />
          </Abs>
          <Abs left={0} top={1620} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 44, color: "#fdf3d8", textAlign: "center", opacity: 0.85 }}>
              no safety net at all…
            </div>
          </Abs>
        </>
      );
    case "plan":
      return (
        <>
          <QuarantinePlate />
          {/* QUARANTINE text on the wall sign (same as signing scene) */}
          <Abs left={100} top={270} width={400} height={120}>
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 52, color: "#20242b", letterSpacing: 2 }}>
                QUARANTINE
              </span>
            </div>
          </Abs>
          <Abs left={440} top={420} width={200} height={250} style={{ transform: `scale(${pop(lf / 8)})` }}>
            <Lightbulb />
          </Abs>
          <Abs left={0} top={760} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 10) / 8)})` }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 84, color: "#fff",
                  backgroundColor: "#2f9e44", border: `6px solid ${OUTLINE}`,
                  borderRadius: 999, padding: "22px 52px",
                }}
              >
                THEIR OWN INSURANCE
              </span>
            </div>
          </Abs>
          <Abs left={340} top={1080} width={400} height={600}>
            <ArmstrongShirt expression="happy" mouth={mouth} arm="oneUp" />
          </Abs>
        </>
      );
    case "signing": {
      const count = Math.min(300, Math.floor(lf * 3.2));
      return (
        <>
          <QuarantinePlate />
          {/* QUARANTINE text on the wall sign */}
          <Abs left={100} top={270} width={400} height={120}>
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 52, color: "#20242b", letterSpacing: 2 }}>
                QUARANTINE
              </span>
            </div>
          </Abs>
          <Abs left={70} top={900} width={290} height={435}>
            <ArmstrongShirt expression="think" mouth={mouth} arm="down" seed={1} />
          </Abs>
          <Abs left={395} top={900} width={290} height={435}>
            <AldrinShirt expression="think" mouth="closed" arm="down" seed={2} />
          </Abs>
          <Abs left={720} top={900} width={290} height={435}>
            <CollinsShirt expression="think" mouth="closed" arm="down" seed={3} />
          </Abs>
          {/* table */}
          <Abs left={60} top={1400} width={960} height={30} style={{ backgroundColor: "#8a6a3b", border: `5px solid ${OUTLINE}`, borderRadius: 12 }}><div /></Abs>
          <Abs left={120} top={1430} width={22} height={200} style={{ backgroundColor: "#6b4f2a" }}><div /></Abs>
          <Abs left={940} top={1430} width={22} height={200} style={{ backgroundColor: "#6b4f2a" }}><div /></Abs>
          <Abs left={330} top={1220} width={420} height={300}>
            <EnvelopeStack />
          </Abs>
          <Abs left={0} top={1640} width={1080}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 96, color: "#e8634a" }}>
                {count}+
              </span>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 52, color: "#20242b" }}>
                {" "}envelopes… by hand!
              </span>
            </div>
          </Abs>
        </>
      );
    }
    case "friend":
      return (
        <>
          <PushIn dur={dur}><LaunchPadPlate /></PushIn>
          <Abs left={64} top={250}><Badge>A TRUSTED FRIEND</Badge></Abs>
          <Abs left={300} top={900} width={480} height={720}>
            <Friend expression="happy" mouth={mouth} arm="oneUp" />
          </Abs>
          <Abs left={640} top={1280} width={330} height={330}>
            <Mailbag />
          </Abs>
          <Abs left={120} top={1640} width={400} height={286}>
            <EnvelopeStack />
          </Abs>
        </>
      );
    case "postmark": {
      const showSecond = lf >= 55;
      return (
        <>
          <ChalkPlate />
          <Abs left={140} top={380} width={360} height={360} style={{ transform: `scale(${pop(lf / 8)}) rotate(-8deg)` }}>
            <PostmarkStamp date="JUL 16 1969" />
          </Abs>
          <Abs left={580} top={380} width={360} height={360} style={{ transform: `scale(${showSecond ? pop((lf - 55) / 8) : 0}) rotate(8deg)`, opacity: showSecond ? 1 : 0 }}>
            <PostmarkStamp date="JUL 20 1969" />
          </Abs>
          <Abs left={140} top={780} width={360}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 44, color: "#ffd93b", textAlign: "center" }}>
              LAUNCH DAY
            </div>
          </Abs>
          {showSecond && (
            <Abs left={580} top={780} width={360}>
              <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 44, color: "#ffd93b", textAlign: "center" }}>
                LANDING DAY
              </div>
            </Abs>
          )}
          <Abs left={240} top={1080} width={600} height={390}>
            <Envelope stamp="JUL 16 1969" />
          </Abs>
          <Abs left={0} top={1560} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 46, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              stamped at the launch site
            </div>
          </Abs>
        </>
      );
    }
    case "families":
      return (
        <>
          <InteriorPlate />
          <Abs left={64} top={250}><Badge>FOR THE FAMILIES</Badge></Abs>
          <Abs left={120} top={900} width={340} height={510}>
            <Friend expression="happy" mouth={mouth} arm="point" />
          </Abs>
          <Abs left={540} top={1000} width={200} height={367}>
            <CrowdFigure color="#f0c08c" shirt="#e8634a" />
          </Abs>
          <Abs left={780} top={1040} width={160} height={293}>
            <CrowdFigure color="#eab886" shirt="#4a6fa5" />
          </Abs>
          <Abs left={400} top={1180} width={260} height={169}>
            <Envelope stamp="JUL 20 1969" />
          </Abs>
          <Abs left={0} top={1560} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 56, color: "#20242b", textAlign: "center" }}>
              just in case they never came home
            </div>
          </Abs>
        </>
      );
    case "deal": {
      const showBills = lf > 18;
      const showCollege = lf > 85;
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={300} width={1080}>
            <ChalkText size={170}>THE DEAL</ChalkText>
          </Abs>
          {showBills && (
            <>
              <Abs left={140} top={620} width={240} height={312} style={{ transform: `scale(${pop((lf - 18) / 8)})` }}>
                <Bill />
              </Abs>
              <Abs left={420} top={720} width={560}>
                <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#fff" }}>
                  pay the bills
                </div>
              </Abs>
            </>
          )}
          {showCollege && (
            <>
              <Abs left={140} top={1040} width={280} height={187} style={{ transform: `scale(${pop((lf - 85) / 8)})` }}>
                <GradCap />
              </Abs>
              <Abs left={460} top={1090} width={520}>
                <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#ffd93b" }}>
                  kids’ college
                </div>
              </Abs>
            </>
          )}
          <Abs left={300} top={1380} width={480} height={343}>
            <EnvelopeStack />
          </Abs>
        </>
      );
    }
    case "youSee": {
      const showPriceless = lf > 100;
      return (
        <>
          <PushIn dur={dur} to={1.08}><MoonPlate /></PushIn>
          <Abs left={140} top={420} width={800} height={520}>
            <Envelope stamp="JUL 20 1969" />
          </Abs>
          <Abs left={120} top={1080} width={300} height={450}>
            <Armstrong expression="happy" mouth={mouth} arm="oneUp" />
          </Abs>
          <Abs left={500} top={1180} width={440}>
            <SpeechBubble size={48} delay={10} tail="left">signed by all three!</SpeechBubble>
          </Abs>
          {showPriceless && (
            <Abs left={0} top={1620} width={1080}>
              <div style={{ textAlign: "center", transform: `scale(${pop((lf - 100) / 8)})` }}>
                <span
                  style={{
                    fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 96, color: "#ffd93b",
                    textShadow: "0 6px 0 rgba(0,0,0,0.4)",
                  }}
                >
                  PRICELESS
                </span>
              </div>
            </Abs>
          )}
        </>
      );
    }
    case "homeSafe":
      return (
        <>
          <SeaPlate />
          <Abs left={290} top={420} width={500} height={500}>
            <Capsule />
          </Abs>
          <Abs left={0} top={1180} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 8) / 8)})` }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 84, color: "#fff",
                  backgroundColor: "#2f9e44", border: `6px solid ${OUTLINE}`,
                  borderRadius: 999, padding: "22px 52px",
                }}
              >
                THEY CAME HOME!
              </span>
            </div>
          </Abs>
          <Abs left={90} top={1420} width={260} height={390}>
            <Armstrong expression="happy" mouth={mouth} seed={1} />
          </Abs>
          <Abs left={410} top={1420} width={260} height={390}>
            <Aldrin expression="happy" mouth="closed" seed={2} />
          </Abs>
          <Abs left={730} top={1420} width={260} height={390}>
            <Collins expression="happy" mouth="closed" seed={3} />
          </Abs>
        </>
      );
    case "neverNeeded":
      return (
        <>
          <ChalkPlate />
          <Abs left={240} top={480} width={600} height={390}>
            <Envelope stamp="JUL 20 1969" />
          </Abs>
          <Abs left={0} top={1000} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 6) / 8)})` }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 88, color: "#fff",
                  backgroundColor: "#4a6fa5", border: `6px solid ${OUTLINE}`,
                  borderRadius: 999, padding: "22px 56px",
                }}
              >
                NEVER NEEDED
              </span>
            </div>
          </Abs>
          <Abs left={0} top={1300} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 48, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              the insurance was never used…
            </div>
          </Abs>
        </>
      );
    case "auction":
      return (
        <>
          <InteriorPlate />
          <Abs left={64} top={250}><Badge>AT AUCTION</Badge></Abs>
          <Abs left={240} top={560} width={600} height={390}>
            <Envelope stamp="JUL 20 1969" />
          </Abs>
          <Abs left={390} top={1080} width={300} height={220}>
            <Gavel />
          </Abs>
          <Abs left={0} top={1420} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#20242b", textAlign: "center" }}>
              one envelope… going, going…
            </div>
          </Abs>
        </>
      );
    case "lastline": {
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={340} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#fdf3d8", textAlign: "center" }}>
              UP TO
            </div>
          </Abs>
          <Abs left={0} top={460} width={1080}>
            <ChalkText size={240} color="#ffd93b" delay={4}>$30,000</ChalkText>
          </Abs>
          <Abs left={330} top={1080} width={420} height={630}>
            <Armstrong expression="wink" mouth="closed" arm="oneUp" />
          </Abs>
          <Abs left={0} top={1760} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 42, color: "#fdf3d8", textAlign: "center", opacity: 0.85 }}>
              for one little envelope
            </div>
          </Abs>
        </>
      );
    }
    default:
      return null;
  }
};

export const ApolloShort: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const scene = sceneAt(frame);
  const lf = frame - scene.a;
  const dur = scene.b - scene.a;
  return (
    <AbsoluteFill style={{ backgroundColor: "#1d2b4a", overflow: "hidden" }}>
      <style>{FONT_CSS}</style>
      <Scene id={scene.id} lf={lf} dur={dur} t={t} />
      <CaptionOverlay />
    </AbsoluteFill>
  );
};

export { TOTAL };
