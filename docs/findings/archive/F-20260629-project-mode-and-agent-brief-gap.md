---
title: Project Mode And Agent Brief Gap
status: superseded
severity: MUST
owner: skopos-core
id: SKOPOS-F-20260629-PROJECT-MODE-AND-AGENT-BRIEF-GAP
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-07-28
supersededBy: F-c1e8c13d
---

# Project Mode And Agent Brief Gap

> Superseded by `F-c1e8c13d`. Code-change policy may still distinguish cleanup from
> preservation, but Skopos adoption now has one canonical Memory standard and the
> clean pre-release product does not retain the four-mode prototype contract.

## Summary

Skopos has the right high-level onboarding loop, but the runtime does not yet fully encode project operating mode or generate complete command-level prompts for coding agents.

Without this, agents can still treat every existing project as generic brownfield work, preserve legacy paths when the user wanted cleanup, or rely on chat memory instead of command-provided guidance.

## Impact

- Existing repos that need cleanup may accumulate duplicate patterns.
- Agents may add fallback or compatibility paths unnecessarily.
- Users may need to manually remind agents to follow Skopos.
- `skopos next` may be technically correct but not yet sufficient as a practical agent prompt.

## Needed Fix

Follow the historical `docs/archive/agentic-operating-plan.md`, especially the concrete
build sequence that existed when this Finding was active.

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

- 2026-07-28: Superseded by the canonical product convergence Finding and Plan.
- 2026-06-29: Linked the finding to the concrete agentic operating build sequence and clarified that separate preserve-versus-cleanup pilots are required.
- 2026-06-29: Opened after final product review clarified that project mode and command-guided prompt behavior must become first-class runtime behavior, not only docs guidance.
