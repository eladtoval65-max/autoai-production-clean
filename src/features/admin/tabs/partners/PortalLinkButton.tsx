/**
 * Creates the partner's secret portal link (shown once, then only its hash is stored). A new link revokes the old one.
 * The key goes after "#", so it never reaches server logs.
 */
import { useState } from "react";
import { adminApi, errorText } from "../../api";
import type { Partner } from "../../types";

export function PortalLinkButton({ partner, onDone }: { partner: Partner; onDone: () => void }) {
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState("");
  async function create() {
    if (Number(partner.hasPortal) && !window.confirm("ליצור קישור חדש? הקישור הקודם יפסיק לעבוד.")) return;
    const r = await adminApi<{ key: string }>("partnerPortalLink", { id: partner.id });
    if (!r.ok) { setMsg(errorText(r)); return; }
    setLink(`${window.location.origin}/partner#k=${r.data.key}`);
    onDone();
  }
  async function copy() { await navigator.clipboard.writeText(link).catch(() => null); setMsg("הועתק"); }
  if (link) return (
    <div className="max-w-[18rem] text-[13px]">
      <p className="font-semibold">קישור לאזור השותף (מוצג פעם אחת):</p>
      <input readOnly value={link} dir="ltr" className="mt-1 w-full rounded-lg border border-line px-2 py-1 text-[12px]" onFocus={(e) => e.currentTarget.select()} />
      <button onClick={copy} className="mt-1 font-bold text-go-deep underline">העתקה</button> <span role="status" className="text-muted">{msg}</span>
    </div>
  );
  return <span className="text-[13px]"><button onClick={create} className="font-bold text-go-deep underline">{Number(partner.hasPortal) ? "קישור חדש לאזור שותף" : "אזור שותף: יצירת קישור"}</button> <span role="status" className="text-alert">{msg}</span></span>;
}
