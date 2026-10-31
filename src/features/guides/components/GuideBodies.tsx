/**
 * The body of each guide. Tables are computed from the site's sourced data (model/data.ts); prose is general,
 * practical guidance. Numbers are estimates and say so; issue lists link to their sources.
 */
import type { ReactElement, ReactNode } from "react";
import { Link } from "wouter";
import { ISSUE_LEVEL_HE } from "../../../data/facts";
import { SourceLink } from "../../browse/components/facts/SourceLink";
import { cheapestNewMonthly, energyExample, fuelTypeAverages, mostEconomicalUsed, popularProblems } from "../model/data";

const ils = (n: number) => `₪${n.toLocaleString("he-IL")}`;
const H2 = ({ children }: { children: ReactNode }) => <h2 className="mt-8 text-[1.35rem]">{children}</h2>;
const P = ({ children }: { children: ReactNode }) => <p className="mt-3 text-[16px] leading-7">{children}</p>;

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="relative mt-4 overflow-x-auto rounded-2xl bg-white" role="region" aria-label="טבלה" tabIndex={0}>
      <table className="w-full min-w-[34rem] text-[15px]">
        <thead><tr className="border-b border-line text-[13px] text-muted">{head.map((h) => <th key={h} className="p-3 text-start font-semibold">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-b border-line last:border-0">{r.map((c, j) => <td key={j} className="p-3">{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function UsedCarChecklist() {
  const steps: [string, ReactNode][] = [
    ["מספר רישוי קודם לכול", <>בקשו מהמוכר את מספר הרישוי ובדקו אותו ב<a href="/#plate">בדיקת הרכב לפי מספר</a>: שנה, גימור, סוג בעלות (ליסינג / השכרה / פרטי), טסט אחרון ותוקף רישיון. אם משהו לא תואם למודעה — זו שאלה ראשונה למוכר.</>],
    ["קריאות שירות פתוחות", "בררו אצל היבואן, לפי מספר השלדה, אם יש קריאת שירות שלא בוצעה. ביצוע קריאת שירות הוא בדרך כלל ללא תשלום."],
    ["בעיות מוכרות לדור הזה", <>בעמוד הדגם ב<Link href="/cars">כל הדגמים</Link> מופיעות בעיות שדווחו לכל דור, עם מקור. שאלו את המוכר ישירות על כל אחת, ובקשו קבלות אם תוקנה.</>],
    ["היסטוריית טיפולים", "ספר טיפולים או קבלות ממוסך. טיפולים בזמן במוסך מורשה הם סימן טוב; פערים ארוכים — סיבה לבדוק יותר לעומק."],
    ["בדיקה במכון לפני הקנייה", "שלדה, תאונות, צבע ומנוע. זו ההוצאה הקטנה שחוסכת את הגדולות — ותנו לבודק את רשימת הבעיות המוכרות של הדגם."],
    ["נסיעת מבחן עם רשימה", "הנעה קרה (רעשים בשניות הראשונות), העברת הילוכים בזחילה, בלימה, היגוי ישר, מיזוג, כל החשמל והמסכים. ברכב היברידי / חשמלי — דו״ח מצב סוללה."],
    ["מה זה יעלה לכם בחודש", <>לא רק המחיר: דלק, ביטוח, טיפולים וירידת ערך. בעמוד הדגם יש מחשבון — מכניסים את המחיר שמבקשים מכם ומקבלים עלות חודשית משוערת.</>],
    ["בדקו את המוכר בעצמכם", "פגשו את המוכר בכתובת שלו, ודאו שהשם ברישיון הרכב תואם, ואל תעבירו כסף לפני שראיתם את הרכב והמסמכים. העברת הבעלות נעשית לפי הנחיות משרד התחבורה."],
  ];
  return (
    <>
      <P>רשימה מעשית, בסדר שבו כדאי לעבור עליה. היא לא מחליפה בדיקה מקצועית — היא עוזרת לשאול את השאלות הנכונות לפני שמשלמים.</P>
      <ol className="mt-5 space-y-3">
        {steps.map(([t, body], i) => (
          <li key={t} className="flex gap-4 rounded-2xl bg-white p-5">
            <span className="num grid h-9 w-9 shrink-0 place-items-center rounded-full bg-go text-white">{i + 1}</span>
            <div><h3 className="text-[1.1rem]">{t}</h3><p className="mt-1 text-[15px] leading-7">{body}</p></div>
          </li>
        ))}
      </ol>
    </>
  );
}

export function CommonProblemsPopular() {
  const models = popularProblems();
  return (
    <>
      <P>הדגמים הנפוצים ביד שנייה, עם הבעיות המתועדות לכל דור: קריאות שירות רשמיות, תקלות שהיצרן הכיר בהן, ובעיות שדווחו בהרחבה. לכל בעיה יש מקור. לא כל רכב סובל מהן — זו רשימה למה לשאול ולבדוק.</P>
      {models.map((m) => (
        <section key={m.href} className="mt-6 rounded-2xl bg-white p-5">
          <h2 className="text-[1.25rem]"><Link href={m.href}>{m.name}</Link></h2>
          {m.gens.map((g) => (
            <div key={g.code} className="mt-3">
              <h3 className="text-[15px] font-bold text-muted">{g.years} <span dir="ltr">{g.code}</span></h3>
              <ul className="mt-1 space-y-1.5">{g.issues.map((it) => (
                <li key={it.he} className="text-[15px] leading-relaxed"><span className="me-1.5 rounded-full bg-mist px-2 py-0.5 text-[12px] font-bold">{ISSUE_LEVEL_HE[it.level]}</span>{it.he} <SourceLink source={it.source} /></li>
              ))}</ul>
            </div>
          ))}
          <Link href={m.href} className="mt-3 inline-block text-[14px] font-bold text-go">כל הדורות, המנועים ומה לבדוק ←</Link>
        </section>
      ))}
    </>
  );
}

export function MostEconomicalUsed() {
  const rows = mostEconomicalUsed();
  return (
    <>
      <P>הצריכה כאן היא ממוצע של נהגים אמיתיים (למשל Spritmonitor), לא הנתון של היצרן — ולכן קרובה יותר למה שתראו בתחנת הדלק. עלות הדלק מחושבת ב־15,000 ק״מ בשנה במחיר המרבי של בנזין 95 היום. רכבי פלאג־אין לא נכללים, כי הצריכה שלהם תלויה בכמה טוענים.</P>
      <Table head={["דגם ודור", "מנוע", "צריכה בפועל", "דלק בחודש", ""]}
        rows={rows.map((r) => [<Link key="n" href={r.href}>{r.name}</Link>, r.engine, `${r.cons} ל׳/100 ק״מ`, <b key="m">{ils(r.month)}</b>, <SourceLink key="s" source={r.source} />])}
      />
      <P>שימו לב: צריכה נמוכה היא רק חלק מהעלות. ביטוח, טיפולים וירידת ערך שונים מדגם לדגם — את התמונה המלאה תראו ב<Link href="/">שאלון</Link> או במחשבון בעמוד כל דגם.</P>
    </>
  );
}

export function NewCheapestMonthly() {
  const rows = cheapestNewMonthly();
  return (
    <>
      <P>המחיר במחירון הוא רק ההתחלה. הדירוג כאן לפי העלות החודשית הכוללת המשוערת ב־15,000 ק״מ בשנה: דלק או חשמל במחיר הרשמי היום, ביטוח (הערכה, לא הצעת מחיר), טיפולים, ירידת ערך ורישוי.</P>
      <Table head={["רכב", "מחיר מחירון", "דלק / חשמל בחודש", "סה״כ בחודש"]}
        rows={rows.map((r) => [<Link key="n" href={`/compare`}>{r.name}</Link>, ils(r.price), ils(r.fuel), <b key="t">{ils(r.monthly)}</b>])} />
      <P>רוצים דירוג לפי מה שחשוב לכם — תקציב, שימוש, הנעה וכמה אתם נוסעים? <Link href="/">שש שאלות בשאלון</Link>.</P>
    </>
  );
}

export function HybridVsPetrol() {
  const avg = fuelTypeAverages();
  const hy = avg.find((a) => a.type === "Hybrid")!, pe = avg.find((a) => a.type === "Petrol")!;
  const label = { Hybrid: "היברידי", Petrol: "בנזין", Electric: "חשמלי" } as const;
  return (
    <>
      <P>היברידי חוסך בעיקר בעיר ובפקקים, שם המנוע החשמלי עובד הכי הרבה. בכביש מהיר החיסכון קטן יותר. השאלה היא אם החיסכון בדלק מכסה את מחיר הרכישה הגבוה יותר — וזה תלוי בכמה אתם נוסעים.</P>
      <H2>ממוצע עלות דלק בחודש בקטלוג שלנו</H2>
      <Table head={["הנעה", "רכבים", "מחיר ממוצע", "7,000 ק״מ", "15,000 ק״מ", "25,000 ק״מ"]}
        rows={avg.map((a) => [label[a.type], a.n, ils(a.price), ils(a.km7), ils(a.km15), ils(a.km25)])} />
      <P>בממוצע, ב־15,000 ק״מ בשנה ההפרש בדלק בין היברידי לבנזין הוא כ־{ils(Math.max(0, pe.km15 - hy.km15))} בחודש, וב־25,000 ק״מ כ־{ils(Math.max(0, pe.km25 - hy.km25))}. הממוצעים מערבבים דגמים בגדלים שונים, ולכן הם כיוון כללי — להשוואה מדויקת של שני דגמים ספציפיים השתמשו ב<Link href="/compare">השוואות</Link>.</P>
      <H2>כלל אצבע</H2>
      <ul className="mt-3 list-disc space-y-1.5 ps-5 text-[16px] leading-7">
        <li>נוסעים מעט (עד 10,000 ק״מ) ובעיקר בכביש בין־עירוני — בנזין יכול לצאת זול יותר בסך הכול.</li>
        <li>הרבה עיר ופקקים, או מעל 15,000 ק״מ בשנה — היברידי בדרך כלל מחזיר את ההפרש.</li>
        <li>ביד שנייה, בהיברידי בודקים גם את מצב סוללת ההיברידי — יש דגמים שבהם היבואן נותן דו״ח תקינות.</li>
      </ul>
    </>
  );
}

export function EvVsPetrolCost() {
  const ex = energyExample();
  return (
    <>
      <P>כמה עולה האנרגיה עצמה ל־100 ק״מ ולחודש (15,000 ק״מ בשנה), לפי המחירים הרשמיים היום: בנזין 95 ב־{ils(ex.prices.petrolPerL)} לליטר (<a href={ex.prices.petrolSource.url} target="_blank" rel="noopener noreferrer">משרד האנרגיה</a>), וחשמל ביתי ב־{Math.round(ex.prices.electricityPerKwh * 10000) / 100} אגורות לקוט״ש (<a href={ex.prices.electricitySource.url} target="_blank" rel="noopener noreferrer">תעריף ביתי</a>).</P>
      <Table head={["סוג", "צריכה ל־100 ק״מ", "עלות ל־100 ק״מ", "בחודש"]}
        rows={ex.rows.map((r) => [r.label, r.cons, ils(r.per100), <b key="m">{ils(r.month)}</b>])} />
      <P>הצריכות בטבלה הן דוגמה לרכב משפחתי קומפקטי טיפוסי. הצריכה האמיתית של כל דגם מופיעה בעמוד הדגם, לפי ממוצעי נהגים.</P>
      <H2>מה לקחת בחשבון</H2>
      <ul className="mt-3 list-disc space-y-1.5 ps-5 text-[16px] leading-7">
        <li>החישוב הוא לטעינה בבית. טעינה בעמדות ציבוריות ומהירות יקרה יותר, ומשנה את התמונה למי שאין לו חניה עם שקע.</li>
        <li>אנרגיה היא רק חלק: ברכב חשמלי הטיפולים בדרך כלל זולים יותר, אבל ירידת הערך יכולה להיות מהירה יותר.</li>
        <li>ביד שנייה בודקים דו״ח בריאות סוללה (SoH) — הוא קובע כמה טווח נשאר.</li>
      </ul>
      <P>להשוואה מלאה — אנרגיה, ביטוח, טיפולים וירידת ערך — <Link href="/">בשאלון</Link> או ב<Link href="/compare">השוואות</Link>.</P>
    </>
  );
}

export const GUIDE_BODIES: Record<string, () => ReactElement> = {
  "used-car-checklist": UsedCarChecklist,
  "common-problems-popular-used": CommonProblemsPopular,
  "most-economical-used": MostEconomicalUsed,
  "new-cars-cheapest-monthly": NewCheapestMonthly,
  "hybrid-vs-petrol": HybridVsPetrol,
  "ev-vs-petrol-cost": EvVsPetrolCost,
};
