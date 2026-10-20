import type { ReactNode } from "react";

/** Small grey label above a form control. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[14px] font-semibold text-muted">{label}{children}</label>;
}
