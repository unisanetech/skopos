---
title: "Decision: System UI App-Shell And Layout Doctrine"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-009
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
  - ../D-20260804-unisane-ui-visual-ownership.md
  - ../../../../work/archive/P-11229565-system-ui.md
  - ../../../../work/archive/P-37fa9180-prototype-roadmap.md
  - ../../../../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - ../../overview.md
  - ../008-system-ui-routed-app-stack.md
---

# Decision: System UI App-Shell And Layout Doctrine

> Historical contract. The human-first supervision and Unisane visual-ownership Decisions supersede this shell and layout authority.

## Context

The routed console stack is now correct, but the current layout still reads like a centered web page with side boxes rather than a desktop-grade operational app. The next UI batch needs a stronger shell doctrine so route work does not drift into isolated tweaks.

## Decision

Adopt a three-zone desktop app shell with an inset content rail:

1. a full-height, full-bleed left rail for workspace framing and primary navigation
2. an inset header plus content rail for readable center-pane work
3. a sticky contextual right pane for properties, evidence, freshness, ownership, and proof/trust support

The width constraint must apply to the inner content rail, not the outer app shell.

## Layout Doctrine

### 1. Shell Geometry

1. Left rail stays flush to the viewport edge on desktop.
2. Left rail owns primary navigation and scrolls independently.
3. Main content is the primary scroll surface.
4. Right pane stays sticky inside the main content scroll area on desktop.
5. Header and routed content share the same inner inset width.
6. The inner content rail should read closer to `5xl`/`6xl` content width than a full-page web layout.

### 2. Pane Behavior

1. Desktop routes should feel pane-based, not page-stacked.
2. Right-pane content should be contextual and secondary, not another duplicate page body.
3. Mobile and smaller tablet views should collapse back to a stacked flow.
4. Sticky behavior should never fight the header or viewport height; it should stay inside the routed content area.

### 3. Surface Discipline

1. Prefer one outer panel boundary with quiet inner sections.
2. Avoid border-on-border-on-border nesting by default.
3. Use dividers, spacing, and background contrast before adding more boxes.
4. Keep radii near-square and restrained.
5. Keep shadows effectively absent except for true overlay surfaces if needed later.

### 4. Typography Doctrine

1. Page titles should be prominent but smaller than the current oversized shell titles.
2. Panel titles should be compact and strong.
3. Default body copy should sit in the `13px` to `14px` range with comfortable line height.
4. Metadata, timestamps, and support text should sit in the `11px` to `12px` range.
5. The type scale should be narrow and deliberate, not broad and marketing-like.

## Route Families

### 1. Overview

1. Summary-first review surface.
2. Compact hero, metrics, and high-signal modules.
3. Right pane carries state summary, attention, and shortcuts.

### 2. List Review

Used for:

1. `missions`
2. `scopes`
3. `docs` index

Rules:

1. Main pane emphasizes rows/cards with strong scanability.
2. Right pane carries list posture, filters, summary counts, or recent related items.
3. List rows should feel closer to app rows than cards on a landing page.

### 3. Detail Review

Used for:

1. `mission detail`
2. `scope detail`
3. `docs detail`

Rules:

1. Main pane behaves like a readable working document or review surface.
2. Right pane stays sticky and holds properties, freshness, evidence, related links, and compact outline/support data.
3. The center body should have stronger narrative flow and fewer interruptions.

### 4. Evidence Review

Used for:

1. `trust`
2. `proof`

Rules:

1. Main pane should separate signal, evidence, and machine detail clearly.
2. Right pane should keep status summary and supporting links fixed while the center review surface scrolls.
3. Category and finding groups should read like audit/review modules, not dashboard cards.

### 5. Activity

1. Main pane should feel like a timeline/review feed.
2. Right pane should carry summary counts and the latest event context.

## Navigation Strategy

1. Left rail owns major route families only.
2. In-route secondary navigation should live inside the route body, not the global shell.
3. The header should stay minimal:
   - breadcrumb
   - view title
   - short description
   - a small number of high-value actions
4. Route changes must feel like route changes, not anchor jumps or tab hacks.

## Consequences

### Positive

1. The app will read more like a desktop operational tool.
2. The center pane will become easier to scan and read.
3. The right pane will become meaningfully contextual instead of decorative.
4. Route families can diverge in layout while staying inside one coherent shell.

### Costs

1. More route-specific layout work is required.
2. Shared layout primitives must become stricter.
3. Some current card-heavy route modules will need to be simplified or rewritten.

## Next Action

Apply this doctrine through the system UI plan and use it as the constraint for the next UI implementation batch:

1. shell geometry and layout primitives
2. typography and spacing tokens
3. route-family conversion
4. final polish and consistency pass
