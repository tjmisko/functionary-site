#!/usr/bin/env node
/**
 * Capture the hero figure at chosen moments, as it actually renders.
 *
 *   node scripts/hero-frames.mjs                 # a frame every 1.5 s
 *   node scripts/hero-frames.mjs 16.4 17 17.8    # these moments (seconds)
 *   node scripts/hero-frames.mjs --from 15 --to 25 --step 0.5
 *   node scripts/hero-frames.mjs --beats         # one settled frame per beat
 *
 * Options:
 *   --url <url>      page to capture (default http://localhost:4392/hero-frame)
 *   --out <dir>      output directory (default .frames)
 *   --width <px>     window width (default 1280)
 *   --height <px>    window height (default 700)
 *   --clip <WxH+X+Y> crop each frame (ImageMagick geometry), e.g. to zoom in
 *   --cols <n>       columns in the contact sheet (default 2)
 *   --total <s>      length of the animation, for the default range (default 25)
 *
 * Each frame is one headless Chrome run against `?t=<seconds>`; the figure's
 * own script freezes its clock there. Writes t-<seconds>.png per frame and
 * sheet.png, a labelled contact sheet of them all. Needs a dev or preview
 * server running, a Chrome or Chromium binary, and ImageMagick for the sheet.
 */
import { execFile } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

const flags = { beats: false };
const opts = { url: "http://localhost:4391/hero-frame", out: ".frames", width: "1280", height: "700", cols: "2", total: "25", clip: "", from: "", to: "", step: "" };
const times = [];
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg.startsWith("--") && arg.slice(2) in flags) {
    flags[arg.slice(2)] = true;
  } else if (arg.startsWith("--")) {
    const key = arg.slice(2);
    if (!(key in opts)) throw new Error(`unknown option ${arg}`);
    opts[key] = argv[++i];
  } else if (Number.isFinite(Number(arg))) {
    times.push(Number(arg));
  } else {
    throw new Error(`not a time in seconds: ${arg}`);
  }
}
if (times.length === 0 && !flags.beats) {
  const from = opts.from ? Number(opts.from) : 0;
  const to = opts.to ? Number(opts.to) : Number(opts.total);
  const step = opts.step ? Number(opts.step) : 1.5;
  for (let t = from; t <= to + 1e-9; t += step) times.push(Math.round(t * 100) / 100);
}

const chrome = ["/usr/bin/chromium-browser", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(existsSync) ?? process.env.CHROME;
if (!chrome) throw new Error("no Chrome or Chromium found; set CHROME to a binary");

// A page that fails to load would otherwise be captured as blank frames.
const probe = await fetch(opts.url).catch((error) => {
  throw new Error(`cannot reach ${opts.url}: ${error.message}. Is the dev server running?`);
});
if (!probe.ok) throw new Error(`${opts.url} answered ${probe.status}; fix the page before capturing`);

// --beats: the figure lists its beats as [start, end]; take each one near its end, when it has settled.
if (flags.beats) {
  const found = (await probe.text()).match(/data-beats="([^"]+)"/);
  if (!found) throw new Error("the page lists no beats (data-beats)");
  const beats = JSON.parse(found[1].replaceAll("&quot;", '"').replaceAll("&#34;", '"'));
  for (const [start, end] of beats) times.push(Math.round(Math.max(start, Math.min(end - 0.12, start + (end - start) * 0.9)) * 100) / 100);
}

const out = resolve(opts.out);
await mkdir(out, { recursive: true });

const name = (t) => `t-${t.toFixed(2).padStart(5, "0")}.png`;

async function shoot(t, slot) {
  const file = join(out, name(t));
  const sep = opts.url.includes("?") ? "&" : "?";
  await run(chrome, [
    "--headless=new",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--user-data-dir=${join(out, ".chrome", String(slot))}`,
    `--window-size=${opts.width},${opts.height}`,
    "--virtual-time-budget=3000",
    `--screenshot=${file}`,
    `${opts.url}${sep}t=${t}`,
  ]);
  if (opts.clip) await run("magick", [file, "-crop", opts.clip, "+repage", file]);
  return file;
}

// A few Chrome processes at a time, each with its own profile directory.
const SLOTS = 4;
const files = new Array(times.length);
let next = 0;
await Promise.all(
  Array.from({ length: SLOTS }, async (_, slot) => {
    while (next < times.length) {
      const i = next++;
      files[i] = await shoot(times[i], slot);
    }
  }),
);
await rm(join(out, ".chrome"), { recursive: true, force: true });

const sheet = join(out, "sheet.png");
const labelled = files.flatMap((file, i) => ["-label", `t = ${times[i]} s`, file]);
await run("magick", ["montage", ...labelled, "-tile", `${opts.cols}x`, "-geometry", "+6+6", "-background", "#0b0d10", "-fill", "#c9d1d9", "-pointsize", "20", sheet]);

console.log(files.join("\n"));
console.log(sheet);
