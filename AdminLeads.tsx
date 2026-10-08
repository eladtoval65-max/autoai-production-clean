import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

function csvCell(value: unknown) {
  const text = String(value ?? "").replace(/[\r\n]+/g, " ");
  // Prevent spreadsheet formula injection when contact details are opened in Excel.
  const safe = /^[=+@\-\t]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export default function AdminLeads() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data, error, isLoading } = trpc.leads.list.useQuery({ limit: 100 }, { enabled: isAdmin, retry: false });
  const download = () => {
    if (!data?.length) return;
    const rows = [
      ["מספר", "שם", "טלפון", "עיר", "סוג פנייה", "דגם", "תקציב", "מועד רכישה", "סטטוס", "תאריך", "נוסח הסכמה", "זמן הסכמה"],
      ...data.map(row => [row.id, row.fullName, row.phone, row.city, row.leadType, row.vehicleLabel, row.budget, row.purchaseTimeline, row.status, row.createdAt?.toISOString(), row.consentText, row.consentAt?.toISOString()]),
    ];
    const csv = "\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\r\n");
    const href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = href;
    link.download = `autoai-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  };

  return <main dir="rtl" className="min-h-screen bg-[#0b0e12] px-5 py-10 text-[#edf2f7]">
    <div className="mx-auto max-w-5xl">
      <Link href="/" className="text-sm text-[#79b9ff]">← חזרה לאתר</Link>
      <h1 className="mt-8 text-3xl font-semibold">פניות AutoAI</h1>
      <p className="mt-2 text-sm text-[#aab6c2]">פניות נשמרות כאן לטיפול פנימי בלבד. אין העברה אוטומטית לשותפים.</p>
      {loading ? <p className="mt-8">בודקים הרשאות…</p> : !isAdmin ? <p className="mt-8 border border-[#37414b] p-6">העמוד זמין למנהלי המערכת בלבד.</p> : <>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4"><p>{isLoading ? "טוענים פניות…" : `${data?.length ?? 0} פניות אחרונות`}</p><button onClick={download} disabled={!data?.length} className="border border-[#79b9ff] px-4 py-2 text-sm text-[#79b9ff] disabled:opacity-40">ייצוא CSV</button></div>
        {error && <p role="alert" className="mt-4 text-red-300">לא הצלחנו לטעון פניות. בדקו הרשאות וחיבור למסד הנתונים.</p>}
        <div className="mt-5 overflow-x-auto border border-[#37414b]"><table className="w-full min-w-[850px] text-right text-sm"><thead className="bg-[#19212a]"><tr>{["#", "שם", "טלפון", "עיר", "עניין", "רכב", "סטטוס", "נוצר"].map(column => <th key={column} className="p-3">{column}</th>)}</tr></thead><tbody>{data?.map(row => <tr key={row.id} className="border-t border-[#37414b]"><td className="p-3">{row.id}</td><td className="p-3">{row.fullName}</td><td className="p-3" dir="ltr">{row.phone}</td><td className="p-3">{row.city || "—"}</td><td className="p-3">{row.leadType}</td><td className="p-3">{row.vehicleLabel}</td><td className="p-3">{row.status}</td><td className="p-3">{row.createdAt.toLocaleDateString("he-IL")}</td></tr>)}</tbody></table></div>
        {!isLoading && !data?.length && !error && <p className="mt-6 text-[#aab6c2]">עדיין אין פניות.</p>}
        <p className="mt-4 text-xs text-[#8f9aa8]">CSV כולל פרטים אישיים. שמרו אותו במקום מוגן ואל תשתפו ללא הסכמה מתאימה.</p>
      </>}
    </div>
  </main>;
}
