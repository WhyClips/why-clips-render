// Original chibi cut-out cast for Why Clips (Gullak Tales style).
// Big round head (~40% of height), tiny body, thick black outline, flat cel
// colours, expression swaps (not continuous faces), 3 mouth shapes driven by
// Rhubarb Lip Sync cues. No copied characters — all designs are original.
import React from "react";
import { useCurrentFrame } from "remotion";
import type { MouthShape } from "./story";

export const OUTLINE = "#20242b";
export type Expression =
  | "happy" | "neutral" | "worried" | "scared" | "laugh" | "think" | "wink" | "calm";
export type ArmPose = "down" | "oneUp" | "bothUp" | "mic" | "chin" | "point";
export type Hat =
  | "none" | "flycap" | "gogglesUp" | "gogglesDown" | "beret" | "modernCap" | "bowler";

export type ChibiProps = {
  skin?: string;
  hair?: string;
  hairStyle?: "side" | "neat" | "tufts";
  hat?: Hat;
  jacket?: string;
  jacketDark?: string;
  trousers?: string;
  wide?: boolean; // boss belly
  glasses?: boolean;
  headphones?: boolean;
  moustache?: boolean;
  scarf?: boolean;
  bowtie?: boolean;
  tie?: boolean;
  expression?: Expression;
  mouth?: MouthShape;
  arm?: ArmPose;
  bob?: boolean;
  seed?: number;
  flip?: boolean;
};

const EYES = { l: 94, r: 146, y: 94 };

function Eyes({ expression }: { expression: Expression }) {
  const s = { stroke: OUTLINE, strokeWidth: 5, strokeLinecap: "round" as const, fill: "none" };
  const dot = (cx: number, r = 5.5) => (
    <circle cx={cx} cy={EYES.y} r={r} fill={OUTLINE} />
  );
  const closed = (cx: number, lift = 8) => (
    <path d={`M${cx - 9},${EYES.y + 1} Q${cx},${EYES.y - lift} ${cx + 9},${EYES.y + 1}`} {...s} />
  );
  const brow = (cx: number, up: number) => (
    <path d={`M${cx - 11},${EYES.y - 16} L${cx + 11},${EYES.y - 16 - up}`} {...s} strokeWidth={4.5} />
  );
  switch (expression) {
    case "happy":
      return <g>{closed(EYES.l)} {closed(EYES.r)}</g>;
    case "laugh":
      return (
        <g>
          {closed(EYES.l, 12)} {closed(EYES.r, 12)}
          <path d="M74,100 L80,96 M166,96 L172,100" {...s} strokeWidth={4} />
        </g>
      );
    case "worried":
      return (
        <g>
          {dot(EYES.l)} {dot(EYES.r)} {brow(EYES.l, -3)} {brow(EYES.r, 3)}
        </g>
      );
    case "scared":
      return (
        <g>
          {dot(EYES.l, 7.5)} {dot(EYES.r, 7.5)} {brow(EYES.l, 5)} {brow(EYES.r, 5)}
          <path d="M198,40 Q207,54 198,61 Q189,54 198,40 Z" fill="#7ec8f0" stroke={OUTLINE} strokeWidth={4} />
          <path d="M40,62 Q47,73 40,79 Q33,73 40,62 Z" fill="#7ec8f0" stroke={OUTLINE} strokeWidth={4} />
        </g>
      );
    case "think":
      return (
        <g>
          {dot(EYES.l, 5)} {dot(EYES.r, 5)}
          <path d={`M${EYES.l - 10},${EYES.y - 9} L${EYES.l + 10},${EYES.y - 9}`} {...s} strokeWidth={4} />
          <path d={`M${EYES.r - 10},${EYES.y - 9} L${EYES.r + 10},${EYES.y - 9}`} {...s} strokeWidth={4} />
        </g>
      );
    case "wink":
      return <g>{dot(EYES.l)} {closed(EYES.r)}</g>;
    case "calm":
      return (
        <g>
          {dot(EYES.l, 5)} {dot(EYES.r, 5)}
          <path d={`M${EYES.l - 9},${EYES.y - 12} Q${EYES.l},${EYES.y - 16} ${EYES.l + 9},${EYES.y - 12}`} {...s} strokeWidth={4} />
          <path d={`M${EYES.r - 9},${EYES.y - 12} Q${EYES.r},${EYES.y - 16} ${EYES.r + 9},${EYES.y - 12}`} {...s} strokeWidth={4} />
        </g>
      );
    default:
      return <g>{dot(EYES.l)} {dot(EYES.r)}</g>;
  }
}

function Mouth({ mouth, expression }: { mouth: MouthShape; expression: Expression }) {
  if (expression === "laugh" && mouth === "closed") {
    return (
      <g>
        <ellipse cx={120} cy={133} rx={20} ry={15} fill="#6e1f1f" stroke={OUTLINE} strokeWidth={5} />
        <path d="M102,127 Q120,137 138,127 L138,121 Q120,129 102,121 Z" fill="#fff" />
      </g>
    );
  }
  if (mouth === "open")
    return <ellipse cx={120} cy={131} rx={13} ry={15} fill="#6e1f1f" stroke={OUTLINE} strokeWidth={5} />;
  if (mouth === "grin")
    return (
      <g>
        <rect x={99} y={121} width={42} height={24} rx={11} fill="#fff" stroke={OUTLINE} strokeWidth={5} />
        <path d="M120,122 L120,144 M110,122 L110,143 M130,122 L130,143" stroke={OUTLINE} strokeWidth={2.5} />
      </g>
    );
  return (
    <path d="M102,126 Q120,138 138,126" fill="none" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
  );
}

function Hair({ style, color }: { style: "side" | "neat" | "tufts"; color: string }) {
  if (style === "tufts")
    return (
      <g fill={color} stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round">
        <path d="M52,94 Q48,58 72,44 Q60,68 64,92 Z" />
        <path d="M188,94 Q192,58 168,44 Q180,68 176,92 Z" />
      </g>
    );
  if (style === "neat")
    return (
      <path
        d="M56,84 Q58,26 120,24 Q182,26 184,84 Q160,58 120,56 Q80,58 56,84 Z"
        fill={color} stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round"
      />
    );
  return (
    <path
      d="M52,90 Q50,20 120,18 Q190,20 188,90 Q170,58 140,54 Q150,72 138,74 Q120,60 100,72 Q88,64 92,52 Q70,58 52,90 Z"
      fill={color} stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round"
    />
  );
}

function HatLayer({ hat }: { hat: Hat }) {
  switch (hat) {
    case "flycap":
      return (
        <g>
          <rect x={42} y={82} width={24} height={46} rx={10} fill="#8a5a2b" stroke={OUTLINE} strokeWidth={6} />
          <rect x={174} y={82} width={24} height={46} rx={10} fill="#8a5a2b" stroke={OUTLINE} strokeWidth={6} />
          <path d="M50,88 Q48,14 120,12 Q192,14 190,88 Q160,60 120,58 Q80,60 50,88 Z" fill="#8a5a2b" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
        </g>
      );
    case "gogglesUp":
      return (
        <g>
          <path d="M56,44 L184,44" stroke="#333" strokeWidth={9} strokeLinecap="round" />
          <circle cx={94} cy={44} r={14} fill="#2e5a8a" stroke={OUTLINE} strokeWidth={5} />
          <circle cx={146} cy={44} r={14} fill="#2e5a8a" stroke={OUTLINE} strokeWidth={5} />
          <circle cx={90} cy={40} r={4} fill="#fff" opacity={0.85} />
          <circle cx={142} cy={40} r={4} fill="#fff" opacity={0.85} />
        </g>
      );
    case "gogglesDown":
      return (
        <g>
          <path d="M54,92 L76,92 M164,92 L186,92" stroke="#333" strokeWidth={8} strokeLinecap="round" />
          <circle cx={94} cy={94} r={19} fill="#2e5a8a" stroke={OUTLINE} strokeWidth={6} />
          <circle cx={146} cy={94} r={19} fill="#2e5a8a" stroke={OUTLINE} strokeWidth={6} />
          <circle cx={88} cy={88} r={5} fill="#fff" opacity={0.85} />
          <circle cx={140} cy={88} r={5} fill="#fff" opacity={0.85} />
        </g>
      );
    case "beret":
      return (
        <g transform="rotate(-8 120 34)">
          <ellipse cx={120} cy={34} rx={64} ry={20} fill="#2b3a5a" stroke={OUTLINE} strokeWidth={6} />
          <rect x={126} y={10} width={7} height={11} rx={3} fill="#2b3a5a" stroke={OUTLINE} strokeWidth={4} />
        </g>
      );
    case "modernCap":
      // Cap sits high on the forehead: dome + a thin brim band ABOVE the
      // eyes (eyes at y=94) so the brim never reads as a blindfold.
      return (
        <g>
          <path d="M54,70 Q56,22 120,20 Q184,22 186,70 Q150,54 120,54 Q90,54 54,70 Z" fill="#1e3a6e" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
          <ellipse cx={120} cy={68} rx={74} ry={10} fill="#16294d" stroke={OUTLINE} strokeWidth={5} />
          <circle cx={120} cy={44} r={11} fill="#ffd76a" stroke={OUTLINE} strokeWidth={4} />
          <path d="M120,38 L122,42 L126,42 L123,45 L124,49 L120,47 L116,49 L117,45 L114,42 L118,42 Z" fill="#8a5a00" />
        </g>
      );
    case "bowler":
      // Bowler sits HIGH on the forehead (brim above the eyes at y=94)
      // so it never reads as a blindfold (same fix as modernCap).
      return (
        <g>
          <path d="M62,64 Q62,16 120,16 Q178,16 178,64 Z" fill="#33302e" stroke={OUTLINE} strokeWidth={6} strokeLinejoin="round" />
          <ellipse cx={120} cy={66} rx={68} ry={12} fill="#33302e" stroke={OUTLINE} strokeWidth={6} />
        </g>
      );
    default:
      return null;
  }
}

function Arms({ pose, jacket }: { pose: ArmPose; jacket: string }) {
  const under = { stroke: OUTLINE, strokeWidth: 20, strokeLinecap: "round" as const, fill: "none" };
  const over = { stroke: jacket, strokeWidth: 13, strokeLinecap: "round" as const, fill: "none" };
  const hand = (cx: number, cy: number, skin: string) => (
    <circle cx={cx} cy={cy} r={9.5} fill={skin} stroke={OUTLINE} strokeWidth={5} />
  );
  const skin = "#f0c08c";
  const leftDown = (
    <>
      <path d="M90,182 Q74,218 82,254" {...under} />
      <path d="M90,182 Q74,218 82,254" {...over} />
      {hand(82, 258, skin)}
    </>
  );
  switch (pose) {
    case "oneUp":
      return (
        <g>
          {leftDown}
          <path d="M150,182 Q176,148 172,112" {...under} />
          <path d="M150,182 Q176,148 172,112" {...over} />
          {hand(172, 106, skin)}
        </g>
      );
    case "bothUp":
      return (
        <g>
          <path d="M90,182 Q64,148 68,112" {...under} />
          <path d="M90,182 Q64,148 68,112" {...over} />
          {hand(68, 106, skin)}
          <path d="M150,182 Q176,148 172,112" {...under} />
          <path d="M150,182 Q176,148 172,112" {...over} />
          {hand(172, 106, skin)}
        </g>
      );
    case "mic":
      return (
        <g>
          {leftDown}
          <path d="M150,182 Q172,168 160,142" {...under} />
          <path d="M150,182 Q172,168 160,142" {...over} />
          <rect x={150} y={118} width={16} height={26} rx={7} fill="#333" stroke={OUTLINE} strokeWidth={4} />
          <circle cx={158} cy={116} r={9} fill="#555" stroke={OUTLINE} strokeWidth={4} />
          {hand(158, 142, skin)}
        </g>
      );
    case "chin":
      return (
        <g>
          {leftDown}
          <path d="M150,182 Q172,164 156,140" {...under} />
          <path d="M150,182 Q172,164 156,140" {...over} />
          {hand(152, 134, skin)}
        </g>
      );
    case "point":
      return (
        <g>
          {leftDown}
          <path d="M150,182 L198,164" {...under} />
          <path d="M150,182 L198,164" {...over} />
          {hand(202, 162, skin)}
        </g>
      );
    default:
      return (
        <g>
          {leftDown}
          <path d="M150,182 Q166,218 158,254" {...under} />
          <path d="M150,182 Q166,218 158,254" {...over} />
          {hand(158, 258, skin)}
        </g>
      );
  }
}

export const Chibi: React.FC<ChibiProps> = ({
  skin = "#f0c08c",
  hair = "#6b4423",
  hairStyle = "side",
  hat = "none",
  jacket = "#2e4d8f",
  jacketDark = "#243d73",
  trousers = "#3a5f9e",
  wide = false,
  glasses = false,
  headphones = false,
  moustache = false,
  scarf = false,
  bowtie = false,
  tie = false,
  expression = "neutral",
  mouth = "closed",
  arm = "down",
  bob = true,
  seed = 0,
  flip = false,
}) => {
  const frame = useCurrentFrame();
  const bobY = bob ? Math.sin((frame + seed * 20) * 0.18) * 4 : 0;
  const sway = bob ? Math.sin((frame + seed * 20) * 0.11) * 1.6 : 0;
  const torsoX = wide ? 72 : 84;
  const torsoW = wide ? 96 : 72;
  return (
    <svg viewBox="0 0 240 360" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={flip ? "translate(240,0) scale(-1,1)" : undefined}>
        <g transform={`translate(0 ${bobY}) rotate(${sway} 120 344)`}>
          {/* ground shadow */}
          <ellipse cx={120} cy={344} rx={72} ry={11} fill="#000" opacity={0.14} />
          {/* legs + shoes */}
          <rect x={97} y={250} width={17} height={76} rx={8} fill={trousers} stroke={OUTLINE} strokeWidth={6} />
          <rect x={126} y={250} width={17} height={76} rx={8} fill={trousers} stroke={OUTLINE} strokeWidth={6} />
          <ellipse cx={105} cy={332} rx={17} ry={10} fill="#503722" stroke={OUTLINE} strokeWidth={5} />
          <ellipse cx={135} cy={332} rx={17} ry={10} fill="#503722" stroke={OUTLINE} strokeWidth={5} />
          {/* torso */}
          <rect x={torsoX} y={160} width={torsoW} height={100} rx={24} fill={jacket} stroke={OUTLINE} strokeWidth={7} />
          <circle cx={120} cy={196} r={4.5} fill="#ffd76a" />
          <circle cx={120} cy={220} r={4.5} fill="#ffd76a" />
          {tie && (
            <g>
              <rect x={112} y={160} width={16} height={13} rx={4} fill="#a93226" stroke={OUTLINE} strokeWidth={4} />
              <path d="M120,172 L112,182 L120,236 L128,182 Z" fill="#c0392b" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
            </g>
          )}
          {/* arms (behind torso edges visually, drawn after torso so they overlap) */}
          <Arms pose={arm} jacket={jacketDark} />
          {/* neckwear */}
          {scarf && (
            <g>
              <path d="M140,158 Q172,148 188,160 Q172,174 144,170 Z" fill="#f5f5f0" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
              <rect x={94} y={152} width={52} height={18} rx={9} fill="#f5f5f0" stroke={OUTLINE} strokeWidth={5} />
            </g>
          )}
          {bowtie && (
            <g>
              <path d="M120,162 L98,151 L98,173 Z M120,162 L142,151 L142,173 Z" fill="#b03a2e" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
              <circle cx={120} cy={162} r={6} fill="#8e2a20" stroke={OUTLINE} strokeWidth={3} />
            </g>
          )}
          {/* ears + head */}
          <circle cx={50} cy={96} r={11} fill={skin} stroke={OUTLINE} strokeWidth={6} />
          <circle cx={190} cy={96} r={11} fill={skin} stroke={OUTLINE} strokeWidth={6} />
          <circle cx={120} cy={92} r={72} fill={skin} stroke={OUTLINE} strokeWidth={7} />
          {/* hair / hat */}
          {hat !== "flycap" && hat !== "modernCap" && hat !== "bowler" && (
            <Hair style={hairStyle} color={hair} />
          )}
          <HatLayer hat={hat} />
          {headphones && (
            <g>
              <path d="M50,84 Q48,6 120,4 Q192,6 190,84" fill="none" stroke="#2b2b2b" strokeWidth={12} strokeLinecap="round" />
              <rect x={36} y={74} width={26} height={44} rx={11} fill="#2b2b2b" stroke={OUTLINE} strokeWidth={5} />
              <rect x={178} y={74} width={26} height={44} rx={11} fill="#2b2b2b" stroke={OUTLINE} strokeWidth={5} />
              <circle cx={49} cy={96} r={6} fill="#666" />
              <circle cx={191} cy={96} r={6} fill="#666" />
            </g>
          )}
          {/* face */}
          {hat !== "gogglesDown" && <Eyes expression={expression} />}
          {hat === "gogglesDown" && <HatLayer hat="gogglesDown" />}
          <path d="M117,104 Q122,110 117,113" fill="none" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
          {moustache && (
            <path
              d="M120,116 Q104,106 86,114 Q90,130 108,126 Q116,128 120,124 Q124,128 132,126 Q150,130 154,114 Q136,106 120,116 Z"
              fill="#d8d8d8" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round"
            />
          )}
          <Mouth mouth={mouth} expression={expression} />
          {glasses && (
            <g fill="rgba(255,255,255,0.14)" stroke="#222" strokeWidth={5}>
              <circle cx={94} cy={94} r={18} />
              <circle cx={146} cy={94} r={18} />
              <path d="M112,92 L128,92 M76,92 L54,88 M164,92 L186,88" fill="none" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};

// ---------------- the cast (original designs) ----------------
export type CastProps = {
  expression?: Expression;
  mouth?: MouthShape;
  arm?: ArmPose;
  bob?: boolean;
  seed?: number;
  flip?: boolean;
};

/** The pilot protagonist — 1920s leather cap + goggles, navy jacket, scarf. */
export const Pilot: React.FC<CastProps & { hat?: Hat }> = ({ hat = "flycap", ...p }) => (
  <Chibi
    hat={hat}
    jacket="#2e4d8f"
    jacketDark="#243d73"
    trousers="#3a5f9e"
    scarf
    hair="#6b4423"
    {...p}
  />
);

/** Mockford — radio officer: round glasses, big headphones, tweed + bow tie. */
export const Mockford: React.FC<CastProps> = (p) => (
  <Chibi
    hat="none"
    hairStyle="neat"
    hair="#4a3220"
    skin="#eab886"
    jacket="#7d6b48"
    jacketDark="#6a5a3c"
    trousers="#c9b896"
    glasses
    headphones
    bowtie
    {...p}
  />
);

/** The boss (mocker) — bowler hat, huge grey moustache, wide suit, red tie. */
export const Boss: React.FC<CastProps> = (p) => (
  <Chibi
    hat="bowler"
    hairStyle="tufts"
    hair="#9a9a9a"
    skin="#f0c08c"
    jacket="#3a3a4d"
    jacketDark="#2e2e3e"
    trousers="#33333f"
    wide
    moustache
    tie
    {...p}
  />
);

/** Gary Thuerk — 1970s office man: brown side-part hair, round glasses,
 * brown suit, red tie. (Original chibi design, not a likeness.) */
export const Gary: React.FC<CastProps> = (p) => (
  <Chibi
    hat="none"
    hairStyle="side"
    hair="#5a3a1a"
    skin="#f0c08c"
    jacket="#6b4f2a"
    jacketDark="#573f20"
    trousers="#4a3a28"
    glasses
    tie
    {...p}
  />
);

/** Generic ARPANET user — parametrised so a crowd can vary. */
export const NetUser: React.FC<CastProps & { variant?: number }> = ({ variant = 0, ...p }) => {
  const skins = ["#f0c08c", "#eab886", "#c98d5a", "#f5d0a9"];
  const hairs = ["#2b2b2b", "#6b4423", "#9a9a9a", "#4a3220"];
  const jackets = ["#2e4d8f", "#7d3a5a", "#2f7a5a", "#8a5a2b"];
  const v = variant % 4;
  return (
    <Chibi
      hat="none"
      hairStyle={v % 2 === 0 ? "neat" : "side"}
      hair={hairs[v]}
      skin={skins[v]}
      jacket={jackets[v]}
      jacketDark="#243d73"
      trousers="#33333f"
      glasses={v === 1}
      moustache={v === 3}
      {...p}
    />
  );
};
