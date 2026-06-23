# F-20260412-proof-phase-default-test-lane-contention: Proof-Phase In The Default Test Lane Makes Full Validation Heavy And Suite-Sensitive

## Metadata

- Doc ID: `SKOPOS-F-20260412-PROOF-PHASE-DEFAULT-TEST-LANE-CONTENTION`
- Status: `closed`
- Owner: `skopos-core`
- Scope: `skopos/findings`
- Canonical: `yes`
- Last Updated: `2026-04-12`
- Review Cycle: `per workpack`
- Related Docs:
  - `registry.md`
  - `../runbooks/local-development.md`
  - `../scopes/cli.md`

## Changelog

- `2026-04-12`: Fixed by moving the proof-phase harness onto the dedicated CLI `proof` script and out of the default CLI `test` lane, then revalidating `pnpm test`, `pnpm proof`, mission eval, and closure on the previously blocked self-hosted missions.
- `2026-04-12`: Opened after mission-level eval replay showed that the default CLI `pnpm test` lane was still running the heavyweight proof-phase scorecard, which passes in isolation but can fail under the broader suite's load profile and blocks `skopos eval` because eval replays the same command surface.

## Summary

- Severity: `SHOULD`
- Status: `closed`
- Owner: `skopos-core`
- Target Pack: `cli validation lane separation`
- Current State: fixed. The default CLI `pnpm test` lane now covers only the standard regression files, the proof-phase scorecard stays on the dedicated `pnpm proof` lane and `quality.run-proof-phase` workflow, and the previously blocked mission eval plus closure paths now pass.

## Symptom

1. `pnpm test` in the Skopos workspace runs the full CLI suite and the proof-phase scorecard together.
2. The proof-phase scorecard passes when run alone through `pnpm proof`, but can fail when it shares the broader suite lane.
3. `skopos eval` inherits the same instability because mission eval replays `pnpm test` as part of the canonical validation surface.

## Impact

1. Mission closure can be blocked by suite-only contention rather than real proof regressions.
2. The default local validation lane is slower and noisier than it needs to be.
3. Proof-phase loses signal quality because its reliability scorecard is coupled to unrelated CLI test load.

## Fix Plan

1. Remove the proof-phase harness from the default CLI `test` script.
2. Keep proof-phase on its dedicated `proof` lane and preserve the `quality.run-proof-phase` workflow as the canonical heavyweight gate.
3. Update the local runbook and CLI scope docs so contributors understand the split between the standard regression lane and the proof lane.

## Verification

1. `pnpm test` passes without running `src/__tests__/proof-phase.e2e.test.ts`.
2. `pnpm proof` still runs the proof-phase scorecard and passes.
3. `skopos eval` can replay the canonical `pnpm test` lane without inheriting the proof-phase suite-only failure mode.

## Linked Docs

1. `registry.md`
2. `../runbooks/local-development.md`
3. `../scopes/cli.md`
