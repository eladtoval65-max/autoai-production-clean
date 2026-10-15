/**
 * AutoAI — Full seed script
 * Populates: vehicleSources, vehicleMakes, vehicleModels, vehicleTrims, ownershipCosts
 * Run from repo root:
 *   npx tsx scripts\seed-real-data.ts
 * Requires .env.local with DATABASE_URL pointing to TiDB.
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";
import {
  vehicleSources,
  vehicleMakes,
  vehicleModels,
  vehicleTrims,
  ownershipCosts,
} from "../schema";

dotenv.config({ path: ".env.local" });

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection);

console.log("🌱 Starting seed...");

// ─── 1. Sources ────────────────────────────────────────────────────────────
await db
  .insert(vehicleSources)
  .values([{ name: "יבואן רשמי", slug: "official", sourceType: "importer", url: "", notes: "" }])
  .onDuplicateKeyUpdate({ set: { sourceType: "importer" } });

// ─── 2. Makes ──────────────────────────────────────────────────────────────
await db
  .insert(vehicleMakes)
  .values([
    { name: "Toyota",  slug: "toyota",  countryOfOrigin: "Japan",          active: true },
    { name: "Hyundai", slug: "hyundai", countryOfOrigin: "South Korea",    active: true },
    { name: "Mazda",   slug: "mazda",   countryOfOrigin: "Japan",          active: true },
    { name: "Skoda",   slug: "skoda",   countryOfOrigin: "Czech Republic", active: true },
    { name: "Kia",     slug: "kia",     countryOfOrigin: "South Korea",    active: true },
    { name: "BYD",     slug: "byd",     countryOfOrigin: "China",          active: true },
  ])
  .onDuplicateKeyUpdate({ set: { active: true } });

// ─── 3. Models + Trims ─────────────────────────────────────────────────────
const cars = [
  {
    makeSlug: "toyota",
    model: "Corolla Cross Hybrid", modelSlug: "corolla-cross-hybrid",
    bodyType: "suv", seats: 5,
    fuelType: "hybrid", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1800, powerHp: 122, combinedConsumption: 4.5,
    newPrice: 100500, estimatedMonthlyCost: 1762,
    reliabilityScore: 9, safetyScore: 5, economyScore: 9, comfortScore: 8, practicalityScore: 8,
    trimName: "Base",
    ownershipNotes: "חיסכון גבוה בעיר, עלות שוטפת נמוכה ביחס לקטגוריה.",
    pros: ["חסכון דלק מעולה", "אמינות גבוהה", "ערך יד שנייה חזק"],
    cons: ["מחיר רכישה גבוה יחסית", "עיצוב שמרני"],
    // TCO @ 15k km/year
    fuelMonthly: 363, insuranceMonthly: 365, maintenanceMonthly: 200, depreciationMonthly: 713, totalMonthly: 1762,
  },
  {
    makeSlug: "hyundai",
    model: "Tucson", modelSlug: "tucson",
    bodyType: "suv", seats: 5,
    fuelType: "petrol", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1600, powerHp: 150, combinedConsumption: 7.5,
    newPrice: 120500, estimatedMonthlyCost: 2404,
    reliabilityScore: 8, safetyScore: 5, economyScore: 7, comfortScore: 8, practicalityScore: 9,
    trimName: "Base",
    ownershipNotes: "SUV משפחתי מאוזן עם שירות נגיש ומרחב פנים נוח.",
    pros: ["מרחב פנים מצוין", "שירות נפוץ בישראל", "בטיחות גבוהה"],
    cons: ["צריכת דלק בינונית", "עלות חודשית גבוהה יחסית"],
    fuelMonthly: 630, insuranceMonthly: 500, maintenanceMonthly: 280, depreciationMonthly: 873, totalMonthly: 2404,
  },
  {
    makeSlug: "mazda",
    model: "Mazda3", modelSlug: "mazda3",
    bodyType: "sedan", seats: 5,
    fuelType: "petrol", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 2000, powerHp: 165, combinedConsumption: 6.8,
    newPrice: 97500, estimatedMonthlyCost: 2137,
    reliabilityScore: 9, safetyScore: 5, economyScore: 7, comfortScore: 8, practicalityScore: 7,
    trimName: "Base",
    ownershipNotes: "סדאן ספורטיבי עם תא נוסעים איכותי וחווית נהיגה מהנה.",
    pros: ["עיצוב מוקפד", "נהיגה מהנה", "תא נוסעים איכותי"],
    cons: ["תא מטען קטן יחסית", "מושב אחורי צפוף"],
    fuelMonthly: 576, insuranceMonthly: 400, maintenanceMonthly: 240, depreciationMonthly: 700, totalMonthly: 2137,
  },
  {
    makeSlug: "skoda",
    model: "Octavia", modelSlug: "octavia",
    bodyType: "sedan", seats: 5,
    fuelType: "petrol", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1500, powerHp: 150, combinedConsumption: 6.5,
    newPrice: 109500, estimatedMonthlyCost: 2195,
    reliabilityScore: 8, safetyScore: 5, economyScore: 7, comfortScore: 8, practicalityScore: 9,
    trimName: "Base",
    ownershipNotes: "סדאן פרקטי עם תא מטען ענק ומחיר סביר לסגמנט.",
    pros: ["תא מטען ענק", "מחיר תחרותי לגודל", "פנים מרווח"],
    cons: ["אופי נהיגה יומיומי", "ירידת ערך מהירה יחסית"],
    fuelMonthly: 541, insuranceMonthly: 440, maintenanceMonthly: 300, depreciationMonthly: 793, totalMonthly: 2195,
  },
  {
    makeSlug: "toyota",
    model: "Yaris Cross", modelSlug: "yaris-cross",
    bodyType: "suv", seats: 5,
    fuelType: "hybrid", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1500, powerHp: 116, combinedConsumption: 4.8,
    newPrice: 93000, estimatedMonthlyCost: 1679,
    reliabilityScore: 9, safetyScore: 5, economyScore: 9, comfortScore: 7, practicalityScore: 8,
    trimName: "Base",
    ownershipNotes: "קרוסאובר קומפקטי וחסכוני, אידיאלי לעיר עם גמישות כביש.",
    pros: ["עלות חודשית נמוכה", "קל לחניה בעיר", "אמינות טויוטה"],
    cons: ["מנוע קטן יחסית", "פחות מרווח מ-SUV גדול"],
    fuelMonthly: 381, insuranceMonthly: 340, maintenanceMonthly: 180, depreciationMonthly: 657, totalMonthly: 1679,
  },
  {
    makeSlug: "kia",
    model: "Picanto", modelSlug: "picanto",
    bodyType: "hatchback", seats: 5,
    fuelType: "petrol", transmission: "manual",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 1000, powerHp: 67, combinedConsumption: 5.8,
    newPrice: 56000, estimatedMonthlyCost: 1355,
    reliabilityScore: 8, safetyScore: 3, economyScore: 8, comfortScore: 6, practicalityScore: 7,
    trimName: "Base",
    ownershipNotes: "מכונית עיר קטנה עם עלות הבעלות הנמוכה בקטלוג — מתאים לנסיעות קצרות.",
    pros: ["עלות הכי נמוכה בקטלוג", "קל לחניה", "ביטוח נמוך"],
    cons: ["בטיחות נמוכה יחסית", "לא מתאים לכביש מהיר תכוף"],
    fuelMonthly: 487, insuranceMonthly: 210, maintenanceMonthly: 130, depreciationMonthly: 407, totalMonthly: 1355,
  },
  {
    makeSlug: "byd",
    model: "Atto 3", modelSlug: "atto-3",
    bodyType: "suv", seats: 5,
    fuelType: "electric", transmission: "automatic",
    yearFrom: 2024, yearTo: 2025,
    engineCc: 0, powerHp: 204, combinedConsumption: 0,
    newPrice: 128000, estimatedMonthlyCost: 2080,
    reliabilityScore: 7, safetyScore: 5, economyScore: 9, comfortScore: 8, practicalityScore: 8,
    trimName: "Base",
    ownershipNotes: "חשמלית סינית עם עלות הנסיעה הנמוכה ביותר, מתאים למי שיש גישה לטעינה ביתית.",
    pros: ["עלות נסיעה שפויה מאוד", "ביצועים חזקים", "ציוד עשיר"],
    cons: ["מותג חדש בישראל", "פחת גבוה כחשמלית", "תלות בטעינה ביתית"],
    fuelMonthly: 116, insuranceMonthly: 565, maintenanceMonthly: 120, depreciationMonthly: 1158, totalMonthly: 2080,
  },
];

const makeRows = await db.select().from(vehicleMakes);
const makeMap: Record<string, number> = {};
for (const m of makeRows) makeMap[m.slug] = m.id;

const insertedTrimIds: { trimId: number; modelSlug: string }[] = [];

for (const car of cars) {
  const makeId = makeMap[car.makeSlug];
  if (!makeId) { console.warn(`⚠️  Make not found: ${car.makeSlug}`); continue; }

  // Insert model
  const [modelResult] = await db
    .insert(vehicleModels)
    .values({
      makeId,
      name: car.model,
      slug: car.modelSlug,
      bodyType: car.bodyType,
      seats: car.seats,
      active: true,
    })
    .onDuplicateKeyUpdate({ set: { active: true } });

  // Fetch the real modelId (insertId for new, or fetch by slug for duplicate)
  let modelId = (modelResult as any).insertId as number;
  if (!modelId || modelId === 0) {
    const existing = await db
      .select({ id: vehicleModels.id })
      .from(vehicleModels)
      .where(eq(vehicleModels.slug, car.modelSlug))
      .limit(1);
    modelId = existing[0]?.id ?? 0;
  }
  if (!modelId) { console.warn(`⚠️  Could not resolve modelId for ${car.model}`); continue; }

  // Insert trim
  const [trimResult] = await db
    .insert(vehicleTrims)
    .values({
      modelId,
      trimName: car.trimName,
      yearFrom: car.yearFrom,
      yearTo: car.yearTo,
      fuelType: car.fuelType,
      transmission: car.transmission,
      engineCc: car.engineCc,
      powerHp: car.powerHp,
      combinedConsumption: String(car.combinedConsumption),
      newPrice: car.newPrice,
      estimatedMonthlyCost: car.estimatedMonthlyCost,
      reliabilityScore: car.reliabilityScore,
      safetyScore: car.safetyScore,
      economyScore: car.economyScore,
      comfortScore: car.comfortScore,
      practicalityScore: car.practicalityScore,
      ownershipNotes: car.ownershipNotes,
      pros: JSON.stringify(car.pros),
      cons: JSON.stringify(car.cons),
      dataStatus: "estimated",
      dataConfidence: 70,
      active: true,
    })
    .onDuplicateKeyUpdate({ set: { estimatedMonthlyCost: car.estimatedMonthlyCost } });

  let trimId = (trimResult as any).insertId as number;
  if (!trimId || trimId === 0) {
    // fetch existing trim by modelId + trimName + yearFrom
    const existingTrim = await db
      .select({ id: vehicleTrims.id })
      .from(vehicleTrims)
      .where(eq(vehicleTrims.modelId, modelId))
      .limit(1);
    trimId = existingTrim[0]?.id ?? 0;
  }
  if (!trimId) { console.warn(`⚠️  Could not resolve trimId for ${car.model}`); continue; }

  insertedTrimIds.push({ trimId, modelSlug: car.modelSlug });
  console.log(`✅ ${car.makeSlug} ${car.model} (trimId=${trimId})`);
}

// ─── 4. ownershipCosts ─────────────────────────────────────────────────────
// These are the TCO numbers for 15,000 km/year that listVehicleCatalog JOINs on.
const tcoBySlug: Record<string, { fuelMonthly: number; insuranceMonthly: number; maintenanceMonthly: number; depreciationMonthly: number; totalMonthly: number }> = {
  "corolla-cross-hybrid": { fuelMonthly: 363, insuranceMonthly: 365, maintenanceMonthly: 200, depreciationMonthly: 713, totalMonthly: 1762 },
  "tucson":               { fuelMonthly: 630, insuranceMonthly: 500, maintenanceMonthly: 280, depreciationMonthly: 873, totalMonthly: 2404 },
  "mazda3":               { fuelMonthly: 576, insuranceMonthly: 400, maintenanceMonthly: 240, depreciationMonthly: 700, totalMonthly: 2137 },
  "octavia":              { fuelMonthly: 541, insuranceMonthly: 440, maintenanceMonthly: 300, depreciationMonthly: 793, totalMonthly: 2195 },
  "yaris-cross":          { fuelMonthly: 381, insuranceMonthly: 340, maintenanceMonthly: 180, depreciationMonthly: 657, totalMonthly: 1679 },
  "picanto":              { fuelMonthly: 487, insuranceMonthly: 210, maintenanceMonthly: 130, depreciationMonthly: 407, totalMonthly: 1355 },
  "atto-3":               { fuelMonthly: 116, insuranceMonthly: 565, maintenanceMonthly: 120, depreciationMonthly: 1158, totalMonthly: 2080 },
};

console.log("\n💰 Seeding ownershipCosts...");
for (const { trimId, modelSlug } of insertedTrimIds) {
  const tco = tcoBySlug[modelSlug];
  if (!tco) { console.warn(`  ⚠️  No TCO data for slug: ${modelSlug}`); continue; }

  await db
    .insert(ownershipCosts)
    .values({
      trimId,
      annualKm: 15000,
      financingMonthly: 0,
      fuelMonthly: tco.fuelMonthly,
      insuranceMonthly: tco.insuranceMonthly,
      maintenanceMonthly: tco.maintenanceMonthly,
      depreciationMonthly: tco.depreciationMonthly,
      totalMonthly: tco.totalMonthly,
      isEstimate: true,
    })
    .onDuplicateKeyUpdate({ set: { totalMonthly: tco.totalMonthly } });

  console.log(`  💰 ${modelSlug}: ₪${tco.totalMonthly}/month`);
}

await connection.end();
console.log("\n🎉 Seed complete! All tables populated.");
