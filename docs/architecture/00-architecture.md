---
title: Skopos Architecture
status: active
owner: skopos-core
id: SKOPOS-ARCH-BASELINE
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-14
relatedDocs:
  - package-boundaries.md
  - runtime-model.md
  - config-model.md
  - artifact-model.md
  - agent-native-operating-model.md
  - intelligent-project-onboarding.md
  - design-context-model.md
  - docs-governance.md
  - evidence-and-readiness-model.md
  - policy-applicability-and-fixture-governance.md
  - public-package-content-and-provenance.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../decisions/D-20260813-company-ownership-and-first-release-host-support-boundary.md
reviewCycle: when owning truth changes
---

# Skopos Architecture

Skopos is a project-agnostic, repo-native operating Memory layer used by coding agents.
It does not replace the agent: the agent reasons and edits; Skopos preserves project
truth, Task continuity, deterministic constraints, coordination, and proof.

## Changelog

- `2026-08-14`: Bound the public npm artifact to `@unisane/skopos` because the
  third-party `@skopos` namespace is unavailable. The internal package graph and
  `skopos` executable are unchanged; the company scope is release identity, not a
  runtime architecture layer.
- `2026-08-13`: Separated host-neutral adapter architecture from certified host
  support and recorded the standalone company-owned repository boundary. The first
  release certifies Codex only; generated projections never imply support.
- `2026-08-12`: Added one unified intelligent onboarding workflow. It composes
  coding-agent investigation with reviewed Scope, Memory, capability, Policy, Skill,
  instruction, and host-delivery outcomes while preserving their existing authorities.
- `2026-08-11`: Completed the Codex host-delivery boundary for linked children. An
  approved split produces truthful undelivered assignments; the Codex adapter may
  create real tasks, bind returned thread identities as Sessions, and wait for results
  while the originating Session remains an explicit reviewer. CLI and MCP now share
  the audited writer/reviewer transition authority.
- `2026-08-11`: Completed linked parent/child Task execution. Reviewed split proposals
  are digest-bound, child ownership and dependencies are validated before mutation,
  parent closure derives from successful child completion, and existing children can
  be assigned to independent host-neutral Sessions without claiming host chat launch.
- `2026-08-11`: Made post-admission ownership topology-aware and added a
  non-blocking bounded-child recommendation when repeated expansion or a newly
  introduced Scope/impact category indicates semantic Task drift. The recommendation
  is canonical, auditable, and host-visible; agents retain the judgment to accept or
  decline the split.
- `2026-08-10`: Declared `apps/web` as the independent public product website,
  separate from the internal supervision UI and core package family, with app-owned
  registry source and no Skopos runtime dependency.
- `2026-08-09`: Added the Design Context model for bounded, current, and
  provenance-backed product-design knowledge. Design Context remains a supporting
  Skill-system capability rather than a new Skill, package, runtime authority, or live
  inspiration feed.
- `2026-08-09`: Declared separate repository-source and npm-tarball release
  boundaries, exact public Skill runtime assets, private workspace tooling ownership,
  and the requirement for explicit compatible provenance before copied UI source can
  be publicly released.
- `2026-08-09`: Routed repository-family detection, evidence-based policy
  applicability, portable architecture roles, and active fixture governance to the
  canonical applicability model.
- `2026-08-02`: Made tracked Task projection Scope-relative and made reconstruction
  discover Tasks through the catalog of declared Memory roots.
- `2026-07-31`: Made Task persistence concurrency-safe through coordination-backed
  mutation transactions and added admission-time durable Memory obligations with
  explicit reviewed resolution before closure.
- `2026-07-31`: Added the atomic `finish` lifecycle, compact-default agent transport,
  and precise Action source-fingerprint exclusions.
- `2026-07-30`: Made project capability onboarding a reviewed integration: discovery
  produces local candidates, explicit digest-bound approval precedes tracked
  Action/Guard writes, and activation validates providers.
- `2026-07-29`: Promoted the clean first-release architecture built around Project
  Memory, Task, Action, Guard, Evidence, Work Queue, and Readiness.

## Package Layers

1. `model`: public schemas and contracts
2. `config`: configuration loading and validation
3. `indexer`: repository discovery and compiled project indexes
4. `query`: scoped retrieval over compiled and source truth
5. `planner`: optional durable Plans and Task recommendations
6. `docs-engine`: document catalog, metadata, adoption intake, and restructuring contract
7. `instructions`: host-neutral agent instructions and host adapters
8. `verification`: change scope, Evidence, verification, Readiness, and provenance
9. `runtime`: application use cases and orchestration
10. `cli` and `mcp`: public tool surfaces
11. `ui`: an internal projection over the same canonical model

Dependencies point inward. Tool surfaces do not own domain behavior, and runtime does
not duplicate package logic.

## Application Surfaces

Skopos has two deliberately separate application surfaces:

1. `packages/ui` is the private, local supervision console projected from compiled
   Skopos state and bundled through the CLI.
2. `apps/web` is the independently deployable public product website. It owns public
   narrative, marketing compositions, metadata, assets, and reviewed app-owned UI
   source.

The public website is not part of the core SDK package family, does not import the
internal console, and has no dependency on Skopos runtime or compiled local project
state. Its initial Next.js route is static-first; backend, authentication, analytics,
and hosting-provider contracts require separate Decisions.

## Repository Ownership Boundary

The canonical source and release-provenance repository is
`https://github.com/unisanetech/skopos`. `unisanetech` owns company governance around
the standalone Skopos product; it is not a runtime namespace or an adopter-specific
architecture layer. Skopos core and its public package remain project-agnostic and may
not acquire a private Unisane dependency, registry, Action, Guard, path, or product
workflow through repository ownership.

The first public npm artifact is `@unisane/skopos`, exposing the `skopos` executable.
The `@unisane` scope is the company-owned publisher identity selected because the
third-party `@skopos` namespace is unavailable. It does not rename the product, alter
the internal `@skopos/*` workspace graph, or permit Unisane-specific runtime coupling.

## Canonical Operating Loop

The currently implemented operating loop is:

```text
adopt Project Memory
  -> open Session
  -> start or resume Task
  -> retrieve Scope context
  -> claim resources
  -> edit and run Actions
  -> record Evidence
  -> finish (Verify + Readiness + archive)
  -> close or hand off
```

Plan is optional durable direction across Tasks. Work Queue is compiled from tracked
Tasks, Plans, Findings, material questions, dependencies, and Readiness blockers.

The accepted clean-refactor target replaces the visible adoption ceremony with one
`Understand -> Clarify -> Review -> Apply -> Verify` setup journey. Setup is not another
product primitive: its local resumable workflow composes the existing Scope registry,
Project Memory, Actions, Guards, Policies, Skill bindings, instructions, adapters, and
Readiness authorities. Accepted outcomes live with those owners; local drafts and
receipts remain under `.skopos/**`. See
[Intelligent Project Onboarding](intelligent-project-onboarding.md). The target command
surface is implemented through `skopos setup`; lower-level primitives remain available
to the runtime without becoming a second public onboarding journey.

## Project Memory

Tracked sources own durable truth:

1. root instructions and configuration
2. canonical and supporting documents
3. Scope registry and Scope Memory
4. Decisions, Findings, and Patterns
5. Plans and tracked Tasks
6. Action, Guard, Policy, and Skill declarations

`.skopos/**` contains only rebuildable indexes, caches, Session and coordination state,
Evidence envelopes, and UI assets. A clean clone can reconstruct Project Memory and
tracked Task projections without old local state.

Each non-light Task projects to `work/tasks/**` inside its declared Scope Memory root.
Workspace Tasks use the workspace root; child Scopes use their own registered roots.
Reconstruction discovers those portable projections through the Project Memory
catalog across all declared roots, so no project layout or domain convention is built
into Task persistence.

During first setup, Skopos may non-destructively scaffold only the missing workspace
Scope registry with the standard `docs/` Memory root. It does not create inferred
sub-Scopes or overwrite an existing registry; those boundaries stay reviewable setup
recommendations. Once a Scope is declared, a
missing or unsafe `memoryRoot` is an invalid authority declaration and fails closed.

Task admission creates an open Memory obligation when declared ownership overlaps
existing canonical durable Memory. High-impact Tasks receive a Scope-level durable
Memory review obligation even when no Memory document is explicitly owned. A
standard-risk Task also receives a `pattern` or `standard` obligation when its goal and
contract explicitly establish, adopt, codify, enforce, or standardize a project-wide
convention. One-off fixes, polish, copy, color, spacing, and local implementation do not
qualify without explicit durable project scope. Skopos selects existing canonical
same-role Scope Memory when available and otherwise requires the agent to create or
adopt durable Memory—it does not invent a document. Ownership expansion recomputes the
obligation from the preserved Task goal and contract.

Skopos points at existing truth and blocks closure until the agent records either
`memory-updated` or `reviewed-no-change`; it never creates a duplicate Architecture,
Standard, Guide, Decision, Finding, or Pattern automatically.

Task decomposition uses one canonical parent/child relationship. A proposal is local,
review-required, and bound to the exact parent revision. Applying its digest creates
tracked children, records each child's owned paths, dependencies, and mapped parent
acceptance requirements, then blocks the parent until every child completes
successfully. Child state and claim changes synchronize back to the tracked parent.
Completed and other terminal Task projections remain reconstructable from historical
Task Memory after local `.skopos/tasks/**` state is deleted.

## Extension Boundary

Projects contribute:

1. Scopes and Profiles
2. canonical Memory
3. Actions with explicit effects and concurrency
4. deterministic Guards
5. Policies and task-selective Skills

The Skill system may resolve a bounded Design Context Brief from accepted project
truth and a versioned Design Context Library. The library supplies task-selective
domain, experience, and time-sensitive design knowledge; it does not supersede project
components, tokens, brand rules, platform conventions, Policies, Guards, or Skill
ownership. See [Design Context](design-context-model.md).

They do not create another Task, execution, or closure authority. Ordinary user and
system workflows remain valid domain concepts; they are not Skopos primitives.

## Coordination

The local SQLite broker serializes cooperating Session, Task, claim, mutation,
contamination, takeover, and snapshot operations. A Task mutation holds one broker
write transaction across the complete authoritative read, state transition, local
projection write, and tracked portable-document replacement. Same-process callers
queue by Task before entering SQLite, while separate processes serialize through WAL
transactions. Collision-resistant temporary files make replacement cleanup safe, but
the broker transaction—not temporary naming—is what prevents lost updates.

Enforcement is reported honestly:

1. `observed`
2. `cooperative`
3. `hooked`
4. `mediated`

Only hooked or mediated environments may claim preventive safety. The current host
baseline is cooperative and therefore reports `preventiveSafety: false`.

`task assign` is the host-neutral bridge from a linked child to a coding-agent tab. It
opens or reuses one Session, reserves exactly one writing Task, claims its declared
resources, and publishes the Task actor claim as one operation. It does not create a
Codex or Claude conversation by itself; a capable host adapter may create the tab and
invoke the same authority, while other hosts use the returned assignment command and
prompt.

Split activation therefore has three explicit delivery states:

1. core generates an exact child title, bounded prompt, returned-identity binding
   follow-up, review command, and manual fallback with `deliveryStatus: not-attempted`
2. after explicit user approval, a capable Codex host adapter creates the real task in
   the same Project, injects the prompt, uses the returned thread identity as the
   child's Skopos Session id, sends the binding follow-up, and waits for the result
3. when any required host capability is unavailable or fails, the adapter reports the
   failed stage and preserves the same prompt and follow-up for reviewed manual copy

This implemented Codex delivery path is the sole real-host-certified adapter for the
first public release. Claude Code, Cursor, and GitHub Copilot configuration or
instruction projections remain unverified until the exact real host produces matching
Evidence. Host-neutral shape and generated output are not support proof.

The originating Session releases its parent Task reservation and resource claims,
reconciles open mutations and contamination, then explicitly transitions from
`writer` to `reviewer`. The transition is actor-bound, live-Session-only, audited, and
exposed through both CLI and `skopos_coordination_session_transition` MCP authority.
Returning to `writer` uses the same fail-closed transition before the Session may
reserve or claim work. Host task APIs remain adapter capabilities; they do not move
into runtime core.

## Core Invariants

1. one public vocabulary and one owner for every authority
2. no prototype aliases, dual readers, or old-state migrations
3. no durable truth only under `.skopos/**`
4. no permanent brownfield mapping as the adopted end state
5. no broad command guessing; executable capabilities are declared Actions
6. no Action self-selects global closure requirements; Guards and Task acceptance do
7. no completion claim without fresh acceptance-linked Evidence
8. no adopter-specific architecture in Skopos core
9. generated artifacts never masquerade as hand-authored truth
10. retrieval is Scope- and Task-selective, not a broad documentation dump
11. detected commands remain proposals until reviewed approval creates tracked
    declarations and provider validation activates them
12. onboarding gives coding agents broad project investigation authority but never
    promotes inference, widens approved mutation, or accepts an optional extension
    without the required user decision
13. setup readiness is lane-specific; configured adapters never masquerade as verified
    host delivery
14. a host is publicly called supported only when current real-host Evidence covers
    the exact capabilities claimed
