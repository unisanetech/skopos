import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import {
  buildSkoposDocumentCatalog,
  loadSkoposActionManifests,
  loadSkoposGuardManifests,
} from '@skopos/indexer';
import type {
  SkoposCompactTaskBrief,
  SkoposExecutionPhase,
  SkoposMemoryStateArtifact,
  SkoposResolvedPolicyArtifact,
  SkoposTaskArtifact,
  SkoposTaskQuestionArtifact,
  SkoposTaskRisk,
} from '@skopos/model';
import { resolveSkoposTaskChangedPaths } from '@skopos/verification';

import { buildSkoposCompactTaskBrief, inferSkoposTaskRisk } from './compact-task-brief.js';
import {
  compileSkoposAgentNativeOperatingModel,
  compileSkoposDocumentKnowledgeEntries,
} from './compile-operating-model.js';
import { selectSkoposSkillsForTaskRuntime } from '../skills/skills.service.js';

const RESOLVED_POLICY_ARTIFACT_PATH = '.skopos/index/policies/resolved.json';
const MEMORY_STATE_ARTIFACT_PATH = '.skopos/index/roles.json';

export {
  buildSkoposCompactTaskBrief,
  inferSkoposTaskRisk,
} from './compact-task-brief.js';
export {
  compileSkoposAgentNativeOperatingModel,
  compileSkoposDocumentKnowledgeEntries,
  resolveSkoposActionPhases,
} from './compile-operating-model.js';
export {
  formatSkoposStructuredCommand,
  parseSkoposStructuredCommand,
} from './structured-command.js';
export { evaluateSkoposKnowledgePromotion } from './knowledge-promotion.js';
export {
  PROJECT_ARTIFACT_PATH,
  writeSkoposProjectArtifact,
} from './project-artifact.js';
export {
  mergeSkoposProjectProviderDescription,
  validateSkoposProjectProviderBrief,
  validateSkoposProjectProviderDescription,
  validateSkoposProjectProviderVerification,
} from './project-provider.js';

export interface BuildSkoposCompactTaskBriefRuntimeOptions {
  cwd: string;
  task: SkoposTaskArtifact;
  questions: SkoposTaskQuestionArtifact;
  phase: SkoposExecutionPhase;
  risk?: SkoposTaskRisk;
}

export const buildSkoposCompactTaskBriefRuntime = async ({
  cwd,
  task,
  questions,
  phase,
  risk,
}: BuildSkoposCompactTaskBriefRuntimeOptions): Promise<SkoposCompactTaskBrief> => {
  const workspaceRoot = resolve(cwd);
  const [actions, policy, guards, memory, documentCatalog] = await Promise.all([
    loadSkoposActionManifests({ cwd: workspaceRoot }),
    readJsonIfExists<SkoposResolvedPolicyArtifact>(
      join(workspaceRoot, RESOLVED_POLICY_ARTIFACT_PATH),
    ),
    loadSkoposGuardManifests({ cwd: workspaceRoot }),
    readJsonIfExists<SkoposMemoryStateArtifact>(
      join(workspaceRoot, MEMORY_STATE_ARTIFACT_PATH),
    ),
    buildSkoposDocumentCatalog({ cwd: workspaceRoot }),
  ]);

  const operatingModel = compileSkoposAgentNativeOperatingModel({
    actions,
    policy,
    guards,
    memory,
    knowledge: compileSkoposDocumentKnowledgeEntries(documentCatalog.documents),
  });
  operatingModel.diagnostics.push(
    ...documentCatalog.issues.map(
      (issue) =>
        `Project Memory ${issue.kind} issue [${issue.code}] in ${issue.path}: ${issue.summary}`,
    ),
  );
  const resolvedRisk = risk ?? inferSkoposTaskRisk({ policy, questions });
  const baseBrief = buildSkoposCompactTaskBrief({
    task,
    questions,
    operatingModel,
    phase,
    risk: resolvedRisk,
  });
  const taskChanges = await resolveSkoposTaskChangedPaths({
    workspaceRoot,
    changeScope: task.changeScope,
    currentTaskId: task.id,
    generatedOutputPaths: task.selectedActions.flatMap((action) => action.outputPaths),
  });
  const skillSelection = await selectSkoposSkillsForTaskRuntime({
    cwd: workspaceRoot,
    task: baseBrief.task,
    taskRisk:
      resolvedRisk === 'high-impact'
        ? 'high-impact'
        : resolvedRisk === 'standard'
          ? 'standard'
          : 'light',
    phase,
    ownedPaths: task.changeScope.declaredOwnedPaths,
    changedPaths: taskChanges.changedPaths,
    affectedCapabilities: [
      ...task.selectedActions.flatMap((action) => [action.id, ...action.outputPaths]),
      ...task.selectedGuardIds,
    ],
    selectedActionIds: task.selectedActions.map((action) => action.id),
    applicableGuardIds: task.selectedGuardIds,
    acceptedFailureEvidence: operatingModel.context
      .filter(
        (entry) =>
          entry.kind === 'negative-knowledge' &&
          entry.provenance.some(
            (reference) =>
              reference.authority === 'accepted' || reference.authority === 'declared',
          ),
      )
      .map((entry) => ({ id: entry.id.replace(/^knowledge:/, ''), summary: entry.summary })),
    operatingModel,
  });

  const brief = buildSkoposCompactTaskBrief({
    task,
    questions,
    operatingModel,
    phase,
    risk: resolvedRisk,
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
