/**
 * Accessibility statement (Equal Rights for Persons with Disabilities regulations, standard IS 5568 / WCAG 2.0 AA).
 * Lists only adjustments that exist in the code, and is honest about what has not been audited yet.
 */
import { SITE, PENDING } from "../../shared/siteInfo";
import { LegalPage, Section } from "./LegalPage";

export default function AccessibilityPage() {
  return (
    <LegalPage title="הצהרת נגישות" updated="2026-10-20">
      <Section title="המחויבות שלנו">
        <p>אנחנו רוצים שכל אחד יוכל לחשב כמה עולה רכב ולהשאיר פנייה, כולל אנשים עם מוגבלות. היעד: עמידה בתקן הישראלי 5568 ברמה AA (מבוסס WCAG 2.0).</p>
      </Section>
      <Section title="מה כבר הותאם">
        <ul className="list-disc space-y-1 ps-5">
          <li>מבנה כותרות היררכי ושפת עמוד מוגדרת (עברית, מימין לשמאל).</li>
          <li>לכל שדה בטופס יש תווית, ושגיאות מוצגות בטקסט ומוכרזות לקורא מסך.</li>
          <li>כפתורים עם אייקון בלבד מתויגים לקורא מסך; חלונות קופצים מסומנים כדיאלוג.</li>
          <li>האתר עובד במקלדת, מותאם לטלפון מרוחב 360 פיקסלים ותומך בהגדלת טקסט בדפדפן עד 200%.</li>
          <li>גודל טקסט בסיסי של 15–17 פיקסלים וניגודיות צבעים גבוהה בטקסט הרץ.</li>
          <li>מידע לא מועבר בצבע בלבד: לכל רכיב עלות יש גם שם וסכום.</li>
          <li>בדיקה אוטומטית (axe, כללי WCAG 2 ברמות A ו־AA) של העמודים הראשיים וטופס הפנייה, 20.10.2026: לא נמצאו הפרות.</li>
        </ul>
      </Section>
      <Section title="מה עוד לא נגיש במלואו">
        <ul className="list-disc space-y-1 ps-5">
          <li>הגרפים בהשוואת הרכבים: המספרים מוצגים גם בטקסט לידם, אך הגרף עצמו אינו מתואר במלואו לקורא מסך.</li>
          <li>יועץ הצ׳אט: תשובות חדשות לא תמיד מוכרזות אוטומטית לקורא מסך.</li>
          <li>חלק מתמונות הרכב מתוארות בשם הדגם בלבד.</li>
          <li>טרם בוצעה בדיקת נגישות מלאה על ידי מורשה נגישות. היא מתוכננת לפני ההשקה המסחרית.</li>
        </ul>
        <p>כל המידע באתר זמין גם בפנייה ישירה אלינו (פרטים למטה), ונשמח לעזור טלפונית או בדוא״ל.</p>
      </Section>
      <Section title="רכז/ת נגישות ויצירת קשר">
        <ul className="list-disc space-y-1 ps-5">
          <li>שם: {SITE.operatorName ?? PENDING}</li>
          <li>דוא״ל: {SITE.contactEmail ? <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> : PENDING}</li>
        </ul>
        <p>נתקלתם בבעיה? כתבו לנו מה ניסיתם לעשות, באיזה עמוד ובאיזה מכשיר ודפדפן. נשיב בתוך 14 יום.</p>
      </Section>
    </LegalPage>
  );
}
