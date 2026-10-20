/**
 * Weekly owner report: the last 7 days against the 7 before, as one short email.
 *   collectWeekly(pool) — numbers only (aggregates, no names or phones);
 *   renderWeekly(data)  — pure: subject + RTL HTML (unit-tested);
 *   sendWeekly(pool, force) — at most once per 6 days unless forced from the admin.
 */
import type { Pool } from "mysql2/promise";
import { sendOwnerEmail } from "../email";

export type Weekly = {
  visits: [number, number]; leads: [number, number]; optIns: number; sentToPartner: number;
  uncontacted: number; followUpsDue: number; funnel: { k: string; n: number }[]; sources: { k: string; n: number }[];
  types: { k: string; n: number }[]; owed: number; paid: number; sellCards: number;
};

const FUNNEL = ["visit", "quiz_start", "quiz_complete", "results_view", "lead_open", "lead_submit"];
const FUNNEL_HE: Record<string, string> = { visit: "ביקורים", quiz_start: "התחילו שאלון", quiz_complete: "סיימו שאלון", results_view: "ראו תוצאות", lead_open: "פתחו טופס", lead_submit: "שלחו פנייה" };
const TYPE_HE: Record<string, string> = { vehicle: "בירור על רכב", financing: "מימון", insurance: "ביטוח", trade_in: "טרייד-אין", used_car: "יד שנייה", test_drive: "נסיעת מבחן" };

type Q = (sql: string, args?: unknown[]) => Promise<any[]>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Aggregates for the last 7 days ([0]) and the 7 days before ([1]). */
export async function collectWeekly(pool: Pool): Promise<Weekly> {
  const q: Q = async (sql, args = []) => (await pool.query(sql, args))[0] as any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  const n = async (sql: string, args: unknown[] = []) => Number((await q(sql, args))[0]?.n ?? 0);
  const week = (offset: number) => [offset + 7, offset];
  const visits = async (o: number) => n("SELECT COUNT(DISTINCT COALESCE(sessionId, id)) AS n FROM site_events WHERE name = 'visit' AND createdAt >= NOW() - INTERVAL ? DAY AND createdAt < NOW() - INTERVAL ? DAY", week(o));
  const leads = async (o: number) => n("SELECT COUNT(*) AS n FROM leads WHERE createdAt >= NOW() - INTERVAL ? DAY AND createdAt < NOW() - INTERVAL ? DAY", week(o));
  const funnelRows = await q(`SELECT name AS k, COUNT(DISTINCT COALESCE(sessionId, id)) AS n FROM site_events WHERE createdAt >= NOW() - INTERVAL 7 DAY AND name IN (${FUNNEL.map(() => "?").join(",")}) GROUP BY name`, FUNNEL);
  const per = Object.fromEntries(funnelRows.map((r) => [r.k, Number(r.n)]));
  const money = (await q("SELECT COALESCE(SUM(CASE WHEN partnerPaid = 1 THEN partnerPrice END),0) AS paid, COALESCE(SUM(CASE WHEN partnerPaid = 0 AND partnerId IS NOT NULL THEN partnerPrice END),0) AS owed FROM leads"))[0] ?? {};
  return {
    visits: [await visits(0), await visits(7)],
    leads: [await leads(0), await leads(7)],
    optIns: await n("SELECT COUNT(*) AS n FROM leads WHERE partnerOptIn = 1 AND createdAt >= NOW() - INTERVAL 7 DAY"),
    sentToPartner: await n("SELECT COUNT(*) AS n FROM leads WHERE partnerSentAt >= NOW() - INTERVAL 7 DAY"),
    uncontacted: await n("SELECT COUNT(*) AS n FROM leads WHERE status = 'new' AND anonymizedAt IS NULL AND createdAt < NOW() - INTERVAL 1 DAY"),
    followUpsDue: await n("SELECT COUNT(*) AS n FROM leads WHERE followUpAt IS NOT NULL AND followUpAt <= NOW() AND status NOT IN ('won','lost','closed')"),
    funnel: FUNNEL.map((k) => ({ k, n: per[k] ?? 0 })),
    sources: (await q("SELECT COALESCE(NULLIF(utmSource,''), NULLIF(landingSlug,''), sourcePage) AS k, COUNT(*) AS n FROM leads WHERE createdAt >= NOW() - INTERVAL 7 DAY GROUP BY k ORDER BY n DESC LIMIT 6")).map((r) => ({ k: String(r.k), n: Number(r.n) })),
    types: (await q("SELECT leadType AS k, COUNT(*) AS n FROM leads WHERE createdAt >= NOW() - INTERVAL 7 DAY GROUP BY leadType ORDER BY n DESC")).map((r) => ({ k: String(r.k), n: Number(r.n) })),
    owed: Number(money.owed ?? 0), paid: Number(money.paid ?? 0),
    sellCards: await n("SELECT COUNT(*) AS n FROM site_events WHERE name = 'sell_card_copy' AND createdAt >= NOW() - INTERVAL 7 DAY"),
  };
}

const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const nf = new Intl.NumberFormat("he-IL");

/** "120 (↑ 20 מהשבוע שעבר)" — the change in words, not only in an arrow. */
export function trend([now, before]: [number, number]): string {
  if (now === before) return `${nf.format(now)} (כמו בשבוע שעבר)`;
  const diff = now - before;
  return `${nf.format(now)} (${diff > 0 ? "↑ עלייה של" : "↓ ירידה של"} ${nf.format(Math.abs(diff))} מהשבוע שעבר)`;
}

/** The email: what happened, then what needs the owner's attention. */
export function renderWeekly(w: Weekly, siteUrl = ""): { subject: string; html: string } {
  const todo: string[] = [];
  if (w.uncontacted) todo.push(`${w.uncontacted} פניות חדשות מחכות יותר מיום — לחזור אליהן`);
  if (w.followUpsDue) todo.push(`${w.followUpsDue} תזכורות שהגיע זמנן`);
  if (w.owed) todo.push(`שותפים חייבים ₪${nf.format(w.owed)} על פניות שהועברו`);
  const row = (k: string, v: string) => `<tr><td style="padding:4px 12px 4px 0;color:#4d5b6c">${esc(k)}</td><td style="padding:4px 0;font-weight:bold">${esc(v)}</td></tr>`;
  const list = (items: { k: string; n: number }[], labels: Record<string, string> = {}) =>
    items.length ? items.map((i) => `${esc(labels[i.k] ?? i.k)}: ${nf.format(i.n)}`).join(" · ") : "—";
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;color:#0e1b2c;max-width:560px">
<h2 style="margin:0 0 6px">״כמה עולה״ — השבוע שהיה</h2>
<p style="margin:0 0 14px;color:#4d5b6c">7 הימים האחרונים לעומת 7 הימים שלפניהם.</p>
<table style="border-collapse:collapse">
${row("ביקורים", trend(w.visits))}${row("פניות", trend(w.leads))}${row("הסכימו להעברה לעסק", nf.format(w.optIns))}
${row("הועברו לשותפים", nf.format(w.sentToPartner))}${row("כרטיסי מוכרים שהועתקו", nf.format(w.sellCards))}${row("שולם משותפים (סה״כ)", `₪${nf.format(w.paid)}`)}
</table>
<h3 style="margin:18px 0 6px">משפך השבוע</h3><p style="margin:0">${list(w.funnel, FUNNEL_HE)}</p>
<h3 style="margin:18px 0 6px">מאיפה הגיעו הפניות</h3><p style="margin:0">${list(w.sources)}</p>
<h3 style="margin:18px 0 6px">סוגי פניות</h3><p style="margin:0">${list(w.types, TYPE_HE)}</p>
<h3 style="margin:18px 0 6px">מה לעשות</h3>
${todo.length ? `<ul style="margin:0;padding-inline-start:18px">${todo.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : `<p style="margin:0">הכל מטופל 👍</p>`}
${siteUrl ? `<p style="margin:18px 0 0"><a href="${esc(siteUrl)}/admin" style="background:#0a7c59;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:bold">לניהול</a></p>` : ""}
</div>`;
  return { subject: `״כמה עולה״ — השבוע: ${w.visits[0]} ביקורים, ${w.leads[0]} פניות`, html };
}

/** Sends the report unless one went out in the last 6 days (or `force`). Returns what happened. */
export async function sendWeekly(pool: Pool, force = false): Promise<"sent" | "skipped" | "no_email"> {
  if (!force) {
    const [rows] = await pool.query("SELECT 1 FROM app_reports WHERE kind = 'weekly' AND sentAt > NOW() - INTERVAL 6 DAY");
    if ((rows as unknown[]).length) return "skipped";
  }
  const site = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  const { subject, html } = renderWeekly(await collectWeekly(pool), site.replace(/\/+$/, ""));
  if (!(await sendOwnerEmail(subject, html))) return "no_email";
  await pool.query("INSERT INTO app_reports (kind, sentAt) VALUES ('weekly', NOW()) ON DUPLICATE KEY UPDATE sentAt = NOW()");
  return "sent";
}
