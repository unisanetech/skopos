import { join, relative } from 'node:path';

import type {
  SkoposCompactTaskBrief,
  SkoposCurrentBriefProjection,
  SkoposCurrentTaskProjection,
  SkoposMissionArtifact,
  SkoposReceiptProjection,
  SkoposWorkflowRunArtifact,
} from '@skopos/model';
import { buildSkoposCompactProjectArtifact } from '@skopos/trust';

import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export const COMPACT_PROJECT_ARTIFACT_PATH = '.skopos/project.json';
export const CURRENT_TASK_ARTIFACT_PATH = '.skopos/current/task.json';
export const CURRENT_BRIEF_ARTIFACT_PATH = '.skopos/current/brief.json';
export const RECEIPTS_ARTIFACT_DIRECTORY = '.skopos/receipts';

export const writeSkoposCompactProjectProjection = async ({
  workspaceRoot,
  dryRun = false,
}: {
  workspaceRoot: string;
  dryRun?: boolean;
}): Promise<{
  projectPath: string;
  write: 'written' | 'dry-run';
}> => {
  const projectPath = join(workspaceRoot, COMPACT_PROJECT_ARTIFACT_PATH);
  const write = await writeJsonArtifact({
    artifactPath: projectPath,
    artifact: buildSkoposCompactProjectArtifact({ workspaceRoot }),
    dryRun,
  });
  return { projectPath, write };
};

export const writeSkoposCurrentTaskProjections = async ({
  workspaceRoot,
  mission,
  brief,
  dryRun = false,
}: {
  workspaceRoot: string;
  mission: SkoposMissionArtifact;
  brief: SkoposCompactTaskBrief;
  dryRun?: boolean;
}): Promise<{
  projectPath: string;
  taskPath: string;
  briefPath: string;
}> => {
  if (!mission.taskIdentity) {
    throw new Error('Compact current-task projections require task/worktree identity.');
  }

  const generatedAt = new Date().toISOString();
  const authorityMissionPath = `.skopos/missions/${mission.id}.json`;
  const projectPath = join(workspaceRoot, COMPACT_PROJECT_ARTIFACT_PATH);
  const taskPath = join(workspaceRoot, CURRENT_TASK_ARTIFACT_PATH);
  const briefPath = join(workspaceRoot, CURRENT_BRIEF_ARTIFACT_PATH);
  const taskProjection: SkoposCurrentTaskProjection = {
    schemaVersion: 1,
    id: 'current-task',
    type: 'current-task-projection',
    status: 'generated',
    authority: 'generated',
    summary: `Compact projection of ${mission.id}; mission state remains authoritative.`,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    taskIdentity: mission.taskIdentity,
    authorityMissionPath,
    task: brief.task,
  };
  const briefProjection: SkoposCurrentBriefProjection = {
    schemaVersion: 1,
    id: 'current-brief',
    type: 'current-brief-projection',
    status: 'generated',
    authority: 'generated',
    summary: `Smallest-sufficient task brief for ${mission.id}.`,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    taskIdentity: mission.taskIdentity,
    authorityMissionPath,
    brief,
  };

  await Promise.all([
    writeJsonArtifact({
      artifactPath: projectPath,
      artifact: buildSkoposCompactProjectArtifact({ workspaceRoot, generatedAt }),
      dryRun,
    }),
    writeJsonArtifact({ artifactPath: taskPath, artifact: taskProjection, dryRun }),
    writeJsonArtifact({ artifactPath: briefPath, artifact: briefProjection, dryRun }),
  ]);

  return { projectPath, taskPath, briefPath };
};

export const writeSkoposReceiptProjection = async ({
  workspaceRoot,
  authorityRunPath,
  artifact,
}: {
  workspaceRoot: string;
  authorityRunPath: string;
  artifact: SkoposWorkflowRunArtifact;
}): Promise<string | undefined> => {
  if (!artifact.receipt || artifact.runStatus !== 'succeeded') {
    return undefined;
  }

  const receiptPath = join(
    workspaceRoot,
    RECEIPTS_ARTIFACT_DIRECTORY,
    `${artifact.receipt.executionKey}.json`,
  );
  const projection: SkoposReceiptProjection = {
    schemaVersion: 1,
    id: artifact.receipt.executionKey,
    type: 'workflow-receipt-projection',
    status: 'generated',
    authority: 'generated',
    summary: `Receipt projection for authoritative workflow run ${artifact.id}.`,
    updatedAt: artifact.finishedAt ?? artifact.updatedAt,
    generatedAt: artifact.finishedAt ?? artifact.generatedAt,
    workspaceRoot,
    authorityRunPath: relative(workspaceRoot, authorityRunPath),
    workflowId: artifact.workflowId,
    runId: artifact.id,
    receipt: artifact.receipt,
  };

  await writeJsonArtifact({ artifactPath: receiptPath, artifact: projection });
  return receiptPath;
};
