/** /compare — every "A מול B" comparison, grouped by the first car. */
import { useEffect } from "react";
import { Link } from "wouter";
import { PageShell } from "../../shared/ui/PageShell";
import { comparePairs, hebrewName } from "./model/pairs";

export default function CompareIndexPage() {
  useEffect(() => { document.title = "השוואות רכבים לפי עלות חודשית | כמה עולה"; }, []);
  const pairs = comparePairs();
  return (
    <PageShell>
      <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] leading-tight">השוואות רכבים לפי עלות חודשית</h1>
      <p className="mt-3 max-w-[60ch] text-[17px] text-muted">רכבים באותו טווח מחיר, זה מול זה: דלק, ביטוח (הערכה), טיפולים, ירידת ערך ורישוי.</p>
      <ul className="mt-8 grid gap-2 sm:grid-cols-2">
        {pairs.map((p) => <li key={p.slug}><Link href={`/compare/${p.slug}`} className="flex min-h-12 items-center rounded-xl border border-line bg-white px-4 text-[15px] no-underline hover:border-go">{hebrewName(p.a)} מול {hebrewName(p.b)}</Link></li>)}
      </ul>
    </PageShell>
  );
}
