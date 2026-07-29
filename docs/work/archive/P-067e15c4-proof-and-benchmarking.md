---
title: Proof And Benchmarking Plan
status: archived
owner: skopos-core
id: SKOPOS-PLAN-P-067E15C4
scope: skopos
role: plan
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
appliesTo:
  - workspace
lastUpdated: 2026-07-28
relatedDocs:
  - ../../domains/product/positioning.md
  - ../archive/P-37fa9180-prototype-roadmap.md
  - ../archive/P-11229565-system-ui.md
  - ../../architecture/agent-native-operating-model.md
  - ../../findings/README.md
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - P-e7e888e6-canonical-product-convergence.md
reviewCycle: per convergence phase
---

# Proof And Benchmarking Plan

Use this plan to prove that Skopos improves agent behavior on real repos before more product-surface expansion.

> **Current proof baseline:** The canonical product convergence Plan now owns release
> proof. Worktree-isolation and alternate-tree-mapping lanes in this file describe the
> prototype and must be replaced by same-directory Session coordination and successful
> documentation restructuring proof.

## Changelog

- `2026-07-28`: Removed the deleted prototype canonical-override fixture and benchmark
  claims; declared-source precedence remains a product rule, while adoption proof now
  converges projects on the canonical Memory tree instead of preserving alternate
  layouts through overrides.
- `2026-07-28`: Classified the still-active proof contract as a collision-resistant
  supporting Plan under the canonical work family; the convergence Plan remains the
  release authority.
- `2026-07-28`: Routed release proof through the canonical convergence Plan. The target
  matrix adds non-Node adoption, approved docs restructuring, same-branch/same-directory
  Sessions, immutable Task snapshots, host continuation, clean clones, and Unisane
  replacement.

- `2026-07-27`: Added validation-economy proof for pre-existing dirty-tree isolation,
  committed task changes, affected dependents, fail-fast checks, and unchanged-source
  receipt reuse.

- `2026-07-25`: Added the P1-W11 cross-project proof contract for compact task intent,
  phase-separated checks, source-bound receipts, task/worktree isolation, memory
  authority, and complete downstream-project adoption without a second control plane.

- `2026-04-10`: Updated the proof-phase plan to allow the focused system UI batch after the scorecard stays passing, keeping broader presentation polish deferred while routing pilot-readiness UI work through `../archive/P-11229565-system-ui.md`.
- `2026-04-10`: Updated the proof-phase plan to add a before-versus-after brownfield comparison lane, so Skopos now proves that stabilization work produces a measurable repo-health and trust delta instead of only interpreting isolated snapshots.
- `2026-04-10`: Updated the proof-phase plan to extend the `batch-mission-slicing` lane with cross-actor blocking and explicit force-transfer semantics on claimed parent missions, so linked batch decomposition now proves takeover safety instead of only the happy path.
- `2026-04-10`: Updated the proof-phase plan to add a partial library-structure drift benchmark lane for multi-package library repos with canonical docs, instructions, and root commands but still-implicit workspace boundaries, so Skopos now proves a middle-band partial architecture interpretation instead of only clean or divergent shapes.
- `2026-04-10`: Updated the proof-phase plan to add a `brownfield-mixed` benchmark lane for repos that are structurally healthy but still missing part of the canonical root command surface, so Skopos now proves it can recommend stabilization without over-diagnosing high-conflict failure.
- `2026-04-10`: Updated the proof-phase plan to persist the latest proof scorecard and baseline comparison at `.skopos/evidence/proof/latest-report.json`, so before-versus-after proof output becomes durable Skopos runtime state instead of transient test-only output.
- `2026-04-10`: Updated the proof-phase plan to keep pressure on linked batch execution by syncing parent linked-slice state after child mission claim, release, and completion, and by extending the `batch-mission-slicing` benchmark to catch stale parent progress.
- `2026-04-10`: Updated the proof-phase plan to add the `self-hosted-dogfooding` benchmark and a dedicated self-hosted tooling fixture, so Skopos now proves workflow discovery, trust readiness, and portal rendering on a deterministic self-hosted repo shape instead of only on the live subtree.
- `2026-04-10`: Updated the proof-phase plan to add the `batch-mission-slicing` benchmark and close the first self-hosted batch-decomposition finding through linked child mission execution.
- `2026-04-10`: Updated the proof-phase plan to route self-hosted batch work through durable plan and mission artifacts, and opened a first active finding for the remaining batch-decomposition gap discovered during that dogfooding flow.
- `2026-04-10`: Updated the proof-phase plan to reflect that `scan` now refreshes the durable diagnosis artifact while participating in the actor-aware lifecycle benchmark, so brownfield diagnosis is both durable and provenance-tracked.
- `2026-04-10`: Updated the proof-phase plan to extend the knowledge-index and operational-log benchmark with actor-attributed `scan` events, so brownfield diagnosis activity is part of the passing lifecycle score instead of an untracked side path.
- `2026-04-10`: Updated the proof-phase plan to extend the knowledge-index and operational-log benchmark with actor-attributed `init`, `trust`, and `impact` events, so the common bootstrap and validation loop is no longer exempt from provenance checks.
- `2026-04-10`: Updated the proof-phase plan to extend the knowledge-index and operational-log benchmark with `instructions-sync` events and actor-attributed mirror maintenance activity.
- `2026-04-10`: Updated the proof-phase plan to extend the multi-actor benchmark with actor-attributed plan creation, so mission coordination now starts with visible plan provenance before explicit claim ownership.
- `2026-04-10`: Updated the proof-phase plan to extend workflow-sensitive and approval-sensitive benchmarks with actor-attributed workflow evidence, so mutating workflow proof is no longer anonymous.
- `2026-04-10`: Updated the proof-phase plan to extend the multi-actor benchmark from mission mutation only to actor-aware closure evidence, so wrong-actor completion claims are now part of the passing scorecard.
- `2026-04-10`: Updated the proof-phase plan to add mission-level multi-actor coordination benchmarking so silent takeover of mutable mission state is now part of the passing proof scorecard.
- `2026-04-10`: Updated the proof-phase plan to add the workspace-boundary benchmark and boundary-aware fixture, so self-hosting and proof-heavy repos now prove that internal, fixture, test, and generated roots stay out of the active package model.
- `2026-06-24`: Updated the proof-phase plan wording after the standalone workspace move so Skopos-on-Skopos dogfooding uses the local root config, instruction source, and workflows directly.
- `2026-04-09`: Updated the proof-phase plan to make Skopos-on-Skopos dogfooding an explicit proof lane, with subtree-local root config, instruction source, and workflows.
- `2026-04-09`: Updated the proof-phase plan to reflect the implemented compiled-state invalidation benchmark lane and the new trust-refresh proof that source-driven docs changes are picked up without rerunning `init`.
- `2026-04-09`: Updated the proof-phase plan to reflect the implemented hot-path performance benchmark lane and the first compiled-state-first optimization for `resolve`, `context`, `plan`, `trust`, and `impact`.
- `2026-04-09`: Updated the proof-phase plan to reflect the first hot-path compiled-state optimization and to make performance-budget benchmarking the next proof lane after the current cache-first runtime shift.
- `2026-04-09`: Updated the proof-phase plan to reflect the implemented knowledge-index and operational-log benchmark lane plus the compiled `.skopos/index/memory.json` and `.skopos/runs/operations.jsonl` artifacts.
- `2026-04-09`: Updated the proof-phase plan to reflect the stale-docs brownfield fixture and benchmark, so docs freshness and weak canonical docs routing are now part of the proof scorecard.
- `2026-04-09`: Updated the proof-phase plan to reflect the approval-sensitive workflow fixture and benchmark so workflow trust now covers explicit approval enforcement in addition to closure evidence.
- `2026-04-09`: Updated the proof-phase plan to reflect the quieter legacy-structure brownfield fixture and benchmark, so the messy brownfield lane now covers more than one failure shape.
- `2026-04-09`: Updated the proof-phase plan to reflect the first explicit proof baseline artifact and scorecard-against-baseline comparison pass.
- `2026-04-09`: Updated the proof-phase plan to reflect the shared proof scorecard contract, benchmark categories and priorities, and the resolved eval scoring decision.
- `2026-04-09`: Updated the proof-phase plan to reflect the implemented tool-native enforcement benchmark, compiled enforcement artifact, and generated Claude Code hook adapter.
- `2026-04-09`: Updated the proof-phase plan to reflect the implemented large-repo subtree benchmark and sliced-artifact operating mode.
- `2026-04-09`: Updated the proof-phase plan to reflect the implemented current-state versus recommended-state architecture artifact and the new brownfield architecture benchmark.
- `2026-04-09`: Updated the proof-phase plan to reflect the implemented benchmark definition file, clean-service fixture, and passing proof-harness test.
- `2026-04-09`: Added the proof-phase plan so the next Skopos work is benchmark-driven rather than feature-driven.

## Goal

Prove that Skopos measurably improves agent outcomes across clean, complex, and
brownfield projects before broader product-surface expansion. The proof must measure
task success, supervision, context cost, repeated work, scope drift, memory authority,
and false closure—not only artifact production or generic check status.

## Must-Win Workflows

1. clean existing repo change:
   - agent should select the correct scope, commands, and docs impacts
2. messy repo change with conflicting patterns:
   - agent should not amplify the wrong pattern and should escalate ambiguity correctly
3. workflow-sensitive change:
   - agent should infer required project workflows and closure should fail if they are missing
4. compact light task:
   - agent should preserve intent and prove the change without mandatory mission ceremony
5. complex-project adoption:
   - project-specific capabilities should run through Skopos without a parallel task or
     closure authority
6. parallel work:
   - Session/Task state and proof should remain isolated when several coding-agent
     sessions use the same branch and working directory, until one owned integration
     closure

## Fixture Matrix

1. clean service repo
2. mixed monorepo
3. messy repo with conflicting patterns
4. workflow-heavy repo with required generators or validators
5. large monorepo with subtree-targeted compilation
6. stale-docs repo with weak canonical docs routing
7. boundary-aware workspace where internal, proof, and generated roots must stay out of active package discovery
8. self-hosted tooling workspace that mirrors the real Skopos dogfooding shape with registered maintenance workflows
9. small project that proves low-ceremony task context and focused closure
10. complex governed monorepo that contributes project-specific context, actions, and
    guards
11. brownfield project with strong docs in a non-Skopos tree that proves discovery is
    temporary intake and full adoption requires an approved canonical restructuring

Current implemented fixture mapping:

1. `fixtures/repos/clean-service`
2. `fixtures/repos/basic-monorepo`
3. `fixtures/repos/messy-monorepo`
4. `fixtures/repos/legacy-multi-package`
5. `fixtures/repos/approval-workflow-repo`
6. `fixtures/repos/large-monorepo`
7. `fixtures/repos/stale-docs-repo`
8. `fixtures/repos/boundary-aware-workspace`
9. `fixtures/repos/self-hosted-tooling-workspace`
10. `fixtures/repos/mixed-brownfield-monorepo`
11. `fixtures/repos/library-structure-drift`
12. `fixtures/repos/brownfield-stabilization-delta-before`
13. `fixtures/repos/brownfield-stabilization-delta-after`

Current benchmark definition source:

1. `internal/evals/proof-phase-benchmarks.json`

Current proof scorecard contract:

1. `internal/evals/proof-phase-scorecard.ts`

Current proof baseline source:

1. `internal/evals/proof-phase-baseline.json`

Current durable proof report destination:

1. `.skopos/evidence/proof/latest-report.json`

## Scorecard

1. correct scope selection
2. correct command and workflow recommendation
3. missed human escalation rate
4. missed docs or workflow closure requirements
5. false-confidence rate
6. trust usefulness at completion
7. current-state versus recommended-state architecture quality on brownfield repos
8. large-repo subtree-targeting and sliced-artifact quality
9. tool-native enforcement quality for instruction sync and false-closure blocking
10. approval-sensitive workflow enforcement quality for destructive or gated workflow execution, including actor attribution once approval is granted
11. stale-docs trust quality for overdue docs metadata and missing start-here routing
12. compiled index and operational-log quality across the normal runtime lifecycle, including actor-attributed init, scan, instruction-sync, trust, and impact maintenance activity
13. hot-path performance discipline so compiled-state reads stay cheap in daily agent loops
14. compiled-state invalidation quality so package and docs source changes refresh hot-path reads without forcing routine full recompilation
15. workspace-boundary purity so self-hosting and proof-heavy repos do not leak internal, test, fixture, or generated roots into the active SDK package model
16. multi-actor mission coordination quality so one actor cannot silently take over mutable mission state or claim closure on someone else’s active mission without an explicit transfer
17. workflow-evidence attribution quality so mutating workflow runs identify the actor who produced the latest successful required evidence
18. batch-mission slicing quality so wide proof batches can narrow into linked child slice missions without falling back to ad hoc execution notes
19. self-hosted dogfooding quality so a realistic Skopos-on-Skopos repo shape stays trust-ready, workflow-aware, and portal-renderable under proof harness pressure
20. before-versus-after brownfield comparison quality so stabilization work produces an observable health and trust delta instead of only a better-looking static fixture
21. acceptance-criterion coverage so closure evidence proves the requested behavior
    rather than only generic repository health
22. phase discipline so admission, changed iteration, stabilization, and final closure
    do not rerun the same expensive action without invalidation
23. receipt correctness so relevant source, configuration, provider, environment, or
    freshness changes invalidate reused proof
24. context economy so compact task and scope context beat broad replay without reducing
    task success
25. same-working-directory Session and Task isolation so parallel work cannot
    overwrite current intent or proof
26. authority quality so inferred or proposed knowledge cannot self-promote and relevant
    negative knowledge remains retrievable
27. adoption quality so complex projects can retire a parallel LLM workflow while
    preserving their domain-specific capabilities
28. validation economy so unrelated pre-existing changes, unaffected packages,
    duplicate successful checks, and predictable post-failure commands do not consume
    task time

## Scoring Contract

1. benchmark definitions now include category and priority
2. benchmark results now include:
   - status
   - passed and failed check counts
   - weighted score and max score
   - weighted pass rate
   - failed metric ids
3. the aggregate proof scorecard now includes:
   - overall status
   - must-win benchmark counts
   - weighted score and pass rate
   - category summaries
   - active scoring policy
4. the current scoring policy is intentionally strict while the fixture matrix is still must-win focused
5. the current proof harness now compares the latest scorecard against a committed proof baseline so regressions become explicit

## Allowed Work During Proof Phase

1. eval harnesses
2. benchmark fixtures
3. blocker-resolution docs and architecture updates
4. bug fixes that improve proof reliability
5. runtime changes directly required by benchmark failures
6. self-hosting setup and dogfooding changes for the Skopos subtree itself

## Current Implemented Harness

The first proof-phase harness currently lives in:

1. `packages/cli/src/__tests__/proof-phase.e2e.test.ts`
2. `internal/evals/proof-phase-scorecard.ts`
3. `internal/evals/proof-phase-baseline.json`

It now persists the latest scorecard plus committed-baseline comparison to:

1. `.skopos/evidence/proof/latest-report.json`

It currently verifies:

1. clean existing repo change coverage
2. messy brownfield diagnosis coverage for a high-conflict repo
3. messy brownfield diagnosis and architecture coverage for a quieter legacy-structure repo
4. workflow-sensitive closure coverage with actor-attributed required workflow evidence
5. approval-sensitive workflow coverage for destructive workflows that require explicit approval and actor attribution
6. stale-docs brownfield coverage for missing `docs/00-start-here.md` routing and stale tracked docs metadata
7. compiled knowledge-index and operational-log coverage across actor-attributed init, scan, instructions sync, plan, workflow, trust, impact, and done
8. hot-path performance coverage for compiled-state reads and cache-stable bootstrap artifacts
9. brownfield architecture interpretation coverage
10. large-repo subtree slicing coverage
11. tool-native enforcement coverage through generated Claude Code hook adapters
12. current scorecard versus committed proof baseline comparison coverage
13. compiled-state invalidation coverage for late package addition after bootstrap
14. trust refresh coverage for docs routing and freshness changes without a manual `init` rerun
15. workspace-boundary purity coverage for repos that contain real internal and proof-only package manifests outside the active SDK family
16. multi-actor mission coordination coverage for actor-attributed plan creation, mission claim, takeover, completion, and actor-aware closure behavior on mutable mission artifacts
17. batch-mission slicing coverage for linked child slice creation, parent decision resolution, cross-actor blocking, explicit force-transfer, and durable decomposition of workspace-level proof batches
18. self-hosted dogfooding coverage for a realistic tooling workspace with ignored proof roots, registered self-maintenance workflows, trust-ready instruction sync, and local portal rendering
19. mixed brownfield coverage for a repo that should land in `needs-stabilization` through a partial root command surface without being treated as high-conflict or structurally unsafe
20. partial architecture drift coverage for a library-style multi-package repo that should stay `partial`, not `divergent`, when only workspace boundaries are still implicit
21. before-versus-after brownfield comparison coverage for a realistic repo pair where docs routing, root commands, and mirror sync move the repo from `needs-stabilization` to `agent-ready`

## Next Proof Work

1. execute convergence Plan Phase 10 against the clean target model
2. replace mapped-layout proof with healthy and messy documentation-restructuring proof
3. measure context size, repeated action count, elapsed proof cost, user intervention,
   acceptance coverage, scope drift, and false closure before and after convergence
4. expand fixture and benchmark realism without changing the meaning of “pass” casually
5. evolve the proof baseline deliberately when benchmark scope changes, instead of letting score drift silently
6. pressure invalidation correctness further so stale compiled state is refreshed only when source truth really changed
7. prove same-branch, same-working-directory Sessions, Action ownership, contamination,
   Git serialization, and immutable Task snapshot verification
8. use the Skopos subtree itself as a controlled dogfooding workspace and turn any friction into proof findings or benchmark gaps
9. keep pressure on linked batch-to-slice execution and self-hosting friction so future proof work stays inside Skopos artifacts instead of drifting back into ad hoc execution

## Deferred Until After Proof

1. broader portal expansion beyond the focused system UI batch preserved in
   `../archive/P-11229565-system-ui.md`
2. broader graph visualization expansion
3. wider ecosystem claims
4. non-essential presentation polish that is not required for pilot-grade human readability
