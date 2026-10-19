// Validates the vehicle data before any automated (or manual) push.
// Run: node scripts/validate-data.mjs   → exits 1 with a list of problems if anything is off.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = path.join(root, "node_modules/.cache/validate-gen.mjs");
fs.mkdirSync(path.dirname(tmp), { recursive: true });
await build({ entryPoints: [path.join(root, "generations.ts")], outfile: tmp, format: "esm", bundle: true, logLevel: "error" });
const { MAKES, PRICES_VERIFIED } = await import(`${tmp}?t=${Date.now()}`);

const problems = [];
const bad = (where, msg) => problems.push(`${where}: ${msg}`);
const year = new Date().getFullYear();
if (!/^\d{4}-\d{2}-\d{2}$/.test(PRICES_VERIFIED ?? "")) bad("PRICES_VERIFIED", "missing or not YYYY-MM-DD");
const ids = new Set();
for (const mk of MAKES) {
  for (const m of mk.models) {
    const w = `${mk.id}/${m.id}`;
    if (ids.has(w)) bad(w, "duplicate id"); ids.add(w);
    if (!m.gens.length) bad(w, "no generations");
    if (m.price) {
      const [a, b] = m.price;
      if (!Number.isInteger(a) || !Number.isInteger(b)) bad(w, "price must be whole shekels");
      if (a > b) bad(w, "price from > to");
      if (a < 50000 || b > 2500000) bad(w, `price out of plausible range (${a}–${b})`);
      if (m.status !== "on_sale") bad(w, "has a price but status is not on_sale");
    }
    if (m.status === "on_sale" && !m.gens.some((g) => g.to === null)) bad(w, "on sale but no current generation (to: null)");
    let prevFrom = 0;
    for (const g of m.gens) {
      const gw = `${w} ${g.code}`;
      if (g.from < 2000 || g.from > year + 1) bad(gw, "bad from year");
      if (g.to !== null && (g.to < g.from || g.to > year + 1)) bad(gw, "bad to year");
      if (g.from < prevFrom) bad(gw, "generations not in chronological order"); prevFrom = g.from;
      if (g.ncap !== null && !(Number.isInteger(g.ncap) && g.ncap >= 0 && g.ncap <= 5)) bad(gw, "ncap must be 0–5 or null");
      if (!(g.cons > 0 && g.cons < 40)) bad(gw, "consumption out of range");
      if (!g.pt.length) bad(gw, "no powertrain");
      if (!g.checks.length) bad(gw, "no checks");
    }
  }
}
// The recommendations catalog must still build and every total must equal its components + licensing.
const cat = fs.readFileSync(path.join(root, "catalogData.ts"), "utf8");
const cars = JSON.parse(cat.slice(cat.indexOf("= [") + 2).replace(/;\s*$/, ""));
for (const c of cars) for (const km of [7000, 15000, 25000]) {
  const b = c.bands[km];
  if (b.total !== b.fuel + b.insurance + b.maintenance + b.depreciation + 121) bad(`catalog ${c.id}@${km}`, "total ≠ components + 121");
  if (c.price < 50000 || c.price > 2500000) bad(`catalog ${c.id}`, "price out of range");
}
if (problems.length) { console.error(`✗ ${problems.length} problem(s):\n- ` + problems.join("\n- ")); process.exit(1); }
console.log(`✓ data valid: ${MAKES.length} makes, ${ids.size} models, ${cars.length} catalog cars (prices verified ${PRICES_VERIFIED})`);
