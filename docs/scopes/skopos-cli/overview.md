---
title: "Scope: CLI"
status: active
owner: skopos-core
id: SKOPOS-SCOPE-CLI
scope: skopos-cli
role: overview
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - ../../architecture/runtime-model.md
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
reviewCycle: when CLI ownership changes
---

# Scope: CLI

The CLI is a thin human and coding-agent adapter over canonical runtime use cases.

## Changelog

- `2026-07-29`: Promoted the canonical first-release command surface.

## Primary Commands

1. `skopos init`
2. `skopos adopt`
3. `skopos knowledge`
4. `skopos session context`
5. `skopos start`
6. `skopos task`
7. `skopos work`
8. `skopos decide`
9. `skopos actions`
10. `skopos guards`
11. `skopos evidence`
12. `skopos verify`
13. `skopos readiness`
14. `skopos coordination`
15. `skopos instructions`
16. `skopos ui`

## Rules

1. parse and validate input, then call runtime
2. provide equivalent structured JSON and concise human output
3. explain writes, approvals, blockers, and next safe actions
4. carry actor, Session, Task, and approval context to mutations
5. do not own Project, Task, Action, Guard, Evidence, or Readiness semantics
6. do not expose prototype aliases or fallback schemas
