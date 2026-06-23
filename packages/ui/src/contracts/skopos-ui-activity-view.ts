import type { SkoposTrustCheckStatus, SkoposWorkflowRunStatus } from '@skopos/model';
import type {
  SkoposOperationalLogEventKind,
  SkoposOperationalLogStatus,
} from '@skopos/model';

export interface SkoposUiPlanSummary {
  id: string;
  title: string;
  goal: string;
  summary: string;
  parentMissionId?: string;
  scopeId: string;
  confidence: string;
  createdByActorId?: string;
  updatedAt?: string;
  artifactPath: string;
}

export interface SkoposUiMissionSummary {
  id: string;
  title: string;
  summary: string;
  parentMissionId?: string;
  state: 'planned' | 'active' | 'blocked' | 'complete';
  scopeId: string;
  pendingItemCount: number;
  linkedSliceCount: number;
  recommendedWorkflowIds: string[];
  claimedByActorId?: string;
  lastUpdatedByActorId?: string;
  updatedAt?: string;
  artifactPath: string;
}

export interface SkoposUiWorkflowRunSummary {
  id: string;
  workflowId: string;
  workflowTitle: string;
  runStatus: SkoposWorkflowRunStatus;
  outputPaths: string[];
  runByActorId?: string;
  finishedAt?: string;
  artifactPath: string;
}

export interface SkoposUiOperationalEventSummary {
  id: string;
  eventKind: SkoposOperationalLogEventKind;
  status: SkoposOperationalLogStatus;
  summary: string;
  actorId?: string;
  timestamp: string;
}

export interface SkoposUiTrustSnapshot {
  trustLevel: string;
  readiness: string;
  summary: string;
  checks: Array<{
    id: string;
    status: SkoposTrustCheckStatus;
    summary: string;
  }>;
  unresolvedAssumptions: string[];
  findings: string[];
}

export interface SkoposUiActivityViewsResult {
  workspaceRoot: string;
  plans: SkoposUiPlanSummary[];
  missions: SkoposUiMissionSummary[];
  workflowRuns: SkoposUiWorkflowRunSummary[];
  operationalEvents: SkoposUiOperationalEventSummary[];
}
