import type {
  SkoposActionRunStatus,
  SkoposOperationalLogEventKind,
  SkoposOperationalLogStatus,
  SkoposTaskState,
} from '@skopos/model';

export interface SkoposUiPlanSummary {
  id: string;
  title: string;
  goal: string;
  summary: string;
  parentPlanId?: string;
  scopeId: string;
  confidence: string;
  createdByActorId?: string;
  updatedAt?: string;
  artifactPath: string;
}

export interface SkoposUiTaskSummary {
  id: string;
  title: string;
  summary: string;
  parentTaskId?: string;
  state: SkoposTaskState;
  scopeId: string;
  pendingStepCount: number;
  childTaskCount: number;
  selectedActionIds: string[];
  claimedByActorId?: string;
  lastUpdatedByActorId?: string;
  updatedAt?: string;
  artifactPath: string;
}

export interface SkoposUiActionRunSummary {
  id: string;
  actionId: string;
  actionTitle: string;
  runStatus: SkoposActionRunStatus;
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

export interface SkoposUiActivityViewsResult {
  workspaceRoot: string;
  plans: SkoposUiPlanSummary[];
  tasks: SkoposUiTaskSummary[];
  actionRuns: SkoposUiActionRunSummary[];
  operationalEvents: SkoposUiOperationalEventSummary[];
}
