---
title: "Decision 005: Tool-Native Enforcement Strategy"
status: active
owner: skopos-core
id: SKOPOS-DECISION-005
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
lastUpdated: 2026-08-05
relatedDocs:
  - README.md
  - ../architecture/runtime-model.md
  - ../architecture/artifact-model.md
  - ../architecture/action-extension-model.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
reviewCycle: per convergence phase
---

# Decision 005: Tool-Native Enforcement Strategy

Use this decision to keep Skopos enforcement practical in real coding tools without turning tool-specific hooks into the primary product surface.

## Changelog

- `2026-08-05`: Reconciled the host matrix with implemented Claude Code native hooks,
  Codex wrapper delivery, and truthful manual fallback while retaining CLI and MCP as
  the portable runtime authority.
- `2026-04-09`: Added the tool-native enforcement strategy decision after implementing the compiled enforcement profile, generated Claude Code hook adapter, and proof benchmark coverage.

## Decision

1. Skopos will keep CLI and MCP as the stable core enforcement surfaces.
2. Skopos will generate tool-native adapters where a coding tool offers deterministic hooks or equivalent enforcement seams.
3. Implemented host delivery is capability-specific:
   - Claude Code uses generated native hooks under `.skopos/cache/tooling/claude-code/`
   - Codex uses the generated wrapper manifest and adapter under
     `.skopos/cache/tooling/codex/`
   - hosts without a verified lifecycle seam use the generated manual-host guide and
     must not be described as automated
4. Tool-native adapters must be compiled from Skopos knowledge and accepted policy
   rather than hand-authored project scripts.
5. Host adapters project the shared Session, instruction-sync, discussion-handoff,
   Action-recovery, and Readiness commands only where the host can deliver them
   truthfully. Native stop blocking remains specific to a verified lifecycle seam.
6. When a tool does not support hooks or equivalent enforcement, Skopos falls back to
   CLI and MCP guidance plus explicit Guards and Readiness instead of pretending the
   same automation exists.

## Why

1. Instructions alone are too weak for real workflows; agents need deterministic enforcement at the tool seam when the tool supports it.
2. CLI and MCP remain the most portable contract, so tool-native support should extend the core rather than replace it.
3. Generated adapters are safer than ad hoc hook scripts because they stay tied to
   Skopos verification behavior and can be regenerated as the system evolves.
4. Brownfield proof needs more than file generation; it needs proof that a real hook adapter can sync mirrors and block false closure.

## Consequences

1. `.skopos/index/enforcement.json` becomes a first-class compiled artifact describing the active enforcement profile.
2. `.skopos/cache/tooling/**` becomes the generated home for tool-native adapter outputs.
3. Proof coverage must exercise the claimed adapter behavior, not only assert that
   generated files exist; manual fallback is verified as reviewed delivery, not native
   automation.
4. Future tool-native integrations should follow the same rule:
   - generated from the enforcement profile
   - optional over the stable CLI and MCP core
   - benchmarked before being treated as a reliable enforcement path
5. Release proof exercises the portable CLI, Task reconstruction, coordination,
   adoption, Evidence, and Readiness surfaces.
