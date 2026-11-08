---
name: senior-code-review
description: Review changes like a senior engineer, in ROUNDS, until a round finds 0 Critical/High and fewer than 3 Medium. Runs UNPROMPTED as the build loop's review step over the diff you just wrote, before every PR and merge (not only when asked). Also use when asked to review changes, find bugs, hunt logic flaws, test unhappy paths, check whether a previous fix is sound, review a spec or plan before it is built, or "keep looking" before merge.
---

# Senior Code Review

Review from evidence, not vibes. Start with the diff, understand the intended behavior,
then look for concrete bugs, regressions, weak contracts, and missing tests. If asked to fix
too, implement tight fixes after the review pass and re-run the relevant checks.

**Calibrate for precision.** An LLM reviewer's failure mode is confident false positives,
not missed nitpicks. A few bogus findings make the reviewer worth ignoring; a short list of
real, reproducible issues beats a long list of maybes.

- **No repro, no report.** Every finding names a concrete input/state that produces the
  wrong result, or the exact rule it violates. No repro means it is a question, not a
  finding: say so or drop it.
- **Verify before you surface.** Draft findings, then actively try to disprove each against
  the real code (and a run or test where feasible). Only survivors are reported.

## Severity rubric

| Severity     | Meaning                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------ |
| **Critical** | Crash, data loss or leak, security hole, definitely-wrong output on a main path                  |
| **High**     | Concrete regression, broken unhappy path, an invariant in `docs/INVARIANTS.md` weakened/violated |
| **Medium**   | Weak contract, missing or non-failing test, latent risk with a real trigger, a duplicated foundation |
| **Low**      | Real but minor; fold into one fix pass, never a reason for another round                         |

Do not flag (these erode trust): pre-existing issues outside the diff, style nits,
linter/formatter-catchable items, "could break if..." with no trigger, speculative perf
claims with no measurement or obvious hot path.

**Carve-out: pre-existing code the diff ACTIVATES is in scope.** When a change turns
something on, ask what was dormant-and-harmless that now runs for real (an unwired control,
a stub whose no-op was only true while the feature was off). Flag it, and say it is
activated rather than introduced.

## Workflow

1. **Establish scope.** `git status -sb`, the diff, recent commits if the request refers to
   earlier work. Name the affected user journeys, data paths, routes/endpoints, and tests.
   Preserve unrelated changes; never clean or revert files because they are dirty.
2. **Read the code path end to end.** Follow state from the user event through the
   component/handler, client helper, server/API, storage and its access rules, back to the
   rendered state. Check loading, empty, error, signed-out, denied, offline and stale-cache
   paths.
3. **Check the ledgers.** Scan `docs/INVARIANTS.md` and flag any invariant the diff weakens
   (at least **High**). A change that legitimately alters an invariant requires the same-PR
   `INVARIANTS.md` update plus a `docs/DECISIONS.md` entry. Scan `docs/IMPACT-MAP.md` for
   also-touch edges the diff missed. Run the patterns in `docs/ai-failure-patterns.md` that
   the diff touches.
4. **Sweep the bug classes** in `references/checklists.md` that the diff touches (security,
   concurrency, data, error handling, resilience, tests, docs). Plus the project's own
   path-scoped rules in `.claude/rules/*.md` for the files changed.
5. **Apply the multi-site lenses** (below). They find what re-reading cannot.
6. **Verify each candidate adversarially** (below).
7. **Report or fix** (below).

## The multi-site lenses

- **Trace an unhappy path; don't re-read.** Pick a branch and ask "what does the user
  actually see when X": no data, permission denied, offline, empty result, second press,
  input outside every expected range. Re-reading confirms what the code says; tracing tests
  what it does.
- **Enumerate the edge cases from the change's own inputs.** Empty / one / many, first /
  last, zero / negative / max, missing / null / malformed / duplicate, concurrent, offline,
  first-run vs repeat, and time (midnight, DST, timezone, month/year rollover, leap day). The
  highest yield is unusual-but-VALID input the author never pictured.
- **Partial preservation is a smell, not reassurance.** When a diff touches N call sites, a
  behavior preserved at some of them proves it was considered, which reads as proof it was
  handled. Diff the sites against each other, not only against the base branch.
- **A swapped helper leaks its side effects at every site.** When a migration replaces one
  helper with another, list the old one's side effects (writes, cache invalidations,
  analytics, persistence) and confirm each survives, per site. Type-checking cannot see a
  missing side effect.
- **A discriminated union narrowed into a scalar or nullable parameter** loses
  exhaustiveness. Enumerate the old cases and find each one's new home.
- **What did the diff make load-bearing that nothing pins?** A literal compared across a
  module boundary (an error code string, a storage key, an event name, a reason from the
  database) is consistent today because one author wrote both ends. Require a test that pins
  the producer's real output to the consumer's expectation. Same for code that touches a
  third-party library's private symbol: pin the real symbol, not a model of it.
- **One foundation.** Grep for an existing thing that does the same job (component, helper,
  per-type map, message key). A parallel copy the diff adds instead of extending the shared
  one is at least **Medium**; the fix retires the copy in this PR.
- **Is the shown value confidently WRONG?** Code can be correct and output still dishonest:
  approximate, stale, rounded, or describing something adjacent to what the label claims.
  Prefer degrading (hide, generalize, drop the false-specific label) over a precise-looking
  wrong answer.
- **An approval surface must show everything the approver is accountable for.** Enumerate
  what the submit side captured and every side effect the approval triggers; confirm the
  review side renders each one, and that bulk confirms list the side effects too.
- **Output rendered by a host you don't control** (notifications, share cards, emails,
  store listings): review what the host draws, not just the payload you send.
- **Resilience of things you don't control** is a DESIGN review: for every external
  dependency, ask what the user gets when it is slow, down, or returns garbage, and whether
  a bad-but-successful answer gets cached and served to everyone.

## Verify each finding adversarially

For every issue you are tempted to report, try to knock it down first:

- **Re-read the actual code**, not your memory of it. Confirm the symbol/API exists and
  behaves as assumed. Most false positives die here (hallucinated APIs, "bugs" the
  surrounding code already handles).
- **Produce the failing case**: inputs/state, then wrong output. Prefer a targeted test;
  run typecheck/build (CLAUDE.md § Commands) when types, routing, schema or shared helpers
  changed; drive the real UI for UI claims when the app can run.
- **Disproof toolkit**: a throwaway probe test (write, run, delete) settles most behavioral
  suspicions in a minute. Before claiming an import cycle, check for type-only imports.
  Before claiming a bundle includes something, grep the build output for the registered
  name, not the package path.
- If a full check fails for unrelated pre-existing reasons, record the exact blocker and
  still run the narrow checks that cover the change.
- Drop anything that does not survive. Residual doubt becomes a named risk, not a finding.

## Report or fix

- Order by severity, worst first. Each finding: label, clickable `file:line`, the repro,
  why it matters.
- **Close with what was verified and what was NOT**: unrun checks, device-only behavior,
  anything reasoned rather than run. "No issues survived" is a complete review; say it
  plainly with the residual risk named.
- **"Cannot be verified here" is itself a claim that needs a check.** Search the project
  docs and tooling for a way before writing it, in a review, a commit, a PR or a doc. An
  unattempted limitation is a guess wearing a caveat.
- **A named risk on the critical path is validate-or-block, never an "accepted note."** If
  it can only be verified on a device or in a target environment, run it there, hold the
  merge, or put it to the project owner explicitly as a merge decision.
- **Review-and-fix**: small local fixes, a test where the bug could regress, then summarize
  fixes and verification.
- **Mutation-test every guard the diff adds, and every guard you add fixing it.** Break the
  behavior on purpose, see the guard go red with the expected message, restore. Report which
  mutation you ran. Rules:
  - Restore from a `cp` backup, never `git checkout -- <file>`: on a file whose only diff is
    your work, that reverts the change along with the mutation.
  - One mutation per behavior asserted, not per test.
  - Mutate back to the bug itself (re-apply the original broken line), not a neighbor of it.
  - For a scan/regex guard, list its must-flag and must-pass forms first and test each; one
    mutation proves it can fail, not that it matches every real form.
  - When a test mocks the call the change makes, assert through the REAL function at least
    once, under the app's real configuration (retries, defaults), not only a test-friendly one.

**The pattern catalog is write-too.** When a review surfaces a novel, generalizable defect
class (one another agent would plausibly re-introduce), add it to
`docs/ai-failure-patterns.md` (symptom / why / repro / other spots) in the same PR.

## Iterate in rounds until a round comes back clean

One pass is round one, not the review. After fixing a round's findings, run a FRESH pass
over the full current diff, fixes included, ideally in a fresh context (the context that
wrote the fixes must not grade them). **The loop closes only when a round reports zero
Critical/High AND fewer than 3 Medium.** Fold leftover Lows into one fix pass; re-review
only if that fix is large.

A productive round is evidence the next round has yield, not that the work is finished.

**Each round's primary target is the PREVIOUS round's fixes.** Repairs are consistently
more defect-dense than the original: written under "make the finding go away" pressure, in
the reviewer's blind spot. Each round:

1. Diff the fix commit(s) alone and review that first.
2. For every fix that adds a gate/guard/wait/retry, write down its never-satisfied,
   late-arriving and offline cases before accepting it.
3. Re-verify each repair with the instrument that exposed the defect (browser for a browser
   finding, the battery for a battery finding, a live probe for a probe), not with the test
   the repair itself brought.
4. Grade the repair's PREMISE: a fix justified by a claim about existing behavior owes that
   claim evidence.
5. A fix that introduces a RULE (threshold, filter, vocabulary) gives it ONE named home and
   lands it at every surface carrying the old contract, in the same commit.

**Keep score.** Each round report states its counts and how many findings sat inside the
previous round's repairs, e.g. `round 2: 0 Critical / 0 High / 1 Medium, 0 inside round-1
repairs`. The final summary gives rounds run and the closing round's counts. "Reviewed" with
no round count is the single-pass habit under a new name.

**Interim round for long multi-task builds.** Review a shared seam once it exists, not once
the whole feature is stacked on it.

### Before you fix (the repair gets its own discipline)

For every Critical/High, and for any repair that adds a flag, timer, guard, wait, retry, or
rule, do these BEFORE editing:

1. **Root cause in one sentence**: the cause, not the symptom ("two writers own `status`",
   not "the toast shows twice"). `systematic-debugging` applies to review findings too.
2. **Blast radius**: grep every reader and writer of what the repair changes, and every
   surface carrying the same contract. Fix all of them in one commit, or say why one is
   left. A repair that widens what is valid (a value may now be missing/empty) changes every
   function that combines two values; test new x old and new x new. A repair that makes a
   value follow a live input makes every saved copy of it stale; re-derive, lock, or delete
   each copy.
3. **Subtract before you add**: does deleting a writer, state, or branch make the finding
   impossible?
4. **Red first, with the finding's own instrument**: confirm the repro fails on the
   unrepaired code before the repair makes it pass.
5. **Attack the repair alone**: read only the fix diff and name three ways it breaks
   something next to it. Fix or dismiss each with evidence.

Skip only for repairs that change no behavior (copy, comment, rename). When handing a repair
to another agent as a "decided fix", these steps are yours before the brief: name the
contract it restores and how long it must hold, not only the reported path.

### When the loop won't converge, the design is the defect

If by round 3 or 4 each round's top finding still sits inside the previous repair, stop
patching. That is a structural flaw (a second writer, two contracts on one state, a rule
readers keep missing). Ask what ONE structural change makes the whole class impossible;
that redesign is the review's output. Often the cheapest structural change is deleting a
secondary feature; that is the project owner's call, so put it to them before building a
replacement apparatus.

### Parallel reviewers grade a SHA, not a moving tree

Commit before fanning out, give each reviewer the commit range, and do not edit the files
under review until every reviewer has reported. Fold fixes you already know about into the
next round. A finding graded against a half-applied fix gets waved through as "already
handled."

## Review the spec and plan too

This review fires at the spec/plan stage as well as on the diff. A spec or plan from another
agent, a chat export, or a ticket is a hypothesis: verify every named column, endpoint, API,
file and claim against the real code, and enumerate the plan's own edge cases before it
becomes code (`writing-plans`).

## Scale the effort to the change

Default: one focused pass per round with the verification step. For a large or high-stakes
diff (schema migrations, auth/access control, money, broad refactors, many files), fan out
parallel finders by lens, adversarially verify each finding in a separate context, then
dedupe and synthesize. Same precision bar, wider coverage. Prompts:
`references/subagent-prompts.md`. Subagents inherit no skill bodies: inline the rubric and
the hard rules in each brief.
