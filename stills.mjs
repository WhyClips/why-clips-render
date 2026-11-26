// Render one still per key frame at half scale, single bundle (Moon Trees Gullak).
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

// mid-scene frames: hook 120, feb1947 275, scientists 420, question 600,
// perfectTest 690, genes75 800, launch 990, parachute 1220, earlier1946 1400,
// firstAlive 1540, youSee 1665, withoutThem 1790, laika 1915, lastline 2050
const FRAMES = [15, 120, 300, 640, 760, 970, 1080, 1300, 1460, 1670, 1790];
const outDir = path.resolve("out/stills");
fs.mkdirSync(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: "MoonTreesShort" });
for (const f of FRAMES) {
  const out = path.join(outDir, `f${f}.png`);
  await renderStill({
    composition, serveUrl, frame: f, output: out,
    imageFormat: "png", scale: 0.5, timeoutInMilliseconds: 180000,
  });
  console.log("done", f, out);
}
console.log("ALL STILLS DONE");
