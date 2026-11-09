import { ChevronDown } from "lucide-react";
import { shekel, useLang } from "../../../../shared/i18n";
import { shortName } from "../../../../shared/format";
import { btnGhost, btnPrimary, card } from "../../../../shared/styles";
import { CarPhoto } from "../../../../shared/ui/CarPhoto";
import { MonthlyTag } from "../../../../shared/ui/MonthlyTag";
import { SaveBtn } from "../../../../shared/ui/SaveBtn";
import { monthlyFor } from "../../model/cost";
import type { Ranked } from "../../types";
import { CompareToggle } from "./CompareToggle";

type Props = {
  car: Ranked; km: number; saved: boolean; inCompare: boolean; costOpen: boolean;
  onSave: () => void; onCompare: () => void; onDetails: () => void; onToggleCost: () => void;
};

/** The #1 match: large photo, monthly cost, market price, one-paragraph reasoning and actions. The cost breakdown lives behind "cost calculator" / details to keep the first look simple. */
export function TopPickCard({ car, km, saved, inCompare, costOpen, onSave, onCompare, onDetails, onToggleCost }: Props) {
  const { t, nf, lang } = useLang();
  return (
    <article className={`${card} mt-6 grid overflow-hidden lg:grid-cols-[1.15fr_1fr]`}>
      <div className="relative min-h-[260px]">
        <CarPhoto name={car.make} className="absolute inset-0 h-full w-full" width={1280} />
        <span className="absolute start-4 top-4 rounded-full bg-go px-3 py-1 text-[14px] font-bold text-white">
          {lang === "he" ? "הכי מתאים לך" : "Best match"}
        </span>
      </div>
      <div className="flex min-w-0 flex-col p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[1.6rem] leading-tight">{shortName(car.make)}</h3>
            <p className="mt-1 text-[15px] text-muted"><bdi>{car.years}</bdi></p>
          </div>
          <SaveBtn on={saved} onClick={onSave} />
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-3">
          <div><span className="block text-[13px] font-semibold text-muted">{t.monthlyOwn}</span><MonthlyTag value={monthlyFor(car, km)} size="md" /></div>
          <div><span className="block text-[13px] font-semibold text-muted">{t.marketPrice}</span><span className="num text-[22px]"><bdi>{car.marketRange ?? shekel(car.price, nf)}</bdi></span></div>
        </div>
        <p className="mt-4 text-[16px] leading-7">{car.why}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <button onClick={onDetails} className={btnPrimary}>{t.details}</button>
          <CompareToggle active={inCompare} onClick={onCompare} />
          <button onClick={onToggleCost} aria-expanded={costOpen} className={btnGhost}>
            {t.costCalc}<ChevronDown className={`h-4 w-4 transition-transform ${costOpen ? "rotate-180" : ""}`} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
