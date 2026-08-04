---
title: Self-Hosted Derived Output Creates An Evidence Freshness Cycle
status: resolved
severity: MUST
owner: skopos-core
id: SKOPOS-F-20260804-SELF-HOSTED-DERIVED-OUTPUT-EVIDENCE-CYCLE
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-04
relatedDocs:
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../../decisions/040-project-adapted-skill-packs-as-capability-projections.md
  - ../../work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md
  - ../../architecture/evidence-and-readiness-model.md
reviewCycle: archived after the shared-derived output contract passed repeated closure proof
---

# Self-Hosted Derived Output Creates An Evidence Freshness Cycle

## Summary

The self-hosted `maintenance.refresh-knowledge` Action can succeed and still leave its
Task without valid source-bound Evidence. The Action treats the shared mutable
`.skopos/index` directory as an Evidence-owned output, while Action completion, Evidence
linking, Task updates, operational logs, and Work Queue refreshes legitimately mutate
that same derived index after finalization.

This is distinct from the historical Git-status closure-noise Finding. The current gap
is an Evidence identity cycle inside the canonical Action and Task path.

## Evidence

1. `tools/skopos/actions/maintenance-refresh-knowledge.yaml` declares
   `.skopos/index` as both output and affected workspace state.
2. Action execution finalizes Evidence, writes the run artifact and operational log,
   refreshes the knowledge index, finalizes Evidence again, rewrites the run artifact,
   and then links the run to its Task.
3. Linking and subsequent Task or queue projection updates can change the declared
   output after the last Evidence digest was captured.
4. Product UI Craft Task `T-34478f88` has repeatedly completed the refresh command but
   closure still reports that `maintenance.refresh-knowledge` lacks valid source-bound
   Evidence.

## Impact

1. A valid self-hosted maintenance Action cannot provide durable closure proof.
2. Rerunning the Action does not reliably repair the condition because the run itself
   produces later index mutations.
3. Tasks that change Skill bindings, Actions, Guards, or configuration can become
   permanently difficult to close.
4. Treating all generated output as ignorable would weaken proof and hide semantic
   projection drift.

## Required Resolution

1. Keep `.skopos/index` declared as affected derived workspace state.
2. Do not treat the entire shared mutable index as one immutable Action-owned output.
3. Introduce an explicit shared-derived output freshness contract or a stable
   compilation receipt containing source, configuration, compiler, and semantic
   projection digests.
4. Bind Evidence to semantic generated state while excluding operational projection
   churn caused by the same completed run and unrelated Tasks.
5. Do not solve the gap through later finalization alone; unrelated legitimate index
   mutations would still invalidate the output.

The accepted implementation direction is an explicit `outputExcludes` contract. The
knowledge refresh continues to own `.skopos/index`, while operationally rewritten
`memory.json`, `readiness.json`, `work-queue.json`, and the separately owned
`understanding/` subtree are excluded from its output digest. All remaining semantic
projections stay source-bound and tamper-detected.

## Exit Criteria

1. One refresh run remains valid after it is linked to its Task.
2. Closure verification can run twice without another refresh.
3. Task, Evidence, Work Queue, and operational projection churn does not invalidate the
   completed refresh.
4. A genuine declared source, configuration, compiler, or semantic projection change
   makes Evidence stale.
5. Tampering with semantic generated state is detected.

## Resolution

Skopos now supports explicit `outputExcludes` for operational descendants of a
declared output. `maintenance.refresh-knowledge` continues to bind Evidence to
`.skopos/index` while excluding only `memory.json`, `readiness.json`,
`work-queue.json`, and the separately owned `understanding/` subtree.

Focused Evidence tests passed all nine cases. The self-hosted refresh produced valid
source-bound Evidence, remained valid after Task linking, and remained valid through
two consecutive closure verifications. The same test proves a non-excluded semantic
output mutation becomes stale. Task `T-025149fe` closed with two of two required
Action runs valid, and the formerly blocked Product UI Craft Task `T-34478f88` then
passed closure twice and closed using the same reusable refresh run.

## Changelog

- `2026-08-04`: Resolved and archived after explicit operational output exclusions,
  focused semantic-tamper proof, repeated closure verification, and downstream Task
  closure succeeded.
- `2026-08-04`: Opened after repeated successful knowledge refreshes for Product UI
  Craft still produced stale closure Evidence.
