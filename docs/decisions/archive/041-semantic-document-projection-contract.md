---
title: "Decision: Semantic Document Projection Contract"
status: superseded
owner: skopos-core
id: SKOPOS-DECISION-041
scope: skopos
role: decision
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
date: 2026-07-27
lastUpdated: 2026-07-28
relatedDocs:
  - ../D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../../work/plans/P-e7e888e6-canonical-product-convergence.md
  - 039-agent-native-single-control-plane-and-project-adoption-contract.md
  - ../../architecture/retrieval-and-query-strategy.md
  - ../../architecture/config-model.md
  - ../../architecture/artifact-model.md
  - ../../work/archive/P1-W11-agent-native-single-control-plane-convergence.md
---

# Decision: Semantic Document Projection Contract

## Context

Brownfield projects often have strong documentation whose physical layout differs from
Skopos conventions. The current console discovers one configured docs root, but UI
classification still infers decisions, findings, active work, and archives from
Skopos-shaped paths. That makes an alternate docs tree technically readable while
remaining semantically wrong for both retrieval and human navigation.

An UI-only mapping would create a second interpretation of project knowledge and would
not improve coding-agent context selection.

## Decision

1. Semantic document classification compiles into the existing
   `.skopos/index.json` knowledge authority.
2. The compiled document record is shared by query/agent context and the UI.
3. Skopos provides generic conventional inference for common path segments and document
   metadata.
4. Brownfield projects may declare a checked-in projection manifest through
   `docs.projectionPath`.
5. Projection manifests contribute sources and classification rules only. They do not
   create workflow, closure, or documentation authority.
6. Project rules outrank explicit document metadata, source-derived scope, and inferred
   defaults in that order. This lets a reviewed manifest correct ambiguous brownfield
   material without rewriting it.
7. Skopos core must not contain adopter-specific paths, labels, or domain grammar.
8. Multiple project-local documentation sources may be indexed when declared by the
   project manifest.
9. A source may derive scope from a source-relative path segment and an optional
   project-owned `{value}` template so package-local docs can participate in targeted
   retrieval without hardcoded core namespaces.
10. Historical and generated reference material remains searchable but is excluded from
   default agent/UI hot paths unless explicitly selected.
11. Existing projects without a projection manifest retain compatible single-root
    discovery with improved path-segment inference.

## Consequences

- Alternate brownfield docs trees can remain physically unchanged.
- Agents and humans see the same role and lifecycle interpretation.
- The root config stays compact because detailed mappings live in a checked-in manifest.
- `.skopos/index.json` becomes richer without adding another generated authority.
- Manifest freshness must participate in compiled-state invalidation and proof.

## Rejected Alternatives

1. hardcode a demanding adopter's docs paths in Skopos core
2. force brownfield projects to move docs into the recommended Skopos tree
3. classify documents only inside React selectors
4. add a second generated document-catalog artifact beside the knowledge index
5. treat project plans or workpacks as a second task-state authority

## Proof Requirement

1. a generic fixture with nested decisions, findings, workpacks, archives, and an
   additional docs source compiles correctly
2. query context selects authoritative non-historical documents from the compiled index
3. UI routes decisions/findings and lifecycle from compiled semantics rather than
   adopter-specific path checks
4. existing conventional projects remain compatible without a manifest
5. a live alternate-docs project shows active, durable, and historical classifications
   correctly without core changes
