import { shortName } from "../../../../shared/format";
import { useLang } from "../../../../shared/i18n";
import { btnGhost } from "../../../../shared/styles";
import { CodeChip } from "../../../../shared/ui/CodeChip";
import { MonthlyTag } from "../../../../shared/ui/MonthlyTag";
import { monthlyFor } from "../../model/cost";
import { isFleetOwnership, matchCatalogCar, plateDisplayFields, type PlateRecord } from "../../model/plate";
import type { Car } from "../../types";

type Props = { record: PlateRecord; cars: Car[]; km: number; onLead: (label: string) => void; onDetails: (id: string) => void };

/** Registry facts for a found plate, ex-fleet warning, our monthly-cost estimate when the model is in the catalog, and a lead CTA. */
export function PlateResult({ record, cars, km, onLead, onDetails }: Props) {
  const { lang, t } = useLang();
  const label = [record.make, record.model, record.year].filter(Boolean).join(" ");
  const match = matchCatalogCar(record, cars);
  const fields = plateDisplayFields(record, lang === "he" ? "he-IL" : "en-GB");
  return (
    <div className="swap">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[1.4rem]">{label}</h3>
        <span className="flex items-center gap-2"><CodeChip code="off" /><span className="text-[13px] text-muted">{t.plateSource}</span></span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
        {fields.map(([k, v]) => <div key={k} className="min-w-0"><dt className="text-[13px] font-semibold text-muted">{t.plateFields[k]}</dt><dd className="m-0 break-words text-[16px] font-semibold">{v}</dd></div>)}
      </dl>
      {isFleetOwnership(record.ownership) && <p className="mt-4 rounded-xl bg-[#fff4e8] px-4 py-3 text-[15px] text-[#7a3410]">{t.plateLeasing}</p>}
      {match && (
        <div className="mt-5 rounded-xl bg-mist p-4">
          <p className="text-[14px] text-muted">{t.plateMatch}</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <MonthlyTag value={monthlyFor(match, km)} size="md" />
            <button onClick={() => onDetails(match.id)} className={btnGhost}>{shortName(match.make)} · {t.details}</button>
          </div>
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink p-4 text-white">
        <p className="font-semibold">{t.plateLeadCta}</p>
        <button onClick={() => onLead(`${label} · ${record.plate}`)} className="inline-flex min-h-11 items-center rounded-full bg-[#5fd3a7] px-5 font-bold text-ink hover:bg-[#7fe0bb]">{t.plateLeadBtn}</button>
      </div>
    </div>
  );
}
