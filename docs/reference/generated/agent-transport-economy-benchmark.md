---
title: Agent Transport Economy Benchmark
status: generated
owner: skopos-core
id: DOC-agent-transport-economy-benchmark
scope: skopos
role: reference
lifecycle: durable
authority: generated
provenance: observed
view: current
lastUpdated: 2026-08-03
relatedDocs:
  - ../../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md
  - ../../findings/F-20260803-evidence-reuse-and-agent-transport-economy-gap.md
---

# Agent Transport Economy Benchmark

## Result

| Fixture | Items | Plain bytes | Skopos bytes | Byte reduction | Plain calls | Skopos calls | Reused links | Plain reruns | Skopos reruns | Plain next action p50/p95 ms | Skopos next action p50/p95 ms | Largest compact surface |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| p50 | 50 | 78,665 | 25,488 | 67.6% | 58 | 9 | 50 | 50 | 0 | 0.156 / 0.175 | 0.044 / 0.051 | 10,101 |
| p95 | 1,000 | 1,540,321 | 25,528 | 98.3% | 1008 | 9 | 1000 | 1000 | 0 | 2.726 / 2.918 | 0.042 / 0.047 | 10,105 |

Every compact command surface remained below the declared 32,768 byte budget, including the p95 fixture. Every current blocker remains inline.

## Method

The plain-agent baseline receives the same eight surfaces as raw unbounded JSON and has no reusable-Evidence linker, so each required validation executes in a separate tool call.

The eight measured surfaces are: session, task, verify, readiness, impact, work-queue, action-catalog, action-run. Tool-call counts include one call per surface. Skopos adds one batch Evidence-reuse call; the plain baseline executes one validation call per requirement because it has no reusable-run linker. Reused links and repeated executions are therefore workflow counts, not estimates from production telemetry.

Timing measures machine-local JSON decode plus selection of the first blocker over 101 samples after warmup; it excludes model, process, and network latency. The timing values are useful for relative payload comparison on the current machine only; they are not model, process, or network latency claims.

## Reproduce

Run `pnpm benchmark:transport`. The command regenerates this report from the real compact projection functions used by the CLI.
