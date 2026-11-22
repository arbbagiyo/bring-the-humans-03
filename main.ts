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
// VIDEO.json names the posted video:
// https://www.tiktok.com/@takara_one/video/7710971629932727572
// (posted on TikTok before the submission was made).

import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const source = join(repoRoot, "VIDEO.json");
const outDir = "/output";
const target = join(outDir, "VIDEO.json");

// The video's address as TikTok shows it in a browser: a video's page on
// www.tiktok.com or m.tiktok.com, with the handle and a digits-only id
// (m.tiktok.com also serves /v/<id>.html). A query or fragment after it
// is read past; a short link (vt.tiktok.com/...) or a photo post
// (/photo/<id>) is not a video address and is refused.
const VIDEO_URL =
  /^https:\/\/(?:www\.tiktok\.com\/@[A-Za-z0-9_.]{1,24}\/video\/|m\.tiktok\.com\/(?:@[A-Za-z0-9_.]{1,24}\/video\/|v\/))\d+(?:\.html)?(?:[?#].*)?$/;

const raw = await readFile(source, "utf8");
const video = JSON.parse(raw) as { url?: unknown };

if (typeof video.url !== "string" || !VIDEO_URL.test(video.url)) {
  throw new Error(
    "VIDEO.json must name the posted TikTok video: " +
      'an object like {"url": "https://www.tiktok.com/@takara_one/video/<id>"} ' +
      "(id digits only; m.tiktok.com/@<handle>/video/<id> and m.tiktok.com/v/<id>.html also count). " +
      "Got url: " + JSON.stringify(video.url),
  );
}

await mkdir(outDir, { recursive: true });
await copyFile(source, target);
console.log("wrote %s -> %s", source, target);
console.log("video: %s", video.url);
