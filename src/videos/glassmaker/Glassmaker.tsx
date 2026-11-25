// "The Glassmaker" — Why Clips Short.
// 12 setups, hard cuts, stick-figure SVG cast (TheRealWhy style),
// Blender 3D plates, karaoke word captions, word-timed lip-sync.
// NO other on-screen text: captions are the only text layer (RICKS-EXACT §4).
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS, TOTAL, SceneId, mouthAt, sceneAt, smooth, pop } from "./story";
import { FONT_CSS } from "./fonts";
import { OUTLINE } from "./characters";
import {
  StickGlassmaker, StickKing, StickBlacksmith,
  GlassDrop, Hammer, Pliers, VaultBolt, GoldPile,
} from "./stickfigures";
import { Abs } from "./cards";
import { CaptionOverlay } from "./captions";

/** slow push-in on a plate over the scene (camera: locked-off + push) */
const PushIn: React.FC<{ dur: number; to?: number; children: React.ReactNode }> = ({ dur, to = 1.06, children }) => {
  const frame = useCurrentFrame();
  const s = 1 + (to - 1) * smooth(frame / dur);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: "50% 55%" }}>
      {children}
    </div>
  );
};

/** full-frame Blender plate */
const Plate: React.FC<{ src: string }> = ({ src }) => (
  <Img src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
);

const Scene: React.FC<{ id: SceneId; lf: number; dur: number; t: number }> = ({ id, lf, dur, t }) => {
  const frame = useCurrentFrame();
  const mouth = mouthAt(t);
  switch (id) {
    case "hookDrop": {
      // ECU: molten glass drop falls into a bucket of cold water
      const dropY = interpolate(lf, [0, 150], [-320, 560]);
      const ripple = interpolate(lf, [150, 240], [0.3, 1.7]);
      const rippleOp = interpolate(lf, [150, 240], [0.9, 0]);
      return (
        <>
          <PushIn dur={dur} to={1.12}><Plate src="plates/drop-closeup.png" /></PushIn>
          {/* bucket rim */}
          <Abs left={240} top={1240} width={600} height={220}>
            <svg viewBox="0 0 600 220" width="100%" height="100%">
              <ellipse cx={300} cy={60} rx={290} ry={55} fill="#16233d" stroke={OUTLINE} strokeWidth={8} />
              <path d="M10,60 L40,210 Q300,235 560,210 L590,60 Z" fill="#1d2b4a" stroke={OUTLINE} strokeWidth={8} />
              <ellipse cx={300} cy={60} rx={250} ry={40} fill="#2b4a7a" />
            </svg>
          </Abs>
          {/* falling glass drop */}
          <Abs left={440} top={dropY} width={200} height={320}>
            <GlassDrop />
          </Abs>
          {/* water ripples after the splash */}
          {lf > 150 && (
            <Abs left={240} top={1180} width={600} height={200} style={{ opacity: rippleOp }}>
              <svg viewBox="0 0 600 200" width="100%" height="100%">
                <ellipse cx={300} cy={100} rx={260 * ripple} ry={80 * ripple} fill="none" stroke="#7ec8f0" strokeWidth={10} />
                <ellipse cx={300} cy={100} rx={180 * ripple} ry={55 * ripple} fill="none" stroke="#bfe3ff" strokeWidth={7} />
              </svg>
            </Abs>
          )}
          <Abs left={80} top={1060} width={250} height={375}>
            <StickGlassmaker expression="worried" mouth={mouth} arm="oneUp" bob />
          </Abs>
        </>
      );
    }
    case "hookBet": {
      // court: glassmaker hands the teardrop to the king — the bet, everybody laughs
      const passX = interpolate(lf, [0, 120], [330, 740]);
      const passY = interpolate(lf, [0, 120], [1150, 1080]);
      const laugh = lf > 60;
      return (
        <>
          <PushIn dur={dur}><Plate src="plates/court.png" /></PushIn>
          <Abs left={110} top={1010} width={280} height={420}>
            <StickGlassmaker expression="neutral" mouth={mouth} arm="oneUp" bob />
          </Abs>
          <Abs left={410} top={1040} width={260} height={390}>
            <StickBlacksmith expression={laugh ? "laughing" : "neutral"} mouth="closed" arm="down" bob />
          </Abs>
          <Abs left={690} top={930} width={310} height={465}>
            <StickKing expression={laugh ? "laughing" : "neutral"} mouth={laugh ? "grin" : "closed"} arm={lf > 120 ? "point" : "down"} bob />
          </Abs>
          <Abs left={passX} top={passY} width={90} height={144}>
            <GlassDrop />
          </Abs>
        </>
      );
    }
    case "hammer": {
      // blacksmith raises the hammer high — and swings! CLANG! dent in the steel
      const clangAt = 66; // "clang" word ~17.2s
      const rot = lf < 50 ? -55 : lf < clangAt ? interpolate(lf, [50, clangAt], [-55, 0]) : lf < 80 ? -18 : -10;
      const shake = lf >= clangAt && lf < 92 ? Math.sin(lf * 2.2) * 7 : 0;
      const flash = lf >= clangAt && lf < 76 ? 1 - (lf - clangAt) / 10 : 0;
      return (
        <>
          <PushIn dur={dur} to={1.08}><Plate src="plates/hammer-anvil.png" /></PushIn>
          <Abs left={350} top={880} width={380} height={570}>
            <StickBlacksmith expression={lf > clangAt ? "shocked" : "neutral"} mouth={mouth} arm="bothUp" bob />
          </Abs>
          {/* hammer above the anvil, slams down at the clang */}
          <Abs left={400} top={580} width={280} height={280} style={{ transform: `rotate(${rot}deg)`, transformOrigin: "50% 90%" }}>
            <Hammer />
          </Abs>
          {/* glass drop on the anvil, shakes at the impact */}
          <Abs left={455 + shake} top={1080} width={170} height={272}>
            <GlassDrop />
          </Abs>
          {/* impact flash */}
          {flash > 0 && (
            <Abs left={390} top={1000} width={320} height={320} style={{ opacity: flash }}>
              <svg viewBox="0 0 320 320" width="100%" height="100%">
                <circle cx={160} cy={160} r={140} fill="none" stroke="#fff" strokeWidth={14} />
                <circle cx={160} cy={160} r={90} fill="rgba(255,255,255,0.55)" />
              </svg>
            </Abs>
          )}
        </>
      );
    }
    case "gaspsKing": {
      // wide court: everybody gasps — the king is so impressed he orders the GIANT bolt
      const impressed = lf > 120;
      return (
        <>
          <PushIn dur={dur} to={1.05}><Plate src="plates/court.png" /></PushIn>
          <Abs left={90} top={1020} width={270} height={405}>
            <StickGlassmaker expression="shocked" mouth="closed" arm="down" bob />
          </Abs>
          <Abs left={380} top={880} width={330} height={495}>
            <StickKing expression={impressed ? "laughing" : "shocked"} mouth={impressed ? "grin" : mouth} arm={impressed ? "point" : "down"} bob />
          </Abs>
          <Abs left={720} top={1020} width={270} height={405}>
            <StickBlacksmith expression={impressed ? "laughing" : "shocked"} mouth="closed" arm="down" bob />
          </Abs>
        </>
      );
    }
    case "boltUnbreakable": {
      // vault: the GIANT glass bolt — saws can't cut it, chisels bounce off
      const hit1 = lf > 25 && lf < 34;
      const hit2 = lf > 55 && lf < 64;
      const boltShake = (hit1 || hit2) ? Math.sin(lf * 3) * 6 : 0;
      const hammerY = hit1 || hit2 ? 60 : 0;
      return (
        <>
          <Plate src="plates/vault.png" />
          <Abs left={240 + boltShake} top={620} width={600} height={920}>
            <VaultBolt />
          </Abs>
          {/* hammer taps the bolt and bounces off */}
          <Abs left={700} top={760 + hammerY} width={170} height={170} style={{ transform: "rotate(35deg)" }}>
            <Hammer />
          </Abs>
        </>
      );
    }
    case "youseeFreeze": {
      // ECU drop: the outside freezes in a split second — squeezing like a fist
      const ring = interpolate(lf, [0, dur], [1.5, 0.9]);
      const blueOp = interpolate(lf, [0, dur], [0, 0.22]);
      return (
        <>
          <PushIn dur={dur} to={1.25}><Plate src="plates/drop-closeup.png" /></PushIn>
          <Abs left={330} top={480} width={420} height={672}>
            <GlassDrop />
          </Abs>
          {/* closing freeze rings */}
          <Abs left={240} top={420} width={600} height={800} style={{ transform: `scale(${ring})`, opacity: 0.65 }}>
            <svg viewBox="0 0 600 800" width="100%" height="100%">
              <ellipse cx={300} cy={400} rx={270} ry={360} fill="none" stroke="#bfe3ff" strokeWidth={10} />
              <ellipse cx={300} cy={400} rx={200} ry={280} fill="none" stroke="#7ec8f0" strokeWidth={7} />
            </svg>
          </Abs>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, backgroundColor: "#7ec8f0", opacity: blueOp }} />
        </>
      );
    }
    case "youseeSpring": {
      // the inside is still pulling, like a stretched spring — the thin tail is the weak spot
      const pulse = 0.9 + Math.sin(frame * 0.25) * 0.1;
      const glow = 0.45 + Math.sin(frame * 0.3) * 0.4;
      return (
        <>
          <PushIn dur={dur} to={1.35}><Plate src="plates/drop-closeup.png" /></PushIn>
          {/* coiled spring behind the drop */}
          <Abs left={180} top={700} width={720} height={300} style={{ transform: `scaleX(${pulse})` }}>
            <svg viewBox="0 0 720 300" width="100%" height="100%">
              <polyline points="0,150 90,40 180,260 270,40 360,260 450,40 540,260 630,40 720,150" fill="none" stroke="#ffd93b" strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </Abs>
          <Abs left={340} top={420} width={400} height={640}>
            <GlassDrop />
          </Abs>
          {/* pulsing glow on the thin tail — the weak spot */}
          <Abs left={470} top={1020} width={140} height={140} style={{ opacity: glow }}>
            <svg viewBox="0 0 140 140" width="100%" height="100%">
              <circle cx={70} cy={70} r={55} fill="none" stroke="#ff7b54" strokeWidth={10} />
              <circle cx={70} cy={70} r={30} fill="rgba(255,123,84,0.35)" />
            </svg>
          </Abs>
        </>
      );
    }
    case "nightSnip": {
      // that night: the glassmaker sneaks back with tiny pliers — one little snip
      const snipAt = 141; // "snip" word ~50.7s
      const snipping = lf >= snipAt - 6 && lf <= snipAt + 10;
      const flash = lf >= snipAt && lf < snipAt + 12 ? 1 - (lf - snipAt) / 12 : 0;
      return (
        <>
          <Plate src="plates/vault-night.png" />
          <Abs left={260} top={600} width={560} height={860}>
            <VaultBolt />
          </Abs>
          {/* crack lines appear on the bolt after the snip */}
          {lf >= snipAt && (
            <Abs left={260} top={600} width={560} height={860}>
              <svg viewBox="0 0 300 460" width="100%" height="100%">
                <g stroke="#ffffff" strokeWidth={6} strokeLinecap="round" fill="none">
                  <path d="M150,120 L120,180 L160,230 L130,300" />
                  <path d="M150,120 L190,170 L170,240 L200,310" />
                  <path d="M150,200 L110,260 M150,200 L195,260" />
                </g>
              </svg>
            </Abs>
          )}
          <Abs left={120} top={1060} width={260} height={390}>
            <StickGlassmaker expression="worried" mouth={mouth} arm="point" bob />
          </Abs>
          {/* pliers at the bolt tail, closing on the snip */}
          <Abs left={640} top={880} width={170} height={170} style={{ transform: snipping ? "scale(0.82)" : "scale(1)" }}>
            <Pliers />
          </Abs>
          {flash > 0 && (
            <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, backgroundColor: "#fff", opacity: flash * 0.5 }} />
          )}
        </>
      );
    }
    case "dustDawn": {
      // the whole giant bolt shatters into dust — by dawn, every coin is gone
      const boltOp = interpolate(lf, [0, 60], [1, 0]);
      const boltScale = interpolate(lf, [0, 60], [1, 1.2]);
      const goldOp = interpolate(lf, [60, 120], [1, 0]);
      const dust = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
      return (
        <>
          <Plate src="plates/vault.png" />
          <Abs left={260} top={600} width={560} height={860} style={{ opacity: boltOp, transform: `scale(${boltScale})` }}>
            <VaultBolt />
          </Abs>
          {/* dust particles scattering */}
          <Abs left={0} top={0} width={1080} height={1920}>
            <svg viewBox="0 0 1080 1920" width="100%" height="100%">
              {dust.map((i) => {
                const ang = (i / dust.length) * Math.PI * 2;
                const dist = interpolate(lf, [0, dur], [0, 300]);
                const cx = 540 + Math.cos(ang) * dist;
                const cy = 1030 + Math.sin(ang) * dist * 0.7;
                const op = interpolate(lf, [0, dur], [1, 0]);
                return <circle key={i} cx={cx} cy={cy} r={10 + (i % 3) * 5} fill="#d8e6ff" opacity={op} />;
              })}
            </svg>
          </Abs>
          <Abs left={340} top={1250} width={400} height={260} style={{ opacity: goldOp }}>
            <GoldPile />
          </Abs>
        </>
      );
    }
    case "vaultEmpty": {
      // in the morning the guards open the vault... and there's no gold
      return (
        <>
          <Plate src="plates/vault.png" />
          {/* open dark doorway — the empty vault */}
          <Abs left={340} top={480} width={400} height={700}>
            <div style={{ width: "100%", height: "100%", backgroundColor: "#0a0f1e", borderRadius: 24, border: `8px solid ${OUTLINE}` }} />
          </Abs>
          {/* dashed outline where the gold used to be */}
          <Abs left={380} top={1350} width={320} height={120}>
            <div style={{ width: "100%", height: "100%", border: "6px dashed #ffd93b", borderRadius: "50%", opacity: 0.8 }} />
          </Abs>
          <Abs left={180} top={1050} width={260} height={390}>
            <StickBlacksmith expression="worried" mouth="closed" arm="down" bob />
          </Abs>
          <Abs left={640} top={1000} width={300} height={450}>
            <StickKing expression="shocked" mouth={mouth} arm="down" bob />
          </Abs>
        </>
      );
    }
    case "outro": {
      // that's the glassmaker — and the king never saw it coming
      const walkX = interpolate(lf, [0, dur], [0, -160]);
      return (
        <>
          <PushIn dur={dur} to={1.05}><Plate src="plates/court.png" /></PushIn>
          <Abs left={380} top={900} width={330} height={495}>
            <StickKing expression="shocked" mouth={mouth} arm="down" bob />
          </Abs>
          <Abs left={140 + walkX} top={1040} width={270} height={405}>
            <StickGlassmaker expression="laughing" mouth="grin" arm="down" flip bob />
          </Abs>
        </>
      );
    }
    case "tailHold": {
      // final frame hold, bed only — same pose as the outro's end
      return (
        <>
          <Plate src="plates/court.png" />
          <Abs left={380} top={900} width={330} height={495}>
            <StickKing expression="shocked" mouth="closed" arm="down" />
          </Abs>
          <Abs left={-20} top={1040} width={270} height={405}>
            <StickGlassmaker expression="laughing" mouth="closed" arm="down" flip />
          </Abs>
        </>
      );
    }
    default:
      return null;
  }
};

export const GlassmakerShort: React.FC = () => {
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
