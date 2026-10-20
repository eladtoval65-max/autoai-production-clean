import { useLang } from "../../../../shared/i18n";

/** Dark call-to-action band under the results: ask to be contacted (consented lead form). */
export function LeadBanner({ onLead }: { onLead: () => void }) {
  const { t } = useLang();
  return (
    <div className="mt-12 flex flex-col gap-4 rounded-3xl bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <p className="font-display text-[1.35rem] font-bold leading-snug">{t.leadCta}</p>
        <p className="mt-1 max-w-[60ch] text-[15px] text-[#c3cbd6]">{t.leadNote}</p>
      </div>
      <button onClick={onLead} className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#5fd3a7] px-7 text-[17px] font-bold text-ink hover:bg-[#7fe0bb]">{t.leadBtn}</button>
    </div>
  );
}
