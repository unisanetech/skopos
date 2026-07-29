---
title: Role-Based Memory And Agent Operating Layer
status: superseded
owner: skopos-core
id: SKOPOS-037-ROLE-BASED-MEMORY-AND-AGENT-OPERATING-LAYER
scope: skopos
role: decision
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
lastUpdated: 2026-07-28
supersededBy: D-8d32a27b
---

# Role-Based Memory And Agent Operating Layer

> Superseded by [Decision D-8d32a27b](../D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md).
> Semantic roles remain, but arbitrary paths are
> discovery input rather than a permanent full-adoption state.

## Decision

Skopos must treat project memory as role-based, not path-based.

Every installed project needs complete canonical memory roles, but Skopos must not force every project into one exact docs tree.

For new projects, Skopos may scaffold the recommended memory structure.

For existing projects, Skopos must first map the docs, instructions, gates, decisions, and findings that already exist. It should only suggest reorganization when the current structure makes agent work unreliable.

## Required Memory Roles

Skopos must be able to identify or create trusted sources for these roles:

| Role | Purpose |
| --- | --- |
| Project purpose | Explain what the project is, who uses it, and what success means. |
| Architecture | Explain layers, boundaries, ownership, and where new code belongs. |
| Domains and features | Explain business areas, modules, and feature ownership. |
| Workflows | Explain important user flows, system flows, jobs, and integrations. |
| Validation and gates | Explain typecheck, test, lint, build, deploy, grep, and review checks. |
| Decisions | Preserve accepted technical or product choices. |
| Findings and risks | Track known problems, cleanup needs, unsafe patterns, and unresolved gaps. |
| Project mode and cleanup policy | State whether work is brownfield, clean-refactor, greenfield-in-existing-repo, or new-project. |
| Agent instructions | Give Codex, Claude Code, Copilot, Cursor, and other agents a compact working contract. |

## Why

Modern coding agents can read repo instructions, run commands, edit files, and use tool-specific memory. That helps, but it does not replace repo-owned project truth.

Agent memories and chat history are not enough because they can be stale, unavailable to another tool, or lost across sessions. Large instruction files are also risky because they can waste context and bury the important rule.

Skopos should therefore keep durable memory in the repo, compile it into compact machine state, and expose practical command guidance to agents.

## Consequences

- `skopos init` must not blindly create duplicate docs when a project already has strong docs.
- `setup review` must ask which docs are canonical when the answer is unclear.
- `skopos understand` must treat scanner output as orientation only, then guide the coding agent to create or confirm durable memory.
- `skopos memory` and the UI must show which roles are mapped, missing, stale, inferred, duplicated, or confirmed.
- `skopos next` must use memory roles to tell the agent what to read before editing.
- Trust must warn when required memory roles are missing, stale, contradictory, or only inferred.
- Instruction mirrors must stay compact and point to the right memory roles instead of copying every rule into every agent file.

## Non-Goals

- Skopos does not require every repo to use `docs/project/*`.
- Skopos does not replace human-readable docs with generated JSON.
- Skopos does not depend on one coding agent vendor.
- Skopos does not make every task use a heavy workpack.

## Changelog

- 2026-06-29: Accepted role-based project memory and command-guided agent operation as the core Skopos model.
