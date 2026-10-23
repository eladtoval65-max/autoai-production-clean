/**
 * CamaOla — Catalog Batch 16: daily market update 2026-10-23 (data-only; consumed by scripts/build-static-catalog.mjs)
 * New models: four of the best-selling rechargeable models of Jan–Sep 2026 that were missing from the catalog.
 * Ranking (rechargeable models only, data.gov.il registrations): https://www.cars-israel-statistics.com/dashboard-en.html
 * — Deepal S05 #11, Omoda 7 #12, Geely EX5/E5 #14, Tesla Model 3 #15. (The cartube Jan–Sep top 20 is fully in the catalog already.)
 * Sources (retrieved 2026-10-23):
 *  - Tesla Model 3: carzone.co.il/Tesla/Model-3 and carzone.co.il/Tesla ₪191,592–293,567; RWD Standard 283 hp, 57.5 kWh,
 *                   13.0 kWh/100 km claimed, 594 L (auto.co.il/cars/tesla/model-3/2026/standard-2x4/).
 *                   Euro NCAP 5★ 2025 (news.euroncap.com Tesla Model 3 2025).
 *  - Geely EX5 (sold as "E5" from 09/2026): carzone.co.il/Geely/ ₪161,990–169,490; 214 hp, 60.2/68.4 kWh,
 *                   15.8–16.9 kWh/100 km claimed, 461 L (auto.co.il/cars/geely/ex5/2026/). Euro NCAP 5★ 2025 (Geely press release;
 *                   datasheet cdn.euroncap.com/media/86298/euroncap-2025-geely-ex5-datasheet.pdf).
 *  - Omoda 7 PHEV:  carzone.co.il/Omoda-Jaecoo/Omoda-7/ ₪179,900–199,900; 1.5T PHEV 204 hp combined, 18.4 kWh, 92 km electric
 *                   (auto.co.il/cars/omoda/7/2026/579824/; carzone lists 143 hp = engine only); carzone review ~20 km/L.
 *                   Cargo litres conflict (537 vs ~640) → null. Euro NCAP not confirmed.
 *  - Deepal S05:    carzone.co.il/Deepal/S05/compare/ ₪149,990–189,990; Max 2x4 EV ₪159,990, 272 hp, 68.8 kWh, 15.9 kWh/100 km
 *                   claimed, 492 L (auto.co.il/cars/deepal/s05/2026/579758/). Euro NCAP 2025 tested (datasheet
 *                   cdn.euroncap.com/media/94560/euroncap-2025-deepal-s05-datasheet.pdf) — star count not confirmed, not claimed here.
 * Running costs are CamaOla ESTIMATES on the seed basis (petrol ₪7.10/L, electricity ₪0.55/kWh, rescaled at build time),
 * 15,000 km/yr; EV consumption = claimed figure + ~10% for real-world use; Omoda 7 uses the carzone review figure (~5 L/100 km all-in).
 * Insurance scaled by price^0.6 from Tesla Model Y (Model 3) or Geely Starray EM-i (the others) — never a quote.
 * Depreciation 11–12.5% of list price per year (licensing added by the builder).
 */
const newCars = [
  {
    makeSlug: "tesla", model: "Model 3", modelSlug: "model-3",
    bodyType: "sedan", seats: 5, cargoLiters: 594, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 283, combinedConsumption: null, trimName: "RWD Standard (57.5 kWh)",
    newPrice: 191592, priceMin: 191592, priceMedian: 191592, priceMax: 293567,
    reliabilityScore: 74, safetyScore: 96, economyScore: 96, comfortScore: 82, practicalityScore: 80,
    ownershipNotes: "הסדאן החשמלי של טסלה: 5 כוכבי Euro NCAP (2025), 283 כ\"ס וסוללה 57.5 קוט\"ש בגרסת הבסיס, צריכה מוצהרת 13 קוט\"ש ל-100 ק\"מ — מהיעילים בשוק. ביטוח ותיקוני פחחות יקרים יחסית.",
    pros: ["5 כוכבי Euro NCAP", "יעיל מאוד בצריכת חשמל", "רשת טעינה מהירה", "תא מטען 594 ליטר"],
    cons: ["ביטוח ותיקונים יקרים", "נסיעה קשיחה יחסית", "רוב הפעולות דרך המסך"],
    dataConfidence: 62,
    fuelMonthly: 100, insuranceMonthly: 885, maintenanceMonthly: 120, depreciationMonthly: 1756,
    insuranceMin: 737, insuranceMax: 1040,
    priceSource: "carzone.co.il/Tesla/Model-3 (2026-10-23)",
  },
  {
    makeSlug: "geely", model: "EX5", modelSlug: "ex5",
    bodyType: "suv", seats: 5, cargoLiters: 461, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 214, combinedConsumption: null, trimName: "Pro (60.2 kWh)",
    newPrice: 161990, priceMin: 161990, priceMedian: 161990, priceMax: 169490,
    reliabilityScore: 70, safetyScore: 92, economyScore: 90, comfortScore: 80, practicalityScore: 82,
    ownershipNotes: "קרוסאובר חשמלי משפחתי (נמכר מספטמבר 2026 בשם E5): 214 כ\"ס, סוללה 60.2 או 68.4 קוט\"ש וטווח מוצהר 410–475 ק\"מ. Euro NCAP 5 כוכבים (2025).",
    pros: ["5 כוכבי Euro NCAP", "מחיר נמוך ל-SUV חשמלי משפחתי", "תא מטען 461 ליטר"],
    cons: ["מותג חדש יחסית בישראל", "ערך שמירה עדיין לא ידוע", "טווח בינוני בגרסת הבסיס"],
    dataConfidence: 60,
    fuelMonthly: 120, insuranceMonthly: 485, maintenanceMonthly: 120, depreciationMonthly: 1620,
    insuranceMin: 398, insuranceMax: 575,
    priceSource: "carzone.co.il/Geely/ (2026-10-23)",
  },
  {
    makeSlug: "jaecoo", model: "Omoda 7", modelSlug: "omoda-7",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 204, combinedConsumption: 5.0, trimName: "Elevate PHEV",
    newPrice: 179900, priceMin: 179900, priceMedian: 179900, priceMax: 199900,
    reliabilityScore: 68, safetyScore: 72, economyScore: 84, comfortScore: 80, practicalityScore: 80,
    ownershipNotes: "קרוסאובר פלאג-אין (1.5 טורבו + חשמלי, 204 כ\"ס משולב), סוללה 18.4 קוט\"ש וטווח חשמלי מוצהר של 92 ק\"מ. בסקירת carzone כ-20 ק\"מ לליטר; עם טעינה קבועה בבית הצריכה נמוכה יותר.",
    pros: ["טווח חשמלי ארוך (כ-90 ק\"מ מוצהר)", "מהנמכרים בישראל ב-2026", "מחיר תחרותי לפלאג-אין"],
    cons: ["דירוג Euro NCAP לא אומת", "מותג חדש: לבדוק שירות וחלפים באזורך", "ערך שמירה עדיין לא ידוע"],
    dataConfidence: 55,
    fuelMonthly: 444, insuranceMonthly: 516, maintenanceMonthly: 220, depreciationMonthly: 1649,
    insuranceMin: 424, insuranceMax: 612,
    priceSource: "carzone.co.il/Omoda-Jaecoo/Omoda-7/ (2026-10-23)",
  },
  {
    makeSlug: "deepal", model: "S05", modelSlug: "s05",
    bodyType: "suv", seats: 5, cargoLiters: 492, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 272, combinedConsumption: null, trimName: "Max 2x4 (68.8 kWh)",
    newPrice: 159990, priceMin: 149990, priceMedian: 159990, priceMax: 189990,
    reliabilityScore: 68, safetyScore: 80, economyScore: 88, comfortScore: 80, practicalityScore: 82,
    ownershipNotes: "קרוסאובר חשמלי של Changan: בגרסת Max 2x4 ‏272 כ\"ס, סוללה 68.8 קוט\"ש, טווח מוצהר 485 ק\"מ וצריכה מוצהרת 15.9 קוט\"ש ל-100 ק\"מ. במחירון גם גרסת פלאג-אין וגרסת 4X4. נבחן ב-Euro NCAP ב-2025.",
    pros: ["מחיר נמוך ל-SUV חשמלי", "טווח טוב בגרסת Max", "תא מטען 492 ליטר"],
    cons: ["מותג חדש: לבדוק שירות וחלפים באזורך", "ערך שמירה עדיין לא ידוע", "מפרט גרסת הבסיס לא אומת"],
    dataConfidence: 55,
    fuelMonthly: 120, insuranceMonthly: 481, maintenanceMonthly: 120, depreciationMonthly: 1667,
    insuranceMin: 395, insuranceMax: 571,
    priceSource: "carzone.co.il/Deepal/S05/compare/ (2026-10-23)",
  },
];

export {}; // makes this file a module so each batch has its own `newCars`
