# Scope: instructions

The `instructions` scope owns instruction mirror generation, parity checks, and generated tool-adapter surfaces.

## Metadata

- Doc ID: `SKOPOS-SCOPE-INSTRUCTIONS`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/scopes`
- Canonical: `yes`
- Last Updated: `2026-04-13`
- Review Cycle: `per workpack`
- Related Docs:
  - `../architecture/docs-governance.md`

## Changelog

- `2026-04-13`: Updated the instructions scope after the Codex wrapper-mediated adapter landed, so `instructions sync` now refreshes instruction mirrors, generated Claude Code hooks, the generated Codex wrapper adapter, and `.skopos/enforcement.json` together.
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
7. compiling the enforcement profile under `.skopos/enforcement.json`
8. generating Claude Code hook adapter outputs under `.skopos/tooling/claude-code/`
9. generating Codex wrapper adapter outputs under `.skopos/tooling/codex/`
