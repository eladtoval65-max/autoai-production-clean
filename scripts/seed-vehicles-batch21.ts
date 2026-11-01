/**
 * CamaOla — Catalog Batch 21: 5 new models, 2026-11-01 (data-only; consumed by scripts/build-static-catalog.mjs)
 * Sales basis: cartube.co.il "מסירות רכב חדש בישראל - ספטמבר 2026" (latest monthly report on 2026-11-01; no October report published yet;
 *   top 20 Jan–Sep 2026). None of the five models is in the published top 20. They were picked from the brief's candidate list in brands
 *   that rank in the top 10 YTD (Hyundai #4, BYD #6, Skoda #7, MG #8) plus Suzuki, to fill the cheap end (Dolphin Surf, Swift, ZS) and
 *   the large-family end (Superb, Ioniq 5). No model-level rank beyond #20 was available.
 * All list prices, powertrain and claimed consumption verified 2026-11-01 from model/trim pages:
 *  - MG ZS Hybrid+: Luxury 1.5 HEV ₪137,888, the only trim, cut from ₪155,888 in 08/2026 (auto.co.il/cars/mg/zs/2026 + cartube trim page
 *                   7024-mg-zs-הייבריד-luxury). 1.5 petrol + electric motor, 194 hp combined, 3-speed automatic; 19.6 km/L claimed combined
 *                   (auto.co.il + cartube agree); 443 L; 5 seats. Euro NCAP: auto.co.il says not tested → not claimed.
 *  - Suzuki Swift (gen 5): GLX 1.2 mild-hybrid CVT ₪129,990 (auto.co.il/cars/suzuki/swift/2026/580944/ + cartube trim page
 *                   6546-סוזוקי-סוויפט-1-2-ליטר-glx-אוטו + carzone.co.il/Suzuki/Swift/2026); line ₪119,990 (GLX manual, auto.co.il .../580945/)
 *                   –129,990. 82 hp, 265 L, 5 seats. Claimed consumption differs by source: auto.co.il CVT trim 20.8 km/L (used), cartube 21.2,
 *                   carzone 23.2 (trim not stated), auto.co.il manual 22.2. Euro NCAP: a 2024 3★ result is widely reported (and on carzone),
 *                   but it was not confirmed on euroncap.com and auto.co.il lists "not tested" → not claimed.
 *  - BYD Dolphin Surf: Boost 43.2 kWh ₪114,990 (auto.co.il/cars/byd/dolphin-surf/2026/579649/ + cartube trim page 5640-byd-דולפין-סרף-boost
 *                   + carzone.co.il/BYDAuto/Dolphin-Surf/2026/compare); line ₪114,990–123,990 (Comfort 156 hp, 160 Wh/km, 310 km;
 *                   auto.co.il .../579650/ + carzone). Boost: 88 hp, 156 Wh/km claimed, 322 km WLTP (auto.co.il), 308 L. All three
 *                   sources list 4 seats for the Israeli spec. Euro NCAP: cdn.euroncap.com 2025 datasheet (AO 82% / COP 86% / VRU 76% /
 *                   SA 77%, applies to all Dolphin Surfs) does not show the star count in readable form → stars NOT claimed.
 *  - Skoda Superb (gen 4): Selection 1.5 TSI mHEV ₪203,490 (auto.co.il/cars/skoda/superb/2026/581007/ + cartube trim page
 *                   6381-סקודה-סופרב-1-5-טורבו-selection + carzone.co.il/Skoda/Superb); line ₪203,490–293,490 (Sportline 4X4 2.0, importer
 *                   site cmotors.co.il/cars/skoda/superb/). 150 hp, 7DSG; claimed 18.8 km/L (auto.co.il; cartube 18.9, cmotors 18.2); 595 L;
 *                   5 seats; listed as sedan (liftback). Euro NCAP 5★ 2024 (news.euroncap.com "Škoda Superb - Euro NCAP 2024 Results - 5 stars").
 *  - Hyundai Ioniq 5 (2026 update): Pure 2x4 84 kWh ₪214,990 (auto.co.il/cars/hyundai/ionic-5/2026 + cartube trim page 6835-יונדאי-איוניק-5-pure);
 *                   line ₪214,990–247,990 (Ultra 229,990; Excellence 247,990; auto.co.il model page). Ioniq 5 N (₪414,900) is not included in
 *                   the line range. 229 hp RWD, 160.4 Wh/km claimed (cartube 160), 570 km (auto.co.il), 520 L + 57 L frunk, 5 seats.
 *                   Euro NCAP 5★ 10/2021 (news.euroncap.com press release "Ford, Hyundai and Toyota lead the way..."); the 2021 datasheet
 *                   (cdn.euroncap.com/media/83514) says the rating applies to all IONIQ 5s incl. after the 06/2024 facelift review.
 * Consumption field: petrol/hybrid = claimed figure converted to L/100 km. EVs use null, as in batch20; the claimed kWh/100 km is in ownershipNotes.
 * Running costs are CamaOla ESTIMATES on the seed basis (petrol ₪7.10/L, electricity ₪0.55/kWh, rescaled at build time), 15,000 km/yr.
 * Petrol fuel = L/100 km × 150 × 7.10 / 12. EV fuel = claimed kWh/100 km × 150 × 0.55 / 12 × 1.10 (charging loss). Insurance is scaled by
 * (price/176,990)^0.6 from Hyundai Kona Hybrid (543 / 441 / 634) and is never a quote. Depreciation: 11%/yr (Swift), 12%/yr (Superb),
 * 13%/yr (ZS Hybrid+, Ioniq 5), 14%/yr (Dolphin Surf).
 */
const newCars = [
  {
    makeSlug: "mg", model: "ZS Hybrid+", modelSlug: "zs-hybrid",
    bodyType: "suv", seats: 5, cargoLiters: 443, fuelType: "hybrid", yearFrom: 2026, yearTo: 2026,
    powerHp: 194, combinedConsumption: 5.1, trimName: "Luxury 1.5 HEV",
    newPrice: 137888, priceMin: 137888, priceMedian: 137888, priceMax: 137888,
    reliabilityScore: 70, safetyScore: 60, economyScore: 88, comfortScore: 72, practicalityScore: 76,
    ownershipNotes: "קרוסאובר היברידי מלא: 1.5 בנזין ומנוע חשמלי, ‏194 כ\"ס משולב ותיבה אוטומטית 3 הילוכים; צריכה מוצהרת 19.6 ק\"מ לליטר. תא מטען 443 ליטר. רמת גימור אחת. לפי auto.co.il לא נבחן ב-Euro NCAP.",
    pros: ["מחיר נמוך להיברידי מלא בגודל הזה", "הספק משולב גבוה", "תא מטען 443 ליטר"],
    cons: ["דירוג Euro NCAP לא אומת", "רמת גימור אחת בלבד", "ירידת ערך צפויה גבוהה"],
    dataConfidence: 56,
    fuelMonthly: 453, insuranceMonthly: 467, maintenanceMonthly: 180, depreciationMonthly: 1494,
    insuranceMin: 380, insuranceMax: 546,
    priceSource: "auto.co.il MG ZS 2026 + cartube MG ZS Hybrid Luxury trim page (2026-11-01)",
  },
  {
    makeSlug: "suzuki", model: "Swift", modelSlug: "swift",
    bodyType: "hatchback", seats: 5, cargoLiters: 265, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 82, combinedConsumption: 4.8, trimName: "GLX 1.2 MHEV CVT",
    newPrice: 129990, priceMin: 119990, priceMedian: 129990, priceMax: 129990,
    reliabilityScore: 82, safetyScore: 55, economyScore: 90, comfortScore: 64, practicalityScore: 58,
    ownershipNotes: "רכב עירוני קטן בדור חדש: 1.2 בנזין 3 צילינדרים עם מערכת מיילד-היברידית, ‏82 כ\"ס ותיבה רציפה; צריכה מוצהרת 20.8 ק\"מ לליטר (בגרסה הידנית 22.2). תא מטען 265 ליטר.",
    pros: ["חסכוני מאוד בדלק", "קל לתמרון ולחניה בעיר", "מחיר נמוך"],
    cons: ["מנוע חלש (82 כ\"ס)", "תא מטען קטן (265 ליטר)", "דירוג Euro NCAP לא אומת"],
    dataConfidence: 56,
    fuelMonthly: 426, insuranceMonthly: 451, maintenanceMonthly: 170, depreciationMonthly: 1192,
    insuranceMin: 366, insuranceMax: 527,
    priceSource: "auto.co.il Swift 2026 GLX auto + cartube Swift GLX auto trim page + carzone.co.il/Suzuki/Swift/2026 (2026-11-01)",
  },
  {
    makeSlug: "byd", model: "Dolphin Surf", modelSlug: "dolphin-surf",
    bodyType: "hatchback", seats: 4, cargoLiters: 308, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 88, combinedConsumption: null, trimName: "Boost (43.2 kWh)",
    newPrice: 114990, priceMin: 114990, priceMedian: 114990, priceMax: 123990,
    reliabilityScore: 70, safetyScore: 62, economyScore: 92, comfortScore: 64, practicalityScore: 56,
    ownershipNotes: "רכב עירוני חשמלי קטן: בגרסת Boost סוללה 43.2 קוט\"ש ו-88 כ\"ס; צריכה מוצהרת 15.6 קוט\"ש ל-100 ק\"מ וטווח מוצהר 322 ק\"מ. בגרסת Comfort ‏156 כ\"ס וטווח 310 ק\"מ. רשום ל-4 מקומות ישיבה.",
    pros: ["הרכב החשמלי הזול בקטלוג", "עלות אנרגיה נמוכה מאוד", "מתאים לנסיעות עירוניות"],
    cons: ["טווח מוצהר קצר (322 ק\"מ)", "4 מקומות ישיבה בלבד", "גרסת הבסיס חלשה (88 כ\"ס)"],
    dataConfidence: 56,
    fuelMonthly: 118, insuranceMonthly: 419, maintenanceMonthly: 130, depreciationMonthly: 1342,
    insuranceMin: 340, insuranceMax: 489,
    priceSource: "auto.co.il Dolphin Surf 2026 Boost + cartube Boost trim page + carzone.co.il/BYDAuto/Dolphin-Surf/2026/compare (2026-11-01)",
  },
  {
    makeSlug: "skoda", model: "Superb", modelSlug: "superb",
    bodyType: "sedan", seats: 5, cargoLiters: 595, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 150, combinedConsumption: 5.3, trimName: "Selection 1.5 TSI mHEV",
    newPrice: 203490, priceMin: 203490, priceMedian: 203490, priceMax: 293490,
    reliabilityScore: 78, safetyScore: 90, economyScore: 80, comfortScore: 86, practicalityScore: 90,
    ownershipNotes: "מכונית משפחתית גדולה בדור חדש: 1.5 טורבו בנזין עם מערכת מיילד-היברידית, ‏150 כ\"ס ותיבת DSG 7; צריכה מוצהרת 18.8 ק\"מ לליטר. תא מטען 595 ליטר. במחירון גם גרסאות 2.0 טורבו (כולל 4X4). Euro NCAP ‏(2024): 5 כוכבים.",
    pros: ["5 כוכבי Euro NCAP (2024)", "תא מטען 595 ליטר ומרחב אחורי גדול", "נוחות נסיעה למרחקים ארוכים"],
    cons: ["יקר יחסית", "מנוע 1.5 צנוע לגודל הרכב", "הגרסאות החזקות יקרות בהרבה"],
    dataConfidence: 58,
    fuelMonthly: 470, insuranceMonthly: 590, maintenanceMonthly: 230, depreciationMonthly: 2035,
    insuranceMin: 480, insuranceMax: 689,
    priceSource: "auto.co.il Superb 2026 Selection 1.5 + cartube Superb Selection trim page + cmotors.co.il Superb (2026-11-01)",
  },
  {
    makeSlug: "hyundai", model: "Ioniq 5", modelSlug: "ioniq5",
    bodyType: "suv", seats: 5, cargoLiters: 520, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 229, combinedConsumption: null, trimName: "Pure 2x4 (84 kWh)",
    newPrice: 214990, priceMin: 214990, priceMedian: 214990, priceMax: 247990,
    reliabilityScore: 78, safetyScore: 88, economyScore: 86, comfortScore: 84, practicalityScore: 84,
    ownershipNotes: "קרוסאובר חשמלי משפחתי: סוללה 84 קוט\"ש, ‏229 כ\"ס והנעה אחורית; צריכה מוצהרת 16 קוט\"ש ל-100 ק\"מ וטווח מוצהר 570 ק\"מ. תא מטען 520 ליטר ותא קדמי קטן. Euro NCAP ‏(2021): 5 כוכבים.",
    pros: ["טווח מוצהר ארוך (570 ק\"מ)", "תא נוסעים מרווח במיוחד", "5 כוכבי Euro NCAP"],
    cons: ["יקר מהמתחרות הסיניות", "דירוג Euro NCAP מ-2021", "ירידת ערך צפויה גבוהה"],
    dataConfidence: 58,
    fuelMonthly: 121, insuranceMonthly: 610, maintenanceMonthly: 150, depreciationMonthly: 2329,
    insuranceMin: 496, insuranceMax: 712,
    priceSource: "auto.co.il Ioniq 5 2026 + cartube Ioniq 5 Pure trim page (2026-11-01)",
  },
];

export {};
