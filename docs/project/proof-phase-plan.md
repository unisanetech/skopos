# Skopos Proof Phase Plan

Use this plan to prove that Skopos improves agent behavior on real repos before more product-surface expansion.

## Metadata

- Doc ID: `SKOPOS-PROJECT-PROOF-PHASE-PLAN`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-04-10`
- Review Cycle: `per workpack`
- Related Docs:
  - `positioning.md`
  - `roadmap.md`
  - `system-ui-plan.md`
  - `missing-decisions-checklist.md`
  - `../findings/registry.md`
  - `../decisions/001-brownfield-first-proof-and-v1-scope.md`
  - `../decisions/002-artifact-policy-freshness-and-overrides.md`

## Changelog

- `2026-04-10`: Updated the proof-phase plan to allow the focused system UI batch after the scorecard stays passing, keeping broader presentation polish deferred while routing pilot-readiness UI work through `system-ui-plan.md`.
- `2026-04-10`: Updated the proof-phase plan to add a before-versus-after brownfield comparison lane, so Skopos now proves that stabilization work produces a measurable repo-health and trust delta instead of only interpreting isolated snapshots.
- `2026-04-10`: Updated the proof-phase plan to extend the `batch-mission-slicing` lane with cross-actor blocking and explicit force-transfer semantics on claimed parent missions, so linked batch decomposition now proves takeover safety instead of only the happy path.
- `2026-04-10`: Updated the proof-phase plan to add a partial library-structure drift benchmark lane for multi-package library repos with canonical docs, instructions, and root commands but still-implicit workspace boundaries, so Skopos now proves a middle-band partial architecture interpretation instead of only clean or divergent shapes.
- `2026-04-10`: Updated the proof-phase plan to add a `brownfield-mixed` benchmark lane for repos that are structurally healthy but still missing part of the canonical root command surface, so Skopos now proves it can recommend stabilization without over-diagnosing high-conflict failure.
- `2026-04-10`: Updated the proof-phase plan to persist the latest proof scorecard and baseline comparison at `.skopos/proof/latest-report.json`, so before-versus-after proof output becomes durable Skopos runtime state instead of transient test-only output.
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
- `2026-04-10`: Updated the proof-phase plan to extend the override-heavy benchmark with actor attribution and force-transfer protection, so shared canonical override takeover is now part of the passing scorecard.
- `2026-04-10`: Updated the proof-phase plan to extend the multi-actor benchmark from mission mutation only to actor-aware closure evidence, so wrong-actor completion claims are now part of the passing scorecard.
- `2026-04-10`: Updated the proof-phase plan to add mission-level multi-actor coordination benchmarking so silent takeover of mutable mission state is now part of the passing proof scorecard.
- `2026-04-10`: Updated the proof-phase plan to add the workspace-boundary benchmark and boundary-aware fixture, so self-hosting and proof-heavy repos now prove that internal, fixture, test, and generated roots stay out of the active package model.
- `2026-06-24`: Updated the proof-phase plan wording after the standalone workspace move so Skopos-on-Skopos dogfooding uses the local root config, instruction source, and workflows directly.
- `2026-04-09`: Updated the proof-phase plan to make Skopos-on-Skopos dogfooding an explicit proof lane, with subtree-local root config, instruction source, and workflows.
- `2026-04-09`: Updated the proof-phase plan to reflect the implemented compiled-state invalidation benchmark lane and the new trust-refresh proof that source-driven docs changes are picked up without rerunning `init`.
- `2026-04-09`: Updated the proof-phase plan to reflect the implemented hot-path performance benchmark lane and the first compiled-state-first optimization for `resolve`, `context`, `plan`, `trust`, and `impact`.
- `2026-04-09`: Updated the proof-phase plan to reflect the first hot-path compiled-state optimization and to make performance-budget benchmarking the next proof lane after the current cache-first runtime shift.
- `2026-04-09`: Updated the proof-phase plan to reflect the implemented knowledge-index and operational-log benchmark lane plus the compiled `.skopos/index.json` and `.skopos/log.jsonl` artifacts.
- `2026-04-09`: Updated the proof-phase plan to reflect the canonical-override brownfield fixture and benchmark, so declared human canonicals are now part of the proof scorecard.
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

Prove that Skopos measurably reduces bad agent behavior on brownfield repos before adding broader UI or graph surface area.

## Must-Win Workflows

1. clean existing repo change:
   - agent should select the correct scope, commands, and docs impacts
2. messy repo change with conflicting patterns:
   - agent should not amplify the wrong pattern and should escalate ambiguity correctly
3. workflow-sensitive change:
   - agent should infer required project workflows and closure should fail if they are missing

## Fixture Matrix

1. clean service repo
2. mixed monorepo
3. messy repo with conflicting patterns
4. workflow-heavy repo with required generators or validators
5. large monorepo with subtree-targeted compilation
6. stale-docs repo with weak canonical docs routing
7. override-heavy repo where human canonical choices must outrank heuristic inference
8. boundary-aware workspace where internal, proof, and generated roots must stay out of active package discovery
9. self-hosted tooling workspace that mirrors the real Skopos dogfooding shape with registered maintenance workflows

Current implemented fixture mapping:

1. `fixtures/repos/clean-service`
2. `fixtures/repos/basic-monorepo`
3. `fixtures/repos/messy-monorepo`
4. `fixtures/repos/legacy-multi-package`
5. `fixtures/repos/approval-workflow-repo`
6. `fixtures/repos/large-monorepo`
7. `fixtures/repos/stale-docs-repo`
8. `fixtures/repos/canonical-override-repo`
9. `fixtures/repos/boundary-aware-workspace`
10. `fixtures/repos/self-hosted-tooling-workspace`
11. `fixtures/repos/mixed-brownfield-monorepo`
12. `fixtures/repos/library-structure-drift`
13. `fixtures/repos/brownfield-stabilization-delta-before`
14. `fixtures/repos/brownfield-stabilization-delta-after`

Current benchmark definition source:

1. `internal/evals/proof-phase-benchmarks.json`

Current proof scorecard contract:

1. `internal/evals/proof-phase-scorecard.ts`

Current proof baseline source:

1. `internal/evals/proof-phase-baseline.json`

Current durable proof report destination:

1. `.skopos/proof/latest-report.json`

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
12. override and canonicalization quality when human-declared repo truth differs from inference or another actor attempts to replace shared canonicals silently
13. compiled index and operational-log quality across the normal runtime lifecycle, including actor-attributed init, scan, instruction-sync, trust, and impact maintenance activity
14. hot-path performance discipline so compiled-state reads stay cheap in daily agent loops
15. compiled-state invalidation quality so package and docs source changes refresh hot-path reads without forcing routine full recompilation
16. workspace-boundary purity so self-hosting and proof-heavy repos do not leak internal, test, fixture, or generated roots into the active SDK package model
17. multi-actor mission coordination quality so one actor cannot silently take over mutable mission state or claim closure on someone else’s active mission without an explicit transfer
18. workflow-evidence attribution quality so mutating workflow runs identify the actor who produced the latest successful required evidence
19. batch-mission slicing quality so wide proof batches can narrow into linked child slice missions without falling back to ad hoc execution notes
20. self-hosted dogfooding quality so a realistic Skopos-on-Skopos repo shape stays trust-ready, workflow-aware, and portal-renderable under proof harness pressure
21. before-versus-after brownfield comparison quality so stabilization work produces an observable health and trust delta instead of only a better-looking static fixture

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

1. `.skopos/proof/latest-report.json`

It currently verifies:

1. clean existing repo change coverage
2. messy brownfield diagnosis coverage for a high-conflict repo
3. messy brownfield diagnosis and architecture coverage for a quieter legacy-structure repo
4. workflow-sensitive closure coverage with actor-attributed required workflow evidence
5. approval-sensitive workflow coverage for destructive workflows that require explicit approval and actor attribution
6. stale-docs brownfield coverage for missing `docs/00-start-here.md` routing and stale tracked docs metadata
7. override-heavy brownfield coverage where declared canonicals change docs-root and archetype interpretation, carry actor attribution, and require explicit force-transfer on takeover
8. compiled knowledge-index and operational-log coverage across actor-attributed init, scan, instructions sync, plan, workflow, trust, impact, and done
9. hot-path performance coverage for compiled-state reads and cache-stable bootstrap artifacts
10. brownfield architecture interpretation coverage
11. large-repo subtree slicing coverage
12. tool-native enforcement coverage through generated Claude Code hook adapters
13. current scorecard versus committed proof baseline comparison coverage
14. compiled-state invalidation coverage for late package addition after bootstrap
15. trust refresh coverage for docs routing and freshness changes without a manual `init` rerun
16. workspace-boundary purity coverage for repos that contain real internal and proof-only package manifests outside the active SDK family
17. multi-actor mission coordination coverage for actor-attributed plan creation, mission claim, takeover, completion, and actor-aware closure behavior on mutable mission artifacts
18. batch-mission slicing coverage for linked child slice creation, parent decision resolution, cross-actor blocking, explicit force-transfer, and durable decomposition of workspace-level proof batches
19. self-hosted dogfooding coverage for a realistic tooling workspace with ignored proof roots, registered self-maintenance workflows, trust-ready instruction sync, and local portal rendering
20. mixed brownfield coverage for a repo that should land in `needs-stabilization` through a partial root command surface without being treated as high-conflict or structurally unsafe
21. partial architecture drift coverage for a library-style multi-package repo that should stay `partial`, not `divergent`, when only workspace boundaries are still implicit
22. before-versus-after brownfield comparison coverage for a realistic repo pair where docs routing, root commands, and mirror sync move the repo from `needs-stabilization` to `agent-ready`

## Next Proof Work

1. expand fixture and benchmark realism without changing the meaning of “pass” casually
2. evolve the proof baseline deliberately when benchmark scope changes, instead of letting score drift silently
3. pressure invalidation correctness further so stale compiled state is refreshed only when source truth really changed
4. pressure broader concurrent-run behavior beyond mission ownership, override ownership, and workflow-run attribution now that mutable workflow state and mutable shared truth both have first-pass coordination rules
5. use the Skopos subtree itself as a controlled dogfooding workspace and turn any friction into proof findings or benchmark gaps
6. keep pressure on linked batch-to-slice execution and self-hosting friction so future proof work stays inside Skopos artifacts instead of drifting back into ad hoc execution

## Deferred Until After Proof

1. broader portal expansion beyond the focused system UI batch in `system-ui-plan.md`
2. broader graph visualization expansion
3. wider ecosystem claims
4. non-essential presentation polish that is not required for pilot-grade human readability
