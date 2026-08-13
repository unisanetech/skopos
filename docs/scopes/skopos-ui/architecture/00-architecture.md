---
title: Skopos UI Architecture
status: active
owner: skopos-core
id: SKOPOS-UI-ARCHITECTURE
scope: skopos-ui
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-12
relatedDocs:
  - ../overview.md
  - ../decisions/D-20260804-human-first-supervision-projection.md
  - ../decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md
  - ../decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md
  - ../decisions/D-20260804-unisane-ui-visual-ownership.md
  - ../../../architecture/00-architecture.md
  - ../../../architecture/evidence-and-readiness-model.md
  - ../../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
reviewCycle: when UI state ownership or runtime projection changes
---

# Skopos UI Architecture

## Purpose

`@skopos/ui` is the read-only human supervision application over canonical Skopos
Project Memory and runtime state. It helps a developer understand the Project, the
current work, the decision or safe action now, and the proof required to continue or
close. It does not own workflow mutation.

## Data Flow

```text
Skopos model and runtime authorities
  -> buildSkoposUiConsoleState
    -> bounded console-state contract
      -> route-family selectors
        -> screens and shared supervision patterns
```

The application layer loads canonical artifacts and calls read-only runtime owners.
Selectors derive presentation-specific grouping and language. Screens render those
projections. Components do not read `.skopos/**` or project documents directly.

## Canonical Current State

Now consumes `buildSkoposSessionContextRuntime` in dry-run mode. The projection may
show:

1. pending Decision
2. interrupted Action and resume command
3. actor-specific current Task and next step
4. recommended Work Queue entry
5. adoption state and next command

The UI does not guess an actor when several active Tasks exist. Without an
actor-specific Session selection it reports that no Session Task is selected and
shows active Work separately.

Now is a selected briefing rather than a roll-up dashboard. Its primary guidance owns
the current consequence and safe handoff; current focus shows the selected Task or a
small active-work fallback. Current discussion appears only when bound to that Task,
and attention appears only for real warnings. Plans, adapter support, general proof,
stale discussion, and empty status panels remain on their owning routes. Decision
copy distinguishes blocking requests from non-blocking recommendations.

In live mode, the dev server watches the authoritative `docs/`, `.skopos/`, registered
Action, instruction, and configuration roots recursively. A relevant mutation rebuilds
the bounded console state and notifies the routed client. Directory ownership is
watched directly rather than through glob-shaped file paths so nested Task identities
and new worktrees cannot remain stale in an already-open console.

## Task Projection

Task detail reads the canonical `SkoposTaskArtifact` and presents:

1. goal, state, Scope, risk, and detail
2. acceptance criteria, non-goals, and constraints
3. declared ownership and coordination
4. selected Actions and Guards
5. Evidence requirements and Memory obligations
6. `task-closure` or `project-integration` proof subject
7. canonical verify and finish commands

Detail is ordered for supervision. Raw artifact paths and generated state remain
secondary.

The queue and Task detail lead with active work. Help, contract metadata, discussion,
and linked work follow the current step and checklist. Completed Task mutations are
therefore reflected by the canonical Task artifact rather than retained as a stale
active projection.

## Knowledge Projection

Project Knowledge has two explicit layers:

1. human understanding from reviewed project purpose, architecture areas, Scopes,
   Decisions, Findings, and constraints
2. Memory diagnostics for mappings, coverage, freshness, generated paths, and agent
   communication projections

The first layer teaches the Project. The second helps diagnose retrieval quality.

## Project Map Projection

Project Map joins four existing authorities into one bounded Scope view:

1. the Scope registry supplies stable identity, kind, parent, paths, owners, aliases,
   profile, and declared dependencies
2. the canonical Scope overview supplies purpose, responsibilities, commands, and
   working rules
3. the document catalog supplies directly routed related knowledge
4. Plans and Tasks supply current work without becoming Scope authority

Reverse dependents are derived from declared `dependsOn` relationships. The console
state performs this join once; screens do not read files, infer package semantics, or
carry package-name lookup tables. If no canonical overview exists, the page states
that the boundary is declared but detailed explanation is missing.

## Readiness Projection

The existing Project Readiness artifact is presented as adoption readiness. Task
continuation, Task closure, and Project integration remain distinct subjects and are
never implied by the adoption result. Task-local closure is determined through the
canonical verify and finish authorities.

## Navigation And Shell

Primary route families are:

1. Now
2. Work
3. Knowledge
4. Readiness
5. Activity

Deep canonical routes remain available inside those families. The locally owned
Sidebar owns the collapsible desktop drawer, compact overlay, focus, Escape,
scroll lock, and responsive transition behavior. A compact Search Bar occupies
the outer shell strip above the inset application surface on desktop with the same quiet
outline token as the inset, a contrasting surface fill, and left alignment to the inset edge, while the
Top App Bar owns route context and the navigation trigger. Mobile keeps an
accessible search icon in that Top App Bar. Both search entries open the same canonical
project-search Dialog; the sidebar carries no duplicate search control. Route context
is presented as a compact breadcrumb from the
owning navigation family through the current record, with internal ancestors using
canonical router links. The contextual inspector remains a Skopos application-layout
concern.

The expanded drawer renders the complete five-family tree. Group disclosure state is
visible, while the selected surface belongs only to the exact leaf route. The
collapsed drawer renders the five primary families with their canonical icons; group
activation expands the drawer to reveal children without changing the route. Drawer
brand content, the outer search strip, and the inset Top App Bar use one compact shell
rhythm without placing global search inside record context.

Routes use browser-history pathnames rather than hash fragments. Dev and built console
servers return the application entrypoint for nested routes. Sidebar destinations,
search results, document previous/next controls, and internal Markdown links use one
router-aware application-link owner so navigation updates history without replacing
the mounted shell. External URLs, downloads, and in-page anchors retain native browser
behavior. Built snapshots are inspected through
`skopos ui serve`, which owns the deep-link fallback.

Search is a global read-only resolver presented through locally owned Dialog, Search Bar,
List, Badge, Icon, and Typography primitives. The complete command surface is mounted
only while open so hidden controls do not remain in the accessibility tree. The query
field receives initial focus, every navigation action has an explicit accessible name,
and Markdown frontmatter is excluded from reader and search summaries.

The production application bundle and the CLI-owned `ui-app` copy are one delivery
contract. CLI packaging rebuilds and copies the current routed application; live or
release verification must not certify a fresh state compiler against stale frontend
assets.

## Authority Boundary

The UI may:

1. load and explain canonical state
2. link to canonical routes and source documents
3. show, copy, or hand off exact canonical commands

The UI may not create a parallel Task, approval, mutation, coordination, Evidence, or
Readiness engine. All effects continue through canonical CLI, MCP, and runtime owners.

## Shared UI Boundary

Skopos owns product language, supervision hierarchy, route composition, document and
artifact presentation, and application-specific layout. Reusable visual behavior is
reviewed as local Skopos source together with one managed semantic CSS baseline. Local
defaults own palette, typography, radii,
elevation, motion, state layers, and shared component behavior. Skopos may not place a
parallel visual system or sweeping override above those defaults.

Installed source is Skopos-owned and reviewed in the same repository. Private external
workspace packages are not Skopos runtime dependencies, and source provenance does not
grant another product runtime, release, or visual authority.

The console keeps one restrained typography hierarchy: `pageTitle` for the route
heading, `titleLarge` for primary content sections, `titleMedium` for nested groups,
and `titleSmall` or label roles for items. Page composition does not override managed
font weights or tracking. This keeps section headings clearly subordinate to the page
title and prevents metadata or item labels from appearing heavier than either.

The inspector is a secondary reading rail, not a stack of dashboard cards. Its shared
shell owns compact outer breathing room and an inset rounded surface rather than a
full-height structural wall. The rail uses the standard surface without an outer
outline or elevation. Inspector Accordion composition removes child boxes and uses
simple section dividers. Summary and disclosure content share one horizontal inset and
a restrained title-to-label hierarchy. It can be collapsed or restored with
an accessible local Icon Button and
persists that preference across routed records. The primary reading scrollbar remains
functional but visually hidden so it does not compete with the panel boundary. Open
summaries sit directly on the rail surface, optional detail keeps the default Accordion
treatment, and shared key-value rows constrain both columns so values cannot widen or
clip the rail.
Project-owned absolute paths are displayed from their canonical repository marker,
with the complete path retained as supporting metadata.

## Changelog

- `2026-08-12`: Replaced external visual authority with reviewed, locally owned Skopos
  component source and preserved origin only in historical provenance records.
- `2026-08-04`: Moved desktop global search into the outer shell strip above the inset
  application surface while preserving the mobile Top App Bar entry and canonical
  search Dialog.
- `2026-08-04`: Added route-aware inset-header breadcrumbs and a persistent,
  collapsible rounded inspector with no outer outline or shadow, aligned content, and
  divider-only child sections.
- `2026-08-04`: Unified internal document and Markdown navigation behind the routed
  application-link owner so the shell persists across browser-history transitions.
- `2026-08-04`: Defined the compact, border-light inspector composition and bounded
  path/value presentation shared by all routed pages.
- `2026-08-04`: Added the canonical dense-console type hierarchy and prohibited local
  page-level weight and tracking overrides.
- `2026-08-04`: Clarified expanded and collapsed sidebar projection, exact-route
  selection, disclosure behavior, and shell-header alignment.
- `2026-08-04`: Made Now a selected, truthful current-state briefing and excluded
  unrelated dashboard inventory from its projection.
- `2026-08-04`: Added the data-driven Project Map projection over canonical Scope,
  Memory, dependency, document, and current-work authorities.
- `2026-08-04`: Made recursive authoritative-state refresh, CLI/frontend bundle parity,
  search focus, named navigation, frontmatter-free summaries, and work-first page
  hierarchy explicit after live regression verification.
- `2026-08-04`: Replaced the parallel visual system and custom shell with the
  source-installed Unisane default ownership and Ops-style application structure.
- `2026-08-04`: Added canonical browser-history routes, deep-link server fallback, and
  the implemented external Unisane UI registry boundary.
- `2026-08-04`: Declared the implemented human-first supervision projection, current
  data flow, Readiness subjects, responsive shell, and authority boundary.
