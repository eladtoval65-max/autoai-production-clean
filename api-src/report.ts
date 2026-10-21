/**
 * /api/report — weekly owner email (server/report/weekly.ts), called by the Vercel cron every Sunday morning.
 * Safe to call by anyone: it only ever emails the owner, at most once per 6 days, with aggregate numbers.
 * When CRON_SECRET is set in Vercel, the call must carry it (Vercel's cron sends it automatically).
 */
import { getPool } from "../dbConnection";
import { ensureSchema } from "../schemaSetup";
import { sendWeekly } from "../server/report/weekly";

export default async function handler(req: any, res: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  res.setHeader("Cache-Control", "no-store");
  const secret = process.env.CRON_SECRET?.trim();
  if (secret && req.headers?.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: "unauthorized" });
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: "db_not_configured" });
  try {
    await ensureSchema(pool);
    return res.status(200).json({ result: await sendWeekly(pool) });
  } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error("[Report] failed", e?.code ?? e?.name ?? "unknown");
    return res.status(500).json({ error: "report_failed" });
  }
}
