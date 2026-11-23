// Background plates (Gullak Tales style): low-poly 3D-look exteriors drawn as
// flat vector plates (cones, bands, blob clouds, gradient skies) and flat
// painted 2D interiors. Pre-rendered look, no WebGL — deterministic and fast.
import React from "react";
import { useCurrentFrame } from "remotion";
import { OUTLINE } from "./characters";

const W = 1080;
const H = 1920;

export const Plate: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    {children}
  </svg>
);

/** deterministic pseudo-random in [0,1) */
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const BlobCloud: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 0.95 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill="#ffffff">
    <ellipse cx={0} cy={0} rx={90} ry={42} />
    <ellipse cx={-70} cy={14} rx={60} ry={30} />
    <ellipse cx={70} cy={14} rx={62} ry={32} />
    <ellipse cx={10} cy={-26} rx={52} ry={30} />
  </g>
);

export const ConeTree: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#2f9e44" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-10} y={0} width={20} height={46} fill="#7a4a21" stroke={OUTLINE} strokeWidth={5} />
    <path d="M0,-120 L62,-10 L-62,-10 Z" fill={c} stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    <path d="M0,-88 L50,-2 L-50,-2 Z" fill={c} opacity={0.75} />
    <path d="M0,-160 L44,-66 L-44,-66 Z" fill={c} stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
  </g>
);

const Stars: React.FC<{ n?: number; top?: number }> = ({ n = 60, top = 900 }) => (
  <g fill="#ffffff">
    {Array.from({ length: n }).map((_, i) => (
      <circle key={i} cx={rnd(i) * W} cy={rnd(i + 100) * top} r={1.5 + rnd(i + 200) * 2.5} opacity={0.4 + rnd(i + 300) * 0.6} />
    ))}
  </g>
);

export const Rain: React.FC<{ f: number }> = ({ f }) => (
  <g stroke="#9db8d9" strokeWidth={4} strokeLinecap="round" opacity={0.55}>
    {Array.from({ length: 40 }).map((_, i) => {
      const x = rnd(i) * (W + 200) - 100;
      const y = ((rnd(i + 50) * H + f * 34) % (H + 100)) - 50;
      return <line key={i} x1={x} y1={y} x2={x - 18} y2={y + 44} />;
    })}
  </g>
);

/** ---------------- STORM NIGHT (hook) ---------------- */
export const StormPlate: React.FC = () => {
  const f = useCurrentFrame();
  const flash = f % 90 < 6 ? 0.5 : 0;
  return (
    <Plate>
      <defs>
        <linearGradient id="stormSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141b33" />
          <stop offset="55%" stopColor="#2a3558" />
          <stop offset="100%" stopColor="#4a3a6b" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#stormSky)" />
      <Stars n={40} top={700} />
      <BlobCloud x={220} y={240} s={1.6} o={0.25} />
      <BlobCloud x={820} y={420} s={2.0} o={0.22} />
      <BlobCloud x={500} y={120} s={1.3} o={0.28} />
      {/* lightning bolt */}
      <g opacity={flash}>
        <path d="M700,120 L640,320 L700,320 L620,560 L780,260 L700,260 L770,120 Z" fill="#ffe066" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <rect width={W} height={H} fill="#cdd8ff" opacity={0.12} />
      </g>
      {/* dark cloud bank at bottom */}
      <path d="M0,1500 Q180,1420 360,1480 Q540,1420 720,1480 Q900,1420 1080,1480 L1080,1920 L0,1920 Z" fill="#1c2340" />
      <Rain f={f} />
    </Plate>
  );
};

/** ---------------- AIRFIELD 1923 (low-poly exterior) ---------------- */
export const AirfieldPlate: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f % 600) * 0.15;
  return (
    <Plate>
      <defs>
        <linearGradient id="daySky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ec8f0" />
          <stop offset="60%" stopColor="#bfe6fb" />
          <stop offset="100%" stopColor="#e8f7ff" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#daySky)" />
      <circle cx={880} cy={220} r={90} fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} />
      <circle cx={880} cy={220} r={112} fill="none" stroke="#ffd93b" strokeWidth={6} opacity={0.4} />
      <g transform={`translate(${drift - 60} 0)`}>
        <BlobCloud x={240} y={300} s={1.4} />
        <BlobCloud x={700} y={180} s={1.1} />
      </g>
      <BlobCloud x={120} y={520} s={0.9} o={0.85} />
      {/* distant hills */}
      <path d="M0,1080 Q270,980 540,1060 Q810,980 1080,1060 L1080,1920 L0,1920 Z" fill="#8fce6e" />
      {/* field bands */}
      <path d="M0,1180 L1080,1180 L1080,1420 L0,1420 Z" fill="#5cb84a" />
      <path d="M0,1420 L1080,1420 L1080,1920 L0,1920 Z" fill="#4da63e" />
      <path d="M0,1420 L1080,1420 L1080,1460 L0,1460 Z" fill="#8a6a3b" opacity={0.6} />
      {/* runway (perspective) */}
      <path d="M380,1180 L700,1180 L920,1920 L160,1920 Z" fill="#9a9a9a" stroke={OUTLINE} strokeWidth={6} />
      <path d="M520,1180 L560,1180 L580,1920 L500,1920 Z" fill="#f5f5f0" opacity={0.85} />
      {/* runway dashes */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={532 - i * 2} y={1260 + i * 130} width={16} height={70} fill="#fff" transform={`translate(${i * 4} 0)`} />
      ))}
      {/* hangar */}
      <g transform="translate(90 1000)">
        <path d="M0,180 L0,80 Q110,0 220,80 L220,180 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
        <rect x={60} y={90} width={100} height={90} fill="#7a3a28" stroke={OUTLINE} strokeWidth={6} />
        <circle cx={110} cy={55} r={16} fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} />
      </g>
      {/* windsock */}
      <g transform="translate(960 1060)">
        <rect x={-5} y={0} width={10} height={120} fill="#666" />
        <path d="M0,10 L90,26 L90,54 L0,44 Z" fill="#ff7b54" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      </g>
      {/* cone tree rows */}
      <ConeTree x={140} y={1170} s={0.9} />
      <ConeTree x={300} y={1160} s={0.7} c="#37b24d" />
      <ConeTree x={830} y={1160} s={0.8} />
      <ConeTree x={980} y={1175} s={0.65} c="#37b24d" />
    </Plate>
  );
};

/** ---------------- PARIS (low-poly exterior, dusk) ---------------- */
export const ParisPlate: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f % 600) * 0.12;
  return (
    <Plate>
      <defs>
        <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7b5ea7" />
          <stop offset="55%" stopColor="#e88ca0" />
          <stop offset="100%" stopColor="#ffb35c" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#duskSky)" />
      <circle cx={200} cy={300} r={80} fill="#ffe8a3" stroke={OUTLINE} strokeWidth={6} />
      <g transform={`translate(${drift - 40} 0)`}>
        <BlobCloud x={600} y={260} s={1.3} o={0.9} />
        <BlobCloud x={900} y={420} s={1.0} o={0.85} />
      </g>
      {/* Eiffel tower */}
      <g transform="translate(700 1080)" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round">
        <path d="M-110,0 L-40,-420 L40,-420 L110,0 Z" fill="#c98a4b" />
        <path d="M-70,-140 L70,-140 L56,-240 L-56,-240 Z" fill="#e8a860" />
        <path d="M-28,-420 L28,-420 L14,-520 L-14,-520 Z" fill="#c98a4b" />
        <rect x={-6} y={-580} width={12} height={70} fill="#c98a4b" />
        <path d="M-96,-120 L96,-120 M-84,-220 L84,-220 M-60,-330 L60,-330" fill="none" strokeWidth={6} />
        <path d="M-40,-40 Q0,-110 40,-40 Z" fill="#ffb35c" />
      </g>
      {/* low-poly buildings */}
      <g stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round">
        <rect x={40} y={1120} width={220} height={260} fill="#f2c14e" />
        <path d="M40,1120 L150,1020 L260,1120 Z" fill="#e8634a" />
        <rect x={300} y={1180} width={180} height={200} fill="#7ec8f0" />
        <path d="M300,1180 L390,1100 L480,1180 Z" fill="#4a6fa5" />
        <rect x={920} y={1160} width={140} height={220} fill="#f2c14e" />
      </g>
      {/* windows */}
      <g fill="#fff3c4">
        <rect x={80} y={1180} width={34} height={44} />
        <rect x={180} y={1180} width={34} height={44} />
        <rect x={80} y={1280} width={34} height={44} />
        <rect x={180} y={1280} width={34} height={44} />
        <rect x={330} y={1240} width={30} height={40} />
        <rect x={410} y={1240} width={30} height={40} />
      </g>
      {/* ground + river */}
      <path d="M0,1380 L1080,1380 L1080,1920 L0,1920 Z" fill="#6fbf5a" />
      <path d="M0,1560 Q270,1500 540,1560 Q810,1620 1080,1560 L1080,1920 L0,1920 Z" fill="#5aa8e8" />
      <path d="M0,1560 Q270,1500 540,1560 Q810,1620 1080,1560" fill="none" stroke="#fff" strokeWidth={6} opacity={0.5} />
      <ConeTree x={120} y={1420} s={0.8} />
      <ConeTree x={560} y={1410} s={0.65} c="#37b24d" />
      <ConeTree x={880} y={1420} s={0.75} />
    </Plate>
  );
};

/** ---------------- STORM SEA (flying boat) ---------------- */
export const SeaPlate: React.FC = () => {
  const f = useCurrentFrame();
  const wob = Math.sin(f * 0.08) * 14;
  return (
    <Plate>
      <defs>
        <linearGradient id="seaSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b3a55" />
          <stop offset="60%" stopColor="#5a6b8a" />
          <stop offset="100%" stopColor="#8a9ab5" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#seaSky)" />
      <BlobCloud x={300} y={200} s={1.8} o={0.35} />
      <BlobCloud x={800} y={340} s={2.2} o={0.3} />
      <BlobCloud x={150} y={480} s={1.5} o={0.32} />
      {/* wave bands */}
      <path d={`M0,1150 Q135,${1120 + wob} 270,1150 Q405,${1180 - wob} 540,1150 Q675,${1120 + wob} 810,1150 Q945,${1180 - wob} 1080,1150 L1080,1920 L0,1920 Z`} fill="#2e5a8a" />
      <path d={`M0,1330 Q135,${1300 - wob} 270,1330 Q405,${1360 + wob} 540,1330 Q675,${1300 - wob} 810,1330 Q945,${1360 + wob} 1080,1330 L1080,1920 L0,1920 Z`} fill="#24507e" />
      <path d={`M0,1540 Q135,${1510 + wob} 270,1540 Q405,${1570 - wob} 540,1540 Q675,${1510 + wob} 810,1540 Q945,${1570 - wob} 1080,1540 L1080,1920 L0,1920 Z`} fill="#1d4370" />
      {/* whitecaps */}
      <g stroke="#fff" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.7}>
        <path d={`M120,${1180 + wob} Q160,1160 200,${1180 + wob}`} />
        <path d={`M700,${1190 - wob} Q740,1170 780,${1190 - wob}`} />
        <path d={`M420,${1370 - wob} Q460,1350 500,${1370 - wob}`} />
        <path d={`M880,${1580 + wob} Q920,1560 960,${1580 + wob}`} />
      </g>
      <Rain f={f} />
    </Plate>
  );
};

/** ---------------- RADIO ROOM (flat 2D interior) ---------------- */
export const RadioRoomPlate: React.FC = () => (
  <Plate>
    <rect width={W} height={H} fill="#a8d5a2" />
    {/* painted wall texture: subtle cracks */}
    <g stroke="#8fbf8a" strokeWidth={5} fill="none" opacity={0.8}>
      <path d="M120,200 L180,320 L150,420" />
      <path d="M900,300 L860,420 L890,520" />
      <path d="M520,120 L540,220" />
    </g>
    {/* window with sky */}
    <g transform="translate(700 260)">
      <rect x={0} y={0} width={280} height={300} fill="#bfe6fb" stroke={OUTLINE} strokeWidth={7} />
      <path d="M140,0 L140,300 M0,150 L280,150" stroke={OUTLINE} strokeWidth={6} />
      <circle cx={210} cy={70} r={34} fill="#ffd93b" />
      <ellipse cx={80} cy={220} rx={60} ry={26} fill="#fff" />
      <ellipse cx={190} cy={240} rx={70} ry={28} fill="#fff" />
    </g>
    {/* framed certificate */}
    <g transform="translate(110 280)">
      <rect x={0} y={0} width={220} height={160} fill="#f5ecd7" stroke={OUTLINE} strokeWidth={6} />
      <rect x={16} y={16} width={188} height={128} fill="none" stroke="#c9a94e" strokeWidth={4} />
      <rect x={60} y={40} width={100} height={14} rx={7} fill="#8a6a3b" />
      <rect x={40} y={70} width={140} height={10} rx={5} fill="#b8a888" />
      <rect x={40} y={92} width={140} height={10} rx={5} fill="#b8a888" />
      <circle cx={110} cy={128} r={12} fill="#e8634a" />
    </g>
    {/* shelf with radio boxes */}
    <g transform="translate(90 640)">
      <rect x={0} y={0} width={360} height={18} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={5} />
      <rect x={20} y={-70} width={80} height={70} rx={8} fill="#e8634a" stroke={OUTLINE} strokeWidth={5} />
      <rect x={130} y={-56} width={60} height={56} rx={8} fill="#4a6fa5" stroke={OUTLINE} strokeWidth={5} />
      <rect x={220} y={-80} width={90} height={80} rx={8} fill="#f2c14e" stroke={OUTLINE} strokeWidth={5} />
      <circle cx={60} cy={-35} r={10} fill="#fff" />
      <circle cx={265} cy={-40} r={12} fill="#fff" />
    </g>
    {/* floor */}
    <path d="M0,1420 L1080,1420 L1080,1920 L0,1920 Z" fill="#c98d5a" />
    <path d="M0,1420 L1080,1420" stroke={OUTLINE} strokeWidth={6} />
    <g stroke="#b57a48" strokeWidth={4}>
      <path d="M0,1560 L1080,1560 M0,1720 L1080,1720 M0,1860 L1080,1860" />
    </g>
    {/* rug */}
    <ellipse cx={540} cy={1680} rx={420} ry={110} fill="#e8634a" opacity={0.55} />
    <ellipse cx={540} cy={1680} rx={300} ry={76} fill="#f2c14e" opacity={0.5} />
  </Plate>
);

/** ---------------- FLAT INTERIOR (fire alarm scene) ---------------- */
export const InteriorPlate: React.FC = () => (
  <Plate>
    <rect width={W} height={H} fill="#bcd9f5" />
    <g stroke="#a3c6e8" strokeWidth={5} fill="none" opacity={0.8}>
      <path d="M200,180 L240,300 L210,400" />
      <path d="M820,240 L790,360" />
    </g>
    {/* door */}
    <g transform="translate(820 700)">
      <rect x={0} y={0} width={200} height={420} rx={12} fill="#4a6fa5" stroke={OUTLINE} strokeWidth={7} />
      <rect x={24} y={24} width={152} height={160} fill="#5b84bd" stroke={OUTLINE} strokeWidth={5} />
      <circle cx={170} cy={240} r={12} fill="#ffd93b" stroke={OUTLINE} strokeWidth={4} />
    </g>
    {/* bench */}
    <g transform="translate(120 1080)">
      <rect x={0} y={0} width={320} height={26} rx={10} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
      <rect x={20} y={26} width={18} height={60} fill="#6b4f2a" />
      <rect x={282} y={26} width={18} height={60} fill="#6b4a2a" />
    </g>
    {/* floor */}
    <path d="M0,1420 L1080,1420 L1080,1920 L0,1920 Z" fill="#d9b48c" />
    <path d="M0,1420 L1080,1420" stroke={OUTLINE} strokeWidth={6} />
    <g stroke="#c4a07a" strokeWidth={4}>
      <path d="M0,1580 L1080,1580 M0,1740 L1080,1740 M0,1880 L1080,1880" />
    </g>
  </Plate>
);

/** ---------------- MODERN COCKPIT ---------------- */
export const CockpitPlate: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f % 900) * 0.2;
  return (
    <Plate>
      <rect width={W} height={H} fill="#1d2b4a" />
      {/* windshield */}
      <g>
        <path d="M80,180 L1000,180 L940,980 L140,980 Z" fill="#7ec8f0" stroke={OUTLINE} strokeWidth={8} strokeLinejoin="round" />
        <path d="M540,180 L540,980" stroke={OUTLINE} strokeWidth={8} />
        <circle cx={820} cy={330} r={70} fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} />
        <g transform={`translate(${drift - 100} 0)`}>
          <BlobCloud x={300} y={420} s={1.2} />
          <BlobCloud x={700} y={600} s={1.5} />
          <BlobCloud x={150} y={700} s={1.0} />
        </g>
      </g>
      {/* dashboard */}
      <path d="M0,1080 L1080,1080 L1080,1920 L0,1920 Z" fill="#2a3a5e" />
      <path d="M0,1080 L1080,1080" stroke={OUTLINE} strokeWidth={7} />
      {/* glowing dials */}
      <g>
        {[
          [200, 1220, "#7ee787"], [400, 1220, "#ffd93b"], [680, 1220, "#7ec8f0"], [880, 1220, "#ff7b54"],
          [300, 1400, "#ffd93b"], [540, 1400, "#7ee787"], [780, 1400, "#ff7b54"],
        ].map(([x, y, c], i) => (
          <g key={i}>
            <circle cx={x as number} cy={y as number} r={52} fill="#16223e" stroke={OUTLINE} strokeWidth={6} />
            <circle cx={x as number} cy={y as number} r={34} fill={c as string} opacity={0.9} />
            <path d={`M${x as number},${y as number} L${(x as number) + 22},${(y as number) - 18}`} stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
          </g>
        ))}
      </g>
      {/* yoke */}
      <g transform="translate(540 1620)">
        <rect x={-14} y={0} width={28} height={130} rx={10} fill="#3a3a4d" stroke={OUTLINE} strokeWidth={6} />
        <path d="M-160,-40 Q-160,-110 0,-110 Q160,-110 160,-40 Q160,10 0,10 Q-160,10 -160,-40 Z" fill="#3a3a4d" stroke={OUTLINE} strokeWidth={7} />
        <circle cx={0} cy={-50} r={34} fill="#2a2a38" stroke={OUTLINE} strokeWidth={6} />
      </g>
    </Plate>
  );
};

/** ---------------- OLD NAUTICAL MAP (Sandy Island) ----------------
 * Parchment chart of the Coral Sea: Australia (left), New Caledonia
 * (right), Sandy Island in the middle. islandOpacity animates the
 * island fading out; showX draws a red X over where it was. */
export const MapPlate: React.FC<{
  islandOpacity?: number;
  showX?: boolean;
  route?: boolean;
}> = ({ islandOpacity = 1, showX = false, route = false }) => (
  <Plate>
    <rect width={W} height={H} fill="#f2e3c0" />
    {/* lat/long grid */}
    <g stroke="#c9b896" strokeWidth={3} opacity={0.7}>
      {[240, 480, 720, 960, 1200, 1440, 1680].map((y) => (
        <path key={y} d={`M0,${y} L1080,${y}`} />
      ))}
      {[180, 360, 540, 720, 900].map((x) => (
        <path key={x} d={`M${x},0 L${x},1920`} />
      ))}
    </g>
    {/* ocean tint */}
    <rect x={60} y={420} width={960} height={980} rx={30} fill="#bfe6fb" opacity={0.55} />
    {/* Australia (left landmass) */}
    <path
      d="M60,700 Q140,560 300,580 Q380,640 340,760 Q380,900 280,980 Q140,1020 80,900 Q40,780 60,700 Z"
      fill="#e8c97a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round"
    />
    <text x={180} y={800} textAnchor="middle" fontSize={44} fontWeight={700} fill="#8a6a3b" fontFamily="Georgia, serif" transform="rotate(-90 180 800)">
      AUSTRALIA
    </text>
    {/* New Caledonia (right, long thin island) */}
    <path
      d="M880,620 Q940,700 920,900 Q900,1080 860,1180 Q830,1060 840,880 Q850,720 880,620 Z"
      fill="#8fce6e" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round"
    />
    <text x={960} y={920} textAnchor="middle" fontSize={34} fontWeight={700} fill="#2f7a33" fontFamily="Georgia, serif" transform="rotate(-90 960 920)">
      NEW CALEDONIA
    </text>
    {/* Coral Sea label */}
    <text x={560} y={560} textAnchor="middle" fontSize={40} fontWeight={700} fill="#4a6fa5" fontFamily="Georgia, serif" fontStyle="italic">
      CORAL SEA
    </text>
    {/* dashed route */}
    {route && (
      <path d="M300,860 Q480,900 620,860" fill="none" stroke="#e8634a" strokeWidth={6} strokeDasharray="18 14" strokeLinecap="round" />
    )}
    {/* Sandy Island */}
    <g opacity={islandOpacity}>
      <path
        d="M560,820 Q640,780 720,810 Q760,850 700,890 Q620,920 560,880 Q530,850 560,820 Z"
        fill="#f5e6b8" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round"
      />
      <path d="M600,830 Q640,845 690,835 M590,865 Q640,878 700,862" fill="none" stroke="#c9a94e" strokeWidth={4} strokeLinecap="round" />
      <text x={640} y={770} textAnchor="middle" fontSize={40} fontWeight={700} fill="#8a6a3b" fontFamily="Georgia, serif">
        SANDY ISLAND
      </text>
      <circle cx={640} cy={850} r={110} fill="none" stroke="#e8634a" strokeWidth={5} strokeDasharray="12 10" />
    </g>
    {showX && (
      <g transform="translate(640 850)" opacity={0.95}>
        <path d="M-70,-70 L70,70 M70,-70 L-70,70" stroke="#e63b2e" strokeWidth={22} strokeLinecap="round" />
      </g>
    )}
    {/* compass rose */}
    <g transform="translate(880 320)">
      <circle r={86} fill="#f5ecd7" stroke={OUTLINE} strokeWidth={6} />
      <path d="M0,-72 L14,0 L0,72 L-14,0 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-72,0 L0,14 L72,0 L0,-14 Z" fill="#4a6fa5" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <text y={-96} textAnchor="middle" fontSize={36} fontWeight={700} fill="#20242b" fontFamily="Georgia, serif">N</text>
    </g>
    {/* map frame + corner marks */}
    <rect x={24} y={24} width={1032} height={1872} fill="none" stroke="#8a6a3b" strokeWidth={8} />
    <rect x={44} y={44} width={992} height={1832} fill="none" stroke="#8a6a3b" strokeWidth={3} />
    <text x={540} y={1560} textAnchor="middle" fontSize={34} fontWeight={700} fill="#8a6a3b" fontFamily="Georgia, serif">
      SOUTH PACIFIC • 19°S 160°E
    </text>
  </Plate>
);

/** ---------------- SUNNY OPEN SEA (day) ---------------- */
export const SunnySeaPlate: React.FC = () => {
  const f = useCurrentFrame();
  const wob = Math.sin(f * 0.08) * 12;
  return (
    <Plate>
      <defs>
        <linearGradient id="sunnySky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ec8f0" />
          <stop offset="60%" stopColor="#bfe6fb" />
          <stop offset="100%" stopColor="#e8f7ff" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#sunnySky)" />
      <circle cx={880} cy={220} r={90} fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} />
      <BlobCloud x={240} y={300} s={1.4} />
      <BlobCloud x={700} y={180} s={1.1} />
      <BlobCloud x={120} y={520} s={0.9} o={0.85} />
      {/* wave bands */}
      <path d={`M0,1150 Q135,${1120 + wob} 270,1150 Q405,${1180 - wob} 540,1150 Q675,${1120 + wob} 810,1150 Q945,${1180 - wob} 1080,1150 L1080,1920 L0,1920 Z`} fill="#3d8fd1" />
      <path d={`M0,1330 Q135,${1300 - wob} 270,1330 Q405,${1360 + wob} 540,1330 Q675,${1300 - wob} 810,1330 Q945,${1360 + wob} 1080,1330 L1080,1920 L0,1920 Z`} fill="#2e7ab8" />
      <path d={`M0,1540 Q135,${1510 + wob} 270,1540 Q405,${1570 - wob} 540,1540 Q675,${1510 + wob} 810,1540 Q945,${1570 - wob} 1080,1540 L1080,1920 L0,1920 Z`} fill="#25689e" />
      {/* whitecaps */}
      <g stroke="#fff" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.75}>
        <path d={`M120,${1180 + wob} Q160,1160 200,${1180 + wob}`} />
        <path d={`M700,${1190 - wob} Q740,1170 780,${1190 - wob}`} />
        <path d={`M420,${1370 - wob} Q460,1350 500,${1370 - wob}`} />
        <path d={`M880,${1580 + wob} Q920,1560 960,${1580 + wob}`} />
      </g>
    </Plate>
  );
};

/** ---------------- DARK CHALKBOARD (infographic cards) ---------------- */
export const ChalkPlate: React.FC = () => (
  <Plate>
    <rect width={W} height={H} fill="#1d2b4a" />
    <g stroke="#ffffff" strokeWidth={3} opacity={0.07}>
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M${rnd(i) * W},${rnd(i + 40) * H} q60,-20 120,10`} fill="none" />
      ))}
    </g>
    <g fill="#ffffff" opacity={0.08}>
      {Array.from({ length: 24 }).map((_, i) => (
        <circle key={i} cx={rnd(i + 70) * W} cy={rnd(i + 90) * H} r={2 + rnd(i + 110) * 3} />
      ))}
    </g>
  </Plate>
);

/** ---------------- 1970s COMPUTER ROOM (DEC mainframes) ----------------
 * Cold blue-grey room, rows of tall mainframe cabinets with blinking
 * lights and spinning tape reels, a terminal desk at the front. */
export const ComputerRoomPlate: React.FC = () => {
  const f = useCurrentFrame();
  const blink = (i: number) => (Math.sin(f * 0.35 + i * 1.9) > 0 ? 1 : 0.25);
  const reel = (f * 3) % 360;
  return (
    <Plate>
      <rect width={W} height={H} fill="#5a6b8a" />
      {/* wall panels */}
      <g fill="#4a5a76">
        <rect x={0} y={0} width={W} height={120} />
        <rect x={0} y={1060} width={W} height={40} />
      </g>
      <g stroke="#3a4a66" strokeWidth={4}>
        {[180, 360, 540, 720, 900].map((x) => (
          <path key={x} d={`M${x},120 L${x},1060`} />
        ))}
      </g>
      {/* ceiling light strips */}
      <g>
        <rect x={120} y={40} width={320} height={26} rx={13} fill="#e8f4ff" stroke={OUTLINE} strokeWidth={4} />
        <rect x={640} y={40} width={320} height={26} rx={13} fill="#e8f4ff" stroke={OUTLINE} strokeWidth={4} />
      </g>
      {/* back row of mainframe cabinets */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${70 + i * 250} 300)`}>
          <rect x={0} y={0} width={200} height={560} rx={14} fill="#d8d8d8" stroke={OUTLINE} strokeWidth={7} />
          <rect x={18} y={18} width={164} height={120} rx={8} fill="#2b3a55" stroke={OUTLINE} strokeWidth={5} />
          {/* blinking lights */}
          {[0, 1, 2, 3, 4, 5].map((j) => (
            <circle
              key={j}
              cx={38 + (j % 3) * 62}
              cy={52 + Math.floor(j / 3) * 56}
              r={13}
              fill={j % 2 === 0 ? "#7ee787" : "#ffd93b"}
              opacity={blink(i * 6 + j)}
              stroke={OUTLINE}
              strokeWidth={4}
            />
          ))}
          {/* tape reels */}
          <g transform={`rotate(${reel} 100 300)`}>
            <circle cx={100} cy={300} r={64} fill="none" stroke="#8a8a8a" strokeWidth={14} />
            <path d="M100,236 L100,364 M36,300 L164,300" stroke="#8a8a8a" strokeWidth={12} />
          </g>
          <circle cx={100} cy={300} r={16} fill="#5a5a5a" stroke={OUTLINE} strokeWidth={5} />
          <g transform={`rotate(${-reel} 100 470)`}>
            <circle cx={100} cy={470} r={52} fill="none" stroke="#8a8a8a" strokeWidth={12} />
            <path d="M100,418 L100,522 M48,470 L152,470" stroke="#8a8a8a" strokeWidth={10} />
          </g>
          <circle cx={100} cy={470} r={13} fill="#5a5a5a" stroke={OUTLINE} strokeWidth={5} />
          {/* vents */}
          <g stroke="#9a9a9a" strokeWidth={6}>
            <path d="M24,540 L176,540 M24,556 L176,556" />
          </g>
        </g>
      ))}
      {/* floor */}
      <path d="M0,1100 L1080,1100 L1080,1920 L0,1920 Z" fill="#8a97ad" />
      <path d="M0,1100 L1080,1100" stroke={OUTLINE} strokeWidth={6} />
      <g stroke="#7a879d" strokeWidth={4}>
        <path d="M0,1300 L1080,1300 M0,1520 L1080,1520 M0,1740 L1080,1740" />
        <path d="M270,1100 L270,1920 M540,1100 L540,1920 M810,1100 L810,1920" />
      </g>
      {/* cables snaking on the floor */}
      <g fill="none" stroke="#3a4a66" strokeWidth={8} strokeLinecap="round">
        <path d="M120,1160 Q300,1240 480,1180 Q700,1120 960,1200" />
        <path d="M80,1420 Q320,1500 560,1440 Q800,1380 1000,1460" opacity={0.7} />
      </g>
    </Plate>
  );
};

/** ---------------- ARPANET NETWORK MAP ----------------
 * Dark navy map with glowing nodes (universities / labs) connected by
 * lines; a pulse travels along the links. Stylised, not geographic. */
export const NetworkPlate: React.FC<{ pulse?: boolean }> = ({ pulse = true }) => {
  const f = useCurrentFrame();
  const nodes: Array<[number, number, string]> = [
    [180, 420, "UCLA"], [420, 320, "STANFORD"], [700, 380, "MIT"],
    [880, 560, "HARVARD"], [300, 700, "UTAH"], [560, 640, "SRI"],
    [800, 820, "BBN"], [200, 980, "UCSB"], [480, 920, "RAND"],
    [760, 1080, "DEC"], [340, 1180, "CASE"], [620, 1240, "CMU"],
  ];
  const links: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [3, 6],
    [4, 5], [5, 6], [4, 7], [5, 8], [6, 9], [7, 10], [8, 10],
    [8, 11], [9, 11], [10, 11], [4, 8], [2, 6],
  ];
  const pt = pulse ? ((f % 90) / 90) : 0;
  return (
    <Plate>
      <rect width={W} height={H} fill="#16223e" />
      {/* dotted grid */}
      <g fill="#ffffff" opacity={0.06}>
        {Array.from({ length: 60 }).map((_, i) => (
          <circle key={i} cx={40 + (i % 10) * 110} cy={200 + Math.floor(i / 10) * 200} r={5} />
        ))}
      </g>
      {/* links */}
      <g stroke="#4a7ab5" strokeWidth={5} strokeLinecap="round">
        {links.map(([a, b], i) => (
          <path key={i} d={`M${nodes[a][0]},${nodes[a][1]} L${nodes[b][0]},${nodes[b][1]}`} />
        ))}
      </g>
      {/* travelling pulse dots */}
      {pulse &&
        links.map(([a, b], i) => {
          const ph = (pt + i * 0.13) % 1;
          const x = nodes[a][0] + (nodes[b][0] - nodes[a][0]) * ph;
          const y = nodes[a][1] + (nodes[b][1] - nodes[a][1]) * ph;
          return <circle key={i} cx={x} cy={y} r={10} fill="#7ee787" opacity={0.9} />;
        })}
      {/* nodes */}
      {nodes.map(([x, y, label], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={30} fill="#1d2b4a" stroke="#7ec8f0" strokeWidth={5} />
          <circle cx={x} cy={y} r={13} fill={label === "DEC" ? "#ffd93b" : "#7ec8f0"} />
          <text x={x} y={y + 52} textAnchor="middle" fontSize={26} fontWeight={700} fill="#bfe6fb" fontFamily="Arial, sans-serif">
            {label}
          </text>
        </g>
      ))}
      {/* bottom label band */}
      <rect x={0} y={1420} width={W} height={500} fill="#101a30" />
      <text x={540} y={1560} textAnchor="middle" fontSize={52} fontWeight={700} fill="#7ec8f0" fontFamily="Arial, sans-serif">
        ARPANET • 1978
      </text>
      <text x={540} y={1640} textAnchor="middle" fontSize={34} fontWeight={600} fill="#8fa8c8" fontFamily="Arial, sans-serif">
        the military network that became the internet
      </text>
    </Plate>
  );
};
