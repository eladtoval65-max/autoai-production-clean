import { Check, X } from "lucide-react";
import { useLang } from "../../../../shared/i18n";
import { shortName } from "../../../../shared/format";
import { card } from "../../../../shared/styles";
import { CarPhoto } from "../../../../shared/ui/CarPhoto";
import type { Ranked } from "../../types";
import type { CompareRow } from "./compareRows";

type Props = { cars: Ranked[]; rows: CompareRow[]; values: (number | null)[][]; winners: number[]; wins: number[]; onRemove: (id: string) => void };

const stickyCell = "sticky start-0 z-10 bg-white p-3 text-start text-[14px] font-semibold text-muted sm:p-4";

/** Column header for one car: photo, name, remove button and how many rows it won. */
function CarHeader({ car, wins, onRemove }: { car: Ranked; wins: number; onRemove: () => void }) {
  const { lang } = useLang();
  const he = lang === "he";
  return (
    <th className="p-3 text-start align-top sm:p-4">
      <CarPhoto name={car.make} label={false} className="mb-3 aspect-[16/10] w-full rounded-xl" width={480} />
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 break-words font-display text-[1.05rem] font-bold leading-tight">{shortName(car.make)}</span>
        <button onClick={onRemove} aria-label={he ? "הסרה מההשוואה" : "Remove"} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-mist hover:text-ink"><X className="h-4 w-4" /></button>
      </div>
      <p className="mt-1 text-[13px] font-semibold text-go-deep">{he ? `${wins} שורות` : `${wins} rows`}</p>
    </th>
  );
}

/** Side-by-side table; the winning cell of each row is tinted green with a "Best" badge. First column stays put on mobile scroll. */
export function CompareTable({ cars, rows, values, winners, wins, onRemove }: Props) {
  const { lang } = useLang();
  const he = lang === "he";
  return (
    <div className={`${card} overflow-x-auto`}>
      <table className="w-full min-w-[560px] table-fixed border-collapse text-[15px]">
        <colgroup><col className="w-[34%] sm:w-[26%]" />{cars.map((c) => <col key={c.id} />)}</colgroup>
        <thead>
          <tr className="border-b border-line">
            <th className={`${stickyCell} align-bottom`}>{he ? "מנצח בשורות:" : "Rows won:"}</th>
            {cars.map((c, i) => <CarHeader key={c.id} car={c} wins={wins[i]} onRemove={() => onRemove(c.id)} />)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row.key} className="border-b border-line last:border-0">
              <th scope="row" className={stickyCell}>{row.label}</th>
              {cars.map((c, i) => {
                const isWinner = winners[ri] === i;
                return (
                  <td key={c.id} className={`p-3 align-middle sm:p-4 ${isWinner ? "bg-go-soft" : ""}`}>
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                      {row.show(values[ri][i], c)}
                      {isWinner && <span className="inline-flex items-center gap-0.5 rounded-full bg-go px-2 py-0.5 text-[11px] font-bold text-white"><Check className="h-3 w-3" aria-hidden />{he ? "הכי טוב" : "Best"}</span>}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <th scope="row" className={`${stickyCell} align-top`}>{he ? "יתרונות וחסרונות" : "Pros & cons"}</th>
            {cars.map((c) => (
              <td key={c.id} className="p-3 align-top text-[14px] sm:p-4">
                <ul className="space-y-1">{c.pros.slice(0, 3).map((x) => <li key={x} className="flex gap-1.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-go" aria-hidden />{x}</li>)}</ul>
                <ul className="mt-2 space-y-1 text-muted">{c.cons.slice(0, 2).map((x) => <li key={x} className="flex gap-1.5"><X className="mt-0.5 h-4 w-4 shrink-0 text-alert" aria-hidden />{x}</li>)}</ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
