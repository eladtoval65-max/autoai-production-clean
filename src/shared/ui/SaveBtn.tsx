import { Heart } from "lucide-react";
import { useLang } from "../i18n";

/** Heart toggle for the saved list. `small` is the floating variant used on photos. */
export function SaveBtn({ on, onClick, small }: { on: boolean; onClick: () => void; small?: boolean }) {
  const { t } = useLang();
  return (
    <button onClick={onClick} aria-pressed={on} aria-label={on ? t.saved : t.save} title={on ? t.saved : t.save}
      className={`flex shrink-0 items-center justify-center rounded-full border bg-white ${small ? "h-9 w-9 border-transparent shadow-[var(--shadow-card)]" : "h-11 w-11 border-line"} ${on ? "text-alert" : "text-muted hover:text-ink"}`}>
      <Heart className={`h-[18px] w-[18px] ${on ? "fill-current" : ""}`} />
    </button>
  );
}
