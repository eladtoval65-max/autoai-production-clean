/**
 * CamaOla — Catalog Batch 19: 5 new models, 2026-10-25 (data-only; consumed by scripts/build-static-catalog.mjs)
 * All list prices, powertrain and claimed consumption verified 2026-10-25 from model/trim pages:
 *  - Toyota Yaris (hybrid): Eco ₪140,990 (auto.co.il/cars/toyota/yaris/2026/eco/ + cartube.co.il/מחירון-רכב-חדש/טויוטה/טויוטה-יאריס);
 *                   1.5 hybrid 116 hp, CVT; 25.6 km/L WLTP (cartube); 286 L. Euro NCAP 4★ (12/2025, euroncap.com press release
 *                   "mercedes-star-shines-bright-as-euro-ncap-s-final-results..."). Line ₪139,900–143,990 (generations.ts 140,990–143,990 kept).
 *  - Peugeot 2008: Allure 1.2T MHEV 48V ₪149,990 (auto.co.il/cars/peugeot/2008/2026/mhev-allure/ + cartube.co.il/מחירון-רכב-חדש/פיג-ו/פיג-ו-2008;
 *                   carzone model page shows Allure 150,990); 145 hp, 6DCT; 20.0 km/L WLTP; 434 L. Euro NCAP 2019: 4★ standard / 5★ Safety Pack
 *                   (news.euroncap.com, pre-facelift). Line ₪147,990–159,990 (carzone brand page; cartube top 157,990).
 *  - Mazda CX-5 (new generation, 03/2026): Comfort AWD 2.5 ₪189,900 (cartube trim page 6849 + carzone.co.il/Mazda/CX-5/2026); 187 hp, 6AT, AWD;
 *                   11.1 km/L (cartube; auto.co.il 10.6); 541 L (auto.co.il; cartube 583). Euro NCAP 5★ 12/2025 (cdn.euroncap.com 2025 CX-5 datasheet).
 *                   Line ₪189,900–219,900.
 *  - Skoda Karoq: 1.5 TSI Selection ₪169,490 (auto.co.il/cars/skoda/karoq/2026/580500/ + carzone.co.il/Skoda/Karoq/2026); 150 hp, 7DSG;
 *                   15.6 km/L WLTP (cartube); 426 L. Euro NCAP not confirmed on euroncap.com → not claimed. Line ₪169,490–202,990 (carzone brand page).
 *  - Kia Seltos: 2.0 LX Plus ₪164,900 (carzone.co.il/Kia/Seltos/ + auto.co.il/cars/kia/seltos/2026/580368/; cartube 164,990); 149 hp, CVT;
 *                   13.1 km/L WLTP (cartube); 468 L. No Euro NCAP rating (auto.co.il: not tested). Line ₪164,900–167,990.
 * Consumption field = claimed figure converted to L/100 km. Running costs are CamaOla ESTIMATES on the seed basis (petrol ₪7.10/L,
 * rescaled at build time), 15,000 km/yr. Insurance scaled by price^0.6 from Hyundai Kona Hybrid — never a quote.
 * Depreciation 10%/yr (Yaris, CX-5, Karoq, Seltos), 11%/yr (2008).
 */
const newCars = [
  {
    makeSlug: "toyota", model: "Yaris Hybrid", modelSlug: "yaris-hybrid",
    bodyType: "hatchback", seats: 5, cargoLiters: 286, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 116, combinedConsumption: 3.9, trimName: "Eco 1.5 HEV",
    newPrice: 140990, priceMin: 140990, priceMedian: 140990, priceMax: 143990,
    reliabilityScore: 88, safetyScore: 76, economyScore: 92, comfortScore: 70, practicalityScore: 62,
    ownershipNotes: "רכב עירוני היברידי: 1.5 בנזין ומנוע חשמלי, 116 כ\"ס ותיבה רציפה; צריכה מוצהרת 25.6 ק\"מ לליטר. Euro NCAP ‏(12/2025): 4 כוכבים.",
    pros: ["חסכוני מאוד בדלק", "היברידי מלא בלי צורך בטעינה", "קל לתפעול"],
    cons: ["תא מטען קטן (286 ליטר)", "מרווח צפוף מאחור", "4 כוכבי Euro NCAP"],
    dataConfidence: 60,
    fuelMonthly: 346, insuranceMonthly: 474, maintenanceMonthly: 170, depreciationMonthly: 1175,
    insuranceMin: 385, insuranceMax: 553,
    priceSource: "auto.co.il Yaris 2026 Eco + cartube Toyota Yaris price list (2026-10-25)",
  },
  {
    makeSlug: "peugeot", model: "2008", modelSlug: "2008",
    bodyType: "suv", seats: 5, cargoLiters: 434, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 145, combinedConsumption: 5.0, trimName: "Allure 1.2T MHEV",
    newPrice: 149990, priceMin: 147990, priceMedian: 149990, priceMax: 159990,
    reliabilityScore: 70, safetyScore: 70, economyScore: 82, comfortScore: 76, practicalityScore: 70,
    ownershipNotes: "קרוסאובר קטן: 1.2 טורבו בנזין עם מערכת מיילד-היברידית 48V, ‏145 כ\"ס ותיבה כפולת מצמד; צריכה מוצהרת 20 ק\"מ לליטר. Euro NCAP ‏(2019, לפני מתיחת הפנים): 4 כוכבים, 5 עם חבילת הבטיחות.",
    pros: ["עיצוב חיצוני ופנימי", "התנהגות כביש טובה", "מנוע זריז וחסכוני"],
    cons: ["ארגונומיה דורשת הסתגלות (מיזוג במסך)", "מושב אחורי צפוף", "דירוג Euro NCAP ישן (2019)"],
    dataConfidence: 58,
    fuelMonthly: 444, insuranceMonthly: 492, maintenanceMonthly: 210, depreciationMonthly: 1375,
    insuranceMin: 399, insuranceMax: 574,
    priceSource: "auto.co.il 2008 MHEV Allure + cartube Peugeot 2008 price list (2026-10-25)",
  },
  {
    makeSlug: "mazda", model: "CX-5", modelSlug: "cx-5",
    bodyType: "suv", seats: 5, cargoLiters: 541, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 187, combinedConsumption: 9.0, trimName: "Comfort AWD 2.5",
    newPrice: 189900, priceMin: 189900, priceMedian: 189900, priceMax: 219900,
    reliabilityScore: 86, safetyScore: 90, economyScore: 62, comfortScore: 82, practicalityScore: 76,
    ownershipNotes: "SUV משפחתי בדור חדש (בישראל מ-03/2026): 2.5 בנזין ‏187 כ\"ס, תיבה אוטומטית 6 והנעה כפולה. צריכה מוצהרת כ-11 ק\"מ לליטר (בפועל פחות). Euro NCAP ‏(12/2025): 5 כוכבים.",
    pros: ["5 כוכבי Euro NCAP (2025)", "תא נוסעים בתחושה יוקרתית", "אמינות טובה"],
    cons: ["צריכת דלק גבוהה יחסית", "מערכת מולטימדיה לא נוחה", "מרווח פנימי בינוני"],
    dataConfidence: 58,
    fuelMonthly: 799, insuranceMonthly: 566, maintenanceMonthly: 230, depreciationMonthly: 1582,
    insuranceMin: 460, insuranceMax: 662,
    priceSource: "cartube CX-5 AWD Comfort trim page + carzone.co.il/Mazda/CX-5/2026 (2026-10-25)",
  },
  {
    makeSlug: "skoda", model: "Karoq", modelSlug: "karoq",
    bodyType: "suv", seats: 5, cargoLiters: 426, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 150, combinedConsumption: 6.4, trimName: "Selection 1.5 TSI",
    newPrice: 169490, priceMin: 169490, priceMedian: 169490, priceMax: 202990,
    reliabilityScore: 78, safetyScore: 65, economyScore: 76, comfortScore: 74, practicalityScore: 84,
    ownershipNotes: "SUV קומפקטי מעשי: 1.5 טורבו בנזין ‏150 כ\"ס ותיבת DSG 7; צריכה מוצהרת 15.6 ק\"מ לליטר. תא מטען 426 ליטר ומושב אחורי מרווח.",
    pros: ["תא מטען ומרחב אחורי גדולים", "ארגונומיה נוחה", "מעשי לשימוש משפחתי"],
    cons: ["מתלים רכים והטיית מרכב", "ציוד בסיסי ברמת Selection", "אין דירוג Euro NCAP מאומת"],
    dataConfidence: 58,
    fuelMonthly: 568, insuranceMonthly: 529, maintenanceMonthly: 220, depreciationMonthly: 1412,
    insuranceMin: 430, insuranceMax: 618,
    priceSource: "auto.co.il Karoq 2026 + carzone.co.il/Skoda/Karoq/2026 (2026-10-25)",
  },
  {
    makeSlug: "kia", model: "Seltos", modelSlug: "seltos",
    bodyType: "suv", seats: 5, cargoLiters: 468, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 149, combinedConsumption: 7.6, trimName: "LX Plus 2.0",
    newPrice: 164900, priceMin: 164900, priceMedian: 164900, priceMax: 167990,
    reliabilityScore: 80, safetyScore: 60, economyScore: 68, comfortScore: 76, practicalityScore: 80,
    ownershipNotes: "SUV קומפקטי: 2.0 בנזין אטמוספרי ‏149 כ\"ס ותיבה רציפה; צריכה מוצהרת 13.1 ק\"מ לליטר (במבחן כ-11). תא מטען 468 ליטר. לא נבחן ב-Euro NCAP.",
    pros: ["נוחות נסיעה", "מרווח ומעשי", "מנוע זריז"],
    cons: ["צריכת דלק גבוהה בנסיעה אמיתית", "איכות חומרים בינונית", "לא נבחן ב-Euro NCAP"],
    dataConfidence: 56,
    fuelMonthly: 674, insuranceMonthly: 520, maintenanceMonthly: 200, depreciationMonthly: 1374,
    insuranceMin: 423, insuranceMax: 608,
    priceSource: "carzone.co.il/Kia/Seltos + auto.co.il Seltos 2026 (2026-10-25)",
  },
];

export {}; // makes this file a module so each batch has its own `newCars`
