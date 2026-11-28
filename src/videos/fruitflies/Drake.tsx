// "Drake and the Cimarrones — The Slaves Who Showed Drake the Pacific"
// Gullak Tales style Short.
// Script: 196 words, speed-94 VO 59.352s, 198.1 WPM, 21 beats.
// Hard cuts, chibi SVG cut-out cast, flat plates, infographic number pills,
// bottom-centre karaoke captions, Rhubarb lip-sync.
// Point-to-point: every beat shows exactly what the words say at that moment.
// No title card, no end card, frame 1 mid-action, no intro/like/subscribe
// ask, no summary/moral ending, no watermark.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FPS, TOTAL, SceneId, BeatDef, beatAt, mouthAt, sceneAt, smooth, pop } from "./story";
import { FONT_CSS, FONT_FAMILY } from "./fonts";
import {
  Chibi, Boss, OUTLINE,
} from "./characters";
import {
  SeaPlate, ChalkPlate,
} from "./plates";
import {
  JunglePlate, TrailPlate, VillagePlate, HilltopPlate, RiverPlate,
} from "./plates-drake";
import {
  Mule, MuleTrain, SilverPile, PirateShip, JungleTree, TreasureChest, Globe, Compass,
} from "./props-drake";
import { Abs, ChalkText, Badge, SpeechBubble } from "./cards";
import { CaptionOverlay } from "./captions";

/** slow push-in on a plate over the scene (Gullak camera: locked-off + push) */
const PushIn: React.FC<{ dur: number; to?: number; children: React.ReactNode }> = ({ dur, to = 1.06, children }) => {
  const frame = useCurrentFrame();
  const s = 1 + (to - 1) * smooth(frame / dur);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: "50% 55%" }}>
      {children}
    </div>
  );
};

/** Big gold in-scene number on a dark pill. Count-up steps swap over the
 *  first ~18 frames after `delay` (one step every ~3.6 frames). */
const NumberPill: React.FC<{
  text: string;
  steps?: string[];
  lf: number;
  delay?: number;
  size?: number;
  top?: number;
}> = ({ text, steps, lf, delay = 0, size = 100, top = 1200 }) => {
  if (lf < delay) return null;
  const idx = steps ? Math.min(Math.floor((lf - delay) / 3.6), steps.length - 1) : 0;
  const shown = steps ? steps[idx] : text;
  return (
    <Abs left={0} top={top} width={1080}>
      <div style={{ textAlign: "center", transform: `scale(${pop((lf - delay) / 8)})` }}>
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontWeight: 700,
            fontSize: size,
            color: "#ffd93b",
            backgroundColor: "rgba(10,10,14,0.78)",
            border: `6px solid ${OUTLINE}`,
            borderRadius: 999,
            padding: "20px 48px",
            textShadow: "0 6px 0 rgba(0,0,0,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          {shown}
        </span>
      </div>
    </Abs>
  );
};

/** In-scene subtitle line: cream text on a dark pill so it stays readable
 *  on light plates too (jungle, day sky, sand, sea). */
const Sub: React.FC<{ children: React.ReactNode; top: number; size?: number; strong?: boolean }> = ({ children, top, size = 48, strong = false }) => (
  <Abs left={0} top={top} width={1080}>
    <div style={{ textAlign: "center" }}>
      <span
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: strong ? 700 : 600,
          fontSize: size,
          lineHeight: 1.35,
          color: "#fdf3d8",
          backgroundColor: "rgba(10,10,14,0.55)",
          borderRadius: 999,
          padding: "12px 36px",
        }}
      >
        {children}
      </span>
    </div>
  </Abs>
);

// ---- the cast (Chibi presets) ----
const Drake: React.FC<{ expression?: "happy" | "neutral" | "worried" | "scared" | "laugh" | "think" | "wink" | "calm"; mouth?: "closed" | "open" | "grin"; arm?: "down" | "oneUp" | "bothUp" | "mic" | "chin" | "point"; seed?: number; flip?: boolean }> = (p) => (
  <Chibi hat="beret" jacket="#c0392b" jacketDark="#96281b" trousers="#3a3a4d" moustache hair="#6b4423" skin="#f0c08c" {...p} />
);
const Pedro: React.FC<{ expression?: "happy" | "neutral" | "worried" | "scared" | "laugh" | "think" | "wink" | "calm"; mouth?: "closed" | "open" | "grin"; arm?: "down" | "oneUp" | "bothUp" | "mic" | "chin" | "point"; seed?: number; flip?: boolean }> = (p) => (
  <Chibi jacket="#2f9e44" jacketDark="#245c31" trousers="#3a5f9e" skin="#8a5a3b" hair="#1a1a1a" hairStyle="tufts" {...p} />
);
const Cimarron1: React.FC<{ expression?: "happy" | "neutral" | "worried" | "scared" | "laugh" | "think" | "wink" | "calm"; mouth?: "closed" | "open" | "grin"; arm?: "down" | "oneUp" | "bothUp" | "mic" | "chin" | "point"; seed?: number; flip?: boolean }> = (p) => (
  <Chibi jacket="#f2c14e" jacketDark="#b8933a" trousers="#3a5f9e" skin="#6b4423" hair="#1a1a1a" hairStyle="tufts" {...p} />
);
const Cimarron2: React.FC<{ expression?: "happy" | "neutral" | "worried" | "scared" | "laugh" | "think" | "wink" | "calm"; mouth?: "closed" | "open" | "grin"; arm?: "down" | "oneUp" | "bothUp" | "mic" | "chin" | "point"; seed?: number; flip?: boolean }> = (p) => (
  <Chibi jacket="#7ec8f0" jacketDark="#5b84bd" trousers="#3a5f9e" skin="#8a5a3b" hair="#1a1a1a" hairStyle="side" {...p} />
);
const Cimarron3: React.FC<{ expression?: "happy" | "neutral" | "worried" | "scared" | "laugh" | "think" | "wink" | "calm"; mouth?: "closed" | "open" | "grin"; arm?: "down" | "oneUp" | "bothUp" | "mic" | "chin" | "point"; seed?: number; flip?: boolean }> = (p) => (
  <Chibi jacket="#e8634a" jacketDark="#b04a38" trousers="#3a5f9e" skin="#eab886" hair="#3a3a3a" hairStyle="tufts" {...p} />
);
const Soldier: React.FC<{ expression?: "happy" | "neutral" | "worried" | "scared" | "laugh" | "think" | "wink" | "calm"; mouth?: "closed" | "open" | "grin"; arm?: "down" | "oneUp" | "bothUp" | "mic" | "chin" | "point"; seed?: number; flip?: boolean }> = (p) => (
  <Chibi hat="bowler" jacket="#5a5a6e" jacketDark="#484858" trousers="#4a4a5e" skin="#f0c08c" hair="#3a3a3a" {...p} />
);

const Scene: React.FC<{ id: SceneId; beat: BeatDef; lf: number; dur: number; t: number }> = ({ id, beat, lf, dur, t }) => {
  const frame = useCurrentFrame();
  const mouth = mouthAt(t);
  const blf = frame - beat.a; // beat-local frame: 0 at every beat cut
  switch (id) {
    case "hook": {
      // H1: Drake alone on the hill, 1573 pill | H2: two oceans, then the
      // cimarrones join him (mid-beat flip at blf 40, "because" 4.62s).
      // Frame 1 mid-action: Drake standing on the hilltop, seas behind.
      if (beat.id === "H2") {
        const joined = blf >= 40;
        return (
          <>
            <PushIn dur={dur} to={1.1}><HilltopPlate /></PushIn>
            <Abs left={64} top={260}>
              <Badge color={joined ? "#2f9e44" : "#1d2b4a"}>
                {joined ? "LED BY RUNAWAY SLAVES" : "ATLANTIC • PACIFIC"}
              </Badge>
            </Abs>
            <Abs left={200} top={950} width={260} height={390}>
              <Drake expression="calm" mouth={mouth} arm="point" seed={1} />
            </Abs>
            {joined && (
              <>
                <Abs left={520} top={1000} width={240} height={360} style={{ transform: `scale(${pop((blf - 40) / 8)})` }}>
                  <Pedro expression="happy" mouth="closed" arm="point" seed={2} />
                </Abs>
                <Abs left={700} top={1040} width={200} height={300} style={{ transform: `scale(${pop((blf - 44) / 8)})` }}>
                  <Cimarron1 expression="happy" mouth="closed" arm="oneUp" seed={3} />
                </Abs>
              </>
            )}
            <Sub top={1440}>{joined ? "led there by runaway slaves" : "saw two oceans at once"}</Sub>
          </>
        );
      }
      return (
        <>
          <PushIn dur={dur}><HilltopPlate /></PushIn>
          <Abs left={64} top={170}><Badge>1573 • PANAMA</Badge></Abs>
          <Abs left={390} top={800} width={300} height={450}>
            <Drake expression="calm" mouth={mouth} arm="point" seed={1} />
          </Abs>
          <NumberPill text="1573" lf={lf} delay={8} size={100} top={1240} />
          <Sub top={1440}>an English pirate stood on a hill</Sub>
        </>
      );
    }
    case "silver": {
      // S1 mule train + silver pile | S2 men running away → flip to jungle
      // at blf 57 ("Thousands" 12.16s) | S3 free village | S4 cimarrones
      // group + CIMARRONES badge (badge pops on "cimarrones," blf 20).
      if (beat.id === "S1") {
        return (
          <>
            <PushIn dur={dur}><TrailPlate /></PushIn>
            <Abs left={64} top={250}><Badge>SPAIN'S SILVER</Badge></Abs>
            <Abs left={120} top={1100} width={840} height={262}>
              <MuleTrain />
            </Abs>
            {lf > 66 && (
              <Abs left={390} top={1380} width={340} height={150} style={{ transform: `scale(${pop((lf - 66) / 8)})` }}>
                <SilverPile />
              </Abs>
            )}
            <Sub top={1560}>silver crossed Panama on mule trains</Sub>
          </>
        );
      }
      if (beat.id === "S2") {
        if (blf >= 57) {
          return (
            <>
              <PushIn dur={dur} to={1.12}><JunglePlate /></PushIn>
              <Abs left={64} top={170}><Badge color="#2f9e44">INTO THE JUNGLE</Badge></Abs>
              <Abs left={160} top={1050} width={260} height={390} style={{ transform: `scale(${pop((blf - 57) / 8)})` }}>
                <Cimarron1 expression="worried" mouth="closed" arm="point" seed={1} />
              </Abs>
              <Abs left={430} top={1100} width={260} height={390} style={{ transform: `scale(${pop((blf - 61) / 8)})` }}>
                <Cimarron2 expression="worried" mouth="closed" arm="down" seed={2} />
              </Abs>
              <Abs left={700} top={1050} width={260} height={390} style={{ transform: `scale(${pop((blf - 65) / 8)})` }}>
                <Cimarron3 expression="happy" mouth="closed" arm="oneUp" seed={3} />
              </Abs>
              <Sub top={1560}>fled into the jungle</Sub>
            </>
          );
        }
        // men running away across the road (translateX walks them right)
        const runX = blf * 4;
        return (
          <>
            <TrailPlate />
            <Abs left={200 + runX} top={1100} width={240} height={360}>
              <Cimarron1 expression="worried" mouth="closed" arm="point" seed={1} />
            </Abs>
            <Abs left={420 + runX} top={1150} width={240} height={360}>
              <Cimarron2 expression="worried" mouth="closed" arm="point" seed={2} />
            </Abs>
            <Sub top={1560}>the men who carried it kept running away</Sub>
          </>
        );
      }
      if (beat.id === "S3") {
        return (
          <>
            <VillagePlate />
            <Abs left={64} top={250}><Badge color="#2f9e44">A FREE VILLAGE</Badge></Abs>
            <Sub top={1560}>built free villages</Sub>
          </>
        );
      }
      // S4: cimarrones group in the village
      return (
        <>
          <VillagePlate />
          {blf > 20 && (
            <Abs left={64} top={260}><Badge color="#2f9e44">CIMARRONES</Badge></Abs>
          )}
          <Abs left={140} top={1000} width={260} height={390}>
            <Pedro expression="happy" mouth={mouth} arm="oneUp" seed={1} />
          </Abs>
          <Abs left={420} top={1050} width={260} height={390}>
            <Cimarron1 expression="happy" mouth="closed" arm="bothUp" seed={2} />
          </Abs>
          <Abs left={700} top={1000} width={260} height={390}>
            <Cimarron2 expression="happy" mouth="closed" arm="oneUp" seed={3} />
          </Abs>
          <Sub top={1560}>the wild ones</Sub>
        </>
      );
    }
    case "spain": {
      // M1 Spanish armies march | M2 melted into the trees → flip to the
      // raid at blf 57 ("kept raiding" 22.90s).
      if (beat.id === "M1") {
        const marchX = lf * 2;
        return (
          <>
            <PushIn dur={dur}><TrailPlate /></PushIn>
            <Abs left={64} top={250}><Badge>SPAIN'S ARMIES</Badge></Abs>
            <Abs left={140 + marchX} top={1050} width={280} height={420}>
              <Boss expression="neutral" mouth="closed" arm="point" seed={1} />
            </Abs>
            <Abs left={430 + marchX} top={1100} width={240} height={360}>
              <Soldier expression="neutral" mouth="closed" arm="down" seed={2} />
            </Abs>
            <Abs left={660 + marchX} top={1100} width={240} height={360}>
              <Soldier expression="neutral" mouth="closed" arm="down" seed={3} />
            </Abs>
            <Sub top={1560}>Spain sent armies to drag them back</Sub>
          </>
        );
      }
      if (blf >= 57) {
        // raid: cimarrones jump the mule on the treasure road
        return (
          <>
            <TrailPlate />
            <Abs left={64} top={250}><Badge color="#e8634a">THE TREASURE ROAD</Badge></Abs>
            <Abs left={120} top={1150} width={300} height={260}>
              <Mule />
            </Abs>
            <Abs left={480} top={1000} width={260} height={390} style={{ transform: `scale(${pop((blf - 57) / 8)})` }}>
              <Cimarron1 expression="happy" mouth="closed" arm="bothUp" seed={1} />
            </Abs>
            <Abs left={760} top={1050} width={260} height={390} style={{ transform: `scale(${pop((blf - 61) / 8)})` }}>
              <Cimarron2 expression="happy" mouth="closed" arm="point" seed={2} />
            </Abs>
            <Sub top={1560}>kept raiding the treasure road</Sub>
          </>
        );
      }
      // melted into the trees: cimarrones fading out in the jungle
      const fade = 1 - blf / 57;
      return (
        <>
          <JunglePlate />
          <Abs left={200} top={1050} width={260} height={390} style={{ opacity: Math.max(fade, 0.15) }}>
            <Cimarron1 expression="calm" mouth="closed" arm="down" seed={1} />
          </Abs>
          <Abs left={600} top={1100} width={260} height={390} style={{ opacity: Math.max(fade, 0.15) }}>
            <Cimarron2 expression="calm" mouth="closed" arm="down" seed={2} />
          </Abs>
          <Sub top={1560}>melted into the trees</Sub>
        </>
      );
    }
    case "drake": {
      // D1 ship arrives 1572 | D2 Drake lost in the jungle, flip at blf 59
      // ("The jungle knew him" 29.98s) | D3 cimarrones found HIM |
      // D4 Pedro Mandinga close-up | D5 the deal, speech bubble.
      if (beat.id === "D1") {
        const shipY = interpolate(lf, [0, 102], [960, 810]);
        return (
          <>
            <PushIn dur={dur}><SeaPlate /></PushIn>
            <Abs left={64} top={250}><Badge>1572 • DRAKE ARRIVES</Badge></Abs>
            <Abs left={190} top={shipY} width={700} height={583}>
              <PirateShip />
            </Abs>
            <Sub top={1560}>Francis Drake came for Spain's silver</Sub>
          </>
        );
      }
      if (beat.id === "D2") {
        const known = blf >= 59;
        return (
          <>
            <JunglePlate />
            {known && (
              <Abs left={0} top={0} width={1080} height={1920}>
                <div style={{ width: "100%", height: "100%", backgroundColor: "#000", opacity: 0.25 }} />
              </Abs>
            )}
            <Abs left={64} top={250}><Badge>LOST IN THE JUNGLE</Badge></Abs>
            <Abs left={80} top={800} width={300} height={525}>
              <JungleTree />
            </Abs>
            <Abs left={420} top={1000} width={300} height={450}>
              <Drake expression="worried" mouth={mouth} arm="chin" seed={1} />
            </Abs>
            <Abs left={720} top={1150} width={180} height={180}>
              <Compass />
            </Abs>
            <Sub top={1560}>{known ? "the jungle knew him" : "Drake didn't know the jungle"}</Sub>
          </>
        );
      }
      if (beat.id === "D3") {
        return (
          <>
            <PushIn dur={dur} to={1.12}><JunglePlate /></PushIn>
            <Abs left={390} top={1000} width={300} height={450}>
              <Drake expression="scared" mouth={mouth} arm="bothUp" seed={1} />
            </Abs>
            <Abs left={120} top={1050} width={240} height={360} style={{ transform: `scale(${pop(blf / 8)})` }}>
              <Pedro expression="happy" mouth="closed" arm="point" seed={2} />
            </Abs>
            <Abs left={720} top={1050} width={240} height={360} style={{ transform: `scale(${pop((blf - 4) / 8)})` }}>
              <Cimarron1 expression="happy" mouth="closed" arm="oneUp" seed={3} />
            </Abs>
            <Sub top={1560}>the cimarrones found HIM</Sub>
          </>
        );
      }
      if (beat.id === "D4") {
        return (
          <>
            <JunglePlate />
            {blf > 12 && (
              <Abs left={64} top={170}><Badge color="#2f9e44">PEDRO MANDINGA</Badge></Abs>
            )}
            <Abs left={300} top={900} width={360} height={540}>
              <Pedro expression="calm" mouth={mouth} arm="point" seed={1} />
            </Abs>
            <Abs left={720} top={1050} width={240} height={360}>
              <Drake expression="think" mouth="closed" arm="chin" seed={2} />
            </Abs>
            <Sub top={1560}>their guide offered a deal</Sub>
          </>
        );
      }
      // D5: the deal — speech bubble carries the line, no Sub
      return (
        <>
          <JunglePlate />
          <Abs left={150} top={1050} width={260} height={390}>
            <Pedro expression="happy" mouth={mouth} arm="point" seed={1} />
          </Abs>
          <Abs left={670} top={1050} width={260} height={390}>
            <Drake expression="happy" mouth="closed" arm="point" seed={2} />
          </Abs>
          <Abs left={300} top={640} width={480}>
            <SpeechBubble size={44} delay={0} tail="bottom">We guide you — you share the silver.</SpeechBubble>
          </Abs>
        </>
      );
    }
    case "ambush": {
      // A1 February 1573 march | A2 30 CIMARRONES pill + march |
      // A3 ambush → flip to the riverbed at blf 83 ("riverbed" 44.54s).
      if (beat.id === "A1") {
        const marchX = lf * 2;
        return (
          <>
            <PushIn dur={dur}><TrailPlate /></PushIn>
            <Abs left={64} top={250}><Badge>FEBRUARY 1573</Badge></Abs>
            <Abs left={140 + marchX} top={1050} width={260} height={390}>
              <Pedro expression="calm" mouth={mouth} arm="point" seed={1} />
            </Abs>
            <Abs left={420 + marchX} top={1100} width={260} height={390}>
              <Drake expression="calm" mouth="closed" arm="down" seed={2} />
            </Abs>
            <Abs left={680 + marchX} top={1050} width={240} height={360}>
              <Cimarron1 expression="happy" mouth="closed" arm="oneUp" seed={3} />
            </Abs>
            <Sub top={1560}>thirty cimarrones led Drake</Sub>
          </>
        );
      }
      if (beat.id === "A2") {
        return (
          <>
            <TrailPlate />
            <Abs left={120} top={1050} width={220} height={330}>
              <Pedro expression="calm" mouth={mouth} arm="point" seed={1} />
            </Abs>
            <Abs left={330} top={1100} width={220} height={330}>
              <Cimarron1 expression="happy" mouth="closed" arm="oneUp" seed={2} />
            </Abs>
            <Abs left={540} top={1050} width={220} height={330}>
              <Drake expression="calm" mouth="closed" arm="down" seed={3} />
            </Abs>
            <Abs left={750} top={1100} width={220} height={330}>
              <Cimarron2 expression="happy" mouth="closed" arm="point" seed={4} />
            </Abs>
            <NumberPill text="30 CIMARRONES" lf={lf} delay={56} size={88} top={1300} />
            <Sub top={1560}>led Drake across the isthmus</Sub>
          </>
        );
      }
      if (blf >= 83) {
        // riverbed: the stolen silver, hidden
        return (
          <>
            <RiverPlate />
            <Abs left={290} top={1300} width={500} height={320} style={{ transform: `scale(${pop((blf - 83) / 8)})` }}>
              <TreasureChest />
            </Abs>
            <Sub top={1560}>hid it in a riverbed</Sub>
          </>
        );
      }
      // ambush: mules + cimarrones jumping out, silver grabbed
      return (
        <>
          <TrailPlate />
          <Abs left={64} top={250}><Badge color="#e8634a">AMBUSH!</Badge></Abs>
          <Abs left={90} top={1150} width={900} height={280}>
            <MuleTrain />
          </Abs>
          <Abs left={140} top={900} width={260} height={390} style={{ transform: `scale(${pop(blf / 8)})` }}>
            <Cimarron1 expression="happy" mouth="closed" arm="bothUp" seed={1} />
          </Abs>
          <Abs left={700} top={900} width={260} height={390} style={{ transform: `scale(${pop((blf - 4) / 8)})` }}>
            <Cimarron2 expression="happy" mouth="closed" arm="bothUp" seed={2} />
          </Abs>
          {blf > 42 && (
            <Abs left={390} top={1420} width={340} height={150} style={{ transform: `scale(${pop((blf - 42) / 8)})` }}>
              <SilverPile />
            </Abs>
          )}
          <Sub top={1560}>ambushed a mule train</Sub>
        </>
      );
    }
    case "pivot": {
      // P1 YOU SEE chalk | P2 Pedro points at the chalk route — they knew
      // it better than Spain.
      if (beat.id === "P1") {
        return (
          <>
            <ChalkPlate />
            <Abs left={0} top={420} width={1080}>
              <ChalkText size={150} color="#ffd93b">YOU SEE</ChalkText>
            </Abs>
            <Abs left={200} top={1050} width={260} height={390}>
              <Drake expression="think" mouth={mouth} arm="chin" seed={1} />
            </Abs>
            <Abs left={620} top={1050} width={260} height={390}>
              <Pedro expression="calm" mouth="closed" arm="point" seed={2} />
            </Abs>
          </>
        );
      }
      return (
        <>
          <ChalkPlate />
          {/* chalk route: dashed gold path across the board */}
          <Abs left={0} top={0} width={1080} height={1920}>
            <svg viewBox="0 0 1080 1920" width="100%" height="100%">
              <path d="M140,500 Q400,380 540,560 Q680,740 940,620" fill="none" stroke="#ffd93b" strokeWidth={10} strokeDasharray="26 18" strokeLinecap="round" />
              <circle cx={140} cy={500} r={22} fill="#e8634a" stroke={OUTLINE} strokeWidth={5} />
              <circle cx={940} cy={620} r={22} fill="#2f9e44" stroke={OUTLINE} strokeWidth={5} />
            </svg>
          </Abs>
          <Abs left={180} top={1000} width={280} height={420}>
            <Pedro expression="calm" mouth={mouth} arm="point" seed={1} />
          </Abs>
          <Abs left={640} top={1050} width={260} height={390}>
            <Drake expression="think" mouth="closed" arm="chin" seed={2} />
          </Abs>
          <Sub top={1560}>knew it better than Spain</Sub>
        </>
      );
    }
    case "payoff": {
      // F1 climbing the hill | F2 TWO OCEANS pill + split seas |
      // F3 gave a pirate the world — globe, no Sub (caption carries it).
      if (beat.id === "F1") {
        const climbY = 1250 - lf * 1.2;
        return (
          <>
            <PushIn dur={dur} to={1.08}><HilltopPlate /></PushIn>
            <Abs left={64} top={170}><Badge>THE HILL</Badge></Abs>
            <Abs left={300} top={climbY} width={260} height={390}>
              <Pedro expression="happy" mouth="closed" arm="oneUp" seed={1} />
            </Abs>
            <Abs left={560} top={climbY + 40} width={260} height={390}>
              <Drake expression="happy" mouth={mouth} arm="point" seed={2} />
            </Abs>
            <Sub top={1560}>climbed a hill</Sub>
          </>
        );
      }
      if (beat.id === "F2") {
        return (
          <>
            <HilltopPlate />
            <Abs left={300} top={1000} width={260} height={390}>
              <Pedro expression="happy" mouth="closed" arm="point" seed={1} />
            </Abs>
            <Abs left={560} top={1000} width={260} height={390}>
              <Drake expression="happy" mouth={mouth} arm="point" seed={2} />
            </Abs>
            <NumberPill text="TWO OCEANS" lf={lf} delay={100} size={96} top={1240} />
            <Sub top={1560}>one hill — two oceans</Sub>
          </>
        );
      }
      // F3 (final): Drake + Pedro on the summit, globe pops on "gave".
      return (
        <>
          <PushIn dur={60} to={1.05}><HilltopPlate /></PushIn>
          <Abs left={260} top={1050} width={240} height={360}>
            <Pedro expression="happy" mouth="closed" arm="oneUp" seed={1} />
          </Abs>
          <Abs left={390} top={950} width={300} height={450}>
            <Drake expression="happy" mouth={mouth} arm="oneUp" seed={2} />
          </Abs>
          {blf > 20 && (
            <Abs left={700} top={1150} width={220} height={220} style={{ transform: `scale(${pop((blf - 20) / 8)})` }}>
              <Globe />
            </Abs>
          )}
        </>
      );
    }
    default:
      return null;
  }
};

export const DrakeShort: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const scene = sceneAt(frame);
  const beat = beatAt(frame);
  const lf = frame - scene.a;
  const dur = scene.b - scene.a;
  // Beat camera: a hard reframe at every ~3s beat cut. The transform
  // jumps at the beat boundary (that IS the cut) and holds steady inside
  // the beat. Captions stay OUTSIDE this wrapper so the karaoke pill never
  // jumps. Scale ≥1.08 whenever we translate, so no background shows at
  // the edges (1080×1.08 gives ±43px margin; |tx| ≤ 35, |ty| ≤ 40).
  const cam = beat.cam;
  return (
    <AbsoluteFill style={{ backgroundColor: "#1d2b4a", overflow: "hidden" }}>
      <style>{FONT_CSS}</style>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`,
          transformOrigin: cam.o,
        }}
      >
        <Scene id={scene.id} beat={beat} lf={lf} dur={dur} t={t} />
      </div>
      <CaptionOverlay />
    </AbsoluteFill>
  );
};

export { TOTAL };
