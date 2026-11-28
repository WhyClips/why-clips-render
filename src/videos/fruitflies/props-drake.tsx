// Drake–Cimarrones props — Gullak flat style: thick OUTLINE strokes, flat cel
// colours, simple readable shapes at 1080x1920. All original designs.
import React from "react";
import { useCurrentFrame } from "remotion";
import { OUTLINE } from "./characters";

/** One mule, side view, walking right. viewBox 0 0 300 260. */
export const Mule: React.FC<{ flip?: boolean }> = ({ flip = false }) => {
  const f = useCurrentFrame();
  const step = Math.sin(f * 0.35) * 6;
  return (
    <svg viewBox="0 0 300 260" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={flip ? "translate(300,0) scale(-1,1)" : undefined}>
        {/* legs (two walking, two planted) */}
        <g stroke={OUTLINE} strokeWidth={6} strokeLinecap="round">
          <path d={`M90,180 L84,${236 + step}`} stroke="#5a3d28" strokeWidth={14} />
          <path d={`M120,182 L126,${238 - step}`} stroke="#5a3d28" strokeWidth={14} />
          <path d="M200,180 L206,238" stroke="#5a3d28" strokeWidth={14} />
          <path d="M228,182 L222,238" stroke="#5a3d28" strokeWidth={14} />
        </g>
        {/* body */}
        <ellipse cx={160} cy={150} rx={92} ry={58} fill="#b08d5a" stroke={OUTLINE} strokeWidth={7} />
        <ellipse cx={160} cy={132} rx={70} ry={34} fill="#c9a878" />
        {/* neck + head */}
        <path d="M228,140 Q258,110 262,76 L292,66 L286,108 Q280,140 246,158 Z" fill="#b08d5a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
        {/* ears */}
        <path d="M252,80 L246,44 L264,52 Z" fill="#b08d5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M272,74 L274,38 L288,50 Z" fill="#b08d5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        {/* eye + muzzle */}
        <circle cx={276} cy={82} r={6} fill={OUTLINE} />
        <ellipse cx={288} cy={100} rx={14} ry={10} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={4} />
        {/* tail */}
        <path d="M72,140 Q52,170 58,210" fill="none" stroke="#5a3d28" strokeWidth={10} strokeLinecap="round" />
        {/* silver pack on the back */}
        <rect x={120} y={70} width={90} height={46} rx={10} fill="#8a8f96" stroke={OUTLINE} strokeWidth={6} />
        <rect x={132} y={80} width={66} height={12} rx={6} fill="#c8ccd2" />
        <path d="M120,70 L210,70 M120,116 L210,116" stroke="#5a5a6e" strokeWidth={4} />
        {/* saddle blanket */}
        <path d="M110,120 L220,120 L210,160 L120,160 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/** Three mules in a line, loaded with silver — the treasure road. viewBox 0 0 900 300.
 * Each mule gets an explicit nested viewport (x/y/width/height) so its size
 * is exact — percentage widths on nested SVGs inside <g> transforms are
 * ambiguous and made the third mule render off-frame. */
export const MuleTrain: React.FC = () => (
  <svg viewBox="0 0 900 300" width="100%" height="100%" style={{ overflow: "visible" }}>
    <svg x={0} y={10} width={300} height={260}><Mule /></svg>
    <svg x={300} y={30} width={285} height={247}><Mule /></svg>
    <svg x={600} y={5} width={300} height={260}><Mule /></svg>
    {/* dust puffs under the hooves */}
    <g fill="#d9c9a8" opacity={0.7}>
      <ellipse cx={90} cy={278} rx={34} ry={12} />
      <ellipse cx={390} cy={282} rx={30} ry={11} />
      <ellipse cx={700} cy={280} rx={34} ry={12} />
    </g>
  </svg>
);

/** A pile of silver bars + coins. viewBox 0 0 500 220. */
export const SilverPile: React.FC = () => (
  <svg viewBox="0 0 500 220" width="100%" height="100%" style={{ overflow: "visible" }}>
    <ellipse cx={250} cy={180} rx={190} ry={28} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
    {/* stacked bars */}
    <g stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round">
      <path d="M140,180 L160,140 L220,140 L240,180 Z" fill="#c8ccd2" />
      <path d="M230,180 L250,140 L310,140 L330,180 Z" fill="#aab0b8" />
      <path d="M320,180 L340,140 L400,140 L420,180 Z" fill="#c8ccd2" />
      <path d="M185,140 L205,102 L265,102 L285,140 Z" fill="#dfe3e8" />
      <path d="M275,140 L295,102 L355,102 L375,140 Z" fill="#c8ccd2" />
      <path d="M230,102 L248,66 L308,66 L326,102 Z" fill="#eef1f4" />
    </g>
    {/* shine lines */}
    <g stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.8}>
      <path d="M170,150 L190,150 M260,150 L280,150 M350,150 L370,150 M240,80 L260,80" />
    </g>
    {/* coins */}
    <g fill="#ffd93b" stroke={OUTLINE} strokeWidth={4}>
      <circle cx={90} cy={176} r={14} />
      <circle cx={120} cy={186} r={12} />
      <circle cx={420} cy={182} r={13} />
      <circle cx={450} cy={170} r={11} />
    </g>
  </svg>
);

/** Drake's galleon under sail. viewBox 0 0 600 500. */
export const PirateShip: React.FC = () => {
  const f = useCurrentFrame();
  const bob = Math.sin(f * 0.1) * 6;
  return (
    <svg viewBox="0 0 600 500" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bob})`}>
        {/* hull */}
        <path d="M80,320 L520,320 L470,440 Q300,470 130,440 Z" fill="#8a5a2b" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
        <path d="M80,320 L520,320 L500,360 L100,360 Z" fill="#6b4423" stroke={OUTLINE} strokeWidth={5} />
        {/* stern castle */}
        <rect x={420} y={240} width={100} height={90} rx={10} fill="#a06a35" stroke={OUTLINE} strokeWidth={6} />
        <rect x={440} y={262} width={24} height={28} rx={4} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={4} />
        <rect x={478} y={262} width={24} height={28} rx={4} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={4} />
        {/* bow */}
        <path d="M80,320 L60,260 L92,300 Z" fill="#a06a35" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        {/* masts */}
        <rect x={290} y={60} width={12} height={260} fill="#5a3d28" stroke={OUTLINE} strokeWidth={5} />
        <rect x={170} y={140} width={10} height={180} fill="#5a3d28" stroke={OUTLINE} strokeWidth={5} />
        <rect x={420} y={160} width={10} height={160} fill="#5a3d28" stroke={OUTLINE} strokeWidth={5} />
        {/* sails */}
        <path d="M296,70 L296,300 L400,300 Q380,180 296,70 Z" fill="#f5f5f0" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
        <path d="M296,70 L296,300 L190,300 Q210,180 296,70 Z" fill="#e8e0cc" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
        <path d="M175,150 L175,300 L250,300 Q230,220 175,150 Z" fill="#f5f5f0" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M425,170 L425,300 L360,300 Q380,230 425,170 Z" fill="#f5f5f0" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        {/* red cross on the main sail */}
        <path d="M330,150 L350,150 L350,190 L390,190 L390,210 L350,210 L350,250 L330,250 L330,210 L290,210 L290,190 L330,190 Z" fill="#e63b2e" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" transform="translate(-12 10) scale(0.9)" />
        {/* flag */}
        <path d="M302,58 L370,70 L302,86 Z" fill="#e63b2e" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
        {/* waves */}
        <g stroke="#fff" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.8}>
          <path d="M40,470 Q80,450 120,470 Q160,490 200,470" />
          <path d="M380,470 Q420,450 460,470 Q500,490 540,470" />
        </g>
      </g>
    </svg>
  );
};

/** Big broadleaf jungle tree (palm-like). viewBox 0 0 400 700. */
export const JungleTree: React.FC = () => {
  const f = useCurrentFrame();
  const sway = Math.sin(f * 0.12) * 2;
  return (
    <svg viewBox="0 0 400 700" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`rotate(${sway} 200 680)`}>
        <path d="M188,560 Q180,400 200,240 L216,240 Q210,400 216,560 Z" fill="#7a4a21" stroke={OUTLINE} strokeWidth={6} />
        {/* fronds */}
        <g fill="#2f9e44" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round">
          <path d="M200,250 Q120,140 20,160 Q100,220 200,270 Z" />
          <path d="M200,250 Q280,140 380,160 Q300,220 200,270 Z" />
          <path d="M200,240 Q160,110 60,80 Q130,180 200,260 Z" />
          <path d="M200,240 Q240,110 340,80 Q270,180 200,260 Z" />
          <path d="M200,250 Q200,100 200,40 Q230,140 210,260 Z" />
        </g>
        {/* coconuts */}
        <circle cx={180} cy={270} r={16} fill="#6b4423" stroke={OUTLINE} strokeWidth={4} />
        <circle cx={216} cy={276} r={16} fill="#6b4423" stroke={OUTLINE} strokeWidth={4} />
      </g>
    </svg>
  );
};

/** Open treasure chest spilling silver. viewBox 0 0 500 320. */
export const TreasureChest: React.FC = () => (
  <svg viewBox="0 0 500 320" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* open lid */}
    <g transform="rotate(-32 250 140)">
      <rect x={110} y={40} width={280} height={90} rx={16} fill="#8a5a2b" stroke={OUTLINE} strokeWidth={7} />
      <rect x={110} y={40} width={280} height={26} fill="#6b4423" />
      <rect x={230} y={56} width={40} height={58} fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} />
    </g>
    {/* chest body */}
    <path d="M100,140 L400,140 L400,280 Q400,300 380,300 L120,300 Q100,300 100,280 Z" fill="#8a5a2b" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    <path d="M100,140 L400,140 L400,176 L100,176 Z" fill="#6b4423" stroke={OUTLINE} strokeWidth={5} />
    {/* metal bands */}
    <rect x={140} y={140} width={18} height={160} fill="#5a5a6e" stroke={OUTLINE} strokeWidth={4} />
    <rect x={342} y={140} width={18} height={160} fill="#5a5a6e" stroke={OUTLINE} strokeWidth={4} />
    {/* lock */}
    <rect x={228} y={150} width={44} height={40} rx={8} fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} />
    {/* silver spilling out */}
    <g stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round">
      <path d="M160,140 L180,108 L230,108 L250,140 Z" fill="#c8ccd2" />
      <path d="M250,140 L270,108 L320,108 L340,140 Z" fill="#aab0b8" />
      <path d="M205,108 L222,78 L272,78 L288,108 Z" fill="#eef1f4" />
    </g>
    <g fill="#ffd93b" stroke={OUTLINE} strokeWidth={4}>
      <circle cx={130} cy={130} r={12} />
      <circle cx={380} cy={126} r={13} />
      <circle cx={420} cy={150} r={10} />
    </g>
  </svg>
);

/** A small globe — "gave a pirate the world". viewBox 0 0 300 300. */
export const Globe: React.FC = () => {
  const f = useCurrentFrame();
  const spin = Math.sin(f * 0.05) * 8;
  return (
    <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* stand */}
      <ellipse cx={150} cy={272} rx={70} ry={14} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={5} />
      <rect x={142} y={240} width={16} height={30} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={4} />
      {/* globe */}
      <circle cx={150} cy={140} r={110} fill="#5aa8e8" stroke={OUTLINE} strokeWidth={7} />
      <g transform={`translate(${spin} 0)`}>
        <path d="M100,80 Q140,60 170,90 Q150,120 110,110 Z" fill="#6fbf5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M170,150 Q220,140 230,180 Q200,210 165,190 Q150,170 170,150 Z" fill="#6fbf5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M90,170 Q120,160 130,185 Q110,205 85,195 Z" fill="#6fbf5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      </g>
      {/* shine */}
      <path d="M80,80 Q100,50 140,44" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
    </svg>
  );
};

/** A brass compass — Drake "didn't know the jungle". viewBox 0 0 200 200. */
export const Compass: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: "visible" }}>
    <circle cx={100} cy={100} r={86} fill="#f5ecd7" stroke={OUTLINE} strokeWidth={7} />
    <circle cx={100} cy={100} r={70} fill="#fffdf5" stroke={OUTLINE} strokeWidth={4} />
    {/* ticks */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
      const r = (a * Math.PI) / 180;
      return (
        <line key={a} x1={100 + Math.cos(r) * 62} y1={100 + Math.sin(r) * 62} x2={100 + Math.cos(r) * 70} y2={100 + Math.sin(r) * 70} stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
      );
    })}
    {/* needle (spinning to nowhere) */}
    <path d="M100,100 L128,66 L108,100 L128,134 Z" fill="#e63b2e" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
    <path d="M100,100 L72,134 L92,100 L72,66 Z" fill="#5a5a6e" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={100} cy={100} r={10} fill="#ffd93b" stroke={OUTLINE} strokeWidth={4} />
    {/* N */}
    <text x={100} y={46} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={26} fill="#e63b2e">N</text>
  </svg>
);
