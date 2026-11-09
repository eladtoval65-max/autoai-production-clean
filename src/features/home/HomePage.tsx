/**
 * Home page ("/"): questionnaire → ranked recommendations → compare / details → consented lead.
 * This file only wires state and sections together; each section lives in ./components, logic in ./model and ./hooks.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import LeadRequestModal from "../leads/LeadRequestModal";
import { sendEvent } from "../../shared/analytics";
import { shortName, ten } from "../../shared/format";
import { useLang } from "../../shared/i18n";
import { Advisor } from "./components/advisor/Advisor";
import { CompareTray } from "./components/compare/CompareTray";
import { Hero } from "./components/Hero";
import { HomeFooter } from "./components/HomeFooter";
import { HomeHeader } from "./components/HomeHeader";
import { Legend } from "./components/Legend";
import { MoreTools } from "./components/MoreTools";
import { OfferBar } from "./components/OfferCta";
import { PlateCheck } from "./components/plate/PlateCheck";
import { Workspace } from "./components/workspace/Workspace";
import { useCatalog } from "./hooks/useCatalog";
import { useQuiz } from "./hooks/useQuiz";
import { useQuizCompletion } from "./hooks/useQuizCompletion";
import { useShortlist } from "./hooks/useShortlist";
import { computeScore } from "./model/scoring";
import { quizSummary } from "./model/quizSummary";
import { shareText } from "./model/share";
import { track } from "./model/tracking";
import type { Car, Ranked, Tab } from "./types";

export default function HomePage() {
  const { lang, t, dir } = useLang();
  const quiz = useQuiz();
  const cars = useCatalog(quiz.answers);
  const [tab, setTab] = useState<Tab>("results");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showLead, setShowLead] = useState(false);
  const [plateLead, setPlateLead] = useState<string | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  /** Switch tab and bring the workspace into view. */
  const goTo = (next: Tab) => { setTab(next); setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30); };
  const shortlist = useShortlist(() => goTo("compare"));

  // Every car scored against the current answers, best first.
  const ranked = useMemo<Ranked[]>(() => cars.map((c) => ({ ...c, match: computeScore(c, quiz.answers) })).sort((a, b) => b.match - a.match), [cars, quiz.answers]);
  const leader = ranked[0];
  const detailCar = ranked.find((c) => c.id === selectedId) ?? leader;

  useQuizCompletion(quiz.complete, leader, quiz.answers, shortlist.pushHistory);
  useEffect(() => { sendEvent("visit"); }, []);
  useEffect(() => { if (showLead || plateLead) sendEvent("lead_open", "home", false); }, [showLead, plateLead]);

  const showResults = () => { track("results_viewed"); goTo("results"); };
  const openDetail = (id: string) => { setSelectedId(id); goTo("detail"); };
  const resetQuiz = () => { quiz.reset(); setTab("results"); };

  async function shareTopPick() {
    if (!leader) return;
    const result = await shareText(lang === "he" ? "כמה עולה" : "CamaOla", t.shareText(shortName(leader.make), ten(leader.match)));
    if (result === "copied") toast(t.copiedToast);
  }

  const trayCars = shortlist.compare.map((id) => cars.find((c) => c.id === id)).filter((c): c is Car => Boolean(c));
  const showTray = trayCars.length > 0 && tab !== "compare";
  const showOfferBar = (quiz.step > 0 || quiz.complete) && !showTray && !showLead && !plateLead;
  // Results appear only once there is something to show — a first visit sees just the headline, search and questionnaire.
  const showWorkspace = quiz.complete || tab !== "results" || shortlist.saved.length > 0 || shortlist.compare.length > 0;

  return (
    <main dir={dir} lang={lang} className="min-h-screen bg-page text-ink">
      <HomeHeader />
      <Hero quiz={{ ...quiz, reset: resetQuiz }} leader={leader} onResults={showResults} onLead={() => setShowLead(true)} />
      {showWorkspace && <Workspace sectionRef={resultsRef} tab={tab} setTab={setTab} cars={cars} ranked={ranked} leader={leader} detailCar={detailCar}
        answers={quiz.answers} setAnswers={quiz.setAnswers} complete={quiz.complete}
        saved={shortlist.saved} history={shortlist.history} compare={shortlist.compare}
        toggleSaved={shortlist.toggleSaved} toggleCompare={shortlist.toggleCompare}
        onDetails={openDetail} onShare={shareTopPick} onLead={() => setShowLead(true)} />}
      {showTray && <div aria-hidden className="h-20" /> /* room so the tray never covers the last content */}
      {/* Offer bar: from the first answer on, the current best car and "get an offer" stay on screen (the compare tray takes its place when open). */}
      {showOfferBar && leader && <><div aria-hidden className="h-20" /><OfferBar car={leader} km={quiz.answers.annualKm} onLead={() => setShowLead(true)} /></>}
      {showTray && <CompareTray cars={trayCars} onRemove={shortlist.toggleCompare} onOpen={() => goTo("compare")} />}
      <MoreTools plate={<div className="pt-6"><PlateCheck cars={cars} km={quiz.answers.annualKm} onLead={setPlateLead} onDetails={openDetail} /></div>} legend={<Legend />} advisor={<Advisor />} />
      <HomeFooter />

      {showLead && leader && (
        <LeadRequestModal vehicle={tab === "detail" && detailCar ? detailCar : leader} budget={quiz.answers.budget}
          sourcePage={tab === "detail" ? "vehicle_details" : tab === "compare" ? "comparison" : "recommendations"}
          quizSummary={quiz.step > 0 || quiz.complete ? quizSummary(quiz.answers) : undefined} onClose={() => setShowLead(false)} />
      )}
      {plateLead && <LeadRequestModal vehicle={{ id: "plate", make: plateLead, match: 0 }} budget={quiz.answers.budget} sourcePage="plate_check" defaultType="used_car" onClose={() => setPlateLead(null)} />}
    </main>
  );
}
