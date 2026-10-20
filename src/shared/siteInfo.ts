/**
 * Who operates the site — shown on the privacy, terms, accessibility and about pages.
 * Set in Vercel (Project → Settings → Environment Variables, then redeploy):
 *   VITE_OPERATOR_NAME     legal name of the person or company (e.g. "אלעד טובל" / "כמה עולה בע״מ")
 *   VITE_OPERATOR_ID       ע״מ / ח״פ number
 *   VITE_CONTACT_EMAIL     public contact address (default: the site's dedicated inbox below)
 *   VITE_OPERATOR_ADDRESS  postal address (optional)
 * Missing values are shown as "will be published" — never invented.
 */
const env = import.meta.env;
const clean = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

export const SITE = {
  brand: "כמה עולה",
  operatorName: clean(env.VITE_OPERATOR_NAME),
  operatorId: clean(env.VITE_OPERATOR_ID),
  contactEmail: clean(env.VITE_CONTACT_EMAIL) ?? "kamaolea1@gmail.com", // the site's dedicated, public inbox
  address: clean(env.VITE_OPERATOR_ADDRESS),
};

/** True when the operator details a partner or regulator expects are all published. */
export const operatorComplete = Boolean(SITE.operatorName && SITE.operatorId && SITE.contactEmail);

export const PENDING = "יפורסם לפני ההשקה המסחרית";
