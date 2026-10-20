/**
 * CamaOla — Catalog Batch 8: price refresh (data-only; consumed by scripts/build-static-catalog.mjs)
 * Older batches mixed used-market medians with new list prices. This batch sets every listed model to its
 * current Israeli LIST price (retrieved 2026-10-19; source per entry in priceSource) so comparisons are fair.
 * Running-cost rules when the price changes (estimates, not official):
 *  - depreciation keeps each model's previous yearly rate, applied to the new price;
 *  - insurance scales with price^0.6 (premiums rise slower than price);
 *  - fuel recomputed only where a newer consumption figure was found (₪7.10/L); maintenance unchanged.
 * Ford Puma and Peugeot 308 are no longer marketed in Israel and are removed.
 * Not refreshed (already current list prices from batch 6, Oct 2026): Picanto, Kona, Tiggo 8 Pro, Corolla Cross, J7.
 */
const newCars = [
  {
    "makeSlug": "hyundai",
    "model": "Tucson",
    "trimName": "Premium 1.6T",
    "newPrice": 188990,
    "priceMin": 177700,
    "priceMedian": 188990,
    "priceMax": 196990,
    "sampleSize": null,
    "insuranceMin": null,
    "insuranceMax": null,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 294,
      "insuranceMonthly": 655,
      "maintenanceMonthly": 246,
      "depreciationMonthly": 1369,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 630,
      "insuranceMonthly": 655,
      "maintenanceMonthly": 280,
      "depreciationMonthly": 1369,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 1050,
      "insuranceMonthly": 655,
      "maintenanceMonthly": 314,
      "depreciationMonthly": 1369,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/Hyundai/Tucson/2026"
  },
  {
    "makeSlug": "skoda",
    "model": "Octavia",
    "trimName": "Selection 1.5 TSI 115hp",
    "newPrice": 159990,
    "priceMin": 150400,
    "priceMedian": 159990,
    "priceMax": 177990,
    "sampleSize": null,
    "insuranceMin": 424,
    "insuranceMax": 615,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 268,
      "insuranceMonthly": 520,
      "maintenanceMonthly": 215,
      "depreciationMonthly": 1334,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 576,
      "insuranceMonthly": 520,
      "maintenanceMonthly": 240,
      "depreciationMonthly": 1334,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 960,
      "insuranceMonthly": 520,
      "maintenanceMonthly": 265,
      "depreciationMonthly": 1334,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/Skoda/Octavia/2026"
  },
  {
    "makeSlug": "mazda",
    "model": "Mazda3",
    "trimName": "Spirit 2.5",
    "powerHp": 191,
    "combinedConsumption": 7.5,
    "newPrice": 184900,
    "priceMin": 173800,
    "priceMedian": 184900,
    "priceMax": 214900,
    "sampleSize": null,
    "insuranceMin": null,
    "insuranceMax": null,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 311,
      "insuranceMonthly": 587,
      "maintenanceMonthly": 211,
      "depreciationMonthly": 1327,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 666,
      "insuranceMonthly": 587,
      "maintenanceMonthly": 240,
      "depreciationMonthly": 1327,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 1109,
      "insuranceMonthly": 587,
      "maintenanceMonthly": 269,
      "depreciationMonthly": 1327,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/Mazda/3/Hatchback/2026"
  },
  {
    "makeSlug": "toyota",
    "model": "Yaris Cross Hybrid",
    "trimName": "Urban HEV",
    "powerHp": 116,
    "combinedConsumption": 5.3,
    "newPrice": 160990,
    "priceMin": 151300,
    "priceMedian": 160990,
    "priceMax": 160990,
    "sampleSize": null,
    "insuranceMin": 421,
    "insuranceMax": 605,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 220,
      "insuranceMonthly": 513,
      "maintenanceMonthly": 180,
      "depreciationMonthly": 1342,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 470,
      "insuranceMonthly": 513,
      "maintenanceMonthly": 205,
      "depreciationMonthly": 1342,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 784,
      "insuranceMonthly": 513,
      "maintenanceMonthly": 230,
      "depreciationMonthly": 1342,
      "totalMonthly": 0
    },
    "priceSource": "auto.co.il Yaris Cross Hybrid Urban FL 2026"
  },
  {
    "makeSlug": "mg",
    "model": "MG4 Electric",
    "trimName": "Luxury 64 kWh",
    "powerHp": 190,
    "newPrice": 142888,
    "priceMin": 134300,
    "priceMedian": 142888,
    "priceMax": 148888,
    "sampleSize": null,
    "insuranceMin": 481,
    "insuranceMax": 686,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 50,
      "insuranceMonthly": 583,
      "maintenanceMonthly": 85,
      "depreciationMonthly": 1418,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 107,
      "insuranceMonthly": 583,
      "maintenanceMonthly": 95,
      "depreciationMonthly": 1418,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 179,
      "insuranceMonthly": 583,
      "maintenanceMonthly": 110,
      "depreciationMonthly": 1418,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il news 2026-02-10"
  },
  {
    "makeSlug": "volkswagen",
    "model": "Golf",
    "trimName": "Life 1.5",
    "combinedConsumption": 6.2,
    "newPrice": 169900,
    "priceMin": 159700,
    "priceMedian": 169900,
    "priceMax": 196900,
    "sampleSize": null,
    "insuranceMin": 466,
    "insuranceMax": 669,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 257,
      "insuranceMonthly": 564,
      "maintenanceMonthly": 210,
      "depreciationMonthly": 1416,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 550,
      "insuranceMonthly": 564,
      "maintenanceMonthly": 235,
      "depreciationMonthly": 1416,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 917,
      "insuranceMonthly": 564,
      "maintenanceMonthly": 265,
      "depreciationMonthly": 1416,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/Volkswagen/Golf/2026"
  },
  {
    "makeSlug": "nissan",
    "model": "Qashqai",
    "trimName": "e-Power Acenta Tech",
    "fuelType": "hybrid",
    "powerHp": 205,
    "combinedConsumption": 5.3,
    "newPrice": 194990,
    "priceMin": 183300,
    "priceMedian": 194990,
    "priceMax": 194990,
    "sampleSize": null,
    "insuranceMin": 516,
    "insuranceMax": 739,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 220,
      "insuranceMonthly": 628,
      "maintenanceMonthly": 200,
      "depreciationMonthly": 1624,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 470,
      "insuranceMonthly": 628,
      "maintenanceMonthly": 225,
      "depreciationMonthly": 1624,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 784,
      "insuranceMonthly": 628,
      "maintenanceMonthly": 250,
      "depreciationMonthly": 1624,
      "totalMonthly": 0
    },
    "priceSource": "auto.co.il Qashqai e-Power Acenta Tech 2026"
  },
  {
    "makeSlug": "byd",
    "model": "Atto 3",
    "trimName": "EVO Design 313hp",
    "powerHp": 313,
    "newPrice": 154990,
    "priceMin": 145700,
    "priceMedian": 154990,
    "priceMax": 167000,
    "sampleSize": null,
    "insuranceMin": 505,
    "insuranceMax": 707,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 52,
      "insuranceMonthly": 606,
      "maintenanceMonthly": 95,
      "depreciationMonthly": 1550,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 113,
      "insuranceMonthly": 606,
      "maintenanceMonthly": 110,
      "depreciationMonthly": 1550,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 188,
      "insuranceMonthly": 606,
      "maintenanceMonthly": 130,
      "depreciationMonthly": 1550,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il/BYDAuto/Atto-3/2026"
  },
  {
    "makeSlug": "kia",
    "model": "Sportage Hybrid",
    "trimName": "EX HEV",
    "powerHp": 235,
    "combinedConsumption": 5.7,
    "newPrice": 195900,
    "priceMin": 184100,
    "priceMedian": 195900,
    "priceMax": 206900,
    "sampleSize": null,
    "insuranceMin": 550,
    "insuranceMax": 780,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 236,
      "insuranceMonthly": 665,
      "maintenanceMonthly": 190,
      "depreciationMonthly": 1632,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 506,
      "insuranceMonthly": 665,
      "maintenanceMonthly": 210,
      "depreciationMonthly": 1632,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 843,
      "insuranceMonthly": 665,
      "maintenanceMonthly": 230,
      "depreciationMonthly": 1632,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il news 2026-01-14"
  },
  {
    "makeSlug": "hyundai",
    "model": "Ioniq 6",
    "trimName": "Ultra 84 kWh",
    "powerHp": 228,
    "newPrice": 224990,
    "priceMin": 211500,
    "priceMedian": 224990,
    "priceMax": 247990,
    "sampleSize": null,
    "insuranceMin": 620,
    "insuranceMax": 848,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 52,
      "insuranceMonthly": 734,
      "maintenanceMonthly": 90,
      "depreciationMonthly": 2109,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 113,
      "insuranceMonthly": 734,
      "maintenanceMonthly": 100,
      "depreciationMonthly": 2109,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 188,
      "insuranceMonthly": 734,
      "maintenanceMonthly": 115,
      "depreciationMonthly": 2109,
      "totalMonthly": 0
    },
    "priceSource": "carzone.co.il news 2026-02-24"
  },
  {
    "makeSlug": "toyota",
    "model": "RAV4 Hybrid",
    "trimName": "דור 6 HEV",
    "newPrice": 219990,
    "priceMin": 206800,
    "priceMedian": 219990,
    "priceMax": 219990,
    "sampleSize": null,
    "insuranceMin": 610,
    "insuranceMax": 843,
    "yearFrom": 2026,
    "yearTo": 2026,
    "tco7k": {
      "fuelMonthly": 222,
      "insuranceMonthly": 721,
      "maintenanceMonthly": 210,
      "depreciationMonthly": 1834,
      "totalMonthly": 0
    },
    "tco15k": {
      "fuelMonthly": 478,
      "insuranceMonthly": 721,
      "maintenanceMonthly": 235,
      "depreciationMonthly": 1834,
      "totalMonthly": 0
    },
    "tco25k": {
      "fuelMonthly": 797,
      "insuranceMonthly": 721,
      "maintenanceMonthly": 260,
      "depreciationMonthly": 1834,
      "totalMonthly": 0
    },
    "priceSource": "queenoftheroad.co.il 2026-05-13 (gen 6, from ₪219,990)"
  },
  {
    "makeSlug": "ford",
    "model": "Puma Hybrid",
    "discontinued": true,
    "priceSource": "cartube.co.il: לא משווק יותר"
  },
  {
    "makeSlug": "peugeot",
    "model": "308",
    "discontinued": true,
    "priceSource": "not in carzone.co.il Peugeot 2026 lineup"
  }
];

export {}; // makes this file a module so each batch has its own `newCars`
