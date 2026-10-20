/**
 * Shapes returned by /api/admin (see server/admin). Dates arrive as ISO strings.
 */
export type SetupStatus = {
  dbConfigured: boolean; dbReachable: boolean; leadsTable: boolean; schemaErrors?: string[];
  contactEmail: boolean; emailAlerts: boolean; chatKey: boolean; siteUrl?: boolean;
};

export type Lead = {
  id: number; fullName: string; phone: string; city: string | null; leadType: string; vehicleLabel: string; budget: number | null;
  purchaseTimeline: string; sourcePage: string; utmSource: string | null; utmMedium: string | null; utmCampaign: string | null; landingSlug: string | null;
  status: string; followUpAt: string | null; partnerId: number | null; partnerName: string | null; partnerConsentAt: string | null; partnerConsentNote: string | null;
  partnerSentAt: string | null; partnerPrice: number | null; partnerPaid: number | boolean; consentText: string; consentAt: string; createdAt: string; noteCount: number;
  /** Consent proof and quality (schema v4; null on leads created before it). */
  consentVersion: string | null; partnerOptIn: number | boolean; partnerOptInText: string | null; duplicateOfId: number | null;
  qualityScore: number | null; anonymizedAt: string | null; trimId: number | null; matchScore: number | null;
};

/** One entry in a lead's history (call, WhatsApp, note, status change, partner hand-off). */
export type Note = { id: number; kind: string; body: string; createdAt: string };

export type Partner = {
  id: number; name: string; type: string; contactName: string | null; phone: string | null; email: string | null; region: string | null;
  pricePerLead: number | null; active: number | boolean; notes: string | null; leadCount: number; paidTotal: number; owedTotal: number;
};

export type LandingRow = {
  id: number; slug: string; title: string; subtitle: string | null; bullets: string | null; ctaText: string | null;
  leadType: string; active: number | boolean; leadCount: number; visits: number;
};

export type Stats = {
  days: number; byDay: { d: string; n: number }[]; byStatus: { k: string; n: number }[]; byType: { k: string; n: number }[]; bySource: { k: string; n: number }[];
  funnel: { k: string; n: number }[]; money: { paid: number; owed: number }; followUpsDue: number;
};

export type AdminTab = "leads" | "partners" | "landings" | "stats" | "setup";
