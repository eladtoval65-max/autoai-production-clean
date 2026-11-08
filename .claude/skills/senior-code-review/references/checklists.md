# Bug-class checklists

Run only the sections the diff touches. Every item is still subject to "no repro, no
report". These are the generic classes that keep recurring in AI-authored code; the
project-specific ones live in `docs/ai-failure-patterns.md`.

## Security and access control

- [ ] Every new table/collection/endpoint has access rules (row-level policies, grants,
      route guards) and they are documented. Anonymous users read only what is intended and
      write nothing they should not.
- [ ] Authorization enforced server-side, never only by hiding UI. Paid/role gates checked
      where the data is served.
- [ ] Cross-user isolation tested with two real accounts and raw API calls, not just the UI.
- [ ] A denied write under row-level security often returns success with 0 rows affected.
      Tests assert the row is UNCHANGED, and client code never infers success from "no error".
- [ ] A multi-step delete does not remove the row a later step's access rule reads for
      authorization (delete the authorizing parent last, or cascade).
- [ ] Privileged keys/secrets never logged, returned, or imported where client code can reach
      them. Grep the build output to prove it.
- [ ] A privileged (service-level) client calling a function gated on "the current user" has
      no current user; such calls fail (or worse, pass) on every invocation.
- [ ] User-, admin- or harvested URLs rendered as links go through a scheme allow-list (no
      `javascript:` sinks). User display strings are stripped of bidi-override controls.
- [ ] Auth-only and anon-only routes both guarded; a gated screen does not flash content
      before the gate resolves.
- [ ] A "move" or "reassign" built as client delete-then-insert across rows whose insert and
      delete policies differ can strand the row. Make it one atomic server-side operation.

## Concurrency and state

- [ ] Bounded sets (seats, quotas, participants) enforced in the database under a lock or
      constraint, not by a client-side count.
- [ ] Edits send only dirty fields, not the whole snapshot taken when the form opened
      (concurrent-editor clobber).
- [ ] Upserts that omit a column keep the previous writer's value. Every writer of a
      multi-writer row sends its whole contract, null included.
- [ ] Realtime/change-feed handlers coalesce or debounce; a bulk write must not trigger a
      refetch storm. Deletes may not arrive through a filtered subscription; invalidate on
      the write side.
- [ ] Stale completions (a response after unmount or account switch) are fenced from UI
      effects but still mark affected caches stale. Abort is not rollback.
- [ ] Fire-exactly-once effects mark their guard only after the dependency is ready, or
      inside the success path; an early no-op must not burn the guard.
- [ ] A retry loop armed from an effect keyed on a boolean that stays true fires once and
      freezes. Key it on the attempt; give every UI hold a deadline.
- [ ] A commit button is disabled while any read that decides part of what it writes is
      pending or failed. "Not decided yet" is distinct from empty.
- [ ] User-private caches keyed by user id as well as entity id, and purged on any user
      change, not only on sign-out.

## Data and schema

- [ ] New foreign-key-like columns have a real reference with an explicit on-delete rule.
- [ ] Filters applied before pagination, not after (or the empty state lies about items one
      page down). Test with a fixture larger than one page.
- [ ] A literal (version, vocabulary value) pinned in several functions or migrations is
      changed in all of them. Grep the old literal first.
- [ ] New migrations sort after the live migration head, not only after the newest file in
      the repo.
- [ ] Maintenance/backfill scripts read with a privilege level that sees every row (drafts,
      unpublished), and print the row count so a narrowed dataset looks wrong.
- [ ] A new column on a shared row type is wired at every read site. Find them by grepping
      sibling columns and select-strings, not from memory.
- [ ] A "vs previous period" delta is hidden when the source began inside that period.
- [ ] A data correction is validated on a random control sample and a random sample of the
      rows it changes, not only on rows picked because they show the defect.
- [ ] Hooks/subscriptions called once per list item multiply into N subscriptions; lift
      them to the list owner and memoize the item.

## Error handling and loading states

- [ ] Transient/offline errors are not collapsed into "not found" or "no access".
- [ ] A list does not flash its EMPTY state before first data arrives; gate on "no data yet
      and not paused", per resource.
- [ ] A pending gate handles all exits: data, paused/offline, error, and partial failure in
      a fan-out (a leg that resolves with an error object is not success, and a fabricated
      zero must not be painted or persisted).
- [ ] Raw backend/provider error text never reaches the user. Errors thrown across the
      client/server boundary serialize as errors, not as a successful payload.
- [ ] Every external call has a timeout; a bad-but-successful response is not cached for its
      whole lifetime; cache lifetime matches the source's real change rate; auth or error
      responses cannot poison a shared cache.
- [ ] Failure states classified and routed per `failure-states`.

## Frontend correctness

- [ ] Hook dependency arrays, stale closures, effect cleanup, identity churn (a default
      `= []` literal per render flowing into a memo dependency renders unbounded).
- [ ] A hook's return object spread onto an element (instead of its handlers property) is
      type-correct and silently dead.
- [ ] Labels point at controls that exist in every render state; a redesign that re-houses
      an input keeps its real `<label for>`.
- [ ] Invented utility class names compile to nothing silently. Grep the established
      convention or render the surface.
- [ ] Text truncation only works on width-bounded elements; verify with a long value in a
      real browser at the target viewport.
- [ ] Syntax newer than the oldest supported engine can fail a whole module's parse.
- [ ] A "behavior-neutral" refactor is checked on every user-state, consumer and render-state
      of the touched symbol, not only the one the author rendered.
- [ ] A fix justified by one platform's semantics, landing on a path all platforms share,
      needs an explicit platform gate.
- [ ] New user-facing copy lands in every locale file; a removed call site does not orphan
      its key.

## Tests and guards

- [ ] Every guard added was observed failing (mutation-tested), against the bug itself.
- [ ] A regression fixture is arranged so the assertion CAN fail; ask what would have to be
      true for it to go red, then build that.
- [ ] A test of a cross-boundary reader pins the producer's REAL shape, not a model of it.
- [ ] A forced re-render in a hook test can mask exactly the bug it guards; test the
      primitive that owns the reactivity.
- [ ] A guard already red on the base branch hides every new offender behind it. Collect
      all offenders, assert once, and diff the offender set against a base worktree.
- [ ] A verification gate that skips on missing config, `continue-on-error`s, or `|| true`s
      must fail closed or announce the skip.
- [ ] Guarded helpers still sit on the live path after the diff; a test on a path nothing
      takes any more protects nothing.
- [ ] Executable snippets in docs/skills that import app code are executed by a test.

## Claims, docs, and process

- [ ] A plan item dropped mid-build because "X already handles this" carries a `file:line`
      trace, a test, or an observation. No evidence means the claim IS the finding.
- [ ] "Verified" names the surface it was verified on and how it was reached. A mock, unit
      test or reasoning does not verify a real surface that was one click away.
- [ ] Doc sentences state what was observed, or are hedged. Implied-but-unobserved behavior
      written as fact is a defect.
- [ ] Claims about LIVE state (a flag's rollout, a setting) come from the live row, not the
      seed or default in the repo.
- [ ] A fix for "X is silent about Y" is applied at every channel that emits Y (stdout,
      artifacts, PR bodies, docs), not only the one named.
- [ ] A reported-defect fix is verified at the reporter's exact coordinates/screenshot and
      across the defect's full class.
- [ ] A feature that depends on dashboard/host configuration the repo cannot see has a live
      probe, not only a checklist line.
- [ ] Hand-numbered ledger IDs allocated by reading the current max can collide across
      parallel branches.
- [ ] Generated and vendored files untouched by hand.
