---
title: Human-First UI Convergence Plan
status: complete
owner: skopos-core
id: SKOPOS-PLAN-P-20260804-HUMAN-FIRST-UI-CONVERGENCE
scope: skopos-ui
role: plan
lifecycle: historical
authority: canonical
provenance: accepted
view: target
defaultVisible: false
implementationStatus: complete
lastUpdated: 2026-08-04
relatedDocs:
  - ../../overview.md
  - ../../decisions/D-20260804-human-first-supervision-projection.md
  - ../../decisions/D-20260804-unisane-ui-visual-ownership.md
  - ../../findings/archive/F-20260804-human-supervision-projection-drift.md
  - ../../findings/archive/F-20260804-human-content-projection-drift.md
  - ../../findings/archive/F-20260804-policy-rule-detail-projection-gap.md
  - ../../../../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: per phase
---

# Human-First UI Convergence Plan

## Goal

Make Skopos feel like a calm supervision layer that helps a developer understand the
Project, see the current work, make the required decision, and verify confidence
without learning the storage layout first.

This Plan owns multi-Task UI direction only. Skopos Tasks own executable changes and
Evidence.

## Boundaries

1. preserve current `skopos-ui`, `skopos-runtime`, and `skopos-model` ownership
2. consume canonical Session Context, Task, Evidence, and Readiness authorities
3. keep UI interaction derived and read-only
4. retain deep routes for canonical artifacts while reducing primary navigation
   weight
5. consume shared UI only through an independently owned external delivery contract
6. do not turn Skopos into a general project-management suite

## Phase 1: Canonical Projection Contract

1. add canonical Session Context to the UI console-state projection
2. stop deriving a competing top-level current-state story from Task and Project
   Readiness fragments
3. make Readiness subjects explicit in selectors and visible copy
4. preserve bounded payloads and read-only runtime use

Exit condition: Now can identify the canonical decision, interruption, or next command
without interpreting repository inventory as the current work state.

## Phase 2: Adaptive Now And Complete Task Detail

1. lead Now with one state-specific narrative and next safe action
2. move repository understanding to supporting or attention-required placement
3. expose acceptance, non-goals, constraints, Scope, ownership, coordination, selected
   Actions and Guards, Evidence, proof subject, and closure progressively on Task detail
4. show exact canonical commands only as copy or handoff affordances

Exit condition: a developer can explain what the current Task is allowed to change,
what proof it needs, and what happens next from one screen.

## Phase 3: Human Knowledge And Subject-Aware Readiness

1. separate product and architecture understanding from Memory/index diagnostics
2. surface durable Decisions and unresolved structural Findings as knowledge, not
   dashboard counts
3. distinguish adoption, Task continuation, Task closure, and Project integration
   Readiness
4. explain blockers as sentences with the safest recovery path

Exit condition: Knowledge teaches the Project and Readiness never uses an unqualified
ready or blocked state.

## Phase 4: Calm Shell, Navigation, And Accessibility

1. converge primary navigation on Now, Work, Knowledge, Readiness, and Activity
2. keep deeper routes discoverable within their owning destination
3. replace stacked compact navigation with a deliberate accessible mobile state
4. make closed overlays inert or unmounted and verify keyboard/focus behavior
5. reduce repeated cards, metric grids, badge piles, and raw metadata

Exit condition: desktop and compact layouts preserve the same information priority and
pass focused accessibility behavior checks.

## Phase 5: Shared UI Delivery Boundary

1. inventory useful Unisane UI tokens and registry primitives
2. decide whether registry local-source consumption or public packages are the stable
   delivery mechanism
3. prove independent installation, ownership, theming, and upgrade behavior
4. adopt only primitives that reduce maintenance without importing Framework runtime
   authority

Exit condition: any shared UI dependency is public, reproducible, and independently
owned. This phase is not required for Phases 1 through 4.

Delivered by Task `T-fec6a29e`: Skopos uses the Unisane CLI registry to own Button,
Badge, Card, transitive support, and the neutral semantic baseline locally. It carries
no Unisane UI/token runtime dependency. The same Task completes browser-history URLs
and direct-route serving so the shared primitives live inside a normal routed product.

## Phase 6: Certification

1. run focused selector and routed behavior tests
2. pass UI and workspace type checks
3. build the production console
4. perform desktop and compact live-product review
5. verify landmark, focus, overlay, status wording, and command affordance accessibility
6. record Task-local Evidence and close the Finding only when its resolution criteria
   are met

## Phase 7: Visual Ownership Convergence

1. source-install the shared application shell, content, overlay, search, navigation,
   and typography primitives used by the Unisane platform family
2. replace the custom desktop/mobile shell and floating search dock with those owners
3. remove the parallel Skopos palette, arbitrary type and shape rules, component
   overrides, and forced light mode
4. retain custom CSS only for Skopos layout, documents, artifacts, Mermaid, and scroll
   behavior, using semantic tokens throughout
5. verify desktop, compact drawer, search Dialog, and system dark mode in the live app

Exit condition: the routed console looks and behaves like a polished Unisane platform
without losing Skopos's human-first supervision hierarchy or independent distribution.

Delivered by Task `T-330b4a08`: the routed console now composes the source-installed
Unisane Sidebar, Top App Bar, Dialog, Search Bar, List, Card, Card Grid, Accordion,
Alert, Badge, Button, Icon Button, Page Section, Surface, and Typography families.

## Phase 8: Human Content Projection Correction

1. make Now state the consequence and expose the exact safe handoff for its primary
   recommendation
2. replace Plan frame repetition with current direction, linked progress, next
   milestone, and real decision pressure
3. summarize accepted Decisions before their canonical source and preserve later
   consequence sections in console state
4. present Activity as a human project story while keeping system events and actor
   identifiers behind supporting disclosure

Exit condition: the four reviewed routes answer the developer's human question before
showing storage, provenance, or operational detail.

Delivered by Tasks `T-cf8d5171` and `T-2cbe3bfe` with focused behavior coverage,
TypeScript proof, the canonical CLI/UI production build, and live route inspection.

## Phase 9: Policy Rule Detail Projection

1. keep Rules focused on current policy posture and compact linked summaries
2. keep pack pages focused on pack purpose, project fit, rule index, and supporting
   architecture or Guard context
3. give every active rule a stable URL-backed page with complete human meaning,
   project posture, enforcement context, and source provenance
4. distinguish rule-specific drift checks from broader pack Guards
5. index individual rules in search and prove direct-route behavior

Exit condition: a Task, Finding, drift result, search result, human, or agent can refer
to one exact rule without asking the reader to scan a pack-sized page.

Delivered by Task `T-23cc1155` with focused selector, content, search, and routing
proof plus production and live-product verification.

## Phase 10: Data-Driven Project Map

1. derive human Scope purpose and key sections from canonical Scope overview Memory
2. show registry-owned location, owner, alias, parent, dependencies, and dependents
3. route related Scope knowledge and current work without duplicate empty sections
4. remove package-specific UI guide tables, universal confidence noise, and inert graph
   labels
5. prove the projection with a project-generic fixture and live Scope-route review

Exit condition: a developer can explain what an area does, where it lives, how it
connects, what to read, and what work is active without knowing the repository layout
or reading generated Scope JSON.

Delivered by Task `T-8d02efe4` through the canonical console-state join and simplified
Scope list and detail pages.

## Phase 11: Focused Now Briefing

1. distinguish blocking decisions from non-blocking recommendations in visible copy
2. provide a copyable exact CLI handoff with an explicit actor placeholder
3. limit discussion to fresh context bound to the selected current Task
4. keep Plans, adapter capability, general proof, stale discussion, and empty
   attention off the default briefing
5. show a small current-focus fallback without implying an actor-specific Task

Exit condition: Now answers what matters and what to do next without presenting a
machine-dashboard roll-up or overstating that work is blocked.

Delivered by Task `T-37a69dd7` with focused selector and guidance coverage, type proof,
production builds, and live route review.

## Phase 12: Sidebar Hierarchy And Alignment Polish

1. align the project identity block with the inset Top App Bar
2. create a deliberate identity-to-navigation spacing rhythm
3. show explicit open and closed state for every navigation group
4. reserve the selected surface for the exact route rather than both parent and child
5. collapse to the five meaningful primary destinations and restore group children on
   activation

Exit condition: expanded and collapsed navigation remain understandable, aligned, and
usable without anonymous icons, double selection, or hidden disclosure state.

Delivered by Task `T-95607b85` with component behavior coverage, type proof,
production builds, and live expanded/collapsed route review.

## Phase 13: Restrained Console Typography

1. preserve the regular-weight page title as the single dominant heading
2. use `titleLarge` for primary sections and `titleMedium` for nested groups
3. use `titleSmall` or label roles for row and item titles
4. remove page-level semibold, bold, tight-tracking, and inherited-weight corrections
5. keep intentional inline or code emphasis limited to medium weight

Exit condition: page, section, nested-group, item, label, and body text form a clear
descending hierarchy on representative routes without overriding Unisane typography
defaults.

Delivered by Task `T-fd68810e` with focused component proof, TypeScript, production
builds, and live Task and Docs route review.

## Phase 14: Inspector Rail Polish

1. reduce the shared inspector inset and vertical rhythm
2. remove the redundant Card surface around open summary content
3. retain default Unisane Accordion behavior for optional supporting detail
4. constrain key-value columns so values cannot widen or disappear beyond the rail
5. show project-owned absolute paths from a compact repository-relative marker

Exit condition: representative Rules and Task inspectors remain calm, readable, and
contained in both closed and expanded states without redundant surfaces or clipped
values.

Delivered by Task `T-30fa3351` with shared component coverage, TypeScript, production
builds, and live Rules and Task route review.

## Phase 15: Persistent Routed Document Navigation

1. route previous and next document controls through the application router
2. route internal Markdown destinations through the same application-link owner
3. keep external URLs, downloads, and in-page anchors on native browser behavior
4. preserve browser-history URLs, direct links, back/forward behavior, and the mounted
   shell across document transitions

Exit condition: moving between knowledge records updates the document content and URL
without reloading the sidebar, Top App Bar, inspector, or application root.

Delivered by Task `T-d568de66` with focused routing coverage, full UI verification,
production builds, and live previous/next navigation review.

## Phase 16: Inset Context And Inspector Control

1. replace the single route-family label with a compact family-to-record breadcrumb
2. keep breadcrumb ancestors on canonical client-side routes
3. inset the inspector inside the page canvas as a rounded, borderless, shadowless rail
   with divider-only child sections
4. provide accessible collapse and restore controls with a persisted user preference
5. keep the main reading scrollbar functional but visually quiet
6. preserve responsive stacking and Unisane component defaults

Exit condition: a developer can see where the current record belongs and can reclaim
reading width without the inspector behaving like a permanent full-height wall.

Delivered by Task `T-e103dd2f` with focused routing and shell coverage, full UI proof,
production builds, and live expanded/collapsed review.

## Phase 17: Outer-Shell Search Placement

1. move desktop global search out of record context and into the shell strip above the
   inset application surface
2. use the registry-installed Unisane Search Bar with a contrasting surface background,
   the inset's quiet outline token, and alignment to the inset content edge
3. keep the compact mobile Top App Bar search entry
4. remove the now-redundant desktop sidebar search control
5. route both remaining entries to the existing canonical project-search Dialog
6. preserve the compact breadcrumb header, responsive shell, and keyboard access

Exit condition: global search is visually discoverable before the inset page context
without creating a second search implementation or crowding the breadcrumb header.

Delivered by Task `T-cb824e5b` with focused routing coverage, build proof, and live
desktop interaction review.

## Current Delivery

Task `T-3ee26ab5` owns the coherent implementation across Phases 1 through 4 and its
focused proof. Task `T-fec6a29e` owns Phase 5, clean URL-backed navigation, and the
successor certification. Task `T-330b4a08` owns Phase 7 and its visual interaction
proof. Task `T-8937c1e6` owns the post-audit refinement: authoritative live refresh,
work-first hierarchy, search and navigation accessibility, bounded suggestions,
frontmatter-free summaries, and desktop/mobile polish. The Plan is complete.
Tasks `T-cf8d5171` and `T-2cbe3bfe` own the Phase 8 correction discovered during the
subsequent human-perspective review. The Plan remains complete after this correction.
Task `T-23cc1155` owns the Phase 9 policy-rule navigation correction. The Plan remains
complete after this correction.
Task `T-8d02efe4` owns the Phase 10 Project Map correction. The Plan remains complete
after this correction.
Task `T-37a69dd7` owns the Phase 11 Now briefing correction. The Plan remains complete
after this correction.
Task `T-d568de66` owns the Phase 15 routed-document navigation correction. The Plan
remains complete after this correction.
Task `T-e103dd2f` owns the Phase 16 shell-context and inspector-control correction. The
Plan remains complete after this correction.
Task `T-cb824e5b` owns the Phase 17 outer-shell search placement correction. The Plan
remains complete after this correction.
Task `T-95607b85` owns the Phase 12 sidebar correction. The Plan remains complete after
this correction.
Task `T-fd68810e` owns the Phase 13 typography correction. The Plan remains complete
after this correction.
Task `T-30fa3351` owns the Phase 14 inspector correction. The Plan remains complete
after this correction.

## Changelog

- `2026-08-04`: Added and completed Phase 17 so left-aligned desktop global search
  precedes the inset application surface while mobile retains one compact Top App Bar
  entry.
- `2026-08-04`: Added and completed Phase 16 for breadcrumb route context and an inset,
  borderless, shadowless, collapsible inspector with aligned divider-only sections.
- `2026-08-04`: Added and completed Phase 14 for a compact, border-light inspector
  rail with bounded values and readable repository-relative paths.
- `2026-08-04`: Added and completed Phase 13 to restore a restrained managed type
  hierarchy and remove unnecessary page-level font overrides.
- `2026-08-04`: Added and completed Phase 12 for aligned shell headers, explicit group
  state, exact-route selection, and meaningful collapsed navigation.
- `2026-08-04`: Added and completed Phase 11 so Now is a truthful, focused briefing
  with current pressure and a usable handoff instead of a dashboard roll-up.
- `2026-08-04`: Added and completed Phase 10 so Project Map derives complete human
  Scope orientation from canonical Scope, Memory, relationship, and work data.
- `2026-08-04`: Added and completed Phase 9 with complete URL-backed policy rule
  pages, compact rule summaries, and exact search destinations.
- `2026-08-04`: Added and completed Phase 8 so Now, Plan detail, Decision detail, and
  Activity lead with human meaning while technical records remain supporting detail.
- `2026-08-04`: Added the post-audit refinement Task for live-state trust, work-first
  hierarchy, accessibility, search quality, and responsive polish.
- `2026-08-04`: Completed Phase 7 through Unisane-default visual ownership, the
  Ops-style shell, semantic system theming, and live desktop/mobile interaction proof.
- `2026-08-04`: Completed Phase 5 through external registry-installed local source and
  added canonical browser-history routes with deep-link serving.
- `2026-08-04`: Completed Phases 1 through 4 and focused certification in Phase 6.
  Deferred Phase 5 until Unisane UI has an explicit independently consumable delivery
  contract.
- `2026-08-04`: Opened from the accepted human-first supervision Decision and scoped
  the initial delivery to canonical projection, core routes, shell, and proof.
