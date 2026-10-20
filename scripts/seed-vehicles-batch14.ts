/**
 * CamaOla — Catalog Batch 14: catalog expansion 3, 2026-10-20 (data-only; consumed by scripts/build-static-catalog.mjs)
 * Sources (retrieved 2026-10-20), list price + powertrain + road-test consumption from the carzone.co.il model pages:
 *  - ORA 05:            carzone.co.il/Ora/05/            ₪139,990, 1.5T hybrid 223 hp, road test 14.5–15.1 km/L
 *  - XPENG P7+:         carzone.co.il/XPENG/P7-Plus      ₪199,990, EV 74.9 kWh 313 hp, road test 15.1–16 kWh/100 km
 *  - KGM Tivoli:        carzone.co.il/KGM/Tivoli         ₪139,900, 1.5T petrol 163 hp, road test ~13 km/L
 *  - Jeep Compass:      carzone.co.il/Jeep/Compass       ₪209,900, 1.2T petrol 145 hp, road test ~13.3 km/L
 *  - Alfa Romeo Junior: carzone.co.il/Alfa-Romeo/Junior  ₪174,900, 1.2T mild hybrid 136 hp, road test ~15 km/L
 *  - MINI Countryman:   carzone.co.il/MINI/Countryman    ₪273,000, 1.5T petrol 170 hp, road test ~13.5 km/L
 * Running costs are CamaOla ESTIMATES (petrol ₪7.10/L, home charging ₪0.64/kWh, 15,000 km/yr; insurance scaled from
 * Hyundai i20 by price^0.6, never a quote; depreciation 10% of list price per year; licensing added by the builder).
 * Euro NCAP: MINI Countryman 5★ (2024) per its carzone page; the others have no confirmed result for the version sold here.
 */
const newCars = [
  {
    makeSlug: "ora", model: "05", modelSlug: "05",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 223, combinedConsumption: 6.8, trimName: "1.5T Hybrid",
    newPrice: 139990, priceMin: 139990, priceMedian: 139990, priceMax: 148990,
    reliabilityScore: 70, safetyScore: 70, economyScore: 80, comfortScore: 74, practicalityScore: 76,
    ownershipNotes: "קרוסאובר משפחתי היברידי (1.5 טורבו, 223 כ\"ס) של ORA מקבוצת GWM. במבחן דרך 14.5–15.1 ק\"מ לליטר. מותג חדש יחסית בישראל.",
    pros: ["היברידי חסכוני במחיר נמוך", "הספק גבוה לקטגוריה", "טווח נסיעה ארוך למיכל"],
    cons: ["מותג חדש: לבדוק שירות וחלפים באזורך", "לא נבחן ב-Euro NCAP", "ערך שמירה עדיין לא ידוע"],
    dataConfidence: 60,
    fuelMonthly: 604, insuranceMonthly: 443, maintenanceMonthly: 210, depreciationMonthly: 1167,
    insuranceMin: 365, insuranceMax: 527,
    priceSource: "carzone.co.il/Ora/05/ (2026-10-20)",
  },
  {
    makeSlug: "xpeng", model: "P7+", modelSlug: "p7-plus",
    bodyType: "sedan", seats: 5, cargoLiters: null, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 313, combinedConsumption: 0, trimName: "RWD 74.9 kWh",
    newPrice: 199990, priceMin: 199990, priceMedian: 199990, priceMax: 199990,
    reliabilityScore: 70, safetyScore: 72, economyScore: 90, comfortScore: 82, practicalityScore: 80,
    ownershipNotes: "סדאן חשמלי גדול, סוללה 74.9 קוט\"ש ו-313 כ\"ס. במבחן דרך 15.1–16 קוט\"ש ל-100 ק\"מ, כ-400–500 ק\"מ טווח לפי סגנון הנהיגה.",
    pros: ["צריכת חשמל נמוכה לגודלו", "מרווח ונוח", "הנעה אחורית חזקה"],
    cons: ["מותג חדש: לבדוק שירות וחלפים באזורך", "לא נבחן ב-Euro NCAP", "ערך שמירה עדיין לא ידוע"],
    dataConfidence: 58,
    fuelMonthly: 124, insuranceMonthly: 549, maintenanceMonthly: 120, depreciationMonthly: 1667,
    insuranceMin: 453, insuranceMax: 653,
    priceSource: "carzone.co.il/XPENG/P7-Plus (2026-10-20)",
  },
  {
    makeSlug: "kgm", model: "Tivoli", modelSlug: "tivoli",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 163, combinedConsumption: 7.7, trimName: "EX 1.5T",
    newPrice: 139900, priceMin: 139900, priceMedian: 139900, priceMax: 139900,
    reliabilityScore: 74, safetyScore: 68, economyScore: 72, comfortScore: 70, practicalityScore: 74,
    ownershipNotes: "קרוסאובר קטן קוריאני (סאנגיונג לשעבר) עם 1.5 טורבו בנזין, 163 כ\"ס. במבחן דרך כ-13 ק\"מ לליטר.",
    pros: ["מנוע חזק לקטגוריה", "מחיר נמוך", "תא נוסעים מרווח לגודלו"],
    cons: ["צריכת דלק בינונית", "דירוג Euro NCAP לא אומת", "רשת שירות קטנה יחסית"],
    dataConfidence: 58,
    fuelMonthly: 683, insuranceMonthly: 443, maintenanceMonthly: 220, depreciationMonthly: 1166,
    insuranceMin: 365, insuranceMax: 527,
    priceSource: "carzone.co.il/KGM/Tivoli (2026-10-20)",
  },
  {
    makeSlug: "jeep", model: "Compass", modelSlug: "compass",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 145, combinedConsumption: 7.5, trimName: "Altitude 1.2T",
    newPrice: 209900, priceMin: 209900, priceMedian: 209900, priceMax: 224900,
    reliabilityScore: 70, safetyScore: 72, economyScore: 74, comfortScore: 76, practicalityScore: 76,
    ownershipNotes: "קרוסאובר משפחתי עם 1.2 טורבו מיילד-היברידי, 145 כ\"ס. במבחן דרך כ-13.3 ק\"מ לליטר.",
    pros: ["חסכוני יחסית לגודלו", "מותג מוכר", "נוחות נסיעה טובה"],
    cons: ["יקר יחסית למתחרים בגודלו", "מנוע קטן לרכב משפחתי", "דירוג Euro NCAP של הדור הנוכחי לא אומת"],
    dataConfidence: 58,
    fuelMonthly: 666, insuranceMonthly: 565, maintenanceMonthly: 240, depreciationMonthly: 1749,
    insuranceMin: 466, insuranceMax: 672,
    priceSource: "carzone.co.il/Jeep/Compass (2026-10-20)",
  },
  {
    makeSlug: "alfa-romeo", model: "Junior", modelSlug: "junior",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 136, combinedConsumption: 6.7, trimName: "Core Ibrida 1.2T",
    newPrice: 174900, priceMin: 174900, priceMedian: 174900, priceMax: 202900,
    reliabilityScore: 70, safetyScore: 70, economyScore: 78, comfortScore: 74, practicalityScore: 70,
    ownershipNotes: "קרוסאובר קטן עם 1.2 טורבו מיילד-היברידי (Ibrida) ותיבה כפולת מצמד, 136 כ\"ס. במבחן דרך כ-15 ק\"מ לליטר.",
    pros: ["חסכוני", "עיצוב ומיתוג פרימיום", "נוח לעיר"],
    cons: ["תא מטען ומרווח אחורי קטנים", "תיבה כפולת מצמד: לבדוק בזחילה", "דירוג Euro NCAP לא אומת"],
    dataConfidence: 58,
    fuelMonthly: 595, insuranceMonthly: 507, maintenanceMonthly: 230, depreciationMonthly: 1458,
    insuranceMin: 418, insuranceMax: 603,
    priceSource: "carzone.co.il/Alfa-Romeo/Junior (2026-10-20)",
  },
  {
    makeSlug: "mini", model: "Countryman", modelSlug: "countryman",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 170, combinedConsumption: 7.4, trimName: "C Classic 1.5T",
    newPrice: 273000, priceMin: 273000, priceMedian: 273000, priceMax: 307000,
    reliabilityScore: 74, safetyScore: 88, economyScore: 74, comfortScore: 80, practicalityScore: 76,
    ownershipNotes: "קרוסאובר פרימיום עם 1.5 טורבו בנזין, 170 כ\"ס. במבחן דרך כ-13.5 ק\"מ לליטר. Euro NCAP 5 כוכבים (2024).",
    pros: ["5 כוכבים ב-Euro NCAP", "איכות פנים גבוהה", "מרווח יותר מהמיני הרגילה"],
    cons: ["מחיר גבוה", "ביטוח וטיפולים יקרים יחסית", "צריכה בפועל נמוכה מהמוצהר"],
    dataConfidence: 60,
    fuelMonthly: 657, insuranceMonthly: 662, maintenanceMonthly: 300, depreciationMonthly: 2275,
    insuranceMin: 546, insuranceMax: 788,
    priceSource: "carzone.co.il/MINI/Countryman (2026-10-20)",
  },
];

export {}; // makes this file a module so each batch has its own `newCars`
