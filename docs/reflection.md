# Reflection: hot notes + the brief (`.reflect/`)

A two-tier reflection system for multi-session agent work. Tier 1 captures short structured
notes while the work happens; Tier 2 (the brief) reads them across all sessions and turns
aggregate patterns into doc, skill, and guard changes. This file is the format contract. The
writers (`scripts/hooks/*`, the `reflect` skill) and the consumer (`daily-brief`) follow it.

## Layout

```
.reflect/
  README.md                # pointer to this file
  <YYYY-MM-DD>/            # calendar day in REFLECT_TZ (default UTC); ALL writers use it
    <sid8>.jsonl           # Channel B: model-written unit notes (one JSON object per line)
    <sid8>.events.jsonl    # Channel A: hook-written events (one JSON object per line)
  last-brief.json          # the brief's watermark (advances only when a brief PR MERGES)
  brief.md                 # latest brief summary (5 bullets max)
  archive/<from>--<to>-brief.md   # distilled briefs kept after their raw day-folders are deleted
```

- **`sid8`** is the session's 8-character join key, and it is part of a committed filename.
  Rule: take the first 8 characters of the session id, lowercased; if they are all hex
  (`[0-9a-f]{8}`), that is the sid8. Otherwise (an id that is not a UUID) the sid8 is the first 8
  hex characters of `sha1(session_id)`. Hooks read the id from the stdin `session_id`; the model
  reads it from `$CLAUDE_CODE_SESSION_ID` (same value). Compute it the same way everywhere:

  ```bash
  node -e 'const s=process.argv[1],h=s.slice(0,8).toLowerCase();console.log(/^[0-9a-f]{8}$/.test(h)?h:require("crypto").createHash("sha1").update(s).digest("hex").slice(0,8))' "$CLAUDE_CODE_SESSION_ID"
  ```

  A mismatch silently breaks the brief's session join (events and notes from one session no
  longer line up), so never derive it any other way.

- **Dates use one configured zone**: `REFLECT_TZ` (an IANA name, set in `.claude/settings.json`
  `env`; default `UTC`). Pick the zone of the owner's working day, so the brief's day boundary
  matches the owner's morning. Node: `toLocaleDateString("en-CA", { timeZone })`; bash:
  `TZ="$REFLECT_TZ" date +%F`.
- **`.jsonl`, never `.json`**, for append files: newline-delimited objects in a `.json` file break
  JSON tooling and formatters. If you run a formatter repo-wide, add `.reflect/` to its ignore
  file (it protects `brief.md` too).
- `.reflect/` is **committed by design**: agent containers are ephemeral, and an unpushed note
  dies with the box. Per-session files mean concurrent sessions never conflict.

## Channel A: hook events (mechanical, zero model tokens)

Written by `scripts/hooks/reflect-corrections.mjs` (`UserPromptSubmit`): correction-shaped user
messages ("no, ...", "that's wrong", "I meant ...", or a message that starts with "actually" /
"stop" / "don't") append an event. The snippet is 80 characters max, whitespace-collapsed.
Markers are English; extend `STRONG`/`WEAK` in the hook for other languages.

```json
{
  "ts": "2025-03-14T18:40:12.000Z",
  "kind": "correction",
  "marker": "\\bno,\\s",
  "snippet": "No, I meant the list of users, the name pops in after a second"
}
```

A hook that is exit-0-always by design can be broken for weeks with nobody noticing. If you
change it, drive it with a sample payload and confirm the events file appears. The brief reports
the Channel-A count every run, even when it is zero, so a silent channel cannot read as a quiet
week.

## Channel B: the unit note (model, ONE per unit of work)

**The unit is the PR-sized piece of work, not the push.** One note per unit. Review rounds,
rebases, conflict resolutions, and merges of a branch that already carries its note add NO new
note unless they changed the unit's story; a round that surfaced a real defect goes into the
unit's single note (`went_wrong` / `surprised`). Merging another session's reflected PR owes
nothing: its builder's note is the ledger entry. A ledger where five entries say the same thing
is noise to the brief, not signal.

**One sanctioned exception: the POINTER note.** A unit that ships as two PRs leaves the second
branch with no note in its diff, so the merge gate blocks it while this contract owes nothing.
The resolution is a one-line `no-change-justified` note whose `did` names where the unit's real
note landed ("Pointer to the unit note merged in `<sha>`"). It is a ledger cross-reference, not a
second reflection, and never `fixed`. The brief counts pointer notes as plumbing, not as units.

**How a note is written.** The `reflect` skill (§ 5) holds the append recipe: the model writes
the JSON object, and a one-line node command adds `ts`, `branch`, and routes it to the right
day/sid8 file. Never hand-edit an existing line, and never write the file without the recipe's
`JSON.stringify` step: the merge gate reads an invalid note as simply NOT proof-carrying, and the
brief's rollups under-count it in silence. If your project adds a validating writer script, the
recipe should call it instead. A late append may set the real work day explicitly; never a
future date.

```json
{
  "ts": "2025-03-14T18:45:00Z",
  "branch": "fix/settings-stale-values",
  "commits": ["e2821e6"],
  "asked": "fix the settings page flashing old values on open",
  "did": "Persisted the profile query so the settings name paints on the first frame",
  "intent_gap": "first fix targeted the edit sheet; the owner meant the index row. Closed after re-explanation",
  "went_well": "the fix reused the existing offline-cache machinery instead of inventing a new one",
  "went_wrong": "shipped fix #1 on proof-by-construction without opening the app; the wrong target would have been visible on screen",
  "verified": "construction: argued the flash impossible from once-seeded state; never observed",
  "surprised": "the in-memory cache dying across app opens was the real mechanism; staleTime was irrelevant",
  "skills_fired": ["ship-it"],
  "skills_missed": ["systematic-debugging"],
  "friction": "owner corrected scope: the flash was the index row, not the sheet form",
  "flags": ["deliberate-deviation"],
  "outcome": "fixed",
  "process_artifacts": [".claude/skills/systematic-debugging/SKILL.md"],
  "process_verification": "the skill now requires observing the named surface before diagnosing visual state",
  "note": "the IMPACT-MAP edge for persisted queries did its job"
}
```

**`commits` does not survive a squash or rebase.** A note is written before merge, so the SHAs
it records can become unresolvable on the default branch. After a rebase, re-find each recorded
SHA by its commit subject on the current branch and repoint it; leave ambiguous ones for a
human (a wrong SHA is worse than a stale one). Note the naive check is wrong: a rebase leaves the
original commits in the object store, so `git cat-file -e` says yes to every SHA it orphaned.
Reachability from `HEAD` or the default branch is the real question. When the unit merges,
record the squash commit or the PR number.

**`asked` + `intent_gap`.** Before closing a unit, restate the owner's ask (`asked`, one line,
their words compressed) and self-assess delivery against it. `intent_gap` is `""` when
delivered = asked, else one sentence naming the divergence and how it was closed. Execution
fields alone assume clean execution = met intent; a perfect fix to the wrong target disproves
that. Channel A only catches gaps the owner voices; this field makes the agent look first.

**The work-quality layers.** Four one-liners; `""` is honest when a layer has nothing:

- **`went_well`**: the strongest craft choice of the unit. The brief mines it for house patterns.
- **`went_wrong`**: the worst craft moment, INCLUDING lucky escapes (a forbidden bulk `git add`
  that happened not to bite) and self-caught wrong assertions. Distinct from `friction`
  (external/process) and `intent_gap` (target). Near-misses are invisible until the day they
  aren't; this is where they live.
- **`verified`**: HOW the unit's central claim was checked. MUST start with one of `empirical`
  (ran or observed it), `test` (a test or fixture proves it), `construction` (argued from the
  code: the mode where confident wrongness lives; naming it is the point), or `none`. Free text
  after the prefix. This covers scope REDUCTIONS too: "dropped X because Y already handles it" is
  a central claim and owes the same prefix, since unbuilt work leaves no test that can fail. The
  prefix is set by the unit's WEAKEST load-bearing leg, not its greenest suite.
- **`surprised`**: an assumption that broke or a discovery that updated the model. Highest
  learning density per line; surprises are tomorrow's failure patterns and doc fixes.

**Proof of process change.** `outcome` is `fixed`, `owner-decision`, or `no-change-justified`.
`process_artifacts` names the repo-relative skill, guard, test, invariant, or doc changed
(never a `.reflect/` path); `fixed` requires at least one, and each must be in the branch diff.
`process_verification` states how the change was checked, or the evidence for the other two
outcomes. **Non-`fixed` outcomes must carry non-empty `asked` and `did`**: with no
diff-checkable artifact, the story IS the evidence. The merge gate enforces all of this.

**Skill IDs are exact directory names** under `.claude/skills/`, never prose. Put explanations in
`friction` / `note`. This makes recurrence counts meaningful. So `skills_missed` can only name a
skill that already exists, which means it is the wrong place to look for new-skill candidates:
**a missing capability goes in `friction`, named as a capability** ("no X exists; I rebuilt it by
hand"), and the brief mines `friction` for things worth building. `skills_missed` stays what it
is: an existing skill that should have fired and did not.

**Flags** (closed set): `collision-risk` · `deliberate-deviation` · `debt` ·
`secret-close-call` · `out-of-band-ddl` · `invariant-touch`. Extend the set deliberately, here
first.

## Channel C: reflect, then FIX what didn't go right

In-chat reflection is a loop, not a log. After each unit, and as a gate before merging any
UNREFLECTED unit (the loop is brainstorm → plan → build → review in rounds → **reflect** →
merge → suggest next; "merge!" approves the merge, it does not skip the step before it), reflect
on what happened including asked vs planned vs delivered, record it (Channel B), then **fix what
didn't go right, now**: a wrong predicate, a fix on the wrong surface, a stale doc line, a missed
signal. In the same PR or an immediate follow-up. Defer to the brief ONLY what needs aggregate
sight (cross-session patterns, trends) or an owner decision (large rework, scope changes:
propose, don't unilaterally rebuild). Shared rulebooks (`CLAUDE.md` and the ledger docs) take
single-line appends only, so concurrent sessions don't conflict; the brief owns restructuring.

The pass ends with one evidenced outcome: **fixed**, **owner decision**, or **no change
justified**. A lesson, a missed-skill name, or a note alone is not completion. The invocable form
is `.claude/skills/reflect/SKILL.md`.

**The merge gate** (`scripts/hooks/reflect-before-merge.mjs`, PreToolUse on merge tools and
`gh pr merge`):

| Branch state                                                 | Gate behavior                        |
| ------------------------------------------------------------ | ------------------------------------ |
| Nothing ahead of the default branch                          | pass                                 |
| No Channel-B note in the branch diff                         | block, every attempt (no cap)        |
| A proof-carrying note for this branch (any session's)        | pass                                 |
| ...but the diff changes code and no note lists the review skill in `skills_fired` | block once, retry passes |
| Notes exist, none proof-carrying                             | block twice, then yield              |

If the gate blocks after you pushed a note, **validate the note against Channel B before
suspecting the gate** (wrong `branch`, missing `verified` prefix, a `fixed` artifact not in the
diff). The yield after two holds is a cap, not compliance: the ledger debt stands until a
conforming note lands. Known limits: on a long-lived branch shipping several units, an earlier
unit's note also opens the gate for the next; one reflected checkout can merge a different PR
number. Appending each unit's note before its merge is `ship-it` discipline, not hook-enforced.

The Stop hook (`scripts/hooks/dod-reminder.sh`) nudges a branch with commits today and no note
naming it anywhere in the ledger. Both hooks are scoped to the UNIT on purpose: a per-commit or
per-PR trigger re-arms after every push and turns review rounds into ritual notes.

## The brief lifecycle

`daily-brief` (`.claude/skills/daily-brief/SKILL.md`) is safe to fire on any cadence: a loop, a
scheduled task, or by hand. Its state contract:

- **Complete-days rule**: a run processes only day-folders with date < today (in `REFLECT_TZ`)
  and > `processed_through`. Today's growing folder is never read, so re-runs are deterministic.
- **The watermark advances only on merge**: `last-brief.json` is updated inside the brief PR
  itself; until the owner merges, nothing is consumed and a re-run regenerates the same PR over
  the extended range. One live brief PR (branch `reflect/brief`), never a second.
- **Silent no-op**: no unprocessed complete days, no new PRs, clean sweeps → no PR, no noise.
- **Archive on merge**: processed raw day-folders are deleted; the distilled
  `archive/<from>--<to>-brief.md` remains. `daily-brief weekly|monthly` reads archived briefs
  instead of raw notes.
- **Optional mirrors**: a wiki page per brief and tracker issues for follow-ups. If used, record
  the ids the tracker RETURNED in the watermark file; a filing exists when the tracker returns an
  id, not when a PR body says so.

`last-brief.json` (initial state: `null` values and an empty `filed_this_run`; `processed_through: null` means first run):

```json
{
  "processed_through": "2025-03-13",
  "last_run": "2025-03-14T05:00:00Z",
  "brief_pr": 131,
  "filed_this_run": []
}
```

## Optional drift test

Every `json` fence above is ONE valid JSON object with real values (no `...`, no multi-object
JSONL). A project can add a test that parses each fence, asserts the flag set and `verified`
modes match the merge gate's constants, and validates every committed note under `.reflect/`
(enums, `verified` prefix, sid8 filename). That turns a hand-written note into a red test instead
of a silent under-count.

## Keep in sync

`scripts/hooks/reflect-corrections.mjs` + `dod-reminder.sh` (hook writers) ·
`scripts/hooks/reflect-before-merge.mjs` (the merge gate; its proof check mirrors Channel B) ·
`.claude/skills/reflect/SKILL.md` (the Channel-C loop + note recipe) ·
`.claude/skills/daily-brief/SKILL.md` (consumer) · `ship-it` (commits the note with the unit).
