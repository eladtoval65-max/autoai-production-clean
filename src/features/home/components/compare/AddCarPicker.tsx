import { shekel, useLang } from "../../../../shared/i18n";
import { shortName } from "../../../../shared/format";
import type { Ranked } from "../../types";

/** Dropdown to add another car to the comparison without leaving the tab. */
export function AddCarPicker({ options, onAdd }: { options: Ranked[]; onAdd: (id: string) => void }) {
  const { lang, nf } = useLang();
  const he = lang === "he";
  return (
    <label className="flex flex-wrap items-center gap-2 text-[15px] font-semibold">
      {he ? "הוספת רכב להשוואה:" : "Add a car:"}
      <select value="" onChange={(e) => e.target.value && onAdd(e.target.value)} className="min-h-11 max-w-full rounded-full border border-line bg-white px-4 text-[15px]">
        <option value="">{he ? "בחירה…" : "Choose…"}</option>
        {options.map((c) => <option key={c.id} value={c.id}>{shortName(c.make)} · {shekel(c.price, nf)}</option>)}
      </select>
    </label>
  );
}
