# Contributing To Skopos

Thank you for helping improve Skopos. The project is converging on its first public
release, so small, well-proved changes are easier to review than broad surface
expansion.

## Set Up The Workspace

Requirements:

- Node.js `^22.13.0` or `^24.0.0`
- pnpm 10.26.0
- Git

```bash
git clone https://github.com/unisanetech/skopos.git
cd skopos
pnpm install --frozen-lockfile
pnpm build
pnpm skopos:setup
pnpm skopos:session
```

Read `AGENTS.md` and [the documentation router](docs/00-start-here.md) before making a
broad change. Skopos uses itself to track project intent, affected paths, checks, and
evidence.

## Make A Focused Change

1. Start from a current branch and keep unrelated local edits out of the change.
2. Describe the problem, intended outcome, and acceptance criteria.
3. Follow the existing architecture and keep Skopos core project-agnostic.
4. Add focused tests for changed behavior.
5. Run the narrowest reliable checks first, then any broader checks selected for the
   affected paths.
6. Update durable docs only when project truth or a public contract changes.
7. Explain behavior, evidence, documentation changes, and remaining risk in the pull
   request.

Common validation capabilities are:

```bash
pnpm typecheck
pnpm test
pnpm proof
pnpm release:check
pnpm release:smoke
```

They are not a mandatory run-all list for every edit. Release-sensitive changes need
proportional package and clean-install proof.

## Release-Sensitive Areas

Changes to public commands, package contents, stored data, evidence semantics,
security boundaries, policy, adoption, or Product Interface Design require explicit review and
may invalidate existing release evidence. Product Interface Design is required for the first
release and cannot be removed or disabled to make a gate pass.

Do not hand-edit generated instruction mirrors or runtime-managed `.skopos/**`
artifacts. If `AGENTS.md` changes, regenerate declared mirrors with
`pnpm instructions:sync`.

## Reporting Security Problems

Do not include a suspected vulnerability in a public pull request or issue. Follow
[SECURITY.md](SECURITY.md).

## Contribution License

By submitting a contribution, you confirm that you have the right to submit it and
agree that it may be distributed under the repository's Apache-2.0 license. Imported
source must include a reviewable origin and compatible-license record; ownership of
one source set does not authorize unrelated future imports.
