// "Fruit Flies — First Animals in Space" — Gullak Tales style Short.
// 14 setups, hard cuts, chibi SVG cut-out cast, low-poly plates,
// infographic cards, top captions, Rhubarb lip-sync.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FPS, TOTAL, SceneId, mouthAt, sceneAt, smooth, pop } from "./story";
import { FONT_CSS, FONT_FAMILY } from "./fonts";
import {
  Crewman, Agent, Astronaut, OUTLINE,
} from "./characters";
import {
  SpacePlate, LaunchPadPlate, QuarantinePlate, MoonPlate,
  InteriorPlate, ChalkPlate,
} from "./plates";
import { Capsule, Lightbulb } from "./props";
import { Abs, ChalkText, Badge, SpeechBubble, RedX } from "./cards";
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

/** Chibi fruit fly — big red eyes, translucent wings, tiny body. viewBox 0 0 200 200. */
const FruitFly: React.FC<{ size?: number; flip?: boolean }> = ({ flip = false }) => {
  const f = useCurrentFrame();
  const wing = 1 + Math.sin(f * 0.7) * 0.25;
  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      {/* wings (behind body) */}
      <g transform={`translate(100 70) scale(${wing} 1)`}>
        <ellipse cx={-38} cy={-18} rx={42} ry={20} fill="rgba(255,255,255,0.75)" stroke={OUTLINE} strokeWidth={4} transform="rotate(-28 -38 -18)" />
        <ellipse cx={38} cy={-18} rx={42} ry={20} fill="rgba(255,255,255,0.75)" stroke={OUTLINE} strokeWidth={4} transform="rotate(28 38 -18)" />
      </g>
      {/* legs */}
      <g stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" fill="none">
        <path d="M82,150 L70,178 M100,154 L100,182 M118,150 L130,178" />
      </g>
      {/* body */}
      <ellipse cx={100} cy={118} rx={46} ry={52} fill="#5a4632" stroke={OUTLINE} strokeWidth={6} />
      <path d="M62,104 Q100,88 138,104" fill="none" stroke="#8a6a3b" strokeWidth={5} strokeLinecap="round" />
      <path d="M60,126 Q100,112 140,126" fill="none" stroke="#8a6a3b" strokeWidth={5} strokeLinecap="round" />
      {/* head */}
      <circle cx={100} cy={58} r={34} fill="#3a2e22" stroke={OUTLINE} strokeWidth={6} />
      {/* big red eyes */}
      <ellipse cx={84} cy={56} rx={13} ry={16} fill="#e63b2e" stroke={OUTLINE} strokeWidth={4} />
      <ellipse cx={116} cy={56} rx={13} ry={16} fill="#e63b2e" stroke={OUTLINE} strokeWidth={4} />
      <circle cx={88} cy={50} r={4} fill="#fff" />
      <circle cx={120} cy={50} r={4} fill="#fff" />
      {/* antennae */}
      <path d="M86,28 Q78,12 66,8 M114,28 Q122,12 134,8" fill="none" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
      <circle cx={66} cy={8} r={5} fill={OUTLINE} />
      <circle cx={134} cy={8} r={5} fill={OUTLINE} />
    </svg>
  );
};

/** Slim captured German V-2 rocket, nose up, animated flame. viewBox 0 0 300 620. */
const V2Rocket: React.FC<{ flame?: boolean }> = ({ flame = true }) => {
  const f = useCurrentFrame();
  const flick = 1 + Math.sin(f * 0.9) * 0.12 + Math.sin(f * 2.3) * 0.06;
  return (
    <svg viewBox="0 0 300 620" width="100%" height="100%" style={{ overflow: "visible" }}>
      {flame && (
        <g transform={`translate(150 560) scale(${flick} ${flick})`}>
          <path d="M0,0 Q-34,44 -18,96 Q0,128 18,96 Q34,44 0,0 Z" fill="#ff7b54" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
          <path d="M0,10 Q-16,40 -8,72 Q0,92 8,72 Q16,40 0,10 Z" fill="#ffd93b" />
        </g>
      )}
      {/* fins */}
      <path d="M62,470 L28,560 L62,560 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
      <path d="M238,470 L272,560 L238,560 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
      {/* body */}
      <path d="M62,500 L62,180 Q62,60 150,20 Q238,60 238,180 L238,500 Z" fill="#b8bfa8" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
      {/* olive band */}
      <path d="M62,230 L238,230 L238,272 L62,272 Z" fill="#4a5a3a" />
      <rect x={62} y={340} width={176} height={20} fill="#e8634a" />
      <text x={150} y={430} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={52} fill="#20242b" letterSpacing={4}>V-2</text>
      {/* window */}
      <circle cx={150} cy={130} r={18} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={5} />
      {/* engine block */}
      <rect x={62} y={500} width={176} height={60} rx={10} fill="#333" stroke={OUTLINE} strokeWidth={6} />
    </svg>
  );
};

/** Glass jar full of fruit flies (lab prop). viewBox 0 0 300 340. */
const JarOfFlies: React.FC = () => {
  const f = useCurrentFrame();
  const flies = [
    { x: 90, y: 120, s: 0.32 }, { x: 160, y: 90, s: 0.28 }, { x: 210, y: 150, s: 0.34 },
    { x: 120, y: 200, s: 0.3 }, { x: 190, y: 220, s: 0.26 }, { x: 150, y: 160, s: 0.3 },
  ];
  return (
    <svg viewBox="0 0 300 340" width="100%" height="100%" style={{ overflow: "visible" }}>
      <rect x={60} y={30} width={180} height={290} rx={24} fill="rgba(200,230,255,0.35)" stroke={OUTLINE} strokeWidth={7} />
      <rect x={52} y={14} width={196} height={34} rx={12} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
      {flies.map((fl, i) => (
        <g key={i} transform={`translate(${fl.x + Math.sin(f * 0.15 + i * 2) * 8} ${fl.y + Math.cos(f * 0.12 + i) * 6}) scale(${fl.s})`}>
          <g transform="translate(-100 -100)">
            <ellipse cx={100} cy={118} rx={46} ry={52} fill="#5a4632" stroke={OUTLINE} strokeWidth={10} />
            <circle cx={100} cy={58} r={34} fill="#3a2e22" stroke={OUTLINE} strokeWidth={10} />
            <ellipse cx={84} cy={56} rx={13} ry={16} fill="#e63b2e" />
            <ellipse cx={116} cy={56} rx={13} ry={16} fill="#e63b2e" />
          </g>
        </g>
      ))}
    </svg>
  );
};

/** Vertical altitude gauge 0-120 km with the 100 km Karman line marked. */
const AltitudeMeter: React.FC<{ progress: number }> = ({ progress }) => {
  const h = 900; // gauge height px inside a 1080x1920 frame (scaled by Abs)
  const yFor = (km: number) => h - (km / 120) * h;
  return (
    <svg viewBox="0 0 220 980" width="100%" height="100%" style={{ overflow: "visible" }}>
      <rect x={80} y={20} width={60} height={920} rx={30} fill="#1d2b4a" stroke={OUTLINE} strokeWidth={7} />
      <rect x={88} y={28} width={44} height={904} rx={22} fill="#2b3a5a" />
      {/* fill up to current altitude */}
      <rect x={88} y={yFor(109 * progress) + 8} width={44} height={904 - (yFor(109 * progress) - 20)} rx={22} fill="#ffd93b" />
      {/* Karman line marker at 100 km */}
      <g transform={`translate(0 ${yFor(100)})`}>
        <path d="M20,0 L200,0" stroke="#ff7b54" strokeWidth={8} strokeDasharray="16 10" />
        <text x={210} y={-14} fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={30} fill="#ff7b54">SPACE</text>
      </g>
      {[0, 50, 100].map((km) => (
        <text key={km} x={70} y={km === 100 ? yFor(km) - 16 : yFor(km) + 10} textAnchor="end" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={30} fill="#fff">{km}</text>
      ))}
      {/* rocket dot */}
      <g transform={`translate(110 ${yFor(109 * progress)})`}>
        <circle r={26} fill="#e8634a" stroke={OUTLINE} strokeWidth={6} />
        <text x={0} y={10} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={26} fill="#fff">▲</text>
      </g>
      <text x={110} y={975} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={30} fill="#fdf3d8">KM</text>
    </svg>
  );
};

/** Laika — chibi dog head. viewBox 0 0 240 240. */
const DogFace: React.FC = () => (
  <svg viewBox="0 0 240 240" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* floppy ears */}
    <path d="M52,60 Q20,120 44,180 Q66,150 70,100 Z" fill="#6b4423" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    <path d="M188,60 Q220,120 196,180 Q174,150 170,100 Z" fill="#6b4423" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    {/* head */}
    <circle cx={120} cy={120} r={82} fill="#c98d4b" stroke={OUTLINE} strokeWidth={7} />
    {/* forehead patch */}
    <path d="M60,96 Q120,40 180,96 Q160,60 120,58 Q80,60 60,96 Z" fill="#f5f5f0" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
    {/* eyes */}
    <circle cx={88} cy={110} r={9} fill={OUTLINE} />
    <circle cx={152} cy={110} r={9} fill={OUTLINE} />
    <circle cx={91} cy={107} r={3} fill="#fff" />
    <circle cx={155} cy={107} r={3} fill="#fff" />
    {/* snout */}
    <ellipse cx={120} cy={160} rx={44} ry={32} fill="#f5f5f0" stroke={OUTLINE} strokeWidth={5} />
    <ellipse cx={120} cy={146} rx={16} ry={11} fill={OUTLINE} />
    <path d="M120,157 L120,170 M120,170 Q106,182 94,172 M120,170 Q134,182 146,172" fill="none" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/** Chibi monkey head. viewBox 0 0 240 240. */
const MonkeyFace: React.FC = () => (
  <svg viewBox="0 0 240 240" width="100%" height="100%" style={{ overflow: "visible" }}>
    <circle cx={46} cy={120} r={30} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
    <circle cx={194} cy={120} r={30} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
    <circle cx={46} cy={120} r={14} fill="#f0c08c" />
    <circle cx={194} cy={120} r={14} fill="#f0c08c" />
    <circle cx={120} cy={118} r={84} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={7} />
    <ellipse cx={120} cy={140} rx={56} ry={48} fill="#f0c08c" stroke={OUTLINE} strokeWidth={5} />
    <circle cx={92} cy={104} r={9} fill={OUTLINE} />
    <circle cx={148} cy={104} r={9} fill={OUTLINE} />
    <circle cx={95} cy={101} r={3} fill="#fff" />
    <circle cx={151} cy={101} r={3} fill="#fff" />
    <ellipse cx={120} cy={140} rx={14} ry={10} fill={OUTLINE} />
    <path d="M120,150 L120,160 M120,160 Q108,170 98,162 M120,160 Q132,170 142,162" fill="none" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/** Radiation waves (animated arcs) */
const RadiationWaves: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const r = 40 + ((f * 2 + i * 40) % 120);
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="#ffd93b" strokeWidth={7}
            opacity={1 - (r - 40) / 120} />
        );
      })}
    </g>
  );
};

const Scene: React.FC<{ id: SceneId; lf: number; dur: number; t: number }> = ({ id, lf, dur, t }) => {
  const frame = useCurrentFrame();
  const mouth = mouthAt(t);
  switch (id) {
    case "hook": {
      // V-2 flies across the TOP toward the stars; big text sits below its path
      const rocketX = interpolate(lf, [0, dur], [-140, 700]);
      const rocketY = interpolate(lf, [0, dur], [1150, 250]);
      return (
        <>
          <SpacePlate />
          <Abs left={rocketX} top={rocketY} width={170} height={352} style={{ transform: "rotate(24deg)" }}>
            <V2Rocket />
          </Abs>
          {/* three fluttering flies */}
          <Abs left={300} top={480} width={110} height={110} style={{ transform: `translateY(${Math.sin(frame * 0.2) * 14}px)` }}>
            <FruitFly />
          </Abs>
          <Abs left={820} top={620} width={90} height={90} style={{ transform: `translateY(${Math.cos(frame * 0.17) * 12}px)` }}>
            <FruitFly flip />
          </Abs>
          {lf > 55 && (
            <Abs left={0} top={1050} width={1080}>
              <ChalkText size={150} color="#ffd93b" delay={55}>FRUIT FLIES</ChalkText>
            </Abs>
          )}
          {lf > 100 && (
            <Abs left={0} top={1300} width={1080}>
              <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 52, color: "#fff", textAlign: "center", opacity: 0.95 }}>
                the first animals in space…
              </div>
            </Abs>
          )}
          {lf > 150 && (
            <Abs left={0} top={1420} width={1080}>
              <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 44, color: "#ff7b54", textAlign: "center" }}>
                on a captured Nazi rocket!
              </div>
            </Abs>
          )}
        </>
      );
    }
    case "feb1947":
      return (
        <>
          <PushIn dur={dur}><LaunchPadPlate /></PushIn>
          <Abs left={64} top={250}><Badge>FEB 1947</Badge></Abs>
          <Abs left={64} top={380}><Badge color="#2f9e44">WHITE SANDS, NEW MEXICO</Badge></Abs>
          <Abs left={420} top={900} width={240} height={496}>
            <V2Rocket flame={false} />
          </Abs>
          <Abs left={0} top={1560} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 48, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              the desert launch site
            </div>
          </Abs>
        </>
      );
    case "scientists":
      return (
        <>
          <QuarantinePlate />
          <Abs left={64} top={250}><Badge>THE SCIENTISTS</Badge></Abs>
          <Abs left={90} top={900} width={290} height={435}>
            <Crewman shirt="#f5f5f0" expression="think" mouth={mouth} arm="down" seed={1} />
          </Abs>
          <Abs left={420} top={900} width={290} height={435}>
            <Crewman shirt="#7ec8f0" expression="happy" mouth="closed" arm="point" seed={2} />
          </Abs>
          <Abs left={740} top={980} width={260} height={295}>
            <JarOfFlies />
          </Abs>
          <Abs left={0} top={1560} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 56, color: "#fdf3d8", textAlign: "center" }}>
              packing a capsule full of flies
            </div>
          </Abs>
        </>
      );
    case "question":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={360} width={1080}>
            <ChalkText size={170}>RADIATION?</ChalkText>
          </Abs>
          <Abs left={0} top={600} width={1080}>
            <ChalkText size={72} color="#ffd93b" delay={6}>WOULD SPACE MUTATE</ChalkText>
          </Abs>
          <Abs left={0} top={720} width={1080}>
            <ChalkText size={72} color="#ffd93b" delay={10}>LIVING THINGS?</ChalkText>
          </Abs>
          <Abs left={330} top={950} width={420} height={630}>
            <Agent expression="worried" mouth={mouth} arm="down" />
          </Abs>
          <Abs left={0} top={0} width={1080} height={1920}>
            <svg viewBox="0 0 1080 1920" width="100%" height="100%">
              <RadiationWaves cx={540} cy={1180} />
            </svg>
          </Abs>
        </>
      );
    case "perfectTest":
      return (
        <>
          <SpacePlate />
          <Abs left={340} top={480} width={400} height={400} style={{ transform: `scale(${pop(lf / 8)})` }}>
            <FruitFly />
          </Abs>
          <Abs left={0} top={1020} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 12) / 8)})` }}>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 76, color: "#fff", backgroundColor: "#2f9e44", border: `6px solid ${OUTLINE}`, borderRadius: 999, padding: "22px 52px" }}>
                PERFECT TEST SUBJECTS
              </span>
            </div>
          </Abs>
          <Abs left={0} top={1300} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 48, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              tiny, cheap, and easy to breed
            </div>
          </Abs>
        </>
      );
    case "genes75":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={380} width={1080}>
            <ChalkText size={300} color="#ffd93b">75%</ChalkText>
          </Abs>
          <Abs left={0} top={760} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#fff", textAlign: "center" }}>
              OF OUR DISEASE GENES
            </div>
          </Abs>
          <Abs left={390} top={1000} width={300} height={300}>
            <FruitFly />
          </Abs>
          <Abs left={0} top={1420} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 48, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              if space broke them, it would break us too
            </div>
          </Abs>
        </>
      );
    case "launch": {
      const progress = smooth(lf / dur);
      const rocketY = interpolate(progress, [0, 1], [1250, 180]);
      const show109 = lf > dur - 30;
      return (
        <>
          <SpacePlate />
          <Abs left={120} top={rocketY} width={200} height={413}>
            <V2Rocket />
          </Abs>
          <Abs left={760} top={500} width={220} height={980}>
            <AltitudeMeter progress={progress} />
          </Abs>
          {show109 && (
            <Abs left={0} top={1560} width={1080}>
              <div style={{ textAlign: "center", transform: `scale(${pop((lf - (dur - 30)) / 8)})` }}>
                <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 120, color: "#ffd93b", textShadow: "0 6px 0 rgba(0,0,0,0.4)" }}>
                  109 KM!
                </span>
              </div>
            </Abs>
          )}
          <Abs left={0} top={300} width={1080}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 52, color: "#fff", backgroundColor: "#1d2b4a", border: `5px solid ${OUTLINE}`, borderRadius: 999, padding: "14px 40px" }}>
                FEBRUARY 20th — UP IT GOES
              </span>
            </div>
          </Abs>
        </>
      );
    }
    case "parachute": {
      const fall = smooth(lf / dur);
      const capY = interpolate(fall, [0, 1], [250, 700]);
      const showAlive = lf > 199;
      return (
        <>
          <PushIn dur={dur}><LaunchPadPlate /></PushIn>
          <Abs left={64} top={250}><Badge>190 SECONDS</Badge></Abs>
          <Abs left={290} top={capY} width={500} height={500}>
            <Capsule />
          </Abs>
          {showAlive && (
            <Abs left={0} top={1420} width={1080}>
              <div style={{ textAlign: "center", transform: `scale(${pop((lf - 199) / 8)})` }}>
                <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 110, color: "#fff", backgroundColor: "#2f9e44", border: `6px solid ${OUTLINE}`, borderRadius: 999, padding: "22px 56px" }}>
                  ALIVE!
                </span>
              </div>
            </Abs>
          )}
          <Abs left={0} top={1700} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 46, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              the capsule floated back down…
            </div>
          </Abs>
        </>
      );
    }
    case "earlier1946":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={360} width={1080}>
            <ChalkText size={200}>1946</ChalkText>
          </Abs>
          <Abs left={390} top={700} width={300} height={300}>
            <FruitFly />
          </Abs>
          <Abs left={330} top={640} width={420} height={420}>
            <RedX size={420} delay={10} />
          </Abs>
          <Abs left={0} top={1180} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 62, color: "#ff7b54", textAlign: "center" }}>
              NOBODY BROUGHT
            </div>
          </Abs>
          <Abs left={0} top={1280} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 62, color: "#ff7b54", textAlign: "center" }}>
              THEM HOME ALIVE
            </div>
          </Abs>
        </>
      );
    case "firstAlive": {
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={340} width={1080}>
            <ChalkText size={130}>FIRST TIME</ChalkText>
          </Abs>
          <Abs left={0} top={520} width={1080}>
            <ChalkText size={130} color="#ffd93b" delay={6}>EVER</ChalkText>
          </Abs>
          <Abs left={340} top={820} width={400} height={400}>
            <FruitFly />
          </Abs>
          <Abs left={0} top={1300} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 40) / 8)})` }}>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#fff", backgroundColor: "#2f9e44", border: `6px solid ${OUTLINE}`, borderRadius: 999, padding: "22px 52px" }}>
                SPACE — AND BACK ALIVE
              </span>
            </div>
          </Abs>
        </>
      );
    }
    case "youSee":
      return (
        <>
          <PushIn dur={dur} to={1.08}><MoonPlate /></PushIn>
          <Abs left={340} top={420} width={400} height={400} style={{ transform: `scale(${pop(lf / 8)})` }}>
            <FruitFly />
          </Abs>
          <Abs left={0} top={920} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#fff", textAlign: "center" }}>
              THEY PROVED IT
            </div>
          </Abs>
          <Abs left={120} top={1120} width={300} height={450}>
            <Crewman shirt="#f5f5f0" expression="happy" mouth={mouth} arm="oneUp" />
          </Abs>
          <Abs left={560} top={1180} width={400}>
            <SpeechBubble size={48} delay={10} tail="left">living things can survive space!</SpeechBubble>
          </Abs>
        </>
      );
    case "withoutThem":
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={340} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#fdf3d8", textAlign: "center" }}>
              WITHOUT THEM?
            </div>
          </Abs>
          {/* dog */}
          <Abs left={90} top={560} width={240} height={240}><DogFace /></Abs>
          <Abs left={90} top={800} width={240}><div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 44, color: "#fff", textAlign: "center" }}>NO DOG</div></Abs>
          <Abs left={120} top={590} width={180} height={180}><RedX size={180} delay={8} /></Abs>
          {/* monkey */}
          <Abs left={420} top={560} width={240} height={240}><MonkeyFace /></Abs>
          <Abs left={420} top={800} width={240}><div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 44, color: "#fff", textAlign: "center" }}>NO MONKEY</div></Abs>
          <Abs left={450} top={590} width={180} height={180}><RedX size={180} delay={20} /></Abs>
          {/* human */}
          <Abs left={750} top={520} width={240} height={360}><Astronaut patch="#e8634a" expression="worried" mouth="closed" /></Abs>
          <Abs left={750} top={890} width={240}><div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 44, color: "#fff", textAlign: "center" }}>NO HUMAN</div></Abs>
          <Abs left={780} top={590} width={180} height={180}><RedX size={180} delay={32} /></Abs>
          <Abs left={0} top={1150} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 48, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              nobody would ever have flown
            </div>
          </Abs>
        </>
      );
    case "laika":
      return (
        <>
          <SpacePlate />
          <Abs left={64} top={250}><Badge>10 YEARS LATER</Badge></Abs>
          <Abs left={330} top={520} width={420} height={420} style={{ transform: `scale(${pop(lf / 8)})` }}>
            <DogFace />
          </Abs>
          <Abs left={0} top={1020} width={1080}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 110, color: "#ffd93b" }}>
                LAIKA
              </span>
            </div>
          </Abs>
          <Abs left={0} top={1200} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 64, color: "#fff", textAlign: "center" }}>
              THE DOG — 1957
            </div>
          </Abs>
          <Abs left={0} top={1420} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 48, color: "#fdf3d8", textAlign: "center", opacity: 0.9 }}>
              the famous dog came a whole decade later
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
              SMALLER THAN YOUR
            </div>
          </Abs>
          <Abs left={0} top={460} width={1080}>
            <ChalkText size={150} color="#ffd93b" delay={4}>FINGERNAIL</ChalkText>
          </Abs>
          <Abs left={440} top={760} width={200} height={200}>
            <FruitFly />
          </Abs>
          <Abs left={0} top={1080} width={1080}>
            <div style={{ fontFamily: FONT_FAMILY, fontWeight: 600, fontSize: 52, color: "#fff", textAlign: "center" }}>
              the real first space travellers…
            </div>
          </Abs>
          <Abs left={0} top={1420} width={1080}>
            <div style={{ textAlign: "center", transform: `scale(${pop((lf - 60) / 8)})` }}>
              <span style={{ fontFamily: FONT_FAMILY, fontWeight: 700, fontSize: 96, color: "#fff", backgroundColor: "#2f9e44", border: `6px solid ${OUTLINE}`, borderRadius: 999, padding: "22px 56px" }}>
                THEY CAME HOME!
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

export const FruitFliesShort: React.FC = () => {
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
