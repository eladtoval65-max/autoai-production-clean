/**
 * Partners: businesses that may receive leads (with the customer's separate consent), with price per lead and paid/owed totals.
 */
import { PARTNER_TYPES } from "./constants";
import { fail, int, optInt, optStr, str, type Action } from "./http";
import { newPortalKey } from "../partner/portal";
import { isHttpsUrl } from "./webhook";

/** GET partners — active first, with lead count and money paid / still owed. */
export const listPartners: Action = async ({ pool }) => {
  const [result] = await pool.query(`SELECT p.id, p.name, p.type, p.contactName, p.phone, p.email, p.region, p.pricePerLead, p.active, p.notes, p.webhookUrl, p.createdAt,
      (p.portalTokenHash IS NOT NULL) AS hasPortal,
      (SELECT COUNT(*) FROM leads l WHERE l.partnerId = p.id) AS leadCount,
      (SELECT COALESCE(SUM(l.partnerPrice),0) FROM leads l WHERE l.partnerId = p.id AND l.partnerPaid = 1) AS paidTotal,
      (SELECT COALESCE(SUM(l.partnerPrice),0) FROM leads l WHERE l.partnerId = p.id AND l.partnerPaid = 0) AS owedTotal
    FROM partners p ORDER BY p.active DESC, p.name`);
  return { partners: result };
};

/** POST partnerSave {partner} — creates when there's no id, updates otherwise. */
export const savePartner: Action = async ({ pool, body }) => {
  const p = body.partner ?? {};
  const name = str(p.name, 120);
  if (name.length < 2 || !PARTNER_TYPES.includes(p.type)) fail("bad_partner");
  const webhookUrl = optStr(p.webhookUrl, 300);
  if (webhookUrl && !isHttpsUrl(webhookUrl)) fail("bad_webhook");
  const values = [name, p.type, optStr(p.contactName, 120), optStr(p.phone, 20), optStr(p.email, 160), optStr(p.region, 80), optInt(p.pricePerLead), p.active === false ? 0 : 1, optStr(p.notes, 2000), webhookUrl];
  const id = int(p.id);
  if (id) await pool.query("UPDATE partners SET name=?, type=?, contactName=?, phone=?, email=?, region=?, pricePerLead=?, active=?, notes=?, webhookUrl=? WHERE id=?", [...values, id]);
  else await pool.query("INSERT INTO partners (name, type, contactName, phone, email, region, pricePerLead, active, notes, webhookUrl) VALUES (?,?,?,?,?,?,?,?,?,?)", values);
  return { ok: true };
};

/** POST partnerPortalLink {id} — creates a new secret portal key (shown once) and revokes the previous link. */
export const createPortalLink: Action = async ({ pool, body }) => {
  const id = int(body.id); if (!id) fail("bad_request");
  const { key, hash } = newPortalKey();
  const [res] = await pool.query("UPDATE partners SET portalTokenHash = ? WHERE id = ?", [hash, id]) as unknown as [{ affectedRows: number }];
  if (!res.affectedRows) fail("partner_not_found");
  return { key };
};
