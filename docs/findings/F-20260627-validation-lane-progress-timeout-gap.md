# F-20260627-validation-lane-progress-timeout-gap: Validation Lane Can Run Too Long Without Progress Or Bounded Handoff

## Metadata

- Doc ID: `SKOPOS-F-20260627-VALIDATION-LANE-PROGRESS-TIMEOUT-GAP`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/findings`
- Canonical: `yes`
- Last Updated: `2026-06-27`
- Review Cycle: `per workpack`
- Related Docs:
  - `registry.md`
  - `../project/roadmap.md`

## Changelog

- `2026-06-27`: Narrowed again after the broad CLI e2e suite moved from the default `@skopos/cli` `test` script to an explicit `test:e2e` script, making `pnpm test` bounded enough for normal mission eval while preserving the heavier e2e gate as an intentional command.
- `2026-06-27`: Narrowed after foreground `skopos eval` gained bounded validation command execution, `timed-out` check runs, partial-proof artifacts, compact output support, and `--check-timeout-ms` for explicit long checks. Remaining work is live progress/noise reduction and richer resumable validation phases.
- `2026-06-27`: Opened after the self-hosted memory/workflow mission showed that `pnpm test` and `skopos eval` can run for several minutes with only repeated git-init hints and no clear progress, timeout, or partial-proof handoff, even when focused checks, proof, typecheck, release check, and build pass.

## Summary

- Severity: `SHOULD`
- Status: `active`
- Owner: `skopos-core`
- Target Pack: `validation and transport proportionality`
- Current State: narrowed. Foreground `skopos eval` now records timed-out validation commands as partial proof, and default `pnpm test` no longer includes the broad CLI e2e suite. The remaining gap is better live progress, quieter temporary-repo output, and resumable validation phases for explicit heavy suites.

## Symptom

1. Explicit heavy e2e commands can run for many minutes without a useful progress summary.
2. `skopos eval` can inherit the same long-running behavior from the configured validation command surface.
3. The visible output may repeat low-value tool hints instead of explaining which suite, phase, or test is currently running.
4. Mission checklist closure stays pending because the agent cannot safely prove the full validation lane completed.

## Impact

1. Developers and coding agents cannot tell whether validation is healthy, slow, or stuck.
2. Mission pages can look unfinished even after the important focused proof for the current change passed.
3. Agents may either stop too early or waste time waiting on a low-signal command.

## Fix Plan

1. Split the default validation lane into bounded steps that report progress and can be resumed.
2. Teach `skopos eval` to record partial proof: passed checks, interrupted checks, elapsed time, and the exact remaining command. First slice complete for timed-out foreground checks.
3. Add timeout guidance or a soft budget for long local suites, with a clear recommendation instead of silent waiting. First slice complete through `--check-timeout-ms`.
4. Reduce noisy repeated git-init hints in test output where Skopos controls the temporary repo setup.

## Verification

1. `skopos eval` produces a useful artifact when validation is interrupted or exceeds a local budget. First slice covered by timeout regression.
2. The mission checklist can show "validation partially complete" with the remaining command, instead of only pending/done.
3. The default `pnpm test` lane completes without the broad CLI e2e suite. Heavy e2e commands remain explicit and still need better progress handling.

## Linked Docs

1. `registry.md`
2. `../project/roadmap.md`
