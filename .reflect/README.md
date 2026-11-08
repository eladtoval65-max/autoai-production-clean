# `.reflect/` — the reflection ledger

Committed on purpose: agent sessions are ephemeral, and an unpushed note dies with the box.

- `<YYYY-MM-DD>/<sid8>.jsonl`: one unit note per line (Channel B), written by the `reflect` skill.
- `<YYYY-MM-DD>/<sid8>.events.jsonl`: hook-written correction events (Channel A).
- `last-brief.json`: the `daily-brief` watermark. `processed_through: null` means no brief has
  merged yet. It advances only when a brief PR merges.
- `brief.md` and `archive/`: the latest brief summary and distilled past briefs.

Day folders use the `REFLECT_TZ` zone (default UTC). Never hand-edit a note. The full contract
(fields, the sid8 rule, the merge gate, the brief lifecycle) is `docs/reflection.md`.
