---
title: "Decision: Agent-Guided Project Understanding Contract"
status: superseded
owner: skopos-core
id: SKOPOS-DECISION-035
scope: skopos
role: decision
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
date: 2026-06-29
lastUpdated: 2026-07-28
relatedDocs:
  - ../D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../028-initial-synthesized-repo-understanding-contract.md
  - 033-memory-map-and-agent-workflow-intelligence-contract.md
  - 034-post-init-setup-review-and-confirmed-understanding-contract.md
  - ../../findings/F-20260629-understand-scanner-only-onboarding-gap.md
---

# Decision: Agent-Guided Project Understanding Contract

## Changelog

- `2026-07-28`: Superseded by Decision D-8d32a27b. Agent analysis now produces a
  reviewed restructuring proposal rather than permanent mapped equivalents.

- `2026-06-29`: Accepted the agent-guided project understanding contract after the existing-project pilot showed that scanner-generated summaries are useful setup signals but not real project understanding.

## Context

Skopos originally added `skopos understand` as a compact synthesized orientation layer. That improved first-run output, but it still relied on deterministic bootstrap and scope artifacts. It could detect stack, commands, docs roots, and high-level package shape, but it could not truly understand product purpose, domain ownership, architecture boundaries, or real developer workflows.

That is not enough for the Skopos vision. Skopos is meant to reduce repeated project rediscovery by coding agents. Real understanding requires a coding agent to inspect source, docs, routes, services, UI, data flows, tests, and existing instructions, then write durable project memory that humans and future agents can review.

## Decision

`skopos understand` must become an agent-guided project analysis workflow, not only a scanner-generated artifact command.

The command still produces compact scanner-derived artifacts, but it must also produce an agent analysis brief that tells the coding agent:

1. what to read first
2. what the scanner cannot know
3. what analysis tasks to perform
4. which durable project understanding docs or mapped equivalents must exist
5. what to ask the user before treating assumptions as truth
6. how to rerun Skopos after the analysis is written

Expected artifact:

1. `.skopos/understanding/agent-analysis-brief.json`

## Understanding Depth

Skopos must distinguish these states:

1. `scanner-only`: bootstrap or scan artifacts exist, but no agent-guided analysis brief exists yet
2. `brief-ready`: an agent analysis brief exists, but durable project understanding docs are missing
3. `agent-reviewed`: durable project understanding docs or mapped equivalents exist and can be used as first-read project memory

Trust should not treat scanner-only or brief-ready understanding as fully agent-ready for broad work.

## Durable Outputs

For a typical project, the agent-guided analysis should create or map these responsibilities:

1. project overview
2. architecture map
3. domain and feature map
4. developer workflow guide
5. validation gates
6. open setup questions

The default greenfield-friendly paths are:

1. `docs/project/overview.md`
2. `docs/project/architecture.md`
3. `docs/project/domains.md`
4. `docs/project/workflows.md`
5. `docs/project/validation.md`
6. an open-questions document when material questions exist

Brownfield projects may use existing docs instead, but Skopos must make that mapping explicit before treating it as confirmed memory.

## Rules

1. Programmatic scan is facts, not full understanding.
2. Agent analysis must separate observed facts, inferred structure, assumptions, risks, and questions.
3. Generated summaries must not replace human-readable durable project docs.
4. Brownfield projects should map existing docs before Skopos suggests new structure.
5. Trust and UI should show when understanding is only scanner-generated.
6. Coding agents should follow the analysis brief before broad refactors, architecture changes, or long-running feature work.

## Consequences

### Positive

1. Skopos onboarding becomes honest about what it knows.
2. Coding agents get a concrete project-analysis job instead of vague advice to inspect the repo.
3. Durable memory becomes reviewable by humans and reusable by future agents.
4. Trust becomes harder to game with generated JSON alone.

### Costs

1. Onboarding has one more step before broad work.
2. Existing repos may need a one-time agent analysis pass.
3. The UI and docs must explain scanner-only versus agent-reviewed understanding clearly.

## Implementation Notes

The first implementation should add the analysis brief artifact and trust warning. Later work should add commands to accept existing docs as mapped durable outputs, richer UI for understanding depth, and templates for the durable project docs.
