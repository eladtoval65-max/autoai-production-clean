---
name: document-work
description: The Definition of Done, and how to document and track work just done. Use before calling any change finished or opening a PR, and when asked to document work, update README/CLAUDE.md/docs, record what shipped, update the issue tracker after a change, find docs a change made stale, or keep future agents aligned with docs and issue state.
---

# Document work (and the Definition of Done)

Bring docs and tracking in line with what just changed. Humans start at `README.md`, agents
start at `CLAUDE.md`. Document from the **actual diff**, not from memory.

In this project (כמה עולה): there is no issue tracker — follow-ups go to `docs/debt-ledger.md` and the
owner-facing roadmap is `AUTOAI_MASTER_PLAN.md` (Hebrew). The kit's generic text follows:

- **`<issue tracker>`**: where follow-ups and work state live (e.g. Linear, Jira, GitHub
  Issues). If the project has none, keep a `docs/debt-ledger.md` and say so in CLAUDE.md.
- **`<product mirror>`**: an owner-facing wiki that mirrors product changes (e.g. Notion,
  Confluence). Optional; never the agent's source of truth.

## Definition of Done (the home: every change gates on this)

A change is **not done** until all of these hold. `ship-it` and CLAUDE.md point here.

- [ ] **Code green on the local gate**: the typecheck, test, lint and build commands from
      CLAUDE.md § Commands, run in this console, on this commit. Read the whole test summary:
      an unhandled error thrown inside a handler can leave the suite "passing" while that
      test's later assertions never ran.
- [ ] **CI is extra signal unless CLAUDE.md says otherwise.** The local run is the proof. A
      red that also fails on the base branch, or a job that died in seconds with no runner,
      is infrastructure; a red on your branch alone that reproduces locally is yours.
- [ ] **LOOK at any screen you built or changed**: screenshot it at the project's target
      viewport and open the image. Checks assert what you thought to assert; they cannot
      surface what you did not think of. Say which screens you looked at and which you could
      not reach (those are the owner's to eyeball).
- [ ] **Diffed against the approved artifact**, if one exists (a mockup, a marked-up
      screenshot, an agreed shape in a thread). Open it and compare frame by frame; where it
      and the spec disagree, the artifact the owner approved wins.
- [ ] **Docs updated in the same PR**, at the right altitude (table below).
- [ ] **Ledgers**: a must-never-break fact touched -> `docs/INVARIANTS.md`; a real either/or
      decision -> `docs/DECISIONS.md`; a new cross-file dependency -> `docs/IMPACT-MAP.md`.
- [ ] **Novel bug class** found and fixed (generalizable, not a one-off typo) -> a new entry
      in `docs/ai-failure-patterns.md`.
- [ ] **New project-wide convention** established by a sweep -> recorded as a CLAUDE.md hard
      rule or in the owning `.claude/rules/*.md`, or it will not bind future agents.
- [ ] **Issue tracker updated on ship**: what shipped, files/docs touched, verification run,
      commit/PR link. Close only when acceptance criteria truly hold.
- [ ] **Product mirror updated** for user-facing changes (if the project has one).
- [ ] **Git hygiene** per `ship-it`: feature branch, explicit staging, no hand-edited
      generated files, pushed, and **verified on origin** (`git log origin/<branch>`).
- [ ] **Reflection note** appended for the UNIT (one per unit, never per push or round;
      contract `docs/reflection.md`).
- [ ] **Plan first** for high-stakes work (money, access control, migrations, broad
      refactors): a concrete plan approved before executing (`writing-plans`).

## Process

1. **Review what changed.** `git log --oneline` since the last doc update; read the diff and
   the new files.
2. **Find now-stale claims before adding anything.** Fixing a wrong sentence matters more
   than adding a new one. Mechanically, grep the docs for every identifier the diff touched:
   - code changes: route paths, screen names, exported function and component names;
   - data/tooling changes: table and column names, script filenames, config keys, and the
     rule the change relied on or broke.
   A doc that describes a changed surface without literally contradicting it is still stale
   if the behavior changed. Hunt hardest for **reassuring** docs ("correct by construction",
   "safe to skip"): a false one stops the next reader from checking, so it survives longest.
3. **Update at the right altitude.** One home per fact; cross-link the rest.

   | Doc                           | Holds                                                         | Audience |
   | ----------------------------- | ------------------------------------------------------------- | -------- |
   | `README.md`                   | What it is, stack, repo layout, how it is served              | humans   |
   | `CLAUDE.md`                   | Index + hard rules + where-to-look list; tight, pointer-based | agents   |
   | `.claude/rules/<area>.md`     | Path-scoped constraints, loaded with matching files           | agents   |
   | `docs/<topic>.md`             | The deep dive, with measurements                              | both     |
   | `docs/INVARIANTS.md`          | Must-never-break facts (rule + home + guard)                  | agents   |
   | `docs/DECISIONS.md`           | Decision log: date, decision, why, rejected alternatives      | both     |
   | `docs/IMPACT-MAP.md`          | Change-X -> also-touch-Y edges                                | agents   |
   | `docs/ai-failure-patterns.md` | Recurring AI-authored defect classes                          | agents   |

4. **Track work state in the issue tracker.**
   - Search before creating; update the existing issue rather than duplicating it.
   - Put shipped facts in a comment: what changed, files/docs touched, verification run,
     follow-up debt, commit or PR link.
   - Mark done only when the real state matches the acceptance criteria. Partial work stays
     open with the remaining scope written plainly.
   - **An unmet criterion is not automatically remaining scope.** Name the next occasion it
     would fire. If that already happened or will never recur, say so and close it rather
     than leaving it open against a hypothetical.
   - **Closing keywords close issues on merge.** Use "fixes/closes <id>" only in the PR that
     fixes it; reference other ids without a keyword. A link made by an earlier version of
     the PR text can outlive the edit that removed it; unlink in the tracker itself.
   - Create a new issue when the change reveals durable debt worth scheduling. Never bury a
     follow-up in a final chat message.
   - If the tracker refuses a write (quota, plan cap), record the follow-up in the repo and
     in the PR, and say so; do not silently drop it.
5. **Keep CLAUDE.md cheap.** It loads into every session. State the rule or gotcha and point
   to the owning doc; when a section grows past a few lines, move the body to `docs/` or a
   `.claude/rules/` file and leave a pointer. Every addition should replace something.
6. **Verify consistency.** Re-grep for the false claim (it should be gone); confirm new
   cross-references resolve and any new doc is listed where docs are indexed.
7. **Commit docs cleanly.** Docs-only commits for documentation follow-ups; in an
   implementation commit, keep the message about behavior and mention docs in the body. Run
   `git diff --check`. Run app tests only when the docs change touches executable code or
   examples.

## What good docs look like

- **Concrete**: real numbers and measurements (`1.2 MB -> ~440 KB`), code paths as
  `file:line`, the actual cache TTLs and limits.
- **The why and the invariant**, not just the what. Flag what must not regress.
- **Observed, or hedged.** A sentence about behavior states what was observed, or says it is
  inferred. Reasoning written as fact is a defect.
- **House style**: match the existing docs. Do not narrate the change like a changelog.

## Don't

- **Document aspirational work as done.** The tell is the present tense in a spec written
  before the build. When a build finishes, re-read the spec's implementation section against
  the code and convert each sentence into what shipped (with the measurement) or a clearly
  marked `Planned:` block. A claim with no number in it is the one to check first.
- Edit generated files to "document" them; describe them in prose.
- Leave a deep dive only in a PR body; the repo doc is the durable record.
- Hide messy debt. Name it, link the file or doc that explains it, and file the follow-up.
