---
title: Semantic Guard Templates
status: active
owner: skopos-core
id: SKOPOS-GUIDE-SEMANTIC-GUARDS
scope: skopos
role: guide
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-09
relatedDocs:
  - ../architecture/action-extension-model.md
  - ../architecture/evidence-and-readiness-model.md
  - ../../policy-packs/verification/semantic-drift/policies/overview.md
reviewCycle: when semantic Guard templates change
---

# Semantic Guard Templates

Builds, typechecks, and link checks can all pass while a guide still recommends a
retired architecture path or product rule. Semantic Guards cover narrow, reviewed
project truths that syntax alone cannot understand.

## Boundary

Skopos supplies a portable template under
`policy-packs/verification/semantic-drift/templates/`. The consuming project owns:

1. retired phrase and path patterns
2. legitimate negative, historical, and temporary contexts
3. governed document paths
4. the Action and Guard declarations
5. positive and allowed regression examples

Do not put another project's phrases in Skopos core.

## Install In A Project

Copy and rename:

1. `semantic-guidance.config.example.json` to
   `tools/skopos/semantic-guidance.json`
2. `semantic-guidance-check.mjs` to
   `tools/skopos/scripts/semantic-guidance-check.mjs`
3. `action.yaml` to a project-named Action manifest
4. `guard.yaml` to a project-named Guard manifest

Replace every example token. Review the Action inputs and Guard paths so the check is
selected only for documents it can actually prove.

## Rule Shape

Each rule declares:

- a stable project rule id
- a human-readable description
- one or more retired patterns
- explicit allowed-context patterns

The checker removes the retired match before testing surrounding context. A retired
token containing a word such as “legacy” or “retired” therefore cannot accidentally
allow itself.

## Minimum Evaluation Matrix

Every adopted semantic rule should prove:

| Case | Expected |
| --- | --- |
| active positive recommendation | fail |
| prohibition or replacement guidance | pass |
| historical or changelog statement | pass |
| temporary transition statement | pass |
| ambiguous unmatched context | fail for review |
| unrelated current guidance | pass |

Run the checker directly while authoring the project rule, then run it through the
registered Skopos Action so closure receives source-bound Evidence.

## Human Review

This template deliberately fails ambiguous occurrences. Correct the document when it
teaches retired truth; expand allowed context only when accepted Project Memory proves
that the context is legitimate. Do not add a broad allow-pattern merely to make the
check green.
