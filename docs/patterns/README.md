---
title: Project Memory Patterns
status: active
owner: skopos-core
id: SKOPOS-PATTERNS-GRAMMAR
scope: skopos
role: standard
lifecycle: durable
authority: canonical
provenance: accepted
view: current
implementationStatus: implemented
lastUpdated: 2026-07-28
relatedDocs:
  - ../architecture/docs-governance.md
  - ../architecture/artifact-model.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
reviewCycle: when Pattern semantics or retrieval changes
---

# Project Memory Patterns

`patterns/` stores reusable contextual knowledge that helps an agent recognize a
successful approach or avoid a recurring failure. It is an optional Project Memory
family, not a required folder for every project.

## Changelog

- `2026-07-28`: Standardized Pattern records on exact YAML `kind` and `appliesTo`
  fields, enforced Scope/ancestor boundaries and short technical signals, and confirmed
  that failure knowledge stays in this family rather than a parallel
  `failure-patterns/` tree.
- `2026-07-28`: Established Patterns as optional Scope-relative Memory with preferred
  and failure kinds, metadata-derived indexing, bounded retrieval, and explicit
  promotion rules.
- `2026-07-28`: Connected Pattern metadata to the document catalog and relevant
  failure-pattern selection in compact Task briefs.
- `2026-07-28`: Made Pattern kind and applicability fail-closed inputs, added strict
  metadata and link verification, and expanded relevance matching to Task-contract,
  Scope, owned-path, named-symbol, Action/proof, and risk-lane signals.

## What Belongs Here

Every Pattern has one kind:

1. `preferred-pattern` records a repeatable approach, its context and forces,
   recognition signals, expected outcome, and trade-offs.
2. `failure-pattern` records a recurring wrong move, its detection signals, failure
   mechanism, consequences, prevention, and recovery.

Both kinds live in the same `patterns/` family. Do not create a sibling
`failure-patterns/` folder: kind is semantic metadata, while the folder is the stable
retrieval family.

A Pattern is not:

| Memory role | Boundary |
| --- | --- |
| Standard | A Standard owns a normative rule; a Pattern explains a contextual recurring shape. |
| Finding | A Finding owns a current observed gap; it may instantiate a Pattern. |
| Decision | A Decision owns an accepted choice; it may adopt or address a Pattern. |
| Plan or Task | Work owns future direction and execution; a Pattern informs that work. |

## Entry Contract

Use a collision-resistant `PAT-<id>` instead of sequential numbering. Each entry
declares:

1. Scope, role `pattern`, and kind `preferred-pattern` or `failure-pattern`
2. lifecycle, authority, provenance, and view
3. owner and applicability
4. recognition or detection signals
5. context and forces or failure mechanism
6. preferred response, or prevention and recovery
7. expected outcome, consequences, and trade-offs
8. relationships, freshness, and supporting Evidence when relevant

The adopted metadata grammar is YAML frontmatter:

```yaml
---
title: Failure Pattern Title
status: active
owner: project-maintainers
id: PAT-a84d19c2
scope: workspace
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: accepted
view: current
appliesTo:
  - api
  - packages/payments/**
relatedDocs:
  - ../findings/F-related.md
lastUpdated: 2026-07-28
reviewCycle: when the affected contract changes
---
```

`kind` and `appliesTo` are exact keys. `Pattern Kind`, `patternKind`, and Markdown
metadata sections are discovery-only foreign inputs and fail strict adoption.

Do not maintain an entry list in this README. Skopos derives Pattern indexes and
groupings from entry metadata into `.skopos/index/**`.

A Pattern with a missing or invalid kind or with no applicability is not compiled as
agent knowledge. When strict metadata is enabled, the Project Memory trust check also
fails and identifies the owning document; Skopos never guesses that the entry is a
preferred Pattern.

## Scope And Retrieval

Workspace Patterns live here. Scope-owned Patterns live at
`<scope-memory-root>/patterns/` and use the same grammar.

1. Parent Patterns are inherited only when their applicability matches the child
   Scope.
2. Child Patterns may add context, but cannot silently weaken a canonical parent
   Standard or Guard.
3. Active and durable Patterns are retrieved only when their applicability overlaps
   normalized signals from the Task goal and contract, declared Scope identity and
   roots, Task-owned paths, symbols named by the Task, selected Actions and Evidence,
   or Task risk.
4. A child Scope can receive relevant parent Patterns; it cannot receive a sibling or
   child-only Pattern solely because a keyword matches.
5. Short signals such as `ui`, `api`, `db`, and `cli` remain eligible retrieval terms.
6. Patterns are never a mandatory session-start reading list.
7. Historical Patterns move to `<memory-root>/archive/patterns/` and are retrieved only
   through an explicit relationship or targeted negative-knowledge query.

## Lifecycle And Promotion

1. `active`: still being validated and eligible for relevant retrieval.
2. `durable`: accepted reusable knowledge and eligible for relevant retrieval.
3. `historical`: excluded from baseline retrieval but retained when it can explain or
   prevent recurrence.
4. `dead`: delete after promoting any still-valid rule or Evidence link.

Proposed and inferred Patterns cannot promote themselves. An observed failure Pattern
needs reproducible Evidence or explicit acceptance before it becomes canonical.
Repeated success or failure may justify a Standard, Guard, or Decision, but that
promotion uses the destination family's acceptance process. Keep a relationship to the
promoted authority and remove duplicated normative text from the Pattern.
