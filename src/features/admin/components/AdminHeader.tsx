import { LogOut } from "lucide-react";
import { BrandMark } from "../../../shared/ui/BrandMark";
import { btnLine } from "../styles";
import type { AdminTab } from "../types";

const TABS: [AdminTab, string][] = [["leads", "פניות"], ["stats", "נתונים ומשפך"], ["partners", "שותפים"], ["landings", "דפי נחיתה"], ["setup", "הגדרות"]];

/** Top bar with logo and logout; when logged in, the section tabs below it. */
export function AdminHeader({ loggedIn, tab, setTab, onLogout }: { loggedIn: boolean; tab: AdminTab; setTab: (t: AdminTab) => void; onLogout: () => void }) {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <div className="flex items-center gap-2"><BrandMark href="/" /><span className="font-display text-lg font-bold text-muted">· ניהול</span></div>
        {loggedIn && <button onClick={onLogout} className={btnLine}><LogOut className="h-4 w-4" aria-hidden />יציאה</button>}
      </div>
      {loggedIn && (
        <nav className="mx-auto flex max-w-[1320px] gap-1 overflow-x-auto px-4 sm:px-8" aria-label="אזורי ניהול">
          {TABS.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} aria-current={tab === key ? "page" : undefined}
              className={`min-h-12 shrink-0 border-b-[3px] px-4 text-[15px] font-bold ${tab === key ? "border-go text-ink" : "border-transparent text-muted hover:text-ink"}`}>{label}</button>
          ))}
        </nav>
      )}
    </header>
  );
}
