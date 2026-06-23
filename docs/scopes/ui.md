# Scope: ui

The `ui` scope owns the local docs and trust portal for humans.

## Metadata

- Doc ID: `SKOPOS-SCOPE-UI`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/scopes`
- Canonical: `yes`
- Last Updated: `2026-04-13`
- Review Cycle: `per workpack`
- Related Docs:
  - `../architecture/docs-governance.md`
  - `../architecture/trust-and-closure-model.md`
  - `../project/system-ui-plan.md`
  - `../decisions/008-system-ui-routed-app-stack.md`
  - `../decisions/009-system-ui-app-shell-and-layout-doctrine.md`
  - `../decisions/010-system-ui-information-hierarchy-and-signal-placement.md`
  - `../decisions/011-system-ui-navigation-and-knowledge-routing.md`
  - `../decisions/012-system-ui-dev-loop-and-hot-reload.md`
  - `../decisions/013-system-ui-shell-refinement-and-scroll-ownership.md`
  - `../decisions/014-system-ui-component-architecture-and-layout-normalization.md`
  - `../decisions/015-system-ui-markdown-rendering-and-doc-reader-pipeline.md`
  - `../decisions/016-system-ui-diagram-and-graph-presentation.md`
  - `../decisions/017-system-ui-search-and-command-dock.md`
  - `../decisions/022-program-router-sequencing-and-obligation-contract.md`
  - `../decisions/025-system-ui-discussion-context-and-sidebar-information-architecture.md`

## Changelog

- `2026-04-13`: Updated the ui scope after the discussion simplification cut, so `/discussion` stays focused on compiled handoffs and checkpoint history while raw discussion journals remain local support and are no longer rendered in the routed app or auto-synced during UI build.
- `2026-04-13`: Updated the ui scope after `Discussion` was promoted into the `Work` sidebar group, so the console now treats discussion history as a first-class execution surface instead of keeping the route search-only.
- `2026-04-13`: Updated the ui scope after the search-first discussion-route slice landed, so the console now exposes `/discussion` as a dedicated handoff-and-checkpoint browse surface through router plus search while still keeping the sidebar unchanged.
- `2026-04-13`: Updated the ui scope after the first adapter-support UI slice landed, so `overview` now projects the generated enforcement adapter matrix and makes Claude-versus-Codex support visible without adding a new route or sidebar item.
- `2026-04-13`: Updated the ui scope after the checkpoint-history discussion slice landed, so the console now projects `.skopos/discussions/index.json` and recent checkpoint artifacts into `overview`, `mission detail`, and the search dock while still keeping the left rail unchanged and deferring any dedicated discussion route.
- `2026-04-13`: Updated the ui scope after the first discussion-context UI slice landed, so the console now projects the latest workflow handoff into `overview`, `mission detail`, and the search dock while keeping the left rail unchanged and deferring any dedicated discussion route.
- `2026-04-13`: Updated the ui scope with the discussion-context and sidebar information-architecture contract, so the next UI slice now embeds handoff and checkpoint context into `overview`, `mission detail`, and the search dock first while keeping the left rail workflow-shaped and deferring any dedicated discussion route until the embedded surfaces prove insufficient.
- `2026-04-12`: Updated the ui scope after the first routed workflow-state adoption slice landed, so the console now consumes `.skopos/program/state.json` directly in `overview`, `mission detail`, `trust`, and the search dock instead of leaving compact program attention only in terminal output and raw artifacts.
- `2026-04-12`: Updated the ui scope after the first program-router slice landed, so the next workflow-state batch now needs to consume the real `.skopos/program/state.json` artifact and surface current attention, upstream program context, open obligations, and route-owned question or recommendation handling in `overview`, `mission detail`, `trust`, and the search dock.
- `2026-04-11`: Updated the ui scope to reflect the implemented Phase 2 search index, so the routed console now owns a generated search-entry surface with aliases, headings, excerpts, and route metadata while the bottom-center dock consumes that compiled index instead of rebuilding results ad hoc in the browser.
- `2026-04-11`: Updated the ui scope to reflect the implemented Phase 1 search dock, so the routed console now owns one bottom-center command surface with grouped upward-opening results, exact-first compiled-state retrieval, keyboard navigation, and a lightweight left-rail trigger while the next search work moves to a dedicated compiled index.
- `2026-04-11`: Updated the ui scope with the accepted search-and-command dock doctrine, so the routed console now treats workspace search as one bottom-center fixed command surface with grouped upward-opening results and exact-first compiled-state retrieval instead of spreading search across the header or left rail.
- `2026-04-11`: Updated the ui scope to reflect the accepted diagram-versus-graph contract and the first Mermaid reader implementation, so doc-owned explanatory diagrams now render inline in markdown docs while compiled `.skopos/graph/*` artifacts and the graph portal remain the canonical relationship surface.
- `2026-04-11`: Updated the ui scope to reflect typed canonical JSON artifact pages in docs detail, so `bootstrap`, `diagnosis`, `architecture`, and `index` JSON now render through structured artifact presenters with raw JSON kept behind secondary disclosure instead of the old empty-reader fallback.
- `2026-04-11`: Updated the ui scope to reflect the simplified sidebar-footer batch, so the left rail now uses one compact status panel with tighter rows, smaller dock pills, and concise mission-count wording instead of a larger footer section with repeated heading chrome.
- `2026-04-11`: Updated the ui scope to reflect the sidebar-shell refinement batch, so the left rail now uses a denser brand block, tighter nav-group rhythm, smaller row padding, and a compact status dock instead of a duplicated workspace section plus stretched footer chrome.
- `2026-04-11`: Updated the ui scope to reflect the list-inspector and empty-state wording cleanup batch, so list-route support cards now use clearer inventory labels and the remaining empty or missing states now read like product guidance instead of snapshot-heavy mechanical copy.
- `2026-04-11`: Updated the ui scope to reflect the proof-inspector and route-copy cleanup batch, so the proof right rail no longer repeats baseline-drift metrics across multiple cards and the remaining screen-level route descriptions now talk about workspace content instead of product-internal narration.
- `2026-04-11`: Updated the ui scope to reflect the inspector-preview and route-copy cleanup batch, so truncated support lists now say when the inspector is only showing a preview and the remaining center-lane descriptions now talk about workspace content rather than the UI itself.
- `2026-04-11`: Updated the ui scope to reflect the inspector-truthfulness and dead-support cleanup batch, so inspector badges now report real totals even when the visible support list is truncated and stale trust/proof support surfaces no longer linger in the shared feature exports.
- `2026-04-11`: Updated the ui scope to reflect the shared inspector and list-review polish batch, so list-route inspectors no longer repeat filter state, list rows suppress low-value empty metadata, and inspector accordions now read more like product support disclosure than utility controls.
- `2026-04-11`: Updated the ui scope to reflect the plan, mission, and scope detail cleanup batch, so plan detail now reads as one plan document, mission detail keeps validation command inventory in the inspector, and scope detail now treats related plans and missions as one current-work surface instead of separate metadata buckets.
- `2026-04-11`: Updated the ui scope to reflect the proof, trust, and overview hierarchy cleanup batch, so proof and trust inventories now live in support disclosure instead of the main canvas and overview no longer behaves like a second activity page.
- `2026-04-11`: Updated the ui scope to reflect the activity-route mixed-feed redesign, so plans, missions, workflow runs, and grouped operational events now share one center-lane recent-changes feed while the right pane stays limited to compact support context.
- `2026-04-11`: Updated the ui scope to reflect the activity-route timeline cleanup, so repeated identical operational events now collapse into grouped timeline entries, trust activity surfaces readiness as the real outcome, and empty actor metadata no longer dominates the route.
- `2026-04-11`: Updated the ui scope to reflect the platform-layer document projection split and reader-support split, so docs link discovery, document loading, and markdown section classification now live in `application/build-console-state/document-projections.ts` while reader entry-building and active-section scroll behavior now live in `support/knowledge/document-reader-{entries,scroll}.ts`.
- `2026-04-11`: Updated the ui scope to reflect the shared primitive and routing-policy split, so section primitives now live under `patterns/sections/{content,inspector}/**` and route metadata, nav groups, and list-view normalizers moved into `app/routing/route-config.ts`.
- `2026-04-11`: Updated the ui scope to reflect the deeper knowledge feature decomposition pass, so plans and docs now split list, detail, reader, inspector, and sequence ownership across smaller route-family modules instead of depending on two large feature files.
- `2026-04-11`: Updated the ui scope to reflect the deeper work and validation feature decomposition pass, so mission detail and proof now split inspector and center-content ownership into smaller route-family modules instead of depending on oversized section files.
- `2026-04-11`: Updated the ui scope to reflect the work and validation selector cleanup pass, so overview, mission queues/detail, trust, proof, and activity screens now compose mostly from selector-owned derived state instead of route-local shaping code.
- `2026-04-11`: Updated the ui scope to reflect the narrow-layout responsive audit pass, so header actions now wrap cleanly, stacked inspector summaries use a readable one-column rhythm, and route filter bars own horizontal overflow instead of wrapping unpredictably.
- `2026-04-11`: Updated the ui scope to reflect the stacked-flow and center-canvas normalization pass, so stacked inspector mode no longer pretends to be full-height before desktop panes exist and the remaining trust/proof center surfaces now follow one vertical review flow.
- `2026-04-11`: Updated the ui scope to reflect the responsive shell-normalization and list-row polish pass, so the fixed desktop shell now starts only at the real pane breakpoint and the main list-review routes use one flatter shared row grammar instead of boxed queue containers.
- `2026-04-11`: Updated the ui scope to reflect the broader canvas-first center-lane pass, so overview, trust, and the main detail routes now use separators and spacing instead of nested boxed panels for high-signal center content.
- `2026-04-11`: Updated the ui scope to reflect the narrower center reading rail and the first canvas-style detail-route pass, so the inset body now reads closer to a document canvas while boxed chrome stays focused on support surfaces.
- `2026-04-11`: Updated the ui scope to reflect active reader-outline tracking and copyable fenced-code blocks, so docs detail now keeps the inspector synced to the current section and code examples expose a product-grade copy affordance.
- `2026-04-11`: Updated the ui scope to reflect internal knowledge-link routing and richer fenced-code presentation in the markdown reader, so routed docs links can stay inside the app and code blocks now use a clearer language-aware shell.
- `2026-04-11`: Updated the ui scope to reflect the implemented markdown-rendering and docs-reader pipeline, so docs detail routes now render narrative content through a real markdown reader while keeping metadata and changelog in the inspector.
- `2026-04-11`: Updated the ui scope to add the accepted markdown-rendering and docs-reader pipeline, so the next docs-reader batch replaces the current light narrative-body splitter with a real markdown renderer while keeping metadata and changelog in the inspector.
- `2026-04-11`: Updated the ui scope to reflect the stronger inspector-section grammar, the raised small-text token floor, and classified document sections, so docs detail routes now move metadata and changelog context into the inspector and no longer render visible `H1` / `H2` machine markers in the main reader.
- `2026-04-11`: Updated the ui scope to reflect the first route-family knowledge selector split, where plans and documents now compose through separate screen modules, knowledge lookup moved into `platform/console-state/knowledge-selectors.ts`, and shared route helpers moved into `support/knowledge/document-routing.ts`.
- `2026-04-11`: Updated the ui scope to reflect the removal of the old shared compatibility barrel, the canonical `cn` helper backed by `clsx` plus `tailwind-merge`, and the deeper route-family feature split across work, validation, and knowledge surfaces.
- `2026-04-11`: Updated the ui scope to reflect the implemented first `features/**` extraction baseline plus the thin-scrollbar shell policy, where repeated route sections now live in owned feature modules and the routed shell uses one quieter scrollbar treatment.
- `2026-04-11`: Updated the ui scope to reflect the implemented `screens/**` migration baseline, where screen composition now lives outside `app/routes/**` and the route files remain as compatibility re-exports.
- `2026-04-11`: Updated the ui scope to reflect the implemented page-family migration baseline, where routed views now sit on `patterns/pages/{list,detail,review,reader}` wrappers instead of repeating shell composition inline.
- `2026-04-11`: Updated the ui scope to reflect the first shared-UI structural split, where `console-shared.tsx` now delegates to `patterns/shells`, `patterns/sections`, `platform/console-state`, and `support/**` instead of owning the shared shell and primitives directly.
- `2026-04-11`: Updated the ui scope to reflect the implemented first token layer in the routed console, including shared shell-width and reading-rail presets plus shared typography and control-size roles.
- `2026-04-11`: Updated the ui scope to make the next token-system batch explicit, including typography roles, control heights, shell widths, and surface tokens, with a slight increase planned for the smallest readable text styles.
- `2026-04-11`: Updated the ui scope again to make the target routed-console source tree explicit, so the next refactor aligns `@skopos/ui` with the Unisane ownership chain of `route -> shell -> screen -> page family -> feature -> platform/support/state`.
- `2026-04-11`: Updated the ui scope with the accepted UI-system normalization batch, so the next work now focuses on layout tokens, route-family compounds, inspector primitives, projection cleanup, and responsive normalization instead of more isolated route fixes.
- `2026-04-11`: Updated the ui scope to reflect the implemented inspector-interaction batch, where low-priority right-rail sections now collapse behind compact support panels and count badges instead of forcing every inspector block open at once.
- `2026-04-10`: Updated the ui scope to reflect the implemented shell-refinement batch, where the routed console now uses a narrower center reading rail, route-owned header sequence controls, one inspector width, clearer chrome-versus-canvas backgrounds, and shared main-scroll ownership without a default second inspector scrollbar.
- `2026-04-10`: Updated the ui scope with the accepted shell-refinement batch, so the next routed-console work now narrows the center reading rail, removes generic header source-link buttons, standardizes inspector width, clarifies shell background split, and fixes desktop scroll ownership toward one main scroll plus a sticky inspector.
- `2026-04-10`: Updated the ui scope to reflect the improved `skopos ui dev` loop, where watched docs and `.skopos/**` changes now refresh the routed console state in place instead of forcing a full browser reload.
- `2026-04-10`: Updated the ui scope to reflect the implemented compact-inspector batch, where right-pane metadata now uses denser split-row summaries and flatter support lists so the inspector behaves more like a real desktop side rail.
- `2026-04-10`: Updated the ui scope to reflect the implemented typography and detail-surface polish batch, where shared console primitives now use a tighter type and spacing rhythm and the noisiest detail routes now read flatter and more consistently.
- `2026-04-10`: Updated the ui scope to reflect the implemented deeper evidence and comparison batch, where `trust` now surfaces richer source-derived evidence trails and `proof` now shows comparison drivers, regressed benchmark evidence, and fuller category scorecards on top of the cleaned review routes.
- `2026-04-10`: Updated the ui scope to reflect the implemented wider-inspector batch, where `overview`, `trust`, `activity`, `mission detail`, and `plan detail` now use a broader right pane for support-only counts, validation posture, and recent side context instead of keeping those summaries in the center lane.
- `2026-04-10`: Updated the ui scope to reflect the implemented inspector-consistency batch, where execution, review, structure, and knowledge routes now share a calmer right-rail vocabulary around `At a glance`, `Source links`, and route-specific supporting context instead of mixed route-local inspector patterns.
- `2026-04-10`: Updated the ui scope to reflect implemented route-owned filtering, where `missions`, `plans`, `decisions`, and `findings` now carry review filters in route state instead of ad hoc local UI controls.
- `2026-04-10`: Updated the ui scope to reflect the implemented list-review cleanup batch, where `missions`, `plans`, `decisions`, and `findings` now use queues and curated lists instead of generic summary-heavy route bodies.
- `2026-04-10`: Updated the ui scope to reflect the implemented second information-hierarchy cleanup batch, where `mission detail`, `proof`, `scopes`, and routed knowledge detail surfaces now use the center-versus-inspector content contract instead of showing artifact-heavy summaries by default.
- `2026-04-10`: Updated the ui scope to reflect the implemented grouped left rail plus first-class `plans`, `decisions`, and `findings` routes, so navigation and knowledge routing now exist in the routed console instead of remaining only planned doctrine.
- `2026-04-10`: Updated the ui scope to reflect the first information-hierarchy cleanup batch, where `overview`, `trust`, and `activity` now lead with primary review content and use the right pane as a contextual inspector instead of a duplicate dashboard.
- `2026-04-10`: Updated the ui scope to reflect the implemented `skopos ui dev` loop, so contributors now have Vite-backed HMR plus watched compiled-state refresh instead of only a built preview server for routed-console iteration.
- `2026-04-10`: Updated the ui scope with the accepted dev-loop doctrine, so `skopos ui dev` is now the intended contributor workflow and `skopos ui serve` is treated as preview output rather than the final browser authoring loop.
- `2026-04-10`: Updated the ui scope with the accepted navigation and knowledge-routing doctrine, so plans, decisions, and findings are now part of the intended routed console surface and the left rail is constrained around clean route groups instead of workspace trivia or route-local summary clutter.
- `2026-04-10`: Updated the ui scope with the accepted information-hierarchy doctrine, so the next routed-console batch removes duplicate machine detail from center-pane routes, treats the right pane as a contextual inspector, and hides raw ids and paths behind explicit affordances.
- `2026-04-10`: Updated the ui scope with the accepted app-shell and layout doctrine, so the next UI batch is constrained around a full-bleed left rail, inset content rail, sticky contextual right pane, route-family-specific layouts, and tighter type and spacing rules.
- `2026-04-10`: Updated the ui scope to reflect the implemented `skopos ui serve` loop, so the routed console now has a real localhost preview path in addition to static build output.
- `2026-04-10`: Updated the ui scope to reflect the implemented routed detail-view slice, where docs now have a real list-detail reader and the mission, trust, and proof routes read like product review surfaces instead of flat artifact boards.
- `2026-04-10`: Updated the ui scope to reflect the implemented routed app foundation, including compiled console-state shaping, `skopos ui build`, a Vite-built hash-routed console app, and the static snapshot renderer remaining as fallback.
- `2026-04-10`: Updated the ui scope to reflect the routed-app stack decision, so the primary pilot UI will move to a Vite plus React plus TanStack Router plus Tailwind console while the current HTML renderer stays as a fallback during transition.
- `2026-04-10`: Updated the ui scope to reflect the implemented second system UI slice, where the console center pane now acts as an execution cockpit with richer trust, mission, proof, workflow, and activity surfaces instead of only a shell plus generic cards.
- `2026-04-10`: Updated the ui scope to reflect the implemented first system UI shell upgrade, which now renders a calmer console with a left navigation rail, top context bar, main work pane, and right evidence rail.
- `2026-04-10`: Updated the ui scope to make the first implementation slice follow a stable left-nav, top context bar, center work pane, and right evidence rail rather than continuing as one long generated document page.
- `2026-04-10`: Updated the ui scope to make the next batch a pilot-grade human project-intelligence console, not only a local machine-shaped portal shell.
- `2026-04-09`: Updated the ui scope to reflect graph-backed portal modules for docs surfaces, command surfaces, and scope relations in the local shell.
- `2026-04-10`: Updated the ui scope to reflect actor-aware recent activity and operational-log views, so shared runtime provenance is visible in the local portal instead of only in raw `.skopos` artifacts.
- `2026-04-09`: Updated the ui scope to reflect broader graph projections and portal entrypoints for docs, commands, and scope relations.
- `2026-04-09`: Updated the ui scope to reflect recent-activity modules in the local portal shell for plans, missions, and workflow evidence.
- `2026-04-09`: Updated the ui scope to reflect the implemented local portal shell at `docs/generated/skopos/index.html`, including trust summary, artifact links, and graph entrypoints.
- `2026-04-09`: Updated the ui scope to reflect the implemented HTML portal renderer that turns curated graph views into `docs/generated/skopos/graph-portal.html`.
- `2026-04-09`: Updated the ui scope to reflect the first implemented graph-projection slice: loading `.skopos/graph/*` and shaping curated graph view models for workspace, impact, and mission views.
- `2026-04-09`: Updated the ui scope to reflect that it should consume the implemented internal graph artifacts later rather than inventing its own graph model.
- `2026-04-09`: Updated the ui scope to reflect that future graph views must be curated, scope-aware, and high-signal rather than generic repo-wide diagrams.
- `2026-04-09`: Added the initial `ui` scope doc as part of the self-hosting package map.

## Current Responsibilities

The `ui` package currently owns:

1. local docs views for humans
2. trust and readiness views
3. graph artifact loading from `.skopos/graph/`
4. curated graph view models for workspace, docs, commands, scope-relations, impact, and mission views
5. local console shell rendering into `docs/generated/skopos/index.html`
6. linked graph portal rendering into `docs/generated/skopos/graph-portal.html`
7. recent-activity modules for persisted plans, missions, workflow-run evidence, and recent operational-log events
8. actor-aware provenance views for shared runtime activity such as planning, mission coordination, workflow execution, and instruction-sync maintenance
9. graph-backed portal modules for docs surfaces, command surfaces, and scope relations
10. the current stable shell structure for pilot-facing UI:

- left navigation rail
- top context bar
- main work pane
- right evidence rail

11. a human-facing execution cockpit for:

- active missions
- recent plans
- workflow evidence
- proof posture

12. richer trust and activity boards with progressive disclosure for machine details
13. compiled console-state shaping for the routed app
14. routed local app build output into `docs/generated/skopos/app/`
15. docs-link discovery, document loading, and markdown section classification through `application/build-console-state/document-projections.ts`

16. document reader outline-entry and active-section scroll helpers through `support/knowledge/document-reader-{entries,scroll}.ts`
17. a Vite plus React plus TanStack Router plus Tailwind console foundation with real routes for overview, missions, trust, proof, scopes, docs, and activity
18. a localhost serving loop through `skopos ui serve` for routed-console browser work
19. the current HTML console renderer as fallback output during the routed-app transition
20. a real `skopos ui dev` authoring loop with:

- Vite HMR for routed-console source
- watched compiled-state refresh for docs, decisions, findings, plans, missions, and `.skopos/**`
- dev-server state and file endpoints for browser-side route refresh

19. a compact docs list-detail surface built from compiled source projections rather than runtime filesystem reads in the app, with markdown reader behavior for prose docs and typed artifact presenters for canonical JSON docs
20. doc-owned Mermaid diagram rendering in the markdown reader for explanatory prose surfaces, while compiled graph artifacts remain on the separate graph-portal lane
21. denser routed review surfaces for mission ownership, trust signals, and proof comparison posture
22. future expansion into deeper evidence and comparison modules beyond the current routed foundation
23. the accepted desktop shell doctrine for the routed console:

- full-bleed left rail
- inset header and content rail
- sticky contextual right pane
- route-family-specific pane layouts
- restrained typography and surface rules

23. grouped left-rail route families for `Overview`, `Work`, `Validation`, `Knowledge`, and `Structure`
24. first-class routed knowledge surfaces for `plans`, `decisions`, and `findings`
25. the first information-hierarchy cleanup batch for:

- `overview`
- `trust`
- `activity`

26. compact inspector routing that keeps raw paths out of default visible link surfaces on the cleaned routes
27. the second information-hierarchy cleanup batch for:

- `mission detail`
- `proof`
- `scopes`
- routed knowledge detail surfaces

28. the list-review cleanup batch for:

- `missions`
- `plans`
- `decisions`
- `findings`

29. route-owned filter state for:

- `missions`
- `plans`
- `decisions`
- `findings`

30. inspector-consistent right-rail patterns across routed list, detail, and review views, with raw ids demoted behind linked routes or source affordances instead of leading the default inspector
31. wider right-pane variants for routes that need support-heavy inspectors, plus support-content migration out of the center lane on `overview`, `trust`, `activity`, `mission detail`, and `plan detail`
32. deeper routed review evidence on `trust` and `proof`, including source-derived trust evidence trails, proof comparison drivers, regressed benchmark visibility, and fuller category scorecards
33. tighter shared typography and spacing rhythm across the routed console, plus flatter `mission detail`, `plan`, `docs`, and `scope` detail presentation
34. compact inspector summaries and flatter support-list density across the right pane
35. the next source-shape normalization toward:

- thin `app/**`
- `screens/**`
- `features/**`
- `patterns/{shells,pages,sections,feedback}/**`
- `platform/**`
- `support/**`
- `styles/**`

36. the implemented first token layer for the routed console:

- explicit left-rail, right-inspector, and center-reading-rail width tokens
- one shared center reading rail across routed dynamic pages instead of per-family width forks
- shared typography roles for page titles, section titles, helper copy, captions, and metric labels
- shared control-size roles for chips, pills, and icon buttons

37. the implemented first shared-UI ownership split:

- `patterns/shells/page-frame.tsx` for shell frame and route header primitives
- `patterns/sections/content-primitives.tsx` for route content primitives
- `patterns/sections/inspector-primitives.tsx` for right-rail and compact summary primitives
- `platform/console-state/access.ts` for required console-state access
- `support/**` for neutral formatting, classnames, execution metrics, and tone helpers

38. a workspace-wide search and command dock contract with:

- one fixed bottom-center dock as the primary search surface
- grouped upward-opening results
- exact-first compiled-state retrieval across routes, scopes, docs, work, activity, and graph entrypoints
- lightweight search discoverability in the left rail instead of a second full search field
- keyboard navigation with `Cmd/Ctrl+K`, arrows, `Enter`, and `Escape`

39. the implemented first page-family migration baseline:

- `patterns/pages/list-page.tsx`
- `patterns/pages/detail-page.tsx`
- `patterns/pages/review-page.tsx`
- `patterns/pages/reader-page.tsx`
- routed views now consume those wrappers instead of rebuilding `PageFrame` plus `RouteHero` directly

40. the implemented first `screens/**` migration baseline:

- `screens/work/execution-screens.tsx`
- `screens/validation/review-screens.tsx`
- `screens/knowledge/{plan,document}-screens.tsx`
- `screens/structure/structure-screens.tsx`
- `screens/knowledge/knowledge-screens.tsx` now acts as a thin export surface for the split knowledge screens
- `app/router.tsx` now imports routed screen composition from those files

41. the implemented first `features/**` extraction baseline:

- `features/work/{overview,mission-list,mission-detail}-sections.tsx`
- `features/validation/{trust,proof,activity}-sections.tsx`
- `features/knowledge/plans/**`
- `features/knowledge/documents/**`
- `features/structure/scope-sections.tsx`
- repeated queue rows, inspector blocks, reader sections, and detail cards now live outside the screen layer

42. the accepted discussion-context UI contract for phase 1:

- `overview` owns compact recent-discussion visibility
- `mission detail` owns the primary discussion-context surface for active execution
- the search dock owns fast jump targets for handoffs, checkpoints, and discussion-derived questions
- `trust` only references discussion state when continuity or budget posture affects closure confidence
- the left rail does not add a dedicated `Discussion` route until the embedded surfaces exist and a separate route proves necessary

42. `features/work/mission-detail/**` and `features/validation/proof/**` now split inspector and center-content ownership into smaller route-family modules, so those route families no longer depend on oversized monolithic section files
43. `features/knowledge/plans/**` and `features/knowledge/documents/**` now split list, detail, reader, inspector, and sequence ownership into smaller route-family modules instead of relying on two large mixed-purpose section files
44. shared section primitives now live under `patterns/sections/{content,inspector}/**`, so the old section-level primitive files are only thin export surfaces instead of mixed ownership buckets
45. `app/routing/route-config.ts` now owns route metadata, left-rail navigation groups, and list-view normalizers, so `app/router.tsx` stays focused on route registration and shell composition
46. the old shared compatibility barrel is gone, so routed screens and features now import owned shell, section, platform, and support modules directly instead of routing through `app/console-shared.tsx`
47. the canonical class-composition entrypoint is now `support/ui/classnames.ts`, which exports `cn` backed by `clsx` plus `tailwind-merge`
48. `platform/console-state/knowledge-selectors.ts` now owns plan queues, document classification, document ordering, and document detail context for the routed knowledge surfaces
49. `support/knowledge/document-routing.ts` now owns knowledge-route href, path, and params helpers
50. inspector sections now use a stronger accordion-style grammar with clearer headers, larger affordances, and better disclosure behavior across the right rail
51. document sections are now classified as narrative, metadata, changelog, reference, or preview so docs detail routes can keep support context out of the main reader flow
52. the smallest shared text roles are now slightly larger across eyebrow, label, caption, helper, pill, badge, and inspector text tokens
53. a shell-level thin-scrollbar treatment across routed scroll surfaces so the rails and main review pane use quieter browser chrome
54. the implemented docs-reader markdown batch for:

- a real markdown renderer for narrative and reference sections
- metadata and changelog staying in the inspector
- semantic rendering for code blocks, tables, blockquotes, links, and nested lists instead of local text splitting
- internal markdown links resolving to routed docs, decisions, and findings destinations
- a clearer language-aware shell for fenced code blocks
- an active inspector outline synced to the current reader section
- a copy affordance for fenced code blocks
- a flatter canvas-style reader body for narrative content instead of another boxed inner panel

55. the accepted next shell-refinement batch for:

- a narrower `4xl` or `5xl` center reading rail
- one inspector width across routed pages
- route-owned prev and next header controls instead of global source-link buttons
- shell chrome split between left and right panes versus the lighter center lane
- shared center-plus-inspector desktop scroll ownership instead of a second default inspector scrollbar
- fewer in-center two-column grids on review and detail routes

56. a narrower shared center reading rail with flatter canvas-style detail and review surfaces, so the main inset body stays readable while boxed chrome is reserved for inspectors, queues, comparisons, and other structured support modules
57. a responsive shell-normalization pass where the fixed desktop frame starts only at the real pane breakpoint and the main list-review routes use one flatter shared row grammar across missions, plans, docs, and scopes
58. a stacked-flow and center-canvas normalization pass where the inspector stays in normal content flow until desktop panes exist and the remaining trust/proof center sections stop using residual split-grid review layouts
59. a narrow-layout responsive audit where shared headers, stacked inspector summaries, and filter bars own their compact behavior instead of relying on route-local wrapping drift
60. a work and validation selector cleanup pass where `platform/console-state/{work,validation}-selectors.ts` now owns derived route shaping for overview, mission queues/detail, trust, proof, and activity screens

## Next Planned Responsibilities

The next owned UI responsibility is workflow-state adoption on top of the existing routed console.

That batch should surface:

1. current attention and `do-now` guidance in `overview`
2. upstream program context, open obligations, and next-step guidance in `mission detail`
3. closure blockers from workflow and program state in `trust`
4. jump targets for questions, recommendations, program items, and later discussion checkpoints in the bottom search dock

The first routed adoption slice now covers:

1. `overview`
   - one compact program-attention card
2. `mission detail`
   - one upstream program-context card
3. `trust`
   - one program-pressure card for closure-relevant obligations
4. `search dock`
   - jump targets for `do-now`, `do-next`, and open program obligations

## Pilot Direction

1. The current shell and execution cockpit are now the pilot-grade base console for broader UI work.
2. The UI should optimize for operational readability:
   - overview
   - scopes
   - missions
   - trust
   - proof
   - docs
   - activity
3. The UI should present authority, freshness, actor attribution, and closure evidence clearly without making humans read raw artifacts first.
4. The UI should keep machine detail available through progressive disclosure rather than as the default reading mode.
5. The UI must not drift into a generic wiki, editor, or graph playground.
6. The implemented console should use:
   - a stable left navigation rail
   - a top context bar
   - a main working pane
   - a quieter right evidence rail
7. The routed app foundation now exists and should be treated as the primary pilot UI base.
8. `skopos ui serve` should be the default local browser loop while `skopos ui build` remains the static bundle lane.
9. The current routed console now follows the accepted app-shell doctrine instead of continuing ad hoc shell tweaks.
10. The routed console now uses a pane-based desktop shell:

- full-height left rail
- inset content rail
- sticky right context pane
- route-family-specific layouts

11. The current routed cleanup batch now applies the information-hierarchy doctrine to `overview`, `trust`, and `activity`:

- center pane owns primary and supporting information
- right pane owns supporting and limited diagnostic context
- raw ids, paths, and artifact handles stay behind explicit disclosure

12. The routed console now uses the accepted left-rail navigation model:

- `Overview`
- `Work`
- `Validation`
- `Knowledge`
- `Structure`

13. Plans, decisions, and findings are now first-class routed product surfaces instead of buried docs or artifact links.
14. The next UI work should keep prev and next route-owned and sequence-aware, not global shell chrome.
15. The next UI work should continue removing duplicate status, duplicated resource links, and low-signal zero-value counts from the remaining route families.
16. The next UI work should focus on inspector consistency now that the major route-cleanup passes and route-owned filters are in place.
17. Inspector consistency, deeper evidence, detail-surface polish, and compact inspector density are now in place across the cleaned route families, so the next UI work should focus on remaining interaction polish and carefully chosen deeper comparison modules instead of more shell reshuffling.
18. The current docs-reader work should keep the markdown-rendered narrative reader stable while continuing reader-specific polish without moving metadata, changelog, or source context back into the main reading lane.
19. The current UI work should keep the real authoring loop healthy:

- `skopos ui dev` for UI HMR
- watched compiled-state refresh for docs, plans, decisions, findings, and `.skopos/**`
- `skopos ui serve` kept as preview only

## Graph Rules

1. do not default to whole-repo graph clouds
2. prefer scoped views such as impact, dependency, docs-authority, and mission relationships
3. graph visuals must distinguish canonical, recommended, legacy, conflicting, and historical state clearly
