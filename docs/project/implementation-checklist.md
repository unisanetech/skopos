# Skopos Implementation Checklist

Use this checklist to keep Skopos build work aligned with the agreed product vision, package boundaries, and governance model.

## Metadata

- Doc ID: `SKOPOS-PROJECT-IMPLEMENTATION-CHECKLIST`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-06-26`
- Review Cycle: `per workpack`
- Related Docs:
  - `overview.md`
  - `vision.md`
  - `positioning.md`
  - `missing-decisions-checklist.md`
  - `proof-phase-plan.md`
  - `system-ui-plan.md`
  - `policy-pack-and-stack-intelligence-plan.md`
  - `human-guidance-and-developer-experience-plan.md`
  - `roadmap.md`
  - `../architecture/00-architecture.md`
  - `../architecture/package-boundaries.md`
  - `../architecture/runtime-model.md`
  - `../architecture/config-model.md`
  - `../architecture/artifact-model.md`
  - `../architecture/retrieval-and-query-strategy.md`
  - `../architecture/trust-and-closure-model.md`
  - `../architecture/decision-escalation-model.md`

## Changelog

- `2026-06-27`: Added first-release version policy: keep package versions aligned at `0.1.0`, publish only `@skopos/cli@0.1.0` on `next`, and hold `latest` until real registry smoke passes.
- `2026-06-26`: Added Apache-2.0 license metadata and package license inclusion to the bundled CLI release contract.
- `2026-06-26`: Added the bundled CLI release contract with clean package files, public `@skopos/cli` metadata, and release smoke coverage for installed binary, npm-exec/npx-style use, and pnpm-dlx use.
- `2026-06-24`: Added a human review card for saved local role mappings on pack detail pages, so inferred folder-to-role evidence is visible and explainable in the console.
- `2026-06-24`: Added `skopos policies mappings` and role-mapping decision persistence, so users can confirm, ignore, remove, or manually path local role mappings without editing generated JSON.
- `2026-06-24`: Added persisted local role mapping to accepted policy application, policy briefs, and the Rules UI, so agents can reuse verified folder-to-role evidence across sessions.
- `2026-06-24`: Added brownfield-safe role mapping to pack review, so Skopos records checked aliases and matched aliases and can prove that different existing folder names still satisfy architecture roles.
- `2026-06-24`: Made the seeded architecture pack more project-agnostic by rendering composition-root, feature, infrastructure, shared, UI, generated, and docs roles first while keeping local folder names as aliases for codebase matching.
- `2026-06-24`: Implemented dedicated rule-pack detail pages with structure-tree matching, architecture contract fields, gates, prompts, search entries, and focused UI coverage for the seeded architecture pack.
- `2026-06-24`: Expanded the routed Rules review surface with pack-detail cards that expose fit guidance, codebase verification signals, questions, quality bars, rule previews, and source paths from full pack manifests.
- `2026-06-24`: Added the routed Rules review surface so accepted packs, active rules, drift, local exceptions, and lane guidance are visible in the human console.
- `2026-06-24`: Added local accepted-policy override management and `done` closure blocking for open accepted `must` drift, so intentional exceptions are explicit and unresolved blocking drift cannot close silently.
- `2026-06-24`: Expanded Pack System V1 with richer human-readable pack metadata, composable accepted policies, the `stack.async-work` pack, and the `gates.progressive-validation` pack.
- `2026-06-24`: Implemented the decisions/findings progress and guided-question CLI slice, so mission progress now includes decision and finding summaries while `start`, `plan`, and `decide` present questions with recommendations, tradeoffs, and next-step guidance.
- `2026-06-24`: Implemented the first mission-backed progress-summary slice, so `next`, `eval`, and `done` output now show progress, current phase, done, doing-now, blockers, and proof-needed guidance from existing mission truth.
- `2026-06-24`: Implemented the second human-output CLI slice for workflow commands, so `next`, `program sync`, `program next`, `done`, and `eval` now lead with plain-language status and next-step guidance.
- `2026-06-24`: Implemented the first human-output CLI slice for trust and policy commands, so default text output now leads with plain-language status, attention items, and next steps while JSON output remains stable.
- `2026-06-24`: Added the human guidance and developer experience implementation slice so Skopos now treats plain-language output, guided questions, workpack progress, and next-step visibility as required product behavior rather than optional copy polish.
- `2026-06-24`: Added the first accepted-policy drift detection slice with `skopos policies drift`, `.skopos/drift/report.json`, heuristic `architecture.mid-app` checks, policy-drift operational events, and trust integration for missing, stale, warning, and blocking drift reports.
- `2026-06-24`: Implemented the first policy recommendation and acceptance loop: `skopos policies recommend`, `skopos policies apply`, resolved-policy persistence, policy brief generation, AGENTS.md policy section updates, prompt-layer integration, and trust checks that stay progressive unless policy packs are present.
- `2026-06-24`: Added the first policy-pack catalog runtime and CLI command surface so built-in pack manifests are schema-validated and discoverable before recommendation or acceptance workflows land.
- `2026-06-24`: Seeded the first real `architecture.mid-app` policy pack source with manifest, rules, policy docs, drift checks, and proof fixtures so pack work starts from product-grade source material instead of placeholder prompts.
- `2026-06-24`: Clarified that policy-pack implementation must preserve Skopos as a project-agnostic LLM coding-agent memory layer, with freshness and drift protection for project knowledge rather than Unisane-only doctrine.
- `2026-06-24`: Added policy-pack and stack-intelligence implementation planning so future Skopos work treats architecture, clean-code, naming, UI, gates, and stack recommendations as governed, accepted, enforceable project intelligence rather than dummy prompt packs.
- `2026-04-17`: Added the initial synthesized repo-understanding contract and active workpack, so brownfield onboarding is now expected to produce a compact understanding layer above bootstrap, scope, symbol, and graph artifacts instead of relying on raw machine-readable surfaces alone.
- `2026-04-16`: Added the self-healing product-loop decision and bounded hardening workpack, so Skopos implementation now treats pilot-discovered product friction as tracked hardening tracks with cross-workspace proof instead of resuming broad feature-first growth.
- `2026-04-13`: Added the multi-agent adapter lifecycle decision and active follow-through workpack, so the next continuity batch is now explicitly Codex and broader host integration against the shared `skopos discuss` lane instead of a vague post-Claude extension.
- `2026-04-13`: Landed the first discussion-context UI slice, so the routed console now projects the latest workflow handoff into `overview`, `mission detail`, and the search dock; the remaining discussion-memory UI work narrows to richer checkpoint exposure rather than the absence of any product surface.
- `2026-04-13`: Added the discussion-context and sidebar information-architecture contract to the checklist, so the next UI work now embeds handoff and checkpoint context into `overview`, `mission detail`, and the search dock first instead of jumping directly to a top-level discussion page.
- `2026-04-12`: Added the token-control and compact-agent-transport contract to the checklist, so the next implementation work now prioritizes compact command output, `.skopos/agent/**` briefs, docs lifecycle filtering, lane minimization, and compact heavy-job polling before more control-plane growth.
- `2026-04-12`: Updated the checklist after the first routed program-state UI slice landed, so `overview`, `mission detail`, `trust`, and the search dock now consume `.skopos/program/state.json` while the remaining workflow-state work shifts to questions/recommendations visibility and discussion-memory promotion instead of still treating basic UI adoption as pending.
- `2026-04-12`: Updated the checklist after the first low-noise program-router slice landed, so `.skopos/program/state.json`, `skopos program sync`, and `skopos program next` are now implemented while the next structural work shifts to discussion-memory inputs and routed UI adoption instead of still treating the whole program lane as pending.
- `2026-04-12`: Added the supervision-cost and workflow-weight discipline to the implementation checklist, so new Skopos features now need to justify their supervision savings against the process weight they add before another artifact, command, or UI surface lands.
- `2026-04-12`: Updated the checklist with the accepted program-router and obligation contract, so the next structural slice now adds `.skopos/program/state.json`, cross-mission sequencing, interruption guidance, and typed docs plus UI obligations above the implemented mission router instead of leaving that control plane in user memory.
- `2026-04-12`: Updated the checklist after execution-surface guidance landed, so the router now defaults real batches to `artifact-only` and only recommends a temporary workpack doc when workspace breadth, decision gates, or coordination pressure justify the extra planning surface.
- `2026-04-12`: Updated the checklist after the discussion-memory contract landed, so the next structural implementation batch now adds compact discussion checkpoints, handoffs, and adapter-triggered continuity hooks instead of relying on raw chat replay after the router and closure layers.
- `2026-04-12`: Updated the checklist after trust-and-done closure integration landed, so unresolved blocking workflow questions and missing or incomplete mission eval artifacts now gate closure directly and the next workflow batch shifts from closure enforcement to adapter plus UI adoption of the router.
- `2026-04-12`: Updated the checklist after the eval-to-closure handoff fix, so successful mission evaluation now reconciles remaining non-decision checklist items and the router can recommend explicit mission completion instead of leaving closure-state drift behind.
- `2026-04-12`: Updated the checklist after the CLI surface decomposition batch, so `packages/cli/src/cli.ts` is now a thin bin entrypoint backed by command-owned modules and a registry layer instead of a single-file command bucket.
- `2026-04-12`: Updated the checklist after `skopos eval` landed, so the runtime router baseline now includes mission-level evaluation artifacts and the remaining structural batch narrows to trust-and-closure integration on top of `start`, `next`, `decide`, and `eval`.
- `2026-04-12`: Updated the checklist after `skopos next` landed, so the runtime router baseline now includes durable ongoing mission routing on top of `start` plus `decide` and the remaining structural batch narrows to `skopos eval` plus trust-closure integration.
- `2026-04-11`: Updated the checklist after `skopos decide` landed, so durable bounded decision recording is now implemented on top of `start` and the next structural batch shifts to `skopos next`, `skopos eval`, and trust-closure integration.
- `2026-04-11`: Updated the checklist after the first workflow-router slice landed, so `skopos start` plus durable `questions` and `recommendations` artifacts are now implemented while the next structural batch shifts to `skopos next`, `skopos decide`, `skopos eval`, and trust-closure integration.
- `2026-04-11`: Updated the checklist to add the accepted workflow-router and supervision contract, so the next structural implementation slice is now `skopos start`, `skopos next`, `skopos decide`, `skopos eval`, and the related `questions`, `recommendations`, and `evals` artifacts rather than more prompt-only workflow tightening.
- `2026-04-11`: Updated the checklist to reflect the implemented Phase 2 search index, so the routed console now ships a generated search-entry surface with aliases, headings, excerpts, and route metadata while the bottom-center dock consumes that compiled index instead of rebuilding results ad hoc in the browser.
- `2026-04-11`: Updated the checklist to reflect the hardened `skopos ui dev` watcher scope after a self-hosted macOS watcher OOM, so generated app output under `docs/generated/skopos/app/**` and non-route-owned `.skopos/tooling/**` no longer participate in the live routed-console refresh loop.
- `2026-04-11`: Updated the checklist to reflect the implemented Phase 1 search dock, so the routed console now has one bottom-center command surface with grouped upward-opening results, keyboard navigation, and exact-first compiled-state ranking while the next search work moves to a generated search index instead of more shell placement debate.
- `2026-04-11`: Updated the checklist with the accepted search-and-command dock doctrine, so the next search implementation is now constrained around one bottom-center fixed dock, grouped upward-opening results, exact-first compiled-state retrieval, and a lightweight left-rail trigger instead of multiple competing search fields.
- `2026-04-11`: Updated the checklist to reflect the accepted diagram-versus-graph contract and the first Mermaid reader implementation, so doc-owned explanatory diagrams can now render inline in markdown docs while compiled `.skopos/graph/*` artifacts remain the canonical structural relationship lane.
- `2026-04-11`: Updated the checklist to reflect typed canonical JSON artifact pages in docs detail, so `bootstrap`, `diagnosis`, `architecture`, and `index` JSON now render through structured artifact presenters with raw JSON kept behind secondary disclosure instead of the old empty-reader fallback.
- `2026-04-11`: Updated the checklist to reflect the simplified sidebar-footer batch, so the left rail now uses one compact status panel with tighter rows, smaller dock pills, and concise mission-count wording instead of a larger footer section with repeated heading chrome.
- `2026-04-11`: Updated the checklist to reflect the sidebar-shell refinement batch, so the left rail now uses a denser brand block, tighter nav-group rhythm, smaller row padding, and a compact status dock instead of the earlier duplicated workspace section and stretched footer.
- `2026-04-11`: Updated the checklist to reflect the list-inspector and empty-state wording cleanup batch, so list-route support cards now use clearer inventory labels and the remaining empty or missing states now read like product guidance instead of snapshot-heavy mechanical copy.
- `2026-04-11`: Updated the checklist to reflect the proof-inspector and route-copy cleanup batch, so the proof inspector no longer repeats baseline-drift metrics across multiple support cards and the remaining screen-level route descriptions now describe workspace state instead of product-internal narration.
- `2026-04-11`: Updated the checklist to reflect the inspector-preview and route-copy cleanup batch, so truncated support lists now say when they are previews and the remaining center-lane section descriptions now describe workspace state instead of UI implementation behavior.
- `2026-04-11`: Updated the checklist to reflect the inspector-truthfulness and dead-support cleanup batch, so inspector badges now report real totals even when lists are visually truncated and stale trust/proof support surfaces are no longer left behind in the shared feature layer.
- `2026-04-11`: Updated the checklist to reflect the shared inspector and list-review polish batch, so list-route inspectors stop repeating filter state, list rows hide low-value empty metadata, and inspector disclosure reads less like a utility control strip.
- `2026-04-11`: Updated the checklist to reflect the plan, mission, and scope detail cleanup batch, so plan detail now reads as one document-style canvas, mission detail keeps validation command inventory in the inspector, and scope detail now treats related plans and missions as one current-work surface.
- `2026-04-11`: Updated the checklist to reflect the proof, trust, and overview hierarchy cleanup batch, so proof and trust inventories now live in support disclosure instead of the main canvas and overview no longer behaves like a second activity page.
- `2026-04-11`: Updated the checklist to reflect the activity-route mixed-feed redesign, so plans, missions, workflow runs, and grouped operational events now share one center-lane recent-changes feed while the right pane stays limited to compact support context.
- `2026-04-11`: Updated the checklist to reflect the activity-route timeline cleanup, so repeated identical operational events now collapse into grouped timeline entries, trust activity surfaces readiness as the real outcome, and empty actor metadata no longer dominates the page.
- `2026-04-11`: Updated the checklist to reflect the platform-layer document projection split and reader-support split, so docs link discovery, document loading, and markdown section classification now live in `application/build-console-state/document-projections.ts` while reader entry-building and active-section scroll behavior now live in `support/knowledge/document-reader-{entries,scroll}.ts`.
- `2026-04-11`: Updated the checklist to reflect the shared primitive and routing-policy split, so section primitives now live under `patterns/sections/{content,inspector}/**` and route metadata, nav groups, and list-view normalizers moved into `app/routing/route-config.ts`.
- `2026-04-11`: Updated the checklist to reflect the deeper knowledge feature decomposition pass, so plans and docs now split list, detail, reader, inspector, and sequence ownership across smaller route-family modules instead of depending on two large feature files.
- `2026-04-11`: Updated the checklist to reflect the deeper work and validation feature decomposition pass, so mission detail and proof now split inspector and center-content ownership into smaller route-family modules instead of depending on oversized section files.
- `2026-04-11`: Updated the checklist to reflect the work and validation selector cleanup pass, so overview, mission queues/detail, trust, proof, and activity screens now compose mostly from selector-owned derived state instead of route-local shaping code.
- `2026-04-11`: Updated the checklist to reflect the narrow-layout responsive audit pass, so header actions now wrap cleanly, stacked inspector summaries use a readable one-column rhythm, and route filter bars own horizontal overflow instead of wrapping unpredictably.
- `2026-04-11`: Updated the checklist to reflect the stacked-flow and center-canvas normalization pass, so stacked inspector mode now behaves like normal content flow before desktop panes exist and the remaining trust/proof center surfaces now read as one vertical review flow.
- `2026-04-11`: Updated the checklist to reflect the responsive shell-normalization and list-row polish pass, so the full fixed shell now starts only at the real pane breakpoint and the main list routes share a flatter canvas-style row grammar instead of boxed queue containers.
- `2026-04-11`: Updated the checklist to reflect the broader canvas-first center-lane pass, so overview, trust, and the main detail routes now use separators and spacing instead of nested boxed panels for high-signal center content.
- `2026-04-11`: Updated the checklist to reflect the narrower center reading rail and the first canvas-style detail-route pass, so the inset body now reads closer to a document canvas while boxed chrome stays reserved for support surfaces.
- `2026-04-11`: Updated the checklist to reflect polished syntax highlighting and flatter reader-body chrome, so docs detail now renders code with a real highlighted shell and keeps narrative content less boxed and more readable.
- `2026-04-11`: Updated the checklist to reflect active reader-outline tracking and copyable fenced-code blocks, so docs detail now keeps the inspector synced to the current section and code examples expose a product-grade copy affordance.
- `2026-04-11`: Updated the checklist to reflect internal knowledge-link routing and richer fenced-code presentation in the markdown reader, so routed docs links can stay inside the app and code blocks now use a clearer language-aware shell.
- `2026-04-11`: Updated the checklist to reflect the implemented markdown-rendering and docs-reader pipeline, so docs detail routes now render narrative content semantically instead of through the old local text splitter while metadata and changelog stay in the inspector.
- `2026-04-11`: Updated the checklist to add the accepted markdown-rendering and docs-reader pipeline, so the next docs-reader batch replaces the current light narrative-body splitter with a real markdown renderer while keeping metadata and changelog in the inspector.
- `2026-04-11`: Updated the checklist to reflect the stronger inspector-section grammar, the raised small-text token floor, and classified document sections, so docs detail routes now move metadata and changelog context into the inspector and remove visible `H1` / `H2` machine markers from the reader.
- `2026-04-11`: Updated the checklist to reflect the first route-family knowledge selector split, where plans and documents now use separate screen modules, plan and document shaping moved into `platform/console-state/knowledge-selectors.ts`, and shared knowledge route helpers moved into `support/knowledge/document-routing.ts`.
- `2026-04-11`: Updated the checklist to reflect the removal of the old shared compatibility barrel, the canonical `cn` helper backed by `clsx` plus `tailwind-merge`, and the deeper route-family feature split across work, validation, and knowledge sections.
- `2026-04-11`: Updated the checklist to reflect the first `features/**` extraction baseline and the thin-scrollbar shell policy in `@skopos/ui`, where repeated work, validation, knowledge, and structure sections now live outside `screens/**` and the routed shell uses one quieter scrollbar treatment across scroll surfaces.
- `2026-04-11`: Updated the checklist to reflect the first `screens/**` migration baseline in `@skopos/ui`, where router-owned route composition now imports from screen modules and `app/routes/**` has been reduced to compatibility re-exports.
- `2026-04-11`: Updated the checklist to reflect the first page-family migration baseline in `@skopos/ui`, where routed views now compose through owned `patterns/pages/{list,detail,review,reader}` wrappers instead of repeating page-frame assembly inline.
- `2026-04-11`: Updated the checklist to reflect the first structural split of the shared `@skopos/ui` layer, where shell, section, inspector, platform-state, and support responsibilities now live in owned modules instead of one large `console-shared.tsx` file.
- `2026-04-11`: Updated the checklist to reflect the implemented first `@skopos/ui` token layer, including shared shell-width and reading-rail presets plus shared typography and control-size roles.
- `2026-04-11`: Updated the checklist to make the next `@skopos/ui` token-system batch explicit, so typography roles, control heights, shell widths, and surface tokens are normalized before more page-level polish.
- `2026-04-11`: Updated the checklist again to make the target `@skopos/ui` source tree explicit, so the next refactor moves toward thin `app/**`, `screens/**`, `patterns/**`, `features/**`, `platform/**`, and `support/**` ownership instead of leaving route composition and layout grammar mixed together.
- `2026-04-11`: Updated the checklist with the accepted UI-system normalization batch in `@skopos/ui`, so the next work now extracts layout tokens, route-family compounds, and inspector primitives before more route-level polish.
- `2026-04-11`: Updated the checklist to reflect the implemented inspector-interaction batch in `@skopos/ui`, where secondary right-rail sections now collapse behind compact support panels and count badges instead of forcing the entire inspector open by default.
- `2026-04-10`: Updated the checklist to reflect the implemented shell-refinement batch in `@skopos/ui`, where the routed console now uses a narrower center reading rail, route-owned header sequence controls, one inspector width, clearer chrome-versus-canvas backgrounds, and shared main-scroll ownership instead of a second default inspector scrollbar.
- `2026-04-10`: Updated the checklist with the accepted shell-refinement batch in `@skopos/ui`, so the next UI work now narrows the center reading rail, removes global header source-link buttons, standardizes inspector width, clarifies chrome-versus-canvas backgrounds, and fixes desktop scroll ownership.
- `2026-04-10`: Updated the checklist to reflect the improved `skopos ui dev` loop in `@skopos/ui`, where watched docs and `.skopos/**` changes now refresh the routed console state in place instead of depending on full page reload.
- `2026-04-10`: Updated the checklist to reflect the implemented compact-inspector batch in `@skopos/ui`, where right-pane metadata now uses denser split-row summaries and flatter side lists instead of document-style stacked metadata blocks.
- `2026-04-10`: Updated the checklist to reflect the implemented typography and detail-surface polish batch in `@skopos/ui`, where shared console primitives now use a tighter type and spacing rhythm and the noisiest detail routes read flatter instead of stacking mini-panels.
- `2026-04-10`: Updated the checklist to reflect the implemented deeper evidence and comparison batch in `@skopos/ui`, where `trust` now surfaces richer source-derived evidence trails and `proof` now shows comparison drivers, regressed benchmark evidence, and fuller category scorecards.
- `2026-04-10`: Updated the checklist to reflect the implemented wider-inspector batch in `@skopos/ui`, where the routed console now gives `overview`, `trust`, `activity`, `mission detail`, and `plan detail` a broader right pane and moves support-only summaries out of the center lane.
- `2026-04-10`: Updated the checklist to reflect the implemented inspector-consistency batch in `@skopos/ui`, where the routed console now uses a shared right-rail vocabulary around `At a glance`, `Source links`, and route-specific supporting context instead of mixed inspector titles and raw-id-first panels.
- `2026-04-10`: Updated the checklist to reflect implemented route-owned filtering in `@skopos/ui`, where `missions`, `plans`, `decisions`, and `findings` now persist route-local review filters instead of relying on shell-level navigation or ad hoc local state.
- `2026-04-10`: Updated the checklist to reflect the implemented list-review cleanup batch in `@skopos/ui`, where `missions`, `plans`, `decisions`, and `findings` now use product-shaped queues and curated lists instead of generic summary-heavy route bodies.
- `2026-04-10`: Updated the checklist to reflect the implemented second information-hierarchy cleanup batch in `@skopos/ui`, where `mission detail`, `proof`, `scopes`, and routed knowledge detail surfaces now separate primary review content from inspector-only context.
- `2026-04-10`: Updated the checklist to reflect the implemented grouped left rail plus first-class `plans`, `decisions`, and `findings` routes in `@skopos/ui`, so those product surfaces are now built rather than still treated as pending nav doctrine.
- `2026-04-10`: Updated the checklist to reflect the first information-hierarchy cleanup batch in `@skopos/ui`, where `overview`, `trust`, and `activity` now lead with human review surfaces and push supporting detail into the right inspector.
- `2026-04-10`: Updated the checklist to reflect the implemented `skopos ui dev` loop in `@skopos/ui`, including Vite-backed HMR, watched compiled-state refresh, and browser-facing state/file endpoints for the routed console authoring path.
- `2026-04-10`: Updated the checklist with the accepted UI dev-loop doctrine for `@skopos/ui`, so the next batch explicitly adds `skopos ui dev`, Vite HMR, and watched compiled-state refresh instead of treating `ui serve` as the long-term authoring loop.
- `2026-04-10`: Updated the checklist with the accepted navigation and knowledge-routing doctrine for `@skopos/ui`, so the next UI batch explicitly adds grouped left-rail navigation plus first-class plans, decisions, and findings surfaces instead of leaving them hidden behind docs or artifact links.
- `2026-04-10`: Updated the checklist with the accepted information-hierarchy doctrine for `@skopos/ui`, so the next UI batch explicitly separates primary, supporting, diagnostic, and raw content and removes duplicate machine detail from the center-pane routes before more visual polish.
- `2026-04-10`: Updated the checklist with the accepted desktop app-shell doctrine for `@skopos/ui`, so the next UI batch is constrained around full-bleed shell geometry, route-family pane layouts, restrained type scaling, and lower-chrome surface rules rather than generic polish.
- `2026-04-10`: Updated the checklist to reflect the implemented routed detail-view slice in `@skopos/ui`, including compiled docs-reader projections plus richer mission, trust, and proof review surfaces on top of the routed console.
- `2026-04-10`: Updated the checklist to reflect the implemented routed app foundation in `@skopos/ui`, including compiled console-state shaping, `skopos ui build`, and the first real route family on top of the pilot console shell.
- `2026-04-10`: Updated the checklist to reflect the routed-app stack decision for the system UI, making the next UI batch about Vite plus React plus TanStack Router plus Tailwind scaffolding instead of more one-page renderer refinement.
- `2026-04-10`: Updated the checklist to reflect the implemented second system UI slice, where the console center pane now includes an execution cockpit plus richer trust, proof, workflow, and activity surfaces.
- `2026-04-10`: Updated the checklist to reflect the implemented first system UI shell upgrade, so the UI milestone now has a stable left-nav, context bar, main work pane, and evidence rail instead of a single flat portal page.
- `2026-04-10`: Updated the checklist to add the first system UI milestone, so post-proof work is now constrained around human-readable trust, mission, proof, docs, and activity surfaces instead of generic portal expansion.
- `2026-04-10`: Updated the checklist to reflect the before-versus-after brownfield comparison proof lane, so fixture realism now proves a measurable stabilization delta instead of only isolated repo interpretation snapshots.
- `2026-04-10`: Updated the checklist to reflect cross-actor blocking and explicit force-transfer proof coverage on linked batch slicing, so claimed parent missions now have a maintained decomposition-safety contract instead of only happy-path slice coverage.
- `2026-04-10`: Updated the checklist to reflect the new partial library-structure drift proof lane, so architecture interpretation now proves a middle-band partial library-monorepo case in addition to clearly divergent brownfield shapes.
- `2026-04-10`: Updated the checklist to reflect the new mixed-brownfield proof lane, so Skopos now proves it can diagnose middle-band repos that need stabilization without collapsing them into either clean or high-conflict buckets.
- `2026-04-10`: Updated the checklist to reflect the durable `.skopos/proof/latest-report.json` proof artifact, so scorecard-versus-baseline output is kept as runtime-managed evaluation state instead of transient-only harness output.
- `2026-04-10`: Updated the checklist to reflect parent-linked-slice state sync during child mission claim, release, and completion, so batch execution progress stays durable instead of drifting after the initial slice creation.
- `2026-04-10`: Updated the checklist to reflect the dedicated self-hosted tooling fixture and passing `self-hosted-dogfooding` proof lane for workflow discovery, trust readiness, and portal rendering on a deterministic Skopos-on-Skopos repo shape.
- `2026-04-10`: Updated the checklist to reflect linked mission slicing for self-hosted proof batches, plus the passing `batch-mission-slicing` proof lane that closes the first batch-decomposition finding.
- `2026-04-10`: Updated the checklist to require durable plan and mission artifacts for self-hosted proof-phase batches, and to track batch-decomposition friction through the findings registry instead of ad hoc notes.
- `2026-04-10`: Updated the checklist to reflect that `scan` now refreshes the durable diagnosis artifact, keeping brownfield diagnosis current in `.skopos/diagnosis.json` rather than only returning transient output.
- `2026-04-10`: Updated the checklist to reflect actor-attributed `scan` lifecycle events, so brownfield diagnosis no longer sits outside the operational log and knowledge-index loop.
- `2026-04-10`: Updated the checklist to reflect actor-attributed `init`, `trust`, and `impact` lifecycle events, so bootstrap and validation provenance is preserved in the normal operational log loop.
- `2026-04-10`: Updated the checklist to reflect actor-aware recent-activity and operational-log modules in the local portal, so runtime provenance is visible to humans during self-hosting and multi-actor dogfooding.
- `2026-04-10`: Updated the checklist to reflect that `instructions sync` now participates in the runtime log/index lifecycle with optional actor attribution.
- `2026-04-10`: Updated the checklist to reflect actor-attributed plan creation so shared plan and mission artifacts start with visible provenance before explicit mission ownership is claimed.
- `2026-04-10`: Updated the checklist to reflect actor-attributed mutating workflow runs and proof coverage that required workflow evidence is no longer anonymous.
- `2026-04-10`: Updated the checklist to reflect actor-attributed override ownership and explicit force-transfer protection for durable shared canonicals in the override-heavy proof lane.
- `2026-04-10`: Updated the checklist to reflect mission-level multi-actor coordination through explicit mission claim ownership, force-transfer semantics, and a proof benchmark that blocks silent takeover.
- `2026-04-10`: Updated the checklist to reflect machine-readable release-surface metadata across Skopos package manifests and the new `release:check` gate that keeps candidate surfaces explicit while the workspace stays private during incubation.
- `2026-04-10`: Updated the checklist to reflect automated package-boundary enforcement so public SDK core packages cannot quietly depend on internal product surfaces or the Unisane adapter.
- `2026-04-10`: Updated the checklist to reflect config-driven workspace-ignore policy, the boundary-aware fixture, and proof coverage that internal, fixture, test, and generated roots stay out of the active SDK package model.
- `2026-04-09`: Updated the checklist to reflect the new self-hosting root pack for the Skopos subtree, including subtree-local config, workspace, instruction, and workflow surfaces.
- `2026-04-09`: Updated the checklist to reflect explicit source-dependency invalidation in compiled bootstrap state plus proof coverage for package-addition refresh and docs-trust refresh without rerunning `init`.
- `2026-04-09`: Updated the checklist to reflect the new hot-path performance proof lane and the explicit guarantee that hot-path commands no longer rewrite bootstrap artifacts when compiled state is still valid.
- `2026-04-09`: Updated the checklist to reflect the first hot-path compiled-state optimization for query, trust, impact, and plan flows, and to make performance budgets the next proof-phase concern.
- `2026-04-09`: Updated the checklist to reflect the implemented `.skopos/index.json` and `.skopos/log.jsonl` artifacts plus the new proof lane that exercises them across the runtime lifecycle.
- `2026-04-09`: Updated the checklist to reflect the implemented canonical override artifact, `skopos overrides` CLI, and the new override-canonicalization proof lane.
- `2026-04-09`: Updated the checklist to reflect docs-health scanning, stale-doc trust warnings, and the new stale-docs brownfield proof lane.
- `2026-04-09`: Updated the checklist to reflect CLI approval enforcement for approval-sensitive or destructive workflows, plus the new approval workflow fixture and proof benchmark lane.

- `2026-04-09`: Updated the checklist to reflect the new legacy-structure brownfield fixture and benchmark so the messy brownfield lane now covers both loud-conflict and quieter-structure-drift shapes.
- `2026-04-09`: Updated the checklist to reflect the committed proof baseline artifact and explicit scorecard-against-baseline comparison support.
- `2026-04-09`: Updated the checklist to reflect the shared proof scorecard contract, benchmark categories and priorities, and the resolved eval scoring decision.
- `2026-04-09`: Updated the checklist to reflect the compiled enforcement profile, generated Claude Code hook adapter, and passing tool-native enforcement proof benchmark.
- `2026-04-09`: Updated the checklist to reflect subtree-targeted large-repo bootstrap/scan support and the passing large-repo proof benchmark.
- `2026-04-09`: Updated the checklist to reflect the compiled architecture artifact and passing brownfield architecture benchmark coverage.
- `2026-04-09`: Updated the checklist to reflect the first proof-phase benchmark harness, benchmark definition file, and clean-service fixture.
- `2026-04-09`: Updated the checklist to reflect that the first blocker set is resolved and the next active lane is proof-phase benchmarking.
- `2026-04-09`: Updated the checklist to reflect the compiled project knowledge loop, planned index and log surfaces, and the brownfield-first proof direction.
- `2026-04-09`: Added the missing-decisions gate so further feature expansion is blocked until the highest-risk product and operational decisions are explicit.
- `2026-04-09`: Updated the checklist to reflect graph-backed docs, command, and scope-relations modules in the local portal shell.
- `2026-04-09`: Updated the checklist to reflect broader init graph artifacts for docs, commands, and scope relations, plus matching portal coverage.
- `2026-04-09`: Updated the checklist to reflect recent-activity modules in the local portal shell for persisted plans, missions, and workflow evidence.
- `2026-04-09`: Updated the checklist to reflect the implemented local portal shell at `docs/generated/skopos/index.html`, with trust summary, artifact links, and graph entrypoints.
- `2026-04-09`: Updated the checklist to reflect the implemented HTML portal renderer on top of the curated graph view models.
- `2026-04-09`: Updated the checklist to reflect the first UI graph-projection slice built on top of the typed graph artifacts.
- `2026-04-09`: Updated the checklist to reflect the implemented graph-backbone slice for workspace, mission, and impact artifacts under `.skopos/graph/`.
- `2026-04-09`: Updated the checklist to reflect that registered workflows are now integrated into `plan`, `impact`, and `done` through requirement matching and run-evidence checks.
- `2026-04-09`: Updated the checklist to reflect the first implemented workflow-extension slice: manifest discovery, CLI workflow execution, and generated run evidence under `.skopos/runs/`.
- `2026-04-09`: Updated the checklist to reflect that closure now supports explicit mission evidence and that workflow artifacts are distinct from immutable derived artifacts.
- `2026-04-09`: Updated the checklist to reflect the decision to keep typed internal graph artifacts and selective UI graph views as a later phase, not an early MVP visual feature.
- `2026-04-09`: Updated the checklist to reflect that `skopos plan` now persists plan and mission artifacts under `.skopos/plans/` and `.skopos/missions/`.
- `2026-04-09`: Updated the checklist to reflect that messy-repo diagnosis and remediation reporting are now implemented through `skopos scan` and `.skopos/diagnosis.json`.
- `2026-04-09`: Updated the checklist to reflect that impact and done can now use the current git diff without explicit path lists.
- `2026-04-09`: Updated the checklist to reflect that impact analysis and closure reporting are now implemented.
- `2026-04-09`: Updated the checklist to reflect that scoped planning is now implemented beyond bootstrap questions.
- `2026-04-09`: Updated the checklist to reflect the implemented bootstrap, instructions, resolve/context, trust, and CLI e2e slices.
- `2026-04-09`: Added the canonical implementation checklist so Skopos build work can be tracked against the final agreed product shape instead of only narrative docs.

## Feature Admission Discipline

Before adding a new Skopos feature, artifact, command, or routed UI surface, answer:

1. What user-supervision task disappears if this lands?
2. What existing layer cannot already own this cleanly?
3. What workflow weight does it add on the happy path?
4. What becomes visible by default, and what stays secondary or searchable?
5. What hot-path token or runtime cost does it add?
6. What is the removal or archival rule if it proves redundant?
7. Does it stay inside the declared v1 support lane?
8. Can a beginner or mid-level developer understand the default output and next step without reading raw JSON?

If those answers are weak, narrow the change, fold it into an existing layer, or defer it.

## Self-Healing Discipline

Before opening a Skopos hardening batch, answer:

1. Which active finding or narrow finding cluster does this fix?
2. Is the issue product correctness, workflow ergonomics, project hygiene, or host limitation?
3. Does this batch remove one concrete false signal or repeated workflow tax?
4. What proof will run on the Skopos workspace?
5. What proof will run on one non-Skopos workspace or package?
6. What temporary workpack or extra surface will be archived or removed after closure?

Do not open broad “improve Skopos” batches. Split them until one bounded failure mode has a clear success condition.

## Current Next Slices

1. Run the bounded self-healing loop first:
   - Track A: onboarding, scope, and trust correctness
   - Track B: validation and transport proportionality
   - Track C: program and docs-state hygiene
   - prove each slice on Skopos plus one non-Skopos workspace
2. Add the first synthesized brownfield-understanding layer:
   - compact repo-summary artifact
   - compact feature-inventory artifact
   - compact implementation-hotspots artifact
   - one routed orientation surface above raw symbols and graphs
3. Add the token-control transport layer before more control-plane surface growth:
   - compact command output modes
   - `.skopos/agent/**` brief artifacts
   - active versus durable versus historical docs filtering
   - smallest-sufficient validation lanes
   - compact-polled heavy jobs and stable prompt layering
4. Add the human guidance layer before widening policy, stack, and workflow surfaces:
   - default CLI output explains status, risk, blocker, user question, proof, and next step in simple English; implemented for `trust`, `policies recommend/apply/drift`, `start`, `plan`, `decide`, `next`, `program sync`, `program next`, `done`, and `eval`
   - `--json` remains the strict machine contract
   - guided questions include a recommended option, alternatives, tradeoffs, and what happens after the answer; first CLI slice implemented for `start`, `plan`, `decide`, and `next`
   - workpack summaries show current phase, approximate progress, done, doing, next, blockers, decisions, findings, and proof needed; the first mission-backed CLI slice now covers progress, phase, done, doing-now, blockers, decisions, findings, and proof-needed guidance
   - routed UI surfaces lead with human status and next action, not raw ids or artifact handles
   - agent briefs include answer-style guidance without turning the hot path into a wall of policy text
5. Add the policy-pack, stack-intelligence, and durable-memory foundation before creating a broad catalog:
   - pack manifest, resolved-policy, stack recommendation, memory freshness, and drift schemas
   - first realistic internal architecture pack source now seeded at `policy-packs/architecture/mid-app`; catalog loading, recommendation, acceptance, resolved policy generation, AGENTS.md policy projection, policy agent brief generation, and policy trust checks are implemented through `skopos policies list/show/recommend/apply`
   - first stack policy source now seeded at `policy-packs/stack/async-work`, covering inline work, cron, queues, durable workflows, Redis, retries, idempotency, and worker ownership
   - first gate policy source now seeded at `policy-packs/gates/progressive-validation`, covering light, normal, and workpack-level validation lanes
   - pack manifests now carry plain-language summary, best-fit guidance, user questions, quality bar, and agent-use notes so packs are useful to both agents and human developers
   - accepted policy application now composes multiple accepted packs instead of replacing the previous accepted pack
   - drift evaluation against accepted policy is implemented through `skopos policies drift`; local override handling is implemented through `skopos policies overrides`
   - routed UI review for accepted packs, pack details, codebase verification signals, active rules, drift, overrides, and execution lanes is implemented through the `Rules` route
   - accepted stack decision artifacts remain pending
   - compact project memory and agent-brief integration now includes accepted policy and progressive lane guidance; dedicated stack-decision artifacts and eval blocking for known drift remain pending
   - trust and agent-brief integration for accepted policy posture is implemented; trust now reports policy drift posture; `done` blocks open accepted `must` drift after overrides are applied
   - proof fixtures that block placeholder-only packs and catch stale project-knowledge drift
   - portability checks that prove the layer works outside Unisane-style projects
6. Add the program router above the now-implemented mission router:
   - extend the first implemented `.skopos/program/state.json` slice beyond active mission plus active findings
   - keep `skopos program sync` and `skopos program next` stable while new sources are added
   - keep typed docs and UI obligations compact and deterministic
7. Feed promoted discussion checkpoints into that program state instead of leaving accepted work only in chat or local memory.
8. Reflect the implemented workflow and program state in `overview`, `mission detail`, `trust`, and the `search dock`.
9. Keep the mission router, trust, done, and the first program-router slice stable while that higher control-plane layer expands.
10. Reflect the implemented discussion-memory state in `overview`, `mission detail`, and the `search dock` before considering a dedicated `Discussion` route or sidebar entry.

## Current Completed Slices

- Root config schema and generated bootstrap artifact contracts are implemented.
- The minimal repo scanner and bootstrap report are implemented.
- `skopos init` is implemented through `runtime` and `cli`.
- Instruction mirror generation is implemented.
- Exact scope resolution and compact context assembly are implemented.
- Bootstrap ask-back now emits recommended high-value questions.
- Scoped planning is implemented with goal text, decision ask-back, and canonical validation command recommendations.
- Repo diagnosis and remediation reporting are implemented through `skopos scan` and `.skopos/diagnosis.json`.
- Scoped planning now persists plan and mission artifacts for later execution and trust reuse.
- Mission inspection/completion and mission-aware closure evidence are implemented.
- Impact analysis and closure reporting are implemented with instruction parity and generated-artifact safeguards.
- Impact and done now support git-backed changed-path collection when paths are omitted.
- Project workflow manifest discovery, CLI workflow execution, and `.skopos/runs/*.json` evidence are implemented.
- Registered workflows are now integrated into plan recommendations, impact requirements, and closure evidence checks.
- Typed internal graph artifacts are now implemented for workspace, docs, commands, scope relations, mission, and impact relationships.
- The UI package now loads graph artifacts and shapes curated graph view models for workspace, docs, commands, scope relations, impact, and mission projections.
- The UI package now renders a local portal shell with trust summary, artifact links, and graph entrypoints.
- The UI package now surfaces recent plans, missions, and workflow-run evidence inside the local portal shell.
- The UI package now surfaces actor-aware recent plans, missions, workflow evidence, and operational-log activity inside the local portal shell.
- The UI package now renders graph-backed docs, command, and scope-relations modules inside the local portal shell.
- The UI package now renders a local HTML graph portal under `docs/generated/skopos/graph-portal.html`.
- The UI package now exposes `skopos ui dev` as the default authoring loop, with Vite-backed HMR plus watched compiled-state refresh and browser-facing state/file endpoints for routed-console work.
- A first `skopos trust` readiness report is implemented.
- CLI-level e2e coverage now exists for bootstrap, scan, resolve, context, planning, workflow execution, instruction sync, trust, impact, done, and mission closure.
- The first proof-phase benchmark definition file now exists under `internal/evals/proof-phase-benchmarks.json`.
- The first proof-phase scorecard harness now exists in `packages/cli/src/__tests__/proof-phase.e2e.test.ts`.
- A clean single-repo service fixture now exists for brownfield benchmark coverage.
- A quieter legacy multi-package fixture now exists for brownfield structure-drift benchmark coverage.
- A before-versus-after brownfield fixture pair now exists for stabilization-delta benchmark coverage on a realistic monorepo shape.
- A stale-docs fixture now exists for brownfield docs-trust benchmark coverage where docs are present but stale or weakly routed.
- A canonical-override fixture now exists for brownfield benchmark coverage where human-declared canonicals must outrank wrong inference.
- An approval-sensitive workflow fixture now exists for destructive workflow enforcement benchmark coverage.
- A compiled `.skopos/architecture.json` artifact now exists with distinct current and recommended architecture views.
- Brownfield architecture interpretation is now benchmarked as part of the proof-phase scorecard.
- Large-repo subtree targeting and sliced compiled artifacts are now implemented and benchmarked.
- A compiled `.skopos/enforcement.json` artifact now exists with generated Claude Code hook adapter outputs under `.skopos/tooling/claude-code/`.
- Tool-native enforcement is now benchmarked through generated hook execution that syncs instructions and blocks unfinished closure.
- Approval-sensitive or destructive workflows now require explicit `--approve` execution in the CLI runtime and are benchmarked as a separate proof lane.
- Docs-health scanning now detects missing `docs/00-start-here.md` routing and stale tracked docs metadata, and trust now reports those gaps as `needs-review`.
- A checked-in `.skopos/overrides.json` artifact and `skopos overrides` CLI now exist for declared canonicals that outrank inference, and the runtime/query path now refreshes bootstrap state when overrides change.
- A compiled `.skopos/index.json` knowledge index and append-only `.skopos/log.jsonl` operational log now exist and are refreshed across init, plan, workflow, trust, impact, done, mission completion, and override updates.
- The normal bootstrap and validation loop now supports actor-attributed `init`, `trust`, and `impact` commands so those operational log entries are no longer anonymous when actor identity is known.
- Brownfield diagnosis now supports actor-attributed `scan` commands and writes diagnosis activity into the same runtime log/index loop as the other core lifecycle commands.
- Brownfield diagnosis now refreshes `.skopos/diagnosis.json` on `scan`, so the durable diagnosis artifact tracks the latest repo interpretation instead of only the last `init`.
- Query, trust, impact, and plan now prefer compiled `.skopos` state on hot paths and only refresh that state when config or override invalidation requires it.
- CLI-level e2e coverage now verifies that `resolve`, `context`, `plan`, `trust`, and `impact` reuse compiled bootstrap state instead of rewriting it on valid hot paths.
- Compiled bootstrap state now carries explicit source-dependency probes so query and trust flows can refresh after late package or docs-source changes without a manual `init` rerun.
- The Skopos subtree now has its own self-hosting root surfaces: `package.json`, `pnpm-workspace.yaml`, `skopos.config.yaml`, `AGENTS.md`, and repo-authored workflows under `tools/skopos/workflows/`.
- The root config and scanner now support `workspace.ignore`, and self-hosting uses it to exclude internal, fixture, test, and generated roots from the active SDK package model.
- A boundary-aware fixture now exists to prove that ignored roots with real `package.json` files do not leak into scopes, architecture units, or compiled graphs.
- Automated package-boundary tests now verify that public SDK core packages do not depend on `ui` or `docs-engine`.
- Package manifests now carry machine-readable `surface`, `releaseTarget`, and `publishPhase` metadata, and the workspace-level `release:check` gate verifies that only intended SDK and tool packages are marked as future release candidates while every package remains private during incubation.
- Mission artifacts now carry runtime-owned coordination metadata, and the CLI/runtime now block silent mission takeover unless ownership is transferred explicitly.
- The proof harness now uses a shared scorecard contract with benchmark category and priority metadata, weighted scores, and category summaries.
- The proof harness now compares the current scorecard against a committed proof baseline artifact.
- The proof harness now persists the latest scorecard and baseline comparison to `.skopos/proof/latest-report.json`.
- The proof harness now includes a mixed brownfield lane where workspace/docs/instructions are canonical but the root command surface is only partially consolidated.
- The proof harness now includes a before-versus-after brownfield comparison lane where the stabilized repo must show a real health and trust delta, not only better static shape.
- The routed console now includes a docs list-detail reader fed by compiled document projections rather than same-page artifact links only.
- The routed console docs reader now renders doc-owned Mermaid diagrams inline for explanatory markdown content while keeping compiled graph artifacts on the separate graph-portal lane.
- The routed mission, trust, and proof views now expose denser review surfaces for ownership, workspace signals, must-win benchmark pressure, and baseline comparison readability.
- The routed console now applies the information-hierarchy contract beyond the first batch, so mission detail, proof, scopes, and knowledge detail routes keep primary review content in the center lane and move supporting context into the right inspector.
- The routed console now applies the same product-shaped list-review contract to `missions`, `plans`, `decisions`, and `findings`, so those routes lead with readable queues and curated lists rather than summary-heavy or mixed-document surfaces.
- The first human-output CLI slice now makes `skopos trust`, `skopos policies recommend`, `skopos policies apply`, and `skopos policies drift` lead with plain-language status, attention, and next-step guidance while keeping JSON output stable.
- The second human-output CLI slice now makes `skopos next`, `skopos program sync`, `skopos program next`, `skopos done`, and `skopos eval` lead with plain-language status and next-step guidance while keeping JSON output stable.
- The first mission-backed progress-summary slice now projects progress, phase, done, doing-now, blockers, and proof-needed guidance into `skopos next`, `skopos eval`, and `skopos done` from existing mission truth.
- The routed console now keeps `missions`, `plans`, `decisions`, and `findings` filters in route state, so queue and knowledge-list views can be linked and refreshed without losing route-local review mode.
- The routed console now uses a consistent inspector pattern across execution, review, structure, and knowledge routes, so right-rail panels lead with `At a glance`, keep source affordances compact, and stop promoting raw ids as primary visible context.
- The routed console now uses wider support inspectors on `overview`, `trust`, `activity`, `mission detail`, and `plan detail`, so metric strips, validation posture, and recent side context no longer compete with the primary reading surface in the center lane.
- The routed console now gives `trust` a richer evidence trail and `proof` a deeper comparison surface, so source-derived workspace context, comparison drivers, regressed benchmarks, and full category posture remain visible without collapsing those routes back into raw artifact boards.
- The routed console now uses a tighter shared type and spacing rhythm, and `mission detail`, `plan`, `docs`, and `scope` surfaces now read flatter and more consistently instead of stacking unnecessary boxed subsections.
- The routed console now uses compact inspector summaries and flatter support lists, so right-pane metadata reads like a true side rail instead of a second document surface.
- The routed console now composes its current list, detail, review, and reader routes through `patterns/pages/{list,detail,review,reader}`, so page-family shell grammar is no longer rebuilt inline across the route files.
- The routed console now imports route composition from `screens/**`, so `app/router.tsx` is thinner and `app/routes/**` no longer owns primary screen composition.
- The routed console now extracts repeated route sections into `features/**`, so work, validation, knowledge, and structure screens no longer keep queue rows, inspector blocks, reader sections, and detail frames inline by default.
- The routed console now splits `features/work/mission-detail/**` and `features/validation/proof/**` into smaller inspector and center-content modules, so those route families no longer depend on oversized monolithic section files.
- The old shared compatibility barrel is gone, so routed screens and features now import owned shell, section, platform, and support modules directly instead of routing everything through `app/console-shared.tsx`.
- The routed console now uses a canonical `cn` helper backed by `clsx` plus `tailwind-merge`, so long-term class composition and override behavior no longer depends on a local string-join helper.
- The routed console now splits work, validation, and knowledge feature ownership by route family, so overview, mission queue/detail, trust, proof, activity, plans, and documents no longer share oversized feature modules.
- The routed console now splits `features/knowledge/plans/**` and `features/knowledge/documents/**` further into smaller list, detail, reader, inspector, and sequence modules, so the knowledge feature family no longer depends on two large mixed-purpose section files.
- Shared section primitives now live under `patterns/sections/{content,inspector}/**`, so the old section-level primitive files are only thin export surfaces instead of mixed ownership buckets.
- `app/routing/route-config.ts` now owns route metadata, left-rail navigation groups, and list-view normalizers, so `app/router.tsx` stays closer to route registration and shell composition.
- The routed console now splits the knowledge screen family by route responsibility, so plans and documents no longer share one oversized screen module.
- The routed console now uses `platform/console-state/knowledge-selectors.ts` for plan queues, document classification, document ordering, and document detail context instead of shaping those views inline inside a screen file.
- The routed console now uses `support/knowledge/document-routing.ts` for knowledge-route href, path, and params helpers instead of redefining that logic inside feature or screen modules.
- The routed console now uses a stronger inspector-section grammar, so collapsible side-rail sections behave like real support accordions instead of tiny-chevron metadata rows.
- The routed console now uses a slightly larger small-type baseline across eyebrow, caption, helper, pill, badge, and inspector text roles.
- The routed console now classifies document sections as narrative, metadata, changelog, reference, or preview, so docs detail routes can move metadata and changelog into the inspector and keep the main reader focused on the actual document body.
- The routed console now renders docs narrative content through a real markdown renderer with semantic support for links, inline code, fenced code blocks, blockquotes, ordered lists, and tables while metadata and changelog remain in the inspector.
- The routed console now resolves internal markdown links to routed docs, decisions, and findings destinations and gives fenced code blocks a clearer language-aware shell instead of leaving both behaviors to raw browser defaults.
- The routed console now keeps the docs-detail outline synced to the active reader section and gives fenced code blocks a copy control in the code header.
- The routed console now renders fenced code with syntax highlighting and keeps the main docs reader flatter, so the center lane behaves more like a canvas and uses separators instead of nested card chrome for narrative content.
- The routed console now uses a narrower shared center reading rail and a flatter canvas-style center lane across the main detail/review routes, while boxed chrome stays focused on inspectors, queues, and structured support sections.
- The routed shell now uses a thin-scrollbar treatment across its main scroll surfaces, so left rail and main review areas keep quieter browser chrome.
- The routed shell now waits until the real pane breakpoint before becoming a fixed desktop frame, and the main list-review routes now use one flatter shared row system so tablet widths and queue surfaces keep the same canvas-first reading rhythm.
- The routed shell now keeps stacked inspector mode in normal content flow until desktop panes actually exist, and the remaining trust and proof center surfaces now follow the same single-column canvas rule instead of residual center grids.
- The routed shell now gives narrow layouts owned behavior for header actions, stacked inspector summaries, and filter bars, so those surfaces no longer rely on accidental wrapping or desktop-only row assumptions.
- The routed console now uses work and validation selector modules alongside the existing knowledge selectors, so overview, mission queue/detail, trust, proof, and activity screens no longer keep most derived route shaping inline.
- The routed console now uses `application/build-console-state/document-projections.ts` for docs-link discovery, document loading, and markdown section classification instead of keeping that projection logic inside `build-console-state.service.ts`.
- The routed console now splits reader support into `support/knowledge/document-reader-{entries,scroll}.ts`, so document outline entry construction and active-section scroll behavior no longer share one mixed helper file.
- The routed console now collapses repeated identical activity events into grouped timeline entries, surfaces readiness as the real trust outcome on the activity route, and suppresses repeated missing-actor noise instead of rendering raw operational-log spam one row at a time.
- The first real built-in policy pack sources now exist at `policy-packs/architecture/mid-app`, `policy-packs/stack/async-work`, and `policy-packs/gates/progressive-validation`, with typed manifests, operational policy docs, drift rule definitions, and good/drift fixtures.
- The policy-pack catalog runtime now validates `policy-packs/**/pack.json`, exposes `skopos policies list/show` for agent and human inspection, and supports composable accepted policies through `skopos policies apply`.
- Local accepted-policy exceptions now live in `.skopos/policies/overrides.json`, are managed through `skopos policies overrides`, suppress or downgrade matching drift findings, and sync into resolved policy for visibility.
- Closure now has an explicit accepted-policy gate: `skopos done` blocks when open accepted `must` drift remains after overrides are applied.
- The routed console now has a `Rules` page that projects accepted policy, full pack details, codebase verification signals, active rules, drift, local exceptions, and execution-lane guidance from `.skopos/policies/**`, `policy-packs/**/pack.json`, and `.skopos/drift/report.json`.

## Decision Gate

- The first blocker set is resolved through:
  - `../decisions/001-brownfield-first-proof-and-v1-scope.md`
  - `../decisions/002-artifact-policy-freshness-and-overrides.md`
- The current-state versus recommended-state architecture split is resolved through:
  - `../decisions/003-current-state-and-recommended-architecture-split.md`
- The large-repo operating mode is resolved through:
  - `../decisions/004-large-repo-operating-mode.md`
- The tool-native enforcement strategy is resolved through:
  - `../decisions/005-tool-native-enforcement-strategy.md`
- The eval harness and scoring contract are resolved through:
  - `../decisions/006-eval-harness-and-scoring-contract.md`
- Allow only proof-phase work until benchmark results justify broader feature expansion:
  - eval harnesses
  - benchmark fixtures
  - bug fixes
  - docs and decision-support work
- Allow the focused system UI batch described in `system-ui-plan.md` once the proof scorecard remains passing; keep the first milestone constrained to pilot-readiness instead of broad surface expansion.
- Do not keep expanding portal or graph surface area until the proof-phase gate is explicit.

## Product Checklist

- Keep Skopos local-first, provider-agnostic, and coding-agent-agnostic.
- Keep Skopos positioned as project intelligence and trust infrastructure for coding agents, not an LLM provider or hosted coding agent.
- Keep the public SDK contract smaller than the full internal product-incubation workspace.
- Keep the system UI positioned as a human project-intelligence console, not a generic workspace or wiki product.
- Keep the user-facing surface simple:
  - one checked-in root config
  - one optional local override
  - one generated state root
  - one canonical instruction source
- Keep the core generic and project-agnostic.
- Keep project-specific logic outside the Skopos core package family.

## Knowledge Checklist

- Keep JSON/YAML authoritative for machine truth.
- Keep Markdown/MDX authoritative for human explanation.
- Keep generated outputs clearly marked as generated.
- Distinguish `declared`, `detected`, `inferred`, `generated`, and `stale`.
- Give every durable artifact a stable id, status, authority, and timestamps.
- Keep proof-phase batch execution inside durable plan and mission artifacts when self-hosting Skopos on itself.
- Keep proof scorecard and baseline-comparison output durable on disk for self-hosting, but treat `.skopos/proof/**` as local runtime evaluation state rather than committed shared truth by default.
- Keep wide proof-phase batch missions decomposable into linked child slice missions through Skopos itself, not ad hoc execution notes.
- Keep parent batch missions synchronized with child slice claim, release, and completion state so linked execution progress does not drift after slice creation.
- Keep compiled project knowledge compact enough to reduce repeated reasoning instead of creating a giant verbose wiki.
- Add compact content-index and operational-log surfaces before reaching for heavy retrieval infrastructure.
- Keep mutable shared canonicals actor-attributed when more than one actor can rewrite them.
- Keep shared tool-facing maintenance commands visible in the operational log and knowledge index, not as hidden side effects.
- Keep common bootstrap, diagnosis, and validation lifecycle events actor-attributed when identity is available, not only mutation-heavy workflow steps.
- Keep important shared runtime provenance visible to humans in the local portal instead of burying it only in raw `.skopos/log.jsonl` entries.
- Keep a deterministic self-hosted tooling fixture in the proof harness so Skopos-on-Skopos behavior is measured through repeatable repo shape, workflow, trust, and portal checks rather than only the live subtree.
- Keep archive folders per high-churn doc domain.
- Exclude archived material from default retrieval and default reading paths.
- Keep relationship graphs internal and typed first; expose only curated graph views later.
- Keep project-specific scripts behind registered workflow manifests rather than implicit shell knowledge.
- Keep ignored internal roots out of active package discovery through explicit checked-in workspace boundary policy.

## Pilot UI Checklist

- Keep the first system UI milestone focused on trust, closure, proof, docs, scopes, missions, workflows, and activity.
- Treat the current shell and execution cockpit as the stable base for further UI work; do not restart the layout from scratch in the next batch.
- Move the primary pilot UI to a real routed app instead of continuing same-page anchor navigation as the main experience.
- Keep the app shell full-bleed and desktop-like:
  - left rail flush to the viewport
  - inset header and content rail
  - sticky contextual right pane
- Keep the left rail clean and grouped:
  - `Overview`
  - `Work`
  - `Validation`
  - `Knowledge`
  - `Structure`
- Keep workspace identity compact; do not use the left rail to dump full filesystem paths or route-local summaries.
- Keep search as one primary workspace surface:
  - fixed bottom-center dock on desktop
  - upward-opening grouped results
  - keyboard-first `Cmd/Ctrl+K` interaction
- Keep the left rail limited to search discoverability:
  - shortcut hint
  - compact `jump to` trigger
  - not a second full search field
- Keep search compiled-state-first and exact-first:
  - routes, scopes, docs, missions, plans, decisions, findings, activity, and graph entrypoints
  - canonical over supporting
  - active over historical
  - semantic fallback later, not default
- Keep the new routed console consuming compiled UI state rather than reading raw `.skopos/**` internals from React components.
- Keep `skopos ui dev` as the active authoring loop.
- Keep `skopos ui serve` as built preview output, not the final editing workflow.
- Keep `skopos ui render` alive as a snapshot fallback while the routed console becomes pilot-ready.
- Use the selected routed-app stack:
  - Vite
  - React
  - TanStack Router
  - Tailwind CSS
- Keep the current HTML renderer as a fallback during transition rather than deleting it immediately.
- Keep the first system UI milestone readable for humans without forcing raw `.skopos/**` artifact inspection.
- Keep route content classified explicitly:
  - `primary`
  - `supporting`
  - `diagnostic`
  - `raw`
- Keep the center pane focused on primary and supporting information only.
- Keep the right pane focused on supporting context and limited diagnostic detail only.
- Keep raw ids, raw filesystem paths, and raw artifact handles behind deliberate disclosure:
  - `copy id`
  - `open source`
  - `view artifact`
- Keep route families distinct:
  - overview as compact summary review
  - missions/scopes/docs index as list review
  - mission/scope/docs detail as document-style review
  - trust/proof as evidence review
  - activity as grouped recent-changes review
- Keep important knowledge visible as first-class product routes:
  - `plans`
  - `decisions`
  - `findings`
- Keep route surfaces deduplicated:
  - do not repeat trust or readiness state in sidebar, center pane, and right pane
  - do not repeat resource links in both the header and inspector
  - do not give zero-value counts first-class visual priority
- Keep prev and next route-owned and sequence-aware:
  - docs detail footer
  - filtered list context for decisions and findings
  - list-detail focus for missions and plans instead of shell-level prev and next
- Keep routed detail surfaces product-shaped: docs must read like a compact reader, and trust/proof/mission views must separate signal, evidence, and machine detail clearly.
- Keep docs detail on a real markdown-rendering path:
  - narrative and reference content rendered through markdown components
  - metadata and changelog kept in the inspector
  - code blocks, tables, blockquotes, links, and nested lists rendered semantically instead of through local text splitting
- Keep `overview`, `trust`, and `activity` as the first route-cleanup batch because they currently carry the most duplicated and machine-shaped content.
- Keep `mission detail`, `proof`, `scopes`, and routed knowledge detail surfaces aligned with the same contract now that the second cleanup batch is implemented.
- Keep `missions`, `plans`, `decisions`, and `findings` aligned with the same contract now that the list-review cleanup batch is implemented.
- Keep `trust` and `proof` aligned with the deeper evidence batch now that richer evidence trails and comparison modules are implemented on top of the cleaned review hierarchy.
- Keep `trust` and `proof` inventories in support disclosure now that the hierarchy cleanup batch has moved full check and scorecard inventory out of the center canvas.
- Keep `overview` as a compact summary route now that recent plan movement stays in the center lane and generic source-link clutter no longer belongs in the overview inspector.
- Keep `plan detail` on a single document-style center flow now that implementation steps, follow-on work, decisions, and risks are grouped into broader plan sections instead of equal-weight mini-cards.
- Keep `mission detail` focused on mission brief, checklist, and linked work now that validation command inventory has moved into the inspector.
- Keep `scope detail` focused on responsibility plus one combined current-work surface now that related plans and missions no longer compete as separate metadata buckets.
- Keep list-route inspectors free of duplicated filter state now that the current view is already expressed in route-owned chips.
- Keep list rows free of low-value empty metadata now that missions, plans, docs, and scopes suppress empty linkage or count noise unless it changes the reading surface.
- Keep the tighter shared typography and spacing rhythm stable now that the first detail-surface polish batch is implemented across the routed console.
- Keep the compact inspector density stable now that side-rail metadata and support lists have moved to a denser summary pattern.
- Keep the next UI batch focused on:
  - remaining route-specific interaction polish
  - sequence behavior
  - deeper comparison modules only where they improve review clarity without reintroducing summary clutter
- Keep authority, freshness, generated-state, and inferred-state indicators visible in the UI.
- Keep the design quality high enough for pilots:
  - strong hierarchy
  - restrained type scale
  - compact spacing rhythm
  - clear status language
  - deliberate layout
  - lower-chrome surfaces with fewer nested borders
  - progressive disclosure for machine details
- Keep the system UI built on compiled knowledge projections rather than hot-path rescans.
- Keep docs and route-relevant `.skopos/**` changes hot-reloadable in local UI development.
- Keep the dev watcher incremental:
  - docs changes rebuild docs projections
  - decisions and findings rebuild knowledge projections
  - plans and missions rebuild work projections
  - trust and proof artifact changes rebuild validation projections
- Do not require manual server restart as the normal UI authoring loop.
- Do not let the system UI drift into a generic editor, wiki, or graph playground.

## Docs Checklist

- Maintain `docs/00-start-here.md` as the deterministic read router.
- Keep active docs concise and strongly linked.
- Keep scope docs aligned with actual package ownership.
- Keep decisions, findings, and failure patterns in first-class registries.
- Record self-hosting structural friction as a finding when it exposes a real product gap, instead of leaving it only in ad hoc execution notes.
- Close resolved self-hosting findings by moving them to `docs/findings/archive/` once the proof lane and runtime contract are both in place.
- Add generated docs only under `docs/generated/`.
- Do not hand-edit generated mirrors or generated indexes.

## Package Checklist

- Keep package boundaries clean:
  - `model` owns contracts only
  - `config` owns config parsing/normalization only
  - `indexer` owns scanning/index generation only
  - `query` owns resolution/context only
  - `planner` owns planning/ask-back only
  - `docs-engine` owns docs governance only
  - `instructions` owns mirror generation only
  - `trust` owns impact/done/trust only
  - `runtime` orchestrates only
  - `cli`, `mcp`, and `ui` stay thin
  - keep `packages/cli/src/cli.ts` limited to entrypoint bootstrapping and shared error handling
  - keep top-level CLI dispatch explicit through a registry layer instead of a giant `switch`
  - keep CLI parsing and execution in command-owned modules under `packages/cli/src/cli/commands/**`
- Keep surface classification explicit:
  - public SDK core: `model`, `config`, `indexer`, `query`, `planner`, `instructions`, `trust`, `runtime`
  - tool surfaces: `cli`, `mcp`
  - internal product surfaces: `ui`, `docs-engine`
- Keep package manifests explicit:
  - declare `skopos.surface`
  - declare `skopos.releaseTarget`
  - declare `skopos.publishPhase`
  - keep `@skopos/cli` as the first public bundled CLI candidate
  - keep first-release package versions aligned at `0.1.0`
  - publish first as `@skopos/cli@0.1.0` with npm tag `next`
  - do not promote to `latest` until registry install smoke passes
  - publish the CLI under Apache-2.0 and include `LICENSE` in the package tarball
  - keep non-CLI packages `private: true` until each has a separate release contract
  - keep the CLI tarball free from private `@skopos/*` runtime dependencies
- Keep `fixtures/`, `internal/`, `tests/`, and generated roots out of the active package model unless a repo explicitly declares them as real scopes.
- Avoid package cycles.
- Avoid dumping shared logic into `runtime`.
- Keep extraction readiness by using the `@skopos/*` surface and avoiding project-specific imports in core packages.
- Keep a workspace-level `release:check` lane so future public-candidate packages stay machine-readable and reviewable.

## Runtime Checklist

- Make `init` the first real end-to-end slice.
- Make `init` scan existing repos and support greenfield bootstrap.
- Ask only high-value questions and recommend one option first.
- Add one first-class workflow router after discussion instead of expecting users to coach the execution order manually.
- Keep `plan`, `mission`, `impact`, `workflows`, `eval`, `trust`, and `done` as one explicit execution spine rather than parallel chat conventions.
- Add one first-class discussion-memory lane between chat and workflow artifacts instead of treating raw transcripts as default project memory.
- Generate root config and `.skopos/` artifacts from the bootstrap flow.
- Keep the operating loop explicit:
  - ingest
  - compile
  - query
  - lint
  - trust
  - compound
- Keep retrieval scope-first and compact-first.
- Keep semantic search as fallback, not default.
- Force ask-back on architectural, destructive, vendor, API, security, privacy, cost, and ambiguous preference decisions.
- Persist unresolved workflow questions and bounded recommendations as runtime artifacts instead of leaving them only in terminal output.
- Persist accepted direction through compact checkpoints and handoffs instead of transcript replay.
- Make `done` evidence-based, not summary-based.

## Quality Checklist

- Add one fixture repo for every major scenario:
  - greenfield
  - messy existing repo
  - large monorepo
  - library/package repo
- Keep proof benchmarks declared with explicit category and priority metadata before they enter the canonical scorecard.
- Keep proof baseline updates deliberate and reviewable when benchmark scope or expectations change.
- Add regression fixtures for retrieval mistakes, missed escalation, docs drift, and false trust.
- Keep a workspace-boundary benchmark so self-hosting and proof-heavy repos do not quietly flatten internal or fixture roots into the public SDK model.
- Add migrations when config or artifact schemas change.
- Keep generated artifacts deterministic.
- Keep trust reports explainable and provenance-backed.
- Keep unresolved `must-ask` decisions and required eval outputs visible to trust and closure instead of treating them as external process discipline.
- Add explicit knowledgebase health checks for stale artifacts, contradictions, orphaned knowledge, and missing canonicals.
- Distinguish immutable derived artifacts from mutable workflow artifacts in both enforcement and UX.
- Treat required project workflows as trust inputs with visible run evidence.
- Keep mutating workflow evidence actor-attributed when workflow runs can change shared workspace state.
- Keep mutable mission and override ownership explicit when more than one actor can touch the same workspace.
- Keep shared plan and mission artifacts provenance-attributed at creation time when an actor is known.
- Do not ship low-signal graph visuals; only add graph views when they clearly improve understanding.

## Adoption Checklist

- Keep install and first-run fast.
- Ensure the first value is visible before deep configuration.
- Ensure the SDK improves existing coding tools instead of competing with them.
- Lead with brownfield repo stabilization as the clearest adoption wedge.
- Ensure poor-quality repos become more stable over time instead of having their bad patterns amplified.
- Keep the docs UI readable for humans and the generated artifacts predictable for agents.
- Keep cross-chat continuity compact enough that resume context does not become token-hungry.

## Current Build Order

1. Lock docs, architecture, and package boundaries.
2. Implement root config schema and generated artifact contracts.
3. Implement minimal repo scanner and bootstrap report.
4. Implement `init` through `runtime` and `cli`.
5. Implement instruction mirror generation.
6. Implement compact context and scope resolution.
7. Add the workflow-router and supervision layer:
   - `start`
   - `next`
   - `decide`
   - `eval`
   - `questions`
   - `recommendations`
   - `evals`
   - trust and `done` closure enforcement for router state
   - Status:
     - `start`: implemented
     - `decide`: implemented
     - `next`: implemented
     - `eval`: implemented
     - closure enforcement: implemented
8. Add the discussion-memory continuity layer:
   - raw local turn journals
   - compact discussion checkpoints
   - pre-compaction and new-thread handoffs
   - discussion index for recent context and search
   - strict token budget and local-only retention policy
9. Make tool adapters and routed UI surfaces consume the router and discussion-memory lane by default.
   - keep one shared adapter lifecycle contract for Codex, Claude Code, and future hosts
   - treat Claude Code as the first shipped adapter, not the whole product contract
   - keep Codex on the same `skopos discuss` runtime and use the same adapter path for future hosts instead of separate memory paths
10. Build the proof-phase eval harness and brownfield-heavy fixture matrix.
11. Expand fixture breadth and evolve the proof baseline deliberately on top of the current scoring contract.
12. Use proof results to choose the next implementation slices.
