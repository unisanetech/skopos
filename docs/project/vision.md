# Skopos Vision

Skopos should make coding agents project-aware, decision-aware, and trust-aware inside real software projects.

## Metadata

- Doc ID: `SKOPOS-PROJECT-VISION`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-04-12`
- Review Cycle: `per workpack`
- Related Docs:
  - `overview.md`
  - `positioning.md`
  - `roadmap.md`
  - `../architecture/trust-and-closure-model.md`

## Changelog

- `2026-04-12`: Extended the vision with token-control discipline, so the default retrieval and transport path must stay compact enough not to waste context windows on raw JSON, stale docs, or replayed operational logs.
- `2026-04-12`: Added the supervision-cost and workflow-weight discipline, so new Skopos features now need to prove that they reduce user supervision more than they increase workflow ceremony.
- `2026-04-12`: Extended the vision again with the program-router layer, so Skopos is now explicitly expected to decide what should be active now, what should wait, and what docs or UI surfaces must move when accepted work changes the queue.
- `2026-04-12`: Extended the vision with discussion-memory continuity, so Skopos is now explicitly expected to preserve accepted direction across compaction and new-thread continuation through compact handoffs instead of replaying raw chat history.
- `2026-04-11`: Tightened the vision around post-discussion execution, so Skopos is now explicitly expected to route the next step, required questions, and proof surfaces instead of leaving that sequencing to prompt discipline or user coaching.
- `2026-04-09`: Refined the vision around compiled project knowledge, brownfield-first adoption, and compounding repo understanding instead of repeated re-derivation.
- `2026-04-09`: Added the durable product-vision doc for Skopos so feature and architecture work route through one stable thesis.

## Vision Statement

Developers should be able to keep their existing coding tools, bring their own LLM providers, and still get a project-aware agent workflow that:

1. understands the repo
2. knows what is canonical
3. asks humans when it should
4. keeps docs, workflows, and instructions aligned
5. compiles and maintains project knowledge instead of rediscovering it every session
6. proves why a result should be trusted
7. routes the next step after discussion so users do not need to restate workflow rules manually
8. sequences accepted work across batches so users do not need to act as the full-time program router
9. preserves recent accepted direction across context compaction without making prompts transcript-heavy
10. keeps workflow weight lower than the supervision burden it replaces
11. keeps default retrieval, runtime transport, and long-running execution compact enough that agent context is spent on decisions and implementation rather than operational replay

## Success Criteria

Skopos succeeds when:

1. an existing brownfield repo becomes safer for coding agents instead of more chaotic
2. a greenfield project becomes agent-ready quickly
3. planning decisions and architecture interpretations survive beyond chat history
4. docs, workflows, and instruction surfaces drift less
5. “done” is evidence-backed rather than summary-backed
6. the same repo understanding does not have to be repaid in tokens every session
7. users can mostly discuss goals and decisions while Skopos routes execution, sequencing, questions, and proof with lower supervision cost
8. accepted direction, rejected paths, and open rationale survive beyond one context window through compact checkpoints and handoffs rather than raw transcript replay
9. new accepted work can correctly stay `do-now`, `do-next`, `defer`, or `interrupt-current` through compiled state instead of ad hoc chat ordering
10. new control-plane layers do not turn Skopos into a ceremony-heavy process product
11. the agent loop stays inside compact working budgets because Skopos loads briefs, active canonicals, and compact handoffs before broader docs, logs, or raw artifacts
