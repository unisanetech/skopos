---
title: "Decision: Evidence-Based Ask-Back Classification"
status: accepted
owner: skopos-core
id: D-20260803-evidence-based-ask-back-classification
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-08-03
lastUpdated: 2026-08-11
relatedDocs:
  - ../architecture/agent-native-operating-model.md
  - ../findings/archive/F-20260803-planner-ask-back-classification-gap.md
  - ../findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
---

# Decision: Evidence-Based Ask-Back Classification

## Changelog

- `2026-08-11`: Extended subject-and-intent classification to public-contract and
  Scope questions after the self-hosted homepage build produced repeated Scope asks and
  classified presentation-only changes as possible public API changes.
- `2026-08-03`: Accepted evidence-based subject-and-intent classification for
  destructive, vendor, security, and privacy questions.

## Decision

Planner ask-back questions require evidence of both a decision subject and an intent to
change it. A single overloaded word is not sufficient.

1. destructive migration requires a destructive or migration verb plus a persisted,
   public, package, or provider target
2. vendor choice requires a choice, adoption, replacement, switch, or migration intent
   plus a provider or vendor target
3. security and privacy requires a behavior-change intent plus an authentication,
   authorization, access-control, privacy, credential, or security target
4. operational compounds such as `provider protocol`, `session context`, `token budget`,
   `workspace scope`, and `scope confirmation` are not classified by their component
   homonyms
5. identical admitted facts produce identical question sets
6. every conditional question provides a truthful outcome for the case where the
   classified concern does not actually change
7. public-contract confirmation requires both a public contract subject and intent to
   change route behavior, SDK or CLI behavior, package contract, compatibility, or
   another externally consumed semantic surface; public copy, typography, color,
   spacing, or other presentation alone is insufficient
8. Scope confirmation is emitted only when Task facts identify more than one credible
   authority boundary, no declared Scope owns the intended surface, or the requested
   work intentionally spans Scopes; every Task does not receive the question by default
9. every conditional public-contract or Scope question includes a truthful no-change,
   explicit-Scope, or unresolved-ambiguity outcome

The classifier remains conservative for concrete high-impact goals. It is not a general
natural-language understanding claim; focused fixtures own the known positive and
negative boundary, and new false positives or false negatives extend those fixtures.

## Consequences

- routine implementation Tasks are not blocked by irrelevant decisions
- high-impact provider, destructive, and security choices remain explicit
- users no longer have to select a misleading fast-path or rollout answer to mean
  “this concern does not apply”
- adding a new keyword alone is insufficient; classifiers require a subject-intent
  predicate and representative boundary tests
- public presentation remains reviewable without being mislabeled as an API change
- declared project topology, not a generic workspace ask-back, owns normal Scope
  selection
