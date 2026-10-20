/**
 * Comparison maths: which car wins each row, and the headline verdicts. Pure functions, no React.
 */

/** "low" = smaller is better (prices, costs, consumption); "high" = bigger is better (scores, seats). */
export type Better = "low" | "high";

/**
 * Index of the single winning car for one row, or -1 when there is no clear winner
 * (fewer than two known values, all equal, or a tie for first place).
 */
export function winnerIndex(values: (number | null)[], better?: Better): number {
  if (!better) return -1;
  const known = values.filter((v): v is number => v != null);
  if (known.length < 2 || new Set(known).size === 1) return -1;
  const target = better === "low" ? Math.min(...known) : Math.max(...known);
  return values.filter((v) => v === target).length === 1 ? values.indexOf(target) : -1;
}

/** Biggest monthly difference between the compared cars (0 when fewer than two are known). */
export function monthlyGap(values: (number | null)[]): number {
  const known = values.filter((v): v is number => v != null);
  return known.length >= 2 ? Math.max(...known) - Math.min(...known) : 0;
}

/** How many rows each car won. */
export const winsPerCar = (winners: number[], carCount: number) =>
  Array.from({ length: carCount }, (_, i) => winners.filter((w) => w === i).length);
