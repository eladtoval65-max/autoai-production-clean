#!/usr/bin/env node
// PreToolUse(PR-open) hook, OPTIONAL: put the approved mock in front of the model before the
// work is handed over.
//
// WHY: a screen can pass types, tests, browser checks and the whole Definition of Done while
// diverging from the mock the owner approved, because every automated check compares the build
// to its own spec doc, and the spec doc can drift from the mock. "Re-open the mock while you
// build" is an instruction that reads as satisfied; this is the version that interrupts.
//
// HOW: a spec doc opts in by declaring, in HTML comments,
//     <!-- design-artifact: path/to/mock.html -->        (repo path, or an http(s) URL)
//     <!-- design-governs: src/screens/checkout/, src/components/Cart.tsx -->
// Each `design-artifact` is paired with the `design-governs` that follows it. When the branch
// diff touches a governed path (prefix match; a directory covers everything under it), the FIRST
// PR-open attempt for the branch is blocked once with the mock and what to compare. The retry
// goes through: one interruption at the decision point is the whole intervention.
//
// It cannot prove anyone looked; it is a checkpoint, like reflect-before-merge.
// Matches: GitHub MCP PR-create tools and Bash `gh pr create ...`.
// Config: DESIGN_SPEC_DIRS (comma-separated, default "docs"; scanned recursively for *.md),
// GIT_DEFAULT_BRANCH (else origin/HEAD, else main, else master).
// Fails OPEN on everything unexpected. Marker state lives in the OS temp dir, never the repo.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

const pass = () => process.exit(0);
const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8", timeout: 5_000, stdio: ["ignore", "pipe", "ignore"] }).trim();

let payload = {};
try {
  payload = JSON.parse(readFileSync(0, "utf8") || "{}");
} catch {
  pass();
}
if ((payload.tool_name === "Bash" || typeof payload.tool_input?.command === "string") && !/(^|[;&|\n]\s*)gh\s+pr\s+create\b/.test(String(payload.tool_input?.command ?? ""))) {
  pass();
}

let branch = "";
let changed = [];
try {
  branch = git("branch", "--show-current");
  let base = process.env.GIT_DEFAULT_BRANCH ? `origin/${process.env.GIT_DEFAULT_BRANCH}` : "";
  if (!base) {
    try {
      base = git("symbolic-ref", "--short", "refs/remotes/origin/HEAD");
    } catch {
      base = existsSync(join(root, ".git/refs/remotes/origin/master")) ? "origin/master" : "origin/main";
    }
  }
  const mergeBase = git("merge-base", base, "HEAD");
  changed = git("diff", "--name-only", `${mergeBase}..HEAD`).split("\n").filter(Boolean);
} catch {
  pass();
}
if (!branch || changed.length === 0) pass();

function* markdownFiles(dir, depth = 0) {
  if (depth > 6) return;
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* markdownFiles(p, depth + 1);
    else if (e.name.endsWith(".md")) yield p;
  }
}

const claims = [];
try {
  const dirs = (process.env.DESIGN_SPEC_DIRS || "docs").split(",").map((d) => d.trim()).filter(Boolean);
  for (const dir of dirs) {
    for (const file of markdownFiles(join(root, dir))) {
      const source = readFileSync(file, "utf8");
      const re = /<!--\s*design-(artifact|governs):\s*(.+?)\s*-->/g;
      let current = null;
      for (const m of source.matchAll(re)) {
        if (m[1] === "artifact") {
          const ok = /^https?:\/\//.test(m[2]) || existsSync(join(root, m[2]));
          current = ok ? { doc: relative(root, file), artifact: m[2], governs: [] } : null;
        } else if (current) {
          current.governs = m[2].split(",").map((p) => p.trim()).filter(Boolean);
          if (current.governs.length) claims.push(current);
          current = null;
        }
      }
    }
  }
} catch {
  pass();
}

const tripped = claims.filter((c) =>
  c.governs.some((g) => changed.some((f) => f === g || f.startsWith(g.endsWith("/") ? g : `${g}/`))),
);
if (tripped.length === 0) pass();

try {
  const dir = join(tmpdir(), "claude-design-gate");
  mkdirSync(dir, { recursive: true });
  const repoKey = root.replace(/[^\w.-]+/g, "_");
  const marker = join(dir, `${repoKey}__${branch.replace(/[^\w.-]+/g, "_")}.seen`);
  if (existsSync(marker)) pass();
  writeFileSync(marker, new Date().toISOString());
} catch {
  pass();
}

const lines = tripped.map((c) => `  - ${c.artifact}\n      spec: ${c.doc}\n      governs: ${c.governs.join(", ")}`);
process.stderr.write(
  `Design gate (once per branch): this branch changes screens whose design was APPROVED as a mock. ` +
    `Open the mock and compare the built screen against it frame by frame (states, controls, copy, ` +
    `layout) before handing this over. Where the mock and the spec doc disagree, the approved mock ` +
    `wins and the doc gets corrected.\n\n${lines.join("\n")}\n\nRe-run the call when the comparison is done.\n`,
);
process.exit(2);
