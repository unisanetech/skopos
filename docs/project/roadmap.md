# Skopos Roadmap

Skopos should be built in phases so the runtime becomes usable early without overbuilding the surface area.

## Metadata

- Doc ID: `SKOPOS-PROJECT-ROADMAP`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `no`
- Last Updated: `2026-07-25`
- Review Cycle: `per workpack`
- Related Docs:
  - `overview.md`
  - `vision.md`
  - `missing-decisions-checklist.md`
  - `proof-phase-plan.md`
  - `system-ui-plan.md`
  - `policy-pack-and-stack-intelligence-plan.md`
  - `human-guidance-and-developer-experience-plan.md`
  - `agentic-operating-plan.md`
  - `../architecture/00-architecture.md`
  - `../decisions/037-role-based-memory-and-agent-operating-layer.md`
  - `../decisions/038-skopos-self-hosting-mode-and-compatibility-boundaries.md`

## Changelog

- `2026-07-25`: Made P1-W11 the next architecture convergence priority: simplify Skopos
  into one agent-native project control plane with context/actions/guards, task intent,
  authority-aware memory, phase-separated validation, proof receipts, worktree-safe
  state, and complete downstream-project adoption.

- `2026-06-29`: Added Skopos self-hosting mode and fallback policy to the roadmap so internal work uses clean-refactor behavior while public distribution surfaces stay compatibility-protected.

- `2026-06-29`: Added role-based memory to the current roadmap so Skopos maps existing docs, instructions, gates, decisions, and findings before creating or recommending new project docs.

- `2026-06-29`: Reordered the current agentic-system roadmap around the concrete build sequence: first fix proof/readiness correctness, then project mode, cleanup policy, agent-led understanding, command-guided briefs, UI alignment, and pilots.

- `2026-06-29`: Added the final agentic operating direction: explicit project modes, no-legacy cleanup behavior, and command-guided agent prompt briefs now become the next foundation slice before broader launch claims.

- `2026-06-27`: Added the Memory Map and Agent Workflow Intelligence contract as the next foundation priority before broad pack expansion, so Skopos maps existing project truth by role and generates agent communication guidance for the complete workflow.
- `2026-06-24`: Refined the first architecture pack so it reads as portable Skopos guidance instead of a Skopos/Unisane-shaped folder template, with project-local names now treated as aliases and detected evidence.
- `2026-06-24`: Added dedicated rule-pack detail pages with structure-tree and architecture-contract rendering, so pack UI can now show what a pack expects and how the current codebase matches it.
- `2026-06-24`: Expanded the Rules route with full pack-detail review and codebase-verification guidance, so the next policy-pack UI priority moves to stack/gate recommendation clarity and acceptance/compare flows.
- `2026-06-24`: Added the routed Rules review surface for accepted packs, active rules, drift, local exceptions, and execution-lane guidance.
- `2026-06-24`: Added accepted-policy override management and `done` closure blocking for open accepted `must` drift, moving the pack roadmap from basic enforcement toward UI review and recommendation clarity.
- `2026-06-24`: Expanded Pack System V1 with composable accepted policies, richer human-facing pack metadata, and the first stack and gate packs.
- `2026-06-24`: Implemented the shared UI language cleanup slice, removing the most visible internal terms from search, readiness support panels, program context, and empty states.
- `2026-06-24`: Implemented the Discussion route guidance slice, so saved chat context now explains agreed direction, open questions, and checkpoints before showing discussion history.
- `2026-06-24`: Implemented the Work route guidance slice, so Missions and Plans now explain how to use tracked work sessions and saved plans before showing queues or plan internals.
- `2026-06-24`: Implemented the validation route guidance slice, so Readiness, Evidence, and Activity now explain what to review and what to do next before showing raw checks or history.
- `2026-06-24`: Implemented the Knowledge route guidance slice, so Docs, Decisions, and Issues now explain their practical use before listing project memory artifacts.
- `2026-06-24`: Implemented the Current Work next-action UI slice, so the overview now leads with the recommended next move, active tracked work, and before-finishing obligations instead of raw program-router pressure.
- `2026-06-24`: Implemented the routed UI orientation pass, so the console now uses developer-friendly navigation labels, shows the active Skopos mission on Current Work, improves empty states for missions/plans/evidence, and turns Project Map package detail into practical ownership guidance.
- `2026-06-24`: Implemented the first routed UI human-guidance slice on mission detail, so active mission pages now lead with progress, current phase, current focus, blockers, decisions, findings, proof needed, and guided open questions from existing Skopos artifacts.
- `2026-06-24`: Implemented the decisions/findings progress and guided-question CLI slice, so mission progress includes decision and finding summaries and `start`, `plan`, and `decide` now show questions with recommendations, tradeoffs, and next-step guidance.
- `2026-06-24`: Implemented the first mission-backed workpack progress projection in CLI workflow output, so active work now exposes approximate progress, current phase, done, doing-now, blockers, and proof-needed guidance without duplicating mission truth.
- `2026-06-24`: Implemented the second human-output CLI slice for workflow commands, proving next-step guidance on `next`, `program next`, `done`, and `eval` through focused e2e coverage.
- `2026-06-24`: Implemented the first human-output CLI slice for `trust` and policy commands, proving the new guidance contract through focused unit and CLI e2e tests before extending it to workflow and workpack surfaces.
- `2026-06-24`: Added the human guidance and developer experience direction so the next product-intelligence work must improve plain-language command output, guided questions, workpack progress, UI copy, and agent answer style rather than only adding machine-readable artifacts.
- `2026-06-24`: Landed the first accepted-policy loop, so the policy-pack roadmap now moves from catalog discovery into drift detection, local override handling, and closure integration for accepted `must` rules.
- `2026-06-24`: Clarified the policy-pack direction as project-agnostic LLM coding-agent intelligence and memory, using Unisane only as a rigor reference while requiring Skopos to keep installed project knowledge fresh across build, maintenance, and refactor work.
- `2026-06-24`: Added the policy-pack and stack-intelligence product plan to the roadmap so upcoming work can grow Skopos through accepted project policy, stack recommendation, gates, drift detection, and agent bootstrap integration with proof-grade pack quality.
- `2026-04-17`: Added the initial synthesized repo-understanding contract and active workpack, so the next brownfield-onboarding hardening slice now adds one compact explanation layer above raw bootstrap, scope, symbol, and graph artifacts instead of continuing to rely on machine-readable surfaces alone.
- `2026-04-16`: Added the self-healing product-loop decision and the first bounded hardening workpack, so current product work now groups active findings into onboarding and trust correctness, validation proportionality, and program/docs-state hygiene tracks before more broad surface growth.
- `2026-04-13`: Added the multi-agent adapter lifecycle contract and active follow-through workpack, so the next discussion-memory execution slice is now explicitly Codex plus broader host coverage rather than an implied future step after Claude Code.
- `2026-04-13`: Landed the first discussion-context UI slice, so the latest workflow handoff now appears in `overview`, `mission detail`, and the search dock; the remaining discussion-memory UI work now narrows to richer checkpoint exposure and later route promotion only if the embedded surfaces prove insufficient.
- `2026-04-13`: Added the discussion-context and sidebar information-architecture contract, so the next discussion-memory UI work now embeds handoffs and checkpoints into `overview`, `mission detail`, and the search dock first while deferring a dedicated discussion route until phase-1 workflow surfaces are in place.
- `2026-04-12`: Landed the first prompt-layering and token-telemetry slice, so `.skopos/agent/prompt-brief.json` now provides stable-prefix versus dynamic-tail guidance and hot-path budget measurements; the remaining token-control work is broader command-output telemetry, handoff briefs, and cache-aware host integration.
- `2026-04-12`: Added the accepted token-control and compact-agent-transport contract, so the next workflow and retrieval work now prioritizes compact command modes, `.skopos/agent/**` briefs, docs lifecycle filtering, lane minimization, and cache-aware prompt layering instead of treating token efficiency as a side effect of existing artifacts.
- `2026-04-12`: Updated the roadmap after the first routed program-state UI slice landed, so `.skopos/program/state.json` now has visible adoption in `overview`, `mission detail`, `trust`, and the search dock while the next control-plane/UI work narrows to questions plus recommendations visibility and discussion-memory promotion.
- `2026-04-12`: Updated the roadmap after the first low-noise program-router slice landed, so `.skopos/program/state.json`, `skopos program sync`, and `skopos program next` now exist and the next control-plane work shifts to discussion-memory inputs plus routed UI adoption instead of still treating the entire program lane as speculative.
- `2026-04-12`: Added the supervision-cost and workflow-weight discipline to the roadmap, so future control-plane work must now prove that it reduces supervision more than it increases process weight before expanding the product surface.
- `2026-04-12`: Updated the roadmap with the accepted program-router and obligation contract, so the next structural control-plane slice now sits above the implemented mission router: program state, sequencing, interruption, and docs plus UI obligations now need to land before broader workflow UX expansion.
- `2026-04-12`: Updated the roadmap after execution-surface guidance landed, so the workflow router now defaults to `artifact-only` execution memory and only escalates to a temporary workpack doc when coordination pressure is broad enough to justify the extra planning surface.
- `2026-04-12`: Updated the roadmap after the discussion-memory contract landed, so the next structural increment is now compact discussion checkpoints and handoffs plus adapter and UI adoption of the router rather than more closure-enforcement work.
- `2026-04-12`: Updated the roadmap after trust-and-done closure integration landed, so the workflow-router baseline now extends through closure and the next workflow increment shifts to adapter plus routed-UI adoption of the implemented router artifacts.
- `2026-04-12`: Updated the roadmap after the eval-to-closure handoff fix, so the remaining workflow-router focus stays on trust-and-done enforcement while `eval` now reconciles non-decision checklist drift and hands off cleanly to explicit mission completion.
- `2026-04-12`: Updated the roadmap after the CLI surface decomposition batch, so the `skopos` tool surface now has a thin bin entrypoint plus command-owned modules and the remaining tool-surface work can stay focused on workflow/trust integration instead of further single-file CLI drift.
- `2026-04-12`: Updated the roadmap after `skopos eval` landed, so the remaining workflow-router focus narrows again to trust-closure integration on top of the implemented `start`, `next`, `decide`, `eval`, `questions`, `recommendations`, and `evals` surfaces.
- `2026-04-12`: Updated the roadmap after `skopos next` landed, so the remaining workflow-router focus narrows again to `eval` plus trust-closure integration on top of the implemented `start`, `next`, `decide`, `questions`, and `recommendations` surfaces.
- `2026-04-11`: Updated the roadmap after `skopos decide` landed, so the remaining workflow-router focus narrows to `next`, `eval`, and trust-closure integration on top of the implemented `start`, `decide`, `questions`, and `recommendations` surfaces.
- `2026-04-11`: Updated the roadmap after the first workflow-router slice landed, so the current focus now shifts from inventing the router contract to completing the remaining `next`, `decide`, `eval`, and trust-closure integration work on top of the implemented `start` plus `questions` and `recommendations` artifacts.
- `2026-04-11`: Updated the roadmap to add the accepted workflow-router contract, so the next structural increment now prioritizes `start`, `next`, `decide`, `eval`, and the related question or recommendation artifacts before more agent-memory or recommendation UX expansion.
- `2026-04-11`: Updated the roadmap to reflect the implemented Phase 2 search index, so the next search work can stay on smaller ranking and UX tuning instead of still treating the generated search-entry surface as pending.
- `2026-04-11`: Updated the roadmap to reflect the hardened `skopos ui dev` watcher scope after a self-hosted macOS watcher OOM, so the next dev-loop work can focus on longer-running stability proof instead of still correcting generated-output and tooling-churn self-watch drift.
- `2026-04-11`: Updated the roadmap to reflect the implemented Phase 1 search dock, so the next search work now moves from shell placement into a dedicated compiled search index while the routed console keeps one bottom-center exact-first command surface stable.
- `2026-04-11`: Updated the roadmap with the accepted search-and-command dock doctrine, so the next UI batch can add one bottom-center fixed workspace search surface with compiled-state exact-first retrieval instead of drifting into competing header and sidebar search fields or generic site-search behavior.
- `2026-04-11`: Updated the roadmap to reflect the accepted diagram-versus-graph contract and the first Mermaid reader implementation, so the next docs-surface work can build on doc-owned explanatory diagrams without confusing them with the canonical graph-artifact lane.
- `2026-04-11`: Updated the roadmap to reflect typed canonical JSON artifact pages in docs detail, so the next docs-surface work can move beyond the old empty-reader fallback and focus on further artifact-surface polish instead of still treating generated JSON as an unresolved display gap.
- `2026-04-11`: Updated the roadmap to reflect the simplified sidebar-footer batch, so the next UI work can move past the heavier left-rail footer treatment and focus on smaller sidebar polish instead of still correcting status-dock complexity.
- `2026-04-11`: Updated the roadmap to reflect the sidebar-shell refinement batch, so the next UI work can move past stretched left-rail spacing and duplicated workspace chrome instead of still correcting those shell-level navigation issues.
- `2026-04-11`: Updated the roadmap to reflect the list-inspector and empty-state wording cleanup batch, so the next UI work can move past count-heavy list support labels and snapshot-heavy empty-state copy instead of still correcting those shared product-language issues.
- `2026-04-11`: Updated the roadmap to reflect the proof-inspector and route-copy cleanup batch, so the next UI work can move past repeated proof support metrics and the last obvious screen-level narration drift instead of still correcting those shared readability issues.
- `2026-04-11`: Updated the roadmap to reflect the inspector-preview and route-copy cleanup batch, so the next UI work can move past silent inspector truncation and product-internal route narration instead of still correcting those shared readability issues.
- `2026-04-11`: Updated the roadmap to reflect the inspector-truthfulness and dead-support cleanup batch, so the next UI work can move past misleading inspector badge counts and stale trust/proof support leftovers instead of still correcting shared review-surface drift.
- `2026-04-11`: Updated the roadmap to reflect the shared inspector and list-review polish batch, so the next UI work can move past list-route metadata noise and disclosure-control cleanup instead of still correcting obvious admin-shaped route chrome.
- `2026-04-11`: Updated the roadmap to reflect the plan, mission, and scope detail cleanup batch, so the next UI work can move past the last obvious detail-route hierarchy mistakes and focus on the remaining system polish instead of still correcting center-versus-support placement on those routes.
- `2026-04-11`: Updated the roadmap to reflect the proof, trust, and overview hierarchy cleanup batch, so the next UI work can move deeper into plan, mission, and scope detail refinement instead of still correcting obvious center-versus-support allocation mistakes on the core review routes.
- `2026-04-11`: Updated the roadmap to reflect the activity-route mixed-feed redesign, so the next UI work can build on a real recent-changes surface instead of still correcting the center-lane versus inspector split on activity.
- `2026-04-11`: Updated the roadmap to reflect the activity-route timeline cleanup, so the next UI work can move past raw operational-log repetition and keep improving route-specific signal quality instead of still fixing basic timeline semantics.
- `2026-04-11`: Updated the roadmap to reflect the platform-layer document projection split and reader-support split, so the next UI work can keep thinning mixed platform and reader helper files instead of drifting back into one large build-service or reader-support module.
- `2026-04-11`: Updated the roadmap to reflect the shared primitive and routing-policy split, so the next UI work can move past mixed primitive buckets and keep pushing the remaining cleanup into selectors, features, and page-family compounds.
- `2026-04-11`: Updated the roadmap to reflect the deeper knowledge feature decomposition pass, so the next UI work can move from knowledge file breakup toward the next selector and feature cleanup targets instead of still treating plans and docs as one large ownership bucket.
- `2026-04-11`: Updated the roadmap to reflect the deeper work and validation feature decomposition pass, so the next UI work can shift further into the remaining knowledge feature modules instead of keeping mission detail and proof trapped in oversized section files.
- `2026-04-11`: Updated the roadmap to reflect the work and validation selector cleanup pass, so the next UI work can move from screen-local shaping cleanup toward deeper feature decomposition in the largest remaining modules.
- `2026-04-11`: Updated the roadmap to reflect the narrow-layout responsive audit pass, so the next UI work can move beyond basic compact-layout wrapping fixes and focus on deeper feature decomposition plus remaining selector cleanup.
- `2026-04-11`: Updated the roadmap to reflect the stacked-flow and center-canvas normalization pass, so the next UI work can focus on deeper responsive auditing and remaining feature decomposition instead of still correcting stacked inspector ownership or residual center grids.
- `2026-04-11`: Updated the roadmap to reflect the responsive shell-normalization and list-row polish pass, so the next UI work can move from tablet-shell drift and boxed list cleanup toward deeper responsive auditing and remaining feature decomposition.
- `2026-04-11`: Updated the roadmap to reflect active reader-outline tracking and copyable fenced-code blocks, so the next reader work can focus on deeper polish instead of basic section navigation or code actions.
- `2026-04-11`: Updated the roadmap to reflect internal knowledge-link routing and richer fenced-code presentation in the markdown reader, so the next reader work now builds on routed doc-link behavior and a clearer code shell instead of still treating those as unresolved.
- `2026-04-11`: Updated the roadmap to reflect the implemented markdown-rendering and docs-reader pipeline, so the next UI work now builds on a real narrative markdown reader instead of still treating semantic document rendering as pending.
- `2026-04-11`: Updated the roadmap to add the accepted markdown-rendering and docs-reader pipeline, so the next docs-reader work now shifts from text-splitting cleanup toward a real markdown-rendered narrative surface with support context classified into the inspector.
- `2026-04-11`: Updated the roadmap to reflect the stronger inspector-section grammar, the raised small-text token floor, and classified document sections, so the next UI work now builds on a cleaner docs reader and better right-rail disclosure instead of still treating those basics as unresolved.
- `2026-04-11`: Updated the roadmap to reflect the first route-family knowledge selector split, so the next UI work now builds on dedicated knowledge screen modules plus shared plan/document selectors instead of continuing to let screen files own that lookup logic inline.
- `2026-04-11`: Updated the roadmap to reflect the removal of the old shared compatibility barrel, the canonical `cn` helper backed by `clsx` plus `tailwind-merge`, and the deeper route-family split inside the work, validation, and knowledge feature layers.
- `2026-04-11`: Updated the roadmap to reflect the first `features/**` extraction baseline plus the thin-scrollbar shell policy, so the next UI work now shifts from moving repeated sections out of screens toward deeper feature decomposition, selector cleanup, and consistency work on top of the new feature layer.
- `2026-04-11`: Updated the roadmap to reflect the implemented `screens/**` migration baseline, so the next UI work now shifts from moving route composition out of `app/routes/**` toward feature extraction and further route-file reduction on top of the new screen layer.
- `2026-04-11`: Updated the roadmap to reflect the implemented page-family migration baseline, so the next UI work now shifts from hand-owned routed page grammar toward `screens/**`, feature sections, and further route thinning on top of `patterns/pages/**`.
- `2026-04-11`: Updated the roadmap to reflect the first shared-UI structural split, so the next UI work now builds on owned `patterns`, `platform`, and `support` modules instead of continuing to grow one shared compatibility file.
- `2026-04-11`: Updated the roadmap to reflect the implemented first `@skopos/ui` token layer, so the next UI work now extends the new width, typography, and control-size system into page-family compounds instead of still treating token extraction as pending.
- `2026-04-11`: Updated the roadmap to make the next token-system batch explicit, so the next UI work now starts by normalizing typography, control heights, widths, and surface tokens before deeper component migration.
- `2026-04-11`: Updated the roadmap again to make the target `@skopos/ui` source structure explicit, so the next UI batch now starts with ownership normalization around `screens`, `patterns`, `features`, `platform`, and `support` instead of continuing route-local cleanup in place.
- `2026-04-11`: Updated the roadmap with the accepted UI-system normalization batch, so the next UI work now shifts from isolated route polish toward layout-token extraction, page-family compounds, inspector normalization, and stronger projection boundaries.
- `2026-04-11`: Updated the roadmap to reflect the implemented inspector-interaction batch, so the next UI work now shifts from keeping every support panel permanently open toward deeper comparison modules and the remaining route-specific interaction details.
- `2026-04-10`: Updated the roadmap to reflect the implemented shell-refinement batch, so the next UI work now shifts from wrapper correctness toward remaining route-specific interaction polish and deeper comparison surfaces on top of the narrower reading rail and shared-scroll shell.
- `2026-04-10`: Updated the roadmap with the accepted shell-refinement batch, so the next UI work now shifts from general polish toward narrower content rails, cleaner route-owned headers, shared inspector width, corrected shell background split, and fixed desktop scroll ownership.
- `2026-04-10`: Updated the roadmap to reflect the implemented compact-inspector batch, so the next UI work now shifts from side-rail density toward remaining interaction polish and selected comparison modules.
- `2026-04-10`: Updated the roadmap to reflect the implemented typography and detail-surface polish batch, so the next UI work now shifts from density cleanup toward deeper comparison modules where useful and the remaining route-specific interaction polish.
- `2026-04-10`: Updated the roadmap to reflect the implemented deeper trust and proof evidence batch, so the next UI work now shifts from evidence-module buildup toward route-specific typography, spacing, and remaining detail-surface polish on top of the cleaned routed console.
- `2026-04-10`: Updated the roadmap to reflect the implemented wider-inspector batch, so the next UI work now shifts from shell-width and support-content placement into deeper evidence and comparison modules on top of the cleaned routed console.
- `2026-04-10`: Updated the roadmap to reflect the implemented inspector-consistency batch, so the next UI work now shifts from right-rail vocabulary cleanup toward deeper comparison and evidence modules on top of the cleaned routed console.
- `2026-04-10`: Updated the roadmap to reflect implemented route-owned filtering on `missions`, `plans`, `decisions`, and `findings`, so the next UI work now shifts from filter plumbing toward inspector consistency and deeper evidence/comparison panels.
- `2026-04-10`: Updated the roadmap to reflect the implemented list-review cleanup batch on `missions`, `plans`, `decisions`, and `findings`, so the next UI work now shifts from route cleanup toward inspector consistency, route filters, and deeper comparison or evidence modules.
- `2026-04-10`: Updated the roadmap to reflect the implemented second routed cleanup batch on `mission detail`, `proof`, `scopes`, and knowledge detail surfaces, so the next UI work now narrows to remaining list-detail consistency and inspector polish instead of still treating those review routes as pending cleanup.
- `2026-04-10`: Updated the roadmap to reflect the implemented grouped left rail plus first-class `plans`, `decisions`, and `findings` routes, so the next UI work now builds on stable navigation and knowledge routing instead of still treating those surfaces as pending.
- `2026-04-10`: Updated the roadmap to reflect the first routed cleanup batch on `overview`, `trust`, and `activity`, so the next UI work now moves deeper into mission, proof, scopes, docs, and inspector refinement instead of still cleaning the noisiest routes.
- `2026-04-10`: Updated the roadmap to reflect the implemented `ui dev` authoring loop, so the next UI work now builds on live HMR plus watched compiled-state refresh instead of treating that dev loop as still pending.
- `2026-04-10`: Refined the roadmap around a true UI authoring loop for the routed console, so the next UI batch now requires `ui dev`, frontend HMR, and watched compiled-state refresh instead of relying on one-time build-plus-serve preview behavior.
- `2026-04-10`: Refined the roadmap around a clean left-rail and knowledge-routing doctrine for the routed console, so the next UI batch now includes grouped navigation, first-class plans/decisions/findings routes, and route-owned prev-versus-next behavior instead of more header clutter.
- `2026-04-10`: Refined the roadmap around an explicit information-hierarchy cleanup for the routed console, so the next UI batch now focuses on simplifying center-pane content, moving subsidiary context into the right inspector, and hiding raw machine detail behind deliberate affordances before more visual polish.
- `2026-04-10`: Refined the roadmap around the accepted desktop app-shell doctrine for the routed console, so the next UI work is now explicitly shell geometry, pane layout primitives, route-family conversion, and final polish instead of general route cleanup.
- `2026-04-10`: Updated the roadmap to reflect the implemented routed detail-view slice in `@skopos/ui`, shifting the next UI work from basic route depth toward comparison panels, evidence density, and local serving polish on top of the new docs-reader and review surfaces.
- `2026-04-10`: Updated the roadmap to reflect the implemented routed app foundation in `@skopos/ui`, shifting the next UI work from scaffolding toward deeper mission, trust, proof, docs, and activity refinement on top of the new console base.
- `2026-04-10`: Updated the roadmap to reflect the routed-app stack decision for the Skopos system UI, shifting the next UI work from more static-template refinement toward Vite plus React plus TanStack Router plus Tailwind app scaffolding.
- `2026-04-10`: Updated the roadmap to reflect the implemented second system UI slice, so the next UI work now starts from a real execution cockpit and richer trust/proof/activity surfaces instead of only a stable shell.
- `2026-04-10`: Updated the roadmap to reflect the implemented first system UI shell upgrade in `@skopos/ui`, so the next UI work now builds on a calm left-nav plus evidence-rail console instead of the earlier single-page portal shell.
- `2026-04-10`: Updated the roadmap to add a focused pilot-grade UI productization batch, shifting the next work from more proof-lane expansion toward a human-facing console that is clear enough for real repo pilots.
- `2026-04-10`: Updated the roadmap to reflect the new before-versus-after brownfield comparison lane, shifting the next proof work from proving stabilization delta in fixture pairs toward broader real-repo comparison pressure outside the current controlled fixture set.
- `2026-04-10`: Updated the roadmap to reflect batch-slicing proof coverage for cross-actor blocking and explicit force-transfer, shifting the next proof work away from linked-slice ownership basics and further toward broader real-repo comparison pressure.
- `2026-04-10`: Updated the roadmap to reflect the new partial library-structure drift benchmark lane, shifting the next proof work from architecture middle-band coverage toward broader real-repo comparison and concurrent-run pressure.
- `2026-04-10`: Updated the roadmap to reflect the new mixed-brownfield benchmark lane, shifting the next proof work from adding a middle-band repo shape toward still broader brownfield realism and real-repo comparison pressure.
- `2026-04-10`: Updated the roadmap to reflect implemented mission-level multi-actor coordination, shifting the next proof work from first ownership semantics toward broader concurrent-run pressure and richer brownfield realism.
- `2026-04-10`: Updated the roadmap to reflect implemented publication-surface hardening through machine-readable manifest metadata and a release-readiness gate, shifting the next work back toward proof breadth and multi-actor runtime pressure instead of package-boundary basics.
- `2026-04-09`: Updated the roadmap to reflect the implemented compiled-state invalidation lane, shifting the next proof work from invalidation basics toward stronger freshness policy and multi-actor runtime pressure.
- `2026-04-09`: Updated the roadmap to reflect the implemented hot-path performance proof lane, so the next proof work shifts from establishing latency budgets to tightening invalidation and freshness behavior.
- `2026-04-09`: Updated the roadmap to reflect the first compiled-state hot-path optimization, shifting the next proof work toward explicit latency and invalidation budgets rather than more cache-first rewiring.
- `2026-04-09`: Updated the roadmap to reflect that `.skopos/index.json`, `.skopos/log.jsonl`, and the matching proof lane are now implemented, shifting the next proof work toward stronger freshness enforcement and multi-actor runtime pressure instead of index/log readiness.
- `2026-04-09`: Updated the roadmap to reflect that canonical override artifacts and the `skopos overrides` CLI are now implemented and benchmarked, shifting the next proof work toward index/log readiness and broader brownfield fixture breadth.
- `2026-04-09`: Updated the roadmap to reflect that docs-health scanning and stale-doc trust warnings are now implemented and benchmarked, shifting the next proof work toward fixture breadth, index/log readiness, and stronger freshness enforcement.
- `2026-04-09`: Updated the roadmap to reflect that approval-sensitive workflow enforcement is now implemented and benchmarked, shifting the next proof work back toward fixture breadth and index/log readiness.
- `2026-04-09`: Updated the roadmap to reflect that scorecard-driven baseline comparison is now implemented, shifting the next proof work toward fixture breadth and index/log readiness.
- `2026-04-09`: Updated the roadmap to reflect that the eval harness and scoring contract are now implemented and resolved, shifting the next proof work toward fixture breadth, comparisons, and index/log readiness.
- `2026-04-09`: Updated the roadmap to reflect that tool-native enforcement is now implemented and benchmarked, leaving the eval harness and scoring contract as the remaining open proof decision.
- `2026-04-09`: Updated the roadmap to reflect that subtree-targeted large-repo mode is now implemented and benchmarked, leaving tool-native enforcement and eval scoring as the next proof decisions.
- `2026-04-09`: Updated the roadmap to reflect that current-state versus recommended-state architecture is now a compiled artifact with benchmark coverage, shifting the next proof work toward large-repo mode and the remaining proof decisions.
- `2026-04-09`: Updated the roadmap to reflect that the first proof-phase harness now exists, shifting the next increment from harness creation to harness expansion and proof-decision refinement.
- `2026-04-09`: Marked the first blocker set resolved and moved the roadmap fully into proof-phase execution.
- `2026-04-09`: Refined the roadmap so the proof phase explicitly centers on the compiled project knowledge loop, brownfield benchmarks, and index-log readiness instead of more surface expansion.
- `2026-04-09`: Reset the roadmap around a proof phase and linked blocker decisions that must be resolved before more feature-surface implementation.
- `2026-04-09`: Updated the roadmap to reflect that graph-backed docs, command, and scope-relations portal modules are now implemented, leaving richer trust/docs modules and large-project graph slicing as the next increment.
- `2026-04-09`: Updated the roadmap to reflect that docs, commands, and scope-relations graph coverage is now implemented, leaving richer portal modules and large-project graph slicing as the next increment.
- `2026-04-09`: Updated the roadmap to reflect that the portal now includes recent-activity modules, leaving broader graph coverage and richer portal views as the next increment.
- `2026-04-09`: Updated the roadmap to reflect that the first local portal shell is now implemented, leaving deeper portal modules and broader graph coverage as the next increment.
- `2026-04-09`: Updated the roadmap to reflect that the first local graph portal renderer is now implemented, leaving the fuller portal shell and broader graph coverage as the next increment.
- `2026-04-09`: Updated the roadmap to reflect that the first UI graph-projection read-models are implemented, leaving portal rendering and broader graph coverage as the next increment.
- `2026-04-09`: Updated the roadmap to reflect that the first internal graph artifacts are now implemented, leaving UI projections and broader graph coverage as the next increment.
- `2026-04-09`: Updated the roadmap to reflect that workflow-aware planning, impact, and closure are now implemented, making the graph layer the next strong slice.
- `2026-04-09`: Updated the roadmap to reflect that the initial workflow registry, CLI execution, and run-evidence slice is now implemented, leaving workflow-aware planning and closure as the next increment.
- `2026-04-09`: Updated the roadmap to include the project workflow extension registry and workflow-run evidence after the core trust and planning layers.
- `2026-04-09`: Updated the roadmap to add the internal graph backbone and selective UI graph views after the core trust and retrieval layers.
- `2026-04-09`: Added the first phased roadmap to keep implementation order constrained and value-sequenced.

## Current Focus

- Converge the agent-native single control plane before adding broader workflow,
  program, discussion, pack, or UI surface:
  - protect task intent through compact goal/scope/acceptance/non-goal/constraint/proof
    contracts
  - compile current concepts into context, actions, and guards
  - make light work avoid mission ceremony while retaining durable workpacks for
    long-running or coordinated work
  - separate admission, changed iteration, stabilization, and one final closure
  - add source-bound receipts and exact-command ownership
  - make current state task/worktree aware
  - add authority, memory promotion, and negative-knowledge contracts
  - let complex projects fully adopt Skopos and contribute domain capabilities without a
    parallel LLM workflow
  - prove portability on Skopos, a complex monorepo, a small project, and a messy
    brownfield project

- Restore proof and readiness correctness before adding broader agentic surfaces:
  - update proof fixtures so scanner-only project understanding stays `needs-review`
  - require agent-reviewed project memory before trust can report full agent readiness
  - keep one intentional scanner-only fixture as a regression guard
  - make `pnpm proof` pass under the stronger understanding standard
  - close active documentation or workflow missions only after proof reflects the new contract
- Add the project-mode and command-guided agent brief layer:
  - record `brownfield`, `clean-refactor`, `greenfield-in-existing-repo`, or `new-project` as durable setup truth
  - make existing repo setup ask whether to preserve behavior, cleanly refactor, or reset toward a new architecture
  - add no-legacy cleanup policy for clean-refactor and greenfield-in-existing-repo modes
  - make `skopos next` and related workflow commands produce practical agent prompt briefs
  - make trust warn when the selected mode conflicts with observed legacy, duplicate, fallback, or hybrid patterns
  - show project mode, cleanup obligations, memory readiness, questions, findings, and next action in the UI
  - pilot both brownfield and clean-refactor modes on existing projects before launch claims
- Make role-based memory the docs strategy:
  - map existing docs and instruction files to required memory roles before creating new docs
  - support project purpose, architecture, domains, workflows, validation, decisions, findings, project mode, cleanup policy, and agent instructions as tracked roles
  - ask confirmation questions when multiple docs compete for the same role
  - recommend docs cleanup when roles are missing, duplicated, stale, or contradictory
  - keep AGENTS/CLAUDE/Copilot/Cursor mirrors compact and linked to memory roles
- Dogfood Skopos self-hosting mode:
  - set Skopos internal work to clean-refactor behavior
  - protect public CLI, package export, generated schema, and adapter compatibility boundaries
  - inventory existing fallback and compatibility paths
  - require owner, reason, affected surface, and removal condition or compatibility note for durable fallbacks
  - add trust or policy drift warnings for internal fallback paths without metadata
- Implement Memory Map v1 before more broad policy-pack expansion:
  - map existing project truth by role instead of assuming `docs/00-start-here.md`
  - distinguish greenfield scaffolding from brownfield mapping and suggestions
  - make `.skopos/memory/state.json` the durable runtime surface for observed, inferred, accepted, operational, and agent-ready memory
  - make trust check memory completeness and freshness
  - add a human-readable Project Memory UI surface
  - generate an agent communication brief so coding agents explain lanes, questions, progress, proof, memory updates, and handoffs clearly
- Add the human guidance layer across command output, UI surfaces, workpacks, and agent answers:
  - keep strict `.skopos/**` artifacts as the machine contract
  - make default output explain status, risk, blocker, question, proof, and next step in simple English; implemented for trust, policy, `start`, `plan`, `decide`, workflow-router, program-router, done, and eval command paths
  - preserve `--json` and raw artifact views for agents, scripts, and expert users
  - add workpack progress summaries with current phase, approximate completion, next action, blockers, decisions, findings, and proof needed; first CLI projection now covers mission-backed progress, phase, done, doing-now, blockers, decisions, findings, and proof-needed guidance
  - make guided questions include a recommended option, tradeoffs, and what happens after the answer; first CLI projection now covers `start`, `plan`, `decide`, and `next`
  - route mission detail through the same guidance model; first UI slice now shows mission progress, current focus, blockers, decisions, findings, proof, and open questions before raw detail
  - treat human comprehension as part of product quality, not only UI polish
- Continue policy-pack, stack-intelligence, and durable memory as the next major product-intelligence direction after the current onboarding, token-control, and program-state hardening lanes. The first policy catalog, accepted-policy loop, accepted-policy drift report, composable policy application, `stack.async-work`, `gates.progressive-validation`, local policy overrides, `done` blocking for open accepted `must` drift, and routed Rules review surface with pack-detail/codebase-verification guidance are now implemented. Next priority is dedicated recommendation UX for stack and gate packs plus richer pack comparison and acceptance flows before broad catalog expansion. Treat this as a proof-grade project-agnostic layer: stack capability reasoning, gates, freshness rules, and agent briefs must land before broad public claims. Unisane may inspire rigor, but Skopos must work for any serious product repo.
- Run the self-healing loop before more broad control-plane or UI growth:
  - detect real product friction through self-hosting and pilots
  - record it as bounded findings rather than chat memory
  - fix one failure mode at a time
  - prove each fix on Skopos and one non-Skopos workspace before broad rollout claims
- Group current product work into three bounded hardening tracks:
  - Track A: onboarding, scope, and trust correctness
  - Track B: validation and transport proportionality
  - Track C: program and docs-state hygiene
- Treat messy brownfield onboarding as requiring one synthesized understanding layer above raw artifacts:
  - compact repo summary
  - compact feature inventory
  - compact implementation hotspots
  - confidence-aware orientation before broad symbol or graph browsing
- Keep the hardening order explicit:
  - onboarding and governance inheritance correctness first
  - scope and routing correctness second
  - validation proportionality third
  - closure and trust signal quality fourth
  - freshness and UI truthfulness after that
- Apply the token-control and compact-agent-transport contract before more control-plane growth:
  - add compact output modes for `trust`, `done`, `eval`, `next`, and `program next`
  - add `.skopos/agent/**` briefs for mission, program, trust, done, eval, and handoff state
  - filter historical docs out of the default retrieval lane and load durable docs only on demand
  - keep long workflow, build, test, and proof logs local unless a failing detail is explicitly needed
  - add smallest-sufficient validation lane selection before broader workflow or UI expansion
  - stabilize prompt layering before provider-level cache strategy work
- Apply the supervision-cost and workflow-weight discipline to the next control-plane increments:
  - keep new layers only when they remove more manual supervision than they add workflow ceremony
  - prefer one compact artifact or route extension over multiple parallel planning or memory surfaces
  - keep `artifact-only` as the default execution surface
  - keep raw discussion and broad queue state off the default prompt hot path
- Keep the first low-noise program-control slice stable and expand it deliberately:
  - keep `.skopos/program/state.json` as the single compact control-plane artifact
  - keep `skopos program sync` and `skopos program next` as the only public program-router commands for now
  - extend sources beyond active mission plus active findings into promoted discussion checkpoints, trust blockers, and explicit roadmap items
  - keep typed docs and UI obligations compact and deterministic
  - expose current attention, `do-now`, interruption guidance, and obligations in the routed UI instead of leaving them terminal-only
- Keep the mission-router baseline stable while the program-control layer is added:
  - keep `skopos start` as the canonical post-discussion entrypoint
  - keep `skopos next` as the canonical ongoing-work router
  - keep `skopos decide` as the canonical durable decision-recording path
  - keep `skopos eval` as the mission-level proof lane before closure
  - keep `.skopos/questions.json` and `.skopos/recommendations.json` stable
  - keep router execution-surface guidance stable and default it to `artifact-only`
  - keep `.skopos/evals/*.json` stable
  - keep trust and done wired to those router artifacts instead of depending on prompt discipline
  - keep the eval-to-closure handoff clean so `next` recommends `skopos mission complete` instead of reintroducing checklist drift
  - keep the new program router low-noise so it continues to reduce supervision without turning into a second heavy planning ritual
  - add the discussion-memory lane under `.skopos/discussions/` as the continuity input to the program router:
    - raw local turn journal
    - compact checkpoints
    - pre-compaction and new-thread handoffs
    - discussion index for search and recent context
  - keep raw discussion local-only and non-default for retrieval
  - cap handoff size so resume context stays compact instead of replaying transcripts
  - make compaction hooks generate one handoff before context is collapsed
  - make tool adapters call the program router before broad reprioritization and the mission router before broad implementation
  - make tool adapters append turns and trigger handoffs automatically instead of depending on model memory
  - keep one explicit multi-agent adapter lifecycle contract so Codex and future hosts map into the same `skopos discuss` runtime instead of inventing separate continuity behavior
  - keep Claude Code and Codex on the shared `skopos discuss` runtime, then add future hosts through the same adapter contract before claiming broader first-class support
  - expose open workflow questions and recommendations in the routed UI instead of leaving them as terminal-only state
  - expose recent checkpoints and latest handoff in search and mission detail instead of leaving continuity in chat only
  - let compiled references, recommendations, and future UI guidance build on top of that router rather than replacing it
  - keep the `skopos` CLI on the new thin-entrypoint structure instead of letting parser and handler growth rebuild a single-file bucket
- Keep the proof scorecard passing while shifting the next batch into pilot-readiness UI productization.
- Use the next increment for a focused human-facing console:
  - treat the next UI batch as a system normalization pass, not another page-by-page patch cycle
  - extend the implemented shell and content-rail token layer through the remaining route-local primitives and page-family compounds
  - split shared UI responsibilities into shell, primitives, inspector, and page-family compounds
  - keep list, detail, review, and reader routes on the implemented family-level compounds
  - keep route composition on the implemented `screens/**` layer and continue splitting repeated route sections through the new `features/**` ownership layer
  - keep direct-owned imports stable and do not reintroduce a shared compatibility barrel
  - keep the canonical `cn` helper stable as the only class-composition entrypoint
  - keep splitting remaining large feature families into route-family modules and move more page-specific shaping into selectors and compiled projections
  - keep the new knowledge selector layer stable and use the same selector split pattern for the next large route families
  - keep the new mission-detail and proof feature splits stable and use the same decomposition pattern on the remaining large knowledge feature modules
  - keep the new knowledge feature splits stable and push the same cleanup pattern into the next remaining large shared primitives and selector layers
  - keep the new section-primitive and route-policy split stable and avoid rebuilding mixed primitive buckets or route-policy constants back inside `app/router.tsx`
  - keep the new document projection and reader-support split stable and use the same ownership pattern on the remaining mixed platform/read-model files
  - move repeated route summaries and support metadata shaping into stable selectors or compiled projections
  - keep the markdown-rendered docs reader stable and continue polishing reader-specific behavior without moving metadata, changelog, or source context back into the main reading flow
  - keep doc-owned Mermaid diagrams constrained to the markdown-reader lane and keep compiled `.skopos/graph/*` plus the graph portal as the canonical graph surface
  - normalize responsive behavior across desktop, tablet, and narrow layouts
  - keep `skopos ui dev` as the default contributor browser loop
  - keep `skopos ui serve` as preview rather than the final editing workflow
  - keep Vite HMR for UI source and watched compiled-state refresh for docs and `.skopos/**` stable
  - keep the implemented bottom-center search and command dock stable instead of reintroducing a header search field
  - keep the left rail limited to search discoverability, not a second full search surface
  - build the next search batch as a dedicated compiled search index while keeping search exact-first and compiled-state-first
  - keep the grouped left-rail navigation model stable
  - keep first-class routes for plans, decisions, and findings stable
  - keep prev and next route-owned instead of shell-owned
  - lock the center-pane versus right-pane information contract
  - remove duplicate status, links, and low-value counts from routed pages
  - move subsidiary and diagnostic context into the right inspector instead of the center lane
  - hide raw ids, raw paths, and artifact handles behind deliberate affordances
  - use the cleaned `overview`, `trust`, and `activity` routes as the doctrine baseline for the remaining route families
  - keep the cleaned `mission detail`, `proof`, `scopes`, and knowledge-detail routes stable as the second doctrine batch
  - keep the cleaned `missions`, `plans`, `decisions`, and `findings` routes stable as the list-review batch
  - keep route-owned filter behavior stable across the cleaned list routes
  - keep inspector consistency stable across the routed console
  - keep the wider inspector and support-content placement stable on the cleaned routes
  - keep the deeper trust evidence trail and proof comparison modules stable on the cleaned review routes
  - keep the tighter type and spacing rhythm stable across shared primitives and flattened detail routes
  - keep the compact inspector density stable across mission, trust, proof, and knowledge side rails
  - keep the narrower center reading rail and shared inspector width stable
  - keep route-owned header sequence controls stable and keep source links out of the global header
  - keep the chrome-versus-canvas shell background split stable
  - keep shared main-scroll ownership stable without reintroducing a second inspector scrollbar
  - keep the new thin-scrollbar shell treatment stable across the left rail, main review pane, and other routed scroll surfaces
  - continue removing unnecessary in-center grids from the remaining detail and review routes before adding more comparison modules
  - harden self-hosted UI behavior before broader real-repo pilots
- Do not resume broad feature or graph expansion while this pilot UI batch is active.

## Phases

### Phase 0

1. product docs, package boundaries, config model, and artifact model

### Phase 1

1. root config
2. instruction mirror sync
3. generated bootstrap artifacts
4. minimal CLI

### Phase 2

1. repo scanning and scope inference
2. compact retrieval surfaces
3. planning and decision ask-back

### Phase 3

1. docs governance
2. impact and done workflows
3. trust reports

### Phase 4

1. quality modes for messy projects
2. remediation missions
3. broader adapters and extraction readiness

### Phase 5

1. project workflow extension manifests and registry
2. workflow execution and run evidence
3. plan, impact, and done integration for required workflows

### Phase 6

1. proof phase:
   - harden the ingest-compile-query-lint-trust loop
   - keep current-state versus recommended-state architecture benchmarked on brownfield fixtures
   - keep large-repo subtree-targeting benchmarked on large-workspace fixtures
   - keep tool-native enforcement benchmarked through generated hook adapters, not file-existence checks
   - keep docs freshness and weak canonical docs routing benchmarked on brownfield fixtures with stale tracked docs
   - keep override and canonicalization behavior benchmarked where human-declared truth must outrank inference
   - keep the scorecard contract and committed proof baseline stable while adding richer fixtures and deliberate baseline updates
   - keep index and operational-log compaction stable as more runtime events and fixtures are added
   - keep hot-path latency budgets stable as fixture breadth grows
   - keep release-surface metadata and release-readiness checks stable while packages remain private during incubation
   - keep before-versus-after brownfield comparison lanes honest so stabilization claims are grounded in measurable deltas, not only single-snapshot interpretation
   - expand brownfield-heavy fixtures and benchmark workflows beyond the first passing harness
   - pressure freshness invalidation and broader multi-actor runtime behavior on top of the current compiled knowledge loop
   - score reliability improvements and closure behavior
   - use the resolved proof contract to choose the next hardening slices

### Phase 7

1. pilot-readiness UI productization:
   - a human-friendly project-intelligence console instead of a machine-shaped portal shell
   - full-bleed left rail, inset header and content rail, and sticky contextual right pane
   - a real `ui dev` authoring loop with HMR and watched projection refresh
   - grouped left-rail navigation for `Overview`, `Work`, `Validation`, `Knowledge`, and `Structure`
   - route-family-specific pane layouts for overview, list review, detail review, evidence review, and activity
   - first-class routed surfaces for plans, decisions, and findings
   - explicit `primary`, `supporting`, `diagnostic`, and `raw` information placement rules

### Phase 8

1. workflow router and agent supervision:
   - `skopos start`, `skopos next`, `skopos decide`, and `skopos eval`
   - durable `questions`, `recommendations`, and `evals` artifacts
   - trust and done integration for unresolved questions and required evals
   - adapter and UI surfaces that consume the same router state
2. broader portal views beyond the pilot console baseline, only after the pilot UI proves useful in real repos
3. large-project graph slicing and filtered projections instead of broad repo-wide visual graphs
4. richer graph-backed docs and command modules built on top of the existing graph family
