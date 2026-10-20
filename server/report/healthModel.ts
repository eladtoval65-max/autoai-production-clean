/** Pure part of the health check (unit-tested without a database). */
export type HealthResult = { name: string; ok: boolean; detail?: string };

/** Failed checks as lines for the email ("עמוד /cars — קוד 500"). */
export const problemsOf = (results: HealthResult[]) => results.filter((r) => !r.ok).map((r) => (r.detail ? `${r.name} — ${r.detail}` : r.name));
