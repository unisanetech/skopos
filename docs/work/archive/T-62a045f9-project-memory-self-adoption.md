---
title: "Task: Project Memory Self-Adoption"
status: completed
owner: skopos-core
id: T-62a045f9
scope: skopos
role: task
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
risk: high-impact
started: 2026-07-28
completed: 2026-07-28
lastUpdated: 2026-07-28
relatedDocs:
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../plans/P-e7e888e6-canonical-product-convergence.md
  - ../../findings/F-c1e8c13d-prototype-product-contract-convergence-gap.md
  - ../../architecture/docs-governance.md
  - ../../patterns/PAT-0c339ca4-target-standard-without-self-adoption.md
---

# Task: Project Memory Self-Adoption

## Changelog

- `2026-07-28`: Completed full workspace tests and typechecks, the production build,
  clean self-host reconstruction, source-bound workflow proof, Trust review, Mission
  closure, and archived this Task.
- `2026-07-28`: Closed the final audit gaps: two-way generated-reference placement,
  explicit adopted-versus-discovery records, ancestor-aware public context, exact
  project-generic Scope kinds across graph/impact/plan/UI consumers, unique Memory
  roots, and freshness for colocated Scope Memory.
- `2026-07-28`: Kept closure open after the final contract audit found missing
  two-way generated-reference placement, public-context Scope inheritance,
  discovery-only foreign-document isolation, and generic Scope kinds.
- `2026-07-28`: Closed the final contract gaps found by self-hosting: one YAML
  metadata grammar, deepest-root Scope ownership, role/path enforcement, duplicate-id
  quarantine, all-role Task context, Scope inheritance, short relevance signals,
  query freshness, and Scope-only UI grouping.
- `2026-07-28`: Recorded the high-impact self-adoption slice after the target grammar,
  Scope registry, document catalog, physical migration, Pattern family, and focused
  proof landed; final reconstruction and closure proof remain.

## Objective

Make Skopos the first full repository adopter of the canonical Project Memory structure
so its own coding-agent workflow exercises the same predictable knowledge grammar that
other projects will adopt.

## Acceptance

1. the workspace uses the canonical Memory families and has no active legacy document
   tree
2. each material package has a stable path-independent Scope id, code root, memory
   root, parent, Profile, dependencies, and owner
3. durable documents declare stable identity, Scope, role, lifecycle, authority,
   provenance, and view in canonical YAML frontmatter
4. Scope Memory uses the same relative grammar as workspace Memory
5. Decision, Finding, Pattern, Plan, and Task indexes are metadata-derived; no
   hand-maintained registry remains
6. `patterns/` distinguishes preferred and failure Patterns from Standards, Findings,
   Decisions, Plans, and Tasks
7. failure Patterns compile into relevance-selected negative knowledge and stay out of
   unrelated Task context
8. relevant active and durable architecture, Standards, domains, guides, operations,
   Decisions, Findings, Plans, Tasks, Patterns, and references reach compact Task
   context with Scope inheritance and sibling isolation
9. generated runtime state remains under `.skopos/**`; checked-in generated human
   reference remains under `docs/reference/generated/**`
10. links, generated agent instructions, fixtures, CLI, query, UI, tests, and docs agree
   on the canonical structure
11. clean reconstruction, focused tests, type proof, build, trust, and Task closure
    checks pass or record an explicit remaining blocker

## Ownership

This Task owned the self-adoption-specific documentation moves, metadata normalization,
Scope declarations, document catalog and Scope compilation, relevant context selection,
host projections, fixtures, and focused proof. It did not claim completion of every
Phase 3 Profile, promotion, freshness, or adoption-readiness feature, nor the Phase 4
agent-guided restructuring workflow.

## Implementation Record

Implemented:

1. canonical `docs/` workspace tree with only the universal router and overview
   required
2. centralized `docs/scopes/<scope-id>/` memory roots for all Skopos packages
3. tracked `tools/skopos/scopes.yaml` with stable declared Scope identity and graph
   relationships
4. a compiled fully adopted Scope index containing only declared Scopes while docs and
   instruction surfaces remain available through their own graphs
5. first-class document metadata and a metadata-derived catalog
6. optional `patterns/` grammar with `preferred-pattern` and `failure-pattern` kinds
7. accepted failure Pattern PAT-0c339ca4 for target standards without self-adoption
8. relevance-bounded failure-pattern compilation into negative knowledge
9. relevance-bounded compilation for every eligible active and durable Memory role
10. deepest-root Scope ownership for centralized or deliberately colocated Memory
11. fail-closed malformed metadata, legacy schema, role/path, unknown-Scope, broken-link,
    and duplicate-id checks
12. parent-Scope inheritance, sibling isolation, and preservation of short signals such
    as `ui`, `api`, `db`, and `cli`
13. removal of legacy document families and hand-maintained registries
14. fresh query Memory and Scope-only UI groupings, while docs and instruction surfaces
    remain in their own graph
15. repaired documentation links, generated host instructions, fixtures, and focused
    tests
16. two-way generated-reference enforcement: generated authority and generated
    directories are valid only at `<memoryRoot>/reference/generated/**`
17. explicit `adopted` and `discovery` catalog records so foreign metadata remains
    restructuring evidence and cannot compile into ordinary agent Memory
18. ancestor-aware public context with sibling and child isolation, all canonical
    Memory roles, and relevance-bounded Patterns
19. exact generic Scope kinds for workspace, product, application, service, package,
    domain, infrastructure, and tool, with library/minimal behavior left to Profiles
20. generic Scope participation in architecture, hierarchy, dependencies, commands,
    impact, validation discovery, understanding, and UI
21. minimal source dependencies for every declared Memory root so colocated document
    changes invalidate cached context without repeatedly hashing nested roots
22. Docs-graph projection for every declared Scope Memory root

## Closure Proof

1. clean `.skopos/**` reconstruction indexed all 135 adopted documents and all 13
   declared Scopes without catalog violations
2. 79 CLI tests and 51 UI tests passed, including focused catalog, Scope, context,
   freshness, query, impact, graph, and UI regressions
3. all 12 package typechecks and the full production build passed
4. the proof-phase scorecard passed all 20 benchmarks with no regressions
5. registered instruction synchronization, knowledge refresh, portal render, console
   build, and proof workflows succeeded with source-bound receipts for the final tree
6. final Trust, closure evaluation, Mission completion, and `done` passed

## Completion

Completed on 2026-07-28. Generic Profile enforcement, promotion validation, automated
restructuring, and full adoption Readiness remain outside this Task under the canonical
convergence Plan; this closure does not imply those later phases are complete.
