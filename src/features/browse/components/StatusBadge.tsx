import type { ModelLine } from "../../../data/generations";
import { STATUS_HE } from "../model/labels";

/** Small pill: on sale (green), price not verified (amber), discontinued / not sold new (grey). */
export function StatusBadge({ status }: { status: ModelLine["status"] }) {
  const tone = status === "on_sale" ? "bg-go-soft text-go-deep" : status === "unverified" ? "bg-[#fff4e8] text-[#9a4b00]" : "bg-mist text-muted";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-[13px] font-bold ${tone}`}>{STATUS_HE[status]}</span>;
}
