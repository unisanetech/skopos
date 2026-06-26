import { join, relative } from 'node:path';

import type {
  SkoposAgentBriefArtifact,
  SkoposAgentDoneBriefArtifact,
  SkoposAgentEvalBriefArtifact,
  SkoposAgentMissionBriefArtifact,
  SkoposAgentPolicyBriefArtifact,
  SkoposAgentPromptBriefArtifact,
  SkoposAgentPromptBudgetMeasurement,
  SkoposAgentPromptLayer,
  SkoposAgentPromptLayerReference,
  SkoposAgentProgramBriefArtifact,
  SkoposAgentTrustBriefArtifact,
  SkoposDoneReport,
  SkoposEvalRunResult,
  SkoposMissionArtifact,
  SkoposMissionItem,
  SkoposProgramSyncRunResult,
  SkoposResolvedPolicyArtifact,
  SkoposTrustCheckStatus,
  SkoposTrustReport,
  SkoposWorkflowQuestionArtifact,
  SkoposWorkflowRecommendationArtifact,
} from '@skopos/model';

import { writeJsonArtifact } from './write-json-artifact.js';
import { refreshSkoposTokenTelemetry } from './token-telemetry.js';
import {
  AGENT_EVAL_BRIEF_DIRECTORY,
  AGENT_MISSION_BRIEF_DIRECTORY,
  BOOTSTRAP_ARTIFACT_PATH,
  CONFIG_ARTIFACT_PATH,
  DONE_BRIEF_ARTIFACT_PATH,
  POLICY_BRIEF_ARTIFACT_PATH,
  POLICY_ROLE_MAPPING_ARTIFACT_PATH,
  PROGRAM_BRIEF_ARTIFACT_PATH,
  PROMPT_BRIEF_ARTIFACT_PATH,
  QUESTIONS_ARTIFACT_PATH,
  RECOMMENDATIONS_ARTIFACT_PATH,
  RESOLVED_POLICY_ARTIFACT_PATH,
  TOKEN_BUDGETS,
  TRUST_BRIEF_ARTIFACT_PATH,
} from './token-control-constants.js';
import {
  estimateTokens,
  readJsonIfExists,
  readTextIfExists,
  resolveActiveMissionId,
  resolveLatestHandoffPath,
} from './token-control-state.js';

export interface WriteAgentBriefOptions<TArtifact extends SkoposAgentBriefArtifact> {
  artifactPath: string;
  artifact: TArtifact;
  dryRun?: boolean;
}

export interface WriteAgentBriefResult<TArtifact extends SkoposAgentBriefArtifact> {
  path: string;
  write: 'written' | 'dry-run';
  artifact: TArtifact;
}

export const buildSkoposAgentTrustBrief = ({
  workspaceRoot,
  report,
}: {
  workspaceRoot: string;
  report: SkoposTrustReport;
}): SkoposAgentTrustBriefArtifact => ({
  schemaVersion: 1,
  id: 'agent-brief-trust',
  type: 'agent-brief',
  status: 'generated',
  authority: 'generated',
  summary: report.summary,
  updatedAt: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  workspaceRoot,
  briefKind: 'trust',
  trustLevel: report.trustLevel,
  readiness: report.readiness,
  checkCounts: countChecks(report.checks),
  attentionChecks: extractAttentionChecks(report.checks),
  findingCount: report.findings.length,
  unresolvedAssumptionCount: report.unresolvedAssumptions.length,
});

export const buildSkoposAgentDoneBrief = ({
  workspaceRoot,
  report,
}: {
  workspaceRoot: string;
  report: SkoposDoneReport;
}): SkoposAgentDoneBriefArtifact => ({
  schemaVersion: 1,
  id: 'agent-brief-done',
  type: 'agent-brief',
  status: 'generated',
  authority: 'generated',
  summary: report.summary,
  updatedAt: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  workspaceRoot,
  briefKind: 'done',
  closureStatus: report.closureStatus,
  trustLevel: report.trust.trustLevel,
  readiness: report.trust.readiness,
  checkCounts: countChecks(report.checks),
  attentionChecks: extractAttentionChecks(report.checks),
  requiredActions: report.requiredActions,
  changedPathCount: report.impact.changedPaths.length,
  missionId: report.missionEvidence?.mission.id,
  missionState: report.missionEvidence?.mission.state,
  missionEvalStatus: report.missionEval?.evaluationStatus,
  blockingQuestionIds: report.workflowQuestions?.blockingQuestionIds ?? [],
  nextCommand: toCommand(report.requiredActions[0]),
});

export const buildSkoposAgentProgramBrief = ({
  workspaceRoot,
  result,
}: {
  workspaceRoot: string;
  result: Pick<
    SkoposProgramSyncRunResult,
    'summary' | 'state' | 'currentMissionId' | 'doNowItem' | 'doNextItem' | 'recommendedAction' | 'nextCommand'
  >;
}): SkoposAgentProgramBriefArtifact => ({
  schemaVersion: 1,
  id: 'agent-brief-program',
  type: 'agent-brief',
  status: 'generated',
  authority: 'generated',
  summary: result.summary,
  updatedAt: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  workspaceRoot,
  briefKind: 'program',
  currentDisposition: result.state.sequence.interruptRecommendation.decision,
  currentMissionId: result.currentMissionId,
  doNowItemId: result.doNowItem?.id,
  doNextItemId: result.doNextItem?.id,
  openProgramQuestionIds: result.state.sequence.openProgramQuestions,
  openObligationCount: result.state.obligations.filter((entry) => entry.status === 'open').length,
  recommendedActionKind: result.recommendedAction?.kind,
  recommendedActionSummary: result.recommendedAction?.summary,
  interruptSummary: result.state.sequence.interruptRecommendation.summary,
  nextCommand: result.nextCommand,
});

export const buildSkoposAgentEvalBrief = ({
  workspaceRoot,
  result,
}: {
  workspaceRoot: string;
  result: Pick<SkoposEvalRunResult, 'summary' | 'eval' | 'nextCommand'>;
}): SkoposAgentEvalBriefArtifact => ({
  schemaVersion: 1,
  id: `agent-brief-eval-${result.eval.missionId}`,
  type: 'agent-brief',
  status: 'generated',
  authority: 'generated',
  summary: result.summary,
  updatedAt: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  workspaceRoot,
  briefKind: 'eval',
  missionId: result.eval.missionId,
  evaluationStatus: result.eval.evaluationStatus,
  trustLevel: result.eval.trust.trustLevel,
  readiness: result.eval.trust.readiness,
  blockingQuestionIds: result.eval.blockingQuestionIds,
  pendingItemIds: result.eval.pendingItemIds,
  failingCheckCommands: result.eval.checkRuns
    .filter((entry) => entry.status === 'fail')
    .map((entry) => entry.command),
  failingWorkflowIds: result.eval.workflowEvidence
    .filter((entry) => entry.status === 'fail')
    .map((entry) => entry.id),
  proofStatus: result.eval.proof.status,
  nextCommand: result.nextCommand,
});

export const buildSkoposAgentMissionBrief = ({
  workspaceRoot,
  mission,
  questions,
  recommendations,
  codeAllowed,
  nextItem,
}: {
  workspaceRoot: string;
  mission: SkoposMissionArtifact;
  questions: SkoposWorkflowQuestionArtifact;
  recommendations: SkoposWorkflowRecommendationArtifact;
  codeAllowed: boolean;
  nextItem?: SkoposMissionItem;
}): SkoposAgentMissionBriefArtifact => {
  const blockingQuestionIds = questions.entries
    .filter((entry) => entry.status === 'open' && entry.blocking)
    .map((entry) => entry.id);
  const pendingItemIds = mission.items
    .filter((item) => item.status !== 'complete')
    .map((item) => item.id);
  const recommendedAction = recommendations.entries.find((entry) => entry.status === 'open');

  return {
    schemaVersion: 1,
    id: `agent-brief-mission-${mission.id}`,
    type: 'agent-brief',
    status: 'generated',
    authority: 'generated',
    summary: recommendedAction?.summary ?? `Compact mission brief for ${mission.id}.`,
    updatedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    briefKind: 'mission',
    missionId: mission.id,
    missionState: mission.state,
    scopeId: mission.scope.scope.id,
    claimedByActorId: mission.coordination.claimedBy?.actorId,
    codeAllowed,
    blockingQuestionIds,
    pendingItemIds,
    completedItemCount: mission.items.filter((item) => item.status === 'complete').length,
    totalItemCount: mission.items.length,
    recommendedActionKind: recommendedAction?.actionKind,
    recommendedActionSummary: recommendedAction?.summary,
    executionSurfaceKind: recommendations.executionSurface.kind,
    nextItemId: nextItem?.id,
    nextItemTitle: nextItem?.title,
    nextCommand: recommendedAction?.command,
  };
};

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
  const workpackRule = policy.recommendedExecutionLanes.find((entry) => entry.lane === 'workpack');

  return {
    schemaVersion: 1,
    id: 'agent-brief-policy',
    type: 'agent-brief',
    status: 'generated',
    authority: 'generated',
    summary: `Accepted policy includes ${policy.acceptedPacks.length} pack${policy.acceptedPacks.length === 1 ? '' : 's'} and ${policy.activeRules.length} active rule${policy.activeRules.length === 1 ? '' : 's'} for ${policy.projectLifecycle}.`,
    updatedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    briefKind: 'policy',
    projectLifecycle: policy.projectLifecycle,
    acceptedPackIds: policy.acceptedPacks.map((entry) => entry.packId),
    activeRuleCount: policy.activeRules.length,
    mustRuleCount: policy.activeRules.filter((entry) => entry.severity === 'must').length,
    defaultExecutionLane: policy.defaultExecutionLane,
    workpackTriggers: workpackRule?.triggers ?? [],
    sourcePaths: policy.sourcePaths,
    roleMappingPath,
    mappedRoleCount,
    missingRequiredRoleCount,
  };
};

export const buildSkoposAgentPromptBrief = ({
  workspaceRoot,
  activeMissionId,
  latestHandoffPath,
  layers,
  measurements,
}: {
  workspaceRoot: string;
  activeMissionId?: string;
  latestHandoffPath?: string;
  layers: SkoposAgentPromptLayer[];
  measurements: SkoposAgentPromptBudgetMeasurement[];
}): SkoposAgentPromptBriefArtifact => {
  const defaultResumeEstimatedTokens = measurements.find((entry) => entry.id === 'resume-context')?.estimatedTokens ?? 0;
  const overBudgetIds = measurements
    .filter((entry) => entry.status === 'over-budget')
    .map((entry) => entry.id);

  return {
    schemaVersion: 1,
    id: 'agent-brief-prompt',
    type: 'agent-brief',
    status: 'generated',
    authority: 'generated',
    summary:
      overBudgetIds.length > 0
        ? `Prompt layering has ${overBudgetIds.length} budget issue${overBudgetIds.length === 1 ? '' : 's'} across the current hot path.`
        : `Prompt layering is stable with an estimated ${defaultResumeEstimatedTokens} default resume tokens across compact workflow state.`,
    updatedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    briefKind: 'prompt',
    activeMissionId,
    latestHandoffPath,
    stablePrefixSummary:
      'Keep system instructions and tool schemas host-managed, then load one compact workspace router before expanding to optional doctrine docs.',
    dynamicTailSummary: latestHandoffPath
      ? 'Load the latest handoff plus active program, mission, workflow-question, and recommendation state as the compact dynamic tail.'
      : 'Load active program, mission, workflow-question, and recommendation state as the compact dynamic tail until handoff artifacts exist.',
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
  dryRun = false,
}: WriteAgentBriefOptions<TArtifact>): Promise<WriteAgentBriefResult<TArtifact>> => {
  const write = await writeJsonArtifact({
    artifactPath,
    artifact,
    dryRun,
  });
  await refreshSkoposAgentPromptBrief({
    workspaceRoot: artifact.workspaceRoot,
    dryRun,
  });
  await refreshSkoposTokenTelemetry({
    workspaceRoot: artifact.workspaceRoot,
    dryRun,
  });

  return {
    path: artifactPath,
    write,
    artifact,
  };
};

export const resolveAgentEvalBriefArtifactPath = (workspaceRoot: string, missionId: string): string =>
  join(workspaceRoot, AGENT_EVAL_BRIEF_DIRECTORY, `${missionId}.json`);

export const resolveAgentMissionBriefArtifactPath = (workspaceRoot: string, missionId: string): string =>
  join(workspaceRoot, AGENT_MISSION_BRIEF_DIRECTORY, `${missionId}.json`);

export const refreshSkoposAgentPromptBrief = async ({
  workspaceRoot,
  dryRun = false,
}: {
  workspaceRoot: string;
  dryRun?: boolean;
}): Promise<WriteAgentBriefResult<SkoposAgentPromptBriefArtifact>> => {
  const activeMissionId = await resolveActiveMissionId(workspaceRoot);
  const latestHandoffPath = await resolveLatestHandoffPath(workspaceRoot);
  const doctrineReferences = await buildWorkspaceDoctrineReferences(workspaceRoot);
  const policyReferences = [
    await buildPromptLayerReference(workspaceRoot, {
      id: 'policy-brief',
      title: 'Policy brief',
      role: 'accepted-project-policy',
      path: POLICY_BRIEF_ARTIFACT_PATH,
      defaultIncluded: true,
      optional: true,
    }),
    await buildPromptLayerReference(workspaceRoot, {
      id: 'resolved-policy',
      title: 'Resolved policy',
      role: 'accepted-policy-source-of-truth',
      path: RESOLVED_POLICY_ARTIFACT_PATH,
      defaultIncluded: false,
      optional: true,
    }),
    await buildPromptLayerReference(workspaceRoot, {
      id: 'policy-role-mapping',
      title: 'Policy role mapping',
      role: 'accepted-local-role-map',
      path: POLICY_ROLE_MAPPING_ARTIFACT_PATH,
      defaultIncluded: true,
      optional: true,
    }),
  ];
  const policyLayerReferences = policyReferences.filter((reference) => reference.available);
  const dynamicReferences = (
    await Promise.all([
      buildPromptLayerReference(workspaceRoot, {
        id: 'program-brief',
        title: 'Program brief',
        role: 'active-program-summary',
        path: PROGRAM_BRIEF_ARTIFACT_PATH,
        defaultIncluded: true,
      }),
      activeMissionId
        ? buildPromptLayerReference(workspaceRoot, {
            id: 'mission-brief',
            title: 'Mission brief',
            role: 'active-mission-summary',
            path: relative(
              workspaceRoot,
              resolveAgentMissionBriefArtifactPath(workspaceRoot, activeMissionId),
            ),
            defaultIncluded: true,
          })
        : undefined,
      buildPromptLayerReference(workspaceRoot, {
        id: 'workflow-questions',
        title: 'Workflow questions',
        role: 'open-questions',
        path: QUESTIONS_ARTIFACT_PATH,
        defaultIncluded: true,
      }),
      buildPromptLayerReference(workspaceRoot, {
        id: 'workflow-recommendations',
        title: 'Workflow recommendations',
        role: 'next-actions',
        path: RECOMMENDATIONS_ARTIFACT_PATH,
        defaultIncluded: true,
      }),
      buildPromptLayerReference(workspaceRoot, {
        id: 'trust-brief',
        title: 'Trust brief',
        role: 'review-readiness',
        path: TRUST_BRIEF_ARTIFACT_PATH,
        defaultIncluded: false,
        optional: true,
      }),
      buildPromptLayerReference(workspaceRoot, {
        id: 'done-brief',
        title: 'Done brief',
        role: 'closure-readiness',
        path: DONE_BRIEF_ARTIFACT_PATH,
        defaultIncluded: false,
        optional: true,
      }),
      latestHandoffPath
        ? buildPromptLayerReference(workspaceRoot, {
            id: 'latest-handoff',
            title: 'Latest handoff',
            role: 'cross-thread-resume',
            path: latestHandoffPath,
            defaultIncluded: true,
            optional: true,
          })
        : undefined,
    ])
  ).filter((entry): entry is SkoposAgentPromptLayerReference => Boolean(entry));

  const layers: SkoposAgentPromptLayer[] = [
    {
      id: 'stable-system-tool-prefix',
      kind: 'stable-system-tool-prefix',
      summary: 'Keep system prompt, tool schemas, and host-managed repo instructions stable so only the dynamic tail changes frequently.',
      estimatedTokens: 0,
      references: [
        {
          id: 'host-managed-system-tools',
          title: 'Host-managed system and tool prefix',
          role: 'system-and-tooling',
          defaultIncluded: true,
          available: true,
        },
      ],
    },
    {
      id: 'stable-workspace-doctrine-prefix',
      kind: 'stable-workspace-doctrine-prefix',
      summary: 'Load one workspace router doc by default, then expand to retrieval or token-control doctrine only when the compact router is insufficient.',
      estimatedTokens: sumEstimatedTokens(doctrineReferences, true),
      references: doctrineReferences,
    },
    ...(policyLayerReferences.length > 0
      ? [
          {
            id: 'stable-project-policy-prefix',
            kind: 'stable-project-policy-prefix' as const,
            summary:
              'Load accepted project policy and lane guidance when present, without expanding full policy-pack docs on the hot path.',
            estimatedTokens: sumEstimatedTokens(policyReferences, true),
            references: policyReferences,
          },
        ]
      : []),
    {
      id: 'dynamic-execution-tail',
      kind: 'dynamic-execution-tail',
      summary: latestHandoffPath
        ? 'Use the latest handoff plus active mission, program, workflow-question, and recommendation state as the default compact execution tail.'
        : 'Use active mission, program, workflow-question, and recommendation state as the default compact execution tail until handoff artifacts exist.',
      estimatedTokens: sumEstimatedTokens(dynamicReferences, true),
      references: dynamicReferences,
    },
  ];

  const measurements: SkoposAgentPromptBudgetMeasurement[] = [
    buildBudgetMeasurement(policyReferences, 'policy-brief', 'Policy brief', TOKEN_BUDGETS.policyBrief),
    buildBudgetMeasurement(dynamicReferences, 'trust-brief', 'Trust brief', TOKEN_BUDGETS.trustBrief),
    buildBudgetMeasurement(dynamicReferences, 'done-brief', 'Done brief', TOKEN_BUDGETS.doneBrief),
    buildBudgetMeasurement(dynamicReferences, 'program-brief', 'Program brief', TOKEN_BUDGETS.programBrief),
    buildBudgetMeasurement(dynamicReferences, 'mission-brief', 'Mission brief', TOKEN_BUDGETS.missionBrief),
    buildBudgetMeasurement(dynamicReferences, 'latest-handoff', 'Latest handoff', TOKEN_BUDGETS.handoff),
    {
      id: 'resume-context',
      title: 'Default resume context',
      estimatedTokens: layers[2].estimatedTokens,
      budgetTokens: TOKEN_BUDGETS.resumeContext,
      status: layers[2].estimatedTokens > TOKEN_BUDGETS.resumeContext ? 'over-budget' : 'within-budget',
    },
  ];

  const artifact = buildSkoposAgentPromptBrief({
    workspaceRoot,
    activeMissionId,
    latestHandoffPath,
    layers,
    measurements,
  });
  const promptBriefPath = join(workspaceRoot, PROMPT_BRIEF_ARTIFACT_PATH);
  const write = await writeJsonArtifact({
    artifactPath: promptBriefPath,
    artifact,
    dryRun,
  });

  return {
    path: promptBriefPath,
    write,
    artifact,
  };
};

const countChecks = (
  checks: Array<{ status: SkoposTrustCheckStatus }>,
): { pass: number; warn: number; fail: number } =>
  checks.reduce(
    (counts, entry) => {
      counts[entry.status] += 1;
      return counts;
    },
    { pass: 0, warn: 0, fail: 0 },
  );

const extractAttentionChecks = (
  checks: Array<{ id: string; status: SkoposTrustCheckStatus; summary: string }>,
) => checks.filter((entry) => entry.status !== 'pass');

const toCommand = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return /^(skopos|pnpm|node)\b/.test(trimmed) ? trimmed : undefined;
};

const sumEstimatedTokens = (
  references: SkoposAgentPromptLayerReference[],
  defaultOnly: boolean,
): number =>
  references.reduce((total, reference) => {
    if (!reference.available) {
      return total;
    }

    if (defaultOnly && !reference.defaultIncluded) {
      return total;
    }

    return total + (reference.estimatedTokens ?? 0);
  }, 0);

const buildBudgetMeasurement = (
  references: SkoposAgentPromptLayerReference[],
  id: string,
  title: string,
  budgetTokens: number,
): SkoposAgentPromptBudgetMeasurement => {
  const reference = references.find((entry) => entry.id === id);
  if (!reference?.available) {
    return {
      id,
      title,
      path: reference?.path,
      estimatedTokens: 0,
      budgetTokens,
      status: 'missing',
    };
  }

  const estimatedTokens = reference.estimatedTokens ?? 0;
  return {
    id,
    title,
    path: reference.path,
    estimatedTokens,
    budgetTokens,
    status: estimatedTokens > budgetTokens ? 'over-budget' : 'within-budget',
  };
};

const buildPromptLayerReference = async (
  workspaceRoot: string,
  {
    id,
    title,
    role,
    path,
    defaultIncluded,
    optional,
  }: {
    id: string;
    title: string;
    role: string;
    path: string;
    defaultIncluded: boolean;
    optional?: boolean;
  },
): Promise<SkoposAgentPromptLayerReference> => {
  const absolutePath = join(workspaceRoot, path);
  const contents = await readTextIfExists(absolutePath);

  return {
    id,
    title,
    role,
    path,
    optional,
    defaultIncluded,
    available: contents !== undefined,
    estimatedTokens: contents ? estimateTokens(contents) : undefined,
  };
};

const buildWorkspaceDoctrineReferences = async (
  workspaceRoot: string,
): Promise<SkoposAgentPromptLayerReference[]> => {
  const bootstrap = await readJsonIfExists<{
    detected?: {
      docsHealth?: {
        root?: string;
        hasStartHere?: boolean;
      };
    };
  }>(join(workspaceRoot, BOOTSTRAP_ARTIFACT_PATH));
  const references = [
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

  const docsRoot = bootstrap?.detected?.docsHealth?.root;
  const hasStartHere = bootstrap?.detected?.docsHealth?.hasStartHere;
  if (docsRoot && hasStartHere) {
    references.push(
      buildPromptLayerReference(workspaceRoot, {
        id: 'docs-start-here',
        title: 'Docs router',
        role: 'workspace-docs-router',
        path: `${docsRoot}/00-start-here.md`,
        defaultIncluded: false,
        optional: true,
      }),
    );
  }

  return Promise.all(references);
};
