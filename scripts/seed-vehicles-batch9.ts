/**
 * CamaOla — Catalog Batch 9: second price refresh (data-only; consumed by scripts/build-static-catalog.mjs)
 * Older batches mixed used-market medians with new list prices. This batch sets every listed model to its
 * current Israeli LIST price (retrieved 2026-10-19; source per entry in priceSource) so comparisons are fair.
 * Running-cost rules when the price changes (estimates, not official):
 *  - depreciation keeps each model's previous yearly rate, applied to the new price;
 *  - insurance scales with price^0.6 (premiums rise slower than price);
 *  - fuel recomputed only where a newer consumption figure was found (₪7.10/L); maintenance unchanged.
 * Batch 6/7 prices that had moved by October 2026 (brand price pages).
 * 
 */
const newCars = [
  {
    "makeSlug": "hyundai",
    "model": "Kona Hybrid",
    "newPrice": 176990,
    "priceMin": 166400,
    "priceMedian": 176990,
    "priceMax": 207990,
    "sampleSize": null,
    "insuranceMin": 441,
    "insuranceMax": 634,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 181,
      "insuranceMonthly": 543,
      "maintenanceMonthly": 195,
      "depreciationMonthly": 1475,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 388,
      "insuranceMonthly": 543,
      "maintenanceMonthly": 220,
      "depreciationMonthly": 1475,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 647,
      "insuranceMonthly": 543,
      "maintenanceMonthly": 248,
      "depreciationMonthly": 1475,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/Hyundai (brand page, 2026-10-19)"
  },
  {
    "makeSlug": "toyota",
    "model": "Corolla Cross Hybrid",
    "newPrice": 179990,
    "priceMin": 169200,
    "priceMedian": 179990,
    "priceMax": 192990,
    "sampleSize": null,
    "insuranceMin": 462,
    "insuranceMax": 672,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 204,
      "insuranceMonthly": 595,
      "maintenanceMonthly": 200,
      "depreciationMonthly": 1501,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 437,
      "insuranceMonthly": 595,
      "maintenanceMonthly": 225,
      "depreciationMonthly": 1501,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 729,
      "insuranceMonthly": 595,
      "maintenanceMonthly": 255,
      "depreciationMonthly": 1501,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/Toyota (brand page, 2026-10-19)"
  },
  {
    "makeSlug": "jaecoo",
    "model": "J7",
    "fuelType": "petrol",
    "trimName": "1.6T",
    "powerHp": 186,
    "combinedConsumption": 8,
    "ownershipNotes": "מהנמכרים בישראל. SUV קומפקטי מקבוצת Chery עם מנוע 1.6 טורבו בנזין (גם בגרסת פלאג-אין), 5 כוכבי Euro NCAP וציוד עשיר. צריכת דלק גבוהה יחסית ואמינות לטווח ארוך עוד לא מוכחת.",
    "pros": [
      "5 כוכבי Euro NCAP",
      "ציוד עשיר",
      "עיצוב מודרני"
    ],
    "cons": [
      "צריכת דלק גבוהה יחסית (כ-8 ליטר ל-100 ק\"מ)",
      "אמינות לטווח ארוך לא מוכחת",
      "ערך יד שנייה לא ידוע"
    ],
    "newPrice": 179990,
    "priceMin": 169200,
    "priceMedian": 179990,
    "priceMax": 202990,
    "sampleSize": null,
    "insuranceMin": 542,
    "insuranceMax": 758,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 331,
      "insuranceMonthly": 650,
      "maintenanceMonthly": 210,
      "depreciationMonthly": 1500,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 710,
      "insuranceMonthly": 650,
      "maintenanceMonthly": 240,
      "depreciationMonthly": 1500,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 1183,
      "insuranceMonthly": 650,
      "maintenanceMonthly": 270,
      "depreciationMonthly": 1500,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/Omoda-Jaecoo (2026-10-19)"
  },
  {
    "makeSlug": "kia",
    "model": "Picanto",
    "newPrice": 99900,
    "priceMin": 93900,
    "priceMedian": 99900,
    "priceMax": 99990,
    "sampleSize": null,
    "insuranceMin": 216,
    "insuranceMax": 316,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 232,
      "insuranceMonthly": 260,
      "maintenanceMonthly": 140,
      "depreciationMonthly": 832,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 498,
      "insuranceMonthly": 260,
      "maintenanceMonthly": 160,
      "depreciationMonthly": 832,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 830,
      "insuranceMonthly": 260,
      "maintenanceMonthly": 185,
      "depreciationMonthly": 832,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/Kia (brand page, 2026-10-19)"
  },
  {
    "makeSlug": "mg",
    "model": "MG4 Electric",
    "newPrice": 119888,
    "priceMin": 112700,
    "priceMedian": 119888,
    "priceMax": 148888,
    "sampleSize": null,
    "insuranceMin": 433,
    "insuranceMax": 617,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 50,
      "insuranceMonthly": 525,
      "maintenanceMonthly": 85,
      "depreciationMonthly": 1190,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 107,
      "insuranceMonthly": 525,
      "maintenanceMonthly": 95,
      "depreciationMonthly": 1190,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 179,
      "insuranceMonthly": 525,
      "maintenanceMonthly": 110,
      "depreciationMonthly": 1190,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/MG (brand page, 2026-10-19)"
  },
  {
    "makeSlug": "chery",
    "model": "Tiggo 8 Pro",
    "newPrice": 179990,
    "priceMin": 169200,
    "priceMedian": 179990,
    "priceMax": 204990,
    "sampleSize": null,
    "insuranceMin": 474,
    "insuranceMax": 700,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 309,
      "insuranceMonthly": 587,
      "maintenanceMonthly": 230,
      "depreciationMonthly": 1500,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 664,
      "insuranceMonthly": 587,
      "maintenanceMonthly": 260,
      "depreciationMonthly": 1500,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 1106,
      "insuranceMonthly": 587,
      "maintenanceMonthly": 295,
      "depreciationMonthly": 1500,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/chery (brand page, 2026-10-19)"
  },
  {
    "makeSlug": "hyundai",
    "model": "Tucson",
    "newPrice": 189990,
    "priceMin": 178600,
    "priceMedian": 189990,
    "priceMax": 229990,
    "sampleSize": null,
    "insuranceMin": null,
    "insuranceMax": null,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 294,
      "insuranceMonthly": 657,
      "maintenanceMonthly": 246,
      "depreciationMonthly": 1376,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 630,
      "insuranceMonthly": 657,
      "maintenanceMonthly": 280,
      "depreciationMonthly": 1376,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 1050,
      "insuranceMonthly": 657,
      "maintenanceMonthly": 314,
      "depreciationMonthly": 1376,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/Hyundai (brand page, 2026-10-19)"
  },
  {
    "makeSlug": "byd",
    "model": "Seal U DM-i",
    "dataConfidence": 62,
    "newPrice": 199990,
    "priceMin": 188000,
    "priceMedian": 199990,
    "priceMax": 214990,
    "sampleSize": null,
    "insuranceMin": 641,
    "insuranceMax": 913,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 150,
      "insuranceMonthly": 775,
      "maintenanceMonthly": 176,
      "depreciationMonthly": 2000,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 322,
      "insuranceMonthly": 775,
      "maintenanceMonthly": 200,
      "depreciationMonthly": 2000,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 537,
      "insuranceMonthly": 775,
      "maintenanceMonthly": 224,
      "depreciationMonthly": 2000,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/BYDAuto (2026-10-19)"
  },
  {
    "makeSlug": "toyota",
    "model": "Corolla Hybrid",
    "newPrice": 159900,
    "priceMin": 150300,
    "priceMedian": 159900,
    "priceMax": 174990,
    "sampleSize": null,
    "insuranceMin": 450,
    "insuranceMax": 640,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 224,
      "insuranceMonthly": 544,
      "maintenanceMonthly": 189,
      "depreciationMonthly": 1132,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 479,
      "insuranceMonthly": 544,
      "maintenanceMonthly": 215,
      "depreciationMonthly": 1132,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 798,
      "insuranceMonthly": 544,
      "maintenanceMonthly": 241,
      "depreciationMonthly": 1132,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/Toyota (brand page, 2026-10-19)"
  }
];
