import { COLLECTION_NOTICE } from "@shared/leadPolicy";

/**
 * "What happens with my details?" — the notice required at the point of collection
 * (voluntary, purpose, who holds it, who receives it, your rights). Text lives in leadPolicy.ts.
 * Collapsed by default so the form stays short, but always one tap away before sending.
 */
export function CollectionNotice() {
  return (
    <details className="rounded-xl bg-mist px-3 py-2 text-[14px] leading-6 text-muted">
      <summary className="cursor-pointer font-semibold text-ink">מה קורה עם הפרטים?</summary>
      <dl className="mt-2 space-y-1.5">
        {COLLECTION_NOTICE.map((item) => (
          <div key={item.title}><dt className="inline font-semibold text-ink">{item.title} </dt><dd className="inline">{item.text}</dd></div>
        ))}
      </dl>
    </details>
  );
}
