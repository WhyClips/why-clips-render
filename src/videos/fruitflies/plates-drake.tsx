// Drake–Cimarrones plates — Gullak flat style (same pattern as plates.tsx).
// Jungle, jungle trail, cimarrón village, hilltop with TWO oceans, riverbed.
// All original designs.
import React from "react";
import { useCurrentFrame } from "remotion";
import { OUTLINE } from "./characters";
import { Plate, BlobCloud } from "./plates";

const W = 1080;
const H = 1920;

/** deterministic pseudo-random in [0,1) */
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Big broadleaf jungle tree (silhouette layer). */
const JungleTreeSil: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#1d5c2e" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-12} y={0} width={24} height={120} fill="#5a3d28" stroke={OUTLINE} strokeWidth={5} />
    {/* canopy blobs */}
    <ellipse cx={0} cy={-90} rx={120} ry={70} fill={c} stroke={OUTLINE} strokeWidth={6} />
    <ellipse cx={-90} cy={-40} rx={80} ry={50} fill={c} stroke={OUTLINE} strokeWidth={6} />
    <ellipse cx={90} cy={-40} rx={80} ry={50} fill={c} stroke={OUTLINE} strokeWidth={6} />
    <ellipse cx={0} cy={-150} rx={80} ry={50} fill={c} stroke={OUTLINE} strokeWidth={6} />
  </g>
);

/** Hanging vines. */
const Vines: React.FC<{ x: number; len?: number; c?: string }> = ({ x, len = 300, c = "#2f7a3d" }) => (
  <g stroke={c} strokeWidth={10} strokeLinecap="round" fill="none">
    <path d={`M${x},0 Q${x + 30},${len * 0.4} ${x - 10},${len}`} />
    <path d={`M${x + 40},0 Q${x + 70},${len * 0.3} ${x + 30},${len * 0.8}`} strokeWidth={8} />
    <ellipse cx={x - 10} cy={len * 0.5} rx={22} ry={12} fill="#37b24d" stroke={OUTLINE} strokeWidth={4} transform={`rotate(30 ${x - 10} ${len * 0.5})`} />
    <ellipse cx={x + 30} cy={len * 0.7} rx={20} ry={11} fill="#2f9e44" stroke={OUTLINE} strokeWidth={4} transform={`rotate(-25 ${x + 30} ${len * 0.7})`} />
  </g>
);

/** ---------------- DENSE JUNGLE (hook / hiding / "the jungle knew him") ---------------- */
export const JunglePlate: React.FC = () => {
  const f = useCurrentFrame();
  const shaft = 0.10 + 0.05 * Math.sin(f * 0.06);
  return (
    <Plate>
      <defs>
        <linearGradient id="jungleSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f3d1e" />
          <stop offset="55%" stopColor="#1d5c2e" />
          <stop offset="100%" stopColor="#2f7a3d" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#jungleSky)" />
      {/* light shafts */}
      <g fill="#fff8c9" opacity={shaft}>
        <path d="M180,0 L320,0 L180,900 L60,900 Z" />
        <path d="M700,0 L800,0 L900,1100 L780,1100 Z" opacity={0.7} />
      </g>
      {/* far canopy layer */}
      <g>
        <JungleTreeSil x={180} y={980} s={1.6} c="#164a24" />
        <JungleTreeSil x={560} y={940} s={1.8} c="#164a24" />
        <JungleTreeSil x={920} y={990} s={1.5} c="#164a24" />
      </g>
      {/* mid canopy layer */}
      <g>
        <JungleTreeSil x={80} y={1150} s={1.2} c="#1d5c2e" />
        <JungleTreeSil x={420} y={1120} s={1.35} c="#2f7a3d" />
        <JungleTreeSil x={760} y={1160} s={1.2} c="#1d5c2e" />
        <JungleTreeSil x={1010} y={1130} s={1.1} c="#2f7a3d" />
      </g>
      {/* vines hanging from the top */}
      <Vines x={300} len={420} />
      <Vines x={860} len={360} />
      <Vines x={620} len={260} c="#37b24d" />
      {/* big leaves framing the sides */}
      <g fill="#37b24d" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round">
        <path d="M0,600 Q140,560 220,680 Q120,740 0,700 Z" />
        <path d="M1080,700 Q940,660 860,780 Q960,840 1080,800 Z" />
        <path d="M0,1050 Q120,1010 200,1120 Q100,1180 0,1140 Z" />
      </g>
      {/* jungle floor */}
      <path d="M0,1420 L1080,1420 L1080,1920 L0,1920 Z" fill="#4a6b2f" />
      <path d="M0,1420 L1080,1420 L1080,1470 L0,1470 Z" fill="#3d5c26" />
      {/* ferns on the floor */}
      <g stroke="#2f9e44" strokeWidth={8} strokeLinecap="round" fill="none">
        <path d="M140,1620 Q120,1500 160,1420 M140,1620 Q170,1500 190,1440 M140,1620 Q110,1540 90,1460" />
        <path d="M920,1660 Q900,1540 940,1460 M920,1660 Q950,1540 970,1480 M920,1660 Q890,1580 870,1500" />
      </g>
      <g fill="#37b24d" stroke={OUTLINE} strokeWidth={4}>
        <ellipse cx={300} cy={1700} rx={60} ry={20} />
        <ellipse cx={700} cy={1760} rx={70} ry={22} />
        <ellipse cx={540} cy={1620} rx={50} ry={16} />
      </g>
    </Plate>
  );
};

/** ---------------- JUNGLE TRAIL (mule train walks the treasure road) ---------------- */
export const TrailPlate: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f % 600) * 0.1;
  return (
    <Plate>
      <defs>
        <linearGradient id="trailSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ec8f0" />
          <stop offset="55%" stopColor="#bfe6fb" />
          <stop offset="100%" stopColor="#e8f7ff" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#trailSky)" />
      <circle cx={880} cy={200} r={80} fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} />
      <g transform={`translate(${drift - 40} 0)`}>
        <BlobCloud x={260} y={260} s={1.2} />
        <BlobCloud x={700} y={150} s={1.0} />
      </g>
      {/* jungle walls left + right */}
      <g>
        <JungleTreeSil x={60} y={1100} s={1.4} c="#1d5c2e" />
        <JungleTreeSil x={-40} y={1300} s={1.1} c="#2f7a3d" />
        <JungleTreeSil x={1020} y={1100} s={1.4} c="#1d5c2e" />
        <JungleTreeSil x={1120} y={1300} s={1.1} c="#2f7a3d" />
        <JungleTreeSil x={300} y={1000} s={1.0} c="#164a24" />
        <JungleTreeSil x={780} y={1000} s={1.0} c="#164a24" />
      </g>
      {/* dirt road in perspective */}
      <path d="M430,1080 L650,1080 L900,1920 L180,1920 Z" fill="#c98d5a" stroke={OUTLINE} strokeWidth={6} />
      <path d="M430,1080 L650,1080 L680,1240 L400,1240 Z" fill="#b57a48" />
      {/* roadside grass */}
      <path d="M0,1080 L430,1080 L180,1920 L0,1920 Z" fill="#5cb84a" />
      <path d="M650,1080 L1080,1080 L1080,1920 L900,1920 Z" fill="#5cb84a" />
      <path d="M0,1080 L1080,1080 L1080,1140 L0,1140 Z" fill="#4da63e" />
      {/* stones on the road */}
      <g fill="#9a9a9a" stroke={OUTLINE} strokeWidth={4}>
        <ellipse cx={480} cy={1400} rx={22} ry={12} />
        <ellipse cx={600} cy={1620} rx={26} ry={14} />
        <ellipse cx={520} cy={1800} rx={20} ry={11} />
      </g>
      <Vines x={120} len={300} />
      <Vines x={980} len={280} />
    </Plate>
  );
};

/** ---------------- CIMARRÓN VILLAGE (free village in the jungle) ---------------- */
export const VillagePlate: React.FC = () => {
  const f = useCurrentFrame();
  const flick = 1 + Math.sin(f * 0.5) * 0.15;
  return (
    <Plate>
      <defs>
        <linearGradient id="villageSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb35c" />
          <stop offset="55%" stopColor="#ffd93b" />
          <stop offset="100%" stopColor="#fff3c4" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#villageSky)" />
      <circle cx={180} cy={220} r={80} fill="#fff3c4" stroke={OUTLINE} strokeWidth={6} />
      <BlobCloud x={700} y={240} s={1.2} o={0.9} />
      <BlobCloud x={300} y={420} s={0.9} o={0.85} />
      {/* jungle edge behind the village */}
      <g>
        <JungleTreeSil x={120} y={1050} s={1.2} c="#1d5c2e" />
        <JungleTreeSil x={960} y={1050} s={1.2} c="#1d5c2e" />
        <JungleTreeSil x={540} y={1000} s={1.0} c="#164a24" />
      </g>
      {/* ground */}
      <path d="M0,1180 L1080,1180 L1080,1920 L0,1920 Z" fill="#6fbf5a" />
      <path d="M0,1180 L1080,1180 L1080,1240 L0,1240 Z" fill="#5cb84a" />
      {/* thatched huts */}
      <g transform="translate(90 1180)">
        <rect x={20} y={120} width={220} height={160} fill="#c98d5a" stroke={OUTLINE} strokeWidth={7} />
        <path d="M0,130 L130,20 L260,130 Z" fill="#e8c96a" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
        <path d="M20,130 L130,40 L240,130" fill="none" stroke="#c9a94e" strokeWidth={5} />
        <rect x={100} y={180} width={60} height={100} fill="#5a3d28" stroke={OUTLINE} strokeWidth={5} />
      </g>
      <g transform="translate(700 1220) scale(1.15)">
        <rect x={20} y={120} width={220} height={160} fill="#c98d5a" stroke={OUTLINE} strokeWidth={7} />
        <path d="M0,130 L130,20 L260,130 Z" fill="#e8c96a" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
        <path d="M20,130 L130,40 L240,130" fill="none" stroke="#c9a94e" strokeWidth={5} />
        <rect x={100} y={180} width={60} height={100} fill="#5a3d28" stroke={OUTLINE} strokeWidth={5} />
      </g>
      {/* campfire */}
      <g transform={`translate(540 1560) scale(${flick})`}>
        <ellipse cx={0} cy={60} rx={90} ry={18} fill="#5a3d28" stroke={OUTLINE} strokeWidth={5} />
        <g stroke="#7a4a21" strokeWidth={12} strokeLinecap="round">
          <path d="M-60,50 L60,-10 M60,50 L-60,-10" />
        </g>
        <path d="M0,50 Q-36,0 -16,-50 Q0,-80 16,-50 Q36,0 0,50 Z" fill="#ff7b54" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M0,50 Q-16,10 -8,-30 Q0,-48 8,-30 Q16,10 0,50 Z" fill="#ffd93b" />
      </g>
      {/* smoke */}
      <g fill="#fff" opacity={0.5}>
        <ellipse cx={540} cy={1420} rx={26} ry={16} />
        <ellipse cx={560} cy={1360} rx={34} ry={20} />
        <ellipse cx={530} cy={1300} rx={40} ry={22} />
      </g>
    </Plate>
  );
};

/** ---------------- HILLTOP, TWO OCEANS (the payoff view) ---------------- */
export const HilltopPlate: React.FC = () => {
  const f = useCurrentFrame();
  const wob = Math.sin(f * 0.08) * 10;
  return (
    <Plate>
      <defs>
        <linearGradient id="hillSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a6fa5" />
          <stop offset="55%" stopColor="#7ec8f0" />
          <stop offset="100%" stopColor="#e8f7ff" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#hillSky)" />
      <circle cx={540} cy={220} r={90} fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} />
      <BlobCloud x={200} y={300} s={1.2} />
      <BlobCloud x={850} y={420} s={1.0} o={0.9} />
      {/* ATLANTIC (left, deep blue) */}
      <path d={`M0,900 Q135,${880 + wob} 270,900 Q405,${920 - wob} 540,900 L540,1920 L0,1920 Z`} fill="#2e5a8a" />
      <path d={`M0,1080 Q135,${1060 - wob} 270,1080 Q405,${1100 + wob} 540,1080 L540,1920 L0,1920 Z`} fill="#24507e" />
      {/* PACIFIC (right, teal) */}
      <path d={`M540,900 Q675,${880 - wob} 810,900 Q945,${920 + wob} 1080,900 L1080,1920 L540,1920 Z`} fill="#1f8a70" />
      <path d={`M540,1080 Q675,${1060 + wob} 810,1080 Q945,${1100 - wob} 1080,1080 L1080,1920 L540,1920 Z`} fill="#17705a" />
      {/* whitecaps on both seas */}
      <g stroke="#fff" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.7}>
        <path d={`M120,${960 + wob} Q160,940 200,${960 + wob}`} />
        <path d={`M880,${960 - wob} Q920,940 960,${960 - wob}`} />
        <path d={`M300,${1160 - wob} Q340,1140 380,${1160 - wob}`} />
        <path d={`M700,${1160 + wob} Q740,1140 780,${1160 + wob}`} />
      </g>
      {/* the hill itself — broad green mound rising between the two seas,
          wide enough for three figures to stand on it */}
      <path d="M150,1920 Q220,1150 540,1040 Q860,1150 930,1920 Z" fill="#5cb84a" stroke={OUTLINE} strokeWidth={7} />
      <path d="M280,1920 Q340,1350 540,1280 Q740,1350 800,1920 Z" fill="#4da63e" />
      {/* tiny trees on the hill */}
      <g>
        <ellipse cx={420} cy={1420} rx={40} ry={26} fill="#2f7a3d" stroke={OUTLINE} strokeWidth={4} />
        <ellipse cx={660} cy={1460} rx={36} ry={24} fill="#2f7a3d" stroke={OUTLINE} strokeWidth={4} />
      </g>
      {/* distant ships on both seas */}
      <g transform="translate(180 960) scale(0.55)" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round">
        <path d="M0,40 L120,40 L100,70 L20,70 Z" fill="#8a5a2b" />
        <rect x={56} y={-60} width={8} height={100} fill="#5a3d28" />
        <path d="M64,-60 L64,30 L110,30 Z" fill="#f5f5f0" />
      </g>
      <g transform="translate(820 960) scale(0.55)" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round">
        <path d="M0,40 L120,40 L100,70 L20,70 Z" fill="#8a5a2b" />
        <rect x={56} y={-60} width={8} height={100} fill="#5a3d28" />
        <path d="M64,-60 L64,30 L110,30 Z" fill="#f5f5f0" />
      </g>
    </Plate>
  );
};

/** ---------------- RIVERBED (stolen silver hidden in the river) ---------------- */
export const RiverPlate: React.FC = () => {
  const f = useCurrentFrame();
  const flow = (f % 120) * 4;
  return (
    <Plate>
      <defs>
        <linearGradient id="riverSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ec8f0" />
          <stop offset="55%" stopColor="#bfe6fb" />
          <stop offset="100%" stopColor="#e8f7ff" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#riverSky)" />
      <BlobCloud x={300} y={220} s={1.3} />
      <BlobCloud x={800} y={360} s={1.0} o={0.9} />
      {/* jungle banks */}
      <g>
        <JungleTreeSil x={90} y={1000} s={1.3} c="#1d5c2e" />
        <JungleTreeSil x={990} y={1000} s={1.3} c="#1d5c2e" />
        <JungleTreeSil x={540} y={940} s={1.0} c="#164a24" />
      </g>
      {/* sandy banks */}
      <path d="M0,1050 L1080,1050 L1080,1920 L0,1920 Z" fill="#e8c96a" />
      {/* the river — wide blue band with flow lines */}
      <path d="M0,1240 Q270,1180 540,1240 Q810,1300 1080,1240 L1080,1620 Q810,1680 540,1620 Q270,1560 0,1620 Z" fill="#5aa8e8" stroke={OUTLINE} strokeWidth={6} />
      <g stroke="#fff" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.65}>
        <path d={`M${-40 + flow},1330 Q200,1300 420,1330`} />
        <path d={`M${300 + flow},1430 Q520,1400 740,1430`} />
        <path d={`M${-100 + flow},1530 Q140,1500 380,1530`} />
      </g>
      {/* rocks in the river */}
      <g fill="#9a9a9a" stroke={OUTLINE} strokeWidth={5}>
        <ellipse cx={300} cy={1420} rx={52} ry={30} />
        <ellipse cx={780} cy={1480} rx={60} ry={34} />
        <ellipse cx={560} cy={1560} rx={44} ry={26} />
      </g>
      {/* sandy foreground */}
      <path d="M0,1680 L1080,1680 L1080,1920 L0,1920 Z" fill="#e8c96a" />
      <g fill="#c9a94e">
        <ellipse cx={220} cy={1800} rx={60} ry={16} />
        <ellipse cx={820} cy={1840} rx={70} ry={18} />
      </g>
    </Plate>
  );
};
