/**
 * The guides: slug, title and description. Pure data (no React, no facts import) so scripts/build-seo.mjs can
 * list them in the sitemap with the same titles the pages set.
 */
export type GuideMeta = { slug: string; title: string; description: string; short: string };

export const GUIDES: GuideMeta[] = [
  { slug: "used-car-checklist", short: "צ׳קליסט לקניית רכב יד שנייה",
    title: "צ׳קליסט לקניית רכב יד שנייה: מה לבדוק, בסדר הנכון",
    description: "מה בודקים לפני שקונים רכב יד שנייה: מספר רישוי, בעלויות, קריאות שירות, היסטוריית טיפולים, מכון בדיקה ונסיעת מבחן — ומה עולה בחודש." },
  { slug: "common-problems-popular-used", short: "בעיות מוכרות בדגמים הפופולריים",
    title: "בעיות מוכרות בדגמי יד שנייה הפופולריים בישראל — עם מקורות",
    description: "קריאות שירות ובעיות שדווחו בהרחבה בדגמים הנפוצים ביד שנייה, לפי דור, עם מקור לכל בעיה — ומה לבדוק לפני קנייה." },
  { slug: "most-economical-used", short: "יד שנייה הכי חסכוניים בדלק",
    title: "רכבי יד שנייה הכי חסכוניים בדלק — לפי צריכה אמיתית של נהגים",
    description: "הדורות והמנועים עם הצריכה הנמוכה ביותר בפועל (ממוצעי נהגים, לא נתון יצרן), וכמה הדלק עולה בחודש במחיר היום." },
  { slug: "new-cars-cheapest-monthly", short: "חדשים: הכי זולים להחזקה",
    title: "הרכבים החדשים הכי זולים להחזקה בחודש — לא רק במחיר",
    description: "דירוג רכבים חדשים לפי עלות חודשית כוללת: דלק, ביטוח (הערכה), טיפולים, ירידת ערך ורישוי, ב־15,000 ק״מ בשנה." },
  { slug: "hybrid-vs-petrol", short: "היברידי או בנזין?",
    title: "היברידי או בנזין — מה זול יותר בחודש, ומתי זה משתלם?",
    description: "השוואה לפי הנתונים: כמה חוסך היברידי בדלק ב־7,000, 15,000 ו־25,000 ק״מ בשנה, ומה המחיר הנוסף ברכישה." },
  { slug: "ev-vs-petrol-cost", short: "חשמלי מול בנזין: עלות אנרגיה",
    title: "כמה עולה לנסוע ברכב חשמלי לעומת בנזין — חישוב לפי המחירים היום",
    description: "עלות ל־100 ק״מ ולחודש: טעינה בבית בתעריף החשמל הביתי מול בנזין 95 במחיר המרבי, לפי מחירים רשמיים מעודכנים." },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug) ?? null;
