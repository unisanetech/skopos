---
title: "F-20260410-batch-execution-decomposition-gap: Batch Execution Exists,
  But Scope Narrowing Still Falls Back To Manual Decomposition"
status: done
owner: skopos-core
id: SKOPOS-F-20260410-BATCH-EXECUTION-DECOMPOSITION-GAP
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-04-10
relatedDocs:
  - ../README.md
  - ../../00-start-here.md
  - ../../operations/local-development.md
  - ../../work/plans/P-067e15c4-proof-and-benchmarking.md
  - ../../decisions/archive/007-multi-actor-mission-coordination.md
reviewCycle: per workpack
---

# F-20260410-batch-execution-decomposition-gap: Batch Execution Exists, But Scope Narrowing Still Falls Back To Manual Decomposition

## Changelog

- `2026-04-10`: Closed after `skopos mission slice` landed with linked parent-child plan and mission artifacts, automatic parent decision resolution for `narrow-scope-first`, actor-aware slice claims, portal activity visibility, and a passing proof benchmark.
- `2026-04-10`: Opened after the first self-hosted proof-phase batch was created and claimed inside the Skopos subtree. The plan correctly raised a `narrow-scope-first` decision, but the runtime still required manual decomposition into narrower execution slices.

## Summary

- Severity: `SHOULD`
- Status: `done`
- Owner: `skopos-core`
- Target Pack: `proof-phase batch closure`
- Current State: closed. Wide proof-phase missions can now narrow into linked child slice plans and missions through `skopos mission slice`, and the parent mission records the decomposition durably.

## Symptom

1. `skopos plan` could create a real workspace batch plan and mission for self-hosted proof work.
2. The generated plan could correctly recommend `narrow-scope-first` when the requested work was too broad.
3. The operator previously had to decompose the work manually in chat or ad hoc notes instead of using a linked slice flow inside Skopos itself.

## Impact

1. Wide-scope batch plans were easier to create than to execute safely.
2. Mission progress could drift away from the original plan because the decomposition step was not captured as durable project knowledge.
3. Dogfooding produced less reusable product truth than it should, because the gap between plan generation and scoped execution still sat partly outside Skopos.

## Fix Plan

1. Add a first-class batch-to-slice execution flow so a wide batch plan can spawn narrower linked slice plans or missions.
2. Let decision resolution update the parent mission explicitly, instead of leaving `narrow-scope-first` as a passive suggestion.
3. Make linked slice progress visible in the parent batch mission, local portal activity, and knowledge index.
4. Add proof coverage for self-hosted batch decomposition so this gap is measured instead of remembered informally.

## Verification

1. A workspace-level proof batch can be created, narrowed into linked slice executions, and tracked without ad hoc notes.
2. Decision resolution for scope narrowing becomes visible in the durable parent mission state.
3. The proof harness now includes the `batch-mission-slicing` benchmark and it passes.

## Linked Docs

1. `../README.md`
2. `../../operations/local-development.md`
3. `../../work/plans/P-067e15c4-proof-and-benchmarking.md`
