---
title: Fresh-Session Continuation Metric
status: active
owner: skopos-release
id: SKOPOS-FRESH-SESSION-CONTINUATION-METRIC
scope: skopos
role: operation
lifecycle: durable
authority: canonical
provenance: accepted
view: current
lastUpdated: 2026-08-11
relatedDocs:
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
  - ../work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md
  - first-public-release-scorecard.md
reviewCycle: after every eligible continuation cohort and before release promotion
---

# Fresh-Session Continuation Metric

## Measure

The north-star measure is the percentage of eligible tracked Tasks that a fresh
supported coding-agent Session safely continues and completes:

1. without the user restating project context
2. without known Scope or Memory drift
3. without overwriting another Session
4. with acceptance-linked Evidence

One Task contributes at most once. The denominator includes a Task only when a real
fresh host Session received its bounded assignment and the outcome is durably linked
to that Task. Generated prompts, simulated hosts, incomplete Tasks, and manual examples
do not enter the denominator. A success requires all four conditions; a failed,
abandoned, conflicted, or user-restated continuation remains in the denominator and
not the numerator.

## First Recorded Baseline

| Cohort | Result | Scope |
| --- | --- | --- |
| `2026-08-11` real Codex child-Task orchestration | `3 / 3` (`100%`) | Codex only; one self-hosted parent and three bounded child Tasks |

Eligible Tasks:

1. `T-e42d4ebb` — reviewer Session lifecycle
2. `T-f4160cb9` — Codex child-launch contract
3. `T-e7b197de` — host-delivery integration

The durable parent record `T-9da72d55` links all three children, their acceptance
requirements, completed state, and immutable snapshots. Each snapshot records a
separate real Codex Session identity. The originating Session remained the reviewer;
the children completed their bounded work without an additional user restatement, and
the parent closure accepted their linked Evidence.

## Interpretation And Limits

This is a valid initial operational baseline, not a general efficacy claim. It covers
one self-hosted Codex cohort on one day. It does not prove Claude parity, adopter
continuation, cross-machine delivery, or population-level reliability. Those scenarios
must enter later cohorts rather than being inferred from this result.

The first `next` release may report that the metric is recorded. Promotion to `latest`
requires additional early-adopter cohorts and a separately accepted threshold; this
single `3 / 3` cohort is not enough to set that threshold.
