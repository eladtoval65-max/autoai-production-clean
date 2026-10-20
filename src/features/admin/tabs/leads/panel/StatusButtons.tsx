import { STATUS } from "../../../labels";

/** One button per status. "Sent to partner" is excluded: it is only set by the consented hand-off. */
export function StatusButtons({ current, onSet }: { current: string; onSet: (status: string) => void }) {
  return (
    <section>
      <h3 className="text-[17px]">סטטוס</h3>
      <div className="mt-2 flex flex-wrap gap-2">
        {Object.entries(STATUS).filter(([k]) => k !== "sent_to_partner").map(([k, v]) => (
          <button key={k} onClick={() => onSet(k)} aria-pressed={current === k}
            className={`min-h-10 rounded-full border px-3.5 text-[14px] font-bold ${current === k ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}>{v}</button>
        ))}
      </div>
    </section>
  );
}
