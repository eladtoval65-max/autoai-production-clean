import { ArrowLeft, PhoneCall } from "lucide-react";
import { useLang } from "../../../shared/i18n";
import { shortName } from "../../../shared/format";
import { MonthlyTag } from "../../../shared/ui/MonthlyTag";
import { monthlyFor } from "../model/cost";
import type { Ranked } from "../types";

/**
 * The one "get an offer for this car" action, shared by the live panel, the top result and the sticky bar,
 * so the wording stays identical everywhere. It only opens the consented lead form — nothing is sent without it.
 */
const COPY = {
  he: { title: (car: string) => `רוצים הצעה על ה־${car}?`, sub: "ביטוח, מימון או מחיר — אנחנו חוזרים אליכם. בחינם, בלי התחייבות.", btn: "כן, תחזרו אליי עם הצעה", short: "קבלו הצעה", now: "הכי מתאים לך כרגע" },
  en: { title: (car: string) => `Want an offer on the ${car}?`, sub: "Insurance, financing or price — we'll get back to you. Free, no commitment.", btn: "Yes, get back to me", short: "Get an offer", now: "Best match right now" },
};

/** Big block: title, one reassuring line, full-width orange button. */
export function OfferCta({ car, onLead, className = "" }: { car: Ranked; onLead: () => void; className?: string }) {
  const { lang } = useLang();
  const c = COPY[lang === "he" ? "he" : "en"];
  return (
    <div className={`rounded-2xl bg-[#fff4ea] p-4 ring-1 ring-pop/30 ${className}`}>
      <p className="text-[18px] font-extrabold leading-snug">{c.title(shortName(car.make))}</p>
      <p className="mt-1 text-[14px] leading-6 text-muted">{c.sub}</p>
      <button onClick={onLead} className="mt-3 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-pop px-6 py-3 text-[17px] font-extrabold text-ink shadow-[0_8px_20px_-8px_rgba(255,122,26,.7)] transition-transform hover:bg-pop-deep active:scale-[.98]">
        <PhoneCall className="h-5 w-5" aria-hidden />{c.btn}
      </button>
    </div>
  );
}

/** Sticky bottom bar once the visitor has started answering: current best car, its monthly cost and the offer button — visible after every answer. */
export function OfferBar({ car, km, onLead }: { car: Ranked; km: number; onLead: () => void }) {
  const { lang, dir } = useLang();
  const c = COPY[lang === "he" ? "he" : "en"];
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 py-2.5 shadow-[0_-8px_24px_-12px_rgba(6,43,34,.35)] backdrop-blur [padding-bottom:max(.625rem,env(safe-area-inset-bottom))]" dir={dir}>
      <div className="mx-auto flex max-w-[1280px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <span className="block text-[12px] font-bold text-muted">{c.now}</span>
          <span className="flex items-center gap-2"><span className="truncate text-[15px] font-extrabold">{shortName(car.make)}</span><MonthlyTag value={monthlyFor(car, km)} size="sm" /></span>
        </div>
        <button onClick={onLead} className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-full bg-pop px-5 text-[16px] font-extrabold text-ink hover:bg-pop-deep active:scale-[.98]">
          {c.short}<ArrowLeft className="h-4 w-4 ltr:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
