# Progressive Validation Lane Guide

## Metadata

- Pack ID: `verification.progressive-validation`
- Status: `active`
- Owner: `skopos-core`
- Scope: `policy-packs/verification/progressive-validation/lane-guide`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per pack release`
- Related Artifacts:
  - `../pack.json`

## Lanes

| Lane | Use When | Typical Proof |
|---|---|---|
| Light | One narrow owner, no durable project-truth change | focused test, typecheck, or reasoned no-run note |
| Normal | Bounded feature or package work | typecheck plus relevant tests or build |
| High-impact Task | Public API, architecture, stack, security, migration, generated artifact, multi-package, or long-running work | staged Guards, decisions, findings, Evidence, and Readiness proof |

## Escalation Reasons

Escalate when the work changes:

1. accepted policy
2. public package API
3. data shape or migration
4. auth, security, privacy, or secrets
5. runtime stack or external service dependency
6. generated artifact ownership
7. cross-package contracts
8. long-running Task state
