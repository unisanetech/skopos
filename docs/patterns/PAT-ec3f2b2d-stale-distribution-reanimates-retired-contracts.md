---
title: "Failure Pattern: Stale Distribution Reanimates Retired Contracts"
status: active
owner: skopos-core
id: PAT-ec3f2b2d
scope: skopos
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: accepted
view: current
appliesTo:
  - clean-refactor
  - build-output
  - package-entrypoints
  - release-readiness
  - self-hosting
  - compatibility
  - generated-state
lastUpdated: 2026-07-28
relatedDocs:
  - PAT-4e27c8a1-retired-contracts-preserved-by-tests.md
  - ../architecture/evidence-and-readiness-model.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../findings/archive/F-c1e8c13d-prototype-product-contract-convergence-gap.md
reviewCycle: when package entrypoints or clean-cutover proof changes
---

# Failure Pattern: Stale Distribution Reanimates Retired Contracts

## Changelog

- `2026-07-28`: Accepted stale package output that recreates deleted runtime behavior
  as reusable failure knowledge after Skopos source stopped writing a global handoff
  but its unrefreshed distributable entrypoint wrote that artifact again.

## Failure Shape

A clean refactor deletes an old writer, reader, path, or schema from source. Focused
source tests pass, but a CLI, package export, generated bundle, copied asset, or
installed smoke path still resolves previously built output. Running the product then
recreates the retired behavior even though source search reports no owner.

Skopos instantiated this Pattern when its Task-owned handoff source and tests were
clean, but a self-hosted CLI invocation loaded stale package output and recreated
`.skopos/handoffs/latest-workflow.json`.

## Detection Signals

1. source search finds no writer, yet the retired artifact reappears at runtime
2. direct source tests pass while a package export or installed CLI behaves differently
3. deleting local generated state works only until the next product invocation
4. package `dist/`, copied assets, declaration output, or bundled policy content predates
   the source change
5. a release or self-hosting smoke test fails after focused source proof is green

## Why It Fails

1. developers and agents validate a different executable from the one users run
2. retired contracts remain reachable through distribution boundaries
3. regenerated local state falsely suggests that a source writer still exists
4. release confidence is overstated because build freshness is outside the proof
5. compatibility can survive indefinitely without any current source owner

## Prevention

1. treat package exports, CLI entrypoints, copied assets, and installed artifacts as
   first-class clean-cutover consumers
2. rebuild every affected distributable before self-hosted or release validation
3. run at least one installed or built-entrypoint smoke test after source-level proof
4. delete retired local artifacts, invoke the built product, and prove they remain
   absent
5. make typecheck and source tests read-only; keep build freshness and package smoke as
   explicit Evidence steps

## Recovery

1. identify which entrypoint actually executed and resolve every package export it
   loaded
2. rebuild affected packages from the verified source state
3. delete only the exact retired generated artifacts
4. rerun the built or installed entrypoint
5. verify canonical artifacts are generated and retired artifacts remain absent
6. include the package-boundary regression in release proof

## Retrieval

Retrieve this Pattern for Tasks involving clean refactors, CLI packaging, package
exports, generated bundles, self-hosting, release smoke tests, copied assets, or a
retired artifact that reappears without a source writer. Do not inject it into
unrelated source-only work.
