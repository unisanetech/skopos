---
title: Agent-Native Operating Model
status: active
owner: skopos-core
id: SKOPOS-AGENT-NATIVE
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-03
relatedDocs:
  - 00-architecture.md
  - artifact-model.md
  - evidence-and-readiness-model.md
  - ../standards/terminology.md
  - ../decisions/D-20260803-audited-stale-session-task-recovery.md
  - ../findings/F-20260803-session-task-recovery-and-disposition-gap.md
reviewCycle: when agent lifecycle changes
---

# Agent-Native Operating Model

Skopos gives any supported coding agent the same compact project operating contract.
Host integrations vary; project truth and lifecycle semantics do not.

## Changelog

- `2026-08-03`: Added fail-closed stale Session Task recovery with atomic resume or
  release outcomes, recovery generations, ledger summaries, and one-winner database
  arbitration.
- `2026-07-31`: Made durable Memory review visible at Task admission and explicitly
  resolvable before closure without automatic document creation.
- `2026-07-31`: Made hot-path JSON compact by default and collapsed normal Task
  closure into one `finish` operation while preserving high-impact proof.
- `2026-07-29`: Replaced prototype routing with Session-aware Task, Work Queue,
  Action, Evidence, and Readiness behavior.

## Responsibility Split

The coding agent owns:

1. reasoning and implementation
2. conversation and material user questions
3. tool selection within declared project capabilities
4. decomposition into Task steps or Child Tasks
5. inspecting and updating human-authored Memory

Skopos owns:

1. canonical Project and Scope Memory routing
2. Task intent, ownership, decisions, and continuity
3. Action and Guard discovery
4. Evidence freshness and acceptance coverage
5. Work Queue derivation
6. coordination and mutation audit
7. explainable Readiness

## Session Lifecycle

```text
session context
  -> current Task or Work Queue recommendation
  -> targeted Memory
  -> claims and mutation checkpoints
  -> Actions and Evidence
  -> checkpoint or handoff
  -> Verify and Readiness
```

`skopos session context` is the compact host entrypoint. It returns the communication
brief, actor and Session identity, current Task when unambiguous, open material
questions, next safe command, selected Scope context, and warnings. It does not replay
the full Project on every turn.

### Stale Session recovery

Lease expiry marks a writer Session stale but preserves its Task reservation, resource
claims, and mutation attribution. Recovery is performed by a different live writer
Session through one audited operation:

```text
stale reservation
  -> audit claimed paths and mutation ledger
  -> fail on contamination or open mutation
  -> atomically resume ownership or release ownership
  -> record prior/new Session, actor, generation, ledger state, reason, and outcome
```

`resume` transfers the reservation and live claims to the replacement Session while
retaining historical mutation authorship. `release` removes the reservation and
claims so Task work disposition can be decided separately. Neither outcome requires
the stale Session to execute a command, and the safe recovery operation has no force
mode. Concurrent attempts serialize through the coordination database; after one
wins, the others fail because the reservation is no longer stale-owned.

## Task Detail And Risk

Risk and detail scale one Task rather than creating different work objects:

1. `light`: goal, owned surface, acceptance, focused Evidence; may remain local
2. `standard`: tracked when it crosses Sessions or carries durable obligations
3. `high-impact`: always tracked; includes explicit sequencing, Guards, snapshots, and
   closure conditions

One Session may own at most one writing Task. One Task may have Child Tasks when work
must be separately claimable.

Admission infers Memory work proportionally:

1. ownership overlapping adopted canonical durable Memory creates a targeted open
   obligation
2. high-impact work creates a Scope-level durable Memory review obligation even for a
   source-only owned surface
3. narrow standard or light source-only work creates no obligation merely because a
   project has documentation
4. the compact Task and start response expose open obligations before implementation
5. the agent resolves each obligation after judgment with `memory-updated` or
   `reviewed-no-change`; Skopos never authors the document or the judgment itself

## Material Questions

The agent asks only when an answer changes direction, risk, policy, public behavior, or
an irreversible operation. A question contains:

1. the decision needed
2. why it matters
3. a recommended option
4. alternatives and tradeoffs
5. the default when the user has no preference

Questions belong to the Task and are persisted in its tracked portable state.

## Response Contract

User-facing responses lead with the outcome:

1. direct answer or current result
2. changed behavior
3. focused proof
4. Memory updates
5. remaining risk or next decision

Progress reports state completed work, current work, blockers, and proof still needed.
They do not expose internal ceremony or false precision.

## Context Economy

1. start from Task and Scope, not the whole repository
2. load canonical sources before generated views
3. load linked Patterns only when applicable
4. load history only when current truth is insufficient
5. return deltas after initial context
6. never inject every document, Action, Policy, or Skill by default
7. return bounded JSON by default on agent hot paths; require `--full` for detailed
   portable or diagnostic state

## Host Adapters

Claude Code, Codex, and manual adapters project the same lifecycle. They may:

1. open or heartbeat a stable Session
2. inject compact Session context
3. require Readiness before stopping a current Task
4. report their enforcement level

An adapter never invents a host-specific work model or silently claims preventive
safety.
