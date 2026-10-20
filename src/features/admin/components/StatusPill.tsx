import { STATUS, STATUS_TONE } from "../labels";

/** Coloured pill for a lead status. */
export function StatusPill({ status }: { status: string }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-bold ${STATUS_TONE[status] ?? "bg-mist"}`}>{STATUS[status] ?? status}</span>;
}
