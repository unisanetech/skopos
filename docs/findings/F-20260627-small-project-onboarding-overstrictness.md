# F-20260627-small-project-onboarding-overstrictness: Small Project Pilot Gets Over-Strict Pack And Trust Signals

## Metadata

- Doc ID: `SKOPOS-F-20260627-SMALL-PROJECT-ONBOARDING-OVERSTRICTNESS`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/onboarding`
- Canonical: `yes`
- Last Updated: `2026-06-27`
- Review Cycle: `before release`
- Related Docs:
  - `registry.md`
  - `../decisions/029-policy-pack-stack-intelligence-and-memory-contract.md`
  - `../decisions/030-human-guidance-and-developer-experience-contract.md`

## Changelog

- `2026-06-27`: Opened after the external `skopos-pilot-basic` pilot showed that a tiny TypeScript project receives over-confident pack recommendations, missing role mapping pressure, and hard docs-root trust failures.

## Summary

- Severity: `MUST`
- Status: `active`
- Owner: `skopos-core`
- Target Pack: `onboarding, policy recommendations, role mapping, trust`
- Current State: install and core artifacts work, but the first-run experience is too noisy for a small project.

## Symptoms

1. `policies recommend` gave `stack.async-work` a high-confidence `apply` recommendation for a tiny price-calculation library with no queue, cron, worker, retry, webhook, or async stack signal.
2. `architecture.mid-app` and `clean-code.maintainability` role mapping marked app, feature, infrastructure, and behavior roles as missing even though the project is a valid small library-style layout with source under `src/`.
3. `trust` failed hard because `docs/` and `docs/00-start-here.md` were missing, but `init --mode existing` did not create that docs root.
4. `understand` reported a docs entrypoint at `docs/00-start-here.md` even though that file did not exist yet.

## Impact

1. beginner and mid-level developers may think their small project is broken when it only needs lightweight onboarding
2. agents may over-apply packs or push unnecessary folder restructuring
3. Skopos appears ceremonial for small projects, which conflicts with the progressive workflow model
4. trust output can become noisy before the user has a clear next action

## Required Fix

1. make policy recommendations use real project signals; stack packs should require concrete async, queue, worker, cron, webhook, retry, or scheduling evidence
2. add small-library or simple-package role mapping behavior where `src/` can satisfy behavior owner and no app/infrastructure role is required
3. either scaffold `docs/00-start-here.md` during init when trust requires it, or downgrade missing docs root to a guided setup action until the user accepts docs governance
4. prevent understanding artifacts from listing missing docs paths as active docs entrypoints

## Verification

1. fresh small TypeScript pilot does not recommend async stack unless async signals exist
2. accepted clean-code/architecture packs do not mark simple valid `src/` layouts as missing required roles
3. first-run trust gives a clear setup path and avoids hard failure for docs that Skopos itself did not scaffold
4. understanding output lists only existing docs entrypoints

