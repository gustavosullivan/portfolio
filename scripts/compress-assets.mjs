/**
 * One-off asset compressor: PNG → WebP (keeps originals unless --replace).
 * Usage: node scripts/compress-assets.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";

const root = path.resolve("public");

/** @type {{ rel: string; maxWidth?: number; quality: number }[]} */
const jobs = [
  // World (textures — slight loss OK)
  { rel: "world/anime-sky.png", maxWidth: 1920, quality: 78 },
  { rel: "world/anime-grass-far.png", maxWidth: 2048, quality: 78 },
  { rel: "world/anime-grass-scroll.png", maxWidth: 2048, quality: 78 },
  { rel: "world/walker-sheet.png", maxWidth: 2048, quality: 82 },
  // Certificates (text — higher quality, capped width for carousel)
  { rel: "certificates/rust-ai-dev.png", maxWidth: 1400, quality: 86 },
  { rel: "certificates/fundamentos-ia.png", maxWidth: 1400, quality: 86 },
  { rel: "certificates/carreira-ia.png", maxWidth: 1400, quality: 86 },
  { rel: "certificates/apps-junior.png", maxWidth: 1400, quality: 86 },
  { rel: "certificates/fullstack-qualifica.png", maxWidth: 1400, quality: 86 },
];

function mb(n) {
  return (n / 1024 / 1024).toFixed(2);
}

async function run() {
  let before = 0;
  let after = 0;

  for (const job of jobs) {
    const src = path.join(root, job.rel);
    if (!fs.existsSync(src)) {
      console.warn("skip missing", job.rel);
      continue;
    }
    const out = src.replace(/\.png$/i, ".webp");
    const stat = fs.statSync(src);
    before += stat.size;

    const meta = await sharp(src).metadata();
    let pipeline = sharp(src).rotate();
    if (job.maxWidth && meta.width && meta.width > job.maxWidth) {
      pipeline = pipeline.resize({
        width: job.maxWidth,
        withoutEnlargement: true,
      });
    }

    await pipeline.webp({ quality: job.quality, effort: 6 }).toFile(out);
    const outStat = fs.statSync(out);
    after += outStat.size;

    console.log(
      `${job.rel}: ${mb(stat.size)}MB → ${path.basename(out)} ${mb(outStat.size)}MB (${meta.width}x${meta.height})`,
    );
  }

  console.log(`\nUsed assets total: ${mb(before)}MB → ${mb(after)}MB`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
