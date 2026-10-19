import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import LeadRequestModal from "@/components/LeadRequestModal";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, BatteryCharging, Building2, ChevronDown, CircleDashed, Fuel, Gauge, Heart, Languages,
  MapPin, Milestone, PlugZap, RotateCcw, Route, Send, Share2, ShieldCheck, Sofa, Users, Wrench, X, type LucideIcon,
} from "lucide-react";
import { Link } from "wouter";
import { photoFor } from "./vehicleImages";
import { shekel, useLang, type Lang } from "./i18n";

// ─── Types & data ────────────────────────────────────────────────────────────
type Car = {
  id: string; make: string; years: string; price: number; score: number; use: string; fuel: string;
  reliability: number; safety: number; economy: number; comfort: number; fun: number;
  why: string; pros: string[]; cons: string[]; bodyType?: string;
  insuranceMin?: number; insuranceMax?: number; ownershipMonthly?: number;
  fuelMonthly?: number; insuranceMonthlyAmt?: number; maintenanceMonthly?: number; depreciationMonthly?: number;
  marketRange?: string; dataNote?: string; dataStatus?: string; dataConfidence?: number;
  sourceName?: string; sourceUrl?: string; lastVerifiedAt?: string; demo?: boolean;
};
type Ranked = Car & { match: number };
type StepKey = "budget" | "use" | "priority" | "fuel" | "annualKm";
type Answers = { budget: number; use: string; priority: string; fuel: string; family: string; annualKm: number; annualKmBand: "low" | "mid" | "high" };
type Choice = { value: string | number; icon?: LucideIcon; amount?: string; he: [string, string]; en: [string, string] };

const FULL: StepKey[] = ["budget", "use", "priority", "fuel", "annualKm"];
const QUICK: StepKey[] = ["budget", "use", "fuel"];
const REGISTRATION = 121;
const FUEL_HE: Record<string, string> = { hybrid: "היברידי", petrol: "בנזין", electric: "חשמלי" };
const FUEL_EN: Record<string, string> = { "היברידי": "Hybrid", "בנזין": "Petrol", "חשמלי": "Electric", "דיזל": "Diesel" };

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

const fallbackCars: Car[] = [
  { id: "corolla-hybrid", make: "Toyota Corolla Hybrid 2022", years: "2022 · Hybrid · 1.8L", price: 100000, score: 95, use: "city", fuel: "היברידי", reliability: 98, safety: 92, economy: 96, comfort: 86, fun: 76, why: "השילוב הרגוע ביותר בין חיסכון, אמינות ושוק יד שנייה חזק.", pros: ["חיסכון משמעותי בעיר", "אמינות גבוהה", "קל למכור בהמשך"], cons: ["מחיר רכישה גבוה יותר", "עיצוב שמרני"] },
  { id: "tucson", make: "Hyundai Tucson 2022", years: "2022 · Petrol · 1.6T", price: 128000, score: 91, use: "family", fuel: "בנזין", reliability: 90, safety: 91, economy: 76, comfort: 93, fun: 74, why: "בחירה מאוזנת למשפחה שרוצה מרחב, זמינות ושקט תפעולי.", pros: ["מרחב פנים מצוין", "שירות נפוץ בישראל", "בטיחות טובה"], cons: ["צריכת דלק בינונית", "פחות זריז בעיר"] },
  { id: "mazda3", make: "Mazda 3 2022", years: "2022 · Petrol · 2.0L", price: 95000, score: 89, use: "fun", fuel: "בנזין", reliability: 89, safety: 91, economy: 78, comfort: 85, fun: 94, why: "למי שרוצה שהרכב ירגיש טוב גם אחרי שהגיע ליעד.", pros: ["עיצוב מוקפד", "נהיגה מהנה", "תא נוסעים איכותי"], cons: ["תא מטען קטן יחסית", "מושב אחורי צפוף"] },
  { id: "corolla", make: "Toyota Corolla 2022", years: "2022 · Petrol · 1.8L", price: 92000, score: 93, use: "highway", fuel: "בנזין", reliability: 97, safety: 90, economy: 86, comfort: 84, fun: 70, why: "בחירה בטוחה למי שמעדיף פחות דרמה ויותר עקביות לאורך זמן.", pros: ["אמינות גבוהה מאוד", "עלות אחזקה צפויה", "ערך יד שנייה"], cons: ["פחות מרווחת מ-SUV", "אופי סולידי"] },
  { id: "rav4", make: "Toyota RAV4 Hybrid 2022", years: "2022 · Hybrid · AWD", price: 185000, score: 94, use: "family", fuel: "היברידי", reliability: 97, safety: 96, economy: 91, comfort: 94, fun: 78, why: "SUV משפחתי עם שילוב חזק של בטיחות, מרחב וחיסכון.", pros: ["מרחב למשפחה", "בטיחות גבוהה", "היברידי חסכוני"], cons: ["מחיר גבוה", "ביקוש גבוה ביד שנייה"] },
  { id: "niro", make: "Kia Niro Hybrid 2022", years: "2022 · Hybrid · HEV", price: 108000, score: 88, use: "city", fuel: "היברידי", reliability: 90, safety: 86, economy: 92, comfort: 84, fun: 68, why: "קרוסאובר חסכוני וקומפקטי עם עלות שימוש הגיונית.", pros: ["חסכוני בעיר", "שימושי למשפחה", "שקט בנסיעה"], cons: ["ביצועים בינוניים בעומס", "חבילת בטיחות תלויה בגרסה"] },
  { id: "ioniq5", make: "Hyundai Ioniq 5 2022", years: "2022 · Electric · RWD", price: 122000, score: 87, use: "highway", fuel: "חשמלי", reliability: 91, safety: 95, economy: 88, comfort: 95, fun: 90, why: "חשמלית מרווחת עם טעינה מהירה וחוויית שימוש מתקדמת.", pros: ["טעינה מהירה", "מרווחת מאוד", "עלויות שוטפות נמוכות"], cons: ["טווח משתנה בתנאי אמת", "צריך גישה לטעינה"] },
];

const vehicleEconomics: Record<string, { insuranceMin: number; insuranceMax: number; ownershipMonthly: number; marketRange: string }> = {
  "corolla-hybrid": { insuranceMin: 450, insuranceMax: 900, ownershipMonthly: 2750, marketRange: "₪85K–₪115K" },
  tucson: { insuranceMin: 350, insuranceMax: 550, ownershipMonthly: 1600, marketRange: "₪105K–₪135K" },
  mazda3: { insuranceMin: 240, insuranceMax: 400, ownershipMonthly: 1200, marketRange: "₪85K–₪110K" },
  corolla: { insuranceMin: 450, insuranceMax: 900, ownershipMonthly: 2300, marketRange: "₪88K–₪110K" },
  rav4: { insuranceMin: 500, insuranceMax: 900, ownershipMonthly: 2400, marketRange: "₪175K–₪200K" },
  niro: { insuranceMin: 300, insuranceMax: 500, ownershipMonthly: 1850, marketRange: "₪95K–₪120K" },
  ioniq5: { insuranceMin: 450, insuranceMax: 750, ownershipMonthly: 1300, marketRange: "₪109K–₪134K" },
};

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

/** 6-factor weighted score: budget 25 · use 20 · TCO 20 · reliability 15 · safety 10 · priority 10, plus km/fuel adjustments. */
function computeScore(car: Car, a: Answers): number {
  let s = 0;
  if (car.price <= a.budget * 0.85) s += 25; else if (car.price <= a.budget) s += 18; else if (car.price <= a.budget * 1.1) s += 8;
  const useBody: Record<string, string[]> = { city: ["hatchback", "sedan"], family: ["suv", "minivan"], highway: ["sedan", "suv"], fun: ["sedan", "hatchback"] };
  const body = (car.bodyType ?? "").toLowerCase();
  s += a.use ? ((useBody[a.use] ?? []).includes(body) || car.use === a.use ? 20 : 10) : 14;
  const m = car.ownershipMonthly ?? 2200;
  s += m < 1500 ? 20 : m < 1800 ? 16 : m < 2200 ? 11 : 5;
  s += Math.round((car.reliability / 100) * 15);
  s += Math.round((car.safety / 100) * 10);
  const field: Record<string, keyof Car> = { reliable: "reliability", economy: "economy", safety: "safety", comfort: "comfort" };
  const f = field[a.priority || "reliable"];
  if (f) s += Math.round(((car[f] as number) / 100) * 10);
  if (a.annualKmBand === "low" && car.fuel === "חשמלי") s -= 5;
  if (a.annualKmBand === "high" && car.fuel === "היברידי") s += 4;
  if (a.annualKmBand === "high" && car.fuel === "חשמלי") s -= 3;
  if (a.fuel && a.fuel !== "any" && FUEL_HE[a.fuel] && car.fuel !== FUEL_HE[a.fuel]) s -= 6;
  return Math.min(99, Math.max(35, s));
}

type Dict = ReturnType<typeof useLang>["t"];
type Code = "off" | "est" | "miss";

/** Monthly components with provenance; registration is the official annual licence fee (₪121/month). */
function tcoRows(car: Car, km: number, t: Dict): { label: string; value?: number; code: Code }[] {
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
  if (car.ownershipMonthly) return Math.round(car.ownershipMonthly * (0.7 + 0.3 * (km / 15000)));
  return Math.round(car.price * 0.08 / 12 + (km / 12) * (car.fuel === "היברידי" ? 0.42 : 0.62) + 500);
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
  const { lang, t, dir, setLang } = useLang();
  const { isAuthenticated } = useAuth();
  const sessionId = useMemo(() => `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, []);

  const [mode, setMode] = useState<"quick" | "full">("full");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ budget: 100000, use: "", priority: "", fuel: "", family: "", annualKm: 15000, annualKmBand: "mid" });
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
    if (!rows.length) return fallbackCars.map((c) => ({ ...c, ...vehicleEconomics[c.id], demo: true }));
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
  const complete = done && Boolean(answers.use && answers.fuel);
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

  function choose(key: StepKey, value: string | number) {
    track(`answer_${key}`);
    setAnswers((prev) => {
      if (key === "annualKm") {
        const band = value as Answers["annualKmBand"];
        return { ...prev, annualKmBand: band, annualKm: band === "low" ? 7000 : band === "high" ? 25000 : 15000 };
      }
      const next = { ...prev, [key]: value } as Answers;
      if (mode === "quick" && key === "use" && !prev.priority) next.priority = "reliable";
      return next;
    });
    window.setTimeout(() => setStep((s) => Math.min(s + 1, order.length)), 180);
  }
  function switchMode(m: "quick" | "full") {
    track(`mode_${m}`);
    setMode(m);
    setStep((s) => Math.min(s, (m === "quick" ? QUICK : FULL).length));
  }
  function reset() {
    track("quiz_reset");
    setStep(0);
    setAnswers({ budget: 100000, use: "", priority: "", fuel: "", family: "", annualKm: 15000, annualKmBand: "mid" });
    setTab("results");
  }
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
    const text = t.shareText(shortName(leader.make), leader.match);
    try {
      if (navigator.share) await navigator.share({ title: "AutoAI", text });
      else { await navigator.clipboard.writeText(text); toast(t.copiedToast); }
    } catch {}
  }
  function showResults() {
    track("results_viewed");
    setTab("results");
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const openDetail = (id: string) => { setSelectedId(id); setTab("detail"); resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const detailCar = ranked.find((c) => c.id === selectedId) ?? leader;

  return (
    <main dir={dir} lang={lang} className="min-h-screen bg-concrete text-asphalt">
      <header className="border-b border-seam">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <a href="#top" className="flex items-center gap-2.5 text-asphalt no-underline" aria-label="AutoAI">
            <span aria-hidden className="curb-est block h-6 w-9 [--stripe:6px]" />
            <span className="font-display text-[22px] leading-none">AutoAI</span>
          </a>
          <nav className="flex items-center gap-1 text-[15px] font-semibold sm:gap-5">
            <a href="#legend" className="hidden text-tar no-underline hover:text-asphalt md:inline">{t.navHow}</a>
            <a href="#results" className="hidden text-tar no-underline hover:text-asphalt md:inline">{t.navResults}</a>
            <a href="#advisor" className="hidden text-tar no-underline hover:text-asphalt sm:inline">{t.navAdvisor}</a>
            <button onClick={() => setLang(lang === "he" ? "en" : "he")} lang={lang === "he" ? "en" : "he"} className="flex min-h-10 items-center gap-1.5 border border-seam bg-slab px-3 text-[14px] font-bold hover:border-asphalt">
              <Languages className="h-4 w-4" aria-hidden />{t.langSwitch}
            </button>
          </nav>
        </div>
      </header>

      <div className="flex flex-col lg:min-h-[calc(100svh-65px)]">
      <section id="top" className="mx-auto grid w-full max-w-[1320px] gap-10 px-4 pb-10 pt-8 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-14 lg:pt-12">
        <div className="flex flex-col">
          <h1 className="max-w-[14ch] text-[clamp(2.4rem,5.2vw,4.5rem)] leading-[1.04]">{t.heroTitle}</h1>
          <p className="mt-5 max-w-[56ch] text-[17px] leading-7 text-tar sm:text-lg">{t.heroSub}</p>
          <Finder order={order} step={step} setStep={setStep} answers={answers} choose={choose} done={done} complete={complete}
            mode={mode} switchMode={switchMode} reset={reset} onResults={showResults} />
        </div>
        {leader && <LeaderPanel car={leader} km={answers.annualKm} started={step > 0} />}
      </section>

      <div className="mt-auto pb-6"><CurbRail order={order} step={step} setStep={setStep} /></div>
      </div>

      <section id="results" ref={resultsRef} className="mx-auto max-w-[1320px] scroll-mt-4 px-4 pb-20 pt-14 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-seam">
          <h2 className="pb-3 text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight">{t.workspaceTitle}</h2>
          <div role="tablist" className="-mb-px flex flex-wrap gap-x-5 text-[15px] font-bold">
            {([["results", t.tabResults], ["saved", `${t.tabSaved} (${saved.length})`], ["compare", `${t.tabCompare} (${compare.length})`], ["analysis", t.tabAnalysis], ["tools", t.tabTools]] as const).map(([id, label]) => {
              const on = tab === id || (id === "results" && tab === "detail");
              return <button key={id} role="tab" aria-selected={on} onClick={() => setTab(id)}
                className={`min-h-11 border-b-[3px] pb-2 pt-2 ${on ? "border-curb text-asphalt" : "border-transparent text-tar hover:text-asphalt"}`}>{label}</button>;
            })}
          </div>
        </div>
        {isDemo && <p className="mt-5 flex items-start gap-3 text-[15px] text-tar"><span aria-hidden className="curb-miss mt-1.5 block h-2.5 w-10 shrink-0 [--stripe:5px]" />{t.demoNote}</p>}
        {!complete && tab === "results" && <p className="mt-3 text-[15px] text-tar">{t.incomplete}</p>}
        <div className="mt-8">
          {tab === "results" && <Results answers={answers} ranked={ranked} saved={saved} compare={compare} km={answers.annualKm} toggleSaved={toggleSaved} toggleCompare={toggleCompare} onDetails={openDetail} onShare={shareResult} onLead={() => setShowLead(true)} />}
          {tab === "detail" && detailCar && <Detail car={detailCar} km={answers.annualKm} onBack={() => setTab("results")} onLead={() => setShowLead(true)} answers={answers} saved={saved.includes(detailCar.id)} toggleSaved={toggleSaved} />}
          {tab === "saved" && <Saved cars={cars.filter((c) => saved.includes(c.id))} history={cars.filter((c) => history.includes(c.id))} toggleSaved={toggleSaved} toggleCompare={toggleCompare} onDetails={openDetail} />}
          {tab === "compare" && <Compare cars={ranked.filter((c) => compare.includes(c.id))} toggleCompare={toggleCompare} onLead={() => setShowLead(true)} />}
          {tab === "analysis" && leader && <Analysis car={leader} answers={answers} />}
          {tab === "tools" && leader && <Tools car={leader} answers={answers} setAnswers={setAnswers} />}
        </div>
      </section>

      <Legend />
      <Advisor />

      <footer className="bg-asphalt text-paint">
        <div aria-hidden className="curb-est h-3 [--stripe:28px]" />
        <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-4 py-10 text-[15px] sm:px-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="font-display text-2xl">AutoAI</div>
            <p className="mt-2 max-w-[48ch] text-[#c9ccc6]">{t.footerLine}</p>
          </div>
          <div className="max-w-[46ch] text-[#c9ccc6]">
            <Link href="/privacy" className="font-bold text-paint underline">{t.footerPrivacy}</Link>
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
function Finder({ order, step, setStep, answers, choose, done, complete, mode, switchMode, reset, onResults }: {
  order: StepKey[]; step: number; setStep: (n: number) => void; answers: Answers; choose: (k: StepKey, v: string | number) => void;
  done: boolean; complete: boolean; mode: "quick" | "full"; switchMode: (m: "quick" | "full") => void; reset: () => void; onResults: () => void;
}) {
  const { lang, t, dir } = useLang();
  const key = order[Math.min(step, order.length - 1)];
  const titles: Record<StepKey, string> = { budget: t.qBudget, use: t.qUse, priority: t.qPriority, fuel: t.qFuel, annualKm: t.qKm };
  const hint = key === "budget" ? t.hintBudget : key === "annualKm" ? t.hintKm : mode === "quick" ? t.hintQuick : t.hintDefault;
  const current = key === "annualKm" ? answers.annualKmBand : answers[key];
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <div className="mt-8 border-t-2 border-asphalt pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[15px] font-bold text-tar">{done ? t.doneTitle : t.stepOf(step + 1, order.length)}</span>
        <div className="flex items-center gap-2">
          <div role="group" aria-label={t.modeLabel} className="flex border border-seam text-[14px] font-bold">
            {(["quick", "full"] as const).map((m) => (
              <button key={m} onClick={() => switchMode(m)} aria-pressed={mode === m}
                className={`min-h-9 px-3 ${mode === m ? "bg-asphalt text-paint" : "bg-slab text-tar hover:text-asphalt"}`}>{m === "quick" ? t.quick : t.full}</button>
            ))}
          </div>
          {step > 0 && !done && <button onClick={() => setStep(step - 1)} className="min-h-9 border border-seam bg-slab px-3 text-[14px] font-bold hover:border-asphalt">{t.back}</button>}
          <button onClick={reset} aria-label={t.restart} title={t.restart} className="flex h-9 w-9 items-center justify-center border border-seam bg-slab hover:border-asphalt"><RotateCcw className="h-4 w-4" /></button>
        </div>
      </div>

      {!done ? (
        <div key={key} className="swap">
          <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">{titles[key]}</h2>
          <p className="mt-1 text-[15px] text-tar">{hint}</p>
          <ul className="mt-4 divide-y divide-seam border-y border-seam">
            {choices[key].map((c) => {
              const active = String(current) === String(c.value);
              const [label, sub] = c[lang];
              const Icon = c.icon;
              return (
                <li key={String(c.value)}>
                  <button onClick={() => choose(key, c.value)} aria-pressed={active}
                    className={`group flex w-full items-center gap-4 px-3 py-3 text-start transition-colors ${active ? "bg-curb text-paint" : "hover:bg-slab"}`}>
                    {c.amount
                      ? <span className={`num w-[6rem] shrink-0 text-[26px] leading-none ${active ? "text-paint" : "text-asphalt"}`} dir="ltr">{c.amount}</span>
                      : Icon && <Icon aria-hidden className={`h-6 w-6 shrink-0 ${active ? "text-paint" : "text-curb"}`} strokeWidth={1.75} />}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[17px] font-bold leading-snug">{label}</span>
                      <span className={`block text-[15px] leading-snug ${active ? "text-[#dfe7f5]" : "text-tar"}`}>{sub}</span>
                    </span>
                    <Arrow aria-hidden className={`h-5 w-5 shrink-0 transition-transform ${active ? "text-paint" : "text-tar group-hover:text-curb"} ${dir === "rtl" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="swap mt-3">
          <p className="max-w-[52ch] text-[17px] text-tar">{t.doneSub}</p>
          <button onClick={onResults} disabled={!complete}
            className="mt-5 inline-flex min-h-12 items-center gap-2 bg-curb px-6 text-[17px] font-bold text-paint hover:bg-curb-deep disabled:opacity-50">
            {t.showMatches}<Arrow className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}

function CurbRail({ order, step, setStep }: { order: StepKey[]; step: number; setStep: (n: number) => void }) {
  const { t } = useLang();
  const names: Record<StepKey, string> = { budget: t.qBudget, use: t.qUse, priority: t.qPriority, fuel: t.qFuel, annualKm: t.qKm };
  return (
    <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
      <div className="flex gap-[3px]">
        {order.map((k, i) => (
          <button key={k} onClick={() => i <= step && setStep(i)} disabled={i > step} aria-label={names[k]} title={names[k]}
            className="relative h-5 flex-1 overflow-hidden bg-seam disabled:cursor-default">
            {i < step && <span key={`p-${k}`} className="paint-in curb-est absolute inset-0 [--stripe:14px]" />}
            {i === step && <span className="absolute inset-0 bg-asphalt" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Shared pieces ───────────────────────────────────────────────────────────
function Plate({ value, size = "lg", label }: { value: number; size?: "sm" | "md" | "lg"; label?: string }) {
  const { t, nf } = useLang();
  const fs = size === "lg" ? "text-[44px] sm:text-[52px] py-1" : size === "md" ? "text-[30px] py-0.5" : "text-[22px]";
  return (
    <span className="plate" role="img" aria-label={`${label ?? t.monthlyOwn}: ₪${nf.format(Math.round(value))}`}>
      <span className="plate-il" aria-hidden>IL</span>
      <span className={`plate-body ${fs} leading-none`} aria-hidden>
        <span>₪{nf.format(Math.round(value))}</span>
        <span className="text-[0.38em] font-semibold">{label ?? t.perMonth}</span>
      </span>
    </span>
  );
}

function CarPhoto({ name, className = "", eager, width, label = true }: { name: string; className?: string; eager?: boolean; width?: number; label?: boolean }) {
  const { t } = useLang();
  const p = photoFor(name, width);
  const [failed, setFailed] = useState(false);
  if (!p || failed) {
    return (
      <div className={`relative bg-slab ${className}`}>
        <div aria-hidden className="curb-bare absolute inset-x-0 bottom-0 h-3" />
        {label && <span className="absolute end-4 top-3 max-w-[70%] text-end font-display text-xl leading-tight text-tar">{shortName(name)}</span>}
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-seam ${className}`}>
      <img src={p.src} alt={shortName(name)} loading={eager ? "eager" : "lazy"} decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      <a href={p.credit} target="_blank" rel="noopener noreferrer" className="absolute bottom-0 end-0 bg-asphalt/75 px-2 py-0.5 text-[11px] font-semibold text-paint no-underline hover:bg-asphalt">{t.photoCredit}</a>
    </div>
  );
}

function CodeChip({ code }: { code: Code }) {
  const { t } = useLang();
  const label = code === "off" ? t.codeOfficial : code === "est" ? t.codeEstimate : t.codeMissing;
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-tar">
      <span aria-hidden className={`curb-${code} block h-2 w-6 [--stripe:4px]`} />{label}
    </span>
  );
}

function Breakdown({ car, km, compact }: { car: Car; km: number; compact?: boolean }) {
  const { t, nf } = useLang();
  const rows = tcoRows(car, km, t);
  const max = Math.max(1, ...rows.map((r) => r.value ?? 0));
  return (
    <div>
      <ul className={compact ? "space-y-1.5" : "space-y-2.5"}>
        {rows.map((r) => (
          <li key={r.label} className="grid grid-cols-[minmax(6.5rem,auto)_1fr_auto] items-center gap-3 text-[15px]">
            <span className="text-tar">{r.label}</span>
            <span className="relative h-3 bg-slab">
              {r.value != null
                ? <span className={`curb-${r.code} absolute inset-y-0 start-0 [--stripe:6px]`} style={{ width: `${Math.max(4, (r.value / max) * 100)}%` }} />
                : <span className="curb-miss absolute inset-y-0 start-0 w-[18%] [--stripe:6px]" />}
            </span>
            <span className="num min-w-[4.5rem] text-end text-[19px]">{shekel(r.value, nf)}</span>
          </li>
        ))}
      </ul>
      {!compact && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <CodeChip code="off" /><CodeChip code="est" /><CodeChip code="miss" />
          <span className="text-[13px] text-tar">{t.kmBasis(km)}</span>
        </div>
      )}
    </div>
  );
}

function LeaderPanel({ car, km, started }: { car: Ranked; km: number; started: boolean }) {
  const { t } = useLang();
  return (
    <aside className="flex flex-col" aria-live="polite">
      <div key={car.id} className="swap relative">
        <CarPhoto name={car.make} eager width={1280} className="aspect-[4/3] w-full lg:aspect-[16/11]" />
        <div className="absolute -bottom-6 start-4 sm:start-6"><Plate value={monthlyFor(car, km)} /></div>
      </div>
      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-[clamp(1.4rem,2.2vw,1.75rem)] leading-tight">{shortName(car.make)}</h2>
        <span className="text-[15px] font-bold text-tar">{started ? t.leaderNow : t.leaderSample} · <span className="num text-[19px] text-asphalt">{car.match}%</span> {t.match}</span>
      </div>
      <div className="mt-4"><Breakdown car={car} km={km} /></div>
      <p className="mt-2 text-[13px] text-tar">{t.insuranceNote}</p>
    </aside>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-seam bg-slab px-6 py-12 text-center text-[16px] text-tar">
      <div aria-hidden className="curb-bare mx-auto mb-5 h-2 w-20" />{text}
    </div>
  );
}

const btnGhost = "inline-flex min-h-11 items-center justify-center gap-2 border border-seam bg-slab px-4 text-[15px] font-bold hover:border-asphalt";
const btnPrimary = "inline-flex min-h-11 items-center justify-center gap-2 bg-curb px-5 text-[15px] font-bold text-paint hover:bg-curb-deep";

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
  const selectCls = "min-h-11 border border-seam bg-slab px-3 text-[15px] font-semibold";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[70ch] text-[15px] text-tar">{t.rankNote}</p>
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
          <article className="mt-6 grid border border-seam bg-slab lg:grid-cols-[1.15fr_1fr]">
            <div className="relative min-h-[240px]">
              <CarPhoto name={top.make} className="absolute inset-0 h-full w-full" width={1280} />
              <span className="absolute start-0 top-0 bg-asphalt px-3 py-1.5 text-[15px] font-bold text-paint">#1 · <span className="num text-[18px]">{top.match}%</span></span>
            </div>
            <div className="flex flex-col p-5 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[1.7rem] leading-tight">{shortName(top.make)}</h3>
                  <p className="mt-1 text-[15px] text-tar"><bdi>{top.years}</bdi></p>
                </div>
                <SaveBtn on={saved.includes(top.id)} onClick={() => toggleSaved(top.id)} />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Plate value={monthlyFor(top, km)} size="md" />
                <div><span className="block text-[13px] font-semibold text-tar">{t.marketPrice}</span><span className="num text-[22px]"><bdi>{top.marketRange ?? shekel(top.price, nf)}</bdi></span></div>
              </div>
              <p className="mt-5 text-[16px] leading-7">{top.why}</p>
              <div className="mt-4"><Breakdown car={top} km={km} compact /></div>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <button onClick={() => onDetails(top.id)} className={btnPrimary}>{t.details}</button>
                <button onClick={() => toggleCompare(top.id)} aria-pressed={compare.includes(top.id)} className={`${btnGhost} ${compare.includes(top.id) ? "border-curb text-curb" : ""}`}>{compare.includes(top.id) ? t.compareIn : t.compareAdd}</button>
                <button onClick={() => setCostOpen((v) => !v)} aria-expanded={costOpen} className={btnGhost}>{t.costCalc}<ChevronDown className={`h-4 w-4 transition-transform ${costOpen ? "rotate-180" : ""}`} aria-hidden /></button>
              </div>
            </div>
          </article>
          {costOpen && <CostPanel car={top} answers={answers} />}

          {rest.length > 0 && (
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(0, 6).map((c, i) => (
                <article key={c.id} className="flex flex-col">
                  <div className="relative">
                    <CarPhoto name={c.make} className="aspect-[16/10] w-full" width={800} />
                    <span className="absolute start-0 top-0 bg-asphalt px-2.5 py-1 text-[14px] font-bold text-paint">#{i + 2} · <span className="num text-[16px]">{c.match}%</span></span>
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-[1.3rem] leading-tight">{shortName(c.make)}</h3>
                      <p className="text-[14px] text-tar">{lang === "he" ? c.fuel : FUEL_EN[c.fuel] ?? c.fuel} · <span className="num text-[16px]"><bdi>{c.marketRange ?? shekel(c.price, nf)}</bdi></span></p>
                    </div>
                    <SaveBtn on={saved.includes(c.id)} onClick={() => toggleSaved(c.id)} />
                  </div>
                  <div className="mt-3"><Plate value={monthlyFor(c, km)} size="sm" /></div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => onDetails(c.id)} className={`${btnGhost} flex-1`}>{t.details}</button>
                    <button onClick={() => toggleCompare(c.id)} aria-pressed={compare.includes(c.id)} className={`${btnGhost} flex-1 ${compare.includes(c.id) ? "border-curb text-curb" : ""}`}>{compare.includes(c.id) ? t.compareIn : t.compareAdd}</button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 flex flex-col gap-4 bg-asphalt p-6 text-paint sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="font-display text-[1.4rem] leading-snug">{t.leadCta}</p>
              <p className="mt-1 max-w-[60ch] text-[15px] text-[#c9ccc6]">{t.leadNote}</p>
            </div>
            <button onClick={onLead} className="inline-flex min-h-12 shrink-0 items-center justify-center bg-plate px-6 text-[17px] font-bold text-asphalt hover:bg-[#ffd43b]">{t.leadBtn}</button>
          </div>
        </>
      )}
    </div>
  );
}

function SaveBtn({ on, onClick }: { on: boolean; onClick: () => void }) {
  const { t } = useLang();
  return (
    <button onClick={onClick} aria-pressed={on} aria-label={on ? t.saved : t.save} title={on ? t.saved : t.save}
      className={`flex h-11 w-11 shrink-0 items-center justify-center border bg-slab ${on ? "border-stop text-stop" : "border-seam text-tar hover:text-asphalt"}`}>
      <Heart className={`h-5 w-5 ${on ? "fill-current" : ""}`} />
    </button>
  );
}

function Saved({ cars, history, toggleSaved, toggleCompare, onDetails }: { cars: Car[]; history: Car[]; toggleSaved: (id: string) => void; toggleCompare: (id: string) => void; onDetails: (id: string) => void }) {
  const { t, nf } = useLang();
  return (
    <div>
      {cars.length ? (
        <ul className="divide-y divide-seam border-y border-seam">
          {cars.map((c) => (
            <li key={c.id} className="flex items-center gap-4 py-4">
              <CarPhoto name={c.make} className="h-20 w-28 shrink-0" width={320} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[1.2rem]">{shortName(c.make)}</h3>
                <p className="num text-[16px] text-tar">{shekel(c.price, nf)}</p>
              </div>
              <button onClick={() => onDetails(c.id)} className={btnGhost}>{t.details}</button>
              <button onClick={() => toggleCompare(c.id)} className={`${btnGhost} hidden sm:inline-flex`}>{t.compareAdd}</button>
              <SaveBtn on onClick={() => toggleSaved(c.id)} />
            </li>
          ))}
        </ul>
      ) : <EmptyState text={t.emptySaved} />}
      <h3 className="mt-10 text-[1.3rem]">{t.history}</h3>
      {history.length ? <div className="mt-3 flex flex-wrap gap-2">{history.map((c) => <button key={c.id} onClick={() => onDetails(c.id)} className={btnGhost}>{shortName(c.make)}</button>)}</div> : <p className="mt-2 text-[15px] text-tar">{t.historyEmpty}</p>}
    </div>
  );
}

// ─── Compare ─────────────────────────────────────────────────────────────────
type Band = { totalMonthly: number | null; fuelMonthly?: number | null; insuranceMonthly?: number | null; maintenanceMonthly?: number | null; depreciationMonthly?: number | null; isEstimate?: boolean } | null | undefined;
type Multi = Record<number, { km7000?: Band; km15000?: Band; km25000?: Band }>;
const trimOf = (id: string) => { const n = Number(id); return Number.isFinite(n) && n > 0 ? n : undefined; };

function Compare({ cars, toggleCompare, onLead }: { cars: Ranked[]; toggleCompare: (id: string) => void; onLead: () => void }) {
  const { lang, t, nf } = useLang();
  const ids = cars.map((c) => trimOf(c.id));
  const valid = ids.filter((x): x is number => x !== undefined);
  const { data, isLoading } = trpc.tco.multiBand.useQuery({ trimIds: valid }, { enabled: valid.length >= 1 });
  const tco = (data ?? {}) as unknown as Multi;
  if (cars.length < 2) return <EmptyState text={t.emptyCompare} />;

  const at = (i: number, band: "km7000" | "km15000" | "km25000") => { const id = ids[i]; return id ? tco[id]?.[band] : undefined; };
  const totals = cars.map((_, i) => at(i, "km15000")?.totalMonthly ?? null);
  const defined = totals.filter((v): v is number => v != null);
  const best = defined.length >= 2 ? Math.min(...defined) : null;
  const worst = defined.length >= 2 ? Math.max(...defined) : null;

  const rows: [string, (c: Ranked, i: number) => ReactNode][] = [
    [t.match, (c) => <span className="num text-[20px]">{c.match}%</span>],
    [t.price, (c) => <span className="num text-[20px]"><bdi>{c.marketRange ?? shekel(c.price, nf)}</bdi></span>],
    ["7,000 km", (_, i) => <Money v={at(i, "km7000")?.totalMonthly} size={20} />],
    ["15,000 km", (_, i) => <Money v={at(i, "km15000")?.totalMonthly} size={22} />],
    ["25,000 km", (_, i) => <Money v={at(i, "km25000")?.totalMonthly} size={20} />],
    [t.fuelLine, (_, i) => <Money v={at(i, "km15000")?.fuelMonthly} size={18} />],
    [t.insuranceLine, (c, i) => <Money v={at(i, "km15000")?.insuranceMonthly ?? c.insuranceMin} size={18} />],
    [t.maintenanceLine, (_, i) => <Money v={at(i, "km15000")?.maintenanceMonthly} size={18} />],
    [t.depreciationLine, (_, i) => <Money v={at(i, "km15000")?.depreciationMonthly} size={18} />],
    [t.reliability, (c) => <span className="num text-[18px]">{c.reliability}/100</span>],
    [t.safety, (c) => <span className="num text-[18px]">{c.safety}/100</span>],
    [t.powertrain, (c) => <span>{lang === "he" ? c.fuel : FUEL_EN[c.fuel] ?? c.fuel}</span>],
  ];

  return (
    <div>
      <div className="overflow-x-auto border border-seam bg-slab">
        <table className="w-full min-w-[620px] table-fixed border-collapse text-[15px]">
          <thead>
            <tr className="border-b-2 border-asphalt">
              <th className="w-40 p-3 text-start align-top font-semibold text-tar">{t.metric}</th>
              {cars.map((c) => (
                <th key={c.id} className="p-3 text-start align-top">
                  <CarPhoto name={c.make} label={false} className="mb-2 aspect-[16/10] w-full" width={480} />
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-display text-[1.1rem] font-normal leading-tight">{shortName(c.make)}</span>
                    <button onClick={() => toggleCompare(c.id)} aria-label={t.modalClose} className="flex h-8 w-8 items-center justify-center text-tar hover:text-stop"><X className="h-4 w-4" /></button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, cell]) => (
              <tr key={label} className="border-b border-seam last:border-0">
                <th scope="row" className="p-3 text-start font-semibold text-tar"><bdi>{label}</bdi></th>
                {cars.map((c, i) => <td key={c.id} className="p-3">{cell(c, i)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isLoading && <p className="mt-2 text-[14px] text-tar">{t.ladderLoading}</p>}
      {best != null && worst != null && (worst - best) * 36 >= 500 && (
        <p className="mt-4 flex items-start gap-3 text-[16px]"><span aria-hidden className="curb-est mt-2 block h-2.5 w-10 shrink-0 [--stripe:5px]" />
          {t.savings3y(shortName(cars[totals.indexOf(best)].make), shekel((worst - best) * 36, nf))}</p>
      )}
      <p className="mt-2 text-[14px] text-tar">{t.insuranceNote}</p>
      <button onClick={onLead} className={`${btnPrimary} mt-6`}>{t.continueLead}</button>
    </div>
  );
}

// ─── Detail ──────────────────────────────────────────────────────────────────
function Money({ v, size }: { v: number | null | undefined; size: number }) {
  const { t, nf } = useLang();
  if (v == null) return <span className="inline-flex items-center gap-2 text-[14px] text-tar"><span aria-hidden className="curb-miss block h-2 w-5 [--stripe:4px]" />{t.codeMissing}</span>;
  return <span className="num" style={{ fontSize: size }}>{shekel(v, nf)}</span>;
}

function Detail({ car, km, onBack, onLead, answers, saved, toggleSaved }: { car: Ranked; km: number; onBack: () => void; onLead: () => void; answers: Answers; saved: boolean; toggleSaved: (id: string) => void }) {
  const { t, nf, dir } = useLang();
  const [costOpen, setCostOpen] = useState(false);
  const trim = trimOf(car.id);
  const { data } = trpc.tco.multiBand.useQuery({ trimIds: trim ? [trim] : [0] }, { enabled: Boolean(trim) });
  const ladder = trim ? (data as unknown as Multi | undefined)?.[trim] : undefined;
  const Back = dir === "rtl" ? ArrowRight : ArrowLeft;
  const ins = car.insuranceMin && car.insuranceMax ? <>{shekel(car.insuranceMin, nf)}–{shekel(car.insuranceMax, nf)}</> : "–";
  return (
    <div>
      <button onClick={onBack} className={btnGhost}><Back className="h-4 w-4" aria-hidden />{t.backToResults}</button>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="relative">
            <CarPhoto name={car.make} className="aspect-[16/10] w-full" width={1280} eager />
            <div className="absolute -bottom-6 start-4"><Plate value={monthlyFor(car, km)} /></div>
          </div>
          <div className="mt-12 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] leading-tight">{shortName(car.make)}</h3>
              <p className="mt-1 text-[15px] text-tar"><bdi>{car.years}</bdi></p>
            </div>
            <SaveBtn on={saved} onClick={() => toggleSaved(car.id)} />
          </div>
          <dl className="mt-6 grid grid-cols-3 border-y border-seam">
            <div className="p-3"><dt className="text-[13px] font-semibold text-tar">{t.match}</dt><dd className="num m-0 text-[26px]">{car.match}%</dd></div>
            <div className="border-x border-seam p-3"><dt className="text-[13px] font-semibold text-tar">{t.marketPrice}</dt><dd className="num m-0 text-[20px]"><bdi>{car.marketRange ?? shekel(car.price, nf)}</bdi></dd></div>
            <div className="p-3"><dt className="text-[13px] font-semibold text-tar">{t.insuranceEst}</dt><dd className="num m-0 text-[20px]">{ins}</dd></div>
          </dl>
          <div className="mt-6"><Breakdown car={car} km={km} /></div>
          {ladder && (
            <div className="mt-8">
              <h4 className="font-display text-[1.2rem] font-normal">{t.ladderTitle}</h4>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["km7000", "km15000", "km25000"] as const).map((b, i) => (
                  <div key={b} className={`border p-3 ${i === 1 ? "border-asphalt bg-slab" : "border-seam"}`}>
                    <div className="text-[13px] font-semibold text-tar"><bdi>{["7,000", "15,000", "25,000"][i]} km</bdi></div>
                    <div className="num text-[24px]">{shekel(ladder[b]?.totalMonthly, nf)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {car.dataNote && <p className="mt-6 text-[13px] leading-6 text-tar">{car.dataNote}</p>}
        </div>
        <div className="space-y-8">
          <section>
            <h4 className="font-display text-[1.3rem] font-normal">{t.overview}</h4>
            <p className="mt-2 text-[16px] leading-7">{car.why}</p>
            <ul className="mt-4 space-y-2.5">
              {([[t.reliability, car.reliability], [t.safety, car.safety], [t.economy, car.economy], [t.comfort, car.comfort]] as const).map(([l, v]) => (
                <li key={l} className="grid grid-cols-[6rem_1fr_3.5rem] items-center gap-3 text-[15px]">
                  <span className="text-tar">{l}</span>
                  <span className="relative h-2.5 bg-slab"><span className="absolute inset-y-0 start-0 bg-asphalt" style={{ width: `${v}%` }} /></span>
                  <span className="num text-end text-[18px]">{v}</span>
                </li>
              ))}
            </ul>
          </section>
          {(car.pros.length > 0 || car.cons.length > 0) && (
            <section>
              <h4 className="font-display text-[1.3rem] font-normal">{t.prosCons}</h4>
              <ul className="mt-3 space-y-2 text-[16px]">
                {car.pros.map((p) => <li key={p} className="flex gap-3"><span aria-hidden className="curb-off mt-2.5 block h-1.5 w-4 shrink-0" />{p}</li>)}
                {car.cons.map((c) => <li key={c} className="flex gap-3"><span aria-hidden className="curb-miss mt-2.5 block h-1.5 w-4 shrink-0 [--stripe:4px]" />{c}</li>)}
              </ul>
            </section>
          )}
          <section className="bg-asphalt p-6 text-paint">
            <h4 className="font-display text-[1.3rem] font-normal">{t.insuranceEst}</h4>
            <p className="num mt-2 text-[34px] text-plate">{ins}</p>
            <p className="text-[14px] text-[#c9ccc6]">{t.insuranceWho} · {t.insuranceNote}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={onLead} className="inline-flex min-h-11 items-center bg-plate px-5 text-[15px] font-bold text-asphalt hover:bg-[#ffd43b]">{t.continueLead}</button>
              <button onClick={() => setCostOpen((v) => !v)} aria-expanded={costOpen} className="inline-flex min-h-11 items-center gap-2 border border-[#6b7078] px-4 text-[15px] font-bold text-paint hover:border-paint">{t.costCalc}<ChevronDown className={`h-4 w-4 transition-transform ${costOpen ? "rotate-180" : ""}`} aria-hidden /></button>
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
  const active = trim ? (data as unknown as Multi | undefined)?.[trim]?.[band] : undefined;
  const monthly = active?.totalMonthly ?? monthlyFor(car, answers.annualKm);
  const perKm = (monthly * 12) / answers.annualKm;
  const fuelKm = car.fuel === "חשמלי" ? 0.102 : car.fuel === "היברידי" ? 0.32 : 0.497;
  const yearly = car.fuel !== "בנזין" ? Math.round((0.497 - fuelKm) * answers.annualKm) : 0;
  const metrics: [string, number][] = [[t.reliability, car.reliability], [t.economy, car.economy], [t.safety, car.safety], [t.comfort, car.comfort]];
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section>
        <h3 className="text-[1.5rem]">{shortName(car.make)}</h3>
        <dl className="mt-4 grid grid-cols-3 border-y border-seam">
          <div className="p-3"><dt className="text-[13px] font-semibold text-tar">{t.analysisScore}</dt><dd className="num m-0 text-[30px]">{car.match}%</dd></div>
          <div className="border-x border-seam p-3"><dt className="text-[13px] font-semibold text-tar">{t.cost3y}</dt><dd className="num m-0 text-[24px]">{shekel(monthly * 36, nf)}</dd></div>
          <div className="p-3"><dt className="text-[13px] font-semibold text-tar">{t.perKm}</dt><dd className="num m-0 text-[24px]">₪{perKm.toFixed(2)}</dd></div>
        </dl>
        <ul className="mt-6 space-y-3">
          {metrics.map(([l, v]) => (
            <li key={l} className="grid grid-cols-[6rem_1fr_3rem] items-center gap-3 text-[15px]">
              <span className="text-tar">{l}</span><span className="relative h-2.5 bg-slab"><span className="absolute inset-y-0 start-0 bg-asphalt" style={{ width: `${v}%` }} /></span><span className="num text-end text-[18px]">{v}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8"><Breakdown car={car} km={answers.annualKm} /></div>
      </section>
      <section>
        <h3 className="text-[1.5rem]">{t.insights}</h3>
        <ul className="mt-4 space-y-3 text-[16px] leading-7">
          <li className="flex gap-3"><span aria-hidden className="curb-off mt-3 block h-1.5 w-4 shrink-0" />{car.why}</li>
          {yearly > 0 && <li className="flex gap-3"><span aria-hidden className="curb-est mt-3 block h-1.5 w-4 shrink-0 [--stripe:4px]" />{t.fuelSaving(shekel(yearly, nf), shekel(yearly * 3, nf))}</li>}
          <li className="flex gap-3"><span aria-hidden className="curb-off mt-3 block h-1.5 w-4 shrink-0" />{t.checkBefore}</li>
        </ul>
      </section>
    </div>
  );
}

function Tools({ car, answers, setAnswers }: { car: Ranked; answers: Answers; setAnswers: React.Dispatch<React.SetStateAction<Answers>> }) {
  const { t, nf } = useLang();
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section className="bg-asphalt p-6 text-paint sm:p-8">
        <h3 className="text-[1.5rem]">{t.monthlyTool}</h3>
        <p className="mt-1 text-[15px] text-[#c9ccc6]">{t.monthlyToolSub} · {shortName(car.make)}</p>
        <div className="mt-6"><Plate value={monthlyFor(car, answers.annualKm)} /></div>
        <label className="mt-8 block text-[15px] font-semibold">
          <span className="num text-[22px]">{nf.format(answers.annualKm)}</span> {t.kmYear}
          <input type="range" min={5000} max={40000} step={1000} value={answers.annualKm} className="mt-3 block w-full"
            onChange={(e) => { const km = Number(e.target.value); setAnswers((p) => ({ ...p, annualKm: km, annualKmBand: km <= 10000 ? "low" : km >= 20000 ? "high" : "mid" })); }} />
        </label>
      </section>
      <section>
        <h3 className="text-[1.5rem]">{t.checklist}</h3>
        <ul className="mt-4 divide-y divide-seam border-y border-seam">
          {t.checklistItems.map((item) => (
            <li key={item}><label className="flex min-h-12 cursor-pointer items-center gap-3 px-1 text-[16px] font-semibold"><input type="checkbox" className="h-5 w-5" />{item}</label></li>
          ))}
        </ul>
        <p className="mt-3 text-[14px] text-tar">{t.checklistNote}</p>
      </section>
    </div>
  );
}

// ─── Legend (the proof) ──────────────────────────────────────────────────────
function Legend() {
  const { t } = useLang();
  const items: [Code, string, string][] = [["off", t.codeOfficial, t.legendOfficial], ["est", t.codeEstimate, t.legendEstimate], ["miss", t.codeMissing, t.legendMissing]];
  return (
    <section id="legend" className="scroll-mt-4 bg-asphalt text-paint">
      <div className="mx-auto max-w-[1320px] px-4 py-16 sm:px-8 lg:py-20">
        <h2 className="max-w-[18ch] text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.08]">{t.legendTitle}</h2>
        <p className="mt-4 max-w-[58ch] text-[17px] text-[#c9ccc6]">{t.legendSub}</p>
        <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
          {items.map(([code, label, text]) => (
            <div key={code}>
              <div aria-hidden className={`${code === "off" ? "bg-[#9aa0a8]" : `curb-${code}`} h-7 [--stripe:26px]`} />
              <h3 className="mt-4 text-[1.4rem]">{label}</h3>
              <p className="mt-1 text-[16px] leading-7 text-[#c9ccc6]">{text}</p>
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
      if (!res.ok) throw new Error(res.status === 503 ? "CFG" : res.status === 502 ? "PROVIDER" : res.status === 429 ? "RATE" : `HTTP_${res.status}`);
      setMessages((p) => [...p, { from: "ai", text: data.reply || t.chatEmpty, time: formatTime(lang) }]);
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      const reply = code === "CFG" ? t.chatNotConfigured : code === "PROVIDER" ? t.chatProvider : code === "RATE" ? t.chatRate : t.chatFail(code.startsWith("HTTP_") ? code.slice(5) : "");
      setMessages((p) => [...p, { from: "ai", text: reply, time: formatTime(lang) }]);
    } finally { setLoading(false); }
  }

  const all = [{ from: "ai" as const, text: t.chatHello, time: "" }, ...messages];
  return (
    <section id="advisor" className="mx-auto grid max-w-[1320px] scroll-mt-4 gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:py-24">
      <div>
        <h2 className="max-w-[14ch] text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.08]">{t.chatTitle}</h2>
        <p className="mt-4 max-w-[46ch] text-[17px] text-tar">{t.chatSub}</p>
      </div>
      <div className="flex flex-col border border-seam bg-slab">
        <div ref={listRef} className="flex max-h-[440px] min-h-[280px] flex-col gap-3 overflow-y-auto p-4 sm:p-6" aria-live="polite">
          {all.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[85%] whitespace-pre-wrap px-4 py-2.5 text-[16px] leading-7 ${m.from === "user" ? "bg-curb text-paint" : "border border-seam bg-paint"}`}>
                {m.text}
                {m.time && <div className={`mt-0.5 text-[12px] ${m.from === "user" ? "text-[#dfe7f5]" : "text-tar"}`}>{m.time}</div>}
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-end"><div className="border border-seam bg-paint px-4 py-2.5 text-[15px] text-tar">{t.chatTyping}</div></div>}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-seam px-4 pt-4 sm:px-6">
          {t.chatChips.map((c) => <button key={c} onClick={() => send(c)} disabled={loading} className="min-h-10 border border-seam bg-paint px-3 text-[14px] font-semibold hover:border-asphalt disabled:opacity-50">{c}</button>)}
        </div>
        <form className="flex gap-2 p-4 sm:p-6" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t.chatPlaceholder} disabled={loading} aria-label={t.chatPlaceholder}
            className="min-h-12 min-w-0 flex-1 border border-seam bg-paint px-4 text-[16px] outline-none placeholder:text-tar focus:border-curb disabled:opacity-60" />
          <button type="submit" disabled={loading || !question.trim()} aria-label={t.chatSend} className="flex min-h-12 items-center gap-2 bg-curb px-5 font-bold text-paint hover:bg-curb-deep disabled:opacity-50">
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
  // One source of truth: when the car has an overall monthly estimate, the rows add up to exactly that figure.
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
    <section aria-label={t.costTitle} className="swap mt-6 grid gap-8 border border-seam bg-slab p-5 sm:p-7 lg:grid-cols-2">
      <div>
        <h3 className="text-[1.5rem]">{t.costTitle}</h3>
        <p className="mt-1 text-[15px] text-tar">{shortName(car.make)} · {t.kmBasis(km)}</p>
        <div className="mt-5"><Plate value={total} label={loan ? t.withLoan : t.runningOnly} /></div>
        <ul className="mt-6 divide-y divide-seam border-y border-seam">
          {lines.map((r) => <li key={r.label} className="flex items-center justify-between gap-4 py-2.5 text-[16px]"><span className="flex items-center gap-2 text-tar"><span aria-hidden className={`curb-${r.code} block h-2 w-5 shrink-0 [--stripe:4px]`} />{r.label}</span><span className="num text-[20px]">{shekel(r.value, nf)}</span></li>)}
          <li className="flex items-center justify-between py-2.5 text-[16px] font-bold"><span>{t.runningTotal}</span><span className="num text-[22px]">{shekel(running, nf)}</span></li>
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
        {missing.length > 0 && <p className="mt-5 text-[13px] text-tar">{t.formulaNote}</p>}
        <p className="mt-2 text-[13px] text-tar">{t.calcNote}</p>
      </div>
    </section>
  );
}

function Slider({ label, aside, min, max, step, value, onChange }: { label: string; aside: string; min: number; max: number; step: number; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block">
      <span className="flex flex-wrap justify-between gap-2 text-[15px]"><span className="font-semibold">{label}</span><span className="text-tar">{aside}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 block w-full" />
    </label>
  );
}
