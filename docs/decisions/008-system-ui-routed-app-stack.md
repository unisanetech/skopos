# Decision: System UI Routed App Stack

## Metadata

- Decision ID: `SKOPOS-DECISION-008`
- Status: `accepted`
- Date: `2026-04-10`
- Owner: `skopos-core`
- Scope: `skopos/ui`
- Related Docs:
  - `../project/system-ui-plan.md`
  - `../project/roadmap.md`
  - `../project/implementation-checklist.md`
  - `../scopes/ui.md`

## Context

The current Skopos UI shell is now strong enough to prove the core information architecture, but it still behaves like a generated document with anchors instead of a real product console. The current static HTML renderer is useful for internal projections and fallback output, but it is not sufficient as the primary pilot UI because:

1. navigation feels like one long page instead of a routed product
2. list-detail flows for missions, scopes, docs, and proof are limited
3. layout refinement is getting slower than it should be
4. richer interaction and progressive disclosure will become awkward if we keep extending the static template alone

The system UI needs a real routed app while staying local-first, compiled-knowledge-first, and internal-only during incubation.

## Decision

Skopos will move its primary human-facing UI to a routed app stack built with:

1. `React`
2. `Vite`
3. `TanStack Router`
4. `Tailwind CSS`

Use this stack for the pilot-grade system UI and the next phases of the Skopos console.

## Why This Stack

### React

Use React because the UI is now an application shell with list-detail views, contextual side rails, route-specific surfaces, and richer disclosure patterns. Component composition is the right fit for this.

### Vite

Use Vite because Skopos needs a fast local development loop and a light bundling story for an internal local-first tool. This is enough without introducing a heavier application runtime.

### TanStack Router

Use TanStack Router because the problem is now route modeling, not only page templating. Skopos needs typed routes for:

- `overview`
- `missions`
- `mission detail`
- `trust`
- `proof`
- `scopes`
- `scope detail`
- `docs`
- `activity`
- later comparison views

### Tailwind CSS

Use Tailwind CSS because layout and spacing iteration speed now matters more than raw CSS authorship purity. Tailwind should be used with Skopos-owned CSS variables and visual doctrine rather than as a default utility-only aesthetic.

## Explicit Rejections For Now

### Pure HTML As Primary UI

Rejected for the primary pilot UI. Keep the current generated HTML console only as:

1. a fallback rendering surface
2. an internal snapshot artifact
3. a bridge while the routed app is being built

### Astro

Rejected as the primary Skopos system UI framework for now. Astro is strong for docs-heavy sites, but Skopos now needs an operational console with richer routed interactions, stateful detail views, and an app-style shell.

### TanStack Start

Rejected for now because it adds more application/runtime complexity than the current local-first Skopos pilot needs. Skopos can add a richer server-aware runtime later if the product requires it.

## Delivery Model

The routed app should stay local-first and compiled-knowledge-first.

Use this delivery model:

1. `skopos ui build`
   - builds the routed app bundle
   - emits a compiled UI state payload alongside the app
2. `skopos ui serve`
   - serves the local app for routed navigation during pilot use
3. `skopos ui render`
   - remains as the simpler generated fallback/snapshot path during transition

The routed app should not become the source of truth. It reads compiled Skopos UI state and other generated projections.

## Data Contract Direction

The routed app should consume compiled projection data, not read arbitrary `.skopos/**` internals directly in ad hoc ways.

The preferred shape is:

1. keep `.skopos/**` authoritative
2. keep `@skopos/ui` loaders and view-model shaping as the projection layer
3. emit app-ready UI state artifacts for the routed console
4. let the React app read those view models cleanly through typed contracts

## Route Model

The first route family should be:

1. `/overview`
2. `/missions`
3. `/missions/:missionId`
4. `/trust`
5. `/proof`
6. `/scopes`
7. `/scopes/:scopeId`
8. `/docs`
9. `/activity`

Comparison routes can follow after these core surfaces are stable.

## Consequences

### Positive

1. the UI can behave like a real product console instead of a static report
2. layout and interaction quality can improve much faster
3. list-detail routing becomes natural
4. the current shell doctrine can be preserved while the center surfaces become much better

### Costs

1. the UI package will become a small application frontend instead of only a renderer
2. the project needs a clearer build and serve pipeline for the app
3. the current HTML renderer will need a deliberate transition plan

## Guardrails

1. keep the routed app internal-only during incubation
2. do not turn the system UI into a generic wiki or editor
3. do not let Tailwind or component utilities erase the Skopos visual doctrine
4. keep compiled knowledge and typed projections underneath the app
5. preserve the current static renderer as a fallback until the routed app reaches pilot readiness
