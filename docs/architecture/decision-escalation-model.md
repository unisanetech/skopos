---
title: Decision Escalation Model
status: active
owner: skopos-core
id: SKOPOS-ARCH-DECISION-ESCALATION-MODEL
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-31
relatedDocs:
  - evidence-and-readiness-model.md
  - config-model.md
  - ../domains/product/positioning.md
reviewCycle: when owning truth changes
---

# Decision Escalation Model

Skopos should force agents to ask humans when a choice should not be guessed.

## Changelog

- `2026-07-31`: Replaced prototype workflow-router terminology with the canonical
  Task, Session, Verify, and Readiness execution contract.
- `2026-07-28`: Bound question and recommendation state to the exact Task and
  worktree projection under
  `.skopos/tasks/<worktree-id>/<task-id>/{questions,recommendations}.json`; removed
  workspace-global question and recommendation paths from the operating contract.
- `2026-07-29`: Routed ongoing questions through the current Task and
  `skopos work next`, removing the prototype router command.
- `2026-04-09`: Updated the decision model to reflect that `skopos plan` now emits scope-aware implementation ask-back questions based on goal text and configured decision categories.
- `2026-04-09`: Updated the decision model to reflect that `init` now emits recommended bootstrap questions with one preferred option first.
- `2026-04-09`: Added the first decision-escalation baseline so agents know when to defer to humans instead of improvising.

## Escalation Classes

1. `delegable`
2. `recommend-and-ask`
3. `must-ask`
4. `forbidden-without-approval`

## Ask-Back Rules

1. explain why the decision matters
2. recommend one option first
3. explain tradeoffs for alternatives
4. state what the agent will do after the user answers
5. ask only when the runtime question surface says the choice is still unresolved

## Task Fit

Task state makes decision escalation runtime-owned instead of prompt-owned.

The intended command flow is:

1. `skopos start` emits initial questions and recommendations for new work
2. `skopos work next` refreshes unresolved questions during ongoing work
3. `skopos decide` records the chosen option and clears the blocker

Questions should not live only in chat output. They are persisted as local Task state
under `.skopos/tasks/<worktree-id>/<task-id>/questions.json`. Every read and write must
resolve the exact Task identity; there is no workspace-global current-question
projection.

## Question Contract

Each question should include:

1. the question text
2. escalation class
3. whether it blocks implementation or closure
4. one recommended option first
5. bounded alternative options
6. why the decision matters
7. what Skopos will do after the answer
8. linked Plan or Task ids

## Recommendation Contract

Not every turn should become an ask-back.

When the next step is deterministic, Skopos should emit a recommendation instead of another question.

Recommendations should:

1. stay bounded
2. point to a concrete next action or command
3. explain the reason compactly
4. remain grounded in compiled state rather than generic assistant wording
5. persist only beside the owning Task at
   `.skopos/tasks/<worktree-id>/<task-id>/recommendations.json`

Accepted decisions that change durable project truth are promoted to the owning
Decision, Task, Plan, or other canonical Memory surface. The Task-local question and
recommendation files remain rebuildable execution state rather than a second durable
authority.

## Mandatory Human Decisions

1. architecture shifts
2. public API changes
3. destructive migrations
4. vendor or provider choices
5. security, privacy, and cost-sensitive tradeoffs

## Bootstrap Application

The current bootstrap slice uses this model to emit:

1. project archetype confirmation
2. docs-root confirmation
3. instruction-source confirmation when `AGENTS.md` is missing
4. command-surface confirmation when no canonical root commands are detected

## Planning Application

The current planning slice also uses this model to emit:

1. scope confirmation when a plan is too broad
2. public API confirmation when a goal implies contract changes
3. migration confirmation when a goal implies destructive change
4. provider confirmation when a goal implies vendor or integration choice
5. security confirmation when a goal touches auth, privacy, or permission behavior

## Current Execution Application

The current Task model extends this contract beyond bootstrap and planning:

1. open material questions are owned by the current Task
2. duplicate and contradiction questions are resolved with `skopos decide`
3. contract-changing work is confirmed during `skopos start`
4. Session context projects the highest-priority blocking decision and current Task
5. Verify and Readiness prevent closure while required decisions or Evidence remain open
