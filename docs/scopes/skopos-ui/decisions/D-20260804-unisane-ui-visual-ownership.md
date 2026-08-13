---
title: Unisane UI Visual Ownership
status: accepted
owner: skopos-core
id: SKOPOS-D-20260804-UNISANE-UI-VISUAL-OWNERSHIP
scope: skopos-ui
role: decision
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
defaultVisible: false
date: 2026-08-04
implementationStatus: implemented
lastUpdated: 2026-08-13
relatedDocs:
  - ../architecture/00-architecture.md
  - ../findings/archive/F-20260804-unisane-ui-visual-ownership-drift.md
  - ../work/archive/P-20260804-human-first-ui-convergence.md
  - D-20260812-locally-owned-ui-source-and-visual-authority.md
  - D-20260804-human-first-supervision-projection.md
---

# Unisane UI Visual Ownership

## Changelog

- `2026-08-13`: Demoted this superseded Unisane visual-ownership boundary to a
  historical, supporting transition record after Skopos adopted locally owned UI
  source and visual authority.

## Context

Skopos had correctly installed Button, Badge, Card, and the managed Unisane semantic
baseline, but the application still wrapped them in a parallel visual system. A large
Skopos stylesheet supplied its own palette, typography scale, radii, surface rules,
mobile drawer, icon buttons, and floating search shell. Some selectors used
`!important` to override Unisane component shape.

That integration satisfied source delivery but not design-system ownership. It made
the visible console harder to theme, maintain, and upgrade, and it continued the
machine-shaped dashboard appearance the human-first redesign was intended to remove.

## Decision

### Unisane owns visual defaults

The managed Unisane theme and source-installed registry components are authoritative
for:

1. semantic color roles and light/dark modes
2. typography roles and scale
3. radii, elevation, spacing, motion, and state layers
4. focus, disabled, selected, hover, overlay, and responsive component behavior
5. reusable application primitives and their accessibility contracts

Skopos does not redefine these defaults through a second palette, arbitrary type or
shape values, sweeping selectors, or `!important` overrides.

### Skopos owns product composition

Skopos owns information hierarchy, conversational wording, route composition,
project-specific state, and product-specific visualizations. Custom CSS and components
are justified only when they express a Skopos concern that is not a reusable Unisane
primitive, such as semantic document reading, artifact tables, Mermaid presentation,
or the main-and-inspector layout.

A Skopos composition may arrange Unisane components. It must not reimplement Button,
Badge, Card, List, Accordion, Alert, Search Bar, Dialog, Sidebar, Top App Bar,
Typography, or another installed primitive.

### The routed shell follows the shared platform pattern

The routed console uses the same structural pattern as the Unisane Ops console:

1. `SidebarProvider`, `Sidebar`, `SidebarDrawer`, and `SidebarInset` own navigation
2. `TopAppBar` owns the persistent route bar and mobile navigation trigger
3. the application content is a semantic `surface` inside
   `surface-container-low`
4. compact navigation uses the Sidebar overlay behavior rather than a Skopos drawer
5. search opens a Dialog containing Search Bar and List primitives rather than an
   always-visible floating dock

Skopos retains its own navigation labels and supervision hierarchy.

### Typography follows the managed role scale

Page composition uses Unisane typography roles without local weight or tracking
overrides. The application page title uses `pageTitle`; primary content sections use
`titleLarge`; nested groups use `titleMedium`; row and item titles use `titleSmall` or
the appropriate label role. Body and label roles retain their managed weight. Local
`font-semibold`, `font-bold`, tight tracking, and inherited `font-normal` corrections
are forbidden in page composition. Intentional emphasis inside prose, code, or compact
data may use `font-medium` when semantic structure alone cannot carry the distinction.

Skopos does not use the larger `sectionTitle` role for routine console sections. That
role is reserved for a future spacious editorial surface where it cannot compete with
the page title.

### The inspector is one quiet supporting rail

The contextual inspector uses the rail surface itself as its container. Primary
summary content remains open and does not add another Card surface. Optional detail
uses the default Unisane Accordion disclosure without restyling the primitive. The
rail keeps a compact inset and row rhythm, constrains key-value columns within its
width, and presents project-owned absolute paths as compact repository-relative paths
while retaining the full value as supporting title text.

The shell composes that primitive with one consistent header grid. The project mark
and Top App Bar controls share a vertical center, and navigation begins after a clear
brand-to-work gap. Expanded groups expose a visible disclosure indicator; an open
parent provides context but only the exact route receives the selected surface.
Collapsed navigation preserves the five primary destinations and their meaningful
icons. It does not flatten child routes into anonymous placeholders; activating a
group restores its expanded children while preserving the current route.

### Theme follows the managed baseline

The document does not force `.light` or `.dark`. The managed baseline follows system
preference by default and still supports an explicit theme class if a future canonical
appearance control owns it. Product CSS uses semantic `--color-*`, typography, radius,
spacing, and elevation tokens so both modes remain coherent.

### Registry delivery remains source-owned

The source-installed boundary from the browser-history and registry Decision remains
unchanged. Skopos owns reviewed local source and public npm dependencies. It does not
import private Unisane workspace packages at runtime. Registry upgrades are explicit
diffs and must preserve this Decision.

## Consequences

1. component defaults improve when the registry source is upgraded
2. light and dark modes share one semantic contract
3. application CSS becomes smaller and limited to product-specific behavior
4. shell accessibility and responsive behavior have one reusable owner
5. future UI reviews can reject a parallel palette or primitive before it spreads

## Rejected Alternatives

### Keep Unisane only as low-level markup beneath Skopos styling

Rejected because it retains two visual systems and loses the value of component
defaults, tokens, theming, motion, and accessibility ownership.

### Copy the Ops console CSS

Rejected because Skopos should reuse the same components and semantic roles, not fork
another product's application stylesheet.

### Customize the managed neutral palette for product personality

Rejected for the current product phase. Skopos personality comes from hierarchy,
wording, and workflow clarity. A future visual-brand change requires an explicit theme
Decision and must still use the managed token contract.

## Changelog

- `2026-08-04`: Simplified the shared inspector rail with compact insets, open summary
  sections, bounded values, and readable project-relative path presentation.
- `2026-08-04`: Defined the dense-console typography hierarchy and removed local
  weight and tracking overrides from page composition.
- `2026-08-04`: Defined the polished sidebar composition: aligned shell headers,
  visible disclosure state, exact-route selection, and five meaningful collapsed
  destinations.
- `2026-08-04`: Kept the refinement inside Unisane defaults: Dialog now accepts an
  explicit initial-focus owner, Search Bar forwards its input ref, navigation actions
  expose names, and application status badges use the default Badge size.
- `2026-08-04`: Accepted and implemented the Unisane-default visual ownership,
  Ops-style routed shell, semantic theme boundary, and product-only custom CSS rule.
