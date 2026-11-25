// "The Senator Who Sued God" — Gullak Tales style Short.
// 14 setups, hard cuts, chibi SVG cut-out cast, low-poly plates,
// infographic cards, top captions, Rhubarb lip-sync.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FPS, TOTAL, SceneId, mouthAt, sceneAt, smooth, pop } from "./story";
import { FONT_CSS, FONT_FAMILY } from "./fonts";
import {
  Chambers, Judge, OUTLINE,
} from "./characters";
import {
  InteriorPlate, ChalkPlate, StormPlate,
} from "./plates";
import {
  Gavel, Lightbulb, LawsuitPapers, EmptyChair, AddressBook, Scales,
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

/** name label pill under a character */
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

const Scene: React.FC<{ id: SceneId; lf: number; dur: number; t: number }> = ({ id, lf, dur, t }) => {
  const frame = useCurrentFrame();
  const mouth = mouthAt(t);
  switch (id) {
    case "hook": {
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={340} width={1080}>
            <ChalkText size={150}>A SENATOR</ChalkText>
          </Abs>
          <Abs left={0} top={540} width={1080}>
            <ChalkText size={190} color="#ff7b54" delay={6}>SUED GOD</ChalkText>
          </Abs>
          <Abs left={0} top={800} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 48, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              and the court took it seriously…
            </div>
          </Abs>
          <Abs left={390} top={1080} width={300} height={300} style={{ transform: `scale(${pop((lf - 40) / 8)})` }}>
            <Scales />
          </Abs>
        </>
      );
    }
    case "setup":
      return (
        <>
          <PushIn dur={dur}><InteriorPlate /></PushIn>
          <Abs left={64} top={250}><Badge>NEBRASKA • 2007</Badge></Abs>
          <Abs left={340} top={880} width={400} height={600}>
            <Chambers expression="happy" mouth={mouth} arm="oneUp" />
          </Abs>
          <Abs left={340} top={1520} width={400}><NameTag name="ERNIE CHAMBERS" color="#1e3a6e" /></Abs>
          <Abs left={0} top={1680} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 44, color: "#20242b", textAlign: "center", opacity: 0.85 }}>
              a state senator
            </div>
          </Abs>
        </>
      );
    case "filedSuit":
      return (
        <>
          <ChalkPlate />
          <Abs left={240} top={420} width={600} height={430} style={{ transform: `scale(${pop(lf / 8)}) rotate(-2deg)` }}>
            <LawsuitPapers />
          </Abs>
          <Abs left={0} top={980} width={1080}>
            <ChalkText size={120}>A REAL LAWSUIT</ChalkText>
          </Abs>
          <Abs left={0} top={1200} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 30) / 8)})` }}>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 72, color: "#ff7b54" }}>
                against God.
              </span>
            </div>
          </Abs>
        </>
      );
    case "charges1":
      return (
        <>
          <StormPlate />
          <Abs left={0} top={330} width={1080}>
            <ChalkText size={130}>FLOODS</ChalkText>
          </Abs>
          <Abs left={0} top={500} width={1080}>
            <ChalkText size={110} color="#ffd93b" delay={40}>EARTHQUAKES</ChalkText>
          </Abs>
          <Abs left={0} top={660} width={1080}>
            <ChalkText size={120} delay={80}>HURRICANES</ChalkText>
          </Abs>
          <Abs left={0} top={820} width={1080}>
            <ChalkText size={120} color="#ff7b54" delay={120}>TORNADOES</ChalkText>
          </Abs>
          <Abs left={0} top={1080} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 46, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              God was accused of causing them all…
            </div>
          </Abs>
        </>
      );
    case "charges2":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={330} width={1080}>
            <ChalkText size={130}>PLAGUES</ChalkText>
          </Abs>
          <Abs left={0} top={500} width={1080}>
            <ChalkText size={130} color="#ffd93b" delay={30}>FAMINES</ChalkText>
          </Abs>
          <Abs left={0} top={670} width={1080}>
            <ChalkText size={130} delay={60}>DROUGHTS</ChalkText>
          </Abs>
          <Abs left={0} top={840} width={1080}>
            <ChalkText size={110} color="#ff7b54" delay={100}>WARS • BIRTH DEFECTS</ChalkText>
          </Abs>
          <Abs left={0} top={1120} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 46, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              the list went on… and on…
            </div>
          </Abs>
        </>
      );
    case "threats":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={330} width={1080}>
            <ChalkText size={100} color="#ff7b54">TERRORISTIC</ChalkText>
          </Abs>
          <Abs left={0} top={470} width={1080}>
            <ChalkText size={130} delay={10}>THREATS</ChalkText>
          </Abs>
          <Abs left={290} top={760} width={500} height={750}>
            <Chambers expression="neutral" mouth={mouth} arm="point" />
          </Abs>
          {lf > 100 && (
            <Abs left={0} top={1560} width={1080}>
              <div style={{ textAlign: "center", transform: `scale(${pop((lf - 100) / 8)})` }}>
                <span
                  style={{
                    fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 84, color: "#fff",
                    backgroundColor: "#e63b2e", border: `6px solid ${OUTLINE}`,
                    borderRadius: 999, padding: "22px 52px",
                  }}
                >
                  STOP. FOREVER.
                </span>
              </div>
            </Abs>
          )}
        </>
      );
    case "point": {
      const showAccess = lf > 95;
      const showWho = lf > 145;
      return (
        <>
          <InteriorPlate />
          <Abs left={64} top={250}><Badge color="#2f9e44">NOT A JOKE</Badge></Abs>
          <Abs left={340} top={700} width={400} height={600}>
            <Chambers expression="think" mouth={mouth} arm="chin" />
          </Abs>
          {showAccess && (
            <Abs left={0} top={1400} width={1080}>
              <div style={{ textAlign: "center", transform: `scale(${pop((lf - 95) / 8)})` }}>
                <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#20242b" }}>
                  everyone deserves the courts
                </span>
              </div>
            </Abs>
          )}
          {showWho && (
            <Abs left={0} top={1560} width={1080}>
              <div style={{ textAlign: "center", transform: `scale(${pop((lf - 145) / 8)})` }}>
                <span
                  style={{
                    fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 56, color: "#fff",
                    backgroundColor: "#1d2b4a", border: `5px solid ${OUTLINE}`,
                    borderRadius: 999, padding: "16px 44px",
                  }}
                >
                  RICH OR POOR • POWERFUL OR NOBODY
                </span>
              </div>
            </Abs>
          )}
        </>
      );
    }
    case "hearing":
      return (
        <>
          <InteriorPlate />
          <Abs left={64} top={250}><Badge>THE HEARING</Badge></Abs>
          <Abs left={90} top={900} width={360} height={540}>
            <Judge expression="calm" mouth="closed" arm="down" />
          </Abs>
          <Abs left={630} top={900} width={360} height={540}>
            <Chambers expression="neutral" mouth={mouth} arm="down" />
          </Abs>
          <Abs left={390} top={1420} width={300} height={220}>
            <Gavel />
          </Abs>
          <Abs left={0} top={1700} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 44, color: "#20242b", textAlign: "center", opacity: 0.85 }}>
              the court took it so seriously…
            </div>
          </Abs>
        </>
      );
    case "reserved": {
      const showNobody = lf > 95;
      return (
        <>
          <ChalkPlate />
          <Abs left={64} top={250}><Badge color="#e8634a">AN EMPTY TABLE</Badge></Abs>
          <Abs left={390} top={620} width={300} height={360} style={{ transform: `scale(${pop(lf / 8)})` }}>
            <EmptyChair />
          </Abs>
          <Abs left={0} top={1080} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 60, color: "#fdf3d8", textAlign: "center" }}>
              reserved for God
            </div>
          </Abs>
          <Abs left={0} top={1200} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 60, color: "#fdf3d8", textAlign: "center" }}>
              and God&apos;s lawyer
            </div>
          </Abs>
          {showNobody && (
            <Abs left={0} top={1420} width={1080}>
              <div style={{ textAlign: "center", transform: `scale(${pop((lf - 95) / 8)})` }}>
                <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 76, color: "#e63b2e" }}>
                  NOBODY SHOWED UP
                </span>
              </div>
            </Abs>
          )}
        </>
      );
    }
    case "dismissed":
      return (
        <>
          <ChalkPlate />
          <Abs left={64} top={250}><Badge>OCTOBER 2008</Badge></Abs>
          <Abs left={340} top={700} width={400} height={600}>
            <Judge expression="neutral" mouth="closed" arm="down" />
          </Abs>
          <Abs left={390} top={1340} width={300} height={220}>
            <Gavel />
          </Abs>
          <Abs left={0} top={1620} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 60) / 8)})` }}>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 88, color: "#fff" }}>
                THROWN OUT
              </span>
            </div>
          </Abs>
        </>
      );
    case "noAddress": {
      const showCard = lf > 55;
      return (
        <>
          <ChalkPlate />
          <Abs left={330} top={420} width={420} height={327} style={{ transform: `scale(${pop(lf / 8)}) rotate(-3deg)` }}>
            <AddressBook />
          </Abs>
          {showCard && (
            <Abs left={0} top={900} width={1080}>
              <div style={{ textAlign: "center", transform: `scale(${pop((lf - 55) / 8)})` }}>
                <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 92, color: "#ffd93b" }}>
                  NO ADDRESS
                </span>
              </div>
            </Abs>
          )}
          <Abs left={0} top={1120} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 58, color: "#fdf3d8", textAlign: "center" }}>
              on file — so it could never be served
            </div>
          </Abs>
          <Abs left={0} top={1300} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 46, color: "#fdf3d8", textAlign: "center", opacity: 0.85 }}>
              the lawsuit could never be delivered…
            </div>
          </Abs>
        </>
      );
    }
    case "argued":
      return (
        <>
          <InteriorPlate />
          <Abs left={64} top={250}><Badge>GOD KNOWS EVERYTHING?</Badge></Abs>
          <Abs left={90} top={900} width={360} height={540}>
            <Chambers expression="happy" mouth={mouth} arm="oneUp" />
          </Abs>
          <Abs left={630} top={900} width={360} height={540}>
            <Judge expression="neutral" mouth="closed" arm="down" />
          </Abs>
          <Abs left={440} top={620} width={520}>
            <SpeechBubble size={48} delay={40} tail="left">He already knows!</SpeechBubble>
          </Abs>
          {lf > 140 && (
            <Abs left={0} top={1560} width={1080}>
              <div style={{ textAlign: "center", transform: `scale(${pop((lf - 140) / 8)})` }}>
                <span
                  style={{
                    fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 60, color: "#fff",
                    backgroundColor: "#1d2b4a", border: `5px solid ${OUTLINE}`,
                    borderRadius: 999, padding: "16px 44px",
                  }}
                >
                  THE JUDGE DIDN&apos;T BUDGE
                </span>
              </div>
            </Abs>
          )}
        </>
      );
    case "payoff":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={420} width={1080}>
            <ChalkText size={130}>ONE TINY</ChalkText>
          </Abs>
          <Abs left={0} top={600} width={1080}>
            <ChalkText size={170} color="#ffd93b" delay={8}>DETAIL</ChalkText>
          </Abs>
          <Abs left={0} top={900} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 48, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              that&apos;s all it took to kill the case
            </div>
          </Abs>
          <Abs left={390} top={1180} width={300} height={300} style={{ transform: `scale(${pop((lf - 50) / 8)})` }}>
            <Scales />
          </Abs>
        </>
      );
    case "lastline":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={340} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#fdf3d8", textAlign: "center" }}>
              NOT INNOCENT.
            </div>
          </Abs>
          <Abs left={0} top={480} width={1080}>
            <ChalkText size={150} color="#ffd93b" delay={10}>IMPOSSIBLE</ChalkText>
          </Abs>
          <Abs left={0} top={680} width={1080}>
            <ChalkText size={150} color="#ffd93b" delay={22}>TO SERVE.</ChalkText>
          </Abs>
          <Abs left={330} top={1120} width={420} height={630}>
            <Chambers expression="wink" mouth="closed" arm="oneUp" />
          </Abs>
        </>
      );
    default:
      return null;
  }
};

export const SuedGodShort: React.FC = () => {
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
