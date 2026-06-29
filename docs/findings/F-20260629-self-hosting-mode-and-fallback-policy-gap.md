---
title: Self-Hosting Mode And Fallback Policy Gap
status: active
severity: MUST
owner: skopos-core
lastUpdated: 2026-06-29
---

# Self-Hosting Mode And Fallback Policy Gap

## Summary

Skopos currently records itself as an existing/brownfield project, but the product direction now requires a more precise self-hosting policy.

Internal Skopos work should behave as `clean-refactor`: remove replaced internal patterns, avoid duplicate systems, and track transitional fallback paths.

Public CLI, package, schema, and adapter surfaces still need compatibility discipline.

## Evidence

- `.skopos/understanding/setup-review.json` currently reports lifecycle `brownfield`.
- `.skopos/understanding/setup-answers.json` confirms `existing-project`.
- `skopos.config.yaml` stores older `project.archetype` and repo mode fields but does not yet store the new four-mode project model.
- Search shows several intentional fallback or compatibility surfaces, including manual host fallback, static UI renderer fallback, git-status fallback, and route compatibility re-exports.

## Impact

- Skopos can tell users to avoid legacy-preserving drift while not fully enforcing the same rule on itself.
- Internal fallback systems may survive without owner, reason, or removal condition.
- Public compatibility requirements and internal cleanup requirements can be confused.
- Agents may treat all Skopos work as brownfield-preserve even when clean-refactor is the right internal behavior.

## Needed Fix

1. Add durable project-mode support to setup/config/runtime state.
2. Set Skopos self-hosting internals to `clean-refactor`.
3. Add public-boundary compatibility metadata for CLI, package exports, schemas, and adapters.
4. Inventory fallback and compatibility surfaces.
5. Require owner, reason, affected surface, and removal condition or compatibility note for durable fallbacks.
6. Make trust or policy drift warn when internal fallback paths lack that metadata.
7. Prove with a Skopos-on-Skopos cleanup pilot.

## Proof Required

- `skopos setup review` or equivalent runtime state can express Skopos self-hosting mode.
- `skopos trust` or policy drift can detect unmanaged internal fallback debt.
- At least one internal fallback or compatibility path is classified as either allowed compatibility or cleanup work.
- Public CLI compatibility remains protected.

## Changelog

- 2026-06-29: Opened after self-review showed Skopos is still recorded as brownfield/existing-project while the new mode model requires clean-refactor internals and public compatibility boundaries.
