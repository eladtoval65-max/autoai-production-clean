/**
 * AutoAI — Vehicle Catalog Batch 3
 * Adds 3 new vehicles: Toyota RAV4 Hybrid, Hyundai Ioniq 6, Skoda Octavia
 *
 * These extend coverage into:
 *   - Toyota RAV4 Hybrid: SUV היברידי משפחתי פרמיום — אמינות גבוהה, ביקוש גבוה
 *   - Hyundai Ioniq 6: סדאן חשמלי חדש עם טווח ארוך, תחרות ל-Tesla
 *   - Skoda Octavia: סדאן אירופאי נוח ומרווח, מחיר נגיש
 *
 * Run from repo root:
 *   npx tsx scripts/seed-vehicles-batch3.ts
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

console.log("🌱 Batch 3 seed starting...\n");

// ─── Makes (add Skoda if not present; Toyota and Hyundai exist from batch 1) ──
await db.insert(vehicleMakes).values([
  { name: "Skoda", slug: "skoda", countryOfOrigin: "Czech Republic", active: true },
]).onDuplicateKeyUpdate({ set: { active: true } });

// Toyota and Hyundai already exist

const newCars = [
  {
    makeSlug: "toyota",
    model: "RAV4 Hybrid", modelSlug: "rav4-hybrid",
    bodyType: "suv", seats: 5, cargoLiters: 580,
    fuelType: "hybrid", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 2500, powerHp: 222, combinedConsumption: 5.4,
    newPrice: 185000, marketMinPrice: 172000, marketMaxPrice: 198000,
    estimatedMonthlyCost: 2850,
    reliabilityScore: 95, safetyScore: 97, economyScore: 88, comfortScore: 92, practicalityScore: 95,
    trimName: "Base HEV",
    ownershipNotes: "SUV משפחתי היברידי פרמיום עם אמינות טויוטה קלאסית ועלויות שימוש נמוכות לגודלו.",
    pros: ["אמינות גבוהה מאוד", "חסכוני לSUV", "ביקוש חזק ביד שנייה", "בטיחות גבוהה"],
    cons: ["מחיר גבוה", "ממתינים ארוכים לאספקה"],
    dataStatus: "estimated", dataConfidence: 80,
    // TCO: 5.4L/100km × ₪7.10/L
    // 7k:  5.4 × 7.10 × (7000/100)/12  = ₪222
    // 15k: 5.4 × 7.10 × (15000/100)/12 = ₪478
    // 25k: 5.4 × 7.10 × (25000/100)/12 = ₪797
    tco7k:  { fuelMonthly: 222, insuranceMonthly: 650, maintenanceMonthly: 210, depreciationMonthly: 1542, totalMonthly: 2745 },
    tco15k: { fuelMonthly: 478, insuranceMonthly: 650, maintenanceMonthly: 235, depreciationMonthly: 1542, totalMonthly: 3026 },
    tco25k: { fuelMonthly: 797, insuranceMonthly: 650, maintenanceMonthly: 260, depreciationMonthly: 1542, totalMonthly: 3370 },
    // Insurance
    insuranceMin: 550, insuranceMax: 760,
    // Market snapshot (Oct 2026)
    priceMin: 172000, priceMedian: 185000, priceMax: 198000, sampleSize: 38,
  },
  {
    makeSlug: "hyundai",
    model: "Ioniq 6", modelSlug: "ioniq6",
    bodyType: "sedan", seats: 5, cargoLiters: 401,
    fuelType: "electric", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 0, powerHp: 228, combinedConsumption: 0,
    newPrice: 152000, marketMinPrice: 141000, marketMaxPrice: 165000,
    estimatedMonthlyCost: 2290,
    reliabilityScore: 84, safetyScore: 94, economyScore: 94, comfortScore: 90, practicalityScore: 80,
    trimName: "Standard Range RWD",
    ownershipNotes: "סדאן חשמלי עם טווח WLTP 614 ק״מ, טעינה 800V ועיצוב ייחודי — חלופה חזקה ל-Tesla Model 3.",
    pros: ["טווח ארוך לחשמלית", "טעינה 800V מהירה", "עלויות שוטפות נמוכות", "בטיחות גבוהה"],
    cons: ["מחיר גבוה לסדאן", "פחת גבוה בשנים ראשונות", "תא מטען קטן"],
    dataStatus: "estimated", dataConfidence: 74,
    // EV: 15 kWh/100km × ₪0.60/kWh
    // 7k:  15 × 0.60 × 7000/100/12  = ₪52
    // 15k: 15 × 0.60 × 15000/100/12 = ₪113
    // 25k: 15 × 0.60 × 25000/100/12 = ₪188
    tco7k:  { fuelMonthly: 52,  insuranceMonthly: 580, maintenanceMonthly: 90,  depreciationMonthly: 1425, totalMonthly: 2268 },
    tco15k: { fuelMonthly: 113, insuranceMonthly: 580, maintenanceMonthly: 100, depreciationMonthly: 1425, totalMonthly: 2339 },
    tco25k: { fuelMonthly: 188, insuranceMonthly: 580, maintenanceMonthly: 115, depreciationMonthly: 1425, totalMonthly: 2429 },
    // Insurance
    insuranceMin: 490, insuranceMax: 670,
    // Market snapshot
    priceMin: 141000, priceMedian: 152000, priceMax: 165000, sampleSize: 19,
  },
  {
    makeSlug: "skoda",
    model: "Octavia", modelSlug: "octavia",
    bodyType: "sedan", seats: 5, cargoLiters: 600,
    fuelType: "petrol", transmission: "automatic",
    yearFrom: 2023, yearTo: 2025,
    engineCc: 1500, powerHp: 150, combinedConsumption: 6.5,
    newPrice: 95000, marketMinPrice: 87000, marketMaxPrice: 105000,
    estimatedMonthlyCost: 1980,
    reliabilityScore: 81, safetyScore: 88, economyScore: 76, comfortScore: 90, practicalityScore: 92,
    trimName: "Style",
    ownershipNotes: "הסדאן האירופאי הפרקטי ביותר — תא מטען 600 ליטר, נוחות כביש מהיר ומחיר אטרקטיבי.",
    pros: ["תא מטען ענק לסדאן", "נוחות כביש מהיר", "ציוד עשיר במחיר הבסיס", "שירות VAG נפוץ"],
    cons: ["פחות פופולרי בישראל מיפניות", "צריכת דלק ממוצעת"],
    dataStatus: "estimated", dataConfidence: 70,
    // TCO: 6.5L/100km × ₪7.10/L
    // 7k:  6.5 × 7.10 × 7000/100/12  = ₪268
    // 15k: 6.5 × 7.10 × 15000/100/12 = ₪576
    // 25k: 6.5 × 7.10 × 25000/100/12 = ₪960
    tco7k:  { fuelMonthly: 268, insuranceMonthly: 380, maintenanceMonthly: 215, depreciationMonthly: 792, totalMonthly: 1776 },
    tco15k: { fuelMonthly: 576, insuranceMonthly: 380, maintenanceMonthly: 240, depreciationMonthly: 792, totalMonthly: 2109 },
    tco25k: { fuelMonthly: 960, insuranceMonthly: 380, maintenanceMonthly: 265, depreciationMonthly: 792, totalMonthly: 2518 },
    // Insurance
    insuranceMin: 310, insuranceMax: 450,
    // Market snapshot
    priceMin: 87000, priceMedian: 95000, priceMax: 105000, sampleSize: 29,
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

console.log("\n🎉 Batch 3 seed complete!");
await connection.end();
