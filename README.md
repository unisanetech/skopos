# Skopos

**Persistent project memory for coding agents.**

Skopos helps Codex, Claude, Cursor, and other coding agents understand your project before they edit it. It keeps project knowledge, rules, decisions, and work status close to the code so agents drift less and developers get clearer answers.

Use it in a new project or an existing project. Skopos is framework-agnostic.

## 🚀 Install

Run this inside your project:

```bash
npx @skopos/cli init .
```

Other options:

```bash
pnpm dlx @skopos/cli init .
npm exec --package @skopos/cli -- skopos init .
```

## 🤖 Use With Your Coding Agent

After `init`, tell your agent:

```txt
Read AGENTS.md first, then use Skopos context before editing.
```

Skopos creates project guidance that helps the agent answer and code in the right way for your repo.

Good agent prompt:

```txt
Use Skopos. Check the project memory, follow AGENTS.md, make the smallest safe change, run the right checks, and update memory if project truth changed.
```

## 🧠 What Skopos Does

- remembers important project facts
- writes agent-friendly `AGENTS.md`
- recommends architecture, stack, and validation rules
- tracks missions/workpacks for bigger changes
- shows next steps, blockers, decisions, and proof
- helps check whether work is really done

## 📦 What Gets Added

```txt
your-project/
  AGENTS.md      # guidance for coding agents
  .skopos/       # local project memory and workflow state
```

The files are written for humans too. You should be able to open them and understand what Skopos knows.

## 🛠 Common Commands

```bash
skopos understand .
skopos policies recommend .
skopos policies apply .
skopos policies drift .
skopos program next . --compact
skopos trust . --compact
skopos done . --compact
```

Use normal text output when you are reading. Use `--json` when another tool needs structured output.

## 🧭 Light Work vs Big Work

Small change:

```txt
read context → edit files → run focused check → update memory only if needed
```

Large or risky change:

```txt
mission/workpack → phases → decisions → gates → proof
```

Skopos is meant to be progressive. Small work should stay fast. Bigger work should get more structure.

## 🧩 Policy Packs

Policy packs are reusable project rules.

Examples:

- architecture boundaries
- stack choices like Redis, queues, cron, or durable workflows
- UI/component structure
- naming and folder rules
- validation gates

For existing projects, Skopos should respect proven local structure. It maps rules to your codebase instead of forcing every repo into the same folder names.

## ✅ Status

Skopos is preparing for its first public npm release:

```txt
@skopos/cli@0.1.0
```

The first release should use the `next` tag. `latest` should wait until registry install tests pass.

## 🧑‍💻 Contributing

Install dependencies:

```bash
pnpm install
```

Run checks:

```bash
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
