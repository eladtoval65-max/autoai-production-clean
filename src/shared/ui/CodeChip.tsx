import { useLang } from "../i18n";

/** Data provenance: official (from a government/importer source), estimate (ours), or missing. */
export type Provenance = "off" | "est" | "miss";

/** Provenance badge: official = solid, estimate = outlined, missing = dashed. Used next to every important figure. */
export function CodeChip({ code }: { code: Provenance }) {
  const { t } = useLang();
  const label = code === "off" ? t.codeOfficial : code === "est" ? t.codeEstimate : t.codeMissing;
  const cls = code === "off" ? "bg-ink text-white border-ink" : code === "est" ? "border-[#9fb0c2] text-muted" : "border-dashed border-[#9fb0c2] text-muted";
  return <span className={`inline-flex shrink-0 items-center rounded-full border px-2 py-px text-[12px] font-bold leading-5 ${cls}`}>{label}</span>;
}
