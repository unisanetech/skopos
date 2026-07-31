import { describe, expect, it } from 'vitest';

import type {
  SkoposTaskArtifact,
  SkoposVerificationArtifact,
  SkoposWorkQueueRunResult,
} from '@skopos/model';

import { buildCompactTaskOutput } from '../cli/commands/task.js';
import { buildCompactVerificationOutput } from '../cli/commands/verification.js';
import { buildCompactWorkNextOutput } from '../cli/commands/work.js';

describe('compact command output', () => {
  it('projects bounded Task, Work Queue, and Verify summaries', () => {
    const task = {
      schemaVersion: 1,
      id: 'T-compact',
      type: 'task',
      status: 'active',
      workspaceRoot: '/project',
      state: 'active',
      title: 'Compact command contract',
      goal: 'Keep hot-path output bounded.',
      risk: 'standard',
      scope: { scope: { id: 'workspace' } },
      trackedDocumentPath: 'docs/work/tasks/T-compact.md',
      steps: [
        {
          id: 'step-implementation',
          kind: 'implementation',
          title: 'Implement',
          detail: 'Implement the compact projection.',
          status: 'complete',
        },
        {
          id: 'step-verification',
          kind: 'verification',
          title: 'Verify',
          detail: 'Verify the compact projection.',
          status: 'pending',
        },
      ],
      changeScope: {
        declaredOwnedPaths: Array.from({ length: 15 }, (_, index) => `src/${index}.ts`),
      },
      selectedActions: [{ id: 'quality.focused' }],
      selectedGuardIds: ['guard.focused'],
      questions: [],
      recommendations: [],
    } as unknown as SkoposTaskArtifact;
    const taskSummary = buildCompactTaskOutput(task);
    expect(taskSummary).toMatchObject({
      id: 'T-compact',
      type: 'task-summary',
      progress: {
        completed: 1,
        total: 2,
        nextStep: { id: 'step-verification' },
      },
      additionalOwnedPathCount: 3,
      selectedActionIds: ['quality.focused'],
    });
    expect(taskSummary.ownedPaths).toHaveLength(12);
    expect(taskSummary).not.toHaveProperty('evidenceRequirements');

    const workSummary = buildCompactWorkNextOutput({
      workspaceRoot: '/project',
      actorId: 'agent-a',
      summary: 'One Task is active.',
      currentTaskId: 'T-compact',
      recommendedEntry: undefined,
      workQueue: {
        counts: {
          ready: 0,
          'in-progress': 1,
          blocked: 0,
          verifying: 0,
          'ready-to-integrate': 0,
          complete: 0,
        },
        entries: [{ id: 'T-compact' }, { id: 'T-history' }],
      },
    } as unknown as SkoposWorkQueueRunResult);
    expect(workSummary).toMatchObject({
      currentTaskId: 'T-compact',
      queueItemCount: 2,
    });
    expect(workSummary).not.toHaveProperty('workQueue.entries');

    const verificationSummary = buildCompactVerificationOutput({
      schemaVersion: 1,
      id: 'T-compact.verification.closure',
      type: 'verification',
      status: 'generated',
      workspaceRoot: '/project',
      taskId: 'T-compact',
      phase: 'closure',
      risk: 'standard',
      verificationStatus: 'fail',
      summary: 'One blocker remains.',
      changedPaths: ['src/index.ts'],
      ignoredPreExistingPaths: [],
      matchedGuards: [
        {
          id: 'guard.focused',
          title: 'Focused guard',
          strength: 'required',
          sourcePath: 'tools/skopos/guards/focused.yaml',
          reason: 'Focused proof is required.',
          matchedPaths: ['src/index.ts'],
          requiredActionIds: ['quality.focused'],
          evidence: 'source-bound-action',
        },
      ],
      actionEvidence: [
        {
          id: 'quality.focused',
          title: 'Focused proof',
          category: 'quality-check',
          safety: 'read-only',
          sourcePath: 'tools/skopos/actions/focused.yaml',
          reason: 'Focused proof is required.',
          matchedPaths: ['src/index.ts'],
          outputPaths: [],
          requiresApproval: false,
          status: 'fail',
          summary: 'Evidence is missing.',
        },
      ],
      acceptanceCoverage: [
        {
          requirementId: 'acceptance-1',
          acceptanceCriterion: 'Compact output is proven.',
          status: 'missing',
          actionIds: [],
          guardIds: [],
          summary: 'Observation is missing.',
        },
      ],
      blockers: ['Evidence is missing.'],
    } satisfies SkoposVerificationArtifact);
    expect(verificationSummary).toMatchObject({
      changedPathCount: 1,
      matchedGuardIds: ['guard.focused'],
      actionEvidence: { missingActionIds: ['quality.focused'] },
      acceptance: { missingRequirementIds: ['acceptance-1'] },
    });
    expect(verificationSummary).not.toHaveProperty('changedPaths');
  });
});
