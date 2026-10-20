/** Lead types the landing page can preselect in the form. */
export type LeadType = "vehicle" | "financing" | "insurance" | "trade_in" | "used_car" | "test_drive";

/** Public content of an owner-edited landing page (from /api/landing). */
export type LandingContent = { slug: string; title: string; subtitle: string | null; bullets: string[]; ctaText: string | null; leadType: LeadType };

/** Button text when the owner left it empty. */
export const DEFAULT_CTA = "רוצים שנחזור אליכם?";
