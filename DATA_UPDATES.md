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

## 2026-10-20 (catalog expansion, one-off run)
10 makes and 40 models added to `generations.ts`; 6 models added to the recommendation catalog (`scripts/seed-vehicles-batch12.ts`). All figures read today. Generations, engines and power come from English Wikipedia model pages. Euro NCAP stars are included only where euroncap.com or Wikipedia states the star count; otherwise null. Consumption in `generations.ts` is a typical real-world estimate.

Price lists used (₪, list price ranges as shown):
- Nissan, importer Prisby: https://www.cartube.co.il/מחירון-רכב-חדש/51-ניסאן
  - Qashqai 178,990–231,990, Juke 146,990–165,990, X-Trail 209,990–239,990. Micra is not on the list.
- Ford, importer Delek Motors: https://www.cartube.co.il/מחירון-רכב-חדש/פורד
  - Focus wagon 165,900. Puma is marked no longer marketed. Kuga and Fiesta are not listed.
- Renault: https://www.carzone.co.il/Renault
  - Clio 124,990–126,990, Captur 151,990, Arkana 163,990–180,990, Austral 179,990–187,990. Megane is not listed.
- Dacia: https://www.carzone.co.il/Dacia
  - Duster 149,990–170,990, Sandero Stepway 121,990, Jogger 174,990.
- Honda: https://www.cartube.co.il/מחירון-רכב-חדש/הונדה
  - Jazz 148,900–159,900, HR-V 184,900–199,900. Civic and CR-V are marked no longer sold. The carzone.co.il/Honda brand page could not be opened.
- Subaru: https://www.cartube.co.il/מחירון-רכב-חדש/סובארו
  - XV/Crosstrek 175,900–185,900, Forester 212,900–279,900, Outback 279,990. Impreza is not listed. The carzone.co.il/Subaru brand page could not be opened.
- Lexus: https://www.carzone.co.il/Lexus
  - UX 249,990–284,990, NX 334,990–445,990, RX 414,990–589,990, ES 354,990–374,990.
- Volvo: https://www.carzone.co.il/Volvo
  - XC40 249,900–279,900, EX40 359,900, XC60 299,900–474,900, XC90 519,900–634,900, EX30 179,900–239,900.
- Citroën: https://www.carzone.co.il/Citroen
  - C3 99,990–114,990, C4 129,990, C5 Aircross 179,990–195,990, Berlingo 176,990–189,990 (all variants).
- Opel: https://www.carzone.co.il/Opel
  - Corsa 126,990–129,990, Astra 167,990, Mokka 149,990, Grandland 186,990–206,990.

Models added to `generations.ts` (40), with the Wikipedia pages used:
- Nissan Qashqai, Juke, X-Trail, Micra: en.wikipedia.org/wiki/Nissan_Qashqai, /Nissan_Juke, /Nissan_X-Trail, /Nissan_Micra.
  - Euro NCAP: Qashqai J12 4★ (2025, euroncap.com/en/results/nissan/qashqai/57980), X-Trail T33 5★ (2021, euroncap.com/en/results/nissan/x+trail/47772), Micra K14 4★ (2017, news.euroncap.com).
- Ford Focus, Kuga, Puma, Fiesta: /Ford_Focus_(third_generation), /Ford_Focus_(fourth_generation), /Ford_Kuga, /Ford_Puma_(crossover), /Ford_Fiesta_(sixth_generation), /Ford_Fiesta_(seventh_generation).
  - 1.0 EcoBoost wet timing belt: https://www.autoevolution.com/news/ford-10l-ecoboost-wet-timing-belt-investigation-deepens-due-to-the-risk-of-sudden-engine-failure-273757.html
  - Kuga PHEV battery recall: https://www.fleetnews.co.uk/news/manufacturer-news/2020/11/02/ford-to-replace-kuga-phev-batteries-following-fire-warning
- Renault Clio, Captur, Megane, Arkana, Austral: /Renault_Clio, /Renault_Captur, /Renault_Mégane, /Renault_Arkana, /Renault_Austral. Star ratings come from news.euroncap.com and euroncap.com pages.
  - 1.2 TCe oil consumption: https://connexionfrance.com/article/French-news/Renault-cars-have-severe-defect-says-consumer-group
- Dacia Duster, Sandero, Jogger: /Dacia_Duster, /Dacia_Sandero, /Dacia_Jogger.
  - Euro NCAP: Duster III 3★ (2024), Sandero Stepway 2★ (2021), Jogger 1★ (2021), all from news.euroncap.com.
- Honda Civic, Jazz, HR-V, CR-V: /Honda_Civic (generation pages), /Honda_Fit, /Honda_HR-V_(third_generation), /Honda_CR-V_(fourth|fifth|sixth_generation).
  - Euro NCAP: Civic 5★ (2022), Jazz 5★ (2020), CR-V 4★ standard / 5★ with safety pack (2024), all from euroncap.com. HR-V 4★ (2022) is from Wikipedia.
  - 1.5 turbo oil dilution: https://www.consumerreports.org/car-recalls-defects/honda-extends-warranty-on-troubled-turbo-engines
- Subaru Impreza, XV/Crosstrek, Forester, Outback: /Subaru_Impreza, /Subaru_Crosstrek, /Subaru_Forester, /Subaru_Outback. Star ratings from euroncap.com.
  - FB engine oil consumption: https://jalopnik.com/subaru-settles-lawsuit-over-oil-burning-cars-1752805682
- Lexus UX, NX, RX, ES: /Lexus_UX, /Lexus_NX, /Lexus_RX, /Lexus_ES.
  - Euro NCAP: NX 5★ (2022), RX 5★ (2022), from euroncap.com. The NX 450h+ recall comes from the carzone NX page.
- Volvo XC40/EX40, XC60, XC90, EX30: /Volvo_XC40, /Volvo_XC60, /Volvo_XC90, /Volvo_EX30.
  - Euro NCAP: XC40 5★ (2018) and XC60 gen 2 5★ (2017), from euroncap.com. XC60 gen 1 5★ (2008) is from Wikipedia.
  - XC90 gen 2 and EX30 are left null, because no euroncap.com page stating their stars was read.
- Citroën C3, C4, C5 Aircross, Berlingo: /Citroën_C3, /Citroën_C4, /Citroën_C5_Aircross, /Citroën_Berlingo.
  - PureTech belt warranty: https://www.fleetnews.co.uk/news/fleets-warned-of-engine-killer-wet-timing-belts
- Opel Corsa, Astra, Mokka, Grandland: /Opel_Corsa, /Opel_Astra, /Opel_Mokka, /Opel_Grandland.
  - Euro NCAP: Grandland gen 2 4★ (2025), from news.euroncap.com.

Catalog batch 12 (6 models). Running costs are estimates, with dataConfidence between 58 and 62:
- Nissan Juke: ₪146,990, 1.0T 114 hp. https://www.cartube.co.il/מחירון-רכב-חדש/51-ניסאן/329-ניסאן-ג-וק
- Ford Focus wagon: ₪165,900, 1.0T 155 hp, road test ~12.5 km/L. https://www.carzone.co.il/Ford/Focus/Tourer-Estate/2025 and https://www.cartube.co.il/מחירון-רכב-חדש/61-פורד/392-פורד-פוקוס-סטיישן
- Honda HR-V: ₪184,900, 1.5 e:HEV, 18.5 km/L (claimed and confirmed in the road test). https://www.carzone.co.il/Honda/HR-V
- Citroën C3: ₪99,990, 1.2T 101 hp manual, road test ~15 km/L. https://www.carzone.co.il/Citroen/C3/Crossover
- Lexus NX 350h: ₪334,990, 244 hp hybrid, road test ~15.5 km/L. https://www.carzone.co.il/Lexus/NX
- Subaru Forester: ₪212,900, 2.5 180 hp AWD, 11.9 km/L (not labelled as claimed or tested). https://www.carzone.co.il/Subaru/Forester

Skipped or flagged for owner review:
- Dacia Duster: carzone's model page shows ₪139,990 (manual), below its own brand-page range, and its hp figures are inconsistent. Brand-page range used; kept out of the catalog.
- Volvo XC40 B4: the page says both petrol and hybrid. Kept out of the catalog.
- Opel Corsa: the page gives 100 hp in one place and 130 hp in another, and its prices go above the brand-page range. Brand range used; kept out of the catalog.
- Honda HR-V: cartube gives 184,900–199,900, carzone 184,900–224,900. cartube range used.
- Arkana, X-Trail T32/T33 and Astra J: power is shown as "—" because Wikipedia gave no figure.
- Clio: Israel still sells the facelifted Clio V. Clio VI (Europe 2025) was not added.
- Pages that could not be opened: carzone.co.il/Honda, carzone.co.il/Subaru, several euroncap.com result pages (their stars are left null).

## 2026-10-20 (catalog expansion 2: missing models of makes already covered)
45 models added to `generations.ts` under existing makes (193 models now). List prices from the carzone.co.il brand pages read today; generations/engines/power from English Wikipedia; Euro NCAP stars only where a euroncap.com page (or a Wikipedia text statement) gave them, otherwise null. Consumption figures are CamaOla real-world estimates.
- Toyota Prius (not on price list → discontinued) — https://www.carzone.co.il/Toyota · https://en.wikipedia.org/wiki/Toyota_Prius (+ /Toyota_Prius_(XW30), /Toyota_Prius_(XW50))
- Hyundai Kona ₪176,990–207,990, Kona Electric ₪174,990–184,990, Ioniq 6 ₪224,990–247,990, Santa Fe ₪329,990–359,990, Sonata ₪219,990–234,990, Palisade ₪349,990–389,990, Ioniq 9 ₪354,990–409,990; i30 not listed — https://www.carzone.co.il/Hyundai/ · Wikipedia /Hyundai_Kona, /Hyundai_Ioniq_6, /Hyundai_Santa_Fe, /Hyundai_Sonata, /Hyundai_i30, /Hyundai_Palisade, /Hyundai_Ioniq_9 · NCAP: news.euroncap.com (Kona 2023 4★, Santa Fe 2024 4★ standard, Ioniq 9 2025 5★), https://www.euroncap.com/en/results/hyundai/ioniq+6/47747
- Kia EV3 ₪169,900–186,900, Sorento ₪319,900, Carnival ₪298,900–349,900, EV9 ₪399,000–489,000; Ceed, Rio not listed — https://www.carzone.co.il/Kia/ · Wikipedia /Kia_EV3, /Kia_Sorento, /Kia_Carnival, /Kia_EV9, /Kia_Ceed, /Kia_Rio · NCAP: euroncap.com (EV3 2025 4★ standard, Sorento 2020 5★, Ceed 2019 4★ standard, Rio 2017 3★ standard)
- Mazda CX-90 ₪254,900–329,900; Mazda6, CX-3 not listed (cartube: no longer marketed) — https://www.carzone.co.il/Mazda/ · https://www.cartube.co.il/מחירון-רכב-חדש/מאזדה · Wikipedia /Mazda6, /Mazda6_(third_generation), /Mazda_CX-3, /Mazda_CX-90
- Skoda Fabia ₪120,990–135,990, Scala ₪138,490 (one priced trim), Elroq ₪182,990–197,990, Enyaq ₪206,490–298,000; Rapid, Yeti discontinued per Wikipedia — https://www.carzone.co.il/Skoda/Fabia/2026/compare/ · https://www.carzone.co.il/Skoda/Scala/2026/compare/ · https://www.carzone.co.il/Skoda/Elroq/ · https://www.carzone.co.il/Skoda/ENYAQ-iv/coupe/2026/compare/ + https://www.carzone.co.il/Skoda/ENYAQ-iv/2026/ · Wikipedia /Škoda_Fabia, /Škoda_Scala, /Škoda_Elroq, /Škoda_Enyaq, /Škoda_Rapid_(2012), /Škoda_Yeti · NCAP: euroncap.com (Fabia 2021, Scala 2019, Elroq 2025, Enyaq 2021 — all 5★)
- Suzuki Baleno, SX4, Celerio (not listed → discontinued) — https://www.carzone.co.il/Suzuki · Wikipedia /Suzuki_Baleno_(2015), /Suzuki_SX4, /Suzuki_Celerio
- BYD Dolphin Surf ₪114,990–123,990, Atto 2 ₪137,990–149,990 (EV ₪148,990; DM-i ₪137,990–149,990), Sealion 7 ₪198,990–237,990 — https://www.carzone.co.il/BYDAuto · Wikipedia /BYD_Seagull, /BYD_Atto_2, /BYD_Sealion_7
- MG MG3 ₪119,888–127,888, S5 ₪138,888 — https://www.carzone.co.il/MG/ · Wikipedia /MG3_(automobile) · S5 via Wikipedia mirror of /MG_ES5 · NCAP: https://www.euroncap.com/articles/mg-3-receives-four-stars-but-suffers-rare-and-serious-seat-failure-in-euro-ncap-crash-test
- Peugeot Rifter ₪178,990–189,990; 308, 301 not listed — https://www.carzone.co.il/Peugeot/ · Wikipedia /Peugeot_308, /Peugeot_301_(2012), /Citroën_Berlingo · NCAP 308 2022 4★ (news.euroncap.com)
- Volkswagen T-Cross ₪144,900–169,900, ID.3 ₪245,000, Tayron ₪259,900; Passat, Jetta not listed; T-Roc status "unverified" (not on brand page; model page https://www.carzone.co.il/Volkswagen/T-Roc/ still shows ₪180,000–189,900) — https://www.carzone.co.il/Volkswagen · Wikipedia /Volkswagen_T-Cross, /Volkswagen_T-Roc, /Volkswagen_ID.3, /Volkswagen_Passat_(B6), /Volkswagen_Passat_(B8), /Volkswagen_Passat_(B9), /Volkswagen_Jetta_(A6), /Volkswagen_Tayron
- Mercedes-Benz GLA ₪359,900–419,900 — https://www.carzone.co.il/Mercedes-Benz/ · Wikipedia /Mercedes-Benz_GLA
- BMW X1 ₪319,900–329,900 (iX1 ₪379,900–409,900), 5 Series ₪479,900–555,000 — https://www.carzone.co.il/BMW/ · Wikipedia /BMW_X1_(E84), /BMW_X1_(F48), /BMW_X1_(U11), /BMW_5_Series_(F10), /BMW_5_Series_(G30), /BMW_i5
- Audi Q7 ₪689,900–740,900 — https://www.carzone.co.il/Audi/ · Wikipedia /Audi_Q7

Catalog (batch 13, 3 models; running costs are estimates, dataConfidence 60):
- Skoda Fabia Selection 1.0 TSI ₪120,990, 115 hp, road test ~13 km/L — https://www.carzone.co.il/Skoda/Fabia/2026
- Kia Sorento Hybrid EX 1.6T ₪319,900, 230 hp, 6 seats, road test ~12.5 km/L — https://www.carzone.co.il/Kia/Sorento?trim=EX-hybrid-1.6L-AT-4X2-6seats
- MG3 Hybrid Comfort ₪126,888, road test ~19.5 km/L (192 hp system per Wikipedia) — https://www.carzone.co.il/MG/3?trim=Comfort-petrol-1.5L-AT-4X2-5seats

Skipped / needs review:
- carzone.co.il/Skoda/ brand page could not be fetched; Skoda prices come from model/compare pages.
- Santa Fe and T-Roc kept out of the catalog: model page entry price contradicts itself (Santa Fe ₪319,990 vs ₪329,990); T-Roc missing from the brand page. Elroq and Dolphin Surf kept out: no consumption figure on the model page.
- Not added: Mercedes CLA, Audi A6 (engine/generation data incomplete on Wikipedia), BYD Sealion 05 / Seal 05 DM-i (combined hp not confirmed), MG EHS (fold into HS?), Suzuki Fronx (not on price list).
- Power shown as "—" where Wikipedia gave no figure (Prius XW50, Celerio, Ceed, Rio UB, 308 T9/P5, T-Roc gen 2, Tayron).
