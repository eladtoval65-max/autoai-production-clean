/**
 * CSV export of the visible leads (UTF-8 with BOM so Excel shows Hebrew correctly).
 * Contains personal data — the UI tells the owner to store the file securely.
 */
import { detailsSummary, parseDetails } from "@shared/leadPolicy";
import { LEAD_TYPE, STATUS, TIMELINE } from "../../labels";
import type { Lead } from "../../types";

/** Quote a cell and neutralise spreadsheet formula injection (=, +, @, -, tab at the start). */
function csvCell(value: unknown): string {
  const text = String(value ?? "").replace(/[\r\n]+/g, " ");
  const safe = /^[=+@\-\t]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

const HEADER = ["מספר", "שם", "טלפון", "עיר", "סוג פנייה", "רכב", "תקציב", "מועד רכישה", "סטטוס", "מקור", "קמפיין", "שותף", "מחיר ליד", "שולם", "תאריך", "נוסח הסכמה", "זמן הסכמה", "הסכמה לשותף", "גרסת נוסח", "הסכמה נפרדת בטופס", "ציון איכות", "כפול של", "פרטים לתמחור"];

const rowFor = (r: Lead) => [
  r.id, r.fullName, r.phone, r.city, LEAD_TYPE[r.leadType] ?? r.leadType, r.vehicleLabel, r.budget, TIMELINE[r.purchaseTimeline] ?? r.purchaseTimeline,
  STATUS[r.status] ?? r.status, r.utmSource || r.landingSlug || r.sourcePage, r.utmCampaign, r.partnerName, r.partnerPrice, r.partnerPaid ? "כן" : "",
  r.createdAt, r.consentText, r.consentAt, r.partnerConsentNote, r.consentVersion, Number(r.partnerOptIn) === 1 ? r.partnerOptInText : "", r.qualityScore, r.duplicateOfId, detailsSummary(parseDetails(r.details)),
];

/** Builds the file and triggers a download. */
export function downloadLeadsCsv(leads: Lead[]) {
  if (!leads.length) return;
  const csv = "﻿" + [HEADER, ...leads.map(rowFor)].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = href;
  a.download = `camaola-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}
