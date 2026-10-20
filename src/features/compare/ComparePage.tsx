/**
 * /compare/:slug — "A מול B": which car costs less per month, line by line, at the visitor's yearly mileage.
 * Built for search intent ("קורולה או i20") — the page answers it and offers the full quiz and a consented lead form.
 */
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { PageShell } from "../../shared/ui/PageShell";
import { shekel } from "../browse/model/labels";
import LeadRequestModal from "../leads/LeadRequestModal";
import { CompareTable } from "./components/CompareTable";
import { comparePairs, findPair, hebrewName, monthlyAt, pairMeta, type Pair } from "./model/pairs";

const KM = [7000, 10000, 15000, 20000, 25000];

/** One-sentence answer at the chosen mileage. */
function Verdict({ pair, km }: { pair: Pair; km: number }) {
  const [ta, tb] = [monthlyAt(pair.a, km).total, monthlyAt(pair.b, km).total];
  if (ta === tb) return <p className="text-[18px]">בנסיעה של {new Intl.NumberFormat("he-IL").format(km)} ק״מ בשנה שני הרכבים עולים בערך אותו דבר בחודש.</p>;
  const [cheap, diff] = ta < tb ? [pair.a, tb - ta] : [pair.b, ta - tb];
  return <p className="text-[18px]">בנסיעה של {new Intl.NumberFormat("he-IL").format(km)} ק״מ בשנה, <b>{hebrewName(cheap)}</b> זול בערך ב־<b className="num"><bdi>{shekel(diff)}</bdi></b> בחודש — <span className="num"><bdi>{shekel(diff * 12)}</bdi></span> בשנה (הערכה).</p>;
}

/** Other comparisons that include one of these two cars. */
function Related({ pair }: { pair: Pair }) {
  const related = comparePairs().filter((p) => p.slug !== pair.slug && [p.a.id, p.b.id].some((id) => id === pair.a.id || id === pair.b.id)).slice(0, 6);
  if (!related.length) return null;
  return (
    <section className="mt-10">
      <h2 className="text-xl">השוואות נוספות</h2>
      <ul className="mt-3 flex flex-wrap gap-2">{related.map((p) => <li key={p.slug}><Link href={`/compare/${p.slug}`} className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-[15px] no-underline hover:border-go">{hebrewName(p.a)} מול {hebrewName(p.b)}</Link></li>)}</ul>
    </section>
  );
}

export default function ComparePage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const pair = findPair(slug);
  const [km, setKm] = useState(15000);
  const [lead, setLead] = useState(false);
  useEffect(() => { document.title = pair ? pairMeta(pair).title : "השוואה לא נמצאה | כמה עולה"; window.scrollTo(0, 0); }, [pair]);

  if (!pair) return <PageShell><h1 className="text-2xl">ההשוואה לא נמצאה</h1><Link href="/compare" className="mt-4 inline-block font-bold text-go-deep">לכל ההשוואות</Link></PageShell>;
  const [na, nb] = [hebrewName(pair.a), hebrewName(pair.b)];
  return (
    <PageShell>
      <nav aria-label="פירורי לחם" className="mb-4 text-[14px]"><Link href="/compare" className="text-muted no-underline hover:text-ink">כל ההשוואות</Link></nav>
      <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] leading-tight">{na} מול {nb}: מה עולה פחות בחודש?</h1>
      <div className="mt-4"><Verdict pair={pair} km={km} /></div>
      <label className="mt-6 flex flex-wrap items-center gap-3 text-[15px] font-semibold">כמה ק״מ אתם נוסעים בשנה?
        <select value={km} onChange={(e) => setKm(Number(e.target.value))} className="min-h-11 rounded-xl border border-line bg-white px-3">{KM.map((k) => <option key={k} value={k}>{new Intl.NumberFormat("he-IL").format(k)}</option>)}</select>
      </label>
      <div className="mt-5"><CompareTable pair={pair} km={km} /></div>
      <p className="mt-3 text-[13px] text-muted">הערכות ״כמה עולה״ לפי מחיר מחירון: צריכה ממוצעת, ביטוח לפי שווי הרכב (לא הצעת מחיר), טיפולים וירידת ערך משוערים. רישוי לפי האגרה הרשמית. <Link href="/about" className="underline">איך מחשבים</Link></p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[pair.a, pair.b].map((c) => (
          <section key={c.id} className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-[1.2rem]">{hebrewName(c)}</h2>
            <p className="mt-2 text-[15px] text-muted">{c.why}</p>
          </section>
        ))}
      </div>
      <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-white">
        <div><h2 className="text-[1.3rem]">עדיין מתלבטים?</h2><p className="mt-1 text-[15px] text-[#c3cbd6]">5 שאלות ונדרג לכם את כל הרכבים לפי עלות חודשית — או שנחזור אליכם.</p></div>
        <div className="flex flex-wrap gap-2">
          <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-[#5fd3a7] px-6 text-[16px] font-bold text-ink no-underline hover:bg-[#7fe0bb]">לשאלון</Link>
          <button onClick={() => setLead(true)} className="inline-flex min-h-12 items-center rounded-full border border-white px-6 text-[16px] font-bold text-white">שיחזרו אליי</button>
        </div>
      </section>
      <Related pair={pair} />
      {lead && <LeadRequestModal vehicle={{ id: `compare-${pair.slug}`, make: `${na} מול ${nb}`, match: 0 }} sourcePage="compare_page" onClose={() => setLead(false)} />}
    </PageShell>
  );
}
