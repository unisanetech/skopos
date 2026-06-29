# P1-W10 Actionable Setup Review Questions

Temporary execution workpack for turning generated setup-review questions into a review, answer, and next-flow system.

## Metadata

- Doc ID: `SKOPOS-P1-W10`
- Status: `historical`
- Owner: `skopos-core`
- Scope: `skopos/project/execution`
- Canonical: `no`
- Last Updated: `2026-06-29`
- Review Cycle: `per workpack`
- Related Docs:
  - `../../decisions/034-post-init-setup-review-and-confirmed-understanding-contract.md`
  - `../../how-to/bootstrap-the-project.md`

## Changelog

- `2026-06-29`: Opened because setup-review questions were generated but not yet answerable or integrated into `skopos next`.
- `2026-06-29`: Archived after setup review answers, next-flow integration, tests, and proof were completed.

## Temporary Status And Removal Rule

This historical execution artifact is no longer part of the active reading path. Keep only as implementation history.

## Scope

This workpack may add:

1. setup-review answer model and artifact
2. `skopos setup review`
3. `skopos setup answer`
4. setup-review readiness refresh after answers
5. `skopos next` guidance for open setup questions
6. UI state for setup review question counts and answered/open state
7. e2e coverage for review and answer flow

This workpack must not add:

1. npm publishing behavior
2. broad policy-pack changes
3. unrelated UI redesign

## Checklist

- [x] Update durable docs contract
- [x] Add setup answer artifact model
- [x] Implement runtime review/answer services
- [x] Add CLI setup commands
- [x] Integrate open setup questions into `skopos next`
- [x] Surface answered/open setup state in UI
- [x] Add focused tests
- [x] Run validation gates

## Verification Notes

Current implemented behavior:

1. `skopos understand` writes both setup review and setup answers artifacts.
2. `skopos setup review` shows open and answered setup questions with exact answer commands.
3. `skopos setup answer <question-id> <option-id> .` validates the question and option, records the answer, applies safe config-backed changes, refreshes setup review, and refreshes the knowledge index.
4. `skopos next` reports setup readiness and open/answered setup-question counts.
5. The overview UI reports open and answered setup-question state.

Focused validation passed:

1. `pnpm typecheck`
2. `pnpm --filter @skopos/cli exec vitest run src/__tests__/cli.e2e.test.ts -t "setup questions|compact repo understanding"`

Full validation passed:

1. `pnpm test`
2. `pnpm build`
3. `pnpm instructions:sync`
4. `skopos understand . --actor codex`
5. `pnpm proof`
6. `pnpm skopos:ui`
