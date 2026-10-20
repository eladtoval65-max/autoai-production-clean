import { Download, RefreshCw } from "lucide-react";
import { useState } from "react";
import { EmptyBox } from "../../components/EmptyBox";
import { isOverdue } from "../../format";
import { CLOSED_STATUSES } from "../../labels";
import { btnLine } from "../../styles";
import { downloadLeadsCsv } from "./exportCsv";
import { LeadsFilters } from "./LeadsFilters";
import { LeadsTable } from "./LeadsTable";
import { LeadPanel } from "./panel/LeadPanel";
import { EMPTY_FILTERS, useLeads, type LeadFilters } from "./useLeads";

/** "Leads" tab: counters, refresh/CSV actions, filters, the table, and the side panel for the opened lead. */
export function LeadsTab() {
  const [filters, setFilters] = useState<LeadFilters>(EMPTY_FILTERS);
  const [openId, setOpenId] = useState<number | null>(null);
  const { leads, busy, error, reload } = useLeads(filters);
  const newCount = leads.filter((l) => l.status === "new").length;
  const dueCount = leads.filter((l) => isOverdue(l.followUpAt, l.status, CLOSED_STATUSES)).length;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl">פניות</h1>
          <p className="mt-1 text-[15px] text-muted">
            {leads.length} פניות{newCount > 0 && <> · <b className="text-go-deep">{newCount} חדשות</b></>}{dueCount > 0 && <> · <b className="text-alert">{dueCount} לחזור אליהן</b></>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={reload} disabled={busy} className={btnLine}><RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} aria-hidden />רענון</button>
          <button onClick={() => downloadLeadsCsv(leads)} disabled={!leads.length} className={btnLine}><Download className="h-4 w-4" aria-hidden />CSV</button>
        </div>
      </div>
      <LeadsFilters value={filters} onChange={setFilters} />
      {error && <p role="alert" className="mt-3 font-semibold text-alert">{error}</p>}
      {leads.length === 0 && !busy ? <EmptyBox text="אין פניות שמתאימות לסינון. אפשר להשאיר פנייה מהאתר כבדיקה." /> : <LeadsTable leads={leads} onOpen={setOpenId} />}
      <p className="mt-4 text-[13px] text-muted">הפניות נשמרות לטיפול פנימי. העברה לשותף רק אחרי הסכמה נפרדת ומתועדת של הלקוח. קובץ ה-CSV כולל פרטים אישיים: לשמור במקום מוגן.</p>
      {openId !== null && <LeadPanel id={openId} onClose={() => setOpenId(null)} onChanged={reload} />}
    </section>
  );
}
