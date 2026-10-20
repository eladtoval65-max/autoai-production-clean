import { card } from "../../../../shared/styles";
import { ContactButtons } from "../../components/ContactButtons";
import { StatusPill } from "../../components/StatusPill";
import { isOverdue, when } from "../../format";
import { CLOSED_STATUSES, LEAD_TYPE } from "../../labels";
import type { Lead } from "../../types";

const COLUMNS = ["#", "נוצר", "שם", "טלפון", "סוג ורכב", "איכות", "מקור", "סטטוס", "מעקב"];

/** Quality badge (0–100, see leadPolicy.ts) plus flags a partner cares about: opted in, repeat request. */
function QualityCell({ lead }: { lead: Lead }) {
  const score = lead.qualityScore;
  const tone = score == null ? "bg-mist text-muted" : score >= 70 ? "bg-go-soft text-go-deep" : score >= 40 ? "bg-[#fff4e8] text-[#8a5300]" : "bg-mist text-muted";
  return (
    <td className="p-3 text-[13px]">
      <span className={`inline-block rounded-full px-2 py-0.5 font-bold ${tone}`}>{score ?? "—"}</span>
      {Number(lead.partnerOptIn) === 1 && <span className="mt-1 block text-go-deep">✓ הסכים לעסק</span>}
      {lead.duplicateOfId && <span className="mt-1 block text-alert">כפול של #{lead.duplicateOfId}</span>}
    </td>
  );
}

/** Where the lead came from: UTM source, landing page, or the site page. */
const sourceOf = (l: Lead) => l.utmSource || (l.landingSlug ? `/go/${l.landingSlug}` : l.sourcePage);

/** One row; clicking anywhere (except the contact buttons) opens the lead panel. */
function LeadRow({ lead, onOpen }: { lead: Lead; onOpen: () => void }) {
  const overdue = isOverdue(lead.followUpAt, lead.status, CLOSED_STATUSES);
  return (
    <tr onClick={onOpen} className={`cursor-pointer border-b border-line last:border-0 hover:bg-mist/70 ${lead.status === "new" ? "bg-go-soft/30" : ""}`}>
      <td className="p-3 text-muted">{lead.id}</td>
      <td className="whitespace-nowrap p-3 text-muted">{when(lead.createdAt)}</td>
      <td className="p-3">
        <button className="text-start font-bold hover:text-go-deep" onClick={(e) => { e.stopPropagation(); onOpen(); }}>{lead.fullName}</button>
        {lead.city && <span className="block text-[13px] text-muted">{lead.city}</span>}
      </td>
      <td className="p-3"><ContactButtons phone={lead.phone} /></td>
      <td className="p-3">{LEAD_TYPE[lead.leadType] ?? lead.leadType}<span className="block text-[13px] text-muted">{lead.vehicleLabel}</span></td>
      <QualityCell lead={lead} />
      <td className="p-3 text-[14px]">{sourceOf(lead)}{lead.utmCampaign && <span className="block text-[12px] text-muted">{lead.utmCampaign}</span>}</td>
      <td className="p-3"><StatusPill status={lead.status} />{lead.partnerName && <span className="mt-1 block text-[12px] text-muted">{lead.partnerName}</span>}</td>
      <td className={`whitespace-nowrap p-3 text-[14px] ${overdue ? "font-bold text-alert" : "text-muted"}`}>
        {lead.followUpAt ? when(lead.followUpAt) : "—"}
        {Number(lead.noteCount) > 0 && <span className="block text-[12px] font-normal text-muted">{lead.noteCount} רשומות</span>}
      </td>
    </tr>
  );
}

/** Leads table (scrolls sideways on small screens). */
export function LeadsTable({ leads, onOpen }: { leads: Lead[]; onOpen: (id: number) => void }) {
  return (
    <div className={`${card} mt-5 overflow-x-auto`}>
      <table className="w-full min-w-[960px] text-[15px]">
        <thead><tr className="border-b border-line text-[13px] text-muted">{COLUMNS.map((c) => <th key={c} className="p-3 text-start font-semibold">{c}</th>)}</tr></thead>
        <tbody>{leads.map((l) => <LeadRow key={l.id} lead={l} onOpen={() => onOpen(l.id)} />)}</tbody>
      </table>
    </div>
  );
}
