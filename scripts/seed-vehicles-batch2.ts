/**
 * AutoAI — Vehicle Catalog Batch 2
 * Adds 3 new vehicles: Kia Sportage Hybrid, Nissan Qashqai, MG4 Electric
 *
 * These extend coverage into:
 *   - Kia Sportage Hybrid: SUV היברידי תחרותי לטוסון, עם ביצועים טובים יותר
 *   - Nissan Qashqai: SUV קומפקטי פופולרי עם מחיר נגיש
 *   - MG4 Electric: חשמלית זולה יותר מה-BYD, נקודת כניסה לחשמל
 *
 * Run from repo root:
 *   npx tsx scripts/seed-vehicles-batch2.ts
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

console.log("🌱 Batch 2 seed starting...\n");

// ─── Makes (add Nissan + MG if not present) ───────────────────────────────
await db.insert(vehicleMakes).values([
  { name: "Nissan", slug: "nissan", countryOfOrigin: "Japan",  active: true },
  { name: "MG",     slug: "mg",     countryOfOrigin: "China",  active: true },
]).onDuplicateKeyUpdate({ set: { active: true } });

// Kia already exists from batch 1

const newCars = [
  {
    makeSlug: "kia",
    model: "Sportage Hybrid", modelSlug: "sportage-hybrid",
    bodyType: "suv", seats: 5, cargoLiters: 543,
    fuelType: "hybrid", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1600, powerHp: 230, combinedConsumption: 6.1,
    newPrice: 130000, marketMinPrice: 118000, marketMaxPrice: 143000,
    estimatedMonthlyCost: 2250,
    reliabilityScore: 82, safetyScore: 90, economyScore: 79, comfortScore: 86, practicalityScore: 88,
    trimName: "Base HEV",
    ownershipNotes: "SUV היברידי תחרותי עם שילוב ייחודי של ביצועים וחסכנות — חלופה חזקה לטוסון.",
    pros: ["כוח גבוה יחסית לסגמנט", "ציוד עשיר", "חסכנות גבוהה לגודלו"],
    cons: ["מחיר גבוה מהמתחרים", "תא המטען קטן מהטוסון"],
    dataStatus: "estimated", dataConfidence: 72,
    // TCO data
    tco7k:  { fuelMonthly: 184, insuranceMonthly: 520, maintenanceMonthly: 190, depreciationMonthly: 1083, totalMonthly: 2098 },
    tco15k: { fuelMonthly: 394, insuranceMonthly: 520, maintenanceMonthly: 210, depreciationMonthly: 1083, totalMonthly: 2328 },
    tco25k: { fuelMonthly: 657, insuranceMonthly: 520, maintenanceMonthly: 230, depreciationMonthly: 1083, totalMonthly: 2611 },
    // Insurance
    insuranceMin: 430, insuranceMax: 610,
    // Market snapshot (Oct 2026)
    priceMin: 118000, priceMedian: 130000, priceMax: 143000, sampleSize: 23,
  },
  {
    makeSlug: "nissan",
    model: "Qashqai", modelSlug: "qashqai",
    bodyType: "suv", seats: 5, cargoLiters: 479,
    fuelType: "petrol", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1300, powerHp: 140, combinedConsumption: 7.0,
    newPrice: 112000, marketMinPrice: 102000, marketMaxPrice: 122000,
    estimatedMonthlyCost: 2120,
    reliabilityScore: 78, safetyScore: 86, economyScore: 72, comfortScore: 84, practicalityScore: 86,
    trimName: "Base",
    ownershipNotes: "SUV קומפקטי פופולרי עם מחיר כניסה אטרקטיבי ושירות נגיש בישראל.",
    pros: ["מחיר אטרקטיבי לסגמנט", "ניסיון ניסאן בישראל", "גמישות תצורות"],
    cons: ["צריכת דלק בינונית", "מנוע קטן תחת עומס כבד"],
    dataStatus: "estimated", dataConfidence: 68,
    // TCO @ 3 km bands
    tco7k:  { fuelMonthly: 272, insuranceMonthly: 450, maintenanceMonthly: 200, depreciationMonthly: 933, totalMonthly: 1976 },
    tco15k: { fuelMonthly: 583, insuranceMonthly: 450, maintenanceMonthly: 225, depreciationMonthly: 933, totalMonthly: 2312 },
    tco25k: { fuelMonthly: 972, insuranceMonthly: 450, maintenanceMonthly: 250, depreciationMonthly: 933, totalMonthly: 2726 },
    // Insurance
    insuranceMin: 370, insuranceMax: 530,
    // Market snapshot
    priceMin: 102000, priceMedian: 112000, priceMax: 122000, sampleSize: 41,
  },
  {
    makeSlug: "mg",
    model: "MG4 Electric", modelSlug: "mg4-electric",
    bodyType: "hatchback", seats: 5, cargoLiters: 363,
    fuelType: "electric", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 0, powerHp: 170, combinedConsumption: 0,
    newPrice: 105000, marketMinPrice: 98000, marketMaxPrice: 115000,
    estimatedMonthlyCost: 1890,
    reliabilityScore: 70, safetyScore: 82, economyScore: 92, comfortScore: 78, practicalityScore: 74,
    trimName: "Standard Range",
    ownershipNotes: "חשמלית ב-₪105,000 — נקודת הכניסה הזולה ביותר לעולם החשמלי בישראל.",
    pros: ["מחיר הכניסה הנמוך ביותר לחשמלית", "עלות נסיעה נמוכה מאוד", "מפרט בטיחות טוב"],
    cons: ["מותג חדש יחסית בישראל", "פחת גבוה כחשמלית", "טווח 350 ק\"מ WLTP בלבד"],
    dataStatus: "estimated", dataConfidence: 65,
    // TCO: EV @ 17kWh/100km × ₪0.60/kWh = ₪0.102/km
    tco7k:  { fuelMonthly: 50,  insuranceMonthly: 485, maintenanceMonthly: 85,  depreciationMonthly: 1042, totalMonthly: 1783 },
    tco15k: { fuelMonthly: 107, insuranceMonthly: 485, maintenanceMonthly: 95,  depreciationMonthly: 1042, totalMonthly: 1850 },
    tco25k: { fuelMonthly: 179, insuranceMonthly: 485, maintenanceMonthly: 110, depreciationMonthly: 1042, totalMonthly: 1937 },
    // Insurance
    insuranceMin: 400, insuranceMax: 570,
    // Market snapshot
    priceMin: 98000, priceMedian: 105000, priceMax: 115000, sampleSize: 14,
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

console.log("\n🎉 Batch 2 seed complete!");
await connection.end();
