# Workflow Extension Model

Skopos should support project-registered workflow extensions so agents can use repo-specific scripts without falling back to arbitrary shell guessing.

## Metadata

- Doc ID: `SKOPOS-ARCH-WORKFLOW-EXTENSION-MODEL`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/architecture`
- Canonical: `yes`
- Last Updated: `2026-04-12`
- Review Cycle: `per workpack`
- Related Docs:
  - `config-model.md`
  - `runtime-model.md`
  - `artifact-model.md`
  - `trust-and-closure-model.md`

## Changelog

- `2026-04-12`: Updated the workflow extension model after `skopos next` landed, so project workflows now sit behind an implemented `start` plus `next` plus `decide` router baseline and the remaining control-plane gap is `eval` plus final closure enforcement.
- `2026-04-11`: Clarified the next router split so project workflows stay as registered execution lanes while `skopos start`, `skopos next`, `skopos decide`, and `skopos eval` become the control plane that decides when those workflows are needed.
- `2026-04-10`: Updated the workflow extension model to require actor attribution for mutating and destructive workflow runs, and to carry that actor through generated run evidence and closure reporting.
- `2026-04-09`: Updated the workflow extension model to reflect explicit CLI approval enforcement for workflows marked `requiresApproval` or `destructive`.
- `2026-04-09`: Updated the workflow extension model to reflect that workflow and trust enforcement can now flow through generated Claude Code hooks in addition to the CLI and proof harness.
- `2026-04-09`: Refined the workflow extension model so registered workflows fit directly into the ingest-compile-lint-trust loop instead of behaving like isolated script runners.
- `2026-04-09`: Updated the workflow extension model to reflect that registered workflows now feed `plan`, `impact`, and `done` through requirement matching and run-evidence checks.
- `2026-04-09`: Updated the workflow extension model to reflect the first implemented slice: manifest discovery, CLI workflow inspection and execution, and generated run evidence under `.skopos/runs/`.
- `2026-04-09`: Added the workflow extension model so custom project scripts can be exposed to humans and agents through a governed Skopos workflow registry instead of ad hoc shell execution.

## Core Principle

Skopos should have:

1. built-in core commands
2. project-registered workflow extensions
3. workflow outputs that can file back into the compiled project knowledgebase

It should not rely on:

1. arbitrary unregistered shell commands
2. hidden scripts with unknown side effects
3. multiple unnamed paths for the same project workflow

## Workflow Manifest Model

Project-specific workflows should live in repo-authored manifests, not in generated state.

Recommended default location:

1. `tools/skopos/workflows/*.yaml`

The root config may later allow additional workflow manifest directories, but the default should stay small and deterministic.

## Pipeline Fit

Registered workflows should participate in the Skopos operating loop:

1. ingest:
   - workflows may gather or refresh repo-specific raw signals and generated sources
2. compile:
   - workflows may produce reference docs, indexes, diagrams, or validation outputs that Skopos tracks
3. lint:
   - workflows may validate docs, references, or domain-specific invariants
4. trust:
   - workflow run evidence becomes part of closure proof when the workflow is required
5. compound:
   - valuable workflow outputs should be filed back into durable project knowledge or generated views

## Router Fit

Project workflows are execution lanes, not the discussion router.

The next control-plane layer should work like this:

1. `skopos start` routes new work and decides whether a workflow is required later
2. `skopos next` refreshes that guidance during execution
3. `skopos decide` clears blocking human choices
4. `skopos eval` proves the work before closure
5. `skopos workflows run` remains the governed execution surface for repo-specific commands

This keeps the system from falling back to arbitrary shell guessing after the user and the agent finish discussing the task.

## Required Workflow Fields

Each workflow manifest should define:

1. `id`
2. `title`
3. `description`
4. `category`
5. `scope`
6. `command`
7. `cwd`
8. `inputs`
9. `outputs`
10. `affects`
11. `safety`
12. `requiresApproval`
13. `whenToUse`
14. `requiredForDone`
15. `recommendedAfter`
16. `owner`

## Recommended Categories

1. `docs-generator`
2. `docs-validator`
3. `reference-generator`
4. `graph-generator`
5. `quality-check`
6. `migration`
7. `maintenance`
8. `domain-tool`

## Safety Model

Every registered workflow should declare one of:

1. `read-only`
2. `mutating`
3. `destructive`

Skopos should use that safety metadata to decide:

1. whether the workflow is safe for agents to recommend automatically
2. whether a human approval step is required
3. whether closure may depend on its output
4. whether the run must be actor-attributed because it mutates shared workspace state

## Current Implemented Slice

Skopos currently supports:

1. workflow discovery
2. workflow listing and explanation through the CLI
3. workflow execution through the CLI
4. generated run evidence under `.skopos/runs/*.json`
5. plan-time workflow recommendation for matching scopes and goals
6. impact-time required workflow inference for matching changed surfaces
7. done-time workflow freshness checks against required workflow runs
8. explicit CLI approval enforcement for workflows marked `requiresApproval` or `destructive`
9. actor-attributed workflow execution for mutating or destructive runs, with `--actor <id>` required before run evidence is accepted

The current slice does not yet wire workflows into:

1. MCP workflow tools
2. tool-native approval handoff beyond the CLI gate
3. richer stale-output validation beyond current changed-surface freshness checks
4. router-driven workflow recommendation and blocking semantics instead of leaving workflow choice in chat context
5. eval integration so required workflows can feed mission-level proof rather than only trust freshness

## Enforcement Fit

1. CLI and MCP remain the stable workflow and trust surfaces.
2. Generated tool-native adapters may trigger workflow-aware trust behavior where a coding tool exposes deterministic hooks.
3. The first implemented tool-native path is Claude Code hook generation that:
   - syncs instruction mirrors after `AGENTS.md` edits
   - blocks tool stop when workflow or closure evidence is incomplete
4. Tool-native adapters should consume the same workflow and trust logic that powers `impact`, `done`, and `instructions sync` rather than reimplementing those rules independently.

## Trust Rules

1. workflows required for docs, references, or validation must be visible to `impact` and `done`
2. workflow runs should be recorded as evidence, not left implicit
3. stale workflow outputs should reduce trust when the workflow is marked as required
4. workflows should support the compiled knowledgebase instead of becoming an escape hatch for arbitrary shell behavior
5. approval-sensitive workflows must refuse execution until the caller opts in explicitly
6. mutating workflow evidence should not be anonymous when more than one actor can write workspace state

## Run Evidence

Workflow execution evidence should live in generated runtime state such as:

1. `.skopos/runs/*.json`

That allows Skopos to prove:

1. which workflow ran
2. when it ran
3. whether it succeeded
4. which outputs it produced
5. which actor produced the run when actor attribution is required
6. whether closure can trust the result
