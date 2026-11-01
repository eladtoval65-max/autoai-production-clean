import { beforeAll, describe, expect, it } from "vitest";
import { loadAllFacts } from "../data/facts";
import { MAKES } from "../data/generations";
import { staticCars } from "../features/home/model/catalog";
import { estimatedValue, newFromModels, usedFromGenerations } from "../features/home/model/expandedCatalog";

describe("expanded questionnaire catalog", () => {
  beforeAll(() => loadAllFacts());
  it("adds every on-sale model with a list price that the rich catalog lacks, without duplicates", () => {
    const extra = newFromModels(staticCars);
    const ids = new Set([...staticCars, ...extra].map((c) => c.id));
    expect(ids.size).toBe(staticCars.length + extra.length);
    expect(extra.length).toBeGreaterThan(100);
    for (const c of extra) { expect(c.price).toBeGreaterThan(0); expect(c.ownershipMonthly).toBeGreaterThan(500); }
  });
  it("used candidates always fit the budget and carry an estimate note", () => {
    for (const budget of [50000, 90000, 180000]) {
      const used = usedFromGenerations(budget);
      expect(used.length).toBeGreaterThan(0);
      for (const c of used) { expect(c.price).toBeLessThanOrEqual(budget); expect(c.dataNote).toContain("משוער"); expect(c.condition).toBe("used"); }
    }
  });
  it("older model years are estimated cheaper than newer ones", () => {
    const corolla = MAKES.find((m) => m.id === "toyota")!.models.find((m) => m.id === "corolla")!;
    const gen = corolla.gens[corolla.gens.length - 1];
    const a = estimatedValue(MAKES[0], corolla, gen, 2020), b = estimatedValue(MAKES[0], corolla, gen, 2024);
    if (a != null && b != null) expect(a).toBeLessThan(b);
  });
});

import { withDriver } from "../features/home/model/driver";

describe("driver profile", () => {
  it("raises only insurance (and the totals by the same amount) for young drivers", () => {
    const car = staticCars[0];
    const young = withDriver(car, "young");
    const b = car.bands![15000], y = young.bands![15000];
    expect(y.insurance).toBe(Math.round(b.insurance * 1.8));
    expect(y.total - b.total).toBe(Math.round(b.insurance * 0.8));
    expect(y.fuel).toBe(b.fuel);
    expect(withDriver(car, "experienced")).toBe(car);
  });
});
