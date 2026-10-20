import { card } from "../../../../shared/styles";
import { money, num } from "../../format";
import type { Stats } from "../../types";
import { pct1 } from "./statsModel";

/** Five headline numbers: leads, visit→lead conversion, deals won, partner revenue, follow-ups due. */
export function KpiTiles({ stats }: { stats: Stats }) {
  const total = stats.byStatus.reduce((a, r) => a + Number(r.n), 0);
  const won = Number(stats.byStatus.find((r) => r.k === "won")?.n ?? 0);
  const visits = stats.funnel[0]?.n ?? 0;
  const submits = stats.funnel[stats.funnel.length - 1]?.n ?? 0;
  const conv = pct1(submits, visits);
  const tiles: [string, string, string?][] = [
    ["לידים", num(total)],
    ["המרה מביקור לליד", conv == null ? "—" : `${conv}%`, visits ? `${num(submits)} מתוך ${num(visits)} מבקרים` : "עוד אין מספיק ביקורים"],
    ["עסקאות שנסגרו", num(won), total ? `${Math.round((won / total) * 100)}% מהלידים` : undefined],
    ["הכנסה משותפים", money(Number(stats.money.paid)), `פתוח לגבייה: ${money(Number(stats.money.owed))}`],
    ["לחזור היום", num(stats.followUpsDue)],
  ];
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {tiles.map(([k, v, sub]) => (
        <div key={k} className={`${card} p-4`}><dt className="text-[14px] text-muted">{k}</dt><dd className="num mt-1 text-[1.9rem] leading-none">{v}</dd>{sub && <dd className="mt-2 text-[13px] text-muted">{sub}</dd>}</div>
      ))}
    </dl>
  );
}
