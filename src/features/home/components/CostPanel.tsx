import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { shekel, useLang } from "../../../shared/i18n";
import { shortName } from "../../../shared/format";
import { btnGhost, card } from "../../../shared/styles";
import { CodeChip, type Provenance } from "../../../shared/ui/CodeChip";
import { MonthlyTag } from "../../../shared/ui/MonthlyTag";
import { Slider } from "../../../shared/ui/Slider";
import { COST_COLORS, energyPerKm, monthlyFor, tcoRows } from "../model/cost";
import { loanPayment, totalInterest } from "../model/finance";
import type { Answers, Car } from "../types";
import { costLabels } from "./CostBreakdown";

type Line = { label: string; value: number; code: Provenance };
type Dict = ReturnType<typeof useLang>["t"];

/**
 * The monthly lines shown in the calculator. One source of truth:
 *  - all five components known → show them;
 *  - some missing but an overall monthly estimate exists → show known lines + "other costs" so the total matches;
 *  - otherwise fill gaps with a rough, clearly-labelled formula.
 */
function runningLines(car: Car, km: number, t: Dict): { lines: Line[]; usedFormula: boolean } {
  const rows = tcoRows(car, km, costLabels(t));
  const known = rows.filter((r): r is Line => r.value != null);
  const missing = rows.filter((r) => r.value == null);
  if (!missing.length) return { lines: known, usedFormula: false };
  if (car.ownershipMonthly) {
    const other = Math.max(0, monthlyFor(car, km) - known.reduce((s, r) => s + r.value, 0));
    return { lines: [...known, { label: t.otherCosts, value: other, code: "est" }], usedFormula: false };
  }
  const formula: Record<string, number> = {
    [t.fuelLine]: Math.round((km / 12) * energyPerKm(car.fuel)),
    [t.insuranceLine]: 400, [t.maintenanceLine]: 220, [t.depreciationLine]: Math.round((car.price * 0.08) / 12),
  };
  return { lines: [...known, ...missing.map((r) => ({ label: `${r.label} ${t.formulaSuffix}`, value: formula[r.label] ?? 0, code: "est" as const }))], usedFormula: true };
}

/** Inline calculator: running monthly costs by component, plus an optional car-loan payment. */
export function CostPanel({ car, answers }: { car: Car; answers: Answers }) {
  const { t, nf } = useLang();
  const [down, setDown] = useState(30);     // down payment %
  const [rate, setRate] = useState(4.5);    // annual interest %
  const [years, setYears] = useState(5);
  const [loan, setLoan] = useState(false);
  const km = answers.annualKm;

  const { lines, usedFormula } = runningLines(car, km, t);
  const running = lines.reduce((s, r) => s + r.value, 0);
  const principal = Math.round(car.price * (1 - down / 100));
  const payment = loanPayment(principal, rate, years);
  const total = running + (loan ? payment : 0);

  return (
    <section aria-label={t.costTitle} className={`${card} swap mt-6 grid gap-8 p-5 sm:p-7 lg:grid-cols-2`}>
      <div>
        <h3 className="text-[1.4rem]">{t.costTitle}</h3>
        <p className="mt-1 text-[15px] text-muted">{shortName(car.make)} · {t.kmBasis(km)}</p>
        <div className="mt-4"><MonthlyTag value={total} label={loan ? t.withLoan : t.runningOnly} /></div>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {lines.map((r, i) => (
            <li key={r.label} className="flex items-center justify-between gap-4 py-2.5 text-[16px]">
              <span className="flex items-center gap-2 text-ink">
                <span aria-hidden className="h-3 w-3 shrink-0 rounded-[4px]" style={{ background: COST_COLORS[i] ?? "#8c96a3" }} />{r.label}<CodeChip code={r.code} />
              </span>
              <span className="num text-[18px]">{shekel(r.value, nf)}</span>
            </li>
          ))}
          <li className="flex items-center justify-between py-2.5 text-[16px] font-bold"><span>{t.runningTotal}</span><span className="num text-[20px]">{shekel(running, nf)}</span></li>
        </ul>
      </div>
      <div>
        <button onClick={() => setLoan((v) => !v)} aria-expanded={loan} className={`${btnGhost} w-full justify-between`}>
          {loan ? t.hideLoan : t.addLoan}<ChevronDown className={`h-4 w-4 transition-transform ${loan ? "rotate-180" : ""}`} aria-hidden />
        </button>
        {loan && (
          <div className="mt-5 space-y-5">
            <Slider label={`${t.down}: ${down}% (${shekel((car.price * down) / 100, nf)})`} aside={`${t.loan}: ${shekel(principal, nf)}`} min={10} max={60} step={5} value={down} onChange={setDown} />
            <Slider label={`${t.rate}: ${rate}%`} aside={`${t.totalInterest}: ${shekel(totalInterest(payment, years, principal), nf)}`} min={2} max={12} step={0.5} value={rate} onChange={setRate} />
            <Slider label={`${years} ${t.years}`} aside={`${t.loanMonthly}: ${shekel(payment, nf)}`} min={2} max={7} step={1} value={years} onChange={setYears} />
          </div>
        )}
        {usedFormula && <p className="mt-5 text-[13px] text-muted">{t.formulaNote}</p>}
        <p className="mt-2 text-[13px] text-muted">{t.calcNote}</p>
      </div>
    </section>
  );
}
