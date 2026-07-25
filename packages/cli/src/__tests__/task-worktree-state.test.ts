import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type {
  SkoposTaskIdentity,
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowRecommendationArtifact,
  SkoposWorkspaceIdentity,
} from '@skopos/model';
import {
  loadWorkflowQuestionsArtifact,
  loadWorkflowRecommendationsArtifact,
  resolveTaskStateArtifactDirectory,
} from '../../../runtime/src/application/workflow-router/workflow-router-state.service.js';
import {
  writeWorkflowQuestionsState,
  writeWorkflowRecommendationsState,
} from '../../../runtime/src/application/workflow-router/workflow-router-task-state.service.js';
import { completeSkoposMissionItemRuntime } from '../../../runtime/src/application/mission/mission.service.js';
import {
  buildSkoposTaskIdentity,
  taskIdentityMatchesWorkspace,
} from '../../../trust/src/application/workspace-identity/workspace-identity.service.js';
import { describe, expect, it } from 'vitest';

describe('task and worktree aware state', () => {
  it('keeps task authority isolated while updating global compatibility projections', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-task-state-'));
    const firstIdentity = buildTaskIdentity({
      workspaceRoot,
      worktreeId: 'worktree-a',
      branch: 'feature/a',
      taskId: 'mission-a',
      actorId: 'agent-a',
    });
    const secondIdentity = buildTaskIdentity({
      workspaceRoot,
      worktreeId: 'worktree-b',
      branch: 'feature/b',
      taskId: 'mission-b',
      actorId: 'agent-b',
    });
    const thirdIdentity = buildTaskIdentity({
      workspaceRoot,
      worktreeId: 'worktree-a',
      branch: 'feature/a',
      taskId: 'mission-c',
      actorId: 'agent-c',
    });

    await writeTaskState({
      workspaceRoot,
      identity: firstIdentity,
      questionId: 'question-a',
    });
    await writeTaskState({
      workspaceRoot,
      identity: secondIdentity,
      questionId: 'question-b',
    });
    await writeTaskState({
      workspaceRoot,
      identity: thirdIdentity,
      questionId: 'question-c',
    });

    await expect(loadWorkflowQuestionsArtifact(workspaceRoot, firstIdentity)).resolves.toEqual(
      expect.objectContaining({
        generatedForMissionId: 'mission-a',
        entries: [expect.objectContaining({ id: 'question-a' })],
      }),
    );
    await expect(loadWorkflowQuestionsArtifact(workspaceRoot, secondIdentity)).resolves.toEqual(
      expect.objectContaining({
        generatedForMissionId: 'mission-b',
        entries: [expect.objectContaining({ id: 'question-b' })],
      }),
    );
    await expect(loadWorkflowQuestionsArtifact(workspaceRoot, thirdIdentity)).resolves.toEqual(
      expect.objectContaining({
        generatedForMissionId: 'mission-c',
        entries: [expect.objectContaining({ id: 'question-c' })],
      }),
    );
    await expect(loadWorkflowRecommendationsArtifact(workspaceRoot, firstIdentity)).resolves.toEqual(
      expect.objectContaining({
        generatedForMissionId: 'mission-a',
      }),
    );
    await expect(loadWorkflowQuestionsArtifact(workspaceRoot)).resolves.toEqual(
      expect.objectContaining({
        generatedForMissionId: 'mission-c',
      }),
    );

    expect(resolveTaskStateArtifactDirectory(workspaceRoot, firstIdentity)).not.toBe(
      resolveTaskStateArtifactDirectory(workspaceRoot, secondIdentity),
    );
    expect(resolveTaskStateArtifactDirectory(workspaceRoot, firstIdentity)).not.toBe(
      resolveTaskStateArtifactDirectory(workspaceRoot, thirdIdentity),
    );
  });

  it('treats branch and worktree as part of task identity', () => {
    const workspace: SkoposWorkspaceIdentity = {
      repositoryId: 'repository',
      repositoryRoot: '/repo',
      worktreeId: 'worktree',
      worktreeRoot: '/repo',
      branch: 'feature/current',
    };
    const identity = buildSkoposTaskIdentity({
      workspace,
      taskId: 'mission-current',
      actorId: 'agent-current',
    });

    expect(taskIdentityMatchesWorkspace({ taskIdentity: identity, workspace })).toBe(true);
    expect(
      taskIdentityMatchesWorkspace({
        taskIdentity: identity,
        workspace: { ...workspace, branch: 'feature/other' },
      }),
    ).toBe(false);
    expect(
      taskIdentityMatchesWorkspace({
        taskIdentity: identity,
        workspace: { ...workspace, worktreeId: 'worktree-other' },
      }),
    ).toBe(false);
  });

  it('rejects task-aware mission mutation from another worktree', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-task-mission-'));
    await mkdir(join(workspaceRoot, '.skopos', 'missions'), { recursive: true });
    const missionId = 'mission-other-worktree';
    await writeFile(
      join(workspaceRoot, '.skopos', 'missions', `${missionId}.json`),
      JSON.stringify({
        schemaVersion: 1,
        id: missionId,
        type: 'mission',
        status: 'generated',
        authority: 'generated',
        summary: 'Other worktree mission.',
        updatedAt: '2026-07-25T00:00:00.000Z',
        generatedAt: '2026-07-25T00:00:00.000Z',
        workspaceRoot,
        taskIdentity: buildTaskIdentity({
          workspaceRoot,
          worktreeId: 'other-worktree',
          branch: 'feature/other',
          taskId: missionId,
          actorId: 'agent-other',
        }),
        planId: 'plan-other-worktree',
        state: 'active',
        title: 'Other worktree mission',
        objective: 'Do other work',
        scope: {
          query: 'workspace',
          matchedBy: 'default-root',
          scope: {
            id: 'workspace',
            kind: 'workspace',
            title: 'Workspace',
            path: '.',
            aliases: [],
            summary: 'Workspace.',
            confidence: 'high',
          },
        },
        items: [
          {
            id: 'step-change',
            kind: 'implementation',
            title: 'Change',
            detail: 'Change.',
            status: 'pending',
          },
        ],
        recommendedChecks: [],
        recommendedWorkflowIds: [],
        decisionQuestionIds: [],
        linkedSlices: [],
        coordination: {
          claimedBy: {
            actorId: 'agent-other',
            claimedAt: '2026-07-25T00:00:00.000Z',
          },
        },
      }),
      'utf8',
    );

    await expect(
      completeSkoposMissionItemRuntime({
        cwd: workspaceRoot,
        mission: missionId,
        itemId: 'step-change',
        actor: 'agent-other',
      }),
    ).rejects.toThrow('not the current branch/worktree');
  });
});

const buildTaskIdentity = ({
  workspaceRoot,
  worktreeId,
  branch,
  taskId,
  actorId,
}: {
  workspaceRoot: string;
  worktreeId: string;
  branch: string;
  taskId: string;
  actorId: string;
}): SkoposTaskIdentity => ({
  repositoryId: 'repository',
  repositoryRoot: workspaceRoot,
  worktreeId,
  worktreeRoot: workspaceRoot,
  branch,
  taskId,
  actorId,
});

const writeTaskState = async ({
  workspaceRoot,
  identity,
  questionId,
}: {
  workspaceRoot: string;
  identity: SkoposTaskIdentity;
  questionId: string;
}): Promise<void> => {
  const timestamp = '2026-07-25T00:00:00.000Z';
  const questions: SkoposWorkflowQuestionArtifact = {
    schemaVersion: 1,
    id: 'questions',
    type: 'questions',
    status: 'generated',
    authority: 'generated',
    summary: 'Task-scoped questions.',
    updatedAt: timestamp,
    generatedAt: timestamp,
    workspaceRoot,
    taskIdentity: identity,
    generatedForPlanId: `plan-${identity.taskId}`,
    generatedForMissionId: identity.taskId,
    entries: [
      {
        id: questionId,
        title: questionId,
        question: questionId,
        category: 'scope',
        escalation: 'recommend-and-ask',
        blocking: false,
        recommendedOptionId: 'continue',
        options: [{ id: 'continue', label: 'Continue', rationale: 'Continue.' }],
        whyItMatters: 'Isolation matters.',
        whatHappensAfterAnswer: 'The task continues.',
        linkedMissionId: identity.taskId,
        evidenceRefs: [],
        status: 'open',
      },
    ],
  };
  const recommendations: SkoposWorkflowRecommendationArtifact = {
    schemaVersion: 1,
    id: 'recommendations',
    type: 'recommendations',
    status: 'generated',
    authority: 'generated',
    summary: 'Task-scoped recommendations.',
    updatedAt: timestamp,
    generatedAt: timestamp,
    workspaceRoot,
    taskIdentity: identity,
    generatedForPlanId: `plan-${identity.taskId}`,
    generatedForMissionId: identity.taskId,
    executionSurface: {
      kind: 'artifact-only',
      summary: 'Artifact only.',
      reason: 'Test state.',
      signals: [],
    },
    entries: [],
  };

  await writeWorkflowQuestionsState({ workspaceRoot, artifact: questions, dryRun: false });
  await writeWorkflowRecommendationsState({
    workspaceRoot,
    artifact: recommendations,
    dryRun: false,
  });
};
