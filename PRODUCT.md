# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People in Israel choosing their next car, new or used. Many are not car experts: they know their budget, how they drive, and what worries them (breakdowns, running costs, safety), but not trims, gearbox types or insurance pricing. They arrive before talking to a seller and want a short, trustworthy path to a shortlist they can defend to themselves and their family.

## Product Purpose

AutoAI is a Hebrew-first digital car advisor. A short multiple-choice questionnaire (budget, use, priority, powertrain, annual km) produces 3–5 ranked recommendations, each explained: why it fits, its weaknesses, an estimated purchase price with source and date, and the true monthly cost of ownership. Users compare, save, ask the AI advisor questions, and, only with explicit consent, request contact for a quote, financing, insurance or trade-in.

Success, first milestone: one end-to-end path that works reliably: enter → questionnaire → explained recommendations → comparison → consented lead stored in the database.

## Positioning

Total cost of ownership is the core. AutoAI ranks cars by what they cost per month to own (fuel or electricity + insurance estimate + maintenance + depreciation + registration ₪121), scaled to the user's annual kilometres, not by sticker price or a black-box "AI score". Every score can be broken down into its factors, and every figure is labelled as official, market, or estimate.

## Operating Context

- Israeli market: shekel prices, Israeli importers and models, government vehicle registry counts, Yad2-style used-car checks.
- Users often check on phones, mid-research, comparing with family.
- Lead recipients (later): importers, dealers, finance and insurance companies, trade-in services.

## Capabilities and Constraints

- Questionnaire with quick (3-step) and advanced (5-step) modes; 6-factor weighted scoring (budget 25%, use 20%, TCO 20%, reliability 15%, safety 10%, priority 10%) plus annual-km and powertrain adjustments.
- Results with filters and sorting (match, monthly TCO, price, economy), saved list, history, up to 3-car comparison with TCO ladder at 7k/15k/25k km, vehicle detail, analysis, monthly-cost + financing calculator, used-car checklist.
- AI advisor chat (Anthropic via /api/chat). Rate limit 12 requests/minute/IP. Never log API keys, request bodies or contact data.
- Leads require explicit consent with the documented LEAD_CONSENT_TEXT; no lead is sent to any company without clear consent. Admin pages protected by adminProcedure.
- Owner CRM at /admin (password session): lead search/filter/edit, notes & call history, follow-up reminders, partners with per-lead price and paid tracking, owner-editable landing pages at /go/:slug with UTM attribution, anonymous funnel stats (/api/event, no PII). Partner hand-off requires a separately recorded customer consent; the API rejects it otherwise.
- Catalog comes from the database (tRPC catalog.list); when unavailable the site shows a small demo fallback clearly marked as demo data.
- Stack: React + TypeScript + Tailwind + Vite, Express + tRPC + Drizzle on TiDB/MySQL, deployed on Vercel (Build Output API functions).
- Languages: Hebrew (primary, RTL) with an English option.

## Brand Commitments

- Name: "כמה עולה" in Hebrew / "CamaOla" in English (domain camaola.co.il). Replaced "AutoAI" (2026-10-19) because AutoAI is used by many companies worldwide (incl. an IBM product) and is hard to find in search.
- Voice: plain, honest Hebrew; explains trade-offs, never hypes; admits missing data.
- Look: international and consumer-friendly, in the category convention of Carwow / Autotrader / Edmunds (light ground, big car photos, clear cards, one high-contrast action colour). The owner rejected a locally-themed (Israeli street) world as "too Israeli" and asked for what converts best for customers.
- Questionnaire: use, priority and powertrain allow multiple answers with an explicit Continue step.

## Evidence on Hand

- Vehicle catalog seeds (batches 1–6) with TCO components in `scripts/seed-*.ts`; top Israeli 2025 sellers included.
- Vehicle photos: Wikimedia Commons, hotlinked with photographer/licence credit per image. No importer press photos yet.
- No testimonials, user counts, partner logos, press or reviews exist. Do not fabricate any.

## Product Principles

1. Source before quantity: no important figure without source, date and confidence; missing data is shown as missing.
2. Insurance is always an estimate, never a quote; prices are comparative estimates, not live offers.
3. Every recommendation is explainable down to its factors, including what's wrong with it.
4. Trust before conversion: consent is explicit and documented; nothing is passed on silently.
5. One path that works excellently beats many half-built features.

## Accessibility & Inclusion

Hebrew RTL first with correct bidi for numbers, ₪ amounts and Latin model names; readable by non-experts; works well on mobile.
