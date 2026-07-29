---
title: "Decision: Agent-Native Single Control Plane And Project Adoption Contract"
status: superseded
owner: skopos-core
id: SKOPOS-DECISION-039
scope: skopos
role: decision
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
date: 2026-07-25
lastUpdated: 2026-07-28
relatedDocs:
  - ../D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../../work/plans/P-e7e888e6-canonical-product-convergence.md
  - ../../architecture/agent-native-operating-model.md
  - ../../architecture/action-extension-model.md
  - ../../architecture/trust-and-closure-model.md
  - ../../architecture/artifact-model.md
  - ../../archive/agentic-operating-plan.md
  - ../../findings/archive/F-20260725-agent-native-single-control-plane-and-context-economy-gap.md
---

# Decision: Agent-Native Single Control Plane And Project Adoption Contract

## Changelog

- `2026-07-28`: Superseded by the clean pre-release contract. The single-control-plane
  thesis remains, while compatibility migration, permanent mapping, prototype nouns,
  and worktree-first coordination are rejected.

- `2026-07-27`: Clarified the validation-economy consequence: mission-owned change
  boundaries, affected and dependent checks, fail-fast execution, reusable exact
  receipts, current-impact workflow reconciliation, and a project choice between
  command or workflow-action validation.

- `2026-07-25`: Accepted one Skopos workflow control plane, the
  context/action/guard public model, full downstream-project adoption, progressive
  extension, task contracts, phase-separated proof, and compact authority-aware memory.

## Context

Skopos has accumulated plans, missions, questions, recommendations, program state,
discussion memory, evals, trust, workflows, packs, gates, generated projections, and
host adapters. These capabilities address real supervision problems, but their combined
surface can reproduce planning and state management already owned by modern coding
agents.

Complex downstream projects also need project-specific scope resolution, architecture
checks, generators, and closure proof. Treating each such project as a separate workflow
behind an adapter would leave two control planes and duplicate task, decision, and proof
truth.

## Decision

1. Skopos is the single project workflow, memory, and closure control plane.
2. Downstream projects adopt Skopos completely and contribute project-specific context,
   actions, and guards.
3. Skopos does not reproduce the coding agent's general reasoning, planning, tool use, or
   subagent orchestration.
4. The primary public mental model is `context + actions + guards`.
5. Project and task memory remain distinct; persisted task state is proportional to
   risk, duration, and coordination needs.
6. Admission, iteration, stabilization, and closure are separate execution moments.
7. Risk lanes define the final proof floor and do not cause repeated final gates.
8. Proof maps acceptance criteria to evidence and uses source-bound receipts to prevent
   stale or duplicate certification.
9. Knowledge carries provenance and cannot silently promote inference into canonical
   truth.
10. Negative knowledge, including retired and rejected patterns, is part of project
    memory.
11. Parallel state is task/worktree aware; shared generators and integration closure
    have one owner.
12. Extension remains progressive: automatic detection, checked-in configuration, then
    an optional small provider protocol for dynamic projects.
13. Host integrations render one Skopos project model into instructions, skills, hooks,
    MCP, or fallback guidance.
14. Skopos provides recommended docs roles and structure for new/clean projects while
    mapping strong existing brownfield docs without forcing path conformity.
15. Artifact, command, and workflow growth must be justified by reduced supervision,
    better task success, or stronger trust.
16. Root commands are a validation capability catalog, not automatic gates. Mission
    proof uses affected scope and dependents, ignores unchanged pre-existing dirty
    paths, fails fast, and reuses exact successful receipts until relevant state changes.
17. A project may select command-derived or workflow-action validation, but cannot keep
    both as competing execution authorities; Skopos still owns eval, trust, and closure.
18. Eval re-resolves registered workflow requirements from current mission impact.
    Admission-time workflow recommendations cannot remain mandatory after their
    manifests or affected inputs stop matching the task.
19. Impact may describe applicable project actions, but closure lists only unsatisfied
    actions. Fresh bootstrap state, synchronized mirrors, and valid workflow receipts
    cannot remain as repeat-work instructions.

## Consequences

### Positive

1. developers and agents learn one daily workflow
2. complex projects can fully adopt Skopos without maintaining parallel LLM systems
3. project-specific commands remain authoritative without leaking domain rules into core
4. newer agents can use their native reasoning and coordination capabilities
5. context and proof become smaller, fresher, and easier to explain
6. Skopos improvements discovered in demanding projects remain portable

### Costs

1. overlapping current commands and artifacts require a measured convergence plan
2. runtime schemas need migrations before public compatibility surfaces change
3. task-state and receipt isolation require worktree-aware storage
4. integrations need protocol compatibility and permission policy

## Compatibility And Migration

Skopos is pre-1.0 but already has a public CLI and generated artifact schemas.

1. first prove the target contract through additive compact projections and aliases
2. keep current public commands working until replacement commands and migration notes
   are available
3. remove replaced internal runtime paths under clean-refactor policy
4. version externally consumed configuration, provider, and artifact changes
5. do not keep two long-term task or closure authorities for compatibility

## Rejected Alternatives

1. keep Skopos and each downstream project's LLM workflow as peer control planes
2. expose a large in-process plugin SDK with many lifecycle hooks before the three
   primitives are proven
3. force every repository into one exact docs tree
4. persist plans, missions, recommendations, questions, evals, and discussion artifacts
   for every small task
5. let an LLM-generated summary self-promote into canonical memory

## Proof Requirement

The contract must be proven on:

1. Skopos self-hosting
2. one complex governed monorepo
3. one small project
4. one messy brownfield project
5. one project whose docs structure differs from the recommended Skopos tree
