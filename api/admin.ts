/**
 * /api/admin — owner-only CRM for CamaOla leads, independent of the Manus OAuth flow.
 * Auth: ADMIN_PASSWORD → HMAC-signed, HttpOnly, Secure session cookie (12h); login 5/min/IP.
 * Security rules (do not relax):
 *  - never log passwords, cookies, or lead contact details;
 *  - a lead is assigned to a partner ONLY with a recorded, explicit customer consent;
 *  - every write is owner-authenticated.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { getPool } from "../dbConnection";
import { ensureSchema, resetSchema, LEAD_STATUSES, SCHEMA_VERSION, schemaErrors } from "../schemaSetup";

const COOKIE = "autoai_admin";
const TTL_MS = 12 * 60 * 60 * 1000;
const attempts = new Map<string, number[]>();
const LEAD_TYPES = ["vehicle", "financing", "insurance", "trade_in", "used_car", "test_drive"];
const TIMELINES = ["now", "three_months", "later", "unsure"];
const NOTE_KINDS = ["note", "call", "whatsapp", "email", "meeting"];
const PARTNER_TYPES = ["dealer", "importer", "finance", "insurance", "inspection", "trade_in", "used_lot", "other"];
const FUNNEL = ["visit", "quiz_start", "quiz_complete", "results_view", "lead_open", "lead_submit"];

const secret = () => process.env.ADMIN_PASSWORD?.trim() ?? "";
const sign = (exp: number) => createHmac("sha256", `autoai:${secret()}`).update(String(exp)).digest("hex");
const safeEq = (a: string, b: string) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const optStr = (v: unknown, max: number) => { const s = str(v, max); return s ? s : null; };
const int = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? Math.round(n) : null; };

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

const LEAD_COLUMNS = `l.id, l.fullName, l.phone, l.city, l.leadType, l.vehicleLabel, l.budget, l.purchaseTimeline, l.sourcePage,
  l.utmSource, l.utmMedium, l.utmCampaign, l.landingSlug, l.status, l.followUpAt, l.partnerId, l.partnerConsentAt, l.partnerConsentNote,
  l.partnerSentAt, l.partnerPrice, l.partnerPaid, l.consentText, l.consentAt, l.createdAt, l.updatedAt, p.name AS partnerName,
  (SELECT COUNT(*) FROM lead_notes n WHERE n.leadId = l.id) AS noteCount`;

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");
  let body: any = {};
  try { body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {}; } catch { return res.status(400).json({ error: "bad_json" }); }
  const q = req.query ?? {};
  const action = String(req.method === "GET" ? q.action ?? "" : body.action ?? "");
  const isPost = req.method === "POST";

  if (action === "login" && isPost) {
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
      try { await pool.query("SELECT 1"); dbReachable = true; await ensureSchema(pool); leadsTable = true; }
      catch (e: any) { console.error("[Admin] db check failed", e?.code ?? e?.name ?? "unknown"); }
    }
    return res.status(200).json({
      dbConfigured: Boolean(pool), dbReachable, leadsTable, schemaVersion: leadsTable ? SCHEMA_VERSION : 0, schemaErrors,
      contactEmail: /^\S+@\S+\.\S+$/.test(process.env.AUTOAI_CONTACT_EMAIL ?? ""),
      emailAlerts: Boolean(process.env.RESEND_API_KEY?.trim()),
      chatKey: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    });
  }
  if (!pool) return res.status(503).json({ error: "db_not_configured" });

  try {
    await ensureSchema(pool);

    if (action === "init" && isPost) { resetSchema(); await ensureSchema(pool); return res.status(200).json({ ok: true, leadsTable: true, schemaVersion: SCHEMA_VERSION, schemaErrors }); }

    // ── Leads ────────────────────────────────────────────────────────────────
    if (action === "leads") {
      const where: string[] = [], args: unknown[] = [];
      const text = str(q.q, 80);
      if (text) { where.push("(l.fullName LIKE ? OR l.phone LIKE ? OR l.vehicleLabel LIKE ? OR l.city LIKE ?)"); const like = `%${text}%`; args.push(like, like, like, like); }
      if (LEAD_STATUSES.includes(q.status)) { where.push("l.status = ?"); args.push(q.status); }
      if (LEAD_TYPES.includes(q.type)) { where.push("l.leadType = ?"); args.push(q.type); }
      if (q.followUp === "due") where.push("l.followUpAt IS NOT NULL AND l.followUpAt <= NOW()");
      const days = int(q.days);
      if (days && days > 0) { where.push("l.createdAt >= NOW() - INTERVAL ? DAY"); args.push(Math.min(days, 3650)); }
      const [rows] = await pool.query(
        `SELECT ${LEAD_COLUMNS} FROM leads l LEFT JOIN partners p ON p.id = l.partnerId ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY l.createdAt DESC LIMIT 1000`, args);
      return res.status(200).json({ leads: rows });
    }
    if (action === "lead") {
      const id = int(q.id);
      const [rows] = await pool.query(`SELECT ${LEAD_COLUMNS} FROM leads l LEFT JOIN partners p ON p.id = l.partnerId WHERE l.id = ?`, [id]);
      const lead = (rows as any[])[0];
      if (!lead) return res.status(404).json({ error: "not_found" });
      const [notes] = await pool.query("SELECT id, kind, body, createdAt FROM lead_notes WHERE leadId = ? ORDER BY createdAt DESC, id DESC", [id]);
      return res.status(200).json({ lead, notes });
    }
    if ((action === "leadUpdate" || action === "setStatus") && isPost) {
      const id = int(body.id), f = action === "setStatus" ? { status: body.status } : body.fields ?? {};
      const sets: string[] = [], args: unknown[] = [];
      if ("fullName" in f) { const v = str(f.fullName, 120); if (v.length < 2) return res.status(400).json({ error: "bad_name" }); sets.push("fullName = ?"); args.push(v); }
      if ("phone" in f) { const v = str(f.phone, 20).replace(/[\s-]/g, ""); if (!/^05\d{8}$/.test(v)) return res.status(400).json({ error: "bad_phone" }); sets.push("phone = ?"); args.push(v); }
      if ("city" in f) { sets.push("city = ?"); args.push(optStr(f.city, 80)); }
      if ("vehicleLabel" in f) { const v = str(f.vehicleLabel, 200); if (v.length < 2) return res.status(400).json({ error: "bad_vehicle" }); sets.push("vehicleLabel = ?"); args.push(v); }
      if ("budget" in f) { const v = f.budget === null || f.budget === "" ? null : int(f.budget); sets.push("budget = ?"); args.push(v); }
      if ("leadType" in f) { if (!LEAD_TYPES.includes(f.leadType)) return res.status(400).json({ error: "bad_type" }); sets.push("leadType = ?"); args.push(f.leadType); }
      if ("purchaseTimeline" in f) { if (!TIMELINES.includes(f.purchaseTimeline)) return res.status(400).json({ error: "bad_timeline" }); sets.push("purchaseTimeline = ?"); args.push(f.purchaseTimeline); }
      if ("followUpAt" in f) { const d = f.followUpAt ? new Date(f.followUpAt) : null; if (d && Number.isNaN(d.getTime())) return res.status(400).json({ error: "bad_date" }); sets.push("followUpAt = ?"); args.push(d); }
      if ("partnerPaid" in f) { sets.push("partnerPaid = ?"); args.push(f.partnerPaid ? 1 : 0); }
      if ("partnerPrice" in f) { sets.push("partnerPrice = ?"); args.push(f.partnerPrice === "" || f.partnerPrice == null ? null : int(f.partnerPrice)); }
      let statusNote: string | null = null;
      if ("status" in f) {
        if (!LEAD_STATUSES.includes(f.status)) return res.status(400).json({ error: "bad_status" });
        if (f.status === "sent_to_partner") return res.status(400).json({ error: "use_assign" });
        sets.push("status = ?"); args.push(f.status); statusNote = f.status;
      }
      if (!id || !sets.length) return res.status(400).json({ error: "bad_request" });
      await pool.query(`UPDATE leads SET ${sets.join(", ")} WHERE id = ?`, [...args, id]);
      if (statusNote) await pool.query("INSERT INTO lead_notes (leadId, kind, body) VALUES (?, 'status', ?)", [id, statusNote]);
      return res.status(200).json({ ok: true });
    }
    if (action === "leadDelete" && isPost) {
      const id = int(body.id);
      if (!id || body.confirm !== true) return res.status(400).json({ error: "confirm_required" });
      await pool.query("DELETE FROM lead_notes WHERE leadId = ?", [id]);
      await pool.query("DELETE FROM leads WHERE id = ?", [id]);
      return res.status(200).json({ ok: true });
    }
    if (action === "noteAdd" && isPost) {
      const id = int(body.id), text = str(body.body, 4000), kind = NOTE_KINDS.includes(body.kind) ? body.kind : "note";
      if (!id || !text) return res.status(400).json({ error: "bad_request" });
      await pool.query("INSERT INTO lead_notes (leadId, kind, body) VALUES (?, ?, ?)", [id, kind, text]);
      if (kind !== "note") await pool.query("UPDATE leads SET status = 'contacted' WHERE id = ? AND status = 'new'", [id]);
      return res.status(200).json({ ok: true });
    }
    if (action === "assign" && isPost) {
      // Consent rule: the original form consent does NOT cover partners. The owner must record
      // the customer's separate, explicit agreement before any assignment.
      const id = int(body.id), partnerId = int(body.partnerId), note = str(body.consentNote, 300);
      if (!id || !partnerId) return res.status(400).json({ error: "bad_request" });
      if (body.consent !== true || note.length < 5) return res.status(400).json({ error: "consent_required" });
      const [p] = await pool.query("SELECT id, name, pricePerLead FROM partners WHERE id = ? AND active = 1", [partnerId]);
      const partner = (p as any[])[0];
      if (!partner) return res.status(404).json({ error: "partner_not_found" });
      const price = body.price === "" || body.price == null ? partner.pricePerLead ?? null : int(body.price);
      await pool.query("UPDATE leads SET partnerId = ?, partnerConsentAt = NOW(), partnerConsentNote = ?, partnerSentAt = NOW(), partnerPrice = ?, partnerPaid = 0, status = 'sent_to_partner' WHERE id = ?",
        [partnerId, note, price, id]);
      await pool.query("INSERT INTO lead_notes (leadId, kind, body) VALUES (?, 'partner', ?)", [id, `הועבר ל${partner.name}. הסכמת לקוח: ${note}`]);
      return res.status(200).json({ ok: true });
    }
    if (action === "unassign" && isPost) {
      const id = int(body.id);
      if (!id) return res.status(400).json({ error: "bad_request" });
      await pool.query("UPDATE leads SET partnerId = NULL, partnerSentAt = NULL, partnerPrice = NULL, partnerPaid = 0, status = 'qualified' WHERE id = ?", [id]);
      await pool.query("INSERT INTO lead_notes (leadId, kind, body) VALUES (?, 'partner', 'השיוך לשותף בוטל')", [id]);
      return res.status(200).json({ ok: true });
    }

    // ── Partners ─────────────────────────────────────────────────────────────
    if (action === "partners") {
      const [rows] = await pool.query(`SELECT p.*, (SELECT COUNT(*) FROM leads l WHERE l.partnerId = p.id) AS leadCount,
        (SELECT COALESCE(SUM(l.partnerPrice),0) FROM leads l WHERE l.partnerId = p.id AND l.partnerPaid = 1) AS paidTotal,
        (SELECT COALESCE(SUM(l.partnerPrice),0) FROM leads l WHERE l.partnerId = p.id AND l.partnerPaid = 0) AS owedTotal
        FROM partners p ORDER BY p.active DESC, p.name`);
      return res.status(200).json({ partners: rows });
    }
    if (action === "partnerSave" && isPost) {
      const p = body.partner ?? {};
      const name = str(p.name, 120);
      if (name.length < 2 || !PARTNER_TYPES.includes(p.type)) return res.status(400).json({ error: "bad_partner" });
      const vals = [name, p.type, optStr(p.contactName, 120), optStr(p.phone, 20), optStr(p.email, 160), optStr(p.region, 80), p.pricePerLead === "" || p.pricePerLead == null ? null : int(p.pricePerLead), p.active === false ? 0 : 1, optStr(p.notes, 2000)];
      const id = int(p.id);
      if (id) await pool.query("UPDATE partners SET name=?, type=?, contactName=?, phone=?, email=?, region=?, pricePerLead=?, active=?, notes=? WHERE id=?", [...vals, id]);
      else await pool.query("INSERT INTO partners (name, type, contactName, phone, email, region, pricePerLead, active, notes) VALUES (?,?,?,?,?,?,?,?,?)", vals);
      return res.status(200).json({ ok: true });
    }

    // ── Landing pages (owner-editable content) ───────────────────────────────
    if (action === "landings") {
      const [rows] = await pool.query(`SELECT lp.*, (SELECT COUNT(*) FROM leads l WHERE l.landingSlug = lp.slug) AS leadCount,
        (SELECT COUNT(*) FROM site_events e WHERE e.name = 'visit' AND e.page = CONCAT('go:', lp.slug)) AS visits FROM landing_pages lp ORDER BY lp.updatedAt DESC`);
      return res.status(200).json({ landings: rows });
    }
    if (action === "landingSave" && isPost) {
      const lp = body.landing ?? {};
      const slug = str(lp.slug, 60).toLowerCase();
      const title = str(lp.title, 160);
      if (!/^[a-z0-9-]{2,60}$/.test(slug) || title.length < 3 || !LEAD_TYPES.includes(lp.leadType ?? "vehicle")) return res.status(400).json({ error: "bad_landing" });
      const bullets = Array.isArray(lp.bullets) ? lp.bullets.map((b: unknown) => str(b, 160)).filter(Boolean).slice(0, 6) : [];
      const vals = [title, optStr(lp.subtitle, 400), JSON.stringify(bullets), optStr(lp.ctaText, 80), lp.leadType ?? "vehicle", lp.active === false ? 0 : 1];
      await pool.query(`INSERT INTO landing_pages (slug, title, subtitle, bullets, ctaText, leadType, active) VALUES (?,?,?,?,?,?,?)
        ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), bullets=VALUES(bullets), ctaText=VALUES(ctaText), leadType=VALUES(leadType), active=VALUES(active)`, [slug, ...vals]);
      return res.status(200).json({ ok: true, slug });
    }

    // ── Stats & funnel ───────────────────────────────────────────────────────
    if (action === "stats") {
      const days = Math.min(Math.max(int(q.days) ?? 30, 1), 365);
      const [byDay] = await pool.query("SELECT DATE_FORMAT(createdAt, '%Y-%m-%d') AS d, COUNT(*) AS n FROM leads WHERE createdAt >= CURDATE() - INTERVAL ? DAY GROUP BY d ORDER BY d", [days - 1]);
      const [byStatus] = await pool.query("SELECT status AS k, COUNT(*) AS n FROM leads WHERE createdAt >= NOW() - INTERVAL ? DAY GROUP BY status", [days]);
      const [byType] = await pool.query("SELECT leadType AS k, COUNT(*) AS n FROM leads WHERE createdAt >= NOW() - INTERVAL ? DAY GROUP BY leadType ORDER BY n DESC", [days]);
      const [bySource] = await pool.query("SELECT COALESCE(NULLIF(utmSource,''), NULLIF(landingSlug,''), sourcePage) AS k, COUNT(*) AS n FROM leads WHERE createdAt >= NOW() - INTERVAL ? DAY GROUP BY k ORDER BY n DESC LIMIT 8", [days]);
      const [events] = await pool.query(`SELECT name AS k, COUNT(DISTINCT COALESCE(sessionId, id)) AS n FROM site_events WHERE createdAt >= NOW() - INTERVAL ? DAY AND name IN (${FUNNEL.map(() => "?").join(",")}) GROUP BY name`, [days, ...FUNNEL]);
      const [money] = await pool.query("SELECT COALESCE(SUM(CASE WHEN partnerPaid = 1 THEN partnerPrice END),0) AS paid, COALESCE(SUM(CASE WHEN partnerPaid = 0 AND partnerId IS NOT NULL THEN partnerPrice END),0) AS owed FROM leads WHERE createdAt >= NOW() - INTERVAL ? DAY", [days]);
      const [due] = await pool.query("SELECT COUNT(*) AS n FROM leads WHERE followUpAt IS NOT NULL AND followUpAt <= NOW() AND status NOT IN ('won','lost','closed')");
      const ev = Object.fromEntries((events as any[]).map((r) => [r.k, Number(r.n)]));
      return res.status(200).json({
        days, byDay, byStatus, byType, bySource,
        funnel: FUNNEL.map((k) => ({ k, n: ev[k] ?? 0 })),
        money: (money as any[])[0], followUpsDue: Number((due as any[])[0]?.n ?? 0),
      });
    }

    return res.status(400).json({ error: "unknown_action" });
  } catch (e: any) {
    console.error("[Admin] action failed", action, e?.code ?? e?.name ?? "unknown");
    return res.status(500).json({ error: "db_error", code: e?.code ?? null });
  }
}
