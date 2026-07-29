---
title: Project Modes And Command-Guided Agent Briefs
status: superseded
owner: skopos-core
id: SKOPOS-036-PROJECT-MODES-AND-COMMAND-GUIDED-AGENT-BRIEFS
scope: skopos
role: decision
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
lastUpdated: 2026-07-28
supersededBy: D-8d32a27b
---

# Project Modes And Command-Guided Agent Briefs

> Superseded by [Decision D-8d32a27b](../D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md).
> Project code-change modes may still inform
> project Policy, but the Skopos product itself follows one clean pre-release contract
> and full docs adoption always converges on the Memory standard.

## Decision

Skopos must support explicit project operating modes and command-generated agent briefs.

The supported project modes are:

1. `brownfield`
2. `clean-refactor`
3. `greenfield-in-existing-repo`
4. `new-project`

Skopos commands must use those modes, project memory, accepted policy packs, open questions, findings, and validation surfaces to guide coding agents with clear prompts.

## Why

Agentic coding fails when agents:

- preserve legacy code even when the user asked for cleanup
- add new patterns beside old patterns
- keep fallback paths forever
- scan randomly instead of loading project memory
- claim completion without proof
- force users to repeat the same operating rules in every chat

Existing repo detection is not enough. An existing repo may need safe brownfield work, clean refactoring, or a greenfield reset inside the same filesystem.

## Consequences

- `init` and `setup review` must ask for project mode when it is not already confirmed.
- `understand` must not treat scanner output as full understanding.
- `next`, `start`, `done`, and related workflow commands must include agent-facing guidance, not only machine state.
- Trust should warn when selected mode and observed code conflict, such as a cleanup mode with duplicate legacy and replacement patterns.
- Policy packs can specialize behavior by mode.

## Non-Goals

- Skopos does not replace the coding agent.
- Skopos does not force cleanup mode on every existing project.
- Skopos does not make every small task use a heavy workpack.

## Changelog

- 2026-06-29: Accepted explicit project modes and command-guided agent briefs as core Skopos behavior.
