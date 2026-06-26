# Skopos CLI

**Persistent project memory for coding agents.**

Skopos helps Codex, Claude, Cursor, and other coding agents understand your project before they edit it.

## 🚀 Start

Run inside your project:

```bash
npx @skopos/cli init .
```

Or:

```bash
pnpm dlx @skopos/cli init .
npm exec --package @skopos/cli -- skopos init .
```

## 🤖 Tell Your Agent

After setup, tell your coding agent:

```txt
Read AGENTS.md first. Use Skopos context before editing.
```

Better prompt:

```txt
Use Skopos. Follow AGENTS.md, make the smallest safe change, run the right checks, and update memory if project truth changed.
```

## 📦 What It Adds

```txt
AGENTS.md
.skopos/
```

`AGENTS.md` gives coding agents project guidance. `.skopos/` stores local project memory and workflow state.

## 🛠 Useful Commands

```bash
skopos understand .
skopos policies recommend .
skopos policies apply .
skopos program next . --compact
skopos trust . --compact
skopos done . --compact
```

Use `--json` when another tool needs structured output.

## 📄 License

Apache-2.0
