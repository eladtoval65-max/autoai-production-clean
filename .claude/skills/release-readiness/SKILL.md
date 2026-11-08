---
name: release-readiness
description: Use before a launch, public opening, marketing push, or any release expected to bring high or spiky traffic. A tiered pre-launch checklist: load-testing the write paths, third-party and provider limits, access-control audit, abuse and rate limiting, observability, uploads, realtime, auth flows, caching, devices, backups and rollback, and legal basics, with a launch gate that green-lights only when every blocker is done.
---

# Release readiness (pre-launch verification)

A grounded pre-launch procedure. Tiers: **[BLOCKER]** launch-blocker, **[SHOULD]**
week-one hardening, **[NICE]** fast-follow. Green-light only when every BLOCKER is done.

## How to run it

1. **Copy this checklist into a project doc** (e.g. `docs/release-readiness.md`) and adapt
   each section to the real stack. Delete items that do not apply with a one-line reason; add
   the project's own risks. Keep the doc and this checklist in step when the risk surface
   changes.
2. **Record what is already solid**, with the evidence (a `file:line`, a test, a
   measurement), in an "Already verified, don't re-litigate" section. Re-check only if the
   code under it changed.
3. **Every checked box carries evidence**: a command run, a measurement, a test, a link. A
   box ticked from reasoning is unchecked. Claims about live configuration come from the
   live system, not from defaults in the repo.
4. **Log new must-never-break facts** found by the audit into `docs/INVARIANTS.md`, and real
   either/or choices into `docs/DECISIONS.md`.
5. Unfinished SHOULD/NICE items become issues in the tracker, not a footnote.

## 1. Third-party providers and their limits [BLOCKER]

- [ ] [BLOCKER] Every free or public-tier service the app depends on at runtime (maps, tiles,
      geocoding, email, AI, search, image hosting) is checked against its usage policy at the
      expected volume. A "development / low volume only" policy is a blocker at real traffic.
- [ ] [SHOULD] Each provider has a documented fallback or degrade path (hide the feature,
      serve cached, switch provider) and you know who flips it.
- [ ] [SHOULD] Rate limits and quotas of every paid plan are known against expected peak load.
- [ ] [NICE] Required attribution displayed; long-lived assets cached with long max-age.

## 2. Load-test the write paths [BLOCKER]

Reads are usually cacheable; writes hit the database directly and are the usual surprise.

- [ ] [BLOCKER] Concurrency test (k6, artillery, or similar) on every user write path:
      signup/login, content submission, the core create/update flows, collaborative edits.
      Watch database CPU, connections, error rate and 95th-percentile latency.
- [ ] [SHOULD] Read sanity: many concurrent cold loads of the main screen; confirm cache hits
      on the second request.
- [ ] [SHOULD] Know the hosting and database plan ceilings (CPU, connections, realtime,
      egress, function concurrency) vs expected load.
- [ ] [NICE] A cache hit/miss debug header on cacheable endpoints.

## 3. Observability [BLOCKER]

- [ ] [BLOCKER] Error monitoring on client AND server before launch, with alerts that reach a
      human.
- [ ] [SHOULD] Product analytics on the launch funnel and core events (follow the project's
      event contract if it has one).
- [ ] [SHOULD] Uptime monitoring and alerting: a synthetic check on the main screen and one
      write endpoint.
- [ ] [SHOULD] Server logs retained; someone knows how to read server error rates.

## 4. Access control and data security [BLOCKER]

- [ ] [BLOCKER] Every table/collection/endpoint has access rules; anonymous users read only
      what is intended and write nothing they should not.
- [ ] [BLOCKER] Cross-user isolation tested with **two real accounts and raw API calls**, not
      just the UI (private lists, user content, entitlements, invites).
- [ ] [BLOCKER] No self-granting of roles or entitlements: every grant is admin or
      server-gated.
- [ ] [BLOCKER] Privileged keys never in the client bundle: grep the build output.
- [ ] [SHOULD] Query plans under load: every column used by an access rule or a hot filter is
      indexed.

## 5. Abuse, rate limiting, data trust [BLOCKER]

- [ ] [BLOCKER] Every user write family is rate-limited per user AND per IP, with the client
      IP taken from a header the edge sets (a forged forwarding header must not move it).
      Limits are tunable at runtime and have a kill-switch.
- [ ] [SHOULD] User-generated content has a trust story: dedupe, moderation queue, report
      button, or proof gate.
- [ ] [SHOULD] Invite/referral codes are not enumerable; redemption is rate-limited and the
      last-slot race is atomic.
- [ ] [NICE] Auth bursts: the auth provider's signup and confirmation-email limits hold
      under a spike.

## 6. Uploads and storage [SHOULD]

- [ ] [SHOULD] Max size and content-type enforced on every upload, client AND storage policy.
- [ ] [SHOULD] Users cannot overwrite or delete others' files; path scoping is correct.
- [ ] [SHOULD] Deleting content or an account removes its files (no orphans).
- [ ] [NICE] Strip location and camera metadata from uploaded photos.
- [ ] [NICE] Image fallback holds when a source returns 404 or 429.

## 7. Realtime and collaboration [SHOULD]

- [ ] [SHOULD] Stress one shared object with many concurrent editors: connections vs plan cap,
      fan-out.
- [ ] [SHOULD] Subscriptions unsubscribe on unmount and reconnect cleanly after a network drop.
- [ ] [SHOULD] Concurrent edits to bounded resources do not clobber or desync.

## 8. Auth, onboarding, gates [SHOULD]

- [ ] [SHOULD] Real-device full flow: signup -> confirm -> login -> refresh/expiry -> logout ->
      reset -> magic link; expired tokens degrade gracefully.
- [ ] [SHOULD] Any access gate (beta, paywall) shows no content flash before it resolves, and
      deep links cannot bypass it.
- [ ] [SHOULD] Anonymous-to-signed-in transitions preserve the user's intent.
- [ ] [NICE] Account deletion removes all user data, files included.

## 9. Serving and caching [SHOULD]

- [ ] [SHOULD] Cacheable endpoints return cache hits; cache keys and invalidation verified.
- [ ] [SHOULD] Version-bump invalidation works end to end, including any persisted client
      cache.
- [ ] [NICE] Client storage stays within budget after a burst of new content.
- [ ] [NICE] Security headers (CSP, HSTS, referrer-policy) and CORS configured.

## 10. Devices and networks [SHOULD]

- [ ] [SHOULD] A pass on the target browsers and devices: gestures, sheets, safe areas,
      keyboard, every supported locale and text direction.
- [ ] [SHOULD] Slow network and offline: skeletons, cached render, graceful write failures
      (`failure-states`).
- [ ] [NICE] A QA matrix for any native shells being shipped.

## 11. Backups, rollback, disaster recovery [SHOULD]

- [ ] [SHOULD] Automated database backups on, plus a **tested restore** to a scratch
      environment.
- [ ] [SHOULD] A written rollback plan: how to revert the deploy, and what the data-level
      fallback is.
- [ ] [SHOULD] Migration safety: every live schema change is committed; a bad migration is
      reversible.

## 12. Legal, privacy, attribution [NICE]

- [ ] [NICE] Terms and privacy policy current and linked; they cover user content, location
      data and disclaimers. Legal text gets a qualified reviewer.
- [ ] [NICE] Content and photo licensing settled; attribution displayed where required.
- [ ] [NICE] Every permission prompt explains why.

## The launch gate

Green-light only when every BLOCKER is done with evidence: provider limits checked, write
paths load-tested, error monitoring live, access control audited with two accounts, abuse
and rate limiting on every write path. SHOULD items are the week-one hardening list; NICE
items are fast-follows, each filed in the tracker.
