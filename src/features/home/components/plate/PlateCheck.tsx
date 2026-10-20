import { useLang } from "../../../../shared/i18n";
import { card } from "../../../../shared/styles";
import { EmptyState } from "../../../../shared/ui/EmptyState";
import { usePlateLookup } from "../../hooks/usePlateLookup";
import type { Car } from "../../types";
import { PlateForm } from "./PlateForm";
import { PlateResult } from "./PlateResult";

type Props = { cars: Car[]; km: number; onLead: (label: string) => void; onDetails: (id: string) => void };

/** "Checking a used car?" section: plate input on one side, the official registry result on the other. */
export function PlateCheck({ cars, km, onLead, onDetails }: Props) {
  const { t } = useLang();
  const { plate, setPlate, status, record, submit } = usePlateLookup();
  return (
    <section id="plate" className="mx-auto max-w-[1280px] scroll-mt-20 px-4 pb-20 sm:px-8">
      {/* minmax(0, …) columns stop long content from widening the page on mobile */}
      <div className={`${card} grid grid-cols-[minmax(0,1fr)] gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]`}>
        <div className="min-w-0">
          <h2 className="max-w-[18ch] text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.12]">{t.plateTitle}</h2>
          <p className="mt-3 max-w-[50ch] text-[16px] text-muted">{t.plateSub}</p>
          <PlateForm plate={plate} setPlate={setPlate} status={status} onSubmit={submit} />
          <p className="mt-3 text-[13px] text-muted">{t.plateNote}</p>
        </div>
        <div className="min-w-0" aria-live="polite">
          {status === "loading" && <p className="text-[15px] text-muted">{t.plateLoading}</p>}
          {record && !record.found && <EmptyState text={t.plateNotFound} />}
          {record?.found && <PlateResult record={record} cars={cars} km={km} onLead={onLead} onDetails={onDetails} />}
        </div>
      </div>
    </section>
  );
}
