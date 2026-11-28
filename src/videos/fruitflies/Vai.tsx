// "The Man Who Dreamed an Alphabet" (Vai script, Liberia 1833) —
// Gullak Tales style Short. 194 words, Casper speed 108 atempo-stretched
// to 59.195 s, 196.6 WPM, last word ends 58.76 s. 7 scenes, 25 beats,
// hard cuts, word-anchored. The VO keeps its natural sentence pauses —
// the slower feel, same as Moon Trees v4 / Segway.
// Point-to-point: every beat shows exactly what the words say at that moment.
// No title card, no end card, frame 1 mid-action, no intro/like/subscribe
// ask, no summary/moral ending, no watermark.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FPS, TOTAL, SceneId, BeatDef, beatAt, mouthAt, sceneAt, smooth, pop } from "./story";
import { FONT_CSS, FONT_FAMILY } from "./fonts";
import {
  Chibi, Agent, Boss, OUTLINE,
} from "./characters";
import {
  ChalkPlate, InteriorPlate, StormPlate,
} from "./plates";
import {
  Globe, EnvelopeStack, Lightbulb,
} from "./props";
import {
  Bukele, OldBukele, FamilyMember,
  GlyphTile, GlyphGrid, DreamCloud,
  NightPlate, VillagePlate,
  BerryInk, Schoolhouse, MapLiberia, PhoneUnicode, Flame, University, Diary, UnreadLetter,
} from "./props-vai";
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
 *  on light plates too (day sky, village, tan floor). */
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

/** Floating "Zzz" above a sleeper. */
const Zzz: React.FC<{ left: number; top: number }> = ({ left, top }) => (
  <Abs left={left} top={top} width={200} height={120}>
    {["Z", "Z", "Z"].map((z, i) => (
      <span
        key={i}
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 700,
          fontSize: 64 - i * 8,
          color: "#ffd93b",
          textShadow: "0 4px 0 rgba(0,0,0,0.4)",
          marginRight: 8,
          display: "inline-block",
          transform: `scale(${pop((i * 8) / 8)})`,
        }}
      >
        {z}
      </span>
    ))}
  </Abs>
);

const Scene: React.FC<{ id: SceneId; beat: BeatDef; lf: number; dur: number; t: number }> = ({ id, beat, lf, dur, t }) => {
  const frame = useCurrentFrame();
  const mouth = mouthAt(t);
  const blf = frame - beat.a; // beat-local frame: 0 at every beat cut
  switch (id) {
    case "hook": {
      // H1 dreaming, glyphs swirl | H2 by morning, language can be written.
      if (beat.id === "H2") {
        const sunY = interpolate(blf, [0, 77], [420, 170]);
        return (
          <>
            <PushIn dur={dur} to={1.1}><NightPlate /></PushIn>
            <Abs left={470} top={sunY} width={140} height={140}>
              <svg viewBox="0 0 140 140" width="100%" height="100%">
                <circle cx={70} cy={70} r={62} fill="#ffd93b" stroke={OUTLINE} strokeWidth={6} />
                <circle cx={70} cy={70} r={76} fill="none" stroke="#ffd93b" strokeWidth={5} opacity={0.4} />
              </svg>
            </Abs>
            <Abs left={180} top={520} width={720} height={430}>
              <GlyphGrid rows={3} cols={5} size={120} gap={16} delayStep={3} />
            </Abs>
            <Abs left={390} top={1080} width={300} height={450}>
              <Bukele expression="happy" mouth={mouth} arm="oneUp" seed={1} />
            </Abs>
            <Sub top={1560} size={44}>by morning, his language could be written</Sub>
          </>
        );
      }
      // H1: frame 1 mid-action — Bukele asleep under a dream cloud of glyphs.
      return (
        <>
          <PushIn dur={dur}><NightPlate /></PushIn>
          <Abs left={220} top={170} width={640} height={300}>
            <DreamCloud tiles={[0, 2, 5, 1]} />
          </Abs>
          <Abs left={120} top={620} width={110} height={110}>
            <GlyphTile g={3} size={110} rotate={-8} delay={24} />
          </Abs>
          <Abs left={860} top={660} width={110} height={110}>
            <GlyphTile g={6} size={110} rotate={7} delay={34} />
          </Abs>
          <Abs left={330} top={1280} width={420} height={60} style={{ backgroundColor: "#c98a4b", border: `6px solid ${OUTLINE}`, borderRadius: 30 }}><div /></Abs>
          <Abs left={390} top={880} width={300} height={450} style={{ transform: "rotate(-5deg)", transformOrigin: "50% 100%" }}>
            <Bukele expression="calm" mouth="closed" arm="down" seed={1} />
          </Abs>
          <Zzz left={700} top={800} />
          <Sub top={1440}>a man who couldn&apos;t read or write</Sub>
        </>
      );
    }
    case "setup": {
      // S1 1833 + Liberia map | S2 can't read a single word.
      if (beat.id === "S2") {
        return (
          <>
            <PushIn dur={dur} to={1.08}><VillagePlate /></PushIn>
            <Abs left={350} top={480} width={380} height={470} style={{ transform: "rotate(-4deg)" }}>
              <UnreadLetter />
            </Abs>
            <Abs left={120} top={1150} width={300} height={450}>
              <Bukele expression="worried" mouth={mouth} arm="chin" seed={1} />
            </Abs>
            <Abs left={720} top={980} width={220} height={160}>
              <SpeechBubble size={72}>?</SpeechBubble>
            </Abs>
            <Sub top={1560}>can&apos;t read a single word</Sub>
          </>
        );
      }
      return (
        <>
          <PushIn dur={dur}><VillagePlate /></PushIn>
          <Abs left={64} top={170}><Badge>LIBERIA • WEST AFRICA</Badge></Abs>
          <NumberPill
            text="1833"
            steps={["1800", "1833"]}
            lf={lf} delay={10} size={100} top={380}
          />
          <Abs left={180} top={640} width={540} height={432}>
            <MapLiberia />
          </Abs>
          <Abs left={800} top={1100} width={200} height={300}>
            <Bukele expression="calm" mouth={mouth} arm="down" seed={1} />
          </Abs>
          <Sub top={1440}>Momolu Duwalu Bukele</Sub>
        </>
      );
    }
    case "dream": {
      // D1 stranger teaches signs | D2 he wakes, signs gone | D3 idea stays.
      if (beat.id === "D3") {
        return (
          <>
            <PushIn dur={dur} to={1.08}><VillagePlate /></PushIn>
            <Abs left={390} top={950} width={300} height={450}>
              <Bukele expression="think" mouth={mouth} arm="chin" seed={1} />
            </Abs>
            <Abs left={700} top={680} width={160} height={200} style={{ transform: `scale(${pop(blf / 10)})` }}>
              <Lightbulb />
            </Abs>
            <Sub top={1440}>but the idea stays</Sub>
          </>
        );
      }
      if (beat.id === "D2") {
        // the three dream signs fade away as he wakes
        const fade = interpolate(blf, [0, 60], [1, 0]);
        const rise = blf * 1.5;
        return (
          <>
            <PushIn dur={dur} to={1.1}><NightPlate /></PushIn>
            <Abs left={390} top={900} width={300} height={450}>
              <Bukele expression="worried" mouth={mouth} arm="oneUp" seed={1} />
            </Abs>
            <div style={{ opacity: fade }}>
              <Abs left={180} top={480 - rise} width={130} height={130}>
                <GlyphTile g={0} size={130} rotate={-6} />
              </Abs>
              <Abs left={475} top={420 - rise} width={130} height={130}>
                <GlyphTile g={2} size={130} rotate={4} />
              </Abs>
              <Abs left={770} top={480 - rise} width={130} height={130}>
                <GlyphTile g={5} size={130} rotate={8} />
              </Abs>
            </div>
            <Sub top={1440}>the signs are gone</Sub>
          </>
        );
      }
      // D1: the stranger in the dream, pointing at the signs.
      return (
        <>
          <PushIn dur={dur}><NightPlate /></PushIn>
          <Abs left={640} top={700} width={320} height={480}>
            <Chibi
              skin="#c9a86a" hair="#e8e8e8" hairStyle="neat"
              jacket="#4a6fa5" jacketDark="#37557e" trousers="#3a3a4d"
              expression="calm" mouth={mouth} arm="point" seed={7}
            />
          </Abs>
          <Abs left={140} top={950} width={300} height={450} style={{ transform: "rotate(-5deg)", transformOrigin: "50% 100%" }}>
            <Bukele expression="calm" mouth="closed" arm="down" seed={1} />
          </Abs>
          <Zzz left={420} top={880} />
          <Abs left={180} top={480} width={130} height={130}>
            <GlyphTile g={0} size={130} rotate={-6} delay={5} />
          </Abs>
          <Abs left={475} top={420} width={130} height={130}>
            <GlyphTile g={2} size={130} rotate={4} delay={15} />
          </Abs>
          <Abs left={770} top={480} width={130} height={130}>
            <GlyphTile g={5} size={130} rotate={8} delay={25} />
          </Abs>
          <Sub top={1440}>a stranger teaches him signs</Sub>
        </>
      );
    }
    case "invent": {
      // I1 gathers family | I2 invent 200 symbols | I3 one per syllable.
      if (beat.id === "I3") {
        return (
          <>
            <PushIn dur={dur} to={1.08}><VillagePlate /></PushIn>
            <Abs left={64} top={170}><Badge>ONE SYMBOL PER SYLLABLE</Badge></Abs>
            <Abs left={410} top={560} width={260} height={260}>
              <GlyphTile g={3} size={260} rotate={-4} delay={4} />
            </Abs>
            <Abs left={150} top={1100} width={300} height={450}>
              <Bukele expression="happy" mouth={mouth} arm="point" seed={1} />
            </Abs>
            <Sub top={1560}>one for every syllable of Vai</Sub>
          </>
        );
      }
      if (beat.id === "I2") {
        return (
          <>
            <PushIn dur={dur} to={1.1}><VillagePlate /></PushIn>
            <Abs left={180} top={420} width={720} height={430}>
              <GlyphGrid rows={3} cols={5} size={120} gap={16} delayStep={2} />
            </Abs>
            <NumberPill text="200 SYMBOLS" lf={lf} delay={12} size={96} top={980} />
            <Abs left={420} top={1300} width={240} height={360}>
              <Bukele expression="happy" mouth={mouth} arm="bothUp" seed={1} />
            </Abs>
          </>
        );
      }
      // I1: Bukele gathers his family; sun + moon = a day and a night.
      return (
        <>
          <PushIn dur={dur}><VillagePlate /></PushIn>
          <Abs left={64} top={170}><Badge>A DAY AND A NIGHT</Badge></Abs>
          <Abs left={880} top={280} width={110} height={110}>
            <svg viewBox="0 0 110 110" width="100%" height="100%">
              <circle cx={55} cy={55} r={44} fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} />
            </svg>
          </Abs>
          <Abs left={720} top={300} width={90} height={90}>
            <svg viewBox="0 0 90 90" width="100%" height="100%">
              <path d="M60,8 A40,40 0 1,0 60,82 A32,32 0 1,1 60,8 Z" fill="#d8d8d8" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
            </svg>
          </Abs>
          <Abs left={390} top={1000} width={300} height={450}>
            <Bukele expression="happy" mouth={mouth} arm="bothUp" seed={1} />
          </Abs>
          <Abs left={120} top={1100} width={240} height={360}>
            <FamilyMember variant={0} expression="happy" mouth={mouth} arm="oneUp" seed={2} />
          </Abs>
          <Abs left={720} top={1100} width={240} height={360}>
            <FamilyMember variant={1} expression="happy" mouth={mouth} arm="oneUp" seed={3} />
          </Abs>
          <Sub top={1560}>he gathers his family</Sub>
        </>
      );
    }
    case "doubt": {
      // O1 outsiders laugh | O2 schools, centuries — not from a dream |
      // O3 glimpsed another alphabet | O4 built this one himself.
      if (beat.id === "O4") {
        return (
          <>
            <PushIn dur={dur} to={1.1}><VillagePlate /></PushIn>
            <Abs left={64} top={170}><Badge color="#2f9e44">HE BUILT IT HIMSELF</Badge></Abs>
            <Abs left={360} top={800} width={360} height={540}>
              <Bukele expression="happy" mouth={mouth} arm="bothUp" seed={1} />
            </Abs>
            <Abs left={465} top={1250} width={150} height={150}>
              <GlyphTile g={3} size={150} rotate={-4} delay={8} bg="#ffd93b" />
            </Abs>
            <Sub top={1560}>nobody disputes he built it himself</Sub>
          </>
        );
      }
      if (beat.id === "O3") {
        return (
          <>
            <ChalkPlate />
            <Abs left={440} top={280} width={200} height={150}>
              <SpeechBubble size={72}>?</SpeechBubble>
            </Abs>
            <Abs left={190} top={500} width={200} height={200}>
              <GlyphTile g={3} size={200} rotate={-5} delay={4} />
            </Abs>
            <Abs left={700} top={500} width={200} height={200}>
              <GlyphTile g={6} size={200} rotate={6} delay={14} bg="#ffe9a8" />
            </Abs>
            <Abs left={360} top={820} width={360} height={80}>
              <svg viewBox="0 0 360 80" width="100%" height="100%" style={{ overflow: "visible" }}>
                <path d="M40,40 L320,40" stroke="#ffd93b" strokeWidth={10} strokeLinecap="round" />
                <path d="M70,16 L30,40 L70,64 Z" fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
                <path d="M290,16 L330,40 L290,64 Z" fill="#ffd93b" stroke={OUTLINE} strokeWidth={5} strokeLinejoin="round" />
              </svg>
            </Abs>
            <Sub top={1440} size={44}>some say he glimpsed another alphabet first</Sub>
          </>
        );
      }
      if (beat.id === "O2") {
        return (
          <>
            <ChalkPlate />
            <Abs left={0} top={380} width={1080}>
              <ChalkText size={110}>SCHOOLS.</ChalkText>
            </Abs>
            <Abs left={0} top={540} width={1080}>
              <ChalkText size={110} delay={4}>CENTURIES.</ChalkText>
            </Abs>
            <Abs left={0} top={760} width={1080}>
              <ChalkText size={100} color="#ffd93b" delay={10}>NOT FROM</ChalkText>
            </Abs>
            <Abs left={0} top={900} width={1080}>
              <ChalkText size={130} color="#ffd93b" delay={14}>A DREAM</ChalkText>
            </Abs>
            <Abs left={140} top={1250} width={240} height={360}>
              <Bukele expression="think" mouth={mouth} arm="chin" seed={1} />
            </Abs>
          </>
        );
      }
      // O1: two outsiders laugh at Bukele holding his tile.
      return (
        <>
          <PushIn dur={dur}><VillagePlate /></PushIn>
          <Abs left={120} top={800} width={320} height={480}>
            <Agent expression="laugh" mouth={mouth} arm="point" seed={5} />
          </Abs>
          <Abs left={640} top={800} width={320} height={480}>
            <Boss expression="laugh" mouth={mouth} arm="oneUp" seed={6} />
          </Abs>
          <Abs left={420} top={1150} width={240} height={360}>
            <Bukele expression="worried" mouth={mouth} arm="down" seed={1} />
          </Abs>
          <Abs left={490} top={1050} width={100} height={100}>
            <GlyphTile g={3} size={100} rotate={-4} delay={6} />
          </Abs>
          <Sub top={1560} size={44}>writing comes from empires, schools, centuries</Sub>
        </>
      );
    }
    case "spread": {
      // L1 letters, diaries | L2 crush berries for ink |
      // L3 schools, idea catches fire | L4 27 other scripts.
      if (beat.id === "L4") {
        return (
          <>
            <PushIn dur={dur} to={1.08}><VillagePlate /></PushIn>
            <Abs left={300} top={480} width={480} height={480}>
              <Globe />
            </Abs>
            <NumberPill
              text="27 SCRIPTS"
              steps={["10 SCRIPTS", "27 SCRIPTS"]}
              lf={lf} delay={12} size={96} top={1120}
            />
            <Sub top={1560}>the idea spreads across West Africa</Sub>
          </>
        );
      }
      if (beat.id === "L3") {
        // mid-beat flip at f1195 (blf 44): schoolhouse -> flame
        const schoolOut = blf < 44;
        return (
          <>
            <PushIn dur={dur} to={1.1}><VillagePlate /></PushIn>
            {schoolOut ? (
              <Abs left={220} top={600} width={640} height={477}>
                <Schoolhouse />
              </Abs>
            ) : (
              <>
                <Abs left={440} top={620} width={200} height={260}>
                  <Flame s={1.0} />
                </Abs>
                <Abs left={700} top={560} width={160} height={200} style={{ transform: `scale(${pop((blf - 44) / 10)})` }}>
                  <Lightbulb />
                </Abs>
              </>
            )}
            <Abs left={390} top={1150} width={300} height={450}>
              <Bukele expression="happy" mouth={mouth} arm={schoolOut ? "point" : "bothUp"} seed={1} />
            </Abs>
            <Sub top={1560}>{schoolOut ? "build their own schools" : "the idea catches fire"}</Sub>
          </>
        );
      }
      if (beat.id === "L2") {
        return (
          <>
            <PushIn dur={dur} to={1.08}><VillagePlate /></PushIn>
            <Abs left={240} top={550} width={600} height={420}>
              <BerryInk />
            </Abs>
            <Abs left={120} top={1150} width={300} height={450}>
              <Bukele expression="happy" mouth={mouth} arm="point" seed={1} />
            </Abs>
            <Sub top={1560}>they crush berries for ink</Sub>
          </>
        );
      }
      // L1: letters + diary, a Vai woman writing.
      return (
        <>
          <InteriorPlate />
          <Abs left={290} top={600} width={500} height={357}>
            <EnvelopeStack />
          </Abs>
          <Abs left={140} top={900} width={200} height={248}>
            <Diary />
          </Abs>
          <Abs left={720} top={1050} width={240} height={360}>
            <FamilyMember variant={1} expression="calm" mouth={mouth} arm="point" seed={3} />
          </Abs>
          <Sub top={1560}>Vai people write letters, diaries</Sub>
        </>
      );
    }
    case "payoff": {
      // P1 You see pivot | P2 survives colonial rule | P3 two rival scripts, 200 years |
      // P4 University of Liberia, Unicode | P5 text on phones | P6 the man who started it |
      // P7 final twist (no Sub — only karaoke speaks the last words).
      if (beat.id === "P7") {
        return (
          <>
            <ChalkPlate />
            <Abs left={0} top={420} width={1080}>
              <ChalkText size={110}>NEVER LEARNED</ChalkText>
            </Abs>
            <Abs left={0} top={560} width={1080}>
              <ChalkText size={130} color="#ffd93b" delay={4}>TO READ</ChalkText>
            </Abs>
            <Abs left={390} top={1050} width={300} height={450}>
              <OldBukele expression="happy" mouth={mouth} arm="oneUp" seed={1} />
            </Abs>
          </>
        );
      }
      if (beat.id === "P6") {
        return (
          <>
            <PushIn dur={dur}><VillagePlate /></PushIn>
            <Abs left={64} top={170}><Badge>THE MAN WHO STARTED IT ALL</Badge></Abs>
            <Abs left={360} top={800} width={360} height={540}>
              <OldBukele expression="think" mouth={mouth} arm="chin" seed={1} />
            </Abs>
            <Sub top={1560}>and the man who started it all</Sub>
          </>
        );
      }
      if (beat.id === "P5") {
        return (
          <>
            <ChalkPlate />
            <Abs left={390} top={450} width={300} height={500}>
              <PhoneUnicode />
            </Abs>
            <Abs left={120} top={1150} width={240} height={360}>
              <FamilyMember variant={1} expression="happy" mouth={mouth} arm="point" seed={3} />
            </Abs>
            <Sub top={1560}>so people text in it on their phones</Sub>
          </>
        );
      }
      if (beat.id === "P4") {
        return (
          <>
            <ChalkPlate />
            <Abs left={64} top={170}><Badge>UNIVERSITY OF LIBERIA</Badge></Abs>
            <Abs left={220} top={480} width={640} height={477}>
              <University />
            </Abs>
            <Abs left={0} top={1100} width={1080}>
              <ChalkText size={80} color="#ffd93b" delay={61}>UNICODE</ChalkText>
            </Abs>
            <Sub top={1560}>it&apos;s taught at the University of Liberia</Sub>
          </>
        );
      }
      if (beat.id === "P3") {
        return (
          <>
            <StormPlate />
            <Abs left={180} top={600} width={160} height={160}>
              <GlyphTile g={1} size={160} rotate={-6} delay={4} />
            </Abs>
            <Abs left={180} top={600} width={160} height={160}>
              <RedX size={160} delay={10} />
            </Abs>
            <Abs left={740} top={600} width={160} height={160}>
              <GlyphTile g={4} size={160} rotate={6} delay={8} />
            </Abs>
            <Abs left={740} top={600} width={160} height={160}>
              <RedX size={160} delay={14} />
            </Abs>
            <Abs left={450} top={780} width={180} height={180}>
              <GlyphTile g={3} size={180} rotate={0} delay={18} bg="#ffd93b" />
            </Abs>
            <NumberPill text="200 YEARS" lf={lf} delay={33} size={100} top={1120} />
            <Sub top={1560}>two rival scripts</Sub>
          </>
        );
      }
      if (beat.id === "P2") {
        return (
          <>
            <StormPlate />
            <Abs left={470} top={600} width={140} height={140}>
              <GlyphTile g={3} size={140} rotate={-4} delay={6} bg="#ffd93b" />
            </Abs>
            <Abs left={390} top={950} width={300} height={450}>
              <Bukele expression="calm" mouth={mouth} arm="down" seed={1} />
            </Abs>
            <Sub top={1560}>it survives colonial rule</Sub>
          </>
        );
      }
      // P1: the "You see" pivot — chalkboard, gold line pops at f1376 (blf 61).
      return (
        <>
          <ChalkPlate />
          <Abs left={0} top={380} width={1080}>
            <ChalkText size={100}>WRITING WASN&apos;T</ChalkText>
          </Abs>
          <Abs left={0} top={520} width={1080}>
            <ChalkText size={96} delay={4}>HANDED TO AFRICA.</ChalkText>
          </Abs>
          <Abs left={0} top={760} width={1080}>
            <ChalkText size={110} color="#ffd93b" delay={61}>IT WAS DREAMED</ChalkText>
          </Abs>
          <Abs left={0} top={900} width={1080}>
            <ChalkText size={130} color="#ffd93b" delay={65}>THERE.</ChalkText>
          </Abs>
          <Abs left={140} top={1300} width={240} height={360}>
            <Bukele expression="happy" mouth={mouth} arm="oneUp" seed={1} />
          </Abs>
        </>
      );
    }
    default:
      return null;
  }
};

export const VaiShort: React.FC = () => {
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
