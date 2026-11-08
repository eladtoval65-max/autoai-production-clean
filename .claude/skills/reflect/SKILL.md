---
name: reflect
description: Use when asked to reflect, run a retro, audit why work failed or slipped, improve the skills/workflow from a completed unit, or before every merge of an unreflected unit ("merge", "ship it", "let's merge") — compare asked vs delivered from evidence, fix the highest-leverage gap now, and record ONE proof-carrying note that says what will change next time.
---

# Reflect: turn hindsight into the next behavior

A reflection is not an essay or a ledger entry. It is complete only when it ends in one of
three evidenced outcomes:

- **fixed**: the work or process changed now, and the change was verified
- **owner decision**: the useful lever needs a product/scope decision; ask precisely
- **no change justified**: evidence shows the existing guard is sufficient, or the event
  exposes no reusable process gap

Writing a lesson, naming a missed skill, or appending to `.reflect/` does not complete the pass.
The note format is `docs/reflection.md` (Channel B); this skill is the loop around it (Channel C).

## When it fires

**Once per UNIT of work** (the PR-sized deliverable): when asked, and before merging a unit not
yet reflected on. The loop is brainstorm → plan → build → review in rounds until a round finds 0
Critical/High and fewer than 3 Medium (`senior-code-review`) → **reflect** → merge → suggest
next. `scripts/hooks/reflect-before-merge.mjs` holds the merge of an unreflected branch; a
branch already carrying its proof-carrying note merges with no ceremony. A fresh note is not
proof the pass happened, so do the pass, not just the note.

NOT a unit: a review round, a rebase, a conflict resolution, or merging a PR another session
built and reflected. Those fold into the unit's single pass and single note. A round that
surfaced something real belongs in the unit's note (`went_wrong` / `surprised`).

## 1. Reconstruct from evidence

Read the actual thread, diff, commits, checks, and PR. State briefly:

1. **Asked**: the owner's target, including corrections and re-explanations.
2. **Planned**: the intended scope and proof.
3. **Delivered**: what the diff and verification actually establish.

Name the strongest choice, the worst moment or lucky escape, and any broken assumption. Credit
guards that fired. Do not infer a clean result from a clean-looking implementation.

## 2. Choose the highest-leverage gap

Do not catalog every imperfection. Pick the gap most likely to matter again.

- Ask **what made this look correct at the time?**
- Ask **how could the workflow permit it?**
- Cite the evidence for each answer.
- Stop when the answer names a lever in the repo: code, test, hook, skill, invariant, or doc.

"Be more careful" and "I should have checked X" are not causes. Convert them into the missing
signal or gate. Use deeper branching root-cause analysis only for a repeated, high-impact, or
genuinely ambiguous failure; verify each branch instead of guessing.

## 3. Act before reporting

Close the defect in the work first. Then choose the smallest durable process lever, in order:

1. executable test, guard, hook, or automation
2. replace, merge, or remove an existing skill/checklist instruction
3. invariant (`docs/INVARIANTS.md`), failure pattern (`docs/ai-failure-patterns.md`), or the
   owning topic doc
4. new skill text, only when a real trigger or reusable procedure is missing (`author-a-skill`)

Prefer changing an existing instruction over appending another. An addition must name the
incident it prevents and tell a future agent what decision or action changes. Route durable
knowledge with `document-work`.

Sweep every skill that shaped the unit: skills that fired, should have fired, governed the failed
phase, or shaped user-facing output. For each, decide whether its trigger failed, its procedure
lacked the needed lever, or existing text failed to earn its place. Do not stop after fixing the
obvious one. Whole-repo pruning belongs to `daily-brief`, where recurrence data can tell a stale
rule from one that simply was not relevant here; do not edit unrelated skills from one session.

Defer only when aggregate evidence belongs in `daily-brief` or the lever needs an owner decision.
Shared rulebooks (`CLAUDE.md` and the ledger docs) receive single-line appends only; the brief
owns restructuring.

## 4. Prove and report

Verify the change at the level it claims to improve. Report compactly:

- asked / planned / delivered gap
- what made the miss locally reasonable
- highest-leverage process gap
- artifact changed and verification run
- outcome: **fixed**, **owner decision**, or **no change justified**

If the reflection changed no artifact, the evidence for the other two outcomes is mandatory.

## 5. Close the ledger: append ONE note

Write the note object (fields and meaning: `docs/reflection.md` § Channel B) to a scratch file
outside the repo, then append it from the repo root. The command fills `ts` and `branch`, routes
to `.reflect/<day>/<sid8>.jsonl`, and refuses a note the merge gate would reject:

```bash
node -e '
const fs=require("fs"),cp=require("child_process"),cr=require("crypto");
const n=JSON.parse(fs.readFileSync(process.argv[1],"utf8")),s=process.env.CLAUDE_CODE_SESSION_ID||"";
if(!s)throw new Error("CLAUDE_CODE_SESSION_ID is empty");
const h=s.slice(0,8).toLowerCase(),sid=/^[0-9a-f]{8}$/.test(h)?h:cr.createHash("sha1").update(s).digest("hex").slice(0,8);
const today=new Date().toLocaleDateString("en-CA",{timeZone:process.env.REFLECT_TZ||"UTC"}),day=process.argv[2]||today;
if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||day>today)throw new Error("bad or future --day");
n.ts=new Date().toISOString();n.branch=n.branch||cp.execSync("git branch --show-current").toString().trim();
const bad=[];const ne=v=>typeof v==="string"&&v.trim()!=="";
if(!["fixed","owner-decision","no-change-justified"].includes(n.outcome))bad.push("outcome");
if(!/^(empirical|test|construction|none)\b/.test(n.verified||""))bad.push("verified prefix");
if(!ne(n.process_verification))bad.push("process_verification");
const a=n.process_artifacts;if(!Array.isArray(a)||a.some(p=>!ne(p)||p.startsWith(".reflect/"))||(n.outcome==="fixed"&&!a.length))bad.push("process_artifacts");
if(n.outcome!=="fixed"&&!(ne(n.asked)&&ne(n.did)))bad.push("asked/did");
for(const k of ["skills_fired","skills_missed"])for(const id of n[k]||[])if(!fs.existsSync(".claude/skills/"+id))bad.push(k+": "+id);
if(bad.length)throw new Error("note rejected: "+bad.join(", "));
fs.mkdirSync(".reflect/"+day,{recursive:true});fs.appendFileSync(".reflect/"+day+"/"+sid+".jsonl",JSON.stringify(n)+"\n");
console.log(".reflect/"+day+"/"+sid+".jsonl");
' /path/to/note.json            # optional 2nd arg: the real work day (YYYY-MM-DD) for a late append
```

Then commit the printed path with the unit (`ship-it`: stage that exact path) and push. Record
the exact outcome, the changed process artifacts (each must be in the branch diff for `fixed`),
the verification, the skills actually read, and the skills that should have fired. A missing
capability goes in `friction`, not `skills_missed`. The daily brief handles cross-session
recurrence; this pass handles what can be fixed with current context.

## Keep in sync

`docs/reflection.md` (lifecycle and note contract) · `ship-it` (commits the note) ·
`daily-brief` (aggregate tier) · `scripts/hooks/reflect-before-merge.mjs` (merge checkpoint; its
proof check and the recipe's validation must agree) · the CLAUDE.md trigger line.
