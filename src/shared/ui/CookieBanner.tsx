/**
 * Bottom banner asking for advertising-cookie consent. Shown only when a Meta Pixel is configured and the visitor
 * hasn't chosen yet. Both buttons are equally prominent (no dark pattern); "דחייה" keeps the site fully usable.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getConsent, loadPixel, onConsentChange, PIXEL_ID, setConsent } from "../cookieConsent";

export function CookieBanner() {
  const [choice, setChoice] = useState(getConsent);
  useEffect(() => { loadPixel(); return onConsentChange(() => setChoice(getConsent())); }, []);
  if (!PIXEL_ID || choice) return null;
  return (
    <div role="region" aria-label="הסכמה לעוגיות" dir="rtl" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white p-4 shadow-[var(--shadow-float)]">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3">
        <p className="max-w-[70ch] text-[15px]">נשמח להשתמש בעוגיות של פייסבוק (Meta) כדי למדוד אילו פרסומות עובדות. לא נשלחים שם, טלפון או פרטי טופס. <Link href="/privacy" className="underline">פרטים</Link></p>
        <div className="flex gap-2">
          <button onClick={() => setConsent("granted")} className="min-h-11 rounded-full bg-go px-5 font-bold text-white hover:bg-go-deep">אישור</button>
          <button onClick={() => setConsent("denied")} className="min-h-11 rounded-full border border-ink bg-white px-5 font-bold text-ink hover:bg-mist">דחייה</button>
        </div>
      </div>
    </div>
  );
}
