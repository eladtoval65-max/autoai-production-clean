/**
 * POST /api/event — anonymous funnel analytics (no PII, no cookies set).
 * Stores only: event name (allow-listed), a random per-tab session id, page tag, utm_source.
 * Rate limit: 12 requests per minute per IP. Always answers 204 so tracking never breaks the UI.
 */
import { getPool } from "../dbConnection";
import { ensureSchema } from "../schemaSetup";

const NAMES = new Set(["visit", "quiz_start", "quiz_complete", "results_view", "lead_open", "lead_submit", "plate_check", "chat_open"]);
const hits = new Map<string, number[]>();

function limited(req: any) {
  const f = req.headers?.["x-forwarded-for"];
  const ip = (Array.isArray(f) ? f[0] : typeof f === "string" ? f.split(",")[0] : "unknown").trim();
  const now = Date.now();
  const r = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  r.push(now); hits.set(ip, r);
  if (hits.size > 5000) hits.clear();
  return r.length > 12;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).end();
  if (limited(req)) return res.status(204).end();
  let b: any = {};
  try { b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {}; } catch { return res.status(204).end(); }
  const name = String(b.name ?? "");
  if (!NAMES.has(name)) return res.status(204).end();
  const sid = /^[a-z0-9]{8,40}$/i.test(String(b.sid ?? "")) ? String(b.sid) : null;
  const page = /^[a-z0-9_:-]{1,80}$/.test(String(b.page ?? "")) ? String(b.page) : null;
  const utm = /^[\w.-]{1,80}$/.test(String(b.utm ?? "")) ? String(b.utm) : null;
  const pool = getPool();
  if (!pool) return res.status(204).end();
  try {
    await ensureSchema(pool);
    await pool.query("INSERT INTO site_events (name, sessionId, page, utmSource) VALUES (?, ?, ?, ?)", [name, sid, page, utm]);
  } catch (e: any) {
    console.error("[Event] insert failed", e?.code ?? e?.name ?? "unknown");
  }
  return res.status(204).end();
}
