import type { FormEvent } from "react";
import { useLang } from "../../../../shared/i18n";
import { btnPrimary } from "../../../../shared/styles";
import type { PlateStatus } from "../../hooks/usePlateLookup";

/** Yellow Israeli-plate style input + "Check" button, with validation and error messages. */
export function PlateForm({ plate, setPlate, status, onSubmit }: { plate: string; setPlate: (v: string) => void; status: PlateStatus; onSubmit: (e: FormEvent) => void }) {
  const { t } = useLang();
  return (
    <>
      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input value={plate} onChange={(e) => setPlate(e.target.value)} inputMode="numeric" dir="ltr" placeholder={t.platePlaceholder} aria-label={t.platePlaceholder} size={8}
          className="num min-h-14 w-full min-w-0 flex-1 rounded-xl border-2 border-[#1d3f91] bg-[#f5c518] px-4 text-center text-[24px] tracking-wider text-ink outline-none placeholder:text-[16px] placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-[#5a4a00] focus:ring-4 focus:ring-[#f5c518]/40" />
        <button type="submit" disabled={status === "loading"} className={`${btnPrimary} min-h-14 px-6 text-[16px] disabled:opacity-50`}>{t.plateBtn}</button>
      </form>
      {status === "invalid" && <p className="mt-2 text-[14px] font-semibold text-alert">{t.plateInvalid}</p>}
      {status === "error" && <p className="mt-2 text-[14px] font-semibold text-alert">{t.plateError}</p>}
    </>
  );
}
