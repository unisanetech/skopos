---
title: Retrieval And Query Strategy
status: active
owner: skopos-query
id: SKOPOS-RETRIEVAL-STRATEGY
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - 00-architecture.md
  - artifact-model.md
  - docs-governance.md
  - agent-native-operating-model.md
reviewCycle: when retrieval contracts change
---

# Retrieval And Query Strategy

Skopos retrieves the smallest authoritative context needed for the current Task and
Scope.

## Changelog

- `2026-07-29`: Bound compact retrieval to Session, Task, Scope, and semantic document
  records and removed overlapping work-state projections.

## Retrieval Order

1. canonical root instructions
2. Session and current Task
3. selected Scope and dependency chain
4. canonical Memory relevant to the Task
5. applicable Decisions, Findings, and Patterns
6. source or symbol slices
7. generated reference or history only when necessary

## Semantic Document Record

Each document compiles into one record containing:

1. path, title, role, Scope, lifecycle, authority, provenance, and view
2. relationships and applicability
3. source digest and freshness
4. default visibility
5. current versus target classification

The same record drives agent retrieval and UI document views.

## Compact Session Context

The compact response contains:

1. Project and actor identity
2. current Task or Work Queue recommendation
3. open material questions
4. selected Scope context
5. next safe command
6. communication guidance and warnings

Task questions, recommendations, and handoff are selected by exact Task identity.
There is no workspace-global current-work projection.

## Query Rules

1. canonical sources outrank supporting and generated sources
2. active and durable documents are visible by default
3. archive and dead documents are excluded
4. target truth must be explicitly accepted
5. contradictions remain visible until authority is resolved
6. path heuristics assist brownfield intake but do not remain permanent authority
7. large repositories use subtree and Scope slices before full scans
8. later calls return deltas when source digests are unchanged
