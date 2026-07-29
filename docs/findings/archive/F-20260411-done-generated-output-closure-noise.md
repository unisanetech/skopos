---
title: "F-20260411-done-generated-output-closure-noise: Done Git-Status Fallback
  Was Treating Workflow Outputs As Primary Changed Surfaces"
status: done
owner: skopos-core
id: SKOPOS-F-20260411-DONE-GENERATED-OUTPUT-CLOSURE-NOISE
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-04-12
relatedDocs:
  - ../README.md
  - ../../architecture/trust-and-closure-model.md
  - ../../scopes/skopos-verification/overview.md
reviewCycle: per workpack
---

# F-20260411-done-generated-output-closure-noise: Done Git-Status Fallback Was Treating Workflow Outputs As Primary Changed Surfaces

## Changelog

- `2026-04-12`: Closed after the repaired git-status filtering was exercised through normal self-hosted mission completion on real workspace missions, and `skopos done` completed without reclassifying refreshed `.skopos/**`, `docs/generated/**`, or instruction-mirror outputs as primary changed surfaces.
- `2026-04-11`: Opened after a real self-hosted search mission hit `skopos done` false failures because git-status fallback was counting regenerated `.skopos/**`, `docs/generated/**`, and instruction-mirror outputs as if they were primary source edits, while the required-workflow matcher also inferred `instructions.sync-mirrors` from generic docs changes.

## Summary

- Severity: `SHOULD`
- Status: `done`
- Owner: `skopos-core`
- Target Pack: `closure inference hardening`
- Current State: closed. The repaired closure path has now been exercised through normal self-hosted mission completion, and generated workflow outputs no longer block `skopos done` as primary changed surfaces.

## Symptom

1. `skopos done` in git-status mode could block closure even after the correct workflows had already run successfully.
2. Freshly regenerated `.skopos/**`, `docs/generated/**`, and instruction-mirror outputs were still being treated as changed-source evidence instead of workflow-output noise.
3. `instructions.sync-mirrors` could be inferred as a required-for-done workflow from generic docs changes, even when `AGENTS.md` and instruction-routing surfaces were untouched.

## Impact

1. Normal self-hosted completion flow could block itself after valid `maintenance.refresh-knowledge`, `graph.render-local-portal`, or `ui.build-console-app` runs.
2. Required workflow evidence could look stale purely because later generated outputs changed timestamps after the workflow already succeeded.
3. Skopos closure became too noisy to trust in the exact workflow it is meant to enforce.

## Fix Plan

1. Treat git-status fallback as a source-surface inference step, not a literal dump of every tracked generated output.
2. Ignore workflow outputs and generated roots such as `.skopos/**` and `docs/generated/**` when closure infers changed paths from git status.
3. Narrow required workflow fallback matching so generic docs changes do not automatically trigger instruction-mirror workflows unless instruction surfaces or explicit workflow inputs actually changed.
4. Keep regression coverage at the CLI closure level so future workflow changes cannot silently reintroduce the bug.

## Verification

1. `skopos done` remains `complete` after a legitimate source change followed by valid generated-output refresh flows.
2. Generic docs edits in the self-hosted workspace do not require `instructions.sync-mirrors` unless instruction-source or instruction-mirror surfaces actually changed.
3. Required workflow freshness checks continue to work for true source-input changes.

## Linked Docs

1. `../README.md`
2. `../../architecture/trust-and-closure-model.md`
3. `../../scopes/skopos-verification/overview.md`
