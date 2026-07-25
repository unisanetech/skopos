import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { SkoposTaskIdentity, SkoposWorkflowQuestionArtifact } from '@skopos/model';

export const loadWorkflowQuestionsArtifact = async (
  workspaceRoot: string,
  taskIdentity?: SkoposTaskIdentity,
): Promise<SkoposWorkflowQuestionArtifact | null> => {
  const artifactPaths = taskIdentity
    ? [
        join(
          workspaceRoot,
          '.skopos',
          'tasks',
          safeTaskStateSegment(taskIdentity.worktreeId),
          safeTaskStateSegment(taskIdentity.taskId),
          'questions.json',
        ),
        join(workspaceRoot, '.skopos', 'questions.json'),
      ]
    : [join(workspaceRoot, '.skopos', 'questions.json')];

  for (const artifactPath of artifactPaths) {
    try {
      const contents = await readFile(artifactPath, 'utf8');
      const artifact = JSON.parse(contents) as SkoposWorkflowQuestionArtifact;
      if (!taskIdentity || artifact.generatedForMissionId === taskIdentity.taskId) {
        return artifact;
      }
    } catch {
      continue;
    }
  }

  return null;
};

const safeTaskStateSegment = (value: string): string => {
  if (value === '.') {
    return '%2E';
  }
  if (value === '..') {
    return '%2E%2E';
  }
  return encodeURIComponent(value) || 'task';
};
