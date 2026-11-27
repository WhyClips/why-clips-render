// Render one still per key frame at half scale, single bundle (Segway Gullak).
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

// key frames: hook 15, tip 100, polite 240, Jimi 300, £166m 490, Bastion 560,
// shop 650, 9 months 780, dog 930, walker 1000, reverse 1090, 42 feet 1195,
// aged 62 1270, inquest 1350, no fault 1450, killed owner 1530, payoff 1600,
// cliff again 1680, final 1760
const FRAMES = [15, 100, 240, 300, 490, 560, 650, 780, 930, 1000, 1090, 1195, 1270, 1350, 1450, 1530, 1600, 1680, 1760];
const outDir = path.resolve("out/stills");
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: "SegwayShort" });
for (const f of FRAMES) {
  const out = path.join(outDir, `f${f}.png`);
  await renderStill({
    composition, serveUrl, frame: f, output: out,
    imageFormat: "png", scale: 0.5, timeoutInMilliseconds: 180000,
  });
  console.log("done", f, out);
}
console.log("ALL STILLS DONE");
