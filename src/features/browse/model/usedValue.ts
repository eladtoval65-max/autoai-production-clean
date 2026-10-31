/**
 * ESTIMATED used value of a generation at a model year — shown everywhere as an estimate.
 * Starts from the sourced Israeli launch price (data-facts) — or today's list price for the current generation —
 * and applies our yearly depreciation curve (usedCost.ts). When visitors reported enough real asking prices for that
 * year (server/prices/reports.ts), the page prefers those.
 */
import { factsFor } from "../../../data/facts";
import type { Generation, Make, ModelLine } from "../../../data/generations";
import { THIS_YEAR } from "./labels";
import { depreciationRate } from "./usedCost";

/** Null when there is no sourced starting price for this generation. */
export function estimatedValue(make: Make, model: ModelLine, gen: Generation, year: number): number | null {
  const launch = factsFor(make.id, model.id, gen.code).launchPrice;
  const isCurrent = gen === model.gens[model.gens.length - 1] && gen.to == null;
  const list = isCurrent && model.price ? model.price[0] : null;
  // What the car cost new in `year`: for the current generation, between the launch price and today's list price
  // (prices rise over a generation's life); for older generations, the launch price.
  let start = launch?.ils ?? list;
  if (launch && list && year > launch.year && THIS_YEAR > launch.year) start = launch.ils + ((list - launch.ils) * (year - launch.year)) / (THIS_YEAR - launch.year);
  if (!start) return null;
  let value = start;
  for (let age = 1; age <= THIS_YEAR - year; age++) value *= 1 - depreciationRate(age, gen.pt[0], model.segment === "premium");
  return Math.round(value / 500) * 500;
}

/** The generation a model year belongs to (newest wins on overlap years). */
export const genForYear = (model: ModelLine, year: number): Generation | undefined =>
  [...model.gens].reverse().find((g) => year >= g.from && year <= (g.to ?? THIS_YEAR));
