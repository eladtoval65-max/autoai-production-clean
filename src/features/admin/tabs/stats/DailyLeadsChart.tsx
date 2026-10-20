import { card } from "../../../../shared/styles";
import type { Stats } from "../../types";
import { dailySeries } from "./statsModel";

/** Column chart of leads per day for the selected range (empty days shown faint). */
export function DailyLeadsChart({ stats, total }: { stats: Stats; total: number }) {
  const series = dailySeries(stats);
  const max = Math.max(1, ...series.map((r) => r.n));
  return (
    <section className={`${card} p-5`}>
      <h2 className="text-lg">לידים לפי יום</h2>
      <div className="mt-4 flex h-40 items-end gap-[2px]" role="img" aria-label={`לידים ב-${stats.days} הימים האחרונים, סך הכל ${total}`}>
        {series.map((r) => <span key={r.key} title={`${r.label}: ${r.n}`} className="flex-1 rounded-t-[3px] bg-go" style={{ height: `${(r.n / max) * 100}%`, minHeight: r.n ? 3 : 1, opacity: r.n ? 1 : 0.15 }} />)}
      </div>
      <div className="mt-1 flex justify-between text-[12px] text-muted"><span>{series[0]?.label}</span><span>היום</span></div>
    </section>
  );
}
