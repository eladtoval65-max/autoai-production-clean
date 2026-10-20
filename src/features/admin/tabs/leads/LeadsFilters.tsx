import { AlarmClock, Search } from "lucide-react";
import { LEAD_TYPE, STATUS } from "../../labels";
import { pillSelect } from "../../styles";
import type { LeadFilters } from "./useLeads";

/** Search box + status / type / period selects + "follow up today" toggle. */
export function LeadsFilters({ value, onChange }: { value: LeadFilters; onChange: (f: LeadFilters) => void }) {
  const set = <K extends keyof LeadFilters>(k: K, v: LeadFilters[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <label className="relative min-w-[240px] flex-1">
        <span className="sr-only">חיפוש</span>
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input value={value.q} onChange={(e) => set("q", e.target.value)} placeholder="חיפוש לפי שם, טלפון, רכב או עיר" className="min-h-11 w-full rounded-full border border-line bg-white ps-9 pe-4 text-[15px] outline-none focus:border-go" />
      </label>
      <select value={value.status} onChange={(e) => set("status", e.target.value)} className={pillSelect} aria-label="סינון לפי סטטוס">
        <option value="">כל הסטטוסים</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <select value={value.type} onChange={(e) => set("type", e.target.value)} className={pillSelect} aria-label="סינון לפי סוג">
        <option value="">כל הסוגים</option>{Object.entries(LEAD_TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <select value={value.days} onChange={(e) => set("days", e.target.value)} className={pillSelect} aria-label="טווח זמן">
        <option value="">כל הזמן</option><option value="1">היום</option><option value="7">7 ימים</option><option value="30">30 יום</option><option value="90">90 יום</option>
      </select>
      <button onClick={() => set("dueOnly", !value.dueOnly)} aria-pressed={value.dueOnly} className={`${pillSelect} inline-flex items-center gap-1.5 ${value.dueOnly ? "border-alert bg-[#fff4e8] text-alert" : ""}`}>
        <AlarmClock className="h-4 w-4" aria-hidden />לחזור היום
      </button>
    </div>
  );
}
