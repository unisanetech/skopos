import { access, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { SkoposAgentProgramBriefArtifact } from '@skopos/model';

import {
  DISCUSSION_HANDOFF_DIRECTORY,
  QUESTIONS_ARTIFACT_PATH,
  PROGRAM_BRIEF_ARTIFACT_PATH,
} from './token-control-constants.js';

export const estimateTokens = (value: string): number => {
  const normalized = value.trim();
  return normalized.length === 0 ? 0 : Math.ceil(normalized.length / 4);
};

export const readTextIfExists = async (path: string): Promise<string | undefined> => {
  try {
    await access(path);
    return await readFile(path, 'utf8');
  } catch {
    return undefined;
  }
};

export const readJsonIfExists = async <T>(path: string): Promise<T | undefined> => {
  const contents = await readTextIfExists(path);
  if (!contents) {
    return undefined;
  }

  return JSON.parse(contents) as T;
};

export const resolveActiveMissionId = async (workspaceRoot: string): Promise<string | undefined> => {
  const questions = await readJsonIfExists<{
    generatedForMissionId?: string;
  }>(join(workspaceRoot, QUESTIONS_ARTIFACT_PATH));
  if (questions?.generatedForMissionId) {
    return questions.generatedForMissionId;
  }

  const programBrief = await readJsonIfExists<SkoposAgentProgramBriefArtifact>(
    join(workspaceRoot, PROGRAM_BRIEF_ARTIFACT_PATH),
  );
  return programBrief?.currentMissionId;
};

export const resolveLatestHandoffPath = async (workspaceRoot: string): Promise<string | undefined> => {
  const handoffRoot = join(workspaceRoot, DISCUSSION_HANDOFF_DIRECTORY);
  try {
    const entries = await readdir(handoffRoot);
    const latest = entries
      .filter((entry) => entry.endsWith('.json'))
      .sort()
      .at(-1);
    return latest ? `${DISCUSSION_HANDOFF_DIRECTORY}/${latest}` : undefined;
  } catch {
    return undefined;
  }
};
