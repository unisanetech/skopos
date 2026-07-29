---
title: "F-20260412-self-hosted-closure-e2e-timeout-drift: Self-Hosted CLI E2E
  Cases Can Time Out Under Full Suite Load"
status: closed
owner: skopos-core
id: SKOPOS-F-20260412-SELF-HOSTED-CLOSURE-E2E-TIMEOUT-DRIFT
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-04-12
relatedDocs:
  - ../README.md
  - ../../scopes/skopos-cli/overview.md
reviewCycle: per workpack
---

# F-20260412-self-hosted-closure-e2e-timeout-drift: Self-Hosted CLI E2E Cases Can Time Out Under Full Suite Load

## Changelog

- `2026-04-12`: Fixed by raising the CLI e2e suite timeout budget to match the real cost of the self-hosted generated-state cases, then rerunning the full Skopos test lane and completing the test-hardening mission successfully.
- `2026-04-12`: Expanded the finding after rerunning the full CLI suite showed the timeout budget issue is broader than one generated-output closure case: the eval-checklist reconciliation and routed app build e2es also exceed the old default 30 second budget under full suite load.
- `2026-04-12`: Opened after replaying closure on an older runtime mission showed that the self-hosted generated-output closure e2e now times out under the full CLI suite's default 30 second budget even though the underlying closure behavior is correct.

## Summary

- Severity: `SHOULD`
- Status: `closed`
- Owner: `skopos-core`
- Target Pack: `cli suite stability`
- Current State: fixed. The CLI e2e suite now uses a realistic timeout budget for the heavier self-hosted cases, the full `pnpm test` lane passes again, and older mission reconciliation is no longer blocked by suite-only timeout noise.

## Symptom

1. `pnpm test` fails in the CLI suite on long-running self-hosted e2e cases such as closure inference, eval-checklist reconciliation, and routed app build.
2. The failures are timeouts, not wrong assertions.
3. The same runtime paths pass when replayed outside the suite budget pressure.

## Impact

1. Older active missions cannot be reconciled through `skopos eval` because eval replays `pnpm test`.
2. The program queue can continue pointing at already-shipped work because suite-level timeout noise blocks closure.
3. Validation signal degrades because the suite is reporting timing drift instead of behavior regressions.

## Fix Plan

1. Give the self-hosted closure e2e a realistic per-test timeout budget.
2. Re-run the full CLI test lane to confirm the failure is gone.
3. Re-run the blocked older mission eval and closure path.

## Verification

1. `pnpm test` passes in the Skopos workspace.
2. The long-running self-hosted e2es still assert the same behavior.
3. The older runtime eval mission can be re-evaluated and completed after the suite stabilizes.

## Linked Docs

1. `../README.md`
2. `../../scopes/skopos-cli/overview.md`
