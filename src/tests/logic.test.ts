/**
 * Unit tests for the pure business logic (no React, no network, no database).
 * Run: npm test
 */
import { describe, expect, it } from "vitest";
import { MAKES } from "../data/generations";
import { estimateUsedCost, yearsOf } from "../features/browse/model/usedCost";
import { monthlyGap, winnerIndex, winsPerCar } from "../features/home/model/compare";
import { bandAt, REGISTRATION } from "../features/home/model/cost";
import { staticCars } from "../features/home/model/catalog";
import { loanPayment, totalInterest } from "../features/home/model/finance";
import { isFleetOwnership, normalizePlate } from "../features/home/model/plate";
import { EMPTY_ANSWERS } from "../features/home/model/questions";
import { computeScore } from "../features/home/model/scoring";

describe("comparison winners", () => {
  it("picks the lowest value when lower is better", () => expect(winnerIndex([3000, 2500, 2800], "low")).toBe(1));
  it("picks the highest value when higher is better", () => expect(winnerIndex([70, 90, 80], "high")).toBe(1));
  it("has no winner on a tie for first place", () => expect(winnerIndex([2500, 2500, 2800], "low")).toBe(-1));
  it("has no winner with fewer than two known values", () => expect(winnerIndex([null, 2500], "low")).toBe(-1));
  it("has no winner for rows without a direction", () => expect(winnerIndex([1, 2])).toBe(-1));
  it("counts rows won per car", () => expect(winsPerCar([0, 1, 0, -1], 2)).toEqual([2, 1]));
  it("measures the monthly gap", () => expect(monthlyGap([2000, null, 2600])).toBe(600));
});

describe("loan maths", () => {
  it("matches a known amortisation payment", () => expect(loanPayment(100000, 6, 5)).toBe(1933));
  it("divides evenly at 0% interest", () => expect(loanPayment(60000, 0, 5)).toBe(1000));
  it("total interest = payments − principal", () => expect(totalInterest(1933, 5, 100000)).toBe(15980));
});

describe("monthly cost bands", () => {
  const car = staticCars[0];
  it("total = components + licensing", () => {
    const b = bandAt(car, 15000)!;
    expect(b.total).toBe(b.fuel + b.insurance + b.maintenance + b.depreciation + REGISTRATION);
  });
  it("costs more when driving more", () => expect(bandAt(car, 25000)!.total).toBeGreaterThan(bandAt(car, 7000)!.total));
});

describe("match score", () => {
  it("stays within 35–99 for every car", () => {
    for (const c of staticCars) {
      const s = computeScore(c, { ...EMPTY_ANSWERS, use: ["family"], fuel: ["any"] });
      expect(s).toBeGreaterThanOrEqual(35);
      expect(s).toBeLessThanOrEqual(99);
    }
  });
});

describe("licence plate input", () => {
  it("accepts 7–8 digits with dashes", () => expect(normalizePlate("12-345-67")).toBe("1234567"));
  it("rejects too short input", () => expect(normalizePlate("12345")).toBeNull());
  it("flags ex-leasing ownership", () => expect(isFleetOwnership("ליסינג")).toBe(true));
});

describe("used-car monthly cost", () => {
  const corolla = MAKES.find((m) => m.id === "toyota")!.models.find((m) => m.id === "corolla")!;
  const gen = corolla.gens[1];
  it("needs a plausible price", () => expect(estimateUsedCost({ gen, segment: "mass", year: 2016, powertrain: "petrol", askingPrice: 100, kmPerYear: 15000 })).toBeNull());
  it("adds up its components", () => {
    const c = estimateUsedCost({ gen, segment: "mass", year: 2016, powertrain: "petrol", askingPrice: 60000, kmPerYear: 15000 })!;
    expect(Math.round(c.total)).toBe(Math.round(c.fuel + c.depreciation + c.insurance + c.maintenance + c.licence));
  });
  it("lists the generation's model years from 2010", () => expect(yearsOf(corolla.gens[0], 2010)[0]).toBe(2010));
});

import { compareLease, loanPayment as leaseLoan } from "../features/leasing/model/leasing";

describe("leasing vs buying", () => {
  const base = { price: 150000, months: 36, leaseDown: 0, leaseMonthly: 2500, leaseIncludesInsurance: false, leaseIncludesMaintenance: true,
    buyDown: 150000, loanRate: 0, depreciationRate: 12, insuranceMonthly: 500, maintenanceMonthly: 200 };
  it("cash purchase costs value loss + running costs", () => {
    const r = compareLease(base);
    const resale = 150000 * 0.88 ** 3;
    expect(r.buy.valueLoss).toBe(Math.round(150000 - resale));
    expect(r.buy.interest).toBe(0);
    expect(r.buy.running).toBe(700 * 36);
  });
  it("adds to the lease only what it does not include", () => expect(compareLease(base).lease.extras).toBe(500 * 36));
  it("a zero-interest loan costs no interest", () => expect(leaseLoan(36000, 0, 36)).toBe(1000));
  it("financing adds interest", () => expect(compareLease({ ...base, buyDown: 30000, loanRate: 6 }).buy.interest).toBeGreaterThan(0));
});
