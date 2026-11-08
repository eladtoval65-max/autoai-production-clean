---
name: daily-brief
description: Use when the owner asks to run the daily brief / reflection brief / retro across the agent sessions, or a loop or scheduled task the owner armed fires it. Reads .reflect notes + merged PRs + mechanical sweeps since the last merged brief, distills cross-session patterns into ONE PR that routes each lesson to its owning layer, never merged without owner approval, and stays silent when there is nothing to say. `weekly`/`monthly` args aggregate archived briefs instead of raw notes.
---

# Daily brief: cross-session reflection distillation

The batch tier of `docs/reflection.md`. Safe to fire on ANY cadence (a loop, a scheduled task,
or by hand): every run is idempotent, and state advances **only when the owner merges the brief
PR**. Never schedule anything from here; the owner arms the loop.

**Never start a brief mid-session on your own.** It runs only when the owner asks, or when a loop
the owner armed fires it. The Stop hook's backlog line is information, not an order: mention it
at most once, when the work is done.

Positioning: sessions fix small issues in-chat as they reflect (`reflect`, Channel C). The brief
is the owner's condensed overview and the aggregate lens: cross-session patterns, trends, and
anything a single chat couldn't see or decide. Expect findings to skew structural, not itemized
bug lists the sessions should have fixed themselves.

## Lifecycle (read before doing anything)

1. **Resolve the range from the FRESH remote default branch, never the working tree.**
   `git fetch origin`, then read `.reflect/last-brief.json` and the day-folder list at the
   remote (`git show origin/<default>:.reflect/last-brief.json`,
   `git ls-tree origin/<default> .reflect/`). A brief run from a feature checkout reads a stale
   tree and can re-distill days an earlier brief already archived. Process only day-folders with
   date > `processed_through` AND < today in `REFLECT_TZ` (default UTC); today's growing folder is
   never read, so re-runs are deterministic. `processed_through: null` means first run: start at
   the oldest day-folder, PR lookback capped at 14 days.
2. **No-op check.** No unprocessed complete days AND no new merged/open PRs since `last_run` AND
   clean mechanical sweeps → say "nothing to brief" in one line and STOP. No empty PRs, ever. The
   sweeps run even on zero-work days (some drift needs no commits).
3. **Concurrency guard: check the BRANCH, not only the PR.** If an open brief PR was updated less
   than an hour ago, stop with one line (another runner owns it). Then look at
   `origin/reflect/brief` itself: a runner can push a finished brief and never open a PR. If the
   branch head is ahead of the default branch and unmerged, **read it and absorb what it found**
   before regenerating, and credit it in the PR body. Then regenerate: branch `reflect/brief`,
   reset from the fresh default branch. One live brief PR, never a second. Its body always says
   "merge to advance the watermark; oldest unprocessed: X".
   - Push the SHA, not a local branch name (`git push origin HEAD:reflect/brief`): a rename onto
     an existing stale local branch fails quietly and the push sends the stale head. Re-read
     `git log origin/reflect/brief -1` to verify.
   - The guard is check-then-act. A brief takes many minutes, so re-run the PR + branch guard
     IMMEDIATELY before pushing, and push with a lease:
     `git push --force-with-lease=reflect/brief:<sha you read> origin HEAD:reflect/brief`. A
     concurrent runner's push then makes YOUR push fail instead of erasing their work.
4. **Gap handling.** More than one unprocessed day: distill per day first, then synthesize across
   days (bounded context). More than 14: process the oldest 14 and say so in the PR.

## Inputs

- `.reflect/<day>/*.jsonl` (Channel-B notes) and `*.events.jsonl` (Channel-A corrections) for the
  range. Join sessions by `sid8` filename.
- **Straggler sweep (every run, before distilling):** notes ride feature branches, so a note can
  land on the default branch AFTER the brief that covered its day, behind the watermark where
  `date > processed_through` skips it forever. For any note file in a folder ≤
  `processed_through`: dedupe against the covering archive (by `ts`; a merge can resurrect
  processed lines), MOVE the survivors into today's folder (transport only; `ts` stays
  authoritative), and delete the stale folder in this brief's PR.
- **PRs via the forge API (`gh` or the GitHub tools), never `git log --all`**: squash messages
  lose session trailers and branches are reset after merge; the API keeps each PR's head commits.
- **Mechanical sweeps** (each is a check a project once needed and nobody ran on a schedule):
  fresh typecheck (generated-file drift) · test-count and TODO/FIXME trend vs the previous brief ·
  secret scan · open-PR queue age (the no-merge rule means PRs pile up; list what awaits the owner)
  · CI health on the default branch (a run that fails in seconds with no steps is the runner never
  starting, an owner-side billing/quota signal, not a code failure; say which) · **Channel-A event
  count for the range, reported even when zero**. Add project-specific sweeps here (e.g. live
  schema vs committed migrations, permission/policy parity, security advisors diffed against a
  committed baseline). Two or more consecutive red runs on the default branch, or a red that two
  or more notes reproduced on a clean checkout, is an owner-visible **BLOCKER** line at the top of
  the PR body naming the failing test, never a status bullet.

## Analyses (the aggregate-only sight)

- **Collision heatmap**: same file touched by two or more sessions in the range.
- **Intent fidelity**: `asked` vs `did` vs `intent_gap` across notes (wrong-target work, silent
  scope drift, asks that took two or more attempts). Two or more sessions with the same gap shape
  → a skill or CLAUDE.md fix, not a coincidence.
- **Work quality**: `went_wrong` clustering (a lucky escape appearing twice → propose a
  mechanical guard, hook, or test); the `verified` mode distribution (construction-verified units
  that later drew corrections are the smell); `surprised` entries as failure-pattern and doc-fix
  candidates; `went_well` as house patterns worth writing down; `outcome` + `process_artifacts` as
  the measure of which reflections actually changed the harness.
- **`skills_missed` rollup** (two or more independent mentions → a trigger fix) plus a **`friction`
  rollup for capability gaps**: `skills_missed` only accepts existing skill names, so a
  not-yet-built capability can only appear in `friction`. That is where `author-a-skill`
  candidates live.
- **Correction clusters** from Channel A: the same correction shape in two or more sessions → a
  `docs/ai-failure-patterns.md` candidate.
- Convention drift across the range's diffs · hook meta-review (fire counts, false-positive noise)
  · **recall misses** (a session searched docs for something that existed only in conversation).
- **Skill-library health**: stale, duplicated, untriggered, or non-executable instructions across
  the whole library. Prefer replacement or removal; never add a rule without a named incident.

## Actuation: ONE PR; the owner's merge is the read receipt

Precision bar = `senior-code-review`: no evidence, no finding. **Before proposing a guard for a
miss, check the existing guard did NOT already fire** for that session: a guard that fired and was
skipped is not a missing guard. **Attribute by session, not by PR**: a "two or more sessions"
claim names each sid8 beside its PRs, because one session often opens several PRs. **Load
`author-a-skill` before the first skill edit**; most actuations are skill edits.

Route every finding to its owning layer (`document-work`). CLAUDE.md is the LAST resort, and each
CLAUDE.md change states in the PR body why no narrower home fits:

| Finding                 | Home                                                       |
| ----------------------- | ---------------------------------------------------------- |
| Recurring failure class | `docs/ai-failure-patterns.md`: a new pattern, in format    |
| Must-never-break fact   | `docs/INVARIANTS.md`: a new entry + a guard test if feasible |
| Decided either/or       | `docs/DECISIONS.md` row                                    |
| Coupling bite           | `docs/IMPACT-MAP.md` edge                                  |
| Path-scoped constraint  | `.claude/rules/<area>.md`                                  |
| Skill misfire or gap    | that skill's `SKILL.md` + its CLAUDE.md trigger line       |
| Depth                   | `docs/<topic>.md`                                          |
| Rule or pointer only    | `CLAUDE.md`                                                |

The PR also:

- **prunes**: a stale-claim grep across `docs/`; deletions and merges are findings too (fixing a
  wrong sentence beats adding a right one);
- updates `.reflect/last-brief.json` (`processed_through`, `last_run`, `brief_pr`, and
  `filed_this_run` if a tracker is mirrored);
- writes `.reflect/brief.md` (5 bullets max);
- writes `.reflect/archive/<from>--<to>-brief.md` and DELETES the processed raw day-folders.

**Run the docs' own guard tests before opening the PR** (e.g. any test that pairs a summary-table
row with its detail section, or parses `docs/reflection.md`'s fences). A brief that adds a
two-part entry half-way ships green, because its own gate never runs those tests, and reds the
default branch the moment it merges.

**Re-run the straggler sweep at MERGE time, not only at generate time.** The PR's delete-list was
frozen at generation while the watermark it sets is absolute, so a note that landed in the range's
day-folders since then would be stranded. Before merging, diff the PR's deleted `.reflect/<day>/`
paths against the current default branch; if it carries a note the PR does not also delete, MOVE
that note into today's folder first.

**Optional mirrors.** If the project keeps an owner-facing wiki, create or refresh one page per
brief range at run time, and flip the PREVIOUS brief's page to "merged" when the watermark shows
it landed (merges happen with no session running). If it uses an issue tracker, actionable
follow-ups (debt, deferred fixes, skill candidates) become issues; write the ids the tracker
RETURNED into `filed_this_run` (`[]` only when nothing was filed). Keep issue ids out of the PR
title, and never put a closing keyword ("fixes", "closes") before an id the brief only mentions:
merging the brief would close it. With no mirrors configured, the PR body is the whole report.

**Showcase, then merge on the owner's go; never merge silently.** Present the brief as a short,
scannable summary (blockers and wins first) and get the owner's explicit approval. On their go,
the agent may execute the merge. The gate is showcase + owner approval.

## `weekly` / `monthly` args

Same lifecycle, one level up: read `.reflect/archive/*-brief.md` for the range instead of raw
notes, plus a recurrence check: a finding that appears in three or more dailies and was never
actioned is escalated (that IS the weekly finding). Don't run these until dailies have stabilized.

## Keep in sync

`docs/reflection.md` (format + lifecycle contract, authoritative) · `document-work` (routing) ·
`reflect` (the in-session loop and note recipe this brief complements) · the hook writers in
`scripts/hooks/`.
