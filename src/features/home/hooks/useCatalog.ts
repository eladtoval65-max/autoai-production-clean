/**
 * The car catalog the recommendations and comparisons run on.
 *
 * Source of truth = the static, sourced catalog (src/data/catalogData.ts): it is the one the daily agent
 * verifies and updates, with full 7k/15k/25k cost bands for every car. The database copy (tRPC catalog.list)
 * is an older seed with fewer cars and partial costs, so it is no longer used here — when the production
 * database came back online it replaced the full catalog with that seed (comparisons showed only the licence fee).
 */
import type { Car } from "../types";
import { staticCars } from "../model/catalog";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useCatalog(_annualKm: number): Car[] {
  return staticCars;
}
