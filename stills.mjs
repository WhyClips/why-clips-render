// Render one still per key frame at half scale, single bundle (Drake Gullak).
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

// key frames: hook 30, H2 oceans 150, mule train 260, jungle flee 380,
// CIMARRONES badge 520, ship 780, lost jungle 880, Pedro 1020,
// 30 pill 1210, riverbed 1350, TWO OCEANS 1650, final globe 1750
// v2 flip-fix checks: H2 first half 110, S2 run-away 330, M2 melt 660,
// D2 lost 870, A3 ambush 1290
const FRAMES = [30, 110, 150, 260, 330, 380, 520, 660, 780, 870, 880, 1020, 1210, 1290, 1350, 1650, 1750];
const outDir = path.resolve("out/stills");
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: "DrakeShort" });
for (const f of FRAMES) {
  const out = path.join(outDir, `f${f}.png`);
  await renderStill({
    composition, serveUrl, frame: f, output: out,
    imageFormat: "png", scale: 0.5, timeoutInMilliseconds: 180000,
  });
  console.log("done", f, out);
}
console.log("ALL STILLS DONE");
