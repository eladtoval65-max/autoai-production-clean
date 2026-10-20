/**
 * Privacy policy. Describes what the code actually does (lead form, chat, plate lookup, anonymous funnel events,
 * browser storage) — keep it in sync when behaviour changes. Texts of the consents come from leadPolicy.ts.
 * Not legal advice: the owner should have it reviewed by a lawyer before commercial launch.
 */
import { LEAD_CONSENT_TEXT } from "@shared/const";
import { CONSENT_VERSION, DUPLICATE_WINDOW_DAYS, PARTNER_CATEGORY, RETENTION_MONTHS } from "@shared/leadPolicy";
import { SITE } from "../../shared/siteInfo";
import { LegalPage, OperatorDetails, Section } from "./LegalPage";

const categories = [...new Set(Object.values(PARTNER_CATEGORY))];

export default function PrivacyPage() {
  const contact = SITE.contactEmail ? <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> : "כתובת הדוא״ל שבראש העמוד";
  return (
    <LegalPage title="מדיניות פרטיות" updated={CONSENT_VERSION}>
      <Section title="מי אנחנו">
        <p>״{SITE.brand}״ הוא אתר שמחשב כמה באמת עולה להחזיק רכב בחודש, ממליץ על רכבים ומאפשר להשאיר פנייה. בעל השליטה במאגר המידע:</p>
        <OperatorDetails />
      </Section>

      <Section title="מה נאסף, ולמה">
        <ul className="list-disc space-y-2 ps-5">
          <li><b>שימוש באתר בלי להשאיר פרטים:</b> אין צורך להירשם. נאספים אירועי שימוש אנונימיים (למשל ״התחיל שאלון״, ״צפה בתוצאות״), עם מזהה גלישה אקראי ומקור הקמפיין, כדי לדעת איזה חלק באתר עובד. בלי שם, טלפון או כתובת IP.</li>
          <li><b>טופס ״רוצים שנחזור אליכם?״:</b> שם, טלפון נייד, עיר (לא חובה), סוג הבקשה, הרכב, תקציב ומועד רכישה משוער, הדף ומקור הקמפיין. יחד איתם נשמרים זמן ההסכמה, נוסח ההסכמה וגרסתו, גיבוב חד־כיווני של כתובת ה־IP (לא הכתובת עצמה) וזיהוי הדפדפן — כדי שנוכל להוכיח, אם יידרש, שההסכמה ניתנה. המטרה: לחזור אליכם בנוגע לבקשה, ולשפר את השירות.</li>
          <li><b>יועץ הצ׳אט:</b> מה שאתם כותבים נשלח לספק הבינה המלאכותית (Anthropic) כדי לנסח תשובה. איננו שומרים את תוכן השיחה במאגר שלנו. אל תכתבו בצ׳אט פרטים אישיים.</li>
          <li><b>בדיקת לוחית רישוי:</b> המספר נשלח למאגר הרכב הממשלתי (data.gov.il) כדי להציג נתוני רכב פומביים. איננו שומרים אותו.</li>
          <li><b>בדפדפן שלכם בלבד:</b> שפה, רכבים שסימנתם ויומן שימוש מקומי נשמרים באחסון המקומי של הדפדפן ולא נשלחים אלינו. אפשר למחוק אותם בניקוי נתוני האתר בדפדפן. אין עוגיות פרסום.</li>
        </ul>
        <p>מסירת הפרטים בטופס אינה חובה לפי חוק. בלי שם וטלפון לא נוכל לחזור אליכם.</p>
      </Section>

      <Section title="נוסח ההסכמה בטופס">
        <p className="rounded-xl bg-mist p-3 text-[15px]">{LEAD_CONSENT_TEXT}</p>
      </Section>

      <Section title="למי הפרטים מועברים">
        <p>פרטי הפנייה <b>לא מועברים לאף עסק</b>, אלא אם סימנתם בטופס הסכמה נפרדת, שאינה חובה ואינה מסומנת מראש. הסכמה כזו מאפשרת להעביר את שמכם, הטלפון, העיר ופרטי הבקשה <b>לעסק אחד בלבד</b> מהסוג שמופיע בה — לפי סוג הבקשה:</p>
        <ul className="list-disc space-y-1 ps-5">{categories.map((c) => <li key={c}>{c}</li>)}</ul>
        <p>העסק רשאי לפנות אליכם רק בנוגע לאותה בקשה. כל העברה מתועדת אצלנו: מתי, לאיזה עסק, ועל סמך איזו הסכמה. העברה לעסק מסוג אחר תיעשה רק אחרי שתסכימו לכך במפורש (למשל בשיחה), וגם היא תתועד.</p>
        <p>ספקים שפועלים עבורנו בלבד ולא משתמשים במידע לצורכיהם: אחסון האתר (Vercel), מסד הנתונים (TiDB Cloud), שליחת התראות דוא״ל למפעיל (Resend), ויועץ הצ׳אט (Anthropic). חלקם מאחסנים מידע מחוץ לישראל.</p>
        <p>לא נשלח לכם פרסומות בדוא״ל, SMS או הודעות אוטומטיות בלי הסכמה נפרדת לכך.</p>
      </Section>

      <Section title="כמה זמן שומרים">
        <p>פרטי הקשר נשמרים עד {RETENTION_MONTHS} חודשים מיום הפנייה, ואז נמחקים (נשאר רק רישום סטטיסטי בלי פרטים מזהים). פנייה חוזרת מאותו טלפון בתוך {DUPLICATE_WINDOW_DAYS} יום מקושרת לפנייה הראשונה, כדי שלא יפנו אליכם פעמיים על אותו דבר.</p>
      </Section>

      <Section title="הזכויות שלכם">
        <ul className="list-disc space-y-1 ps-5">
          <li>לעיין במידע שנשמר עליכם.</li>
          <li>לבקש לתקן מידע שגוי או למחוק אותו.</li>
          <li>לבטל הסכמה להעברה לעסק — ואז נפסיק להעביר, ונבקש מהעסק שקיבל את הפרטים להפסיק לפנות ולמחוק אותם.</li>
        </ul>
        <p>פונים אל {contact}, עם מספר הטלפון שהשארתם. נשיב בתוך 30 יום. אם לא קיבלתם מענה, אפשר לפנות לרשות להגנת הפרטיות.</p>
      </Section>

      <Section title="אבטחה">
        <p>הגישה לפניות מוגבלת למפעיל האתר בסיסמה, מעל חיבור מוצפן. פרטי קשר לא נרשמים ביומני השרת. אף מערכת אינה חסינה לחלוטין; אם יתגלה אירוע אבטחה חמור, נפעל לפי הדין.</p>
      </Section>
    </LegalPage>
  );
}
