---
name: failure-states
description: Use when anything in the product can fail or interrupt the user: an error, failed load, retry, offline / no connection, stale or not-refreshed content, not found, expired link, no permission, form validation, an error toast, a confirmation dialog ("Are you sure?"), or a render crash; and whenever a state looks generic or AI-made (centered icon circle, red error card, "Something went wrong"). Classifies the failure into one of seven classes, decides what must survive on screen, and routes it to ONE channel before any mock or code.
---

# Failure states: classify before you draw

**The model:** feedback appears at the closest place to the problem that still lets the
user fix it. **A popup is a fallback, not a default.** A failure is never an excuse to throw
away a screen the user already has.

This skill owns the DECISION: which class, what survives, which channel, what to research.
The project's design doc owns exact tokens, durations and component names; record them
there (and link it from CLAUDE.md § Where to look), not here.

## The seven classes: pick exactly one, first

| Class                | The situation                                     | Chrome kept               | Action                                        |
| -------------------- | ------------------------------------------------- | ------------------------- | --------------------------------------------- |
| **action**           | a write or tap failed, the screen still works     | everything                | toast; retry only if retrying can help        |
| **section**          | one region of a working screen failed             | everything                | inline notice in that region, small "Try again" |
| **stale-content**    | refresh failed, cached content is on screen       | everything, content stays | quiet notice naming the time, "Refresh" text button |
| **page first-load**  | the route's own data never arrived                | header + navigation       | ONE primary "Try again", no secondary         |
| **offline/no-cache** | no connection AND nothing cached to show          | header + navigation       | "Go back"; resolves itself on reconnect       |
| **terminal**         | expired / not found / no access: retry is a lie   | header + navigation       | ONE destination CTA, never retry              |
| **crash**            | a component threw                                 | route-level: nav survives | "Reload" + "Go back"                          |

**page first-load vs offline/no-cache** is the distinction most often wrong. First-load names
the OBJECT that failed ("Your invites didn't load") and carries retry. Offline names the
CONNECTION ("You're offline") and carries no retry, because reconnecting resolves it. Never
both a page state and a toast for the same failure.

## The four steps

1. **CLASSIFY.** Name the class before opening a file. In code, centralize the triage: one
   function maps a query's state to `ok | pending | stale | empty | failed`, and one maps an
   error to `{kind, code, retryable, surface}` without ever returning raw backend text.
   **Never read the error flag before the data**: that is how a failed background refresh
   blanks a screen that had content (stale-content collapsing into page first-load).
2. **PRESERVE.** List what stays on screen: header, navigation, the cached list, the
   half-filled form, scroll position. Justify anything you remove. Classes action, section
   and stale-content keep the whole screen; the rest keep the app chrome. A full-screen
   takeover is only for a crash of the root.
3. **CHANNEL.** Route through the table below. One failure gets exactly ONE channel.
4. **RESEARCH -> design lock -> mock -> owner approval -> build.** Look at how shipped apps
   handle this exact state (one leading reference, at most three); consult motion references
   only when motion decides the state. Then resolve ONE coherent design, mock it at the
   target viewport, get approval, and build with the mock open. Use `show-before-after` when
   replacing an existing state.

## Channels

| Channel                | Use for                                                                    | Never                                             |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| **inline validation**  | a field is invalid, a precondition unmet, a server rejection of a field    | a toast; disabling the submit button              |
| **inline notice**      | a section failed, or stale content needs an explanation                    | a page state; a modal                             |
| **toast / snackbar**   | an action failed, or succeeded with an undo, and the screen is still usable | validation; restating a page state; a blocking answer |
| **page state**         | the route has nothing usable to show (first-load, offline, terminal)       | a toast alongside it                              |
| **confirmation sheet** | destructive, before the fact, no safe undo                                 | a confirm for something one tap can undo          |

## Five questions before any popup

1. Is this **validation, transient, confirmation, blocking, section/page, or a crash**?
2. Can the user **fix it in place** (a field, a retry, a reconnect)? Then keep them in place.
3. Is there **usable context** on screen (cached rows, typed input)? Then nothing may replace it.
4. Is it **undoable**? A safe undo replaces a confirm; a confirm is for what cannot be undone.
5. Is it a **repeat** (a retry loop, a re-submit)? Then dedupe by a scope id; never stack.

## Build it once

Build a small set of shared primitives (a page failure, a section notice, a stale notice, a
terminal state, a crash boundary, a toast helper that owns dedupe ids and durations, a
field-error component, a confirmation sheet, the triage functions) and reuse them. A new
hand-rolled icon + title + body + retry block in a screen file is the defect this system
exists to delete. Add a drift test that fails when a screen bypasses the primitives or uses a
banned phrase.

## Never

- A centered **icon-circle + title + body + retry** block as the default shape of a failure.
- A **red card** for a load or network failure. Red is not the color of "it didn't load".
- "Something went wrong", "Oops", "An error occurred", or their equivalents in any locale.
- A generic "Try again" when a destination exists: a terminal state gets a destination CTA.
- **Replacing usable cached content with an error.** Stale content stays; the notice sits
  beside it.
- Raw `error.message`, database/provider error text, or any untranslated vendor string.
- A **toast for field validation**.
- A **duplicate toast + page error** for one failure, or an inline error and a toast saying
  the same words.
- A **success toast that restates a visible state** (the checkmark already shows, the switch
  flipped). Keep a toast only when the outcome is NOT on screen (navigated away, background
  sync, an undo offered).
- A **toast covering a control**: bottom-anchored controls register so the toaster clears them.
- A **red full background** by default, or a warning triangle in a circle.
- A **modal on a transient failure**: a failed save is a toast, not a dialog.
- A **confirmation before every destructive action** when a safe undo exists: ship the undo.

## Copy

The project's copy/voice skill owns the final words; this skill owns the shape.

- **Never guess the cause.** Offline says offline; an unknown failure names the OBJECT that
  did not load ("Your orders didn't load") and nothing about why.
- Two parts, `{title, body}`: the title says what happened, the body says what the user can
  do or what still works. Two lines max.
- Retry is one string product-wide ("Try again"), and it appears only where retrying can
  actually change the answer.
- Every new string lands in every locale file in the same PR.

Examples:

| Class            | Title                       | Body                                               | Action          |
| ---------------- | --------------------------- | -------------------------------------------------- | --------------- |
| action           | Couldn't save your changes  | (none; the toast is the whole message)             | Try again       |
| stale-content    | Showing results from 10:42  | We couldn't refresh just now.                      | Refresh         |
| page first-load  | Your invites didn't load    | Everything else still works.                       | Try again       |
| offline/no-cache | You're offline              | This page will load when you're back online.       | Go back         |
| terminal         | This link has expired       | Ask the sender for a new one.                      | Go to home      |

## Red has two jobs

The **destructive confirm button** and the **invalid field**. Nothing else: not load
failures, not offline, not staleness, not action toasts. If the product shows safety
content, a danger level may also use red, and that exception is written down in the design
doc.

## Motion

- Entrance fires on the **state change, not on mount** (route transitions already animate
  arrival).
- **No idle loops**; nothing bounces or wobbles.
- Reduced motion is a **fade**, specified per state, never "animation: none" on half of it.
- Prefer CSS transitions and platform APIs; a reference library or design tool never
  authorizes adding its runtime dependency without an owner decision.
- Haptics, if any: an error haptic only for a rule refusal the user caused; load, offline,
  stale, crash and failed-write states are silent.

## Accessibility

`role="alert"` on field errors and section notices (rendered on the state change, so it
announces once); every field error wired to its input with `aria-describedby` and
`aria-invalid`; on submit, focus and scroll to the FIRST invalid field with the submit button
still enabled; every retry and toast action keeps a touch target of at least 44px.

## Keep in sync

When the taxonomy, channel table or copy rules change, update the project's design doc, the
primitives, and this skill together, and record the decision in `docs/DECISIONS.md`. Facts
like "no raw error text reaches users" and "red has two jobs" belong in `docs/INVARIANTS.md`
with the drift test as their guard.
