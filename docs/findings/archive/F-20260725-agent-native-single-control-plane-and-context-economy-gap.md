---
title: F-20260725 Agent-Native Single Control Plane And Context Economy Gap
status: superseded
owner: skopos-core
id: SKOPOS-F-20260725-AGENT-NATIVE-SINGLE-CONTROL-PLANE-AND-CONTEXT-ECONOMY-GAP
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-07-28
relatedDocs:
  - ../README.md
  - ../../architecture/agent-native-operating-model.md
  - ../../decisions/archive/039-agent-native-single-control-plane-and-project-adoption-contract.md
  - ../../work/archive/P1-W11-agent-native-single-control-plane-convergence.md
---

# F-20260725 Agent-Native Single Control Plane And Context Economy Gap

## Changelog

- `2026-07-28`: Superseded by
  `../F-c1e8c13d-prototype-product-contract-convergence-gap.md` after still-valid behavior
  was promoted into Decision D-8d32a27b, the canonical convergence Plan, and capability
  disposition Task T-51c74ec2.

- `2026-07-25`: Opened after architecture review found that Skopos's individually useful
  planning, mission, question, program, discussion, eval, trust, pack, and projection
  surfaces can collectively duplicate modern agent capabilities and prevent complete
  downstream-project adoption through one workflow authority.

## Summary

- Severity: `MUST`
- Status: `active`
- Owner: `skopos-core`
- Target Pack: `P1-W11`

Skopos needs to converge on one agent-native workflow authority with compact task intent,
progressive context, project actions, deterministic guards, acceptance-linked proof, and
source-bound receipts. Complex projects must extend that authority rather than maintain
parallel LLM workflows.

## Evidence

1. the public workflow exposes overlapping `start`, `next`, `plan`, `mission`, `eval`,
   `trust`, `done`, `program`, and discussion concepts
2. ordinary eval can execute a broad configured command family sequentially rather than
   selecting proof by execution phase and changed scope
3. current self-hosted `.skopos/**` state demonstrates high projection and checkpoint
   volume even though most state is local-only
4. current extension concepts expose workflows, policies, gates, adapters, and packs
   without one smallest public model
5. a complex adopter could otherwise retain its own start/verify/done workflow beside
   Skopos

## Required Outcome

1. one compact `context + actions + guards` project contract
2. separate admission, iteration, stabilization, and closure execution moments
3. one task contract with goal, scope, acceptance, non-goals, constraints, decisions,
   and proof when persistence is justified
4. provenance-aware memory and explicit promotion of inferred/proposed truth
5. negative knowledge for retired, rejected, and failed patterns
6. acceptance-criterion-to-evidence closure
7. source-bound proof receipts and exact-command deduplication
8. task/worktree-aware active state
9. automatic, configuration, and provider-protocol extension levels
10. one host-neutral project model with generated host projections
11. a compact artifact budget and disposal/retention rules
12. proof on complex and non-complex external project shapes

## Non-Goals

1. removing public commands before migration proof
2. forcing every project into one docs tree
3. embedding one adopter's architecture grammar in Skopos core
4. implementing another general-purpose coding agent
