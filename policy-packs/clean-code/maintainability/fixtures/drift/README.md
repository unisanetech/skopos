# Drift Fixture: Helper Bucket

This fixture describes common clean-code drift.

Signals:

- `utils/misc.ts` or `helpers.ts` owns unrelated behavior
- a large file mixes parsing, business rules, persistence, and formatting
- feature-specific logic was moved to shared without real reuse
- comments repeat obvious code or stale TODOs have no owner
- behavior changed without a focused test or skipped-proof reason

The pack should flag these as maintainability risks before agents add more code.
