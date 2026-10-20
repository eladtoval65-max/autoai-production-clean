/**
 * The questionnaire: step order, defaults and the answer options (Hebrew + English).
 */
import { BatteryCharging, Building2, CircleDashed, Fuel, Gauge, MapPin, Milestone, PlugZap, Route, ShieldCheck, Sofa, Users, Wrench } from "lucide-react";
import type { Answers, Choice, StepKey } from "../types";

/** Full (5 steps) and quick (3 steps) question orders. */
export const FULL_STEPS: StepKey[] = ["budget", "use", "priority", "fuel", "annualKm"];
export const QUICK_STEPS: StepKey[] = ["budget", "use", "fuel"];

/** Steps where several answers can be picked, followed by an explicit "Continue". */
export const MULTI_STEPS = new Set<StepKey>(["use", "priority", "fuel"]);

/** Starting answers (mid budget, 15,000 km/yr). */
export const EMPTY_ANSWERS: Answers = { budget: 180000, use: [], priority: [], fuel: [], family: "", annualKm: 15000, annualKmBand: "mid" };

/** Yearly km used for each mileage band. */
export const KM_FOR_BAND = { low: 7000, mid: 15000, high: 25000 } as const;

/** Answer options per step. Budget brackets match today's new-car list prices. */
export const CHOICES: Record<StepKey, Choice[]> = {
  budget: [
    { value: 145000, amount: "≤145K", he: ["עד ₪145,000", "רכבי עיר וקרוסאוברים קטנים"], en: ["Up to ₪145,000", "City cars and small crossovers"] },
    { value: 180000, amount: "145–180K", he: ["₪145,000 עד ₪180,000", "רוב הקרוסאוברים המשפחתיים"], en: ["₪145,000–180,000", "Most family crossovers"] },
    { value: 220000, amount: "180–220K", he: ["₪180,000 עד ₪220,000", "SUV משפחתי וחשמליות מרווחות"], en: ["₪180,000–220,000", "Family SUVs and roomy EVs"] },
    { value: 260000, amount: "220K+", he: ["מעל ₪220,000", "7 מקומות, פרימיום וחשמליות גדולות"], en: ["Over ₪220,000", "7 seats, premium and large EVs"] },
  ],
  use: [
    { value: "city", icon: Building2, he: ["עיר ויום-יום", "חניה קלה, חיסכון וזריזות"], en: ["City and daily errands", "Easy parking, economy, agility"] },
    { value: "family", icon: Users, he: ["משפחה וטיולים", "מרחב, בטיחות ונוחות"], en: ["Family and trips", "Space, safety, comfort"] },
    { value: "highway", icon: Route, he: ["הרבה כביש מהיר", "שקט, יציבות ותא מטען"], en: ["Lots of highway", "Quiet, stability, boot space"] },
    { value: "fun", icon: Gauge, he: ["הנאה מנהיגה", "אופי, ביצועים ותחושה"], en: ["Driving enjoyment", "Character and performance"] },
  ],
  priority: [
    { value: "reliable", icon: Wrench, he: ["אמינות ושקט נפשי", "פחות הפתעות במוסך"], en: ["Reliability", "Fewer surprises at the garage"] },
    { value: "economy", icon: Fuel, he: ["חיסכון בדלק", "עלות שוטפת נמוכה"], en: ["Fuel economy", "Low running cost"] },
    { value: "safety", icon: ShieldCheck, he: ["בטיחות", "מערכות ומבנה שמגנים"], en: ["Safety", "Systems and structure that protect"] },
    { value: "comfort", icon: Sofa, he: ["נוחות ואבזור", "נעים בכל נסיעה"], en: ["Comfort and equipment", "Pleasant on every drive"] },
  ],
  fuel: [
    { value: "any", icon: CircleDashed, he: ["פתוח/ה להכול", "תנו לי את ההתאמה הטובה ביותר"], en: ["Open to anything", "Give me the best fit"] },
    { value: "hybrid", icon: BatteryCharging, he: ["היברידי", "חיסכון חכם, במיוחד בעיר"], en: ["Hybrid", "Smart savings, especially in town"] },
    { value: "petrol", icon: Fuel, he: ["בנזין", "פשוט, מוכר וזמין"], en: ["Petrol", "Simple and familiar"] },
    { value: "electric", icon: PlugZap, he: ["חשמלי", "שקט, עלות אנרגיה אחרת"], en: ["Electric", "Quiet, different energy costs"] },
  ],
  annualKm: [
    { value: "low", icon: MapPin, he: ["עד 10,000 ק״מ", "נסיעות קצרות, בעיקר בעיר"], en: ["Up to 10,000 km", "Short trips, mostly town"] },
    { value: "mid", icon: Milestone, he: ["10,000–20,000 ק״מ", "שימוש ממוצע ומעורב"], en: ["10,000–20,000 km", "Average, mixed use"] },
    { value: "high", icon: Route, he: ["מעל 20,000 ק״מ", "הרבה כביש מהיר"], en: ["Over 20,000 km", "Lots of highway"] },
  ],
};
