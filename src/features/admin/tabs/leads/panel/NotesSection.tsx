import { useState, type FormEvent } from "react";
import { when } from "../../../format";
import { NOTE_KIND, STATUS } from "../../../labels";
import { btnGo } from "../../../styles";
import type { Note } from "../../../types";

const COMPOSER_KINDS = ["call", "whatsapp", "email", "meeting", "note"];

/** Status-change entries store the status code; show it as a sentence. */
const noteText = (n: Note) => (n.kind === "status" ? `הסטטוס שונה ל״${STATUS[n.body] ?? n.body}״` : n.body);

/** Log a call/message/meeting/note, and the lead's full history (newest first) as a timeline. */
export function NotesSection({ notes, onAdd }: { notes: Note[]; onAdd: (kind: string, body: string) => Promise<boolean> }) {
  const [kind, setKind] = useState("call");
  const [body, setBody] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (body.trim() && (await onAdd(kind, body))) setBody("");
  }
  return (
    <section>
      <h3 className="text-[17px]">תיעוד שיחה או הערה</h3>
      <form onSubmit={submit} className="mt-2 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {COMPOSER_KINDS.map((k) => (
            <button type="button" key={k} onClick={() => setKind(k)} aria-pressed={kind === k}
              className={`min-h-9 rounded-full border px-3 text-[14px] font-bold ${kind === k ? "border-go bg-go-soft text-go-deep" : "border-line bg-white"}`}>{NOTE_KIND[k]}</button>
          ))}
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={4000} placeholder="מה נאמר? מה הצעד הבא?" className="block w-full rounded-xl border border-line p-3 text-[16px] outline-none focus:border-go" />
        <button type="submit" disabled={!body.trim()} className={btnGo}>הוספה להיסטוריה</button>
      </form>
      <ol className="mt-4 space-y-3 border-s-2 border-line ps-4">
        {notes.length === 0 && <li className="text-[14px] text-muted">אין עדיין היסטוריה.</li>}
        {notes.map((n) => (
          <li key={n.id} className="relative">
            <span className="absolute -start-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-go" aria-hidden />
            <p className="text-[13px] text-muted"><b className="text-ink">{NOTE_KIND[n.kind] ?? n.kind}</b> · {when(n.createdAt)}</p>
            <p className="whitespace-pre-wrap text-[15px]">{noteText(n)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
