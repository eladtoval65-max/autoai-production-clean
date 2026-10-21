import type { Source } from "../../../../data/facts";

/** Small "מקור" link that opens the source in a new tab. */
export function SourceLink({ source }: { source: Source }) {
  return (
    <a href={source.url} target="_blank" rel="noopener noreferrer nofollow" title={source.title} className="text-[13px] font-semibold text-muted underline decoration-dotted underline-offset-2 hover:text-go">
      מקור<span className="sr-only">: {source.title}</span>
    </a>
  );
}
