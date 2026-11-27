// Render one still per key frame at half scale, single bundle (Sued Himself Gullak).
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

// key frames: hook 15, mirror 100, $5M 200, 23yrs 300, court 470, no-lawyer 560,
// 7-pages 630, letter 700, 1-july 800, beliefs 900, cell 1000, $5,000,000 1100,
// $0 1200, statehouse 1370, pay-back 1450, judge 1540, ludicrous 1620,
// innovative 1720, final 1790
const FRAMES = [15, 100, 200, 300, 470, 560, 630, 700, 800, 900, 1000, 1100, 1200, 1370, 1450, 1540, 1620, 1720, 1790];
const outDir = path.resolve("out/stills");
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: "SuedHimselfShort" });
for (const f of FRAMES) {
  const out = path.join(outDir, `f${f}.png`);
  await renderStill({
    composition, serveUrl, frame: f, output: out,
    imageFormat: "png", scale: 0.5, timeoutInMilliseconds: 180000,
  });
  console.log("done", f, out);
}
console.log("ALL STILLS DONE");
