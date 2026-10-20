import { useEffect, useState } from "react";
import { adminApi, errorText } from "../../api";
import { LEAD_TYPE, STATUS } from "../../labels";
import type { Stats } from "../../types";
import { BreakdownBars } from "./BreakdownBars";
import { DailyLeadsChart } from "./DailyLeadsChart";
import { FunnelChart } from "./FunnelChart";
import { KpiTiles } from "./KpiTiles";

const RANGES = [7, 30, 90];

/** Sends the weekly email now (it also goes out by itself every Sunday morning). */
function ReportNowButton() {
  const [msg, setMsg] = useState("");
  async function send() {
    setMsg("שולח…");
    const r = await adminApi<{ result: string }>("reportNow", {});
    setMsg(!r.ok ? errorText(r) : r.data.result === "sent" ? "הדוח נשלח למייל" : "לא נשלח — חסר RESEND_API_KEY או מייל קשר");
  }
  return <span className="flex items-center gap-2 text-[14px]"><button onClick={send} className="min-h-9 rounded-full border border-line bg-white px-4 font-bold">דוח שבועי למייל עכשיו</button><span role="status" className="text-muted">{msg}</span></span>;
}

/** "Stats & funnel" tab: range picker, KPI tiles, funnel, leads per day, and breakdowns. */
export function StatsTab() {
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { void adminApi<Stats>("stats", undefined, { days: String(days) }).then((r) => (r.ok ? setStats(r.data) : setError(errorText(r)))); }, [days]);

  if (error) return <p role="alert" className="font-semibold text-alert">{error}</p>;
  if (!stats) return <p className="text-muted">טוען…</p>;
  const total = stats.byStatus.reduce((a, r) => a + Number(r.n), 0);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl">נתונים ומשפך</h1><p className="mt-1 text-[14px] text-muted">דוח שבועי נשלח למייל אוטומטית בכל יום ראשון בבוקר.</p><div className="mt-2"><ReportNowButton /></div></div>
        <div className="flex gap-1 rounded-full border border-line bg-white p-1" role="group" aria-label="טווח">
          {RANGES.map((d) => <button key={d} onClick={() => setDays(d)} aria-pressed={days === d} className={`min-h-9 rounded-full px-4 text-[14px] font-bold ${days === d ? "bg-ink text-white" : "text-muted"}`}>{d} ימים</button>)}
        </div>
      </div>
      <KpiTiles stats={stats} />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <FunnelChart steps={stats.funnel} />
        <DailyLeadsChart stats={stats} total={total} />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <BreakdownBars title="לפי סטטוס" rows={stats.byStatus} label={(k) => STATUS[k] ?? k} />
        <BreakdownBars title="לפי סוג פנייה" rows={stats.byType} label={(k) => LEAD_TYPE[k] ?? k} />
        <BreakdownBars title="לפי מקור" rows={stats.bySource} label={(k) => k} />
      </div>
    </section>
  );
}
