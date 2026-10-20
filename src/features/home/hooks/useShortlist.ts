/**
 * The user's lists: saved cars (persisted), recently-top history (persisted) and the compare selection (max 3).
 */
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLang } from "../../../shared/i18n";
import { track } from "../model/tracking";

/** Read a JSON array from localStorage safely (private mode / corrupted data → empty). */
const readList = (key: string): string[] => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
const writeList = (key: string, v: string[]) => { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ } };

export const MAX_COMPARE = 3;

export function useShortlist(onOpenCompare: () => void) {
  const { lang, t } = useLang();
  const he = lang === "he";
  const [saved, setSaved] = useState<string[]>(() => readList("carai-saved"));
  const [history, setHistory] = useState<string[]>(() => readList("carai-history"));
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => writeList("carai-saved", saved), [saved]);

  function toggleSaved(id: string) {
    const has = saved.includes(id);
    track(has ? "saved_removed" : "saved_added");
    setSaved((p) => (has ? p.filter((x) => x !== id) : [...p, id]));
    toast(has ? t.removedToast : t.savedToast);
  }

  /** Remember the current top pick (most recent first, max 8). */
  function pushHistory(id: string) {
    setHistory((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 8);
      writeList("carai-history", next);
      return next;
    });
  }

  /** Add/remove a car from the comparison. From the 2nd car on, the toast offers "Compare now". */
  function toggleCompare(id: string) {
    const has = compare.includes(id);
    track(has ? "compare_removed" : "compare_added");
    if (has) { setCompare(compare.filter((x) => x !== id)); return; }
    if (compare.length >= MAX_COMPARE) { toast(t.compareMax); return; }
    const next = [...compare, id];
    setCompare(next);
    if (next.length >= 2) {
      toast(he ? `נוסף להשוואה (${next.length}/${MAX_COMPARE})` : `Added to compare (${next.length}/${MAX_COMPARE})`,
        { action: { label: he ? "השוו עכשיו" : "Compare now", onClick: onOpenCompare } });
    } else {
      toast(he ? "נוסף להשוואה. בחרו עוד רכב אחד לפחות" : "Added. Pick at least one more car");
    }
  }

  return { saved, history, compare, toggleSaved, pushHistory, toggleCompare };
}
