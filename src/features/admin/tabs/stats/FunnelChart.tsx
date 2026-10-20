import { card } from "../../../../shared/styles";
import { num } from "../../format";
import { FUNNEL_STEP } from "../../labels";

/** Horizontal funnel bars (unique visitors per step) with the step-to-step conversion in brackets. */
export function FunnelChart({ steps }: { steps: { k: string; n: number }[] }) {
  const max = Math.max(1, ...steps.map((r) => r.n));
  return (
    <section className={`${card} p-5`}>
      <h2 className="text-lg">משפך המרה</h2>
      <p className="text-[13px] text-muted">מבקרים ייחודיים (לפי לשונית דפדפן) בכל שלב. ללא מידע אישי.</p>
      <ol className="mt-4 space-y-2.5">
        {steps.map((r, i) => {
          const prev = i ? steps[i - 1].n : 0;
          return (
            <li key={r.k} className="grid grid-cols-[120px_1fr_96px] items-center gap-2 text-[14px]">
              <span>{FUNNEL_STEP[r.k] ?? r.k}</span>
              <span className="h-7 rounded-lg bg-mist"><span className="block h-7 rounded-lg bg-go" style={{ width: `${Math.max(r.n ? 2 : 0, (r.n / max) * 100)}%` }} /></span>
              <span className="text-end"><span className="num">{num(r.n)}</span>{i > 0 && prev > 0 && <span className="ms-1 text-[12px] text-muted">({Math.round((r.n / prev) * 100)}%)</span>}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
