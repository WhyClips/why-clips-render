// one-off debug: render one frame with optional post toggles, log ALL browser output
import fs from "node:fs";
if (process.env.REMOTION_TMP) { fs.mkdirSync(process.env.REMOTION_TMP, { recursive: true }); process.env.TEMP = process.env.TMP = process.env.REMOTION_TMP; }
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [frame, out, postJson] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const chromiumOptions = undefined;
const composition = await selectComposition({ serveUrl, id: "HenryShort", chromiumOptions });
const onBrowserLog = (l) => console.log(`[browser ${l.type}]`, l.text.slice(0, 500));
await renderStill({ composition, serveUrl, frame: Number(frame), output: out, imageFormat: "jpeg", jpegQuality: 88, scale: 0.5,
  inputProps: postJson ? { post: JSON.parse(postJson) } : {}, chromiumOptions, timeoutInMilliseconds: 300000, onBrowserLog });
console.log("done", frame, out);
