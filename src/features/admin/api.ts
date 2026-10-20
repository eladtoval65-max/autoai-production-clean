/**
 * Client for /api/admin. All calls send the HttpOnly session cookie; GET for reads, POST for writes.
 * Server error codes are translated to Hebrew here so every screen shows the same wording.
 */
export type ApiResult<T = any> = { ok: boolean; status: number; data: T }; // eslint-disable-line @typescript-eslint/no-explicit-any

/** Read (GET) when `body` is omitted, write (POST) otherwise. `query` adds URL parameters to reads. */
export async function adminApi<T = any>(action: string, body?: Record<string, unknown>, query?: Record<string, string>): Promise<ApiResult<T>> { // eslint-disable-line @typescript-eslint/no-explicit-any
  const res = body
    ? await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action, ...body }), credentials: "same-origin" })
    : await fetch(`/api/admin?${new URLSearchParams({ action, ...(query ?? {}) })}`, { credentials: "same-origin" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

const ERRORS: Record<string, string> = {
  consent_required: "חובה לסמן שהלקוח הסכים ולתעד איך ומתי (לפחות כמה מילים).",
  bad_phone: "מספר טלפון לא תקין (05XXXXXXXX).",
  bad_name: "שם קצר מדי.",
  bad_partner: "צריך שם וסוג שותף.",
  bad_landing: "כתובת (באנגלית, אותיות קטנות ומקפים) וכותרת של 3 תווים לפחות.",
  use_assign: "העברה לשותף נעשית דרך ״העברה לשותף״ עם תיעוד הסכמה.",
  partner_not_found: "השותף לא נמצא או לא פעיל.",
  confirm_required: "צריך לאשר מחיקה.",
  lead_anonymized: "פרטי הפנייה נמחקו; אי אפשר להעביר אותה לשותף.",
};

/** User-facing message for a failed call. */
export const errorText = (r: ApiResult) => ERRORS[r.data?.error] ?? `הפעולה נכשלה (${r.data?.code ?? r.data?.error ?? r.status}).`;
