---
title: Skopos Missing Decisions Checklist
status: superseded
owner: skopos-core
id: SKOPOS-PROJECT-MISSING-DECISIONS-CHECKLIST
scope: skopos
role: plan
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
lastUpdated: 2026-07-28
relatedDocs:
  - ../overview.md
  - ../domains/product/positioning.md
  - ../work/archive/P-37fa9180-prototype-roadmap.md
  - ../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - ../architecture/runtime-model.md
  - ../architecture/artifact-model.md
  - ../architecture/trust-and-closure-model.md
  - ../architecture/action-extension-model.md
reviewCycle: none
---

# Skopos Missing Decisions Checklist

Use this checklist to gate further Skopos feature expansion until the highest-risk product and operational decisions are explicit.

## Changelog

- `2026-07-28`: Archived after the canonical pre-release decision resolved product
  vocabulary and authority. This checklist remains only as historical prototype
  decision context.

- `2026-04-17`: Marked the initial synthesized repo-understanding contract resolved through a dedicated decision and active workpack, so messy brownfield onboarding now has an explicit compact-orientation contract instead of relying on raw bootstrap, scope, symbol, and graph artifacts alone.
- `2026-04-16`: Marked the self-healing product-loop and bounded hardening contract resolved through a dedicated decision and active workpack, so pilot-discovered product friction now feeds one explicit hardening loop instead of continuing as scattered feature-adjacent cleanup.
- `2026-04-13`: Marked the multi-agent discussion-memory adapter lifecycle contract resolved through a dedicated decision, so future Codex and non-Claude host work can extend one shared continuity model instead of inventing per-host memory behavior.
- `2026-04-13`: Marked the discussion-context and sidebar information-architecture contract resolved through a dedicated decision, so the next UI work can place handoffs and checkpoints into the routed console without inventing a premature discussion page or sidebar drift.
- `2026-04-12`: Marked the token-control, compact-agent-transport, and progressive-retrieval contract resolved through a dedicated decision, so future workflow and retrieval work can implement compact transport, brief artifacts, and docs lifecycle filtering instead of continuing to treat token efficiency as an informal constraint.
- `2026-04-12`: Marked the program-router, sequencing, and obligation contract resolved through a dedicated decision, so the next implementation work can move from manually arguing about queue order and docs/UI follow-through into a concrete program-control artifact and command lane.
- `2026-04-12`: Marked the discussion-memory and compaction-handoff contract resolved through a dedicated decision, so long-running cross-chat continuity now has an explicit artifact and lifecycle model instead of living only in chat expectations.
- `2026-04-11`: Marked the workflow-router and agent-supervision contract resolved through a dedicated decision, so the next implementation work can move from arguing about prompt discipline into building the concrete router, question, recommendation, and eval surfaces.
- `2026-04-10`: Narrowed the later concurrency decision by resolving the first mission-level coordination slice through a dedicated decision and proof benchmark, while leaving broader mutable-artifact merge behavior as later work.
- `2026-04-09`: Marked the eval harness and scoring contract resolved through a durable decision, shared proof scorecard contract, and passing harness coverage.
- `2026-04-09`: Marked the tool-native enforcement strategy resolved through a durable decision, compiled enforcement artifact, generated Claude Code hook adapter, and proof benchmark coverage.
- `2026-04-09`: Marked the large-repo operating mode resolved through a durable decision, subtree-targeted runtime support, and proof benchmark coverage.
- `2026-04-09`: Marked the current-state versus recommended-state architecture split resolved through a durable decision, compiled artifact, and proof benchmark coverage.
- `2026-04-09`: Marked the first blocker set resolved and linked the durable decisions so Skopos can move into benchmark-driven proof work.
- `2026-04-09`: Added the missing-decisions checklist to gate further feature expansion and shift Skopos into a brownfield-first proof phase.

## Resolution Markers

> **Historical:** Do not use the entries below to admit or sequence current work. Use
> the canonical product decision and convergence Plan.

- `[Blocker]`: must be resolved before more product-surface implementation.
- `[Proof]`: must be resolved during the proof phase; implementation may continue only for eval harnesses, bug fixes, docs, and decision-support work.
- `[Later]`: can be deferred until after the brownfield wedge is proven.

## Resolved Blockers

### [Resolved 2026-04-09] Brownfield Adoption Wedge And Proof Target

- Resolution:
  - `../decisions/archive/001-brownfield-first-proof-and-v1-scope.md`
  - `../work/plans/P-067e15c4-proof-and-benchmarking.md`

### [Resolved 2026-04-09] `.skopos/**` Commit Policy

- Resolution:
  - `../decisions/archive/002-artifact-policy-freshness-and-overrides.md`
  - `../architecture/artifact-model.md`

### [Resolved 2026-04-09] Artifact Freshness And Invalidation Model

- Resolution:
  - `../decisions/archive/002-artifact-policy-freshness-and-overrides.md`
  - `../architecture/trust-and-closure-model.md`
  - `../architecture/artifact-model.md`

### [Resolved 2026-04-09] Human Override And Canonicalization Model

- Resolution:
  - `../decisions/archive/002-artifact-policy-freshness-and-overrides.md`
  - `../architecture/config-model.md`

### [Resolved 2026-04-09] V1 Ecosystem Scope

- Resolution:
  - `../decisions/archive/001-brownfield-first-proof-and-v1-scope.md`
  - `../domains/product/positioning.md`

## Resolved Proof Decisions

### [Resolved 2026-04-09] Current-State Versus Recommended Architecture Split

- Resolution:
  - `../decisions/003-current-state-and-recommended-architecture-split.md`
  - `../architecture/artifact-model.md`
  - `../work/plans/P-067e15c4-proof-and-benchmarking.md`

### [Resolved 2026-04-09] Large-Repo Operating Mode

- Resolution:
  - `../decisions/004-large-repo-operating-mode.md`
  - `../architecture/runtime-model.md`
  - `../work/plans/P-067e15c4-proof-and-benchmarking.md`

### [Resolved 2026-04-09] Tool-Native Enforcement Strategy

- Resolution:
  - `../decisions/005-tool-native-enforcement-strategy.md`
  - `../architecture/runtime-model.md`
  - `../architecture/artifact-model.md`
  - `../architecture/action-extension-model.md`
  - `../work/plans/P-067e15c4-proof-and-benchmarking.md`

### [Resolved 2026-04-09] Eval Harness And Scoring Contract

- Resolution:
  - `../decisions/006-eval-harness-and-scoring-contract.md`
  - `../work/plans/P-067e15c4-proof-and-benchmarking.md`
  - `../work/archive/P-b4e43e34-prototype-implementation-checklist.md`

### [Resolved 2026-04-11] Workflow Router And Agent Supervision Contract

- Resolution:
  - `../decisions/archive/020-workflow-router-questions-recommendations-and-eval-contract.md`
  - `../architecture/decision-escalation-model.md`
  - `../architecture/trust-and-closure-model.md`
  - `../architecture/action-extension-model.md`

### [Resolved 2026-04-12] Discussion Memory And Compaction Handoff Contract

- Resolution:
  - `../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `../architecture/artifact-model.md`
  - `../work/archive/P-b4e43e34-prototype-implementation-checklist.md`

### [Resolved 2026-04-12] Program Router, Sequencing, And Obligation Contract

- Resolution:
  - `../decisions/archive/022-program-router-sequencing-and-obligation-contract.md`
  - `../architecture/artifact-model.md`
  - `../work/archive/P-11229565-system-ui.md`
  - `../work/archive/P-b4e43e34-prototype-implementation-checklist.md`

### [Resolved 2026-04-12] Token Control, Compact Agent Transport, And Progressive Retrieval

- Resolution:
  - `../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
  - `../architecture/retrieval-and-query-strategy.md`
  - `../architecture/artifact-model.md`
  - `../work/archive/P-b4e43e34-prototype-implementation-checklist.md`

### [Resolved 2026-04-13] Discussion Context And Sidebar Information Architecture

- Resolution:
  - `../decisions/025-system-ui-discussion-context-and-sidebar-information-architecture.md`
  - `../work/archive/P-11229565-system-ui.md`
  - `../work/archive/P-b4e43e34-prototype-implementation-checklist.md`

### [Resolved 2026-04-13] Multi-Agent Discussion-Memory Adapter Lifecycle

- Resolution:
  - `../decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md`
  - `../work/archive/P-b4e43e34-prototype-implementation-checklist.md`
  - `../work/archive/P-37fa9180-prototype-roadmap.md`

### [Resolved 2026-04-16] Self-Healing Product Loop And Bounded Hardening Contract

- Resolution:
  - `../decisions/027-self-healing-product-loop-and-bounded-hardening-contract.md`
  - `../work/archive/P-37fa9180-prototype-roadmap.md`
  - `../work/archive/P-b4e43e34-prototype-implementation-checklist.md`

### [Resolved 2026-04-17] Initial Synthesized Repo Understanding Contract

- Resolution:
  - `../decisions/028-initial-synthesized-repo-understanding-contract.md`
  - `../work/archive/P-37fa9180-prototype-roadmap.md`
  - `../work/archive/P-b4e43e34-prototype-implementation-checklist.md`

## Historical Blockers Before More Product-Surface Implementation

### [Blocker] Brownfield Adoption Wedge And Proof Target

- Why it matters: Skopos only wins if it measurably reduces bad agent behavior on existing repos. Without a sharp wedge, more surface area risks becoming elegant but weak infrastructure.
- Decision to make:
  - confirm brownfield repo stabilization as the primary adoption wedge
  - define the three to five must-win workflows
  - define success metrics for those workflows
- Recommended default:
  - lead with brownfield
  - prove three workflows first:
    - clean existing repo change
    - messy repo change with conflicting patterns
    - workflow-sensitive change with closure requirements

### [Blocker] `.skopos/**` Commit Policy

- Why it matters: shared project truth is useless if it never lands in git, but committing every generated artifact will create churn and distrust.
- Decision to make:
  - which `.skopos/**` artifacts are checked in
  - which artifacts stay local-only
  - which artifacts are durable shared truth versus ephemeral caches or run evidence
- Recommended default:
  - commit durable shared truth such as config, bootstrap, scopes, plans, decisions, and diagnosis
  - do not commit ephemeral caches or run evidence by default

### [Blocker] Artifact Freshness And Invalidation Model

- Why it matters: Skopos cannot claim trust if it cannot explain when an artifact is stale or why it needs regeneration.
- Decision to make:
  - how artifacts declare source dependencies
  - how freshness is computed
  - how stale state is surfaced in CLI, UI, and trust reports
- Recommended default:
  - give every generated artifact explicit source references plus generated timestamps
  - compute stale state from source changes and dependency fingerprints
  - fail `done` when required artifacts are stale

### [Blocker] Human Override And Canonicalization Model

- Why it matters: inference will be wrong on real repos. Users need a clean way to tell Skopos what is canonical so the system stops re-learning the wrong pattern.
- Decision to make:
  - where override declarations live
  - how overrides are reviewed and persisted
  - how overrides outrank inferred truth
- Recommended default:
  - store overrides as checked-in project truth
  - make declared canonical choices always outrank heuristic inference
  - show override provenance in trust and diagnosis output

### [Blocker] V1 Ecosystem Scope

- Why it matters: the current implementation is effectively Node and TypeScript first. The product should say that explicitly instead of sounding broader than it is.
- Decision to make:
  - which languages, package managers, and repo shapes are officially supported in v1
  - which environments are out of scope for now
- Recommended default:
  - Node and TypeScript first
  - `package.json` repos first
  - `pnpm` first, with `npm` and `yarn` tolerated where detection is straightforward

## Current Proof Work After Decision Resolution

1. expand fixture realism and benchmark breadth without changing the scorecard contract casually
2. add before-versus-after comparison recording on top of the current benchmark and scorecard model
3. keep proof work focused on brownfield reliability gains, not new surface appetite

## Later Decisions

### [Later] PR And CI Integration Surface

- Why it matters: teams will want Skopos evidence in pull requests and CI, but local proof should come first.
- Decision to make:
  - the first CI report format
  - whether PR comments, status checks, or artifacts are the initial integration path

### [Later] Concurrency And Multi-Actor Model

- Why it matters: multiple agents or humans can touch the same repo state, especially plans, missions, and run evidence.
- Current state:
  - the first mission-level coordination slice is now defined through `../decisions/archive/007-multi-actor-mission-coordination.md`
  - broader lock, merge, and concurrent-run behavior is still later work
- Decision to make:
  - lock strategy
  - merge and conflict behavior for mutable Skopos artifacts
  - how concurrent runs are identified and explained

### [Later] Post-V1 Broader Ecosystem Expansion

- Why it matters: once the wedge is proven, Skopos can expand beyond the first language and workflow assumptions without pretending to do so prematurely.
- Decision to make:
  - next ecosystems after the v1 Node and TypeScript lane
  - what new adapters are required before claiming support

## Immediate Next Actions

1. Expand the proof harness and fixture matrix using the shared scorecard contract in `../work/plans/P-067e15c4-proof-and-benchmarking.md`.
2. Freeze broad portal and graph expansion until the proof-phase scorecard justifies it.
3. Record before-versus-after comparisons using the same benchmark and scoring contract.
4. Use proof results to choose the next implementation slices.
