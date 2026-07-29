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
lastUpdated: 2026-07-28
relatedDocs:
  - ../../overview.md
  - positioning.md
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when product purpose changes
---

# Skopos Vision

Skopos makes coding agents reliable participants in real software projects by giving
them durable project memory, current intent, safe capabilities, coordination, and
evidence-backed closure.

## Changelog

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

1. guide an agent to understand the real project
2. restructure project docs into a predictable Memory standard after approval
3. preserve durable truth in tracked human-readable sources
4. compile compact local state for fast retrieval
5. protect current Task intent from drift
6. expose project-specific capabilities as Actions
7. enforce deterministic constraints through Guards
8. coordinate concurrent Sessions honestly
9. map acceptance criteria to fresh Evidence
10. explain Readiness in plain language
11. preserve a compact handoff across Sessions and coding-agent hosts
12. improve the project's memory as durable truth changes

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

## Success Criteria

Skopos succeeds when:

1. a fresh agent Session can continue a Task without the user restating context
2. a messy existing project becomes more predictable after adoption
3. a small project does not pay monorepo-scale ceremony
4. nested Scopes retrieve the correct local and inherited Memory
5. Unisane can replace its project-specific LLM workflow with generic Skopos plus
   Unisane-owned extensions
6. several same-directory Sessions do not silently overwrite one another
7. expensive checks are not repeated when fresh Evidence remains valid
8. false completion is blocked
9. deleting `.skopos/**` loses no durable project truth
10. Codex and Claude Code receive equivalent operating context
11. the first public release contains no prototype compatibility layer

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
