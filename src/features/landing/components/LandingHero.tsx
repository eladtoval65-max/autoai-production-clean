import { Check } from "lucide-react";
import { DEFAULT_CTA, type LandingContent } from "../types";

/** Headline, subtitle and the owner's bullet points. On phones a CTA button sits right under them. */
export function LandingHero({ page, onCta }: { page: LandingContent; onCta: () => void }) {
  return (
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
      <button onClick={onCta} className="mt-10 inline-flex min-h-14 items-center rounded-full bg-go px-8 text-[18px] font-bold text-white hover:bg-go-deep lg:hidden">{page.ctaText || DEFAULT_CTA}</button>
    </section>
  );
}
