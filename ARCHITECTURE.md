# Architecture — כמה עולה (CamaOla)

How the code is organised and the rules for adding to it. Read this before changing anything.

## Principles
1. **Feature folders.** Each page/feature owns its folder under `src/features/<feature>/`. A feature never imports from another feature's internals (exception: `leads/LeadRequestModal`, the shared consented lead form).
2. **Three kinds of file per feature:**
   - `components/` — React components. Small (one job each, ideally < 120 lines), presentational where possible, props typed, one comment above each component saying what it shows.
   - `hooks/` — state and side effects (`useQuiz`, `useLeads`, `useAdvisorChat`…). Components call hooks; hooks call `model/` and the network.
   - `model/` — **pure functions** (no React, no fetch): scoring, cost maths, comparison winners, formatting. These are unit-tested in `src/tests`.
3. **Page files only wire things together** (`HomePage.tsx`, `AdminPage.tsx`, `BrowsePage.tsx`, `LandingPage.tsx`). No business logic in them.
4. **Shared code** lives in `src/shared/` (UI atoms, i18n, analytics, photos, class recipes). Only generic things go there.
5. **Data** lives in `src/data/` and is never hand-edited except `generations.ts` (see "Data" below).
6. **Comments explain *why* and *what*,** in English, at the top of every file and above every exported function/component. Hebrew is for user-facing text only.

## Folder map
```
src/
  data/
    generations.ts        make → model → generation since 2010 (browse-by-make). Edited by people and the daily agent.
    catalogData.ts        GENERATED recommendation catalog (scripts/build-static-catalog.mjs). Do not edit.
  shared/
    i18n.tsx              he/en dictionary, LangProvider, shekel()
    analytics.ts          anonymous funnel events + UTM capture (no personal data)
    vehicleImages.ts      car photos (Wikipedia lead image → Commons fallback)
    format.ts, styles.ts  pure formatters; Tailwind class recipes (card, btnPrimary…)
    ui/                   Stars, Score, MonthlyTag, Money, CodeChip, CarPhoto, SaveBtn, Slider, BrandMark…
  features/
    home/                 "/" questionnaire → ranked results → detail / compare / saved / analysis / tools, plate check, AI advisor
      HomePage.tsx        wiring only
      types.ts            Car, Ranked, Answers, Tab, Ladder
      model/              scoring, cost (TCO), compare, finance, plate, catalog mapping, questions, fuel labels, tracking, share
      hooks/              useQuiz, useCatalog, useShortlist, useQuizCompletion, useCostLadder, usePlateLookup, useAdvisorChat
      components/         Hero/Finder/LeaderPanel, results/, detail/, compare/, workspace/, plate/, advisor/, CostPanel, CostBreakdown
    browse/               "/cars…" makes → models → generations, used-car monthly cost calculator
    admin/                "/admin" owner CRM: leads (+ panel sections), partners, landing pages, stats, setup
    landing/              "/go/:slug" owner-edited campaign pages
    leads/                LeadRequestModal (consented lead form, shared by home and landing)
  tests/                  vitest unit tests for model/ functions (npm test)

server/admin/             /api/admin internals: auth (session cookie), http helpers, constants, router (action table),
                          leads / partners / landings / stats / setup handlers
api/                      Vercel function entry points (thin): chat, plate, admin, event, landing
scripts/                  data pipeline (seed batches → catalogData, validate-data), Vercel build
```

## Security rules (never relax)
- Never log API keys, request bodies, passwords, cookies or lead contact data.
- Leads require explicit consent with the documented `LEAD_CONSENT_TEXT`; a lead goes to a partner only with a separately recorded consent (enforced in `server/admin/leads.ts`).
- Admin endpoints require the owner session (`server/admin/auth.ts`). Rate limits: chat 12/min/IP, admin login 5/min/IP.
- Never publish unverified data as fact; insurance is always an estimate, never a quote.

## Data
- **Recommendation catalog:** add a new `scripts/seed-vehicles-batchN.ts` (later batches override earlier ones by make + model), register it in `scripts/build-static-catalog.mjs`, then `npm run data:build` (builds + validates).
- **Browse-by-make:** edit `src/data/generations.ts` using the `T(...)` helper; Euro NCAP only when confirmed, `null` otherwise. Bump `PRICES_VERIFIED` when list prices were re-checked.
- Every data change is logged in `DATA_UPDATES.md`; `COVERAGE.md` is the queue of makes/models still to add.
- The daily market agent (scheduled task) follows the same rules and must pass `scripts/validate-data.mjs` and `npm run build` before pushing.

## Checks before every push
`npm run data:build` · `npm test` · `npm run build` (all must pass).
