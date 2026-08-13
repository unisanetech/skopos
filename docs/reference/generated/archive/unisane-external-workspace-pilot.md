---
title: Unisane External Workspace Pilot
status: archived
owner: skopos-core
id: DOC-unisane-external-workspace-pilot
scope: skopos
role: reference
lifecycle: historical
authority: generated
provenance: observed
view: transition
defaultVisible: false
lastUpdated: 2026-08-03
relatedDocs:
  - ../../../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md
  - ../../../work/plans/P-e7e888e6-canonical-product-convergence.md
---

# Unisane External Workspace Pilot

## Result

- Workspace label: Unisane
- Dirty Git status entries: 1,789
- Work Queue: 69 total; 25 first-page and 25 second-page entries; overlap 0
- Queue disposition counts: in-progress=1, ready=48, deferred=0, blocked=19, verifying=1, ready-to-integrate=0
- Action catalog: 25 total; 10 first-page and 10 second-page entries; overlap 0
- Selected existing Task: T-e8b5cd14 (active, workspace)
- Dry-run question ids: plan.scope-confirmation
- Actions executed by pilot: 0
- Tasks created by pilot: 0

All measured agent JSON surfaces remained below 32,768 bytes.

| Surface | JSON bytes | Local ms | Budget |
| --- | ---: | ---: | --- |
| session | 2,699 | 2970.6 | pass |
| work-queue-first | 18,380 | 1200.1 | pass |
| work-queue-second | 17,197 | 1240.7 | pass |
| actions-first | 6,851 | 222.9 | pass |
| actions-second | 6,820 | 224.1 | pass |
| task | 1,151 | 842.2 | pass |
| plan-dry-run | 8,153 | 2481.3 | pass |

## Method

The pilot invokes the current built Skopos CLI against the live external workspace. It
uses dry-run Session, Work Queue, and Plan calls; cursor-paged Action and queue reads;
and compact Task detail for one existing Task. It counts Git status entries but does
not execute a project Action or create, claim, or mutate a project Task.

## Limits

- The pilot validates Skopos transport, retrieval, classification, and project integration behavior; it does not certify Unisane product implementation or production deployment.
- The live Unisane Work Queue and dirty worktree remain project-owned state and are reported, not resolved, by this pilot.
- Command durations are local wall-clock observations and exclude model reasoning or network latency.

## Reproduce

Build Skopos, then run `pnpm benchmark:external-workspace --target <workspace> --write`.
