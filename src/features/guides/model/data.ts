/**
 * Data for the data-driven guides — computed from the site's own sourced data, nothing typed in by hand:
 * the catalog (src/data/catalogData.ts), generations + sourced facts (data-facts/), and official energy prices.
 */
import { STATIC_CATALOG } from "../../../data/catalogData";
import ENERGY from "../../../data/energyPrices.json";
import { factsFor, type Issue, type Source } from "../../../data/facts";
import { MAKES } from "../../../data/generations";
import { monthlyEnergy } from "../../browse/model/energy";
import { genYears } from "../../browse/model/labels";
import { hebrewName } from "../../compare/model/pairs";

/** New cars, cheapest total monthly cost at 15,000 km first. */
export function cheapestNewMonthly(limit = 15) {
  return [...STATIC_CATALOG].sort((a, b) => a.bands[15000].total - b.bands[15000].total).slice(0, limit)
    .map((c) => ({ id: c.id, name: hebrewName(c), price: c.price, monthly: c.bands[15000].total, fuel: c.bands[15000].fuel }));
}

/** Average monthly energy cost per powertrain in the catalog, at 7k / 15k / 25k km, and average list price. */
export function fuelTypeAverages() {
  const types = ["Hybrid", "Petrol", "Electric"] as const;
  return types.map((t) => {
    const cars = STATIC_CATALOG.filter((c) => c.fuelType === t);
    const avg = (f: (c: (typeof cars)[number]) => number) => Math.round(cars.reduce((s, c) => s + f(c), 0) / Math.max(1, cars.length));
    return { type: t, n: cars.length, price: avg((c) => c.price), km7: avg((c) => c.bands[7000].fuel), km15: avg((c) => c.bands[15000].fuel), km25: avg((c) => c.bands[25000].fuel), total15: avg((c) => c.bands[15000].total) };
  });
}

/** Energy cost per 100 km and per month for typical consumptions at today's official prices. */
export function energyExample() {
  const ev = 16, petrol = 6.5, hybrid = 4.8; // typical real-world: compact EV kWh/100km, compact petrol / hybrid L/100km
  return {
    prices: ENERGY,
    rows: [
      { label: "חשמלי (טעינה בבית)", cons: `${ev} קוט״ש`, per100: Math.round(ev * ENERGY.electricityPerKwh * 10) / 10, month: monthlyEnergy(ev, "kWh", 15000) },
      { label: "היברידי", cons: `${hybrid} ל׳`, per100: Math.round(hybrid * ENERGY.petrolPerL * 10) / 10, month: monthlyEnergy(hybrid, "L", 15000) },
      { label: "בנזין", cons: `${petrol} ל׳`, per100: Math.round(petrol * ENERGY.petrolPerL * 10) / 10, month: monthlyEnergy(petrol, "L", 15000) },
    ],
  };
}

/** Lowest real-world consumption (sourced engines, petrol/hybrid/diesel), generations from 2012. */
export function mostEconomicalUsed(limit = 20) {
  const out: { href: string; name: string; years: string; engine: string; cons: number; month: number; source: Source }[] = [];
  for (const mk of MAKES) for (const m of mk.models) for (const g of m.gens) {
    if ((g.to ?? 9999) < 2012) continue;
    for (const e of factsFor(mk.id, m.id, g.code).engines ?? []) {
      if (e.unit !== "L" || e.cons < 2.5) continue; // plug-ins' blended figures aren't comparable
      out.push({ href: `/cars/${mk.id}/${m.id}`, name: `${mk.he} ${m.he}`, years: `${genYears(g.from, g.to)} (${g.code})`, engine: e.name, cons: e.cons, month: monthlyEnergy(e.cons, "L", 15000, e.pt), source: e.source });
    }
  }
  const seen = new Set<string>();
  return out.sort((a, b) => a.cons - b.cons).filter((r) => { const k = `${r.name}|${r.years}`; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, limit);
}

/** Popular used models (Israel) — model ids as in generations.ts. */
const POPULAR: [string, string][] = [
  ["toyota", "corolla"], ["hyundai", "tucson"], ["kia", "sportage"], ["toyota", "yaris"], ["skoda", "octavia"], ["kia", "picanto"],
  ["hyundai", "i10"], ["mazda", "mazda3"], ["kia", "niro"], ["toyota", "rav4"], ["hyundai", "i20"], ["mitsubishi", "outlander"],
  ["suzuki", "swift"], ["seat", "ibiza"], ["nissan", "qashqai"], ["hyundai", "elantra"], ["kia", "ceed"], ["toyota", "c-hr"],
];

/** Per popular model: its used-market generations (2012+) with sourced issues, recalls first. */
export function popularProblems() {
  const order: Record<Issue["level"], number> = { recall: 0, manufacturer: 1, widely_reported: 2 };
  return POPULAR.flatMap(([mkId, mId]) => {
    const mk = MAKES.find((x) => x.id === mkId); const m = mk?.models.find((x) => x.id === mId);
    if (!mk || !m) return [];
    const gens = m.gens.filter((g) => (g.to ?? 9999) >= 2012).reverse()
      .map((g) => ({ code: g.code, years: genYears(g.from, g.to), issues: [...(factsFor(mk.id, m.id, g.code).issues ?? [])].sort((a, b) => order[a.level] - order[b.level]).slice(0, 3) }))
      .filter((g) => g.issues.length);
    return gens.length ? [{ href: `/cars/${mk.id}/${m.id}`, name: `${mk.he} ${m.he}`, gens }] : [];
  });
}
