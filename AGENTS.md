# Skopos Self-Hosting Rules

This file is the canonical instruction source for the standalone Skopos workspace.

## Read Order

1. `docs/00-start-here.md`
2. `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
3. `docs/architecture/00-architecture.md`
4. `docs/architecture/agent-native-operating-model.md`
5. `docs/architecture/docs-governance.md`
6. `docs/architecture/artifact-model.md`

## Standalone Governance

1. Treat this repository root as the Skopos project root.
2. Run Skopos commands from this root unless a task explicitly targets another project.
3. Keep project-specific integrations outside the Skopos core package family.

## Core Rules

1. Keep Skopos core generic and project-agnostic.
2. Do not hand-edit generated instruction mirrors or runtime-managed `.skopos/**` derived artifacts.
3. During the current convergence Plan, prioritize canonical product semantics,
   self-adoption, clean reconstruction, and coding-agent reliability over new surface
   expansion.
4. If `AGENTS.md` changes, regenerate mirrors with `pnpm instructions:sync`.
5. Before grepping source to discover command usage, check this file,
   `docs/00-start-here.md`, `docs/guides/developer-workflows.md`, and `skopos --help`
   or subcommand help. Source grep is a fallback when docs/help are missing or unclear.
6. Treat Skopos as the single project Memory, Task, and closure authority. Project-specific
   integrations contribute context, actions, and guards; they do not create a parallel
   LLM workflow.
7. Let coding agents own general reasoning and implementation. Add Skopos state only
   when it protects project truth, task intent, deterministic enforcement, recovery, or
   trustworthy evidence.

## Canonical Command Surface

1. `pnpm typecheck`
2. `pnpm test`
3. `pnpm proof`
4. `pnpm instructions:sync`
5. `pnpm skopos:init`
6. `pnpm skopos:session`
7. `pnpm skopos:ui`
8. `pnpm skopos:ui:dev`
9. `pnpm skopos:ui:serve`

## Common Skopos Commands

Use `skopos --help` for the full CLI surface and `skopos <command> --help` where supported. In this self-hosted repo, package scripts wrap the local source CLI; in installed projects, use `skopos` directly.

1. Load compact project knowledge: `skopos knowledge . --compact`
2. See current work and material decisions: `skopos session context . --actor <id> --json`
3. Build project Understanding when adoption needs it: `skopos understand . --actor <id> --json`
4. Assess adoption when Session context reports an adoption gap: `skopos adopt assess . --actor <id> --json`
5. Start tracked work: `skopos start "<goal>" . --accept "<criterion>" --own <path> --actor <id>`
6. Continue tracked work: `skopos work next . --actor <id> --json`
7. Inspect the current Task: `skopos task show <task-id> . --json`
8. List Actions: `skopos actions list .`
9. Run a Task Action: `skopos actions run <action-id> . --task <task-id> --actor <id> --json`
10. Record observation Evidence: `skopos evidence record-observation <task-id> . --requirement <id> --statement "<fact>" --actor <id> --json`
11. Diagnose closure Evidence: `skopos verify <task-id> . --phase closure --json`
12. Finish after Evidence passes: `skopos finish <task-id> . --actor <id> --json`
13. Sync agent instructions: `skopos instructions sync . --actor <id>`
14. Open live UI: `skopos ui dev . --host 127.0.0.1 --port <port>`
15. Open snapshot UI: `skopos ui serve . --host 127.0.0.1 --port <port>`
16. Render static UI artifact: `skopos ui render .`
17. Review project skill packs: `skopos skills recommend .`
18. Accept a project-bound skill: `skopos skills apply <pack-id> . --binding <binding-id> --actor <id> --reason <text>`

<!-- skopos:policy:start -->
## Skopos Accepted Policy (Derived Projection)

- This block is generated from tracked project policy; do not edit it directly.
- Source of truth: `tools/skopos/policies.yaml`
- Accepted packs: `architecture.mid-app@0.1.0`, `clean-code.maintainability@0.1.0`, `verification.progressive-validation@0.1.0`, `stack.async-work@0.1.0`
- Default Task risk: `standard`
- Progressive verification: keep small Tasks light, use proportional Actions and Guards for standard work, and use detailed high-impact Tasks or child Tasks for public API, architecture, stack, security, migration, multi-Scope, or long-running changes.
- Agent brief: `.skopos/cache/agent/policy-brief.json`

<!-- skopos:policy:end -->

<!-- skopos-operating-contract:start -->
## Default Skopos Operating Contract
When Skopos is installed, agents should treat it as the default operating memory layer for project Memory, planning, coordination, Evidence, and Readiness.
### Session Start
1. Read `AGENTS.md` first.
2. Run or inspect `skopos session context . --json` before broad scanning or implementation.
3. If Skopos state is missing or stale, run `skopos init .` and then re-check `skopos session context`.
4. Use `docs/00-start-here.md` as the human docs router when it exists; otherwise inspect `docs/` conservatively.
5. Host adapters should inject `skopos session context . --json`; use it directly when the host cannot inject session context.
### Agent Response Contract
- Answer the user directly before process detail.
- Use the response mode that fits the moment; do not announce a lane unless risk or execution scope makes it useful.
- Ask only when the answer changes direction, risk, policy, or public behavior.
- When asking, show the recommendation, reason, alternatives, and the default behavior if the user has no preference.
- For progress, report completed work, current work, blockers, and proof still needed without false precision.
- For closure, state changed behavior, focused proof, memory updates, and remaining risk.
### Task Risk And Detail
- Light risk: use for narrow local edits. Inspect relevant files, edit, capture focused Evidence, and update Memory only if project truth changed.
- Standard risk: use for bounded multi-file feature, docs, policy, or maintenance work. Start or continue a Task, keep decisions current, and capture proportional Evidence.
- High-impact risk: use for architecture, public API, data migration, security, stack, release, multi-Scope, or long-running work. Use a detailed Task or child Tasks, staged Guards and Evidence, findings, Memory sync, and explicit Readiness.
### Memory And Docs
- Update durable docs, decisions, findings, or policy only when project truth changes.
- Do not duplicate truth. Tasks track execution; durable rules belong in docs, policy, decisions, findings, Patterns, or Memory.
- In brownfield projects, use Skopos adoption discovery, proposal, approval, transformation, verification, and activation to converge docs safely.
- After changing `AGENTS.md`, run the project instruction action selected by Skopos. `skopos instructions sync .` owns only mirrors and adapters declared through Skopos.
### Validation Economy
- Treat root validation commands as a capability catalog, not a mandatory sequence.
- Select Actions and Guards from Task-owned changed paths and affected Scope dependents. Unchanged dirty paths that predate the Task are outside its proof boundary unless explicitly adopted with `--own`.
- Run the narrowest reliable check first. Do not run a workspace-wide test or build when affected-scope evidence is sufficient.
- Stop after the first failing check, fix the cause, then resume. Do not spend time collecting predictable downstream failures.
- Reuse valid source-bound Evidence while the exact Action, source, config, and command state are unchanged. Rerun after relevant invalidation.
- If project commands already own verification, register them as Actions; do not maintain a second verification authority.
### Readiness
- Before saying work is complete, capture the focused Evidence selected for the Task.
- For a compact diagnostic, run `skopos verify <task-id> . --phase closure --json`; add `--full` only for complete Evidence detail.
- To close after required Evidence exists, run `skopos finish <task-id> . --actor <id>`.
- Do not claim completion while Readiness blockers, blocking accepted-policy drift, open Task questions, missing Evidence, or Task state prevent closure.
- Final responses should state what changed, Evidence, Memory/docs updates, and remaining risk.
### Default Commands
- Session context: `skopos session context . --json`
- Work Queue: `skopos work queue . --json`
- Next work: `skopos work next . --json`
- Start tracked work: `skopos start "<goal>" . --accept "<criterion>" --own <path> --actor <id>`
- Current Task: `skopos task show <task-id> . --json`
- Sync instructions: `skopos instructions sync .`
- Verify diagnostic: `skopos verify <task-id> . --phase closure --json`
- Finish Task: `skopos finish <task-id> . --actor <id>`
- Validation commands below are discoverable capabilities. Skopos selects a proportional affected-scope set; do not run all of them by default.
- typecheck: `pnpm typecheck`
- test: `pnpm test`
- build: `pnpm build`
<!-- skopos-operating-contract:end -->

