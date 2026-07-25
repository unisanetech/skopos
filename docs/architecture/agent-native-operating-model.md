# Agent-Native Operating Model

Skopos is the project operating and memory layer used by coding agents. It supplies
compact project truth, discoverable project capabilities, deterministic guardrails, and
evidence-backed closure without reproducing the reasoning loop already owned by the
agent.

## Metadata

- Doc ID: `SKOPOS-ARCH-AGENT-NATIVE-OPERATING-MODEL`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/architecture`
- Canonical: `yes`
- Last Updated: `2026-07-25`
- Review Cycle: `per workpack`
- Related Docs:
  - `00-architecture.md`
  - `artifact-model.md`
  - `retrieval-and-query-strategy.md`
  - `trust-and-closure-model.md`
  - `workflow-extension-model.md`
  - `../decisions/039-agent-native-single-control-plane-and-project-adoption-contract.md`
  - `../decisions/040-project-adapted-skill-packs-as-capability-projections.md`

## Changelog

- `2026-07-25`: Added project-adapted skill packs as explicitly accepted,
  task-selective projections into context plus existing actions and guards, with
  source-digest host parity and trust checks.

- `2026-07-25`: Implemented source-bound workflow receipts and exact execution
  ownership inside the existing workflow-run authority.

- `2026-07-25`: Implemented phase-separated validation through the existing eval
  authority and made closure-phase evidence mandatory for trust and done.

- `2026-07-25`: Added the canonical agent-native operating model, including the
  context/action/guard contract, task intent, execution phases, authority, proof
  receipts, project adoption, and low-ceremony extension rules.

## Product Boundary

Modern coding agents already plan, inspect, ask questions, edit, run tools, recover from
failures, and coordinate work. Skopos must not become another coding agent inside the
coding agent.

Skopos owns the missing project layer:

1. current and authoritative project memory
2. a compact task contract and smallest-sufficient context
3. discoverable project actions
4. deterministic guards and approvals
5. changed-scope and final proof
6. durable decisions, findings, and handoffs when they are needed

The agent owns reasoning and implementation. The project owns domain-specific commands
and rules. Skopos compiles context, exposes actions, enforces guards, and records proof.

## One Public Mental Model

Skopos exposes three primary concepts:

| Concept | Question answered |
| --- | --- |
| Context | What does the agent need to know for this task? |
| Action | What can the agent ask the project to do? |
| Guard | What must be prevented or proven? |

Existing product concepts compile into these primitives:

| Existing concept | Compiled meaning |
| --- | --- |
| workflow | one or more actions |
| policy pack | context plus guards |
| gate pack | reusable guards |
| skill | on-demand context explaining when and how to use actions |
| integration | a bundle of context, actions, and guards |
| host adapter | a projection for Codex, Claude Code, Copilot, or another host |

These packaging concepts must not become separate daily workflow systems.

## Task Contract

Project memory describes the repository. Task memory describes the user's current
intent. Skopos must keep them separate.

A compact task contract may include:

1. goal
2. scope
3. acceptance criteria
4. non-goals
5. constraints
6. open decisions
7. required proof

The task contract prevents scope drift. It is not a mandatory project-management
artifact for a small edit. A light task may keep the contract inside the compact brief;
normal, workpack, multi-session, or multi-agent work may persist it.

## Execution Phases And Risk

Execution moment and risk are independent axes.

Execution phases:

1. `admission`: establish intent, scope, authority, open decisions, and applicable rules
2. `iteration`: run affected-scope checks and focused behavior proof
3. `stabilization`: run owner generators and refresh derived knowledge once
4. `closure`: run the selected final lane once and bind proof to the stable source state

Risk lanes:

1. `light`
2. `normal`
3. `workpack`

Risk defines the final proof floor. It does not require final proof during admission or
after every edit.

The implemented convergence path keeps one validation authority:

1. `start` establishes admission and emits the compact task brief
2. `eval --phase iteration` derives checks from changed-path impact and excludes the
   final build lane
3. project actions remain explicit; `eval --phase stabilization` reviews owner action
   evidence without executing those actions implicitly
4. `eval --phase closure` runs the full mission check/evidence/proof lane once
5. omitted `--phase` means `closure` for compatibility

Only closure-phase eval artifacts can satisfy `trust` and `done`. Iteration and
stabilization results remain useful feedback but cannot certify completion.

## Progressive Agent Context

Default loading follows:

1. L0: compact root instructions
2. L1: current task brief
3. L2: relevant scope card
4. L3: targeted canonical docs
5. L4: relevant source, symbols, and relationship slices
6. L5: historical material only when explicitly requested or current truth is
   insufficient

After the initial brief, return compact deltas instead of replaying the whole context.
Full artifacts remain inspectable but are not the default transport.

## Authority And Memory Promotion

Knowledge must declare provenance and authority:

1. `declared`: explicit human or project truth
2. `accepted`: reviewed project decision
3. `observed`: directly detected from source
4. `inferred`: Skopos interpretation
5. `proposed`: agent or Skopos recommendation
6. `historical`: previously valid truth

Inferred or proposed content never becomes canonical merely because an agent wrote it.
Promotion into durable memory requires project evidence or explicit acceptance.

Skopos must also preserve negative knowledge:

1. retired APIs and patterns
2. rejected approaches
3. known failure patterns
4. temporary exceptions and their removal conditions
5. commands that appear valid but are not canonical

The additive public knowledge contract makes that boundary deterministic:

1. every record carries its authority, lifecycle, applicability, and source provenance
2. canonical promotion targets only `declared` or `accepted` authority
3. inferred or proposed provenance alone returns a rejected promotion result
4. accepted promotion requires accepted project evidence; declared promotion requires
   declared or accepted project evidence
5. promotion evaluation does not write memory or create a workflow; the existing
   project-memory authority remains responsible for persistence and acceptance
6. rejected and superseded decision snapshots from `.skopos/memory/state.json` compile
   into negative context and are selected only when relevant to the current task

## Actions

An action declares:

1. stable id and description
2. structured executable plus arguments
3. inputs, outputs, and affected paths
4. safety and approval class
5. applicable phases and risk lanes
6. estimated cost and concurrency group when useful
7. evidence contract

Prefer structured commands over unrestricted shell strings. Network access, secrets,
external writes, destructive operations, deployments, and migrations require explicit
policy and approval.

## Guards

Guards own deterministic enforcement:

1. protected-file and unsafe-command prevention
2. required human approval
3. changed-scope verification
4. generated-artifact ownership
5. accepted-policy and retired-pattern checks
6. final evidence completeness

Instructions guide the model. Guards enforce rules that cannot depend on model
compliance.

## Extension And Adoption Model

Extension is progressive:

1. automatic detection for normal projects
2. small checked-in configuration for custom context, actions, and guards
3. an optional versioned provider command for dynamic project intelligence

The provider protocol remains small:

1. `describe`: publish context, actions, guards, capabilities, and protocol version
2. `brief`: return task-relevant context and applicable capabilities
3. `verify`: return changed or final proof and evidence

Project-specific providers do not create a second workflow engine. Skopos remains the
only task admission, iteration, and closure control plane. The project supplies domain
knowledge and commands.

The implemented version-1 data boundary makes that ownership explicit:

1. provider descriptions must declare Skopos as workflow, task-state, and closure
   authority
2. provider briefs may only select previously described capabilities
3. provider verification returns evidence items, not `done`, trust, or closure state
4. provider evidence must identify its command, artifact path, or source digest
5. discovery, configuration, and invocation remain outside the implemented slice

Skopos should be fully adoptable by complex downstream projects. Generic workflow,
memory, docs, receipt, workpack, decision, finding, and host-projection gaps discovered
through adoption should improve Skopos. Domain-specific architecture grammar and checks
remain in the adopting project.

## Project-Adapted Skill Packs

Skill packs teach project-specific judgment without becoming another workflow layer.
The checked-in pack supplies researched guidance, positive and negative triggers,
context budgets, role requirements, a rubric, and proof fixtures. A checked-in project
binding maps those roles to authoritative project sources and existing action and guard
ids.

The implemented flow is:

1. `skills recommend` evaluates lifecycle fit and validates required project roles
2. `skills apply` requires an explicit binding, actor, and reason
3. the resolved artifact records accepted pack version and binding provenance
4. task admission selects only relevant modules within the declared context budget
5. selected skills add context and reference existing actions and guards
6. one resolved source generates equivalent Codex, Claude Code, Cursor, Copilot, and
   manual-host projections
7. trust recomputes project-source digests and rejects missing bindings, unknown
   capabilities, stale projections, or host divergence

Skills cannot create missions, run commands, record receipts, or declare completion.
Those responsibilities remain with the existing Skopos task, workflow, evidence, trust,
and closure authorities.

## Proof And Receipts

Closure maps acceptance criteria to evidence rather than treating generic green checks as
complete proof.

Expensive successful actions may produce receipts bound to:

1. exact action id, executable, and arguments
2. relevant source and configuration hashes
3. provider/extension versions
4. required environment identity
5. outputs and completion status
6. expiry or freshness policy

Exact duplicate commands must have one execution owner for a stable source state.
Receipts are reusable only while all declared inputs remain valid.

The implemented workflow-run receipt binds the action id, exact raw command and cwd,
declared inputs, workflow manifest, Skopos config, Node/platform identity, stable
outputs, actor, repository/worktree/branch identity, and an expiring ownership lease. A
second exact invocation:

1. fails while a matching running lease is active
2. reuses a valid successful receipt for read-only or output-bearing actions
3. executes again when source, configuration, command, environment, or outputs differ
4. may bypass completed-receipt reuse with explicit `workflows run --force`, but cannot
   steal an active ownership lease

For mutating actions, the running lease key is derived from the pre-action source state
so concurrent invocations can be rejected. Successful finalization recaptures the stable
post-action source and output state and derives the reusable completed key from that
state. A generator therefore cannot invalidate its own receipt merely by performing its
declared mutation.

Legacy workflow runs remain readable during compatibility migration, but they cannot
provide source-bound reuse.

## Parallel And Resumable Work

Active task state must be branch-, worktree-, task-, and actor-aware. Parallel agents
must not overwrite one global current mission, brief, recommendation, or question set.

The additive implementation stores authoritative active-task projections at:

```text
.skopos/tasks/<worktree-id>/<task-id>/
├── questions.json
├── recommendations.json
├── program.json
└── program-brief.json
```

Task identity records repository, worktree, branch, task, and optional actor identity.
Mission and eval artifacts carry the same identity, current-mission selection rejects a
task-aware mission from another branch or worktree, and closure checks reject mismatched
eval evidence. Existing `.skopos/questions.json`, `.skopos/recommendations.json`,
`.skopos/program/state.json`, and the global program brief remain generated
compatibility projections during migration; they are not task authority.

Shared generators and final integration closure use explicit ownership or serialization.
A resumable handoff contains accepted intent, completed changes, remaining acceptance
criteria, current blockers, latest valid evidence, and the next safe action—not a raw
transcript replay.

## Artifact Economy

The target default state is compact:

```text
.skopos/
├── project.json
├── index.json
├── current/
│   ├── brief.json
│   └── task.json
├── receipts/
└── cache/
```

Additional canonical artifacts may exist when their authority or lifecycle is distinct,
but new projections must prove that an existing artifact cannot own the data coherently.
High-churn derived projections belong in disposable cache.

The implemented first migration stage keeps that distinction explicit:

1. `.skopos/project.json` describes lifecycle and retention; it is generated
2. `.skopos/current/{task,brief}.json` projects the active task/worktree mission
3. `.skopos/receipts/*.json` projects evidence from authoritative workflow runs
4. existing plan, mission, run, eval, and task-scoped router artifacts retain authority
5. cache candidates remain at their compatibility paths until reader and recovery proof
   permit relocation

## Host Projection

Skopos maintains one project model and renders host-specific surfaces:

1. root and path-scoped instructions
2. on-demand skills
3. deterministic hooks
4. MCP tools where semantic tool access is useful
5. manual fallback guidance

Host projections are generated views, never independent truth.

The implemented host-neutral projection model lives inside the existing generated
enforcement profile. It records:

1. the canonical instruction source
2. the complete Skopos enforcement-rule set
3. Codex, Claude Code, Cursor, GitHub Copilot, and manual-host instruction paths
4. native, wrapper, or manual support
5. adapter paths and generated files

Instruction sync uses that model to choose mirror targets and to annotate Claude Code,
Codex, and manual adapter outputs with the same rule coverage. Trust warns when a legacy
enforcement profile has not yet generated the model and fails when a present model is
missing a required host, drops a rule, diverges on mirror targets, or no longer matches
adapter paths. The host files remain disposable generated projections; the enforcement
profile and canonical instruction source remain authoritative.

## Success Measures

Optimize for:

1. task success and acceptance-criterion coverage
2. fewer user corrections and interventions
3. faster first correct edit
4. lower irrelevant-context and repeated-command cost
5. lower scope-drift and stale-memory incidence
6. reliable resume and multi-agent integration
7. fewer false closure claims

Do not optimize for artifact, command, pack, or workflow-step counts.

## Promotion Rule

A capability belongs in Skopos core when:

1. it applies to at least two meaningfully different project types
2. it can be expressed without one project's domain terminology
3. it is proven on Skopos plus a non-Skopos project or fixture
4. it reduces supervision more than it adds workflow weight

Otherwise it remains project configuration, a reusable pack, or a project integration.
