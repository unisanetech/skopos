---
title: Skopos Positioning
status: active
owner: skopos-core
id: SKOPOS-PROJECT-POSITIONING
scope: skopos
role: domain
lifecycle: durable
authority: canonical
provenance: accepted
view: target
appliesTo:
  - workspace
lastUpdated: 2026-08-13
relatedDocs:
  - vision.md
  - ../../overview.md
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../../decisions/D-20260813-company-ownership-and-first-release-host-support-boundary.md
  - ../../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when market or product boundary changes
---

# Skopos Positioning

Skopos is the repo-native operating memory and trust layer for coding agents.

## Changelog

- `2026-08-13`: Bound first-release host claims to real-host Evidence. Codex is the
  sole certified launch adapter; Claude Code, Cursor, and GitHub Copilot projections
  remain unverified until their own real-host proof exists. Recorded company-owned
  repository governance without changing Skopos into a Unisane product dependency.
- `2026-07-28`: Classified product positioning as durable canonical domain Memory.
- `2026-07-28`: Removed versioned and Node-only product framing. Positioned the first
  release as one clean, project-agnostic Memory and Readiness layer whose implementation
  is proven across different repository and language shapes.

## Category

Skopos sits beneath coding agents and inside the repository as:

1. durable Project Memory
2. Task intent and continuation state
3. project capability discovery
4. deterministic Guard and approval enforcement
5. local Session coordination
6. Evidence and Readiness infrastructure

It is not a coding agent, a model provider, a prompt collection, or a project-management
tool.

## Primary User

1. developers and technical founders using coding agents on real repositories
2. teams running several agent Sessions against shared project state
3. maintainers adopting agents into complex monorepos or inconsistent brownfield code
4. open-source projects that want vendor-neutral agent instructions and proof

## Primary Adoption Wedge

The clearest initial value is an existing project where agents currently:

1. rediscover structure in each chat
2. follow stale or conflicting docs
3. add a second pattern beside the intended one
4. run the wrong checks
5. lose accepted direction across Sessions
6. interfere with another active agent
7. claim completion from a summary rather than proof

Skopos turns that project into a predictable agent environment through guided analysis,
approved documentation restructuring, scoped Memory, Actions, Guards, and Readiness.

## Differentiation

| Alternative | What it lacks |
| --- | --- |
| chat history or agent memory | repo-owned authority, portability, deterministic proof |
| a large `AGENTS.md` | scoped retrieval, lifecycle, Tasks, Evidence, coordination |
| documentation generator | execution, enforcement, freshness, and closure |
| generic script runner | impact selection, safety, Evidence, and project Memory |
| project-management tool | source-bound context and agent-native operation |
| one vendor's agent hooks | host-neutral Project and Task truth |

## Support Discipline

The Skopos implementation may initially be written and packaged with Node.js. That is
an implementation fact, not the adopter product model.

The first release must prove:

1. small and large repositories
2. single-package and monorepo projects
3. healthy and messy brownfield projects
4. at least one non-Node adopter fixture
5. custom project Actions and Guards
6. real-host behavior for every coding-agent host it publicly claims to support

Claims stay limited to what the proof matrix passes. The product is not described as a
versioned compatibility step.

The first `next` release claims Codex support only. Claude Code, Cursor, and GitHub
Copilot may receive host-neutral instructions, generated projections, or a reviewed
manual workflow, but those surfaces are described as unverified until current
real-host Evidence proves the exact capabilities claimed. Their verification is a
later support expansion, not a first-release blocker.

## Product And Repository Identity

Skopos is governed from `https://github.com/unisanetech/skopos` and released as
`@skopos/cli`. Company ownership provides durable source and release governance; it
does not make Skopos part of a Unisane application or introduce Unisane-specific
runtime dependencies, configuration, Actions, Guards, or product language into core.

## Non-Goals

1. own model inference
2. replace the developer's coding agent
3. impose one application architecture
4. turn every edit into heavyweight process
5. keep arbitrary docs layouts forever
6. add project-specific doctrine to core
7. offer false live coordination guarantees
8. maintain prototype compatibility before launch
