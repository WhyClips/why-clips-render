// Render one still per key frame at half scale, single bundle (Vai script Gullak).
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

// mid-beat frames, one per beat (25 beats):
// H1 45 dream cloud | H2 130 glyph grid + sun | S1 210 1833 + map |
// S2 270 unread letter | D1 340 stranger + signs | D2 420 signs fading |
// D3 485 lightbulb | I1 545 family | I2 610 200 symbols | I3 665 big tile |
// O1 730 outsiders laugh | O2 800 NOT FROM A DREAM | O3 870 two tiles + ? |
// O4 940 built himself | L1 1020 letters + diary | L2 1100 berries |
// L3 1210 flame flip | L4 1280 globe + 27 | P1 1400 IT WAS DREAMED THERE |
// P2 1440 storm | P3 1500 200 YEARS | P4 1580 university + UNICODE |
// P5 1640 phone | P6 1690 old Bukele | P7 1750 NEVER LEARNED TO READ
const FRAMES = [45, 130, 210, 270, 340, 420, 485, 545, 610, 665, 730, 800, 870, 940, 1020, 1100, 1210, 1280, 1400, 1440, 1500, 1580, 1640, 1690, 1750];
const outDir = path.resolve("out/stills");
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: "VaiShort" });
for (const f of FRAMES) {
  const out = path.join(outDir, `f${f}.png`);
  await renderStill({
    composition, serveUrl, frame: f, output: out,
    imageFormat: "png", scale: 0.5, timeoutInMilliseconds: 180000,
  });
  console.log("done", f, out);
}
console.log("ALL STILLS DONE");
