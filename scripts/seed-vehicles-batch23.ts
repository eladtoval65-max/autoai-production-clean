/**
 * CamaOla — Catalog Batch 23: 2 new models, 2026-11-08 (data-only; consumed by scripts/build-static-catalog.mjs)
 * Picked as mainstream models of makes still missing from the catalog (Dacia, Renault). Omoda 5 Hybrid and Hyundai i10 were
 * researched and skipped (no current Israeli list price found).
 * All list prices, powertrain and claimed consumption verified 2026-11-08 from model/trim pages:
 *  - Dacia Duster Hybrid (gen 3): Adventure 1.8 full hybrid 2WD ₪149,990; hybrid line ₪149,990–170,990 (Discover 1.2T hybrid 4x4)
 *                   (auto.co.il/cars/dacia/duster/2026; carzone.co.il news "גרסאות היברידיות לדאציה דאסטר החדשה 2026 מחיר החל מ-149,990").
 *                   155 hp, automatic, FWD; claimed 21.3 km/L (auto.co.il; carzone ~4.7 L/100 km agrees); 439 L (auto.co.il .../2026/580635/);
 *                   5 seats. carzone/cartube also still list a 1.2T petrol manual at ₪139,990 (not on auto.co.il) → not used.
 *                   Euro NCAP: euroncap.com result page could not be read → not claimed.
 *  - Renault Clio (gen 5): Evolution 1.0T CVT ₪124,990; line ₪124,990–126,990 (Techno / Techno Plus; carzone.co.il/Renault/Clio/2026).
 *                   90 hp, CVT; claimed 17.2 km/L (auto.co.il/cars/renault/clio/2026/581117/); 391 L; 5 seats. Euro NCAP not confirmed → not claimed.
 * Consumption field: claimed figure converted to L/100 km. Running costs are CamaOla ESTIMATES on the seed basis (petrol ₪7.10/L, rescaled
 * at build time), 15,000 km/yr: fuel = L/100 km × 150 × 7.10 / 12. Insurance is scaled by (price/176,990)^0.6 from Hyundai Kona Hybrid
 * (543 / 441 / 634) and is never a quote. Depreciation: 11%/yr (as Peugeot 2008).
 */
const newCars = [
  {
    makeSlug: "dacia", model: "Duster Hybrid", modelSlug: "duster-hybrid",
    bodyType: "suv", seats: 5, cargoLiters: 439, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 155, combinedConsumption: 4.7, trimName: "Adventure 1.8 Hybrid",
    newPrice: 149990, priceMin: 149990, priceMedian: 159990, priceMax: 170990,
    reliabilityScore: 74, safetyScore: 58, economyScore: 88, comfortScore: 66, practicalityScore: 78,
    ownershipNotes: "רכב פנאי משפחתי בהנעה היברידית מלאה: 1.8 בנזין ומנוע חשמלי, 155 כ\"ס ותיבה אוטומטית; צריכה מוצהרת 21.3 ק\"מ לליטר. תא מטען 439 ליטר. גרסת 1.2 טורבו היברידית עם הנעה כפולה מגיעה ל-₪170,990. דירוג Euro NCAP לא אומת.",
    pros: ["מחיר נמוך לרכב פנאי היברידי בגודל הזה", "חסכוני בדלק", "תא מטען משפחתי"],
    cons: ["דירוג Euro NCAP לא אומת", "רמת גימור ואבזור בסיסיים יחסית", "מותג תקציבי — ירידת ערך לא ידועה בגרסה ההיברידית"],
    dataConfidence: 56,
    fuelMonthly: 417, insuranceMonthly: 492, maintenanceMonthly: 200, depreciationMonthly: 1375,
    insuranceMin: 399, insuranceMax: 574,
    priceSource: "auto.co.il Dacia Duster 2026 + carzone.co.il Duster hybrid 2026 (2026-11-08)",
  },
  {
    makeSlug: "renault", model: "Clio", modelSlug: "clio",
    bodyType: "hatchback", seats: 5, cargoLiters: 391, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 90, combinedConsumption: 5.8, trimName: "Evolution 1.0T CVT",
    newPrice: 124990, priceMin: 124990, priceMedian: 126990, priceMax: 126990,
    reliabilityScore: 72, safetyScore: 64, economyScore: 78, comfortScore: 68, practicalityScore: 64,
    ownershipNotes: "רכב סופר-מיני עם מנוע 1.0 טורבו בנזין, 90 כ\"ס ותיבה רציפה; צריכה מוצהרת 17.2 ק\"מ לליטר. תא מטען 391 ליטר — גדול לקטגוריה. דירוג Euro NCAP לא אומת.",
    pros: ["תא מטען גדול לרכב בגודל הזה", "מחיר כניסה נמוך", "תיבה אוטומטית רציפה בגרסת הבסיס"],
    cons: ["מנוע חלש יחסית (90 כ\"ס)", "דירוג Euro NCAP לא אומת", "צריכת דלק גבוהה מהיברידיים באותו מחיר"],
    dataConfidence: 56,
    fuelMonthly: 515, insuranceMonthly: 441, maintenanceMonthly: 190, depreciationMonthly: 1146,
    insuranceMin: 358, insuranceMax: 515,
    priceSource: "auto.co.il Renault Clio 2026 Evolution + carzone.co.il/Renault/Clio/2026 (2026-11-08)",
  },
];
export {};
