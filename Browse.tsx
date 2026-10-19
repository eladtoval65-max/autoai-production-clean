/**
 * /cars, /cars/:make, /cars/:make/:model — every model of the 20 main makes in Israel, by generation since 2010.
 * For used buyers: what to check per generation, a live Yad2 search, and a monthly-cost estimate from the asking price.
 * All running costs are estimates; current list prices come from importer price lists (see generations.ts).
 */
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { AlertTriangle, ChevronLeft, ExternalLink, Search, ShieldCheck, Star } from "lucide-react";
import { MAKES, PRICES_VERIFIED, yad2Search, type Generation, type Make, type ModelLine, type Powertrain } from "./generations";
import { wikiPhotoByTitle, type VehiclePhoto } from "./vehicleImages";

const card = "rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]";
const nf = new Intl.NumberFormat("he-IL");
const shekel = (n: number) => `₪${nf.format(Math.round(n))}`;
const THIS_YEAR = 2026;
const PT_HE: Record<Powertrain, string> = { petrol: "בנזין", diesel: "דיזל", hybrid: "היברידי", phev: "פלאג-אין", ev: "חשמלי" };
const STATUS_HE: Record<ModelLine["status"], string> = { on_sale: "נמכר חדש", discontinued: "לא משווק יותר", not_sold_new: "לא נמכר חדש בישראל", unverified: "מחיר לא אומת" };
const WIKI: Record<string, string> = {
  "mazda/mazda3": "Mazda3", "mazda/mazda2": "Mazda2", "jaecoo/jaecoo-7": "Jaecoo J7", "jaecoo/jaecoo-8": "Jaecoo J8", "jaecoo/jaecoo-5": "Jaecoo J5",
  "jaecoo/omoda-5": "Omoda 5", "jaecoo/omoda-e5": "Omoda E5", "chery/tiggo-8": "Chery Tiggo 8", "chery/tiggo-7": "Chery Tiggo 7", "chery/tiggo-4": "Chery Tiggo 4",
  "chery/fx": "Chery Tiggo 7", "mg/zs": "MG ZS (SUV)", "mg/zs-ev": "MG ZS EV", "mg/mg4": "MG4 EV", "mg/mg5": "MG5", "geely/geometry-c": "Geometry C",
  "seat/ibiza": "SEAT Ibiza", "seat/arona": "SEAT Arona", "seat/ateca": "SEAT Ateca", "seat/leon": "SEAT León", "seat/tarraco": "SEAT Tarraco",
  "cupra/cupra-leon": "Cupra León", "cupra/cupra-ateca": "SEAT Ateca", "skoda/octavia": "Škoda Octavia", "skoda/kodiaq": "Škoda Kodiaq",
  "skoda/karoq": "Škoda Karoq", "skoda/kamiq": "Škoda Kamiq", "skoda/superb": "Škoda Superb", "mitsubishi/space-star": "Mitsubishi Mirage",
};
const wikiTitle = (mk: Make, m: ModelLine) => WIKI[`${mk.id}/${m.id}`] ?? `${mk.name === "Omoda & Jaecoo" ? "Jaecoo" : mk.name} ${m.model}`;
const span = (m: ModelLine) => `${Math.max(2010, Math.min(...m.gens.map((g) => g.from)))} עד ${m.gens.some((g) => g.to === null) ? "היום" : Math.max(...m.gens.map((g) => g.to ?? THIS_YEAR))}`;
const range = (a: string | number, b: string | number) => (a === b ? String(a) : `${a} עד ${b}`);
const priceText = (p: [number, number]) => range(shekel(p[0]), shekel(p[1]));
const hpText = (hp: string) => hp.replace(/^(\d+)–(\d+)$/, "$1 עד $2").replace(/^(\d+)–$/, "$1 ומעלה");

function Photo({ title, className = "" }: { title: string; className?: string }) {
  const [p, setP] = useState<VehiclePhoto | null | undefined>(undefined);
  const [bad, setBad] = useState(false);
  useEffect(() => { let live = true; setP(undefined); setBad(false); wikiPhotoByTitle(title).then((x) => live && setP(x)); return () => { live = false; }; }, [title]);
  if (p === undefined) return <div className={`animate-pulse bg-mist ${className}`} />;
  if (!p || bad) return <div className={`bg-gradient-to-b from-[#eef2f6] to-[#e1e7ee] ${className}`} />;
  return (
    <div className={`relative overflow-hidden bg-mist ${className}`}>
      <img src={p.src} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setBad(true)} className="absolute inset-0 h-full w-full object-cover" />
      <a href={p.credit} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 end-2 rounded-full bg-ink/70 px-2 py-0.5 text-[11px] font-semibold text-white no-underline hover:bg-ink">צילום: ויקיפדיה</a>
    </div>
  );
}

function StatusBadge({ m }: { m: ModelLine }) {
  const tone = m.status === "on_sale" ? "bg-go-soft text-go-deep" : m.status === "unverified" ? "bg-[#fff4e8] text-[#9a4b00]" : "bg-mist text-muted";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-bold ${tone}`}>{STATUS_HE[m.status]}</span>;
}

function Ncap({ g }: { g: Generation }) {
  if (g.ncap == null) return <span className="text-[14px] text-muted">Euro NCAP: אין נתון</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-[14px]" aria-label={`Euro NCAP ${g.ncap} כוכבים`}>
      <span className="inline-flex" dir="ltr" aria-hidden>{[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`h-4 w-4 ${i < g.ncap! ? "text-[#f5a524]" : "text-[#d5dbe3]"}`} fill="currentColor" strokeWidth={0} />)}</span>
      <span className="text-muted">Euro NCAP{g.ncapYear ? ` (${g.ncapYear})` : ""}</span>
    </span>
  );
}

// ── Used-car monthly cost (estimate) ──────────────────────────────────────────
function UsedCalc({ m, mk }: { m: ModelLine; mk: Make }) {
  const [gi, setGi] = useState(m.gens.length - 1);
  const g = m.gens[gi];
  const years = useMemo(() => { const a: number[] = []; for (let y = Math.max(2010, g.from); y <= (g.to ?? THIS_YEAR); y++) a.push(y); return a; }, [g]);
  const [year, setYear] = useState(years[years.length - 1]);
  const [pt, setPt] = useState<Powertrain>(g.pt[0]);
  const [price, setPrice] = useState("");
  const [km, setKm] = useState(15000);
  useEffect(() => { setYear(years[years.length - 1]); setPt(g.pt[0]); }, [gi]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = Number(price.replace(/[^\d]/g, ""));
  const r = useMemo(() => {
    if (!value || value < 5000) return null;
    const age = Math.max(0, THIS_YEAR - year);
    const consIsKwh = g.pt[0] === "ev";
    const kwh = consIsKwh ? g.cons : 17, litres = consIsKwh ? 6.5 : g.cons;
    const perKm = pt === "ev" ? (kwh / 100) * 0.55 : pt === "phev" ? 0.5 * (17 / 100) * 0.55 + 0.5 * (litres / 100) * 7.1 : (litres / 100) * (pt === "diesel" ? 7.4 : 7.1);
    const fuel = (perKm * km) / 12;
    const premium = m.segment === "premium";
    let dep = age <= 2 ? 0.13 : age <= 5 ? 0.1 : age <= 9 ? 0.08 : 0.06;
    if (pt === "ev") dep += 0.03; if (premium) dep += 0.02;
    const depreciation = (value * dep) / 12;
    const insurance = ((1700 + 1000 + value * 0.022) * (premium ? 1.25 : 1)) / 12;
    const maintenance = Math.min(900, (180 + 12 * age) * (premium ? 1.7 : 1) * (pt === "ev" ? 0.55 : 1));
    const licence = 110;
    const total = fuel + depreciation + insurance + maintenance + licence;
    return { fuel, depreciation, insurance, maintenance, licence, total, dep };
  }, [value, year, pt, km, g, m.segment]);

  const field = "mt-1 block min-h-11 w-full rounded-xl border border-line bg-white px-3 text-[16px] outline-none focus:border-go";
  const rows: [string, number][] = r ? [["דלק / חשמל", r.fuel], ["ירידת ערך", r.depreciation], ["ביטוח (הערכה)", r.insurance], ["טיפולים ותיקונים", r.maintenance], ["רישוי", r.licence]] : [];
  return (
    <section className={`${card} p-5 sm:p-6`} aria-labelledby="calc-h">
      <h2 id="calc-h" className="text-xl">כמה יעלה לי בחודש? מצאתם {mk.he} {m.he} יד שנייה</h2>
      <p className="mt-1 text-[15px] text-muted">הכניסו את המחיר שמבקשים מכם ונחשב עלות חודשית משוערת.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-[14px] font-semibold text-muted">דור<select value={gi} onChange={(e) => setGi(Number(e.target.value))} className={field}>{m.gens.map((x, i) => <option key={x.code} value={i}>{range(Math.max(2010, x.from), x.to ?? "היום")} ({x.code})</option>)}</select></label>
        <label className="text-[14px] font-semibold text-muted">שנת ייצור<select value={year} onChange={(e) => setYear(Number(e.target.value))} className={field}>{years.map((y) => <option key={y}>{y}</option>)}</select></label>
        <label className="text-[14px] font-semibold text-muted">הנעה<select value={pt} onChange={(e) => setPt(e.target.value as Powertrain)} className={field}>{g.pt.map((p) => <option key={p} value={p}>{PT_HE[p]}</option>)}</select></label>
        <label className="text-[14px] font-semibold text-muted">מחיר מבוקש (₪)<input inputMode="numeric" dir="ltr" placeholder="85,000" value={price} onChange={(e) => setPrice(e.target.value)} className={field} /></label>
        <label className="text-[14px] font-semibold text-muted">ק"מ בשנה<select value={km} onChange={(e) => setKm(Number(e.target.value))} className={field}>{[7000, 10000, 15000, 20000, 25000, 30000].map((k) => <option key={k} value={k}>{nf.format(k)}</option>)}</select></label>
      </div>
      {r ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-[auto_1fr] lg:items-center">
          <div>
            <p className="text-[14px] text-muted">עלות חודשית משוערת</p>
            <p className="num text-[2.6rem] leading-none text-go">{shekel(r.total)}</p>
            <p className="mt-1 text-[13px] text-muted">ירידת ערך שנתית מוערכת: {Math.round(r.dep * 100)}%</p>
          </div>
          <ul className="space-y-1.5">
            {rows.map(([k, v]) => (
              <li key={k} className="grid grid-cols-[120px_1fr_72px] items-center gap-2 text-[14px]">
                <span>{k}</span>
                <span className="h-2.5 rounded-full bg-mist"><span className="block h-2.5 rounded-full bg-go" style={{ width: `${(v / r.total) * 100}%` }} /></span>
                <span className="num text-end">{shekel(v)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : <p className="mt-5 rounded-xl bg-mist px-4 py-3 text-[15px] text-muted">הכניסו מחיר כדי לראות את החישוב.</p>}
      <p className="mt-4 text-[13px] text-muted">כל המספרים הם הערכה בלבד: צריכה לפי ממוצע בפועל לדור, דלק ₪7.10 לליטר, חשמל ₪0.55 לקוט"ש, ביטוח לפי שווי הרכב (לא הצעת מחיר). כדאי להשוות את המחיר המבוקש למחירון (לוי יצחק) ולבצע בדיקה במכון לפני קנייה.</p>
    </section>
  );
}

// ── Pages ─────────────────────────────────────────────────────────────────────
function MakesGrid() {
  const [q, setQ] = useState("");
  const list = MAKES.filter((mk) => !q || `${mk.he} ${mk.name} ${mk.models.map((m) => `${m.he} ${m.model}`).join(" ")}`.toLowerCase().includes(q.toLowerCase()));
  const total = MAKES.reduce((a, mk) => a + mk.models.length, 0);
  return (
    <>
      <h1 className="text-[clamp(2rem,4vw,3rem)] leading-tight">כל הדגמים, לפי יצרן</h1>
      <p className="mt-2 max-w-[60ch] text-[17px] text-muted">{total} דגמים מ-{MAKES.length} יצרנים, כל דור משנת 2010: מנועים, צריכה בפועל, בטיחות ומה לבדוק לפני שקונים יד שנייה.</p>
      <label className="relative mt-6 block max-w-md">
        <span className="sr-only">חיפוש דגם</span>
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש: קורולה, טוסון, Model Y…" className="min-h-12 w-full rounded-full border border-line bg-white ps-9 pe-4 text-[16px] outline-none focus:border-go" />
      </label>
      {q && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {MAKES.flatMap((mk) => mk.models.filter((m) => `${m.he} ${m.model} ${mk.he} ${mk.name}`.toLowerCase().includes(q.toLowerCase())).map((m) => (
            <li key={`${mk.id}/${m.id}`}><Link href={`/cars/${mk.id}/${m.id}`} className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-[15px] font-semibold no-underline hover:border-go">{mk.he} {m.he}</Link></li>
          )))}
        </ul>
      )}
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((mk) => (
          <li key={mk.id}>
            <Link href={`/cars/${mk.id}`} className={`${card} flex h-full flex-col p-5 text-ink no-underline hover:border-go`}>
              <span className="font-display text-xl font-bold">{mk.he}</span>
              <span className="text-[14px] text-muted" dir="ltr">{mk.name}</span>
              <span className="mt-3 text-[14px] text-muted">{mk.models.map((m) => m.he).join(" · ")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function MakePage({ mk }: { mk: Make }) {
  useEffect(() => { document.title = `${mk.he} — כל הדגמים והדורות מ-2010 | כמה עולה`; }, [mk]);
  return (
    <>
      <h1 className="text-[clamp(2rem,4vw,3rem)] leading-tight">{mk.he} <span className="text-muted" dir="ltr">{mk.name}</span></h1>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mk.models.map((m) => (
          <li key={m.id}>
            <Link href={`/cars/${mk.id}/${m.id}`} className={`${card} block overflow-hidden text-ink no-underline hover:border-go`}>
              <Photo title={wikiTitle(mk, m)} className="aspect-[16/9]" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-2"><h2 className="text-xl">{m.he}</h2><StatusBadge m={m} /></div>
                <p className="text-[14px] text-muted">{span(m)} · {m.gens.length} {m.gens.length === 1 ? "דור" : "דורות"}</p>
                <p className="mt-2 text-[15px] font-semibold">{m.price ? <>חדש: {priceText(m.price)}</> : "יד שנייה בלבד / מחיר לא אומת"}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function ModelPage({ mk, m }: { mk: Make; m: ModelLine }) {
  useEffect(() => { document.title = `${mk.he} ${m.he} — כל הדורות, מה לבדוק וכמה עולה בחודש | כמה עולה`; }, [mk, m]);
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
        <div>
          <h1 className="text-[clamp(2rem,4vw,3rem)] leading-tight">{mk.he} {m.he}</h1>
          <p className="mt-1 text-[16px] text-muted" dir="ltr">{mk.name} {m.model}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3"><StatusBadge m={m} /><span className="text-[15px] text-muted">{span(m)}</span></div>
          <p className="mt-4 text-[18px]">{m.price ? <>מחיר מחירון חדש: <b className="num">{priceText(m.price)}</b></> : "אין מחיר חדש מאומת. בדקו מחירי יד שנייה ביד2 ובמחירון."}</p>
          <a href={yad2Search(mk, m)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-go px-6 text-[16px] font-bold text-white no-underline hover:bg-go-deep">
            מודעות יד שנייה ביד2 <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </div>
        <Photo title={wikiTitle(mk, m)} className="aspect-[16/10] rounded-2xl" />
      </div>

      <h2 className="mt-12 text-2xl">הדורות מאז 2010</h2>
      <ol className="mt-5 space-y-4">
        {[...m.gens].reverse().map((g) => (
          <li key={g.code} className={`${card} p-5 sm:p-6`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-xl">{range(Math.max(2010, g.from), g.to ?? "היום")} <span className="text-[15px] font-semibold text-muted" dir="ltr">{g.code}</span></h3>
              <Ncap g={g} />
            </div>
            <dl className="mt-3 grid gap-x-6 gap-y-2 text-[15px] sm:grid-cols-3">
              <div><dt className="text-[13px] text-muted">מנועים</dt><dd>{g.engines}</dd></div>
              <div><dt className="text-[13px] text-muted">הספק (כ"ס)</dt><dd className="num font-normal">{hpText(g.hp)}</dd></div>
              <div><dt className="text-[13px] text-muted">צריכה ממוצעת בפועל (הערכה)</dt><dd>{g.pt[0] === "ev" ? `${g.cons} קוט"ש ל-100 ק"מ` : `${g.cons} ל' ל-100 ק"מ (כ-${Math.round(100 / g.cons * 10) / 10} ק"מ לליטר)`}</dd></div>
            </dl>
            <p className="mt-3 flex flex-wrap gap-1.5">{g.pt.map((p) => <span key={p} className="rounded-full bg-mist px-2.5 py-0.5 text-[13px] font-semibold">{PT_HE[p]}</span>)}</p>
            {g.note && <p className="mt-3 text-[15px] text-muted">{g.note}</p>}
            <div className="mt-4 rounded-xl bg-[#fff8ef] p-4">
              <p className="flex items-center gap-2 text-[15px] font-bold"><AlertTriangle className="h-4 w-4 text-alert" aria-hidden />מה לבדוק לפני קנייה</p>
              <ul className="mt-2 list-disc space-y-1 ps-5 text-[15px]">{g.checks.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10"><UsedCalc m={m} mk={mk} /></div>
    </>
  );
}

export default function Browse() {
  const { make = "", model = "" } = useParams<{ make?: string; model?: string }>();
  const mk = MAKES.find((x) => x.id === make);
  const m = mk?.models.find((x) => x.id === model);
  useEffect(() => { if (!make) document.title = "כל הדגמים לפי יצרן, משנת 2010 | כמה עולה"; window.scrollTo(0, 0); }, [make, model]);

  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-mist text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-ink no-underline">
            <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-go font-display text-[17px] font-bold text-white">₪</span>
            <span className="font-display text-[22px] font-bold leading-none">כמה <span className="text-go">עולה</span></span>
          </Link>
          <Link href="/" className="text-[15px] font-semibold text-muted no-underline hover:text-ink">המלצה לפי עלות חודשית</Link>
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-8 sm:py-12">
        <nav aria-label="פירורי לחם" className="mb-6 flex flex-wrap items-center gap-1 text-[14px] text-muted">
          <Link href="/cars" className="text-muted no-underline hover:text-ink">כל היצרנים</Link>
          {mk && <><ChevronLeft className="h-4 w-4" aria-hidden /><Link href={`/cars/${mk.id}`} className="text-muted no-underline hover:text-ink">{mk.he}</Link></>}
          {m && <><ChevronLeft className="h-4 w-4" aria-hidden /><span className="text-ink">{m.he}</span></>}
        </nav>
        {mk && m ? <ModelPage mk={mk} m={m} /> : mk && !model ? <MakePage mk={mk} /> : !make ? <MakesGrid /> : (
          <div className="py-16 text-center"><h1 className="text-2xl">הדגם לא נמצא</h1><Link href="/cars" className="mt-4 inline-block font-bold text-go-deep">לכל היצרנים</Link></div>
        )}
        <p className="mt-12 flex items-start gap-2 text-[13px] text-muted"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-go" aria-hidden />מחירי מחירון חדש: מחירוני היבואנים כפי שמופיעים ב-carzone.co.il (נבדק לאחרונה: {PRICES_VERIFIED.split("-").reverse().join(".")}). דירוגי Euro NCAP מוצגים רק כשהם ידועים בוודאות. צריכה ועלויות הן הערכה. "מה לבדוק" הוא הכוונה לבדיקה לפני קנייה, לא אבחנה של רכב מסוים. מחירי יד שנייה אינם מוצגים כי אין להם מקור רשמי חופשי.</p>
      </main>
    </div>
  );
}
