---
title: "F-20260412-program-router-and-obligation-gap: Program-Level Sequencing
  Still Depends Too Much On User Memory"
status: historical
owner: skopos-core
id: SKOPOS-F-20260412-PROGRAM-ROUTER-AND-OBLIGATION-GAP
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-06-25
relatedDocs:
  - ../README.md
  - ../../overview.md
  - ../../domains/product/vision.md
  - ../../work/archive/P-37fa9180-prototype-roadmap.md
  - ../../work/archive/P-11229565-system-ui.md
  - ../../architecture/artifact-model.md
  - ../../decisions/archive/020-workflow-router-questions-recommendations-and-eval-contract.md
  - ../../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md
  - ../../decisions/archive/022-program-router-sequencing-and-obligation-contract.md
  - ../../decisions/023-supervision-cost-and-workflow-weight-discipline.md
reviewCycle: per workpack
---

# F-20260412-program-router-and-obligation-gap: Program-Level Sequencing Still Depends Too Much On User Memory

## Changelog

- `2026-06-25`: Closed after blocking workflow recommendations became promoted program-router items with preserved commands, linked mission/plan context, explicit open question IDs, and regression coverage proving `program sync` points at blocking question resolution before implementation continues.
- `2026-04-12`: Narrowed the finding again after the first routed UI adoption slice landed, so the remaining gap is no longer “program state is invisible to humans”; it is now broader source promotion plus richer question/recommendation and discussion-memory adoption on top of the compact program-control lane.
- `2026-04-12`: Narrowed the finding after the first low-noise program-router slice landed: `.skopos/program/state.json`, `skopos program sync`, and `skopos program next` now exist with active-mission plus active-finding inputs and typed obligations, so the remaining gap is broader source promotion plus routed UI adoption rather than the total absence of a program-control lane.
- `2026-04-12`: Updated the finding with the supervision-cost and workflow-weight guardrail, so the remaining program-router implementation work now has an explicit requirement to stay low-noise and avoid replacing user memory with heavier ceremony.
- `2026-04-12`: Opened after the deeper workflow review showed that the mission router is now real, but Skopos still cannot reorder accepted work, derive docs and UI obligations, or interrupt current work through one compiled program-level control plane.

## Summary

- Severity: `SHOULD`
- Status: `done`
- Owner: `skopos-core`
- Target Pack: `program router lane`
- Current State: done. Skopos now has a compact program-control artifact, public `program sync` and `program next` commands, routed UI adoption in `overview`, `mission detail`, `trust`, and the search dock, discussion checkpoint promotion into compact handoff state, and blocking workflow recommendations promoted into program-router items with preserved commands. Program-level sequencing no longer depends on the user remembering that blocking questions must come before implementation.

## Symptom

1. new accepted work still relies on the user to decide whether it should interrupt current execution
2. docs and UI updates still depend too much on memory instead of compiled obligations
3. roadmap, checklist, finding, and mission sequence updates are still partially manual when discussion changes priorities
4. the mission router can answer `what next in this mission`, but not `what should be active now across all accepted work`

## Impact

1. user supervision stays higher than the product vision promises
2. accepted discussion outcomes can be recorded but still sequenced incorrectly
3. runtime and workflow changes can land without the right docs or UI follow-through being surfaced immediately
4. agents stay too dependent on chat discipline instead of one compiled program-level router
5. an overbuilt fix would replace one supervision problem with a different ceremony problem

## Fix Plan

1. keep `.skopos/program/state.json` as the single compact program-control artifact
2. extend current active-mission plus active-finding inputs with promoted discussion checkpoints, trust blockers, and explicit roadmap items
3. keep `skopos program sync` and `skopos program next` as the stable public program-router commands for the next slice
4. keep typed obligations explicit for:
   - docs
   - ui
   - runtime
   - validation
   - workflows
5. expose the first program-router surfaces in:
   - overview
   - mission detail
   - trust
   - search dock
6. keep the next slice compact enough that it reduces supervision without creating a second heavy planning ritual

## Verification

1. a new accepted item can be marked `do-now`, `do-next`, `defer`, or `interrupt-current` through compiled state instead of chat-only judgment
2. current mission continuation versus interruption has a machine-readable reason
3. docs and UI obligations are generated explicitly for structural work
4. the user can open a new session and recover the current program state without reconstructing queue order manually

## Linked Docs

1. `../README.md`
2. `../../overview.md`
3. `../../domains/product/vision.md`
4. `../../work/archive/P-37fa9180-prototype-roadmap.md`
5. `../../work/archive/P-11229565-system-ui.md`
6. `../../architecture/artifact-model.md`
7. `../../decisions/archive/020-workflow-router-questions-recommendations-and-eval-contract.md`
8. `../../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
9. `../../decisions/archive/022-program-router-sequencing-and-obligation-contract.md`
10. `../../decisions/023-supervision-cost-and-workflow-weight-discipline.md`
