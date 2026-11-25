// Matisse Short — characters and props (2D stick figures over a Blender
// museum plate). Characters stay simple (TheRealWhy style); realism lives
// in the Blender environment. NO text inside any SVG prop — the karaoke
// caption is the only text on screen.
import { OUTLINE } from "./characters";
import type { MouthShape } from "./story";

export type Expr = "neutral" | "shocked" | "happy" | "worried" | "smug" | "thinking";
export type ArmPose = "down" | "up" | "oneUp" | "bothUp" | "shrug" | "point";

const SKIN = "#f4c99a";
const INK = "#1c1c1c";

/** Face for the 300x560 StickPerson (head centre 150,128 r 86; eyes y 112). */
function MStickEyes({ expr }: { expr: Expr }) {
  const dot = (cx: number, r = 5) => <circle cx={cx} cy={112} r={r} fill={INK} />;
  const brow = (x1: number, y1: number, x2: number, y2: number) => (
    <path d={`M${x1},${y1} L${x2},${y2}`} stroke={INK} strokeWidth={4} strokeLinecap="round" />
  );
  switch (expr) {
    case "happy":
      return (
        <g fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round">
          <path d="M106,114 Q118,102 130,114" />
          <path d="M170,114 Q182,102 194,114" />
        </g>
      );
    case "worried":
      return (
        <g>
          {dot(118)} {dot(182)}
          {brow(108, 96, 128, 90)}
          {brow(172, 90, 192, 96)}
          <path d="M216,84 Q224,96 216,102 Q208,96 216,84 Z" fill="#7ec8f0" stroke={INK} strokeWidth={3.5} />
        </g>
      );
    case "shocked":
      return (
        <g>
          <circle cx={118} cy={112} r={10} fill="#fff" stroke={INK} strokeWidth={4} />
          <circle cx={182} cy={112} r={10} fill="#fff" stroke={INK} strokeWidth={4} />
          <circle cx={118} cy={112} r={3.5} fill={INK} />
          <circle cx={182} cy={112} r={3.5} fill={INK} />
          {brow(106, 92, 130, 88)}
          {brow(170, 88, 194, 92)}
        </g>
      );
    case "thinking":
      return (
        <g>
          {dot(122)} {dot(186)}
          {brow(106, 94, 130, 86)}
          {brow(170, 96, 194, 96)}
        </g>
      );
    case "smug":
      return (
        <g>
          {dot(118)} {dot(182)}
          {brow(106, 94, 130, 88)}
        </g>
      );
    default:
      return (
        <g>
          {dot(118)} {dot(182)}
        </g>
      );
  }
}

function MStickMouth({ mouth, expr }: { mouth: MouthShape; expr: Expr }) {
  if (expr === "happy" && mouth === "closed") {
    return (
      <g>
        <ellipse cx={150} cy={180} rx={14} ry={10} fill="#6e1f1f" stroke={INK} strokeWidth={4} />
        <path d="M138,176 Q150,181 162,176 L162,172 Q150,176 138,172 Z" fill="#fff" />
      </g>
    );
  }
  if (expr === "shocked" && mouth === "closed") {
    return <circle cx={150} cy={178} r={6} fill="#6e1f1f" stroke={INK} strokeWidth={4} />;
  }
  if (mouth === "open")
    return <ellipse cx={150} cy={179} rx={10} ry={13} fill="#6e1f1f" stroke={INK} strokeWidth={4} />;
  if (mouth === "grin")
    return (
      <g>
        <rect x={132} y={168} width={36} height={20} rx={9} fill="#fff" stroke={INK} strokeWidth={4} />
        <path d="M150,168 L150,186 M140,168 L140,185 M160,168 L160,185" stroke={INK} strokeWidth={2} />
      </g>
    );
  if (expr === "worried")
    return <path d="M138,180 Q150,175 162,180" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />;
  if (expr === "smug")
    return <path d="M138,178 Q152,182 164,174" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />;
  return <path d="M138,178 Q150,183 162,178" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />;
}

/** Generic stick person with costume options. viewBox 0 0 300 560. */
export function StickPerson({
  left = 0, top = 0, width, expr = "neutral", mouth = "closed", scale = 1, flip = false,
  arm = "down", hand = 0, bounce = false, bounceAmount = 6, bobPeriod = 24,
  costume = "plain", shirt = "#2f6db3", pants = "#2a2a2a", hair = "none",
  glasses = false, dress = false,
}: {
  left?: number; top?: number; width: number; expr?: Expr; mouth?: MouthShape;
  scale?: number; flip?: boolean; arm?: ArmPose; hand?: number;
  bounce?: boolean; bounceAmount?: number; bobPeriod?: number;
  costume?: "plain" | "suit" | "uniform" | "work";
  shirt?: string; pants?: string; hair?: "none" | "bun" | "cap" | "flat";
  glasses?: boolean; dress?: boolean;
}) {
  const bob = bounce ? -Math.abs(Math.sin((2 * Math.PI * (hand % bobPeriod)) / bobPeriod)) * bounceAmount : 0;
  const armY = arm === "bothUp" || arm === "shrug" ? 10 : 0;
  return (
    <div style={{
      position: "absolute", left, top, width, height: width * (560 / 300),
      transform: `scale(${scale}) scaleX(${flip ? -1 : 1}) translateY(${bob}px)`,
      transformOrigin: "50% 100%", pointerEvents: "none",
    }}>
      <svg viewBox="0 0 300 560" style={{ width: "100%", height: "100%" }}>
        {/* legs (hidden under a dress) */}
        {!dress && (
          <g stroke={pants} strokeWidth={20} strokeLinecap="round">
            <line x1={150} y1={380} x2={118} y2={545} />
            <line x1={150} y1={380} x2={182} y2={545} />
          </g>
        )}
        {/* body / costume */}
        {dress ? (
          <g>
            <polygon points="150,225 78,470 222,470" fill={shirt} stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
            <line x1={150} y1={225} x2={150} y2={470} stroke={OUTLINE} strokeWidth={3} opacity={0.35} />
          </g>
        ) : costume === "suit" ? (
          <g>
            <rect x={96} y={225} width={108} height={158} rx={16} fill={shirt} stroke={OUTLINE} strokeWidth={5} />
            <polygon points="150,225 118,300 150,338 182,300" fill="#fff" stroke={OUTLINE} strokeWidth={3} />
            <line x1={150} y1={338} x2={150} y2={383} stroke={OUTLINE} strokeWidth={3} />
          </g>
        ) : costume === "uniform" ? (
          <g>
            <rect x={96} y={225} width={108} height={158} rx={16} fill={shirt} stroke={OUTLINE} strokeWidth={5} />
            <rect x={96} y={300} width={108} height={8} fill="#d4af37" opacity={0.8} />
            <circle cx={126} cy={268} r={7} fill="#d4af37" />
            <circle cx={174} cy={268} r={7} fill="#d4af37" />
          </g>
        ) : costume === "work" ? (
          <g>
            <rect x={96} y={225} width={108} height={158} rx={16} fill={shirt} stroke={OUTLINE} strokeWidth={5} />
            <rect x={112} y={225} width={76} height={158} rx={10} fill="#8a5a2b" opacity={0.55} />
          </g>
        ) : (
          <line x1={150} y1={225} x2={150} y2={383} stroke={shirt} strokeWidth={26} strokeLinecap="round" />
        )}
        {/* arms */}
        <g stroke={INK} strokeWidth={18} strokeLinecap="round" fill="none">
          {arm === "down" && (<><line x1={104} y1={245} x2={72} y2={350} /><line x1={196} y1={245} x2={228} y2={350} /></>)}
          {arm === "up" && (<><line x1={104} y1={245} x2={88} y2={150} /><line x1={196} y1={245} x2={212} y2={150} /></>)}
          {arm === "oneUp" && (<><line x1={104} y1={245} x2={72} y2={350} /><line x1={196} y1={245} x2={246} y2={150} /></>)}
          {arm === "bothUp" && (<><line x1={104} y1={245} x2={64} y2={160} /><line x1={196} y1={245} x2={236} y2={160} /></>)}
          {arm === "shrug" && (<><line x1={104} y1={245} x2={58} y2={205 + armY} /><line x1={196} y1={245} x2={242} y2={205 + armY} /></>)}
          {arm === "point" && (<><line x1={104} y1={245} x2={72} y2={350} /><line x1={196} y1={245} x2={262} y2={196} /></>)}
        </g>
        {/* head */}
        <circle cx={150} cy={128} r={86} fill={SKIN} stroke={OUTLINE} strokeWidth={6} />
        {hair === "bun" && (
          <g fill="#4a2c14" stroke={OUTLINE} strokeWidth={4}>
            <path d="M64,128 Q64,42 150,42 Q236,42 236,128 Q236,86 150,86 Q64,86 64,128 Z" />
            <circle cx={150} cy={34} r={24} />
          </g>
        )}
        {hair === "cap" && (
          <g fill="#1f3a5f" stroke={OUTLINE} strokeWidth={4}>
            <path d="M66,116 Q66,44 150,44 Q234,44 234,116 L222,116 Q222,66 150,66 Q78,66 78,116 Z" />
            <rect x={58} y={108} width={184} height={14} rx={7} />
          </g>
        )}
        {hair === "flat" && (
          <path d="M66,128 Q62,46 150,46 Q238,46 234,128 Q234,88 150,88 Q66,88 66,128 Z" fill="#3a3a3a" stroke={OUTLINE} strokeWidth={4} />
        )}
        <MStickEyes expr={expr} />
        {glasses && (
          <g stroke={OUTLINE} strokeWidth={4} fill="rgba(255,255,255,0.25)">
            <circle cx={118} cy={112} r={26} /><circle cx={182} cy={112} r={26} />
            <line x1={144} y1={112} x2={156} y2={112} />
          </g>
        )}
        <MStickMouth mouth={mouth} expr={expr} />
      </svg>
    </div>
  );
}

// ---- named characters (wrappers) ----
export function StickVisitor(p: Omit<Parameters<typeof StickPerson>[0], "costume" | "shirt" | "hair" | "dress">) {
  return <StickPerson {...p} costume="plain" shirt="#2e8b8b" hair="bun" dress />;
}
export function StickGuard(p: Omit<Parameters<typeof StickPerson>[0], "costume" | "shirt" | "hair">) {
  return <StickPerson {...p} costume="uniform" shirt="#1f3a5f" hair="cap" />;
}
export function StickCurator(p: Omit<Parameters<typeof StickPerson>[0], "costume" | "shirt" | "glasses">) {
  return <StickPerson {...p} costume="suit" shirt="#3d3d3d" glasses />;
}
export function StickStaff(p: Omit<Parameters<typeof StickPerson>[0], "costume" | "shirt" | "hair">) {
  return <StickPerson {...p} costume="work" shirt="#c8b18a" hair="cap" />;
}
export function StickCritic(p: Omit<Parameters<typeof StickPerson>[0], "costume" | "shirt">) {
  return <StickPerson {...p} costume="suit" shirt="#5b3a6e" />;
}

// ---- props ----

/** The painting — an ORIGINAL abstract cut-paper composition (dark boat +
 * purple reflection shapes). NOT a reproduction of Le Bateau. `flipped`
 * rotates it 180° (upside down). viewBox 0 0 400 520. */
export function Painting({ flipped, width, left, top, rotate = 0 }: {
  flipped?: boolean; width: number; left: number; top: number; rotate?: number;
}) {
  const rot = (flipped ? 180 : 0) + rotate;
  return (
    <div style={{
      position: "absolute", left, top, width, height: width * (520 / 400),
      transform: `rotate(${rot}deg)`, transformOrigin: "50% 50%", pointerEvents: "none",
    }}>
      <svg viewBox="0 0 400 520" style={{ width: "100%", height: "100%" }}>
        {/* gold frame */}
        <rect x={4} y={4} width={392} height={512} rx={6} fill="#b8860b" stroke="#7a5c00" strokeWidth={4} />
        <rect x={18} y={18} width={364} height={484} fill="#f7f1e3" />
        {/* sun */}
        <circle cx={318} cy={86} r={34} fill="#e8722a" />
        {/* sail (triangle) */}
        <polygon points="200,90 200,250 292,250" fill="#1e3a5f" />
        {/* hull */}
        <polygon points="104,262 296,262 268,318 132,318" fill="#1e3a5f" />
        <rect x={196} y={70} width={8} height={200} fill="#3a3a3a" />
        {/* reflection — wavy purple bars below the boat */}
        <g fill="#7b5ea7">
          <rect x={120} y={348} width={160} height={20} rx={10} />
          <rect x={96} y={384} width={208} height={16} rx={8} />
          <rect x={136} y={416} width={128} height={14} rx={7} />
        </g>
        <g fill="#9b7ec4">
          <rect x={148} y={446} width={104} height={12} rx={6} />
          <rect x={112} y={472} width={176} height={10} rx={5} />
        </g>
        {/* small cut-paper accents */}
        <polygon points="70,120 96,168 44,168" fill="#2e8b6e" />
        <circle cx={78} cy={430} r={16} fill="#e8722a" opacity={0.85} />
      </svg>
    </div>
  );
}

/** Small framed cloud picture (for the "shapes don't care which way is up" beat). */
export function CloudFrame({ flipped, width, left, top }: {
  flipped?: boolean; width: number; left: number; top: number;
}) {
  return (
    <div style={{
      position: "absolute", left, top, width, height: width * (300 / 400),
      transform: `rotate(${flipped ? 180 : 0}deg)`, transformOrigin: "50% 50%", pointerEvents: "none",
    }}>
      <svg viewBox="0 0 400 300" style={{ width: "100%", height: "100%" }}>
        <rect x={4} y={4} width={392} height={292} rx={6} fill="#8a5a2b" stroke="#5c3a1a" strokeWidth={4} />
        <rect x={18} y={18} width={364} height={264} fill="#a8d0e6" />
        <g fill="#ffffff">
          <ellipse cx={200} cy={130} rx={110} ry={44} />
          <ellipse cx={150} cy={150} rx={70} ry={34} />
          <ellipse cx={255} cy={150} rx={70} ry={34} />
        </g>
        <rect x={18} y={210} width={364} height={72} fill="#2e8b6e" opacity={0.75} />
      </svg>
    </div>
  );
}

/** Open exhibition catalogue (abstract line squiggles only — no text). */
export function Catalogue({ width, left, top, rotate = 0 }: {
  width: number; left: number; top: number; rotate?: number;
}) {
  return (
    <div style={{
      position: "absolute", left, top, width, height: width * (260 / 400),
      transform: `rotate(${rotate}deg)`, pointerEvents: "none",
    }}>
      <svg viewBox="0 0 400 260" style={{ width: "100%", height: "100%" }}>
        <path d="M20,30 L200,10 L200,230 L20,250 Z" fill="#f3ead8" stroke={OUTLINE} strokeWidth={5} />
        <path d="M380,30 L200,10 L200,230 L380,250 Z" fill="#e8dcc0" stroke={OUTLINE} strokeWidth={5} />
        <g stroke="#8a8a8a" strokeWidth={4} strokeLinecap="round">
          <line x1={48} y1={70} x2={172} y2={56} /><line x1={48} y1={100} x2={172} y2={86} />
          <line x1={48} y1={130} x2={172} y2={116} /><line x1={48} y1={160} x2={130} y2={150} />
          <line x1={228} y1={56} x2={352} y2={70} /><line x1={228} y1={86} x2={352} y2={100} />
          <line x1={228} y1={116} x2={352} y2={130} />
        </g>
        <polygon points="290,150 290,200 340,200" fill="#1e3a5f" />
        <rect x={252} y={206} width={90} height={10} rx={5} fill="#7b5ea7" />
      </svg>
    </div>
  );
}

/** 1960s rotary telephone. */
export function Phone({ width, left, top }: { width: number; left: number; top: number }) {
  return (
    <div style={{ position: "absolute", left, top, width, height: width * (200 / 320), pointerEvents: "none" }}>
      <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%" }}>
        <rect x={40} y={110} width={240} height={70} rx={18} fill="#1c1c1c" stroke={OUTLINE} strokeWidth={5} />
        <circle cx={160} cy={118} r={34} fill="#e8e8e8" stroke={OUTLINE} strokeWidth={5} />
        <circle cx={160} cy={118} r={12} fill="#1c1c1c" />
        <rect x={52} y={60} width={216} height={34} rx={17} fill="#1c1c1c" stroke={OUTLINE} strokeWidth={5} />
        <circle cx={60} cy={77} r={16} fill="#1c1c1c" stroke={OUTLINE} strokeWidth={4} />
        <circle cx={260} cy={77} r={16} fill="#1c1c1c" stroke={OUTLINE} strokeWidth={4} />
      </svg>
    </div>
  );
}

/** Magnifying glass. */
export function Magnifier({ width, left, top, rotate = 0 }: {
  width: number; left: number; top: number; rotate?: number;
}) {
  return (
    <div style={{
      position: "absolute", left, top, width, height: width,
      transform: `rotate(${rotate}deg)`, transformOrigin: "50% 50%", pointerEvents: "none",
    }}>
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
        <circle cx={86} cy={86} r={66} fill="rgba(180,220,255,0.35)" stroke="#1c1c1c" strokeWidth={10} />
        <line x1={134} y1={134} x2={182} y2={182} stroke="#1c1c1c" strokeWidth={18} strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** Step ladder. */
export function Ladder({ width, left, top, height }: {
  width: number; left: number; top: number; height: number;
}) {
  return (
    <div style={{ position: "absolute", left, top, width, height, pointerEvents: "none" }}>
      <svg viewBox="0 0 200 400" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <g stroke="#8a5a2b" strokeWidth={14} strokeLinecap="round">
          <line x1={30} y1={0} x2={30} y2={400} />
          <line x1={170} y1={0} x2={170} y2={400} />
          <line x1={30} y1={80} x2={170} y2={80} />
          <line x1={30} y1={170} x2={170} y2={170} />
          <line x1={30} y1={260} x2={170} y2={260} />
          <line x1={30} y1={350} x2={170} y2={350} />
        </g>
      </svg>
    </div>
  );
}

/** Calendar with flipping pages (no digits — pages flip to show time passing). */
export function CalendarPages({ width, left, top, flipU }: {
  width: number; left: number; top: number; flipU: number; // 0..1 progress of the flip
}) {
  const pageY = -flipU * 90;
  const pageO = 1 - flipU;
  return (
    <div style={{ position: "absolute", left, top, width, height: width * (300 / 260), pointerEvents: "none" }}>
      <svg viewBox="0 0 260 300" style={{ width: "100%", height: "100%" }}>
        <rect x={20} y={30} width={220} height={250} rx={12} fill="#e8e8e8" stroke={OUTLINE} strokeWidth={5} />
        <rect x={20} y={30} width={220} height={250} rx={12} fill="#f3ead8" stroke={OUTLINE} strokeWidth={5} opacity={0.7} />
        <rect x={20} y={30} width={220} height={54} rx={12} fill="#b03a2e" />
        <g stroke="#8a8a8a" strokeWidth={5} strokeLinecap="round">
          <line x1={50} y1={120} x2={210} y2={120} /><line x1={50} y1={160} x2={210} y2={160} />
          <line x1={50} y1={200} x2={210} y2={200} /><line x1={50} y1={240} x2={150} y2={240} />
        </g>
        {/* flipping page */}
        <g transform={`translate(0 ${pageY})`} opacity={pageO}>
          <rect x={20} y={30} width={220} height={250} rx={12} fill="#fffdf5" stroke={OUTLINE} strokeWidth={5} />
          <rect x={20} y={30} width={220} height={54} rx={12} fill="#c0392b" />
        </g>
      </svg>
    </div>
  );
}

/** Velvet rope barrier (reads as "closed" without any text). */
export function RopeBarrier({ width, left, top }: { width: number; left: number; top: number }) {
  return (
    <div style={{ position: "absolute", left, top, width, height: width * (140 / 700), pointerEvents: "none" }}>
      <svg viewBox="0 0 700 140" style={{ width: "100%", height: "100%" }}>
        <rect x={30} y={10} width={16} height={120} rx={8} fill="#d4af37" stroke={OUTLINE} strokeWidth={3} />
        <circle cx={38} cy={12} r={14} fill="#d4af37" stroke={OUTLINE} strokeWidth={3} />
        <rect x={654} y={10} width={16} height={120} rx={8} fill="#d4af37" stroke={OUTLINE} strokeWidth={3} />
        <circle cx={662} cy={12} r={14} fill="#d4af37" stroke={OUTLINE} strokeWidth={3} />
        <path d="M38,20 Q350,120 662,20" fill="none" stroke="#a4123f" strokeWidth={16} strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** Museum double doors (fold INTO the frame to open — scaleX about the
 * outer edge — so the panels never slide over the painting beside them). */
export function MuseumDoors({ width, left, top, height, openU }: {
  width: number; left: number; top: number; height: number; openU: number; // 0 closed, 1 open
}) {
  const sx = 1 - openU * 0.85;
  return (
    <div style={{ position: "absolute", left, top, width, height, pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, width: "50%", height: "100%",
        background: "#6b3f1d", border: "5px solid #3a2410", borderRadius: "8px 0 0 8px",
        transform: `scaleX(${sx})`, transformOrigin: "left center", boxSizing: "border-box",
      }}>
        <div style={{ position: "absolute", right: 14, top: "50%", width: 18, height: 18, borderRadius: "50%", background: "#d4af37" }} />
      </div>
      <div style={{
        position: "absolute", right: 0, top: 0, width: "50%", height: "100%",
        background: "#6b3f1d", border: "5px solid #3a2410", borderRadius: "0 8px 8px 0",
        transform: `scaleX(${sx})`, transformOrigin: "right center", boxSizing: "border-box",
      }}>
        <div style={{ position: "absolute", left: 14, top: "50%", width: 18, height: 18, borderRadius: "50%", background: "#d4af37" }} />
      </div>
    </div>
  );
}
