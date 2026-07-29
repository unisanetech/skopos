---
title: Proportional Action Progress And Timeout Gap
status: active
severity: SHOULD
owner: skopos-core
id: F-20260627-validation-lane-progress-timeout-gap
scope: skopos
role: finding
lifecycle: active
authority: supporting
provenance: observed
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - ../architecture/evidence-and-readiness-model.md
  - ../standards/validation.md
reviewCycle: close when bounded progress and interruption proof are complete
---

# Proportional Action Progress And Timeout Gap

## Changelog

- `2026-07-29`: Reframed the remaining issue around canonical Action execution and
  Evidence.

## Finding

Long-running Actions need bounded progress and resumable interruption Evidence. A
coding agent should not wait for several minutes without knowing the active command,
elapsed time, completed checks, or safe remaining action.

## Current State

1. Actions can declare timeout and execution behavior.
2. focused validation economy avoids unnecessary broad runs.
3. failed or timed-out execution records partial state.
4. richer live progress and resumable multi-step Action state remain incomplete.

## Acceptance

1. long Actions emit concise phase progress
2. timeout records passed, failed, interrupted, and remaining work
3. Session context can point to the exact resume action
4. progress reporting does not flood the agent context
