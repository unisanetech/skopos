import { join, resolve } from 'node:path';

import { loadSkoposActivityArtifacts } from '../../adapters/activity-artifact-loader.adapter.js';
import type {
  SkoposUiActivityViewsResult,
  SkoposUiMissionSummary,
  SkoposUiOperationalEventSummary,
  SkoposUiPlanSummary,
  SkoposUiWorkflowRunSummary,
} from '../../contracts/skopos-ui-activity-view.js';

export interface LoadSkoposUiActivityViewsOptions {
  cwd: string;
}

export const loadSkoposUiActivityViews = async ({
  cwd,
}: LoadSkoposUiActivityViewsOptions): Promise<SkoposUiActivityViewsResult> => {
  const workspaceRoot = resolve(cwd);
  const artifacts = await loadSkoposActivityArtifacts(workspaceRoot);

  return {
    workspaceRoot,
    plans: artifacts.plans
      .map((artifact) => buildPlanSummary(workspaceRoot, artifact))
      .sort(sortByUpdatedAt)
      .slice(0, 5),
    missions: artifacts.missions
      .map((artifact) => buildMissionSummary(workspaceRoot, artifact))
      .sort(sortByUpdatedAt)
      .slice(0, 5),
    workflowRuns: artifacts.workflowRuns
      .map((artifact) => buildWorkflowRunSummary(workspaceRoot, artifact))
      .sort(sortByUpdatedAt)
      .slice(0, 8),
    operationalEvents: artifacts.operationalLog
      .map((artifact) => buildOperationalEventSummary(artifact))
      .sort(sortByTimestamp)
      .slice(0, 8),
  };
};

const buildPlanSummary = (
  workspaceRoot: string,
  artifact: Parameters<typeof sortByUpdatedAt>[0] & {
    id: string;
    title?: string;
    goal?: string;
    summary?: string;
    createdByActorId?: string;
    parentMissionId?: string;
    scope?: { scope?: { id?: string } };
    confidence?: string;
  },
): SkoposUiPlanSummary => ({
  id: artifact.id,
  title: artifact.title ?? artifact.goal ?? artifact.id,
  goal: artifact.goal ?? artifact.title ?? artifact.id,
  summary: artifact.summary ?? artifact.goal ?? artifact.title ?? 'Plan artifact.',
  parentMissionId: artifact.parentMissionId,
  scopeId: artifact.scope?.scope?.id ?? 'workspace',
  confidence: artifact.confidence ?? 'unknown',
  createdByActorId: artifact.createdByActorId,
  updatedAt: artifact.updatedAt,
  artifactPath: join(workspaceRoot, '.skopos', 'plans', `${artifact.id}.json`),
});

const buildMissionSummary = (
  workspaceRoot: string,
  artifact: Parameters<typeof sortByUpdatedAt>[0] & {
    id: string;
    title?: string;
    summary?: string;
    objective?: string;
    parentMissionId?: string;
    state: 'planned' | 'active' | 'blocked' | 'complete';
    scope?: { scope?: { id?: string } };
    items: Array<{ status: 'pending' | 'complete' }>;
    linkedSlices?: Array<unknown>;
    recommendedWorkflowIds?: string[];
    coordination?: {
      claimedBy?: { actorId: string };
      lastUpdatedBy?: string;
    };
  },
): SkoposUiMissionSummary => ({
  id: artifact.id,
  title: artifact.title ?? artifact.summary ?? artifact.objective ?? artifact.id,
  summary: artifact.summary ?? artifact.objective ?? artifact.title ?? 'Mission artifact.',
  parentMissionId: artifact.parentMissionId,
  state: artifact.state,
  scopeId: artifact.scope?.scope?.id ?? 'workspace',
  pendingItemCount: artifact.items.filter((item) => item.status !== 'complete').length,
  linkedSliceCount: artifact.linkedSlices?.length ?? 0,
  recommendedWorkflowIds: artifact.recommendedWorkflowIds ?? [],
  claimedByActorId: artifact.coordination?.claimedBy?.actorId,
  lastUpdatedByActorId: artifact.coordination?.lastUpdatedBy,
  updatedAt: artifact.updatedAt,
  artifactPath: join(workspaceRoot, '.skopos', 'missions', `${artifact.id}.json`),
});

const buildWorkflowRunSummary = (
  workspaceRoot: string,
  artifact: Parameters<typeof sortByUpdatedAt>[0] & {
    id: string;
    workflowId: string;
    workflowTitle: string;
    runStatus: SkoposUiWorkflowRunSummary['runStatus'];
    outputPaths: string[];
    runByActorId?: string;
    finishedAt?: string;
  },
): SkoposUiWorkflowRunSummary => ({
  id: artifact.id,
  workflowId: artifact.workflowId,
  workflowTitle: artifact.workflowTitle,
  runStatus: artifact.runStatus,
  outputPaths: artifact.outputPaths,
  runByActorId: artifact.runByActorId,
  finishedAt: artifact.finishedAt,
  artifactPath: join(workspaceRoot, '.skopos', 'runs', `${artifact.id}.json`),
});

const buildOperationalEventSummary = (
  artifact: Parameters<typeof sortByTimestamp>[0] & {
    id: string;
    eventKind: string;
    status: 'succeeded' | 'failed' | 'dry-run';
    summary: string;
    metadata?: Record<string, string | number | boolean | null>;
    timestamp: string;
  },
): SkoposUiOperationalEventSummary => ({
  id: artifact.id,
  eventKind: artifact.eventKind as SkoposUiOperationalEventSummary['eventKind'],
  status: artifact.status,
  summary: artifact.summary,
  actorId:
    typeof artifact.metadata?.actorId === 'string' ? artifact.metadata.actorId : undefined,
  timestamp: artifact.timestamp,
});

const sortByUpdatedAt = <T extends { updatedAt?: string; finishedAt?: string }>(
  left: T,
  right: T,
): number => {
  const leftValue = Date.parse(left.updatedAt ?? left.finishedAt ?? '') || 0;
  const rightValue = Date.parse(right.updatedAt ?? right.finishedAt ?? '') || 0;
  return rightValue - leftValue;
};

const sortByTimestamp = <T extends { timestamp: string }>(left: T, right: T): number => {
  const leftValue = Date.parse(left.timestamp) || 0;
  const rightValue = Date.parse(right.timestamp) || 0;
  return rightValue - leftValue;
};
