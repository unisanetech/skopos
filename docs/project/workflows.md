# Skopos Developer Workflows

This page explains the main workflows agents should follow when working inside Skopos.

## Metadata

- Doc ID: `SKOPOS-PROJECT-WORKFLOWS`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-06-29`
- Review Cycle: `per workpack`
- Related Docs:
  - `overview.md`
  - `architecture.md`
  - `validation.md`
  - `../how-to/bootstrap-the-project.md`

## Changelog

- `2026-06-29`: Added durable workflow guidance for agent-guided Skopos understanding.

## Normal Work Loop

1. Read `AGENTS.md` and `docs/00-start-here.md`.
2. Run `skopos program next . --compact --json` to see whether existing work or obligations should take priority.
3. For non-trivial work, start or continue a mission with `skopos start` or `skopos next`.
4. Resolve workflow questions before implementation.
5. Make the smallest scoped change.
6. Run proportional checks.
7. Update docs, decisions, findings, or memory only when project truth changed.
8. Run `skopos eval` and `skopos trust` before closure when a mission exists.
9. Complete the mission only after checklist, proof, and trust are reconciled.

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
