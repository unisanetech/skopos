---
title: "Task: Reproducible Artifact Ownership"
status: superseded
owner: skopos-core
id: T-af720618
scope: skopos
role: task
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
risk: high-impact
started: 2026-07-28
lastUpdated: 2026-07-28
relatedDocs:
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../plans/P-e7e888e6-canonical-product-convergence.md
  - ../../findings/F-c1e8c13d-prototype-product-contract-convergence-gap.md
---

# Task: Reproducible Artifact Ownership

## Changelog

- `2026-07-28`: Made question, recommendation, Program-state, and Program-brief
  projections exclusively Task-owned under
  `.skopos/tasks/<worktree-id>/<task-id>/`, moved handoffs to the matching
  `.skopos/handoffs/<worktree-id>/<task-id>/handoff.json`, and added negative proof
  that workspace-global copies are not written.
- `2026-07-28`: Converged production readers, writers, UI, fixtures, packs, generated
  instructions, and tests on the declared local-state family; added deterministic
  Project/source-digest proof and a clean-delete/rebuild assertion that rejects
  undeclared `.skopos` children.
- `2026-07-28`: Started Phase 1 and recorded the tracked-source, generated-state,
  deletion, and proof boundary after auditing every current `.skopos/**` authority.

## Objective

Make every durable project choice reconstructible from tracked sources while making
all `.skopos/**` state safely disposable and locally rebuildable.

## Acceptance

1. `.skopos/**` owns no durable config, Policy, Skill, Plan, Task, Decision, or Finding
2. deleting `.skopos/**` loses no accepted project truth
3. `skopos init` rebuilds the local Project, Memory index, Scope graph, Actions,
   Guards, accepted Policies, accepted Skills, and Work Queue from tracked sources
4. UI runtime output lives only under `.skopos/ui/**`
5. checked-in generated human reference lives only under
   `docs/reference/generated/**`
6. generated state carries source digests and stale source state is not trusted
7. equivalent tracked inputs produce deterministic normalized projections
8. root `.skopos/overrides.json`, local-only policy acceptance, local-only skill
   acceptance, receipt duplication, and staged artifact compatibility maps are deleted

## Ownership Matrix

| Concern | Tracked authority | Local generated state | Removed prototype authority |
| --- | --- | --- | --- |
| Project config | `skopos.config.yaml` | `.skopos/project.json` | `.skopos/overrides.json` |
| Agent instructions | `AGENTS.md` | host adapters under `.skopos/cache/**` | local policy text as independent truth |
| Scopes and Profiles | `tools/skopos/scopes.yaml`, `tools/skopos/profiles/**` | `.skopos/index/**`, `.skopos/graph/**` | inferred paths promoted as canonicals |
| Actions and Guards | `tools/skopos/actions/**`, `tools/skopos/guards/**` | compiled capability views | Workflow/Gate authority retained only for compatibility |
| Policies | `tools/skopos/policies.yaml` plus pinned pack sources | resolved Policy and mapping projections | `.skopos/index/policies/resolved.json` as acceptance source; local override and mapping-decision files |
| Skills | `tools/skopos/skills/**` plus pinned pack sources | resolved Skill and host projections | `.skopos/index/skills/resolved.json` as acceptance source |
| Project Memory | canonical `docs/**` | `.skopos/index/**`, `.skopos/graph/**` | runtime observations promoted without review |
| Plans and Tasks | `docs/work/plans/**`, `docs/work/tasks/**` | Task-owned `.skopos/tasks/<worktree-id>/<task-id>/**` state and derived Work Queue | durable Plan/Mission state or workspace-global current-task projections under `.skopos/**` |
| Evidence and runs | no implicit Git authority; trusted imported attestations are explicit | `.skopos/evidence/**`, `.skopos/runs/**` | duplicate `.skopos/receipts/**` projection |
| Sessions and handoffs | tracked Task/handoff only when continuation must survive clones | `.skopos/sessions/**`, `.skopos/handoffs/**` | workspace-global current-task compatibility files |
| UI | source under `packages/ui/**` | `.skopos/ui/**` | tracked runtime HTML or app bundles |
| Generated reference | owning generator and tracked inputs | tracked `docs/reference/generated/**` | runtime HTML mixed with documentation |

## Execution Boundary

This Task owns only canonical convergence work and the files changed for Phase 1.
Unrelated P1-W11 implementation changes already present in the working tree remain
outside its proof boundary unless a Phase 1 edit must integrate with them.

## Planned Steps

1. promote accepted Policy and Skill choices into tracked sources
2. delete the root override model and command
3. compile local Policy, Skill, Guard, instruction, index, and graph state from tracked
   sources during init
4. replace timestamp-only invalidation with source digests
5. move UI and generated-reference outputs to their canonical owners
6. delete the staged artifact lifecycle and duplicate receipt projections
7. remove all readers and docs for deleted authority paths
8. add clean-delete/rebuild and deterministic-output proof
9. run focused package checks and record remaining Phase 2 dependency, if any

## Current Risks

1. current Mission/Program work state cannot become a tracked Task/Work Queue source
   without the canonical Task schemas owned by the following model-refactor phase
2. current generated indexes include clocks, absolute clone paths, and runtime history;
   normalized deterministic proof must exclude or refactor those fields
3. policy, skill, trust, query, init, and UI readers currently hard-code local paths
4. this worktree contains unrelated active prototype changes, so integration must be
   surgical and validated by owned paths

## Implementation Record

Completed in the current Phase 1 slice:

1. tracked Policy and Skill acceptance sources
2. direct root config authority with no local override model
3. content-digest freshness for source dependencies
4. deterministic `.skopos/project.json` across equivalent clone roots
5. one canonical local family across runtime, query, trust, instructions, UI, packs,
   fixtures, tests, and generated host guidance
6. local UI output under `.skopos/ui/**` and tracked references under
   `docs/reference/generated/**`
7. removal of lifecycle maps, permanent document mappings, duplicate receipts, and
   workspace-global current-task projections
8. clean-delete/rebuild proof plus a zero-match legacy-path gate
9. exact Task-owned question, recommendation, Program-state, Program-brief, and handoff
   state with no global dual writes or fallback reads

The remaining acceptance dependencies are:

1. the canonical Task and derived Work Queue model, which belongs to the following
   core-model and Task phases and must replace the prototype Mission/Program source
2. Policy-source freshness must compare recorded content digests rather than file
   modification times before generated Policy state can be treated as fresh

## Completion

Active. The artifact-ownership implementation is proven, but this Task must stay active
until the Task/Work Queue dependency is transferred to its canonical tracked Task.
