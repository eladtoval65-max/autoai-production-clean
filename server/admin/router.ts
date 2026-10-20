/**
 * Action table for /api/admin: action name → handler and the HTTP method it requires.
 * Reads are GET (?action=…), writes are POST ({action, …}).
 */
import { addNote, anonymizeLead, assignPartner, deleteLead, getConsentProof, getLead, listLeads, purgeOldLeads, unassignPartner, updateLead } from "./leads";
import { listLandings, saveLanding } from "./landings";
import { listPartners, savePartner } from "./partners";
import { initDatabase } from "./setup";
import { getStats } from "./stats";
import { sendWeekly } from "../report/weekly";
import type { Action } from "./http";

type Route = { method: "GET" | "POST" | "ANY"; run: Action };

export const ROUTES: Record<string, Route> = {
  init: { method: "POST", run: initDatabase },
  leads: { method: "ANY", run: listLeads },
  lead: { method: "ANY", run: getLead },
  leadUpdate: { method: "POST", run: updateLead },
  setStatus: { method: "POST", run: updateLead }, // legacy name used by older admin pages
  leadDelete: { method: "POST", run: deleteLead },
  leadAnonymize: { method: "POST", run: anonymizeLead },
  purgeOld: { method: "POST", run: purgeOldLeads },
  consentProof: { method: "ANY", run: getConsentProof },
  noteAdd: { method: "POST", run: addNote },
  assign: { method: "POST", run: assignPartner },
  unassign: { method: "POST", run: unassignPartner },
  partners: { method: "ANY", run: listPartners },
  partnerSave: { method: "POST", run: savePartner },
  landings: { method: "ANY", run: listLandings },
  landingSave: { method: "POST", run: saveLanding },
  stats: { method: "ANY", run: getStats },
  reportNow: { method: "POST", run: async ({ pool }) => ({ result: await sendWeekly(pool, true) }) },
};
