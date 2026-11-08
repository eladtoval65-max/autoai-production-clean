#!/usr/bin/env node
// PreToolUse(Bash) hook: block the bulk-footgun shell forms an agent reaches for by habit.
// Exit 2 blocks the call and the stderr text tells the model what to do instead; everything
// else exits 0. Fails OPEN on any error of its own (unparseable payload, git unavailable).
//
// Rule 1 — `git add -A` / `git add --all` / `git add .`: bulk staging lets generated files,
//   scratch files and secrets ride into a commit silently. A clean result is luck, not
//   discipline. Stage explicit paths.
// Rule 2 — whole-tree overwrite: `git checkout [ref] -- .`, `git checkout .`,
//   `git restore [flags] .`. A bare `.` pathspec clobbers every uncommitted change in the tree.
//   Targeted forms (`git checkout -- path/to/file`) stay allowed.
// Rule 3 — `git add` / `git commit` while HEAD is on the default branch (main, master, or the
//   configured/auto-detected default). The moment that matters is the FIRST write of a unit;
//   `checkout`, `fetch`, `pull`, `rebase`, `merge` on the default branch stay allowed — they are
//   how you get off it and keep it current.
// Rule 4 — killing by command line: `pkill -f <pattern>`, or `pgrep -f <pattern>` feeding a
//   kill. `-f` matches every process's FULL command line, and the shell running this command
//   carries <pattern> in its own, so the kill takes that shell down too. A bracket-class pattern
//   (`[v]ite dev`) cannot match its own text, so it stays allowed; so does a `pgrep -f` that
//   only lists.
//
// Default branch: $GIT_DEFAULT_BRANCH if set, else origin/HEAD's target, else main/master only.
// Known false positive (accepted): a multi-line command whose LINE begins with a forbidden form
// as prose (e.g. a heredoc commit body). Rephrase the prose; the block message says so.
// `forbiddenReason` is exported so a project can matrix-test it without spawning the hook.

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

// Command position only: start of line/command or after a separator, not mid-prose.
const CMD = String.raw`(^|[;&|]\s*|&&\s*|\n\s*)`;
const RULES = [
  {
    re: new RegExp(CMD + String.raw`git\s+add\s+(-A|--all|\.)(\s|$)`, "m"),
    msg:
      "Blocked: `git add -A` / `git add --all` / `git add .` stage everything, including " +
      "generated and scratch files. Stage explicit paths with `git add <paths>`.",
  },
  {
    // checkout/restore whose pathspec is the bare `.` token; `.gitignore` or `src/x` don't match.
    re: new RegExp(CMD + String.raw`git\s+(checkout|restore)\s+([^\n;&|]*\s)?\.(\s|$)`, "m"),
    msg:
      "Blocked: whole-tree `git checkout/restore ... .` silently clobbers uncommitted work. " +
      "Name the exact paths instead.",
  },
];

const FULL_FLAG = String.raw`(?:-[a-zA-Z]*f[a-zA-Z]*|--full)`;
const PATTERN = String.raw`(?:-\S+\s+)*(?<pat>"[^"]*"|'[^']*'|\S+)`;
const PKILL_FULL = new RegExp(
  CMD + String.raw`pkill\s+(?:-\S+\s+)*?` + FULL_FLAG + String.raw`\s+` + PATTERN,
  "m",
);
const PGREP_FULL = new RegExp(
  String.raw`pgrep\s+(?:-\S+\s+)*?` + FULL_FLAG + String.raw`\s+` + PATTERN,
  "gm",
);
/** A `[x]` class in the pattern: the regex then cannot match the pattern's own text. */
const selfSafe = (pattern) => /\[[^\]]+\]/.test(pattern);

function killsByCommandLine(command) {
  const pkill = command.match(PKILL_FULL);
  if (pkill && !selfSafe(pkill.groups.pat)) return true;
  // A pgrep that only lists kills nothing; one whose ids reach a `kill` does.
  if (!/\bkill\b/.test(command.replace(/\bpkill\b/g, ""))) return false;
  for (const match of command.matchAll(PGREP_FULL)) if (!selfSafe(match.groups.pat)) return true;
  return false;
}

const WRITES_BRANCH = new RegExp(CMD + String.raw`git\s+(add|commit)(\s|$)`, "m");

/**
 * Returns the block message for a forbidden command, or null when allowed. Pure: pass the
 * current branch and the protected branch names. `branch` null = unknown, so rule 3 abstains.
 */
export function forbiddenReason(command, branch = null, protectedBranches = ["main", "master"]) {
  if (typeof command !== "string" || !command) return null;
  for (const rule of RULES) if (rule.re.test(command)) return rule.msg;
  if (killsByCommandLine(command)) {
    return (
      "Blocked: `pkill -f` (or `pgrep -f` feeding a kill) also matches THIS shell, whose command " +
      "line carries the pattern, so the kill takes down the command running it. Kill by port " +
      "(`kill $(lsof -t -iTCP:<port> -sTCP:LISTEN)`), by PID, or make the pattern self-safe with " +
      "a bracket class: `pgrep -f '[v]ite dev'`."
    );
  }
  if (branch && protectedBranches.includes(branch) && WRITES_BRANCH.test(command)) {
    return (
      `Blocked: staging/committing while on \`${branch}\` (never commit directly to the default ` +
      "branch). Move to a work branch first: `git checkout -b <branch>` keeps the working tree, " +
      "staged changes included."
    );
  }
  return null;
}

function git(args) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      timeout: 3_000,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function protectedBranches() {
  const set = new Set(["main", "master"]);
  if (process.env.GIT_DEFAULT_BRANCH) set.add(process.env.GIT_DEFAULT_BRANCH);
  const head = git(["symbolic-ref", "--short", "refs/remotes/origin/HEAD"]);
  if (head) set.add(head.replace(/^origin\//, ""));
  return [...set];
}

async function main() {
  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;
  let command = "";
  try {
    command = JSON.parse(raw || "{}")?.tool_input?.command ?? "";
  } catch {
    return; // unparseable payload: never block on our own failure
  }
  if (typeof command !== "string" || !command) return;
  // Only shell out to git when rule 3 could apply.
  const needsBranch = WRITES_BRANCH.test(command);
  const branch = needsBranch ? git(["branch", "--show-current"]) : null;
  // Project setting (כמה עולה): the owner ships straight to main (Vercel production) and the scheduled data
  // agents push there too, so HARNESS_ALLOW_COMMIT_ON_DEFAULT=1 turns rule 3 off. Rules 1, 2 and 4 stay on.
  const allowDefault = process.env.HARNESS_ALLOW_COMMIT_ON_DEFAULT === "1";
  const reason = forbiddenReason(command, branch || null, needsBranch && !allowDefault ? protectedBranches() : []);
  if (reason) {
    process.stderr.write(reason + " If this matched prose inside a heredoc, rephrase that line.");
    process.exitCode = 2;
  }
}

// Hook execution runs this file directly; test imports must not consume stdin.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .catch(() => {})
    .finally(() => process.exit(process.exitCode ?? 0));
}
