/**
 * Anonymous asking-price reports: when someone types the price they were asked for a used car (calculator) or the
 * price they ask (seller card), we keep ONLY make, model, generation, year, price and a random tab id — no name,
 * phone, IP or plate. Over time this becomes our own market data ("prices visitors were quoted").
 *  - validReport(): rejects unknown models/years and implausible prices;
 *  - summarize(): per year, the median and the middle 50% range, trimmed of outliers, shown only from MIN_SAMPLES.
 */
import { MAKES } from "../../src/data/generations";

export const MIN_SAMPLES = 5;
export type PriceReport = { makeId: string; modelId: string; genCode: string; year: number; price: number; source: "calc" | "sell" };

export function validReport(b: Record<string, unknown>): PriceReport | null {
  const makeId = String(b.makeId ?? ""), modelId = String(b.modelId ?? ""), genCode = String(b.genCode ?? "");
  const year = Number(b.year), price = Math.round(Number(b.price));
  const source = b.source === "sell" ? "sell" : "calc";
  const model = MAKES.find((m) => m.id === makeId)?.models.find((m) => m.id === modelId);
  const gen = model?.gens.find((g) => g.code === genCode);
  if (!gen || !Number.isInteger(year) || year < gen.from || year > (gen.to ?? new Date().getFullYear() + 1)) return null;
  if (!Number.isFinite(price) || price < 5000 || price > 3_000_000) return null;
  return { makeId, modelId, genCode, year, price, source };
}

const quantile = (sorted: number[], q: number) => {
  const pos = (sorted.length - 1) * q, lo = Math.floor(pos), hi = Math.ceil(pos);
  return Math.round(sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo));
};

/** Per year: n, median, p25–p75 — after dropping values outside 1.5×IQR. Years under MIN_SAMPLES are omitted. */
export function summarize(rows: { year: number; price: number }[]) {
  const byYear = new Map<number, number[]>();
  for (const r of rows) byYear.set(r.year, [...(byYear.get(r.year) ?? []), r.price]);
  const out: { year: number; n: number; median: number; low: number; high: number }[] = [];
  for (const [year, prices] of byYear) {
    const s = [...prices].sort((a, b) => a - b);
    const q1 = quantile(s, 0.25), q3 = quantile(s, 0.75), iqr = q3 - q1;
    const kept = s.filter((p) => p >= q1 - 1.5 * iqr && p <= q3 + 1.5 * iqr);
    if (kept.length < MIN_SAMPLES) continue;
    out.push({ year, n: kept.length, median: quantile(kept, 0.5), low: quantile(kept, 0.25), high: quantile(kept, 0.75) });
  }
  return out.sort((a, b) => b.year - a.year);
}
