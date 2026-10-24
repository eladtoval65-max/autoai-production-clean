/**
 * Monthly cost estimate for a USED car from its asking price. Pure function, no React.
 * Every figure is an estimate and is labelled as such in the UI:
 *  - energy: typical real-world consumption × today's official prices (src/data/energyPrices.json: petrol 95 max price, home electricity tariff);
 *    plug-in hybrids assume half the km on electricity;
 *  - depreciation: a yearly rate by age (newer cars lose value faster), +3 points for EVs, +2 for premium brands;
 *  - insurance: mandatory + comprehensive approximation from the car's value, adjusted for engine power, premium brand,
 *    EV repair costs and large 7-seat/van bodies (never a quote);
 *  - maintenance: base routine servicing that grows with age (premium ×1.7, EV ×0.55, capped) PLUS the generation's sourced
 *    scheduled / wear items (timing belt, DSG oil, clutch…) spread per month by km or years. "Risk" items are shown, not added;
 *  - licensing: average annual fee spread per month.
 */
import type { Generation, ModelLine, Powertrain } from "../../../data/generations";
import type { MaintenanceItem } from "../../../data/facts";
import { THIS_YEAR } from "./labels";

import ENERGY from "../../../data/energyPrices.json";

export const PRICES = { petrolPerL: ENERGY.petrolPerL, dieselPerL: ENERGY.dieselPerL, electricityPerKwh: ENERGY.electricityPerKwh } as const;
const PHEV_ELECTRIC_SHARE = 0.5;
const EV_DEFAULT_KWH = 17;      // used when a generation's consumption is in litres but the user picked "electric"
const PETROL_DEFAULT_L = 6.5;   // used when a generation's consumption is in kWh but the user picked a fuel engine
const LICENCE_PER_MONTH = 110;

export type UsedCostInput = {
  gen: Generation; segment: ModelLine["segment"]; year: number; powertrain: Powertrain; askingPrice: number; kmPerYear: number;
  /** Optional refinements: body type (7-seat / van insurance), sourced maintenance items of the generation. */
  body?: ModelLine["body"]; maintenanceItems?: MaintenanceItem[];
};
export type MaintenanceShare = { item: MaintenanceItem; monthly: number };
export type UsedCost = {
  fuel: number; depreciation: number; insurance: number; maintenance: number; licence: number; total: number; depreciationRate: number;
  /** Part of `maintenance` that comes from sourced scheduled / wear items, item by item. */
  maintenanceItems: MaintenanceShare[];
};

/** Energy cost per km for the chosen powertrain. A generation's `cons` is kWh/100km when its first powertrain is "ev", else L/100km. */
function energyPerKm(gen: Generation, pt: Powertrain): number {
  const consIsKwh = gen.pt[0] === "ev";
  const kwh = consIsKwh ? gen.cons : EV_DEFAULT_KWH;
  const litres = consIsKwh ? PETROL_DEFAULT_L : gen.cons;
  const evKm = (kwh / 100) * PRICES.electricityPerKwh;
  const fuelKm = (litres / 100) * (pt === "diesel" ? PRICES.dieselPerL : PRICES.petrolPerL);
  if (pt === "ev") return evKm;
  if (pt === "phev") return PHEV_ELECTRIC_SHARE * evKm + (1 - PHEV_ELECTRIC_SHARE) * fuelKm;
  return fuelKm;
}

/** Yearly depreciation rate for a car of this age and type. */
export function depreciationRate(age: number, pt: Powertrain, premium: boolean): number {
  let rate = age <= 2 ? 0.13 : age <= 5 ? 0.1 : age <= 9 ? 0.08 : 0.06;
  if (pt === "ev") rate += 0.03;
  if (premium) rate += 0.02;
  return rate;
}

/** Highest horsepower figure of a generation ("122–140" → 140). */
export const maxHp = (hp: string): number => Number(String(hp).split(/[–-]/).filter(Boolean).pop()) || 0;

/** Insurance multiplier for what makes a car pricier to insure than its value alone suggests. */
export function insuranceFactor(gen: Generation, powertrain: Powertrain, premium: boolean, body?: ModelLine["body"]): number {
  const hp = maxHp(gen.hp);
  let f = premium ? 1.25 : 1;
  if (hp > 300) f *= 1.25; else if (hp > 200) f *= 1.12;
  if (powertrain === "ev") f *= 1.1;          // costlier body / battery repairs
  if (body === "suv7" || body === "mpv") f *= 1.05;
  return f;
}

/** Monthly share of each sourced scheduled / wear item at this mileage. Items without an interval, and "risk" items, add nothing. */
export function maintenanceShares(items: MaintenanceItem[] | undefined, kmPerYear: number): MaintenanceShare[] {
  return (items ?? []).filter((it) => it.kind !== "risk").map((item) => {
    const avg = (item.costIls[0] + item.costIls[1]) / 2;
    const perYearByKm = item.intervalKm ? kmPerYear / item.intervalKm : 0;
    const perYearByTime = item.intervalYears ? 1 / item.intervalYears : 0;
    return { item, monthly: (avg * Math.max(perYearByKm, perYearByTime)) / 12 };
  }).filter((s) => s.monthly > 0);
}

/** Returns null when the price is missing or implausibly low. */
export function estimateUsedCost({ gen, segment, year, powertrain, askingPrice, kmPerYear, body, maintenanceItems }: UsedCostInput): UsedCost | null {
  if (!askingPrice || askingPrice < 5000) return null;
  const age = Math.max(0, THIS_YEAR - year);
  const premium = segment === "premium";
  const rate = depreciationRate(age, powertrain, premium);
  const fuel = (energyPerKm(gen, powertrain) * kmPerYear) / 12;
  const depreciation = (askingPrice * rate) / 12;
  const insurance = ((1700 + 1000 + askingPrice * 0.022) * insuranceFactor(gen, powertrain, premium, body)) / 12;
  const shares = maintenanceShares(maintenanceItems, kmPerYear);
  const base = Math.min(900, (180 + 12 * age) * (premium ? 1.7 : 1) * (powertrain === "ev" ? 0.55 : 1));
  const maintenance = Math.min(1500, base + shares.reduce((a, s) => a + s.monthly, 0));
  const total = fuel + depreciation + insurance + maintenance + LICENCE_PER_MONTH;
  return { fuel, depreciation, insurance, maintenance, licence: LICENCE_PER_MONTH, total, depreciationRate: rate, maintenanceItems: shares };
}

/** Model years a generation covers inside the browser's range (2010 → now). */
export function yearsOf(gen: Generation, firstYear: number): number[] {
  const years: number[] = [];
  for (let y = Math.max(firstYear, gen.from); y <= (gen.to ?? THIS_YEAR); y++) years.push(y);
  return years;
}
