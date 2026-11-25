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

/** ---------------- SPACE (hook / rocket flight) ---------------- */
export const SpacePlate: React.FC = () => {
  const f = useCurrentFrame();
  const tw = 0.6 + 0.4 * Math.sin(f * 0.12);
  return (
    <Plate>
      <defs>
        <linearGradient id="spaceSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070a1c" />
          <stop offset="60%" stopColor="#141b3d" />
          <stop offset="100%" stopColor="#1d2b4a" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#spaceSky)" />
      <Stars n={110} top={1500} />
      {/* twinkling big stars */}
      <g fill="#fff" opacity={tw}>
        <path d="M180,300 L188,322 L210,330 L188,338 L180,360 L172,338 L150,330 L172,322 Z" />
        <path d="M880,520 L886,538 L904,544 L886,550 L880,568 L874,550 L856,544 L874,538 Z" />
        <path d="M480,180 L485,196 L501,201 L485,206 L480,222 L475,206 L459,201 L475,196 Z" />
      </g>
      {/* Earth (top left) */}
      <g transform="translate(200 420)">
        <circle cx={0} cy={0} r={110} fill="#5aa8e8" stroke={OUTLINE} strokeWidth={7} />
        <path d="M-70,-30 Q-30,-70 20,-50 Q50,-20 10,10 Q-40,30 -70,0 Z" fill="#6fbf5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M-20,50 Q30,30 60,60 Q50,100 -10,95 Z" fill="#6fbf5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <ellipse cx={-30} cy={-70} rx={60} ry={16} fill="#fff" opacity={0.75} />
      </g>
      {/* Moon (top right) */}
      <g transform="translate(860 300)">
        <circle cx={0} cy={0} r={130} fill="#d8d8d8" stroke={OUTLINE} strokeWidth={7} />
        <circle cx={-40} cy={-30} r={26} fill="#b8b8b8" />
        <circle cx={40} cy={30} r={34} fill="#b8b8b8" />
        <circle cx={-10} cy={60} r={18} fill="#b8b8b8" />
        <circle cx={60} cy={-50} r={14} fill="#b8b8b8" />
      </g>
    </Plate>
  );
};

/** ---------------- LAUNCH PAD (day, gantry tower) ---------------- */
export const LaunchPadPlate: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f % 600) * 0.12;
  return (
    <Plate>
      <defs>
        <linearGradient id="launchSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ec8f0" />
          <stop offset="60%" stopColor="#bfe6fb" />
          <stop offset="100%" stopColor="#e8f7ff" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#launchSky)" />
      <circle cx={900} cy={220} r={80} fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} />
      <g transform={`translate(${drift - 40} 0)`}>
        <BlobCloud x={260} y={280} s={1.3} />
        <BlobCloud x={700} y={160} s={1.0} />
      </g>
      <BlobCloud x={140} y={520} s={0.9} o={0.85} />
      {/* gantry tower (left) */}
      <g transform="translate(120 620)" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round">
        <rect x={0} y={0} width={130} height={640} fill="#c94f38" />
        <rect x={0} y={0} width={130} height={640} fill="none" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={0} y={i * 160} width={130} height={80} fill="#f5f5f0" />
        ))}
        <path d="M0,0 L130,160 M130,0 L0,160 M0,320 L130,480 M130,320 L0,480" fill="none" strokeWidth={5} />
      </g>
      {/* service arm */}
      <g transform="translate(250 700)">
        <rect x={0} y={0} width={180} height={34} fill="#8a8a8a" stroke={OUTLINE} strokeWidth={6} />
        <rect x={150} y={34} width={24} height={60} fill="#666" stroke={OUTLINE} strokeWidth={5} />
      </g>
      {/* distant buildings */}
      <g stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round">
        <rect x={760} y={1080} width={240} height={160} fill="#f2c14e" />
        <path d="M760,1080 L880,990 L1000,1080 Z" fill="#e8634a" />
        <rect x={60} y={1180} width={160} height={90} fill="#7ec8f0" />
      </g>
      {/* ground */}
      <path d="M0,1270 L1080,1270 L1080,1920 L0,1920 Z" fill="#8fce6e" />
      <path d="M0,1270 L1080,1270 L1080,1330 L0,1330 Z" fill="#5cb84a" />
      {/* concrete pad */}
      <path d="M330,1270 L750,1270 L830,1920 L250,1920 Z" fill="#b8b8b8" stroke={OUTLINE} strokeWidth={6} />
      <path d="M330,1270 L750,1270 L770,1420 L310,1420 Z" fill="#9a9a9a" />
      <ConeTree x={120} y={1300} s={0.8} />
      <ConeTree x={960} y={1300} s={0.7} c="#37b24d" />
    </Plate>
  );
};

/** ---------------- QUARANTINE ROOM (flat NASA interior) ---------------- */
export const QuarantinePlate: React.FC = () => (
  <Plate>
    <rect width={W} height={H} fill="#c8d8e8" />
    <g stroke="#aec4da" strokeWidth={5} fill="none" opacity={0.8}>
      <path d="M180,200 L220,320 L190,420" />
      <path d="M880,260 L850,380" />
    </g>
    {/* window with launch pad view */}
    <g transform="translate(660 240)">
      <rect x={0} y={0} width={300} height={320} fill="#bfe6fb" stroke={OUTLINE} strokeWidth={7} />
      <path d="M150,0 L150,320 M0,160 L300,160" stroke={OUTLINE} strokeWidth={6} />
      {/* tiny rocket out the window */}
      <g transform="translate(120 190)">
        <path d="M0,-70 Q22,-40 22,20 L22,60 L0,60 L-22,60 L-22,20 Q-22,-40 0,-70 Z" fill="#f5f5f0" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <rect x={-22} y={-10} width={44} height={14} fill="#333" />
        <path d="M-10,60 L0,92 L10,60 Z" fill="#ff7b54" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      </g>
      <ellipse cx={70} cy={60} rx={50} ry={20} fill="#fff" />
    </g>
    {/* QUARANTINE sign */}
    <g transform="translate(100 270)">
      <rect x={0} y={0} width={400} height={120} rx={18} fill="#ffd93b" stroke={OUTLINE} strokeWidth={7} />
      <rect x={14} y={14} width={372} height={92} rx={10} fill="none" stroke={OUTLINE} strokeWidth={3} />
    </g>
    {/* mission poster */}
    <g transform="translate(120 560)">
      <rect x={0} y={0} width={200} height={260} fill="#1d2b4a" stroke={OUTLINE} strokeWidth={6} />
      <circle cx={100} cy={80} r={52} fill="#d8d8d8" stroke="#fff" strokeWidth={4} />
      <circle cx={84} cy={70} r={12} fill="#b8b8b8" />
      <circle cx={118} cy={96} r={16} fill="#b8b8b8" />
      <rect x={40} y={160} width={120} height={16} rx={8} fill="#ffd93b" />
      <rect x={55} y={192} width={90} height={12} rx={6} fill="#fff" opacity={0.8} />
    </g>
    {/* shelf with books */}
    <g transform="translate(700 640)">
      <rect x={0} y={0} width={280} height={18} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={5} />
      <rect x={20} y={-80} width={44} height={80} rx={6} fill="#e8634a" stroke={OUTLINE} strokeWidth={5} />
      <rect x={72} y={-64} width={44} height={64} rx={6} fill="#4a6fa5" stroke={OUTLINE} strokeWidth={5} />
      <rect x={124} y={-88} width={44} height={88} rx={6} fill="#2f9e44" stroke={OUTLINE} strokeWidth={5} />
      <rect x={176} y={-70} width={44} height={70} rx={6} fill="#f2c14e" stroke={OUTLINE} strokeWidth={5} />
    </g>
    {/* floor */}
    <path d="M0,1420 L1080,1420 L1080,1920 L0,1920 Z" fill="#b08d5a" />
    <path d="M0,1420 L1080,1420" stroke={OUTLINE} strokeWidth={6} />
    <g stroke="#9a7a48" strokeWidth={4}>
      <path d="M0,1580 L1080,1580 M0,1740 L1080,1740 M0,1880 L1080,1880" />
    </g>
    {/* rug */}
    <ellipse cx={540} cy={1680} rx={400} ry={100} fill="#4a6fa5" opacity={0.4} />
  </Plate>
);

/** ---------------- MOON SURFACE ---------------- */
export const MoonPlate: React.FC = () => (
  <Plate>
    <rect width={W} height={H} fill="#070a1c" />
    <Stars n={90} top={1000} />
    {/* Earth in the sky */}
    <g transform="translate(840 300)">
      <circle cx={0} cy={0} r={90} fill="#5aa8e8" stroke={OUTLINE} strokeWidth={7} />
      <path d="M-56,-24 Q-24,-56 16,-40 Q40,-16 8,8 Q-32,24 -56,0 Z" fill="#6fbf5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-16,40 Q24,24 48,48 Q40,80 -8,76 Z" fill="#6fbf5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      <ellipse cx={-24} cy={-56} rx={48} ry={13} fill="#fff" opacity={0.75} />
    </g>
    {/* moon ground */}
    <path d="M0,1080 Q270,1000 540,1070 Q810,1000 1080,1070 L1080,1920 L0,1920 Z" fill="#c8c8c8" />
    <path d="M0,1080 Q270,1000 540,1070 Q810,1000 1080,1070" fill="none" stroke={OUTLINE} strokeWidth={6} />
    {/* craters */}
    <g fill="#b0b0b0" stroke="#9a9a9a" strokeWidth={5}>
      <ellipse cx={220} cy={1300} rx={110} ry={36} />
      <ellipse cx={760} cy={1450} rx={140} ry={44} />
      <ellipse cx={480} cy={1700} rx={90} ry={30} />
      <ellipse cx={900} cy={1180} rx={70} ry={24} />
      <ellipse cx={140} cy={1650} rx={60} ry={20} />
    </g>
    <g fill="#a0a0a0">
      <ellipse cx={220} cy={1306} rx={70} ry={20} />
      <ellipse cx={760} cy={1458} rx={90} ry={26} />
    </g>
    {/* footprints */}
    <g fill="#a8a8a8">
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={330 + i * 70} cy={1560 + (i % 2) * 40} rx={22} ry={12} transform={`rotate(-14 ${330 + i * 70} ${1560 + (i % 2) * 40})`} />
      ))}
    </g>
  </Plate>
);

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
