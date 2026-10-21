import { ArrowLeft, ArrowRight, Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { shekel, useLang } from "../../../../shared/i18n";
import { shortName } from "../../../../shared/format";
import { btnGhost, card } from "../../../../shared/styles";
import { CarPhoto } from "../../../../shared/ui/CarPhoto";
import { MonthlyTag } from "../../../../shared/ui/MonthlyTag";
import { SaveBtn } from "../../../../shared/ui/SaveBtn";
import { Score } from "../../../../shared/ui/Score";
import { SubScores } from "../../../../shared/ui/SubScores";
import { useCostLadder } from "../../hooks/useCostLadder";
import { monthlyFor } from "../../model/cost";
import type { Answers, Ranked } from "../../types";
import { CostBreakdown } from "../CostBreakdown";
import { CostPanel } from "../CostPanel";
import { CostLadder } from "./CostLadder";

type Props = { car: Ranked; answers: Answers; saved: boolean; onBack: () => void; onLead: () => void; toggleSaved: (id: string) => void };

/** Key figures row: monthly cost, market price, match score. */
function KeyFigures({ car, km }: { car: Ranked; km: number }) {
  const { t, nf } = useLang();
  return (
    <dl className={`${card} mt-5 grid grid-cols-3 divide-x divide-line rtl:divide-x-reverse`}>
      <div className="min-w-0 p-4"><dt className="text-[13px] font-semibold text-muted">{t.monthlyOwn}</dt><dd className="m-0 mt-1"><MonthlyTag value={monthlyFor(car, km)} size="sm" /></dd></div>
      <div className="min-w-0 p-4"><dt className="text-[13px] font-semibold text-muted">{t.marketPrice}</dt><dd className="num m-0 mt-1 text-[19px]"><bdi>{car.marketRange ?? shekel(car.price, nf)}</bdi></dd></div>
      <div className="min-w-0 p-4"><dt className="text-[13px] font-semibold text-muted">{t.matchScore}</dt><dd className="m-0 mt-1"><Score value={car.match} compact /></dd></div>
    </dl>
  );
}

/** Pros (green ticks) and cons (red crosses). */
function ProsCons({ car }: { car: Ranked }) {
  const { t } = useLang();
  if (!car.pros.length && !car.cons.length) return null;
  return (
    <section className={`${card} p-6`}>
      <h4 className="text-[1.2rem]">{t.prosCons}</h4>
      <ul className="mt-3 space-y-2 text-[16px]">
        {car.pros.map((p) => <li key={p} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-go" strokeWidth={3} aria-hidden />{p}</li>)}
        {car.cons.map((c) => <li key={c} className="flex gap-2.5"><X className="mt-1 h-4 w-4 shrink-0 text-alert" strokeWidth={3} aria-hidden />{c}</li>)}
      </ul>
    </section>
  );
}

/** Dark panel: insurance estimate range (never a quote) + lead and calculator actions. */
function InsurancePanel({ car, costOpen, onLead, onToggleCost }: { car: Ranked; costOpen: boolean; onLead: () => void; onToggleCost: () => void }) {
  const { t, nf } = useLang();
  const range = car.insuranceMin && car.insuranceMax ? <>{shekel(car.insuranceMin, nf)}–{shekel(car.insuranceMax, nf)}</> : "–";
  return (
    <section className="rounded-2xl bg-ink p-6 text-white">
      <h4 className="text-[1.2rem]">{t.insuranceEst}</h4>
      <p className="num mt-2 text-[30px] text-[#5fd3a7]"><bdi>{range}</bdi></p>
      <p className="text-[14px] text-[#c3cbd6]">{t.insuranceWho} · {t.insuranceNote}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={onLead} className="inline-flex min-h-11 items-center rounded-full bg-[#5fd3a7] px-5 text-[15px] font-bold text-ink hover:bg-[#7fe0bb]">{t.continueLead}</button>
        <button onClick={onToggleCost} aria-expanded={costOpen} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#4a5a70] px-4 text-[15px] font-bold text-white hover:border-white">
          {t.costCalc}<ChevronDown className={`h-4 w-4 transition-transform ${costOpen ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </div>
    </section>
  );
}

/** Full page for one car: photo, key figures, cost breakdown and ladder, overview scores, pros/cons, insurance. */
export function DetailView({ car, answers, saved, onBack, onLead, toggleSaved }: Props) {
  const { t, dir } = useLang();
  const [costOpen, setCostOpen] = useState(false);
  const ladder = useCostLadder(car);
  const Back = dir === "rtl" ? ArrowRight : ArrowLeft;
  const km = answers.annualKm;

  return (
    <div>
      <button onClick={onBack} className={btnGhost}><Back className="h-4 w-4" aria-hidden />{t.backToResults}</button>
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <CarPhoto name={car.make} className="aspect-[16/10] w-full rounded-3xl" width={1280} eager />
          <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[clamp(1.6rem,3vw,2.1rem)] leading-tight">{shortName(car.make)}</h3>
              <p className="mt-1 text-[15px] text-muted"><bdi>{car.years}</bdi></p>
            </div>
            <SaveBtn on={saved} onClick={() => toggleSaved(car.id)} />
          </div>
          <KeyFigures car={car} km={km} />
          <div className="mt-6"><CostBreakdown car={car} km={km} /></div>
          {ladder && <CostLadder ladder={ladder} />}
          {car.dataNote && <p className="mt-6 text-[13px] leading-6 text-muted">{car.dataNote}</p>}
          {car.href && <a href={car.href} className="mt-3 inline-block text-[15px] font-bold text-go underline underline-offset-4">בעיות מוכרות, מנועים וצריכה — עמוד הדגם המלא ←</a>}
        </div>
        <div className="min-w-0 space-y-6">
          <section className={`${card} p-6`}>
            <h4 className="text-[1.2rem]">{t.overview}</h4>
            <p className="mt-2 text-[16px] leading-7">{car.why}</p>
            {car.estimatedScores && <p className="mt-3 text-[13px] text-muted">הציונים משוערים מנתונים חלקיים: Euro NCAP, צריכה, קריאות שירות ובעיות מדווחות.</p>}
            <div className="mt-4"><SubScores items={[[t.reliability, car.reliability], [t.safety, car.safety], [t.economy, car.economy], [t.comfort, car.comfort]]} /></div>
          </section>
          <ProsCons car={car} />
          <InsurancePanel car={car} costOpen={costOpen} onLead={onLead} onToggleCost={() => setCostOpen((v) => !v)} />
        </div>
      </div>
      {costOpen && <CostPanel car={car} answers={answers} />}
    </div>
  );
}
