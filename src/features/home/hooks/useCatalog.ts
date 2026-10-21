/**
 * The cars the questionnaire ranks, for the chosen condition (new / used / either) and budget.
 *
 * New: the 49 fully-researched catalog cars (src/data/catalogData.ts, verified daily) + every other model on sale
 * with a verified list price. Used: every generation since 2012 at an estimated price that fits the budget
 * (see model/expandedCatalog.ts). The older database seed (tRPC catalog.list) is no longer used here — it had
 * fewer cars and partial costs.
 */
import { useMemo } from "react";
import type { Answers, Car } from "../types";
import { staticCars } from "../model/catalog";
import { newFromModels, usedFromGenerations } from "../model/expandedCatalog";

const NEW_CARS: Car[] = [...staticCars, ...newFromModels(staticCars)];

export function useCatalog(answers: Pick<Answers, "condition" | "budget">): Car[] {
  const { condition, budget } = answers;
  return useMemo<Car[]>(() => {
    if (condition === "new") return NEW_CARS;
    const used = usedFromGenerations(budget);
    return condition === "used" ? used : [...NEW_CARS, ...used];
  }, [condition, budget]);
}
