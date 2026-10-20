/**
 * /api/admin — owner-only CRM endpoint (Vercel function). This file is only the entry point:
 *   1. login / logout (no session needed),
 *   2. session check,
 *   3. setup status (works without a database),
 *   4. everything else → the action table in server/admin/router.ts.
 * Security rules (do not relax): never log passwords, cookies or lead contact details; every write requires the owner session;
 * partner hand-off requires recorded customer consent (enforced in server/admin/leads.ts).
 */
import { getPool } from "../dbConnection";
import { ensureSchema } from "../schemaSetup";
import { adminSecret, endSession, isAuthenticated, loginRateLimited, safeEqual, startSession } from "../server/admin/auth";
import { clientIp, HttpError, parseBody } from "../server/admin/http";
import { ROUTES } from "../server/admin/router";
import { setupStatus } from "../server/admin/setup";

export default async function handler(req: any, res: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  res.setHeader("Cache-Control", "no-store");
  const body = parseBody(req);
  if (!body) return res.status(400).json({ error: "bad_json" });
  const query = req.query ?? {};
  const isPost = req.method === "POST";
  const action = String(isPost ? body.action ?? "" : query.action ?? "");

  // 1. Session management
  if (action === "login" && isPost) {
    if (!adminSecret()) return res.status(503).json({ error: "admin_not_configured" });
    if (loginRateLimited(clientIp(req))) return res.status(429).json({ error: "too_many_attempts" });
    if (typeof body.password !== "string" || !safeEqual(body.password, adminSecret())) return res.status(401).json({ error: "wrong_password" });
    startSession(res);
    return res.status(200).json({ ok: true });
  }
  if (action === "logout") { endSession(res); return res.status(200).json({ ok: true }); }

  // 2. Everything below requires the owner session
  if (!isAuthenticated(req)) return res.status(401).json({ error: "unauthorized", adminConfigured: Boolean(adminSecret()) });

  // 3. Setup checklist (must work even when the database isn't configured yet)
  const pool = getPool();
  if (action === "status") return res.status(200).json(await setupStatus(pool));
  if (!pool) return res.status(503).json({ error: "db_not_configured" });

  // 4. Action table
  const route = ROUTES[action];
  if (!route || (route.method === "POST" && !isPost)) return res.status(400).json({ error: "unknown_action" });
  try {
    await ensureSchema(pool);
    return res.status(200).json(await route.run({ pool, query, body }));
  } catch (e: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (e instanceof HttpError) return res.status(e.status).json({ error: e.code });
    console.error("[Admin] action failed", action, e?.code ?? e?.name ?? "unknown");
    return res.status(500).json({ error: "db_error", code: e?.code ?? null });
  }
}
