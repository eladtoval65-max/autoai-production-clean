import type { Dispatch, RefObject, SetStateAction } from "react";
import { CATALOG_UPDATED } from "../../../../data/catalogData";
import { useLang } from "../../../../shared/i18n";
import type { Answers, Car, Ranked, Tab } from "../../types";
import { CompareView } from "../compare/CompareView";
import { DetailView } from "../detail/DetailView";
import { ResultsView } from "../results/ResultsView";
import { AnalysisView } from "./AnalysisView";
import { SavedView } from "./SavedView";
import { ToolsView } from "./ToolsView";
import { WorkspaceTabs } from "./WorkspaceTabs";

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  tab: Tab; setTab: (t: Tab) => void;
  cars: Car[]; ranked: Ranked[]; leader?: Ranked; detailCar?: Ranked;
  answers: Answers; setAnswers: Dispatch<SetStateAction<Answers>>; complete: boolean;
  saved: string[]; history: string[]; compare: string[];
  toggleSaved: (id: string) => void; toggleCompare: (id: string) => void;
  onDetails: (id: string) => void; onShare: () => void; onLead: () => void;
};

/** "Your matches" section: tab bar, data notes, and whichever view the active tab shows. */
export function Workspace(p: Props) {
  const { t } = useLang();
  const isDemo = Boolean(p.cars[0]?.demo);
  const byIds = <T extends Car>(list: T[], ids: string[]) => ids.map((id) => list.find((c) => c.id === id)).filter((c): c is T => Boolean(c));

  return (
    <section id="results" ref={p.sectionRef} className="mx-auto max-w-[1280px] scroll-mt-20 px-4 pb-20 pt-14 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <h2 className="text-[clamp(1.8rem,3.2vw,2.5rem)] leading-tight">{t.workspaceTitle}</h2>
        <WorkspaceTabs tab={p.tab} setTab={p.setTab} savedCount={p.saved.length} compareCount={p.compare.length} />
      </div>
      {isDemo && <p className="mt-5 rounded-xl bg-mist px-4 py-3 text-[15px] text-muted">{t.catalogNote(p.cars.length, CATALOG_UPDATED)}</p>}
      {!p.complete && p.tab === "results" && <p className="mt-3 text-[15px] text-muted">{t.incomplete}</p>}
      <div className="mt-8">
        {p.tab === "results" && <ResultsView answers={p.answers} ranked={p.ranked} saved={p.saved} compare={p.compare} toggleSaved={p.toggleSaved} toggleCompare={p.toggleCompare} onDetails={p.onDetails} onShare={p.onShare} onLead={p.onLead} />}
        {p.tab === "detail" && p.detailCar && <DetailView car={p.detailCar} answers={p.answers} saved={p.saved.includes(p.detailCar.id)} onBack={() => p.setTab("results")} onLead={p.onLead} toggleSaved={p.toggleSaved} />}
        {p.tab === "saved" && <SavedView cars={byIds(p.cars, p.saved)} history={byIds(p.cars, p.history)} toggleSaved={p.toggleSaved} toggleCompare={p.toggleCompare} onDetails={p.onDetails} />}
        {p.tab === "compare" && <CompareView cars={byIds(p.ranked, p.compare)} all={p.ranked} km={p.answers.annualKm} toggleCompare={p.toggleCompare} onLead={p.onLead} />}
        {p.tab === "analysis" && p.leader && <AnalysisView car={p.leader} answers={p.answers} />}
        {p.tab === "tools" && p.leader && <ToolsView car={p.leader} answers={p.answers} setAnswers={p.setAnswers} />}
      </div>
    </section>
  );
}
