/**
 * POST /api/feedback — "מה חסר לך?" from any visitor: a free-text message, the page it was sent from,
 * and (optional) an email for a reply. Stored in `feedback` and emailed to the owner.
 * Limit: 5 per 10 minutes per IP. Never logs the message or the email.
 */
import { getPool } from "../dbConnection";
import { ensureSchema } from "../schemaSetup";
import { sendOwnerEmail } from "../server/email";
import { requestIp } from "../server/leads/intake";
import { bodyOf, escapeHtml, isEmail, makeLimiter } from "../server/public/http";

const limited = makeLimiter(5, 10 * 60_000);

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  if (limited(requestIp(req))) return res.status(429).json({ error: "rate_limited" });
  const b = bodyOf(req);
  const message = String(b.message ?? "").trim().slice(0, 2000);
  const page = String(b.page ?? "").replace(/[^\w/\-:.?=&%]/g, "").slice(0, 120) || null;
  const emailRaw = String(b.email ?? "").trim();
  const email = emailRaw && isEmail(emailRaw) ? emailRaw.slice(0, 160) : null;
  if (message.length < 3) return res.status(400).json({ error: "empty" });
  if (String(b.website ?? "")) return res.status(200).json({ ok: true }); // honeypot: bots fill hidden fields

  const pool = getPool();
  if (!pool) return res.status(503).json({ error: "db_not_configured" });
  try {
    await ensureSchema(pool);
    await pool.query("INSERT INTO feedback (message, page, email) VALUES (?, ?, ?)", [message, page, email]);
  } catch (e: any) {
    console.error("[Feedback] insert failed", e?.code ?? "unknown");
    return res.status(500).json({ error: "server" });
  }
  await sendOwnerEmail("💬 משוב חדש מהאתר", `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px">
    <p><b>עמוד:</b> ${escapeHtml(page ?? "—")}</p>
    <p style="white-space:pre-wrap;background:#f4f7f3;padding:12px;border-radius:8px">${escapeHtml(message)}</p>
    ${email ? `<p><b>אפשר לענות ל:</b> ${escapeHtml(email)}</p>` : "<p>בלי כתובת לחזרה.</p>"}</div>`);
  return res.status(200).json({ ok: true });
}
