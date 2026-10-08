import { Link } from "wouter";

export default function Privacy() {
  return <main dir="rtl" className="min-h-screen bg-[#0b0e12] px-5 py-10 text-[#edf2f7]">
    <article className="mx-auto max-w-3xl space-y-6 leading-7">
      <Link href="/" className="text-[#79b9ff]">← חזרה לאתר</Link>
      <h1 className="text-3xl font-semibold">מידע על פניות ופרטיות</h1>
      <p>AutoAI מאפשר למבקרים לשלוח בקשה לשיחה על רכב. הטופס אינו חובה לצפייה בהמלצות.</p>
      <h2 className="text-xl font-semibold">מה נשמר?</h2>
      <p>אם בחרת לשלוח פנייה, נשמרים שם, טלפון, עיר אם הוזנה, סוג הבקשה, הרכב המבוקש, תקציב משוער, מועד רכישה משוער, זמן הפנייה ונוסח ההסכמה שאישרת. המידע נגיש למנהל מורשה בלבד לצורך טיפול בבקשה.</p>
      <h2 className="text-xl font-semibold">שיתוף מידע</h2>
      <p>המערכת אינה שולחת פניות אוטומטית לסוכנויות, חברות ביטוח או גורמים חיצוניים. העברה עתידית לשותף תדרוש הודעה והסכמה נפרדת. המידע נשמר במסד הנתונים שהוגדר על ידי מפעיל האתר.</p>
      <h2 className="text-xl font-semibold">בקשת מחיקה או תיקון</h2>
      <p>ניתן לפנות למפעיל האתר בבקשת עיון, תיקון או מחיקה דרך ערוץ הקשר שמופיע באתר או בפרטי העסק הרשמיים של AutoAI.</p>
      <p className="border-t border-[#37414b] pt-4 text-sm text-[#aab6c2]">המידע לעיל מתאר את התנהגות המערכת כרגע; לפני השקה מסחרית נדרשת השלמת מדיניות פרטיות מלאה לפי הדין החל, קביעת תקופת שמירה ופרטי מפעיל האתר.</p>
    </article>
  </main>;
}
