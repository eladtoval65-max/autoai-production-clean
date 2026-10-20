/**
 * Loads the car catalog: live database via tRPC when it has rows, otherwise the static sourced catalog.
 */
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import type { Car } from "../types";
import { carFromDbRow, staticCars } from "../model/catalog";

export function useCatalog(annualKm: number): Car[] {
  const query = trpc.catalog.list.useQuery({ limit: 100, annualKm }, { retry: 1 });
  return useMemo<Car[]>(() => {
    const rows = query.data ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rows.length ? rows.map((r) => carFromDbRow(r as any)) : staticCars;
  }, [query.data]);
}
