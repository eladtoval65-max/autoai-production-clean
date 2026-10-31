/**
 * Dashboard numbers for a time range: leads per day / status / type / source, funnel, partner money, follow-ups due.
 */
import { CLOSED_STATUSES, FUNNEL } from "./constants";
import { int, rows, type Action } from "./http";

/** GET stats&days= (1–365, default 30). */
export const getStats: Action = async ({ pool, query }) => {
  const days = Math.min(Math.max(int(query.days) ?? 30, 1), 365);
  const q = (sql: string, args: unknown[] = []) => pool.query(sql, args).then(rows);

  // Day keys are formatted in SQL so they don't shift with the server's timezone.
  const byDay = await q("SELECT DATE_FORMAT(createdAt, '%Y-%m-%d') AS d, COUNT(*) AS n FROM leads WHERE createdAt >= CURDATE() - INTERVAL ? DAY GROUP BY d ORDER BY d", [days - 1]);
  const byStatus = await q("SELECT status AS k, COUNT(*) AS n FROM leads WHERE createdAt >= NOW() - INTERVAL ? DAY GROUP BY status", [days]);
  const byType = await q("SELECT leadType AS k, COUNT(*) AS n FROM leads WHERE createdAt >= NOW() - INTERVAL ? DAY GROUP BY leadType ORDER BY n DESC", [days]);
  const bySource = await q("SELECT COALESCE(NULLIF(utmSource,''), NULLIF(landingSlug,''), sourcePage) AS k, COUNT(*) AS n FROM leads WHERE createdAt >= NOW() - INTERVAL ? DAY GROUP BY k ORDER BY n DESC LIMIT 8", [days]);
  // Funnel: unique browser tabs per step (sessionId is a random per-tab id, no personal data).
  const events = await q(`SELECT name AS k, COUNT(DISTINCT COALESCE(sessionId, id)) AS n FROM site_events WHERE createdAt >= NOW() - INTERVAL ? DAY AND name IN (${FUNNEL.map(() => "?").join(",")}) GROUP BY name`, [days, ...FUNNEL]);
  const money = (await q("SELECT COALESCE(SUM(CASE WHEN partnerPaid = 1 THEN partnerPrice END),0) AS paid, COALESCE(SUM(CASE WHEN partnerPaid = 0 AND partnerId IS NOT NULL THEN partnerPrice END),0) AS owed FROM leads WHERE createdAt >= NOW() - INTERVAL ? DAY", [days]))[0];
  const due = (await q(`SELECT COUNT(*) AS n FROM leads WHERE followUpAt IS NOT NULL AND followUpAt <= NOW() AND status NOT IN (${CLOSED_STATUSES.map(() => "?").join(",")})`, CLOSED_STATUSES))[0];

  const perStep = Object.fromEntries(events.map((r: { k: string; n: number }) => [r.k, Number(r.n)]));
  // What partners reported back (partner portal): the proof that leads convert.
  const byOutcome = await q("SELECT COALESCE(partnerOutcome, 'pending') AS k, COUNT(*) AS n FROM leads WHERE partnerId IS NOT NULL AND partnerSentAt >= NOW() - INTERVAL ? DAY GROUP BY k ORDER BY n DESC", [days]);
  const priceReports = await q("SELECT COUNT(*) AS n FROM price_reports WHERE createdAt >= NOW() - INTERVAL ? DAY", [days]).catch(() => [{ n: 0 }]);
  return { days, byDay, byStatus, byType, bySource, byOutcome, priceReports: Number((priceReports as { n: number }[])[0]?.n ?? 0), funnel: FUNNEL.map((k) => ({ k, n: perStep[k] ?? 0 })), money, followUpsDue: Number(due?.n ?? 0) };
};
