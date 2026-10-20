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

## 2026-10-20 (daily agent, re-run after the owner approved access to the sources)
Prices checked on every brand page: carzone.co.il /Toyota /Hyundai/ /Kia /Skoda/ /BYDAuto /Tesla/ /Cupra/ /chery/ /Omoda-Jaecoo /Peugeot/ /Volkswagen /MG/ /Suzuki /Seat /Mercedes-Benz/ /BMW/ /Audi/ /Geely /Mazda /Mitsubishi, plus cartube.co.il price lists for Mazda (44) and Mitsubishi (47). `PRICES_VERIFIED` → 2026-10-20.

Price changes (generations.ts; catalog priceMax via scripts/seed-vehicles-batch11.ts):
- Toyota Corolla: ₪159,900–174,990 → ₪159,900 (one price) — https://www.carzone.co.il/Toyota
- MG MG4: ₪119,888–148,888 → ₪119,888 (one price) — https://www.carzone.co.il/MG/
- Suzuki Vitara line (incl. e Vitara): ₪154,990–166,990 → ₪154,990–179,990 (e Vitara 154,990–179,990; Vitara petrol 159,990–169,990) — https://www.carzone.co.il/Suzuki
- Suzuki S-Cross: no price → ₪159,990–179,990, status on_sale — https://www.carzone.co.il/Suzuki
- Seat Ibiza: no price → ₪122,390–139,900, status on_sale — https://www.carzone.co.il/Seat
- Geely EX5: no price → ₪161,990–169,490 (listed as "E5") — https://www.carzone.co.il/Geely
- Catalog BYD Atto 3 priceMax ₪167,000 → ₪164,990 (list range 154,990–164,990) — https://www.carzone.co.il/BYDAuto
- Entry prices of every catalog car unchanged, so running costs unchanged.

Models added to generations.ts (8): Toyota Aygo X, Corolla Cross, C-HR+, Camry, Land Cruiser, Hilux; Hyundai Venue; Kia Stonic. Prices from the brand pages above; engines/power cross-checked on carzone model pages (/Toyota/Aygo/X/, /Toyota/Corolla-Cross/, /Toyota/C-HR-Plus/, /Toyota/Camry/, /Toyota/Land-Cruiser/, /Toyota/Hilux/, /Hyundai/Venue/, /Kia/Stonic/). Euro NCAP left null: euroncap.com could not be opened in this run.
Models added to the catalog (2): Hyundai Venue (₪129,900, 1.6 petrol 121 hp, ~13 km/L road test), Kia Stonic (₪129,900, 1.0T 100 hp, ~14 km/L road test) — running costs are estimates, dataConfidence 60.

Not on the importer list today (one source only, left unchanged — check again): Toyota C-HR (hybrid), Kia EV6, VW Polo / ID.4 / Touareg, Seat Ateca / Leon / Tarraco, Cupra Born / Ateca, Geely Okavango / Preface / Coolray, Suzuki Ignis / Jimny, Mercedes A-Class (only A-Class AMG listed).
Needs owner review: carzone model pages for Aygo X, Camry, Land Cruiser and Hilux show trim prices that contradict their own brand-page range (e.g. Land Cruiser "1958" trim at ₪40,000) — brand-page ranges used.
