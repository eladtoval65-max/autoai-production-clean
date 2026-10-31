/**
 * Partner portal ("אזור שותף"): a business sees ONLY the leads that were handed to it (with the customer's
 * consent) and reports what happened with each one. Access is a secret link created by the owner in the admin;
 * only a SHA-256 hash of the key is stored, and creating a new link revokes the old one.
 * Outcomes feed back into the owner's CRM (lead history + stats), and "invalid" is a request not to be charged.
 * Never log the key, names or phones.
 */
import { createHash, randomBytes } from "node:crypto";
import type { Pool } from "mysql2/promise";
import { detailsSummary, parseDetails } from "@shared/leadPolicy";

export const OUTCOMES = ["contacted", "no_answer", "invalid", "won", "lost"] as const;
export type Outcome = (typeof OUTCOMES)[number];
export const OUTCOME_HE: Record<Outcome, string> = {
  contacted: "דיברנו איתו", no_answer: "לא עונה", invalid: "פנייה לא תקינה (לבקשת זיכוי)", won: "נסגרה עסקה", lost: "לא רלוונטי",
};

export const hashKey = (key: string) => createHash("sha256").update(`partner:${key}`).digest("hex");

/** New random key (shown once to the owner) and the hash to store. */
export function newPortalKey(): { key: string; hash: string } {
  const key = randomBytes(24).toString("base64url");
  return { key, hash: hashKey(key) };
}

const rows = <T>(r: unknown) => (r as [T[], unknown])[0];

type PartnerRow = { id: number; name: string; type: string };

/** The active partner for a key, or null. */
export async function partnerForKey(pool: Pool, key: string): Promise<PartnerRow | null> {
  if (!/^[\w-]{20,64}$/.test(key)) return null;
  return rows<PartnerRow>(await pool.query("SELECT id, name, type FROM partners WHERE portalTokenHash = ? AND active = 1", [hashKey(key)]))[0] ?? null;
}

/** The partner's leads, newest first (anonymised leads show no contact details). */
export async function partnerLeads(pool: Pool, partnerId: number) {
  const list = rows<Record<string, unknown>>(await pool.query(
    `SELECT id, fullName, phone, city, leadType, vehicleLabel, budget, purchaseTimeline, details, qualityScore,
            partnerSentAt, partnerOutcome, partnerOutcomeAt, partnerNote, anonymizedAt
       FROM leads WHERE partnerId = ? ORDER BY partnerSentAt DESC, id DESC LIMIT 300`, [partnerId]));
  return list.map(({ details, anonymizedAt, ...l }) => ({
    ...l,
    ...(anonymizedAt ? { fullName: "נמחק לבקשת הלקוח", phone: null, city: null } : {}),
    detailsText: detailsSummary(parseDetails(details)) || null,
  }));
}

/** Records the partner's outcome on one of ITS leads, and adds a line to the lead's history for the owner. */
export async function setOutcome(pool: Pool, partner: PartnerRow, leadId: number, outcome: Outcome, note: string): Promise<boolean> {
  const [res] = await pool.query("UPDATE leads SET partnerOutcome = ?, partnerOutcomeAt = NOW(), partnerNote = ? WHERE id = ? AND partnerId = ?",
    [outcome, note || null, leadId, partner.id]) as unknown as [{ affectedRows: number }];
  if (!res.affectedRows) return false;
  await pool.query("INSERT INTO lead_notes (leadId, kind, body) VALUES (?, 'note', ?)",
    [leadId, `${partner.name} עדכן/ה: ${OUTCOME_HE[outcome]}${note ? ` — ${note}` : ""}`]);
  return true;
}
