import { Languages } from "lucide-react";
import { useLang } from "../../../shared/i18n";
import { BrandMark } from "../../../shared/ui/BrandMark";

/** Sticky top bar: logo, section links, link to the all-models browser, language switch. */
export function HomeHeader() {
  const { lang, t, setLang } = useLang();
  const link = "text-muted no-underline hover:text-ink";
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <BrandMark en={lang === "en"} href="#top" />
        <nav className="flex items-center gap-1 text-[15px] font-semibold sm:gap-6">
          <a href="/cars" className={link}>{lang === "he" ? "כל הדגמים" : "All models"}</a>
          <a href="#results" className={`hidden md:inline ${link}`}>{t.navResults}</a>
          <a href="#plate" className={`hidden md:inline ${link}`}>{t.navPlate}</a>
          <a href="#legend" className={`hidden lg:inline ${link}`}>{t.navHow}</a>
          <a href="#advisor" className={`hidden sm:inline ${link}`}>{t.navAdvisor}</a>
          <button onClick={() => setLang(lang === "he" ? "en" : "he")} lang={lang === "he" ? "en" : "he"}
            className="flex min-h-10 items-center gap-1.5 rounded-full border border-line px-3.5 text-[14px] font-bold hover:border-ink">
            <Languages className="h-4 w-4" aria-hidden />{t.langSwitch}
          </button>
        </nav>
      </div>
    </header>
  );
}
