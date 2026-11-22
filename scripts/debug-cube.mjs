// render the TestCube composition (no chromiumOptions = default GL path)
import fs from "node:fs";
if (process.env.REMOTION_TMP) { fs.mkdirSync(process.env.REMOTION_TMP, { recursive: true }); process.env.TEMP = process.env.TMP = process.env.REMOTION_TMP; }
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: "TestCube" });
const onBrowserLog = (l) => console.log(`[browser ${l.type}]`, l.text.slice(0, 500));
await renderStill({ composition, serveUrl, frame: 0, output: "/home/hatch/workspace/ricks-clone/demo-v2/stills/dbg-cube.jpg", imageFormat: "jpeg", jpegQuality: 88, scale: 0.5,
  timeoutInMilliseconds: 300000, onBrowserLog });
console.log("cube done");
