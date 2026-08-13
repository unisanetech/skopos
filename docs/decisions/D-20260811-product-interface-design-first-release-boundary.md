---
title: "Decision: Product Interface Design First-Release Boundary"
status: accepted
owner: skopos-core
id: D-20260811-product-interface-design-first-release-boundary
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: target
date: 2026-08-11
lastUpdated: 2026-08-11
implementationStatus: complete
relatedDocs:
  - ../findings/F-20260804-skill-selection-proof-and-portability-gap.md
  - ../work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md
  - ../operations/first-public-release-scorecard.md
reviewCycle: before changing the first-release Skill boundary or making efficacy claims
---

# Decision: Product Interface Design First-Release Boundary

## Context

The exact Product Interface Design `0.5.0` pack passes deterministic selection,
identity, containment, budget, packed-install, and project-binding proof. Its fresh
no-Skill efficacy smoke lost `0-1`; therefore material improvement and independent
human efficacy were not certified.

Continuing to tune and reevaluate this Skill is no longer part of the `0.1.0` release
critical path. The failed result must remain visible, but it does not make the exact
pack unsafe or unpackageable.

## Decision

1. Product Interface Design `0.5.0` is publishable in `@unisane/skopos@0.1.0` under the
   `next` dist tag.
2. Certified efficacy is **no**. Release notes and product copy must not claim proven
   improvement, independent human validation, or superiority over an unassisted agent.
3. Deterministic selection, exact identity, containment, authority separation,
   bounded cost, packed installation, and project binding remain required release
   gates and currently pass.
4. No additional Product Interface Design efficacy work is required before the first
   `next` release.
5. Broad Skill-catalog expansion remains out of scope. Adding another public pack or
   promoting efficacy claims requires a new explicit Decision and fresh proof.
6. Real adopter outcomes may be observed after release, but they are product learning,
   not a retroactive prerequisite for `0.1.0` publication.

## Consequences

- The release is honest about the difference between safe packaging and demonstrated
  benefit.
- The failed smoke result is preserved rather than rewritten as a pass.
- Product Interface Design may ship as an accepted, bounded capability without an
  efficacy claim.
- The former mandatory efficacy Finding no longer blocks the first release.
- Registry, candidate, canonical-product, and external publication gates remain
  unchanged.
