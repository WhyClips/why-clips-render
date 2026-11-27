// Segway props — Gullak flat style: thick OUTLINE strokes, flat cel colours,
// simple readable shapes at 1080x1920. All original designs.
import React from "react";
import { useCurrentFrame } from "remotion";
import { OUTLINE } from "./characters";

/** Off-road Segway X2 — two big knobbly wheels, platform, tall handlebar.
 *  viewBox 0 0 400 460. */
export const SegwayX2: React.FC = () => (
  <svg viewBox="0 0 400 460" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* handlebar stem */}
    <rect x={188} y={60} width={24} height={250} rx={10} fill="#4a4a4a" stroke={OUTLINE} strokeWidth={6} />
    {/* handlebar grips */}
    <rect x={110} y={46} width={180} height={28} rx={14} fill="#20242b" stroke={OUTLINE} strokeWidth={6} />
    <circle cx={110} cy={60} r={16} fill="#e8634a" stroke={OUTLINE} strokeWidth={5} />
    <circle cx={290} cy={60} r={16} fill="#e8634a" stroke={OUTLINE} strokeWidth={5} />
    {/* headlight */}
    <circle cx={200} cy={110} r={14} fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} />
    {/* platform */}
    <rect x={60} y={300} width={280} height={36} rx={14} fill="#8a8f96" stroke={OUTLINE} strokeWidth={7} />
    <rect x={60} y={300} width={280} height={14} rx={7} fill="#c8ccd2" />
    {/* fenders */}
    <path d="M40,300 Q40,230 110,224 L150,224 Q150,290 150,300 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    <path d="M360,300 Q360,230 290,224 L250,224 Q250,290 250,300 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    {/* wheels — big knobbly off-road tyres */}
    <circle cx={95} cy={360} r={72} fill="#20242b" stroke={OUTLINE} strokeWidth={7} />
    <circle cx={95} cy={360} r={40} fill="#8a8f96" stroke={OUTLINE} strokeWidth={6} />
    <circle cx={95} cy={360} r={14} fill="#c8ccd2" stroke={OUTLINE} strokeWidth={5} />
    <circle cx={305} cy={360} r={72} fill="#20242b" stroke={OUTLINE} strokeWidth={7} />
    <circle cx={305} cy={360} r={40} fill="#8a8f96" stroke={OUTLINE} strokeWidth={6} />
    <circle cx={305} cy={360} r={14} fill="#c8ccd2" stroke={OUTLINE} strokeWidth={5} />
    {/* tyre tread blocks */}
    {[-50, -25, 0, 25, 50].map((a) => {
      const r = (a * Math.PI) / 180;
      return (
        <g key={a}>
          <rect x={95 + Math.sin(r) * 72 - 10} y={360 - Math.cos(r) * 72 - 8} width={20} height={16} rx={4} fill="#20242b" stroke={OUTLINE} strokeWidth={4} transform={`rotate(${a} ${95 + Math.sin(r) * 72} ${360 - Math.cos(r) * 72})`} />
          <rect x={305 + Math.sin(r) * 72 - 10} y={360 - Math.cos(r) * 72 - 8} width={20} height={16} rx={4} fill="#20242b" stroke={OUTLINE} strokeWidth={4} transform={`rotate(${a} ${305 + Math.sin(r) * 72} ${360 - Math.cos(r) * 72})`} />
        </g>
      );
    })}
    {/* X2 badge */}
    <text x={200} y={330} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={22} fill="#20242b">X2</text>
  </svg>
);

/** Chibi dog — tan, floppy ears, wagging tail. viewBox 0 0 320 220. */
export const Dog: React.FC = () => {
  const f = useCurrentFrame();
  const wag = Math.sin(f * 0.35) * 14;
  const bob = Math.sin(f * 0.25) * 3;
  return (
    <svg viewBox="0 0 320 220" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* tail */}
      <path d={`M272,110 Q310,${96 + wag} 306,${66 + wag}`} stroke="#8a5a2b" strokeWidth={16} strokeLinecap="round" fill="none" />
      {/* body */}
      <g transform={`translate(0 ${bob})`}>
        <ellipse cx={160} cy={130} rx={105} ry={62} fill="#d9a066" stroke={OUTLINE} strokeWidth={7} />
        <ellipse cx={160} cy={152} rx={80} ry={34} fill="#f2c14e" opacity={0.55} />
        {/* legs */}
        <rect x={92} y={168} width={26} height={40} rx={10} fill="#d9a066" stroke={OUTLINE} strokeWidth={5} />
        <rect x={140} y={172} width={26} height={36} rx={10} fill="#d9a066" stroke={OUTLINE} strokeWidth={5} />
        <rect x={196} y={172} width={26} height={36} rx={10} fill="#d9a066" stroke={OUTLINE} strokeWidth={5} />
        <rect x={238} y={168} width={26} height={40} rx={10} fill="#d9a066" stroke={OUTLINE} strokeWidth={5} />
        {/* head */}
        <circle cx={62} cy={96} r={56} fill="#d9a066" stroke={OUTLINE} strokeWidth={7} />
        {/* floppy ear */}
        <path d="M40,52 Q14,86 30,128 Q52,140 60,104 Q64,66 40,52 Z" fill="#8a5a2b" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        {/* snout + nose */}
        <ellipse cx={14} cy={112} rx={26} ry={20} fill="#f2c14e" stroke={OUTLINE} strokeWidth={5} />
        <circle cx={2} cy={104} r={10} fill="#20242b" />
        {/* eye + happy mouth */}
        <circle cx={56} cy={84} r={7} fill="#20242b" />
        <path d="M20,132 Q40,146 62,134" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" fill="none" />
        {/* tongue */}
        <path d="M34,140 Q40,160 52,148 Q56,138 46,136 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/** Hesco blast wall — stacked wire-mesh cages filled with sand.
 *  viewBox 0 0 700 420. */
export const HescoWall: React.FC = () => (
  <svg viewBox="0 0 700 420" width="100%" height="100%" style={{ overflow: "visible" }}>
    {[0, 1].map((row) => (
      <g key={row} transform={`translate(0 ${row * 190})`}>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${30 + i * 220} 0)`}>
            <rect x={0} y={20} width={200} height={170} rx={8} fill="#c8a86a" stroke={OUTLINE} strokeWidth={7} />
            {/* mesh grid */}
            {[40, 80, 120, 160].map((x) => (
              <line key={x} x1={x} y1={20} x2={x} y2={190} stroke="#8a8f96" strokeWidth={4} />
            ))}
            {[60, 100, 140].map((y) => (
              <line key={y} x1={0} y1={y} x2={200} y2={y} stroke="#8a8f96" strokeWidth={4} />
            ))}
            {/* sand mound on top */}
            <path d="M10,20 Q100,-18 190,20 Z" fill="#e0c08a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
          </g>
        ))}
      </g>
    ))}
    {/* soldier helmet peeking over the top */}
    <g transform="translate(560 0)">
      <path d="M0,60 Q0,10 50,10 Q100,10 100,60 Z" fill="#5a6e3a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
      <rect x={-8} y={56} width={116} height={12} rx={6} fill="#4a5e2a" stroke={OUTLINE} strokeWidth={5} />
    </g>
  </svg>
);

/** Shopfront with a big SEGWAY sign + Christmas tree + snow.
 *  viewBox 0 0 700 500. */
export const ShopFront: React.FC = () => (
  <svg viewBox="0 0 700 500" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* building */}
    <rect x={40} y={140} width={620} height={320} fill="#f5f5f0" stroke={OUTLINE} strokeWidth={7} />
    <rect x={40} y={140} width={620} height={26} fill="#e8634a" stroke={OUTLINE} strokeWidth={5} />
    {/* SEGWAY sign */}
    <rect x={90} y={180} width={520} height={92} rx={16} fill="#20242b" stroke={OUTLINE} strokeWidth={7} />
    <text x={350} y={248} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={56} fill="#ffd93b" letterSpacing={6}>SEGWAY</text>
    {/* windows */}
    <rect x={90} y={300} width={200} height={120} rx={8} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={5} />
    <rect x={410} y={300} width={200} height={120} rx={8} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={5} />
    {/* door */}
    <rect x={310} y={300} width={80} height={160} rx={8} fill="#2b4a6e" stroke={OUTLINE} strokeWidth={5} />
    <circle cx={378} cy={384} r={6} fill="#ffd93b" />
    {/* Christmas tree by the door */}
    <g transform="translate(640 330)">
      <path d="M0,0 L34,60 L-34,60 Z" fill="#2f9e44" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      <path d="M0,-30 L28,20 L-28,20 Z" fill="#37b24d" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      <rect x={-6} y={60} width={12} height={20} fill="#7a4a21" stroke={OUTLINE} strokeWidth={4} />
      <circle cx={0} cy={-8} r={6} fill="#ffd93b" />
      <circle cx={-14} cy={30} r={5} fill="#e8634a" />
      <circle cx={16} cy={34} r={5} fill="#7ec8f0" />
    </g>
    {/* snow on the roof + ground */}
    <path d="M40,140 Q350,116 660,140 L660,150 L40,150 Z" fill="#ffffff" stroke={OUTLINE} strokeWidth={5} />
    <rect x={20} y={460} width={660} height={26} rx={10} fill="#ffffff" stroke={OUTLINE} strokeWidth={5} />
    {/* falling snowflakes */}
    {[{ x: 120, y: 60 }, { x: 300, y: 30 }, { x: 480, y: 70 }, { x: 580, y: 30 }, { x: 220, y: 100 }].map((s, i) => (
      <circle key={i} cx={s.x} cy={s.y} r={7} fill="#ffffff" stroke={OUTLINE} strokeWidth={3} />
    ))}
  </svg>
);

/** Inquest paper — official document with the verdict stamp.
 *  viewBox 0 0 600 420. */
export const InquestPaper: React.FC = () => (
  <svg viewBox="0 0 600 420" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g transform="rotate(-3 300 210)">
      <rect x={80} y={30} width={440} height={360} rx={10} fill="#fffdf5" stroke={OUTLINE} strokeWidth={7} />
      <text x={300} y={92} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={36} fill="#20242b">INQUEST</text>
      <rect x={120} y={116} width={360} height={12} rx={6} fill="#b8a888" />
      <rect x={120} y={142} width={360} height={12} rx={6} fill="#b8a888" />
      <rect x={120} y={168} width={280} height={12} rx={6} fill="#b8a888" />
      <rect x={120} y={210} width={360} height={12} rx={6} fill="#b8a888" />
      <rect x={120} y={236} width={300} height={12} rx={6} fill="#b8a888" />
      {/* verdict stamp */}
      <g transform="rotate(-8 300 310)">
        <rect x={140} y={280} width={320} height={64} rx={10} fill="none" stroke="#e63b2e" strokeWidth={7} />
        <text x={300} y={324} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={32} fill="#e63b2e" letterSpacing={2}>ACCIDENTAL DEATH</text>
      </g>
      {/* tick: no fault found */}
      <path d="M140,352 L160,372 L196,332" stroke="#2f9e44" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x={210} y={366} fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={26} fill="#2f9e44">NO FAULT FOUND</text>
    </g>
  </svg>
);

/** Cliff edge above the River Wharfe — full 1080x1920 plate.
 *  Green clifftop with a footpath, brown cliff face, blue river below. */
export const CliffPlate: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="segSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8fc7e8" />
        <stop offset="100%" stopColor="#d6ecf7" />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={1080} height={1920} fill="url(#segSky)" />
    {/* sun + clouds */}
    <circle cx={880} cy={220} r={90} fill="#ffd93b" stroke={OUTLINE} strokeWidth={7} />
    <g fill="#ffffff" opacity={0.95}>
      <ellipse cx={260} cy={200} rx={110} ry={44} />
      <ellipse cx={330} cy={180} rx={80} ry={36} />
      <ellipse cx={190} cy={180} rx={70} ry={30} />
    </g>
    {/* distant hills */}
    <path d="M0,640 Q240,520 480,620 T1080,600 L1080,900 L0,900 Z" fill="#7fb069" stroke={OUTLINE} strokeWidth={6} />
    {/* clifftop grass + footpath */}
    <path d="M0,900 L1080,900 L1080,1180 L0,1180 Z" fill="#5cb84a" stroke={OUTLINE} strokeWidth={6} />
    <path d="M0,1000 L1080,1000 L1080,1120 L0,1120 Z" fill="#c8a86a" stroke={OUTLINE} strokeWidth={5} />
    <path d="M0,1060 L1080,1060" stroke="#a8894f" strokeWidth={6} strokeDasharray="26 22" />
    {/* cliff face */}
    <path d="M0,1180 L1080,1180 L1080,1560 L0,1560 Z" fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
    <path d="M180,1180 L220,1560 M480,1180 L460,1560 M780,1180 L820,1560" stroke="#6b4f2a" strokeWidth={6} />
    <path d="M60,1300 L300,1330 M700,1280 L1020,1310 M120,1450 L420,1480" stroke="#6b4f2a" strokeWidth={5} opacity={0.7} />
    {/* river */}
    <rect x={0} y={1560} width={1080} height={360} fill="#4a90c2" stroke={OUTLINE} strokeWidth={6} />
    <path d="M0,1660 Q135,1630 270,1660 T540,1660 T810,1660 T1080,1660" stroke="#bfe6fb" strokeWidth={8} fill="none" />
    <path d="M0,1780 Q135,1750 270,1780 T540,1780 T810,1780 T1080,1780" stroke="#bfe6fb" strokeWidth={8} fill="none" />
    <path d="M0,1880 Q135,1850 270,1880 T540,1880 T810,1880 T1080,1880" stroke="#bfe6fb" strokeWidth={8} fill="none" />
  </svg>
);
