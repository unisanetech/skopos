import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposTaskIdentity } from './skopos-task-identity.js';

export type SkoposWorkflowRecommendationPriority = 'high' | 'medium' | 'low';
export type SkoposWorkflowRecommendationStatus = 'open' | 'completed' | 'dismissed';
export type SkoposWorkflowRecommendationActionKind =
  | 'resolve-question'
  | 'claim-mission'
  | 'complete-mission'
  | 'implement'
  | 'run-workflow'
  | 'run-eval'
  | 'run-check';
export type SkoposWorkflowExecutionSurfaceKind =
  | 'artifact-only'
  | 'artifact-plus-workpack-doc';

export interface SkoposWorkflowExecutionSurfaceRecommendation {
  kind: SkoposWorkflowExecutionSurfaceKind;
  summary: string;
  reason: string;
  signals: string[];
}

export interface SkoposWorkflowRecommendationEntry {
  id: string;
  title: string;
  summary: string;
  priority: SkoposWorkflowRecommendationPriority;
  reason: string;
  actionKind: SkoposWorkflowRecommendationActionKind;
  command?: string;
  linkedQuestionId?: string;
  linkedPlanId?: string;
  linkedMissionId?: string;
  blocking: boolean;
  status: SkoposWorkflowRecommendationStatus;
}

export interface SkoposWorkflowRecommendationArtifact
  extends SkoposArtifactEnvelope<'recommendations'> {
  workspaceRoot: string;
  taskIdentity?: SkoposTaskIdentity;
  generatedForPlanId?: string;
  generatedForMissionId?: string;
  executionSurface: SkoposWorkflowExecutionSurfaceRecommendation;
  entries: SkoposWorkflowRecommendationEntry[];
}
