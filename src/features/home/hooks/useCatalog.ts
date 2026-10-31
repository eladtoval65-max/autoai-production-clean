/**
 * The cars the questionnaire ranks, for the chosen condition (new / used / either) and budget.
 *
 * New: the 49 fully-researched catalog cars (src/data/catalogData.ts, verified daily) + every other model on sale
 * with a verified list price. Used: every generation since 2012 at an estimated price that fits the budget
 * (see model/expandedCatalog.ts). The older database seed (tRPC catalog.list) is no longer used here — it had
 * fewer cars and partial costs.
 */
import { useMemo } from "react";
import { useFacts } from "../../../data/useFacts";
import type { Answers, Car } from "../types";
import { staticCars } from "../model/catalog";
import { newFromModels, usedFromGenerations } from "../model/expandedCatalog";


export function useCatalog(answers: Pick<Answers, "condition" | "budget">): Car[] {
  const { condition, budget } = answers;
  // Sourced facts (launch prices, consumption, issues) load in the background; candidates are rebuilt when they arrive.
  const { version } = useFacts();
  const newCars = useMemo<Car[]>(() => [...staticCars, ...newFromModels(staticCars)], [version]); // eslint-disable-line react-hooks/exhaustive-deps
  return useMemo<Car[]>(() => {
    if (condition === "new") return newCars;
    const used = usedFromGenerations(budget);
    return condition === "used" ? used : [...newCars, ...used];
  }, [condition, budget, newCars]);
}
