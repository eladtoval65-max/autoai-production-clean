import { useLang } from "../../../shared/i18n";
import { shortName } from "../../../shared/format";
import { card } from "../../../shared/styles";
import { CarPhoto } from "../../../shared/ui/CarPhoto";
import { MonthlyTag } from "../../../shared/ui/MonthlyTag";
import { Score } from "../../../shared/ui/Score";
import { monthlyFor } from "../model/cost";
import type { Ranked } from "../types";
import { CostBreakdown } from "./CostBreakdown";

/** Hero side panel: the current top match with photo, score, monthly cost and its breakdown. Updates live as answers change. */
export function LeaderPanel({ car, km, started }: { car: Ranked; km: number; started: boolean }) {
  const { t } = useLang();
  return (
    <aside className="relative lg:pt-2" aria-live="polite">
      <div key={car.id} className="swap">
        <CarPhoto name={car.make} eager width={1280} className="aspect-[4/3] w-full rounded-3xl lg:aspect-[16/13]" />
      </div>
      <div className={`${card} relative z-10 -mt-16 mx-3 p-5 shadow-[var(--shadow-float)] sm:mx-6 sm:p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div>
            <span className="text-[13px] font-bold text-muted">{started ? t.leaderNow : t.leaderSample}</span>
            <h2 className="mt-1 text-[clamp(1.3rem,2vw,1.6rem)] leading-tight">{shortName(car.make)}</h2>
            <div className="mt-2"><Score value={car.match} /></div>
          </div>
          <MonthlyTag value={monthlyFor(car, km)} />
        </div>
        <div className="mt-5"><CostBreakdown car={car} km={km} /></div>
      </div>
    </aside>
  );
}
