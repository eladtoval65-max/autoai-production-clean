/**
 * Lead panel: where the lead came from, what exactly the customer agreed to (and which text version),
 * why it scored what it scored, plus the two privacy actions — consent certificate and erase details.
 */
import { FileCheck2, UserX } from "lucide-react";
import { leadQuality } from "@shared/leadPolicy";
import { adminApi } from "../../../api";
import { when } from "../../../format";
import type { Lead } from "../../../types";

type Run = (action: string, body: Record<string, unknown>, okText: string) => Promise<boolean>;

/** Downloads the plain-text consent certificate (server/admin/consentProof.ts) to send along with the lead. */
async function downloadCertificate(id: number) {
  const r = await adminApi<{ certificate: string }>("consentProof", undefined, { id: String(id) });
  if (!r.ok) return window.alert("לא הצלחנו להפיק תעודה.");
  const href = URL.createObjectURL(new Blob(["﻿" + r.data.certificate], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = href;
  a.download = `camaola-consent-${id}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

/** Score with its reasons, recomputed from the stored fields so the explanation always matches the rules. */
function QualityLine({ lead }: { lead: Lead }) {
  if (lead.qualityScore == null) return null;
  const { reasons } = leadQuality({
    purchaseTimeline: lead.purchaseTimeline as "now", budget: lead.budget, trimId: lead.trimId, city: lead.city,
    matchScore: lead.matchScore, partnerOptIn: Number(lead.partnerOptIn) === 1, isDuplicate: Boolean(lead.duplicateOfId),
  });
  return <p className="mt-2"><b>ציון איכות {lead.qualityScore}:</b> <span className="text-muted">{reasons.join(" · ") || "בסיסי"}</span></p>;
}

export function ConsentSection({ lead, run }: { lead: Lead; run: Run }) {
  const optIn = Number(lead.partnerOptIn) === 1;
  async function anonymize() {
    if (window.confirm("למחוק את השם, הטלפון והעיר של הפונה (לבקשתו)? הפנייה תישאר בסטטיסטיקה בלי פרטים מזהים. אי אפשר לבטל.")) {
      await run("leadAnonymize", { confirm: true }, "פרטי הקשר נמחקו");
    }
  }
  return (
    <section className="space-y-3 rounded-2xl bg-mist p-4 text-[14px]">
      <p><b>מקור:</b> {lead.sourcePage}{lead.landingSlug && ` · /go/${lead.landingSlug}`}{lead.utmSource && ` · ${lead.utmSource}`}{lead.utmMedium && ` / ${lead.utmMedium}`}{lead.utmCampaign && ` · ${lead.utmCampaign}`}</p>
      <QualityLine lead={lead} />
      {lead.duplicateOfId && <p className="font-semibold text-alert">פנייה חוזרת: אותו טלפון כבר פנה בפנייה #{lead.duplicateOfId}. לא למכור פעמיים.</p>}
      <p><b>הסכמה לפנייה חוזרת</b> ({when(lead.consentAt)}{lead.consentVersion && ` · נוסח ${lead.consentVersion}`}): <span className="text-muted">{lead.consentText}</span></p>
      <p><b>הסכמה נפרדת להעברה לעסק:</b> {optIn ? <span className="text-go-deep">ניתנה בטופס — {lead.partnerOptInText}</span> : <span className="text-muted">לא ניתנה בטופס.</span>}</p>
      {lead.anonymizedAt
        ? <p className="font-semibold">פרטי הקשר נמחקו ב־{when(lead.anonymizedAt)}.</p>
        : <div className="flex flex-wrap gap-3 pt-1">
            <button onClick={() => downloadCertificate(lead.id)} className="inline-flex items-center gap-2 font-bold text-go-deep underline"><FileCheck2 className="h-4 w-4" />תעודת הסכמה (לשותף)</button>
            <button onClick={anonymize} className="inline-flex items-center gap-2 font-bold text-alert underline"><UserX className="h-4 w-4" />מחיקת פרטי קשר לבקשת הלקוח</button>
          </div>}
    </section>
  );
}
