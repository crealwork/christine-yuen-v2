import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";

type ImageMode = "generate" | "edit";
type ImageEntry = {
  slug: string;
  mode: ImageMode;
  prompt: string;
  size: string;
  quality: "low" | "medium" | "high";
  inputImage?: string;
};
type Config = { stylePreset: string; images: ImageEntry[] };

const OUTPUT_DIR = path.resolve("public/images/editorial");
const LOG_PATH = path.resolve(".image-gen-log.json");
const HARD_CAP_USD = 20;

export function buildPrompt(stylePreset: string, prompt: string): string {
  return `${stylePreset}\n\n${prompt}`;
}

function appendLog(entry: Record<string, unknown>) {
  const existing: unknown[] = fs.existsSync(LOG_PATH)
    ? JSON.parse(fs.readFileSync(LOG_PATH, "utf8"))
    : [];
  existing.push(entry);
  fs.writeFileSync(LOG_PATH, JSON.stringify(existing, null, 2));
}

function totalCost(): number {
  if (!fs.existsSync(LOG_PATH)) return 0;
  const entries = JSON.parse(fs.readFileSync(LOG_PATH, "utf8")) as Array<{ costUSD?: number }>;
  return entries.reduce((sum, e) => sum + (e.costUSD ?? 0), 0);
}

function estimateCost(quality: string, size: string): number {
  const base = quality === "high" ? 0.18 : quality === "medium" ? 0.07 : 0.03;
  const sizeMultiplier = size.includes("1536") ? 1.4 : 1.0;
  return base * sizeMultiplier;
}

type SupportedSize = "1024x1024" | "1024x1536" | "1536x1024" | "auto";

async function generateOne(client: OpenAI, entry: ImageEntry, fullPrompt: string): Promise<string> {
  const size = entry.size as SupportedSize;
  if (entry.mode === "edit") {
    if (!entry.inputImage) throw new Error(`${entry.slug}: edit mode requires inputImage`);
    // gpt-image-2 not supported on /v1/images/edits as of 2026-04 ("Value must be 'dall-e-2'").
    // Use gpt-image-1.5 which explicitly supports edits with high quality.
    const result = await client.images.edit({
      model: "gpt-image-1.5",
      image: fs.createReadStream(path.resolve(entry.inputImage)) as unknown as File,
      prompt: fullPrompt,
      size,
    });
    return result.data?.[0]?.b64_json ?? "";
  }
  const result = await client.images.generate({
    model: "gpt-image-2",
    prompt: fullPrompt,
    size,
    quality: entry.quality,
  });
  return result.data?.[0]?.b64_json ?? "";
}

async function withRetry<T>(fn: () => Promise<T>, slug: string, attempts = 3): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      const wait = 1000 * 2 ** i;
      console.warn(`  retry ${i + 1}/${attempts} for ${slug} after ${wait}ms — ${(err as Error).message}`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw last;
}

function loadRerollList(): string[] | null {
  const idx = process.argv.indexOf("--only");
  if (idx === -1) return null;
  const list = process.argv[idx + 1];
  if (!list) return null;
  return list.split(",").map((s) => s.trim()).filter(Boolean);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("ERROR: OPENAI_API_KEY missing. Source it from /c/Users/Dan/.config/env/.keys.txt before running.");
    process.exit(1);
  }

  const config: Config = JSON.parse(fs.readFileSync(path.resolve("scripts/prompts.json"), "utf8"));
  const force = process.argv.includes("--force");
  const onlyList = loadRerollList();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  for (const entry of config.images) {
    if (onlyList && !onlyList.includes(entry.slug)) {
      continue;
    }

    const outPath = path.join(OUTPUT_DIR, `${entry.slug}.jpg`);
    if (fs.existsSync(outPath) && !force) {
      console.log(`SKIP  ${entry.slug} (exists, use --force to regenerate)`);
      continue;
    }

    if (totalCost() >= HARD_CAP_USD) {
      console.error(`COST CAP: cumulative $${totalCost().toFixed(2)} >= $${HARD_CAP_USD}. Aborting.`);
      process.exit(2);
    }

    console.log(`GEN   ${entry.slug} (${entry.mode}, ${entry.quality}, ${entry.size})`);
    const fullPrompt = buildPrompt(config.stylePreset, entry.prompt);

    try {
      const b64 = await withRetry(() => generateOne(client, entry, fullPrompt), entry.slug);
      if (!b64) {
        console.error(`  no image returned for ${entry.slug}`);
        continue;
      }
      fs.writeFileSync(outPath, Buffer.from(b64, "base64"));
      const cost = estimateCost(entry.quality, entry.size);
      appendLog({
        slug: entry.slug,
        timestamp: new Date().toISOString(),
        mode: entry.mode,
        size: entry.size,
        quality: entry.quality,
        costUSD: cost,
        prompt: fullPrompt,
      });
      console.log(`  saved -> ${outPath}  (~$${cost.toFixed(3)})`);
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  ${entry.slug} FAILED: ${(err as Error).message}`);
    }
  }

  console.log(`\nTOTAL ESTIMATED COST: $${totalCost().toFixed(2)}`);
}

if (!process.env.VITEST) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
