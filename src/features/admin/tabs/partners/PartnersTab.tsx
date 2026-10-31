import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { card } from "../../../../shared/styles";
import { adminApi } from "../../api";
import { EmptyBox } from "../../components/EmptyBox";
import { money } from "../../format";
import { PARTNER_TYPE } from "../../labels";
import { btnGo } from "../../styles";
import type { Partner } from "../../types";
import { PortalLinkButton } from "./PortalLinkButton";
import { draftFromPartner, EMPTY_PARTNER, PartnerForm, type PartnerDraft } from "./PartnerForm";

const COLUMNS = ["שם", "סוג", "איש קשר", "מחיר לליד", "לידים", "שולם", "פתוח לגבייה", ""];

/** "Partners" tab: list with lead counts and money paid/owed, plus create/edit. */
export function PartnersTab() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<PartnerDraft | null>(null);
  const load = useCallback(async () => { const r = await adminApi<{ partners: Partner[] }>("partners"); if (r.ok) setPartners(r.data.partners ?? []); }, []);
  useEffect(() => { void load(); }, [load]);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl">שותפים</h1><p className="mt-1 text-[15px] text-muted">סוכנויות, יבואנים, מימון, ביטוח ובדיקות רכב שמקבלים לידים בהסכמת הלקוח.</p></div>
        <button onClick={() => setEditing({ ...EMPTY_PARTNER })} className={btnGo}><Plus className="h-4 w-4" />שותף חדש</button>
      </div>
      {editing && <PartnerForm key={editing.id || "new"} initial={editing} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); void load(); }} />}
      {partners.length === 0 ? <EmptyBox text="אין עדיין שותפים." /> : (
        <div className={`${card} mt-5 overflow-x-auto`}>
          <table className="w-full min-w-[820px] text-[15px]">
            <thead><tr className="border-b border-line text-[13px] text-muted">{COLUMNS.map((c, i) => <th key={i} className="p-3 text-start font-semibold">{c}</th>)}</tr></thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p.id} className={`border-b border-line last:border-0 ${Number(p.active) ? "" : "text-muted"}`}>
                  <td className="p-3 font-bold">{p.name}{!Number(p.active) && <span className="ms-2 text-[12px] font-normal">(לא פעיל)</span>}{p.region && <span className="block text-[13px] font-normal text-muted">{p.region}</span>}</td>
                  <td className="p-3">{PARTNER_TYPE[p.type] ?? p.type}</td>
                  <td className="p-3">{p.contactName ?? "—"}{p.phone && <span className="block text-[13px] text-muted" dir="ltr">{p.phone}</span>}</td>
                  <td className="num p-3">{money(p.pricePerLead)}</td>
                  <td className="num p-3">{p.leadCount}</td>
                  <td className="num p-3 text-go-deep">{money(p.paidTotal)}</td>
                  <td className="num p-3">{money(p.owedTotal)}</td>
                  <td className="p-3"><div className="flex flex-col items-start gap-1.5"><button onClick={() => setEditing(draftFromPartner(p))} className="font-bold text-go-deep underline">עריכה</button><PortalLinkButton partner={p} onDone={load} /></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
