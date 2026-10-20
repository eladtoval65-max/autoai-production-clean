import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../../api";
import { EmptyBox } from "../../components/EmptyBox";
import { btnGo } from "../../styles";
import type { LandingRow } from "../../types";
import { LandingCard } from "./LandingCard";
import { draftFromLanding, EMPTY_LANDING, LandingForm, type LandingDraft } from "./LandingForm";

/** "Landing pages" tab: campaign pages at /go/<slug>, their performance, and the editor. */
export function LandingsTab() {
  const [rows, setRows] = useState<LandingRow[]>([]);
  const [editing, setEditing] = useState<{ draft: LandingDraft; isNew: boolean } | null>(null);
  const load = useCallback(async () => { const r = await adminApi<{ landings: LandingRow[] }>("landings"); if (r.ok) setRows(r.data.landings ?? []); }, []);
  useEffect(() => { void load(); }, [load]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl">דפי נחיתה</h1><p className="mt-1 text-[15px] text-muted">דפים לקמפיינים בכתובת /go/שם-הדף. הלידים מהם מסומנים לפי הדף והקמפיין.</p></div>
        <button onClick={() => setEditing({ draft: { ...EMPTY_LANDING }, isNew: true })} className={btnGo}><Plus className="h-4 w-4" />דף חדש</button>
      </div>
      {editing && <LandingForm key={editing.draft.slug || "new"} initial={editing.draft} isNew={editing.isNew} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); void load(); }} />}
      {rows.length === 0 ? <EmptyBox text="אין עדיין דפי נחיתה." /> : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {rows.map((r) => <LandingCard key={r.id} row={r} onEdit={() => setEditing({ draft: draftFromLanding(r), isNew: false })} />)}
        </div>
      )}
    </section>
  );
}
