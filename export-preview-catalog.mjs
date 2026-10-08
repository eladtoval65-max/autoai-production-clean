import mysql from "mysql2/promise";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

// Read-only export of product data. Never export users, searchSessions, savedVehicles or leads.
const tables = [
  "vehicleSources",
  "vehicleMakes",
  "vehicleModels",
  "vehicleTrims",
  "vehicleFacts",
  "insuranceEstimates",
  "ownershipCosts",
  "vehicleRegistrySnapshots",
  "vehicleMarketSnapshots",
];

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL required");
const output = resolve(process.argv[2] ?? "drizzle/seed_preview_catalog.sql");
const db = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const lines = [
    "-- AutoAI product catalog snapshot. Contains no contact details or user data.",
    "-- Values include prototypes/estimates and must not be represented as live market quotes.",
    "-- Apply to a NEW database after migrations 0000–0004. Verify source rights before commercial use.",
    "START TRANSACTION;",
  ];
  for (const table of tables) {
    const [rows] = await db.query(`SELECT * FROM \`${table}\` ORDER BY id`);
    for (const row of rows) {
      const columns = Object.keys(row);
      const names = columns.map(column => `\`${column}\``).join(", ");
      const values = columns.map(column => row[column]);
      // INSERT IGNORE lets an operator re-run the seed without silently replacing existing data.
      lines.push(mysql.format(`INSERT IGNORE INTO \`${table}\` (${names}) VALUES (?);`, [values]));
    }
    console.log(`${table}: ${rows.length} rows`);
  }
  lines.push("COMMIT;", "");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, lines.join("\n"));
  console.log(`Catalog SQL written to ${output}`);
} finally {
  await db.end();
}
