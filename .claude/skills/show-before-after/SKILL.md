---
name: show-before-after
description: Use when showing the project owner a before/after of a change for review or sign-off — a copy/voice pass, a rename, a redesign, a states/flow change, a removed feature or data source, "show me before and after", "let me see the changes", "what changed" — present it as a comparison TABLE, plus a rendered mock page when the change is visual. NOT for internal diffs (use `git diff`) or PR bodies alone.
---

# Show before / after

An owner reviews changes far better from a **table** (and a **rendered mock** when it's UI) than
from prose, a diff, or a list of strings inline in a sentence. This skill fixes the format so every
review looks the same and reads at a glance.

## The rule

1. **Always a table.** Never present before/after as inline prose or a bullet list of strings.
2. **If the change is UI** — anything visual: a screen, component, state, layout, or how copy reads
   _in place_ — **also produce a rendered mock** (below). A table of raw strings doesn't show how
   it lands on the screen; the mock does.
3. **The table is the source of truth**; the mock shows the same rows in context. They must match.

## 1 · The table

One row per change, grouped by screen/surface. Three columns, always this order:

| Surface | Before | After |
| --- | --- | --- |
| `<where it lives — screen · component>` | `<exact current string/state>` | `<exact new string/state>` |

- Use the **real strings**, verbatim, in the language and script they appear in the product —
  never paraphrased or translated for the table.
- Group rows under a heading per screen when there are many (`### /settings`, `### /checkout`).
- Call out anything **intentionally kept** in its own line so "no change" reads as a decision, not
  an oversight.
- **A removal names what it takes away, not only what it drops.** Dropping a source, dataset, type,
  flag or dependency gets a row per capability that goes with it ("regional warnings: none left"),
  not just the source's name. An owner approves "we no longer use source X" very differently from
  "every warning of type Y disappears".
- Markdown tables render fine in chat; keep cells short — long sentences go in the mock, with a
  short label in the table.

## 2 · The rendered mock (UI changes only)

Build a self-contained HTML page that shows the change **as it reads in the app**, then publish or
open it (an artifact/preview link if your environment has one, otherwise a local HTML file) and
hand over the link or path.

- **Speak the app's language** so the mock reads as the product, not a generic page:
  - The product's own fonts, design tokens and text direction (source of truth: the project's
    design doc and stylesheet). Never a flat generic grey palette when the product has its own.
  - Real components and assets when the change is a component: the real icons and imagery, **never
    emoji or invented stand-ins** for product assets.
  - Both light and dark themes if the product has both.
  - Publish to the **same file path** each iteration so the URL stays stable while the owner is
    looking at it.
- A neutral skeleton with before/after rows and a theme scaffold is in
  `references/mock-template.html` — copy it, swap in the product's tokens, fill the rows.

### Sharp edges

- **Punctuation collisions when eliding.** An ellipsis that lands right before a comma renders as
  `…,` and looks broken. Show the full sentence, or elide somewhere clean.
- **Dynamic values** (a computed date, a count, a user name) — mark them in an accent color and
  say once that they're examples, so the owner doesn't read a placeholder as the literal string.
- **Pure-copy changes**: a table usually suffices, but a rendered "as it reads" mock still helps
  when tone, direction or length matters — build it when seeing it in context changes the
  judgement.

## Keep in sync

- The project's design tokens — if the palette or fonts move, update the project's copy of
  `references/mock-template.html`.
- This is the _presentation_ half of a review; building the change follows the loop in CLAUDE.md.
