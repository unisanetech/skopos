<!-- Generated from AGENTS.md for CLAUDE.md. Do not edit directly. -->
# Skopos Self-Hosting Rules

This file is the canonical instruction source for the standalone Skopos workspace.

## Read Order

1. `docs/00-start-here.md`
2. `docs/project/proof-phase-plan.md`
3. `docs/project/implementation-checklist.md`
4. `docs/architecture/runtime-model.md`
5. `docs/architecture/config-model.md`
6. `docs/architecture/artifact-model.md`

## Standalone Governance

1. Treat this repository root as the Skopos project root.
2. Run Skopos commands from this root unless a task explicitly targets another project.
3. Keep project-specific integrations outside the Skopos core package family.

## Core Rules

1. Keep Skopos core generic and project-agnostic.
2. Do not hand-edit generated instruction mirrors or runtime-managed `.skopos/**` derived artifacts.
3. During the current proof phase, prioritize brownfield reliability, closure quality, and self-hosting friction discovery over new UI or graph surface expansion.
4. If `AGENTS.md` changes, regenerate mirrors with `pnpm instructions:sync`.

## Canonical Command Surface

1. `pnpm typecheck`
2. `pnpm test`
3. `pnpm proof`
4. `pnpm instructions:sync`
5. `pnpm skopos:init`
6. `pnpm skopos:trust`
7. `pnpm skopos:ui`

<!-- skopos:policy:start -->
## Skopos Accepted Policy

- Source of truth: `.skopos/policies/resolved.json`
- Accepted packs: `stack.async-work@0.1.0`, `gates.progressive-validation@0.1.0`, `architecture.mid-app@0.1.0`, `clean-code.maintainability@0.1.0`
- Default execution lane: `normal`
- Progressive workflow rule: keep small tasks light, use normal gates for bounded feature work, and create/use a workpack for public API, architecture, stack, security, migration, multi-package, or long-running changes.
- Agent brief: `.skopos/agent/policy-brief.json`

<!-- skopos:policy:end -->

<!-- skopos-operating-contract:start -->
## Default Skopos Operating Contract
When Skopos is installed, agents should treat it as the default workflow layer for project memory, planning, validation, and closure.
### Session Start
1. Read `AGENTS.md` first.
2. Run or inspect `skopos program next . --compact --json` before broad scanning or implementation.
3. If Skopos state is missing or stale, run `skopos init .` and then re-check `skopos program next`.
4. Use `docs/00-start-here.md` as the human docs router when it exists; otherwise inspect `docs/` conservatively.
5. Load `.skopos/agent/communication-brief.json` when available so user-facing answers follow project tone, question, progress, and closure rules.
### Lane Selection
- Light lane: use for narrow local edits with low risk. Inspect relevant files, edit, run a focused check, and update memory only if project truth changed.
- Normal lane: use for multi-file feature, docs, policy, or maintenance work. Start or continue a Skopos mission, keep decisions current, run proportional checks, and summarize proof.
- Workpack lane: use for architecture, public API, data migration, security, stack, release, or long-running work. Track phases, decisions, staged gates, findings, memory sync, and closure proof.
### Memory And Docs
- Update durable docs, decisions, findings, or policy only when project truth changes.
- Do not duplicate truth. Workpacks track execution; durable rules belong in docs, policy, decisions, findings, or memory.
- In brownfield projects, suggest docs organization improvements before rewriting existing docs.
- After changing `AGENTS.md`, run `skopos instructions sync .` so mirrors and adapters stay aligned.
### Closure
- Before saying work is done, run the focused checks that match the lane.
- For normal/workpack work, run `skopos done --cwd . --actor <id>` or explain why it could not be run.
- Do not claim complete when `skopos trust`, `skopos eval`, accepted-policy drift, open workflow questions, or mission state blocks closure.
- Final responses should state what changed, proof/checks, memory/docs updates, and remaining risk.
### Default Commands
- Program next: `skopos program next . --compact --json`
- Trust check: `skopos trust . --compact`
- Start tracked work: `skopos start "<goal>" . --actor <id>`
- Continue work: `skopos next . --actor <id>`
- Sync instructions: `skopos instructions sync .`
- Closure: `skopos done --cwd . --actor <id>`
- typecheck: `pnpm typecheck`
- test: `pnpm test`
- build: `pnpm build`
<!-- skopos-operating-contract:end -->

