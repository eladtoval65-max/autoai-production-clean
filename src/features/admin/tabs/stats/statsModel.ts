/**
 * Pure helpers for the stats tab.
 */
import type { Stats } from "../../types";

/** One bar per calendar day in the range, oldest first, filling days with no leads as 0. Keys match the server's YYYY-MM-DD. */
export function dailySeries(s: Stats) {
  const byDate = new Map(s.byDay.map((r) => [String(r.d).slice(0, 10), Number(r.n)]));
  return Array.from({ length: s.days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (s.days - 1 - i));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { key, label: `${d.getDate()}/${d.getMonth() + 1}`, n: byDate.get(key) ?? 0 };
  });
}

/** Percentage with one decimal, or null when the denominator is 0. */
export const pct1 = (part: number, whole: number) => (whole ? Math.round((part / whole) * 1000) / 10 : null);
