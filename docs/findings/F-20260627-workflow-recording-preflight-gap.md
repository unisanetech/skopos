# F-20260627-workflow-recording-preflight-gap: Cross-Cutting Agent Work Could Bypass Skopos Recording Until After Implementation

## Metadata

- Doc ID: `SKOPOS-F-20260627-WORKFLOW-RECORDING-PREFLIGHT-GAP`
- Status: `fixed`
- Owner: `skopos-core`
- Scope: `skopos/findings`
- Canonical: `yes`
- Last Updated: `2026-06-27`
- Review Cycle: `per workpack`
- Related Docs:
  - `registry.md`
  - `../decisions/032-workflow-recording-preflight-guard.md`
  - `../architecture/workflow-extension-model.md`
  - `../architecture/trust-and-closure-model.md`

## Changelog

- `2026-06-27`: Opened and fixed after Pack Gates V1 was implemented without first creating a Skopos mission, decision, or finding. The fix adds a generated workflow-recording preflight step for broad or high-risk plans and regression coverage through the CLI plan path.

## Summary

- Severity: `MUST`
- Status: `fixed`
- Owner: `skopos-core`
- Target Pack: `workflow router and durable memory`
- Current State: fixed for generated plans and missions. Skopos now adds a workflow-recording guard item when scope or risk signals show the task should not proceed as an unrecorded light edit.

## Symptom

1. An agent could implement a cross-cutting change through normal coding flow.
2. Skopos would not automatically create mission, decision, or finding records.
3. Trust and closure could warn later, but the pre-edit decision and discovery context could already be lost.
4. Users saw the dashboard missing mission/plan/decision context for real product work.

## Impact

1. durable memory could drift from actual work
2. decisions could remain trapped in chat instead of docs
3. findings could be fixed without leaving useful history
4. the Skopos UI could look empty or confusing after meaningful changes

## Fix

1. add a generated `record-workflow-lane` plan step for workspace, decision-heavy, workflow-heavy, or broad validation work
2. classify that step as workflow work in the mission checklist
3. explain that agents should keep mission/plan state current and add decisions or findings when project truth changes
4. add CLI e2e regression coverage for the generated step and mission item

## Verification

1. high-impact `skopos plan` output contains `record-workflow-lane`
2. generated missions contain `step-record-workflow-lane`
3. the mission item is classified as `workflow`
4. small/light work can still avoid extra heavy workpack ceremony when scope and risk signals do not trigger the guard

## Linked Docs

1. `registry.md`
2. `../decisions/032-workflow-recording-preflight-guard.md`
3. `../architecture/workflow-extension-model.md`
4. `../architecture/trust-and-closure-model.md`
