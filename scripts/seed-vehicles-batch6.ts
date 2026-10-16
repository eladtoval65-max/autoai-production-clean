/**
 * AutoAI — Vehicle Catalog Batch 6
 * 5 הרכבים הנמכרים ביותר בישראל 2025 שחסרו בקטלוג
 *
 *   - Jaecoo J7 Hybrid     — #1 ישראל 2025 (13,074 יח׳) · SUV קומפקטי סיני-היברידי
 *   - Hyundai Kona Hybrid  — #2 ישראל 2025 (11,759 יח׳) · קרוסאובר קומפקטי קוריאני
 *   - Toyota Corolla Cross — #3 ישראל 2025 (9,206 יח׳)  · SUV קומפקטי היברידי
 *   - Chery Tiggo 8 Pro    — TOP10 ישראל 2025           · 7 מושבים פלאג-אין היברידי
 *   - Kia Picanto          — TOP5 ישראל 2025 (8,070 יח׳) · סיטי קאר קטן וחסכוני
 *
 * מקורות נתונים: carzone.co.il, queenoftheroad.co.il (אוקטובר 2026)
 * Run: npx tsx scripts/seed-vehicles-batch6.ts
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

console.log("🌱 Batch 6 seed starting — TOP sellers Israel 2025...\n");

// ─── Makes ────────────────────────────────────────────────────────────────────
// Jaecoo = מותג OMODA-JAECOO (Chery Group), ייצור סין
await db.insert(vehicleMakes).values([
  { name: "Jaecoo",  slug: "jaecoo",  countryOfOrigin: "China",       active: true },
  { name: "Chery",   slug: "chery",   countryOfOrigin: "China",       active: true },
  // Hyundai, Toyota, Kia already exist from batch1
]).onDuplicateKeyUpdate({ set: { active: true } });

const newCars = [
  // ── 1. Jaecoo J7 Hybrid ──────────────────────────────────────────────────
  // #1 ישראל 2025 — 13,074 יחידות · SUV קומפקטי מיני היברידי מקבוצת Chery
  // מקור: carzone.co.il (Jaecoo 7 2025), queenoftheroad.co.il סיכום 2025
  {
    makeSlug: "jaecoo",
    model: "J7", modelSlug: "jaecoo-j7",
    bodyType: "suv", seats: 5, cargoLiters: 478,
    fuelType: "hybrid", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1500, powerHp: 155, combinedConsumption: 5.5,
    newPrice: 157500, marketMinPrice: 142000, marketMaxPrice: 175000,
    estimatedMonthlyCost: 2480,
    reliabilityScore: 70, safetyScore: 80, economyScore: 82, comfortScore: 82, practicalityScore: 84,
    trimName: "Premium HEV",
    ownershipNotes: "הרכב הנמכר ביותר בישראל 2025 — 13,074 יחידות. SUV קומפקטי מקבוצת Chery עם מיני-היברידי, ציוד עשיר ומחיר תחרותי. אמינות לטווח ארוך עדיין לא מוכחת בישראל.",
    pros: ["הנמכר ביותר בישראל", "ציוד עשיר לכסף", "היברידי חסכוני", "עיצוב מודרני"],
    cons: ["אמינות לא מוכחת לטווח ארוך", "שירות פחות נפוץ מיפניות/קוריאניות", "ערך יד שנייה לא ידוע"],
    dataStatus: "estimated", dataConfidence: 65,
    // TCO: 5.5L/100km × ₪7.10/L
    // 7k:  5.5 × 7.10 × 7000/100/12  = ₪226
    // 15k: 5.5 × 7.10 × 15000/100/12 = ₪486
    // 25k: 5.5 × 7.10 × 25000/100/12 = ₪810
    tco7k:  { fuelMonthly: 226, insuranceMonthly: 600, maintenanceMonthly: 210, depreciationMonthly: 1313, totalMonthly: 2470 },
    tco15k: { fuelMonthly: 486, insuranceMonthly: 600, maintenanceMonthly: 240, depreciationMonthly: 1313, totalMonthly: 2760 },
    tco25k: { fuelMonthly: 810, insuranceMonthly: 600, maintenanceMonthly: 270, depreciationMonthly: 1313, totalMonthly: 3114 },
    insuranceMin: 500, insuranceMax: 700,
    priceMin: 142000, priceMedian: 157500, priceMax: 175000, sampleSize: 45,
  },

  // ── 2. Hyundai Kona Hybrid ───────────────────────────────────────────────
  // #2 ישראל 2025 — 11,759 יחידות · קרוסאובר קומפקטי מהנמכרים בישראל
  // נתונים: carzone.co.il — 22.6 ק"מ/ל, מחיר ₪144,000+, 466 ל' תא מטען
  {
    makeSlug: "hyundai",
    model: "Kona Hybrid", modelSlug: "kona-hybrid",
    bodyType: "suv", seats: 5, cargoLiters: 466,
    fuelType: "hybrid", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1580, powerHp: 139, combinedConsumption: 4.4,
    newPrice: 144000, marketMinPrice: 132000, marketMaxPrice: 158000,
    estimatedMonthlyCost: 2280,
    reliabilityScore: 86, safetyScore: 83, economyScore: 90, comfortScore: 85, practicalityScore: 85,
    trimName: "Premium 1.6 HEV",
    ownershipNotes: "שני בישראל 2025 — 11,759 יחידות. קרוסאובר קומפקטי עם הייברידי חסכוני מאוד (22.6 ק\"מ/ל), מרחב פנים טוב ושירות יונדאי נפוץ בכל הארץ.",
    pros: ["חסכנות מצוינת (22.6 ק\"מ/ל)", "שירות יונדאי נפוץ", "מרחב פנים טוב לגודלו", "4 כוכבי NCAP"],
    cons: ["מחיר גבוה לקרוסאובר קומפקטי", "0-100 איטי (10.9 ש׳)", "חומרי פנים בינוניים"],
    dataStatus: "estimated", dataConfidence: 75,
    // TCO: 4.4L/100km × ₪7.10/L (= 100km/22.6kmpl)
    // 7k:  4.4 × 7.10 × 7000/100/12  = ₪181
    // 15k: 4.4 × 7.10 × 15000/100/12 = ₪388
    // 25k: 4.4 × 7.10 × 25000/100/12 = ₪647
    tco7k:  { fuelMonthly: 181, insuranceMonthly: 480, maintenanceMonthly: 195, depreciationMonthly: 1200, totalMonthly: 2177 },
    tco15k: { fuelMonthly: 388, insuranceMonthly: 480, maintenanceMonthly: 220, depreciationMonthly: 1200, totalMonthly: 2409 },
    tco25k: { fuelMonthly: 647, insuranceMonthly: 480, maintenanceMonthly: 248, depreciationMonthly: 1200, totalMonthly: 2696 },
    insuranceMin: 390, insuranceMax: 560,
    priceMin: 132000, priceMedian: 144000, priceMax: 158000, sampleSize: 52,
  },

  // ── 3. Toyota Corolla Cross Hybrid ───────────────────────────────────────
  // #3 ישראל 2025 — 9,206 יחידות · SUV קומפקטי היברידי, 5 כוכבי NCAP
  // נתונים: carzone.co.il — 20.2 ק"מ/ל, מחיר ₪153,300+, 436 ל' תא מטען
  {
    makeSlug: "toyota",
    model: "Corolla Cross Hybrid", modelSlug: "corolla-cross-hybrid",
    bodyType: "suv", seats: 5, cargoLiters: 436,
    fuelType: "hybrid", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1800, powerHp: 140, combinedConsumption: 4.95,
    newPrice: 153300, marketMinPrice: 140000, marketMaxPrice: 168000,
    estimatedMonthlyCost: 2560,
    reliabilityScore: 93, safetyScore: 95, economyScore: 89, comfortScore: 87, practicalityScore: 88,
    trimName: "Active HEV",
    ownershipNotes: "שלישי בישראל 2025 — 9,206 יחידות. SUV קומפקטי עם אמינות טויוטה מוכחת, 5 כוכבי NCAP, ו-20.2 ק\"מ/ל. השילוב המנצח של מרחב, חסכון ואמינות.",
    pros: ["5 כוכבי NCAP", "אמינות טויוטה", "חסכנות מצוינת לSUV", "ביקוש יד שנייה חזק"],
    cons: ["מחיר גבוה", "חומרי פנים פלסטיק", "מנוע קצת רועשני"],
    dataStatus: "estimated", dataConfidence: 80,
    // TCO: 100/20.2 = 4.95L/100km × ₪7.10/L
    // 7k:  4.95 × 7.10 × 7000/100/12  = ₪204
    // 15k: 4.95 × 7.10 × 15000/100/12 = ₪437
    // 25k: 4.95 × 7.10 × 25000/100/12 = ₪729
    tco7k:  { fuelMonthly: 204, insuranceMonthly: 540, maintenanceMonthly: 200, depreciationMonthly: 1278, totalMonthly: 2343 },
    tco15k: { fuelMonthly: 437, insuranceMonthly: 540, maintenanceMonthly: 225, depreciationMonthly: 1278, totalMonthly: 2601 },
    tco25k: { fuelMonthly: 729, insuranceMonthly: 540, maintenanceMonthly: 255, depreciationMonthly: 1278, totalMonthly: 2923 },
    insuranceMin: 420, insuranceMax: 610,
    priceMin: 140000, priceMedian: 153300, priceMax: 168000, sampleSize: 47,
  },

  // ── 4. Chery Tiggo 8 Pro PHEV ────────────────────────────────────────────
  // TOP10 ישראל 2025 — 8,374 יחידות · 7 מושבים, PHEV, 4 כוכבי NCAP
  // נתונים: carzone.co.il — ₪147,100+ (בנזין), ₪164,100 (PHEV), 347 כ"ס
  {
    makeSlug: "chery",
    model: "Tiggo 8 Pro", modelSlug: "tiggo8pro",
    bodyType: "suv", seats: 7, cargoLiters: 620,
    fuelType: "hybrid", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1500, powerHp: 195, combinedConsumption: 7.5,
    newPrice: 147100, marketMinPrice: 136000, marketMaxPrice: 165000,
    estimatedMonthlyCost: 2580,
    reliabilityScore: 68, safetyScore: 84, economyScore: 75, comfortScore: 85, practicalityScore: 95,
    trimName: "Noble 1.6T",
    ownershipNotes: "SUV ענק עם 7 מושבים במחיר תחרותי — הבחירה של משפחות גדולות שמחפשות מרחב. צריכת דלק בינונית, אמינות לא מוכחת, אבל ערך מרשים לכסף.",
    pros: ["7 מושבים עם מרחב אמיתי", "מחיר תחרותי ל-7 מושבים", "ציוד עשיר", "תא מטען ענק"],
    cons: ["אמינות לא מוכחת לטווח ארוך", "4 כוכבי NCAP בלבד", "צריכת דלק בינונית", "נסיעה פחות נוחה ממתחרים"],
    dataStatus: "estimated", dataConfidence: 63,
    // TCO: 7.5L/100km × ₪7.10/L (בנזין בלבד)
    // 7k:  7.5 × 7.10 × 7000/100/12  = ₪309
    // 15k: 7.5 × 7.10 × 15000/100/12 = ₪664
    // 25k: 7.5 × 7.10 × 25000/100/12 = ₪1,106
    tco7k:  { fuelMonthly: 309, insuranceMonthly: 520, maintenanceMonthly: 230, depreciationMonthly: 1226, totalMonthly: 2406 },
    tco15k: { fuelMonthly: 664, insuranceMonthly: 520, maintenanceMonthly: 260, depreciationMonthly: 1226, totalMonthly: 2791 },
    tco25k: { fuelMonthly: 1106, insuranceMonthly: 520, maintenanceMonthly: 295, depreciationMonthly: 1226, totalMonthly: 3268 },
    insuranceMin: 420, insuranceMax: 620,
    priceMin: 136000, priceMedian: 147100, priceMax: 165000, sampleSize: 38,
  },

  // ── 5. Kia Picanto ───────────────────────────────────────────────────────
  // TOP5 ישראל 2025 — 8,070 יחידות · הסיטי-קאר הנמכר בישראל, ₪84,200
  // נתונים: carzone.co.il — 17.7 ק"מ/ל, 79 כ"ס, תא מטען 255 ל', ₪84,200
  {
    makeSlug: "kia",
    model: "Picanto", modelSlug: "picanto",
    bodyType: "hatchback", seats: 5, cargoLiters: 255,
    fuelType: "petrol", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1197, powerHp: 79, combinedConsumption: 5.6,
    newPrice: 84200, marketMinPrice: 76000, marketMaxPrice: 93000,
    estimatedMonthlyCost: 1380,
    reliabilityScore: 82, safetyScore: 72, economyScore: 83, comfortScore: 74, practicalityScore: 65,
    trimName: "LX Plus 1.2",
    ownershipNotes: "הרכב הזול ביותר לרכישה ולהחזקה — 79 כ\"ס, ₪84,200, ביטוח ₪2,800/שנה. אידאלי לנסיעות עיר עם מינימום עלויות. מושבים מרווחים יחסית לגודלו.",
    pros: ["הכי זול לרכישה בשוק החדש", "ביטוח נמוך מאוד", "חנייה קלה", "תחזוקה נמוכה"],
    cons: ["תא מטען 255 ל׳ בלבד", "4 כוכבי NCAP ישנים (2017)", "ביצועים חלשים (0-100: 16.5ש׳)", "לא מתאים לכביש מהיר"],
    dataStatus: "estimated", dataConfidence: 78,
    // TCO: 5.6L/100km × ₪7.10/L (≈ 100/17.7 = 5.65)
    // 7k:  5.65 × 7.10 × 7000/100/12  = ₪232
    // 15k: 5.65 × 7.10 × 15000/100/12 = ₪498
    // 25k: 5.65 × 7.10 × 25000/100/12 = ₪830
    tco7k:  { fuelMonthly: 232, insuranceMonthly: 235, maintenanceMonthly: 140, depreciationMonthly: 701, totalMonthly: 1429 },
    tco15k: { fuelMonthly: 498, insuranceMonthly: 235, maintenanceMonthly: 160, depreciationMonthly: 701, totalMonthly: 1715 },
    tco25k: { fuelMonthly: 830, insuranceMonthly: 235, maintenanceMonthly: 185, depreciationMonthly: 701, totalMonthly: 2072 },
    insuranceMin: 195, insuranceMax: 285,
    priceMin: 76000, priceMedian: 84200, priceMax: 93000, sampleSize: 61,
  },
];

// ─── Fetch make IDs ──────────────────────────────────────────────────────────
const makeRows = await db.select().from(vehicleMakes);
const makeMap: Record<string, number> = {};
for (const m of makeRows) makeMap[m.slug] = m.id;

const sourceRows = await db.select().from(vehicleSources).limit(1);
const sourceId = sourceRows[0]?.id ?? null;

for (const car of newCars) {
  const makeId = makeMap[car.makeSlug];
  if (!makeId) { console.warn(`⚠️  Make not found: ${car.makeSlug}`); continue; }

  await db.insert(vehicleModels).values({
    makeId, name: car.model, slug: car.modelSlug,
    bodyType: car.bodyType, seats: car.seats, cargoLiters: car.cargoLiters, active: true,
  }).onDuplicateKeyUpdate({ set: { active: true } });

  const modelRow = await db.select({ id: vehicleModels.id }).from(vehicleModels)
    .where(eq(vehicleModels.slug, car.modelSlug)).limit(1);
  const modelId = modelRow[0]?.id;
  if (!modelId) { console.warn(`⚠️  Could not resolve modelId for ${car.model}`); continue; }

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

console.log("\n🎉 Batch 6 seed complete! (+5 רכבים — TOP sellers Israel 2025)");
await connection.end();
