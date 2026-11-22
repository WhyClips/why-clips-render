// "The Island That Disappeared From Maps" — Gullak Tales style Short.
// 16 setups, hard cuts, chibi SVG cut-out cast, map/sea plates,
// infographic cards, top captions, inset-clip device, Rhubarb lip-sync.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FPS, TOTAL, SceneId, mouthAt, sceneAt, smooth, pop } from "./story";
import { FONT_CSS, FONT_FAMILY } from "./fonts";
import { Chibi, Boss, OUTLINE } from "./characters";
import type { CastProps } from "./characters";
import {
  SeaPlate, SunnySeaPlate, MapPlate, RadioRoomPlate, ChalkPlate,
} from "./plates";
import { Ship, PumiceRaft, Globe } from "./props";
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

/** The scientist — round glasses, neat hair, white lab coat. */
const Scientist: React.FC<CastProps> = (p) => (
  <Chibi
    hat="none"
    hairStyle="neat"
    hair="#3a2a18"
    skin="#eab886"
    jacket="#f5f5f0"
    jacketDark="#d8d8d8"
    trousers="#3a5f9e"
    glasses
    {...p}
  />
);

/** The ship's captain — navy cap, big moustache. */
const Captain: React.FC<CastProps> = (p) => (
  <Chibi
    hat="modernCap"
    hairStyle="tufts"
    hair="#9a9a9a"
    skin="#f0c08c"
    jacket="#1e3a6e"
    jacketDark="#16294d"
    trousers="#24344d"
    moustache
    {...p}
  />
);

/** Tiny 1876 sailing ship (whaling ship Velocity), side view. */
const SailShip: React.FC = () => (
  <svg viewBox="0 0 400 260" width="100%" height="100%" style={{ overflow: "visible" }}>
    <path d="M30,180 L370,180 Q350,240 260,244 L140,244 Q50,240 30,180 Z" fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    <path d="M200,180 L200,30" stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
    <path d="M200,40 L200,170 L290,170 Z" fill="#f5f5f0" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
    <path d="M190,50 L190,170 L120,170 Z" fill="#e8e0cc" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
    <path d="M200,30 L236,48 L200,56 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
    <g fill="#7ec8f0" stroke={OUTLINE} strokeWidth={4}>
      <circle cx={120} cy={204} r={10} />
      <circle cx={200} cy={204} r={10} />
      <circle cx={280} cy={204} r={10} />
    </g>
  </svg>
);

const Scene: React.FC<{ id: SceneId; lf: number; dur: number; t: number }> = ({ id, lf, dur, t }) => {
  const frame = useCurrentFrame();
  const mouth = mouthAt(t);
  switch (id) {
    case "hook": {
      // island on the map fades out, then IT VANISHED pops
      const islandO = 1 - smooth((lf - 70) / 45);
      return (
        <>
          <MapPlate islandOpacity={islandO} />
          {lf > 105 && (
            <Abs left={0} top={1420} width={1080}>
              <div style={{ textAlign: "center", transform: `scale(${pop((lf - 105) / 8)})` }}>
                <span
                  style={{
                    fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 110, color: "#fff",
                    backgroundColor: "#e63b2e", border: `6px solid ${OUTLINE}`,
                    borderRadius: 999, padding: "20px 56px",
                  }}
                >
                  IT VANISHED!
                </span>
              </div>
            </Abs>
          )}
        </>
      );
    }
    case "nameCard":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={380} width={1080}>
            <ChalkText size={190}>SANDY</ChalkText>
          </Abs>
          <Abs left={0} top={600} width={1080}>
            <ChalkText size={190} color="#ffd93b">ISLAND</ChalkText>
          </Abs>
          <Abs left={390} top={1080}>
            <InsetClip width={300} height={420}>
              <Scientist expression="happy" mouth={mouth} arm="oneUp" />
            </InsetClip>
          </Abs>
          <Abs left={0} top={1560} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 48, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              its name was Sandy Island
            </div>
          </Abs>
        </>
      );
    case "coralSea":
      return (
        <>
          <PushIn dur={dur}><MapPlate route /></PushIn>
          <Abs left={64} top={250}><Badge>CORAL SEA</Badge></Abs>
          <Abs left={120} top={1560} width={300} height={450}>
            <Scientist expression="neutral" mouth={mouth} arm="point" />
          </Abs>
          <Abs left={430} top={1600} width={560}>
            <SpeechBubble size={46} tail="left">136 years on every map!</SpeechBubble>
          </Abs>
        </>
      );
    case "googleMaps":
      return (
        <>
          <ChalkPlate />
          {/* phone with a map + pin */}
          <Abs left={240} top={330} width={600} height={1080}>
            <div
              style={{
                width: "100%", height: "100%", backgroundColor: "#fff",
                border: `8px solid ${OUTLINE}`, borderRadius: 54,
                overflow: "hidden", boxShadow: "0 14px 0 rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ backgroundColor: "#1d2b4a", padding: "22px 0", textAlign: "center" }}>
                <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 44, color: "#fff" }}>Google Maps</span>
              </div>
              <div style={{ position: "relative", backgroundColor: "#bfe6fb", height: "100%" }}>
                <div style={{ position: "absolute", left: 40, top: 220, width: 180, height: 300, backgroundColor: "#e8c97a", border: `5px solid ${OUTLINE}`, borderRadius: 24 }} />
                <div style={{ position: "absolute", right: 40, top: 180, width: 120, height: 340, backgroundColor: "#8fce6e", border: `5px solid ${OUTLINE}`, borderRadius: 24 }} />
                {/* pin */}
                <div
                  style={{
                    position: "absolute", left: 250, top: 300,
                    transform: `scale(${pop((lf - 8) / 8)})`,
                  }}
                >
                  <svg viewBox="0 0 100 140" width={110} height={154}>
                    <path d="M50,138 L10,62 A40,40 0 1 1 90,62 Z" fill="#e63b2e" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
                    <circle cx={50} cy={62} r={16} fill="#fff" stroke={OUTLINE} strokeWidth={5} />
                  </svg>
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center" }}>
                  <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 44, color: "#20242b" }}>SANDY ISLAND</span>
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center" }}>
                  <span style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 36, color: "#e63b2e" }}>● on Google Maps</span>
                </div>
              </div>
            </div>
          </Abs>
        </>
      );
    case "sizeCard":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={420} width={1080}>
            <ChalkText size={230} color="#ffd93b">25 km</ChalkText>
          </Abs>
          <Abs left={0} top={700} width={1080}>
            <ChalkText size={150}>× 5 km wide</ChalkText>
          </Abs>
          <Abs left={0} top={1080} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 30) / 8)})`, opacity: smooth(((lf - 30) / 8) * 1.5) }}>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 56, color: "#fdf3d8" }}>
                BIG ENOUGH TO SEE FROM SPACE
              </span>
            </div>
          </Abs>
        </>
      );
    case "copyCopy": {
      const sheets = [
        { r: -6, d: 0, y: 420 }, { r: 4, d: 12, y: 660 }, { r: -3, d: 24, y: 900 }, { r: 5, d: 36, y: 1140 },
      ];
      return (
        <>
          <ChalkPlate />
          <Abs left={64} top={250}><Badge>136 YEARS OF COPYING</Badge></Abs>
          {sheets.map((s, i) => (
            <Abs key={i} left={240} top={s.y} width={600}>
              <div
                style={{
                  backgroundColor: "#f5ecd7", border: `6px solid ${OUTLINE}`, borderRadius: 20,
                  padding: "18px 28px", transform: `rotate(${s.r}deg) scale(${pop((lf - s.d) / 7)})`,
                  opacity: smooth(((lf - s.d) / 7) * 1.5), textAlign: "center",
                }}
              >
                <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 44, color: "#8a6a3b" }}>
                  MAP {1876 + i * 40} — SANDY ISLAND ✓
                </span>
              </div>
            </Abs>
          ))}
          <Abs left={0} top={1420} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 46, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              mapmakers just copied the last map…
            </div>
          </Abs>
        </>
      );
    }
    case "mocker":
      return (
        <>
          <PushIn dur={dur} to={1.18}><RadioRoomPlate /></PushIn>
          <Abs left={150} top={480} width={780}>
            <SpeechBubble size={62}>“IT’S ON THE MAP!”</SpeechBubble>
          </Abs>
          <Abs left={270} top={880} width={540} height={810} style={{ transform: `rotate(${Math.sin(frame * 0.7) * 2}deg)` }}>
            <Boss expression="laugh" mouth="grin" arm="oneUp" />
          </Abs>
          <Abs left={40} top={1180} width={200} height={300}>
            <Scientist expression="neutral" mouth="closed" flip />
          </Abs>
        </>
      );
    case "voyage": {
      const shipX = interpolate(lf, [0, dur], [-420, 560]);
      return (
        <>
          <SunnySeaPlate />
          <Abs left={64} top={250}><Badge>2012</Badge></Abs>
          <Abs left={shipX} top={980 + Math.sin(frame * 0.1) * 10} width={760} height={370}>
            <Ship />
          </Abs>
          <Abs left={0} top={1420} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 58, color: "#fff", textAlign: "center", textShadow: "0 4px 0 rgba(0,0,0,0.3)" }}>
              the Southern Surveyor sets sail…
            </div>
          </Abs>
          <Abs left={700} top={1560} width={280} height={420}>
            <Captain expression="calm" mouth={mouth} arm="point" />
          </Abs>
        </>
      );
    }
    case "coordinates": {
      const rings = [0, 1, 2].map((i) => {
        const ph = ((lf + i * 22) % 66) / 66;
        return { r: 60 + ph * 260, o: 0.8 * (1 - ph) };
      });
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={380} width={1080}>
            <ChalkText size={150}>19°15′ S</ChalkText>
          </Abs>
          <Abs left={0} top={580} width={1080}>
            <ChalkText size={150} color="#7ec8f0">159°55′ E</ChalkText>
          </Abs>
          {/* sonar rings */}
          <Abs left={290} top={900} width={500} height={500}>
            <svg viewBox="0 0 500 500" width="100%" height="100%">
              {rings.map((rg, i) => (
                <circle key={i} cx={250} cy={250} r={rg.r} fill="none" stroke="#7ee787" strokeWidth={8} opacity={rg.o} />
              ))}
              <circle cx={250} cy={250} r={26} fill="#7ee787" stroke={OUTLINE} strokeWidth={5} />
            </svg>
          </Abs>
          <Abs left={0} top={1480} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 46, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              straight to the island’s coordinates
            </div>
          </Abs>
        </>
      );
    }
    case "nothing":
      return (
        <>
          <PushIn dur={dur} to={1.3}><SeaPlate /></PushIn>
          <Abs left={260} top={780} width={560} height={840}>
            <Scientist expression="scared" mouth={mouth} arm="point" />
          </Abs>
          <Abs left={0} top={1560} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 40) / 8)})` }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 120, color: "#fff",
                  backgroundColor: "#1d2b4a", border: `6px solid ${OUTLINE}`,
                  borderRadius: 999, padding: "18px 64px",
                }}
              >
                NOTHING.
              </span>
            </div>
          </Abs>
        </>
      );
    case "depthCard":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={380} width={1080}>
            <ChalkText size={210} color="#7ec8f0">1,400 m</ChalkText>
          </Abs>
          <Abs left={0} top={640} width={1080}>
            <ChalkText size={130}>DEEP</ChalkText>
          </Abs>
          {/* depth gauge: fills down as the scene plays */}
          <Abs left={440} top={900} width={200} height={620}>
            <div style={{ width: "100%", height: "100%", backgroundColor: "#16223e", border: `6px solid ${OUTLINE}`, borderRadius: 24, overflow: "hidden", position: "relative" }}>
              <div
                style={{
                  position: "absolute", left: 0, right: 0, top: 0,
                  height: `${smooth(lf / 60) * 100}%`,
                  background: "linear-gradient(180deg, #7ec8f0, #1d4370)",
                }}
              />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center" }}>
                <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 40, color: "#fff" }}>▼</span>
              </div>
            </div>
          </Abs>
          <Abs left={0} top={1560} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 46, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              just open ocean — no island at all
            </div>
          </Abs>
        </>
      );
    case "french1974":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={300} width={1080}>
            <ChalkText size={200}>1974</ChalkText>
          </Abs>
          <Abs left={0} top={600} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 12) / 8)})` }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#fff",
                  backgroundColor: "#e8634a", border: `5px solid ${OUTLINE}`,
                  borderRadius: 999, padding: "18px 48px",
                }}
              >
                FRANCE REMOVED IT
              </span>
            </div>
          </Abs>
          <Abs left={340} top={900} width={400} height={600}>
            <Scientist expression="think" mouth={mouth} arm="chin" />
          </Abs>
          <Abs left={0} top={1560} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 58, color: "#ffd93b", textAlign: "center" }}>
              but nobody told Google!
            </div>
          </Abs>
          {/* tricolore bars */}
          <Abs left={0} bottom={0} width={1080} height={110}>
            <div style={{ display: "flex", width: "100%", height: "100%" }}>
              <div style={{ flex: 1, backgroundColor: "#2b4a9e" }} />
              <div style={{ flex: 1, backgroundColor: "#f5f5f0" }} />
              <div style={{ flex: 1, backgroundColor: "#e63b2e" }} />
            </div>
          </Abs>
        </>
      );
    case "pumice":
      return (
        <>
          <SunnySeaPlate />
          <Abs left={64} top={250}><Badge>1876</Badge></Abs>
          <Abs left={140} top={880} width={480} height={312}>
            <SailShip />
          </Abs>
          <Abs left={180} top={1180} width={720} height={240}>
            <PumiceRaft />
          </Abs>
          <Abs left={0} top={1500} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 58, color: "#fff", textAlign: "center", textShadow: "0 4px 0 rgba(0,0,0,0.3)" }}>
              a floating raft of volcanic rock…
            </div>
          </Abs>
        </>
      );
    case "erase": {
      const islandO = 1 - smooth((lf - 30) / 50);
      return (
        <>
          <MapPlate islandOpacity={islandO} showX={lf > 55} />
          <Abs left={0} top={1560} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 60) / 8)})` }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 84, color: "#fff",
                  backgroundColor: "#e63b2e", border: `6px solid ${OUTLINE}`,
                  borderRadius: 999, padding: "18px 56px",
                }}
              >
                DELETED!
              </span>
            </div>
          </Abs>
        </>
      );
    }
    case "deleted":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={300} width={1080}>
            <ChalkText size={190} color="#e8634a">DELETED</ChalkText>
          </Abs>
          <Abs left={280} top={600} width={520} height={520}>
            <Globe />
          </Abs>
          <Abs left={0} top={1260} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 12) / 8)})` }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 60, color: "#fff",
                  backgroundColor: "#1d2b4a", border: `5px solid ${OUTLINE}`,
                  borderRadius: 999, padding: "18px 48px",
                }}
              >
                FROM EVERY MAP ON EARTH
              </span>
            </div>
          </Abs>
        </>
      );
    case "lastline": {
      const wink = lf > 55;
      return (
        <>
          <ChalkPlate />
          <Abs left={330} top={880} width={420} height={630}>
            <Scientist expression={wink ? "wink" : "calm"} mouth="closed" arm="oneUp" />
          </Abs>
          <Abs left={0} top={1560} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 50) / 8)})` }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 62, color: "#fff",
                  backgroundColor: "#1d2b4a", border: `5px solid ${OUTLINE}`,
                  borderRadius: 999, padding: "18px 48px",
                }}
              >
                NEVER ON EARTH
              </span>
            </div>
          </Abs>
        </>
      );
    }
    default:
      return null;
  }
};

export const IslandShort: React.FC = () => {
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
