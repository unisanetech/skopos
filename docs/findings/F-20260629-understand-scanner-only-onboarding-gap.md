# F-20260629-understand-scanner-only-onboarding-gap: Understand Still Produces Scanner-Only Onboarding

## Metadata

- Doc ID: `SKOPOS-F-20260629-UNDERSTAND-SCANNER-ONLY-ONBOARDING-GAP`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/findings`
- Canonical: `yes`
- Last Updated: `2026-06-29`
- Review Cycle: `per workpack`
- Related Docs:
  - `registry.md`
  - `../decisions/028-initial-synthesized-repo-understanding-contract.md`
  - `../decisions/033-memory-map-and-agent-workflow-intelligence-contract.md`
  - `../decisions/035-agent-guided-project-understanding-contract.md`

## Changelog

- `2026-06-29`: Opened after the existing-project pilot showed that `skopos understand` can produce useful setup artifacts but still cannot create real product/domain/architecture understanding without an agent-guided analysis pass.

## Summary

- Severity: `MUST`
- Status: `active`
- Owner: `skopos-core`
- Target Pack: `onboarding, understanding, trust, memory`
- Current State: scanner-generated understanding exists, but it is not enough for broad agent work because it does not require agent-reviewed durable project memory.

## Symptom

1. `skopos init` detects project shape and writes setup artifacts.
2. `skopos understand` creates repo summary, feature inventory, hotspots, and setup review from bootstrap and scopes.
3. `skopos trust` can reach high after setup questions and instruction mirrors are resolved.
4. The user can still reasonably ask what the project is really about, what domains exist, which docs are canonical, and where architecture boundaries live.

## Impact

1. Skopos may look agent-ready before agents have true project context.
2. Future coding agents may still do broad repo rediscovery.
3. Users may trust scanner-generated summaries as if they were reviewed project knowledge.
4. The core Skopos promise of durable project memory remains incomplete.

## Fix Plan

1. Add an agent analysis brief artifact to `skopos understand`.
2. Show scanner limitations and required agent analysis tasks in CLI and UI.
3. Make trust warn when understanding is only brief-ready and durable project docs are missing.
4. Add a later workflow to write or map durable project understanding docs.
5. Prove the flow on a brownfield project before launch.

## Verification

1. Fresh existing-project onboarding produces `.skopos/understanding/agent-analysis-brief.json`.
2. `skopos understand` tells the agent what analysis work remains.
3. `skopos trust` warns when durable project understanding docs are missing.
4. After durable understanding docs exist, trust can classify the project as agent-reviewed.
