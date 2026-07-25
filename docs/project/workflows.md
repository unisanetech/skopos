# Skopos Developer Workflows

This page explains the main workflows agents should follow when working inside Skopos.

## Metadata

- Doc ID: `SKOPOS-PROJECT-WORKFLOWS`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-07-25`
- Review Cycle: `per workpack`
- Related Docs:
  - `overview.md`
  - `architecture.md`
  - `validation.md`
  - `../how-to/bootstrap-the-project.md`

## Changelog

- `2026-07-25`: Added explicit project skill recommendation and adoption commands.
  Skills compile into task context plus existing actions and guards; they do not own a
  parallel workflow or closure command.

- `2026-07-25`: Added source-bound workflow receipts, exact execution ownership,
  completed receipt reuse, and explicit `workflows run --force` behavior.

- `2026-07-25`: Implemented phase-separated validation on the existing `skopos eval`
  authority: changed-scope iteration, owner-evidence stabilization, and one closure
  phase. Legacy eval calls still default to closure.

- `2026-07-25`: Recorded the target agent-native workflow—compact task brief, project
  actions, deterministic guards, changed-scope feedback, stabilization, and one final
  closure—while keeping current command guidance explicit until P1-W11 ships migration.

- `2026-06-30`: Added command discovery guidance so agents use documented help before source search and can find UI, memory, workflow, and validation commands quickly.

- `2026-06-29`: Added durable workflow guidance for agent-guided Skopos understanding.

## Normal Work Loop

1. Read `AGENTS.md` and `docs/00-start-here.md`.
2. Run `skopos program next . --compact --json` to see whether existing work or obligations should take priority.
3. For non-trivial work, start or continue a mission with `skopos start` or `skopos next`.
4. Resolve workflow questions before implementation.
5. Make the smallest scoped change.
6. Run proportional checks.
7. Update docs, decisions, findings, or memory only when project truth changed.
8. Use `skopos eval --phase iteration` for changed-scope feedback, run owner actions,
   then use `--phase stabilization` to review their evidence.
9. Run `skopos eval --phase closure` and `skopos trust` once the source state is stable.
10. Complete the mission only after checklist, proof, and trust are reconciled.

This section describes the currently implemented command flow. The accepted target under
P1-W11 is smaller:

```text
brief/admission
  -> agent implementation
  -> changed-scope check
  -> owner stabilization
  -> one final closure
```

Light tasks should not require durable mission ceremony. Normal, workpack,
multi-session, or multi-agent work may persist a compact task contract. Do not use
future replacement command names until the CLI implements and documents them.

## Command Discovery

Use command docs and help before searching source code for command behavior.

1. Start with `AGENTS.md` and `docs/00-start-here.md`.
2. Run `skopos --help` for the full command list.
3. Run subcommand help when available, such as `skopos ui --help`, `skopos ui dev --help`, or `skopos ui serve --help`.
4. Search source only when the docs/help are missing, stale, or unclear.

Common commands agents usually need:

1. `skopos knowledge . --compact`
2. `skopos setup review .`
3. `skopos understand . --actor <id>`
4. `skopos program next . --compact --json`
5. `skopos start "<goal>" . --actor <id>`
6. `skopos next . --actor <id>`
7. `skopos trust . --actor <id> --compact`
8. `skopos ui dev . --host 127.0.0.1 --port <port>`
9. `skopos ui serve . --host 127.0.0.1 --port <port>`
10. `skopos ui render .`
11. `skopos instructions sync . --actor <id>`
12. `skopos workflows list .`
13. `skopos workflows run <workflow-id> . --actor <id>`
14. `skopos eval . --mission <mission-id> --actor <id> --phase iteration`
15. `skopos eval . --mission <mission-id> --actor <id> --phase stabilization`
16. `skopos eval . --mission <mission-id> --actor <id> --phase closure`
17. `skopos skills list .`
18. `skopos skills recommend .`
19. `skopos skills apply <pack-id> . --binding <binding-id> --actor <id> --reason <text>`

`iteration` uses current changed-path impact to select focused typecheck/test/lint
families and deliberately excludes the final build lane. `stabilization` runs no
project checks; it reviews evidence for registered generator and maintenance actions.
`closure` runs the mission's full check set, workflow evidence, trust, and final proof.
Eval never executes project actions implicitly.

Workflow execution remains owned by `skopos workflows run`:

1. the runner records a source-bound receipt before and after execution
2. an exact concurrent invocation is rejected with the current owner run id
3. an exact completed read-only or output-bearing invocation reuses its valid receipt
4. relevant source/config/command/environment/output drift invalidates reuse and closure
5. `--force` reruns a completed receipt deliberately; it does not override an active
   owner

## Project Skill Adoption

1. `skopos skills list .` shows built-in packs and checked-in project bindings.
2. `skopos skills recommend .` reports fit, anti-signals, confidence, and missing roles.
3. Review the proposed binding against canonical project docs, actions, and guards.
4. Accept deliberately with `skopos skills apply`; actor and reason are mandatory.
5. Skopos generates resolved state plus equivalent host projections.
6. Relevant tasks receive bounded skill context automatically; unrelated tasks do not.
7. `skopos trust .` verifies binding, capability, project-source, freshness, and host
   parity.

There is no `skills run` or `skills done`. Existing actions execute work, and Skopos
eval/trust/done retain proof and closure ownership.

## Onboarding Flow For A Target Project

The intended external-project flow is:

```text
skopos init .
skopos understand .
skopos setup review .
skopos setup answer <question-id> <option-id> .
skopos trust .
skopos program next . --compact
```

`skopos understand` should now be treated as an agent-guided analysis workflow. Scanner artifacts are useful, but broad project work should wait until the agent analysis brief is followed and durable project understanding is created or mapped.

## Lane Selection

1. Light lane: narrow local edits, focused check, update memory only if project truth changed.
2. Normal lane: multi-file changes, mission tracking, proportional checks, docs sync if behavior or policy changed.
3. Workpack lane: architecture, public API, data, security, release, long-running refactors, or cross-package changes.

The default should stay progressive, not ceremonial. Do not create heavy process for tiny edits.

## Docs And Memory Updates

Update durable docs when the project truth changes. Examples:

1. architecture behavior changed
2. trust or closure rules changed
3. onboarding flow changed
4. pack/gate behavior changed
5. a recurring failure pattern was discovered
6. a decision affects future agents

Do not copy raw generated JSON into docs. Summarize what humans and future agents need to know.

## Completion Rule

A task is not complete just because code changed. Completion needs proof:

1. relevant checks ran or the reason they could not run is explicit
2. trust/eval are reconciled when mission-tracked
3. docs and instruction mirrors are synced when touched
4. findings/decisions are updated when durable project knowledge changed
5. final response states changes, proof, memory/docs updates, and remaining risk
