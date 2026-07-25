# P1-W12 Project-Adapted Skill Packs

Historical execution workpack for adding researched, task-selective skills to the
existing Skopos pack and context/action/guard system.

## Metadata

- Status: `historical`
- Temporary: `yes`
- Owner: `skopos-core`
- Scope: `skopos/skills`
- Last Updated: `2026-07-25`
- Removal Rule: fulfilled after typed contracts, recommendation and acceptance,
  project binding, task selection, host projection, trust, fixtures, self-host proof,
  and a packed-CLI external-project proof passed
- Related Docs:
  - `../../decisions/040-project-adapted-skill-packs-as-capability-projections.md`
  - `../../architecture/agent-native-operating-model.md`
  - `../../architecture/workflow-extension-model.md`

## Objective

Let Skopos recommend, adapt, validate, and project high-quality project skills without
creating another workflow, memory, command, or closure authority.

## Guardrails

1. keep `context + actions + guards` as the only public operating primitives
2. reuse the existing pack catalog, recommendation, acceptance, role-mapping, trust,
   host-projection, and proof patterns
3. require explicit approval before adopting or materially updating a skill
4. bind project truth by reference rather than copying it into skill prompts
5. keep deterministic rules in policies or guards and executable behavior in actions
6. enforce compact selection and negative triggers
7. do not claim host-native installation until its projection and verification exist

## Slices

1. typed skill-pack, binding, recommendation, and resolved-state contracts
2. strict pack and project-binding loaders
3. recommendation and explicit adoption runtime
4. task-time compilation into context/actions/guards
5. host projection and trust parity
6. researched `ui.product-craft` example with good and drift fixtures
7. effectiveness evidence and cross-project proof

## Acceptance Criteria

1. one built-in skill pack and one project binding load through strict schemas
2. recommendations show signals, anti-signals, confidence, missing roles, and source
3. adoption records actor, reason, pack version, and binding provenance
4. accepted skills compile without duplicating actions, guards, or project truth
5. task selection explains why a skill was selected and stays within its context budget
6. missing roles, unknown action/guard ids, and authority capture fail closed
7. generated host projections carry pack, binding, capability, and source-digest parity
8. trust reports skill-source, binding, projection, and freshness posture
9. the Product UI Craft pack includes research provenance, guidance, rubric, and proof
   fixtures
10. canonical checks, proof scorecard, and `skopos done` pass

## Non-Goals

1. a second skill workflow or `skills done` authority
2. automatic installation without user approval
3. copying whole project documentation trees into `.skopos`
4. claiming subjective rubric scores are deterministic closure proof
5. a public marketplace or remote distribution service in this workpack

## Incremental Status

1. `implemented`: typed contracts, strict loaders, CLI, recommendation, and explicit
   adoption
2. `implemented`: compact task selection into context plus existing actions and guards
3. `implemented`: source-digest host projections and trust parity
4. `implemented`: researched Product UI Craft pack, guidance, rubric, and good/drift
   fixtures
5. `implemented`: self-host adoption, live UI visibility, canonical checks, trust, and
   proof scorecard
6. `implemented`: packed-CLI external-project install, binding, recommendation,
   acceptance, five-host projection, and skill trust checks

## Verification Notes

1. `pnpm typecheck`, `pnpm test`, and `pnpm build` passed.
2. The normal suite passed 85 tests across CLI and UI packages.
3. `quality.run-proof-phase` passed the proof-phase e2e scorecard.
4. The release install smoke packed the CLI, installed it into a fresh project, loaded
   the bundled Product UI Craft pack, accepted an external project binding, generated
   five host projections, and passed accepted-skill, binding, and projection trust.
5. Skopos self-host trust reached `high` and `agent-ready` with no warnings or failures.
6. The live UI exposes accepted task skills and host projection count under Rules.
