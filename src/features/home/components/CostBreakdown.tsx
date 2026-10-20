import { useState } from "react";
import { shekel, useLang } from "../../../shared/i18n";
import { CodeChip } from "../../../shared/ui/CodeChip";
import { COST_COLORS, tcoRows, type CostLabels } from "../model/cost";
import type { Car } from "../types";

type Dict = ReturnType<typeof useLang>["t"];

/** The five cost-line labels from the active language dictionary. */
export const costLabels = (t: Dict): CostLabels => ({
  fuel: t.fuelLine, insurance: t.insuranceLine, maintenance: t.maintenanceLine, depreciation: t.depreciationLine, registration: t.registrationLine,
});

/**
 * Monthly cost as one stacked bar (part-to-whole) plus a labelled legend.
 * `compact` = small bar + inline legend for cards; full = table with provenance badges and shares.
 */
export function CostBreakdown({ car, km, compact }: { car: Car; km: number; compact?: boolean }) {
  const { t, nf } = useLang();
  const rows = tcoRows(car, km, costLabels(t)).map((r, i) => ({ ...r, color: COST_COLORS[i] }));
  const known = rows.filter((r) => r.value != null) as (typeof rows[number] & { value: number })[];
  const total = known.reduce((sum, r) => sum + r.value, 0) || 1;
  const pct = (v: number) => Math.round((v / total) * 100);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <figure className="m-0">
      {/* Stacked bar with a hover/focus tooltip per segment */}
      <div className="relative" onMouseLeave={() => setHover(null)}>
        <div className={`flex w-full gap-[2px] overflow-hidden rounded-full ${compact ? "h-3" : "h-4"}`} role="img"
          aria-label={known.map((r) => `${r.label} ${pct(r.value)}%`).join(", ")}>
          {known.map((r, i) => (
            <span key={r.label} tabIndex={0} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
              className={`grow h-full transition-opacity first:rounded-s-full last:rounded-e-full ${hover != null && hover !== i ? "opacity-40" : ""}`}
              style={{ width: `${pct(r.value)}%`, background: r.color }} />
          ))}
        </div>
        {hover != null && known[hover] && (
          <div className="pointer-events-none absolute -top-11 start-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-[13px] font-semibold text-white shadow-[var(--shadow-float)] rtl:translate-x-1/2">
            {known[hover].label}: {shekel(known[hover].value, nf)} · {pct(known[hover].value)}%
          </div>
        )}
      </div>

      {compact ? (
        <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
          {known.map((r) => (
            <li key={r.label} className="flex items-center gap-1.5">
              <span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ background: r.color }} />{r.label} <span className="num text-[14px] text-ink">{shekel(r.value, nf)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center gap-3 py-2 text-[15px]">
              <span aria-hidden className="h-3 w-3 shrink-0 rounded-[4px]" style={{ background: r.value != null ? r.color : "transparent", boxShadow: r.value == null ? "inset 0 0 0 1.5px #b4bcc7" : undefined }} />
              <span className="min-w-0 flex-1 text-ink">{r.label}</span>
              <CodeChip code={r.code} />
              <span className="w-10 text-end text-[13px] text-muted">{r.value != null ? `${pct(r.value)}%` : ""}</span>
              <span className={`num w-[4.6rem] text-end text-[17px] ${r.value == null ? "text-muted" : ""}`}>{r.value == null ? "–" : shekel(r.value, nf)}</span>
            </li>
          ))}
        </ul>
      )}
      {!compact && <figcaption className="mt-2 text-[13px] text-muted">{t.kmBasis(km)} · {t.insuranceNote}</figcaption>}
    </figure>
  );
}
