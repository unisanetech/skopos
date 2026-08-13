---
title: Browser History And Unisane UI Registry Delivery
status: accepted
owner: skopos-core
id: SKOPOS-D-20260804-BROWSER-HISTORY-AND-UNISANE-UI-REGISTRY-DELIVERY
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
  - ../findings/archive/F-20260804-url-and-shared-ui-delivery-drift.md
  - ../work/archive/P-20260804-human-first-ui-convergence.md
  - D-20260812-locally-owned-ui-source-and-visual-authority.md
  - D-20260804-human-first-supervision-projection.md
  - D-20260804-unisane-ui-visual-ownership.md
---

# Browser History And Unisane UI Registry Delivery

## Changelog

- `2026-08-13`: Demoted this superseded Unisane delivery boundary to a historical,
  supporting transition record after Skopos adopted locally owned UI source and visual
  authority.

## Context

The first human-first console delivery retained hash navigation and deferred shared UI
adoption. That kept the initial Task bounded, but it left two visible product gaps:
routes were encoded after `#`, and Skopos did not consume the independently installable
Unisane UI registry that now exists for external projects.

Skopos is an independent project. It must not depend on private Unisane workspace
packages or make the Unisane monorepo part of its runtime resolution.

## Decision

### Canonical routes use browser history

The console uses pathname routes such as `/overview`, `/tasks/:taskId`, and
`/readiness`. Navigation, search results, document links, copied destinations, browser
back/forward behavior, and direct requests use those same paths without hash fragments.

All destinations inside the console use one router-aware application-link owner.
Sidebar links, search results, previous/next document controls, and internal Markdown
links therefore update browser history without replacing the mounted application
shell. External URLs, downloads, and in-page anchors keep native browser navigation.

Development and built console servers return the application entrypoint for unknown
non-file paths. Production assets are rooted at `/`, so a directly requested nested
route loads the same application as `/`. The canonical way to inspect a built snapshot
is `skopos ui serve`; direct `file://` opening is not a supported routing mode.

### External Unisane UI consumption is source-owned

Skopos consumes Unisane UI through `unisane ui init` and `unisane ui add`. Installed
components, transitive support, semantic theme CSS, and `unisane-ui.json` live inside
`@skopos/ui` and are owned by Skopos after installation.

Skopos does not add `@unisane/ui`, `@unisane/tokens`, or another private Unisane
workspace package as an application runtime dependency. Registry-required public npm
dependencies are declared normally by `@skopos/ui`.

### Product patterns remain Skopos-owned

Registry components own reusable control and surface behavior. The successor visual
ownership Decision makes their semantic defaults authoritative for palette,
typography, shape, elevation, motion, states, theming, and accessibility. Skopos
patterns own the supervision hierarchy, wording, route composition, application state,
and product-specific document, artifact, diagram, and split-pane behavior. They do not
restyle a registry primitive into a second visual system.

One component has one delivery owner. Skopos does not mix source-installed components
with `@unisane/ui/*` runtime imports.

## Consequences

1. links are shareable and readable as ordinary application URLs
2. deep-link serving is part of dev and built-server verification
3. built snapshots require the supported local server for routed navigation
4. installed source can be reviewed, changed, and released with Skopos
5. registry upgrades use the Unisane UI diff/add workflow and remain explicit changes
6. Skopos keeps independent package and release authority
7. internal document transitions preserve shell state, scroll ownership, and focus
   continuity instead of reloading the complete application

## Rejected Alternatives

### Retain hash routing for static-file convenience

Rejected because it makes a primary application feel like an embedded document,
weakens route sharing, and diverges from the accepted Ops console direction.

### Depend directly on the Unisane UI workspace package

Rejected because Skopos is external to that workspace and must remain independently
installable and releasable.

### Copy visual styles without installing registry owners

Rejected because it would imitate the design system while losing its component,
dependency, theme, and upgrade contracts.

## Changelog

- `2026-08-04`: Required all internal document navigation surfaces to use the routed
  application-link owner while external, download, and in-page destinations remain
  native.
- `2026-08-04`: Clarified and verified that CLI packaging rebuilds and copies the
  current routed application so browser-history behavior and source-installed UI
  fixes cannot be hidden by an older bundled frontend.
- `2026-08-04`: Clarified source delivery with the implemented successor rule that
  Unisane defaults own reusable visual behavior while Skopos owns product composition.
- `2026-08-04`: Accepted and implemented clean pathname routing plus source-owned
  Unisane UI registry delivery.
