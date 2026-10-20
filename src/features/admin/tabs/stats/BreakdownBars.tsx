import { card } from "../../../../shared/styles";
import { num } from "../../format";

/** Small titled card of horizontal bars (count per status / type / source). */
export function BreakdownBars({ title, rows, label }: { title: string; rows: { k: string; n: number }[]; label: (k: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => Number(r.n)));
  return (
    <section className={`${card} p-5`}>
      <h2 className="mb-3 text-lg">{title}</h2>
      {!rows.length ? <p className="text-[14px] text-muted">אין נתונים בטווח הזה.</p> : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.k} className="grid grid-cols-[110px_1fr_44px] items-center gap-2 text-[14px]">
              <span className="truncate">{label(r.k)}</span>
              <span className="h-3 rounded-full bg-mist"><span className="block h-3 rounded-full bg-go" style={{ width: `${(Number(r.n) / max) * 100}%` }} /></span>
              <span className="num text-end">{num(Number(r.n))}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
