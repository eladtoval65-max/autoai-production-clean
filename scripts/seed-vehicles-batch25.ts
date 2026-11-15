/**
 * CamaOla — Catalog Batch 25: 2 new models, 2026-11-15 (data-only; consumed by scripts/build-static-catalog.mjs)
 * Picked from high-volume models still missing from the catalog (Octavia, Kona Hybrid and Tucson already have rows;
 * a "Tucson Hybrid" row would merge into the existing Tucson key, so it is left out).
 * All list prices, powertrain and claimed consumption verified 2026-11-15 from model/trim pages:
 *  - VW Tiguan: Style 1.5 eTSI mHEV 2x4 ₪209,900 (auto.co.il/cars/volkswagen/tiguan/2026/15-style/; auto.co.il news
 *             "פולקסווגן: טיגואן וטיירון בגרסאות מוזלות בישראל" 03.11.2026 same price). Line on auto.co.il/cars/volkswagen/tiguan/2026:
 *             Style ₪209,900, Elegance 1.5 ₪229,900, Elegance 2.0 4x4 (204 hp) ₪249,900. carzone.co.il/Volkswagen/Tiguan/2026 shows
 *             Elegance ₪229,900 / 4X4 ₪249,900 and Style as ₪209,000 (taken as a typo vs. auto.co.il's ₪209,900); R-Line trims unpriced.
 *             150 hp, 7-speed DSG, FWD; claimed 14.9 km/L (6.7 L/100 km); 652 L; 5 seats.
 *             Euro NCAP 5★ 2024 (news.euroncap.com "VW Tiguan - Euro NCAP 2024 Results - 5 stars").
 *  - BYD Seal: Design 2x4 (facelift) ₪198,990, Excellence 4x4 ₪219,990 (auto.co.il/cars/byd/seal/2026/design-2x4-fl/ and
 *             .../excellence-4x4-fl/; carzone.co.il/BYDAuto/Seal/2026 same trims and prices). Design: 313 hp, RWD, 82.5 kWh;
 *             claimed 16.6 kWh/100 km, WLTP 570 km; 485 L per auto.co.il facelift page (carzone still lists 402 L) + front trunk; 5 seats.
 *             Euro NCAP 5★ 2023 (news.euroncap.com "Chinese Manufacturers Create Waves in the European Market", 25 Oct 2023).
 * Running costs are CamaOla ESTIMATES on the seed basis (petrol ₪7.10/L, ₪0.55/kWh, rescaled at build time), 15,000 km/yr:
 *  - Tiguan fuel = 8.0 L/100 km real-world (carzone test average 12.5 km/L, not the claimed 14.9) × 150 × 7.10 / 12.
 *  - Seal energy = claimed 16.6 kWh/100 km × 1.10 charging loss (as batch 20) × 150 × 0.55 / 12.
 * Insurance is never a quote: Tiguan scaled by (price/211,990)^0.6 from Skoda Kodiaq (721 / 600 / 850); Seal taken from
 * BYD Sealion 7 (583 / 473 / 680) at the same ₪198,990 price. Depreciation: 10%/yr (as Skoda Kodiaq, 1,767/mo on ₪211,990)
 * for the Tiguan, 14%/yr (as BYD Sealion 7) for the Seal. Maintenance as Kodiaq (280) and Sealion 7 (150).
 */
const newCars = [
  {
    makeSlug: "volkswagen", model: "Tiguan", modelSlug: "tiguan",
    bodyType: "suv", seats: 5, cargoLiters: 652, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 150, combinedConsumption: 6.7, trimName: "Style 1.5 eTSI",
    newPrice: 209900, priceMin: 209900, priceMedian: 209900, priceMax: 249900,
    reliabilityScore: 78, safetyScore: 92, economyScore: 72, comfortScore: 88, practicalityScore: 90,
    ownershipNotes: "רכב פנאי משפחתי בדור שלישי: מנוע 1.5 טורבו עם מערכת היברידית מתונה, 150 כ\"ס, תיבה רובוטית 7 הילוכים והנעה קדמית. צריכה מוצהרת 14.9 ק\"מ לליטר (במבחן דרך כ-12.5). תא מטען 652 ליטר. 5 כוכבי Euro NCAP (2024).",
    pros: ["5 כוכבי Euro NCAP", "תא מטען גדול מאוד (652 ליטר)", "מרווח ונוח למשפחה"],
    cons: ["מחיר גבוה לגרסת הבסיס", "בנזין עם היברידיות מתונה בלבד", "צריכה בפועל גבוהה מהמוצהר"],
    dataConfidence: 64,
    fuelMonthly: 710, insuranceMonthly: 717, maintenanceMonthly: 280, depreciationMonthly: 1749,
    insuranceMin: 596, insuranceMax: 845,
    priceSource: "auto.co.il VW Tiguan 2026 Style (+ model page and 03.11.2026 news) + carzone.co.il/Volkswagen/Tiguan/2026 (2026-11-15)",
  },
  {
    makeSlug: "byd", model: "Seal", modelSlug: "seal",
    bodyType: "sedan", seats: 5, cargoLiters: 485, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 313, combinedConsumption: null, trimName: "Design 2x4 (82.5 kWh)",
    newPrice: 198990, priceMin: 198990, priceMedian: 198990, priceMax: 219990,
    reliabilityScore: 72, safetyScore: 92, economyScore: 90, comfortScore: 84, practicalityScore: 74,
    ownershipNotes: "סדאן חשמלי בהנעה אחורית (גרסה מחודשת): סוללה 82.5 קוט\"ש ו-313 כ\"ס; טווח WLTP מוצהר 570 ק\"מ וצריכה מוצהרת 16.6 קוט\"ש ל-100 ק\"מ. במחירון גם גרסת 4X4 של 530 כ\"ס. 5 כוכבי Euro NCAP (2023).",
    pros: ["5 כוכבי Euro NCAP", "טווח מוצהר ארוך", "ביצועים חזקים"],
    cons: ["סדאן — פחות מרווח מרכב פנאי", "ירידת ערך צפויה גבוהה", "יקר מהמתחרים החשמליים הקטנים"],
    dataConfidence: 60,
    fuelMonthly: 126, insuranceMonthly: 583, maintenanceMonthly: 150, depreciationMonthly: 2322,
    insuranceMin: 473, insuranceMax: 680,
    priceSource: "auto.co.il BYD Seal 2026 Design 2x4 / Excellence 4x4 (facelift) + carzone.co.il/BYDAuto/Seal/2026 (2026-11-15)",
  },
];
export {};
