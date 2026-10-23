# Catalog coverage plan

Goal: every car model marketed new in Israel today, plus every model sold here since 2010 that is common on the used market,
appears in `generations.ts` (browse by make), and the popular ones also appear in the recommendation catalog.
The daily market agent works through this list top to bottom and ticks items off. Owner can reorder or add lines at any time.

## Rules
- Source for "marketed in Israel": the importer price list as shown on carzone.co.il brand pages (or cartube.co.il price list).
- A model goes into `generations.ts` when its generations since 2010, engines and status can be stated; Euro NCAP only when confirmed.
- A model goes into the recommendation catalog only when list price, powertrain and consumption are verified from a model page.
- Up to 8 models into `generations.ts` and up to 3 into the catalog per daily run. Quality over speed.

## Queue — missing models of makes already covered
- [x] Toyota: Aygo X, Corolla Cross, C-HR+, Camry, Land Cruiser, Hilux (2026-10-20)
- [x] Toyota: Prius (used) (2026-10-20)
- [x] Hyundai: Venue (2026-10-20)
- [x] Hyundai: Kona, Kona Electric, Ioniq 6, Santa Fe, Sonata (still on sale), i30 (used) (2026-10-20)
- [x] Kia: Stonic (2026-10-20)
- [x] Kia: EV3, Sorento, Carnival, EV9, Ceed (used), Rio (used) (2026-10-20)
- [ ] Kia: Carnival YP generation (2014–2020) and Ceed ED (2010–2012) not filled — Wikipedia page lacked the details; JD/CD/UB horsepower not tied to a generation
- [x] Mazda: CX-90, Mazda6 (used), CX-3 (used) (2026-10-20)
- [ ] Mazda6 GH generation (2010–2012): engines/hp for Israel not on Wikipedia, not filled
- [x] Skoda: Fabia, Scala, Elroq, Enyaq, Rapid (used), Yeti (used) (2026-10-20)
- [ ] Skoda: carzone.co.il/Skoda/ brand page could not be read this run — prices taken from model/compare pages; re-check full ranges (Scala shows one priced trim only)
- [x] BYD: Dolphin Surf, Atto 2, Sealion 7 (2026-10-20)
- [x] BYD: Sealion 05 DM-i, Seal 05 DM-i (2026-10-23)
- [ ] BYD: Atto 2 EV (₪148,990) — inside the Atto 2 range; decide whether to list separately
- [x] Omoda & Jaecoo: Omoda 7, Omoda 9 (2026-10-21)
- [x] Chery: Tiggo 9 (2026-10-21); FX EV stays inside the FX line (brand page lists FX 146,990–159,990 and FX EV 151,990–173,990)
- [x] Suzuki: Baleno (used), SX4 (used), Celerio (used) (2026-10-20)
- [ ] Suzuki Fronx: not on the Suzuki price list 2026-10-20 — skip unless it appears
- [x] Peugeot: Rifter, 308 (used, no longer on price list), 301 (used) (2026-10-20)
- [ ] Peugeot: e-208; 308 T9/P5 engine outputs to fill
- [x] Volkswagen: T-Cross, T-Roc (unverified: not on brand page), ID.3, Passat (used), Jetta (used) (2026-10-20)
- [x] Volkswagen: ID. Buzz (price null: sources disagree) (2026-10-23)
- [ ] Volkswagen: T-Roc status (model page shows ₪180,000–189,900 but brand page omits it)
- [x] MG: MG3, S5 (2026-10-20)
- [x] MG: S6, S9, Cyberster (2026-10-23)
- [ ] MG: EHS (₪175,888) — decide whether to fold into the HS line (owner)
- [x] Mercedes-Benz: GLA (2026-10-20)
- [x] Mercedes-Benz: CLA, GLB (unverified: not on price list), EQA (price null: sources conflict), EQB (unverified) (2026-10-21)
- [x] Mercedes-Benz: CLE (coupé; cabrio noted) (2026-10-23)
- [ ] Mercedes-Benz: EQA price to settle (carzone card 359,900–409,900, model page 299,000, cartube 379,900–439,900)
- [x] BMW: 5 Series, X1 (iX1 noted in X1 line) (2026-10-20)
- [x] BMW: X2 (iX2 noted in X2 line), iX3 (2026-10-21)
- [x] BMW: 2 Series Gran Coupé, X6 (2026-10-23)
- [x] Audi: Q7 (2026-10-20)
- [x] Audi: A5, Q4 e-tron, Q8 (2026-10-21)
- [x] Audi: A6 (price null: carzone and cartube disagree), Q6 e-tron (incl. Sportback), Q2 (2026-10-23)
- [ ] Audi: A6 e-tron (separate model, ₪532,600–659,600 Sportback)
- [ ] Seat/Cupra: verify current price lists for Ibiza, Ateca, Leon, Tarraco, Born

## Queue — seen on importer price lists 2026-10-20, not yet covered
- [x] Hyundai: Palisade, Ioniq 9 (2026-10-20)
- [ ] Hyundai: Elantra N / Ioniq 5 N (performance versions)
- [x] Volkswagen: Tayron (2026-10-20)
- [ ] Volkswagen: Golf GTI
- [ ] Peugeot: e-3008 / e-5008 (check whether to fold into 3008/5008 lines)
- [ ] Mercedes-Benz: EQE, EQE SUV, EQS SUV, GLC Coupé, GLE Coupé, GLS, S-Class, G-Class, CLE Cabrio, SL
- [ ] BMW: 2 Series Coupé, iX2, 4 Series, X6, X7, 7 Series / i7, Z4
- [ ] Audi: Q2, A6 e-tron, A8, e-tron GT
- [ ] Commercial (low priority): Toyota ProAce / ProAce City / ProAce Verso, Peugeot Boxer, VW Caddy / Transporter / Crafter / ID.Buzz Cargo

## Queue — seen on importer price lists 2026-10-21, not yet covered
- [ ] Kia: Sportage Long (₪189,900–209,900) — decide whether to fold into Sportage
- [ ] Skoda: Enyaq Coupé (now folded into the Enyaq range), Octavia RS (₪249,990)
- [ ] MG: S6 (₪168,888–178,888), EHS (₪175,888), S9 (₪189,888–198,888; in catalog since 2026-10-21), Cyberster (₪363,888–393,888)
- [ ] Leapmotor: B10 PHEV (₪154,900–164,900), C10 REEV (₪174,900–184,900) — fold into B10 / C10 lines?
- [ ] Genesis: GV70 Electrified (₪549,900–609,900), GV80 Coupé (₪599,990–725,000)
- [ ] Citroën: C4 X (₪129,990), ë-Berlingo (₪177,990); Opel: Combo Life XL (₪184,990), Zafira (₪289,990)
- [ ] Ford: F-250 / F-350 Crew Cab, e-Transit; Bronco 3-door (₪499,000) inside Bronco range
- [ ] Mercedes-Benz: CLE Cabrio, GLC EQ (₪439,900–639,900), A-Class AMG only (A-Class status still unverified)
- [ ] BMW: iX1 / iX2 as separate lines?, 4 Series (Coupé / Gran Coupé / Cabrio), X6, X7, 7 Series / i7, Z4, M models
- [ ] Audi: Q2 (₪230,500), A6 e-tron, A8, e-tron GT, S/RS models

## Queue — makes not yet covered (add the make, then its models)
- [x] Nissan: Qashqai, Juke, X-Trail, Micra (2026-10-20)
- [x] Nissan: Leaf, Note, Sentra (2026-10-20, second pass)
- [x] Ford: Focus (wagon on sale), Kuga, Puma, Fiesta (2026-10-20)
- [x] Ford: Explorer, Ranger, Bronco, Mustang (2026-10-20, second pass)
- [ ] Ford: F-Series (₪315,000–360,000), Transit / Transit Custom (commercial, low priority)
- [x] Renault: Clio, Captur, Megane, Arkana, Austral; Dacia: Duster, Sandero (Stepway), Jogger (2026-10-20)
- [x] Renault: 5 E-Tech, Symbioz; Dacia: Bigster, Logan (2026-10-20, second pass)
- [ ] Renault: Megane E-Tech (used), Kangoo / Trafic / Master (commercial); Dacia: Spring (not on list)
- [x] Citroën: C3, C4, C5 Aircross, Berlingo (2026-10-20)
- [x] Citroën: C3 Aircross; DS make: DS 3, DS 4, DS 7 (2026-10-20, second pass)
- [ ] Citroën: Jumpy (commercial, low priority)
- [x] Opel: Corsa, Astra, Mokka, Grandland (2026-10-20)
- [x] Opel: Frontera, Crossland (2026-10-20, second pass)
- [ ] Opel: Combo Life (low priority)
- [x] Honda: Civic, Jazz, HR-V, CR-V (2026-10-20)
- [x] Honda: ZR-V; Civic 8th gen and CR-V 3rd gen (2010–2011) added (2026-10-20, second pass)
- [x] Subaru: Impreza, XV/Crosstrek, Forester, Outback (2026-10-20)
- [x] Subaru: BRZ (2026-10-20, second pass)
- [x] Lexus: UX, NX, RX, ES (2026-10-20)
- [x] Lexus: LBX, RZ (2026-10-20, second pass)
- [ ] Lexus: ES EV (₪379,990–429,990, noted under ES), LM (₪930,990–1,089,990)
- [x] Volvo: XC40/EX40, XC60, XC90, EX30 (2026-10-20)
- [x] Volvo: EX90, ES90 (2026-10-20, second pass)
- [x] Volvo: S60, V60, C40 / EC40 (used; cartube marks them no longer marketed) (2026-10-21)
- [x] Geely brands: Zeekr (X, 7GT, 7X, 001), Lynk & Co (01 EM-P, 02, 08), Geely Starray EM-i (2026-10-20)
- [x] Great Wall: ORA 03 / 05 / 07 (2026-10-20). Haval and Tank are not sold in Israel today (no carzone listing; only a 2014 Haval H6 page)
- [x] Xpeng (P7+, G6, P7, G9), Leapmotor (T03, B10, C10), Polestar 2, Smart (#1, #3, #5), Genesis (GV60, GV70, G80, GV80), Mini (Cooper, Countryman, Aceman), Jeep (Avenger, Compass, Wrangler, Grand Cherokee), Fiat (Grande Panda, Doblò), KGM (Tivoli, Torres, Rexton), Isuzu D-Max, Land Rover (Evoque, Discovery Sport, Defender), Porsche (Macan, Cayenne), Alfa Romeo Junior (2026-10-20)
- [ ] Skywell ET5 (₪166,900–187,900), Dongfeng Box (₪104,900) / Mage PHEV (₪149,900), Voyah Courage (₪175,900–190,900) / Free (₪399,985) / Dream (₪429,985) — researched 2026-10-20, not yet added (run limit)
- [ ] Aiways — not researched
- [ ] Not yet added, seen on price lists 2026-10-20: Xpeng X9 (₪399,990, model page failed); Genesis G90; Mini Cabrio as separate line; Jeep Wrangler 4xe; Fiat Ducato/Scudo/Doblò Cargo (commercial); KGM Musso / Musso EV; Land Rover Range Rover, Discovery; Porsche Panamera, 911, Cayenne Electric; Alfa Romeo Giulia, Stelvio
- [ ] Any other make on carzone.co.il's make list with models on sale
- [x] Porsche Taycan (price null: sources disagree); Land Rover Range Rover Velar, Range Rover Sport (price null: sources disagree) (2026-10-23)

## Queue — seen on importer price lists 2026-10-23, not yet covered
- [ ] Deepal (Changan) S05 — in the catalog since 2026-10-23 (batch 16); add the make to generations.ts
- [ ] Hyundai Elantra N (₪224,900–234,900), Ioniq 5 N (₪409,900); Kia EV6 (cartube 2026 ₪309,900, not on carzone — owner)
- [ ] Genesis G90 (₪849,900–899,900); GV70 Electrified as separate line?
- [ ] Toyota City / ProAce / ProAce Verso (commercial)
- [ ] VW Golf GTI (₪304,900), Taigo, ID.5, ID.7 (cartube only); Cupra Tavascan (cartube only); Skoda Octavia RS (₪249,990) fold?
- [ ] Porsche Cayenne Coupé (₪797,000–1,797,000) fold into Cayenne?; Cayenne EV Coupé
- [ ] Peugeot e-3008 (₪258,990), e-5008 (₪294,990); Alfa Romeo Giulia (₪339,990), Stelvio (₪369,990); Citroën C4 X (₪129,990)
- [ ] MINI Cabrio (₪266,900–321,900); KGM Musso EV (₪239,900–259,900), Musso (₪274,900); XPENG X9 (₪399,990)
- [ ] BMW 2 Coupé, iX1, iX2, 4 Series, X4, X7, 7 Series / i7, Z4, M models; Mercedes GLC Coupé, EQE, EQE SUV, GLS, S-Class, G-Class, SL
- [ ] Leapmotor B10 PHEV (₪154,900–164,900) — fold into B10 (owner)
