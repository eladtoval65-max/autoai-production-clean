/**
 * /sell — tools for private sellers (not a listings board: we don't compete with Yad2).
 * The seller builds a "monthly cost" card for the car they're selling and shares its link / text in their ad.
 * Nothing is saved on our side. Optional: a consented trade-in request.
 */
import { useFacts } from "../../data/useFacts";
import { useEffect, useMemo, useState } from "react";
import { MAKES, type Powertrain } from "../../data/generations";
import { sendEvent } from "../../shared/analytics";
import { card, field } from "../../shared/styles";
import { POWERTRAIN_HE } from "../browse/model/labels";
import LeadRequestModal from "../leads/LeadRequestModal";
import { CardView } from "./components/CardView";
import { PageShell as SellShell } from "../../shared/ui/PageShell";
import { estimateUsedCost } from "../browse/model/usedCost";
import { adText, costInputOf, decodeCard, encodeCard, genForYear, yearsOfModel, type Card } from "./model/sellCard";

const label = "text-[14px] font-semibold text-muted";
const KM = [7000, 10000, 15000, 20000, 25000, 30000];

/** Copies text; falls back to a prompt the user can copy from when the clipboard API is blocked. */
async function copy(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { window.prompt("להעתקה:", text); return false; }
}

export default function SellPage() {
  const [makeId, setMakeId] = useState(MAKES[0].id);
  const make = MAKES.find((m) => m.id === makeId)!;
  useFacts(makeId); // maintenance items for the monthly cost
  const [modelId, setModelId] = useState(make.models[0].id);
  const model = make.models.find((m) => m.id === modelId) ?? make.models[0];
  const years = useMemo(() => yearsOfModel(model), [model]);
  const [year, setYear] = useState(years[0]);
  const gen = genForYear(model, year) ?? model.gens[model.gens.length - 1];
  const [pt, setPt] = useState<Powertrain>(gen.pt[0]);
  const [price, setPrice] = useState("");
  const [km, setKm] = useState(15000);
  const [copied, setCopied] = useState("");
  const [tradeIn, setTradeIn] = useState(false);

  useEffect(() => { document.title = "מוכרים רכב? כרטיס ״כמה עולה בחודש״ למודעה | כמה עולה"; }, []);
  // A different make/model/year changes what's valid below it.
  useEffect(() => { setModelId(make.models[0].id); }, [makeId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setYear(years[0]); }, [modelId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!gen.pt.includes(pt)) setPt(gen.pt[0]); }, [gen]); // eslint-disable-line react-hooks/exhaustive-deps

  const query = encodeCard({ makeId: make.id, modelId: model.id, year, pt, price: Number(price.replace(/[^\d]/g, "")), km });
  const cardData = decodeCard(query, MAKES);
  const url = `${window.location.origin}/sell/card?${query}`;
  const name = `${make.he} ${model.he} ${year}`;

  async function share(kind: "link" | "text", total: number) {
    await copy(kind === "link" ? url : adText(name, total, url));
    setCopied(kind === "link" ? "הקישור הועתק" : "הטקסט הועתק — הדביקו בתיאור המודעה");
    sendEvent("sell_card_copy", "sell", false);
  }

  return (
    <SellShell>
      <h1 className="text-[clamp(1.9rem,4vw,2.8rem)] leading-tight">מוכרים רכב? תנו לקונים לראות כמה הוא יעלה להם בחודש</h1>
      <p className="mt-3 max-w-[60ch] text-[17px] text-muted">קונים מחפשים רכב ״שלא יעלה הרבה״. צרו כרטיס עלות חודשית לרכב שלכם, והוסיפו את הקישור או הטקסט למודעה ביד2 או בכל מקום אחר. בחינם, בלי הרשמה, ואנחנו לא שומרים את הפרטים.</p>

      <div className={`${card} mt-8 grid gap-3 p-5 sm:grid-cols-3 sm:p-6`}>
        <label className={label}>יצרן<select value={makeId} onChange={(e) => setMakeId(e.target.value)} className={field}>{MAKES.map((m) => <option key={m.id} value={m.id}>{m.he}</option>)}</select></label>
        <label className={label}>דגם<select value={model.id} onChange={(e) => setModelId(e.target.value)} className={field}>{make.models.map((m) => <option key={m.id} value={m.id}>{m.he}</option>)}</select></label>
        <label className={label}>שנת ייצור<select value={year} onChange={(e) => setYear(Number(e.target.value))} className={field}>{years.map((y) => <option key={y}>{y}</option>)}</select></label>
        <label className={label}>הנעה<select value={pt} onChange={(e) => setPt(e.target.value as Powertrain)} className={field}>{gen.pt.map((p) => <option key={p} value={p}>{POWERTRAIN_HE[p]}</option>)}</select></label>
        <label className={label}>מחיר מבוקש (₪)<input inputMode="numeric" dir="ltr" placeholder="65,000" value={price} onChange={(e) => setPrice(e.target.value)} className={field} /></label>
        <label className={label}>ק״מ בשנה לחישוב<select value={km} onChange={(e) => setKm(Number(e.target.value))} className={field}>{KM.map((k) => <option key={k} value={k}>{new Intl.NumberFormat("he-IL").format(k)}</option>)}</select></label>
      </div>

      <div className="mt-6">
        {cardData ? <>
          <CardView c={cardData} />
          <ShareButtons onShare={(k) => share(k, totalOf(cardData))} copied={copied} />
        </> : <p className="rounded-xl bg-white px-4 py-3 text-[15px] text-muted">הכניסו מחיר מבוקש כדי ליצור את הכרטיס.</p>}
      </div>

      <section className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-white">
        <div>
          <h2 className="text-[1.3rem]">רוצים למכור מהר, בלי מודעה?</h2>
          <p className="mt-1 text-[15px] text-[#c3cbd6]">השאירו פרטים ונחזור אליכם לגבי הצעת טרייד־אין. הפרטים יועברו לסוחר רק אם תסכימו לכך בנפרד.</p>
        </div>
        <button onClick={() => setTradeIn(true)} className="inline-flex min-h-12 items-center rounded-full bg-[#5fd3a7] px-6 text-[16px] font-bold text-ink hover:bg-[#7fe0bb]">בקשת הצעת טרייד־אין</button>
      </section>
      {tradeIn && <LeadRequestModal vehicle={{ id: `sell-${make.id}-${model.id}`, make: name, match: 0 }} sourcePage="sell_page" defaultType="trade_in" onClose={() => setTradeIn(false)} />}
    </SellShell>
  );
}

/** Monthly total for the share text. */
const totalOf = (c: Card) => estimateUsedCost(costInputOf(c))?.total ?? 0;

/** Copy-link / copy-text buttons with a short confirmation. */
function ShareButtons({ onShare, copied }: { onShare: (kind: "link" | "text") => void; copied: string }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button onClick={() => onShare("text")} className="inline-flex min-h-12 items-center rounded-full bg-go px-6 text-[16px] font-bold text-white hover:bg-go-deep">העתקת טקסט למודעה</button>
      <button onClick={() => onShare("link")} className="inline-flex min-h-12 items-center rounded-full border border-line bg-white px-6 text-[16px] font-bold hover:border-ink">העתקת קישור</button>
      <span role="status" className="text-[15px] font-semibold text-go-deep">{copied}</span>
    </div>
  );
}
