---
title: "F-20260414-package-pilot-closure-coverage-gap: Completed Pilot Missions
  Still Looked Like Unowned Drift"
status: done
owner: skopos-core
id: SKOPOS-F-20260414-PACKAGE-PILOT-CLOSURE-COVERAGE-GAP
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-04-14
relatedDocs:
  - ../README.md
  - F-20260413-nested-package-pilot-onboarding-gap.md
reviewCycle: per workpack
---

# F-20260414-package-pilot-closure-coverage-gap: Completed Pilot Missions Still Looked Like Unowned Drift

## Changelog

- `2026-04-14`: Opened and resolved after the `unisane-ui` pilot showed that `trust` and `done` still warned about missing active mission coverage even after the tracked edits had already been evaluated and closed through a claimed mission. Trust now treats tracked edits as covered when a claimed mission and complete eval finished after the last tracked edit, and no newer tracked edits exist.

## Summary

- Severity: `SHOULD`
- Status: `done`
- Owner: `skopos-core`
- Target Pack: `pilot closure coverage`
- Current State: resolved. Completed claimed missions with complete eval now cover tracked edits until newer tracked edits land.

## Symptom

1. A temporary pilot mission could complete successfully with `eval = complete`.
2. The same workspace could immediately fall back to `trust = medium / needs-review` only because there was no longer an active mission.
3. `done` then inherited that warning as closure noise even though no newer tracked edits had landed after the mission closed.

## Impact

1. Temporary package pilots looked less complete than they really were.
2. Trust and done over-signaled “unowned drift” after successful pilot closure.
3. Users had to start a second fake mission just to clear a warning for already-closed work.

## Fix Plan

1. Detect claimed missions that are `complete` and have `eval = complete`.
2. Compare tracked changed-path mtimes against the latest closure timestamp from that mission and eval.
3. Treat those tracked edits as covered when no newer tracked edits exist.
4. Keep warning behavior when newer tracked edits land after closure.

## Verification

1. A workspace with tracked package changes still warns before a mission is claimed.
2. The warning clears while the mission is active and claimed.
3. The warning stays cleared after mission completion when eval is complete and no newer tracked edits land.
4. `done --mission ...` stops inheriting a workspace-trust warning for already-closed tracked edits.
