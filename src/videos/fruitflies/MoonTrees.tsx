// "Moon Trees — NASA Flew 500 Seeds Around the Moon" — Gullak Tales style Short.
// 7 setups, hard cuts, chibi SVG cut-out cast, flat plates, infographic
// number pills, bottom-centre karaoke captions, Rhubarb lip-sync.
// Point-to-point: every scene shows exactly what the words say at that moment.
// No title card, no end card, frame 1 mid-action, no intro/like/subscribe
// ask, no summary/moral ending, no watermark.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FPS, TOTAL, SceneId, mouthAt, sceneAt, smooth, pop } from "./story";
import { FONT_CSS, FONT_FAMILY } from "./fonts";
import {
  Crewman, Agent, Astronaut, OUTLINE,
} from "./characters";
import {
  SpacePlate, LaunchPadPlate, QuarantinePlate, MoonPlate,
  InteriorPlate, ChalkPlate, AirfieldPlate, SeaPlate,
} from "./plates";
import { Capsule, SaturnRocket } from "./props";
import {
  SeedCanister, SeedPile, SeedlingTray, PineTree, WhiteHouse,
  OrbitDiagram, NewspaperClippings, ArtemisRocket,
} from "./props-moon";
import { Abs, ChalkText, Badge, SpeechBubble, RedX } from "./cards";
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
 *  on light plates too (Moon ground, day sky, runway, tan floor). */
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

const Scene: React.FC<{ id: SceneId; lf: number; dur: number; t: number }> = ({ id, lf, dur, t }) => {
  const frame = useCurrentFrame();
  const mouth = mouthAt(t);
  switch (id) {
    case "hook": {
      // Frame 1 mid-action: the seed canister, big, centre — Moon already in the sky.
      const bob = Math.sin(frame * 0.12) * 8;
      return (
        <>
          <PushIn dur={dur}><SpacePlate /></PushIn>
          {lf > 10 && (
            <Abs left={64} top={170}><Badge>1971 • NASA</Badge></Abs>
          )}
          <Abs left={360} top={520 + bob} width={360} height={504} style={{ transform: `scale(${pop(lf / 8)})` }}>
            <SeedCanister />
          </Abs>
          {/* loose seeds drifting around the canister */}
          <Abs left={0} top={0} width={1080} height={1920}>
            <svg viewBox="0 0 1080 1920" width="100%" height="100%">
              {[
                { x: 300, y: 640, s: 1 }, { x: 790, y: 700, s: 0.8 }, { x: 260, y: 980, s: 0.9 },
                { x: 830, y: 1020, s: 1.1 }, { x: 540, y: 420, s: 0.7 },
              ].map((d, i) => (
                <ellipse
                  key={i}
                  cx={d.x + Math.sin(frame * 0.1 + i * 2) * 14}
                  cy={d.y + Math.cos(frame * 0.08 + i) * 12}
                  rx={13 * d.s} ry={9 * d.s}
                  fill="#7a5230" stroke={OUTLINE} strokeWidth={4}
                  transform={`rotate(${i * 40} ${d.x} ${d.y})`}
                />
              ))}
            </svg>
          </Abs>
          <NumberPill
            text="500 SEEDS"
            steps={["100 SEEDS", "200 SEEDS", "300 SEEDS", "400 SEEDS", "500 SEEDS"]}
            lf={lf} delay={43} size={100} top={1240}
          />
          {lf > 120 && (
            <Sub top={1440}>…and the trees still stand today</Sub>
          )}
        </>
      );
    }
    case "apollo14": {
      // A: launch (lf 0–78) | B: two astronauts walk the Moon (78–126)
      // C: Roosa alone in orbit + canister + ex-firefighter (126–end)
      if (lf < 78) {
        const rocketY = interpolate(lf, [0, 78], [1250, 250]);
        return (
          <>
            <PushIn dur={78}><LaunchPadPlate /></PushIn>
            <Abs left={64} top={250}><Badge>APOLLO 14 • JAN 1971</Badge></Abs>
            <Abs left={440} top={rocketY} width={200} height={413}>
              <SaturnRocket />
            </Abs>
            <Sub top={1560}>up it goes…</Sub>
          </>
        );
      }
      if (lf < 126) {
        return (
          <>
            <MoonPlate />
            <Abs left={64} top={250}><Badge>TWO ON THE MOON</Badge></Abs>
            <Abs left={180} top={950} width={300} height={450} style={{ transform: `translateY(${Math.sin(frame * 0.15) * 6}px)` }}>
              <Astronaut patch="#e8634a" expression="happy" mouth="closed" arm="oneUp" />
            </Abs>
            <Abs left={620} top={980} width={300} height={450} style={{ transform: `translateY(${Math.cos(frame * 0.13) * 6}px)` }}>
              <Astronaut patch="#4a6fa5" expression="happy" mouth="closed" arm="down" />
            </Abs>
            <Sub top={1480}>walking on the Moon…</Sub>
          </>
        );
      }
      return (
        <>
          <SpacePlate />
          <Abs left={220} top={300} width={800} height={500}>
            <OrbitDiagram />
          </Abs>
          {lf > 217 && (
            <Abs left={64} top={170}><Badge color="#2f9e44">EX-FOREST FIREFIGHTER</Badge></Abs>
          )}
          {lf <= 217 && (
            <Abs left={64} top={170}><Badge>STUART ROOSA</Badge></Abs>
          )}
          <Abs left={390} top={950} width={300} height={450}>
            <Crewman shirt="#f5f5f0" expression="calm" mouth={mouth} arm="point" seed={1} />
          </Abs>
          {lf > 161 && (
            <Abs left={700} top={1150} width={150} height={210} style={{ transform: `scale(${pop((lf - 161) / 8)})` }}>
              <SeedCanister />
            </Abs>
          )}
          <Sub top={1480}>circled alone above them</Sub>
        </>
      );
    }
    case "orbits": {
      // A: never touched the Moon (lf 0–44) | B: 34 orbits (44–123)
      // C: splashdown burst (123–209) | D: spilled like salt (209–end)
      if (lf < 44) {
        return (
          <>
            <MoonPlate />
            <Abs left={0} top={380} width={1080}>
              <ChalkText size={84}>NEVER TOUCHED</ChalkText>
            </Abs>
            <Abs left={0} top={500} width={1080}>
              <ChalkText size={84} color="#ffd93b" delay={4}>THE MOON</ChalkText>
            </Abs>
            <Abs left={340} top={760} width={400} height={400}>
              <RedX size={400} delay={8} />
            </Abs>
            <Sub top={1240}>the seeds never landed…</Sub>
          </>
        );
      }
      if (lf < 123) {
        return (
          <>
            <SpacePlate />
            <Abs left={220} top={360} width={800} height={500}>
              <OrbitDiagram />
            </Abs>
            <NumberPill text="34 ORBITS" lf={lf} delay={61} size={104} top={1020} />
            <Sub top={1300}>looped around it — while astronauts took the glory</Sub>
          </>
        );
      }
      if (lf < 209) {
        // capsule falls, then BURST at lf 156 ("burst," 23.18s)
        if (lf < 156) {
          const capY = interpolate(lf, [123, 156], [250, 780]);
          return (
            <>
              <PushIn dur={90}><SeaPlate /></PushIn>
              <Abs left={64} top={250}><Badge>SPLASHDOWN</Badge></Abs>
              <Abs left={340} top={capY} width={400} height={400}>
                <Capsule />
              </Abs>
              <Sub top={1300}>then splashdown…</Sub>
            </>
          );
        }
        return (
          <>
            <SeaPlate />
            <Abs left={0} top={420} width={1080}>
              <ChalkText size={120} color="#ffd93b">BURST!</ChalkText>
            </Abs>
            <Abs left={240} top={900} width={600} height={264} style={{ transform: `scale(${pop((lf - 156) / 8)})` }}>
              <SeedPile />
            </Abs>
            <Sub top={1300} size={56} strong>the canisters burst open</Sub>
          </>
        );
      }
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={380} width={1080}>
            <ChalkText size={72} color="#ffd93b">MIXED LIKE</ChalkText>
          </Abs>
          <Abs left={0} top={480} width={1080}>
            <ChalkText size={72}>SPILLED SALT</ChalkText>
          </Abs>
          <Abs left={240} top={700} width={600} height={264}>
            <SeedPile />
          </Abs>
          <Abs left={390} top={1050} width={300} height={450}>
            <Agent expression="worried" mouth={mouth} arm="down" />
          </Abs>
          <Sub top={1560} size={46}>everyone thought it was over</Sub>
        </>
      );
    }
    case "sprout": {
      // A: planted anyway, Mississippi + California (lf 0–110)
      // B: 420 seedlings, stubborn as weeds (110–end)
      if (lf < 110) {
        return (
          <>
            <InteriorPlate />
            <Abs left={64} top={250}><Badge color="#2f9e44">MISSISSIPPI • CALIFORNIA</Badge></Abs>
            <Abs left={150} top={1180} width={240} height={360}>
              <Crewman shirt="#2f9e44" expression="think" mouth={mouth} arm="point" seed={2} />
            </Abs>
            <Abs left={480} top={1000} width={520} height={260}>
              <SeedlingTray sprouts={6} />
            </Abs>
            <Sub top={1560} size={56} strong>they planted them anyway</Sub>
          </>
        );
      }
      return (
        <>
          <InteriorPlate />
          <Abs left={64} top={250}><Badge color="#2f9e44">ALMOST EVERY ONE SPROUTED</Badge></Abs>
          <Abs left={240} top={640} width={600} height={300}>
            <SeedlingTray sprouts={6} />
          </Abs>
          <Abs left={190} top={980} width={700} height={350}>
            <SeedlingTray sprouts={7} />
          </Abs>
          <NumberPill text="420 SEEDLINGS" lf={lf} delay={112} size={76} top={1400} />
        </>
      );
    }
    case "states": {
      // A: 200th birthday, every state (lf 0–78) | B: Philadelphia planting (78–147)
      // C: White House pine, Brazil + Japan (147–end)
      if (lf < 78) {
        return (
          <>
            <ChalkPlate />
            <Abs left={64} top={250}><Badge color="#e8634a">AMERICA'S 200th BIRTHDAY</Badge></Abs>
            <NumberPill text="50 STATES" lf={lf} delay={56} size={110} top={620} />
            <Abs left={140} top={1150} width={200} height={350}>
              <PineTree />
            </Abs>
            <Abs left={440} top={1100} width={200} height={350}>
              <PineTree />
            </Abs>
            <Abs left={740} top={1150} width={200} height={350}>
              <PineTree />
            </Abs>
            <Sub top={1560}>the baby trees went to every state</Sub>
          </>
        );
      }
      if (lf < 147) {
        return (
          <>
            <PushIn dur={90}><AirfieldPlate /></PushIn>
            <Abs left={64} top={250}><Badge>PHILADELPHIA • MAY 1975</Badge></Abs>
            <Abs left={180} top={950} width={290} height={435}>
              <Crewman shirt="#f5f5f0" expression="happy" mouth={mouth} arm="oneUp" seed={1} />
            </Abs>
            <Abs left={440} top={750} width={200} height={350} style={{ transform: `scale(${pop((lf - 78) / 8)})` }}>
              <PineTree />
            </Abs>
            <Abs left={700} top={950} width={290} height={435}>
              <Crewman shirt="#7ec8f0" expression="happy" mouth="closed" arm="down" seed={2} />
            </Abs>
            <Sub top={1480} size={56} strong>first planting: Philadelphia</Sub>
          </>
        );
      }
      return (
        <>
          <AirfieldPlate />
          <Abs left={64} top={250}><Badge>WHITE HOUSE</Badge></Abs>
          <Abs left={190} top={480} width={700} height={420}>
            <WhiteHouse />
          </Abs>
          <Abs left={430} top={950} width={220} height={385}>
            <PineTree />
          </Abs>
          <Abs left={140} top={1000} width={260} height={390}>
            <Crewman shirt="#f5f5f0" expression="happy" mouth={mouth} arm="point" seed={1} />
          </Abs>
          <Sub top={1480}>a pine went to the White House</Sub>
        </>
      );
    }
    case "hunt": {
      // A: forgotten (lf 0–38) | B: schoolteacher asks NASA (38–97)
      // C: scientist + newspaper clippings (97–166) | D: 110 found (166–end)
      if (lf < 38) {
        return (
          <>
            <ChalkPlate />
            <Abs left={0} top={380} width={1080}>
              <ChalkText size={110}>FORGOTTEN…</ChalkText>
            </Abs>
            <Abs left={440} top={700} width={200} height={350} style={{ opacity: 0.55 }}>
              <PineTree />
            </Abs>
            <Abs left={390} top={1150} width={300} height={450}>
              <Crewman shirt="#7ec8f0" expression="think" mouth="closed" arm="chin" seed={1} />
            </Abs>
          </>
        );
      }
      if (lf < 97) {
        return (
          <>
            <InteriorPlate />
            <Abs left={64} top={250}><Badge>A SCHOOLTEACHER ASKED</Badge></Abs>
            <Abs left={150} top={1180} width={240} height={360}>
              <Crewman shirt="#f2c14e" expression="think" mouth={mouth} arm="oneUp" seed={1} />
            </Abs>
            <Abs left={480} top={1150} width={480}>
              <SpeechBubble size={44} delay={4} tail="left">Where are the Moon Trees?</SpeechBubble>
            </Abs>
            <Sub top={1560}>…asked NASA where they were</Sub>
          </>
        );
      }
      if (lf < 166) {
        return (
          <>
            <QuarantinePlate />
            <Abs left={64} top={170}><Badge color="#2f9e44">THE HUNT</Badge></Abs>
            <Abs left={190} top={560} width={700} height={460}>
              <NewspaperClippings />
            </Abs>
            <Abs left={390} top={1120} width={290} height={435}>
              <Crewman shirt="#2f9e44" expression="think" mouth={mouth} arm="chin" seed={2} />
            </Abs>
          </>
        );
      }
      return (
        <>
          <QuarantinePlate />
          <NumberPill text="110 FOUND" lf={lf} delay={166} size={110} top={560} />
          <Abs left={190} top={780} width={700} height={460}>
            <NewspaperClippings />
          </Abs>
          <Abs left={420} top={1260} width={240} height={360}>
            <Crewman shirt="#2f9e44" expression="happy" mouth={mouth} arm="bothUp" seed={2} />
          </Abs>
        </>
      );
    }
    case "artemis": {
      // A: 2022, NASA did it again — rocket rises (lf 0–76)
      // B: a thousand new seeds (76–138) | C: grandchildren growing, park near you (138–end)
      if (lf < 76) {
        const rocketY = interpolate(lf, [0, 76], [1250, 300]);
        return (
          <>
            <PushIn dur={76}><SpacePlate /></PushIn>
            <Abs left={64} top={170}><Badge color="#e8634a">2022 • ARTEMIS I</Badge></Abs>
            <Abs left={440} top={rocketY} width={200} height={413}>
              <ArtemisRocket />
            </Abs>
            <Sub top={1560}>NASA did it again…</Sub>
          </>
        );
      }
      if (lf < 138) {
        return (
          <>
            <SpacePlate />
            <Abs left={440} top={400} width={200} height={413}>
              <ArtemisRocket />
            </Abs>
            {lf > 88 && (
              <Abs left={700} top={1000} width={180} height={252} style={{ transform: `scale(${pop((lf - 88) / 8)})` }}>
                <SeedCanister />
              </Abs>
            )}
            <NumberPill
              text="1,000 SEEDS"
              steps={["250 SEEDS", "500 SEEDS", "750 SEEDS", "1,000 SEEDS"]}
              lf={lf} delay={80} size={88} top={1320}
            />
          </>
        );
      }
      return (
        <>
          <PushIn dur={60} to={1.05}><AirfieldPlate /></PushIn>
          <Abs left={340} top={480} width={400} height={700} style={{ transform: `scale(${pop((lf - 138) / 10)})` }}>
            <PineTree />
          </Abs>
          <Abs left={120} top={1100} width={260} height={390}>
            <Crewman shirt="#f5f5f0" expression="happy" mouth={mouth} arm="oneUp" seed={1} />
          </Abs>
          <Abs left={780} top={1150} width={180} height={315}>
            <PineTree />
          </Abs>
          <Sub top={1520} size={56} strong>growing right now — near you</Sub>
        </>
      );
    }
    default:
      return null;
  }
};

export const MoonTreesShort: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const scene = sceneAt(frame);
  const lf = frame - scene.a;
  const dur = scene.b - scene.a;
  return (
    <AbsoluteFill style={{ backgroundColor: "#1d2b4a", overflow: "hidden" }}>
      <style>{FONT_CSS}</style>
      <Scene id={scene.id} lf={lf} dur={dur} t={t} />
      <CaptionOverlay />
    </AbsoluteFill>
  );
};

export { TOTAL };
