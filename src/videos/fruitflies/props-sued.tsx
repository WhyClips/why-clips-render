// Sued Himself props + plates — Gullak flat style: thick OUTLINE strokes,
// flat cel colours, simple readable shapes at 1080x1920. All original designs.
import React from "react";
import { useCurrentFrame } from "remotion";
import { OUTLINE } from "./characters";
import { Plate } from "./plates";

/** ---------------- PRISON CELL (dark, barred window, bunk) ---------------- */
export const PrisonPlate: React.FC = () => (
  <Plate>
    <rect width={1080} height={1920} fill="#3a4356" />
    {/* wall bricks */}
    <g stroke="#2e3547" strokeWidth={5} opacity={0.7}>
      <path d="M0,300 L1080,300 M0,560 L1080,560 M0,820 L1080,820 M0,1080 L1080,1080" />
      <path d="M270,0 L270,300 M540,300 L540,560 M810,0 L810,300 M135,560 L135,820 M405,560 L405,820 M675,560 L675,820 M945,560 L945,820" />
    </g>
    {/* barred window with light shaft */}
    <g transform="translate(390 220)">
      <rect x={0} y={0} width={300} height={260} fill="#bfe6fb" stroke={OUTLINE} strokeWidth={8} />
      <path d="M100,0 L100,260 M200,0 L200,260 M0,130 L300,130" stroke={OUTLINE} strokeWidth={10} />
      <rect x={-14} y={-14} width={328} height={288} fill="none" stroke="#20242b" strokeWidth={6} />
    </g>
    <path d="M450,480 L700,1420 L980,1420 L760,480 Z" fill="#fff" opacity={0.07} />
    {/* bunk bed */}
    <g transform="translate(80 1180)" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round">
      <rect x={0} y={0} width={320} height={60} rx={12} fill="#5a6b8a" />
      <rect x={0} y={120} width={320} height={60} rx={12} fill="#4a5a76" />
      <rect x={10} y={-14} width={70} height={28} rx={10} fill="#f5f5f0" />
      <rect x={0} y={180} width={14} height={120} fill="#3a4356" />
      <rect x={306} y={180} width={14} height={120} fill="#3a4356" />
      <rect x={0} y={-10} width={14} height={190} fill="#3a4356" />
      <rect x={306} y={-10} width={14} height={190} fill="#3a4356" />
    </g>
    {/* floor */}
    <path d="M0,1420 L1080,1420 L1080,1920 L0,1920 Z" fill="#2b3242" />
    <path d="M0,1420 L1080,1420" stroke={OUTLINE} strokeWidth={6} />
    <g stroke="#232936" strokeWidth={4}>
      <path d="M0,1580 L1080,1580 M0,1740 L1080,1740 M0,1880 L1080,1880" />
    </g>
  </Plate>
);

/** ---------------- COURTROOM (wood panels, bench, flag, tables) ---------------- */
export const CourtPlate: React.FC = () => (
  <Plate>
    <rect width={1080} height={1920} fill="#8a6a3b" />
    {/* wood panels */}
    <g stroke="#6b4f2a" strokeWidth={5} opacity={0.8}>
      <path d="M0,360 L1080,360 M0,720 L1080,720 M270,0 L270,720 M540,0 L540,720 M810,0 L810,720" />
    </g>
    {/* flag */}
    <g transform="translate(80 120)">
      <rect x={0} y={0} width={12} height={420} fill="#5a4020" stroke={OUTLINE} strokeWidth={5} />
      <rect x={12} y={0} width={200} height={130} fill="#e63b2e" stroke={OUTLINE} strokeWidth={6} />
      <g fill="#fff">
        <rect x={12} y={18} width={200} height={16} />
        <rect x={12} y={54} width={200} height={16} />
        <rect x={12} y={90} width={200} height={16} />
      </g>
      <rect x={12} y={0} width={84} height={66} fill="#2b4a6e" stroke={OUTLINE} strokeWidth={5} />
    </g>
    {/* judge bench */}
    <g transform="translate(340 380)" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round">
      <rect x={0} y={0} width={400} height={220} rx={16} fill="#6b4f2a" />
      <rect x={0} y={0} width={400} height={40} rx={16} fill="#8a6a3b" />
      <rect x={170} y={90} width={60} height={60} rx={8} fill="#ffd93b" />
    </g>
    {/* witness stand */}
    <g transform="translate(820 620)" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round">
      <rect x={0} y={0} width={180} height={160} rx={12} fill="#6b4f2a" />
      <rect x={0} y={0} width={180} height={28} rx={12} fill="#8a6a3b" />
    </g>
    {/* tables */}
    <g transform="translate(120 1080)" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round">
      <rect x={0} y={0} width={340} height={30} rx={10} fill="#6b4f2a" />
      <rect x={20} y={30} width={18} height={110} fill="#5a4020" />
      <rect x={302} y={30} width={18} height={110} fill="#5a4020" />
    </g>
    <g transform="translate(620 1080)" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round">
      <rect x={0} y={0} width={340} height={30} rx={10} fill="#6b4f2a" />
      <rect x={20} y={30} width={18} height={110} fill="#5a4020" />
      <rect x={302} y={30} width={18} height={110} fill="#5a4020" />
    </g>
    {/* floor */}
    <path d="M0,1420 L1080,1420 L1080,1920 L0,1920 Z" fill="#a8d5a2" />
    <path d="M0,1420 L1080,1420" stroke={OUTLINE} strokeWidth={6} />
    <ellipse cx={540} cy={1680} rx={420} ry={110} fill="#e8634a" opacity={0.4} />
  </Plate>
);

/** Vertical prison bars overlay (full frame). viewBox 0 0 1080 1920. */
export const PrisonBars: React.FC<{ opacity?: number }> = ({ opacity = 0.95 }) => (
  <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g opacity={opacity}>
      {[60, 210, 360, 510, 660, 810, 960].map((x) => (
        <g key={x}>
          <rect x={x} y={0} width={34} height={1920} fill="#20242b" />
          <rect x={x + 6} y={0} width={8} height={1920} fill="#4a5568" />
        </g>
      ))}
      <rect x={0} y={520} width={1080} height={30} fill="#20242b" />
      <rect x={0} y={1180} width={1080} height={30} fill="#20242b" />
    </g>
  </svg>
);

/** Handwritten letter page — "Dear Court," + wavy lines + signature.
 *  viewBox 0 0 500 640. */
export const HandwrittenLetter: React.FC = () => (
  <svg viewBox="0 0 500 640" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={10} y={10} width={480} height={620} rx={10} fill="#fffdf5" stroke={OUTLINE} strokeWidth={7} />
    <text x={60} y={90} fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={40} fill="#20242b">Dear Court,</text>
    <g stroke="#4a6fa5" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.85}>
      <path d="M60,140 Q120,128 180,140 T300,140 T420,140" />
      <path d="M60,200 Q120,188 180,200 T300,200 T420,200" />
      <path d="M60,260 Q120,248 180,260 T300,260 T420,260" />
      <path d="M60,320 Q120,308 180,320 T300,320 T420,320" />
      <path d="M60,380 Q120,368 180,380 T300,380 T420,380" />
    </g>
    {/* $5,000,000 circled in red */}
    <g>
      <ellipse cx={250} cy={470} rx={180} ry={52} fill="none" stroke="#e63b2e" strokeWidth={7} transform="rotate(-3 250 470)" />
      <text x={250} y={488} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={44} fill="#c0392b">$5,000,000</text>
    </g>
    <text x={300} y={580} fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={34} fill="#20242b">— R. L. Brock</text>
  </svg>
);

/** Stack of 7 fanned pages. viewBox 0 0 500 300. */
export const LetterStack: React.FC = () => (
  <svg viewBox="0 0 500 300" width="100%" height="100%" style={{ overflow: "visible" }}>
    {[-14, -7, 0, 7, 14, 21, 28].map((r, i) => (
      <g key={i} transform={`rotate(${r - 7} 250 150)`}>
        <rect x={90} y={40} width={320} height={220} rx={8} fill={i === 6 ? "#fffdf5" : "#f0ead8"} stroke={OUTLINE} strokeWidth={6} />
        <g stroke="#4a6fa5" strokeWidth={6} strokeLinecap="round" opacity={0.8}>
          <path d="M120,90 L380,90 M120,130 L380,130 M120,170 L340,170" />
        </g>
      </g>
    ))}
    <circle cx={430} cy={60} r={44} fill="#e63b2e" stroke={OUTLINE} strokeWidth={6} />
    <text x={430} y={76} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={52} fill="#fff">7</text>
  </svg>
);

/** Mirror frame (gold, tall) — a flipped Chibi goes inside it.
 *  viewBox 0 0 400 700. */
export const MirrorFrame: React.FC = () => (
  <svg viewBox="0 0 400 700" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={14} y={14} width={372} height={672} rx={36} fill="#bfe6fb" stroke="#c9a94e" strokeWidth={16} />
    <rect x={34} y={34} width={332} height={632} rx={26} fill="#d8eefc" stroke={OUTLINE} strokeWidth={5} />
    {/* shine streaks */}
    <path d="M90,80 L150,620 M140,60 L210,620" stroke="#fff" strokeWidth={16} strokeLinecap="round" opacity={0.55} />
    <circle cx={200} cy={20} r={12} fill="#c9a94e" stroke={OUTLINE} strokeWidth={4} />
  </svg>
);

/** Wooden gavel. viewBox 0 0 300 200. */
export const Gavel: React.FC<{ rotate?: number }> = ({ rotate = -25 }) => (
  <svg viewBox="0 0 300 200" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g transform={`rotate(${rotate} 150 100)`}>
      <rect x={60} y={40} width={180} height={64} rx={28} fill="#8a5a2b" stroke={OUTLINE} strokeWidth={7} />
      <rect x={60} y={40} width={26} height={64} rx={12} fill="#6b4f2a" stroke={OUTLINE} strokeWidth={5} />
      <rect x={214} y={40} width={26} height={64} rx={12} fill="#6b4f2a" stroke={OUTLINE} strokeWidth={5} />
      <rect x={138} y={96} width={24} height={84} rx={10} fill="#a07a44" stroke={OUTLINE} strokeWidth={6} />
    </g>
  </svg>
);

/** Money bag with a $ sign. viewBox 0 0 400 420. */
export const MoneyBag: React.FC = () => (
  <svg viewBox="0 0 400 420" width="100%" height="100%" style={{ overflow: "visible" }}>
    <path d="M200,30 L230,90 L250,110 Q330,160 330,260 Q330,380 200,380 Q70,380 70,260 Q70,160 150,110 L170,90 Z" fill="#2f9e44" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    <path d="M170,90 L230,90 L215,70 L185,70 Z" fill="#37b24d" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
    <rect x={160} y={82} width={80} height={20} rx={10} fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} />
    <text x={200} y={280} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={120} fill="#ffd93b" stroke={OUTLINE} strokeWidth={2}>$</text>
  </svg>
);

/** State capitol building with dome. viewBox 0 0 700 420. */
export const Statehouse: React.FC = () => (
  <svg viewBox="0 0 700 420" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* flag */}
    <rect x={344} y={8} width={10} height={70} fill="#8a8a8a" stroke={OUTLINE} strokeWidth={4} />
    <path d="M354,12 L414,24 L354,38 Z" fill="#2b4a6e" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
    {/* dome */}
    <path d="M230,150 Q230,60 350,50 Q470,60 470,150 Z" fill="#f5f5f0" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={350} cy={52} r={10} fill="#ffd93b" stroke={OUTLINE} strokeWidth={4} />
    {/* drum + block */}
    <rect x={210} y={150} width={280} height={60} fill="#e8e8e8" stroke={OUTLINE} strokeWidth={6} />
    <rect x={60} y={210} width={580} height={150} fill="#f5f5f0" stroke={OUTLINE} strokeWidth={7} />
    {/* columns */}
    {[140, 240, 340, 440, 540].map((x) => (
      <g key={x}>
        <rect x={x - 18} y={228} width={36} height={114} fill="#ffffff" stroke={OUTLINE} strokeWidth={5} />
        <rect x={x - 24} y={342} width={48} height={14} fill="#d8d8d8" stroke={OUTLINE} strokeWidth={4} />
      </g>
    ))}
    {/* door */}
    <rect x={322} y={290} width={56} height={70} rx={8} fill="#2b4a6e" stroke={OUTLINE} strokeWidth={5} />
    {/* steps + lawn */}
    <rect x={40} y={360} width={620} height={20} fill="#d8d8d8" stroke={OUTLINE} strokeWidth={5} />
    <rect x={20} y={380} width={660} height={24} fill="#5cb84a" stroke={OUTLINE} strokeWidth={5} />
  </svg>
);

/** Brown alcohol bottle with a plain label. viewBox 0 0 200 420. */
export const Bottle: React.FC = () => (
  <svg viewBox="0 0 200 420" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={82} y={14} width={36} height={70} fill="#6b4423" stroke={OUTLINE} strokeWidth={6} />
    <rect x={76} y={6} width={48} height={22} rx={8} fill="#8a5a2b" stroke={OUTLINE} strokeWidth={5} />
    <path d="M82,84 L118,84 L132,130 Q168,170 168,260 L168,370 Q168,400 138,400 L62,400 Q32,400 32,370 L32,260 Q32,170 68,130 Z" fill="#7a4a21" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    <path d="M52,150 L52,360" stroke="#a07a44" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
    <rect x={48} y={210} width={104} height={110} rx={10} fill="#f5ecd7" stroke={OUTLINE} strokeWidth={6} />
    <text x={100} y={262} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={40} fill="#8a5a2b">XXX</text>
    <text x={100} y={300} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={22} fill="#5a4020">1 JULY 1993</text>
  </svg>
);

/** Calendar page — big "1", JULY 1993 header. viewBox 0 0 500 420. */
export const CalendarCard: React.FC = () => (
  <svg viewBox="0 0 500 420" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={20} y={20} width={460} height={380} rx={16} fill="#fffdf5" stroke={OUTLINE} strokeWidth={7} />
    <rect x={20} y={20} width={460} height={90} rx={16} fill="#e63b2e" stroke={OUTLINE} strokeWidth={7} />
    <rect x={20} y={80} width={460} height={30} fill="#e63b2e" />
    <text x={250} y={82} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={48} fill="#fff" letterSpacing={4}>JULY 1993</text>
    <text x={250} y={320} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={220} fill="#20242b">1</text>
    <circle cx={250} cy={250} r={120} fill="none" stroke="#e63b2e" strokeWidth={8} />
    {/* rings */}
    <rect x={90} y={8} width={16} height={40} rx={8} fill="#8a8a8a" stroke={OUTLINE} strokeWidth={4} />
    <rect x={394} y={8} width={16} height={40} rx={8} fill="#8a8a8a" stroke={OUTLINE} strokeWidth={4} />
  </svg>
);

/** Handcuffs — two steel rings + chain. viewBox 0 0 400 200. */
export const Handcuffs: React.FC = () => {
  const f = useCurrentFrame();
  const sway = Math.sin(f * 0.12) * 4;
  return (
    <svg viewBox="0 0 400 200" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${sway})`}>
        <circle cx={110} cy={100} r={62} fill="none" stroke="#8a8f96" strokeWidth={22} />
        <circle cx={110} cy={100} r={62} fill="none" stroke={OUTLINE} strokeWidth={26} opacity={0.25} />
        <circle cx={290} cy={100} r={62} fill="none" stroke="#8a8f96" strokeWidth={22} />
        <circle cx={290} cy={100} r={62} fill="none" stroke={OUTLINE} strokeWidth={26} opacity={0.25} />
        <path d="M172,100 L228,100" stroke="#8a8f96" strokeWidth={16} strokeLinecap="round" />
        <circle cx={200} cy={100} r={10} fill="#c8ccd2" stroke={OUTLINE} strokeWidth={4} />
        <circle cx={110} cy={52} r={12} fill="#ffd93b" stroke={OUTLINE} strokeWidth={4} />
        <circle cx={290} cy={52} r={12} fill="#ffd93b" stroke={OUTLINE} strokeWidth={4} />
      </g>
    </svg>
  );
};
