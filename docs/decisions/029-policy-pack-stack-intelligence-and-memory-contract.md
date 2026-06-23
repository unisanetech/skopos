# Decision: Policy Pack, Stack Intelligence, And Memory Contract

## Metadata

- Doc ID: `SKOPOS-DECISION-029`
- Status: `accepted`
- Date: `2026-06-24`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Related Docs:
  - `../project/policy-pack-and-stack-intelligence-plan.md`
  - `../project/roadmap.md`
  - `../project/implementation-checklist.md`
  - `../architecture/artifact-model.md`
  - `../architecture/config-model.md`
  - `019-compiled-reference-layer-and-agent-memory-baseline.md`
  - `024-token-control-compact-agent-transport-and-progressive-retrieval.md`

## Changelog

- `2026-06-24`: Accepted the first contract for project-agnostic policy packs, stack intelligence, durable memory state, and drift reports so implementation can proceed from stable artifact ownership instead of dummy pack content.

## Context

Skopos already has project bootstrap, scope context, trust, workflows, instructions, program state, and generated agent briefs. The next product layer is broader: Skopos should guide LLM coding agents through architecture, clean code, naming, structure, UI, gates, stack decisions, maintenance, and refactoring without becoming tied to one reference repo.

Unisane is a useful reference for rigor because it has strong architecture doctrine, command lanes, generated-artifact rules, UI governance, decision logs, and findings. But Skopos must not become a Unisane-only agent layer. It must generalize those ideas into project-agnostic intelligence that can be installed into any serious product repository.

The key risk is implementing pack content before artifact ownership is stable. That would create toy packs, untracked generated docs, and unclear memory drift behavior.

## Decision

Add first-class model contracts for four durable product surfaces:

1. policy packs and resolved project policy
2. stack recommendations and accepted stack decisions
3. compiled project memory state
4. policy and memory drift reports

These contracts are the foundation for later commands such as `skopos policies recommend`, `skopos policies apply`, `skopos stack recommend`, `skopos stack decide`, `skopos memory status`, and `skopos drift check`.

## Canonical Ownership

### Built-In Pack Source

Built-in Skopos packs are source-controlled product assets. They should live under a future first-class pack source root, not inside generated project artifacts.

Expected source family:

1. `policy-packs/**`
2. `stack-packs/**`
3. `gate-packs/**`
4. `workflow-packs/**`

Pack source is authored by Skopos maintainers and versioned with Skopos.

### Project-Accepted State

Accepted local truth belongs to the installed project. It is not hidden in prompts.

Expected accepted-state artifacts:

1. `.skopos/policies/resolved.json`
2. `.skopos/policies/overrides.json`
3. `.skopos/stack/decisions.json`
4. `.skopos/memory/state.json`
5. `.skopos/drift/report.json`

Accepted state may also have optional markdown mirrors under `docs/skopos/**`, but JSON artifacts remain the runtime contract.

### Generated Memory

Generated memory is a compiled projection of observed, inferred, accepted, and operational truth. It must be treated as generated state and refreshed from sources.

Generated memory must carry:

1. source dependency probes
2. timestamps
3. stale-source counts
4. confidence levels where inference is involved
5. trust-impacting freshness status

### Human-Authored Docs

Human-authored docs remain the durable semantic source when the project has them. Skopos can route, summarize, and check them, but it should not replace them with generated prose.

## Contract Rules

### Policies

1. A policy pack is only a candidate until accepted into project state.
2. Resolved project policy is the combination of accepted packs plus local overrides.
3. Drift is measured against resolved project policy, not against every built-in Skopos preference.
4. Pack recommendations must include applicability signals and anti-signals.
5. Packs must include proof fixtures before they are considered product-grade.

### Stack Intelligence

1. Stack intelligence recommends capabilities first, implementation choices second.
2. Recommendations must include signals, anti-signals, tradeoffs, risk, and required gates.
3. Accepted and rejected stack decisions must both be remembered.
4. Skopos must not recommend infrastructure without workload evidence.
5. Stack choices should influence future planning, gates, and drift checks.

### Memory

1. Memory is compiled project truth, not chat transcript storage.
2. Memory must combine observed, inferred, accepted, operational, and agent-ready state.
3. Stale memory is a trust concern.
4. Agent briefs should load from memory state instead of re-deriving project knowledge in every session.
5. Memory must survive context compaction, new chats, model changes, and multi-agent handoffs.

### Drift

1. Drift reports must identify rule, severity, source file or artifact, evidence, and remediation.
2. `must` drift can block eval or done once the relevant policy is accepted.
3. Overrides can suppress or downgrade drift only with an explicit reason and ownership.
4. Drift should distinguish project-specific policy from universal safety issues such as secrets and generated-artifact edits.

## Consequences

### Positive

1. implementation can start from stable artifact contracts
2. Skopos remains project-agnostic while still learning from rigorous reference projects
3. policy and stack recommendations become durable project state instead of chat advice
4. memory freshness becomes a product-level invariant
5. later CLI commands can be thin orchestration over typed artifacts

### Costs

1. more artifact families must be kept fresh and indexed
2. trust and eval need to understand policy and memory posture
3. pack authoring now has a higher quality bar before public claims
4. generated memory needs invalidation discipline to avoid stale confidence

## Next Action

Implement the initial model contracts and exports, then follow with one thin runtime slice:

1. create policy, stack, memory, and drift model contracts
2. add one internal example pack after contracts are stable
3. add `skopos policies recommend` using the contracts
4. add memory freshness and missing-policy posture to `skopos trust`
5. prove the behavior on Skopos plus a non-Unisane fixture
