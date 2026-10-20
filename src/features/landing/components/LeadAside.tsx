import { ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { DEFAULT_CTA } from "../types";

/** Sticky side card: what happens when you leave details (consented, nothing passed on without separate consent) + CTA. */
export function LeadAside({ ctaText, onCta }: { ctaText: string | null; onCta: () => void }) {
  return (
    <aside className="h-fit rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-card)] sm:p-8 lg:sticky lg:top-8">
      <h2 className="text-2xl">ייעוץ אישי, בלי התחייבות</h2>
      <p className="mt-2 text-[16px] leading-7 text-muted">משאירים פרטים ונציג ״כמה עולה״ חוזר אליכם. הפרטים לא מועברים לשום עסק בלי הסכמה נפרדת שלכם.</p>
      <button onClick={onCta} className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-go px-6 text-[18px] font-bold text-white hover:bg-go-deep">{ctaText || DEFAULT_CTA}</button>
      <p className="mt-4 flex items-center gap-2 text-[14px] text-muted"><ShieldCheck size={16} className="text-go" /> הסכמה מתועדת, אפשר לבקש מחיקה בכל עת</p>
      <Link href="/" className="mt-6 block text-[15px] font-semibold text-go-deep">או: השוו רכבים לפי עלות חודשית ←</Link>
    </aside>
  );
}
