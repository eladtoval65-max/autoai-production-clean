/**
 * Lead intake helpers used by the public `leads.create` procedure (routers.ts):
 *   - request fingerprint for the consent proof (hashed IP + browser), never the raw IP,
 *   - a small per-IP rate limit against form spam,
 *   - the consent-proof fields and the quality score for a new lead.
 * Security rule (do not relax): never log the phone, name, IP or request body.
 */
import { createHash } from "node:crypto";
import { LEAD_CONSENT_TEXT } from "@shared/const";
import { CONSENT_VERSION, leadQuality, partnerConsentText, type LeadType, type QualityInput } from "@shared/leadPolicy";

type HeaderBag = { headers?: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } };

/** First IP from x-forwarded-for (set by Vercel), else the socket address. */
export function requestIp(req: HeaderBag | undefined): string {
  const fwd = req?.headers?.["x-forwarded-for"];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd ?? "").split(",")[0].trim();
  return first || req?.socket?.remoteAddress || "unknown";
}

/**
 * One-way hash of the IP, salted so it can't be reversed by trying all addresses.
 * Enough to show a partner "this consent came from a real browser request", without storing the IP itself.
 */
export function hashIp(ip: string): string {
  const salt = process.env.LEAD_HASH_SALT || "camaola-consent-v1";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

/** Browser identification string, trimmed to the column size. */
export function userAgentOf(req: HeaderBag | undefined): string | null {
  const ua = req?.headers?.["user-agent"];
  const text = Array.isArray(ua) ? ua[0] : ua;
  return text ? text.slice(0, 255) : null;
}

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/** True when this IP already sent MAX_PER_WINDOW requests in the last 10 minutes (per server instance). */
export function leadRateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // memory guard on long-lived instances
  return recent.length > MAX_PER_WINDOW;
}

/** Everything stored with a lead that proves what the customer agreed to, and when. */
export function consentRecord(leadType: LeadType, partnerOptIn: boolean, req: HeaderBag | undefined) {
  return {
    consentText: LEAD_CONSENT_TEXT,
    consentAt: new Date(),
    consentVersion: CONSENT_VERSION,
    partnerOptIn,
    partnerOptInText: partnerOptIn ? partnerConsentText(leadType) : null,
    consentIpHash: hashIp(requestIp(req)),
    consentUserAgent: userAgentOf(req),
  };
}

/** Quality score stored on the lead (reasons are recomputed on demand, so only the number is kept). */
export const qualityScoreOf = (input: QualityInput) => leadQuality(input).score;
