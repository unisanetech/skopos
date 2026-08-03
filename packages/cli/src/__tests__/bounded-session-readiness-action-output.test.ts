import { describe, expect, it } from 'vitest';

import type {
  SkoposActionRunResult,
  SkoposReadinessArtifact,
  SkoposSessionContextRunResult,
} from '@skopos/model';

import {
  buildActionRunDetailIndex,
  buildCompactActionRunOutput,
} from '../cli/commands/actions.js';
import { buildCompactSessionOutput } from '../cli/commands/session.js';
import { buildCompactReadinessOutput } from '../cli/commands/verification.js';
import {
  COMPACT_JSON_BUDGET_BYTES,
  jsonByteLength,
} from '../cli/shared/pagination.js';

describe('bounded Session, Readiness, and Action run transport', () => {
  it('caps Action output paths and replaces full Evidence with a stable run index', () => {
    const result = actionRunFixture(1_000);
    const compact = buildCompactActionRunOutput(result);
    const full = buildActionRunDetailIndex(result);

    expect(compact.outputPaths).toHaveLength(20);
    expect(compact.additionalOutputPathCount).toBe(980);
    expect(compact.capabilityIssues).toEqual(['Browser capability unavailable.']);
    expect(compact.effectViolations).toEqual(['Undeclared write.']);
    expect(compact.detailPath).toBe('.skopos/runs/run-large.json');
    expect(full).toMatchObject({
      type: 'action-run-detail-index',
      detailPath: '.skopos/runs/run-large.json',
      detailCollections: {
        outputPaths: 1_000,
        sourcePaths: 1_000,
        evidenceOutputPaths: 1_000,
      },
    });
    expect(full).not.toHaveProperty('evidence.sourceState.paths');
    expect(jsonByteLength(compact)).toBeLessThan(COMPACT_JSON_BUDGET_BYTES);
    expect(jsonByteLength(full)).toBeLessThan(COMPACT_JSON_BUDGET_BYTES);
  });

  it('caps Session warnings and claims while preserving bounded injected context', () => {
    const compact = buildCompactSessionOutput(sessionFixture(1_000));

    expect(compact.warnings).toHaveLength(20);
    expect(compact.additionalWarningCount).toBe(980);
    expect(compact.coordination?.claims).toHaveLength(12);
    expect(compact.coordination?.additionalClaimCount).toBe(988);
    expect(compact.additionalContext).toContain('Context warning: Warning 0');
    expect(compact.additionalContext).not.toContain('Context warning: Warning 20');
    expect(jsonByteLength(compact)).toBeLessThan(COMPACT_JSON_BUDGET_BYTES);
  });

  it('keeps every representative Readiness blocker inline below budget', () => {
    const readiness = readinessFixture(20);
    const compact = buildCompactReadinessOutput(readiness);

    expect(compact.blockerCount).toBe(20);
    expect(compact.blockers).toEqual(readiness.blockers);
    expect(jsonByteLength(compact)).toBeLessThan(COMPACT_JSON_BUDGET_BYTES);
  });
});

const actionRunFixture = (size: number): SkoposActionRunResult =>
  ({
    run: {
      schemaVersion: 1,
      id: 'run-large',
      type: 'action-run',
      status: 'generated',
      authority: 'generated',
      workspaceRoot: '/project',
      actionId: 'quality.large',
      actionTitle: 'Large Action',
      actionCategory: 'quality-check',
      actionSafety: 'artifact-producing',
      sourcePath: 'tools/skopos/actions/quality-large.yaml',
      command: 'pnpm test',
      cwd: '.',
      runStatus: 'failed',
      exitCode: 1,
      outputPaths: Array.from({ length: size }, (_, index) => `reports/${index}.json`),
      capabilityIssues: ['Browser capability unavailable.'],
      effectViolations: ['Undeclared write.'],
      evidence: {
        executionKey: 'execution-key',
        sourceState: {
          digest: 'source-digest',
          paths: Array.from({ length: size }, (_, index) => ({ path: `src/${index}.ts` })),
        },
        outputState: {
          paths: Array.from({ length: size }, (_, index) => ({ path: `reports/${index}.json` })),
        },
        freshness: { capturedAt: '2026-08-03T00:00:00.000Z' },
      },
    },
  }) as unknown as SkoposActionRunResult;

const sessionFixture = (size: number): SkoposSessionContextRunResult =>
  ({
    schemaVersion: 1,
    workspaceRoot: '/project',
    summary: 'Large Session fixture.',
    responseMode: 'progress',
    communicationContract: {
      marker: '[SKOPOS_SESSION_CONTEXT_V1]',
      tokenBudget: 1_200,
      coreRules: ['Answer directly.', 'Keep proof explicit.'],
    },
    currentTaskId: 'T-large',
    currentTask: {
      id: 'T-large',
      title: 'Large Task',
      goal: 'Remain bounded.',
      state: 'active',
      risk: 'standard',
      scopeId: 'workspace',
      ownedPaths: ['src'],
      additionalOwnedPathCount: 0,
      completedStepCount: 1,
      totalStepCount: 2,
      selectedActionIds: ['quality.typecheck'],
    },
    coordination: {
      enforcementLevel: 'cooperative',
      preventiveSafety: false,
      session: { sessionId: 'session-large', state: 'live' },
      reservation: { taskId: 'T-large' },
      claims: Array.from({ length: size }, (_, index) => ({
        id: `claim-${index}`,
        taskId: 'T-large',
        resourceKey: `src/${index}.ts`,
      })),
    },
    additionalPendingDecisionCount: 0,
    warnings: Array.from({ length: size }, (_, index) => `Warning ${index}`),
    additionalContext: 'stale projection',
  }) as unknown as SkoposSessionContextRunResult;

const readinessFixture = (size: number): SkoposReadinessArtifact =>
  ({
    schemaVersion: 1,
    id: 'T-large.readiness.close',
    type: 'readiness',
    status: 'generated',
    authority: 'generated',
    workspaceRoot: '/project',
    taskId: 'T-large',
    target: 'close',
    readiness: 'blocked',
    summary: `${size} blockers remain.`,
    blockers: Array.from({ length: size }, (_, index) => `Blocker ${index}`),
    evidenceSummary: { required: size, valid: 0, missingOrStale: size },
  }) as unknown as SkoposReadinessArtifact;
