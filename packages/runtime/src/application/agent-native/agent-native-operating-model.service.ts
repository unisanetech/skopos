import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { loadSkoposWorkflowManifests } from '@skopos/indexer';
import type {
  SkoposCompactTaskBrief,
  SkoposExecutionLane,
  SkoposExecutionPhase,
  SkoposMemoryStateArtifact,
  SkoposMissionArtifact,
  SkoposResolvedGatesArtifact,
  SkoposResolvedPolicyArtifact,
  SkoposWorkflowQuestionArtifact,
} from '@skopos/model';

import { buildSkoposCompactTaskBrief, inferSkoposTaskRiskLane } from './compact-task-brief.js';
import { compileSkoposAgentNativeOperatingModel } from './compile-operating-model.js';
import { selectSkoposSkillsForTaskRuntime } from '../skills/skills.service.js';

const RESOLVED_POLICY_ARTIFACT_PATH = '.skopos/policies/resolved.json';
const RESOLVED_GATES_ARTIFACT_PATH = '.skopos/gates/resolved.json';
const MEMORY_STATE_ARTIFACT_PATH = '.skopos/memory/state.json';

export {
  buildSkoposCompactTaskBrief,
  inferSkoposTaskRiskLane,
} from './compact-task-brief.js';
export {
  compileSkoposAgentNativeOperatingModel,
  resolveSkoposWorkflowActionPhases,
} from './compile-operating-model.js';
export {
  selectSkoposEvalCheckCommands,
  selectSkoposEvalWorkflowIds,
} from './phase-execution.js';
export {
  formatSkoposStructuredCommand,
  parseSkoposStructuredCommand,
} from './structured-command.js';
export { evaluateSkoposKnowledgePromotion } from './knowledge-promotion.js';
export {
  COMPACT_PROJECT_ARTIFACT_PATH,
  CURRENT_BRIEF_ARTIFACT_PATH,
  CURRENT_TASK_ARTIFACT_PATH,
  RECEIPTS_ARTIFACT_DIRECTORY,
  writeSkoposCompactProjectProjection,
  writeSkoposCurrentTaskProjections,
  writeSkoposReceiptProjection,
} from './artifact-lifecycle.js';
export {
  mergeSkoposProjectProviderDescription,
  validateSkoposProjectProviderBrief,
  validateSkoposProjectProviderDescription,
  validateSkoposProjectProviderVerification,
} from './project-provider.js';

export interface BuildSkoposCompactTaskBriefRuntimeOptions {
  cwd: string;
  mission: SkoposMissionArtifact;
  questions: SkoposWorkflowQuestionArtifact;
  phase: SkoposExecutionPhase;
  riskLane?: SkoposExecutionLane;
}

export const buildSkoposCompactTaskBriefRuntime = async ({
  cwd,
  mission,
  questions,
  phase,
  riskLane,
}: BuildSkoposCompactTaskBriefRuntimeOptions): Promise<SkoposCompactTaskBrief> => {
  const workspaceRoot = resolve(cwd);
  const [workflows, policy, gates, memory] = await Promise.all([
    loadSkoposWorkflowManifests({ cwd: workspaceRoot }),
    readJsonIfExists<SkoposResolvedPolicyArtifact>(
      join(workspaceRoot, RESOLVED_POLICY_ARTIFACT_PATH),
    ),
    readJsonIfExists<SkoposResolvedGatesArtifact>(
      join(workspaceRoot, RESOLVED_GATES_ARTIFACT_PATH),
    ),
    readJsonIfExists<SkoposMemoryStateArtifact>(
      join(workspaceRoot, MEMORY_STATE_ARTIFACT_PATH),
    ),
  ]);

  const operatingModel = compileSkoposAgentNativeOperatingModel({
    workflows,
    policy,
    gates,
    memory,
  });
  const resolvedRiskLane = riskLane ?? inferSkoposTaskRiskLane({ policy, questions });
  const baseBrief = buildSkoposCompactTaskBrief({
    mission,
    questions,
    operatingModel,
    phase,
    riskLane: resolvedRiskLane,
  });
  const skillSelection = await selectSkoposSkillsForTaskRuntime({
    cwd: workspaceRoot,
    task: baseBrief.task,
    riskLane: resolvedRiskLane,
    operatingModel,
  });

  const brief = buildSkoposCompactTaskBrief({
    mission,
    questions,
    operatingModel,
    phase,
    riskLane: resolvedRiskLane,
    selectedSkills: skillSelection.selectedSkills,
  });
  return {
    ...brief,
    diagnostics: [...new Set([...brief.diagnostics, ...skillSelection.diagnostics])],
  };
};

const readJsonIfExists = async <T>(artifactPath: string): Promise<T | undefined> => {
  try {
    return JSON.parse(await readFile(artifactPath, 'utf8')) as T;
  } catch (error) {
    if (isMissingFileError(error)) {
      return undefined;
    }

    throw error;
  }
};

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
