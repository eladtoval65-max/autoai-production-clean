/**
 * CamaOla — Catalog Batch 24: 2 new models, 2026-11-09 (data-only; consumed by scripts/build-static-catalog.mjs)
 * Picked as new electric models on both Israeli price lists (new catalog make: Leapmotor).
 * All list prices, powertrain and claimed consumption verified 2026-11-09 from model/trim pages:
 *  - Kia EV5: Premium LR ₪198,900, Executive LR ₪219,900 (auto.co.il/cars/kia/ev5/2026/premium/ and .../executive/;
 *             carzone.co.il/Kia/EV5 same trims and prices; cartube news "קיה EV5 החשמלי נחת בישראל" same prices).
 *             217 hp, FWD, 81.4 kWh; claimed 16.9 kWh/100 km (Premium), WLTP 530 km; 566 L; 5 seats.
 *             Euro NCAP 5★ 2025 (https://www.euroncap.com/en/results/kia/ev5/57962).
 *  - Leapmotor B05: Design ₪139,900 (auto.co.il/cars/leap-motor/b05/2026/218hp-design/; carzone.co.il/leapmotor/B05 and the
 *             cartube Leapmotor price list agree on ₪139,900). 218 hp, RWD, 67.1 kWh; claimed 15.9 kWh/100 km, WLTP 482 km;
 *             345 L; 5 seats. Euro NCAP 5★ 2026 (news.euroncap.com "Leapmotor B05 - Euro NCAP 2026 results - 5 stars").
 * Running costs are CamaOla ESTIMATES on the seed basis (₪0.55/kWh, rescaled at build time), 15,000 km/yr:
 * energy = kWh/100 km × 150 × 0.55 / 12. Insurance is scaled by (price/169,900)^0.6 from Kia EV3 (680 / 560 / 800) and is never
 * a quote. Depreciation: 12%/yr (as Kia EV3) for EV5, 13%/yr (as Jaecoo J5 EV) for the B05.
 */
const newCars = [
  {
    makeSlug: "kia", model: "EV5", modelSlug: "ev5",
    bodyType: "suv", seats: 5, cargoLiters: 566, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 217, combinedConsumption: null, trimName: "Premium LR (81.4 kWh)",
    newPrice: 198900, priceMin: 198900, priceMedian: 198900, priceMax: 219900,
    reliabilityScore: 82, safetyScore: 92, economyScore: 92, comfortScore: 84, practicalityScore: 88,
    ownershipNotes: "רכב פנאי חשמלי משפחתי של קיה: סוללה 81.4 קוט\"ש, 217 כ\"ס והנעה קדמית; טווח WLTP מוצהר 530 ק\"מ וצריכה מוצהרת 16.9 קוט\"ש ל-100 ק\"מ. תא מטען 566 ליטר ועוד תא קדמי. 5 כוכבי Euro NCAP (2025).",
    pros: ["5 כוכבי Euro NCAP", "תא מטען גדול מאוד", "טווח מוצהר ארוך", "שירות קיה נפוץ"],
    cons: ["הנעה קדמית בלבד בישראל", "יקר מהמתחרים הסיניים", "ירידת ערך של רכב חשמלי עדיין לא ידועה"],
    dataConfidence: 62,
    fuelMonthly: 116, insuranceMonthly: 747, maintenanceMonthly: 100, depreciationMonthly: 1989,
    insuranceMin: 615, insuranceMax: 879,
    priceSource: "auto.co.il Kia EV5 2026 Premium/Executive + carzone.co.il/Kia/EV5 (2026-11-09)",
  },
  {
    makeSlug: "leapmotor", model: "B05", modelSlug: "b05",
    bodyType: "hatchback", seats: 5, cargoLiters: 345, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 218, combinedConsumption: null, trimName: "Design (67.1 kWh)",
    newPrice: 139900, priceMin: 139900, priceMedian: 139900, priceMax: 139900,
    reliabilityScore: 66, safetyScore: 90, economyScore: 93, comfortScore: 76, practicalityScore: 68,
    ownershipNotes: "האצ'בק חשמלי בהנעה אחורית: סוללה 67.1 קוט\"ש ו-218 כ\"ס; טווח WLTP מוצהר 482 ק\"מ וצריכה מוצהרת 15.9 קוט\"ש ל-100 ק\"מ. 5 כוכבי Euro NCAP (2026). מותג חדש יחסית בישראל.",
    pros: ["מחיר נמוך לחשמלי עם טווח כזה", "5 כוכבי Euro NCAP", "חסכוני מאוד באנרגיה"],
    cons: ["תא מטען קטן יחסית (345 ליטר)", "מותג חדש — זמינות שירות וחלפים לבדיקה", "ירידת ערך צפויה גבוהה"],
    dataConfidence: 58,
    fuelMonthly: 109, insuranceMonthly: 605, maintenanceMonthly: 100, depreciationMonthly: 1516,
    insuranceMin: 498, insuranceMax: 712,
    priceSource: "auto.co.il Leapmotor B05 2026 Design + carzone.co.il/leapmotor/B05 + cartube Leapmotor price list (2026-11-09)",
  },
];
export {};
