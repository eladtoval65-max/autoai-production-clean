/**
 * /api/alerts — price-drop email alerts.
 *   POST {email, makeId, modelId, consent: true}  → subscribe (separate marketing consent is required)
 *   GET  ?unsub=<token>                            → one-click unsubscribe (also via List-Unsubscribe POST)
 * Limit: 5 subscriptions per 10 minutes per IP. The daily send runs from /api/health.
 */
import { getPool } from "../dbConnection";
import { ensureSchema } from "../schemaSetup";
import { subscribe, unsubscribe } from "../server/alerts/priceAlerts";
import { requestIp } from "../server/leads/intake";
import { bodyOf, isEmail, makeLimiter } from "../server/public/http";

const limited = makeLimiter(5, 10 * 60_000);
const page = (text: string) => `<!doctype html><html lang="he" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>כמה עולה</title><body style="font-family:Arial,sans-serif;max-width:520px;margin:15vh auto;padding:0 16px;font-size:18px;color:#0e1b2c"><p>${text}</p><p><a href="/">לאתר ״כמה עולה״</a></p></body></html>`;

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  const pool = getPool();
  if (!pool) return res.status(503).json({ error: "db_not_configured" });
  try {
    await ensureSchema(pool);
    const token = String(req.query?.unsub ?? new URL(req.url ?? "/", "http://x").searchParams.get("unsub") ?? "");
    if (token) {
      const ok = await unsubscribe(pool, token);
      res.setHeader("content-type", "text/html; charset=utf-8");
      return res.status(200).end(page(ok ? "הוסרת מההתראה. לא נשלח לך עוד מיילים על הדגם הזה." : "ההתראה כבר הוסרה (או שהקישור לא תקין)."));
    }
    if (req.method !== "POST") return res.status(405).json({ error: "method" });
    if (limited(requestIp(req))) return res.status(429).json({ error: "rate_limited" });
    const b = bodyOf(req);
    const email = String(b.email ?? "").trim().toLowerCase();
    if (b.consent !== true) return res.status(400).json({ error: "consent_required" });
    if (!isEmail(email) || email.length > 160) return res.status(400).json({ error: "bad_email" });
    const r = await subscribe(pool, email, String(b.makeId ?? ""), String(b.modelId ?? ""));
    return r === "ok" ? res.status(200).json({ ok: true }) : res.status(400).json({ error: "no_model" });
  } catch (e: any) {
    console.error("[Alerts] failed", e?.code ?? e?.name ?? "unknown");
    return res.status(500).json({ error: "server" });
  }
}
