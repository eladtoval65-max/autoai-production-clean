/**
 * CamaOla — Catalog Batch 12: catalog expansion 2026-10-20 (data-only; consumed by scripts/build-static-catalog.mjs)
 * Six models from makes newly added to generations.ts. List price, powertrain and consumption read on the model pages today:
 *  - Nissan Juke: cartube.co.il model page (consumption = WLTP claim 16.4 km/L; real-world assumed ~20% worse → 7.6 L/100 km)
 *  - Ford Focus wagon: cartube.co.il + carzone.co.il model pages (carzone road test ~12.5 km/L → 8.0 L/100 km)
 *  - Honda HR-V: carzone.co.il model page (claim 18.5 km/L, matched in carzone road test → 5.4 L/100 km; 131 hp system output per Wikipedia, page lists 107)
 *  - Citroën C3: carzone.co.il model page (road test ~15 km/L → 6.7 L/100 km)
 *  - Lexus NX 350h: carzone.co.il model page (road test ~15.5 km/L → 6.5 L/100 km)
 *  - Subaru Forester: carzone.co.il model page (running-cost figure 11.9 km/L, not labelled claimed/tested → 8.4 L/100 km)
 * Running costs are CamaOla ESTIMATES (petrol ₪7.10/L, 15,000 km/yr; insurance scaled from Hyundai i20 by price^0.6, never a quote;
 * depreciation 10% of list price per year; licensing added by the builder). Scores are editorial estimates. dataConfidence ≤ 62.
 */
const newCars = [
  {
    makeSlug: "nissan", model: "Juke", modelSlug: "juke",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 114, combinedConsumption: 7.6, trimName: "Acenta-Tech 1.0T",
    newPrice: 146990, priceMin: 138000, priceMedian: 146990, priceMax: 165990,
    reliabilityScore: 78, safetyScore: 86, economyScore: 74, comfortScore: 72, practicalityScore: 70,
    ownershipNotes: "קרוסאובר קטן עם מנוע 1.0 טורבו (114 כ\"ס), וגם גרסה היברידית (143 כ\"ס) במחירון. 5 כוכבי Euro NCAP (2019). הצריכה המוצהרת 16.4 ק\"מ לליטר; בפועל צפוי פחות.",
    pros: ["5 כוכבי Euro NCAP (2019)", "יש גם גרסה היברידית", "מחיר נמוך יחסית בקטגוריה"],
    cons: ["צריכה בפועל צפויה נמוכה מהמוצהר", "מושב אחורי ותא מטען קטנים", "תיבה כפולת מצמד בגרסת הטורבו"],
    dataConfidence: 60,
    fuelMonthly: 674, insuranceMonthly: 457, maintenanceMonthly: 210, depreciationMonthly: 1225,
    insuranceMin: 377, insuranceMax: 544,
    priceSource: "cartube.co.il מחירון ניסאן, דף ג'וק (2026-10-20)",
  },
  {
    makeSlug: "ford", model: "Focus Wagon", modelSlug: "focus-wagon",
    bodyType: "wagon", seats: 5, cargoLiters: null, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 155, combinedConsumption: 8.0, trimName: "Titanium 1.0T",
    newPrice: 165900, priceMin: 156000, priceMedian: 165900, priceMax: 165900,
    reliabilityScore: 74, safetyScore: 88, economyScore: 70, comfortScore: 78, practicalityScore: 84,
    ownershipNotes: "סטיישן משפחתי עם מנוע 1.0 טורבו 155 כ\"ס, 5 כוכבי Euro NCAP (2019). ייצור הפוקוס הופסק בנובמבר 2025, ומבחן דרך מדד כ-12.5 ק\"מ לליטר בלבד.",
    pros: ["סטיישן מרווח", "5 כוכבי Euro NCAP (2019)", "התנהגות כביש טובה"],
    cons: ["צריכה בפועל כ-12.5 ק\"מ לליטר", "הייצור הופסק ב-2025: ערך יד שנייה לא ודאי", "רצועת תזמון טבולה בשמן במנוע 1.0 EcoBoost"],
    dataConfidence: 60,
    fuelMonthly: 710, insuranceMonthly: 491, maintenanceMonthly: 230, depreciationMonthly: 1382,
    insuranceMin: 405, insuranceMax: 584,
    priceSource: "cartube.co.il דף פוקוס סטיישן + carzone.co.il/Ford/Focus/Tourer-Estate (2026-10-20)",
  },
  {
    makeSlug: "honda", model: "HR-V", modelSlug: "hr-v",
    bodyType: "suv", seats: 5, cargoLiters: 335, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 131, combinedConsumption: 5.4, trimName: "Elegance 1.5 e:HEV",
    newPrice: 184900, priceMin: 174000, priceMedian: 184900, priceMax: 224900,
    reliabilityScore: 88, safetyScore: 80, economyScore: 88, comfortScore: 76, practicalityScore: 74,
    ownershipNotes: "קרוסאובר היברידי (1.5 e:HEV). במבחן הדרך של carzone הצריכה תאמה את המוצהר, כ-18.5 ק\"מ לליטר. 4 כוכבי Euro NCAP (2022).",
    pros: ["חסכוני מאוד גם בפועל", "היברידי מלא בלי טעינה", "מוניטין אמינות של הונדה"],
    cons: ["תא מטען 335 ליטר בלבד", "4 כוכבי Euro NCAP", "ביצועים צנועים"],
    dataConfidence: 62,
    fuelMonthly: 479, insuranceMonthly: 524, maintenanceMonthly: 220, depreciationMonthly: 1541,
    insuranceMin: 432, insuranceMax: 624,
    priceSource: "carzone.co.il/Honda/HR-V + cartube.co.il מחירון הונדה (2026-10-20)",
  },
  {
    makeSlug: "citroen", model: "C3", modelSlug: "c3",
    bodyType: "hatch", seats: 5, cargoLiters: null, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 101, combinedConsumption: 6.7, trimName: "Plus 1.2T ידני",
    newPrice: 99990, priceMin: 94000, priceMedian: 99990, priceMax: 114990,
    reliabilityScore: 70, safetyScore: 70, economyScore: 78, comfortScore: 74, practicalityScore: 72,
    ownershipNotes: "מהמכוניות החדשות הזולות בישראל. דור 4 עם מנוע 1.2 טורבו 101 כ\"ס ותיבה ידנית בגרסת הבסיס. מבחן דרך מדד כ-15 ק\"מ לליטר. הדור הזה עוד לא קיבל דירוג Euro NCAP מאומת.",
    pros: ["מחיר כניסה נמוך מאוד", "נסיעה נוחה", "יש גם גרסת מיילד-היברידית"],
    cons: ["גרסת הבסיס ידנית", "אין דירוג Euro NCAP מאומת", "ירידת ערך גבוהה אופיינית לסיטרואן"],
    dataConfidence: 58,
    fuelMonthly: 595, insuranceMonthly: 362, maintenanceMonthly: 200, depreciationMonthly: 833,
    insuranceMin: 299, insuranceMax: 431,
    priceSource: "carzone.co.il/Citroen/C3/Crossover (2026-10-20)",
  },
  {
    makeSlug: "lexus", model: "NX", modelSlug: "nx",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 244, combinedConsumption: 6.5, trimName: "NX350h Kyushu",
    newPrice: 334990, priceMin: 315000, priceMedian: 334990, priceMax: 445990,
    reliabilityScore: 92, safetyScore: 92, economyScore: 80, comfortScore: 88, practicalityScore: 78,
    ownershipNotes: "SUV יוקרה היברידי (2.5, 244 כ\"ס) על בסיס טכנולוגיית טויוטה. 5 כוכבי Euro NCAP (2022). מבחן דרך מדד כ-15.5 ק\"מ לליטר בגרסת 4X4.",
    pros: ["אמינות היברידית של טויוטה", "5 כוכבי Euro NCAP (2022)", "שקט ונוח"],
    cons: ["מחיר גבוה", "ביטוח ופחת גבוהים בסכומים", "יש גם גרסת פלאג-אין יקרה יותר"],
    dataConfidence: 60,
    fuelMonthly: 577, insuranceMonthly: 749, maintenanceMonthly: 300, depreciationMonthly: 2792,
    insuranceMin: 618, insuranceMax: 891,
    priceSource: "carzone.co.il/Lexus/NX (2026-10-20)",
  },
  {
    makeSlug: "subaru", model: "Forester", modelSlug: "forester",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 180, combinedConsumption: 8.4, trimName: "Premium 2.5 4X4",
    newPrice: 212900, priceMin: 200000, priceMedian: 212900, priceMax: 279900,
    reliabilityScore: 84, safetyScore: 92, economyScore: 64, comfortScore: 76, practicalityScore: 84,
    ownershipNotes: "SUV עם הנעה כפולה קבועה ומנוע 2.5 בוקסר אטמוספרי (180 כ\"ס). 5 כוכבי Euro NCAP (2024). צריכת הדלק גבוהה יחסית; יש גם גרסה היברידית יקרה יותר.",
    pros: ["הנעה כפולה קבועה", "5 כוכבי Euro NCAP (2024)", "מרווח ופרקטי"],
    cons: ["צריכת דלק גבוהה", "מנוע ותיקה", "נוחות נסיעה בינונית"],
    dataConfidence: 58,
    fuelMonthly: 746, insuranceMonthly: 570, maintenanceMonthly: 260, depreciationMonthly: 1774,
    insuranceMin: 470, insuranceMax: 678,
    priceSource: "carzone.co.il/Subaru/Forester + cartube.co.il מחירון סובארו (2026-10-20)",
  },
];

export {}; // makes this file a module so each batch has its own `newCars`
