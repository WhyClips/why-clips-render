#!/usr/bin/env node
// verify-manifest.mjs — checks a frame manifest: every frame in the range must
// exist on disk as a valid PNG. Prints the gaps (contiguous missing ranges) so a
// re-run of render-chunk.mjs knows what is left.
//
// Usage:
//   node scripts/verify-manifest.mjs --manifest out/frames/manifest.json --frames 0-1799
//   node scripts/verify-manifest.mjs --manifest out/frames/manifest.json --total 1800
// Exit 0 = complete, 1 = gaps found.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = {};
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const m = argv[i].match(/^--([^=]+)(?:=(.*))?$/);
    if (!m) throw new Error(`unexpected argument: ${argv[i]}`);
    args[m[1]] = m[2] !== undefined ? m[2] : (i + 1 < argv.length && !argv[i + 1].startsWith("--") ? argv[++i] : true);
  }
}
const manifestPath = path.resolve(projectDir, args.manifest ?? "out/frames/manifest.json");
const outDir = path.resolve(projectDir, args.out ?? path.dirname(manifestPath));
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MIN_BYTES = 10 * 1024;

let start = 0, end;
if (args.frames) {
  const m = String(args.frames).match(/^(\d+)-(\d+)$/);
  if (!m) throw new Error(`--frames must be START-END, got ${args.frames}`);
  [start, end] = [Number(m[1]), Number(m[2])];
} else if (args.total) {
  end = Number(args.total) - 1;
} else {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  end = (manifest.totalFrames ?? 0) - 1;
}
if (end === undefined || end < start) throw new Error("no frame range: pass --frames START-END or --total N");

function validPng(p) {
  try {
    const st = fs.statSync(p);
    if (st.size < MIN_BYTES) return false;
    const fd = fs.openSync(p, "r");
    const buf = Buffer.alloc(8);
    fs.readSync(fd, buf, 0, 8, 0);
    fs.closeSync(fd);
    return buf.equals(PNG_MAGIC);
  } catch { return false; }
}

const missing = [];
for (let f = start; f <= end; f++) {
  if (!validPng(path.join(outDir, `frame-${f}.png`))) missing.push(f);
}
const gaps = [];
for (const f of missing) {
  const last = gaps[gaps.length - 1];
  if (last && last[1] === f - 1) last[1] = f;
  else gaps.push([f, f]);
}
const total = end - start + 1;
console.log(JSON.stringify({
  manifest: path.relative(projectDir, manifestPath),
  range: `${start}-${end}`, total, present: total - missing.length, missing: missing.length,
  gaps: gaps.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)),
}));
process.exit(missing.length ? 1 : 0);
