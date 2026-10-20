/**
 * Advertising-cookie consent + Meta Pixel. Rules (do not relax):
 *   - nothing from Meta loads until the visitor clicks "אישור" in the cookie banner;
 *   - no Pixel ID configured (VITE_META_PIXEL_ID) → no banner, no pixel at all;
 *   - we send only page views and a "Lead" event — never name, phone or any form field.
 * The choice is kept in this browser only (localStorage) and can be changed from the privacy page.
 */
const KEY = "co-cookie-consent";
export type Consent = "granted" | "denied" | null;

export const PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID ?? "").toString().replace(/\D/g, "") || null;

export function getConsent(): Consent {
  try { const v = localStorage.getItem(KEY); return v === "granted" || v === "denied" ? v : null; } catch { return null; }
}

const listeners = new Set<() => void>();
/** Lets the banner re-appear when the visitor asks to change the choice. */
export function onConsentChange(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }

export function setConsent(value: Consent) {
  try { if (value) localStorage.setItem(KEY, value); else localStorage.removeItem(KEY); } catch { /* private mode: choice lasts this page view */ }
  if (value === "granted") loadPixel();
  listeners.forEach((fn) => fn());
}

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[][]; loaded?: boolean; version?: string; push?: unknown };
declare global { interface Window { fbq?: Fbq; _fbq?: Fbq } }

/** Injects Meta's standard snippet once (only with an ID and consent). */
export function loadPixel() {
  if (!PIXEL_ID || getConsent() !== "granted" || window.fbq) return;
  const fbq = function (...args: unknown[]) { fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args); } as Fbq;
  fbq.queue = []; fbq.loaded = true; fbq.version = "2.0"; fbq.push = fbq;
  window.fbq = window._fbq = fbq;
  const s = document.createElement("script");
  s.async = true; s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
}

/** Standard event (e.g. "Lead") with no personal data. No-op without consent. */
export function trackPixel(event: "Lead" | "ViewContent") {
  if (window.fbq && getConsent() === "granted") window.fbq("track", event);
}
