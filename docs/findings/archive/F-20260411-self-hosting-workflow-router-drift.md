---
title: "F-20260411-self-hosting-workflow-router-drift: Self-Hosted Feature Work
  Can Still Drift Outside Skopos Mission State"
status: historical
owner: skopos-core
id: SKOPOS-F-20260411-SELF-HOSTING-WORKFLOW-ROUTER-DRIFT
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-06-25
relatedDocs:
  - ../README.md
  - ../../00-start-here.md
  - ../../operations/local-development.md
  - ../../decisions/archive/018-self-hosting-workflow-contract.md
  - ../../decisions/archive/020-workflow-router-questions-recommendations-and-eval-contract.md
reviewCycle: per workpack
---

# F-20260411-self-hosting-workflow-router-drift: Self-Hosted Feature Work Can Still Drift Outside Skopos Mission State

## Changelog

- `2026-06-25`: Closed the finding after `instructions sync` and `init` began generating `.skopos/tooling/manual-hosts/README.md`, and `.skopos/enforcement.json` began recording unsupported coding agents as an explicit `manual-fallback` / `manual-only` adapter surface. Claude Code and Codex remain the automated adapters; other hosts now have a generated workflow-router contract instead of a hidden manual gap.
- `2026-04-17`: Narrowed the finding again after `skopos trust` began surfacing workflow-router adapter coverage directly from `.skopos/enforcement.json`, making it explicit that Claude Code and Codex have full generated session-start and stop-boundary automation while broader hosts still remain manual until they adopt the shared adapter contract.
- `2026-04-16`: Narrowed the finding again after the generated Claude Code and Codex adapter session-start paths began merging `skopos program next` into compact resume context, the Claude stop hook began blocking on the router's explicit next command before falling back to `done`, and the Codex wrapper gained the same stop-time router enforcement through an explicit `stop` event, so the remaining gap is broader host adoption rather than the primary self-hosted adapter lanes still bypassing the workflow router.
- `2026-04-16`: Narrowed the finding again after routed `overview`, `mission detail`, and `trust` began consuming the program router's closure-ready recommended action from `.skopos/program/state.json`, so the remaining gap is now adapter-path enforcement and broader happy-path adoption rather than missing UI visibility for explicit mission completion.
- `2026-04-16`: Narrowed the finding again after the program router began recommending explicit `skopos mission complete` handoff once the current mission already has complete eval evidence, so the remaining gap is broader adapter and UI adoption rather than the happy path still reading as “continue current mission” after closure-ready work.
- `2026-04-12`: Narrowed the finding again after trust-and-done closure integration landed: unresolved blocking workflow questions and missing or incomplete mission eval artifacts now gate closure directly, so the remaining gap is adapter plus UI adoption rather than missing closure enforcement.
- `2026-04-12`: Narrowed the finding again after the eval-to-closure handoff fix landed: successful mission evaluation now reconciles remaining non-decision checklist drift and recommends explicit mission completion, so the remaining gap is trust-plus-done enforcement for unresolved questions and required eval outputs.
- `2026-04-12`: Narrowed the finding again after `skopos eval` landed: the router now covers post-discussion start, decisions, ongoing next-step routing, and mission-level evaluation, so the remaining gap is trust-plus-done enforcement for unresolved questions and required eval outputs rather than the absence of an eval lane.
- `2026-04-12`: Narrowed the finding again after `skopos next` landed: ongoing mission routing is now durable runtime state, so the remaining gap is the missing eval lane and the final trust-plus-done closure integration rather than the absence of a follow-on router after `start`.
- `2026-04-11`: Narrowed the finding again after `skopos decide` landed: blocking workflow questions can now be resolved durably with actor attribution and linked mission checklist updates, so the remaining gap is the missing ongoing router, eval lane, and closure integration rather than unresolved decision recording itself.
- `2026-04-11`: Narrowed the finding after the first workflow-router slice landed: `skopos start` now exists and writes durable `questions` and `recommendations` artifacts, so the remaining gap is the missing ongoing router, decision recording, eval lane, and closure integration rather than the total absence of a post-discussion entrypoint.
- `2026-04-11`: Expanded the finding again after comparing the stronger Unisane workflow spine to current Skopos behavior: Skopos still lacks a first-class post-discussion router plus durable question, recommendation, and eval artifacts, so too much workflow behavior still depends on agent memory or user coaching even when plan and mission state exist.
- `2026-04-11`: Expanded the finding after the compiled-reference-layer batch was correctly routed through plan and mission state but still started code before the durable decision doc existed, proving the remaining drift is now docs-first contract enforcement rather than missing runtime mission state.
- `2026-04-11`: Added an active-mission trust check plus closure coverage, so local source or workflow changes without an active claimed mission now surface directly in `skopos trust` and `skopos done` instead of only through secondary workflow drift symptoms.
- `2026-04-11`: Opened after self-hosted UI work continued through chat and docs updates without a fresh Skopos mission, while the current self-hosting docs still described hybrid governance and the trust surface was simultaneously warning about instruction-mirror drift.

## Summary

- Severity: `SHOULD`
- Status: `done`
- Owner: `skopos-core`
- Target Pack: `self-hosting workflow contract`
- Current State: done. The self-hosting docs now make Skopos-native execution explicit, trust plus closure warn when tracked local work lacks an active claimed mission, `skopos start` exists as a real post-discussion entrypoint with durable question and recommendation artifacts, `skopos decide` records bounded answers durably with linked mission updates, `skopos next` keeps ongoing execution synchronized with mission state, `skopos eval` writes durable mission-level evidence, and the program router recommends explicit mission completion once eval evidence is complete. Claude Code and Codex generated adapters inject `skopos program next` guidance at session start and block stop flows on the routed command before falling back to `done`. Unsupported coding agents now receive a generated manual fallback guide under `.skopos/tooling/manual-hosts/README.md`, and `.skopos/enforcement.json` records that path as `manual-fallback` / `manual-only`, so broader host behavior is explicit instead of hidden.

## Symptom

1. Self-hosted Skopos feature work can still continue after planning discussion without a newly created or claimed Skopos mission.
2. `../../00-start-here.md` and `../../operations/local-development.md` still described hybrid or outer-governance behavior instead of making Skopos-native execution the primary contract.
3. Trust warnings such as instruction-mirror drift can appear as downstream symptoms while the execution-state gap itself remains under-specified.
4. Even when a real plan and claimed mission exist, a new artifact family or core contract change can still begin in code before the durable decision doc exists.
5. There is now a single runtime command for new work after a discussion, a durable ongoing-work router during implementation, and an explicit eval lane between implementation and closure.
6. Recommended actions and unresolved human choices are now durable `.skopos/` workflow state for `start`, `next`, and `decide`, and trust plus `done` now consume required eval outputs and blocking workflow questions directly.
7. Broader host coverage is now explicit: unsupported hosts use the generated manual fallback contract until they adopt a real lifecycle adapter.

## Impact

1. Skopos does not always build itself through its own workflow artifacts.
2. Dogfooding produces less durable execution memory than the product intends.
3. Workflow failures are easier to explain away in chat instead of being recorded as Skopos findings or mission state.
4. Structural design rationale can still lag behind code even while runtime mission state looks correct.
5. Users no longer need to infer the fallback control plane for unsupported hosts; the generated guide tells them which Skopos command belongs at each lifecycle point.

## Fix Plan

1. Canonicalize the self-hosting workflow contract around Skopos-native plan and mission execution.
2. Remove stale hybrid-governance wording from the Skopos start router and local-development runbook.
3. Create and claim the next real mission before continuing with the search dock batch.
4. Keep this finding active until the workflow gap is not only documented but also obvious in normal self-hosted operation.
5. Tighten the self-hosting docs so structural artifact-family work requires the decision doc before broad code edits.
6. Keep future host integrations on the same adapter contract: promote a host from `manual-only` to automated only when it has real lifecycle coverage.

## Verification

1. The Skopos start router and local-development runbook describe Skopos-native execution as the primary self-hosting path.
2. The next feature batch has a durable Skopos plan and claimed mission.
3. The current instruction-mirror trust warning is repaired through the Skopos workflow surface instead of a one-off manual fix.
4. `skopos trust` warns when tracked local source or workflow work exists without an active claimed mission.
5. `skopos done` inherits that warning through workspace trust instead of silently treating missionless work as closure-complete.
6. New structural artifact-family batches write their decision doc before broad code edits instead of relying on mission artifacts alone.
7. The first implementation slice defines `skopos start` plus durable question and recommendation artifacts as runtime state instead of more prompt-only guidance.
8. `init` and `instructions sync` generate the manual host adapter guide and record it in `.skopos/enforcement.json`.

## Linked Docs

1. `../README.md`
2. `../../00-start-here.md`
3. `../../operations/local-development.md`
4. `../../decisions/archive/018-self-hosting-workflow-contract.md`
5. `../../decisions/019-compiled-reference-layer-and-agent-memory-baseline.md`
6. `../../decisions/archive/020-workflow-router-questions-recommendations-and-eval-contract.md`
