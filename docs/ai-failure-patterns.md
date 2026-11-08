# AI-authored defect patterns — the catalog

Recurring, generalizable mistakes that AI agents (and humans) keep re-introducing. Each entry is
encoded so it gets caught **in review** (the check a reviewer runs) and **while building** (the rule
to follow the first time).

**How to use.** Reviewers: `senior-code-review` points here — run the review check for every
pattern the diff touches. Builders: skim the table before a unit in an area you have not touched.
`reflect` and `daily-brief` add entries when the same mistake shows up twice.

**Precision bar.** An entry under "Other spots" is a flag for follow-up, not a proven bug — verify
before you claim one.

**Adding an entry.** Take the next free number (never reuse one). Each entry has the same five
parts: Symptom · Why an LLM does it · Review check · Build rule · Other spots (optional). If the
pattern is project-specific, say which files it lives in; if it is generic, keep it generic.

The seed entries below are generic patterns that came up again and again in a real production
repo. Keep them, prune the ones that do not apply to your stack, and append your own.

| #   | Pattern                                                        | One-line symptom                                                       |
| --- | -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| P1  | A check that cannot fail                                       | The test/guard is green with AND without the feature                   |
| P2  | Verification that skips on missing config reads as green       | "0 failures" because nothing ran                                       |
| P3  | Fix scoped to the author's footprint, not the defect's class   | The reported spot is fixed; three siblings keep the bug                |
| P4  | Asserting what the code implies as though it had been observed | "Works" was reasoned, never run, while the real surface was reachable  |
| P5  | A subagent's claim quoted to the owner as verified fact        | A count/conclusion passed on without being checked                     |
| P6  | A spec written from a stale source, then treated as the spec   | The build matches the doc; the doc no longer matches what was approved |
| P7  | A foreign-authored spec built as ground truth                  | Named columns/APIs/functions in the spec do not exist                  |
| P8  | Filter applied after pagination                                | The screen says "none" while matching rows exist on page 2             |
| P9  | Whole-object PATCH from an open-time snapshot                  | Saving form A silently reverts a concurrent edit to another field      |
| P10 | Bounded write with no server-side guard or lock                | Two clients both take "the last seat"                                  |
| P11 | Upsert that omits a column                                     | The previous writer's value survives on the row                        |
| P12 | `data ?? []` during load                                       | The empty state flashes before the real data arrives                   |
| P13 | A test mock richer than the real data shape                    | Tests pass; production crashes on the missing field                    |
| P14 | A regression fixture ordered so the assertion cannot fail      | The bug is back; the test is still green                               |
| P15 | A "behavior-neutral" shared refactor                           | An unwatched sibling consumer breaks                                   |
| P16 | Scripted multi-edit batch aborts partway                       | Half the hunks landed; the commit message claims all of them           |
| P17 | Orchestrated agents share one working tree                     | Agents overwrite or stash each other's work; fake reds                 |
| P18 | A known-red check hides the next failure behind it             | "It was already red" — and now it is red for a new reason too          |
| P19 | An executable snippet in a skill or doc                        | Code no gate runs; it rots silently                                    |
| P20 | A race-only timeout                                            | The late result lands after the UI moved on and overwrites state       |
| P21 | A correction validated only on the rows that showed the defect | The fix breaks rows that were fine                                     |
| P22 | A dependency treated as empty because it was not loaded        | The code commits "nothing" when it meant "not fetched yet"             |

## P1 — A check that cannot fail

- **Symptom.** A new test, guard or lint rule passes both with the feature and with it removed.
- **Why an LLM does it.** It writes the assertion it expects to be true, sees green, and stops.
- **Review check.** For every guard in the diff: break the thing it guards (revert the fix, delete
  the line) and run it. It must go red. Then restore.
- **Build rule.** Mutation-test every guard you add before you commit it. A green that never had
  the power to be red is decoration.

## P2 — Verification that skips on missing config reads as green

- **Symptom.** A script, test or CI step exits 0 because an env var, file or service was missing
  and it quietly skipped.
- **Why an LLM does it.** Graceful degradation looks like good engineering.
- **Review check.** What does this check print when its input is absent? "Skipped" must be visible
  and must not be reported as "passed".
- **Build rule.** Skips are loud and counted. Report "N passed, M skipped (reason)", never "green".

## P3 — Fix scoped to the author's footprint, not the defect's class

- **Symptom.** The reported instance is fixed; the same bug lives on in sibling files.
- **Why an LLM does it.** It fixes what it was shown.
- **Review check.** Name the defect's class in one line, then grep for the class, not the instance.
- **Build rule.** Every fix includes the search for siblings, and either fixes them or lists them.

## P4 — Asserting what the code implies as though it had been observed

- **Symptom.** "This works / the page renders / the query returns X" — from reading code.
- **Why an LLM does it.** Reasoning is cheaper than running, and reads as confident.
- **Review check.** For every claim of behavior: what command or observation produced it?
- **Build rule.** If the real surface is reachable (a test, a dev server, a query), observe it. If it
  is not, say "not verified — reasoned from X".

## P5 — A subagent's claim quoted to the owner as verified fact

- **Symptom.** "There are 37 call sites" — the number came from a subagent nobody re-checked.
- **Why an LLM does it.** Subagent output arrives in the same confident register as tool output.
- **Review check.** Which facts in the report came from delegated work? Were they spot-checked?
- **Build rule.** Spot-check delegated facts that matter before passing them on, or label them.

## P6 — A spec written from a stale source, then treated as the spec

- **Symptom.** Every check is green, yet the build diverges from the mockup/decision the owner
  actually approved, because the spec doc was written from an older source.
- **Review check.** Open the approved artifact itself (mock, ticket, message) next to the build.
- **Build rule.** Keep the approved artifact open while building; the doc is a summary of it.

## P7 — A foreign-authored spec built as ground truth

- **Symptom.** A spec from another agent, a wiki page or a ticket names columns, functions, APIs or
  behaviors that do not exist or behave differently.
- **Build rule.** A spec you did not write against this code is a hypothesis. Verify every named
  artifact against the real code before planning (`writing-plans` § Ground the spec).

## P8 — Filter applied after pagination

- **Symptom.** A list fetches page 1, then filters client-side; the empty state shows while matches
  exist further down.
- **Review check.** Is every filter applied in the query, before the limit/offset?
- **Build rule.** Filter in the query. If you cannot, fetch until the page is full or say so.

## P9 — Whole-object PATCH from an open-time snapshot

- **Symptom.** A form loads the full row, the user edits one field, the save writes every field —
  reverting anything someone else changed meanwhile.
- **Build rule.** Send only the fields the user changed (a diff), or use a version/updated-at check.

## P10 — Bounded write with no server-side guard or lock

- **Symptom.** Capacity, quota or uniqueness is checked on the client, then written.
- **Build rule.** The bound lives on the server: a constraint, a transaction with a lock, or an
  atomic conditional update. The client check is UX only.

## P11 — Upsert that omits a column

- **Symptom.** An upsert writes a subset of columns; on conflict the untouched columns keep the
  previous writer's values, which are now wrong.
- **Build rule.** On upsert, decide explicitly for every column: overwrite, keep, or reset.

## P12 — `data ?? []` during load

- **Symptom.** The empty state ("No items yet") flashes on every load.
- **Build rule.** Loading, error, empty and data are four distinct states. `undefined` is not `[]`.

## P13 — A test mock richer than the real data shape

- **Symptom.** The mock returns fields the real query does not select. Tests pass; prod crashes.
- **Build rule.** Build mocks from the real projection (the select list / the API type), not from the
  full type you wish you had.

## P14 — A regression fixture ordered so the assertion cannot fail

- **Symptom.** The fixture already sits in the order the fix produces, so the test passes without it.
- **Build rule.** Order fixtures adversarially; then apply P1 (revert the fix, see red).

## P15 — A "behavior-neutral" shared refactor

- **Symptom.** A shared component or helper is "just restructured"; one consumer's state breaks.
- **Review check.** List every consumer by searching the codebase (never from memory) and check each.
- **Build rule.** Shared-code refactors enumerate their consumers in the PR description.

## P16 — Scripted multi-edit batch aborts partway

- **Symptom.** A sed/script batch fails on edit 4 of 9; edits 1–3 are on disk; the commit message
  describes all 9.
- **Build rule.** After any batch edit, `git diff --stat` and confirm every intended file changed.

## P17 — Orchestrated agents share one working tree

- **Symptom.** Parallel agents stash, reset, check out or commit under each other; test runs collide
  and time out into fake reds.
- **Build rule.** One writer per tree. Colliding agents get their own `git worktree`. Never
  `git stash`/`git reset` a shared tree. Cap concurrent agents to what the machine can run, and keep
  full suites/builds to the orchestrator, once, before merge.

## P18 — A known-red check hides the next failure behind it

- **Symptom.** A check was already failing, so a new failure in the same check goes unnoticed.
- **Build rule.** A known red is either fixed or baselined (an explicit allow-list of current
  failures), so any NEW failure is loud.

## P19 — An executable snippet in a skill or doc

- **Symptom.** A command or code block in a doc stopped working months ago.
- **Build rule.** If a snippet matters, move it into a script that something runs, and link the
  script from the doc.

## P20 — A race-only timeout

- **Symptom.** `Promise.race([request, timeout])` — the timeout wins, the UI moves on, then the
  request resolves and writes stale state.
- **Build rule.** A timeout also cancels (AbortController) or the late result is explicitly ignored.

## P21 — A correction validated only on the rows that showed the defect

- **Symptom.** A data fix or filter is tested against the bad rows only; it breaks good rows.
- **Build rule.** Validate a correction against the excluded/unaffected set too.

## P22 — A dependency treated as empty because it was not loaded

- **Symptom.** Code reads "no items" and acts on it (deletes, commits, shows a final state) when the
  items simply had not been fetched yet.
- **Build rule.** Distinguish "not loaded" from "loaded and empty" in the type, and never act on the
  former.
