/**
 * "Cars up to ₪X": every new and used candidate whose price fits the budget, ranked by what it really costs a month
 * (15,000 km/yr) — not by sticker price. Reuses the questionnaire's candidate pool so the numbers match everywhere.
 */
import { staticCars } from "../../home/model/catalog";
import { newFromModels, usedFromGenerations } from "../../home/model/expandedCatalog";
import { monthlyFor } from "../../home/model/cost";
import type { Car } from "../../home/types";

export const BUDGETS = [50000, 100000, 150000, 200000] as const;
export const KM = 15000;
export type Pick = { car: Car; monthly: number };
/** Each tier shows cars from half the budget up, so "up to ₪100K" is not the same list as "up to ₪50K". */
const floorOf = (budget: number) => (budget <= 50000 ? 0 : budget / 2);

/** Short label: 100000 → "₪100K". */
export const budgetLabel = (b: number) => `₪${Math.round(b / 1000)}K`;

/** One entry per model (the cheapest-to-run trim/generation), cheapest monthly cost first. */
function rank(cars: Car[], budget: number, limit: number): Pick[] {
  const best = new Map<string, Pick>();
  for (const car of cars) {
    if (car.price > budget || car.price < floorOf(budget) || !car.bands) continue;
    const monthly = monthlyFor(car, KM);
    if (!monthly) continue;
    const key = car.make.split(" · ")[0];
    const prev = best.get(key);
    if (!prev || monthly < prev.monthly) best.set(key, { car, monthly });
  }
  return [...best.values()].sort((a, b) => a.monthly - b.monthly).slice(0, limit);
}

export function budgetPicks(budget: number, limit = 12): { fresh: Pick[]; used: Pick[] } {
  const fresh = rank([...staticCars, ...newFromModels(staticCars)], budget, limit);
  const used = rank(usedFromGenerations(budget), budget, limit);
  return { fresh, used };
}
