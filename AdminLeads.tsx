/**
 * /admin — owner CRM for "כמה עולה": leads (search, filter, edit, notes & call history, follow-ups,
 * consented partner hand-off), partners, owner-editable landing pages, and funnel statistics.
 * All data goes through /api/admin (password session cookie). Partner hand-off requires a recorded,
 * separate customer consent; the API rejects it otherwise.
 */
import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { AlarmClock, Check, Download, ExternalLink, LogOut, MessageCircle, Phone, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";

type Status = { dbConfigured: boolean; dbReachable: boolean; leadsTable: boolean; schemaErrors?: string[]; contactEmail: boolean; emailAlerts: boolean; chatKey: boolean };
type Lead = {
  id: number; fullName: string; phone: string; city: string | null; leadType: string; vehicleLabel: string; budget: number | null;
  purchaseTimeline: string; sourcePage: string; utmSource: string | null; utmMedium: string | null; utmCampaign: string | null; landingSlug: string | null;
  status: string; followUpAt: string | null; partnerId: number | null; partnerName: string | null; partnerConsentAt: string | null; partnerConsentNote: string | null;
  partnerSentAt: string | null; partnerPrice: number | null; partnerPaid: number | boolean; consentText: string; consentAt: string; createdAt: string; noteCount: number;
};
type Note = { id: number; kind: string; body: string; createdAt: string };
type Partner = { id: number; name: string; type: string; contactName: string | null; phone: string | null; email: string | null; region: string | null; pricePerLead: number | null; active: number | boolean; notes: string | null; leadCount: number; paidTotal: number; owedTotal: number };
type LandingRow = { id: number; slug: string; title: string; subtitle: string | null; bullets: string | null; ctaText: string | null; leadType: string; active: number | boolean; leadCount: number; visits: number };
type Stats = {
  days: number; byDay: { d: string; n: number }[]; byStatus: { k: string; n: number }[]; byType: { k: string; n: number }[]; bySource: { k: string; n: number }[];
  funnel: { k: string; n: number }[]; money: { paid: number; owed: number }; followUpsDue: number;
};

const TYPE: Record<string, string> = { vehicle: "בירור על רכב", financing: "מימון", insurance: "ביטוח", trade_in: "טרייד-אין", used_car: "יד שנייה", test_drive: "נסיעת מבחן" };
const WHEN: Record<string, string> = { now: "בקרוב", three_months: "3 חודשים", later: "בהמשך השנה", unsure: "לא החליט/ה" };
const STATUS: Record<string, string> = { new: "חדש", contacted: "נוצר קשר", qualified: "רלוונטי", sent_to_partner: "הועבר לשותף", won: "נסגרה עסקה", lost: "לא רלוונטי", closed: "סגור" };
const STATUS_TONE: Record<string, string> = { new: "bg-go-soft text-go-deep", contacted: "bg-[#e8f0fb] text-[#1f5fae]", qualified: "bg-[#efeafc] text-[#4b3bb0]", sent_to_partner: "bg-[#fff1df] text-[#9a4b00]", won: "bg-go text-white", lost: "bg-mist text-muted", closed: "bg-mist text-muted" };
const NOTE_KIND: Record<string, string> = { note: "הערה", call: "שיחה", whatsapp: "וואטסאפ", email: "מייל", meeting: "פגישה", status: "סטטוס", partner: "שותף" };
const PARTNER_TYPE: Record<string, string> = { dealer: "סוכנות", importer: "יבואן", finance: "מימון", insurance: "ביטוח", inspection: "בדיקת רכב", trade_in: "טרייד-אין", used_lot: "מגרש יד 2", other: "אחר" };
const FUNNEL: Record<string, string> = { visit: "כניסות לאתר", quiz_start: "התחילו שאלון", quiz_complete: "סיימו שאלון", results_view: "צפו בתוצאות", lead_open: "פתחו טופס", lead_submit: "השאירו פרטים" };

const card = "rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]";
const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-bold disabled:opacity-50";
const btnGo = `${btn} bg-go text-white hover:bg-go-deep`;
const btnLine = `${btn} border border-line bg-white hover:border-ink`;
const field = "mt-1 block min-h-11 w-full rounded-xl border border-line bg-white px-3 text-[16px] outline-none focus:border-go";
const nf = new Intl.NumberFormat("he-IL");
const money = (n: number | null | undefined) => (n == null ? "—" : `₪${nf.format(Number(n))}`);
const when = (d: string | null) => (d ? new Date(d).toLocaleString("he-IL", { dateStyle: "short", timeStyle: "short" }) : "—");
const toLocalInput = (d: string | null) => { if (!d) return ""; const x = new Date(d); return new Date(x.getTime() - x.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
const intl = (p: string) => (p.startsWith("0") ? `972${p.slice(1)}` : p);

function csvCell(value: unknown) {
  const text = String(value ?? "").replace(/[\r\n]+/g, " ");
  const safe = /^[=+@\-\t]/.test(text) ? `'${text}` : text; // spreadsheet formula-injection guard
  return `"${safe.replace(/"/g, '""')}"`;
}

async function api(action: string, body?: Record<string, unknown>, query?: Record<string, string>) {
  const qs = new URLSearchParams({ action, ...(query ?? {}) }).toString();
  const res = body
    ? await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, ...body }), credentials: "same-origin" })
    : await fetch(`/api/admin?${qs}`, { credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

const ERR: Record<string, string> = {
  consent_required: "חובה לסמן שהלקוח הסכים ולתעד איך ומתי (לפחות כמה מילים).", bad_phone: "מספר טלפון לא תקין (05XXXXXXXX).", bad_name: "שם קצר מדי.",
  bad_partner: "צריך שם וסוג שותף.", bad_landing: "כתובת (באנגלית, אותיות קטנות ומקפים) וכותרת של 3 תווים לפחות.", use_assign: "העברה לשותף נעשית דרך ״העברה לשותף״ עם תיעוד הסכמה.",
  partner_not_found: "השותף לא נמצא או לא פעיל.", confirm_required: "צריך לאשר מחיקה.",
};
const errText = (r: { status: number; data: any }) => ERR[r.data?.error] ?? `הפעולה נכשלה (${r.data?.code ?? r.data?.error ?? r.status}).`;

// ─── Shell ───────────────────────────────────────────────────────────────────
type Tab = "leads" | "partners" | "landings" | "stats" | "setup";
const TABS: [Tab, string][] = [["leads", "פניות"], ["stats", "נתונים ומשפך"], ["partners", "שותפים"], ["landings", "דפי נחיתה"], ["setup", "הגדרות"]];

export default function AdminLeads() {
  const [phase, setPhase] = useState<"checking" | "login" | "in">("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [tab, setTab] = useState<Tab>("leads");

  const check = useCallback(async () => {
    const s = await api("status");
    if (s.status === 401) { setPhase("login"); if (s.data?.adminConfigured === false) setError("ADMIN_PASSWORD עוד לא הוגדר ב-Vercel."); return; }
    setPhase("in"); setStatus(s.data as Status);
    if (!s.data?.leadsTable) setTab("setup");
  }, []);
  useEffect(() => { void check(); }, [check]);

  async function login(e: FormEvent) {
    e.preventDefault(); setError("");
    const r = await api("login", { password });
    if (r.ok) { setPassword(""); await check(); }
    else setError(r.status === 429 ? "יותר מדי ניסיונות. נסו שוב בעוד דקה." : r.status === 503 ? "ADMIN_PASSWORD עוד לא הוגדר ב-Vercel." : "סיסמה שגויה.");
  }
  async function logout() { await api("logout", {}); setPhase("login"); setStatus(null); }

  return (
    <main dir="rtl" lang="he" className="min-h-screen bg-mist text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-ink no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-go font-display text-lg font-bold text-white">₪</span>
            <span className="font-display text-lg font-bold">כמה עולה · ניהול</span>
          </Link>
          {phase === "in" && <button onClick={logout} className={btnLine}><LogOut className="h-4 w-4" aria-hidden />יציאה</button>}
        </div>
        {phase === "in" && (
          <nav className="mx-auto flex max-w-[1320px] gap-1 overflow-x-auto px-4 sm:px-8" aria-label="אזורי ניהול">
            {TABS.map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)} aria-current={tab === k ? "page" : undefined}
                className={`min-h-12 shrink-0 border-b-[3px] px-4 text-[15px] font-bold ${tab === k ? "border-go text-ink" : "border-transparent text-muted hover:text-ink"}`}>{label}</button>
            ))}
          </nav>
        )}
      </header>

      <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-8">
        {phase === "checking" && <p className="text-muted">בודקים…</p>}
        {phase === "login" && (
          <form onSubmit={login} className={`${card} mx-auto mt-10 max-w-md p-6`}>
            <h1 className="text-2xl">כניסה לניהול</h1>
            <label className="mt-5 block text-[15px] font-semibold">סיסמת ניהול
              <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className={field} />
            </label>
            {error && <p role="alert" className="mt-3 text-[15px] font-semibold text-alert">{error}</p>}
            <button type="submit" className={`${btnGo} mt-5 w-full`}>כניסה</button>
          </form>
        )}
        {phase === "in" && status && (
          tab === "leads" ? <LeadsTab /> :
          tab === "stats" ? <StatsTab /> :
          tab === "partners" ? <PartnersTab /> :
          tab === "landings" ? <LandingsTab /> :
          <SetupTab status={status} onChange={check} />
        )}
      </div>
    </main>
  );
}

// ─── Setup ───────────────────────────────────────────────────────────────────
function SetupTab({ status, onChange }: { status: Status; onChange: () => Promise<void> }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const checks: [boolean, string, string][] = [
    [status.dbConfigured, "חיבור למסד נתונים", "להוסיף DATABASE_URL ב-Vercel ולבצע Redeploy."],
    [status.dbReachable, "מסד הנתונים זמין", "לבדוק שמחרוזת החיבור נכונה ושה-cluster פעיל."],
    [status.leadsTable, "טבלאות מוכנות", "ללחוץ על ״הכנת מסד הנתונים״ למטה."],
    [status.contactEmail, "מייל לקבלת פניות", "להוסיף AUTOAI_CONTACT_EMAIL ב-Vercel."],
    [status.emailAlerts, "התראה מיידית במייל", "להוסיף RESEND_API_KEY ב-Vercel."],
    [status.chatKey, "מפתח לצ׳אט", "להוסיף ANTHROPIC_API_KEY ב-Vercel."],
  ];
  async function init() { setBusy(true); setError(""); const r = await api("init", {}); if (!r.ok) setError(errText(r)); await onChange(); setBusy(false); }
  return (
    <section className={`${card} p-6`}>
      <h1 className="text-2xl">מצב ההגדרה</h1>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {checks.map(([ok, label, fix]) => (
          <li key={label} className={`flex gap-3 rounded-xl p-3 ${ok ? "bg-go-soft" : "bg-[#fff4e8]"}`}>
            {ok ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-go" aria-hidden /> : <X className="mt-0.5 h-5 w-5 shrink-0 text-alert" aria-hidden />}
            <span><span className="block font-bold">{label}</span>{!ok && <span className="block text-[14px] text-muted">{fix}</span>}</span>
          </li>
        ))}
      </ul>
      {!!status.schemaErrors?.length && (
        <p role="alert" className="mt-4 rounded-xl bg-[#fff4e8] p-3 text-[14px] text-alert">
          חלק משדרוגי מסד הנתונים לא הצליחו ({status.schemaErrors.join(", ")}). אפשר ללחוץ שוב על הכפתור למטה; אם זה חוזר, לשלוח את הקודים האלה.
        </p>
      )}
      {status.dbReachable && <button onClick={init} disabled={busy} className={`${btnGo} mt-5`}>הכנת מסד הנתונים / עדכון מבנה</button>}
      {error && <p role="alert" className="mt-3 text-[15px] font-semibold text-alert">{error}</p>}
    </section>
  );
}

// ─── Leads ───────────────────────────────────────────────────────────────────
function StatusPill({ s }: { s: string }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-bold ${STATUS_TONE[s] ?? "bg-mist"}`}>{STATUS[s] ?? s}</span>;
}

function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState(""), [st, setSt] = useState(""), [type, setType] = useState(""), [due, setDue] = useState(false), [days, setDays] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setBusy(true);
    const query: Record<string, string> = {};
    if (q.trim()) query.q = q.trim(); if (st) query.status = st; if (type) query.type = type; if (due) query.followUp = "due"; if (days) query.days = days;
    const r = await api("leads", undefined, query);
    if (r.ok) { setLeads(r.data.leads ?? []); setError(""); } else setError(errText(r));
    setBusy(false);
  }, [q, st, type, due, days]);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  function download() {
    if (!leads.length) return;
    const rows = [["מספר", "שם", "טלפון", "עיר", "סוג פנייה", "רכב", "תקציב", "מועד רכישה", "סטטוס", "מקור", "קמפיין", "שותף", "מחיר ליד", "שולם", "תאריך", "נוסח הסכמה", "זמן הסכמה", "הסכמה לשותף"],
      ...leads.map((r) => [r.id, r.fullName, r.phone, r.city, TYPE[r.leadType] ?? r.leadType, r.vehicleLabel, r.budget, WHEN[r.purchaseTimeline] ?? r.purchaseTimeline, STATUS[r.status] ?? r.status,
        r.utmSource || r.landingSlug || r.sourcePage, r.utmCampaign, r.partnerName, r.partnerPrice, r.partnerPaid ? "כן" : "", r.createdAt, r.consentText, r.consentAt, r.partnerConsentNote])];
    const csv = "﻿" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
    const href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = href; a.download = `camaola-leads-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  }

  const now = Date.now();
  const dueCount = leads.filter((l) => l.followUpAt && new Date(l.followUpAt).getTime() <= now && !["won", "lost", "closed"].includes(l.status)).length;
  const newCount = leads.filter((l) => l.status === "new").length;
  const sel = "min-h-11 rounded-full border border-line bg-white px-3 text-[15px] font-semibold";

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl">פניות</h1>
          <p className="mt-1 text-[15px] text-muted">{leads.length} פניות{newCount > 0 && <> · <b className="text-go-deep">{newCount} חדשות</b></>}{dueCount > 0 && <> · <b className="text-alert">{dueCount} לחזור אליהן</b></>}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={busy} className={btnLine}><RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} aria-hidden />רענון</button>
          <button onClick={download} disabled={!leads.length} className={btnLine}><Download className="h-4 w-4" aria-hidden />CSV</button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[240px] flex-1">
          <span className="sr-only">חיפוש</span>
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש לפי שם, טלפון, רכב או עיר" className="min-h-11 w-full rounded-full border border-line bg-white ps-9 pe-4 text-[15px] outline-none focus:border-go" />
        </label>
        <select value={st} onChange={(e) => setSt(e.target.value)} className={sel} aria-label="סינון לפי סטטוס"><option value="">כל הסטטוסים</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select value={type} onChange={(e) => setType(e.target.value)} className={sel} aria-label="סינון לפי סוג"><option value="">כל הסוגים</option>{Object.entries(TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select value={days} onChange={(e) => setDays(e.target.value)} className={sel} aria-label="טווח זמן"><option value="">כל הזמן</option><option value="1">היום</option><option value="7">7 ימים</option><option value="30">30 יום</option><option value="90">90 יום</option></select>
        <button onClick={() => setDue(!due)} aria-pressed={due} className={`${sel} inline-flex items-center gap-1.5 ${due ? "border-alert bg-[#fff4e8] text-alert" : ""}`}><AlarmClock className="h-4 w-4" aria-hidden />לחזור היום</button>
      </div>
      {error && <p role="alert" className="mt-3 font-semibold text-alert">{error}</p>}

      {leads.length === 0 && !busy ? (
        <div className="mt-5 rounded-2xl border-2 border-dashed border-line bg-white px-6 py-12 text-center text-muted">אין פניות שמתאימות לסינון. אפשר להשאיר פנייה מהאתר כבדיקה.</div>
      ) : (
        <div className={`${card} mt-5 overflow-x-auto`}>
          <table className="w-full min-w-[960px] text-[15px]">
            <thead><tr className="border-b border-line text-[13px] text-muted">{["#", "נוצר", "שם", "טלפון", "סוג ורכב", "מקור", "סטטוס", "מעקב"].map((c) => <th key={c} className="p-3 text-start font-semibold">{c}</th>)}</tr></thead>
            <tbody>
              {leads.map((l) => {
                const overdue = l.followUpAt && new Date(l.followUpAt).getTime() <= now && !["won", "lost", "closed"].includes(l.status);
                return (
                  <tr key={l.id} onClick={() => setOpenId(l.id)} className={`cursor-pointer border-b border-line last:border-0 hover:bg-mist/70 ${l.status === "new" ? "bg-go-soft/30" : ""}`}>
                    <td className="p-3 text-muted">{l.id}</td>
                    <td className="whitespace-nowrap p-3 text-muted">{when(l.createdAt)}</td>
                    <td className="p-3"><button className="text-start font-bold hover:text-go-deep" onClick={(e) => { e.stopPropagation(); setOpenId(l.id); }}>{l.fullName}</button>{l.city && <span className="block text-[13px] text-muted">{l.city}</span>}</td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}><span className="flex items-center gap-2" dir="ltr">
                      <a href={`tel:${l.phone}`} aria-label="התקשרות" className="flex h-9 w-9 items-center justify-center rounded-full bg-go text-white"><Phone className="h-4 w-4" /></a>
                      <a href={`https://wa.me/${intl(l.phone)}`} target="_blank" rel="noopener noreferrer" aria-label="וואטסאפ" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366] text-white"><MessageCircle className="h-4 w-4" /></a>
                      <span>{l.phone}</span></span></td>
                    <td className="p-3">{TYPE[l.leadType] ?? l.leadType}<span className="block text-[13px] text-muted">{l.vehicleLabel}</span></td>
                    <td className="p-3 text-[14px]">{l.utmSource || (l.landingSlug ? `/go/${l.landingSlug}` : l.sourcePage)}{l.utmCampaign && <span className="block text-[12px] text-muted">{l.utmCampaign}</span>}</td>
                    <td className="p-3"><StatusPill s={l.status} />{l.partnerName && <span className="mt-1 block text-[12px] text-muted">{l.partnerName}</span>}</td>
                    <td className={`whitespace-nowrap p-3 text-[14px] ${overdue ? "font-bold text-alert" : "text-muted"}`}>{l.followUpAt ? when(l.followUpAt) : "—"}{Number(l.noteCount) > 0 && <span className="block text-[12px] font-normal text-muted">{l.noteCount} רשומות</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-[13px] text-muted">הפניות נשמרות לטיפול פנימי. העברה לשותף רק אחרי הסכמה נפרדת ומתועדת של הלקוח. קובץ ה-CSV כולל פרטים אישיים: לשמור במקום מוגן.</p>
      {openId !== null && <LeadPanel id={openId} onClose={() => setOpenId(null)} onChanged={load} />}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[14px] font-semibold text-muted">{label}{children}</label>;
}

function LeadPanel({ id, onClose, onChanged }: { id: number; onClose: () => void; onChanged: () => void }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [noteKind, setNoteKind] = useState("call"), [noteBody, setNoteBody] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [assign, setAssign] = useState({ partnerId: "", price: "", consent: false, note: "" });

  const load = useCallback(async () => {
    const r = await api("lead", undefined, { id: String(id) });
    if (!r.ok) { setMsg({ ok: false, text: errText(r) }); return; }
    const l = r.data.lead as Lead;
    setLead(l); setNotes(r.data.notes ?? []);
    setForm({ fullName: l.fullName, phone: l.phone, city: l.city ?? "", vehicleLabel: l.vehicleLabel, budget: l.budget == null ? "" : String(l.budget), leadType: l.leadType, purchaseTimeline: l.purchaseTimeline, followUpAt: toLocalInput(l.followUpAt), partnerPrice: l.partnerPrice == null ? "" : String(l.partnerPrice) });
  }, [id]);
  useEffect(() => { void load(); void api("partners").then((r) => r.ok && setPartners((r.data.partners ?? []).filter((p: Partner) => Number(p.active)))); }, [load]);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);

  async function run(action: string, body: Record<string, unknown>, okText: string) {
    const r = await api(action, { id, ...body });
    setMsg(r.ok ? { ok: true, text: okText } : { ok: false, text: errText(r) });
    if (r.ok) { await load(); onChanged(); }
    return r.ok;
  }
  const save = (e: FormEvent) => {
    e.preventDefault();
    const fields: Record<string, unknown> = { ...form, followUpAt: form.followUpAt ? new Date(form.followUpAt).toISOString() : null };
    delete fields.partnerPrice;
    return run("leadUpdate", { fields }, "נשמר");
  };
  const setStatus = (s: string) => run("leadUpdate", { fields: { status: s } }, "הסטטוס עודכן");
  const followIn = (days: number) => { const d = new Date(); d.setDate(d.getDate() + days); d.setHours(10, 0, 0, 0); return run("leadUpdate", { fields: { followUpAt: d.toISOString() } }, "נקבעה תזכורת"); };
  async function addNote(e: FormEvent) { e.preventDefault(); if (noteBody.trim() && await run("noteAdd", { kind: noteKind, body: noteBody }, "נרשם")) setNoteBody(""); }
  async function doAssign(e: FormEvent) {
    e.preventDefault();
    if (await run("assign", { partnerId: Number(assign.partnerId), price: assign.price, consent: assign.consent, consentNote: assign.note }, "הועבר לשותף")) setAssign({ partnerId: "", price: "", consent: false, note: "" });
  }
  async function del() { if (window.confirm("למחוק את הפנייה וכל ההיסטוריה שלה? אי אפשר לבטל.") && await run("leadDelete", { confirm: true }, "נמחק")) onClose(); }
  const set = (k: string) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside role="dialog" aria-modal="true" aria-label={`פנייה ${id}`} className="h-full w-full max-w-[640px] overflow-y-auto bg-white shadow-[var(--shadow-float)]">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-white px-5 py-4">
          <div className="min-w-0">
            <p className="text-[13px] text-muted">פנייה #{id}{lead && <> · {when(lead.createdAt)}</>}</p>
            <h2 className="truncate text-xl">{lead?.fullName ?? "…"}</h2>
          </div>
          <button onClick={onClose} aria-label="סגירה" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-mist hover:border-ink"><X className="h-4 w-4" /></button>
        </div>
        {lead && (
          <div className="space-y-6 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <a href={`tel:${lead.phone}`} className={btnGo}><Phone className="h-4 w-4" />התקשרות</a>
              <a href={`https://wa.me/${intl(lead.phone)}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#25d366] text-white`}><MessageCircle className="h-4 w-4" />וואטסאפ</a>
              <StatusPill s={lead.status} />
            </div>
            {msg && <p role="status" className={`rounded-xl px-3 py-2 text-[15px] font-semibold ${msg.ok ? "bg-go-soft text-go-deep" : "bg-[#fff4e8] text-alert"}`}>{msg.text}</p>}

            <section>
              <h3 className="text-[17px]">סטטוס</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(STATUS).filter(([k]) => k !== "sent_to_partner").map(([k, v]) => (
                  <button key={k} onClick={() => setStatus(k)} aria-pressed={lead.status === k} className={`min-h-10 rounded-full border px-3.5 text-[14px] font-bold ${lead.status === k ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}>{v}</button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-mist p-4">
              <h3 className="flex items-center gap-2 text-[17px]"><AlarmClock className="h-4 w-4" />תזכורת לחזור</h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {[[1, "מחר"], [3, "בעוד 3 ימים"], [7, "בעוד שבוע"]].map(([d, l]) => <button key={d} onClick={() => followIn(d as number)} className="min-h-10 rounded-full border border-line bg-white px-3.5 text-[14px] font-bold hover:border-ink">{l}</button>)}
                {lead.followUpAt && <><span className="text-[14px] text-muted">נקבע: <b className="text-ink">{when(lead.followUpAt)}</b></span><button onClick={() => run("leadUpdate", { fields: { followUpAt: null } }, "התזכורת בוטלה")} className="text-[14px] font-bold text-muted underline">ביטול</button></>}
              </div>
            </section>

            <section>
              <h3 className="text-[17px]">תיעוד שיחה או הערה</h3>
              <form onSubmit={addNote} className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {["call", "whatsapp", "email", "meeting", "note"].map((k) => <button type="button" key={k} onClick={() => setNoteKind(k)} aria-pressed={noteKind === k} className={`min-h-9 rounded-full border px-3 text-[14px] font-bold ${noteKind === k ? "border-go bg-go-soft text-go-deep" : "border-line bg-white"}`}>{NOTE_KIND[k]}</button>)}
                </div>
                <textarea value={noteBody} onChange={(e) => setNoteBody(e.target.value)} rows={3} maxLength={4000} placeholder="מה נאמר? מה הצעד הבא?" className="block w-full rounded-xl border border-line p-3 text-[16px] outline-none focus:border-go" />
                <button type="submit" disabled={!noteBody.trim()} className={btnGo}>הוספה להיסטוריה</button>
              </form>
              <ol className="mt-4 space-y-3 border-s-2 border-line ps-4">
                {notes.length === 0 && <li className="text-[14px] text-muted">אין עדיין היסטוריה.</li>}
                {notes.map((n) => (
                  <li key={n.id} className="relative">
                    <span className="absolute -start-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-go" aria-hidden />
                    <p className="text-[13px] text-muted"><b className="text-ink">{NOTE_KIND[n.kind] ?? n.kind}</b> · {when(n.createdAt)}</p>
                    <p className="whitespace-pre-wrap text-[15px]">{n.kind === "status" ? `הסטטוס שונה ל״${STATUS[n.body] ?? n.body}״` : n.body}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="rounded-2xl border border-line p-4">
              <h3 className="text-[17px]">העברה לשותף</h3>
              {lead.partnerId ? (
                <div className="mt-2 space-y-3 text-[15px]">
                  <p>הועבר ל<b>{lead.partnerName}</b> · {when(lead.partnerSentAt)}</p>
                  <p className="rounded-xl bg-mist p-3 text-[14px]"><b>תיעוד הסכמה:</b> {lead.partnerConsentNote} <span className="text-muted">({when(lead.partnerConsentAt)})</span></p>
                  <div className="flex flex-wrap items-end gap-2">
                    <Field label="מחיר הליד (₪)"><input inputMode="numeric" value={form.partnerPrice} onChange={set("partnerPrice")} className={`${field} w-32`} dir="ltr" /></Field>
                    <button onClick={() => run("leadUpdate", { fields: { partnerPrice: form.partnerPrice } }, "המחיר נשמר")} className={btnLine}>שמירה</button>
                    <label className="flex min-h-11 items-center gap-2 font-semibold"><input type="checkbox" checked={Boolean(Number(lead.partnerPaid))} onChange={(e) => run("leadUpdate", { fields: { partnerPaid: e.target.checked } }, "עודכן")} className="h-5 w-5 accent-[#0a7c59]" />שולם</label>
                  </div>
                  <button onClick={() => run("unassign", {}, "השיוך בוטל")} className="text-[14px] font-bold text-muted underline">ביטול השיוך</button>
                </div>
              ) : partners.length === 0 ? (
                <p className="mt-2 text-[15px] text-muted">עוד אין שותפים פעילים. אפשר להוסיף בלשונית ״שותפים״.</p>
              ) : (
                <form onSubmit={doAssign} className="mt-2 space-y-3">
                  <p className="text-[14px] text-muted">הלקוח הסכים רק שנציג ״כמה עולה״ יחזור אליו. לפני העברה לעסק אחר צריך לקבל ממנו הסכמה מפורשת ולתעד אותה כאן.</p>
                  <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
                    <Field label="שותף"><select required value={assign.partnerId} onChange={(e) => { const p = partners.find((x) => String(x.id) === e.target.value); setAssign((a) => ({ ...a, partnerId: e.target.value, price: p?.pricePerLead == null ? a.price : String(p.pricePerLead) })); }} className={field}><option value="">בחירה…</option>{partners.map((p) => <option key={p.id} value={p.id}>{p.name} · {PARTNER_TYPE[p.type] ?? p.type}</option>)}</select></Field>
                    <Field label="מחיר (₪)"><input inputMode="numeric" dir="ltr" value={assign.price} onChange={(e) => setAssign((a) => ({ ...a, price: e.target.value }))} className={field} /></Field>
                  </div>
                  <Field label="איך ומתי הלקוח הסכים?"><input required minLength={5} maxLength={300} value={assign.note} onChange={(e) => setAssign((a) => ({ ...a, note: e.target.value }))} placeholder="לדוגמה: אישר בשיחה טלפונית 19/10 שהסוכנות תתקשר" className={field} /></Field>
                  <label className="flex items-start gap-2 text-[15px] font-semibold"><input type="checkbox" required checked={assign.consent} onChange={(e) => setAssign((a) => ({ ...a, consent: e.target.checked }))} className="mt-1 h-5 w-5 accent-[#0a7c59]" />אני מאשר/ת שהלקוח הסכים במפורש להעברת פרטיו לשותף הזה</label>
                  <button type="submit" disabled={!assign.consent || !assign.partnerId || assign.note.trim().length < 5} className={btnGo}>העברה לשותף</button>
                </form>
              )}
            </section>

            <form onSubmit={save} className="space-y-3">
              <h3 className="text-[17px]">פרטי הפנייה</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="שם"><input value={form.fullName ?? ""} onChange={set("fullName")} className={field} /></Field>
                <Field label="טלפון"><input value={form.phone ?? ""} onChange={set("phone")} dir="ltr" className={field} /></Field>
                <Field label="עיר"><input value={form.city ?? ""} onChange={set("city")} className={field} /></Field>
                <Field label="תקציב (₪)"><input value={form.budget ?? ""} onChange={set("budget")} inputMode="numeric" dir="ltr" className={field} /></Field>
                <Field label="רכב / נושא"><input value={form.vehicleLabel ?? ""} onChange={set("vehicleLabel")} className={field} /></Field>
                <Field label="סוג פנייה"><select value={form.leadType} onChange={set("leadType")} className={field}>{Object.entries(TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
                <Field label="מועד רכישה"><select value={form.purchaseTimeline} onChange={set("purchaseTimeline")} className={field}>{Object.entries(WHEN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
                <Field label="תזכורת (תאריך ושעה)"><input type="datetime-local" value={form.followUpAt ?? ""} onChange={set("followUpAt")} className={field} /></Field>
              </div>
              <button type="submit" className={btnGo}>שמירת שינויים</button>
            </form>

            <section className="rounded-2xl bg-mist p-4 text-[14px]">
              <p><b>מקור:</b> {lead.sourcePage}{lead.landingSlug && ` · /go/${lead.landingSlug}`}{lead.utmSource && ` · ${lead.utmSource}`}{lead.utmMedium && ` / ${lead.utmMedium}`}{lead.utmCampaign && ` · ${lead.utmCampaign}`}</p>
              <p className="mt-2"><b>הסכמה מקורית</b> ({when(lead.consentAt)}): <span className="text-muted">{lead.consentText}</span></p>
            </section>

            <button onClick={del} className="inline-flex items-center gap-2 text-[14px] font-bold text-alert"><Trash2 className="h-4 w-4" />מחיקת הפנייה (למשל לבקשת הלקוח)</button>
          </div>
        )}
      </aside>
    </div>
  );
}

// ─── Partners ────────────────────────────────────────────────────────────────
const EMPTY_PARTNER = { id: 0, name: "", type: "dealer", contactName: "", phone: "", email: "", region: "", pricePerLead: "", active: true, notes: "" };

function PartnersTab() {
  const [rows, setRows] = useState<Partner[]>([]);
  const [edit, setEdit] = useState<typeof EMPTY_PARTNER | null>(null);
  const [err, setErr] = useState("");
  const load = useCallback(async () => { const r = await api("partners"); if (r.ok) setRows(r.data.partners ?? []); }, []);
  useEffect(() => { void load(); }, [load]);
  async function save(e: FormEvent) {
    e.preventDefault(); if (!edit) return;
    const r = await api("partnerSave", { partner: { ...edit, id: edit.id || undefined } });
    if (r.ok) { setEdit(null); setErr(""); await load(); } else setErr(errText(r));
  }
  const set = (k: keyof typeof EMPTY_PARTNER) => (e: { target: { value: string } }) => setEdit((p) => (p ? { ...p, [k]: e.target.value } : p));

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl">שותפים</h1><p className="mt-1 text-[15px] text-muted">סוכנויות, יבואנים, מימון, ביטוח ובדיקות רכב שמקבלים לידים בהסכמת הלקוח.</p></div>
        <button onClick={() => setEdit({ ...EMPTY_PARTNER })} className={btnGo}><Plus className="h-4 w-4" />שותף חדש</button>
      </div>
      {edit && (
        <form onSubmit={save} className={`${card} mt-5 grid gap-3 p-5 sm:grid-cols-3`}>
          <Field label="שם העסק"><input required value={edit.name} onChange={set("name")} className={field} /></Field>
          <Field label="סוג"><select value={edit.type} onChange={set("type")} className={field}>{Object.entries(PARTNER_TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
          <Field label="אזור"><input value={edit.region} onChange={set("region")} className={field} /></Field>
          <Field label="איש קשר"><input value={edit.contactName} onChange={set("contactName")} className={field} /></Field>
          <Field label="טלפון"><input value={edit.phone} onChange={set("phone")} dir="ltr" className={field} /></Field>
          <Field label="מייל"><input type="email" value={edit.email} onChange={set("email")} dir="ltr" className={field} /></Field>
          <Field label="מחיר לליד (₪)"><input inputMode="numeric" value={String(edit.pricePerLead ?? "")} onChange={set("pricePerLead")} dir="ltr" className={field} /></Field>
          <label className="flex min-h-11 items-center gap-2 self-end font-semibold"><input type="checkbox" checked={Boolean(edit.active)} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} className="h-5 w-5 accent-[#0a7c59]" />פעיל</label>
          <Field label="הערות (תנאי הסכם, שעות)"><input value={edit.notes} onChange={set("notes")} className={field} /></Field>
          {err && <p role="alert" className="font-semibold text-alert sm:col-span-3">{err}</p>}
          <div className="flex gap-2 sm:col-span-3"><button type="submit" className={btnGo}>שמירה</button><button type="button" onClick={() => setEdit(null)} className={btnLine}>ביטול</button></div>
        </form>
      )}
      {rows.length === 0 ? (
        <div className="mt-5 rounded-2xl border-2 border-dashed border-line bg-white px-6 py-12 text-center text-muted">אין עדיין שותפים.</div>
      ) : (
        <div className={`${card} mt-5 overflow-x-auto`}>
          <table className="w-full min-w-[820px] text-[15px]">
            <thead><tr className="border-b border-line text-[13px] text-muted">{["שם", "סוג", "איש קשר", "מחיר לליד", "לידים", "שולם", "פתוח לגבייה", ""].map((c, i) => <th key={i} className="p-3 text-start font-semibold">{c}</th>)}</tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className={`border-b border-line last:border-0 ${Number(p.active) ? "" : "text-muted"}`}>
                  <td className="p-3 font-bold">{p.name}{!Number(p.active) && <span className="ms-2 text-[12px] font-normal">(לא פעיל)</span>}{p.region && <span className="block text-[13px] font-normal text-muted">{p.region}</span>}</td>
                  <td className="p-3">{PARTNER_TYPE[p.type] ?? p.type}</td>
                  <td className="p-3">{p.contactName ?? "—"}{p.phone && <span className="block text-[13px] text-muted" dir="ltr">{p.phone}</span>}</td>
                  <td className="num p-3">{money(p.pricePerLead)}</td>
                  <td className="num p-3">{p.leadCount}</td>
                  <td className="num p-3 text-go-deep">{money(p.paidTotal)}</td>
                  <td className="num p-3">{money(p.owedTotal)}</td>
                  <td className="p-3"><button onClick={() => setEdit({ ...EMPTY_PARTNER, ...p, contactName: p.contactName ?? "", phone: p.phone ?? "", email: p.email ?? "", region: p.region ?? "", notes: p.notes ?? "", pricePerLead: p.pricePerLead == null ? "" : String(p.pricePerLead), active: Boolean(Number(p.active)) })} className="font-bold text-go-deep underline">עריכה</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ─── Landing pages ───────────────────────────────────────────────────────────
const EMPTY_LANDING = { slug: "", title: "", subtitle: "", bullets: "", ctaText: "", leadType: "vehicle", active: true };

function LandingsTab() {
  const [rows, setRows] = useState<LandingRow[]>([]);
  const [edit, setEdit] = useState<typeof EMPTY_LANDING | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [err, setErr] = useState("");
  const load = useCallback(async () => { const r = await api("landings"); if (r.ok) setRows(r.data.landings ?? []); }, []);
  useEffect(() => { void load(); }, [load]);
  async function save(e: FormEvent) {
    e.preventDefault(); if (!edit) return;
    const r = await api("landingSave", { landing: { ...edit, bullets: edit.bullets.split("\n").map((b) => b.trim()).filter(Boolean) } });
    if (r.ok) { setEdit(null); setErr(""); await load(); } else setErr(errText(r));
  }
  const set = (k: keyof typeof EMPTY_LANDING) => (e: { target: { value: string } }) => setEdit((p) => (p ? { ...p, [k]: e.target.value } : p));
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl">דפי נחיתה</h1><p className="mt-1 text-[15px] text-muted">דפים לקמפיינים בכתובת /go/שם-הדף. הלידים מהם מסומנים לפי הדף והקמפיין.</p></div>
        <button onClick={() => { setEdit({ ...EMPTY_LANDING }); setIsNew(true); }} className={btnGo}><Plus className="h-4 w-4" />דף חדש</button>
      </div>
      {edit && (
        <form onSubmit={save} className={`${card} mt-5 grid gap-3 p-5 lg:grid-cols-2`}>
          <Field label="כתובת (אנגלית, אותיות קטנות ומקפים)"><input required pattern="[a-z0-9\-]{2,60}" disabled={!isNew} value={edit.slug} onChange={set("slug")} placeholder="hybrid-family" dir="ltr" className={field} /></Field>
          <Field label="סוג הפנייה שייפתח בטופס"><select value={edit.leadType} onChange={set("leadType")} className={field}>{Object.entries(TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
          <Field label="כותרת ראשית"><input required minLength={3} maxLength={160} value={edit.title} onChange={set("title")} placeholder="רכב משפחתי היברידי שעולה פחות בחודש" className={field} /></Field>
          <Field label="טקסט על הכפתור"><input maxLength={80} value={edit.ctaText} onChange={set("ctaText")} placeholder="רוצים שנחזור אליכם?" className={field} /></Field>
          <Field label="תת-כותרת"><textarea maxLength={400} rows={3} value={edit.subtitle} onChange={set("subtitle")} className="mt-1 block w-full rounded-xl border border-line p-3 text-[16px] outline-none focus:border-go" /></Field>
          <Field label="נקודות (שורה לכל נקודה, עד 6)"><textarea rows={3} value={edit.bullets} onChange={set("bullets")} className="mt-1 block w-full rounded-xl border border-line p-3 text-[16px] outline-none focus:border-go" /></Field>
          <label className="flex min-h-11 items-center gap-2 font-semibold"><input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} className="h-5 w-5 accent-[#0a7c59]" />הדף פעיל</label>
          <p className="self-center text-[13px] text-muted">אין להבטיח מחירים או הנחות שלא אומתו. ביטוח מוצג תמיד כהערכה בלבד.</p>
          {err && <p role="alert" className="font-semibold text-alert lg:col-span-2">{err}</p>}
          <div className="flex gap-2 lg:col-span-2"><button type="submit" className={btnGo}>שמירה ופרסום</button><button type="button" onClick={() => setEdit(null)} className={btnLine}>ביטול</button></div>
        </form>
      )}
      {rows.length === 0 ? (
        <div className="mt-5 rounded-2xl border-2 border-dashed border-line bg-white px-6 py-12 text-center text-muted">אין עדיין דפי נחיתה.</div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {rows.map((r) => {
            const conv = Number(r.visits) > 0 ? Math.round((Number(r.leadCount) / Number(r.visits)) * 1000) / 10 : null;
            let bullets: string[] = []; try { bullets = JSON.parse(r.bullets || "[]"); } catch { /* */ }
            return (
              <article key={r.id} className={`${card} p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><h2 className="text-lg">{r.title}</h2><p className="text-[14px] text-muted" dir="ltr">/go/{r.slug}</p></div>
                  {!Number(r.active) && <span className="rounded-full bg-mist px-2.5 py-0.5 text-[13px] font-bold text-muted">כבוי</span>}
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-mist p-2"><dt className="text-[12px] text-muted">כניסות</dt><dd className="num text-xl">{nf.format(Number(r.visits))}</dd></div>
                  <div className="rounded-xl bg-mist p-2"><dt className="text-[12px] text-muted">לידים</dt><dd className="num text-xl">{nf.format(Number(r.leadCount))}</dd></div>
                  <div className="rounded-xl bg-mist p-2"><dt className="text-[12px] text-muted">המרה</dt><dd className="num text-xl">{conv == null ? "—" : `${conv}%`}</dd></div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => { setEdit({ slug: r.slug, title: r.title, subtitle: r.subtitle ?? "", bullets: bullets.join("\n"), ctaText: r.ctaText ?? "", leadType: r.leadType, active: Boolean(Number(r.active)) }); setIsNew(false); }} className={btnLine}>עריכה</button>
                  <a href={`/go/${r.slug}`} target="_blank" rel="noopener noreferrer" className={btnLine}><ExternalLink className="h-4 w-4" />צפייה</a>
                  <button onClick={() => navigator.clipboard?.writeText(`${origin}/go/${r.slug}?utm_source=facebook&utm_medium=cpc&utm_campaign=${r.slug}`)} className={btnLine}>העתקת קישור לקמפיין</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

// ─── Stats ───────────────────────────────────────────────────────────────────
function Bars({ rows, label }: { rows: { k: string; n: number }[]; label: (k: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => Number(r.n)));
  if (!rows.length) return <p className="text-[14px] text-muted">אין נתונים בטווח הזה.</p>;
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.k} className="grid grid-cols-[110px_1fr_44px] items-center gap-2 text-[14px]">
          <span className="truncate">{label(r.k)}</span>
          <span className="h-3 rounded-full bg-mist"><span className="block h-3 rounded-full bg-go" style={{ width: `${(Number(r.n) / max) * 100}%` }} /></span>
          <span className="num text-end">{nf.format(Number(r.n))}</span>
        </li>
      ))}
    </ul>
  );
}

function StatsTab() {
  const [days, setDays] = useState(30);
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState("");
  useEffect(() => { void api("stats", undefined, { days: String(days) }).then((r) => (r.ok ? setS(r.data) : setErr(errText(r)))); }, [days]);

  const series = useMemo(() => {
    if (!s) return [];
    const map = new Map(s.byDay.map((r) => [String(r.d).slice(0, 10), Number(r.n)]));
    return Array.from({ length: s.days }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (s.days - 1 - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return { key, label: `${d.getDate()}/${d.getMonth() + 1}`, n: map.get(key) ?? 0 };
    });
  }, [s]);

  if (err) return <p role="alert" className="font-semibold text-alert">{err}</p>;
  if (!s) return <p className="text-muted">טוען…</p>;
  const total = s.byStatus.reduce((a, r) => a + Number(r.n), 0);
  const won = Number(s.byStatus.find((r) => r.k === "won")?.n ?? 0);
  const visits = s.funnel[0]?.n ?? 0, submits = s.funnel[s.funnel.length - 1]?.n ?? 0;
  const maxDay = Math.max(1, ...series.map((r) => r.n));
  const maxFunnel = Math.max(1, ...s.funnel.map((r) => r.n));
  const kpis: [string, string, string?][] = [
    ["לידים", nf.format(total)],
    ["המרה מביקור לליד", visits ? `${Math.round((submits / visits) * 1000) / 10}%` : "—", visits ? `${nf.format(submits)} מתוך ${nf.format(visits)} מבקרים` : "עוד אין מספיק ביקורים"],
    ["עסקאות שנסגרו", nf.format(won), total ? `${Math.round((won / total) * 100)}% מהלידים` : undefined],
    ["הכנסה משותפים", money(Number(s.money.paid)), `פתוח לגבייה: ${money(Number(s.money.owed))}`],
    ["לחזור היום", nf.format(s.followUpsDue)],
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl">נתונים ומשפך</h1>
        <div className="flex gap-1 rounded-full border border-line bg-white p-1" role="group" aria-label="טווח">
          {[7, 30, 90].map((d) => <button key={d} onClick={() => setDays(d)} aria-pressed={days === d} className={`min-h-9 rounded-full px-4 text-[14px] font-bold ${days === d ? "bg-ink text-white" : "text-muted"}`}>{d} ימים</button>)}
        </div>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map(([k, v, sub]) => (
          <div key={k} className={`${card} p-4`}><dt className="text-[14px] text-muted">{k}</dt><dd className="num mt-1 text-[1.9rem] leading-none">{v}</dd>{sub && <dd className="mt-2 text-[13px] text-muted">{sub}</dd>}</div>
        ))}
      </dl>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <section className={`${card} p-5`}>
          <h2 className="text-lg">משפך המרה</h2>
          <p className="text-[13px] text-muted">מבקרים ייחודיים (לפי לשונית דפדפן) בכל שלב. ללא מידע אישי.</p>
          <ol className="mt-4 space-y-2.5">
            {s.funnel.map((r, i) => {
              const prev = i ? s.funnel[i - 1].n : 0;
              return (
                <li key={r.k} className="grid grid-cols-[120px_1fr_96px] items-center gap-2 text-[14px]">
                  <span>{FUNNEL[r.k] ?? r.k}</span>
                  <span className="h-7 rounded-lg bg-mist"><span className="block h-7 rounded-lg bg-go" style={{ width: `${Math.max(r.n ? 2 : 0, (r.n / maxFunnel) * 100)}%` }} /></span>
                  <span className="text-end"><span className="num">{nf.format(r.n)}</span>{i > 0 && prev > 0 && <span className="ms-1 text-[12px] text-muted">({Math.round((r.n / prev) * 100)}%)</span>}</span>
                </li>
              );
            })}
          </ol>
        </section>
        <section className={`${card} p-5`}>
          <h2 className="text-lg">לידים לפי יום</h2>
          <div className="mt-4 flex h-40 items-end gap-[2px]" role="img" aria-label={`לידים ב-${s.days} הימים האחרונים, סך הכל ${total}`}>
            {series.map((r) => <span key={r.key} title={`${r.label}: ${r.n}`} className="flex-1 rounded-t-[3px] bg-go" style={{ height: `${(r.n / maxDay) * 100}%`, minHeight: r.n ? 3 : 1, opacity: r.n ? 1 : 0.15 }} />)}
          </div>
          <div className="mt-1 flex justify-between text-[12px] text-muted"><span>{series[0]?.label}</span><span>היום</span></div>
        </section>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <section className={`${card} p-5`}><h2 className="mb-3 text-lg">לפי סטטוס</h2><Bars rows={s.byStatus} label={(k) => STATUS[k] ?? k} /></section>
        <section className={`${card} p-5`}><h2 className="mb-3 text-lg">לפי סוג פנייה</h2><Bars rows={s.byType} label={(k) => TYPE[k] ?? k} /></section>
        <section className={`${card} p-5`}><h2 className="mb-3 text-lg">לפי מקור</h2><Bars rows={s.bySource} label={(k) => k} /></section>
      </div>
    </section>
  );
}
