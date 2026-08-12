---
title: Agent Iteration Is Audited But Not Yet Proportional
status: resolved
severity: SHOULD
owner: skopos-core
id: F-20260811-agent-iteration-bounding-and-evidence-gap
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-11
relatedDocs:
  - ../architecture/decision-escalation-model.md
  - ../architecture/evidence-and-readiness-model.md
  - ../decisions/D-20260803-evidence-based-ask-back-classification.md
  - ../decisions/D-20260811-topology-aware-task-scope-authority.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: after the MUST Scope and closure Findings are resolved
---

# Agent Iteration Is Audited But Not Yet Proportional

## Finding

The self-hosted homepage build proved that Skopos records agent work reliably, but
small iterative changes still incur excessive ceremony and a Task can drift
semantically while remaining auditable.

The reviewed build window contained:

1. 18 Tasks, 17 completed and one intentionally deferred release gate
2. 26 ask-back questions: 18 Scope confirmations and 8 public-contract confirmations
3. 22 ownership expansions
4. 41 Evidence requirements

A one-file visual adjustment received standard workflow and the same generic steps as
larger work. Separately, a Task titled `Polish homepage grid line continuity` expanded
nine times into hero assets, onboarding, agent compatibility, inline SVG components,
tests, and the Workstream example. Skopos preserved the history but did not recommend a
child Task when the semantic subject changed.

Visual proof was real—browser viewports, screenshots, computed measurements, tests,
and builds—but durable acceptance commonly retained the generic
`agent-observation` type rather than a first-class browser receipt. Durable visual
conventions also did not consistently produce a Memory obligation.

## Progress

- `2026-08-11`: Ownership expansion now detects newly introduced declared Scopes,
  newly introduced impact categories, and three-or-more repeated expansions. It emits
  one non-blocking, auditable `start-child-task` recommendation with the exact Scope,
  owned paths, reason, and executable `skopos start` command. A single coherent
  within-Scope addition remains quiet; later expansion updates the same recommendation
  instead of duplicating it. Full Task/MCP state and compact CLI output both expose the
  proposal. Automatic child creation remains intentionally outside core mutation—the
  agent or user chooses whether the split preserves intent.
- `2026-08-11`: `skopos evidence record-browser` now creates first-class,
  source-bound browser receipts with URL/route, viewport and scale, conditions,
  interaction, screenshot/accessibility/DOM-measurement capture digest,
  browser/environment identity, actor, and exact Task-owned source path states. The
  CLI rejects unsafe external capture paths and malformed input; verification accepts
  only current receipts and invalidates them after an owned-source change. Source and
  packed-install fixtures cover the public command.
- `2026-08-11`: Memory inference now classifies explicit durable convention intent
  from the Task goal and contract. Project-wide adoption, codification, enforcement,
  or standardization produces a `pattern` or `standard` obligation; one-off polish,
  copy, color, spacing, and local implementation stay quiet. Existing canonical
  same-role Scope Memory is selected deterministically, otherwise Skopos requires new
  adopted Memory without inventing it. Expansion recomputes from preserved intent.
- `2026-08-11`: The full resolution is in place. Evidence-based ask-backs distinguish
  presentation from public contract changes, deterministic Scope selection removed the
  repeated generic monorepo question, proportional admission keeps eligible small work
  light, semantic drift emits bounded split guidance, browser proof is source-bound,
  and durable convention intent creates Memory obligations.

## Impact

1. users may bypass real questions after repeated irrelevant ones
2. tiny Tasks spend more effort on workflow than implementation
3. an auditable Task can still become an inaccurately named container for unrelated work
4. future agents receive history without the most useful compact design rationale
5. visual closure depends too heavily on the observing agent's assertion

## Required Resolution

1. apply subject-and-intent classification to Scope and public-contract questions
2. distinguish public presentation from public API, route, SDK, security, migration,
   and provider contracts
3. keep light Tasks light when risk, ownership, and policy allow it
4. detect semantic divergence or repeated ownership expansion and recommend a child
   Task or explicit parent/multi-Scope structure
5. add source-bound browser Evidence with URL, viewport, interaction, screenshot or
   measurement artifact, environment, and source digest
6. infer a Memory review obligation when a Task establishes a durable project
   convention rather than a one-off implementation detail

This Finding is resolved for the first public-release baseline. Future classifier
examples should extend focused positive and negative fixtures rather than broadening
the model with single keywords.
