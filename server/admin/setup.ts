/**
 * Deployment checklist and the (idempotent) database upgrade.
 * Reports only whether settings exist — never their values.
 */
import type { Pool } from "mysql2/promise";
import { ensureSchema, resetSchema, SCHEMA_VERSION, schemaErrors } from "../../schemaSetup";
import type { Action } from "./http";

/** Which environment variables / database pieces are in place. Works even without a database. */
export async function setupStatus(pool: Pool | null) {
  let dbReachable = false, leadsTable = false;
  if (pool) {
    try { await pool.query("SELECT 1"); dbReachable = true; await ensureSchema(pool); leadsTable = true; }
    catch (e: any) { console.error("[Admin] db check failed", e?.code ?? e?.name ?? "unknown"); } // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  return {
    dbConfigured: Boolean(pool), dbReachable, leadsTable, schemaVersion: leadsTable ? SCHEMA_VERSION : 0, schemaErrors,
    contactEmail: /^\S+@\S+\.\S+$/.test(process.env.AUTOAI_CONTACT_EMAIL ?? ""),
    emailAlerts: Boolean(process.env.RESEND_API_KEY?.trim()),
    chatKey: Boolean(process.env.ANTHROPIC_API_KEY?.trim()),
    siteUrl: Boolean(process.env.SITE_URL?.trim() || process.env.VERCEL_PROJECT_PRODUCTION_URL),
  };
}

/** "Prepare database" button: re-runs the upgrade even if it already ran on this server instance. */
export const initDatabase: Action = async ({ pool }) => {
  resetSchema();
  await ensureSchema(pool);
  return { ok: true, leadsTable: true, schemaVersion: SCHEMA_VERSION, schemaErrors };
};
