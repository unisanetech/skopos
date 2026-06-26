# Async Stack Decision Guide

## Metadata

- Pack ID: `stack.async-work`
- Status: `active`
- Owner: `skopos-core`
- Scope: `policy-packs/stack/async-work/decision-guide`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per pack release`
- Related Artifacts:
  - `../pack.json`

## Decision Table

| Need | Prefer | Avoid |
|---|---|---|
| Fast work inside one request | plain function or transaction | queue infrastructure |
| One simple recurring task | framework scheduler or hosted cron | durable workflow engine |
| Retryable external call | queue worker with idempotency | fire-and-forget promise |
| High-volume processing | queue with backpressure and monitoring | request-thread loop |
| Multi-step resumable process | durable workflow engine | hand-rolled status tables without recovery policy |
| Shared cache | Redis or managed cache with invalidation policy | cache added without freshness rules |

## Ask The User When

Ask before implementation when:

1. the queue or workflow engine choice affects deployment
2. the project has no worker runtime yet
3. retries could duplicate external side effects
4. user-visible progress, cancellation, or replay semantics are unclear
5. Redis is being introduced as a new dependency

## Good Answer Shape

A good agent answer names the recommended option, why simpler options are not enough, operational costs, failure handling, local command, production deployment, and proof gates.
