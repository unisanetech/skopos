---
title: "Decision: Compiled Reference Layer And Agent Memory Baseline"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-019
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-04-11
lastUpdated: 2026-07-29
relatedDocs:
  - ../architecture/retrieval-and-query-strategy.md
  - ../architecture/artifact-model.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
---

# Decision: Compiled Reference Layer And Agent Memory Baseline

## Changelog

- `2026-07-29`: Rebased compiled Memory on semantic documents, Scope slices, Task
  context, and source digests.

## Decision

Skopos compiles repository truth into rebuildable, provenance-aware indexes for agent
retrieval. The baseline includes:

1. workspace and Scope graph
2. semantic document catalog
3. source symbols and relationships
4. Actions, Guards, Policies, and Skills
5. Work Queue
6. current Task context selected by exact identity
7. source digests and contradictions

Canonical source remains authoritative. Generated references improve retrieval but
never replace tracked truth. Large repositories query Scope and subtree slices before
broader scans, and repeated context calls return deltas when inputs are unchanged.
