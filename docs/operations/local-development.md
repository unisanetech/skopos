---
title: Local Development
status: active
owner: skopos-core
id: SKOPOS-LOCAL-DEVELOPMENT
scope: skopos
role: operation
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-13
relatedDocs:
  - ../guides/developer-workflows.md
  - ../standards/validation.md
  - ../architecture/00-architecture.md
reviewCycle: when local commands change
---

# Local Development

## Changelog

- `2026-08-13`: Aligned the local Node requirement with the supported public runtime
  families and the unflagged `node:sqlite` floor.
- `2026-07-29`: Replaced prototype execution instructions with the canonical
  Session, Task, Action, Evidence, and Readiness loop.

## Setup

```bash
pnpm install
pnpm typecheck
```

Node.js `^22.13.0` or `^24.0.0` is required. Node 22 versions before 22.13 still
require an experimental flag for the local SQLite coordination broker and are not
supported.

## Work Loop

1. inspect `AGENTS.md`
2. run `pnpm skopos:session`
3. start or resume one Task
4. edit a coherent affected slice
5. run focused package typecheck or focused test
6. run selected project Actions
7. Verify and assess Readiness before closure

Use a tracked high-impact Task for architecture, public API, data, security, release,
multi-Scope, or long-running work.

## Focused Commands

```bash
pnpm --filter @skopos/<package> check-types
pnpm --filter @skopos/cli exec vitest run <test-file>
pnpm --filter @skopos/ui exec vitest run <test-file>
```

Do not run every workspace check after each edit. Stop at the first failing check,
repair that failure class, and resume.

## UI

```bash
pnpm skopos:ui:dev
pnpm skopos:ui:serve
```

The UI is a projection of canonical state. Runtime UI assets live under
`.skopos/ui/**`; do not hand-edit them.

## Instruction Changes

After changing `AGENTS.md` or the operating-contract generator:

```bash
pnpm instructions:sync
```

The command owns Claude, Cursor, Copilot, and host adapter mirrors.

## Release Proof

After affected-scope proof is clean:

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm release:check
pnpm release:smoke
```

Run this broad sequence once for the release candidate, not during every implementation
iteration.
