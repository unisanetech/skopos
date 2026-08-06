---
title: Archived System UI Plan
status: historical
owner: skopos-core
id: SKOPOS-PLAN-P-11229565
scope: skopos
role: plan
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
appliesTo:
  - historical-context-only
archived: 2026-07-28
lastUpdated: 2026-07-28
relatedDocs:
  - ../../overview.md
  - ../../domains/product/vision.md
  - ../../domains/product/positioning.md
  - ../plans/P-067e15c4-proof-and-benchmarking.md
  - P-37fa9180-prototype-roadmap.md
  - P-b4e43e34-prototype-implementation-checklist.md
  - P-b67761d4-human-guidance-and-developer-experience.md
  - ../../scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md
  - ../../scopes/skopos-ui/decisions/archive/009-system-ui-app-shell-and-layout-doctrine.md
  - ../../scopes/skopos-ui/decisions/archive/010-system-ui-information-hierarchy-and-signal-placement.md
  - ../../scopes/skopos-ui/decisions/archive/011-system-ui-navigation-and-knowledge-routing.md
  - ../../scopes/skopos-ui/decisions/012-system-ui-dev-loop-and-hot-reload.md
  - ../../scopes/skopos-ui/decisions/archive/013-system-ui-shell-refinement-and-scroll-ownership.md
  - ../../scopes/skopos-ui/decisions/archive/014-system-ui-component-architecture-and-layout-normalization.md
  - ../../scopes/skopos-ui/decisions/015-system-ui-markdown-rendering-and-doc-reader-pipeline.md
  - ../../scopes/skopos-ui/decisions/016-system-ui-diagram-and-graph-presentation.md
  - ../../scopes/skopos-ui/decisions/archive/017-system-ui-search-and-command-dock.md
  - ../../decisions/023-supervision-cost-and-workflow-weight-discipline.md
  - ../../decisions/025-system-ui-discussion-context-and-sidebar-information-architecture.md
  - ../../decisions/030-human-guidance-and-developer-experience-contract.md
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../plans/P-e7e888e6-canonical-product-convergence.md
  - ../../scopes/skopos-ui/overview.md
  - ../../architecture/runtime-model.md
  - ../../architecture/trust-and-closure-model.md
reviewCycle: none; retained for history
---

# Archived System UI Plan

> Historical prototype plan. Current UI direction is sequenced by the canonical
> convergence Plan and owned by current decisions and Scope Memory.

## Changelog

- `2026-07-28`: Archived this mixed prototype design and implementation Plan; current
  UI direction remains in the convergence Plan, accepted decisions, and UI Scope.
- `2026-07-28`: Moved all routed-app and snapshot runtime output into
  `.skopos/ui/**`; no Skopos UI runtime family remains under checked-in docs.
- `2026-07-28`: Retained as current UI implementation inventory. Target routes and
  terminology are owned by convergence Phase 8.

- `2026-06-24`: Added a saved local role-mapping review card to rule-pack detail pages so users can inspect role status, confidence, matched paths, and next steps without opening raw JSON.
- `2026-06-24`: Updated rule-pack detail UI to explain brownfield-safe role mapping, including matched role counts, missing-role guidance, and matched aliases for projects with good but different folder names.
- `2026-06-24`: Added dedicated rule-pack detail routes so each accepted pack can explain its structure tree, matched project paths, dependency direction, forbidden imports, gates, and before-editing/before-done prompts without crowding the Rules dashboard.
- `2026-06-24`: Expanded the Rules route with full pack-detail cards, including best-fit guidance, not-for guidance, user questions, quality bars, agent-use notes, source paths, and codebase-verification signals such as structure/tree evidence.
- `2026-06-24`: Added the first Rules review route so accepted rule packs, active policy, drift, local exceptions, and work-lane guidance are visible in plain language instead of only through CLI artifacts.
- `2026-06-24`: Cleaned up remaining shared support copy across search, readiness, program context, timeline, and inspector empty states so the routed console uses developer-facing language instead of internal system terms.
- `2026-06-24`: Reworked Discussion route copy and first-card guidance so the page explains handoffs, checkpoints, accepted direction, and open questions in normal developer language.
- `2026-06-24`: Added first-card guidance to Missions, Plans, and plan detail so work surfaces explain tracked sessions, saved plans, next steps, and links between planning and closure evidence before showing lists.
- `2026-06-24`: Added human guidance cards to Readiness, Evidence, and Activity so validation pages lead with practical interpretation and next-step advice before diagnostic details.
- `2026-06-24`: Added route-level guidance to Docs, Decisions, and Issues so each knowledge page explains how a developer should use that memory surface before showing document lists.
- `2026-06-24`: Reworked the Current Work overview attention area into a plain-language Next Action card that explains the recommended next move, current tracked work, and before-finishing obligations without exposing program-router jargon first.
- `2026-06-24`: Implemented the human-ready orientation pass for the routed console, so the sidebar now leads with Current Work, Work, Quality, Knowledge, and Project Map while the former Trust, Proof, Findings, and Scopes labels are presented as Readiness, Evidence, Issues, and Project Map in user-facing UI.
- `2026-06-24`: Reworked Project Map detail copy so package pages explain what belongs there, what does not, common work, useful checks, and tied missions/plans before advanced graph metadata.
- `2026-06-24`: Implemented the first mission-detail human guidance slice, so the routed console now loads workflow questions into UI state and shows mission progress, phase, current focus, decisions, findings, blockers, proof needed, and guided open questions before raw mission detail.
- `2026-06-24`: Added the human guidance and developer experience contract to the UI plan so routed surfaces must lead with plain-language status, next action, blockers, questions, progress, and proof instead of raw artifact-first machine state.
- `2026-04-13`: Simplified the discussion product surface again, so the routed console keeps `Discussion` for compiled handoff plus checkpoint history but no longer auto-syncs Codex sessions during UI build or renders raw conversation journals in the normal app flow.
- `2026-04-13`: Promoted `Discussion` into the sidebar under `Work`, so the routed console now treats checkpoint and handoff history as a first-class execution surface instead of a search-only route once the embedded overview and mission-detail slices proved useful.
- `2026-04-13`: Refined the search-first discussion route so checkpoint cards now surface promotion trigger and semantic change-kind badges, making `/discussion` useful for reasoning-history inspection instead of only mirroring the latest handoff summary.
- `2026-04-13`: Added a search-first `/discussion` route, so the routed console now has one dedicated checkpoint-and-handoff browse page without changing the sidebar contract; discussion search hits can jump there directly while the left rail still stays workflow-shaped.
- `2026-04-13`: Implemented the first adapter-support UI slice, so `overview` now surfaces the generated enforcement adapter matrix from `.skopos/index/enforcement.json` and the product no longer hides Claude-versus-Codex lifecycle coverage behind internal tooling files.
- `2026-04-13`: Implemented the checkpoint-history follow-through for discussion context, so the routed console now loads `.skopos/sessions/index.json` plus recent checkpoint artifacts into console state, shows checkpoint history alongside the latest handoff in `overview` and `mission detail`, and indexes those checkpoints in the search dock while still deferring any dedicated discussion route.
- `2026-04-13`: Implemented the first discussion-context UI slice, so the routed console now loads the latest workflow handoff into console state, shows `Recent discussion` in `overview`, shows `Discussion context` in `mission detail`, and adds search-dock jump targets for the latest handoff without adding a dedicated discussion route.
- `2026-04-13`: Added the discussion-context and sidebar information-architecture contract, so the next UI slice now embeds recent discussion in `overview`, `mission detail`, and the search dock first while keeping the sidebar workflow-shaped and deferring any dedicated `Discussion` route until the embedded surfaces prove insufficient.
- `2026-04-12`: Implemented the first routed workflow-state adoption slice, so the console now loads `.skopos/tasks/queue.json`, shows compact program attention in `overview`, adds upstream program context to `mission detail`, exposes program pressure in `trust`, and adds search-dock jump targets for `do-now`, `do-next`, and open obligations.
- `2026-04-12`: Updated the system UI plan after the first low-noise program-router slice landed, so the next workflow-state UX batch now consumes a real `.skopos/tasks/queue.json` artifact plus `skopos program sync` and `skopos program next` output instead of only planning around a future control-plane contract.
- `2026-04-12`: Added the supervision-cost and workflow-weight discipline to the system UI plan, so workflow-state UX is now explicitly required to lower user confusion and supervision without turning the routed console into a larger planning dashboard.
- `2026-04-12`: Updated the system UI plan with the accepted program-router and obligation contract, so the next workflow-state UX batch now needs to surface current attention, interruption guidance, docs plus UI obligations, and upstream program context in `overview`, `mission detail`, `trust`, and the bottom search dock instead of leaving those states in terminal artifacts only.
- `2026-04-11`: Updated the system UI plan to reflect the implemented Phase 2 search index, so the bottom-center command dock now reads from generated search entries with aliases, headings, excerpts, and route metadata instead of rebuilding the result surface ad hoc in the browser.
- `2026-04-11`: Updated the system UI plan to reflect the implemented Phase 1 search dock, so the routed console now ships one bottom-center fixed command surface with grouped upward-opening results, exact-first compiled-state ranking, keyboard navigation, and a lightweight left-rail trigger while the next search work moves to a dedicated compiled index.
- `2026-04-11`: Updated the system UI plan with the accepted search-and-command dock doctrine, so the next search surface is now constrained around one bottom-center fixed dock, exact-first compiled-state retrieval, grouped upward-opening results, and a lightweight left-rail trigger instead of competing header or sidebar search fields.
- `2026-04-11`: Updated the system UI plan to reflect the accepted diagram-versus-graph contract and the first Mermaid reader implementation, so doc-owned explanatory diagrams now render inline in markdown docs while compiled `.skopos/graph/*` artifacts and the graph portal remain the canonical relationship layer.
- `2026-04-11`: Updated the system UI plan to reflect typed canonical JSON artifact pages in docs detail, so `bootstrap`, `diagnosis`, `architecture`, and `index` JSON now render through structured artifact presenters with raw JSON demoted behind secondary disclosure instead of the old empty-reader fallback.
- `2026-04-11`: Updated the system UI plan to reflect the simplified sidebar-footer batch, so the left rail now uses one compact status panel with tighter rows, smaller dock pills, and concise mission-count wording instead of a larger footer section with repeated heading chrome.
- `2026-04-11`: Updated the system UI plan to reflect the sidebar-shell refinement batch, so the left rail now uses a denser brand block, tighter nav-group rhythm, smaller row padding, and a compact status dock instead of a duplicated workspace section plus stretched footer chrome.
- `2026-04-11`: Updated the system UI plan to reflect the list-inspector and empty-state wording cleanup batch, so list-route support cards now use clearer inventory labels and the remaining empty or missing states now read like product guidance instead of snapshot-heavy mechanical system text.
- `2026-04-11`: Updated the system UI plan to reflect the proof-inspector and route-copy cleanup batch, so the proof right rail no longer repeats baseline-drift metrics across multiple cards and the remaining screen-level route descriptions now talk about workspace content instead of product-internal narration.
- `2026-04-11`: Updated the system UI plan to reflect the inspector-preview and route-copy cleanup batch, so truncated support lists now say when they are only showing a preview and the remaining center-lane descriptions now describe workspace content instead of narrating the UI itself.
- `2026-04-11`: Updated the system UI plan to reflect the inspector-truthfulness and dead-support cleanup batch, so inspector badges now report real totals even when lists are visually truncated and the stale trust/proof support surfaces removed from the routed review canvas are no longer carried as dead shared feature exports.
- `2026-04-11`: Updated the system UI plan to reflect the support-surface truthfulness cleanup, so inspector badges now represent real totals instead of visible slices and the old trust/proof inventory surfaces that no longer belong on the routed review canvas have been removed from the shared feature layer.
- `2026-04-11`: Updated the system UI plan to reflect the shared inspector and list-review polish batch, so list-route inspectors no longer repeat filter state, list rows hide low-value empty metadata, and inspector disclosure now reads like product support context instead of utility controls.
- `2026-04-11`: Updated the system UI plan to reflect the plan, mission, and scope detail cleanup batch, so plan detail now reads as one plan document, mission detail keeps validation command inventory in the inspector instead of the center lane, and scope detail now treats related work as one combined work surface instead of separate metadata buckets.
- `2026-04-11`: Updated the system UI plan to reflect the proof, trust, and overview hierarchy cleanup batch, so proof and trust inventories now belong in support disclosure instead of the main canvas and overview no longer behaves like a second activity page.
- `2026-04-11`: Updated the system UI plan to reflect the activity-route mixed-feed redesign, so plans, missions, workflow runs, and grouped operational events now share one center-lane recent-changes feed while the right pane stays limited to compact support context.
- `2026-04-11`: Updated the system UI plan to reflect the activity-route timeline cleanup, so repeated identical operational events now collapse into grouped timeline entries, trust events surface readiness as the real outcome, and missing actor metadata stays hidden unless it adds signal.
- `2026-04-11`: Updated the system UI plan to reflect the platform-layer document projection split and reader-support split, so docs link discovery, document loading, and markdown section classification now live in `application/build-console-state/document-projections.ts` while reader entry-building and active-section scroll behavior now live in `support/knowledge/document-reader-{entries,scroll}.ts`.
- `2026-04-11`: Updated the system UI plan to reflect the shared primitive and routing-policy split, so `patterns/sections/{content,inspector}/**` now own shared section primitives directly and `app/routing/route-config.ts` now owns route metadata, nav groups, and list-view normalizers.
- `2026-04-11`: Updated the system UI plan to reflect the deeper knowledge feature decomposition pass, so plans and docs now split list, detail, reader, inspector, and sequence ownership across smaller route-family modules instead of keeping that work inside two large feature files.
- `2026-04-11`: Updated the system UI plan to reflect the deeper work and validation feature decomposition pass, so mission detail and proof now split inspector and center-content ownership into smaller route-family modules instead of staying trapped in two oversized section files.
- `2026-04-11`: Updated the system UI plan to reflect the work and validation selector cleanup pass, so overview, mission queues/detail, trust, proof, and activity screens now compose mostly from selector-owned derived state instead of shaping route data inline.
- `2026-04-11`: Updated the system UI plan to reflect the narrow-layout responsive audit pass, so header actions can wrap cleanly, stacked inspector summaries collapse into a readable one-column rhythm, and route filter bars now own horizontal overflow instead of wrapping unpredictably.
- `2026-04-11`: Updated the system UI plan to reflect the stacked-flow and center-canvas normalization pass, so stacked inspector mode no longer pretends to be full-height before desktop panes exist and the remaining trust/proof center surfaces now read as one vertical review flow instead of residual desktop grids.
- `2026-04-11`: Updated the system UI plan to reflect the responsive shell-normalization and list-row polish pass, so the fixed desktop shell now starts only at the real pane breakpoint and the main list routes share a flatter canvas-style row grammar instead of boxed queue containers.
- `2026-04-11`: Updated the system UI plan to reflect the broader canvas-first center-lane pass across overview, trust, mission detail, plan detail, scope detail, and proof detail, so high-signal center sections now use separators and spacing instead of nested boxed panels.
- `2026-04-11`: Updated the system UI plan to reflect the narrower center reading rail and the first canvas-style detail-route pass, so the inset body now reads closer to a document canvas while boxed chrome stays reserved for support surfaces such as inspectors, queues, and comparisons.
- `2026-04-11`: Updated the system UI plan to reflect polished syntax highlighting and flatter reader-body chrome, so docs detail now renders code with a real highlighted shell and keeps narrative content less boxed and more readable.
- `2026-04-11`: Updated the system UI plan to reflect active reader-outline tracking and copyable fenced-code blocks, so docs detail now keeps the inspector synced to the current section and gives code examples a product-grade copy affordance.
- `2026-04-11`: Updated the system UI plan to reflect internal knowledge-link routing and richer fenced-code presentation in the markdown reader, so routed docs links can stay inside the app and code blocks now use a clearer language-aware shell.
- `2026-04-11`: Updated the system UI plan to reflect the implemented markdown-rendering and docs-reader pipeline, so narrative docs content now renders through a real markdown reader while metadata, changelog, and source context stay in the inspector.
- `2026-04-11`: Updated the system UI plan to add the accepted markdown-rendering and docs-reader pipeline, so narrative docs content will move to a real markdown renderer while metadata, changelog, and source context stay in the inspector.
- `2026-04-11`: Updated the system UI plan to reflect the stronger inspector-section grammar, the raised small-text token floor, and classified document sections, so docs detail routes now move metadata and changelog context into the inspector and no longer render visible `H1` / `H2` machine markers in the reader.
- `2026-04-11`: Updated the system UI plan to reflect the first route-family knowledge selector split, where plans and documents now compose through separate knowledge screen files, plan and document shaping moved into `platform/console-state/knowledge-selectors.ts`, and shared knowledge route helpers moved into `support/knowledge/document-routing.ts`.
- `2026-04-11`: Updated the system UI plan to reflect the removal of the old shared compatibility barrel, the canonical `cn` helper backed by `clsx` plus `tailwind-merge`, and the deeper route-family feature split across work, validation, and knowledge surfaces.
- `2026-04-11`: Updated the system UI plan to reflect the implemented first `features/**` extraction baseline and the new thin-scrollbar shell policy, where repeated work, validation, knowledge, and structure sections now live outside `screens/**` and routed scroll surfaces use one quieter scrollbar treatment.
- `2026-04-11`: Updated the system UI plan to reflect the implemented `screens/**` migration baseline, where `app/router.tsx` now imports route composition from owned screen modules while `app/routes/**` has been reduced to compatibility re-exports.
- `2026-04-11`: Updated the system UI plan to reflect the implemented page-family migration baseline, where routed views now compose through `patterns/pages/{list,detail,review,reader}` instead of hand-owning `PageFrame` plus `RouteHero` assembly in every route file.
- `2026-04-11`: Updated the system UI plan to reflect the first structural split of the shared UI layer, where `console-shared.tsx` now acts as a compatibility barrel over `patterns/shells`, `patterns/sections`, `platform/console-state`, and `support/**` instead of remaining the primary ownership surface.
- `2026-04-11`: Updated the system UI plan to reflect the implemented first token layer in the routed console, including explicit shell-width and shared reading-rail presets, shared typography and control-size roles, and a slight lift to the smallest readable text styles.
- `2026-04-11`: Updated the system UI plan to make the next token pass explicit, including typography roles, control heights, border and radius roles, and a slight increase to the smallest readable text styles so the routed console stops feeling undersized.
- `2026-04-11`: Updated the system UI plan again to make the target source structure explicit, aligning the routed Skopos console with the Unisane UI chain of `route -> shell -> screen -> page family -> feature -> platform/support/state` instead of a generic app-only component split.
- `2026-04-11`: Updated the system UI plan with the accepted UI-system normalization batch, making layout tokens, route-family compounds, inspector primitives, and stronger projection boundaries the next architecture step instead of more route-local fixes.
- `2026-04-11`: Updated the system UI plan to reflect the implemented inspector-interaction batch, where secondary right-rail sections now use collapsible support panels with compact count badges so the inspector stays readable without regressing into a second scrolling document.
- `2026-04-10`: Updated the system UI plan to reflect the implemented shell-refinement batch, where the routed console now uses a narrower center reading rail, route-owned header controls, one inspector width, clearer chrome-versus-canvas backgrounds, and shared main-scroll ownership instead of a second default inspector scrollbar.
- `2026-04-10`: Updated the system UI plan with the accepted shell-refinement batch, narrowing the target center reading rail, replacing generic header source-link buttons with route-owned controls, standardizing the inspector width, clarifying shell background split, and moving desktop scroll ownership toward one shared main scroll plus a sticky inspector.
- `2026-04-10`: Updated the system UI plan to reflect the improved `skopos ui dev` loop, where watched docs and `.skopos/**` changes now push live console-state updates through the running app instead of depending on full page reload.
- `2026-04-10`: Updated the system UI plan to reflect the implemented compact-inspector batch, where right-pane metadata now uses denser split-row summaries and flatter support lists so mission, proof, trust, and knowledge inspectors waste less vertical space.
- `2026-04-10`: Updated the system UI plan to reflect the implemented typography and detail-surface polish batch, where shared console primitives now use a tighter type and spacing rhythm and `mission detail`, `plan`, `docs`, and `scope` surfaces now read flatter and more consistently across the routed app.
- `2026-04-10`: Updated the system UI plan to reflect the implemented deeper evidence and comparison batch, where `trust` now exposes richer source-derived evidence trails and `proof` now shows comparison drivers, regressed benchmark evidence, and a fuller category scorecard on top of the cleaned routed review surfaces.
- `2026-04-10`: Updated the system UI plan to reflect the implemented wider-inspector batch, where `overview`, `trust`, `activity`, `mission detail`, and `plan detail` now move support-only grids and side lists into a wider right pane so the center lane can stay focused on the primary review surface.
- `2026-04-10`: Updated the system UI plan to reflect the implemented inspector-consistency batch, where the routed console now uses a shared right-rail vocabulary around `At a glance`, `Source links`, and route-specific supporting context instead of mixed route-by-route inspector titles and raw-id-first panels.
- `2026-04-10`: Updated the system UI plan to reflect the implemented route-owned filter batch, where `missions`, `plans`, `decisions`, and `findings` now keep their review filters in route state instead of relying on shell-level or ad hoc UI controls.
- `2026-04-10`: Updated the system UI plan to reflect the implemented list-review cleanup batch, where `missions`, `plans`, `decisions`, and `findings` now read as product lists instead of generic dashboard or mixed-document surfaces.
- `2026-04-10`: Updated the system UI plan to reflect the implemented second route-cleanup batch, where `mission detail`, `proof`, `scopes`, and routed knowledge detail views now use the primary-versus-inspector content contract instead of defaulting to raw artifact summaries.
- `2026-04-10`: Updated the system UI plan to reflect the implemented grouped left rail plus first-class `plans`, `decisions`, and `findings` routes, so knowledge surfaces now live in the product navigation instead of being buried under docs or artifact links.
- `2026-04-10`: Updated the system UI plan to reflect the first route-cleanup batch in the routed console, where `overview`, `trust`, and `activity` now lead with primary human review surfaces and move supporting detail into the right inspector.
- `2026-04-10`: Updated the system UI plan to reflect the implemented `skopos ui dev` loop, including Vite-backed UI HMR, watched compiled-state refresh for docs and `.skopos/**`, and dev-server file/state endpoints for the routed console.
- `2026-04-10`: Added the routed-console dev-loop plan, making true UI hot reload and watched compiled-state refresh required for docs, plans, decisions, findings, and `.skopos/**` changes instead of treating `ui serve` as sufficient long-term browser workflow.
- `2026-04-10`: Added a navigation and knowledge-routing plan for the routed console, making the left rail, submenu groups, missing knowledge surfaces, and prev-versus-next behavior explicit so plans, decisions, and findings become first-class routes instead of buried artifacts.
- `2026-04-10`: Added a route-by-route information-hierarchy plan for the routed console, making `primary`, `supporting`, `diagnostic`, and `raw` content placement explicit so the next UI batch removes duplicate machine detail from the center pane and uses the right pane as a real contextual inspector.
- `2026-04-10`: Refined the system UI plan around a stronger desktop app-shell doctrine: full-bleed left rail, inset header and content rail, sticky contextual right pane, route-family-specific layouts, tighter type scaling, and lower-chrome surface rules for the next implementation batch.
- `2026-04-10`: Updated the system UI plan to reflect the implemented `skopos ui serve` loop, so the routed console now has a real localhost serving path instead of only static build output.
- `2026-04-10`: Updated the system UI plan to reflect the implemented routed detail-view slice, including a real docs list-detail reader, denser mission detail review surfaces, richer trust signal grouping, and proof comparison readability inside the routed console.
- `2026-04-10`: Updated the system UI plan to reflect the implemented routed-app foundation, including compiled console-state shaping, `skopos ui build`, a Vite-built static app bundle, and hash-routed list-detail navigation across overview, missions, trust, proof, scopes, docs, and activity.
- `2026-04-10`: Updated the system UI plan to reflect the implemented second console slice, which now turns the shell into a real overview and execution cockpit for trust, proof, missions, workflows, and activity instead of only a shell plus generic cards.
- `2026-04-10`: Updated the system UI plan to reflect the implemented first shell upgrade, so future UI work now extends a stable console layout instead of rethinking the shell from scratch.
- `2026-04-10`: Updated the system UI plan with the first shell-layout doctrine, using a calm left-nav, context bar, center work pane, and evidence rail as the structural reference for the first implementation slice.
- `2026-04-10`: Added the first dedicated system UI plan so Skopos can move from a machine-shaped local portal shell toward a polished human project-intelligence console, with pilot readiness as the first delivery milestone.

## Goal

Build the Skopos system UI as a human project-intelligence console that lets engineers understand repo state, trust Skopos recommendations, inspect proof and workflow evidence, and navigate plans and docs without reading raw artifacts.

## Chosen UI Architecture

The primary UI is the routed local app.

Chosen stack:

1. `React`
2. `Vite`
3. `TanStack Router`
4. `Tailwind CSS`

Reference decision:

- `../../scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md`
- `../../scopes/skopos-ui/decisions/archive/009-system-ui-app-shell-and-layout-doctrine.md`

## Product Direction

1. Build a human project-intelligence console, not a generic wiki product.
2. Optimize for product clarity closer to Linear-level operational readability than raw generated-doc rendering.
3. Keep the UI dense, calm, and high-signal instead of graph-heavy or decorative.
4. Treat the UI as a trust and comprehension surface for humans reviewing agent work, not as the primary system of record.
5. Keep tracked project sources authoritative; `.skopos/**` is rebuildable local
   projection state consumed by the UI.
6. Treat doc-owned diagrams and compiled graphs as separate layers: diagrams explain, graphs remain canonical structural artifacts.
7. Add workflow-state UX only when it lowers supervision cost more than it adds product ceremony.
8. Lead with human guidance: status, risk, current attention, next step, blockers, questions, progress, and proof before raw artifact detail.

## Human Guidance UX Contract

Every primary route should answer the user’s practical questions before showing diagnostic detail:

| Route family | Must answer |
| --- | --- |
| `overview` | What needs attention now, why it matters, and what to do next. |
| `mission detail` | What is being worked on, how far along it is, what is blocked, and what proof remains. |
| `trust` | Whether the work can be trusted, what needs review, and what blocks closure. |
| `rules` | Which project rules are active, what each accepted pack means, how to verify pack fit against the real codebase, where accepted policy drift exists, and what local exceptions have been approved. |
| `proof` | What was checked, what passed, what failed, and what evidence still matters. |
| `plans` and `workpacks` | Current phase, approximate progress, next action, open questions, decisions, findings, and closure proof. |
| `docs`, `decisions`, and `findings` | Why the document matters and how it affects current work. |

Raw ids, file handles, JSON snippets, and artifact paths should stay available, but they should not be the first visible explanation for normal users.

## Next Workflow-State Adoption Batch

The routed console now needs to reflect the newer workflow surfaces as product state, not only as CLI or `.skopos` artifacts. The first compact program-control artifact now exists through `.skopos/tasks/queue.json`, so the remaining UI batch should consume the implemented runtime state instead of inventing a parallel planning view.

The next UX batch should stay layered:

1. `overview`
   - current attention
   - `do-now`
   - interrupt guidance
   - highest-priority open question or recommendation
2. `mission detail`
   - upstream program context
   - current recommended next step
   - open obligations
   - evaluation status
   - later, recent discussion context
3. `trust`
   - closure blockers
   - unresolved workflow questions
   - missing evals
   - missing required obligations that affect closure confidence
4. `search dock`
   - jump to program items
   - jump to open questions and recommendations
   - later, jump to recent discussion checkpoints and handoffs

Do not start with a giant workflow dashboard. The mission detail route should remain the primary execution surface, and overview should stay compact and attention-shaped.

This batch must pass one product test: the new workflow-state surfaces should remove confusion about attention, blockers, and next steps without forcing users to manage another large planning view.

The first routed adoption slice is now in place:

1. `overview`
   - compact `Program attention` card
   - `do-now`, `do-next`, and interruption summary
2. `mission detail`
   - `Program context` card
   - open obligations and queued-next visibility
3. `trust`
   - `Program pressure` card for closure-relevant obligations
4. `search dock`
   - jump targets for surfaced program items and open obligations

The remaining UI work should widen carefully from there rather than adding a separate workflow dashboard.

## Discussion Context And Sidebar IA

The next routed-console discussion batch should follow one explicit rule: discussion memory belongs first in the routes that drive active work, not in a new sidebar destination by default.

Phase 1 discussion placement:

1. `overview`
   - compact `Recent discussion`
   - latest handoff summary
   - recent accepted direction or changed rationale
2. `mission detail`
   - `Discussion context`
   - why this mission exists
   - latest accepted direction
   - recent checkpoint changes that affect execution
3. `search dock`
   - jump targets for latest handoff and recent checkpoints
   - jump targets for discussion-derived open questions
4. `trust`
   - only continuity or budget warnings when they affect closure confidence

Do not add a dedicated `Discussion` route until the embedded surfaces exist and the checkpoint volume justifies sequence-level browsing.

The current phase-1 state is now:

1. `overview`
   - latest handoff
   - recent checkpoint preview
2. `mission detail`
   - discussion context
   - mission-linked checkpoint history
3. `search dock`
   - jump targets for handoff and checkpoints
4. `/discussion`
   - dedicated browse page for latest handoff plus checkpoint history
   - now promoted into the `Work` sidebar group after the route proved useful enough to justify first-class navigation
   - now also includes one secondary raw-conversation lane for the latest captured thread turns

5. latest handoff summary in `overview`
6. latest handoff summary in `mission detail`
7. recent checkpoint history in both routes
8. search-dock jump targets for the latest handoff and recent checkpoints

The remaining route question is now narrower: keep the `Discussion` route in the sidebar, but only add deeper discussion-specific product chrome if browsing pressure grows beyond the current checkpoint and handoff history.

The sidebar remains workflow-shaped:

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

This keeps navigation aligned with user intent instead of mirroring every new artifact family directly; `Discussion` now belongs there because it has become a real execution-history surface rather than a thin artifact wrapper.

## Current UI Architecture Audit

The current routed console is strong enough to use, but its architecture is still too route-built:

1. shell widths and reading rails are now normalized, but section density, spacing, and header rhythm still drift between page families and route-specific feature modules
2. the old shared barrel is gone, but some screen and feature modules are still larger than they should be and still carry too much composition detail
3. repeated list rows, detail sections, and review surfaces are not yet fully expressed through stable feature compounds, which keeps some route families noisier than necessary
4. more page-specific shaping still needs to move out of screens and features into stable selectors or compiled projections
5. the compiled state is useful, but too much route-specific presentation logic is still being derived inside components instead of through stable selectors or view-model layers
6. responsive behavior is only partially systematized; the desktop shell is better, but the page families still do not own their own compact and stacked behavior cleanly
7. the docs surface now has real markdown rendering for prose docs plus typed JSON artifact pages for canonical generated state, routed internal knowledge-link resolution, active outline tracking, copyable fenced-code blocks, and polished syntax highlighting, but further reader and artifact polish still needs to stay system-owned rather than drifting back into ad hoc route logic

## Next Architecture Batch

The next UI batch should continue normalizing the system layer on top of the first token pass.

Canonical target source structure for the next batch:

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
```

The Skopos UI should follow the stronger Unisane UI ownership model even though it is implemented as a Vite app rather than a Next.js starter:

`route -> shell -> screen -> page family -> feature -> platform/support/state`

Implementation order:

1. extend the new shell and typography token layer beyond the shared shell into page-family compounds and route-level support primitives
2. split the shared UI layer into `patterns/shells`, reusable primitives, inspector primitives, page-family compounds, and route-support helpers
3. introduce reusable page families for `list`, `detail`, `review`, and `reader` routes so widths and spacing stop drifting by route
4. thin `app/router.tsx` down to route registration and move route composition into `screens/**`
5. move repeated route-level shaping into stable selectors or compiled projections instead of rebuilding support summaries inline
6. standardize the inspector as one product primitive with fixed width, compact summaries, disclosure behavior, and responsive fallback
7. migrate the routed pages in order: list routes first, detail routes second, review routes third
8. finish with a responsiveness and consistency audit, then remove dead or overlapping primitives
9. keep the new markdown-rendering pipeline stable while route-local reader polish, selector cleanup, and responsive normalization continue around it

Current token baseline:

1. shell widths now have named tokens for the left rail, right inspector, and center reading rails
2. routed dynamic pages now share one stable center reading rail instead of drifting through per-route `4xl` / `5xl` choices or page-family width forks
3. shared shell and primitive typography now route through stable roles for page titles, section titles, helper copy, captions, metric labels, and pills
4. shared controls now route through tokenized heights for filter chips, pills, and icon buttons
5. the smallest readable text roles are slightly larger than the earlier undersized baseline, including eyebrow, label, caption, helper, pill, badge, and inspector text roles

Current structural baseline:

1. the old `app/console-shared.tsx` compatibility barrel is gone, so routed screens and features now import owned shell, section, platform, and support modules directly
2. `patterns/shells/**` now own the page frame and route hero shell primitives
3. `patterns/sections/{content,inspector}/**` now own shared content and inspector primitives directly, while the old section-level files act only as thin export surfaces
4. `platform/console-state/**` now owns routed console-state access
5. `platform/console-state/**` now also owns the first route-family selectors for knowledge plans and documents, so plan queues, document classification, ordering, and detail context are no longer shaped inline in one large screen file
6. `support/**` now owns neutral classnames, formatting, execution metrics, tone helpers, and knowledge route helpers, including the canonical `cn` helper backed by `clsx` plus `tailwind-merge`
7. `patterns/pages/**` now own the first reusable `list`, `detail`, `review`, and `reader` page-family wrappers used by the routed views
8. `screens/**` now own routed screen composition, with knowledge now split across dedicated plan and document screen modules instead of one oversized knowledge file, while `app/routes/**` remains only as a compatibility layer during the migration
9. `features/**` now own route-family sections for work overview and mission queue/detail, validation trust/proof/activity, knowledge plans and documents, and structure scope surfaces, so the screen files are no longer the primary home for repeated queue, reader, inspector, and detail-section blocks
10. `features/work/mission-detail/**` and `features/validation/proof/**` now split inspector and center-content ownership into smaller route-family modules instead of leaving those route families trapped in oversized section files
11. `features/knowledge/plans/**` and `features/knowledge/documents/**` now split list, detail, reader, inspector, and sequence ownership into smaller route-family modules instead of leaving knowledge trapped in two large feature files
12. `app/routing/route-config.ts` now owns route metadata, left-rail navigation groups, and list-view normalizers, so `app/router.tsx` stays focused on route registration and shell composition instead of route-policy constants
13. inspector sections now use a stronger accordion-style grammar with clearer headers, larger affordances, and better supporting-section disclosure than the earlier tiny-chevron metadata blocks
14. document sections are now classified as narrative, metadata, changelog, reference, or preview, so docs detail routes can keep the main reader focused and push support context into the inspector
15. routed scroll surfaces now share a thin scrollbar treatment through the shell style layer instead of leaving browser-default scrollbar chrome on the app rails and main review pane
16. docs detail now renders `narrative` and `reference` content through a real markdown renderer, so code blocks, tables, blockquotes, links, inline code, and ordered lists no longer rely on the old text-splitting fallback
17. internal markdown links can now resolve to routed docs, decisions, and findings destinations, and fenced code blocks now use a clearer language-aware shell
18. docs detail now keeps the inspector outline in sync with the active section and exposes a copy affordance for fenced code blocks
19. docs detail now renders highlighted fenced code and keeps the main reader flatter, so the center lane behaves more like a canvas and uses spacing and separators instead of extra inner card chrome for narrative content
20. canonical JSON docs now use typed artifact presenters for `architecture`, `bootstrap`, `diagnosis`, and `index`, so those routes render curated structured sections in the center pane instead of the old `No reader sections` fallback
21. dynamic detail and review routes now use a narrower shared center rail and a flatter canvas-style center lane, while boxed chrome stays concentrated in inspectors, queues, and structured support modules
22. the full fixed shell now starts only at the real pane breakpoint, and the main list routes now share one flatter row grammar so tablet widths and list-review surfaces keep the same canvas-first reading rhythm
23. stacked inspector mode now behaves like normal content flow until desktop panes exist, and the remaining trust and proof center surfaces now follow the same single-column canvas rule instead of keeping leftover desktop-only center grids
24. narrow layouts now have owned responsive header, inspector-summary, and filter-bar behavior at the shared-primitive layer instead of route-specific wrapping drift
25. `platform/console-state/**` now owns work and validation selectors as well as knowledge selectors, so overview, mission queue/detail, trust, proof, and activity screens compose from selector-owned derived state instead of keeping most route shaping inline
26. `application/build-console-state/document-projections.ts` now owns docs-link discovery, document loading, and markdown section classification, so `build-console-state.service.ts` stays focused on console-state assembly and generic artifact loading
27. `support/knowledge/document-reader-{entries,scroll}.ts` now split document-outline entry construction from DOM scroll observation, so the reader support layer no longer keeps both concerns in one mixed helper file
28. the activity route now groups repeated identical operational events, promotes readiness as the real trust outcome, and hides repeated missing-actor noise so the main timeline reads as meaningful operational change instead of raw log spam

Token expectations for the next pass:

1. push the current type scale into route-local list rows, detail sections, and review modules that still carry inline size drift
2. keep one type scale for page titles, section titles, body, helper, caption, and micro labels
3. keep one control-height scale for chips, pills, header controls, compact rows, and inspector sections
4. keep one shell-width and content-width scale for left rail, center reading rail, and right inspector
5. keep one surface and divider system for shell chrome, center canvas, sections, and interactive boundaries

## First-Milestone Problems To Solve

1. Humans need to see whether the repo is `agent-ready`, `needs-review`, or `needs-stabilization` without reading raw JSON.
2. Humans need to understand what Skopos thinks the active scopes, plans, missions, and workflow requirements are.
3. Humans need to inspect closure, proof, and operational provenance quickly enough to decide whether to trust the system.
4. Humans need docs and comparison views that feel product-grade, not machine-shaped.
5. Humans need real route changes and list-detail behavior instead of one long generated page with anchor jumps.

## Required System Surfaces

1. workspace overview:
   - repo health
   - trust level
   - readiness
   - key findings
   - active missions
2. scope explorer:
   - package and workspace slices
   - current versus recommended architecture cues
   - command and workflow entrypoints
3. mission and plan views:
   - active batch
   - linked slices
   - ownership
   - progress
   - blockers
4. trust and closure views:
   - `trust`, `impact`, and `done` state
   - missing evidence
   - stale docs and workflow warnings
5. workflow evidence views:
   - required workflows
   - last successful runs
   - actor attribution
6. proof views:
   - latest scorecard
   - baseline comparison
   - must-win status
   - benchmark categories
7. docs views:
   - readable doc surface
   - authority and freshness indicators
   - clear default routing
8. activity views:
   - recent plans
   - mission changes
   - workflow runs
   - lifecycle events
   - actor-aware provenance
9. comparison views:
   - before-versus-after repo stabilization
   - current versus recommended architecture deltas where relevant

## Delivery Model

Use two rebuildable local projection surfaces:

1. the routed local app is the primary UI and builds into `.skopos/ui/app/`
2. `skopos ui render` produces the local snapshot and graph portal under
   `.skopos/ui/`
3. both surfaces build from compiled Skopos UI projections rather than direct ad hoc
   filesystem reads in components
4. checked-in docs never host Skopos runtime UI output

Supported commands:

1. `skopos ui build`
2. `skopos ui serve`
3. `skopos ui dev`
4. `skopos ui render`

Implemented now:

1. `skopos ui build`
2. `skopos ui serve`
3. `skopos ui dev`
4. compiled console-state artifacts written alongside the app bundle under
   `.skopos/ui/app/`
5. watched console-state refresh through `/__skopos/ui-state` and `/__skopos/file`
6. hash-routed static navigation for the first route family
7. `skopos ui render` available as the local snapshot surface
8. grouped left-rail navigation for `Overview`, `Work`, `Validation`, `Knowledge`, and `Structure`
9. first-class routed surfaces for `plans`, `decisions`, and `findings`
10. the first information-hierarchy cleanup batch on `overview`, `trust`, and `activity`
11. the second information-hierarchy cleanup batch on `mission detail`, `proof`, `scopes`, and routed knowledge detail surfaces
12. the list-review cleanup batch on `missions`, `plans`, `decisions`, and `findings`
13. route-owned filter state on `missions`, `plans`, `decisions`, and `findings`
14. inspector consistency across execution, review, structure, and knowledge routes, including shared `At a glance` and `Source links` inspector patterns
15. wider right-pane variants plus support-only content migration on `overview`, `trust`, `activity`, `mission detail`, and `plan detail`
16. deeper routed review evidence on `trust` and `proof`, including source-derived trust evidence trails, proof comparison drivers, regressed benchmark visibility, and fuller category scorecards
17. tighter shared typography and spacing rhythm across routed review surfaces, plus flatter `mission detail`, `plan`, `docs`, and `scope` detail presentation
18. compact inspector density, including split-row key/value summaries and flatter side lists for support-only metadata
19. classified document sections for narrative versus support context, with the markdown-renderer batch still pending for true narrative-body rendering

Operational posture now:

1. `skopos ui dev` is the default contributor loop
2. keep `skopos ui serve` as preview output, not the final editing workflow

The routed app remains a projection surface. Tracked project sources own durable truth;
`.skopos/**`, including `.skopos/ui/**`, is rebuildable local state.

## Shell Refinement Batch

The routed console now applies the shell-refinement batch so it reads closer to a calm three-pane desktop product:

1. use a consistent fixed inspector width across routed pages instead of per-route width switching
2. reduce the inset center reading rail to approximately `4xl` or `5xl`
3. keep the center lane primarily vertical and review-shaped instead of using equal-weight internal grids by default
4. keep source links in the inspector, not in the global header row
5. replace global header action pills with route-owned prev and next controls where ordered navigation exists
6. use a clearer shell color split:
   - left rail and right inspector as chrome-toned surfaces
   - center lane as the lighter near-white canvas
7. move desktop scroll ownership toward:
   - left rail independent scroll
   - center plus inspector shared main scroll
   - sticky inspector without a second default scrollbar

This refinement now makes the console feel closer to a real product shell and less like a styled dashboard.

## Route Cleanup Direction

### Overview

1. keep active work, attention, and recent movement in the center
2. keep counts, generated time, and support links in the inspector
3. collapse remaining center-side comparison grids into one vertical review flow

### Mission And Plan Detail

1. keep the main workpack or plan body in a single readable center flow
2. move counts, closure posture, validation posture, and source links into the inspector
3. remove remaining internal two-column detail layouts unless they express a real comparison
4. keep plan detail as one document-like sequence instead of splitting implementation, follow-on work, risks, and decision gates into equal-weight mini-cards
5. keep mission detail focused on brief, checklist, and linked work while validation command inventory stays in the inspector

### Scope Detail

1. keep the center lane focused on responsibility and current work instead of sparse metadata blocks
2. keep related plans and missions as one combined work surface rather than separate relationship buckets
3. keep graph coverage and other structural evidence behind inspector disclosure instead of count-heavy summary rows

### Trust, Proof, And Activity

1. keep readiness reasoning, changed proof posture, and grouped recent activity as the primary center surfaces
2. keep full check inventories, scorecards, comparison metadata, source links, and supporting counts behind inspector disclosure
3. avoid making overview a second activity page or making trust/proof routes read like raw inventories

### Lists And Reader Routes

1. `missions`, `plans`, `decisions`, `findings`, `docs`, and `scopes` should keep one primary list or reader surface in the center
2. route metadata, links, and secondary context should stay in the inspector
3. the route header should stay light and sequence-aware rather than becoming a utility-link tray
4. docs detail should render narrative content through a real markdown reader instead of a local text-splitting fallback
5. canonical JSON docs should render through typed artifact presenters instead of empty reader fallbacks or raw JSON dumps
6. metadata, changelog, raw JSON disclosure, and source context should stay classified into the inspector or support disclosure, not drift back into the main reader body
7. list-route inspectors should not repeat current filter state that is already obvious in the route chips
8. list rows should suppress empty metadata such as `no linked mission` or `0 linked slices` unless it changes review judgment
9. fenced `mermaid` blocks may render as doc-owned explanatory diagrams inside the markdown reader
10. compiled `.skopos/graph/*` views must stay on the graph-artifact lane and graph portal instead of becoming generic inline diagrams across the routed app

## App Structure Plan

Keep the current `@skopos/ui` projection layer and expand it into a real app package shape.

Recommended internal structure:

1. `src/application/**`
   - compiled loaders
   - projection builders
   - app-state shaping
2. `src/contracts/**`
   - typed UI-state contracts
3. `src/app/**`
   - React app shell
   - routes
   - layouts
   - view components
4. `src/styles/**`
   - Tailwind entry
   - CSS variable doctrine
   - app-level visual tokens

## Route Model

The first routed console should use real top-level views instead of anchor navigation:

1. `/overview`
2. `/missions`
3. `/missions/:missionId`
4. `/trust`
5. `/proof`
6. `/scopes`
7. `/scopes/:scopeId`
8. `/docs`
9. `/docs/:docId`
10. `/plans`
11. `/plans/:planId`
12. `/decisions`
13. `/decisions/:decisionId`
14. `/findings`
15. `/findings/:findingId`
16. `/activity`

The shell stays stable across routes:

1. left navigation rail
2. top context bar
3. main routed work pane
4. contextual right evidence rail

## Data Flow Plan

The routed app should not read raw runtime state in uncontrolled ways.

Preferred data flow:

1. tracked project sources remain authoritative
2. rebuildable `.skopos/**` artifacts provide compiled local state
3. `@skopos/ui` loaders compile route-ready view models
4. UI build emits app-ready state artifacts under `.skopos/ui/app/`
5. routed views consume typed projections for:
   - overview
   - mission detail
   - trust
   - proof
   - scopes
   - docs
   - activity
6. document projections should continue classifying support sections at build time, while the docs reader renders narrative sections through a real markdown component pipeline in the browser

Hot-reload rule:

1. UI source changes should use frontend HMR
2. content and knowledge changes should rebuild only the affected compiled UI projections
3. the browser should refresh route data without requiring a full manual server restart
4. generated `.skopos/ui/**` output must never trigger another projection refresh

## Development Loop Plan

The routed console needs two distinct feedback loops:

### 1. UI HMR

Use for:

1. React components
2. route files
3. styles
4. layout primitives

This should be powered by the Vite dev server.

### 2. Knowledge Hot Reload

Use for:

1. docs
2. decisions
3. findings
4. plans and missions
5. trust or proof artifacts
6. route-relevant `.skopos/**` state, excluding `.skopos/ui/**`

This should rebuild the relevant compiled projections and refresh the browser data without forcing a full restart.

### 3. Preview Mode

`skopos ui serve` should remain a preview lane:

1. build once
2. serve the built output
3. useful for smoke checks and pilot preview
4. not the long-term editing loop

## Hot Reload Scope Rules

The dev loop should stay incremental and route-aware. It must not rerun a full repo bootstrap on every save.

Preferred watcher behavior:

1. docs changed:
   - rebuild docs index
   - rebuild docs detail
   - rebuild canonical docs order for prev and next
2. decisions or findings changed:
   - rebuild those list and detail projections
3. plans or missions changed:
   - rebuild work routes
4. trust or proof artifacts changed:
   - rebuild validation routes
5. UI source changed:
   - let Vite HMR handle component reload
6. generated `.skopos/ui/**` output or non-route-owned tooling churn changed:
   - do not treat those as live routed-console refresh input

## Local Dev Contract

The intended command contract is:

1. `skopos ui dev`
   - default browser-work loop for contributors
   - Vite HMR for UI code
   - watched compiled-state refresh for docs and route-relevant `.skopos/**`
   - `.skopos/ui/**` excluded from watcher inputs
2. `skopos ui serve`
   - preview and smoke-check lane for `.skopos/ui/app/`
3. `skopos ui build`
   - routed-app generation under `.skopos/ui/app/`
4. `skopos ui render`
   - local snapshot and graph-portal generation under `.skopos/ui/`

## Design System Direction

Use Tailwind for speed, but do not let the UI collapse into generic utility-first visuals.

Rules:

1. define CSS variables for the Skopos visual system
2. use Tailwind for layout, spacing, sizing, and responsive behavior
3. keep typography, status language, panel rhythm, and density deliberate
4. use low-level accessible primitives only where needed
5. avoid generic dashboard kits and default template aesthetics

## Current Surface Strategy

1. The routed app is the primary local console and builds under `.skopos/ui/app/`.
2. The HTML renderer is a local snapshot surface under `.skopos/ui/`.
3. Neither surface is durable project truth or checked-in documentation.
4. Both surfaces may be deleted and rebuilt from tracked sources plus compiled local
   state.

## Experience Standard

1. Use a real visual system with clear layout, spacing, typography, and state hierarchy.
2. Make important state legible at a glance:
   - good
   - warning
   - blocking
   - historical
3. Prefer concise cards, tables, and timelines over raw artifact dumps.
4. Show machine details behind progressive disclosure instead of forcing them as the default reading mode.
5. Keep navigation fast and obvious:
   - overview
   - scopes
   - missions
   - trust
   - proof
   - docs
   - activity
6. Preserve token-friendly compiled knowledge underneath the UI instead of rebuilding state in the renderer.

## Shell Layout Doctrine

1. Use a full-height, full-bleed left navigation rail for workspace framing and primary route families.
2. Apply width constraints to the inner header and content rail, not to the whole app shell.
3. Keep the center pane as the primary routed work surface with readable line length closer to `5xl` or `6xl` content rhythm.
4. Use a sticky right-side contextual pane on desktop for evidence, properties, freshness, ownership, proof, and trust context.
5. Prefer pane layouts and list-detail flows over generic page-card stacking.
6. Keep visual density calm and compact, with subtle separators instead of loud chrome.
7. Use layout discipline similar to high-quality operational products, but map it to Skopos trust, proof, docs, and mission workflows rather than issue-tracker semantics.

## Reference Analysis

The current references point toward a better fit for Skopos than the earlier centered-page shell.

Borrow:

1. full-height desktop rails
2. inset content rails with readable line length
3. strong breadcrumb plus title framing
4. pane-based detail views
5. low-chrome boundaries and compact spacing
6. quiet side properties panels

Do not borrow blindly:

1. issue-tracker semantics
2. collaboration-first comments as the main product posture
3. oversized whitespace intended for generic docs-marketing surfaces
4. notebook-style page metaphors where Skopos needs operational review clarity

## Geometry And Spacing Doctrine

### Shell

1. Left rail:
   - desktop flush to viewport edge
   - independent scroll
   - stable width around `15rem` to `16rem`
2. Header and content rail:
   - shared inset
   - centered within the main pane
   - constrained width around `80rem` to `84rem`
3. Right pane:
   - desktop sticky
   - contextual and secondary
   - narrower than the center pane

### Spacing

1. Use a restrained spacing scale:
   - `4`
   - `8`
   - `12`
   - `16`
   - `20`
   - `24`
   - `32`
2. Prefer `16` for panel padding and `20-24` for major section spacing.
3. Do not use nested card padding stacks where a divider or section spacing is enough.

### Surface Rules

1. Keep radii restrained and near-square.
2. Remove ornamental shadowing from normal panels.
3. Use one outer boundary plus inner section separation where possible.
4. Prefer subtle background steps and dividers over more borders.

## Typography Doctrine

Use a narrow, compact scale:

1. page title:
   - mobile around `26/32`
   - desktop around `32/38`
2. section title:
   - around `20/28`
3. panel title:
   - around `15/22`
4. body:
   - around `13.5/20`
5. metadata and support text:
   - around `11-12/18`

Rules:

1. no oversized hero typography
2. no marketing-like scale jumps
3. high emphasis through weight and spacing, not just size

## Route Family Layout Plan

Do not force every route into one generic content pattern.

### 1. Overview

1. compact summary-first header
2. high-signal modules only
3. sticky right context pane for posture, attention, and shortcuts

### 2. List Review

Used for:

1. `missions`
2. `scopes`
3. `docs` index

Rules:

1. rows or low-chrome cards that feel app-like
2. right pane for posture, counts, filters, or recent related state
3. list density should be tighter than the current route modules

### 3. Detail Review

Used for:

1. `mission detail`
2. `scope detail`
3. `docs detail`

Rules:

1. center pane behaves like a readable working document
2. right pane stays sticky and holds compact properties and evidence
3. center body should have fewer border interruptions and a stronger reading flow

### 4. Evidence Review

Used for:

1. `trust`
2. `proof`

Rules:

1. separate signal, evidence, and machine detail clearly
2. keep summary context sticky in the right pane
3. category groups should read like review modules, not dashboard widgets

### 5. Activity

1. center pane reads like a recent-changes feed grouped by day
2. plans, missions, workflow runs, and grouped operational events share one chronological center canvas
3. repeated identical operational events collapse into one grouped feed entry instead of spamming the route
4. right pane carries compact counts and latest-activity context only

## Navigation Strategy

1. Left rail owns only major route families.
2. Secondary route controls should live within the route body or route header, not inside the global rail.
3. Breadcrumbs should stay light and contextual.
4. Header actions should remain minimal and high-value.
5. Route changes must feel routed, not like intra-page jumps.

## Sidebar And Navigation Model

The left rail should stay clean and stable. It should not become a second document tree or an artifact dump.

### Left Rail Structure

1. workspace identity block:
   - workspace name
   - short descriptor
   - optional workspace switch affordance later
2. search or command affordance:
   - compact `jump to` trigger only
   - shortcut hint if useful
   - not a second full search field
3. primary navigation groups
4. compact status footer:
   - readiness
   - trust
   - active missions

Do not default-show:

1. absolute filesystem path as a large text block
2. repeated route-specific summaries
3. raw artifact counts

### Recommended Primary Navigation Groups

1. `Overview`
2. `Work`
   - `Missions`
   - `Plans`
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

This should stay the default desktop navigation model unless a future pilot proves a simpler grouping works better.

### Sidebar Behavior Rules

1. one active route group should be visually obvious
2. submenu groups should be collapsible, but not deeply nested
3. only show counts when they are meaningful:
   - non-zero
   - or strongly decision-relevant
4. badges should be rare and reserved for:
   - active work
   - blocking state
   - warning posture
5. list-page filters do not belong in the global left rail

## Search And Command Dock

The routed console should use one primary search surface, and it should not live in the header or become a second sidebar field.

### Search Surface Model

1. the primary search surface is a fixed bottom-center dock
2. the dock should feel closer to a workspace command surface than a navbar search field
3. results should open upward from the dock, not downward from the header
4. `Cmd/Ctrl+K` should open the dock everywhere in the routed app

### Search Behavior Rules

1. search compiled console state first
2. rank exact and canonical results first
3. group results by route or object family
4. keep the dock keyboard-first with arrows, `Enter`, and `Escape`
5. reserve semantic search for fallback only after the exact-first compiled path exists

Phase 1 is now implemented in the routed console. The next search batch should build the dedicated compiled search index instead of re-litigating dock placement or adding a second search surface.

### Search Sources

1. routes
2. scopes
3. docs
4. plans
5. missions
6. decisions
7. findings
8. activity entrypoints
9. graph entrypoints

Do not default to raw filesystem search from the UI.

## Knowledge And Governance Surfaces

The UI currently hides important durable knowledge by not routing it directly. Plans, decisions, and findings should be first-class surfaces, not only links inside docs or artifacts.

### Plans

Purpose:

1. show planning intent before execution detail
2. let humans compare proposed workpacks and linked missions

Routes:

1. `/plans`
2. `/plans/:planId`

Layout:

1. list-review for the index
2. detail-review for the selected plan

### Decisions

Purpose:

1. expose accepted constraints and major product decisions
2. keep the reasoning path visible without forcing doc-tree digging

Routes:

1. `/decisions`
2. `/decisions/:decisionId`

Layout:

1. list-review for the index
2. docs-like detail review for the decision body

### Findings

Purpose:

1. expose active product gaps and friction discovered during dogfooding
2. keep current findings visible without sending humans into the filesystem

Routes:

1. `/findings`
2. `/findings/:findingId`

Layout:

1. list-review for active findings
2. detail-review for one finding
3. archive access should remain secondary

## Prev And Next Navigation Rules

Prev or next controls should never float as a generic global chrome element. They should belong to the route family that owns sequence.

### Docs Detail

1. provide prev and next at the document footer
2. optionally mirror them in the right pane under the outline or document meta section
3. sequence should follow the canonical docs order, not filesystem order

### Decisions And Findings Detail

1. provide prev and next inside the detail surface only when viewing from an ordered list
2. sequence should follow the filtered current list, not global chronology by default

### Missions And Plans Detail

1. prefer list selection and row-to-detail routing over generic prev and next buttons
2. if keyboard navigation exists later, it should respect the current filtered result set

### Global Rule

1. no global shell-level prev and next for entity navigation
2. use breadcrumbs for hierarchy
3. use in-route prev and next only where sequence is real and helpful

## Information Hierarchy Doctrine

Every routed surface should classify data into one of four levels:

1. `primary`
   - the main thing the human came to read, decide, or act on
2. `supporting`
   - compact context that helps interpret the main surface
3. `diagnostic`
   - lower-level system detail that is sometimes useful but should not dominate
4. `raw`
   - ids, filesystem paths, artifact names, generated-state dumps, and other machine-facing truth

Placement rules:

1. center pane:
   - `primary` first
   - `supporting` second
2. right pane:
   - `supporting` by default
   - a small amount of `diagnostic`
3. raw details:
   - never default-primary
   - shown only through:
     - `open source`
     - `view artifact`
     - `copy id`
     - progressive disclosure
4. sidebar:
   - route navigation
   - minimal global posture only

## Default Demotion Rules

The following should not appear as first-class center-pane content by default:

1. absolute filesystem paths
2. long mission ids and plan ids
3. artifact filenames as the main reading surface
4. repeated readiness and trust labels across sidebar, center pane, and right pane
5. repeated shortcut links in both the top header and the right pane
6. zero-value counts such as:
   - `workflow runs: 0`
   - `actors: 0`
   - similar low-signal summaries
7. machine-environment trivia such as:
   - ignored roots
   - docs roots
   - frameworks
   - languages
   - repo mode
     unless that route is explicitly about diagnosis
8. wide metric grids when one compact summary plus one main review surface would communicate better

## Route-Level Information Plan

### Overview

Center pane should show:

1. current workspace posture
2. active mission focus
3. attention items
4. recent plan changes or other small supporting movement that helps explain current focus

Move out of the center pane:

1. broad proof category lists
2. graph and artifact counts that do not help a decision
3. repeated state summaries already visible elsewhere
4. generic source-link trays

Right pane should carry:

1. compact workspace posture
2. last update time
3. high-level support metrics only

### Trust

Center pane should show:

1. readiness result
2. blockers or warnings
3. why Skopos considers the workspace healthy or not
4. the shortest path to fixing or validating trust concerns

Move out of the center pane:

1. repo mode
2. archetype
3. docs-root trivia
4. ignored roots
5. framework and language lists
6. full check inventory

Right pane should carry:

1. last trust run metadata
2. assumption or finding counts
3. docs posture and workspace signals
4. related source links
5. full check inventory behind disclosure

### Proof

Center pane should show:

1. overall proof result
2. must-win failures or regressions first
3. category changes that matter
4. only the proof comparisons that materially change review judgment

Right pane should carry:

1. run metadata
2. baseline comparison detail
3. full category scorecard
4. report and source links

### Activity

Center pane should show:

1. a mixed recent-changes feed as the primary surface
2. grouped operational events when they summarize repeated identical runtime behavior
3. plan, mission, and workflow movement directly in the center lane when they are part of the recent chronology

Move out of the right pane:

1. recent plans or missions that are part of the main chronology
2. duplicated counts that do not help interpretation
3. zero-value summaries

Right pane should carry:

1. current filters
2. latest event detail
3. compact event context

### Missions List

Center pane should show:

1. active missions first
2. completed missions second
3. strong scanability over boxed dashboards

Right pane should carry:

1. filters
2. compact counts
3. selected mission preview

### Mission Detail

Center pane should show:

1. title and objective
2. progress and checklist
3. linked slices
4. closure pressure and required work

Right pane should carry:

1. owner
2. scope
3. required workflows
4. recent evidence
5. related plan

Raw ids should be shortened and copyable, not rendered as the primary reading experience.

### Scopes

List page:

1. searchable scope list in the center pane
2. posture, filters, and selected preview in the right pane

Detail page:

1. main responsibility and command surface in the center pane
2. metadata, docs, and linked work in the right pane

### Docs

List page:

1. readable index in the center pane
2. source, authority, and freshness context in the right pane

Detail page:

1. reader-first document surface in the center pane
2. metadata, outline, source link, and authority in the right pane

Raw source paths should remain secondary metadata only.

## Implementation Batch Plan

### Batch A: Shell And Tokens

1. finalize app shell geometry
2. define layout tokens
3. define type scale
4. define spacing and surface rules

### Batch B: Shared Layout Primitives

1. page frame variants
2. pane layouts
3. list row primitives
4. detail body primitives
5. right-pane section primitives
6. left-rail navigation primitives
7. in-route sequence navigation primitives
8. routed dev-state and refresh primitives

### Batch C: Route Family Conversion

1. `overview`
2. `trust`
3. `activity`
4. `missions`
5. `mission detail`
6. `plans`
7. `plan detail`
8. `proof`
9. `scopes`
10. `docs`
11. `docs detail`
12. `decisions`
13. `decision detail`
14. `findings`
15. `finding detail`

### Batch D: Final Polish

1. consistency pass
2. typography tuning
3. spacing cleanup
4. responsive refinement
5. serving and route polish for pilot use

## Explicit Non-Goals

1. Do not build a collaborative docs editor in this batch.
2. Do not build a generic Notion-style workspace.
3. Do not turn graphs into the main product surface.
4. Do not add broad analytics dashboards that are not tied to trust, proof, or repo understanding.
5. Do not treat generated `.skopos/**` projections as durable project truth.
6. Do not treat Mermaid diagrams as canonical relationship truth when a compiled graph artifact already owns that surface.

## Implementation Sequence

1. lock the routed app architecture and selected stack
2. lock the shell-layout doctrine and information-hierarchy doctrine together
3. keep the routed app shell as the active base instead of returning to the one-page renderer
4. keep `skopos ui dev` as the default contributor loop:
   - Vite HMR for UI source
   - watched projection refresh for docs and route-relevant `.skopos/**`
   - no refresh loop from `.skopos/ui/**` output
   - route-aware invalidation rather than full rebuild on every change
5. implement left-rail navigation and submenu primitives for:
   - `Work`
   - `Validation`
   - `Knowledge`
   - `Structure`
6. implement shared visibility helpers for:
   - short ids
   - relative labels
   - copy and open actions
   - raw-detail disclosure
7. redesign `overview`, `trust`, and `activity` around primary versus supporting content
8. add routed `plans`, `decisions`, and `findings` surfaces so durable knowledge is visible in the product UI
9. redesign `missions` and `mission detail` around list-review and detail-review flows
10. redesign `proof`, `scopes`, and `docs` with the same placement rules
11. add route-owned prev and next only for docs and other clearly ordered detail surfaces
12. add comparison views and deeper evidence panels only after the route surfaces stop duplicating machine detail
13. perform a final consistency pass on the self-hosted Skopos subtree

## First-Milestone Gate

1. the proof scorecard stays passing
2. the UI clearly communicates trust and closure state without raw artifact reading
3. the UI clearly distinguishes authoritative, generated, inferred, and stale information
4. the UI is stable on the self-hosted Skopos workspace
5. the UI remains focused on the supported Node and TypeScript brownfield lane
6. the pilot UI uses real routed navigation instead of same-page anchor jumping for core views
7. the center pane does not default to raw ids, paths, artifact filenames, or duplicate state summaries
8. the right pane behaves like a contextual inspector instead of a second copy of the page body
9. contributors can edit tracked docs or regenerate route-relevant `.skopos/**` state
   and see the routed console refresh without manually restarting the UI server
