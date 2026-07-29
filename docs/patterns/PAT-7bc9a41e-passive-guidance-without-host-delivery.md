---
title: "Failure Pattern: Passive Guidance Without Host Delivery"
status: active
owner: skopos-core
id: PAT-7bc9a41e
scope: skopos
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: accepted
view: current
appliesTo:
  - agent-communication
  - host-adapters
  - session-start
  - decisions
  - readiness
lastUpdated: 2026-07-29
relatedDocs:
  - ../decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md
  - ../architecture/agent-native-operating-model.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when Session context or host activation proof changes
---

# Failure Pattern: Passive Guidance Without Host Delivery

## Changelog

- `2026-07-29`: Accepted after communication guidance was generated into a local
  artifact but Claude and Codex session adapters injected only handoff and router
  summaries, while readiness treated generated integration files as working
  automation.
- `2026-07-29`: Separated Project readiness from host-activation truth. A supported
  direct Session fallback keeps the Project usable, while the capability summary
  still refuses to claim automatic delivery without host proof.

## Failure Shape

The system generates correct agent guidance or decision data but leaves each coding
agent to discover, load, combine, and obey it. Host adapters inject a smaller,
independently assembled summary, and readiness reports the generated adapter as active
without proving that the host installed or invoked it.

## Detection Signals

1. instructions say “load this file when available”
2. different host adapters build prompt context independently
3. a pending question loses its recommendation, alternatives, or default behavior
4. generated files are called automation without host-boundary evidence
5. behavior changes between fresh sessions even though Project Memory is unchanged
6. fixing response style requires adding more prompt text instead of correcting delivery

## Why It Fails

Coding agents cannot reliably follow memory they never receive. Independent adapter
summaries drift, optional reads consume tokens without guaranteeing behavior, and
generated files prove projection rather than activation. The result looks implemented
inside Skopos while the developer still experiences ordinary agent responses.

## Prevention

1. own one compact host-neutral Session-context compiler
2. project the same command into every supported adapter
3. include the complete primary pending decision and deterministic default behavior
4. keep durable response rules in the canonical instruction projection
5. inject only the compact dynamic tail at Session start
6. distinguish generated, installed, injected, and verified states in capability
   claims without making optional host activation a global Project-readiness blocker
7. keep direct CLI retrieval as the truthful fallback for advisory-only hosts

## Recovery

Remove host-local context composition, route adapters through the shared Session
contract, regenerate projections, verify the exact injected marker and decision
fields, and downgrade readiness until host activation is proved.

## Retrieval

Retrieve this Pattern when agent behavior does not match generated guidance, host
support appears implemented only in `.skopos/**`, decision prompts lose detail, or
fresh sessions ignore Project Memory.
