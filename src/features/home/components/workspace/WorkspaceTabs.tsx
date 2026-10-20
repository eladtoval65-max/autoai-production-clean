import { useLang } from "../../../../shared/i18n";
import type { Tab } from "../../types";

/** Pill tab bar for the workspace. The "detail" view counts as part of "results". */
export function WorkspaceTabs({ tab, setTab, savedCount, compareCount }: { tab: Tab; setTab: (t: Tab) => void; savedCount: number; compareCount: number }) {
  const { t } = useLang();
  const tabs: [Tab, string][] = [
    ["results", t.tabResults], ["saved", `${t.tabSaved} (${savedCount})`], ["compare", `${t.tabCompare} (${compareCount})`],
    ["analysis", t.tabAnalysis], ["tools", t.tabTools],
  ];
  return (
    <div role="tablist" className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-mist p-1 text-[15px] font-bold">
      {tabs.map(([id, label]) => {
        const on = tab === id || (id === "results" && tab === "detail");
        return (
          <button key={id} role="tab" aria-selected={on} onClick={() => setTab(id)}
            className={`min-h-10 shrink-0 whitespace-nowrap rounded-full px-4 ${on ? "bg-white text-ink shadow-[var(--shadow-card)]" : "text-muted hover:text-ink"}`}>{label}</button>
        );
      })}
    </div>
  );
}
