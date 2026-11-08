---
name: author-a-skill
description: Use when a recurring job has no skill, or when creating, editing, adapting or vendoring a skill — deciding skill vs doc, naming, SKILL.md structure, writing a precise trigger description, attribution for adapted skills, the CLAUDE.md routing line, and drift tests.
---

# Author a skill (meta)

Skills are this repo's playbooks: hard-won procedure encoded once, loaded on demand by a trigger.
This skill keeps them consistent so they don't drift as they multiply.

## When a skill — and when not

- **A skill** = a _procedure_ an agent repeats: steps, checklists, sharp edges, templates
  (`ship-it`, `systematic-debugging`). The signal to author one: a recurring job was just done
  "from memory" for the second time, or a reflection shows a missed step.
- **A doc** (`docs/<topic>.md`) = _knowledge_: architecture, measurements, decisions, schema. If
  the content explains rather than instructs, it's a doc.
- **A path-scoped rule** (`.claude/rules/<area>.md`) = a constraint that must hold whenever
  certain files are touched, regardless of which task is running.
- **Subtractive rule:** skills point to docs, they don't duplicate them. If a skill restates a
  doc, replace the body with a pointer. One fact, one home.

## Structure

```
.claude/skills/<kebab-name>/
  SKILL.md          # required
  scripts/          # optional helper scripts the skill invokes
  references/       # optional deep reference material, loaded only when needed
  agents/           # optional subagent definitions
```

`SKILL.md` frontmatter:

```yaml
---
name: <kebab-name> # matches the directory
description: Use when ... — <what it covers>.
---
```

**Adapted from an outside skill?** Even rewritten rather than vendored byte for byte, it keeps its
source: a one-line attribution at the top of the body, plus a `<NAME>-NOTICE.md` in
`.claude/skills/` (upstream repo, commit, licence, what changed) and the licence text where the
licence requires it. Do this when you adapt it, not later — provenance is hard to reconstruct.

## Writing the trigger (`description`) — the part that matters most

The `description` is what routes a task to the skill; a vague one means the skill never fires.
Rules:

- Start with **"Use when …"** and enumerate the _real phrasings_ a user or task uses, including
  the domain's own vocabulary and any non-English terms your users actually type.
- Name concrete artifacts ("any table, RPC, enum, access policy") not abstractions ("database
  work").
- Mention what it covers after a dash, so a reader can judge relevance without opening it.
- Say what it is NOT for when a sibling skill is the better fit ("NOT for X — use Y").
- Keep it one sentence-ish; the body is for detail.

## Body conventions

- Terse, tabular, imperative.
- Lead with the _why/model_, then numbered **steps** or checklists an agent can execute.
- Flag sharp edges inline (the blocked fetch, the silent type coercion) — those are the skill's
  whole value.
- Keep the rule and its reasoning; drop the war story. One sentence of "why" beats a paragraph of
  history.
- Cross-link sibling skills instead of restating them ("builds on writing-plans").
- End with a **"Keep in sync"** section: name the sources of truth that, when changed, require
  updating this skill.

## Wiring (a skill isn't done until it's discoverable)

1. **`CLAUDE.md` routing line** — add a "X → `<skill-name>`" bullet in the matching section (the
   loop, or other routing). The description gets the skill considered; the routing line makes it
   mandatory where it must fire.
2. **`docs/IMPACT-MAP.md`** — add an edge if the skill encodes coupling (changing a schema or
   config ⇒ update this skill).
3. **Drift guard** — if the skill encodes enumerable facts (schema columns, feature keys, config
   values), name the authoritative source in "Keep in sync"; where a cheap test can catch drift,
   prefer adding one over prose. When the skill depends on what a script or workflow DOES, run it
   in the test rather than pinning its text. Then mutation-test the guard at the boundary and
   toward over-strictness, not only by deletion: a deleted check proves the check exists, not that
   its edges are right (an off-by-one at a version floor survives deletion-only mutants).

## Subagents don't see skill bodies

A spawned agent gets its brief and CLAUDE.md, not the skills the orchestrator had loaded. If a
skill's rule must reach a subagent, the brief names the skill to load AND repeats the two or three
constraints the task can violate. Write skills so their hard constraints are short enough to
inline.

## Editing an existing skill

- Update from the _actual current code/docs_, not memory — verify file paths and commands still
  exist before claiming them.
- If the change reflects a decision, log it in `docs/DECISIONS.md`.
- Keep the trigger stable unless the scope genuinely changed — CLAUDE.md and other skills point
  at it.
- Watch the size: a skill that keeps accreting anecdotes stops being read. When editing, trim
  something stale for each thing you add.

## Keep in sync

- `CLAUDE.md` § The loop / Other routing — the routing lines this skill tells you to add.
- `docs/IMPACT-MAP.md` — coupling edges for skills.
