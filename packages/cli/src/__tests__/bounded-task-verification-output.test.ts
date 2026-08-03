import { describe, expect, it } from 'vitest';

import type { SkoposTaskArtifact, SkoposVerificationArtifact } from '@skopos/model';

import {
  buildCompactTaskOutput,
  buildPagedTaskDetailOutput,
  buildTaskDetailIndex,
} from '../cli/commands/task.js';
import {
  buildCompactVerificationOutput,
  buildPagedVerificationDetailOutput,
  buildVerificationDetailIndex,
} from '../cli/commands/verification.js';
import {
  COMPACT_JSON_BUDGET_BYTES,
  jsonByteLength,
} from '../cli/shared/pagination.js';

describe('bounded Task and Verification diagnostic transport', () => {
  it('caps Task summary identifiers and pages every full-detail collection', () => {
    const task = taskFixture(1_000);
    const compact = buildCompactTaskOutput(task);
    const full = buildTaskDetailIndex(task);
    const first = buildPagedTaskDetailOutput(task, 'actions');
    const second = buildPagedTaskDetailOutput(
      task,
      'actions',
      first.page.nextCursor,
    );

    expect(compact.selectedActionIds).toHaveLength(12);
    expect(compact.additionalSelectedActionCount).toBe(988);
    expect(compact.selectedGuardIds).toHaveLength(12);
    expect(compact.additionalSelectedGuardCount).toBe(988);
    expect(full.type).toBe('task-detail-index');
    expect(full).not.toHaveProperty('steps');
    expect(full.detailCollections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ collection: 'steps', total: 1_000 }),
        expect.objectContaining({ collection: 'actions', total: 1_000 }),
      ]),
    );
    expect(first.items).toHaveLength(25);
    expect(second.page.offset).toBe(25);
    expect(new Set([...first.items, ...second.items].map((item) => JSON.stringify(item))).size)
      .toBe(50);
    expect(jsonByteLength(compact)).toBeLessThan(COMPACT_JSON_BUDGET_BYTES);
    expect(jsonByteLength(full)).toBeLessThan(COMPACT_JSON_BUDGET_BYTES);
  });

  it('keeps all blockers inline while paging large Verification detail', () => {
    const verification = verificationFixture(1_000);
    const compact = buildCompactVerificationOutput(verification);
    const full = buildVerificationDetailIndex(verification);
    const detail = buildPagedVerificationDetailOutput(
      verification,
      'path-attributions',
      undefined,
      40,
    );

    expect(compact.matchedGuardIds).toHaveLength(20);
    expect(compact.additionalMatchedGuardCount).toBe(980);
    expect(compact.actionEvidence.missingActionIds).toHaveLength(20);
    expect(compact.actionEvidence.additionalMissingActionCount).toBe(980);
    expect(compact.acceptance.missingRequirementIds).toHaveLength(20);
    expect(compact.acceptance.additionalMissingRequirementCount).toBe(980);
    expect(compact.blockers).toEqual(verification.blockers);
    expect(full.type).toBe('verification-detail-index');
    expect(full).not.toHaveProperty('pathAttributions');
    expect(full.detailCollections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ collection: 'path-attributions', total: 1_000 }),
        expect.objectContaining({ collection: 'blockers', total: 10 }),
      ]),
    );
    expect(detail).toMatchObject({
      collection: 'path-attributions',
      page: { total: 1_000, limit: 40, returned: 40 },
    });
    expect(jsonByteLength(compact)).toBeLessThan(COMPACT_JSON_BUDGET_BYTES);
    expect(jsonByteLength(full)).toBeLessThan(COMPACT_JSON_BUDGET_BYTES);
  });
});

const taskFixture = (size: number): SkoposTaskArtifact =>
  ({
    schemaVersion: 1,
    id: 'T-large',
    type: 'task',
    status: 'active',
    authority: 'generated',
    workspaceRoot: '/project',
    state: 'active',
    detail: 'standard',
    title: 'Large Task fixture',
    goal: 'Prove bounded diagnostic output.',
    risk: 'standard',
    scope: { scope: { id: 'workspace' } },
    trackedDocumentPath: 'docs/work/tasks/T-large.md',
    steps: Array.from({ length: size }, (_, index) => ({
      id: `step-${index}`,
      kind: 'implementation',
      title: `Step ${index}`,
      detail: 'Representative detail.',
      status: index === 0 ? 'pending' : 'complete',
    })),
    changeScope: {
      declaredOwnedPaths: Array.from({ length: size }, (_, index) => `src/${index}.ts`),
    },
    selectedActions: Array.from({ length: size }, (_, index) => ({
      id: `quality.${index}`,
      title: `Action ${index}`,
      reason: 'Required fixture Action.',
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
    id: 'T-large.verification.closure',
    type: 'verification',
    status: 'generated',
    authority: 'generated',
    workspaceRoot: '/project',
    taskId: 'T-large',
    phase: 'closure',
    risk: 'standard',
    verificationStatus: 'fail',
    summary: 'Representative large Verification.',
    changedPaths: Array.from({ length: size }, (_, index) => `src/${index}.ts`),
    ignoredPreExistingPaths: [],
    excludedOtherTaskPaths: [],
    externalUnattributedPaths: [],
    pathAttributions: Array.from({ length: size }, (_, index) => ({
      path: `src/${index}.ts`,
      kind: 'task-owned',
      reason: 'declared-task-ownership',
      attributedTaskId: 'T-large',
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
    blockers: Array.from({ length: 10 }, (_, index) => `Blocker ${index}`),
  }) as unknown as SkoposVerificationArtifact;
