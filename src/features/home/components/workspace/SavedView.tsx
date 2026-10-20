import { shekel, useLang } from "../../../../shared/i18n";
import { shortName } from "../../../../shared/format";
import { btnGhost, card } from "../../../../shared/styles";
import { CarPhoto } from "../../../../shared/ui/CarPhoto";
import { EmptyState } from "../../../../shared/ui/EmptyState";
import { SaveBtn } from "../../../../shared/ui/SaveBtn";
import type { Car } from "../../types";

type Props = { cars: Car[]; history: Car[]; toggleSaved: (id: string) => void; toggleCompare: (id: string) => void; onDetails: (id: string) => void };

/** "Saved" tab: the user's hearted cars, plus recent top picks as quick links. */
export function SavedView({ cars, history, toggleSaved, toggleCompare, onDetails }: Props) {
  const { t, nf } = useLang();
  return (
    <div>
      {cars.length ? (
        <ul className="space-y-3">
          {cars.map((c) => (
            <li key={c.id} className={`${card} flex items-center gap-4 p-3`}>
              <CarPhoto name={c.make} label={false} className="h-20 w-28 shrink-0 rounded-xl" width={320} />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-[1.15rem]">{shortName(c.make)}</h3>
                <p className="num text-[15px] text-muted">{shekel(c.price, nf)}</p>
              </div>
              <button onClick={() => onDetails(c.id)} className={btnGhost}>{t.details}</button>
              <button onClick={() => toggleCompare(c.id)} className={`${btnGhost} hidden sm:inline-flex`}>{t.compareAdd}</button>
              <SaveBtn on onClick={() => toggleSaved(c.id)} />
            </li>
          ))}
        </ul>
      ) : <EmptyState text={t.emptySaved} />}
      <h3 className="mt-10 text-[1.25rem]">{t.history}</h3>
      {history.length
        ? <div className="mt-3 flex flex-wrap gap-2">{history.map((c) => <button key={c.id} onClick={() => onDetails(c.id)} className={btnGhost}>{shortName(c.make)}</button>)}</div>
        : <p className="mt-2 text-[15px] text-muted">{t.historyEmpty}</p>}
    </div>
  );
}
