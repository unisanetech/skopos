---
title: Planner Ask-Back Classification Gap
status: resolved
severity: MUST
owner: skopos-core
id: F-20260803-planner-ask-back-classification-gap
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-03
relatedDocs:
  - ../../decisions/D-20260803-evidence-based-ask-back-classification.md
  - ../../architecture/agent-native-operating-model.md
  - ../../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: archive after focused positive and negative classifier proof passes
---

# Planner Ask-Back Classification Gap

## Finding

The planner used unqualified substring matches to infer destructive migration, vendor,
and security decisions. Routine goals therefore produced irrelevant mandatory questions:

1. replacing an unbounded transport payload was classified as a destructive migration
2. operational provider wording was classified as a vendor choice
3. bounding Session context was classified as a security or privacy change

The destructive and security questions also lacked an answer that truthfully meant the
classified concern did not apply.

## Impact

- Tasks can be blocked without a real high-impact decision
- agents must choose misleading options to continue
- users lose trust in ask-back questions and may habitually bypass real ones
- unrelated questions consume turns and Memory without improving safety

## Acceptance

1. the observed operational homonyms produce none of the three unrelated questions
2. concrete provider replacement, destructive schema removal, and authorization change
   goals retain the correct mandatory question
3. destructive and security questions expose explicit no-change outcomes
4. identical admitted facts produce identical question sets

## Resolution Progress

The planner now uses subject-intent predicates and removes known operational compounds
before classification. Six focused tests cover the negative boundary, three positive
boundaries, explicit no-change outcomes, and deterministic question construction. The
Finding was archived after the closing Task passed source-bound focused and typecheck
proof with no Readiness blocker.
