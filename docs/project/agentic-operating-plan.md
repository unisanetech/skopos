---
title: Agentic Operating Plan
status: active
owner: skopos-core
lastUpdated: 2026-06-29
---

# Agentic Operating Plan

Skopos exists to make coding agents safer and more useful on real projects. It should guide the agent before, during, and after implementation so the user does not need to repeat project rules in every chat.

## Product Thesis

Skopos is not a docs generator. It is a repo-native memory, workflow, and prompt-guidance layer for coding agents.

The agent still writes code. Skopos keeps the agent grounded.

Skopos works through three layers:

| Layer | Purpose |
| --- | --- |
| Human memory docs | Durable project truth that developers can read and maintain. |
| Generated Skopos state | Compact `.skopos/**` state for agents, UI, trust, search, and proof. |
| Command-guided agent briefs | Practical instructions for what the coding agent should read, ask, edit, check, remember, and close. |

The docs are the durable truth. The generated state is the fast machine layer. The commands are the operating guide for agents.

## Who Skopos Helps

Skopos is for developers who use coding agents to build, maintain, refactor, or rescue real projects.

It helps most when the developer does not want to repeat the same project context in every chat:

- what the project does
- which structure is intentional
- which old code should stay
- which old code should be removed
- which docs are trusted
- which rules, gates, and decisions matter
- what the agent should do next

The default language must stay clear enough for a beginner or mid-level engineer. Expert details can exist, but they should sit behind commands, files, or UI sections that a user opens intentionally.

## What Skopos Must Do

| Area | Required behavior |
| --- | --- |
| Setup | Detect project shape and ask only important confirmation questions. |
| Mode | Record whether the project is brownfield, clean-refactor, greenfield-in-existing-repo, or new-project. |
| Understanding | Treat scanner output as orientation only until an agent reviews the project and writes durable project memory. |
| Memory | Maintain compact docs for overview, architecture, domains, workflows, validation, decisions, and findings. |
| LLM guidance | Commands must output clear agent briefs: what to read, what to ask, what to edit, what to check, and how to close. |
| Workflow | Use light, normal, and workpack lanes so small tasks stay fast and risky tasks get structure. |
| Legacy cleanup | When the selected mode allows cleanup, agents should delete replaced legacy paths instead of adding duplicate hybrid systems. |
| Gates | Packs and project rules must connect to checks, grep gates, tests, or review obligations where practical. |
| Trust | Report readiness in simple language and block false-ready states when memory, questions, instructions, findings, or proof are incomplete. |
| UI | Show what Skopos knows, what needs confirmation, what is active, and what the next action is. |

## Role-Based Memory

Skopos requires complete memory roles, not one forced folder tree.

For a new project, Skopos can scaffold the recommended structure.

For an existing project, Skopos must first map what already exists:

- which doc explains project purpose
- which doc owns architecture
- which doc explains domains and features
- which doc lists workflows
- which doc or script owns validation and gates
- where decisions live
- where findings and risks live
- which instruction file is the agent entrypoint

If the existing docs are good, Skopos should use them. If they are messy, missing, duplicated, or stale, Skopos should recommend cleanup and explain why.

Required memory roles:

| Role | Required question answered |
| --- | --- |
| Project purpose | What is this project and what is it trying to achieve? |
| Architecture | Where does code belong and what boundaries must stay intact? |
| Domains and features | What are the main product areas and who owns them? |
| Workflows | What important user, system, job, and integration flows exist? |
| Validation and gates | How does the agent prove work is safe? |
| Decisions | What choices are already accepted and should not be reopened casually? |
| Findings and risks | What known issues, cleanup needs, and unsafe patterns exist? |
| Project mode and cleanup policy | Should the agent preserve, cleanly refactor, reset, or build fresh? |
| Agent instructions | What compact contract should Codex, Claude Code, Copilot, Cursor, or another agent follow? |

This keeps Skopos useful across real projects without making every repo look the same.

## Project Modes

| Mode | Use when | Agent behavior |
| --- | --- | --- |
| `brownfield` | The project is active and current behavior must be preserved. | Improve safely, preserve working flows, avoid rewrites without approval. |
| `clean-refactor` | The project exists, but the user wants cleanup without a full reset. | Replace duplicate or legacy paths when touched, update imports/tests/docs, and avoid permanent compatibility layers. |
| `greenfield-in-existing-repo` | A repo exists, but the current structure is not sacred. | Build toward the clean target architecture and do not preserve bad patterns by default. |
| `new-project` | The project is empty or genuinely starting fresh. | Use clean defaults and avoid legacy from day one. |

Existing repo detection must not automatically mean brownfield forever. Skopos must ask which mode the user wants.

## Command-Guided Agent Briefs

Every important command should help the coding agent act correctly.

`skopos next .` should be able to say:

```text
You are working in a brownfield SaaS app.

Read first:
- AGENTS.md
- docs/00-start-here.md
- docs/project/architecture.md

Current task:
- Improve billing form validation.

Lane:
- normal

Before editing:
- identify route, contract, service, and repository paths
- check whether payment or credit flow is touched
- ask the user if public behavior changes

After editing:
- run the focused validation commands
- update memory only if project truth changed

Do not:
- add a second validation pattern
- add a fallback legacy path
- edit generated files
```

The exact text should be generated from project mode, memory status, accepted packs, active findings, open questions, and touched scope.

## Setup Flow

```text
skopos init
  -> detect repo shape
  -> create initial state and instruction contract

skopos setup review
  -> confirm lifecycle/mode
  -> confirm archetype and docs root
  -> map existing docs to memory roles
  -> confirm cleanup policy
  -> surface only important assumptions

skopos understand
  -> scanner writes orientation
  -> agent reads real project
  -> agent writes durable memory docs
  -> rerun understand
  -> status becomes agent-reviewed

skopos trust
  -> verify readiness, memory, questions, instructions, findings, policy, proof
```

## Real Developer Flow

This is the target end-to-end flow after Skopos is installed in a project.

| Step | Developer intent | Skopos behavior | Agent behavior |
| --- | --- | --- | --- |
| 1. Install | Add Skopos without taking over the repo. | Creates the local Skopos state, config, and instruction contract. | Reads the generated instructions before changing code. |
| 2. Setup review | Confirm how this project should be treated. | Asks only important questions: project mode, docs root, archetype, cleanup policy, public-contract sensitivity. | Explains choices and recommends the safest option. |
| 3. Understand | Build real project memory. | Produces a scanner brief, then waits for agent-reviewed understanding docs before full readiness. | Reads code and docs, writes project overview, architecture, domains, workflows, validation, risks, and assumptions. |
| 4. Confirm | Remove dangerous guesses. | Tracks open assumptions and blocks false confidence until important answers are recorded. | Asks concise questions with recommended options and tradeoffs. |
| 5. Work | Route the requested change. | Selects light, normal, or workpack lane and returns the next concrete action. | Reads the compact brief, edits the right surface, avoids duplicate patterns, and updates progress. |
| 6. Prove | Check the change. | Runs or recommends the smallest sufficient gates, then records proof. | Reports what passed, what failed, and what remains risky. |
| 7. Remember | Keep project truth current. | Updates memory, decisions, findings, or policy only when project truth changed. | Does not leave important discoveries only in chat. |
| 8. Close | Finish without drift. | Blocks closure if proof, questions, cleanup, or memory updates are missing. | Gives a short final summary with files, checks, and next risk. |

Skopos should make this flow feel natural. It should not require the user to say "follow Skopos way" every time.

## Work Flow

```text
skopos start "<goal>"
  -> choose lane and scope
  -> ask blocking questions
  -> create mission/checklist

skopos next
  -> give the agent the next concrete action
  -> include reads, risks, prompts, gates, and closure expectations

skopos done
  -> verify proof
  -> block false completion
  -> report docs/memory updates and remaining risk
```

## Legacy Cleanup Rules

In `clean-refactor` or `greenfield-in-existing-repo` mode:

- Do not add a second routing, validation, state, data-access, config, or UI pattern when one canonical pattern should exist.
- If new code replaces old code, remove the old code or create an explicit removal item.
- Do not keep permanent fallbacks unless they are public compatibility paths with owner, expiry, and migration notes.
- Prefer deleting/renaming old exports first, then let typecheck reveal real cleanup work.
- Update tests and docs so the new pattern becomes the only durable truth.

## Skopos Self-Hosting Policy

Skopos must dogfood the same project-mode model it gives to other projects.

For Skopos itself:

| Surface | Policy |
| --- | --- |
| Internal runtime, UI, trust, indexer, docs engine, and workflow code | Use `clean-refactor`: remove replaced internal patterns when touched. |
| Public CLI commands, package exports, generated schemas, and adapter contracts | Use compatibility discipline: preserve behavior or ship explicit migration/versioning notes. |
| Transitional fallbacks | Keep only with owner, reason, affected surface, and removal condition or compatibility note. |

This prevents Skopos from becoming the kind of hybrid legacy system it is meant to help users avoid.

## Complications To Control

| Risk | Why it matters | Skopos control |
| --- | --- | --- |
| Process before progress | Agents and users will ignore Skopos if every small task becomes ceremony. | Automatic light, normal, and workpack lanes. |
| Scanner-only confidence | File detection cannot truly understand a project. | `understand` stays `brief-ready` until an agent writes reviewed project memory. |
| Existing docs conflict | Real repos often have docs in many places with unclear authority. | Memory map records canonical, supporting, generated, stale, and missing docs by role. |
| Legacy-preserving drift | Agents often add new code beside old code and call it safe. | Project mode plus cleanup policy controls whether old paths must be removed. |
| Duplicate truth | Workpacks, findings, docs, and chat can disagree. | Durable truth lives in project memory, decisions, findings, policy, and config; workpacks track execution only. |
| Token overload | Large docs make agents slower and less accurate. | Compact briefs first, progressive retrieval second, raw artifacts last. |
| Human confusion | Machine-first wording makes the UI feel like internal tooling. | Plain-English command output and UI copy, with raw JSON kept secondary. |
| False launch confidence | Passing typecheck is not enough to prove the workflow. | Proof fixtures and real project pilots must exercise install, understand, work, memory, and closure. |

## Implementation Priorities

Build this in seven concrete slices.

### Slice 1: Restore Proof And Readiness Correctness

Goal: Skopos must not claim agent-ready from scanner output alone.

Implement:

1. Update proof fixtures so `understanding-depth` requires agent-reviewed project memory.
2. Keep one scanner-only fixture that is expected to stay `needs-review`.
3. Make `pnpm proof` pass with the new standard.
4. Close the active documentation mission only after proof passes.

Done when:

- proof fixtures distinguish `brief-ready` from `agent-reviewed`
- `pnpm proof` passes
- the UI and trust output do not imply scanner-only understanding is enough

### Slice 2: Project Mode Contract

Goal: Existing repo does not automatically mean brownfield-preserve.

Implement:

1. Add durable setup support for `brownfield`, `clean-refactor`, `greenfield-in-existing-repo`, and `new-project`.
2. Store mode in setup answers, config-derived state, memory state, and agent briefs.
3. Add setup review questions that explain the practical difference between preserving behavior and cleaning legacy.
4. Show project mode in `trust`, `next`, and UI overview/memory surfaces.

Done when:

- a user can confirm the mode after init
- commands can explain what the chosen mode means for coding work
- trust warns if no mode is confirmed on a non-empty repo

### Slice 2b: Role-Based Memory Contract

Goal: Skopos should organize project truth by required role, not by forcing one docs tree.

Implement:

1. Make memory roles a first-class model surface.
2. Map existing docs, instructions, gates, decisions, and findings into those roles during setup and understand.
3. Ask confirmation questions when more than one source could own the same role.
4. Suggest docs cleanup when roles are missing, duplicated, stale, or contradictory.
5. Keep generated instruction mirrors compact and link them to the mapped memory roles.

Done when:

- existing projects with good docs are respected instead of duplicated
- weak-doc projects get clear missing-memory tasks
- the UI can show memory-role health without requiring raw JSON
- `skopos next` can tell agents exactly which memory roles to read for a task

### Slice 3: No-Legacy Cleanup Policy

Goal: Agents should not keep obsolete code unless the mode or public API requires it.

Implement:

1. Add a cleanup policy pack for duplicate patterns, old fallback paths, permanent shims, dead exports, and hybrid systems.
2. Connect the pack to grep gates, review checks, and proof obligations where practical.
3. Make cleanup requirements stricter in `clean-refactor` and `greenfield-in-existing-repo` modes.
4. Make public compatibility exceptions explicit, owned, and time-boxed.

Done when:

- Skopos can tell the agent when to delete old code
- trust reports cleanup obligations clearly
- pilots catch at least one duplicate or legacy-preserving risk

### Slice 4: Agent-Led Understanding V2

Goal: `skopos understand` should guide the agent to create real project knowledge, not only generated metadata.

Implement:

1. Generate an agent analysis brief with reading order, questions, expected docs, and confidence rules.
2. Require durable docs for overview, architecture, domains, workflows, validation, risks, and open assumptions before full readiness.
3. Add duplicate-pattern and cleanup-risk analysis for cleanup-oriented modes.
4. Record where each understanding claim came from: observed, inferred, user-confirmed, or agent-reviewed.

Done when:

- a fresh existing-project pilot produces useful project memory
- trust stays `needs-review` until the agent-written memory exists
- the UI shows what Skopos knows and what still needs confirmation

### Slice 5: Command-Guided Agent Briefs

Goal: Commands should tell coding agents exactly how to proceed.

Implement:

1. Make `skopos next` produce a compact agent prompt by default.
2. Include read-first files, selected mode, active lane, current work, risks, questions, gates, memory obligations, and "do not" rules.
3. Reuse the same guidance in `start`, `understand`, `trust`, `eval`, and `done`.
4. Keep JSON output stable for automation.

Done when:

- a coding agent can start a task from `skopos next` without broad guessing
- the output is short enough to paste into a chat
- the output tells the user what question is blocking progress when needed

### Slice 6: Workflow And UI Integration

Goal: The UI should show the same truth as the commands.

Implement:

1. Show project mode, memory readiness, open assumptions, active findings, cleanup obligations, current lane, and next action in the UI.
2. Keep raw generated state behind secondary disclosure.
3. Make mission checklist progress easy to understand and keep it synchronized through commands.
4. Show pack details as human review surfaces: rules, expected structure roles, local evidence, gates, and exceptions.

Done when:

- a user can understand why Skopos says the project is or is not ready
- the UI does not require reading JSON to know what to do next
- mission progress does not stay stale after command updates

### Slice 7: Real Pilots And Release Gate

Goal: Prove the system on real workflows before launch claims.

Implement:

1. Run a new-project pilot.
2. Run an existing brownfield-preserve pilot.
3. Run an existing clean-refactor pilot.
4. Run Skopos-on-Skopos dogfooding.
5. Run install smoke from a fresh external project.
6. Keep package metadata, versioning, README, license, and publish behavior release-ready.

Done when:

- `pnpm typecheck`, `pnpm test`, release smoke, and proof pass
- pilots produce useful memory and catch real risks
- install works through `npx`, `pnpm dlx`, and `npm exec`
- remaining launch risks are tracked as findings, not hidden in chat

## Success Standard

Skopos is working when agents consistently:

1. understand first
2. ask only important questions
3. use real project rules
4. choose the right lane
5. do the smallest correct change
6. remove legacy when the selected mode says cleanup
7. run the right gates
8. update memory when truth changes
9. close only with proof

## Changelog

- 2026-06-29: Added the Skopos self-hosting policy: internal work uses clean-refactor behavior while public surfaces use compatibility discipline.
- 2026-06-29: Added the role-based memory model and three-layer Skopos operating model after reviewing current coding-agent instruction and memory patterns.
- 2026-06-29: Added the final agentic operating plan covering project modes, command-guided prompts, cleanup policy, setup flow, and implementation priorities.
