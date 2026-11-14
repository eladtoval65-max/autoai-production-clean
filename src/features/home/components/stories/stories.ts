/**
 * Home-page stories (Instagram-style): short, tap-through slides that hook a visitor and send them one tap deeper.
 * Bubbles are static; slide numbers are computed from the live catalog only when a story opens.
 */
import { BUDGETS, budgetLabel, budgetPicks } from "../../../budget/model/budgetPicks";
import { compareLease, defaultsFor, usedAlternative } from "../../../leasing/model/leasing";
import { shortName } from "../../../../shared/format";

export type Slide = { kicker: string; big?: string; title: string; sub?: string; cta?: { text: string; href: string } };
export type Story = { id: string; label: string; ring: string; build: () => Slide[] };

const nf = new Intl.NumberFormat("he-IL");
const money = (n: number) => `₪${nf.format(Math.round(n))}`;

/** Budget story: cover → cheapest new to run → cheapest used to run → link to the full list. */
function budgetStory(b: number): Story {
  const label = budgetLabel(b);
  return {
    id: `b${b}`, label: `עד ${label}`, ring: "#ff7a1a",
    build: () => {
      const { fresh, used } = budgetPicks(b, 3);
      const href = `/budget/${b}`;
      const slides: Slide[] = [{ kicker: "לפי תקציב", big: label, title: `מה הכי זול להחזיק עד ${label}?`, sub: "לא לפי מחיר — לפי כמה זה עולה כל חודש." }];
      if (fresh[0]) slides.push({ kicker: "חדש", big: money(fresh[0].monthly), title: `${shortName(fresh[0].car.make)}`, sub: `בחודש, מכל הרכבים החדשים עד ${label}. ${fresh.slice(1).map((p) => `${shortName(p.car.make)} ${money(p.monthly)}`).join(" · ")}` });
      if (used[0]) slides.push({ kicker: "יד שנייה", big: money(used[0].monthly), title: `${shortName(used[0].car.make)} ${used[0].car.years.split(" · ")[0]}`, sub: `בחודש (הערכה). ${used.slice(1).map((p) => `${shortName(p.car.make)} ${money(p.monthly)}`).join(" · ")}` });
      slides.push({ kicker: "הרשימה המלאה", title: `כל הרכבים עד ${label}`, sub: "מדורגים לפי עלות חודשית אמיתית, חדשים ויד שנייה.", cta: { text: `לרכבים עד ${label}`, href } });
      return slides;
    },
  };
}

/** New vs 3-year-old used vs leasing for a typical ₪150K family car. */
const choose: Story = {
  id: "choose", label: "חדש / יד 2 / ליסינג", ring: "#0a7c59",
  build: () => {
    const price = 150000;
    const d = defaultsFor(price);
    const base = { price, months: 36, leaseDown: 0, leaseMonthly: 0, leaseIncludesInsurance: false, leaseIncludesMaintenance: true, buyDown: price, loanRate: 0, ...d };
    const fresh = compareLease(base).buy;
    const used = usedAlternative(base);
    return [
      { kicker: "השאלה הגדולה", title: "חדש, יד שנייה או ליסינג?", sub: "רכב משפחתי של ₪150,000, ל־3 שנים. מה יוצא זול יותר?" },
      { kicker: "חדש", big: money(fresh.monthly), title: "בחודש בממוצע", sub: `רוב הסכום הוא ירידת ערך: כ־${money(fresh.valueLoss)} ב־3 שנים. (הערכה, בלי דלק)` },
      { kicker: `אותו דגם בן 3`, big: money(used.monthly), title: "בחודש בממוצע", sub: `מישהו אחר כבר ספג את השנים היקרות. חיסכון של כ־${money((fresh.monthly - used.monthly) * 36)} ב־3 שנים.` },
      { kicker: "ליסינג?", title: "תלוי בהצעה שקיבלתם", sub: "הכניסו אותה במחשבון — ונראה מול חדש ויד שנייה, באותם מספרים.", cta: { text: "למחשבון ההשוואה", href: "/new-used-leasing" } },
    ];
  },
};

export const STORIES: Story[] = [...BUDGETS.map(budgetStory), choose];
