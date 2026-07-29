---
title: Agent Communication Session Delivery
status: historical
owner: skopos-core
id: T-4c2e91ad
scope: skopos
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: transition
lastUpdated: 2026-07-29
relatedDocs:
  - ../plans/P-e7e888e6-canonical-product-convergence.md
  - ../../decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md
  - ../../patterns/PAT-7bc9a41e-passive-guidance-without-host-delivery.md
reviewCycle: when the Session communication contract changes
---

# Agent Communication Session Delivery

## Changelog

- `2026-07-29`: Completed and archived after affected-package types passed, focused
  contract tests passed, both host projections used the shared command, and Unisane
  rebuilt cleanly from current tracked inputs.
- `2026-07-29`: Corrected the activation classification after E2E proof showed that a
  global warning made every otherwise-ready Project unclosable. Generated capability
  now passes Project readiness while explicitly leaving host activation unverified.
- `2026-07-29`: Started the bounded Phase 8 slice for shared Session delivery,
  complete decisions, host parity, honest readiness, and Unisane cutover.

## Goal

Make Skopos response and decision guidance reach coding-agent Sessions through one
compact contract instead of optional artifact discovery or host-specific summaries.

## Acceptance

1. one canonical communication contract owns response modes and question behavior
2. one `skopos session context` payload carries compact rules, current route, resume
   state, and a complete primary pending decision
3. Claude and Codex generated adapters invoke that same payload
4. direct answers do not require lane announcements
5. every pending decision exposes recommendation, reason, alternatives, blocking
   state, and default behavior
6. readiness does not equate generated adapter files with verified host activation
7. focused type and behavior proof passes
8. Unisane adopts the current clean configuration and regenerated projections

## Completion

Completed. Unisane now starts from `skopos session context`, its old local Skopos tree
was replaced by the current cache/index layout, and the retired document-projection
config was removed. Generated adapter capability can satisfy Project readiness, but
its summary does not claim automatic delivery until the host boundary is verified.
