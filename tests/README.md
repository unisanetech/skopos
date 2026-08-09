# Skopos Tests

Keep Skopos tests split into:

1. package-local unit and integration tests
2. repo-level e2e flows
3. regression fixtures for known failures
4. performance tests for large-repo indexing and incremental rebuilds

The active CLI test suite lives in `packages/cli/src/__tests__`. The package scripts in
`packages/cli/package.json` define the maintained default, e2e, proof, release-smoke,
and UI-proof lanes. Do not cite a test file unless it exists in that directory and is
selected by a current package or root script.

## Repository fixtures

`fixtures/repos/registry.json` is the active fixture authority. Every registered entry
declares its repository family, language, purpose, expected policy outcome, and current
consumer. `packages/cli/src/__tests__/policy-recommendation-portability.test.ts` fails
when a non-empty fixture is unregistered, a registry entry has no directory, repository
classification changes unexpectedly, or an expected policy recommendation regresses.

The registry includes JavaScript/TypeScript brownfield and workspace cases plus
representative Python, Rust, Go, Java, .NET, Ruby, Swift, HCL, mobile, data/ML,
infrastructure, documentation, and embedded cases. Passing that focused test is the
minimum proof for claimed recommendation portability; it does not certify every tool
or command across every ecosystem.

When adding a fixture:

1. use synthetic names and data
2. state one active purpose
3. register the expected family, language, recommendation result, and consuming test
4. add or extend executable assertions that exercise the intended behavior
5. remove or archive the fixture when its consumer and purpose are retired

Operational reliability characterization lives in
`packages/cli/src/__tests__/operational-reliability-baseline.test.ts`, backed by
`internal/evals/operational-reliability-baseline.json`. The first scenario creates a
generic shared dirty worktree with a narrow Task Scope and independent other work. It
records the current proof-scope amplification separately from the accepted target and
keeps a clean proportional control case. A passing characterization test means the
measurement is reproducible; it does not mean the recorded defect is acceptable.
