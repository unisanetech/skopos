# Skopos Vision

Skopos should make coding agents project-aware, decision-aware, and trust-aware inside real software projects.

## Metadata

- Doc ID: `SKOPOS-PROJECT-VISION`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-07-25`
- Review Cycle: `per workpack`
- Related Docs:
  - `overview.md`
  - `positioning.md`
  - `agentic-operating-plan.md`
  - `roadmap.md`
  - `../architecture/trust-and-closure-model.md`

## Changelog

- `2026-07-25`: Simplified the product vision around one agent-native project control
  plane: the coding agent owns reasoning and implementation while Skopos owns compact
  project/task context, discoverable actions, deterministic guards, and trustworthy
  evidence. Added full downstream-project adoption as a core success criterion.

- `2026-06-29`: Clarified that Skopos is a role-based project memory and agent operating layer: human docs hold durable truth, `.skopos/**` compiles fast machine state, and commands guide coding agents through work.

- `2026-06-29`: Extended the vision with explicit project modes and command-guided agent briefs, so Skopos can support brownfield preservation, clean refactor, greenfield-in-existing-repo, and new-project workflows without relying on repeated user reminders.

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
12. records the project operating mode so existing repos can be treated as brownfield, clean-refactor, greenfield-in-existing-repo, or new-project work instead of collapsing every repo into one behavior
13. guides the coding agent through command-generated briefs that explain what to read, what to ask, what to edit, what to avoid, what to check, and how to close
14. maps project truth by required memory role instead of forcing every repo into one docs tree
15. keeps tool-specific instruction files compact by pointing agents to the right project memory instead of copying every rule everywhere
16. gives every adopting project one workflow and closure authority instead of stacking
    Skopos beside another LLM workflow
17. keeps current task intent, non-goals, acceptance criteria, and proof distinct from
    durable project memory
18. lets capable coding agents reason and coordinate natively while Skopos supplies
    context, actions, guards, and evidence
19. lets demanding projects improve generic Skopos capabilities without embedding their
    domain architecture in Skopos core

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
12. cleanup/refactor-heavy work removes obsolete paths instead of adding duplicate hybrid systems when the selected project mode calls for no-legacy execution
13. users no longer need to repeatedly tell agents to "follow Skopos"; the default command flow carries the operating contract into the agent path
14. existing projects with good docs are respected, existing projects with messy docs get clear cleanup recommendations, and weak-doc projects get concrete memory-building tasks
15. an adopting project can retire its parallel LLM workflow and use Skopos as the one
    daily admission, iteration, and closure control plane
16. task acceptance criteria can be traced to evidence without repeatedly running the
    same expensive proof
17. parallel agents and worktrees retain isolated task state and integrate through one
    owned final closure
