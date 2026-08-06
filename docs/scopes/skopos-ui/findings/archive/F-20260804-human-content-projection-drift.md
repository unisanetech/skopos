---
title: Human Content Projection Drift
status: resolved
severity: MUST
owner: skopos-core
id: SKOPOS-F-20260804-HUMAN-CONTENT-PROJECTION-DRIFT
scope: skopos-ui
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-04
relatedDocs:
  - ../../overview.md
  - ../../decisions/D-20260804-human-first-supervision-projection.md
  - ../../work/archive/P-20260804-human-first-ui-convergence.md
---

# Human Content Projection Drift

## Summary

The Unisane-default shell and route structure were coherent, but four important pages
still read like machine records. Now underused consequence and handoff fields, Plan
detail repeated its stored frame, Decision detail opened as a document dump, and
Activity promoted lifecycle events and actor identifiers above the project story.

## Evidence

The live 2026-08-04 human-perspective review found:

1. Now displayed a recommendation without always exposing what would happen after the
   choice or an exact canonical command for the recommended option.
2. Plan detail repeated goal and summary, displayed unknown or zero-value metadata,
   and did not lead with current progress or the next milestone.
3. Decision detail promoted Markdown format, availability, lifecycle, placeholders,
   and the full source before explaining the accepted direction and rationale.
4. the shared Markdown projection retained only eight sections, which could silently
   remove canonical Decision consequences and rejected alternatives.
5. Activity presented raw operational events, kind badges, timestamps, and actor IDs
   as the main reading instead of keeping them as investigative detail.

## Impact

Developers could navigate the product but still had to translate Skopos storage and
runtime vocabulary into a human answer. That weakened the central promise that Skopos
should make current work easier to understand and supervise with confidence.

## Resolution Criteria

1. Now explains the situation, reason, consequence, recommendation, and exact safe
   handoff from canonical Session Context.
2. Plan detail leads with direction, linked progress, next milestone, and real risks.
3. Decision detail summarizes the accepted direction, rationale, consequences, and
   affected commitments before the complete source.
4. Activity presents Task, Plan, and Action changes as the project story while system
   events and actor identifiers remain secondary.
5. focused behavior tests, type checks, production build, and live route inspection
   agree with the projection.

## Resolution

Tasks `T-cf8d5171` and `T-2cbe3bfe` corrected the presentation and its source
projection. Now exposes consequence and a canonical CLI handoff. Plan detail begins
with current direction, progress, next milestone, and decision pressure. Decision
detail provides a human briefing before the full source, ignores synthetic empty
section placeholders, and receives later Decision sections from the Markdown
projection. Activity keeps meaningful work changes in the main story and folds raw
system events and technical actor metadata behind disclosure.

Focused UI tests, TypeScript checks, the canonical CLI/UI build, and live inspection
of Now, Plan detail, Decision detail, and Activity passed on 2026-08-04.

## Changelog

- `2026-08-04`: Resolved after the four human-supervision projections and the shared
  Decision section projection were corrected and verified live.
- `2026-08-04`: Opened from the post-redesign human-perspective UI review.
