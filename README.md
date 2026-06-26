# Skopos

Skopos is a local-first project intelligence layer for developers who use coding agents.

It helps an agent understand your project, remember important decisions, follow your team rules, choose the right workflow size, and prove that work is ready before it is closed. The goal is simple: less repeated explanation, less drift, and better software work from the same coding agent you already use.

Skopos is not tied to one framework or one codebase. You can add it to a new project or an existing project. It reads the project, writes local project memory, creates agent guidance, and keeps the important context close to the code.

## Why Use Skopos

Coding agents are useful, but they can lose context. They may forget previous decisions, miss project rules, create a second pattern, or finish work without enough proof. This gets worse as a project grows.

Skopos gives the agent a stable project memory and a clear way to work. It keeps the everyday path light for small tasks, but it can use stronger planning, checks, and progress tracking when the work is large or risky.

Use Skopos when you want:

- agent instructions that stay connected to the real project
- project memory that survives across chats and tools
- clear rules for architecture, stack choices, naming, UI structure, and validation
- guided workpacks for large changes
- human-readable status, progress, blockers, and next steps
- confidence checks before calling work done

## Quick Start

Run Skopos in a project folder:

```bash
npx @skopos/cli init .
```

With pnpm:

```bash
pnpm dlx @skopos/cli init .
```

With explicit npm exec:

```bash
npm exec --package @skopos/cli -- skopos init .
```

After setup, use the `skopos` command inside the project:

```bash
skopos understand .
skopos policies recommend .
skopos program next . --compact
skopos trust . --compact
```

## What Skopos Adds To A Project

Skopos creates local project knowledge under `.skopos/`. This folder stores the project memory that agents can use without rereading the whole repository every time.

Skopos can also create or update `AGENTS.md`. That file gives coding agents clear project guidance, such as how to inspect the codebase, when to ask questions, which rules to follow, and which checks to run before finishing.

Generated files are meant to be readable by humans. A developer should be able to open Skopos output and understand what is happening without knowing every internal term.

## How It Works

Skopos uses a progressive workflow.

For a small task, the agent should stay fast. It reads a compact brief, checks the relevant files, edits the code, runs focused validation, and updates memory only when a real project fact changed.

For larger or riskier work, Skopos can guide the agent through a stronger path. It can create a mission or workpack, split the work into phases, track open questions, record decisions, show progress, run staged gates, and close only when there is enough proof.

This keeps Skopos useful without making every small task feel like a ceremony.

## Main Ideas

### Project Memory

Skopos stores important project facts in a local memory layer. This helps agents avoid repeating discovery work and reduces the chance that they ignore existing patterns.

### Agent Guidance

Skopos keeps agent instructions close to the project. The guidance is meant to be direct and practical, so a coding agent knows how to work and a developer can understand what the agent is being told.

### Policy Packs

Policy packs are reusable rules for common product needs. A pack can describe architecture expectations, stack recommendations, UI component structure, validation gates, naming rules, or workflow rules.

Packs are not meant to force every project into the same shape. In an existing project, Skopos should first understand the current structure and map local folders to the roles the pack expects.

### Missions And Workpacks

Missions and workpacks help with longer work. They track what is being done, what is done already, what is blocked, which decisions were made, and what proof is still needed.

This is useful when a task is too large to safely handle as one loose chat request.

### Trust And Done Checks

Skopos can report whether the project looks ready, what still needs attention, and which checks support the answer. The goal is not to use scary labels. The goal is to help a developer see whether work is safe to close.

## New Projects And Existing Projects

For a new project, Skopos can help set the first rules before the codebase grows. It can guide architecture, stack choices, validation gates, and agent behavior from the beginning.

For an existing project, Skopos should not blindly replace what is already working. It should inspect the current codebase, respect proven local patterns, and only flag real drift or risk.

This matters because good projects do not all use the same folder names. Skopos should care about responsibility and boundaries first, then map those ideas to the structure the project already uses.

## Common Commands

```bash
skopos init .
skopos understand .
skopos policies list .
skopos policies recommend .
skopos policies apply .
skopos policies drift .
skopos program next . --compact
skopos trust . --compact
skopos done . --compact
```

Use `--json` when another tool needs machine-readable output. Use the default text output when a developer wants a clear explanation.

## Repository Layout

- `packages/cli`: the bundled public CLI package
- `packages/model`: shared contracts and data shapes
- `packages/runtime`: project memory, workflows, policies, and program logic
- `packages/indexer`: project scanning and artifact loading
- `packages/trust`: trust, done, impact, and validation reports
- `packages/ui`: local console UI
- `policy-packs`: built-in policy packs
- `docs`: durable product and architecture knowledge
- `fixtures`: example repositories used for testing

Only `@skopos/cli` is intended as the first public npm package. Internal workspace packages are bundled into the CLI for the first release.

## Release Status

Skopos is being prepared for its first public `next` release.

The first release target is:

```txt
@skopos/cli@0.1.0
```

The first public publish should use the `next` npm tag. The `latest` tag should wait until real registry install tests pass.

## Development

Install dependencies:

```bash
pnpm install
```

Run the main checks:

```bash
pnpm release:check
pnpm typecheck
pnpm release:smoke
```

Build all packages:

```bash
pnpm build
```

## License

Apache-2.0
