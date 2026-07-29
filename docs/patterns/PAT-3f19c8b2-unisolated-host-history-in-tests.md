---
title: "Failure Pattern: Unisolated Host History In Lifecycle Tests"
status: active
owner: skopos-core
id: PAT-3f19c8b2
scope: skopos
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: observed
view: current
appliesTo:
  - tests
  - session-context
  - host-adapters
  - codex
  - local-runtime-state
  - performance
lastUpdated: 2026-07-29
relatedDocs:
  - ../architecture/agent-native-operating-model.md
  - ../architecture/runtime-model.md
reviewCycle: when host-history discovery or lifecycle fixtures change
---

# Failure Pattern: Unisolated Host History In Lifecycle Tests

## Changelog

- `2026-07-29`: Recorded after a focused Session lifecycle test recursively scanned
  the developer's real Codex history and repeatedly hit the test timeout despite the
  coordination operations completing in under one second.

## Failure Shape

A test invokes Session context or discussion import without replacing the coding
host's default local-data root. The runtime searches real host history for a workspace
match, so test duration and imported context depend on one developer's machine instead
of the fixture.

## Detection Signals

1. an isolated temporary workspace still reads `~/.codex`, Claude state, or another
   host-global directory
2. the same test is fast in CI but slow on a workstation with substantial chat history
3. lifecycle assertions time out after their start or coordination steps already
   completed
4. a test imports discussion turns that were not created by the fixture
5. increasing the test timeout changes the symptom without bounding the host scan

## Why It Fails

Host history is unbounded external state. Reading it makes focused proof
non-deterministic, leaks unrelated conversation data into fixtures, and hides whether
the tested lifecycle operation is actually slow.

## Prevention

1. give every lifecycle fixture its own empty host-data root
2. set the supported host environment variable or inject the data root explicitly
3. create only the minimum session records required by the case
4. restore process environment after the test
5. time the smallest suspected boundary before raising a timeout

## Recovery

Remove blind timeout increases, isolate the host-data root, rerun only the affected
test, and record a product performance finding separately if the isolated operation is
still slow.
