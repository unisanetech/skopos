---
title: "Decision: Project-Adapted Skill Packs As Capability Projections"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-040
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-07-25
lastUpdated: 2026-07-28
relatedDocs:
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
  - ../architecture/agent-native-operating-model.md
  - ../architecture/action-extension-model.md
  - ../work/archive/P1-W12-project-adapted-skill-packs.md
---

# Decision: Project-Adapted Skill Packs As Capability Projections

## Changelog

- `2026-07-28`: Made the product Skill catalog one shared discovery boundary for
  Runtime mutation and Trust verification. Workspace-local packs still determine
  optional pre-adoption guidance, while accepted bindings resolve their exact
  `packId@version` from the same project, bundled, or source catalog used by
  `skills apply`.
- `2026-07-28`: Retained only the principle that Skills project task-selective guidance
  into existing Memory, Actions, and Guards. Skills cannot own Task state, execution,
  Evidence authority, or closure.

- `2026-07-25`: Accepted project-adapted skill packs as task-selective projections over
  the existing pack catalog and context/action/guard model.

## Context

Coding agents benefit from researched, project-specific craft guidance for work such as
brand-consistent UI, React rendering boundaries, responsive behavior, accessibility,
interface writing, and evidence-based SEO. Policies and guards can state or enforce hard
rules, but they do not teach the judgment needed to apply project truth well in a
specific task.

Adding an independent skills workflow, memory store, command runner, or host-specific
prompt collection would duplicate the authority contract accepted in Decision
D-8d32a27b.

## Decision

1. Skill packs are a pack kind inside the existing Skopos capability system.
2. A skill compiles into task-relevant context, references existing actions, and selects
   existing guards; it is not a fourth operating primitive.
3. Built-in packs are versioned Skopos product assets. Project adaptations are
   checked-in bindings to authoritative project docs, tokens, examples, actions, and
   guards.
4. Generated recommendation, resolved-state, and host-projection artifacts are views,
   not new project-truth authority.
5. Skopos may recommend a skill from explicit project signals or repeated accepted
   failure evidence, but adoption and material updates require user approval.
6. Skills cannot own task state, workflow execution, receipts, or closure.
7. Deterministic invariants remain policies or guards; executable capabilities remain
   actions; canonical facts remain project docs or memory.
8. One accepted skill definition renders host-specific projections. Hand-maintained
   Codex, Claude, Copilot, Cursor, or fallback copies are not independent truth.
9. A product-grade skill requires positive and negative triggers, provenance, project
   role bindings, compact-context limits, examples and anti-patterns, a review rubric,
   freshness rules, and proof fixtures.
10. Effectiveness is measured through task relevance, context cost, repeated
    corrections, guard failures, supervision, and false-closure effects.
11. Runtime commands and Trust resolve accepted Skill sources through one product
    catalog owner. A bundled pack must not be accepted by one consumer and reported
    missing by another.

## Consequences

### Positive

1. project craftsmanship becomes reusable without expanding the daily workflow
2. agents receive deep guidance only when a task needs it
3. project docs, actions, and guards retain their current owners
4. host-specific skill formats remain generated projections
5. repeated failure evidence can improve guidance with explicit human approval

### Costs

1. pack validation and role binding become more sophisticated
2. subjective quality needs fixtures, rubrics, and human-review evidence
3. host projections need capability and freshness parity checks
4. recommendations must avoid turning one-off mistakes into permanent process

## Rejected Alternatives

1. a standalone skill marketplace with its own accepted state and workflow
2. copying project docs and design systems into large skill prompts
3. allowing skills to execute commands or declare closure
4. silently installing skills when a pattern is inferred
5. storing one manually maintained skill copy per coding-agent host

## Proof Requirement

1. a generic skill pack loads and validates from versioned source
2. a project binding resolves authoritative context, action, and guard roles
3. positive triggers select the skill and negative triggers suppress it
4. compact task context remains within budget
5. undeclared capabilities and authority capture fail validation
6. host projections retain one source identity and capability coverage
7. good and drift fixtures prove the pack's intended quality boundary
8. Skopos plus one non-Skopos project prove portable adoption
