/**
 * Lead actions: list (search/filter), detail with history, edit, delete, notes, and partner hand-off.
 * Rule (do not relax): a lead is assigned to a partner ONLY with a recorded, explicit customer consent —
 * the original form consent covers a call back from CamaOla only.
 */
import { RETENTION_MONTHS } from "@shared/leadPolicy";
import { LEAD_STATUSES } from "../../schemaSetup";
import { consentCertificate } from "./consentProof";
import { handOffConsent } from "./handOff";
import { sendToPartner } from "./webhook";
import { CLOSED_STATUSES, LEAD_COLUMNS, LEAD_TYPES, NOTE_KINDS, TIMELINES } from "./constants";
import { fail, int, optInt, optStr, rows, str, type Action } from "./http";

const FROM_LEADS = "FROM leads l LEFT JOIN partners p ON p.id = l.partnerId";
const addHistory = (pool: Parameters<Action>[0]["pool"], leadId: number, kind: string, body: string) =>
  pool.query("INSERT INTO lead_notes (leadId, kind, body) VALUES (?, ?, ?)", [leadId, kind, body]);

/** GET leads — optional q (text), status, type, followUp=due, days. Newest first, max 1000. */
export const listLeads: Action = async ({ pool, query: q }) => {
  const where: string[] = [], args: unknown[] = [];
  const text = str(q.q, 80);
  if (text) { where.push("(l.fullName LIKE ? OR l.phone LIKE ? OR l.vehicleLabel LIKE ? OR l.city LIKE ?)"); const like = `%${text}%`; args.push(like, like, like, like); }
  if ((LEAD_STATUSES as readonly string[]).includes(q.status)) { where.push("l.status = ?"); args.push(q.status); }
  if (LEAD_TYPES.includes(q.type)) { where.push("l.leadType = ?"); args.push(q.type); }
  if (q.followUp === "due") {
    where.push(`l.followUpAt IS NOT NULL AND l.followUpAt <= NOW() AND l.status NOT IN (${CLOSED_STATUSES.map(() => "?").join(",")})`);
    args.push(...CLOSED_STATUSES);
  }
  const days = int(q.days);
  if (days && days > 0) { where.push("l.createdAt >= NOW() - INTERVAL ? DAY"); args.push(Math.min(days, 3650)); }
  const [result] = await pool.query(`SELECT ${LEAD_COLUMNS} ${FROM_LEADS} ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY l.createdAt DESC LIMIT 1000`, args);
  return { leads: result };
};

/** GET lead&id= — one lead with its full history (newest first). */
export const getLead: Action = async ({ pool, query }) => {
  const id = int(query.id);
  const lead = rows(await pool.query(`SELECT ${LEAD_COLUMNS} ${FROM_LEADS} WHERE l.id = ?`, [id]))[0];
  if (!lead) fail("not_found", 404);
  const notes = rows(await pool.query("SELECT id, kind, body, createdAt FROM lead_notes WHERE leadId = ? ORDER BY createdAt DESC, id DESC", [id]));
  return { lead, notes };
};

/**
 * Turns submitted fields into validated SET clauses. Unknown fields are ignored; invalid values throw.
 * "sent_to_partner" can't be set directly — only through `assignPartner` with consent.
 */
function leadUpdates(f: Record<string, any>): { sets: string[]; args: unknown[]; newStatus: string | null } { // eslint-disable-line @typescript-eslint/no-explicit-any
  const sets: string[] = [], args: unknown[] = [];
  const set = (col: string, value: unknown) => { sets.push(`${col} = ?`); args.push(value); };
  if ("fullName" in f) { const v = str(f.fullName, 120); if (v.length < 2) fail("bad_name"); set("fullName", v); }
  if ("phone" in f) { const v = str(f.phone, 20).replace(/[\s-]/g, ""); if (!/^05\d{8}$/.test(v)) fail("bad_phone"); set("phone", v); }
  if ("city" in f) set("city", optStr(f.city, 80));
  if ("vehicleLabel" in f) { const v = str(f.vehicleLabel, 200); if (v.length < 2) fail("bad_vehicle"); set("vehicleLabel", v); }
  if ("budget" in f) set("budget", optInt(f.budget));
  if ("leadType" in f) { if (!LEAD_TYPES.includes(f.leadType)) fail("bad_type"); set("leadType", f.leadType); }
  if ("purchaseTimeline" in f) { if (!TIMELINES.includes(f.purchaseTimeline)) fail("bad_timeline"); set("purchaseTimeline", f.purchaseTimeline); }
  if ("followUpAt" in f) { const d = f.followUpAt ? new Date(f.followUpAt) : null; if (d && Number.isNaN(d.getTime())) fail("bad_date"); set("followUpAt", d); }
  if ("partnerPaid" in f) set("partnerPaid", f.partnerPaid ? 1 : 0);
  if ("partnerPrice" in f) set("partnerPrice", optInt(f.partnerPrice));
  let newStatus: string | null = null;
  if ("status" in f) {
    if (!(LEAD_STATUSES as readonly string[]).includes(f.status)) fail("bad_status");
    if (f.status === "sent_to_partner") fail("use_assign");
    set("status", f.status);
    newStatus = f.status;
  }
  return { sets, args, newStatus };
}

/** POST leadUpdate {id, fields} (and legacy setStatus {id, status}). Status changes are logged in the history. */
export const updateLead: Action = async ({ pool, body }) => {
  const id = int(body.id);
  const fields = body.action === "setStatus" ? { status: body.status } : body.fields ?? {};
  const { sets, args, newStatus } = leadUpdates(fields);
  if (!id || !sets.length) fail("bad_request");
  await pool.query(`UPDATE leads SET ${sets.join(", ")} WHERE id = ?`, [...args, id]);
  if (newStatus) await addHistory(pool, id!, "status", newStatus);
  return { ok: true };
};

/** POST leadDelete {id, confirm: true} — removes the lead and its history (e.g. at the customer's request). */
export const deleteLead: Action = async ({ pool, body }) => {
  const id = int(body.id);
  if (!id || body.confirm !== true) fail("confirm_required");
  await pool.query("DELETE FROM lead_notes WHERE leadId = ?", [id]);
  await pool.query("DELETE FROM leads WHERE id = ?", [id]);
  return { ok: true };
};

/** POST noteAdd {id, kind, body}. Logging a call/message on a new lead moves it to "contacted". */
export const addNote: Action = async ({ pool, body }) => {
  const id = int(body.id), text = str(body.body, 4000), kind = NOTE_KINDS.includes(body.kind) ? body.kind : "note";
  if (!id || !text) fail("bad_request");
  await addHistory(pool, id!, kind, text);
  if (kind !== "note") await pool.query("UPDATE leads SET status = 'contacted' WHERE id = ? AND status = 'new'", [id]);
  return { ok: true };
};

/** POST assign {id, partnerId, consent: true, consentNote?, price?} — consented hand-off to an active partner. */
export const assignPartner: Action = async ({ pool, body }) => {
  const id = int(body.id), partnerId = int(body.partnerId), typed = str(body.consentNote, 300);
  if (!id || !partnerId) fail("bad_request");
  if (body.consent !== true) fail("consent_required");
  const lead = rows(await pool.query("SELECT id, leadType, partnerOptIn, anonymizedAt FROM leads WHERE id = ?", [id]))[0];
  if (!lead) fail("not_found", 404);
  if (lead.anonymizedAt) fail("lead_anonymized");
  const partner = rows(await pool.query("SELECT id, name, type, pricePerLead, webhookUrl FROM partners WHERE id = ? AND active = 1", [partnerId]))[0];
  if (!partner) fail("partner_not_found", 404);
  const note = handOffConsent(lead, partner.type, typed);
  if (!note) fail("consent_required");
  const price = body.price === "" || body.price == null ? partner.pricePerLead ?? null : int(body.price);
  await pool.query(
    "UPDATE leads SET partnerId = ?, partnerConsentAt = NOW(), partnerConsentNote = ?, partnerSentAt = NOW(), partnerPrice = ?, partnerPaid = 0, status = 'sent_to_partner' WHERE id = ?",
    [partnerId, note, price, id]);
  await addHistory(pool, id!, "partner", `הועבר ל${partner.name}. הסכמת לקוח: ${note}`);
  // Automatic delivery to the partner's system, when it gave us an address.
  if (partner.webhookUrl) {
    const full = rows(await pool.query(`SELECT ${LEAD_COLUMNS} ${FROM_LEADS} WHERE l.id = ?`, [id]))[0];
    const sent = await sendToPartner(partner.webhookUrl, full);
    await addHistory(pool, id!, "partner", sent.note);
    return { ok: true, delivered: sent.ok };
  }
  return { ok: true };
};

/** GET consentProof&id= — the consent certificate a partner can keep with the lead (see consentProof.ts). */
export const getConsentProof: Action = async ({ pool, query }) => {
  const id = int(query.id);
  const lead = rows(await pool.query(`SELECT ${LEAD_COLUMNS} ${FROM_LEADS} WHERE l.id = ?`, [id]))[0];
  if (!lead) fail("not_found", 404);
  return { certificate: consentCertificate(lead) };
};

/** Replaces contact details with placeholders; the row stays for statistics. */
const ANONYMIZE_SET = "fullName = 'נמחק', phone = '0000000000', city = NULL, consentIpHash = NULL, consentUserAgent = NULL, anonymizedAt = NOW()";

/** POST leadAnonymize {id, confirm: true} — erase a customer's details at their request, keeping anonymous statistics. */
export const anonymizeLead: Action = async ({ pool, body }) => {
  const id = int(body.id);
  if (!id || body.confirm !== true) fail("confirm_required");
  await pool.query(`UPDATE leads SET ${ANONYMIZE_SET} WHERE id = ?`, [id]);
  await pool.query("DELETE FROM lead_notes WHERE leadId = ?", [id]); // notes may contain personal details
  await addHistory(pool, id!, "note", "פרטי הקשר נמחקו לבקשת הלקוח");
  return { ok: true };
};

/**
 * POST purgeOld {confirm: true} — retention: anonymise leads older than RETENTION_MONTHS (privacy policy promise).
 * Leads still open with a partner deal (sent_to_partner, unpaid) are kept until settled.
 */
export const purgeOldLeads: Action = async ({ pool, body }) => {
  if (body.confirm !== true) fail("confirm_required");
  const [result] = await pool.query(
    `UPDATE leads SET ${ANONYMIZE_SET} WHERE anonymizedAt IS NULL AND createdAt < NOW() - INTERVAL ? MONTH
       AND NOT (status = 'sent_to_partner' AND partnerPaid = 0)`, [RETENTION_MONTHS]);
  return { ok: true, anonymized: (result as { affectedRows?: number }).affectedRows ?? 0 };
};

/** POST unassign {id} — cancels the hand-off; the lead goes back to "qualified". The consent record is kept. */
export const unassignPartner: Action = async ({ pool, body }) => {
  const id = int(body.id);
  if (!id) fail("bad_request");
  await pool.query("UPDATE leads SET partnerId = NULL, partnerSentAt = NULL, partnerPrice = NULL, partnerPaid = 0, status = 'qualified' WHERE id = ?", [id]);
  await addHistory(pool, id!, "partner", "השיוך לשותף בוטל");
  return { ok: true };
};
