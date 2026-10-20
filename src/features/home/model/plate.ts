/**
 * Licence-plate lookup (official Ministry of Transport registry via /api/plate). Types and pure helpers.
 */
import { shortName } from "../../../shared/format";
import type { Car } from "../types";

/** One registry record as returned by /api/plate (fields are Hebrew strings from the registry). */
export type PlateRecord = {
  found: boolean; source?: string; plate?: string; make?: string | null; model?: string | null; trim?: string | null; year?: string | null;
  fuel?: string | null; color?: string | null; ownership?: string | null; lastTest?: string | null; licenseValidUntil?: string | null;
  onRoadSince?: string | null; safetyLevel?: string | null; pollutionGroup?: string | null;
};

/** Registry fields shown to the user, in display order. */
export const PLATE_FIELDS = ["make", "model", "trim", "year", "fuel", "color", "ownership", "lastTest", "licenseValidUntil", "onRoadSince", "safetyLevel", "pollutionGroup"] as const;
export type PlateField = (typeof PLATE_FIELDS)[number];
const DATE_FIELDS = new Set<PlateField>(["lastTest", "licenseValidUntil", "onRoadSince"]);

/** 7–8 digits after removing dashes/spaces, or null when the input can't be a plate. */
export function normalizePlate(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  return /^\d{7,8}$/.test(digits) ? digits : null;
}

/** Calls /api/plate. Throws on network/server errors so the caller can show a message. */
export async function lookupPlate(plate: string): Promise<PlateRecord> {
  const res = await fetch(`/api/plate?n=${plate}`);
  const data = await res.json().catch(() => null);
  if (!res.ok || !data) throw new Error(String(res.status));
  return data as PlateRecord;
}

const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Best-effort match of the registry model name to a car in our catalog (for the monthly-cost hint). */
export function matchCatalogCar(rec: PlateRecord, cars: Car[]): Car | undefined {
  if (!rec.found || !rec.model) return undefined;
  const r = norm(rec.model);
  if (r.length <= 2) return undefined;
  return cars.find((c) => norm(shortName(c.make)).includes(r) || r.includes(norm(c.make.split(" ").slice(-1)[0])));
}

/** [field, display value] pairs for the fields the registry actually returned (dates formatted locally). */
export function plateDisplayFields(rec: PlateRecord, locale: string): [PlateField, string][] {
  const fmtDate = (v: string) => { const d = new Date(v); return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString(locale); };
  return PLATE_FIELDS
    .map((k) => { const v = rec[k]; return [k, v ? (DATE_FIELDS.has(k) ? fmtDate(v) : v) : ""] as [PlateField, string]; })
    .filter(([, v]) => v);
}

/** Ex-leasing / rental cars deserve an extra warning in Israel. */
export const isFleetOwnership = (ownership?: string | null) => Boolean(ownership && /ליסינג|השכרה|חכירה/.test(ownership));
