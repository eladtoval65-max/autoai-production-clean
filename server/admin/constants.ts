/**
 * Allowed values accepted from the admin UI. Anything else is rejected before touching the database.
 * Keep in sync with the labels in src/features/admin/labels.ts.
 */
export const LEAD_TYPES = ["vehicle", "financing", "insurance", "trade_in", "used_car", "test_drive", "leasing"];
export const TIMELINES = ["now", "three_months", "later", "unsure"];
export const NOTE_KINDS = ["note", "call", "whatsapp", "email", "meeting"];
export const PARTNER_TYPES = ["dealer", "importer", "finance", "insurance", "inspection", "trade_in", "used_lot", "leasing", "other"];
/** Funnel steps in order (anonymous site events). */
export const FUNNEL = ["visit", "quiz_start", "quiz_complete", "results_view", "lead_open", "lead_submit"];
/** Statuses after which a follow-up is no longer "due". */
export const CLOSED_STATUSES = ["won", "lost", "closed"];

/** Columns returned for a lead (with its partner name and history count). `l` = leads, `p` = partners. */
export const LEAD_COLUMNS = `l.id, l.fullName, l.phone, l.city, l.leadType, l.vehicleLabel, l.budget, l.purchaseTimeline, l.sourcePage,
  l.utmSource, l.utmMedium, l.utmCampaign, l.landingSlug, l.status, l.followUpAt, l.partnerId, l.partnerConsentAt, l.partnerConsentNote,
  l.partnerSentAt, l.partnerPrice, l.partnerPaid, l.consentText, l.consentAt, l.createdAt, l.updatedAt, p.name AS partnerName,
  l.consentVersion, l.partnerOptIn, l.partnerOptInText, l.duplicateOfId, l.qualityScore, l.anonymizedAt, l.trimId, l.matchScore, l.consentIpHash, l.consentUserAgent, l.details,
  (SELECT COUNT(*) FROM lead_notes n WHERE n.leadId = l.id) AS noteCount`;
