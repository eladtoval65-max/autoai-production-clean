/**
 * CamaOla — Catalog Batch 17: daily market update 2026-10-24 (data-only; consumed by scripts/build-static-catalog.mjs)
 * New models: the best-selling models of H1 2026 that were missing from the catalog. Ranking (172 models, Jan–Jun 2026):
 * https://www.cartube.co.il/חדשות-רכב/זינוק-במסירות-רכב-חדש-מסירות-רכב-חדש-בישראל-יוני-2026
 * — Skoda Scala #17, Mitsubishi Outlander #20, Chery FX #21, Skoda Kamiq #25. (Kia Niro #18 skipped: trim list and power figures conflict.)
 * Sources (retrieved 2026-10-24):
 *  - Skoda Scala:   carzone.co.il/Skoda/Scala/2026 — Selection 1.0 (only trim) ₪138,490, 1.0 TSI 115 hp. Consumption: carzone 19.2 km/L
 *                   (old cycle) vs auto.co.il/cars/skoda/scala/ 17.5 km/L — the lower figure is used. 446 L (auto.co.il).
 *  - Skoda Kamiq:   carzone.co.il/Skoda/Kamiq/2026 — Selection ₪139,990 / Advance ₪146,990 / Style ₪154,990, 1.0 TSI 115 hp,
 *                   18.3 km/L (carzone running-cost section). Gearbox and boot litres not verified → not stated.
 *  - Chery FX:      carzone.co.il/chery/FX/ — Comfort HEV ₪152,990; line ₪146,990–173,990 (carzone.co.il/chery/, auto.co.il/model/chery-fx).
 *                   Hybrid 1.5T + electric 246 hp combined, 18.8 km/L, 372 L (auto.co.il).
 *  - Mitsubishi Outlander: carzone.co.il/Mitsubishi/Outlander — Intense MHEV 1.5 7-seat ₪189,990; line top ₪244,990 (cartube Mitsubishi
 *                   price list); 1.5T mild hybrid 174 hp, CVT; 11.8 km/L (carzone) / 11.9 km/L (auto.co.il). 7 seats.
 *  - Deepal S05:    Euro NCAP 5★ 2025 now confirmed (euroncap.com/assessments/deepal/s05/1162/, datasheet
 *                   cdn.euroncap.com/media/94560/euroncap-2025-deepal-s05-datasheet.pdf).
 *  - Trim-name fixes (price unchanged): Chery Tiggo 8 Pro ₪179,990 is the Comfort 1.6 trim (carzone.co.il/chery/Tiggo-8-Pro/, Noble = ₪189,990);
 *                   MINI Countryman ₪273,000 is "C Classic HUD" (carzone.co.il/MINI/Countryman; plain C Classic ₪269,000).
 * Euro NCAP for Scala / Kamiq / FX appears only on carzone pages (not confirmed on euroncap.com) → not claimed.
 * Running costs are CamaOla ESTIMATES on the seed basis (petrol ₪7.10/L, rescaled at build time), 15,000 km/yr.
 * Insurance scaled by price^0.6 from Skoda Fabia (Scala, Kamiq), Chery Tiggo 7 Pro Hybrid (FX) or Skoda Kodiaq (Outlander) — never a quote.
 * Depreciation: 10%/yr (Skoda, as Fabia), 12%/yr (Chery, as Tiggo 7 Pro), 11%/yr (Outlander). Licensing added by the builder.
 */
const newCars = [
  {
    makeSlug: "skoda", model: "Scala", modelSlug: "scala",
    bodyType: "hatchback", seats: 5, cargoLiters: 446, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 115, combinedConsumption: 5.7, trimName: "Selection 1.0 TSI",
    newPrice: 138490, priceMin: 138490, priceMedian: 138490, priceMax: 138490,
    reliabilityScore: 78, safetyScore: 80, economyScore: 80, comfortScore: 76, practicalityScore: 80,
    ownershipNotes: "האצ'בק משפחתי של סקודה (מתיחת פנים 2026), מנוע 1.0 טורבו 115 כ\"ס. גרסה אחת במחירון. תא מטען גדול (446 ליטר) לגודל הרכב.",
    pros: ["תא מטען 446 ליטר", "מחיר נמוך לרכב משפחתי", "מהנמכרים בישראל ב-2026"],
    cons: ["רמת גימור אחת בלבד", "מנוע קטן לנסיעות עמוסות", "צריכה מוצהרת לפי שיטת מדידה ישנה (17.5–19.2 ק\"מ לליטר)"],
    dataConfidence: 60,
    fuelMonthly: 507, insuranceMonthly: 440, maintenanceMonthly: 230, depreciationMonthly: 1154,
    insuranceMin: 364, insuranceMax: 525,
    priceSource: "carzone.co.il/Skoda/Scala/2026 (2026-10-24)",
  },
  {
    makeSlug: "skoda", model: "Kamiq", modelSlug: "kamiq",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 115, combinedConsumption: 5.5, trimName: "Advance 1.0 TSI",
    newPrice: 146990, priceMin: 139990, priceMedian: 146990, priceMax: 154990,
    reliabilityScore: 78, safetyScore: 80, economyScore: 80, comfortScore: 76, practicalityScore: 78,
    ownershipNotes: "קרוסאובר קומפקטי של סקודה (מתיחת פנים 2026), מנוע 1.0 טורבו 115 כ\"ס בכל הגרסאות. צריכה לפי carzone כ-18.3 ק\"מ לליטר.",
    pros: ["חסכוני בדלק", "מרווח לגודלו", "שלוש רמות גימור במחיר נוח"],
    cons: ["מנוע קטן לנסיעות עמוסות", "מפרט התיבה ונפח המטען לא אומתו", "אין גרסה היברידית"],
    dataConfidence: 56,
    fuelMonthly: 485, insuranceMonthly: 456, maintenanceMonthly: 230, depreciationMonthly: 1225,
    insuranceMin: 378, insuranceMax: 544,
    priceSource: "carzone.co.il/Skoda/Kamiq/2026 (2026-10-24)",
  },
  {
    makeSlug: "chery", model: "FX", modelSlug: "fx",
    bodyType: "suv", seats: 5, cargoLiters: 372, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 246, combinedConsumption: 5.3, trimName: "Comfort HEV",
    newPrice: 152990, priceMin: 146990, priceMedian: 152990, priceMax: 173990,
    reliabilityScore: 68, safetyScore: 80, economyScore: 84, comfortScore: 78, practicalityScore: 78,
    ownershipNotes: "קרוסאובר משפחתי של צ'רי. בגרסה ההיברידית 1.5 טורבו ומנוע חשמלי, 246 כ\"ס משולב וכ-18.8 ק\"מ לליטר מוצהר. במחירון גם גרסת בנזין 1.6 טורבו וגרסה חשמלית (FX EV).",
    pros: ["הספק גבוה להיברידי בקטגוריה", "צריכה נמוכה", "מחיר תחרותי"],
    cons: ["אמינות לטווח ארוך לא מוכחת", "ערך יד שנייה לא ידוע", "תא מטען בינוני (372 ליטר)"],
    dataConfidence: 56,
    fuelMonthly: 472, insuranceMonthly: 576, maintenanceMonthly: 245, depreciationMonthly: 1530,
    insuranceMin: 477, insuranceMax: 681,
    priceSource: "carzone.co.il/chery/FX/ (2026-10-24)",
  },
  {
    makeSlug: "mitsubishi", model: "Outlander", modelSlug: "outlander",
    bodyType: "suv", seats: 7, cargoLiters: 137, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 174, combinedConsumption: 8.5, trimName: "Intense MHEV 1.5T (7 מקומות)",
    newPrice: 189990, priceMin: 189990, priceMedian: 189990, priceMax: 244990,
    reliabilityScore: 74, safetyScore: 70, economyScore: 66, comfortScore: 78, practicalityScore: 86,
    ownershipNotes: "SUV גדול עם 7 מקומות: 1.5 טורבו מיילד-היברידי 174 כ\"ס ותיבת CVT. צריכה מוצהרת כ-11.8 ק\"מ לליטר. תא המטען קטן (137 ליטר) כשכל המושבים פתוחים.",
    pros: ["7 מקומות במחיר נמוך יחסית", "מרווח", "מהנמכרים בישראל ב-2026"],
    cons: ["צריכת דלק גבוהה יחסית", "תא מטען קטן עם שורה שלישית", "אין דירוג Euro NCAP לדגם"],
    dataConfidence: 56,
    fuelMonthly: 752, insuranceMonthly: 675, maintenanceMonthly: 270, depreciationMonthly: 1742,
    insuranceMin: 562, insuranceMax: 796,
    priceSource: "carzone.co.il/Mitsubishi/Outlander (2026-10-24)",
  },
  {
    makeSlug: "deepal", model: "S05", safetyScore: 92,
    ownershipNotes: "קרוסאובר חשמלי של Changan: בגרסת Max 2x4 ‏272 כ\"ס, סוללה 68.8 קוט\"ש, טווח מוצהר 485 ק\"מ וצריכה מוצהרת 15.9 קוט\"ש ל-100 ק\"מ. במחירון גם גרסת פלאג-אין וגרסת 4X4. 5 כוכבי Euro NCAP (2025).",
    pros: ["5 כוכבי Euro NCAP (2025)", "מחיר נמוך ל-SUV חשמלי", "טווח טוב בגרסת Max", "תא מטען 492 ליטר"],
  },
  { makeSlug: "chery", model: "Tiggo 8 Pro", trimName: "Comfort 1.6T" },
  { makeSlug: "mini", model: "Countryman", trimName: "C Classic HUD 1.5T" },
];

export {}; // makes this file a module so each batch has its own `newCars`
