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

## 2026-10-24 (daily agent)
Prices checked today on every brand page: carzone.co.il /Toyota /Lexus/ /Hyundai /Kia /Skoda /Volkswagen /SEAT /Cupra /Audi /Porsche /BYDAuto /Omoda-Jaecoo /chery/ /Geely /ZEEKR /LynkCo /Tesla /Smart /Deepal /Peugeot /Citroen /DS-Automobiles /Opel /Jeep /Fiat /Alfa-Romeo /Renault /Dacia /MG /Suzuki /Nissan /Honda /Subaru /Ford /Isuzu /KGM/ /XPENG/ /leapmotor /Ora /Mercedes-Benz /BMW /MINI /Volvo /Land-Rover; cartube.co.il price lists for Mazda, Mitsubishi, Genesis, Polestar and as second source for Toyota, Lexus, Hyundai, Kia, VW, Seat, Cupra, Audi, Porsche, BYD, Lynk & Co, Opel, Renault, Dacia, MG, Suzuki, Nissan, Honda, Subaru, Isuzu, Leapmotor, ORA, Mercedes, Land Rover. Could not open: carzone /Genesis (Genesis checked on cartube only), cartube BMW list (BMW carzone only). `PRICES_VERIFIED` → 2026-10-24.

Price changes (generations.ts):
- Opel Corsa: ₪126,990–134,990 → ₪126,990–129,990. https://www.carzone.co.il/Opel and https://www.cartube.co.il/מחירון-רכב-חדש/13-אופל (Edition 126,990 / GS Line 129,990).
- Honda HR-V: ₪184,900–224,900 → ₪184,900–199,990. https://www.carzone.co.il/Honda (184,900–199,990) and https://www.cartube.co.il/מחירון-רכב-חדש/הונדה (184,900–199,900); only the old carzone model page still shows Advance Style 224,900.

Catalog (batch 17), no price changes: trim names corrected — Chery Tiggo 8 Pro ₪179,990 is "Comfort 1.6T" (https://www.carzone.co.il/chery/Tiggo-8-Pro/; Noble = 189,990); MINI Countryman ₪273,000 is "C Classic HUD" (https://www.carzone.co.il/MINI/Countryman). Deepal S05 Euro NCAP 5★ 2025 now stated (https://www.euroncap.com/assessments/deepal/s05/1162/).

Checked and left unchanged — needs owner review:
- MG4 catalog entry: "Luxury 64 kWh" at ₪119,888, but cartube (https://www.cartube.co.il/מחירון-רכב-חדש/mg) lists Urban 119,888 / Luxury 142,888 / X-Range 144,888 and carzone news says "new MG4 from 142,888", while the carzone brand page still shows 119,888. +19% on the named trim; kept.
- Nissan Qashqai catalog trim "e-Power Acenta Tech ₪194,990" exists on neither source (e-Power trims: Tekna 227,990 / Tekna TT 231,990). Kept.
- Jaecoo 7: carzone model page shows Executive 1.6 at ₪169,900 (below the brand-page min 179,990); catalog J7 "1.6T ₪179,990" is the Elegance PHEV price there. Kept.
- Toyota Yaris Cross facelift: cartube 159,990–163,990 (Urban 162,490) vs carzone 159,990–160,990. Single source, kept.
- Genesis (cartube only): GV60 top 599,990 → 429,990 (−28%), GV70 top 459,990 → 609,900 incl. EV (+33%). >25% on one source — not applied.
- Suzuki "Vitara" line carries the e-Vitara price; petrol Vitara carzone 159,990–169,990 vs cartube 156,900 (split needed).
- Catalog priceMin values are ~94% of the trim price, not the line minimum (e.g. Picanto 93,900); left as is (pre-existing convention).
- Open from earlier, unchanged evidence: Mercedes EQA, A-Class, EQB; VW ID. Buzz, T-Roc, ID.4, Polo, Touareg; Audi A6; Porsche Taycan; RR Sport; Kia EV6 (cartube only 309,900); BYD Dolphin (cartube 149,990–156,990, absent from carzone); Lynk & Co 02 (carzone 159,900–169,900 vs cartube 171,900–179,900); ORA 03 (carzone flat 154,422); Smart #5 brand-page min 259,990 vs model page + cartube 229,990 (ours); MG Cyberster (carzone 363,888–393,888 vs cartube 348,888–378,888); Leapmotor T03 (cartube 89,900); Renault Austral (cartube 177,990–199,990); Dacia Sandero (cartube only); Lexus/Hyundai tops that differ on cartube.
- All other models on all makes matched the brand pages to the shekel.

Models added to generations.ts (15). Prices from the brand pages above; generations, engines and power from English Wikipedia (Alfa_Romeo_Giulia_(2015), Alfa_Romeo_Stelvio, SsangYong_Musso, KGM_Musso_EV, Range_Rover_(L322/L405/L460), Land_Rover_Discovery, Porsche_Panamera, BMW_X7, BMW_4_Series_(F32/G22), BMW_7_Series_(F01/G11/G70), Mercedes-Benz_GL-Class_(X166), Mercedes-Benz_GLS_(X167), Mercedes-Benz_S-Class_(W221/W222/W223), Mercedes-Benz_EQE, Audi_A6_e-tron, Deepal_S05); consumption figures are typical real-world estimates:
- Alfa Romeo Giulia ₪339,990 (carzone; cartube 339,990–369,990; Quadrifoglio 729,900 separate). 5★ 2016 (https://www.media.stellantis.com/ch-it/alfa-romeo/press/alfa-romeo-giulia-conquista-le-5-stelle-euro-ncap).
- Alfa Romeo Stelvio: unverified, price null — not on carzone; https://www.cartube.co.il/מחירון-רכב-חדש/19-אלפא-רומיאו 369,990–399,990. 5★ 2017 (https://www.euroncap.com/en/results/alfa+romeo/stelvio/27419).
- KGM Musso ₪274,900 (carzone + https://www.cartube.co.il/מחירון-רכב-חדש/20-אלפין/20-kgm-סאנגיונג-kgm-מוסו); Q300 launch https://www.auto.co.il/articles/car-news/local-news/new-kgm-musso-israel/
- KGM Musso EV ₪239,900–259,900 (carzone + https://www.cartube.co.il/מחירון-רכב-חדש/סאנגיונג/kgm-מוסו-ev); power conflict noted.
- Land Rover Range Rover: on sale, price null — carzone 949,000–1,782,000 vs https://www.cartube.co.il/מחירון-רכב-חדש/42-לנד-רובר 1,225,400–1,452,900. L460 5★ 2022 (https://www.euroncap.com/en/results/land+rover/range+rover/47130); L405 rating not confirmed → null.
- Land Rover Discovery ₪710,000 (carzone; cartube 711,000). L462 5★ 2017 (https://www.euroncap.com/en/results/land+rover/discovery/26434).
- Porsche Panamera: on sale, price null — carzone 867,000–1,897,000 vs https://www.cartube.co.il/מחירון-רכב-חדש/62-פורשה 790,000–1,570,000.
- BMW X7 ₪940,000; BMW 4 Series ₪409,000–575,000 (coupé + Gran Coupé + cabrio; G22 5★ 2019 https://www.euroncap.com/en/results/bmw/4-series-coup%C3%A9/42776); BMW 7 Series ₪899,900–1,315,900 (incl. i7) — https://www.carzone.co.il/BMW
- Mercedes GLS: on sale, price null — carzone 789,900–1,599,900 vs cartube 1,049,900. Mercedes S-Class ₪899,900–1,349,900 (carzone; cartube 899,000–1,349,900). Mercedes EQE: on sale, price null — carzone 499,900–649,900 vs cartube 558,900–1,049,900; 5★ 2022 (https://www.euroncap.com/assessments/mercedes-benz/eqe/0936/).
- Audi A6 e-tron ₪532,600–659,600 (Sportback, https://www.carzone.co.il/Audi); 5★ 2025 (https://www.euroncap.com/en/results/audi/a6+e-tron/54308). Generation code not on Wikipedia — "PPE" (platform) used, noted.
- Deepal S05 (new make) ₪149,990–189,990 (https://www.carzone.co.il/Deepal; cartube agrees); 5★ 2025 (https://www.euroncap.com/assessments/deepal/s05/1162/).
- Porsche 911 not added: no coupé body type in generations.ts (owner).

Models added to the recommendation catalog (4, `scripts/seed-vehicles-batch17.ts`; new catalog make slug `mitsubishi`), from the H1 2026 model ranking https://www.cartube.co.il/חדשות-רכב/זינוק-במסירות-רכב-חדש-מסירות-רכב-חדש-בישראל-יוני-2026: Skoda Scala (#17), Mitsubishi Outlander (#20), Chery FX (#21), Skoda Kamiq (#25). Kia Niro (#18) skipped (trim list / power conflict). Sources per figure in the batch header; running costs are estimates, dataConfidence 56–60. Photo mappings added for Scala, Kamiq, Outlander.
Catalog now 57 cars; generations.ts 48 makes, 306 models.

### 2026-10-24 — second pass (owner asked to resolve all open items)
Catalog (`scripts/seed-vehicles-batch18.ts`; depreciation rate kept, insurance scaled by (new/old)^0.6):
- MG4 Electric Luxury 64 kWh: ₪119,888 → ₪142,888 (+19%) — https://www.carzone.co.il/MG/4/2026 and https://www.cartube.co.il/מחירון-רכב-חדש/mg/mg-4/6825-mg4-luxury agree (Urban 54 kWh stays 119,888 as line minimum).
- Nissan Qashqai: trim "e-Power Acenta Tech ₪194,990" not on any list → e-Power Tekna ₪227,990 (+17%), 190 hp — https://www.cartube.co.il/מחירון-רכב-חדש/ניסאן (and trim page 6460), carzone brand-page top 227,990.
- Jaecoo J7: "1.6T ₪179,990" was the Elegance PHEV price (both sites) → Executive 1.6T ₪169,900, 147 hp — https://www.carzone.co.il/Omoda-Jaecoo/Jaecoo-7 (−5.6%; carzone only, cartube petrol trims unpriced).
- Toyota Yaris Cross line top → ₪163,990 (https://www.carzone.co.il/Toyota/Yaris-Cross/2026, https://www.cartube.co.il/מחירון-רכב-חדש/36-טויוטה/198-טויוטה-יאריס-קרוס/compare); generations.ts range ₪159,990–160,990 → ₪159,990–163,990.
- New: Kia Niro Hybrid (EX ₪176,900), Hyundai Elantra Hybrid (Prime ₪169,990), Citroën Berlingo (Combi ₪176,990) — sources in the batch header. dataConfidence 56–60.

generations.ts — 10 more models (prices from the carzone brand pages, second source cartube; generations from English Wikipedia):
- Hyundai Staria: unverified, price null (not on carzone; https://www.cartube.co.il/מחירון-רכב-חדש/יונדאי/יונדאי-סטאריה 315,900–339,900).
- Lexus LM ₪930,990–1,089,990 (carzone + https://www.cartube.co.il/מחירון-רכב-חדש/263-make/263-לקסוס-lm).
- Mercedes EQE SUV: price null (carzone 584,900–664,900 vs https://www.cartube.co.il/מחירון-רכב-חדש/מרצדס/מרצדס-eqe-suv 707,800–845,900); 5★ 2023 (https://www.euroncap.com/en/results/mercedes-benz/eqe+suv/50192).
- Mercedes G-Class: price null (carzone 1,199,900–1,299,900 vs cartube G 500 1,430,000); W463 II 5★ 2019 (news.euroncap.com G-Class 2019).
- BMW X4 ₪484,000 (carzone; cartube marks 2026 trims no longer marketed — one source each, kept on sale). BMW Z4 ₪449,900 (carzone sDrive20i; cartube 449,900–625,000); G29 5★ 2019 (news.euroncap.com BMW Z4 2019). Z4 and 911 use body "sedan" (no coupé/roadster type; CLE precedent).
- Audi A8: price null (carzone 998,400–1,051,200 vs https://www.cartube.co.il/מחירון-רכב-חדש/אודי/אודי-a8 972,250–1,024,000); D5 power not on Wikipedia → "לא אומת". Audi e-tron GT: price null (carzone 999,600 vs cartube 987,400–1,401,900); code "J1" = platform.
- Porsche 911: price null (carzone 997,000–2,297,000 vs cartube 925,000–1,885,000).
- Deepal S07 ₪201,990 (carzone + cartube); 5★ 2024 (news.euroncap.com Deepal S07 2024).
Notes added for folded variants: Elantra N, Ioniq 5 N, Sportage Long, Octavia RS, Golf GTI, MG EHS, GLE Coupé, GV70 3.5 Sport (cartube), GV80 Coupé, Cayenne Coupé, Yaris Cross facelift trims, Vitara petrol price.
Genesis re-checked (https://www.carzone.co.il/Genesis opened this time; https://www.cartube.co.il/מחירון-רכב-חדש/ג-נסיס): ours match carzone — no change. Genesis G90 (both agree 849,900–899,900) not added: generation data not verified today.
Still open (conflicting sources, unchanged): Lynk & Co 02 (carzone 159,900–169,900 vs cartube 171,900–179,900), BYD Dolphin (cartube only), Mercedes EQA / A-Class / EQB, VW T-Roc / ID.4 / ID. Buzz, Audi A6, Taycan, RR Sport. MG Cyberster: carzone 2026 compare and cartube now agree on 363,888–393,888 (ours).
Totals now: catalog 60 cars; generations.ts 48 makes, 316 models.

## 2026-10-25 (daily agent)
Prices checked today: carzone.co.il brand pages /Toyota /Lexus/ /Hyundai /Kia /Genesis/ /Subaru /Suzuki /Skoda /Volkswagen /SEAT /Audi /Nissan /Isuzu /Ford /Tesla /BYDAuto /Omoda-Jaecoo /chery/ /Geely/ /ZEEKR/ /LynkCo /Smart /Deepal /XPENG/ /leapmotor /Ora /MG /KGM/ /Peugeot /Citroen /DS-Automobiles /Opel /Jeep /Fiat /Alfa-Romeo /Renault /Dacia /Mercedes-Benz /BMW /MINI /Volvo /Land-Rover; cartube.co.il price lists for Mazda, Mitsubishi, Polestar and as second source for Toyota, Lexus, Hyundai, Kia, Genesis, Subaru, Honda, Suzuki, VW, Seat, Cupra, Audi, Porsche, Nissan, Tesla, BYD, Omoda/Jaecoo, Chery, Geely, Lynk & Co, Smart, Deepal, XPENG, Leapmotor, ORA, MG, KGM, Peugeot, Citroën, Jeep, Alfa Romeo, Renault, Dacia, Mercedes, BMW (opened today), Land Rover. Could not open: carzone /Honda (HR-V model page used), /Cupra, /Porsche (Cupra and Porsche checked on cartube only — no changes applied); cartube Skoda, MINI, Volvo lists. `PRICES_VERIFIED` → 2026-10-25.

Price changes (generations.ts):
- Audi Q4 e-tron: ₪299,000–359,900 → ₪314,900–379,900 (Q4 314,900–377,800 on both https://www.carzone.co.il/Audi and https://www.cartube.co.il/מחירון-רכב-חדש/10-אודי; Sportback 334,900–379,900 carzone, cartube to 397,800). Note updated.
- Audi A6: price null → ₪484,000–629,000 (carzone https://www.carzone.co.il/Audi; cartube 484,500–629,000 — now within ₪500).
- MG4: ₪119,888 → ₪119,888–144,888 (carzone model page https://www.carzone.co.il/MG/4 Urban 119,888 / Luxury 142,888 / X-Range 144,888; https://www.cartube.co.il/מחירון-רכב-חדש/6-mg agrees).
Status → discontinued, price null (absent from the carzone brand page AND absent / "לא משווק יותר" on cartube): Toyota C-HR (https://www.cartube.co.il/מחירון-רכב-חדש/36-טויוטה), VW Polo (https://www.cartube.co.il/מחירון-רכב-חדש/60-פולקסווגן), Seat Ateca and Tarraco (https://www.cartube.co.il/מחירון-רכב-חדש/54-סיאט), Geely Okavango, Preface, Coolray (https://www.cartube.co.il/מחירון-רכב-חדש/26-ג-ילי).
Catalog: no price changes — every catalog trim price matched its source today.

Checked and left unchanged — needs owner review:
- Jeep Avenger: carzone 164,900–179,900 (https://www.carzone.co.il/Jeep/Avenger) vs cartube ICE 159,900–174,900 (EV 179,900–199,900); ours 164,900–174,900.
- Subaru BRZ: carzone 229,900–259,900 vs cartube 229,900–249,900 (ours).
- MG ZS: carzone model page 136,888–137,888 vs cartube 137,888 (ours). MG HS: cartube has no 154,888 petrol trim.
- One-source "no longer marketed" (cartube only; carzone still lists): ORA 07, MG5, KGM Tivoli (also in catalog), Voyah Free/Dream. Kia EV6: cartube brand list 309,900 but its trim page says no longer marketed; carzone absent.
- Porsche (carzone failed; cartube only): Macan 635,000–930,000 (ours 587,000–877,000), Cayenne 695,000–1,075,000 (ours 787,000–1,507,000) — not applied.
- Toyota Yaris Cross Urban (carzone 160,990 vs cartube 162,490), Corolla (159,900 vs 159,990), Land Cruiser top (527,990 vs 530,990), Outback (279,900 vs 279,990) — kept.
- Renault 5 min 168,999 on carzone (= ours) vs 168,990 cartube — likely a carzone typo; kept.
- Toyota C-HR / Polo / Seat / Geely status changes above: the generation data stays (used market).
- Catalog notes: Tucson "Premium 1.6T" ₪189,990 — cartube names the trim at that price "1.6 Turbo Hybrid One"; Tesla Model Y trim is "Premium RWD" on cartube; several catalog priceMin values (C3 94,000, Seal U 188,000, J8 215,000, Tiggo 4 126,000, Model Y 235,000) are below the line minimum (pre-existing convention, see 2026-10-24).
- Still open (sources disagree, unchanged): Lynk & Co 02, BYD Dolphin (cartube only) and Atto 2 Boost, Leapmotor T03, ORA 03, Mercedes A-Class / EQA / EQB / GLS / EQE / EQE SUV / G-Class, Range Rover / RR Sport, VW ID. Buzz (max 452,000 vs 455,000), T-Roc / ID.4 (cartube only), Audi A8 / e-tron GT / Q6 e-tron (cartube ~120k higher), Porsche Taycan / Panamera / 911, Hyundai Staria, Alfa Romeo Stelvio (cartube only), Renault Austral, Honda HR-V top.

Models added to generations.ts (10). Prices from the carzone brand pages, second source cartube; generations/engines/power from English Wikipedia (Genesis_G90, Mercedes-Benz_EQS_SUV, Mercedes-Benz_SL-Class / SL_(R232), BMW_2_Series_(F22) / (G42), XPeng_X9, Skyworth_EV6, Voyah_Courage, Nammi_01, Aeolus_Haohan, Roewe_Marvel_X); consumption figures are typical real-world estimates:
- Genesis G90 ₪849,900–899,900 (https://www.carzone.co.il/Genesis/ + https://www.cartube.co.il/מחירון-רכב-חדש/ג-נסיס agree). No generation codes on Wikipedia → "Gen1"/"Gen2". NCAP null.
- Mercedes EQS SUV (X296): price null — carzone 874,900–1,039,900 vs cartube 990,000–1,350,000. NCAP null (EQS 2021 rating covers the hatchback only).
- Mercedes SL (R230/R231/R232): price null — carzone 999,900–1,899,900 vs cartube 1,390,000–1,950,000.
- BMW 2 Series Coupé (F22/G42) ₪319,900–329,900 (218i trims, carzone https://www.carzone.co.il/BMW and https://www.cartube.co.il/מחירון-רכב-חדש/ב-מ-וו/ב-מ-וו-סדרה-2 agree; M240i noted). G42 4★ 2022 (https://www.euroncap.com/en/results/bmw/2+series+coup%C3%A9/45236).
- XPENG X9 (H93) ₪399,990 (carzone https://www.carzone.co.il/XPENG/ + https://www.cartube.co.il/מחירון-רכב-חדש/22-אקספנג/109-אקספנג-x9). 5★ 2026 (https://www.euroncap.com/assessments/xpeng/x9/1231/).
- MG Marvel R: discontinued (carzone MG page says replaced by S6, no price; no cartube listing). 4★ 2021 (https://www.euroncap.com/en/results/mg/marvel+r/43818). Power 180–288 hp from carzone (Wikipedia inconsistent).
- New make Skywell: ET5 ₪166,900–187,900 (https://www.carzone.co.il/Skywell + https://www.cartube.co.il/מחירון-רכב-חדש/סקייוול/סקייוול-et5).
- New make Voyah: Courage ₪175,900–190,900 (https://www.carzone.co.il/Voyah/Courage/ + https://www.cartube.co.il/מחירון-רכב-חדש/33-וויה); 5★ 2025 (https://www.euroncap.com/en/results/voyah/courage/54896).
- New make Dongfeng: Box price null — carzone 104,900 (https://www.carzone.co.il/Dongfeng/Box/) vs cartube 113,900; 3★ 2025 (https://www.euroncap.com/en/results/dongfeng/box/57178). Mage ₪149,900 (https://www.carzone.co.il/Dongfeng/Mage/ + cartube trim page 6994 agree; Israeli spec 1.5T PHEV 188 hp, 17 kWh).
- Not added: Mercedes GLC Coupé (coupé generation years not verified), Voyah Free/Dream (sources disagree on whether sold).

Models added to the recommendation catalog (5, `scripts/seed-vehicles-batch19.ts`): Toyota Yaris Hybrid (Eco ₪140,990), Peugeot 2008 (Allure MHEV ₪149,990), Mazda CX-5 (Comfort AWD ₪189,900), Skoda Karoq (Selection ₪169,490), Kia Seltos (LX Plus ₪164,900). Sources per figure in the batch header; running costs are estimates, dataConfidence 56–60. None of the five is in the H1 2026 top 20 (https://www.queenoftheroad.co.il/?p=86435) — chosen as the most common mainstream models still missing from the catalog. Photo mappings added for Yaris, CX-5, Karoq, Seltos.
Totals now: catalog 65 cars; generations.ts 51 makes, 326 models.

## 2026-10-31 (daily agent)
Prices checked today (carzone brand pages + cartube price lists): Toyota, Lexus, Hyundai, Kia, Genesis, Isuzu, Mazda (cartube + carzone), Mitsubishi, Subaru, Honda, Suzuki, Nissan, Ford, Tesla, Volvo, VW, Seat, Cupra, Audi, Porsche, BYD, Omoda/Jaecoo, Geely, Zeekr, Lynk & Co, Smart, XPENG, Leapmotor, ORA, MG, KGM, Peugeot, Citroën, Jeep, Fiat, Alfa Romeo, Renault, Dacia, Mercedes-Benz, BMW, MINI, Land Rover. One source only: Polestar (cartube; carzone page not found), Skoda (cartube + carzone model pages; carzone /Skoda failed), Chery (carzone; cartube blocked), Opel, DS, Dongfeng, Voyah, Skywell (carzone; cartube blocked). Not checked: Deepal (both sources failed; search budget exhausted). Because Deepal was not checked, `PRICES_VERIFIED` stays 2026-10-25.
Energy prices: unchanged — the November petrol notice is not out yet on 31/10 (October figure already applied 2026-10-01).

Price / status changes (generations.ts):
- Hyundai Staria: price null / unverified → ₪315,990–339,990, on_sale (https://www.carzone.co.il/Hyundai/Staria Premium 315,990 / Lakeshore 339,990; https://www.cartube.co.il/מחירון-רכב-חדש/יונדאי 315,900–339,900). Not on the carzone Hyundai brand page — noted.
- Jaecoo 7: ₪179,990–202,990 → ₪179,990–189,990 (https://www.carzone.co.il/Omoda-Jaecoo and https://www.cartube.co.il/מחירון-רכב-חדש/25-ג-אקו agree: only PHEV Elegance 179,990 / Premium 189,990 listed). Note added.
- Mazda CX-60: unverified → discontinued (absent from https://www.carzone.co.il/Mazda and https://www.cartube.co.il/מחירון-רכב-חדש/44-מאזדה).
- Cupra Born: unverified → discontinued (absent from https://www.carzone.co.il/Cupra and from the https://www.cartube.co.il/מחירון-רכב-חדש/70-קופרה list).
- Cupra Ateca: unverified → discontinued (absent from carzone; cartube marks it "לא משווק יותר").
Catalog (`scripts/seed-vehicles-batch20.ts`):
- Toyota Corolla Hybrid LE: ₪159,900 → ₪159,990 (https://www.carzone.co.il/Toyota/Corolla + cartube Toyota list; 159,900 is now a separate "Limited Edition" trim). Depreciation rate kept (1,132 → 1,133/month); insurance unchanged after rounding.
- Jaecoo J7: line max ₪202,990 → ₪189,990 (same two sources as above).

Models added to generations.ts (14; generations/engines/power from English Wikipedia, consumption = real-world estimates; pre-2010 generations clipped to 2010 as elsewhere in the file):
- New make Chevrolet: Spark, Aveo / Sonic, Cruze, Malibu, Captiva (all discontinued; carzone model-year pages e.g. https://www.carzone.co.il/Chevrolet/Spark/2018/compare/, https://www.carzone.co.il/Chevrolet/Sonic/2013/), Trax ₪165,990–169,990 on sale (1RS / 2RS, carzone and cartube agree). Wikipedia: Chevrolet_Spark, Chevrolet_Aveo, Chevrolet_Cruze, Chevrolet_Malibu, Chevrolet_Captiva, Chevrolet_Trax. Euro NCAP: Spark M300 4★ 2009 (https://www.euroncap.com/en/results/chevrolet/spark/11034), Aveo/Sonic 5★ 2011 (Euro NCAP "Best in Class 2011"), Cruze J300 5★ 2009 and Trax U200 5★ 2013 (cdn.euroncap.com datasheets euroncap_chevrolet_cruze_2009_5stars.pdf / ..._trax_2013_5stars.pdf). carzone /Chevrolet brand page could not be opened.
- Toyota Auris (E180 5★ 2013, https://cdn.euroncap.com/media/6042/euroncap_toyota_auris_2013_5stars.pdf), Toyota Avensis (T270, 5★ 2015, news.euroncap.com Frankfurt 2015 release), Hyundai Accent / i25 (carzone https://www.carzone.co.il/Hyundai/Accent/i25-Accent/2012/; cartube marks it no longer sold), Hyundai i40 (5★ 2011, https://www.euroncap.com/en/results/hyundai/i40/10973), Kia Optima (NCAP null), Citroën C4 Picasso / SpaceTourer (Gen2 5★ 2013) — all discontinued.
- Citroën C4 X: unverified, price null (carzone ₪129,990; cartube Citroën list not opened by this researcher).
- Renault Kangoo ₪177,990 on sale (carzone + cartube agree; both list it as commercial, 5 seats, 1.5 dCi auto). Gen3 4★ 2021.
- Skipped: Mitsubishi Lancer (Wikipedia page could not be opened).

Models added to the recommendation catalog (5, batch 20): Hyundai Kona Electric (Pure ₪174,990), Skoda Elroq (60 Advance ₪182,990), BYD Sealion 7 (Boost ₪198,990), Toyota C-HR+ (Motion ₪179,990; NCAP stars not claimed), Peugeot 3008 (Allure MHEV ₪186,990). Sources per figure in the batch header (auto.co.il model pages, cartube trim pages, carzone). Kona is #2 Jan–Sep 2026 (cartube / auto.co.il September 2026 sales articles); the others are outside the published top 20. Running costs are estimates, dataConfidence 56–58. Photo mappings added for Elroq, Sealion 7, C-HR+, 3008.

Checked and left unchanged — needs owner review:
- Jaecoo J7 catalog trim "Executive 1.6T" ₪169,900 is on neither carzone nor cartube today (only PHEV trims) — the catalog entry should probably switch to the PHEV.
- Toyota Corolla: carzone model page adds Executive ₪174,990 (brand page single price 159,900). Yaris Cross: carzone brand 160,990 / cartube 159,990 top vs ours 163,990 (carzone model page shows Style 169,000).
- Suzuki Vitara line (154,990–179,990) equals the e Vitara range; hybrid Vitara carzone 159,990–169,990 vs cartube 156,900.
- Skoda (cartube only): Fabia max 142,990 (ours 135,990), Karoq max 191,490 (ours 202,990; Sportline no longer marketed), Superb max 278,990 (ours 293,490); carzone Enyaq page shows only 85 Suite 298,000. Catalog "Octavia Selection 115hp" has powerHp 150 — trim name or hp is wrong.
- Smart #5 (carzone from 259,990 vs cartube Pro 229,990), Zeekr 001 (cartube 283,990–344,990 vs ours = carzone), XPENG P7 (carzone says no longer marketed; cartube still lists it), Leapmotor B10 range EV-only vs PHEV included, Peugeot 2008 / 5008 / 408 cartube differences, Chery FX Sense 144,990 on a cartube trim page.
- Ford Explorer min, Nissan Qashqai max, Subaru BRZ top, Honda HR-V top, Volvo XC60 / ES90 min — carzone vs cartube differ (ours matches one).
- ORA 05 catalog priceMax 148,990 vs generations.ts 151,900 (carzone Signature Matte) — internal inconsistency.
- Still open: Kia EV6 (cartube only), Mercedes A-Class / EQA / EQB / GLS / EQE / EQE SUV / G-Class / EQS SUV / SL, Range Rover / RR Sport, Alfa Stelvio, Porsche Taycan / Panamera / 911, VW T-Roc / ID.4 / ID. Buzz / Touareg, Audi A8 / e-tron GT, Jeep Avenger, Renault Austral, Lynk & Co 02, BYD Dolphin / Atto 2 / Seal U PHEV top, ORA 03 / 07, MG5 / HS / EHS, KGM Tivoli (cartube now no price), Dongfeng Box, Leapmotor T03.
Totals now: catalog 70 cars; generations.ts 52 makes, 340 models.

## 2026-11-01 (daily agent)
Prices checked today (carzone brand pages + cartube price lists, both sources): Lexus, Hyundai, Kia, Genesis, Isuzu, Mazda, Mitsubishi, Honda, Suzuki, Nissan, Ford, Chevrolet, VW, Seat, Cupra, Audi, Porsche, Tesla, Volvo, BYD, Omoda/Jaecoo, Geely, Zeekr, Lynk & Co, Smart, XPENG, Leapmotor, MG, KGM, Skywell, Peugeot, Citroën, DS, Opel, Jeep, Fiat, Alfa Romeo, Renault, Dacia, Mercedes-Benz (cartube partly loaded), BMW, MINI, Land Rover. Partial: Toyota (cartube only; carzone /Toyota timed out), Skoda (cartube only; carzone /Skoda timed out), Subaru (cartube + carzone model pages; brand page timed out), Polestar (cartube + carzone model page), Chery (carzone + cartube model pages; Tiggo 7 Pro / Tiggo 9 carzone only), ORA (carzone + cartube 03 page), Deepal, Voyah, Dongfeng (carzone only; cartube not readable). Every make was checked on at least one source → `PRICES_VERIFIED` = 2026-11-01.
Energy prices: NOT updated — the November 2026 petrol notice could not be looked up (web search budget for the run was exhausted by the price checks). October figure (₪8.27) stays; must be updated next run.

Price / status changes (generations.ts):
- Citroën C4 X: unverified / null → on_sale ₪129,990 (https://www.carzone.co.il/Citroen/ and https://www.cartube.co.il/מחירון-רכב-חדש/סיטרואן agree).
- No other model line changed on both sources. Convention kept: sub-variants that carzone lists as separate models (AMG / M versions, Lexus ES EV, Elantra N, GV70 Electrified, Leapmotor B10 PHEV, MG EHS, Peugeot e-3008 / e-5008, Fiat Doblò Maxi cargo) are not folded into the base line — cartube folds them in, which is why it often shows a higher top price.

Models added to generations.ts (14; generations/engines/power from English Wikipedia — Mitsubishi_Lancer, Mitsubishi_Pajero_Sport, Mazda_Premacy, Renault_Fluence, Renault_Kadjar, Opel_Insignia, Opel_Meriva, Ford_C-Max, Ford_Mondeo_(third_generation) / (fourth_generation), Honda_Accord_(Japan_and_Europe_eighth_generation), Honda_Insight, Toyota_Verso, Peugeot_508, Suzuki_Vitara (Grand Vitara JT); consumption = real-world estimates; all discontinued, price null):
- Mitsubishi Lancer, Pajero Sport; Mazda5 (hp not on Wikipedia → "—"); Renault Fluence, Kadjar; Opel Insignia, Meriva; Ford C-Max / Grand C-Max, Mondeo; Honda Accord, Insight; Toyota Verso (hp "—"); Peugeot 508 (not on https://www.carzone.co.il/Peugeot; last Israeli MY 2022 per https://www.carzone.co.il/Peugeot/508/2022); Suzuki Grand Vitara.
- Euro NCAP confirmed: Kadjar 5★ 2015 (https://news.euroncap.com/safercars/new-ratings-released-ahead-of-the-2015-frankfurt-motor-show/s/9f455009-a6c8-4090-9395-30cdb36d2658), Meriva B 5★ 2010 (https://cdn.euroncap.com/media/7111/euroncap_opel_meriva_2009_5stars.pdf), 508 Gen1 5★ 2011 (https://cdn.euroncap.com/media/6707/euroncap_peugeot_508_2011_5stars.pdf), Verso 5★ 2010 (https://cdn.euroncap.com/media/7368/toyota_verso_2010_datasheetok.pdf), Mondeo Mk V 5★ 2019 facelift (https://news.euroncap.com/safercars/ford-mondeo---euro-ncap-2019-results---5-stars/s/7151b91c-a087-41dc-9609-e84d5900a95a). All others null.
- Skipped: Renault Scenic / Grand Scenic (Wikipedia gives no engine/power data).

Models added to the recommendation catalog (5, `scripts/seed-vehicles-batch21.ts`): MG ZS Hybrid+ (Luxury ₪137,888), Suzuki Swift (GLX CVT ₪129,990), BYD Dolphin Surf (Boost ₪114,990), Skoda Superb (Selection ₪203,490; 5★ 2024), Hyundai Ioniq 5 (Pure 84 kWh ₪214,990; 5★ 2021). Sources per figure in the batch header (auto.co.il model/trim pages, cartube trim pages, carzone). Sales basis: cartube September 2026 report (no October report yet); none is in the top 20. Running costs are estimates, dataConfidence 56–58. Photo mappings added for Swift, Superb, Dolphin Surf (BYD Seagull article).
Totals now: catalog 75 cars; generations.ts 52 makes, 354 models.

Checked and left unchanged — needs owner review:
- Grouping rule (owner): cartube folds AMG/M/EV/PHEV sub-variants into the main line; both sources would then agree on e.g. Mercedes E-Class 509,900–909,900, GLC 489,900–679,900, BMW 1 Series to 439,900, X3 to 649,900, X2 to 465,000, 2 Gran Coupé to 460,000, Lexus ES to 429,990, Elantra to 234,900, Genesis GV70 to 609,900, Leapmotor B10 to 164,900.
- One-source differences (other source = ours): Lynk & Co 02 (cartube 171,900–179,900), Zeekr 001, Chery FX (cartube 144,990–168,990), Jaecoo 5 (cartube from 147,900 petrol), Geely EX5 / Starray, BYD Atto 2 / Seal U tops, XPENG P7 (cartube top 316,990), Leapmotor T03 (cartube 89,900), Audi Q6 e-tron (cartube from 524,900, +29.6%), Porsche (cartube lower across the board), Volvo XC60 / ES90 mins, Skoda Fabia / Kamiq / Karoq / Superb tops (cartube), Land Rover / MINI / BMW cartube differences, Peugeot 208 / 2008, DS 7, Jeep Wrangler / Avenger, Alfa Junior / Giulia, Renault Clio / Captur / Arkana / Austral, Dacia Duster, Honda HR-V top, Nissan Qashqai top, Subaru Outback, Toyota Corolla / Land Cruiser top, Lexus NX / RX / LBX, Hyundai Tucson / Santa Fe / Palisade (cartube).
- Price null, both sources show a price but disagree: VW ID. Buzz (385,000 both; max 452,000 vs 455,000), Audi e-tron GT, Porsche Taycan / Panamera / 911, Mercedes EQA / EQE / EQE SUV, Range Rover / RR Sport. Carzone only: Mercedes GLS, G-Class, EQS SUV, SL; Dongfeng Box 104,900.
- One-source "no longer marketed" (cartube; carzone still lists): MG5, KGM Tivoli (also in catalog). Kia EV6, BYD Dolphin, Geely Geometry C, DS 4, Alfa Stelvio, VW ID.4 / T-Roc priced on cartube only.
- Suzuki Vitara line still holds the e Vitara range (known, see queue).
- Catalog: Swift claimed consumption differs by source (20.8 used; 21.2–23.2 elsewhere); Superb line max 293,490 (carzone/importer) vs cartube 278,990.

## 2026-11-07 (daily agent)
Prices checked today (carzone brand pages + cartube price lists, both sources): Toyota, Lexus, Hyundai, Genesis, Kia, Mazda, Mitsubishi, Isuzu, Chevrolet, Skoda, VW, Seat, Cupra, Audi (cartube page cut off after ~40k chars: no Q7 / Q8 / A6 e-tron / A8 / e-tron GT prices there), Porsche (cartube looks stale), Subaru, Honda, Suzuki, BYD, Omoda, Geely, Lynk & Co, XPENG, Leapmotor, Peugeot, Citroën, DS, Opel, Jeep, Fiat, Alfa Romeo, Renault, Dacia, Nissan, Mercedes-Benz, BMW, MINI, Land Rover, Volvo, Tesla, Ford, MG, KGM, Deepal, Skywell, Voyah, Dongfeng. One source: Polestar (cartube; carzone shows no price), Chery, Zeekr, Smart, ORA, Jaecoo (carzone; cartube fetch failed). Every make was checked on at least one source → `PRICES_VERIFIED` = 2026-11-07.

Energy prices (`src/data/energyPrices.json`): petrol ₪8.27 (Oct 1) → ₪7.85 from 2026-11-05.
- Official notice https://www.gov.il/BlobFolder/news/fuel-november-2026/he/fuel-november-2026.pdf (29/10/2026): max ₪7.35/L self-service 95 from 1/11/2026, rising to ₪8.35 from 5/11 if the excise order is not renewed. (In between, https://www.gov.il/BlobFolder/news/fuel-october-5-2026/he/fuel-5-october-2026.pdf had cut October's ₪8.27 to ₪7.77 from 5/10 — missed by earlier runs.)
- The Finance Minister renewed half of the excise cut, so the max from 5/11/2026 is ₪7.85 (https://www.auto.co.il/articles/car-news/local-news/new-nov-gas-prices-2026/ dated 04.11.2026; also https://www.ice.co.il/consumerism/news/article/1135883). No gov.il notice for 5/11 was found → **needs owner review** (re-check against gov.il; the reduced excise is reported to run to the end of November / 5 December).
- Electricity unchanged.

Price changes (generations.ts):
- VW Tiguan: ₪239,900–269,900 → ₪249,900–269,900 (https://www.carzone.co.il/Volkswagen; cartube https://www.cartube.co.il/מחירון-רכב-חדש/פולקסווגן shows 209,900–249,900, which looks stale — neither source still shows 239,900).
- ORA 05: ₪139,990–151,900 → ₪139,990–148,990 (https://www.carzone.co.il/Ora; cartube not readable today). The catalog already had 148,990, so the two now match.
- Jeep Avenger: ₪164,900–174,900 → ₪164,900–179,900 (https://www.carzone.co.il/Jeep; cartube https://www.cartube.co.il/מחירון-רכב-חדש/ג-יפ 159,900–199,900 — neither source still shows 174,900 as the top price).
- No change was over 25%. Catalog: no price changes (Tiguan and Avenger are not in the catalog).

Models added to generations.ts (15; generations/engines/power from English Wikipedia; consumption = real-world estimates; pre-2010 generations clipped to 2010):
- Discontinued / used market (price null): Mitsubishi Pajero (https://en.wikipedia.org/wiki/Mitsubishi_Pajero), Kia Soul (Kia_Soul; Gen2 4★ 2014 https://news.euroncap.com/home/evs-and-urban-crossovers-to-end-euro-ncap-s-year/s/d8070153-f29a-43bd-8707-a23a2d3d8e10), Kia Venga (Kia_Venga; 5★ 2010 https://news.euroncap.com/safercars/kia%20venga%20-%20%20euro%20ncap%20results%202010/s/11718375-9fc8-4e94-bb63-524d915e5ca3; hp taken from the Hyundai ix20 twin article), Hyundai ix20 (Hyundai_ix20; Euro NCAP applies the Venga rating, https://news.euroncap.com/images-and-videos/hyundai-ix20---crash-test-2011/s/eb96fc57-7036-42bf-abc7-ad879ba36a83), Nissan Tiida (Nissan_Tiida; C12 hp not given → "—"), Nissan Almera N17 (Nissan_Almera; hp "—"), Suzuki Alto (Suzuki_Alto, Maruti_Suzuki_Alto), Suzuki Splash (Suzuki_Splash), Skoda Roomster (Škoda_Roomster), Citroën C5 X7 (Citroën_C5; 5★ 2009 https://cdn.euroncap.com/media/7415/euroncap_citroen_c5_2009_5stars.pdf), Citroën C-Elysée (Citroën_C-Elysée; 3★ 2014 https://cdn.euroncap.com/media/4585/euroncap_citroen_c-elysee_2014_3stars.pdf), Seat Altea (SEAT_Altea; NCAP null), Opel Zafira Tourer C (https://www.wikiwand.com/en/articles/Opel_Zafira mirror; Euro NCAP tested 2011 but star count not shown on https://euroncap.com/en/results/opel/vauxhall/zafira+tourer/10990 → null).
- On sale: Mercedes GLC EQ ₪439,900–639,900 (carzone https://www.carzone.co.il/Mercedes-Benz/ and cartube "GLC EQ" agree; X540 data from https://en.wikipedia.org/wiki/Mercedes-Benz_GLC_with_EQ_technology; NCAP null). Chevrolet Colorado ₪433,000 (ZR2; carzone https://www.carzone.co.il/Chevrolet and cartube agree; https://en.wikipedia.org/wiki/Chevrolet_Colorado + https://news.chevrolet.com/newsroom.detail.html/Pages/news/us/en/2022/jul/0728-colorado.html; US hp).

Models added to the recommendation catalog (2, `scripts/seed-vehicles-batch22.ts`): Toyota Aygo X Hybrid (Pure ₪123,990; https://www.auto.co.il/cars/toyota/aygo-x/2026/hybrid-pure/), MG HS Hybrid (Luxury HEV ₪158,888; https://www.auto.co.il/cars/mg/hs/2026/579634/ + https://www.carzone.co.il/MG/HS/2026). Euro NCAP not claimed for either (the published results cover other powertrains). Running costs are estimates, dataConfidence 56–58. Photo mappings added. Peugeot 208 was researched but skipped (trim hp and list price disagree between sources). Sales basis: cartube October 2026 report (Jan–Oct top 5 only; https://www.cartube.co.il/חדשות-רכב/מסירות-רכב-חדש-בישראל-אוקטובר-2026).
Totals now: catalog 77 cars; generations.ts 52 makes, 369 models.

Checked and left unchanged — needs owner review:
- Suzuki Vitara line still holds the e Vitara range 154,990–179,990 (both sources list eVitara at that range as its own model); hybrid Vitara carzone 159,990–169,990 vs cartube 156,900.
- Smart #5: carzone now from 259,990 (ours 229,990, earlier cartube Pro; cartube not readable today). MG4: carzone card shows only 119,888 (cartube = ours). ORA 03: carzone shows 154,422 for Classic / Design (odd figure; ours 139,900–164,900).
- Grouped lines that include a sub-line carzone lists separately (convention kept): Skoda Enyaq (+Coupé), Audi A3 / Q4 e-tron / Q6 e-tron (+Sportback), Cupra Formentor / Leon (+VZ), MINI Countryman (+electric), Jeep Wrangler (+3-door), Land Rover Defender (=110 only), BMW 4 Series (3 lines) / 7 Series (+i7), Volvo XC40 / EX40, Mercedes CLA (= CLA EQ; plain CLA 319,900–419,900).
- One-source differences (other source = ours): Toyota Yaris Cross / Corolla / Land Cruiser, Lexus LBX / NX / RX / ES, Hyundai Tucson / Santa Fe / Palisade / Elantra / Kona, Genesis GV60 / GV70, Kia EV3 / Seltos, Skoda Karoq / Kamiq / Superb / Fabia, Seat Arona, Subaru BRZ (carzone top 259,900) / Outback (279,900 vs 279,990), Honda HR-V, Geely EX5, Lynk & Co 02, XPENG P7, Leapmotor T03, BYD Atto 2 / Seal U, Peugeot 208 / 2008, DS 7, Alfa Junior / Giulia, Renault Clio / Captur / Arkana / Austral, Dacia Duster (carzone from 149,990), Nissan Qashqai (carzone top 203,990), Mercedes / BMW / Land Rover / MINI / Porsche cartube ranges.
- Price null, both sources show a price but disagree or only one source: Mercedes EQA / EQB / EQE / EQE SUV / GLS / G-Class / EQS SUV / SL, Range Rover / RR Sport, Porsche Taycan / Panamera / 911 (cartube stale), VW ID. Buzz (cartube no price), Audi e-tron GT (carzone 999,600), Dongfeng Box (carzone 104,900 vs cartube 113,900), Kia EV6 (cartube 309,900 only), Alfa Stelvio (cartube 369,990–399,990 only), VW ID.4 / T-Roc (cartube only).
- One-source status conflicts: BYD Dolphin (discontinued here; cartube lists 149,990–156,990, carzone not), DS 4 (cartube lists 269,990–328,990, carzone not), Hyundai Staria (cartube only), Dacia Logan (cartube only), VW ID.3 (carzone only), MG5 / KGM Tivoli (carzone yes, cartube "לא משווק").

## 2026-11-08 (daily agent)
Prices checked today on both sources for every make (carzone brand pages https://www.carzone.co.il/<Make> + cartube price lists https://www.cartube.co.il/מחירון-רכב-חדש/<make>), except Polestar (carzone shows only the 2024 page with no price; cartube read). Partial cartube pages: Mercedes (prices only for A / CLA / C / C EQ / EQA / GLA / GLC EQ), BMW (cut off at i4). `PRICES_VERIFIED` = 2026-11-08.
Energy prices: unchanged. No gov.il notice for 5/11/2026 was found (only https://www.gov.il/BlobFolder/news/fuel-november-2026/he/fuel-november-2026.pdf: ₪7.35 from 1/11, ₪8.35 from 5/11 if the excise order is not renewed). ₪7.85 (press reports of a half excise renewal) still **needs owner review**.

Price changes: none (0). No model line moved on both sources.
- Audi Q4 e-tron (both sources 314,900–377,800) and Q6 e-tron (carzone 404,900–539,900) tops are lower than ours (379,900 / 559,900), but our tops equal carzone's Sportback lines, which these lines include by convention → left unchanged.
- Suzuki Vitara: still holds the e Vitara range 154,990–179,990 (both sources list e Vitara at exactly that); hybrid Vitara carzone 159,990–169,990 vs cartube 156,900 → owner decision still open.
- Catalog: no price changes.

Models added to generations.ts (15, all discontinued / used market, price null; generations/engines/power from English Wikipedia; consumption = real-world estimates):
- Kia Carens (https://en.wikipedia.org/wiki/Kia_Carens; RP 5★ 2013 https://cdn.euroncap.com/media/5884/euroncap_kia_carens_2013_5stars.pdf)
- Toyota Aygo (https://en.wikipedia.org/wiki/Toyota_Aygo; AB10 3★ 2012 https://news.euroncap.com/safercars/all/nissan-primastar---euro-ncap-/toyota-aygo-and-twins-disappoint-in-safety-tests--according-to-euro-ncap-s-latest-test-series/s/3331906f-a951-46bb-bd47-72b8bebb8de4; AB40 4★ 2014 https://news.euroncap.com/safercars/euro-ncap-reveals-latest-safety-ratings/s/b802bc3f-01df-4711-be17-891dfe720c6f, 2017 retest 3★/4★ https://news.euroncap.com/safercars/toyota-aygo---euro-ncap-results-2017/s/df1d0e5b-f1be-4409-95d7-1f49cc864847)
- Toyota GT86 (https://en.wikipedia.org/wiki/Toyota_86; NCAP null)
- VW up! (https://en.wikipedia.org/wiki/Volkswagen_Up; power only given in PS → "—"; 3★ 2019 https://www.euroncap.com/assessments/vw/up!/0787/)
- Skoda Citigo (same article; NCAP stars not shown on https://www.euroncap.com/en/results/skoda/citigo/10996 → null)
- VW Touran (https://en.wikipedia.org/wiki/Volkswagen_Touran; 5T 5★ 2015 https://www.euroncap.com/en/results/vw/touran/20975)
- VW Scirocco (https://en.wikipedia.org/wiki/Volkswagen_Scirocco; 2009 star count only inferable from image names → null)
- Hyundai Veloster (https://en.wikipedia.org/wiki/Hyundai_Veloster; NCAP null)
- Audi A1 (https://en.wikipedia.org/wiki/Audi_A1; GB 5★ 2019 https://news.euroncap.com/find-a-car/audi-a1/s/2aff10d4-11b2-440a-add1-a6d1c9078c7c)
- Volvo V40 (https://wikiwand.com/en/Volvo_V40_(2012–2019); NCAP stars not confirmed → null)
- Opel Adam (https://en.wikipedia.org/wiki/Opel_Adam; 4★ 2013 https://news.euroncap.com/safercars/euro-ncap-releases-latest-round-of-crash-tests/s/54eb5cb5-a93b-4cd1-9274-7fcd33163d15)
- Mazda CX-7 (https://en.wikipedia.org/wiki/Mazda_CX-7; NCAP null)
- Ford EcoSport (https://en.wikipedia.org/wiki/Ford_EcoSport; 4★ 2013 https://news.euroncap.com/safercars/euro-ncap-publishes-the-results-of-eleven-vehicles/s/0ea4bee8-c69e-41e9-abf3-d6b9e88d8d89)
- Chevrolet Orlando (https://en.wikipedia.org/wiki/Chevrolet_Orlando; 5★ 2011 https://news.euroncap.com/safercars/euro-ncap-releases-crash-test-results-for-10-cars-and-brings-additional-advanced-reward/s/f5f1a221-904c-4c4f-b260-ef6e560551e0)
- Mitsubishi i-MiEV (https://en.wikipedia.org/wiki/Mitsubishi_i-MiEV; European years 2010–2014; NCAP null)

Models added to the recommendation catalog (2, `scripts/seed-vehicles-batch23.ts`; new catalog makes Dacia, Renault): Dacia Duster Hybrid (Adventure ₪149,990; https://www.auto.co.il/cars/dacia/duster/2026, https://www.auto.co.il/cars/dacia/duster/2026/580635/), Renault Clio (Evolution 1.0T ₪124,990; https://www.auto.co.il/cars/renault/clio/2026/581117/, https://www.carzone.co.il/Renault/Clio/2026). Euro NCAP not claimed. Running costs are estimates, dataConfidence 56. Photo mappings added. Skipped: Omoda 5 Hybrid, Hyundai i10, Kia Sportage petrol (see COVERAGE.md).
Totals now: catalog 79 cars; generations.ts 52 makes, 384 models.

Checked and left unchanged — needs owner review:
- One-source differences (other source = ours), mostly cartube: Toyota Yaris Cross (carzone top 160,990) / Land Cruiser / Corolla (cartube 159,990), Lexus LBX / NX / RX, Hyundai Tucson / Santa Fe / Palisade, Kia EV3 / Seltos, Subaru BRZ (carzone top 259,900) / Outback, Honda HR-V, Skoda Fabia / Kamiq / Karoq / Superb, VW Tiguan (cartube 239,900 min), Audi Q2 / Q5 / A5 / A6, Porsche Macan / Cayenne, Volvo XC60 / ES90, BYD Atto 2, Jaecoo 7 (cartube adds hybrid 169,900), Geely EX5 / Starray, Chery Tiggo 4 Pro / FX, Zeekr 001, Lynk & Co 02, ORA 03 (carzone 154,422), XPENG P7, Smart #5 (carzone from 259,990), Peugeot 208 / 2008 / 408, DS 7, Opel Corsa, Jeep Avenger / Wrangler, Alfa Junior / Giulia, Renault Arkana (carzone from 163,990) / Austral / Captur, Dacia Duster (carzone from 149,990), Nissan Qashqai (carzone top 203,990), Mercedes C-Class (carzone news: facelift from 379,900) / GLA / CLA, BMW 3 / 5 Series / X1, MINI, Land Rover (cartube).
- Renault 5 E-Tech min 168,999 (carzone) vs 168,990 (cartube) — possible carzone typo.
- Price null, both sources show a price but disagree: VW ID. Buzz, Audi A8 / e-tron GT, Porsche Taycan / Panamera / 911, Mercedes EQA, Range Rover / RR Sport, Dongfeng Box (104,900 vs 113,900). Carzone only: Mercedes GLS / EQE / EQE SUV / G-Class / EQS SUV / SL.
- One-source status conflicts: ORA 07 / MG5 / KGM Tivoli (cartube no longer marketed / no price; carzone lists), BYD Dolphin / Geely Geometry C / DS 4 / Alfa Stelvio / VW T-Roc / ID.4 (cartube only), Dacia Logan (cartube only), Kia EV6 (cartube "no longer marketed", carzone absent — ours already null/unverified).

## 2026-11-09 (daily agent)
Prices checked today on carzone brand pages (https://www.carzone.co.il/<Make>) for every make, and on cartube price lists (https://www.cartube.co.il/מחירון-רכב-חדש/<make>) for every make except Kia, Skoda, Cupra, Jaecoo, Opel and Zeekr (cartube brand pages blocked today; single model/trim pages read instead where possible: Kia Stonic, Skoda Scala, Cupra Formentor 1.5, Opel Astra, Zeekr 7GT LR RWD — all match ours). Cartube Audi page cut off after the A6 e-tron (no cartube figure for A8 / e-tron GT / Q7 / Q8). `PRICES_VERIFIED` = 2026-11-09.
Energy prices: unchanged (no new gov.il notice found; ₪7.85 from 5/11 still **needs owner review**, see 2026-11-07).

Price changes (generations.ts, 3 — none over 25%):
- Hyundai Palisade: ₪349,990–389,990 → ₪349,990–410,990 (carzone https://www.carzone.co.il/Hyundai/ and cartube https://www.cartube.co.il/מחירון-רכב-חדש/יונדאי agree).
- Hyundai Santa Fe: ₪329,990–359,990 → ₪319,990–359,990 (both sources from 319,990; top: cartube 359,990 = ours, carzone 399,990 → top kept).
- Renault Captur: ₪151,990 → ₪151,990–152,990 (https://www.carzone.co.il/Renault and https://www.cartube.co.il/מחירון-רכב-חדש/רנו agree).
- Catalog: no price changes (none of these is in the catalog).

Models added to generations.ts (15; generations/engines/power from English Wikipedia or its wikiwand / IPFS / Kiwix mirrors where en.wikipedia.org was blocked; consumption = real-world estimates):
- Discontinued / used market (price null): Fiat Tipo 356 (https://wikiwand.com/en/articles/Fiat_Tipo_(2015); 3★ 2016 https://news.euroncap.com/fiat/fiat-tipo---euro-ncap-results-2016/s/d1992af5-0116-41f9-a2ff-7474c6c639a4), Fiat Punto (Grande Punto / Evo NCAP null; Punto 2012 0★ 2017 https://www.euroncap.com/press-media/fading-stars/; hp "—" for 2012 — article contradicts itself), Jeep Renegade BU (https://wikiwand.com/en/articles/Jeep_Renegade; 5★ 2014 https://www.media.stellantis.com/es-es/jeep/press/nuevo-jeep-renegade-logra-la-clasificaci-n-5-estrellas-euroncap), Jeep Cherokee KL (Kiwix copy of en.wikipedia Jeep_Cherokee_(KL); 5★ 2013 https://news.euroncap.com/home/euro-ncap-latest-round-of-crash-tests/s/21cf8b99-6c8c-4655-88b5-8d5dcdaf83f8), Peugeot 207 (https://en.wikipedia.org/wiki/Peugeot_207; NCAP null), Peugeot 107 and Citroën C1 gen 1 (3★ 2012 https://news.euroncap.com/images/toyota-aygo-and-twins-disappoint-in-safety-tests--according-to-euro-ncap-s-latest-test-series/s/3331906f-a951-46bb-bd47-72b8bebb8de4), Peugeot 108 and Citroën C1 gen 2 (4★ 2014 https://news.euroncap.com/safercars/euro-ncap-reveals-latest-safety-ratings/s/b802bc3f-01df-4711-be17-891dfe720c6f), Renault Koleos (https://en.wikipedia.org/wiki/Renault_Koleos; Gen2 5★ 2017 https://news.euroncap.com/safercars/occupant-protection-a-side-issue-for-some/s/abb73dc9-5dcf-41d9-894f-fac8d0872e64), Renault Zoe (https://en.wikipedia.org/wiki/Renault_Zoe; split by battery period; 2021 0★ https://www.euroncap.com/en/results/renault/zoe/44206; 2013 stars not confirmed → null), Alfa Romeo Giulietta 940 (5★ 2010 https://news.euroncap.com/safercars/all/euro-ncap-announces-2010-best-performing-cars/s/807ae4e3-ba29-4edb-a28d-878e9cb728cb).
- Status "unverified": Fiat 500 (312 + 500e 332; IPFS copy of en.wikipedia Fiat_500_(2007), https://wikiwand.com/en/Fiat_New_500; 312 5★ 2007 https://www.media.stellantis.com/uk-en/fiat/press/euro-ncap-five-star-safety-rating-for-fiat-500; 500e 4★ 2021). Carzone lists a 500C at 180,000, cartube lists the 500 with no price → price null.
- On sale: Leapmotor B05 ₪139,900 (carzone https://www.carzone.co.il/leapmotor and cartube https://www.cartube.co.il/מחירון-רכב-חדש/41-ליפמוטור agree; https://en.wikipedia.org/wiki/Leapmotor_Lafa_5; 5★ 2026 https://news.euroncap.com/safercars/choose-a-car/leapmotor-b05---euro-ncap-2026-results---5-stars/s/b713a24f-c34e-4373-ad61-17919baed53e), Chevrolet Blazer EV ₪389,990 (carzone https://www.carzone.co.il/Chevrolet and cartube agree; https://wikiwand.com/en/articles/Chevrolet_Blazer_EV; Israeli hp not verified → "—"; NCAP null), Kia EV5 ₪198,900–219,900 (carzone https://www.carzone.co.il/Kia/EV5 + auto.co.il trim pages; cartube brand page blocked today, cartube launch news has the same prices; https://en.wikipedia.org/wiki/Kia_EV5; 5★ 2025 https://www.euroncap.com/en/results/kia/ev5/57962).

Models added to the recommendation catalog (2, `scripts/seed-vehicles-batch24.ts`; new catalog make Leapmotor): Kia EV5 (Premium LR ₪198,900; https://www.auto.co.il/cars/kia/ev5/2026/premium/, https://www.auto.co.il/cars/kia/ev5/2026/executive/), Leapmotor B05 (Design ₪139,900; https://www.auto.co.il/cars/leap-motor/b05/2026/218hp-design/). Running costs are estimates, dataConfidence 58–62. Photo mappings added.
Totals now: catalog 81 cars; generations.ts 52 makes, 399 models.

Checked and left unchanged — needs owner review:
- Suzuki Vitara: both sources list e Vitara at 154,990–179,990 = our Vitara range; hybrid Vitara carzone 159,990–169,990 vs cartube 156,900 (owner decision still open).
- One-source differences (other source = ours): Toyota Yaris Cross (carzone 159,990–160,990, cartube 158,990–159,990 — neither shows 163,990) / Corolla / Hilux / Land Cruiser, Hyundai Venue / Tucson / Elantra / Kona / Staria, Mazda CX-5 (carzone from 184,900), Tesla Model Y (carzone 242,160), Seat Arona (cartube top 142,900), BYD Atto 2 / Seal U, Jaecoo 7 (carzone 169,900–202,990) / Jaecoo 5, Geely EX5 / Starray, Chery Tiggo 8 Pro / FX / Tiggo 4 Pro / Arrizo 8, Peugeot 208 / 2008 / 408, VW Tiguan (carzone 209,000–259,900) / Tayron (carzone 229,900–249,900, cartube no price), Audi Q3 / Q5 / Q2 / A5 / A6 / Q4 e-tron, Nissan Qashqai, Ford Explorer, Renault Clio / Austral / 5 E-Tech (168,999 vs 168,990), Dacia Duster, Honda HR-V, Subaru XV / BRZ / Outback, Lexus LBX / NX / RX / ES, Volvo XC60 / ES90, Citroën C4 / C4 X (carzone tops 154,990 / 158,990), DS 7, Opel Corsa (carzone top 134,990), Lynk & Co 02 (cartube 171,900–179,900), ORA 05 (carzone top 169,900), XPENG P7, Genesis GV60 / GV70, MINI, Jeep (carzone brand ranges look implausible), Fiat Doblò, Land Rover / Porsche (cartube differs on every line), Alfa Junior, Mercedes / BMW cartube ranges (include AMG / M trims).
- Kia Seltos: absent on carzone today, cartube Kia unreadable → left on sale (one source only).
- Price null, sources disagree or one source only: Mercedes A-Class / EQA / EQB / GLS / EQE / EQE SUV / G-Class / EQS SUV / SL, VW ID.4 / T-Roc / ID. Buzz, Audi A8 / e-tron GT, Range Rover / RR Sport, Porsche Taycan / Panamera / 911, Dongfeng Box (104,900 vs 113,900).
- One-source status conflicts: MG5 / ORA 07 / Alfa Giulia (cartube "no longer marketed", carzone lists), VW ID.3 / Dacia Logan / Dacia Jogger price (one source), DS 4 / Geely Geometry C / BYD Dolphin (cartube only).

## 2026-11-14 (daily agent)
No daily-agent runs on 2026-11-10 → 2026-11-13 (log gap). Prices checked today on carzone brand pages (https://www.carzone.co.il/<Make>; DS, Fiat, Deepal, Skywell, Voyah, Dongfeng, Jeep via model pages) and cartube price lists (https://www.cartube.co.il/מחירון-רכב-חדש/<make>) for every make, except cartube Volkswagen, Cupra and Jaecoo (blocked today) and cartube Deepal / Dongfeng / Chevrolet (single trim/compare pages only). carzone Toyota ranges look mixed with import/old listings today (e.g. Land Cruiser 40,000–609,000) → not used. `PRICES_VERIFIED` = 2026-11-14.
Energy prices: not touched (not the first run of the month; ₪7.85 from 5/11 still **needs owner review**, see 2026-11-07).

Price changes (generations.ts, 4 — none over 25%; both sources agree):
- Kia EV3: ₪169,900–186,900 → ₪164,900–186,900 (https://www.carzone.co.il/Kia, https://www.cartube.co.il/מחירון-רכב-חדש/קיה).
- BMW X1: ₪319,900–329,900 → ₪309,900–329,900 (https://www.carzone.co.il/BMW/, https://www.cartube.co.il/מחירון-רכב-חדש/23-ב-מ-וו; cartube top 455,000 = M trim, convention).
- Opel Corsa: ₪126,990–129,990 → ₪126,990–134,990 (https://www.carzone.co.il/Opel, https://www.cartube.co.il/מחירון-רכב-חדש/אופל; cartube from 124,990, carzone 126,990 → from kept).
- MINI Countryman: ₪273,000–339,000 → ₪269,000–339,000 (https://www.carzone.co.il/MINI, https://www.cartube.co.il/מחירון-רכב-חדש/מיני; top: carzone Electric 339,000 = ours, cartube 335,000 → kept).
Status: Alfa Romeo Stelvio unverified → discontinued (not on https://www.carzone.co.il/Alfa-Romeo; https://www.cartube.co.il/מחירון-רכב-חדש/אלפא-רומיאו marks it "לא משווק יותר").
Catalog: no price changes. Kia EV3 catalog trim (Premium SR ₪169,900) not changed — the new ₪164,900 entry trim not verified (**owner review**). MINI Countryman catalog trim (C Classic HUD ₪273,000) unchanged.

Models added to generations.ts (13; generations/engines/power from Wikipedia mirrors — en.wikipedia.org blocked today — wikiwand / handwiki / cavac / riteme / krisyotam, plus maker pages; PS/kW converted to hp; consumption = real-world estimates):
- On sale: Hyundai Elantra N ₪224,900–234,900, Ioniq 5 N ₪409,900, Ioniq 6 N ₪399,900 (both sources, https://www.carzone.co.il/Hyundai/ + https://www.cartube.co.il/מחירון-רכב-חדש/יונדאי; https://www.wikiwand.com/en/articles/Hyundai_Elantra, https://www.hyundai.news/eu/models/performance/ioniq-5-n/press-kit/press-information.html, https://www.hyundai.com/eu/en/models/ioniq6-n.html; NCAP null), Genesis GV80 Coupe ₪599,990–725,000 (both sources; https://wikiwand.com/en/articles/Genesis_GV80; NCAP null).
- Discontinued / used market (price null): Fiat Panda 169 / 319 (https://cavac.at/cavacopedia/Fiat_Panda; 319 4★ 2011 https://news.euroncap.com/safercars/euro-ncap-releases-new-tests-chinese-manufacturers-invest-in-safety/s/9ad3ac2b-f9f4-4910-962a-1cd3b1a550b1, 0★ 2018 https://news.euroncap.com/safercars/panda--wrangler-off-the-pace-in-latest-safety-ratings/s/33e7b559-4146-49d2-be40-d58c7d12a061), Mazda MX-5 NC / ND (https://www.wikiwand.com/en/Mazda_MX-5_(NC), https://www.wikiwand.com/en/articles/Mazda_MX-5_(ND); NCAP stars not shown on euroncap → null), VW Sharan 7N (https://cavac.at/cavacopedia/Volkswagen_Sharan; 5★ 2011 https://news.euroncap.com/safercars/euro-ncap-releases-crash-tests-results-for-14-cars/s/818c8c95-63dd-4a2f-96d8-d210c8461a03), VW Beetle A5 (https://handwiki.org/wiki/Engineering:Volkswagen_Beetle_(A5); 5★ 2011, same release as Panda), VW Arteon (https://wikiwand.com/en/articles/Volkswagen_Arteon; stars not in text → null), Ford S-Max Mk1/Mk2 (https://handwiki.org/wiki/Engineering:Ford_S-Max) and Galaxy Mk3/Mk4 (https://wiki.riteme.site/wiki/Ford_Galaxy) — 2015 release says "top ratings" but no per-car stars → null, Lexus CT 200h (https://wikiwand.com/en/Lexus_CT; 5★ 2011 https://news.euroncap.com/safercars/euro-ncap-reveals-results-for-6-new-cars-including-first-5-star-rating-for-a-fully-electric-vehicle/s/ae9a225f-7c97-4cdf-b11a-3d4aa8dd1d10), Lexus IS XE20 / XE30 (https://wikiwand.com/EN/Lexus_IS; NCAP null).
Models added to the recommendation catalog: none this run.
Totals now: catalog 81 cars; generations.ts 52 makes, 412 models.

Checked and left unchanged — needs owner review:
- MG HS: both sources now top at ₪175,888 (carzone HS range; cartube = HS Plug-in Luxury) — same figure as MG EHS → grouping decision (owner) before changing the HS top.
- Fiat Doblò: both sources from ₪168,990, but on cartube that is the 3-seat Maxi Long cargo van (5-seat Combi still 169,990) → kept.
- Chery FX: both differ from ours but disagree (carzone FX EV 151,990–173,990 / FX 152,990–159,990; cartube 144,990–168,990).
- Jeep Avenger: both tops higher than ours but disagree (cartube 159,900–199,900 incl. electric; carzone 164,900–214,900 incl. 4xe).
- One-source differences (other source = ours): Toyota Land Cruiser (cartube top 530,990), Hyundai Venue / Kona / Tucson / Santa Fe / Staria, Kia Picanto / Stonic / Niro / Seltos, Mazda CX-5, Skoda Fabia / Kamiq / Karoq / Superb / Octavia / Enyaq, BYD Atto 2 / Seal U, Tesla Model Y, Seat Arona, Geely EX5, Chery Tiggo 4 Pro / Tiggo 8 Pro / Arrizo 8, Jaecoo 5 / 7 (carzone only), Mitsubishi Outlander (carzone top 256,990), Peugeot 208 (sources disagree) / 2008 / 408 / 5008, MG4 / ZS / S5, Mercedes / BMW / Audi (many lines; cartube incl. AMG/M/RS), Nissan Qashqai, Ford Explorer, Renault Clio / Austral / 5 E-Tech (168,999 vs 168,990), Honda HR-V, Subaru BRZ, VW Golf / Tiguan / Tayron (carzone only), Lexus LBX / NX / RX / ES, Volvo XC60 / XC90 / ES90, Citroën C4 / C4 X, DS 7, Zeekr 001, Lynk & Co 02, ORA 05 / 03, XPENG P7, Leapmotor T03, MINI Aceman / Hatch, Genesis GV60 / GV70, Isuzu D-Max (cartube top 311,990), Land Rover / Porsche / Alfa Junior (cartube).
- Price null, sources disagree or one source only: Mercedes A-Class / EQA / EQB / EQE / EQE SUV / EQS SUV / G-Class / GLS / SL, Audi A8 / e-tron GT, VW T-Roc / Touareg / ID. Buzz (carzone only), Range Rover / RR Sport, Porsche Taycan / Panamera / 911, Dongfeng Box (104,900 vs 113,900), Kia EV6 (cartube 309,900 only), Fiat 500 (carzone 500C 180,000 only).
- One-source status conflicts: MG5 / ORA 07 / Alfa Giulia / KGM Tivoli (cartube "no longer marketed", carzone lists), Mercedes EQB / VW ID.4 (not on carzone; cartube VW unreadable).
