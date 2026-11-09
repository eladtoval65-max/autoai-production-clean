# Debt ledger — follow-ups (no issue tracker in this project)

Newest first. One line each: what, why it matters, where. Remove a line when it ships (and say so in the commit).

- Price-drop alerts send nothing until a verified Resend domain (`LEAD_EMAIL_FROM`) exists — waiting on the owner's domain.
- SMS phone verification for leads — deferred by the owner; needed before insurance-agency pricing talks.
- Calibrate the used-price estimate (`src/features/browse/model/usedValue.ts`) against `price_reports` once there are enough reports.
- Car photos: Wikipedia search fallback is unverified from the sandbox — check `/cars` and quiz results for missing photos in a real browser.
- `.git/gc.log` warns about too many loose objects — run `git prune` in a clean checkout.
- Licensing table (`src/data/licenceFees.json`) must be replaced every April from the Ministry of Transport fee sheet; the price group uses today's thresholds with the launch price (approximate for old cars). `scripts/validate-tco.ts` (legacy DB check) still assumes ₪121.
- Insurance and maintenance curves in `usedCost.ts` are our own estimates — calibrate against real quotes / garage prices when partners send them.
