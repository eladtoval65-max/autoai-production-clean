import { Share2 } from "lucide-react";
import { useLang } from "../../../../shared/i18n";
import { btnGhost } from "../../../../shared/styles";
import { FUEL_EN, FUEL_FILTER_OPTIONS } from "../../model/fuel";

/** How results can be ordered. */
export type SortKey = "match" | "tco" | "price" | "economy";
const selectCls = "min-h-11 rounded-full border border-line bg-white px-4 text-[15px] font-semibold";

/** Explanation line + powertrain filter, sort order and share button above the results. */
export function ResultsToolbar({ fuel, setFuel, sort, setSort, onShare }: {
  fuel: string; setFuel: (v: string) => void; sort: SortKey; setSort: (v: SortKey) => void; onShare: () => void;
}) {
  const { lang, t } = useLang();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="max-w-[70ch] text-[15px] text-muted">{t.rankNote} {t.scoreNote}</p>
      <div className="flex flex-wrap gap-2">
        <select aria-label={t.powertrain} value={fuel} onChange={(e) => setFuel(e.target.value)} className={selectCls}>
          <option value="all">{t.allFuels}</option>
          {FUEL_FILTER_OPTIONS.map((f) => <option key={f} value={f}>{lang === "he" ? f : FUEL_EN[f]}</option>)}
        </select>
        <select aria-label={t.sortMatch} value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectCls}>
          <option value="match">{t.sortMatch}</option><option value="tco">{t.sortTco}</option>
          <option value="price">{t.sortPrice}</option><option value="economy">{t.sortEconomy}</option>
        </select>
        <button onClick={onShare} className={btnGhost}><Share2 className="h-4 w-4" aria-hidden />{t.share}</button>
      </div>
    </div>
  );
}
