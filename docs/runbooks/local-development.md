# Local Development

Use this runbook for the local contributor flow while Skopos is incubating.

## Metadata

- Doc ID: `SKOPOS-RUNBOOK-LOCAL-DEVELOPMENT`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/runbooks`
- Canonical: `yes`
- Last Updated: `2026-04-12`
- Review Cycle: `per workpack`
- Related Docs:
  - `../00-start-here.md`
  - `../how-to/bootstrap-the-project.md`

## Changelog

- `2026-04-12`: Updated the runbook after docs-only validation-lane narrowing landed, so explicit documentation-only plan goals now avoid broad runtime validation and changed-path-aware impact reports also treat docs, instruction, and generated-only surfaces as workflow-first instead of defaulting to the full runtime command lane.
- `2026-04-12`: Updated the runbook after the first smallest-sufficient validation-lane slice landed, so package-scoped plans can now narrow `recommendedChecks` to package-local `pnpm --filter <package> <script>` lanes when compatible scripts exist while workspace-wide fallback remains the safe path for packages without local script coverage.
- `2026-04-12`: Updated the runbook after separating the proof-phase scorecard from the default CLI test lane, so `pnpm test` stays the normal regression surface while `pnpm proof` remains the heavyweight reliability lane and mission eval no longer inherits suite-only proof contention through the default test command.
- `2026-04-12`: Updated the runbook after the first program-router slice landed, so local contributors now have `skopos program sync` and `skopos program next` as real control-plane commands while discussion-memory inputs and routed UI adoption remain the next gap.
- `2026-04-12`: Updated the runbook after execution-surface guidance landed, so the workflow router now tells contributors when the default `artifact-only` path is sufficient and when a temporary workpack doc is worth the extra coordination cost.
- `2026-04-12`: Updated the runbook after the discussion-memory contract landed, so the next self-hosting gap is now compact checkpoint and handoff continuity across chat compaction plus adapter and UI adoption, not trust-and-done closure enforcement.
- `2026-04-12`: Updated the runbook after `skopos eval` landed, so the canonical self-hosted execution loop now includes mission-level evaluation artifacts and leaves stricter trust-plus-done integration as the remaining workflow-router gap.
- `2026-04-12`: Updated the runbook after `skopos next` landed, so the canonical self-hosted execution loop now uses `start`, `next`, and `decide` as real commands and leaves `eval` plus closure integration as the remaining workflow-router gap.
- `2026-04-11`: Updated the runbook after `skopos decide` landed, so blocking workflow questions are now resolved through one durable command and the remaining router gap is the ongoing `next` plus `eval` control plane rather than the entire post-start loop.
- `2026-04-11`: Updated the runbook after the first workflow-router slice landed, so `skopos start` is now the canonical post-discussion entrypoint for new work while `skopos next`, `skopos decide`, and `skopos eval` remain the next workflow increments.
- `2026-04-11`: Added the planned workflow-router increment to the runbook, so the current self-hosted plan-plus-mission flow is clearly marked as the present contract while `skopos start`, `skopos next`, `skopos decide`, and `skopos eval` are defined as the next automation layer after discussion.
- `2026-04-11`: Hardened the `skopos ui dev` watcher scope after a self-hosted macOS watcher OOM, so generated app output under `docs/generated/skopos/app/**` and non-route-owned `.skopos/tooling/**` churn are no longer treated as live routed-console inputs.
- `2026-04-11`: Updated the runbook again to record the active-mission trust rule, so local source or workflow work without a claimed mission now surfaces immediately in `skopos trust` and `skopos done`.
- `2026-04-11`: Updated the runbook to make Skopos-native plan-plus-mission execution the canonical self-hosting path for feature and structural work, replacing the older hybrid-governance wording and routing the remaining execution gap into an active finding.
- `2026-04-11`: Hardened the `skopos ui dev` docs-refresh path so watched docs changes now invalidate the active routed view instead of only updating background console state.
- `2026-04-10`: Updated the runbook to reflect the improved `skopos ui dev` loop, where watched docs and `.skopos/**` changes now push live console-state refresh into the running app instead of depending on a full page reload.
- `2026-04-10`: Updated the runbook to reflect the implemented `skopos ui dev` loop, making it the default contributor browser workflow with watched routed-console refresh while keeping `skopos ui serve` as the preview lane.
- `2026-04-10`: Updated the runbook to distinguish preview versus authoring for the routed console, making `skopos ui dev` the planned default contributor loop once implemented and leaving `skopos ui serve` as the current preview lane.
- `2026-04-10`: Updated the runbook to add `pnpm skopos:ui:serve` as the canonical local browser loop for the routed console, so contributors get a real localhost URL instead of only static build output.
- `2026-04-10`: Updated the runbook to add the routed-app build lane, so local UI work now uses `pnpm skopos:ui:app` as the primary pilot console output while `pnpm skopos:ui` remains the snapshot fallback.
- `2026-04-10`: Updated the runbook to make `skopos mission slice` the canonical way to narrow a self-hosted proof batch after `narrow-scope-first` is recommended.
- `2026-04-10`: Updated the runbook to require plan-plus-mission execution for proof-phase batches and to route self-hosting structural friction into the findings registry.
- `2026-04-09`: Updated the local-development runbook to include the subtree self-hosting root pack, hybrid governance mode, and canonical dogfooding command lanes.
- `2026-04-09`: Added the first local-development runbook so Skopos contributors have one stable operational starting point.

## Rules

1. use Skopos-native plan, mission, workflow, trust, and finding artifacts as the primary execution router for work inside `skopos/`
2. keep product docs and package boundaries updated before major package mutations
3. treat generated artifacts and instruction mirrors as governed surfaces
4. run Skopos commands from `skopos/` when dogfooding Skopos on itself

## Self-Hosting Governance

1. `skopos start` is now the primary post-discussion entrypoint for Skopos feature, functionality, and structural work.
2. Repo-level safety gates still apply, but they do not replace Skopos execution state for work inside the Skopos subtree.
3. Dogfooding friction discovered in the subtree should feed back into Skopos findings and durable docs.
4. `skopos plan` and direct `mission` commands remain lower-level workflow surfaces behind that router.
5. `skopos next` is now the canonical ongoing-work router, `skopos eval` is now the mission-level proof lane, and `skopos program sync` plus `skopos program next` now provide the first program-level sequencing lane above the mission router.

## Canonical Local Flow

1. `cd skopos`
2. `pnpm skopos:init`
3. `pnpm instructions:sync`
4. `pnpm skopos:trust`
5. `pnpm skopos:ui:serve`
6. `pnpm typecheck`
7. `pnpm test`
8. `pnpm proof`

Validation split:

1. `pnpm test`
2. use this for the normal CLI/UI/package regression lane
3. it should not carry the heavyweight proof-phase scorecard

Proof lane:

1. `pnpm proof`
2. use this for the dedicated proof-phase scorecard and reliability snapshot

Current preview lane:

1. `pnpm skopos:ui:serve`
2. use it for preview and smoke checks of the built app bundle

Authoring lane:

1. `pnpm skopos:ui:dev`
2. this is now the default browser loop for routed-console work
3. it supports:
   - UI HMR
   - live console-state refresh for watched docs changes
   - active route refresh for the currently open docs/detail view when watched docs change
   - live console-state refresh for watched plans, decisions, findings, and `.skopos/**` route-state changes
   - generated app output under `docs/generated/skopos/app/**` and non-route-owned `.skopos/tooling/**` are excluded from that watch surface
   - built-preview smoke checks should still use `pnpm skopos:ui:serve`

Static build lane:

1. `pnpm skopos:ui:app`

Fallback snapshot lane:

1. `pnpm skopos:ui`

## Self-Hosted Feature Flow

1. Start the work from the discussion goal:
   - `node --import tsx packages/cli/src/cli.ts start "<goal>" . --actor <id> --json`
2. If `codeAllowed=false`, resolve the returned blocking question through:
   - `node --import tsx packages/cli/src/cli.ts decide <question-id> <option-id> . --actor <id> --json`
3. During ongoing work, refresh the bounded next step through:
   - `node --import tsx packages/cli/src/cli.ts next . --actor <id> --json`
4. Read the returned `executionSurface` guidance before expanding the batch:
   - stay `artifact-only` by default
   - add a temporary workpack doc only when the router reports `artifact-plus-workpack-doc`
5. If `skopos next` reports `codeAllowed=false` for non-question reasons, resolve the returned blocking recommendation before broad edits.
6. If the generated mission proves too broad and recommends `narrow-scope-first`, create a linked child slice instead of widening implementation directly:
   - `node --import tsx packages/cli/src/cli.ts mission slice <mission-id> "<slice-goal>" . --scope <scope-id> --actor <id> --claim --json`
7. `skopos trust` now warns when tracked local source or workflow work exists without an active claimed mission, and `skopos done` carries that warning forward into closure.
8. If self-hosting exposes structural friction, record it in `docs/findings/registry.md` and a linked finding detail doc instead of leaving it in ad hoc execution notes.
9. When accepted work changes the broader queue rather than only the current mission, refresh program state through:
   - `node --import tsx packages/cli/src/cli.ts program sync . --actor <id> --json`
10. Use the current program disposition before opening or interrupting work:

- `node --import tsx packages/cli/src/cli.ts program next . --actor <id> --json`

11. Package-scoped plans now try to narrow validation first:

- if the scoped package exposes compatible local scripts, `recommendedChecks` will prefer `pnpm --filter <package> <script>` over the broader workspace lane
- if the scoped package does not expose that script surface, Skopos keeps the broader workspace command instead of guessing

12. Explicit docs-only work now uses a workflow-first validation lane:

- docs-only plan goals suppress broad runtime validation commands
- changed-path-aware `skopos impact` also suppresses runtime validation when the surface is docs, instruction, or generated-only
- broader runtime checks still return as soon as code-like surfaces appear

## Remaining Workflow Increment

The first program-router slice now exists on top of `skopos start`, `skopos next`, `skopos decide`, and `skopos eval`, and closure is now wired through `trust` plus `done`. The remaining local-flow gap is discussion continuity across compaction plus stronger adapter and UI adoption of the implemented mission-router and program-router state.

The current intended execution spine is now:

1. `skopos start "<goal>"` after the discussion
2. `skopos next` during ongoing work
3. `skopos decide <question-id> <option-id>` when a real human choice is needed
4. `skopos eval` before final closure
5. `skopos program sync` and `skopos program next` when broader reprioritization or obligation review is needed
6. `skopos trust` and `skopos done` after proof and decision blockers are resolved
7. future `skopos discuss` checkpoint and handoff hooks before compaction or thread switching

Until the discussion-memory lane lands, keep recent decisions promoted into Skopos artifacts instead of relying on raw chat history for long-running continuation.

## Self-Hosting Root Surfaces

1. `package.json`
2. `pnpm-workspace.yaml`
3. `skopos.config.yaml`
4. `AGENTS.md`
5. `tools/skopos/workflows/*.yaml`
