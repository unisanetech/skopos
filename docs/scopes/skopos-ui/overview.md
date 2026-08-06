---
title: "Scope: UI"
status: active
owner: skopos-core
id: SKOPOS-SCOPE-UI
scope: skopos-ui
role: overview
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-04
relatedDocs:
  - architecture/00-architecture.md
  - ../../architecture/docs-governance.md
  - ../../architecture/evidence-and-readiness-model.md
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - decisions/D-20260804-human-first-supervision-projection.md
  - decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md
  - decisions/D-20260804-unisane-ui-visual-ownership.md
  - decisions/008-system-ui-routed-app-stack.md
  - decisions/012-system-ui-dev-loop-and-hot-reload.md
  - decisions/015-system-ui-markdown-rendering-and-doc-reader-pipeline.md
  - decisions/016-system-ui-diagram-and-graph-presentation.md
  - findings/archive/F-20260804-human-supervision-projection-drift.md
  - findings/archive/F-20260804-human-content-projection-drift.md
  - findings/archive/F-20260804-policy-rule-detail-projection-gap.md
  - findings/archive/F-20260804-url-and-shared-ui-delivery-drift.md
  - findings/archive/F-20260804-unisane-ui-visual-ownership-drift.md
  - work/archive/P-20260804-human-first-ui-convergence.md
reviewCycle: when UI ownership changes
---

# Scope: UI

The UI is an internal human projection over canonical Project Memory and runtime state.

## Changelog

- `2026-08-05`: Consolidated current UI Decisions under this Scope and archived the
  superseded shell, navigation, component-normalization, and fixed search-dock
  contracts behind the August human-first and Unisane ownership authorities.
- `2026-08-04`: Reframed the inset header as route-aware breadcrumb context, hid the
  primary reading scrollbar, and made the borderless collapsible inspector use one
  aligned inset with divider-only child sections.
- `2026-08-04`: Kept previous/next and internal Markdown navigation inside the mounted
  routed shell through one application-link owner.
- `2026-08-04`: Replaced package-specific Project Map blurbs with canonical Scope
  purpose, location, ownership, dependencies, related knowledge, and current work.
- `2026-08-04`: Restored a restrained page-to-section-to-group type hierarchy using
  managed Unisane roles without local font-weight or tracking overrides.
- `2026-08-04`: Simplified the contextual inspector into a compact supporting rail
  with open summaries, bounded values, and readable repository-relative paths.
- `2026-08-04`: Refined Now into a truthful current-state briefing with blocking-aware
  decision language, current-Task discussion, focused work, and a copyable handoff.
- `2026-08-04`: Polished the shared sidebar with aligned headers, visible group state,
  exact-route selection, and meaningful five-family collapsed navigation.
- `2026-08-04`: Added complete URL-backed pages for individual active policy rules,
  compact links from Rules and pack pages, and exact rule search destinations.
- `2026-08-04`: Corrected the remaining record-shaped content projections across Now,
  Plan detail, Decision detail, and Activity, including complete Decision section
  retention and progressive technical disclosure.
- `2026-08-04`: Converged the routed console on Unisane visual defaults, the Ops-style
  shell, semantic system theming, and product-only custom layout/content CSS.
- `2026-08-04`: Completed clean URL-backed navigation and external Unisane UI
  registry adoption with locally owned source and no Unisane runtime dependency.
- `2026-08-04`: Implemented canonical Session Context on Now, complete high-impact
  Task explanation, human-first Knowledge, named Readiness subjects, intent-based
  navigation, accessible compact navigation, and inert closed search results.
- `2026-08-04`: Accepted the human-first supervision projection: adaptive Now,
  complete but progressive Task explanation, human Project Knowledge, and
  subject-named Readiness. Direct Unisane UI dependency remains deferred until its
  external delivery contract is proven.
- `2026-07-29`: Converged navigation and state on Plans, Tasks, Work Queue, Actions,
  Evidence, and Readiness.

## Owns

1. routed local application shell
2. Project, Scope, Plan, Task, Work Queue, Action, Evidence, and Readiness views
3. semantic document reading and search
4. filtered high-signal graph views
5. live and snapshot serving

## Rules

1. UI state is derived; it never becomes another authority
2. document views use the semantic document catalog
3. Task views resolve exact Task-owned paths
4. archive and generated reference are excluded by default
5. runtime assets live only under `.skopos/ui/**`
6. raw JSON remains available as secondary disclosure, not the main experience
7. human labels use canonical product vocabulary
8. Now projects canonical Session Context and leads with the decision or next safe
   action for the current state
9. Task detail explains the accepted contract, owned Scope and paths, coordination,
   required proof, and closure path with detail proportional to risk
10. Readiness always names its subject: adoption, Task continuation or closure, or
    Project integration
11. Project Knowledge leads with human project understanding; source mappings and
    index diagnostics remain supporting detail
12. controls may copy or hand off canonical commands, but the UI does not create a
    parallel mutation or workflow authority
13. canonical application destinations use browser-history pathnames and are served
    through `skopos ui dev` or `skopos ui serve`
14. shared primitives use locally owned Unisane UI registry source; private Unisane
    runtime packages are forbidden
15. Unisane semantic tokens and component defaults own reusable visual behavior;
    Skopos must not add a parallel palette, type scale, shape system, shell, control,
    or sweeping override
16. Skopos-specific CSS and components are limited to supervision composition,
   application layout, document/artifact reading, and project-specific visualization
17. Project Map is a data-driven Scope orientation surface; package-specific meaning
   must come from canonical Scope Memory rather than UI lookup tables
18. Now includes only selected current pressure; unrelated Plans, adapter capability,
   general proof, stale discussion, and empty attention states stay on owning routes
19. sidebar hierarchy remains legible in both modes: expanded groups disclose state
   and select exact routes; collapsed mode represents the five primary families
20. page typography descends from `pageTitle` to `titleLarge`, `titleMedium`, and
   `titleSmall` or label roles without local weight or tracking overrides
21. the inspector uses one compact supporting surface; summary content avoids nested
   cards, optional detail uses default disclosure, and values stay inside the rail
22. every internal application destination uses router navigation; external URLs,
   downloads, and in-page anchors retain native browser behavior
23. the Top App Bar presents family-to-record breadcrumb context, while detail-page
   inspectors remain inset, rounded, borderless, shadowless, surface-colored,
   collapsible, and use aligned divider-only child sections
24. desktop global search sits in the outer shell directly above the inset surface;
   mobile retains the compact Top App Bar search entry, and both open one search owner

## Current Status

The human-first supervision projection, clean pathname routing, and shared UI delivery
boundary and full visual-default convergence are implemented and focused proof is
green. The remaining record-shaped content drift has also been corrected: current
guidance, Plans, Decisions, and Activity now lead with human meaning and keep source or
operational metadata secondary. Now is a focused briefing rather than a dashboard:
its decision wording reflects whether work is actually blocked, its handoff is
copyable, and its supporting content is limited to current focus, current-Task
discussion, and real attention. The UI still has no ambient actor
identity, so a workspace with several active Tasks truthfully reports that no
actor-specific Session Task is selected and directs the developer to Work. Unisane UI
components are registry-installed and Skopos-owned; their defaults own reusable visual
behavior, system light/dark theming is coherent, and there is no Unisane UI/token
application runtime dependency.

The shell sidebar now shares the inset header grid, separates identity from work with
a deliberate spacing rhythm, shows group disclosure explicitly, avoids double-selected
parent and child surfaces, and collapses to five meaningful primary icons.

Rules now separate policy posture, pack guidance, and atomic rule detail. Every active
rule is directly addressable under its owning pack and explains its requirement,
rationale, applicability, examples, anti-patterns, recorded drift or exceptions,
rule-specific checks, pack Guards, and canonical source without creating a second
policy or verification authority.

Project Map now explains each declared area from canonical Scope Memory, shows where
it lives and who owns it, links its dependencies and dependents, routes to related
knowledge, and presents current work once. Scope pages no longer use package-specific
React lookup tables or inert graph labels.
