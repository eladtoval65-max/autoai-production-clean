import { useState } from "react";
import { useLang } from "../../../../shared/i18n";
import { EmptyState } from "../../../../shared/ui/EmptyState";
import { monthlyFor } from "../../model/cost";
import type { Answers, Ranked } from "../../types";
import { CostPanel } from "../CostPanel";
import { CarCard } from "./CarCard";
import { LeadBanner } from "./LeadBanner";
import { ResultsToolbar, type SortKey } from "./ResultsToolbar";
import { TopPickCard } from "./TopPickCard";

/** How many runner-up cards to show under the top pick. */
const RUNNERS_UP = 6;

type Props = {
  answers: Answers; ranked: Ranked[]; saved: string[]; compare: string[];
  toggleSaved: (id: string) => void; toggleCompare: (id: string) => void; onDetails: (id: string) => void; onShare: () => void; onLead: () => void;
};

/** Sort comparator for the chosen order. Monthly cost uses the user's yearly km. */
function sortBy(sort: SortKey, km: number) {
  return (a: Ranked, b: Ranked) =>
    sort === "price" ? a.price - b.price
      : sort === "economy" ? b.economy - a.economy
        : sort === "tco" ? monthlyFor(a, km) - monthlyFor(b, km)
          : b.match - a.match;
}

/** "Results" tab: toolbar, the top pick (with optional cost calculator), runner-up cards and the lead banner. */
export function ResultsView({ answers, ranked, saved, compare, toggleSaved, toggleCompare, onDetails, onShare, onLead }: Props) {
  const { t } = useLang();
  const km = answers.annualKm;
  const [costOpen, setCostOpen] = useState(false);
  const [fuel, setFuel] = useState("all");
  const [sort, setSort] = useState<SortKey>("match");

  const visible = ranked.filter((c) => fuel === "all" || c.fuel === fuel).sort(sortBy(sort, km));
  const [top, ...rest] = visible;
  const cardProps = (c: Ranked) => ({
    km, saved: saved.includes(c.id), inCompare: compare.includes(c.id),
    onSave: () => toggleSaved(c.id), onCompare: () => toggleCompare(c.id), onDetails: () => onDetails(c.id),
  });

  return (
    <div>
      <ResultsToolbar fuel={fuel} setFuel={setFuel} sort={sort} setSort={setSort} onShare={onShare} />
      {!top ? <div className="mt-6"><EmptyState text={t.emptyFilter} /></div> : (
        <>
          <TopPickCard car={top} {...cardProps(top)} costOpen={costOpen} onToggleCost={() => setCostOpen((v) => !v)} />
          {costOpen && <CostPanel car={top} answers={answers} />}
          {rest.length > 0 && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(0, RUNNERS_UP).map((c, i) => <CarCard key={c.id} car={c} rank={i + 2} {...cardProps(c)} />)}
            </div>
          )}
          <LeadBanner onLead={onLead} />
        </>
      )}
    </div>
  );
}
