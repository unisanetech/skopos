---
title: Skopos Self-Hosting Mode And Compatibility Boundaries
status: accepted
owner: skopos-core
lastUpdated: 2026-06-29
---

# Skopos Self-Hosting Mode And Compatibility Boundaries

## Decision

Skopos must dogfood its own project-mode model.

For Skopos itself, the default internal mode is `clean-refactor`.

That means internal runtime, UI, docs-processing, trust, indexer, and workflow code should remove replaced patterns instead of keeping duplicate fallback systems.

Public distribution surfaces are different. The public CLI, package exports, published config formats, generated artifact schemas, and user-facing command behavior must follow compatibility discipline unless a breaking change is explicitly planned.

## Boundary Rule

| Surface | Self-hosting mode | Compatibility rule |
| --- | --- | --- |
| Internal runtime code | `clean-refactor` | Delete replaced internal patterns when touched. |
| Internal UI implementation | `clean-refactor` | Remove obsolete compatibility wrappers after the new route/component owner exists. |
| Internal docs and project memory | `clean-refactor` | Promote durable truth and archive/delete stale execution docs. |
| Public CLI commands | `brownfield-compatible` | Preserve user-facing behavior unless migration notes and versioning exist. |
| Public package exports | `brownfield-compatible` | Keep compatibility or coordinate semver-breaking removal. |
| Generated artifact schemas | `brownfield-compatible` | Version schema changes and provide migration path when needed. |
| Agent adapter contracts | `brownfield-compatible` | Keep manual fallback paths until replacement host adapters exist. |

## Fallback Policy

Fallbacks are allowed only when they have one of these reasons:

1. public compatibility
2. explicit transition from old internal pattern to new internal pattern
3. host/tool support gap
4. diagnostic recovery when primary state is missing

Each durable fallback must have:

- owner
- reason
- affected surface
- removal condition or compatibility note
- proof that it does not become the default path by accident

Internal fallback paths without a removal condition become cleanup findings.

## Why

Skopos cannot tell other projects to avoid duplicate legacy systems while keeping unmanaged fallback systems inside itself.

At the same time, Skopos already has public package and CLI surfaces. Pure greenfield deletion everywhere would be unsafe for users.

The correct rule is therefore:

- clean-refactor inside Skopos internals
- compatibility discipline at public boundaries
- explicit tracking for transitional fallbacks

## Consequences

- Skopos setup/config must eventually support a self-hosting mode distinct from the older `existing-project` lifecycle.
- Trust should eventually warn about internal fallbacks without owner/removal metadata.
- Policy packs should be able to express cleanup behavior without forcing public API breakage.
- Findings should track fallback/compatibility debt until runtime enforcement exists.

## Non-Goals

- This decision does not require immediate removal of every fallback.
- This decision does not permit breaking public CLI or package behavior without release planning.
- This decision does not make Skopos a pure greenfield project.

## Changelog

- 2026-06-29: Accepted clean-refactor self-hosting for Skopos internals and compatibility discipline for public surfaces.
