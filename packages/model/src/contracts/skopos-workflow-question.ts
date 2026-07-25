import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type {
  SkoposDecisionEscalationClass,
  SkoposDecisionOption,
} from './skopos-decision-question.js';
import type { SkoposTaskIdentity } from './skopos-task-identity.js';

export type SkoposWorkflowQuestionStatus = 'open' | 'resolved';

export interface SkoposWorkflowQuestionEntry {
  id: string;
  title: string;
  question: string;
  category: string;
  escalation: SkoposDecisionEscalationClass;
  blocking: boolean;
  recommendedOptionId: string;
  resolvedOptionId?: string;
  options: SkoposDecisionOption[];
  whyItMatters: string;
  whatHappensAfterAnswer: string;
  linkedPlanId?: string;
  linkedMissionId?: string;
  evidenceRefs: string[];
  status: SkoposWorkflowQuestionStatus;
  resolvedAt?: string;
  resolvedByActorId?: string;
}

export interface SkoposWorkflowQuestionArtifact extends SkoposArtifactEnvelope<'questions'> {
  workspaceRoot: string;
  taskIdentity?: SkoposTaskIdentity;
  generatedForPlanId?: string;
  generatedForMissionId?: string;
  entries: SkoposWorkflowQuestionEntry[];
}
