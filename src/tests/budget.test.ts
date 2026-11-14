import { beforeAll, describe, expect, it } from "vitest";
import { loadAllFacts } from "../data/facts";
import { budgetPicks } from "../features/budget/model/budgetPicks";
import { compareLease, defaultsFor, usedAlternative } from "../features/leasing/model/leasing";

beforeAll(() => loadAllFacts());

describe("budget picks", () => {
  it("only cars within the tier, cheapest to run first, one per model", () => {
    const { fresh, used } = budgetPicks(150000);
    for (const list of [fresh, used]) {
      expect(list.every((p) => p.car.price <= 150000 && p.car.price >= 75000)).toBe(true);
      expect(list.map((p) => p.monthly)).toEqual([...list.map((p) => p.monthly)].sort((a, b) => a - b));
      expect(new Set(list.map((p) => p.car.make.split(" · ")[0])).size).toBe(list.length);
    }
    expect(fresh.length + used.length).toBeGreaterThan(0);
  });
});

describe("new vs used vs leasing", () => {
  it("a 3-year-old used car loses less value than the same car new", () => {
    const price = 150000;
    const i = { price, months: 36, leaseDown: 0, leaseMonthly: 2500, leaseIncludesInsurance: false, leaseIncludesMaintenance: true, buyDown: price, loanRate: 0, ...defaultsFor(price) };
    const used = usedAlternative(i);
    expect(used.price).toBeLessThan(price * 0.75);
    expect(used.valueLoss).toBeLessThan(compareLease(i).buy.valueLoss);
  });
});
