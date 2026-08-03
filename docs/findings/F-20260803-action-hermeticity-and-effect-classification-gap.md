---
title: Action Hermeticity And Effect Classification Gap
status: active
severity: MUST
owner: skopos-core
id: F-20260803-action-hermeticity-and-effect-classification-gap
scope: skopos
role: finding
lifecycle: active
authority: supporting
provenance: observed
view: current
lastUpdated: 2026-08-03
relatedDocs:
  - ../architecture/evidence-and-readiness-model.md
  - ../standards/validation.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: close when Action effects and hermetic certification pass offline packed-install proof
---

# Action Hermeticity And Effect Classification Gap

## Finding

The Action model names read paths, write paths, external effects, outputs, safety, and
concurrency, but declarations and enforcement do not yet make certification Actions
predictable in restricted or offline environments. An Action described as read-only
can create screenshots or test reports, and a UI proof can depend on undeclared runtime
network access such as remote font retrieval.

## Observed Evidence

During a downstream pilot:

1. a browser visual Action failed in a restricted environment while fetching an
   external font
2. the same Action produced Playwright artifacts despite being classified as
   read-only
3. the hidden network dependency obscured a real screenshot mismatch until execution
   was retried in a different environment
4. the agent could not determine from the Action declaration whether the failure was a
   product defect, unavailable infrastructure, or an undeclared effect

## Expected Contract

1. Action declarations distinguish source reads, workspace writes, isolated run
   artifacts, network access, external-service mutation, process spawning, secrets,
   browser requirements, and other environment capabilities.
2. `read-only` means no workspace or external mutation; an Action that creates run
   artifacts declares an artifact-producing effect and isolated output root.
3. Release and certification Actions are hermetic by default. Any required external
   dependency is explicit, preflighted, pinned where possible, and represented in the
   execution identity.
4. Unavailable capabilities fail before expensive execution with a precise blocked or
   unavailable result, not a misleading product-test failure.
5. Action concurrency, cleanup, Evidence, and reuse include declared output and
   environment semantics.

## Impact

1. local, CI, sandbox, and packed-install results can disagree
2. failures are hard to classify and may hide actual regressions
3. undeclared outputs can collide across Tasks or pollute the workspace
4. reused Evidence may not represent the environment that produced it
5. release certification cannot be trusted offline or in constrained runners

## Acceptance

1. The Action schema and manifests represent every required effect and capability
   without overloading `read-only`.
2. Runtime enforcement isolates declared artifacts and rejects undeclared workspace or
   external mutation.
3. Required network, browser, service, secret, and tool capabilities are checked before
   Action execution and included in execution identity as appropriate.
4. Certification fixtures pass from a clean offline environment; fixtures that declare
   an external dependency produce a deterministic unavailable result when it is absent.
5. Concurrent artifact-producing Actions cannot collide and expose stable artifact
   references to Evidence.
6. Packed-install release proof exercises effect enforcement outside the source
   monorepo.
