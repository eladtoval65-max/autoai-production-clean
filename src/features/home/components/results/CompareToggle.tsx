import { useLang } from "../../../../shared/i18n";
import { btnGhost } from "../../../../shared/styles";

/** "Compare" pill button; turns green while the car is in the comparison. */
export function CompareToggle({ active, onClick, className = "" }: { active: boolean; onClick: () => void; className?: string }) {
  const { t } = useLang();
  return (
    <button onClick={onClick} aria-pressed={active} className={`${btnGhost} ${className} ${active ? "border-go bg-go-soft text-go-deep" : ""}`}>
      {active ? t.compareIn : t.compareAdd}
    </button>
  );
}
