# Progressive Validation Closure Policy

## Metadata

- Pack ID: `gates.progressive-validation`
- Status: `active`
- Owner: `skopos-core`
- Scope: `policy-packs/gates/progressive-validation/closure`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per pack release`
- Related Artifacts:
  - `../pack.json`

## Closure Requirements

Before claiming work is done, record:

1. what changed
2. what lane was used
3. which checks ran
4. which checks passed
5. which checks failed or were skipped, with reason
6. what risk remains
7. which durable memory or policy was updated

## Non-Negotiable Rule

Do not hide failed checks. Either fix them, explain why they are unrelated, or record a follow-up finding before closure.
