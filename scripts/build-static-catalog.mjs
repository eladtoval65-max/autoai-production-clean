// Builds catalogData.ts from the seed scripts so the site has the full, sourced
// catalog even when the database isn't connected. Run: node scripts/build-static-catalog.mjs
// Every figure stays an estimate with its confidence; nothing is invented here —
// 7k/25k bands for single-band rows scale only fuel (linear in km) and maintenance (±12%).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = ["seed-real-data", "seed-vehicles-batch2", "seed-vehicles-batch3", "seed-vehicles-batch4", "seed-vehicles-batch5", "seed-vehicles-batch6", "seed-vehicles-batch7", "seed-vehicles-batch8", "seed-vehicles-batch9", "seed-vehicles-batch10", "seed-vehicles-batch11", "seed-vehicles-batch12", "seed-vehicles-batch13", "seed-vehicles-batch14", "seed-vehicles-batch15", "seed-vehicles-batch16", "seed-vehicles-batch17", "seed-vehicles-batch18"];
const MAKES = { toyota: "Toyota", hyundai: "Hyundai", mazda: "Mazda", skoda: "Skoda", kia: "Kia", byd: "BYD", nissan: "Nissan", mg: "MG", ford: "Ford", volkswagen: "Volkswagen", peugeot: "Peugeot", jaecoo: "Jaecoo", chery: "Chery", tesla: "Tesla", suzuki: "Suzuki", honda: "Honda", citroen: "Citroën", lexus: "Lexus", subaru: "Subaru", ora: "ORA", xpeng: "XPENG", kgm: "KGM", jeep: "Jeep", "alfa-romeo": "Alfa Romeo", mini: "MINI", geely: "Geely", deepal: "Deepal", mitsubishi: "Mitsubishi" };
const FUEL = { hybrid: "Hybrid", petrol: "Petrol", electric: "Electric", diesel: "Diesel" };
const REG = 121;
// Energy prices: the seeds were priced at seedBasis; fuel components are rescaled to today's official prices.
const ENERGY = JSON.parse(fs.readFileSync(path.join(root, "src/data/energyPrices.json"), "utf8"));
const energyFactor = (fuelType) => fuelType === "electric" ? ENERGY.electricityPerKwh / ENERGY.seedBasis.electricityPerKwh
  : fuelType === "diesel" ? ENERGY.dieselPerL / ENERGY.seedBasis.dieselPerL : ENERGY.petrolPerL / ENERGY.seedBasis.petrolPerL;

function readArray(file) {
  const src = fs.readFileSync(path.join(root, "scripts", `${file}.ts`), "utf8");
  const m = src.match(/const (cars|newCars)\s*=\s*\[/);
  let i = m.index + m[0].length - 1, depth = 0, j = i;
  for (; j < src.length; j++) { const ch = src[j]; if (ch === "[") depth++; else if (ch === "]" && --depth === 0) break; }
  return new Function(`return ${src.slice(i, j + 1)}`)();
}

const key = (c) => `${c.makeSlug}:${c.model.toLowerCase().replace(/ hybrid$/, "")}`;
const merged = new Map();
for (const f of files) for (const c of readArray(f)) merged.set(key(c), { ...merged.get(key(c)), ...c, batch: f });

const band = (b) => ({ fuel: b.fuelMonthly, insurance: b.insuranceMonthly, maintenance: b.maintenanceMonthly, depreciation: b.depreciationMonthly, total: b.totalMonthly });
const score = (v, kind) => (v > 10 ? v : kind === "safety" && v <= 5 ? v * 19 : v * 10);

const out = [...merged.values()].filter((c) => !c.discontinued).map((c) => {
  let bands;
  if (c.tco15k) bands = { 7000: band(c.tco7k ?? c.tco15k), 15000: band(c.tco15k), 25000: band(c.tco25k ?? c.tco15k) };
  else {
    const mid = { fuel: c.fuelMonthly, insurance: c.insuranceMonthly, maintenance: c.maintenanceMonthly, depreciation: c.depreciationMonthly };
    const at = (km, maintF) => { const b = { ...mid, fuel: Math.round(mid.fuel * km / 15000), maintenance: Math.round(mid.maintenance * maintF) }; return { ...b, total: b.fuel + b.insurance + b.maintenance + b.depreciation + REG }; };
    bands = { 7000: at(7000, 0.88), 15000: { ...mid, total: c.totalMonthly ?? mid.fuel + mid.insurance + mid.maintenance + mid.depreciation + REG }, 25000: at(25000, 1.12) };
  }
  // Totals are always recomputed from components + licensing; seed totals have had typos.
  for (const km of [7000, 15000, 25000]) {
    bands[km] = { ...bands[km], fuel: Math.round(bands[km].fuel * energyFactor(c.fuelType)) };
    const b = bands[km]; const sum = b.fuel + b.insurance + b.maintenance + b.depreciation + REG;
    b.total = sum;
  }
  const price = c.priceMedian ?? c.newPrice;
  return {
    id: `${c.makeSlug}-${c.modelSlug}`,
    make: MAKES[c.makeSlug] ?? c.makeSlug,
    model: c.model,
    trim: c.trimName ?? "",
    bodyType: c.bodyType,
    fuelType: FUEL[c.fuelType] ?? c.fuelType,
    years: `${c.yearFrom}${c.yearTo && c.yearTo !== c.yearFrom ? `–${c.yearTo}` : ""}`,
    seats: c.seats ?? null, cargoLiters: c.cargoLiters ?? null, powerHp: c.powerHp ?? null,
    consumption: c.combinedConsumption || null,
    price, priceMin: c.priceMin ?? c.marketMinPrice ?? null, priceMax: c.priceMax ?? c.marketMaxPrice ?? null, sampleSize: c.sampleSize ?? null,
    newPrice: c.newPrice ?? null,
    reliability: score(c.reliabilityScore), safety: score(c.safetyScore, "safety"), economy: score(c.economyScore),
    comfort: score(c.comfortScore), practicality: score(c.practicalityScore),
    insuranceMin: c.insuranceMin ?? null, insuranceMax: c.insuranceMax ?? null,
    why: c.ownershipNotes ?? "", pros: c.pros ?? [], cons: c.cons ?? [],
    confidence: c.dataConfidence ?? 60,
    priceSource: c.priceSource ?? null,
    bands,
  };
}).sort((a, b) => a.price - b.price);

const header = `// GENERATED by scripts/build-static-catalog.mjs from scripts/seed-*.ts — do not edit by hand.\n// All prices and monthly costs are CamaOla estimates (see confidence); insurance is never a quote.\n`;
const body = `export type Band = { fuel: number; insurance: number; maintenance: number; depreciation: number; total: number };
export type CatalogCar = {
  id: string; make: string; model: string; trim: string; bodyType: string; fuelType: string; years: string;
  seats: number | null; cargoLiters: number | null; powerHp: number | null; consumption: number | null;
  price: number; priceMin: number | null; priceMax: number | null; sampleSize: number | null; newPrice: number | null;
  reliability: number; safety: number; economy: number; comfort: number; practicality: number;
  insuranceMin: number | null; insuranceMax: number | null; why: string; pros: string[]; cons: string[];
  confidence: number; priceSource: string | null; bands: Record<7000 | 15000 | 25000, Band>;
};
export const CATALOG_UPDATED = "2026-10";
export const STATIC_CATALOG: CatalogCar[] = ${JSON.stringify(out, null, 1)};\n`;
fs.writeFileSync(path.join(root, "src/data/catalogData.ts"), header + body);
console.log(`[catalog] ${out.length} models → src/data/catalogData.ts`);
for (const c of out) console.log(`  ${c.make} ${c.model} · ${c.fuelType} · ₪${c.price.toLocaleString()} · ₪${c.bands[15000].total}/mo · conf ${c.confidence}`);
