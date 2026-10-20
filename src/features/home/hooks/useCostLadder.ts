/**
 * 7k / 15k / 25k monthly-cost ladder for one or more cars:
 * live DB values (tRPC tco.multiBand) when the car comes from the database, else the static catalog bands.
 */
import { trpc } from "@/lib/trpc";
import { ladderFor, trimOf } from "../model/cost";
import type { Car, Ladder, LadderByTrim } from "../types";

export function useCostLadders(cars: Car[]): { ladders: (Ladder | undefined)[]; loading: boolean } {
  const trimIds = cars.map((c) => trimOf(c.id)).filter((x): x is number => x !== undefined);
  const { data, isLoading } = trpc.tco.multiBand.useQuery({ trimIds: trimIds.length ? trimIds : [0] }, { enabled: trimIds.length > 0 });
  const db = data as unknown as LadderByTrim | undefined;
  return { ladders: cars.map((c) => ladderFor(c, db)), loading: trimIds.length > 0 && isLoading };
}

/** Convenience for a single car. */
export const useCostLadder = (car: Car) => useCostLadders([car]).ladders[0];
