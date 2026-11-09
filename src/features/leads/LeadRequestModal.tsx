import { LEAD_CONSENT_TEXT } from "@shared/const";
import { partnerConsentText, type LeadDetails } from "@shared/leadPolicy";
import { ContactViaField, detailsFor, LeadExtraFields } from "./LeadExtraFields";
import { CollectionNotice } from "./CollectionNotice";
import { trpc } from "@/lib/trpc";
import { useState, type FormEvent } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Link } from "wouter";
import { getUtm, sendEvent } from "../../shared/analytics";
import { trackPixel } from "../../shared/cookieConsent";

import type { LeadType as RequestType } from "@shared/leadPolicy";
type Timeline = "now" | "three_months" | "later" | "unsure";
/** One-tap answers; "just checking" is honest and lets the owner call serious buyers first. */
const TIMELINES: [Timeline, string][] = [["now", "עכשיו"], ["three_months", "תוך 3 חודשים"], ["later", "בהמשך השנה"], ["unsure", "רק בודק/ת"]];

export default function LeadRequestModal({
  vehicle,
  budget,
  sourcePage,
  onClose,
  defaultType,
  landingSlug,
  quizSummary,
}: {
  vehicle: { id: string; make: string; match: number };
  budget?: number;
  sourcePage: "recommendations" | "vehicle_details" | "comparison" | "plate_check" | "landing" | "model_page" | "sell_page" | "sell_card" | "compare_page" | "leasing_page";
  onClose: () => void;
  defaultType?: RequestType;
  landingSlug?: string;
  /** Readable questionnaire answers (home page only), attached to the lead so nobody is asked twice. */
  quizSummary?: string;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [leadType, setLeadType] = useState<RequestType>(defaultType ?? "vehicle");
  const [purchaseTimeline, setPurchaseTimeline] = useState<Timeline | null>(null); // required, one tap: the strongest seriousness signal
  const [consent, setConsent] = useState(false);
  const [details, setDetails] = useState<LeadDetails>({}); // optional insurance / financing details
  const [partnerConsent, setPartnerConsent] = useState(false); // separate and optional; never pre-ticked
  const [moreOpen, setMoreOpen] = useState(false); // optional questions stay folded: short form for everyone, detail for the serious
  const [website, setWebsite] = useState(""); // Spam honeypot.
  const [requestId] = useState(() => crypto.randomUUID());
  const [receivedId, setReceivedId] = useState<number | null>(null);
  const create = trpc.leads.create.useMutation();

  const fieldClass = "w-full min-h-12 rounded-xl border border-line bg-white px-3 py-2.5 text-[16px] text-ink outline-none focus:border-go";
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!consent || !purchaseTimeline) return;
    const extra = detailsFor(leadType, details);
    const withQuiz = quizSummary ? { ...extra, quizSummary } : extra;
    try {
      const saved = await create.mutateAsync({
        requestId,
        fullName: fullName.trim(),
        phone: phone.replace(/[\s-]/g, ""),
        city: city.trim() || undefined,
        leadType,
        trimId: /^\d+$/.test(vehicle.id) ? Number(vehicle.id) : undefined,
        vehicleLabel: vehicle.make,
        matchScore: vehicle.match || undefined,
        budget: budget || undefined,
        purchaseTimeline,
        sourcePage,
        consent: true,
        partnerConsent,
        details: withQuiz,
        website,
        ...getUtm(),
        landingSlug,
      });
      sendEvent("lead_submit", landingSlug ? `go:${landingSlug}` : "home", false);
      trackPixel("Lead"); // no personal data; no-op without cookie consent
      setReceivedId(saved.id);
    } catch {
      // The server's safe, user-facing message is displayed below.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 sm:items-center sm:p-5" dir="rtl" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label="בקשת יצירת קשר" className="relative max-h-[94vh] w-full max-w-[520px] overflow-y-auto rounded-t-3xl bg-white p-6 text-ink shadow-[var(--shadow-float)] sm:rounded-3xl sm:p-8">
        <button type="button" aria-label="סגירה" onClick={onClose} className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-mist hover:border-ink"><X size={16} /></button>
        {receivedId === null ? (
          <>
            <h2 className="pe-12 text-[1.7rem] leading-tight">רוצים שנחזור אליכם?</h2>
            <p className="mt-2 text-[15px] leading-6 text-muted">בקשה לגבי {vehicle.make.split(" · ")[0]}. פרטי הקשר נשמרים ב״כמה עולה״ ולא מועברים לאף עסק בלי הסכמה נפרדת שלכם.</p>
            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <label className="block text-[15px] font-semibold">מה מעניין אתכם?
                <select className={`mt-1 ${fieldClass}`} value={leadType} onChange={event => setLeadType(event.target.value as RequestType)}>
                  <option value="vehicle">בירור לגבי רכב</option><option value="used_car">רכב יד־שנייה</option>
                  <option value="financing">מימון</option><option value="insurance">ביטוח</option>
                  <option value="trade_in">טרייד־אין</option><option value="test_drive">נסיעת מבחן</option>
                  <option value="leasing">ליסינג פרטי</option>
                </select>
              </label>
              <label className="block text-[15px] font-semibold">שם מלא<input className={`mt-1 ${fieldClass}`} autoComplete="name" value={fullName} onChange={event => setFullName(event.target.value)} required minLength={2} maxLength={120} /></label>
              <label className="block text-[15px] font-semibold">טלפון נייד<input className={`mt-1 ${fieldClass}`} dir="ltr" autoComplete="tel" type="tel" inputMode="tel" placeholder="0501234567" pattern="05[0-9]{8}" value={phone} onChange={event => setPhone(event.target.value.replace(/[\s-]/g, ""))} required /></label>
              <fieldset>
                <legend className="text-[15px] font-semibold">מתי מתכננים לקנות?</legend>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  {TIMELINES.map(([value, text]) => (
                    <label key={value} className={`flex min-h-11 cursor-pointer items-center justify-center rounded-full border text-[15px] font-semibold ${purchaseTimeline === value ? "border-go bg-go text-white" : "border-line bg-white hover:border-ink"}`}>
                      <input type="radio" name="timeline" value={value} checked={purchaseTimeline === value} onChange={() => setPurchaseTimeline(value)} required className="sr-only" />{text}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="rounded-xl border border-line">
                <button type="button" onClick={() => setMoreOpen(v => !v)} aria-expanded={moreOpen} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start">
                  <span><span className="block text-[15px] font-bold">רוצים הצעה מדויקת יותר?</span><span className="block text-[13px] text-muted">עוד כמה שאלות קצרות · לא חובה</span></span>
                  <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${moreOpen ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {moreOpen && (
                  <div className="space-y-4 border-t border-line p-4">
                    <ContactViaField value={details} onChange={setDetails} />
                    <label className="block text-[15px] font-semibold">עיר / אזור<input className={`mt-1 ${fieldClass}`} autoComplete="address-level2" value={city} onChange={event => setCity(event.target.value)} maxLength={80} /></label>
                    <LeadExtraFields leadType={leadType} value={details} onChange={setDetails} fieldClass={fieldClass} />
                  </div>
                )}
              </div>
              <div className="absolute -left-[9999px]" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label></div>
              <label className="flex cursor-pointer items-start gap-3 border-t border-line pt-4 text-[14px] leading-6 text-muted">
                <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required className="mt-1 h-5 w-5 shrink-0" />
                <span>{LEAD_CONSENT_TEXT}</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-6 text-muted">
                <input type="checkbox" checked={partnerConsent} onChange={event => setPartnerConsent(event.target.checked)} className="mt-1 h-5 w-5 shrink-0" />
                <span><b className="text-ink">לא חובה:</b> {partnerConsentText(leadType)}</span>
              </label>
              <CollectionNotice />
              <Link href="/privacy" className="inline-block text-[14px] underline">מדיניות הפרטיות המלאה</Link>
              {create.error && <p role="alert" className="text-[15px] font-semibold text-alert">{/[\u0590-\u05FF]/.test(create.error.message) ? create.error.message : "השרת לא הגיב כרגע. נסו שוב בעוד דקה — הפרטים שמילאתם נשמרו בטופס."}</p>}
              <button type="submit" disabled={!consent || !purchaseTimeline || create.isPending} className="min-h-12 w-full rounded-full bg-go px-5 text-[17px] font-bold text-white hover:bg-go-deep disabled:opacity-50">{create.isPending ? "שומרים פנייה…" : "שליחת בקשה ל״כמה עולה״"}</button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center"><Check className="mx-auto mb-4 text-go" size={36} /><h2 className="text-[1.7rem]">הבקשה התקבלה</h2><p className="mt-3 text-[15px] leading-6 text-muted">מספר פנייה {receivedId}. הפרטים נשמרו במערכת ״כמה עולה״ לטיפול פנימי; אין הבטחה להצעת מחיר או להעברה לסוכנות.</p><button onClick={onClose} className="mt-6 min-h-11 rounded-full bg-go px-6 font-bold text-white hover:bg-go-deep">סגירה</button></div>
        )}
      </div>
    </div>
  );
}
