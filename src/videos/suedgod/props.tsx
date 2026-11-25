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

/** Saturn V-style rocket, nose up, animated flame. */
export const SaturnRocket: React.FC<{ flame?: boolean }> = ({ flame = true }) => {
  const f = useCurrentFrame();
  const flick = 1 + Math.sin(f * 0.9) * 0.12 + Math.sin(f * 2.3) * 0.06;
  return (
    <svg viewBox="0 0 300 620" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* flame */}
      {flame && (
        <g transform={`translate(150 560) scale(${flick} ${flick})`}>
          <path d="M0,0 Q-34,44 -18,96 Q0,128 18,96 Q34,44 0,0 Z" fill="#ff7b54" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
          <path d="M0,10 Q-16,40 -8,72 Q0,92 8,72 Q16,40 0,10 Z" fill="#ffd93b" />
        </g>
      )}
      {/* fins */}
      <path d="M52,470 L18,560 L52,560 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
      <path d="M248,470 L282,560 L248,560 Z" fill="#e8634a" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
      {/* stage 1 (engines) */}
      <rect x={52} y={500} width={196} height={60} rx={10} fill="#333" stroke={OUTLINE} strokeWidth={6} />
      {[84, 130, 170, 216].map((x) => (
        <path key={x} d={`M${x - 14},560 L${x + 14},560 L${x + 8},588 L${x - 8},588 Z`} fill="#666" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      ))}
      {/* body */}
      <path d="M52,500 L52,160 Q52,60 150,20 Q248,60 248,160 L248,500 Z" fill="#f5f5f0" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
      {/* black band */}
      <path d="M52,220 L248,220 L248,262 L52,262 Z" fill="#20242b" />
      {/* red stripe */}
      <rect x={52} y={330} width={196} height={22} fill="#e8634a" />
      {/* USA text */}
      <text x={150} y={420} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={56} fill="#c0392b" letterSpacing={6}>USA</text>
      {/* windows */}
      <circle cx={150} cy={110} r={20} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={5} />
      <circle cx={150} cy={300} r={13} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={4} />
      {/* flag */}
      <g transform="translate(178 290)">
        <rect x={0} y={0} width={44} height={28} rx={4} fill="#fff" stroke={OUTLINE} strokeWidth={3} />
        <rect x={0} y={0} width={18} height={14} fill="#2b4a9e" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={18} y={i * 9} width={26} height={4} fill="#e63b2e" />
        ))}
      </g>
    </svg>
  );
};

/** Signed postal envelope with airmail border + postmark + signature squiggle. */
export const Envelope: React.FC<{ stamp?: string }> = ({ stamp = "JUL 16 1969" }) => (
  <svg viewBox="0 0 400 260" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* airmail border */}
    <rect x={4} y={4} width={392} height={252} rx={14} fill="#fff" stroke={OUTLINE} strokeWidth={7} />
    <g>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={`t${i}`} x={14 + i * 32} y={8} width={16} height={12} fill={i % 2 === 0 ? "#e63b2e" : "#2b4a9e"} transform={`rotate(45 ${22 + i * 32} 14)`} />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={`b${i}`} x={14 + i * 32} y={236} width={16} height={12} fill={i % 2 === 0 ? "#2b4a9e" : "#e63b2e"} transform={`rotate(45 ${22 + i * 32} 242)`} />
      ))}
    </g>
    {/* flap lines */}
    <path d="M20,20 L200,130 L380,20" fill="none" stroke="#c9c9c9" strokeWidth={4} />
    <path d="M20,240 L200,130 L380,240" fill="none" stroke="#c9c9c9" strokeWidth={4} />
    {/* signature squiggles (three autographs) */}
    <g fill="none" stroke="#2b4a9e" strokeWidth={4} strokeLinecap="round">
      <path d="M70,150 Q90,120 110,148 Q130,170 150,140 Q160,128 175,145" />
      <path d="M80,190 Q100,165 125,190 Q145,208 170,182" />
      <path d="M210,170 Q230,145 250,168 Q268,186 288,160" />
    </g>
    {/* postmark */}
    <g transform="translate(318 66)" opacity={0.9}>
      <circle cx={0} cy={0} r={40} fill="none" stroke="#333" strokeWidth={3.5} />
      <circle cx={0} cy={0} r={30} fill="none" stroke="#333" strokeWidth={2.5} />
      <text x={0} y={-2} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={11} fill="#333">KENNEDY</text>
      <text x={0} y={14} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={11} fill="#333">SPACE CTR</text>
    </g>
    <text x={318} y={150} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={20} fill="#333">{stamp}</text>
    {/* stamp (top right corner) */}
    <g transform="translate(330 180)">
      <rect x={0} y={0} width={44} height={54} rx={4} fill="#e8634a" stroke={OUTLINE} strokeWidth={3} />
      <circle cx={22} cy={27} r={13} fill="#ffd93b" stroke={OUTLINE} strokeWidth={2} />
    </g>
  </svg>
);

/** A fanned stack of signed envelopes. */
export const EnvelopeStack: React.FC = () => (
  <svg viewBox="0 0 420 300" width="100%" height="100%" style={{ overflow: "visible" }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i} transform={`rotate(${-14 + i * 7} 210 260) translate(0 ${-i * 8})`}>
        <rect x={60} y={110} width={300} height={170} rx={12} fill={i % 2 === 0 ? "#ffffff" : "#f0ead8"} stroke={OUTLINE} strokeWidth={6} />
        <path d="M60,122 L210,200 L360,122" fill="none" stroke="#c9c9c9" strokeWidth={4} />
        <path d={`M100,${200 + i * 2} Q130,${180 + i * 2} 160,${198 + i * 2} Q190,${214 + i * 2} 220,${192 + i * 2}`} fill="none" stroke="#2b4a9e" strokeWidth={4} strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

/** Round postmark stamp with date. */
export const PostmarkStamp: React.FC<{ date?: string; place?: string }> = ({
  date = "JUL 16 1969",
  place = "KENNEDY SPACE CTR",
}) => (
  <svg viewBox="0 0 320 320" width="100%" height="100%" style={{ overflow: "visible" }}>
    <circle cx={160} cy={160} r={146} fill="#fff" stroke={OUTLINE} strokeWidth={8} />
    <circle cx={160} cy={160} r={122} fill="none" stroke="#333" strokeWidth={4} />
    <text x={160} y={104} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={22} fill="#333">{place}</text>
    <text x={160} y={176} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={44} fill="#e63b2e">{date}</text>
    {/* wavy cancellation lines */}
    <g stroke="#333" strokeWidth={4} fill="none" strokeLinecap="round">
      <path d="M70,220 Q110,205 150,220 Q190,235 230,220 Q260,210 280,220" />
      <path d="M80,244 Q120,229 160,244 Q200,259 240,244" />
    </g>
    {/* rocket glyph */}
    <g transform="translate(160 272) scale(0.5)">
      <path d="M0,-34 Q12,-18 12,6 L12,22 L0,22 L-12,22 L-12,6 Q-12,-18 0,-34 Z" fill="#333" />
      <path d="M-5,22 L0,36 L5,22 Z" fill="#e63b2e" />
    </g>
  </svg>
);

/** Apollo command module under three parachutes. */
export const Capsule: React.FC = () => {
  const f = useCurrentFrame();
  const sway = Math.sin(f * 0.08) * 8;
  return (
    <svg viewBox="0 0 420 420" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`translate(${sway} 0)`}>
        {/* parachutes */}
        {[-110, 0, 110].map((dx, i) => (
          <g key={i} transform={`translate(${210 + dx} 90)`}>
            <path d="M-62,0 Q-62,-58 0,-58 Q62,-58 62,0 Z" fill={i === 1 ? "#ff7b54" : "#f5f5f0"} stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
            <path d="M-62,0 L-14,120 M62,0 L14,120 M0,-58 L0,120" stroke={OUTLINE} strokeWidth={4} fill="none" />
          </g>
        ))}
        {/* capsule cone */}
        <g transform="translate(210 260)">
          <path d="M-58,-40 Q-58,-78 0,-78 Q58,-78 58,-40 L74,44 Q74,66 52,66 L-52,66 Q-74,66 -74,44 Z" fill="#d8d8d8" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
          <path d="M-58,-40 L58,-40" stroke={OUTLINE} strokeWidth={5} />
          <circle cx={0} cy={-8} r={16} fill="#7ec8f0" stroke={OUTLINE} strokeWidth={5} />
          <rect x={-30} y={18} width={60} height={26} rx={8} fill="#e8634a" stroke={OUTLINE} strokeWidth={4} />
          {/* heat shield */}
          <path d="M-74,44 Q0,84 74,44 L74,58 Q0,96 -74,58 Z" fill="#8a5a2b" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
};

/** Auction gavel with motion arcs. */
export const Gavel: React.FC = () => {
  const f = useCurrentFrame();
  const bang = Math.sin(f * 0.5) > 0.6 ? 1 : 0;
  const rot = bang ? -14 : 18;
  return (
    <svg viewBox="0 0 300 220" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* sound arcs */}
      <g fill="none" stroke="#e8634a" strokeWidth={7} strokeLinecap="round" opacity={bang ? 1 : 0.25}>
        <path d="M30,40 Q0,90 30,140" />
        <path d="M270,40 Q300,90 270,140" />
      </g>
      <g transform={`rotate(${rot} 150 120)`}>
        <rect x={60} y={40} width={180} height={52} rx={16} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
        <rect x={140} y={92} width={20} height={70} rx={8} fill="#6b4f2a" stroke={OUTLINE} strokeWidth={5} />
      </g>
      {/* sound block */}
      <rect x={96} y={170} width={108} height={34} rx={10} fill="#5a4020" stroke={OUTLINE} strokeWidth={6} />
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

// ---------------- Sued God props (original designs) ----------------
/** Stack of lawsuit papers headed "CHAMBERS v. GOD". */
export const LawsuitPapers: React.FC = () => (
  <svg viewBox="0 0 420 300" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* back sheets */}
    <rect x={50} y={20} width={320} height={240} rx={10} fill="#e8e8e8" stroke={OUTLINE} strokeWidth={6} transform="rotate(-4 210 140)" />
    <rect x={40} y={30} width={320} height={240} rx={10} fill="#f5f5f0" stroke={OUTLINE} strokeWidth={6} transform="rotate(3 200 150)" />
    {/* front sheet */}
    <rect x={60} y={30} width={300} height={240} rx={10} fill="#fff" stroke={OUTLINE} strokeWidth={6} />
    <rect x={80} y={52} width={260} height={30} rx={6} fill="#1e3a6e" />
    <text x={210} y={75} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={21} fill="#fff">CHAMBERS v. GOD</text>
    <rect x={80} y={100} width={260} height={10} rx={5} fill="#c9c9c9" />
    <rect x={80} y={122} width={260} height={10} rx={5} fill="#c9c9c9" />
    <rect x={80} y={144} width={200} height={10} rx={5} fill="#c9c9c9" />
    <rect x={80} y={166} width={260} height={10} rx={5} fill="#c9c9c9" />
    <rect x={80} y={188} width={150} height={10} rx={5} fill="#c9c9c9" />
    {/* red seal */}
    <circle cx={310} cy={225} r={26} fill="#e63b2e" stroke={OUTLINE} strokeWidth={5} />
    <text x={310} y={233} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={22} fill="#fff">!</text>
  </svg>
);

/** Empty wooden chair with a "RESERVED" sign — God's seat at the hearing. */
export const EmptyChair: React.FC = () => (
  <svg viewBox="0 0 300 360" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* chair back + legs */}
    <rect x={60} y={30} width={180} height={150} rx={14} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={7} />
    <rect x={80} y={55} width={140} height={100} rx={8} fill="#a8845a" stroke={OUTLINE} strokeWidth={5} />
    <rect x={50} y={180} width={200} height={34} rx={10} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={7} />
    <rect x={62} y={214} width={18} height={120} rx={8} fill="#6b4f2a" stroke={OUTLINE} strokeWidth={5} />
    <rect x={220} y={214} width={18} height={120} rx={8} fill="#6b4f2a" stroke={OUTLINE} strokeWidth={5} />
    {/* RESERVED sign hanging on the chair back */}
    <rect x={85} y={80} width={130} height={56} rx={10} fill="#fdf3d8" stroke={OUTLINE} strokeWidth={5} transform="rotate(-3 150 108)" />
    <text x={150} y={116} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={24} fill="#20242b" transform="rotate(-3 150 108)">RESERVED</text>
  </svg>
);

/** Address book with a big question mark — "no home address on file". */
export const AddressBook: React.FC = () => (
  <svg viewBox="0 0 360 280" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* open book */}
    <path d="M30,60 Q100,30 180,60 Q260,30 330,60 L330,220 Q260,190 180,220 Q100,190 30,220 Z" fill="#fdf3d8" stroke={OUTLINE} strokeWidth={7} strokeLinejoin="round" />
    <path d="M180,60 L180,220" stroke={OUTLINE} strokeWidth={5} />
    {/* left page: lines */}
    <rect x={55} y={90} width={100} height={10} rx={5} fill="#c9c9c9" />
    <rect x={55} y={115} width={100} height={10} rx={5} fill="#c9c9c9" />
    <rect x={55} y={140} width={80} height={10} rx={5} fill="#c9c9c9" />
    {/* right page: big question mark */}
    <text x={255} y={175} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={700} fontSize={120} fill="#e63b2e">?</text>
  </svg>
);

/** Scales of justice. */
export const Scales: React.FC = () => (
  <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: "visible" }}>
    {/* post + base */}
    <rect x={140} y={30} width={20} height={200} rx={8} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
    <ellipse cx={150} cy={252} rx={90} ry={16} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
    {/* crossbar */}
    <rect x={30} y={46} width={240} height={16} rx={8} fill="#8a6a3b" stroke={OUTLINE} strokeWidth={6} />
    {/* left pan */}
    <path d="M60,62 L30,140 M60,62 L90,140" stroke={OUTLINE} strokeWidth={4} fill="none" />
    <path d="M20,140 Q60,190 100,140 Z" fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    {/* right pan */}
    <path d="M240,62 L210,140 M240,62 L270,140" stroke={OUTLINE} strokeWidth={4} fill="none" />
    <path d="M200,140 Q240,190 280,140 Z" fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
    {/* top knob */}
    <circle cx={150} cy={30} r={14} fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} />
  </svg>
);
