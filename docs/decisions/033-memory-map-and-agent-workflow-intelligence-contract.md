# Decision: Memory Map And Agent Workflow Intelligence Contract

## Metadata

- Doc ID: `SKOPOS-DECISION-033`
- Status: `accepted`
- Date: `2026-06-27`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-06-27`
- Related Docs:
  - `../project/vision.md`
  - `../project/policy-pack-and-stack-intelligence-plan.md`
  - `../project/human-guidance-and-developer-experience-plan.md`
  - `029-policy-pack-stack-intelligence-and-memory-contract.md`
  - `030-human-guidance-and-developer-experience-contract.md`
  - `032-workflow-recording-preflight-guard.md`

## Changelog

- `2026-06-27`: Accepted the Memory Map and Agent Workflow Intelligence contract so Skopos can map existing project truth before scaffolding docs, guide coding-agent communication across the full workflow, and make memory completeness part of trust and launch readiness.

## Context

Skopos is meant to be the durable intelligence layer for coding agents, not only a documentation scaffold. The current system already has strong foundations:

1. generated `.skopos/**` state
2. `AGENTS.md` scaffolding and mirror sync
3. policy packs, role mapping, drift reports, gates, missions, plans, discussion memory, and human-friendly CLI/UI output
4. a product vision centered on compact, current project truth

The remaining gap is that parts of the implementation still treat the project docs contract as a fixed path:

1. canonical docs root
2. `docs/00-start-here.md`
3. instruction source

That works for greenfield projects and simple repos, but it is too narrow for mature brownfield projects. Existing projects may already have good `AGENTS.md`, `README.md`, architecture docs, decision logs, validation docs, release docs, or scattered but meaningful documentation. Skopos should not blindly duplicate those surfaces or force a Skopos-shaped folder layout before it understands the local project.

There is a second product gap: coding agents need more than facts. They need project-specific guidance for how to explain work, ask questions, choose workflow lanes, report progress, run gates, update memory, and close with proof. Human-friendly UX and agent behavior must be part of the same contract.

## Decision

Skopos will add a first-class Memory Map and Agent Workflow Intelligence layer.

The canonical model is:

`project truth -> compact memory -> agent guidance -> workflow lane -> questions -> execution -> gates -> proof -> memory sync -> handoff`

This decision changes the long-term product direction in four ways:

1. Memory roles are more important than fixed paths.
2. Brownfield projects must be mapped before Skopos suggests or writes durable docs.
3. Coding-agent communication rules are a generated project artifact, not only prompt advice.
4. The same guidance model applies to the complete workflow, not only docs and `AGENTS.md`.

## Memory Map Contract

Skopos memory must map durable project truth by responsibility.

Initial memory roles:

1. agent entrypoint
2. project overview
3. architecture and structure
4. validation and gates
5. decisions and rationale
6. findings, known issues, and drift
7. generated artifact ownership
8. accepted policy packs
9. stack decisions
10. active work and proof history
11. discussion handoff and recent accepted direction

Each mapped role should carry:

1. source path or artifact path
2. role kind
3. authority level: `canonical`, `supporting`, `generated`, or `unknown`
4. confidence
5. freshness status
6. source dependencies
7. suggested improvement when weak, missing, stale, or duplicated

Expected artifact:

1. `.skopos/memory/state.json`

Expected future command surface:

1. `skopos memory status .`
2. optional `skopos memory suggest .`
3. optional `skopos memory apply <suggestion-id>`

## Brownfield And Greenfield Behavior

### Greenfield

For new projects, Skopos may scaffold the recommended project memory structure:

1. `AGENTS.md`
2. docs entrypoint
3. starter validation guidance
4. starter decision/finding locations when useful
5. initial accepted or recommended policy packs

### Brownfield

For existing projects, Skopos must detect before changing:

1. map existing `AGENTS.md`, README, docs, scripts, CI hints, decision logs, and generated-output rules
2. infer memory roles from current project truth
3. preserve strong existing docs and instructions
4. suggest improvements before editing human-authored docs
5. avoid creating duplicate docs routers when a good router already exists
6. ask before making important docs, instruction, or policy changes

Skopos may still recommend a Skopos-style docs map, but it should frame that as a suggested improvement, not an automatic brownfield rewrite.

## Agent Communication Contract

Skopos will generate project-specific agent guidance so Codex, Claude, Cursor, and similar tools can communicate clearly while using Skopos.

Expected artifact:

1. `.skopos/agent/communication-brief.json`

The communication brief should define:

1. answer style
2. question format
3. lane explanation rules
4. progress reporting rules
5. proof and closure format
6. memory update rules
7. escalation rules for risky work

Default behavior:

1. use simple English
2. explain why a task is light, normal, or workpack lane
3. ask only when the answer changes implementation direction
4. provide a recommended option first
5. include tradeoffs in beginner and mid-level friendly language
6. show current phase, approximate progress, blocker state, next action, and proof still needed for long work
7. close with checks run, results, remaining risks, and memory updates

## Workflow Intelligence Contract

The same model applies across the full workflow.

| Step | Skopos responsibility |
| --- | --- |
| Start | Understand the goal, choose the lane, and explain why. |
| Context | Load compact memory first, then targeted docs/source only when needed. |
| Plan | Create plans only when useful for the task risk. |
| Ask | Ask guided questions with recommended choices and tradeoffs. |
| Edit | Apply accepted packs, local memory, and boundaries. |
| Progress | Track phase, progress, blockers, decisions, findings, and proof. |
| Validate | Choose proportional gates from accepted packs, risk, and changed surfaces. |
| Memory sync | Update docs, decisions, findings, policy, or stack memory only when project truth changed. |
| Done | Close with proof, remaining risk, and changed memory. |
| Handoff | Save compact continuation state for the next agent or chat. |

This contract must influence:

1. `skopos init`
2. `skopos understand`
3. `skopos trust`
4. `skopos start`
5. `skopos next`
6. `skopos decide`
7. `skopos eval`
8. `skopos done`
9. `skopos program next`
10. the routed UI
11. generated agent briefs

## Trust Contract

Trust should move from checking only fixed docs paths toward checking memory completeness and freshness.

Trust should warn when:

1. no memory map exists
2. required memory roles are missing
3. mapped sources changed after memory compilation
4. human-authored docs conflict with accepted policy
5. generated agent briefs are stale
6. accepted packs exist but gates or drift checks are not refreshed
7. Skopos created a docs router in a brownfield project where a stronger existing router should have been mapped instead

Trust should not require every project to use the same docs structure.

## UI Contract

The routed UI should add a Project Memory surface.

It should show:

1. what Skopos knows
2. where that knowledge comes from
3. what is trusted
4. what is stale, weak, duplicated, or missing
5. suggested updates to docs, `AGENTS.md`, policy, gates, and stack decisions
6. the active agent communication guidance
7. the safest next action

Raw JSON remains available, but the first view should be understandable to beginner and mid-level developers.

## Implementation Order

1. Add model contracts for memory roles, memory suggestions, and communication brief.
2. Update `init` to map existing memory before scaffolding docs.
3. Generate `.skopos/memory/state.json`.
4. Add a memory status command or extend `understand` with memory output.
5. Update trust to check memory roles and freshness.
6. Generate `.skopos/agent/communication-brief.json`.
7. Connect `start`, `next`, `decide`, `eval`, and `done` output to the communication rules.
8. Add the Project Memory UI page.
9. Prove behavior on greenfield, small library, mature brownfield app, weak-docs brownfield app, and Skopos itself.

## Consequences

### Positive

1. Skopos becomes a real project-memory layer instead of a docs template.
2. Brownfield projects keep their proven local structure.
3. Agents get clearer communication and workflow behavior from generated project state.
4. Trust becomes more accurate because it checks memory roles and freshness, not only fixed paths.
5. UI can explain project memory and next actions in human terms.

### Costs

1. Memory mapping needs stronger scanners and confidence handling.
2. Trust, init, understand, and UI must move from path assumptions to role-based logic.
3. Communication guidance needs tests so it does not drift into vague prose.
4. Suggestions need approval boundaries so Skopos does not silently rewrite human docs.

## Non-Goals

1. Do not force every project into `docs/00-start-here.md`.
2. Do not replace human-authored docs with generated prose.
3. Do not make every task use a heavy mission or workpack.
4. Do not hide raw artifacts from expert users or automation.
5. Do not claim broad non-Node support from this contract alone.

## Next Action

Implement Memory Map v1 first:

1. model contracts
2. existing-doc/instruction role detection
3. `init` behavior that maps before scaffolding
4. trust checks for memory existence, missing roles, and stale sources
5. a compact human and agent-facing memory summary

Then implement Agent Communication Brief v1 as the next slice.
