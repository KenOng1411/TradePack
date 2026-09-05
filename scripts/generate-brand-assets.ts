/**
 * Generates TradePack's brand image assets with the Gemini image API, then
 * resizes/optimizes them locally with sharp (no extra API calls for that part).
 *
 * Usage:
 *   npm run gen:brand                     # generate + optimize every asset
 *   npm run gen:brand -- hero-illustration # regenerate just one asset by id
 *
 * Requires GEMINI_API_KEY in .env (see .env.example). Never run this
 * automatically from `astro build` — it costs API quota and every generated
 * image should be reviewed by a human before it ships on the site.
 *
 * Note: the logo, favicon, and OG image are real final assets (supplied
 * directly by the project owner, not AI-generated) — see src/assets/brand/
 * logo-icon.png and public/images/og-image.png / public/favicon-*.png.
 * This script no longer generates placeholders for those.
 */
import "dotenv/config";
import { GoogleGenAI, SafetyFilterLevel, PersonGeneration } from "@google/genai";
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const RAW_DIR = path.join(ROOT, "src/assets/brand/raw");
const BRAND_DIR = path.join(ROOT, "src/assets/brand");
const PUBLIC_IMAGES_DIR = path.join(ROOT, "public/images");

const IMAGE_MODEL = "imagen-4.0-generate-001";

interface BrandAsset {
  id: string;
  outputFile: string;
  aspectRatio: string;
  prompt: string;
}

interface BrandPromptsConfig {
  sharedNegativePrompt: string;
  assets: BrandAsset[];
}

async function loadConfig(): Promise<BrandPromptsConfig> {
  const raw = await readFile(path.join(__dirname, "brand-prompts.json"), "utf-8");
  return JSON.parse(raw) as BrandPromptsConfig;
}

async function ensureDirs() {
  for (const dir of [RAW_DIR, BRAND_DIR, PUBLIC_IMAGES_DIR]) {
    if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  }
}

async function generateAsset(ai: GoogleGenAI, asset: BrandAsset, negativePrompt: string) {
  console.log(`\n→ Generating "${asset.id}" (${asset.outputFile})...`);

  const response = await ai.models.generateImages({
    model: IMAGE_MODEL,
    prompt: asset.prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: asset.aspectRatio,
      negativePrompt,
      includeRaiReason: true,
      safetyFilterLevel: SafetyFilterLevel.BLOCK_ONLY_HIGH,
      personGeneration: PersonGeneration.DONT_ALLOW,
    },
  });

  const result = response.generatedImages?.[0];
  if (!result?.image?.imageBytes) {
    console.error(`  ✗ No image returned for "${asset.id}". Reason: ${result?.raiFilteredReason ?? "unknown"}`);
    return false;
  }

  const buffer = Buffer.from(result.image.imageBytes, "base64");
  const outputPath = path.join(RAW_DIR, asset.outputFile);
  await writeFile(outputPath, buffer);
  console.log(`  ✓ Saved raw image to ${path.relative(ROOT, outputPath)}`);
  return true;
}

/** Resize/optimize already-generated raw images. Pure sharp — no API calls. */
async function optimizeAssets(assetIds: string[]) {
  console.log("\nOptimizing generated assets with sharp...");

  const rawPath = (file: string) => path.join(RAW_DIR, file);

  if (assetIds.includes("hero-illustration") && existsSync(rawPath("hero-illustration.png"))) {
    await sharp(rawPath("hero-illustration.png"))
      .resize(1920, null, { withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(path.join(BRAND_DIR, "hero-illustration.png"));
    console.log("  ✓ hero-illustration.png (max width 1920)");
  }
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      "Missing GEMINI_API_KEY. Copy .env.example to .env and set GEMINI_API_KEY before running `npm run gen:brand`."
    );
    process.exit(1);
  }

  const config = await loadConfig();
  const requestedIds = process.argv.slice(2);
  const assetsToRun = requestedIds.length
    ? config.assets.filter((a) => requestedIds.includes(a.id))
    : config.assets;

  if (requestedIds.length && assetsToRun.length === 0) {
    console.error(`No matching asset id(s): ${requestedIds.join(", ")}`);
    console.error(`Available ids: ${config.assets.map((a) => a.id).join(", ")}`);
    process.exit(1);
  }

  await ensureDirs();

  const ai = new GoogleGenAI({ apiKey });
  const generatedIds: string[] = [];

  for (const asset of assetsToRun) {
    const ok = await generateAsset(ai, asset, config.sharedNegativePrompt);
    if (ok) generatedIds.push(asset.id);
  }

  if (generatedIds.length === 0) {
    console.error("\nNo assets were generated successfully. Skipping optimize step.");
    process.exit(1);
  }

  await optimizeAssets(generatedIds);

  console.log(
    "\nDone. Review the images in src/assets/brand/ (and public/) before using them on the site — nothing here is wired in automatically."
  );
}

main().catch((err) => {
  console.error("\nBrand asset generation failed:", err);
  process.exit(1);
});
