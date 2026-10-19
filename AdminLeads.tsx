import { useEffect, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { Check, Download, LogOut, MessageCircle, Phone, RefreshCw, X } from "lucide-react";

type Status = { dbConfigured: boolean; dbReachable: boolean; leadsTable: boolean; contactEmail: boolean; emailAlerts: boolean; chatKey: boolean };
type Lead = { id: number; fullName: string; phone: string; city: string | null; leadType: string; vehicleLabel: string; budget: number | null; purchaseTimeline: string; sourcePage: string; status: string; consentText: string; consentAt: string; createdAt: string };

const TYPE: Record<string, string> = { vehicle: "בירור על רכב", financing: "מימון", insurance: "ביטוח", trade_in: "טרייד-אין", used_car: "יד שנייה", test_drive: "נסיעת מבחן" };
const WHEN: Record<string, string> = { now: "בקרוב", three_months: "3 חודשים", later: "בהמשך השנה", unsure: "לא החליט/ה" };
const STATUS: Record<string, string> = { new: "חדש", contacted: "נוצר קשר", qualified: "רלוונטי", closed: "נסגר" };
const card = "rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]";
const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-bold";

function csvCell(value: unknown) {
  const text = String(value ?? "").replace(/[\r\n]+/g, " ");
  // Prevent spreadsheet formula injection when contact details are opened in Excel.
  const safe = /^[=+@\-\t]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

async function api(action: string, body?: Record<string, unknown>) {
  const res = body
    ? await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, ...body }), credentials: "same-origin" })
    : await fetch(`/api/admin?action=${action}`, { credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export default function AdminLeads() {
  const [phase, setPhase] = useState<"checking" | "login" | "in">("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    const s = await api("status");
    if (s.status === 401) { setPhase("login"); setBusy(false); if (s.data?.adminConfigured === false) setError("ADMIN_PASSWORD עוד לא הוגדר ב-Vercel."); return; }
    setPhase("in"); setStatus(s.data as Status);
    if (s.data?.leadsTable) { const l = await api("leads"); if (l.ok) setLeads(l.data.leads ?? []); }
    setBusy(false);
  }
  useEffect(() => { void load(); }, []);

  async function login(e: FormEvent) {
    e.preventDefault(); setError("");
    const r = await api("login", { password });
    if (r.ok) { setPassword(""); await load(); }
    else setError(r.status === 429 ? "יותר מדי ניסיונות. נסו שוב בעוד דקה." : r.status === 503 ? "ADMIN_PASSWORD עוד לא הוגדר ב-Vercel." : "סיסמה שגויה.");
  }
  async function init() { setBusy(true); const r = await api("init", {}); if (!r.ok) setError(`יצירת הטבלאות נכשלה (${r.data?.code ?? r.status}).`); await load(); }
  async function setLeadStatus(id: number, value: string) {
    setLeads((p) => p.map((l) => (l.id === id ? { ...l, status: value } : l)));
    const r = await api("setStatus", { id, status: value });
    if (!r.ok) { setError("עדכון הסטטוס נכשל."); await load(); }
  }
  async function logout() { await api("logout", {}); setPhase("login"); setLeads([]); setStatus(null); }
  function download() {
    if (!leads.length) return;
    const rows = [["מספר", "שם", "טלפון", "עיר", "סוג פנייה", "רכב", "תקציב", "מועד רכישה", "סטטוס", "תאריך", "נוסח הסכמה", "זמן הסכמה"],
      ...leads.map((r) => [r.id, r.fullName, r.phone, r.city, TYPE[r.leadType] ?? r.leadType, r.vehicleLabel, r.budget, WHEN[r.purchaseTimeline] ?? r.purchaseTimeline, STATUS[r.status] ?? r.status, r.createdAt, r.consentText, r.consentAt])];
    const csv = "﻿" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
    const href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = href; a.download = `autoai-leads-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  }

  const checks: [boolean, string, string][] = status ? [
    [status.dbConfigured, "חיבור למסד נתונים", "להוסיף DATABASE_URL ב-Vercel ולבצע Redeploy."],
    [status.dbReachable, "מסד הנתונים זמין", "לבדוק שמחרוזת החיבור נכונה ושה-cluster פעיל."],
    [status.leadsTable, "טבלאות נוצרו", "ללחוץ על \"יצירת טבלאות\" למטה."],
    [status.contactEmail, "מייל לקבלת פניות", "להוסיף AUTOAI_CONTACT_EMAIL ב-Vercel."],
    [status.emailAlerts, "התראה מיידית במייל", "להוסיף RESEND_API_KEY ב-Vercel."],
    [status.chatKey, "מפתח לצ'אט", "להוסיף ANTHROPIC_API_KEY ב-Vercel."],
  ] : [];
  const newCount = leads.filter((l) => l.status === "new").length;

  return (
    <main dir="rtl" lang="he" className="min-h-screen bg-mist px-4 py-10 text-ink sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-[15px] font-semibold">← חזרה לאתר</Link>
          {phase === "in" && <div className="flex gap-2">
            <button onClick={load} disabled={busy} className={`${btn} border border-line bg-white hover:border-ink disabled:opacity-50`}><RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} aria-hidden />רענון</button>
            <button onClick={logout} className={`${btn} border border-line bg-white hover:border-ink`}><LogOut className="h-4 w-4" aria-hidden />יציאה</button>
          </div>}
        </div>
        <h1 className="mt-6 text-[clamp(1.8rem,3.4vw,2.6rem)]">פניות AutoAI</h1>

        {phase === "checking" && <p className="mt-6 text-muted">בודקים…</p>}

        {phase === "login" && (
          <form onSubmit={login} className={`${card} mt-6 max-w-md p-6`}>
            <label className="block text-[15px] font-semibold">סיסמת ניהול
              <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="mt-2 block min-h-12 w-full rounded-xl border border-line px-4 text-[16px] outline-none focus:border-go" />
            </label>
            {error && <p role="alert" className="mt-3 text-[15px] font-semibold text-alert">{error}</p>}
            <button type="submit" className={`${btn} mt-5 w-full bg-go text-white hover:bg-go-deep`}>כניסה</button>
          </form>
        )}

        {phase === "in" && status && (
          <>
            <section className={`${card} mt-6 p-6`}>
              <h2 className="text-[1.25rem]">מצב ההגדרה</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {checks.map(([ok, label, fix]) => (
                  <li key={label} className={`flex gap-3 rounded-xl p-3 ${ok ? "bg-go-soft" : "bg-[#fff4e8]"}`}>
                    {ok ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-go" aria-hidden /> : <X className="mt-0.5 h-5 w-5 shrink-0 text-alert" aria-hidden />}
                    <span><span className="block font-bold">{label}</span>{!ok && <span className="block text-[14px] text-muted">{fix}</span>}</span>
                  </li>
                ))}
              </ul>
              {status.dbReachable && !status.leadsTable && (
                <button onClick={init} disabled={busy} className={`${btn} mt-5 bg-go text-white hover:bg-go-deep disabled:opacity-50`}>יצירת טבלאות</button>
              )}
              {error && <p role="alert" className="mt-3 text-[15px] font-semibold text-alert">{error}</p>}
            </section>

            {status.leadsTable && (
              <section className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[16px]"><span className="font-bold">{leads.length}</span> פניות{newCount > 0 && <> · <span className="font-bold text-go">{newCount} חדשות</span></>}</p>
                  <button onClick={download} disabled={!leads.length} className={`${btn} border border-line bg-white hover:border-ink disabled:opacity-40`}><Download className="h-4 w-4" aria-hidden />ייצוא CSV</button>
                </div>
                {leads.length === 0 ? (
                  <div className="mt-4 rounded-2xl border-2 border-dashed border-line bg-white px-6 py-12 text-center text-muted">עדיין אין פניות. כדאי לנסות להשאיר פנייה מהאתר כבדיקה.</div>
                ) : (
                  <div className={`${card} mt-4 overflow-x-auto`}>
                    <table className="w-full min-w-[900px] text-[15px]">
                      <thead><tr className="border-b border-line text-start text-[13px] text-muted">{["#", "נוצר", "שם", "טלפון", "סוג", "רכב", "תקציב", "מתי", "סטטוס"].map((c) => <th key={c} className="p-3 text-start font-semibold">{c}</th>)}</tr></thead>
                      <tbody>
                        {leads.map((l) => {
                          const intl = l.phone.startsWith("0") ? `972${l.phone.slice(1)}` : l.phone;
                          return (
                            <tr key={l.id} className={`border-b border-line last:border-0 ${l.status === "new" ? "bg-go-soft/40" : ""}`}>
                              <td className="p-3">{l.id}</td>
                              <td className="whitespace-nowrap p-3 text-muted">{new Date(l.createdAt).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" })}</td>
                              <td className="p-3 font-semibold">{l.fullName}{l.city && <span className="block text-[13px] font-normal text-muted">{l.city}</span>}</td>
                              <td className="p-3"><span className="flex items-center gap-2" dir="ltr">
                                <a href={`tel:${l.phone}`} aria-label="התקשרות" className="flex h-9 w-9 items-center justify-center rounded-full bg-go text-white"><Phone className="h-4 w-4" /></a>
                                <a href={`https://wa.me/${intl}`} target="_blank" rel="noopener noreferrer" aria-label="וואטסאפ" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366] text-white"><MessageCircle className="h-4 w-4" /></a>
                                <span>{l.phone}</span></span></td>
                              <td className="p-3">{TYPE[l.leadType] ?? l.leadType}</td>
                              <td className="p-3">{l.vehicleLabel}</td>
                              <td className="whitespace-nowrap p-3">{l.budget ? `₪${l.budget.toLocaleString("he-IL")}` : "—"}</td>
                              <td className="p-3">{WHEN[l.purchaseTimeline] ?? l.purchaseTimeline}</td>
                              <td className="p-3">
                                <select value={l.status} onChange={(e) => setLeadStatus(l.id, e.target.value)} aria-label={`סטטוס פנייה ${l.id}`} className="min-h-10 rounded-full border border-line bg-white px-3 font-semibold">
                                  {Object.entries(STATUS).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="mt-4 text-[13px] text-muted">הפניות נשמרות לטיפול פנימי בלבד. אין העברה לשותפים בלי הסכמה נפרדת. קובץ ה-CSV כולל פרטים אישיים: לשמור במקום מוגן.</p>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
