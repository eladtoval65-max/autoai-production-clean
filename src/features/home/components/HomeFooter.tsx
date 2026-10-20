import { Link } from "wouter";
import { useLang } from "../../../shared/i18n";
import { LEGAL_LINKS } from "../../legal/LegalPage";

/** Dark footer: brand line, policy links (methodology, privacy, terms, accessibility), photo credits. */
export function HomeFooter() {
  const { lang, t } = useLang();
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-4 py-12 text-[15px] sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="font-display text-2xl font-bold">
            {lang === "he" ? <>כמה <span className="text-[#5fd3a7]">עולה</span></> : <>Cama<span className="text-[#5fd3a7]">Ola</span></>}
          </div>
          <p className="mt-2 max-w-[48ch] text-[#c3cbd6]">{t.footerLine}</p>
        </div>
        <div className="max-w-[46ch] text-[#c3cbd6]">
          <nav aria-label="מידע ומדיניות" className="flex flex-wrap gap-x-4 gap-y-1">
            {LEGAL_LINKS.map((l) => <Link key={l.href} href={l.href} className="font-bold text-white underline">{l.href === "/privacy" ? t.footerPrivacy : l.label}</Link>)}
          </nav>
          <p className="mt-2 text-[14px]">{t.footerPhotos}</p>
        </div>
      </div>
    </footer>
  );
}
