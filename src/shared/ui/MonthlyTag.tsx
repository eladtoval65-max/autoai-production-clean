import { shekel, useLang } from "../i18n";

/** The headline money figure: "₪2,491 per month" in the action green. */
export function MonthlyTag({ value, size = "lg", label }: { value: number; size?: "sm" | "md" | "lg"; label?: string }) {
  const { t, nf } = useLang();
  const fs = size === "lg" ? "text-[38px] sm:text-[44px]" : size === "md" ? "text-[28px]" : "text-[21px]";
  return (
    <span className="inline-flex items-baseline gap-1.5" aria-label={`${label ?? t.monthlyOwn}: ₪${nf.format(Math.round(value))}`}>
      <span className={`num leading-none text-go ${fs}`} aria-hidden>{shekel(value, nf)}</span>
      <span className="text-[14px] font-semibold text-muted" aria-hidden>{label ?? t.perMonth}</span>
    </span>
  );
}
