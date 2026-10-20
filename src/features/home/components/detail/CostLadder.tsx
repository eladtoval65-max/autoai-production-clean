import { useLang } from "../../../../shared/i18n";
import { Money } from "../../../../shared/ui/Money";
import type { Ladder } from "../../types";

const BANDS = [["km7000", "7,000"], ["km15000", "15,000"], ["km25000", "25,000"]] as const;

/** Three tiles: monthly cost at 7,000 / 15,000 / 25,000 km a year (the middle one highlighted). */
export function CostLadder({ ladder }: { ladder: Ladder }) {
  const { t } = useLang();
  return (
    <div className="mt-8">
      <h4 className="text-[1.15rem]">{t.ladderTitle}</h4>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {BANDS.map(([key, label], i) => (
          <div key={key} className={`min-w-0 rounded-xl border p-3 ${i === 1 ? "border-go bg-go-soft" : "border-line"}`}>
            <div className="text-[13px] font-semibold text-muted"><bdi>{label} km</bdi></div>
            <Money v={ladder[key]?.totalMonthly} size={22} />
          </div>
        ))}
      </div>
    </div>
  );
}
