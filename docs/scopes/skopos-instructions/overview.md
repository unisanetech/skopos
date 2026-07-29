---
title: "Scope: instructions"
status: active
owner: skopos-core
id: SKOPOS-SCOPE-INSTRUCTIONS
scope: skopos-instructions
role: overview
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-28
relatedDocs:
  - ../../architecture/docs-governance.md
reviewCycle: when owning truth changes
---

# Scope: instructions

The `instructions` scope owns instruction mirror generation, parity checks, and generated tool-adapter surfaces.

## Changelog

- `2026-07-28`: Moved this overview into its canonical Scope Memory root and
  bound it to the stable Scope id.

- `2026-06-25`: Updated the instructions scope after the generated manual host adapter guide landed, so unsupported coding agents now receive an explicit workflow-router fallback contract under `.skopos/cache/tooling/manual-hosts/`.
- `2026-04-13`: Updated the instructions scope after the Codex wrapper-mediated adapter landed, so `instructions sync` now refreshes instruction mirrors, generated Claude Code hooks, the generated Codex wrapper adapter, and `.skopos/index/enforcement.json` together.
- `2026-04-09`: Updated the instructions scope to reflect the compiled enforcement profile and generated Claude Code hook adapter outputs.
- `2026-04-09`: Updated the instructions scope to reflect that it now checks mirror parity in addition to generating mirrors.
- `2026-04-09`: Updated the instructions scope to reflect that mirror sync now writes `CLAUDE.md`, `.cursor/rules/project.mdc`, and `.github/copilot-instructions.md` from `AGENTS.md`.
- `2026-04-09`: Added the initial `instructions` scope doc as part of the self-hosting package map.

## Current Responsibilities

The `instructions` package currently owns:

1. reading canonical `AGENTS.md`
2. generating mirror content with generated-file headers
3. checking mirror parity against `AGENTS.md`
4. writing `CLAUDE.md`
5. writing `.cursor/rules/project.mdc`
6. writing `.github/copilot-instructions.md`
7. compiling the enforcement profile under `.skopos/index/enforcement.json`
8. generating Claude Code hook adapter outputs under `.skopos/cache/tooling/claude-code/`
9. generating Codex wrapper adapter outputs under `.skopos/cache/tooling/codex/`
10. generating the manual fallback guide for unsupported coding agents under `.skopos/cache/tooling/manual-hosts/`
