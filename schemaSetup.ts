/**
 * Idempotent database setup: base Drizzle migrations + CamaOla CRM upgrades.
 * Runs once per server instance on first DB use, so a fresh database "just works".
 * Statements that already ran are skipped by MySQL errno (table/column/key exists).
 */
import type { Pool } from "mysql2/promise";
import m0 from "./0000_mighty_skreet.sql";
import m1 from "./0001_secret_red_ghost.sql";
import m2 from "./0002_stiff_machine_man.sql";
import m3 from "./0003_boring_wilson_fisk.sql";
import m4 from "./0004_flat_mockingbird.sql";

export const SCHEMA_VERSION = 4;
const SKIP_ERRNO = new Set([1005, 1050, 1060, 1061, 1068, 1091, 1826, 1022]);

export const LEAD_STATUSES = ["new", "contacted", "qualified", "sent_to_partner", "won", "lost", "closed"] as const;
/**
 * Database enum order. TiDB only allows APPENDING values to an existing enum (inserting in the
 * middle fails with "Unsupported modify column"), so the original 4 values keep their positions.
 */
const STATUS_DB_ORDER = ["new", "contacted", "qualified", "closed", "sent_to_partner", "won", "lost"];

const UPGRADES: string[] = [
  "ALTER TABLE `leads` ADD COLUMN `utmSource` varchar(80) NULL",
  "ALTER TABLE `leads` ADD COLUMN `utmMedium` varchar(80) NULL",
  "ALTER TABLE `leads` ADD COLUMN `utmCampaign` varchar(120) NULL",
  "ALTER TABLE `leads` ADD COLUMN `landingSlug` varchar(80) NULL",
  "ALTER TABLE `leads` ADD COLUMN `followUpAt` timestamp NULL",
  "ALTER TABLE `leads` ADD COLUMN `partnerId` int NULL",
  "ALTER TABLE `leads` ADD COLUMN `partnerConsentAt` timestamp NULL",
  "ALTER TABLE `leads` ADD COLUMN `partnerConsentNote` varchar(300) NULL",
  "ALTER TABLE `leads` ADD COLUMN `partnerSentAt` timestamp NULL",
  "ALTER TABLE `leads` ADD COLUMN `partnerPrice` int NULL",
  "ALTER TABLE `leads` ADD COLUMN `partnerPaid` tinyint(1) NOT NULL DEFAULT 0",
  `CREATE TABLE IF NOT EXISTS \`lead_notes\` (
    \`id\` int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    \`leadId\` int NOT NULL,
    \`kind\` varchar(20) NOT NULL DEFAULT 'note',
    \`body\` text NOT NULL,
    \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY \`lead_notes_lead_idx\` (\`leadId\`, \`createdAt\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`partners\` (
    \`id\` int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    \`name\` varchar(120) NOT NULL,
    \`type\` varchar(30) NOT NULL,
    \`contactName\` varchar(120) NULL,
    \`phone\` varchar(20) NULL,
    \`email\` varchar(160) NULL,
    \`region\` varchar(80) NULL,
    \`pricePerLead\` int NULL,
    \`active\` tinyint(1) NOT NULL DEFAULT 1,
    \`notes\` text NULL,
    \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS \`site_events\` (
    \`id\` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    \`name\` varchar(40) NOT NULL,
    \`sessionId\` varchar(64) NULL,
    \`page\` varchar(80) NULL,
    \`utmSource\` varchar(80) NULL,
    \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY \`site_events_name_created_idx\` (\`name\`, \`createdAt\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`landing_pages\` (
    \`id\` int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    \`slug\` varchar(60) NOT NULL,
    \`title\` varchar(160) NOT NULL,
    \`subtitle\` varchar(400) NULL,
    \`bullets\` text NULL,
    \`ctaText\` varchar(80) NULL,
    \`leadType\` varchar(20) NOT NULL DEFAULT 'vehicle',
    \`active\` tinyint(1) NOT NULL DEFAULT 1,
    \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY \`landing_pages_slug_uidx\` (\`slug\`)
  )`,
  // v4 — consent proof, duplicate detection, quality score, anonymisation (append-only; see leadPolicy.ts)
  "ALTER TABLE `leads` ADD COLUMN `consentVersion` varchar(20) NULL",
  "ALTER TABLE `leads` ADD COLUMN `partnerOptIn` tinyint(1) NOT NULL DEFAULT 0",
  "ALTER TABLE `leads` ADD COLUMN `partnerOptInText` text NULL",
  "ALTER TABLE `leads` ADD COLUMN `consentIpHash` varchar(64) NULL",
  "ALTER TABLE `leads` ADD COLUMN `consentUserAgent` varchar(255) NULL",
  "ALTER TABLE `leads` ADD COLUMN `duplicateOfId` int NULL",
  "ALTER TABLE `leads` ADD COLUMN `qualityScore` int NULL",
  "ALTER TABLE `leads` ADD COLUMN `anonymizedAt` timestamp NULL",
  "CREATE TABLE IF NOT EXISTS `app_schema` (`id` int NOT NULL PRIMARY KEY, `version` int NOT NULL)",
  `ALTER TABLE \`leads\` MODIFY COLUMN \`status\` enum(${STATUS_DB_ORDER.map((s) => `'${s}'`).join(",")}) NOT NULL DEFAULT 'new'`,
];

async function run(pool: Pool, stmt: string) {
  try { await pool.query(stmt); return true; }
  catch (e: any) { if (SKIP_ERRNO.has(e?.errno)) return false; throw e; }
}

let ready: Promise<void> | null = null;
/** Error codes of upgrade statements that failed on this instance (no SQL text, no data). */
export let schemaErrors: string[] = [];

/** Forces the next ensureSchema() call to re-run the upgrade (admin "init" button). */
export function resetSchema() { ready = null; }

/** Brings the database to SCHEMA_VERSION. Cheap after the first call (one indexed read). */
export function ensureSchema(pool: Pool): Promise<void> {
  if (!ready) {
    ready = (async () => {
      try {
        const [rows] = await pool.query("SELECT version FROM app_schema WHERE id = 1");
        if (Number((rows as any[])[0]?.version ?? 0) >= SCHEMA_VERSION) return;
      } catch { /* app_schema missing: fresh or pre-CRM database */ }
      const failed: string[] = [];
      // Each statement is independent: one unsupported DDL must not block the rest.
      const attempt = async (stmt: string, label: string) => {
        try { await run(pool, stmt); }
        catch (e: any) { failed.push(`${label}:${e?.code ?? e?.errno ?? "error"}`); console.error("[Schema] statement failed", label, e?.code ?? e?.errno); }
      };
      let i = 0;
      // Base Drizzle migrations only on a database that doesn't have them yet.
      const hasBase = await pool.query("SELECT 1 FROM leads LIMIT 1").then(() => true, () => false);
      if (!hasBase) for (const sql of [m0, m1, m2, m3, m4]) {
        for (const stmt of sql.split("--> statement-breakpoint").map((s) => s.trim()).filter(Boolean)) await attempt(stmt, `m${i++}`);
      }
      for (const [j, stmt] of UPGRADES.entries()) await attempt(stmt, `u${j}`);
      schemaErrors = failed;
      // Only the leads table is essential; anything else is retried on the next cold start.
      await pool.query("SELECT 1 FROM leads LIMIT 1");
      if (failed.length) return;
      await pool.query("INSERT INTO app_schema (id, version) VALUES (1, ?) ON DUPLICATE KEY UPDATE version = VALUES(version)", [SCHEMA_VERSION]);
    })().catch((e) => { ready = null; throw e; });
  }
  return ready;
}
