---
title: Storage Lifecycle And Privacy
status: active
owner: skopos-core
id: SKOPOS-STORAGE-LIFECYCLE-PRIVACY
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-09
relatedDocs:
  - artifact-model.md
  - ../guides/storage-and-privacy.md
reviewCycle: when local persistence, retention, or cleanup behavior changes
---

# Storage Lifecycle And Privacy

Skopos keeps operational state under `.skopos/`. That state can make work recoverable
and auditable, but it can also contain private project material and grow over time.
The storage lifecycle makes that trade-off visible and gives users a safe cleanup
path.

## Safety Invariant

Cleanup is a reference-aware mark-and-sweep operation:

1. classify managed storage into cleanup units
2. mark every unit protected by active work, release proof, tracked references, or a
   user pin
3. select only unprotected units that exceeded retention or must be removed to return
   below the configured soft limit
4. preview the selection by default
5. delete the exact selection only after explicit `--apply`
6. write a content-free receipt describing what happened

No hard-limit state authorizes automatic deletion. The hard limit is a visible
operator warning, not permission to remove evidence.

## Managed Classes

| Class | Typical content | Default retention |
| --- | --- | ---: |
| temporary | runtime lock units | 1 day |
| cache | indexes, graphs, generated UI, and rebuildable cache | 14 days |
| diagnostic | evaluations, sessions, handoffs, and adoption diagnostics | 30 days |
| task evidence | Task projections and Action run artifacts | 90 days |
| release evidence | explicit proof and release evidence | 365 days |
| user pinned | any managed unit protected by a named user decision | no automatic expiry |

`project.json`, the coordination database, pin records, and cleanup receipts are not
cleanup units. They are small control-plane artifacts with their own owning commands.

## Protection Sources

A managed unit is protected when any of these applies:

1. an open Task owns or references it
2. a `project-integration` Task preserves it as a release baseline
3. a running Action references its run group
4. tracked Project Memory refers to its `.skopos/` path or run id
5. a user pin intersects the unit

Path intersection protects both a referenced child and its containing cleanup unit.
Invalid pin state fails closed instead of silently discarding protection.

## Policy

Projects may configure this optional block in `skopos.config.yaml`:

```yaml
storage:
  softLimitMb: 512
  hardLimitMb: 1024
  retentionDays:
    temporary: 1
    cache: 14
    diagnostic: 30
    taskEvidence: 90
    releaseEvidence: 365
```

The hard limit must be greater than or equal to the soft limit. Retention values are
whole, non-negative days. When storage exceeds the soft limit, the oldest unprotected
units are selected in risk order: temporary, cache, diagnostic, Task evidence, then
release evidence.

## Privacy Boundary

`.skopos/` may contain project source, prompts, screenshots, traces, generated code,
provider receipts, and other private context. Users must not upload or share the
directory wholesale. Status, inspection, prune results, and receipts expose metadata
such as paths, classes, sizes, reasons, actors, and outcomes; they do not copy stored
file contents into cleanup receipts.

Skopos does not promise content-addressed deduplication in the first public release.
That optimization remains deferred until its migration, reference, and privacy
semantics can be proven without weakening this lifecycle.
