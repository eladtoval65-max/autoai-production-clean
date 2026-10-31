/**
 * /partner#k=<key> — the partner's own area: the leads handed to them (with the customer's consent) and a quick
 * way to report what happened with each one. The key stays in the URL fragment and is sent only as a header.
 */
import { MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "../../shared/ui/BrandMark";

type Lead = {
  id: number; fullName: string; phone: string | null; city: string | null; leadType: string; vehicleLabel: string;
  budget: number | null; purchaseTimeline: string; detailsText: string | null; qualityScore: number | null;
  partnerSentAt: string | null; partnerOutcome: string | null; partnerNote: string | null;
};
type Data = { partner: { name: string; type: string }; leads: Lead[]; outcomes: Record<string, string> };

const TYPE_HE: Record<string, string> = { vehicle: "רכב חדש", financing: "מימון", insurance: "ביטוח", trade_in: "טרייד־אין", used_car: "יד שנייה", test_drive: "נסיעת מבחן", leasing: "ליסינג" };
const WHEN_HE: Record<string, string> = { now: "קונה בקרוב", three_months: "ב־3 החודשים הקרובים", later: "בהמשך השנה", unsure: "עוד לא החליט/ה" };
const keyFromHash = () => new URLSearchParams(window.location.hash.slice(1)).get("k") ?? "";

async function api<T>(key: string, body?: object): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch("/api/partner", body
    ? { method: "POST", headers: { "content-type": "application/json", "x-partner-key": key }, body: JSON.stringify(body) }
    : { headers: { "x-partner-key": key } });
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
}

export default function PartnerPortalPage() {
  const [key] = useState(keyFromHash);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const meta = document.createElement("meta"); meta.name = "robots"; meta.content = "noindex"; document.head.appendChild(meta);
    document.title = "אזור שותף | כמה עולה";
    if (!key) { setError("חסר מפתח בקישור. פתחו את הקישור המלא שקיבלתם."); return; }
    void api<Data>(key).then((r) => (r.ok ? setData(r.data) : setError(r.status === 401 ? "הקישור לא תקף (ייתכן שהוחלף). בקשו קישור חדש." : "המערכת לא זמינה כרגע. נסו שוב בעוד דקה.")));
    return () => meta.remove();
  }, [key]);

  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-mist text-ink">
      <header className="border-b border-line bg-white"><div className="mx-auto flex max-w-[1000px] items-center justify-between px-4 py-4"><BrandMark href="/" /><span className="text-[15px] font-semibold text-muted">אזור שותף</span></div></header>
      <main className="mx-auto max-w-[1000px] px-4 py-8">
        {error && <p role="alert" className="rounded-2xl bg-white p-5 font-semibold text-alert">{error}</p>}
        {!data && !error && <p className="text-muted">טוען…</p>}
        {data && <>
          <h1 className="text-[clamp(1.6rem,3vw,2.2rem)]">שלום, {data.partner.name}</h1>
          <p className="mt-1 text-[15px] text-muted">הפניות שהועברו אליכם, בהסכמה מפורשת של כל לקוח לעסק אחד בלבד. עדכנו מה קרה עם כל פנייה — זה עוזר לנו לשלוח לכם פניות טובות יותר, ופנייה לא תקינה לא תחויב.</p>
          <Summary leads={data.leads} />
          {data.leads.length === 0 ? <p className="mt-6 rounded-2xl bg-white p-5 text-muted">עוד אין פניות. פניות חדשות יופיעו כאן ויישלחו גם בדרך שסיכמנו.</p>
            : <ul className="mt-6 space-y-4">{data.leads.map((l) => <LeadCard key={l.id} lead={l} outcomes={data.outcomes} partnerKey={key} />)}</ul>}
        </>}
      </main>
    </div>
  );
}

function Summary({ leads }: { leads: Lead[] }) {
  const n = (o: string | null) => leads.filter((l) => l.partnerOutcome === o).length;
  const tiles: [string, number][] = [["פניות", leads.length], ["ממתינות לעדכון", n(null)], ["נסגרו", n("won")], ["לא תקינות", n("invalid")]];
  return <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{tiles.map(([k, v]) => <div key={k} className="rounded-2xl bg-white p-4"><dt className="text-[13px] text-muted">{k}</dt><dd className="num text-2xl font-bold">{v}</dd></div>)}</dl>;
}

function LeadCard({ lead, outcomes, partnerKey }: { lead: Lead; outcomes: Record<string, string>; partnerKey: string }) {
  const [outcome, setOutcome] = useState(lead.partnerOutcome ?? "");
  const [note, setNote] = useState(lead.partnerNote ?? "");
  const [msg, setMsg] = useState("");
  async function save() {
    if (!outcome) return;
    setMsg("שומר…");
    const r = await api(partnerKey, { leadId: lead.id, outcome, note });
    setMsg(r.ok ? "נשמר ✓" : "לא נשמר, נסו שוב");
  }
  const intl = lead.phone?.startsWith("0") ? `972${lead.phone.slice(1)}` : lead.phone;
  return (
    <li className="rounded-2xl bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-muted">#{lead.id} · {TYPE_HE[lead.leadType] ?? lead.leadType}{lead.partnerSentAt ? ` · ${new Date(lead.partnerSentAt).toLocaleDateString("he-IL")}` : ""}</p>
          <h2 className="mt-0.5 text-[1.25rem]">{lead.fullName}{lead.city && <span className="text-[15px] font-normal text-muted"> · {lead.city}</span>}</h2>
          <p className="mt-1 text-[15px]">{lead.vehicleLabel}{lead.budget ? ` · תקציב ₪${lead.budget.toLocaleString("he-IL")}` : ""} · {WHEN_HE[lead.purchaseTimeline] ?? lead.purchaseTimeline}</p>
          {lead.detailsText && <p className="mt-1 text-[14px] text-muted">{lead.detailsText}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          {lead.qualityScore != null && <span className="rounded-full bg-mist px-3 py-1 text-[13px] font-bold">איכות {lead.qualityScore}/100</span>}
          {lead.phone && <div className="flex gap-2">
            <a href={`tel:${lead.phone}`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-go px-4 text-[14px] font-bold text-white no-underline"><Phone className="h-4 w-4" aria-hidden /><bdi dir="ltr">{lead.phone}</bdi></a>
            <a href={`https://wa.me/${intl}`} target="_blank" rel="noopener noreferrer" aria-label="וואטסאפ" className="inline-flex min-h-10 items-center rounded-full border border-line px-3 text-ink"><MessageCircle className="h-4 w-4" /></a>
          </div>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-line pt-4">
        <label className="text-[13px] font-semibold text-muted">מה קרה?
          <select value={outcome} onChange={(e) => setOutcome(e.target.value)} className="mt-1 block min-h-10 rounded-full border border-line bg-white px-3 text-[15px] text-ink">
            <option value="">—</option>{Object.entries(outcomes).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select></label>
        <label className="min-w-[12rem] flex-1 text-[13px] font-semibold text-muted">הערה (לא חובה)
          <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} className="mt-1 block min-h-10 w-full rounded-full border border-line px-4 text-[15px] text-ink" /></label>
        <button onClick={save} disabled={!outcome} className="min-h-10 rounded-full bg-ink px-5 text-[15px] font-bold text-white disabled:opacity-40">שמירה</button>
        <span role="status" className="text-[14px] text-muted">{msg}</span>
      </div>
    </li>
  );
}
