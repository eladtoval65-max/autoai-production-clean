/**
 * /api/health — daily self-check (Vercel cron). Returns only ok/failed names (no secrets, no data);
 * emails the owner when something is broken. CRON_SECRET, when set, is required.
 */
import { getPool } from "../dbConnection";
import { runAlerts } from "../server/alerts/priceAlerts";
import { runHealth } from "../server/report/health";

export default async function handler(req: any, res: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  res.setHeader("Cache-Control", "no-store");
  const secret = process.env.CRON_SECRET?.trim();
  if (secret && req.headers?.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: "unauthorized" });
  try {
    const pool = getPool();
    const r = await runHealth(pool);
    // Price-drop alerts ride on this daily cron (Hobby plan: few cron jobs). Counts only, no addresses.
    const site = (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")).replace(/\/+$/, "");
    const alerts = pool && site ? await runAlerts(pool, site).catch(() => null) : null;
    return res.status(200).json({ ok: r.ok, failed: r.problems.length, emailed: r.emailed, alerts });
  } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error("[Health] failed", e?.code ?? e?.name ?? "unknown");
    return res.status(500).json({ error: "health_failed" });
  }
}
