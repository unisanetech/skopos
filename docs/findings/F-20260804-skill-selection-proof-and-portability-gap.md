---
title: Skill Selection, Proof, And Portability Are Not Ready For Catalog Expansion
status: active
severity: MUST
owner: skopos-core
id: SKOPOS-F-20260804-SKILL-SELECTION-PROOF-AND-PORTABILITY-GAP
scope: skopos
role: finding
lifecycle: active
authority: supporting
provenance: observed
view: current
lastUpdated: 2026-08-09
relatedDocs:
  - ../decisions/040-project-adapted-skill-packs-as-capability-projections.md
  - ../work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md
  - ../architecture/agent-native-operating-model.md
  - ../architecture/action-extension-model.md
reviewCycle: per Skill capability phase
---

# Skill Selection, Proof, And Portability Are Not Ready For Catalog Expansion

## Summary

Skopos has the correct authority model and one promising
`ui.product-interface-design@0.3.0` source, but
the remaining project adaptation depth, behavioral fixtures, evaluation, and external
proof do not yet justify adding a broad Skill catalog. Task-aware selection, shared
budgets, exact acceptance identity, and exact generated selection reuse are now in
place.

This is a pre-release implementation gap. The fix is one clean hard cut to the first
canonical Skill system, not a versioned migration.

## Evidence

1. Task selection now builds a deterministic normalized envelope from all currently
   available Task contract, Scope ancestry, path, capability, Action, Guard, lifecycle,
   phase, risk, and accepted failure inputs.
2. The normal agent-native caller now resolves Task-attributed changed paths and passes
   both owned and changed paths into selection.
3. Module-local positive intent plus relevant applicability now establishes eligibility.
   Applicability accepts only canonical Scope kinds and compares their exact identity;
   coherent positive intent requires at least three significant terms, while a blocking
   anti-signal requires at least two normalized terms from the same negative Task clause.
   Negative evidence, generated-only changes, and ambiguous overlap therefore suppress
   selection without letting an unrelated preservation constraint veto valid UI work.
   Broader multi-pack fixture coverage remains incomplete.
4. Module-local context, Action, and Guard resolution is now implemented. Its selection
   behavior still needs broader multi-pack positive, negative, ambiguous, and overlap
   fixtures before catalog expansion is certified.
5. Guidance cost is loader-measured and one risk-based Task ceiling now limits packs,
   modules, and measured tokens across all accepted packs without truncating modules.
6. Selected modules now receive only roles declared by those modules. Their compact
   Task context explicitly projects the active project's bound component/token sources,
   Action mappings, Guard mappings, and unresolved recommended-role gaps; the generated
   selection also retains full adaptation notes. Missing conformance Actions or Guards
   are limitations, not proof. Broader multi-pack adaptation behavior remains unproven.
7. Human acceptance now pins exact pack, binding declaration, bound project source,
   Action/Guard catalog, rubric, fixture, and combined identities. Material changes
   reject explicit resolution and suppress the stale Skill during Task selection until
   a human re-accepts it.
8. The generated per-Task selection artifact is the sole cache and explanation view.
   Reuse requires the same algorithm, complete Task signal digest, accepted Skill
   identities, capability catalog, and resolved policy digest; stale acceptance
   bypasses reuse.
9. Product Interface Design now owns eight strict versioned fixture manifests covering positive,
   visual-restraint, negative, ambiguous, generated-output, capability-locality,
   project-bound design-system conformance, and budget behavior.
   Loader discovery enforces an exact declaration-to-manifest match, the runtime executes
   candidates without model or network access, and adoption fails closed on any fixture
   failure. These selection fixtures still do not prove rendered behavioral improvement.
10. The responsive visual-capture role now binds to a local headless-browser Action and
   accessibility proof binds to its own required project Guard. The first real run
   correctly failed on six serious `aria-hidden-focus` or
   `scrollable-region-focusable` route/viewport findings. Shared accordion, sidebar,
   and scroll-region fixes removed those defects; the succeeding run captured all eight
   route/viewport screenshots with no horizontal overflow and no serious or critical
   Axe violation. Automated responsive and accessibility canary proof is now certified;
   subjective visual approval remains a separate human judgment.
11. Packed external adoption now passes in one minimal project and a sanitized Billquest
    copy outside the Skopos checkout. Both projects install the packed CLI plus only its
    ordinary declared dependencies, resolve the required UI Skill from installed `dist`, pass
    all six fixtures bound to the portability proof identity, apply a project binding,
    select module-local Task context and
    capabilities, generate five host projections, reuse an exact selection, invalidate
    it after capability identity changes, return zero context for an irrelevant Task,
    and keep observed Skopos-generated artifacts contained. Billquest's accessibility
    Guard is backed by an executed static Next lint Action, never by responsive proof;
    rendered Axe and responsive browser execution remain explicit project-adaptation
    gaps and are not certified by this canary. The harness finds no workspace protocol,
    source-checkout reference, `NODE_PATH`, or forbidden symlink resolution. It always
    emits pass or fail with classified stage/project/command failure, partial evidence,
    and cleanup outcome, and it does not claim OS-wide observation of arbitrary writes.
12. Paired evaluation now has strict suite discovery, isolated opaque arms, explicit
    adapters, randomized labels, containment, exact environment/source identity, and
    generated metrics. For the prior accepted visual-modernity identity, all 16 workers
    and 8 blinded model reviewers completed: candidate won 6 cases and control 2, with
    no invalid, aborted, authority, correction, supervision, or containment finding.
    Independent human blind adjudication remains open, and the repeated operations case
    reversed between smoke and full run.
13. The canonical runner requires no-model preflight, one-case smoke gating, exact
    smoke-to-full identity, clean executable resolution, fresh/cached/output ceilings,
    incremental command Evidence, 0-3 score validation, realpath/non-symlink artifacts,
    and durable blinded bundles. The later ecommerce canary audit changed Skill guidance
    and rubric source, so the 6-2 result is now historical for the current accepted
    identity; neither a new model comparison nor independent human review exists for it.
14. Historical release-gate rerun `product-ui-craft-r2-full-20260809-r5` completed
    against its exact accepted Product UI Craft identity after a passing no-model preflight and candidate-
    winning one-case smoke. All 16 workers and 8 blinded model reviews completed with
    zero tie, invalid case, aborted case, authority regression, checkout reference,
    cross-arm reference, or `NODE_PATH` contamination. Usage remained within every
    declared ceiling: 2,952,942 input tokens, 702,318 fresh input tokens, and 156,797
    output tokens. Model review favored Product UI Craft in 3 cases and the no-Skill
    control in 5. The operations smoke result also reversed in the full run. The report
    is therefore `inconclusive`, independent human review remains pending, and the
    superseded source did not satisfy the material-improvement release gate.
15. The user replaced that pre-release identity with Product Interface Design
    `0.2.0` (`ui.product-interface-design`). Seven guidance modules were consolidated
    into Structure, Behavior, and Finish; the live family is `interface-design`, and
    React advice is now conditional inside Behavior. All eight deterministic fixtures pass. Copy-only selection uses Structure
    at 524 measured tokens, hydration-boundary selection uses Behavior at 518, and the
    complete three-capability case uses 1,310, below the 1,800 standard-Task ceiling.
    The exact accepted combined identity is
    `sha256:fb32b6c6b841bec9e7c979a9c9547032b33a9f51a3650ab7b5216fc6c3e35eab`.
    This proves bounded selection and identity integrity only. No paired efficacy or
    independent human result exists for the renamed source, so release gate R2 remains
    blocked.
16. Product Interface Design `0.3.0` retains exactly Structure, Behavior, and Finish
    while adding 21 concise Bad-to-Better patterns. Structure now demonstrates actions,
    headings, help, empty states, errors, recovery, confirmations, and removal of
    technical leakage. Behavior demonstrates reuse, responsive transformation, states,
    native controls, dialogs, naming, and conditional React boundaries. Finish
    demonstrates hierarchy, color priority, semantic tokens, product character,
    evidence density, and responsive proof. All eight fixtures pass; focused Structure
    and Behavior selections measure 596 and 612 tokens, and the complete selection
    measures 1,530. The exact accepted combined identity is
    `sha256:6a777cc44b8f6b887a187f566813a9cbe1baf6e1e415752bbcd2aa6d91a29464`.
    This supersedes deterministic proof for `0.2.0`.
17. The exact `0.3.0` efficacy cycle preserved frozen source after outcome. The
    one-case smoke passed 1-0 with clean containment and 304,511 input tokens, 127,231
    fresh input tokens, and 19,826 output tokens. The authorized full run then completed
    all 16 workers and 8 blinded model reviews with 4 candidate wins, 4 control wins,
    no ties, invalid cases, aborts, authority regressions, correction turns,
    supervision events, source-checkout references, cross-arm references, or
    `NODE_PATH`. Full usage remained inside every ceiling at 2,842,392 input tokens,
    716,184 fresh input tokens, and 150,264 output tokens. The report is
    `inconclusive`: machine review does not demonstrate material targeted improvement,
    and independent human adjudication remains pending. Eight label-safe A/B bundles
    and reviewer instructions are available, but R2 remains blocked.
18. The first Product Interface Design Design Context candidate now has deterministic
    and executable evaluation infrastructure rather than a link list. The pack owns a reviewed `0.1.0` Library
    with four Domain Guides, six Experience Guides, three Design Signals, ten dated
    official Source Notes, explicit limitations and do-not-copy constraints, and exact
    digests. Generic core owns only loading, selection, explanation, budget, freshness,
    precedence, and identity mechanics. Focused proof covers the complete initial
    selector matrix, ambiguity, project precedence, expiry, retirement, budget,
    saturated-signal justification, invalidation, irrelevant/public-page exclusion,
    copied-pack equivalence, and clean packed installation. Its neutral six-case
    comparison now reuses the isolated paired-evaluation pipeline through a generic,
    digest-bound comparison definition: both arms receive the same accepted core and
    only the candidate receives its exact resolved Context Brief. The no-model
    preflight passes with six Briefs, browser readiness, zero model calls, and the
    accepted identity still current at 8/8 fixtures. Model smoke, full comparison,
    independent human adjudication, and real-project pilots have not run. This closes
    executable preparation only; it does not close this Finding, prove usefulness, or
    satisfy R2.

## Impact

1. Adding more accepted packs can produce false selection and unbounded context
   accumulation.
2. Irrelevant Actions and Guards can expand Task cost and closure obligations.
3. A pack may look structurally complete without proving that it improves agent output.
4. Overbroad project-source bindings can cause frequent suppression and re-acceptance;
   each pack still needs a narrow, durable project adaptation boundary.
5. Project adaptation may amount to provenance paths rather than applied project truth.
6. Skopos cannot yet claim that Skills reduce search, rework, user corrections, or false
   closure across different project shapes.

## Required Resolution

1. Retain the implemented complete Task signal envelope and structured eligibility stage.
2. Retain module-local context, Action, Guard, rubric, and failure-signal binding.
3. Retain one task-wide measured pack, module, and token budget.
4. Retain the implemented one-artifact exact selection cache and suppression behavior.
5. Retain exact content-bound human acceptance for every pack and project binding.
6. Expand the executable selection baseline to the complete promotion matrix and add
   runnable rendered behavioral artifacts.
7. Compare candidate guidance against no Skill or the prior evaluated source through
   isolated paired forward tests and blind review, gated by one exact economical smoke
   run before the full promotion suite.
8. Pilot validated guidance in Skopos and one non-Skopos project.
9. Add later packs only after the existing UI pack proves value and bounded cost.

## Exit Criteria

1. Negative Tasks inject zero Skill context.
2. Every selection and suppression has structured evidence and a bounded cost.
3. No selected module pulls unrelated capabilities.
4. Exact content changes invalidate stale acceptance, selection reuse, and projections.
5. Deterministic fixtures prove positive, negative, ambiguous, overlap, generated, and
   budget behavior.
6. Paired evaluation demonstrates material targeted improvement without safety,
   authority, latency, or token regression. The first frozen full run did not satisfy
   this criterion: model review favored the control 6-2 and the candidate introduced
   one authority regression. A later identity reached a 6-2 model-reviewed candidate
   result without authority regression, but human blind adjudication remained open and
   the current source has changed again.
7. Packed external-project proof passes without access to the source checkout.

## Changelog

- `2026-08-10`: Made the frozen Design Context matrix executable without changing or
  re-accepting Product Interface Design guidance. The generic paired runtime can now
  bind exact comparison sources, give both arms explicit common modules, and add exact
  candidate-only context while preserving opaque workspaces and blind review. Focused
  regression proof passes, and the no-model smoke preflight resolves six Briefs and
  passes toolchain, browser, containment, and accepted-identity checks with zero model
  calls. The costly smoke/full run and independent human review remain unexecuted, so
  the Finding and R2 stay blocked.

- `2026-08-09`: Preserved the exact current-source R2 result without post-outcome
  tuning. Preflight passed, the one-case smoke favored Product UI Craft, and the full
  24-call run completed safely and within budget, but blinded model review favored the
  control 5-3. Human adjudication remains pending and cannot turn the machine result
  into an automatic release pass. The MUST Finding stays active, catalog expansion
  remains prohibited, and release gate R2 remains blocked pending an explicitly
  approved next evidence cycle.
- `2026-08-06`: Corrected the project-adaptation gap exposed by the isolated Unisane
  ecommerce canary. Ordinary screen composition now selects component architecture and
  reuse guidance; exact project component/token sources and mapped capabilities appear
  in Task context; recommended inventory/conformance capabilities are library-neutral;
  and absent capabilities produce machine-readable unverified gaps rather than implied
  certification. The React-boundary signal also no longer activates from generic words
  such as project, component, and rendered. All 8 fixtures and 16 focused tests pass,
  with exact accepted combined identity
  `sha256:e52c330014f4d3db144c5edc1086f8a0b6da8cd6e3101f44f54c8aafba2ac66a`.
  No paired run or regenerated canary was performed, so this Finding remains active for
  current-source efficacy and independent human blind adjudication.

- `2026-08-06`: The revised exact Product UI Craft source now has a fresh packed
  blank-project ecommerce canary. It selected the intended three modules at 1,790
  estimated tokens, passed 7/7 fixtures, and completed two isolated worker turns with
  1,204,955 input tokens (171,739 fresh) plus 19,146 output. The first pass built but
  failed real proof; the correction loop finished with three viewport captures, no
  global or local horizontal overflow, no serious/critical Axe violation, and complete
  mobile modal and stateful-control behavior. Subjective health is still
  `needs-attention`: interaction color authority is split between Unisane blue and
  custom green, the persistent dark sidebar/card stack remains weakly evidenced, and
  packed Unisane Progress cannot receive an accessible name without a local
  replacement. This proves selection and validation-loop behavior, not material
  improvement over no Skill. The Finding remains active pending a current-source
  paired comparison and independent blind human adjudication.

- `2026-08-06`: Audited the isolated Unisane `@unisane/ui` ecommerce dashboard rather
  than inferring quality from build/Axe success. The audit found incomplete modal focus
  behavior, local scrollbar residue, ambiguous interaction states, heavy mobile icons,
  an oversized low-value chart region, and generic character beyond the accent. Compact
  guidance and rubric blockers now cover those gaps without claiming data semantics.
  The expanded visual-restraint fixture selects only responsive, composition, and
  anti-slop guidance at 1,737 measured tokens; all 7 fixtures and 18 focused tests pass.
  Exact re-acceptance produced combined digest
  `sha256:796fc1c94cdd61769a0629df3d76bfb3e97ec04efa128fb3567b7881fb00494f`.
  The prior 6-2 run is historical for the revised source, no new model or independent
  human review was run, and this Finding remains active.

- `2026-08-06`: The first isolated Unisane dashboard admission proved the prior
  clause-local anti-signal correction was still insufficient. Packed install, binding,
  and 7/7 fixture evaluation succeeded, but Task `T-348eadda` selected only hierarchy
  guidance because `Do not change existing product behavior` shared UI terms with
  three anti-signals. The run stopped before authoring, so it is a valid failed-closed
  selection observation, not dashboard evidence. Runtime now distinguishes imperative
  preservation boundaries from direct negative scope assertions. The exact canary
  non-goal is covered by the alias-free positive fixture; direct backend,
  documentation-only, generated-only, and no-rendered-surface exclusions still pass.
  All seven fixtures and 18 focused tests pass, and the exact accepted combined digest
  is `sha256:74f7b07ec76849bdb2d6401ca1e53c81fcd24a480af283f76830a6175f9ea4ab`.
  The Finding stays active and the Unisane canary must rerun.

- `2026-08-06`: A real dashboard Task exposed zero selected modules before any fresh
  dashboard efficacy claim. The historical Task `T-28e5cb45` remains an honest
  no-Skill baseline. The correction hard-cuts module applicability to canonical Scope
  kinds, rejects invalid pseudo-kinds in packed manifests, uses exact Scope-kind
  matching, strengthens positive structural evidence, and requires coherent
  clause-local anti-signal evidence. A canonical `application` fixture with no
  `frontend` or `product-ui` aliases and an unrelated pack-preservation constraint now
  selects the intended hierarchy, responsive, and visual-composition modules. All
  seven deterministic fixtures pass, and exact re-acceptance produced combined digest
  `sha256:d4814dbf0106e5415237e100b9cc0baf7b8e54ad3625358bfb597905a0416da9`.
  This does not certify dashboard quality; the isolated Unisane `@unisane/ui` canary
  remains the next project-level proof and the Finding remains active.

- `2026-08-06`: Ran the exact frozen eight-case visual-modernity comparison as
  `product-ui-craft-v3-full-real-20260806-r2`. Blinded model review recorded 6
  candidate wins and 2 control wins, with candidate wins across transaction,
  discovery, responsive scheduling, failure recovery, product character, and booking;
  control won operations and documentation. All 24 calls completed with zero ties,
  invalid or aborted cases, authority regressions, correction turns, supervision
  events, checkout or cross-arm references, or `NODE_PATH`. Total usage was 3,116,064
  input tokens (751,392 fresh) and 161,668 output, inside every ceiling. Candidate
  fresh input was 2,550 tokens lower than control, while candidate output was 13,277
  higher, tool calls were 40 versus 38, and accumulated worker duration was about 234
  seconds higher. The operations outcome reversed the preceding smoke, exposing
  stochastic variance. The report remains `inconclusive` and the Finding remains
  active: six model-reviewed wins satisfy the numerical threshold, but the required
  independent human blind review has not occurred and may confirm or overturn them.

- `2026-08-06`: Preserved zero-token full attempt
  `product-ui-craft-v3-full-real-20260806-r1` as diagnostic failure Evidence after its
  smoke gate compared inherently different one- and eight-template aggregates.
  Correction Task `T-09216701` and snapshot `S-f1f3c41c98f4` repaired only that
  pre-inference compatibility check. Current exact smoke evidence passes, stale v2
  evidence fails closed, focused tests and typecheck pass, and no evaluation input or
  outcome rule changed.

- `2026-08-06`: Ran the exact visual-modernity smoke
  `product-ui-craft-v3-smoke-real-20260806-r1` after a passing zero-model preflight.
  Two isolated workers and one blinded model reviewer completed. The Product UI Craft
  candidate won `operations-workbench`: 3-1 task-archetype fit, 3-2 visual quietness,
  3-3 background/layer architecture, and 3-1 state/recovery completeness. The
  candidate preserved incident-response information and actions across desktop and
  mobile; the control clipped mobile columns and omitted its selected-incident action
  area. There were no invalid or aborted cases, authority regressions, correction or
  supervision events, checkout or cross-arm references, or `NODE_PATH`. Usage was
  386,472 input tokens (88,232 fresh) and 20,304 output, inside all declared ceilings.
  The candidate used 3 tool calls versus 4 for control and only 605 more fresh input
  tokens; its larger total input difference was cached context. This positive one-case
  smoke validates the exact execution gate but cannot satisfy the eight-case promotion
  threshold or independent human adjudication, so the Finding remains active.

- `2026-08-06`: Kept the negative second-cycle `operations-workbench` smoke immutable
  and bound to its historical identity, then revised Product UI Craft under a new exact
  identity after screenshot review found competing accent/status color, weak
  background/layer architecture, generic dark-shell and tinted-canvas composition,
  permanent three-column framing, and contradictory populated-plus-empty state. The
  compact guidance now requires semantic color jobs, neutral dominance, attention and
  layer inventories, bounded containment, coherent state, and same-task precedent.
  The relevant three modules total 1,971 measured tokens inside the unchanged 2,200
  budget. Seven of seven deterministic fixtures and 17 of 17 focused tests pass; exact
  re-acceptance produced combined digest
  `sha256:67f67f3716495aa0b9f9ea17511f4e913f862ef47196a79e116133a222a3776e`.
  The new smoke/full preflights plan 3 and 24 calls but executed none and observed zero
  tokens. This is not efficacy evidence: the prior smoke cannot be reused for the new
  source, a newly authorized smoke must run first, and independent human adjudication
  still blocks promotion and catalog expansion.

- `2026-08-06`: Ran the exact three-call successor smoke without changing frozen
  inputs. Both workers and the blinded reviewer completed, containment and authority
  checks passed, and usage remained within all ceilings at 259,663 total input tokens
  (72,015 fresh) and 17,260 output. The reviewer selected the no-Skill control for
  `operations-workbench`, scoring it higher on archetype/reference fit, hierarchy/brand
  fit, and surface/density while tying user-task clarity. The Skill candidate offered
  clearer next-action links but introduced a contradictory empty state below populated
  incidents. This is valid negative smoke evidence, not efficacy certification. The
  Finding remains active; no outcome-driven tuning or full-run authorization occurred.

- `2026-08-06`: Preserved the 2-6 negative comparison and candidate authority
  regression as historical evidence bound to Task `T-d64f23b2` and snapshot
  `S-baa17a745170`; it does not certify the later archetype-aware source. Froze one
  successor eight-case suite with unique operational, transactional, discovery,
  documentation, responsive, recovery, product-character, and complete-flow templates.
  Its exact smoke matrix is 2 workers plus 1 blinded reviewer; its full matrix is 16
  workers plus 8 reviewers. Both no-model preflights pass, retain zero commands and zero
  model tokens, and bind the exact accepted pack, binding, capability, fixture, rubric,
  suite, template, prompt, budget, host, permission, and toolchain identities. The
  Finding remains active because the successor real smoke/full run and independent
  human adjudication have not occurred.

- `2026-08-05`: Ran the frozen full Product UI Craft comparison without post-outcome
  tuning. A new exact smoke passed its execution gate but again favored the control.
  All 24 full-run calls then completed across eight valid cases: blinded model review
  recorded 2 candidate wins, 6 control wins, 0 ties, 0 invalid cases, and 0 aborted
  cases. The candidate introduced one authority regression in
  `empty-and-error-states`. Full usage was 2,447,492 input tokens (1,832,704 cached;
  614,788 fresh) plus 85,528 output tokens, within all ceilings. The report remains
  `fail` because two reviewer traces referenced evaluator-owned screenshot paths under
  `.skopos/evaluations`; worker source-checkout references and cross-arm references were
  both zero. Independent human blind review is still pending. The evidence does not
  meet promotion gates, so this Finding remains active and no new pack may start.

- `2026-08-05`: Completed the first valid real three-call smoke. Both arms and the
  blinded reviewer completed; containment and authority checks passed; observed usage
  was 318,676 total input tokens, of which 247,040 were cached and 71,636 fresh, plus
  14,883 output tokens. The reviewer selected the no-Skill control for the fixed
  `settings-hierarchy` case (three dimension wins and one tie). This is retained as an
  honest negative observation, not a promotion result. No outcome-driven change was
  made to the Skill, cases, prompts, or rubric.
- `2026-08-05`: Hardened and staged real efficacy evaluation without claiming an
  outcome. Added no-model preflight, a fixed three-call smoke stage, exact smoke-to-full
  identity, prompt and budget digests, clean `PATH`/`NODE_PATH` resolution, plugin/tool
  minimization, fresh-versus-cached token telemetry, ceilings, incremental command
  evidence, durable blinded human-review bundles, partial invalid/aborted results,
  realpath containment, and strict 0-3 scores. The invalid zero-token startup and
  three-worker contaminated attempt remain diagnostic evidence only.
- `2026-08-05`: Corrected the external portability proof debt. Replaced the misleading
  Billquest accessibility-to-responsive mapping with an executed static accessibility
  lint Action and a Guard bound to that Action; rendered Axe remains explicitly
  unresolved. Added durable failure reports, useful three-way failure classification,
  partial evidence, cleanup proof, narrowed containment semantics, exact executable and
  effect declarations, and explicit ownership/tests for installed `skills context` and
  help. The sanitized Billquest canary and live-project integrity checks pass.
- `2026-08-05`: Closed the packed external-project portability gap for Product UI Craft.
  Added one release-owned harness that packs and directly invokes the installed CLI in a
  generated fixture and a sanitized Billquest copy; both pass discovery, recommendation,
  six-fixture evaluation, binding, relevant/irrelevant Task context, capability locality,
  host projection, exact reuse, invalidation, and containment checks. The live Billquest
  checkout remains unchanged. Real model comparison and independent adjudication remain
  open, so the Finding stays active and catalog expansion stays blocked.
- `2026-08-04`: Closed the first real browser canary failures without weakening the
  proof. Collapsed accordion and sidebar regions now use one inert interaction owner,
  the nested page scroll root is keyboard accessible, focused UI tests pass, and the
  registered Action passes all eight desktop/mobile captures with zero horizontal
  overflow and zero serious or critical Axe violations.
- `2026-08-04`: Added truthful responsive and accessibility proof bindings. Local
  Playwright/Axe proof covers `/overview`, `/tasks?view=open`, `/rules`, and `/readiness`
  at 1440x900 and 390x844, writes screenshots and a generated report, detects horizontal
  overflow, and fails on serious or critical accessibility violations. The first real
  run found zero overflow and six serious findings, proving the new guard failed closed
  before the shared UI defects were corrected.
- `2026-08-04`: Added first-version paired-evaluation infrastructure and one eight-case
  Product UI Craft suite. Tests prove arm isolation, guidance locality, reviewer
  blinding, exact environment/source identity, token accounting, and generated
  win/loss/tie reporting without a model or network call. Real paired runs, independent
  adjudication, rendered proof, and portable adoption remain open.
- `2026-08-04`: Replaced prose-only Product UI selection fixtures with six strict
  executable manifests. Discovery rejects missing, duplicate, and undeclared cases;
  candidate evaluation reuses production selection; generated reports bind exact
  source and capability identity; and adoption now requires a zero-failure result.
  Rendered fixtures, paired evaluation, blind review, specialized proof, and external
  portability remain open.
- `2026-08-04`: Implemented exact acceptance identity and exact per-Task selection
  reuse. The runtime pins pack, binding, project-source, capability, rubric, fixture,
  evaluation-source, and combined digests; rejects stale explicit resolution;
  suppresses stale Skills without blocking unrelated work; and reuses only the one
  generated selection/explanation artifact when every identity component matches.
  Focused fixtures prove cache hit, Task and policy invalidation, stale capability
  suppression, and pack/project/evaluation source invalidation. Runnable behavioral
  artifacts, paired evaluation, and external proof remain open.
- `2026-08-04`: Implemented the Task signal envelope, normal changed-path propagation,
  structured positive/applicability eligibility, anti-signal and generated-output
  suppression, module-local rubric/failure projection, structured explanations, and
  light/standard/high-impact Task-wide measured budgets. Exact caching, digest-bound
  acceptance, complete fixtures, behavioral evaluation, and external proof remain open.
- `2026-08-04`: Recorded the first model/loader hard cut. Strict v1 manifests,
  loader-measured module cost, module-local signals and capability roles, obsolete
  field rejection, and the initial `0.1.0` Product UI Craft identity are implemented.
  Complete Task signals, task-wide budgets, exact identity, fixtures, behavioral
  evaluation, and external proof remain open.
- `2026-08-04`: Opened from the first full audit of the Product UI Craft pack, Task
  selection runtime, project binding, host projection, and current proof fixtures.
