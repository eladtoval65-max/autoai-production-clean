/**
 * Side effects when the questionnaire is completed (or the top pick changes after completion):
 * remember the top pick in history, log the funnel step, and save the search for signed-in users.
 */
import { useEffect, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { trimOf } from "../model/cost";
import { track } from "../model/tracking";
import type { Answers, Ranked } from "../types";

export function useQuizCompletion(complete: boolean, leader: Ranked | undefined, answers: Answers, pushHistory: (id: string) => void) {
  const { isAuthenticated } = useAuth();
  const saveSearch = trpc.searches.create.useMutation();
  const sessionId = useMemo(() => `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`, []);

  useEffect(() => {
    if (!complete || !leader) return;
    pushHistory(leader.id);
    track("quiz_completed");
    if (isAuthenticated) {
      saveSearch.mutate({ sessionId, answers: answers as unknown as Record<string, unknown>, topMatchTrimId: trimOf(leader.id), topMatchScore: leader.match });
    }
    // Run once per completion / per new top pick, not on every answer change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete, leader?.id]);
}
