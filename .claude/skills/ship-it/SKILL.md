---
name: ship-it
description: Use when committing, branching, staging, pushing, opening or merging PRs, stacking dependent PRs, rebasing a long branch, or finishing a change. Branch discipline (never commit to the default branch), explicit-path staging, commit+push+verify-on-origin, the local gate before a PR, stacked PRs, lockfile and generated-file discipline, and never merging without the project owner's explicit approval.
---

# Ship it (git + PR playbook)

The git workflow that keeps the default branch (called `main` below) deployable and keeps
history clean. The **Definition of Done** lives in `document-work`; run it before opening
the PR (docs ride the same PR) and before calling any change finished.

## The loop

Every unit of work runs the same cycle, unprompted. The owner should never have to ask for
a step:

> owner ask -> `brainstorming` -> `writing-plans` -> build -> `senior-code-review` rounds until
> clean -> PR -> `reflect` -> owner approves -> merge -> suggest next options

- **"Review until good" means `senior-code-review` ROUNDS over your own diff**, repeated until
  a round finds 0 Critical/High and fewer than 3 Medium, fixes included. Record it in the
  reflection note's `skills_fired`.
- **Never merge without explicit owner approval.** Build, push, open the PR, then stop.
  "Merge!" approves the merge; it does not skip `reflect`, which is the gate immediately
  before every merge of an unreflected unit (the `reflect-before-merge` hook enforces it, if
  installed).
- **A gate on MERGING is not a gate on WORKING.** When the owner scoped several units
  ("build them step by step, starting with X"), "starting with" is an order, not a stop.
  Carry on to the next unit and present the whole thing.
- **A newly added hook that stays silent is unproven, not inert.** Drive it directly with a
  sample payload before concluding anything about when it fires.

## Branch discipline

- **Never commit directly to `main`.** Work on a feature branch; in an agent session use the
  session's designated branch (`git branch --show-current`). The first git write of a unit is
  usually `add`, so check the branch before staging, not only before committing.
- Start from fresh `main`: `git fetch origin main`, branch or rebase from `origin/main`.
- **On a long-lived branch, re-fetch before each new unit.** A base that moved under a
  multi-file task silently invalidates the work and collides shared-ledger appends.
- **One concern per branch/PR; one subsystem, one PR (or one stack).** Two parallel branches
  reworking the same engine is a stop-and-restack signal.
- **Before rewriting a whole screen or module, ask who else owns it.** Git merges text, not
  two designs.

## Staging: explicit paths only

```sh
git status --short
git add <specific paths>          # never `git add -A` / `git add .` on a dirty tree
git rm <deleted paths>            # stage deletions explicitly
git diff --cached --name-only     # compare against the list you MEANT to stage
git diff --check                  # whitespace errors
```

- **Generated files are never hand-edited.** Some are tracked: when your change requires a
  regenerated file (route manifest, generated types), regenerate it with the project's tool
  and stage it in the same commit, or `main` goes red for everyone. When it shows up dirty
  and your change did not require it, discard it (`git checkout -- <file>`). The list of
  generated files is in CLAUDE.md § Hard rules.
- **One lockfile, one package manager.** Add dependencies only through the project's package
  manager so its lockfile updates; never hand-edit a lockfile, never let a second lockfile
  appear, and keep CI/deploy installs on the same tool. If a dependency change is in the
  diff, the lockfile change is too.
- **A scripted edit must not be followed by a commit that assumes it worked.** Chain with
  `&&`, or grep for the string the edit should have added before staging. A failed script
  plus an unconditional commit gives a commit message describing changes the commit lacks.
- **Scripted staging can abort silently**: one already-deleted path in an `xargs git add`
  list aborts the add, and the commit records only what was staged before.
- **Formatters take globs.** Run them on the files you edited, never the whole repo.

## Commit -> push -> verify on origin

```sh
git commit -m "<what changed, at the product level>"
git push -u origin <branch>                  # on network error retry with 2s, 4s, 8s, 16s backoff
git fetch origin <branch>
git log origin/<branch> --oneline -3         # VERIFY the commit landed on origin
```

- **Commit message style**: a short subject in the imperative describing the product-level
  change; a body with the why, what was verified, and anything left open. Counts or "all"
  claims in the message are re-derived after the last fix, not carried over. End with any
  attribution lines the session requires.
- **Never gate a commit on a piped check** (`run-tests | tail -3 && git commit`): the pipe
  returns the last command's status, so a red check still commits. Run the check, read it,
  then commit in a separate step, or `set -o pipefail` first.
- **Verify on origin is not optional.** A push can fail silently. If the remote moved,
  `git pull --rebase origin <branch>`, resolve, re-push, re-verify.
- **`git fetch` before acting on any `origin/*` ref** after a session gap, a subagent, or at
  the start of a push/merge sequence. A rolled-back container or stale cache makes the
  remote-tracking ref lie confidently.

## The local gate before a PR

Run the typecheck, test, lint and build commands from CLAUDE.md § Commands **in this
console**, on the commit you are about to push. That run is authoritative.

- **The tree stays still while a gate runs.** An edit during a background test or build run
  grades a mix of old and new code; the result belongs to no commit. Edit after it reports,
  or commit first and run the gate in its own worktree.
- **Every count you quote** (tests passed, lint warnings) is read off the run you just did,
  on the commit you are on. Never carry a number from an earlier PR body; it silently
  expires when the base moves. Re-run and re-quote after every rebase.
- **A red that is really a missing install** (a declared dependency not materialized) is not
  a code red: install and re-run before calling anything pre-existing.
- **Judge "pre-existing" from the base**, in a separate worktree at the base commit, not from
  the test's name.
- **CI is extra signal unless CLAUDE.md says it is the gate.** Before presenting a PR as
  merge-ready, glance at its checks AND the base branch's latest CI result: an inherited red
  on the base looks exactly like your regression. A job that fails in seconds with no runner
  assigned is infrastructure (quota, runner starvation), not your code.

## After any history rewrite, verify the BLOB, not the tree

After a conflicted merge, `git reset --soft`, `commit --amend`, or a squash:

```sh
git status --short             # must be EMPTY: no " M", no "MM"
git show HEAD:<file>           # the committed content of the file the change was about
```

A conflict resolution can leave files staged-then-modified (`MM`); the commit records the
staged half while the resolution stays on disk. Every test, lint and build reads the
checkout, not the commit, so they all go green over a commit that lacks the change. Never
filter `git status` through `grep -v "^[MADR]"` to decide nothing is unstaged: `MM` starts
with `M`.

## Rebasing a branch that touched append-only ledgers

`docs/DECISIONS.md`, `docs/INVARIANTS.md`, `docs/IMPACT-MAP.md`, `docs/ai-failure-patterns.md`
and `.reflect/*.jsonl` are appended by every thread, so a long branch conflicts on every
commit that touched one. If PRs squash-merge, collapse first and rebase once:

```sh
git fetch origin main
git reset --soft $(git merge-base HEAD origin/main)   # keep the tree, drop the commits
git commit -F <message-file>
git rebase origin/main                                # one conflict round per file
git show HEAD:<ledger>                                 # verify the blob afterwards
```

- Resolve by keeping **main's** version and re-inserting only the rows main lacks. Never
  `--ours`/`--theirs` wholesale on a shared ledger; that deletes another thread's appends.
- **A clean (no-conflict) merge of a ledger proves nothing.** `grep -c` the row you changed:
  duplicated content patches silently, and one copy edited later contradicts the other.
- Hand-numbered ledger IDs: allocate after the rebase, not from a stale read of the maximum.

## PRs

- **Don't open a PR unless the loop or the owner calls for it.** Follow any repo PR template.
- If PRs squash-merge, the PR title and description are the durable record of the change,
  but the repo doc remains the deep dive. Never leave the only explanation in a PR body.
- **`main` is protected: merge through the PR**, never `git push origin main` after a local
  fast-forward. A direct push also bypasses merge-time hooks. Use the merge method the owner
  names (squash by default).
- After a PR merges, follow-ups are fresh work: `git fetch origin main && git checkout -B
  <branch> origin/main`. Never stack new commits on already-merged history.
- **Issue-closing keywords** ("fixes", "closes", "resolves") before an issue id close it on
  merge. Use them only in the PR that actually fixes the issue; reference others without a
  keyword ("Part of <id>").

## Merging another session's PR makes its defects yours

- **Review before recommending a merge, not after.** If you propose it, its code is in your
  scope regardless of who wrote it.
- **A verified claim about one part never launders an unverified claim about another.** "The
  migration is a no-op" and "the feature code is sound" need separate evidence; say which you
  checked.
- **When an unblock is urgent, split it**: cherry-pick only what unblocks and let the rest
  merge after review. Offer that option first, not last.

## Stacked PRs (dependent work)

Do not hand-carve two overlapping branches from the same tree; diffs bleed into each other.

1. Build PR-A on a branch off `origin/main`. Push, open, get it merged.
2. `git fetch origin main`; build PR-B on a new branch off the updated `origin/main`.
3. If B cannot wait: branch B off A, and after A merges,
   `git rebase --onto origin/main <branch-A> <branch-B>`.
4. **Merging a stacked PR lands it on its BASE, not `main`.** Before closing a base PR as
   "landed through its child", prove it: `git merge-base --is-ancestor <commit> origin/main`.
   Retarget the child to `main` before merging it, or merge the base first.

## Schema migrations ride the same train

If merging to `main` applies migrations automatically, a PR containing one is a deploy of
schema changes. Never merge a migration you would not run against production right now.

- Before merging, confirm your migration still sorts after the live migration head.
- **Confirm it applied by POLLING**, not one immediate read. Async appliers can lag and may
  apply out of order, so "not there yet" and "never coming" look identical at first. Poll for
  your version for a few minutes before concluding it was skipped.
- Only a genuine skip warrants a re-stamped migration; leave the original in the tree.

## Reflection: one note per unit

Run `reflect` before the merge of every unreflected unit, and append ONE note to `.reflect/`
per unit of work, never per push, review round, rebase or merge chore (contract:
`docs/reflection.md`). Append it after the PR is open and the review rounds have closed, so
it describes the unit as shipped. The one exception is a **pointer note**: when a unit ships
as two PRs and the real note merged with the first, the follow-up gets a one-line
`no-change-justified` note naming where the real note landed.

Fix what the reflection surfaces in the same PR or an immediate follow-up; defer only what
needs aggregate sight or an owner decision.

## Definition of Done

Run the checklist in `document-work`: code green on the local gate, docs in the same PR,
`docs/INVARIANTS.md` / `docs/DECISIONS.md` / `docs/IMPACT-MAP.md` updated if touched, the
issue tracker updated on ship, and the push verified on origin.

**A user-visible residual you can already name is an owner decision, not a footnote.** Fix
it now, or ask before shipping.
