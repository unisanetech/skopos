---
title: "Decision: System UI Navigation And Knowledge Routing"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-011
scope: skopos-ui
role: decision
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
defaultVisible: false
date: 2026-04-10
relatedDocs:
  - ../D-20260804-human-first-supervision-projection.md
  - ../../../../work/archive/P-11229565-system-ui.md
  - ../../../../work/archive/P-37fa9180-prototype-roadmap.md
  - ../../../../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - ../../overview.md
  - 009-system-ui-app-shell-and-layout-doctrine.md
  - 010-system-ui-information-hierarchy-and-signal-placement.md
---

# Decision: System UI Navigation And Knowledge Routing

> Historical contract. The human-first supervision Decision supersedes this navigation and route-family authority.

## Context

The routed console now has the right shell direction, but the navigation model is still incomplete. Important durable knowledge such as plans, decisions, and findings is not visible as first-class product surface. The left rail also risks becoming cluttered if it mixes workspace trivia, route navigation, filters, and raw counts.

Without a navigation doctrine, the UI will remain route-fragmented and important knowledge will stay buried behind artifact links.

## Decision

Adopt a clean grouped left-rail model and make plans, decisions, and findings first-class routed surfaces.

The left rail should stay focused on route families and minimal global posture. Route-local filters, sequence navigation, and heavy metadata should live inside the route body or the right inspector.

## Left-Rail Model

### Top Section

1. workspace identity
2. search or jump entry

Do not lead with:

1. absolute filesystem paths
2. raw artifact counts
3. route-specific summaries

### Primary Groups

1. `Overview`
2. `Work`
   - `Missions`
   - `Plans`
   - `Activity`
3. `Validation`
   - `Trust`
   - `Proof`
4. `Knowledge`
   - `Docs`
   - `Decisions`
   - `Findings`
5. `Structure`
   - `Scopes`

### Footer

1. readiness
2. trust
3. active missions

This footer should stay compact and global. It should not become a mini-dashboard.

## Missing Knowledge Surfaces

The following must become first-class routes:

1. plans
2. decisions
3. findings

These are important because they explain:

1. what the system is trying to do
2. what constraints are accepted
3. what known gaps or failures are still active

## Route Additions

1. `/plans`
2. `/plans/:planId`
3. `/decisions`
4. `/decisions/:decisionId`
5. `/findings`
6. `/findings/:findingId`

## Navigation Placement Rules

### Global Left Rail

Use for:

1. major route families
2. top-level product orientation

Do not use for:

1. list filters
2. local tabs
3. prev or next controls
4. per-route summary statistics

### Header

Use for:

1. breadcrumb
2. route title
3. a small number of route actions

Do not use for:

1. duplicate resource links already present in the inspector
2. generic global prev and next entity navigation

### Right Inspector

Use for:

1. contextual supporting information
2. selected-item metadata
3. source or open links
4. compact secondary navigation when it supports the active route

Do not use for:

1. a second copy of the page body
2. long raw ids or paths as the main experience

## Prev And Next Rules

Prev and next controls should be route-owned, not shell-owned.

### Docs

1. docs detail pages get prev and next in the footer
2. the order must follow the canonical docs sequence, not filesystem order

### Decisions And Findings

1. prev and next only when opened from an ordered list context
2. the order follows the current filtered result set

### Missions And Plans

1. list-detail routing is preferred over generic prev and next controls
2. future keyboard navigation should follow the current filtered list, not global order

## Consequences

### Positive

1. important durable knowledge becomes visible in the product
2. the left rail stays clean and product-like
3. navigation becomes easier to scale as more route families mature

### Costs

1. more route projections and route components are needed
2. sequence navigation logic must become route-aware
3. some current header and inspector links will need to be removed or relocated

## Next Action

Use this doctrine in the next UI batch:

1. implement grouped left-rail navigation
2. add routed plans, decisions, and findings surfaces
3. move route-local sequence controls out of global chrome
4. keep the right inspector contextual and compact
