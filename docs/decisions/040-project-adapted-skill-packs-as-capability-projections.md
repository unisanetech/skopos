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
lastUpdated: 2026-08-04
relatedDocs:
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md
  - ../findings/F-20260804-skill-selection-proof-and-portability-gap.md
  - ../findings/archive/F-20260804-self-hosted-derived-output-evidence-cycle.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
  - ../architecture/agent-native-operating-model.md
  - ../architecture/action-extension-model.md
  - ../work/archive/P1-W12-project-adapted-skill-packs.md
---

# Decision: Project-Adapted Skill Packs As Capability Projections

## Changelog

- `2026-08-04`: Implemented Task-aware selection and task-wide budgets. Runtime now
  builds one deterministic envelope from the available Task contract, Scope ancestry,
  owned and changed paths, inferred path capabilities, selected Actions, applicable
  Guards, accepted failure evidence, phase, risk, and lifecycle. Positive intent plus
  relevant applicability is required; anti-signals, generated-only changes, review
  phase mismatch, duplicate judgment, and risk-based pack/module/token ceilings produce
  structured suppression explanations.
- `2026-08-04`: Implemented the first model/loader hard cut: the strict v1 manifest
  now owns narrow pack boundaries and module-local signals, applicability, project
  roles, rubric dimensions, and failure references. Guidance cost is measured by the
  loader, obsolete pack-global fields are rejected, and `ui.product-craft` plus its
  accepted binding now begin at `0.1.0`.
- `2026-08-04`: Accepted the first-version clean hard cut. Skopos remains on one
  `schemaVersion: 1`; every built-in Skill begins at `0.1.0`; the current internal UI
  pack numbering is not a compatibility promise. Added the "teach the delta, not the
  discipline" doctrine, task-wide measured budgets, module-local capability binding,
  exact content-bound acceptance, behavioral evaluation, and narrow pack ownership.
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

Skopos is not publicly launched. The Skill system therefore follows the repository's
clean-refactor policy: replace the current internal shape in place, update every
consumer together, and delete obsolete fields and behavior. There is no product need
for a second schema generation, migration adapter, fallback parser, dual selector, or
old-pack compatibility path.

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
12. Skill guidance teaches the delta between a generally capable coding agent and the
    project-sensitive judgment that agents still apply poorly. It does not reteach
    framework basics, generic clean code, elementary testing, or introductory design.
13. Zero selected Skills is a correct result. A Skill requires structured positive
    evidence, must be suppressed by a matching anti-signal, and must fit one task-wide
    measured pack, module, and token budget. Keyword overlap may rank an eligible
    module but cannot establish eligibility by itself.
14. Project Memory is preferred before generic guidance. A selected module binds only
    the project context, Actions, Guards, rubric dimensions, and failure signals it
    actually needs; matching one module cannot select every capability in its pack.
15. The pre-release Skill system has one canonical `schemaVersion: 1`. Every built-in
    pack starts at `0.1.0`, including `ui.product-craft`. The clean hard cut updates the
    schema, selector, packs, bindings, fixtures, projections, tests, and docs together
    without migrations, aliases, deprecated formats, parallel runtimes, or silent
    fallback.
16. Pack versions identify evaluated content; they are not a public compatibility
    promise before launch. Acceptance binds the exact pack, binding, rubric, fixture,
    project-source, and evaluation digests. A material change requires fresh review
    and cannot inherit approval from an unchanged version label.
17. Packs own narrow judgment boundaries and declare explicit exclusions and overlap
    rules. One primary surface pack normally owns a page. Additional packs load only
    when they contribute distinct flow, component, accessibility, performance,
    security, or data-interface judgment.
18. Normal Task context contains only selected module guidance and compact project
    adaptation. Research provenance, full rubrics, inactive modules, evaluator oracles,
    and catalog documentation remain outside the hot path.
19. Pack promotion requires deterministic selection fixtures, paired no-Skill or
    prior-version forward tests, bounded local telemetry, a real project canary, and
    portable proof in Skopos plus one non-Skopos project for reusable built-in packs.

## Implemented Baseline

The first canonical schema and loader now enforce the following in place:

1. pack ownership states one purpose, owned judgments, exclusions, and overlap rules
2. every module owns its positive and negative signals, applicability, project roles,
   rubric dimensions, and failure-signal references
3. module guidance size is measured from the loaded source; authored token estimates
   are not accepted
4. obsolete pack-global selection, role, adaptation-question, and context-module
   fields fail strict validation
5. the current runtime resolves only the context, Actions, and Guards named by selected
   modules
6. the initial Product UI Craft pack and its accepted project binding use `0.1.0`
7. Task admission passes current owned and changed paths into one normalized Skill
   signal envelope instead of reducing selection to the goal and Scope label
8. module eligibility requires positive structural intent plus Scope, path, capability,
   or accepted failure applicability; filenames may support applicability but cannot
   establish intent
9. light, standard, and high-impact Tasks enforce one shared pack, module, and measured
   token ceiling across all accepted packs
10. every selected or suppressed module records a structured reason, evidence IDs, and
    measured cost; selected modules expose only their rubric, failure, context, Action,
    and Guard references

Exact digest caching, content-bound acceptance, full deterministic fixture coverage,
behavioral evaluation, and portable adoption proof remain later phases of the active
Plan and Finding.

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
5. pack evolution requires measured proof rather than accumulating advice
6. the clean pre-release cut requires coordinated updates across all Skill consumers

## Rejected Alternatives

1. a standalone skill marketplace with its own accepted state and workflow
2. copying project docs and design systems into large skill prompts
3. allowing skills to execute commands or declare closure
4. silently installing skills when a pattern is inferred
5. storing one manually maintained skill copy per coding-agent host
6. teaching broad software-engineering disciplines that capable agents already know
7. loading all accepted packs or all modules for every Task
8. preserving current internal pack numbering or schema behavior through a
   compatibility layer before launch
9. automatically converting one user correction into permanent Skill guidance

## Proof Requirement

1. a generic skill pack loads and validates from versioned source
2. a project binding resolves authoritative context, action, and guard roles
3. positive triggers select the skill and negative triggers suppress it
4. compact task context remains within budget
5. undeclared capabilities and authority capture fail validation
6. host projections retain one source identity and capability coverage
7. good and drift fixtures prove the pack's intended quality boundary
8. Skopos plus one non-Skopos project prove portable adoption
9. task-wide measured budgets prevent accepted packs from accumulating context
10. Task selection uses acceptance, constraints, non-goals, decisions, owned and
    changed paths, risk, capabilities, and accepted failure evidence
11. selected modules bind only their relevant context, Actions, Guards, rubric
    dimensions, and failure signals
12. exact content digests invalidate stale acceptance and stale host projections
13. deterministic negative, ambiguous, overlap, generated-output, and budget fixtures
    pass without a model call
14. paired forward tests show a material quality or rework improvement over no Skill or
    the prior evaluated source without violating cost, safety, or authority gates
15. the first canonical system and every initial built-in pack remain on
    `schemaVersion: 1` and `0.1.0` with no compatibility code
