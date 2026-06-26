# Decision: Program Router, Sequencing, And Obligation Contract

## Metadata

- Doc ID: `SKOPOS-DECISION-022`
- Status: `accepted`
- Date: `2026-04-12`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-06-25`
- Related Docs:
  - `../00-start-here.md`
  - `../project/overview.md`
  - `../project/vision.md`
  - `../project/roadmap.md`
  - `../project/system-ui-plan.md`
  - `../project/implementation-checklist.md`
  - `../project/missing-decisions-checklist.md`
  - `../architecture/artifact-model.md`
  - `../architecture/workflow-extension-model.md`
  - `018-self-hosting-workflow-contract.md`
  - `020-workflow-router-questions-recommendations-and-eval-contract.md`
  - `021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `023-supervision-cost-and-workflow-weight-discipline.md`

## Changelog

- `2026-06-25`: Promoted blocking workflow recommendations into compiled program items, so unresolved blocking questions can become the immediate program `doNow` item with the original command preserved instead of relying on the user to remember question-before-implementation ordering.
- `2026-04-12`: Implemented the first routed UI adoption slice on top of the runtime contract, so the routed console now consumes `.skopos/program/state.json` in `overview`, `mission detail`, `trust`, and the search dock while the next slices stay focused on broader source promotion and richer questions/recommendations visibility.
- `2026-04-12`: Implemented the first low-noise runtime slice, so `.skopos/program/state.json`, `skopos program sync`, and `skopos program next` now exist with active-mission plus active-finding inputs, typed obligations, and compact continue-versus-interrupt guidance while later sources and routed UI adoption remain follow-on work.
- `2026-04-12`: Added the supervision-cost and workflow-weight discipline as a guardrail on the program-router contract, so the higher control-plane layer now stays explicitly justified by reduced supervision rather than defaulting to more queue-management ceremony.
- `2026-04-12`: Added the first-class program-router contract so accepted discussion outcomes, findings, trust blockers, and active work can be sequenced through one compiled control-plane artifact with typed docs and UI obligations instead of depending on user memory or ad hoc chat ordering.

## Context

Skopos now has a real mission router through `skopos start`, `skopos next`, `skopos decide`, and `skopos eval`. That closes the single-batch execution gap, but it does not yet solve the higher-level supervision problem.

Today:

1. accepted new ideas, fixes, and workflow gaps still rely on the user to decide whether they interrupt current work
2. roadmap, checklist, finding, and UI updates still depend too much on manual memory
3. mission routing can execute one active batch well, but it does not own the overall work queue
4. discussion memory will preserve accepted direction, but by itself it will not decide which accepted work should become active now

The missing layer is a compact program-control plane above the mission router.

## Decision

Adopt a first-class program router above the existing mission router.

This layer should:

1. compile accepted work into one sequenced program state
2. decide what should be `do-now`, `do-next`, `defer`, or `interrupt-current`
3. derive typed docs and UI obligations for each accepted work item
4. keep the existing mission router as the lower-level execution lane for one active batch

The program router is not another backlog wiki and not another prompt-only planning ritual. It is a compiled control-plane surface that reduces user supervision.

## Canonical Control-Plane Layers

1. `discussion memory`
   - preserves accepted direction, rejected paths, and handoff continuity
2. `program router`
   - sequences accepted work across the workspace
   - derives obligations
   - recommends whether current work should continue or be interrupted
3. `mission router`
   - routes one active batch through `start`, `next`, `decide`, and `eval`
4. `workflows`, `trust`, and `done`
   - provide execution evidence and closure interpretation

The mission router remains canonical for one active mission. The program router becomes canonical for cross-mission sequencing.

## Artifact Contract

The first implementation slice should use one compact artifact:

1. `.skopos/program/state.json`

Do not split the first slice into separate `backlog`, `sequence`, `doc-obligations`, and `ui-obligations` artifacts. That would create drift too early.

### `program/state.json` Sections

The artifact should include:

1. `items`
2. `sequence`
3. `obligations`
4. `attention`
5. `sourcesDigest`

### Program Items

Each item should include fields such as:

1. `id`
2. `title`
3. `summary`
4. `sourceKind`
5. `sourceRef`
6. `scope`
7. `status`
8. `priority`
9. `whyNow`
10. `dependencies`
11. `interruptsCurrentMission`
12. `recommendedDisposition`
13. `linkedPlanId`
14. `linkedMissionId`
15. `recommendedCommand`
16. `obligationIds`

### Sequence

Sequence should include compact state such as:

1. `currentActiveItemId`
2. `doNow`
3. `doNext`
4. `deferred`
5. `interruptRecommendation`
6. `openProgramQuestions`

### Obligations

Obligations should be typed, not narrative-only.

The first slice should classify them into:

1. `docs`
2. `ui`
3. `runtime`
4. `validation`
5. `workflows`

Each obligation should include:

1. `id`
2. `kind`
3. `title`
4. `reason`
5. `targetRef`
6. `linkedItemId`
7. `status`

## Sources And Promotion Rules

The program router should compile input from:

1. promoted discussion checkpoints
2. active findings
3. blocking workflow recommendations and open workflow question IDs
4. trust and proof blockers
5. explicit roadmap or checklist items
6. current active mission state

Not every discussion checkpoint should become a program item.

Checkpoint promotion should be explicit:

1. `none`
2. `candidate`
3. `required`

Only `candidate` and `required` checkpoints should enter program routing.

## Trigger Contract

The program router should refresh when execution state changes materially, not on every chat turn.

Required triggers:

1. a promoted discussion checkpoint is created or superseded
2. a finding is added or its severity changes
3. trust or proof creates a real blocker
4. a mission completes or becomes blocked
5. the user explicitly changes priority
6. a dependency resolves or becomes blocked

Non-trigger:

1. every normal discussion turn

## Sequencing Rules

The sequencing engine should stay stable and deterministic.

Required ordering rules:

1. explicit user priority outranks heuristic priority
2. closure and correctness blockers outrank feature expansion
3. dependency prerequisites outrank dependent work
4. structural workflow gaps outrank polish
5. a new item should not interrupt the current mission unless it materially outranks it
6. missing docs or UI obligations may raise priority when a runtime change would otherwise become invisible or misleading
7. the router should prefer the smallest sequencing surface that removes supervision burden rather than multiplying planning layers or interruption states

## Command Contract

The first program-router command surface should provide:

1. `skopos program sync`
2. `skopos program next`

`skopos program sync` should rebuild `.skopos/program/state.json` from current promoted inputs.

`skopos program next` should answer:

1. whether the current mission should continue
2. whether new accepted work should interrupt current execution
3. what the next program item is
4. which docs and UI obligations must be handled
5. what command should run next

Later, `skopos start --from-program-item <id>` may bind mission creation directly to a selected program item.

### First Slice Implementation Note

The first runtime slice now exists and intentionally stays narrow:

1. active mission state
2. active findings from the findings registry
3. blocking workflow recommendations from `.skopos/recommendations.json`
4. open blocking question IDs from `.skopos/questions.json`
5. typed obligations derived from the current mission checklist plus the first workflow-state UI targets
6. one compact routing decision for `continue-current`, `interrupt-current`, `start-do-now`, or `idle`

The remaining source expansion is still future work:

1. trust and proof blockers as first-class program items
2. explicit roadmap or checklist items beyond the active mission and findings lane
3. broader routed UI adoption on top of the now-implemented runtime artifact

## Agent Sync Contract

Agents should not infer queue ordering only from chat.

The intended path is:

1. append discussion turns
2. compile checkpoints and handoffs
3. promote accepted checkpoints into program candidates when appropriate
4. run `skopos program sync`
5. run `skopos program next`
6. only then continue or open the next mission through the mission router

Default resume context should load:

1. latest handoff
2. current program summary
3. active mission
4. active workflow questions
5. active workflow recommendations

That keeps the system token-friendly while preserving sequencing context.

## UI Obligation Contract

The program router should derive UI obligations as typed targets, not vague reminders.

The first required UI surfaces are:

1. `overview`
2. `mission detail`
3. `trust`
4. `search dock`

The intended behavior is:

1. `overview` shows current attention, `do-now`, and interrupt guidance
2. `mission detail` shows upstream program context, open obligations, and current recommended next step
3. `trust` explains closure blockers and unresolved program-level pressure
4. `search dock` can jump to program items, questions, recommendations, and later discussion checkpoints

Do not build a giant workflow dashboard as the first UI slice.

## Consequences

### Positive

1. users stop acting as the full-time program manager during long agent sessions
2. accepted discussion outcomes can reorder work through compiled state instead of memory
3. docs and UI updates become explicit obligations instead of afterthoughts
4. the mission router stays smaller and cleaner because cross-mission sequencing moves out of it

### Costs

1. Skopos gains another control-plane artifact that must stay low-noise and deterministic
2. discussion checkpoints need promotion rules instead of staying purely conversational
3. tool adapters need to call the program router before they call the mission router for new accepted work
4. without the supervision-cost discipline, this layer would be easy to overbuild

## Next Action

The first slice is implemented. Future slices should stay source-focused:

1. promote trust and proof blockers as first-class program items only when they block safe closure or implementation
2. promote explicit roadmap/checklist items only when they are accepted enough to sequence
3. keep normal mission checklist steps inside the mission router unless they need cross-mission routing
