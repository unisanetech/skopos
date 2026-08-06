---
title: Unisane UI Visual Ownership Drift
status: resolved
severity: MUST
owner: skopos-core
id: SKOPOS-F-20260804-UNISANE-UI-VISUAL-OWNERSHIP-DRIFT
scope: skopos-ui
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-04
relatedDocs:
  - ../../architecture/00-architecture.md
  - ../../decisions/D-20260804-unisane-ui-visual-ownership.md
  - ../../decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md
  - ../../work/archive/P-20260804-human-first-ui-convergence.md
---

# Unisane UI Visual Ownership Drift

## Summary

Skopos source-installed initial Unisane components but continued to impose a separate
application palette, typography scale, surface model, radii, shell, mobile drawer, and
search control. The integration reused component markup without accepting the design
system as the visual authority.

## Evidence

The 2026-08-04 source and live review found:

1. `styles.css` declared parallel beige, green, status, surface, text, and outline
   variables after the managed Unisane baseline
2. a global selector changed Unisane radii with `!important`
3. the root shell reimplemented desktop navigation and a mobile modal drawer
4. the floating search dock reimplemented field, result-list, surface, and overlay
   behavior
5. custom wrappers overrode Card and Badge backgrounds, borders, shapes, and tones
6. the document forced light mode even though the managed baseline supports system
   light and dark modes
7. Material Symbols source was used without the font dependency loaded by other
   Unisane platforms

## Impact

1. Skopos looked visually separate from the polished Unisane platform family
2. dark mode and future theme changes could not be trusted
3. accessibility and responsive shell behavior had duplicate owners
4. registry upgrades could not improve visible behavior without manual reconciliation
5. application CSS and custom component maintenance remained unnecessarily large

## Resolution Criteria

1. no parallel Skopos palette or blanket component override remains in the routed app
2. the shell uses registry-installed Sidebar and Top App Bar components
3. search uses registry-installed Dialog, Search Bar, List, Badge, Icon, and Typography
4. shared content and inspector patterns compose Unisane defaults without restyling
   them
5. custom CSS is limited to product layout, document, artifact, Mermaid, and scroll
   behavior and uses semantic tokens
6. system light and dark modes both render coherently
7. focused tests, typecheck, production build, and live desktop/mobile interaction
   inspection pass

## Resolution

Task `T-330b4a08` source-installed the complete routed-shell and shared-content
primitive set, replaced the custom shell and floating search implementation, removed
the parallel visual tokens and shape overrides, normalized view styling to Unisane
semantic utilities, and loaded the declared Material Symbols dependency. The
application stylesheet fell from about 1,360 lines to about 526 lines; the remaining
rules are bounded to Skopos-specific layout and content rendering.

Focused proof passed for 13 UI tests, UI typecheck, production application build,
desktop and compact rendering, mobile drawer behavior, search Dialog behavior, and
system dark mode.

## Changelog

- `2026-08-04`: Resolved through full routed-console visual ownership convergence and
  focused live proof.
- `2026-08-04`: Opened after the source-installed components were found beneath a
  parallel Skopos visual system.
