import { AlertTriangle } from "lucide-react";
import type { Generation } from "../../../data/generations";
import { card } from "../../../shared/styles";
import { genYears, hpText, POWERTRAIN_HE } from "../model/labels";
import { NcapStars } from "./NcapStars";

/** Consumption line: kWh for EV-only generations, otherwise litres with the km-per-litre equivalent. */
const consumptionText = (g: Generation) =>
  g.pt[0] === "ev" ? `${g.cons} קוט"ש ל-100 ק"מ` : `${g.cons} ל' ל-100 ק"מ (כ-${Math.round((100 / g.cons) * 10) / 10} ק"מ לליטר)`;

/** One generation: years and code, Euro NCAP, engines, power, real-world consumption, powertrains, note, and what to check before buying. */
export function GenerationCard({ gen }: { gen: Generation }) {
  return (
    <li className={`${card} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl">{genYears(gen.from, gen.to)} <span className="text-[15px] font-semibold text-muted" dir="ltr">{gen.code}</span></h3>
        <NcapStars gen={gen} />
      </div>
      <dl className="mt-3 grid gap-x-6 gap-y-2 text-[15px] sm:grid-cols-3">
        <div><dt className="text-[13px] text-muted">מנועים</dt><dd>{gen.engines}</dd></div>
        <div><dt className="text-[13px] text-muted">הספק (כ"ס)</dt><dd className="num font-normal">{hpText(gen.hp)}</dd></div>
        <div><dt className="text-[13px] text-muted">צריכה ממוצעת בפועל (הערכה)</dt><dd>{consumptionText(gen)}</dd></div>
      </dl>
      <p className="mt-3 flex flex-wrap gap-1.5">{gen.pt.map((p) => <span key={p} className="rounded-full bg-mist px-2.5 py-0.5 text-[13px] font-semibold">{POWERTRAIN_HE[p]}</span>)}</p>
      {gen.note && <p className="mt-3 text-[15px] text-muted">{gen.note}</p>}
      <div className="mt-4 rounded-xl bg-[#fff8ef] p-4">
        <p className="flex items-center gap-2 text-[15px] font-bold"><AlertTriangle className="h-4 w-4 text-alert" aria-hidden />מה לבדוק לפני קנייה</p>
        <ul className="mt-2 list-disc space-y-1 ps-5 text-[15px]">{gen.checks.map((c) => <li key={c}>{c}</li>)}</ul>
      </div>
    </li>
  );
}
