# Async Stack Operations Policy

## Metadata

- Pack ID: `stack.async-work`
- Status: `active`
- Owner: `skopos-core`
- Scope: `policy-packs/stack/async-work/operations`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per pack release`
- Related Artifacts:
  - `../pack.json`

## Required Operational Notes

Any accepted async stack addition should document:

1. local development command
2. required services such as Redis, database, broker, or managed platform
3. production process or hosted service owner
4. retry policy
5. idempotency key or duplicate-prevention rule
6. dead-letter, failed-job, or replay behavior
7. observability and alerting expectation
8. focused test or smoke command

## Readiness Check

Do not close async stack work until the agent can show:

1. the selected option is justified by product signals
2. the operational contract exists in project memory
3. failure behavior is covered by a test, smoke, or documented manual proof
4. accepted policy or stack decision has been refreshed
