/**
 * /api/partner — the partner portal API. The secret key travels in the `x-partner-key` header
 * (the page keeps it in the URL #fragment, which browsers never send to servers or logs).
 *   GET  → { partner, leads, outcomes }
 *   POST { leadId, outcome, note? } → records the outcome on one of the partner's own leads.
 * Limit: 60 requests per minute per IP.
 */
import { getPool } from "../dbConnection";
import { ensureSchema } from "../schemaSetup";
import { requestIp } from "../server/leads/intake";
import { OUTCOME_HE, OUTCOMES, partnerForKey, partnerLeads, setOutcome, type Outcome } from "../server/partner/portal";
import { bodyOf, makeLimiter } from "../server/public/http";

const limited = makeLimiter(60, 60_000);

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (limited(requestIp(req))) return res.status(429).json({ error: "rate_limited" });
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: "db_not_configured" });
  try {
    await ensureSchema(pool);
    const key = String(req.headers?.["x-partner-key"] ?? "");
    const partner = await partnerForKey(pool, key);
    if (!partner) return res.status(401).json({ error: "bad_key" });
    if (req.method === "GET") return res.status(200).json({ partner: { name: partner.name, type: partner.type }, leads: await partnerLeads(pool, partner.id), outcomes: OUTCOME_HE });
    if (req.method !== "POST") return res.status(405).json({ error: "method" });
    const b = bodyOf(req);
    const leadId = Number(b.leadId);
    const outcome = String(b.outcome) as Outcome;
    const note = String(b.note ?? "").trim().slice(0, 500);
    if (!Number.isInteger(leadId) || !OUTCOMES.includes(outcome)) return res.status(400).json({ error: "bad_request" });
    const ok = await setOutcome(pool, partner, leadId, outcome, note);
    return ok ? res.status(200).json({ ok: true }) : res.status(404).json({ error: "not_found" });
  } catch (e: any) {
    console.error("[Partner] failed", e?.code ?? e?.name ?? "unknown");
    return res.status(500).json({ error: "server" });
  }
}
