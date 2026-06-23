# Decision: Workflow Router, Questions, Recommendations, And Eval Contract

## Metadata

- Doc ID: `SKOPOS-DECISION-020`
- Status: `accepted`
- Date: `2026-04-11`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-04-12`
- Related Docs:
  - `../00-start-here.md`
  - `../runbooks/local-development.md`
  - `../project/overview.md`
  - `../project/vision.md`
  - `../architecture/artifact-model.md`
  - `../architecture/decision-escalation-model.md`
  - `../architecture/trust-and-closure-model.md`
  - `../architecture/workflow-extension-model.md`
  - `018-self-hosting-workflow-contract.md`
  - `019-compiled-reference-layer-and-agent-memory-baseline.md`
  - `021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `022-program-router-sequencing-and-obligation-contract.md`

## Changelog

- `2026-04-12`: Tightened eval reconciliation again so stale advisory `decision-*` checklist items now close when their linked workflow question is absent or already resolved for that mission, preventing `skopos done` from failing on old completed missions because a newer mission rotated the global question artifact.
- `2026-04-12`: Clarified the mission-router boundary under the new program-router contract, so `start`, `next`, `decide`, and `eval` now stay explicitly mission-scoped while cross-mission sequencing, interruption, and obligation routing move into a separate program-control lane.
- `2026-04-12`: Added execution-surface guidance to `.skopos/recommendations.json`, so `start`, `next`, `decide`, and `eval` now report whether a batch should stay `artifact-only` or escalate to `artifact-plus-workpack-doc` without creating another blocking question or duplicate planning system by default.
- `2026-04-12`: Linked the router contract to the new discussion-memory contract, so post-discussion execution and cross-chat continuity are now treated as adjacent but separate runtime layers instead of one overloaded prompt-discipline problem.
- `2026-04-12`: Implemented the trust-and-done closure slice, so unresolved blocking workflow questions now fail `skopos done`, missing or incomplete mission eval artifacts are explicit closure failures, and trust emits direct mission-eval pressure for closure-ready work while `skopos eval` suppresses that self-referential warning during evaluation.
- `2026-04-12`: Tightened the fourth workflow-router slice so `skopos eval` now reconciles remaining non-decision mission checklist drift from successful proof plus workflow evidence and refreshes `skopos next` toward an explicit `complete-mission` recommendation when evaluation is otherwise done.
- `2026-04-12`: Implemented the fourth workflow-router slice through `skopos eval`, which now runs mission-scoped validation commands, summarizes workflow and proof evidence into durable `.skopos/evals/*.json` artifacts, updates mission validation and workflow checklist state, and refreshes recommendations from the evaluated mission.
- `2026-04-12`: Implemented the third workflow-router slice through `skopos next`, which now resolves the active mission, refreshes `.skopos/recommendations.json` from current mission plus question state, returns the bounded next action, and reports whether code is still blocked.
- `2026-04-11`: Implemented the second workflow-router slice through `skopos decide`, which now records durable question answers with actor attribution, updates the linked mission checklist, refreshes `.skopos/questions.json` plus `.skopos/recommendations.json`, and emits real `skopos decide ...` recommendation commands from `skopos start`.
- `2026-04-11`: Implemented the first workflow-router slice through `skopos start`, which now creates the initial plan and mission state, auto-claims the mission when an actor is provided, writes durable `.skopos/questions.json` and `.skopos/recommendations.json` artifacts, and returns `codeAllowed` plus the current recommended next action.

## Context

Skopos already has real workflow pieces:

1. `plan`
2. `mission`
3. `impact`
4. `workflows run`
5. `trust`
6. `done`

That makes the product usable, but it still does not provide the low-effort execution experience the product vision requires.

The main missing layer is not another prompt rule. The missing layer is one runtime-owned router after the user and the agent finish discussing the work.

Today:

1. planning and ask-back mostly live inside `init` and `plan`
2. there is no single `what happens next` command
3. unresolved human choices are not persisted as one durable workflow surface
4. bounded next-step recommendations are not compiled into one stable artifact
5. eval is still more implied than operational
6. tool adapters still depend too much on prompt discipline instead of runtime routing

That is why users still have to coach the workflow more than the product should require.

The workflow router is also deliberately mission-scoped. It should control one active batch well, not silently become the whole program queue manager. Cross-mission sequencing, interruption, and obligation routing now belong to the separate program-router layer.

## Decision

Adopt a first-class workflow-router layer as the canonical post-discussion execution contract for Skopos.

This layer should sit above the existing planning, mission, workflow, trust, and closure commands and should tell humans and agents:

1. what the next step is
2. whether code is allowed yet
3. what decision still needs a human answer
4. which option is recommended
5. what proof or eval will later be required

The router is the missing control plane. Existing commands remain the underlying execution and evidence surfaces.

This control plane is mission-level, not program-level. It should remain the lower execution router even after the broader program-router layer lands.

## Canonical Command Spine

### `skopos start`

`skopos start "<goal>" [target] [--scope <id>] [--actor <id>] [--json]`

This is the canonical entrypoint after a new discussion about real work.

Responsibilities:

1. resolve scope
2. classify work type and risk
3. determine whether a plan, mission, decision doc, or finding update is required
4. create or refresh runtime workflow state when needed
5. emit the first question and recommendation surfaces
6. state whether implementation is allowed yet

`skopos plan` remains a lower-level planning surface. `skopos start` becomes the default discussion-to-execution router.

Current implemented slice:

1. `skopos start` exists
2. it writes `.skopos/questions.json`
3. it writes `.skopos/recommendations.json`
4. it returns `codeAllowed`
5. it auto-claims the generated mission when an actor is provided

### `skopos next`

`skopos next [target] [--mission <id>] [--actor <id>] [--json]`

This is the canonical ongoing-work router.

Responsibilities:

1. inspect current mission, trust, workflow evidence, and unresolved questions
2. return the next bounded action
3. stop the agent from improvising when a blocking choice or missing proof exists
4. keep the user and the agent synchronized without re-reading broad docs

Current implemented slice:

1. `skopos next` exists
2. it resolves the active mission from explicit input or current workflow-router state
3. it refreshes `.skopos/recommendations.json` for the current mission
4. it returns `blockingQuestions`, `recommendedAction`, `nextItem`, and `pendingItems`
5. it reports the current trust summary alongside the bounded next action

### `skopos decide`

`skopos decide <question-id> <option-id> [target] [--actor <id>] [--json]`

This persists a human-approved or agent-forwarded decision into durable workflow state.

Responsibilities:

1. record the chosen option
2. capture actor attribution and timestamp
3. clear or downgrade the linked blocker
4. refresh the next-step recommendation
5. sync the linked mission decision items so execution state and decision state stay aligned

### `skopos eval`

`skopos eval [target] [--mission <id>] [--actor <id>] [--json]`

This is the canonical execution-quality and proof lane that sits between implementation and `done`.

Responsibilities:

1. run or summarize required eval and proof surfaces for the current work
2. record machine-readable evaluation outputs
3. explain whether the work is truly ready for trust and closure

`skopos eval` is not the same thing as `trust`. Eval proves task-quality and behavioral correctness. Trust remains the final closure interpretation layer.

Current implemented slice:

1. `skopos eval` exists as a public command
2. it writes `.skopos/evals/<mission-id>.json`
3. it runs the mission `recommendedChecks` surface
4. it summarizes current workflow evidence and proof state
5. it updates mission validation, workflow, and non-decision implementation checklist items from that evidence
6. it refreshes `.skopos/recommendations.json` after evaluation
7. it hands the mission back to `skopos next` with a `complete-mission` recommendation when no non-decision work remains

Current remaining slice:

1. adapter adoption so coding agents call `start`, `next`, `decide`, and `eval` automatically instead of relying on prompt discipline
2. first-class UI surfaces for workflow questions and recommendations instead of leaving them visible only through CLI/runtime artifacts
3. companion discussion-memory adoption through checkpoints and handoffs so accepted direction survives compaction and new-thread continuation

## Artifact Contract

Add three new workflow artifact families under `.skopos/`:

1. `.skopos/questions.json`
2. `.skopos/recommendations.json`
3. `.skopos/evals/*.json`

### Questions

Questions are durable unresolved-decision surfaces, not transient chat text.

Each question should include compact fields such as:

1. `id`
2. `title`
3. `question`
4. `category`
5. `escalation`
6. `blocking`
7. `recommendedOptionId`
8. `options`
9. `whyItMatters`
10. `whatHappensAfterAnswer`
11. `linkedPlanId`
12. `linkedMissionId`
13. `evidenceRefs`
14. `status`

### Recommendations

Recommendations are bounded next-action suggestions grounded in compiled evidence, not open-ended assistant chatter.

Each recommendation should include compact fields such as:

1. `id`
2. `title`
3. `summary`
4. `priority`
5. `reason`
6. `actionKind`
7. `command`
8. `linkedQuestionId`
9. `linkedPlanId`
10. `linkedMissionId`
11. `blocking`
12. `status`

The recommendation artifact itself should also carry an `executionSurface` summary with:

1. `kind`
2. `summary`
3. `reason`
4. `signals`

`executionSurface.kind` should default to `artifact-only`. Escalate to `artifact-plus-workpack-doc` only when the batch shows broad coordination signals such as workspace scope, multiple decision gates, multi-slice coordination, or a long workflow and validation surface. This guidance is recommendation-only; it must not create a second planning system or another blocking question by default.

### Evals

Eval artifacts are runtime-managed proof outputs tied to specific work.

Each eval should include fields such as:

1. `id`
2. `missionId`
3. `planId`
4. `evaluationStatus`
5. `summary`
6. `codeAllowed`
7. `blockingQuestionIds`
8. `checkRuns`
9. `workflowEvidence`
10. `proof`
11. `trust`
12. `pendingItemIds`
13. `actorId`

## Ask-Back Contract

The user-facing rule is not "always ask a question."

The canonical rule is:

1. always produce a recommended next action
2. ask with options only when the runtime question surface says the decision is unresolved
3. recommend one option first
4. keep the options bounded and concrete

Agents should not ask vague open-ended process questions when the next step is already deterministic.

### Required Ask-Back Format

When a question is unresolved and needs the user:

1. explain why the decision matters
2. show one recommended option first
3. show 2 to 4 concrete options
4. explain the consequence of each option compactly
5. state what the agent will do after the answer

This applies to both terminal agents and the routed UI.

## Agent And Tool Contract

Tool adapters should stop relying on prompt discipline alone.

Before broad edits:

1. call `skopos start` for new work
2. call `skopos next` for ongoing work
3. if `codeAllowed=false`, do not continue into implementation
4. surface the blocking question or recommendation instead

This means the workflow becomes product behavior instead of chat etiquette.

## Relationship To Existing Commands

The router layer does not replace the rest of Skopos. It composes them.

1. `start` and `next` route the work
2. `plan` and `mission` persist execution state
3. `impact` determines changed-surface and workflow requirements
4. `workflows run` produces registered proof and maintenance evidence
5. `eval` records task-quality evidence
6. `trust` interprets readiness and closure
7. `done` closes only when blocking decisions and proof gaps are resolved

## Trust And Closure Contract

The workflow router must tighten closure, not only improve agent ergonomics.

Rules:

1. unresolved `must-ask` questions should block `done`
2. unresolved `recommend-and-ask` questions should at least warn and stay visible
3. missing required eval outputs should block `done`
4. recommendations alone must not count as proof
5. trust should explain whether the blocker is missing decision, missing workflow evidence, or missing eval

## UI Contract

These surfaces should be visible in the routed app, but not as raw dumps.

Recommended placement:

1. mission detail:
   - next recommended action
   - open questions
   - required evals
2. trust:
   - blocking questions
   - required proof
   - closure blockers
3. search and command dock:
   - jump to open questions
   - jump to recommended actions
4. future inbox surface:
   - active decisions requiring a human answer

## Phased Implementation

### Phase 1

1. durable decision and architecture docs
2. command contract for `start`, `next`, `decide`, and `eval`
3. artifact contract for `questions`, `recommendations`, and `evals`

### Phase 2

1. implement `skopos start`
2. implement `skopos next`
3. implement `skopos decide`
4. persist question and recommendation artifacts

### Phase 3

1. implemented `skopos eval`
2. feed unresolved questions and eval state into `trust` and `done`
3. stop broad implementation when blocking router state is unresolved

### Phase 4

1. expose router state in the routed UI
2. make tool adapters call the router automatically
3. keep search, trust, and mission detail synchronized with the same compiled router state

## Consequences

### Positive

1. users can discuss the work and let Skopos route the rest
2. agents stop depending on remembered prose rules for workflow behavior
3. unresolved decisions become durable project memory instead of disappearing into chat
4. eval is now an explicit part of execution rather than a vague future quality layer

### Costs

1. Skopos will gain another runtime artifact family
2. the CLI and UI will need coordinated updates
3. closure behavior becomes stricter, which is correct but more demanding

## Next Action

Implement the workflow-router layer before continuing broad agent-memory or recommendation UX work:

1. keep `start`, `next`, and `decide` stable as the runtime router baseline
2. keep `eval` stable as the mission-level evidence lane
3. keep trust and `done` aligned with router artifacts as the closure baseline
4. adapter and UI integration after that
