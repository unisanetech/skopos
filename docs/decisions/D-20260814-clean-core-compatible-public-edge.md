---
title: "Decision: Clean Core And Compatible Public Edge"
status: accepted
owner: skopos-core
id: D-20260814-CLEAN-CORE-COMPATIBLE-PUBLIC-EDGE
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-08-14
implementationStatus: in-progress
lastUpdated: 2026-08-14
relatedDocs:
  - ../architecture/intelligent-project-onboarding.md
  - ../architecture/config-model.md
  - ../architecture/artifact-model.md
  - ../guides/bootstrap-a-project.md
  - ../operations/release-runbook.md
reviewCycle: before removing or changing a published package, CLI, config, or tracked-artifact contract
---

# Decision: Clean Core And Compatible Public Edge

## Context

Skopos can still simplify aggressively while adoption is small, but
`@unisane/skopos@0.1.0` is publicly available and has been exercised from the public
registry in an external project. Unknown third parties may also have installed it.
Development convenience therefore cannot assume that published commands, config, or
tracked project truth are private prototypes.

The first external onboarding canary also showed that retaining obsolete internal
ceremony would make the product harder to correct. The useful boundary is not a full
brownfield freeze. It is a clean internal implementation with compatibility at the
surface already given to users.

## Decision

1. Skopos continues clean refactoring inside its core implementation. Obsolete
   internal paths, duplicate authorities, and unreleased compatibility ceremony are
   removed rather than preserved in parallel.
2. The published package name, executable, supported CLI commands, config format, and
   tracked project artifacts from `0.1.0` are a compatibility boundary.
3. A project initialized by `0.1.0` must be readable and safely refreshable by a patch
   release without deleting or silently replacing tracked project truth.
4. Ignored `.skopos/**` projections may be regenerated. Older valid projections are
   read defensively when practical; missing newly added guidance is derived safely.
5. Stored-schema changes require a migration, a backward-compatible reader, or a
   fail-closed recovery message. They do not justify guessing user intent.
6. Additive machine guidance may strengthen question ordering, analysis submission,
   approval, and Readiness without maintaining the defective conversation behavior.
7. A breaking public change requires explicit versioning, migration guidance, and a
   separate accepted Decision. Small current adoption is not evidence of zero use.

## Consequences

1. The question-first onboarding correction ships as a patch release rather than a
   replacement `0.1.0` artifact.
2. Tests cover both newly generated setup state and a valid older state lacking the
   new conversation guidance.
3. Clean-refactor language applies to implementation authority, not to erasing public
   package history or adopter-owned tracked configuration.
4. Historical certification and release records remain immutable evidence.
