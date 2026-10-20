/**
 * Match score (0–100) of a car for the user's answers.
 * Weights: budget 25 · use 20 · monthly cost 20 · reliability 15 · safety 10 · priority 10,
 * then small adjustments for mileage/powertrain. Multi-select answers count if any of them matches.
 */
import type { Answers, Car } from "../types";
import { FUEL_ANSWER_HE } from "./fuel";

/** Body types that suit each use. */
const USE_BODY: Record<string, string[]> = { city: ["hatchback", "sedan"], family: ["suv", "minivan"], highway: ["sedan", "suv"], fun: ["sedan", "hatchback"] };

/** Which sub-score each priority answer maps to. */
const PRIORITY_FIELD: Record<string, keyof Car> = { reliable: "reliability", economy: "economy", safety: "safety", comfort: "comfort" };

function budgetPoints(car: Car, a: Answers) {
  if (car.price <= a.budget * 0.85) return 25;
  if (car.price <= a.budget) return 18;
  return car.price <= a.budget * 1.1 ? 8 : 0;
}

function usePoints(car: Car, a: Answers) {
  if (!a.use.length) return 14;
  const body = (car.bodyType ?? "").toLowerCase();
  return a.use.some((u) => car.use === u || (USE_BODY[u] ?? []).includes(body)) ? 20 : 10;
}

function monthlyCostPoints(car: Car) {
  const m = car.ownershipMonthly ?? 2200;
  return m < 1500 ? 20 : m < 1800 ? 16 : m < 2200 ? 11 : 5;
}

function priorityPoints(car: Car, a: Answers) {
  const picked = a.priority.length ? a.priority : ["reliable"];
  const avg = picked.reduce((sum, p) => sum + ((car[PRIORITY_FIELD[p]] as number) ?? 0), 0) / picked.length;
  return Math.round((avg / 100) * 10);
}

/** Mileage/powertrain fit: EVs make less sense at very low km; hybrids shine at high km. */
function mileageAdjustment(car: Car, a: Answers) {
  if (a.annualKmBand === "low" && car.fuel === "חשמלי") return -5;
  if (a.annualKmBand === "high" && car.fuel === "היברידי") return 4;
  if (a.annualKmBand === "high" && car.fuel === "חשמלי") return -3;
  return 0;
}

/** Penalty when the car's powertrain isn't one the user asked for. */
function fuelPreferencePenalty(car: Car, a: Answers) {
  const wanted = a.fuel.filter((f) => f !== "any").map((f) => FUEL_ANSWER_HE[f]);
  return wanted.length && !a.fuel.includes("any") && !wanted.includes(car.fuel) ? -6 : 0;
}

/** Final score, clamped to 35–99 so no result looks absurdly perfect or hopeless. */
export function computeScore(car: Car, a: Answers): number {
  const s = budgetPoints(car, a) + usePoints(car, a) + monthlyCostPoints(car)
    + Math.round((car.reliability / 100) * 15) + Math.round((car.safety / 100) * 10)
    + priorityPoints(car, a) + mileageAdjustment(car, a) + fuelPreferencePenalty(car, a);
  return Math.min(99, Math.max(35, s));
}
