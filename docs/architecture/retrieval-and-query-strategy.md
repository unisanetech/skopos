# Retrieval And Query Strategy

Skopos should prefer exact, compact, low-drift retrieval over broad semantic search.

## Metadata

- Doc ID: `SKOPOS-ARCH-RETRIEVAL-QUERY-STRATEGY`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/architecture`
- Canonical: `yes`
- Last Updated: `2026-04-13`
- Review Cycle: `per workpack`
- Related Docs:
  - `artifact-model.md`
  - `trust-and-closure-model.md`
  - `../findings/registry.md`

## Changelog

- `2026-04-17`: Tightened the default search lane so historical docs are no longer merely down-ranked; they are now excluded from normal search results and only re-enter when the query explicitly asks for archive or historical material.
- `2026-04-13`: Added the first runtime-managed workflow handoff and standalone telemetry diagnosis artifacts, so retrieval and adapter surfaces can now load `.skopos/discussions/handoffs/latest-workflow.json` as the compact resume packet and `.skopos/agent/token-telemetry.json` as the explicit budget-pressure surface instead of inferring both from `.skopos/agent/prompt-brief.json` alone.
- `2026-04-12`: Added the first prompt-layering and token-telemetry artifact under `.skopos/agent/prompt-brief.json`, so retrieval and adapter surfaces can now read one compact stable-prefix versus dynamic-tail plan plus hot-path budget measurements before improvising prompt composition.
- `2026-04-12`: Implemented the first docs lifecycle filter in the routed console, so any docs path with an `archive` segment is now excluded from the default discovered docs lane instead of competing with active and durable knowledge in the normal UI and search hot path.
- `2026-04-12`: Added the token-control and compact-agent-transport contract, so retrieval now explicitly prefers compact briefs, filters historical docs out of the default path, and keeps prompt loading narrow enough not to burn context windows on raw artifact dumps or repeated closure replay.
- `2026-04-09`: Refined the retrieval strategy around compiled-knowledge-first loading, planned index-first navigation, and token-friendly reuse of prior synthesis.
- `2026-04-09`: Updated the retrieval contract to reflect that typed workspace, mission, and impact graphs now exist as internal support artifacts.
- `2026-04-09`: Updated the retrieval contract to treat graph relationships as internal machine-readable support data and not as default visual context for agents.
- `2026-04-09`: Updated the retrieval contract to reflect the first implemented `resolve` and `context` surfaces backed by `scopes-lite`.
- `2026-04-09`: Added the compact-first retrieval contract to keep token usage low and reduce incorrect context loading.

## Retrieval Order

1. classify intent
2. resolve exact scope, owner, symbol, command, or doc id
3. load one compact agent brief or compact compiled navigation state such as bootstrap, active program or mission state, and one relevant scope card
4. load only targeted active canonical docs, graph slices, and workflow metadata
5. expand to targeted durable references only when the active compact and canonical lane is insufficient
6. reach back to historical docs or raw sources only when compiled knowledge is missing, stale, explicitly requested, or too low-confidence
7. use semantic fallback only when exact and linked retrieval fail

## Ranking Rules

1. canonical over supporting
2. active over historical
3. same-scope over adjacent-scope
4. fresher over stale
5. exact id match over fuzzy match

## Compiled-Knowledge Rule

1. query the compiled project knowledgebase first instead of rediscovering repo structure every session
2. treat raw files as backing sources, not default first-load context
3. keep index and scope-card surfaces compact enough to be directly token-friendly
4. treat search as an optional helper once scale demands it, not the primary architecture

## Transport Projection Rule

1. every runtime surface should have a clear transport projection:
   - canonical artifact
   - compact agent brief
   - human detail projection
2. agent-facing command and retrieval paths should prefer compact briefs over full artifact payloads by default
3. full JSON or raw workflow evidence should load only when a focused debugging question requires it
4. command transport should favor `compact`, `summary`, and `fields` projections instead of `dump everything` JSON

## Docs Lifecycle Filtering

1. treat docs as one of:
   - `active`
   - `durable`
   - `historical`
   - `dead`
2. default retrieval should load `active` docs first and only expand to `durable` docs when needed
3. `historical` docs should be excluded from default workflow loading and default search results, and only appear on explicit archive or historical queries or when active truth is insufficient
4. `dead` duplication should be deleted rather than left in the retrieval path as ambiguous support context

## Smallest-Sufficient Load Rule

1. default prompt reload should use the narrowest context that can answer the task:
   - latest handoff
   - active program summary
   - active mission brief
   - open questions and recommendations
2. do not reload full transcripts, full mission JSON, or full trust or done payloads by default
3. when more context is needed, load one additional targeted reference at a time instead of broad directory scans or artifact dumps

## Prompt-Layer Rule

1. keep stable instructions, tool definitions, and workspace doctrine in a reusable prefix
2. keep active execution state in a compact dynamic tail
3. do not mix volatile logs, generated output dumps, or broad historical docs into the stable prompt prefix
4. improve cacheability by keeping the early prompt layers stable and the late execution layers compact
5. prefer `.skopos/agent/prompt-brief.json` as the generated loading plan for which compact refs belong in the stable workspace prefix and which belong in the dynamic execution tail
6. prefer `.skopos/discussions/handoffs/latest-workflow.json` as the default workflow-resume packet instead of rebuilding resume state from full mission or question artifacts in the hot path
7. use `.skopos/agent/token-telemetry.json` as the budget-pressure diagnosis surface when deciding whether the current resume package is too large

## Graph Guidance

1. keep typed internal relationship graphs for scopes, docs, impact, commands, and mission links
2. prefer filtered adjacency or scope-local relationship slices for agents instead of rendered graph views
3. only surface graph views to humans when they answer a focused question more clearly than prose or tables
4. keep graph slices scoped and filtered so they reduce context cost instead of creating visual or token noise

## Anti-Drift Rules

1. do not let archive material appear by default
2. do not teach legacy patterns as canonical
3. low-confidence inference must remain visibly low-confidence
4. do not let compact retrieval degrade into full-artifact transport just because a canonical artifact exists on disk
5. do not replay repeated closure, trust, or validation state in the default agent context when a compact delta or brief would do
