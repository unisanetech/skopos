# Skopos

**Project memory, task continuity, and trustworthy proof for coding agents.**

Skopos helps coding agents remember how your project works, continue unfinished work
safely, coordinate changes, and prove when work is actually complete.

Its knowledge lives with the repository. A new Codex session can recover the project's
rules, current work, decisions, and validation commands without rediscovering
everything from scratch. Host-neutral projections exist for Claude Code, Cursor, and
GitHub Copilot, but those hosts remain unverified until real-host proof exists.

Skopos does not replace the coding agent. The agent still reasons, writes code, chooses
tools, and talks with the developer. Skopos gives that agent a durable operating layer
for the parts that should survive beyond one chat.

> **Current status:** Skopos is pre-release and is not yet published for public use.
> The remote source passes the current cross-platform security, package, and lifecycle
> workflow, but there is no approved immutable release candidate yet. Product Interface
> Design is included under the accepted first-release boundary. Its deterministic
> selection, identity, containment, bounded-cost, packed-install, and project-binding
> checks remain required; material efficacy is explicitly unproven and is not claimed.
> Codex is the only real-host-certified adapter for the first release. Other generated
> host projections are not support or parity claims.
> See
> [Current status](#current-status) for details.

## The Problem Skopos Solves

A coding-agent conversation is temporary. A real software project is not.

Without durable project context, each new session may need to rediscover:

- how the system is designed
- which rules and conventions matter
- what someone is already changing
- why earlier decisions were made
- which commands prove a change is safe
- what still blocks the work from being called complete

That repeated discovery costs time and can lead to conflicting edits, forgotten intent,
duplicated work, and confident completion claims without reliable evidence.

Skopos stores the important parts as project truth, then gives each agent only the
context and work state it needs.

## A Simple Example

Imagine an agent is asked to add retry handling to an API client.

Without Skopos, the agent may search the whole repository, guess which package owns the
client, overlook an earlier retry decision, run a broad test suite, and leave the next
session to reconstruct what happened.

With Skopos, the workflow becomes explicit:

1. The agent loads the relevant architecture, standards, and current work.
2. It starts a Task with a goal, acceptance criterion, and owned paths.
3. Skopos warns other cooperating sessions about overlapping work.
4. Skopos recommends a proportional light, standard, or high-impact workflow and
   explains the recommendation.
5. Project-defined Actions run the correct checks for the affected area and explain
   why unrelated checks were skipped.
6. Evidence is attached to the Task's acceptance criteria.
7. Skopos reports what passed, what remains, and whether the Task is ready to close.
8. A later session can continue from the recorded Task instead of starting over.

The coding agent still implements the retry logic. Skopos keeps the work connected to
project intent and proof.

## What Skopos Provides

### Project knowledge that survives the chat

Architecture, standards, domain knowledge, decisions, findings, patterns, and
operational guidance remain normal, reviewable files in the repository. Skopos indexes
and retrieves them as scoped Project Memory.

### Work that can be continued safely

A Task records the goal, acceptance criteria, owned paths, decisions, progress, and
evidence. Plans hold longer-running direction, while the Work Queue derives the next
useful action from actual project state.

### Checks that match the change

Projects register their existing build, test, lint, generation, and verification
commands as Actions. Deterministic Guards decide which evidence is required for the
paths and Scopes a Task changes.

Skopos also explains why registered Guards and Actions were skipped. Small local work
uses a compact fast path; architecture, security, migration, release, and other
high-impact work keeps strict Evidence and snapshot requirements.

### Honest completion

Evidence is linked to acceptance criteria and the exact Task snapshot it proves.
Readiness explains what has passed and what is still blocking closure, so “done” is a
verifiable state rather than an agent's impression.

### Cooperative multi-session coordination

Skopos tracks sessions, Task reservations, owned-path claims, mutations, handoffs, and
takeovers in the local workspace. It can detect and explain likely collisions between
cooperating agents.

This coordination is intentionally reported as **cooperative**. Skopos does not prevent
someone from changing files or Git state outside its workflow, and it does not claim to
be a filesystem sandbox.

### Guided setup for real projects

For an existing project, Skopos first discovers code, documentation, instructions,
commands, CI, and conventions without rewriting them. It separates facts from
inferences, highlights contradictions and missing knowledge, and prepares a reviewable
documentation proposal. Human-authored docs change only after approval.

For a new project, it creates the minimum useful memory router and Scope registry, then
grows the structure only when the project develops real knowledge that needs a home.

## How It Works

Skopos defines one host-neutral lifecycle:

```text
Understand the project
  → start or resume a Task
  → load relevant Memory and Scope context
  → claim and perform the work
  → run the required Actions
  → capture Evidence
  → verify Readiness
  → finish or hand off
```

Behind that lifecycle, Skopos has five responsibilities:

1. **Remember** — keep durable project knowledge in tracked files.
2. **Orient** — retrieve the smallest useful context for the current session.
3. **Coordinate** — connect a Task, its owned paths, and cooperating sessions.
4. **Prove** — run project-defined checks and bind their evidence to the work.
5. **Continue** — preserve decisions and progress for closure, handoff, or recovery.

## Coding-Agent Support

Support means the real host has current Evidence for the exact setup, context,
continuation, delivery, and lifecycle capabilities Skopos claims. Generated files or
local contract tests alone do not qualify.

| Host | First-release status |
| --- | --- |
| **Codex** | Real-host certified and supported for the verified first-release lifecycle. |
| **Claude Code** | Projection available; real-host verification planned. Not yet claimed supported. |
| **Cursor** | Instruction/manual projection available; real-host verification planned. Not yet claimed supported. |
| **GitHub Copilot** | Instruction/manual projection available; real-host verification planned. Not yet claimed supported. |

The portable CLI and MCP model remains the common authority. Additional hosts can join
the supported matrix after their own real-host proof passes.

## Core Terms in Plain Language

| Term | What it means |
| --- | --- |
| **Project Memory** | Durable knowledge about how the project works and why. |
| **Scope** | A meaningful part of the project, such as an app, service, or package. |
| **Task** | One executable unit of work with a goal, acceptance criteria, and proof. |
| **Plan** | Longer-running direction that may contain several Tasks. |
| **Work Queue** | The next useful work derived from current Tasks, decisions, and blockers. |
| **Action** | A project command such as a test, build, generator, or audit. |
| **Guard** | A deterministic rule that decides which checks a change requires. |
| **Evidence** | A recorded result or observation that supports an acceptance criterion. |
| **Readiness** | An explanation of whether work can close and what still blocks it. |
| **Session** | One agent's active working context and coordination identity. |

These terms form one operating model. Skopos is the project's Memory, Task, evidence,
and closure authority; project-specific integrations contribute context, Actions, and
Guards instead of creating a second workflow.

## Try This Repository

Skopos is currently used directly from its source workspace.

### Requirements

- Node.js `^22.13.0` or `^24.0.0`
- pnpm 10.26.0

### Set up the workspace

```bash
pnpm install
pnpm build
pnpm skopos:setup
pnpm skopos:session
```

The build step comes before setup because this repository runs the local
source CLI against its internal workspace packages. The final command prints compact
session context: current work, material decisions, project health, and the recommended
next action.

To explore the visual interface during development:

```bash
pnpm skopos:ui:dev
```

Skopos has not been publicly released, so this README intentionally does not offer a
registry installation command yet.

## A Typical Agent Workflow

In an installed project, agents use `skopos` directly. In this self-hosted repository,
the package scripts wrap the local source CLI.

```bash
# Recover project and work context
skopos session context . --actor <id> --json

# Start a bounded piece of work
skopos start "<goal>" . \
  --accept "<criterion>" \
  --own <path> \
  --actor <id>

# Ask for the next useful action
skopos work next . --actor <id> --json

# Explain why checks were selected or skipped
skopos impact <changed-path> --phase closure --risk standard --why

# Expand the same Task when review discovers another required file
skopos task ownership add <task-id> \
  --own <additional-path> \
  --reason "<why this still belongs to the accepted Task>" \
  --actor <id> \
  --cwd . \
  --json

# Diagnose whether the Task has enough evidence to close
skopos verify <task-id> . --phase closure --json

# Close only after the required evidence passes
skopos finish <task-id> . --actor <id> --json
```

Use `skopos --help` for the complete CLI and `skopos <command> --help` for a command's
exact contract. Common supporting commands include `skopos setup`, `skopos knowledge`,
`skopos task show`, `skopos decide`, `skopos actions`, `skopos evidence`,
`skopos readiness`, and `skopos coordination`.

Ownership expansion is an audited change to the Task proof boundary. Skopos records
the added paths, actor, reason, and adoption-time path state, refreshes applicable
Guards and Actions, and changes the proof identity so earlier narrow proof cannot close
the wider Task. Start a follow-up Task instead when the newly discovered work changes
the goal, risk, public behavior, or proof subject.

`skopos task show` also detects changed paths outside the Task boundary and returns the
exact audited ownership command to review. The bundled read-only UI presents the same
workflow, readiness, ownership, and Evidence guidance without creating another
mutation authority.

An explicit integration or release baseline uses a stricter proof subject:

```bash
skopos start "<integration goal>" . \
  --proof-subject project-integration \
  --own <integration-path> \
  --actor <id>
```

That form is for a named integration outcome. It does not absorb unrelated dirty
working-tree changes into the proof boundary.

## Where Project Truth Lives

Human-authored truth stays in familiar tracked files:

```text
project/
├── README.md                    # human introduction
├── AGENTS.md                    # coding-agent instructions
├── skopos.config.*              # Skopos configuration
├── tools/skopos/                # Scopes, Actions, Guards, policy, and extensions
└── docs/
    ├── 00-start-here.md         # documentation router
    ├── overview.md
    ├── architecture/
    ├── standards/
    ├── decisions/
    ├── findings/
    ├── patterns/
    ├── work/                    # Plans, active Tasks, and archive
    └── scopes/                  # knowledge owned by declared Scopes
```

Only `docs/00-start-here.md` and `docs/overview.md` are universal. Other directories
exist when they own real project knowledge; Skopos does not require empty ceremony.
Large repositories can declare nested Scopes for apps, services, packages, platforms,
or other stable units.

The local `.skopos/**` directory contains rebuildable indexes, caches, session state,
coordination leases, evidence envelopes, and generated UI assets. It is ignored by Git
and must never be the only copy of durable project truth.

## What Skopos Is Not

Skopos is not:

- a replacement for a coding agent or human judgment
- a second source-control system
- a substitute for the project's tests or CI
- a cloud-only knowledge database
- a guarantee that direct, uncoordinated filesystem changes cannot happen
- a home for one adopter's private architecture or business-specific commands

Skopos core stays project-agnostic. A project keeps its own domain rules and commands;
Skopos provides the generic model that retrieves, coordinates, selects, and proves
them.

## Current Status

Skopos is **pre-release**. It has not launched or been published as a public package.

The canonical source and future release-provenance repository is
[unisanetech/skopos](https://github.com/unisanetech/skopos). Company ownership changes
governance, not the product boundary: Skopos remains standalone and project-agnostic,
with no Unisane runtime or product dependency.

The working source implements the first-release model for Project Memory, Scopes,
Plans, Tasks, Sessions, Work Queue, Actions, Guards, Evidence, Readiness, coordination,
unified setup, Skills, handoff, CLI, MCP, and UI. Release-hardening work has passed the
cross-platform Node 22/24 matrix on Ubuntu, macOS, and Windows, plus production audit,
secret scanning, license review, SBOM generation, clean packed installation, package
content, lifecycle, storage, responsive UI, and accessibility checks. These results
are strong preparation Evidence; final certification must still bind every gate to
one unchanged approved candidate.

Product Interface Design `0.5.0` has deterministic selection, exact identity,
containment, bounded-cost, external packed-install, and project-binding proof. Its
latest exact fresh smoke did not demonstrate material improvement, and no independent
blind human efficacy adjudication is complete. The accepted first-release boundary
therefore says **publishable: yes** and **efficacy-certified: no**. Release and
marketing surfaces must not claim certified efficacy. Additional efficacy work is not
a blocker for the first `next` release; broader Skill-catalog expansion remains outside
that release. See the [first public release scorecard](docs/operations/first-public-release-scorecard.md)
and [Product Interface Design efficacy Finding](docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md).

Before publication, Skopos must also configure the external npm scope, manually
approved GitHub release environment, one-time first-package bootstrap, OIDC trust, and
final clean-clone/immutable-candidate gates in the
[first public release Plan](docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md).

The first release claims Codex support only. Claude Code, Cursor, and GitHub Copilot
verification remains later support-expansion work; their projections do not imply
support or parity.

There is no prototype compatibility promise or old-state migration contract. Until the
release gate is fully accepted, APIs, commands, and project structure may still change.

## Learn More

- [Start here](docs/00-start-here.md) — the human documentation router
- [Product overview](docs/overview.md) — the canonical product boundary and model
- [Architecture](docs/architecture/00-architecture.md) — packages, runtime, and data flow
- [Agent-native operating model](docs/architecture/agent-native-operating-model.md) — how agents and Skopos divide responsibilities
- [Developer workflows](docs/guides/developer-workflows.md) — practical repository commands
- [Security policy](SECURITY.md) — private reporting and the supported security boundary
- [Support](SUPPORT.md) — where to ask for help and what information to include
- [Contributing](CONTRIBUTING.md) — setup, review, proof, and contribution expectations
- [Release and rollback runbook](docs/operations/release-runbook.md) — the fail-closed operator checklist
- [Accepted product decision](docs/decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md) — why this model exists
- [Ownership and first-release host support](docs/decisions/D-20260813-company-ownership-and-first-release-host-support-boundary.md) — repository governance and truthful compatibility claims

## Contributing

Start with the setup steps in [Try This Repository](#try-this-repository), then read
[docs/00-start-here.md](docs/00-start-here.md) before making broad changes.

Use the narrowest reliable check for the surface you change. The common repository
validation commands are:

```bash
pnpm typecheck
pnpm test
pnpm proof
pnpm release:check
```

These commands are a capability catalog, not a requirement to run every check for every
edit. Skopos Tasks and Guards select proportional evidence from the affected paths and
Scopes.

## License

Apache-2.0
