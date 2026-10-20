/**
 * CamaOla — Catalog Batch 13: catalog expansion 2 (2026-10-20) (data-only; consumed by scripts/build-static-catalog.mjs)
 * Three models of makes already on the site. List price, powertrain and consumption read on the carzone model pages today:
 *  - Skoda Fabia: carzone.co.il/Skoda/Fabia/2026 (+ /compare/): Selection 1.0 TSI ₪120,990, DSG 7, 115 hp per spec table;
 *    road test ~13 km/L → 7.7 L/100 km. Euro NCAP 5★ (2021, euroncap.com).
 *  - Kia Sorento Hybrid: carzone.co.il/Kia/Sorento: EX hybrid 1.6T ₪319,900, 230 hp, 6 seats; road test ~12.5 km/L → 8.0 L/100 km.
 *    Euro NCAP 5★ (2020, euroncap.com).
 *  - MG3 Hybrid: carzone.co.il/MG/3: Comfort Hybrid ₪126,888; road test ~19.5 km/L → 5.1 L/100 km; 192 hp system output per
 *    Wikipedia (not on the page). Euro NCAP 4★ (2025, euroncap.com; driver-seat latch failed in the test, MG redesigning it).
 * Running costs are CamaOla ESTIMATES (petrol ₪7.10/L, 15,000 km/yr; insurance scaled from Hyundai i20 by price^0.6, never a quote;
 * depreciation 10% of list price per year; licensing added by the builder). Scores are editorial estimates. dataConfidence ≤ 62.
 */
const newCars = [
  {
    makeSlug: "skoda", model: "Fabia", modelSlug: "fabia",
    bodyType: "hatchback", seats: 5, cargoLiters: 343, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 115, combinedConsumption: 7.7, trimName: "Selection 1.0 TSI",
    newPrice: 120990, priceMin: 114000, priceMedian: 120990, priceMax: 135990,
    reliabilityScore: 78, safetyScore: 88, economyScore: 76, comfortScore: 72, practicalityScore: 76,
    ownershipNotes: "האצ'בק קטן עם מנוע 1.0 טורבו ותיבת DSG 7 יבשה, 5 כוכבי Euro NCAP (2021). מבחן דרך מדד כ-13 ק\"מ לליטר. תא מטען 343 ליטר, גדול לקטגוריה.",
    pros: ["5 כוכבי Euro NCAP (2021)", "תא מטען גדול לקטגוריה", "מחיר כניסה נמוך"],
    cons: ["צריכה בפועל כ-13 ק\"מ לליטר", "תיבת DSG יבשה: לבדוק התנהגות בזחילה", "ביצועים צנועים במנוע 1.0"],
    dataConfidence: 60,
    fuelMonthly: 683, insuranceMonthly: 406, maintenanceMonthly: 220, depreciationMonthly: 1008,
    insuranceMin: 336, insuranceMax: 484,
    priceSource: "carzone.co.il/Skoda/Fabia/2026 + /compare/ (2026-10-20)",
  },
  {
    makeSlug: "kia", model: "Sorento Hybrid", modelSlug: "sorento-hybrid",
    bodyType: "suv", seats: 6, cargoLiters: null, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 230, combinedConsumption: 8.0, trimName: "EX Hybrid 1.6T",
    newPrice: 319900, priceMin: 300000, priceMedian: 319900, priceMax: 319900,
    reliabilityScore: 80, safetyScore: 90, economyScore: 62, comfortScore: 84, practicalityScore: 90,
    ownershipNotes: "רכב שטח גדול ל-6 מושבים עם מנוע 1.6 טורבו היברידי 230 כ\"ס, 5 כוכבי Euro NCAP (2020). מבחן דרך מדד כ-12.5 ק\"מ לליטר, כ-17% פחות מהמוצהר.",
    pros: ["6 מושבים", "5 כוכבי Euro NCAP (2020)", "היברידי חסכוני יחסית לגודלו"],
    cons: ["מחיר גבוה", "צריכה בפועל כ-12.5 ק\"מ לליטר", "תא מטען קטן כששורה שלישית פתוחה"],
    dataConfidence: 60,
    fuelMonthly: 710, insuranceMonthly: 728, maintenanceMonthly: 320, depreciationMonthly: 2666,
    insuranceMin: 601, insuranceMax: 867,
    priceSource: "carzone.co.il/Kia/Sorento (2026-10-20)",
  },
  {
    makeSlug: "mg", model: "MG3 Hybrid", modelSlug: "mg3-hybrid",
    bodyType: "hatchback", seats: 5, cargoLiters: null, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 192, combinedConsumption: 5.1, trimName: "Comfort Hybrid 1.5",
    newPrice: 126888, priceMin: 119000, priceMedian: 126888, priceMax: 127888,
    reliabilityScore: 74, safetyScore: 78, economyScore: 88, comfortScore: 70, practicalityScore: 72,
    ownershipNotes: "האצ'בק קטן היברידי (1.5 + מנוע חשמלי, 192 כ\"ס משולב). מבחן דרך מדד כ-19.5 ק\"מ לליטר. 4 כוכבי Euro NCAP (2025); מנעול מושב הנהג נכשל במבחן והיצרן הודיע על תיקון.",
    pros: ["חסכוני מאוד בדלק", "מהיברידיים הזולים בשוק", "ביצועים טובים לגודלו"],
    cons: ["4 כוכבי Euro NCAP ותקלת מושב במבחן", "שירות ורשת מוסכים מצומצמים יותר", "ערך יד שנייה לא ודאי"],
    dataConfidence: 60,
    fuelMonthly: 453, insuranceMonthly: 418, maintenanceMonthly: 200, depreciationMonthly: 1057,
    insuranceMin: 345, insuranceMax: 498,
    priceSource: "carzone.co.il/MG/3 (2026-10-20)",
  },
];

export {}; // makes this file a module so each batch has its own `newCars`
