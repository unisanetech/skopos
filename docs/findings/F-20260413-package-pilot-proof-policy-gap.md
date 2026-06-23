# F-20260413-package-pilot-proof-policy-gap: Generic Package Pilots Treated Missing Proof As Closure Debt Even Without A Proof Lane

## Metadata

- Doc ID: `SKOPOS-F-20260413-PACKAGE-PILOT-PROOF-POLICY-GAP`
- Status: `done`
- Owner: `skopos-core`
- Scope: `skopos/findings`
- Canonical: `yes`
- Last Updated: `2026-04-13`
- Review Cycle: `per workpack`
- Related Docs:
  - `registry.md`
  - `../project/vision.md`
  - `../architecture/runtime-model.md`

## Changelog

- `2026-04-13`: Opened after the temporary `modules/identity` pilot reached passing package validation but `skopos eval` still reported `needs-review` only because proof was missing, even though the package had no registered proof workflow and the pilot was meant to validate generic package onboarding rather than self-hosted proof posture.
- `2026-04-13`: Closed after eval began honoring proof as a closure requirement only when both the config requests it and the workspace actually exposes a registered proof lane.

## Summary

- Severity: `SHOULD`
- Status: `done`
- Owner: `skopos-core`
- Target Pack: `package pilot proof policy`
- Current State: resolved. Missing proof no longer blocks generic package-pilot closure when the workspace does not expose a proof workflow.

## Symptom

1. A temporary package pilot could reach `trust = high / agent-ready`.
2. `lint`, `test`, and `build` could all pass.
3. `skopos eval` still returned `needs-review` only because `proof.status = missing`.
4. `skopos done` then stayed blocked behind mission eval completion even though the package had no proof lane.

## Impact

1. Generic package pilots looked less ready than they actually were.
2. The product mixed self-hosted Skopos proof posture with normal package onboarding.
3. Pilot users could read proof debt as a real package failure instead of a missing optional capability.

## Fix Plan

1. During eval, treat proof as closure-required only when config requests it and a registered proof workflow is actually available.
2. Add regression coverage that proves generic package pilots can complete eval and closure without a proof report when their workflows and checks otherwise pass.

## Verification

1. A workspace with passing checks, passing required workflows, and no proof lane can produce `evaluationStatus: complete`.
2. The same workspace can pass `done` after mission completion without a proof artifact.

## Linked Docs

1. `registry.md`
2. `../project/vision.md`
3. `../architecture/runtime-model.md`
