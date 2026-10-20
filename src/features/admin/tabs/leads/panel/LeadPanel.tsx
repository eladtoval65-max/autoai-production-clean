import { MessageCircle, Phone, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { StatusPill } from "../../../components/StatusPill";
import { intlPhone, when } from "../../../format";
import { btn, btnGo } from "../../../styles";
import type { Lead } from "../../../types";
import { FollowUp } from "./FollowUp";
import { LeadEditForm } from "./LeadEditForm";
import { NotesSection } from "./NotesSection";
import { PartnerSection } from "./PartnerSection";
import { StatusButtons } from "./StatusButtons";
import { useLeadDetail, type PanelMessage } from "./useLeadDetail";

/** Where the lead came from and the exact consent text the customer agreed to. */
function SourceAndConsent({ lead }: { lead: Lead }) {
  return (
    <section className="rounded-2xl bg-mist p-4 text-[14px]">
      <p><b>מקור:</b> {lead.sourcePage}{lead.landingSlug && ` · /go/${lead.landingSlug}`}{lead.utmSource && ` · ${lead.utmSource}`}{lead.utmMedium && ` / ${lead.utmMedium}`}{lead.utmCampaign && ` · ${lead.utmCampaign}`}</p>
      <p className="mt-2"><b>הסכמה מקורית</b> ({when(lead.consentAt)}): <span className="text-muted">{lead.consentText}</span></p>
    </section>
  );
}

function Message({ message }: { message: PanelMessage }) {
  if (!message) return null;
  return <p role="status" className={`rounded-xl px-3 py-2 text-[15px] font-semibold ${message.ok ? "bg-go-soft text-go-deep" : "bg-[#fff4e8] text-alert"}`}>{message.text}</p>;
}

/** Side drawer for one lead: contact, status, reminder, history, partner hand-off, edit form, source/consent, delete. Esc closes. */
export function LeadPanel({ id, onClose, onChanged }: { id: number; onClose: () => void; onChanged: () => void }) {
  const { lead, notes, partners, message, run } = useLeadDetail(id, onChanged);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function remove() {
    if (window.confirm("למחוק את הפנייה וכל ההיסטוריה שלה? אי אפשר לבטל.") && (await run("leadDelete", { confirm: true }, "נמחק"))) onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside role="dialog" aria-modal="true" aria-label={`פנייה ${id}`} className="h-full w-full max-w-[640px] overflow-y-auto bg-white shadow-[var(--shadow-float)]">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-white px-5 py-4">
          <div className="min-w-0">
            <p className="text-[13px] text-muted">פנייה #{id}{lead && <> · {when(lead.createdAt)}</>}</p>
            <h2 className="truncate text-xl">{lead?.fullName ?? "…"}</h2>
          </div>
          <button onClick={onClose} aria-label="סגירה" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-mist hover:border-ink"><X className="h-4 w-4" /></button>
        </div>
        {lead && (
          <div className="space-y-6 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <a href={`tel:${lead.phone}`} className={btnGo}><Phone className="h-4 w-4" />התקשרות</a>
              <a href={`https://wa.me/${intlPhone(lead.phone)}`} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#25d366] text-white`}><MessageCircle className="h-4 w-4" />וואטסאפ</a>
              <StatusPill status={lead.status} />
            </div>
            <Message message={message} />
            <StatusButtons current={lead.status} onSet={(s) => run("leadUpdate", { fields: { status: s } }, "הסטטוס עודכן")} />
            <FollowUp current={lead.followUpAt} onSet={(iso, okText) => run("leadUpdate", { fields: { followUpAt: iso } }, okText)} />
            <NotesSection notes={notes} onAdd={(kind, body) => run("noteAdd", { kind, body }, "נרשם")} />
            <PartnerSection lead={lead} partners={partners} run={run} />
            <LeadEditForm lead={lead} onSave={(fields) => run("leadUpdate", { fields }, "נשמר")} />
            <SourceAndConsent lead={lead} />
            <button onClick={remove} className="inline-flex items-center gap-2 text-[14px] font-bold text-alert"><Trash2 className="h-4 w-4" />מחיקת הפנייה (למשל לבקשת הלקוח)</button>
          </div>
        )}
      </aside>
    </div>
  );
}
