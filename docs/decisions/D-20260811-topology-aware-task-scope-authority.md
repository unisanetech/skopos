---
title: "Decision: Topology-Aware Task Scope Authority"
status: accepted
owner: skopos-core
id: D-20260811-topology-aware-task-scope-authority
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: target
date: 2026-08-11
lastUpdated: 2026-08-11
implementationStatus: partial
relatedDocs:
  - ../architecture/docs-governance.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - D-20260803-task-local-proof-and-project-integration-readiness-boundary.md
  - ../findings/F-20260811-topology-aware-task-scope-resolution-gap.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when Task admission, Scope resolution, ownership expansion, or proof attribution changes
---

# Decision: Topology-Aware Task Scope Authority

## Changelog

- `2026-08-11`: Implemented the release baseline for deepest `codeRoots` admission,
  fail-closed mixed-Scope ownership, explicit workspace coordination, and packed CLI
  parity. Deprecated the ceremonial `narrow-scope-first` path: legacy attempts now
  return the inferred replacement Scope and exact replacement/supersession commands.
  Post-admission Scope expansion and automatic parent/child decomposition remain
  target work.
- `2026-08-11`: Implemented post-admission topology enforcement. Ownership expansion
  now records whether work stayed within authority, reached a declared dependency,
  rebound to a meaningful common ancestor, or used an explicitly selected workspace
  boundary. Unrelated Scopes fail before adoption with concrete split-Task commands.
  Rebinding moves the portable Task projection, refreshes Memory/Actions/Guards,
  resets required Action steps, and changes proof identity. Source, reconstruction,
  and packed CLI fixtures pass. Automatic child-Task materialization and richer
  host-rendered proposals remain follow-up ergonomics, not authority gaps.

## Context

Projects expose many valid topologies: one application, several applications and
packages, services, infrastructure, domains, nested products, or custom combinations.
Skopos already declares project-generic Scopes and can detect affected Scopes from
owned paths, but self-hosted public-web Tasks demonstrated that a recorded
`narrow-scope-first` answer can leave the Task bound to the workspace Scope.

This is not a web-specific defect. A Task whose recorded choice, declared authority,
Memory root, Actions, Guards, Evidence, and Readiness disagree cannot reliably bound
work in any user project.

## Decision

A Task is bound to the narrowest valid declared Scope that owns its intended work.
Scope authority is derived from explicit project topology and Task facts, never from
Skopos-specific directory names or hard-coded project archetypes.

### Admission

Task admission evaluates these signals in order:

1. an explicitly named Scope id or alias
2. an explicit target path
3. initially declared owned paths
4. the deepest matching declared `codeRoots`
5. Scope ancestry and dependency edges
6. goal language only as supporting evidence, never as authority by itself

When one declared Scope owns every initial path, Skopos binds the Task to that Scope.
When no declared child Scope matches, the workspace remains valid only as an explicit
or explainable fallback. Ambiguity produces a bounded fail-closed response with
concrete candidate Scopes and explicit-Scope or split-Task recovery. A host may present
that response as a question only when the selected answer can operationally change
authority; it never silently widens authority.

### Multi-Scope Work

When intended work spans several Scopes, Skopos chooses one of three explicit shapes:

1. one coherent Task bound to the nearest meaningful common ancestor
2. a parent Task with child Tasks bound to independently owned Scopes
3. an explicitly approved multi-Scope or project-integration Task

Unrelated Scopes never collapse silently into workspace authority. Parent and child
Tasks retain separate ownership, Memory obligations, Actions, Guards, Evidence, and
Readiness unless an integration Task intentionally aggregates them.

### Operational Decisions

`narrow-scope-first` is an execution decision, not a label. Resolving it must either:

1. rebind the Task to the selected Scope and refresh its portable state, or
2. return the exact safe command or remaining ambiguity that prevents rebinding

Rebinding or widening Scope authority changes the proof subject. Before any mutation,
Skopos may replace the admission Scope and baseline atomically. After work begins, it
must preserve every existing path baseline, record reviewed pre-adoption state for new
paths, and either create a new proof-subject identity or supersede the Task. It must
also refresh the Task projection location, affected dependents, Memory root, selected
capabilities, Evidence requirements, and stale-proof status before work can continue.

### Ownership Expansion

An owned path outside the current Scope is not merely another file. Skopos must
classify whether it is:

1. a declared dependency reached by an explainable impact edge
2. a coherent Scope expansion
3. an independently owned child Task candidate
4. unrelated work that must remain outside the Task

Semantic expansion is therefore reviewed before path adoption. A recorded path
expansion cannot by itself widen Task authority.

## Implemented Release Baseline

The first implementation slice establishes these invariants:

1. initial owned paths resolve through declared `codeRoots` and Scope paths
2. the deepest matching declared Scope owns a deterministic single-Scope Task
3. the resolver is independent of Scope kind and project directory conventions
4. mixed child/workspace or sibling ownership fails before Task creation and names the
   candidate Scopes
5. an explicit Scope remains the authority signal for intentionally coordinated work
6. future Plans do not emit the former generic monorepo Scope question
7. legacy `narrow-scope-first` decisions cannot resolve without rebinding; they return
   a replacement Task command and supersession recovery instead
8. source and packed npm fixtures prove narrow selection and mixed-Scope refusal

The implemented authority path now includes nearest-meaningful-common-ancestor
selection, declared-dependency expansion, post-admission rebinding, fail-closed
unrelated work, portable reconstruction, and packed CLI parity. It returns exact
split-Task recovery commands rather than silently widening. Automatic creation of the
recommended child Tasks and richer host-rendered proposal controls remain usability
follow-ups; they cannot bypass the implemented authority check.

## Rejected Alternatives

### Always bind Tasks started at the repository root to the workspace

Rejected because command location is not project authority and would erase declared
application, service, package, domain, and infrastructure boundaries.

### Infer Scope from goal text alone

Rejected because names are ambiguous and project-specific. Paths and the declared
Scope registry are stronger evidence.

### Allow ownership additions to widen Scope silently

Rejected because audit history without authority control still permits Task drift and
invalidates proportional proof.

## Consequences

1. Scope-aware Memory, Action, Guard, Evidence, and Readiness selection become one
   coherent authority chain.
2. ordinary work in monorepos remains narrow without requiring project-specific core
   logic.
3. genuine cross-Scope work becomes explicit and may require parent/child or
   integration structure.
4. existing Tasks reconstructed from portable state must preserve the exact resolved
   Scope identity and proof baseline.
5. public release requires generic topology fixtures, not a patch for `apps/web`.

## Required Proof

Implementation must cover at least:

1. one unscoped single-project repository
2. one application inside a monorepo
3. one package or service inside a monorepo
4. nested Scopes with deepest-owner selection
5. an application plus one declared dependency
6. two unrelated Scopes requiring explicit structure
7. an unregistered or ambiguous path
8. Scope expansion after work begins
9. durable reconstruction with the same Scope and proof identity
10. identical behavior through source, packed CLI, and supported hosts
