/**
 * CamaOla — Catalog Batch 22: 2 new models, 2026-11-07 (data-only; consumed by scripts/build-static-catalog.mjs)
 * Sales basis: cartube.co.il October 2026 delivery report (Jan–Oct model ranking gives only the top 5: Omoda 5 Hybrid, Kona Hybrid,
 *   Jaecoo 7 PHEV, Corolla Cross Hybrid, Jaecoo 8 PHEV) and auto.co.il car-sales-october-2026 (brands only). Neither model below is in
 *   the published ranking; they were picked as mainstream models of top-10 brands (Toyota #2, MG #8 Jan–Oct) still missing from the catalog.
 * All list prices, powertrain and claimed consumption verified 2026-11-07 from model/trim pages:
 *  - Toyota Aygo X Hybrid: Pure 1.5 HEV ₪123,990 (auto.co.il/cars/toyota/aygo-x/2026/hybrid-pure/); hybrid line ₪123,990–129,990
 *                   (Pulse 124,990, Peak 129,990: auto.co.il .../hybrid-pulse/, .../hybrid-peak/; carzone.co.il/Toyota brand page 123,990–129,990).
 *                   116 hp, e-CVT; claimed 27 km/L combined (auto.co.il; carzone 27.3); 231 L; 4 seats (auto.co.il). Euro NCAP: the 2022 4★
 *                   result covers the 1.0 petrol only (euroncap.com/assessments/toyota/aygo-x/0941/) → not claimed for the hybrid.
 *  - MG HS Hybrid (HS gen 2): Luxury 1.5T HEV ₪158,888 (auto.co.il/cars/mg/hs/2026/579634/ + carzone.co.il/MG/HS/2026). 224 hp, 2-speed
 *                   dedicated hybrid transmission; claimed 18.2 km/L (auto.co.il, manufacturer data); 441 L; 5 seats. Line set to the hybrid
 *                   trim only (carzone brand page HS 154,888–158,888 includes the non-hybrid 1.5T at 154,888; carzone's model page also shows
 *                   a 175,888 trim that the brand page lists as the separate EHS PHEV). Euro NCAP: the 2024 5★ result lists the 1.5T petrol and
 *                   the PHEV only (euroncap.com/assessments/mg/hs/1061/) → not claimed for the hybrid.
 * Consumption field: claimed figure converted to L/100 km. Running costs are CamaOla ESTIMATES on the seed basis (petrol ₪7.10/L, rescaled
 * at build time), 15,000 km/yr: fuel = L/100 km × 150 × 7.10 / 12. Insurance is scaled by (price/176,990)^0.6 from Hyundai Kona Hybrid
 * (543 / 441 / 634) and is never a quote. Depreciation: 10%/yr (Aygo X, as Yaris Hybrid), 13%/yr (HS, as MG ZS Hybrid+).
 */
const newCars = [
  {
    makeSlug: "toyota", model: "Aygo X Hybrid", modelSlug: "aygo-x-hybrid",
    bodyType: "hatchback", seats: 4, cargoLiters: 231, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 116, combinedConsumption: 3.7, trimName: "Pure 1.5 HEV",
    newPrice: 123990, priceMin: 123990, priceMedian: 123990, priceMax: 129990,
    reliabilityScore: 88, safetyScore: 66, economyScore: 94, comfortScore: 62, practicalityScore: 52,
    ownershipNotes: "קרוסאובר עירוני קטן בהנעה היברידית מלאה: 1.5 בנזין ומנוע חשמלי, 116 כ\"ס ותיבה רציפה; צריכה מוצהרת 27 ק\"מ לליטר (במבחן auto.co.il כ-23). תא מטען 231 ליטר, רשום ל-4 מקומות ישיבה. דירוג Euro NCAP של 2022 חל רק על גרסת הבנזין 1.0.",
    pros: ["חסכוני מאוד בדלק", "היברידי מלא בלי צורך בטעינה", "קל לחניה ולתמרון בעיר"],
    cons: ["4 מקומות ישיבה בלבד", "תא מטען קטן (231 ליטר)", "דירוג Euro NCAP לגרסה ההיברידית לא אומת"],
    dataConfidence: 58,
    fuelMonthly: 328, insuranceMonthly: 439, maintenanceMonthly: 160, depreciationMonthly: 1033,
    insuranceMin: 356, insuranceMax: 512,
    priceSource: "auto.co.il Aygo X 2026 Hybrid Pure/Pulse/Peak + carzone.co.il/Toyota (2026-11-07)",
  },
  {
    makeSlug: "mg", model: "HS Hybrid", modelSlug: "hs-hybrid",
    bodyType: "suv", seats: 5, cargoLiters: 441, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 224, combinedConsumption: 5.5, trimName: "Luxury 1.5T HEV",
    newPrice: 158888, priceMin: 158888, priceMedian: 158888, priceMax: 158888,
    reliabilityScore: 70, safetyScore: 66, economyScore: 84, comfortScore: 76, practicalityScore: 80,
    ownershipNotes: "רכב פנאי משפחתי בהנעה היברידית מלאה: 1.5 טורבו ומנוע חשמלי, 224 כ\"ס משולב ותיבה ייעודית 2 הילוכים; צריכה מוצהרת 18.2 ק\"מ לליטר. תא מטען 441 ליטר. גרסת הפלאג-אין (EHS) נמכרת כדגם נפרד. דירוג Euro NCAP של 2024 חל על גרסאות הבנזין והפלאג-אין בלבד.",
    pros: ["הספק משולב גבוה", "מרווח ותא מטען משפחתיים", "מחיר נמוך יחסית לרכב פנאי היברידי בגודל הזה"],
    cons: ["דירוג Euro NCAP לגרסה ההיברידית לא אומת", "ירידת ערך צפויה גבוהה", "רמת גימור היברידית אחת"],
    dataConfidence: 56,
    fuelMonthly: 487, insuranceMonthly: 509, maintenanceMonthly: 190, depreciationMonthly: 1721,
    insuranceMin: 413, insuranceMax: 594,
    priceSource: "auto.co.il MG HS 2026 HEV Luxury + carzone.co.il/MG/HS/2026 (2026-11-07)",
  },
];
export {};
