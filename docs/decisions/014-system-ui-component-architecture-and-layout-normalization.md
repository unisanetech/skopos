---
title: "Decision: System UI Component Architecture And Layout Normalization"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-014
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-04-11
relatedDocs:
  - ../work/archive/P-11229565-system-ui.md
  - ../work/archive/P-37fa9180-prototype-roadmap.md
  - ../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - ../scopes/skopos-ui/overview.md
  - 008-system-ui-routed-app-stack.md
  - 009-system-ui-app-shell-and-layout-doctrine.md
  - 010-system-ui-information-hierarchy-and-signal-placement.md
  - 011-system-ui-navigation-and-knowledge-routing.md
  - 013-system-ui-shell-refinement-and-scroll-ownership.md
  - 015-system-ui-markdown-rendering-and-doc-reader-pipeline.md
  - 016-system-ui-diagram-and-graph-presentation.md
---

# Decision: System UI Component Architecture And Layout Normalization

## Changelog

- `2026-04-11`: Updated the decision to record typed canonical JSON artifact pages in docs detail, so the routed knowledge surface now uses a dedicated artifact presenter path for generated JSON instead of forcing those files through the markdown reader fallback.
- `2026-04-11`: Updated the decision to record the simplified sidebar-footer batch, so the left rail now uses one compact status panel with tighter rows, smaller dock pills, and concise mission-count wording instead of a larger footer section with repeated heading chrome.
- `2026-04-11`: Updated the decision to record the sidebar-shell refinement batch, so the left rail now uses a denser brand block, tighter nav-group rhythm, smaller row padding, and a compact status dock instead of a duplicated workspace section plus stretched footer chrome.
- `2026-04-11`: Updated the decision to record the list-inspector and empty-state wording cleanup batch, so list-route support cards now use clearer inventory labels and the remaining empty or missing states now read like product guidance instead of snapshot-heavy system narration.
- `2026-04-11`: Updated the decision to record the proof-inspector and route-copy cleanup batch, so proof comparison support now uses one non-redundant summary card and the remaining screen-level route descriptions now describe workspace state instead of narrating the UI implementation.
- `2026-04-11`: Updated the decision to record the inspector-preview and route-copy cleanup batch, so the shared inspector primitives now disclose when a support list is only showing a preview and the remaining center-lane descriptions no longer narrate the UI itself instead of the workspace state.
- `2026-04-11`: Updated the decision to record the inspector-truthfulness and dead-support cleanup batch, so support badges now report real totals instead of visible slices and stale trust/proof support surfaces are no longer carried as dead exports after the center-lane hierarchy cleanup.
- `2026-04-11`: Updated the decision to record the shared inspector and list-review polish batch, so route-level filter state no longer leaks into list inspectors, empty linkage metadata no longer dominates list rows, and inspector accordions now use a calmer support-surface grammar.
- `2026-04-11`: Updated the decision to record the plan, mission, and scope detail cleanup batch, so the last major detail-route hierarchy mistakes now align with the canvas-first center lane and support-only inspector contract.
- `2026-04-11`: Updated the decision to record the proof, trust, and overview hierarchy cleanup batch, so proof and trust inventories now sit behind support disclosure and overview keeps its center lane focused on focus, attention, and small supporting movement instead of turning into a second activity surface.
- `2026-04-11`: Updated the decision to record the activity-route mixed-feed redesign, so the activity screen now keeps plans, missions, workflow runs, and grouped operational events together in one center-lane chronology instead of hiding most meaningful movement in the inspector.
- `2026-04-11`: Updated the decision to record the activity-route timeline cleanup, so repeated identical operational events now collapse into grouped timeline entries, trust activity surfaces readiness as the real outcome, and empty actor metadata no longer dominates the route.
- `2026-04-11`: Updated the decision to record the platform-layer document projection split and reader-support split, so docs link discovery, document loading, and markdown section classification now live in `application/build-console-state/document-projections.ts` while document reader entry-building and active-section scroll behavior now live in `support/knowledge/document-reader-{entries,scroll}.ts`.
- `2026-04-11`: Updated the decision to record the shared primitive and routing-policy split, where `patterns/sections/{content,inspector}/**` now own shared section primitives directly and `app/routing/route-config.ts` now owns route metadata, nav groups, and list-view normalizers.
- `2026-04-11`: Updated the decision to record the deeper knowledge feature decomposition pass, where `features/knowledge/plans/**` and `features/knowledge/documents/**` now split list, detail, reader, inspector, and sequence ownership across smaller route-family modules.
- `2026-04-11`: Updated the decision to record the deeper work and validation feature decomposition pass, where `features/work/mission-detail/**` and `features/validation/proof/**` now split inspector and center-content ownership into smaller route-family modules.
- `2026-04-11`: Updated the decision to record the work and validation selector cleanup pass, where `platform/console-state/{work,validation}-selectors.ts` now owns derived route shaping for overview, mission queues/detail, trust, proof, and activity screens.
- `2026-04-11`: Updated the decision to record the narrow-layout responsive audit pass, where shared header actions, stacked inspector summaries, and filter bars now own their compact behavior instead of relying on route-local wrapping drift.
- `2026-04-11`: Updated the decision to record the stacked-flow and center-canvas normalization pass, where the stacked inspector stays in normal content flow until desktop panes exist and the remaining trust/proof center surfaces no longer keep leftover split-grid review layouts.
- `2026-04-11`: Updated the decision to record the responsive shell-normalization and shared list-row pass, where the fixed desktop frame now starts only at the real pane breakpoint and the main list-review routes use one flatter row grammar instead of repeating boxed queue containers.
- `2026-04-11`: Updated the decision to link the accepted markdown-rendering and docs-reader pipeline as the next document-reader layer on top of the current section-classification and inspector-normalization work.
- `2026-04-11`: Updated the decision to record the stronger inspector-section grammar, the raised small-text token floor, and classified document sections, so docs detail routes now keep metadata and changelog out of the main reader flow and the right rail behaves more like a product inspector than a metadata dump.
- `2026-04-11`: Updated the decision to record the first route-family knowledge selector split, where plans and documents now compose through separate screen modules, shared knowledge selectors live under `platform/console-state`, and route helpers live under `support/knowledge`.
- `2026-04-11`: Updated the decision to record the removal of the old shared compatibility barrel, the canonical `cn` helper backed by `clsx` plus `tailwind-merge`, and the deeper route-family split across work, validation, and knowledge feature modules.
- `2026-04-11`: Updated the decision to record the implemented first `features/**` extraction baseline plus the new thin-scrollbar shell policy, where repeated route sections now live in owned feature modules and the routed shell uses one quieter scrollbar treatment across its scroll surfaces.
- `2026-04-11`: Updated the decision to record the implemented first `screens/**` migration baseline, where routed screen composition now lives outside `app/routes/**` and the old route files remain only as compatibility barrels.
- `2026-04-11`: Updated the decision to record the implemented page-family migration baseline, where routed views now use `patterns/pages/{list,detail,review,reader}` wrappers instead of rebuilding `PageFrame` plus `RouteHero` composition inline.
- `2026-04-11`: Updated the decision to record the implemented first shared-UI structural split, where the old `console-shared.tsx` ownership block now delegates to `patterns/shells`, `patterns/sections`, `platform/console-state`, and `support/**`.
- `2026-04-11`: Updated the decision to record the implemented first token layer in `@skopos/ui`, including semantic shell and shared reading-rail presets plus shared typography and control-size roles consumed by the shared shell and primitives.
- `2026-04-11`: Added the accepted UI-system normalization decision for the routed console, defining the next batch around layout tokens, route-family compounds, inspector primitives, and stronger projection boundaries instead of more route-local styling fixes.

## Context

The routed console is now usable, but it is still too route-built and utility-built:

1. width behavior is controlled manually through `PageFrame` and per-route `contentWidth` flags, so some routes drift from the intended reading rail
2. header rhythm, section spacing, and inspector density are still influenced by route-local JSX instead of one page-system contract
3. route files are still large and perform both data shaping and view composition, which makes consistency difficult to maintain
4. shared UI primitives in `console-shared.tsx` mix shell layout, content primitives, inspector primitives, and route support helpers in one large file
5. list rows and detail sections are still implemented ad hoc with inline utility strings instead of reusable compounds
6. the compiled console state is strong enough for the product, but route components still derive too much page-specific presentation logic at render time
7. responsive behavior is only partially systematized; desktop works better now, but tablet and compact layouts still depend too much on individual route markup

This is why fixes such as `4xl` content rails, header height alignment, inspector compactness, and list-row balance keep resurfacing route by route.

## Current Implementation Status

The first normalization slice is now implemented in the routed console:

1. `styles.css` now owns the first real shell, width, typography, and control-size token layer
2. `layout-tokens.ts` now exposes the shared shell and reading-rail width contract instead of leaving width decisions to route-local drift
3. `PageFrame`, `RouteHero`, `StatusPill`, `KeyValueList`, `ReviewRow`, `RouteFilterBar`, and the shell chrome now consume those shared tokens
4. routes no longer rely on older width forks; the routed console now lands on one shared center reading rail across page families

The remaining work is still structural:

1. move the rest of the route-local size and spacing drift onto the shared token layer
2. continue splitting route and pattern ownership so route files stop composing large sections directly against the compatibility barrel
3. introduce page-family compounds on top of the new token baseline

## First Structural Split

The first system-owned split is now in place:

1. `patterns/shells/page-frame.tsx` owns `PageFrame`, `RouteHero`, and header icon controls
2. `patterns/sections/content/**` now owns route content primitives such as `Card`, `RouteFilterBar`, `TrustCheckGroup`, `DocumentBody`, and `OperationTimeline`, while `content-primitives.tsx` now acts as a thin export surface
3. `patterns/sections/inspector/**` now owns `StatusPill`, `SidebarCard`, `KeyValueList`, `ReviewRow`, `SidebarList`, `ExternalLinkList`, `SimplePlanList`, and empty states, while `inspector-primitives.tsx` now acts as a thin export surface
4. `platform/console-state/access.ts` owns required console-state access
5. `support/**` owns neutral formatting, classnames, tone helpers, and execution metrics, including the canonical `cn` helper backed by `clsx` plus `tailwind-merge`
6. the old `app/console-shared.tsx` compatibility barrel is gone, so routed screens and features import owned modules directly
7. `patterns/pages/**` now own the first routed page-family wrappers for `list`, `detail`, `review`, and `reader` surfaces
8. `screens/**` now own the current route composition groups for work, validation, knowledge, and structure, with knowledge further split across dedicated plan and document screen modules
9. `features/**` now own route-family sections for work overview and mission queue/detail, validation trust/proof/activity, knowledge plans and documents, and structure scope surfaces, so the screen files are no longer the only place where repeated list, inspector, and detail-section grammar lives
10. `features/work/mission-detail/**` and `features/validation/proof/**` now split inspector and center-content ownership into smaller route-family modules instead of leaving those route families trapped in oversized section files
11. `features/knowledge/plans/**` and `features/knowledge/documents/**` now split list, detail, reader, inspector, and sequence ownership across smaller route-family modules instead of leaving knowledge trapped in two large feature files
12. `app/routing/route-config.ts` now owns route metadata, left-rail navigation groups, and list-view normalizers, so `app/router.tsx` stays focused on route registration and shell composition instead of route-policy constants
13. `platform/console-state/**` now also owns the first route-family selectors for plans and documents, so route-family shaping can move out of screens instead of being rebuilt inline
14. `support/knowledge/**` now owns knowledge-route href, path, and params helpers instead of leaving that routing logic inside feature modules
15. document sections are now classified as narrative, metadata, changelog, reference, or preview so routed readers can keep support context out of the main content lane
16. inspector sections now use a stronger accordion-style grammar with clearer headers, larger affordances, and better disclosure behavior than the earlier tiny-chevron metadata blocks
17. the shell style layer now owns a thin-scrollbar treatment for routed scroll surfaces so the left rail, main pane, and supporting rails use one quieter scrollbar policy
18. `application/build-console-state/document-projections.ts` now owns docs-link discovery, document loading, and markdown section classification so `build-console-state.service.ts` stays focused on console-state assembly and generic artifact loading
19. `support/knowledge/document-reader-{entries,scroll}.ts` now split document-outline entry construction from DOM scroll observation so the reader support layer no longer mixes both concerns in one helper file

## Decision

The next UI batch should be a system-level normalization pass, not another sequence of isolated route tweaks.

The routed Skopos console should align with the Unisane UI architecture mental model, adapted for a Vite-routed local app rather than a Next.js app shell:

`route -> shell -> screen -> page family -> feature -> platform/support/state`

This means Skopos should not evolve toward a generic `app/system/components` tree. It should use explicit ownership layers that mirror the stronger Unisane product-app doctrine while keeping the faster local-first delivery model.

## Canonical Target Source Shape

Target shape under `packages/ui/src/`:

```text
app/
  bootstrap.tsx
  main.tsx
  router.tsx

screens/
  overview/
  work/
  validation/
  knowledge/
  structure/
  activity/

features/
  missions/
  plans/
  trust/
  proof/
  scopes/
  docs/
  decisions/
  findings/
  activity/

patterns/
  shells/
  pages/
  sections/
  feedback/

platform/
  console-state/
  routing/
  dev/

support/
  formatting/
  ui/
  knowledge/
  execution/

styles/
  globals.css
  tokens.css
  shell.css

contracts/
  skopos-ui-console-state.ts
  skopos-ui-dev-channel.ts
  projections/
```

Ownership rules:

1. `app/` owns route registration and thin route entry only
2. `screens/` own route composition
3. `patterns/` own shell, page-family grammar, and structural sections
4. `features/` own business-facing UI capability sections
5. `platform/` owns browser/runtime bridges and routed console state access
6. `support/` owns neutral helpers and formatting support
7. `styles/` own token and shell styles instead of scattering policy through route files

### 1. Introduce Explicit Layout Tokens

Move shell geometry and reading-width rules into a stable UI-system layer.

Required token families:

1. shell widths:
   - left rail width
   - right inspector width
2. content rail presets:
   - `list`
   - `review`
   - `detail`
   - `reader`
3. header heights and vertical spacing
4. section spacing and row density
5. shell surface colors for:
   - left chrome
   - right chrome
   - center canvas

Add explicit typography and control-size token families as part of the same system:

6. typography roles:
   - page title
   - section title
   - body
   - helper
   - caption
   - micro label
7. control heights:
   - header control
   - filter chip
   - pill
   - compact inspector row
8. border and radius roles:
   - shell edge
   - section divider
   - interactive outline
   - surface radius

The current routed console is running too small at the bottom of the type scale. The next token pass should raise the smallest default readable roles slightly instead of keeping `10px`-adjacent labels and very tight helper text as the long-term baseline.

Routes should not decide these through ad hoc utility strings.

### 2. Replace Low-Level Page Assembly With Route-Family Compounds

Create reusable page-family compounds instead of hand-composing every route from `PageFrame`, `Card`, `SidebarCard`, and inline grids.

Required families:

1. `ListPage`
   - list header
   - filter bar
   - list section
   - list row
   - row metadata
2. `DetailPage`
   - detail header
   - narrative section
   - property section
   - related-work section
3. `ReviewPage`
   - posture section
   - evidence section
   - comparison section
   - timeline section
4. `ReaderPage`
   - reader header
   - document body
   - sequence controls
   - supporting metadata

These compounds should own the right default widths, spacing, and responsive behavior for each page family.

These compounds should live under `patterns/pages/**`, not inside route files.

### 3. Continue The Shared UI Layer Split By Responsibility

Keep the shared UI ownership direct and prevent the system from drifting back into a compatibility barrel:

1. patterns shells:
   - app shell
   - rail layout
   - page frame
   - header controls
2. patterns and support primitives:
   - pills
   - empty states
   - rows
   - section titles
3. inspector patterns:
   - inspector rail
   - inspector section
   - compact key-value summaries
   - support lists
4. page families:
   - list family
   - detail family
   - review family
   - reader family
5. platform and support:
   - formatting helpers
   - route metadata helpers
   - console-state selectors
6. canonical utility entrypoints:
   - `support/ui/classnames.ts` for `cn`
   - no new route-local string-join helpers or replacement compatibility barrels

The goal is not file-count for its own sake. The goal is to stop mixing shell rules, surface compounds, and data helpers in one large module.

### 4. Push More View Shaping Into Stable Selectors Or Projections

Keep raw runtime artifacts out of route JSX wherever possible.

Move repeated route-level shaping into selectors or compiled projections:

1. queue counts
2. latest timestamps
3. related-plan and related-mission summaries
4. inspector at-a-glance rows
5. document sequence metadata
6. route-specific empty-state posture

Route components should primarily compose page-family compounds from stable view data, not reconstruct page semantics inline.

### 5. Standardize The Inspector As A Single Product Primitive

The right pane should be one product primitive with fixed rules:

1. same width on routed desktop pages
2. same top rhythm and section rhythm
3. same compact summary pattern
4. same collapse behavior for low-priority sections
5. same responsive fallback below desktop

Route-specific inspector content should plug into that primitive instead of restyling the rail each time.

### 6. Make Responsiveness A First-Class Layout Contract

Treat the routed console as a responsive system, not just a desktop layout with fallback wrapping.

Required behavior:

1. desktop:
   - three-pane shell
   - sticky inspector
   - shared main scroll
2. tablet:
   - left rail stable
   - inspector moves below main content
   - content rail remains readable
3. narrow/mobile:
   - one-column content flow
   - no hidden right-rail dependency for critical context
   - header and filter controls wrap predictably

### 7. Normalize Route Implementation Order

Do not refactor randomly. Use this order:

1. shell tokens and layout presets in `styles/` plus `patterns/shells/`
2. inspector primitive extraction
3. route-family compounds in `patterns/pages/`
4. route entry cleanup so `app/router.tsx` hands off to `screens/**`
5. list routes:
   - `missions`
   - `plans`
   - `docs`
   - `decisions`
   - `findings`
   - `scopes`
6. detail routes:
   - `mission detail`
   - `plan detail`
   - `scope detail`
   - knowledge detail routes
7. review routes:
   - `overview`
   - `trust`
   - `proof`
   - `activity`
8. responsiveness and consistency audit
9. dead-pattern cleanup

## Explicit Non-Goals

This batch should not:

1. reintroduce dashboard-heavy center grids
2. expand graph features
3. add broad visual ornamentation
4. replace compiled-state authority with live runtime file reads in the app
5. keep accumulating page-local layout hacks while the system layer remains underspecified

## Expected Outcome

After this normalization batch:

1. route widths should stop drifting
2. inset header rhythm should be consistent
3. inspector behavior should be predictable across routed pages
4. route files should get materially smaller
5. new routes should be composed from `screens/**` plus page-family compounds instead of manual grids and hand-tuned spacing
6. the Skopos console should follow the same ownership logic as stronger Unisane product UIs, even though it uses Vite instead of Next.js
7. UI changes should land in system primitives first, with route updates becoming much cheaper and safer
