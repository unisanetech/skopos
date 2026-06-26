# Decision: Human Guidance And Developer Experience Contract

## Metadata

- Doc ID: `SKOPOS-DECISION-030`
- Status: `accepted`
- Date: `2026-06-24`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Related Docs:
  - `../project/human-guidance-and-developer-experience-plan.md`
  - `../project/system-ui-plan.md`
  - `../project/roadmap.md`
  - `../project/implementation-checklist.md`
  - `023-supervision-cost-and-workflow-weight-discipline.md`
  - `024-token-control-compact-agent-transport-and-progressive-retrieval.md`
  - `029-policy-pack-stack-intelligence-and-memory-contract.md`

## Changelog

- `2026-06-24`: Accepted the human guidance and developer experience contract so Skopos user-facing output, UI surfaces, workpacks, and agent answers stay understandable to beginner, junior, and mid-level developers while machine artifacts remain strict.

## Context

Skopos already has strong machine-readable artifacts: bootstrap state, policies, trust reports, program state, missions, logs, and generated agent briefs. Those artifacts are useful for LLM coding agents, but they are not enough for the product experience.

The target user is not always a senior engineer reading raw JSON or architecture vocabulary. Skopos must help vibe coders, junior engineers, mid-level engineers, solo builders, and small teams understand what is happening, why it matters, and what to do next.

If Skopos only stores precise machine truth, it becomes powerful but hard to use. If Skopos only writes friendly prose, it becomes vague and unsafe. The product needs both.

## Decision

Skopos will keep strict machine artifacts as the runtime contract and add a human guidance contract across all user-facing surfaces.

Human-facing Skopos output must answer:

1. what happened
2. whether the state is OK
3. why it matters
4. what to do next
5. whether a user decision is needed
6. whether anything blocks progress or closure

This applies to CLI output, routed UI surfaces, workpack views, generated guidance docs, and agent-facing instructions.

## Rules

### Plain Language

1. Use simple English first.
2. Explain technical labels when they affect the next action.
3. Avoid raw internal wording as the primary user surface.
4. Keep detailed machine data available behind `--json`, disclosure, or raw artifact links.

### Status Translation

Every status must translate into human meaning.

| Machine status | Human meaning |
| --- | --- |
| `pass` | Looks good. |
| `warn` | Review this before closing. |
| `fail` | Fix this before closing. |
| `blocked` | Work cannot continue safely until this is answered or fixed. |
| `stale` | This may be outdated. Refresh it before trusting it. |

### Next Action

Every warning, failure, blocker, and recommendation must include a concrete next action.

Examples:

| Weak output | Better output |
| --- | --- |
| `policy-drift: fail` | Architecture rules were not followed in 2 files. Fix them before closing. Run `skopos policies drift` after the edit. |
| `trust: medium` | Mostly ready, but 1 item needs review before this should be treated as done. |
| `artifact stale` | The saved project knowledge may be outdated. Run `skopos init` or the suggested refresh command. |

### Guided Questions

When Skopos needs a user decision, it must provide:

1. the question
2. the recommended option
3. why that option is recommended
4. the main alternatives and tradeoffs
5. the default action if the user has no preference

Questions should help the user decide. They should not simply throw expert terminology back at the user.

### Workpack Progress

Workpack and long-running execution surfaces must show:

1. current phase
2. approximate progress
3. completed work
4. current work
5. next step
6. blockers
7. open user questions
8. decisions made during execution
9. new findings that affect the plan
10. proof still required before closure

Progress must be honest. Prefer phrases like `about 60% complete` or `3 of 5 steps complete` over false precision.

### No Duplicate Truth

Human text is a projection of machine truth, not a second source of truth.

Durable facts still belong in the owning artifacts:

1. policies and overrides in policy artifacts
2. stack decisions in stack artifacts
3. project memory in memory artifacts
4. work execution in missions, program state, workpacks, and logs
5. accepted technical decisions in decision docs

Human guidance explains those facts and points to the next action.

### Progressive Detail

Default output should be compact and helpful.

Detailed output should be available on demand through:

1. `--json`
2. `--verbose`
3. routed UI disclosure
4. raw artifact links
5. focused detail commands

Small tasks should stay light. Big or risky tasks should show more structure.

## Consequences

### Positive

1. Skopos becomes easier to use for beginner, junior, and mid-level developers.
2. LLM agents get clearer answer style and decision style instead of raw policy dumps.
3. Workpacks become easier to supervise because progress, blockers, and proof are visible.
4. CLI and UI output become product surfaces, not just debugging surfaces.
5. Human comprehension improves without weakening machine-readable contracts.

### Costs

1. CLI and UI output need copy review, not only schema tests.
2. More tests must verify user-facing wording and next-action presence.
3. Some internal statuses need human explanation mappings.
4. Workpack and program-state views need progress summaries that stay honest and generated from real state.

## Non-Goals

1. Do not hide technical truth.
2. Do not remove raw JSON or machine artifacts.
3. Do not make Skopos verbose by default.
4. Do not force every small task into a heavy workpack.
5. Do not turn guidance text into a second source of truth.

## Next Action

Implement the contract in this order:

1. add the project plan and cross-link it from roadmap, checklist, overview, and UI plan
2. update `trust`, `policies recommend`, `policies apply`, and `policies drift` to use human-first default output while preserving `--json`
3. add command-output tests that require warnings and failures to include next steps
4. add workpack progress summaries for phase, percent, next step, blockers, questions, decisions, findings, and proof
5. apply the same language contract to the routed UI
