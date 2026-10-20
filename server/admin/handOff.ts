/**
 * Partner hand-off rule (pure, unit-tested). Kept apart from leads.ts so it can be tested without a database.
 */
import { PARTNER_TYPES_FOR, type LeadType } from "@shared/leadPolicy";

/**
 * Which consent covers this hand-off, or null when there is none:
 *   - "form": the customer ticked the separate opt-in, and the partner is of the category it named;
 *   - "manual": the owner records how/when the customer agreed (call, WhatsApp…), at least 5 characters.
 */
export function handOffConsent(lead: { leadType: string; partnerOptIn: unknown }, partnerType: string, note: string): string | null {
  const allowed = PARTNER_TYPES_FOR[lead.leadType as LeadType] ?? [];
  if (Number(lead.partnerOptIn) === 1 && allowed.includes(partnerType)) return note || "הסכמה נפרדת בטופס הפנייה";
  return note.length >= 5 ? note : null;
}

