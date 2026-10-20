/**
 * Terms of use. The core message for users AND partners: every number on the site is an estimate with a stated
 * source; we are not an importer, dealer, insurer, lender or licensed advisor. Lawyer review before commercial launch.
 */
import { CONSENT_VERSION } from "@shared/leadPolicy";
import { SITE } from "../../shared/siteInfo";
import { LegalPage, OperatorDetails, Section } from "./LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="תנאי שימוש" updated={CONSENT_VERSION}>
      <Section title="מה האתר עושה">
        <p>״{SITE.brand}״ מחשב הערכה של עלות החזקת רכב בחודש (דלק או חשמל, ביטוח, טיפולים, ירידת ערך ורישוי), ממליץ על רכבים לפי התשובות שלכם, ומאפשר להשאיר פנייה. השימוש באתר חינם.</p>
      </Section>
      <Section title="מספרים הם הערכה">
        <ul className="list-disc space-y-2 ps-5">
          <li>מחירי מחירון נבדקים מול מקורות פומביים ומתעדכנים מדי יום, אבל עלולים להשתנות. המחיר הקובע הוא של היבואן או הסוכנות ביום הקנייה.</li>
          <li><b>ביטוח מוצג תמיד כהערכה בלבד, לא כהצעת מחיר.</b> המחיר בפועל תלוי בנהג, בגיל, בעבר הביטוחי ובחברה. איננו סוכן ביטוח ואיננו נותנים ייעוץ ביטוחי.</li>
          <li>חישובי מימון הם דוגמה חשבונית. איננו גוף מלווה, איננו מתווכים באשראי ואיננו נותנים ייעוץ פיננסי. תנאי הלוואה נקבעים רק על ידי הגוף המלווה.</li>
          <li>יועץ הצ׳אט מבוסס בינה מלאכותית ועלול לטעות. לפני החלטה, בדקו את הנתונים מול היבואן, בדיקת רכב מקצועית או בעל מקצוע מוסמך.</li>
        </ul>
      </Section>
      <Section title="מי אנחנו לא">
        <p>איננו יבואן, סוכנות רכב, חברת ביטוח, סוכן ביטוח או חברת מימון. שמות דגמים ויצרנים מופיעים לצורך זיהוי בלבד ואינם מעידים על קשר או חסות. תמונות רכב מגיעות ממקורות ברישיון חופשי, עם קרדיט בעמוד הראשי.</p>
      </Section>
      <Section title="שותפים ופרסום">
        <p>ייתכן שנקבל תשלום מעסק שקיבל פנייה — רק אם הסכמתם להעברה בנפרד. תשלום כזה לא משנה את החישוב או את סדר ההמלצות. אם יופיע באתר תוכן ממומן, הוא יסומן ״ממומן״.</p>
      </Section>
      <Section title="שימוש הוגן">
        <p>אין לאסוף נתונים מהאתר בכמויות באופן אוטומטי, לשלוח פניות בשם אחר, או לנסות לעקוף את מנגנוני האבטחה.</p>
      </Section>
      <Section title="אחריות">
        <p>האתר ניתן כמות שהוא. במידה המרבית שהדין מתיר, מפעיל האתר לא יישא באחריות לנזק שנגרם מהסתמכות על הערכה באתר בלי לבדוק אותה. על התנאים חל הדין הישראלי.</p>
      </Section>
      <Section title="יצירת קשר">
        <OperatorDetails />
      </Section>
    </LegalPage>
  );
}
