/**
 * CamaOla — model generations 2010+ (make → model → generation) for new AND used buyers.
 *
 * What is in here, and how sure we are:
 *  - Generation codes and years, engines, power: general automotive knowledge (stable history).
 *  - Euro NCAP stars: only where we are confident of the published result; otherwise null ("not known").
 *  - Consumption: typical real-world average (L/100 km, or kWh/100 km for EVs) — an ESTIMATE, not the claimed figure.
 *  - "Things to check": widely reported issues and inspection points — guidance for a pre-purchase check, not a diagnosis.
 *  - Current list price: from the Israeli importers' price lists as shown on carzone.co.il brand pages or cartube.co.il price lists (last re-checked on the PRICES_VERIFIED date below).
 *  - Used prices are NOT included: there is no free official source (Levi Yitzhak is paid; Yad2 listings are asking prices).
 *    The site instead links to live Yad2 searches and computes monthly cost from the price the user is offered.
 */
/** Date the current list prices were last checked against the importers' price lists (updated by the daily market agent). */
export const PRICES_VERIFIED = "2026-10-24";

export type Powertrain = "petrol" | "diesel" | "hybrid" | "phev" | "ev";
export type Generation = {
  code: string;            // e.g. "E210"
  from: number; to: number | null;  // model years; null = still current
  engines: string;         // engines/batteries common in Israel
  hp: string;
  pt: Powertrain[];
  cons: number;            // typical real-world L/100km (or kWh/100km if pt is only "ev")
  ncap: number | null; ncapYear?: number;
  checks: string[];
  note?: string;
};
export type ModelLine = {
  id: string; make: string; model: string; he: string; body: "city" | "hatch" | "sedan" | "suv" | "suv7" | "wagon" | "pickup" | "mpv";
  segment: "mass" | "premium";
  /** Current Israeli list price range, or null when not sold new / not verified. */
  price: [number, number] | null;
  status: "on_sale" | "discontinued" | "not_sold_new" | "unverified";
  gens: Generation[];
};
export type Make = { id: string; name: string; he: string; models: ModelLine[] };

// ── Shared inspection points ───────────────────────────────────────────────────
const C = {
  history: "היסטוריית טיפולים מלאה במוסך מורשה",
  inspect: "בדיקה במכון לפני קנייה (שלדה, תאונות, צבע)",
  recalls: "בדיקת קריאות שירות פתוחות אצל היבואן לפי מספר שלדה",
  toyHybrid: "בדיקת מצב סוללת ההיברידי במוסך טויוטה (דו\"ח תקינות)",
  hyHybrid: "בדיקת סוללת ההיברידי ומערכת הקירור שלה",
  ev: "דו\"ח בריאות סוללה (SoH) וטעינה מהירה לבדיקה",
  phev: "בדיקת בריאות הסוללה וטווח חשמלי אמיתי",
  dsgDry: "תיבת DSG 7 יבשה (DQ200): לבדוק רעידות/גמגום בזחילה ובהתחלת נסיעה",
  dct: "תיבה רובוטית כפולת מצמד: לבדוק רעידות בזחילה ועדכוני תוכנה",
  cvt: "תיבת CVT: לבדוק החלפת שמן תיבה ונסיעה חלקה בלי רעידות",
  tsiChain: "מנועי TSI 1.2/1.4 ישנים (EA111): רעש שרשרת תזמון בהנעה קרה",
  ea888: "מנוע 1.8/2.0 TFSI דור 2 (2008–2012): צריכת שמן מוגברת, בדוק רישום הוספות שמן",
  puretech: "מנוע 1.2 PureTech: רצועת תזמון טבולה בשמן נשחקת. לוודא החלפה/עדכון לפי היבואן וצריכת שמן",
  theta: "מנועי 2.0/2.4 GDI ישנים: צריכת שמן ורעש מנוע, לבדוק קריאות שירות",
  bmwChain: "מנועי 2.0 טורבו 2012–2015 (N20): רעש שרשרת תזמון; נזילות שמן מכסה שסתומים",
  mbChain: "מנועי 1.6/1.8 טורבו ישנים: רעש שרשרת תזמון בהנעה קרה",
  airSusp: "מתלי אוויר: לבדוק שהרכב לא שוקע בעמידה",
  newBrand: "מותג חדש בישראל: לבדוק זמינות חלפים ושירות באזור שלך",
  suspension: "בלאי מתלים ובולמים (בדיקה על מתקן)",
};

const T = (code: string, from: number, to: number | null, engines: string, hp: string, pt: Powertrain[], cons: number, ncap: number | null, ncapYear: number | undefined, checks: string[], note?: string): Generation =>
  ({ code, from, to, engines, hp, pt, cons, ncap, ncapYear, checks, note });

export const MAKES: Make[] = [
  { id: "toyota", name: "Toyota", he: "טויוטה", models: [
    { id: "corolla", make: "toyota", model: "Corolla", he: "קורולה", body: "sedan", segment: "mass", price: [159900, 159900], status: "on_sale", gens: [
      T("E150", 2010, 2013, "1.6 בנזין, אוטומטית 4", "124–132", ["petrol"], 7.6, null, undefined, [C.history, C.inspect, "תיבה אוטומטית ישנה: לבדוק החלפות הילוך חלקות"]),
      T("E170", 2013, 2019, "1.6 בנזין, CVT", "132", ["petrol"], 7.3, 5, 2013, [C.history, C.inspect, C.cvt]),
      T("E210", 2019, null, "1.8 היברידי", "122–140", ["hybrid"], 5.3, 5, 2019, [C.toyHybrid, C.history, C.recalls]),
    ]},
    { id: "yaris", make: "toyota", model: "Yaris", he: "יאריס", body: "city", segment: "mass", price: [140990, 143990], status: "on_sale", gens: [
      T("XP130", 2011, 2020, "1.33 בנזין / 1.5 היברידי", "99–100", ["petrol", "hybrid"], 6.0, 5, 2011, [C.history, C.inspect, "בגרסת ההיברידי: " + C.toyHybrid]),
      T("XP210", 2020, null, "1.5 היברידי", "116–130", ["hybrid"], 4.4, 5, 2020, [C.toyHybrid, C.history]),
    ]},
    { id: "yaris-cross", make: "toyota", model: "Yaris Cross", he: "יאריס קרוס", body: "suv", segment: "mass", price: [159990, 160990], status: "on_sale", gens: [
      T("XP210 Cross", 2021, null, "1.5 היברידי", "116–130", ["hybrid"], 5.2, 4, 2021, [C.toyHybrid, C.history]),
    ]},
    { id: "rav4", make: "toyota", model: "RAV4", he: "RAV4", body: "suv", segment: "mass", price: [219990, 299990], status: "on_sale", gens: [
      T("XA30", 2010, 2012, "2.0 בנזין", "158", ["petrol"], 9.8, null, undefined, [C.history, C.inspect, "צריכת שמן במנועי 2.0/2.4 ישנים"]),
      T("XA40", 2013, 2018, "2.0 בנזין / 2.5 היברידי (מ-2016)", "152–197", ["petrol", "hybrid"], 7.8, 5, 2013, [C.history, C.inspect, "בגרסת ההיברידי: " + C.toyHybrid]),
      T("XA50", 2019, 2025, "2.5 היברידי / פלאג-אין", "218–306", ["hybrid", "phev"], 5.9, 5, 2019, [C.toyHybrid, C.history, C.recalls]),
      T("XA60", 2026, null, "היברידי / פלאג-אין (דור 6)", "—", ["hybrid", "phev"], 5.6, null, undefined, [C.recalls], "דור חדש, הושק בישראל ב-2026"),
    ]},
    { id: "c-hr", make: "toyota", model: "C-HR", he: "C-HR", body: "suv", segment: "mass", price: null, status: "unverified", gens: [
      T("AX10", 2017, 2023, "1.8 היברידי", "122", ["hybrid"], 5.4, 5, 2017, [C.toyHybrid, C.history, "ראות אחורית מוגבלת: לבדוק מצלמה וחיישנים"]),
      T("AX20", 2024, null, "1.8/2.0 היברידי, פלאג-אין", "140–223", ["hybrid", "phev"], 5.2, null, undefined, [C.toyHybrid, C.recalls], "במחירון הנוכחי מופיע C-HR+ החשמלי (₪179,990–229,990), דגם אחר"),
    ]},
    { id: "aygo-x", make: "toyota", model: "Aygo X", he: "אייגו X", body: "city", segment: "mass", price: [123990, 129990], status: "on_sale", gens: [
      T("AB70", 2022, null, "1.0 בנזין / 1.5 היברידי (מ-2026)", "72–116", ["petrol", "hybrid"], 4.8, null, undefined, [C.history, "בגרסת ההיברידי: " + C.toyHybrid], "4 מושבים"),
    ]},
    { id: "corolla-cross", make: "toyota", model: "Corolla Cross", he: "קורולה קרוס", body: "suv", segment: "mass", price: [179990, 192990], status: "on_sale", gens: [
      T("XG10", 2022, null, "1.8 היברידי", "122–140", ["hybrid"], 5.7, null, undefined, [C.toyHybrid, C.history, C.recalls]),
    ]},
    { id: "c-hr-plus", make: "toyota", model: "C-HR+", he: "C-HR+", body: "suv", segment: "mass", price: [179990, 229990], status: "on_sale", gens: [
      T("Gen1", 2026, null, "חשמלי, הנעה קדמית או 4X4", "167–343", ["ev"], 16.5, null, undefined, [C.ev, C.recalls], "דגם חשמלי נפרד מה-C-HR ההיברידי"),
    ]},
    { id: "camry", make: "toyota", model: "Camry", he: "קאמרי", body: "sedan", segment: "mass", price: [214990, 229990], status: "on_sale", gens: [
      T("XV40", 2010, 2011, "2.4 בנזין", "167", ["petrol"], 9.5, null, undefined, [C.history, C.inspect, "צריכת שמן במנועי 2.0/2.4 ישנים"]),
      T("XV50", 2012, 2017, "2.5 בנזין / 2.5 היברידי", "181–205", ["petrol", "hybrid"], 7.5, null, undefined, [C.history, C.inspect, "בגרסת ההיברידי: " + C.toyHybrid]),
      T("XV70", 2018, 2024, "2.5 היברידי", "218", ["hybrid"], 5.4, null, undefined, [C.toyHybrid, C.history, C.recalls]),
      T("XV80", 2025, null, "2.5 היברידי", "230", ["hybrid"], 5.3, null, undefined, [C.toyHybrid, C.recalls]),
    ]},
    { id: "land-cruiser", make: "toyota", model: "Land Cruiser", he: "לנד קרוזר", body: "suv7", segment: "premium", price: [414990, 527990], status: "on_sale", gens: [
      T("J150 (Prado)", 2010, 2023, "3.0 / 2.8 טורבו דיזל", "173–204", ["diesel"], 10.5, null, undefined, [C.history, C.inspect, "שימוש בשטח: לבדוק תחתית, מתלים ומערכת 4X4"]),
      T("J250", 2024, null, "2.8 טורבו דיזל מיילד-היברידי / 2.4 טורבו היברידי", "204–326", ["diesel", "hybrid"], 10.4, null, undefined, [C.history, C.recalls, "שימוש בשטח: לבדוק תחתית, מתלים ומערכת 4X4"]),
    ]},
    { id: "hilux", make: "toyota", model: "Hilux", he: "היילקס", body: "pickup", segment: "mass", price: [309990, 359990], status: "on_sale", gens: [
      T("AN10/AN20 (דור 7)", 2010, 2015, "2.5 / 3.0 טורבו דיזל", "144–171", ["diesel"], 10.0, null, undefined, [C.history, C.inspect, "רכב עבודה: לבדוק בלאי ארגז, וו גרירה ותחתית"]),
      T("AN120/AN130 (דור 8)", 2016, null, "2.4 / 2.8 טורבו דיזל", "150–204", ["diesel"], 9.9, null, undefined, [C.history, C.inspect, C.recalls, "רכב עבודה: לבדוק בלאי ארגז, וו גרירה ותחתית"]),
    ]},
    { id: "prius", make: "toyota", model: "Prius", he: "פריוס", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("XW30", 2010, 2015, "1.8 היברידי (פלאג-אין מ-2012)", "134", ["hybrid", "phev"], 4.6, 5, 2009, [C.toyHybrid, C.history, C.recalls, "קריאות שירות 2014/2018 לתוכנת מערכת ההיברידי (אינוורטר): לוודא שבוצעו"]),
      T("XW50", 2016, 2022, "1.8 היברידי / פלאג-אין", "—", ["hybrid", "phev"], 4.2, null, undefined, [C.toyHybrid, C.history]),
      T("XW60", 2022, null, "2.0 היברידי / פלאג-אין", "138–220", ["hybrid", "phev"], 4.4, null, undefined, [C.toyHybrid, C.recalls], "לא במחירון היבואן הנוכחי"),
    ]},
  ]},

  { id: "hyundai", name: "Hyundai", he: "יונדאי", models: [
    { id: "tucson", make: "hyundai", model: "Tucson", he: "טוסון", body: "suv", segment: "mass", price: [189990, 229990], status: "on_sale", gens: [
      T("ix35 (LM)", 2010, 2015, "2.0 בנזין", "163", ["petrol"], 9.6, 5, 2010, [C.history, C.inspect, C.theta]),
      T("TL", 2016, 2020, "1.6 GDI / 2.0 / 1.6 טורבו", "132–177", ["petrol"], 8.6, 5, 2015, [C.history, C.inspect, "בגרסת 1.6 טורבו: " + C.dct]),
      T("NX4", 2021, null, "2.0 / 1.6 טורבו היברידי", "156–230", ["petrol", "hybrid"], 7.0, 5, 2021, [C.hyHybrid, C.history, C.recalls]),
    ]},
    { id: "elantra", make: "hyundai", model: "Elantra", he: "אלנטרה", body: "sedan", segment: "mass", price: [169990, 188990], status: "on_sale", gens: [
      T("MD", 2011, 2015, "1.6 / 1.8 בנזין", "132–150", ["petrol"], 7.8, null, undefined, [C.history, C.inspect]),
      T("AD", 2016, 2020, "1.6 / 2.0 בנזין", "128–152", ["petrol"], 7.6, null, undefined, [C.history, C.inspect]),
      T("CN7", 2021, null, "1.6 בנזין / 1.6 היברידי", "123–139", ["petrol", "hybrid"], 5.6, null, undefined, [C.hyHybrid, C.history]),
    ]},
    { id: "ioniq-5", make: "hyundai", model: "Ioniq 5", he: "איוניק 5", body: "suv", segment: "mass", price: [214990, 247990], status: "on_sale", gens: [
      T("NE", 2021, null, "סוללה 58/77/84 קוט\"ש", "170–325", ["ev"], 18.5, 5, 2021, [C.ev, C.history, "יחידת טעינה (ICCU): לבדוק שעודכנה לפי קריאת השירות"]),
    ]},
    { id: "i10", make: "hyundai", model: "i10", he: "i10", body: "city", segment: "mass", price: null, status: "discontinued", gens: [
      T("PA", 2010, 2013, "1.1 / 1.2 בנזין", "69–86", ["petrol"], 6.4, null, undefined, [C.history, C.inspect]),
      T("IA", 2014, 2019, "1.0 / 1.25 בנזין", "66–87", ["petrol"], 6.0, 4, 2014, [C.history, C.inspect]),
      T("AC3", 2020, 2024, "1.0 / 1.2 בנזין", "67–84", ["petrol"], 5.9, 3, 2020, [C.history]),
    ]},
    { id: "i20", make: "hyundai", model: "i20", he: "i20", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("PB", 2010, 2014, "1.25 / 1.4 בנזין", "78–100", ["petrol"], 6.9, 5, 2009, [C.history, C.inspect]),
      T("GB", 2015, 2020, "1.4 בנזין / 1.0 טורבו", "100", ["petrol"], 6.9, 4, 2015, [C.history, C.inspect]),
      T("BC3", 2021, null, "1.0 טורבו", "100", ["petrol"], 6.8, 4, 2021, [C.history, C.dct]),
    ]},
    { id: "venue", make: "hyundai", model: "Venue", he: "וניו", body: "suv", segment: "mass", price: [129900, 144990], status: "on_sale", gens: [
      T("QX", 2020, null, "1.6 בנזין, CVT", "121–123", ["petrol"], 7.7, null, undefined, [C.history, C.cvt]),
    ]},
    { id: "kona", make: "hyundai", model: "Kona", he: "קונה", body: "suv", segment: "mass", price: [176990, 207990], status: "on_sale", gens: [
      T("OS", 2017, 2023, "2.0 בנזין / 1.6 טורבו / 1.6 היברידי", "118–198", ["petrol", "hybrid"], 6.8, null, undefined, [C.history, C.inspect, "בגרסת 1.6 טורבו: " + C.dct, "בגרסת ההיברידי: " + C.hyHybrid]),
      T("SX2", 2023, null, "1.6 היברידי / 2.0 בנזין / 1.6 טורבו", "118–195", ["petrol", "hybrid"], 5.8, 4, 2023, [C.hyHybrid, C.history, C.recalls]),
    ]},
    { id: "kona-electric", make: "hyundai", model: "Kona Electric", he: "קונה חשמלית", body: "suv", segment: "mass", price: [174990, 184990], status: "on_sale", gens: [
      T("OS EV", 2018, 2023, "סוללה 39.2/64 קוט\"ש", "134–201", ["ev"], 15.5, null, undefined, [C.ev, C.history, C.recalls]),
      T("SX2 EV", 2023, null, "סוללה 48.4/65.4 קוט\"ש", "133–215", ["ev"], 15.8, 4, 2023, [C.ev, C.recalls]),
    ]},
    { id: "ioniq-6", make: "hyundai", model: "Ioniq 6", he: "איוניק 6", body: "sedan", segment: "mass", price: [224990, 247990], status: "on_sale", gens: [
      T("CE", 2022, null, "סוללה 53/77.4 קוט\"ש", "149–321", ["ev"], 16.0, 5, 2022, [C.ev, C.history, C.recalls]),
    ]},
    { id: "santa-fe", make: "hyundai", model: "Santa Fe", he: "סנטה פה", body: "suv7", segment: "mass", price: [329990, 359990], status: "on_sale", gens: [
      T("CM (מתיחת פנים)", 2010, 2012, "2.4 בנזין / 2.2 טורבו דיזל", "194 (דיזל)", ["petrol", "diesel"], 10.0, null, undefined, [C.history, C.inspect, C.theta]),
      T("DM", 2012, 2018, "2.4 GDI בנזין / 2.2 טורבו דיזל", "148–290", ["petrol", "diesel"], 9.5, null, undefined, [C.history, C.inspect, C.theta]),
      T("TM", 2018, 2023, "2.4 בנזין / 2.2 דיזל / 1.6 טורבו היברידי ופלאג-אין", "170–277", ["petrol", "diesel", "hybrid", "phev"], 8.3, null, undefined, [C.history, C.inspect, "בגרסת ההיברידי: " + C.hyHybrid]),
      T("MX5", 2023, null, "1.6 טורבו היברידי / פלאג-אין", "191–277", ["petrol", "hybrid", "phev"], 7.4, 4, 2024, [C.hyHybrid, C.recalls], "7 מושבים"),
    ]},
    { id: "sonata", make: "hyundai", model: "Sonata", he: "סונטה", body: "sedan", segment: "mass", price: [219990, 234990], status: "on_sale", gens: [
      T("YF", 2010, 2014, "2.0 / 2.4 בנזין / 2.4 היברידי", "163–274", ["petrol", "hybrid"], 8.8, null, undefined, [C.history, C.inspect, C.theta]),
      T("LF", 2014, 2019, "2.0 / 2.4 בנזין / 2.0 היברידי", "139–242", ["petrol", "hybrid", "phev"], 7.9, null, undefined, [C.history, C.inspect, "בגרסת ההיברידי: " + C.hyHybrid]),
      T("DN8", 2019, null, "2.0 היברידי / 2.5 בנזין", "144–286", ["petrol", "hybrid", "phev"], 6.0, null, undefined, [C.hyHybrid, C.history, C.recalls]),
    ]},
    { id: "i30", make: "hyundai", model: "i30", he: "i30", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("GD", 2011, 2016, "1.4 / 1.6 בנזין, 1.6 CRDi דיזל", "89–183", ["petrol", "diesel"], 7.4, null, undefined, [C.history, C.inspect]),
      T("PD", 2016, null, "1.0 / 1.4 / 1.5 טורבו, 1.6 דיזל, מיילד-היברידי", "94–276", ["petrol", "diesel"], 6.8, null, undefined, [C.history, C.inspect, C.dct], "לא במחירון היבואן הנוכחי"),
    ]},
    { id: "palisade", make: "hyundai", model: "Palisade", he: "פאליסייד", body: "suv7", segment: "mass", price: [349990, 389990], status: "on_sale", gens: [
      T("LX2", 2018, 2024, "3.5 / 3.8 V6 בנזין, 2.2 דיזל", "190–291", ["petrol", "diesel"], 11.5, null, undefined, [C.history, C.inspect]),
      T("LX3", 2025, null, "2.5 טורבו היברידי / 3.5 V6", "277–329", ["petrol", "hybrid"], 8.5, null, undefined, [C.hyHybrid, C.recalls], "7–8 מושבים"),
    ]},
    { id: "ioniq-9", make: "hyundai", model: "Ioniq 9", he: "איוניק 9", body: "suv7", segment: "mass", price: [354990, 409990], status: "on_sale", gens: [
      T("ME1", 2025, null, "סוללה 110.3 קוט\"ש, הנעה אחורית או 4X4", "215–429", ["ev"], 21.0, 5, 2025, [C.ev, C.recalls], "6–7 מושבים"),
    ]},
  ]},

  { id: "kia", name: "Kia", he: "קיה", models: [
    { id: "sportage", make: "kia", model: "Sportage", he: "ספורטאז'", body: "suv", segment: "mass", price: [184900, 219900], status: "on_sale", gens: [
      T("SL", 2010, 2015, "2.0 בנזין", "163–166", ["petrol"], 9.6, 5, 2010, [C.history, C.inspect, C.theta]),
      T("QL", 2016, 2021, "1.6 GDI / 2.0 / 1.6 טורבו", "132–177", ["petrol"], 8.6, 5, 2015, [C.history, C.inspect, "בגרסת 1.6 טורבו: " + C.dct]),
      T("NQ5", 2022, null, "1.6 טורבו / 1.6 טורבו היברידי", "150–230", ["petrol", "hybrid"], 7.0, 5, 2022, [C.hyHybrid, C.history, C.recalls]),
    ]},
    { id: "picanto", make: "kia", model: "Picanto", he: "פיקנטו", body: "city", segment: "mass", price: [99900, 99990], status: "on_sale", gens: [
      T("TA", 2011, 2017, "1.0 / 1.25 בנזין", "69–85", ["petrol"], 6.0, 4, 2011, [C.history, C.inspect]),
      T("JA", 2017, null, "1.0 / 1.2 בנזין", "67–84", ["petrol"], 5.8, 3, 2017, [C.history], "דירוג 3 כוכבים בבסיס (4 עם חבילת בטיחות)"),
    ]},
    { id: "niro", make: "kia", model: "Niro", he: "נירו", body: "suv", segment: "mass", price: [176900, 179900], status: "on_sale", gens: [
      T("DE", 2017, 2022, "1.6 היברידי / פלאג-אין / חשמלי 64 קוט\"ש", "141–204", ["hybrid", "phev", "ev"], 5.0, 4, 2016, [C.hyHybrid, C.history, "בגרסה החשמלית: " + C.ev]),
      T("SG2", 2022, null, "1.6 היברידי / חשמלי", "141–204", ["hybrid", "ev"], 4.8, 4, 2022, [C.hyHybrid, C.history], "4 כוכבים בתצורה בסיסית, 5 כוכבים עם חבילת בטיחות"),
    ]},
    { id: "ev6", make: "kia", model: "EV6", he: "EV6", body: "suv", segment: "mass", price: null, status: "unverified", gens: [
      T("CV", 2022, null, "סוללה 58/77/84 קוט\"ש", "170–325", ["ev"], 18.0, 5, 2021, [C.ev, "יחידת טעינה (ICCU): לבדוק עדכון לפי קריאת השירות"], "לא מופיע במחירון קיה הנוכחי בישראל"),
    ]},
    { id: "seltos", make: "kia", model: "Seltos", he: "סלטוס", body: "suv", segment: "mass", price: [164900, 167990], status: "on_sale", gens: [
      T("SP2", 2020, null, "1.6 בנזין / 1.6 טורבו", "123–177", ["petrol"], 7.8, null, undefined, [C.history, C.inspect]),
    ]},
    { id: "stonic", make: "kia", model: "Stonic", he: "סטוניק", body: "suv", segment: "mass", price: [129900, 137900], status: "on_sale", gens: [
      T("YB", 2018, null, "1.0 טורבו, רובוטית כפולת מצמד", "100–120", ["petrol"], 7.1, null, undefined, [C.history, C.dct]),
    ]},
    { id: "ev3", make: "kia", model: "EV3", he: "EV3", body: "suv", segment: "mass", price: [169900, 186900], status: "on_sale", gens: [
      T("SV", 2024, null, "סוללה 58.3/81.4 קוט\"ש", "201–308", ["ev"], 16.0, 4, 2025, [C.ev, C.recalls]),
    ]},
    { id: "sorento", make: "kia", model: "Sorento", he: "סורנטו", body: "suv7", segment: "mass", price: [319900, 319900], status: "on_sale", gens: [
      T("XM", 2010, 2014, "2.4 בנזין / 2.2 טורבו דיזל", "175–276", ["petrol", "diesel"], 10.0, null, undefined, [C.history, C.inspect, C.theta]),
      T("דור 3", 2014, 2020, "2.4 GDI בנזין / 2.2 CRDi דיזל", "190–290", ["petrol", "diesel"], 9.4, null, undefined, [C.history, C.inspect, C.theta]),
      T("MQ4", 2020, null, "1.6 טורבו היברידי / פלאג-אין, 2.2 דיזל", "178–281", ["petrol", "diesel", "hybrid", "phev"], 7.8, 5, 2020, [C.hyHybrid, C.history, C.recalls], "6–7 מושבים"),
    ]},
    { id: "carnival", make: "kia", model: "Carnival", he: "קרניבל", body: "mpv", segment: "mass", price: [298900, 349900], status: "on_sale", gens: [
      T("VQ (מתיחת פנים)", 2010, 2014, "2.2 CRDi דיזל / 3.5 V6", "189", ["petrol", "diesel"], 10.5, null, undefined, [C.history, C.inspect]),
      T("KA4", 2020, null, "1.6 טורבו היברידי (מ-2023) / 3.5 V6 / 2.2 דיזל", "199–290", ["petrol", "diesel", "hybrid"], 9.0, null, undefined, [C.history, C.recalls, "בגרסת ההיברידי: " + C.hyHybrid], "דור YP (2014–2020) עוד לא נבדק"),
    ]},
    { id: "ev9", make: "kia", model: "EV9", he: "EV9", body: "suv7", segment: "mass", price: [399000, 489000], status: "on_sale", gens: [
      T("MV", 2023, null, "סוללה 76.1/99.8 קוט\"ש", "201–380", ["ev"], 22.0, null, undefined, [C.ev, C.recalls], "6–7 מושבים"),
    ]},
    { id: "ceed", make: "kia", model: "Ceed", he: "סיד", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("JD", 2012, 2018, "בנזין / דיזל", "—", ["petrol", "diesel"], 7.2, null, undefined, [C.history, C.inspect]),
      T("CD", 2018, 2026, "1.0 / 1.4 / 1.5 טורבו, 1.6 בנזין, 1.6 דיזל", "—", ["petrol", "diesel"], 6.8, 4, 2019, [C.history, C.inspect, C.dct], "כולל סטיישן ו-ProCeed; הוחלף ב-K4"),
    ]},
    { id: "rio", make: "kia", model: "Rio", he: "ריו", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("UB", 2011, 2017, "1.25 / 1.4 בנזין, 1.1/1.4 דיזל", "—", ["petrol", "diesel"], 6.6, null, undefined, [C.history, C.inspect]),
      T("YB", 2017, 2023, "1.0 טורבו / 1.6 בנזין", "120–130", ["petrol"], 6.5, 3, 2017, [C.history, C.inspect]),
    ]},
  ]},

  { id: "mazda", name: "Mazda", he: "מאזדה", models: [
    { id: "mazda3", make: "mazda", model: "Mazda3", he: "מאזדה 3", body: "hatch", segment: "mass", price: [169900, 214900], status: "on_sale", gens: [
      T("BL", 2010, 2013, "1.6 / 2.0 בנזין", "105–150", ["petrol"], 8.2, 5, 2009, [C.history, C.inspect, "חלודה בקשתות ובתחתית בדגמים ישנים"]),
      T("BM", 2014, 2018, "1.5 / 2.0 בנזין", "120–165", ["petrol"], 7.0, null, undefined, [C.history, C.inspect]),
      T("BP", 2019, null, "2.0 / 2.5 בנזין", "122–191", ["petrol"], 7.4, 5, 2019, [C.history]),
    ]},
    { id: "cx-5", make: "mazda", model: "CX-5", he: "CX-5", body: "suv", segment: "mass", price: [189900, 219900], status: "on_sale", gens: [
      T("KE", 2012, 2016, "2.0 / 2.5 בנזין", "155–192", ["petrol"], 8.6, 5, 2012, [C.history, C.inspect]),
      T("KF", 2017, 2025, "2.0 / 2.5 בנזין", "165–194", ["petrol"], 8.4, 5, 2017, [C.history]),
      T("KG", 2026, null, "2.5 בנזין (דור 3)", "—", ["petrol"], 8.2, null, undefined, [C.recalls], "דור חדש"),
    ]},
    { id: "cx-30", make: "mazda", model: "CX-30", he: "CX-30", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("DM", 2019, 2025, "2.0 בנזין", "122–150", ["petrol"], 7.3, 5, 2019, [C.history]),
    ]},
    { id: "mazda2", make: "mazda", model: "Mazda2", he: "מאזדה 2", body: "city", segment: "mass", price: null, status: "discontinued", gens: [
      T("DE", 2010, 2014, "1.3 / 1.5 בנזין", "75–103", ["petrol"], 6.8, 5, 2007, [C.history, C.inspect]),
      T("DJ", 2015, 2024, "1.5 בנזין", "90–115", ["petrol"], 6.2, 4, 2014, [C.history]),
    ]},
    { id: "cx-60", make: "mazda", model: "CX-60", he: "CX-60", body: "suv", segment: "premium", price: null, status: "unverified", gens: [
      T("KH", 2022, null, "2.5 פלאג-אין / 3.3 דיזל", "254–327", ["phev", "diesel"], 7.0, 5, 2022, [C.phev, C.recalls], "לא מופיע במחירון מאזדה הנוכחי בישראל"),
    ]},
    { id: "mazda6", make: "mazda", model: "Mazda6", he: "מאזדה 6", body: "sedan", segment: "mass", price: null, status: "discontinued", gens: [
      T("GJ/GL", 2012, 2024, "2.0 / 2.5 Skyactiv-G בנזין, 2.2 דיזל", "148–255", ["petrol", "diesel"], 7.6, null, undefined, [C.history, C.inspect, C.recalls], "דור GH (עד 2012) עוד לא נבדק"),
    ]},
    { id: "cx-3", make: "mazda", model: "CX-3", he: "CX-3", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("DK", 2015, 2021, "1.5 / 2.0 Skyactiv-G בנזין, 1.5/1.8 דיזל", "103–148", ["petrol", "diesel"], 7.2, null, undefined, [C.history, C.inspect]),
    ]},
    { id: "cx-90", make: "mazda", model: "CX-90", he: "CX-90", body: "suv7", segment: "premium", price: [254900, 329900], status: "on_sale", gens: [
      T("KK", 2023, null, "3.3 טורבו 6 צילינדרים מיילד-היברידי / 2.5 פלאג-אין", "251–340", ["petrol", "phev"], 9.5, null, undefined, [C.recalls, C.history], "7 מושבים"),
    ]},
  ]},

  { id: "skoda", name: "Skoda", he: "סקודה", models: [
    { id: "octavia", make: "skoda", model: "Octavia", he: "אוקטביה", body: "sedan", segment: "mass", price: [159990, 180990], status: "on_sale", gens: [
      T("Mk2 (1Z)", 2010, 2012, "1.4/1.8 TSI, 1.6", "102–160", ["petrol"], 8.0, 5, 2004, [C.history, C.inspect, C.tsiChain, C.dsgDry]),
      T("Mk3 (5E)", 2013, 2019, "1.2/1.4/1.8 TSI, 1.0 TSI", "105–180", ["petrol"], 6.8, 5, 2013, [C.history, C.inspect, C.dsgDry]),
      T("Mk4 (NX)", 2020, null, "1.0/1.5 TSI", "110–150", ["petrol"], 6.3, 5, 2019, [C.history, C.dsgDry]),
    ]},
    { id: "kodiaq", make: "skoda", model: "Kodiaq", he: "קודיאק", body: "suv7", segment: "mass", price: [211990, 299990], status: "on_sale", gens: [
      T("NS7", 2017, 2023, "1.4/1.5/2.0 TSI", "150–190", ["petrol"], 8.2, 5, 2017, [C.history, C.inspect]),
      T("PS", 2024, null, "1.5 TSI / 2.0 TSI", "150–204", ["petrol"], 7.2, 5, 2024, [C.history]),
    ]},
    { id: "karoq", make: "skoda", model: "Karoq", he: "קארוק", body: "suv", segment: "mass", price: [169490, 202990], status: "on_sale", gens: [
      T("NU", 2018, null, "1.0/1.5 TSI", "115–150", ["petrol"], 7.0, 5, 2017, [C.history, C.dsgDry]),
    ]},
    { id: "kamiq", make: "skoda", model: "Kamiq", he: "קאמיק", body: "suv", segment: "mass", price: [139990, 154990], status: "on_sale", gens: [
      T("NW4", 2020, null, "1.0/1.5 TSI", "110–150", ["petrol"], 6.5, 5, 2019, [C.history, C.dsgDry]),
    ]},
    { id: "superb", make: "skoda", model: "Superb", he: "סופרב", body: "sedan", segment: "mass", price: [203490, 293490], status: "on_sale", gens: [
      T("B6 (3T)", 2010, 2015, "1.4/1.8 TSI", "125–160", ["petrol"], 8.6, 5, 2009, [C.history, C.inspect, C.tsiChain]),
      T("B8 (3V)", 2016, 2023, "1.4/1.8/2.0 TSI, פלאג-אין", "150–280", ["petrol", "phev"], 7.6, 5, 2015, [C.history, C.inspect]),
      T("B9", 2024, null, "1.5 TSI / פלאג-אין", "150–204", ["petrol", "phev"], 6.8, 5, 2024, [C.history]),
    ]},
    { id: "fabia", make: "skoda", model: "Fabia", he: "פאביה", body: "hatch", segment: "mass", price: [120990, 135990], status: "on_sale", gens: [
      T("5J (מתיחת פנים)", 2010, 2014, "1.2 / 1.4 / 1.6 בנזין, 1.2/1.4 TSI, דיזל TDI", "60–180", ["petrol", "diesel"], 7.0, null, undefined, [C.history, C.inspect, C.tsiChain]),
      T("NJ", 2014, 2022, "1.0 / 1.2 TSI בנזין, 1.4 TDI דיזל", "60–110", ["petrol", "diesel"], 6.4, null, undefined, [C.history, C.inspect, C.dsgDry]),
      T("דור 4", 2021, null, "1.0 / 1.5 TSI בנזין, DSG 7", "65–150", ["petrol"], 7.0, 5, 2021, [C.history, C.dsgDry]),
    ]},
    { id: "scala", make: "skoda", model: "Scala", he: "סקאלה", body: "hatch", segment: "mass", price: [138490, 138490], status: "on_sale", gens: [
      T("Scala", 2019, null, "1.0 / 1.5 TSI בנזין", "90–150", ["petrol"], 6.8, 5, 2019, [C.history, C.dsgDry]),
    ]},
    { id: "elroq", make: "skoda", model: "Elroq", he: "אלרוק", body: "suv", segment: "mass", price: [182990, 197990], status: "on_sale", gens: [
      T("MEB", 2025, null, "חשמלי, סוללה 52–77 קוט\"ש", "170–340", ["ev"], 16.5, 5, 2025, [C.ev, C.recalls]),
    ]},
    { id: "enyaq", make: "skoda", model: "Enyaq", he: "אניאק", body: "suv", segment: "mass", price: [206490, 279990], status: "on_sale", gens: [
      T("MEB", 2020, null, "חשמלי, סוללה 52/58/77 קוט\"ש (כולל קופה)", "148–340", ["ev"], 18.0, 5, 2021, [C.ev, C.history, C.recalls], "אניאק ₪206,490–229,990; אניאק קופה ₪243,990–279,990"),
    ]},
    { id: "rapid", make: "skoda", model: "Rapid", he: "ראפיד", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("NH", 2012, 2019, "1.2 / 1.4 TSI, 1.0 TSI (מ-2017), 1.4/1.6 TDI דיזל", "75–125", ["petrol", "diesel"], 6.9, null, undefined, [C.history, C.inspect, C.dsgDry, "מנוע 1.4 TSI: הצטברות פחמן בשסתומי היניקה ובלאי מנגנון הטורבו"]),
    ]},
    { id: "yeti", make: "skoda", model: "Yeti", he: "יטי", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("5L", 2010, 2017, "1.2 / 1.4 / 1.8 TSI בנזין, דיזל", "105–170", ["petrol", "diesel"], 7.8, 5, 2009, [C.history, C.inspect, C.dsgDry, C.tsiChain]),
    ]},
  ]},

  { id: "byd", name: "BYD", he: "BYD", models: [
    { id: "atto-3", make: "byd", model: "Atto 3", he: "אטו 3", body: "suv", segment: "mass", price: [154990, 164990], status: "on_sale", gens: [
      T("Gen1", 2022, 2025, "סוללת LFP 60 קוט\"ש", "204", ["ev"], 17.5, 5, 2022, [C.ev, C.newBrand]),
      T("EVO", 2026, null, "סוללה גדולה יותר, הנעה אחורית/כפולה", "313–448", ["ev"], 17.0, null, undefined, [C.ev], "דור משודרג"),
    ]},
    { id: "dolphin", make: "byd", model: "Dolphin", he: "דולפין", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("EA1", 2023, 2025, "סוללת LFP 45/60 קוט\"ש", "95–204", ["ev"], 15.5, 5, 2023, [C.ev, C.newBrand], "במחירון הנוכחי מופיע Dolphin Surf, דגם קטן יותר (₪114,990–123,990)"),
    ]},
    { id: "seal", make: "byd", model: "Seal", he: "סיל", body: "sedan", segment: "mass", price: [198990, 219990], status: "on_sale", gens: [
      T("Gen1", 2023, null, "סוללה 82.5 קוט\"ש", "313–530", ["ev"], 17.5, 5, 2023, [C.ev, C.newBrand]),
    ]},
    { id: "seal-u", make: "byd", model: "Seal U", he: "סיל U", body: "suv", segment: "mass", price: [194990, 216990], status: "on_sale", gens: [
      T("Gen1", 2024, null, "חשמלי 71.8/87 קוט\"ש / פלאג-אין DM-i", "218–324", ["ev", "phev"], 19.5, 5, undefined, [C.ev, C.phev, C.newBrand], "גרסת DM-i: ₪199,990–214,990"),
    ]},
    { id: "tang", make: "byd", model: "Tang", he: "טאנג", body: "suv7", segment: "mass", price: null, status: "discontinued", gens: [
      T("EV", 2022, 2024, "סוללה 86 קוט\"ש, 7 מקומות", "517", ["ev"], 24.0, 5, 2022, [C.ev, C.newBrand]),
    ]},
    { id: "dolphin-surf", make: "byd", model: "Dolphin Surf", he: "דולפין סרף", body: "city", segment: "mass", price: [114990, 123990], status: "on_sale", gens: [
      T("Gen1", 2023, null, "חשמלי, סוללה 30–43.2 קוט\"ש", "88–156", ["ev"], 14.0, 5, 2025, [C.ev, C.newBrand], "4 מושבים"),
    ]},
    { id: "atto-2", make: "byd", model: "Atto 2", he: "אטו 2", body: "suv", segment: "mass", price: [137990, 149990], status: "on_sale", gens: [
      T("SC3E", 2024, null, "חשמלי / 1.5 פלאג-אין (DM-i)", "94–209", ["ev", "phev"], 15.0, null, undefined, [C.ev, C.phev, C.newBrand], "חשמלי ₪148,990; DM-i ₪137,990–149,990"),
    ]},
    { id: "sealion-7", make: "byd", model: "Sealion 7", he: "סי ליון 7", body: "suv", segment: "mass", price: [198990, 237990], status: "on_sale", gens: [
      T("Gen1", 2024, null, "חשמלי, סוללה 71.8–91.3 קוט\"ש", "134–523", ["ev"], 19.0, null, undefined, [C.ev, C.newBrand]),
    ]},
    { id: "sealion-05", make: "byd", model: "Sealion 05 DM-i", he: "סי ליון 05 DM-i", body: "suv", segment: "mass", price: [166990, 171990], status: "on_sale", gens: [
      T("Gen1", 2024, null, "1.5 בנזין + מנוע חשמלי, פלאג-אין, סוללה 12.9/18.3 קוט\"ש", "212–213 משולב", ["phev"], 4.2, null, undefined, [C.phev, C.newBrand], "צריכה עם טעינה קבועה בבית; עם סוללה ריקה כ-5.5 ל'/100 ק\"מ (הערכה)"),
    ]},
    { id: "seal-05", make: "byd", model: "Seal 05 DM-i", he: "סיל 05 DM-i", body: "sedan", segment: "mass", price: [174990, 174990], status: "on_sale", gens: [
      T("HA6", 2025, null, "1.5 בנזין + מנוע חשמלי, פלאג-אין, סוללה 18.3 קוט\"ש", "218 משולב", ["phev"], 5.1, null, undefined, [C.phev, C.newBrand], "218 כ\"ס לפי המפרט הישראלי; ויקיפדיה מציינת 208 כ\"ס"),
    ]},
  ]},

  { id: "jaecoo", name: "Omoda & Jaecoo", he: "אומודה וג'אקו", models: [
    { id: "jaecoo-7", make: "jaecoo", model: "Jaecoo 7", he: "ג'אקו 7", body: "suv", segment: "mass", price: [179990, 202990], status: "on_sale", gens: [
      T("J7", 2024, null, "1.6 טורבו / פלאג-אין", "186–204", ["petrol", "phev"], 8.0, 5, undefined, [C.newBrand, C.history, "תיבה רובוטית: " + C.dct]),
    ]},
    { id: "jaecoo-8", make: "jaecoo", model: "Jaecoo 8", he: "ג'אקו 8", body: "suv7", segment: "mass", price: [229900, 254900], status: "on_sale", gens: [
      T("J8", 2025, null, "1.5 טורבו פלאג-אין 4x4", "—", ["phev"], 6.4, null, undefined, [C.newBrand, C.phev], "לא נבחן ב-Euro NCAP"),
    ]},
    { id: "jaecoo-5", make: "jaecoo", model: "Jaecoo 5", he: "ג'אקו 5", body: "suv", segment: "mass", price: [150900, 163900], status: "on_sale", gens: [
      T("J5", 2025, null, "1.5 טורבו היברידי / חשמלי 59 קוט\"ש", "211–224", ["hybrid", "ev"], 6.0, null, undefined, [C.newBrand], "לא נבחן ב-Euro NCAP"),
    ]},
    { id: "omoda-5", make: "jaecoo", model: "Omoda 5", he: "אומודה 5", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("C5", 2023, 2025, "1.5 / 1.6 טורבו", "147–186", ["petrol"], 8.2, 5, 2022, [C.newBrand, C.dct]),
    ]},
    { id: "omoda-e5", make: "jaecoo", model: "Omoda E5", he: "אומודה E5", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("E5", 2024, 2025, "סוללה 61 קוט\"ש", "204", ["ev"], 18.0, null, undefined, [C.ev, C.newBrand]),
    ]},
    { id: "omoda-7", make: "jaecoo", model: "Omoda 7", he: "אומודה 7", body: "suv", segment: "mass", price: [179900, 199900], status: "on_sale", gens: [
      T("Gen1", 2025, null, "פלאג-אין SHS: 1.5 טורבו + מנוע חשמלי", "143 בנזין + 204 חשמלי (הספק משולב לא פורסם)", ["phev"], 6.0, null, undefined, [C.phev, C.newBrand], "טווח חשמלי מוצהר 92 ק\"מ, כ-75 ק\"מ במבחן דרך"),
    ]},
    { id: "omoda-9", make: "jaecoo", model: "Omoda 9", he: "אומודה 9", body: "suv", segment: "mass", price: [229900, 244900], status: "on_sale", gens: [
      T("Gen1", 2025, null, "פלאג-אין SHS: 1.5 טורבו, הנעה כפולה, סוללה 34.5 קוט\"ש", "443–537 (מקורות סותרים)", ["phev"], 7.0, 5, 2025, [C.phev, C.newBrand, C.recalls], "טווח חשמלי מוצהר 145 ק\"מ. ריקול תוכנת מנוע לרכבים שיוצרו 12/2024–4/2025"),
    ]},
  ]},

  { id: "tesla", name: "Tesla", he: "טסלה", models: [
    { id: "model-3", make: "tesla", model: "Model 3", he: "מודל 3", body: "sedan", segment: "premium", price: [191592, 293567], status: "on_sale", gens: [
      T("Gen1", 2019, 2023, "RWD / Long Range / Performance", "283–513", ["ev"], 15.5, 5, 2019, [C.ev, "פערי מרווחים בפחים ואיכות צבע", "תיקוני פחחות יקרים"]),
      T("Highland", 2024, null, "RWD / Long Range / Performance", "283–510", ["ev"], 14.5, 5, 2024, [C.ev]),
    ]},
    { id: "model-y", make: "tesla", model: "Model Y", he: "מודל Y", body: "suv", segment: "premium", price: [243160, 333972], status: "on_sale", gens: [
      T("Gen1", 2021, 2025, "RWD / Long Range / Performance", "299–534", ["ev"], 16.5, 5, 2022, [C.ev, "פערי מרווחים בפחים ואיכות צבע", "נוקשות מתלים"]),
      T("Juniper", 2025, null, "RWD / Long Range / Performance", "295–460", ["ev"], 15.0, null, undefined, [C.ev]),
    ]},
    { id: "model-s", make: "tesla", model: "Model S", he: "מודל S", body: "sedan", segment: "premium", price: null, status: "not_sold_new", gens: [
      T("Gen1", 2014, null, "סוללה 75–100 קוט\"ש", "330–1020", ["ev"], 20.0, 5, 2014, [C.ev, C.airSusp, "ידיות דלת נשלפות ומסכים ישנים"], "לא נמכר כיום חדש בישראל; קיים ביד שנייה"),
    ]},
    { id: "model-x", make: "tesla", model: "Model X", he: "מודל X", body: "suv7", segment: "premium", price: null, status: "not_sold_new", gens: [
      T("Gen1", 2016, null, "סוללה 75–100 קוט\"ש", "525–1020", ["ev"], 23.0, 5, 2019, [C.ev, C.airSusp, "דלתות כנף (Falcon Wing): לבדוק פעולה תקינה"], "לא נמכר כיום חדש בישראל; קיים ביד שנייה"),
    ]},
    { id: "cybertruck", make: "tesla", model: "Cybertruck", he: "סייברטראק", body: "pickup", segment: "premium", price: null, status: "not_sold_new", gens: [
      T("Gen1", 2024, null, "הנעה כפולה/משולשת", "600–845", ["ev"], 28.0, null, undefined, [C.ev, "יבוא אישי בלבד: אחריות ושירות מוגבלים"], "לא משווק רשמית בישראל"),
    ]},
  ]},

  { id: "seat", name: "Seat", he: "סיאט", models: [
    { id: "ibiza", make: "seat", model: "Ibiza", he: "איביזה", body: "hatch", segment: "mass", price: [122390, 139900], status: "on_sale", gens: [
      T("6J", 2010, 2017, "1.2 / 1.4 / 1.2 TSI", "70–105", ["petrol"], 6.8, 5, 2008, [C.history, C.inspect, C.tsiChain, C.dsgDry]),
      T("6F (KJ)", 2018, null, "1.0 TSI", "95–115", ["petrol"], 6.0, 5, 2017, [C.history, C.dsgDry]),
    ]},
    { id: "arona", make: "seat", model: "Arona", he: "ארונה", body: "suv", segment: "mass", price: [132900, 143900], status: "on_sale", gens: [
      T("KJ7", 2018, null, "1.0 / 1.5 TSI", "115–150", ["petrol"], 6.5, 5, 2017, [C.history, C.dsgDry]),
    ]},
    { id: "ateca", make: "seat", model: "Ateca", he: "אטקה", body: "suv", segment: "mass", price: null, status: "unverified", gens: [
      T("KH7", 2016, null, "1.0 / 1.4 / 1.5 TSI", "115–150", ["petrol"], 7.2, 5, 2016, [C.history, C.dsgDry]),
    ]},
    { id: "leon", make: "seat", model: "Leon", he: "לאון", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("1P", 2010, 2012, "1.2/1.4 TSI", "105–125", ["petrol"], 7.4, 5, 2005, [C.history, C.inspect, C.tsiChain]),
      T("5F", 2013, 2019, "1.2/1.4 TSI, 1.0 TSI", "110–150", ["petrol"], 6.6, 5, 2012, [C.history, C.inspect, C.dsgDry]),
      T("KL", 2020, null, "1.0/1.5 TSI", "110–150", ["petrol"], 6.3, 5, 2020, [C.history, C.dsgDry]),
    ]},
    { id: "tarraco", make: "seat", model: "Tarraco", he: "טאראקו", body: "suv7", segment: "mass", price: null, status: "unverified", gens: [
      T("KN2", 2019, null, "1.5 / 2.0 TSI", "150–190", ["petrol"], 8.2, 5, 2019, [C.history]),
    ]},
  ]},

  { id: "cupra", name: "Cupra", he: "קופרה", models: [
    { id: "formentor", make: "cupra", model: "Formentor", he: "פורמנטור", body: "suv", segment: "mass", price: [199900, 306900], status: "on_sale", gens: [
      T("KM7", 2021, null, "1.5 TSI / 2.0 TSI / פלאג-אין", "150–333", ["petrol", "phev"], 7.4, 5, 2021, [C.history]),
    ]},
    { id: "cupra-leon", make: "cupra", model: "Leon", he: "לאון", body: "hatch", segment: "mass", price: [189900, 264400], status: "on_sale", gens: [
      T("KL", 2021, null, "1.5 TSI / 2.0 TSI / פלאג-אין", "150–333", ["petrol", "phev"], 7.0, 5, 2020, [C.history]),
    ]},
    { id: "born", make: "cupra", model: "Born", he: "בורן", body: "hatch", segment: "mass", price: null, status: "unverified", gens: [
      T("K1", 2022, null, "סוללה 58/77 קוט\"ש", "204–326", ["ev"], 16.0, 5, 2022, [C.ev], "לא מופיע במחירון קופרה הנוכחי"),
    ]},
    { id: "cupra-ateca", make: "cupra", model: "Ateca", he: "אטקה", body: "suv", segment: "mass", price: null, status: "unverified", gens: [
      T("KH7", 2019, null, "2.0 TSI", "300", ["petrol"], 9.5, 5, 2016, [C.history], "לא מופיע במחירון קופרה הנוכחי"),
    ]},
    { id: "terramar", make: "cupra", model: "Terramar", he: "טרמאר", body: "suv", segment: "mass", price: [225900, 275900], status: "on_sale", gens: [
      T("KM", 2025, null, "1.5 TSI / פלאג-אין / 2.0 TSI", "150–272", ["petrol", "phev"], 7.2, null, undefined, [C.recalls], "דגם חדש"),
    ]},
  ]},

  { id: "geely", name: "Geely", he: "ג'ילי", models: [
    { id: "geometry-c", make: "geely", model: "Geometry C", he: "גיאומטרי C", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("Gen1", 2021, 2023, "סוללה 70 קוט\"ש", "204", ["ev"], 16.5, null, undefined, [C.ev, C.newBrand]),
    ]},
    { id: "ex5", make: "geely", model: "EX5", he: "EX5", body: "suv", segment: "mass", price: [161990, 169490], status: "on_sale", gens: [
      T("Gen1", 2025, null, "סוללת LFP 60 קוט\"ש", "218", ["ev"], 17.5, null, undefined, [C.ev, C.newBrand], "במחירון הישראלי מופיע בשם E5"),
    ]},
    { id: "okavango", make: "geely", model: "Okavango", he: "אוקוונגו", body: "suv7", segment: "mass", price: null, status: "unverified", gens: [
      T("Gen1", 2021, null, "1.5 טורבו מיילד-היברידי, 7 מקומות", "177–190", ["petrol"], 8.5, null, undefined, [C.newBrand], "לא אומת שנמכר בישראל"),
    ]},
    { id: "preface", make: "geely", model: "Preface", he: "פריפייס", body: "sedan", segment: "mass", price: null, status: "unverified", gens: [
      T("Gen1", 2021, null, "2.0 טורבו", "218", ["petrol"], 8.0, null, undefined, [C.newBrand], "לא אומת שנמכר בישראל"),
    ]},
    { id: "coolray", make: "geely", model: "Coolray", he: "קולריי", body: "suv", segment: "mass", price: null, status: "unverified", gens: [
      T("Gen1", 2020, null, "1.5 טורבו", "177", ["petrol"], 7.8, null, undefined, [C.newBrand, C.dct], "לא אומת שנמכר בישראל"),
    ]},
    { id: "starray", make: "geely", model: "Starray EM-i", he: "סטארריי EM-i", body: "suv", segment: "mass", price: [169990, 181990], status: "on_sale", gens: [
      T("P145", 2024, null, "פלאג-אין: 1.5 בנזין + סוללה 18.4 קוט\"ש", "214 (משולב; מנוע הבנזין 99–110)", ["phev"], 5.5, 5, 2025, [C.phev, C.newBrand], "טווח חשמלי מוצהר 83 ק\"מ; בסין נמכר בשם Galaxy Starship 7"),
    ]},
  ]},

  { id: "chery", name: "Chery", he: "צ'רי", models: [
    { id: "tiggo-8", make: "chery", model: "Tiggo 8 Pro", he: "טיגו 8 פרו", body: "suv7", segment: "mass", price: [179990, 204990], status: "on_sale", gens: [
      T("T18", 2022, null, "1.6 טורבו / פלאג-אין", "186–326", ["petrol", "phev"], 8.8, null, undefined, [C.newBrand, C.dct]),
    ]},
    { id: "tiggo-7", make: "chery", model: "Tiggo 7 Pro", he: "טיגו 7 פרו", body: "suv", segment: "mass", price: [159990, 186990], status: "on_sale", gens: [
      T("T1E", 2023, null, "1.6 טורבו / 1.5 היברידי", "147–204", ["petrol", "hybrid"], 8.6, 4, 2025, [C.newBrand, C.dct], "במבחן דרך גרסת הבנזין צרכה כ-11.5 ק\"מ לליטר"),
    ]},
    { id: "fx", make: "chery", model: "FX", he: "FX", body: "suv", segment: "mass", price: [146990, 173990], status: "on_sale", gens: [
      T("Gen1", 2025, null, "בנזין / חשמלי (FX EV)", "—", ["petrol", "ev"], 8.0, null, undefined, [C.newBrand], "FX EV: ₪151,990–173,990"),
    ]},
    { id: "tiggo-4", make: "chery", model: "Tiggo 4 Pro", he: "טיגו 4 פרו", body: "suv", segment: "mass", price: [114990, 138990], status: "on_sale", gens: [
      T("T19", 2023, null, "1.5 טורבו / 1.5 היברידי", "147–163", ["petrol", "hybrid"], 7.2, null, undefined, [C.newBrand]),
    ]},
    { id: "arrizo-8", make: "chery", model: "Arrizo 8", he: "אריזו 8", body: "sedan", segment: "mass", price: [159990, 181990], status: "on_sale", gens: [
      T("Gen1", 2024, null, "1.6 טורבו / פלאג-אין", "186–", ["petrol", "phev"], 7.8, null, undefined, [C.newBrand, C.dct]),
    ]},
    { id: "tiggo-9", make: "chery", model: "Tiggo 9", he: "טיגו 9", body: "suv7", segment: "mass", price: [217990, 244990], status: "on_sale", gens: [
      T("Gen1", 2023, null, "פלאג-אין: 1.5 טורבו (143 כ\"ס) + מנועים חשמליים, 7 מקומות", "מעל 400 (הערכה, לא פורסם רשמית)", ["phev"], 7.0, null, undefined, [C.phev, C.newBrand], "הושק בסין ב-2023; בישראל גרסת פלאג-אין בלבד"),
    ]},
  ]},

  { id: "suzuki", name: "Suzuki", he: "סוזוקי", models: [
    { id: "vitara", make: "suzuki", model: "Vitara", he: "ויטארה", body: "suv", segment: "mass", price: [154990, 179990], status: "on_sale", gens: [
      T("LY", 2015, 2024, "1.6 / 1.4 טורבו / 1.4 מיילד-היברידי", "120–140", ["petrol", "hybrid"], 7.6, 5, 2015, [C.history, C.inspect]),
      T("e Vitara", 2026, null, "חשמלי", "171", ["ev"], 16.5, 4, 2025, [C.ev], "e Vitara החשמלית: ₪154,990–179,990; ויטארה בנזין: ₪159,990–169,990"),
    ]},
    { id: "swift", make: "suzuki", model: "Swift", he: "סוויפט", body: "city", segment: "mass", price: [119990, 129990], status: "on_sale", gens: [
      T("FZ/NZ", 2010, 2017, "1.2 / 1.4 בנזין", "94–136", ["petrol"], 6.5, 5, 2010, [C.history, C.inspect]),
      T("AZ", 2017, 2024, "1.2 / 1.2 מיילד-היברידי", "83–90", ["petrol", "hybrid"], 5.8, 3, 2017, [C.history]),
      T("AZH", 2024, null, "1.2 מיילד-היברידי", "82", ["hybrid"], 5.1, 3, 2024, [C.history]),
    ]},
    { id: "ignis", make: "suzuki", model: "Ignis", he: "איגניס", body: "city", segment: "mass", price: null, status: "discontinued", gens: [
      T("MF", 2017, null, "1.2 / 1.2 מיילד-היברידי", "83–90", ["petrol", "hybrid"], 5.8, 3, 2016, [C.history]),
    ]},
    { id: "s-cross", make: "suzuki", model: "S-Cross", he: "S-Cross", body: "suv", segment: "mass", price: [159990, 179990], status: "on_sale", gens: [
      T("JY", 2014, 2021, "1.6 / 1.4 טורבו", "120–140", ["petrol"], 7.4, 5, 2013, [C.history, C.inspect]),
      T("Gen2", 2022, null, "1.4 טורבו מיילד-היברידי", "129", ["petrol", "hybrid"], 7.0, null, undefined, [C.history]),
    ]},
    { id: "jimny", make: "suzuki", model: "Jimny", he: "ג'ימני", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("JB74", 2019, null, "1.5 בנזין", "100–102", ["petrol"], 8.1, 3, 2018, [C.history, "רכב שטח אמיתי: לבדוק שלדה ותחתית אחרי נסיעות שטח"]),
    ]},
    { id: "baleno", make: "suzuki", model: "Baleno", he: "בלנו", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("WB", 2015, 2022, "1.0 טורבו / 1.2 בנזין (גם מיילד-היברידי)", "75–111", ["petrol"], 5.8, 3, 2016, [C.history, C.inspect]),
    ]},
    { id: "sx4", make: "suzuki", model: "SX4", he: "SX4", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("GY", 2010, 2014, "1.5 / 1.6 / 2.0 בנזין, דיזל", "99–152", ["petrol", "diesel"], 7.8, 4, 2006, [C.history, C.inspect], "ה-S-Cross שהחליף אותו מופיע בנפרד"),
    ]},
    { id: "celerio", make: "suzuki", model: "Celerio", he: "סלריו", body: "city", segment: "mass", price: null, status: "discontinued", gens: [
      T("FE", 2014, 2025, "1.0 בנזין", "—", ["petrol"], 5.2, 3, 2014, [C.history, C.inspect]),
    ]},
  ]},

  { id: "mitsubishi", name: "Mitsubishi", he: "מיצובישי", models: [
    { id: "outlander", make: "mitsubishi", model: "Outlander", he: "אאוטלנדר", body: "suv7", segment: "mass", price: [189990, 244990], status: "on_sale", gens: [
      T("GF/GG", 2013, 2021, "2.0 / 2.4 בנזין / פלאג-אין", "150–224", ["petrol", "phev"], 9.0, 5, 2012, [C.history, C.inspect, C.cvt, "בגרסת הפלאג-אין: " + C.phev]),
      T("GN", 2022, null, "1.5 טורבו / 2.4 פלאג-אין", "163–306", ["petrol", "phev"], 8.0, null, undefined, [C.history]),
    ]},
    { id: "asx", make: "mitsubishi", model: "ASX", he: "ASX", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("GA", 2010, 2022, "1.6 / 2.0 בנזין", "117–150", ["petrol"], 8.2, 5, 2011, [C.history, C.inspect, C.cvt]),
      T("Gen2", 2023, 2024, "1.0 / 1.3 טורבו (על בסיס רנו קפצ'ור)", "91–158", ["petrol", "hybrid"], 6.5, null, undefined, [C.history]),
    ]},
    { id: "eclipse-cross", make: "mitsubishi", model: "Eclipse Cross", he: "אקליפס קרוס", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("GK", 2018, 2024, "1.5 טורבו / פלאג-אין", "163–188", ["petrol", "phev"], 8.4, 5, 2017, [C.history, C.cvt]),
    ]},
    { id: "attrage", make: "mitsubishi", model: "Attrage", he: "אטראז'", body: "sedan", segment: "mass", price: null, status: "discontinued", gens: [
      T("A10", 2014, 2022, "1.2 בנזין", "80", ["petrol"], 6.0, null, undefined, [C.history, C.inspect, C.cvt]),
    ]},
    { id: "space-star", make: "mitsubishi", model: "Space Star", he: "ספייס סטאר", body: "city", segment: "mass", price: null, status: "discontinued", gens: [
      T("A00", 2013, 2024, "1.0 / 1.2 בנזין", "71–80", ["petrol"], 5.8, 4, 2013, [C.history, C.inspect, C.cvt]),
    ]},
  ]},

  { id: "peugeot", name: "Peugeot", he: "פיג'ו", models: [
    { id: "3008", make: "peugeot", model: "3008", he: "3008", body: "suv", segment: "mass", price: [186990, 206990], status: "on_sale", gens: [
      T("T84 (Gen1)", 2010, 2016, "1.6 / 1.6 THP", "120–156", ["petrol"], 8.6, 5, 2009, [C.history, C.inspect, C.mbChain]),
      T("P84 (Gen2)", 2017, 2023, "1.2 PureTech / 1.6 טורבו / פלאג-אין", "130–300", ["petrol", "phev"], 7.0, 5, 2016, [C.history, C.puretech, "תיבה אוטומטית EAT6/EAT8: לבדוק החלפות חלקות"]),
      T("Gen3", 2024, null, "1.2 היברידי / חשמלי (e-3008)", "136–320", ["hybrid", "ev"], 6.2, null, undefined, [C.puretech], "e-3008: ₪258,990"),
    ]},
    { id: "2008", make: "peugeot", model: "2008", he: "2008", body: "suv", segment: "mass", price: [147990, 159990], status: "on_sale", gens: [
      T("A94 (Gen1)", 2013, 2019, "1.2 PureTech", "82–130", ["petrol"], 6.6, 5, 2013, [C.history, C.puretech]),
      T("P24 (Gen2)", 2020, null, "1.2 PureTech / מיילד-היברידי", "100–136", ["petrol", "hybrid"], 6.5, 4, 2019, [C.history, C.puretech]),
    ]},
    { id: "208", make: "peugeot", model: "208", he: "208", body: "city", segment: "mass", price: [130990, 139490], status: "on_sale", gens: [
      T("A9 (Gen1)", 2012, 2019, "1.2 PureTech / 1.6", "82–120", ["petrol"], 6.3, 5, 2012, [C.history, C.puretech]),
      T("P21 (Gen2)", 2020, null, "1.2 PureTech", "100–130", ["petrol"], 6.2, 4, 2019, [C.history, C.puretech]),
    ]},
    { id: "408", make: "peugeot", model: "408", he: "408", body: "sedan", segment: "mass", price: [174990, 174990], status: "on_sale", gens: [
      T("P54", 2023, null, "1.2 PureTech / פלאג-אין", "130–225", ["petrol", "phev"], 6.6, 4, 2022, [C.history, C.puretech]),
    ]},
    { id: "5008", make: "peugeot", model: "5008", he: "5008", body: "suv7", segment: "mass", price: [208990, 235990], status: "on_sale", gens: [
      T("T87 (MPV)", 2010, 2016, "1.6 / 1.6 THP", "120–156", ["petrol"], 8.8, 5, 2009, [C.history, C.inspect, C.mbChain]),
      T("P87", 2017, 2023, "1.2 PureTech / 1.6 טורבו", "130–180", ["petrol"], 7.3, null, undefined, [C.history, C.puretech]),
      T("Gen3", 2025, null, "1.2 היברידי / חשמלי (e-5008)", "136–320", ["hybrid", "ev"], 6.5, null, undefined, [C.puretech], "e-5008: ₪294,990"),
    ]},
    { id: "308", make: "peugeot", model: "308", he: "308", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("T7", 2010, 2013, "1.6 בנזין / 1.6 THP", "110–200", ["petrol", "diesel"], 8.0, null, undefined, [C.history, C.inspect]),
      T("T9", 2013, 2021, "1.2 PureTech / 1.6 בנזין, 1.5/1.6 דיזל", "—", ["petrol", "diesel"], 6.8, null, undefined, [C.history, C.inspect, C.puretech]),
      T("P5", 2021, null, "1.2 PureTech / פלאג-אין / חשמלי", "—", ["petrol", "diesel", "phev", "ev"], 6.4, 4, 2022, [C.puretech, C.recalls], "לא במחירון היבואן הנוכחי"),
    ]},
    { id: "301", make: "peugeot", model: "301", he: "301", body: "sedan", segment: "mass", price: null, status: "discontinued", gens: [
      T("M33", 2012, 2021, "1.2 PureTech / 1.6 בנזין, 1.6 דיזל", "71–114", ["petrol", "diesel"], 7.2, 3, 2014, [C.history, C.inspect, C.puretech]),
    ]},
    { id: "rifter", make: "peugeot", model: "Rifter", he: "ריפטר", body: "mpv", segment: "mass", price: [178990, 189990], status: "on_sale", gens: [
      T("K9", 2018, null, "1.5 BlueHDi דיזל / 1.2 PureTech", "100–130", ["petrol", "diesel"], 6.5, null, undefined, [C.history, C.puretech, C.recalls]),
    ]},
  ]},

  { id: "volkswagen", name: "Volkswagen", he: "פולקסווגן", models: [
    { id: "golf", make: "volkswagen", model: "Golf", he: "גולף", body: "hatch", segment: "mass", price: [169900, 196900], status: "on_sale", gens: [
      T("Mk6", 2010, 2012, "1.4 / 1.2 TSI / 1.4 TSI", "80–160", ["petrol"], 7.4, 5, 2008, [C.history, C.inspect, C.tsiChain, C.dsgDry]),
      T("Mk7", 2013, 2019, "1.2/1.4 TSI, 1.0 TSI", "105–150", ["petrol"], 6.5, 5, 2012, [C.history, C.inspect, C.dsgDry]),
      T("Mk8", 2020, null, "1.0/1.5 eTSI", "110–150", ["petrol", "hybrid"], 6.2, 5, 2019, [C.history, C.dsgDry, "מערכת המולטימדיה: לבדוק עדכוני תוכנה"]),
    ]},
    { id: "tiguan", make: "volkswagen", model: "Tiguan", he: "טיגואן", body: "suv", segment: "mass", price: [239900, 269900], status: "on_sale", gens: [
      T("5N", 2010, 2016, "1.4 TSI / 2.0 TSI", "150–200", ["petrol"], 9.2, 5, 2007, [C.history, C.inspect, C.tsiChain]),
      T("AD1", 2017, 2023, "1.4/1.5/2.0 TSI", "150–220", ["petrol"], 8.0, 5, 2016, [C.history, C.inspect]),
      T("Mk3", 2024, null, "1.5 eTSI / פלאג-אין", "150–272", ["petrol", "phev"], 7.0, 5, 2024, [C.history]),
    ]},
    { id: "polo", make: "volkswagen", model: "Polo", he: "פולו", body: "city", segment: "mass", price: null, status: "unverified", gens: [
      T("6R", 2010, 2017, "1.2 / 1.4 / 1.2 TSI", "60–105", ["petrol"], 6.6, 5, 2009, [C.history, C.inspect, C.tsiChain, C.dsgDry]),
      T("AW", 2018, null, "1.0 TSI", "95–115", ["petrol"], 6.0, 5, 2017, [C.history, C.dsgDry], "לא מופיע במחירון פולקסווגן הנוכחי"),
    ]},
    { id: "id-4", make: "volkswagen", model: "ID.4", he: "ID.4", body: "suv", segment: "mass", price: null, status: "unverified", gens: [
      T("E21", 2021, null, "סוללה 52/77 קוט\"ש", "148–299", ["ev"], 18.5, 5, 2021, [C.ev, "עדכוני תוכנה למערכת המולטימדיה"], "לא מופיע במחירון פולקסווגן הנוכחי"),
    ]},
    { id: "touareg", make: "volkswagen", model: "Touareg", he: "טוארג", body: "suv", segment: "premium", price: null, status: "unverified", gens: [
      T("7P", 2011, 2018, "3.0 V6 TDI / 3.6 V6", "245–280", ["diesel", "petrol"], 11.0, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("CR", 2018, null, "3.0 V6 TSI/TDI / פלאג-אין", "286–462", ["petrol", "diesel", "phev"], 10.5, 5, 2018, [C.history, C.airSusp], "לא מופיע במחירון פולקסווגן הנוכחי"),
    ]},
    { id: "t-cross", make: "volkswagen", model: "T-Cross", he: "טי-קרוס", body: "suv", segment: "mass", price: [144900, 169900], status: "on_sale", gens: [
      T("C11", 2018, null, "1.0 / 1.5 TSI בנזין, DSG", "94–150", ["petrol"], 7.0, 5, 2019, [C.history, C.dsgDry], "במבחן חוזר ב-2025 קיבל ציונים נמוכים יותר"),
    ]},
    { id: "t-roc", make: "volkswagen", model: "T-Roc", he: "טי-רוק", body: "suv", segment: "mass", price: null, status: "unverified", gens: [
      T("A11", 2017, 2025, "1.0 / 1.5 / 2.0 TSI בנזין, דיזל", "113–296", ["petrol", "diesel"], 7.3, null, undefined, [C.history, C.dsgDry]),
      T("דור 2", 2026, null, "1.5 TSI בנזין", "—", ["petrol"], 6.8, null, undefined, [C.recalls], "לא בעמוד המותג במחירון; דף הדגם עדיין מציג ₪180,000–189,900"),
    ]},
    { id: "id-3", make: "volkswagen", model: "ID.3", he: "ID.3", body: "hatch", segment: "mass", price: [245000, 245000], status: "on_sale", gens: [
      T("E11", 2019, null, "חשמלי, סוללה 45–84 קוט\"ש", "143–322", ["ev"], 16.5, null, undefined, [C.ev, C.history, "דגמים ראשונים (2020–2021): לוודא עדכוני תוכנה"]),
    ]},
    { id: "passat", make: "volkswagen", model: "Passat", he: "פאסאט", body: "sedan", segment: "mass", price: null, status: "discontinued", gens: [
      T("B7", 2010, 2015, "1.4 / 1.8 / 2.0 TSI בנזין, דיזל", "104–296", ["petrol", "diesel"], 8.0, null, undefined, [C.history, C.inspect, C.tsiChain, C.ea888, "גרסאות דיזל: מנוע EA189 מפרשת הפליטות, לוודא עדכון"]),
      T("B8", 2014, 2023, "1.4 / 1.5 / 1.8 / 2.0 TSI, GTE פלאג-אין", "118–276", ["petrol", "diesel", "phev"], 7.2, null, undefined, [C.history, C.inspect, "תיבת DSG: לבדוק החלפות חלקות"]),
      T("B9", 2023, null, "1.5 eTSI / פלאג-אין (סטיישן בלבד)", "120–268", ["petrol", "diesel", "phev"], 6.5, null, undefined, [C.recalls], "לא במחירון היבואן הנוכחי"),
    ]},
    { id: "jetta", make: "volkswagen", model: "Jetta", he: "ג'טה", body: "sedan", segment: "mass", price: null, status: "discontinued", gens: [
      T("A6 (Mk6)", 2010, 2018, "1.2 / 1.4 TSI, 1.4 TSI היברידי, דיזל", "110–200", ["petrol", "diesel", "hybrid"], 7.6, null, undefined, [C.history, C.inspect, C.tsiChain, C.dsgDry]),
    ]},
    { id: "tayron", make: "volkswagen", model: "Tayron", he: "טיירון", body: "suv7", segment: "mass", price: [259900, 259900], status: "on_sale", gens: [
      T("Gen1 (גלובלי)", 2024, null, "1.5 eTSI / פלאג-אין / 2.0 TSI", "—", ["petrol", "phev", "diesel"], 7.8, null, undefined, [C.recalls], "7 מושבים"),
    ]},
    { id: "id-buzz", make: "volkswagen", model: "ID. Buzz", he: "ID. באז", body: "mpv", segment: "mass", price: null, status: "on_sale", gens: [
      T("MEB", 2022, null, "חשמלי, סוללה 77/85 קוט\"ש", "204–340", ["ev"], 23.0, 5, 2022, [C.ev, C.recalls], "מחיר לא מוצג: כרטיס carzone ₪385,000–452,000, דף הדגם ₪335,000, cartube ₪335,000–455,000"),
    ]},
  ]},

  { id: "mg", name: "MG", he: "MG", models: [
    { id: "zs", make: "mg", model: "ZS", he: "ZS", body: "suv", segment: "mass", price: [137888, 137888], status: "on_sale", gens: [
      T("ZS (Gen1)", 2018, 2024, "1.5 / 1.0 טורבו", "106–111", ["petrol"], 7.6, 3, 2017, [C.history, C.newBrand]),
      T("ZS Hybrid+", 2025, null, "1.5 היברידי", "196", ["hybrid"], 5.6, null, undefined, [C.newBrand]),
    ]},
    { id: "zs-ev", make: "mg", model: "ZS EV", he: "ZS EV", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("ZS EV", 2020, 2024, "סוללה 44.5/51/72 קוט\"ש", "143–156", ["ev"], 17.5, 5, 2019, [C.ev, C.newBrand]),
    ]},
    { id: "mg4", make: "mg", model: "MG4", he: "MG4", body: "hatch", segment: "mass", price: [119888, 119888], status: "on_sale", gens: [
      T("EH32", 2022, null, "סוללה 51/64/77 קוט\"ש", "170–245", ["ev"], 16.5, 5, 2022, [C.ev, C.newBrand]),
    ]},
    { id: "mg5", make: "mg", model: "MG5", he: "MG5", body: "wagon", segment: "mass", price: [158888, 158888], status: "on_sale", gens: [
      T("EP", 2021, null, "חשמלי 50/61 קוט\"ש", "156–177", ["ev"], 17.0, 5, 2022, [C.ev, C.newBrand], "לא אומת אם הגרסה במחירון הנוכחי היא החשמלית"),
    ]},
    { id: "hs", make: "mg", model: "HS", he: "HS", body: "suv", segment: "mass", price: [154888, 158888], status: "on_sale", gens: [
      T("AS23", 2019, 2024, "1.5 טורבו / פלאג-אין (EHS)", "162–258", ["petrol", "phev"], 8.8, 5, 2019, [C.history, C.dct, C.newBrand]),
      T("Gen2", 2025, null, "1.5 טורבו / היברידי", "170–", ["petrol", "hybrid"], 7.8, null, undefined, [C.newBrand]),
    ]},
    { id: "mg3", make: "mg", model: "MG3", he: "MG3", body: "hatch", segment: "mass", price: [119888, 127888], status: "on_sale", gens: [
      T("Gen2", 2011, 2023, "1.5 בנזין", "92–109", ["petrol"], 7.0, 3, 2014, [C.history, C.inspect]),
      T("Gen3", 2024, null, "1.5 בנזין / 1.5 היברידי", "107–192", ["petrol", "hybrid"], 5.2, 4, 2025, [C.recalls, "מנעול מושב הנהג נכשל במבחן Euro NCAP 2025: לוודא שבוצע התיקון של היצרן"]),
    ]},
    { id: "s5", make: "mg", model: "S5", he: "S5", body: "suv", segment: "mass", price: [138888, 138888], status: "on_sale", gens: [
      T("Gen1", 2024, null, "חשמלי, סוללה 49.1–64 קוט\"ש", "134–241", ["ev"], 17.0, null, undefined, [C.ev, C.recalls]),
    ]},
    { id: "s6", make: "mg", model: "S6", he: "S6", body: "suv", segment: "mass", price: [168888, 178888], status: "on_sale", gens: [
      T("ES39", 2025, null, "חשמלי, סוללה 77 קוט\"ש, הנעה אחורית או 4X4", "241–356", ["ev"], 19.0, 5, 2025, [C.ev, C.newBrand]),
    ]},
    { id: "s9", make: "mg", model: "S9", he: "S9", body: "suv7", segment: "mass", price: [189888, 198888], status: "on_sale", gens: [
      T("IS31", 2025, null, "1.5 טורבו + מנוע חשמלי, פלאג-אין, סוללה 24.7 קוט\"ש", "295 משולב", ["phev"], 6.3, 5, 2025, [C.phev, C.newBrand], "7 מושבים; עם סוללה ריקה כ-7.6 ל'/100 ק\"מ (מבחן carzone)"),
    ]},
    { id: "cyberster", make: "mg", model: "Cyberster", he: "סייברסטר", body: "sedan", segment: "premium", price: [363888, 393888], status: "on_sale", gens: [
      T("EC32", 2023, null, "חשמלי, סוללה 77 קוט\"ש, הנעה אחורית או 4X4", "340–510", ["ev"], 18.0, null, undefined, [C.ev, C.newBrand], "רודסטר 2 מושבים; בישראל מ-2025"),
    ]},
  ]},

  { id: "mercedes", name: "Mercedes-Benz", he: "מרצדס", models: [
    { id: "a-class", make: "mercedes", model: "A-Class", he: "A-Class", body: "hatch", segment: "premium", price: null, status: "unverified", gens: [
      T("W176", 2013, 2018, "A180 / A200 / A250", "122–211", ["petrol"], 7.0, 5, 2012, [C.history, C.inspect, C.dct]),
      T("W177", 2018, null, "A180 / A200 / A250e", "136–218", ["petrol", "phev"], 6.8, 5, 2018, [C.history, C.dct], "במחירון הנוכחי מופיעה רק גרסת AMG (₪449,900)"),
    ]},
    { id: "c-class", make: "mercedes", model: "C-Class", he: "C-Class", body: "sedan", segment: "premium", price: [359900, 499900], status: "on_sale", gens: [
      T("W204", 2010, 2014, "C180 / C200 / C250", "156–204", ["petrol"], 8.6, 5, 2009, [C.history, C.inspect, C.mbChain]),
      T("W205", 2014, 2021, "C180 / C200 / C300 / C350e", "156–320", ["petrol", "phev"], 7.6, 5, 2014, [C.history, C.inspect, C.airSusp]),
      T("W206", 2021, null, "C200 / C300 מיילד-היברידי / C300e", "204–313", ["petrol", "phev"], 7.0, 5, 2022, [C.history]),
    ]},
    { id: "e-class", make: "mercedes", model: "E-Class", he: "E-Class", body: "sedan", segment: "premium", price: [509900, 749900], status: "on_sale", gens: [
      T("W212", 2010, 2016, "E200 / E250 / E300", "184–252", ["petrol", "diesel"], 9.0, 5, 2009, [C.history, C.inspect, C.mbChain]),
      T("W213", 2016, 2023, "E200 / E300e / E350e", "184–320", ["petrol", "phev"], 8.0, 5, 2016, [C.history, C.airSusp]),
      T("W214", 2024, null, "E200 / E300e", "204–313", ["petrol", "phev"], 7.4, 5, 2023, [C.history]),
    ]},
    { id: "glc", make: "mercedes", model: "GLC", he: "GLC", body: "suv", segment: "premium", price: [489900, 599900], status: "on_sale", gens: [
      T("X253", 2016, 2022, "GLC200 / 250 / 300 / 350e", "197–320", ["petrol", "phev"], 8.8, 5, 2015, [C.history, C.inspect, C.airSusp]),
      T("X254", 2023, null, "GLC200 / GLC300e", "204–313", ["petrol", "phev"], 7.8, 5, 2022, [C.history]),
    ]},
    { id: "gle", make: "mercedes", model: "GLE", he: "GLE", body: "suv", segment: "premium", price: [629900, 829900], status: "on_sale", gens: [
      T("W166 (ML/GLE)", 2012, 2018, "ML350 / GLE400 / GLE500e", "258–442", ["petrol", "diesel", "phev"], 11.0, 5, 2012, [C.history, C.inspect, C.airSusp]),
      T("V167", 2019, null, "GLE350de / 350e / 450", "272–381", ["diesel", "petrol", "phev"], 9.5, 5, 2019, [C.history, C.airSusp]),
    ]},
    { id: "gla", make: "mercedes", model: "GLA", he: "GLA", body: "suv", segment: "premium", price: [359900, 419900], status: "on_sale", gens: [
      T("X156", 2013, 2019, "1.6 / 2.0 טורבו בנזין, דיזל", "107–375", ["petrol", "diesel"], 7.6, null, undefined, [C.history, C.inspect, C.mbChain]),
      T("H247", 2019, null, "1.3 / 2.0 טורבו, 250e פלאג-אין", "114–416", ["petrol", "diesel", "phev"], 7.0, null, undefined, [C.history, C.recalls], "דור חדש (H248) נחשף ביולי 2026"),
    ]},
    { id: "cla", make: "mercedes", model: "CLA", he: "CLA", body: "sedan", segment: "premium", price: [309900, 479900], status: "on_sale", gens: [
      T("C117", 2013, 2019, "1.6 / 2.0 טורבו בנזין, 2.1 דיזל", "109–381", ["petrol", "diesel"], 7.5, null, undefined, [C.history, C.inspect, C.mbChain, C.dct]),
      T("C118", 2019, 2025, "1.3 / 2.0 טורבו בנזין, דיזל, 250e פלאג-אין", "116–420", ["petrol", "diesel", "phev"], 7.0, 5, 2019, [C.history, C.recalls, C.dct]),
      T("C178 / C174", 2025, null, "1.5 טורבו מיילד-היברידי, או חשמלי 58/85 קוט\"ש (800V)", "136–354", ["hybrid", "ev"], 6.5, 5, 2025, [C.recalls], "CLA ₪319,900–419,900; CLA חשמלי ₪309,900–479,900"),
    ]},
    { id: "glb", make: "mercedes", model: "GLB", he: "GLB", body: "suv7", segment: "premium", price: null, status: "discontinued", gens: [
      T("X247", 2019, 2025, "1.3 / 2.0 טורבו בנזין, 2.0 דיזל", "116–306", ["petrol", "diesel"], 7.8, 5, 2019, [C.history, C.recalls]),
      T("Gen2", 2026, null, "1.5 טורבו מיילד-היברידי, או חשמלי 85 קוט\"ש", "135–354", ["hybrid", "ev"], 7.0, null, undefined, [C.recalls], "דור חדש נחשף בדצמבר 2025; לא מופיע במחירון היבואן באוקטובר 2026"),
    ]},
    { id: "eqa", make: "mercedes", model: "EQA", he: "EQA", body: "suv", segment: "premium", price: null, status: "on_sale", gens: [
      T("H243", 2021, null, "חשמלי, סוללה 66.5–70.5 קוט\"ש", "190–292", ["ev"], 18.5, 5, 2019, [C.ev, C.recalls, "ריקול סוללת מתח גבוה (תאי Farasis, סכנת שריפה) בדגמי 2021–2024: לוודא שבוצע עדכון התוכנה"], "מחירי 2026 סותרים בין המקורות (₪299,000–439,900); ממתין לבדיקה"),
    ]},
    { id: "eqb", make: "mercedes", model: "EQB", he: "EQB", body: "suv7", segment: "premium", price: null, status: "unverified", gens: [
      T("X243", 2021, 2026, "חשמלי, סוללה 66.5 קוט\"ש, עד 7 מקומות", "188–288", ["ev"], 19.5, 5, 2019, [C.ev, C.recalls, "ריקול סוללת מתח גבוה (תאי Farasis, סכנת שריפה) בדגמי 2021–2024: לוודא שבוצע עדכון התוכנה"], "מוחלף ב-GLB החשמלי"),
    ]},
    { id: "cle", make: "mercedes", model: "CLE", he: "CLE", body: "sedan", segment: "premium", price: [399900, 519990], status: "on_sale", gens: [
      T("C236", 2023, null, "1.5/2.0 טורבו מיילד-היברידי / 2.0 דיזל / פלאג-אין", "170–449", ["petrol", "diesel", "phev"], 7.5, 5, 2025, [C.history, C.recalls], "קופה; CLE קבריולה (A236) במחירון בנפרד: ₪479,900–559,900"),
    ]},
    { id: "gls", make: "mercedes", model: "GLS", he: "GLS", body: "suv7", segment: "premium", price: null, status: "on_sale", gens: [
      T("X166", 2013, 2019, "3.0 V6 טורבו / 4.7 V8 / 3.0 דיזל", "255–577", ["petrol", "diesel"], 12.5, null, undefined, [C.history, C.inspect, C.airSusp], "נמכר בשם GL עד מתיחת הפנים של 2016"),
      T("X167", 2020, null, "3.0 טורבו מיילד-היברידי / 3.0 דיזל / 4.0 V8", "282–603", ["petrol", "diesel", "hybrid"], 11.0, null, undefined, [C.history, C.recalls, C.airSusp], "מחיר לא מוצג: carzone (₪789,900–1,599,900) ו-cartube (₪1,049,900) לא מסכימים"),
    ]},
    { id: "s-class", make: "mercedes", model: "S-Class", he: "S קלאס", body: "sedan", segment: "premium", price: [899900, 1349900], status: "on_sale", gens: [
      T("W221", 2010, 2013, "3.5 V6 / 4.7–5.5 V8 / V12 / דיזל / S400 היברידי", "201–620", ["petrol", "diesel", "hybrid"], 12.0, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("W222", 2014, 2020, "3.0 V6 / 4.0–4.7 V8 / V12 / דיזל / היברידי / פלאג-אין", "255–621", ["petrol", "diesel", "hybrid", "phev"], 10.5, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("W223", 2021, null, "3.0 טורבו מיילד-היברידי / 4.0 V8 / דיזל / פלאג-אין", "282–791", ["petrol", "diesel", "hybrid", "phev"], 9.5, null, undefined, [C.history, C.recalls, C.airSusp], "מחיר: S Long. מייבאך S ‏₪1,669,900–1,999,900; מתיחת פנים 2026"),
    ]},
    { id: "eqe", make: "mercedes", model: "EQE", he: "EQE", body: "sedan", segment: "premium", price: null, status: "on_sale", gens: [
      T("V295", 2023, null, "חשמלי", "241–677", ["ev"], 20.0, 5, 2022, [C.ev, C.recalls], "סדאן; EQE SUV במחירון בנפרד. מחיר לא מוצג: carzone (₪499,900–649,900) ו-cartube (₪558,900–1,049,900) לא מסכימים"),
    ]},
  ]},

  { id: "bmw", name: "BMW", he: "ב.מ.וו", models: [
    { id: "3-series", make: "bmw", model: "3 Series", he: "סדרה 3", body: "sedan", segment: "premium", price: [369900, 369900], status: "on_sale", gens: [
      T("E90", 2010, 2011, "318i / 320i", "143–170", ["petrol"], 8.6, 5, 2005, [C.history, C.inspect, "נזילות שמן (בית מסנן, מכסה שסתומים)"]),
      T("F30", 2012, 2018, "316i / 320i / 328i / 330e", "136–252", ["petrol", "phev"], 7.6, 5, 2012, [C.history, C.inspect, C.bmwChain]),
      T("G20", 2019, null, "318i / 320i / 330e", "156–292", ["petrol", "phev"], 7.0, 5, 2019, [C.history]),
    ]},
    { id: "1-series", make: "bmw", model: "1 Series", he: "סדרה 1", body: "hatch", segment: "premium", price: [239900, 289900], status: "on_sale", gens: [
      T("E87", 2010, 2011, "116i / 118i", "122–143", ["petrol"], 8.0, 5, 2004, [C.history, C.inspect]),
      T("F20", 2012, 2019, "116i / 118i / 120i", "109–184", ["petrol"], 7.2, 5, 2011, [C.history, C.inspect, C.bmwChain]),
      T("F40", 2020, 2024, "118i / 120i", "136–178", ["petrol"], 6.8, 5, 2019, [C.history, C.dct]),
      T("F70", 2025, null, "120 / 120 מיילד-היברידי", "156–170", ["petrol", "hybrid"], 6.5, null, undefined, [C.recalls]),
    ]},
    { id: "x3", make: "bmw", model: "X3", he: "X3", body: "suv", segment: "premium", price: [424900, 459900], status: "on_sale", gens: [
      T("F25", 2011, 2017, "20i / 28i / 20d", "184–245", ["petrol", "diesel"], 9.2, 5, 2011, [C.history, C.inspect, C.bmwChain]),
      T("G01", 2018, 2024, "20i / 30e", "184–292", ["petrol", "phev"], 8.4, 5, 2017, [C.history]),
      T("G45", 2025, null, "20 / 30e", "208–299", ["petrol", "phev"], 7.6, null, undefined, [C.recalls]),
    ]},
    { id: "x5", make: "bmw", model: "X5", he: "X5", body: "suv", segment: "premium", price: [774900, 774900], status: "on_sale", gens: [
      T("E70", 2010, 2013, "xDrive35i / 30d", "245–306", ["petrol", "diesel"], 12.0, null, undefined, [C.history, C.inspect]),
      T("F15", 2014, 2018, "xDrive35i / 40e", "306–313", ["petrol", "phev"], 10.5, 5, 2013, [C.history, C.inspect, C.airSusp]),
      T("G05", 2019, null, "xDrive40i / 45e / 50e", "340–489", ["petrol", "phev"], 9.5, 5, 2018, [C.history, C.airSusp]),
    ]},
    { id: "i4", make: "bmw", model: "i4", he: "i4", body: "sedan", segment: "premium", price: [494900, 614900], status: "on_sale", gens: [
      T("G26", 2022, null, "eDrive35 / eDrive40 / M50", "286–544", ["ev"], 17.5, 4, 2021, [C.ev]),
    ]},
    { id: "x1", make: "bmw", model: "X1", he: "X1", body: "suv", segment: "premium", price: [319900, 329900], status: "on_sale", gens: [
      T("E84", 2010, 2015, "2.0 טורבו בנזין / דיזל", "114–300", ["petrol", "diesel"], 8.5, 5, 2012, [C.history, C.inspect, C.bmwChain]),
      T("F48", 2015, 2022, "1.5 / 2.0 טורבו, 25e פלאג-אין", "114–228", ["petrol", "diesel", "phev"], 7.4, 5, 2015, [C.history, C.inspect]),
      T("U11", 2022, null, "1.5 / 2.0 טורבו מיילד-היברידי, פלאג-אין, iX1 חשמלי", "122–322", ["petrol", "diesel", "phev", "ev"], 7.0, null, undefined, [C.history, C.recalls], "iX1 החשמלי ₪379,900–409,900"),
    ]},
    { id: "5-series", make: "bmw", model: "5 Series", he: "סדרה 5", body: "sedan", segment: "premium", price: [479900, 555000], status: "on_sale", gens: [
      T("F10", 2010, 2016, "2.0 טורבו (520i/528i), 3.0, היברידי", "141–591", ["petrol", "diesel", "hybrid"], 8.8, 5, 2010, [C.history, C.inspect, C.bmwChain]),
      T("G30", 2016, 2023, "2.0 טורבו, 530e פלאג-אין", "168–616", ["petrol", "diesel", "phev"], 7.5, 5, 2017, [C.history, C.inspect]),
      T("G60", 2023, null, "2.0 מיילד-היברידי, פלאג-אין, i5 חשמלי", "194–717", ["petrol", "diesel", "phev", "ev"], 7.0, null, undefined, [C.history, C.recalls]),
    ]},
    { id: "x2", make: "bmw", model: "X2", he: "X2", body: "suv", segment: "premium", price: [319900, 346900], status: "on_sale", gens: [
      T("F39", 2018, 2023, "1.5 / 2.0 טורבו בנזין, דיזל, 25e פלאג-אין", "114–302", ["petrol", "diesel", "phev"], 7.5, null, undefined, [C.history, C.inspect]),
      T("U10", 2024, null, "1.5 טורבו מיילד-היברידי, 2.0 טורבו; iX2 חשמלי 66.5 קוט\"ש", "150–313", ["petrol", "hybrid", "ev"], 7.0, 5, 2022, [C.history, C.recalls], "iX2 ₪394,900–424,900. התראת בטיחות באירופה (1/2025): ריתוך בסרוו הבלמים ברכבים שיוצרו 7/2022–11/2024"),
    ]},
    { id: "ix3", make: "bmw", model: "iX3", he: "iX3", body: "suv", segment: "premium", price: [434900, 544900], status: "on_sale", gens: [
      T("G08", 2020, 2025, "חשמלי, סוללה 74 קוט\"ש נטו, הנעה אחורית", "286", ["ev"], 19.0, 5, 2017, [C.ev, C.history], "דירוג ה-X3 מ-2017 הוחל על ה-iX3; שנת סיום הייצור לא אומתה"),
      T("NA5 (Neue Klasse)", 2025, null, "חשמלי, סוללה 82.7/108.7 קוט\"ש", "315–463", ["ev"], 17.0, 5, 2026, [C.ev]),
    ]},
    { id: "2-series-gran-coupe", make: "bmw", model: "2 Series Gran Coupé", he: "סדרה 2 גראן קופה", body: "sedan", segment: "premium", price: [294900, 324900], status: "on_sale", gens: [
      T("F44", 2020, 2024, "1.5 טורבו / 2.0 טורבו", "109–302", ["petrol"], 6.8, 5, 2019, [C.history, C.inspect], "דירוג Euro NCAP של סדרה 1 (2019) הוחל על הדגם"),
      T("F74", 2024, null, "1.5 טורבו מיילד-היברידי / 2.0 טורבו", "170–300", ["petrol"], 6.5, 4, 2025, [C.recalls]),
    ]},
    { id: "x6", make: "bmw", model: "X6", he: "X6", body: "suv", segment: "premium", price: [599900, 649900], status: "on_sale", gens: [
      T("E71", 2010, 2014, "3.0 דיזל / 3.0 טורבו / 4.4 V8", "232–547", ["diesel", "petrol"], 11.5, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("F16", 2014, 2019, "3.0 דיזל / 3.0 טורבו / 4.4 V8", "255–567", ["diesel", "petrol"], 10.0, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("G06", 2019, null, "3.0 דיזל / 3.0 טורבו מיילד-היברידי", "286–617", ["diesel", "petrol"], 8.5, null, undefined, [C.history, C.recalls, C.airSusp], "xDrive30d: 286 כ\"ס במחירון הישראלי; מתיחת פנים 2023"),
    ]},
    { id: "x7", make: "bmw", model: "X7", he: "X7", body: "suv7", segment: "premium", price: [940000, 940000], status: "on_sale", gens: [
      T("G07", 2019, null, "3.0 טורבו בנזין / 3.0 דיזל / 4.4 V8 (מיילד-היברידי מ-2022)", "261–523", ["petrol", "diesel", "hybrid"], 11.5, null, undefined, [C.history, C.recalls, C.airSusp], "מתיחת פנים 2022"),
    ]},
    { id: "4-series", make: "bmw", model: "4 Series", he: "סדרה 4", body: "sedan", segment: "premium", price: [409000, 575000], status: "on_sale", gens: [
      T("F32", 2014, 2020, "2.0 / 3.0 טורבו בנזין, 2.0 / 3.0 דיזל", "134–322", ["petrol", "diesel"], 7.5, null, undefined, [C.history, C.inspect, C.bmwChain], "קופה (F32), קבריולה (F33), גראן קופה (F36)"),
      T("G22", 2021, null, "2.0 טורבו בנזין / 2.0–3.0 דיזל / M440i מיילד-היברידי", "181–382", ["petrol", "diesel", "hybrid"], 7.0, 5, 2019, [C.history, C.recalls], "דירוג Euro NCAP לקופה, מבוסס על סדרה 3 (2019). במחירון: קופה ₪409,000–505,000, גראן קופה ₪455,000, קבריולה ₪495,000–575,000; i4 החשמלי בנפרד"),
    ]},
    { id: "7-series", make: "bmw", model: "7 Series", he: "סדרה 7", body: "sedan", segment: "premium", price: [899900, 1315900], status: "on_sale", gens: [
      T("F01", 2010, 2015, "3.0 טורבו / 4.4 V8 / V12 / 3.0 דיזל / ActiveHybrid", "241–536", ["petrol", "diesel", "hybrid"], 11.0, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("G11", 2016, 2022, "2.0 / 3.0 טורבו / 4.4 V8 / V12 / דיזל / פלאג-אין", "228–601", ["petrol", "diesel", "phev"], 9.5, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("G70", 2023, null, "3.0 טורבו מיילד-היברידי / דיזל / פלאג-אין / i7 חשמלי", "286–650", ["petrol", "diesel", "hybrid", "phev", "ev"], 9.0, null, undefined, [C.history, C.recalls, C.airSusp], "מחיר: 7 Long ‏₪899,900–1,059,900 ו-i7 ‏₪1,315,900; צריכה לגרסאות הבנזין"),
    ]},
  ]},

  { id: "audi", name: "Audi", he: "אאודי", models: [
    { id: "a3", make: "audi", model: "A3", he: "A3", body: "hatch", segment: "premium", price: [227900, 298900], status: "on_sale", gens: [
      T("8P", 2010, 2012, "1.4 / 1.8 TFSI", "125–160", ["petrol"], 7.8, 5, 2003, [C.history, C.inspect, C.ea888, C.dsgDry]),
      T("8V", 2013, 2020, "1.0 / 1.2 / 1.4 TFSI", "110–150", ["petrol"], 6.5, 5, 2012, [C.history, C.inspect, C.dsgDry]),
      T("8Y", 2021, null, "1.0 / 1.5 TFSI", "110–150", ["petrol"], 6.3, 5, 2020, [C.history, C.dsgDry]),
    ]},
    { id: "a4", make: "audi", model: "A4", he: "A4", body: "sedan", segment: "premium", price: null, status: "discontinued", gens: [
      T("B8", 2010, 2015, "1.8 / 2.0 TFSI", "160–211", ["petrol"], 8.4, 5, 2008, [C.history, C.inspect, C.ea888]),
      T("B9", 2016, 2024, "1.4 / 2.0 TFSI", "150–252", ["petrol"], 7.4, 5, 2015, [C.history, C.inspect], "הוחלף ב-A5 החדשה (₪369,100–519,000)"),
    ]},
    { id: "q3", make: "audi", model: "Q3", he: "Q3", body: "suv", segment: "premium", price: [318900, 373000], status: "on_sale", gens: [
      T("8U", 2012, 2018, "1.4 / 2.0 TFSI", "150–211", ["petrol"], 8.2, 5, 2011, [C.history, C.inspect, C.ea888]),
      T("F3", 2019, 2025, "1.5 / 2.0 TFSI", "150–230", ["petrol"], 7.4, 5, 2018, [C.history, C.dsgDry]),
      T("Gen3", 2025, null, "1.5 TFSI / פלאג-אין", "150–272", ["petrol", "phev"], 7.0, null, undefined, [C.recalls]),
    ]},
    { id: "q5", make: "audi", model: "Q5", he: "Q5", body: "suv", segment: "premium", price: [400000, 548900], status: "on_sale", gens: [
      T("8R", 2010, 2017, "2.0 TFSI", "211–225", ["petrol"], 9.6, 5, 2008, [C.history, C.inspect, C.ea888]),
      T("FY", 2017, 2024, "2.0 TFSI / פלאג-אין", "252–367", ["petrol", "phev"], 8.4, 5, 2017, [C.history]),
      T("Gen3", 2025, null, "2.0 TFSI / פלאג-אין", "204–367", ["petrol", "phev"], 7.8, null, undefined, [C.recalls]),
    ]},
    { id: "q8-e-tron", make: "audi", model: "Q8 e-tron", he: "Q8 e-tron", body: "suv", segment: "premium", price: null, status: "discontinued", gens: [
      T("GE (e-tron)", 2019, 2022, "סוללה 71/95 קוט\"ש", "313–408", ["ev"], 24.0, 5, 2019, [C.ev, C.airSusp]),
      T("GE (Q8 e-tron)", 2023, 2025, "סוללה 89/114 קוט\"ש", "340–503", ["ev"], 22.0, 5, 2019, [C.ev, C.airSusp], "הדגם הופסק בשנת 2025"),
    ]},
    { id: "q7", make: "audi", model: "Q7", he: "Q7", body: "suv7", segment: "premium", price: [689900, 740900], status: "on_sale", gens: [
      T("4L", 2010, 2015, "3.0 TFSI / 3.0 TDI", "237–493", ["petrol", "diesel"], 12.5, 4, 2006, [C.history, C.inspect, C.airSusp]),
      T("4M", 2015, null, "3.0 TFSI / TDI, TFSI e פלאג-אין", "215–500", ["petrol", "diesel", "phev"], 10.5, null, undefined, [C.history, C.inspect, C.airSusp], "דור 3 נחשף ביוני 2026"),
    ]},
    { id: "q4-etron", make: "audi", model: "Q4 e-tron", he: "Q4 e-tron", body: "suv", segment: "premium", price: [299000, 359900], status: "on_sale", gens: [
      T("F4", 2021, null, "חשמלי, סוללה 52/59/77 קוט\"ש", "168–335", ["ev"], 19.0, 5, 2025, [C.ev, C.recalls], "Q4 ₪299,000–339,900; Q4 ספורטבק ₪319,000–359,900. מתיחת פנים 2026"),
    ]},
    { id: "a5", make: "audi", model: "A5", he: "A5", body: "sedan", segment: "premium", price: [369100, 519000], status: "on_sale", gens: [
      T("B8 (8T)", 2010, 2016, "1.8 / 2.0 / 3.0 TFSI בנזין, TDI דיזל", "136–450", ["petrol", "diesel"], 8.5, null, undefined, [C.history, C.inspect, C.ea888]),
      T("F5 (B9)", 2016, 2024, "2.0 TFSI, 2.0 / 3.0 TDI", "190–450", ["petrol", "diesel"], 7.5, null, undefined, [C.history, C.inspect]),
      T("B10", 2024, null, "2.0 TFSI מיילד-היברידי, TFSI e פלאג-אין", "150–639", ["petrol", "hybrid", "phev"], 7.0, 5, 2024, [C.history, C.recalls], "מחליף את A4; בישראל 40 TFSI ופלאג-אין 50/55 TFSI e"),
    ]},
    { id: "q8", make: "audi", model: "Q8", he: "Q8", body: "suv", segment: "premium", price: [726200, 822000], status: "on_sale", gens: [
      T("4M", 2018, null, "3.0 TFSI / TDI מיילד-היברידי, TFSI e פלאג-אין", "230–640", ["petrol", "diesel", "hybrid", "phev"], 11.0, 5, 2019, [C.history, C.inspect, C.airSusp]),
    ]},
    { id: "q6-e-tron", make: "audi", model: "Q6 e-tron", he: "Q6 e-tron", body: "suv", segment: "premium", price: [404900, 559900], status: "on_sale", gens: [
      T("PPE", 2024, null, "חשמלי, סוללה 83/100 קוט\"ש", "248–510", ["ev"], 19.0, 5, 2024, [C.ev, C.recalls], "כולל Q6 e-tron Sportback (₪424,900–559,900)"),
    ]},
    { id: "q2", make: "audi", model: "Q2", he: "Q2", body: "suv", segment: "premium", price: [230500, 230500], status: "on_sale", gens: [
      T("GA", 2016, null, "1.0/1.5 TFSI", "116–150", ["petrol"], 6.5, 5, 2016, [C.history, C.inspect, C.dsgDry], "הייצור הסתיים באפריל 2026 בלי דור המשך; במחירון עדיין גרסה אחת"),
    ]},
    { id: "a6", make: "audi", model: "A6", he: "A6", body: "sedan", segment: "premium", price: null, status: "on_sale", gens: [
      T("C7", 2011, 2018, "2.0 TFSI / 2.8 FSI / 3.0 TFSI / היברידי", "180–310", ["petrol", "hybrid"], 8.5, 5, 2011, [C.history, C.inspect, C.ea888]),
      T("C8", 2018, 2025, "2.0 TFSI מיילד-היברידי / פלאג-אין", "245–367", ["petrol", "phev"], 7.8, 5, 2018, [C.history, C.recalls]),
      T("C9", 2025, null, "2.0 TFSI / 3.0 TFSI / פלאג-אין", "204–367", ["petrol", "phev"], 7.5, 5, 2024, [C.recalls], "מחיר לא מוצג: carzone (₪484,000–629,000) ו-cartube (₪467,000–611,000) לא מסכימים. A6 e-tron החשמלי הוא דגם נפרד"),
    ]},
    { id: "a6-e-tron", make: "audi", model: "A6 e-tron", he: "A6 e-tron", body: "sedan", segment: "premium", price: [532600, 659600], status: "on_sale", gens: [
      T("PPE", 2025, null, "חשמלי (פלטפורמת PPE)", "282–496", ["ev"], 18.0, 5, 2025, [C.ev, C.recalls], "קוד הדור אינו מופיע בוויקיפדיה (PPE = שם הפלטפורמה). מחיר: Sportback; S6 e-tron ‏₪869,600–884,900"),
    ]},
  ]},
  // ── Catalog expansion 2026-10-20: prices from cartube.co.il / carzone.co.il brand price lists, generations and engines
  //    from English Wikipedia model pages, Euro NCAP only where euroncap.com or Wikipedia states the stars (see DATA_UPDATES.md).
  { id: "nissan", name: "Nissan", he: "ניסאן", models: [
    { id: "qashqai", make: "nissan", model: "Qashqai", he: "קשקאי", body: "suv", segment: "mass", price: [178990, 231990], status: "on_sale", gens: [
      T("J10", 2010, 2013, "2.0 בנזין / 1.6 dCi דיזל", "131–140", ["petrol", "diesel"], 8.5, null, undefined, [C.history, C.inspect, C.cvt]),
      T("J11", 2014, 2021, "1.2 / 1.3 / 1.6 DIG-T טורבו, 1.5 / 1.6 dCi דיזל", "110–163", ["petrol", "diesel"], 7.2, 5, 2014, [C.history, C.inspect, "1.2 DIG-T (2012–2016): צריכת שמן מוגברת; לבדוק רישום הוספות שמן", "בגרסה עם CVT: " + C.cvt, "דיזל בנסיעות קצרות: לבדוק מסנן חלקיקים (DPF) ו-EGR"]),
      T("J12", 2021, null, "1.3 טורבו מיילד-היברידי / 1.5 e-Power", "140–190", ["petrol", "hybrid"], 6.4, 4, 2025, [C.history, C.recalls, "בגרסת e-Power: " + C.hyHybrid], "ב-2021 קיבל 5 כוכבים; בבדיקה החוזרת (2025) 4 כוכבים"),
    ]},
    { id: "juke", make: "nissan", model: "Juke", he: "ג'וק", body: "suv", segment: "mass", price: [146990, 165990], status: "on_sale", gens: [
      T("F15", 2011, 2019, "1.6 בנזין / 1.6 DIG-T טורבו", "94–190", ["petrol"], 7.8, 5, 2011, [C.history, C.inspect, C.cvt]),
      T("F16", 2020, null, "1.0 DIG-T טורבו / 1.6 היברידי (מ-2022)", "114–143", ["petrol", "hybrid"], 6.2, 5, 2019, [C.history, C.recalls, "בגרסת 1.0 טורבו: " + C.dct]),
    ]},
    { id: "x-trail", make: "nissan", model: "X-Trail", he: "אקס-טרייל", body: "suv7", segment: "mass", price: [209990, 239990], status: "on_sale", gens: [
      T("T31", 2010, 2014, "2.0 / 2.5 בנזין, 2.0 dCi דיזל", "150–177 (דיזל)", ["petrol", "diesel"], 9.5, null, undefined, [C.history, C.inspect, C.cvt]),
      T("T32", 2014, 2022, "1.6 / 1.3 DIG-T בנזין, 1.6 / 1.7 / 2.0 dCi דיזל", "130–177", ["petrol", "diesel"], 7.8, 5, 2014, [C.history, C.inspect, C.cvt]),
      T("T33", 2022, null, "1.5 VC-Turbo מיילד-היברידי / e-Power", "163–213", ["petrol", "hybrid"], 7.4, 5, 2021, [C.history, C.recalls, "בגרסת e-Power: " + C.hyHybrid]),
    ]},
    { id: "micra", make: "nissan", model: "Micra", he: "מיקרה", body: "city", segment: "mass", price: null, status: "discontinued", gens: [
      T("K13", 2011, 2017, "1.2 בנזין / 1.2 DIG-S", "80–98", ["petrol"], 6.3, 4, 2010, [C.history, C.inspect, "בגרסה עם CVT: " + C.cvt]),
      T("K14", 2017, 2025, "1.0 / 0.9 טורבו בנזין, 1.5 dCi", "71–101", ["petrol", "diesel"], 6.0, 4, 2017, [C.history, C.inspect], "4 כוכבים בסיסי, 5 עם חבילת בטיחות; הדור החשמלי (2025) לא במחירון בישראל"),
    ]},
    { id: "sentra", make: "nissan", model: "Sentra", he: "סנטרה", body: "sedan", segment: "mass", price: [154990, 156990], status: "on_sale", gens: [
      T("B17", 2013, 2019, "1.8 בנזין / 1.6 טורבו", "130–188", ["petrol"], 7.5, null, undefined, [C.history, C.inspect, C.cvt]),
      T("B18", 2020, 2025, "2.0 בנזין, CVT", "149", ["petrol"], 7.2, null, undefined, [C.history, C.cvt, C.recalls]),
      T("B19", 2025, null, "2.0 בנזין, CVT", "149", ["petrol"], 7.0, null, undefined, [C.cvt, C.recalls], "לא נבחן ב-Euro NCAP"),
    ]},
    { id: "leaf", make: "nissan", model: "Leaf", he: "ליף", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("ZE0/AZE0", 2011, 2017, "חשמלי, סוללה 24 / 30 קוט\"ש", "110", ["ev"], 17.0, null, undefined, [C.ev, "סוללה בקירור אוויר פסיבי: לבדוק אובדן קיבולת, במיוחד אחרי טעינות מהירות רבות או חום"]),
      T("ZE1", 2018, 2024, "חשמלי, סוללה 40 / 62 קוט\"ש", "147–214", ["ev"], 17.0, null, undefined, [C.ev, "סוללה בקירור אוויר פסיבי: לבדוק אובדן קיבולת, במיוחד אחרי טעינות מהירות רבות או חום"]),
      T("Gen3", 2025, null, "חשמלי, סוללה 52 / 75 קוט\"ש", "174–214", ["ev"], 16.0, null, undefined, [C.ev], "לא במחירון היבואן בישראל"),
    ]},
    { id: "note", make: "nissan", model: "Note", he: "נוט", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("E11", 2010, 2013, "1.4 / 1.6 בנזין, 1.5 dCi", "88–110", ["petrol", "diesel"], 7.0, null, undefined, [C.history, C.inspect]),
      T("E12", 2013, 2017, "1.2 / 1.2 DIG-S בנזין, 1.5 dCi", "80–98", ["petrol", "diesel"], 6.0, null, undefined, [C.history, C.inspect, "בגרסה עם CVT: " + C.cvt], "באירופה הוחלף במיקרה K14"),
    ]},
  ]},

  { id: "ford", name: "Ford", he: "פורד", models: [
    { id: "focus", make: "ford", model: "Focus", he: "פוקוס", body: "wagon", segment: "mass", price: [165900, 165900], status: "on_sale", gens: [
      T("Mk3 (C346)", 2011, 2018, "1.0 / 1.5 / 1.6 EcoBoost, 1.6 בנזין, 1.5 / 1.6 TDCi", "85–250", ["petrol", "diesel"], 7.4, 5, 2011, [C.history, C.inspect, "תיבת PowerShift כפולת מצמד: לבדוק רעידות בזחילה ובהתחלת נסיעה", "מנוע 1.0 EcoBoost: רצועת תזמון טבולה בשמן; לוודא החלפה לפי תוכנית היצרן", "1.6 EcoBoost: קריאת שירות (2017) על קירור לקוי וסכנת שריפה, לוודא ביצוע"]),
      T("Mk4 (C519)", 2019, null, "1.0 EcoBoost (גם מיילד-היברידי) / 1.5 EcoBoost, 1.5 EcoBlue דיזל", "100–182", ["petrol", "hybrid", "diesel"], 6.9, 5, 2019, [C.history, C.recalls, "מנוע 1.0 EcoBoost: רצועת תזמון טבולה בשמן; לוודא החלפה לפי תוכנית היצרן", "בגרסה עם תיבה כפולת מצמד: " + C.dct], "הייצור הופסק בנובמבר 2025; בישראל משווקת גרסת הסטיישן בלבד"),
    ]},
    { id: "kuga", make: "ford", model: "Kuga", he: "קוגה", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("Gen1", 2010, 2012, "2.0 TDCi דיזל", "136–163", ["diesel"], 8.5, null, undefined, [C.history, C.inspect]),
      T("Gen2", 2013, 2019, "1.5 / 1.6 / 2.0 EcoBoost, 2.0 TDCi", "140–242", ["petrol", "diesel"], 9.0, 5, 2012, [C.history, C.inspect, "1.6 EcoBoost (2012–2014): קריאת שירות על התחממות וסכנת שריפה, לוודא ביצוע"]),
      T("Gen3", 2020, null, "1.5 EcoBoost, 2.5 היברידי / פלאג-אין, דיזל", "120–240", ["petrol", "hybrid", "phev", "diesel"], 6.5, 5, 2019, [C.history, C.recalls, "בפלאג-אין: לוודא החלפת סוללה במסגרת קריאת השירות של 2020"]),
    ]},
    { id: "puma", make: "ford", model: "Puma", he: "פומה", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("Gen1", 2020, null, "1.0 EcoBoost מיילד-היברידי", "125–155", ["hybrid", "petrol"], 6.3, 5, 2019, [C.history, "מנוע 1.0 EcoBoost: רצועת תזמון טבולה בשמן; לוודא החלפה לפי תוכנית היצרן", "בגרסה עם תיבה כפולת מצמד: " + C.dct], "Euro NCAP בדק שוב ב-2022: 4 כוכבים"),
    ]},
    { id: "fiesta", make: "ford", model: "Fiesta", he: "פיאסטה", body: "city", segment: "mass", price: null, status: "discontinued", gens: [
      T("Mk6", 2010, 2017, "1.25 / 1.4 / 1.6 בנזין, 1.0 EcoBoost, דיזל", "60–200", ["petrol", "diesel"], 6.5, 5, 2012, [C.history, C.inspect, "תיבת PowerShift כפולת מצמד: לבדוק רעידות בזחילה ובהתחלת נסיעה", "מנוע 1.0 EcoBoost: רצועת תזמון טבולה בשמן; לוודא החלפה לפי תוכנית היצרן"]),
      T("Mk7", 2017, 2023, "1.1 בנזין / 1.0 EcoBoost (גם מיילד-היברידי), 1.5 TDCi", "70–200", ["petrol", "hybrid", "diesel"], 6.0, 5, 2017, [C.history, "מנוע 1.0 EcoBoost: רצועת תזמון טבולה בשמן; לוודא החלפה לפי תוכנית היצרן"], "הייצור הופסק ביולי 2023"),
    ]},
    { id: "explorer", make: "ford", model: "Explorer", he: "אקספלורר", body: "suv7", segment: "mass", price: [369900, 429900], status: "on_sale", gens: [
      T("U502", 2011, 2019, "2.0 / 2.3 EcoBoost, 3.5 V6, 3.5 EcoBoost", "240–365", ["petrol"], 12.5, null, undefined, [C.history, C.inspect]),
      T("U625", 2020, null, "2.3 / 3.0 EcoBoost, היברידי / פלאג-אין", "285–450", ["petrol", "hybrid", "phev"], 12.0, 5, 2019, [C.history, C.recalls], "בישראל 2.3 טורבו 300 כ\"ס או ST 400 כ\"ס; Explorer החשמלי (2024) הוא דגם אחר"),
    ]},
    { id: "ranger", make: "ford", model: "Ranger", he: "ריינג'ר", body: "pickup", segment: "mass", price: [294000, 490000], status: "on_sale", gens: [
      T("T6 (PX)", 2012, 2022, "2.2 / 3.2 TDCi, 2.0 EcoBlue דיזל", "118–210", ["diesel"], 10.0, null, undefined, [C.history, C.inspect, "רכב עבודה: לבדוק בלאי ארגז, וו גרירה ותחתית"]),
      T("P703", 2022, null, "2.0 EcoBlue דיזל, 3.0 V6 טורבו בנזין (Raptor), פלאג-אין", "170–292", ["diesel", "petrol", "phev"], 10.0, 5, 2022, [C.history, C.recalls, "רכב עבודה: לבדוק בלאי ארגז, וו גרירה ותחתית"], "בישראל: דיזל 2.0 170 כ\"ס, Raptor 292 כ\"ס"),
    ]},
    { id: "bronco", make: "ford", model: "Bronco", he: "ברונקו", body: "suv", segment: "mass", price: [399900, 629000], status: "on_sale", gens: [
      T("U725", 2021, null, "2.3 / 2.7 / 3.0 EcoBoost", "300–400", ["petrol"], 13.0, null, undefined, [C.history, C.recalls, "שימוש בשטח: לבדוק תחתית, מתלים ומערכת 4X4"]),
    ]},
    { id: "mustang", make: "ford", model: "Mustang", he: "מוסטנג", body: "sedan", segment: "premium", price: [445000, 505000], status: "on_sale", gens: [
      T("S197", 2010, 2014, "3.7 / 4.0 V6, 4.6 / 5.0 V8", "210–662", ["petrol"], 13.5, null, undefined, [C.history, C.inspect]),
      T("S550", 2015, 2023, "2.3 EcoBoost, 5.0 V8", "305–760", ["petrol"], 12.0, 3, 2017, [C.history, C.inspect], "ב-2017 קיבל 2 כוכבים, ו-3 אחרי עדכון עם בלימת חירום"),
      T("S650", 2024, null, "5.0 V8 (בישראל), 2.3 EcoBoost", "315–500", ["petrol"], 13.0, null, undefined, [C.recalls], "בישראל רק V8 480–486 כ\"ס"),
    ]},
  ]},

  { id: "renault", name: "Renault", he: "רנו", models: [
    { id: "clio", make: "renault", model: "Clio", he: "קליאו", body: "city", segment: "mass", price: [124990, 126990], status: "on_sale", gens: [
      T("Clio III", 2010, 2014, "1.2 / 1.4 / 1.6 בנזין, 1.5 dCi", "68–135", ["petrol", "diesel"], 7.0, 5, 2005, [C.history, C.inspect]),
      T("Clio IV", 2012, 2019, "0.9 / 1.2 TCe טורבו, 1.2 16V, 1.5 dCi", "75–120", ["petrol", "diesel"], 6.4, 5, 2012, [C.history, C.inspect, "1.2 TCe (2012–2016): צריכת שמן מוגברת שעלולה לפגוע בשסתומים; לבדוק רישום הוספות שמן", "בגרסה עם תיבת EDC: " + C.dct]),
      T("Clio V", 2019, null, "1.0 TCe טורבו / 1.6 E-Tech היברידי", "90–145", ["petrol", "hybrid"], 6.0, 5, 2019, [C.history, C.recalls], "בישראל משווק דור 5 במתיחת פנים (1.0 טורבו, 90 כ\"ס); דור 6 הושק באירופה ב-2025"),
    ]},
    { id: "captur", make: "renault", model: "Captur", he: "קפצ'ור", body: "suv", segment: "mass", price: [151990, 151990], status: "on_sale", gens: [
      T("J87", 2013, 2019, "0.9 / 1.2 TCe טורבו, 1.5 dCi", "90–118", ["petrol", "diesel"], 6.8, 5, 2013, [C.history, C.inspect, "1.2 TCe (2012–2016): צריכת שמן מוגברת שעלולה לפגוע בשסתומים; לבדוק רישום הוספות שמן", "בגרסה עם תיבת EDC: " + C.dct]),
      T("Gen2 (CMF-B)", 2020, null, "1.0 / 1.3 TCe טורבו, E-Tech היברידי / פלאג-אין", "100–160", ["petrol", "hybrid", "phev"], 6.3, 5, 2019, [C.history, C.recalls], "מתיחת הפנים (2024) קיבלה 4 כוכבים ב-Euro NCAP"),
    ]},
    { id: "megane", make: "renault", model: "Megane", he: "מגאן", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("Megane III", 2010, 2016, "1.2 / 1.4 / 1.6 / 2.0 בנזין וטורבו, 1.5 dCi", "85–273", ["petrol", "diesel"], 7.2, null, undefined, [C.history, C.inspect, "1.2 TCe (2012–2016): צריכת שמן מוגברת שעלולה לפגוע בשסתומים; לבדוק רישום הוספות שמן", "בגרסה עם תיבת EDC: " + C.dct]),
      T("Megane IV", 2016, 2024, "1.2 / 1.3 TCe טורבו, 1.5 dCi, 1.6 E-Tech פלאג-אין", "89–280", ["petrol", "diesel", "phev"], 6.6, null, undefined, [C.history, C.inspect, "בגרסה עם תיבת EDC: " + C.dct], "ייצור ההאצ'בק הופסק באפריל 2024; לא במחירון היבואן"),
    ]},
    { id: "arkana", make: "renault", model: "Arkana", he: "ארקנה", body: "suv", segment: "mass", price: [161990, 180990], status: "on_sale", gens: [
      T("Gen1 (CMF-B)", 2021, null, "1.3 טורבו מיילד-היברידי / 1.6 E-Tech היברידי", "143–158", ["petrol", "hybrid"], 6.5, 5, 2019, [C.history, C.recalls, "תיבת EDC: " + C.dct]),
    ]},
    { id: "austral", make: "renault", model: "Austral", he: "אוסטרל", body: "suv", segment: "mass", price: [179990, 187990], status: "on_sale", gens: [
      T("HHN", 2023, null, "1.3 טורבו מיילד-היברידי / 1.2 E-Tech היברידי", "130–203", ["petrol", "hybrid"], 6.6, 5, 2022, [C.history, C.recalls]),
    ]},
    { id: "renault-5", make: "renault", model: "5 E-Tech", he: "5 E-Tech", body: "city", segment: "mass", price: [168999, 176990], status: "on_sale", gens: [
      T("R5E", 2024, null, "חשמלי, סוללה 40 / 52 קוט\"ש", "95–150", ["ev"], 15.0, 4, 2024, [C.ev, C.recalls]),
    ]},
    { id: "symbioz", make: "renault", model: "Symbioz", he: "סימביוז", body: "suv", segment: "mass", price: [159990, 166990], status: "on_sale", gens: [
      T("Gen1", 2024, null, "1.6 / 1.8 E-Tech היברידי, 1.3 מיילד-היברידי", "140–170", ["hybrid", "petrol"], 5.6, 4, 2024, [C.hyHybrid, C.recalls], "בישראל 1.8 היברידי 160 כ\"ס; מבחן דרך ב-carzone: 16–18 ק\"מ לליטר"),
    ]},
  ]},

  { id: "dacia", name: "Dacia", he: "דאצ'יה", models: [
    { id: "duster", make: "dacia", model: "Duster", he: "דאסטר", body: "suv", segment: "mass", price: [139990, 170990], status: "on_sale", gens: [
      T("Gen1", 2010, 2017, "1.6 בנזין, 1.2 TCe, 1.5 dCi", "85–125", ["petrol", "diesel"], 8.0, 3, 2011, [C.history, C.inspect, "1.2 TCe (2012–2016): צריכת שמן מוגברת שעלולה לפגוע בשסתומים; לבדוק רישום הוספות שמן", "גרסת 4X4: לבדוק תחתית ומערכת ההנעה"]),
      T("Gen2", 2018, 2024, "1.0 / 1.3 TCe טורבו, 1.6 בנזין, 1.5 dCi", "90–150", ["petrol", "diesel"], 7.3, 3, 2017, [C.history, C.inspect, "גרסת 4X4: לבדוק תחתית ומערכת ההנעה"]),
      T("Gen3", 2024, null, "1.2 טורבו מיילד-היברידי / 1.6–1.8 היברידי", "130–155", ["petrol", "hybrid"], 6.5, 3, 2024, [C.history, C.recalls], "הגרסה הזולה (₪139,990) היא 1.2 טורבו; carzone ו-cartube חלוקים על כוח ההיברידי 1.8 (140 / 155 כ\"ס)"),
    ]},
    { id: "sandero", make: "dacia", model: "Sandero", he: "סנדרו", body: "city", segment: "mass", price: [121990, 121990], status: "on_sale", gens: [
      T("Sandero I", 2010, 2012, "1.2 / 1.4 / 1.6 בנזין, 1.5 dCi", "70–112", ["petrol", "diesel"], 7.0, 3, 2008, [C.history, C.inspect]),
      T("Sandero II", 2013, 2020, "0.9 TCe / 1.0 / 1.2 בנזין, 1.5 dCi", "73–90", ["petrol", "diesel"], 6.5, 4, 2013, [C.history, C.inspect]),
      T("Sandero III", 2021, null, "1.0 TCe טורבו (ידנית או CVT), 1.0 ECO-G", "65–110", ["petrol"], 6.4, 2, 2021, [C.history, C.recalls, "בגרסה עם CVT: " + C.cvt], "בישראל משווק רק סנדרו סטפוויי; הדירוג (2 כוכבים) הוא של הסטפוויי"),
    ]},
    { id: "jogger", make: "dacia", model: "Jogger", he: "ג'וגר", body: "mpv", segment: "mass", price: [174990, 174990], status: "on_sale", gens: [
      T("Gen1", 2022, null, "1.0 TCe טורבו / 1.6–1.8 היברידי", "110–155", ["petrol", "hybrid"], 6.3, 1, 2021, [C.history, C.recalls], "7 מושבים"),
    ]},
    { id: "bigster", make: "dacia", model: "Bigster", he: "ביגסטר", body: "suv", segment: "mass", price: [167990, 190990], status: "on_sale", gens: [
      T("R1310", 2025, null, "1.8 היברידי, 1.2 היברידי 4X4, 1.2 טורבו", "130–155", ["hybrid", "petrol"], 6.8, 3, 2024, [C.history, C.recalls], "מבחן דרך ב-carzone: כ-14 ק\"מ לליטר"),
    ]},
    { id: "logan", make: "dacia", model: "Logan", he: "לוגן", body: "sedan", segment: "mass", price: [127990, 127990], status: "on_sale", gens: [
      T("Logan I", 2010, 2012, "1.4 / 1.6 בנזין, 1.5 dCi", "65–105", ["petrol", "diesel"], 7.0, null, undefined, [C.history, C.inspect]),
      T("Logan II", 2013, 2020, "0.9 TCe / 1.2 בנזין, 1.5 dCi", "75–90", ["petrol", "diesel"], 6.5, null, undefined, [C.history, C.inspect]),
      T("Logan III", 2021, null, "1.0 טורבו בנזין", "91", ["petrol"], 6.3, 2, 2021, [C.history, C.recalls]),
    ]},
  ]},

  { id: "honda", name: "Honda", he: "הונדה", models: [
    { id: "civic", make: "honda", model: "Civic", he: "סיוויק", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("FN/FK/FD (דור 8)", 2010, 2011, "1.4 / 1.8 i-VTEC בנזין, 1.3 היברידי (IMA)", "100–142", ["petrol", "hybrid"], 7.4, null, undefined, [C.history, C.inspect, "בגרסת ההיברידי: סוללת IMA נוטה לאבד קיבולת; לבדוק תקינות"]),
      T("FK (דור 9)", 2012, 2016, "1.4 / 1.8 בנזין, 1.6 / 2.2 i-DTEC", "100–150", ["petrol", "diesel"], 7.3, null, undefined, [C.history, C.inspect, C.recalls]),
      T("FK7 (דור 10)", 2017, 2021, "1.0 / 1.5 טורבו בנזין, 1.6 i-DTEC", "118–180", ["petrol", "diesel"], 6.9, 5, 2017, [C.history, C.inspect, "מנוע 1.5 טורבו (2016–2018): דילול שמן בדלק; לבדוק מפלס וריח דלק בשמן", "בגרסה עם CVT: " + C.cvt]),
      T("FL (דור 11)", 2022, null, "2.0 e:HEV היברידי", "181 (מנוע חשמלי)", ["hybrid"], 5.0, 5, 2022, [C.hyHybrid, C.recalls], "לא משווק עוד בישראל (cartube)"),
    ]},
    { id: "jazz", make: "honda", model: "Jazz", he: "ג'אז", body: "city", segment: "mass", price: [148900, 159900], status: "on_sale", gens: [
      T("GE", 2010, 2014, "1.2 / 1.5 בנזין, 1.3 היברידי (מ-2011)", "90–118", ["petrol", "hybrid"], 6.3, null, undefined, [C.history, C.inspect]),
      T("GK", 2015, 2020, "1.3 / 1.5 בנזין, 1.5 היברידי", "98–135", ["petrol", "hybrid"], 6.0, null, undefined, [C.history, C.inspect, "בגרסה עם CVT: " + C.cvt]),
      T("GR", 2020, null, "1.5 e:HEV היברידי", "109", ["hybrid"], 4.8, 5, 2020, [C.hyHybrid, C.history]),
    ]},
    { id: "hr-v", make: "honda", model: "HR-V", he: "HR-V", body: "suv", segment: "mass", price: [184900, 199990], status: "on_sale", gens: [
      T("RU", 2015, 2021, "1.5 i-VTEC בנזין, 1.6 i-DTEC", "118–130", ["petrol", "diesel"], 7.0, 5, 2015, [C.history, C.inspect, C.cvt]),
      T("RV", 2022, null, "1.5 e:HEV היברידי", "131", ["hybrid"], 5.4, 4, 2022, [C.hyHybrid, C.recalls], "בעמוד המותג ב-carzone ‏₪184,900–199,990 וב-cartube ‏₪184,900–199,900; גרסת Advance Style ב-₪224,900 נשארה רק בעמוד הדגם הישן"),
    ]},
    { id: "cr-v", make: "honda", model: "CR-V", he: "CR-V", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("RE (דור 3)", 2010, 2011, "2.0 / 2.4 בנזין, 2.2 i-DTEC", "150–180", ["petrol", "diesel"], 9.5, null, undefined, [C.history, C.inspect]),
      T("RM (דור 4)", 2012, 2018, "2.0 / 2.4 בנזין, 1.6 / 2.2 i-DTEC", "118–184", ["petrol", "diesel"], 8.8, null, undefined, [C.history, C.inspect]),
      T("RW (דור 5)", 2018, 2023, "1.5 טורבו / 2.0 היברידי", "190–212", ["petrol", "hybrid"], 7.0, null, undefined, [C.history, C.inspect, "מנוע 1.5 טורבו (2017–2018): דילול שמן בדלק; לבדוק מפלס וריח דלק בשמן"]),
      T("RS (דור 6)", 2023, null, "2.0 e:HEV היברידי / e:PHEV", "181–204", ["hybrid", "phev"], 6.3, 4, 2024, [C.hyHybrid, C.recalls], "4 כוכבים בסיסי, 5 עם חבילת בטיחות; לא משווק עוד בישראל (cartube)"),
    ]},
    { id: "zr-v", make: "honda", model: "ZR-V", he: "ZR-V", body: "suv", segment: "mass", price: [209900, 234900], status: "on_sale", gens: [
      T("RZ", 2023, null, "2.0 e:HEV היברידי", "184 (מנוע חשמלי)", ["hybrid"], 5.9, 4, 2023, [C.hyHybrid, C.recalls]),
    ]},
  ]},

  { id: "subaru", name: "Subaru", he: "סובארו", models: [
    { id: "impreza", make: "subaru", model: "Impreza", he: "אימפרזה", body: "hatch", segment: "mass", price: null, status: "discontinued", gens: [
      T("GJ/GP", 2012, 2016, "1.6 / 2.0 בוקסר", "עד 148", ["petrol"], 7.5, null, undefined, [C.history, C.inspect, C.cvt, "מנועי FB (2012–2014): צריכת שמן מוגברת; לבדוק רישום הוספות שמן"]),
      T("GK/GT", 2017, 2023, "1.6 / 2.0 בוקסר, 2.0 e-Boxer (מ-2020)", "עד 152", ["petrol", "hybrid"], 7.3, null, undefined, [C.history, C.cvt]),
      T("GU", 2024, null, "2.0 e-Boxer / 2.5 בוקסר", "152–182", ["petrol", "hybrid"], 7.0, null, undefined, [C.history, C.recalls], "לא במחירון היבואן הנוכחי"),
    ]},
    { id: "crosstrek", make: "subaru", model: "XV / Crosstrek", he: "XV / קרוסטרק", body: "suv", segment: "mass", price: [175900, 185900], status: "on_sale", gens: [
      T("GP (XV)", 2012, 2017, "1.6 / 2.0 בוקסר", "עד 148", ["petrol"], 7.8, null, undefined, [C.history, C.inspect, C.cvt, "מנועי FB (2012–2014): צריכת שמן מוגברת; לבדוק רישום הוספות שמן"]),
      T("GT (XV)", 2018, 2022, "1.6 / 2.0 בוקסר, 2.0 e-Boxer", "עד 152", ["petrol", "hybrid"], 7.6, 5, 2017, [C.history, C.cvt]),
      T("GU (Crosstrek)", 2023, null, "2.0 / 2.5 בוקסר, e-Boxer", "152–182", ["petrol", "hybrid"], 7.8, 5, 2024, [C.history, C.recalls], "דף הדגם ב-carzone מציג 2.0 152 כ\"ס לצד גרסאות 2.5; לבדוק מול היבואן"),
    ]},
    { id: "forester", make: "subaru", model: "Forester", he: "פורסטר", body: "suv", segment: "mass", price: [212900, 279900], status: "on_sale", gens: [
      T("דור 3", 2010, 2012, "2.0 בוקסר, 2.0 דיזל", "145–150", ["petrol", "diesel"], 9.5, null, undefined, [C.history, C.inspect, "דיזל Euro 4: נטייה לסדקים בגל הארכובה"]),
      T("דור 4", 2013, 2018, "2.0 בוקסר", "146", ["petrol"], 8.8, null, undefined, [C.history, C.inspect, C.cvt, "מנועי FB (2011–2014): צריכת שמן מוגברת; לבדוק רישום הוספות שמן"]),
      T("דור 5", 2019, 2024, "2.0 e-Boxer", "148", ["hybrid"], 8.0, 5, 2019, [C.history, C.cvt]),
      T("דור 6", 2024, null, "2.5 בוקסר / 2.5 היברידי", "180", ["petrol", "hybrid"], 8.4, 5, 2024, [C.history, C.recalls]),
    ]},
    { id: "outback", make: "subaru", model: "Outback", he: "אאוטבק", body: "wagon", segment: "mass", price: [279900, 279990], status: "on_sale", gens: [
      T("BR", 2010, 2014, "2.5 / 3.6 בוקסר, 2.0 דיזל", "150–260", ["petrol", "diesel"], 9.5, null, undefined, [C.history, C.inspect, "מנועי FB (2013): צריכת שמן מוגברת; לבדוק רישום הוספות שמן"]),
      T("BS", 2015, 2019, "2.5 / 3.6 בוקסר, 2.0 דיזל", "עד 256", ["petrol", "diesel"], 8.9, null, undefined, [C.history, C.cvt]),
      T("BT", 2020, 2025, "2.5 בוקסר", "182", ["petrol"], 8.7, 5, 2021, [C.history, C.cvt]),
      T("BU", 2025, null, "2.5 בוקסר", "180", ["petrol"], 8.7, null, undefined, [C.recalls], "דגם חדש במחירון 2026"),
    ]},
    { id: "brz", make: "subaru", model: "BRZ", he: "BRZ", body: "sedan", segment: "mass", price: [229900, 249900], status: "on_sale", gens: [
      T("ZC6", 2012, 2020, "2.0 בוקסר", "200", ["petrol"], 8.5, null, undefined, [C.history, C.inspect]),
      T("ZD8", 2021, null, "2.4 בוקסר", "228–235", ["petrol"], 9.0, null, undefined, [C.history], "קופה 4 מושבים; Premium ידנית ₪229,900 עד tS ידנית ₪249,900"),
    ]},
  ]},

  { id: "lexus", name: "Lexus", he: "לקסוס", models: [
    { id: "ux", make: "lexus", model: "UX", he: "UX", body: "suv", segment: "premium", price: [249990, 284990], status: "on_sale", gens: [
      T("ZA10", 2019, null, "2.0 בנזין / 2.0 היברידי, חשמלי (300e)", "171–204", ["petrol", "hybrid", "ev"], 5.6, 5, 2019, [C.toyHybrid, C.history, C.recalls]),
    ]},
    { id: "nx", make: "lexus", model: "NX", he: "NX", body: "suv", segment: "premium", price: [334990, 445990], status: "on_sale", gens: [
      T("AZ10", 2014, 2021, "2.0 טורבו / 2.5 היברידי", "194–235", ["petrol", "hybrid"], 7.3, 5, 2014, [C.toyHybrid, C.history]),
      T("AZ20", 2022, null, "2.5 היברידי / 2.5 פלאג-אין", "240–304", ["hybrid", "phev"], 6.4, 5, 2022, [C.toyHybrid, C.recalls, "NX 450h+ (ייצור 04/2021–06/2022): קריאת שירות לממיר מתח; לוודא ביצוע"]),
    ]},
    { id: "rx", make: "lexus", model: "RX", he: "RX", body: "suv", segment: "premium", price: [414990, 589990], status: "on_sale", gens: [
      T("AL10", 2010, 2015, "3.5 V6 / 3.5 היברידי (450h), 2.7", "188–297", ["petrol", "hybrid"], 10.0, null, undefined, [C.toyHybrid, C.history, C.inspect]),
      T("AL20", 2016, 2022, "2.0 טורבו / 3.5 V6 / 3.5 היברידי", "238–313", ["petrol", "hybrid"], 8.5, null, undefined, [C.toyHybrid, C.history]),
      T("ALA10/ALH10", 2023, null, "2.4 טורבו, 2.5 היברידי / פלאג-אין, 2.4 טורבו היברידי (500h)", "245–366", ["petrol", "hybrid", "phev"], 7.5, 5, 2022, [C.toyHybrid, C.recalls]),
    ]},
    { id: "es", make: "lexus", model: "ES", he: "ES", body: "sedan", segment: "premium", price: [354990, 374990], status: "on_sale", gens: [
      T("XV40", 2010, 2012, "2.4 / 3.5 V6", "165–272", ["petrol"], 9.5, null, undefined, [C.history, C.inspect, "קריאת שירות שטיחים ודוושת גז (2007–2009): לוודא ביצוע"]),
      T("XV60", 2012, 2018, "2.5 היברידי (300h), 2.0 / 2.5 / 3.5", "165–272", ["petrol", "hybrid"], 7.5, null, undefined, [C.toyHybrid, C.history]),
      T("AXZH10", 2018, 2025, "2.5 היברידי (300h), 2.0 / 2.5 / 3.5", "170–302", ["petrol", "hybrid"], 6.0, 5, 2018, [C.toyHybrid, C.history]),
      T("AXZH21", 2025, null, "2.5 היברידי (350h), חשמלי (350e / 500e)", "221–338", ["hybrid", "ev"], 6.0, null, undefined, [C.toyHybrid, C.recalls], "ES EV מתומחר בנפרד (₪379,990–429,990)"),
    ]},
    { id: "lbx", make: "lexus", model: "LBX", he: "LBX", body: "suv", segment: "premium", price: [205990, 246990], status: "on_sale", gens: [
      T("AY10", 2024, null, "1.5 היברידי", "136", ["hybrid"], 4.8, 5, 2024, [C.toyHybrid, C.recalls]),
    ]},
    { id: "rz", make: "lexus", model: "RZ", he: "RZ", body: "suv", segment: "premium", price: [299990, 439990], status: "on_sale", gens: [
      T("e-TNGA", 2023, null, "חשמלי, סוללה 71.4 / 72.8 קוט\"ש", "204–408", ["ev"], 18.5, 5, 2023, [C.ev, C.recalls]),
    ]},
  ]},

  { id: "volvo", name: "Volvo", he: "וולוו", models: [
    { id: "xc40", make: "volvo", model: "XC40 / EX40", he: "XC40 / EX40", body: "suv", segment: "premium", price: [249900, 359900], status: "on_sale", gens: [
      T("XC40 (CMA)", 2018, null, "T3 / T4 / T5 בנזין, B4 מיילד-היברידי, T4 / T5 פלאג-אין", "129–265", ["petrol", "hybrid", "phev"], 7.5, 5, 2018, [C.history, C.recalls, "בגרסת פלאג-אין: " + C.phev], "XC40 ₪249,900–279,900"),
      T("EX40 (XC40 Recharge)", 2020, null, "חשמלי, מנוע אחד או שניים", "231–408", ["ev"], 19.5, 5, 2018, [C.ev, C.recalls], "EX40 ₪359,900"),
    ]},
    { id: "xc60", make: "volvo", model: "XC60", he: "XC60", body: "suv", segment: "premium", price: [299900, 474900], status: "on_sale", gens: [
      T("Gen1", 2010, 2017, "2.0 טורבו / T5 / T6 בנזין, D4 / D5 דיזל", "134–324", ["petrol", "diesel"], 10.0, 5, 2008, [C.history, C.inspect]),
      T("Gen2", 2017, null, "T5 / B5 בנזין ומיילד-היברידי, T8 פלאג-אין, דיזל", "187–455", ["petrol", "hybrid", "phev", "diesel"], 7.8, 5, 2017, [C.history, C.recalls, "בגרסת פלאג-אין: " + C.phev]),
    ]},
    { id: "xc90", make: "volvo", model: "XC90", he: "XC90", body: "suv7", segment: "premium", price: [519900, 634900], status: "on_sale", gens: [
      T("Gen1", 2010, 2014, "2.5T / 3.2 / V8 בנזין, D5 דיזל", "163–311", ["petrol", "diesel"], 12.5, null, undefined, [C.history, C.inspect]),
      T("Gen2", 2015, null, "T5 / T6, B5 / B6 מיילד-היברידי, T8 פלאג-אין, D5 דיזל", "190–455", ["petrol", "hybrid", "phev", "diesel"], 8.5, 5, 2015, [C.history, C.airSusp, "בגרסת פלאג-אין: " + C.phev]),
    ]},
    { id: "ex30", make: "volvo", model: "EX30", he: "EX30", body: "suv", segment: "premium", price: [179900, 239900], status: "on_sale", gens: [
      T("SEA2", 2024, null, "חשמלי 51 / 69 קוט\"ש, מנוע אחד או שניים", "268–422", ["ev"], 16.5, 5, 2024, [C.ev, C.recalls, "קריאת שירות 2026 לסוללת המתח הגבוה (סכנת שריפה): לוודא ביצוע ואת הנחיית הטעינה עד 70% בגרסאות מסוימות"]),
    ]},
    { id: "ex90", make: "volvo", model: "EX90", he: "EX90", body: "suv7", segment: "premium", price: [739900, 754900], status: "on_sale", gens: [
      T("SPA2", 2024, null, "חשמלי, סוללה 92–111 קוט\"ש", "275–671", ["ev"], 22.0, 5, 2025, [C.ev, C.recalls]),
    ]},
    { id: "es90", make: "volvo", model: "ES90", he: "ES90", body: "sedan", segment: "premium", price: [399900, 539900], status: "on_sale", gens: [
      T("V551", 2025, null, "חשמלי, סוללה 88–106 קוט\"ש", "329–671", ["ev"], 17.5, null, undefined, [C.ev, C.recalls]),
    ]},
    { id: "s60", make: "volvo", model: "S60", he: "S60", body: "sedan", segment: "premium", price: null, status: "discontinued", gens: [
      T("Gen2", 2010, 2018, "T3–T6 בנזין, D2–D5 דיזל", "114–367", ["petrol", "diesel"], 8.5, null, undefined, [C.history, C.inspect]),
      T("SPA", 2018, 2024, "T4 / T5 בנזין, T8 פלאג-אין", "187–455", ["petrol", "phev"], 7.8, 5, 2018, [C.history, C.recalls, "בגרסת פלאג-אין: " + C.phev], "הייצור הסתיים ביוני 2024"),
    ]},
    { id: "v60", make: "volvo", model: "V60", he: "V60", body: "wagon", segment: "premium", price: null, status: "discontinued", gens: [
      T("Gen1", 2010, 2018, "T3–T6 בנזין, D2–D5 דיזל, D5/D6 פלאג-אין דיזל", "115–367", ["petrol", "diesel", "phev"], 8.0, 5, 2011, [C.history, C.inspect]),
      T("SPA", 2018, null, "B3–B6 / T4–T6 בנזין, D3/D4 דיזל, T6/T8 פלאג-אין", "150–462", ["petrol", "diesel", "hybrid", "phev"], 7.5, 5, 2018, [C.history, C.recalls, "בגרסת פלאג-אין: " + C.phev], "לא משווק עוד בישראל"),
    ]},
    { id: "c40", make: "volvo", model: "C40 / EC40", he: "C40 / EC40", body: "suv", segment: "premium", price: null, status: "discontinued", gens: [
      T("C40 / EC40", 2021, null, "חשמלי, סוללה 69–82 קוט\"ש", "231–408", ["ev"], 20.0, 5, 2022, [C.ev, C.recalls], "שמו שונה ל-EC40 ב-2024; לא משווק עוד בישראל"),
    ]},
  ]},

  { id: "citroen", name: "Citroën", he: "סיטרואן", models: [
    { id: "c3", make: "citroen", model: "C3", he: "C3", body: "city", segment: "mass", price: [99990, 114990], status: "on_sale", gens: [
      T("Gen2", 2010, 2016, "1.1 / 1.4 / 1.6 VTi, 1.4 / 1.6 HDi", "61–120", ["petrol", "diesel"], 7.0, null, undefined, [C.history, C.inspect]),
      T("Gen3", 2017, 2024, "1.2 PureTech, 1.5 / 1.6 BlueHDi", "68–110", ["petrol", "diesel"], 6.3, null, undefined, [C.history, C.puretech]),
      T("Gen4", 2024, null, "1.2 טורבו בנזין / מיילד-היברידי, חשמלי ë-C3", "100–113", ["petrol", "hybrid", "ev"], 6.5, null, undefined, [C.history, C.recalls]),
    ]},
    { id: "c4", make: "citroen", model: "C4", he: "C4", body: "hatch", segment: "mass", price: [129990, 129990], status: "on_sale", gens: [
      T("Gen2", 2011, 2018, "1.4 / 1.6 VTi, 1.6 THP, 1.6 HDi / 2.0 HDi", "90–155", ["petrol", "diesel"], 7.0, null, undefined, [C.history, C.inspect]),
      T("C41", 2021, null, "1.2 PureTech, 1.2 היברידי, חשמלי ë-C4", "100–156", ["petrol", "hybrid", "ev"], 6.2, 4, 2021, [C.history, C.puretech, C.recalls], "C4 X באותו מחיר"),
    ]},
    { id: "c5-aircross", make: "citroen", model: "C5 Aircross", he: "C5 איירקרוס", body: "suv", segment: "mass", price: [179990, 195990], status: "on_sale", gens: [
      T("Gen1", 2019, 2025, "1.2 / 1.6 PureTech, 1.6 פלאג-אין, 1.5 / 2.0 BlueHDi", "130–225", ["petrol", "phev", "diesel"], 7.3, 4, 2019, [C.history, C.puretech], "4 כוכבים בסיסי, 5 עם חבילת בטיחות"),
      T("Gen2 (STLA Medium)", 2025, null, "1.2 מיילד-היברידי, 1.6 פלאג-אין, חשמלי", "145–228", ["hybrid", "phev", "ev"], 6.5, null, undefined, [C.recalls]),
    ]},
    { id: "berlingo", make: "citroen", model: "Berlingo", he: "ברלינגו", body: "mpv", segment: "mass", price: [176990, 189990], status: "on_sale", gens: [
      T("Gen2", 2010, 2018, "1.6 בנזין, 1.6 HDi / BlueHDi", "75–120", ["petrol", "diesel"], 7.0, null, undefined, [C.history, C.inspect, "לעיתים שימש כרכב עבודה: לבדוק בלאי כללי"]),
      T("K9", 2019, null, "1.5 BlueHDi דיזל, 1.2 PureTech, חשמלי ë-Berlingo", "100–130", ["diesel", "petrol", "ev"], 6.0, 4, 2018, [C.history, "בגרסת הבנזין: " + C.puretech], "כולל ë-Berlingo, מקסי וארוך"),
    ]},
    { id: "c3-aircross", make: "citroen", model: "C3 Aircross", he: "C3 איירקרוס", body: "suv", segment: "mass", price: [129990, 139990], status: "on_sale", gens: [
      T("Gen1", 2017, 2024, "1.2 PureTech, 1.5 / 1.6 BlueHDi", "82–133", ["petrol", "diesel"], 6.8, null, undefined, [C.history, C.puretech]),
      T("CC24", 2024, null, "1.2 טורבו מיילד-היברידי, חשמלי ë-C3 Aircross", "101–145", ["hybrid", "petrol", "ev"], 6.4, null, undefined, [C.history, C.recalls], "בישראל 1.2 מיילד-היברידי 145 כ\"ס; גרסת 7 מושבים ב-₪139,990"),
    ]},
  ]},

  { id: "ds", name: "DS", he: "DS", models: [
    { id: "ds-3", make: "ds", model: "DS 3", he: "DS 3", body: "suv", segment: "premium", price: [218990, 218990], status: "on_sale", gens: [
      T("DS3 (האצ'בק)", 2010, 2019, "1.2 PureTech / 1.6 VTi / THP, 1.6 HDi / BlueHDi", "82–210", ["petrol", "diesel"], 6.8, null, undefined, [C.history, C.inspect, C.puretech], "נמכר בתחילה כ-Citroën DS3"),
      T("DS 3 Crossback", 2019, null, "1.2 PureTech, 1.5 BlueHDi, חשמלי E-Tense 50 / 54 קוט\"ש", "100–156", ["petrol", "diesel", "ev"], 6.2, 4, 2019, [C.history, C.recalls, C.puretech], "בישראל רק החשמלי (156 כ\"ס); 5 כוכבים עם חבילת בטיחות"),
    ]},
    { id: "ds-4", make: "ds", model: "DS 4", he: "DS 4", body: "hatch", segment: "premium", price: null, status: "discontinued", gens: [
      T("Gen1", 2011, 2018, "1.2 / 1.6 בנזין, 1.6 / 2.0 דיזל", "120–211", ["petrol", "diesel"], 7.2, 5, 2011, [C.history, C.inspect]),
      T("Gen2", 2021, null, "1.2 / 1.6 PureTech, 1.6 פלאג-אין, 1.5 BlueHDi", "130–225", ["petrol", "phev", "diesel"], 6.5, null, undefined, [C.history, C.puretech], "לא משווק עוד בישראל"),
    ]},
    { id: "ds-7", make: "ds", model: "DS 7", he: "DS 7", body: "suv", segment: "premium", price: [344990, 344990], status: "on_sale", gens: [
      T("Gen1", 2018, null, "1.2 / 1.6 PureTech, 1.5 / 2.0 BlueHDi, 1.6 E-Tense פלאג-אין", "130–370", ["petrol", "diesel", "phev"], 7.0, 5, 2017, [C.history, C.recalls, "בגרסת פלאג-אין: " + C.phev], "בישראל רק E-Tense 225 פלאג-אין"),
    ]},
  ]},

  { id: "opel", name: "Opel", he: "אופל", models: [
    { id: "corsa", make: "opel", model: "Corsa", he: "קורסה", body: "city", segment: "mass", price: [126990, 129990], status: "on_sale", gens: [
      T("Corsa D", 2010, 2014, "1.2 / 1.4 בנזין, 1.3 CDTI", "60–210", ["petrol", "diesel"], 6.8, null, undefined, [C.history, C.inspect]),
      T("Corsa E", 2015, 2019, "1.0 טורבו / 1.2 / 1.4, 1.3 CDTI", "70–207", ["petrol", "diesel"], 6.5, null, undefined, [C.history, C.inspect]),
      T("Corsa F", 2020, null, "1.2 PureTech, 1.2 מיילד-היברידי, חשמלי Corsa-e", "75–156", ["petrol", "hybrid", "ev"], 6.0, 4, 2019, [C.history, C.puretech, C.recalls], "בישראל 1.2 טורבו 100 כ\"ס או GS Line מיילד-היברידי; cartube מציג עד ₪129,990, carzone עד ₪134,990"),
    ]},
    { id: "astra", make: "opel", model: "Astra", he: "אסטרה", body: "hatch", segment: "mass", price: [167990, 167990], status: "on_sale", gens: [
      T("Astra J", 2010, 2015, "1.4–2.0 טורבו בנזין, 2.0 CDTI", "87–280", ["petrol", "diesel"], 7.5, null, undefined, [C.history, C.inspect]),
      T("Astra K", 2016, 2021, "1.0 / 1.2 / 1.4 טורבו, 1.5 / 1.6 דיזל", "110–150", ["petrol", "diesel"], 6.5, null, undefined, [C.history, C.inspect]),
      T("Astra L", 2022, null, "1.2 PureTech / מיילד-היברידי, 1.6 פלאג-אין, חשמלי", "עד 225", ["petrol", "hybrid", "phev", "ev"], 6.3, 4, 2022, [C.history, C.puretech, C.recalls]),
    ]},
    { id: "mokka", make: "opel", model: "Mokka", he: "מוקה", body: "suv", segment: "mass", price: [149990, 149990], status: "on_sale", gens: [
      T("Mokka A/X", 2013, 2019, "1.4 טורבו / 1.6 בנזין, 1.6 / 1.7 CDTI", "108–150", ["petrol", "diesel"], 7.8, null, undefined, [C.history, C.inspect]),
      T("Mokka B", 2021, null, "1.2 טורבו, 1.2 היברידי, חשמלי Mokka-e", "100–145", ["petrol", "hybrid", "ev"], 6.4, 4, 2021, [C.history, C.puretech]),
    ]},
    { id: "grandland", make: "opel", model: "Grandland", he: "גרנדלנד", body: "suv", segment: "mass", price: [186990, 206990], status: "on_sale", gens: [
      T("Gen1 (Grandland X)", 2018, 2024, "1.2 PureTech, 1.5 / 2.0 דיזל, פלאג-אין", "118–201", ["petrol", "diesel", "phev"], 7.2, 5, 2017, [C.history, C.puretech]),
      T("Gen2", 2025, null, "1.2 מיילד-היברידי, 1.6 פלאג-אין, חשמלי", "134–321", ["hybrid", "phev", "ev"], 6.6, 4, 2025, [C.recalls]),
    ]},
    { id: "frontera", make: "opel", model: "Frontera", he: "פרונטרה", body: "suv", segment: "mass", price: [144990, 156990], status: "on_sale", gens: [
      T("OV24", 2025, null, "1.2 טורבו מיילד-היברידי, חשמלי", "100–145", ["hybrid", "ev"], 6.4, null, undefined, [C.history, C.recalls], "בישראל 1.2 טורבו 145 כ\"ס; גרסת 7 מושבים ב-₪156,990"),
    ]},
    { id: "crossland", make: "opel", model: "Crossland", he: "קרוסלנד", body: "suv", segment: "mass", price: null, status: "discontinued", gens: [
      T("Gen1", 2017, 2024, "1.2 / 1.2 טורבו בנזין, 1.5 / 1.6 דיזל", "75–130", ["petrol", "diesel"], 6.6, null, undefined, [C.history, C.puretech]),
    ]},
  ]},

  // ── Catalog expansion 3 (2026-10-20): prices from carzone.co.il brand pages, generations from Wikipedia. See DATA_UPDATES.md.
  { id: "zeekr", name: "Zeekr", he: "זיקר", models: [
    { id: "x", make: "zeekr", model: "X", he: "X", body: "suv", segment: "mass", price: [169990, 186990], status: "on_sale", gens: [
      T("BX1E", 2023, null, "סוללה 49–69 קוט\"ש", "340", ["ev"], 17.0, 5, 2024, [C.ev, C.newBrand], "בדף הדגם מופיעה גם גרסת Krypton 4X4 ב-₪209,990"),
    ]},
    { id: "7gt", make: "zeekr", model: "7GT", he: "7GT", body: "wagon", segment: "premium", price: [191990, 269990], status: "on_sale", gens: [
      T("CC1E", 2025, null, "סוללה 75/100 קוט\"ש", "421", ["ev"], 17.5, 5, 2026, [C.ev, C.newBrand]),
    ]},
    { id: "7x", make: "zeekr", model: "7X", he: "7X", body: "suv", segment: "premium", price: [233990, 289990], status: "on_sale", gens: [
      T("CX1E", 2024, null, "סוללה 75/100 קוט\"ש", "422", ["ev"], 19.0, 5, 2025, [C.ev, C.newBrand], "במבחן דרך: טווח של כ-460–500 ק\"מ"),
    ]},
    { id: "001", make: "zeekr", model: "001", he: "001", body: "wagon", segment: "premium", price: [289990, 349990], status: "on_sale", gens: [
      T("Gen1", 2021, null, "סוללה 86–100 קוט\"ש", "272–544", ["ev"], 19.0, 5, 2024, [C.ev, C.newBrand], "ב-cartube המחירים מעט שונים (₪283,990–344,990)"),
    ]},
  ]},

  { id: "lynkco", name: "Lynk & Co", he: "לינק אנד קו", models: [
    { id: "02", make: "lynkco", model: "02", he: "02", body: "suv", segment: "mass", price: [159900, 169900], status: "on_sale", gens: [
      T("Gen2 (EV)", 2024, null, "סוללה 66 קוט\"ש", "272", ["ev"], 17.5, 5, 2025, [C.ev, C.newBrand], "ב-cartube מופיע מחיר גבוה יותר (₪171,900–179,900)"),
    ]},
    { id: "01", make: "lynkco", model: "01 EM-P", he: "01 EM-P", body: "suv", segment: "mass", price: [179900, 198900], status: "on_sale", gens: [
      T("CX11", 2017, null, "פלאג-אין: 1.5 טורבו בנזין", "261–280", ["phev"], 6.0, null, undefined, [C.phev, C.newBrand], "בישראל נמכרת גרסת הפלאג-אין EM-P (מ-2022); טווח חשמלי מוצהר 75 ק\"מ"),
    ]},
    { id: "08", make: "lynkco", model: "08", he: "08", body: "suv", segment: "mass", price: [229900, 249900], status: "on_sale", gens: [
      T("DX11", 2023, null, "פלאג-אין: 1.5 טורבו + סוללה 28–38 קוט\"ש", "350", ["phev"], 6.5, 5, 2025, [C.phev, C.newBrand], "במבחן דרך: כ-180 ק\"מ חשמלי וממוצע 15.4 ק\"מ לליטר"),
    ]},
  ]},

  { id: "ora", name: "ORA", he: "אורה", models: [
    { id: "05", make: "ora", model: "05", he: "05", body: "suv", segment: "mass", price: [139990, 151900], status: "on_sale", gens: [
      T("Gen1", 2025, null, "1.5 טורבו היברידי", "223", ["hybrid"], 6.8, null, undefined, [C.newBrand, C.hyHybrid], "במבחן דרך: 14.5–15.1 ק\"מ לליטר"),
    ]},
    { id: "03", make: "ora", model: "03 Funky Cat", he: "03 פאנקי קאט", body: "hatch", segment: "mass", price: [139900, 164900], status: "on_sale", gens: [
      T("ES11", 2020, null, "סוללה 57.7 קוט\"ש (דגם 2026)", "171", ["ev"], 18.1, 5, 2022, [C.ev, C.newBrand], "במבחן דרך: כ-250 ק\"מ טווח אמיתי. 2026: Classic ₪139,900, Design ₪151,900, Pro+ ₪164,900"),
    ]},
    { id: "07", make: "ora", model: "07", he: "07", body: "sedan", segment: "mass", price: [226900, 226900], status: "on_sale", gens: [
      T("Lightning Cat", 2022, null, "סוללה 83.5 קוט\"ש", "204", ["ev"], 18.0, null, undefined, [C.ev, C.newBrand]),
    ]},
  ]},

  { id: "xpeng", name: "XPENG", he: "אקספנג", models: [
    { id: "p7-plus", make: "xpeng", model: "P7+", he: "P7+", body: "sedan", segment: "mass", price: [199990, 199990], status: "on_sale", gens: [
      T("Gen1", 2024, null, "סוללה 74.9 קוט\"ש", "313", ["ev"], 15.5, null, undefined, [C.ev, C.newBrand], "במבחן דרך: 15.1–16 קוט\"ש ל-100 ק\"מ"),
    ]},
    { id: "g6", make: "xpeng", model: "G6", he: "G6", body: "suv", segment: "mass", price: [204990, 247990], status: "on_sale", gens: [
      T("F30", 2023, null, "סוללה 66–87.5 קוט\"ש", "296", ["ev"], 17.5, 5, 2024, [C.ev, C.newBrand]),
    ]},
    { id: "p7", make: "xpeng", model: "P7", he: "P7", body: "sedan", segment: "mass", price: [214990, 281990], status: "on_sale", gens: [
      T("P7 / P7i", 2020, null, "סוללה 64.4/86.2 קוט\"ש", "276", ["ev"], 16.5, 5, 2023, [C.ev, C.newBrand], "בישראל נמכרת גרסת P7i"),
    ]},
    { id: "g9", make: "xpeng", model: "G9", he: "G9", body: "suv", segment: "premium", price: [259990, 372990], status: "on_sale", gens: [
      T("Gen1", 2022, null, "סוללה 79 קוט\"ש ומעלה", "351–575", ["ev"], 20.0, null, undefined, [C.ev, C.newBrand], "במבחן דרך: כ-400 ק\"מ בנסיעה מתונה"),
    ]},
  ]},

  { id: "leapmotor", name: "Leapmotor", he: "ליפמוטור", models: [
    { id: "t03", make: "leapmotor", model: "T03", he: "T03", body: "city", segment: "mass", price: [92900, 92900], status: "on_sale", gens: [
      T("Gen1", 2020, null, "חשמלי", "95", ["ev"], 14.0, null, undefined, [C.ev, C.newBrand]),
    ]},
    { id: "b10", make: "leapmotor", model: "B10", he: "B10", body: "suv", segment: "mass", price: [139900, 149900], status: "on_sale", gens: [
      T("Gen1", 2025, null, "סוללה 67.1 קוט\"ש", "218", ["ev"], 18.5, 5, 2025, [C.ev, C.newBrand], "במבחן דרך: כ-340 ק\"מ. גרסת מאריך טווח (REEV): ₪154,900–164,900"),
    ]},
    { id: "c10", make: "leapmotor", model: "C10", he: "C10", body: "suv", segment: "mass", price: [164900, 199900], status: "on_sale", gens: [
      T("Gen1", 2024, null, "סוללה 69.9 קוט\"ש", "215", ["ev"], 19.5, 5, 2024, [C.ev, C.newBrand], "במבחן דרך: כ-340 ק\"מ. גרסת מאריך טווח (REEV): ₪174,900–184,900"),
    ]},
  ]},

  { id: "polestar", name: "Polestar", he: "פולסטאר", models: [
    { id: "polestar-2", make: "polestar", model: "Polestar 2", he: "פולסטאר 2", body: "sedan", segment: "premium", price: [244900, 324900], status: "on_sale", gens: [
      T("Gen1", 2020, null, "סוללה 69–82 קוט\"ש", "231–477", ["ev"], 18.0, 5, 2021, [C.ev, C.recalls], "מחירון 2026 לפי cartube (יבואן מאיר)"),
    ]},
  ]},

  { id: "smart", name: "Smart", he: "סמארט", models: [
    { id: "1", make: "smart", model: "#1", he: "#1", body: "suv", segment: "mass", price: [196990, 252990], status: "on_sale", gens: [
      T("HX11", 2022, null, "סוללה 66 קוט\"ש", "272", ["ev"], 17.5, 5, 2022, [C.ev, C.newBrand]),
    ]},
    { id: "3", make: "smart", model: "#3", he: "#3", body: "suv", segment: "mass", price: [211990, 267990], status: "on_sale", gens: [
      T("HC11", 2023, null, "סוללה 49/66 קוט\"ש", "272", ["ev"], 17.0, 5, 2023, [C.ev, C.newBrand]),
    ]},
    { id: "5", make: "smart", model: "#5", he: "#5", body: "suv", segment: "premium", price: [229990, 299990], status: "on_sale", gens: [
      T("HY11", 2024, null, "חשמלי, הנעה אחורית או כפולה (Brabus)", "340–646", ["ev"], 20.0, 5, 2025, [C.ev, C.newBrand], "במבחן דרך: 430–540 ק\"מ"),
    ]},
  ]},

  { id: "genesis", name: "Genesis", he: "ג'נסיס", models: [
    { id: "gv60", make: "genesis", model: "GV60", he: "GV60", body: "suv", segment: "premium", price: [299990, 599990], status: "on_sale", gens: [
      T("JW", 2021, null, "סוללה 77.4–84 קוט\"ש", "228–489", ["ev"], 19.0, 5, 2022, [C.ev, C.newBrand]),
    ]},
    { id: "gv70", make: "genesis", model: "GV70", he: "GV70", body: "suv", segment: "premium", price: [359990, 459990], status: "on_sale", gens: [
      T("JK1", 2021, null, "2.5 טורבו בנזין / חשמלי", "300–489", ["petrol", "ev"], 10.5, null, undefined, [C.newBrand, C.history], "במבחן דרך: כ-9.5 ק\"מ לליטר. GV70 Electrified: ₪549,900–609,900"),
    ]},
    { id: "g80", make: "genesis", model: "G80", he: "G80", body: "sedan", segment: "premium", price: [399990, 499000], status: "on_sale", gens: [
      T("RG3", 2020, null, "2.5 טורבו בנזין", "304", ["petrol"], 10.5, null, undefined, [C.newBrand, C.history]),
    ]},
    { id: "gv80", make: "genesis", model: "GV80", he: "GV80", body: "suv7", segment: "premium", price: [489990, 645990], status: "on_sale", gens: [
      T("JX1", 2020, null, "3.5 טורבו V6 בנזין", "375–409", ["petrol"], 13.5, 5, 2021, [C.newBrand, C.history], "GV80 Coupe: ₪599,990–725,000 (במבחן דרך כ-8.1 ק\"מ לליטר)"),
    ]},
  ]},

  { id: "mini", name: "MINI", he: "מיני", models: [
    { id: "hatch", make: "mini", model: "Cooper (Hatch)", he: "קופר", body: "hatch", segment: "premium", price: [221900, 301900], status: "on_sale", gens: [
      T("R56", 2010, 2013, "1.6 בנזין / 1.6 טורבו (Cooper S)", "120–211", ["petrol"], 7.0, null, undefined, [C.history, C.inspect]),
      T("F56 / F55", 2014, 2024, "1.2/1.5 טורבו 3 צילינדרים / 2.0 טורבו", "75–306", ["petrol"], 6.8, null, undefined, [C.history, C.inspect]),
      T("J01 (חשמלי)", 2023, null, "חשמלי", "218", ["ev"], 15.5, 5, 2025, [C.ev], "Cooper Electric: ₪234,900"),
      T("F66 / F65", 2024, null, "1.5 טורבו בנזין / 2.0 טורבו", "156–204", ["petrol"], 6.8, 5, 2025, [C.history], "Cabrio: ₪266,900–321,900"),
    ]},
    { id: "countryman", make: "mini", model: "Countryman", he: "קאנטרימן", body: "suv", segment: "premium", price: [273000, 339000], status: "on_sale", gens: [
      T("R60", 2010, 2016, "1.6 בנזין / 1.6 טורבו", "98–218", ["petrol"], 7.8, 5, 2010, [C.history, C.inspect]),
      T("F60", 2017, 2023, "1.5 / 2.0 טורבו / פלאג-אין", "102–306", ["petrol", "phev"], 7.4, 5, 2017, [C.history, C.inspect]),
      T("U25", 2024, null, "1.5 טורבו בנזין / חשמלי 66.5 קוט\"ש", "170–313", ["petrol", "ev"], 7.4, 5, 2024, [C.history], "במבחן דרך (1.5 טורבו): כ-13.5 ק\"מ לליטר. Countryman Electric: ₪339,000"),
    ]},
    { id: "aceman", make: "mini", model: "Aceman", he: "אייסמן", body: "suv", segment: "premium", price: [259900, 259900], status: "on_sale", gens: [
      T("J05", 2024, null, "סוללה 54.2 קוט\"ש", "218", ["ev"], 15.5, 5, 2025, [C.ev], "לפי הסקירה: כ-350 ק\"מ טווח מציאותי"),
    ]},
  ]},

  { id: "jeep", name: "Jeep", he: "ג'יפ", models: [
    { id: "avenger", make: "jeep", model: "Avenger", he: "אוונג'ר", body: "suv", segment: "mass", price: [164900, 174900], status: "on_sale", gens: [
      T("Gen1", 2023, null, "1.2 טורבו בנזין", "100", ["petrol"], 6.5, 3, 2024, [C.history, C.recalls]),
    ]},
    { id: "compass", make: "jeep", model: "Compass", he: "קומפאס", body: "suv", segment: "mass", price: [209900, 224900], status: "on_sale", gens: [
      T("MK49", 2010, 2016, "2.0 / 2.4 בנזין", "158–172", ["petrol"], 9.5, 2, 2012, [C.history, C.inspect]),
      T("Gen2", 2017, 2025, "טורבו בנזין / 2.4 בנזין / פלאג-אין", "—", ["petrol", "phev"], 8.5, null, undefined, [C.history, C.inspect]),
      T("Gen3", 2025, null, "1.2 טורבו מיילד-היברידי", "145", ["petrol"], 7.5, null, undefined, [C.history, C.recalls], "במבחן דרך: כ-13.3 ק\"מ לליטר"),
    ]},
    { id: "wrangler", make: "jeep", model: "Wrangler", he: "רנגלר", body: "suv", segment: "premium", price: [349900, 429900], status: "on_sale", gens: [
      T("JK", 2010, 2018, "3.6 V6 בנזין / 2.8 דיזל", "200–285", ["petrol", "diesel"], 13.0, null, undefined, [C.history, C.inspect, C.suspension]),
      T("JL", 2018, null, "2.0 טורבו בנזין / 4xe פלאג-אין", "270–380", ["petrol", "phev"], 12.5, null, undefined, [C.history, C.suspension], "במבחן דרך (2.0 טורבו): כ-8 ק\"מ לליטר"),
    ]},
    { id: "grand-cherokee", make: "jeep", model: "Grand Cherokee", he: "גרנד צ'ירוקי", body: "suv", segment: "premium", price: [414900, 414900], status: "on_sale", gens: [
      T("WK2", 2011, 2021, "3.6 V6 בנזין / 3.0 דיזל / V8", "191–717", ["petrol", "diesel"], 13.0, null, undefined, [C.history, C.inspect]),
      T("WL", 2022, null, "2.0 טורבו", "329", ["petrol"], 11.6, 5, 2022, [C.history], "במבחן דרך: 8.6 ק\"מ לליטר"),
    ]},
  ]},

  { id: "fiat", name: "Fiat", he: "פיאט", models: [
    { id: "grande-panda", make: "fiat", model: "Grande Panda", he: "גרנדה פנדה", body: "city", segment: "mass", price: [119000, 126000], status: "on_sale", gens: [
      T("Gen1", 2025, null, "1.2 טורבו בנזין", "110", ["petrol"], 6.5, null, undefined, [C.history, C.recalls]),
    ]},
    { id: "doblo", make: "fiat", model: "Doblò", he: "דובלו", body: "mpv", segment: "mass", price: [169990, 179990], status: "on_sale", gens: [
      T("263", 2010, 2022, "1.4 בנזין / 1.3–2.0 דיזל", "90–135", ["petrol", "diesel"], 7.5, 3, 2017, [C.history, C.inspect]),
      T("Gen3", 2022, null, "1.5 דיזל", "130", ["diesel"], 6.0, 4, 2018, [C.history], "דירוג Euro NCAP של הפלטפורמה המשותפת (2018). Maxi Combi 7 מקומות: ₪179,990"),
    ]},
  ]},

  { id: "kgm", name: "KGM (SsangYong)", he: "KGM (סאנגיונג)", models: [
    { id: "tivoli", make: "kgm", model: "Tivoli", he: "טיבולי", body: "suv", segment: "mass", price: [139900, 139900], status: "on_sale", gens: [
      T("X100", 2015, null, "1.6 בנזין / 1.5 טורבו (מ-2019)", "163 (1.5 טורבו)", ["petrol"], 7.7, null, undefined, [C.history, C.inspect], "במבחן דרך: כ-13 ק\"מ לליטר"),
    ]},
    { id: "torres", make: "kgm", model: "Torres", he: "טורס", body: "suv", segment: "mass", price: [169900, 189900], status: "on_sale", gens: [
      T("J100", 2022, null, "1.5 טורבו / 1.5 טורבו היברידי", "170–204", ["petrol", "hybrid"], 6.8, null, undefined, [C.history, C.hyHybrid]),
    ]},
    { id: "rexton", make: "kgm", model: "Rexton", he: "רקסטון", body: "suv7", segment: "mass", price: [219900, 299900], status: "on_sale", gens: [
      T("Y400", 2017, null, "2.2 דיזל", "181–202", ["diesel"], 9.5, null, undefined, [C.history, C.inspect, C.suspension], "במבחן דרך: 9.3–12.4 ק\"מ לליטר"),
    ]},
    { id: "musso", make: "kgm", model: "Musso", he: "מוסו", body: "pickup", segment: "mass", price: [274900, 274900], status: "on_sale", gens: [
      T("Q200", 2018, 2025, "2.2 טורבו דיזל", "181–202", ["diesel"], 10.0, null, undefined, [C.history, C.inspect, C.suspension]),
      T("Q300", 2026, null, "2.2 טורבו דיזל, אוטומטית 6", "202", ["diesel"], 10.0, null, undefined, [C.history, C.recalls], "הדור השני הושק בישראל ביולי 2026"),
    ]},
    { id: "musso-ev", make: "kgm", model: "Musso EV", he: "מוסו EV", body: "pickup", segment: "mass", price: [239900, 259900], status: "on_sale", gens: [
      T("O100", 2025, null, "חשמלי, סוללה 80.6 קוט\"ש", "204–414", ["ev"], 23.0, null, undefined, [C.ev, C.suspension], "ההספק במפרט הישראלי (207/414 כ\"ס) שונה מוויקיפדיה (204/357)"),
    ]},
  ]},

  { id: "isuzu", name: "Isuzu", he: "איסוזו", models: [
    { id: "d-max", make: "isuzu", model: "D-Max", he: "די-מקס", body: "pickup", segment: "mass", price: [259990, 312990], status: "on_sale", gens: [
      T("Gen2", 2011, 2019, "2.5 טורבו דיזל", "117–163", ["diesel"], 9.5, null, undefined, [C.history, C.inspect, C.suspension]),
      T("Gen3", 2019, null, "1.9 / 2.2 טורבו דיזל", "150–163", ["diesel"], 9.5, 5, 2020, [C.history, C.suspension], "בישראל: תא בודד ₪259,990, תא כפול ₪280,990–312,990"),
    ]},
  ]},

  { id: "land-rover", name: "Land Rover", he: "לנד רובר", models: [
    { id: "evoque", make: "land-rover", model: "Range Rover Evoque", he: "ריינג' רובר איווק", body: "suv", segment: "premium", price: [389000, 389000], status: "on_sale", gens: [
      T("L538", 2011, 2018, "2.0 טורבו בנזין / 2.2 דיזל", "150–240", ["petrol", "diesel"], 9.5, 5, 2011, [C.history, C.inspect]),
      T("L551", 2019, null, "2.0 טורבו בנזין", "250", ["petrol"], 10.0, 5, 2019, [C.history, C.recalls]),
    ]},
    { id: "discovery-sport", make: "land-rover", model: "Discovery Sport", he: "דיסקברי ספורט", body: "suv7", segment: "premium", price: [437900, 437900], status: "on_sale", gens: [
      T("L550", 2014, null, "2.0 טורבו בנזין / 2.0 דיזל", "150–250", ["petrol", "diesel"], 8.5, 5, 2014, [C.history, C.inspect, C.recalls]),
    ]},
    { id: "defender", make: "land-rover", model: "Defender", he: "דיפנדר", body: "suv", segment: "premium", price: [495000, 1150000], status: "on_sale", gens: [
      T("L663", 2020, null, "2.0 טורבו בנזין / 3.0 דיזל", "200–400", ["petrol", "diesel"], 10.0, 5, 2020, [C.history, C.recalls], "מחיר: Defender 110. Defender 90: ₪529,000–668,000; Defender 130: ₪726,600. במבחן דרך (3.0 דיזל): כ-10 ק\"מ לליטר"),
    ]},
    { id: "velar", make: "land-rover", model: "Range Rover Velar", he: "ריינג' רובר וולאר", body: "suv", segment: "premium", price: [530900, 586400], status: "on_sale", gens: [
      T("L560", 2017, null, "2.0 טורבו / 3.0 טורבו בנזין / דיזל / פלאג-אין", "250–550", ["petrol", "diesel", "phev"], 11.0, 5, 2017, [C.history, C.recalls, C.airSusp], "במחירון 2026: P400 (3.0 טורבו, 400 כ\"ס) בלבד"),
    ]},
    { id: "range-rover-sport", make: "land-rover", model: "Range Rover Sport", he: "ריינג' רובר ספורט", body: "suv", segment: "premium", price: null, status: "on_sale", gens: [
      T("L320", 2010, 2013, "3.0 דיזל / 5.0 V8", "245–510", ["diesel", "petrol"], 12.5, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("L494", 2013, 2022, "3.0 דיזל / 3.0 בנזין / 5.0 V8 / פלאג-אין", "258–575", ["diesel", "petrol", "phev"], 10.0, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("L461", 2022, null, "3.0 דיזל מיילד-היברידי / פלאג-אין / 4.4 V8", "250–635", ["diesel", "phev", "petrol"], 9.0, 5, 2022, [C.history, C.recalls, C.airSusp], "מחיר לא מוצג: carzone (₪699,000–1,500,000) ו-cartube (₪711,000–1,115,600) לא מסכימים"),
    ]},
    { id: "range-rover", make: "land-rover", model: "Range Rover", he: "ריינג' רובר", body: "suv", segment: "premium", price: null, status: "on_sale", gens: [
      T("L322", 2010, 2012, "5.0 V8 / 4.4 TDV8 דיזל", "309–503", ["petrol", "diesel"], 14.0, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("L405", 2013, 2021, "3.0 V6 / 5.0 V8 / 3.0 ו-4.4 דיזל / היברידי / פלאג-אין", "250–565", ["petrol", "diesel", "hybrid", "phev"], 11.5, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("L460", 2022, null, "3.0 טורבו מיילד-היברידי / 4.4 V8 / 3.0 דיזל / פלאג-אין", "246–607", ["petrol", "diesel", "hybrid", "phev"], 10.5, 5, 2022, [C.history, C.recalls, C.airSusp], "מחיר לא מוצג: carzone (₪949,000–1,782,000) ו-cartube (₪1,225,400–1,452,900) לא מסכימים"),
    ]},
    { id: "discovery", make: "land-rover", model: "Discovery", he: "דיסקברי", body: "suv7", segment: "premium", price: [710000, 710000], status: "on_sale", gens: [
      T("L319", 2010, 2016, "2.7 / 3.0 דיזל, 5.0 V8, 3.0 סופרצ'רג'ר", "187–370", ["diesel", "petrol"], 12.0, null, undefined, [C.history, C.inspect, C.airSusp], "Discovery 4"),
      T("L462", 2017, null, "3.0 דיזל / 2.0–3.0 בנזין (מיילד-היברידי מ-2021)", "249–355", ["diesel", "petrol", "hybrid"], 10.0, 5, 2017, [C.history, C.recalls, C.airSusp], "Discovery 5; הספקים לגרסאות 2021 ואילך. במחירון: D250 SE Dynamic (ב-cartube ‏₪711,000)"),
    ]},
  ]},

  { id: "porsche", name: "Porsche", he: "פורשה", models: [
    { id: "macan", make: "porsche", model: "Macan", he: "מקאן", body: "suv", segment: "premium", price: [587000, 877000], status: "on_sale", gens: [
      T("95B", 2014, 2024, "2.0 טורבו / 3.0 V6 טורבו", "252–440", ["petrol"], 10.5, null, undefined, [C.history, C.inspect]),
      T("Macan Electric", 2024, null, "חשמלי", "360 ומעלה", ["ev"], 20.0, 5, 2024, [C.ev], "במחירון הישראלי 2026 מופיעה רק הגרסה החשמלית"),
    ]},
    { id: "cayenne", make: "porsche", model: "Cayenne", he: "קאיין", body: "suv", segment: "premium", price: [787000, 1507000], status: "on_sale", gens: [
      T("92A", 2010, 2017, "3.6 V6 / 4.8 V8 / 3.0 דיזל / היברידי", "240–570", ["petrol", "diesel", "hybrid"], 13.0, null, undefined, [C.history, C.inspect]),
      T("9Y0", 2018, null, "3.0 V6 טורבו / פלאג-אין", "340–739", ["petrol", "phev"], 12.0, null, undefined, [C.history], "Cayenne Electric: ₪737,000–1,237,000"),
    ]},
    { id: "taycan", make: "porsche", model: "Taycan", he: "טייקן", body: "sedan", segment: "premium", price: null, status: "on_sale", gens: [
      T("9J1", 2019, null, "חשמלי, סוללה 79–105 קוט\"ש", "402–1,019", ["ev"], 22.5, 5, 2019, [C.ev, C.history], "כולל Sport Turismo ו-Cross Turismo; מתיחת פנים 2024. מחיר לא מוצג: carzone (₪757,000–1,897,000) ו-cartube (₪700,000–1,550,000) לא מסכימים"),
    ]},
    { id: "panamera", make: "porsche", model: "Panamera", he: "פנמרה", body: "sedan", segment: "premium", price: null, status: "on_sale", gens: [
      T("970", 2010, 2016, "3.6 V6 / 3.0 V6 טורבו / 4.8 V8 / דיזל / היברידי / פלאג-אין", "250–570", ["petrol", "diesel", "hybrid", "phev"], 11.5, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("971", 2017, 2024, "2.9 V6 / 4.0 V8 טורבו / דיזל (עד 2018) / פלאג-אין", "330–700", ["petrol", "diesel", "phev"], 10.5, null, undefined, [C.history, C.inspect, C.airSusp]),
      T("976", 2024, null, "2.9 V6 / 4.0 V8 טורבו / פלאג-אין", "353–782", ["petrol", "phev"], 10.0, null, undefined, [C.history, C.recalls, C.airSusp], "מחיר לא מוצג: carzone (₪867,000–1,897,000) ו-cartube (₪790,000–1,570,000) לא מסכימים"),
    ]},
  ]},

  { id: "alfa-romeo", name: "Alfa Romeo", he: "אלפא רומיאו", models: [
    { id: "junior", make: "alfa-romeo", model: "Junior", he: "ג'וניור", body: "suv", segment: "premium", price: [174900, 202900], status: "on_sale", gens: [
      T("966", 2024, null, "1.2 טורבו מיילד-היברידי (Ibrida)", "136", ["petrol"], 6.7, null, undefined, [C.history, C.dct], "במבחן דרך: כ-15 ק\"מ לליטר"),
    ]},
    { id: "giulia", make: "alfa-romeo", model: "Giulia", he: "ג'וליה", body: "sedan", segment: "premium", price: [339990, 339990], status: "on_sale", gens: [
      T("952", 2016, null, "2.0 טורבו בנזין / 2.2 דיזל / 2.9 V6 (Quadrifoglio)", "134–533", ["petrol", "diesel"], 8.5, 5, 2016, [C.history, C.recalls], "במחירון: Veloce 2.0 4x4 (ב-cartube ‏₪339,990–369,990); Quadrifoglio ‏₪729,900 בנפרד. מתיחת פנים 2024"),
    ]},
    { id: "stelvio", make: "alfa-romeo", model: "Stelvio", he: "סטלביו", body: "suv", segment: "premium", price: null, status: "unverified", gens: [
      T("949", 2017, null, "2.0 טורבו בנזין / 2.2 דיזל / 2.9 V6 (Quadrifoglio)", "148–513", ["petrol", "diesel"], 9.5, 5, 2017, [C.history, C.recalls], "לא מופיע בעמוד המותג ב-carzone; ב-cartube ‏₪369,990–399,990. מתיחת פנים 2023"),
    ]},
  ]},

  { id: "deepal", name: "Deepal", he: "דיפאל", models: [
    { id: "s05", make: "deepal", model: "S05", he: "S05", body: "suv", segment: "mass", price: [149990, 189990], status: "on_sale", gens: [
      T("C857", 2024, null, "חשמלי, סוללה 56.1–68.8 קוט\"ש / פלאג-אין עם מאריך טווח 1.5", "218–435", ["ev"], 17.5, 5, 2025, [C.ev, C.newBrand], "מותג של Changan. במחירון גם גרסת פלאג-אין (מאריך טווח) ‏₪154,990–164,990"),
    ]},
  ]},
];

/** Yad2 vehicles search URL for a make/model (free-text; the user filters by year there). */
export const yad2Search = (make: Make, m: ModelLine) =>
  `https://www.yad2.co.il/vehicles/cars?text=${encodeURIComponent(`${make.he} ${m.he}`)}`;
