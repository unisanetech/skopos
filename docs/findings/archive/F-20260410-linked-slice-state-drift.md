---
title: "F-20260410-linked-slice-state-drift: Parent Batch Missions Did Not
  Refresh Child Slice Progress"
status: done
owner: skopos-core
id: SKOPOS-F-20260410-LINKED-SLICE-STATE-DRIFT
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-04-10
relatedDocs:
  - ../README.md
  - ../../work/plans/P-067e15c4-proof-and-benchmarking.md
  - ../../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - ../../scopes/skopos-runtime/overview.md
reviewCycle: per workpack
---

# F-20260410-linked-slice-state-drift: Parent Batch Missions Did Not Refresh Child Slice Progress

## Changelog

- `2026-04-10`: Closed after mission runtime updates began syncing parent linked-slice state and parent mission graphs on child claim, release, and completion, with CLI and proof coverage added to prevent regression.

## Summary

- Severity: `SHOULD`
- Status: `done`
- Owner: `skopos-core`
- Target Pack: `proof-phase batch closure`
- Current State: closed. Parent batch missions now refresh linked child slice state during runtime mutation instead of leaving stale `active` progress behind after slice completion.

## Symptom

1. `skopos mission slice` created the parent-child link correctly.
2. Later child mission updates changed only the child artifact.
3. Parent mission artifacts and mission graphs continued to show stale linked-slice state.

## Impact

1. Self-hosted proof batches could look less complete than they really were.
2. Portal and graph projections built from the parent mission could lag behind actual slice execution.
3. Batch-execution dogfooding could produce false friction because durable parent progress drifted from child reality.

## Fix Plan

1. Sync parent linked-slice state when a child mission is claimed, released, or completed.
2. Refresh the parent mission graph whenever that synchronization happens.
3. Add regression and proof coverage so linked slice completion is visible on the parent mission artifact.

## Verification

1. Completing a child slice updates the parent linked-slice state to `complete`.
2. The `batch-mission-slicing` proof lane now fails if parent slice progress stays stale.
3. CLI regression coverage proves the persisted parent mission artifact reflects the child completion state.

## Linked Docs

1. `../README.md`
2. `../../work/plans/P-067e15c4-proof-and-benchmarking.md`
3. `../../scopes/skopos-runtime/overview.md`
