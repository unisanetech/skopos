---
title: Action Extension Model
status: active
owner: skopos-core
id: SKOPOS-ARCH-ACTION-EXTENSION-MODEL
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-30
relatedDocs:
  - config-model.md
  - runtime-model.md
  - artifact-model.md
  - evidence-and-readiness-model.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
reviewCycle: when Action declaration, execution, or Evidence changes
---

# Action Extension Model

Skopos exposes project capabilities to coding agents as Actions. An Action is a
governed operation with declared inputs, outputs, safety, applicability, execution
identity, and Evidence. It prevents agents from guessing hidden shell conventions
without creating another workflow authority.

## Changelog

- `2026-07-30`: Added the reviewed capability-integration pipeline. Repository
  commands are detected only as local proposal candidates; a digest-bound approval is
  required before tracked Action/Guard declarations can be written, and activation
  fails unless every Guard has its explicit provider.
- `2026-07-30`: Removed task-goal keyword selection and policy-label command guessing.
  Tasks now derive Actions only through path-, Scope-, phase-, and risk-matched Guards.
  Policy packs reference stable Guard capability ids; projects provide the canonical
  Guard and Action declarations. Action runs remain reusable, while an explicit
  Task-owned Evidence Link associates a valid run with one Task.
- `2026-07-30`: Settled successful Action Evidence after Skopos operational logging
  and knowledge-index bookkeeping, preventing framework-managed projections from
  invalidating their producing Action immediately.
- `2026-07-29`: Renamed the internal execution contract and owners to
  `SkoposAction*` and `SkoposEvidence*`, changed generated run artifacts to
  `action-run` with `actionId` and `evidence`, and removed Workflow/Receipt aliases
  from the model, loader, matcher, runtime executor, and Evidence validator.
- `2026-07-29`: Replaced the public Workflow extension surface with Actions. Project
  declarations now live under `tools/skopos/actions/**`, the CLI uses
  `skopos actions list|show|run`, and successful execution returns source-bound
  Evidence. The old public command and declaration path are removed rather than aliased.

## Authority

Skopos has three extension primitives:

1. Context supplies project truth and Task-relevant guidance.
2. Action supplies a governed capability.
3. Guard decides whether an Action is required, prohibited, approval-sensitive, or
   sufficient for a stated Evidence obligation.

An Action cannot own Task state, decisions, Readiness, or closure. Skills and host
adapters may expose or invoke Actions but do not create another execution model.

## Declaration

Project Actions live at:

```text
tools/skopos/actions/*.yaml
```

Each declaration contains:

1. stable id, title, description, category, owner, and applicable Scopes
2. exact command and working directory
3. declared inputs, outputs, and affected paths
4. read-only, mutating, or destructive safety
5. approval requirements
6. applicable Task phases and risk levels
7. Evidence and closure applicability
8. ordering hints when one Action consumes another Action's output

The declaration path is tracked project authority. Generated runs and Evidence remain
local under `.skopos/**`.

## Execution

The public commands are:

```text
skopos actions list .
skopos actions show <action-id> .
skopos actions run <action-id> . --task <task-id> --actor <actor>
```

There is no `skopos workflows` compatibility command. Skopos has not launched, so the
pre-release cutover deletes the superseded vocabulary.

One exact Action invocation for one input state has one execution owner. A duplicate
invocation reuses valid Evidence or reports the current owner. Mutating and destructive
Actions require actor attribution; approval-sensitive Actions fail closed without
explicit approval.

Successful runs settle their final source and output state after Skopos completes its
own operational logging and knowledge-index bookkeeping. Framework bookkeeping must
not make newly produced Evidence stale.

## Evidence

Successful Action Evidence binds:

1. Action id and declaration digest
2. exact command and working directory
3. Task and Session identity when present
4. source, config, input, output, environment, and tool state
5. actor, execution owner, time, and result
6. freshness and invalidation rules

Evidence is reusable only while every declared binding remains valid. A failed,
timed-out, skipped, stale, or mismatched Action is not passing Evidence.

Generated Action runs use the `action-run` artifact kind. Their canonical identity and
proof fields are `actionId` and `evidence`; Workflow and Receipt fields are not read or
written. A reusable Action run is project-level Evidence; Task verification consumes
it only through a `task-action-evidence-link` stored in that Task's local Evidence
directory. Linking records the Task, Action, run, actor, and time without duplicating or
re-owning the immutable run.

## Policy And Project Binding

Policy packs may require stable Guard ids such as `quality.typecheck`. They do not
contain shell commands and Skopos does not infer a provider from a package script name.
The adopter explicitly declares:

```text
accepted Policy requirement
  -> project Guard with the same stable id
  -> explicit project Action id or agent-observation Evidence
```

A missing Guard declaration or referenced Action provider is a visible blocker.
Generated Guard indexes report availability for agents and UI; the tracked Guard
manifest remains the enforcement authority.

## Capability Integration

Skopos helps coding agents convert existing project commands into the canonical model
without silently promoting discovery into authority:

```text
configured command or package script
  -> local candidate proposal
  -> human/agent review of exact Action and Guard
  -> digest-bound explicit approval
  -> tracked declarations
  -> provider validation
  -> activation
```

The public workflow is:

```bash
skopos integrations propose .
skopos integrations approve . \
  --proposal <proposal-digest> \
  --accept <candidate-id> \
  --actor <actor> \
  --reason "<reason>"
skopos integrations apply . \
  --approval <approval-digest> \
  --actor <actor>
```

Proposal and approval artifacts live under `.skopos/integrations/**`; neither writes
tracked declarations. `apply` is the only integration operation that may write
`tools/skopos/actions/**` and `tools/skopos/guards/**`. It accepts only the exact
digest-bound approval, refuses to overwrite existing declarations, loads the resulting
manifests through the canonical readers, and fails activation when a Guard references
a missing Action provider.

Discovery is intentionally broad but suggestion is narrow. Package scripts and
configured commands may become candidates for any project. Skopos provides complete
automatic suggestions only for recognized general proof capabilities; unknown or
project-specific commands remain visible candidates requiring a project-authored
declaration. Detection never selects a Task Action, satisfies a Policy, or contributes
Evidence.

## Readiness Fit

Impact and Guards select applicable Actions from the current Task, changed paths,
affected Scopes, dependents, phase, and risk. Readiness consumes their Evidence:

```text
Task -> applicable Actions and Guards -> Evidence -> Readiness
```

Root commands are a discovery catalog, not an automatic closure checklist. Directly
changed owners may require behavior and build proof; downstream dependents normally
require compatibility type proof unless a Guard selects stronger Evidence.
