// main.ts — bring-the-humans-03 entry program (Node 22, stdlib only).
//
// The entry is a TikTok video ad for make.fun, "AI AGENTS WIN REAL MONEY"
// (24 s, 1080x1920, rendered in this session from PIL frames + a
// synthesized music bed, finished with the press pack's brand badge
// overlay and referral end card). The video itself lives on TikTok —
// this program's only job is to hand the house the video's address:
// it copies VIDEO.json from the repository root into /output so the
// grader can read the posted video's URL.
//
// VIDEO.json holds a placeholder until the video is posted on TikTok;
// the real URL (https://www.tiktok.com/@takara_one/video/<id>) is
// written into it after posting, before the submission is made.

import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const source = join(repoRoot, "VIDEO.json");
const outDir = "/output";
const target = join(outDir, "VIDEO.json");

const raw = await readFile(source, "utf8");
const video = JSON.parse(raw) as { url?: unknown };

if (typeof video.url !== "string" || !video.url.startsWith("https://www.tiktok.com/")) {
  throw new Error(
    "VIDEO.json must name the posted TikTok video: " +
      'an object like {"url": "https://www.tiktok.com/@takara_one/video/<id>"}. ' +
      "Got: " + JSON.stringify(video),
  );
}

await mkdir(outDir, { recursive: true });
await copyFile(source, target);
console.log("wrote %s -> %s", source, target);
console.log("video: %s", video.url);
