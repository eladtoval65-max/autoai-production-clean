import { useLang } from "../i18n";
import { ten } from "../format";

/** Sub-scores (reliability, safety…) as 10 segments each, so "8 of 10" is visible at a glance. Inputs are 0–100. */
export function SubScores({ items }: { items: (readonly [string, number])[] }) {
  const { t } = useLang();
  return (
    <ul className="space-y-3">
      {items.map(([label, raw]) => {
        const v = ten(raw);
        return (
          <li key={label} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 text-[15px]">
            <span className="text-muted">{label}</span>
            <span className="flex gap-[3px]" aria-hidden>
              {Array.from({ length: 10 }, (_, i) => {
                const fill = Math.max(0, Math.min(1, v - i));
                return (
                  <span key={i} className="relative h-2.5 flex-1 overflow-hidden rounded-sm bg-mist">
                    {fill > 0 && <span className="absolute inset-y-0 start-0 bg-go" style={{ width: `${fill * 100}%` }} />}
                  </span>
                );
              })}
            </span>
            <span className="min-w-[7.5rem] text-end" aria-label={`${label}: ${v.toFixed(1)} ${t.scoreOf10}`}>
              <span className="num text-[17px]">{v.toFixed(1)}</span> <span className="text-[14px] font-semibold text-muted">{t.scoreWord(v)}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
