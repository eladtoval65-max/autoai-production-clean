/**
 * CamaOla — Catalog Batch 11: daily market update 2026-10-20 (data-only; consumed by scripts/build-static-catalog.mjs)
 * Sources (retrieved 2026-10-20):
 *  - Price ranges: carzone.co.il brand pages (Toyota, MG, Suzuki, BYDAuto).
 *  - New models: carzone.co.il/Hyundai/Venue/ and carzone.co.il/Kia/Stonic/ (list price, engine, power);
 *    consumption = road-test figure quoted on those pages (Venue ~13 km/L, Stonic ~14 km/L), not the claimed figure.
 * Entry prices of existing models did not change today; only the top of the range moved, so running costs are unchanged.
 * Running costs of the new models are CamaOla ESTIMATES (petrol ₪7.10/L; insurance scaled from Hyundai i20 by price^0.6,
 * never a quote; depreciation 10% of list price per year; licensing added by the builder). Euro NCAP: none published for
 * the versions sold here per the carzone model pages.
 */
const newCars = [
  { makeSlug: "toyota", model: "Corolla Hybrid", priceMax: 159900, priceSource: "carzone.co.il/Toyota (brand page, 2026-10-20)" },
  { makeSlug: "mg", model: "MG4 Electric", priceMax: 119888, priceSource: "carzone.co.il/MG (brand page, 2026-10-20)" },
  { makeSlug: "suzuki", model: "e Vitara", priceMax: 179990, priceSource: "carzone.co.il/Suzuki (brand page, 2026-10-20)" },
  { makeSlug: "byd", model: "Atto 3", priceMax: 164990, priceSource: "carzone.co.il/BYDAuto (brand page, 2026-10-20)" },
  {
    makeSlug: "hyundai", model: "Venue", modelSlug: "venue",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 121, combinedConsumption: 7.7, trimName: "Prime 1.6",
    newPrice: 129900, priceMin: 122000, priceMedian: 129900, priceMax: 144990,
    reliabilityScore: 84, safetyScore: 74, economyScore: 74, comfortScore: 72, practicalityScore: 74,
    ownershipNotes: "קרוסאובר קטן עם מנוע 1.6 בנזין רגיל (בלי טורבו) ותיבה רציפה. מבחן דרך מדד כ-13 ק\"מ לליטר. שירות יונדאי נפוץ; לא נבחן ב-Euro NCAP.",
    pros: ["מנוע פשוט בלי טורבו", "שירות יונדאי נפוץ", "מהקרוסאוברים הזולים בשוק"],
    cons: ["צריכה בפועל כ-13 ק\"מ לליטר", "לא נבחן ב-Euro NCAP", "תא מטען קטן משל הקונה"],
    dataConfidence: 60,
    fuelMonthly: 683, insuranceMonthly: 424, maintenanceMonthly: 210, depreciationMonthly: 1083,
    insuranceMin: 350, insuranceMax: 505,
    priceSource: "carzone.co.il/Hyundai/Venue/ (2026-10-20)",
  },
  {
    makeSlug: "kia", model: "Stonic", modelSlug: "stonic",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 100, combinedConsumption: 7.1, trimName: "EX 1.0T",
    newPrice: 129900, priceMin: 122000, priceMedian: 129900, priceMax: 137900,
    reliabilityScore: 82, safetyScore: 74, economyScore: 77, comfortScore: 72, practicalityScore: 72,
    ownershipNotes: "קרוסאובר קטן עם מנוע 1.0 טורבו ותיבה רובוטית כפולת מצמד. מבחן דרך מדד כ-14 ק\"מ לליטר, כ-20% פחות מהמוצהר.",
    pros: ["מחיר נמוך לקרוסאובר", "חסכוני יחסית", "קל לחנייה בעיר"],
    cons: ["צריכה בפועל נמוכה מהמוצהר", "תיבה כפולת מצמד: לבדוק התנהגות בזחילה", "ביצועים חלשים בכביש מהיר"],
    dataConfidence: 60,
    fuelMonthly: 630, insuranceMonthly: 424, maintenanceMonthly: 210, depreciationMonthly: 1083,
    insuranceMin: 350, insuranceMax: 505,
    priceSource: "carzone.co.il/Kia/Stonic/ (2026-10-20)",
  },
];

export {}; // makes this file a module so each batch has its own `newCars`
