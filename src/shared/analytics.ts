/**
 * Anonymous funnel analytics + UTM capture. No personal data: a random per-tab id, event name,
 * page tag and utm_source only. Failures are swallowed so tracking never affects the UI.
 */
export type Utm = { utmSource?: string; utmMedium?: string; utmCampaign?: string };

const ss = {
  get(k: string) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
};

function sid() {
  let id = ss.get("co-sid");
  if (!id) { id = Math.random().toString(36).slice(2, 12) + Date.now().toString(36); ss.set("co-sid", id); }
  return id;
}

const clean = (v: string | null, max: number) => (v ? v.replace(/[^\w.\- ]/g, "").trim().slice(0, max) : "") || undefined;

/** Reads utm_* from the URL on first load of the tab and keeps them for the session. */
export function getUtm(): Utm {
  try {
    const p = new URLSearchParams(window.location.search);
    if (p.get("utm_source") || p.get("gclid") || p.get("fbclid")) {
      const utm: Utm = {
        utmSource: clean(p.get("utm_source"), 80) ?? (p.get("gclid") ? "google" : p.get("fbclid") ? "facebook" : undefined),
        utmMedium: clean(p.get("utm_medium"), 80) ?? (p.get("gclid") || p.get("fbclid") ? "cpc" : undefined),
        utmCampaign: clean(p.get("utm_campaign"), 120),
      };
      ss.set("co-utm", JSON.stringify(utm));
      return utm;
    }
    return JSON.parse(ss.get("co-utm") || "{}");
  } catch { return {}; }
}

const sent = new Set<string>();

/** Sends a funnel event. `once` events are deduplicated per tab. */
export function sendEvent(name: string, page = "home", once = true) {
  const key = `${name}:${page}`;
  if (once && (sent.has(key) || ss.get(`co-ev-${key}`))) return;
  sent.add(key); ss.set(`co-ev-${key}`, "1");
  try {
    const body = JSON.stringify({ name, page, sid: sid(), utm: getUtm().utmSource });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/event", new Blob([body], { type: "application/json" }));
    else void fetch("/api/event", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
  } catch { /* ignore */ }
}

/**
 * Anonymous asking price typed into the used-car calculator / seller card: make, model, generation, year, price
 * and the random tab id only. Sent after the visitor stops typing (see useReportPrice).
 */
export function reportPrice(r: { makeId: string; modelId: string; genCode: string; year: number; price: number; source: "calc" | "sell" }) {
  try {
    void fetch("/api/event", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: "price_report", sid: sid(), ...r }), keepalive: true }).catch(() => undefined);
  } catch { /* never affects the UI */ }
}
