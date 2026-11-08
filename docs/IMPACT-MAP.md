# IMPACT-MAP — change X ⇒ also touch Y

The cross-file dependency edges that aren't visible from imports. **Before finishing a change,
scan the left column for anything you touched** — each edge is a follow-up the compiler won't
catch. Keep entries as one-line edges; when an edge grows a story, move the story to a doc and
link it.

Add an edge the first time one bites you (a reflection note or a review finding is the usual
source). Remove an edge only when the coupling is gone or a test now enforces it.

| If you change…                                     | …also touch                                                                 |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| _Example:_ a route/page file (add, rename, delete) | the generated route manifest, if your framework commits one; nav links; docs |
| _Example:_ an environment variable                 | `.env.example`, deploy config, the setup section of `README.md`             |
| _Example:_ a tracked analytics event               | the event registry/contract doc                                             |
| A dependency in `package.json` (or equivalent)     | EVERY committed lockfile, in the same commit                                |
| `src/data/generations.ts` (model/generation added or renamed) | `npm run facts:manifest`; data-facts keys; `COVERAGE.md` |
| `leadPolicy.ts` customer-facing text | bump `CONSENT_VERSION`; `PrivacyPage`; consent certificate (`server/admin/consentProof.ts`) |
| `LeadDetails` / `DETAIL_FIELDS` | zod schema in `routers.ts`; `detailsSummary`; admin, CSV, webhook, partner portal |
| a public page / route | `App.tsx` (lazy route), `scripts/build-seo.mjs` (sitemap + per-page HTML), footer links |
| an API function | `api-src/` + `scripts/build-vercel.mjs` functions and routes (≤12 functions on Hobby) |
| `src/data/energyPrices.json` | `npm run data:build`, guides, model-page fuel costs |
| `schemaSetup.ts` | bump `SCHEMA_VERSION`; local e2e on a fresh DB |
