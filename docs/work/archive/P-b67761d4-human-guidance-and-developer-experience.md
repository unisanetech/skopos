---
title: Archived Human Guidance And Developer Experience Plan
status: historical
owner: skopos-core
id: SKOPOS-PLAN-P-B67761D4
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
  - P-37fa9180-prototype-roadmap.md
  - P-b4e43e34-prototype-implementation-checklist.md
  - P-11229565-system-ui.md
  - ../../decisions/030-human-guidance-and-developer-experience-contract.md
  - ../../decisions/023-supervision-cost-and-workflow-weight-discipline.md
  - ../../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../plans/P-e7e888e6-canonical-product-convergence.md
  - ../../architecture/trust-and-closure-model.md
  - ../../architecture/decision-escalation-model.md
  - ../../architecture/artifact-model.md
reviewCycle: none; retained for history
---

# Archived Human Guidance And Developer Experience Plan

> Historical prototype plan. The canonical convergence Plan owns current direction;
> this file is excluded from default retrieval.

## Changelog

- `2026-07-28`: Archived this prototype Plan after the canonical convergence Plan
  absorbed its remaining direction.
- `2026-07-28`: Retained as current implemented UX inventory. Future work and
  terminology are owned by the canonical convergence Plan.

- `2026-06-24`: Implemented the shared UI language cleanup slice, replacing remaining internal labels such as program pressure, docs posture, check inventory, compiled workspace search, and snapshot empty states with simpler user-facing wording.
- `2026-06-24`: Implemented the Discussion route guidance slice, so handoffs and checkpoints are explained as saved chat context with accepted direction, open questions, and next steps before the history list.
- `2026-06-24`: Implemented the Work route guidance slice, so Missions and Plans explain when to use each workflow surface, what to open first, and how to continue before showing queues or plan details.
- `2026-06-24`: Implemented the validation route guidance slice, so Readiness, Evidence, and Activity explain how to use each page before showing checks, proof metrics, or event history.
- `2026-06-24`: Implemented the Knowledge route guidance slice, so Docs, Decisions, and Issues pages explain when to use the page, what to look for, and when to update the underlying memory.
- `2026-06-24`: Implemented the Current Work next-action UI slice, replacing program-router wording with a plain-language next-action card, current tracked work, and before-finishing obligations.
- `2026-06-24`: Implemented the routed UI orientation slice, renaming user-facing navigation to Current Work, Readiness, Evidence, Issues, and Project Map; adding state-aware empty copy for missions, plans, and evidence; and turning project-area detail into practical ownership guidance.
- `2026-06-24`: Implemented the first routed UI human-guidance slice on mission detail, including workflow-question state loading, progress/phase/current-focus text, decisions, findings, blockers, proof needed, and guided open-question display.
- `2026-06-24`: Implemented the decisions/findings progress and guided-question CLI slice, so `next` and `eval` now surface decision/finding progress while `start`, `plan`, and `decide` show recommended options, tradeoffs, and next-step guidance in plain English.
- `2026-06-24`: Implemented the first progress-summary slice for mission-backed workpacks in `next`, `eval`, and `done` output, deriving progress, phase, done, doing-now, blockers, and proof-needed text from mission artifacts instead of creating duplicate truth.
- `2026-06-24`: Implemented the second CLI human-output slice for `skopos next`, `skopos program sync`, `skopos program next`, `skopos done`, and `skopos eval`, with focused tests proving status and next-step guidance on real command paths.
- `2026-06-24`: Implemented the first CLI human-output slice for `skopos trust`, `skopos policies recommend`, `skopos policies apply`, and `skopos policies drift`, including focused tests that require plain-language status and next-step guidance while preserving `--json`.
- `2026-06-24`: Added the first human guidance and developer experience plan so CLI output, UI copy, workpack progress, and agent answers are designed for clear human understanding instead of only machine-readable correctness.

## Goal

Skopos should help a developer understand:

1. what is happening in the project
2. why it matters
3. what the agent is doing now
4. what is done
5. what is blocked
6. what decision is needed
7. what proof remains before work can be closed

The product should feel useful to vibe coders, junior engineers, mid-level engineers, and senior engineers. Expert users can open details, but the default path should be clear without needing expert context.

## Product Thesis

Skopos is not only an agent memory layer. It is a guidance layer between a real project, a coding agent, and the human developer supervising the work.

The core product promise is:

`Skopos keeps project knowledge accurate, guides the agent through the right workflow, and explains the current state in simple language so the developer can trust what happens next.`

## Audience

| Audience | What they need from Skopos |
| --- | --- |
| Vibe coder | Clear next steps, safe defaults, and simple explanations without deep architecture language. |
| Junior engineer | Guidance on why a rule matters, what to change, and how to verify the work. |
| Mid-level engineer | Fast project orientation, structured decisions, visible gates, and reliable closure proof. |
| Senior engineer | Compact state, raw artifacts on demand, strong policy controls, and low workflow ceremony. |
| Team lead | Progress, blockers, decisions, and drift visibility across workstreams. |

## Principles

1. Simple first, detailed on demand.
2. Every warning needs a next step.
3. Every blocker needs an owner or question.
4. Every workpack needs progress, current focus, next action, and proof status.
5. Every guided question should include a recommended option and tradeoff.
6. Human text explains machine truth but does not replace it.
7. Small tasks should stay lightweight.
8. Big or risky tasks should get workpack structure and staged gates.
9. Raw JSON should never be the first human surface unless the user asks for JSON.
10. Agent answers should be calm, clear, well formatted, and action-oriented.

## Human Output Contract

Every important CLI command and UI route should answer these questions:

| Question | Expected answer |
| --- | --- |
| What happened? | A short summary in plain English. |
| Is it OK? | Pass, review needed, blocked, or failed in human terms. |
| Why does it matter? | One sentence explaining the risk or value. |
| What should I do next? | A concrete command, edit, or decision. |
| Is a user decision needed? | Yes or no, with the exact question if needed. |
| Can we close the work? | Yes, not yet, or blocked, with proof needed. |

## Status Language

| Internal status | Human copy |
| --- | --- |
| `pass` | Looks good. |
| `warn` | Review this before closing. |
| `fail` | Fix this before closing. |
| `blocked` | Work cannot continue safely until this is answered or fixed. |
| `needs-review` | Mostly usable, but one or more items need review. |
| `stale` | This may be outdated. Refresh it before trusting it. |
| `unknown` | Skopos does not know enough yet. Run the suggested discovery step. |

## Command Output Shape

Default command output should follow this shape:

1. headline
2. status
3. important findings
4. next step
5. user decision, if needed
6. command to run next, if useful

Example:

```text
Policy drift check
Status: Review needed

Skopos found 2 architecture issues against the accepted policy.
This matters because these files may drift away from the project structure rules.

Next step:
Fix the listed files, then run:
pnpm skopos policies drift
```

JSON output remains available through `--json`.

## Guided Questions

When Skopos asks a question, it should use this shape:

| Part | Purpose |
| --- | --- |
| Question | The exact choice the user needs to make. |
| Recommended option | The safest or most likely option. |
| Why | One short explanation. |
| Alternatives | 1-3 choices with tradeoffs. |
| Default | What Skopos will assume if the user has no preference. |

Example:

```text
Question: Should this project use a workpack for this change?

Recommended: Yes, use a workpack.
Why: The change touches architecture policy, generated agent instructions, and trust checks.

Other options:
- Light path: faster, but easier to miss docs and proof updates.
- Normal path: OK if the change is narrowed to one command only.

Default if you have no preference: use a workpack.
```

## Workpack Experience

A workpack should always show a human progress summary.

| Field | Meaning |
| --- | --- |
| Workpack | The name or goal. |
| Progress | Approximate percent or completed-step count. |
| Current phase | Planning, implementation, verification, docs sync, closure, or blocked. |
| Done | What has already changed. |
| Doing now | The current concrete action. |
| Next | The next concrete action. |
| Blockers | Anything stopping safe progress. |
| Questions | Decisions waiting on the user. |
| Decisions | Choices made during the workpack. |
| Findings | New important facts discovered while working. |
| Proof needed | Checks or review still required before closure. |

Progress should be based on real state: checklist items, phase completion, gates, blockers, and proof. It should not pretend to be exact when the work is uncertain.

## Agent Answer Style

When an LLM coding agent uses Skopos context, its answers should:

1. lead with the answer or current status
2. use short sections only when they help
3. explain project-specific terms the first time they matter
4. ask only necessary questions
5. give recommended options when asking questions
6. mention next actions clearly
7. avoid dumping policy text unless the user asks for detail
8. avoid saying work is done without proof
9. report blockers directly
10. keep raw artifact paths and IDs secondary unless they are needed

## UI Guidance

The routed UI should behave like a project guidance console.

Default route surfaces should show:

1. status in human words
2. current attention
3. next step
4. blockers
5. questions
6. recent decisions
7. proof state

Raw artifact data should stay available, but it should live behind secondary disclosure, source links, or detail views.

## Gates

Human guidance is product behavior, so it needs gates.

Required checks for future implementation slices:

1. CLI warnings and failures include a next step.
2. CLI default output is human-readable without `--json`.
3. `--json` remains stable for agents and scripts.
4. Workpack summaries include progress, next step, blockers, questions, and proof state.
5. UI routes do not lead with raw JSON, raw IDs, or raw artifact handles.
6. Beginner or mid-level users can understand the main status without knowing Skopos internals.
7. Agent briefs include answer-style guidance without increasing the default prompt too much.

## Implementation Phases

### Phase 0: Contract And Plan

1. accept the decision contract
2. add this project plan
3. cross-link roadmap, checklist, overview, and UI plan

### Phase 1: CLI Human Output

1. update `skopos trust` - first slice implemented
2. update `skopos policies recommend` - first slice implemented
3. update `skopos policies apply` - first slice implemented
4. update `skopos policies drift` - first slice implemented
5. keep `--json` as the machine contract - first slice preserved
6. add output tests for next-step presence - first slice implemented
7. extend the same presenter contract to `next`, `program sync`, `program next`, `done`, and `eval` - first workflow slice implemented

### Phase 2: Workpack Progress

1. add progress summaries - first mission-backed CLI slice implemented
2. show current phase - first mission-backed CLI slice implemented
3. show blockers and questions - first mission-backed CLI slice implemented
4. show decisions and findings discovered during work - first CLI progress slice implemented
5. show proof still needed before closure - first mission-backed CLI slice implemented

### Phase 3: UI Copy And Guidance

1. update route headings and status copy - first mission-detail guidance slice implemented
2. hide raw artifact handles behind secondary affordances
3. add clearer empty states
4. show next action on key routes
5. show workpack progress in active work views - first mission-detail guidance slice implemented

### Phase 4: Guided Decisions

1. standardize question format - first CLI slice implemented for `start`, `plan`, `decide`, and `next`
2. add recommended options and tradeoffs - first CLI slice implemented
3. remember accepted decisions in the owning artifact
4. keep unanswered blocking decisions visible in trust and workpack views

### Phase 5: Comprehension Proof

1. add fixtures for beginner-readable command output
2. add UI snapshot or text checks for visible next steps
3. verify large workpacks stay understandable without loading raw artifacts first

## Immediate Next Slice

The first CLI implementation slice has landed for:

1. `skopos trust`
2. `skopos policies recommend`
3. `skopos policies apply`
4. `skopos policies drift`

The first workflow CLI slice has also landed for:

1. `skopos next`
2. `skopos program sync`
3. `skopos program next`
4. `skopos done`
5. `skopos eval`

The next implementation slice should extend the same human-output contract to:

1. deeper Current Work guidance that turns interrupt recommendations and open obligations into simpler next-action cards
2. agent brief answer-style guidance for installed projects
3. richer Issues, Decisions, and Docs summaries that explain why each item matters before showing raw detail
