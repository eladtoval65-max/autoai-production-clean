/** Dashed placeholder box for empty lists ("no saved cars yet"). */
export function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border-2 border-dashed border-line bg-mist px-6 py-12 text-center text-[16px] text-muted">{text}</div>;
}
