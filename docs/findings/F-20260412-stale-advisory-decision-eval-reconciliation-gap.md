# F-20260412-stale-advisory-decision-eval-reconciliation-gap: Eval Can Leave Stale Advisory Decisions Pending And Block Valid Closure

## Metadata

- Doc ID: `SKOPOS-F-20260412-STALE-ADVISORY-DECISION-EVAL-RECONCILIATION-GAP`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/findings`
- Canonical: `yes`
- Last Updated: `2026-04-12`
- Review Cycle: `per workpack`
- Related Docs:
  - `registry.md`
  - `../architecture/trust-and-closure-model.md`
  - `../decisions/020-workflow-router-questions-recommendations-and-eval-contract.md`
  - `F-20260411-self-hosting-workflow-router-drift.md`

## Changelog

- `2026-04-12`: Fixed the first runtime slice and added CLI regression coverage, so `skopos eval` now reconciles stale advisory `decision-*` items when no active unresolved workflow question remains for that mission, and the reproduced self-hosted closure path now passes through `skopos done`.
- `2026-04-12`: Opened after closing an older self-hosted mission exposed that `skopos eval` can keep an advisory decision item pending when the global workflow-question artifact has already rotated to a different mission, which then blocks `skopos done` even though the mission itself is validly complete.

## Summary

- Severity: `SHOULD`
- Status: `in-progress`
- Owner: `skopos-core`
- Target Pack: `eval and closure reconciliation`
- Current State: partially fixed. `skopos eval` now reconciles stale advisory `decision-*` mission items when their linked workflow question is absent or already resolved for that mission, the reproduced self-hosted closure path now passes through `skopos done`, and the remaining work is broader mission-artifact hygiene so older routed missions do not linger active in the program queue.

## Symptom

1. An older mission can still be evaluated successfully with passing checks, passing proof, and complete workflow evidence.
2. If the mission had only a non-blocking advisory decision and the current `questions` artifact has already rotated to a newer mission, the advisory decision item can remain pending inside the eval artifact.
3. `skopos mission complete` then marks the mission complete, but `skopos done` still fails because it reads the stale pending decision from the eval artifact instead of the now-complete mission state.

## Impact

1. Closure can fail for work that is already validly complete.
2. Program routing can keep old work alive longer than needed because the stale mission cannot close cleanly.
3. Self-hosting trust in the workflow decreases because stale global question state can leak into unrelated older missions.

## Fix Plan

1. Reconcile advisory `decision-*` mission items during `skopos eval` when their linked workflow question is absent or already resolved for that mission.
2. Add regression coverage for the stale-mission case where a newer mission has rotated the global `questions` artifact.
3. Re-run the affected closure path through `eval`, `mission complete`, and `done` to prove the fix.

## Verification

1. A mission with only stale advisory decision drift evaluates to `pendingItemIds: []` once no active unresolved question remains for that mission.
2. The reproduced stale-mission closure path passes through `skopos done` after `eval` and `mission complete`.
3. Program routing no longer keeps the stale mission as the workspace `do-now` item after valid closure.

## Linked Docs

1. `registry.md`
2. `../architecture/trust-and-closure-model.md`
3. `../decisions/020-workflow-router-questions-recommendations-and-eval-contract.md`
4. `F-20260411-self-hosting-workflow-router-drift.md`
