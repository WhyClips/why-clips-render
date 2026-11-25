// SIMPLE 2D STICK FIGURES for "The Glassmaker" ONLY (Azhar's instruction).
// TheRealWhy style: round head, thin stick limbs, simple flat faces —
// NOT the Gullak chibi style in characters.tsx (that file is kept, just
// unused for this video). All figures share viewBox 0 0 240 360 so they
// swap 1:1 with the chibi cast in scenes. Thick black outlines throughout.
// Mouth shapes are driven by Rhubarb Lip Sync cues (mouthAt in story.ts).
import React from "react";
import { useCurrentFrame } from "remotion";
import { OUTLINE } from "./characters";
import type { MouthShape } from "./story";

export type StickExpression = "neutral" | "worried" | "laughing" | "shocked";
export type StickMouth = MouthShape;
export type StickArm = "down" | "oneUp" | "bothUp" | "point";

export type StickFigureProps = {
  expression?: StickExpression;
  mouth?: StickMouth;
  arm?: StickArm;
  flip?: boolean;
  bob?: boolean;
  seed?: number;
};

const SKIN = "#f0c08c";
const LIMB = { stroke: OUTLINE, strokeWidth: 6, strokeLinecap: "round" as const, fill: "none" };
const EYE_L = 106;
const EYE_R = 134;
const EYE_Y = 64;
const MOUTH_Y = 88;

function StickEyes({ expression }: { expression: StickExpression }) {
  const dot = (cx: number, r = 4.5) => <circle cx={cx} cy={EYE_Y} r={r} fill={OUTLINE} />;
  const brow = (x1: number, y1: number, x2: number, y2: number) => (
    <path d={`M${x1},${y1} L${x2},${y2}`} stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
  );
  switch (expression) {
    case "laughing":
      return (
        <g fill="none" stroke={OUTLINE} strokeWidth={4.5} strokeLinecap="round">
          <path d="M97,66 Q106,56 115,66" />
          <path d="M125,66 Q134,56 143,66" />
          <path d="M94,76 L100,72 M146,76 L140,72" strokeWidth={3.5} />
        </g>
      );
    case "worried":
      return (
        <g>
          {dot(EYE_L)} {dot(EYE_R)}
          {brow(97, 52, 115, 46)}
          {brow(125, 46, 143, 52)}
          {/* sweat drop */}
          <path d="M162,44 Q170,56 162,62 Q154,56 162,44 Z" fill="#7ec8f0" stroke={OUTLINE} strokeWidth={3.5} />
        </g>
      );
    case "shocked":
      return (
        <g>
          <circle cx={EYE_L} cy={EYE_Y} r={9} fill="#fff" stroke={OUTLINE} strokeWidth={4} />
          <circle cx={EYE_R} cy={EYE_Y} r={9} fill="#fff" stroke={OUTLINE} strokeWidth={4} />
          <circle cx={EYE_L} cy={EYE_Y} r={3.5} fill={OUTLINE} />
          <circle cx={EYE_R} cy={EYE_Y} r={3.5} fill={OUTLINE} />
          {brow(96, 46, 116, 42)}
          {brow(124, 42, 144, 46)}
        </g>
      );
    default:
      return (
        <g>
          {dot(EYE_L)} {dot(EYE_R)}
        </g>
      );
  }
}

function StickMouth({ mouth, expression }: { mouth: StickMouth; expression: StickExpression }) {
  // laughing with a closed cue still reads as a laugh (same rule as chibi)
  if (expression === "laughing" && mouth === "closed") {
    return (
      <g>
        <ellipse cx={120} cy={MOUTH_Y + 4} rx={14} ry={10} fill="#6e1f1f" stroke={OUTLINE} strokeWidth={4} />
        <path d="M108,86 Q120,91 132,86 L132,82 Q120,86 108,82 Z" fill="#fff" />
      </g>
    );
  }
  if (expression === "shocked" && mouth === "closed") {
    return <circle cx={120} cy={MOUTH_Y + 2} r={6} fill="#6e1f1f" stroke={OUTLINE} strokeWidth={4} />;
  }
  if (mouth === "open")
    return <ellipse cx={120} cy={MOUTH_Y + 3} rx={9} ry={12} fill="#6e1f1f" stroke={OUTLINE} strokeWidth={4} />;
  if (mouth === "grin")
    return (
      <g>
        <rect x={102} y={MOUTH_Y - 6} width={36} height={20} rx={9} fill="#fff" stroke={OUTLINE} strokeWidth={4} />
        <path d="M120,82 L120,100 M110,82 L110,99 M130,82 L130,99" stroke={OUTLINE} strokeWidth={2} />
      </g>
    );
  if (expression === "worried")
    return <path d="M110,90 Q120,85 130,90" fill="none" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />;
  return <path d="M110,88 Q120,93 130,88" fill="none" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />;
}

/** Stick arms from the shoulders (120,142). `thick` = blacksmith arms. */
function StickArms({ arm, thick = false }: { arm: StickArm; thick?: boolean }) {
  const s = { ...LIMB, strokeWidth: thick ? 11 : 6 };
  const hand = (cx: number, cy: number) => <circle cx={cx} cy={cy} r={thick ? 8 : 6} fill={SKIN} stroke={OUTLINE} strokeWidth={4} />;
  const leftDown = (
    <>
      <path d="M120,142 L88,204" {...s} />
      {hand(86, 208)}
    </>
  );
  switch (arm) {
    case "oneUp":
      return (
        <g>
          {leftDown}
          <path d="M120,142 L176,84" {...s} />
          {hand(179, 80)}
        </g>
      );
    case "bothUp":
      return (
        <g>
          <path d="M120,142 L64,84" {...s} />
          {hand(61, 80)}
          <path d="M120,142 L176,84" {...s} />
          {hand(179, 80)}
        </g>
      );
    case "point":
      return (
        <g>
          {leftDown}
          <path d="M120,142 L196,142" {...s} />
          {hand(200, 142)}
        </g>
      );
    default:
      return (
        <g>
          {leftDown}
          <path d="M120,142 L152,204" {...s} />
          {hand(154, 208)}
        </g>
      );
  }
}

/** Stick legs from the hips (120,212) + little shoes. */
function StickLegs() {
  return (
    <g>
      <path d="M120,212 L94,302" {...LIMB} />
      <path d="M120,212 L146,302" {...LIMB} />
      <ellipse cx={90} cy={306} rx={11} ry={5.5} fill="#503722" stroke={OUTLINE} strokeWidth={4} />
      <ellipse cx={150} cy={306} rx={11} ry={5.5} fill="#503722" stroke={OUTLINE} strokeWidth={4} />
    </g>
  );
}

/** Shared stick-figure shell: head + face + torso line, wrapped with
 * optional bob and flip. `children` draws costume/body extras. */
const StickShell: React.FC<
  StickFigureProps & { children?: React.ReactNode }
> = ({ expression = "neutral", mouth = "closed", flip = false, bob = true, seed = 0, children }) => {
  const frame = useCurrentFrame();
  const bobY = bob ? Math.sin((frame + seed * 20) * 0.18) * 3 : 0;
  return (
    <svg viewBox="0 0 240 360" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={flip ? "translate(240,0) scale(-1,1)" : undefined}>
        <g transform={`translate(0 ${bobY})`}>
          <ellipse cx={120} cy={330} rx={64} ry={9} fill="#000" opacity={0.14} />
          {children}
          {/* neck + torso stick */}
          <path d="M120,106 L120,124" {...LIMB} />
          <path d="M120,124 L120,212" {...LIMB} />
          {/* head */}
          <circle cx={120} cy={70} r={36} fill={SKIN} stroke={OUTLINE} strokeWidth={6} />
          <StickEyes expression={expression} />
          <StickMouth mouth={mouth} expression={expression} />
        </g>
      </g>
    </svg>
  );
};

/** The glassmaker — flat cap + leather apron. */
export const StickGlassmaker: React.FC<StickFigureProps> = (p) => (
  <StickShell {...p}>
    <StickLegs />
    <StickArms arm={p.arm ?? "down"} />
    {/* apron */}
    <path d="M96,132 L144,132 L150,232 L90,232 Z" fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    <path d="M100,132 L110,118 M140,132 L130,118" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
    <rect x={108} y={180} width={24} height={20} rx={5} fill="#6b4f2a" stroke={OUTLINE} strokeWidth={4} />
    {/* flat cap */}
    <path d="M84,62 Q84,24 120,22 Q156,24 156,62 Q138,48 120,48 Q102,48 84,62 Z" fill="#7a6a4f" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
    <ellipse cx={158} cy={60} rx={14} ry={5} fill="#6b5c40" stroke={OUTLINE} strokeWidth={4} />
  </StickShell>
);

/** The king — gold crown + royal red robe (robe hides the legs). */
export const StickKing: React.FC<StickFigureProps> = (p) => (
  <StickShell {...p}>
    {/* robe (drawn before the shell's torso line so the line hides inside) */}
    <path d="M88,140 L152,140 L170,310 L70,310 Z" fill="#a93226" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    <path d="M76,292 L164,292" stroke="#ffd93b" strokeWidth={6} strokeLinecap="round" />
    <circle cx={120} cy={160} r={7} fill="#ffd93b" stroke={OUTLINE} strokeWidth={4} />
    {/* arms poke out of the robe sleeves */}
    <path d="M96,152 L66,206" {...LIMB} />
    <circle cx={64} cy={210} r={6} fill={SKIN} stroke={OUTLINE} strokeWidth={4} />
    <path d="M144,152 L174,206" {...LIMB} />
    <circle cx={176} cy={210} r={6} fill={SKIN} stroke={OUTLINE} strokeWidth={4} />
    {/* feet peeking under the robe */}
    <ellipse cx={96} cy={314} rx={11} ry={5.5} fill="#503722" stroke={OUTLINE} strokeWidth={4} />
    <ellipse cx={144} cy={314} rx={11} ry={5.5} fill="#503722" stroke={OUTLINE} strokeWidth={4} />
    {/* crown */}
    <path d="M86,52 L88,20 L102,36 L112,14 L120,34 L128,14 L138,36 L152,20 L154,52 Z" fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={120} cy={44} r={4} fill="#e63b2e" />
    <circle cx={100} cy={42} r={3} fill="#2b4a9e" />
    <circle cx={140} cy={42} r={3} fill="#2f9e44" />
  </StickShell>
);

/** The blacksmith — dark apron, beard, BIG thick arms. */
export const StickBlacksmith: React.FC<StickFigureProps> = (p) => (
  <StickShell {...p}>
    <StickLegs />
    <StickArms arm={p.arm ?? "down"} thick />
    {/* apron */}
    <path d="M94,132 L146,132 L152,236 L88,236 Z" fill="#3a3a3a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    <path d="M98,132 L108,118 M142,132 L132,118" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
    <rect x={106} y={182} width={28} height={22} rx={5} fill="#2b2b2b" stroke={OUTLINE} strokeWidth={4} />
    {/* beard under the mouth */}
    <path d="M100,94 Q120,124 140,94 Q138,112 120,116 Q102,112 100,94 Z" fill="#5a4020" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
    {/* headband */}
    <path d="M86,52 Q120,38 154,52" fill="none" stroke="#e63b2e" strokeWidth={7} strokeLinecap="round" />
  </StickShell>
);

// ---------------- props ----------------

/** Prince Rupert's drop — fat translucent bulb + long thin tail.
 * viewBox 0 0 200 320. */
export const GlassDrop: React.FC = () => (
  <svg viewBox="0 0 200 320" width="100%" height="100%" style={{ overflow: "visible" }}>
    <path
      d="M100,8 C106,80 112,140 128,180 C160,200 172,230 168,256 C164,284 134,300 100,300 C66,300 36,284 32,256 C28,230 40,200 72,180 C88,140 94,80 100,8 Z"
      fill="rgba(165,205,255,0.45)"
      stroke={OUTLINE}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path d="M56,228 Q54,268 84,284" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.85} />
    <path d="M96,40 Q100,90 96,140" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
  </svg>
);

/** Work hammer (mallet head + wooden handle). viewBox 0 0 300 300. */
export const Hammer: React.FC = () => (
  <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g transform="rotate(35 150 150)">
      <rect x={142} y={96} width={16} height={176} rx={8} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={5} />
      <rect x={88} y={48} width={124} height={56} rx={14} fill="#555" stroke={OUTLINE} strokeWidth={6} />
      <rect x={88} y={48} width={124} height={18} rx={9} fill="#777" />
    </g>
  </svg>
);

/** Pliers — steel jaws, red grips. viewBox 0 0 300 300. */
export const Pliers: React.FC = () => (
  <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* jaws */}
    <path d="M150,150 L116,44 L140,38 L162,138 Z" fill="#9aa0a6" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
    <path d="M150,150 L184,44 L160,38 L138,138 Z" fill="#9aa0a6" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
    {/* handles */}
    <path d="M150,158 L104,272" stroke={OUTLINE} strokeWidth={15} strokeLinecap="round" />
    <path d="M150,158 L196,272" stroke={OUTLINE} strokeWidth={15} strokeLinecap="round" />
    <path d="M150,158 L104,272" stroke="#c0392b" strokeWidth={8} strokeLinecap="round" />
    <path d="M150,158 L196,272" stroke="#c0392b" strokeWidth={8} strokeLinecap="round" />
    {/* pivot */}
    <circle cx={150} cy={150} r={14} fill="#555" stroke={OUTLINE} strokeWidth={5} />
    <circle cx={150} cy={150} r={5} fill="#bbb" />
  </svg>
);

/** Giant glass bolt — hex head, long shaft, pointed tip, translucent blue.
 * viewBox 0 0 300 460. */
export const VaultBolt: React.FC = () => (
  <svg viewBox="0 0 300 460" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* hex head */}
    <polygon
      points="150,14 210,48 210,116 150,150 90,116 90,48"
      fill="rgba(165,205,255,0.5)"
      stroke={OUTLINE}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <polygon points="150,40 186,60 186,102 150,122 114,102 114,60" fill="none" stroke="#fff" strokeWidth={4} opacity={0.7} />
    {/* shaft */}
    <rect x={118} y={150} width={64} height={250} fill="rgba(165,205,255,0.4)" stroke={OUTLINE} strokeWidth={7} />
    <path d="M132,170 L132,380" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
    {/* thread lines */}
    <path d="M118,200 L182,200 M118,250 L182,250 M118,300 L182,300 M118,350 L182,350" stroke={OUTLINE} strokeWidth={4} opacity={0.5} />
    {/* pointed tip */}
    <path d="M118,400 L182,400 L150,452 Z" fill="rgba(165,205,255,0.5)" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    {/* sparkles */}
    <path d="M232,180 L236,192 L248,196 L236,200 L232,212 L228,200 L216,196 L228,192 Z" fill="#fff" />
    <path d="M64,280 L67,289 L76,292 L67,295 L64,304 L61,295 L52,292 L61,289 Z" fill="#fff" />
  </svg>
);

/** Pile of gold coins. viewBox 0 0 400 260. */
export const GoldPile: React.FC = () => {
  const coin = (cx: number, cy: number, key: string) => (
    <g key={key}>
      <ellipse cx={cx} cy={cy} rx={36} ry={15} fill="#ffd93b" stroke={OUTLINE} strokeWidth={4} />
      <ellipse cx={cx} cy={cy} rx={22} ry={8} fill="none" stroke="#b8860b" strokeWidth={3} />
    </g>
  );
  return (
    <svg viewBox="0 0 400 260" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* bottom row */}
      {coin(80, 228, "b1")} {coin(150, 232, "b2")} {coin(220, 232, "b3")} {coin(290, 228, "b4")} {coin(350, 232, "b5")}
      {/* middle row */}
      {coin(115, 196, "m1")} {coin(185, 200, "m2")} {coin(255, 196, "m3")} {coin(320, 200, "m4")}
      {/* top row */}
      {coin(150, 164, "t1")} {coin(220, 168, "t2")} {coin(285, 164, "t3")}
      {/* peak coins */}
      {coin(185, 132, "p1")} {coin(250, 132, "p2")}
      <g transform="translate(216 84) rotate(12)">
        <ellipse cx={0} cy={0} rx={15} ry={34} fill="#ffd93b" stroke={OUTLINE} strokeWidth={4} />
        <ellipse cx={0} cy={0} rx={8} ry={20} fill="none" stroke="#b8860b" strokeWidth={3} />
      </g>
      {/* sparkles */}
      <path d="M60,120 L64,134 L78,138 L64,142 L60,156 L56,142 L42,138 L56,134 Z" fill="#fff" />
      <path d="M330,80 L333,91 L344,94 L333,97 L330,108 L327,97 L316,94 L327,91 Z" fill="#fff" />
    </svg>
  );
};
