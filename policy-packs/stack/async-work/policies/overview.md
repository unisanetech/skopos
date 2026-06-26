# Async Work And Queue Stack Pack

## Metadata

- Pack ID: `stack.async-work`
- Status: `active`
- Owner: `skopos-core`
- Scope: `policy-packs/stack/async-work`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per pack release`
- Related Artifacts:
  - `../pack.json`
  - `decision-guide.md`
  - `operations.md`
  - `../checks/drift-rules.json`

## Purpose

Use this pack when a project may need background jobs, cron jobs, queues, Redis, worker processes, durable workflows, or managed async platforms.

The pack does not prefer one vendor. It helps the agent choose the smallest reliable option and explain the tradeoff before code is added.

## Default Guidance

1. Keep quick deterministic work synchronous.
2. Use a scheduler for simple recurring work.
3. Use a queue when work needs retry, backpressure, idempotency, or progress.
4. Use a durable workflow engine when the work is multi-step, long-running, or needs resumable state.
5. Add Redis only when the selected queue, cache, session, or rate-limit design actually needs it.
6. Record local development and production ownership before the stack becomes durable project policy.

## Agent Operating Rule

Before adding async infrastructure, the agent should say:

1. what product job is being moved out of the request path
2. why simple synchronous or scheduled work is not enough
3. which operational costs the selected tool adds
4. which proof gates will confirm retries, failure handling, and local development still work
