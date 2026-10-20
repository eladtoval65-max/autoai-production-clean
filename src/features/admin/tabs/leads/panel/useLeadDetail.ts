/**
 * One lead's details, its history, the active partners, and a `run` helper for write actions
 * (shows a success/error message and reloads both the panel and the list).
 */
import { useCallback, useEffect, useState } from "react";
import { adminApi, errorText } from "../../../api";
import type { Lead, Note, Partner } from "../../../types";

export type PanelMessage = { ok: boolean; text: string } | null;

export function useLeadDetail(id: number, onChanged: () => void) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [message, setMessage] = useState<PanelMessage>(null);

  const load = useCallback(async () => {
    const r = await adminApi<{ lead: Lead; notes: Note[] }>("lead", undefined, { id: String(id) });
    if (!r.ok) { setMessage({ ok: false, text: errorText(r) }); return; }
    setLead(r.data.lead);
    setNotes(r.data.notes ?? []);
  }, [id]);

  useEffect(() => {
    void load();
    void adminApi<{ partners: Partner[] }>("partners").then((r) => r.ok && setPartners((r.data.partners ?? []).filter((p) => Number(p.active))));
  }, [load]);

  /** POST an action for this lead; on success reload and tell the list to refresh. Returns true on success. */
  async function run(action: string, body: Record<string, unknown>, okText: string): Promise<boolean> {
    const r = await adminApi(action, { id, ...body });
    setMessage(r.ok ? { ok: true, text: okText } : { ok: false, text: errorText(r) });
    if (r.ok) { await load(); onChanged(); }
    return r.ok;
  }

  return { lead, notes, partners, message, run };
}
