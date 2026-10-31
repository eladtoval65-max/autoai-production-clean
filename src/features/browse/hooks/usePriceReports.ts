/**
 * Asking prices visitors reported for a model (anonymous, see server/prices/reports.ts), and a helper that reports
 * the price typed into a calculator once the visitor stops typing for 2.5 seconds.
 */
import { useEffect, useState } from "react";
import { reportPrice } from "../../../shared/analytics";

export type PriceYear = { year: number; n: number; median: number; low: number; high: number };

export function usePriceReports(makeId: string, modelId: string): PriceYear[] {
  const [years, setYears] = useState<PriceYear[]>([]);
  useEffect(() => {
    let alive = true;
    fetch(`/api/event?prices=${makeId}/${modelId}`).then((r) => (r.ok ? r.json() : { years: [] })).then((d) => { if (alive) setYears(d.years ?? []); }).catch(() => undefined);
    return () => { alive = false; };
  }, [makeId, modelId]);
  return years;
}

/** Reports {price} for this model-year after a pause in typing; repeats only when something changes. */
export function useReportPrice(r: { makeId: string; modelId: string; genCode: string; year: number; price: number; source: "calc" | "sell" }) {
  const key = `${r.makeId}/${r.modelId}/${r.genCode}/${r.year}/${r.price}`;
  useEffect(() => {
    if (!r.price || r.price < 5000) return;
    const t = window.setTimeout(() => reportPrice(r), 2500);
    return () => window.clearTimeout(t);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
}
