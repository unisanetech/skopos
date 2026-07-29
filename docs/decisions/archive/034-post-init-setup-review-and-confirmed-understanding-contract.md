---
title: "Decision: Post-Init Setup Review And Confirmed Understanding Contract"
status: superseded
owner: skopos-core
id: SKOPOS-DECISION-034
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
  - ../../architecture/retrieval-and-query-strategy.md
  - ../../guides/bootstrap-a-project.md
---

# Decision: Post-Init Setup Review And Confirmed Understanding Contract

## Changelog

- `2026-07-28`: Superseded by Decision D-8d32a27b. Its fact/inference/assumption
  discipline is retained inside agent-guided adoption and approved restructuring.

- `2026-06-29`: Extended the contract so setup-review questions must be reviewable, answerable, persisted, and visible to `skopos next`; generated questions alone are not sufficient.
- `2026-06-29`: Accepted the post-init setup review contract so Skopos separates observed project facts, likely inferences, open assumptions, and user confirmation questions before those assumptions guide future agent work.

## Context

Skopos already has `init`, bootstrap artifacts, memory mapping, policy packs, trust, and an initial `understand` command. That is enough to detect a project shape, but it is not enough to safely guide future coding-agent behavior.

The core risk is simple: init-time detection can look confident while still making guesses.

Examples:

1. a brownfield repo may already have strong docs in a non-Skopos layout
2. a package may look like one archetype but actually be used as another
3. scripts may exist but not represent the team's real validation workflow
4. generated docs may be useful as an index but should not replace human-maintained docs
5. policy packs may be relevant but not yet accepted for the project

If Skopos stores those guesses as trusted memory too early, future agents can drift with more confidence instead of less.

## Decision

After `skopos init`, the next project-understanding step must produce a setup review layer before broad agent use.

The setup review separates:

1. **Facts**: directly observed project evidence
2. **Inferences**: likely conclusions based on observed patterns
3. **Assumptions**: useful working guesses that still need user confirmation
4. **Questions**: clear choices the user or agent should resolve before locking behavior
5. **Recommended actions**: the safest next steps after the review

Expected artifact:

1. `.skopos/understanding/setup-review.json`
2. `.skopos/understanding/setup-answers.json`

The review is part of `skopos understand`, not a separate memory system. Skopos itself remains the memory layer; the setup review is the first checkpoint that keeps that memory honest.

## Flow

The post-init onboarding flow is:

1. `skopos init .`
2. Skopos records observed repo facts in bootstrap, scopes, graphs, diagnosis, and memory artifacts.
3. `skopos understand .`
4. Skopos creates compact project understanding plus setup review.
5. The agent reviews assumptions and asks the user only for choices that affect future work.
6. Confirmed answers become durable project truth through config, memory, docs, decisions, or accepted policy packs.
7. Unconfirmed assumptions stay visible and must not be treated as canonical.

## Command Surface

Setup questions are project-understanding questions, not workflow-execution questions.

Use:

1. `skopos setup review .`
2. `skopos setup answer <question-id> <option-id> .`

Do not use `skopos decide` for setup-review answers. `skopos decide` remains for plan and mission workflow questions.

`skopos setup answer` must:

1. validate that the question and option exist
2. persist the answer in `.skopos/understanding/setup-answers.json`
3. refresh `.skopos/understanding/setup-review.json`
4. apply safe config-backed answers when the mapping is deterministic
5. leave non-config answers recorded as confirmed setup truth
6. refresh the knowledge index

## Rules

### Facts

Facts must be backed by direct evidence such as files, scripts, package metadata, config, docs, or generated Skopos artifacts.

### Inferences

Inferences may help orientation, but they must carry confidence and evidence. They should be phrased as likely, not guaranteed.

### Assumptions

Assumptions are allowed only as temporary working state. They should explain what Skopos is assuming, why it matters, and what confirmation would change.

### Questions

Questions should use simple language, include a recommended option first, and explain tradeoffs. They should be asked when the answer changes setup, docs organization, policy acceptance, validation gates, or agent workflow.

Answered setup questions should remain visible with their selected option. Open setup questions should stay visible in `skopos setup review`, `skopos understand`, and `skopos next` until answered.

### Existing Projects

For brownfield projects, Skopos should understand and map the existing repo before suggesting a Skopos-shaped structure. It may recommend docs cleanup, instruction updates, or policy acceptance, but important changes must be framed as suggestions until confirmed.

### New Projects

For greenfield projects, Skopos may recommend and scaffold a clearer default structure because there is less existing project truth to preserve.

## Non-Goals

This contract does not authorize Skopos to:

1. rewrite existing docs automatically
2. force every repo into the same folder tree
3. accept policy packs without user confirmation
4. turn inferred architecture into canonical architecture docs
5. block small edits when the setup review has unrelated open questions

## Consequences

### Positive

1. agents get useful project context earlier
2. users can see what Skopos knows versus what it is guessing
3. brownfield onboarding becomes safer and less pushy
4. future memory updates have a cleaner path from assumption to confirmed truth

### Costs

1. `skopos understand` becomes more important after init
2. the UI and CLI must show setup review state clearly
3. trust and workflow routing must avoid treating unconfirmed assumptions as proof

## Implementation Notes

The first implementation should keep the setup review compact:

1. generate it from existing bootstrap, scopes, diagnosis, and understanding artifacts
2. include counts in CLI output
3. index it in the knowledge layer
4. surface it in the UI as a human-readable project setup review
5. keep future confirmation commands optional until the review artifact is stable
