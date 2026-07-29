import { join, relative } from 'node:path';

import type {
  SkoposAgentPromptBriefArtifact,
  SkoposTaskIdentity,
  SkoposTokenTelemetryArtifact,
} from '@skopos/model';

import { writeJsonArtifact } from './write-json-artifact.js';
import {
  POLICY_BRIEF_ARTIFACT_PATH,
  PROMPT_BRIEF_ARTIFACT_PATH,
  TOKEN_BUDGETS,
  TOKEN_TELEMETRY_ARTIFACT_PATH,
} from './token-control-constants.js';
import { resolveCurrentTaskState } from './current-task-state.js';
import { readJsonIfExists, readTextIfExists, estimateTokens } from './token-control-state.js';

export interface RefreshSkoposTokenTelemetryResult {
  path: string;
  write: 'written' | 'dry-run';
  artifact: SkoposTokenTelemetryArtifact;
}

export const refreshSkoposTokenTelemetry = async ({
  workspaceRoot,
  taskIdentity,
  dryRun = false,
}: {
  workspaceRoot: string;
  taskIdentity?: SkoposTaskIdentity;
  dryRun?: boolean;
}): Promise<RefreshSkoposTokenTelemetryResult> => {
  const currentTask = await resolveCurrentTaskState({ workspaceRoot, taskIdentity });
  const activeTaskId = currentTask?.task.id;
  const taskPath = currentTask
    ? relative(workspaceRoot, currentTask.taskPath)
    : undefined;
  const questionsPath = currentTask
    ? relative(workspaceRoot, currentTask.questionsPath)
    : undefined;
  const recommendationsPath = currentTask
    ? relative(workspaceRoot, currentTask.recommendationsPath)
    : undefined;
  const handoffPath = currentTask
    ? relative(workspaceRoot, currentTask.handoffPath)
    : undefined;
  const promptBrief = await readJsonIfExists<SkoposAgentPromptBriefArtifact>(
    join(workspaceRoot, PROMPT_BRIEF_ARTIFACT_PATH),
  );
  const policyMeasurement = await buildMeasurement(workspaceRoot, {
    id: 'policy-brief',
    title: 'Policy brief',
    surfaceKind: 'agent-brief',
    path: POLICY_BRIEF_ARTIFACT_PATH,
    budgetTokens: TOKEN_BUDGETS.policyBrief,
  });
  const measurements = [
    ...(policyMeasurement.status === 'missing' ? [] : [policyMeasurement]),
    await buildMeasurement(workspaceRoot, {
      id: 'task',
      title: 'Current Task',
      surfaceKind: 'agent-brief',
      path: taskPath,
      budgetTokens: TOKEN_BUDGETS.task,
    }),
    await buildMeasurement(workspaceRoot, {
      id: 'task-questions',
      title: 'Task questions',
      surfaceKind: 'agent-brief',
      path: questionsPath,
      budgetTokens: TOKEN_BUDGETS.taskQuestions,
    }),
    await buildMeasurement(workspaceRoot, {
      id: 'task-recommendations',
      title: 'Task recommendations',
      surfaceKind: 'agent-brief',
      path: recommendationsPath,
      budgetTokens: TOKEN_BUDGETS.taskRecommendations,
    }),
    await buildMeasurement(workspaceRoot, {
      id: 'latest-handoff',
      title: 'Current task handoff',
      surfaceKind: 'discussion-handoff',
      path: handoffPath,
      budgetTokens: TOKEN_BUDGETS.handoff,
    }),
    {
      id: 'resume-context',
      title: 'Default resume context',
      surfaceKind: 'resume-context' as const,
      estimatedTokens: promptBrief?.defaultResumeEstimatedTokens ?? 0,
      budgetTokens: TOKEN_BUDGETS.resumeContext,
      status: !promptBrief
        ? ('missing' as const)
        : promptBrief.defaultResumeEstimatedTokens > TOKEN_BUDGETS.resumeContext
          ? ('over-budget' as const)
          : ('within-budget' as const),
    },
  ];
  const overBudgetCount = measurements.filter((entry) => entry.status === 'over-budget').length;
  const missingCount = measurements.filter((entry) => entry.status === 'missing').length;
  const artifact: SkoposTokenTelemetryArtifact = {
    schemaVersion: 1,
    id: 'token-telemetry',
    type: 'token-telemetry',
    status: 'generated',
    authority: 'generated',
    summary:
      overBudgetCount > 0
        ? `Token telemetry found ${overBudgetCount} over-budget compact transport surface${overBudgetCount === 1 ? '' : 's'}.`
        : `Token telemetry shows ${measurements.length - missingCount} measured compact transport surfaces within current budgets.`,
    updatedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    activeTaskId,
    measurementCount: measurements.length,
    overBudgetCount,
    missingCount,
    measurements,
    suggestedActions: buildSuggestedActions({
      overBudgetCount,
      missingCount,
      latestHandoffStatus: measurements.find((entry) => entry.id === 'latest-handoff')?.status,
    }),
  };
  const artifactPath = join(workspaceRoot, TOKEN_TELEMETRY_ARTIFACT_PATH);
  const write = await writeJsonArtifact({
    artifactPath,
    artifact,
    dryRun,
  });

  return {
    path: artifactPath,
    write,
    artifact,
  };
};

const buildMeasurement = async (
  workspaceRoot: string,
  {
    id,
    title,
    surfaceKind,
    path,
    budgetTokens,
  }: {
    id: string;
    title: string;
    surfaceKind: 'agent-brief' | 'discussion-handoff';
    path?: string;
    budgetTokens: number;
  },
) => {
  if (!path) {
    return {
      id,
      title,
      surfaceKind,
      estimatedTokens: 0,
      budgetTokens,
      status: 'missing' as const,
    };
  }

  const contents = await readTextIfExists(join(workspaceRoot, path));
  if (!contents) {
    return {
      id,
      title,
      surfaceKind,
      path,
      estimatedTokens: 0,
      budgetTokens,
      status: 'missing' as const,
    };
  }

  const estimatedTokens = estimateTokens(contents);
  return {
    id,
    title,
    surfaceKind,
    path,
    estimatedTokens,
    budgetTokens,
    status: estimatedTokens > budgetTokens ? ('over-budget' as const) : ('within-budget' as const),
  };
};

const buildSuggestedActions = ({
  overBudgetCount,
  missingCount,
  latestHandoffStatus,
}: {
  overBudgetCount: number;
  missingCount: number;
  latestHandoffStatus?: 'within-budget' | 'over-budget' | 'missing';
}): string[] => {
  const actions: string[] = [];

  if (latestHandoffStatus === 'missing') {
    actions.push('Generate a Task handoff before relying on cross-session continuation context.');
  }

  if (overBudgetCount > 0) {
    actions.push('Collapse compact transport surfaces further before loading them into the default agent context.');
  }

  if (missingCount > 0 && latestHandoffStatus !== 'missing') {
    actions.push('Refresh compact transport artifacts so telemetry can measure the full hot path.');
  }

  return actions;
};
