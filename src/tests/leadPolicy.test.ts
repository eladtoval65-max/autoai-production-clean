/**
 * Lead policy and consent proof — the rules partners rely on before paying for a lead.
 */
import { describe, expect, it } from "vitest";
import { LEAD_CONSENT_TEXT } from "@shared/const";
import { COLLECTION_NOTICE, CONSENT_VERSION, PARTNER_CATEGORY, PARTNER_TYPES_FOR, leadQuality, partnerConsentText, type LeadType } from "@shared/leadPolicy";
import { handOffConsent } from "../../server/admin/handOff";
import { consentCertificate } from "../../server/admin/consentProof";
import { PARTNER_TYPES, LEAD_TYPES } from "../../server/admin/constants";
import { consentRecord, hashIp, leadRateLimited, requestIp } from "../../server/leads/intake";

describe("consent texts", () => {
  it("names the business category for every request type", () => {
    for (const t of LEAD_TYPES as LeadType[]) expect(partnerConsentText(t)).toContain(PARTNER_CATEGORY[t]);
  });
  it("partner consent says it is optional and limited to one business", () => {
    const text = partnerConsentText("financing");
    expect(text).toContain("אינה חובה");
    expect(text).toContain("לעסק אחד בלבד");
  });
  it("only maps request types to partner types that exist in the admin", () => {
    for (const types of Object.values(PARTNER_TYPES_FOR)) for (const t of types) expect(PARTNER_TYPES).toContain(t);
  });
  it("the notice covers the five items the law requires", () => expect(COLLECTION_NOTICE).toHaveLength(5));
  it("the base consent promises no transfer without separate consent", () => expect(LEAD_CONSENT_TEXT).toContain("בנפרד"));
});

describe("lead quality", () => {
  it("a hot lead scores 100", () => {
    expect(leadQuality({ purchaseTimeline: "now", budget: 120000, trimId: 3, city: "חיפה", matchScore: 90, partnerOptIn: true }).score).toBe(100);
  });
  it("a bare lead scores the base 20", () => expect(leadQuality({ purchaseTimeline: "unsure" }).score).toBe(20));
  it("a duplicate drops sharply and says why", () => {
    const q = leadQuality({ purchaseTimeline: "now", isDuplicate: true });
    expect(q.score).toBe(10);
    expect(q.reasons.join()).toContain("פנייה חוזרת");
  });
});

describe("partner hand-off consent", () => {
  const optedIn = { leadType: "insurance", partnerOptIn: 1 };
  it("the form opt-in covers a partner of the named category", () => expect(handOffConsent(optedIn, "insurance", "")).toBeTruthy());
  it("the form opt-in does NOT cover another category", () => expect(handOffConsent(optedIn, "dealer", "")).toBeNull());
  it("without opt-in a written note is required", () => {
    expect(handOffConsent({ leadType: "vehicle", partnerOptIn: 0 }, "dealer", "")).toBeNull();
    expect(handOffConsent({ leadType: "vehicle", partnerOptIn: 0 }, "dealer", "אישר בטלפון 20/10")).toBe("אישר בטלפון 20/10");
  });
});

describe("consent proof", () => {
  it("hashes the IP and never stores it", () => {
    const rec = consentRecord("vehicle", true, { headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1", "user-agent": "Test/1.0" } });
    expect(rec.consentIpHash).toBe(hashIp("203.0.113.9"));
    expect(JSON.stringify(rec)).not.toContain("203.0.113.9");
    expect(rec.consentVersion).toBe(CONSENT_VERSION);
    expect(rec.partnerOptInText).toBe(partnerConsentText("vehicle"));
  });
  it("records no partner text without opt-in", () => expect(consentRecord("vehicle", false, undefined).partnerOptInText).toBeNull());
  it("reads the first forwarded IP", () => expect(requestIp({ headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } })).toBe("1.2.3.4"));
  it("rate-limits a flood from one IP", () => {
    const t = 1_000_000;
    const results = Array.from({ length: 6 }, (_, i) => leadRateLimited("198.51.100.7", t + i));
    expect(results.slice(0, 5).every((r) => !r)).toBe(true);
    expect(results[5]).toBe(true);
  });
  it("the certificate contains both consents and the version", () => {
    const cert = consentCertificate({ id: 7, fullName: "דנה", phone: "0501234567", leadType: "vehicle", vehicleLabel: "Corolla", sourcePage: "landing",
      consentAt: "2026-10-20T08:00:00Z", consentVersion: CONSENT_VERSION, consentText: LEAD_CONSENT_TEXT, partnerOptIn: 1, partnerOptInText: partnerConsentText("vehicle") });
    expect(cert).toContain(LEAD_CONSENT_TEXT);
    expect(cert).toContain(partnerConsentText("vehicle"));
    expect(cert).toContain(CONSENT_VERSION);
  });
});

import { detailsSummary, parseDetails } from "@shared/leadPolicy";
import { isHttpsUrl, partnerPayload } from "../../server/admin/webhook";

describe("pricing details and partner delivery", () => {
  it("summarises only filled details", () => {
    expect(detailsSummary({ driverAge: 24, claims3y: "0" })).toBe("גיל הנהג הצעיר: 24 · תביעות ב־3 השנים האחרונות: 0");
    expect(detailsSummary(null)).toBe("");
  });
  it("parses stored JSON safely", () => {
    expect(parseDetails('{"loanAmount":90000}')).toEqual({ loanAmount: 90000 });
    expect(parseDetails("not json")).toBeNull();
  });
  it("accepts only https delivery addresses", () => {
    expect(isHttpsUrl("https://hooks.zapier.com/x")).toBe(true);
    expect(isHttpsUrl("http://example.com")).toBe(false);
    expect(isHttpsUrl("javascript:alert(1)")).toBe(false);
  });
  it("sends the partner the lead, its details and the consent certificate", () => {
    const p = partnerPayload({ id: 3, fullName: "דנה", phone: "0501234567", leadType: "insurance", vehicleLabel: "Corolla",
      details: '{"driverAge":30}', consentText: "x", partnerOptIn: 1, partnerOptInText: "y" });
    expect(p.details).toEqual({ driverAge: 30 });
    expect(p.consentCertificate).toContain("תעודת הסכמה");
    expect(p.phone).toBe("0501234567");
  });
});

import { MAKES } from "../data/generations";
import { adText, decodeCard, encodeCard, genForYear, yearsOfModel } from "../features/sell/model/sellCard";

describe("seller card", () => {
  const corolla = MAKES.find((m) => m.id === "toyota")!.models.find((m) => m.id === "corolla")!;
  it("round-trips through the link", () => {
    const q = encodeCard({ makeId: "toyota", modelId: "corolla", year: 2018, pt: genForYear(corolla, 2018)!.pt[0], price: 65000, km: 15000 });
    const c = decodeCard(q, MAKES)!;
    expect(c.model.id).toBe("corolla");
    expect(c.price).toBe(65000);
  });
  it("rejects tampered or incomplete links", () => {
    expect(decodeCard("m=toyota&o=corolla&y=2018&e=rocket&p=65000", MAKES)).toBeNull();
    expect(decodeCard("m=toyota&o=corolla&y=1990&e=petrol&p=65000", MAKES)).toBeNull();
    expect(decodeCard("m=toyota&o=corolla&y=2018&e=petrol&p=10", MAKES)).toBeNull();
  });
  it("lists years newest first", () => expect(yearsOfModel(corolla)[0]).toBeGreaterThan(yearsOfModel(corolla).at(-1)!));
  it("ad text is an estimate with the link", () => expect(adText("טויוטה קורולה 2018", 2345, "https://x/sell/card?a")).toMatch(/כ־₪2,350 בחודש.*https:\/\/x/));
});

import { STATIC_CATALOG } from "../data/catalogData";
import { comparePairs, findPair, monthlyAt, pairSlug } from "../features/compare/model/pairs";

describe("comparison pages", () => {
  const pairs = comparePairs();
  it("has unique, canonical slugs", () => {
    expect(new Set(pairs.map((p) => p.slug)).size).toBe(pairs.length);
    for (const p of pairs) expect(p.slug).toBe(pairSlug(p.b.id, p.a.id));
  });
  it("finds a pair by slug", () => expect(findPair(pairs[0].slug)?.slug).toBe(pairs[0].slug));
  it("monthly total at 15,000 km equals the catalog band", () => {
    for (const c of STATIC_CATALOG) expect(monthlyAt(c, 15000).total).toBe(c.bands[15000].total);
  });
});
