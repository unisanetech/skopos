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
lastUpdated: 2026-08-14
relatedDocs:
  - 00-architecture.md
  - artifact-model.md
  - intelligent-project-onboarding.md
  - evidence-and-readiness-model.md
  - ../standards/terminology.md
  - ../decisions/D-20260803-audited-stale-session-task-recovery.md
  - ../decisions/D-20260803-explicit-task-work-disposition-state-machine.md
  - ../findings/archive/F-20260803-session-task-recovery-and-disposition-gap.md
  - ../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md
  - ../decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md
  - ../decisions/D-20260813-company-ownership-and-first-release-host-support-boundary.md
  - ../work/archive/P-20260805-conversation-aware-session-continuation-plan.md
reviewCycle: when agent lifecycle changes
---

# Agent-Native Operating Model

Skopos gives any supported coding agent the same compact project operating contract.
Host integrations vary; project truth and lifecycle semantics do not.

## Changelog

- `2026-08-14`: Recorded `@unisane/skopos` as the first public npm identity while
  preserving `skopos` as the executable and preserving the standalone, host-neutral
  runtime contract.
- `2026-08-13`: Separated host-neutral lifecycle projection from public support
  certification. Codex is the only real-host-certified first-release adapter; other
  projections remain unverified until their own real-host proof exists.
- `2026-08-13`: Refined the response contract into selectively transported layers,
  defined mode-specific response shapes and plain-language translation at the user
  boundary, and made response evaluation a development/release concern rather than a
  second runtime model call.
- `2026-08-12`: Added the onboarding response contract and executable agent packet.
  Setup agents explain project-specific findings, recommend defaults, ask only
  material questions, and translate natural-language choices into reviewed decisions.
- `2026-08-11`: Completed the approved Codex delivery lifecycle. The origin releases
  writing authority and becomes an explicit reviewer; the Codex adapter creates real
  child tasks only after user approval, binds returned thread identities to Skopos
  Sessions, waits for results, and falls back truthfully when host delivery is absent.
- `2026-08-11`: Implemented reviewed work splitting and linked child Tasks. Split
  proposals validate ownership partitions, dependency order, Scope selection, and
  parent acceptance mappings; exact apply creates tracked children; and `task assign`
  binds each child to one fresh or live Session without pretending to launch a host.
- `2026-08-09`: Added explainable automatic risk/detail admission, one canonical
  progressive workflow projection, dynamic unowned-path suggestions, and read-only UI
  guidance for exact next commands, ownership, Evidence, and closure.
- `2026-08-05`: Added conversation-aware fresh-session continuation to the existing
  Task handoff lifecycle. The originating agent supplies bounded semantic context,
  Skopos supplies and validates authoritative live state, and host adapters optionally
  deliver the result without acquiring host-specific workflow authority.
- `2026-08-03`: Completed recovery and disposition parity. Expired Action runs have an
  auditable interruption command, Task recovery blocks unreconciled runs, CLI and MCP
  share recovery/disposition authorities, and the read-only UI reports disposition.
- `2026-08-03`: Separated Task claim release from work disposition and added explicit
  resume, ready, defer, return-from-verification, cancel, and supersede transitions
  with auditable reasons and queue semantics.
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

### Fresh-session continuation

Fresh continuation intentionally starts a new, small-context coding Session instead
of resuming or compressing the old host conversation. Its input is the existing exact
Task handoff enriched by the originating agent's bounded conversation capsule. The
capsule carries objective, user intent, accumulated constraints, completed Session
work, stopping position, rejected approaches, uncertainty, exclusions, and the next
recommended action. It never becomes a parallel Task or Memory authority.

```text
current Session
  -> refresh checkpoint and enriched Task handoff
  -> validate budget, provenance, redaction, source identity, and coordination state
  -> transfer or release writing ownership through existing Task/Session authorities
  -> create a receiving host Session or render the manual prompt fallback
  -> reload live Session context and validate handoff freshness
  -> resume the same Task
```

A handoff that no longer matches owned source, Task revision, claims, mutation state,
policy, or Evidence is refreshable, stale, conflicted, or invalid rather than silently
trusted. Direct origin messaging is optional delivery. Task state, Evidence,
Readiness, the latest handoff, and any immutable closure snapshot remain the durable
way to discover the outcome.

### Stale Session recovery

Lease expiry marks a writer Session stale but preserves its Task reservation, resource
claims, and mutation attribution. Recovery is performed by a different live writer
Session through one audited operation:

```text
stale reservation
  -> reconcile every expired running Action
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

A Task with any `running` Action cannot recover ownership. A live actor first runs
`skopos actions recover <run-id> . --actor <id> --reason <text>`. Recovery is allowed
only after the Action Evidence lease expires; it records an auditable `interrupted`
run, releases stale scheduling ownership, and supplies the exact retry command. A live
Action lease remains protected. Open mutation-ledger entries—including a dirty
in-progress Git mutation—continue to block Task recovery after Action reconciliation.

## Task Detail And Risk

Risk and detail scale one Task rather than creating different work objects:

1. `light` projects the `fast-path`: goal, owned surface, acceptance, focused Evidence,
   no tracked Task document, no immutable snapshot, and direct `finish` closure
2. `standard` projects the `tracked` workflow when work crosses Sessions, changes
   several paths, or carries durable obligations
3. `high-impact` projects the `strict` workflow with explicit sequencing, Guards,
   durable Task state, Memory review, snapshots, and closure conditions

Admission recommends risk and detail from the goal, declared owned paths, affected
non-workspace Scopes, and proof subject. The Task preserves the recommendation,
signals, selected result, and selection source. An explicit caller override remains
visible; `project-integration` always selects detailed high-impact work even when a
lower override was requested.

The fast path is not a second Task type. It uses the same acceptance, Guard, Action,
Evidence, and Readiness authorities, so light work can expand or escalate without
losing its history. `finish` performs the verification transaction directly for light
work; standard and high-impact work keep explicit verification guidance.

One Session may own at most one writing Task. One Task may have Child Tasks when work
must be separately claimable.

### Work splitting and multi-Session assignment

Skopos never silently decomposes agent work. The agent or user authors a bounded child
specification containing a stable key, goal, owned paths, optional Scope, acceptance,
dependencies, and parent acceptance mappings. The lifecycle is:

```text
claimed parent Task
  -> validate a non-authoritative split proposal
  -> review the exact proposal digest
  -> release any live parent writer reservation
  -> apply the digest and create linked tracked children
  -> transition the originating Session to reviewer mode
  -> assign each child to a separate Session
  -> complete child proof
  -> wait for and review canonical child state
  -> derive parent acceptance and Readiness from successful children
```

Sibling child ownership must not overlap. Proposed dependency keys must exist and be
acyclic. The proposal is invalidated by any parent Task mutation before apply. Apply
uses fresh collision-resistant Task ids, writes both sides of every relationship, and
rolls back newly prepared children when the parent link cannot publish. The parent
becomes blocked and unclaimed while children execute.

Each child remains a normal Task with its own Scope, ownership, Guards, Actions,
Evidence, coordination, handoff, and closure. A child mapped to a parent acceptance
requirement satisfies that requirement only after the child reaches `complete`;
missing, active, blocked, cancelled, or superseded children block parent closure.
Child mutation synchronizes current state and actor information to the parent, and the
Work Queue continues to derive dependency blocking from canonical Task ids.

Linked child tracked documents and immutable Task snapshots are automatically
attributed to the parent integration proof. They do not require manual ownership
expansion when the parent reviews or closes. The attribution is exact by linked Task
id; artifacts from unrelated Tasks retain their existing mutation attribution or
remain external and cannot silently enter the parent proof subject.

`task assign` opens or heartbeats the named Session, enforces one writing Task for that
Session, reserves the Task, claims every declared owned resource, and publishes the
actor claim. Host adapters may create a fresh chat before calling it. Unsupported hosts
receive the exact CLI command and prompt; generated assignment is not reported as host
delivery.

For an approved Codex split, activation still only generates host-neutral assignment
instructions. The Codex adapter owns the real delivery sequence: create one task in the
same Project, inject the exact bounded prompt, bind the returned Codex thread identity
as the child's Skopos Session id, send the binding follow-up, wait for completion, and
return control to the originating reviewer. The adapter records a real delivery only
after those host calls succeed. Missing or failed capabilities preserve the exact
prompt and follow-up as a manual fallback and report the failed stage.

The originating Session does not silently become read-only or reopen as a writer. It
releases reservations and claims, completes or reconciles mutations and contamination,
and uses the audited coordination transition to enter `reviewer` mode. Session context
preserves and explains that mode. Returning to `writer` uses the same actor-bound,
live-Session transition and must pass the same no-authority/no-contamination checks
before any Task reservation or claim. CLI and MCP call the same runtime authority.

Task claim ownership and work disposition are independent. Releasing an actor claim
does not change Task state. A separate reasoned disposition operation applies one of
these transitions:

1. `ready`: active or blocked work returns to the ready queue
2. `resume`: ready or deferred work becomes active and is claimed by the actor
3. `defer`: ready, active, or blocked work becomes explicitly deferred and unclaimed
4. `return-from-verification`: verifying or ready-to-integrate work returns to active
   implementation and is claimed by the actor
5. `cancel`: nonterminal work becomes terminal cancelled work
6. `supersede`: nonterminal work becomes terminal superseded work and records one
   validated successor Task id

Every disposition records the prior and next state, actor, time, and reason. Deferred
Tasks remain visible as deferred Work Queue entries; cancelled and superseded Tasks do
not remain in the open queue. A verifying Task may release its actor claim without
leaving verification, allowing another actor to claim and continue the same proof
state.

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

Setup questions use the same communication grammar but belong to the resumable setup
workflow until their accepted outcomes are promoted to the owning tracked subsystem.
The setup agent also receives an executable packet with required reads, prior answers,
the output contract, the local submission path, allowed actions, approval boundaries,
prohibited claims, and the exact continuation step. It must not make the agent infer
Skopos's internal schema or command sequence.

Optional setup recommendations support `accept`, `edit`, `defer`, and `reject`.
Questions normally arrive one at a time; related reversible recommendations may be
grouped. The user sees evidence, a recommended answer, alternatives, trade-offs, the
effect of the answer, and the safe deferral behavior. See
[Intelligent Project Onboarding](intelligent-project-onboarding.md).

## Response Contract

The stable always-on contract is deliberately small. It tells the agent to answer
directly, use clear simple English, avoid unexplained Skopos terminology, ask only
material questions, recommend a default when asking, and never claim completion
without proof. It is projected from one canonical source into `AGENTS.md`, declared
instruction mirrors, and compact Session context; those projections do not become
independent authorities.

Session context selects one response mode and adds only the state needed for that mode:

| Mode | User-facing shape |
| --- | --- |
| `direct-answer` | answer first; include only explanation that helps the user act |
| `work-start` | intended outcome, bounded work, first meaningful step, material risk if useful |
| `progress` | completed work, current work, blockers, and proof still needed |
| `decision` | decision, recommendation, reason, alternatives, default behavior, and what follows |
| `completion` | changed behavior, focused proof, Memory updates, and remaining risk |

Empty parts are omitted. These are semantic shapes rather than mandatory headings or a
reason to expose internal ceremony. Detailed communication guidance is retrieved only
for setup, a material decision, high-risk work, closure, recovery, or handoff. Ordinary
turns do not receive the full communication brief repeatedly.

User-facing completion responses lead with the outcome:

1. direct answer or current result
2. changed behavior
3. focused proof
4. Memory updates
5. remaining risk or next decision

Progress reports state completed work, current work, blockers, and proof still needed.
They do not expose internal ceremony or false precision.

Internal state is translated at the rendering boundary. For example, an unresolved
Memory obligation is explained as the concrete project document or decision that still
needs review; the user is not expected to understand artifact ids, digests, lifecycle
states, or Skopos vocabulary to decide what happens next. Exact internal terms remain
available when requested or when they are necessary to diagnose a failure.

During setup, responses lead with the agent's plain-language project understanding,
then recommendations and reasons, then the one material decision needed, and finally
what happens next. Progress names meaningful outcomes rather than scanner counts or
artifact writes. Completion explains how future coding-agent work improved and lists
deferred or unverified lanes honestly.

## Context Economy

1. keep the stable response contract near 100–150 tokens
2. keep the ordinary mode-specific instruction near 20–80 tokens
3. target 100–250 dynamic tokens for progress and 150–350 for a material decision
4. treat the 1,200-token communication budget as a ceiling, not a per-turn target
5. inject at Session start and material state changes, not unchanged on every turn
6. start from Task and Scope, not the whole repository
7. load canonical sources before generated views
8. load linked Patterns only when applicable
9. load history only when current truth is insufficient
10. return deltas after initial context
11. never inject every document, Action, Policy, Skill, or full communication brief by
    default
12. return bounded JSON by default on agent hot paths; require `--full` for detailed
   portable or diagnostic state

Response-quality scenarios run in focused development and release evaluation. They
check answer-first ordering, plain language, terminology translation, useful defaults,
one-material-question behavior, truthful progress, and ready/blocked/deferred
distinctions. Runtime does not add an LLM judge or rewrite pass to each response.

## Host Adapters

Claude Code, Codex, and manual adapters project the same lifecycle. They may:

1. open or heartbeat a stable Session
2. inject compact Session context
3. require Readiness before stopping a current Task
4. report their enforcement level

An adapter never invents a host-specific work model or silently claims preventive
safety.

Projection is not certification. For the first public release, Codex is the only
adapter with real-host Evidence sufficient for a support claim. Claude Code, Cursor,
and GitHub Copilot projections remain available but unverified; their presence does
not imply parity or automated delivery. A host becomes supported only when current
real-host Evidence proves the exact capabilities named in that claim.

Adapters also declare whether they can create a fresh Session, inject an initial
prompt, identify or message the originating Session, detect pre-compaction, and report
completion. Unsupported capabilities fall back to a reviewed copy-and-paste prompt;
generation is never reported as delivery.

CLI and MCP expose the same runtime authorities for expired Action recovery, audited
Session Task recovery, writer/reviewer Session transition, and explicit Task
disposition. The bundled UI is a read-only projection: it reports disposition kind,
prior and next state, actor, timestamp, reason, and successor, but does not create an
alternative mutation authority.

For the current Task, the UI projects the selected workflow, admission reasons, exact
next command, Evidence requirements, and changed paths outside declared ownership.
Those paths are suggestions only. The CLI ownership command remains the mutation
authority, and high-impact work always requires explicit reviewed adoption.
