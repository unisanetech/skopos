# Decision: System UI Dev Loop And Hot Reload

## Metadata

- Doc ID: `SKOPOS-DECISION-012`
- Status: `accepted`
- Date: `2026-04-10`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Related Docs:
  - `../project/system-ui-plan.md`
  - `../project/roadmap.md`
  - `../project/implementation-checklist.md`
  - `../runbooks/local-development.md`
  - `../scopes/ui.md`
  - `008-system-ui-routed-app-stack.md`
  - `010-system-ui-information-hierarchy-and-signal-placement.md`
  - `011-system-ui-navigation-and-knowledge-routing.md`

## Changelog

- `2026-04-11`: Hardened the dev-loop watcher scope after a self-hosted macOS watcher OOM, so `skopos ui dev` now excludes generated app output under `docs/generated/skopos/app/**` and non-route-owned `.skopos/tooling/**` churn from the live authoring watch surface.
- `2026-04-11`: Hardened the dev-loop refresh contract so watched docs changes now invalidate the active routed view instead of relying on passive shell rerenders after console-state updates.
- `2026-04-10`: Improved the accepted dev-loop contract in `@skopos/ui`, so watched docs and `.skopos/**` changes now push live console-state updates into the running app instead of depending on full page reload.
- `2026-04-10`: Implemented the accepted dev-loop contract in `@skopos/ui`, adding `skopos ui dev`, Vite-backed HMR, watched compiled-state refresh, and file/state endpoints for the routed console.

## Context

The current routed-console workflow has `skopos ui build` and `skopos ui serve`, but `ui serve` still does a one-time build and then serves static output. That is good enough for preview, but it is not good enough for serious UI work or docs-heavy iteration.

Contributors need the routed UI to update when they:

1. change React components or styles
2. add or edit docs
3. update plans, decisions, or findings
4. refresh trust or proof artifacts
5. change `.skopos/**` state that feeds the current routes

## Decision

Adopt a dual-loop development model:

1. `skopos ui dev` becomes the default contributor browser loop
2. `skopos ui serve` remains a preview and smoke-check lane

`ui dev` must combine:

1. frontend HMR for app code
2. watched incremental compiled-state refresh for docs and `.skopos/**`

## Dev Loop Model

### 1. UI HMR

Owned by the frontend dev server.

Use for:

1. React route files
2. view components
3. styles
4. shell and layout primitives

### 2. Knowledge Hot Reload

Owned by the Skopos UI projection layer.

Use for:

1. docs
2. decisions
3. findings
4. plans
5. missions
6. trust and proof artifacts
7. other route-relevant `.skopos/**` state

### 3. Preview Mode

Use `skopos ui serve` for:

1. previewing the built console
2. smoke-checking the bundle
3. pilot-style static verification

Do not treat `ui serve` as the final editing loop.

## Incremental Rebuild Rules

The watcher must stay route-aware and incremental.

Do:

1. rebuild docs list and detail projections when docs change
2. rebuild decisions and findings projections when those docs change
3. rebuild plan and mission projections when work artifacts change
4. rebuild trust or proof route state when validation artifacts change
5. keep watch scope limited to route-owned authoring inputs and route-relevant `.skopos` artifacts

Do not:

1. rerun full bootstrap on every save
2. force full workspace rescans for ordinary docs edits
3. rely on manual restart as the default authoring experience
4. watch generated app output under `docs/generated/skopos/app/**`
5. treat `.skopos/tooling/**` churn as live routed-console refresh input

## Delivery Contract

### Required Commands

1. `skopos ui dev`
2. `skopos ui serve`
3. `skopos ui build`
4. `skopos ui render`

### Intended Meanings

1. `ui dev`
   - authoring loop
   - HMR plus watched state refresh
2. `ui serve`
   - built preview loop
3. `ui build`
   - output generation
4. `ui render`
   - fallback snapshot renderer

## Consequences

### Positive

1. docs-heavy UI iteration becomes practical
2. routed-console work no longer depends on repeated manual restarts
3. plans, decisions, findings, and `.skopos/**` updates become visible fast enough for real product iteration

### Costs

1. a watcher and refresh contract must be built into the UI projection layer
2. route invalidation logic must become explicit
3. local dev commands and runbooks must distinguish authoring from preview clearly

## Implementation Status

Implemented:

1. `skopos ui dev`
2. Vite HMR for UI source
3. watched route-aware projection refresh for docs and `.skopos/**`
4. browser data refresh through dedicated state and file endpoints, without manual restarts as the normal loop
5. live console-state updates for watched docs and `.skopos/**` changes without full page reload
6. active route invalidation after live console-state refresh, so open docs/detail routes update in place instead of waiting for manual reload
