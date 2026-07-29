---
title: "Decision: System UI Shell Refinement And Scroll Ownership"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-013
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-04-10
relatedDocs:
  - ../work/archive/P-11229565-system-ui.md
  - ../work/archive/P-37fa9180-prototype-roadmap.md
  - ../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - ../scopes/skopos-ui/overview.md
  - 009-system-ui-app-shell-and-layout-doctrine.md
  - 010-system-ui-information-hierarchy-and-signal-placement.md
  - 011-system-ui-navigation-and-knowledge-routing.md
  - 012-system-ui-dev-loop-and-hot-reload.md
---

# Decision: System UI Shell Refinement And Scroll Ownership

## Changelog

- `2026-04-10`: Implemented the accepted shell-refinement batch in `@skopos/ui`, narrowing the center reading rail, removing global header source-link buttons, adding route-owned sequence controls for knowledge detail, standardizing inspector width, clarifying shell chrome-versus-canvas backgrounds, and removing the default second inspector scrollbar.
- `2026-04-10`: Added the accepted shell-refinement doctrine for the routed console, defining the narrower center reading rail, fixed inspector width, header cleanup, shell background split, and shared-scroll ownership rules for the next UI batch.

## Context

The current routed console is structurally closer to the product direction, but it still reads too much like a dashboard:

1. the inset content rail is too wide for sustained reading
2. several routes still use equal-weight inner grids where one vertical primary lane should dominate
3. the top header still uses generic source-link buttons instead of route-owned sequence controls
4. left rail, center pane, and right inspector do not yet have the correct background separation
5. the right inspector currently behaves like a second scrolling page, which creates a double-scroll experience on desktop
6. the inspector width varies by route, which weakens shell consistency

The desired direction is closer to a quiet desktop app with:

1. a muted chrome rail on the left
2. a near-white reading lane in the center
3. a muted but stable inspector on the right
4. one primary desktop scroll for the main review surface

## Decision

Adopt a stricter three-pane shell doctrine for all routed desktop pages.

### 1. Shared Shell Geometry

Use one desktop shell structure:

1. left navigation rail
2. flexible center column
3. fixed right inspector

The right inspector width should be consistent across routed pages instead of switching between `default` and `wide`.

### 2. Narrower Center Reading Rail

Inside the flexible center column, use an inner reading rail instead of letting content expand too broadly.

Target:

1. default routed content rail: approximately `5xl`
2. document-heavy or detail-heavy routes: approximately `4xl`

The shell column stays flexible, but the actual readable content should stay constrained.

### 3. Header Ownership

The center-column header should:

1. sit outside the inset reading rail
2. own only route context and route-owned controls
3. stop showing generic source-link buttons such as `Docs start here`, `Canonical instructions`, and `Root config`

Those source links belong in the right inspector.

Use header actions for:

1. breadcrumb context
2. prev and next controls where a route has ordered sequence
3. route-local controls only

### 4. Background Split

Use a clearer shell color split:

1. left rail and right inspector share chrome-toned surfaces
2. center column uses a lighter near-white canvas
3. the inset reading rail should not visually merge with the shell chrome

### 5. Scroll Ownership

On desktop:

1. the left rail may scroll independently
2. the center column and right inspector should share one primary vertical scroll context
3. the right inspector should stay sticky inside that shared scroll context
4. the inspector should not own a second independent vertical scrollbar by default

If inspector content exceeds the available height, prefer:

1. compact inspector density
2. section prioritization
3. disclosure or collapse for low-priority sections

Do not default to a second side-rail scrollbar.

### 6. Center-Lane Density Rules

Do not use in-center two-column grids unless comparison logic genuinely requires them.

Default center-lane behavior:

1. one primary vertical reading flow
2. one section after another
3. supporting detail moved to the inspector

Keep side-by-side inner grids only for:

1. deliberate comparison modules
2. clearly paired evidence that loses meaning when stacked

## Route Consequences

### Overview

1. keep center focused on active work, attention, and recent movement
2. move summary counts and source links into the inspector
3. avoid equal-weight side-by-side review blocks unless one is clearly secondary

### Missions List

1. keep center as one queue surface
2. keep filters in the route header or just below it
3. keep counts and queue posture in the inspector

### Mission Detail

1. keep center as one workpack-reading flow
2. remove non-essential summary grids from the center
3. keep counts, ownership, validation posture, workflow pressure, and links in the inspector

### Trust

1. keep blockers, warnings, assumptions, and readiness reasoning in the center
2. move counts, source links, workspace metadata, and low-priority posture into the inspector
3. avoid side-by-side explanation grids unless comparison is truly necessary

### Proof

1. keep score drivers, regressions, and category watch in the center
2. keep score summary, baseline metadata, and source links in the inspector
3. keep comparison surfaces stacked unless a direct pairwise comparison is clearer

### Activity

1. keep timeline first
2. move recent mission movement, recent plans, and workflow evidence into the inspector
3. avoid dashboard-style side columns beside the timeline

### Plans, Docs, Decisions, Findings, Scopes

1. keep list pages as one list-review surface
2. keep detail pages as one reader/review surface
3. keep metadata, links, outline, and route support context in the inspector

## Implementation Status

Implemented:

1. reduce the center reading rail width to the new `4xl` or `5xl` targets
2. replace global top-link buttons with route-owned prev and next controls where applicable
3. standardize one inspector width across routed pages
4. move desktop scroll ownership from dual center-plus-inspector scrolling to one shared main scroll with a sticky inspector
5. remove unnecessary in-center grids from the main routed pages
