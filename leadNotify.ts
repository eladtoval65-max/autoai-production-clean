/**
 * Instant email to the site owner for every new lead (speed-to-lead).
 * Uses Resend's HTTP API when RESEND_API_KEY is set; silently skips otherwise.
 * Never logs contact details — only the HTTP status on failure.
 */
type LeadForEmail = {
  id: number; fullName: string; phone: string; city?: string | null; leadType: string; vehicleLabel: string;
  budget?: number | null; purchaseTimeline: string; sourcePage: string;
};

const TYPE_HE: Record<string, string> = { vehicle: "בירור על רכב", financing: "מימון", insurance: "ביטוח", trade_in: "טרייד-אין", used_car: "רכב יד שנייה", test_drive: "נסיעת מבחן" };
const WHEN_HE: Record<string, string> = { now: "בקרוב", three_months: "ב-3 החודשים הקרובים", later: "בהמשך השנה", unsure: "עוד לא החליט/ה" };
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function notifyNewLead(lead: LeadForEmail): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  const to = process.env.AUTOAI_CONTACT_EMAIL?.trim();
  if (!key || !to) return;
  const intl = lead.phone.startsWith("0") ? `972${lead.phone.slice(1)}` : lead.phone;
  const rows: [string, string][] = [
    ["שם", lead.fullName], ["טלפון", lead.phone], ["עיר", lead.city || "—"], ["סוג פנייה", TYPE_HE[lead.leadType] ?? lead.leadType],
    ["רכב", lead.vehicleLabel], ["תקציב", lead.budget ? `₪${lead.budget.toLocaleString("he-IL")}` : "—"],
    ["מועד רכישה", WHEN_HE[lead.purchaseTimeline] ?? lead.purchaseTimeline], ["מקור", lead.sourcePage],
  ];
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;color:#0e1b2c">
<h2 style="margin:0 0 8px">ליד חדש #${lead.id}: ${esc(TYPE_HE[lead.leadType] ?? lead.leadType)}</h2>
<p style="margin:0 0 14px;color:#4d5b6c">כדאי לחזור תוך 5 דקות. הלקוח נתן הסכמה מתועדת ליצירת קשר.</p>
<table style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#4d5b6c">${k}</td><td style="padding:4px 0;font-weight:bold">${esc(v)}</td></tr>`).join("")}</table>
<p style="margin:18px 0 0"><a href="tel:${esc(lead.phone)}" style="background:#0a7c59;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:bold">התקשרות</a>
&nbsp;<a href="https://wa.me/${esc(intl)}" style="background:#25d366;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:bold">וואטסאפ</a></p>
</div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_EMAIL_FROM?.trim() || "AutoAI <onboarding@resend.dev>",
        to: [to],
        subject: `ליד חדש #${lead.id}: ${TYPE_HE[lead.leadType] ?? lead.leadType}`,
        html,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[LeadNotify] email failed", res.status);
  } catch (error) {
    console.error("[LeadNotify] email error", error instanceof Error ? error.name : "unknown");
  }
}
