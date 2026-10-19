/**
 * /api/admin — owner-only lead admin, independent of the Manus OAuth flow.
 * Auth: ADMIN_PASSWORD → HMAC-signed, HttpOnly, Secure session cookie (12h).
 * Actions: login, logout, status (setup health), init (create tables), leads (list), setStatus.
 * Security: never log passwords, cookies, or lead contact details. Login limited to 5/min/IP.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { getPool } from "../dbConnection";
import m0 from "../0000_mighty_skreet.sql";
import m1 from "../0001_secret_red_ghost.sql";
import m2 from "../0002_stiff_machine_man.sql";
import m3 from "../0003_boring_wilson_fisk.sql";
import m4 from "../0004_flat_mockingbird.sql";

const COOKIE = "autoai_admin";
const TTL_MS = 12 * 60 * 60 * 1000;
const attempts = new Map<string, number[]>();
const STATUSES = ["new", "contacted", "qualified", "closed"] as const;

const secret = () => process.env.ADMIN_PASSWORD?.trim() ?? "";
const sign = (exp: number) => createHmac("sha256", `autoai:${secret()}`).update(String(exp)).digest("hex");
const safeEq = (a: string, b: string) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };

function ip(req: any) {
  const f = req.headers?.["x-forwarded-for"];
  return (Array.isArray(f) ? f[0] : typeof f === "string" ? f.split(",")[0] : "unknown").trim();
}
function loginLimited(addr: string) {
  const now = Date.now();
  const r = (attempts.get(addr) ?? []).filter((t) => now - t < 60_000);
  r.push(now); attempts.set(addr, r);
  return r.length > 5;
}
function authed(req: any): boolean {
  if (!secret()) return false;
  const raw = String(req.headers?.cookie ?? "").split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) ?? "";
  const [expStr, sig] = decodeURIComponent(raw).split(".");
  const exp = Number(expStr);
  return Boolean(exp && sig && exp > Date.now() && safeEq(sig, sign(exp)));
}
function setCookie(res: any, value: string, maxAgeSec: number) {
  res.setHeader("Set-Cookie", `${COOKIE}=${encodeURIComponent(value)}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSec}`);
}

async function tableExists(pool: NonNullable<ReturnType<typeof getPool>>, name: string) {
  const [rows] = await pool.query("SELECT COUNT(*) AS n FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?", [name]);
  return Number((rows as any[])[0]?.n ?? 0) > 0;
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {};
  const action = String(req.method === "GET" ? req.query?.action ?? "" : body.action ?? "");

  if (action === "login" && req.method === "POST") {
    if (!secret()) return res.status(503).json({ error: "admin_not_configured" });
    if (loginLimited(ip(req))) return res.status(429).json({ error: "too_many_attempts" });
    if (typeof body.password !== "string" || !safeEq(body.password, secret())) return res.status(401).json({ error: "wrong_password" });
    const exp = Date.now() + TTL_MS;
    setCookie(res, `${exp}.${sign(exp)}`, TTL_MS / 1000);
    return res.status(200).json({ ok: true });
  }
  if (action === "logout") { setCookie(res, "", 0); return res.status(200).json({ ok: true }); }
  if (!authed(req)) return res.status(401).json({ error: "unauthorized", adminConfigured: Boolean(secret()) });

  const pool = getPool();
  if (action === "status") {
    let dbReachable = false, leadsTable = false;
    if (pool) {
      try { await pool.query("SELECT 1"); dbReachable = true; leadsTable = await tableExists(pool, "leads"); } catch (e) { console.error("[Admin] db check failed", e instanceof Error ? (e as any).code ?? e.name : "unknown"); }
    }
    return res.status(200).json({
      dbConfigured: Boolean(pool), dbReachable, leadsTable,
      contactEmail: /^\S+@\S+\.\S+$/.test(process.env.AUTOAI_CONTACT_EMAIL ?? ""),
      emailAlerts: Boolean(process.env.RESEND_API_KEY?.trim()),
      chatKey: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    });
  }
  if (!pool) return res.status(503).json({ error: "db_not_configured" });

  try {
    if (action === "init" && req.method === "POST") {
      // Safe to press twice: an initialized database is left untouched.
      if (await tableExists(pool, "leads")) return res.status(200).json({ ok: true, alreadyInitialized: true, leadsTable: true });
      // Apply the Drizzle migrations in order; statements that already ran are skipped.
      let applied = 0, skipped = 0;
      for (const sql of [m0, m1, m2, m3, m4]) {
        for (const stmt of sql.split("--> statement-breakpoint").map((s) => s.trim()).filter(Boolean)) {
          try { await pool.query(stmt); applied++; }
          catch (e: any) { if ([1005, 1050, 1060, 1061, 1068, 1091, 1826, 1022].includes(e?.errno)) skipped++; else throw e; }
        }
      }
      return res.status(200).json({ ok: true, applied, skipped, leadsTable: await tableExists(pool, "leads") });
    }
    if (action === "leads") {
      const [rows] = await pool.query("SELECT id, fullName, phone, city, leadType, vehicleLabel, budget, purchaseTimeline, sourcePage, status, consentText, consentAt, createdAt FROM leads ORDER BY createdAt DESC LIMIT 500");
      return res.status(200).json({ leads: rows });
    }
    if (action === "setStatus" && req.method === "POST") {
      const id = Number(body.id);
      if (!Number.isInteger(id) || !STATUSES.includes(body.status)) return res.status(400).json({ error: "bad_request" });
      await pool.query("UPDATE leads SET status = ? WHERE id = ?", [body.status, id]);
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: "unknown_action" });
  } catch (e: any) {
    console.error("[Admin] action failed", action, e?.code ?? e?.name ?? "unknown");
    return res.status(500).json({ error: "db_error", code: e?.code ?? null });
  }
}
