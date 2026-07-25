import type { SkoposEvalArtifact } from './skopos-eval.js';
import type { SkoposMissionArtifact } from './skopos-plan.js';
import type { SkoposImpactReport } from './skopos-impact-report.js';
import type { SkoposTrustCheck, SkoposTrustReport } from './skopos-trust-report.js';
import type { SkoposWorkflowRequirementEvidence } from './skopos-workflow.js';

export type SkoposClosureStatus = 'complete' | 'needs-review' | 'blocked';

export interface SkoposMissionClosureEvidence {
  mission: Pick<SkoposMissionArtifact, 'id' | 'title' | 'state'>;
  pendingItemIds: string[];
  claimedByActorId?: string;
  requestedActorId?: string;
}

export interface SkoposWorkflowQuestionClosureEvidence {
  openQuestionIds: string[];
  blockingQuestionIds: string[];
  advisoryQuestionIds: string[];
}

export interface SkoposMissionEvalClosureEvidence {
  missionId: string;
  evaluationStatus?: SkoposEvalArtifact['evaluationStatus'];
  executionPhase?: SkoposEvalArtifact['executionPhase'];
  evalPath?: string;
  blockingQuestionIds: string[];
  pendingItemIds: string[];
}

export interface SkoposDoneReport {
  workspaceRoot: string;
  closureStatus: SkoposClosureStatus;
  summary: string;
  checks: SkoposTrustCheck[];
  requiredActions: string[];
  impact: SkoposImpactReport;
  trust: SkoposTrustReport;
  missionEvidence?: SkoposMissionClosureEvidence;
  workflowQuestions?: SkoposWorkflowQuestionClosureEvidence;
  missionEval?: SkoposMissionEvalClosureEvidence;
  workflowEvidence: SkoposWorkflowRequirementEvidence[];
}
