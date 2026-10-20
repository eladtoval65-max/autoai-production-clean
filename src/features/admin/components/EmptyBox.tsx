/** Dashed placeholder box for empty lists. */
export function EmptyBox({ text }: { text: string }) {
  return <div className="mt-5 rounded-2xl border-2 border-dashed border-line bg-white px-6 py-12 text-center text-muted">{text}</div>;
}
