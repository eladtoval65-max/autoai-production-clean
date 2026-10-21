/**
 * CamaOla — Catalog Batch 15: daily market update 2026-10-21 (data-only; consumed by scripts/build-static-catalog.mjs)
 * New models: the four best sellers of Jan–Sep 2026 that were missing from the catalog
 * (ranking: https://www.cartube.co.il/חדשות-רכב/מסירות-רכב-חדש-בישראל-ספטמבר-2026).
 * Sources (retrieved 2026-10-21):
 *  - MG S9:              carzone.co.il/MG/S9/  ₪189,888–198,888, PHEV 1.5T 143 hp + 231 hp electric motor (no combined figure published,
 *                        per icar.co.il), 24.7 kWh, 7 seats, 332 L; carzone road test ~13.1 km/L with the battery empty.
 *  - BYD Sealion 05 DM-i: carzone.co.il/BYDAuto/Sea-Lion-05/DMi/ ₪166,990–171,990; auto.co.il/cars/byd/sealion-5/ 213 hp combined,
 *                        12.9/18.3 kWh, 463 L; carzone review ~24 km/L starting with a full battery. Not tested by Euro NCAP.
 *  - XPENG G6:           carzone.co.il/XPENG brand page ₪204,990–247,990 (same on cartube 2026 facelift article); RWD 296 hp, 80.2 kWh;
 *                        auto.co.il road test (pre-facelift) 5.2–5.4 km/kWh ≈ 18.9 kWh/100 km.
 *  - Geely Starray EM-i: carzone.co.il/Geely/Starray/ ₪169,990–181,990; 214 hp combined (cartube trim page + auto.co.il road test),
 *                        18.4 kWh, 83 km claimed electric range; road test 12–16 km/L with the battery empty. Euro NCAP 5★ (2025).
 * Hyundai i20: no longer on the carzone Hyundai brand page and marked "לא משווק יותר" on the cartube Hyundai price list → discontinued.
 * Running costs are CamaOla ESTIMATES (petrol ₪7.10/L, home charging ₪0.64/kWh, 15,000 km/yr; PHEVs assume 50% of km on
 * electricity (Sealion 05: road-test figure from a full battery plus home charging); insurance scaled from Hyundai i20 by
 * price^0.6, never a quote; depreciation 10% of list price per year; licensing added by the builder).
 */
const newCars = [
  {
    makeSlug: "mg", model: "S9", modelSlug: "s9",
    bodyType: "suv", seats: 7, cargoLiters: 332, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: null, combinedConsumption: 3.8, trimName: "Comfort PHEV",
    newPrice: 189888, priceMin: 189888, priceMedian: 189888, priceMax: 198888,
    reliabilityScore: 68, safetyScore: 75, economyScore: 82, comfortScore: 84, practicalityScore: 90,
    ownershipNotes: "SUV גדול של 7 מקומות בהנעת פלאג-אין: 1.5 טורבו (143 כ\"ס) ומנוע חשמלי של 231 כ\"ס, סוללה 24.7 קוט\"ש. במבחן דרך 92 ק\"מ על חשמל וכ-13.1 ק\"מ לליטר כשהסוללה ריקה. החישוב מניח 50% מהנסיעה על חשמל, כלומר טעינה קבועה בבית.",
    pros: ["7 מקומות במחיר נמוך לקטגוריה", "טווח חשמלי ארוך (כ-90 ק\"מ)", "מהנמכרים בישראל ב-2026"],
    cons: ["בלי טעינה בבית הצריכה כ-13 ק\"מ לליטר", "תא מטען קטן (332 ליטר) עם כל המושבים", "דירוג Euro NCAP לא אומת"],
    dataConfidence: 58,
    fuelMonthly: 427, insuranceMonthly: 533, maintenanceMonthly: 260, depreciationMonthly: 1582,
    insuranceMin: 438, insuranceMax: 633,
    priceSource: "carzone.co.il/MG/S9/ (2026-10-21)",
  },
  {
    makeSlug: "byd", model: "Sealion 05 DM-i", modelSlug: "sealion-05-dmi",
    bodyType: "suv", seats: 5, cargoLiters: 463, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 213, combinedConsumption: 4.2, trimName: "Comfort PHEV",
    newPrice: 166990, priceMin: 166990, priceMedian: 166990, priceMax: 171990,
    reliabilityScore: 72, safetyScore: 70, economyScore: 86, comfortScore: 78, practicalityScore: 80,
    ownershipNotes: "קרוסאובר משפחתי פלאג-אין (1.5 בנזין + חשמלי, 213 כ\"ס משולב), סוללה 12.9 קוט\"ש וטווח חשמלי מוצהר של 62 ק\"מ (בגרסת Design סוללה 18.3 קוט\"ש). בסקירת carzone כ-24 ק\"מ לליטר כשמתחילים עם סוללה מלאה.",
    pros: ["מחיר נמוך לפלאג-אין משפחתי", "חסכוני מאוד עם טעינה בבית", "תא מטען 463 ליטר"],
    cons: ["לא נבחן ב-Euro NCAP", "טווח חשמלי קצר בגרסת הבסיס", "בלי טעינה בבית החיסכון קטן"],
    dataConfidence: 56,
    fuelMonthly: 428, insuranceMonthly: 493, maintenanceMonthly: 200, depreciationMonthly: 1392,
    insuranceMin: 406, insuranceMax: 586,
    priceSource: "carzone.co.il/BYDAuto/Sea-Lion-05/DMi/ (2026-10-21)",
  },
  {
    makeSlug: "xpeng", model: "G6", modelSlug: "g6",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 296, combinedConsumption: 0, trimName: "RWD 80.2 kWh",
    newPrice: 204990, priceMin: 204990, priceMedian: 204990, priceMax: 247990,
    reliabilityScore: 70, safetyScore: 72, economyScore: 88, comfortScore: 82, practicalityScore: 82,
    ownershipNotes: "קרוסאובר חשמלי בגודל משפחתי, הנעה אחורית, 296 כ\"ס וסוללה 80.2 קוט\"ש (דגם 2026 המחודש). במבחן הדרך של הדגם הקודם כ-19 קוט\"ש ל-100 ק\"מ וטווח אמיתי של 445–475 ק\"מ.",
    pros: ["טווח ארוך", "מרווח ונוח", "מהנמכרים בישראל ב-2026"],
    cons: ["מותג חדש: לבדוק שירות וחלפים באזורך", "דירוג Euro NCAP לא אומת", "ערך שמירה עדיין לא ידוע"],
    dataConfidence: 57,
    fuelMonthly: 151, insuranceMonthly: 558, maintenanceMonthly: 120, depreciationMonthly: 1708,
    insuranceMin: 459, insuranceMax: 663,
    priceSource: "carzone.co.il/XPENG (brand page, 2026-10-21)",
  },
  {
    makeSlug: "geely", model: "Starray EM-i", modelSlug: "starray-em-i",
    bodyType: "suv", seats: 5, cargoLiters: null, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 214, combinedConsumption: 3.6, trimName: "Pro PHEV",
    newPrice: 169990, priceMin: 169990, priceMedian: 169990, priceMax: 181990,
    reliabilityScore: 70, safetyScore: 92, economyScore: 88, comfortScore: 80, practicalityScore: 80,
    ownershipNotes: "קרוסאובר משפחתי פלאג-אין (1.5 בנזין + חשמלי, 214 כ\"ס משולב), סוללה 18.4 קוט\"ש וטווח חשמלי מוצהר של 83 ק\"מ. במבחן דרך 12–16 ק\"מ לליטר כשהסוללה ריקה. Euro NCAP 5 כוכבים (2025). החישוב מניח 50% מהנסיעה על חשמל.",
    pros: ["5 כוכבים ב-Euro NCAP", "טווח חשמלי ארוך יחסית", "מחיר תחרותי לפלאג-אין"],
    cons: ["בלי טעינה בבית הצריכה 12–16 ק\"מ לליטר", "מותג חדש יחסית בישראל", "ערך שמירה עדיין לא ידוע"],
    dataConfidence: 58,
    fuelMonthly: 389, insuranceMonthly: 499, maintenanceMonthly: 200, depreciationMonthly: 1417,
    insuranceMin: 410, insuranceMax: 592,
    priceSource: "carzone.co.il/Geely/Starray/ (2026-10-21)",
  },
  { makeSlug: "hyundai", model: "i20", discontinued: true, priceSource: "carzone.co.il/Hyundai brand page (not listed) + cartube.co.il מחירון יונדאי: לא משווק יותר (2026-10-21)" },
];

export {}; // makes this file a module so each batch has its own `newCars`
