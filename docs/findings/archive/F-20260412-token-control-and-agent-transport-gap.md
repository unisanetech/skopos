---
title: "F-20260412-token-control-and-agent-transport-gap: Canonical Artifacts
  Are Rich, But Agent Transport Is Still Too Expensive"
status: fixed
owner: skopos-core
id: SKOPOS-F-20260412-TOKEN-CONTROL-AGENT-TRANSPORT-GAP
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-06-26
relatedDocs:
  - ../README.md
  - ../../architecture/artifact-model.md
  - ../../architecture/retrieval-and-query-strategy.md
  - ../../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md
  - ../../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md
reviewCycle: per workpack
---

# F-20260412-token-control-and-agent-transport-gap: Canonical Artifacts Are Rich, But Agent Transport Is Still Too Expensive

## Changelog

- `2026-06-26`: Closed after compact eval output was tightened back under budget and every shared compact CLI JSON projection began reporting estimated response tokens, the compact budget, and whether the response is over budget; compact human output now warns only when it exceeds the same budget. Future host-cache or retrieval refinements should be tracked as new, narrower findings if they become blocking.
- `2026-04-17`: Tightened the default search lane so historical docs are now excluded from normal search results unless the query explicitly asks for archive or historical material, reducing one more source of hot-path retrieval noise beyond the first discovered-doc exclusion.
- `2026-04-13`: Landed runtime-managed handoff and telemetry artifacts, so Skopos now writes `.skopos/discussions/handoffs/latest-workflow.json` as the compact cross-thread resume surface and `.skopos/agent/token-telemetry.json` as a separate diagnosis artifact for budget pressure across the hot-path briefs and combined resume context; the finding remains open for broader command-output telemetry, cache-aware host integration, and more complete lane minimization.
- `2026-04-12`: Landed the first prompt-layering and token-telemetry slice, so Skopos now generates `.skopos/agent/prompt-brief.json` with stable-prefix versus dynamic-tail guidance and budget measurements for the hot-path briefs plus default resume context; the finding remains open for broader command-output telemetry, handoff artifacts, and cache-aware host integration.
- `2026-04-12`: Expanded smallest-sufficient validation lanes so workspace-scoped plans can still narrow to one package when the goal clearly names it and impact reports do the same when explicit changed paths stay inside one package; the finding remains open for broader lane policy beyond single-package inference, prompt layering, and token telemetry.
- `2026-04-12`: Landed the first compact background-execution slice for long-running eval jobs, so `skopos eval --background` now queues durable job artifacts under `.skopos/jobs/*.json` and `skopos jobs show ... --compact --json` becomes the default compact polling path; the finding remains open for broader validation-lane policy, prompt layering, and token telemetry.
- `2026-04-12`: Tightened persisted shell-output excerpts for eval and workflow artifacts, so canonical runtime artifacts now store compact normalized excerpts instead of raw 4k command tails; the finding remains open for broader lane policy, compact background execution, prompt layering, and token telemetry.
- `2026-04-12`: Expanded the runtime-managed agent brief layer with mission-state projections under `.skopos/agent/missions/**`, so active mission routing can load a compact mission brief instead of reopening the full mission artifact by default; the finding remains open for broader lane policy, background execution, prompt layering, and token telemetry.
- `2026-04-12`: Expanded the first smallest-sufficient validation-lane slice so explicit docs-only goals now suppress broad plan validation commands and changed-path-aware impact reports suppress runtime validation for docs, instruction, and generated-only surfaces; the finding remains open for broader lane policy beyond docs/package narrowing, background execution, prompt layering, and token telemetry.
- `2026-04-12`: Landed the first smallest-sufficient validation-lane slice, so package-scoped plans now narrow `recommendedChecks` to package-local `pnpm --filter <package> <script>` commands when compatible scripts exist and keep the workspace lane otherwise; the finding remains open for broader validation-lane policy, background execution, prompt layering, and token telemetry.
- `2026-04-12`: Landed the first docs lifecycle filter in the routed console, so archive docs no longer get discovered into the default docs/search lane through nested archive directories; the finding remains open for broader retrieval filtering, smallest-sufficient validation lanes, compact background execution, prompt layering, and token telemetry.
- `2026-04-12`: Landed the first runtime-managed `.skopos/agent/**` brief family for trust, done, program, and eval state, and surfaced those projections in the knowledge index; the finding remains open for docs lifecycle filtering, smallest-sufficient validation lanes, compact background execution, prompt layering, and token telemetry.
- `2026-04-12`: Landed the second compact transport slice, so the first high-volume commands now support `--summary` and `--fields` in addition to `--compact`; the finding remains open for agent brief artifacts, docs lifecycle filtering, lane minimization, compact background execution, and token telemetry.
- `2026-04-12`: Landed the first compact transport slice at the CLI boundary, so `trust`, `done`, `eval`, `program sync`, and `program next` now have shared `--compact` projections; the finding remains open for follow-on work like `--fields`, `--summary`, `.skopos/agent/**` briefs, docs filtering, lane minimization, and token telemetry.
- `2026-04-12`: Opened after a real self-hosted reconciliation batch consumed too much context window because full artifact JSON, long workflow output, and repeated closure-state replay were still flowing into the agent loop instead of compact projections and local-only logs.

## Summary

- Severity: `MUST`
- Status: `fixed`
- Owner: `skopos-core`
- Target Pack: `token control and compact transport`
- Current State: fixed. Skopos stores compact canonical artifacts, default retrieval avoids known historical noise paths, validation lanes are more proportional, background eval has a compact polling lane, and every shared compact CLI projection reports direct response budget pressure. The compact eval projection was also tightened so mission progress no longer replays full checklist item objects into the compact JSON response.

## Symptom

1. agent-facing command results still return more state than most turns need
2. long-running eval, test, proof, and workflow output can still bleed into conversation context
3. archived or historical material is not yet excluded strongly enough from every default retrieval path
4. the same batch can replay too much closure and mission state instead of moving through compact deltas

## Impact

1. context windows fill too quickly during normal self-hosted use
2. cacheability is worse because prompts carry too much unstable dynamic content
3. jobs take longer because the system reruns broader validation and replay than the happy path needs
4. the core vision of exact, compact, low-drift retrieval is undermined at the transport layer

## Fix Plan

1. add compact agent-facing output modes for the highest-volume commands
2. expand `.skopos/agent/**` brief artifacts beyond the landed trust, done, program, eval, and mission projections so handoff state also has a compact transport surface
3. expand docs lifecycle filtering beyond the first routed-console archive exclusion so active, durable, and historical eligibility is enforced consistently across default retrieval surfaces
4. expand smallest-sufficient validation-lane selection beyond the first package-script-aware and docs-only plan/impact narrowing
5. expand compact background execution beyond the first eval slice into the broader heavy-job lane where it still pays for itself
6. expand token telemetry beyond the landed prompt brief so oversized handoffs and compact command responses also report budget pressure directly

Landed so far:

1. compact command output modes
2. compact trust, done, program, eval, mission, and handoff transport artifacts
3. first docs lifecycle exclusion in the routed console
4. first package and docs-oriented lane narrowing
5. first background eval execution path
6. first standalone telemetry diagnosis artifact
7. compact command response budget telemetry across shared compact CLI projections

## Verification

1. normal self-hosted mission batches stop replaying large JSON payloads into the agent loop
2. resume context stays compact even after multiple workflow and closure steps
3. default retrieval ignores archive and stale execution docs unless explicitly requested
4. compact command projections stay within defined token budgets

## Linked Docs

1. `../README.md`
2. `../../architecture/artifact-model.md`
3. `../../architecture/retrieval-and-query-strategy.md`
4. `../../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
5. `../../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
