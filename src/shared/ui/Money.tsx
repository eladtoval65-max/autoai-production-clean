import { shekel, useLang } from "../i18n";
import { CodeChip } from "./CodeChip";

/** A shekel amount, or a "missing" badge when the value is unknown. */
export function Money({ v, size }: { v: number | null | undefined; size?: number }) {
  const { nf } = useLang();
  if (v == null) return <CodeChip code="miss" />;
  return <span className="num" style={size ? { fontSize: size } : undefined}>{shekel(v, nf)}</span>;
}
