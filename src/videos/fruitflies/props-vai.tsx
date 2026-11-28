// Vai script Short — original SVG props + custom plates (Gullak Tales style).
// All designs are original: abstract Vai-like glyph marks (NOT real Vai
// Unicode — the Fredoka font has no Vai block), a Liberia village, a night
// sky for the dream, and the story's objects (berries, school, phone).
import React from "react";
import { useCurrentFrame } from "remotion";
import { pop } from "./story";
import { OUTLINE, Chibi } from "./characters";
import { Plate, BlobCloud, ConeTree } from "./plates";
import type { Expression, ArmPose } from "./characters";
import type { MouthShape } from "./story";

/** Bukele — 1833 Vai villager: dark skin, black hair, earth-brown shirt.
 *  Uses raw Chibi (no tie — Crewman adds one, wrong for a villager). */
export const Bukele: React.FC<{
  expression?: Expression; mouth?: MouthShape; arm?: ArmPose; seed?: number;
}> = ({ expression = "calm", mouth = "closed", arm = "down", seed = 1 }) => (
  <Chibi
    skin="#8d5a2b" hair="#1a1a1a" hairStyle="neat"
    jacket="#b5651d" jacketDark="#8a4a15" trousers="#5a4020"
    expression={expression} mouth={mouth} arm={arm} seed={seed}
  />
);

/** Bukele as an old man (final beat): grey hair, same shirt. */
export const OldBukele: React.FC<{
  expression?: Expression; mouth?: MouthShape; arm?: ArmPose; seed?: number;
}> = ({ expression = "happy", mouth = "closed", arm = "oneUp", seed = 1 }) => (
  <Chibi
    skin="#8d5a2b" hair="#d8d8d8" hairStyle="neat"
    jacket="#b5651d" jacketDark="#8a4a15" trousers="#5a4020"
    expression={expression} mouth={mouth} arm={arm} seed={seed}
  />
);

/** A Vai family member (variants 0-2: woman, young man, elder). */
export const FamilyMember: React.FC<{
  variant?: 0 | 1 | 2; expression?: Expression; mouth?: MouthShape;
  arm?: ArmPose; seed?: number;
}> = ({ variant = 0, expression = "happy", mouth = "closed", arm = "down", seed = 2 }) => {
  const v = [
    { skin: "#6b4423", hair: "#1a1a1a", jacket: "#2f9e44", jacketDark: "#237a34", trousers: "#3a5f9e" },
    { skin: "#a0662f", hair: "#1a1a1a", jacket: "#e8634a", jacketDark: "#b04a38", trousers: "#5a4020" },
    { skin: "#6b4423", hair: "#d8d8d8", jacket: "#4a6fa5", jacketDark: "#37557e", trousers: "#3a3a4d" },
  ][variant];
  return (
    <Chibi
      skin={v.skin} hair={v.hair} hairStyle="neat"
      jacket={v.jacket} jacketDark={v.jacketDark} trousers={v.trousers}
      expression={expression} mouth={mouth} arm={arm} seed={seed}
    />
  );
};

// ---------------- Vai glyphs (abstract marks, 8 variants) ----------------
const GLYPH_PATHS: string[] = [
  // g0: circle + centre dot
  "M50,22 A28,28 0 1,1 49.9,22",
  // g1: cross
  "M50,14 L50,86 M18,50 L82,50",
  // g2: zigzag (lightning)
  "M24,72 L40,28 L56,64 L72,24 L84,52",
  // g3: three bars
  "M24,30 L76,30 M24,50 L76,50 M24,70 L76,70",
  // g4: arch + stem
  "M24,72 A26,26 0 0,1 76,72 M50,46 L50,86",
  // g5: triangle + dot
  "M50,18 L80,76 L20,76 Z",
  // g6: double arc (waves)
  "M24,42 A26,26 0 0,1 76,42 M28,64 A22,22 0 0,0 72,64",
  // g7: diamond + cross
  "M50,16 L78,50 L50,84 L22,50 Z M50,34 L50,66 M34,50 L66,50",
];

export const VaiGlyph: React.FC<{ g?: number; size?: number; color?: string }> = ({
  g = 0, size = 100, color = "#20242b",
}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: "visible" }}>
    <path
      d={GLYPH_PATHS[((g % 8) + 8) % 8]}
      fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round"
    />
    {(g % 8 === 0 || g % 8 === 5) && <circle cx={50} cy={50} r={6} fill={color} />}
  </svg>
);

/** One alphabet tile: cream square, dark border, one glyph mark. */
export const GlyphTile: React.FC<{
  g?: number; size?: number; rotate?: number; delay?: number; bg?: string;
}> = ({ g = 0, size = 120, rotate = 0, delay = 0, bg = "#fdf3d8" }) => {
  const frame = useCurrentFrame();
  const s = pop((frame - delay) / 9);
  return (
    <div
      style={{
        width: size, height: size,
        backgroundColor: bg,
        border: `6px solid ${OUTLINE}`,
        borderRadius: 20,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 0 rgba(0,0,0,0.25)",
        transform: `rotate(${rotate}deg) scale(${s})`,
      }}
    >
      <VaiGlyph g={g} size={size * 0.72} />
    </div>
  );
};

/** A wall of alphabet tiles (rows x cols), glyphs cycling 0-7. */
export const GlyphGrid: React.FC<{
  rows?: number; cols?: number; size?: number; gap?: number; delayStep?: number;
}> = ({ rows = 3, cols = 5, size = 130, gap = 18, delayStep = 3 }) => {
  const tiles: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      tiles.push(
        <GlyphTile key={i} g={i % 8} size={size} rotate={((i * 37) % 11) - 5} delay={i * delayStep} />
      );
    }
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, alignItems: "center" }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: "flex", gap }}>{tiles.slice(r * cols, (r + 1) * cols)}</div>
      ))}
    </div>
  );
};

/** Dream cloud: white cloud with glyph tiles riding on it. */
export const DreamCloud: React.FC<{ tiles?: number[] }> = ({ tiles = [0, 2, 5, 1] }) => (
  <div style={{ position: "relative", width: 640, height: 300 }}>
    <svg viewBox="0 0 640 300" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g fill="#ffffff" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round">
        <ellipse cx={180} cy={210} rx={130} ry={80} />
        <ellipse cx={340} cy={180} rx={150} ry={100} />
        <ellipse cx={490} cy={215} rx={120} ry={75} />
        <circle cx={240} cy={130} r={70} />
        <circle cx={400} cy={120} r={80} />
      </g>
    </svg>
    {tiles.map((g, i) => (
      <div key={i} style={{ position: "absolute", left: 90 + i * 130, top: 110 + (i % 2) * 40 }}>
        <GlyphTile g={g} size={96} rotate={((i * 53) % 13) - 6} delay={6 + i * 5} bg="#ffe9a8" />
      </div>
    ))}
  </div>
);

// ---------------- custom plates ----------------
/** Night over a Vai village: dark sky, stars, big moon, hut silhouettes. */
export const NightPlate: React.FC = () => {
  const f = useCurrentFrame();
  const tw = 0.6 + 0.4 * Math.sin(f * 0.12);
  return (
    <Plate>
      <defs>
        <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070a1c" />
          <stop offset="60%" stopColor="#141b3d" />
          <stop offset="100%" stopColor="#2a3558" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#nightSky)" />
      <g fill="#fff" opacity={0.9}>
        {[
          [120, 180], [300, 90], [480, 220], [660, 120], [840, 200], [980, 100],
          [200, 420], [420, 360], [620, 440], [760, 340], [940, 430], [80, 620],
          [360, 560], [540, 640], [880, 600], [150, 820], [980, 800],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 5 : 3} />
        ))}
      </g>
      <g fill="#fff" opacity={tw}>
        <path d="M180,300 L188,322 L210,330 L188,338 L180,360 L172,338 L150,330 L172,322 Z" />
        <path d="M880,520 L886,538 L904,544 L886,550 L880,568 L874,550 L856,544 L874,538 Z" />
      </g>
      {/* big moon */}
      <g transform="translate(840 300)">
        <circle cx={0} cy={0} r={120} fill="#ffe9a8" stroke={OUTLINE} strokeWidth={7} />
        <circle cx={-36} cy={-28} r={24} fill="#f2c14e" />
        <circle cx={36} cy={28} r={30} fill="#f2c14e" />
        <circle cx={-8} cy={56} r={16} fill="#f2c14e" />
      </g>
      {/* village silhouette: thatched huts */}
      <g transform="translate(0 1180)">
        <path d="M0,740 L1080,740 L1080,220 L0,220 Z" fill="#0e1430" />
        <g stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round">
          <g transform="translate(120 300)">
            <rect x={0} y={80} width={180} height={140} fill="#1c2340" />
            <path d="M-30,90 L90,-30 L210,90 Z" fill="#2a2a38" />
          </g>
          <g transform="translate(700 320)">
            <rect x={0} y={60} width={200} height={160} fill="#1c2340" />
            <path d="M-30,70 L100,-50 L230,70 Z" fill="#2a2a38" />
          </g>
          <g transform="translate(420 380)">
            <rect x={0} y={100} width={150} height={120} fill="#1c2340" />
            <path d="M-24,110 L75,-10 L174,110 Z" fill="#2a2a38" />
          </g>
        </g>
        {/* warm windows */}
        <g fill="#ffd93b">
          <rect x={180} y={1380} width={36} height={44} />
          <rect x={770} y={1400} width={36} height={44} />
          <rect x={470} y={1500} width={30} height={38} />
        </g>
        {/* palm silhouettes */}
        <g stroke="#0e1430" strokeWidth={10} strokeLinecap="round" fill="none">
          <path d="M90,740 L90,520 M90,520 Q40,470 10,490 M90,520 Q140,460 180,480 M90,520 Q90,450 90,430" />
          <path d="M990,740 L990,540 M990,540 Q940,490 910,510 M990,540 Q1040,480 1080,500" />
        </g>
      </g>
    </Plate>
  );
};

/** Liberia village by day: warm sky, sun, hills, dirt ground, huts, palms. */
export const VillagePlate: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f % 600) * 0.15;
  return (
    <Plate>
      <defs>
        <linearGradient id="villageSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7ec8f0" />
          <stop offset="60%" stopColor="#bfe6fb" />
          <stop offset="100%" stopColor="#fff3c4" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#villageSky)" />
      <circle cx={880} cy={220} r={90} fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} />
      <circle cx={880} cy={220} r={112} fill="none" stroke="#ffd93b" strokeWidth={6} opacity={0.4} />
      <g transform={`translate(${drift - 60} 0)`}>
        <BlobCloud x={240} y={300} s={1.4} />
        <BlobCloud x={700} y={180} s={1.1} />
      </g>
      <BlobCloud x={120} y={520} s={0.9} o={0.85} />
      {/* distant hills */}
      <path d="M0,1080 Q270,980 540,1060 Q810,980 1080,1060 L1080,1920 L0,1920 Z" fill="#8fce6e" />
      {/* dirt ground */}
      <path d="M0,1420 L1080,1420 L1080,1920 L0,1920 Z" fill="#c98a4b" />
      <path d="M0,1420 L1080,1420 L1080,1460 L0,1460 Z" fill="#a5662f" opacity={0.6} />
      {/* thatched huts */}
      <g stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round">
        <g transform="translate(80 1060)">
          <rect x={0} y={90} width={200} height={150} fill="#e8c88a" />
          <path d="M-30,100 L100,-30 L230,100 Z" fill="#c9a227" />
          <rect x={80} y={150} width={50} height={90} fill="#6b4f2a" />
        </g>
        <g transform="translate(800 1080)">
          <rect x={0} y={70} width={180} height={130} fill="#e8c88a" />
          <path d="M-28,80 L90,-40 L208,80 Z" fill="#c9a227" />
          <rect x={70} y={130} width={46} height={70} fill="#6b4f2a" />
        </g>
      </g>
      {/* palm trees */}
      <g stroke="#2f6b2f" strokeWidth={10} strokeLinecap="round" fill="none">
        <path d="M330,1420 L330,1150 M330,1150 Q270,1090 230,1120 M330,1150 Q390,1080 440,1110 M330,1150 Q330,1070 330,1040" />
        <path d="M960,1420 L960,1180 M960,1180 Q900,1120 860,1150 M960,1180 Q1020,1110 1070,1140" />
      </g>
      <ConeTree x={140} y={1420} s={0.9} />
      <ConeTree x={640} y={1440} s={0.7} c="#37b24d" />
    </Plate>
  );
};

// ---------------- story objects ----------------
/** Bowl of crushed purple berries + ink pot + quill. */
export const BerryInk: React.FC = () => (
  <svg viewBox="0 0 600 420" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* wooden bowl */}
    <path d="M60,220 Q60,340 300,340 Q540,340 540,220 Z" fill="#8a6a3b" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    <ellipse cx={300} cy={220} rx={240} ry={46} fill="#6b4f2a" stroke={OUTLINE} strokeWidth={6} />
    {/* crushed berries */}
    <g fill="#7b2d8e" stroke={OUTLINE} strokeWidth={4}>
      <circle cx={180} cy={200} r={34} />
      <circle cx={260} cy={180} r={38} />
      <circle cx={350} cy={200} r={34} />
      <circle cx={430} cy={186} r={30} />
      <circle cx={300} cy={216} r={30} />
    </g>
    <g fill="#a86bb8">
      <circle cx={172} cy={192} r={10} />
      <circle cx={252} cy={172} r={12} />
      <circle cx={344} cy={192} r={10} />
    </g>
    {/* purple ink pool */}
    <ellipse cx={300} cy={300} rx={150} ry={26} fill="#5b1a6e" stroke={OUTLINE} strokeWidth={5} />
    {/* ink pot */}
    <g transform="translate(430 240)">
      <rect x={0} y={0} width={110} height={120} rx={18} fill="#20242b" stroke={OUTLINE} strokeWidth={6} />
      <ellipse cx={55} cy={8} rx={46} ry={14} fill="#5b1a6e" stroke={OUTLINE} strokeWidth={5} />
    </g>
    {/* quill */}
    <g transform="translate(120 60) rotate(24)">
      <path d="M0,180 Q-14,80 40,0 Q90,70 60,180 Q30,200 0,180 Z" fill="#f5f5f0" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
      <path d="M40,10 L30,170" stroke={OUTLINE} strokeWidth={4} />
      <path d="M40,60 L10,80 M40,100 L70,120" stroke={OUTLINE} strokeWidth={4} />
    </g>
  </svg>
);

/** A Vai schoolhouse: thatch roof, bell, open door. */
export const Schoolhouse: React.FC = () => (
  <svg viewBox="0 0 700 520" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round">
      <rect x={80} y={180} width={540} height={280} fill="#e8c88a" />
      <path d="M40,200 L350,-20 L660,200 Z" fill="#c9a227" />
      <rect x={300} y={300} width={100} height={160} fill="#6b4f2a" />
      <rect x={130} y={240} width={90} height={90} fill="#7ec8f0" />
      <rect x={480} y={240} width={90} height={90} fill="#7ec8f0" />
      <path d="M130,240 L220,240 M130,285 L220,285 M175,240 L175,330 M480,240 L570,240 M480,285 L570,285 M525,240 L525,330" fill="none" strokeWidth={5} />
    </g>
    {/* bell on the roof */}
    <g transform="translate(350 40)">
      <path d="M-34,0 L34,0 L26,-44 Q0,-60 -26,-44 Z" fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={0} cy={12} r={10} fill="#20242b" />
    </g>
    {/* flag */}
    <g transform="translate(560 -10)">
      <rect x={0} y={0} width={8} height={90} fill="#666" />
      <path d="M8,6 L110,20 L8,44 Z" fill="#2f9e44" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
    </g>
  </svg>
);

/** Simplified West Africa: coastline, gold Liberia + star. */
export const MapLiberia: React.FC = () => (
  <svg viewBox="0 0 700 560" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* ocean */}
    <rect x={0} y={0} width={700} height={560} rx={28} fill="#5aa8e8" stroke={OUTLINE} strokeWidth={7} />
    {/* West Africa landmass */}
    <path
      d="M120,40 L560,30 Q660,60 640,180 Q620,300 560,360 Q500,430 420,470 Q300,530 180,500 Q80,470 60,360 Q40,240 70,140 Q90,60 120,40 Z"
      fill="#e8c88a" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round"
    />
    {/* Liberia (south-west coast) in gold */}
    <path
      d="M120,330 Q200,300 250,340 Q280,390 230,440 Q160,470 120,420 Q100,370 120,330 Z"
      fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round"
    />
    {/* star on Liberia */}
    <path d="M185,355 L190,370 L206,371 L193,381 L197,397 L185,388 L173,397 L177,381 L164,371 L180,370 Z"
      fill="#e63b2e" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
    {/* neighbouring country lines */}
    <path d="M250,340 Q320,300 380,320 M230,440 Q300,460 360,430" fill="none" stroke={OUTLINE} strokeWidth={4} opacity={0.5} />
    {/* waves */}
    <g stroke="#fff" strokeWidth={5} fill="none" opacity={0.7} strokeLinecap="round">
      <path d="M40,120 q20,-14 40,0 q20,14 40,0" />
      <path d="M560,470 q20,-14 40,0 q20,14 40,0" />
      <path d="M80,500 q20,-14 40,0 q20,14 40,0" />
    </g>
  </svg>
);

/** Smartphone showing Vai glyphs + a chat bubble in glyphs. */
export const PhoneUnicode: React.FC = () => (
  <svg viewBox="0 0 420 700" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={20} y={10} width={380} height={680} rx={48} fill="#20242b" stroke={OUTLINE} strokeWidth={7} />
    <rect x={48} y={60} width={324} height={560} rx={20} fill="#fdf3d8" />
    {/* chat bubbles with glyph marks */}
    <g>
      <rect x={70} y={90} width={200} height={90} rx={24} fill="#bfe6fb" stroke={OUTLINE} strokeWidth={5} />
      <g transform="translate(96 108) scale(0.55)"><VaiGlyph g={0} size={100} /></g>
      <g transform="translate(160 108) scale(0.55)"><VaiGlyph g={2} size={100} /></g>
      <g transform="translate(224 108) scale(0.55)"><VaiGlyph g={5} size={100} /></g>
    </g>
    <g>
      <rect x={150} y={210} width={200} height={90} rx={24} fill="#c8f0c0" stroke={OUTLINE} strokeWidth={5} />
      <g transform="translate(176 228) scale(0.55)"><VaiGlyph g={1} size={100} /></g>
      <g transform="translate(240 228) scale(0.55)"><VaiGlyph g={4} size={100} /></g>
      <g transform="translate(304 228) scale(0.55)"><VaiGlyph g={7} size={100} /></g>
    </g>
    {/* glyph keyboard */}
    <g>
      {[
        [0, 330], [1, 330], [2, 330], [3, 330],
        [4, 430], [5, 430], [6, 430], [7, 430],
      ].map(([g, y], i) => (
        <g key={i} transform={`translate(${72 + (i % 4) * 76} ${y})`}>
          <rect x={0} y={0} width={62} height={62} rx={12} fill="#fff" stroke={OUTLINE} strokeWidth={4} />
          <g transform="translate(8 8) scale(0.46)"><VaiGlyph g={g} size={100} /></g>
        </g>
      ))}
    </g>
    <circle cx={210} cy={660} r={16} fill="#444" stroke={OUTLINE} strokeWidth={4} />
  </svg>
);

/** Flame (idea catches fire). */
export const Flame: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg viewBox="0 0 200 260" width={200 * s} height={260 * s} style={{ overflow: "visible" }}>
    <path d="M100,10 Q150,90 160,150 Q170,220 100,250 Q30,220 40,150 Q50,90 100,10 Z"
      fill="#f58220" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    <path d="M100,90 Q130,140 130,180 Q130,220 100,230 Q70,220 70,180 Q70,140 100,90 Z"
      fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
    <path d="M100,150 Q118,175 118,195 Q118,215 100,220 Q82,215 82,195 Q82,175 100,150 Z" fill="#e63b2e" />
  </svg>
);

/** A university: pediment + columns + steps. */
export const University: React.FC = () => (
  <svg viewBox="0 0 700 520" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round">
      <path d="M60,180 L350,40 L640,180 Z" fill="#f2c14e" />
      <circle cx={350} cy={130} r={34} fill="#ffd93b" />
      <rect x={80} y={180} width={540} height={40} fill="#e8c88a" />
      {[130, 260, 390, 520].map((x) => (
        <g key={x}>
          <rect x={x} y={220} width={52} height={200} fill="#f5f5f0" />
          <rect x={x - 10} y={205} width={72} height={20} rx={6} fill="#e8c88a" />
          <rect x={x - 10} y={415} width={72} height={20} rx={6} fill="#e8c88a" />
        </g>
      ))}
      <rect x={60} y={435} width={580} height={26} fill="#c9b896" />
      <rect x={40} y={461} width={620} height={26} fill="#b3a07e" />
    </g>
  </svg>
);

/** A diary: book with a glyph on the cover. */
export const Diary: React.FC = () => (
  <svg viewBox="0 0 420 520" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={30} y={20} width={360} height={480} rx={24} fill="#8a2f2f" stroke={OUTLINE} strokeWidth={7} />
    <rect x={58} y={48} width={304} height={424} rx={12} fill="none" stroke="#ffd93b" strokeWidth={4} />
    <g transform="translate(150 150) scale(1.2)">
      <rect x={0} y={0} width={100} height={100} rx={16} fill="#fdf3d8" stroke={OUTLINE} strokeWidth={5} />
      <g transform="translate(12 12) scale(0.76)"><VaiGlyph g={3} size={100} /></g>
    </g>
    <g stroke="#ffd93b" strokeWidth={5} strokeLinecap="round">
      <path d="M110,320 L310,320 M110,360 L310,360 M110,400 L250,400" />
    </g>
  </svg>
);

/** A letter sheet he cannot read: glyphs + a big question mark. */
export const UnreadLetter: React.FC = () => (
  <svg viewBox="0 0 420 520" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={30} y={20} width={360} height={480} rx={12} fill="#ffffff" stroke={OUTLINE} strokeWidth={7} />
    <g stroke="#9a9a9a" strokeWidth={5} strokeLinecap="round">
      <path d="M80,90 L340,90 M80,130 L340,130 M80,170 L300,170" />
    </g>
    <g transform="translate(150 230) scale(1.6)">
      <text x={50} y={80} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={110} fill="#e63b2e">?</text>
    </g>
    <g stroke="#9a9a9a" strokeWidth={5} strokeLinecap="round">
      <path d="M80,400 L340,400 M80,440 L260,440" />
    </g>
  </svg>
);
