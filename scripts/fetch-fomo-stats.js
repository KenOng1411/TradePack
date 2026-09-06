/**
 * fetch-fomo-stats.js
 *
 * Pulls a small set of independently-verifiable Fomo protocol metrics from the
 * DeFiLlama public API (free, no API key) and writes them to fomo-stats.json.
 * The site build (or a small client component) reads that JSON to render a
 * "Fomo by the numbers" block on /review — with a real source link and a real
 * last-updated timestamp, instead of a static, undated claim.
 *
 * Verified against the live API on 2026-09-06:
 *   https://api.llama.fi/summary/fees/fomo  -> total30d: 20,479,330   (fees)
 *   https://api.llama.fi/summary/dexs/fomo  -> total30d: 1,111,246,796 (DEX volume)
 *
 * NOT included, on purpose (do not fake these):
 *   - Perp / derivatives volume: DeFiLlama only exposes this via the paid
 *     Pro API (https://pro-api.llama.fi/{API_KEY}/api/summary/derivatives/fomo).
 *     If you buy a Pro key later, add a third fetch below the same way.
 *   - Active Addresses (24h) / Transactions (24h): no public DeFiLlama API
 *     endpoint returns these at all (confirmed against their docs) — the
 *     numbers on the protocol page are UI-only. Don't scrape the HTML page
 *     for these; if you want them on-site, update them by hand occasionally
 *     and label them "cập nhật thủ công vào [ngày]", never imply they're live.
 *
 * Run this on a schedule (weekly is plenty — these are 30-day rolling totals,
 * they don't move fast day to day). A cron job, a GitHub Action, or a simple
 * `node fetch-fomo-stats.js` before each site build all work.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "fomo-stats.json");

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "tradepack.online-stats-fetcher/1.0" },
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${url} -> HTTP ${res.status}`);
  }
  return res.json();
}

function formatUsd(n) {
  if (typeof n !== "number" || Number.isNaN(n)) return null;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

async function main() {
  const [fees, dex] = await Promise.all([
    fetchJson("https://api.llama.fi/summary/fees/fomo"),
    fetchJson("https://api.llama.fi/summary/dexs/fomo"),
  ]);

  if (typeof fees.total30d !== "number" || typeof dex.total30d !== "number") {
    throw new Error(
      "DeFiLlama response shape changed (missing total30d) — check the API " +
        "manually at https://api.llama.fi/summary/fees/fomo before trusting this output."
    );
  }

  const stats = {
    source: "DeFiLlama",
    sourceUrl: "https://defillama.com/protocol/fomo",
    fetchedAt: new Date().toISOString(),
    fees30d: { raw: fees.total30d, formatted: formatUsd(fees.total30d) },
    dexVolume30d: { raw: dex.total30d, formatted: formatUsd(dex.total30d) },
    // Deliberately omitted — see header comment: perpVolume30d (needs Pro API key),
    // activeAddresses24h / transactions24h (no API at all).
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(stats, null, 2));
  console.log(`Wrote ${OUTPUT_PATH}:`);
  console.log(stats);
}

main().catch((err) => {
  console.error("fetch-fomo-stats failed:", err.message);
  process.exit(1);
});
