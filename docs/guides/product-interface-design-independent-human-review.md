---
title: Historical Product Interface Design 0.3.0 Independent Human Review
status: superseded
owner: skopos-skills
id: SKOPOS-GUIDE-PRODUCT-INTERFACE-DESIGN-INDEPENDENT-HUMAN-REVIEW
scope: skopos
role: guide
lifecycle: historical
authority: supporting
provenance: observed
view: current
lastUpdated: 2026-08-10
relatedDocs:
  - ../findings/F-20260804-skill-selection-proof-and-portability-gap.md
  - ../work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md
---

# Historical Product Interface Design 0.3.0 Independent Human Review

> Do not use this protocol to approve the first public release. It applies only to the
> superseded `0.3.0` identity. Product Interface Design `0.5.0` failed its release
> smoke before a full bundle existed, so independent human adjudication is not yet an
> eligible next step. A future exact identity must first clear its machine smoke and
> full-run gates, then receive a new label-safe guide.

This guide is the handoff for a person who did not author the Skill, run the evaluation,
or inspect its candidate/control mapping. Review only the generated A/B bundles. Do not
open the run report, paired-evaluation result, worker traces, Skill guidance, or this
repository's efficacy Finding before submitting the review.

## Review Root

The eight identity-bound bundles are under:

`.skopos/evaluations/product-interface-design-0.3.0-full-20260809/calls/`

Open the `blinded-review-bundle.json` inside each `*-blinded-review` directory. Each
bundle provides the task, case-local dimensions, and paths to A/B desktop and mobile
screenshots plus rendered source. The bundle contains no candidate/control mapping.

Review these cases in the listed order:

1. `operations-workbench`
2. `transaction-trust`
3. `discovery-coordination`
4. `documentation-workspace`
5. `responsive-transformation`
6. `failure-recovery`
7. `product-character`
8. `complete-service-flow`

## Record One Decision Per Case

For each case, record:

- winner: `A`, `B`, or `tie`
- a `0`–`3` score for every dimension named in that bundle
- one short evidence-based reason grounded in the desktop and mobile renders
- any material failure involving task completion, misleading state, recovery,
  accessibility, responsiveness, clipping, or hidden content

Use `0` for missing or harmful, `1` for material correction required, `2` for
acceptable with bounded improvements, and `3` for strong and evidence-backed. Prefer
the implementation that supports the stated task across both viewports. Visual polish
must not compensate for lost behavior, false controls, inaccessible interaction, or
missing recovery.

## Independence Rules

1. Do not infer which alternative used the Skill.
2. Do not discuss cases with the author or runner while reviewing.
3. Do not inspect model-review decisions until all eight human decisions are frozen.
4. Do not change a decision after the A/B mapping is revealed.
5. Sign and date the completed adjudication, including any prior exposure that could
   weaken blindness.

The release threshold is evaluated only after the signed decisions are frozen and the
mapping is revealed. A model-reviewed result is not independent human adjudication.
