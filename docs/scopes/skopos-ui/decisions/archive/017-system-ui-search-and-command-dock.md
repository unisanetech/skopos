---
title: "Decision: System UI Search And Command Dock"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-017
scope: skopos-ui
role: decision
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
defaultVisible: false
date: 2026-04-11
relatedDocs:
  - ../D-20260804-human-first-supervision-projection.md
  - ../D-20260804-unisane-ui-visual-ownership.md
  - ../../../../work/archive/P-11229565-system-ui.md
  - ../../../../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - ../../../../work/archive/P-37fa9180-prototype-roadmap.md
  - ../../overview.md
---

# Decision: System UI Search And Command Dock

> Historical contract. The human-first supervision and Unisane visual-ownership Decisions supersede the fixed search-dock model with bounded routed search in the shared Dialog pattern.

## Changelog

- `2026-04-11`: Implemented Phase 2 with a generated search index in the built app output, so the dock now consumes compiled entries with headings and excerpts instead of rebuilding the search surface ad hoc in the browser.

## Context

The routed console now has a clearer shell, but it still lacks one durable workspace-wide search surface. The existing navigation doctrine only says the left rail should expose a `search or jump entry`, which is not enough to define placement, interaction, or retrieval behavior.

Skopos also should not adopt generic site-search behavior. The product is built around compiled knowledge, exact resolution, compact context, and low-drift retrieval. A bad search surface would turn the UI into a fuzzy raw-file browser and would weaken the same retrieval contract agents rely on.

## Decision

Adopt one primary search surface for the routed console: a fixed bottom-center search and command dock that behaves like a workspace resolver, not a top-bar site-search field.

The dock should search compiled workspace knowledge first, rank exact and canonical results first, and treat semantic retrieval as a later fallback instead of the default path.

## Product Model

The search surface should behave like a command dock:

1. fixed to the viewport bottom center on desktop
2. compact when idle
3. activated by click or `Cmd/Ctrl+K`
4. results open upward from the dock
5. keyboard-first navigation with arrows, `Enter`, and `Escape`

This should feel closer to an AI-app composer surface than a navbar search field, but it is not a chat box:

1. single-line input
2. no send action
3. no assistant framing
4. no downward autocomplete menu from the header

## Placement Rules

### Primary Surface

1. the primary search surface is the bottom-center fixed dock
2. the dock sits outside the route scroller and shell canvas
3. results render in a centered sheet that grows upward from the dock

### Left Rail

The left rail may keep lightweight search discoverability only:

1. shortcut hint
2. small trigger affordance
3. `jump to` label

Do not place a second full search field in the left rail.

### Header

Do not place the main search field in the top header. The header already owns:

1. breadcrumb
2. route title
3. minimal route actions

## Retrieval Contract

The dock must follow the canonical retrieval strategy:

1. compiled state first
2. exact match first
3. canonical over supporting
4. active over historical
5. same-scope over adjacent-scope
6. fresher over stale
7. semantic fallback only after exact, linked, and compact indexed retrieval fail

The dock is a resolver and navigator first, not a broad semantic assistant.

## Search Sources

The initial search surface should resolve:

1. routed pages such as `overview`, `trust`, `proof`, and `activity`
2. scopes
3. docs
4. plans
5. missions
6. decisions
7. findings
8. activity entrypoints
9. graph entrypoints

Do not search raw workspace files directly as the default path.

## Result Taxonomy

Results should be grouped instead of rendered as one flat list:

1. `Jump`
2. `Docs`
3. `Work`
4. `Validation`
5. `Structure`
6. `Activity`
7. `Graphs`

Each result row should show:

1. title
2. kind
3. compact supporting context
4. optional scope, status, or destination hint

## Query Model

Support plain-language search first:

1. `runtime model`
2. `active ui mission`
3. `trust closure`
4. `architecture artifact`

Support optional structured filters without forcing them:

1. `scope:ui`
2. `doc:runtime-model`
3. `mission:active`
4. `plan:current`
5. `kind:decision`
6. `route:proof`

If one result is a strong exact match, `Enter` should navigate directly.

## Search Entry Contract

Search entries should come from compact compiled state and should be reusable by both the UI and agent-facing query flows.

The entry model should support fields such as:

1. `id`
2. `kind`
3. `title`
4. `aliases`
5. `scope`
6. `route`
7. `status`
8. `updatedAt`
9. `keywords`
10. `summary`
11. `excerpt`
12. `canonical`
13. `historical`
14. `stale`

Later phases may add headings or section-level matches for docs.

## Desktop And Narrow Layout Behavior

### Desktop

1. centered floating dock
2. width constrained to a comfortable command surface
3. upward results sheet with its own scroll

### Narrow Layouts

1. wider bottom sheet treatment
2. preserve the same mental model
3. avoid tiny floating chrome that competes with the main route canvas

## Non-Goals

1. do not build raw repo grep into the primary UI search path
2. do not make semantic or vector search the default behavior
3. do not make search the canonical source of truth instead of compiled artifacts
4. do not force graph-heavy search results into the default result list
5. do not duplicate the main search surface in the header and the rail

## Implementation Plan

### Phase 1: Command Dock And Compiled-State Search

1. add the bottom-center fixed dock
2. search the existing compiled console state in the browser
3. group results by object family
4. support keyboard navigation and direct route open
5. keep ranking exact-first and canonical-first

### Phase 2: Dedicated Search Index

1. add a compiled search artifact or equivalent generated search surface
2. include aliases, keywords, headings, summaries, and route metadata
3. improve body and heading matches without falling back to raw repo scans

### Phase 3: Optional Semantic Fallback

1. only add semantic retrieval after the compiled exact-first path is solid
2. keep semantic results visibly lower-confidence than exact canonical hits
3. never let semantic fallback replace canonical compiled navigation

## Consequences

### Positive

1. humans get one stable workspace-wide jump surface
2. the shell stays cleaner because search is not fighting the rail and header
3. agents and humans can converge on the same compact search-entry contract
4. the UI stays aligned with Skopos exact-first retrieval instead of drifting into generic docs search

### Costs

1. the UI needs a real overlay interaction model
2. ranking and grouping logic must be explicit
3. later phases need a durable compiled search-entry surface

## Next Action

Phase 1 and Phase 2 are now implemented.

Next search work, if needed, should stay smaller:

1. tune ranking against live use before adding more search chrome
2. keep the generated search index stable as the default data source
3. consider recent searches, result previews, or section-jump affordances only if they materially improve exact-first retrieval
4. reserve semantic fallback for a later decision once the compiled exact-first surface has proven stable in real use
