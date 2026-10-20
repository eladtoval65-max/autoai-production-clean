/**
 * "How we calculate" — the methodology page. Built for two audiences:
 *   users (can I trust the number?) and partners/advertisers (is this data credible enough to put our brand next to?).
 * Counts and the verification date are read from the data files, so the page never goes stale.
 */
import { MAKES, PRICES_VERIFIED } from "../../data/generations";
import { STATIC_CATALOG } from "../../data/catalogData";
import { PRICES } from "../browse/model/usedCost";
import { REGISTRATION } from "../home/model/cost";
import { LegalPage, OperatorDetails, Section } from "./LegalPage";

const modelCount = MAKES.reduce((n, m) => n + m.models.length, 0);

export default function AboutPage() {
  return (
    <LegalPage title="איך מחשבים כמה עולה רכב" updated={PRICES_VERIFIED}>
      <Section title="הרעיון">
        <p>מחיר הקנייה הוא רק חלק מהסיפור. אנחנו מחשבים כמה רכב עולה <b>בחודש</b>, לפי כמה אתם נוסעים בשנה, כדי שאפשר יהיה להשוות בין רכבים באמת.</p>
        <p>היום באתר: {MAKES.length} יצרנים, {modelCount} דגמים עם הדורות שלהם מאז 2010, ו־{STATIC_CATALOG.length} רכבים חדשים עם חישוב עלות מלא. מחירים נבדקו לאחרונה ב־{PRICES_VERIFIED}.</p>
      </Section>
      <Section title="חמשת רכיבי העלות">
        <ol className="list-decimal space-y-2 ps-5">
          <li><b>דלק או חשמל</b> — צריכה לפי הדגם (בפועל, לא רק מוצהרת) כפול הקילומטרים, במחיר דלק {PRICES.petrolPerL.toFixed(2)} ₪ לליטר וחשמל {PRICES.electricityPerKwh} ₪ לקוט״ש. בפלאג־אין מניחים שחצי מהנסיעה על חשמל.</li>
          <li><b>ביטוח</b> — הערכה לפי שווי הרכב וסוגו. <b>זו לא הצעת מחיר</b>; המחיר בפועל תלוי בנהג.</li>
          <li><b>טיפולים ותיקונים</b> — הערכה לפי היצרן, הגודל וסוג ההנעה.</li>
          <li><b>ירידת ערך</b> — כמה מהמחיר צפוי ״להיעלם״ בשנים הראשונות, לפי סוג הרכב והמותג.</li>
          <li><b>רישוי</b> — אגרה שנתית מחולקת לחודשים ({REGISTRATION} ₪). זה הרכיב היחיד שהוא נתון רשמי.</li>
        </ol>
      </Section>
      <Section title="מקורות">
        <ul className="list-disc space-y-1 ps-5">
          <li>מחירוני יבואנים כפי שמפורסמים באתרי מחירונים ישראליים — נבדקים כל יום על ידי סוכן עדכון, ונכנסים רק אחרי בדיקת תקינות.</li>
          <li>דירוגי בטיחות: Euro NCAP — מוצגים רק כשאומתו.</li>
          <li>נתוני רכב לפי לוחית: מאגר הרכב הממשלתי (data.gov.il).</li>
          <li>כל מספר באתר מסומן: <b>רשמי</b>, <b>הערכה</b> או <b>חסר</b>. מה שלא אומת לא מוצג כעובדה.</li>
        </ul>
      </Section>
      <Section title="עצמאות">
        <p>הדירוג והחישוב זהים לכל היצרנים. אם בעתיד נקבל תשלום מעסק על פנייה שהעברנו בהסכמתכם, זה לא ישנה את החישוב או את סדר ההמלצות, ותוכן ממומן יסומן ״ממומן״.</p>
        <p>מצאתם טעות במחיר או בנתון? כתבו לנו — נתקן ונציין זאת.</p>
      </Section>
      <Section title="מי מפעיל את האתר">
        <OperatorDetails />
      </Section>
    </LegalPage>
  );
}
