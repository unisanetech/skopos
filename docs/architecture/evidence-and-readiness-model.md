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
lastUpdated: 2026-07-29
relatedDocs:
  - 00-architecture.md
  - action-extension-model.md
  - ../standards/validation.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
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

## Verify

`skopos verify` evaluates acceptance coverage. It does not run Actions implicitly.
For each acceptance criterion it explains:

1. required Evidence
2. Evidence found
3. freshness
4. missing or failed coverage
5. applicable Guard blockers

Verification may target iteration, stabilization, or closure. Phase selection changes
the required coverage; it does not create another work object.

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

The result is `ready`, `needs-review`, or `blocked`, with exact reasons and next safe
actions. Readiness is not a second executor and never repairs the Project silently.

## Closure

A Task can close only when:

1. every required acceptance criterion has fresh sufficient Evidence
2. no blocking Guard or decision remains
3. claimed mutations pass coordination audit
4. high-impact work has a current immutable Task snapshot
5. required Memory obligations are satisfied
6. the Task state transition is recorded

Light Tasks may use a smaller evidence set, but the report must remain honest about
what was and was not proved.

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
