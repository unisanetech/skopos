---
title: Policy Applicability And Fixture Governance
status: active
owner: skopos-core
id: SKOPOS-POLICY-APPLICABILITY-FIXTURES
scope: skopos
role: architecture
lifecycle: active
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-09
relatedDocs:
  - 00-architecture.md
  - ../standards/validation.md
  - ../../tests/README.md
reviewCycle: when repository detection, policy recommendation, or fixture authority changes
---

# Policy Applicability And Fixture Governance

Skopos recommends policy from repository evidence. A pack's own description says what
could make it useful; it is not proof that the current project matches.

## Implemented recommendation contract

`skopos policies recommend` currently:

1. identifies a primary repository family and any additional supported families
2. identifies languages from source extensions and ecosystem manifests
3. matches known `appliesWhen` and `avoidWhen` signals to observed paths, manifests,
   dependencies, scripts, and bounded source text
4. derives confidence from the matched observation, not the confidence declared in the
   pack
5. returns `review` for every pack when the repository family remains unknown
6. lets a high-confidence contrary signal prevent automatic application
7. requires explicit `policies apply`, actor identity, and a reason before a policy is
   accepted or enforced

The supported repository-family vocabulary is application, service, CLI, library,
platform/monorepo, mobile, data/ML, infrastructure, documentation, embedded, and
unknown. Language detection includes JavaScript/TypeScript, Python, Rust, Go, Java,
Kotlin, .NET languages, Ruby, Swift, Dart, PHP, Scala, Elixir, C/C++, and HCL.

Detection means Skopos can classify representative evidence conservatively. It does
not mean every framework, build system, or unconventional layout in that ecosystem is
fully understood. Unmatched evidence stays review-only.

## Architecture pack portability

`architecture.mid-app` defines roles and dependency principles, not required folder
names. Local conventions such as vertical slices, plugins, event consumers, Rails or
Django apps, ports and adapters, Swift sources, or language-specific composition roots
may satisfy the roles directly. When a required role has no known alias, Skopos asks
for review and confirmation; it does not instruct the project to rename its tree.

Filesystem, import, and semantic checks that are heuristic, manual, or planned for a
future AST implementation are non-mandatory. They may surface attention, but they do
not create a deterministic failure without human confirmation. Public libraries and
large formal platforms are explicit counterexamples to automatic mid-app application.

## Active fixture authority

`fixtures/repos/registry.json` is the source of truth for active repository fixtures.
Every entry must contain:

- repository family and language
- a concrete purpose
- an expected policy result
- a current executable consumer

`policy-recommendation-portability.test.ts` compares the registry with every non-empty
fixture directory and executes the declared classification and recommendation
expectations. A fixture without an active purpose and consumer must be reconnected,
archived as historical evidence outside the active corpus, or removed.

Fixture content must be synthetic. It must not contain personal data, credentials,
absolute developer paths, or private organization material.

## Accepted decisions and remaining work

The accepted design is conservative uncertainty: unknown, conflicting, or weak
evidence routes to human review. Repository scanning remains bounded and heuristic; a
future detector may add parsed ecosystem manifests and AST-aware checks, but it must
preserve the same uncertainty and human-acceptance rules.

This document does not certify the public npm package, storage lifecycle, licence
provenance, or final release baseline. Those remain separate release gates until their
implementation and proof Tasks close.
