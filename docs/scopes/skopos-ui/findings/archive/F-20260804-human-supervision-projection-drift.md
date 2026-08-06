---
title: Human Supervision Projection Drift
status: resolved
severity: MUST
owner: skopos-core
id: SKOPOS-F-20260804-HUMAN-SUPERVISION-PROJECTION-DRIFT
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
  - ../../decisions/archive/010-system-ui-information-hierarchy-and-signal-placement.md
  - ../../../../architecture/evidence-and-readiness-model.md
---

# Human Supervision Projection Drift

## Summary

The routed UI is structurally mature but still makes a human reconstruct the current
state from several artifact-shaped screens. Canonical runtime authorities already
know the active Task, pending decision, next command, coordination state, Evidence,
and Readiness subject. The UI does not yet project that whole supervision model as
one clear story.

## Evidence

The 2026-08-04 source and live-product review found:

1. Current Work leads with repository understanding while canonical Session Context
   may be waiting for one Task decision or recommending one next command.
2. Task presentation underuses the accepted contract, owned paths, coordination,
   selected Actions and Guards, Evidence requirements, proof subject, and closure
   path already present in the canonical Task model.
3. the UI derives local Task guidance while separately presenting Project Readiness;
   a blocked Task and a ready Project can therefore appear contradictory because the
   subject is not named
4. Project Knowledge emphasizes indexed-source counts, mappings, generated paths, and
   document inventory before explaining what the project is, how it is shaped, and
   which durable choices matter
5. primary navigation gives internal artifact families similar weight even when a
   developer mainly needs Now, Work, Knowledge, Readiness, and recent Activity
6. repository understanding is treated as permanent daily primary content instead of
   becoming prominent when adoption, freshness, or unresolved understanding requires
   attention
7. the closed search dock is visually hidden with opacity and pointer-event rules but
   its result controls remain mounted, creating an avoidable accessibility risk
8. compact layouts stack navigation ahead of the working canvas instead of providing
   a deliberate mobile navigation state

## Impact

1. developers spend attention translating Skopos internals instead of supervising
   the next safe action
2. identical words such as ready or blocked can describe different proof subjects
   without making the distinction visible
3. agents and maintainers can trust the underlying model while humans still feel they
   are looking at a machine dashboard
4. adding more counts, cards, or artifact routes would deepen the mismatch without
   improving confidence

## Resolution Criteria

This Finding can close when:

1. Now is driven by canonical Session Context and leads with the current decision,
   interruption, or next safe action
2. Task detail progressively explains the complete Task contract and proof path
3. Knowledge clearly separates human project understanding from Memory diagnostics
4. every Readiness presentation names adoption, Task continuation or closure, or
   Project integration as its subject
5. navigation, responsive behavior, search accessibility, and language support a calm
   supervision flow
6. the UI remains a read-only projection over canonical owners
7. focused type, behavior, build, and accessibility proof passes

## Resolution

The UI now projects canonical Session Context on Now, leads with the current decision
or safe action, and treats repository understanding as contextual orientation. Detailed
Tasks expose their accepted contract, Scope, ownership, coordination, Actions, Guards,
Evidence, proof subject, and closure path. Knowledge begins with product and
architecture understanding before Memory diagnostics. Readiness explicitly separates
adoption, Task continuation, Task closure, and Project integration.

Primary navigation now follows Now, Work, Knowledge, Readiness, and Activity. Compact
layouts use a modal navigation drawer with focus entry, containment, return, and inert
background content. Closed search results are unmounted. Cancelled and superseded Tasks
no longer appear as active work. The UI continues to call canonical read-only owners and
introduces no mutation authority.

Focused proof passed on 2026-08-04: 11 UI tests, UI and workspace type checks, production
console build, desktop review at 1440×900, compact review at 390×844, navigation and
search keyboard behavior, and a clean browser console.

Task `T-8937c1e6` corrected the post-resolution regressions found in live review: the
dev watcher now follows recursive authority directories, the CLI bundle is rebuilt
from the current routed app, Task and queue pages lead with the current work, search
focus and navigation naming are explicit, Markdown frontmatter stays out of summaries,
and readiness answers its adoption question directly.

## Changelog

- `2026-08-04`: Added the live post-audit regression correction and its authoritative
  refresh, hierarchy, search, accessibility, and delivery scope.
- `2026-08-04`: Resolved after canonical projection, core-route, responsive,
  accessibility, and focused build proof passed.
- `2026-08-04`: Opened from the human-first Skopos UI direction review and live console
  inspection.
