---
title: "Decision: System UI Discussion Context And Sidebar Information Architecture"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-025
scope: skopos
role: decision
lifecycle: historical
authority: canonical
provenance: accepted
view: transition
date: 2026-04-13
relatedDocs:
  - ../work/archive/P-11229565-system-ui.md
  - ../work/archive/P-37fa9180-prototype-roadmap.md
  - ../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - ../scopes/skopos-ui/overview.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - 011-system-ui-navigation-and-knowledge-routing.md
  - 021-discussion-memory-checkpoints-and-handoff-contract.md
  - 023-supervision-cost-and-workflow-weight-discipline.md
---

# Decision: System UI Discussion Context And Sidebar Information Architecture

## Changelog

- `2026-04-13`: Simplified the `Discussion` route again. The route remains in the sidebar and still owns compiled handoff plus checkpoint history, but the app no longer renders raw conversation journals there because that inspection surface added workflow weight without enough core value.
- `2026-04-13`: Promoted `Discussion` into the sidebar under `Work` after the routed handoff plus checkpoint history surface proved useful enough to justify first-class navigation; search remains a fast jump path, but discussion is no longer hidden behind search-only discovery.
- `2026-04-13`: Refined the search-first `/discussion` route so checkpoint cards now show promotion trigger and semantic change kinds, making the route a real rationale-browsing surface instead of only a second copy of the latest summary.
- `2026-04-13`: Added a search-first `/discussion` route that browses the latest handoff plus checkpoint history without promoting discussion into the sidebar, so phase 1 now has a dedicated routed surface while the left rail stays unchanged.
- `2026-04-13`: Landed the second phase-1 discussion-context slice, so the routed console now loads recent checkpoint history alongside the latest handoff in `overview`, `mission detail`, and the search dock while still deferring any dedicated `Discussion` route.
- `2026-04-13`: Landed the first phase-1 discussion-context UI slice, so the routed console now projects the latest workflow handoff into `overview`, `mission detail`, and the search dock while still deferring any dedicated `Discussion` route.
- `2026-04-13`: Added the first explicit UI information-architecture contract for discussion context and sidebar organization so discussion-memory artifacts land in high-value workflow surfaces before Skopos adds a dedicated discussion route.

## Context

Skopos now has discussion-memory artifacts, program state, and workflow-router state, but the routed console still exposes only part of that system. Recent discussion context is not visible in the app, and the sidebar contract does not yet say how future discussion surfaces should fit into the existing route hierarchy.

Without a clearer information architecture, the next UI batch risks adding a shallow `Discussion` page too early, duplicating navigation surface, and increasing workflow weight instead of reducing supervision cost.

## Decision

Adopt a two-stage discussion-context UI model:

1. phase 1 embeds discussion context into existing high-value workflow routes
2. once the embedded surfaces and routed history prove useful enough, promote discussion into a first-class `Work` route

Keep the sidebar workflow-shaped rather than artifact-shaped. `Discussion` is now allowed as a first-class `Work` destination because it carries real workflow history, accepted-direction rationale, and checkpoint browsing value rather than acting as a thin artifact wrapper.

## Sidebar Model

The left rail remains grouped around user workflow:

1. `Overview`
2. `Execution`
   - `Missions`
   - `Plans`
   - `Discussion`
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

Rules:

1. keep `Overview` first
2. keep active work before validation and knowledge
3. keep `Trust` and `Proof` adjacent
4. keep canonical knowledge surfaces grouped together
5. keep `Scopes` last as structural support context
6. do not add routes to the rail only because artifacts now exist on disk

## Discussion-Context Placement

### Overview

Add a compact `Recent discussion` section that answers:

1. what direction was accepted recently
2. what changed
3. what still needs attention

This should favor the latest handoff and the most recent relevant checkpoint. It should not become a timeline dump.

### Mission Detail

Add a `Discussion context` section near the main execution guidance. It should show:

1. why this mission exists
2. latest accepted direction
3. open discussion-derived questions
4. recent checkpoint changes when they materially affect the mission

This is the primary phase-1 discussion surface.

### Search And Command Dock

Search should return:

1. latest handoff
2. recent checkpoints
3. discussion-derived open questions
4. mission-linked discussion context

Search remains the fastest direct jump surface for specific discussion artifacts even though `Discussion` now has a visible sidebar destination.

### Trust

Trust may reference discussion state only when it affects closure or continuity confidence, such as:

1. missing handoff
2. over-budget resume state
3. unresolved discussion-derived blockers

Trust must not become a discussion timeline view.

## Dedicated Discussion Route Gate

Promote `Discussion` into the sidebar only when all of the following are true:

1. phase-1 embedded discussion context is implemented
2. checkpoints exist as more than a single latest-handoff summary
3. users need to inspect superseded directions or a checkpoint sequence directly
4. the route adds navigation value beyond `Overview`, `Mission detail`, and search

If those conditions are not met, a top-level discussion route adds ceremony without reducing supervision cost.

The current shipped posture is:

1. `/discussion` exists as a first-class routed page
2. the sidebar includes `Discussion` under `Work`
3. search results also jump there directly for handoffs and checkpoints
4. discussion remains workflow-shaped support context, not a transcript dump

## Data Contract For Phase 1

The routed console should project only compact discussion surfaces by default:

1. latest handoff summary
2. a small number of recent active checkpoints
3. linked mission or program ids
4. compact open-question summaries

Do not default to:

1. raw turn journals
2. large checkpoint history
3. transcript-like sequences

The dedicated `/discussion` route may additionally expose one secondary raw-journal lane for the latest active thread:

1. latest captured user and assistant turns only
2. capped recent window, not an unbounded transcript
3. explicitly secondary to compiled handoffs and checkpoints

## Consequences

### Positive

1. discussion memory becomes visible where it helps active work
2. the sidebar stays stable and product-like
3. search remains the fast jump surface for recent context
4. phase-1 UI can ship without inventing a parallel discussion product

### Costs

1. mission detail and overview need new projected discussion state
2. search indexing must add handoff and checkpoint entries
3. a future discussion route still needs a later gate decision if usage grows

## Next Action

Implement in this order:

1. project discussion handoff and compact checkpoint state into console state
2. add `Recent discussion` to `overview`
3. add `Discussion context` to `mission detail`
4. add handoff and checkpoint results to the search dock
5. after those surfaces prove useful, keep `Discussion` in the sidebar and refine it as the primary rationale-history route

Current decision after the checkpoint-history slice and sidebar promotion:

1. keep discussion embedded in `overview`, `mission detail`, and search
2. keep `/discussion` as the route for sequence-level browsing and superseded-direction history
3. keep `Discussion` visible in the sidebar under `Work`
