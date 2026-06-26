# Skopos Findings Registry

Track active Skopos structural findings here.

## Metadata

- Doc ID: `SKOPOS-FINDINGS-REGISTRY`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/findings`
- Canonical: `yes`
- Last Updated: `2026-06-26`
- Review Cycle: `per workpack`
- Related Docs:
  - `README.md`
  - `../architecture/00-architecture.md`

## Changelog

- `2026-06-26`: Closed the token-control and agent-transport gap after shared compact CLI JSON projections began reporting direct response budget telemetry, compact human output began warning only when a response exceeds the compact budget, and compact eval output stopped replaying full mission checklist objects.
- `2026-06-26`: Closed the initial synthesized repo-understanding gap after `skopos understand` began writing compact repo-summary, feature-inventory, and implementation-hotspot artifacts, indexing them, and surfacing them on the overview UI.
- `2026-06-26`: Closed the stale advisory-decision eval reconciliation gap after the existing runtime fix and regression coverage were confirmed current, removing the last active self-healing finding from the program queue.
- `2026-06-25`: Closed the program-router and obligation gap after blocking workflow recommendations began promoting into compiled program state as actionable items with preserved commands, linked mission context, and explicit question IDs.
- `2026-06-25`: Closed the discussion-memory compaction gap after unsupported coding agents gained a generated manual fallback adapter and checkpoint promotion stopped treating actor/path-only command changes as meaningful new discussion state.
- `2026-06-25`: Closed the self-hosting workflow-router drift finding after unsupported coding agents gained a generated manual fallback adapter guide and `.skopos/enforcement.json` began recording that path explicitly as `manual-fallback` / `manual-only`.
- `2026-06-25`: Closed the CLI entrypoint command-ownership drift finding after package-boundary regression coverage began enforcing the thin `cli.ts`, `cli/index.ts`, and `cli/registry.ts` ownership contract.
- `2026-06-25`: Closed the UI dev watcher generated-churn finding after repeated generated app and tooling churn regression coverage proved ignored output stays quiet while route-owned docs changes still refresh.
- `2026-04-17`: Added the initial synthesized repo-understanding gap after the first messy external brownfield pilot showed that Skopos can onboard structurally but still leaves users without one compact explanation of repo purpose, major feature areas, and likely implementation hotspots.
- `2026-04-16`: Grouped the remaining active findings under the bounded self-healing loop, so current Skopos work now runs through three product-hardening tracks: onboarding and trust correctness, validation and transport proportionality, and program/docs-state hygiene.
- `2026-04-14`: Closed the package-pilot closure-coverage gap after trust and done began treating tracked edits as covered by a claimed mission once that mission and its eval both completed and no newer tracked edits had landed.
- `2026-04-14`: Hardened the already-closed nested-package pilot onboarding gap after the `unisane-ui` workspace pilot showed that bootstrap refresh could still forget a configured inherited docs root once a local `docs/` folder appeared. Refresh now keeps the configured parent-relative docs root and trust verifies docs existence by resolved workspace path.
- `2026-04-13`: Closed the package-pilot proof-policy gap after eval began honoring missing proof only when the workspace both requests proof and exposes a real proof workflow lane.
- `2026-04-13`: Closed the nested-package pilot validation command-surface gap after package pilots began storing runnable `pnpm <script>` validation commands instead of raw script bodies, stale temporary pilot configs began refreshing those legacy command values on rerun, and the shell runner began resolving ancestor workspace bin paths for older mission artifacts.
- `2026-04-13`: Closed the nested-package pilot onboarding gap after Skopos began inheriting parent docs, instructions, and workspace signals for nested package pilots, refreshing stale bootstrap-managed config on rerun, and accepting repo-specific inherited docs routers like `docs/core/ssot/00-start-here.md`.
- `2026-04-13`: Finalized the nested-package pilot onboarding gap after bootstrap questions, diagnosis, and compact context stopped requiring a literal root-relative `AGENTS.md`, so inherited parent instruction paths now clear the last false bootstrap ambiguity in nested-package pilots.
- `2026-04-13`: Narrowed the nested-package pilot onboarding gap again after `skopos init` began refreshing stale bootstrap-managed nested-package config on rerun. The remaining open work is now repo-specific docs-router inheritance rather than stale temporary pilot config reuse.
- `2026-04-13`: Narrowed the nested-package pilot onboarding gap after first-time nested package init began inheriting parent workspace docs, instruction, and workspace-config surfaces correctly. The remaining open work is stale temporary pilot config reuse plus better docs-router inheritance for monorepos that do not use `docs/00-start-here.md` at the repo root.
- `2026-04-13`: Added the nested-package pilot onboarding gap after the first temporary pilot on `unisane/packages/modules/identity` showed that `skopos init` still treats nested package targets too much like standalone repos, undercounting the target package and failing to inherit parent docs and instruction surfaces in a monorepo.
- `2026-04-13`: Narrowed the discussion-memory compaction gap again after the first routed-console discussion slice landed, so the latest handoff now appears in `overview`, `mission detail`, and search while the remaining open work is richer checkpoint exposure and later route promotion only if needed.
- `2026-04-13`: Narrowed the discussion-memory compaction gap after the discussion-context and sidebar information-architecture decision landed, so the remaining open work now focuses on routed-console adoption of handoffs and checkpoints rather than the absence of a UI contract.
- `2026-04-12`: Added the token-control and agent-transport gap finding after the self-hosted workflow review showed that the runtime still leaks too much full JSON, repeated closure state, and broad docs into the agent path, breaking the compact-first retrieval doctrine at the transport layer.
- `2026-04-12`: Closed the done generated-output closure-noise finding after normal self-hosted mission completion exercised the repaired git-status filtering without false failures from refreshed `.skopos/**`, `docs/generated/**`, or instruction-mirror outputs.
- `2026-04-12`: Closed the self-hosted closure e2e timeout finding after the CLI e2e suite timeout budget was raised to match the actual self-hosted generated-state cost, restoring a passing full `pnpm test` lane and unblocking older mission reconciliation.
- `2026-04-12`: Added the self-hosted closure e2e timeout finding after the older runtime eval mission replay exposed that one generated-output closure test now exceeds the CLI suite's default 30 second timeout, blocking mission reconciliation even though the closure behavior itself still passes.
- `2026-04-12`: Closed the proof-phase default-test-lane contention finding after the CLI default `test` lane stopped running the heavyweight proof-phase harness, leaving proof on its dedicated `pnpm proof` lane and unblocking self-hosted mission eval from that suite-only contention.
- `2026-04-12`: Added the proof-phase default-test-lane contention finding after the stale-advisory mission replay showed that `pnpm test` still bundles the heavyweight proof-phase scorecard into the default CLI lane, so the scorecard can fail under broader suite load even though `pnpm proof` passes in isolation and `skopos eval` inherits that noise by replaying the same command surface.
- `2026-04-12`: Narrowed the stale advisory-decision eval-reconciliation finding after the first runtime fix and regression coverage landed, so the remaining work is now broader stale-mission hygiene rather than the raw `eval`/`done` closure failure itself.
- `2026-04-12`: Added the stale advisory-decision eval-reconciliation finding after closing an older mission exposed that `skopos eval` could keep a non-blocking `decision-*` item pending after the global workflow-question artifact had already rotated to a different mission, which then blocked `skopos done` on otherwise valid closure.
- `2026-04-12`: Narrowed the program-router finding after the first low-noise control-plane slice landed, so the remaining gap is now broader source promotion and routed UI adoption rather than the total absence of `.skopos/program/state.json` and the first public program-router commands.
- `2026-04-12`: Updated the program-router finding after the product-fit review clarified the main implementation risk, so the open control-plane gap now explicitly includes a low-ceremony guardrail instead of treating more routing surface as automatically better.
- `2026-04-12`: Added the program-router and obligation-gap finding after the deeper workflow review showed that mission routing is now strong, but cross-mission sequencing, interruption, and docs/UI follow-through still depend too much on user memory.
- `2026-04-12`: Added the discussion-memory compaction-gap finding after the workflow-router review showed that post-discussion execution is now much stronger, but accepted direction still disappears too easily across chat compaction and new-thread continuation.
- `2026-04-12`: Narrowed the self-hosting workflow-router drift finding again after trust-and-done closure integration landed, so the remaining open gap is now adapter plus UI adoption instead of missing closure enforcement for workflow questions and mission eval state.
- `2026-04-12`: Narrowed the self-hosting workflow-router drift finding again after the eval-to-closure handoff fix, so successful mission evaluation now clears remaining non-decision checklist drift and the remaining open gap stays trust-and-done enforcement for unresolved questions plus required eval outputs.
- `2026-04-12`: Added the CLI entrypoint command-ownership drift finding after `packages/cli/src/cli.ts` grew into a 2k+ line command bucket, then narrowed it immediately to ongoing stabilization after the first decomposition batch moved the CLI to a thin entrypoint plus command-owned modules.
- `2026-04-12`: Narrowed the self-hosting workflow-router drift finding again after `skopos eval` landed, so the remaining open gap is now trust-and-done integration for unresolved questions and required eval outputs rather than the absence of a mission-level eval lane.
- `2026-04-12`: Narrowed the self-hosting workflow-router drift finding again after `skopos next` landed, so the remaining open gap is now `eval` plus final trust-and-done integration rather than the absence of an ongoing router.
- `2026-04-11`: Narrowed the self-hosting workflow-router drift finding again after `skopos decide` landed, so durable decision recording is now implemented and the remaining open gap is the ongoing router, eval lane, and closure integration.
- `2026-04-11`: Expanded the self-hosting workflow-router drift finding again after the stronger review of Unisane and Skopos workflow contracts showed the deeper missing layer: Skopos still lacks a first-class post-discussion router, durable question and recommendation artifacts, and an eval lane, so too much execution discipline still lives in prompts instead of runtime state.
- `2026-04-11`: Expanded the self-hosting workflow-router drift finding after the compiled-reference-layer batch exposed the remaining docs-first enforcement gap: plan and mission state existed, but the structural decision doc still lagged behind the first code edits.
- `2026-04-11`: Added the done generated-output closure-noise finding after `skopos done` in git-status mode blocked a real self-hosted mission because regenerated `.skopos/**`, `docs/generated/**`, and instruction-mirror outputs were still being treated as primary changed surfaces while `instructions.sync-mirrors` also overmatched generic docs edits.
- `2026-04-11`: Added the UI dev watcher generated-churn finding after `skopos ui dev` crashed with a long-running macOS watcher OOM while still watching generated app output and non-route-owned tooling churn inside the same trees as live authoring inputs.
- `2026-04-11`: Updated the self-hosting workflow-router drift finding after trust and closure began warning on tracked local work without an active claimed mission, leaving the finding open only for broader authoring-time ergonomics.
- `2026-04-11`: Added the self-hosting workflow-router drift finding after Skopos feature work continued without a fresh Skopos mission while the current self-hosting docs still described hybrid governance and the trust surface was simultaneously warning about instruction-mirror drift.
- `2026-04-10`: Closed the proof-comparison transience finding after the proof harness began writing `.skopos/proof/latest-report.json` with the latest scorecard and committed baseline comparison.
- `2026-04-10`: Closed the linked-slice state-drift finding after parent batch missions began syncing child slice claim, release, and completion state during runtime updates.
- `2026-04-10`: Closed the batch-execution decomposition finding after `skopos mission slice` landed with linked parent-child plan and mission artifacts, parent-decision resolution, portal visibility, and proof coverage.
- `2026-04-10`: Added the first active self-hosting finding to track the batch-execution decomposition gap discovered while creating a real proof-phase batch mission inside the Skopos subtree.
- `2026-04-09`: Added the initial findings registry with no active findings recorded yet.

## Active Findings

### Current Hardening Tracks

1. Track A: onboarding, scope, and trust correctness
   - No active findings currently routed in this track.
2. Track B: validation and transport proportionality
   - No active findings currently routed in this track.
3. Track C: program and docs-state hygiene
   - No active findings currently routed in this track.
