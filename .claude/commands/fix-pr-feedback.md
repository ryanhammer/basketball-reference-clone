---
allowed-tools: Bash(gh api:*), Bash(gh pr view:*), Bash(git add:*), Bash(git commit:*), Bash(git push:*), Read, Edit, Write
argument-hint: "<pr-number>"
description: Fetch inline PR review comments and address each actionable one, then commit and push
---

## Context

- PR number: $ARGUMENTS
- Current branch: !`git branch --show-current`
- PR overview: !`gh pr view $ARGUMENTS`
- Inline comments: !`gh api repos/ryanhammer/basketball-reference-clone/pulls/$ARGUMENTS/comments`

## Your task

1. Parse the inline review comments above. For each comment:
   - If it is actionable (requires a code change), address it directly in the file
   - If it is already resolved, informational only, or a question that doesn't require a change, skip it and note why
2. After addressing all actionable comments, group related changes into a single commit with a clear message describing what was fixed and why
3. Push the branch

Do not address comments that are style preferences unless they conflict with a rule in CLAUDE.md or agent-skills/coding-preferences.md. Do not open new issues or leave TODO comments — fix the problem or skip it with a note.
