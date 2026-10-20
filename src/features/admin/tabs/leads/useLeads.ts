/**
 * Leads list with server-side search and filters. Reloads 250 ms after the last filter change.
 */
import { useCallback, useEffect, useState } from "react";
import { adminApi, errorText } from "../../api";
import type { Lead } from "../../types";

export type LeadFilters = { q: string; status: string; type: string; dueOnly: boolean; days: string };
export const EMPTY_FILTERS: LeadFilters = { q: "", status: "", type: "", dueOnly: false, days: "" };

/** Filters → /api/admin?action=leads query parameters (empty ones omitted). */
function toQuery(f: LeadFilters): Record<string, string> {
  const q: Record<string, string> = {};
  if (f.q.trim()) q.q = f.q.trim();
  if (f.status) q.status = f.status;
  if (f.type) q.type = f.type;
  if (f.dueOnly) q.followUp = "due";
  if (f.days) q.days = f.days;
  return q;
}

export function useLeads(filters: LeadFilters) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setBusy(true);
    const r = await adminApi<{ leads: Lead[] }>("leads", undefined, toQuery(filters));
    if (r.ok) { setLeads(r.data.leads ?? []); setError(""); } else setError(errorText(r));
    setBusy(false);
  }, [filters]);

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);
  return { leads, busy, error, reload: load };
}
