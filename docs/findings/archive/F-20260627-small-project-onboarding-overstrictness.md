---
title: "F-20260627-small-project-onboarding-overstrictness: Small Project Pilot
  Gets Over-Strict Pack And Trust Signals"
status: resolved
owner: skopos-core
id: SKOPOS-F-20260627-SMALL-PROJECT-ONBOARDING-OVERSTRICTNESS
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-06-27
relatedDocs:
  - ../README.md
  - ../../decisions/archive/029-policy-pack-stack-intelligence-and-memory-contract.md
  - ../../decisions/030-human-guidance-and-developer-experience-contract.md
reviewCycle: before release
---

# F-20260627-small-project-onboarding-overstrictness: Small Project Pilot Gets Over-Strict Pack And Trust Signals

## Changelog

- `2026-06-27`: Resolved by scaffolding `docs/00-start-here.md` during init, preventing `understand` from listing missing docs routers, making pack recommendations inspect real project signals, and adding simple-source role mapping fallbacks for small projects.
- `2026-06-27`: Opened after the external `skopos-pilot-basic` pilot showed that a tiny TypeScript project receives over-confident pack recommendations, missing role mapping pressure, and hard docs-root trust failures.

## Summary

- Severity: `MUST`
- Status: `resolved`
- Owner: `skopos-core`
- Target Pack: `onboarding, policy recommendations, role mapping, trust`
- Current State: fresh small-project onboarding now creates the docs router, keeps trust free of docs failures, treats async-work as review-only without async signals, and maps simple `src/` layouts without missing required role pressure.

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

1. `npm exec --yes --package /tmp/skopos-pilot-packs/skopos-cli-0.1.0.tgz -- skopos init . --actor pilot --json` created `docs/00-start-here.md` and regenerated bootstrap with `docsHealth.hasStartHere: true`.
2. `skopos trust . --compact --json` in the pilot reported 0 failures; remaining warnings were instruction mirrors and, after policy acceptance, missing drift report.
3. `skopos policies recommend . --json` in the pilot marked `stack.async-work` as low-confidence `review`, not `apply`, because no async-work signals were found.
4. Applying `architecture.mid-app` in the pilot mapped product behavior to `src` and marked app-shell/adapter roles as `needs-review`, with no `missing` required roles.
5. `skopos understand . --actor pilot --json` listed only existing docs entrypoints: `docs/00-start-here.md` and `docs`.
