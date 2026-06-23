import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import type { SkoposWorkflowQuestionArtifact } from '@skopos/model';

export const loadWorkflowQuestionsArtifact = async (
  workspaceRoot: string,
): Promise<SkoposWorkflowQuestionArtifact | null> => {
  const artifactPath = join(workspaceRoot, '.skopos', 'questions.json');

  try {
    const contents = await readFile(artifactPath, 'utf8');
    return JSON.parse(contents) as SkoposWorkflowQuestionArtifact;
  } catch {
    return null;
  }
};
