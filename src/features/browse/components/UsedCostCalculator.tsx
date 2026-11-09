import { useReportPrice, type PriceYear } from "../hooks/usePriceReports";
import { estimatedValue, priceWhenNew } from "../model/usedValue";
import type { Pick } from "./MonthlyAtAGlance";
import { PricesSeen } from "./PricesSeen";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Make, ModelLine, Powertrain } from "../../../data/generations";
import { factsFor } from "../../../data/facts";
import { card, field } from "../../../shared/styles";
import { FIRST_YEAR, genYears, numberHe, POWERTRAIN_HE, shekel } from "../model/labels";
import { estimateUsedCost, PRICES, yearsOf } from "../model/usedCost";
import { CostBars } from "./CostBars";

const KM_OPTIONS = [7000, 10000, 15000, 20000, 25000, 30000];
const label = "text-[14px] font-semibold text-muted";

/** "How much will it cost me a month?" for a used car: pick generation, year, powertrain, enter the asking price. */
export function UsedCostCalculator({ make, model, reported = [], pick, initialKm = 15000 }: { make: Make; model: ModelLine; reported?: PriceYear[]; pick?: Pick | null; initialKm?: number }) {
  const [genIndex, setGenIndex] = useState(model.gens.length - 1);
  const gen = model.gens[genIndex];
  const years = useMemo(() => yearsOf(gen, FIRST_YEAR), [gen]);
  const [year, setYear] = useState(years[years.length - 1]);
  const [powertrain, setPowertrain] = useState<Powertrain>(gen.pt[0]);
  const [price, setPrice] = useState("");
  const [km, setKm] = useState(initialKm);
  const pendingYear = useRef<number | null>(null);

  // A different generation has different years and powertrains: reset those choices.
  useEffect(() => { setYear(pendingYear.current ?? years[years.length - 1]); pendingYear.current = null; setPowertrain(gen.pt[0]); }, [genIndex]); // eslint-disable-line react-hooks/exhaustive-deps
  // "פירוט" in the at-a-glance table: jump to that generation, year and price.
  useEffect(() => {
    if (!pick) return;
    const i = model.gens.findIndex((g) => g.code === pick.genCode);
    if (i < 0) return;
    if (i === genIndex) setYear(pick.year); else { pendingYear.current = pick.year; setGenIndex(i); }
    setPrice(pick.price.toLocaleString("he-IL"));
  }, [pick]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => setKm(initialKm), [initialKm]);

  const typedPrice = Number(price.replace(/[^\d]/g, ""));
  // No price typed yet → visitors' reported price for that year, else our estimate (clearly labelled), so there's always an answer.
  const fallbackPrice = reported.find((r) => r.year === year)?.median ?? estimatedValue(make, model, gen, year) ?? 0;
  const askingPrice = typedPrice || fallbackPrice;
  const maintenanceItems = factsFor(make.id, model.id, gen.code).maintenance;
  useReportPrice({ makeId: make.id, modelId: model.id, genCode: gen.code, year, price: typedPrice, source: "calc" }); // only what the visitor typed
  const cost = estimateUsedCost({ gen, segment: model.segment, year, powertrain, askingPrice, kmPerYear: km, body: model.body, maintenanceItems, priceNew: priceWhenNew(make, model, gen, year) });

  return (
    <section className={`${card} p-5 sm:p-6`} aria-labelledby="calc-h">
      <h2 id="calc-h" className="text-xl">כמה יעלה לי בחודש? מצאתם {make.he} {model.he} יד שנייה</h2>
      <p className="mt-1 text-[15px] text-muted">הכניסו את המחיר שמבקשים מכם ונחשב עלות חודשית משוערת.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className={label}>דור<select value={genIndex} onChange={(e) => setGenIndex(Number(e.target.value))} className={field}>{model.gens.map((g, i) => <option key={g.code} value={i}>{genYears(g.from, g.to)} ({g.code})</option>)}</select></label>
        <label className={label}>שנת ייצור<select value={year} onChange={(e) => setYear(Number(e.target.value))} className={field}>{years.map((y) => <option key={y}>{y}</option>)}</select></label>
        <label className={label}>הנעה<select value={powertrain} onChange={(e) => setPowertrain(e.target.value as Powertrain)} className={field}>{gen.pt.map((p) => <option key={p} value={p}>{POWERTRAIN_HE[p]}</option>)}</select></label>
        <label className={label}>מחיר מבוקש (₪)<input inputMode="numeric" dir="ltr" placeholder={fallbackPrice ? fallbackPrice.toLocaleString("he-IL") : "85,000"} value={price} onChange={(e) => setPrice(e.target.value)} className={field} /></label>
        <label className={label}>ק"מ בשנה<select value={km} onChange={(e) => setKm(Number(e.target.value))} className={field}>{KM_OPTIONS.map((k) => <option key={k} value={k}>{numberHe(k)}</option>)}</select></label>
      </div>
      {cost ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[auto_1fr] lg:items-center">
          <div>
            <p className="text-[14px] text-muted">עלות חודשית משוערת</p>
            <p className="num text-[2.6rem] leading-none text-go">{shekel(cost.total)}</p>
            {!typedPrice && <p className="mt-1 text-[13px] font-semibold text-muted">לפי מחיר משוער של {shekel(askingPrice)} — הכניסו את המחיר שקיבלתם לחישוב מדויק</p>}
            <p className="mt-1 text-[13px] text-muted">ירידת ערך שנתית מוערכת: {Math.round(cost.depreciationRate * 100)}%</p>
          </div>
          <CostBars cost={cost} />
          {cost.maintenanceItems.length > 0 && (
            <p className="text-[13px] text-muted lg:col-span-2">הטיפולים כוללים לפי הנתונים של הדור: {cost.maintenanceItems.map((s) => `${s.item.he.split(/[,:(]/)[0].trim()} (≈${shekel(s.monthly)} בחודש)`).join(" · ")}.</p>
          )}
        </div>
      ) : <p className="mt-5 rounded-xl bg-mist px-4 py-3 text-[15px] text-muted">הכניסו מחיר כדי לראות את החישוב.</p>}
      <PricesSeen years={reported} name={`${make.he} ${model.he}`} />
      <p className="mt-4 text-[13px] text-muted">
        המחיר שתכניסו נשמר בלי שום פרט מזהה (רק דגם, שנה ומחיר) כדי להציג לגולשים אחרים מחירים מהשוק.{" "}
        כל המספרים הם הערכה בלבד: צריכה לפי ממוצע בפועל לדור, דלק ₪{PRICES.petrolPerL.toFixed(2)} לליטר, חשמל ₪{PRICES.electricityPerKwh} לקוט"ש, ביטוח לפי שווי הרכב, הספק וסוג הרכב (לא הצעת מחיר).
        כדאי להשוות את המחיר המבוקש למחירון —{" "}
        <a className="underline" href="https://www.yad2.co.il/price-list" target="_blank" rel="noopener noreferrer">מחירון יד2</a> (חינם),{" "}
        <a className="underline" href="https://carlistprice.mot.gov.il/" target="_blank" rel="noopener noreferrer">מחירון משרד התחבורה</a> או לוי יצחק — ולבצע בדיקה במכון לפני קנייה.
      </p>
    </section>
  );
}
