---
title: "Failure Pattern: Timestamp-Based Freshness For Content-Derived Projections"
status: active
owner: skopos-core
id: PAT-f5a79ee3
scope: skopos
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: accepted
view: current
appliesTo:
  - generated-artifacts
  - policy
  - freshness
  - trust
  - cache-invalidation
  - source-dependencies
  - closure-evidence
  - mission-closure
  - completed-mission-coverage
  - tracked-path-snapshots
lastUpdated: 2026-07-28
relatedDocs:
  - ../architecture/artifact-model.md
  - ../architecture/evidence-and-readiness-model.md
  - ../work/archive/T-62a045f9-project-memory-self-adoption.md
reviewCycle: when projection freshness or source identity changes
---

# Failure Pattern: Timestamp-Based Freshness For Content-Derived Projections

## Changelog

- `2026-07-28`: Extended the Pattern to closure-eval snapshots and completed-Mission
  coverage. Closure now requires exact relevant tracked path-set and content-state
  equality, including deterministic missing/deleted state, without mtime identity.

- `2026-07-28`: Accepted the self-invalidating Policy projection failure as durable
  negative knowledge and replaced timestamp comparison with content dependencies.

## Failure Shape

A generated projection is derived from tracked source content, but its freshness check
compares filesystem modification times instead of the source bytes used to build it.
The projection can become stale immediately when a command timestamps the artifact
before finishing its source write. Conversely, changed content can look fresh when a
tool preserves or restores the previous modification time.

Skopos instantiated this Pattern when `policies apply` captured one logical timestamp,
wrote `tools/skopos/policies.yaml`, and then gave the resolved Policy projection the
earlier timestamp. Trust correctly blocked closure, but repeating apply could reproduce
the same warning because the source write was naturally a few milliseconds newer.

The same failure shape applies to closure coverage. A closure eval that records only
timestamps, only the paths present at evaluation time, or only a partial changed-path
list can falsely treat a completed Mission as covering later content changes, newly
relevant paths, deletions, or restored files.

## Detection Signals

1. a generator succeeds and its output is immediately reported stale
2. rerunning the owning command produces the same freshness warning
3. freshness changes when only file timestamps change
4. content can change without invalidation after an mtime-preserving copy or restore
5. a projection lists source paths but records no content identity for them
6. completed-Mission coverage passes after a relevant tracked path is added, removed,
   restored, renamed, or edited without a new closure eval
7. missing or deleted inputs disappear from the closure snapshot instead of remaining
   as deterministic state entries

## Why It Fails

1. modification time describes a filesystem event, not source identity
2. write ordering and timestamp precision differ across filesystems and machines
3. clock skew can create false freshness or false staleness
4. same-mtime edits are invisible
5. self-invalidating generators prevent evidence-backed closure
6. subset-only path comparison cannot detect a newly relevant or silently omitted path
7. absence without an explicit state cannot distinguish verified deletion from an
   incomplete snapshot

## Prevention

1. record an explicit dependency for every tracked source used by a trusted projection
2. bind each dependency to a deterministic content digest and semantic kind
3. hash the proposed canonical content for dry-run projections
4. hash the actual persisted bytes for real projections
5. make Trust recompute dependencies and report the exact changed or missing paths
6. test both immediate generation and content mutation with the original mtime restored
7. make closure eval record the complete, deterministically ordered relevant tracked
   workspace path set
8. encode each closure path as present with a content digest or as explicitly
   missing/deleted
9. require exact path-set and per-path state equality before completed-Mission coverage
   passes

## Recovery

1. remove timestamp-based source identity from the projection contract
2. regenerate the projection with content-bound dependencies
3. verify an unchanged source passes immediately
4. mutate each source family independently and confirm Trust invalidates it
5. refresh the projection through its owning command and rerun closure
6. add, remove, restore, rename, and edit relevant tracked paths and confirm each change
   invalidates completed-Mission coverage
7. rerun closure eval and verify the new exact path/content-state snapshot restores
   coverage

## Retrieval

Retrieve this Pattern for Tasks involving generated artifacts, Policy or Skill
projections, caches, indexes, receipts, freshness, Trust, mission closure,
completed-Mission coverage, tracked-path snapshots, or cross-machine reproducibility.
Do not inject it into unrelated product behavior work.
