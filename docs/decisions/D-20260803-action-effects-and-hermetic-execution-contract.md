---
title: "Decision: Action Effects And Hermetic Execution Contract"
status: accepted
owner: skopos-core
id: D-20260803-action-effects-and-hermetic-execution-contract
scope: skopos
role: decision
lifecycle: durable
authority: supporting
provenance: accepted
view: target
date: 2026-08-03
implementationStatus: partial
lastUpdated: 2026-08-03
relatedDocs:
  - ../architecture/action-extension-model.md
  - ../architecture/evidence-and-readiness-model.md
  - ../findings/F-20260803-action-hermeticity-and-effect-classification-gap.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when Action capability, effect, concurrency, or certification semantics change
---

# Decision: Action Effects And Hermetic Execution Contract

## Changelog

- `2026-08-03`: Accepted the required manifest grammar and implemented capability
  preflight, unavailable runs, workspace-effect boundaries, isolated artifact roots,
  and effect-bound Evidence identity. Packed certification and broader isolation remain
  open.

## Context

Commands alone do not reveal whether an Action needs a browser, network, secret,
service, or tool, nor whether it writes the project or produces disposable proof
artifacts. The prior declaration overloaded those facts into `inputs`, `outputs`,
`affects`, and `read-only`. Restricted-host failures could therefore look like product
failures, and concurrent proof runs could collide.

Skopos needs a public contract that is truthful before execution and participates in
Evidence identity. It must remain project-agnostic and cannot claim operating-system
sandbox guarantees that the host does not provide.

## Decision

Every Action manifest explicitly declares three independent dimensions:

1. `capabilities`: required process execution plus network, browser, tool, secret, and
   service requirements
2. `effects`: workspace mutation, isolated artifact production, and external effects
3. `concurrency`: shared or exclusive execution intent

Safety is a derived human-facing classification with four values: `read-only`,
`artifact-producing`, `mutating`, and `destructive`. The manifest loader rejects
contradictory combinations instead of defaulting missing fields or guessing from the
command.

The runtime preflights declared capabilities before command execution. Missing
requirements produce a durable `unavailable` Action Run, distinct from `failed`, and
the command is not invoked. Host integrations assert network, browser, and named
service availability explicitly; Skopos does not probe or silently enable them.

Artifact-producing Actions receive one run-owned root and resolve declared outputs
inside it. Workspace effects are checked against pre- and post-execution path state in
Git worktrees. An Action with no workspace effect fails on a mutation; a declared
workspace mutation fails outside `affects`.

Declared capabilities, effects, and concurrency are part of the Action execution
digest and recorded in Evidence. Changing any of them invalidates exact reuse. Secret
names may appear as requirements; secret values never enter manifests, runs, logs, or
Evidence.

## Rejected Alternatives

### Infer effects from shell commands

Rejected because shell composition, subprocesses, package scripts, and provider SDKs
make inference incomplete and non-portable.

### Keep artifact-producing proof classified as read-only

Rejected because it hides output lifecycle and permits collisions or workspace
pollution.

### Treat missing infrastructure as a failed proof

Rejected because unavailable execution capability is not evidence that the product is
incorrect.

### Claim universal sandboxing

Rejected because Skopos cannot enforce network or external-service isolation on every
host without provider- or operating-system-specific support.

## Consequences

1. Existing Action manifests and reviewed integration fixtures require a clean schema
   cutover.
2. Agents can distinguish unavailable infrastructure from executed proof failures.
3. Concurrent artifact-producing runs have stable, non-colliding references.
4. Evidence reuse becomes sensitive to the full declared execution contract.
5. Certification remains incomplete until packed offline proof, exclusive scheduling,
   and external-effect boundaries are proven.

## Implementation Requirements

Implemented now:

1. required schema fields and contradiction checks
2. deterministic capability preflight and unavailable runs
3. Git-worktree mutation enforcement against `affects`
4. per-run artifact roots and output-state Evidence
5. capability-, effect-, and concurrency-bound execution identity

Still required before this Decision is fully implemented:

1. packed-install offline certification outside the source workspace
2. a supported contract for non-Git mutation enforcement
3. serialization or lock-key enforcement for exclusive Actions
4. provider-specific enforcement or verification of declared external mutation
5. host-parity proof for capability assertions
