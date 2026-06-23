# Decision: Supervision-Cost And Workflow-Weight Discipline

## Metadata

- Doc ID: `SKOPOS-DECISION-023`
- Status: `accepted`
- Date: `2026-04-12`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-04-12`
- Related Docs:
  - `../project/overview.md`
  - `../project/vision.md`
  - `../project/positioning.md`
  - `../project/roadmap.md`
  - `../project/implementation-checklist.md`
  - `../project/system-ui-plan.md`
  - `../architecture/artifact-model.md`
  - `018-self-hosting-workflow-contract.md`
  - `020-workflow-router-questions-recommendations-and-eval-contract.md`
  - `021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `022-program-router-sequencing-and-obligation-contract.md`

## Changelog

- `2026-04-12`: Added the supervision-cost and workflow-weight doctrine so new Skopos features, artifacts, commands, and UI surfaces must prove that they reduce user supervision cost more than they increase workflow weight.

## Context

Skopos is correctly growing beyond raw repo indexing. The mission router, discussion-memory lane, and program-router lane all fit the product thesis.

That still leaves one real product risk:

1. every supervision gap can look like a reason to add one more artifact, command, question, route, or planning surface
2. if those additions are not restrained, Skopos can become a ceremony tax instead of a supervision reducer
3. brownfield-first adoption only works if the system stays lighter than the manual coaching it replaces

The product already has some restraint rules:

1. `artifact-only` is the default execution surface
2. workpack docs are exceptions, not the default
3. raw discussion is local continuity state, not the default retrieval surface
4. UI workflow state should stay attention-shaped rather than dashboard-heavy

Those rules now need one explicit product doctrine above them.

## Decision

Adopt one cross-cutting admission rule for new Skopos features:

`Does this reduce user supervision cost without increasing workflow weight more than it saves?`

If the answer is not clearly yes, the feature should not land in its current form.

This discipline applies to:

1. new runtime artifacts
2. new CLI commands
3. new router or control-plane layers
4. new UI routes, panels, or persistent widgets
5. new docs or planning surfaces
6. new default prompt-load or retrieval inputs

## Canonical Rules

### Prefer Existing Layers First

Before adding a new layer, prove that an existing one cannot own the behavior cleanly.

Required order of preference:

1. extend an existing compiled artifact
2. extend an existing command surface
3. extend an existing route or inspector surface
4. add a new bounded artifact or command only if the existing layer would become incoherent

### Default To Low-Noise Shared State

1. prefer one compact compiled artifact over multiple overlapping artifacts
2. prefer one bounded recommendation surface over repeated narrative advice
3. prefer one attention surface over multiple competing dashboards
4. prefer `artifact-only` execution memory over extra workpack docs unless coordination pressure justifies the exception

### Save Broadly, Load Narrowly

1. raw discussion may be saved for recovery and audit
2. raw discussion must not become the default prompt-reload surface
3. checkpoints and handoffs must stay compact
4. default resume context must stay bounded and mission-relevant

### Refresh On Material State Changes

1. do not recompile control-plane state on every turn
2. refresh when execution state changes materially
3. avoid queue thrash, UI churn, and unnecessary token spend

### Keep The UI Attention-Shaped

1. default workflow UI should answer `what needs attention now`
2. mission detail should stay the primary execution surface
3. overview should stay compact
4. trust should explain blockers, not become a second planning canvas
5. do not add a large workflow dashboard by default

### Stay Inside The Declared V1 Lane

Skopos should stay explicit about its current fit:

1. strong fit: agent-heavy brownfield Node and TypeScript repos
2. conditional fit: broader project shapes only when the workflow remains low-friction and the compiled signals stay reliable
3. do not generalize new control-plane surfaces as universal without proof

## Feature Admission Test

Before landing a new feature, answer these explicitly in the related decision, plan, workpack, or implementation notes:

1. What user-supervision task disappears?
2. What existing layer cannot already own this responsibility?
3. What workflow weight does this add on the happy path?
4. What becomes visible by default, and what stays searchable or secondary?
5. What is the hot-path runtime or token cost?
6. What is the lifecycle or removal rule if the surface proves redundant?
7. Does it stay inside the current v1 support lane?
8. Is it deterministic enough to compile into runtime state instead of living only as doc advice or prompt discipline?

If those answers are weak, the feature should be narrowed, folded into an existing layer, or deferred.

## Application To Current Control-Plane Work

### Mission Router

The mission router remains justified because it removes a repeated supervision burden:

1. what happens next
2. whether code is allowed
3. what human choice is still blocking
4. what proof still needs to happen

### Discussion Memory

The discussion-memory lane remains justified only if:

1. raw journals stay local-only
2. checkpoints stay compact
3. handoffs replace transcript replay instead of adding another large prompt surface

### Program Router

The program-router lane remains justified only if:

1. it compiles into one compact shared artifact first
2. it reduces queue-management work for the user
3. it does not reshuffle work noisily on every discussion turn
4. it derives obligations without creating another manual planning ritual

### UI Adoption

Workflow-state UI remains justified only if:

1. it lowers confusion around attention, blockers, and next steps
2. it reuses `overview`, `mission detail`, `trust`, and `search dock`
3. it does not create a second admin dashboard that users must interpret manually

## Consequences

### Positive

1. Skopos gains a durable filter against overbuilding
2. the product stays aligned with its brownfield reliability wedge
3. new layers must justify themselves in terms users actually feel
4. agent-sync features stay more likely to help than to add ceremony

### Costs

1. some plausible ideas will be narrowed or deferred
2. new feature proposals need clearer justification before implementation
3. control-plane work must stay disciplined instead of expanding through convenience alone

## Next Action

Apply this doctrine immediately to:

1. the first `program router` implementation slice
2. the first `discussion memory` implementation slice
3. the next workflow-state UI adoption batch
4. any future request to add a new planning, memory, or recommendation surface
