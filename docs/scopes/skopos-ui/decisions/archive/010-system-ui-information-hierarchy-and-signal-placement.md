---
title: "Decision: System UI Information Hierarchy And Signal Placement"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-010
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
---

# Decision: System UI Information Hierarchy And Signal Placement

> Historical contract. The human-first supervision Decision supersedes this route and signal-placement authority.

## Context

The routed console stack and shell geometry are now good enough to reveal the next real problem: the UI is still too artifact-shaped. The center pane still shows machine summaries, duplicated state, and low-value counts. The right pane still carries raw paths, ids, and repeated shortcuts instead of acting like a compact contextual inspector.

Without an explicit information-hierarchy doctrine, route work will keep drifting into local fixes rather than producing a human-facing operational console.

## Decision

Adopt an explicit signal-placement contract for the routed UI:

1. the center pane owns `primary` and `supporting` information
2. the right pane owns `supporting` and a small amount of `diagnostic` information
3. `raw` information must never be default-primary
4. route families must decide what is primary based on what a human came to understand or decide, not on what data exists in `.skopos/**`

## Information Levels

### 1. Primary

Use for:

1. the main narrative of the route
2. the decision, action, or review surface a human came to inspect

Examples:

1. active mission objective and checklist
2. trust blockers and readiness reasons
3. proof regressions and must-win failures
4. timeline events on the activity route

### 2. Supporting

Use for:

1. compact context that explains the primary surface
2. small counts, linked work, freshness, and ownership data that help interpretation

Examples:

1. selected mission owner
2. compact summary counts
3. last update time
4. linked resources

### 3. Diagnostic

Use for:

1. lower-level state that may help troubleshooting
2. structural context that matters only after the primary reading surface is understood

Examples:

1. repo mode
2. archetype suggestion
3. specific artifact relationships

### 4. Raw

Use for:

1. filesystem paths
2. long ids
3. artifact filenames
4. direct generated-state handles

Raw information should be shown only through:

1. `open source`
2. `view artifact`
3. `copy id`
4. collapsible disclosure

## Placement Rules

### Center Pane

1. `primary` first
2. `supporting` second
3. avoid large metric grids unless they materially clarify the route
4. do not default to raw ids, paths, or generated-state names

### Right Pane

1. compact contextual inspector only
2. `supporting` by default
3. a small amount of `diagnostic`
4. no duplicate page-body summaries
5. no long raw values as primary content

### Sidebar

1. route families only
2. minimal global posture only
3. do not repeat route-specific status that already belongs to the center or right pane

### Header

1. breadcrumb
2. route title
3. small utility cluster only
4. no duplicated resource links if the right pane already owns them

## Default Demotions

The following are demoted by default:

1. absolute filesystem paths
2. long mission and plan ids
3. repeated trust or readiness badges across multiple panes
4. repeated resource links in both header and right pane
5. zero-value counts such as `actors: 0` or `workflow runs: 0`
6. environment or repo trivia that is not central to the route

## Route Family Consequences

### Overview

1. keep posture, active work, and attention in the center pane
2. move broad proof lists, graph counts, and low-signal totals out of the primary surface
3. keep only compact workspace posture and resources in the right pane

### Evidence Review

Used for:

1. `trust`
2. `proof`

Rules:

1. center pane leads with the interpretation and pressure points
2. right pane carries run metadata and supporting links
3. environment or scan trivia is diagnostic, not primary

### Activity

1. timeline is the primary surface
2. right pane should carry filters or selected-event context, not duplicate counts

### List Review

Used for:

1. `missions`
2. `scopes`
3. `docs` index

Rules:

1. center pane emphasizes scanability
2. right pane emphasizes filters, selection context, and compact counts

### Detail Review

Used for:

1. `mission detail`
2. `scope detail`
3. `docs detail`

Rules:

1. center pane behaves like a readable working document
2. right pane holds properties, evidence, and compact metadata
3. ids and raw source paths remain secondary and copyable

## Consequences

### Positive

1. the UI becomes more human-readable without losing machine truth
2. the right pane becomes a real inspector instead of a second dashboard
3. route work becomes easier to evaluate because each page has a clear primary story

### Costs

1. current route projections will need simplification
2. some existing summary modules will be removed or reduced
3. raw machine truth will need dedicated affordances instead of default rendering

## Next Action

Use this doctrine together with the app-shell doctrine as the constraint for the next UI batch:

1. redesign `overview`, `trust`, and `activity` first
2. then redesign `missions` and `mission detail`
3. then redesign `proof`, `scopes`, and `docs`
4. add display helpers for raw-detail disclosure, short ids, and copy or open actions
