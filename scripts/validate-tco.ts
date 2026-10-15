/**
 * AutoAI — TCO data validation script
 * Checks that ownershipCosts rows are internally consistent:
 *   • totalMonthly ≈ fuel + insurance + maintenance + depreciation + 121 (registration)
 *   • No negative components
 *   • All three km bands (7000, 15000, 25000) present for every trim
 *   • 25k fuel > 15k fuel > 7k fuel (more km = more fuel cost)
 *   • EV fuel costs are significantly lower than petrol equivalents
 *
 * Run from repo root:
 *   npx tsx scripts/validate-tco.ts
 */
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import { eq, inArray } from "drizzle-orm";
import { ownershipCosts, vehicleTrims, vehicleModels, vehicleMakes } from "../schema";

dotenv.config({ path: ".env.local" });

const REGISTRATION_MONTHLY = 121; // ₪1,452/year ÷ 12
const TOLERANCE = 30; // allow ₪30 rounding difference in totalMonthly

const connection = await mysql.createConnection(process.env.DATABASE_URL!);
const db = drizzle(connection);

console.log("🔍 AutoAI — TCO Validation\n");

// Fetch all TCO rows with vehicle name
const rows = await db
  .select({
    trimId:              ownershipCosts.trimId,
    annualKm:            ownershipCosts.annualKm,
    fuelMonthly:         ownershipCosts.fuelMonthly,
    insuranceMonthly:    ownershipCosts.insuranceMonthly,
    maintenanceMonthly:  ownershipCosts.maintenanceMonthly,
    depreciationMonthly: ownershipCosts.depreciationMonthly,
    totalMonthly:        ownershipCosts.totalMonthly,
    fuelType:            vehicleTrims.fuelType,
    make:                vehicleMakes.name,
    model:               vehicleModels.name,
    trimName:            vehicleTrims.trimName,
  })
  .from(ownershipCosts)
  .innerJoin(vehicleTrims, eq(ownershipCosts.trimId, vehicleTrims.id))
  .innerJoin(vehicleModels, eq(vehicleTrims.modelId, vehicleModels.id))
  .innerJoin(vehicleMakes, eq(vehicleModels.makeId, vehicleMakes.id))
  .orderBy(ownershipCosts.trimId, ownershipCosts.annualKm);

if (!rows.length) {
  console.error("❌ No ownershipCosts rows found — run seed-real-data.ts first.");
  await connection.end();
  process.exit(1);
}

type Row = typeof rows[number];

// Group by trimId
const byTrim = new Map<number, Row[]>();
for (const row of rows) {
  const existing = byTrim.get(row.trimId) ?? [];
  existing.push(row);
  byTrim.set(row.trimId, existing);
}

let errors = 0;
let warnings = 0;

for (const [trimId, trimRows] of byTrim) {
  const label = `${trimRows[0].make} ${trimRows[0].model} · ${trimRows[0].trimName} (trim #${trimId})`;
  const kmSet = new Set(trimRows.map((r) => r.annualKm));

  // 1. All three bands must be present
  for (const band of [7000, 15000, 25000]) {
    if (!kmSet.has(band)) {
      console.error(`❌ ${label}: missing km band ${band}`);
      errors++;
    }
  }

  for (const row of trimRows) {
    const rowLabel = `  [${row.annualKm} km/yr]`;
    const components = (row.fuelMonthly ?? 0) + (row.insuranceMonthly ?? 0) + (row.maintenanceMonthly ?? 0) + (row.depreciationMonthly ?? 0) + REGISTRATION_MONTHLY;
    const diff = Math.abs((row.totalMonthly ?? 0) - components);

    // 2. totalMonthly must match sum of components
    if (diff > TOLERANCE) {
      console.error(`❌ ${label}${rowLabel}: totalMonthly=${row.totalMonthly} but components sum to ${components} (diff ${diff} > ${TOLERANCE})`);
      errors++;
    }

    // 3. No negative components
    const fields = { fuelMonthly: row.fuelMonthly, insuranceMonthly: row.insuranceMonthly, maintenanceMonthly: row.maintenanceMonthly, depreciationMonthly: row.depreciationMonthly };
    for (const [field, value] of Object.entries(fields)) {
      if (value !== null && value !== undefined && value < 0) {
        console.error(`❌ ${label}${rowLabel}: ${field} is negative (${value})`);
        errors++;
      }
    }

    // 4. Sanity ranges
    if ((row.totalMonthly ?? 0) < 500 || (row.totalMonthly ?? 0) > 8000) {
      console.warn(`⚠️  ${label}${rowLabel}: totalMonthly=${row.totalMonthly} looks out of range`);
      warnings++;
    }
  }

  // 5. Fuel monotonicity — more km = more fuel cost (except EVs which are nearly flat)
  const sorted = [...trimRows].sort((a, b) => (a.annualKm ?? 0) - (b.annualKm ?? 0));
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    if ((curr.fuelMonthly ?? 0) < (prev.fuelMonthly ?? 0)) {
      console.warn(`⚠️  ${label}: fuelMonthly decreased from ${prev.annualKm}km (${prev.fuelMonthly}) to ${curr.annualKm}km (${curr.fuelMonthly})`);
      warnings++;
    }
  }

  // 6. EV fuel sanity — EV fuel at 15k should be < ₪250/month (₪0.102/km × 15000 / 12 ≈ ₪128)
  if (trimRows[0].fuelType === "Electric") {
    const band15 = trimRows.find((r) => r.annualKm === 15000);
    if (band15 && (band15.fuelMonthly ?? 0) > 250) {
      console.warn(`⚠️  ${label} [EV]: fuelMonthly at 15k is ${band15.fuelMonthly} — expected ≤ 250 for electric`);
      warnings++;
    }
  }

  // If all ok, show green line
  const allOk = trimRows.every((row) => {
    const components = (row.fuelMonthly ?? 0) + (row.insuranceMonthly ?? 0) + (row.maintenanceMonthly ?? 0) + (row.depreciationMonthly ?? 0) + REGISTRATION_MONTHLY;
    return Math.abs((row.totalMonthly ?? 0) - components) <= TOLERANCE;
  });
  if (allOk && kmSet.has(7000) && kmSet.has(15000) && kmSet.has(25000)) {
    const monthly15 = trimRows.find((r) => r.annualKm === 15000)?.totalMonthly;
    console.log(`✅ ${label} — ₪${monthly15?.toLocaleString()}/mo @ 15k`);
  }
}

console.log(`\n────────────────────────────────`);
console.log(`Total rows checked: ${rows.length}`);
console.log(`Errors  : ${errors}`);
console.log(`Warnings: ${warnings}`);
console.log(errors === 0 ? "\n🎉 All TCO data looks consistent!" : "\n🚨 Fix errors before deploying to production.");

await connection.end();
process.exit(errors > 0 ? 1 : 0);
