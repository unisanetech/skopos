---
title: Agentic Coding Research Notes
status: active
owner: skopos-core
id: SKOPOS-REFERENCE-AGENTIC-CODING
scope: skopos
role: reference
lifecycle: durable
authority: supporting
provenance: observed
view: target
appliesTo:
  - workspace
freshness: review-when-agent-host-contracts-change
lastUpdated: 2026-07-28
---

# Agentic Coding Research Notes

Use this note to keep Skopos aligned with how current coding agents work without making Skopos depend on one vendor.

## Current Agent Pattern

Modern coding agents usually combine:

1. repo instruction files
2. chat or task prompt
3. local file search
4. shell command execution
5. tool-specific memory or session state
6. final summary and proof

This is powerful, but not enough for long-term project reliability. Instructions can be too broad, memory can be tool-specific, and agents can still drift when project truth is unclear.

## Lessons For Skopos

| Observed agent behavior | Skopos response |
| --- | --- |
| Agents read instruction files like `AGENTS.md`, `CLAUDE.md`, or Copilot instructions. | Generate compact instruction mirrors that point to Skopos memory roles. |
| Agents work best with focused Task context and clear acceptance criteria. | Give each Session a compact Task brief with relevant Memory, questions, risks, Actions, Guards, and Readiness. |
| Tool memory is useful but not shared across all agents or guaranteed to be current. | Keep durable project memory in the repo and compile it into `.skopos/**`. |
| Large instruction files can waste context and hide important rules. | Keep the hot path short; use progressive retrieval for details. |
| Agents can preserve old code, add duplicate patterns, or keep fallbacks forever. | Use accepted project Memory plus deterministic Guards and explicit clean-refactor policy. |
| Agents often need proof, not just a summary. | Tie acceptance criteria to fresh Evidence and explain closure Readiness. |

## Product Conclusion

Skopos should be the project operating memory for coding agents.

It should not try to replace Codex, Claude Code, Copilot, Cursor, or future agents. It should give all of them the same repo-owned truth:

- what the project is
- which Memory is canonical for the relevant Scope
- which Profile and project rules apply
- what cleanup is expected
- what questions are open
- which Actions and Guards apply
- what Evidence proves acceptance
- whether the Task is ready to continue, integrate, or close

## Required Shape

Skopos must keep three layers aligned:

| Layer | Owner | Purpose |
| --- | --- | --- |
| Project Memory | Project team and coding agents | Durable, scoped, readable project truth. |
| Local compiled state | Skopos runtime | Rebuildable indexes, Task state, Evidence, search, and UI projections under `.skopos/**`. |
| Session context | Skopos commands and host adapters | Compact Task guidance, applicable Memory, Actions, Guards, and Readiness. |

## External References

- OpenAI Codex AGENTS.md guide: `https://developers.openai.com/codex/guides/agents-md`
- OpenAI Codex workflows: `https://developers.openai.com/codex/workflows`
- OpenAI Codex memories: `https://developers.openai.com/codex/memories`
- Anthropic Claude Code memory: `https://docs.anthropic.com/en/docs/claude-code/memory`
- GitHub Copilot repository instructions: `https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions`

## Changelog

- 2026-07-28: Classified these authored observations under reference research rather
  than product authority.
- 2026-07-28: Recast the research conclusions in the canonical Project Memory, Task,
  Action, Guard, Evidence, and Readiness vocabulary.
- 2026-06-29: Added research notes from current coding-agent instruction, workflow, and memory patterns.
