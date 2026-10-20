import { useLang } from "../../../shared/i18n";
import { card } from "../../../shared/styles";
import { CodeChip, type Provenance } from "../../../shared/ui/CodeChip";

/** "Every number says where it comes from": explains the official / estimate / missing badges. */
export function Legend() {
  const { t } = useLang();
  const items: [Provenance, string, string][] = [["off", t.codeOfficial, t.legendOfficial], ["est", t.codeEstimate, t.legendEstimate], ["miss", t.codeMissing, t.legendMissing]];
  return (
    <section id="legend" className="scroll-mt-20 bg-mist">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-8 lg:py-20">
        <h2 className="max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.1]">{t.legendTitle}</h2>
        <p className="mt-3 max-w-[58ch] text-[17px] text-muted">{t.legendSub}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map(([code, label, text]) => (
            <div key={code} className={`${card} p-6`}>
              <div className="flex items-center gap-3"><CodeChip code={code} /><h3 className="text-[1.25rem]">{label}</h3></div>
              <p className="mt-3 text-[16px] leading-7 text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
