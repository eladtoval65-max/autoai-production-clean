/**
 * CamaOla — Catalog Batch 18: owner-review items resolved + 3 new models, 2026-10-24 (data-only; consumed by scripts/build-static-catalog.mjs)
 * Price/trim corrections (retrieved 2026-10-24; depreciation keeps each model's yearly rate, insurance scaled by (new/old)^0.6, fuel unchanged):
 *  - MG4 Electric "Luxury 64 kWh": ₪119,888 → ₪142,888 (+19%). carzone.co.il/MG/4/2026 (Urban 54 kWh 119,888 / Luxury 64 kWh 142,888 /
 *                   X Range 77 kWh 144,888) and cartube.co.il/מחירון-רכב-חדש/mg/mg-4/6825-mg4-luxury (142,888, 64 kWh, 190 hp) agree.
 *  - Nissan Qashqai: the "e-Power Acenta Tech ₪194,990" trim is on neither price list → e-Power Tekna ₪227,990 (+17%), 190 hp
 *                   (cartube.co.il/מחירון-רכב-חדש/ניסאן list + trim page 6460; carzone.co.il/Nissan brand-page top 227,990). Line 178,990–231,990.
 *  - Jaecoo J7 "1.6T": ₪179,990 is the Elegance PHEV price on both sites; the 1.6 turbo petrol (Executive) is ₪169,900
 *                   (carzone.co.il/Omoda-Jaecoo/Jaecoo-7; cartube petrol trim pages list 1.6T 147 hp, 7DCT without price). −5.6%.
 *  - Toyota Yaris Cross: line top after the 10/2026 facelift ₪163,990 (Urban TT; carzone review + cartube compare). Urban trim price
 *                   conflicts (carzone 160,990 / cartube 162,490) → kept.
 * New models (H1 2026 ranking: cartube.co.il/חדשות-רכב/זינוק-במסירות-רכב-חדש-מסירות-רכב-חדש-בישראל-יוני-2026 — Niro #18, Berlingo #27, Elantra #34):
 *  - Kia Niro Hybrid: EX ₪176,900 / Premium ₪179,900 (carzone facelift launch article; queenoftheroad.co.il launch 05.08.2026);
 *                   1.6 + electric 138 hp combined, 6DCT; 21.7 km/L (cartube trim page 7022); 404 L (auto.co.il).
 *                   Euro NCAP 2022: 4★ standard / 5★ with Safety Pack (euroncap.com/en/results/kia/niro/46606).
 *  - Hyundai Elantra (Israel: hybrid only): Prime ₪169,990 … Luxury ₪188,990 (auto.co.il/cars/hyundai/elantra-hybrid/2026;
 *                   carzone.co.il/Hyundai/Elantra/2026); 1.6 + electric 139 hp, 6DCT; claimed 22.7 km/L, auto.co.il measured 19.3 km/L (used); 474 L.
 *  - Citroën Berlingo (passenger): Combi Shine PK ₪176,990 / Long 7-seat ₪189,990 (auto.co.il/cars/citroen/berlingo/2026;
 *                   carzone.co.il/Citroen/Berlingo/2026); 1.5 diesel 130 hp, 8AT; 17.2 km/L claimed; 775 L. Euro NCAP rating expired → not claimed.
 * Running costs are CamaOla ESTIMATES on the seed basis (petrol ₪7.10/L, diesel ₪7.40/L, rescaled at build time), 15,000 km/yr.
 * Insurance scaled by price^0.6 from Hyundai Kona Hybrid — never a quote. Depreciation 10%/yr (Niro, Elantra), 11%/yr (Berlingo).
 */
const newCars = [
  {
    makeSlug: "mg", model: "MG4 Electric",
    newPrice: 142888, priceMin: 119888, priceMedian: 142888, priceMax: 144888, powerHp: 190,
    insuranceMin: 481, insuranceMax: 686,
    tco7k: { fuelMonthly: 50, insuranceMonthly: 583, maintenanceMonthly: 85, depreciationMonthly: 1418, totalMonthly: 0 },
    tco15k: { fuelMonthly: 107, insuranceMonthly: 583, maintenanceMonthly: 95, depreciationMonthly: 1418, totalMonthly: 0 },
    tco25k: { fuelMonthly: 179, insuranceMonthly: 583, maintenanceMonthly: 110, depreciationMonthly: 1418, totalMonthly: 0 },
    ownershipNotes: "האצ'בק חשמלי עם הנעה אחורית. בגרסת Luxury סוללה של 64 קוט\"ש ו-190 כ\"ס; במחירון גם Urban (54 קוט\"ש) ב-₪119,888 ו-X Range (77 קוט\"ש) ב-₪144,888.",
    pros: ["עלות נסיעה נמוכה מאוד", "5 כוכבי Euro NCAP (2022)", "אחריות ארוכה לסוללה", "גרסת Urban זולה במיוחד"],
    priceSource: "carzone.co.il/MG/4/2026 + cartube MG4 Luxury (2026-10-24)",
  },
  {
    makeSlug: "nissan", model: "Qashqai", trimName: "e-Power Tekna",
    newPrice: 227990, priceMin: 178990, priceMedian: 227990, priceMax: 231990, powerHp: 190,
    insuranceMin: 567, insuranceMax: 812,
    tco7k: { fuelMonthly: 220, insuranceMonthly: 690, maintenanceMonthly: 200, depreciationMonthly: 1899, totalMonthly: 0 },
    tco15k: { fuelMonthly: 470, insuranceMonthly: 690, maintenanceMonthly: 225, depreciationMonthly: 1899, totalMonthly: 0 },
    tco25k: { fuelMonthly: 784, insuranceMonthly: 690, maintenanceMonthly: 250, depreciationMonthly: 1899, totalMonthly: 0 },
    ownershipNotes: "SUV קומפקטי פופולרי בגרסת e-Power (190 כ\"ס): מנוע הבנזין רק טוען, והגלגלים מונעים בחשמל. גרסאות ה-e-Power במחירון: Tekna ‏₪227,990 ו-Tekna TT ‏₪231,990; גרסאות 1.3 טורבו מ-₪178,990.",
    priceSource: "cartube.co.il Nissan price list + carzone.co.il/Nissan (2026-10-24)",
  },
  {
    makeSlug: "jaecoo", model: "J7", trimName: "Executive 1.6T",
    newPrice: 169900, priceMin: 169900, priceMedian: 169900, priceMax: 202990, powerHp: 147,
    insuranceMin: 524, insuranceMax: 732,
    tco7k: { fuelMonthly: 331, insuranceMonthly: 628, maintenanceMonthly: 210, depreciationMonthly: 1416, totalMonthly: 0 },
    tco15k: { fuelMonthly: 710, insuranceMonthly: 628, maintenanceMonthly: 240, depreciationMonthly: 1416, totalMonthly: 0 },
    tco25k: { fuelMonthly: 1183, insuranceMonthly: 628, maintenanceMonthly: 270, depreciationMonthly: 1416, totalMonthly: 0 },
    ownershipNotes: "מהנמכרים בישראל. SUV קומפקטי מקבוצת Chery: בגרסת Executive מנוע 1.6 טורבו בנזין 147 כ\"ס; גרסאות הפלאג-אין (342 כ\"ס) מ-₪179,990. 5 כוכבי Euro NCAP וציוד עשיר; צריכת דלק גבוהה יחסית בגרסת הבנזין.",
    priceSource: "carzone.co.il/Omoda-Jaecoo/Jaecoo-7 (2026-10-24)",
  },
  { makeSlug: "toyota", model: "Yaris Cross Hybrid", priceMax: 163990 },
  {
    makeSlug: "kia", model: "Niro Hybrid", modelSlug: "niro-hybrid",
    bodyType: "suv", seats: 5, cargoLiters: 404, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 138, combinedConsumption: 4.6, trimName: "EX HEV 1.6",
    newPrice: 176900, priceMin: 176900, priceMedian: 176900, priceMax: 179900,
    reliabilityScore: 80, safetyScore: 80, economyScore: 88, comfortScore: 78, practicalityScore: 80,
    ownershipNotes: "קרוסאובר היברידי של קיה (מתיחת פנים 2026): 1.6 בנזין ומנוע חשמלי, 138 כ\"ס משולב, צריכה מוצהרת 21.7 ק\"מ לליטר. Euro NCAP ‏(2022): 4 כוכבים בתצורה בסיסית, 5 עם חבילת הבטיחות.",
    pros: ["חסכוני מאוד בדלק", "היברידי מלא בלי צורך בטעינה", "תא מטען 404 ליטר"],
    cons: ["4 כוכבי Euro NCAP בלי חבילת הבטיחות", "שתי רמות גימור בלבד", "הספק בינוני"],
    dataConfidence: 60,
    fuelMonthly: 409, insuranceMonthly: 543, maintenanceMonthly: 200, depreciationMonthly: 1474,
    insuranceMin: 441, insuranceMax: 634,
    priceSource: "carzone.co.il (Niro Hybrid 2026 launch article) + cartube trim page (2026-10-24)",
  },
  {
    makeSlug: "hyundai", model: "Elantra Hybrid", modelSlug: "elantra-hybrid",
    bodyType: "sedan", seats: 5, cargoLiters: 474, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 139, combinedConsumption: 5.2, trimName: "Prime 1.6 HEV",
    newPrice: 169990, priceMin: 169990, priceMedian: 169990, priceMax: 188990,
    reliabilityScore: 80, safetyScore: 70, economyScore: 86, comfortScore: 80, practicalityScore: 80,
    ownershipNotes: "סדאן משפחתי היברידי (בישראל רק היברידי): 1.6 בנזין ומנוע חשמלי, 139 כ\"ס, תיבת DCT 6. צריכה מוצהרת 22.7 ק\"מ לליטר; במבחן auto.co.il כ-19.3 ק\"מ לליטר (בו השתמשנו).",
    pros: ["חסכוני בדלק", "תא מטען 474 ליטר", "מרווח מאחור"],
    cons: ["אין דירוג Euro NCAP לדגם", "ביצועים בינוניים", "פחות פופולרי מ-SUV ביד שנייה"],
    dataConfidence: 58,
    fuelMonthly: 460, insuranceMonthly: 530, maintenanceMonthly: 210, depreciationMonthly: 1417,
    insuranceMin: 430, insuranceMax: 619,
    priceSource: "auto.co.il/cars/hyundai/elantra-hybrid/2026 + carzone.co.il/Hyundai/Elantra/2026 (2026-10-24)",
  },
  {
    makeSlug: "citroen", model: "Berlingo", modelSlug: "berlingo",
    bodyType: "minivan", seats: 5, cargoLiters: 775, fuelType: "diesel", yearFrom: 2026, yearTo: 2026,
    powerHp: 130, combinedConsumption: 5.8, trimName: "Combi Shine PK 1.5 BlueHDi",
    newPrice: 176990, priceMin: 176990, priceMedian: 176990, priceMax: 189990,
    reliabilityScore: 72, safetyScore: 70, economyScore: 78, comfortScore: 70, practicalityScore: 92,
    ownershipNotes: "רכב משפחתי מרווח במיוחד (פאן): דיזל 1.5 ‏130 כ\"ס ותיבה אוטומטית 8, צריכה מוצהרת 17.2 ק\"מ לליטר. דלתות הזזה ותא מטען של 775 ליטר; גרסה ארוכה עם 7 מקומות ב-₪189,990.",
    pros: ["תא מטען ענק (775 ליטר)", "דלתות הזזה", "גרסת 7 מקומות"],
    cons: ["נוחות ושקט פחותים מ-SUV", "דירוג Euro NCAP פג תוקף", "מנוע דיזל: מתאים יותר לנסיעות רבות"],
    dataConfidence: 56,
    fuelMonthly: 538, insuranceMonthly: 543, maintenanceMonthly: 260, depreciationMonthly: 1622,
    insuranceMin: 441, insuranceMax: 634,
    priceSource: "auto.co.il/cars/citroen/berlingo/2026 + carzone.co.il/Citroen/Berlingo/2026 (2026-10-24)",
  },
];

export {}; // makes this file a module so each batch has its own `newCars`
