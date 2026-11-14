/**
 * /budget/:amount — "cars up to ₪X", ranked by what they really cost a month (not by sticker price), new and used.
 * The same candidate pool and cost model as the questionnaire; every number is an estimate and labelled so.
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { useFacts } from "../../data/useFacts";
import { shortName } from "../../shared/format";
import { card } from "../../shared/styles";
import { CarPhoto } from "../../shared/ui/CarPhoto";
import { PageShell } from "../../shared/ui/PageShell";
import LeadRequestModal from "../leads/LeadRequestModal";
import { OfferCta } from "../home/components/OfferCta";
import { BUDGETS, budgetLabel, budgetPicks, KM, type Pick } from "./model/budgetPicks";

const nf = new Intl.NumberFormat("he-IL");
const money = (n: number) => `₪${nf.format(Math.round(n))}`;

/** One car: photo, name, price, and the monthly cost as the big number. */
function PickRow({ pick, rank }: { pick: Pick; rank: number }) {
  const { car, monthly } = pick;
  const used = car.condition === "used";
  return (
    <li className="min-w-0">
      <Link href={`${car.href ?? "/cars"}#cost`} className={`${card} flex items-center gap-4 p-3 no-underline hover:ring-2 hover:ring-go/30`}>
        <span className="num w-6 shrink-0 text-center text-[1.1rem] text-muted">{rank}</span>
        <CarPhoto name={car.make} className="h-16 w-24 shrink-0 rounded-xl object-cover" width={192} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[17px] font-extrabold text-ink">{shortName(car.make)}</span>
          <span className="block truncate text-[13px] text-muted">{car.years} · {used ? "≈" : "מ־"}{money(car.price)}{used ? " (הערכה)" : ""}</span>
        </span>
        <span className="shrink-0 text-end"><span className="num block text-[1.35rem] text-go">{money(monthly)}</span><span className="block text-[12px] text-muted">בחודש</span></span>
      </Link>
    </li>
  );
}

export default function BudgetPage() {
  const { amount } = useParams<{ amount: string }>();
  const budget = BUDGETS.find((b) => String(b) === amount) ?? 100000;
  const label = budgetLabel(budget);
  const { version } = useFacts();
  const picks = useMemo(() => budgetPicks(budget), [budget, version]);
  const [tab, setTab] = useState<"used" | "new">(picks.fresh.length ? "new" : "used");
  const [lead, setLead] = useState(false);
  useEffect(() => { document.title = `רכבים עד ${label} — כמה הם באמת עולים בחודש | כמה עולה`; }, [label]);
  const list = tab === "new" ? picks.fresh : picks.used;
  const top = list[0];

  return (
    <PageShell>
      <h1 className="text-[clamp(1.9rem,4.5vw,2.8rem)] leading-tight">רכבים עד {label}: <span className="text-go">מה הכי זול להחזיק?</span></h1>
      <p className="mt-3 max-w-[62ch] text-[17px] text-muted">לא לפי מחיר המדבקה — לפי כמה הרכב באמת עולה כל חודש: דלק או חשמל, ביטוח (הערכה), טיפולים, ירידת ערך ורישוי, ב־{nf.format(KM)} ק״מ בשנה.</p>

      <nav aria-label="תקציב" className="mt-5 flex flex-wrap gap-2">
        {BUDGETS.map((b) => (
          <Link key={b} href={`/budget/${b}`} aria-current={b === budget ? "page" : undefined}
            className={`min-h-11 rounded-full border px-4 py-2 text-[15px] font-bold no-underline ${b === budget ? "border-go bg-go text-white" : "border-line bg-white text-ink hover:border-ink"}`}>עד {budgetLabel(b)}</Link>
        ))}
      </nav>

      <div role="tablist" className="mt-6 inline-flex rounded-full bg-mist p-1">
        {([["new", `חדשים (${picks.fresh.length})`], ["used", `יד שנייה (${picks.used.length})`]] as const).map(([k, t]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-11 rounded-full px-5 text-[15px] font-bold ${tab === k ? "bg-white shadow-sm" : "text-muted"}`}>{t}</button>
        ))}
      </div>

      {list.length ? (
        <ol className="mt-4 grid grid-cols-1 gap-3">{list.map((p, i) => <PickRow key={p.car.id} pick={p} rank={i + 1} />)}</ol>
      ) : (
        <p className={`${card} mt-4 p-5 text-[16px]`}>{tab === "new" ? `אין כרגע רכב חדש עם מחיר מחירון מאומת עד ${label}. ` : "עוד לא נטענו הערכות יד שנייה — רגע אחד. "}נסו {tab === "new" ? "את לשונית יד שנייה" : "תקציב אחר"}.</p>
      )}

      {top && <OfferCta car={top.car} onLead={() => setLead(true)} className="mt-6" />}

      <section className={`${card} mt-6 p-5`}>
        <h2 className="text-[1.25rem]">מתלבטים בין חדש, יד שנייה וליסינג?</h2>
        <p className="mt-1 text-[15px] text-muted">אותו תקציב, שלוש דרכים — וכמה כל אחת עולה בפועל.</p>
        <Link href="/new-used-leasing" className="mt-3 inline-flex min-h-11 items-center rounded-full bg-ink px-5 font-bold text-white no-underline">להשוואה ←</Link>
      </section>
      <p className="mt-4 text-[13px] text-muted">מחירי רכבים חדשים: מחירון היבואן. מחירי יד שנייה: הערכה לפי מחיר ההשקה וירידת ערך ממוצעת — המחיר בפועל תלוי בק״מ, יד ומצב. ביטוח הוא הערכה בלבד ולא הצעת מחיר.</p>
      {lead && top && <LeadRequestModal vehicle={{ id: `budget-${budget}-${top.car.id}`, make: shortName(top.car.make), match: 0 }} sourcePage="budget_page" defaultType={top.car.condition === "used" ? "used_car" : "vehicle"} budget={budget} onClose={() => setLead(false)} />}
    </PageShell>
  );
}
