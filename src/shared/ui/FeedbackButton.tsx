/**
 * "מה חסר לך?" — a small tab on the side of every public page. Opens a short form (message + optional email
 * for a reply) that goes to /api/feedback → stored and emailed to the owner. No account, no tracking.
 */
import { MessageSquarePlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

type State = "idle" | "sending" | "sent" | "error";

export function FeedbackButton() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  if (location.startsWith("/admin") || location.startsWith("/partner")) return null;
  return (
    <>
      <button onClick={() => setOpen(true)} dir="rtl"
        className="fixed bottom-28 left-0 z-30 flex items-center gap-1.5 rounded-e-xl bg-ink px-3 py-2.5 text-[14px] font-bold text-white shadow-[var(--shadow-float)] hover:bg-[#1d2c40]">
        <MessageSquarePlus className="h-4 w-4" aria-hidden />מה חסר לך?
      </button>
      {open && <FeedbackDialog page={location} onClose={() => setOpen(false)} />}
    </>
  );
}

function FeedbackDialog({ page, onClose }: { page: string; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<State>("idle");
  const first = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { first.current?.focus(); const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", esc); return () => window.removeEventListener("keydown", esc); }, [onClose]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 3) return;
    setState("sending");
    try {
      const r = await fetch("/api/feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message, email, page, website: trap }) });
      setState(r.ok ? "sent" : "error");
    } catch { setState("error"); }
  }

  return (
    <div dir="rtl" lang="he" className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="fb-h" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-[var(--shadow-float)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <h2 id="fb-h" className="text-[1.35rem]">מה חסר לך באתר?</h2>
          <button onClick={onClose} aria-label="סגירה" className="rounded-full p-1.5 text-muted hover:bg-mist"><X className="h-5 w-5" /></button>
        </div>
        {state === "sent" ? (
          <div className="mt-4"><p className="text-[16px]">תודה! קיבלנו. כל הערה עוזרת לנו לשפר. 🙏</p>
            <button onClick={onClose} className="mt-5 min-h-11 rounded-full bg-go px-6 font-bold text-white hover:bg-go-deep">סגירה</button></div>
        ) : (
          <form onSubmit={send} className="mt-3 space-y-3">
            <p className="text-[15px] text-muted">משהו שחיפשת ולא מצאת, נתון שנראה לא נכון, או רעיון — כתבו לנו.</p>
            <label className="block"><span className="sr-only">ההודעה</span>
              <textarea ref={first} value={message} onChange={(e) => setMessage(e.target.value)} rows={4} maxLength={2000} required
                className="w-full rounded-2xl border border-line p-3 text-[16px] outline-none focus:border-go" placeholder="למשל: חסר לי הדגם… / המחיר של… לא נכון" /></label>
            <label className="block text-[14px] font-semibold text-muted">מייל לתשובה (לא חובה)
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" maxLength={160}
                className="mt-1 min-h-11 w-full rounded-full border border-line px-4 text-[16px] font-normal text-ink outline-none focus:border-go" /></label>
            <input tabIndex={-1} aria-hidden autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" />
            <p className="text-[12px] text-muted">נשתמש במייל רק כדי לענות על ההודעה הזו.</p>
            {state === "error" && <p role="alert" className="text-[14px] font-semibold text-alert">לא הצלחנו לשלוח כרגע. נסו שוב בעוד דקה.</p>}
            <button disabled={state === "sending" || message.trim().length < 3} className="min-h-12 w-full rounded-full bg-go font-bold text-white hover:bg-go-deep disabled:opacity-40">
              {state === "sending" ? "שולח…" : "שליחה"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
