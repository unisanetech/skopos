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
the current selector, budget model, project adaptation, acceptance identity, fixtures,
and external proof do not yet justify adding a broad Skill catalog.

This is a pre-release implementation gap. The fix is one clean hard cut to the first
canonical Skill system, not a versioned migration.

## Evidence

1. Task selection currently builds relevance input from the goal, Scope identity, Scope
   path, and optional changed paths. It does not evaluate the complete acceptance,
   constraints, non-goals, open decisions, owned paths, affected capabilities, or
   accepted failure history.
2. The normal agent-native caller does not pass changed paths into selection.
3. Module-local positive and negative signals now drive deterministic ranking and
   suppression, but the selector still lacks the complete structured eligibility
   envelope and accepted failure-history input required by the Decision.
4. Module-local context, Action, and Guard resolution is now implemented. Its selection
   behavior still needs deterministic positive, negative, ambiguous, and overlap
   fixtures before this correction is certified.
5. Guidance cost is now loader-measured rather than author-estimated, but limits still
   apply per pack. Skill context is appended to the compact brief without one task-wide
   pack, module, or measured-token ceiling.
6. Selected modules now receive only paths bound to their declared context roles.
   Project adaptation notes still do not become bounded module-specific judgment.
7. Catalog resolution deduplicates by `packId`, while acceptance pins a version label
   without pinning the complete pack, binding, rubric, fixture, project-source, and
   evaluation identity.
8. Current Product UI fixtures are prose descriptions. Focused tests assert manifest
   shape and expected phrases rather than Task selection, anti-signal suppression,
   budget compliance, capability locality, or behavioral improvement.
9. The required responsive visual-capture role is bound to a console build Action whose
   browser capability is `none`; current accessibility proof is a generic observation
   Guard rather than an accessibility-specific proof capability.
10. Packed external adoption has not proved list, recommendation, binding, selection,
    cache invalidation, and host projection behavior with the source checkout absent.

## Impact

1. Adding more accepted packs can produce false selection and unbounded context
   accumulation.
2. Irrelevant Actions and Guards can expand Task cost and closure obligations.
3. A pack may look structurally complete without proving that it improves agent output.
4. Material guidance changes may retain stale human acceptance.
5. Project adaptation may amount to provenance paths rather than applied project truth.
6. Skopos cannot yet claim that Skills reduce search, rework, user corrections, or false
   closure across different project shapes.

## Required Resolution

1. Build one complete Task signal envelope and structured eligibility stage.
2. Add module-local context, Action, Guard, rubric, and failure-signal binding.
3. Enforce one task-wide measured pack, module, and token budget.
4. Cache exact selections by Task, pack, binding, source, and capability digests.
5. Bind acceptance to exact evaluated content and invalidate material changes.
6. Replace prose-only proof with deterministic selection fixtures and runnable
   behavioral artifacts.
7. Compare candidate guidance against no Skill or the prior evaluated source through
   isolated paired forward tests and blind review.
8. Pilot validated guidance in Skopos and one non-Skopos project.
9. Add later packs only after the existing UI pack proves value and bounded cost.

## Exit Criteria

1. Negative Tasks inject zero Skill context.
2. Every selection and suppression has structured evidence and a bounded cost.
3. No selected module pulls unrelated capabilities.
4. Exact content changes invalidate stale acceptance and projections.
5. Deterministic fixtures prove positive, negative, ambiguous, overlap, generated, and
   budget behavior.
6. Paired evaluation demonstrates material targeted improvement without safety,
   authority, latency, or token regression.
7. Packed external-project proof passes without access to the source checkout.

## Changelog

- `2026-08-04`: Recorded the first model/loader hard cut. Strict v1 manifests,
  loader-measured module cost, module-local signals and capability roles, obsolete
  field rejection, and the initial `0.1.0` Product UI Craft identity are implemented.
  Complete Task signals, task-wide budgets, exact identity, fixtures, behavioral
  evaluation, and external proof remain open.
- `2026-08-04`: Opened from the first full audit of the Product UI Craft pack, Task
  selection runtime, project binding, host projection, and current proof fixtures.
