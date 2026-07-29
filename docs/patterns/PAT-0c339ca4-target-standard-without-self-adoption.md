---
title: "Failure Pattern: Declaring A Target Standard Without Self-Adopting It"
status: active
owner: skopos-core
id: PAT-0c339ca4
scope: skopos
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: accepted
view: current
appliesTo:
  - project-memory
  - adoption
  - documentation-restructuring
  - scaffolding
  - templates
  - self-hosting
  - release-readiness
lastUpdated: 2026-07-30
relatedDocs:
  - README.md
  - ../architecture/docs-governance.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../findings/archive/F-c1e8c13d-prototype-product-contract-convergence-gap.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when self-adoption or release proof changes
---

# Failure Pattern: Declaring A Target Standard Without Self-Adopting It

## Changelog

- `2026-07-30`: Repaired the related convergence finding link after archival.
- `2026-07-28`: Added the removed Finding-registry reader as a self-adoption
  example: declaring metadata-derived indexes is incomplete while runtime routing
  still parses a manual registry.
- `2026-07-28`: Accepted the self-adoption gap as durable failure knowledge and
  defined its prevention, recovery, and retrieval signals.
- `2026-07-28`: Normalized the Pattern to the declared workspace Scope and removed
  the superseded boolean canonical marker.

## Failure Shape

A system declares a canonical project structure or workflow for adopters while its own
repository continues using an incompatible structure. The specification appears
complete, but the product has not exercised the contract against its most informed and
demanding adopter: itself.

Skopos instantiated this Pattern when it documented the Project Memory tree while still
using mixed `docs/project/`, `docs/how-to/`, `docs/runbooks/`, flat `docs/scopes/`, and
`docs/failure-patterns/` structures. Treating self-adoption as later work allowed a
target contract and repository reality to diverge. A later audit found the same shape
inside runtime behavior: docs governance had deleted manual registries, but Program
routing still parsed `docs/findings/registry.md` instead of the canonical catalog.

## Detection Signals

1. canonical docs say a layout or workflow is required, but the owning repository does
   not pass it
2. fixtures demonstrate the standard while the product repository is exempt
3. an implementation phase is marked complete although self-hosting still needs a
   structural migration
4. old document families remain in default retrieval after their replacements are
   declared
5. generated instructions teach a contract that the repository itself does not follow
6. a runtime reader still depends on a manually maintained index after metadata-derived
   indexing is declared canonical

## Why It Fails

1. contradictions remain hidden until an external adopter encounters them
2. path assumptions, links, metadata, retrieval, and generators are not tested
   together
3. agents cannot tell whether declared target docs or repository layout is authoritative
4. exceptions created for the product tend to become accidental compatibility paths
5. release claims become stronger than the available Evidence

## Prevention

1. make the product repository the first full adopter of every generic Memory contract
2. couple a standard change to an explicit self-adoption Task and acceptance Evidence
3. keep implementation status partial until the physical tree, metadata, links,
   retrieval, instructions, and clean-clone behavior conform
4. test the self-hosted repository in addition to purpose-built fixtures
5. do not preserve private exceptions, aliases, or legacy readers for a pre-release
   product

## Recovery

1. inventory the current tree and classify durable truth by canonical Memory role
2. add any missing generic role to the grammar before forcing content into the wrong
   family
3. approve one move, merge, rewrite, archive, and delete envelope
4. perform Git-aware restructuring and repair every link and instruction projection
5. rebuild metadata-derived indexes and verify the repository against the same
   Readiness rules used for adopters
6. close the owning phase only after self-hosting proof passes

## Retrieval

Retrieve this Pattern for Tasks involving Project Memory grammar, adoption,
documentation restructuring, scaffolding, templates, self-hosting, or release
Readiness. Do not inject it into unrelated implementation Tasks.
