import { ArrowLeft, Clock, Receipt, UserX } from "lucide-react";
import { useState } from "react";
import { btnPrimary } from "../../../shared/styles";
import { useLang } from "../../../shared/i18n";
import { CarSearch } from "../../../shared/ui/CarSearch";
import type { Quiz } from "../hooks/useQuiz";
import type { Ranked } from "../types";
import { Finder } from "./Finder";
import { LeaderPanel } from "./LeaderPanel";
import { PosterScene } from "./PosterScene";
import { StoriesStrip } from "./stories/StoriesStrip";

/** Icons for the three trust points under the headline (time, real monthly cost, no sign-up). */
const TRUST_ICONS = [Clock, Receipt, UserX];

/** Splits "…באמת. כל חודש." so the last sentence gets the poster's yellow emphasis. */
function splitTitle(title: string): [string, string] {
  const i = title.lastIndexOf(". ");
  return i < 0 ? [title, ""] : [title.slice(0, i + 1), title.slice(i + 2)];
}

/** Top section: a dark "poster" band (headline + car search), then ONE start button for the questionnaire; the live top match appears once answering starts. */
export function Hero({ quiz, leader, onResults, onLead }: { quiz: Quiz; leader?: Ranked; onResults: () => void; onLead: () => void }) {
  const { t, lang } = useLang();
  const [lead, em] = splitTitle(t.heroTitle);
  const started = quiz.step > 0 || quiz.complete;
  // The questionnaire opens on one tap (or by itself once it has answers), so the first screen offers one clear choice.
  const [opened, setOpen] = useState(false);
  const open = opened || started;
  return (
    <section id="top">
      <div className="relative isolate bg-deep text-white">
        <PosterScene />
        <div className="relative mx-auto max-w-[1280px] px-4 pb-32 pt-5 sm:px-8 sm:pb-40 lg:pt-16">
          <StoriesStrip />
          <div className="mt-6" />
          <h1 className="max-w-[14ch] text-[clamp(2.6rem,6.4vw,5.2rem)] leading-[1] [text-shadow:0_4px_24px_rgba(0,0,0,.35)]">
            {lead}{em && <> <span className="text-sun">{em}</span></>}
          </h1>
          <p className="mt-5 max-w-[54ch] text-[17px] leading-7 text-white/85 sm:text-lg">{t.heroSub}</p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-semibold">
            {t.trust.map((item, i) => { const I = TRUST_ICONS[i]; return <li key={item} className="flex items-center gap-1.5"><I className="h-4 w-4 text-sun" aria-hidden />{item}</li>; })}
          </ul>
          <CarSearch className="relative z-20 mt-7 max-w-[34rem]" />
        </div>
      </div>
      <div className="bg-mist">
        {open ? (
          <div className={`mx-auto grid max-w-[1280px] gap-10 px-4 pb-14 pt-10 sm:px-8 lg:gap-12 lg:pb-20 ${started ? "lg:grid-cols-[1fr_1fr]" : "max-w-[760px]"}`}>
            <div><Finder quiz={quiz} onResults={onResults} /></div>
            {started && leader && <LeaderPanel car={leader} km={quiz.answers.annualKm} started onLead={onLead} />}
          </div>
        ) : (
          <div className="mx-auto max-w-[760px] px-4 py-10 sm:px-8">
            <div className="rounded-3xl border border-line bg-white p-6 text-center shadow-[var(--shadow-card)] sm:p-8">
              <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] leading-tight">{lang === "he" ? "לא יודעים איזה רכב?" : "Not sure which car?"}</h2>
              <p className="mt-2 text-[17px] text-muted">{lang === "he" ? "7 שאלות קצרות, 2 דקות, ונראה לכם מה הכי מתאים — ובכמה בחודש." : "7 short questions, 2 minutes — we'll show what fits and what it costs a month."}</p>
              <button onClick={() => setOpen(true)} className={`${btnPrimary} mt-5 min-h-14 px-8 text-[18px]`}>
                {lang === "he" ? "מתחילים" : "Start"}<ArrowLeft className="h-5 w-5 rtl:rotate-0 ltr:rotate-180" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
