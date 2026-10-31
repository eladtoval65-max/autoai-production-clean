/**
 * Lead policy — the single source of truth for what a customer is told and agrees to when sending a request,
 * and for how a lead is scored. Pure functions only (no React, no database), shared by the form and the server.
 *
 * Why this exists: partners (dealers, importers, finance companies, insurance agencies, marketplaces) only buy
 * leads they can prove were given with consent. Every lead therefore records WHICH text version the customer saw,
 * WHEN, and — separately and optionally — whether they agreed to be passed to ONE business of a named category.
 *
 * Changing any customer-facing text below? Bump CONSENT_VERSION so old leads keep pointing at the text they saw.
 */

/** Version of the consent + notice texts. Format: date of the change (bump on every wording change). */
export const CONSENT_VERSION = "2026-10-20";

export type LeadType = "vehicle" | "financing" | "insurance" | "trade_in" | "used_car" | "test_drive" | "leasing";

/** The kind of business a customer may (optionally) agree to be passed to, per request type. */
export const PARTNER_CATEGORY: Record<LeadType, string> = {
  vehicle: "סוכנות או יבואן רכב",
  test_drive: "סוכנות או יבואן רכב",
  used_car: "סוחר או סוכנות רכב יד־שנייה",
  trade_in: "סוחר או סוכנות רכב לטרייד־אין",
  leasing: "חברת ליסינג",
  financing: "חברת מימון רכב בעלת רישיון",
  insurance: "סוכנות ביטוח בעלת רישיון",
};

/** Partner types (admin "partners" tab) allowed to receive a lead under the form opt-in, per request type. */
export const PARTNER_TYPES_FOR: Record<LeadType, string[]> = {
  vehicle: ["dealer", "importer"],
  test_drive: ["dealer", "importer"],
  used_car: ["used_lot", "dealer", "inspection"],
  trade_in: ["trade_in", "used_lot", "dealer"],
  leasing: ["leasing"],
  financing: ["finance"],
  insurance: ["insurance"],
};

/**
 * The separate, optional, unticked-by-default consent for passing details to ONE business of the named category.
 * One business only: an exclusive lead is worth more to the partner and less intrusive for the customer.
 */
export function partnerConsentText(leadType: LeadType): string {
  return `אני מסכים/ה ש״כמה עולה״ תעביר את שמי, הטלפון, העיר ופרטי הבקשה לעסק אחד בלבד מסוג ״${PARTNER_CATEGORY[leadType]}״, `
    + "שייצור איתי קשר בנוגע לבקשה הזו בלבד. ההסכמה אינה חובה, הבקשה תטופל גם בלעדיה, ואפשר לבטל אותה בכל עת.";
}

/**
 * The notice shown at the point of collection (Privacy Protection Law, section 11 as amended by Amendment 13):
 * voluntary or not, purpose, who holds the data, who receives it, and the right to see/correct/delete it.
 */
export const COLLECTION_NOTICE: { title: string; text: string }[] = [
  { title: "חובה?", text: "אין חובה חוקית למסור את הפרטים. בלי שם וטלפון לא נוכל לחזור אליכם; עיר אינה חובה." },
  { title: "למה?", text: "כדי לחזור אליכם בנוגע לבקשה שבחרתם, ולשפר את השירות. לא נשלח פרסומות בלי הסכמה נפרדת." },
  { title: "מי מחזיק?", text: "מפעיל ״כמה עולה״ (פרטים מלאים בעמוד הפרטיות)." },
  { title: "למי מועבר?", text: "לאף עסק, אלא אם סימנתם את ההסכמה הנפרדת — ואז לעסק אחד בלבד מהסוג שמופיע בה. ספקי אחסון ודיוור פועלים עבורנו בלבד." },
  { title: "הזכויות שלכם", text: "לעיין במידע, לתקן אותו או לבקש למחוק אותו — בפנייה לכתובת שבעמוד הפרטיות." },
];

/** How long a lead's contact details are kept before they are anonymised (stated in the privacy policy). */
export const RETENTION_MONTHS = 24;

/** A repeat request from the same phone within this many days is marked as a duplicate of the first one. */
export const DUPLICATE_WINDOW_DAYS = 30;

/**
 * Optional details that make a request worth more to the business that receives it. Never required; the form
 * shows only the fields for the chosen request type. Keys are validated on the server (routers.ts → leadDetailsSchema).
 *  - insurance: who drives, claims, the car (filled from the licence plate) and — most valuable — the month the
 *    current policy renews (an agency can quote at the right moment);
 *  - financing: amount, down payment, number of payments;
 *  - trade-in: the car being traded in (from the plate) and its mileage;
 *  - buying (new / used / test drive / leasing): whether financing or a trade-in is needed.
 */
export type LeadDetails = Partial<{
  driverAge: number; licenseYears: number; claims3y: "0" | "1" | "2+"; carYear: number; renewalMonth: number; // insurance
  plate: string; carName: string;                                         // insurance + trade-in (from the plate registry)
  loanAmount: number; downPayment: number; months: number;               // financing
  tradeInKm: number;                                                      // trade-in
  needsFinancing: "yes" | "no" | "unsure"; hasTradeIn: "yes" | "no";     // buying
  contactVia: "phone" | "whatsapp" | "any";                               // every request: how the customer prefers to be contacted
}>;

export type DetailField = {
  key: keyof LeadDetails; label: string;
  kind: "number" | "claims" | "month" | "plate" | "choice" | "auto";
  min?: number; max?: number; options?: [string, string][];
};

const YES_NO_UNSURE: [string, string][] = [["yes", "כן"], ["no", "לא"], ["unsure", "עוד לא יודע/ת"]];
const YES_NO: [string, string][] = [["yes", "כן"], ["no", "לא"]];
const BUYING: DetailField[] = [
  { key: "needsFinancing", label: "צריך/ה מימון לרכב?", kind: "choice", options: YES_NO_UNSURE },
  { key: "hasTradeIn", label: "יש רכב למסור בטרייד־אין?", kind: "choice", options: YES_NO },
];

export const DETAIL_FIELDS: Record<LeadType, DetailField[]> = {
  insurance: [
    { key: "renewalMonth", label: "באיזה חודש מתחדש הביטוח הנוכחי?", kind: "month" },
    { key: "plate", label: "מספר רישוי (ממלא את פרטי הרכב)", kind: "plate" },
    { key: "carName", label: "הרכב", kind: "auto" },
    { key: "carYear", label: "שנת הרכב", kind: "number", min: 1990, max: 2030 },
    { key: "driverAge", label: "גיל הנהג הצעיר", kind: "number", min: 17, max: 99 },
    { key: "licenseYears", label: "ותק נהיגה (שנים)", kind: "number", min: 0, max: 80 },
    { key: "claims3y", label: "תביעות ב־3 השנים האחרונות", kind: "claims" },
  ],
  financing: [
    { key: "loanAmount", label: "סכום מימון מבוקש (₪)", kind: "number", min: 1000, max: 2000000 },
    { key: "downPayment", label: "הון עצמי (₪)", kind: "number", min: 0, max: 2000000 },
    { key: "months", label: "מספר תשלומים", kind: "number", min: 6, max: 120 },
  ],
  trade_in: [
    { key: "plate", label: "מספר רישוי של הרכב שמוסרים", kind: "plate" },
    { key: "carName", label: "הרכב", kind: "auto" },
    { key: "carYear", label: "שנת הרכב", kind: "number", min: 1990, max: 2030 },
    { key: "tradeInKm", label: "קילומטראז׳", kind: "number", min: 0, max: 1000000 },
  ],
  vehicle: BUYING, used_car: BUYING, test_drive: BUYING, leasing: [BUYING[1]],
};

/** Asked on every request (not per type): many people don't answer calls from unknown numbers. */
export const CONTACT_FIELD: DetailField = { key: "contactVia", label: "איך נוח שנחזור אליכם?", kind: "choice", options: [["whatsapp", "וואטסאפ"], ["phone", "שיחת טלפון"], ["any", "לא משנה"]] };

const MONTHS_HE = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
export const monthHe = (m: number) => MONTHS_HE[m - 1] ?? String(m);

/** Months from `now` until the policy renews (0 = this month), or null. */
export function monthsToRenewal(renewalMonth: number | undefined, now = new Date()): number | null {
  if (!renewalMonth || renewalMonth < 1 || renewalMonth > 12) return null;
  return (renewalMonth - (now.getMonth() + 1) + 12) % 12;
}

/** One readable line of the filled details, for the admin, CSV, certificate and partner hand-off. */
export function detailsSummary(details: LeadDetails | null | undefined): string {
  if (!details) return "";
  const seen = new Set<string>();
  const all = [CONTACT_FIELD, ...Object.values(DETAIL_FIELDS).flat()].filter((f) => !seen.has(f.key) && seen.add(f.key));
  return all.filter((f) => details[f.key] != null && details[f.key] !== "").map((f) => {
    const v = details[f.key]!;
    const shown = f.kind === "month" ? monthHe(Number(v)) : f.kind === "choice" ? f.options?.find(([k]) => k === v)?.[1] ?? v : v;
    return `${f.label.replace(/\s*\(.*\)$/, "").replace(/\?$/, "")}: ${shown}`;
  }).join(" · ");
}

/** Parses the stored JSON safely (bad or empty → null). */
export function parseDetails(raw: unknown): LeadDetails | null {
  if (!raw) return null;
  try { const v = typeof raw === "string" ? JSON.parse(raw) : raw; return v && typeof v === "object" ? v as LeadDetails : null; } catch { return null; }
}

export type QualityInput = {
  purchaseTimeline: "now" | "three_months" | "later" | "unsure";
  budget?: number | null;
  trimId?: number | null;
  city?: string | null;
  matchScore?: number | null;
  partnerOptIn?: boolean;
  isDuplicate?: boolean;
  hasDetails?: boolean;
  details?: LeadDetails | null;
};

/**
 * Lead quality score 0–100 with the reasons behind it, so the owner (and a partner) can see WHY a lead is hot.
 * Weights are deliberately simple and explainable; they are a sorting aid, not a promise to a partner.
 */
export function leadQuality(input: QualityInput): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 20; // every consented lead with a valid mobile number starts here
  const add = (points: number, why: string) => { score += points; reasons.push(why); };
  const timeline = { now: [30, "קונה בקרוב"], three_months: [20, "קונה ב־3 החודשים הקרובים"], later: [5, "קונה בהמשך השנה"], unsure: [0, ""] } as const;
  const [tPoints, tWhy] = timeline[input.purchaseTimeline];
  if (tPoints) add(tPoints, tWhy);
  if (input.budget && input.budget > 0) add(15, "ציין תקציב");
  if (input.trimId) add(10, "בחר דגם ספציפי");
  if (input.city && input.city.trim()) add(5, "ציין אזור");
  if (input.matchScore && input.matchScore >= 80) add(5, "התאמה גבוהה לרכב");
  if (input.partnerOptIn) add(15, "הסכים להעברה לעסק");
  if (input.hasDetails) add(5, "מסר פרטים לתמחור");
  const d = input.details ?? {};
  const toRenewal = monthsToRenewal(d.renewalMonth);
  if (toRenewal != null && toRenewal <= 2) add(10, "הביטוח מתחדש בחודשיים הקרובים");
  if (d.plate) add(5, "פרטי רכב לפי מספר רישוי");
  if (d.needsFinancing === "yes") add(5, "צריך מימון");
  if (d.hasTradeIn === "yes") add(5, "יש רכב לטרייד־אין");
  if (input.isDuplicate) { score -= 40; reasons.push("פנייה חוזרת מאותו טלפון"); }
  return { score: Math.max(0, Math.min(100, score)), reasons };
}
