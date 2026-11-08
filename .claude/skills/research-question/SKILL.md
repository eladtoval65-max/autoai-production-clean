---
name: research-question
description: Answer an external factual, legal, or technical question against authoritative sources and report it so the reader can tell what was verified from what was inferred. Use when asked whether something is allowed, what a licence or ToS requires, how a third-party API or SDK behaves, what a standard says, or to check a claim about the outside world — and unprompted before building on a platform or vendor rule whose operative text you have not read (a manifest or entitlement key, an app-store requirement, what an integration automates, which commit or PR keywords close an issue in the tracker). Includes "is this a legal issue", "what does this licence require", "does provider X permit Y". NOT for questions answerable by reading this repo (just read it) and NOT for bugs (use systematic-debugging).
---

# Researching a question about the outside world

Bugs have `systematic-debugging`. This is for the other kind: a question whose answer lives
**outside** the repo — a licence clause, a provider's terms, a standard's wording, an SDK's actual
behaviour, whether some practice is permitted.

It exists because of the most durable AI failure mode (see `docs/ai-failure-patterns.md`): writing
what the code or general knowledge _implies_ into a doc as though it had been observed. That is
exactly what happens when a legal, licence or vendor-behaviour question gets answered from memory —
sound framing, confident tone, primary sources never read.

## 0. What this environment can actually reach

Check this before planning anything:

- Which tools have network egress here (`curl`, a web-fetch tool, a search tool)? Which do not
  (a sandboxed headless browser often has none)?
- Fetch with whatever has egress. A question that genuinely needs a rendered page, a login, or a
  JS-only site you cannot reach **cannot be answered from here** — say so and hand it back.

## 1. Source hierarchy — and it is not a preference

Ranked; go as high as you can reach:

1. **The operative text itself** — the licence, the ToS, the RFC, the statute, the SDK's header or
   source. For a licence question this is the _only_ acceptable source. A summary of a licence is
   not the licence.
2. **The publisher's own documentation** — the provider's terms page, reference docs, changelog.
3. **A named statement from someone who speaks for the project** — a maintainer in an issue, a
   vendor engineer in a support thread. Attributable, dated, and weaker than (1).
4. **Everything else** — blogs, Q&A sites, an LLM's recollection. Useful for _finding_ (1). Never a
   citation on its own.

**Quote the operative clause, do not paraphrase it.** A paraphrase of a legal obligation is a new
obligation. If the answer turns on §4.4, the report contains §4.4's words.

Route by question type — a licence question goes to the licence text and its SPDX entry; an
API-behaviour question goes to the provider's reference, its changelog and, where available, its
source; a standards question goes to the spec and its errata. Do not run one generic search and
take the top result.

## 2. Every claim carries how it was checked

Tag each finding:

- **verified** — quoted from a primary source, with URL and the date fetched.
- **attributed** — a named person or page said it; say who and when.
- **inferred** — reasoned from something else. Say from what. This is the tag that must never be
  silently upgraded.
- **unverified** — could not reach it, could not find it, ran out of road. Perfectly acceptable as
  a result. **Inventing a confident answer is not.**

**A report ends with an explicit list of what is still unverified.** Not a hedging sentence in the
prose — a list, so a reader can see the holes at a glance and a later pass can pick them up.

## 3. Check it against our code, not just against the web

The question is almost always "is _what we do_ allowed / will _our_ usage work", not "what does the
source say in the abstract". So the answer has two halves, and the second is usually the one that
changes the verdict:

1. What the source requires or how it behaves.
2. **What this repo actually does** — read the scripts, the schema, the rendered UI, the config.
   "We scrape provider X" and "we read five boolean fields from provider X's public feed" are
   completely different positions.

Cite our side too, as `path/to/file:line`. A finding with no code reference has not been applied to
us yet.

## 4. Output

A doc in `docs/` (repo naming, not a scratch file), structured so the reader can act:

- The question, in the words it was asked.
- The answer, short, up front.
- Per-source findings with quotes, URLs, fetch dates, and a tag from §2.
- What it means **for us**, with file references.
- **Still unverified** — the explicit list.
- For anything legal: **"Not legal advice"**, plainly, and the questions a lawyer should take.

Update the doc in place on a later pass rather than writing a second one; a question with two
half-answers in two files is worse than one honest gap. If the answer settles a choice, record the
choice in `docs/DECISIONS.md` and link the research doc.

## 5. Scale

One question, or a handful: do it inline. A genuine worklist — dozens of independent items — gets
one subagent per item, each writing its own output file, so the run can resume by checking which
outputs already exist. Do not spin up agents for three questions.

## Keep in sync

- `docs/ai-failure-patterns.md` — the "implied written as observed" pattern this skill guards.
