# INVARIANTS — must-never-break facts

The registry of rules that keep the product correct. Each entry: the one-line rule, where it
lives, and the test/guard that catches a violation (when one exists).

**Before merging a change that touches one of these areas, check the change against this list** —
`senior-code-review` does this explicitly. When a change legitimately alters an invariant, update
this file in the same PR and record why in `DECISIONS.md`.

Rules for this file:

- Append-only numbering: take the next free `I<n>`, never reuse a retired number (mark it
  `RETIRED — <why>` instead).
- One row per invariant. If it needs a story, the story lives in a doc and the row links it.
- A row without a guard is allowed, but say "no guard yet" so the gap is visible.

| #   | Invariant                                                                                   | Lives in            | Guard                      |
| --- | ------------------------------------------------------------------------------------------- | ------------------- | -------------------------- |
| I1  | ANTHROPIC_API_KEY, DATABASE_URL, RESEND_API_KEY, ADMIN_PASSWORD are never logged, returned, or shipped to the client bundle; the chat handler never logs the key, request body or contact data. | `api-src/`, `server/`, `dbConnection.ts` | review rule (no guard yet) |
| I2  | A lead is stored only with explicit consent and the versioned consent text (`LEAD_CONSENT_TEXT`, `CONSENT_VERSION`); bump the version on any wording change. | `const.ts`, `leadPolicy.ts`, `routers.ts` | `src/tests/leadPolicy.test.ts` |
| I3  | A lead goes to a business only with the separate, unticked partner opt-in (one business of the named category) — or a documented consent note by the owner. | `server/admin/handOff.ts`, `leads.ts` | `leadPolicy.test.ts` (hand-off rule) |
| I4  | Insurance is always shown as an estimate, never as a quote; used-car prices are labelled "הערכה" unless visitor-reported (≥5 reports). | UI copy, `usedValue.ts`, `driver.ts` | review rule |
| I5  | Never publish unverified data as fact: every facts item (issue, consumption, NCAP, launch price) carries a real source URL. | `data-facts/*.json` | `npm run facts:validate` |
| I6  | Admin actions go through the admin auth (session cookie); public endpoints are rate-limited (chat 12/min/IP, leads 5/10min, feedback 5/10min, partner 60/min). | `server/admin/`, `api-src/` | e2e scripts (local) |
| I7  | Never rename a model id or generation code in `src/data/generations.ts` — data-facts, price reports and URLs are keyed by them. | `src/data/generations.ts` | `facts:validate` (unknown keys) |
| I8  | Schema changes are append-only statements in `schemaSetup.ts` with a `SCHEMA_VERSION` bump; never edit or drop a shipped statement. | `schemaSetup.ts` | review rule |
| I9  | Partner portal keys are stored only as SHA-256 hashes and travel in the URL fragment + `x-partner-key` header (never in a query string or log). | `server/partner/portal.ts` | review rule |
| I10 | Price reports store no personal data (make, model, gen, year, price, random tab id only). | `server/prices/reports.ts` | `logic.test.ts` |
