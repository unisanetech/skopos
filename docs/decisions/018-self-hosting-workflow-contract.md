# Decision: Self-Hosting Workflow Contract

## Metadata

- Doc ID: `SKOPOS-DECISION-018`
- Status: `accepted`
- Date: `2026-04-11`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-04-12`
- Related Docs:
  - `../00-start-here.md`
  - `../runbooks/local-development.md`
  - `../findings/registry.md`
  - `../architecture/trust-and-closure-model.md`
  - `../architecture/workflow-extension-model.md`
  - `020-workflow-router-questions-recommendations-and-eval-contract.md`
  - `021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `022-program-router-sequencing-and-obligation-contract.md`
  - `007-multi-actor-mission-coordination.md`

## Changelog

- `2026-04-16`: Tightened the self-hosting contract again so generated Claude Code and Codex session-start adapter paths now inject `skopos program next` guidance into compact resume context, and the Claude stop hook now blocks on the router's explicit next command before falling back to generic closure enforcement.
- `2026-04-12`: Updated the self-hosting contract again to clarify the next missing control-plane layer, so the implemented mission router is now explicitly treated as one level under the future program router that should sequence accepted work and derive docs plus UI obligations across the workspace.
- `2026-04-12`: Added execution-surface guidance to the self-hosting router, so Skopos now defaults batches to `artifact-only` and only recommends a temporary workpack doc when coordination signals are broad enough to justify a second human-readable execution surface.
- `2026-04-12`: Updated the self-hosting contract after the discussion-memory decision landed, so the next dogfooding gap is now cross-chat continuity plus adapter and UI adoption rather than the already-completed trust-and-done closure slice.
- `2026-04-12`: Tightened the self-hosting contract after trust-plus-done closure integration landed, so unresolved blocking workflow questions and missing or incomplete mission eval artifacts are now hard closure evidence instead of advisory process notes.
- `2026-04-12`: Tightened the self-hosting contract after the eval-to-closure handoff fix, so successful mission evaluation now clears remaining non-decision checklist drift and the next canonical action becomes `skopos mission complete` instead of ad hoc manual cleanup.
- `2026-04-12`: Updated the self-hosting contract after `skopos eval` landed, so the remaining workflow gap is now stricter closure integration on top of the implemented `start`, `next`, `decide`, and `eval` router layers.
- `2026-04-12`: Updated the self-hosting contract after `skopos next` landed, so the remaining workflow gap is now `eval` plus stricter closure integration rather than the total absence of an ongoing router.

## Context

Skopos is already running against its own subtree and already persists plans, missions, findings, and operational log state under `.skopos/`. But the current self-hosting docs still describe a hybrid execution model where Unisane remains the outer planning router. That wording makes it too easy for real feature work to drift back into chat-only execution after a plan note or decision update.

That drift weakens the main product claim. If Skopos is supposed to improve agent execution through compiled workflow state, then Skopos should build itself through Skopos plan, mission, workflow, and finding artifacts whenever the work is real product or runtime work.

The documentation change alone was not enough. Missionless local source or workflow work could still continue until a different trust symptom happened to expose it secondarily.

Structural drift can also still happen one layer earlier: a plan and mission can exist, but a new durable artifact family or major contract change can still start in code before its decision doc exists.

The next missing layer is now clearer too: even with plan and mission state, Skopos still lacks a first-class post-discussion router that tells the agent what happens next, what must be asked, and what proof or eval is still required.

The first four router slices now exist through `skopos start`, `skopos next`, `skopos decide`, and `skopos eval`, which together turn the discussion goal into claimed mission state, durable decision and recommendation artifacts, a bounded ongoing next-action surface, and a mission-level proof artifact. Trust and `done` now consume unresolved workflow questions plus mission eval artifacts as explicit closure evidence, and `skopos eval` reconciles remaining non-decision checklist drift so the router can hand off cleanly to `skopos mission complete`.

That mission router is now strong enough that the next self-hosting gap is above it: Skopos still needs a program router that can sequence newly accepted work, decide whether current work should be interrupted, and derive docs plus UI obligations across the whole workspace. Discussion continuity across compaction remains the adjacent memory gap that should feed that higher layer.

## Decision

For work inside `skopos/`, Skopos-native workflow artifacts are the primary execution router for Skopos feature, functionality, and structural batches.

Repo-level safety gates and broader workspace rules still apply, but execution state for Skopos work should live in Skopos artifacts rather than outer program notes or chat memory.

## Canonical Self-Hosting Rules

### Feature And Structural Work

Before broad implementation, create a Skopos plan and claim its mission for:

1. feature functionality
2. UI product changes
3. runtime or CLI behavior changes
4. trust, proof, or workflow changes
5. multi-file structural refactors

For new work after discussion, prefer `skopos start "<goal>"` instead of manually running `plan` and then `mission claim`.

Default the execution surface to `artifact-only`. Only escalate to `artifact-plus-workpack-doc` when the router reports broad coordination signals, and keep that escalation advisory rather than turning every batch into a second planning document.

When the work introduces a new durable artifact family or changes retrieval, trust, workflow, or other core contracts, write the decision doc before broad code edits. Mission state alone is not enough for that class of change.

### Narrowing

If the batch recommends `narrow-scope-first`, use `skopos mission slice` instead of decomposing the work only in chat or personal notes.

### Structural Friction

If self-hosting exposes a product or workflow gap:

1. add or update a Skopos finding
2. keep the issue visible in Skopos docs until it is fixed
3. prefer fixing the workflow or trust surface in the same stream when feasible

### Bounded Exceptions

The following may proceed without opening a mission first:

1. small docs-only wording fixes
2. tiny non-structural copy adjustments
3. purely local cleanup that does not change product behavior, trust behavior, or workflow behavior

If the scope grows beyond that, create the plan and claim the mission before continuing.

## Operational Contract

The normal self-hosting flow for real work is:

1. create the plan
2. claim the mission
3. implement the scoped batch
4. run the relevant registered workflows
5. run trust and validation
6. keep findings and docs in sync

### Enforcement

Missionless tracked work should become visible as soon as local source or workflow changes exist.

That means:

1. `skopos trust` should warn when tracked local work has no active claimed mission
2. `skopos done` should inherit that warning through workspace trust instead of silently treating missionless work as closure-complete
3. generated mission, plan, and workflow artifacts on their own do not satisfy the rule; the mission must be active and claimed
4. the remaining workflow increment should now focus on adapter enforcement and routed UI guidance instead of leaving those steps in chat memory
5. generated adapter entry paths should inject the current program-router recommendation at session start and should consult the router again before stop/closure enforcement when the next workflow step is explicit

## Consequences

### Positive

1. Skopos dogfooding produces durable execution memory instead of disappearing into chat
2. workflow and product friction becomes visible in Skopos itself
3. plans, missions, and findings become real proof of the product model instead of optional ceremony

### Costs

1. small feature work has more execution discipline
2. self-hosting contributors need to respect plan and mission state before broad edits
3. trust and docs surfaces must stay current so the workflow remains credible

## Next Action

Use this contract immediately for the next Skopos feature batch:

1. correct any stale self-hosting docs that still describe hybrid planning
2. create and claim the next Skopos mission before implementing the search dock
3. keep the active-mission trust rule green while implementing the search dock batch
4. route newly discovered workflow gaps into the Skopos findings registry
5. for the compiled reference layer and later agent-memory artifacts, write the decision doc before expanding code changes
6. add the program router so accepted work can reorder itself through compiled state instead of manual sequence management
7. make tool adapters and routed UI surfaces consume the implemented mission and future program routers so the contract becomes the normal operating path instead of another advanced feature
8. add the discussion-memory lane so long-running self-hosted work does not fall back to raw chat memory between context boundaries
