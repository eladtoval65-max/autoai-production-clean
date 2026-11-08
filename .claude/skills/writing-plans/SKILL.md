---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code — grounds the spec against the real code, runs a scale review, and writes a bite-sized, test-first task plan an engineer with zero context can execute.
---

# Writing Plans

Adapted from obra/superpowers (MIT).

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`
- (User or project preferences for plan location override this default)

## Scope Check

If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

**A one-time data change is a guarded migration, not a tool.** Before planning endpoints, admin screens, dry runs or undo logs for something that runs once (a backfill, a transition, a mass re-categorization), ask the project owner "one-off or tool?" and offer the one-off first: the exact rows for their sign-off, one idempotent data migration that skips with a notice (rather than failing a deploy) when its precondition no longer holds, and a reverse script. Plan a tool only when the job recurs or the owner asks for one.

## Ground the spec first — it may be a hypothesis, not a truth

Before you plan a line of it, run a **logic + edge-case review on the SPEC ITSELF**, not just later on the built diff. A spec authored by a different agent or model, or pulled from a ticket tracker or wiki, was written by someone who never saw this code — its column names, function signatures, API behaviours and "X already handles Y" claims are confident but context-blind. Ground every load-bearing claim:

- **Verify each named artifact against the real code/schema** — every column, function, table, enum value, file path and API behaviour the spec asserts. SQL or code written into a spec is a **skeleton, not a spec**: confirm columns against the live schema and non-trivial constructs against a real parser or a dry run. A count that silently includes rows the UI filters out is invisible until someone reads it against the schema.
- **Platform and vendor BEHAVIOUR claims owe a source line too, not just API names.** Which UI an SDK shows, which value lands in a token claim, whether a misconfiguration errors or crashes, what a server requires vs merely checks — read the vendor's header, reference or source before planning on it (see research-question). These claims are routinely wrong in confident specs and can become release gates.
- **Distrust "already handles X" and stale-comment facts.** An assertion about existing behaviour (a flag is live, a feature isn't shipped, a helper persists something) gets the same evidence bar as a new claim — a `file:line`, a live probe, or an explicit hedge. The same bar holds for a claim the PLAN makes that a set is complete ("one gate covers every write path", "these are all the callers of X"): enforce the rule where every writer must pass (a database constraint or trigger, or the one function all of them call), or build the list with an executable walk of the source tree that becomes a guard test — never from memory.
- **Every field an approval step publishes gets a task that shows it on that approval surface.** If a write path stores something a human later approves, name the task that renders it in the review UI. Approving what you cannot see is approving blind.
- **Enumerate the spec's OWN edge cases** — empty / one / many, null / missing / malformed, concurrent, first-run vs repeat, and the unusual-but-VALID input a context-blind author never pictured. Fold each into a task or a test.

Write the grounding result into the plan (what you verified, what you corrected, what stays unverified). A plan built from an un-grounded foreign spec inherits every one of its blind spots.

## Scale review

Before any build, add a `## Scale review` section to the plan that checks both the spec and the plan for performance and cost at realistic and 10x load. Answer, concretely for this change:

- **Queries:** every new read/write — is it indexed for its filter and sort? Any N+1 (a query per row, a request per list item)? Any unbounded result set without a limit or pagination?
- **Payload:** what does each request return — only the columns/fields the screen uses, or whole rows? Are casts or joins done where the data lives rather than in a loop?
- **Caching:** what can be cached, for how long, and what invalidates it? Does a cache key change shape such that existing caches must be busted?
- **Hot paths:** anything on page load, startup, or per-keystroke? Bundle or boot-size impact of any new dependency?
- **Growth:** what happens to this code path when the table, list or user count grows 10x? Name the first thing that breaks.
- **Cost:** any new metered call (third-party API, function invocation, storage egress) — per-request or per-user, and is it bounded?

Each finding becomes a task step (an index migration, a limit, a select list) or an explicit "accepted, because…" line. "No concerns" is a valid answer only when each question above has been asked.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for. This is where decomposition decisions get locked in.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If the codebase uses large files, don't unilaterally restructure - but if a file you're modifying has grown unwieldy, including a split in the plan is reasonable.
- **One foundation, never two.** Before naming a new file, search for the thing that already does a similar job (grep the concept, its copy keys, its per-type maps). If one exists, the plan extends it or extracts it into a shared foundation (a registry, one shared component, one predicate both the UI and the data path read) and retires the copy in the same change, with a guard test so a third copy cannot appear. Write the search and its result in the plan ("existing: X; this plan: extend X / extract Y"). This is not speculative abstraction: generalize what exists or what the owner named, never a hypothetical third use.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Task Right-Sizing

A task is the smallest unit that carries its own test cycle and is worth a
fresh reviewer's gate. When drawing task boundaries: fold setup,
configuration, scaffolding, and documentation steps into the task whose
deliverable needs them; split only where a reviewer could meaningfully
reject one task while approving its neighbor. Each task ends with an
independently testable deliverable.

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** Execute this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Load the skills named in each task before starting it.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

## Global Constraints

[The spec's project-wide requirements — version floors, dependency limits,
naming and copy rules, platform requirements — one line each, with exact
values copied verbatim from the spec. Every task's requirements implicitly
include this section.]

## Grounding

[What was verified against the code, what was corrected, what stays unverified.]

## Scale review

[See the Scale review section of this skill.]

---
```

## Task Structure

````markdown
### Task N: [Component Name]

**Skills to load:** [the skills this task's executor must load, with the
two or three hard constraints from them that this task could violate,
written out inline]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Interfaces:**
- Consumes: [what this task uses from earlier tasks — exact signatures]
- Produces: [what later tasks rely on — exact function names, parameter
  and return types. A task's implementer sees only their own task; this
  block is how they learn the names and types neighboring tasks use.]

- [ ] **Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

- [ ] **Step 3: Write minimal implementation**

```python
def function(input):
    return expected
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```
````

**Why "Skills to load" is mandatory:** a subagent executing one task inherits the plan text and the project's CLAUDE.md — not the bodies of skills the planner had loaded. A rule that lives only in a skill the executor never loads does not reach it. Name the skills AND repeat the constraints the task can break.

## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures** — never write them:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — the engineer may be reading tasks out of order)
- Steps that describe what to do without showing how (code blocks required for code steps)
- References to types, functions, or methods not defined in any task

## Self-Review

After writing the complete plan, look at the spec with fresh eyes and check the plan against it. This is a checklist you run yourself — not a subagent dispatch.

**1. Spec coverage:** Skim each section/requirement in the spec. Can you point to a task that implements it? List any gaps.

**2. Placeholder scan:** Search your plan for red flags — any of the patterns from the "No Placeholders" section above. Fix them.

**3. Type consistency:** Do the types, method signatures, and property names you used in later tasks match what you defined in earlier tasks? A function called `clearLayers()` in Task 3 but `clearFullLayers()` in Task 7 is a bug.

**4. Snippets obey the rules they ship under:** an executor copies a plan's code as written. Every snippet must pass the project's own rules (`.claude/rules/*.md`, lint rules, the hard rules in CLAUDE.md) for the paths it lands in. A plan snippet that violates a rule carries that bug straight into the build.

**5. Grounding and scale sections present:** both are filled in, not stubbed.

If you find issues, fix them inline. No need to re-review — just fix and move on. If you find a spec requirement with no task, add the task. For a large plan, `plan-document-reviewer-prompt.md` in this directory is a template for an independent reviewer subagent.

## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `docs/superpowers/plans/<filename>.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session, batch execution with checkpoints

**Which approach?"**

**If Subagent-Driven chosen:**
- Fresh subagent per task, each briefed with its task text, the Global Constraints, and its "Skills to load" block
- Review each task's result before dispatching the next; run senior-code-review on the whole change before it ships

**If Inline Execution chosen:**
- Execute tasks in order, stopping at checkpoints for review
- Run the project's checks (typecheck, tests, lint, build) before claiming any task done
