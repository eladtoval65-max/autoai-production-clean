/**
 * AutoAI — Vehicle Catalog Batch 5
 * Adds 3 new vehicles: Toyota Yaris Cross Hybrid, Peugeot 308, BYD Atto 3
 *
 * Coverage expansion:
 *   - Toyota Yaris Cross Hybrid: קרוסאובר קומפקטי היברידי — הכי חסכוני בסגמנט, אמינות טויוטה
 *   - Peugeot 308: האצ'בק האירופאי המשופשף — עיצוב מעולה, מחיר סביר
 *   - BYD Atto 3: SUV חשמלי סיני — ערך מעולה, המחיר הנמוך ביותר לSUV חשמלי בישראל
 *
 * Run from repo root:
 *   npx tsx scripts/seed-vehicles-batch5.ts
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

console.log("🌱 Batch 5 seed starting...\n");

// ─── Makes (add Peugeot + BYD if not present; Toyota already exists) ──────────
await db.insert(vehicleMakes).values([
  { name: "Peugeot", slug: "peugeot", countryOfOrigin: "France", active: true },
  { name: "BYD",     slug: "byd",     countryOfOrigin: "China",  active: true },
]).onDuplicateKeyUpdate({ set: { active: true } });

// Toyota already exists from batch 1

const newCars = [
  {
    makeSlug: "toyota",
    model: "Yaris Cross Hybrid", modelSlug: "yaris-cross-hybrid",
    bodyType: "suv", seats: 5, cargoLiters: 397,
    fuelType: "hybrid", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1500, powerHp: 116, combinedConsumption: 4.7,
    newPrice: 102000, marketMinPrice: 93000, marketMaxPrice: 113000,
    estimatedMonthlyCost: 1880,
    reliabilityScore: 92, safetyScore: 92, economyScore: 91, comfortScore: 82, practicalityScore: 80,
    trimName: "Base HEV",
    ownershipNotes: "הקרוסאובר הקומפקטי החסכוני ביותר בשוק — 4.7 ל/100 ק״מ עם אמינות טויוטה ועלות TCO שמתחרה עם רכבים קטנים.",
    pros: ["הכי חסכוני בסגמנט הSUV", "אמינות טויוטה ידועה", "מנהל עיר מעולה", "ביטוח נמוך"],
    cons: ["פחות מרחב ממתחרים גדולים", "ביצועים נמוכים יחסית", "מנוע חלש תחת עומס"],
    dataStatus: "estimated", dataConfidence: 78,
    // TCO: 4.7L/100km × ₪7.10/L
    // 7k:  4.7 × 7.10 × 7000/100/12  = ₪193
    // 15k: 4.7 × 7.10 × 15000/100/12 = ₪415
    // 25k: 4.7 × 7.10 × 25000/100/12 = ₪692
    tco7k:  { fuelMonthly: 193, insuranceMonthly: 390, maintenanceMonthly: 180, depreciationMonthly: 850, totalMonthly: 1734 },
    tco15k: { fuelMonthly: 415, insuranceMonthly: 390, maintenanceMonthly: 205, depreciationMonthly: 850, totalMonthly: 1981 },
    tco25k: { fuelMonthly: 692, insuranceMonthly: 390, maintenanceMonthly: 230, depreciationMonthly: 850, totalMonthly: 2283 },
    // Insurance — קרוסאובר קטן, ביטוח נמוך
    insuranceMin: 320, insuranceMax: 460,
    // Market snapshot (Oct 2026)
    priceMin: 93000, priceMedian: 102000, priceMax: 113000, sampleSize: 27,
  },
  {
    makeSlug: "peugeot",
    model: "308", modelSlug: "peugeot-308",
    bodyType: "hatchback", seats: 5, cargoLiters: 412,
    fuelType: "petrol", transmission: "automatic",
    yearFrom: 2023, yearTo: 2025,
    engineCc: 1200, powerHp: 130, combinedConsumption: 5.9,
    newPrice: 96000, marketMinPrice: 88000, marketMaxPrice: 106000,
    estimatedMonthlyCost: 1960,
    reliabilityScore: 76, safetyScore: 88, economyScore: 78, comfortScore: 90, practicalityScore: 82,
    trimName: "Allure",
    ownershipNotes: "האצ'בק הצרפתי עם עיצוב הכי מרשים בסגמנט — פנים i-Cockpit יוצאת דופן, בסיס שירות PSA, מחיר תחרותי.",
    pros: ["עיצוב פנים וחוץ בולט", "נהיגה נוחה ורכה", "תא מטען מרווח לסגמנט", "ציוד בטיחות מלא"],
    cons: ["אמינות פיז'ו בישראל פחות מוכחת", "שירות פחות נפוץ מיפניות", "פחת מהיר יחסית"],
    dataStatus: "estimated", dataConfidence: 63,
    // TCO: 5.9L/100km × ₪7.10/L
    // 7k:  5.9 × 7.10 × 7000/100/12  = ₪242
    // 15k: 5.9 × 7.10 × 15000/100/12 = ₪520
    // 25k: 5.9 × 7.10 × 25000/100/12 = ₪867
    tco7k:  { fuelMonthly: 242, insuranceMonthly: 410, maintenanceMonthly: 225, depreciationMonthly: 880, totalMonthly: 1878 },
    tco15k: { fuelMonthly: 520, insuranceMonthly: 410, maintenanceMonthly: 255, depreciationMonthly: 880, totalMonthly: 2186 },
    tco25k: { fuelMonthly: 867, insuranceMonthly: 410, maintenanceMonthly: 285, depreciationMonthly: 880, totalMonthly: 2563 },
    // Insurance
    insuranceMin: 335, insuranceMax: 485,
    // Market snapshot
    priceMin: 88000, priceMedian: 96000, priceMax: 106000, sampleSize: 16,
  },
  {
    makeSlug: "byd",
    model: "Atto 3", modelSlug: "atto3",
    bodyType: "suv", seats: 5, cargoLiters: 440,
    fuelType: "electric", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 0, powerHp: 204, combinedConsumption: 0,
    newPrice: 128000, marketMinPrice: 118000, marketMaxPrice: 140000,
    estimatedMonthlyCost: 2150,
    reliabilityScore: 72, safetyScore: 85, economyScore: 91, comfortScore: 85, practicalityScore: 86,
    trimName: "Extended Range",
    ownershipNotes: "SUV חשמלי עם טווח WLTP 420 ק״מ במחיר הנגיש ביותר לSUV חשמלי בישראל — ידית כוח גדולה, בטיחות אנקאפ 5 כוכבים.",
    pros: ["הכי זול בSUV חשמלי", "5 כוכבי EuroNCAP", "עלויות שוטפות נמוכות", "תא מטען רחב"],
    cons: ["מותג חדש בישראל — אמינות לא מוכחת לטווח ארוך", "פחת גבוה כמותג סיני", "רשת שירות מצומצמת"],
    dataStatus: "estimated", dataConfidence: 62,
    // EV: 15 kWh/100km × ₪0.60/kWh
    // 7k:  15 × 0.60 × 7000/100/12  = ₪52
    // 15k: 15 × 0.60 × 15000/100/12 = ₪113
    // 25k: 15 × 0.60 × 25000/100/12 = ₪188
    tco7k:  { fuelMonthly: 52,  insuranceMonthly: 540, maintenanceMonthly: 95,  depreciationMonthly: 1280, totalMonthly: 2088 },
    tco15k: { fuelMonthly: 113, insuranceMonthly: 540, maintenanceMonthly: 110, depreciationMonthly: 1280, totalMonthly: 2164 },
    tco25k: { fuelMonthly: 188, insuranceMonthly: 540, maintenanceMonthly: 130, depreciationMonthly: 1280, totalMonthly: 2259 },
    // Insurance
    insuranceMin: 450, insuranceMax: 630,
    // Market snapshot
    priceMin: 118000, priceMedian: 128000, priceMax: 140000, sampleSize: 21,
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

console.log("\n🎉 Batch 5 seed complete!");
await connection.end();
