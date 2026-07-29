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
lastUpdated: 2026-07-29
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
skopos actions run <action-id> . --actor <actor>
```

There is no `skopos workflows` compatibility command. Skopos has not launched, so the
pre-release cutover deletes the superseded vocabulary.

One exact Action invocation for one input state has one execution owner. A duplicate
invocation reuses valid Evidence or reports the current owner. Mutating and destructive
Actions require actor attribution; approval-sensitive Actions fail closed without
explicit approval.

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
written.

## Readiness Fit

Impact and Guards select applicable Actions from the current Task, changed paths,
affected Scopes, dependents, phase, and risk. Readiness consumes their Evidence:

```text
Task -> applicable Actions and Guards -> Evidence -> Readiness
```

Root commands are a discovery catalog, not an automatic closure checklist. Directly
changed owners may require behavior and build proof; downstream dependents normally
require compatibility type proof unless a Guard selects stronger Evidence.
