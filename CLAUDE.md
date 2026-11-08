# CLAUDE.md — agent guide

Orientation for AI agents working in this repo. Humans: read `README.md` / `AUTOAI_MASTER_PLAN.md` (Hebrew) first;
this file is the same map with the sharp edges flagged. Keep it current when conventions change.

## What this is

"כמה עולה" (CamaOla) — a Hebrew, RTL Israeli car-cost website: how much a car really costs per month (fuel/electricity,
insurance estimate, maintenance, depreciation, licensing), for new and used cars, plus a lead flow that passes
consented requests to insurance agencies, finance companies and dealers. Owner: אלעד תובל (non-developer; answer him
in Hebrew, short and plain). Mobile-first; accessibility (IS 5568 / WCAG AA) and privacy law (Amendment 13) matter.

Stack: React 19 + TypeScript + Tailwind v4 + Vite 7 (client, wouter routing, tRPC), Express-style serverless
functions in `api-src/` bundled by `scripts/build-vercel.mjs` (Vercel Build Output API), Drizzle + mysql2 on TiDB
(production) / MariaDB (local: `service mariadb start`, autoai/testpw@127.0.0.1). Deployed by Vercel from **`main`**.
Push every change to both branches: `git push origin HEAD:main HEAD:autoai-stabilize-2026-10-08`.

## How context is managed (the map of maps)

1. **This file** — the index + hard rules.
2. **`.claude/rules/*.md`** — path-scoped constraints (none yet).
3. **Skills** (`.claude/skills/`) — procedures; the routing triggers live in § The loop.
4. **Repo docs** — `docs/` ledgers (`INVARIANTS` · `DECISIONS` · `IMPACT-MAP` · `ai-failure-patterns` · `debt-ledger`)
   + `ARCHITECTURE.md`, `AUTOAI_MASTER_PLAN.md` (owner roadmap, Hebrew), `COVERAGE.md`, `DATA_UPDATES.md`, `data-facts/README.md`.
5. **No issue tracker** — follow-ups go to `docs/debt-ledger.md`; the owner reads `AUTOAI_MASTER_PLAN.md`.

Reflection notes: `.reflect/` (contract `docs/reflection.md`, zone `REFLECT_TZ=Asia/Jerusalem`).

## Commands

```bash
npm ci
npm run dev               # vite (client only)
npm run build             # vite build + Vercel output (.vercel/output) — run before claiming a build works
npm test                  # vitest (src/tests)
npm run check             # tsc --noEmit (old scripts/seed-* files have known type errors; ignore those only)
npm run data:build        # regenerate src/data/catalogData.ts from scripts/seed-vehicles-batch*.ts
npm run facts:validate    # data-facts/*.json sources + keys
npm run facts:manifest    # regenerate data-facts/_manifest.json + coverage report
```

**The local run is the gate:** typecheck · test · build before every push. Local end-to-end scripts (Playwright,
`/opt/pw-browsers/chromium`) live in `node_modules/.shots/` and are not committed.

## Hard rules (read before editing)

- **Generated files:** `src/data/catalogData.ts` (from seed batches — `npm run data:build`), `data-facts/_manifest.json`
  (`facts:manifest`), `.vercel/output/`, `dist/`. Never hand-edit.
- **Secrets never leave the server:** ANTHROPIC_API_KEY, DATABASE_URL, RESEND_API_KEY, ADMIN_PASSWORD — never logged,
  returned, printed in chat, or imported at client scope. The chat handler never logs the key, request body or contact data.
- **Schema:** append-only statements in `schemaSetup.ts` + bump `SCHEMA_VERSION`; upgrades run on the first request.
- **Leads:** explicit consent with the versioned `LEAD_CONSENT_TEXT`; a lead goes to a business only with the separate
  partner opt-in. Insurance is always an estimate, never a quote. Never publish unverified data as fact.
- **Admin** procedures go through admin auth; public endpoints are rate-limited (chat 12/min/IP).
- **API sources live in `api-src/`, never `api/`** (Vercel would compile `api/` unbundled over our functions). Hobby plan:
  ≤12 functions, daily crons only.
- **Owner decisions** (don't re-litigate): no logos (initials badges), no stolen-car/police checks, don't compete with
  Yad2, no SMS verification yet — see `docs/DECISIONS.md`.
- Code stays modular: small components and pure functions with a short comment saying why.

## Agent discipline (Karpathy rules — condensed)

Full text: `docs/karpathy-claude-rules.md`.

- **Think before coding.** State assumptions; present competing interpretations — don't pick silently.
- **Simplicity first, on one foundation.** Minimum code for what was asked; extend the ONE shared foundation, never copy it.
- **Surgical changes.** Every changed line traces to the request.
- **Goal-driven execution.** Turn tasks into verifiable criteria and loop until verified with the commands above.
- **A subagent inherits NO skill bodies.** Every brief names the skills to load and repeats the constraints at risk.
- **Shared tree.** Other sessions and the scheduled data agents push to `main` too: `git pull --rebase` before
  committing; never `git stash`/`git reset` a shared tree.
- **An unanswered question is not approval.** Re-ask once before proceeding on defaults.

## The loop & shipping workflow

For something NEW (feature, screen, behavior change), in order:

1. **`brainstorming`** when the request is ambiguous or design-heavy (the owner often says "just build it" — then
   state the design in one line and go); **`writing-plans`** for multi-step work.
2. **UI** — mobile first (390px) and desktop; RTL; check overflow; Hebrew copy via `copywriting`.
3. **Build** with `react-best-practices`, `accessibility` / `web-design-guidelines`, `failure-states` for any
   error/empty/offline state, `seo` skills for public pages.
4. **`senior-code-review`** over the diff, in rounds, before pushing.
5. **Ship (project-specific):** the owner chose to ship straight to `main` — run the gate, stage explicit paths
   (`git add <paths>`; the hook blocks `git add -A`), commit, push both branches. `ship-it`'s branch/PR rules apply
   only if the owner asks for a PR. Then `reflect` (one note per unit) and `document-work`.

Other routing: bug → `systematic-debugging`; external question (law, ToS, API) → `research-question`;
launch / traffic push → `release-readiness`; Vercel cost/speed → `vercel-optimize`; new skill → `author-a-skill`;
"daily brief" → `daily-brief`; future mobile app → `capacitor-*`; motion → `emil-design-eng`, `motion-design`.

## Tests

Vitest in `src/tests/` (pure logic: cost, lead policy, catalog, facts, price reports). Modules importing `.sql` files
can't be imported by Vitest — keep logic pure (see `server/admin/handOff.ts`). Mutation-test guards you add.

## Where to look

- Must-never-break facts → `docs/INVARIANTS.md`
- Past decisions & why → `docs/DECISIONS.md`
- Change-X ⇒ also-touch-Y → `docs/IMPACT-MAP.md`
- Follow-ups → `docs/debt-ledger.md`
- Architecture → `ARCHITECTURE.md` · roadmap & status (Hebrew) → `AUTOAI_MASTER_PLAN.md`
- Car data: `src/data/generations.ts` (models), `data-facts/` (sourced facts), `src/data/energyPrices.json`,
  `COVERAGE.md` / `DATA_UPDATES.md` (daily agent) · leads: `leadPolicy.ts`, `server/leads/`, `server/admin/`
