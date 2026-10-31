/**
 * Hebrew labels for codes stored in the database. Keys must match the server's allowed values (server/admin/constants.ts).
 */
export const LEAD_TYPE: Record<string, string> = { vehicle: "בירור על רכב", financing: "מימון", insurance: "ביטוח", trade_in: "טרייד-אין", used_car: "יד שנייה", test_drive: "נסיעת מבחן", leasing: "ליסינג" };
export const TIMELINE: Record<string, string> = { now: "בקרוב", three_months: "3 חודשים", later: "בהמשך השנה", unsure: "לא החליט/ה" };
export const STATUS: Record<string, string> = { new: "חדש", contacted: "נוצר קשר", qualified: "רלוונטי", sent_to_partner: "הועבר לשותף", won: "נסגרה עסקה", lost: "לא רלוונטי", closed: "סגור" };
export const STATUS_TONE: Record<string, string> = {
  new: "bg-go-soft text-go-deep", contacted: "bg-[#e8f0fb] text-[#1f5fae]", qualified: "bg-[#efeafc] text-[#4b3bb0]", sent_to_partner: "bg-[#fff1df] text-[#9a4b00]",
  won: "bg-go text-white", lost: "bg-mist text-muted", closed: "bg-mist text-muted",
};
export const NOTE_KIND: Record<string, string> = { note: "הערה", call: "שיחה", whatsapp: "וואטסאפ", email: "מייל", meeting: "פגישה", status: "סטטוס", partner: "שותף" };
export const PARTNER_TYPE: Record<string, string> = { dealer: "סוכנות", importer: "יבואן", finance: "מימון", insurance: "ביטוח", inspection: "בדיקת רכב", trade_in: "טרייד-אין", used_lot: "מגרש יד 2", leasing: "חברת ליסינג", other: "אחר" };
export const PARTNER_OUTCOME: Record<string, string> = { contacted: "דיברו איתו", no_answer: "לא עונה", invalid: "פנייה לא תקינה — ביקש זיכוי", won: "נסגרה עסקה", lost: "לא רלוונטי" };
export const FUNNEL_STEP: Record<string, string> = { visit: "כניסות לאתר", quiz_start: "התחילו שאלון", quiz_complete: "סיימו שאלון", results_view: "צפו בתוצאות", lead_open: "פתחו טופס", lead_submit: "השאירו פרטים" };

/** Statuses after which no follow-up reminder is "due". */
export const CLOSED_STATUSES = ["won", "lost", "closed"];
