import { AlertTriangle } from "lucide-react";
import { ISSUE_LEVEL_HE, type Issue, type IssueLevel } from "../../../../data/facts";
import { SourceLink } from "./SourceLink";

const LEVEL_STYLE: Record<IssueLevel, string> = {
  recall: "bg-[#fde8e8] text-[#9b1c1c]",
  manufacturer: "bg-[#fff1d6] text-[#8a4b00]",
  widely_reported: "bg-mist text-ink",
};

/**
 * "Known issues + what to check" box. Specific, sourced issues first (labelled recall / maker-acknowledged /
 * widely reported — never a diagnosis), then the general pre-purchase checks.
 */
export function IssuesList({ issues, checks }: { issues: Issue[]; checks: string[] }) {
  return (
    <div className="mt-4 rounded-xl bg-[#fff8ef] p-4">
      <p className="flex items-center gap-2 text-[15px] font-bold"><AlertTriangle className="h-4 w-4 text-alert" aria-hidden />{issues.length ? "בעיות מוכרות ומה לבדוק לפני קנייה" : "מה לבדוק לפני קנייה"}</p>
      {issues.length > 0 && (
        <ul className="mt-3 space-y-2.5">
          {issues.map((it) => (
            <li key={it.he} className="text-[15px] leading-relaxed">
              <span className={`me-2 inline-block rounded-full px-2 py-0.5 text-[12px] font-bold ${LEVEL_STYLE[it.level]}`}>{ISSUE_LEVEL_HE[it.level]}</span>
              {it.he}
              {it.scope && <span className="text-muted"> ({it.scope})</span>}{" "}
              <SourceLink source={it.source} />
            </li>
          ))}
        </ul>
      )}
      <p className={`${issues.length ? "mt-4" : "mt-2"} text-[13px] font-bold text-muted`}>{issues.length ? "ובכל מקרה:" : ""}</p>
      <ul className="mt-1 list-disc space-y-1 ps-5 text-[15px]">{checks.map((c) => <li key={c}>{c}</li>)}</ul>
      {issues.length > 0 && <p className="mt-3 text-[12px] text-muted">הבעיות מבוססות על קריאות שירות רשמיות ודיווחים נרחבים של בעלי רכב ומגזינים. לא כל רכב סובל מהן — זו רשימה למה לבדוק, לא אבחנה.</p>}
    </div>
  );
}
