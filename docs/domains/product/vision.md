---
title: Skopos Vision
status: active
owner: skopos-core
id: SKOPOS-PROJECT-VISION
scope: skopos
role: domain
lifecycle: durable
authority: canonical
provenance: accepted
view: target
appliesTo:
  - workspace
lastUpdated: 2026-08-12
relatedDocs:
  - ../../overview.md
  - positioning.md
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../../decisions/D-20260812-intelligent-project-onboarding-contract.md
  - ../../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when product purpose changes
---

# Skopos Vision

Skopos makes coding agents reliable participants in real software projects by giving
them durable project memory, current intent, safe capabilities, coordination, and
evidence-backed closure.

## Changelog

- `2026-08-12`: Made intelligent project onboarding part of the product promise. A
  coding agent investigates and explains the project, while Skopos bounds decisions,
  approval, durable outcomes, and setup Readiness.
- `2026-07-28`: Classified the product vision as durable canonical domain Memory.
- `2026-07-28`: Reframed the vision around one clean pre-release Project Memory,
  Task, Action, Guard, Evidence, Readiness, and Session model. Full adoption now
  converges project docs on the Memory standard instead of permanently mapping
  arbitrary structures.

## Vision

Developers should be able to open Codex, Claude Code, or another capable coding agent
in an adopted repository and discuss the work they want.

The agent should immediately know:

1. what the project is trying to achieve
2. which project truth is canonical
3. which Scope owns the change
4. what the current Task accepts and excludes
5. which Actions the project provides
6. which Guards and approvals apply
7. what other Sessions currently own
8. what Evidence is still required
9. whether the Task is ready to continue, integrate, or close

The developer should not need to restate the architecture, docs structure, cleanup
rules, commands, prior decisions, current progress, or definition of done in each chat.

## Why Skopos Exists

Coding agents are good at reasoning, editing, and using tools. A chat session is a poor
long-term owner for:

1. project-wide truth
2. accepted decisions and rejected paths
3. nested ownership and dependency context
4. multi-session work state
5. project-specific checks and generators
6. deterministic enforcement
7. proof freshness
8. clean continuation after compaction or a different agent

Skopos supplies that missing repo-native layer. It helps the agent work correctly; it
does not become another agent inside the agent.

## Product Promise

For any supported project shape, Skopos should:

1. give a coding agent a complete, bounded work contract for understanding the project
2. let the agent explain findings and ask only material user questions
3. propose meaningful Scopes rather than mirroring arbitrary directories
4. restructure existing docs or create missing Memory from Evidence after approval
5. recommend project capabilities, proportional Policies, and relevant Skills
6. verify that agent instructions and host context delivery actually work
7. preserve durable truth in tracked human-readable sources
8. compile compact local state for fast retrieval
9. protect current Task intent from drift
10. expose project-specific capabilities as Actions
11. enforce deterministic constraints through Guards
12. coordinate concurrent Sessions honestly
13. map acceptance criteria to fresh Evidence
14. explain Readiness in plain language
15. preserve a compact handoff across Sessions and coding-agent hosts
16. improve the project's Memory as durable truth changes

## Design Principles

1. one product language
2. one Task execution authority
3. one Action capability model
4. one Guard enforcement model
5. tracked truth, disposable generated state
6. standard semantic docs grammar, flexible application code structure
7. explicit Scopes for nested and multi-root projects
8. agent analysis before destructive documentation restructuring
9. approval before material human-doc rewrites
10. no false confidence about host, local, or cross-machine safety
11. smallest sufficient context and validation
12. project-specific intelligence outside core
13. no pre-release compatibility debt
14. simple user interaction with strict internal authority
15. deterministic enforcement and freshness; coding-agent judgment and synthesis

## Success Criteria

Skopos succeeds when:

1. a fresh agent Session can continue a Task without the user restating context
2. a messy existing project becomes more predictable after adoption
3. a small project does not pay monorepo-scale ceremony
4. nested Scopes retrieve the correct local and inherited Memory
5. an adopter can replace a project-specific agent workflow with generic Skopos plus
   project-owned extensions
6. several same-directory Sessions do not silently overwrite one another
7. expensive checks are not repeated when fresh Evidence remains valid
8. false completion is blocked
9. deleting `.skopos/**` loses no durable project truth
10. Codex and Claude Code receive equivalent operating context
11. the first public release contains no prototype compatibility layer
12. a developer can complete setup through a clear conversation without operating
    internal artifacts or separate subsystem workflows
13. setup makes future agent work measurably more contextual, bounded, and provable

## North Star

Measure the percentage of tracked Tasks that a fresh supported coding-agent Session can
safely continue and complete:

1. without user context restatement
2. without known Scope or Memory drift
3. without conflicting with another Session
4. with complete acceptance-linked Evidence

## Non-Goals

Skopos does not:

1. provide model inference
2. replace Codex, Claude Code, or another coding agent
3. standardize adopter source-code architecture
4. become a project-management suite
5. become a generic wiki
6. require cloud infrastructure for core local value
7. invent product priorities
8. claim cross-machine live locking without a remote coordination authority
