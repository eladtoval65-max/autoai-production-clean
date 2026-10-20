/**
 * Consent certificate — a plain-text record that travels with a lead to a partner.
 * Lead buyers (dealers, importers, finance companies, insurance agencies) ask for exactly this before paying:
 * the exact text the customer agreed to, its version, when, from which page, and the separate hand-off consent.
 * Pure function: takes a lead row (LEAD_COLUMNS shape) and returns the text. No database, no I/O.
 */

type LeadRow = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const iso = (d: unknown) => (d ? new Date(d as string).toISOString().replace("T", " ").slice(0, 19) + " UTC" : "—");

/** Builds the certificate text. Phone is included because the partner needs it to call; send it only to that partner. */
export function consentCertificate(lead: LeadRow): string {
  const optIn = Number(lead.partnerOptIn) === 1;
  const lines = [
    "תעודת הסכמה — ״כמה עולה״",
    "==========================",
    `מספר פנייה: ${lead.id}`,
    `שם: ${lead.fullName}`,
    `טלפון: ${lead.phone}`,
    `סוג בקשה: ${lead.leadType} · רכב: ${lead.vehicleLabel}`,
    `מקור: ${lead.sourcePage}${lead.landingSlug ? ` · /go/${lead.landingSlug}` : ""}${lead.utmSource ? ` · ${lead.utmSource}` : ""}`,
    "",
    "1) הסכמה לפנייה חוזרת מ״כמה עולה״",
    `   זמן: ${iso(lead.consentAt)} · גרסת נוסח: ${lead.consentVersion ?? "לפני 2026-10-20"}`,
    `   נוסח: ${lead.consentText}`,
    "",
    "2) הסכמה נפרדת להעברה לעסק",
    optIn ? `   ניתנה בטופס, באותו זמן. נוסח: ${lead.partnerOptInText}` : "   לא ניתנה בטופס.",
    lead.partnerConsentAt ? `   תיעוד ההעברה: ${iso(lead.partnerConsentAt)} · ${lead.partnerConsentNote}` : "   הפנייה עוד לא הועברה לעסק.",
    lead.partnerName ? `   הועבר אל: ${lead.partnerName}` : "",
    "",
    "3) טביעת בקשה",
    `   IP (גיבוב SHA-256, לא הכתובת עצמה): ${lead.consentIpHash ?? "—"}`,
    `   דפדפן: ${lead.consentUserAgent ?? "—"}`,
    "",
    "הלקוח רשאי לבטל את ההסכמה בכל עת. עם קבלת בקשת ביטול או מחיקה יש להפסיק לפנות אליו ולמחוק את פרטיו.",
    `הופק: ${iso(new Date())}`,
  ];
  return lines.filter((l, i) => l !== "" || lines[i - 1] !== "").join("\n");
}
