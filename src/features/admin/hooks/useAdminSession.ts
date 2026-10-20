/**
 * Owner session: checks whether the admin cookie is valid, logs in/out, and loads the setup status.
 * phase: "checking" (first request) → "login" (no/expired session) → "in".
 */
import { useCallback, useEffect, useState } from "react";
import { adminApi } from "../api";
import type { SetupStatus } from "../types";

export function useAdminSession() {
  const [phase, setPhase] = useState<"checking" | "login" | "in">("checking");
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [error, setError] = useState("");

  /** Loads /status; a 401 means not logged in (or ADMIN_PASSWORD missing on the server). */
  const refresh = useCallback(async () => {
    const r = await adminApi<SetupStatus & { adminConfigured?: boolean }>("status");
    if (r.status === 401) {
      setPhase("login");
      if (r.data?.adminConfigured === false) setError("ADMIN_PASSWORD עוד לא הוגדר ב-Vercel.");
      return;
    }
    setPhase("in");
    setStatus(r.data);
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  async function login(password: string): Promise<boolean> {
    setError("");
    const r = await adminApi("login", { password });
    if (r.ok) { await refresh(); return true; }
    setError(r.status === 429 ? "יותר מדי ניסיונות. נסו שוב בעוד דקה." : r.status === 503 ? "ADMIN_PASSWORD עוד לא הוגדר ב-Vercel." : "סיסמה שגויה.");
    return false;
  }

  async function logout() { await adminApi("logout", {}); setPhase("login"); setStatus(null); }

  return { phase, status, error, login, logout, refresh };
}
