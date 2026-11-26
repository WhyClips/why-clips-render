// "Moon Trees — NASA Flew 500 Seeds Around the Moon" — Gullak Tales style Short.
// v3: 22 beats of ~3s each (Azhar 26 Nov 12:33: "Scene har 3 sec baad use kr"),
// hard cuts, chibi SVG cut-out cast, flat plates, infographic number pills,
// bottom-centre karaoke captions, Rhubarb lip-sync.
// Point-to-point: every beat shows exactly what the words say at that moment.
// No title card, no end card, frame 1 mid-action, no intro/like/subscribe
// ask, no summary/moral ending, no watermark.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FPS, TOTAL, SceneId, BeatDef, beatAt, mouthAt, sceneAt, smooth, pop } from "./story";
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

const Scene: React.FC<{ id: SceneId; beat: BeatDef; lf: number; dur: number; t: number }> = ({ id, beat, lf, dur, t }) => {
  const frame = useCurrentFrame();
  const mouth = mouthAt(t);
  const blf = frame - beat.a; // beat-local frame: 0 at every beat cut
  switch (id) {
    case "hook": {
      // H1: canister ECU wide | H2: tight push-in, seeds drift | H3: sprout
      // pops out of the canister + mini White House (words: "one of them at
      // the White House"). Frame 1 mid-action: the seed canister, big, centre.
      const bob = Math.sin(frame * 0.12) * 8;
      if (beat.id === "H3") {
        return (
          <>
            <PushIn dur={dur} to={1.1}><SpacePlate /></PushIn>
            <Abs left={64} top={170}><Badge color="#2f9e44">ONE AT THE WHITE HOUSE</Badge></Abs>
            <Abs left={300} top={480 + bob} width={380} height={532} style={{ transform: `scale(${pop(blf / 8)})` }}>
              <SeedCanister />
            </Abs>
            {/* sprout growing out of the canister top */}
            <Abs left={430} top={330} width={120} height={210} style={{ transform: `scale(${pop(blf / 10)})`, transformOrigin: "50% 100%" }}>
              <PineTree />
            </Abs>
            <Abs left={700} top={1150} width={300} height={180} style={{ transform: `scale(${pop(blf / 10)})` }}>
              <WhiteHouse />
            </Abs>
            <Sub top={1440}>…and the trees still stand today</Sub>
          </>
        );
      }
      if (beat.id === "H2") {
        return (
          <>
            <PushIn dur={dur} to={1.14}><SpacePlate /></PushIn>
            {lf > 10 && (
              <Abs left={64} top={170}><Badge>1971 • NASA</Badge></Abs>
            )}
            <Abs left={300} top={470 + bob} width={420} height={588} style={{ transform: `scale(${pop(blf / 8)})` }}>
              <SeedCanister />
            </Abs>
            <Abs left={0} top={0} width={1080} height={1920}>
              <svg viewBox="0 0 1080 1920" width="100%" height="100%">
                {[
                  { x: 280, y: 600, s: 1.3 }, { x: 820, y: 660, s: 1.1 }, { x: 240, y: 1000, s: 1.2 },
                  { x: 860, y: 1040, s: 1.4 }, { x: 540, y: 380, s: 1.0 },
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
            <Sub top={1440}>…and the trees still stand today</Sub>
          </>
        );
      }
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
        // A2 beat: moonwalk CLOSE-UP — bigger astronauts, swapped arms (new pose)
        const closeUp = beat.id === "A2";
        return (
          <>
            {closeUp ? <PushIn dur={90} to={1.16}><MoonPlate /></PushIn> : <MoonPlate />}
            <Abs left={64} top={250}><Badge>TWO ON THE MOON</Badge></Abs>
            <Abs left={closeUp ? 120 : 180} top={closeUp ? 900 : 950} width={closeUp ? 340 : 300} height={closeUp ? 510 : 450} style={{ transform: `translateY(${Math.sin(frame * 0.15) * 6}px)` }}>
              <Astronaut patch="#e8634a" expression="happy" mouth="closed" arm={closeUp ? "down" : "oneUp"} />
            </Abs>
            <Abs left={closeUp ? 620 : 620} top={closeUp ? 930 : 980} width={closeUp ? 340 : 300} height={closeUp ? 510 : 450} style={{ transform: `translateY(${Math.cos(frame * 0.13) * 6}px)` }}>
              <Astronaut patch="#4a6fa5" expression="happy" mouth="closed" arm={closeUp ? "oneUp" : "down"} />
            </Abs>
            <Sub top={1480}>walking on the Moon…</Sub>
          </>
        );
      }
      // Roosa alone in orbit. A3 beat: THINKING pose (chin, think) + canister
      // mirrored to the LEFT — a visibly different shot from A2's pointing
      // Roosa. A4 beat: CLOSE-UP — Crewman cheers (bothUp, happy), canister
      // big at right.
      const cheering = beat.id === "A4";
      const thinking = beat.id === "A3";
      return (
        <>
          <SpacePlate />
          <Abs left={cheering ? 170 : thinking ? 150 : 220} top={cheering ? 280 : thinking ? 340 : 300} width={cheering ? 880 : thinking ? 860 : 800} height={cheering ? 550 : thinking ? 538 : 500}>
            <OrbitDiagram />
          </Abs>
          {lf > 217 && (
            <Abs left={64} top={170}><Badge color="#2f9e44">EX-FOREST FIREFIGHTER</Badge></Abs>
          )}
          {lf <= 217 && (
            <Abs left={64} top={170}><Badge>STUART ROOSA</Badge></Abs>
          )}
          <Abs left={cheering ? 340 : thinking ? 420 : 390} top={cheering ? 900 : 950} width={cheering ? 340 : 300} height={cheering ? 510 : 450}>
            <Crewman shirt="#f5f5f0" expression={cheering ? "happy" : thinking ? "think" : "calm"} mouth={mouth} arm={cheering ? "bothUp" : thinking ? "chin" : "point"} seed={1} />
          </Abs>
          {lf > 161 && (
            <Abs left={cheering ? 720 : thinking ? 120 : 700} top={cheering ? 1080 : 1150} width={cheering ? 190 : 150} height={cheering ? 266 : 210} style={{ transform: `scale(${pop((lf - 161) / 8)})` }}>
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
        // O2 beat: orbit diagram BIG (fills the frame) — new shot vs O1's
        // chalk-text shot. Sub shortened to one line (v2 fix): the old
        // "…while astronauts took the glory" wrapped to 2 lines and its pill
        // overlapped the karaoke caption ("glory" over "glory").
        const big = beat.id === "O2";
        return (
          <>
            <SpacePlate />
            <Abs left={big ? 140 : 220} top={big ? 320 : 360} width={big ? 880 : 800} height={big ? 550 : 500}>
              <OrbitDiagram />
            </Abs>
            <NumberPill text="34 ORBITS" lf={lf} delay={61} size={104} top={1020} />
            <Sub top={1300}>looped around it — 34 times</Sub>
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
          {/* O3 beat: spill pile BIG + agent SCARED (new pose/expression) */}
          <Abs left={beat.id === "O3" ? 190 : 240} top={beat.id === "O3" ? 660 : 700} width={beat.id === "O3" ? 700 : 600} height={beat.id === "O3" ? 308 : 264}>
            <SeedPile />
          </Abs>
          <Abs left={390} top={1050} width={300} height={450}>
            <Agent expression={beat.id === "O3" ? "scared" : "worried"} mouth={mouth} arm={beat.id === "O3" ? "bothUp" : "down"} />
          </Abs>
          <Sub top={1560} size={46}>everyone thought it was over</Sub>
        </>
      );
    }
    case "sprout": {
      // A: planted anyway, Mississippi + California (lf 0–102)
      // B: 420 seedlings, stubborn as weeds (102–end). Flip at lf 102
      // (= f922, the S1/S2 beat cut) so no beat starts with a sliver of the
      // other sub-phase.
      // S2 beat: DENSER trays (8 + 9 sprouts vs 6 + 7) — visibly fuller.
      if (lf < 102) {
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
      const dense = beat.id === "S2";
      return (
        <>
          <InteriorPlate />
          <Abs left={64} top={250}><Badge color="#2f9e44">ALMOST EVERY ONE SPROUTED</Badge></Abs>
          <Abs left={dense ? 180 : 240} top={dense ? 600 : 640} width={dense ? 720 : 600} height={dense ? 360 : 300}>
            <SeedlingTray sprouts={dense ? 8 : 6} />
          </Abs>
          <Abs left={dense ? 140 : 190} top={dense ? 960 : 980} width={dense ? 800 : 700} height={dense ? 400 : 350}>
            <SeedlingTray sprouts={dense ? 9 : 7} />
          </Abs>
          <NumberPill text="420 SEEDLINGS" lf={lf} delay={112} size={76} top={1400} />
        </>
      );
    }
    case "states": {
      // A: 200th birthday, every state (lf 0–78) | B: Philadelphia planting (78–147)
      // C: White House pine, Brazil + Japan (147–end)
      if (lf < 78) {
        // T1 beat: FIVE pines across the frame (vs three) — fuller shot.
        return (
          <>
            <ChalkPlate />
            <Abs left={64} top={250}><Badge color="#e8634a">AMERICA'S 200th BIRTHDAY</Badge></Abs>
            <NumberPill text="50 STATES" lf={lf} delay={56} size={110} top={620} />
            <Abs left={60} top={1200} width={170} height={300}>
              <PineTree />
            </Abs>
            <Abs left={280} top={1130} width={200} height={350}>
              <PineTree />
            </Abs>
            <Abs left={440} top={1100} width={200} height={350}>
              <PineTree />
            </Abs>
            <Abs left={620} top={1130} width={200} height={350}>
              <PineTree />
            </Abs>
            <Abs left={830} top={1200} width={170} height={300}>
              <PineTree />
            </Abs>
            <Sub top={1560}>the baby trees went to every state</Sub>
          </>
        );
      }
      if (lf < 147) {
        // T2 beat: Philly pine BIG + planter cheering (bothUp).
        const big = beat.id === "T2";
        return (
          <>
            <PushIn dur={90}><AirfieldPlate /></PushIn>
            <Abs left={64} top={250}><Badge>PHILADELPHIA • MAY 1975</Badge></Abs>
            <Abs left={180} top={950} width={290} height={435}>
              <Crewman shirt="#f5f5f0" expression="happy" mouth={mouth} arm={big ? "bothUp" : "oneUp"} seed={1} />
            </Abs>
            <Abs left={big ? 410 : 440} top={big ? 700 : 750} width={big ? 260 : 200} height={big ? 455 : 350} style={{ transform: `scale(${pop((lf - 78) / 8)})` }}>
              <PineTree />
            </Abs>
            <Abs left={700} top={950} width={290} height={435}>
              <Crewman shirt="#7ec8f0" expression="happy" mouth="closed" arm="down" seed={2} />
            </Abs>
            <Sub top={1480} size={56} strong>first planting: Philadelphia</Sub>
          </>
        );
      }
      // T3 beat: second crewman joins, waving at the White House pine.
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
          <Abs left={780} top={1020} width={240} height={360}>
            <Crewman shirt="#2f9e44" expression="happy" mouth="closed" arm="oneUp" seed={2} />
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
        // U2 beat: teacher ASKS — both arms up, speech bubble BIG.
        const big = beat.id === "U2";
        return (
          <>
            <InteriorPlate />
            <Abs left={64} top={250}><Badge>A SCHOOLTEACHER ASKED</Badge></Abs>
            <Abs left={150} top={1180} width={240} height={360}>
              <Crewman shirt="#f2c14e" expression="think" mouth={mouth} arm={big ? "bothUp" : "oneUp"} seed={1} />
            </Abs>
            <Abs left={big ? 440 : 480} top={big ? 1080 : 1150} width={big ? 560 : 480}>
              <SpeechBubble size={big ? 50 : 44} delay={4} tail="left">Where are the Moon Trees?</SpeechBubble>
            </Abs>
            <Sub top={1560}>…asked NASA where they were</Sub>
          </>
        );
      }
      if (lf < 166) {
        // U3 beat: clippings ZOOMED (fills the frame) — new shot vs U2.
        const zoom = beat.id === "U3";
        return (
          <>
            <QuarantinePlate />
            <Abs left={64} top={170}><Badge color="#2f9e44">THE HUNT</Badge></Abs>
            <Abs left={zoom ? 140 : 190} top={zoom ? 480 : 560} width={zoom ? 800 : 700} height={zoom ? 526 : 460}>
              <NewspaperClippings />
            </Abs>
            <Abs left={390} top={1120} width={290} height={435}>
              <Crewman shirt="#2f9e44" expression="think" mouth={mouth} arm="chin" seed={2} />
            </Abs>
          </>
        );
      }
      // U4 beat: 110 FOUND — crewman CELEBRATES (bothUp, happy), clippings
      // smaller behind the number.
      // U4 beat: a DIFFERENT "110 FOUND" shot from U3 — the pill moves to
      // the bottom, the crewman moves right, and the souvenir PINE appears
      // (words: "longest-living souvenirs"). Without this, U3→U4 would be
      // the same composition (the sub-phase flips at f1418, inside U3).
      if (beat.id === "U4") {
        return (
          <>
            <QuarantinePlate />
            <Abs left={190} top={560} width={700} height={460}>
              <NewspaperClippings />
            </Abs>
            <Abs left={140} top={880} width={240} height={420}>
              <PineTree />
            </Abs>
            <Abs left={800} top={1150} width={240} height={360}>
              <Crewman shirt="#2f9e44" expression="happy" mouth={mouth} arm="bothUp" seed={2} />
            </Abs>
            <NumberPill text="110 FOUND" lf={lf} delay={166} size={110} top={1300} />
          </>
        );
      }
      return (
        <>
          <QuarantinePlate />
          <NumberPill text="110 FOUND" lf={lf} delay={166} size={110} top={560} />
          <Abs left={220} top={800} width={640} height={421}>
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
        // R2 beat: canister BIG beside the rocket (new seeds, front + centre).
        const big = beat.id === "R2";
        return (
          <>
            <SpacePlate />
            <Abs left={440} top={400} width={200} height={413}>
              <ArtemisRocket />
            </Abs>
            {lf > 88 && (
              <Abs left={big ? 660 : 700} top={big ? 940 : 1000} width={big ? 230 : 180} height={big ? 322 : 252} style={{ transform: `scale(${pop((lf - 88) / 8)})` }}>
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
      // R3 beat (final): pine BIG + Roosa cheering. v2 fix: NO Sub line here —
      // the Sub pill + karaoke caption pill showed together in v2's final
      // frame; now only the karaoke caption speaks the last words.
      return (
        <>
          <PushIn dur={60} to={1.05}><AirfieldPlate /></PushIn>
          <Abs left={300} top={420} width={480} height={840} style={{ transform: `scale(${pop((lf - 138) / 10)})` }}>
            <PineTree />
          </Abs>
          <Abs left={120} top={1100} width={260} height={390}>
            <Crewman shirt="#f5f5f0" expression="happy" mouth={mouth} arm="oneUp" seed={1} />
          </Abs>
          <Abs left={780} top={1150} width={180} height={315}>
            <PineTree />
          </Abs>
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
  const beat = beatAt(frame);
  const lf = frame - scene.a;
  const dur = scene.b - scene.a;
  // Beat camera: a hard reframe at every ~3s beat cut (v3). The transform
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
