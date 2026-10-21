/**
 * /leasing — private leasing vs buying over the same period, with the visitor's own offer numbers.
 * Maths in model/leasing.ts. Nothing is an offer; the lead form can pass a consented request to ONE leasing company.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { card, field } from "../../shared/styles";
import { PageShell } from "../../shared/ui/PageShell";
import LeadRequestModal from "../leads/LeadRequestModal";
import { compareLease, defaultsFor, type LeaseInput } from "./model/leasing";

const nf = new Intl.NumberFormat("he-IL");
const money = (n: number) => `₪${nf.format(Math.round(n))}`;
const label = "text-[14px] font-semibold text-muted";
const num = (v: string) => Number(v.replace(/[^\d.]/g, "")) || 0;

/** A numeric input bound to one field of the form. */
function NumField({ name, value, onChange, hint, percent }: { name: string; value: number; onChange: (n: number) => void; hint?: string; percent?: boolean }) {
  return (
    <label className={label}>{name}
      {percent
        ? <input type="number" inputMode="decimal" step="0.1" min="0" max="40" dir="ltr" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className={field} />
        : <input inputMode="numeric" dir="ltr" value={value ? nf.format(value) : ""} onChange={(e) => onChange(num(e.target.value))} className={field} />}
      {hint && <span className="mt-1 block text-[12px] font-normal">{hint}</span>}
    </label>
  );
}

function Results({ input }: { input: LeaseInput }) {
  const r = compareLease(input);
  const years = input.months / 12;
  const verdict = r.cheaper === "same" ? "שתי האפשרויות יוצאות בערך אותו דבר."
    : r.cheaper === "lease" ? `ליסינג זול יותר בכ־${money(r.difference)} על פני ${years} שנים.`
      : `קנייה זולה יותר בכ־${money(r.difference)} על פני ${years} שנים.`;
  return (
    <section className={`${card} mt-6 p-5 sm:p-6`} aria-live="polite">
      <h2 className="text-[1.4rem]">{verdict}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-mist p-4">
          <h3 className="text-[1.1rem]">ליסינג</h3>
          <p className="num mt-1 text-[2rem] text-go"><bdi>{money(r.lease.monthly)}</bdi> <span className="text-[15px] text-muted">בחודש בממוצע</span></p>
          <ul className="mt-2 space-y-1 text-[14px]">
            <li>מקדמה + תשלומים: <bdi>{money(input.leaseDown + input.leaseMonthly * input.months)}</bdi></li>
            <li>מה שהליסינג לא כולל: <bdi>{money(r.lease.extras)}</bdi></li>
            <li><b>סה״כ: <bdi>{money(r.lease.total)}</bdi></b> — ובסוף מחזירים את הרכב</li>
          </ul>
        </div>
        <div className="rounded-2xl bg-mist p-4">
          <h3 className="text-[1.1rem]">קנייה</h3>
          <p className="num mt-1 text-[2rem] text-go"><bdi>{money(r.buy.monthly)}</bdi> <span className="text-[15px] text-muted">בחודש בממוצע</span></p>
          <ul className="mt-2 space-y-1 text-[14px]">
            <li>ירידת ערך: <bdi>{money(r.buy.valueLoss)}</bdi></li>
            {r.buy.interest > 0 && <li>ריבית על ההלוואה: <bdi>{money(r.buy.interest)}</bdi> (החזר חודשי <bdi>{money(r.buy.payment)}</bdi>)</li>}
            <li>ביטוח וטיפולים: <bdi>{money(r.buy.running)}</bdi></li>
            <li><b>סה״כ: <bdi>{money(r.buy.total)}</bdi></b> — ובסוף נשאר רכב ששווה בערך <bdi>{money(r.buy.resale)}</bdi></li>
          </ul>
        </div>
      </div>
      <p className="mt-4 text-[13px] text-muted">הערכה בלבד, לא הצעה. דלק או חשמל לא נכללים כי הם זהים בשתי האפשרויות. ירידת הערך בפועל תלויה בדגם, בקילומטראז׳ ובמצב הרכב. כדאי לבדוק בחוזה הליסינג: חריגת קילומטרים, נזקים בהחזרה ועמלת יציאה מוקדמת.</p>
    </section>
  );
}

export default function LeasingPage() {
  useEffect(() => { document.title = "ליסינג פרטי או קנייה — מה זול יותר? מחשבון | כמה עולה"; }, []);
  const [price, setPrice] = useState(150000);
  const d = useMemo(() => defaultsFor(price), [price]);
  const [form, setForm] = useState<Omit<LeaseInput, "price" | "insuranceMonthly" | "maintenanceMonthly" | "depreciationRate">>({
    months: 36, leaseDown: 15000, leaseMonthly: 2500, leaseIncludesInsurance: false, leaseIncludesMaintenance: true, buyDown: 50000, loanRate: 6,
  });
  const [ins, setIns] = useState<number | null>(null);
  const [maint, setMaint] = useState<number | null>(null);
  const [dep, setDep] = useState<number | null>(null);
  const [lead, setLead] = useState(false);
  const set = <K extends keyof typeof form>(k: K) => (v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const input: LeaseInput = { ...form, price, insuranceMonthly: ins ?? d.insuranceMonthly, maintenanceMonthly: maint ?? d.maintenanceMonthly, depreciationRate: dep ?? d.depreciationRate };

  return (
    <PageShell>
      <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] leading-tight">ליסינג פרטי או קנייה — מה זול יותר?</h1>
      <p className="mt-3 max-w-[62ch] text-[17px] text-muted">הכניסו את ההצעה שקיבלתם מחברת הליסינג, ונשווה אותה לקנייה של אותו רכב לאותה תקופה: כמה כסף יוצא בפועל, ומה נשאר לכם בסוף.</p>

      <div className={`${card} mt-6 grid gap-4 p-5 sm:grid-cols-3 sm:p-6`}>
        <NumField name="מחיר הרכב (₪)" value={price} onChange={setPrice} />
        <label className={label}>תקופה<select value={form.months} onChange={(e) => set("months")(Number(e.target.value))} className={field}>{[24, 36, 48].map((m) => <option key={m} value={m}>{m} חודשים</option>)}</select></label>
        <span className="hidden sm:block" />
        <NumField name="ליסינג: מקדמה (₪)" value={form.leaseDown} onChange={set("leaseDown")} />
        <NumField name="ליסינג: תשלום חודשי (₪)" value={form.leaseMonthly} onChange={set("leaseMonthly")} />
        <fieldset className="text-[14px]"><legend className="font-semibold text-muted">הליסינג כולל:</legend>
          <label className="mt-2 flex items-center gap-2"><input type="checkbox" checked={form.leaseIncludesInsurance} onChange={(e) => set("leaseIncludesInsurance")(e.target.checked)} className="h-5 w-5" />ביטוח</label>
          <label className="mt-1 flex items-center gap-2"><input type="checkbox" checked={form.leaseIncludesMaintenance} onChange={(e) => set("leaseIncludesMaintenance")(e.target.checked)} className="h-5 w-5" />טיפולים</label>
        </fieldset>
        <NumField name="קנייה: הון עצמי (₪)" value={form.buyDown} onChange={set("buyDown")} hint="השאר במימון. הון עצמי = מחיר הרכב → קנייה במזומן" />
        <NumField name="קנייה: ריבית שנתית (%)" value={form.loanRate} onChange={set("loanRate")} percent />
        <NumField name="ירידת ערך שנתית (%)" value={dep ?? d.depreciationRate} onChange={setDep} percent hint="הערכה כללית: 10%–15% לרוב הרכבים החדשים" />
        <NumField name="ביטוח בחודש (₪, הערכה)" value={ins ?? d.insuranceMonthly} onChange={setIns} hint="לפי שווי הרכב — לא הצעת מחיר" />
        <NumField name="טיפולים בחודש (₪, הערכה)" value={maint ?? d.maintenanceMonthly} onChange={setMaint} />
      </div>

      <Results input={input} />

      <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-white">
        <div><h2 className="text-[1.3rem]">רוצים הצעת ליסינג להשוואה?</h2><p className="mt-1 text-[15px] text-[#c3cbd6]">השאירו פרטים ונחזור אליכם. הפרטים יועברו לחברת ליסינג אחת רק אם תסכימו לכך בנפרד.</p></div>
        <button onClick={() => setLead(true)} className="inline-flex min-h-12 items-center rounded-full bg-[#5fd3a7] px-6 text-[16px] font-bold text-ink hover:bg-[#7fe0bb]">שיחזרו אליי</button>
      </section>
      <p className="mt-6 text-[15px]"><Link href="/compare" className="underline">השוואת רכבים לפי עלות חודשית</Link> · <Link href="/" className="underline">שאלון המלצה</Link></p>
      {lead && <LeadRequestModal vehicle={{ id: "leasing", make: `ליסינג לרכב בסביבות ${money(price)}`, match: 0 }} sourcePage="leasing_page" defaultType="leasing" budget={price} onClose={() => setLead(false)} />}
    </PageShell>
  );
}
