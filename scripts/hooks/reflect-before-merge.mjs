#!/usr/bin/env node
// PreToolUse hook on the merge path: the reflect gate (docs/reflection.md, Channel C).
//
// WHY: the loop is brainstorm -> plan -> build -> review -> REFLECT -> merge. Every other step
// leaves an artifact something checks; reflection lives in prose, and "merge!" routes nothing.
// This hook puts the reflection step in front of the model at the one moment it can't be skipped.
//
// WHAT IT CAN CHECK: that the branch carries a PROOF-CARRYING note (fields below), not that a
// real reflection happened. It is a checkpoint on unreflected units, not a toll on reflected ones
// and not a lie detector; the daily brief audits what notes claim.
//
// Tiers (in order):
//   0. Not our unit: nothing ahead of the default branch, not a merge call -> pass.
//   1. Backstop: no Channel-B note anywhere in the branch diff -> block, every attempt (no cap:
//      appending a note is always possible).
//   2. Pass: a note in the diff is proof-carrying for this branch (any session wrote it).
//      2b. Review checkpoint (once): the diff changes code but no branch note lists
//          "senior-code-review" in skills_fired -> block once, retry proceeds.
//   3. Checkpoint: notes exist but none is proof-carrying -> block once, then once more with a
//      follow-through message, then yield. A gate that can permanently strand an
//      owner-approved merge is worse than one that can be out-waited.
//
// Proof-carrying = branch matches (skipped on detached HEAD); outcome in
// {fixed, owner-decision, no-change-justified}; verified starts with
// empirical|test|construction|none; non-empty process_verification; process_artifacts is an
// array of repo paths, none under .reflect/; fixed => >=1 artifact, all in the branch diff;
// other outcomes => non-empty asked and did.
//
// Known limits (accepted): an earlier unit's note on a long-lived branch also opens the gate for
// the next unit; one reflected checkout can merge a different pullNumber. ship-it owns both.
//
// Matches: GitHub MCP merge tools (any tool_input) and Bash `gh pr merge ...`.
// Config: GIT_DEFAULT_BRANCH (else origin/HEAD, else main, else master); REVIEW_SKILL (default
// "senior-code-review"; set to "" to disable tier 2b).
// Exit 2 blocks with the stderr message. Fails OPEN on every error. State lives in the OS temp
// dir, never the repo: a gate must not dirty the tree it guards.

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const LOOP = "brainstorm -> plan -> build -> review -> REFLECT -> merge";
const REVIEW_SKILL = process.env.REVIEW_SKILL ?? "senior-code-review";

const BLOCK = {
  backstop:
    `Reflect gate: this branch carries no reflection note (nothing under .reflect/ in the branch ` +
    `diff), so the unit about to merge was never reflected on. The loop is ${LOOP}; merge approval ` +
    `does not skip the step before it. Run .claude/skills/reflect/SKILL.md, fix what it surfaces ` +
    `in this PR, append the Channel-B note (docs/reflection.md), push, then merge.`,
  checkpoint:
    `Reflect gate: this branch has a reflection note, but none is PROOF-CARRYING for it. Needed: ` +
    `"branch" = this branch; outcome fixed|owner-decision|no-change-justified; "verified" starting ` +
    `with empirical|test|construction|none; non-empty process_verification; process_artifacts = ` +
    `repo paths (not .reflect/); fixed => at least one artifact, all in the branch diff; other ` +
    `outcomes => non-empty asked and did. Validate the note before suspecting the gate. Repair or ` +
    `append the note, push, then re-run the merge.`,
  followThrough:
    `Reflect gate (second hold): still no proof-carrying note for this branch. Append or repair ` +
    `it, push, then merge. If the pass genuinely has nothing to record, retry once more: the gate ` +
    `yields rather than strand an approved merge, but the ledger debt stands.`,
  review:
    `Reflect gate (once): this diff changes code, but no branch note lists "${REVIEW_SKILL}" in ` +
    `skills_fired. Run it over THIS diff in rounds until a round finds 0 Critical/High and fewer ` +
    `than 3 Medium, fix what it finds, add it to the note's skills_fired, push, then merge. ` +
    `Already reviewed? Retry once and it proceeds.`,
};

const OUTCOMES = ["fixed", "owner-decision", "no-change-justified"];
const nonEmpty = (v) => typeof v === "string" && v.trim() !== "";

export function isProofCarryingNote(note, changedFiles = null) {
  if (!note || typeof note !== "object") return false;
  if (!OUTCOMES.includes(note.outcome)) return false;
  if (typeof note.verified !== "string" || !/^(empirical|test|construction|none)\b/.test(note.verified)) return false;
  if (!nonEmpty(note.process_verification)) return false;
  const arts = note.process_artifacts;
  if (!Array.isArray(arts) || arts.some((p) => !nonEmpty(p) || p.startsWith(".reflect/"))) return false;
  if (note.outcome !== "fixed") return nonEmpty(note.asked) && nonEmpty(note.did);
  if (arts.length === 0) return false;
  return !changedFiles || arts.every((p) => changedFiles.includes(p));
}

/** Channel-B note files in a diff (never the .events.jsonl Channel-A files). */
export const noteFiles = (changed) =>
  changed.filter((p) => /^\.reflect\/\d{4}-\d{2}-\d{2}\/[^/]+\.jsonl$/.test(p) && !p.endsWith(".events.jsonl"));

/** Code = anything but docs, tests, notes, and common generated/lock files. Narrow on purpose. */
export const changesCode = (changed) =>
  changed.some(
    (p) =>
      !p.startsWith(".reflect/") &&
      !p.startsWith("docs/") &&
      !/\.(md|mdx|txt|json|lock|ya?ml|svg|png|jpe?g|gif|webp)$/i.test(p) &&
      !/(^|\/)(__tests__|tests?)\//.test(p) &&
      !/\.(test|spec)\.[^/]+$/.test(p) &&
      !/\.gen\.[^/]+$/.test(p),
  );

/** Pure decision over injected facts; returns a BLOCK key or null. */
export function decide({ ahead, hasNote, proof, codeChanged, reviewRecorded, attempts, reviewFired }) {
  if (!(ahead > 0)) return null;
  if (!hasNote) return "backstop";
  if (proof) return codeChanged && !reviewRecorded && !reviewFired && REVIEW_SKILL ? "review" : null;
  if (attempts === 0) return "checkpoint";
  if (attempts === 1) return "followThrough";
  return null;
}

function isMergeCall(payload) {
  const tool = String(payload.tool_name ?? "");
  if (tool === "Bash" || typeof payload.tool_input?.command === "string") return /(^|[;&|\n]\s*)gh\s+pr\s+merge\b/.test(String(payload.tool_input?.command ?? ""));
  return true; // settings.json only routes merge tools here
}

function prId(payload) {
  const ti = payload.tool_input ?? {};
  const m = String(ti.command ?? "").match(/gh\s+pr\s+merge\s+(?:-\S+\s+)*#?(\d+)/);
  return String(ti.pullNumber ?? ti.pull_number ?? m?.[1] ?? "unknown").replace(/[^\w.-]/g, "");
}

const git = (args) =>
  execFileSync("git", args, { encoding: "utf8", timeout: 5_000, stdio: ["ignore", "pipe", "ignore"] }).trim();

function defaultBase() {
  if (process.env.GIT_DEFAULT_BRANCH) return `origin/${process.env.GIT_DEFAULT_BRANCH}`;
  try {
    return git(["symbolic-ref", "--short", "refs/remotes/origin/HEAD"]);
  } catch {
    for (const b of ["origin/main", "origin/master"]) {
      try {
        git(["rev-parse", "--verify", "-q", b]);
        return b;
      } catch {}
    }
  }
  return null;
}

function readNotes(paths) {
  const notes = [];
  for (const p of paths) {
    let blob = "";
    try {
      blob = git(["show", `HEAD:${p}`]);
    } catch {
      continue; // not readable at HEAD: not proof
    }
    for (const line of blob.split("\n")) {
      try {
        if (line.trim()) notes.push(JSON.parse(line));
      } catch {}
    }
  }
  return notes;
}

async function main() {
  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;
  const payload = JSON.parse(raw || "{}");
  if (!isMergeCall(payload)) return;
  const sid = String(payload.session_id ?? "nosession").slice(0, 8).replace(/[^\w-]/g, "");

  const base = defaultBase();
  if (!base) return;
  const ahead = Number(git(["rev-list", "--count", `${base}..HEAD`]));
  const branch = git(["branch", "--show-current"]); // "" on detached HEAD: branch match skipped
  const changed = git(["diff", "--name-only", `${base}...HEAD`]).split("\n").filter(Boolean);
  const files = noteFiles(changed);
  const notes = readNotes(files).filter((n) => !branch || n.branch === branch);
  const proof = notes.some((n) => isProofCarryingNote(n, changed));
  const reviewRecorded = notes.some((n) => Array.isArray(n.skills_fired) && n.skills_fired.includes(REVIEW_SKILL));

  const markerDir = join(tmpdir(), "claude-reflect-gate");
  const marker = join(markerDir, `${sid}-pr${prId(payload)}.json`);
  let state = { attempts: 0, reviewFired: false };
  try {
    state = { ...state, ...JSON.parse(readFileSync(marker, "utf8")) };
  } catch {}

  const key = decide({
    ahead,
    hasNote: files.length > 0,
    proof,
    codeChanged: changesCode(changed),
    reviewRecorded,
    attempts: state.attempts,
    reviewFired: state.reviewFired,
  });
  if (!key) return;

  try {
    mkdirSync(markerDir, { recursive: true });
    const next =
      key === "review"
        ? { ...state, reviewFired: true }
        : key === "backstop"
          ? state // backstop never caps, so it never spends an attempt
          : { ...state, attempts: state.attempts + 1 };
    writeFileSync(marker, JSON.stringify(next));
  } catch {
    // unwritable temp dir: the block stands, the next attempt simply re-runs the same tier
  }
  process.stderr.write(BLOCK[key]);
  process.exitCode = 2;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .catch(() => {
      process.exitCode = 0; // fail open on any error of our own
    })
    .finally(() => process.exit(process.exitCode ?? 0));
}
