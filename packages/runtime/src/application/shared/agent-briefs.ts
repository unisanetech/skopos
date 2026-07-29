import { join, relative } from 'node:path';

import type {
  SkoposAgentBriefArtifact,
  SkoposAgentPolicyBriefArtifact,
  SkoposAgentPromptBriefArtifact,
  SkoposAgentPromptBudgetMeasurement,
  SkoposAgentPromptLayer,
  SkoposAgentPromptLayerReference,
  SkoposResolvedPolicyArtifact,
  SkoposTaskIdentity,
} from '@skopos/model';

import { resolveCurrentTaskState } from './current-task-state.js';
import {
  BOOTSTRAP_ARTIFACT_PATH,
  COMMUNICATION_BRIEF_ARTIFACT_PATH,
  CONFIG_ARTIFACT_PATH,
  POLICY_BRIEF_ARTIFACT_PATH,
  POLICY_ROLE_MAPPING_ARTIFACT_PATH,
  PROMPT_BRIEF_ARTIFACT_PATH,
  RESOLVED_POLICY_ARTIFACT_PATH,
  TOKEN_BUDGETS,
} from './token-control-constants.js';
import {
  estimateTokens,
  readJsonIfExists,
  readTextIfExists,
  resolveCurrentTaskHandoffPath,
} from './token-control-state.js';
import { refreshSkoposTokenTelemetry } from './token-telemetry.js';
import { writeJsonArtifact } from './write-json-artifact.js';

export interface WriteAgentBriefOptions<TArtifact extends SkoposAgentBriefArtifact> {
  artifactPath: string;
  artifact: TArtifact;
  taskIdentity?: SkoposTaskIdentity;
  dryRun?: boolean;
}

export interface WriteAgentBriefResult<TArtifact extends SkoposAgentBriefArtifact> {
  path: string;
  write: 'written' | 'dry-run';
  artifact: TArtifact;
}

export const buildSkoposAgentPolicyBrief = ({
  workspaceRoot,
  policy,
  roleMappingPath,
  mappedRoleCount,
  missingRequiredRoleCount,
}: {
  workspaceRoot: string;
  policy: SkoposResolvedPolicyArtifact;
  roleMappingPath?: string;
  mappedRoleCount?: number;
  missingRequiredRoleCount?: number;
}): SkoposAgentPolicyBriefArtifact => {
  const highImpactRisk = policy.recommendedTaskRisks.find(
    (entry) => entry.risk === 'high-impact',
  );
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    id: 'agent-brief-policy',
    type: 'agent-brief',
    status: 'generated',
    authority: 'generated',
    summary: `Accepted policy includes ${policy.acceptedPacks.length} pack${policy.acceptedPacks.length === 1 ? '' : 's'} and ${policy.activeRules.length} active rule${policy.activeRules.length === 1 ? '' : 's'} for ${policy.projectLifecycle}.`,
    updatedAt: now,
    generatedAt: now,
    workspaceRoot,
    briefKind: 'policy',
    projectLifecycle: policy.projectLifecycle,
    acceptedPackIds: policy.acceptedPacks.map((entry) => entry.packId),
    activeRuleCount: policy.activeRules.length,
    mustRuleCount: policy.activeRules.filter((entry) => entry.severity === 'must').length,
    defaultTaskRisk: policy.defaultTaskRisk,
    detailedTaskTriggers: highImpactRisk?.triggers ?? [],
    sourcePaths: policy.sourceDependencies.map((dependency) => dependency.path),
    roleMappingPath,
    mappedRoleCount,
    missingRequiredRoleCount,
  };
};

export const buildSkoposAgentPromptBrief = ({
  workspaceRoot,
  currentTaskId,
  currentHandoffPath,
  layers,
  measurements,
}: {
  workspaceRoot: string;
  currentTaskId?: string;
  currentHandoffPath?: string;
  layers: SkoposAgentPromptLayer[];
  measurements: SkoposAgentPromptBudgetMeasurement[];
}): SkoposAgentPromptBriefArtifact => {
  const defaultResumeEstimatedTokens =
    measurements.find((entry) => entry.id === 'resume-context')?.estimatedTokens ?? 0;
  const overBudgetIds = measurements
    .filter((entry) => entry.status === 'over-budget')
    .map((entry) => entry.id);
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    id: 'agent-brief-prompt',
    type: 'agent-brief',
    status: 'generated',
    authority: 'generated',
    summary:
      overBudgetIds.length > 0
        ? `Prompt layering has ${overBudgetIds.length} budget issue${overBudgetIds.length === 1 ? '' : 's'}.`
        : `Prompt layering is within the ${TOKEN_BUDGETS.resumeContext}-token default resume budget.`,
    updatedAt: now,
    generatedAt: now,
    workspaceRoot,
    briefKind: 'prompt',
    currentTaskId,
    currentHandoffPath,
    stablePrefixSummary:
      'Keep host instructions and one compact workspace memory router stable; retrieve deeper Memory only when the Task needs it.',
    dynamicTailSummary: currentTaskId
      ? 'Load the exact Task, its questions and recommendations, and its exact handoff when present.'
      : 'No writing Task is selected; use the project Work Queue without inventing current Task authority.',
    recommendedLoadSequence: layers.map((layer) => layer.id),
    layers,
    measurements,
    defaultResumeEstimatedTokens,
    defaultResumeBudgetTokens: TOKEN_BUDGETS.resumeContext,
    overBudgetIds,
  };
};

export const writeSkoposAgentBrief = async <TArtifact extends SkoposAgentBriefArtifact>({
  artifactPath,
  artifact,
  taskIdentity,
  dryRun = false,
}: WriteAgentBriefOptions<TArtifact>): Promise<WriteAgentBriefResult<TArtifact>> => {
  const write = await writeJsonArtifact({ artifactPath, artifact, dryRun });
  await refreshSkoposAgentPromptBrief({
    workspaceRoot: artifact.workspaceRoot,
    taskIdentity,
    dryRun,
  });
  await refreshSkoposTokenTelemetry({
    workspaceRoot: artifact.workspaceRoot,
    taskIdentity,
    dryRun,
  });
  return { path: artifactPath, write, artifact };
};

export const refreshSkoposAgentPromptBrief = async ({
  workspaceRoot,
  taskIdentity,
  dryRun = false,
}: {
  workspaceRoot: string;
  taskIdentity?: SkoposTaskIdentity;
  dryRun?: boolean;
}): Promise<WriteAgentBriefResult<SkoposAgentPromptBriefArtifact>> => {
  const currentTask = await resolveCurrentTaskState({ workspaceRoot, taskIdentity });
  const currentTaskId = currentTask?.task.id;
  const currentHandoffPath = await resolveCurrentTaskHandoffPath(
    workspaceRoot,
    taskIdentity,
  );
  const doctrineReferences = await buildWorkspaceDoctrineReferences(workspaceRoot);
  const policyReferences = await Promise.all([
    buildPromptLayerReference(workspaceRoot, {
      id: 'policy-brief',
      title: 'Policy brief',
      role: 'accepted-project-policy',
      path: POLICY_BRIEF_ARTIFACT_PATH,
      defaultIncluded: true,
      optional: true,
    }),
    buildPromptLayerReference(workspaceRoot, {
      id: 'resolved-policy',
      title: 'Resolved policy',
      role: 'accepted-policy-source',
      path: RESOLVED_POLICY_ARTIFACT_PATH,
      defaultIncluded: false,
      optional: true,
    }),
    buildPromptLayerReference(workspaceRoot, {
      id: 'policy-role-mapping',
      title: 'Policy role mapping',
      role: 'accepted-role-map',
      path: POLICY_ROLE_MAPPING_ARTIFACT_PATH,
      defaultIncluded: true,
      optional: true,
    }),
  ]);
  const dynamicReferences = currentTask
    ? (
        await Promise.all([
          buildPromptLayerReference(workspaceRoot, {
            id: 'task',
            title: 'Current Task',
            role: 'current-task-authority',
            path: relative(workspaceRoot, currentTask.taskPath),
            defaultIncluded: true,
          }),
          buildPromptLayerReference(workspaceRoot, {
            id: 'task-questions',
            title: 'Task questions',
            role: 'open-task-questions',
            path: relative(workspaceRoot, currentTask.questionsPath),
            defaultIncluded: true,
          }),
          buildPromptLayerReference(workspaceRoot, {
            id: 'task-recommendations',
            title: 'Task recommendations',
            role: 'derived-next-actions',
            path: relative(workspaceRoot, currentTask.recommendationsPath),
            defaultIncluded: true,
          }),
          currentHandoffPath
            ? buildPromptLayerReference(workspaceRoot, {
                id: 'task-handoff',
                title: 'Task handoff',
                role: 'cross-session-continuation',
                path: currentHandoffPath,
                defaultIncluded: true,
                optional: true,
              })
            : undefined,
        ])
      ).filter((entry): entry is SkoposAgentPromptLayerReference => Boolean(entry))
    : [];
  const layers: SkoposAgentPromptLayer[] = [
    {
      id: 'stable-system-tool-prefix',
      kind: 'stable-system-tool-prefix',
      summary: 'Host-managed system, tools, and repository instructions.',
      estimatedTokens: 0,
      references: [
        {
          id: 'host-managed-system-tools',
          title: 'Host-managed system and tools',
          role: 'system-and-tooling',
          defaultIncluded: true,
          available: true,
        },
      ],
    },
    {
      id: 'stable-workspace-doctrine-prefix',
      kind: 'stable-workspace-doctrine-prefix',
      summary: 'Compact workspace Memory and communication guidance.',
      estimatedTokens: sumEstimatedTokens(doctrineReferences),
      references: doctrineReferences,
    },
    {
      id: 'stable-project-policy-prefix',
      kind: 'stable-project-policy-prefix',
      summary: 'Accepted project Policy and role guidance.',
      estimatedTokens: sumEstimatedTokens(policyReferences),
      references: policyReferences,
    },
    {
      id: 'dynamic-task-tail',
      kind: 'dynamic-task-tail',
      summary: currentTaskId
        ? 'Exact Task-local continuation state.'
        : 'No Task-local state is loaded.',
      estimatedTokens: sumEstimatedTokens(dynamicReferences),
      references: dynamicReferences,
    },
  ];
  const measurements = [
    buildBudgetMeasurement(dynamicReferences, 'task', 'Task', TOKEN_BUDGETS.task),
    buildBudgetMeasurement(
      dynamicReferences,
      'task-questions',
      'Task questions',
      TOKEN_BUDGETS.taskQuestions,
    ),
    buildBudgetMeasurement(
      dynamicReferences,
      'task-recommendations',
      'Task recommendations',
      TOKEN_BUDGETS.taskRecommendations,
    ),
    buildBudgetMeasurement(
      dynamicReferences,
      'task-handoff',
      'Task handoff',
      TOKEN_BUDGETS.handoff,
    ),
    {
      id: 'resume-context',
      title: 'Default resume context',
      estimatedTokens: layers.reduce((total, layer) => total + layer.estimatedTokens, 0),
      budgetTokens: TOKEN_BUDGETS.resumeContext,
      status:
        layers.reduce((total, layer) => total + layer.estimatedTokens, 0) >
        TOKEN_BUDGETS.resumeContext
          ? 'over-budget' as const
          : 'within-budget' as const,
    },
  ];
  const artifact = buildSkoposAgentPromptBrief({
    workspaceRoot,
    currentTaskId,
    currentHandoffPath,
    layers,
    measurements,
  });
  const path = join(workspaceRoot, PROMPT_BRIEF_ARTIFACT_PATH);
  const write = await writeJsonArtifact({ artifactPath: path, artifact, dryRun });
  return { path, write, artifact };
};

const sumEstimatedTokens = (references: SkoposAgentPromptLayerReference[]): number =>
  references.reduce(
    (total, reference) =>
      total +
      (reference.available && reference.defaultIncluded
        ? reference.estimatedTokens ?? 0
        : 0),
    0,
  );

const buildBudgetMeasurement = (
  references: SkoposAgentPromptLayerReference[],
  id: string,
  title: string,
  budgetTokens: number,
): SkoposAgentPromptBudgetMeasurement => {
  const reference = references.find((entry) => entry.id === id);
  const estimatedTokens = reference?.estimatedTokens ?? 0;
  return {
    id,
    title,
    path: reference?.path,
    estimatedTokens,
    budgetTokens,
    status: !reference?.available
      ? 'missing'
      : estimatedTokens > budgetTokens
        ? 'over-budget'
        : 'within-budget',
  };
};

const buildPromptLayerReference = async (
  workspaceRoot: string,
  options: {
    id: string;
    title: string;
    role: string;
    path: string;
    defaultIncluded: boolean;
    optional?: boolean;
  },
): Promise<SkoposAgentPromptLayerReference> => {
  const contents = await readTextIfExists(join(workspaceRoot, options.path));
  return {
    ...options,
    available: contents !== undefined,
    estimatedTokens: contents ? estimateTokens(contents) : undefined,
  };
};

const buildWorkspaceDoctrineReferences = async (
  workspaceRoot: string,
): Promise<SkoposAgentPromptLayerReference[]> => {
  const bootstrap = await readJsonIfExists<{
    detected?: { docsHealth?: { root?: string; hasStartHere?: boolean } };
    recommendedConfig?: { docs?: { root?: string; startHerePath?: string } };
  }>(join(workspaceRoot, BOOTSTRAP_ARTIFACT_PATH));
  const references = [
    buildPromptLayerReference(workspaceRoot, {
      id: 'communication-brief',
      title: 'Agent communication brief',
      role: 'agent-communication-guidance',
      path: COMMUNICATION_BRIEF_ARTIFACT_PATH,
      defaultIncluded: true,
      optional: true,
    }),
    buildPromptLayerReference(workspaceRoot, {
      id: 'workspace-bootstrap',
      title: 'Workspace bootstrap',
      role: 'compiled-workspace-bootstrap',
      path: BOOTSTRAP_ARTIFACT_PATH,
      defaultIncluded: true,
    }),
    buildPromptLayerReference(workspaceRoot, {
      id: 'workspace-config',
      title: 'Workspace config',
      role: 'workspace-config',
      path: CONFIG_ARTIFACT_PATH,
      defaultIncluded: false,
      optional: true,
    }),
  ];
  const docsRoot =
    bootstrap?.recommendedConfig?.docs?.root ?? bootstrap?.detected?.docsHealth?.root;
  const startHerePath =
    bootstrap?.recommendedConfig?.docs?.startHerePath ??
    (docsRoot ? `${docsRoot}/00-start-here.md` : undefined);
  if (startHerePath && bootstrap?.detected?.docsHealth?.hasStartHere) {
    references.push(
      buildPromptLayerReference(workspaceRoot, {
        id: 'docs-start-here',
        title: 'Docs router',
        role: 'workspace-docs-router',
        path: startHerePath,
        defaultIncluded: false,
        optional: true,
      }),
    );
  }
  return Promise.all(references);
};
