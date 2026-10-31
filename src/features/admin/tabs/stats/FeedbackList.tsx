/** "מה חסר לך?" messages from visitors, newest first, with delete. */
import { useEffect, useState } from "react";
import { adminApi, errorText } from "../../api";

type Item = { id: number; message: string; page: string | null; email: string | null; createdAt: string };

export function FeedbackList() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState("");
  const load = () => adminApi<{ items: Item[] }>("feedback").then((r) => (r.ok ? setItems(r.data.items) : setError(errorText(r))));
  useEffect(() => { void load(); }, []);
  async function remove(id: number) { const r = await adminApi("feedbackDelete", { id }); if (r.ok) setItems((x) => x?.filter((i) => i.id !== id) ?? null); }

  return (
    <section className="rounded-2xl border border-line bg-white p-5">
      <h2 className="text-lg">משוב מגולשים {items ? `(${items.length})` : ""}</h2>
      {error && <p role="alert" className="mt-2 text-alert">{error}</p>}
      {items && !items.length && <p className="mt-2 text-[14px] text-muted">עוד אין משוב. הכפתור ״מה חסר לך?״ מופיע בצד כל עמוד באתר.</p>}
      <ul className="mt-3 space-y-3">
        {items?.map((i) => (
          <li key={i.id} className="rounded-xl bg-mist p-3 text-[15px]">
            <p className="whitespace-pre-wrap">{i.message}</p>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-3 text-[13px] text-muted">
              <span>{new Date(i.createdAt).toLocaleString("he-IL")}</span>{i.page && <span dir="ltr">{i.page}</span>}
              {i.email && <a href={`mailto:${i.email}`} dir="ltr">{i.email}</a>}
              <button onClick={() => remove(i.id)} className="ms-auto font-semibold text-alert">מחיקה</button>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
