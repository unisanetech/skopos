---
title: "Scope: UI"
status: active
owner: skopos-core
id: SKOPOS-SCOPE-UI
scope: skopos-ui
role: overview
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - ../../architecture/docs-governance.md
  - ../../architecture/evidence-and-readiness-model.md
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
reviewCycle: when UI ownership changes
---

# Scope: UI

The UI is an internal human projection over canonical Project Memory and runtime state.

## Changelog

- `2026-07-29`: Converged navigation and state on Plans, Tasks, Work Queue, Actions,
  Evidence, and Readiness.

## Owns

1. routed local application shell
2. Project, Scope, Plan, Task, Work Queue, Action, Evidence, and Readiness views
3. semantic document reading and search
4. filtered high-signal graph views
5. live and snapshot serving

## Rules

1. UI state is derived; it never becomes another authority
2. document views use the semantic document catalog
3. Task views resolve exact Task-owned paths
4. archive and generated reference are excluded by default
5. runtime assets live only under `.skopos/ui/**`
6. raw JSON remains available as secondary disclosure, not the main experience
7. human labels use canonical product vocabulary
