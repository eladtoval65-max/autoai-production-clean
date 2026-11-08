# DECISIONS — what we chose and why

The log of real either/or calls, so nobody (human or agent) re-litigates them. If a question has
an answer here, the answer stands until someone deliberately reverses it — and the reversal gets
its own row.

## How to use this file

- Append a row (newest first) when making a real either/or call; keep it to one line each.
- Link the deep dive (a doc, PR, or issue) instead of restating it.
- Reversing a decision = a new row that names the row it replaces.
- Referenced by: `CLAUDE.md` (Where to look), `document-work` (Definition of Done),
  `senior-code-review`, `brainstorming` (check here before proposing approaches).

| Date       | Decision                                                  | Why (and what we accepted)                                                   |
| ---------- | --------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 2026-11-08 | Site uses the social-post design language: Heebo 900 headlines, mint "כמה עולה?" car sticker as logo, orange CTA (ink text), deep-green poster hero with our own car drawing. | Owner asked the site to match the new posts: one brand across site and social. |
| 2026-11-08 | Adopt the Claude Harness Kit (skills, ledgers, hooks); owner keeps shipping straight to `main`. | `HARNESS_ALLOW_COMMIT_ON_DEFAULT=1` turns off the "no commits on main" hook rule; scheduled data agents push to main. |
| 2026-11-01 | Youngest-driver question scales only the insurance estimate (×1.8 young, ×1.25 2–5 yrs). | Estimate, labelled; not a quote. |
| 2026-10-31 | No SMS phone verification for now. | Owner decision; revisit before the first insurance-agency meeting. |
| 2026-10-31 | Price-drop emails go to customers only after a verified sender domain. | Resend's shared sender reaches only the account owner. |
| 2026-10-21 | Questionnaire and comparisons use the static, verified catalog — not the old DB seed. | The DB seed had fewer cars and partial costs. |
| 2026-10-21 | No manufacturer logos — initials badges instead. | Logos are trademarks. |
| 2026-10-20 | No stolen-car / police checks; only tell the buyer what to check with the seller. | Owner decision: avoid legal/police involvement. |
| 2026-10-20 | Don't compete with Yad2; only add things that help work with marketplaces. | Owner decision. |
| 2026-10-20 | Operator shown as "אלעד תובל"; the עוסק number (owner's ID) is not published. | Privacy. |
