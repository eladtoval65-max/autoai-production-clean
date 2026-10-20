/**
 * Automatic hand-off: POSTs a consented lead to the partner's own system (CRM / Zapier / Make) as JSON.
 * Called only from assignPartner, i.e. after the consent rule passed. Rules (do not relax):
 *   - https only; 8-second timeout; one attempt (the owner can resend by unassigning and assigning again);
 *   - the payload and the URL are never logged — only the HTTP status.
 */
import { detailsSummary, parseDetails } from "@shared/leadPolicy";
import { consentCertificate } from "./consentProof";

type LeadRow = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

/** True for a syntactically valid https URL (the only kind we store or call). */
export function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 300) return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

/** The JSON a partner receives. Field names are English so any CRM can map them. */
export function partnerPayload(lead: LeadRow) {
  const details = parseDetails(lead.details);
  return {
    source: "camaola",
    leadId: lead.id,
    fullName: lead.fullName,
    phone: lead.phone,
    city: lead.city ?? null,
    requestType: lead.leadType,
    vehicle: lead.vehicleLabel,
    budget: lead.budget ?? null,
    purchaseTimeline: lead.purchaseTimeline,
    details,
    detailsText: detailsSummary(details) || null,
    qualityScore: lead.qualityScore ?? null,
    createdAt: lead.createdAt,
    consentCertificate: consentCertificate(lead),
  };
}

/** Sends the lead; returns a short Hebrew result for the lead's history. Never throws. */
export async function sendToPartner(url: string, lead: LeadRow): Promise<{ ok: boolean; note: string }> {
  if (!isHttpsUrl(url)) return { ok: false, note: "שליחה אוטומטית: כתובת לא תקינה" };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": "CamaOla-Leads/1" },
      body: JSON.stringify(partnerPayload(lead)),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? { ok: true, note: "נשלח אוטומטית למערכת השותף" } : { ok: false, note: `שליחה אוטומטית נכשלה (${res.status}) — לשלוח ידנית` };
  } catch (e) {
    console.error("[Partner webhook] failed", e instanceof Error ? e.name : "unknown");
    return { ok: false, note: "שליחה אוטומטית נכשלה (אין תגובה) — לשלוח ידנית" };
  }
}
