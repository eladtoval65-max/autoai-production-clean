/**
 * AutoAI — Vehicle Catalog Batch 4
 * Adds 2 new vehicles: Ford Puma Hybrid, Volkswagen Golf
 *
 * Coverage expansion:
 *   - Ford Puma Hybrid: קרוסאובר עירוני היברידי קומפקטי — קומפקטי, חסכוני, אירופאי
 *   - Volkswagen Golf: האיקון הקומפקטי — מהנדסות VAG, נסיעה נעימה, מחיר בינוני
 *
 * Run from repo root:
 *   npx tsx scripts/seed-vehicles-batch4.ts
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import {
  vehicleSources, vehicleMakes, vehicleModels, vehicleTrims,
  ownershipCosts, insuranceEstimates, vehicleMarketSnapshots,
} from "../schema";

dotenv.config({ path: ".env.local" });

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection);

console.log("🌱 Batch 4 seed starting...\n");

// ─── Makes (add Ford + VW if not present) ────────────────────────────────────
await db.insert(vehicleMakes).values([
  { name: "Ford",       slug: "ford",       countryOfOrigin: "USA",     active: true },
  { name: "Volkswagen", slug: "volkswagen", countryOfOrigin: "Germany", active: true },
]).onDuplicateKeyUpdate({ set: { active: true } });

const newCars = [
  {
    makeSlug: "ford",
    model: "Puma Hybrid", modelSlug: "puma-hybrid",
    bodyType: "suv", seats: 5, cargoLiters: 456,
    fuelType: "hybrid", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1000, powerHp: 155, combinedConsumption: 5.8,
    newPrice: 118000, marketMinPrice: 108000, marketMaxPrice: 128000,
    estimatedMonthlyCost: 2050,
    reliabilityScore: 80, safetyScore: 86, economyScore: 82, comfortScore: 84, practicalityScore: 80,
    trimName: "Titanium mHEV",
    ownershipNotes: "קרוסאובר עירוני קומפקטי עם מנוע מילד-היברידי — נוח, מניג מהנה, ועלות שוטפת סבירה לגודלו.",
    pros: ["גודל קומפקטי לחנייה בעיר", "ידית מיתוג נוחה", "מנהוג מהנה", "צריכה נמוכה"],
    cons: ["אמינות פורד בישראל פחות מוכחת", "שירות מצומצם יחסית"],
    dataStatus: "estimated", dataConfidence: 65,
    // TCO: 5.8L/100km × ₪7.10/L
    // 7k:  5.8 × 7.10 × 7000/100/12  = ₪239
    // 15k: 5.8 × 7.10 × 15000/100/12 = ₪513
    // 25k: 5.8 × 7.10 × 25000/100/12 = ₪855
    tco7k:  { fuelMonthly: 239, insuranceMonthly: 470, maintenanceMonthly: 195, depreciationMonthly: 983, totalMonthly: 2008 },
    tco15k: { fuelMonthly: 513, insuranceMonthly: 470, maintenanceMonthly: 220, depreciationMonthly: 983, totalMonthly: 2307 },
    tco25k: { fuelMonthly: 855, insuranceMonthly: 470, maintenanceMonthly: 245, depreciationMonthly: 983, totalMonthly: 2674 },
    // Insurance
    insuranceMin: 390, insuranceMax: 550,
    // Market snapshot (Oct 2026)
    priceMin: 108000, priceMedian: 118000, priceMax: 128000, sampleSize: 18,
  },
  {
    makeSlug: "volkswagen",
    model: "Golf", modelSlug: "golf",
    bodyType: "hatchback", seats: 5, cargoLiters: 380,
    fuelType: "petrol", transmission: "automatic",
    yearFrom: 2023, yearTo: 2025,
    engineCc: 1500, powerHp: 150, combinedConsumption: 6.8,
    newPrice: 108000, marketMinPrice: 99000, marketMaxPrice: 118000,
    estimatedMonthlyCost: 2040,
    reliabilityScore: 82, safetyScore: 87, economyScore: 74, comfortScore: 88, practicalityScore: 82,
    trimName: "Style TSI",
    ownershipNotes: "גולף — הסטנדרט להאצ׳בק אירופאי. מהנדסות VAG מוכחת, נהיגה מאוזנת ועיצוב פנים איכותי.",
    pros: ["נהיגה איזונה ומהנה", "איכות פנים גבוהה", "שירות VAG נפוץ", "ערך יד שנייה יציב"],
    cons: ["מחיר גבוה לקומפקט", "תא מטען קטן", "צריכת דלק בינונית"],
    dataStatus: "estimated", dataConfidence: 68,
    // TCO: 6.8L/100km × ₪7.10/L
    // 7k:  6.8 × 7.10 × 7000/100/12  = ₪280
    // 15k: 6.8 × 7.10 × 15000/100/12 = ₪600
    // 25k: 6.8 × 7.10 × 25000/100/12 = ₪1000
    tco7k:  { fuelMonthly: 280, insuranceMonthly: 430, maintenanceMonthly: 210, depreciationMonthly: 900, totalMonthly: 1941 },
    tco15k: { fuelMonthly: 600, insuranceMonthly: 430, maintenanceMonthly: 235, depreciationMonthly: 900, totalMonthly: 2286 },
    tco25k: { fuelMonthly: 1000, insuranceMonthly: 430, maintenanceMonthly: 265, depreciationMonthly: 900, totalMonthly: 2716 },
    // Insurance
    insuranceMin: 355, insuranceMax: 510,
    // Market snapshot
    priceMin: 99000, priceMedian: 108000, priceMax: 118000, sampleSize: 33,
  },
];

// ─── Fetch make IDs ─────────────────────────────────────────────────────────
const makeRows = await db.select().from(vehicleMakes);
const makeMap: Record<string, number> = {};
for (const m of makeRows) makeMap[m.slug] = m.id;

// Fetch source ID
const sourceRows = await db.select().from(vehicleSources).limit(1);
const sourceId = sourceRows[0]?.id ?? null;

for (const car of newCars) {
  const makeId = makeMap[car.makeSlug];
  if (!makeId) { console.warn(`⚠️  Make not found: ${car.makeSlug}`); continue; }

  // Insert/get model
  await db.insert(vehicleModels).values({
    makeId, name: car.model, slug: car.modelSlug,
    bodyType: car.bodyType, seats: car.seats, cargoLiters: car.cargoLiters, active: true,
  }).onDuplicateKeyUpdate({ set: { active: true } });

  const modelRow = await db.select({ id: vehicleModels.id }).from(vehicleModels)
    .where(eq(vehicleModels.slug, car.modelSlug)).limit(1);
  const modelId = modelRow[0]?.id;
  if (!modelId) { console.warn(`⚠️  Could not resolve modelId for ${car.model}`); continue; }

  // Insert/get trim
  await db.insert(vehicleTrims).values({
    modelId,
    trimName: car.trimName,
    yearFrom: car.yearFrom, yearTo: car.yearTo,
    fuelType: car.fuelType, transmission: car.transmission,
    engineCc: car.engineCc, powerHp: car.powerHp,
    combinedConsumption: String(car.combinedConsumption),
    newPrice: car.newPrice,
    marketMinPrice: car.marketMinPrice,
    marketMaxPrice: car.marketMaxPrice,
    estimatedMonthlyCost: car.estimatedMonthlyCost,
    reliabilityScore: car.reliabilityScore, safetyScore: car.safetyScore,
    economyScore: car.economyScore, comfortScore: car.comfortScore, practicalityScore: car.practicalityScore,
    ownershipNotes: car.ownershipNotes,
    pros: JSON.stringify(car.pros), cons: JSON.stringify(car.cons),
    dataStatus: car.dataStatus, dataConfidence: car.dataConfidence,
    active: true,
  }).onDuplicateKeyUpdate({ set: { estimatedMonthlyCost: car.estimatedMonthlyCost } });

  const trimRow = await db.select({ id: vehicleTrims.id }).from(vehicleTrims)
    .where(eq(vehicleTrims.modelId, modelId)).limit(1);
  const trimId = trimRow[0]?.id;
  if (!trimId) { console.warn(`⚠️  Could not resolve trimId for ${car.model}`); continue; }

  console.log(`\n✅ ${car.makeSlug} ${car.model} (trimId=${trimId})`);

  // ownershipCosts — 3 km bands
  for (const [bandKey, tco] of [["tco7k", car.tco7k], ["tco15k", car.tco15k], ["tco25k", car.tco25k]] as const) {
    const annualKm = bandKey === "tco7k" ? 7000 : bandKey === "tco15k" ? 15000 : 25000;
    await db.insert(ownershipCosts).values({
      trimId, annualKm,
      financingMonthly: 0,
      fuelMonthly: tco.fuelMonthly,
      insuranceMonthly: tco.insuranceMonthly,
      maintenanceMonthly: tco.maintenanceMonthly,
      depreciationMonthly: tco.depreciationMonthly,
      totalMonthly: tco.totalMonthly,
      isEstimate: true,
      notes: `TCO אומדן — ${annualKm.toLocaleString()} ק"מ/שנה`,
    }).onDuplicateKeyUpdate({ set: { totalMonthly: tco.totalMonthly } });
    console.log(`  💰 TCO @ ${annualKm} km: ₪${tco.totalMonthly}/mo`);
  }

  // insuranceEstimates
  await db.insert(insuranceEstimates).values({
    trimId,
    coverageType: "comprehensive",
    driverProfile: "standard-30-50-no-accidents",
    monthlyMin: car.insuranceMin,
    monthlyMax: car.insuranceMax,
    deductibleEstimate: 3000,
    sourceId,
    disclaimer: "הערכה בלבד על בסיס ממוצעי שוק — אינה מחיר ביטוח מחייב; יש לקבל הצעת מחיר מחברת ביטוח.",
    verifiedAt: new Date("2026-10-01T00:00:00Z"),
  }).onDuplicateKeyUpdate({ set: { monthlyMax: car.insuranceMax } });
  console.log(`  🛡️  Insurance: ₪${car.insuranceMin}–₪${car.insuranceMax}/mo`);

  // vehicleMarketSnapshots
  await db.insert(vehicleMarketSnapshots).values({
    trimId, sourceId,
    priceMin: car.priceMin, priceMedian: car.priceMedian, priceMax: car.priceMax,
    sampleSize: car.sampleSize,
    observedAt: new Date("2026-10-01T00:00:00Z"),
    isOfficial: false,
    disclaimer: "הנתונים מבוססים על ממוצע מחירי שוק מ-אוקטובר 2026 ואינם הצעת מחיר מחייבת.",
  }).onDuplicateKeyUpdate({ set: { priceMedian: car.priceMedian } });
  console.log(`  📊 Market: ₪${car.priceMin.toLocaleString()}–₪${car.priceMax.toLocaleString()} (n=${car.sampleSize})`);
}

console.log("\n🎉 Batch 4 seed complete!");
await connection.end();
