import { Check } from "lucide-react";
import { shekel, useLang } from "../../../../shared/i18n";
import { shortName } from "../../../../shared/format";
import { card } from "../../../../shared/styles";
import { Score } from "../../../../shared/ui/Score";
import { SubScores } from "../../../../shared/ui/SubScores";
import { useCostLadder } from "../../hooks/useCostLadder";
import { energyPerKm, monthlyFor } from "../../model/cost";
import type { Answers, Ranked } from "../../types";
import { CostBreakdown } from "../CostBreakdown";

/** Petrol energy cost per km, the baseline for the "you save on fuel" insight. */
const PETROL_PER_KM = energyPerKm("בנזין");

/** Yearly fuel saving versus an equivalent petrol car (0 for petrol cars). */
const yearlyFuelSaving = (car: Ranked, km: number) => (car.fuel !== "בנזין" ? Math.round((PETROL_PER_KM - energyPerKm(car.fuel)) * km) : 0);

const Tick = () => <Check className="mt-1.5 h-4 w-4 shrink-0 text-go" strokeWidth={3} aria-hidden />;

/** "Analysis" tab for the top pick: score, 3-year cost, cost per km, sub-scores, breakdown and plain-language insights. */
export function AnalysisView({ car, answers }: { car: Ranked; answers: Answers }) {
  const { t, nf } = useLang();
  const ladder = useCostLadder(car);
  const band = answers.annualKmBand === "low" ? "km7000" : answers.annualKmBand === "high" ? "km25000" : "km15000";
  const monthly = ladder?.[band]?.totalMonthly ?? monthlyFor(car, answers.annualKm);
  const perKm = (monthly * 12) / answers.annualKm;
  const saving = yearlyFuelSaving(car, answers.annualKm);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className={`${card} p-6`}>
        <h3 className="text-[1.4rem]">{shortName(car.make)}</h3>
        <dl className="mt-4 grid grid-cols-3 gap-3">
          <div className="min-w-0 rounded-xl bg-mist p-3"><dt className="text-[13px] font-semibold text-muted">{t.analysisScore}</dt><dd className="m-0 mt-1"><Score value={car.match} compact /></dd></div>
          <div className="min-w-0 rounded-xl bg-mist p-3"><dt className="text-[13px] font-semibold text-muted">{t.cost3y}</dt><dd className="num m-0 text-[21px]">{shekel(monthly * 36, nf)}</dd></div>
          <div className="min-w-0 rounded-xl bg-mist p-3"><dt className="text-[13px] font-semibold text-muted">{t.perKm}</dt><dd className="num m-0 text-[21px]"><bdi>₪{perKm.toFixed(2)}</bdi></dd></div>
        </dl>
        <div className="mt-6"><SubScores items={[[t.reliability, car.reliability], [t.economy, car.economy], [t.safety, car.safety], [t.comfort, car.comfort]]} /></div>
        <div className="mt-8"><CostBreakdown car={car} km={answers.annualKm} /></div>
      </section>
      <section className={`${card} p-6`}>
        <h3 className="text-[1.4rem]">{t.insights}</h3>
        <ul className="mt-4 space-y-3 text-[16px] leading-7">
          <li className="flex gap-2.5"><Tick />{car.why}</li>
          {saving > 0 && <li className="flex gap-2.5"><Tick />{t.fuelSaving(shekel(saving, nf), shekel(saving * 3, nf))}</li>}
          <li className="flex gap-2.5"><Tick />{t.checkBefore}</li>
        </ul>
      </section>
    </div>
  );
}
