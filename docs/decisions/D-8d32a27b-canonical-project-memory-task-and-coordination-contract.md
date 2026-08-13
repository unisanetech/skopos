---
title: "Decision: Canonical Project Memory, Task, And Coordination Contract"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-D-8D32A27B
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: target
date: 2026-07-28
implementationStatus: partial
lastUpdated: 2026-08-12
relatedDocs:
  - ../domains/product/vision.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
  - ../architecture/00-architecture.md
  - ../architecture/agent-native-operating-model.md
  - ../architecture/artifact-model.md
  - ../architecture/config-model.md
  - ../architecture/docs-governance.md
  - D-20260812-intelligent-project-onboarding-contract.md
  - ../patterns/README.md
  - ../findings/archive/F-c1e8c13d-prototype-product-contract-convergence-gap.md
reviewCycle: per implementation phase
---

# Decision: Canonical Project Memory, Task, And Coordination Contract

## Changelog

- `2026-08-12`: Accepted the intelligent project onboarding decision as the clean
  user-facing refinement of agent-guided adoption. It composes Scope, Memory,
  capabilities, Policies, Skills, instructions, and host verification without adding
  a second durable authority.
- `2026-07-30`: Fixed the validation authority boundary. Goal prose and root command
  names never select proof. Tracked Guards match declared/current Task impact and
  require explicit project Actions or agent observations. Accepted Policies reference
  stable Guard ids but cannot invent commands. Reusable Action Runs enter a Task only
  through an attributable Task Evidence Link, and Verify also consumes native Project
  Memory integrity.
- `2026-07-29`: Finalized the simplification boundary: light, standard, and detailed
  are lanes of one canonical Task rather than separate Mission or Workpack lifecycle
  objects. A detailed Task preserves phases, checklist, decisions, risks, claims,
  Evidence requirements, handoff, and closure conditions. Plans coordinate multiple
  Tasks; Actions produce Evidence; Readiness is the only closure projection.
- `2026-07-29`: Connected the broker to coding-agent lifecycle: explicit Claude Code
  and Codex Session identities open or renew transactionally, coordinated Task start
  reserves the created Task and claims declared owned paths before active publication,
  and later Session context exposes that reservation without releasing it on completion
  or lease expiry.
- `2026-07-29`: Implemented the first transactional same-directory coordination
  boundary in `.skopos/coordination.sqlite`: WAL-backed Session identity and heartbeat
  leases, one-writing-Task reservations, exclusive resource claims, stale-Session
  retention, explicit Task release, an audit event table, and honest `cooperative`
  status. Mutation-ledger attribution, contamination audit, audited takeover, and
  immutable Task snapshots now extend that cooperative boundary. Hooked/mediated
  prevention and full Git temporary-index compare-and-swap remain open.
- `2026-07-28`: Defined Task activation as a fail-closed admission transaction:
  exact empty-or-populated question and recommendation projections are materialized
  before active Task authority is published.
- `2026-07-28`: Distinguished the project-level compiled Work Queue at
  `.skopos/index/work-queue.json` from exact Task-owned projections. Zero-Task routing
  may compile the Work Queue but must not create Task state or a handoff.
- `2026-07-28`: Fixed local question and recommendation projections to
  `.skopos/tasks/<worktree-id>/<task-id>/`; same-worktree Sessions are
  isolated by Task id, and no workspace-global current-task projection or fallback
  reader is part of the clean product. Handoffs use the matching
  `.skopos/handoffs/<worktree-id>/<task-id>/handoff.json` identity.
- `2026-07-28`: Bound closure Evidence and completed-Mission coverage to an exact
  relevant tracked workspace path/content-state snapshot, including deterministic
  missing/deleted entries. Filesystem mtime is never source or Evidence identity.
- `2026-07-28`: Fixed Scope kind to the exact project-generic set, required unique
  normalized canonical Memory roots, and made non-strict foreign-document records
  discovery-only rather than normal agent Memory.
- `2026-07-28`: Fixed the adopted document contract to one YAML-frontmatter grammar,
  made role placement relative to each declared Scope Memory root, and required
  fail-closed cataloging for malformed, misplaced, unknown-Scope, and duplicate-id
  records.
- `2026-07-28`: Clarified that fully adopted Scope indexes contain only declared
  registry entries; documentation roots and agent instruction files remain governed
  project surfaces rather than path-derived pseudo-Scopes.
- `2026-07-28`: Added optional Scope-relative `patterns/` Memory for reusable preferred
  and failure patterns, including lifecycle, promotion, retrieval, and metadata-derived
  indexing rules.

- `2026-07-28`: Promoted the still-valid P1-W11 behavior contracts before archive:
  phased verification, proof-floor risk, provenance promotion, relevant negative
  knowledge, exact Action/Evidence economy, bounded extensions, semantic intake
  precedence, and installed-package UI proof.

- `2026-07-28`: Accepted one clean pre-release product contract for project memory,
  documentation, Tasks, Plans, Work Queue, Actions, Guards, Evidence, Readiness,
  agent-guided adoption, and same-working-directory coordination. Rejected a versioned
  compatibility migration because Skopos has not launched.

## Context

Skopos began as an attempt to extract the useful parts of Unisane's project-specific
LLM workflow into a project-agnostic system. That origin produced valuable capabilities,
but it also carried forward concepts and assumptions that should not define the final
product:

1. `Mission`, `Workpack`, and `Program` overlap with one another and with native coding
   agent planning.
2. `Workflow`, root commands, and `Gate` packs create competing execution vocabulary.
3. strong brownfield mapping was treated as a possible permanent adoption state even
   when a project's documentation is fragmented or unreliable.
4. durable project truth and generated `.skopos/**` state have inconsistent commit and
   authority rules.
5. active state is oriented around a global current mission or worktree identity, while
   users commonly run several Codex or Claude Code sessions on the same branch and in
   the same working directory.
6. additive projections, aliases, legacy readers, and migration notes were being
   planned for public surfaces even though Skopos has not launched.

Those choices would make the first release harder to understand, less deterministic for
agents, and more expensive to maintain. A pre-release project should converge on the
correct model directly.

## Decision

Skopos is the repo-native operating memory and trust layer for coding agents.

The coding agent owns reasoning, implementation, tool choice, and conversational
coordination. Skopos owns the project-level capabilities that a chat session cannot
reliably preserve by itself:

1. authoritative and scoped project memory
2. current Task intent and ownership
3. discoverable project Actions
4. deterministic Guards and approvals
5. acceptance-linked Evidence and Readiness
6. safe continuation, handoff, and local multi-session coordination
7. agent-guided adoption that converges project documentation on one predictable
   standard

The first released Skopos contract will be implemented through a clean refactor. It is
not a versioned migration from the current internal prototype.

## Pre-Release Clean-Refactor Rule

1. Do not call the target model `v2`, `next generation`, or a compatibility migration.
2. Delete replaced internal and public prototype APIs, commands, schemas, artifacts,
   routes, labels, tests, and docs.
3. Do not add aliases, dual readers, fallback paths, deprecated exports, schema
   migrations, compatibility projections, or old-to-new command shims.
4. Generated `.skopos/**` state may be deleted and rebuilt. It is not a public data
   migration boundary.
5. Rename the owning type or export first, then use compiler and test failures to find
   and repair every usage.
6. A phase is not complete while both the old and new model remain reachable.
7. Historical rationale may remain in archive, but it must not participate in default
   retrieval, instructions, schemas, CLI help, UI navigation, or runtime behavior.
8. The first publish occurs only after the clean model and release proof pass.

## Public Product Vocabulary

The public model uses the following terms:

| Term | Meaning |
| --- | --- |
| Project | The repository or declared multi-root workspace Skopos operates on. |
| Scope | A stable project unit with code roots, memory, ownership, and dependencies. |
| Memory | Durable project truth plus compiled, provenance-aware retrieval state. |
| Plan | Durable future direction spanning more than one Task. |
| Task | One executable unit of intent, ownership, acceptance, and proof. |
| Task step | A bounded part of a Task. |
| Child Task | A separately ownable decomposition of a larger Task. |
| Session | One live coding-agent chat/process working on zero or one writing Task. |
| Work Queue | The derived ordering of ready, active, blocked, and deferred work. |
| Action | A project capability with inputs, effects, safety, concurrency, and evidence. |
| Guard | A deterministic rule that prevents, requires approval for, or demands proof of an operation. |
| Evidence | Source-bound proof that an Action, observation, or acceptance check is valid. |
| Readiness | The explainable answer to whether a project or Task is safe to continue, integrate, or close. |
| Policy | Accepted reusable project guidance that contributes context and Guards. |
| Profile | A reusable requirement set applied to a Scope kind. |
| Pattern | Reusable, contextual Memory describing a preferred approach or a recurring failure shape. |

`Work` is a human-facing umbrella for Plans, Tasks, and the Work Queue. It is not a
stored entity.

The following prototype terms are removed from the target contract:

| Prototype term | Clean replacement |
| --- | --- |
| Mission | Task |
| Mission item | Task step |
| Mission slice | Child Task |
| Workpack | Tracked Task when executable; Plan when it coordinates several Tasks |
| Program | Work Queue |
| Workflow manifest | Action manifest |
| Workflow run | Action run |
| Gate | Guard |
| Eval | Verify |
| Trust as a product noun | Readiness |
| Receipt as a public noun | Evidence; receipt remains an internal evidence envelope |
| `light`, `normal`, `workpack` lanes | `light`, `standard`, `high-impact` risk |

`Workflow` may still describe a real user or system process in project documentation.
It is not a Skopos executable primitive or control plane.

## Project Memory Standard

Every fully adopted project must converge on the Skopos project memory standard.
Skopos standardizes knowledge shape, lifecycle, authority, and retrieval. It does not
standardize the project's application source-code architecture.

### Tracked Root

The recommended tracked root is:

```text
README.md
AGENTS.md
skopos.config.yaml
tools/
└── skopos/
    ├── scopes.yaml
    ├── profiles/
    ├── actions/
    ├── guards/
    ├── policies.yaml
    ├── skills/
    └── extensions/
docs/
└── ...
```

Only surfaces that the project actually needs are created. Skopos must not scaffold
empty directories merely to make the tree look complete.

### Workspace Memory Root

The workspace memory root uses:

```text
docs/
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
└── archive/
```

Required roles are created only when the project needs them:

1. `00-start-here.md` routes humans and agents.
2. `overview.md` explains purpose, users, outcomes, and project shape.
3. `architecture/` owns durable boundaries and current architecture.
4. `standards/` owns cross-cutting implementation and quality rules.
5. `domains/` owns durable product/domain knowledge.
6. `guides/` owns reusable developer procedures.
7. `operations/` owns deployment, incident, support, and runtime operations.
8. `decisions/` owns accepted durable choices.
9. `findings/` owns open structural risks and verified gaps.
10. `patterns/` owns reusable preferred approaches and failure shapes.
11. `work/plans/` owns multi-Task direction.
12. `work/tasks/` owns tracked standard or high-impact Tasks.
13. `reference/generated/` is the only docs location for checked-in,
    human-readable generated reference.
14. `archive/` owns historical material excluded from default retrieval.

There are no hand-maintained Decision, Finding, Pattern, Plan, or Task registries.
Skopos compiles indexes from document metadata into `.skopos/**`. This removes shared
index files that become conflict hotspots when several agents work at once.

### Nested And Monorepo Memory

Large repositories use explicit hierarchical Scopes.

Each Scope declares:

1. stable id
2. kind
3. parent Scope
4. Profile
5. one canonical memory root
6. one or more code roots
7. technical dependencies
8. owners when the project uses ownership

The exact Scope kinds are `workspace`, `product`, `application`, `service`, `package`,
`domain`, `infrastructure`, and `tool`. There is one root `workspace`; every other
kind declares a parent. Public-library, internal-package, and minimal specialization
belongs to Profiles, not additional Scope-kind aliases. Two Scopes cannot own the same
normalized canonical memory root.

The workspace default is centralized memory under `docs/scopes/<scope-id>/`. A project
may deliberately colocate a Scope memory root beside its code when that materially
improves ownership, but the root must still use the same relative memory grammar.

For example:

```text
docs/scopes/platform-payments/
├── overview.md
├── architecture/
├── standards/
├── domains/
├── decisions/
├── findings/
├── patterns/
└── work/
```

The project chooses one intentional strategy for each Scope kind. Random legacy
locations are not accepted as a permanent full-adoption state.

`parent` means governance and context inheritance. `dependsOn` means technical
dependency and impact. They must not be conflated.

Documentation roots and agent instruction files are governed project surfaces, not
Scopes. Discovery may identify them during intake, but a fully adopted project's
compiled Scope index contains only entries declared by the Scope registry.

Initial reusable Profiles are:

1. `core.workspace`
2. `core.product`
3. `core.application`
4. `core.service`
5. `core.public-library`
6. `core.internal-package`
7. `core.domain`
8. `core.infrastructure`
9. `core.tool`
10. `core.minimal`

Profiles define required memory roles, default Actions, applicable Guards, and
Readiness expectations. Projects may add namespaced Profiles and roles. A project
extension cannot redefine core semantics.

### Document Metadata

Durable documents carry machine-readable metadata sufficient for deterministic
selection:

```yaml
---
title: Payments Retry Decision
status: accepted
owner: payments
id: D-<collision-resistant-id>
scope: platform-payments
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
appliesTo:
  - packages/payments/**
relatedDocs:
  - ../architecture/retry-model.md
lastUpdated: 2026-07-28
reviewCycle: when retry ownership changes
---
```

Core fields:

1. collision-resistant id; sequential global ids are not used for new documents
2. Scope and semantic role
3. lifecycle: `active`, `durable`, `historical`, or `dead`
4. authority: `canonical`, `supporting`, or `generated`
5. provenance: `declared`, `accepted`, `observed`, `inferred`, or `proposed`
6. view: `current`, `target`, `transition`, or `exception`
7. owner

`appliesTo`, `relatedDocs`, `lastUpdated`, `reviewCycle`, and Evidence references are
added when relevant. A Pattern additionally requires exact `kind` and non-empty
`appliesTo`.

YAML frontmatter is the sole adopted metadata grammar. Markdown `## Metadata` sections,
alias keys, malformed YAML, unknown Scope ids, duplicate ids, and role/path
mismatches fail strict verification and are withheld from agent Memory. Non-strict
discovery may recognize foreign metadata only as temporary intake evidence for an
approved restructuring proposal.

Current architecture docs describe implemented truth. Unimplemented direction remains
an accepted decision, Plan, or tracked Task with `view: target`; it must not masquerade
as current architecture.

### Pattern Memory

`patterns/` is an optional first-class Memory family at the workspace root and within
any declared Scope Memory root. It stores reusable contextual knowledge that is too
specific to be a universal Standard and too reusable to remain a single Finding,
Decision, or Task note.

Every Pattern has one `kind`:

1. `preferred-pattern`: a repeatable approach with context, forces, applicability
   signals, expected outcome, and known trade-offs
2. `failure-pattern`: a recurring wrong move with detection signals, failure
   mechanism, consequences, prevention, and recovery

Pattern boundaries are strict:

1. a Standard states a normative rule; a Pattern explains when and why a reusable
   approach succeeds or fails
2. a Finding records a current observed condition; it may `instantiate` a Pattern
3. a Decision accepts a choice in context; it may `adopt` a preferred Pattern or
   `address` a failure Pattern
4. a Pattern never becomes a Guard, Standard, or Decision merely through repetition

Patterns use collision-resistant `PAT-<id>` identifiers and the normal document
lifecycle, authority, provenance, view, ownership, applicability, relationship,
freshness, and Evidence fields. Pattern metadata adds `kind`. Active and durable
Patterns may be selected when the current Task, Scope, changed paths, symbols, Action,
or risk signals match their applicability. Historical Patterns are excluded from
baseline retrieval and may be loaded only by an explicit relationship or targeted
negative-knowledge query. Dead duplication is deleted.

Pattern promotion follows the normal provenance contract. An inferred or proposed
Pattern needs explicit acceptance or Evidence from accepted authority before it becomes
canonical. An observed failure Pattern needs reproducible Evidence or accepted review.
A repeatedly validated response may be promoted into a Standard, Guard, or Decision
only through that family's acceptance process; the Pattern then links to the promoted
authority instead of duplicating its normative text.

Pattern indexes are always compiled from entry metadata into `.skopos/index/**`.
`patterns/README.md` defines the family grammar but never lists entries as a manual
registry. Workspace Patterns apply across Scopes only when metadata matches. Child
Scope Patterns add or specialize context and cannot silently weaken canonical parent
Standards or Guards.

### Memory Promotion And Negative Knowledge

Provenance is enforceable behavior, not descriptive metadata:

1. `inferred` and `proposed` knowledge cannot promote themselves.
2. promotion to `accepted` requires explicit user acceptance or Evidence from an
   already accepted project authority
3. promotion to `declared` requires declared or accepted supporting truth
4. contradictory candidates remain separate until authority is resolved
5. rejected, superseded, failed, and retired approaches remain historical negative
   knowledge, normally as failure Patterns, when they can prevent a relevant Task from
   repeating known drift
6. negative knowledge is selected only when relevant to the current Task, Scope,
   symbol, Action, or decision; history is never replayed as a default reading list
7. every promotion records prior authority, new authority, actor, reason, source, and
   supporting Evidence

Archiving removes historical documents from default retrieval. It does not erase the
small, source-linked negative-knowledge records needed to prevent recurrence.

## Adoption And Documentation Restructuring

Role mapping is an intake technique, not the steady-state memory architecture.

### Adoption States

```text
uninitialized
  -> discovered
  -> agent-analysis-required
  -> questions-open
  -> restructuring-proposed
  -> restructuring
  -> standard-verified
  -> agent-ready
  -> team-ready
```

An assessment-only project may stop before `restructuring-proposed`, but Skopos must not
call it fully adopted or agent-ready.

### Existing-Project Flow

1. install or pin Skopos without changing human-authored docs
2. discover code roots, docs, instructions, commands, CI, generated outputs, and local
   conventions read-only
3. have the coding agent inspect the real project and separate observed facts,
   inference, assumptions, contradictions, and open questions
4. resolve only material ambiguity with the user
5. produce an explicit restructuring proposal using `keep`, `move`, `merge`, `split`,
   `rewrite`, `archive`, and `delete` operations
6. show the proposed target tree, link changes, canonical-role changes, and expected
   information loss or retention
7. require approval for the restructuring envelope
8. restructure human docs, update links and instructions, merge duplicated truth,
   archive history, delete dead duplication, and create genuinely missing memory
9. verify metadata, roles, Scope coverage, links, authority, freshness, and default
   retrieval
10. activate Skopos only after standard verification

The analysis agent guides the restructuring because deterministic scanning alone cannot
decide which of two contradictory documents is correct. Skopos supplies the contract,
inventory, proposal format, operations, Guards, and verification.

Skopos must never silently rewrite a project's human-authored docs. User approval is
required for a material restructuring proposal. Once approved, the result must converge
to the standard; a permanent projection manifest over a messy layout is not full
adoption.

### Discovery Semantics

Adoption discovery may read several project-local documentation sources before the
standard structure exists. It compiles one semantic document record used by both agent
retrieval and human UI.

Classification precedence is:

```text
accepted project or restructuring rule
  > explicit document metadata
  > source-relative Scope evidence and path heuristics
  > inferred defaults
```

Source-relative Scope inference is intake evidence only. It cannot become canonical
without agent review and standard verification. Any change to discovered source roots,
metadata, rules, or contents invalidates the compiled intake result.

The intake catalog and restructuring proposal may be local generated state. A checked-in
permanent path-projection manifest is not part of a fully adopted project.

### New-Project Flow

1. create the smallest workspace memory pack
2. interview the user only for product choices that change the project
3. add Scope memory as real product areas appear
4. add Plans, Decisions, Findings, and Standards only when durable truth exists
5. keep generated runtime state outside docs

## Durable And Local State

Tracked project truth includes:

1. `skopos.config.yaml`
2. `AGENTS.md`
3. Scope, Profile, Action, Guard, Policy, Skill, and extension sources under
   `tools/skopos/`
4. durable docs, Decisions, Findings, Patterns, Plans, and tracked Tasks

`.skopos/` is fully ignored, local, runtime-managed, and rebuildable:

```text
.skopos/
├── project.json
├── index/
│   └── work-queue.json
├── graph/
├── sessions/
├── tasks/
│   └── <worktree-id>/
│       └── <task-id>/
│           ├── task.json
│           ├── questions.json
│           └── recommendations.json
├── evidence/
├── handoffs/
│   └── <worktree-id>/
│       └── <task-id>/
│           └── handoff.json
├── runs/
├── ui/
├── coordination.sqlite
└── cache/
```

Rules:

1. `.skopos/**` never owns durable project truth.
2. `.skopos/**` is never committed by default.
3. no project-authored override, accepted policy, Plan, Decision, Finding, or Pattern
   lives only under `.skopos/**`.
4. local state may be deleted and rebuilt from a clean clone.
5. a clean clone reconstructs project memory, Scope graph, Patterns, Actions, Guards,
   Policies, and the Work Queue from tracked sources.
6. uncommitted execution progress cannot be reconstructed from Git; continuation
   requires a tracked Task/handoff or a pushed task snapshot.
7. human-readable generated references belong in `docs/reference/generated/`;
   Skopos UI builds and other runtime projections belong in `.skopos/`.
8. target runtime UI output exists only under `.skopos/ui/`.
9. Task-local state exists only under
   `.skopos/tasks/<worktree-id>/<task-id>/`; Task-state readers require that exact
   identity and never fall back to a workspace-global current copy.
10. a resumable handoff exists only at
    `.skopos/handoffs/<worktree-id>/<task-id>/handoff.json` for the same Task identity;
    there is no global latest-handoff alias.
11. the compiled project Work Queue may exist at `.skopos/index/work-queue.json`; it is
    not Task state and never authorizes a Program brief, question set, recommendation
    set, or handoff without an exact Task identity.

Light Tasks may remain local when one session can finish them safely. Standard Tasks
are tracked when they cross sessions, involve collaborators, or create durable
obligations. High-impact Tasks are always tracked.

## Plans, Tasks, And Work Queue

### Plan

A Plan is durable direction across several Tasks. It owns:

1. desired outcome
2. boundaries and non-goals
3. sequencing and dependencies
4. major decisions and risks
5. success measures
6. referenced Tasks

A Plan does not mirror live checklist progress. A one-to-one Plan plus Task pair is
duplication; use the Task alone.

A Plan is not directly claimable in the final product. Claim and activation apply to a
Task. The currently implemented path that creates one Mission beside every generated
Plan and later claims that Mission is transitional prototype debt; repairing its
admission invariant does not accept that coupling as target behavior.

### Task

A Task owns:

1. id and title
2. goal
3. Scope
4. acceptance criteria
5. non-goals
6. constraints
7. risk
8. parent/child relationships
9. owned paths and semantic claims
10. open decisions and blockers
11. steps
12. selected Actions and Guards
13. Evidence requirements
14. memory obligations
15. Plan references when relevant

Task lifecycle:

```text
ready
  -> active
  -> blocked
  -> verifying
  -> ready-to-integrate
  -> complete
```

Terminal alternatives are `cancelled` and `superseded`.

Local Task, open-question, and next-action projections belong to the Task, not the
workspace:

```text
.skopos/tasks/<worktree-id>/<task-id>/task.json
.skopos/tasks/<worktree-id>/<task-id>/questions.json
.skopos/tasks/<worktree-id>/<task-id>/recommendations.json
.skopos/handoffs/<worktree-id>/<task-id>/handoff.json
```

The worktree id is a filesystem namespace, not current-work authority. Multiple
Sessions in one checkout share it and remain isolated by distinct Task ids. No
root-level Task projection is written for convenience.

The transition to `active` is valid only after the exact Task-owned portable state,
question, and recommendation projections have been materialized. A Task with no open questions owns
a valid empty `questions.json`; it does not omit the artifact. Activation validates the
linked inputs and writes the dependent Task packet before publishing active authority
and success Evidence. Missing or unwritable Task state leaves the Task non-active and
fails closed. Readiness and continuation commands must not synthesize an empty artifact
from absence.

#### Task Detail Lanes

Task detail scales without introducing another lifecycle object:

1. `light` records goal, owned surface, acceptance, and focused Evidence.
2. `standard` additionally records decisions, risks, Actions, Guards, and handoff state.
3. `detailed` additionally records phases, dependencies, a full checklist, failure
   cases, rollout or migration sequencing, and explicit closure conditions.

The human-readable detailed Task document under `docs/work/tasks/**` is the workpack
experience, not a second Workpack authority. It uses the same Task id, state, claims,
steps, Evidence, and Readiness as the machine-readable Task. A Plan is optional and
exists only when durable direction coordinates more than one Task.

### Work Queue

The Work Queue is compiled, not manually maintained. It derives candidates from:

1. active and ready Tasks
2. accepted Plans
3. open Findings
4. material open questions
5. Readiness blockers
6. dependencies and explicit priority

Skopos does not invent product priority. It explains why an item is ready, blocked,
deferred, or recommended. `skopos work next` is Session-aware and never assumes one global
current Task. When no writing Task exists, the rebuildable project projection is
`.skopos/index/work-queue.json`. When an exact Task exists, Task-specific routing
remains under that Task's directory; Skopos does not dual-write it into the project
Work Queue or create Task briefs and handoffs for a zero-Task Session.

## Actions, Guards, Evidence, And Readiness

### Actions

There is one executable capability model: Action.

An Action declares:

1. stable id and kind
2. structured executor, arguments, and working directory
3. applicability by Scope, change kind, phase, and risk
4. inputs and outputs
5. read and write effects
6. safety and approval
7. concurrency class and lock keys
8. owner
9. Evidence schema and freshness

Root package scripts are discovered into the Action catalog. They are not an automatic
checklist. Project-specific commands such as Unisane generators or architecture checks
remain project Actions; Skopos core contains no Unisane paths or domain grammar.

### Extensions

Extension is an optional, bounded project integration level after automatic discovery
and tracked declarative sources are insufficient.

An extension may contribute:

1. provenance-bound Memory observations
2. detected Actions and Guards
3. Scope or Profile candidates
4. Action execution or Evidence production

An extension cannot own or mutate Plan, Task, Work Queue, decision, approval,
Readiness, or closure authority. It cannot declare its output canonical. Every
extension declares permissions, inputs, outputs, effects, source digest, and failure
behavior.

The prototype `describe` / `brief` / `verify` provider schema is not retained as a
compatibility surface. The convergence work either deletes it or rewrites its useful
authority boundary into the clean extension model with new target-owned contracts. A
broad in-process plugin SDK is outside the first release.

### Guards

Guards decide when an Action or Evidence item is required, prohibited, or approval
sensitive. An Action cannot declare itself globally `requiredForDone`.

Selection is:

```text
changed paths
  -> Scopes
  -> dependency impact
  -> change kind
  -> Profiles and Policies
  -> Guards
  -> risk and acceptance
  -> Evidence requirements
  -> applicable Actions
  -> current or stale Evidence
```

A missing Action provider is a configuration or adoption blocker. Skopos does not guess
a shell fallback.

Child Scopes may strengthen inherited Guards. They cannot silently weaken a required
parent rule. Exceptions require reason, owner, approval, and expiry.

### Evidence And Readiness

Evidence binds:

1. Task and acceptance criterion
2. exact Action or observation
3. source/config/action-definition digests
4. environment identity where relevant
5. inputs, outputs, status, and time
6. freshness and invalidation policy

Closure Evidence additionally binds the complete, deterministically ordered set of
relevant tracked workspace paths. Each path records either its exact content digest or
an explicit missing/deleted state. The set itself is part of the identity: a newly
relevant, removed, restored, or renamed path invalidates the snapshot even when every
remaining digest still matches.

One exact Action invocation for one input state has one execution owner. Concurrent
duplicates join or fail with the owning execution identity rather than running twice.
Successful Evidence may be reused only while all declared Action, source, config,
environment, input, output, and tool-version bindings remain valid.

Mutating Actions acquire their lease against the verified pre-action state and finalize
Evidence against the stable post-action state. A mutation cannot invalidate its own
Evidence merely because it produced declared outputs. High-churn generated
`.skopos/**` files invalidate Evidence only when an Action declares them as inputs.

Validation follows affected Scopes and transitive dependents. Unchanged pre-existing
dirty paths stay outside the Task proof boundary unless explicitly adopted. Checks stop
after the first failure or timeout and retain partial Evidence plus the exact remaining
work.

Guards and applicable Actions are recomputed from current Task impact. An
admission-time recommendation cannot remain mandatory after its inputs stop matching,
and satisfied bootstrap, instruction, Action, or Evidence obligations disappear from
`next` and `done`.

Verification has four distinct moments:

1. `admission`: establish intent, acceptance, claims, risk, approvals, and the initial
   proof boundary before mutation
2. `iteration`: run focused changed-scope feedback without claiming final completion
3. `stabilization`: reconcile generated outputs, integrations, dependents, and
   cross-surface consistency
4. `closure`: run the final proof floor once against the immutable Task snapshot

Risk selects the minimum closure proof floor. It does not cause final gates to run
repeatedly at every moment.

Readiness is an explainable projection over current memory, open decisions, claims,
Guards, Evidence, contamination, and integration state.

The closure pipeline has exactly one direction:

```text
Task -> applicable Actions and Guards -> source-bound Evidence -> Readiness
```

Prototype evaluation artifacts, confidence reports, work checklists, and completion
commands are deleted as overlapping authorities. Their required behavior is owned by
source-bound Evidence and Readiness.

Only closure Evidence from a stable Task snapshot can satisfy Readiness. Iteration
results guide work but cannot certify closure. The current relevant tracked path set
and every path's content digest or missing/deleted state must match that snapshot.
Filesystem mtime may be reported diagnostically but is never source, snapshot,
freshness, or Evidence identity.

## Same-Branch, Same-Working-Directory Coordination

The normal concurrency model supports multiple coding-agent tabs on the same branch and
in the same working directory. Worktrees remain optional stronger isolation, not the
default assumption.

### Identity

1. every live chat/process has a unique `sessionId`
2. every deliverable has a stable `taskId`
3. `actorId`, host, process, checkout, branch, and base revision are separate fields
4. one Task may continue across Sessions
5. one Session may have at most one writing Task
6. read-only and reviewer Sessions may observe without a writing Task
7. there is no workspace-global current Task

### Claims And Leases

The local coordination broker stores atomic state in
`.skopos/coordination.sqlite` using transactional writes and WAL mode.

Claims cover:

1. exact files
2. path patterns
3. semantic resources such as public APIs, schemas, canonical docs, generators, or
   global configuration
4. Action outputs and verification inputs
5. Git mutations

One writer owns a file. Line-level parallel editing of the same file is forbidden.
Renames claim both source and destination. Claim expansion must be checked before a new
file is touched.

A Task reservation remains until integration or explicit abandonment. A short
heartbeat lease identifies the live Session currently writing. Lease expiry marks a
Session stale; it never silently releases dirty work.

### Mutation Ledger And Dirty Attribution

Before an edit, the broker verifies the claimed path's content digest. After the edit,
it records:

1. Task
2. Session
3. path and operation
4. before and after digests
5. time

Pre-existing dirty paths are user or unattributed state until explicitly adopted.
Unclaimed changes, unexpected digest changes, and external editor changes mark a path
`contaminated`. Contamination blocks staging, verification, and closure until
reconciled.

### Git Serialization

Skopos serializes shared-index and branch mutations:

1. stage
2. commit
3. ref update
4. checkout or switch
5. pull
6. merge
7. rebase
8. reset
9. stash
10. clean

`git add .` and `git add -A` are forbidden during concurrent Tasks.

A safe Task integration flow:

1. confirm Task-owned path digests
2. create a Task-specific temporary index from the expected base
3. stage only Task-owned paths
4. create an immutable Task snapshot
5. verify the snapshot
6. advance the shared branch through a serialized compare-and-swap
7. rebase other Task baselines logically and invalidate Evidence whose inputs changed

Skopos never blindly deletes `.git/index.lock`; recovery must verify the owning process
and repository state.

### Stable Verification

Verification normally runs from a temporary checkout or container created from the
immutable Task snapshot. Live mixed-working-directory verification is trustworthy only
when the Action declares itself overlay-safe and its complete inputs exclude all other
dirty paths.

Action concurrency classes are:

1. `snapshot-read`
2. `task-local-write`
3. `workspace-exclusive`
4. `external-exclusive`

Unknown Actions default to `workspace-exclusive`.

### Crash Recovery

1. heartbeat expiry marks the Session stale
2. Task reservation and dirty ownership remain
3. recovery compares the working tree with the mutation ledger
4. matching digests allow an audited takeover
5. unexplained changes require reconciliation
6. force takeover records actor, reason, and prior holder

### Host Enforcement Levels

Skopos reports one honest enforcement level:

1. `observed`: detects changes after they happen
2. `cooperative`: the agent calls claim and checkpoint commands
3. `hooked`: host pre-tool hooks can block unauthorized writes and Git commands
4. `mediated`: all mutations and Actions pass through the broker

Only `hooked` and `mediated` may promise preventive same-directory safety. Other levels
must state that they detect conflicts rather than prevent them.

The implemented broker core reports `cooperative`. Its transactional reservation and
claim commands prevent two cooperating processes from successfully owning the same
resource, but direct filesystem or Git mutations can still bypass the broker. Skopos
therefore reports `preventiveSafety: false` until mutation hooks or mediation enforce
the claim boundary.

The implemented lifecycle binding uses the coding host's stable Session id, not actor
identity, as the live writer identity. Session context idempotently opens or heartbeats
that Session. Coordinated Task start first ensures the Session, then reserves the
created Task and claims every declared owned path in the same admission phase before
active Task publication. An admission failure releases only the reservation created
by that failed start. Task completion and heartbeat expiry never release ownership;
release remains an explicit audited lifecycle action.

### Cross-Machine Boundary

Git carries durable docs, Tasks, Plans, Actions, Guards, and task snapshots between
machines. Local Sessions, leases, claims, and mutation ledgers do not transfer.

Disconnected clones cannot provide atomic live exclusion through Git alone. An optional
remote coordination service may implement the same claim/lease protocol later. Without
it, Skopos detects cross-machine collisions after synchronization and must not claim
preventive safety.

## Agent And Host Lifecycle

Every supported host projects the same lifecycle:

1. Session start
2. Task start or resume
3. before edit or command
4. after edit or command
5. checkpoint
6. pre-compaction
7. before stop
8. Session end

At Session start Skopos loads:

1. compact root instructions
2. Session/Task state
3. Scope chain
4. targeted canonical docs
5. relevant source and relationship slices
6. history only when current truth is insufficient

After the first load, Skopos returns deltas rather than replaying the full context.
Pre-compaction and Session-end handoffs preserve accepted intent, completed work,
remaining acceptance, current claims, blockers, valid Evidence, and the next safe
action—not the raw transcript.

Minimum human and agent CLI:

1. `skopos setup`
2. `skopos knowledge`
3. `skopos session context`
4. `skopos start`
5. `skopos task show`
6. `skopos work next`
7. `skopos decide`
8. `skopos actions list`
9. `skopos actions run`
10. `skopos evidence record`
11. `skopos verify`
12. `skopos readiness`
13. `skopos coordination status`

Host-specific files are generated projections of this model. A developer should not
need to remind Codex or Claude Code to use Skopos in each chat.

## Consequences

### Positive

1. developers learn one product language
2. coding agents receive predictable memory on any fully adopted project
3. messy documentation is improved instead of permanently normalized
4. nested monorepos retain project-specific structure through Scopes and Profiles
5. `.skopos/**` becomes safely disposable
6. same-folder parallel sessions have an honest safety model
7. project-specific validation remains powerful without contaminating core
8. clean-clone recovery has a testable contract
9. the first release is not burdened by prototype compatibility
10. relevant preferred and failure knowledge can be retrieved without turning history
    into a mandatory reading list

### Costs

1. the prototype model requires a broad, coordinated rename and deletion
2. current fixtures and self-hosting state must be regenerated
3. brownfield adoption requires deliberate documentation restructuring
4. preventive coordination depends on host hooks or mediated writes
5. immutable snapshot verification adds implementation complexity

## Rejected Alternatives

1. ship the prototype and introduce the correct model later as `v2`
2. keep Mission, Workpack, Task, Plan, and Program as overlapping public entities
3. maintain command and Action models in parallel
4. let Actions decide globally that they are required for closure
5. keep strong or weak brownfield layouts indefinitely through mapping manifests
6. store durable project policy or work state inside `.skopos/**`
7. require worktrees for every parallel session
8. claim same-directory safety from mission ownership without file claims and Git
   serialization
9. hardcode Unisane docs, gates, package names, or architecture in Skopos core
10. generate manual index files that concurrent agents must edit
11. silently restructure human docs without an approved restructuring envelope
12. preserve prototype APIs because a local pre-release workspace already uses them

## Supersession

This decision replaces the target product clauses of the following prototype
decisions:

1. `archive/001-brownfield-first-proof-and-v1-scope.md`
2. `archive/002-artifact-policy-freshness-and-overrides.md`
3. `archive/007-multi-actor-mission-coordination.md`
4. `archive/018-self-hosting-workflow-contract.md`
5. `archive/020-workflow-router-questions-recommendations-and-eval-contract.md`
6. `archive/022-program-router-sequencing-and-obligation-contract.md`
7. `archive/029-policy-pack-stack-intelligence-and-memory-contract.md`
8. `archive/032-workflow-recording-preflight-guard.md`
9. `archive/033-memory-map-and-agent-workflow-intelligence-contract.md`
10. `archive/034-post-init-setup-review-and-confirmed-understanding-contract.md`
11. `archive/035-agent-guided-project-understanding-contract.md`
12. `archive/036-project-modes-and-command-guided-agent-briefs.md`
13. `archive/037-role-based-memory-and-agent-operating-layer.md`
14. `archive/038-skopos-self-hosting-mode-and-compatibility-boundaries.md`
15. `archive/039-agent-native-single-control-plane-and-project-adoption-contract.md`
16. `archive/041-semantic-document-projection-contract.md`

Those documents are historical inputs in the decision archive. They are not target
implementation authority or part of default retrieval.

Decision 040's project-adapted skill-pack principle remains valid only as a projection
into Memory, Actions, and Guards. It cannot create another Task or execution model.

## Proof Requirement

The contract is not implemented until all of the following pass:

1. a new application
2. a small public library
3. a healthy brownfield repository
4. a messy brownfield repository whose docs are restructured
5. a nested monorepo
6. a multi-root product
7. several same-branch, same-directory agent Sessions
8. Codex-to-Claude and Claude-to-Codex continuation
9. clean clone reconstruction
10. a high-impact refactor or project data migration
11. a project with generated human reference docs
12. a project with custom Actions and Guards
13. a polyrepo or explicitly linked-project scenario
14. Skopos self-hosting
15. Unisane adoption with Unisane-specific Actions and Guards outside core

The north-star measure is:

> Percentage of Tasks that a fresh supported coding-agent Session can safely continue
> and complete without the user restating project context, without known scope or
> memory drift, and with acceptance-linked Evidence.
