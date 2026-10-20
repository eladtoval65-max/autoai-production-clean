import { ChevronLeft, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { PRICES_VERIFIED, type Make, type ModelLine } from "../../../data/generations";
import { BrandMark } from "../../../shared/ui/BrandMark";

/** "2026-10-19" → "19.10.2026". */
const dateHe = (iso: string) => iso.split("-").reverse().join(".");

/** Page frame for the browser: header, breadcrumbs, content, and the sources/disclaimer note. */
export function BrowseShell({ make, model, children }: { make?: Make; model?: ModelLine; children: ReactNode }) {
  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-mist text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <BrandMark href="/" />
          <Link href="/" className="text-[15px] font-semibold text-muted no-underline hover:text-ink">המלצה לפי עלות חודשית</Link>
        </div>
      </header>
      <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-8 sm:py-12">
        <nav aria-label="פירורי לחם" className="mb-6 flex flex-wrap items-center gap-1 text-[14px] text-muted">
          <Link href="/cars" className="text-muted no-underline hover:text-ink">כל היצרנים</Link>
          {make && <><ChevronLeft className="h-4 w-4" aria-hidden /><Link href={`/cars/${make.id}`} className="text-muted no-underline hover:text-ink">{make.he}</Link></>}
          {model && <><ChevronLeft className="h-4 w-4" aria-hidden /><span className="text-ink">{model.he}</span></>}
        </nav>
        {children}
        <p className="mt-12 flex items-start gap-2 text-[13px] text-muted">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-go" aria-hidden />
          מחירי מחירון חדש: מחירוני היבואנים כפי שמופיעים ב-carzone.co.il (נבדק לאחרונה: {dateHe(PRICES_VERIFIED)}). דירוגי Euro NCAP מוצגים רק כשהם ידועים בוודאות.
          צריכה ועלויות הן הערכה. "מה לבדוק" הוא הכוונה לבדיקה לפני קנייה, לא אבחנה של רכב מסוים. מחירי יד שנייה אינם מוצגים כי אין להם מקור רשמי חופשי.
        </p>
      </main>
    </div>
  );
}
