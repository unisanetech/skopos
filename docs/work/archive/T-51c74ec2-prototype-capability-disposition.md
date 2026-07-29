---
title: "Task: Prototype Capability Disposition"
status: completed
owner: skopos-core
id: T-51c74ec2
scope: skopos
role: task
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
risk: high-impact
started: 2026-07-28
completed: 2026-07-28
relatedDocs:
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../plans/P-e7e888e6-canonical-product-convergence.md
  - P1-W11-agent-native-single-control-plane-convergence.md
  - ../../findings/F-c1e8c13d-prototype-product-contract-convergence-gap.md
---

# Task: Prototype Capability Disposition

## Changelog

- `2026-07-28`: Recorded the clean target disposition for every material P1-W11
  capability before moving its execution record out of default retrieval.

## Objective

Prevent the clean pre-release refactor from preserving prototype APIs while also
preventing useful, already-proven behavior from being accidentally discarded.

## Acceptance

1. every material P1-W11 capability has a disposition
2. every retained behavior has a canonical target owner
3. every prototype owner to delete is explicit
4. every retained behavior has a regression seed or new proof requirement
5. historical P1 evidence is not claimed as target proof

## Disposition Rules

- `retain-and-refactor`: preserve behavior, rewrite it under clean target contracts,
  and delete the prototype owner
- `replace`: keep the problem and proof requirement, implement a different target
  model, and delete the prototype implementation
- `delete`: remove the capability because it duplicates the coding agent or another
  Skopos owner

No disposition authorizes an alias, adapter, fallback reader, dual writer, deprecated
export, or versioned compatibility path.

## Capability Ledger

| Capability | Disposition | Canonical owner | Prototype owner to remove | Regression seed or target proof |
| --- | --- | --- | --- | --- |
| Compact executable intent and progressive context | retain-and-refactor | Task, Scope, Memory, Session context | Mission-shaped task projection and compatibility brief | `agent-native-operating-model.test.ts`; fresh-Session continuation proof |
| Admission, iteration, stabilization, and closure | retain-and-refactor | Task lifecycle, Guards, Verify, Readiness | Eval phases and Mission closure coupling | phase-separation and risk-floor proof |
| Acceptance-linked, source-bound proof | retain-and-refactor | Evidence | public receipt noun, Workflow receipt authority, legacy timestamp fallback | `workflow-receipts.test.ts`; stale/reuse proof |
| Affected Scope and dependent selection | retain-and-refactor | Task proof boundary and Action selection | Mission change-scope model | `mission-change-scope.test.ts`, rewritten to Task/Scope |
| Pre-existing dirty isolation and explicit adoption | retain-and-refactor | Task claims and mutation ledger | Mission dirty baseline and `--own` compatibility behavior | dirty-boundary and contamination proof |
| Fail-fast execution and resumable remainder | retain-and-refactor | Action runner and Evidence | Eval check loop | named CLI e2e timeout/fail-fast cases |
| Exact execution ownership and Evidence reuse | retain-and-refactor | Action execution identity | Workflow run lease and receipt reuse path | `workflow-receipts.test.ts`; concurrent duplicate proof |
| Pre-state lease and post-state Evidence finalization | retain-and-refactor | Action runner and Evidence | Workflow-specific mutation finalizer | mutating Action post-state proof |
| Current-impact and satisfied-obligation reconciliation | retain-and-refactor | Guards, Work Queue, `next`, `done` | Workflow recommendation/checklist reconciliation | named CLI e2e reconciliation cases |
| Authority, provenance, promotion, and negative knowledge | retain-and-refactor | Memory | Mission-context projection from legacy memory state | `agent-native-operating-model.test.ts`; no-self-promotion proof |
| Small project provider protocol | replace | bounded Extension contract if declarative sources are insufficient | versioned `describe` / `brief` / `verify` schemas, exports, validators, and tests | extension authority-capture proof |
| Host-neutral projection parity | retain-and-refactor | host lifecycle and generated projections | prototype enforcement compatibility projection | `host-projection-model.test.ts`; Codex/Claude parity proof |
| Compact artifact lifecycle | replace | fully local, rebuildable `.skopos/**` artifact ownership | staged compatibility projections and legacy lifecycle map | clean-delete/rebuild proof |
| Worktree-aware task state | replace | Session/Task same-directory coordination broker | worktree-first identity, global current projections, compatibility readers | same-checkout multi-Session proof |
| Semantic document projection | replace | adoption intake catalog plus canonical Memory standard | permanent projection manifest and unchanged-layout full adoption | alternate-source intake, restructuring, and historical-filter proof |
| Cross-project fixture matrix | retain-and-refactor | release proof matrix | mapped-layout and prototype-workflow success claims | rerun every target adopter scenario |
| Installed-package UI | retain-and-refactor | host/UI release surface | monorepo-local package resolution and docs-hosted runtime output | fresh packed install, bundled assets, live refresh |
| Project-specific actions and guards | retain-and-refactor | namespaced project Actions, Guards, Profiles, Policies, Skills | Workflow/gate packs and project-provider execution authority | Unisane replacement plus unrelated-project fixtures |

## Stable Regression Seeds

The following current tests and data are inputs to rewrite, not names that must survive:

1. `packages/cli/src/__tests__/agent-native-operating-model.test.ts`
2. `packages/cli/src/__tests__/mission-change-scope.test.ts`
3. `packages/cli/src/__tests__/workflow-receipts.test.ts`
4. `packages/cli/src/__tests__/task-worktree-state.test.ts`
5. `packages/cli/src/__tests__/host-projection-model.test.ts`
6. `packages/cli/src/__tests__/artifact-lifecycle.test.ts`
7. relevant validation and reconciliation cases in
   `packages/cli/src/__tests__/cli.e2e.test.ts`
8. `packages/cli/src/__tests__/proof-phase.e2e.test.ts`
9. `internal/evals/proof-phase-benchmarks.json`
10. `internal/evals/proof-phase-baseline.json`

If a seed asserts compatibility behavior or prototype terminology, rewrite or replace
it. Do not keep the old production surface merely to keep an old test green.

## Historical Evidence Boundary

P1-W11 proves that several ideas are feasible in the prototype. It does not prove the
clean target contract.

Do not promote as current proof:

1. `.skopos/runs/**` or `.skopos/evals/**` artifact paths
2. temporary tarball identity or hash
3. the partial broad CLI diagnostic run
4. worktree compatibility behavior
5. staged artifact compatibility projections
6. mapped-layout adoption as a substitute for documentation restructuring
7. the previous proof score as proof of the new adopter matrix

Every retained behavior must pass again after its canonical owner lands.

## Completion

All P1-W11 capabilities now have an explicit clean disposition. The accepted decision
and convergence Plan contain the retained behavioral contracts. P1-W11 may be archived
once active links and its duplicate Finding are rerouted.
