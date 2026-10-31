/**
 * POST /api/event — anonymous funnel analytics (no PII, no cookies set).
 * Also: POST {name:"price_report", makeId, modelId, genCode, year, price, source} — an anonymous asking price
 * (one per tab per model-year), and GET ?prices=<make>/<model> — the per-year summary (cached 1 hour).
 * Stores only: event name (allow-listed), a random per-tab session id, page tag, utm_source.
 * Rate limit: 12 requests per minute per IP. Always answers 204 so tracking never breaks the UI.
 */
import { getPool } from "../dbConnection";
import { ensureSchema } from "../schemaSetup";
import { summarize, validReport } from "../server/prices/reports";

const NAMES = new Set(["sell_card_copy", "visit", "quiz_start", "quiz_complete", "results_view", "lead_open", "lead_submit", "plate_check", "chat_open"]);
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
  if (req.method === "GET") return pricesSummary(req, res);
  if (req.method !== "POST") return res.status(405).end();
  if (limited(req)) return res.status(204).end();
  let b: any = {};
  try { b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {}; } catch { return res.status(204).end(); }
  const name = String(b.name ?? "");
  if (name === "price_report") return priceReport(b, res);
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

/** Stores one anonymous asking price (deduplicated per tab + model + year). Always 204. */
async function priceReport(b: any, res: any) {
  const r = validReport(b);
  const sid = /^[a-z0-9]{8,40}$/i.test(String(b.sid ?? "")) ? String(b.sid) : null;
  const pool = getPool();
  if (!r || !pool) return res.status(204).end();
  try {
    await ensureSchema(pool);
    if (sid) await pool.query("DELETE FROM price_reports WHERE sessionId = ? AND makeId = ? AND modelId = ? AND year = ?", [sid, r.makeId, r.modelId, r.year]);
    await pool.query("INSERT INTO price_reports (makeId, modelId, genCode, year, price, source, sessionId) VALUES (?, ?, ?, ?, ?, ?, ?)", [r.makeId, r.modelId, r.genCode, r.year, r.price, r.source, sid]);
  } catch (e: any) { console.error("[Prices] insert failed", e?.code ?? "unknown"); }
  return res.status(204).end();
}

/** GET ?prices=make/model → { years: [{year, n, median, low, high}] } (only years with enough reports). */
async function pricesSummary(req: any, res: any) {
  const key = String(req.query?.prices ?? new URL(req.url ?? "/", "http://x").searchParams.get("prices") ?? "");
  const [makeId, modelId] = key.split("/");
  if (!/^[a-z0-9-]{1,40}$/.test(makeId ?? "") || !/^[a-z0-9-]{1,60}$/.test(modelId ?? "")) return res.status(400).json({ error: "bad_request" });
  const pool = getPool();
  if (!pool) return res.status(200).json({ years: [] });
  try {
    await ensureSchema(pool);
    const [rows] = await pool.query("SELECT year, price FROM price_reports WHERE makeId = ? AND modelId = ? AND createdAt >= NOW() - INTERVAL 18 MONTH", [makeId, modelId]);
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({ years: summarize(rows as { year: number; price: number }[]) });
  } catch (e: any) {
    console.error("[Prices] summary failed", e?.code ?? "unknown");
    return res.status(200).json({ years: [] });
  }
}
