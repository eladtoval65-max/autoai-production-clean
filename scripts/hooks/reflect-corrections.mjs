#!/usr/bin/env node
// UserPromptSubmit hook: Channel A of the reflection system (docs/reflection.md).
//
// WHAT: when a user message looks like a correction ("no, ...", "that's wrong", "I meant ..."),
// append one mechanical event to `.reflect/<day>/<sid8>.events.jsonl`.
// WHY: the agent's own notes (Channel B) only record gaps the agent noticed. Corrections are the
// gaps the USER had to voice; counting them across sessions is how the daily brief finds the
// same misunderstanding recurring in several threads. Zero model tokens, no stdout, never
// blocks a prompt: always exits 0.
//
// Config: REFLECT_TZ (IANA zone for the day folder; default UTC). Must match every other
// .reflect writer, or one day's notes split across two folders.
// `--repo-root <dir>` exists so a test can drive the hook as a subprocess against a scratch dir.
//
// Read BOTH `prompt` and `user_prompt`: the payload carries `prompt`; a hook that reads only a
// wrong key returns on its first guard for every message and records nothing, silently. If you
// change the key handling, drive the hook with a sample payload and confirm a file appears.

import { createHash } from "node:crypto";
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function resolveRepoRoot() {
  const flag = process.argv.indexOf("--repo-root");
  if (flag !== -1 && process.argv[flag + 1]) return process.argv[flag + 1];
  return process.env.CLAUDE_PROJECT_DIR || join(dirname(fileURLToPath(import.meta.url)), "..", "..");
}

/** sid8 contract (docs/reflection.md): first 8 chars if hex, else first 8 hex of sha1(id). */
export function sid8(sessionId) {
  const head = String(sessionId).slice(0, 8).toLowerCase();
  if (/^[0-9a-f]{8}$/.test(head)) return head;
  return createHash("sha1").update(String(sessionId)).digest("hex").slice(0, 8);
}

/** YYYY-MM-DD in the configured zone (en-CA renders ISO order). Bad zone falls back to UTC. */
export function reflectDay(now = new Date()) {
  try {
    return now.toLocaleDateString("en-CA", { timeZone: process.env.REFLECT_TZ || "UTC" });
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

// Two tiers keep false positives low: STRONG phrases are unambiguous and match anywhere in the
// scanned head; WEAK words only count when they START the message ("please stop the dev server"
// mid-sentence is work, not a correction).
const STRONG = [
  /\bno,\s/,
  /that'?s (wrong|not right|incorrect)/,
  /not what i (asked|meant|wanted)/,
  /\bi meant\b/,
  /\byou (missed|forgot|ignored)\b/,
  /\bi (already )?(said|told you)\b/,
];
const WEAK = [/^\s*actually\b/, /^\s*(please\s+)?stop\b/, /^\s*don'?t\b/, /^\s*wrong\b/, /^\s*nope\b/];

/** The matching marker's source, or null. Exported for tests. */
export function correctionMarker(prompt) {
  const head = String(prompt).slice(0, 120).toLowerCase();
  return STRONG.find((re) => re.test(head))?.source ?? WEAK.find((re) => re.test(head))?.source ?? null;
}

async function main() {
  let raw = "";
  for await (const chunk of process.stdin) raw += chunk;
  const payload = JSON.parse(raw || "{}");
  const prompt =
    (typeof payload.prompt === "string" ? payload.prompt : "") ||
    (typeof payload.user_prompt === "string" ? payload.user_prompt : "");
  const sid = typeof payload.session_id === "string" ? payload.session_id : "";
  if (!prompt || !sid) return;
  if (prompt.trimStart().startsWith("/")) return; // slash command, not prose
  if (prompt.length > 4000) return; // pasted dump: a marker scan would be noise

  const marker = correctionMarker(prompt);
  if (!marker) return;

  const snippet = prompt.replace(/\s+/g, " ").trim().slice(0, 80);
  const dir = join(resolveRepoRoot(), ".reflect", reflectDay());
  mkdirSync(dir, { recursive: true });
  appendFileSync(
    join(dir, `${sid8(sid)}.events.jsonl`),
    JSON.stringify({ ts: new Date().toISOString(), kind: "correction", marker, snippet }) + "\n",
  );
}

import { pathToFileURL } from "node:url";
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main()
    .catch(() => {})
    .finally(() => process.exit(0));
}
