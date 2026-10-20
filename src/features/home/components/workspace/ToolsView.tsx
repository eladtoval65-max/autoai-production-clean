import type { Dispatch, SetStateAction } from "react";
import { useLang } from "../../../../shared/i18n";
import { shortName } from "../../../../shared/format";
import { card } from "../../../../shared/styles";
import { MonthlyTag } from "../../../../shared/ui/MonthlyTag";
import { monthlyFor } from "../../model/cost";
import type { Answers, Ranked } from "../../types";

/** Yearly km → the questionnaire's mileage band. */
const bandForKm = (km: number): Answers["annualKmBand"] => (km <= 10000 ? "low" : km >= 20000 ? "high" : "mid");

/** "Tools" tab: a yearly-km slider that updates the monthly cost live, and a used-car inspection checklist. */
export function ToolsView({ car, answers, setAnswers }: { car: Ranked; answers: Answers; setAnswers: Dispatch<SetStateAction<Answers>> }) {
  const { t, nf } = useLang();
  const setKm = (km: number) => setAnswers((p) => ({ ...p, annualKm: km, annualKmBand: bandForKm(km) }));
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className={`${card} p-6 sm:p-8`}>
        <h3 className="text-[1.4rem]">{t.monthlyTool}</h3>
        <p className="mt-1 text-[15px] text-muted">{t.monthlyToolSub} · {shortName(car.make)}</p>
        <div className="mt-6"><MonthlyTag value={monthlyFor(car, answers.annualKm)} /></div>
        <label className="mt-8 block text-[15px] font-semibold">
          <span className="num text-[20px]">{nf.format(answers.annualKm)}</span> {t.kmYear}
          <input type="range" min={5000} max={40000} step={1000} value={answers.annualKm} className="mt-3 block w-full" onChange={(e) => setKm(Number(e.target.value))} />
        </label>
      </section>
      <section className={`${card} p-6 sm:p-8`}>
        <h3 className="text-[1.4rem]">{t.checklist}</h3>
        <ul className="mt-4 space-y-2">
          {t.checklistItems.map((item) => (
            <li key={item}><label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl bg-mist px-3 text-[16px] font-semibold"><input type="checkbox" className="h-5 w-5" />{item}</label></li>
          ))}
        </ul>
        <p className="mt-3 text-[14px] text-muted">{t.checklistNote}</p>
      </section>
    </div>
  );
}
