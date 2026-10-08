// CarAI Finder style reminder: Hebrew-first neo-industrial editorial; route/A motif, Signal Blue actions, transparent trade-offs, product-system density.
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import LeadRequestModal from "@/components/LeadRequestModal";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowUpLeft, BarChart3, Bookmark, Check, ChevronLeft, CircleHelp, Copy, ExternalLink, Fuel, Gauge, Heart, ListChecks, MessageCircle, RotateCcw, Search, Share2, ShieldCheck, Sparkles, WalletCards, X } from "lucide-react";

const heroImage = "/assets/hero.jpg";
const markImage = "/assets/mark.png";

type Car = { id: string; make: string; years: string; price: number; score: number; use: string; image: string; fuel: string; reliability: number; safety: number; economy: number; comfort: number; fun: number; why: string; pros: string[]; cons: string[]; bodyType?: string; insuranceMin?: number; insuranceMax?: number; ownershipMonthly?: number; marketRange?: string; dataNote?: string; dataStatus?: string; dataConfidence?: number; sourceName?: string; sourceUrl?: string; lastVerifiedAt?: string };
type Answers = { budget: number; use: string; priority: string; fuel: string; family: string; annualKm: number };

const steps = [
  { id: "budget", label: "תקציב", icon: WalletCards },
  { id: "use", label: "שימוש", icon: Gauge },
  { id: "priority", label: "מה חשוב", icon: ShieldCheck },
  { id: "fuel", label: "הנעה", icon: Fuel },
];

const fallbackCars: Car[] = [
  { id: "corolla-hybrid", make: "Toyota Corolla 2022", years: "2022 · Hybrid · 1.8L", price: 100000, score: 95, use: "city", image: "/assets/vehicle-corolla-hybrid.jpg", fuel: "היברידי", reliability: 98, safety: 92, economy: 96, comfort: 86, fun: 76, why: "השילוב הכי רגוע בין חסכון, אמינות ושוק יד־שנייה חזק.", pros: ["חסכון משמעותי בעיר", "אמינות גבוהה", "קל למכור בהמשך"], cons: ["מחיר רכישה גבוה יותר", "עיצוב שמרני"] },
  { id: "tucson", make: "Hyundai Tucson 2022", years: "2022 · Petrol · 1.6T", price: 128000, score: 91, use: "family", image: "/assets/vehicle-tucson.jpg", fuel: "בנזין", reliability: 90, safety: 91, economy: 76, comfort: 93, fun: 74, why: "בחירה מאוזנת למשפחה שרוצה מרחב, זמינות ושקט תפעולי.", pros: ["מרחב פנים מצוין", "שירות נפוץ בישראל", "בטיחות טובה"], cons: ["צריכת דלק בינונית", "פחות זריז בעיר"] },
  { id: "mazda3", make: "Mazda 3 2022", years: "2022 · Petrol · 2.0L", price: 95000, score: 89, use: "fun", image: "/assets/vehicle-mazda3.jpg", fuel: "בנזין", reliability: 89, safety: 91, economy: 78, comfort: 85, fun: 94, why: "למי שרוצה שהרכב ירגיש טוב גם אחרי שהגעת ליעד.", pros: ["עיצוב מוקפד", "נהיגה מהנה", "תא נוסעים איכותי"], cons: ["תא מטען קטן יחסית", "מושב אחורי צפוף"] },
  { id: "corolla", make: "Toyota Corolla 2022", years: "2022 · Petrol · 1.8L", price: 92000, score: 93, use: "highway", image: "/assets/vehicle-corolla.jpg", fuel: "בנזין", reliability: 97, safety: 90, economy: 86, comfort: 84, fun: 70, why: "בחירה בטוחה למי שמעדיף פחות דרמה ויותר עקביות לאורך זמן.", pros: ["אמינות מיתולוגית", "עלות אחזקה צפויה", "ערך יד־שנייה"], cons: ["פחות מרווחת מ־SUV", "אופי סולידי"] },
  { id: "rav4", make: "Toyota RAV4 2022", years: "2022 · Hybrid · AWD", price: 185000, score: 94, use: "family", image: "/assets/vehicle-rav4.jpg", fuel: "היברידי", reliability: 97, safety: 96, economy: 91, comfort: 94, fun: 78, why: "SUV משפחתי עם שילוב חזק של בטיחות, מרחב וחסכון.", pros: ["מרחב למשפחה", "בטיחות גבוהה", "היברידי חסכוני"], cons: ["מחיר גבוה", "ביקוש גבוה ביד־שנייה"] },
  { id: "niro", make: "Kia Niro 2022", years: "2022 · Hybrid · HEV", price: 108000, score: 88, use: "city", image: "/assets/vehicle-niro.jpg", fuel: "היברידי", reliability: 90, safety: 86, economy: 92, comfort: 84, fun: 68, why: "קרוסאובר חסכוני וקומפקטי עם עלות שימוש הגיונית.", pros: ["חסכוני בעיר", "שימושי למשפחה", "שקט בנסיעה"], cons: ["ביצועים בינוניים תחת עומס", "חבילת בטיחות תלויה בגרסה"] },
  { id: "ioniq5", make: "Hyundai Ioniq 5 2022", years: "2022 · Electric · RWD", price: 122000, score: 87, use: "highway", image: "/assets/vehicle-ioniq5.jpg", fuel: "חשמלי", reliability: 91, safety: 95, economy: 88, comfort: 95, fun: 90, why: "חשמלית מרווחת עם טעינה מהירה וחווית שימוש עתידנית.", pros: ["טעינה מהירה", "מרווח מעולה", "שקט ועלויות שוטפות נמוכות"] , cons: ["טווח משתנה בתנאים אמיתיים", "צריך גישה לטעינה"] },
 ];

const vehicleEconomics: Record<string, { insuranceMin: number; insuranceMax: number; ownershipMonthly: number; marketRange: string; dataNote: string }> = {
  "corolla-hybrid": { insuranceMin: 450, insuranceMax: 900, ownershipMonthly: 2750, marketRange: "₪85K–₪115K", dataNote: "Estimate · verified model sources" },
  tucson: { insuranceMin: 350, insuranceMax: 550, ownershipMonthly: 1600, marketRange: "₪105K–₪135K", dataNote: "Estimate · Israeli market indicators" },
  mazda3: { insuranceMin: 240, insuranceMax: 400, ownershipMonthly: 1200, marketRange: "₪85K–₪110K", dataNote: "Estimate · Israeli market indicators" },
  corolla: { insuranceMin: 450, insuranceMax: 900, ownershipMonthly: 2300, marketRange: "₪88K–₪110K", dataNote: "Estimate · verify trim" },
  rav4: { insuranceMin: 500, insuranceMax: 900, ownershipMonthly: 2400, marketRange: "₪175K–₪200K", dataNote: "Estimate · limited asking-price sample" },
  niro: { insuranceMin: 300, insuranceMax: 500, ownershipMonthly: 1850, marketRange: "₪95K–₪120K", dataNote: "Estimate · HEV only" },
  ioniq5: { insuranceMin: 450, insuranceMax: 750, ownershipMonthly: 1300, marketRange: "₪109K–₪134K", dataNote: "Estimate · home charging assumed" },
};

const useChoices = [
  ["city", "עיר ויום־יום", "חניה קלה, חסכון וזריזות", "⌂"],
  ["family", "משפחה וטיולים", "מרחב, בטיחות ונוחות", "＋"],
  ["highway", "הרבה כביש", "שקט, יציבות ותא מטען", "↗"],
  ["fun", "הנאה מנהיגה", "אופי, ביצועים ותחושה", "✦"],
];
const priorityChoices = [["reliable", "אמינות ושקט נפשי", "פחות הפתעות במוסך", "✓"], ["economy", "חסכון בדלק", "עלות שוטפת נמוכה", "₪"], ["safety", "בטיחות", "מערכות ומבנה מגנים", "⊙"], ["comfort", "נוחות ואבזור", "נעים בכל נסיעה", "⌁"]];
const fuelChoices = [["any", "פתוח להכול", "תנו לי את ההתאמה הכי טובה", "◌"], ["hybrid", "היברידי", "חסכון חכם במיוחד בעיר", "⚡"], ["petrol", "בנזין", "פשוט, מוכר וזמין", "◒"], ["electric", "חשמלי", "נסיעה שקטה ועלויות דלק שונות", "↯"]];
const budgetChoices = [[60000, "עד ₪60,000", "יד־שנייה חכמה ונגישה", "01"], [100000, "₪60,000–100,000", "הטווח הכי גמיש", "02"], [180000, "מעל ₪100,000", "יותר מרחב וטכנולוגיה", "03"]];
const formatTime = () => new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
const track = (event: string) => { const events = JSON.parse(localStorage.getItem("carai-events") || "[]"); events.push({ event, at: new Date().toISOString() }); localStorage.setItem("carai-events", JSON.stringify(events.slice(-100))); };

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const catalogQuery = trpc.catalog.list.useQuery({ limit: 100 });

  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"quick" | "advanced">("advanced");
  const [history, setHistory] = useState<string[]>(() => JSON.parse(localStorage.getItem("carai-history") || "[]"));
  const [answers, setAnswers] = useState<Answers>({ budget: 100000, use: "", priority: "", fuel: "", family: "", annualKm: 15000 });
  const [tab, setTab] = useState<"finder" | "results" | "saved" | "compare" | "detail" | "analysis" | "tools">("finder");
  const [saved, setSaved] = useState<string[]>(() => JSON.parse(localStorage.getItem("carai-saved") || "[]"));
  const [compare, setCompare] = useState<string[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [showLead, setShowLead] = useState(false);
  const [showCost, setShowCost] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ from: "ai" | "user"; text: string; time: string }[]>([{ from: "ai", text: "אני אשאל 4 שאלות קצרות, ואז אחבר לך כיוון רכב שמרגיש נכון — כולל הסבר על הפשרות.", time: formatTime() }]);
  const [chatLoading, setChatLoading] = useState(false);

  const cars = useMemo(() => {
    const imageByName: Record<string, string> = {
      "Toyota Corolla Hybrid": "/assets/vehicle-corolla-hybrid.jpg",
      "Hyundai Tucson": "/assets/vehicle-tucson.jpg",
      "Mazda Mazda 3": "/assets/vehicle-mazda3.jpg",
      "Toyota Corolla": "/assets/vehicle-corolla.jpg",
      "Toyota RAV4 Hybrid": "/assets/vehicle-rav4.jpg",
      "Kia Niro Hybrid": "/assets/vehicle-niro.jpg",
      "Hyundai Ioniq 5": "/assets/vehicle-ioniq5.jpg",
    };
    const useByName: Record<string, string> = {
      "Toyota Corolla Hybrid": "city",
      "Hyundai Tucson": "family",
      "Mazda Mazda 3": "fun",
      "Toyota Corolla": "highway",
      "Toyota RAV4 Hybrid": "family",
      "Kia Niro Hybrid": "city",
      "Hyundai Ioniq 5": "highway",
    };
    const fuelLabel: Record<string, string> = { Hybrid: "היברידי", Petrol: "בנזין", Electric: "חשמלי", Diesel: "דיזל" };
    const rows = catalogQuery.data ?? [];
    if (!rows.length) return fallbackCars.map(car => ({ ...car, dataNote: "נתוני הדגמה בלבד — הקטלוג החי אינו זמין כרגע; אין להסתמך על המחיר או הדירוג לקבלת החלטת קנייה." }));
    return rows.map((row): Car => {
      const name = `${row.make} ${row.model}`;
      const normalizedName = name.toLowerCase();
      const image = Object.entries(imageByName).find(([key]) => normalizedName === key.toLowerCase())?.[1]
        ?? (normalizedName.includes("corolla") ? "/assets/vehicle-corolla.jpg" : heroImage);
      const price = row.marketSnapshotMedian ?? row.marketMinPrice ?? 0;
      const marketRange = row.marketSnapshotMin && row.marketSnapshotMax
        ? `₪${row.marketSnapshotMin.toLocaleString()}–₪${row.marketSnapshotMax.toLocaleString()}`
        : `₪${price.toLocaleString()}`;
      const registryNote = row.officialRegisteredCount !== null && row.officialRegisteredCount !== undefined
        ? `מקור רשמי: ${row.officialRegisteredCount.toLocaleString()} כלי רכב מדגם ${row.officialRegistryCommercialName}, שנת ${row.yearFrom}`
        : "אין עדיין ספירת רישום רשמית לדגם הזה";
      const marketDate = row.marketSnapshotObservedAt ? new Date(row.marketSnapshotObservedAt).toLocaleDateString("he-IL") : "לא ידוע";
      const qualityLabel = row.dataStatus === "verified" ? "מאומת" : row.dataStatus === "stale" ? "דורש רענון" : row.dataStatus === "missing" ? "חסר מידע" : "אומדן מסומן";
      const sourceNote = row.primarySourceName ? `מקור ראשי: ${row.primarySourceName}` : "מקור ראשי טרם שויך";
      const confidenceNote = typeof row.dataConfidence === "number" ? `רמת ביטחון: ${row.dataConfidence}/100` : "רמת ביטחון לא הוגדרה";
      const officialNote = `${registryNote}. מחיר: אומדן השוואתי, נצפה ב־${marketDate}; ${row.marketSnapshotDisclaimer ?? "לא הצעת מחיר חיה"} ${sourceNote}. ${confidenceNote}. סטטוס: ${qualityLabel}.`;
      return {
        id: String(row.id),
        make: `${name} · ${row.trimName}`,
        years: `${row.yearFrom}${row.yearTo !== row.yearFrom ? `–${row.yearTo}` : ""} · ${row.fuelType} · ${row.bodyType}`,
        price,
        score: Math.round((row.reliabilityScore + row.safetyScore + row.economyScore + row.comfortScore + row.practicalityScore) / 5),
        use: useByName[name] ?? (row.bodyType.toLowerCase().includes("suv") ? "family" : "city"),
        image,
        fuel: fuelLabel[row.fuelType] ?? row.fuelType,
        reliability: row.reliabilityScore,
        safety: row.safetyScore,
        economy: row.economyScore,
        comfort: row.comfortScore,
        fun: row.practicalityScore,
        why: row.ownershipNotes ?? "המלצה המבוססת על נתוני הדגם והעדפות השימוש שלך.",
        pros: row.pros ?? [],
        cons: row.cons ?? [],
        bodyType: row.bodyType,
        insuranceMin: row.insuranceMonthlyMin ?? undefined,
        insuranceMax: row.insuranceMonthlyMax ?? undefined,
        ownershipMonthly: row.ownershipCostMonthly ?? row.estimatedMonthlyCost ?? undefined,
        marketRange,
        dataNote: officialNote,
        dataStatus: row.dataStatus ?? "estimated",
        dataConfidence: row.dataConfidence ?? 0,
        sourceName: row.primarySourceName ?? undefined,
        sourceUrl: row.primarySourceUrl ?? undefined,
        lastVerifiedAt: row.lastVerifiedAt ? new Date(row.lastVerifiedAt).toLocaleDateString("he-IL") : undefined,
      };
    });
  }, [catalogQuery.data]);

  useEffect(() => { localStorage.setItem("carai-saved", JSON.stringify(saved)); }, [saved]);
  const complete = Boolean(answers.use && answers.priority && answers.fuel);
  const currentKey = steps[step]?.id;
  const ranked = useMemo(() => {
    const useBoost = (car: Car) => answers.use ? (car.use === answers.use ? 16 : 0) : 0;
    const priorityBoost = (car: Car) => answers.priority === "reliable" ? car.reliability * .08 : answers.priority === "economy" ? car.economy * .08 : answers.priority === "safety" ? car.safety * .08 : answers.priority === "comfort" ? car.comfort * .08 : 0;
    return [...cars].map((car) => ({ ...car, ...(vehicleEconomics[car.id] ?? {}), match: Math.min(99, Math.round(car.score + useBoost(car) + priorityBoost(car) - (car.price > answers.budget ? 5 : 0))) })).sort((a, b) => b.match - a.match);
  }, [answers, cars]);
  const result = ranked[0];
  useEffect(() => { if (complete) { const next = [result.id, ...history.filter((id) => id !== result.id)].slice(0, 8); setHistory(next); localStorage.setItem("carai-history", JSON.stringify(next)); track("quiz_completed"); } }, [complete, result.id]);
  const compareCars = cars.filter((car) => compare.includes(car.id));
  const monthly = Math.round((result.price * .08 / 12) + (answers.annualKm / 12 * (result.fuel === "היברידי" ? .42 : 0.62)) + 500);

  function choose(value: string | number) {
    track(`answer_${currentKey}`);
    const key = currentKey as keyof Answers;
    if (mode === "quick" && currentKey === "use") {
      setAnswers((prev) => ({ ...prev, [key]: value, priority: prev.priority || "reliable" }));
      setTimeout(() => setStep(3), 160);
      return;
    }
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setTimeout(() => setStep((prev) => Math.min(prev + 1, 4)), 160);
  }
  function toggleSaved(id: string) { track(saved.includes(id) ? "saved_removed" : "saved_added"); setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]); toast(saved.includes(id) ? "הוסר מהרשימה השמורה" : "נשמר לרשימת הרכבים שלך"); }
  function toggleCompare(id: string) { track(compare.includes(id) ? "compare_removed" : "compare_added"); setCompare((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : (toast("אפשר להשוות עד 3 רכבים"), prev)); }
  async function shareResult() { const text = `ההתאמה שלי ב־CarAI: ${result.make} — ${result.match}%`; if (navigator.share) await navigator.share({ title: "ההתאמה שלי ב־CarAI", text }); else { await navigator.clipboard.writeText(text); toast("הקישור הועתק — אפשר לשתף עם המשפחה"); } }
  async function sendQuestion(text = question) {
    const trimmed = text.trim();
    if (!trimmed || chatLoading) return;
    const next = [...messages, { from: "user" as const, text: trimmed, time: formatTime() }];
    setMessages(next);
    setQuestion("");
    setChatLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "אתה AutoAI, יועץ רכב ישראלי אמין. ענה בעברית פשוטה, הסבר יתרונות וחסרונות, אל תמציא נתונים, ושאל שאלת המשך כשחסר מידע.",
          messages: next.map((message) => ({ role: message.from === "user" ? "user" : "assistant", content: message.text })),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 503) throw new Error("AI_NOT_CONFIGURED");
        if (response.status === 502) throw new Error("AI_PROVIDER_ERROR");
        throw new Error(data?.error || "Chat request failed");
      }
      setMessages((prev) => [...prev, { from: "ai", text: data.reply || "לא הצלחתי לענות כרגע. נסה שוב.", time: formatTime() }]);
    } catch (error) {
      console.error("[Chat] request failed", error);
      const code = error instanceof Error ? error.message : "";
      const text = code === "AI_NOT_CONFIGURED"
        ? "הצ׳אט עדיין לא מוגדר ב־Vercel. יש להוסיף את ANTHROPIC_API_KEY בסביבת Production ולבצע Redeploy."
        : code === "AI_PROVIDER_ERROR"
          ? "מפתח ה־AI קיים, אבל Anthropic דחה את הבקשה. בדוק שהמפתח פעיל ושיש הרשאת שימוש במודל, ואז בצע Redeploy."
          : "הצ׳אט לא הצליח להתחבר כרגע. נסה שוב בעוד רגע.";
      setMessages((prev) => [...prev, { from: "ai", text, time: formatTime() }]);
    } finally {
      setChatLoading(false);
    }
  }
  function reset() { track("quiz_reset"); setStep(0); setAnswers({ budget: 100000, use: "", priority: "", fuel: "", family: "", annualKm: 15000 }); setTab("finder"); }

  return <main dir="rtl" className="min-h-screen bg-[#07090c] text-[#f4f6f8]">
    <nav className="mx-auto flex max-w-[1400px] items-center justify-between border-b border-[#252a31] px-5 py-5 lg:px-10"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#d9e8ff]"><img src={markImage} alt="" className="h-5 w-5 object-contain" /></div><div><div className="text-[16px] font-black tracking-[-.04em]">CarAI</div><div className="text-[9px] font-bold tracking-[.16em] text-[#7d8793]">FIND YOUR FIT</div></div></div><div className="hidden items-center gap-8 text-[12px] font-semibold text-[#9ca5b0] md:flex"><a href="#finder" className="hover:text-white">Recommendations</a><a href="#tools" className="hover:text-white">Market</a><a href="#chat" className="hover:text-white">AI Advisor</a></div><button onClick={() => { setTab("finder"); document.getElementById("finder")?.scrollIntoView({ behavior: "smooth" }); }} className="border border-[#39414b] bg-transparent px-4 py-2 text-xs font-bold text-white transition hover:border-[#9dd2ff] hover:text-[#9dd2ff]">Start your journey <ArrowLeft className="mr-1 inline h-3.5 w-3.5" /></button></nav>

    <section dir="ltr" className="mx-auto max-w-[1400px] px-5 py-8 lg:px-10 lg:py-12"><div className="grid min-h-[560px] border border-[#2a3038] bg-[#101216] lg:grid-cols-[.92fr_1.08fr]"><div className="flex flex-col justify-between border-b border-[#2a3038] p-7 lg:border-b-0 lg:border-r lg:p-14"><div><div className="mb-12 flex items-center gap-3 text-[10px] font-bold tracking-[.18em] text-[#a7b3c1]"><span className="h-px w-8 bg-[#4d9df7]" />SMART BUYING SYSTEM / 01</div><h1 className="max-w-[570px] text-[clamp(3rem,6vw,6.5rem)] font-semibold leading-[.94] tracking-[-.075em] text-[#f5f6f7]">The smarter<br /><span className="text-[#79b9ff]">way to buy</span><br />a car.</h1><p className="mt-8 max-w-[430px] text-[15px] leading-7 text-[#aeb7c2]">Tell us what matters in your next car. We compare the trade-offs, running costs and real-world fit — before you speak to a seller.</p></div><div className="mt-12 flex items-end justify-between border-t border-[#2a3038] pt-5"><button onClick={() => document.getElementById("finder")?.scrollIntoView({ behavior: "smooth" })} className="bg-[#79b9ff] px-5 py-3 text-sm font-bold text-[#0b0e12] transition hover:bg-white">Start your journey <ArrowLeft className="mr-1 inline h-4 w-4" /></button><div className="text-right text-[10px] uppercase tracking-[.15em] text-[#6f7985]">4 questions<br /><span className="text-[#c8d1dc]">one clear direction</span></div></div></div><div className="relative min-h-[380px] overflow-hidden bg-[#171b20]"><img src={heroImage} alt="רכב כחול על כביש עירוני" className="absolute inset-0 h-full w-full object-cover opacity-80" /><div className="absolute inset-0 bg-gradient-to-r from-[#101216]/35 via-transparent to-transparent" /><div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/15 bg-[#101216]/75 px-6 py-4 text-xs backdrop-blur-sm"><span className="text-[#b6c0cc]">Decision model</span><strong className="text-[#f5f6f7]">Budget · use · safety · cost</strong></div></div></div></section>

    <section className="mx-auto grid max-w-[1400px] grid-cols-2 border-y border-[#252a31] sm:grid-cols-3 lg:grid-cols-5">{[['01','Recommendations','PERSONAL FIT'],['02','Market data','PRICE CONTEXT'],['03','Ownership cost','MONTHLY VIEW'],['04','Expert notes','TRADE-OFFS'],['05','Trusted leads','NEXT STEP']].map(([num,label,meta]) => <div key={num} className="border-l border-[#252a31] px-4 py-5 first:border-l-0 lg:px-6"><div className="mb-3 text-[10px] font-bold tracking-[.16em] text-[#79b9ff]">{num}</div><p className="text-sm font-bold text-[#dce1e7]">{label}</p><p className="mt-1 text-[9px] tracking-[.14em] text-[#68727e]">{meta}</p></div>)}</section>

    <section id="finder" className="scroll-mt-5 border-y border-[#26303a] bg-[#11151b]"><div className="mx-auto grid max-w-[1400px] lg:grid-cols-[250px_1fr]"><aside className="hidden border-l border-[#202832] bg-[#0d1117] p-7 lg:block"><div className="sticky top-6"><p className="text-[10px] font-black tracking-[.16em] text-[#7c8897]">מסלול ההתאמה</p><h3 className="mt-2 text-xl font-black">הבחירה שלך</h3><div className="mt-10 space-y-7">{steps.map((s, i) => <div className="flex items-center gap-3" key={s.id}><div className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-black ${i < step ? "border-[#4aa3ff] bg-[#4aa3ff] text-white" : i === step ? "border-[#4aa3ff] bg-[#11151b] text-[#4aa3ff]" : "border-[#2b3642] bg-[#11151b] text-[#657281]"}`}>{i < step ? <Check className="h-4 w-4" /> : `0${i + 1}`}</div><span className={`text-sm font-bold ${i === step ? "text-[#f4f6f8]" : "text-[#7c8897]"}`}>{s.label}</span></div>)}</div><div className="mt-16 rounded-2xl bg-[#11151b] p-5 text-white"><Sparkles className="h-5 w-5 text-[#9dd2ff]" /><p className="mt-4 text-sm font-bold leading-6">המערכת מראה גם מה כדאי לדעת — לא רק מה נשמע טוב.</p></div></div></aside>
      <div className="min-h-[650px] p-5 sm:p-8 lg:p-12"><div className="mb-10 border-b border-[#2a3038] pb-6"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="text-[10px] font-bold tracking-[.18em] text-[#79b9ff]">YOUR PERSONALIZED RECOMMENDATIONS</p><h2 className="mt-3 max-w-[620px] text-3xl font-semibold tracking-[-.055em] text-[#f5f6f7]">{tab === "finder" ? "Tell us what you need." : tab === "results" ? "Your personalized recommendations." : tab === "saved" ? "Saved vehicles." : tab === "compare" ? "Compare with clarity." : tab === "detail" ? "Vehicle details." : tab === "analysis" ? "Analysis, not opinions." : "Decision tools before you buy."}</h2></div><div className="flex items-center gap-3 text-[11px] font-bold"><span className="text-[#6f7985]">MODE</span><button onClick={() => { setMode("quick"); track("mode_quick"); }} className={`border-b-2 px-2 py-1 ${mode === "quick" ? "border-[#79b9ff] text-[#79b9ff]" : "border-transparent text-[#7d8793]"}`}>Quick</button><button onClick={() => { setMode("advanced"); track("mode_advanced"); }} className={`border-b-2 px-2 py-1 ${mode === "advanced" ? "border-[#79b9ff] text-[#79b9ff]" : "border-transparent text-[#7d8793]"}`}>Advanced</button></div></div><div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">{[["finder", "התאמה", Search], ["results", "תוצאות", BarChart3], ["saved", `שמורים (${saved.length})`, Bookmark], ["compare", `השוואה (${compare.length})`, Copy], ["detail", "Vehicle", Gauge], ["analysis", "Analysis", Gauge], ["tools", "Tools", ListChecks]].map(([id, label, Icon]) => <button key={id as string} onClick={() => setTab(id as typeof tab)} className={`flex items-center gap-2 border-b-2 pb-2 text-xs font-bold transition ${tab === id ? "border-[#79b9ff] text-[#79b9ff]" : "border-transparent text-[#77818e] hover:text-white"}`}><Icon className="h-3.5 w-3.5" />{label as string}</button>)}</div></div>
        {tab === "finder" && <Finder step={step} setStep={setStep} answers={answers} choose={choose} reset={reset} complete={complete} mode={mode} onResults={() => { track("results_viewed"); setTab("results"); }} />}
        {tab === "results" && <Results ranked={ranked} saved={saved} compare={compare} toggleSaved={toggleSaved} toggleCompare={toggleCompare} onLead={() => setShowLead(true)} onCost={() => setShowCost(true)} onDetails={(id) => { setSelectedVehicleId(id); setTab("detail"); }} onShare={shareResult} />}
        {tab === "saved" && <Saved cars={cars.filter((car) => saved.includes(car.id))} history={cars.filter((car) => history.includes(car.id))} toggleSaved={toggleSaved} toggleCompare={toggleCompare} />}
        {tab === "compare" && <Compare cars={compareCars} toggleCompare={toggleCompare} onLead={() => setShowLead(true)} />}
        {tab === "detail" && <VehicleDetails car={ranked.find((item) => item.id === selectedVehicleId) ?? result} onBack={() => setTab("results")} onLead={() => setShowLead(true)} />}
        {tab === "analysis" && <Analysis result={result} monthly={monthly} />}
        {tab === "tools" && <Tools result={result} monthly={monthly} answers={answers} setAnswers={setAnswers} />}
      </div></div></section>

    <section id="chat" className="mx-auto max-w-[1400px] px-5 py-16 lg:px-10 lg:py-24"><div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center"><div><p className="text-xs font-black tracking-[.14em] text-[#4aa3ff]">ההתאמה הכנה</p><h2 className="mt-4 text-4xl font-black leading-tight tracking-[-.05em] lg:text-5xl">המלצה טובה ממשיכה לעבוד גם אחרי התוצאה.</h2><p className="mt-6 max-w-[510px] text-base leading-8 text-[#aeb8c4]">השוו, שמרו, חשבו עלות, שאלו שאלות ובדקו את הרכב לפני שאתם משאירים פרטים. CarAI בנוי סביב החלטה — לא סביב קליק אחד.</p><div className="mt-8 grid max-w-[520px] gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-[#11151b] p-5 shadow-[0_8px_25px_rgba(0,0,0,.05)]"><ShieldCheck className="h-5 w-5 text-[#4aa3ff]" /><h3 className="mt-4 font-black">פחות רעש</h3><p className="mt-2 text-sm leading-6 text-[#8f9aa8]">מסננים דגמים שלא מתאימים ומרכזים את מה שבאמת רלוונטי.</p></div><div className="rounded-2xl bg-[#11151b] p-5 shadow-[0_8px_25px_rgba(0,0,0,.05)]"><MessageCircle className="h-5 w-5 text-[#4aa3ff]" /><h3 className="mt-4 font-black">יותר הקשר</h3><p className="mt-2 text-sm leading-6 text-[#8f9aa8]">אפשר לשאול בשפה שלך, גם אם אין לך מושג מה זה גיר רציף.</p></div></div></div><div className="rounded-3xl border border-[#26303a] bg-[#11151b] p-5 shadow-[0_18px_50px_rgba(0,0,0,.07)] lg:p-7"><div className="flex items-center justify-between border-b border-[#1e2731] pb-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#13243a] text-[#4aa3ff]"><MessageCircle className="h-5 w-5" /></div><div><h3 className="font-black">שאלו את CarAI</h3><p className="mt-0.5 text-xs text-[#8f9aa8]">יועץ אישי · זמין עכשיו</p></div></div><span className="flex items-center gap-1.5 text-[11px] font-bold text-[#2a9b69]"><span className="h-2 w-2 rounded-full bg-[#2a9b69]" /> מחובר</span></div><div className="mt-5 flex min-h-[235px] flex-col gap-3">{messages.map((m, i) => <div key={`${m.time}-${i}`} className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${m.from === "user" ? "rounded-tl-sm bg-[#4aa3ff] text-white" : "rounded-tr-sm border border-[#202832] bg-[#0d1117] text-[#d6dde6]"}`}>{m.text}<div className={`mt-1 text-[10px] ${m.from === "user" ? "text-white/60" : "text-[#6f7b8a]"}`}>{m.time}</div></div></div>)}{chatLoading && <div className="flex justify-end"><div className="rounded-2xl rounded-tr-sm border border-[#202832] bg-[#0d1117] px-4 py-3 text-sm text-[#8f9aa8]">היועץ מקליד…</div></div>}</div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => sendQuestion("מה חשוב לבדוק ביד2?")} className="rounded-full border border-[#26303a] px-3 py-2 text-xs font-bold text-[#aeb8c4]">מה לבדוק ביד2?</button><button onClick={() => sendQuestion("מה הבעיות הנפוצות בדגם הזה?")} className="rounded-full border border-[#26303a] px-3 py-2 text-xs font-bold text-[#aeb8c4]">Common Issues</button><button onClick={() => sendQuestion("האם כדאי לממן את הרכב?")} className="rounded-full border border-[#26303a] px-3 py-2 text-xs font-bold text-[#aeb8c4]">Ask about financing</button><button onClick={() => sendQuestion("האם היברידי מתאים לי?")} className="rounded-full border border-[#26303a] px-3 py-2 text-xs font-bold text-[#aeb8c4]">היברידי מתאים לי?</button></div><div className="mt-4 flex gap-2"><input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendQuestion()} placeholder="כתבו שאלה כמו בוואטסאפ..." disabled={chatLoading} className="min-w-0 flex-1 rounded-xl border border-[#26303a] bg-[#0d1117] px-4 py-3 text-sm outline-none focus:border-[#4aa3ff] disabled:opacity-60" /><button onClick={() => sendQuestion()} disabled={chatLoading} aria-label="שליחת שאלה" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#11151b] text-white disabled:cursor-wait disabled:opacity-60"><ArrowLeft className="h-4 w-4" /></button></div></div></div></section>

    {showLead && <LeadRequestModal vehicle={tab === "detail" ? (ranked.find(item => item.id === selectedVehicleId) ?? result) : result} budget={answers.budget} sourcePage={tab === "detail" ? "vehicle_details" : tab === "compare" ? "comparison" : "recommendations"} onClose={() => setShowLead(false)} />}
    {showCost && <CostModal result={result} answers={answers} onClose={() => setShowCost(false)} />}
    <footer className="border-t border-[#26303a] bg-[#11151b]"><div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-8 text-sm text-[#8f9aa8] lg:px-10"><div className="flex items-center gap-2 font-black text-[#f4f6f8]"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4aa3ff]"><img src={markImage} alt="" className="h-5 w-5" /></div>CarAI</div><span>כלי החלטה חכמים למציאת רכב שמתאים לחיים שלך.</span><span>מנוע החלטה עצמאי · מידע שקוף</span></div></footer>
  </main>;
}

function Finder({ step, setStep, answers, choose, reset, complete, mode, onResults }: { step: number; setStep: (n: number) => void; answers: Answers; choose: (v: string | number) => void; reset: () => void; complete: boolean; mode: "quick" | "advanced"; onResults: () => void }) {
  const data = step === 0 ? budgetChoices : step === 1 ? useChoices : step === 2 ? priorityChoices : fuelChoices;
  const total = mode === "quick" ? 3 : 4;
  const title = step === 0 ? "מה התקציב שנוח לך?" : step === 1 ? "איפה הרכב יבלה את רוב הזמן?" : step === 2 ? "מה הכי חשוב לך ברכב?" : "לאיזה סוג הנעה את/ה פתוח/ה?";
  const value = step === 0 ? answers.budget : step === 1 ? answers.use : step === 2 ? answers.priority : answers.fuel;
  return <div className="mx-auto max-w-[760px]"><div className="mb-6 flex items-center gap-2 lg:hidden">{steps.slice(0, total).map((s, i) => <span key={s.id} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[#4aa3ff]" : "bg-[#202832]"}`} />)}</div><div className="mb-8 flex items-center justify-between"><div><p className="text-xs font-black tracking-[.14em] text-[#4aa3ff]">שלב {Math.min(step + 1, total)} מתוך {total}</p><h2 className="mt-2 text-3xl font-black tracking-[-.05em]">{step === 4 ? "מוכנים לתוצאה" : title}</h2></div><div className="flex items-center gap-2">{step > 0 && step < 4 && <button onClick={() => setStep(step - 1)} aria-label="חזרה לשלב הקודם" className="rounded-full border border-[#26303a] px-3 py-2 text-xs font-black text-[#8f9aa8]">חזרה</button>}<button onClick={reset} aria-label="התחל מחדש" className="rounded-full border border-[#26303a] p-2.5 text-[#8f9aa8]"><RotateCcw className="h-4 w-4" /></button></div></div>{step < 4 && <><p className="mb-8 text-[#8f9aa8]">{step === 0 ? "טווח כללי מספיק — לא צריך מספר מדויק." : mode === "quick" ? "מצב מהיר — נשאל רק את מה שחיוני כדי לתת כיוון ראשון." : "אין תשובה נכונה. אנחנו כאן כדי להבין את סדר העדיפויות שלך."}</p><div className="grid gap-3 sm:grid-cols-2">{data.map((item: (string | number)[]) => <button key={String(item[0])} onClick={() => { if (mode === "quick" && step === 1) { choose(item[0]); } else choose(item[0]); }} className={`group flex items-center gap-4 rounded-2xl border p-4 text-right transition hover:-translate-y-0.5 hover:border-[#4aa3ff] hover:shadow-[0_12px_30px_rgba(74,163,255,.12)] ${String(value) === String(item[0]) ? "border-[#4aa3ff] bg-[#13243a]" : "border-[#202832] bg-[#11151b]"}`}><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#151b23] text-sm font-black text-[#4aa3ff]">{item[3]}</span><span><strong className="block text-[15px] font-black">{item[1]}</strong><small className="mt-1 block text-xs text-[#8f9aa8]">{item[2]}</small></span><ChevronLeft className="mr-auto h-4 w-4 text-[#657281]" /></button>)}</div><div className="mt-10 flex items-center gap-2 text-xs text-[#7c8897]"><CircleHelp className="h-4 w-4" /> אפשר לשנות את הבחירה בכל שלב</div></>}{step === 4 && <button onClick={onResults} disabled={!complete} className="rounded-xl bg-[#4aa3ff] px-6 py-3.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">הציגו לי את ההתאמות <ArrowLeft className="mr-1 inline h-4 w-4" /></button>}</div>;
}

function Results({ ranked, saved, compare, toggleSaved, toggleCompare, onLead, onCost, onDetails, onShare }: { ranked: (Car & { match: number })[]; saved: string[]; compare: string[]; toggleSaved: (id: string) => void; toggleCompare: (id: string) => void; onLead: () => void; onCost: () => void; onDetails: (id: string) => void; onShare: () => void }) { const [fuelFilter, setFuelFilter] = useState("all"); const [sort, setSort] = useState("match"); const [faq, setFaq] = useState<string | null>(null); const visible = [...ranked].filter((car) => fuelFilter === "all" || car.fuel === fuelFilter).sort((a, b) => sort === "price" ? a.price - b.price : sort === "economy" ? b.economy - a.economy : b.match - a.match); return <div><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-[#8f9aa8]">הדירוג משלב תקציב, שימוש, עדיפות ועלות שוטפת.</p><div className="flex flex-wrap gap-2"><select value={fuelFilter} onChange={(e) => setFuelFilter(e.target.value)} className="rounded-full border border-[#26303a] bg-[#11151b] px-3 py-2 text-xs font-black text-[#aeb8c4]"><option value="all">כל סוגי ההנעה</option><option value="היברידי">היברידי</option><option value="בנזין">בנזין</option></select><select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-[#26303a] bg-[#11151b] px-3 py-2 text-xs font-black text-[#aeb8c4]"><option value="match">מיון לפי התאמה</option><option value="price">מיון לפי מחיר</option><option value="economy">מיון לפי חסכון</option></select><button onClick={onShare} className="flex items-center gap-2 rounded-full border border-[#26303a] px-3 py-2 text-xs font-black text-[#aeb8c4]"><Share2 className="h-4 w-4" /> שתפו תוצאה</button></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{visible.slice(0, 4).map((car, index) => <article key={car.id} className="overflow-hidden rounded-3xl border border-[#202832] bg-[#11151b] shadow-[0_8px_25px_rgba(0,0,0,.05)]"><div className="relative h-44 bg-[#0d1117]"><img src={car.image} alt={car.make} className="h-full w-full object-cover" /><span className="absolute right-4 top-4 rounded-full bg-[#11151b] px-3 py-1.5 text-xs font-black text-white">#{index + 1} · {car.match}%</span><button onClick={() => toggleSaved(car.id)} className="absolute left-4 top-4 rounded-full bg-[#11151b]/90 p-2 text-[#4aa3ff]"><Heart className={`h-4 w-4 ${saved.includes(car.id) ? "fill-current" : ""}`} /></button></div><div className="p-5"><h3 className="text-xl font-black">{car.make}</h3><p className="mt-1 text-sm text-[#8f9aa8]">{car.years} · {car.fuel}</p><div className="mt-4 grid grid-cols-2 gap-2"><div><span className="block text-[10px] uppercase tracking-wider text-[#657281]">Market Price</span><b className="text-sm">{car.marketRange ?? `₪${car.price.toLocaleString()}`}</b></div><div><span className="block text-[10px] uppercase tracking-wider text-[#657281]">Monthly Cost</span><b className="text-sm text-[#4aa3ff]">₪{(car.ownershipMonthly ?? 0).toLocaleString()}</b></div></div><p className="mt-2 text-[10px] text-[#657281]">Insurance estimate: ₪{car.insuranceMin ?? 0}–₪{car.insuranceMax ?? 0} / month</p><p className="mt-2 text-[10px] leading-4 text-[#5f7185]">{car.dataNote}</p><p className="mt-4 text-sm leading-6 text-[#aeb8c4]">{car.why}</p><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><Metric label="אמינות" value={car.reliability} /><Metric label="בטיחות" value={car.safety} /></div><div className="mt-5 flex gap-2"><button onClick={() => toggleCompare(car.id)} className={`flex-1 rounded-xl border py-2.5 text-xs font-black ${compare.includes(car.id) ? "border-[#4aa3ff] bg-[#13243a] text-[#4aa3ff]" : "border-[#26303a] text-[#aeb8c4]"}`}><BarChart3 className="mr-1 inline h-3.5 w-3.5" /> {compare.includes(car.id) ? "בהשוואה" : "השוואה"}</button><button onClick={() => onDetails(car.id)} className="flex-1 rounded-xl bg-[#4aa3ff] py-2.5 text-xs font-black text-white">View Details <ArrowUpLeft className="mr-1 inline h-3.5 w-3.5" /></button></div><button onClick={onCost} className="mt-2 w-full rounded-xl bg-[#151b23] py-2.5 text-xs font-black text-[#aeb8c4]">חשבו עלות חודשית משוערת</button><div className="mt-4 border-t border-[#1e2731] pt-3"><button onClick={() => setFaq(faq === car.id ? null : car.id)} className="flex w-full items-center justify-between text-xs font-black text-[#aeb8c4]">שאלות נפוצות על {car.make}<ChevronLeft className={`h-4 w-4 transition ${faq === car.id ? "-rotate-90" : ""}`} /></button>{faq === car.id && <div className="mt-3 space-y-2 text-xs leading-5 text-[#8f9aa8]"><p><b>למי זה מתאים?</b> למי שהפרופיל שלו דומה לשימוש ולסדר העדיפויות שנבחרו.</p><p><b>מה לבדוק?</b> היסטוריה, מצב מכני, התאמת מחיר וקיום מסמכים לפני השארת פרטים.</p></div>}</div></div></article>)}</div>{visible.length > 0 && <div className="mt-6 border border-[#35404c] bg-[#10161d] p-5 sm:flex sm:items-center sm:justify-between"><p className="text-sm text-[#b8c2ce]">רוצים עזרה בצעד הבא? השאירו בקשה לשיחה עם AutoAI לגבי ההתאמה המובילה.</p><button onClick={onLead} className="mt-4 bg-[#79b9ff] px-5 py-3 text-sm font-bold text-[#0b0e12] sm:mt-0">השאירו בקשת קשר</button></div>}{visible.length === 0 && <EmptyState text="אין כרגע תוצאה עם הפילטר שנבחר. נסו להרחיב את החיפוש." />}</div> }
function Metric({ label, value }: { label: string; value: number }) { return <div className="rounded-xl bg-[#151b23] p-3"><span className="block text-[#7c8897]">{label}</span><b className="mt-1 block text-[#4aa3ff]">{value}/100</b></div> }
function Saved({ cars, history, toggleSaved, toggleCompare }: { cars: Car[]; history: Car[]; toggleSaved: (id: string) => void; toggleCompare: (id: string) => void }) { return <div>{cars.length ? <div><p className="mb-4 text-xs font-black tracking-[.14em] text-[#4aa3ff]">רשימה שמורה</p><div className="grid gap-4 md:grid-cols-2">{cars.map((car) => <div key={car.id} className="flex gap-4 rounded-2xl border border-[#202832] bg-[#11151b] p-4"><img src={car.image} alt="" className="h-24 w-28 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><h3 className="font-black">{car.make}</h3><button onClick={() => toggleSaved(car.id)} className="text-[#4aa3ff]"><Heart className="h-4 w-4 fill-current" /></button></div><p className="mt-1 text-xs text-[#8f9aa8]">{car.years} · ₪{car.price.toLocaleString()}</p><button onClick={() => toggleCompare(car.id)} className="mt-4 text-xs font-black text-[#4aa3ff]">הוסיפו להשוואה <ArrowLeft className="mr-1 inline h-3 w-3" /></button></div></div>)}</div></div> : <EmptyState text="עדיין לא שמרת רכבים. שמרו אפשרויות מתוך מסך התוצאות." />}<div className="mt-8"><p className="mb-4 text-xs font-black tracking-[.14em] text-[#4aa3ff]">היסטוריית חיפוש אחרונה</p>{history.length ? <div className="flex flex-wrap gap-2">{history.map((car) => <span key={car.id} className="rounded-full bg-[#151b23] px-3 py-2 text-xs font-bold text-[#aeb8c4]">{car.make}</span>)}</div> : <p className="text-sm text-[#8f9aa8]">כאן יופיעו התאמות שבדקת לאחר השלמת שאלון.</p>}</div></div>; }
function LegacySaved({ cars, toggleSaved, toggleCompare }: { cars: Car[]; toggleSaved: (id: string) => void; toggleCompare: (id: string) => void }) { return cars.length ? <div className="grid gap-4 md:grid-cols-2">{cars.map((car) => <div key={car.id} className="flex gap-4 rounded-2xl border border-[#202832] bg-[#11151b] p-4"><img src={car.image} alt="" className="h-24 w-28 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><h3 className="font-black">{car.make}</h3><button onClick={() => toggleSaved(car.id)} className="text-[#4aa3ff]"><Heart className="h-4 w-4 fill-current" /></button></div><p className="mt-1 text-xs text-[#8f9aa8]">{car.years} · ₪{car.price.toLocaleString()}</p><button onClick={() => toggleCompare(car.id)} className="mt-4 text-xs font-black text-[#4aa3ff]">הוסיפו להשוואה <ArrowLeft className="mr-1 inline h-3 w-3" /></button></div></div>)}</div> : <EmptyState text="עדיין לא שמרת רכבים. שמרו אפשרויות מתוך מסך התוצאות." /> }
function Compare({ cars, toggleCompare, onLead }: { cars: Car[]; toggleCompare: (id: string) => void; onLead: () => void }) { return cars.length >= 2 ? <div className="overflow-x-auto rounded-2xl border border-[#202832] bg-[#11151b]"><table className="w-full min-w-[680px] text-right text-sm"><thead><tr className="border-b border-[#1e2731]">{["מדד", ...cars.map((car) => car.make)].map((x, i) => <th key={x} className="p-4 font-black">{i ? <><button onClick={() => toggleCompare(cars[i - 1].id)} className="float-left text-[#7c8897]"><X className="h-4 w-4" /></button>{x}</> : x}</th>)}</tr></thead><tbody>{[["התאמה", ...cars.map((c) => `${c.score}%`)], ["מחיר", ...cars.map((c) => `₪${c.price.toLocaleString()}`)], ["אמינות", ...cars.map((c) => `${c.reliability}/100`)], ["בטיחות", ...cars.map((c) => `${c.safety}/100`)], ["חסכון", ...cars.map((c) => `${c.economy}/100`)], ["הנעה", ...cars.map((c) => c.fuel)]].map((row) => <tr key={row[0]} className="border-b border-[#202832] last:border-0">{row.map((cell, i) => <td key={String(cell)} className={`p-4 ${i === 0 ? "font-bold text-[#8f9aa8]" : "font-black text-[#f4f6f8]"}`}>{cell}</td>)}</tr>)}</tbody></table><div className="p-4"><button onClick={onLead} className="rounded-xl bg-[#4aa3ff] px-5 py-3 text-xs font-black text-white">חפשו את הבחירה המובילה <ExternalLink className="mr-1 inline h-3.5 w-3.5" /></button></div></div> : <EmptyState text="בחרו לפחות שני רכבים כדי לפתוח השוואה אמיתית." /> }
function EmptyState({ text }: { text: string }) { return <div className="rounded-3xl border border-dashed border-[#26303a] bg-[#0d1117] p-12 text-center text-sm text-[#8f9aa8]"><BarChart3 className="mx-auto h-8 w-8 text-[#657281]" /><p className="mt-4">{text}</p></div> }
function VehicleDetails({ car, onBack, onLead }: { car: Car & { match: number }; onBack: () => void; onLead: () => void }) {
  const score = car.match;
  return <div dir="ltr" className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
    <div className="overflow-hidden rounded-3xl border border-[#202832] bg-[#11151b]"><div className="relative h-[280px]"><img src={car.image} alt={car.make} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" /><button onClick={onBack} className="absolute left-5 top-5 rounded-full border border-white/20 bg-[#0d1117]/60 px-3 py-2 text-xs text-white">← Back to recommendations</button><div className="absolute bottom-5 left-6"><p className="text-xs font-bold tracking-[.16em] text-[#9dd2ff]">{car.fuel} · {car.years}</p><h3 className="mt-2 text-3xl font-black text-white">{car.make}</h3></div></div><div className="grid grid-cols-3 border-t border-[#202832] text-center"><div className="p-5"><b className="block text-3xl text-[#4aa3ff]">{score}</b><span className="text-[10px] text-[#8f9aa8]">SMART BUY SCORE</span></div><div className="border-x border-[#202832] p-5"><b className="block text-lg">{car.marketRange}</b><span className="text-[10px] text-[#8f9aa8]">MARKET PRICE</span></div><div className="p-5"><b className="block text-lg">₪{(car.ownershipMonthly ?? 0).toLocaleString()}</b><span className="text-[10px] text-[#8f9aa8]">MONTHLY COST</span></div></div></div>
    <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-3xl border border-[#202832] bg-[#11151b] p-6"><p className="text-xs font-bold tracking-[.16em] text-[#7c8897]">OVERVIEW</p><p className="mt-4 text-sm leading-7 text-[#d6dde6]">{car.why}</p><div className="mt-6 space-y-3 text-sm"><div className="flex justify-between"><span className="text-[#8f9aa8]">Reliability</span><b>{car.reliability}/100</b></div><div className="flex justify-between"><span className="text-[#8f9aa8]">Safety</span><b>{car.safety}/100</b></div><div className="flex justify-between"><span className="text-[#8f9aa8]">Fuel economy</span><b>{car.economy}/100</b></div></div></div><div className="rounded-3xl border border-[#202832] bg-[#11151b] p-6"><p className="text-xs font-bold tracking-[.16em] text-[#7c8897]">COSTS</p><p className="mt-4 text-3xl font-black text-[#4aa3ff]">₪{car.insuranceMin ?? 0}–₪{car.insuranceMax ?? 0}</p><p className="mt-1 text-xs text-[#8f9aa8]">Indicative monthly insurance</p><p className="mt-6 text-xs leading-5 text-[#657281]">Estimate for an experienced driver with clean history. Obtain a live quote before purchase.</p><button onClick={onLead} className="mt-6 w-full rounded-xl bg-[#4aa3ff] py-3 text-xs font-black text-white">Continue to listings</button></div></div>
  </div>;
}

function Analysis({ result, monthly }: { result: Car & { match: number }; monthly: number }) {
  const metrics = [["Reliability", result.reliability], ["Value for Money", Math.round((result.economy + result.comfort) / 2)], ["Fuel Economy", result.economy], ["Safety", result.safety], ["Performance", result.fun]];
  return <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
    <div className="rounded-3xl border border-[#202832] bg-[#11151b] p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold tracking-[.14em] text-[#7c8897]">OVERALL SCORE</p><h3 className="mt-2 text-5xl font-black text-[#4aa3ff]">{(result.match / 10).toFixed(1)}<span className="text-lg text-[#657281]"> /10</span></h3></div><div className="flex h-32 w-32 items-center justify-center rounded-full border-[12px] border-[#202832] border-t-[#4aa3ff] border-r-[#4aa3ff] text-2xl font-black">{result.match}</div></div><div className="mt-8 space-y-4">{metrics.map(([label, value]) => <div key={label as string}><div className="mb-1 flex justify-between text-xs"><span className="text-[#aeb8c4]">{label}</span><b>{value as number}.0</b></div><div className="h-1.5 rounded-full bg-[#202832]"><div className="h-full rounded-full bg-[#4aa3ff]" style={{ width: `${value as number}%` }} /></div></div>)}</div></div>
    <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-3xl border border-[#202832] bg-[#11151b] p-6"><p className="text-xs font-bold tracking-[.14em] text-[#7c8897]">KEY INSIGHTS</p><div className="mt-5 space-y-4 text-sm leading-6 text-[#d6dde6]"><p>✓ {result.why}</p><p>✓ Value is strongest when ownership cost matters.</p><p>✓ Compare service history before making an offer.</p></div></div><div className="rounded-3xl border border-[#202832] bg-[#11151b] p-6"><p className="text-xs font-bold tracking-[.14em] text-[#7c8897]">3 YEAR COST</p><div className="mt-4 text-4xl font-black">₪{(monthly * 36).toLocaleString()}</div><p className="mt-2 text-xs text-[#8f9aa8]">Estimated total ownership cost</p><div className="mt-8 h-16 rounded-xl bg-gradient-to-r from-[#13243a] via-[#1d4c7a] to-[#4aa3ff] opacity-80" /></div></div>
  </div>;
}

function Tools({ result, monthly, answers, setAnswers }: { result: Car & { match: number }; monthly: number; answers: Answers; setAnswers: React.Dispatch<React.SetStateAction<Answers>> }) { return <div id="tools" className="grid gap-4 lg:grid-cols-2"><div className="rounded-3xl bg-[#11151b] p-6 text-white"><div className="flex items-center gap-3"><WalletCards className="h-5 w-5 text-[#9dd2ff]" /><h3 className="text-xl font-black">עלות חודשית משוערת</h3></div><p className="mt-3 text-sm leading-6 text-[#aeb8c4]">לא רק מחיר הרכב: כאן רואים תמונת שימוש בסיסית. שנו את הקילומטרים כדי להבין את ההשפעה.</p><div className="mt-7 text-5xl font-black text-[#9dd2ff]">₪{monthly.toLocaleString()}<span className="text-base text-[#aeb8c4]"> / חודש</span></div><label className="mt-7 block text-xs font-bold text-[#aeb8c4]">קילומטרים בשנה: {answers.annualKm.toLocaleString()}</label><input type="range" min="5000" max="40000" step="1000" value={answers.annualKm} onChange={(e) => setAnswers((prev) => ({ ...prev, annualKm: Number(e.target.value) }))} className="mt-3 w-full accent-[#9dd2ff]" /><div className="mt-6 grid grid-cols-2 gap-2 text-xs"><div className="rounded-xl bg-[#11151b]/10 p-3"><span className="block text-[#c5d0dc]">הרכב שנבחר</span><b className="mt-1 block">{result.make}</b></div><div className="rounded-xl bg-[#11151b]/10 p-3"><span className="block text-[#c5d0dc]">הנעה</span><b className="mt-1 block">{result.fuel}</b></div></div></div><div className="rounded-3xl border border-[#202832] bg-[#11151b] p-6"><div className="flex items-center gap-3"><ListChecks className="h-5 w-5 text-[#4aa3ff]" /><h3 className="text-xl font-black">Checklist לפני יד־שנייה</h3></div><p className="mt-3 text-sm leading-6 text-[#8f9aa8]">ארבעה דברים שלא כדאי להשאיר לרגע האחרון.</p><div className="mt-6 space-y-3">{["היסטוריית טיפולים ותאונות", "בדיקה במכון בלתי תלוי", "התאמת מחיר לקילומטראז׳ וליד", "בדיקת שעבודים ומסמכים"].map((item) => <label key={item} className="flex items-center gap-3 rounded-xl bg-[#151b23] p-3 text-sm font-bold"><input type="checkbox" className="h-4 w-4 accent-[#4aa3ff]" />{item}</label>)}</div><div className="mt-6 rounded-xl bg-[#13243a] p-4 text-xs leading-5 text-[#9dd2ff]">ה־checklist הוא כלי עזר כללי ולא תחליף לבדיקה מקצועית או לייעוץ משפטי.</div></div></div> }
function CostModal({ result, answers, onClose }: { result: Car & { match: number }; answers: Answers; onClose: () => void }) { const monthly = Math.round(result.price * .08 / 12 + answers.annualKm / 12 * (result.fuel === "היברידי" ? .42 : .62) + 500); return <Modal onClose={onClose}><h2 className="text-2xl font-black">עלות חודשית משוערת</h2><p className="mt-2 text-sm text-[#8f9aa8]">{result.make} · {answers.annualKm.toLocaleString()} ק״מ בשנה</p><div className="my-7 rounded-2xl bg-[#11151b] p-6 text-center text-white"><div className="text-4xl font-black text-[#9dd2ff]">₪{monthly.toLocaleString()}</div><div className="mt-1 text-xs text-[#aeb8c4]">הערכה חודשית בסיסית</div></div><div className="space-y-3 text-sm"><div className="flex justify-between"><span>מימון/ירידת ערך</span><b>₪{Math.round(result.price * .08 / 12).toLocaleString()}</b></div><div className="flex justify-between"><span>דלק/חשמל</span><b>₪{Math.round(answers.annualKm / 12 * (result.fuel === "היברידי" ? .42 : .62)).toLocaleString()}</b></div><div className="flex justify-between"><span>ביטוח וטיפולים</span><b>₪500</b></div></div><p className="mt-6 rounded-xl bg-[#fff5dc] p-3 text-xs leading-5 text-[#906b1c]">המספר הוא כלי השוואתי בדמו, לא הצעת מחיר ולא התחייבות.</p></Modal> }
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) { return <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#11151b]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"><div className="relative max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-t-3xl bg-[#11151b] p-6 shadow-2xl sm:rounded-3xl"><button onClick={onClose} aria-label="סגירה" className="absolute left-5 top-5 rounded-full bg-[#f3f5f8] p-2 text-[#8f9aa8]"><X className="h-4 w-4" /></button>{children}</div></div> }
