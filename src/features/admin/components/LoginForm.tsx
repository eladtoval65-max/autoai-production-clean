import { useState, type FormEvent } from "react";
import { card, field } from "../../../shared/styles";
import { btnGo } from "../styles";

/** Password form. The password is only sent to /api/admin, which sets an HttpOnly session cookie. */
export function LoginForm({ error, onLogin }: { error: string; onLogin: (password: string) => Promise<boolean> }) {
  const [password, setPassword] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (await onLogin(password)) setPassword("");
  }
  return (
    <form onSubmit={submit} className={`${card} mx-auto mt-10 max-w-md p-6`}>
      <h1 className="text-2xl">כניסה לניהול</h1>
      <label className="mt-5 block text-[15px] font-semibold">סיסמת ניהול
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className={field} />
      </label>
      {error && <p role="alert" className="mt-3 text-[15px] font-semibold text-alert">{error}</p>}
      <button type="submit" className={`${btnGo} mt-5 w-full`}>כניסה</button>
    </form>
  );
}
