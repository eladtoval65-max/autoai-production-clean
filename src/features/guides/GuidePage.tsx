/** /guides and /guides/:slug — practical buyer guides built on the site's sourced data. */
import { useFacts } from "../../data/useFacts";
import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { PageShell } from "../../shared/ui/PageShell";
import { GUIDE_BODIES } from "./components/GuideBodies";
import { GUIDES, guideBySlug } from "./model/meta";

const SUFFIX = " | כמה עולה";

export function GuidesIndexPage() {
  useEffect(() => { document.title = "מדריכים לקונה רכב" + SUFFIX; }, []);
  return (
    <PageShell>
      <h1 className="text-[clamp(1.8rem,3.5vw,2.6rem)] leading-tight">מדריכים לקונה רכב</h1>
      <p className="mt-2 max-w-[60ch] text-[17px] text-muted">מבוססים על הנתונים באתר — מחירים, צריכה אמיתית ובעיות מתועדות עם מקור.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <li key={g.slug}><Link href={`/guides/${g.slug}`} className="block h-full rounded-2xl bg-white p-5 text-ink no-underline hover:shadow-[var(--shadow-float)]">
            <span className="font-display text-[1.15rem] font-bold">{g.short}</span>
            <span className="mt-1 block text-[15px] text-muted">{g.description}</span>
          </Link></li>
        ))}
      </ul>
    </PageShell>
  );
}

export function GuidePage() {
  useFacts(); // data-driven tables need every make's facts
  const { slug = "" } = useParams<{ slug: string }>();
  const meta = guideBySlug(slug);
  const Body = meta ? GUIDE_BODIES[meta.slug] : null;
  useEffect(() => { if (meta) document.title = meta.title + SUFFIX; }, [meta]);
  if (!meta || !Body) return <PageShell><h1 className="text-2xl">המדריך לא נמצא</h1><Link href="/guides">לכל המדריכים</Link></PageShell>;
  return (
    <PageShell>
      <nav aria-label="פירורי לחם" className="mb-4 text-[14px] text-muted"><Link href="/guides" className="text-muted">מדריכים</Link></nav>
      <h1 className="text-[clamp(1.7rem,3.3vw,2.4rem)] leading-tight">{meta.title}</h1>
      <Body />
      <aside className="mt-10 rounded-2xl bg-ink p-6 text-white">
        <h2 className="text-[1.25rem]">כמה יעלה לכם הרכב שבחרתם?</h2>
        <p className="mt-1 text-[15px] text-[#c3cbd6]">שש שאלות, ונדרג חדשים ויד שנייה לפי עלות חודשית אמיתית.</p>
        <Link href="/" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-go px-6 font-bold text-white no-underline">לשאלון</Link>
      </aside>
      <p className="mt-6 text-[14px]"><Link href="/guides">← לכל המדריכים</Link></p>
    </PageShell>
  );
}
