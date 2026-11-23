// Props for the Mayday Short — all original flat-vector designs.
import React from "react";
import { useCurrentFrame } from "remotion";
import { OUTLINE } from "./characters";

/** 1920s biplane, side view facing right. Propeller spins. */
export const Biplane: React.FC<{ spin?: number }> = ({ spin = 30 }) => {
  const f = useCurrentFrame();
  return (
    <svg viewBox="0 0 600 300" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* tail */}
      <path d="M62,122 L18,66 L76,104 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
      <rect x={8} y={148} width={74} height={18} rx={9} fill="#f2c14e" stroke={OUTLINE} strokeWidth={6} />
      {/* lower wing */}
      <rect x={150} y={198} width={260} height={24} rx={12} fill="#f2c14e" stroke={OUTLINE} strokeWidth={6} />
      {/* fuselage */}
      <path d="M40,150 Q60,108 180,104 L420,104 Q520,108 540,144 Q520,182 420,186 L180,186 Q60,182 40,150 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
      {/* cockpit opening */}
      <ellipse cx={300} cy={106} rx={42} ry={13} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={5} />
      {/* roundel */}
      <circle cx={300} cy={146} r={19} fill="#fff" stroke={OUTLINE} strokeWidth={4} />
      <circle cx={300} cy={146} r={9} fill="#4a6fa5" />
      {/* struts */}
      <path d="M190,128 L190,198 M370,128 L370,198" stroke={OUTLINE} strokeWidth={7} strokeLinecap="round" />
      {/* upper wing */}
      <rect x={140} y={38} width={280} height={26} rx={13} fill="#f2c14e" stroke={OUTLINE} strokeWidth={6} />
      {/* wheels */}
      <path d="M240,186 L236,216 M360,186 L364,216" stroke={OUTLINE} strokeWidth={7} strokeLinecap="round" />
      <circle cx={236} cy={232} r={22} fill="#333" stroke={OUTLINE} strokeWidth={5} />
      <circle cx={364} cy={232} r={22} fill="#333" stroke={OUTLINE} strokeWidth={5} />
      <circle cx={236} cy={232} r={8} fill="#888" />
      <circle cx={364} cy={232} r={8} fill="#888" />
      {/* propeller */}
      <g transform={`rotate(${f * spin} 552 145)`}>
        <rect x={543} y={72} width={18} height={146} rx={9} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={5} />
      </g>
      <circle cx={552} cy={145} r={13} fill="#5a4020" stroke={OUTLINE} strokeWidth={5} />
    </svg>
  );
};

/** RAF-style flying boat over the sea, engine smoking. */
export const FlyingBoat: React.FC = () => {
  const f = useCurrentFrame();
  const puffs = [0, 1, 2].map((i) => {
    const t = ((f / 30 + i * 0.7) % 2.1) / 2.1; // 0..1 cycle
    return { x: 380 + t * 60, y: 30 - t * 70, r: 12 + t * 26, o: 0.75 * (1 - t) };
  });
  return (
    <svg viewBox="0 0 700 340" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* smoke from the engine */}
      {puffs.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#9a9a9a" opacity={p.o} />
      ))}
      {/* tail fin */}
      <path d="M90,150 L40,80 L120,130 Z" fill="#4a6fa5" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
      <rect x={30} y={150} width={90} height={18} rx={9} fill="#f2c14e" stroke={OUTLINE} strokeWidth={6} />
      {/* wing struts + high wing */}
      <path d="M250,150 L250,90 M450,150 L450,90" stroke={OUTLINE} strokeWidth={7} strokeLinecap="round" />
      <rect x={180} y={62} width={340} height={26} rx={13} fill="#f2c14e" stroke={OUTLINE} strokeWidth={6} />
      {/* engine nacelle + prop */}
      <rect x={300} y={36} width={110} height={42} rx={12} fill="#e8634a" stroke={OUTLINE} strokeWidth={6} />
      <g transform={`rotate(${f * 26} 300 57)`}>
        <rect x={292} y={4} width={16} height={106} rx={8} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={5} />
      </g>
      <circle cx={300} cy={57} r={11} fill="#5a4020" stroke={OUTLINE} strokeWidth={5} />
      {/* hull */}
      <path d="M60,190 Q70,268 200,278 L480,278 Q610,268 624,190 L600,158 L84,158 Z" fill="#4a6fa5" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
      <path d="M84,190 L600,190" stroke={OUTLINE} strokeWidth={5} />
      {/* windows */}
      <g fill="#bfe6fb" stroke={OUTLINE} strokeWidth={4}>
        <circle cx={180} cy={222} r={14} />
        <circle cx={260} cy={222} r={14} />
        <circle cx={340} cy={222} r={14} />
        <circle cx={420} cy={222} r={14} />
      </g>
      {/* cockpit windshield */}
      <path d="M520,158 Q560,120 600,158 Z" fill="#bfe6fb" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      {/* wing floats */}
      <path d="M200,278 L170,310 L230,310 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      <path d="M480,278 L450,310 L510,310 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
};

/** Big 1920s radio set with dials and speaker. */
export const RadioSet: React.FC = () => {
  const f = useCurrentFrame();
  const needle = Math.sin(f * 0.35) * 18;
  const wave = 4 + Math.sin(f * 0.5) * 3;
  return (
    <svg viewBox="0 0 400 320" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* antenna */}
      <path d="M200,62 L200,12" stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <circle cx={200} cy={10} r={8} fill="#e8634a" stroke={OUTLINE} strokeWidth={4} />
      <g stroke="#e8634a" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.9}>
        <path d={`M${200 - wave * 2},${26 - wave} Q200,${18 - wave * 2} ${200 + wave * 2},${26 - wave}`} />
      </g>
      {/* wooden box */}
      <rect x={18} y={62} width={364} height={220} rx={18} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={7} />
      <rect x={38} y={82} width={324} height={180} rx={12} fill="#3a3a4d" stroke={OUTLINE} strokeWidth={5} />
      {/* speaker */}
      <circle cx={118} cy={172} r={48} fill="#22222e" stroke={OUTLINE} strokeWidth={5} />
      <circle cx={118} cy={172} r={32} fill="none" stroke="#555" strokeWidth={4} />
      <circle cx={118} cy={172} r={16} fill="#555" />
      {/* dials */}
      <circle cx={262} cy={132} r={26} fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} />
      <path d={`M262,132 L${262 + Math.sin((needle * Math.PI) / 180) * 20},${132 - Math.cos((needle * Math.PI) / 180) * 20}`} stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
      <circle cx={322} cy={132} r={26} fill="#7ee787" stroke={OUTLINE} strokeWidth={5} />
      <path d={`M322,132 L${322 + Math.sin(((needle + 40) * Math.PI) / 180) * 20},${132 - Math.cos(((needle + 40) * Math.PI) / 180) * 20}`} stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
      {/* frequency window */}
      <rect x={228} y={178} width={118} height={44} rx={8} fill="#16223e" stroke={OUTLINE} strokeWidth={4} />
      <path d="M236,200 Q250,188 264,200 Q278,212 292,200 Q306,188 320,200 Q334,212 340,200" fill="none" stroke="#7ee787" strokeWidth={4} strokeLinecap="round" />
      {/* knobs */}
      <circle cx={70} cy={238} r={11} fill="#c9b896" stroke={OUTLINE} strokeWidth={4} />
      <circle cx={110} cy={238} r={11} fill="#c9b896" stroke={OUTLINE} strokeWidth={4} />
      <circle cx={150} cy={238} r={11} fill="#c9b896" stroke={OUTLINE} strokeWidth={4} />
    </svg>
  );
};

/** Telegraph key on a wooden base. */
export const TelegraphKey: React.FC<{ tapping?: boolean }> = ({ tapping = true }) => {
  const f = useCurrentFrame();
  const tap = tapping ? (Math.sin(f * 0.9) > 0.2 ? -6 : 0) : 0;
  return (
    <svg viewBox="0 0 300 190" width="100%" height="100%" style={{ overflow: "visible" }}>
      <rect x={10} y={130} width={280} height={44} rx={12} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
      <rect x={40} y={100} width={36} height={34} rx={8} fill="#5a4020" stroke={OUTLINE} strokeWidth={5} />
      <g transform={`rotate(${tap * 0.4} 58 108)`}>
        <rect x={52} y={78} width={190} height={18} rx={9} fill="#c9b896" stroke={OUTLINE} strokeWidth={5} />
        <circle cx={248} cy={72} r={20} fill="#2b2b2b" stroke={OUTLINE} strokeWidth={5} />
      </g>
      <path d="M290,150 Q330,150 330,110" fill="none" stroke={OUTLINE} strokeWidth={5} />
      <circle cx={70} cy={110} r={8} fill="#ffd93b" stroke={OUTLINE} strokeWidth={4} />
    </svg>
  );
};

/** Fire alarm box with a swinging bell. */
export const FireAlarm: React.FC = () => {
  const f = useCurrentFrame();
  const swing = Math.sin(f * 0.55) * 12;
  const ring = (Math.sin(f * 0.55) > 0.7 ? 1 : 0.35);
  return (
    <svg viewBox="0 0 220 300" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* sound arcs */}
      <g fill="none" stroke="#e8634a" strokeWidth={7} strokeLinecap="round" opacity={ring}>
        <path d="M20,60 Q-10,110 20,160" />
        <path d="M200,60 Q230,110 200,160" />
      </g>
      <g transform={`rotate(${swing} 110 60)`}>
        <path d="M60,70 Q60,10 110,10 Q160,10 160,70 Z" fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
        <circle cx={110} cy={78} r={10} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={4} />
      </g>
      <rect x={34} y={76} width={152} height={190} rx={16} fill="#d43a2e" stroke={OUTLINE} strokeWidth={7} />
      <rect x={58} y={104} width={104} height={64} rx={10} fill="#fff" stroke={OUTLINE} strokeWidth={5} />
      <rect x={84} y={190} width={52} height={44} rx={8} fill="#8a1f18" stroke={OUTLINE} strokeWidth={5} />
    </svg>
  );
};

/** Stylised globe with rotating continents. */
export const Globe: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg viewBox="0 0 420 420" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="globeClip">
          <circle cx={210} cy={210} r={168} />
        </clipPath>
      </defs>
      {/* orbit ring */}
      <ellipse cx={210} cy={210} rx={205} ry={70} fill="none" stroke="#ffd93b" strokeWidth={6} transform="rotate(-18 210 210)" />
      <circle cx={210} cy={210} r={168} fill="#5aa8e8" stroke={OUTLINE} strokeWidth={8} />
      <g clipPath="url(#globeClip)">
        <g transform={`rotate(${f * 0.25} 210 210)`}>
          <path d="M90,120 Q140,80 190,110 Q220,150 180,200 Q120,210 90,170 Z" fill="#6fbf5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
          <path d="M250,240 Q310,210 350,250 Q360,310 300,330 Q250,320 250,280 Z" fill="#6fbf5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
          <path d="M240,90 Q290,70 320,100 Q310,150 260,140 Q235,120 240,90 Z" fill="#6fbf5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
          <path d="M120,280 Q170,260 200,290 Q190,340 140,335 Q115,315 120,280 Z" fill="#6fbf5a" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        </g>
      </g>
      {/* flag pins */}
      <g stroke={OUTLINE} strokeWidth={4}>
        <path d="M150,150 L150,110" />
        <path d="M150,110 L186,118 L150,128 Z" fill="#e8634a" />
        <path d="M290,260 L290,220" />
        <path d="M290,220 L326,228 L290,238 Z" fill="#ffd93b" />
        <path d="M270,130 L270,90" />
        <path d="M270,90 L306,98 L270,108 Z" fill="#7ee787" />
      </g>
    </svg>
  );
};

/** Research vessel (RV Southern Surveyor style), side view facing right. */
export const Ship: React.FC = () => {
  const f = useCurrentFrame();
  const radar = f * 4;
  const bobY = Math.sin(f * 0.1) * 4;
  return (
    <svg viewBox="0 0 700 340" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bobY})`}>
        {/* mast + radar */}
        <rect x={420} y={40} width={14} height={130} fill="#8a8a8a" stroke={OUTLINE} strokeWidth={5} />
        <g transform={`rotate(${radar} 427 40)`}>
          <rect x={397} y={34} width={60} height={12} rx={6} fill="#e8634a" stroke={OUTLINE} strokeWidth={4} />
        </g>
        <circle cx={427} cy={40} r={9} fill="#333" stroke={OUTLINE} strokeWidth={4} />
        {/* funnel */}
        <rect x={330} y={86} width={56} height={84} rx={10} fill="#e8634a" stroke={OUTLINE} strokeWidth={6} />
        <rect x={330} y={86} width={56} height={22} rx={10} fill="#c0392b" />
        {/* superstructure */}
        <rect x={300} y={150} width={180} height={70} rx={12} fill="#f5f5f0" stroke={OUTLINE} strokeWidth={6} />
        <g fill="#7ec8f0" stroke={OUTLINE} strokeWidth={4}>
          <rect x={318} y={166} width={30} height={26} rx={6} />
          <rect x={360} y={166} width={30} height={26} rx={6} />
          <rect x={402} y={166} width={30} height={26} rx={6} />
        </g>
        {/* bridge */}
        <rect x={470} y={140} width={90} height={80} rx={12} fill="#f5f5f0" stroke={OUTLINE} strokeWidth={6} />
        <rect x={484} y={152} width={62} height={28} rx={8} fill="#2e5a8a" stroke={OUTLINE} strokeWidth={4} />
        {/* crane */}
        <path d="M180,220 L180,120 L260,120" fill="none" stroke="#f2c14e" strokeWidth={14} strokeLinecap="round" />
        <path d="M180,220 L180,120 L260,120" fill="none" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" opacity={0.4} />
        <path d="M260,120 L260,150" stroke={OUTLINE} strokeWidth={5} />
        {/* hull */}
        <path d="M40,220 L660,220 Q640,300 520,306 L180,306 Q60,300 40,220 Z" fill="#ffffff" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
        <path d="M52,250 L648,250 Q636,276 520,280 L190,280 Q72,276 52,250 Z" fill="#e8634a" />
        <path d="M52,250 L648,250" stroke={OUTLINE} strokeWidth={4} />
        {/* portholes */}
        <g fill="#7ec8f0" stroke={OUTLINE} strokeWidth={4}>
          <circle cx={150} cy={238} r={11} />
          <circle cx={230} cy={238} r={11} />
          <circle cx={560} cy={238} r={11} />
        </g>
        {/* bow wave */}
        <path d="M620,306 Q660,290 690,306 Q660,318 620,306 Z" fill="#fff" opacity={0.85} />
      </g>
    </svg>
  );
};

/** Floating pumice raft — grey volcanic stones bobbing on the sea. */
export const PumiceRaft: React.FC = () => {
  const f = useCurrentFrame();
  const stones = [
    { x: 60, y: 70, r: 42, s: 0 }, { x: 150, y: 50, r: 34, s: 1 }, { x: 230, y: 78, r: 48, s: 2 },
    { x: 330, y: 56, r: 38, s: 3 }, { x: 420, y: 80, r: 44, s: 4 }, { x: 510, y: 60, r: 32, s: 5 },
    { x: 110, y: 110, r: 30, s: 2 }, { x: 290, y: 116, r: 36, s: 0 }, { x: 470, y: 112, r: 30, s: 1 },
  ];
  return (
    <svg viewBox="0 0 600 200" width="100%" height="100%" style={{ overflow: "visible" }}>
      <ellipse cx={300} cy={150} rx={280} ry={26} fill="#fff" opacity={0.35} />
      {stones.map((st, i) => (
        <g key={i} transform={`translate(0 ${Math.sin(f * 0.12 + st.s * 1.7) * 5})`}>
          <circle cx={st.x} cy={st.y} r={st.r} fill="#9a9a9a" stroke={OUTLINE} strokeWidth={5} />
          <circle cx={st.x - st.r * 0.3} cy={st.y - st.r * 0.3} r={st.r * 0.35} fill="#b5b5b5" />
          <circle cx={st.x + st.r * 0.3} cy={st.y + st.r * 0.25} r={st.r * 0.18} fill="#7a7a7a" />
        </g>
      ))}
      {/* steam wisps */}
      {[0, 1, 2].map((i) => {
        const t = ((f / 30 + i * 0.8) % 2.4) / 2.4;
        return (
          <circle key={i} cx={140 + i * 160} cy={30 - t * 40} r={8 + t * 16} fill="#d8d8d8" opacity={0.5 * (1 - t)} />
        );
      })}
    </svg>
  );
};

/** Lightbulb "idea" pop. */
export const Lightbulb: React.FC = () => (
  <svg viewBox="0 0 160 200" width="100%" height="100%" style={{ overflow: "visible" }}>
    <g stroke="#ffd93b" strokeWidth={8} strokeLinecap="round">
      <path d="M80,6 L80,26 M20,30 L34,44 M140,30 L126,44 M6,84 L26,84 M154,84 L134,84" />
    </g>
    <circle cx={80} cy={96} r={58} fill="#ffe066" stroke={OUTLINE} strokeWidth={6} />
    <path d="M62,92 Q80,66 98,92 Q98,112 80,112 Q62,112 62,92" fill="none" stroke="#b8860b" strokeWidth={5} strokeLinecap="round" />
    <rect x={62} y={150} width={36} height={34} rx={8} fill="#8a8a8a" stroke={OUTLINE} strokeWidth={5} />
  </svg>
);

/** Email envelope with an @ mark. Variant "angry" adds a red ! seal. */
export const Envelope: React.FC<{ angry?: boolean; stamp?: boolean }> = ({ angry = false, stamp = true }) => (
  <svg viewBox="0 0 300 210" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={10} y={20} width={280} height={170} rx={14} fill="#fdf6e3" stroke={OUTLINE} strokeWidth={7} />
    <path d="M10,34 L150,118 L290,34" fill="none" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    <path d="M10,176 L120,92 M290,176 L180,92" fill="none" stroke="#c9b896" strokeWidth={5} />
    {stamp && (
      <g>
        <rect x={226} y={36} width={46} height={52} rx={6} fill={angry ? "#e63b2e" : "#7ec8f0"} stroke={OUTLINE} strokeWidth={4} />
        <text x={249} y={72} textAnchor="middle" fontSize={34} fontWeight={700} fill="#fff" fontFamily="Arial, sans-serif">
          {angry ? "!" : "@"}
        </text>
      </g>
    )}
    <text x={118} y={166} textAnchor="middle" fontSize={44} fontWeight={700} fill="#4a6fa5" fontFamily="Arial, sans-serif">
      @
    </text>
  </svg>
);

/** 1970s DEC terminal: chunky CRT on a desk, green screen with email
 * lines, keyboard below, and a big red SEND button that lights up. */
export const DecTerminal: React.FC<{ sendLit?: boolean }> = ({ sendLit = false }) => {
  const f = useCurrentFrame();
  const cursor = Math.sin(f * 0.4) > 0 ? 1 : 0.15;
  return (
    <svg viewBox="0 0 560 480" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* desk */}
      <rect x={10} y={380} width={540} height={26} rx={10} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
      <rect x={40} y={406} width={24} height={60} fill="#6b4f2a" />
      <rect x={496} y={406} width={24} height={60} fill="#6b4f2a" />
      {/* CRT body */}
      <rect x={70} y={20} width={420} height={330} rx={22} fill="#d8d8d8" stroke={OUTLINE} strokeWidth={7} />
      <rect x={96} y={44} width={368} height={240} rx={12} fill="#0e2a1a" stroke={OUTLINE} strokeWidth={5} />
      {/* screen text: the email */}
      <g fontFamily="monospace" fontWeight={700} fill="#7ee787">
        <text x={118} y={84} fontSize={26}>TO: 400 USERS</text>
        <text x={118} y={122} fontSize={26}>SUBJECT: NEW DEC</text>
        <text x={118} y={160} fontSize={26}>COMPUTERS!</text>
        <text x={118} y={198} fontSize={26}>COME SEE THE</text>
        <text x={118} y={236} fontSize={26}>DEMO TODAY...</text>
      </g>
      <rect x={428} y={212} width={16} height={30} fill="#7ee787" opacity={cursor} />
      {/* CRT knobs */}
      <circle cx={130} cy={312} r={13} fill="#ffd93b" stroke={OUTLINE} strokeWidth={4} />
      <circle cx={180} cy={312} r={13} fill="#e8634a" stroke={OUTLINE} strokeWidth={4} />
      <rect x={300} y={300} width={140} height={24} rx={12} fill="#9a9a9a" stroke={OUTLINE} strokeWidth={4} />
      {/* keyboard */}
      <rect x={110} y={336} width={340} height={44} rx={10} fill="#3a3a4d" stroke={OUTLINE} strokeWidth={5} transform="rotate(-2 280 358)" />
      <g fill="#c9c9c9">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={i} x={128 + i * 38} y={346} width={28} height={12} rx={4} />
        ))}
      </g>
      {/* SEND button */}
      <g transform="translate(480 336)">
        <circle r={34} fill={sendLit ? "#e63b2e" : "#b03a2e"} stroke={OUTLINE} strokeWidth={6} />
        {sendLit && <circle r={46} fill="none" stroke="#e63b2e" strokeWidth={5} opacity={0.6} />}
        <text y={10} textAnchor="middle" fontSize={22} fontWeight={700} fill="#fff" fontFamily="Arial, sans-serif">SEND</text>
      </g>
    </svg>
  );
};

/** Stack of banknotes with a $ band + coins. */
export const CashStack: React.FC = () => {
  const f = useCurrentFrame();
  const lift = Math.sin(f * 0.15) * 6;
  return (
    <svg viewBox="0 0 420 320" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* coins */}
      <g transform={`translate(0 ${-lift})`}>
        <ellipse cx={90} cy={260} rx={46} ry={16} fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} />
        <ellipse cx={90} cy={248} rx={46} ry={16} fill="#ffe066" stroke={OUTLINE} strokeWidth={5} />
        <text x={90} y={256} textAnchor="middle" fontSize={26} fontWeight={700} fill="#8a6a00" fontFamily="Arial, sans-serif">$</text>
        <ellipse cx={330} cy={270} rx={40} ry={14} fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} />
        <ellipse cx={330} cy={259} rx={40} ry={14} fill="#ffe066" stroke={OUTLINE} strokeWidth={5} />
        <text x={330} y={266} textAnchor="middle" fontSize={22} fontWeight={700} fill="#8a6a00" fontFamily="Arial, sans-serif">$</text>
      </g>
      {/* note stacks */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${60 + i * 12} ${190 - i * 52}) rotate(${-3 + i * 3} 150 40)`}>
          <rect x={0} y={0} width={300} height={76} rx={10} fill="#7ec850" stroke={OUTLINE} strokeWidth={6} />
          <circle cx={150} cy={38} r={26} fill="#e8f7d8" stroke={OUTLINE} strokeWidth={4} />
          <text x={150} y={48} textAnchor="middle" fontSize={34} fontWeight={700} fill="#2f7a33" fontFamily="Arial, sans-serif">$</text>
          <rect x={128} y={0} width={44} height={76} fill="#f5f5f0" stroke={OUTLINE} strokeWidth={4} />
          <text x={150} y={48} textAnchor="middle" fontSize={30} fontWeight={700} fill="#e63b2e" fontFamily="Arial, sans-serif">$</text>
        </g>
      ))}
    </svg>
  );
};

/** Gold record medal with ribbon (Guinness-style award, generic star). */
export const Medal: React.FC = () => {
  const f = useCurrentFrame();
  const sway = Math.sin(f * 0.12) * 4;
  return (
    <svg viewBox="0 0 300 360" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`rotate(${sway} 150 20)`}>
        <path d="M110,10 L150,90 L190,10 L230,10 L170,120 L130,120 L70,10 Z" fill="#e63b2e" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
        <path d="M150,90 L170,120 L130,120 Z" fill="#c0392b" />
        <circle cx={150} cy={220} r={110} fill="#ffd93b" stroke={OUTLINE} strokeWidth={8} />
        <circle cx={150} cy={220} r={84} fill="none" stroke="#e8a800" strokeWidth={5} strokeDasharray="10 8" />
        <path d="M150,150 L168,196 L218,198 L178,228 L192,278 L150,250 L108,278 L122,228 L82,198 L132,196 Z" fill="#fff" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/** Modern smartphone showing an inbox filling with junk mail. */
export const InboxPhone: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <svg viewBox="0 0 420 720" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={10} y={10} width={400} height={700} rx={48} fill="#20242b" stroke={OUTLINE} strokeWidth={7} />
    <rect x={34} y={34} width={352} height={652} rx={32} fill="#ffffff" />
    {/* header */}
    <rect x={34} y={34} width={352} height={86} rx={32} fill="#1d2b4a" />
    <rect x={34} y={86} width={352} height={34} fill="#1d2b4a" />
    <text x={210} y={92} textAnchor="middle" fontSize={36} fontWeight={700} fill="#fff" fontFamily="Arial, sans-serif">Inbox (99+)</text>
    {/* rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <g key={i} transform={`translate(0 ${140 + i * 104})`}>
        <rect x={58} y={0} width={304} height={84} rx={14} fill={i % 2 === 0 ? "#f2f6fb" : "#fff3e8"} stroke="#d8dee8" strokeWidth={3} />
        <rect x={78} y={22} width={40} height={40} rx={8} fill={i % 2 === 0 ? "#7ec8f0" : "#e8634a"} />
        <text x={98} y={52} textAnchor="middle" fontSize={26} fontWeight={700} fill="#fff" fontFamily="Arial, sans-serif">@</text>
        <rect x={134} y={20} width={150} height={14} rx={7} fill="#8a97ad" />
        <rect x={134} y={46} width={110} height={12} rx={6} fill="#b8c2d0" />
        <circle cx={332} cy={42} r={16} fill="#e63b2e" />
        <text x={332} y={50} textAnchor="middle" fontSize={22} fontWeight={700} fill="#fff" fontFamily="Arial, sans-serif">!</text>
      </g>
    ))}
  </svg>
);
