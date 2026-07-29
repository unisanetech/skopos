---
title: "Scope: Verification"
status: active
owner: skopos-verification
id: SKOPOS-SCOPE-VERIFICATION
scope: skopos-verification
role: overview
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - ../../architecture/evidence-and-readiness-model.md
  - ../../architecture/package-boundaries.md
reviewCycle: when verification ownership changes
---

# Scope: Verification

`@skopos/verification` owns stable proof primitives used by runtime orchestration.

## Changelog

- `2026-07-29`: Replaced the former overlapping closure package with focused
  verification ownership.

## Owns

1. workspace and Task identity
2. Task change-scope capture and source digests
3. Evidence freshness primitives
4. verification and Readiness model helpers
5. provenance needed to explain proof

## Does Not Own

1. Action execution
2. Task lifecycle mutation
3. adoption document mutation
4. CLI formatting
5. project-specific validation selection

Runtime combines these primitives with Task acceptance, Guards, coordination audit,
and adoption state to produce user-facing Readiness.
