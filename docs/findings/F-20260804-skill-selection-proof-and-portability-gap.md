---
title: Skill Selection, Proof, And Portability Are Not Ready For Catalog Expansion
status: active
severity: MUST
owner: skopos-core
id: SKOPOS-F-20260804-SKILL-SELECTION-PROOF-AND-PORTABILITY-GAP
scope: skopos
role: finding
lifecycle: active
authority: supporting
provenance: observed
view: current
lastUpdated: 2026-08-04
relatedDocs:
  - ../decisions/040-project-adapted-skill-packs-as-capability-projections.md
  - ../work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md
  - ../architecture/agent-native-operating-model.md
  - ../architecture/action-extension-model.md
reviewCycle: per Skill capability phase
---

# Skill Selection, Proof, And Portability Are Not Ready For Catalog Expansion

## Summary

Skopos has the correct authority model and one promising `ui.product-craft` source, but
the remaining project adaptation depth, behavioral fixtures, evaluation, and external
proof do not yet justify adding a broad Skill catalog. Task-aware selection, shared
budgets, exact acceptance identity, and exact generated selection reuse are now in
place.

This is a pre-release implementation gap. The fix is one clean hard cut to the first
canonical Skill system, not a versioned migration.

## Evidence

1. Task selection now builds a deterministic normalized envelope from all currently
   available Task contract, Scope ancestry, path, capability, Action, Guard, lifecycle,
   phase, risk, and accepted failure inputs.
2. The normal agent-native caller now resolves Task-attributed changed paths and passes
   both owned and changed paths into selection.
3. Module-local positive intent plus relevant applicability now establishes eligibility;
   negative evidence, generated-only changes, and ambiguous keyword overlap suppress
   selection with structured explanations. Broader multi-pack fixture coverage remains
   incomplete.
4. Module-local context, Action, and Guard resolution is now implemented. Its selection
   behavior still needs broader multi-pack positive, negative, ambiguous, and overlap
   fixtures before catalog expansion is certified.
5. Guidance cost is loader-measured and one risk-based Task ceiling now limits packs,
   modules, and measured tokens across all accepted packs without truncating modules.
6. Selected modules now receive only paths bound to their declared context roles.
   Project adaptation notes still do not become bounded module-specific judgment.
7. Human acceptance now pins exact pack, binding declaration, bound project source,
   Action/Guard catalog, rubric, fixture, and combined identities. Material changes
   reject explicit resolution and suppress the stale Skill during Task selection until
   a human re-accepts it.
8. The generated per-Task selection artifact is the sole cache and explanation view.
   Reuse requires the same algorithm, complete Task signal digest, accepted Skill
   identities, capability catalog, and resolved policy digest; stale acceptance
   bypasses reuse.
9. Focused deterministic tests now cover relevant selection, keyword-only and
   generated suppression, explicit anti-signals, module-local capabilities, measured
   budgets, exact cache hit and invalidation, and pack/project/evaluation acceptance
   invalidation. The Product UI fixture artifacts themselves remain prose descriptions
   and do not yet prove rendered behavioral improvement.
10. The required responsive visual-capture role is bound to a console build Action whose
   browser capability is `none`; current accessibility proof is a generic observation
   Guard rather than an accessibility-specific proof capability.
11. Packed external adoption has not proved list, recommendation, binding, selection,
    cache invalidation, and host projection behavior with the source checkout absent.

## Impact

1. Adding more accepted packs can produce false selection and unbounded context
   accumulation.
2. Irrelevant Actions and Guards can expand Task cost and closure obligations.
3. A pack may look structurally complete without proving that it improves agent output.
4. Overbroad project-source bindings can cause frequent suppression and re-acceptance;
   each pack still needs a narrow, durable project adaptation boundary.
5. Project adaptation may amount to provenance paths rather than applied project truth.
6. Skopos cannot yet claim that Skills reduce search, rework, user corrections, or false
   closure across different project shapes.

## Required Resolution

1. Retain the implemented complete Task signal envelope and structured eligibility stage.
2. Retain module-local context, Action, Guard, rubric, and failure-signal binding.
3. Retain one task-wide measured pack, module, and token budget.
4. Retain the implemented one-artifact exact selection cache and suppression behavior.
5. Retain exact content-bound human acceptance for every pack and project binding.
6. Replace remaining prose-only proof with complete deterministic selection fixtures
   and runnable behavioral artifacts.
7. Compare candidate guidance against no Skill or the prior evaluated source through
   isolated paired forward tests and blind review.
8. Pilot validated guidance in Skopos and one non-Skopos project.
9. Add later packs only after the existing UI pack proves value and bounded cost.

## Exit Criteria

1. Negative Tasks inject zero Skill context.
2. Every selection and suppression has structured evidence and a bounded cost.
3. No selected module pulls unrelated capabilities.
4. Exact content changes invalidate stale acceptance, selection reuse, and projections.
5. Deterministic fixtures prove positive, negative, ambiguous, overlap, generated, and
   budget behavior.
6. Paired evaluation demonstrates material targeted improvement without safety,
   authority, latency, or token regression.
7. Packed external-project proof passes without access to the source checkout.

## Changelog

- `2026-08-04`: Implemented exact acceptance identity and exact per-Task selection
  reuse. The runtime pins pack, binding, project-source, capability, rubric, fixture,
  evaluation-source, and combined digests; rejects stale explicit resolution;
  suppresses stale Skills without blocking unrelated work; and reuses only the one
  generated selection/explanation artifact when every identity component matches.
  Focused fixtures prove cache hit, Task and policy invalidation, stale capability
  suppression, and pack/project/evaluation source invalidation. Runnable behavioral
  artifacts, paired evaluation, and external proof remain open.
- `2026-08-04`: Implemented the Task signal envelope, normal changed-path propagation,
  structured positive/applicability eligibility, anti-signal and generated-output
  suppression, module-local rubric/failure projection, structured explanations, and
  light/standard/high-impact Task-wide measured budgets. Exact caching, digest-bound
  acceptance, complete fixtures, behavioral evaluation, and external proof remain open.
- `2026-08-04`: Recorded the first model/loader hard cut. Strict v1 manifests,
  loader-measured module cost, module-local signals and capability roles, obsolete
  field rejection, and the initial `0.1.0` Product UI Craft identity are implemented.
  Complete Task signals, task-wide budgets, exact identity, fixtures, behavioral
  evaluation, and external proof remain open.
- `2026-08-04`: Opened from the first full audit of the Product UI Craft pack, Task
  selection runtime, project binding, host projection, and current proof fixtures.
