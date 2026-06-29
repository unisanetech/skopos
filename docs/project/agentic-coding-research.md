---
title: Agentic Coding Research Notes
status: active
owner: skopos-core
lastUpdated: 2026-06-29
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
| Agents work best with focused task context and clear done criteria. | Make `skopos next` return a compact brief with reads, questions, risks, gates, and closure rules. |
| Tool memory is useful but not shared across all agents or guaranteed to be current. | Keep durable project memory in the repo and compile it into `.skopos/**`. |
| Large instruction files can waste context and hide important rules. | Keep the hot path short; use progressive retrieval for details. |
| Agents can preserve old code, add duplicate patterns, or keep fallbacks forever. | Use project mode plus no-legacy cleanup policy and trust warnings. |
| Agents often need proof, not just a summary. | Tie packs and workflows to validation gates, proof artifacts, and closure checks. |

## Product Conclusion

Skopos should be the project operating memory for coding agents.

It should not try to replace Codex, Claude Code, Copilot, Cursor, or future agents. It should give all of them the same repo-owned truth:

- what the project is
- what docs are canonical
- what mode the project is in
- what patterns are accepted
- what cleanup is expected
- what questions are open
- what gates prove work
- what the agent should do next

## Required Shape

Skopos must keep three layers aligned:

| Layer | Owner | Purpose |
| --- | --- | --- |
| Human memory docs | Project team and coding agents | Durable readable project truth. |
| Generated state | Skopos runtime | Fast compact machine-readable memory, trust, proof, search, and UI state. |
| Command briefs | Skopos commands | Practical task guidance for coding agents. |

## External References

- OpenAI Codex AGENTS.md guide: `https://developers.openai.com/codex/guides/agents-md`
- OpenAI Codex workflows: `https://developers.openai.com/codex/workflows`
- OpenAI Codex memories: `https://developers.openai.com/codex/memories`
- Anthropic Claude Code memory: `https://docs.anthropic.com/en/docs/claude-code/memory`
- GitHub Copilot repository instructions: `https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions`

## Changelog

- 2026-06-29: Added research notes from current coding-agent instruction, workflow, and memory patterns.
