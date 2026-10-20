import { X } from "lucide-react";
import { useLang } from "../../../../shared/i18n";
import { shortName } from "../../../../shared/format";
import { btnPrimary } from "../../../../shared/styles";
import type { Car } from "../../types";

/** Floating bar at the bottom of the screen: what's selected for comparison + one clear "Compare now" action. */
export function CompareTray({ cars, onRemove, onOpen }: { cars: Car[]; onRemove: (id: string) => void; onOpen: () => void }) {
  const { lang } = useLang();
  const he = lang === "he";
  const ready = cars.length >= 2;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 shadow-[0_-8px_24px_-12px_rgba(14,27,44,.25)] backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-2 px-4 py-3 sm:px-8">
        <span className="text-[14px] font-bold text-muted">{he ? "בהשוואה:" : "Comparing:"}</span>
        <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {cars.map((c) => (
            <li key={c.id} className="flex min-h-9 items-center gap-1 rounded-full bg-mist ps-3 pe-1 text-[14px] font-semibold">
              <span className="max-w-[16ch] truncate">{shortName(c.make)}</span>
              <button onClick={() => onRemove(c.id)} aria-label={he ? `הסרה של ${shortName(c.make)}` : `Remove ${shortName(c.make)}`} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onOpen} disabled={!ready} className={`${btnPrimary} min-h-11 px-6 disabled:opacity-50`}>
          {!ready ? (he ? "בחרו עוד רכב" : "Pick one more") : he ? `השוו עכשיו (${cars.length})` : `Compare now (${cars.length})`}
        </button>
      </div>
    </div>
  );
}
