---
title: Evidence And Readiness Model
status: active
owner: skopos-verification
id: SKOPOS-EVIDENCE-READINESS
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-03
relatedDocs:
  - 00-architecture.md
  - action-extension-model.md
  - ../standards/validation.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../decisions/D-20260803-task-local-proof-and-project-integration-readiness-boundary.md
  - ../findings/archive/F-20260803-task-proof-boundary-and-dirty-worktree-isolation-gap.md
reviewCycle: when verification or closure behavior changes
---

# Evidence And Readiness Model

Skopos separates execution, deterministic policy, proof, and the decision to proceed:

```text
Task acceptance
  -> Guard-selected Actions
  -> source-bound Evidence
  -> Verify coverage
  -> explainable Readiness
```

## Changelog

- `2026-08-03`: Named every Task proof subject as `task-closure` or
  `project-integration`, bound it to a stable admission baseline id, attributed
  selected generator outputs, required explicit overlay-safe Action execution, and
  made immutable snapshots recursively digest directory claims.
- `2026-08-03`: Required normalized provider receipts for successful external effects
  and certified identical capability preflight through source and offline packed CLI
  hosts without persisting secret values.
- `2026-08-03`: Added portable non-Git workspace-effect snapshots and run-owned
  shared/exclusive scheduling leases with bounded stale recovery.
- `2026-08-03`: Bounded Action execution with manifest timeouts, sparse live progress,
  capped durable phase events, explicit interruption Evidence, and exact Task resume
  commands in Session Context.
- `2026-08-03`: Added one-call exact Evidence reuse. `skopos evidence reuse` validates
  all prior successful runs required by one Task, links every valid run without Action
  execution, repairs Action-step completion, and returns bounded compact outcomes plus
  a stable full report artifact.
- `2026-08-03`: Added canonical Task-local path attribution. Verification now derives
  impact only from declared ownership or digest-matched current-Task mutations while
  reporting unchanged pre-existing, other-Task, and external-unattributed paths
  separately.
- `2026-07-31`: Added one-command Task finish, compact-default proof transport,
  canonical active/archive Task-projection exclusion, and declared Action source
  exclusions for noisy directory inputs.
- `2026-07-30`: Prevented Skopos-managed tracked Task projection rewrites from
  self-invalidating Task-bound Action Evidence while retaining every other declared
  project input as a freshness dependency.
- `2026-07-30`: Required explicit Task Action Evidence Links for reusable Action Runs
  and added native Project Memory integrity to Task verification blockers.
- `2026-07-29`: Replaced overlapping validation and closure authorities with one
  Action, Guard, Evidence, Verify, and Readiness model.

## Evidence

Evidence is an immutable envelope around an observed result. It records:

1. Task and acceptance criterion
2. Action or observation that produced it
3. command, inputs, outputs, and exit state
4. source and configuration digests
5. actor, Session, timestamp, and environment
6. phase and applicable Guard decisions

Evidence becomes stale when a declared source, configuration, command, or relevant
dependency changes. A prior success is reusable only while those bindings remain
equal.

An Action Run is reusable project-level Evidence. A Task consumes it only through an
explicit Task Action Evidence Link stored under that Task's local Evidence directory.
The link records Task id, Action id, run id, actor, and link time. This separates honest
cross-Task Evidence reuse from accidental global-run leakage.

The public batch operation is:

```text
skopos evidence reuse <task-id> . --actor <actor> --json
```

It considers only the Task's selected Actions and never invokes an Action command.
Each selected Action receives one deterministic outcome:

1. `linked`: a valid prior Run was linked and its Task Action step completed
2. `already-linked`: the same valid Run was already linked; step completion is
   reconciled idempotently
3. `rejected`: successful Runs exist but current source-bound validation rejects them
4. `missing`: no successful Run or declared Action provider exists

The operation writes the complete outcome report under the Task's local directory.
Compact output keeps counts and unresolved outcomes inline, caps the inline unresolved
collection, and returns the report path for complete retrieval. It reports an explicit
zero Action-process execution count so reuse is not confused with rerunning proof.

When an Action is executed or validated for a Task, Skopos excludes that Task's
canonical active and archived tracked-document projection paths from the Action source
digest. Skopos state transitions, archival, or formatting of that projection therefore
cannot force the same project Action to run again. Standalone Action Evidence does not
receive this exclusion, and changes to every other declared input still invalidate
Evidence normally. Action manifests may additionally declare `sourceExcludes` for
known unrelated generated or volatile descendants of a necessary directory input;
exact durable inputs remain preferred.

### Progress and interruption Evidence

Every loaded Action has a positive timeout; manifests may override the default
`900000ms` boundary. Execution emits phase transitions immediately and at most one
heartbeat every 30 seconds while the command remains active. The run artifact retains
only the latest 12 events while preserving the total event count, so live supervision
does not create an unbounded agent payload.

Progress has four canonical phases: `admission`, `preflight`, `execution`, and
`finalization`. A timeout terminates the process group, records the run as
`interrupted`, and preserves completed, failed, interrupted, and remaining phase sets.
For Task-bound runs it also records the exact `skopos actions run` command required to
retry the same Action. Session Context prefers that command while the interrupted run
is the latest run for a still-selected Action; a later successful or failed run
supersedes the stale interruption.

JSON commands keep their final machine-readable result on stdout. Sparse progress is
written to stderr as structured `action-progress` lines, preserving JSON parsing while
still giving hosts observable forward motion.

Action admission also acquires a scheduling lease. Shared leases may coexist, while an
exclusive lease conflicts with every other active Action lease. The lease binds Action,
run, actor, concurrency mode, and an expiry beyond the Action timeout. The short
admission mutex prevents check-then-create races; stale run leases are removed before
admission and live leases are released after both successful and failed execution.

Workspace-effect Evidence is portable across adopted Git and non-Git projects. Git
status supplies the narrow path set when available; otherwise Skopos snapshots every
workspace file except `.git`, `.skopos`, and `node_modules` trees and applies the same
`none` or declared `affects` boundary.

Successful external-effect Evidence additionally binds a normalized provider receipt.
The receipt identifies one declared service, operation, provider request, success
status, occurrence time, and run-owned receipt path. Receipt absence or mismatch is an
effect violation. Provider receipt content is allowlisted before it enters the Action
Run, and secret capability values are never copied into runs or Evidence. Capability
preflight occurs before Evidence reuse, so a run produced on an available host cannot
be reused when the current host lacks its declared network, browser, tool, secret, or
service requirements.

## Verify

`skopos verify` evaluates acceptance coverage. It does not run Actions or mutate
Evidence Links implicitly. Exact reuse remains an explicit bounded operation so Verify
retains deterministic read-only authority.
For each acceptance criterion it explains:

1. required Evidence
2. Evidence found
3. freshness
4. missing or failed coverage
5. applicable Guard blockers
6. native Project Memory integrity issues

Verification may target iteration, stabilization, or closure. Phase selection changes
the required coverage; it does not create another work object.

### Task-local proof attribution

Before Guard and Action selection, Task verification classifies each live changed
path into one of five kinds:

1. `task-owned`: the path is inside the Task's declared ownership
2. `task-attributed`: the latest post-admission coordination mutation is owned by the
   current Task and its recorded digest equals the live digest, or the path is an
   output of a generator selected by the Task
3. `pre-existing`: the live digest still equals the admission baseline
4. `other-task`: the latest digest-matched mutation belongs to another Task
5. `external-unattributed`: the live path changed after admission without a matching
   Task attribution

Only `task-owned` and `task-attributed` paths seed Task impact. The other classes are
not discarded: detailed verification retains every classified path and its stable
reason, while compact agent output exposes counts. A stale mutation cannot claim a
later edit because attribution is accepted only when its recorded after-digest equals
the live path digest.

Declared ownership wins for overlapping paths because overlap is governed by
coordination claims and contamination audit. A Task that intentionally adopts an
existing dirty path therefore receives that path in its proof subject; conflicting
ownership remains a coordination failure rather than being hidden as other work.

Every Task and its Verification and Readiness artifacts name one proof subject and a
stable admission `baselineId`. `task-closure` is the default proportional subject.
`project-integration` must be requested explicitly, must own at least one integration
surface, and is always detailed high-impact work. The same path attribution and
Action-selection machinery applies; declaring the integration surface intentionally
brings its pre-existing changes and affected Scope dependents into proof.

## Readiness

Readiness answers one explicit question:

- can this Task continue?
- can it integrate?
- can it close?
- is this Project adopted and agent-ready?

A Readiness report is derived, explainable, and non-mutating. It combines:

1. Task state and unresolved decisions
2. acceptance-linked verification
3. Guard outcomes and required approvals
4. coordination contamination and mutation audit
5. instruction and Memory integrity when applicable
6. adoption state when Project readiness is requested
7. open Task Memory obligations and their recorded resolutions
8. the named proof subject and immutable admission baseline identity

The result is `ready`, `needs-review`, or `blocked`, with exact reasons and next safe
actions. Readiness is not a second executor and never repairs the Project silently.

## Closure

A Task can close only when:

1. every required acceptance criterion has fresh sufficient Evidence
2. no blocking Guard or decision remains
3. claimed mutations pass coordination audit
4. high-impact work has a current immutable Task snapshot
5. every required Memory obligation records either `memory-updated` against adopted
   canonical durable Memory or a reasoned `reviewed-no-change` resolution
6. the Task state transition is recorded

Immutable Task snapshots include exact-path claims and recursive directory claims.
Directory digests exclude only Skopos/Git runtime state and dependency-install trees;
any owned source descendant change makes the snapshot stale. When more than one
snapshot exists, Readiness selects the newest by `createdAt`, never by digest-derived
filename ordering. The current Task's generated tracked projection and snapshot files
are excluded from its own directory digests, so verification and the closure state
transition cannot invalidate proof; project source and other Tasks remain included.

Light Tasks may use a smaller evidence set, but the report must remain honest about
what was and was not proved.

`skopos finish` is the canonical closure transaction. It evaluates closure Evidence
before state mutation, refuses to advance Tasks with unfinished implementation steps,
performs the verification/integration/complete transitions, archives the tracked Task
projection, and re-evaluates final Readiness. High-impact snapshot requirements are not
weakened by this convenience surface.

## Validation Economy

1. select Actions from Task-owned paths, Scope, phase, and risk
2. run the narrowest sufficient Action first
3. stop at the first failing Action and fix that failure class
4. reuse fresh source-bound Evidence
5. run broad release proof once after coherent affected-scope proof passes
6. never turn a root command catalog into a mandatory checklist

## Boundaries

1. Actions execute; Guards constrain; Evidence records; Verify covers; Readiness
   explains.
2. Project scripts remain project-owned Actions.
3. Coding agents may reason about risk, but deterministic policy is Guard-owned.
4. Direct filesystem mutations outside cooperative coordination can reduce Readiness;
   Skopos does not claim they were prevented.
