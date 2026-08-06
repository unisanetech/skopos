# Skopos

**The repo-native operating memory layer for coding agents.**

Skopos helps Codex, Claude Code, Cursor, and other coding agents understand, continue,
change, verify, and maintain a software project without losing intent or drifting from
project truth.

It works with the coding agent rather than replacing it:

- the agent reasons, edits, communicates, and chooses tools
- Skopos supplies authoritative project Memory, scoped context, Task continuity,
  project Actions, deterministic Guards, Evidence, and explainable Readiness

Skopos is project-agnostic. Unisane inspired the original problem, but Unisane-specific
architecture, commands, and gates do not belong in Skopos core.

## Pre-Release Status

Skopos has not launched. This repository implements the first-release contract directly:

- no prototype compatibility layer or old-state migration
- no overlapping work or closure authorities
- no public release until clean-clone, cross-project, package-install, and Unisane
  adoption proof pass

Start with the [accepted product decision](docs/decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md)
and [canonical convergence Plan](docs/work/plans/P-e7e888e6-canonical-product-convergence.md).

## Why Developers Use Skopos

A coding-agent chat is temporary. A real project is not.

Without a durable operating layer, every new Session must rediscover architecture,
ownership, conventions, current intent, validation, and unfinished work. Long or
parallel Sessions also lose context, duplicate work, overwrite one another, and claim
completion without stable proof.

Skopos makes those project-level concerns durable and queryable:

1. canonical, scoped Project Memory
2. agent-guided adoption and documentation restructuring
3. one Task model for executable work
4. durable Plans for multi-Task direction
5. a derived Work Queue
6. project-defined Actions selected by deterministic Guards
7. acceptance-linked Evidence and Readiness
8. safe continuation, handoff, and same-working-directory coordination

The local broker coordinates Session leases, Task reservations, resource claims,
mutation records, contamination audits, audited takeover, and immutable Task
snapshots. It reports `cooperative`: direct filesystem and Git mutations can still
bypass Skopos, so preventive safety is not claimed.

## Canonical Project Shape

Durable human and project truth stays in normal tracked files:

```txt
project/
├── README.md
├── AGENTS.md
├── skopos.config.*
├── tools/skopos/
│   ├── scopes.yaml
│   ├── profiles/
│   ├── actions/
│   ├── guards/
│   ├── policies.yaml
│   ├── skills/
│   └── extensions/
└── docs/
    ├── 00-start-here.md
    ├── overview.md
    ├── architecture/
    ├── standards/
    ├── domains/
    ├── guides/
    ├── operations/
    ├── decisions/
    ├── findings/
    ├── patterns/
    ├── work/
    │   ├── plans/
    │   ├── tasks/
    │   └── archive/
    ├── reference/
    │   └── generated/
    ├── archive/
    └── scopes/
        └── <stable-scope-id>/
```

Only `docs/00-start-here.md` and `docs/overview.md` are universal. The other families
exist only when they own real project truth. `patterns/` contains both
`preferred-pattern` and `failure-pattern` entries; there is no separate
`failure-patterns/` tree.

The tree is a standard, not empty ceremony. Nested Scopes provide the same relative
roles for monorepos, platforms, packages, services, or other project-specific units.
Their default Memory root is `docs/scopes/<stable-scope-id>/`; a project may explicitly
declare a colocated root in `tools/skopos/scopes.yaml`.

`.skopos/**` is ignored, local, generated, and rebuildable. It contains indexes,
caches, Session state, coordination leases, Evidence envelopes, and generated UI
assets—not the only copy of durable project truth. Human-facing generated reference may be tracked under
`docs/reference/generated/**`; runtime UI and machine indexes stay under `.skopos/**`.

## Existing And New Projects

For an existing project, Skopos first discovers the real code, docs, instructions,
commands, CI, and local conventions without changing them. A coding agent then analyzes
facts, inferences, contradictions, and missing knowledge. Skopos produces a reviewable
`keep`/`move`/`merge`/`split`/`rewrite`/`archive`/`delete` restructuring proposal and
changes human-authored docs only after approval. Actual existing-project init creates
the assessment artifacts automatically but does not invent `docs/00-start-here.md` or
`tools/skopos/scopes.yaml` before that review.

Mapping is an intake technique, not a permanent adopted state. Full adoption converges
the project on the Memory standard. A developer may stop at assessment-only mode, but
Skopos must report the resulting Readiness honestly.

For a new project, Skopos scaffolds the minimum useful root Memory router and declared
Scope registry, reports adoption-aware Readiness, and expands the tree only as real
Scopes and project truth emerge.

## Target Agent Lifecycle

Every supported coding-agent host projects the same lifecycle:

```txt
Session start
  → Task start or resume
  → targeted Memory and Scope context
  → claimed edits and Actions
  → checkpoint and handoff
  → snapshot verification
  → Readiness and closure
```

The primary CLI vocabulary is:

```txt
skopos adopt
skopos knowledge
skopos session context
skopos start
skopos task show
skopos work next
skopos decide
skopos actions list
skopos actions run
skopos evidence record
skopos verify
skopos readiness
skopos coordination status
```

The current coordination core is available through:

```txt
skopos coordination session open
skopos coordination session heartbeat
skopos coordination task reserve
skopos coordination claim add
skopos coordination status
```

Supported host adapters pass stable Claude Code or Codex Session identity into:

```txt
skopos session context . --actor <actor> --host <host> --session-id <id>
skopos start "<goal>" . --actor <actor> --host <host> --session-id <id> --own <path>
```

These lifecycle commands open or renew the Session, reserve one writing Task, and
publish declared owned-path claims. They report cooperative enforcement and do not
claim that direct filesystem or Git writes are prevented.

Task start defaults to the bounded `task-closure` proof subject. Use the explicit
integration form only when the requested outcome is a named integration or release
baseline:

```txt
skopos start "<integration goal>" . --proof-subject project-integration --own <integration-path> --actor <actor>
```

`project-integration` requires an owned path and creates a detailed high-impact Task.
It does not turn unrelated dirty-worktree changes into proof. Run
`skopos start --help` for the exact proof-subject contract.

## Contributing

Install dependencies:

```bash
pnpm install
```

The CLI currently requires Node.js 22.5 or newer for the local SQLite coordination
broker.

Discover current repository commands from `package.json`. Run focused proof for the
surface being changed; release proof remains blocked until the convergence Plan is
complete.

Repository orientation begins at [docs/00-start-here.md](docs/00-start-here.md).

## License

Apache-2.0
