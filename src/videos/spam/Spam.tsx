// "The First Spam Email Made $13 Million" — Gullak Tales style Short.
// 16 setups, hard cuts, chibi SVG cut-out cast, computer-room / ARPANET
// plates, infographic cards, top captions, inset-clip device, Rhubarb lip-sync.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FPS, TOTAL, SceneId, mouthAt, sceneAt, smooth, pop } from "./story";
import { FONT_CSS, FONT_FAMILY } from "./fonts";
import { Gary, Boss, NetUser, OUTLINE } from "./characters";
import {
  ComputerRoomPlate, NetworkPlate, RadioRoomPlate, ChalkPlate,
} from "./plates";
import { DecTerminal, Envelope, CashStack, Medal, InboxPhone } from "./props";
import { Abs, ChalkText, Badge, SpeechBubble, InsetClip } from "./cards";
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

/** Big rounded pill label (red or navy), pops in at a local frame. */
const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  size?: number;
  at?: number;
  lf: number;
}> = ({ children, bg = "#e63b2e", size = 64, at = 0, lf }) => (
  <div style={{ textAlign: "center", transform: `scale(${pop((lf - at) / 8)})`, opacity: smooth(((lf - at) / 8) * 1.5) }}>
    <span
      style={{
        fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: size, color: "#fff",
        backgroundColor: bg, border: `6px solid ${OUTLINE}`,
        borderRadius: 999, padding: "18px 52px", whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  </div>
);

const Scene: React.FC<{ id: SceneId; lf: number; dur: number; t: number }> = ({ id, lf, dur, t }) => {
  const frame = useCurrentFrame();
  const mouth = mouthAt(t);
  switch (id) {
    case "hook":
      return (
        <>
          <ChalkPlate />
          <Abs left={290} top={320} width={500} height={350}>
            <div style={{ transform: `scale(${pop(lf / 8)})` }}>
              <Envelope />
            </div>
          </Abs>
          <Abs left={0} top={700} width={1080}>
            <ChalkText size={120}>ONE EMAIL</ChalkText>
          </Abs>
          <Abs left={0} top={850} width={1080}>
            <ChalkText size={120} delay={25}>400 PEOPLE</ChalkText>
          </Abs>
          <Abs left={0} top={1000} width={1080}>
            <ChalkText size={150} color="#ffd93b" delay={49}>$13 MILLION</ChalkText>
          </Abs>
          <Abs left={0} top={1420} width={1080}>
            <Pill lf={lf} at={85} size={62}>THE VERY FIRST SPAM</Pill>
          </Abs>
        </>
      );
    case "nameCard":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={380} width={1080}>
            <ChalkText size={190}>GARY</ChalkText>
          </Abs>
          <Abs left={0} top={600} width={1080}>
            <ChalkText size={190} color="#ffd93b">THUERK</ChalkText>
          </Abs>
          <Abs left={390} top={1080}>
            <InsetClip width={300} height={420}>
              <Gary expression="happy" mouth={mouth} arm="oneUp" />
            </InsetClip>
          </Abs>
          <Abs left={0} top={1560} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 44, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              marketing manager • DEC • 1978
            </div>
          </Abs>
        </>
      );
    case "computerRoom":
      return (
        <>
          <ComputerRoomPlate />
          <Abs left={64} top={250}><Badge>1978</Badge></Abs>
          <Abs left={64} top={700}><Badge color="#b03a2e">NO GMAIL ✕</Badge></Abs>
          <Abs left={64} top={820}><Badge color="#b03a2e">NO SMARTPHONES ✕</Badge></Abs>
          <Abs left={60} top={1250} width={640} height={549}>
            <DecTerminal />
          </Abs>
          <Abs left={680} top={1150} width={340} height={510}>
            <Gary expression="neutral" mouth={mouth} arm="down" />
          </Abs>
        </>
      );
    case "sendMoment": {
      // envelope flies out of the terminal toward the top-right after SEND
      const fly = smooth((lf - 68) / 40);
      const envX = interpolate(fly, [0, 1], [540, 980]);
      const envY = interpolate(fly, [0, 1], [900, 480]);
      const envO = lf < 68 ? 0 : 1 - smooth((lf - 100) / 10);
      return (
        <>
          <PushIn dur={dur} to={1.1}><ComputerRoomPlate /></PushIn>
          <Abs left={0} top={300} width={1080}>
            <Pill lf={lf} at={5} size={76}>3 MAY 1978</Pill>
          </Abs>
          <Abs left={140} top={900} width={800} height={686}>
            <DecTerminal sendLit={lf > 55} />
          </Abs>
          <Abs left={780} top={720} width={260} height={390}>
            <Gary expression="happy" mouth={mouth} arm="point" flip />
          </Abs>
          {envO > 0 && (
            <Abs left={envX} top={envY} width={180} height={126} style={{ opacity: envO, transform: "rotate(15deg)" }}>
              <Envelope />
            </Abs>
          )}
        </>
      );
    }
    case "arpanet":
      return (
        <>
          <NetworkPlate />
          <Abs left={64} top={250}><Badge>400 INBOXES</Badge></Abs>
          <Abs left={0} top={1320} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 10) / 8)})` }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 48, color: "#1d2b4a",
                  backgroundColor: "#fff", border: `6px solid ${OUTLINE}`,
                  borderRadius: 999, padding: "16px 44px", whiteSpace: "nowrap",
                }}
              >
                ONE EMAIL → 400 PEOPLE
              </span>
            </div>
          </Abs>
        </>
      );
    case "angry":
      return (
        <>
          <ChalkPlate />
          <Abs left={110} top={400} width={860}>
            <SpeechBubble size={52}>ARPANET IS NOT FOR SALESMEN!</SpeechBubble>
          </Abs>
          <Abs left={60} top={1080} width={300} height={450}>
            <NetUser variant={0} expression="worried" mouth={mouth} arm="oneUp" seed={1} />
          </Abs>
          <Abs left={390} top={1080} width={300} height={450}>
            <NetUser variant={1} expression="scared" mouth="closed" arm="bothUp" seed={2} />
          </Abs>
          <Abs left={720} top={1080} width={300} height={450}>
            <NetUser variant={2} expression="worried" mouth="closed" arm="point" seed={3} />
          </Abs>
          <Abs left={0} top={1620} width={1080}>
            <Pill lf={lf} at={8} size={52}>PEOPLE WERE FURIOUS!</Pill>
          </Abs>
        </>
      );
    case "complaints": {
      // complaint letters rain down and pile up (2s gag)
      const letters = [
        { x: 60, d: 0, r: -8 }, { x: 240, d: 4, r: 6 }, { x: 420, d: 8, r: -5 },
        { x: 600, d: 12, r: 9 }, { x: 780, d: 16, r: -7 }, { x: 150, d: 20, r: 5 },
        { x: 690, d: 24, r: -4 },
      ];
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={420} width={1080}>
            <ChalkText size={96}>COMPLAINTS</ChalkText>
          </Abs>
          <Abs left={0} top={560} width={1080}>
            <ChalkText size={96} color="#e8634a">POURED IN</ChalkText>
          </Abs>
          {letters.map((l, i) => {
            // letters fall only below the title/caption zone (y >= 750)
            const y = 750 + smooth((lf - l.d) / 40) * 950;
            return (
              <Abs key={i} left={l.x} top={y} width={200} height={140} style={{ transform: `rotate(${l.r}deg)` }}>
                <Envelope angry />
              </Abs>
            );
          })}
        </>
      );
    }
    case "boss":
      return (
        <>
          <PushIn dur={dur} to={1.18}><RadioRoomPlate /></PushIn>
          <Abs left={150} top={480} width={780}>
            <SpeechBubble size={62}>“NEVER AGAIN!”</SpeechBubble>
          </Abs>
          <Abs left={270} top={880} width={540} height={810} style={{ transform: `rotate(${Math.sin(frame * 0.7) * 2}deg)` }}>
            <Boss expression="worried" mouth={mouth} arm="oneUp" />
          </Abs>
          <Abs left={40} top={1180} width={200} height={300}>
            <Gary expression="worried" mouth="closed" flip />
          </Abs>
        </>
      );
    case "demos":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={340} width={1080}>
            <ChalkText size={200} color="#ffd93b">40</ChalkText>
          </Abs>
          <Abs left={0} top={560} width={1080}>
            <ChalkText size={150} color="#ffd93b">PEOPLE</ChalkText>
          </Abs>
          <Abs left={0} top={760} width={1080}>
            <ChalkText size={56}>SHOWED UP TO THE DEMOS</ChalkText>
          </Abs>
          <Abs left={390} top={880}>
            <InsetClip width={300} height={420}>
              <Gary expression="happy" mouth={mouth} arm="bothUp" />
            </InsetClip>
          </Abs>
          {[0, 1, 2, 3].map((v) => (
            <Abs key={v} left={60 + v * 240} top={1420} width={220} height={330}>
              <NetUser variant={v} expression="happy" mouth="closed" arm="down" seed={v + 1} />
            </Abs>
          ))}
        </>
      );
    case "sales":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={380} width={1080}>
            <ChalkText size={200} color="#ffd93b">SALES!</ChalkText>
          </Abs>
          <Abs left={290} top={700} width={500} height={381}>
            <CashStack />
          </Abs>
          <Abs left={0} top={1180} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 46, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              those demos turned into sales
            </div>
          </Abs>
          <Abs left={390} top={1360}>
            <InsetClip width={300} height={420}>
              <Gary expression="happy" mouth={mouth} arm="oneUp" />
            </InsetClip>
          </Abs>
        </>
      );
    case "moneyCard":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={360} width={1080}>
            <ChalkText size={260} color="#ffd93b">$13</ChalkText>
          </Abs>
          <Abs left={0} top={650} width={1080}>
            <ChalkText size={170}>MILLION</ChalkText>
          </Abs>
          <Abs left={290} top={900} width={500} height={381}>
            <CashStack />
          </Abs>
          <Abs left={0} top={1420} width={1080}>
            <Pill lf={lf} at={55} size={72}>IN 1978!</Pill>
          </Abs>
        </>
      );
    case "youSee":
      return (
        <>
          <ComputerRoomPlate />
          <Abs left={120} top={380} width={840}>
            <SpeechBubble size={46}>I INVENTED EMAIL MARKETING!</SpeechBubble>
          </Abs>
          <Abs left={330} top={780} width={420} height={630}>
            <Gary expression="happy" mouth={mouth} arm="oneUp" />
          </Abs>
          <Abs left={0} top={1560} width={1080}>
            <Pill lf={lf} at={20} bg="#1d2b4a" size={46}>and he&apos;s still proud of it</Pill>
          </Abs>
        </>
      );
    case "guinness":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={340} width={1080}>
            <ChalkText size={130}>GUINNESS</ChalkText>
          </Abs>
          <Abs left={0} top={500} width={1080}>
            <ChalkText size={88} color="#ffd93b">WORLD RECORDS</ChalkText>
          </Abs>
          <Abs left={390} top={660} width={300} height={360}>
            <Medal />
          </Abs>
          <Abs left={0} top={1120} width={1080}>
            <Pill lf={lf} at={10} size={56}>OLDEST SPAM ON EARTH</Pill>
          </Abs>
          <Abs left={390} top={1300}>
            <InsetClip width={300} height={420}>
              <Gary expression="happy" mouth={mouth} arm="oneUp" />
            </InsetClip>
          </Abs>
        </>
      );
    case "inbox":
      return (
        <>
          <ChalkPlate />
          <Abs left={340} top={320} width={400} height={686}>
            <div style={{ transform: `scale(${pop(lf / 8)})` }}>
              <InboxPhone rows={5} />
            </div>
          </Abs>
          <Abs left={100} top={520} width={160} height={112} style={{ transform: `rotate(-12deg) scale(${pop((lf - 10) / 8)})` }}>
            <Envelope angry />
          </Abs>
          <Abs left={820} top={700} width={160} height={112} style={{ transform: `rotate(12deg) scale(${pop((lf - 20) / 8)})` }}>
            <Envelope angry />
          </Abs>
          <Abs left={0} top={1080} width={1080}>
            <ChalkText size={80} color="#ffd93b">99+ JUNK EMAILS</ChalkText>
          </Abs>
          <Abs left={390} top={1280}>
            <InsetClip width={300} height={420}>
              <Gary expression="calm" mouth={mouth} arm="down" />
            </InsetClip>
          </Abs>
        </>
      );
    case "recap":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={480} width={1080}>
            <ChalkText size={130} delay={1528}>ONE EMAIL.</ChalkText>
          </Abs>
          <Abs left={0} top={720} width={1080}>
            <ChalkText size={130} delay={1546}>400 PEOPLE.</ChalkText>
          </Abs>
          <Abs left={0} top={960} width={1080}>
            <ChalkText size={150} color="#ffd93b" delay={1572}>$13 MILLION.</ChalkText>
          </Abs>
          <Abs left={390} top={1300} width={300} height={210}>
            <div style={{ transform: `scale(${pop((lf - 45) / 8)})` }}>
              <Envelope />
            </div>
          </Abs>
        </>
      );
    case "lastline": {
      const wink = lf > 40;
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={360} width={1080}>
            <ChalkText size={84}>THE FIRST SPAM EMAIL</ChalkText>
          </Abs>
          <Abs left={0} top={480} width={1080}>
            <ChalkText size={84} color="#ffd93b">IN HISTORY...</ChalkText>
          </Abs>
          <Abs left={330} top={720} width={420} height={630}>
            <Gary expression={wink ? "wink" : "calm"} mouth="closed" arm="oneUp" />
          </Abs>
          <Abs left={0} top={1440} width={1080}>
            <Pill lf={lf} at={70} bg="#1d2b4a" size={54}>THE MOST SUCCESSFUL</Pill>
          </Abs>
          <Abs left={0} top={1580} width={1080}>
            <Pill lf={lf} at={85} size={54}>EMAIL EVER SENT</Pill>
          </Abs>
        </>
      );
    }
    default:
      return null;
  }
};

export const SpamShort: React.FC = () => {
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
