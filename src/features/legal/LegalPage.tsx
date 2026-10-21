/**
 * Shared layout for the policy pages (privacy, terms, accessibility, about):
 * title, "last updated" line, readable column, and links to the sibling pages.
 */
import { useEffect, type ReactNode } from "react";
import { Link } from "wouter";
import { PENDING, SITE } from "../../shared/siteInfo";

export const LEGAL_LINKS = [
  { href: "/compare", label: "השוואות" },
  { href: "/leasing", label: "ליסינג או קנייה" },
  { href: "/sell", label: "מוכרים רכב?" },
  { href: "/about", label: "איך מחשבים" },
  { href: "/privacy", label: "פרטיות" },
  { href: "/terms", label: "תנאי שימוש" },
  { href: "/accessibility", label: "הצהרת נגישות" },
];

/** Section with a heading; children are paragraphs or lists. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-3"><h2 className="text-xl font-bold">{title}</h2>{children}</section>;
}

/** Operator block: name, id, contact. Unknown values say so instead of being guessed. */
export function OperatorDetails() {
  return (
    <ul className="list-disc space-y-1 ps-5">
      <li>מפעיל האתר: {SITE.operatorName ?? PENDING}</li>
      {SITE.operatorId && <li>מספר עוסק / ח״פ: {SITE.operatorId}</li>}
      <li>דוא״ל לפניות: {SITE.contactEmail ? <a className="underline" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> : PENDING}</li>
      {SITE.address && <li>כתובת: {SITE.address}</li>}
    </ul>
  );
}

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  useEffect(() => { document.title = `${title} | ${SITE.brand}`; window.scrollTo(0, 0); }, [title]);
  return (
    <main dir="rtl" className="min-h-screen bg-white px-4 py-10 text-ink sm:px-8">
      <article className="mx-auto max-w-[72ch] space-y-8 text-[16px] leading-7">
        <nav aria-label="עמודי מידע" className="flex flex-wrap gap-x-4 gap-y-2 text-[15px]">
          <Link href="/" className="font-bold text-go-deep">← {SITE.brand}</Link>
          {LEGAL_LINKS.map((l) => <Link key={l.href} href={l.href} className="text-muted underline">{l.label}</Link>)}
        </nav>
        <header>
          <h1 className="text-[2rem] font-bold leading-tight">{title}</h1>
          <p className="mt-2 text-[14px] text-muted">עודכן לאחרונה: {updated}</p>
        </header>
        {children}
      </article>
    </main>
  );
}
