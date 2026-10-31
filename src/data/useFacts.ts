/**
 * Loads sourced facts for a page and re-renders when they arrive.
 * useFacts("toyota") loads one make (model pages); useFacts() loads all (questionnaire, guides).
 * Returns a counter that changes on every load, for use in useMemo dependencies.
 */
import { useEffect, useState } from "react";
import { factsLoaded, loadAllFacts, loadMakeFacts, onFactsLoaded } from "./facts";

export function useFacts(makeId?: string): { ready: boolean; version: number } {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const off = onFactsLoaded(() => setVersion((v) => v + 1));
    void (makeId ? loadMakeFacts(makeId) : loadAllFacts());
    return off;
  }, [makeId]);
  return { ready: factsLoaded(makeId), version };
}
