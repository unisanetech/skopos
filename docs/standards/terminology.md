---
title: Skopos Glossary
status: active
owner: skopos-core
id: SKOPOS-PROJECT-GLOSSARY
scope: skopos
role: standard
lifecycle: durable
authority: canonical
provenance: accepted
view: target
appliesTo:
  - workspace
lastUpdated: 2026-07-28
relatedDocs:
  - ../overview.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when a public concept changes
---

# Skopos Glossary

This is the canonical product vocabulary for docs, code, CLI, MCP, UI, schemas, and
agent prompts.

## Changelog

- `2026-07-28`: Fixed Scope kind to the exact workspace, product, application,
  service, package, domain, infrastructure, and tool set; library and minimal
  specialization remains Profile-owned.
- `2026-07-28`: Classified the canonical vocabulary as a workspace standard.
- `2026-07-28`: Replaced the prototype vocabulary with the canonical Project, Scope,
  Profile, Memory, Plan, Task, Session, Work Queue, Action, Guard, Evidence, Proof, and
  Readiness model.

## Terms

- `Project`: the repository or declared multi-root workspace Skopos operates on
- `Scope`: a stable project unit with code roots, Memory, ownership, dependencies,
  and one exact kind: workspace, product, application, service, package, domain,
  infrastructure, or tool
- `Profile`: a reusable set of Memory, Action, Guard, and Readiness requirements for a
  Scope kind
- `Memory`: durable project truth plus its provenance-aware compiled retrieval state
- `Decision`: accepted durable product or technical truth
- `Finding`: an evidenced structural risk, gap, or unresolved problem
- `Plan`: durable direction, sequencing, and rationale spanning more than one Task
- `Task`: one executable unit of intent, ownership, acceptance, and proof
- `Task step`: a bounded part of a Task
- `Child Task`: a separately ownable decomposition of a parent Task
- `Session`: one live coding-agent chat/process associated with zero or one writing Task
- `Work Queue`: the derived ordering of ready, active, blocked, and deferred work
- `Action`: a governed project capability with inputs, effects, safety, concurrency,
  and Evidence
- `Guard`: a deterministic rule that prevents an operation, requires approval, or
  requires Evidence
- `Evidence`: source-bound proof of an Action, observation, or acceptance check
- `Proof`: coverage that connects every acceptance criterion to sufficient fresh
  Evidence
- `Readiness`: the explainable answer to whether a Project or Task can safely continue,
  integrate, or close
- `Policy`: accepted reusable guidance that contributes context and Guards
- `Skill`: task-selective guidance that teaches an agent when and how to use existing
  Memory, Actions, and Guards
- `Work`: a UI umbrella for Plans, Tasks, and Work Queue; not a stored entity
- `light`: low-risk work that may remain Session-local
- `standard`: bounded work requiring proportionate tracking and proof
- `high-impact`: architecture, public API, security, migration, data, release, or broad
  work that must use a tracked Task
- `current`: implemented truth
- `target`: accepted but unimplemented truth
- `transition`: temporary implementation state with an explicit removal condition
- `exception`: approved deviation with reason, owner, and expiry

## Removed Prototype Terms

These terms are not part of the target public model:

| Removed term | Replacement |
| --- | --- |
| Mission | Task |
| Mission item | Task step |
| Mission slice | Child Task |
| Workpack | high-impact Task, or Plan when it spans Tasks |
| Program | Work Queue |
| Workflow manifest/run | Action manifest/run |
| Gate | Guard |
| Eval | Verify |
| Trust as product state | Readiness |
| Receipt as public concept | Evidence |
| normal lane | standard risk |
| workpack lane | high-impact risk |

`Workflow` remains valid ordinary language for a real user or system process documented
inside a project. It is not a Skopos executable primitive.
