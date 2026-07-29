---
title: "Failure Pattern: Retired Contracts Preserved By Tests"
status: active
owner: skopos-core
id: PAT-4e27c8a1
scope: skopos
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: accepted
view: current
appliesTo:
  - clean-refactor
  - tests
  - fixtures
  - compatibility
  - project-memory
  - workflow-contracts
  - validation
  - release-readiness
lastUpdated: 2026-07-28
relatedDocs:
  - PAT-0c339ca4-target-standard-without-self-adoption.md
  - ../architecture/evidence-and-readiness-model.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when a clean cutover changes a tested product contract
---

# Failure Pattern: Retired Contracts Preserved By Tests

## Changelog

- `2026-07-28`: Accepted excluded tests and fixtures that preserve retired product
  contracts as reusable failure knowledge during the Skopos self-adoption cutover.
- `2026-07-28`: Removed the retired no-receipt workflow-success path and added
  eval/done proof that successful runs without source-bound receipts fail closed.
- `2026-07-28`: Corrected host-adapter end-to-end fixtures that omitted the claimant
  actor while asserting Task-specific continuation or decision routing.
- `2026-07-28`: Replaced end-to-end expectations that silently accepted
  identity-less active Missions or reduced an exact ownership conflict to a vague
  “no current Task” result.
- `2026-07-28`: Updated the proof benchmark that expected wrong-owner runtime closure
  to return a diagnostic report after the canonical mutation boundary began rejecting
  the actor before writes.
- `2026-07-28`: Corrected packed-install smoke proof that treated a discoverable
  bundled Policy pack as automatically accepted instead of applying it with an actor
  and reason before resolving its Guards.

## Failure Shape

A clean refactor replaces a product contract, but tests or fixtures still assert the
retired paths, vocabulary, workflow steps, or permissive behavior. The main validation
lane may remain green because it does not execute that suite, while an optional,
release, or end-to-end lane continues to encode the old product.

Skopos instantiated this Pattern when its canonical Memory and closure refactor passed
registered proof while an excluded CLI end-to-end file still expected inherited
out-of-root Memory paths, legacy generated-artifact locations, pre-admission workflow
recommendations, and fixtures without adopted metadata. Adding compatibility to make
those assertions pass would have reversed the clean cutover.

## Detection Signals

1. an excluded or manually invoked suite fails after the canonical checks pass
2. a failing expectation names a path, alias, command, or state removed by an accepted
   Decision
3. product code is changed toward an old behavior solely to satisfy a test
4. fixtures are exempt from the structure or metadata required of real adopters
5. the default test command omits a suite that asserts public or closure-critical
   behavior
6. test names describe compatibility that the product no longer promises
7. a successful action without a source-bound receipt satisfies eval or closure

## Why It Fails

1. tests become a second, hidden source of product truth
2. agents cannot distinguish a real regression from an obsolete assertion
3. compatibility layers reappear through test-driven pressure
4. non-adopted fixtures fail to exercise the same contract users receive
5. release confidence is overstated because green and red suites describe different
   products

## Prevention

1. include tests, fixtures, snapshots, and examples in every clean-cutover impact map
2. update or delete retired assertions in the same Task as their owning contract
3. make representative fixtures self-adopt the canonical structure and metadata
4. rewrite invalid-input cases to prove fail-closed behavior instead of preserving the
   invalid path
5. register every release- or closure-critical suite in the owning validation lane
6. never add a compatibility reader, alias, or fallback solely because an old test
   expects it

## Recovery

1. classify each failure as a product regression, obsolete expectation, or
   non-adopted fixture
2. fix genuine regressions in the canonical implementation
3. rewrite obsolete assertions around the accepted contract and delete compatibility
   scenarios that no longer exist
4. migrate fixtures through the same adoption rules used for real projects
5. run focused cases first, then the complete previously excluded suite
6. add the suite to registered closure proof when its behavior is product-critical

## Evidence

Canonical tests now prove Task identity, source-bound Evidence, Guard results, and
Readiness directly. An actor-less Session must not guess a current Task, and a wrong
claimant must receive an explicit ownership error. Prototype fixtures and assertions
were deleted instead of teaching the product to read retired state.

## Retrieval

Retrieve this Pattern for Tasks involving clean refactors, compatibility removal,
fixture migration, validation-lane design, Project Memory adoption, workflow contract
changes, or release Readiness. Do not inject it into unrelated feature work.
