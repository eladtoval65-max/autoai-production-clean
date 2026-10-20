/**
 * Turns raw catalog data into UI `Car` objects:
 *  - `staticCars`: the sourced static catalog (catalogData.ts), used whenever the live DB has no rows;
 *  - `carFromDbRow`: one row of tRPC `catalog.list` (live database).
 */
import { STATIC_CATALOG } from "../../../data/catalogData";
import type { Car } from "../types";
import { FUEL_TO_HE } from "./fuel";

/** Main use each known model suits (used by the "use" question). Unknown models fall back by body type. */
const USE_BY_NAME: Record<string, string> = {
  "toyota corolla hybrid": "city", "hyundai tucson": "family", "mazda mazda3": "fun", "mazda mazda 3": "fun",
  "toyota corolla": "highway", "toyota rav4 hybrid": "family", "kia niro hybrid": "city", "hyundai ioniq 5": "highway",
  "kia sportage hybrid": "family", "nissan qashqai": "family", "mg mg4 electric": "city", "hyundai ioniq 6": "highway",
  "skoda octavia": "highway", "volkswagen golf": "fun", "toyota yaris cross hybrid": "city", "toyota yaris cross": "city",
  "byd atto 3": "family", "jaecoo j7": "family", "hyundai kona hybrid": "city", "toyota corolla cross hybrid": "family",
  "chery tiggo 8 pro": "family", "kia picanto": "city",
};

/** Main use for a car name, with a body-type fallback (SUVs → family, others → city). */
export const useFor = (name: string, bodyType = "") =>
  USE_BY_NAME[name.toLowerCase()] ?? (bodyType.toLowerCase().includes("suv") ? "family" : "city");

/** "Toyota" + "Corolla" → "Toyota Corolla"; avoids "MG MG4" style duplication. */
const displayName = (make: string, model: string) => (model.toLowerCase().startsWith(make.toLowerCase()) ? model : `${make} ${model}`);

/** Static catalog → UI cars. Monthly components are taken from the 15,000 km band. */
export const staticCars: Car[] = STATIC_CATALOG.map((c) => {
  const b = c.bands[15000];
  const name = displayName(c.make, c.model);
  return {
    id: c.id, make: name, years: `${c.years} · ${c.fuelType} · ${c.bodyType}`,
    price: c.price, score: Math.round((c.reliability + c.safety + c.economy + c.comfort + c.practicality) / 5),
    use: useFor(name, c.bodyType), fuel: FUEL_TO_HE[c.fuelType] ?? c.fuelType, bodyType: c.bodyType,
    reliability: c.reliability, safety: c.safety, economy: c.economy, comfort: c.comfort, fun: c.practicality,
    why: c.why, pros: c.pros, cons: c.cons,
    insuranceMin: c.insuranceMin ?? undefined, insuranceMax: c.insuranceMax ?? undefined,
    ownershipMonthly: b.total, fuelMonthly: b.fuel, insuranceMonthlyAmt: b.insurance, maintenanceMonthly: b.maintenance, depreciationMonthly: b.depreciation,
    marketRange: c.priceMin && c.priceMax ? `₪${Math.round(c.priceMin / 1000)}K–₪${Math.round(c.priceMax / 1000)}K` : undefined,
    dataNote: `אומדן ״כמה עולה״ · רמת ביטחון ${c.confidence}/100${c.sampleSize ? ` · מחיר שוק לפי ${c.sampleSize} מודעות` : ""} · עלות דלק לפי צריכה משוקללת. ביטוח: הערכה בלבד.`,
    dataStatus: "estimated", dataConfidence: c.confidence, confidence: c.confidence, bands: c.bands, demo: true,
    spec: { hp: c.powerHp, seats: c.seats, cargo: c.cargoLiters, cons: c.consumption, ev: c.fuelType === "Electric" },
  };
});

/** Shape of one live-DB catalog row (subset of tRPC `catalog.list` output that the UI reads). */
type DbRow = {
  id: number; make: string; model: string; trimName: string; yearFrom: number; yearTo: number; fuelType: string; bodyType: string;
  marketSnapshotMedian?: number | null; marketMinPrice?: number | null; marketSnapshotMin?: number | null; marketSnapshotMax?: number | null;
  marketSnapshotObservedAt?: string | Date | null; marketSnapshotDisclaimer?: string | null;
  officialRegisteredCount?: number | null; officialRegistryCommercialName?: string | null;
  reliabilityScore: number; safetyScore: number; economyScore: number; comfortScore: number; practicalityScore: number;
  ownershipNotes?: string | null; pros?: string[] | null; cons?: string[] | null;
  insuranceMonthlyMin?: number | null; insuranceMonthlyMax?: number | null;
  ownershipCostMonthly?: number | null; estimatedMonthlyCost?: number | null;
  tcoFuelMonthly?: number | null; tcoInsuranceMonthly?: number | null; tcoMaintenanceMonthly?: number | null; tcoDepreciationMonthly?: number | null;
  dataStatus?: string | null; dataConfidence?: number | null; primarySourceName?: string | null; primarySourceUrl?: string | null;
  lastVerifiedAt?: string | Date | null;
};

/** One live-DB row → UI car, with a plain-language note about where each figure came from. */
export function carFromDbRow(row: DbRow): Car {
  const name = `${row.make} ${row.model}`;
  const price = row.marketSnapshotMedian ?? row.marketMinPrice ?? 0;
  const marketRange = row.marketSnapshotMin && row.marketSnapshotMax
    ? `₪${row.marketSnapshotMin.toLocaleString()}–₪${row.marketSnapshotMax.toLocaleString()}` : `₪${price.toLocaleString()}`;
  const registry = row.officialRegisteredCount != null
    ? `מקור רשמי: ${row.officialRegisteredCount.toLocaleString()} כלי רכב מדגם ${row.officialRegistryCommercialName}, שנת ${row.yearFrom}.` : "אין עדיין ספירת רישום רשמית לדגם.";
  const seen = row.marketSnapshotObservedAt ? new Date(row.marketSnapshotObservedAt).toLocaleDateString("he-IL") : "לא ידוע";
  return {
    id: String(row.id),
    make: `${name} · ${row.trimName}`,
    years: `${row.yearFrom}${row.yearTo !== row.yearFrom ? `–${row.yearTo}` : ""} · ${row.fuelType} · ${row.bodyType}`,
    price, score: Math.round((row.reliabilityScore + row.safetyScore + row.economyScore + row.comfortScore + row.practicalityScore) / 5),
    use: useFor(name, row.bodyType), fuel: FUEL_TO_HE[row.fuelType] ?? row.fuelType,
    reliability: row.reliabilityScore, safety: row.safetyScore, economy: row.economyScore, comfort: row.comfortScore, fun: row.practicalityScore,
    why: row.ownershipNotes ?? "המלצה לפי נתוני הדגם והעדפות השימוש שלך.", pros: row.pros ?? [], cons: row.cons ?? [], bodyType: row.bodyType,
    insuranceMin: row.insuranceMonthlyMin ?? undefined, insuranceMax: row.insuranceMonthlyMax ?? undefined,
    ownershipMonthly: row.ownershipCostMonthly ?? row.estimatedMonthlyCost ?? undefined,
    fuelMonthly: row.tcoFuelMonthly ?? undefined, insuranceMonthlyAmt: row.tcoInsuranceMonthly ?? undefined,
    maintenanceMonthly: row.tcoMaintenanceMonthly ?? undefined, depreciationMonthly: row.tcoDepreciationMonthly ?? undefined,
    marketRange,
    dataNote: `${registry} מחיר: אומדן השוואתי שנצפה ב-${seen}; ${row.marketSnapshotDisclaimer ?? "לא הצעת מחיר חיה."}${row.primarySourceName ? ` מקור: ${row.primarySourceName}.` : ""}`,
    dataStatus: row.dataStatus ?? "estimated", dataConfidence: row.dataConfidence ?? 0,
    sourceName: row.primarySourceName ?? undefined, sourceUrl: row.primarySourceUrl ?? undefined,
    lastVerifiedAt: row.lastVerifiedAt ? new Date(row.lastVerifiedAt).toLocaleDateString("he-IL") : undefined,
  };
}
