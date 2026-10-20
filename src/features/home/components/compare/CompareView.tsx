import { useLang } from "../../../../shared/i18n";
import { btnPrimary } from "../../../../shared/styles";
import { EmptyState } from "../../../../shared/ui/EmptyState";
import { useCostLadders } from "../../hooks/useCostLadder";
import { MAX_COMPARE } from "../../hooks/useShortlist";
import { monthlyGap, winnerIndex, winsPerCar } from "../../model/compare";
import type { Ranked } from "../../types";
import { AddCarPicker } from "./AddCarPicker";
import { buildCompareRows } from "./compareRows";
import { CompareTable } from "./CompareTable";
import { CompareVerdicts } from "./CompareVerdicts";

type Props = { cars: Ranked[]; all: Ranked[]; km: number; toggleCompare: (id: string) => void; onLead: () => void };

/** "Compare" tab: verdict cards, savings line, the side-by-side table with row winners, and an add-a-car picker. */
export function CompareView({ cars, all, km, toggleCompare, onLead }: Props) {
  const { lang, t, nf } = useLang();
  const he = lang === "he";
  const { ladders } = useCostLadders(cars);
  const picker = cars.length < MAX_COMPARE && <AddCarPicker options={all.filter((c) => !cars.some((x) => x.id === c.id))} onAdd={toggleCompare} />;

  if (cars.length < 2) {
    return (
      <div className="space-y-5">
        <EmptyState text={he ? "בחרו לפחות שני רכבים: לחצו ״להשוואה״ על כרטיסי הרכבים, או הוסיפו כאן." : t.emptyCompare} />
        {picker}
      </div>
    );
  }

  const rows = buildCompareRows({ t, lang, nf, km, ladders });
  const values = rows.map((r) => cars.map((c, i) => r.get(c, i)));
  const winners = rows.map((r, ri) => winnerIndex(values[ri], r.better));
  const winnerByKey = Object.fromEntries(rows.map((r, ri) => [r.key, winners[ri]]));
  const monthlyRow = rows.findIndex((r) => r.key === "monthly");

  return (
    <div className="space-y-6">
      <CompareVerdicts cars={cars} winnerByKey={winnerByKey} gap={monthlyGap(values[monthlyRow])} />
      <CompareTable cars={cars} rows={rows} values={values} winners={winners} wins={winsPerCar(winners, cars.length)} onRemove={toggleCompare} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        {picker}
        <button onClick={onLead} className={btnPrimary}>{t.continueLead}</button>
      </div>
      <p className="text-[14px] text-muted">{t.insuranceNote}</p>
    </div>
  );
}
