---
title: Project Mode And Agent Brief Gap
status: active
severity: MUST
owner: skopos-core
lastUpdated: 2026-06-29
---

# Project Mode And Agent Brief Gap

## Summary

Skopos has the right high-level onboarding loop, but the runtime does not yet fully encode project operating mode or generate complete command-level prompts for coding agents.

Without this, agents can still treat every existing project as generic brownfield work, preserve legacy paths when the user wanted cleanup, or rely on chat memory instead of command-provided guidance.

## Impact

- Existing repos that need cleanup may accumulate duplicate patterns.
- Agents may add fallback or compatibility paths unnecessarily.
- Users may need to manually remind agents to follow Skopos.
- `skopos next` may be technically correct but not yet sufficient as a practical agent prompt.

## Needed Fix

Follow `docs/project/agentic-operating-plan.md`, especially the concrete build sequence.

1. Add durable project mode selection:
   - `brownfield`
   - `clean-refactor`
   - `greenfield-in-existing-repo`
   - `new-project`
2. Add a no-legacy / clean-refactor policy pack.
3. Make command outputs include agent prompt briefs with reads, lane, risks, do/do-not guidance, checks, and closure expectations.
4. Make `understand` and trust detect duplicate or legacy patterns when cleanup mode is selected.
5. Surface project mode and cleanup obligations in the UI.
6. Prove the behavior through separate brownfield-preserve and clean-refactor pilots.

## Proof Required

- Run a pilot on an existing project in `brownfield` mode.
- Run a pilot on an existing project in `clean-refactor` mode.
- Confirm agents get different prompts and trust expectations in each mode.
- Confirm cleanup mode produces actionable warnings for duplicate or legacy patterns.

## Changelog

- 2026-06-29: Linked the finding to the concrete agentic operating build sequence and clarified that separate preserve-versus-cleanup pilots are required.
- 2026-06-29: Opened after final product review clarified that project mode and command-guided prompt behavior must become first-class runtime behavior, not only docs guidance.
