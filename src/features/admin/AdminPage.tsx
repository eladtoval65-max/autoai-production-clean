/**
 * /admin — owner CRM for "כמה עולה": leads (search, edit, history, follow-ups, consented partner hand-off),
 * partners, campaign landing pages, funnel stats and setup. Data comes from /api/admin (password session cookie).
 * This file only handles login state and which tab is shown.
 */
import { useEffect, useState } from "react";
import { AdminHeader } from "./components/AdminHeader";
import { LoginForm } from "./components/LoginForm";
import { useAdminSession } from "./hooks/useAdminSession";
import { LandingsTab } from "./tabs/landings/LandingsTab";
import { LeadsTab } from "./tabs/leads/LeadsTab";
import { PartnersTab } from "./tabs/partners/PartnersTab";
import { SetupTab } from "./tabs/SetupTab";
import { StatsTab } from "./tabs/stats/StatsTab";
import type { AdminTab } from "./types";

export default function AdminPage() {
  const session = useAdminSession();
  const [tab, setTab] = useState<AdminTab>("leads");
  // A fresh database has no tables yet: open the setup tab so the owner can prepare it.
  useEffect(() => { if (session.status && !session.status.leadsTable) setTab("setup"); }, [session.status]);
  const loggedIn = session.phase === "in" && Boolean(session.status);

  return (
    <main dir="rtl" lang="he" className="min-h-screen bg-mist text-ink">
      <AdminHeader loggedIn={loggedIn} tab={tab} setTab={setTab} onLogout={session.logout} />
      <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-8">
        {session.phase === "checking" && <p className="text-muted">בודקים…</p>}
        {session.phase === "login" && <LoginForm error={session.error} onLogin={session.login} />}
        {loggedIn && session.status && (
          tab === "leads" ? <LeadsTab />
            : tab === "stats" ? <StatsTab />
              : tab === "partners" ? <PartnersTab />
                : tab === "landings" ? <LandingsTab />
                  : <SetupTab status={session.status} onChange={session.refresh} />
        )}
      </div>
    </main>
  );
}
