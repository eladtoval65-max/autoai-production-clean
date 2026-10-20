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
- [ ] BYD: Sealion 05 DM-i (₪166,990–171,990), Seal 05 DM-i (₪174,990) — on price list, combined hp not confirmed
- [ ] Omoda & Jaecoo: Omoda 7, Omoda 9
- [ ] Chery: Tiggo 9, FX EV
- [x] Suzuki: Baleno (used), SX4 (used), Celerio (used) (2026-10-20)
- [ ] Suzuki Fronx: not on the Suzuki price list 2026-10-20 — skip unless it appears
- [x] Peugeot: Rifter, 308 (used, no longer on price list), 301 (used) (2026-10-20)
- [ ] Peugeot: e-208; 308 T9/P5 engine outputs to fill
- [x] Volkswagen: T-Cross, T-Roc (unverified: not on brand page), ID.3, Passat (used), Jetta (used) (2026-10-20)
- [ ] Volkswagen: ID.Buzz; T-Roc status (model page shows ₪180,000–189,900 but brand page omits it)
- [x] MG: MG3, S5 (2026-10-20)
- [ ] MG: S6, S9, Cyberster; EHS (₪175,888) — decide whether to fold into the HS line
- [x] Mercedes-Benz: GLA (2026-10-20)
- [ ] Mercedes-Benz: CLA (₪319,900–419,900; C118 engine table unreadable), GLB, EQA, EQB, CLE
- [x] BMW: 5 Series, X1 (iX1 noted in X1 line) (2026-10-20)
- [ ] BMW: X2, iX3, 2 Series Gran Coupé
- [x] Audi: Q7 (2026-10-20)
- [ ] Audi: A5 (new), A6 (₪484,000–629,000; C9 not on Wikipedia yet), Q4 e-tron, Q6 e-tron, Q8
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

## Queue — makes not yet covered (add the make, then its models)
- [x] Nissan: Qashqai, Juke, X-Trail, Micra (2026-10-20)
- [ ] Nissan: Leaf (used), Note (used), Sentra (on sale ₪154,990–156,990 per cartube)
- [x] Ford: Focus (wagon on sale), Kuga, Puma, Fiesta (2026-10-20)
- [ ] Ford: Explorer, Ranger, Bronco, Mustang, F-Series (on cartube list; generations not yet researched)
- [x] Renault: Clio, Captur, Megane, Arkana, Austral; Dacia: Duster, Sandero (Stepway), Jogger (2026-10-20)
- [ ] Renault: 5 E-Tech (₪168,999–176,990), Symbioz (₪159,990–166,990), Megane E-Tech (used); Dacia: Bigster (₪167,990–190,990), Logan (₪127,990), Spring (not on list)
- [x] Citroën: C3, C4, C5 Aircross, Berlingo (2026-10-20)
- [ ] Citroën: C3 Aircross (₪129,990–139,990); DS make: DS 3 (₪218,990), DS 7 (₪344,990), DS 4 (used)
- [x] Opel: Corsa, Astra, Mokka, Grandland (2026-10-20)
- [ ] Opel: Frontera (₪144,990–156,990), Crossland (used), Combo Life (low priority)
- [x] Honda: Civic, Jazz, HR-V, CR-V (2026-10-20)
- [ ] Honda: ZR-V (₪209,900–234,900)
- [x] Subaru: Impreza, XV/Crosstrek, Forester, Outback (2026-10-20)
- [ ] Subaru: BRZ (₪229,900–249,900)
- [x] Lexus: UX, NX, RX, ES (2026-10-20)
- [ ] Lexus: LBX (₪205,990–246,990), RZ (₪299,990–439,990), ES EV (₪379,990–429,990), LM
- [x] Volvo: XC40/EX40, XC60, XC90, EX30 (2026-10-20)
- [ ] Volvo: EX90 (₪739,900–754,900), ES90 (₪399,900–539,900), S60/V60 (used)
- [ ] Geely brands: Zeekr, Lynk & Co, Geely Starray
- [ ] Great Wall: ORA, Haval, Tank
- [ ] Xpeng, Leapmotor, Polestar, Smart, Genesis, Mini, Fiat, Jeep, Alfa Romeo, Porsche, Land Rover, Skywell, Dongfeng/Voyah, Aiways, KGM (SsangYong), Isuzu
- [ ] Any other make on carzone.co.il's make list with models on sale
