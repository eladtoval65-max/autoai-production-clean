#!/usr/bin/env bash
# Stop hook: Definition-of-Done reminder + reflection nudge (docs/reflection.md).
#
# WHAT: when the agent stops, it is reminded (never blocked) about:
#   - uncommitted changes, unpushed commits, or a branch with no remote counterpart;
#   - a unit with no reflection note: the branch has commits today (ahead of the default branch)
#     and no note in the ledger names this branch;
#   - a brief backlog: 3+ complete day-folders in .reflect/ past the brief's watermark.
# WHY: "done" in chat is not done on the remote, and the reflection step is the one most often
# skipped when nothing forces it. The nudge is scoped to the UNIT (branch), not per commit: a
# per-commit trigger re-arms after every push and turns review rounds into ritual notes.
#
# Emits BOTH systemMessage (shown to the user) and hookSpecificOutput.additionalContext (what
# actually reaches the model; systemMessage alone never does). Always exits 0.
#
# Config (env, e.g. via .claude/settings.json "env"):
#   REFLECT_TZ          IANA zone for the reflection day (default UTC; match every writer)
#   GIT_DEFAULT_BRANCH  default branch name (default: origin/HEAD's target, else main, else master)
# Requires git and jq; without jq it stays silent (it can neither guard recursion nor emit JSON).
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0
command -v jq >/dev/null 2>&1 || exit 0

input=$(cat || true)
# Recursion guard: if a Stop hook already continued this turn, stay quiet.
[ "$(jq -r '.stop_hook_active // false' <<<"$input" 2>/dev/null)" = "true" ] && exit 0

tz="${REFLECT_TZ:-UTC}"

# Resolve the default branch.
default="${GIT_DEFAULT_BRANCH:-}"
if [ -z "$default" ]; then
  default=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##' || true)
fi
if [ -z "$default" ]; then
  if git rev-parse --verify -q origin/main >/dev/null 2>&1; then default=main
  elif git rev-parse --verify -q origin/master >/dev/null 2>&1; then default=master
  else default=main; fi
fi
base="origin/$default"
has_base=0
git rev-parse --verify -q "$base" >/dev/null 2>&1 && has_base=1

reasons=()
[ -n "$(git status --porcelain 2>/dev/null)" ] && reasons+=("uncommitted changes")

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
if [ -n "$branch" ] && [ "$branch" != "HEAD" ]; then
  if git rev-parse --verify -q "origin/$branch" >/dev/null 2>&1; then
    # Exclude commits already on the default branch: after a squash-merge the work branch's
    # remote still holds pre-squash history, and a raw count would nag for merged work.
    if [ "$has_base" -eq 1 ]; then
      ahead=$(git rev-list --count "origin/$branch..HEAD" "^$base" 2>/dev/null || echo 0)
    else
      ahead=$(git rev-list --count "origin/$branch..HEAD" 2>/dev/null || echo 0)
    fi
    [ "$ahead" -gt 0 ] && reasons+=("$ahead unpushed commit(s) on $branch")
  elif [ "$branch" != "$default" ]; then
    reasons+=("branch $branch has no origin counterpart")
  fi
fi

# Reflection nudge: only commits this branch AUTHORED (ahead of the default branch) can owe a
# note. Any session's note naming the branch counts: rebasing someone else's reflected PR owes
# nothing. Both compact and pretty JSON spellings of "branch" are matched.
reflect_line=""
if [ -n "$branch" ] && [ "$branch" != "HEAD" ] && [ "$branch" != "$default" ] && [ "$has_base" -eq 1 ]; then
  head_epoch=$(git log -1 --format=%ct HEAD --not "$base" 2>/dev/null || echo "")
  head_epoch=${head_epoch:-0}
  since=$(TZ="$tz" date -d 'today 00:00' +%s 2>/dev/null || echo 0)
  branch_noted=0
  { grep -Fqs -- "\"branch\":\"$branch\"" .reflect/[0-9]*/*.jsonl 2>/dev/null ||
    grep -Fqs -- "\"branch\": \"$branch\"" .reflect/[0-9]*/*.jsonl 2>/dev/null; } && branch_noted=1
  if [ "$branch_noted" -eq 0 ] && [ "$since" -gt 0 ] && [ "$head_epoch" -ge "$since" ]; then
    reflect_line="Reflection note missing for this branch's unit: run the reflect skill and append ONE proof-carrying Channel-B note (recipe: .claude/skills/reflect/SKILL.md section 5; contract: docs/reflection.md). One note per unit, not per push or review round."
  fi
fi

# Brief backlog: complete day-folders (date < today) past processed_through.
brief_line=""
if [ -d .reflect ]; then
  today=$(TZ="$tz" date +%F)
  through=$(jq -r '.processed_through // ""' .reflect/last-brief.json 2>/dev/null || echo "")
  pending=0
  for d in .reflect/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]; do
    [ -d "$d" ] || continue
    day=${d#.reflect/}
    [[ "$day" < "$today" ]] || continue
    [ -n "$through" ] && ! [[ "$day" > "$through" ]] && continue
    pending=$((pending + 1))
  done
  [ "$pending" -ge 3 ] && brief_line="Reflection brief backlog: $pending complete day-folder(s) unprocessed. Information only: mention it once when the work is done; run daily-brief only when the owner asks."
fi

dod_line=""
if [ ${#reasons[@]} -gt 0 ]; then
  dod_line="DoD reminder (${reasons[*]}): docs in the same PR; INVARIANTS/DECISIONS/IMPACT-MAP if touched; follow-ups filed; commit, push, and verify on origin (see .claude/skills/document-work)."
fi

ctx=""
for line in "$dod_line" "$reflect_line" "$brief_line"; do
  [ -z "$line" ] && continue
  [ -n "$ctx" ] && ctx="$ctx"$'\n'
  ctx="$ctx$line"
done
[ -z "$ctx" ] && exit 0

summary="${reasons[*]:-}"
[ -z "$summary" ] && [ -n "$reflect_line" ] && summary="reflection note pending"
[ -z "$summary" ] && summary="reflection brief backlog"
# jq --arg, never hand-built JSON: the text is full of quotes.
jq -n --arg s "$summary" --arg c "$ctx" \
  '{systemMessage: $s, hookSpecificOutput: {hookEventName: "Stop", additionalContext: $c}}'
exit 0
