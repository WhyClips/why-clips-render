#!/usr/bin/env node
// render-chunk.mjs — RESUMABLE frame renderer for the TherealWhy template.
//
// Danish pipeline rule (25 Nov 2026): the full post composer costs ~16 s/frame,
// so a 60-70 s video (~2,000 frames) takes 5-6 h on one machine. A machine stop /
// restart must NEVER lose work: this script renders ONE chunk of a Remotion
// composition as individual PNG frames and records every finished frame in a
// manifest (out/frames/manifest.json). Re-running the same command resumes —
// frames already in the manifest AND present on disk as valid PNGs are skipped,
// no frame is ever re-rendered.
//
// Usage:
//   node scripts/render-chunk.mjs --comp TemplateShort --frames 0-1799 \
//     --chunk 0/4 --out out/frames --scale 1
//   --chunk i/n splits the --frames range into n contiguous chunks and renders
//   chunk i. Omit --chunk to render the whole --frames range as one chunk.
//   --props '<json>' passes input props (e.g. '{"post":{"dpr":0.5}}' for a
//   half-scale look-check; full renders use the default dpr).
//
// Proven invocation (Phase 0 + template stills): concurrency 1, --gl angle with
// --chromium-flags '{"enable-unsafe-swiftshader":true}', 180 s frame timeout.
// Disk rule: TEMP/TMPDIR point at <repo>/../remotion-tmp (never /tmp, too small).
//
// Exit 0 when the chunk range is fully rendered; exit 1 if a render run failed
// (the manifest is preserved, so re-running resumes from the last good frame).
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmpDir = path.resolve(projectDir, "..", "remotion-tmp");
for (const v of ["TEMP", "TMPDIR"]) if (!process.env[v]) process.env[v] = tmpDir;
fs.mkdirSync(tmpDir, { recursive: true });

const args = {};
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const m = argv[i].match(/^--([^=]+)(?:=(.*))?$/);
    if (!m) throw new Error(`unexpected argument: ${argv[i]}`);
    // space-separated value: --key value (unless the next token is another flag)
    args[m[1]] = m[2] !== undefined ? m[2] : (i + 1 < argv.length && !argv[i + 1].startsWith("--") ? argv[++i] : true);
  }
}
const comp = args.comp ?? "TemplateShort";
const entry = args.entry ?? "src/index.ts";
const scale = Number(args.scale ?? 1);
const outDir = path.resolve(projectDir, args.out ?? "out/frames");
const manifestPath = path.resolve(projectDir, args.manifest ?? path.join(outDir, "manifest.json"));
const props = args.props ?? null;

const parseRange = (s) => {
  const m = String(s).match(/^(\d+)-(\d+)$/);
  if (!m) throw new Error(`--frames must be START-END, got ${s}`);
  const a = Number(m[1]), b = Number(m[2]);
  if (b < a) throw new Error(`--frames end < start: ${s}`);
  return [a, b];
};
const [rangeStart, rangeEnd] = parseRange(args.frames ?? "0-899");
const [chunkI, chunkN] = String(args.chunk ?? "0/1").split("/").map(Number);
if (!(chunkI >= 0 && chunkI < chunkN)) throw new Error(`--chunk must be i/n with 0 <= i < n, got ${args.chunk}`);
const total = rangeEnd - rangeStart + 1;
const per = Math.ceil(total / chunkN);
const chunkStart = rangeStart + chunkI * per;
const chunkEnd = Math.min(rangeStart + (chunkI + 1) * per - 1, rangeEnd);

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MIN_BYTES = 10 * 1024; // a real 1080x1920 PNG is hundreds of KB; smaller = truncated
const frameFile = (f) => path.join(outDir, `frame-${f}.png`);

// Returns {ok, reason} — reason names the actual problem (missing / too small /
// bad magic) plus the observed size and first bytes, so a failed run on a
// remote machine can be diagnosed from the log alone.
function validPng(p) {
  let st;
  try { st = fs.statSync(p); } catch { return { ok: false, reason: "missing" }; }
  if (st.size < MIN_BYTES) return { ok: false, reason: `too small (${st.size} bytes)` };
  try {
    const fd = fs.openSync(p, "r");
    const buf = Buffer.alloc(8);
    fs.readSync(fd, buf, 0, 8, 0);
    fs.closeSync(fd);
    return buf.equals(PNG_MAGIC)
      ? { ok: true, reason: `valid (${st.size} bytes)` }
      : { ok: false, reason: `bad magic (${buf.toString("hex")}, ${st.size} bytes)` };
  } catch (e) { return { ok: false, reason: `unreadable (${e.message})` }; }
}
const sha1 = (p) => createHash("sha1").update(fs.readFileSync(p)).digest("hex");

function loadManifest() {
  try {
    const m = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    if (m.comp === comp && m.frames && typeof m.frames === "object") return m;
  } catch { /* fresh manifest */ }
  return { comp, fps: 30, width: 1080, height: 1920, totalFrames: total, frames: {} };
}
function saveManifest(m) {
  m.updatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  const tmp = manifestPath + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(m, null, 2));
  fs.renameSync(tmp, manifestPath);
}

function missingRuns(manifest) {
  const missing = [];
  for (let f = chunkStart; f <= chunkEnd; f++) {
    const entry = manifest.frames[String(f)];
    if (entry && entry.file && validPng(path.join(outDir, entry.file)).ok) continue;
    if (entry) delete manifest.frames[String(f)]; // manifest says done but file is gone/corrupt: re-render
    missing.push(f);
  }
  const runs = [];
  for (const f of missing) {
    const last = runs[runs.length - 1];
    if (last && last[1] === f - 1) last[1] = f;
    else runs.push([f, f]);
  }
  return runs;
}

function renderRun(a, b, runDir) {
  fs.mkdirSync(runDir, { recursive: true });
  const cmd = [
    "npx", "remotion", "render", entry, comp, runDir,
    "--sequence", "--image-format", "png",
    "--image-sequence-pattern", "frame-[frame].png",
    "--frames", `${a}-${b}`,
    "--concurrency", "1", "--scale", String(scale),
    "--timeout", "180000", "--log=verbose",
    "--gl", "angle",
    "--chromium-flags", '{"enable-unsafe-swiftshader":true}',
  ];
  if (props) cmd.push("--props", props);
  const t0 = Date.now();
  const r = spawnSync(cmd[0], cmd.slice(1), { cwd: projectDir, stdio: "inherit", env: process.env });
  return { ok: r.status === 0, seconds: (Date.now() - t0) / 1000 };
}

const manifest = loadManifest();
manifest.totalFrames = total;
fs.mkdirSync(outDir, { recursive: true });
const runs = missingRuns(manifest);
const already = chunkEnd - chunkStart + 1 - runs.reduce((n, [a, b]) => n + (b - a + 1), 0);
console.log(JSON.stringify({ chunk: `${chunkI}/${chunkN}`, range: `${chunkStart}-${chunkEnd}`, frames: chunkEnd - chunkStart + 1, alreadyDone: already, runsToRender: runs.length }));

let rendered = 0, renderSeconds = 0;
const tAll = Date.now();
for (const [a, b] of runs) {
  // NB: the run dir name must not look like a file extension to Remotion
  // (it rejects image-sequence output dirs with an "extension" — '.run-0-5'
  // fails, 'run_0_5' works).
  const runDir = path.join(outDir, `run_${a}_${b}`);
  console.log(`rendering frames ${a}-${b} (${b - a + 1} frames) ...`);
  const { ok, seconds } = renderRun(a, b, runDir);
  if (!ok) {
    console.error(`RENDER FAILED for frames ${a}-${b} — manifest preserved, re-run to resume.`);
    process.exit(1);
  }
  renderSeconds += seconds;
  // diagnostic: what did Remotion actually write? (sizes tell us at a glance
  // whether a frame is a real render ~1-2 MB or a blank ~5 KB)
  console.log(`run dir ${path.relative(projectDir, runDir)}: ` +
    fs.readdirSync(runDir).map((n) => `${n} ${fs.statSync(path.join(runDir, n)).size}B`).join(", "));
  // NB: Remotion zero-pads the [frame] token to the width of the LARGEST frame
  // number in the range: frames 0-1 come out as frame-0.png, frame-1.png, but
  // frames 0-29 come out as frame-00.png ... frame-29.png (and 0-1799 as
  // frame-0000.png ...). Never assume the filename — map by parsing the number.
  const byNumber = new Map();
  for (const n of fs.readdirSync(runDir)) {
    const m = n.match(/^frame-(\d+)\.png$/);
    if (m) byNumber.set(Number(m[1]), n);
  }
  // verify each PNG, then move it into place (atomic rename, canonical name
  // frame-N.png with no padding) and record it
  let moved = 0;
  for (let f = a; f <= b; f++) {
    const found = byNumber.get(f);
    if (!found) {
      console.error(`frame ${f} was not written by Remotion (run dir has: ` +
        [...byNumber.keys()].sort((x, y) => x - y).join(", ") + `)`);
      process.exit(1);
    }
    const src = path.join(runDir, found);
    const check = validPng(src);
    if (!check.ok) {
      console.error(`frame ${f} did not render as a valid PNG (${src}): ${check.reason}`);
      console.error(`run dir contents: ` +
        fs.readdirSync(runDir).map((n) => `${n} ${fs.statSync(path.join(runDir, n)).size}B`).join(", "));
      process.exit(1);
    }
    fs.renameSync(src, frameFile(f));
    const st = fs.statSync(frameFile(f));
    manifest.frames[String(f)] = { file: `frame-${f}.png`, bytes: st.size, sha1: sha1(frameFile(f)) };
    moved++;
  }
  fs.rmSync(runDir, { recursive: true, force: true });
  saveManifest(manifest);
  rendered += moved;
  console.log(`frames ${a}-${b} done (${moved} frames, ${seconds.toFixed(1)}s, ${(seconds / moved).toFixed(2)}s/frame incl. bundling)`);
}
const wallSeconds = (Date.now() - tAll) / 1000;
const done = Object.keys(manifest.frames).filter((f) => +f >= chunkStart && +f <= chunkEnd).length;
const summary = {
  comp, chunk: `${chunkI}/${chunkN}`, range: `${chunkStart}-${chunkEnd}`,
  framesInChunk: chunkEnd - chunkStart + 1, alreadyDone: already, rendered,
  chunkDone: done, renderSeconds: +renderSeconds.toFixed(1), wallSeconds: +wallSeconds.toFixed(1),
  secPerFrame: rendered ? +(renderSeconds / rendered).toFixed(2) : null,
  manifest: path.relative(projectDir, manifestPath),
};
console.log("SUMMARY " + JSON.stringify(summary));
// projected times for a full 60 s video (1800 frames @ 30 fps) at this measured rate
if (summary.secPerFrame) {
  const single = summary.secPerFrame * 1800;
  console.log(`PROJECTED 60s video (1800 frames): single machine ${(single / 3600).toFixed(2)}h, 4 parallel chunks ${(single / 4 / 3600).toFixed(2)}h`);
}
process.exit(done === chunkEnd - chunkStart + 1 ? 0 : 1);
