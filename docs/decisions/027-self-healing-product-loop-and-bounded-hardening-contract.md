# Decision: Self-Healing Product Loop And Bounded Hardening Contract

## Metadata

- Doc ID: `SKOPOS-DECISION-027`
- Status: `accepted`
- Date: `2026-04-16`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-04-16`
- Related Docs:
  - `../project/overview.md`
  - `../project/vision.md`
  - `../project/positioning.md`
  - `../project/roadmap.md`
  - `../project/implementation-checklist.md`
  - `../project/missing-decisions-checklist.md`
  - `023-supervision-cost-and-workflow-weight-discipline.md`
  - `../findings/registry.md`

## Changelog

- `2026-04-16`: Added the self-healing product loop and bounded hardening contract so Skopos now improves itself through tracked pilot feedback, bounded findings, and repeated proof on both the Skopos workspace and one external target before broader rollout claims.

## Context

The recent package pilots proved two things at the same time:

1. Skopos is already useful enough to surface real project drift instead of only bootstrap noise.
2. Skopos still fails in predictable product-shape ways when the workspace is broad, dirty, or operationally inconsistent.

Those failures are valuable. They should not be treated as random cleanup.

Without an explicit loop, Skopos risks drifting back into feature-first growth:

1. a pilot exposes a weakness
2. the weakness gets patched locally
3. the fix is not ranked against the other product risks
4. broad feature work resumes before the product is measurably more stable

That is the wrong operating model for a system that claims to reduce supervision and improve workflow trust.

## Decision

Adopt one explicit self-healing loop for Skopos product work:

`detect friction -> classify it -> record it -> fix one bounded failure mode -> prove it on Skopos and one external workspace -> promote durable rules -> re-rank the next track`

This loop now governs Skopos product hardening before more broad control-plane or UI growth.

## Canonical Rules

### Fix Product Friction Through Findings, Not Chat Memory

1. every real Skopos product weakness discovered during pilots or self-hosting must become an `F-*` finding or a narrowing update to an existing one
2. findings must classify whether the issue is:
   - product correctness
   - workflow ergonomics
   - project hygiene
   - host limitation
3. only product correctness and workflow ergonomics findings should drive Skopos self-healing batches

### Prioritize Hardening Before More Surface Growth

Hardening order is now:

1. onboarding and governance inheritance correctness
2. scope and routing correctness
3. validation proportionality
4. closure and trust signal quality
5. program-state and docs-state freshness
6. UI clarity for already-landed control-plane behavior
7. optional host niceties and broad surface expansion last

### One Failure Mode Per Batch

1. one workpack should close one bounded failure mode or one narrow cluster of the same failure family
2. do not create “fix Skopos generally” implementation batches
3. if a workpack starts expanding across multiple unrelated findings, stop and split it

### Prove Every Hardening Slice Twice

Every self-healing batch must be proven in two places:

1. the Skopos workspace itself
2. one non-Skopos package or workspace

If a fix only survives self-hosting, it is not yet durable enough to justify broader rollout confidence.

### Promote Durable Rules And Remove Temporary Weight

1. if a hardening slice changes product behavior, update the durable decision, roadmap, checklist, and findings surfaces in the same change
2. archive or remove temporary workpacks after closure
3. if a feature or surface adds more workflow weight than hardening value, simplify or remove it instead of preserving it out of sunk cost

### Keep Hardening Bounded To The V1 Lane

The self-healing loop must stay aligned with the current v1 support lane:

1. brownfield Node and TypeScript repos
2. monorepo and nested-package governance inheritance
3. bounded package or workspace missions
4. trust, eval, closure, routing, and compact transport reliability

Do not expand into broader ecosystems or speculative host behavior before the current lane is quieter.

## Current Hardening Tracks

The active findings now group into three product-hardening tracks:

### Track A: Onboarding, Scope, And Trust Correctness

Focus:

1. package and workspace onboarding correctness
2. scope and mission coverage correctness
3. trust signal accuracy when work is bounded but the repo is still imperfect

Primary finding families:

1. self-hosting workflow-router drift
2. stale advisory or closure reconciliation drift
3. remaining pilot-closure or trust-noise cases

### Track B: Validation And Transport Proportionality

Focus:

1. smallest-sufficient validation lanes
2. compact transport and budget telemetry
3. background-heavy job handling

Primary finding families:

1. token control and agent transport
2. proof and eval contention or replay pressure

### Track C: Program And Docs State Hygiene

Focus:

1. stale or superseded program state
2. docs and generated-state freshness
3. keeping the UI truthful to current runtime state

Primary finding families:

1. program router and obligation drift
2. docs and generated-output closure noise
3. watcher or freshness churn in local UI authoring loops

## Required Workpack Questions

Before opening a self-healing workpack, answer:

1. which hardening track does this belong to?
2. what exact false signal or operational failure disappears if this lands?
3. what proof will run on Skopos?
4. what proof will run on one non-Skopos target?
5. what temporary artifact will be removed or archived after closure?

## Consequences

### Positive

1. Skopos improvement becomes measurable instead of conversational
2. pilot feedback feeds the product systematically
3. the system can keep growing without pretending every new feature is equally urgent
4. rollout confidence will be based on repeated bounded proof, not one successful self-hosted thread

### Costs

1. feature growth slows when hardening debt is active
2. some attractive expansions will be deferred until the current support lane is quieter
3. every product fix now needs clearer cross-workspace proof

## Next Action

Run the first explicit self-healing cycle through one bounded workpack:

1. Track A: onboarding, scope, and trust correctness
2. Track B: validation and transport proportionality
3. Track C: program and docs-state hygiene

Complete each track through the same loop:

1. narrow the active findings
2. implement the smallest slice that removes one real failure mode
3. prove it on Skopos and one external target
4. update the durable docs
5. either close or re-narrow the finding
