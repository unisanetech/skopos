---
title: P1-W7 Self-Healing Loop And Bounded Hardening
status: active
owner: skopos-core
id: SKOPOS-P1-W7
scope: skopos
role: task
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
lastUpdated: 2026-04-16
relatedDocs:
  - ../../overview.md
  - ../../domains/product/vision.md
  - P-37fa9180-prototype-roadmap.md
  - P-b4e43e34-prototype-implementation-checklist.md
  - ../../archive/missing-decisions-checklist.md
  - ../../decisions/023-supervision-cost-and-workflow-weight-discipline.md
  - ../../decisions/027-self-healing-product-loop-and-bounded-hardening-contract.md
  - ../../findings/README.md
  - ../../findings/archive/F-20260411-self-hosting-workflow-router-drift.md
  - ../../findings/archive/F-20260412-token-control-and-agent-transport-gap.md
  - ../../findings/archive/F-20260412-program-router-and-obligation-gap.md
  - ../../findings/archive/F-20260411-ui-dev-watcher-generated-churn.md
reviewCycle: per workpack
---

# P1-W7 Self-Healing Loop And Bounded Hardening

Temporary execution workpack for the first explicit Skopos self-healing cycle after the `identity` and `unisane-ui` pilots. This batch does not open new broad product surface area. It groups the known product weaknesses into hardening tracks and drives them through bounded proof instead of feature-first growth.

## Changelog

- `2026-04-16`: Opened after the first real non-Skopos pilots hardened onboarding, validation, proof policy, and closure coverage. The next wave now shifts from proving bootstrap alone to one explicit self-healing loop across onboarding and trust correctness, validation proportionality, and program/docs-state hygiene.

- Phase: `P1`
- Workpack: `P1-W7`
- Findings: `F-20260411-self-hosting-workflow-router-drift`, `F-20260412-token-control-and-agent-transport-gap`, `F-20260412-program-router-and-obligation-gap`, `F-20260411-ui-dev-watcher-generated-churn`
- Scope Packs: `SP-self-healing-loop`, `SP-bounded-hardening`
- Status: `active`

## Temporary Status And Removal Rule

- Temporary execution artifact. Archive or remove it after the current hardening tracks have either been closed or re-narrowed into smaller successor workpacks and the durable rules have been promoted into the roadmap, checklist, and findings surfaces.

## Candidate Scope

### Track A: Onboarding, Scope, And Trust Correctness

- keep single-package and bounded workspace operation as the strongest happy path
- reduce false trust or closure pressure when a bounded mission is correctly complete
- tighten self-hosting workflow coverage so the control plane is harder to bypass by accident

Primary findings:

- `F-20260411-self-hosting-workflow-router-drift`
- `F-20260412-stale-advisory-decision-eval-reconciliation-gap`

### Track B: Validation And Transport Proportionality

- keep command transport compact by default
- keep validation lanes smallest-sufficient for the changed surface
- keep long-running work out of the hot prompt path unless explicitly requested

Primary findings:

- `F-20260412-token-control-and-agent-transport-gap`

### Track C: Program And Docs-State Hygiene

- keep routed UI state fresh and truthful
- reduce generated-output and watcher churn in authoring loops
- keep program, docs, and obligation state from going stale or over-noisy after real work completes

Primary findings:

- `F-20260412-program-router-and-obligation-gap`
- `F-20260411-ui-dev-watcher-generated-churn`

## Execution Rules

1. only one hardening track may be `in-progress` at a time
2. each batch must remove one concrete false signal or one concrete repeated workflow tax
3. each batch must prove the fix on:
   - `skopos`
   - one non-Skopos package or workspace
4. if a batch adds more product surface than it removes failure risk, stop and split or simplify it

## Checklist

- [x] Add the self-healing loop decision
- [x] Group the active findings into hardening tracks
- [x] Link the self-healing loop into the roadmap, checklist, missing-decisions checklist, and findings registry
- [ ] Finish Track A and either close or re-narrow the linked findings
- [ ] Finish Track B and either close or re-narrow the linked findings
- [ ] Finish Track C and either close or re-narrow the linked findings
- [ ] Archive this workpack once successor workpacks or closed findings make it unnecessary

## Verification Commands

- `pnpm typecheck`
- `pnpm build`
- `pnpm docs:core:check`
- `pnpm program:index:check`
