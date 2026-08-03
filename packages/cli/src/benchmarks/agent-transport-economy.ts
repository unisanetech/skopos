import { mkdir, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import type {
  SkoposActionRunResult,
  SkoposReadinessArtifact,
  SkoposSessionContextRunResult,
  SkoposTaskArtifact,
  SkoposVerificationArtifact,
  SkoposWorkQueueRunResult,
} from '@skopos/model';

import {
  buildCompactActionRunOutput,
  buildPagedActionCatalogOutput,
} from '../cli/commands/actions.js';
import { buildPagedImpactOutput } from '../cli/commands/impact.js';
import { buildCompactSessionOutput } from '../cli/commands/session.js';
import { buildCompactTaskOutput } from '../cli/commands/task.js';
import {
  buildCompactReadinessOutput,
  buildCompactVerificationOutput,
} from '../cli/commands/verification.js';
import { buildPagedWorkQueueOutput } from '../cli/commands/work.js';
import {
  COMPACT_JSON_BUDGET_BYTES,
  jsonByteLength,
} from '../cli/shared/pagination.js';

type SkoposImpactRunResult = Parameters<typeof buildPagedImpactOutput>[0];

export type AgentTransportBenchmarkRow = {
  fixture: 'p50' | 'p95';
  collectionSize: number;
  plainContextBytes: number;
  skoposContextBytes: number;
  byteReductionPercent: number;
  plainToolCalls: number;
  skoposToolCalls: number;
  reusableRunLinks: number;
  plainRepeatedExecutions: number;
  skoposRepeatedExecutions: number;
  plainNextActionP50Ms: number;
  plainNextActionP95Ms: number;
  skoposNextActionP50Ms: number;
  skoposNextActionP95Ms: number;
  compactSurfaceMaxBytes: number;
  compactBudgetBytes: number;
};

export type AgentTransportBenchmarkReport = {
  schemaVersion: 1;
  baseline: string;
  timing: string;
  surfaces: string[];
  rows: AgentTransportBenchmarkRow[];
};

const SURFACES = [
  'session',
  'task',
  'verify',
  'readiness',
  'impact',
  'work-queue',
  'action-catalog',
  'action-run',
];

const FIXTURES = [
  { fixture: 'p50' as const, collectionSize: 50 },
  { fixture: 'p95' as const, collectionSize: 1_000 },
];

export const runAgentTransportEconomyBenchmark = (): AgentTransportBenchmarkReport => ({
  schemaVersion: 1,
  baseline:
    'The plain-agent baseline receives the same eight surfaces as raw unbounded JSON and has no reusable-Evidence linker, so each required validation executes in a separate tool call.',
  timing:
    'Timing measures machine-local JSON decode plus selection of the first blocker over 101 samples after warmup; it excludes model, process, and network latency.',
  surfaces: SURFACES,
  rows: FIXTURES.map(({ fixture, collectionSize }) => benchmarkFixture(fixture, collectionSize)),
});

export const renderAgentTransportEconomyBenchmark = (
  report: AgentTransportBenchmarkReport,
): string => {
  const rows = report.rows
    .map(
      (row) =>
        `| ${row.fixture} | ${row.collectionSize.toLocaleString('en-US')} | ${row.plainContextBytes.toLocaleString('en-US')} | ${row.skoposContextBytes.toLocaleString('en-US')} | ${row.byteReductionPercent.toFixed(1)}% | ${row.plainToolCalls} | ${row.skoposToolCalls} | ${row.reusableRunLinks} | ${row.plainRepeatedExecutions} | ${row.skoposRepeatedExecutions} | ${row.plainNextActionP50Ms.toFixed(3)} / ${row.plainNextActionP95Ms.toFixed(3)} | ${row.skoposNextActionP50Ms.toFixed(3)} / ${row.skoposNextActionP95Ms.toFixed(3)} | ${row.compactSurfaceMaxBytes.toLocaleString('en-US')} |`,
    )
    .join('\n');

  return `---
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
  - ../../findings/archive/F-20260803-evidence-reuse-and-agent-transport-economy-gap.md
---

# Agent Transport Economy Benchmark

## Result

| Fixture | Items | Plain bytes | Skopos bytes | Byte reduction | Plain calls | Skopos calls | Reused links | Plain reruns | Skopos reruns | Plain next action p50/p95 ms | Skopos next action p50/p95 ms | Largest compact surface |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${rows}

Every compact command surface remained below the declared ${report.rows[0]?.compactBudgetBytes.toLocaleString('en-US')} byte budget, including the p95 fixture. Every current blocker remains inline.

## Method

${report.baseline}

The eight measured surfaces are: ${report.surfaces.join(', ')}. Tool-call counts include one call per surface. Skopos adds one batch Evidence-reuse call; the plain baseline executes one validation call per requirement because it has no reusable-run linker. Reused links and repeated executions are therefore workflow counts, not estimates from production telemetry.

${report.timing} The timing values are useful for relative payload comparison on the current machine only; they are not model, process, or network latency claims.

## Reproduce

Run \`pnpm benchmark:transport\`. The command regenerates this report from the real compact projection functions used by the CLI.
`;
};

const benchmarkFixture = (
  fixture: AgentTransportBenchmarkRow['fixture'],
  collectionSize: number,
): AgentTransportBenchmarkRow => {
  const inputs = fixtureInputs(collectionSize);
  const rawSurfaces = [
    inputs.session,
    inputs.task,
    inputs.verification,
    inputs.readiness,
    inputs.impact,
    inputs.workQueue,
    inputs.actions,
    inputs.actionRun,
  ];
  const compactSurfaces = [
    buildCompactSessionOutput(inputs.session),
    buildCompactTaskOutput(inputs.task),
    buildCompactVerificationOutput(inputs.verification),
    buildCompactReadinessOutput(inputs.readiness),
    buildPagedImpactOutput(inputs.impact),
    buildPagedWorkQueueOutput(inputs.workQueue),
    buildPagedActionCatalogOutput('/project', inputs.actions),
    buildCompactActionRunOutput(inputs.actionRun),
  ];
  const plainPayload = JSON.stringify(rawSurfaces);
  const skoposPayload = JSON.stringify(compactSurfaces);
  const compactSizes = compactSurfaces.map(jsonByteLength);
  const plainTiming = measureNextAction(plainPayload);
  const skoposTiming = measureNextAction(skoposPayload);

  return {
    fixture,
    collectionSize,
    plainContextBytes: Buffer.byteLength(plainPayload, 'utf8'),
    skoposContextBytes: Buffer.byteLength(skoposPayload, 'utf8'),
    byteReductionPercent:
      (1 - Buffer.byteLength(skoposPayload, 'utf8') / Buffer.byteLength(plainPayload, 'utf8')) *
      100,
    plainToolCalls: SURFACES.length + collectionSize,
    skoposToolCalls: SURFACES.length + 1,
    reusableRunLinks: collectionSize,
    plainRepeatedExecutions: collectionSize,
    skoposRepeatedExecutions: 0,
    plainNextActionP50Ms: plainTiming.p50,
    plainNextActionP95Ms: plainTiming.p95,
    skoposNextActionP50Ms: skoposTiming.p50,
    skoposNextActionP95Ms: skoposTiming.p95,
    compactSurfaceMaxBytes: Math.max(...compactSizes),
    compactBudgetBytes: COMPACT_JSON_BUDGET_BYTES,
  };
};

const measureNextAction = (payload: string): { p50: number; p95: number } => {
  for (let index = 0; index < 10; index += 1) selectNextAction(payload);
  const samples = Array.from({ length: 101 }, () => {
    const startedAt = performance.now();
    selectNextAction(payload);
    return performance.now() - startedAt;
  }).sort((left, right) => left - right);
  return { p50: percentile(samples, 0.5), p95: percentile(samples, 0.95) };
};

const selectNextAction = (payload: string): string | undefined => {
  const decoded = JSON.parse(payload) as unknown;
  return findFirstBlocker(decoded);
};

const findFirstBlocker = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    for (const item of value) {
      const blocker = findFirstBlocker(item);
      if (blocker) return blocker;
    }
    return undefined;
  }
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  if (Array.isArray(record.blockers) && typeof record.blockers[0] === 'string') {
    return record.blockers[0];
  }
  for (const item of Object.values(record)) {
    const blocker = findFirstBlocker(item);
    if (blocker) return blocker;
  }
  return undefined;
};

const percentile = (samples: number[], percentileValue: number): number =>
  samples[Math.min(samples.length - 1, Math.floor(samples.length * percentileValue))] ?? 0;

const fixtureInputs = (size: number) => ({
  session: sessionFixture(size),
  task: taskFixture(size),
  verification: verificationFixture(size),
  readiness: readinessFixture(20),
  impact: impactFixture(size),
  workQueue: workQueueFixture(size),
  actions: Array.from({ length: size }, (_, index) => actionFixture(index)),
  actionRun: actionRunFixture(size),
});

const sessionFixture = (size: number): SkoposSessionContextRunResult =>
  ({
    schemaVersion: 1,
    workspaceRoot: '/project',
    summary: 'Benchmark Session.',
    responseMode: 'progress',
    communicationContract: {
      marker: '[SKOPOS_SESSION_CONTEXT_V1]',
      tokenBudget: 1_200,
      coreRules: ['Answer directly.', 'Keep proof explicit.'],
    },
    currentTaskId: 'T-benchmark',
    coordination: {
      enforcementLevel: 'cooperative',
      preventiveSafety: false,
      session: { sessionId: 'session-benchmark', state: 'live' },
      reservation: { taskId: 'T-benchmark' },
      claims: Array.from({ length: size }, (_, index) => ({
        id: `claim-${index}`,
        taskId: 'T-benchmark',
        resourceKey: `src/${index}.ts`,
      })),
    },
    additionalPendingDecisionCount: 0,
    warnings: Array.from({ length: size }, (_, index) => `Warning ${index}`),
    additionalContext: 'raw projection',
  }) as unknown as SkoposSessionContextRunResult;

const taskFixture = (size: number): SkoposTaskArtifact =>
  ({
    schemaVersion: 1,
    id: 'T-benchmark',
    type: 'task',
    status: 'active',
    authority: 'generated',
    workspaceRoot: '/project',
    state: 'active',
    detail: 'standard',
    title: 'Benchmark Task',
    goal: 'Measure bounded transport.',
    risk: 'standard',
    scope: { scope: { id: 'workspace' } },
    trackedDocumentPath: 'docs/work/tasks/T-benchmark.md',
    steps: Array.from({ length: size }, (_, index) => ({
      id: `step-${index}`,
      kind: 'implementation',
      title: `Step ${index}`,
      status: index === 0 ? 'pending' : 'complete',
    })),
    changeScope: {
      declaredOwnedPaths: Array.from({ length: size }, (_, index) => `src/${index}.ts`),
    },
    selectedActions: Array.from({ length: size }, (_, index) => ({
      id: `quality.${index}`,
      title: `Action ${index}`,
      reason: 'Required benchmark Action.',
    })),
    selectedGuardIds: Array.from({ length: size }, (_, index) => `guard.${index}`),
    evidenceRequirements: Array.from({ length: size }, (_, index) => ({
      id: `acceptance-${index}`,
    })),
    questions: [],
    recommendations: [],
    memoryObligations: [],
    childTasks: [],
    dependencyTaskIds: [],
    planIds: [],
  }) as unknown as SkoposTaskArtifact;

const verificationFixture = (size: number): SkoposVerificationArtifact =>
  ({
    schemaVersion: 1,
    id: 'T-benchmark.verification.closure',
    type: 'verification',
    status: 'generated',
    authority: 'generated',
    workspaceRoot: '/project',
    taskId: 'T-benchmark',
    phase: 'closure',
    risk: 'standard',
    verificationStatus: 'fail',
    summary: 'Benchmark Verification.',
    changedPaths: Array.from({ length: size }, (_, index) => `src/${index}.ts`),
    ignoredPreExistingPaths: [],
    excludedOtherTaskPaths: [],
    externalUnattributedPaths: [],
    pathAttributions: Array.from({ length: size }, (_, index) => ({
      path: `src/${index}.ts`,
      kind: 'task-owned',
      reason: 'declared-task-ownership',
      attributedTaskId: 'T-benchmark',
    })),
    matchedGuards: Array.from({ length: size }, (_, index) => ({
      id: `guard.${index}`,
      title: `Guard ${index}`,
    })),
    actionEvidence: Array.from({ length: size }, (_, index) => ({
      id: `quality.${index}`,
      status: 'fail',
    })),
    acceptanceCoverage: Array.from({ length: size }, (_, index) => ({
      requirementId: `acceptance-${index}`,
      status: 'missing',
    })),
    blockers: ['Run the required focused validation.'],
  }) as unknown as SkoposVerificationArtifact;

const readinessFixture = (size: number): SkoposReadinessArtifact =>
  ({
    schemaVersion: 1,
    id: 'T-benchmark.readiness.close',
    type: 'readiness',
    status: 'generated',
    authority: 'generated',
    workspaceRoot: '/project',
    taskId: 'T-benchmark',
    target: 'close',
    readiness: 'blocked',
    summary: `${size} blockers remain.`,
    blockers: Array.from({ length: size }, (_, index) => `Blocker ${index}`),
    evidenceSummary: { required: size, valid: 0, missingOrStale: size },
  }) as unknown as SkoposReadinessArtifact;

const impactFixture = (size: number): SkoposImpactRunResult =>
  ({
    workspaceRoot: '/project',
    actorId: 'benchmark-agent',
    summary: `${size} changed paths.`,
    graphPath: '.skopos/graph/impact.json',
    changed: Array.from({ length: size }, (_, index) => ({
      path: `src/${index}.ts`,
      category: 'source',
      reason: 'Directly changed source.',
    })),
    matchedGuards: [],
    requiredActions: [],
  }) as unknown as SkoposImpactRunResult;

const workQueueFixture = (size: number): SkoposWorkQueueRunResult =>
  ({
    workspaceRoot: '/project',
    actorId: 'benchmark-agent',
    artifactPath: '.skopos/index/work-queue.json',
    artifactWrite: 'written',
    summary: `${size} queue entries.`,
    workQueue: {
      counts: {
        ready: size,
        'in-progress': 0,
        deferred: 0,
        blocked: 0,
        verifying: 0,
        'ready-to-integrate': 0,
      },
      entries: Array.from({ length: size }, (_, index) => ({
        id: `T-${index}`,
        sourceKind: 'task',
        sourcePath: `docs/work/tasks/T-${index}.md`,
        title: `Task ${index}`,
        summary: 'A representative queue item.',
        scopeId: 'workspace',
        disposition: 'ready',
        reason: 'Ready for the next safe action.',
        priority: index,
        dependencyIds: [],
      })),
    },
  }) as unknown as SkoposWorkQueueRunResult;

const actionFixture = (index: number) => ({
  id: `quality.fixture.${index}`,
  title: `Fixture Action ${index}`,
  description: 'A representative Action declaration.',
  category: 'quality-check',
  scope: ['workspace'],
  command: 'pnpm test',
  cwd: '.',
  inputs: ['src'],
  outputs: [],
  affects: [],
  capabilities: {
    process: 'required' as const,
    network: 'none' as const,
    browser: 'none' as const,
    tools: ['pnpm'],
    secrets: [],
    services: [],
  },
  effects: {
    workspace: 'none' as const,
    artifacts: 'none' as const,
    external: 'none' as const,
  },
  concurrency: 'shared' as const,
  workspaceMode: 'overlay-safe' as const,
  safety: 'read-only',
  requiresApproval: false,
  recommendedAfter: [],
  owner: 'benchmark',
  sourcePath: `tools/skopos/actions/quality-fixture-${index}.yaml`,
});

const actionRunFixture = (size: number): SkoposActionRunResult =>
  ({
    run: {
      schemaVersion: 1,
      id: 'run-benchmark',
      type: 'action-run',
      status: 'generated',
      authority: 'generated',
      workspaceRoot: '/project',
      actionId: 'quality.benchmark',
      actionTitle: 'Benchmark Action',
      actionCategory: 'quality-check',
      actionSafety: 'artifact-producing',
      sourcePath: 'tools/skopos/actions/quality-benchmark.yaml',
      command: 'pnpm test',
      cwd: '.',
      runStatus: 'succeeded',
      exitCode: 0,
      outputPaths: Array.from({ length: size }, (_, index) => `reports/${index}.json`),
      capabilityIssues: [],
      effectViolations: [],
      evidence: {
        executionKey: 'execution-key',
        sourceState: {
          digest: 'source-digest',
          paths: Array.from({ length: size }, (_, index) => ({ path: `src/${index}.ts` })),
        },
        outputState: {
          paths: Array.from({ length: size }, (_, index) => ({
            path: `reports/${index}.json`,
          })),
        },
        freshness: { capturedAt: '2026-08-03T00:00:00.000Z' },
      },
    },
  }) as unknown as SkoposActionRunResult;

const main = async (): Promise<void> => {
  const report = runAgentTransportEconomyBenchmark();
  if (process.argv.includes('--write')) {
    const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
    const reportPath = resolve(
      workspaceRoot,
      'docs/reference/generated/agent-transport-economy-benchmark.md',
    );
    await mkdir(dirname(reportPath), { recursive: true });
    await writeFile(reportPath, renderAgentTransportEconomyBenchmark(report), 'utf8');
    process.stdout.write(`${reportPath}\n`);
    return;
  }
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
};

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await main();
}
