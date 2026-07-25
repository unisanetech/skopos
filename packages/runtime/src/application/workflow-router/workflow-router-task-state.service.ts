import { join } from 'node:path';

import type {
  SkoposMissionArtifact,
  SkoposTaskIdentity,
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowRecommendationArtifact,
} from '@skopos/model';
import {
  buildSkoposTaskIdentity,
  resolveSkoposWorkspaceIdentity,
  taskIdentityMatchesWorkspace,
} from '@skopos/trust';

import { writeJsonArtifact } from '../shared/write-json-artifact.js';
import {
  loadWorkflowQuestionsArtifact,
  loadWorkflowRecommendationsArtifact,
  QUESTIONS_ARTIFACT_PATH,
  RECOMMENDATIONS_ARTIFACT_PATH,
  resolveTaskQuestionsArtifactPath,
  resolveTaskRecommendationsArtifactPath,
} from './workflow-router-state.service.js';

export const resolveMissionTaskIdentity = async ({
  workspaceRoot,
  mission,
  actorId,
}: {
  workspaceRoot: string;
  mission: SkoposMissionArtifact;
  actorId?: string;
}): Promise<SkoposTaskIdentity> => {
  const workspace = await resolveSkoposWorkspaceIdentity(workspaceRoot);
  if (mission.taskIdentity) {
    if (!taskIdentityMatchesWorkspace({ taskIdentity: mission.taskIdentity, workspace })) {
      throw new Error(
        `Mission ${mission.id} belongs to branch ${mission.taskIdentity.branch ?? '(detached)'} in worktree ${mission.taskIdentity.worktreeId}; pass a mission from the current branch and worktree.`,
      );
    }

    return {
      ...mission.taskIdentity,
      actorId: mission.taskIdentity.actorId ?? actorId,
    };
  }

  return buildSkoposTaskIdentity({
    workspace,
    taskId: mission.id,
    actorId,
  });
};

export const loadWorkflowQuestionsForMission = async ({
  workspaceRoot,
  mission,
  actorId,
}: {
  workspaceRoot: string;
  mission: SkoposMissionArtifact;
  actorId?: string;
}): Promise<SkoposWorkflowQuestionArtifact | undefined> => {
  const taskIdentity = await resolveMissionTaskIdentity({ workspaceRoot, mission, actorId });

  try {
    return await loadWorkflowQuestionsArtifact(workspaceRoot, taskIdentity);
  } catch (error) {
    if (!isMissingFileError(error)) {
      throw error;
    }
  }

  try {
    const compatibilityArtifact = await loadWorkflowQuestionsArtifact(workspaceRoot);
    return compatibilityArtifact.generatedForMissionId === mission.id
      ? { ...compatibilityArtifact, taskIdentity }
      : undefined;
  } catch (error) {
    if (isMissingFileError(error)) {
      return undefined;
    }
    throw error;
  }
};

export const loadWorkflowRecommendationsForMission = async ({
  workspaceRoot,
  mission,
  actorId,
}: {
  workspaceRoot: string;
  mission: SkoposMissionArtifact;
  actorId?: string;
}): Promise<SkoposWorkflowRecommendationArtifact | undefined> => {
  const taskIdentity = await resolveMissionTaskIdentity({ workspaceRoot, mission, actorId });

  try {
    return await loadWorkflowRecommendationsArtifact(workspaceRoot, taskIdentity);
  } catch (error) {
    if (!isMissingFileError(error)) {
      throw error;
    }
  }

  try {
    const compatibilityArtifact = await loadWorkflowRecommendationsArtifact(workspaceRoot);
    return compatibilityArtifact.generatedForMissionId === mission.id
      ? { ...compatibilityArtifact, taskIdentity }
      : undefined;
  } catch (error) {
    if (isMissingFileError(error)) {
      return undefined;
    }
    throw error;
  }
};

export const writeWorkflowQuestionsState = async ({
  workspaceRoot,
  artifact,
  dryRun,
}: {
  workspaceRoot: string;
  artifact: SkoposWorkflowQuestionArtifact;
  dryRun: boolean;
}): Promise<{
  authorityPath: string;
  compatibilityPath: string;
  write: 'written' | 'dry-run';
}> => {
  if (!artifact.taskIdentity) {
    throw new Error('Task-scoped workflow questions require a task identity.');
  }

  const authorityPath = resolveTaskQuestionsArtifactPath(workspaceRoot, artifact.taskIdentity);
  const compatibilityPath = join(workspaceRoot, QUESTIONS_ARTIFACT_PATH);
  const write = await writeJsonArtifact({ artifactPath: authorityPath, artifact, dryRun });
  await writeJsonArtifact({ artifactPath: compatibilityPath, artifact, dryRun });
  return { authorityPath, compatibilityPath, write };
};

export const writeWorkflowRecommendationsState = async ({
  workspaceRoot,
  artifact,
  dryRun,
}: {
  workspaceRoot: string;
  artifact: SkoposWorkflowRecommendationArtifact;
  dryRun: boolean;
}): Promise<{
  authorityPath: string;
  compatibilityPath: string;
  write: 'written' | 'dry-run';
}> => {
  if (!artifact.taskIdentity) {
    throw new Error('Task-scoped workflow recommendations require a task identity.');
  }

  const authorityPath = resolveTaskRecommendationsArtifactPath(workspaceRoot, artifact.taskIdentity);
  const compatibilityPath = join(workspaceRoot, RECOMMENDATIONS_ARTIFACT_PATH);
  const write = await writeJsonArtifact({ artifactPath: authorityPath, artifact, dryRun });
  await writeJsonArtifact({ artifactPath: compatibilityPath, artifact, dryRun });
  return { authorityPath, compatibilityPath, write };
};

const isMissingFileError = (error: unknown): boolean =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error as { code?: unknown }).code === 'ENOENT';
