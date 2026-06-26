# Skopos

**Skopos helps coding agents understand your project and work without losing context.**

It creates a local memory layer for your codebase, writes useful agent instructions, recommends project rules, and helps prove when work is actually done.

Works with new projects and existing projects. Not tied to one framework.

## 🚀 Quick Start

Run Skopos inside any project:

```bash
npx @skopos/cli init .
```

Or use pnpm:

```bash
pnpm dlx @skopos/cli init .
```

Or explicit npm exec:

```bash
npm exec --package @skopos/cli -- skopos init .
```

## 🧠 Why Skopos Exists

Coding agents are powerful, but they can drift.

They may forget project rules, miss past decisions, create a second pattern, or say work is done without enough proof.

Skopos gives them a stable project memory and a simple workflow:

- remember important project facts
- follow local architecture and style rules
- ask better questions when needed
- choose light workflow for small tasks
- use stronger workpacks for big changes
- show progress, blockers, decisions, and proof

## 📦 What It Adds

Skopos writes project-local files:

- `.skopos/` for project memory, state, policies, and reports
- `AGENTS.md` for coding-agent guidance

The saved text is meant for humans too. A developer should be able to open it and understand what is going on.

## 🛠 Common Commands

```bash
skopos init .
skopos understand .
skopos policies recommend .
skopos policies apply .
skopos policies drift .
skopos program next . --compact
skopos trust . --compact
skopos done . --compact
```

Use normal text output for reading. Use `--json` when another tool needs machine-readable output.

## 🧭 How Skopos Guides Work

Small task:

```txt
read compact context → edit relevant files → run focused check → update memory only if truth changed
```

Big or risky task:

```txt
create mission/workpack → split phases → track decisions → run staged gates → close with proof
```

The goal is **progressive workflow**, not process for everything.

## 🧩 Policy Packs

Policy packs are reusable project rules.

Examples:

- architecture boundaries
- stack choices like Redis, queues, cron, or durable workflows
- validation gates
- UI/component structure
- naming and file-structure rules

For existing projects, Skopos should first understand the current structure. It should not force every codebase into the same folder names.

## ✅ Release Status

First public release target:

```txt
@skopos/cli@0.1.0
```

The first npm release should publish with the `next` tag. Promote to `latest` only after real registry install tests pass.

## 🧑‍💻 Development

```bash
pnpm install
pnpm release:check
pnpm typecheck
pnpm release:smoke
```

Build:

```bash
pnpm build
```

## 📁 Repo Layout

- `packages/cli`: public bundled CLI
- `packages/runtime`: memory, workflows, policies, program logic
- `packages/model`: shared data contracts
- `packages/indexer`: project scanning
- `packages/trust`: done/trust reports
- `packages/ui`: local console UI
- `policy-packs`: built-in policy packs
- `docs`: product and architecture docs

## 📄 License

Apache-2.0
