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
  - ../architecture/action-extension-model.md
  - ../standards/validation.md
  - ../decisions/D-20260803-action-effects-and-hermetic-execution-contract.md
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

## Resolution Progress

The first implementation slice is complete:

1. manifests now require explicit capabilities, effects, concurrency, and a distinct
   `artifact-producing` safety class
2. missing tools, secrets, network, browser, and service assertions produce a
   deterministic `unavailable` run before command execution
3. Git-worktree mutation capture rejects undeclared writes and writes outside
   `affects`
4. artifact-producing runs receive unique roots under `.skopos/runs/<run-id>` and
   Evidence resolves outputs from those roots
5. declared capabilities, effects, and concurrency participate in execution identity
6. release smoke packs the bundled CLI, installs it offline into a fresh external
   project, and uses only the installed public binary to prove isolated JSON artifacts,
   deterministic unavailable service preflight, and Git-visible undeclared-write
   rejection
7. knowledge indexing reads only top-level Action Run records, so nested run-owned JSON
   artifacts cannot be mistaken for runs
8. non-Git projects use a portable recursive snapshot and enforce the same undeclared
   and out-of-bound mutation rules as Git worktrees
9. run-owned scheduling leases allow shared overlap, serialize exclusive Actions
   against every active owner, release after success or failure, and recover expired
   crash residue

This Finding remains active. Clean offline packed-install certification is complete.
Closure still requires provider-specific proof for declared external mutation and
host-parity proof for capability assertions.
