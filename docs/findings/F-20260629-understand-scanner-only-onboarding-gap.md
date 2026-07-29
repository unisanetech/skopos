---
title: "F-20260629-understand-scanner-only-onboarding-gap: Understand Still
  Produces Scanner-Only Onboarding"
status: active
severity: MUST
owner: skopos-core
id: SKOPOS-F-20260629-UNDERSTAND-SCANNER-ONLY-ONBOARDING-GAP
scope: skopos
role: finding
lifecycle: active
authority: supporting
provenance: observed
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - README.md
  - ../decisions/028-initial-synthesized-repo-understanding-contract.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../architecture/docs-governance.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: per convergence phase
---

# F-20260629-understand-scanner-only-onboarding-gap: Understand Still Produces Scanner-Only Onboarding

## Changelog

- `2026-07-29`: Made adoption intake automatic for actual existing and greenfield
  initialization. Existing-project init no longer creates a human docs router or
  Scope registry before review; greenfield init creates both as the minimum adopted
  structure. Approval now emits an exact coding-agent execution brief and Evidence
  template. Automatic intake and execution guidance are closed; verified host/UI
  delivery and adopter pilots remain open.

- `2026-07-29`: Added explicit `skopos adopt activate` authority and adoption-aware
  Trust gating. Activation requires one matching proposal, approval, and passing
  standard verification, records actor and reason, and does not rewrite project docs.
  Once adoption intake exists, Trust cannot report `agent-ready` until matching
  activation exists. Verified host/UI delivery and adopter proof remain open.

- `2026-07-29`: Added `skopos adopt verify`. Verification is bound to the exact
  approved proposal and one attributable coding-agent execution record per operation.
  It fails closed on result-topology drift, non-strict docs configuration, metadata
  or link issues, missing or unverified required Memory roles, and stale instruction
  mirrors. Success records `standard-verified` and Session context explicitly routes
  to later activation without claiming `agent-ready`. Agent execution tooling,
  activation, Trust gating, and UI visibility remain open.

- `2026-07-29`: Added shared Session delivery for adoption material questions and
  pending proposal approval. Every delivered choice includes a recommendation,
  reason, alternatives, blocking state, and explicit default behavior. Added
  `skopos adopt approve`, which records the exact proposal digest, approving actor,
  reason, authorized operation IDs, and explicit material-risk acknowledgement
  under `.skopos/adoption/**` without executing project-document changes. Git-aware
  execution, standard verification, activation, and UI visibility remain open.

- `2026-07-29`: Added agent-reviewed analysis intake and non-mutating restructuring
  proposal generation through `skopos adopt propose`. Analysis is bound to the exact
  discovery digest, separates claims by provenance, validates evidence, stops at
  `questions-open` for material ambiguity, and otherwise produces an
  approval-required proposal with complete document classification, target tree,
  link impact, authority impact, and information-loss risk. Approval, execution,
  standard verification, host/UI delivery, and full adoption Readiness remain open.

- `2026-07-29`: Added the first canonical adoption boundary:
  `skopos adopt assess` writes a provenance-aware, assessment-only intake and agent
  analysis brief under `.skopos/adoption/**`. It inventories multiple documentation
  sources, code roots, instructions, commands, CI, generated-source hints, authority
  conflicts, and missing Memory roles while remaining explicitly
  `agent-analysis-required`. This closes read-only discovery and brief generation; it
  does not yet close reviewed-analysis recording, proposal approval/execution,
  standard verification, or full adoption Readiness.

- `2026-07-28`: Routed the unresolved scanner-versus-agent-understanding gap through
  canonical adoption Phase 4. The prototype `understand` artifacts remain current
  evidence, not the target solution.

- `2026-06-29`: Opened after the existing-project pilot showed that `skopos understand` can produce useful setup artifacts but still cannot create real product/domain/architecture understanding without an agent-guided analysis pass.

## Summary

- Severity: `MUST`
- Status: `active`
- Owner: `skopos-core`
- Target Pack: `onboarding, understanding, trust, memory`
- Current State: read-only assessment, agent-reviewed proposal generation, shared
  Session decision delivery, exact risk-aware approval recording, coding-agent
  execution brief and Evidence template, standard verification, and explicit activation
  are implemented. Actual init starts adoption automatically, material ambiguity stops
  safely, and approval does not mutate project documents. Verified host/UI delivery
  and healthy/messy adopter pilots remain open.

## Symptom

1. `skopos init` detects project shape and writes setup artifacts.
2. `skopos understand` creates repo summary, feature inventory, hotspots, and setup review from bootstrap and scopes.
3. adoption verification and Session context become ready after setup questions and
   instruction mirrors are resolved.
4. The user can still reasonably ask what the project is really about, what domains exist, which docs are canonical, and where architecture boundaries live.

## Impact

1. Skopos may look agent-ready before agents have true project context.
2. Future coding agents may still do broad repo rediscovery.
3. Users may trust scanner-generated summaries as if they were reviewed project knowledge.
4. The core Skopos promise of durable project memory remains incomplete.

## Fix Plan

1. ~~Implement the Phase 4 read-only discovery and agent-analysis brief.~~
2. Show scanner limitations, provenance, contradictions, and required agent analysis
   in every supported host and the UI. Shared Session delivery is implemented; UI
   visibility and verified host activation remain.
3. ~~Keep assessment-only Readiness below agent-ready and enter adoption automatically
   during actual init.~~
4. Produce an approved documentation restructuring proposal rather than a permanent
   mapping. Proposal generation and exact approval recording are implemented;
   the exact coding-agent execution brief is implemented; richer Git-aware automation
   remains optional rather than a second mutation authority.
5. ~~Verify the Memory standard and activate full adoption only after verified
   standard conformance.~~
6. Prove healthy and messy brownfield flows before launch.

## Verification

1. Fresh existing-project adoption produces a provenance-aware analysis brief.
2. The agent receives exact analysis and material-question work.
3. Assessment-only Readiness cannot claim agent-ready.
4. After approved restructuring and standard verification, Readiness can report
   agent-ready.
