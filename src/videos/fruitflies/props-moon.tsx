// Moon Trees props — Gullak flat style: thick OUTLINE strokes, flat cel
// colours, simple readable shapes at 1080x1920. All original designs.
import React from "react";
import { useCurrentFrame } from "remotion";
import { OUTLINE } from "./characters";

/** Silver seed canister (6-inch can) with a "SEEDS" label. viewBox 0 0 300 420. */
export const SeedCanister: React.FC = () => (
  <svg viewBox="0 0 300 420" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* lid */}
    <rect x={62} y={18} width={176} height={34} rx={12} fill="#8a8f96" stroke={OUTLINE} strokeWidth={7} />
    <rect x={82} y={6} width={136} height={18} rx={9} fill="#aab0b8" stroke={OUTLINE} strokeWidth={6} />
    {/* body */}
    <path d="M62,52 L62,360 Q62,392 94,392 L206,392 Q238,392 238,360 L238,52 Z" fill="#c8ccd2" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    {/* shine stripe */}
    <path d="M88,70 L88,372" stroke="#eef1f4" strokeWidth={14} strokeLinecap="round" opacity={0.85} />
    <path d="M118,70 L118,372" stroke="#eef1f4" strokeWidth={7} strokeLinecap="round" opacity={0.5} />
    {/* base ring */}
    <rect x={62} y={340} width={176} height={26} rx={10} fill="#8a8f96" stroke={OUTLINE} strokeWidth={6} />
    {/* SEEDS label plate */}
    <rect x={48} y={140} width={204} height={120} rx={16} fill="#ffd93b" stroke={OUTLINE} strokeWidth={7} />
    <text x={150} y={218} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={52} fill="#20242b" letterSpacing={4}>SEEDS</text>
    {/* tiny seeds peeking from the top */}
    <g fill="#7a5230" stroke={OUTLINE} strokeWidth={4}>
      <ellipse cx={110} cy={12} rx={12} ry={8} />
      <ellipse cx={150} cy={8} rx={12} ry={8} />
      <ellipse cx={190} cy={12} rx={12} ry={8} />
    </g>
  </svg>
);

/** Spilled brown seeds — a pile + scattered pellets, "like spilled salt". viewBox 0 0 500 220. */
export const SeedPile: React.FC = () => {
  const seeds = [
    { x: 120, y: 150, r: 0 }, { x: 160, y: 168, r: 40 }, { x: 200, y: 148, r: 80 },
    { x: 240, y: 166, r: 20 }, { x: 280, y: 150, r: 65 }, { x: 320, y: 168, r: 10 },
    { x: 360, y: 152, r: 50 }, { x: 180, y: 130, r: 30 }, { x: 260, y: 128, r: 70 },
    { x: 300, y: 132, r: 15 }, { x: 220, y: 112, r: 45 },
  ];
  const scatter = [
    { x: 60, y: 190 }, { x: 420, y: 190 }, { x: 450, y: 160 }, { x: 40, y: 160 },
    { x: 90, y: 120 }, { x: 400, y: 120 }, { x: 330, y: 96 }, { x: 150, y: 96 },
  ];
  return (
    <svg viewBox="0 0 500 220" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* spill patch */}
      <ellipse cx={240} cy={168} rx={180} ry={34} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
      <ellipse cx={240} cy={162} rx={150} ry={24} fill="#a07a44" />
      {seeds.map((s, i) => (
        <ellipse key={i} cx={s.x} cy={s.y} rx={17} ry={11} fill={i % 2 === 0 ? "#7a5230" : "#5a3d28"}
          stroke={OUTLINE} strokeWidth={4} transform={`rotate(${s.r} ${s.x} ${s.y})`} />
      ))}
      {scatter.map((s, i) => (
        <ellipse key={`s${i}`} cx={s.x} cy={s.y} rx={12} ry={8} fill="#7a5230" stroke={OUTLINE} strokeWidth={4}
          transform={`rotate(${i * 37} ${s.x} ${s.y})`} />
      ))}
    </svg>
  );
};

/** Greenhouse tray with green sprouts. viewBox 0 0 600 300. */
export const SeedlingTray: React.FC<{ sprouts?: number }> = ({ sprouts = 6 }) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f * 0.15) * 2;
  return (
    <svg viewBox="0 0 600 300" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* tray */}
      <path d="M30,180 L570,180 L540,270 L60,270 Z" fill="#8a6a3b" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
      <path d="M30,180 L570,180 L570,196 L30,196 Z" fill="#6b4f2a" stroke={OUTLINE} strokeWidth={6} />
      {/* soil */}
      <rect x={48} y={160} width={504} height={28} rx={10} fill="#5a3d28" stroke={OUTLINE} strokeWidth={5} />
      {/* sprouts */}
      {Array.from({ length: sprouts }).map((_, i) => {
        const x = 100 + i * 80;
        const h = 62 + (i % 3) * 14;
        return (
          <g key={i} transform={`translate(${x} 162) rotate(${sway + (i % 2 === 0 ? -4 : 4)} 0 0)`}>
            <path d={`M0,0 L0,-${h}`} stroke="#2f9e44" strokeWidth={7} strokeLinecap="round" />
            <path d={`M0,-${h} Q-28,-${h + 26} -44,-${h + 6} Q-20,-${h + 2} 0,-${h - 4} Z`} fill="#37b24d" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
            <path d={`M0,-${h} Q28,-${h + 26} 44,-${h + 6} Q20,-${h + 2} 0,-${h - 4} Z`} fill="#2f9e44" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
};

/** Big pine tree — trunk + three tiers. viewBox 0 0 400 700. */
export const PineTree: React.FC = () => (
  <svg viewBox="0 0 400 700" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={182} y={560} width={36} height={120} fill="#7a4a21" stroke={OUTLINE} strokeWidth={6} />
    <path d="M200,40 L320,300 L80,300 Z" fill="#2f9e44" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    <path d="M200,200 L350,470 L50,470 Z" fill="#37b24d" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    <path d="M200,380 L370,620 L30,620 Z" fill="#2f9e44" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    {/* snow-free highlight facets */}
    <path d="M200,90 L268,280 L200,280 Z" fill="#37b24d" opacity={0.7} />
    <path d="M200,250 L296,450 L200,450 Z" fill="#2f9e44" opacity={0.7} />
    {/* pine cones */}
    <ellipse cx={160} cy={480} rx={14} ry={20} fill="#7a5230" stroke={OUTLINE} strokeWidth={4} />
    <ellipse cx={250} cy={520} rx={14} ry={20} fill="#7a5230" stroke={OUTLINE} strokeWidth={4} />
  </svg>
);

/** White House — white columned facade + pediment + flag. viewBox 0 0 700 420. */
export const WhiteHouse: React.FC = () => (
  <svg viewBox="0 0 700 420" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* flag pole + flag */}
    <rect x={344} y={10} width={10} height={80} fill="#8a8a8a" stroke={OUTLINE} strokeWidth={4} />
    <path d="M354,14 L414,26 L354,40 Z" fill="#e63b2e" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
    {/* pediment */}
    <path d="M210,90 L350,10 L490,90 Z" fill="#f5f5f0" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={350} cy={66} r={14} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={4} />
    {/* main block */}
    <rect x={60} y={90} width={580} height={270} fill="#f5f5f0" stroke={OUTLINE} strokeWidth={7} />
    <rect x={60} y={90} width={580} height={18} fill="#d8d8d8" stroke={OUTLINE} strokeWidth={5} />
    {/* columns */}
    {[150, 250, 350, 450, 550].map((x) => (
      <g key={x}>
        <rect x={x - 18} y={108} width={36} height={180} fill="#ffffff" stroke={OUTLINE} strokeWidth={5} />
        <rect x={x - 24} y={288} width={48} height={14} fill="#d8d8d8" stroke={OUTLINE} strokeWidth={4} />
      </g>
    ))}
    {/* windows between columns */}
    {[200, 300, 400, 500].map((x) => (
      <rect key={x} x={x - 14} y={150} width={28} height={52} rx={6} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={4} />
    ))}
    {/* door */}
    <rect x={322} y={210} width={56} height={92} rx={8} fill="#2b4a6e" stroke={OUTLINE} strokeWidth={5} />
    <circle cx={368} cy={258} r={5} fill="#ffd93b" />
    {/* steps + lawn */}
    <rect x={40} y={360} width={620} height={20} fill="#d8d8d8" stroke={OUTLINE} strokeWidth={5} />
    <rect x={20} y={380} width={660} height={24} fill="#5cb84a" stroke={OUTLINE} strokeWidth={5} />
  </svg>
);

/** Orbit diagram — Moon + dashed looping orbit + capsule dot travelling it. viewBox 0 0 800 500. */
export const OrbitDiagram: React.FC = () => {
  const f = useCurrentFrame();
  const a = f * 0.045; // capsule travels the orbit
  const cx = 400 + Math.cos(a) * 300;
  const cy = 250 + Math.sin(a) * 150;
  return (
    <svg viewBox="0 0 800 500" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* dashed orbit */}
      <ellipse cx={400} cy={250} rx={300} ry={150} fill="none" stroke="#ffd93b" strokeWidth={7} strokeDasharray="22 16" />
      {/* Moon */}
      <circle cx={400} cy={250} r={110} fill="#d8d8d8" stroke={OUTLINE} strokeWidth={7} />
      <circle cx={360} cy={220} r={22} fill="#b8b8b8" />
      <circle cx={440} cy={280} r={28} fill="#b8b8b8" />
      <circle cx={430} cy={200} r={12} fill="#b8b8b8" />
      {/* capsule dot on the orbit */}
      <g transform={`translate(${cx} ${cy})`}>
        <circle r={26} fill="#e8634a" stroke={OUTLINE} strokeWidth={6} />
        <circle r={10} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={4} />
      </g>
      {/* loop counter ticks */}
      {[0, 1, 2, 3].map((i) => {
        const t = (i / 4) * Math.PI * 2;
        return (
          <circle key={i} cx={400 + Math.cos(t) * 300} cy={250 + Math.sin(t) * 150} r={7} fill="#fff" stroke={OUTLINE} strokeWidth={3} />
        );
      })}
    </svg>
  );
};

/** Newspaper clippings — headline cards about the hunt. viewBox 0 0 700 460. */
export const NewspaperClippings: React.FC = () => (
  <svg viewBox="0 0 700 460" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* back clipping */}
    <g transform="rotate(6 480 220)">
      <rect x={360} y={80} width={280} height={300} rx={10} fill="#f0ead8" stroke={OUTLINE} strokeWidth={6} />
      <rect x={384} y={110} width={232} height={26} rx={6} fill="#2b2b2b" />
      <rect x={384} y={152} width={232} height={12} rx={6} fill="#b8a888" />
      <rect x={384} y={174} width={180} height={12} rx={6} fill="#b8a888" />
      <rect x={384} y={210} width={110} height={110} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={4} />
      <path d="M384,320 L616,320 L616,360 L384,360 Z" fill="#37b24d" opacity={0.35} />
      <text x={500} y={256} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={26} fill="#2b2b2b">MOON TREE</text>
    </g>
    {/* front clipping */}
    <g transform="rotate(-5 220 240)">
      <rect x={60} y={100} width={320} height={320} rx={10} fill="#fffdf5" stroke={OUTLINE} strokeWidth={7} />
      <text x={220} y={160} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={34} fill="#20242b">MOON TREES</text>
      <text x={220} y={200} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={34} fill="#20242b">FOUND!</text>
      <rect x={90} y={220} width={260} height={14} rx={7} fill="#b8a888" />
      <rect x={90} y={246} width={260} height={14} rx={7} fill="#b8a888" />
      <rect x={90} y={272} width={200} height={14} rx={7} fill="#b8a888" />
      {/* little pine photo */}
      <rect x={90} y={300} width={100} height={100} fill="#bfe6fb" stroke={OUTLINE} strokeWidth={4} />
      <path d="M140,318 L168,368 L112,368 Z" fill="#2f9e44" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <rect x={136} y={368} width={8} height={14} fill="#7a4a21" />
    </g>
    {/* red circle highlight */}
    <circle cx={220} cy={180} r={120} fill="none" stroke="#e63b2e" strokeWidth={7} opacity={0.85} />
  </svg>
);

/** Artemis rocket — modern white/orange rocket with flame. viewBox 0 0 300 620. */
export const ArtemisRocket: React.FC<{ flame?: boolean }> = ({ flame = true }) => {
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
      {/* boosters */}
      <rect x={30} y={380} width={34} height={180} rx={12} fill="#f5f5f0" stroke={OUTLINE} strokeWidth={6} />
      <rect x={236} y={380} width={34} height={180} rx={12} fill="#f5f5f0" stroke={OUTLINE} strokeWidth={6} />
      <path d="M30,380 L47,330 L64,380 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      <path d="M236,380 L253,330 L270,380 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      {/* fins */}
      <path d="M62,470 L28,560 L62,560 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
      <path d="M238,470 L272,560 L238,560 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
      {/* body */}
      <path d="M62,500 L62,180 Q62,60 150,20 Q238,60 238,180 L238,500 Z" fill="#f5f5f0" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
      {/* orange core stripe */}
      <rect x={62} y={330} width={176} height={26} fill="#e8634a" />
      <rect x={62} y={230} width={176} height={16} fill="#e8634a" opacity={0.55} />
      <text x={150} y={440} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={40} fill="#c0392b" letterSpacing={3}>ARTEMIS</text>
      {/* window */}
      <circle cx={150} cy={130} r={18} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={5} />
      {/* engine block */}
      <rect x={62} y={500} width={176} height={60} rx={10} fill="#333" stroke={OUTLINE} strokeWidth={6} />
    </svg>
  );
};
