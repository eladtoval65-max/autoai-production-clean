import { useEffect, useMemo, useState } from "react";
import type { Make, ModelLine, Powertrain } from "../../../data/generations";
import { card, field } from "../../../shared/styles";
import { FIRST_YEAR, genYears, numberHe, POWERTRAIN_HE, shekel } from "../model/labels";
import { estimateUsedCost, PRICES, yearsOf, type UsedCost } from "../model/usedCost";

const KM_OPTIONS = [7000, 10000, 15000, 20000, 25000, 30000];
const label = "text-[14px] font-semibold text-muted";

/** Breakdown bars: each component's share of the monthly total. */
function CostBars({ cost }: { cost: UsedCost }) {
  const rows: [string, number][] = [["דלק / חשמל", cost.fuel], ["ירידת ערך", cost.depreciation], ["ביטוח (הערכה)", cost.insurance], ["טיפולים ותיקונים", cost.maintenance], ["רישוי", cost.licence]];
  return (
    <ul className="space-y-1.5">
      {rows.map(([k, v]) => (
        <li key={k} className="grid grid-cols-[120px_1fr_72px] items-center gap-2 text-[14px]">
          <span>{k}</span>
          <span className="h-2.5 rounded-full bg-mist"><span className="block h-2.5 rounded-full bg-go" style={{ width: `${(v / cost.total) * 100}%` }} /></span>
          <span className="num text-end">{shekel(v)}</span>
        </li>
      ))}
    </ul>
  );
}

/** "How much will it cost me a month?" for a used car: pick generation, year, powertrain, enter the asking price. */
export function UsedCostCalculator({ make, model }: { make: Make; model: ModelLine }) {
  const [genIndex, setGenIndex] = useState(model.gens.length - 1);
  const gen = model.gens[genIndex];
  const years = useMemo(() => yearsOf(gen, FIRST_YEAR), [gen]);
  const [year, setYear] = useState(years[years.length - 1]);
  const [powertrain, setPowertrain] = useState<Powertrain>(gen.pt[0]);
  const [price, setPrice] = useState("");
  const [km, setKm] = useState(15000);

  // A different generation has different years and powertrains: reset those choices.
  useEffect(() => { setYear(years[years.length - 1]); setPowertrain(gen.pt[0]); }, [genIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const askingPrice = Number(price.replace(/[^\d]/g, ""));
  const cost = estimateUsedCost({ gen, segment: model.segment, year, powertrain, askingPrice, kmPerYear: km });

  return (
    <section className={`${card} p-5 sm:p-6`} aria-labelledby="calc-h">
      <h2 id="calc-h" className="text-xl">כמה יעלה לי בחודש? מצאתם {make.he} {model.he} יד שנייה</h2>
      <p className="mt-1 text-[15px] text-muted">הכניסו את המחיר שמבקשים מכם ונחשב עלות חודשית משוערת.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className={label}>דור<select value={genIndex} onChange={(e) => setGenIndex(Number(e.target.value))} className={field}>{model.gens.map((g, i) => <option key={g.code} value={i}>{genYears(g.from, g.to)} ({g.code})</option>)}</select></label>
        <label className={label}>שנת ייצור<select value={year} onChange={(e) => setYear(Number(e.target.value))} className={field}>{years.map((y) => <option key={y}>{y}</option>)}</select></label>
        <label className={label}>הנעה<select value={powertrain} onChange={(e) => setPowertrain(e.target.value as Powertrain)} className={field}>{gen.pt.map((p) => <option key={p} value={p}>{POWERTRAIN_HE[p]}</option>)}</select></label>
        <label className={label}>מחיר מבוקש (₪)<input inputMode="numeric" dir="ltr" placeholder="85,000" value={price} onChange={(e) => setPrice(e.target.value)} className={field} /></label>
        <label className={label}>ק"מ בשנה<select value={km} onChange={(e) => setKm(Number(e.target.value))} className={field}>{KM_OPTIONS.map((k) => <option key={k} value={k}>{numberHe(k)}</option>)}</select></label>
      </div>
      {cost ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[auto_1fr] lg:items-center">
          <div>
            <p className="text-[14px] text-muted">עלות חודשית משוערת</p>
            <p className="num text-[2.6rem] leading-none text-go">{shekel(cost.total)}</p>
            <p className="mt-1 text-[13px] text-muted">ירידת ערך שנתית מוערכת: {Math.round(cost.depreciationRate * 100)}%</p>
          </div>
          <CostBars cost={cost} />
        </div>
      ) : <p className="mt-5 rounded-xl bg-mist px-4 py-3 text-[15px] text-muted">הכניסו מחיר כדי לראות את החישוב.</p>}
      <p className="mt-4 text-[13px] text-muted">
        כל המספרים הם הערכה בלבד: צריכה לפי ממוצע בפועל לדור, דלק ₪{PRICES.petrolPerL.toFixed(2)} לליטר, חשמל ₪{PRICES.electricityPerKwh} לקוט"ש, ביטוח לפי שווי הרכב (לא הצעת מחיר).
        כדאי להשוות את המחיר המבוקש למחירון (לוי יצחק) ולבצע בדיקה במכון לפני קנייה.
      </p>
    </section>
  );
}
