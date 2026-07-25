# P1-W11 Agent-Native Single Control Plane Convergence

Temporary execution workpack for converging Skopos on the agent-native single-control-plane
contract.

## Metadata

- Status: `active`
- Temporary: `yes`
- Owner: `skopos-core`
- Scope: `skopos/workflow`
- Last Updated: `2026-07-25`
- Removal Rule: archive after the replacement public workflow, compact artifacts,
  receipt model, project-provider proof, migration notes, and cross-project scorecard
  pass
- Related Docs:
  - `../../decisions/039-agent-native-single-control-plane-and-project-adoption-contract.md`
  - `../../findings/F-20260725-agent-native-single-control-plane-and-context-economy-gap.md`
  - `../../architecture/agent-native-operating-model.md`

## Changelog

- `2026-07-25`: Added the portable adoption-matrix benchmark across large, governed,
  small, messy-brownfield, and alternate-docs fixture projects. The real Unisane pilot
  remains separate and is not claimed complete from fixture evidence.

- `2026-07-25`: Added the staged compact artifact lifecycle: generated
  `.skopos/project.json`, `.skopos/current/{task,brief}.json`, and
  `.skopos/receipts/*.json` projections point back to existing project, mission, and
  workflow-run authority; retention and removal conditions classify compatibility and
  cache candidates without deleting or moving them.

- `2026-07-25`: Added the host-neutral projection model inside the existing enforcement
  authority, generated mirror/adapter metadata from it, and made projection parity a
  trust check.

- `2026-07-25`: Corrected receipt filtering for the runtime-managed
  `.skopos/discussions/**` and `.skopos/memory/**` families so regenerated checkpoints
  and memory views do not invalidate graph/UI projection receipts while mission truth
  remains source-bound.

- `2026-07-25`: Added the versioned project-provider `describe`/`brief`/`verify`
  contract and validators while reserving workflow, task-state, and closure authority
  for Skopos.

- `2026-07-25`: Added authority-bearing knowledge records, explicit promotion evidence,
  rejection of inference-only self-promotion, and relevance-filtered negative knowledge
  compiled from the existing project memory authority.

- `2026-07-25`: Added task-, branch-, worktree-, repository-, and actor-aware identity,
  mission-scoped workflow/program state, compatibility projections, and worktree-bound
  workflow receipts.

- `2026-07-25`: Corrected mutating receipt finalization so the running lease owns the
  pre-action state and the completed receipt binds the stable post-action source state.

- `2026-07-25`: Added source-bound workflow receipts and exact execution ownership to
  the existing workflow-run/eval/done authority.

- `2026-07-25`: Added the first phase-separated execution slice on the existing eval
  authority with changed-scope iteration, stabilization evidence review, closure-only
  final proof, and compatibility-safe default closure behavior.

- `2026-07-25`: Opened the convergence workpack and recorded the target architecture,
  sequencing, compatibility boundary, and proof matrix.

## Objective

Make Skopos the one project operating and memory layer used by coding agents while
allowing projects to contribute domain-specific context, actions, and guards without
maintaining a second LLM workflow.

## Guardrails

1. keep the daily developer and agent workflow smaller than the current surface
2. preserve public compatibility until replacement behavior and migration notes exist
3. do not delete current artifacts until replacement authority and recovery proof pass
4. keep project providers out of task-orchestration ownership
5. prove every generic capability outside one demanding adopter
6. measure supervision, context, runtime, and false-closure effects

## Slices

1. model one compact task contract and brief
2. compile current workflows, policies, and gates into context/actions/guards
3. separate admission, changed iteration, stabilization, and one final closure
4. add source-bound receipts and exact command ownership
5. make active task state branch/worktree aware
6. add authority, provenance, promotion, and negative-knowledge contracts
7. add the small `describe`/`brief`/`verify` provider protocol
8. produce host projections from one project model
9. compact artifact families and define retention/migration
10. pilot complete adoption in a complex governed monorepo and unrelated projects
11. retire overlapping internal paths and publish public migration guidance

## Incremental Status

1. `implemented`: compact task contract and brief
   - additive model contract exists in `@skopos/model`
   - existing mission state supplies declared goal, scope, decisions, and proof inputs
   - missing acceptance criteria remain explicit rather than inferred
2. `implemented`: context, actions, and guards
   - accepted policy rules compile to authority-bearing context
   - registered workflows compile to structured actions when their command is safely
     representable as an executable plus arguments
   - resolved gates compile to guards without claiming manual checks are automated
   - `start` and `next` expose the compact projection additively; no replacement command
     or second workflow authority exists
3. `implemented`: phase-separated execution
   - `start` owns admission and compact intent
   - `eval --phase iteration` selects changed-scope checks without final build/proof
   - `eval --phase stabilization` reviews generator/maintenance workflow evidence
     without executing project actions implicitly
   - `eval --phase closure` remains the one final validation lane and the compatibility
     default
   - `trust` and `done` reject iteration/stabilization eval as closure evidence
4. `implemented`: source-bound receipts and exact command ownership
   - existing workflow-run artifacts carry exact action/command, source/config,
     environment, stable-output, actor, and ownership-lease evidence
   - an exact concurrent invocation is rejected with its owner run id
   - a valid completed read-only or output-bearing action is reused unless `--force`
     explicitly requests a rerun
   - eval and done validate new receipts while retaining timestamp fallback for legacy
     compatibility
5. `implemented`: worktree-aware active task state
   - plans and missions created by the runtime carry repository, worktree, branch, task,
     and actor identity
   - authoritative questions, recommendations, program state, and program briefs live
     under `.skopos/tasks/<worktree-id>/<task-id>/`
   - the existing global questions, recommendations, program state, and program brief
     paths remain generated compatibility projections, not a second workflow authority
   - mission selection ignores task-aware state from another branch or worktree
   - eval and done bind closure evidence to the current task/worktree while legacy
     missions remain readable through explicit compatibility behavior
   - workflow receipt execution keys and validation include branch/worktree identity
   - mutating workflow receipts are finalized against post-action source and output
     state, preventing a successful generator from invalidating its own receipt
6. `implemented`: authority, provenance, promotion, and negative knowledge
   - knowledge records distinguish declared, accepted, observed, inferred, proposed, and
     historical authority while retaining source provenance
   - canonical promotion is a pure guard over the existing memory flow; inference-only
     or proposal-only evidence cannot promote itself
   - accepted promotion requires accepted project evidence, while declared promotion
     requires declared or accepted evidence
   - rejected decisions and superseded decisions from the existing
     `.skopos/memory/state.json` authority compile as rejected or retired negative
     knowledge
   - relevant negative knowledge joins the compact task context without a new command,
     artifact authority, or workflow
7. `implemented`: small project-provider protocol
   - version 1 exposes only `describe`, `brief`, and `verify` request/response contracts
   - `describe` contributes context, actions, guards, source paths, and capabilities
   - `brief` may select only capabilities declared by the same provider
   - `verify` returns source-bound evidence rather than a closure verdict
   - validators reject provider authority claims, duplicate/conflicting capability ids,
     undeclared brief capabilities, and successful evidence with no command, artifact,
     or source digest
   - this slice does not add provider discovery, configuration, execution, or a new
     command; those behaviors are not claimed as implemented
8. `implemented`: host projections from one project model
   - `.skopos/enforcement.json` carries one host-neutral projection model derived from
     the canonical instruction source, enforcement rules, and adapter capabilities
   - Codex, Claude Code, Cursor, GitHub Copilot, and manual-host projections reference
     the same complete enforcement rule set
   - instruction mirror targets are selected from that model rather than maintained as
     a separate runtime authority
   - Claude Code settings, the Codex adapter manifest, and manual fallback guidance
     embed their project-model authority and rule coverage
   - trust warns on a legacy enforcement profile with no host model and rejects a
     present-but-divergent projection; instruction regeneration performs the migration
   - existing adapter scripts and public commands remain compatible; no new host
     workflow authority or command was added
9. `implemented`: compact artifact families, retention, and staged migration
   - `.skopos/project.json` records the project, current-task, receipt, index, advanced
     history, and derived-cache lifecycle families
   - `init` generates the project lifecycle immediately so trust does not penalize a
     correctly initialized project before its first task starts
   - `start` and `next` generate `.skopos/current/task.json` and
     `.skopos/current/brief.json` as replaceable views of task/worktree-aware mission
     authority
   - successful workflow runs generate `.skopos/receipts/<execution-key>.json` as a
     compact evidence view that points back to its authoritative run artifact
   - trust warns when the lifecycle projection has not been generated and fails a
     present projection that duplicates compact ownership, drops required families,
     changes workflow authority, or omits a removal condition
   - plans, missions, runs, evals, global router projections, agent briefs,
     discussions, graphs, proof reports, recommendations, and logs remain in their
     existing paths during staged migration
   - no artifacts were deleted or silently relocated, no public command changed, and
     high-churn families are only cache candidates until reader and recovery proof
     passes
10. `in progress`: cross-project adoption pilots
   - the proof scorecard now includes a must-win agent-native adoption category
   - large-monorepo, boundary-aware governed monorepo, small-service,
     messy-brownfield, and alternate-docs fixtures each run `init` and `start`
   - every pilot must generate a Skopos-owned project lifecycle plus task/worktree-bound
     current task and brief projections
   - the matrix rejects any project whose compact lifecycle names a workflow authority
     other than Skopos
   - fixture proof establishes portability but does not substitute for the real complex
     adopter; Unisane remains the intended live governed-monorepo pilot
   - Unisane is currently read-only from this workspace and has a large pre-existing
     dirty tree, so no adoption files or generated state were changed here
11. `not started`: overlapping-path retirement and public migration guidance remain
    gated on the live complex-adopter pilot

## Latest Slice Proof

1. iteration eval selected `pnpm typecheck` and `pnpm test`, excluded build and final
   proof, passed both checks, and left implementation/closure items pending
2. `skopos done` rejected that complete iteration eval as non-closure evidence
3. stabilization eval ran no project checks, reviewed owner workflow evidence, and
   reported final proof as not required
4. closure eval ran `pnpm typecheck`, `pnpm test`, and `pnpm build`; all three passed
5. closure proof passed with no workflow evidence gaps and high/agent-ready trust
6. proof workflow receipt:
   `.skopos/runs/run-20260724T232507Z-quality-run-proof-phase.json`
7. closure eval artifact:
   `.skopos/evals/mission-20260724T230755Z-workspace-implement-p1-w11-phase-separated-validation-thro.json`
8. source-bound instruction receipt:
   `.skopos/runs/run-20260724T233900Z-instructions-sync-mirrors-d3ef8500.json`
   was returned unchanged on the second exact invocation
9. proof ownership run:
   `.skopos/runs/run-20260724T233922Z-quality-run-proof-phase-8d969b24.json`
   rejected a concurrent exact invocation, then was reused after success
10. a later docs input change caused closure eval to reject that proof receipt with
    `Relevant workflow source or configuration changed after this receipt was recorded`
11. task/worktree unit proof writes three tasks across two worktree identities, updates
    the global compatibility projection three times, reloads all three authoritative
    question/recommendation sets without loss, and rejects mission mutation from another
    worktree
12. live `next` wrote task authority for the active mission under
    `.skopos/tasks/a2910d0ea928e597fd4d19a1/mission-20260724T235845Z-workspace-implement-p1-w11-task-and-worktree-aware-active-/`
13. live `program next` wrote the task-scoped program state and brief while retaining the
    existing global projections
14. the optional broad CLI e2e suite completed with 55 of 79 tests passing; its 24
    failures span earlier dirty-tree docs, workflow-lane, trust, and phase-eval
    expectations plus one timed-out discussion case, so this run is recorded as
    diagnostic evidence rather than closure proof for the task-state slice
15. authority/promotion unit proof rejects an inferred record whose only evidence is
    inferred, accepts the same record only when accepted project evidence is supplied,
    and selects a relevant superseded decision as negative task context
16. provider unit proof accepts one bounded provider description, merges its declared
    action into the operating model, and rejects authority capture, undeclared brief
    actions, and evidence without a source binding
17. host-projection unit proof renders three instruction mirrors plus Claude Code,
    Codex, and manual adapter metadata from one enforcement model and rejects a host
    projection that drops an enforcement rule
18. receipt proof ignores high-churn discussion and memory projections but still
    invalidates when source-bound mission truth changes
19. artifact-lifecycle unit proof validates the staged family map, writes compact task
    and receipt projections with explicit authority pointers, and rejects duplicate
    compact-path ownership
20. the 21-benchmark proof scorecard passes after adding the agent-native adoption
    category; its five isolated project profiles all preserve Skopos workflow authority,
    staged migration, generated current projections, and mission/task identity

## Closure Matrix

1. light task completes through compact context, focused proof, and closure without
   mission ceremony
2. workpack task persists intent, phases, decisions, findings, and proof
3. complex adopter has no parallel start/verify/done workflow authority
4. exact duplicate commands execute once for one stable source state
5. stale receipts fail after relevant source/config/provider changes
6. parallel worktrees cannot overwrite active task state
7. inferred memory cannot self-promote
8. retired patterns appear in task context when relevant
9. host projections remain generated and in parity
10. Skopos, complex-monorepo, small-project, and messy-brownfield benchmarks pass
