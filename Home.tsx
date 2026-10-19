import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import LeadRequestModal from "@/components/LeadRequestModal";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, BatteryCharging, Building2, Check, ChevronDown, CircleDashed, Clock, Fuel, Gauge, Heart, Languages,
  MapPin, Milestone, PlugZap, Receipt, RotateCcw, Route, Send, Share2, ShieldCheck, Sofa, Star, UserX, Users, Wrench, X, type LucideIcon,
} from "lucide-react";
import { Link } from "wouter";
import { photoFor } from "./vehicleImages";
import { shekel, useLang, type Lang } from "./i18n";
import { CATALOG_UPDATED, STATIC_CATALOG, type Band as CatBand } from "./catalogData";

// ─── Types & data ────────────────────────────────────────────────────────────
type Car = {
  id: string; make: string; years: string; price: number; score: number; use: string; fuel: string;
  reliability: number; safety: number; economy: number; comfort: number; fun: number;
  why: string; pros: string[]; cons: string[]; bodyType?: string;
  insuranceMin?: number; insuranceMax?: number; ownershipMonthly?: number;
  fuelMonthly?: number; insuranceMonthlyAmt?: number; maintenanceMonthly?: number; depreciationMonthly?: number;
  marketRange?: string; dataNote?: string; dataStatus?: string; dataConfidence?: number;
  sourceName?: string; sourceUrl?: string; lastVerifiedAt?: string; demo?: boolean;
  bands?: Record<7000 | 15000 | 25000, CatBand>; confidence?: number;
};
type Ranked = Car & { match: number };
type StepKey = "budget" | "use" | "priority" | "fuel" | "annualKm";
type MultiKey = "use" | "priority" | "fuel";
type Answers = { budget: number; use: string[]; priority: string[]; fuel: string[]; family: string; annualKm: number; annualKmBand: "low" | "mid" | "high" };
type Choice = { value: string | number; icon?: LucideIcon; amount?: string; he: [string, string]; en: [string, string] };
type Code = "off" | "est" | "miss";

const FULL: StepKey[] = ["budget", "use", "priority", "fuel", "annualKm"];
const QUICK: StepKey[] = ["budget", "use", "fuel"];
const MULTI = new Set<StepKey>(["use", "priority", "fuel"]);
const REGISTRATION = 121;
const FUEL_HE: Record<string, string> = { hybrid: "היברידי", petrol: "בנזין", electric: "חשמלי" };
const FUEL_EN: Record<string, string> = { "היברידי": "Hybrid", "בנזין": "Petrol", "חשמלי": "Electric", "דיזל": "Diesel" };
const EMPTY: Answers = { budget: 100000, use: [], priority: [], fuel: [], family: "", annualKm: 15000, annualKmBand: "mid" };

const choices: Record<StepKey, Choice[]> = {
  budget: [
    { value: 60000, amount: "≤60K", he: ["עד ₪60,000", "יד שנייה חכמה ונגישה"], en: ["Up to ₪60,000", "Smart, accessible used cars"] },
    { value: 100000, amount: "60–100K", he: ["בין ₪60,000 ל-₪100,000", "הטווח הכי גמיש"], en: ["₪60,000–100,000", "The most flexible range"] },
    { value: 180000, amount: "100K+", he: ["מעל ₪100,000", "יותר מרחב וטכנולוגיה"], en: ["Over ₪100,000", "More space and technology"] },
  ],
  use: [
    { value: "city", icon: Building2, he: ["עיר ויום-יום", "חניה קלה, חיסכון וזריזות"], en: ["City and daily errands", "Easy parking, economy, agility"] },
    { value: "family", icon: Users, he: ["משפחה וטיולים", "מרחב, בטיחות ונוחות"], en: ["Family and trips", "Space, safety, comfort"] },
    { value: "highway", icon: Route, he: ["הרבה כביש מהיר", "שקט, יציבות ותא מטען"], en: ["Lots of highway", "Quiet, stability, boot space"] },
    { value: "fun", icon: Gauge, he: ["הנאה מנהיגה", "אופי, ביצועים ותחושה"], en: ["Driving enjoyment", "Character and performance"] },
  ],
  priority: [
    { value: "reliable", icon: Wrench, he: ["אמינות ושקט נפשי", "פחות הפתעות במוסך"], en: ["Reliability", "Fewer surprises at the garage"] },
    { value: "economy", icon: Fuel, he: ["חיסכון בדלק", "עלות שוטפת נמוכה"], en: ["Fuel economy", "Low running cost"] },
    { value: "safety", icon: ShieldCheck, he: ["בטיחות", "מערכות ומבנה שמגנים"], en: ["Safety", "Systems and structure that protect"] },
    { value: "comfort", icon: Sofa, he: ["נוחות ואבזור", "נעים בכל נסיעה"], en: ["Comfort and equipment", "Pleasant on every drive"] },
  ],
  fuel: [
    { value: "any", icon: CircleDashed, he: ["פתוח/ה להכול", "תנו לי את ההתאמה הטובה ביותר"], en: ["Open to anything", "Give me the best fit"] },
    { value: "hybrid", icon: BatteryCharging, he: ["היברידי", "חיסכון חכם, במיוחד בעיר"], en: ["Hybrid", "Smart savings, especially in town"] },
    { value: "petrol", icon: Fuel, he: ["בנזין", "פשוט, מוכר וזמין"], en: ["Petrol", "Simple and familiar"] },
    { value: "electric", icon: PlugZap, he: ["חשמלי", "שקט, עלות אנרגיה אחרת"], en: ["Electric", "Quiet, different energy costs"] },
  ],
  annualKm: [
    { value: "low", icon: MapPin, he: ["עד 10,000 ק״מ", "נסיעות קצרות, בעיקר בעיר"], en: ["Up to 10,000 km", "Short trips, mostly town"] },
    { value: "mid", icon: Milestone, he: ["10,000–20,000 ק״מ", "שימוש ממוצע ומעורב"], en: ["10,000–20,000 km", "Average, mixed use"] },
    { value: "high", icon: Route, he: ["מעל 20,000 ק״מ", "הרבה כביש מהיר"], en: ["Over 20,000 km", "Lots of highway"] },
  ],
};

const FUEL_TO_HE: Record<string, string> = { Hybrid: "היברידי", Petrol: "בנזין", Electric: "חשמלי", Diesel: "דיזל" };
const displayName = (make: string, model: string) => (model.toLowerCase().startsWith(make.toLowerCase()) ? model : `${make} ${model}`);

/** The sourced AutoAI catalog (generated from the seed data) — used whenever the live database isn't connected. */
const staticCars: Car[] = STATIC_CATALOG.map((c) => {
  const b = c.bands[15000];
  return {
    id: c.id, make: displayName(c.make, c.model), years: `${c.years} · ${c.fuelType} · ${c.bodyType}`,
    price: c.price, score: Math.round((c.reliability + c.safety + c.economy + c.comfort + c.practicality) / 5),
    use: "", fuel: FUEL_TO_HE[c.fuelType] ?? c.fuelType, bodyType: c.bodyType,
    reliability: c.reliability, safety: c.safety, economy: c.economy, comfort: c.comfort, fun: c.practicality,
    why: c.why, pros: c.pros, cons: c.cons,
    insuranceMin: c.insuranceMin ?? undefined, insuranceMax: c.insuranceMax ?? undefined,
    ownershipMonthly: b.total, fuelMonthly: b.fuel, insuranceMonthlyAmt: b.insurance, maintenanceMonthly: b.maintenance, depreciationMonthly: b.depreciation,
    marketRange: c.priceMin && c.priceMax ? `₪${Math.round(c.priceMin / 1000)}K–₪${Math.round(c.priceMax / 1000)}K` : undefined,
    dataNote: `אומדן AutoAI · רמת ביטחון ${c.confidence}/100${c.sampleSize ? ` · מחיר שוק לפי ${c.sampleSize} מודעות` : ""} · עלות דלק לפי צריכה משוקללת. ביטוח: הערכה בלבד.`,
    dataStatus: "estimated", dataConfidence: c.confidence, confidence: c.confidence, bands: c.bands,
  };
});

/** Monthly cost components at a given yearly km: interpolates between the 7k/15k/25k bands. */
function bandAt(car: Car, km: number): CatBand | null {
  if (!car.bands) return null;
  const [lo, hi] = km <= 15000 ? [7000, 15000] as const : [15000, 25000] as const;
  const f = (km - lo) / (hi - lo);
  const L = car.bands[lo], H = car.bands[hi];
  const mix = (k: keyof CatBand) => Math.max(0, Math.round(L[k] + (H[k] - L[k]) * f));
  const out = { fuel: mix("fuel"), insurance: mix("insurance"), maintenance: mix("maintenance"), depreciation: mix("depreciation"), total: 0 };
  out.total = out.fuel + out.insurance + out.maintenance + out.depreciation + REGISTRATION;
  return out;
}

const useByName: Record<string, string> = {
  "toyota corolla hybrid": "city", "hyundai tucson": "family", "mazda mazda3": "fun", "mazda mazda 3": "fun",
  "toyota corolla": "highway", "toyota rav4 hybrid": "family", "kia niro hybrid": "city", "hyundai ioniq 5": "highway",
  "kia sportage hybrid": "family", "nissan qashqai": "family", "mg mg4 electric": "city", "hyundai ioniq 6": "highway",
  "skoda octavia": "highway", "ford puma hybrid": "city", "volkswagen golf": "fun", "toyota yaris cross hybrid": "city",
  "toyota yaris cross": "city", "peugeot 308": "fun", "byd atto 3": "family", "jaecoo j7": "family", "hyundai kona hybrid": "city",
  "toyota corolla cross hybrid": "family", "chery tiggo 8 pro": "family", "kia picanto": "city",
};

const formatTime = (lang: Lang) => new Date().toLocaleTimeString(lang === "he" ? "he-IL" : "en-US", { hour: "2-digit", minute: "2-digit" });
const track = (event: string) => { try { const e = JSON.parse(localStorage.getItem("carai-events") || "[]"); e.push({ event, at: new Date().toISOString() }); localStorage.setItem("carai-events", JSON.stringify(e.slice(-100))); } catch {} };
const shortName = (make: string) => make.split(" · ")[0];
/** All scores are shown on one 1–10 scale (one decimal), the convention of leading car-review sites. */
const ten = (v: number) => Math.round(v) / 10;

/** 6-factor weighted score: budget 25 · use 20 · TCO 20 · reliability 15 · safety 10 · priority 10. Multi-select answers count if any matches. */
function computeScore(car: Car, a: Answers): number {
  let s = 0;
  if (car.price <= a.budget * 0.85) s += 25; else if (car.price <= a.budget) s += 18; else if (car.price <= a.budget * 1.1) s += 8;
  const useBody: Record<string, string[]> = { city: ["hatchback", "sedan"], family: ["suv", "minivan"], highway: ["sedan", "suv"], fun: ["sedan", "hatchback"] };
  const body = (car.bodyType ?? "").toLowerCase();
  s += a.use.length ? (a.use.some((u) => car.use === u || (useBody[u] ?? []).includes(body)) ? 20 : 10) : 14;
  const m = car.ownershipMonthly ?? 2200;
  s += m < 1500 ? 20 : m < 1800 ? 16 : m < 2200 ? 11 : 5;
  s += Math.round((car.reliability / 100) * 15);
  s += Math.round((car.safety / 100) * 10);
  const field: Record<string, keyof Car> = { reliable: "reliability", economy: "economy", safety: "safety", comfort: "comfort" };
  const pr = a.priority.length ? a.priority : ["reliable"];
  const prScore = pr.reduce((sum, p) => sum + ((car[field[p]] as number) ?? 0), 0) / pr.length;
  s += Math.round((prScore / 100) * 10);
  if (a.annualKmBand === "low" && car.fuel === "חשמלי") s -= 5;
  if (a.annualKmBand === "high" && car.fuel === "היברידי") s += 4;
  if (a.annualKmBand === "high" && car.fuel === "חשמלי") s -= 3;
  const fuels = a.fuel.filter((f) => f !== "any").map((f) => FUEL_HE[f]);
  if (fuels.length && !a.fuel.includes("any") && !fuels.includes(car.fuel)) s -= 6;
  return Math.min(99, Math.max(35, s));
}

type Dict = ReturnType<typeof useLang>["t"];

/** Monthly components with provenance; registration is the official annual licence fee (₪121/month). */
function tcoRows(car: Car, km: number, t: Dict): { label: string; value?: number; code: Code }[] {
  const b = bandAt(car, km);
  if (b) return [
    { label: t.fuelLine, value: b.fuel, code: "est" }, { label: t.insuranceLine, value: b.insurance, code: "est" },
    { label: t.maintenanceLine, value: b.maintenance, code: "est" }, { label: t.depreciationLine, value: b.depreciation, code: "est" },
    { label: t.registrationLine, value: REGISTRATION, code: "off" },
  ];
  const f = km / 15000;
  const fuel = car.fuelMonthly != null ? Math.round(car.fuelMonthly * f) : undefined;
  const ins = car.insuranceMonthlyAmt ?? (car.insuranceMin && car.insuranceMax ? Math.round((car.insuranceMin + car.insuranceMax) / 2) : undefined);
  const rows: { label: string; value?: number; code: Code }[] = [
    { label: t.fuelLine, value: fuel, code: "est" },
    { label: t.insuranceLine, value: ins, code: "est" },
    { label: t.maintenanceLine, value: car.maintenanceMonthly, code: "est" },
    { label: t.depreciationLine, value: car.depreciationMonthly, code: "est" },
    { label: t.registrationLine, value: REGISTRATION, code: "off" },
  ];
  return rows.map((r) => (r.value == null ? { ...r, code: "miss" } : r));
}

function monthlyFor(car: Car | undefined, km: number): number {
  if (!car) return 0;
  const b = bandAt(car, km);
  if (b) return b.total;
  if (car.ownershipMonthly) return Math.round(car.ownershipMonthly * (0.7 + 0.3 * (km / 15000)));
  return Math.round(car.price * 0.08 / 12 + (km / 12) * (car.fuel === "היברידי" ? 0.42 : 0.62) + 500);
}

const card = "rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]";
const btnGhost = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-4 text-[15px] font-bold text-ink hover:border-ink";
const btnPrimary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-go px-5 text-[15px] font-bold text-white hover:bg-go-deep";

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
  const { lang, t, dir, setLang } = useLang();
  const { isAuthenticated } = useAuth();
  const sessionId = useMemo(() => `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, []);

  const [mode, setMode] = useState<"quick" | "full">("full");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [tab, setTab] = useState<"results" | "saved" | "compare" | "detail" | "analysis" | "tools">("results");
  const [saved, setSaved] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("carai-saved") || "[]"); } catch { return []; } });
  const [history, setHistory] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem("carai-history") || "[]"); } catch { return []; } });
  const [compare, setCompare] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLead, setShowLead] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  const catalogQuery = trpc.catalog.list.useQuery({ limit: 100, annualKm: answers.annualKm }, { retry: 1 });
  const saveSearch = trpc.searches.create.useMutation();

  const cars = useMemo<Car[]>(() => {
    const rows = catalogQuery.data ?? [];
    const fuelLabel: Record<string, string> = { Hybrid: "היברידי", Petrol: "בנזין", Electric: "חשמלי", Diesel: "דיזל" };
    if (!rows.length) return staticCars.map((c) => ({ ...c, use: useByName[c.make.toLowerCase()] ?? (c.bodyType === "suv" ? "family" : "city"), demo: true }));
    return rows.map((row): Car => {
      const name = `${row.make} ${row.model}`;
      const price = row.marketSnapshotMedian ?? row.marketMinPrice ?? 0;
      const marketRange = row.marketSnapshotMin && row.marketSnapshotMax
        ? `₪${row.marketSnapshotMin.toLocaleString()}–₪${row.marketSnapshotMax.toLocaleString()}` : `₪${price.toLocaleString()}`;
      const registry = row.officialRegisteredCount != null
        ? `מקור רשמי: ${row.officialRegisteredCount.toLocaleString()} כלי רכב מדגם ${row.officialRegistryCommercialName}, שנת ${row.yearFrom}.` : "אין עדיין ספירת רישום רשמית לדגם.";
      const seen = row.marketSnapshotObservedAt ? new Date(row.marketSnapshotObservedAt).toLocaleDateString("he-IL") : "לא ידוע";
      return {
        id: String(row.id),
        make: `${name} · ${row.trimName}`,
        years: `${row.yearFrom}${row.yearTo !== row.yearFrom ? `–${row.yearTo}` : ""} · ${row.fuelType} · ${row.bodyType}`,
        price, score: Math.round((row.reliabilityScore + row.safetyScore + row.economyScore + row.comfortScore + row.practicalityScore) / 5),
        use: useByName[name.toLowerCase()] ?? (row.bodyType.toLowerCase().includes("suv") ? "family" : "city"),
        fuel: fuelLabel[row.fuelType] ?? row.fuelType,
        reliability: row.reliabilityScore, safety: row.safetyScore, economy: row.economyScore, comfort: row.comfortScore, fun: row.practicalityScore,
        why: row.ownershipNotes ?? "המלצה לפי נתוני הדגם והעדפות השימוש שלך.", pros: row.pros ?? [], cons: row.cons ?? [], bodyType: row.bodyType,
        insuranceMin: row.insuranceMonthlyMin ?? undefined, insuranceMax: row.insuranceMonthlyMax ?? undefined,
        ownershipMonthly: row.ownershipCostMonthly ?? row.estimatedMonthlyCost ?? undefined,
        fuelMonthly: row.tcoFuelMonthly ?? undefined, insuranceMonthlyAmt: row.tcoInsuranceMonthly ?? undefined,
        maintenanceMonthly: row.tcoMaintenanceMonthly ?? undefined, depreciationMonthly: row.tcoDepreciationMonthly ?? undefined,
        marketRange,
        dataNote: `${registry} מחיר: אומדן השוואתי שנצפה ב-${seen}; ${row.marketSnapshotDisclaimer ?? "לא הצעת מחיר חיה."}${row.primarySourceName ? ` מקור: ${row.primarySourceName}.` : ""}`,
        dataStatus: row.dataStatus ?? "estimated", dataConfidence: row.dataConfidence ?? 0,
        sourceName: row.primarySourceName ?? undefined, sourceUrl: row.primarySourceUrl ?? undefined,
        lastVerifiedAt: row.lastVerifiedAt ? new Date(row.lastVerifiedAt).toLocaleDateString("he-IL") : undefined,
      };
    });
  }, [catalogQuery.data]);

  const ranked = useMemo<Ranked[]>(() => cars.map((c) => ({ ...c, match: computeScore(c, answers) })).sort((a, b) => b.match - a.match), [cars, answers]);
  const leader = ranked[0];
  const order = mode === "quick" ? QUICK : FULL;
  const done = step >= order.length;
  const complete = done && answers.use.length > 0 && answers.fuel.length > 0;
  const isDemo = Boolean(cars[0]?.demo);

  useEffect(() => { try { localStorage.setItem("carai-saved", JSON.stringify(saved)); } catch {} }, [saved]);
  useEffect(() => {
    if (!complete || !leader) return;
    const next = [leader.id, ...history.filter((id) => id !== leader.id)].slice(0, 8);
    setHistory(next);
    try { localStorage.setItem("carai-history", JSON.stringify(next)); } catch {}
    track("quiz_completed");
    if (isAuthenticated) {
      const trim = Number(leader.id);
      saveSearch.mutate({ sessionId, answers: answers as unknown as Record<string, unknown>, topMatchTrimId: Number.isFinite(trim) && trim > 0 ? trim : undefined, topMatchScore: leader.match });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, leader?.id]);

  const advance = () => setStep((s) => Math.min(s + 1, order.length));

  function chooseSingle(key: "budget" | "annualKm", value: string | number) {
    track(`answer_${key}`);
    setAnswers((prev) => {
      if (key === "annualKm") {
        const band = value as Answers["annualKmBand"];
        return { ...prev, annualKmBand: band, annualKm: band === "low" ? 7000 : band === "high" ? 25000 : 15000 };
      }
      return { ...prev, budget: Number(value) };
    });
    window.setTimeout(advance, 180);
  }
  function toggleMulti(key: MultiKey, value: string) {
    track(`answer_${key}`);
    setAnswers((prev) => {
      const cur = prev[key];
      let next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
      if (key === "fuel") next = value === "any" ? (cur.includes("any") ? [] : ["any"]) : next.filter((v) => v !== "any");
      return { ...prev, [key]: next };
    });
  }
  function continueMulti(key: MultiKey) {
    if (mode === "quick" && key === "use") setAnswers((p) => (p.priority.length ? p : { ...p, priority: ["reliable"] }));
    advance();
  }
  function switchMode(m: "quick" | "full") {
    track(`mode_${m}`);
    setMode(m);
    setStep((s) => Math.min(s, (m === "quick" ? QUICK : FULL).length));
  }
  function reset() { track("quiz_reset"); setStep(0); setAnswers(EMPTY); setTab("results"); }
  function toggleSaved(id: string) {
    const has = saved.includes(id);
    track(has ? "saved_removed" : "saved_added");
    setSaved((p) => (has ? p.filter((x) => x !== id) : [...p, id]));
    toast(has ? t.removedToast : t.savedToast);
  }
  function toggleCompare(id: string) {
    track(compare.includes(id) ? "compare_removed" : "compare_added");
    setCompare((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < 3 ? [...p, id] : (toast(t.compareMax), p)));
  }
  async function shareResult() {
    if (!leader) return;
    const text = t.shareText(shortName(leader.make), ten(leader.match));
    try {
      if (navigator.share) await navigator.share({ title: "AutoAI", text });
      else { await navigator.clipboard.writeText(text); toast(t.copiedToast); }
    } catch {}
  }
  function showResults() { track("results_viewed"); setTab("results"); resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }
  const openDetail = (id: string) => { setSelectedId(id); setTab("detail"); resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const detailCar = ranked.find((c) => c.id === selectedId) ?? leader;
  const trustIcons = [Clock, Receipt, UserX];

  return (
    <main dir={dir} lang={lang} className="min-h-screen bg-page text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <a href="#top" className="flex items-center gap-2 text-ink no-underline" aria-label="AutoAI">
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-go font-display text-[15px] font-bold text-white">A</span>
            <span className="font-display text-[21px] font-bold leading-none" dir="ltr">Auto<span className="text-go">AI</span></span>
          </a>
          <nav className="flex items-center gap-1 text-[15px] font-semibold sm:gap-6">
            <a href="#results" className="hidden text-muted no-underline hover:text-ink md:inline">{t.navResults}</a>
            <a href="#legend" className="hidden text-muted no-underline hover:text-ink md:inline">{t.navHow}</a>
            <a href="#advisor" className="hidden text-muted no-underline hover:text-ink sm:inline">{t.navAdvisor}</a>
            <button onClick={() => setLang(lang === "he" ? "en" : "he")} lang={lang === "he" ? "en" : "he"} className="flex min-h-10 items-center gap-1.5 rounded-full border border-line px-3.5 text-[14px] font-bold hover:border-ink">
              <Languages className="h-4 w-4" aria-hidden />{t.langSwitch}
            </button>
          </nav>
        </div>
      </header>

      <section id="top" className="bg-mist">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 pb-14 pt-10 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:pb-20 lg:pt-14">
          <div>
            <h1 className="max-w-[15ch] text-[clamp(2.3rem,4.8vw,4rem)] leading-[1.06]">{t.heroTitle}</h1>
            <p className="mt-4 max-w-[54ch] text-[17px] leading-7 text-muted sm:text-lg">{t.heroSub}</p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-semibold">
              {t.trust.map((item, i) => { const I = trustIcons[i]; return <li key={item} className="flex items-center gap-1.5"><I className="h-4 w-4 text-go" aria-hidden />{item}</li>; })}
            </ul>
            <Finder order={order} step={step} setStep={setStep} answers={answers} chooseSingle={chooseSingle} toggleMulti={toggleMulti}
              continueMulti={continueMulti} done={done} complete={complete} mode={mode} switchMode={switchMode} reset={reset} onResults={showResults} />
          </div>
          {leader && <LeaderPanel car={leader} km={answers.annualKm} started={step > 0} />}
        </div>
      </section>

      <section id="results" ref={resultsRef} className="mx-auto max-w-[1280px] scroll-mt-20 px-4 pb-20 pt-14 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <h2 className="text-[clamp(1.8rem,3.2vw,2.5rem)] leading-tight">{t.workspaceTitle}</h2>
          <div role="tablist" className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-mist p-1 text-[15px] font-bold">
            {([["results", t.tabResults], ["saved", `${t.tabSaved} (${saved.length})`], ["compare", `${t.tabCompare} (${compare.length})`], ["analysis", t.tabAnalysis], ["tools", t.tabTools]] as const).map(([id, label]) => {
              const on = tab === id || (id === "results" && tab === "detail");
              return <button key={id} role="tab" aria-selected={on} onClick={() => setTab(id)}
                className={`min-h-10 shrink-0 whitespace-nowrap rounded-full px-4 ${on ? "bg-white text-ink shadow-[var(--shadow-card)]" : "text-muted hover:text-ink"}`}>{label}</button>;
            })}
          </div>
        </div>
        {isDemo && <p className="mt-5 rounded-xl bg-mist px-4 py-3 text-[15px] text-muted">{t.catalogNote(cars.length, CATALOG_UPDATED)}</p>}
        {!complete && tab === "results" && <p className="mt-3 text-[15px] text-muted">{t.incomplete}</p>}
        <div className="mt-8">
          {tab === "results" && <Results answers={answers} ranked={ranked} saved={saved} compare={compare} km={answers.annualKm} toggleSaved={toggleSaved} toggleCompare={toggleCompare} onDetails={openDetail} onShare={shareResult} onLead={() => setShowLead(true)} />}
          {tab === "detail" && detailCar && <Detail car={detailCar} km={answers.annualKm} answers={answers} onBack={() => setTab("results")} onLead={() => setShowLead(true)} saved={saved.includes(detailCar.id)} toggleSaved={toggleSaved} />}
          {tab === "saved" && <Saved cars={cars.filter((c) => saved.includes(c.id))} history={cars.filter((c) => history.includes(c.id))} toggleSaved={toggleSaved} toggleCompare={toggleCompare} onDetails={openDetail} />}
          {tab === "compare" && <Compare cars={ranked.filter((c) => compare.includes(c.id))} toggleCompare={toggleCompare} onLead={() => setShowLead(true)} />}
          {tab === "analysis" && leader && <Analysis car={leader} answers={answers} />}
          {tab === "tools" && leader && <Tools car={leader} answers={answers} setAnswers={setAnswers} />}
        </div>
      </section>

      <Legend />
      <Advisor />

      <footer className="bg-ink text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-12 text-[15px] sm:px-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="font-display text-2xl font-bold" dir="ltr" style={{ textAlign: "start" }}>Auto<span className="text-[#5fd3a7]">AI</span></div>
            <p className="mt-2 max-w-[48ch] text-[#c3cbd6]">{t.footerLine}</p>
          </div>
          <div className="max-w-[46ch] text-[#c3cbd6]">
            <Link href="/privacy" className="font-bold text-white underline">{t.footerPrivacy}</Link>
            <p className="mt-2 text-[14px]">{t.footerPhotos}</p>
          </div>
        </div>
      </footer>

      {showLead && leader && <LeadRequestModal vehicle={tab === "detail" && detailCar ? detailCar : leader} budget={answers.budget}
        sourcePage={tab === "detail" ? "vehicle_details" : tab === "compare" ? "comparison" : "recommendations"} onClose={() => setShowLead(false)} />}
    </main>
  );
}

// ─── Finder ──────────────────────────────────────────────────────────────────
function Finder({ order, step, setStep, answers, chooseSingle, toggleMulti, continueMulti, done, complete, mode, switchMode, reset, onResults }: {
  order: StepKey[]; step: number; setStep: (n: number) => void; answers: Answers;
  chooseSingle: (k: "budget" | "annualKm", v: string | number) => void; toggleMulti: (k: MultiKey, v: string) => void; continueMulti: (k: MultiKey) => void;
  done: boolean; complete: boolean; mode: "quick" | "full"; switchMode: (m: "quick" | "full") => void; reset: () => void; onResults: () => void;
}) {
  const { lang, t, dir } = useLang();
  const key = order[Math.min(step, order.length - 1)];
  const multi = MULTI.has(key);
  const titles: Record<StepKey, string> = { budget: t.qBudget, use: t.qUse, priority: t.qPriority, fuel: t.qFuel, annualKm: t.qKm };
  const hint = multi ? t.pickMany : key === "budget" ? t.hintBudget : key === "annualKm" ? t.hintKm : t.hintDefault;
  const selected: string[] = multi ? answers[key as MultiKey] : [String(key === "annualKm" ? answers.annualKmBand : answers.budget)];
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const pct = Math.round((Math.min(step, order.length) / order.length) * 100);

  return (
    <div className={`${card} mt-8 p-5 sm:p-6`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[15px] font-bold text-muted">{done ? t.doneTitle : t.stepOf(step + 1, order.length)}</span>
        <div className="flex items-center gap-2">
          <div role="group" aria-label={t.modeLabel} className="flex rounded-full bg-mist p-0.5 text-[14px] font-bold">
            {(["quick", "full"] as const).map((m) => (
              <button key={m} onClick={() => switchMode(m)} aria-pressed={mode === m}
                className={`min-h-8 rounded-full px-3 ${mode === m ? "bg-white text-ink shadow-[var(--shadow-card)]" : "text-muted hover:text-ink"}`}>{m === "quick" ? t.quick : t.full}</button>
            ))}
          </div>
          <button onClick={reset} aria-label={t.restart} title={t.restart} className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-ink"><RotateCcw className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t.stepOf(Math.min(step + 1, order.length), order.length)}>
        <div className="h-full rounded-full bg-go transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>

      {!done ? (
        <div key={key} className="swap">
          <h2 className="mt-5 text-[clamp(1.35rem,2.3vw,1.7rem)] leading-tight">{titles[key]}</h2>
          <p className="mt-1 text-[15px] text-muted">{hint}</p>
          <ul className={`mt-4 grid gap-2.5 ${choices[key].length === 4 ? "sm:grid-cols-2" : ""}`}>
            {choices[key].map((c) => {
              const v = String(c.value);
              const active = selected.includes(v);
              const [label, sub] = c[lang];
              const Icon = c.icon;
              return (
                <li key={v}>
                  <button
                    onClick={() => (multi ? toggleMulti(key as MultiKey, v) : chooseSingle(key as "budget" | "annualKm", c.value))}
                    aria-pressed={active} role={multi ? "checkbox" : undefined} aria-checked={multi ? active : undefined}
                    className={`group flex h-full w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-start transition-colors ${active ? "border-go bg-go-soft" : "border-line bg-white hover:border-[#9fb0c2]"}`}>
                    {c.amount
                      ? <span className="num w-[5.4rem] shrink-0 text-[22px] leading-none text-ink" dir="ltr">{c.amount}</span>
                      : Icon && <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${active ? "bg-go text-white" : "bg-mist text-go"}`}><Icon aria-hidden className="h-5 w-5" strokeWidth={1.9} /></span>}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-bold leading-snug">{label}</span>
                      <span className="block text-[14px] leading-snug text-muted">{sub}</span>
                    </span>
                    {multi
                      ? <span aria-hidden className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border-2 ${active ? "border-go bg-go text-white" : "border-[#b4bcc7] bg-white"}`}>{active && <Check className="h-4 w-4" strokeWidth={3} />}</span>
                      : <Arrow aria-hidden className={`h-5 w-5 shrink-0 ${active ? "text-go" : "text-[#9aa5b3] group-hover:text-go"}`} />}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            {step > 0 ? <button onClick={() => setStep(step - 1)} className="min-h-11 rounded-full px-3 text-[15px] font-bold text-muted hover:text-ink">{t.back}</button> : <span />}
            {multi && (
              <div className="flex items-center gap-3">
                {selected.length > 0 && <span className="text-[14px] font-semibold text-muted">{t.picked(selected.length)}</span>}
                <button onClick={() => continueMulti(key as MultiKey)} disabled={!selected.length} className={`${btnPrimary} min-h-12 px-7 text-[16px] disabled:opacity-40`}>{t.next}<Arrow className="h-5 w-5" aria-hidden /></button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="swap mt-5">
          <p className="max-w-[52ch] text-[17px] text-muted">{t.doneSub}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button onClick={onResults} disabled={!complete} className={`${btnPrimary} min-h-12 px-7 text-[17px] disabled:opacity-40`}>{t.showMatches}<Arrow className="h-5 w-5" aria-hidden /></button>
            <button onClick={() => setStep(order.length - 1)} className="min-h-11 rounded-full px-3 text-[15px] font-bold text-muted hover:text-ink">{t.back}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared pieces ───────────────────────────────────────────────────────────
function MonthlyTag({ value, size = "lg", label }: { value: number; size?: "sm" | "md" | "lg"; label?: string }) {
  const { t, nf } = useLang();
  const fs = size === "lg" ? "text-[38px] sm:text-[44px]" : size === "md" ? "text-[28px]" : "text-[21px]";
  return (
    <span className="inline-flex items-baseline gap-1.5" aria-label={`${label ?? t.monthlyOwn}: ₪${nf.format(Math.round(value))}`}>
      <span className={`num leading-none text-go ${fs}`} aria-hidden>{shekel(value, nf)}</span>
      <span className="text-[14px] font-semibold text-muted" aria-hidden>{label ?? t.perMonth}</span>
    </span>
  );
}

function CarPhoto({ name, className = "", eager, width, label = false }: { name: string; className?: string; eager?: boolean; width?: number; label?: boolean }) {
  const { t } = useLang();
  const p = photoFor(name, width);
  const [failed, setFailed] = useState(false);
  if (!p || failed) {
    return (
      <div className={`relative bg-gradient-to-b from-[#eef2f6] to-[#e1e7ee] ${className}`}>
        {label && <span className="absolute end-4 top-3 max-w-[70%] text-end font-display text-lg font-semibold leading-tight text-[#6b7a8c]">{shortName(name)}</span>}
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-mist ${className}`}>
      <img src={p.src} alt={shortName(name)} loading={eager ? "eager" : "lazy"} decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      <a href={p.credit} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 end-2 rounded-full bg-ink/70 px-2 py-0.5 text-[11px] font-semibold text-white no-underline hover:bg-ink">{t.photoCredit}</a>
    </div>
  );
}

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  // value on 0–10; each point is half a star.
  const filled = Math.round(value) / 2;
  return (
    <span className="inline-flex" aria-hidden dir="ltr">
      {[0, 1, 2, 3, 4].map((i) => {
        const part = Math.max(0, Math.min(1, filled - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-[#d5dbe3]" style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />
            {part > 0 && <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${part * 100}%` }}><Star className="absolute left-0 top-0 max-w-none text-[#f5a524]" style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} /></span>}
          </span>
        );
      })}
    </span>
  );
}

/** Overall score: big number /10 + stars + plain-language word. */
function Score({ value, compact }: { value: number; compact?: boolean }) {
  const { t } = useLang();
  const v = ten(value);
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5" aria-label={`${t.matchScore}: ${v.toFixed(1)} ${t.scoreOf10}, ${t.scoreWord(v)}`}>
      <span dir="ltr" className={`num leading-none ${compact ? "text-[20px]" : "text-[24px]"}`} aria-hidden>{v.toFixed(1)}<span className="text-[13px] font-semibold text-muted">/10</span></span>
      <Stars value={v} size={compact ? 14 : 17} />
      <span className="text-[14px] font-bold text-ink" aria-hidden>{t.scoreWord(v)}</span>
    </span>
  );
}

function ScoreText({ value }: { value: number }) {
  const { t } = useLang();
  const v = ten(value);
  return <span><bdi dir="ltr"><span className="num text-[17px]">{v.toFixed(1)}</span><span className="text-[13px] text-muted">/10</span></bdi> <span className="text-[14px] font-semibold text-muted">{t.scoreWord(v)}</span></span>;
}

/** Sub-scores as 10 segments, so "8 of 10" is visible at a glance. */
function SubScores({ items }: { items: (readonly [string, number])[] }) {
  const { t } = useLang();
  return (
    <ul className="space-y-3">
      {items.map(([label, raw]) => {
        const v = ten(raw);
        return (
          <li key={label} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 text-[15px]">
            <span className="text-muted">{label}</span>
            <span className="flex gap-[3px]" aria-hidden>
              {Array.from({ length: 10 }, (_, i) => {
                const fill = Math.max(0, Math.min(1, v - i));
                return <span key={i} className="relative h-2.5 flex-1 overflow-hidden rounded-sm bg-mist">{fill > 0 && <span className="absolute inset-y-0 start-0 bg-go" style={{ width: `${fill * 100}%` }} />}</span>;
              })}
            </span>
            <span className="min-w-[7.5rem] text-end" aria-label={`${label}: ${v.toFixed(1)} ${t.scoreOf10}`}><span className="num text-[17px]">{v.toFixed(1)}</span> <span className="text-[14px] font-semibold text-muted">{t.scoreWord(v)}</span></span>
          </li>
        );
      })}
    </ul>
  );
}

/** Provenance as a labelled badge: official = solid, estimate = outlined, missing = dashed. */
function CodeChip({ code }: { code: Code }) {
  const { t } = useLang();
  const label = code === "off" ? t.codeOfficial : code === "est" ? t.codeEstimate : t.codeMissing;
  const cls = code === "off" ? "bg-ink text-white border-ink" : code === "est" ? "border-[#9fb0c2] text-muted" : "border-dashed border-[#9fb0c2] text-muted";
  return <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-px text-[12px] font-bold leading-5 ${cls}`}>{label}</span>;
}

// Validated categorical order (dataviz validator: all checks pass on white; yellow/pink carry visible labels).
const COST_COLORS = ["#2a78d6", "#eb6834", "#6250d6", "#eda100", "#e87ba4"];

/** Monthly cost as one part-to-whole bar + a labelled legend (name, ₪, share, provenance). */
function Breakdown({ car, km, compact }: { car: Car; km: number; compact?: boolean }) {
  const { t, nf } = useLang();
  const rows = tcoRows(car, km, t).map((r, i) => ({ ...r, color: COST_COLORS[i] }));
  const known = rows.filter((r) => r.value != null) as (typeof rows[number] & { value: number })[];
  const total = known.reduce((sum, r) => sum + r.value, 0) || 1;
  const [hover, setHover] = useState<number | null>(null);
  return (
    <figure className="m-0">
      <div className="relative" onMouseLeave={() => setHover(null)}>
        <div className={`flex w-full gap-[2px] overflow-hidden rounded-full ${compact ? "h-3" : "h-4"}`} role="img"
          aria-label={known.map((r) => `${r.label} ${Math.round((r.value / total) * 100)}%`).join(", ")}>
          {known.map((r, i) => (
            <span key={r.label} tabIndex={0} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onBlur={() => setHover(null)}
              className={`grow h-full transition-opacity first:rounded-s-full last:rounded-e-full ${hover != null && hover !== i ? "opacity-40" : ""}`}
              style={{ width: `${(r.value / total) * 100}%`, background: r.color }} />
          ))}
        </div>
        {hover != null && known[hover] && (
          <div className="pointer-events-none absolute -top-11 start-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-[13px] font-semibold text-white shadow-[var(--shadow-float)] rtl:translate-x-1/2">
            {known[hover].label}: {shekel(known[hover].value, nf)} · {Math.round((known[hover].value / total) * 100)}%
          </div>
        )}
      </div>
      {compact ? (
        <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
          {known.map((r) => <li key={r.label} className="flex items-center gap-1.5"><span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ background: r.color }} />{r.label} <span className="num text-[14px] text-ink">{shekel(r.value, nf)}</span></li>)}
        </ul>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center gap-3 py-2 text-[15px]">
              <span aria-hidden className="h-3 w-3 shrink-0 rounded-[4px]" style={{ background: r.value != null ? r.color : "transparent", boxShadow: r.value == null ? "inset 0 0 0 1.5px #b4bcc7" : undefined }} />
              <span className="min-w-0 flex-1 text-ink">{r.label}</span>
              <CodeChip code={r.code} />
              <span className="w-10 text-end text-[13px] text-muted">{r.value != null ? `${Math.round((r.value / total) * 100)}%` : ""}</span>
              <span className={`num w-[4.6rem] text-end text-[17px] ${r.value == null ? "text-muted" : ""}`}>{r.value == null ? "–" : shekel(r.value, nf)}</span>
            </li>
          ))}
        </ul>
      )}
      {!compact && <figcaption className="mt-2 text-[13px] text-muted">{t.kmBasis(km)} · {t.insuranceNote}</figcaption>}
    </figure>
  );
}

function LeaderPanel({ car, km, started }: { car: Ranked; km: number; started: boolean }) {
  const { t } = useLang();
  return (
    <aside className="relative lg:pt-2" aria-live="polite">
      <div key={car.id} className="swap">
        <CarPhoto name={car.make} eager width={1280} className="aspect-[4/3] w-full rounded-3xl lg:aspect-[16/13]" />
      </div>
      <div className={`${card} relative z-10 -mt-16 mx-3 p-5 shadow-[var(--shadow-float)] sm:mx-6 sm:p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div>
            <span className="text-[13px] font-bold text-muted">{started ? t.leaderNow : t.leaderSample}</span>
            <h2 className="mt-1 text-[clamp(1.3rem,2vw,1.6rem)] leading-tight">{shortName(car.make)}</h2>
            <div className="mt-2"><Score value={car.match} /></div>
          </div>
          <MonthlyTag value={monthlyFor(car, km)} />
        </div>
        <div className="mt-5"><Breakdown car={car} km={km} /></div>
      </div>
    </aside>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border-2 border-dashed border-line bg-mist px-6 py-12 text-center text-[16px] text-muted">{text}</div>;
}

// ─── Results ─────────────────────────────────────────────────────────────────
function Results({ answers, ranked, saved, compare, km, toggleSaved, toggleCompare, onDetails, onShare, onLead }: {
  answers: Answers; ranked: Ranked[]; saved: string[]; compare: string[]; km: number; toggleSaved: (id: string) => void; toggleCompare: (id: string) => void;
  onDetails: (id: string) => void; onShare: () => void; onLead: () => void;
}) {
  const { lang, t, nf } = useLang();
  const [costOpen, setCostOpen] = useState(false);
  const [fuel, setFuel] = useState("all");
  const [sort, setSort] = useState("match");
  const visible = ranked
    .filter((c) => fuel === "all" || c.fuel === fuel)
    .sort((a, b) => sort === "price" ? a.price - b.price : sort === "economy" ? b.economy - a.economy : sort === "tco" ? monthlyFor(a, km) - monthlyFor(b, km) : b.match - a.match);
  const [top, ...rest] = visible;
  const selectCls = "min-h-11 rounded-full border border-line bg-white px-4 text-[15px] font-semibold";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[70ch] text-[15px] text-muted">{t.rankNote} {t.scoreNote}</p>
        <div className="flex flex-wrap gap-2">
          <select aria-label={t.powertrain} value={fuel} onChange={(e) => setFuel(e.target.value)} className={selectCls}>
            <option value="all">{t.allFuels}</option>
            {["היברידי", "בנזין", "חשמלי"].map((f) => <option key={f} value={f}>{lang === "he" ? f : FUEL_EN[f]}</option>)}
          </select>
          <select aria-label={t.sortMatch} value={sort} onChange={(e) => setSort(e.target.value)} className={selectCls}>
            <option value="match">{t.sortMatch}</option><option value="tco">{t.sortTco}</option><option value="price">{t.sortPrice}</option><option value="economy">{t.sortEconomy}</option>
          </select>
          <button onClick={onShare} className={btnGhost}><Share2 className="h-4 w-4" aria-hidden />{t.share}</button>
        </div>
      </div>

      {!top ? <div className="mt-6"><EmptyState text={t.emptyFilter} /></div> : (
        <>
          <article className={`${card} mt-6 grid overflow-hidden lg:grid-cols-[1.15fr_1fr]`}>
            <div className="relative min-h-[260px]">
              <CarPhoto name={top.make} className="absolute inset-0 h-full w-full" width={1280} />
              <span className="absolute start-4 top-4 rounded-full bg-go px-3 py-1 text-[14px] font-bold text-white">#1 · <Star className="inline h-3.5 w-3.5 -translate-y-px fill-current" aria-hidden /> {ten(top.match).toFixed(1)}</span>
            </div>
            <div className="flex flex-col p-5 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[1.6rem] leading-tight">{shortName(top.make)}</h3>
                  <p className="mt-1 text-[15px] text-muted"><bdi>{top.years}</bdi></p>
                  <div className="mt-2"><Score value={top.match} /></div>
                </div>
                <SaveBtn on={saved.includes(top.id)} onClick={() => toggleSaved(top.id)} />
              </div>
              <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-3">
                <div><span className="block text-[13px] font-semibold text-muted">{t.monthlyOwn}</span><MonthlyTag value={monthlyFor(top, km)} size="md" /></div>
                <div><span className="block text-[13px] font-semibold text-muted">{t.marketPrice}</span><span className="num text-[22px]"><bdi>{top.marketRange ?? shekel(top.price, nf)}</bdi></span></div>
              </div>
              <p className="mt-4 text-[16px] leading-7">{top.why}</p>
              <div className="mt-4"><Breakdown car={top} km={km} compact /></div>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <button onClick={() => onDetails(top.id)} className={btnPrimary}>{t.details}</button>
                <button onClick={() => toggleCompare(top.id)} aria-pressed={compare.includes(top.id)} className={`${btnGhost} ${compare.includes(top.id) ? "border-go bg-go-soft text-go-deep" : ""}`}>{compare.includes(top.id) ? t.compareIn : t.compareAdd}</button>
                <button onClick={() => setCostOpen((v) => !v)} aria-expanded={costOpen} className={btnGhost}>{t.costCalc}<ChevronDown className={`h-4 w-4 transition-transform ${costOpen ? "rotate-180" : ""}`} aria-hidden /></button>
              </div>
            </div>
          </article>
          {costOpen && <CostPanel car={top} answers={answers} />}

          {rest.length > 0 && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(0, 6).map((c, i) => (
                <article key={c.id} className={`${card} flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-float)]`}>
                  <div className="relative">
                    <CarPhoto name={c.make} className="aspect-[16/10] w-full" width={800} />
                    <span className="absolute start-3 top-3 rounded-full bg-white px-2.5 py-0.5 text-[13px] font-bold text-ink shadow-[var(--shadow-card)]">#{i + 2} · <Star className="inline h-3.5 w-3.5 -translate-y-px fill-[#f5a524] text-[#f5a524]" aria-hidden /> {ten(c.match).toFixed(1)}</span>
                    <div className="absolute end-3 top-3"><SaveBtn on={saved.includes(c.id)} onClick={() => toggleSaved(c.id)} small /></div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="truncate text-[1.2rem] leading-tight">{shortName(c.make)}</h3>
                    <p className="mt-0.5 text-[14px] text-muted">{lang === "he" ? c.fuel : FUEL_EN[c.fuel] ?? c.fuel} · <span className="num text-[15px]"><bdi>{c.marketRange ?? shekel(c.price, nf)}</bdi></span></p>
                    <div className="mt-3"><MonthlyTag value={monthlyFor(c, km)} size="sm" /></div>
                    <div className="mt-auto flex gap-2 pt-4">
                      <button onClick={() => onDetails(c.id)} className={`${btnGhost} flex-1`}>{t.details}</button>
                      <button onClick={() => toggleCompare(c.id)} aria-pressed={compare.includes(c.id)} className={`${btnGhost} flex-1 ${compare.includes(c.id) ? "border-go bg-go-soft text-go-deep" : ""}`}>{compare.includes(c.id) ? t.compareIn : t.compareAdd}</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 flex flex-col gap-4 rounded-3xl bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="font-display text-[1.35rem] font-bold leading-snug">{t.leadCta}</p>
              <p className="mt-1 max-w-[60ch] text-[15px] text-[#c3cbd6]">{t.leadNote}</p>
            </div>
            <button onClick={onLead} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#5fd3a7] px-7 text-[17px] font-bold text-ink hover:bg-[#7fe0bb]">{t.leadBtn}</button>
          </div>
        </>
      )}
    </div>
  );
}

function SaveBtn({ on, onClick, small }: { on: boolean; onClick: () => void; small?: boolean }) {
  const { t } = useLang();
  return (
    <button onClick={onClick} aria-pressed={on} aria-label={on ? t.saved : t.save} title={on ? t.saved : t.save}
      className={`flex shrink-0 items-center justify-center rounded-full border bg-white ${small ? "h-9 w-9 border-transparent shadow-[var(--shadow-card)]" : "h-11 w-11 border-line"} ${on ? "text-alert" : "text-muted hover:text-ink"}`}>
      <Heart className={`h-[18px] w-[18px] ${on ? "fill-current" : ""}`} />
    </button>
  );
}

function Saved({ cars, history, toggleSaved, toggleCompare, onDetails }: { cars: Car[]; history: Car[]; toggleSaved: (id: string) => void; toggleCompare: (id: string) => void; onDetails: (id: string) => void }) {
  const { t, nf } = useLang();
  return (
    <div>
      {cars.length ? (
        <ul className="space-y-3">
          {cars.map((c) => (
            <li key={c.id} className={`${card} flex items-center gap-4 p-3`}>
              <CarPhoto name={c.make} label={false} className="h-20 w-28 shrink-0 rounded-xl" width={320} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[1.15rem]">{shortName(c.make)}</h3>
                <p className="num text-[15px] text-muted">{shekel(c.price, nf)}</p>
              </div>
              <button onClick={() => onDetails(c.id)} className={btnGhost}>{t.details}</button>
              <button onClick={() => toggleCompare(c.id)} className={`${btnGhost} hidden sm:inline-flex`}>{t.compareAdd}</button>
              <SaveBtn on onClick={() => toggleSaved(c.id)} />
            </li>
          ))}
        </ul>
      ) : <EmptyState text={t.emptySaved} />}
      <h3 className="mt-10 text-[1.25rem]">{t.history}</h3>
      {history.length ? <div className="mt-3 flex flex-wrap gap-2">{history.map((c) => <button key={c.id} onClick={() => onDetails(c.id)} className={btnGhost}>{shortName(c.make)}</button>)}</div> : <p className="mt-2 text-[15px] text-muted">{t.historyEmpty}</p>}
    </div>
  );
}

// ─── Compare ─────────────────────────────────────────────────────────────────
type Band = { totalMonthly: number | null; fuelMonthly?: number | null; insuranceMonthly?: number | null; maintenanceMonthly?: number | null; depreciationMonthly?: number | null; isEstimate?: boolean } | null | undefined;
type Multi = Record<number, { km7000?: Band; km15000?: Band; km25000?: Band }>;
const trimOf = (id: string) => { const n = Number(id); return Number.isFinite(n) && n > 0 ? n : undefined; };
const toBand = (b: CatBand): Band => ({ totalMonthly: b.total, fuelMonthly: b.fuel, insuranceMonthly: b.insurance, maintenanceMonthly: b.maintenance, depreciationMonthly: b.depreciation, isEstimate: true });
/** 7k/15k/25k ladder from the live DB when present, else from the catalog bands. */
function ladderFor(car: Car, db: Multi | undefined): { km7000?: Band; km15000?: Band; km25000?: Band } | undefined {
  const id = trimOf(car.id);
  if (id && db?.[id]) return db[id];
  return car.bands ? { km7000: toBand(car.bands[7000]), km15000: toBand(car.bands[15000]), km25000: toBand(car.bands[25000]) } : undefined;
}

function Money({ v, size }: { v: number | null | undefined; size: number }) {
  const { t, nf } = useLang();
  if (v == null) return <CodeChip code="miss" />;
  return <span className="num" style={{ fontSize: size }}>{shekel(v, nf)}</span>;
}

function Compare({ cars, toggleCompare, onLead }: { cars: Ranked[]; toggleCompare: (id: string) => void; onLead: () => void }) {
  const { lang, t, nf } = useLang();
  const ids = cars.map((c) => trimOf(c.id));
  const valid = ids.filter((x): x is number => x !== undefined);
  const { data, isLoading } = trpc.tco.multiBand.useQuery({ trimIds: valid }, { enabled: valid.length >= 1 });
  const tco = (data ?? {}) as unknown as Multi;
  if (cars.length < 2) return <EmptyState text={t.emptyCompare} />;

  const at = (i: number, band: "km7000" | "km15000" | "km25000") => ladderFor(cars[i], tco)?.[band];
  const totals = cars.map((_, i) => at(i, "km15000")?.totalMonthly ?? null);
  const defined = totals.filter((v): v is number => v != null);
  const best = defined.length >= 2 ? Math.min(...defined) : null;
  const worst = defined.length >= 2 ? Math.max(...defined) : null;

  const rows: [string, (c: Ranked, i: number) => ReactNode][] = [
    [t.matchScore, (c) => <Score value={c.match} compact />],
    [t.monthlyOwn, (c) => <MonthlyTag value={monthlyFor(c, 15000)} size="sm" />],
    [t.price, (c) => <span className="num text-[18px]"><bdi>{c.marketRange ?? shekel(c.price, nf)}</bdi></span>],
    ["7,000 km", (_, i) => <Money v={at(i, "km7000")?.totalMonthly} size={18} />],
    ["15,000 km", (_, i) => <Money v={at(i, "km15000")?.totalMonthly} size={19} />],
    ["25,000 km", (_, i) => <Money v={at(i, "km25000")?.totalMonthly} size={18} />],
    [t.fuelLine, (_, i) => <Money v={at(i, "km15000")?.fuelMonthly} size={17} />],
    [t.insuranceLine, (c, i) => <Money v={at(i, "km15000")?.insuranceMonthly ?? c.insuranceMin} size={17} />],
    [t.maintenanceLine, (_, i) => <Money v={at(i, "km15000")?.maintenanceMonthly} size={17} />],
    [t.depreciationLine, (_, i) => <Money v={at(i, "km15000")?.depreciationMonthly} size={17} />],
    [t.reliability, (c) => <ScoreText value={c.reliability} />],
    [t.safety, (c) => <ScoreText value={c.safety} />],
    [t.powertrain, (c) => <span>{lang === "he" ? c.fuel : FUEL_EN[c.fuel] ?? c.fuel}</span>],
  ];

  return (
    <div>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[620px] table-fixed border-collapse text-[15px]">
          <thead>
            <tr className="border-b border-line">
              <th className="w-40 p-4 text-start align-top font-semibold text-muted">{t.metric}</th>
              {cars.map((c) => (
                <th key={c.id} className="p-4 text-start align-top">
                  <CarPhoto name={c.make} label={false} className="mb-3 aspect-[16/10] w-full rounded-xl" width={480} />
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-display text-[1.05rem] font-bold leading-tight">{shortName(c.make)}</span>
                    <button onClick={() => toggleCompare(c.id)} aria-label={t.modalClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-mist hover:text-ink"><X className="h-4 w-4" /></button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, cell], r) => (
              <tr key={label} className={r % 2 ? "" : "bg-mist/60"}>
                <th scope="row" className="p-4 text-start font-semibold text-muted"><bdi>{label}</bdi></th>
                {cars.map((c, i) => <td key={c.id} className="p-4">{cell(c, i)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isLoading && <p className="mt-2 text-[14px] text-muted">{t.ladderLoading}</p>}
      {best != null && worst != null && (worst - best) * 36 >= 500 && (
        <p className="mt-4 rounded-xl bg-go-soft px-4 py-3 text-[16px] font-semibold text-go-deep">{t.savings3y(shortName(cars[totals.indexOf(best)].make), shekel((worst - best) * 36, nf))}</p>
      )}
      <p className="mt-2 text-[14px] text-muted">{t.insuranceNote}</p>
      <button onClick={onLead} className={`${btnPrimary} mt-6`}>{t.continueLead}</button>
    </div>
  );
}

// ─── Detail ──────────────────────────────────────────────────────────────────
function Detail({ car, km, onBack, onLead, answers, saved, toggleSaved }: { car: Ranked; km: number; onBack: () => void; onLead: () => void; answers: Answers; saved: boolean; toggleSaved: (id: string) => void }) {
  const { t, nf, dir } = useLang();
  const [costOpen, setCostOpen] = useState(false);
  const trim = trimOf(car.id);
  const { data } = trpc.tco.multiBand.useQuery({ trimIds: trim ? [trim] : [0] }, { enabled: Boolean(trim) });
  const ladder = ladderFor(car, data as unknown as Multi | undefined);
  const Back = dir === "rtl" ? ArrowRight : ArrowLeft;
  const ins = car.insuranceMin && car.insuranceMax ? <>{shekel(car.insuranceMin, nf)}–{shekel(car.insuranceMax, nf)}</> : "–";
  return (
    <div>
      <button onClick={onBack} className={btnGhost}><Back className="h-4 w-4" aria-hidden />{t.backToResults}</button>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <CarPhoto name={car.make} className="aspect-[16/10] w-full rounded-3xl" width={1280} eager />
          <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-[clamp(1.6rem,3vw,2.1rem)] leading-tight">{shortName(car.make)}</h3>
              <p className="mt-1 text-[15px] text-muted"><bdi>{car.years}</bdi></p>
            </div>
            <SaveBtn on={saved} onClick={() => toggleSaved(car.id)} />
          </div>
          <dl className={`${card} mt-5 grid grid-cols-3 divide-x divide-line rtl:divide-x-reverse`}>
            <div className="p-4"><dt className="text-[13px] font-semibold text-muted">{t.monthlyOwn}</dt><dd className="m-0 mt-1"><MonthlyTag value={monthlyFor(car, km)} size="sm" /></dd></div>
            <div className="p-4"><dt className="text-[13px] font-semibold text-muted">{t.marketPrice}</dt><dd className="num m-0 mt-1 text-[19px]"><bdi>{car.marketRange ?? shekel(car.price, nf)}</bdi></dd></div>
            <div className="p-4"><dt className="text-[13px] font-semibold text-muted">{t.matchScore}</dt><dd className="m-0 mt-1"><Score value={car.match} compact /></dd></div>
          </dl>
          <div className="mt-6"><Breakdown car={car} km={km} /></div>
          {ladder && (
            <div className="mt-8">
              <h4 className="text-[1.15rem]">{t.ladderTitle}</h4>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["km7000", "km15000", "km25000"] as const).map((b, i) => (
                  <div key={b} className={`rounded-xl border p-3 ${i === 1 ? "border-go bg-go-soft" : "border-line"}`}>
                    <div className="text-[13px] font-semibold text-muted"><bdi>{["7,000", "15,000", "25,000"][i]} km</bdi></div>
                    <Money v={ladder[b]?.totalMonthly} size={22} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {car.dataNote && <p className="mt-6 text-[13px] leading-6 text-muted">{car.dataNote}</p>}
        </div>
        <div className="space-y-6">
          <section className={`${card} p-6`}>
            <h4 className="text-[1.2rem]">{t.overview}</h4>
            <p className="mt-2 text-[16px] leading-7">{car.why}</p>
            <div className="mt-4"><SubScores items={[[t.reliability, car.reliability], [t.safety, car.safety], [t.economy, car.economy], [t.comfort, car.comfort]]} /></div>
          </section>
          {(car.pros.length > 0 || car.cons.length > 0) && (
            <section className={`${card} p-6`}>
              <h4 className="text-[1.2rem]">{t.prosCons}</h4>
              <ul className="mt-3 space-y-2 text-[16px]">
                {car.pros.map((p) => <li key={p} className="flex gap-2.5"><Check className="mt-1 h-4 w-4 shrink-0 text-go" strokeWidth={3} aria-hidden />{p}</li>)}
                {car.cons.map((c) => <li key={c} className="flex gap-2.5"><X className="mt-1 h-4 w-4 shrink-0 text-alert" strokeWidth={3} aria-hidden />{c}</li>)}
              </ul>
            </section>
          )}
          <section className="rounded-2xl bg-ink p-6 text-white">
            <h4 className="text-[1.2rem]">{t.insuranceEst}</h4>
            <p className="num mt-2 text-[30px] text-[#5fd3a7]">{ins}</p>
            <p className="text-[14px] text-[#c3cbd6]">{t.insuranceWho} · {t.insuranceNote}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={onLead} className="inline-flex min-h-11 items-center rounded-full bg-[#5fd3a7] px-5 text-[15px] font-bold text-ink hover:bg-[#7fe0bb]">{t.continueLead}</button>
              <button onClick={() => setCostOpen((v) => !v)} aria-expanded={costOpen} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#4a5a70] px-4 text-[15px] font-bold text-white hover:border-white">{t.costCalc}<ChevronDown className={`h-4 w-4 transition-transform ${costOpen ? "rotate-180" : ""}`} aria-hidden /></button>
            </div>
          </section>
        </div>
      </div>
      {costOpen && <CostPanel car={car} answers={answers} />}
    </div>
  );
}

// ─── Analysis & tools ────────────────────────────────────────────────────────
function Analysis({ car, answers }: { car: Ranked; answers: Answers }) {
  const { t, nf } = useLang();
  const trim = trimOf(car.id);
  const { data } = trpc.tco.multiBand.useQuery({ trimIds: trim ? [trim] : [0] }, { enabled: Boolean(trim) });
  const band = answers.annualKmBand === "low" ? "km7000" : answers.annualKmBand === "high" ? "km25000" : "km15000";
  const active = ladderFor(car, data as unknown as Multi | undefined)?.[band];
  const monthly = active?.totalMonthly ?? monthlyFor(car, answers.annualKm);
  const perKm = (monthly * 12) / answers.annualKm;
  const fuelKm = car.fuel === "חשמלי" ? 0.102 : car.fuel === "היברידי" ? 0.32 : 0.497;
  const yearly = car.fuel !== "בנזין" ? Math.round((0.497 - fuelKm) * answers.annualKm) : 0;
  const metrics: [string, number][] = [[t.reliability, car.reliability], [t.economy, car.economy], [t.safety, car.safety], [t.comfort, car.comfort]];
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className={`${card} p-6`}>
        <h3 className="text-[1.4rem]">{shortName(car.make)}</h3>
        <dl className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-mist p-3"><dt className="text-[13px] font-semibold text-muted">{t.analysisScore}</dt><dd className="m-0 mt-1"><Score value={car.match} compact /></dd></div>
          <div className="rounded-xl bg-mist p-3"><dt className="text-[13px] font-semibold text-muted">{t.cost3y}</dt><dd className="num m-0 text-[21px]">{shekel(monthly * 36, nf)}</dd></div>
          <div className="rounded-xl bg-mist p-3"><dt className="text-[13px] font-semibold text-muted">{t.perKm}</dt><dd className="num m-0 text-[21px]"><bdi>₪{perKm.toFixed(2)}</bdi></dd></div>
        </dl>
        <div className="mt-6"><SubScores items={metrics} /></div>
        <div className="mt-8"><Breakdown car={car} km={answers.annualKm} /></div>
      </section>
      <section className={`${card} p-6`}>
        <h3 className="text-[1.4rem]">{t.insights}</h3>
        <ul className="mt-4 space-y-3 text-[16px] leading-7">
          <li className="flex gap-2.5"><Check className="mt-1.5 h-4 w-4 shrink-0 text-go" strokeWidth={3} aria-hidden />{car.why}</li>
          {yearly > 0 && <li className="flex gap-2.5"><Check className="mt-1.5 h-4 w-4 shrink-0 text-go" strokeWidth={3} aria-hidden />{t.fuelSaving(shekel(yearly, nf), shekel(yearly * 3, nf))}</li>}
          <li className="flex gap-2.5"><Check className="mt-1.5 h-4 w-4 shrink-0 text-go" strokeWidth={3} aria-hidden />{t.checkBefore}</li>
        </ul>
      </section>
    </div>
  );
}

function Tools({ car, answers, setAnswers }: { car: Ranked; answers: Answers; setAnswers: React.Dispatch<React.SetStateAction<Answers>> }) {
  const { t, nf } = useLang();
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className={`${card} p-6 sm:p-8`}>
        <h3 className="text-[1.4rem]">{t.monthlyTool}</h3>
        <p className="mt-1 text-[15px] text-muted">{t.monthlyToolSub} · {shortName(car.make)}</p>
        <div className="mt-6"><MonthlyTag value={monthlyFor(car, answers.annualKm)} /></div>
        <label className="mt-8 block text-[15px] font-semibold">
          <span className="num text-[20px]">{nf.format(answers.annualKm)}</span> {t.kmYear}
          <input type="range" min={5000} max={40000} step={1000} value={answers.annualKm} className="mt-3 block w-full"
            onChange={(e) => { const km = Number(e.target.value); setAnswers((p) => ({ ...p, annualKm: km, annualKmBand: km <= 10000 ? "low" : km >= 20000 ? "high" : "mid" })); }} />
        </label>
      </section>
      <section className={`${card} p-6 sm:p-8`}>
        <h3 className="text-[1.4rem]">{t.checklist}</h3>
        <ul className="mt-4 space-y-2">
          {t.checklistItems.map((item) => (
            <li key={item}><label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl bg-mist px-3 text-[16px] font-semibold"><input type="checkbox" className="h-5 w-5" />{item}</label></li>
          ))}
        </ul>
        <p className="mt-3 text-[14px] text-muted">{t.checklistNote}</p>
      </section>
    </div>
  );
}

// ─── Legend (the proof) ──────────────────────────────────────────────────────
function Legend() {
  const { t } = useLang();
  const items: [Code, string, string][] = [["off", t.codeOfficial, t.legendOfficial], ["est", t.codeEstimate, t.legendEstimate], ["miss", t.codeMissing, t.legendMissing]];
  return (
    <section id="legend" className="scroll-mt-20 bg-mist">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-8 lg:py-20">
        <h2 className="max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.1]">{t.legendTitle}</h2>
        <p className="mt-3 max-w-[58ch] text-[17px] text-muted">{t.legendSub}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map(([code, label, text]) => (
            <div key={code} className={`${card} p-6`}>
              <div className="flex items-center gap-3"><CodeChip code={code} /><h3 className="text-[1.25rem]">{label}</h3></div>
              <p className="mt-3 text-[16px] leading-7 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Advisor chat ────────────────────────────────────────────────────────────
function Advisor() {
  const { lang, t, dir } = useLang();
  const [messages, setMessages] = useState<{ from: "ai" | "user"; text: string; time: string }[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const el = listRef.current; if (el && messages.length) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); }, [messages, loading]);

  async function send(text = question) {
    const q = text.trim();
    if (!q || loading) return;
    const next = [...messages, { from: "user" as const, text: q, time: formatTime(lang) }];
    setMessages(next); setQuestion(""); setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.from === "user" ? "user" : "assistant", content: m.text })) }),
      });
      const data = await res.json().catch(() => { throw new Error(`HTTP_${res.status}`); });
      if (!res.ok) throw new Error(res.status === 503 ? "CFG" : res.status === 502 ? `PROVIDER_${data?.providerStatus ?? ""}_${data?.providerError ?? ""}` : res.status === 429 ? "RATE" : `HTTP_${res.status}`);
      setMessages((p) => [...p, { from: "ai", text: data.reply || t.chatEmpty, time: formatTime(lang) }]);
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      const reply = code === "CFG" ? t.chatNotConfigured : code.startsWith("PROVIDER") ? t.chatProviderCode(code.split("_")[1] ?? "", code.split("_").slice(2).join("_")) : code === "RATE" ? t.chatRate : t.chatFail(code.startsWith("HTTP_") ? code.slice(5) : "");
      setMessages((p) => [...p, { from: "ai", text: reply, time: formatTime(lang) }]);
    } finally { setLoading(false); }
  }

  const all = [{ from: "ai" as const, text: t.chatHello, time: "" }, ...messages];
  return (
    <section id="advisor" className="mx-auto grid max-w-[1280px] scroll-mt-20 gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:py-24">
      <div>
        <h2 className="max-w-[14ch] text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.1]">{t.chatTitle}</h2>
        <p className="mt-3 max-w-[46ch] text-[17px] text-muted">{t.chatSub}</p>
      </div>
      <div className={`${card} flex flex-col overflow-hidden`}>
        <div ref={listRef} className="flex max-h-[440px] min-h-[280px] flex-col gap-3 overflow-y-auto bg-mist/60 p-4 sm:p-6" aria-live="polite">
          {all.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[16px] leading-7 ${m.from === "user" ? "rounded-ss-md bg-go text-white" : "rounded-se-md border border-line bg-white"}`}>
                {m.text}
                {m.time && <div className={`mt-0.5 text-[12px] ${m.from === "user" ? "text-[#d4efe4]" : "text-muted"}`}>{m.time}</div>}
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-end"><div className="rounded-2xl border border-line bg-white px-4 py-2.5 text-[15px] text-muted">{t.chatTyping}</div></div>}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-line px-4 pt-4 sm:px-6">
          {t.chatChips.map((c) => <button key={c} onClick={() => send(c)} disabled={loading} className="min-h-10 rounded-full border border-line bg-white px-3.5 text-[14px] font-semibold hover:border-go hover:text-go-deep disabled:opacity-50">{c}</button>)}
        </div>
        <form className="flex gap-2 p-4 sm:p-6" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t.chatPlaceholder} disabled={loading} aria-label={t.chatPlaceholder}
            className="min-h-12 min-w-0 flex-1 rounded-full border border-line bg-white px-5 text-[16px] outline-none placeholder:text-muted focus:border-go disabled:opacity-60" />
          <button type="submit" disabled={loading || !question.trim()} aria-label={t.chatSend} className={`${btnPrimary} min-h-12 disabled:opacity-40`}>
            <Send className={`h-4 w-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} aria-hidden /><span className="hidden sm:inline">{t.chatSend}</span>
          </button>
        </form>
      </div>
    </section>
  );
}

// ─── Cost panel (inline) ─────────────────────────────────────────────────────
function CostPanel({ car, answers }: { car: Ranked; answers: Answers }) {
  const { t, nf } = useLang();
  const [down, setDown] = useState(30);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(5);
  const [loan, setLoan] = useState(false);
  const km = answers.annualKm;
  const rows = tcoRows(car, km, t);
  const known = rows.filter((r) => r.value != null) as { label: string; value: number; code: Code }[];
  const missing = rows.filter((r) => r.value == null);
  const formula: Record<string, number> = {
    [t.fuelLine]: Math.round((km / 12) * (car.fuel === "חשמלי" ? 0.102 : car.fuel === "היברידי" ? 0.32 : 0.497)),
    [t.insuranceLine]: 400, [t.maintenanceLine]: 220, [t.depreciationLine]: Math.round((car.price * 0.08) / 12),
  };
  // One source of truth: with an overall monthly estimate, the rows add up to exactly that figure.
  const lines: { label: string; value: number; code: Code }[] = missing.length === 0 ? known
    : car.ownershipMonthly
      ? [...known, { label: t.otherCosts, value: Math.max(0, monthlyFor(car, km) - known.reduce((s, r) => s + r.value, 0)), code: "est" }]
      : [...known, ...missing.map((r) => ({ label: `${r.label} ${t.formulaSuffix}`, value: formula[r.label] ?? 0, code: "est" as Code }))];
  const running = lines.reduce((s, r) => s + r.value, 0);
  const principal = Math.round(car.price * (1 - down / 100));
  const mr = rate / 100 / 12, n = years * 12;
  const pay = mr > 0 ? Math.round((principal * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1)) : Math.round(principal / n);
  const total = running + (loan ? pay : 0);
  return (
    <section aria-label={t.costTitle} className={`${card} swap mt-6 grid gap-8 p-5 sm:p-7 lg:grid-cols-2`}>
      <div>
        <h3 className="text-[1.4rem]">{t.costTitle}</h3>
        <p className="mt-1 text-[15px] text-muted">{shortName(car.make)} · {t.kmBasis(km)}</p>
        <div className="mt-4"><MonthlyTag value={total} label={loan ? t.withLoan : t.runningOnly} /></div>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {lines.map((r, i) => <li key={r.label} className="flex items-center justify-between gap-4 py-2.5 text-[16px]"><span className="flex items-center gap-2 text-ink"><span aria-hidden className="h-3 w-3 shrink-0 rounded-[4px]" style={{ background: COST_COLORS[i] ?? "#8c96a3" }} />{r.label}<CodeChip code={r.code} /></span><span className="num text-[18px]">{shekel(r.value, nf)}</span></li>)}
          <li className="flex items-center justify-between py-2.5 text-[16px] font-bold"><span>{t.runningTotal}</span><span className="num text-[20px]">{shekel(running, nf)}</span></li>
        </ul>
      </div>
      <div>
        <button onClick={() => setLoan((v) => !v)} aria-expanded={loan} className={`${btnGhost} w-full justify-between`}>{loan ? t.hideLoan : t.addLoan}<ChevronDown className={`h-4 w-4 transition-transform ${loan ? "rotate-180" : ""}`} aria-hidden /></button>
        {loan && (
          <div className="mt-5 space-y-5">
            <Slider label={`${t.down}: ${down}% (${shekel((car.price * down) / 100, nf)})`} aside={`${t.loan}: ${shekel(principal, nf)}`} min={10} max={60} step={5} value={down} onChange={setDown} />
            <Slider label={`${t.rate}: ${rate}%`} aside={`${t.totalInterest}: ${shekel(pay * n - principal, nf)}`} min={2} max={12} step={0.5} value={rate} onChange={setRate} />
            <Slider label={`${years} ${t.years}`} aside={`${t.loanMonthly}: ${shekel(pay, nf)}`} min={2} max={7} step={1} value={years} onChange={setYears} />
          </div>
        )}
        {missing.length > 0 && <p className="mt-5 text-[13px] text-muted">{t.formulaNote}</p>}
        <p className="mt-2 text-[13px] text-muted">{t.calcNote}</p>
      </div>
    </section>
  );
}

function Slider({ label, aside, min, max, step, value, onChange }: { label: string; aside: string; min: number; max: number; step: number; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="flex flex-wrap justify-between gap-2 text-[15px]"><span className="font-semibold">{label}</span><span className="text-muted">{aside}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 block w-full" />
    </label>
  );
}
