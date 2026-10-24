import type { Generation, ModelLine } from "../../../data/generations";
import { factsFor } from "../../../data/facts";
import { card } from "../../../shared/styles";
import { genYears, hpText, POWERTRAIN_HE } from "../model/labels";
import { monthlyEnergy } from "../model/energy";
import { prosConsFor } from "../model/prosCons";
import { EnginesTable } from "./facts/EnginesTable";
import { IssuesList } from "./facts/IssuesList";
import { MaintenanceList } from "./facts/MaintenanceList";
import { ProsConsBox } from "./facts/ProsConsBox";
import { SourceLink } from "./facts/SourceLink";
import { NcapStars } from "./NcapStars";

/** Consumption line (fallback when no per-engine data yet): kWh for EV-only generations, otherwise litres. */
const consumptionText = (g: Generation) =>
  g.pt[0] === "ev" ? `${g.cons} קוט"ש ל-100 ק"מ` : `${g.cons} ל' ל-100 ק"מ (כ-${Math.round((100 / g.cons) * 10) / 10} ק"מ לליטר)`;

/**
 * One generation: years and code, Euro NCAP, engines with real-world consumption and monthly fuel cost,
 * powertrains, launch price, pros/cons derived from that data, sourced known issues + what to check before buying,
 * and costly maintenance items to budget for.
 */
export function GenerationCard({ gen, makeId, model }: { gen: Generation; makeId: string; model: ModelLine }) {
  const f = factsFor(makeId, model.id, gen.code);
  const engines = f.engines ?? [];
  const ncap = f.ncap?.stars != null ? { ...gen, ncap: f.ncap.stars, ncapYear: f.ncap.year ?? gen.ncapYear } : gen;
  const ev = gen.pt[0] === "ev";
  return (
    <li className={`${card} p-5 sm:p-6`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl">{genYears(gen.from, gen.to)} <span className="text-[15px] font-semibold text-muted" dir="ltr">{gen.code}</span></h3>
        <span className="inline-flex items-center gap-2"><NcapStars gen={ncap} />{f.ncap?.url && <SourceLink source={{ title: "Euro NCAP", url: f.ncap.url }} />}</span>
      </div>
      {engines.length ? <EnginesTable engines={engines} /> : (
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-[15px] sm:grid-cols-3">
          <div><dt className="text-[13px] text-muted">מנועים</dt><dd>{gen.engines}</dd></div>
          <div><dt className="text-[13px] text-muted">הספק (כ"ס)</dt><dd className="num font-normal">{hpText(gen.hp)}</dd></div>
          <div><dt className="text-[13px] text-muted">צריכה ממוצעת בפועל (הערכה)</dt><dd>{consumptionText(gen)} · <bdi>≈₪{monthlyEnergy(gen.cons, ev ? "kWh" : "L", 15000).toLocaleString("he-IL")}</bdi> בחודש ב־15,000 ק״מ</dd></div>
        </dl>
      )}
      <p className="mt-3 flex flex-wrap items-center gap-1.5">
        {gen.pt.map((p) => <span key={p} className="rounded-full bg-mist px-2.5 py-0.5 text-[13px] font-semibold">{POWERTRAIN_HE[p]}</span>)}
        {f.launchPrice && <span className="ms-2 text-[14px] text-muted">מחיר בהשקה בישראל ({f.launchPrice.year}): <bdi>₪{f.launchPrice.ils.toLocaleString("he-IL")}</bdi> <SourceLink source={f.launchPrice.source} /></span>}
      </p>
      {gen.note && <p className="mt-3 text-[15px] text-muted">{gen.note}</p>}
      <ProsConsBox pc={prosConsFor(model, gen, f)} />
      <IssuesList issues={f.issues ?? []} checks={gen.checks} />
      <MaintenanceList items={f.maintenance ?? []} />
    </li>
  );
}
