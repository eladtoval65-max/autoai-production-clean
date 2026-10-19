/**
 * /go/:slug — owner-editable landing page. Content comes from the admin CRM (landing_pages table).
 * Leads go through the same consented form and are tagged with the landing slug + UTM source.
 */
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { Check, ShieldCheck } from "lucide-react";
import LeadRequestModal from "@/components/LeadRequestModal";
import { getUtm, sendEvent } from "./analytics";

type LeadType = "vehicle" | "financing" | "insurance" | "trade_in" | "used_car" | "test_drive";
type Page = { slug: string; title: string; subtitle: string | null; bullets: string[]; ctaText: string | null; leadType: LeadType };

export default function Landing() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getUtm();
    let live = true;
    fetch(`/api/landing?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live) setPage(d); })
      .catch(() => live && setPage(null));
    sendEvent("visit", `go:${slug}`);
    return () => { live = false; };
  }, [slug]);

  useEffect(() => { if (page?.title) document.title = `${page.title} | כמה עולה`; }, [page]);

  const openForm = () => { setOpen(true); sendEvent("lead_open", `go:${slug}`, false); };

  return (
    <div dir="rtl" className="min-h-screen bg-white text-ink">
      <header className="mx-auto flex max-w-[1080px] items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-ink no-underline">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-go font-display text-lg font-bold text-white">₪</span>
          <span className="font-display text-xl font-bold">כמה עולה</span>
        </Link>
      </header>

      {page === undefined && <main className="mx-auto max-w-[1080px] px-4 py-24 sm:px-8"><div className="h-12 w-2/3 animate-pulse rounded-xl bg-mist" /></main>}

      {page === null && (
        <main className="mx-auto max-w-[680px] px-4 py-24 text-center sm:px-8">
          <h1 className="text-3xl">הדף הזה לא זמין</h1>
          <p className="mt-3 text-[17px] text-muted">ייתכן שהקמפיין הסתיים. אפשר להשוות רכבים לפי עלות חודשית אמיתית בעמוד הראשי.</p>
          <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-go px-7 text-[17px] font-bold text-white no-underline hover:bg-go-deep">לעמוד הראשי</Link>
        </main>
      )}

      {page && (
        <main className="mx-auto grid max-w-[1080px] gap-10 px-4 pb-24 pt-8 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:pt-16">
          <section>
            <h1 className="max-w-[18ch] text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.05]">{page.title}</h1>
            {page.subtitle && <p className="mt-5 max-w-[52ch] text-[19px] leading-8 text-muted">{page.subtitle}</p>}
            {page.bullets.length > 0 && (
              <ul className="mt-8 space-y-3">
                {page.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[17px]">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-go-soft text-go-deep"><Check size={15} strokeWidth={3} /></span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={openForm} className="mt-10 inline-flex min-h-14 items-center rounded-full bg-go px-8 text-[18px] font-bold text-white hover:bg-go-deep lg:hidden">{page.ctaText || "רוצים שנחזור אליכם?"}</button>
          </section>
          <aside className="h-fit rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] sm:p-8 lg:sticky lg:top-8">
            <h2 className="text-2xl">ייעוץ אישי, בלי התחייבות</h2>
            <p className="mt-2 text-[16px] leading-7 text-muted">משאירים פרטים ונציג ״כמה עולה״ חוזר אליכם. הפרטים לא מועברים לשום עסק בלי הסכמה נפרדת שלכם.</p>
            <button onClick={openForm} className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-go px-6 text-[18px] font-bold text-white hover:bg-go-deep">{page.ctaText || "רוצים שנחזור אליכם?"}</button>
            <p className="mt-4 flex items-center gap-2 text-[14px] text-muted"><ShieldCheck size={16} className="text-go" /> הסכמה מתועדת, אפשר לבקש מחיקה בכל עת</p>
            <Link href="/" className="mt-6 block text-[15px] font-semibold text-go-deep">או: השוו רכבים לפי עלות חודשית ←</Link>
          </aside>
        </main>
      )}

      {open && page && (
        <LeadRequestModal vehicle={{ id: `landing-${page.slug}`, make: page.title, match: 0 }} sourcePage="landing" landingSlug={page.slug} defaultType={page.leadType} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
