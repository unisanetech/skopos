# Decision: Token Control, Compact Agent Transport, And Progressive Retrieval

## Metadata

- Doc ID: `SKOPOS-DECISION-024`
- Status: `accepted`
- Date: `2026-04-12`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-04-13`
- Related Docs:
  - `../project/vision.md`
  - `../project/overview.md`
  - `../project/roadmap.md`
  - `../project/implementation-checklist.md`
  - `../architecture/artifact-model.md`
  - `../architecture/retrieval-and-query-strategy.md`
  - `../architecture/trust-and-closure-model.md`
  - `021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `022-program-router-sequencing-and-obligation-contract.md`
  - `023-supervision-cost-and-workflow-weight-discipline.md`

## Changelog

- `2026-04-17`: Tightened the default docs search path so historical docs are now excluded from normal search results and only re-enter when the query explicitly asks for archive or historical material, reducing default retrieval noise beyond the first discovered-doc exclusion.
- `2026-04-13`: Connected the compact resume path to real lifecycle hooks, so Claude Code `SessionStart`, `UserPromptSubmit`, `PreCompact`, and `Stop` now use `skopos discuss recent|append-turn|handoff|checkpoint` instead of leaving prompt budgeting and handoff refresh as purely advisory runtime ideas.
- `2026-04-13`: Added runtime-managed handoff and telemetry artifacts, so Skopos now writes `.skopos/discussions/handoffs/latest-workflow.json` as the compact cross-thread resume surface and `.skopos/agent/token-telemetry.json` as a separate budget-diagnosis artifact instead of keeping that state implicit or only inside `.skopos/agent/prompt-brief.json`.
- `2026-04-12`: Added the first prompt-layering and token-telemetry slice, so Skopos now generates `.skopos/agent/prompt-brief.json` with stable-prefix versus dynamic-tail guidance plus budget measurements for trust, done, program, mission, handoff, and default resume context instead of leaving prompt composition and hot-path token risk implicit.
- `2026-04-12`: Expanded smallest-sufficient validation lanes so workspace-scoped plans can still narrow to `pnpm --filter <package> ...` when the goal unambiguously points at one package and impact reports do the same when explicit changed paths stay inside one package; the remaining token-control work is broader lane policy, prompt layering, and telemetry.
- `2026-04-12`: Landed the first compact background-execution slice for long-running eval jobs, so `skopos eval --background` now queues a durable `.skopos/jobs/*.json` artifact and detached execution can be polled through `skopos jobs show ... --compact --json` instead of keeping the main thread hot; the remaining token-control work is broader lane policy, prompt layering, and telemetry.
- `2026-04-12`: Tightened persisted shell-output excerpts for eval and workflow artifacts, so canonical runtime artifacts now keep compact normalized excerpts instead of raw 4k command tails while the remaining token-control work stays focused on broader lane policy, compact background execution, prompt layering, and telemetry.
- `2026-04-12`: Expanded the `.skopos/agent/**` brief family with mission-state projections under `.skopos/agent/missions/**`, so hot-path mission routing can load compact mission state before reopening the full mission artifact; the remaining token-control work is broader lane policy, compact background execution, prompt layering, and telemetry.
- `2026-04-12`: Expanded the smallest-sufficient validation-lane slice so explicit docs-only plan goals now suppress broad validation commands and changed-path-aware impact reports also suppress runtime validation for docs, instruction, and generated-only surfaces; remaining work is broader lane policy beyond docs/package narrowing, compact background execution, prompt layering, and telemetry.
- `2026-04-12`: Landed the first smallest-sufficient validation-lane slice, so package-scoped plans now rewrite `recommendedChecks` to package-local `pnpm --filter <package> <script>` commands when the package exposes compatible local scripts and otherwise fall back to the broader workspace lane; remaining work is docs lifecycle enforcement beyond routed-console filtering, compact background execution, prompt layering, and telemetry.
- `2026-04-12`: Landed the first docs lifecycle filter in the routed console, so historical docs with any nested `archive` segment no longer enter the default discovered docs and search state; the remaining token-control work is smallest-sufficient validation lanes, compact background execution, prompt layering, and telemetry.
- `2026-04-12`: Landed the first `.skopos/agent/**` brief family for trust, done, program, and mission eval state, plus knowledge-index entries for those compact projections; the remaining token-control work is docs filtering, smallest-sufficient validation lanes, compact background execution, prompt layering, and telemetry.
- `2026-04-12`: Landed the second CLI-boundary transport slice, so `trust`, `done`, `eval`, `program sync`, and `program next` now support `--summary` and `--fields` on top of `--compact`; the remaining token-control work is now the agent-brief artifact family, docs filtering, lane minimization, background jobs, and telemetry.
- `2026-04-12`: Landed the first CLI-boundary compact transport slice, so `trust`, `done`, `eval`, `program sync`, and `program next` now support `--compact` projections while the broader `--summary`, `--fields`, agent-brief artifact family, docs filtering, and lane minimization remain follow-on work.
- `2026-04-12`: Added the token-control and compact-agent-transport contract so Skopos can keep canonical truth rich on disk while keeping default agent retrieval, workflow routing, and long-running execution token-cheap.

## Context

Skopos already says the right high-level thing:

1. retrieve exact, compact, low-drift context first
2. keep discussion continuity compact
3. reduce supervision cost more than workflow weight increases

The current runtime still violates that doctrine in important ways:

1. full artifact payloads are still leaking into the agent loop
2. `--json` often means `dump the whole artifact`, not `return the smallest useful structured result`
3. long test, proof, and workflow logs still flow through agent context too easily
4. docs and historical material can still compete with active truth if retrieval is not filtered tightly enough
5. heavy commands such as `eval`, `done`, `trust`, and `program next` still return more state than most agent turns need
6. state reconciliation work can replay as long conversational operational output instead of compact deltas

This breaks the token-control goal at the transport layer even when the stored artifact model is otherwise sound.

## Decision

Adopt one explicit token-control architecture for Skopos:

1. keep full canonical truth on disk
2. add compact agent-facing projections as a first-class runtime surface
3. make progressive retrieval and docs lifecycle filtering the default
4. keep long-running job logs and full artifacts out of the default agent context
5. stabilize prompt layering before treating provider prompt caching as a major optimization

The canonical rule is:

`save richly, project compactly, load narrowly`

## Canonical Representation Model

Every important Skopos state family should support three representations:

1. `canonical artifact`
   - full durable JSON on disk
   - source of truth for audit, UI, and debugging
2. `agent brief`
   - compact, token-budgeted projection
   - default surface for Codex-, Claude Code-, and similar agent loops
3. `human detail`
   - richer than the agent brief, but still curated instead of raw dump
   - default surface for routed UI and human review

The default agent path must not load canonical artifacts directly unless:

1. the brief is missing
2. the brief is stale
3. a debugging or deep-inspection path explicitly asks for full detail

## Command Transport Contract

High-volume commands must stop treating `json` output as a raw artifact dump.

### Required Output Modes

These commands should gain a compact agent-facing projection mode:

1. `skopos trust`
2. `skopos done`
3. `skopos eval`
4. `skopos start`
5. `skopos next`
6. `skopos decide`
7. `skopos program next`
8. `skopos mission show`
9. `skopos discuss handoff`
10. `skopos jobs show`

Required output-shaping options:

1. `--compact`
2. `--summary`
3. `--fields <comma-separated>`
4. an explicit output profile such as `--output agent|human|full`

### Compact Result Rule

Compact agent output should usually include only:

1. `status`
2. `summary`
3. `missionId` or `itemId`
4. `trustLevel`
5. `readiness`
6. `blockingQuestionIds`
7. `requiredActionIds` or short action summaries
8. `nextCommand`
9. `changedStateSummary`

Compact output must not include by default:

1. full changed-path arrays
2. full source-dependency arrays
3. full mission or plan payloads
4. full workflow evidence lists
5. full test or proof logs
6. large repeated trust-check or impact arrays when all items are passing

## Progressive Retrieval Contract

Skopos retrieval must become stricter than “search active docs first.”

### Retrieval Order

1. compact agent brief
2. active canonical document or artifact
3. targeted durable reference
4. historical or archived material only on explicit need
5. raw source only when compiled knowledge is insufficient

### Docs Lifecycle Rule

Every major doc should sit in one lifecycle state:

1. `active`
2. `durable`
3. `historical`
4. `dead`

Default retrieval and default docs routing must exclude:

1. archived execution docs
2. historical findings
3. superseded plans
4. older transitional docs that no longer drive current behavior

Historical material is still queryable, but it must not compete with active truth in the hot path.
Default search is part of that hot path, so historical docs must be excluded there as well unless the query explicitly asks for archive or historical material.

## Validation-Lane Minimization Contract

Skopos must stop paying full workspace validation cost for every small batch.

### Required Lane Selection

The runtime should choose the smallest sufficient lane across at least:

1. docs-only
2. docs plus generated refresh
3. targeted package validation
4. workspace validation
5. proof lane
6. UI build lane

### Rule

Only escalate to a broader lane when:

1. a changed surface actually invalidates it
2. a trust, proof, or done rule requires it
3. the current mission explicitly owns broader workspace risk

This is necessary for both wall-clock efficiency and token control, because repeated full-lane outputs create avoidable context churn.

## Long-Running Job Contract

Heavy jobs must stop polluting conversation context.

### Required Behavior

1. start heavy work as a tracked local job
2. poll only compact status
3. keep full logs in local artifacts
4. load only a final compact result into the agent loop

This applies especially to:

1. `skopos eval`
2. proof scorecard runs
3. large validation lanes
4. large UI builds when they are only closure evidence

### First Landed Slice

The first compact background-execution slice is:

1. `skopos eval --background`
2. durable job artifacts under `.skopos/jobs/*.json`
3. compact polling through `skopos jobs show <job-id> ... --compact --json`

This first slice intentionally does not add a general scheduler or background execution for every workflow. The goal is to cut hot-thread residency for long-running eval jobs first without adding a second orchestration system.

## Discussion-Memory Contract

Discussion memory remains necessary, but must stay token-disciplined.

### Required Rule

1. save raw turns locally
2. checkpoint only meaningful changes
3. hand off one compact summary before compaction or thread switching
4. inject only the latest handoff plus active workflow state by default

Raw journals and long checkpoint history must not become default prompt context.

## Prompt Layering And Cache Strategy

Provider caching is useful, but only after transport and retrieval are disciplined.

### Prompt Layers

1. `stable system and tool prefix`
2. `stable workspace and doctrine prefix`
3. `dynamic execution tail`

Only the dynamic execution tail should change frequently.

### First Landed Slice

The first prompt-layering slice is:

1. `.skopos/agent/prompt-brief.json`
2. explicit layer guidance for:
   - stable system and tool prefix
   - stable workspace and doctrine prefix
   - dynamic execution tail
3. budget telemetry for:
   - trust brief
   - done brief
   - program brief
   - mission brief
   - latest handoff when present
   - default resume context

This slice is intentionally artifact-first. It gives hosts and adapters a compact loading plan and budget signal before provider-specific cache integration lands.

### Follow-On Landed Slice

The next prompt-layering and telemetry slice is:

1. `.skopos/discussions/handoffs/latest-workflow.json`
2. `.skopos/agent/token-telemetry.json`
3. explicit handoff budgeting for real workflow resume state rather than planned placeholder measurements
4. a separate telemetry diagnosis artifact for:
   - trust brief
   - done brief
   - program brief
   - active mission brief
   - latest workflow handoff
   - default resume context

### Cache Rule

Skopos should add provider-level cache strategy only after:

1. compact command transport exists
2. agent briefs exist
3. discussion handoff exists
4. prompt prefixes are stable enough for cache reuse

Prompt caching is an optimization on top of good transport, not a substitute for it.

## Token Budget Targets

Default agent-facing payloads should stay roughly within these bounds:

1. `trust brief`: under `300` tokens
2. `done brief`: under `400`
3. `program brief`: under `400`
4. `mission brief`: under `500`
5. `handoff`: under `600-1200`
6. default injected discussion-plus-workflow resume context: under roughly `1500`

If a result exceeds its budget, the runtime should:

1. collapse large lists to counts plus top items
2. hide passing details behind explicit detail requests
3. omit unchanged sections
4. prefer structured deltas over full state replay

## Telemetry And Diagnosis

Skopos should explicitly measure token-risky behavior.

Add a token-control diagnosis lane that can report:

1. oversized handoffs
2. oversized agent briefs
3. commands that exceed compact-output budgets
4. repeated broad-lane validation when a smaller lane was sufficient
5. prompt-layer instability that prevents provider cache reuse

The first landed telemetry diagnosis artifact is `.skopos/agent/token-telemetry.json`.

## Implementation Order

### Phase 1: Stop The Bleeding

1. add `--compact`, `--summary`, and `--fields` to the highest-volume commands
2. keep long logs local by default
3. make agent-facing wrappers use compact output automatically

### Phase 2: Agent Brief Layer

1. add `.skopos/agent/**` brief artifacts
2. generate trust, done, program, mission, eval, and handoff briefs
3. add prompt and telemetry projections that budget the combined resume surface instead of only individual briefs
4. make retrieval prefer briefs before full artifacts

### Phase 3: Retrieval And Docs Filtering

1. add active versus durable versus historical retrieval filtering
2. prune or archive stale execution and historical docs from the default path
3. keep archived material searchable, but not default-eligible

### Phase 4: Lane Minimization And Background Jobs

1. add smallest-sufficient lane selection
2. move heavy eval and proof execution to compact-polled background job handling
3. return only compact final summaries to the agent loop

### Phase 5: Cache-Aware Prompting

1. stabilize prompt layering
2. add provider cache strategy where the host supports it
3. measure cache hit quality after prompt structure is disciplined

## Consequences

### Positive

1. lower token usage on normal self-hosted work
2. lower context pollution from operational logs and state dumps
3. faster retrieval and less accidental archive loading
4. better prompt-cache potential
5. better alignment with the compact-first product vision

### Costs

1. more projection code must be maintained
2. output-mode design becomes part of the public contract
3. the runtime must own stricter lifecycle and retrieval filtering than before

## Next Action

Apply this contract to:

1. the new compact output modes for `trust`, `done`, `eval`, and `program next`
2. the first `.skopos/agent/**` brief artifacts
3. docs lifecycle filtering so archive and stale execution material leave the default retrieval path
4. smallest-sufficient validation lane selection for self-hosted workflow execution
