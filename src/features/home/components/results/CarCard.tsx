import { Star } from "lucide-react";
import { shekel, useLang } from "../../../../shared/i18n";
import { shortName, ten } from "../../../../shared/format";
import { btnGhost, card } from "../../../../shared/styles";
import { CarPhoto } from "../../../../shared/ui/CarPhoto";
import { MonthlyTag } from "../../../../shared/ui/MonthlyTag";
import { SaveBtn } from "../../../../shared/ui/SaveBtn";
import { monthlyFor } from "../../model/cost";
import { FUEL_EN } from "../../model/fuel";
import type { Ranked } from "../../types";
import { CompareToggle } from "./CompareToggle";

type Props = { car: Ranked; rank: number; km: number; saved: boolean; inCompare: boolean; onSave: () => void; onCompare: () => void; onDetails: () => void };

/** One of the runner-up matches (#2…#7): photo, rank, powertrain, price, monthly cost and actions. */
export function CarCard({ car, rank, km, saved, inCompare, onSave, onCompare, onDetails }: Props) {
  const { lang, t, nf } = useLang();
  return (
    <article className={`${card} flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-float)]`}>
      <div className="relative">
        <CarPhoto name={car.make} className="aspect-[16/10] w-full" width={800} />
        <span className="absolute start-3 top-3 rounded-full bg-white px-2.5 py-0.5 text-[13px] font-bold text-ink shadow-[var(--shadow-card)]">
          #{rank} · <Star className="inline h-3.5 w-3.5 -translate-y-px fill-[#f5a524] text-[#f5a524]" aria-hidden /> {ten(car.match).toFixed(1)}
        </span>
        <div className="absolute end-3 top-3"><SaveBtn on={saved} onClick={onSave} small /></div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <h3 className="truncate text-[1.2rem] leading-tight">{shortName(car.make)}</h3>
        {car.condition === "used" && <p className="mt-0.5 text-[13px] font-semibold text-go"><bdi>{car.years.split(" · ")[0]}</bdi> · יד שנייה · מחיר משוער</p>}
        <p className="mt-0.5 text-[14px] text-muted">
          {lang === "he" ? car.fuel : FUEL_EN[car.fuel] ?? car.fuel} · <span className="num text-[15px]"><bdi>{car.marketRange ?? shekel(car.price, nf)}</bdi></span>
        </p>
        <div className="mt-3"><MonthlyTag value={monthlyFor(car, km)} size="sm" /></div>
        <div className="mt-auto flex gap-2 pt-4">
          <button onClick={onDetails} className={`${btnGhost} flex-1`}>{t.details}</button>
          <CompareToggle active={inCompare} onClick={onCompare} className="flex-1" />
        </div>
      </div>
    </article>
  );
}
