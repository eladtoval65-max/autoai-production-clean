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

## 2026-10-20 (catalog expansion 3)
16 new makes, 45 models added to `generations.ts` (193 → 238 models, 30 → 46 makes). List prices = ranges on the carzone.co.il brand pages (model year 2026) unless noted; powertrain/power from the carzone model pages; generations and years from English Wikipedia model pages; Euro NCAP only where a euroncap.com page or the carzone model page states the stars for that generation, otherwise null. Consumption is a typical real-world estimate (road-test figure quoted on the carzone page where there is one).
- Geely Starray EM-i ₪169,990–181,990 — https://www.carzone.co.il/Geely ; NCAP 5★ 2025 euroncap.com; https://en.wikipedia.org/wiki/Geely_Galaxy_Starship_7
- Zeekr X ₪169,990–186,990, 7GT ₪191,990–269,990, 7X ₪233,990–289,990, 001 ₪289,990–349,990 — https://www.carzone.co.il/ZEEKR/ (cartube https://www.cartube.co.il/מחירון-רכב-חדש/זיקר lists the 001 at ₪283,990–344,990); NCAP from euroncap.com (X 2024, 7X 2025, 001 2024, 7GT July 2026); Wikipedia Zeekr_X, Zeekr_007, Zeekr_7X, Zeekr_001
- Lynk & Co 02 ₪159,900–169,900 (cartube: ₪171,900–179,900), 01 EM-P ₪179,900–198,900, 08 ₪229,900–249,900 — https://www.carzone.co.il/lynkco ; NCAP 02/08 5★ 2025 euroncap.com; 01 EM-P left null (tested car was the HEV)
- ORA 05 ₪139,990–148,990, 03 Funky Cat ₪154,422, 07 ₪226,900 — https://www.carzone.co.il/Ora ; Wikipedia Ora_5, Ora_Good_Cat, Ora_Lightning_Cat
- XPENG P7+ ₪199,990, G6 ₪204,990–247,990, P7 (P7i) ₪214,990–281,990, G9 ₪259,990–372,990 — https://www.carzone.co.il/xpeng ; Wikipedia XPeng_P7%2B, XPeng_G6, XPeng_P7, XPeng_G9; G9 NCAP left null (stars not stated on the opened page)
- Leapmotor T03 ₪92,900, B10 ₪139,900–149,900 (REEV ₪154,900–164,900), C10 ₪164,900–199,900 (REEV ₪174,900–184,900) — https://www.carzone.co.il/leapmotor ; NCAP B10 2025 / C10 2024 euroncap.com
- Polestar 2 ₪244,900–324,900 — https://www.cartube.co.il/מחירון-רכב-חדש/פולסטאר (carzone shows only 2024); NCAP 5★ 2021 euroncap.com; https://en.wikipedia.org/wiki/Polestar_2
- Smart #1 ₪196,990–252,990, #3 ₪211,990–267,990, #5 ₪259,990–299,990 — https://www.carzone.co.il/Smart ; NCAP per carzone model pages
- Genesis GV60 ₪299,990–599,990, GV70 ₪359,990–459,990 (Electrified ₪549,900–609,900 in note), G80 ₪399,990–499,000, GV80 ₪489,990–645,990 — https://www.carzone.co.il/Genesis/ ; Wikipedia Genesis_GV60/GV70/G80/GV80
- MINI Cooper (Hatch) ₪221,900–301,900, Countryman ₪273,000–339,000, Aceman ₪259,900 — https://www.carzone.co.il/MINI ; https://en.wikipedia.org/wiki/Mini_Hatch, Mini_Countryman, Mini_Aceman
- Jeep Avenger ₪164,900–174,900, Compass ₪209,900–224,900, Wrangler ₪349,900–429,900, Grand Cherokee ₪414,900 (model page header shows ₪429,900) — https://www.carzone.co.il/Jeep ; Wikipedia Jeep_Compass, Jeep_Wrangler_(JK), Jeep_Wrangler_(JL), Jeep_Grand_Cherokee_(WK2); Wrangler NCAP left null (carzone page contradicts itself)
- Fiat Grande Panda ₪119,000–126,000, Doblò ₪169,990–179,990 — https://www.carzone.co.il/Fiat ; https://en.wikipedia.org/wiki/Fiat_Dobl%C3%B2
- KGM Tivoli ₪139,900, Torres ₪169,900–189,900, Rexton ₪219,900–299,900 — https://www.carzone.co.il/KGM ; Wikipedia SsangYong_Tivoli, KGM_Torres, SsangYong_Rexton
- Isuzu D-Max ₪259,990–312,990 — https://www.carzone.co.il/Isuzu/ ; https://en.wikipedia.org/wiki/Isuzu_D-Max
- Land Rover Range Rover Evoque ₪389,000, Discovery Sport ₪437,900, Defender ₪495,000–1,150,000 (110; 90 and 130 in note) — https://www.carzone.co.il/Land-Rover ; Wikipedia Range_Rover_Evoque, Land_Rover_Discovery_Sport, Land_Rover_Defender_(L663)
- Porsche Macan ₪587,000–877,000 (only the Electric is listed), Cayenne ₪787,000–1,507,000 — https://www.carzone.co.il/Porsche ; https://en.wikipedia.org/wiki/Porsche_Macan, Porsche_Cayenne; Cayenne NCAP left null (2025 result is the Cayenne Electric)
- Alfa Romeo Junior ₪174,900–202,900 — https://www.carzone.co.il/Alfa-Romeo ; https://en.wikipedia.org/wiki/Alfa_Romeo_Junior_(2024)

Catalog batch 14 (6 models; list price, powertrain and road-test consumption from the model pages; running costs are estimates, dataConfidence 58–60): ORA 05 (carzone.co.il/Ora/05/), XPENG P7+ (/XPENG/P7-Plus), KGM Tivoli (/KGM/Tivoli), Jeep Compass (/Jeep/Compass), Alfa Romeo Junior (/Alfa-Romeo/Junior), MINI Countryman (/MINI/Countryman).

Skipped / not added:
- Haval, Tank: not sold in Israel (no current carzone listing; https://www.carzone.co.il/Great-Wall shows 2010–2014 only; auto.co.il guide says ORA is the only GWM brand marketed).
- Xpeng X9 (₪399,990): model page failed to open, specs unverified.
- Skywell, Dongfeng, Voyah, and DS (brand page https://www.carzone.co.il/DS-Automobiles read today): not added because of this run's 45-model limit (Nissan, Ford, Renault, Dacia, Honda, Subaru, Lexus, Volvo, Citroën and Opel were added by the earlier expansion run today) — queued in COVERAGE.md for the next run.
- Failed URLs: carzone.co.il/leapmotor/2024/, carzone.co.il/XPENG/X9 model page, carzone.co.il/DS (/DS-Automobiles worked), cdn.euroncap.com Zeekr result pages.
- No used-car prices were added.

## 2026-10-20 (catalog expansion, second pass: re-check and fill gaps)
Re-checked the first pass and filled what was missing: 1 make (DS) and 23 models added, no new catalog cars. After merging with the parallel expansion runs 2 and 3, the site has 47 makes, 261 models and 46 catalog cars.

Euro NCAP stars confirmed in Euro NCAP's own text: page titles "… – N stars" or press releases on news.euroncap.com / euroncap.newsmarket.com / euroncap.com.
- Renault Clio V: 5★ (2019).
- Nissan:
  - Qashqai J11: 5★ (2014). Named among "2014's five star cars" in the Best in Class 2014 release.
  - Qashqai J12: 5★ (2021), 4★ in the 2025 re-rating. The site keeps 4★ and the note.
  - Juke F15: 5★ (2011).
  - X-Trail T32: 5★ (2014).
- Ford:
  - Focus Mk3: 5★ (2011).
  - Kuga gen 2: 5★ (2012).
  - Kuga gen 3: 5★ (2019).
  - Explorer U625: 5★ (2019).
  - Ranger P703: 5★ (2022).
  - Mustang S550: 3★ (2017), after a 2★ first result.
- Opel:
  - Corsa F: 4★ (2019).
  - Astra L: 4★ (2022).
  - Mokka B: 4★ (2021).
  - Grandland X: 5★ (2017).
- Volvo:
  - XC90 gen 2: 5★ (2015). Inferred from the 2015 release: 7 of 9 cars got five stars and the two four-star cars are named, so the page never states the XC90's stars directly. Weaker than a direct statement.
  - EX30: 5★ (2024).
  - EX40: 5★, keeps the XC40's 2018 rating.
  - EX90: 5★ (2025).
- Citroën:
  - C4 C41: 4★ (2021).
  - C5 Aircross gen 1: 4★ standard, 5★ with the safety pack (2019).
  - Berlingo K9: 4★ (2018).
- Honda:
  - Civic 10th gen: 5★ (2017), after 4★ in July 2017.
  - HR-V gen 2: 5★ (2015).
  - ZR-V: 4★ (2023).
- Subaru XV gen 2: 5★ (2017).
- Lexus:
  - UX: 5★ (2019).
  - LBX: 5★ (2024).
  - RZ: 5★ (2023).
  - ES 7th gen: 5★ (2018).
  - NX gen 1: 5★ (2014).
- Renault 5 E-Tech: 4★ (2024).
- Renault Symbioz: 4★ (2024).
- Dacia:
  - Bigster: 3★ (2024).
  - Logan III: 2★ (2021).
- DS:
  - DS 3 Crossback: 4★ standard, 5★ with the safety pack (2019).
  - DS 7: 5★ (2017).

Still unconfirmed, left null: Citroën C3 gen 3 and gen 4, Opel Astra K, Renault Megane IV, Subaru Outback BS, Opel Frontera, Citroën C3 Aircross gen 2, Nissan Sentra (no Euro NCAP test).

Corrections from re-reading the price lists:
- Dacia Duster:
  - Price ₪149,990–170,990 → ₪139,990–170,990. The 1.2T entry trim is on cartube (https://www.cartube.co.il/מחירון-רכב-חדש/161-make/161-דאצ-יה-דאסטר) and on carzone's model page.
  - The 1.8 hybrid's power still differs between the sites: carzone 140 hp, cartube 155 hp.
- Renault Arkana:
  - Price ₪163,990–180,990 → ₪161,990–180,990.
  - Power "—" → 143–158 hp (1.3T 158 hp, 1.6 hybrid 143 hp). Source: https://www.cartube.co.il/מחירון-רכב-חדש/73-רנו/466-רנו-ארקנה/compare
- Opel Corsa:
  - Price ₪126,990–129,990 → ₪126,990–134,990. carzone lists a GS Line at ₪134,990; cartube tops out at ₪129,990. Noted on the model.
  - Edition trim is 100 hp; the GS Line MHEV is 145 hp per cartube and 136 hp per carzone.
- Honda HR-V:
  - Price ₪184,900–199,900 → ₪184,900–224,900. carzone's model page lists an Advance Style trim at ₪224,900; cartube does not show it. Noted on the model.
  - The catalog priceMax was updated to match.
- Subaru Outback: price ₪279,990 → ₪279,900–279,990 (carzone brand page ₪279,900, cartube ₪279,990).
- carzone.co.il/Honda and carzone.co.il/Subaru opened on this pass and match the other figures.
- Volvo XC40 B4: cartube and carzone both list it as a 2.0 turbo petrol, 197 hp. The model page's review text mentions an electric motor, but no 48V system is confirmed.
- Power figures that were "—":
  - Nissan X-Trail T32: 130–177 PS, from autonotizen.de and mobile.de (Wikipedia has no figures).
  - Nissan X-Trail T33: 163–213 PS, from cartube and wapcar.my.
  - Opel Astra J: 87–280 PS, from Wikipedia and cars-data.com.
  - Subaru Outback BR: 150–260 PS, from Wikipedia "Subaru Legacy (fifth generation)".
  - The X-Trail and Astra J sources are not Wikipedia; they were opened today.

Models added (23):
- Nissan, prices from cartube:
  - Sentra ₪154,990–156,990, 2.0 149 hp.
  - Leaf (discontinued).
  - Note (discontinued).
  - Wikipedia: Nissan_Sentra, Nissan_Leaf, Nissan_Note.
- Ford, prices from cartube Ford model pages (/394, /398, /395, /400):
  - Explorer ₪369,900–429,900.
  - Ranger ₪294,000–490,000.
  - Bronco ₪399,900–629,000.
  - Mustang ₪445,000–505,000.
  - Wikipedia: Ford_Explorer, Ford_Ranger_(T6), Ford_Ranger_(P703), Ford_Bronco, Ford_Mustang_(fifth|sixth|seventh_generation).
- Renault, prices from carzone:
  - 5 E-Tech ₪168,999–176,990. ₪168,999 is carzone's published figure, also in its news headline.
  - Symbioz ₪159,990–166,990.
- Dacia:
  - Bigster ₪167,990–190,990 (carzone and cartube).
  - Logan ₪127,990 (carzone /Dacia/Logan/2026).
- Honda ZR-V ₪209,900–234,900 (carzone).
- Subaru BRZ ₪229,900–259,900. The carzone model page lists a TS MT at ₪259,900, above its brand-page ₪249,900.
- Lexus, prices from carzone:
  - LBX ₪205,990–246,990.
  - RZ ₪299,990–439,990.
- Volvo, prices from carzone:
  - EX90 ₪739,900–754,900.
  - ES90 ₪399,900–539,900.
- Opel, from carzone:
  - Frontera ₪144,990–156,990.
  - Crossland (discontinued).
- Citroën C3 Aircross ₪129,990–139,990 (carzone).
- New make DS, prices from https://www.carzone.co.il/DS-Automobiles:
  - DS 3 ₪218,990.
  - DS 7 ₪344,990.
  - DS 4 (no longer marketed, per carzone and cmotors.co.il).
- Missing generations:
  - Honda Civic 8th gen (2010–2011). Source: Wikipedia "Honda Civic (eighth generation)".
  - Honda CR-V 3rd gen (2010–2011). Source: Wikipedia "Honda CR-V (third generation)".

## 2026-10-21 (daily agent)
Prices checked on every brand page (all read today): carzone.co.il /Toyota /Hyundai /Kia /Lexus/ /Skoda/ /Volkswagen /SEAT /Cupra/ /Audi/ /Porsche /Ford /BYDAuto /Omoda-Jaecoo /chery /Geely /ZEEKR /LynkCo /Tesla /Smart /Peugeot /Citroen /DS-Automobiles /Opel /Jeep /Fiat /Alfa-Romeo /Renault /Dacia /MG /Suzuki /Nissan /Honda /Subaru /Mercedes-Benz /BMW /MINI/ /Volvo /XPENG /leapmotor /Genesis /KGM/ /Isuzu /Land-Rover; cartube.co.il price lists for Mazda, Mitsubishi and Polestar (carzone Polestar page is still 2024). The carzone ORA brand page could not be opened; ORA was checked on its model pages and cartube. `PRICES_VERIFIED` → 2026-10-21.

Price changes (generations.ts):
- Skoda Enyaq: ₪206,490–298,000 → ₪206,490–279,990. No trim at 298,000 on either source. Enyaq 206,490–229,990 and Enyaq Coupé 243,990–279,990 on both https://www.carzone.co.il/Skoda/ and https://www.cartube.co.il/מחירון-רכב-חדש/57-סקודה/364-סקודה-אניאק/compare (/365-סקודה-אניאק-קופה/compare).
- ORA 05: ₪139,990–148,990 → ₪139,990–151,900 (Signature Matte trim) — https://www.carzone.co.il/Ora/05/
- ORA 03 Funky Cat: ₪154,422 → ₪139,900–164,900 (Classic / Design / Pro+) — https://www.cartube.co.il/מחירון-רכב-חדש/14-אורה/83-אורה-03-פאנקי-קט/compare; Classic 139,900 also on https://www.auto.co.il/cars/ora/funky-cat/2026/580072/
- Smart #5: ₪259,990–299,990 → ₪229,990–299,990 (Pro trim, 340 hp) — https://www.carzone.co.il/Smart/5/ and https://www.cartube.co.il/מחירון-רכב-חדש/סמארט/סמארט-5 (the carzone brand card still starts at 259,990). Power "363" → "340–646".
- Hyundai i20: on_sale ₪136,900 → discontinued, price null. Not on https://www.carzone.co.il/Hyundai and marked "לא משווק יותר" on https://www.cartube.co.il/מחירון-רכב-חדש/יונדאי. Removed from the catalog (batch 15, `discontinued: true`).
- Fact fix: Geely Starray EM-i power "99 (petrol engine)" → "214 combined" — https://www.cartube.co.il/מחירון-רכב-חדש/26-ג-ילי/148-ג-ילי-סטאריי/1416-em-i-ultra-2026 and https://www.auto.co.il/articles/test-drives/road-tests/geely-starray-test-drive/

Checked and left unchanged (brand-page card disagrees with another source that still shows our figure — needs owner review):
- Nissan Qashqai max: carzone card 203,990 (omits e-Power); cartube lists e-Power Tekna TT 231,990 (kept).
- Honda HR-V max: carzone card 199,990; carzone model page https://www.carzone.co.il/Honda/HR-V/2026 still lists Advance Style 224,900 (kept); cartube shows only 184,900 / 199,900.
- Subaru BRZ max: carzone card and cartube 249,900; carzone model page https://www.carzone.co.il/Subaru/BRZ/ TS MT 259,900 (kept, one more day).
- Opel Corsa max (card 129,990 vs model page 134,990), Renault Arkana min (card 163,990 vs model page 161,990), Dacia Duster min (card 149,990 vs model page 139,990): model pages match our figures, kept.
- Dacia Sandero and Logan have no brand-page card but current 2026 model pages at our prices — kept on sale.
- Cupra Leon / Formentor ranges include the separately listed VZ versions; MINI Countryman includes Countryman Electric; Volvo XC40/EX40, Suzuki Vitara/e Vitara, Jaecoo 5 EV/hybrid, Chery FX/FX EV are combined lines — all match.
- Not on the importer list today, one source only (unchanged): Toyota C-HR, Kia EV6, Mazda CX-60, VW Polo / ID.4 / Touareg / T-Roc, Seat Ateca / Leon / Tarraco, Cupra Born / Ateca, Geely Okavango / Preface / Coolray, Suzuki Ignis / Jimny, Mercedes A-Class (only A-Class AMG).

Models added to generations.ts (15). Prices from the brand pages above; generations, engines and power from English Wikipedia (Omoda_C7, Chery_Tiggo_9, Mercedes-Benz_CLA, Mercedes-Benz_GLB, Mercedes-Benz_EQA, Mercedes-Benz_EQB, BMW_X2, BMW_iX3, Audi_Q4_e-tron, Audi_A5, Audi_Q8, Volvo_S60, Volvo_V60, Volvo_XC40) and the carzone model pages:
- Omoda 7 ₪179,900–199,900 (https://www.carzone.co.il/Omoda-Jaecoo/Omoda-7/; combined power not published, per https://www.auto.co.il/articles/test-drives/road-tests/omoda-7-road-test/).
- Omoda 9 ₪229,900–244,900 (https://www.carzone.co.il/Omoda-Jaecoo/Omoda-9/; power differs: carzone 537 hp, carmagazine 443 bhp — both shown). Euro NCAP 5★ 2025 (news.euroncap.com Omoda 9 2025).
- Chery Tiggo 9 ₪217,990–244,990 (https://www.carzone.co.il/chery/Tiggo-9); system power only an estimate ("over 400 hp", carzone news), stated as such.
- Mercedes CLA ₪309,900–479,900 (CLA 319,900–419,900 + CLA EQ 309,900–479,900 on the brand page). Euro NCAP: C118 5★ 2019, new CLA 5★ 2025 (news.euroncap.com). C117 left null.
- Mercedes GLB: status unverified, price null (not on the brand page; carzone has only a 2022 page). X247 5★ 2019 (news.euroncap.com).
- Mercedes EQA: on sale, price null — sources conflict (brand card 359,900–409,900; https://www.carzone.co.il/Mercedes-Benz/EQA/2026 from 299,000; https://www.cartube.co.il/מחירון-רכב-חדש/מרצדס/מרצדס-eqa 379,900–439,900). Needs owner review. 5★ 2019 (https://www.euroncap.com/en/results/mercedes-benz/eqa/43187). Battery recall (Farasis cells) — https://www.electrive.com/2025/02/17/mercedes-eqa-and-eqb-affected-by-battery-recall
- Mercedes EQB: unverified, price null (only a MY2025 carzone page). 5★ 2019 (news.euroncap.com).
- BMW X2 ₪319,900–346,900. U10 5★ (https://www.euroncap.com/en/results/bmw/x2/51929, based on the 2022 X1 test); F39 null. Brake-servo alert: https://car-recalls.eu/recall/bmw-x2-2022-2024-brakes-accident/
- BMW iX3 ₪434,900–544,900. NA5 5★ 2026 (BMW press release https://www.press.bmwgroup.com/global/article/detail/T0459155EN/); G08 carries the 2017 X3 rating (Euro NCAP confirmed the carry-over).
- Audi Q4 e-tron ₪299,000–359,900 (incl. Sportback). 5★ 2025 (news.euroncap.com Q4 e-tron 2025).
- Audi A5 ₪369,100–519,000 (https://www.carzone.co.il/Audi/A5/). B10 5★ 2024 (news.euroncap.com A5 2024); B8 and F5 null.
- Audi Q8 ₪726,200–822,000. 5★ 2019 (news.euroncap.com Q8 2019).
- Volvo S60, V60, C40 / EC40: discontinued (absent from carzone /Volvo; cartube Volvo list marks them no longer marketed). S60/V60 SPA 5★ 2018 and V60 gen 1 5★ 2011 (Volvo press releases); C40 5★ 2022 (news.euroncap.com).
Consumption figures are typical real-world estimates.

Models added to the recommendation catalog (4, `scripts/seed-vehicles-batch15.ts`), chosen from the Jan–Sep 2026 sales top 20 (https://www.cartube.co.il/חדשות-רכב/מסירות-רכב-חדש-בישראל-ספטמבר-2026): MG S9 (#13), BYD Sealion 05 DM-i (#14), XPENG G6 (#17), Geely Starray EM-i (#20). Sources in the batch header. Running costs are estimates, dataConfidence 56–58. No fifth model: the verified ranking lists only these four outside the catalog. Catalog now 49 cars; generations.ts 47 makes, 276 models.

## 2026-10-23 (daily agent)
No entry for 2026-10-22 (that run did not complete). Prices checked today on every brand page: carzone.co.il /Toyota /Lexus/ /Hyundai /Kia /Subaru /Skoda /Volkswagen /SEAT /Cupra /Audi /Porsche /Ford /Isuzu/ /BYDAuto /Omoda-Jaecoo /chery /Geely/ /ZEEKR/ /LynkCo /Tesla /Smart /Peugeot /Citroen /DS-Automobiles /Opel /Jeep/ /Fiat /Alfa-Romeo /Renault /Dacia /MG/ /Suzuki/ /Nissan /Honda /XPENG /leapmotor /Ora /KGM /Mercedes-Benz /BMW /MINI/ /Volvo /Land-Rover; cartube.co.il price lists for Mazda, Mitsubishi, Polestar 2 (compare page) and Genesis. The carzone Genesis brand page could not be opened; Genesis was checked on cartube plus carzone GV70 model pages. The cartube Polestar brand list, Fiat and Alfa Romeo lists could not be opened (carzone was enough for Fiat/Alfa). `PRICES_VERIFIED` → 2026-10-23.

Price changes (generations.ts):
- Subaru BRZ: ₪229,900–259,900 → ₪229,900–249,900. Brand card https://www.carzone.co.il/Subaru and https://www.cartube.co.il/מחירון-רכב-חדש/סובארו both top out at tS MT 249,900 (only the carzone model page still shows 259,900; second day flagged).

Status changes (two independent sources):
- Mercedes GLB unverified → discontinued: not on https://www.carzone.co.il/Mercedes-Benz; https://www.cartube.co.il/מחירון-רכב-חדש/מרצדס marks it "לא משווק יותר".
- Suzuki Ignis and Jimny unverified → discontinued: not on https://www.carzone.co.il/Suzuki/; "לא משווק יותר" on https://www.cartube.co.il/מחירון-רכב-חדש/סוזוקי.
- Seat Leon unverified → discontinued: not on https://www.carzone.co.il/SEAT; "לא משווק יותר" on https://www.cartube.co.il/מחירון-רכב-חדש/סיאט.

Checked and left unchanged — needs owner review:
- Open from 10-21, unchanged evidence: Mercedes EQA price (carzone card 359,900–409,900 / model page from 299,000 / cartube 379,900–439,900); Nissan Qashqai max (cartube e-Power 231,990 kept); Honda HR-V max (model page 224,900 kept); Opel Corsa max, Renault Arkana min, Dacia Duster min (model pages match ours); Smart #5 (model page from 229,990).
- ORA 07: on carzone at 226,900 but cartube now marks it "לא משווק יותר" (one source each way, kept). ORA 03: carzone shows a flat 154,422 for every trim (placeholder); cartube 139,900–164,900 kept.
- Kia EV6: not on the carzone brand page; cartube lists a 2026 GT-Line 4X4 at 309,900 (kept unverified). VW T-Roc (cartube 176,400–187,900) and ID.4 (cartube 234,900–292,900): same pattern, kept unverified. Mercedes A-Class and EQB: on cartube, not on carzone, kept unverified.
- Seat Ateca: cartube list says "לא משווק יותר" but a cartube 2026 trim page shows 167,900 — kept unverified.
- Audi Q3: carzone model page shows a 35 TFSI Comfort at 312,700, brand card and cartube start at 318,900 (kept).
- Subaru Outback: carzone 279,900 vs cartube 279,990 — our range covers both.
- Folding decisions (owner): Leapmotor B10 PHEV (154,900–164,900) into B10; MG EHS (175,888) into HS; Genesis GV70 Electrified (549,900–609,900) into GV70; Skoda Octavia RS (249,990), VW Golf GTI (304,900), Porsche Cayenne Coupé (797,000–1,797,000) into their base lines.
- Single source only (unchanged): Toyota C-HR, Mazda CX-60, Geely Okavango / Preface / Coolray, Cupra Born / Ateca, Seat Tarraco, VW Polo / Touareg.
- All other models on all makes matched the importer lists to the shekel.

Models added to generations.ts (15). Prices from the brand pages above unless noted; generations, engines and power from English Wikipedia (BYD_Sealion_05_DM-i, BYD_Seal_05_DM-i, MGS6_EV, Roewe_RX9, MG_Cyberster, BMW_2_Series_Gran_Coupé, BMW_X6, Audi_Q6_e-tron, Audi_Q2, Audi_A6, Mercedes-Benz_CLE, Volkswagen_ID._Buzz, Porsche_Taycan, Range_Rover_Velar, Range_Rover_Sport) and maker press releases; consumption figures are typical real-world estimates:
- BYD Sealion 05 DM-i ₪166,990–171,990 (https://www.carzone.co.il/BYDAuto/Sea-Lion-05); 212–213 hp combined (queenoftheroad / am-online). Euro NCAP null (only an ANCAP rating exists).
- BYD Seal 05 DM-i ₪174,990 (https://www.carzone.co.il/BYDAuto/05-DMi/); 218 hp per Israeli spec (Wikipedia says 208 hp — noted).
- MG S6 ₪168,888–178,888 (https://www.carzone.co.il/MG/S6/); 5★ 2025 (news.euroncap.com MG MGS6 EV 2025).
- MG S9 ₪189,888–198,888 (https://www.carzone.co.il/MG/S9/); 295 hp combined (evpowered.co.uk); 5★ 2025 (news.euroncap.com MG MGS9 PHEV 2025).
- MG Cyberster ₪363,888–393,888 (https://www.carzone.co.il/MG/Cyberster/); Israel spec 340/510 PS (queenoftheroad).
- BMW 2 Series Gran Coupé ₪294,900–324,900 (https://www.carzone.co.il/BMW/2-Series/Gran-Coupe); F44 5★ 2019 (1 Series rating applied, euroncap.com/en/results/bmw/2-series-gran-coup%C3%A9/41291); F74 4★ 2025 (news.euroncap.com BMW 2 Series Gran Coupé 2025); F74 engines from https://www.press.bmwgroup.com/united-kingdom/article/detail/T0445675EN_GB/
- BMW X6 ₪599,900–649,900 (brand card; cartube https://www.cartube.co.il/מחירון-רכב-חדש/ב-מ-וו/ב-מ-וו-x6 agrees); Euro NCAP null.
- Audi Q6 e-tron ₪404,900–559,900 incl. Sportback (brand cards); 5★ 2024 (news.euroncap.com Audi Q6 e-tron 2024).
- Audi Q2 ₪230,500 (https://www.carzone.co.il/Audi/Q2); 5★ 2016 (news.euroncap.com Audi Q2 2016). Production ended 04/2026 per Wikipedia; still on the Israeli list, so the generation stays open. Code "GA" not confirmed on Wikipedia.
- Audi A6: on sale, price null — carzone brand card 484,000–629,000 vs https://www.cartube.co.il/מחירון-רכב-חדש/אודי/אודי-a6 467,000–611,000 (owner review). C7 5★ 2011, C8 5★ 2018 (Audi press release), C9 5★ 2024 (news.euroncap.com Audi A6 2024).
- Mercedes CLE ₪399,900–519,990 (coupé, brand card; CLE Cabrio card 479,900–559,900 noted); 5★ 2025 (news.euroncap.com CLE Coupé 2025).
- VW ID. Buzz: on sale, price null — carzone card 385,000–452,000, model page 335,000, cartube 335,000–455,000 (owner review). 5★ 2022 (VW press release volkswagen-newsroom.com ... five-stars-from-euro-ncap-for-the-id-buzz-15359).
- Porsche Taycan: on sale, price null — carzone 757,000–1,897,000 vs https://www.cartube.co.il/מחירון-רכב-חדש/פורשה/פורשה-טייקן 700,000–1,550,000 (owner review). 5★ 2019 (news.euroncap.com Porsche Taycan 2019).
- Range Rover Velar ₪530,900–586,400 (https://www.carzone.co.il/Land-Rover/Range-Rover-Velar); 5★ 2017 (news.euroncap.com Velar).
- Range Rover Sport: on sale, price null — carzone 699,000–1,500,000 (page data inconsistent) vs https://www.cartube.co.il/מחירון-רכב-חדש/לנד-רובר/לנד-רובר-ריינג-רובר-ספורט 711,000–1,115,600. L461 5★ 2022 (euroncap.com/en/results/land-rover/range-rover-range-rover-sport/47131); L320/L494 null.

Models added to the recommendation catalog (4, `scripts/seed-vehicles-batch16.ts`; new catalog make slug `deepal`). The cartube Jan–Sep top 20 is already fully in the catalog, so the next sellers were taken from the rechargeable-only ranking at https://www.cars-israel-statistics.com/dashboard-en.html (data.gov.il registrations): Deepal S05 (#11), Omoda 7 (#12), Geely EX5/E5 (#14), Tesla Model 3 (#15). Sources per figure in the batch header. Chery Tiggo 9 (#17) skipped: base-trim specs and power not verified. Running costs are estimates, dataConfidence 55–62. Photo mappings added for Model 3, EX5, Omoda 7.
Catalog now 53 cars; generations.ts 47 makes, 291 models.
