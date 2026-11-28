/**
 * CamaOla — Catalog Batch 26: price refresh 2026-11-28 (data-only; consumed by scripts/build-static-catalog.mjs)
 * Skoda cut list prices on 15.11.2026 (auto.co.il/articles/car-news/local-news/skoda-price-cuts-israel/); both brand price
 * lists (carzone.co.il/Skoda, cartube.co.il/מחירון-רכב-חדש/57-סקודה) show the cut today. MINI Countryman base trim
 * now ₪269,000 on both sources (cartube.co.il/מחירון-רכב-חדש/מיני "1.5 Turbo Classic"; carzone.co.il/MINI petrol from ₪269,000).
 * Prices used (where the two sites differ by a few hundred shekels, the figure confirmed by a second source is used):
 *  - Octavia Selection 1.5 TSI 115hp ₪154,990 (cartube brand + trim page; carzone Octavia from ₪154,990; article ~₪155,000).
 *  - Karoq Selection ₪156,990 (cartube; article ~₪157,000; carzone ₪156,490). Model top ₪178,990 (carzone; article Sportline ~₪179,000).
 *  - Kodiaq Selection 7 seats ₪197,990 (cartube; article ~₪198,000; carzone model from ₪194,990). Model top ₪275,990 (both).
 *  - Superb Selection 1.5 TSI mHEV ₪197,990 (cartube; article ~₪198,000; carzone ₪197,490). Model top ₪275,990 (both).
 *  - MINI Countryman C Classic ₪269,000 (both).
 * Running-cost rules when the price changes (estimates, not official): depreciation keeps each model's yearly rate
 * (scaled by new/old price); insurance scales with (new/old)^0.6; fuel and maintenance unchanged.
 */
const newCars = [
  {
    makeSlug: "skoda", model: "Octavia",
    newPrice: 154990, priceMin: 154990, priceMedian: 154990,
    insuranceMin: 416, insuranceMonthly: 432, insuranceMax: 603, depreciationMonthly: 768,
    tco7k: { fuelMonthly: 268, insuranceMonthly: 510, maintenanceMonthly: 215, depreciationMonthly: 1292, totalMonthly: 0 },
    tco15k: { fuelMonthly: 576, insuranceMonthly: 510, maintenanceMonthly: 240, depreciationMonthly: 1292, totalMonthly: 0 },
    tco25k: { fuelMonthly: 960, insuranceMonthly: 510, maintenanceMonthly: 265, depreciationMonthly: 1292, totalMonthly: 0 },
    priceSource: "cartube.co.il/מחירון-רכב-חדש/57-סקודה + carzone.co.il/Skoda + auto.co.il Skoda price cut 15.11.2026 (2026-11-28)",
  },
  {
    makeSlug: "skoda", model: "Karoq",
    newPrice: 156990, priceMin: 156990, priceMedian: 156990, priceMax: 178990,
    insuranceMin: 411, insuranceMonthly: 505, insuranceMax: 590, depreciationMonthly: 1308,
    priceSource: "cartube.co.il/מחירון-רכב-חדש/57-סקודה + carzone.co.il/Skoda/Karoq + auto.co.il Skoda price cut 15.11.2026 (2026-11-28)",
  },
  {
    makeSlug: "skoda", model: "Kodiaq",
    newPrice: 197990, priceMin: 197990, priceMedian: 197990, priceMax: 275990,
    insuranceMin: 576, insuranceMonthly: 692, insuranceMax: 816, depreciationMonthly: 1650,
    priceSource: "cartube.co.il/מחירון-רכב-חדש/57-סקודה + carzone.co.il/Skoda + auto.co.il Skoda price cut 15.11.2026 (2026-11-28)",
  },
  {
    makeSlug: "skoda", model: "Superb",
    newPrice: 197990, priceMin: 197990, priceMedian: 197990, priceMax: 275990,
    insuranceMin: 472, insuranceMonthly: 580, insuranceMax: 678, depreciationMonthly: 1980,
    priceSource: "cartube.co.il/מחירון-רכב-חדש/57-סקודה + carzone.co.il/Skoda + auto.co.il Skoda price cut 15.11.2026 (2026-11-28)",
  },
  {
    makeSlug: "mini", model: "Countryman",
    newPrice: 269000, priceMin: 269000, priceMedian: 269000,
    insuranceMin: 541, insuranceMonthly: 656, insuranceMax: 781, depreciationMonthly: 2242,
    priceSource: "cartube.co.il/מחירון-רכב-חדש/מיני + carzone.co.il/MINI (2026-11-28)",
  },
];
export {};
