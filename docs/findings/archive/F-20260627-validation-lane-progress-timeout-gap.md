---
title: Proportional Action Progress And Timeout Gap
status: resolved
severity: SHOULD
owner: skopos-core
id: F-20260627-validation-lane-progress-timeout-gap
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-03
relatedDocs:
  - ../../architecture/evidence-and-readiness-model.md
  - ../../standards/validation.md
reviewCycle: archived after bounded progress and interruption proof completed
---

# Proportional Action Progress And Timeout Gap

## Finding

Long-running Actions needed bounded progress and resumable interruption Evidence. A
coding agent could wait for several minutes without knowing the active command,
elapsed time, completed checks, or safe remaining action.

## Acceptance

1. long Actions emit concise phase progress
2. timeout records passed, failed, interrupted, and remaining work
3. Session context can point to the exact resume action
4. progress reporting does not flood the agent context

## Resolution

Loaded Actions now receive a positive 15-minute default timeout with manifest override.
The runtime emits immediate phase transitions and sparse 30-second heartbeats, caps
persisted progress at 12 recent events, terminates the process group at timeout, and
records a distinct `interrupted` run with completed, failed, interrupted, and remaining
phase sets. Task-bound interruption Evidence stores the exact retry command, and
Session Context prefers it while the interrupted run remains current. Focused tests
cover shell termination, bounded progress, durable interruption Evidence, and
Session Context recovery.
