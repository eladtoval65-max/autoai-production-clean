import { Clock, Receipt, UserX } from "lucide-react";
import { useLang } from "../../../shared/i18n";
import type { Quiz } from "../hooks/useQuiz";
import type { Ranked } from "../types";
import { Finder } from "./Finder";
import { LeaderPanel } from "./LeaderPanel";

/** Icons for the three trust points under the headline (time, real monthly cost, no sign-up). */
const TRUST_ICONS = [Clock, Receipt, UserX];

/** Top section: headline, trust points, questionnaire, and the live top-match panel. */
export function Hero({ quiz, leader, onResults }: { quiz: Quiz; leader?: Ranked; onResults: () => void }) {
  const { t } = useLang();
  return (
    <section id="top" className="bg-mist">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 pb-14 pt-10 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:pb-20 lg:pt-14">
        <div>
          <h1 className="max-w-[15ch] text-[clamp(2.3rem,4.8vw,4rem)] leading-[1.06]">{t.heroTitle}</h1>
          <p className="mt-4 max-w-[54ch] text-[17px] leading-7 text-muted sm:text-lg">{t.heroSub}</p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-semibold">
            {t.trust.map((item, i) => { const I = TRUST_ICONS[i]; return <li key={item} className="flex items-center gap-1.5"><I className="h-4 w-4 text-go" aria-hidden />{item}</li>; })}
          </ul>
          <Finder quiz={quiz} onResults={onResults} />
        </div>
        {leader && <LeaderPanel car={leader} km={quiz.answers.annualKm} started={quiz.step > 0} />}
      </div>
    </section>
  );
}
