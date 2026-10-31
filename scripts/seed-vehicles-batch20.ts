/**
 * CamaOla — Catalog Batch 20: 5 new models, 2026-10-31 (data-only; consumed by scripts/build-static-catalog.mjs)
 * Sales basis: cartube.co.il "מסירות רכב חדש בישראל ספטמבר 2026" (2026-10-02, top 20 Jan–Sep 2026) and
 *   auto.co.il/articles/car-news/local-news/car-sales-sep-2026/ (2026-10-04). Hyundai Kona is #2 YTD (10,282, all powertrains; the catalog only
 *   had Kona Hybrid). The other four models are not in the published top 20. They were picked from the brief's candidate list as
 *   current-volume launches in brands that rank in the top 7 (Skoda, BYD, Toyota) plus Peugeot. No model-level rank beyond #20 was available
 *   (bestsellingcarsblog full ranking is members-only).
 * All list prices, powertrain and claimed consumption verified 2026-10-31 from model/trim pages:
 *  - Hyundai Kona Electric: Pure 65.4 kWh ₪174,990 (auto.co.il/cars/hyundai/kona-ev/2026/pure/); line ₪174,990–184,990 (Ultimate)
 *                   (auto.co.il/cars/hyundai/kona-ev/2026). 214 hp, 149 Wh/km claimed, 506 km WLTP, 466 L, 5 seats (auto.co.il pure page +
 *                   cartube.co.il/מחירון-רכב-חדש/יונדאי/יונדאי-קונה/6860-יונדאי-קונה-ev-pure). Euro NCAP 4★ 2023, rating covers KONA Electric SR/LR
 *                   (news.euroncap.com "Hyundai KONA - Euro NCAP 2023 Results - 4 stars" + cdn.euroncap.com/media/79859/euroncap-2023-hyundai-kona-datasheet.pdf).
 *  - Skoda Elroq: 60 Advance ₪182,990 (auto.co.il/cars/skoda/elroq/2026/60-advance/ + cartube trim page 4360-60-advance-2026 + carzone.co.il/Skoda/Elroq/2026);
 *                   line ₪182,990–197,990 (60 Sportline; carzone + cartube.co.il/מחירון-רכב-חדש/סקודה/סקודה-אלרוק). 61 kWh, 190 hp, 156 Wh/km claimed,
 *                   442 km WLTP, 470 L, 5 seats (auto.co.il + cartube). Euro NCAP 5★ 2025 (news.euroncap.com "Škoda Elroq - Euro NCAP 2025 Results - 5 stars").
 *  - BYD Sealion 7: Boost 2x4 71.8 kWh ₪198,990 (auto.co.il/cars/byd/sealion-7/2026/579726/); line ₪198,990–237,990 (Design 2x4 91.3 kWh ₪219,990,
 *                   auto.co.il .../579728/; Excellence 4x4 ₪237,990, auto.co.il .../579729/ + cartube trim page 5637). 231 hp RWD, 191 Wh/km claimed,
 *                   440 km WLTP, 520 L (+58 L frunk per cartube), 5 seats. Euro NCAP 5★ 2025 (news.euroncap.com "BYD SEALION 7 - Euro NCAP 2025 Results - 5 stars").
 *  - Toyota C-HR+: Motion 2x4 57.7 kWh ₪179,990 (auto.co.il/cars/toyota/plusch-r/2026/motion-2x4/ + carzone.co.il/Toyota/C-HR-Plus/compare/);
 *                   line ₪179,990–229,990 (Vision 199,990; Exclusive 4x4 229,990; auto.co.il/cars/toyota/plusch-r/2026 + carzone compare).
 *                   167 hp FWD, 134 Wh/km claimed, 458 km WLTP, 416 L, 5 seats (auto.co.il). Euro NCAP: euroncap.com/assessments/toyota/c-hr/1206/ lists
 *                   the C-HR+ (2025, AO 88% / COP 85% / VRU 80% / SA 79%), but the star count could not be read there → stars NOT claimed.
 *  - Peugeot 3008 (gen 3): Allure 1.2T MHEV ₪186,990 (auto.co.il/cars/peugeot/3008/2026/580835/ + cartube trim page 6685-פיג-ו-3008-1-2-טורבו-allure
 *                   + carzone.co.il/Peugeot/3008/2026); line ₪186,990–206,990 (GT, auto.co.il .../580833/; carzone). Electric GT ₪258,990 (.../580834/)
 *                   is not included in the line range. 145 hp, 6-speed DCT; 18.2 km/L claimed (auto.co.il + cartube Allure; GT 17.8); 520 L; 5 seats.
 *                   Euro NCAP 4★ 2025, rating covers "Hybrid 145 e-DSC6" (euroncap.com/assessments/peugeot/3008/1141/).
 * Consumption field: petrol = claimed figure converted to L/100 km. EVs use null, as in batch16; the claimed kWh/100 km is in ownershipNotes.
 * Running costs are CamaOla ESTIMATES on the seed basis (petrol ₪7.10/L, electricity ₪0.55/kWh, rescaled at build time), 15,000 km/yr.
 * EV fuel = claimed kWh/100 km × 150 × 0.55 / 12 × 1.10 (charging loss). Insurance is scaled by (price/176,990)^0.6 from Hyundai Kona Hybrid
 * (543 / 441 / 634) and is never a quote. Depreciation: 11%/yr (C-HR+, 3008), 12%/yr (Kona Electric, Elroq), 14%/yr (Sealion 7).
 * Price updates 2026-10-31 (depreciation keeps the model's yearly rate; insurance ×(new/old)^0.6 — unchanged after rounding):
 *  - Toyota Corolla Hybrid LE: ₪159,900 → ₪159,990 (carzone.co.il/Toyota/Corolla model page + cartube Toyota list agree; ₪159,900 is now the
 *                   separate "Limited Edition" trim, so the line minimum stays as before). Depreciation 1,132 → 1,133/month.
 *  - Jaecoo J7: line max ₪202,990 → ₪189,990 (carzone.co.il/Omoda-Jaecoo + cartube.co.il/מחירון-רכב-חדש/25-ג-אקו agree: Elegance PHEV 179,990,
 *                   Premium PHEV 189,990). The petrol "Executive 1.6T" trim (₪169,900) is on neither list today — kept, flagged for owner review.
 */
const newCars = [
  {
    makeSlug: "hyundai", model: "Kona Electric", modelSlug: "kona-electric",
    bodyType: "suv", seats: 5, cargoLiters: 466, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 214, combinedConsumption: null, trimName: "Pure (65.4 kWh)",
    newPrice: 174990, priceMin: 174990, priceMedian: 174990, priceMax: 184990,
    reliabilityScore: 80, safetyScore: 72, economyScore: 92, comfortScore: 76, practicalityScore: 76,
    ownershipNotes: "קרוסאובר חשמלי קומפקטי: סוללה 65.4 קוט\"ש, ‏214 כ\"ס, צריכה מוצהרת 14.9 קוט\"ש ל-100 ק\"מ וטווח מוצהר 506 ק\"מ. Euro NCAP ‏(2023): 4 כוכבים.",
    pros: ["טווח מוצהר גבוה (506 ק\"מ)", "צריכת חשמל נמוכה", "שירות יונדאי נפוץ בכל הארץ"],
    cons: ["4 כוכבי Euro NCAP", "יקר מגרסת ההיברידית", "תא מטען בינוני (466 ליטר)"],
    dataConfidence: 58,
    fuelMonthly: 113, insuranceMonthly: 539, maintenanceMonthly: 150, depreciationMonthly: 1750,
    insuranceMin: 438, insuranceMax: 630,
    priceSource: "auto.co.il Kona EV 2026 Pure + cartube Kona EV Pure trim page (2026-10-31)",
  },
  {
    makeSlug: "skoda", model: "Elroq", modelSlug: "elroq",
    bodyType: "suv", seats: 5, cargoLiters: 470, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 190, combinedConsumption: null, trimName: "60 Advance (61 kWh)",
    newPrice: 182990, priceMin: 182990, priceMedian: 182990, priceMax: 197990,
    reliabilityScore: 76, safetyScore: 90, economyScore: 90, comfortScore: 80, practicalityScore: 84,
    ownershipNotes: "קרוסאובר חשמלי קומפקטי: סוללה 61 קוט\"ש, ‏190 כ\"ס, צריכה מוצהרת 15.6 קוט\"ש ל-100 ק\"מ וטווח מוצהר 442 ק\"מ. תא מטען 470 ליטר. Euro NCAP ‏(2025): 5 כוכבים.",
    pros: ["5 כוכבי Euro NCAP (2025)", "תא מטען ומרווח פנימי טובים לגודל", "מעשי לשימוש משפחתי"],
    cons: ["טווח מוצהר בינוני (442 ק\"מ)", "יקר מהמתחרות הסיניות", "רק שתי רמות גימור, שתיהן עם אותה סוללה"],
    dataConfidence: 58,
    fuelMonthly: 118, insuranceMonthly: 554, maintenanceMonthly: 150, depreciationMonthly: 1830,
    insuranceMin: 450, insuranceMax: 647,
    priceSource: "auto.co.il Elroq 2026 60 Advance + cartube trim page + carzone.co.il/Skoda/Elroq/2026 (2026-10-31)",
  },
  {
    makeSlug: "byd", model: "Sealion 7", modelSlug: "sealion-7",
    bodyType: "suv", seats: 5, cargoLiters: 520, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 231, combinedConsumption: null, trimName: "Boost 2x4 (71.8 kWh)",
    newPrice: 198990, priceMin: 198990, priceMedian: 198990, priceMax: 237990,
    reliabilityScore: 72, safetyScore: 90, economyScore: 84, comfortScore: 82, practicalityScore: 84,
    ownershipNotes: "קרוסאובר-קופה חשמלי משפחתי: בגרסת Boost סוללה 71.8 קוט\"ש, ‏231 כ\"ס והנעה אחורית; צריכה מוצהרת 19.1 קוט\"ש ל-100 ק\"מ וטווח מוצהר 440 ק\"מ. במחירון גם גרסאות 91.3 קוט\"ש (כולל 4X4). Euro NCAP ‏(2025): 5 כוכבים.",
    pros: ["5 כוכבי Euro NCAP (2025)", "תא מטען 520 ליטר ותא מטען קדמי", "ביצועים חזקים"],
    cons: ["צריכת חשמל גבוהה יחסית", "טווח מוצהר בינוני בגרסת הבסיס", "ירידת ערך צפויה גבוהה"],
    dataConfidence: 56,
    fuelMonthly: 144, insuranceMonthly: 583, maintenanceMonthly: 150, depreciationMonthly: 2322,
    insuranceMin: 473, insuranceMax: 680,
    priceSource: "auto.co.il Sealion 7 2026 Boost 2x4 (+ Design/Excellence pages) (2026-10-31)",
  },
  {
    makeSlug: "toyota", model: "C-HR+", modelSlug: "c-hr-plus",
    bodyType: "suv", seats: 5, cargoLiters: 416, fuelType: "electric", yearFrom: 2026, yearTo: 2026,
    powerHp: 167, combinedConsumption: null, trimName: "Motion 2x4 (57.7 kWh)",
    newPrice: 179990, priceMin: 179990, priceMedian: 179990, priceMax: 229990,
    reliabilityScore: 82, safetyScore: 65, economyScore: 94, comfortScore: 78, practicalityScore: 72,
    ownershipNotes: "קרוסאובר חשמלי של טויוטה: בגרסת Motion סוללה 57.7 קוט\"ש, ‏167 כ\"ס והנעה קדמית; צריכה מוצהרת 13.4 קוט\"ש ל-100 ק\"מ וטווח מוצהר 458 ק\"מ. במחירון גם גרסאות 77 קוט\"ש (כולל 4X4 ‏343 כ\"ס).",
    pros: ["צריכת חשמל מוצהרת נמוכה מאוד", "טווח טוב ביחס לגודל הסוללה", "רשת שירות טויוטה"],
    cons: ["תא מטען קטן יחסית (416 ליטר)", "גרסת הבסיס בהספק צנוע", "דירוג Euro NCAP לא אומת"],
    dataConfidence: 56,
    fuelMonthly: 101, insuranceMonthly: 549, maintenanceMonthly: 150, depreciationMonthly: 1650,
    insuranceMin: 445, insuranceMax: 640,
    priceSource: "auto.co.il C-HR+ 2026 Motion 2x4 + carzone.co.il/Toyota/C-HR-Plus/compare (2026-10-31)",
  },
  {
    makeSlug: "peugeot", model: "3008", modelSlug: "3008",
    bodyType: "suv", seats: 5, cargoLiters: 520, fuelType: "petrol", yearFrom: 2026, yearTo: 2026,
    powerHp: 145, combinedConsumption: 5.5, trimName: "Allure 1.2T MHEV",
    newPrice: 186990, priceMin: 186990, priceMedian: 186990, priceMax: 206990,
    reliabilityScore: 70, safetyScore: 74, economyScore: 78, comfortScore: 80, practicalityScore: 80,
    ownershipNotes: "SUV משפחתי בדור חדש: 1.2 טורבו בנזין עם מערכת מיילד-היברידית, ‏145 כ\"ס ותיבה כפולת מצמד 6; צריכה מוצהרת 18.2 ק\"מ לליטר (במבחן auto.co.il ‏14.4 בגרסת GT). תא מטען 520 ליטר. Euro NCAP ‏(2025): 4 כוכבים.",
    pros: ["עיצוב ותא נוסעים מרשימים", "תא מטען 520 ליטר", "חסכוני יחסית לגודלו"],
    cons: ["4 כוכבי Euro NCAP", "צריכה בפועל גבוהה מהמוצהר", "יקר יחסית למנוע 1.2"],
    dataConfidence: 58,
    fuelMonthly: 488, insuranceMonthly: 561, maintenanceMonthly: 220, depreciationMonthly: 1714,
    insuranceMin: 456, insuranceMax: 655,
    priceSource: "auto.co.il 3008 2026 MHEV Allure + cartube 3008 Allure trim page + carzone.co.il/Peugeot/3008/2026 (2026-10-31)",
  },
  {
    makeSlug: "toyota", model: "Corolla Hybrid", newPrice: 159990, priceMedian: 159990,
    tco7k: { fuelMonthly: 224, insuranceMonthly: 544, maintenanceMonthly: 189, depreciationMonthly: 1133, totalMonthly: 0 },
    tco15k: { fuelMonthly: 479, insuranceMonthly: 544, maintenanceMonthly: 215, depreciationMonthly: 1133, totalMonthly: 0 },
    tco25k: { fuelMonthly: 798, insuranceMonthly: 544, maintenanceMonthly: 241, depreciationMonthly: 1133, totalMonthly: 0 },
    priceSource: "carzone.co.il/Toyota/Corolla + cartube Toyota price list (2026-10-31)",
  },
  { makeSlug: "jaecoo", model: "J7", priceMax: 189990, priceSource: "carzone.co.il/Omoda-Jaecoo + cartube Jaecoo price list (2026-10-31)" },
];

export {};