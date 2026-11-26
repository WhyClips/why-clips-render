// "Moon Trees — NASA Flew 500 Seeds Around the Moon" — Gullak Tales style Short.
// v4: re-cut to the NEW script (196 words, slower VO 59.668s, 197.1 WPM) —
// hook rewritten (shocking: "believed dead" → "one stands at the White House"),
// 22 beats re-timed (hook 0–212, apollo14 212–449, orbits 449–878, sprout
// 878–1088, states 1088–1307, hunt 1307–1560, artemis 1560–1800), Subs and
// number-pill anchors re-aligned to the new Whisper token times.
// NOTE (v4): the slower VO deliberately has natural sentence pauses 0.4–0.82s
// throughout — this OVERRIDES the old fast-VO "max ONE pause >0.4s" rule.
// Do not "fix" the pauses; they are the slower feel Azhar asked for.
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
            <Sub top={1440}>one stands at the White House</Sub>
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
            <Sub top={1440}>NASA thought they were all dead</Sub>
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
          <Sub top={1440}>500 seeds flew around the Moon</Sub>
        </>
      );
    }
    case "apollo14": {
      // v4 sub-phases (scene lf = frame − 212):
      // A1 launch (lf 0–85) | A2 moonwalk close-up (85–101) → Roosa pointing
      // (101–151, "circled" starts lf 101) | A3 Roosa THINKING + canister +
      // ex-firefighter badge (151–end, "former" starts lf 151).
      if (lf < 85) {
        const rocketY = interpolate(lf, [0, 85], [1250, 250]);
        return (
          <>
            <PushIn dur={85}><LaunchPadPlate /></PushIn>
            <Abs left={64} top={250}><Badge>APOLLO 14 • JAN 1971</Badge></Abs>
            <Abs left={440} top={rocketY} width={200} height={413}>
              <SaturnRocket />
            </Abs>
            <Sub top={1560}>up it goes…</Sub>
          </>
        );
      }
      if (lf < 101) {
        // A2 beat, first half: moonwalk CLOSE-UP — bigger astronauts, swapped arms (new pose)
        return (
          <>
            <PushIn dur={90} to={1.16}><MoonPlate /></PushIn>
            <Abs left={64} top={250}><Badge>TWO ON THE MOON</Badge></Abs>
            <Abs left={120} top={900} width={340} height={510} style={{ transform: `translateY(${Math.sin(frame * 0.15) * 6}px)` }}>
              <Astronaut patch="#e8634a" expression="happy" mouth="closed" arm="down" />
            </Abs>
            <Abs left={620} top={930} width={340} height={510} style={{ transform: `translateY(${Math.cos(frame * 0.13) * 6}px)` }}>
              <Astronaut patch="#4a6fa5" expression="happy" mouth="closed" arm="oneUp" />
            </Abs>
            <Sub top={1480}>walking on the Moon…</Sub>
          </>
        );
      }
      // Roosa alone in orbit. A3 beat: THINKING pose (chin, think) + canister
      // mirrored to the LEFT + EX-FOREST FIREFIGHTER badge — a visibly
      // different shot from A2's pointing Roosa. A2 tail (lf 101–151): Roosa
      // POINTING with the STUART ROOSA badge; canister pops in A3 at lf 180
      // ("carrying a tiny canister" starts lf 182).
      const thinking = beat.id === "A3";
      return (
        <>
          <SpacePlate />
          <Abs left={thinking ? 150 : 220} top={thinking ? 340 : 300} width={thinking ? 860 : 800} height={thinking ? 538 : 500}>
            <OrbitDiagram />
          </Abs>
          {thinking ? (
            <Abs left={64} top={170}><Badge color="#2f9e44">EX-FOREST FIREFIGHTER</Badge></Abs>
          ) : (
            <Abs left={64} top={170}><Badge>STUART ROOSA</Badge></Abs>
          )}
          <Abs left={thinking ? 420 : 390} top={950} width={300} height={450}>
            <Crewman shirt="#f5f5f0" expression={thinking ? "think" : "calm"} mouth={mouth} arm={thinking ? "chin" : "point"} seed={1} />
          </Abs>
          {thinking && lf > 180 && (
            <Abs left={120} top={1150} width={150} height={210} style={{ transform: `scale(${pop((lf - 180) / 8)})` }}>
              <SeedCanister />
            </Abs>
          )}
          <Sub top={1480}>circled alone above them</Sub>
        </>
      );
    }
    case "orbits": {
      // v4 sub-phases (scene lf = frame − 449):
      // O1 chalk NEVER TOUCHED (lf 0–45) → orbit diagram + "34 ORBITS" pill
      // (45–89, "34" starts lf 65) | O2 big orbit diagram + Sub (89–149) →
      // capsule falls (149–186, "Then splashdown" starts lf 149) | O3 capsule
      // keeps falling (186–208) → BURST! (208–271, "burst" starts lf 208) |
      // O4 MIXED LIKE SALT (271–346) | O5 written off as dead (346–end).
      if (lf < 45) {
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
            <Sub top={1240}>never touched the Moon</Sub>
          </>
        );
      }
      if (lf < 89) {
        // O1 tail: "They looped around it 34 times" — orbit diagram + pill
        // pops exactly on "34" (lf 65). The pill also stays up through O2's
        // first half (same delay), so it reads for ~2.8s, not a 0.8s flash.
        return (
          <>
            <SpacePlate />
            <Abs left={220} top={360} width={800} height={500}>
              <OrbitDiagram />
            </Abs>
            <NumberPill text="34 ORBITS" lf={lf} delay={65} size={104} top={1020} />
          </>
        );
      }
      if (lf < 149) {
        // O2 beat, first half: orbit diagram BIG (fills the frame) — new shot
        // vs O1's small diagram. Sub is one line (v2 fix): the old two-line
        // Sub overlapped the karaoke caption.
        return (
          <>
            <SpacePlate />
            <Abs left={140} top={320} width={880} height={550}>
              <OrbitDiagram />
            </Abs>
            <NumberPill text="34 ORBITS" lf={lf} delay={65} size={104} top={1020} />
            <Sub top={1300}>looped around it — 34 times</Sub>
          </>
        );
      }
      if (lf < 186) {
        // O2 tail: capsule falls ("Then splashdown shattered everything").
        const capY = interpolate(lf, [149, 186], [250, 780]);
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
      if (lf < 208) {
        // O3 head: capsule keeps falling through the beat cut into the
        // 0.72s pause after "everything." — BURST lands on the word "burst".
        const capY = interpolate(lf, [186, 208], [780, 1050]);
        return (
          <>
            <SeaPlate />
            <Abs left={64} top={250}><Badge>SPLASHDOWN</Badge></Abs>
            <Abs left={340} top={capY} width={400} height={400}>
              <Capsule />
            </Abs>
          </>
        );
      }
      if (lf < 271) {
        // O3: BURST! at lf 208 ("burst," 22.38s)
        return (
          <>
            <SeaPlate />
            <Abs left={0} top={420} width={1080}>
              <ChalkText size={120} color="#ffd93b">BURST!</ChalkText>
            </Abs>
            <Abs left={240} top={900} width={600} height={264} style={{ transform: `scale(${pop((lf - 208) / 8)})` }}>
              <SeedPile />
            </Abs>
            <Sub top={1300} size={56} strong>the canisters burst open</Sub>
          </>
        );
      }
      if (lf < 346) {
        // O4: mixed like salt, ruined — chalk carries the line, so no Sub
        // (avoids a second pill over the caption). Agent SCARED, pile BIG.
        return (
          <>
            <ChalkPlate />
            <Abs left={0} top={380} width={1080}>
              <ChalkText size={72} color="#ffd93b">MIXED LIKE SALT</ChalkText>
            </Abs>
            <Abs left={190} top={660} width={700} height={308}>
              <SeedPile />
            </Abs>
            <Abs left={390} top={1050} width={300} height={450}>
              <Agent expression="scared" mouth={mouth} arm="bothUp" />
            </Abs>
          </>
        );
      }
      // O5: written off as dead — faded pile + big red X, Sub carries the line.
      // No agent here (O4 already has one; keeps the Sub pill clear).
      return (
        <>
          <ChalkPlate />
          <Abs left={240} top={700} width={600} height={264} style={{ opacity: 0.5 }}>
            <SeedPile />
          </Abs>
          <Abs left={340} top={760} width={400} height={400}>
            <RedX size={400} delay={4} />
          </Abs>
          <Sub top={1480} size={56} strong>written off as dead</Sub>
        </>
      );
    }
    case "sprout": {
      // v4 (scene lf = frame − 878):
      // S1 planted anyway, Mississippi + California (lf 0–100) |
      // S2 dense trays + "420 SEEDLINGS" pill (lf 100–end). The pill pops on
      // "420" (lf 88, inside S1's tail) so it is already up at the S2 cut.
      // MID-BEAT FLIP at lf 152 (f1030, "stubborn"): badge swaps to the orange
      // AFTER A WILDFIRE badge, trays reframe bigger, and the Sub "stubborn
      // as weeds" appears — so S2 (110f) never holds one composition >3.5s.
      if (lf < 100) {
        // No "420 SEEDLINGS" pill here: it would cross the crewman, and the
        // word "420" (f966–978) ends exactly at the S2 cut — the pill pops
        // at the cut, the same ~12f-after-word-start pattern v3 used.
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
      const wild = lf >= 152;
      return (
        <>
          <InteriorPlate />
          <Abs left={64} top={250}>
            <Badge color={wild ? "#e8634a" : "#2f9e44"}>
              {wild ? "AFTER A WILDFIRE" : "ALMOST EVERY ONE SPROUTED"}
            </Badge>
          </Abs>
          <Abs left={wild ? 140 : 180} top={wild ? 560 : 600} width={wild ? 800 : 720} height={wild ? 400 : 360}>
            <SeedlingTray sprouts={8} />
          </Abs>
          <Abs left={wild ? 100 : 140} top={wild ? 940 : 960} width={wild ? 880 : 800} height={wild ? 440 : 400}>
            <SeedlingTray sprouts={9} />
          </Abs>
          <NumberPill text="420 SEEDLINGS" lf={lf} delay={88} size={76} top={1400} />
          {wild && (
            <Sub top={1560} size={56} strong>stubborn as weeds</Sub>
          )}
        </>
      );
    }
    case "states": {
      // v4 (scene lf = frame − 1088):
      // T1 200th birthday, every state (lf 0–73) | T2 Philadelphia planting
      // (73–154, "First" starts lf 89) | C: White House pine (154–end).
      // "50" is spoken at lf 59, inside T1 — pill delay 59.
      if (lf < 73) {
        // T1 beat: FIVE pines across the frame (vs three) — fuller shot.
        return (
          <>
            <ChalkPlate />
            <Abs left={64} top={250}><Badge color="#e8634a">AMERICA'S 200th BIRTHDAY</Badge></Abs>
            <NumberPill text="50 STATES" lf={lf} delay={59} size={110} top={620} />
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
      if (lf < 154) {
        // T2 beat: Philly pine BIG + planter cheering (bothUp).
        return (
          <>
            <PushIn dur={90}><AirfieldPlate /></PushIn>
            <Abs left={64} top={250}><Badge>PHILADELPHIA • MAY 1975</Badge></Abs>
            <Abs left={180} top={950} width={290} height={435}>
              <Crewman shirt="#f5f5f0" expression="happy" mouth={mouth} arm="bothUp" seed={1} />
            </Abs>
            <Abs left={410} top={700} width={260} height={455} style={{ transform: `scale(${pop((lf - 73) / 8)})` }}>
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
      // v4 (scene lf = frame − 1307):
      // U1 forgotten (lf 0–101) | U2 schoolteacher asks NASA (101–163,
      // "where are they?" starts lf 101) | U3 scientist + clippings (163–end,
      // "110" starts lf 212 — pill pops exactly on it).
      if (lf < 101) {
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
      if (lf < 163) {
        // U2 beat: teacher ASKS — both arms up, speech bubble BIG.
        return (
          <>
            <InteriorPlate />
            <Abs left={64} top={250}><Badge>A SCHOOLTEACHER ASKED</Badge></Abs>
            <Abs left={150} top={1180} width={240} height={360}>
              <Crewman shirt="#f2c14e" expression="think" mouth={mouth} arm="bothUp" seed={1} />
            </Abs>
            <Abs left={440} top={1080} width={560}>
              <SpeechBubble size={50} delay={4} tail="left">Where are the Moon Trees?</SpeechBubble>
            </Abs>
            <Sub top={1560}>…asked NASA where they were</Sub>
          </>
        );
      }
      // U3 beat: clippings ZOOMED (fills the frame) — new shot vs U2.
      // "110 FOUND" pill pops at lf 212 ("110" 50.62s), 49f into the beat,
      // so the beat has two distinct looks (clippings, then clippings + pill).
      return (
        <>
          <QuarantinePlate />
          <Abs left={64} top={170}><Badge color="#2f9e44">THE HUNT</Badge></Abs>
          <Abs left={140} top={480} width={800} height={526}>
            <NewspaperClippings />
          </Abs>
          <NumberPill text="110 FOUND" lf={lf} delay={212} size={110} top={560} />
          <Abs left={390} top={1120} width={290} height={435}>
            <Crewman shirt="#2f9e44" expression="think" mouth={mouth} arm="chin" seed={2} />
          </Abs>
        </>
      );
    }
    case "artemis": {
      // v4 (scene lf = frame − 1560):
      // R1 2022, NASA did it again — rocket rises (lf 0–73) |
      // R2 a thousand new seeds (73–156, "thousand" starts lf 101) |
      // R3 grandchildren growing, park near you (156–end).
      if (lf < 73) {
        const rocketY = interpolate(lf, [0, 73], [1250, 300]);
        return (
          <>
            <PushIn dur={73}><SpacePlate /></PushIn>
            <Abs left={64} top={170}><Badge color="#e8634a">2022 • ARTEMIS I</Badge></Abs>
            <Abs left={440} top={rocketY} width={200} height={413}>
              <ArtemisRocket />
            </Abs>
            <Sub top={1560}>NASA did it again…</Sub>
          </>
        );
      }
      if (lf < 156) {
        // R2 beat: canister BIG beside the rocket (new seeds, front + centre).
        // Canister pops at lf 96 ("a" just before "thousand"), pill counts up
        // from lf 101 ("thousand" 55.36s).
        return (
          <>
            <SpacePlate />
            <Abs left={440} top={400} width={200} height={413}>
              <ArtemisRocket />
            </Abs>
            {lf > 96 && (
              <Abs left={660} top={940} width={230} height={322} style={{ transform: `scale(${pop((lf - 96) / 8)})` }}>
                <SeedCanister />
              </Abs>
            )}
            <NumberPill
              text="1,000 SEEDS"
              steps={["250 SEEDS", "500 SEEDS", "750 SEEDS", "1,000 SEEDS"]}
              lf={lf} delay={101} size={88} top={1320}
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
          <Abs left={300} top={420} width={480} height={840} style={{ transform: `scale(${pop((lf - 156) / 10)})` }}>
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
