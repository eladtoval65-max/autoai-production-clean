/**
 * Daily health check (Vercel cron → /api/health). Emails the owner ONLY when something is broken,
 * and at most once per 20 hours for the same problem set, so a long outage isn't an email storm.
 *   runChecks()   — gathers results (database, schema, settings, the live pages);
 *   problemsOf()  — pure: which results are failures, in Hebrew (unit-tested).
 */
import type { Pool } from "mysql2/promise";
import { setupStatus } from "../admin/setup";
import { sendOwnerEmail } from "../email";

import { problemsOf, type HealthResult } from "./healthModel";

/** Live pages a visitor must be able to open (relative to the production URL). */
const PAGES = ["/", "/cars", "/cars/toyota/corolla", "/compare", "/privacy", "/sitemap.xml"];

async function checkPage(base: string, path: string): Promise<HealthResult> {
  try {
    const res = await fetch(base + path, { signal: AbortSignal.timeout(8000), headers: { "user-agent": "CamaOla-Health/1" } });
    return { name: `עמוד ${path}`, ok: res.ok, detail: res.ok ? undefined : `קוד ${res.status}` };
  } catch (e) {
    return { name: `עמוד ${path}`, ok: false, detail: e instanceof Error ? e.name : "אין תגובה" };
  }
}

export async function runChecks(pool: Pool | null): Promise<HealthResult[]> {
  const s = await setupStatus(pool);
  const results: HealthResult[] = [
    { name: "מסד הנתונים מחובר", ok: s.dbConfigured && s.dbReachable },
    { name: "טבלאות מעודכנות", ok: s.leadsTable && !(s.schemaErrors ?? []).length, detail: (s.schemaErrors ?? []).join(", ") || undefined },
    { name: "מייל לקבלת פניות מוגדר", ok: s.contactEmail },
    { name: "התראות מייל (Resend) מוגדרות", ok: s.emailAlerts },
    { name: "מפתח הצ׳אט מוגדר", ok: s.chatKey },
  ];
  const site = (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")).replace(/\/+$/, "");
  if (site) for (const p of PAGES) results.push(await checkPage(site, p));
  return results;
}

/** Runs the checks; emails only when something failed and that problem set wasn't reported in the last 20 hours. */
export async function runHealth(pool: Pool | null): Promise<{ ok: boolean; problems: string[]; emailed: boolean }> {
  const problems = problemsOf(await runChecks(pool));
  if (!problems.length) return { ok: true, problems, emailed: false };
  const key = `health:${problems.join("|")}`.slice(0, 20);
  if (pool) {
    try {
      const [rows] = await pool.query("SELECT 1 FROM app_reports WHERE kind = ? AND sentAt > NOW() - INTERVAL 20 HOUR", [key]);
      if ((rows as unknown[]).length) return { ok: false, problems, emailed: false };
    } catch { /* database is one of the problems — send anyway */ }
  }
  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;color:#0e1b2c">
<h2 style="margin:0 0 8px">״כמה עולה״ — משהו לא עובד באתר</h2>
<ul style="padding-inline-start:18px">${problems.map((p) => `<li>${p.replace(/[<>&]/g, "")}</li>`).join("")}</ul>
<p style="color:#4d5b6c">אפשר לראות את הפרטים בניהול, בלשונית ״הגדרות״. אם לא ברור מה לעשות — להעביר את המייל הזה ל־Claude.</p></div>`;
  const emailed = await sendOwnerEmail(`⚠️ ״כמה עולה״: ${problems.length} בעיות באתר`, html);
  if (emailed && pool) await pool.query("INSERT INTO app_reports (kind, sentAt) VALUES (?, NOW()) ON DUPLICATE KEY UPDATE sentAt = NOW()", [key]).catch(() => undefined);
  return { ok: false, problems, emailed };
}
