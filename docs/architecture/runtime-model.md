---
title: Skopos Runtime Model
status: active
owner: skopos-runtime
id: SKOPOS-RUNTIME-MODEL
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - 00-architecture.md
  - artifact-model.md
  - agent-native-operating-model.md
  - evidence-and-readiness-model.md
reviewCycle: when runtime orchestration changes
---

# Skopos Runtime Model

The runtime composes package-owned capabilities into application use cases. It is the
only orchestration layer; CLI, MCP, host adapters, and UI call the same runtime APIs.

## Changelog

- `2026-07-29`: Promoted the Session, Task, Work Queue, Action, Evidence, Readiness,
  adoption, and coordination use cases.

## Use Cases

1. initialize and compile Project Memory
2. assess, propose, approve, verify, and activate adoption
3. open Session context
4. create, show, claim, release, verify, and close Tasks
5. compile and query the Work Queue
6. list and run Actions
7. resolve Guards
8. record and inspect Evidence
9. compute verification and Readiness
10. coordinate Sessions, resource claims, mutations, audits, takeover, and snapshots
11. render or serve the UI projection

## Task Admission

Task start:

1. resolves Project and Scope context
2. creates the Task contract and material decision questions
3. selects candidate Actions and Evidence requirements
4. writes the tracked Task when risk requires it
5. opens or renews a Session
6. reserves the Task and claims declared resources transactionally
7. publishes local Task projections only after admission prerequisites succeed

On failure, only artifacts and reservations created by that attempt are rolled back.

## Local Reconstruction

Before current-Task or Work Queue reads, runtime reconstructs missing local projections
from tracked portable Task state. Reconstruction binds the current workspace identity,
leaves live claims unowned, and regenerates Task, question, and recommendation JSON.

## Coordination Semantics

1. stable host Session id is the live writer identity
2. actor identifies the human or agent for audit
3. one live Session owns at most one writing Task
4. overlapping resource claims fail transactionally
5. mutation begin/complete records expected and observed digests
6. unexplained changes create contamination
7. stale ownership requires audited takeover
8. high-impact closure requires a current immutable Task snapshot

The broker is cooperative unless a host hook or mediator prevents direct writes.

## Failure Semantics

1. incompatible state fails with a rebuild instruction
2. missing Task projections are reconstructed only from tracked portable authority
3. missing required Evidence blocks Readiness
4. Actions stop on first failure
5. no command silently repairs human-authored documents
6. dry-run never publishes authority
