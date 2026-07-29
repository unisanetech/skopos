---
title: P1-W9 Release-Ready Change Set Cleanup
status: historical
owner: skopos-core
id: SKOPOS-P1-W9
scope: skopos
role: task
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
lastUpdated: 2026-06-29
relatedDocs:
  - ../../00-start-here.md
  - ../../guides/bootstrap-a-project.md
  - ../../decisions/archive/034-post-init-setup-review-and-confirmed-understanding-contract.md
reviewCycle: per workpack
---

# P1-W9 Release-Ready Change Set Cleanup

Temporary execution workpack for reviewing the current mixed Skopos diff and preparing an intentional release-ready change set.

## Changelog

- `2026-06-29`: Opened after the setup-review implementation and earlier existing-project pilot fixes left one mixed workspace diff that needs explicit release cleanup before commit or publish work.
- `2026-06-29`: Archived after the cleanup review completed and remaining release work moved to the active mission/runtime artifacts.

## Temporary Status And Removal Rule

This historical execution artifact is no longer part of the active reading path. Keep only as release-prep history.

## Scope

This workpack may:

1. review the current uncommitted files
2. classify changes into intentional product/runtime/docs/test groups
3. confirm no generated local state is accidentally tracked
4. run release-relevant checks
5. prepare a clean commit summary or staged set when the user asks for commit

This workpack must not:

1. add new product behavior unrelated to release cleanup
2. rewrite the setup-review implementation
3. publish packages
4. hide unresolved validation failures

## Cleanup Checklist

- [x] Review current changed files and classify them
- [x] Verify no local generated `.skopos/**` state is tracked unexpectedly
- [x] Confirm docs, runtime, CLI, UI, and test changes belong together or identify split points
- [x] Run final validation gates after any cleanup edits
- [x] Close with commit-ready summary and remaining risks

## Change Classification

The current diff contains three intentional groups:

1. existing-project pilot hardening
   - config defaults avoid null command writes
   - scan/trust behavior stops treating first-time onboarding files as active feature drift
   - related config, trust, bootstrap docs, and e2e coverage are updated
2. post-init setup review
   - decision contract `SKOPOS-DECISION-034`
   - `skopos understand` emits setup-review state with facts, inferences, assumptions, questions, recommended actions, and next command
   - knowledge index, CLI output, UI overview, document projections, and e2e coverage are updated
3. release cleanup workpack
   - this temporary workpack records the mixed-diff review and should be archived or removed after commit preparation closes

Generated local state check:

1. no tracked `.skopos/**` files
2. no tracked `docs/generated/**` files
3. untracked files are limited to the new decision doc and this temporary workpack

Recommended commit handling:

1. either commit the two product groups together as one onboarding/understanding hardening release-prep commit
2. or split into two commits: existing-project pilot hardening first, setup-review contract/runtime/UI second

## Validation Results

Passed in this cleanup mission:

1. `git diff --check`
2. `pnpm typecheck`
3. `pnpm test`
4. `pnpm build`
5. `pnpm instructions:sync`
6. `skopos understand . --actor codex`
7. `pnpm proof`
8. `pnpm skopos:ui`

Remaining risk:

1. no npm publish or external install test was run in this cleanup mission
2. final commit split is still a release-management choice
