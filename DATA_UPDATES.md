# Data update log

Every change to vehicle prices, models or facts is recorded here: date, what changed, and the source.
The daily market agent appends one entry per run (also when nothing changed).

## 2026-10-19 (manual)
- Added browse-by-make dataset `generations.ts`: 20 makes, 100 models, 179 generations since 2010.
- Current list prices from carzone.co.il brand pages; Euro NCAP spot-checked against Euro NCAP / maker press releases.
- Catalog batches 8–9: refreshed list prices; Jaecoo 7 corrected to 1.6T petrol; Ford Puma and Peugeot 308 removed (no longer marketed).

## 2026-10-20 (daily agent)
- No changes. Price check (step A) and coverage (step B) could not be done: every source page (carzone.co.il brand pages for all 20 makes, cartube.co.il Mazda/Mitsubishi price lists) was blocked for fetching in this unattended run; web search returns only links, not prices.
- Nothing was published from unverified data. `PRICES_VERIFIED` stays 2026-10-19. COVERAGE.md queue unchanged.
